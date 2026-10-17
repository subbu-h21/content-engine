"""Stems for Remotion: public/audio/voice.wav (peak-normalised), public/audio/music.wav (cut to length),
and src/data/duck.json (per-video-frame music gain while the voice speaks; Remotion rescales it to the Props duck depth)."""
import json

import numpy as np

from audio_io import SR, duck_env, read, write


def run(p):
    timing = p.timing()
    total = int(timing["total"] * SR)
    mix = p.manifest["mix"]
    out = p.public / "audio"
    out.mkdir(parents=True, exist_ok=True)

    vo = read(p.audio / "vo_full.wav")[:total]
    vo = np.pad(vo, ((0, total - len(vo)), (0, 0)))
    vo *= mix["voicePeak"] / (np.abs(vo).max() + 1e-9)
    write(out / "voice.wav", vo)
    p.manifest["stems"]["voice"] = "audio/voice.wav"

    if (p.audio / "music.wav").exists():
        music = read(p.audio / "music.wav")[:total]
        music = np.pad(music, ((0, total - len(music)), (0, 0)))
        write(out / "music.wav", music)
        p.manifest["stems"]["music"] = "audio/music.wav"
    else:
        print("no audio/music.wav: video will have no music (run the music step)")
        p.manifest["stems"]["music"] = None

    fps = p.fps
    env = duck_env(vo, total, mix["duckDb"])[:, 0]
    per_frame = [round(float(env[min(total - 1, int(i * SR / fps))]), 4) for i in range(int(round(timing["total"] * fps)) + 1)]
    (p.data / "duck.json").write_text(json.dumps({"fps": fps, "duckDb": mix["duckDb"], "gain": per_frame}))
    p.save_manifest()
    print("stems -> public/audio/voice.wav, music.wav, src/data/duck.json")
