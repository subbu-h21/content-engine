---
name: make-video
description: Make this video with the user, from the first idea to a low-res preview in the content engine — talk through the brief, script, look, sound and 3D, wait for one approval, then build. Use at the start of a new video, when the user wants to change the brief/script/look before the build, or says "build the preview".
---

# Make the video: talk → one approval → preview

The user is on the engine's **Brief** page: a board on the left shows the project's files live, this conversation is
on the right. **Write every decision into its file as soon as it is agreed** so the board shows it; the board is how
the user sees the plan (they can't see your tool calls). Keep messages short and plain: the user is a video maker, not
a programmer. `ce` is the engine command (`D:\code_files\content-engine\ce.cmd`, on PATH in the engine's Claude panel).

| Board | File | What goes in it |
|---|---|---|
| Status | `brief/status.json` | `{"stage": "...", "note": "one line for the user"}` — update at every stage change |
| Idea | `brief.md` | topic, key message, audience, length, format, tone, must include / avoid |
| Hook | `brief/hooks.json` | five opening lines; the user picks one and the script is built on it |
| Script | `script.json` | scenes and lines (format below) |
| Look | `style.md` + `brief/frames/*.png` | style guide; 2–3 style frames at the checkpoint |
| Sound | `project.json` → `voice`, `music` | voice name + style direction; music prompt |
| Visual plan | `plan.md` | per scene: what is on screen, 2D or 3D, headlines, labels, effects |
| References | `references/`, `references/_study/` | the user's uploads and their study material |

Stages (`brief/status.json` → `stage`): `talking` → `awaiting-approval` → `building` → `preview-ready`.

## 1. Talk (`talking`)

**Start at once**: in your first reply set the stage to `talking`.
- If `brief/request.md` exists, the user already answered **what do they want to create?** on the home page, and
  may have dropped inspiration files with it (in `references/`, skills in `.claude/skills/`). Read the request, any
  skill files, and look at the references (their study material may still be processing: if
  `references/_study/<file>/info.json` says `"processing"`, start with the request and come back to that reference
  when it's done). Reply with what you understood in two or three lines, then ask your first questions. Don't ask
  again what they want to make.
- Otherwise ask one short question: **what do they want to make today?**

Don't read the rest of the project first (a new project's files are template placeholders; `script.json` has
`"placeholder": true` until you write the real script, which drops that flag). The project title in `project.json`
starts as a working title cut from the request: once the idea is settled, set `title` to a short proper title (the
folder name stays). Ask a few questions at a time, never a long form. Settle, in roughly this order, and propose concrete options when they are unsure:

1. **Idea**: topic, the one thing the viewer should take away, audience, length in seconds, format (default vertical
   1080x1920 at 24 fps, in `project.json` → `format`). Write `brief.md`.
2. **References** (if any): files are in `references/`, study material in `references/_study/<file>/` — `contact.jpg`
   (24 stills), `frames/` (about one per second), `cuts.json`, `palette.json`, `transcript.txt`. Before describing a
   style, look at the contact sheet and at least 12 stills, and use the measured palette and cut times. Tell the user
   what you see in 4–6 plain bullets and how it would carry over. Links: the user can paste them on the board; you can
   also run `yt-dlp` yourself into `references/` and then `ce pipeline . refs`. A `.md` skill the user dropped is in
   `.claude/skills/<name>/` and applies to this video — read it.
3. **Hook**: follow the `packaging` skill's Hook section: five opening lines in `brief/hooks.json`, scored with
   `ce hooks .`. The board shows the best two. **Wait for the user's pick before writing the script.**
4. **Script**: write `script.json`, built on the chosen hook: its text is the first cue, word for word, and the rest of
   the script pays off what it promises. One cue per sentence; calm narration runs about **2.8 words per second**, and
   with the lead-in, gaps and pauses a 30 s video holds about 65–75 words; `pause` (seconds) adds silence after a line for emphasis. Read the whole script back
   in chat once it's drafted and adjust together.
5. **Look**: the look comes from the engine's style catalog. The user browses it on the Catalog page; `ce catalog list`
   lists it. The styles are in `D:\code_files\content-engine\library\catalog\visual\<id>\` and
   `<workspace>\catalog\visual\<id>\`; each has `STYLE.md` and `preview/sheet.jpg`.
   - **The video already has a style** when `src/style/STYLE.md` exists (`project.json` → `style`; it came from the
     video's channel, and the board's Look card shows it). Read `src/style/STYLE.md` and the `visual-taste` skill, and
     keep to them.
     - If `project.json` → `style.locked` is true, the channel's look is locked: don't change the look. If the user
       asks, say it's locked in Settings → Channels.
   - **No style yet, or the user wants a different look** (and it isn't locked):
     - propose 2–3 catalog styles that fit the idea: read their `STYLE.md` "In one line" and look at their
       `preview/sheet.jpg`;
     - or let the user pick one with **Change** on the Look card;
     - apply it with `ce catalog use <id>`. It copies the style into `src/style/` (STYLE.md, style.json, scenes),
       `src/kit/`, `public/style/fonts/` and the board's cover.
   - **A new look from the user's files, a reference video or a description:** make it a catalog style with the
     `make-style` skill (in `<workspace>\catalog\visual\<id>\`, status `experimental`), then `ce catalog use <id>`.
   - **Without any catalog style** the template's default look applies (Editorial Neuro: `src/lib/theme.ts` and
     `src/components`).
   - **`style.md`**, the board's Look text: with a catalog style the engine writes it from the style. Add what is this
     video's own under its `## This video` heading (which accent means what here, which scenes are 3D), and never
     contradict the style. The engine keeps that section when the style changes. Without a catalog style, write
     `style.md` yourself (sections below).
6. **Sound**: narrator voice (`project.json` → `voice.voice`, e.g. cedar, marin, alloy, ash, coral, sage, verse —
   offer a sample with `ce pipeline . vo --sample "<a line from the script>"`, about $0.003, the board plays it) and the
   voice direction (`voice.style`); music mood → `music.prompt` (instrumental, tempo, instruments, structure, "sits
   under a quiet voice-over"). Sound effects are decided during the build.
7. **Visual plan**: `plan.md`, one block per scene. Say clearly which scenes use **3D** (Blender: realistic objects,
   camera moves; costs render time) and which are **2D** (Remotion: type, diagrams, labels; free and instant to change).

`script.json`:
```json
{"scenes": [{"id": "s01_hook", "title": "Hook", "cues": [
  {"id": "bored", "text": "You're bored.", "pause": 0.5},
  {"id": "hand", "text": "And your hand is already on your phone."}]}]}
```
Scene ids `sNN_slug` in order; cue ids short snake_case, unique within the scene; titles appear as chapter labels.

`style.md` sections: 1 Overall look · 2 Palette (table: role, hex, where used) · 3 Typography (faces, sizes, how many
words on screen, emphasis) · 4 2D elements (labels, diagrams, lines, pills) · 5 3D look (materials, lighting, camera) ·
6 Motion (easing, how type enters, holds) · 7 Transitions and rhythm · 8 Sound · 9 What is borrowed from which reference.

## 2. Checkpoint (`awaiting-approval`)

When idea, script, look, sound and plan are agreed:

1. `ce pipeline . vo --estimate` (free: timing from word counts) and build the 2D scenes for real (section 3, step 3),
   then render the **storyboard**: one frame per scene at its key moment, in order, into `brief/frames/`
   (`npx remotion still src/index.ts Reel brief/frames/01_<scene>.png --frame=<n> --scale=0.5`). For a 3D scene, one
   quick Blender still is enough. Look at every frame yourself before showing it.
2. Write `brief/status.json`: `{"stage": "awaiting-approval", "note": "Script (N lines, ~M s), look and plan ready. Building costs about $X (voice ~$0.01–0.05, music ~$0.08) and ~T min of 3D drafts."}`
3. Tell the user to check the board and press **Approve and build** (or say OK). **Wait.** Don't record voice,
   generate music or render 3D before the OK; that is the point of the checkpoint. Changes now are cheap: edit, re-render
   the style frames, stay in `awaiting-approval`.

## 3. Build the preview (`building`)

After the OK set the stage to `building` and give a one-line update after each step:

1. **Voice**: `ce pipeline . vo` (records only missing lines; replaces the estimated timing — everything keyed to cues moves with it).
2. **Music**: `ce pipeline . music` (one Lyria call, about $0.08), unless the user wants none.
3. **2D scenes**: one file per scene in `src/scenes/` (follow the existing components and `src/lib`), register them in
   `src/scenes/index.ts`, schema in `src/scenes/schema.ts`, defaults inside `<Composition id="Reel" defaultProps={{…}}>`
   in `src/Root.tsx` (an inline literal; never a variable). Remove the example `S01Intro` scene. Key every animation to
   `cue(scene, id)` + offsets; name a headline's props after its cue (`scenes.s03.response` for cue `response`).
   **With a catalog style** (`src/style/`):
   - the engine has already set the theme, type values, grain, vignette, margins and fonts from the style
     (`project.json` → `style.themed` is true). Don't redo them. If `themed` is false, set the theme in `src/Root.tsx`
     from `src/style/style.json` by hand: ink = background, bone = text, ash = muted, dim = faint, ember = accent,
     ice = accent2;
   - for fonts beyond display and body, import them from `src/style/scenes/fonts.ts`;
   - build each scene from the style's pieces in `src/style/scenes/` (parts and sample scenes are the starting
     point: copy and adapt them into `src/scenes/`), reading every value from `style.json`;
   - the template's `src/components` are Editorial Neuro's: use them only where they fit the style.
4. **3D** (only scenes the plan marks 3D): builders from the engine's library — copy
   `D:\code_files\content-engine\library\blender` to `blender/lib` (brain, phone; read its README) or write new ones
   there. One shot script per plate in `blender/` (see the library README for the header), timed from
   `src/data/timing.json`. Quick drafts: `ce blender . <shot>.py draft` (25 %, low samples; tell the user roughly how
   long). Add each plate to `project.json` → `plates` (`{"id", "from", "to"}` scene ids; add `"shot": "<file>.py"`
   if the script isn't `blender/shot_<id>.py`), then `ce pipeline . plates --from draft`. Final-quality renders
   come later, only when the user asks, through the engine's **Final** tab (see *Final render* below).
   **Shot script contract** (the final render queue relies on it): `final <f0> <f1>` renders frames f0..f1
   (1-based, plate-local) at full resolution into `renders/<id>/final/f_####.png` (or `f_#####`); frame 1 is the
   plate's first frame and the plate has `round(duration × fps) + 1` frames; frames the plate doesn't show in 3D
   still need a file (a black PNG is fine); `draft` does the same at 25 % into `renders/<id>/draft/`. Skipping frames
   that already exist is welcome but not required: the queue only asks for missing ones.
5. **Sound effects**: `sfx.json` (events relative to cues; kinds in the engine's `pipeline/sfx_lib.py`), then
   `ce pipeline . sfx`, `ce pipeline . stems`, `ce pipeline . captions`.
6. **Check**: `npm run typecheck`; render a still from every scene and look at each; fix what's off.
7. **Quality gate**: `ce review .` (a few minutes, nothing paid). It renders the review sheets, measures the text,
   pacing and sound, then a fresh Claude that has never seen the video writes notes. Read `review/REPORT.md`:
   - fix everything marked FAIL and every P0 and P1 note, text first, then timing, then detail, and run `ce review .`
     again. At most 3 rounds, then stop and tell the user what's left and why;
   - WARN lines are questions: fix them or keep them on purpose and say why;
   - ask first if a note means spending money (re-recording voice, new music, final 3D) or changes the script or the
     style the user approved. Then leave it open and say so;
   - look at the sheets yourself too: the numbers can't see a bad picture.
8. Set `{"stage": "preview-ready", "note": "Preview ready: open the Editor tab."}` and tell the user what to look at
   first, the 2–3 weakest points you know of, and the moments `review/REPORT.md` lists under *For your ears*: you
   can't hear the video, so say so.

## Final render (after the preview)

When the user wants the finished video, point them to the **Final** tab (or call the `render_start` tool if they ask
you to start it). The engine's queue runs it in the background: sound check, 3D final frames (only missing ones,
resumable), plate encoding, the Remotion render and the loudness-levelled `out/delivery.mp4`. Don't run these steps
yourself in the terminal: the queue survives the browser closing and resumes after a restart; your terminal doesn't.
`render_status` shows the job and what would block a new one.

**If the engine hands you a failed render** (a message starting `[content engine]`): read the step's log (path in
the message), find the cause, fix it in the project (shot script, scene code, a missing file…), check the fix on a
single frame (`ce blender . <shot>.py frame <n> final`, or `npx remotion still …`), then `render_resume`. Ask the user
first when the fix costs money (re-recording voice, new music), re-renders 3D frames that already exist, or changes
the script or the look. If you can't fix it, explain the problem in two or three plain sentences.

## Packaging (after the preview)

When the user asks, or the **Package** tab's button sends you the request, follow the `packaging` skill: ten titles,
three thumbnails and five post captions. Nothing is uploaded. The user picks on the Package tab, and a picked title or
caption goes into the Publish drafts.

## Publish (after the final video)

The engine's **Publish** page posts the video file the user picked there (usually `out/delivery.mp4` from the Final render;
it can be a draft or another render in `out/`: `publish_status` shows which): YouTube through its API (the engine uploads;
`youtube_upload` only when the user asks), a Facebook Page and Instagram through Claude in Chrome (you, in the user's
logged-in Chrome profile). Your panel is on the right of that page.

**Drafting** (when asked, or by the tab's button): write `publish/youtube.json`, `publish/facebook.json`,
`publish/instagram.json` from `script.json` and `brief.md`; keep fields the user already filled in, including a title or
caption they picked on the Package tab. The tab reloads them.
- YouTube `{"title", "description", "tags": [], "categoryId": "27", "privacy", "publishAt", "madeForKids", "synthetic"}`:
  title ≤ 100 characters, no `<` `>`; description: two or three plain lines on what the viewer learns, then chapters
  if the video has 3+ scenes of 10 s or more (`0:00 Hook` first, times from `src/data/timing.json` scene starts), then
  2–3 hashtags; tags: 5–10 short phrases; leave `privacy` (its default comes from the engine's Settings) and `madeForKids` to the user unless they
  told you.
- Facebook `{"page", "format": "reel"|"post", "caption"}` and Instagram `{"account", "format", "caption"}`: a hook
  line, one or two sentences, a question or call to action, 3–5 relevant hashtags (Instagram ≤ 2,200 characters,
  ≤ 30 hashtags). Don't change `page`, `account` or `format` unless asked (`format` "reel" | "post" is the user's choice
  each time; leave it null if they haven't made it).
- `publish_status` shows the video's facts and per-platform notes (Short/Reel length, shape) and draft problems.

**Posting through Chrome** (a message starting `[content engine] Please post this video…`): use the Claude in Chrome
tools (if they aren't available, tell the user to check that the Claude in Chrome extension is installed, signed in
and on in Chrome). Open a new tab, go to the Page or
account, start a Reel or post as asked, attach the video (if your tools can't attach a file from disk, ask the user to add
it: the Publish page's "Copy file path" button copies the path, which they paste into the file picker's File name box), paste the caption exactly,
keep other defaults. **Stop before the final Post/Share/Publish button**, call `publish_report` with status
`ready-to-post`, and tell the user to check it and click Post. Never click it yourself. After they've posted, find the
post's link if you can and report `posted` with the url; if it couldn't be done, report `failed` with a short note.
Stop and ask if a login, checkpoint or security prompt appears: never enter passwords or codes.

## Rules

- **The look:** follow the `visual-taste` skill. The video's style (`src/style/STYLE.md`) wins over it, and the user's
  words win over both.
- Never spend money (voice, music) or start long renders before the checkpoint OK, except a voice sample.
- Newest user feedback wins; if a request changes something already approved, say what it affects.
- Keep `brief/status.json` truthful: the user reads it on the board.
- If something fails (a download, a render), say so plainly with the error and the next step.
