# Research video skill links 1-10

## Research report: 10 video skills/tools from the user's Instagram list

What I did: pulled repo metadata with `gh api` and read every SKILL.md and README myself, plus the key reference files and scripts. Nothing was installed or run. Stars and pushes are as of 2026-10-29. Raw downloads are in `C:\Users\subra\AppData\Local\Temp\claude\d--code-files-content-engine\d397bad3-8832-4aa1-9c55-4c7d7f94162b\scratchpad\vidresearch\`.

---

### 1. video-use (browser-use/video-use)
- **What it is.** "Edit videos with coding agents." You put raw camera footage in a folder and Claude Code returns `edit/final.mp4`. MIT, Python. **30,076★**, 3.5k forks, created 2026-04-12, last push 2026-10-08.
- **Dependencies:**
  - ffmpeg.
  - **ElevenLabs Scribe for transcription.** This is a paid API key, and the skill explicitly rejects running Whisper locally.
  - Optional: yt-dlp; Node 22+ for HyperFrames or Remotion animation slots; Manim (a vendored `skills/manim-video/` with 14 reference files); PIL.
- **Structure:**
  - One root SKILL.md with these sections: Principles, 12 Hard Rules, directory layout, Helpers, an 8-step process, cut craft, the packed transcript, an editor sub-agent brief, colour grade, subtitles, animations, music/SFX, output spec, EDL format, `project.md` memory, anti-patterns.
  - `helpers/`: `transcribe.py`, `transcribe_batch.py`, `pack_transcripts.py`, `timeline_view.py`, `render.py`, `grade.py`. Plus tests.
- **Core technique.** The LLM never watches the video. It reads two things:
  - `takes_packed.md`: a phrase-level transcript of about 12 KB, broken on silences of 0.5 s or more, with `[start-end]` per line.
  - On-demand PNGs from `timeline_view`: filmstrip plus waveform plus word labels, used only at decision points.
  - Cut decisions go into an `edl.json`. Rendering extracts each segment, then concatenates with `-c copy`.
- **Hard rules worth knowing:**
  - Subtitles go last in the filter chain.
  - 30 ms `afade` at every boundary.
  - Overlays use `setpts=PTS-STARTPTS+T/TB`.
  - The SRT uses output-timeline offsets.
  - Never cut inside a word; pad each cut by 30–200 ms.
  - Cache transcripts.
  - One parallel sub-agent per animation.
  - No editing until the user approves the strategy.
- **Quality ideas:**
  - Silences of 400 ms or more are the cleanest cut points; 150–400 ms needs a visual check; under 150 ms is unsafe.
  - **Payoff sync:** start an overlay early by its reveal duration so it lands on the spoken payoff word.
  - Floor of 3 s per narration card (5–7 s for simple cards, 8–14 s for diagrams); hold the last frame at least 1 s.
  - Never reveal two independent elements at once; never use linear easing.
  - Fonts fail silently, so assert `document.fonts.check(...)` before rendering.
  - Sound: use fewer effects and time them to their measured attack; duck music 12–15 dB under speech; master once with two-pass loudnorm to −14 LUFS / −1 dBTP; measure with ebur128 and say the mix was measured, not heard.
- **Review loop:**
  - Self-evaluate on the *rendered* output at every cut boundary (±1.5 s), capped at 3 passes.
  - For anything that will be published, a critic sub-agent is briefed to "roast, not praise".
  - The 10-point parallel-animation brief ends with "Do not ask questions."
- **Useful vs fluff.** Very concrete and correctness-focused. The ffmpeg rules are real pitfalls. It is built for camera footage, but the animation, audio and review sections are general. Fluff is limited to "invent freely" and the token-count rhetoric.

### 2. video-editing-skill (6missedcalls)
- **What it is.** Bash scripts plus ffmpeg plus local openai-whisper: trim, jump-cut, captions, text overlay, speed. MIT. **48★**. Created 2026-02-26, last push 2026-02-27; it was effectively built in one day and tested with OpenClaw.
- **Structure.** SKILL.md (it has **no YAML frontmatter**, i.e. no `name`/`description`; I'm not sure how Claude Code handles that), `scripts/edit.sh` (fixed order: trim → jumpcut → speed → caption → overlay), `trim.sh`, `jumpcut.sh`, `transcribe.sh`, `caption.sh`, `overlay-text.sh`, `onboard.sh`.
- **What the code actually does:**
  - **Jump cut:** `silencedetect` at a fixed −30 dB, 0.5 s minimum, 0.1 s padding. Segments are extracted with `-c copy` and concatenated with no audio fades, so cuts snap to keyframes and can pop.
  - **"Hormozi word-by-word" captions:** really phrase-level Whisper SRT, burned with Arial Black. There is no word-level timing.
  - Default Whisper model is `base`.
- **Verdict.** A simple, readable starting point. The marketing overstates it.

### 3. Cut Video (Tella)
- **Where it is.** The tella.com/skills gallery does **not** list it; that page shows 8 motion-graphic skills (Exploded teardown, Flower transitions, Grainy gradient scenes, Kaleidoscope, Logo mask reveal, Minimal statements, Tech-ey explainer diagrams, Text bubble stack). I found it at tella.com/skills/cut-video. Repo: **louisedesadeleer/cut-video** by Louise de Sadeleer of Tella. MIT, **116★**, created 2026-05-15, last push 2026-07-09. Files: a 33 KB SKILL.md, `make_review.py`, README.
- **Install.** `git clone ... ~/.claude/skills/cut-video`, then restart Claude Code.
- **Dependencies:**
  - ffmpeg, the openai-whisper CLI.
  - **Montreal Forced Aligner**, auto-installed through brew and miniforge/conda.
  - Very macOS-centric: `videotoolbox`, brew, `open`, `/tmp`.
- **Pipeline:**
  1. Make a 1080p H.264 proxy (checks orientation first).
  2. Whisper supplies the transcript *text* only.
  3. MFA aligns it, giving word boundaries of about 10–20 ms and explicit silence intervals.
  4. Build the cut list:
     - a gap table with four presets: aggressive, balanced, sentimental, documentary;
     - fillers cut with 50 ms padding;
     - a hedge and weak-transition list;
     - false starts detected by 3-gram fuzzy matching;
     - full-line retakes detected by 4-gram matching in a 60 s window, keeping the last take;
     - laughs and comedic beats protected.
  5. **Step 2.5:** re-transcribe every planned keep region in an isolated window with `small.en` to check the boundary.
  6. Print a plan summary (with self-check targets: median cut 1.1–1.5 s, 40–60% shorter) and render.
  7. Render with a trim+atrim+concat filtergraph, *not* `select`, which desyncs the audio.
  8. Optional: a self-contained HTML timeline editor (canvas waveform, drag to delete, "Copy decisions for Claude" as JSON).
- **Hard-won lessons** (dated "burned" notes):
  - Set the silence threshold relative to the measured noise floor (floor + 6 dB), never a fixed −30 dB.
  - A low-dynamic-range guard: when speech is less than about 8 dB above the floor, energy thresholds are useless.
  - The "stretched word" alarm: a short word lasting a second or more hides a pause or a whole retake.
  - Out-of-vocabulary words (e.g. "AI") vanish from the MFA alignment.
  - Verifying with Whisper on the output misleads in both directions, so use cross-ASR verification; it uploads to Tella for a second transcript.
- **Discrepancy.** Tella's page says it waits for approval. The current SKILL.md says *render immediately, don't wait* (changed 2026-07-09).
- **Verdict.** The most rigorous silence and filler cutter in this list, for talking-head footage. Some content is personal to Louise's own videos.
- **Related.** Sibling skills clipify (9:16 reframe plus word captions), add-zooms and b-roll-finder. Tella's MCP (`https://api.tella.com/mcp`, 100+ tools, needs a Tella account) is separate.

### 4. Video Trimmer (mcpmarket)
- **What it is.** The skill `video-trim` from **InfQuest/vibe-ops-plugin**. **0★** on GitHub; mcpmarket's "010" is ambiguous. No license. Last push 2026-01-19.
- **Structure.** One SKILL.md, written in Chinese:
  1. ffprobe the input.
  2. A mandatory AskUserQuestion for 7 choices: start, end, CRF tier, audio handling, extras (fades, thumbnail, forced keyframe), format, output path.
  3. Build the ffmpeg command.
  4. Verify with ffprobe.
- **Rest of the plugin:** audio-extract, audio-transcribe (Whisper with word timestamps), image-gen (OpenRouter), video-concat, video-gen, youtube-download (yt-dlp with Chrome cookies), install-app (macOS).
- **Verdict.** A thin wrapper around standard ffmpeg trimming. Mostly fluff.

### 5. Video Editor (claudecowork.im)
- **What it is.** A **subagent**, not a skill. The directory itself labels it "Low confidence." File: `jeremylongshore/claude-code-plugins-plus-skills/.../video-editor-ai/agents/video-editor.md`. The repo has since been renamed tons-of-skills-marketplace: **2,884★**, MIT, active. The agent is set to `model: sonnet` with Read/Write/Edit/Bash.
- **Content.** Generic prose:
  - analysis, automated-editing and enhancement phases;
  - pacing tables by content type (target words per minute, cut frequency);
  - a simulated session with fake progress bars;
  - DaVinci Resolve Python examples. Methods like `GetAudioData()`, `ApplyArriLookLUT()` and `timeline.ApplyTransition()` don't look like the real Resolve scripting API. I'm fairly but not fully sure; check before relying on it.
  - No scripts.
- **Verdict.** Mostly fluff.

### 6. HyperFrames (heygen-com/hyperframes), in depth
- **Identity.** HeyGen's open-source "Write HTML. Render video. Built for agents." Apache-2.0. **75,281★**, 6.8k forks. Created 2026-03-10, pushed today. **v0.8.217**: pre-1.0, several releases a day, about 6,400 commits, 100+ contributors. Used in production at HeyGen.
- **Packages:** cli, core, engine (Puppeteer + FFmpeg), producer, studio, player, shader-transitions, aws-lambda, gcp-cloud-run, lint, parsers, sdk.
- **Requirements:** Node 22+ and FFmpeg. The FAQ says the CLI, rendering from PowerShell and the Studio app all work on Windows.

**Rendering model**
- A composition is an HTML file. Timed elements carry `class="clip"`, `data-start`, `data-duration` (seconds) and `data-track-index`. The root has `data-composition-id`, width, height and duration.
- Motion comes from seekable runtimes through "frame adapters": GSAP, CSS, Lottie, Three.js, Anime.js, WAAPI. A GSAP timeline must be created `paused` and registered on `window.__timelines[id]`.
- For each frame, the engine computes `t = floor(frame)/fps`, calls `seekFrame` on every adapter, captures the pixels atomically with Chrome's `HeadlessExperimental.beginFrame`, then FFmpeg encodes and mixes the `<audio>`/`<video>` elements.
- **Determinism contract:**
  - no `Date.now`, no unseeded `Math.random`, no fetches, timers or `repeat:-1`;
  - never tween `display`/`visibility` on a `.clip`;
  - fonts via `@font-face` from `assets/fonts`.
  - `--docker` pins Chrome, fonts and the encoder.
- **Outputs:** MP4, MOV ProRes 4444 with alpha, WebM VP9 with alpha, GIF, PNG, HLS; HDR10 and 4K; `render --batch` from variable rows; quality tiers draft / looks / delivery.
- **Render paths:** local, HeyGen cloud (bills credits), your own AWS Lambda or Cloud Run.

**Agent authoring (the skills)**
- 7 published skills. The core set:
  - `/hyperframes`: 12 contract rules, "keep it editable" rules, the work loop, and a router to references: `types/{launch,explainer,music,data,vertical,3d,character}`, story, spec, storyboard, review, sound, captions, overlays, motion, look, film, format, runtimes.
  - `/hyperframes-cli`: commands grouped by job. `capture <url>`; `check --json` covering lint, runtime, layout and contrast; `snapshot`; `keyframes`; `audio`; timeline edit verbs with undo receipts; `beats`; `tts`; `transcribe`; `normalize-audio`; `history`.
  - `/hyperframes-registry`: about 450 installable blocks and components (transitions, caption styles, charts, maps, 3D, camera moves) via `catalog` / `add`.
  - `/media-use`: HeyGen or free paths. Free: Kokoro TTS, MusicGen, Openverse SFX, Whisper/Parakeet, FLUX, background removal.
- On demand: `/figma`, `/slideshow`, `/remotion-to-hyperframes`. The last one maps `useCurrentFrame`/`interpolate` onto tweens, refuses React state machines, and compares both renders frame by frame.
- Six more internal skills ship in `.claude/skills`, e.g. motion-doctrine with seam-gate scripts.

**Work loop for a film over 15 s**
1. **Three storylines** in words only, each with its own world, device and form, from tables of about 10 devices and 8 forms. The person picks one.
2. **`SPEC.md`** turns every adjective into a number (LOOK, OBJECTS, MOTION, SHOTS) and keeps a **BANNED-by-default list**:
   - a dark void, glow or particles;
   - purple gradients or glass cards;
   - a cream-paper serif look;
   - everything fading and sliding up;
   - three cards in a row;
   - a docked logo.
3. Optional **storyboard**: stills posed in `index.html` and snapshotted into `boards/storyboard.html`; wait for "go".
4. Build.
5. `check --json`, which warns on craft problems: `line_unread`, `dead_stretch`, `text_below_floor`, `first_frame_empty`, `film_silent`.
6. `snapshot --review`: contact sheets per scene, cut strips at ±0.2 s, and a 360 px phone sheet.
7. `REVIEW.md` with P0/P1/P2 notes in the form `t=4.2s · where · problem → exact change`. Optionally a fresh sub-agent reviewer. "Never score the film out of 10."
8. Render only on approval.

**Explainer and sound guidance**
- Ground the explainer in a situation the viewer knows.
- One diagram that grows, each part appearing when the voice names it, about 19 spoken words per scene.
- Labels sit on the parts; no legends.
- "a beautiful wrong diagram is worse than none".
- When narrated, the voice is the clock.
- SFX peak one frame *after* the picture.
- Music under voice at about 0.14 volume; −16 to −14 LUFS.
- 3D: simulate once at load, then `render(t)` stays a pure function.

**Versus Remotion (HyperFrames' own doc)**
- Both use headless Chrome plus FFmpeg. HTML plus seeking versus React plus a frame function; no build step versus a bundler.
- Licence: Apache-2.0 versus Remotion's licence (free for individuals and companies of 3 or fewer).
- They concede Remotion is more mature, has a simpler mental model, and has the stronger Lambda. HyperFrames "breaks quietly if you don't" follow its contract.
- Their head-to-head (one run each on Opus 5.5) is the vendor's own test: 12m30 vs 11m50, about 950 MB of node_modules vs nothing.

**Caveats**
- CLI telemetry is on by default (`npx hyperframes telemetry disable`).
- The skills tell the agent to send `feedback --rating` to a public channel after each render.
- The skills promote the desktop app and "Framey".
- HeyGen features cost credits.
- The API moves fast. Skills from the skills.sh registry can lag `main`, and third-party HyperFrames skills (e.g. #9) are already out of date.

### 7. Remotion Motion Graphics (haidrrrry/claude-remotion-skill)
- MIT. **703★**. Created 2026-06-13, last push 2026-08-12.
- **Structure:**
  - `remotion-motion-graphics/SKILL.md`: 10 non-negotiable rules and a 5-step workflow.
  - `references/motion-patterns.md`: 17 copy-paste components, from entrances, staggers and word reveals through grade, grain, Ken Burns, counters, transitions and motion blur to word-synced captions via `createTikTokStyleCaptions`.
  - `references/design-rules.md`: palettes, type sizes, a 30 s reel structure, sound design, pre-delivery checklist.
  - `assets/theme.ts`, plus an `examples/` project with Node scripts that synthesise SFX and music as WAVs.
- **Rules:**
  - no linear easing, always clamp;
  - entrances animate 2–3 properties; stagger 3–6 frames; exits faster than entrances;
  - a 5-layer stack: mesh background → assets → graphics → grade → grain and vignette;
  - Ken Burns on every still; `<OffthreadVideo>`;
  - "idle breathing";
  - all timing derived from fps; one theme object;
  - a mandatory render → `remotion still` → look → fix loop.
- **Good catches:** `em` gaps resolve against the parent's font size; emoji icons break the palette.
- **Conflicts and age:**
  - Its mesh, glow and breathing defaults are exactly what HyperFrames bans as generated-looking.
  - SFX "2–3 frames BEFORE" the visual, versus HyperFrames' one frame after.
  - It uses `<OffthreadVideo>`, while the official Remotion skills now point to `<Video>` from `@remotion/media`.
- The README is SEO-heavy.

### 8. video-shotcraft (Vincentwei1021)
- Apache-2.0 (Remotion's own licence still applies). **14,597★**, 1.4k forks. Created 2026-07-19, pushed today.
- SKILL.md is **in Chinese**; the README is in English, Chinese, Japanese and Russian.
- The template pins Remotion **4.0.484** and React 19. Some components need three / @react-three/fiber.
- **Purpose:** product promos built from a real web app.
- **Contents:**
  - **124 shot recipe cards** in 10 categories (camera, data, effects, interaction, opening, outro, rhythm, transition, typography, ui-entrance), each with tuned demo TSX, plus an online gallery of 150 previews.
  - The "Ink Press" full template.
  - Components: PageCam (2.5D page camera), ClipCard, DigitRoll, FlashCut, Caption.
  - Headless page capture (2x full-page textures, element cutouts, `layout.json`).
  - Freesound SFX search and download (CC0 default, licence and provenance ledger, measurements); 5 BGM tracks.
  - A CapCut-style browser Workbench.
  - JianYing export (verified on Mac; Windows untested).
  - Upload-Post publishing.
- **Modes:** template, autonomous, or co-creation. Co-creation confirms the product brief, decision table, visual direction, styleframe, shot mapping and storyboard in turn.
- **8-stage pipeline:** product understanding → visual direction and styleframe → feature-to-shot mapping → storyboard → final capture → per-shot implementation → sound → acceptance.
- **Strong ideas:**
  - The visual language comes from the product's own design tokens.
  - Each motion technique is the hero only once per film.
  - Hold at least 1 s after the brand mark lands; their feedback history only ever said "slower".
  - Every reviewer is a clean-context sub-agent and must cite frame numbers.
  - Seeded randomness (mulberry32).
  - Minimum text height: 5% of frame height for captions, 3% for auxiliary text.
- **Beat sync, the most rigorous I found:**
  - librosa `beat_track`, then a least-squares grid fit to get the true BPM and phase (the scalar tempo can be 2%+ off);
  - test 0.5x / 1x / 2x grids;
  - separate the drums with HPSS or Demucs;
  - classify kick, snare and hi-hat by band (40–160 Hz; 150–500 Hz + 1–3 kHz; 6–14 kHz);
  - accept the grid only at ≥98% match, mean error under 10 ms, drift under 5 ms;
  - write the timeline in beat numbers, `beatF(n)`;
  - after rendering, measure cut error (≤3 frames);
  - at most 3 full-frame beat slams per film;
  - deliver versions with and without the BGM.
- **Fluff:** after delivery, the skill tells the agent to ask the user to @-mention the author and submit to the showcase. The README has sponsor ads.
- **Sibling: video-talkcraft** (1,945★). Voiceover-driven explainers with word-level VO sync, 108 cards, a SHOTBOOK storyboard and segmented parallel Remotion renders. It is **PolyForm Noncommercial**, so not free for commercial use. It is the closest match to narrated explainers; I read only its README.

### 9. Vertical Video Editing (nopefallacy)
- MIT. **65★**. Created and last pushed 2026-06-21 (one day).
- **Built on HyperFrames, not Remotion**, and against a June 2026 version of it.
- **Structure:**
  - One 38 KB SKILL.md with inlined appendices: editorial look (10 layout patterns), style theming, camera moves with an anti-jitter contract, SFX and audio, edit-report template, provenance (adapted from robonuggets/hyperframes-helper).
  - `scripts/verify-render.mjs`: an ffprobe gate checking 1080×1920, duration ± tolerance, h264/yuv420p, audio present.
  - `styles/_template/FRAME.md` and a `vibe-life` style pack.
- **Inputs:** an approved `script.md`, talking-head or VO A-roll, `assets/manifest.json`.
- **Techniques:**
  - hook in the first 1–3 s; A-roll as the spine with B-roll covering it;
  - non-metronomic cuts as short as 0.2 s;
  - a stacked split (B-roll on top, face below) with a seam caption as the workhorse layout;
  - **face-safe `object-position`**: eyes in the upper third;
  - small eased pushes (scale 1→1.12 over 2–3 s) with `will-change`, `translateZ(0)` and `force3D`;
  - a float-precision clip-overlap gotcha;
  - `cqw`/`cqh` container units;
  - ffmpeg-synthesised SFX (`anoisesrc`, `sine`) mixed into one master track with `adelay` + `amix normalize=0`, SFX 12–18 dB under the voice.
- **Caveats:**
  - The README's `npx vertical-video-editing-skill` **returns 404 on the npm registry** (not published), so install by hand from the repo's `bin/install.mjs`.
  - Some advice conflicts with current HyperFrames: the single pre-mixed track, and vibe-life's cream paper, italic serif and pills, which HyperFrames now bans by default.

### 10. Remotion Agent Skills (official)
- Docs: remotion.dev/docs/ai/skills. Repo: **remotion-dev/skills** (5,866★, synced from the monorepo's `packages/skills`, last push 2026-10-26). Skills carry `version: 4.0.539`.
- **Install:** `npx skills add remotion-dev/skills`, `gh skill install remotion-dev/skills`, or `bun create video`.
- **Skills:**
  - best-practices (a router)
  - create
  - markup
  - studio
  - render
  - maps (techniques for Cesium, Mapbox, MapLibre, MapTiler, static maps, with scripts)
  - captions (the `Caption` JSON type; local transcription with `@remotion/whisper-webgpu`, which needs a compatible GPU; SRT import; display)
  - saas
  - interactivity
  - docs (fetches current docs as Markdown)
  - license (the page says from 4.0.540; I didn't see it in the repo tree)
  - upgrade
  - multimedia (Mediabunny metadata)
- **Markup rule files (~35):** 3d, audio, audio-visualization, calculate-metadata, color-correction, compositions, connected-compositions, cropping, effects, embedding-videos, ffmpeg, fonts, gifs, html-in-canvas, lottie, measuring-text, motion-blur, multi-scene-video, parameters, sequencing, sfx, silence-detection, text-highlights, timing, timing-props, transitions, video-editing, voiceover, and more.
- **Key rules:**
  - Preserve edits the user made outside the chat.
  - **Don't render unless explicitly asked**; open the Studio preview first.
  - Keep `useCurrentFrame` in the smallest component that needs it.
  - Take `fps` from `useVideoConfig`, and write `seconds*fps` inline on the JSX so Studio can edit it.
  - CSS and Tailwind animations don't render.
  - Use `Easing.bezier` / `Easing.spring`; individual `scale`/`translate`/`rotate` properties over transform strings; `output:'perceptual-scale'` for scale.
  - Media: `<Video>`/`<Audio>` from `@remotion/media`, `<CanvasImage>`.
  - Built-in `@remotion/effects` through an `effects` prop.
  - For Studio-editable timelines: `Interactive.*` wrappers, a named `Track`, or `TransitionSeries`.
  - Voiceover: ElevenLabs per scene, with `calculateMetadata` sizing the composition to the audio durations.
  - Adaptive silence detection: loudnorm `input_thresh` feeds `silencedetect`.
  - The SFX list on remotion.media is mostly meme sounds.
- **Version note.** The user's `runtime/package.json` pins Remotion **4.0.535**. I did not check which of these newest APIs exist in 4.0.535: `Interactive`, `Track`, `@remotion/effects`, `perceptual-scale`, `whisper-webgpu`.

---

### Patterns across the list
- **Shared quality ideas:**
  - render, then extract stills, then look, then fix;
  - a fresh-context critic sub-agent;
  - measure audio rather than claim it sounds good;
  - word-boundary cutting with padding, from forced alignment or word-level ASR;
  - seeded determinism;
  - turning adjectives into numbers;
  - holds after a landing;
  - one hero per shot;
  - captions in 2–5 word groups;
  - 9:16 safe zones (HyperFrames: nothing in the top 168 px, text inside 168–1330 px).
- **Direct contradictions:** SFX timing (before the visual vs one frame after); the mesh/glow/breathing/cream-paper aesthetic (prescribed by #7 and #9, banned by #6); one pre-mixed audio track vs multiple tracks.
- **Built for camera footage** (#1–5, 9) vs **animated/explainer authoring** (#6, 7, 8, 10, talkcraft).

### Couldn't open, or only partly checked
- **tella.com/skills:** no "Cut Video" in the gallery. I found it at tella.com/skills/cut-video and on GitHub.
- **mcpmarket:** the SKILL.md tab and security-scan result didn't render, so I read the source on GitHub instead.
- **claudecowork.im:** no author shown; I read the file on GitHub.
- **Not read:**
  - HyperFrames: references format, runtimes, film, look, overlays; its six internal skills.
  - video-shotcraft: individual shot cards, sound-design, sfx-sourcing, guided-free-creation.
  - video-talkcraft: everything beyond the README.
  - Remotion: every rule file.
- **Not checked at all:** no demo videos watched, no render speeds tested, and no Windows behaviour verified. All star counts, "verified" claims and benchmarks are self-reported by the authors.
