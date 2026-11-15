# Handoff: state of the content engine and what's left (2026-11-06)

For a fresh Claude Code session opened in `D:\code_files\content-engine`. Read this, then `docs/ENGINE.md` and `CLAUDE.md`
(this folder; `README.md` is the setup guide for a new PC), `template/README.md` and `template/.claude/skills/make-video/SKILL.md`. Earlier sessions ran from
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

`setup.bat` checks the tools and installs the engine's packages on a new computer (`README.md`); `start.bat` or
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
  Publish. See `docs/ENGINE.md` "The Claude chat" and "Verified, the Claude chat". The user's choices: earlier conversations shown
  (from Claude Code's saved `.jsonl`), tool steps folded into one line, a **Terminal** button (same conversation in a
  real window; the chat waits), Claude closes after 15 idle minutes. Remote access: the website stays local-only; on 2026-11-16 the user asked to
  watch videos on their phone through cloudflared, so `viewer.bat` (read-only, keyed viewer; `docs/ENGINE.md` "Phone
  viewer") was added instead of opening the website.
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
(Settings and Publish pages, history, whole-pipeline review fixes). `docs/ENGINE.md`'s "Verified, whole-pipeline review"
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

00. **Done on 2026-11-06, after the catalog commit (`05f8924` on `visual-catalog`, not pushed; nothing since is
    committed: the user asked for that one backup only).**
   - **Automatic theme:** `applyStyle` sets the video's theme, type, margins, fonts, plate ground and `style.md` from
     the style. Light styles used to come out black: the template's `Plate.tsx` paints `#000`.
   - **First real video in a catalog style:** `project-9-a-20-second-vertical-video-on` ("Why the Sea Is Salty", channel
     Daily Insights, HUD Detection), made through the real chat and the real render queue.
   - **Moving previews:** every style has `preview/reel.mp4` (360×640, silent, 19 MB for all 73), played on hover in
     the gallery and on the style's page. Rendering them found a real crash in Painted Boil (a hook after an early
     return in `Mark`): stills can't see this kind of bug, so a new style should always get its reel.
   - **Quality gate (step 2):** see `docs/ENGINE.md` "Quality gate". `ce review`, the Review tab, storyboard at the
     approval step, final render in BT.709. Test: `tests/e2e/t19_quality_gate.mjs`.
   - **Project 9 after the gate:** 4 review rounds took it from 9 P1 notes to 2; 0 failed, 0 P0, 8 P2. The jump at the
     17 s cut was then fixed by hand, and the final render includes it (20.46 s, BT.709, −15.7 LUFS). The report still
     counts that note, because only a full critic run clears it. Really open: the ring not reading as a sample of the
     sea, and the P2s. The gate hasn't passed. Nobody has heard the video yet.
   - **Critic memory:** new critics kept reversing earlier notes, so each now gets earlier P0 and P1 notes
     (`review/history.json`). It has run once with a real critic, on project 9, but only knew the previous round because
     older rounds weren't saved, and that run still reversed a round 2 note. A new video is the first full test.
     **Gate limit:** each fix can still draw new notes, so 0 P1 isn't a realistic bar yet. Claude's advice after 4 rounds
     was to judge by watching; "passed" may need rethinking once more videos have been through it.
   - **Packaging (step 5):** see `docs/ENGINE.md` "Packaging". The user chose: the hook is picked before the script and
     the script is built on it; titles, thumbnails and captions get a Package tab between Final and Publish. Done out of
     order on purpose: the user asked for it after step 2. Thumbnails aren't uploaded anywhere yet, and YouTube's
     custom-thumbnail rule for Shorts is still unchecked. Project 9 has a real package; nothing's been picked on it.
     Tests: t20 (fake Claude, planted faults), t21 (real Claude, hook step).
   - **Reviewed and fully tested on 2026-11-06, after packaging:** two independent code reviews (20 findings plus 3 they
     cut for length, all confirmed and fixed; details in `docs/ENGINE.md`), and the whole suite on a fresh workspace.
     - **Result:** t2–t5, t6b, t9, t11, t12, t15–t21 all pass. The 9 failures left in t1, t6, t7, t8 and t10 are the known
       ones under "How to test".
     - **t6 and t8 need a fresh workspace:** they hard-code video numbers, so in a used `D:\tmp\ce-x` they fail on
       "type N to confirm". The old one is kept as `D:\tmp\ce-x-before-review`.
     - **Real videos:** the gate ran on copies of projects 4, 5, 7 (14.5 minutes, 3D), 8 and 9 in `D:\tmp\ce-gate\old`.
     - **Phone reel:** 4 of 4 frames identical to project 3; voice and timing byte for byte.
     - **Temp leftovers:** the 218 `remotion-webpack-bundle-*` folders (5.8 GB) were cleared on 2026-11-06 at the user's
       request, taking `C:` from 5.4 to 12 GB free. A stopped final render still leaves one, because Remotion is killed
       before it can clean up: the engine now removes those after a week (`cli/temp.mjs`).
   - **Not built from vision §7:** two critics for the autopilot (it comes with the autopilot); a contrast measurement
     (left to the critic); re-rendering only the stills a fix touched (each round redoes the sheets, about 20 s).
   - **Existing videos:** `template/` changes don't reach them, so only new videos run the gate by themselves. The
     Review tab works on every video with `src/data/timing.json`.
   - **The user's engine on 4100** was restarted from a Claude Code tool session on 2026-11-06, so it stops when that
     session ends. Start it from a terminal with `start.bat` or `ce app`.
   - **The PC ran out of memory at 16:14 on 2026-11-06 and restarted; the cause is not identified.** The user was
     working on other things at both times and may have started it themselves.
     - **What happened:** a `node.exe` that started at 16:13:20 reached 47 GB in about 50 s, and commit memory hit
       102.7 of 102.7 GB. dwm, Edge, the video's Claude and another session's build all died at 16:14:22. The same had
       happened at 11:24:30 (53 GB) without a crash.
     - **Cleared, measured under a 6 GB watchdog:** the gate's render peaked at 1.13 GB; Studio at 1.09 GB, with a
       browser attached, on project 9 and on project 7 (the heaviest). The gate started 46 s after that `node.exe`.
     - **Where to look next time:** System log event 2004. Its `ToXml()` gives each process's PID and start time; the
       summary line doesn't. It doesn't give the path. No Claude session started anything at 11:24:30.
     - **Also:** `C:` has only about 7 GB free. Temp files land there.

000. **The visual catalog (2026-10-31 → 11-01; committed 2026-11-06).**
   - **Plans:** the vision is in `vision.md` (the user's decisions are marked "Decided"); step 1's design is in
     `docs/visual-catalog.md`.
   - **Research:** the notes on the resources the user collected are in `docs/research/` (styles in
     `docs/research/styles/`).
   - **Built:**
     - the style format and kit, the preview renderer, the `ce catalog` commands;
     - the `make-style` and `visual-taste` skills;
     - about 40 built-in styles in `library/catalog/visual/`, each written by a writer agent following make-style and
       reviewed by eye;
     - the Catalog page (gallery → style page with the catalog's Claude → new style from uploads).
     - See `docs/ENGINE.md` "Catalog". Test: `tests/e2e/t16_catalog.mjs` (50 checks pass); t12 was re-run after the
       chat-route changes and passes.
   - **Style-writing queue (2026-11-06: 55 finished; the user chose to keep going).** Run ONE fresh small writer at a
     time, 3 styles each; never resume an old writer (reloading its history burned the usage limit about 6 times).
     The user's rule: one writer at a time, quality first (never trade quality for tokens). Brief: read only make-style,
     the catalog README, the kit, sample.json, and editorial-neuro's style.json and scenes/index.tsx; find the source
     section with Grep; look at every preview still; up to 3 fix rounds; one render at a time with `CE_WORKSPACE` set to a scratch folder; change only its own folders; no commits. The main
     session reviews each sheet. Count finished styles by `preview/sheet.jpg`, not by folders.
     **73 styles finished by 2026-11-06, all reviewed and passing `ce catalog check`.** Still queued, if the user wants:
     1. HyperFrames presets Code Editorial, Coral, Creative Mode, Daisy Days, Editorial Forest (`hyperframes.md`; give
        them motion from its taste rules, marked proposed)
     2. shotcraft: Ink Press, Lit Stage dark and light, Vibe Life, Mesh Glow (`shotcraft-vertical-remotion.md`)
     3. the other Lemo styles and the partial prompt-motion looks; footage or data styles last
   - **Polish list:** Studio Floor Fly-over (heavy blur, small title), Transit Map (small number frame), Calm Product
     Demo (sparse title), Stained Glass (gold title on stone is low contrast), Capsule (pill touches the "y" tail),
     Cartesian (very quiet at phone size), Broadside (close to Signal Slam in colour), Mid-century (end title is low
     contrast).
   - **Open decisions:** none on the first real video (done, see above); the user's rule stays: commit only when asked,
     with no co-author line.
   - **Step 1d: built 2026-11-04.** It's the flow the user approved.
     - **Settings → Channels:** name, style, Look locked; stored in `settings.json` → `channels`.
     - **Home:** "For <channel>" next to Create, defaulting to the channel used last.
     - **A new video's style:** the channel's own when locked; otherwise the channel's last video's style, then the
       channel's own. It's copied in by `applyStyle` / `ce catalog use <id>`: `src/style/`, `src/kit/`,
       `src/sample.json`, `public/style/fonts/`, `brief/style-cover.jpg`, `.claude/skills/style-<id>/`, and
       `project.json` → `style`.
     - **The Brief's Look card:** shows the style, with Change (a picker of covers) and New look from a file (a catalog
       draft handed to the video's Claude). Both are refused when the look is locked.
     - **Skills:** new videos get the `visual-taste` and `make-style` skills. The make-video skill's Look and build steps
       now use the style (template change: new videos only).
     - **Test:** `tests/e2e/t17_channels.mjs` passes. t1 was re-run and passes, apart from its known out-of-date
       working-title check.
     - **Not exercised:** the real Claude building a video in a catalog style. The style's colours and fonts reach the
       theme only through Claude, following the skill.
   - **Not exercised yet:** a real Claude making a style from an upload on the page (the fake Claude covers the
     hand-off).
00. **Facebook & Instagram through Meta's API (built 2026-10-22, tested against `fake_meta.mjs`, not committed):**
   connected for real on 2026-10-22 with a token pasted from the Graph API Explorer (Meta app "Content-engine", App ID
   1726166678921606, development mode; Page **Daily Insights** + Instagram **@daily_insights21**; user token until
   2026-12-21). First real post: "why the sky is blue" as a Facebook Reel worked
   (https://www.facebook.com/reel/1093334150071704/). Instagram failed with "ProcessingFailedError" on the 40 MB file;
   probed with unpublished test containers: ≤ 31 MB went through, 38–60 MB never did, and one 21 MB upload reported
   the error but FINISHED anyway. Fixed the same day (lighter copy above 24 MB, watch the container after that error,
   fresh container on Resume; see `docs/ENGINE.md`). Needs the user's engine restarted to take effect, then Resume on the
   Instagram tab. Still unknown: whether Development-mode posts are visible to the public. Then: X (planned, pay per
   use), scheduling, view counts.
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
