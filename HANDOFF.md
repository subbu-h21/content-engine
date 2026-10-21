# Handoff: state of the content engine and what's left (2026-10-21)

For a fresh Claude Code session opened in `D:\code_files\content-engine`. Read this, then `README.md` and `CLAUDE.md`
(this folder), `template/README.md` and `template/.claude/skills/make-video/SKILL.md`. Earlier sessions ran from
`D:\code_files\animations`, so their memory notes are not loaded here; everything they knew that matters is below.

## The user and how to work with them

- Not a developer. Report in simple words: what was tested, what broke, what was fixed, what is still untested and
  why. Be honest about failures. Include screenshots of changed pages. Explain git in plain words ("backup",
  "snapshot"), not jargon.
- **Goal:** everything must be doable in the website. The user must never need the codebase, a terminal or File Explorer.
- **Rules:**
  - Ask before adding any dependency.
  - Never commit or push unless asked, and add no co-author line to commits.
  - Clear doubts before building; don't implement on assumptions.
  - Reproduce a bug end to end before fixing it.
  - For UX changes (moving pages, changing the flow, new screens), first give a short list with the problem, 2–3
    options and a recommendation, then wait for the user's choice. Small wording or label fixes can just be done.
- After any change in `app/web/src`: `cd app; npm run typecheck; npm run build`. The user's running engine serves the
  same `app/dist`, so a rebuild shows up there on the next page reload. Keep new frontend code working with an older
  running server (treat new response fields as optional).
- Edit files with the Edit/Write tools or small node scripts written with Write. Bash heredocs and `node -e` with
  backslashes have mangled `\n`, `\x1b`, `\t`, `\f` and Windows paths several times.
- The user chose Opus at high effort and wants to be told when something gets too complicated (they may switch models).

## What exists (phases 1–5 done, all committed)

`ce app` starts the website at http://127.0.0.1:4100 (Express + React). Each video is a folder
`project-N-<slug>` in the workspace `D:\code_files\animations`. The flow:

- **Videos (`/`):** "What do you want to create today?" plus a file dropper (references, a style guide, a skill
  file). It creates the next project folder and opens its Brief. The list of videos has stage and status labels and
  Delete (to the Recycle Bin, confirmed by typing the video's number).
- **Brief (`/p/<p>/brief`):** the board shows what Claude writes (idea, script, look, sound, plan, references).
  Claude runs the `make-video` skill in the panel on the right. The user approves with **Approve and build**: the
  voice is recorded (paid), the scenes and 3D drafts are built, and the Editor opens.
- **Editor (`/p/<p>`):** the project's Remotion Studio (iframe), the Claude chat, and MCP tools that tell Claude where
  the user is (`editor_state`, `seek`, `view_frame`…).
- **The Claude chat (2026-10-21, not committed):** replaced the xterm/node-pty terminal on Brief, Editor, Final and
  Publish. See README "The Claude chat" and "Verified, the Claude chat". The user's choices: earlier conversations shown
  (from Claude Code's saved `.jsonl`), tool steps folded into one line, a **Terminal** button (same conversation in a
  real window; the chat waits), Claude closes after 15 idle minutes. The user doesn't want remote access/tunnels.
- **Final (`/p/<p>/final`):** the render queue (`app/server/render.mjs`): audio → Blender plates (only missing
  frames, 200 per call) → plate encode → Remotion render → `out/delivery.mp4`. Stop, Resume, interrupted after an
  engine restart, failures handed to the Claude panel (at most 2 automatic fixes).
- **Publish (`/publish`, `/publish/<p>`):** a page of its own. It lists every video's exported files, has History,
  and is reached from the top menu or the **Publish** step in each video's tab bar.
  - YouTube goes through the API (`youtube.mjs`): OAuth PKCE with a loopback redirect, resumable uploads with
    stop/resume, a duplicate check with a "second copy?" confirm. Uploads are private by default.
  - Facebook Page and Instagram go through Claude in Chrome. Claude stops before the final Post; the user clicks it.
    Reel or post is chosen each time.
- **Settings (`/settings`):** workspace, Blender and Python paths (checked); YouTube setup, connect, test and
  disconnect; posting defaults; **Check Chrome** (Claude checks the logins read-only).

Key safety rule (`claude.mjs`): the engine never answers Claude's questions (permission cards, AskUserQuestion) for
the user. Messages the engine sends (Approve, render failures, Publish hand-offs, Check Chrome) go into Claude's
queue; probed and tested: a queued message doesn't answer or cancel a waiting question. (The old terminal needed
`panelState()` screen-reading for this; it's gone.) The chat runs `claude -p`, which skips the trust question; the
Terminal window still asks it once per folder, and its **default is "No, exit"**.

Latest commits: `dd4b82d` (Final tab: Resume first, finished video kept; Publish step in the tabs) and `f9aa064`
(Settings and Publish pages, history, whole-pipeline review fixes). The README's "Verified, whole-pipeline review"
section lists every check and fix from 2026-10-19.

## Running engines: be careful

- **The chat is live on 4100** since 2026-10-22: the user's engine restarted onto the new server code while `app/dist`
  was still the old page (the old terminal panel looped "disconnected… reconnecting"); `npm run build` fixed it.
  Lesson: server code and `app/dist` must change together for the user's engine. Tests use a page built into
  `D:\tmp\ce-chat-dist` (`CE_APP_DIST`).

- **4100** is the user's real engine (workspace `D:\code_files\animations`). It was restarted onto the current code
  on 2026-10-19.
  - **Never stop or restart it** without first checking that nothing is rendering or uploading
    (`GET /api/projects` → `render`/`publish`; `tasklist` for blender.exe) and that its Claude panels are idle
    (compare the CPU of the `claude.exe` children over about 10 s). Restarting closes the Studios and Claude panels;
    conversations resume with `--continue`.
  - If a restart is needed: kill the `node ...cli\ce.mjs app` process tree, then
    `Start-Process node '"D:\code_files\content-engine\cli\ce.mjs"','app','--no-open' -WorkingDirectory D:\code_files\content-engine`.
- **4101** is the user's own test engine (`CE_SETTINGS_FILE=D:\tmp\ce-try\settings.json`, workspace `D:\tmp\ce-try`
  with a copy of project 5). It still runs the **old** code. You may restart it after checking it's idle.
- **Never point another engine at `D:\code_files\animations`.** Opening a project rewrites its `.mcp.json` to that
  engine's port, and startup marks running renders as "interrupted".
- The PC has 24 GB of RAM and is often down to about 4 GB free. Keep tests light (no parallel Studios or renders).
- Start the user's engine from **their own terminal** (`D:\code_files\content-engine\ce.cmd app`). An engine started
  from a Claude Code tool session dies when that session ends.
- **Studio stuck on "Studio starting…" (found and fixed 2026-10-20, not committed yet):**
  - Cause: Remotion 4.0.535 runs `execSync("nproc")` for the CPU count on every Studio request and doesn't cache a
    failure. In a normal Windows terminal `nproc` doesn't exist, so each request waits ~1 s for cmd.exe to fail, the
    requests pile up, and the engine gives up after 2 minutes.
  - Why tests missed it: engines started from Git Bash have `nproc` (Git's usr\bin), so it worked there.
  - Fix: `app/server/bin/nproc.cmd` (echoes `%NUMBER_OF_PROCESSORS%`), put first on PATH at engine start in
    `index.mjs`. Test: `tests/e2e/t11_studio_nproc.mjs`. Always test with a PATH without Git's usr\bin.
  - Takes effect after the user restarts their engine.

## How to test (scratch engine, fake Google, fake Claude)

The helpers are in `tests/e2e/` (copied there 2026-10-20, **not committed yet**; ask the user whether to keep them
in git).

- Setup and control:
  - `node tests/e2e/write_settings.mjs` writes `D:\tmp\ce-x\settings.json`; create `D:\tmp\ce-x\secrets` too.
  - `node tests/e2e/fake_google.mjs` starts a fake Google on port 4180: OAuth, token refresh, a channel, and
    resumable uploads. Faults are armed with `POST /debug/faults {delayMs, dropAt, busyAt, expireAt}`.
  - `lib.mjs` → `startEngine()` / `stopEngine()` start and stop the scratch engine on **4170** only.
    `start_engine.ps1` does the same from PowerShell.
- **The fake Claude** (`fakebin/claude.cmd` + `fakeclaude.mjs`) sits first on the scratch engine's PATH.
  - What it does: with `-p` it speaks stream-json like Claude Code; messages containing `FAKE-ASK-PERMISSION`,
    `FAKE-ASK-QUESTION`, `FAKE-SLOW`, `FAKE-TOOLS`, `FAKE-CRASH` trigger those behaviours (see its header). It logs
    messages to `.fake-claude/messages.jsonl` (`queued` = arrived while busy), answers to `answers.jsonl`, starts to
    `runs.jsonl`. Without `-p` (the Terminal window) it draws a simple prompt.
  - Why: hand-offs ("post this video", Check Chrome) never reach the real Claude or the user's Chrome and accounts.
  - It saves no conversation, so after a scratch engine restart its chats start empty (the real Claude's don't).
- `run_all.mjs` runs t1…t12 in order and prints a summary. Before it: `write_settings.mjs`, `fake_google.mjs`, and
  `node build.mjs D:\tmp\ce-chat-dist` in `app/`.
- Out-of-date checks (fail on unchanged behaviour, not fixed): t1 "working title" (now cut before "in"), t8 "unknown
  video" wording ×2, t8 "Not exported yet" (the video still has `out/video.mp4`), t10 "Voice not decided" (an empty
  Sound card says "Not decided yet."). Timing-dependent: t6/t7 YouTube Stop/Resume and restart-mid-upload (the fake
  upload often finishes first).
- Real-Claude tests (tokens, nothing paid or posted): `t13_real_claude_chat.mjs` (starts its own engine without the
  fake), `t14_tui_resume.mjs` (a conversation made in the normal terminal through node-pty, then continued in the
  chat; run after t13). When stopping processes in tests, match the exact PID or a unique id, never a pattern: a broad
  match once stopped one of the user's VS Code Claude sessions.
- `cdp.mjs` drives Remotion's chrome-headless-shell. `page()` in lib enables focus emulation, which fields that save
  on blur need. `window.confirm`/`prompt` are stubbed; answers go in `window.__confirm` / `window.__prompt`.
- The tests: `t1_create`, `t2_brief`, `t3_final`, `t4_restart`, `t5_settings`, `t6_publish` / `t6b_social`,
  `t7_race`, `t8_misc`, `t9_stale`, `t10_ux`.
  - Run them in that order: `t1` writes `D:\tmp\ce-x\_names.json` (the two test videos), which later tests read.
  - Some checks are timing-sensitive or out of date. In particular, t8's "unknown video" wording now reads "There's
    no video called…". Read FAIL lines before believing them.
  - `real_claude.mjs <project> [answer]` reads the real Claude's screens. It needs the engine started without
    `fakebin` on PATH. It must never send a message.
- Cleanup:
  - Before deleting `D:\tmp\ce-x`, remove each project's `node_modules` junction (it points at
    `runtime/node_modules`).
  - Then check that `runtime/node_modules` still has its packages, and that the real `settings.json` is unchanged
    (sha1 `81b7948e…` on 2026-10-19).
- Screenshots from the 2026-10-19 review are in `D:\tmp\ce-review-shots`.
- Never post to the user's real Facebook/Instagram or upload to their real YouTube from tests. Never spend money
  (voice or music generation).

## What's left

0. **The Claude chat (2026-10-21):** switch 4100 over (see "Running engines"), then let the user try it by hand and
   collect feedback. Open questions for the user:
   - Remove the now unused `node-pty`, `@xterm/xterm`, `@xterm/addon-fit` from `app/package.json`? (Dependency
     change: ask. `t14_tui_resume.mjs` uses node-pty to drive a real terminal.)
   - Done 2026-10-22 at the user's request: the new Chrome wording ported to project 8's skill (the only existing video
     that had the old line; that project's own git repo has it uncommitted), the chat restyled like Claude.ai,
     everything committed (`eac5246`). The user keeps Remotion Studio as it is (no Player-based editor) and keeps the
     name "Claude" in the website.

1. **Real-world checks with the user** (they said they'll do these later; guide them step by step):
   - YouTube: Settings → YouTube setup.
     - In Google Cloud: create a project, enable the YouTube Data API v3, set up the Auth Platform with an
       External audience, then **publish the app "In production"** (otherwise the sign-in expires every 7 days),
       and create a **Desktop app** client.
     - In the website: paste the Client ID and secret, then Connect, then Test connection.
     - Then one real **private** upload of a short draft.
   - Facebook Page / Instagram: Check Chrome. Then one real hand-off where the user stops at Claude's
     "ready to post". This also answers the open question of **whether Claude in Chrome can attach a local file**
     (the hand-off message covers both cases: if it can't, Claude asks the user to paste the path).
2. **Project 7's 3D final render** (14.5 min video, about 9,900 3D frames). The Blender path wasn't re-tested in the
   2026-10-19 review. An earlier overnight attempt was stopped by Claude for low memory.
   - Check free RAM before starting, and expect hours.
   - The GPU wait for other `blender.exe` processes is on in the real engine.
3. **The user's feedback list on "version zero".** They deferred it ("build end to end first"); ask for it.
4. **A reusable style library**, shown as a catalog where the user picks a look for a new video. Planned; the
   frontend design comes later. Ask before designing.
5. **Not tested yet:**
   - Download, Copy file path and Show in folder in a normal browser (not headless).
   - Link downloads on the Brief (yt-dlp).
   - Studio interactions and the editor's MCP tools since Phase 2.
   - The real Claude running `/make-video` end to end (costs tokens; Approve costs money).
   - Ctrl+C shutdown of `ce app` during a render.
   - The disk-space block.
6. **Small known rough edges** (not bugs; mention or fix with the user's OK):
   - The first Settings load takes about 5 s (Python and ffmpeg checks; cached for a minute afterwards).
   - The Publish panel takes about 3 s to load the first time (ffprobe).
   - Check Chrome always uses the most recently changed video's panel.
   - The working title is the first sentence of the request until Claude renames it.
   - "Show in folder" opens File Explorer (optional; everything else works without it).
7. **Older plans in the background:**
   - Hide git behind undo/versions in the website.
   - Convert `animations\magnus` into an engine project.
   - `project-3-development` is redundant now (project 4 replaced it); leave it unless the user asks.
