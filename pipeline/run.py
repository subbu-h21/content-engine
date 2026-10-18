"""Content engine pipeline. Every step reads the project's project.json / script.json / sfx.json and writes into the project.

  python run.py <project> vo [--no-synth]        voice lines (paid, only missing ones) -> timing.json, audio/vo_full.wav
  python run.py <project> vo --estimate          timing from word counts (free, no audio) for building before recording
  python run.py <project> vo --sample "<text>"   one line in the current voice -> audio/voice_sample.wav (about $0.003)
  python run.py <project> music [--no-generate]  Lyria track (paid, only if audio/music.mp3 is missing) -> audio/music.wav
  python run.py <project> stems                  public/audio/voice.wav, music.wav, src/data/duck.json
  python run.py <project> sfx                    public/audio/sfx/*.wav, src/data/sfx_events.json
  python run.py <project> plates [--only id] [--quality final|draft]   bloom + encode Blender frames
  python run.py <project> plates --from draft    preview plates from the quick 25 % Blender frames (renders/<id>/draft)
  python run.py <project> captions               out/<slug>.srt
  python run.py <project> refs [--no-transcript] [--only <file>]   study material for references/ (stills, cuts, palette, transcript)
  python run.py <project> audio                  vo --no-synth, stems, sfx, captions (free; after re-timing)

Usually called through `ce pipeline <project> <step>`.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from proj import Project  # noqa: E402


def opt(args, name):
    if name in args:
        i = args.index(name)
        return args[i + 1] if i + 1 < len(args) else None
    return None


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 1
    p, step, args = Project(argv[0]), argv[1], argv[2:]
    if step == "vo":
        import vo
        if "--estimate" in args:
            vo.estimate(p)
        elif "--sample" in args:
            vo.sample(p, opt(args, "--sample") or "This is how the narration will sound.")
        else:
            vo.run(p, synth="--no-synth" not in args)
    elif step == "music":
        import music
        music.run(p, generate="--no-generate" not in args)
    elif step == "stems":
        import stems
        stems.run(p)
    elif step == "sfx":
        import sfx
        sfx.run(p)
    elif step == "plates":
        import plates
        plates.run(p, only=opt(args, "--only"), quality=opt(args, "--quality"), source=opt(args, "--from") or "final")
    elif step == "refs":
        import refs
        refs.run(p, transcript="--no-transcript" not in args, only=opt(args, "--only"))
    elif step == "captions":
        import captions
        captions.run(p)
    elif step == "audio":
        import captions
        import sfx
        import stems
        import vo
        vo.run(p, synth=False)
        stems.run(p)
        sfx.run(p)
        captions.run(p)
    else:
        print(f"unknown step {step!r}\n{__doc__}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
