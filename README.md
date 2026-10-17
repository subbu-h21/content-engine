# Content engine

One place to make explainer videos: brief → script → voice and music → Blender plates → Remotion 2D layer → render.
Each video is a numbered folder in a workspace you choose (`project-4-<slug>`, `project-5-<slug>`, …) and every file
that video needs lives in that folder.

Status: **Phase 2** done (website with editor + Claude). Next: Phase 3 (create page: script, music, style, uploads),
Phase 4 (render queue).

## The website

```
ce app            # starts http://127.0.0.1:4100 and opens it; Ctrl+C stops it (and the Studios/terminals it started)
```

- **Home**: the workspace, *New video* (creates the next `project-N-<slug>` and opens it), the list of videos.
- **Editor** (`/p/<project>`): the project's Remotion Studio (started on a free port from 3200), the project's Claude Code
  in a terminal on the right, and a strip under Studio showing what Claude is told about your position.
- **How Claude knows "this"**: the template's `EngineBridge` (inside the video, active only in a Studio the engine
  started) reports composition, playhead and props to the engine. Opening a project writes two git-ignored files into it:
  `.mcp.json` (the engine's MCP tools for that project) and `.claude/settings.local.json` (approves them and adds a
  `UserPromptSubmit` hook, `app/server/hook.mjs`, that prefixes each message with time, scene, narration line and the
  headlines on screen). Works the same when Claude Code runs in VS Code instead of the website, as long as the website
  has the project open.
- **Claude's tools** (MCP `content-engine`): `editor_state`, `timeline`, `view_frame` (renders the frame as an image,
  ~20 s), `seek`, `playback`, `show_setting` (opens Studio's props editor at a path).
- **Safety**: the server listens on 127.0.0.1 only, rejects foreign `Host` headers (DNS rebinding) and foreign `Origin`s;
  the terminal socket only accepts the engine's own page.
- First time in a project, Claude Code asks once whether you trust the folder: choose *Yes*.

## Commands

```
ce app [--no-open]                 # the website (see above)
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
| `cli/` | `ce.mjs` (commands) and `projects.mjs` (create/list/link projects; the website reuses it). |
| `app/` | The website: `server/` (Express API, MCP endpoint, Studio and terminal management, bridge, hook), `web/` (React page, built with esbuild into `dist/`: `npm run build`). Own packages, separate from `runtime/`. |
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

Not exercised: paid voice/music generation (same code paths, adapted), full Blender renders (hours).

Props saving from Studio (2026-10-17): verified with a real save through Studio's `/api/update-default-props`; it only
works because `defaultProps` is an inline literal in `<Composition id="Reel">` (see template/src/Root.tsx).

## Verified, Phase 2 (2026-10-18)

With project-4-phone-reel, Studio loaded in headless Chrome (Remotion's chrome-headless-shell):
- the bridge reports composition/frame/props (no page errors); renders with the bridge are still identical to project-3
- MCP: all six tools listed; `seek` to 0:41 moved Studio's playhead (frame 984); `show_setting` scrolled the props
  editor to `scenes.s03.cueLabel.text`; `view_frame` returned the right frame (40 KB JPEG, ~19 s)
- the hook prints the right context; real Claude Code (`claude -p`, read-only) parked at 0:41 answered
  `scenes.s05.loop.lines` in one turn
- the editor page shows Studio and a live Claude Code terminal; `ce app` starts and stopping it leaves no processes
- security: foreign Origin → 403, foreign Host → 403, terminal socket from a foreign origin → 403

Not exercised: a person using the editor page by hand (typing in the terminal, dragging the divider); Ctrl+C shutdown
(the handlers exist; the tests stopped the process tree directly).
