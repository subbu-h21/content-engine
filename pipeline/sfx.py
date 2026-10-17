"""Sound effects: sfx.json (events relative to narration cues) -> src/data/sfx_events.json (absolute times)
and one WAV per kind in public/audio/sfx/. Kinds come from sfx_lib.py (procedural, deterministic).

sfx.json:
  {"events": [{"scene": "s03_cue", "cue": "response", "offset": -0.1, "kind": "sweep_low", "gain": 0.6},
              {"scene": "s02_boredom", "offset": 0.2, "kind": "hum_in", "gain": 0.9}],      # no cue = scene start
   "sceneTransitions": {"offset": -0.1, "kind": "swish", "gain": 0.3}}                     # every scene but the first
Re-run after re-timing the voice-over; the events follow their cues.
"""
import json

import sfx_lib
from audio_io import write


def events(p):
    sc = p.timing()["scenes"]
    out = []
    for e in p.sfx.get("events", []):
        s = sc[e["scene"]]
        base = s["start"] + s["cues"][e["cue"]]["start"] if e.get("cue") else s["start"]
        out.append((base + e.get("offset", 0.0), e["kind"], e.get("gain", 1.0)))
    tr = p.sfx.get("sceneTransitions")
    if tr:
        for name in list(sc)[1:]:
            out.append((sc[name]["start"] + tr.get("offset", 0.0), tr["kind"], tr.get("gain", 1.0)))
    return out


def run(p):
    ev = events(p)
    unknown = sorted({k for _, k, _ in ev if k not in sfx_lib.KINDS})
    if unknown:
        raise SystemExit(f"unknown sfx kinds: {unknown}; available: {sorted(sfx_lib.KINDS)}")
    d = p.public / "audio" / "sfx"
    d.mkdir(parents=True, exist_ok=True)
    kinds = sorted({k for _, k, _ in ev})
    for k in kinds:
        write(d / f"{k}.wav", sfx_lib.get(k))
    rows = [{"t": round(t, 3), "kind": k, "gain": g, "lead": sfx_lib.LEAD.get(k, 0.0)} for t, k, g in ev]
    (p.data / "sfx_events.json").write_text(json.dumps(rows, indent=1))
    print(f"sfx: {len(kinds)} kinds, {len(rows)} events -> public/audio/sfx, src/data/sfx_events.json")
