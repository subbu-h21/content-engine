"""Captions: out/<slug>.srt from script.json + timing.json (one caption per cue, held 0.15 s past the line)."""


def ts(x):
    h, r = divmod(x, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"


def run(p):
    sc = p.timing()["scenes"]
    out, k = [], 1
    for scene, cues in p.scenes():
        st = sc[scene]["start"]
        for cue, text, _ in cues:
            c = sc[scene]["cues"][cue]
            out.append(f"{k}\n{ts(st + c['start'])} --> {ts(st + c['end'] + 0.15)}\n{text}\n")
            k += 1
    d = p.root / "out"
    d.mkdir(exist_ok=True)
    f = d / f"{p.manifest['slug']}.srt"
    f.write_text("\n".join(out), encoding="utf-8")
    print(f"captions -> out/{f.name}")
