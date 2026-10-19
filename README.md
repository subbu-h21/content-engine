# Content engine

One place to make explainer videos: brief → script → voice and music → Blender plates → Remotion 2D layer → render.
Each video is a numbered folder in a workspace you choose (`project-4-<slug>`, `project-5-<slug>`, …) and every file
that video needs lives in that folder.

Status: **Phase 5** done (publishing). Version zero is complete end to end: brief → preview → edit → final → publish.

## The website

```
ce app            # starts http://127.0.0.1:4100 and opens it; Ctrl+C stops it (and the Studios/terminals it started)
```

- **Home**: the workspace; **What do you want to create today?** (free text, saved as `brief/request.md`) with an
  optional dropper for inspiration, reference or skill files (uploaded into the new project before its Brief opens);
  Create makes the next `project-N-<slug>` and opens its Brief, where Claude starts from that request. The list of
  videos shows each one's stage, with **Delete**: a warning shows the folder, its size and whether it has a finished
  video or Blender renders, and asks for the video's number; the folder then goes to the Windows Recycle Bin
  (its Studio and Claude panel are stopped first, the node_modules link removed so shared packages are never touched).
  A reusable style library (choose a look from a catalog) is planned.
- **Brief** (`/p/<project>/brief`): Claude (same panel as the editor, one conversation) runs the project's
  `make-video` skill: asks what you want to make, talks through idea, script, look, sound and 3D, and writes each decision
  into the project's files, which the board on the left shows live (`brief/status.json`, `brief.md`, `script.json`,
  `style.md`, `brief/frames/`, `project.json` voice/music, `plan.md`). One checkpoint: Claude shows the script and 2–3
  style frames and waits for **Approve and build** (nothing paid or slow before it), then records the voice, makes
  music, builds the scenes and quick 3D drafts, and the Editor opens with the preview.
- **References**: drop files on the board or paste a YouTube/Instagram link (`yt-dlp`). `ce pipeline <p> refs` turns
  each into study material in `references/_study/<file>/` (stills, contact sheet, cuts, palette, Whisper transcript;
  the Whisper model is downloaded once into `models/`). A dropped `.md` with a `name:` front matter becomes a skill of
  that project (`.claude/skills/<name>/`).
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

## Final render (Phase 4)

The **Final** tab of a video (`/p/<project>/final`) shows what a final render involves before it starts: the 3D plates
and how many final frames each still needs, a time and disk estimate, and anything that blocks it (narration not
recorded, placeholder script, a missing shot script, Blender not found, not enough disk, broken package link). Start
puts it in the engine's queue (`app/server/render.mjs`), one heavy job at a time:

| Step | What | Resumes / retries |
|---|---|---|
| audio | `pipeline audio`: timing, stems, effects, captions from the recorded lines | retried once; missing voice lines stop it (recording costs money) |
| blender:&lt;plate&gt; | only the missing final frames, 200 per call, via the plate's shot script `final f0 f1` | finished frames kept; half-written frames (no PNG end marker) redone; a chunk that fails twice stops the step; waits while another Blender uses the GPU |
| plates | `pipeline plates`: bloom + encode from the final frames | retried once |
| render | Remotion render of `Reel` with `props/final.json` → temp file → `out/video.mp4` | retried once; a locked output says "close the player, then Resume" |
| deliver | loudness-levelled `out/delivery.mp4`, checked for length and sound | retried once |

- **State** is in the project: `out/render/job.json`, logs in `out/render/logs/<step>.log`. Stop keeps everything;
  Resume continues at the first unfinished step/frame. If the engine stops (Ctrl+C, crash, PC restart), the job comes
  back as *interrupted* on the next start.
- **3D frames out of date**: each plate's final folder has `.ce-final.json` with a fingerprint of the shot script,
  `blender/lib`, `blender/assets`, the timing and the plate. If it changed, the plan flags the plate and the step
  refuses to mix old and new frames until "re-render" is ticked (which deletes the old frames).
- **Fallback to Claude**: when a step still fails after its retry, the engine hands the error and log path to the
  video's Claude panel (starting it if needed) — at most twice per render, and only if the job allows it (a checkbox,
  on by default). The message is only typed when the panel is at its prompt; if it's showing a question (trust, a
  startup choice, a permission prompt) the engine waits up to 15 minutes for the user to answer it, and never answers
  for them. Until Claude is told, the failure is also added to the user's next message (prompt hook). Claude has
  `render_status`, `render_start`, `render_resume`, `render_stop` tools; the `make-video` skill says how to fix and
  resume, and what to ask the user first (anything costing money, re-rendering existing 3D, script or look changes).
- Board buttons (Approve, Ask Claude) use the same rule: nothing is typed into a panel that's showing a question.
- `CE_RENDER_NO_GPU_WAIT=1` (tests) skips waiting for other Blender processes.
- Shot script contract (also in the skill): `final <f0> <f1>` renders plate-local frames f0..f1 (1-based) at full
  resolution into `renders/<id>/final/f_####.png`; the plate has `round(duration × fps) + 1` frames; frames without 3D
  still need a file. A plate entry may name its script with `"shot"` (default `blender/shot_<id>.py`).

## Publish (Phase 5)

The **Publish** tab (`/p/<project>/publish`) posts `out/delivery.mp4`:

- **YouTube, through the YouTube Data API** (`app/server/youtube.mjs`). One-time setup on the home page under
  *Connected accounts*: a Google Cloud project with the YouTube Data API v3, a **Desktop app** OAuth client (its JSON
  file is added on the page), the Google Auth Platform app published to *In production* (in *Testing* the sign-in
  expires every 7 days). Sign-in uses PKCE and a loopback redirect to the engine (`http://127.0.0.1:<port>/`); scopes
  `youtube.upload` + `youtube.readonly` (to show which channel). Client file and tokens are in `secrets/` (git-ignored).
  Uploads use the resumable protocol in 8 MB chunks from a background queue: a dropped connection or a 5xx asks YouTube
  how much arrived and continues from there; the access token is refreshed when needed; Stop/Resume and an engine
  restart continue in the same upload session (sessions last about a week). Default visibility is **private** (the
  user publishes in YouTube Studio); unlisted, public and scheduled (`publishAt`) are available. "Made for kids" must be
  answered; an AI-content disclosure checkbox maps to `containsSyntheticMedia`. Checked 2026-10-19 against Google's
  docs: uploads from unverified API projects are not restricted to private; videos.insert is 1 unit of a 100/day
  "Video Uploads" quota.
- **Facebook Page and Instagram, through Claude in Chrome**: "Hand to Claude in Chrome" types a message into the video's
  Claude panel (same never-into-a-question rule); Claude posts in the user's logged-in Chrome profile as a Reel or a
  post, **stops before the final Post**, reports `ready-to-post` with the `publish_report` tool, and the user clicks
  Post. If the browser tools can't attach a file from disk, Claude asks the user to drag it in ("Show the video in its
  folder" helps). After posting, Claude (or the user, "Mark as posted") records the link.
- Drafts are `publish/youtube.json`, `facebook.json`, `instagram.json` (edited on the tab, or drafted by Claude from the
  script: "Ask Claude to draft titles & captions"); state in `publish/state.json`, upload log `publish/youtube.log`.
  The Facebook Page link and Instagram account are remembered for the next video (`settings.json` → `publish`).
- Format notes (soft): vertical ≤ 3 min becomes a YouTube Short; over 15 min needs a verified channel; Facebook/Instagram
  Reel length limits change, so the notes say "about"; a warning if the video's sources changed after the final file.
- Claude's tools: `publish_status`, `publish_report`, `youtube_upload` (only when the user asks).
- Test-only overrides: `CE_SECRETS_DIR`, `CE_SETTINGS_FILE`, `CE_GOOGLE_AUTH_URL`, `CE_GOOGLE_TOKEN_URL`, `CE_YOUTUBE_API`.

## Commands

```
ce app [--no-open]                 # the website (see above)
ce settings workspace D:\code_files\animations   # where video projects live (currently set)
ce new <slug> --title "..."        # project-<N>-<slug> from the template: packages linked, git repo, ready for Studio
ce list                            # projects in the workspace
ce link [project]                  # create/repair node_modules links (all projects if none given)
ce pipeline <project> <step>       # vo | music | stems | sfx | plates | captions | audio | refs  (see pipeline/run.py)
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

## Verified, Phase 3 (2026-10-18)

In a scratch workspace (`CE_WORKSPACE`, `CE_APP_PORT` override the settings for tests): a new video opens its Brief and
the panel starts Claude with `/make-video`; after the one-time trust prompt Claude asked what to make, and after one
answer wrote `brief.md` and set the stage to `talking` (board rendered it). Uploads: image → reference, `.md` with a
`name:` → project skill, a `..\..\` file name stays inside `references/`; the study step made 70 stills, contact sheet,
palette and a correct Whisper transcript of the reel. Board messages to Claude (Approve button) are submitted and
answered (sent as a bracketed paste, then Enter). Reopening a project continues its conversation (`claude --continue`,
which exits with code 1 after ~12 s when there is none, then a new one starts). `plates --from draft` and
`vo --estimate` checked on the reel (estimate calibrated to its measured 2.88 words/s). Plate encodes still byte-identical.

Since then the user made "why the sky is blue" end to end (project-5).

## Verified, Phase 4 (2026-10-19)

On a scratch engine with a copy of project-5 (2D) and a small 3D test video (a spinning cube shot that can be made to
crash at a chosen frame):
- 2D final render: sound check, 1974-frame render, upload file; 82.3 s with sound, −15.5 LUFS / −1.5 dBTP; board stage
  `final-ready`. A second video queued behind it (position 1) and could be stopped while queued; double start → 400.
- 3D: stop mid-plate kept 80 frames; a half-written frame was detected and redone; killing the engine mid-render left
  `running` in job.json, the next start reported it *interrupted*, Resume finished it; frames 1–79 were never
  re-rendered (mtimes unchanged); 351 frames, plates, video and delivery correct; the plate visible in the video.
- Changing the shot script after rendering → plan flags the plate, start refuses to mix frames; re-render ticked →
  old frames deleted, a one-time Blender crash retried automatically, render finished.
- Permanent crash → two tries, step failed, handed to Claude automatically; Claude found the cause (the test's crash
  file), removed it, called `render_resume`, explained what it did; the render finished. (The first attempt exposed a
  startup question swallowing the message; fixed by the panel-question rule above.)
- Pre-start blocks on a new video (placeholder script, estimated timing); delete refused while rendering (409);
  `delivery.mp4` held open → "close it and press Resume", then Resume redid only that step (5 s).
- Final tab screenshots: plan/blocked, running (frames, time left, log tail, Stop), finished (video player).

## Verified, Phase 5 (2026-10-19)

Against a fake Google on the PC (OAuth with PKCE check, token refresh, channels.list, resumable upload with injectable
faults) and a scratch engine, with a 30 MB vertical test video:
- Setup: wrong client files rejected with the reason; sign-in through the loopback redirect, channel shown; tokens in
  the scratch secrets folder.
- Uploads: problems block the start ("made for kids" unanswered, `<`/`>`); a connection dropped mid-chunk → asked
  YouTube, continued from 20 of 30 MB, done; a 503 → waited, continued; the access token expiring mid-upload →
  refreshed silently; Stop at 24 MB → Resume continued in the same session; engine killed mid-upload → *interrupted*
  after restart → Resume continued in the same session; a revoked sign-in → clear "connect again" message; the same
  file twice → refused with the link. Metadata arrived as set (private, not for kids, title, part snippet,status).
- Facebook/Instagram: draft problems block the hand-off; with the panel showing its trust question the hand-off waited
  (not typed) and said why; "Mark as posted" with a link; unknown statuses refused; MCP `publish_status` /
  `publish_report` (schema rejects bad statuses); Page/account remembered.
- Screenshots: Publish tab (YouTube result with links, Facebook "ready in Chrome", Instagram "posted"), Connected
  accounts.

Not exercised: the real Google sign-in and a real upload (needs the user's Google Cloud setup), Claude actually
posting in Chrome (deliberately not run against the user's accounts), whether Claude in Chrome can attach a local
file (unknown; the hand-off covers both cases).

Not exercised yet (Phase 4): a long real 3D final render (project-7), Ctrl+C shutdown of `ce app` during a render (handler
exists; the tests killed the process tree, the harder case), a disk-space block (logic only), link downloads (`yt-dlp` is installed), cut detection on dark footage (found no cut in
the reel's dark phone→brain change).
