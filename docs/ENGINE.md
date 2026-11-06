# Content engine: how it works

The technical reference: what each part does, the contracts between them, and what was verified. Setting the engine
up on a computer is in the [README](../README.md).

One place to make explainer videos: brief → script → voice and music → Blender plates → Remotion 2D layer → render.
Each video is a numbered folder in a workspace you choose (`project-4-<slug>`, `project-5-<slug>`, …) and every file
that video needs lives in that folder.

Status: **Phase 5** done (publishing). Version zero is complete end to end: brief → preview → edit → final → publish.

## The website

```
ce app            # starts http://127.0.0.1:4100 and opens it; Ctrl+C stops it (and the Studios/Claude sessions it started)
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
- **Editor** (`/p/<project>`): the project's Remotion Studio (started on a free port from 3200), the Claude chat on the
  right, and a strip under Studio showing what Claude is told about your position.
- **The Claude chat** (right side of Brief, Editor, Final and Publish; `app/server/claude.mjs`, `app/web/src/Chat.tsx`):
  the project's Claude Code runs on this PC without a screen (`claude -p` with stream-json in and out,
  `--permission-prompt-tool stdio`, `--chrome`) and the page shows it as a chat: messages, replies streaming in, the
  steps Claude took folded into one line ("Ran 3 commands, read 2 files", click to see each step and its output).
  - Claude starts when a message is sent (about a second) and continues the project's latest conversation (what
    `claude --continue` would pick); earlier messages, also ones from the old terminal or VS Code, come from Claude
    Code's saved conversation (`~/.claude/projects/<folder>/<id>.jsonl`). It closes after 15 idle minutes.
  - Permission questions are cards with **Allow / Always allow / Deny**; Claude's own questions (AskUserQuestion) are
    cards with option buttons and a free-text answer. The engine never answers them; a message sent meanwhile (typed, a
    board button, a render failure, a Publish hand-off) waits in Claude's queue and doesn't answer or cancel them.
  - Header: **Auto / Ask first** (permission mode, per video, `.claude/engine-chat.json`), **Terminal** (the same
    conversation in a normal Claude Code window on this PC; the chat waits until that window is closed), **New**
    (a new conversation; the old one stays saved). **Stop** stops what Claude is doing.
  - A new video's chat starts `/make-video` by itself when its page first opens.
  - Claude Code's built-in commands that need its screen (`/model`, `/compact`, Shift+Tab…) aren't available in the
    chat; use **Terminal** for those.
- **How Claude knows "this"**: the template's `EngineBridge` (inside the video, active only in a Studio the engine
  started) reports composition, playhead and props to the engine. Opening a project writes two git-ignored files into it:
  `.mcp.json` (the engine's MCP tools for that project) and `.claude/settings.local.json` (approves them and adds a
  `UserPromptSubmit` hook, `app/server/hook.mjs`, that prefixes each message with time, scene, narration line and the
  headlines on screen). Works the same when Claude Code runs in VS Code instead of the website, as long as the website
  has the project open.
- **Claude's tools** (MCP `content-engine`): `editor_state`, `timeline`, `view_frame` (renders the frame as an image,
  ~20 s), `seek`, `playback`, `show_setting` (opens Studio's props editor at a path).
- **Safety**: the server listens on 127.0.0.1 only, rejects foreign `Host` headers (DNS rebinding) and foreign `Origin`s;
  the chat's socket (`/ws/chat/<project>`) only accepts the engine's own page.
- The chat skips Claude Code's trust question (`-p` does). The **Terminal** window asks it once per video folder:
  choose *Yes, I trust this folder* (the default is *No, exit*).
- **Settings** (`/settings`, top menu): everything that used to need `settings.json` or the file explorer. *General*:
  workspace, Blender and Python paths, each checked when saved (folder exists, `blender.exe` exists, `python --version`
  runs), plus whether ffmpeg is found. *YouTube*: setup steps with links, then paste the Client ID and secret (or choose
  the downloaded JSON file), Connect, Test connection, Switch channel, Disconnect, and defaults for new videos
  (visibility, made for kids, category, tags, description ending). *Facebook & Instagram*: Page link and Instagram
  account (a page name or profile URL is normalised), caption ending (Reel or post has no default: it's chosen on the
  Publish page each time), and **Check Chrome**: asks
  the most recently used video's Claude to check, read-only, that Claude in Chrome is connected and both accounts are
  logged in; the result shows on the page (MCP `chrome_check_report`). Saved to `settings.json` → `publish`.
- **Publish** (`/publish`, top menu; see below): a page of its own, not a tab inside each video. Left: every video with
  an exported file and its files; middle: the picked file and the platforms, or the History when nothing is picked;
  right: that video's Claude chat. Old links (`/published`, `/p/<project>/publish`) redirect there. A video's tab bar
  reads Brief · Editor · Final · Publish (the last opens this page at that video; "Open the video" goes back).

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
  video's Claude chat (starting Claude if needed) — at most twice per render, and only if the job allows it (a checkbox,
  on by default). If Claude is busy or waiting for the user's answer to a question, the message waits in its queue;
  the engine never answers questions for the user. Until Claude is told, the failure is also added to the user's next
  message (prompt hook). Claude has
  `render_status`, `render_start`, `render_resume`, `render_stop` tools; the `make-video` skill says how to fix and
  resume, and what to ask the user first (anything costing money, re-rendering existing 3D, script or look changes).
- Board buttons (Approve, Ask Claude) send their message the same way.
- `CE_RENDER_NO_GPU_WAIT=1` (tests) skips waiting for other Blender processes.
- Shot script contract (also in the skill): `final <f0> <f1>` renders plate-local frames f0..f1 (1-based) at full
  resolution into `renders/<id>/final/f_####.png`; the plate has `round(duration × fps) + 1` frames; frames without 3D
  still need a file. A plate entry may name its script with `"shot"` (default `blender/shot_<id>.py`).

## Publish (Phase 5)

The **Publish** page (`/publish`, top menu) is where every video is published. The left side lists each video that has
an exported file, with its files: the Final render's `out/delivery.mp4` ("Final") first, then other video files in
`out/` and one folder below (a name with "draft" → "Draft", others "Render"; `out/video.mp4` only when there's no
delivery file yet; `out/render/` and `out/check/` are skipped). Videos without one are listed under *Not exported yet*
with a link to their Final tab. Picking a file stores it in `publish/state.json` → `video`; everything below uses the
picked file. With nothing picked the middle shows the **History** (`publish/history.json` of each video: every finished
upload or post with its file, plus anything under way). The right side is the video's Claude chat (showing it doesn't
start Claude; it writes the project's `.mcp.json`/hook like the editor does).

- **YouTube, through the YouTube Data API** (`app/server/youtube.mjs`). One-time setup in **Settings → YouTube**:
  a Google Cloud project with the YouTube Data API v3, a **Desktop app** OAuth client (Client ID and secret pasted on
  the page, or its JSON file chosen), the Google Auth Platform app published to *In production* (in *Testing* the sign-in
  expires every 7 days). Sign-in uses PKCE and a loopback redirect to the engine (`http://127.0.0.1:<port>/`); scopes
  `youtube.upload` + `youtube.readonly` (to show which channel). Client file and tokens are in `secrets/` (git-ignored).
  Uploads use the resumable protocol in 8 MB chunks from a background queue: a dropped connection or a 5xx asks YouTube
  how much arrived and continues from there; the access token is refreshed when needed; Stop/Resume and an engine
  restart continue in the same upload session (sessions last about a week) for the same, unchanged file; another file
  starts a new upload. A file that's already on YouTube (same path and modified time, latest upload or anywhere in the
  history) is refused with its link; the page then asks whether to upload a second copy (`again`). Default visibility is **private** (the
  user publishes in YouTube Studio); unlisted, public and scheduled (`publishAt`) are available. "Made for kids" must be
  answered; an AI-content disclosure checkbox maps to `containsSyntheticMedia`. Checked 2026-10-19 against Google's
  docs: uploads from unverified API projects are not restricted to private; videos.insert is 1 unit of a 100/day
  "Video Uploads" quota.
- **Facebook Page and Instagram, through Meta's Graph API** (`app/server/meta.mjs`, v26.0), when connected in
  **Settings → Facebook Page & Instagram**: the user's own Meta app (App ID + secret, optional Facebook Login for Business
  configuration ID), development mode, redirect `http://localhost:<port>/` (Facebook allows plain http only for
  localhost); Connect = Facebook Login code flow → long-lived user token (~60 days) → each Page's token (doesn't expire)
  and its linked Instagram account (`instagram_business_account`). Fallback: a user token pasted from the Graph API
  Explorer. Secrets in `secrets/meta-app.json`, `secrets/meta-token.json`.
  - Publish tabs: account picker (several Pages / Instagram accounts), Facebook **Reel** (3–90 s, vertical, 24–60 fps;
    `video_reels` start → rupload → finish → status) or **video post** (Resumable Upload API session → upload →
    `graph-video …/{page}/videos`, optional title); Instagram **Reel** (resumable container → rupload → `status_code`
    FINISHED → `media_publish` → permalink; 3 s–15 min, ≤ 300 MB, 23–60 fps, ≤ 1920 px wide; "also in feed" =
    `share_to_feed`). Instagram's upload fails on files much over ~30 MB in practice ("ProcessingFailedError: Request
    processing failed", far below the documented 300 MB): above 24 MB it gets a copy re-encoded to about 21 MB
    (≤ 3 Mbit/s, 720 px wide when that's low; the tab says so); a file without its MP4 index at the front gets a
    faststart copy. Copies go in `publish/.upload/`, named per file version, reused on Resume, removed after. That
    error isn't always final: the engine watches the container 3 minutes, then fails, and Resume uploads afresh.
  - One post at a time (queue), progress, `publish/<platform>.log`. Resumable and never posted twice: each post's IDs and
    phase are saved in `publish/state.json` → `post`; the step that publishes is marked before it's asked for and, on
    resume, the engine checks Meta first (Reel status, recent Page videos, container `PUBLISHED` + recent media). An
    engine restart marks it *interrupted*; Resume continues. The same file to the same account and format asks first.
  - History entries keep `route: "api"`, the account and Meta's `postId` (for view counts later).
  - Lists of videos use stills (`/api/projects/<p>/thumb`, cached in `out/render/thumbs/`) and the player loads on play:
    Chrome keeps a connection open per paused `<video>`, and six of them blocked the page's own status requests.
  - Tests: `tests/e2e/fake_meta.mjs` (port 4181) + `t15_meta.mjs`; overrides `CE_META_GRAPH`, `CE_META_GRAPH_VIDEO`,
    `CE_META_RUPLOAD`, `CE_META_DIALOG`, `CE_META_POLL_MS`.
- **Facebook Page and Instagram, through Claude in Chrome** (the route when Meta isn't connected, else under *Other way*
  in the tab): "Hand to Claude in Chrome" sends a message to the video's
  Claude chat (it waits its turn like any other); Claude posts in the user's logged-in Chrome profile as a Reel or a
  post, **stops before the final Post**, reports `ready-to-post` with the `publish_report` tool, and the user clicks
  Post. If the browser tools can't attach a file from disk, Claude asks the user to drag it in ("Show the video in its
  folder" helps). After posting, Claude (or the user, "Mark as posted") records the link.
- Reel or post has no default: Facebook and Instagram can't be handed over until one is chosen.
- The page also has the picked file in a player (a draft gets a "quick preview quality" warning), **Download** (saved as
  `<slug>.mp4` for the final, `<slug>-<name>.mp4` otherwise), **Copy file path** (for a
  browser's file picker), **Show in folder**, a **Reset** per platform (start that platform over), and the YouTube upload
  log under *Details*, so nothing needs the file explorer.
- Drafts are `publish/youtube.json`, `facebook.json`, `instagram.json` (edited on the page, or drafted by Claude from the
  script: "Ask Claude to draft titles & captions"); state in `publish/state.json`, upload log `publish/youtube.log`.
  New drafts start from the defaults in Settings (Page, account, tags, visibility, footers).
- Format notes (soft): vertical ≤ 3 min becomes a YouTube Short; over 15 min needs a verified channel; Facebook/Instagram
  Reel length limits change, so the notes say "about"; a warning if the video's sources changed after the final file.
- Claude's tools: `publish_status` (picked file, all files, drafts, state), `publish_report`, `youtube_upload` (only when
  the user asks; `again` for a second copy), `chrome_check_report`. Facts about a file (ffprobe) are cached per version.
- Test-only overrides: `CE_SECRETS_DIR`, `CE_SETTINGS_FILE`, `CE_GOOGLE_AUTH_URL`, `CE_GOOGLE_TOKEN_URL`, `CE_YOUTUBE_API`.

## Catalog (visual styles)

The plan behind this is in `vision.md` §5 and `docs/visual-catalog.md`. The format is in `library/catalog/README.md`.

- **What a style is:** one folder.
  - `STYLE.md` is the style document Claude reads, written as a skill.
  - `style.json` holds the numbers.
  - `scenes/` holds Remotion sample scenes that draw the style.
  - `preview/` holds the rendered stills and the moving reel, and `sources/` what the style was made from.
- **Where styles live:**
  - built-in styles in `library/catalog/visual/<id>/`;
  - the user's styles in `<workspace>/catalog/visual/<id>/`.
  - A user style with a built-in's id is the user's edited copy and takes the built-in's place.
- **Shared pieces:**
  - `library/catalog/kit/` and `sample.json` are shared by every style's scenes;
  - `library/catalog/preview/` is the preview project. `ce catalog preview` copies it to `<workspace>/catalog/_preview/`
    (with a node_modules junction) and renders one JPEG still per sample with `@remotion/renderer`, bundling once.
    Nothing paid is called.
- **The Catalog page:**
  - `/catalog` is a gallery of covers that step through the stills on hover, with filters and search.
  - `/catalog/<id>` is a style's sheet: stills, palette, type, motion, banned list, sources and the full STYLE.md. Its
    actions are Approve (for experimental styles), Duplicate, Delete or Undo my changes (Recycle Bin, confirmed by
    typing the id), and Add a font file.
  - `/catalog/new` → `/catalog/new/<draft>` makes a new style from dropped files, links and a note, handed to Claude.
- **The catalog's Claude:** the chat named `_catalog`, running in `<workspace>/catalog/`.
  - The engine refreshes `CLAUDE.md` (from `library/catalog/CATALOG-CLAUDE.md`) and the skills `make-style` and
    `visual-taste` every time it opens.
  - It writes a `.ce-catalog` marker and the prompt hook, but no editor tools.
  - The hook asks `/api/catalog/context`, which describes the gallery, the open style or a draft.
  - The `_catalog` name is accepted only by the chat routes and the chat socket, never by project routes such as
    delete or render.
- **New styles:**
  - A new style's draft lives in `<workspace>/catalog/drafts/<draft-id>/`: `sources/` and `draft.json`.
  - Claude saves the style as `experimental` and writes `result.json` (`{"id"}`); the page then links to the style.
- **Server and tests:**
  - Server: `app/server/catalog.mjs` and the `/api/catalog/...` routes.
  - Test: `tests/e2e/t16_catalog.mjs` (fake Claude, scratch engine).

## Quality gate

The plan is in `vision.md` §7. A video goes through it before anyone is asked to look: the make-video skill runs
`ce review .` before `preview-ready`, and the **Review** tab shows the result and can run it again.

- **How it sees the video:** `cli/review-probe.mjs` renders about 8 frames a second from the video's current code, so
  it works on a preview, and measures the text in the page as it draws each frame: words, box, real size after
  transforms, opacity, font.
  - Remotion has no public "frame ready" hook, so a script added to each page watches `remotion_setFrame` and
    `remotion_renderReady`. It waits 16 ms because the flag can turn true just before React commits.
  - Sound is switched off through the video's `audio` props (they have to go on `composition.props` as well as
    `inputProps`): Remotion's audio writer crashes on a sparse list of frames.
- **Review pack** (`review/`): `beats-NN.jpg` (each scene at +0.3 s and its middle), `seams-NN.jpg` (±0.2 s around every
  cut), `phone-NN.jpg` (360 px wide), `safe-01.jpg` (the deepest interface band of TikTok, Shorts and Reels in red).
- **Measured** (`cli/review.mjs`). FAIL must be fixed; WARN is a question, a video may keep one on purpose:

  | Level | Check |
  |---|---|
  | FAIL | text cut off by the frame; a font the page didn't load; a black frame between lit ones; page errors; final file peaking above −1 dBTP |
  | WARN | text under 2.6% of the short side; on screen shorter than its reading time; under a platform's interface; lines overlapping; more than 3 s with no change (the last 3 s are exempt); an empty first frame; effects louder than the voice; final file more than 1 LU from −16 LUFS |
  | Note | lines arriving at the same moment; the voice under 4 dB above the rest; a final file not tagged BT.709 |

  Glitch duplicates of a line don't count as overlaps, and a line's position is the median of its run, so an entrance
  or a jitter doesn't count as off-frame.
- **Voice against the rest:** can't be measured once mixed, so it's rebuilt from the same files, gains and envelope
  `AudioMix.tsx` uses, in 200 ms windows. The five closest moments become *For your ears*.
- **Critic:** a fresh Claude (`library/review/critic.md`) with only the Read tool, started in an empty temp folder so
  the video's history, skills and hooks don't reach it. It reads the sheets, brief, script, plan, style and measurements
  and answers with P0/P1/P2 notes as JSON. A reply in any other shape is retried once, then reported as an error, never
  as a pass. About 5 minutes on a 20 s video; it uses the user's Claude Code, no paid API.
  - It's also told the P0 and P1 notes of earlier reviews (`review/history.json`) and asked not to undo them. Without
    that the loop can't settle: on the first real video, two of the last three P1 notes reversed earlier ones.
- **Passing:** no FAIL, no P0 or P1 notes, and a critic that really answered.
- **The final file:** `finalChecks` measures `out/delivery.mp4` (loudness, true peak, format, colour tag) and caches the
  result until the file changes.
- **Colour:** the final render uses `--color-space=bt709`. Remotion's default is untagged BT.601, which players show
  hotter (measured on HUD Detection's orange: source 241,93,39, default 255,105,35, bt709 241,95,40). A final render
  therefore no longer matches `project-3-development` by framemd5; compare with the same flag.
- **Not checked:** contrast is left to the critic, and nothing here can hear the video.
- **Test:** `tests/e2e/t19_quality_gate.mjs` plants one of every fault in a video.

## Commands

```
ce app [--no-open]                 # the website (see above)
ce catalog list | check <style> | preview <style> | copy <style> [--as <id>]   # the style catalog (above)
ce review [project] [--no-critic]  # the quality gate (above)
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
| `library/catalog/` | The style catalog: built-in visual styles, the kit and sample content their scenes share, the preview project, the catalog's skills (`make-style`, `visual-taste`) and the catalog Claude's CLAUDE.md. Format: its README. |
| `cli/` | `ce.mjs` (commands) and `projects.mjs` (create/list/link projects; the website reuses it). |
| `app/` | The website: `server/` (Express API, MCP endpoint, Studio management, the Claude chat, bridge, hook), `web/` (React page, built with esbuild into `dist/`: `npm run build`). Own packages, separate from `runtime/`. |
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

Settings and Published pages (2026-10-19, same fake Google, scratch `settings.json`): wrong workspace, Blender, Page
name and Instagram handle rejected with the reason; `skyexplained` → `https://www.facebook.com/skyexplained`,
an Instagram profile URL → `@sky.explained`; a new video's drafts took the defaults (unlisted, tags, footers, post);
Client ID/secret pasted (bad ID and empty secret rejected) → Connect → Test connection → upload as unlisted; Download
header `attachment; filename=why-the-sky-is-blue.mp4`; Reset; Published table rows; Check Chrome waited for the
(untrusted) panel and `chrome_check_report` saved a result; the real `settings.json` was untouched; no page errors.

Publish page (2026-10-19, same setup, a vertical final + a horizontal 100 s draft + temp/check files): only final and
draft listed (final first, default pick), a video without files under *Not exported yet*; old Reel/post settings
ignored, Facebook/Instagram hand-off refused until Reel or post is chosen, a bad format not stored; picking a path outside
the list (or a temp file) refused; notes and download name follow the picked file; YouTube: draft uploaded, same file
again → 409 with the link, final stopped part-way and resumed in the same session, an unchanged draft refused from the
history even after another upload, changed draft → new upload, confirmed second copy uploads; history rows carry their
files, a repeated "posted" updates its row, Reset removes it; MCP `publish_status` shows the picked file; the Claude panel
opened from the page writes `.mcp.json`; old `/published` and `/p/<p>/publish` links redirect; no Publish tab in the
project bar; no page errors. (Stop/resume checks depend on timing: one of three runs finished the upload before Stop.)

Not exercised: the real Google sign-in and a real upload (needs the user's Google Cloud setup), Claude actually
posting in Chrome (deliberately not run against the user's accounts), whether Claude in Chrome can attach a local
file (unknown; the hand-off covers both cases).

Not exercised yet (Phase 4): a long real 3D final render (project-7), Ctrl+C shutdown of `ce app` during a render (handler
exists; the tests killed the process tree, the harder case), a disk-space block (logic only), link downloads (`yt-dlp` is installed), cut detection on dark footage (found no cut in
the reel's dark phone→brain change).

## Verified, whole-pipeline review (2026-10-19)

On a scratch engine (port 4170, workspace `D:\tmp\ce-x`) with the fake Google and a **fake Claude** (a stand-in
`claude.cmd` first on the engine's PATH that draws a trust question, Claude Code's prompt footer, and a permission
question on demand, and logs every message it receives), driven through the website in headless Chrome:
- Videos: create without and with dropped files (skill `.md` → project skill, style guide and image → references);
  Brief: Claude's files show on the board; Approve refused (and the reason stays visible) while the panel shows a
  question, typed once it's answered; building → preview ready → Editor with Studio and "Claude sees".
- Final: start, stop during the video render, resume (sound step not redone), finished card → Publish; a broken step
  handed to Claude only after the user answered the panel's question, Claude's `render_resume` finished it; two
  videos queued; the engine killed mid-render → both *interrupted* → Resume finished both.
- Settings: bad workspace/Blender/Python refused with the reason; Client ID/secret → Connect → Test → Disconnect →
  Connect; Page name and Instagram URL normalised; defaults reach new drafts; Check Chrome waits for a trust question,
  `chrome_check_report` shows on the page; the real `settings.json` untouched.
- Publish: History when nothing is picked; final and draft per video, *Not exported yet*; upload (metadata from the
  defaults), duplicate → Cancel uploads nothing, OK uploads a second copy; Stop then Resume at once; engine killed
  mid-upload → *interrupted* → Resume continued in the same YouTube session; Facebook/Instagram hand-off (picked file,
  Reel/post), waiting while the panel shows a question and delivered by itself after the answer; ready-to-post /
  posted via MCP; Mark as posted (Cancel changes nothing); Reset; the picked file vanishing falls back to the final.
- Back/forward across pages and tabs, old links, unknown video links, Delete (wrong number, refused while rendering or
  uploading, Recycle Bin), a deleted finished file, a source changed after the final, a broken `project.json` /
  `script.json`, the engine restarting under open pages.
- The real Claude Code (current version) in the panel: its trust screen ("No, exit" is the default) is detected as a
  question and its prompt as ready, so the never-type-into-a-question rule still holds.

Fixed in this review: a second engine's Studio port check (Windows let an IPv4 bind succeed on a port another engine's
Studio held, so the editor could show another project's Studio; now checked dual-stack, and "ready" needs Studio's own
"Server ready" line); YouTube Stop + immediate Resume stuck in *queued*; a stopped queued upload left a ghost entry;
"Handed to Claude" shown while the hand-off was only waiting (Publish, Final tab); Mark as posted on Cancel; the
Brief board's refresh erasing button errors; stale "Failed to fetch" after an engine restart (Final, Publish);
Settings saves taking 2–5 s (tool checks now remembered for a minute; YouTube state updates at once; "saving…");
unknown video links (plain page instead of a Studio and panel that never start); a deleted finished file shown as
finished; a broken `project.json` as a bare 500; long tracebacks as the Final tab headline (now under Details);
one set of status words for Videos, Brief, Publish badges and History (`app/web/src/words.ts`); "See the final video"
on the Brief at *final video ready*; long titles squeezed on Videos.

UX changes chosen by the user afterwards (verified the same way): a stopped/failed/interrupted render offers Resume and
"Start over instead" (the start form only on request); the finished video stays on the Final tab whenever
`out/delivery.mp4` exists (with "the newer render didn't finish" when a later render stopped); a Publish step in each
video's tab bar and "Open the video" back from the Publish page; folder names on the Videos list only on hover; the
Brief shows the voice as "not decided" while it's still the template's voice and the brief is being talked through.
The user's engine (4100) was restarted onto this version with nothing rendering and its Claude panels idle.

Not exercised in this review: a 3D (Blender) final render (unchanged since Phase 4; the PC had ~4 GB free memory),
the real Google and real Chrome posting (by design), Copy file path / Show in folder / Download in a real browser,
link downloads, Studio interactions and the editor MCP tools, the real Claude running `/make-video`.

## Verified, the Claude chat (2026-10-21)

Claude Code 2.1.304, probed first in a scratch folder (stream-json in and out): skills (`/make-video`), the
`UserPromptSubmit` hook, `--resume` (about 1 s), interrupt, `set_permission_mode`, permission questions and
AskUserQuestion answered by the host (`--permission-prompt-tool stdio` plus an `initialize` request; without them
permission questions are silently denied and AskUserQuestion is missing), "always allow" (`updatedPermissions`, saved
to the folder's `settings.local.json`), deny, streaming text, `--chrome` (the Chrome tools, including `file_upload`).
A message sent while a permission question waits is queued: the question is neither answered nor cancelled.

Scratch engine, fake Claude (`tests/e2e/t12_chat.mjs`, 60 checks): a new video starts `/make-video` by itself (first
reply 0.5 s after the page opened); messages, streamed replies, tool steps folded and opened; a permission card, a board
message sent meanwhile waits and doesn't answer it, Allow / Always allow / Deny; a question card; Stop (no error line);
Auto / Ask first saved per video and passed on restart; reload keeps the conversation; a crash is reported and the next
message resumes the same conversation; idle close and resume; New conversation; Terminal (a window of its own, sending
refused meanwhile, the chat back when it closes); earlier messages from a copied real conversation (0.8 MB and 23.6 MB:
shown in about 0.3 s, no Claude started just by looking, the first message resumes it); the chat socket and the send API
refuse foreign origins. The older tests (t1–t11) were updated to the chat (Approve, render failures and Publish hand-offs
sent while Claude waits for an answer are queued and the question stays the user's).

Real Claude Code on the scratch engine (`t13_real_claude_chat.mjs`, `t14_tui_resume.mjs`): `/make-video` started by
itself (first words after 15 s), the engine's MCP tools connected (`editor_state` used), the hook's note arrived, Ask
first showed a real permission card and the command ran after Allow, AskUserQuestion became a card and Claude got
"Blue", Stop; a conversation made in Claude Code's normal terminal showed in the chat and the chat's Claude remembered
it; the Terminal button ran `claude.exe --resume <id>` in a window of its own and the chat came back when it closed.

Not exercised: a person using the chat by hand in a normal browser; the real Claude posting through Chrome (by design);
a whole `/make-video` → Approve run with the real Claude (Approve costs money); how the chat behaves after a future
Claude Code update changes its stream-json messages.
