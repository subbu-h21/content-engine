# Content engine

One place to make explainer videos: brief → script → voice and music → Blender plates → Remotion 2D layer → render.
Each video is a numbered folder in a workspace you choose (`project-4-<slug>`, `project-5-<slug>`, …) and every file
that video needs lives in that folder.

Status: **Phase 1** (engine core, template, pipeline, CLI). The web app (create page, editor with Claude, render queue)
comes in Phases 2–4 and will call the same code as the `ce` command.

## Commands

```
ce settings workspace D:\code_files\animations   # where video projects live (currently set)
ce new <slug> --title "..."        # project-<N>-<slug> from the template: packages linked, git repo, ready for Studio
ce list                            # projects in the workspace
ce link [project]                  # create/repair node_modules links (all projects if none given)
ce pipeline <project> <step>       # vo | music | stems | sfx | plates | captions | audio  (see pipeline/run.py)
ce blender <project> <shot>.py <args>   # run a shot script from the project's blender/ folder headless
ce doctor                          # check node, python packages, ffmpeg, Blender, disk, project links
```

`ce` is `ce.cmd` in this folder (add the folder to PATH, or call it by full path). `<project>` is a path, a folder
name in the workspace, or a project number.

## Layout

| Folder | What |
|---|---|
| `runtime/` | The npm packages every project uses (Remotion 4.0.535, React 19, zod 4), installed once. Each project's `node_modules` is a Windows junction to `runtime/node_modules`. Versions are pinned: changing one changes how every project renders. |
| `template/` | What a new project starts as: the generic Remotion layer (`src/components`, `src/lib`), an example scene, `project.json`, `script.json`, `sfx.json`, README and CLAUDE.md for the project. |
| `pipeline/` | Python steps that read a project's `project.json` / `script.json` / `sfx.json` and write into it: OpenRouter voice (verbatim-checked) and Lyria music, stems and music ducking, procedural sound effects, plate bloom + encode, captions. |
| `library/blender/` | Reusable Blender builders (brain, phone) with their assets. A project copies what it uses into `blender/lib/`. |
| `cli/` | `ce.mjs` (commands) and `projects.mjs` (create/list/link projects; the web app will reuse it). |
| `migrations/phone-reel/` | Turns the existing reel (project-3-development + project-2-expt/reel) into an engine project. |

## Rules the design follows

- **Packages are shared, creative code is copied.** Heavy tools (npm packages, Python, Blender, ffmpeg) are installed
  once. Code that decides how a video looks (components, Blender builders) is copied into the project when it is
  created, so improving the engine never changes a finished video.
- **Generated assets stay in the project.** Voice lines, music, stems, plates and data are written into the project;
  regenerating is always an explicit pipeline step.
- **Timing is the spine.** `script.json` → `vo` → `src/data/timing.json`; scenes, sound effects and Blender shots key
  to cue times, so re-recording a line moves everything with it.
- **Paid calls only for missing files.** `vo` records only lines without a WAV; `music` only runs when there is no
  `audio/music.mp3`.

## Requirements (checked by `ce doctor`)

Node 20, Python 3.12 with numpy, scipy, pillow; ffmpeg on PATH; Blender 5.1. OpenRouter key in a `.env` above the
project (the workspace `D:\code_files\animations\.env` has one) as `OPENROUTER_API_KEY=...`.

## Verified (2026-10-17)

The phone reel rebuilt as an engine project (`migrations/phone-reel`), compared with the original project-3-development:

- Full-length render (1671 frames + audio): all 4935 decoded video and audio packets identical (framemd5).
- Guides overlay (all guides on) at 6 frames incl. the phone→brain plate cut: identical.
- Pipeline outputs regenerated from scratch, byte-identical: timing.json, vo_full.wav, voice/music stems, duck.json,
  sfx_events.json + all 9 effect WAVs, captions, music mp3→wav, phone and brain plates (final and draft).
- Blender: `markers.json` from the brain shot byte-identical; one final frame each of the brain and phone shots
  pixel-identical (PSNR ∞) to the original final renders. (The old draft frames came from an earlier script version.)
- Studio starts and compiles; a fresh `ce new` project typechecks and renders; `npm install` inside a project removes
  only its link (shared packages intact) and `ce link` restores it.

Not exercised: paid voice/music generation (same code paths, adapted), full Blender renders (hours), saving Props from
Studio's panel (needs a browser).
