"""Voice-over: one WAV per script cue (audio/vo/<scene>__<cue>.wav), silence-trimmed, then the timeline.

Only cues whose WAV is missing are synthesised (paid API call), so re-recording a line = delete its WAV and re-run.
Writes src/data/timing.json (every animation keys to these cue times) and audio/vo_full.wav (the voice track).
Timing rules: each scene starts with `leadIn` of silence, cues are separated by `gap` plus the cue's own `pause`,
and each scene ends with `tail`.
"""
import json
from concurrent.futures import ThreadPoolExecutor

import numpy as np

from audio_io import read_mono, write_mono
from or_audio import api_key, tts

SR = 48000


def trim(a, sr, thresh_db=-42, pad=0.06):
    win = int(sr * 0.01)
    n = len(a) // win
    rms = np.sqrt(np.mean(a[:n * win].reshape(n, win) ** 2, axis=1) + 1e-12)
    loud = np.where(20 * np.log10(rms) > thresh_db)[0]
    if len(loud) == 0:
        return a
    s = max(0, loud[0] * win - int(pad * sr))
    e = min(len(a), (loud[-1] + 1) * win + int(pad * sr))
    out = a[s:e].copy()
    f = int(0.01 * sr)
    out[:f] *= np.linspace(0, 1, f)
    out[-f:] *= np.linspace(1, 0, f)
    return out


def run(p, synth=True):
    vo_dir = p.audio / "vo"
    vo_dir.mkdir(parents=True, exist_ok=True)
    v = p.manifest["voice"]
    jobs = [(s, c, t) for s, cues in p.scenes() for c, t, _ in cues if not (vo_dir / f"{s}__{c}.wav").exists()]
    if jobs and not synth:
        raise SystemExit("missing voice lines (run without --no-synth to record them): " + ", ".join(f"{s}/{c}" for s, c, _ in jobs))
    if jobs:
        key = api_key(p.root)

        def one(job):
            scene, cue, text = job
            raw = vo_dir / f"{scene}__{cue}.raw.wav"
            tts(text, raw, voice=v["voice"], style=v["style"], model=v["model"], fallback_model=v["fallbackModel"], key=key)
            a, sr = read_mono(raw)
            write_mono(vo_dir / f"{scene}__{cue}.wav", trim(a, sr), sr)
            raw.unlink()
            print(f"recorded {scene}/{cue}", flush=True)

        with ThreadPoolExecutor(4) as ex:
            list(ex.map(one, jobs))

    lead_in, gap, tail = v["leadIn"], v["gap"], v["tail"]
    timing, track, tg = {}, [], 0.0
    for scene, cues in p.scenes():
        t, cue_t = lead_in, {}
        for i, (cue, _, pause) in enumerate(cues):
            a, sr = read_mono(vo_dir / f"{scene}__{cue}.wav")
            d = len(a) / sr
            cue_t[cue] = {"start": round(t, 3), "end": round(t + d, 3)}
            track.append((tg + t, a, sr))
            t += d + pause + (gap if i < len(cues) - 1 else 0)
        dur = t + tail
        timing[scene] = {"start": round(tg, 3), "duration": round(dur, 3), "cues": cue_t}
        tg += dur
    full = np.zeros(int(tg * SR) + SR)
    for start, a, sr in track:
        up = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a)
        i = int(start * SR)
        full[i:i + len(up)] += up
    write_mono(p.audio / "vo_full.wav", full, SR)
    p.data.mkdir(parents=True, exist_ok=True)
    (p.data / "timing.json").write_text(json.dumps({"total": round(tg, 3), "fps": p.fps, "scenes": timing}, indent=1))
    print(f"timing: {tg:.2f}s, {len(timing)} scenes, {len(track)} cues -> src/data/timing.json, audio/vo_full.wav")
