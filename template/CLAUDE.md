# Conventions for Claude Code in this video project

This is a content-engine project; the engine is `D:\code_files\content-engine` (read its README for the pipeline).

- Read `README.md` first, then `notes/NOTES.md`. Work through notes top to bottom and mark each `[x]` with a one-line
  summary of what changed.
- **New video or changing the plan:** follow the `make-video` skill (`.claude/skills/make-video/SKILL.md`): talk the
  brief through with the user, keep the Brief board files current, wait for the one approval, then build the preview.
  `brief/status.json` says which stage the video is in.
- **Never `npm install` here.** `node_modules` is a junction to the engine's shared packages (`content-engine/runtime`).
  If it is missing or broken: `ce link`. A new package goes into the engine's `runtime/`, and only after the user agrees.
- Timing: never hardcode absolute seconds in scenes; use `cue(scene, name)` + an offset. Offsets a human may want to
  tweak belong in `src/scenes/schema.ts`, with defaults in `src/Root.tsx`.
- The props live inline in `<Composition id="Reel" defaultProps={{ … }}>` in `src/Root.tsx`: the only place Studio's
  props editor can save to (checked against Remotion 4.0.535). Never move them into a variable or spread them, or
  saving breaks. Studio reformats the literal when it saves; that is fine. Scene previews read them from there.
- **The user is usually looking at Studio.** When the content engine has the project open, each message starts with
  where they are (time, scene, narration line, headlines on screen), and the `content-engine` MCP tools are available:
  `editor_state` (call it whenever they say this/here/now and the note is missing or stale), `view_frame` (look at the
  frame before and after a visual change), `seek`, `playback`, `show_setting` (open the props editor at a path so
  they can see the value you changed), `timeline`.
- Name a headline's props after its narration cue (`scenes.s03.response` for cue `response`): that is how the engine
  tells which headline is on screen.
- Per video: `project.json`, `script.json`, `sfx.json`, `src/scenes/*`, the props in `src/Root.tsx`, `blender/*.py`.
  `src/components` and `src/lib` are engine code copied in when the project was created: changing them here changes
  only this video, which is fine when the video needs it.
- Generated, never hand-edited: `src/data/*.json`, `public/**`, `audio/vo_full.wav`. Regenerate with
  `ce pipeline <project> vo | music | stems | sfx | plates | captions | audio`. `vo` and `music` make paid OpenRouter
  calls, but only for missing files; `audio` re-runs everything free after a script or timing change.
- Visual rules live in `src/lib/theme.ts`: one text colour; italics for emphasis; accents only in diagrams; type stays
  in the dark band; labels on pills.
- Verify visually: `npx remotion still src/index.ts Reel out/x.png --frame=N`, and look at it before reporting.
  Scene compositions (`S01-…`) start at frame 0 for quick checks.
- 3D: shot scripts in `blender/` (`ce blender <project> shot.py draft | final | frame <n>`), builders in `blender/lib`.
  Final renders can take hours: prefer 2D fixes, and ask before starting a long render.
- Do not commit or push unless the user asks. Do not add dependencies without asking.
- Final renders go through the engine's Final tab / `render_*` tools (resumable background queue), not the terminal.
  If the engine hands you a failed render, follow *Final render* in the make-video skill. Without the engine:
  `npm run render`, then `npm run deliver` (guides are off via `props/final.json`).
