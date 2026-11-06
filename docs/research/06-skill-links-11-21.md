# Research video skill links 11-21

## Research report: 11 short-form video, caption and thumbnail skills (items 11–21)

I read every GitHub item's README, SKILL.md and reference files through `gh api`, and the main scripts where they mattered. Star counts and last-push dates are from the GitHub API on 2026-10-29. Nothing was cloned, installed or run.

**The short version:**
- Two items are not what their names suggest. **Thumbnail Skills (#16)** points at a backend that no longer exists. **Caption Engine (#21)** writes the post caption, not on-screen subtitles.
- **Shorts Video Creator (#12)** can't run as published: it calls helper scripts its author never released.
- The strongest material, by a wide margin:
  - **Barty-Bart/motion-graphics (#14)**: a deterministic seek(t) HTML render, a stills check, and a measured sound pass.
  - **claude-shorts (#13)**: a scoring rubric, safe zones, Remotion caption code and boundary snapping.
  - **claude-video (#18)** and **claude-video-vision (#17)**: how to pick frames for Claude to look at.

---

### 11. Clipify — louisedesadeleer/clipify
- **Author / stats:** Louise de Sadeleer, who runs marketing at Tella. 618★, 69 forks, MIT, last push 2026-08-24.
- **What it does:** turns a long talking-head video (podcast or interview) into 9:16 social clips with burned-in, OpusClip-style word-by-word captions.
- **Structure:** one SKILL.md (about 14 KB) plus 5 small Python scripts:
  - `analyze.py`: builds a speaker timeline.
  - `build_pan.py`: writes the ffmpeg crop expression.
  - `build_ass.py`: writes ASS captions.
  - `audio_align.py`: FFT cross-correlation.
  - `detect_transients.py`: finds sharp sounds.
- **Dependencies:** ffmpeg, openai-whisper (`tiny.en`, word timestamps), numpy. No OpenCV, no cloud. Built for macOS (`-hwaccel videotoolbox`); the README says to delete that flag on Windows.
- **Workflow:** two modes.
  - **Dialogue mode:** Whisper transcribes, then Claude scans the text for funny signals: punchlines, "wait/no way", reversals, awkward pauses, filler, quotable one-liners, audio peaks. It proposes 3–5 clips of 10–25 s as `[start, end, why, title]`.
  - **Action mode:** skips Whisper and runs spectral-flux transient detection on the 1–6 kHz band to cut on every axe chop or drum hit. It gives tuning tables for flux threshold, minimum gap and band per sound type.
  - **Then, in both modes:** trim with `-c copy` → choose format → reframe → captions.
- **Key techniques:**
  - **Speaker tracking without face detection.** Claude eyeballs mouth and chin boxes on one probe frame, checks them by drawing boxes, and gives up after two tries. ffmpeg then measures per-frame motion inside each box (`tblend` difference + `signalstats` YAVG). The louder box is the speaker, with a 1 s minimum dwell. The result becomes a hard-cut crop x-expression.
  - Split-screen option where the active speaker's tile goes on top.
  - Speed-ramp reveals with `setpts` + chained `atempo` instead of trimming.
- **Quality ideas worth noting:**
  - "Step 1.5": sample one frame at each candidate time and look at it before rendering, because audio detection only proves there was a sound, not that the event was on camera.
  - A "Pitfalls (lessons from prior runs)" section.
  - Count scene cuts inside a clip before trusting fixed boxes.
- **Captions:** 3 presets: opus (Arial Black 100, 3-word chunks, yellow active word), karaoke, minimal. They render at a 1080×1920 frame size with MarginV 280. There are no animations, only colour swaps per word.
- **Verdict:** small and honest, built from real usage. The motion-energy speaker trick and the verify-frames-first rule are the useful parts. Captions are basic ASS.

### 12. Shorts Video Creator (mcpmarket) → ronnnerr/norstack, `skills/shorts`
- **Author / stats:** "ronnnerr". The listing says 0★; GitHub shows 1★, MIT, a single push on 2026-08-28.
- **What it is:** one of 36 terse Markdown skills in "norstack", a pack for solo operators.
- **The shorts skill is about 600 bytes:**
  1. Run the `video` skill's SEE step (frames, faces, OCR).
  2. Name the format (solo / interview / screen-share).
  3. Load `profile` for brand styling.
  4. Crop from the face track; "Do not center-crop a talking head."
  5. Render sequentially and look at the output frames.

  The step numbering skips 4.
- **Problem:** it depends on `~/norstack/video/helpers/see.py`, `peek.py`, `transcribe.py`, `pack.py`, `render.py` and a `norstack video portrait` CLI. None of these are in the repo; the README says the stack is "the tool half of a larger personal stack". As published it can't run.
- **Useful ideas** (from the sibling `video`, `thumb` and `hook` skills):
  - "See first, hear second, cut third." Editing from the transcript alone counts as failure.
  - Re-run the frame check on the rendered output.
  - Cap self-review at 3 loops.
  - Hard rules: subtitles last in the filter chain, 30 ms audio fades at every segment boundary, snap cuts to word boundaries with 30–200 ms padding, cache transcripts keyed to the source file's modified time.
  - `thumb` says: "Type is code… Do not ask an image model to spell the title." It also says to keep title words out of the bottom 28% and the timestamp corner, make 3 options and open each PNG.
- **Verdict:** good principles, no working code.

### 13. Claude Shorts — AgriciDaniel/claude-shorts
- **Author / stats:** Agrici Daniel ("AI Marketing Systems Architect", sells a Skool community). 252★, 55 forks, MIT, last push 2026-07-11, v1.1.0.
- **What it does:** a 10-step interactive pipeline from a long video to Shorts:
  1. Preflight
  2. faster-whisper `large-v3` (GPU)
  3. MediaPipe content-type detection: talking-head, screen or podcast
  4. Claude scores 8–12 candidate segments
  5. Table + AskUserQuestion: which segments, which style, which platform
  6. Timecode adjustment loop
  7. Boundary snapping
  8. Stream-copy extraction + reframe coordinates
  9. Remotion render
  10. Per-platform ffmpeg export + validation
- **Dependencies:** ffmpeg, Python (faster-whisper, mediapipe, opencv, torch), Node with Remotion `^4.0.422` + `@remotion/captions` + React 19 + zod. Uses NVENC if present. Needs bash: Windows users must use WSL.
- **Structure:** SKILL.md (about 13 KB) plus `references/`:
  - `scoring-rubric.md`
  - `caption-styles.md`
  - `platform-specs.md`
  - `remotion-patterns.md`

  Also 7 scripts and a full Remotion project: Bold/Bounce/Clean caption components, HookOverlay, ProgressBar, and VideoFrame (crop done with CSS transforms on OffthreadVideo).
- **Virality scoring:** 5 weighted dimensions:

  | Dimension | Weight |
  |---|---|
  | Hook | 0.30 |
  | Standalone coherence | 0.25 |
  | Emotion | 0.20 |
  | Value density | 0.15 |
  | Payoff | 0.10 |

  - **Hook archetypes with score ranges:** Bold/Contrarian 80–100 … Weak "So today I want to talk about" 10–40.
  - **Boosters:** a specific number, a named entity, personal experience.
  - **Red flags:** "As I mentioned earlier", pronouns with nothing to refer to.
  - **Selection:** minimum score 60, 15–55 s (best 25–40 s), varied subtopics, at least 2 minutes apart in the source.
- **Hook overlay:** a two-line hook (4–8 words + 3–6 words) that should not repeat the opening spoken words. It shows from 0.3 to 3.5 s in the top zone.
- **Boundary snapping (`snap_boundaries.py`):**
  - Snaps the start to a word start, preferring a sentence start within 1.5 s.
  - Extends the end to the next `. ? !` if within 3 s, then adds 300 ms padding.
  - Moves cuts to nearby silences (`silencedetect` −35 dB, 0.3 s).
  - Clamps length to 5–60 s.
- **Captions:** built with `createTikTokStyleCaptions`. Per-style words per page and combine windows (Bold 2–3 words / 800 ms, Bounce 1–2 / 600 ms, Clean 3–5 / 1500 ms). Exact spring configs: Bold damping 12 / stiffness 200; Bounce 8 / 180 with rotating colours. Claude also writes a cleaned caption track (fillers removed, errors fixed, timestamps unchanged).
- **Safe zones:** a 1080×1920 table of medians from community measurements:

  | Platform | Top | Bottom | Left | Right |
  |---|---|---|---|---|
  | TikTok | 150 | 320 | 60 | 120 |
  | Shorts | 150 | 350 | 60 | 150 |
  | Reels | 210 | 340 | 40 | 100 |
  | Universal | 210 | 450 | 60 | 150 |

  Captions sit 350 px from the bottom. The file itself says 400 px or more is needed for Shorts, so the default is marginal there.
- **Export:** per-platform bitrate and profile, `loudnorm` to −14 LUFS, then `validate.sh` checks the files (resolution, H.264, audio present and not silent, size, 3–90 s).
- **Verdict:** the most complete clip-extraction skill on the list. The rubric, safe-zone table, snapping rules and Remotion caption pages are reusable reference material. The "viral" scoring is still only Claude's judgement against a rubric; there is no data behind it.

### 14. Motion Graphics — Barty-Bart/motion-graphics
- **Author / stats:** "Bart" (sells a Skool workshop). 929★, 137 forks, last push 2026-10-13. GitHub shows the licence as NOASSERTION because the file adds font and icon notes; the README says MIT. Install with `npx skills add`.
- **What it is:** 6 skills.

**Shared pattern across the three explainer skills**
- **One HTML page per video**, built with `window.VIDEO={w,h,duration}` and a pure `window.seek(t)`.
- **Rules for that page:** no CSS transitions or timers, seeded RNG instead of random numbers, fonts embedded as base64, and anything that needs history (camera lag, physics) pre-computed at load at 1/240 s steps.
- **Paste-in helpers:** closed-form damped spring, `track`, `kf`, easing.
- **Rendering:** a bundled Playwright `render.mjs`.
  - `--stills t1,t2,…` makes a contact sheet, one frame per beat-sheet row, which Claude inspects and fixes before going further.
  - A 30 fps draft without motion blur is the review copy sent to the user.
  - The final is 60 fps with 4 sub-frames per frame over a 180° shutter, blended into motion blur with `tmix`, and spread over parallel workers.
  - Audio comes from `window.buildAudio(OfflineAudioContext)` and is normalised to −16 LUFS.
- **Content rule:** never invent stats, customers or testimonials; use relative bars and skeleton lines instead.

**The three explainer skills**
- **explainer-default:** a calm 45–90 s product demo.
  - Timing budget table by length.
  - One line of text or one UI element at a time.
  - The camera is the editor: pushes and blur-dissolves of 0.3–0.4 s, no hard cuts.
  - Rebuilt vector UI, typing at about 25 characters per second, a 0.5 s pause after each result.
  - A banned list.
- **explainer-high-energy:** a 12–20 s promo on a 120–140 BPM grid.
  - Transitions are objects: a dot grows into the next background.
  - A viewfinder-style overlay frame, film grain, kinetic triplets.
- **explainer-engaging:** a one-take story where a hero object travels through workflow "stations".
  - Very detailed camera rules: a blend between anchor and hero, a baked spring, the hero kept at 50–70 px on screen.
  - Parabolic physics with squash and stretch.
  - A slow-motion reveal with time warping, and a seamless loop.

**The other three skills**
- **motion-broll:** turns a talking head plus SRT into motion-graphic B-roll clips.
  - Inspects the footage: contact sheet, picture-in-picture detection.
  - A plan table that the user must approve.
  - A decision for each clip: full-frame cutaway, transparent ProRes 4444 panel, or nothing.
  - Cutaway rules: 3–10 s; not during the first second of the hook or on emotional or opinion lines; at least 2 s of face between cutaways.
  - Every state change lands on a spoken word.
  - A shared engine `motion.js` (about 9 KB) with a vocabulary of interactions.
  - Deliverables: a timeline-named clip, a preview composite, a before/after `compare.html` and a `TIMING.md`.
- **sound-effects:** a measured sound pass. Its premise is that Claude can't hear, so it never says "it sounds good".
  - Cue list built from the composition timeline; cue type maps to a sound category (e.g. a whoosh starts 2 frames early, a riser ends on the hit).
  - Beat grid from librosa, checked against the kick drum below 120 Hz because librosa sometimes locks onto the off-beat.
  - Cuts moved onto beats, with the error reported in ms.
  - Ducking: VO > SFX > music. Target −16 LUFS integrated, true peak below −4 dBFS, measured on the exported MP4, plus a mono check.
  - Before/after frames and a waveform for every cue, plus 5 "riskiest timestamps" for a human to check on headphones.
  - About 150 bundled CC0 sounds (Freesound/Kenney) with a manifest, a licence check per use case, a CREDITS.txt, and a swap report page.
- **object-separation:** SAM 2.1 through `transformers`.
  - Model chosen by hardware: large / base-plus / tiny.
  - Click points chosen on a gridded frame.
  - 60-frame chunks, each seeded from the previous chunk's last mask.
  - Output: a green-highlight preview video and one PNG mask per frame. CPU speed is about 5 s per frame.
- **Inconsistency:** the explainer skills synthesise music with oscillators, while sound-effects says "Never synthesize music or sound effects in code".
- **Verdict:** high-quality, carefully engineered craft guidance. Three ideas are genuinely transferable:
  - The rules for a deterministic seek(t) page.
  - The stills → draft → final review ladder.
  - The measured audio method.

  The motion style is SaaS/UI demo rather than illustrated explainer.

### 15. B-Roll Overlay (mcpmarket) → novoads/agent-skills, `shared/skills/broll-overlay`
- **Author / stats:** Novoads, a paid AI-ads SaaS. 27★ on GitHub (the listing says 10), MIT, last push 2026-10-17.
- **What it does:** lays silent cutaways over an already-approved base video. The base audio stays, and the output duration must equal the base duration exactly. Its founding failure was a run that concatenated the clips instead: 24 s output for a 15 s base.
- **Dependencies:**
  - ffmpeg 7.1+ (needed for `scale=rw:rh`; Ubuntu's apt ffmpeg 6.1 fails).
  - The Novoads REST API: paid transcripts at `/v1/transcripts`, B-roll generation with Seedance, and a live cost estimate with explicit yes before spending.
  - Whisper as an offline fallback.
- **Structure:**
  - SKILL.md covers judgement only.
  - `broll_overlay.py` (31 KB) owns all assembly. Hand-written ffmpeg is banned.
  - About 40 KB of tests, `evals.md` (OV1–OV6) and a `routing-eval.jsonl`.
- **Placement rules:** measured frame by frame from one reference ad, and it admits "n=1":
  - Alternate face and B-roll, never two cutaways back to back.
  - 4–6 windows per 15 s, each about 1–1.5 s, about 40–45% coverage.
  - Never cover the hook; end on the person.
  - Every EDL window must quote the line it illustrates.
  - Reuse the base actor's reference images so cutaways show the same person.
- **Verification:** the script checks duration within 0.05 s, that the audio was stream-copied, and that each window's midpoint frame actually differs from the base (16×16 grid, mean difference ≥ 6). Renders go to a temp file and are renamed only after passing. Exit codes are 2, 3, 4.
- **Verdict:** a well-built deterministic-script-plus-checks pattern. It's for UGC ads and tied to a paid service; the placement numbers come from a single ad.

### 16. Thumbnail Skills — greg-prospyr/thumbcraft-skills
- **Stats:** no profile name. 3★, 2 forks, MIT, a single push on 2026-02-08.
- **What it is:** a thin client for a SaaS ("Thumbnail Creator", app.thumbcraft.io). SKILL.md (about 6 KB) lists its tools:
  - `generate_thumbnail`: prompt, style_id, face_ids, brand_id, 16:9 or 9:16; costs 1 credit.
  - `analyze_video`: returns 5 concepts for a YouTube URL, each with a prompt and an "emotional hook".
  - Face training, saved styles and brands.
  - SEO titles: 10 titles across 5 style labels.
  - SEO description: hook, about section, takeaways, chapters, quotes, hashtags.

  Plus `references/prompt-examples.md` and `rest-api.md`.
- **On your specific questions:**
  - **Image model / API:** never named. Everything happens server-side behind its MCP endpoint (`/api/mcp`) and REST (`/api/v1`).
  - **Text overlay:** the image model draws the text, because the exact words go in the prompt.
  - **A/B variants and CTR scoring:** neither exists in the skill.
  - **Heuristics:** in `prompt-examples.md` only. 3–5 words maximum, high contrast, one focal point, exaggerated emotion, face at least ⅓ of the frame. Text in the top third for hooks, bottom third for numbers, centre only for a single word. Six prompt archetypes: reaction, before/after, tutorial, listicle, versus, transformation.
- **The backend is dead.** `app.thumbcraft.io/`, `/api/mcp` and `/api/v1/credits` all return 404. `thumbcraft.io` is now a different product: a free browser editor (no account, no paid tier). It says the AI only paints the background, through Vercel AI Gateway with no model named, while the words stay real editable text "because AI-drawn text is often misspelled". It also has a mock-feed tester, a phone-size preview, a contrast-ratio readout, and a rule to keep the bottom-right timestamp corner clear.
- **Verdict:** as a skill it's non-functional fluff. The useful points come from the current thumbcraft.io page and from norstack's `thumb` skill (#12): set the type in code, generate only the picture, make 3 options and look at each, keep text out of the timestamp corner.

### 17. Claude Video Vision — jordanrendric/claude-video-vision
- **Author / stats:** Jordan Vasconcelos (company listed as GreenBook AI). 1,436★, 169 forks, MIT, last push 2026-10-14, v1.4.0.
- **What it is:** a Claude Code plugin made of an npm MCP server (`npx claude-video-vision@latest`, Node 24+), a `video-perception` skill, `/watch-video` and `/setup-video-vision` commands, and a `frame-describer` subagent. It calls itself a "perception layer, not an interpretation layer".
- **MCP tools:** `video_info`, `video_analyze`, `video_watch`, `video_detail`, `video_configure`, `video_setup`.
- **How Claude "watches":**
  1. **Info** first.
  2. **Analyze, required for videos over 30 s,** in one ffmpeg pass that can include:
     - `scdet`: cuts at score ≥ 8, which v1.4 raised from 2 because lower scores were mostly handheld motion and pans.
     - `blackdetect`, `freezedetect`, `siti` (motion), `blurdetect`, `signalstats` (exposure).
     - `silencedetect` −40 dB / 0.5 s and `ebur128`.
     - Plus a transcript.

     A table maps user intent to which filters to run.
  3. **Plan the frames:** 0.1–0.5 fps for static stretches, 1–3 fps only around cuts, motion peaks or "look at this" moments in speech.
  4. **Watch:** auto fps is 2 under 60 s, 1 under 5 min, 0.5 under 15 min, 0.2 under 1 h. Per-segment fps and resolution (256–1024 px). `view_sample` limits how many frames come back.
  5. **Detail:** drill into 3–5 s windows with first/middle/last frames, "like a binary search"; never view all frames at once.

  A session manifest avoids re-extracting frames.
- **Audio backends:**
  - **Gemini:** returns structured JSON with a transcript plus non-speech `audio_tags` (music, SFX), with silence-aware chunking.
  - **whisper.cpp or openai-whisper:** with VAD to stop hallucinated dialogue on music-only audio; optional Whisper-AT tags.
  - **OpenAI API.**
- **YouTube:** yt-dlp; prefers manual subtitles, then auto-captions, then the audio backend, and labels which source was used.
- **Output:** base64 frames with timestamps, a timestamped transcript, audio tags and analysis intervals. A "descriptions" mode has a subagent describe frames as text to save tokens.
- **Windows:** the changelog shows real Windows fixes (lavfi drive-letter escaping), and the README covers an npx failure mode on Windows.
- **Verdict:** the best-designed "how to look at a video cheaply" logic here: analysis before extraction, adaptive fps, drill-down instead of flooding context. The audio-event tags are something a plain Whisper pass doesn't give.

### 18. Watch Video — bradautomates/claude-video (`/watch`)
- **Stats:** 19,486★, 2,048 forks, by far the most popular item. MIT, v0.3.2, pushed 2026-09-25. The author's real name isn't on the profile.
- **What it is:** a skill plus plugin. A standard-library Python `watch.py` turns a URL or file into timestamped frames and a transcript, then Claude reads the frames. It works in Codex and other hosts too, but not in Claude Chat or Cowork.
- **Two engines:**
  - **gemini:** the whole video, picture and sound, is sent to `gemini-3.7-flash` along with the user's question verbatim. Claude relays Gemini's timestamped answer and must say it's Gemini's observation. It never silently falls back to the other engine.
  - **local:** yt-dlp + ffmpeg frames, with captions first, then WhisperX (managed uv/Python 3.12 install, about 1.5 GB, CPU int8 `small`) or Groq/OpenAI.
- **Frame selection, by "detail" tier:**

  | Tier | Method | Frame cap |
  |---|---|---|
  | transcript | no frames | — |
  | efficient | keyframes | 50 |
  | balanced | scene changes (`gt(scene,0.20)`), uniform fallback if under 8 scenes | 100 |
  | token-burner | scene changes | none |

  - Scene cuts are detected across the whole range first, then thinned evenly to the cap.
  - Near-duplicates are dropped with a 16×16 RGB mean difference ≤ 2.0, which keeps held slides out but can miss small text changes.
  - Uniform sampling tops out at 2 fps; images are capped at 1998 px tall.
- **Cue pinning:** `--timestamps 4:32,7:10` for moments where the presenter says "look here" in the transcript; their frames are reserved before the cap is applied.
- **Rule:** "Transcript-only evidence cannot establish visual facts." Frames and captions are untrusted evidence.
- **Verdict:** mature and well tested, with careful engineering. It's for understanding a video, not producing one. The useful pieces are scene-then-thin-then-dedup and cue pinning from the transcript.

### 19. Caption Clip — kwindla/skill-caption-clip
- **Author / stats:** Kwindla Hultman Kramer (Daily/Pipecat co-founder). 3★, no licence file (the README says MIT), a single push on 2026-01-27.
- **Workflow:**
  1. `yt-dlp --download-sections "*02:53-04:15"`
  2. Convert to MP4.
  3. Deepgram Nova-2 by curl (`utterances=true`, `smart_format`), which is paid.
  4. `json-to-srt.py` (utterance-level).
  5. Claude rewrites the SRT by hand: fix errors, drop fillers, merge fragments, rephrase for reading, fix bad timestamps.
  6. Burn it in with ffmpeg `force_style` (Avenir Next, 50% black box, BorderStyle 4).
- **Captions:** sentence-level only, no word timing and no animation. Built for 16:9 YouTube clips.
- **Verdict:** a minimal example. Its one idea is having Claude clean the transcript, which claude-shorts also does and more safely, since it keeps the timestamps unchanged.

### 20. Omni Captions → lattifai/omni-captions-skills (the skillselion listing points here)
- **Stats:** 22★, MIT, last push 2026-03-29.
- **Skills:** 5: transcribe, translate, convert, download, LaiCut.
- **CLI:** `omnicaptions`, installed from a custom package index (`--extra-index-url https://lattifai.github.io/pypi/simple/`). Bundled tarballs live in `packages/`.
- **transcribe:** uses `gemini-3-flash-preview` and accepts YouTube URLs directly. Output is markdown with chapters, speaker labels and `[Event]` tags. It checks `yt-dlp --list-subs` first.
- **LaiCut:** forced alignment with LattifAI's Lattice-1 model (paid API key) to get word-level JSON timing, with `--split-sentence` to re-segment messy YouTube VTT. The rule is to align before translating.
- **convert:** 30+ formats (SRT, VTT, ASS, TTML, FCPXML, EDL…).
  - ASS presets: default, top, bilingual (white + yellow), yellow.
  - Font size scales with resolution (1080p = 48).
  - Karaoke from word timing using `\kf` sweep, `\k` instant or `\ko` outline.
- **translate:** done by Claude itself by default, in 30-line batches with 5 lines of context on each side.
- **Verdict:** a subtitle-file toolkit (bilingual captions, conversion, alignment), not a styled short-form caption renderer. It depends on Gemini plus a paid LattifAI key for the useful timing feature. Treat the custom package index as a supply-chain point to check before installing.

### 21. Caption Engine — robcressy.com/caption-skill
- **What it is:** fully visible on the page, no email gate. The page doesn't name an author, but the site is Rob Cressy's.
- **Important:** it writes the **post caption / description** for Reels, TikTok and Shorts, **not on-screen subtitles**. No tools or dependencies; it works from a pasted transcript or a screenshot.
- **Process:**
  1. Read the transcript.
  2. Find the core insight, which the caption must never state.
  3. Find a searchable keyphrase ("what would someone type into ChatGPT/Google").
  4. Write exactly 5 two-line options. Line 1 is a curiosity hook or open loop; line 2 carries the keyphrase for search and AI-search ("AEO") discovery.
  5. Score each on Curiosity, AEO Signal, Voice and Brevity, 1–5 each; publish at 16/20 or above.
- **Rules:** no hashtags, at most 2 sentences, never summarise. Banned words (delve, unlock, unleash, realm…), no semicolons or em dashes, no contrast-framing setups.
- **Edge cases:** covered. The worked examples don't consistently follow the two-line template.
- **Verdict:** a lightweight prompt, useful only for the publish step's caption text.

---

### Where the ideas overlap

| Idea | Where |
|---|---|
| Hook / segment scoring | Claude Shorts rubric (#13); Clipify humour signals (#11); norstack `hook` "complete thought a stranger understands" (#12) |
| Word-level animated captions | Claude Shorts' Remotion `createTikTokStyleCaptions` + springs (#13); Clipify ASS active-word (#11); Omni karaoke ASS (#20) |
| Safe zones | Claude Shorts platform table (#13); thumbcraft.io / norstack thumb timestamp corner (#16 / #12) |
| Cut-point hygiene | Claude Shorts snapping (#13); norstack hard rules (#12) |
| Review loops | Clipify Step 1.5 (#11); motion-graphics stills → draft → final (#14); sound-effects "5 timestamps for human ears" (#14); norstack "read the output frames, max 3 loops" (#12); B-roll script checks (#15) |
| Watching video cheaply | #17 (analyze, then adaptive fps, then drill-down); #18 (scene detection + dedup + cue pinning) |
| Thumbnails | Set type in code, never AI-spelled; 3 options; check at phone size (#12 thumb, thumbcraft.io). Nothing anywhere does A/B testing or predicts CTR. |

### Couldn't open, or isn't what it claims
- **#16 thumbcraft backend:** `app.thumbcraft.io`, `/api/mcp` and `/api/v1` all return 404, so the skill can't be tested and its image model can't be identified. To find out, the user could ask the repo author through a GitHub issue. thumbcraft.io itself is now a different free tool.
- **#12 norstack helpers:** `see.py`, `peek.py`, `render.py` and the `norstack` CLI are referenced but not published. Only the author could supply them.
- **mcpmarket pages (#12, #15):** they show feature blurbs only; the SKILL.md tab content didn't render. I read the source repos instead. The star counts on the listings don't match GitHub.
- **skillselion (#20):** the markdown version of the page was empty. The HTML confirmed the repo is lattifai/omni-captions-skills, which I read directly.
- **LattifAI pricing:** the homepage lists no API price; you need an account or a sales contact. I didn't sign up.
- **Not read:** the explainer skills' render sections after the first one (they're the same renderer), the full motion-broll `motion.js`, and novoads' other skills (caption-video, music-mix), which are outside the list.

