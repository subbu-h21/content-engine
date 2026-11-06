# Read PDF guides and kit

## Coverage
- **All 8 PDFs were read in full**, every page: Motion as Code 7pp, Five Skills 1p, Kinetic Type 25pp, Level 5 12pp, Claude+Blender 7pp, notion-page 5pp, shashwat 11pp. The `pages` parameter doesn't work on this machine because pdftoppm is missing, but reading each PDF whole worked for all of them.
- **The two Motion-as-Code PDFs are duplicates.** Both are 19,906 bytes with the same SHA-256 (B6571BB196CFDBE4…).
- **Motion_as_kit.zip** was extracted into the new empty folder `C:\Users\subra\AppData\Local\Temp\claude\d--code-files-content-engine\d397bad3-8832-4aa1-9c55-4c7d7f94162b\scratchpad\motion_kit\Motion_as_kit\`. I checked first that no entry path escapes that folder. Nothing in it was run.
  - **Left out of the extraction:** `app/node_modules/` (about 4,170 entries, including bun `.exe` shims and vite deps) and the 95 MB `w2v2_base_960h_q.onnx` model.
  - **Read in full:** README, LICENSE, .gitignore, .claude/launch.json, package.json, vite.config.ts, index.html, timeline.ts, scene.ts, lyrics.ts, palette.ts, render.ts, align_vo.py, audio_vo.py, sfx_mix.py (the whole cue sheet).
  - **Only header comments and parts read:** the 9 scene files, `_vo.ts`, `_motifs.ts`, engine.ts, post.ts and the other engine files.
  - **Not read (binary or bulk data):** fonts, the 33 SFX mp3s, voiceover.mp3, and `data/audio.json` / `lyrics.json` / `voiceover.words.json`.
- **The kit has no SKILL.md, CLAUDE.md or prompt files.** Its only Claude-related file is `.claude/launch.json`, a preview config that runs `bun --cwd app run dev` on port 5173. The demo prompt lives in the PDF.
- **One PDF is damaged in itself:** the first table on page 1 of notion-page.pdf has its left column cut off.

---

## 1. Motion as Code: Workflow Guide (PDF) + Motion_as_kit.zip
**What it is.** A 7-page starter-kit guide plus a working project. No author is named; the folder attributes it to Aman Thakur. The visual engine is **pdoom-video by mexicat (Giacomo Magnanini, MIT)**. The output is a 92.6 s, 1920×1080, 60 fps explainer whose script is about making motion graphics "without even opening After Effects".
- **Stack:** TypeScript, three.js 0.186, opentype.js, bun, Vite 8, playwright-core (driving headless Chrome), ffmpeg, Python with uv.
- **Voice and sound:** ElevenLabs voiceover; 28 effects (33 files counting alternate takes) generated with ElevenLabs Sound Effects v2.

**Workflow** (the guide's six boxes): Voiceover → Align (`align_vo.py`, `audio_vo.py`) → Scenes (`scenes/*.ts`, `timeline.ts`) → Preview (Vite :5173) → Render (`render.ts`: Chrome → ffmpeg) → Sound (`sfx_mix.py`, ffmpeg mux).
- To swap the voiceover: replace the mp3, edit `SCRIPT`/`SPOKEN` in align_vo.py, re-run both analysis scripts. Plates find their words by content, so the animation re-times itself.

**Concrete techniques**
- **Plates.** A plate is a class that extends `Scene` and has `render(f, out)`. The rule: "everything must be a deterministic function of time".
  - What each frame receives: `f.t` (song time), `f.lt` (local time), `f.p` (0–1 progress), `f.a` (voice envelope and hit pulses), `f.seeked` (stateful scenes reset on it), and `f.under`/`tin`/`tout` for transition overlaps.
  - A plate can set `handlesTransition` to composite the previous plate itself. Stateful scenes get "preroll" fast-forward after a seek, up to `prerollMax` = 6 s.
- **Timeline cut rule.** `cut('This is Claude')` places the cut 0.18 s before the line's first word, or `gap*0.45` (minimum 0.04 s) when the pause is short. Cuts always "sit in the pause before each line".
  - Scenes are lazy-loaded through `import.meta.glob`, so a broken scene doesn't break the build.
  - `ly.get(q)` throws when a phrase is missing ("fail loudly while authoring").
- **Forced alignment instead of transcription.** `align_vo.py` aligns the *known script* to the audio: wav2vec2-base-960h as a quantized ONNX model, char-level CTC, one Viterbi pass, 20 ms frames.
  - A `SPOKEN` map handles display tokens: "5.5." → FIVE POINT FIVE, "MCP." → EM SEE PEE, "→" → TO, "—" → nothing.
  - Display words made of several spoken parts get `syl` spans, so each part lights up as it is said (the "5.5" odometer rolls one digit per spoken part).
  - Word edges are refined against the energy envelope: onsets walk back at most 120 ms over voiced frames, ends extend to the next silence, and unvoiced gaps under 90 ms are closed. Unspoken tokens take the pause between their neighbours.
- **Audio analysis.** `audio_vo.py` writes 100 fps RMS envelopes, low/mid/high band envelopes, word onsets as "vocal" onsets, line starts as "kick" onsets, and a nominal 120 BPM grid ("scenes time everything from the words").
- **SFX cue sheet** (`sfx_mix.py`): about 500 cues written as Python expressions over word times, e.g. `cue(w("Claude")["start"]-0.01,"impact_slam",-14)`.
  - Each sound has a placement mode: `onset` (transient minus 8 ms of attack), `peak` (whooshes), `end` (risers and reverse sucks land on their end), `bed` (looped and faded).
  - Repeated sounds get deterministic ±5% pitch jitter. Helpers `typing()` (swing) and `type_words()` (about 1 strike per 2.6 characters while the word is said).
  - Alternate takes rotate. "tape_ff" is the rewind sample reversed.
  - Effects duck up to 7 dB under the voice (one-pole follower, 10 ms attack, 180 ms release). Two-pass ffmpeg `loudnorm` to −14 LUFS, true peak −1.5.
  - The audio is muxed with `-c:v copy`, so changing sound never needs a re-render.
- **Renderer** (`render.ts`).
  - **Modes:** `stills --t a,b --only plate`; `sheet --from --to --n --cols`; `sheet --cuts` (4 frames around every timeline boundary: 2 before, 2 after, a QA trick); `perf` (ms per frame); `gpu`; `video`.
  - **Motion blur:** `--samples auto` adds sub-frames in nested 4 → 12 → 36 → 108 → 324 steps ("ternary offsets") until the estimated error is under 3 8-bit levels. It refuses stateful scenes.
  - **Frame transport and memory:** raw RGBA frames go over a WebSocket into ffmpeg's stdin, and the page waits for an ack so it stays at most 4 frames ahead (bounded memory at 4K).
  - **Dev server and output size:** `PDOOM_NO_HMR=1` stops a file save from reloading the page mid-render. If no dev server is running it starts a private Vite on a random port. `--scale 2` renders 4K while scenes keep laying out in 1080p logical pixels.
  - **Colour and encoding:** `vflip,scale=out_color_matrix=bt709,setparams=…bt709`. The code comment explains that ffmpeg would otherwise convert with BT.601 while YouTube decodes HD as BT.709. Encoding is `-tune grain`, `aq-mode=3`, CRF 17, preset slow, faststart.
- **Look.** Palette: ink #0A0A0B, bone #EEE9DF, signal orange #FF4D12, ember, blood, plus one rare "acid" accent.
  - Archivo is shipped as static width × weight instances (wdth 62–125) so letter widths can be animated in steps.
  - Single-stroke Hershey/EMS SVG fonts let a "spark" pen write text stroke by stroke. Each word's strokes are drawn while it is said.
  - World-space karaoke: unsaid words are hairline outlines, the word being said wipes in orange, said words cool to bone over 0.3 s.
  - Graph-paper construction sheets, a 2D camera that zooms about the move's fixed point, and HDR post-processing: bloom, halation, chromatic aberration, grain, vignette, flash/shake/zoom punch-ins.
  - The ending implodes back to frame 0, so the video loops.
- **Demo prompt** (PDF p.5), in three steps: (1) verify the install, then "Tell me what you see"; (2) make one small edit to the verdict plate and render a still at 89.5 s; (3) ask for the user's voiceover and script, re-align, and list which `cut()` anchors need new phrases.
  - Rules in the prompt: "do not edit app/src/engine/"; "Do not run the full 4K render without asking"; "Explain each change in one or two sentences".
  - Follow-up prompt ideas: "Slow the pipeline plate down by 20%…", "Change the accent colour… everywhere".

**Novel vs generic.** The genuinely clever parts:
- **Forced alignment against a known script.** It is more precise than Whisper, and multi-part words get syllable spans.
- **Content-anchored timing.** `cut('phrase')` and `wordOf`, so swapping the voiceover re-times every plate.
- **SFX placement by transient, peak or end**, with ducking, all derived from the same word times.
- **Rendering details:** adaptive motion blur, `sheet --cuts` QA around every cut, BT.709 tagging, and the no-HMR export guard.
- **Leftovers and inconsistencies.** The code still carries pdoom remnants: `plates` mode references "shoggoth"/"ilya", and a palette comment mentions a "shrooms moment". The PDF says to leave `node_modules` and `out/` out of the zip, but the zip ships `node_modules` and the ONNX model (which .gitignore excludes as "downloaded by hand, see README", and the README doesn't say where).

**Links:** github.com/mexicat/pdoom-video; bun.sh; ElevenLabs Sound Effects v2; wav2vec2-base-960h.

---

## 2. Five Skills, Five Different Worlds (1-page PDF, no author named)
A poster that lists five Claude Code skills or kits on GitHub, each with install commands. "If everyone has the same AI, how do you make something different?"
- **HyperFrames** by HeyGen (Apache-2.0): HTML turned into motion graphics. `claude plugin marketplace add heygen-com/hyperframes`, then `claude plugin install hyperframes@hyperframes`.
- **OneTake** (PolyForm Noncommercial): one continuous camera move with no cuts. Cloned into `~/.claude/skills/onetake`.
- **Collage B-roll** (MIT, README in Chinese): paper cutouts, halftone, layered illustration, with Gemini generating the visuals.
- **Claude Animation Base** (MIT starter kit): hand-painted cartoon animation starring Claude's mascot. Clone, `npm install`, then open in Claude Code.
- **Lemo Opuscar** (MIT): "43 different film styles", whole films made through code "without a traditional video generation model". Installed as a plugin, `lemo-opuscar@lemolab`.

There is no technique content; it is a link list. **Links:** github.com/heygen-com/hyperframes, feitangyuan/onetake, pyang5166/gbro-collage-broll, JohnHeibel/ClaudeAnimationBase, lemomo-ai/lemo-opuscar.

---

## 3. Kinetic Type: the complete workflow guide (25 pp, v1.0, October 2026, "Made with Claude Code", no author named)
**What it is.** A full case study of recreating a reference reel's style on the creator's own talking-head footage. In it, words sit *inside* the 3D scene: behind the head, on arcs, in rings around the head, with rack focus and red cards. The output is 24.8 s at 1080×1920, 30 fps, plus an editable After Effects project and an SFX-only WAV.
- **Stack:** Claude Code; Remotion 4.0.535 with React 19.3 using CSS 3D; faster-whisper large-v3-turbo; RobustVideoMatting ResNet-50; OpenCV YuNet face detection; SAM 2.1 and Depth-Anything-V2 (installed but unused); PyTorch cu128; uv with Python 3.12; ffmpeg; After Effects 26.5 via ExtendScript.
- **Measured:** about 7.9 GB of installs; under 3 hours from idea to .aep; a 48 s render for 743 frames on an RTX 3050.

**Nine phases**
1. **Analyse the reference** frame by frame into `STYLE_GUIDE.md`.
   - `ffprobe` first.
   - Contact sheets of *every* frame, 8×5 tiles with frame numbers stamped (`drawtext=text='%{n}'`, then `tile=8x5`), plus a 4 fps overview.
   - Zoom into the type to identify fonts; sample colours as 5×5 pixel averages.
   - `showspectrumpic` spectrogram to find whooshes and hits.
   - The style guide holds a typography table, colour tokens, a shot timeline in frames, and named recipes A–L.
   - "Read STYLE_GUIDE.md yourself before building anything."
2. **Install everything project-local**, then prove each tool on real frames with `prep/check_env.py`. It runs six checks (torch/CUDA, matting, SAM mask, depth, optical-flow camera tracking, Whisper) and prints "6/6 checks passed". Stalled downloads are resumed with `curl -C -` and verified by SHA-256.
3. **Prepare the footage.**
   - Everything is resampled to 30 fps; word frame = round(start × 30).
   - Cut detection: mean absolute difference of consecutive frames, with frames above max(6 × median, 8) as candidates. Each candidate is verified on a contact sheet (4 candidates, 3 real cuts).
   - Each frame becomes a plate JPG plus a cutout PNG. The matting model's memory is reset at every cut.
   - The face is tracked and smoothed into `track.json`.
4. **Toolkit** in `studio/src/lib`: Word, Shot, Ring, ink, SilhouetteCard, Place, brand/ui, SyncedText. Design decision: CSS 3D won over three.js text, for "crisper edges, per-letter control".
5. **Test clip of about 10 s.** Claude renders, builds numbered review sheets (every 3rd frame), reads them itself, fixes problems (ring too small, words off-screen, a word on the legs, a collision with a hand), and only then shows the user.
6. **Full video.** The approved test section is reused unchanged. Source jump cuts become shot boundaries. Red cards illustrate the words, and logos and UI are rebuilt as vector/React components, never downloaded. Graphics land on the spoken word: the X lands on "AI video generator", the render bar hits 100% on "code".
7. **Sound.** Placeholder SFX are synthesised in ffmpeg (pink-noise whoosh and swish, a 58 Hz thump). 24 hits sit 25–50% under the voice. The SFX-only WAV is proven in sync with a null test: mix it with the voice, subtract from the final audio, and check the residual (−54 dB).
8. **After Effects export.** Walk the React tree as data, then run a probe composition that measures letter positions and ink-wipe paths in the browser. A generator writes `build_project.jsx`, which runs headless through `AfterFX.com -r` (the `.com` version shows errors; the GUI version hides them). The AE render is then diffed against the Remotion render: mean difference about 6/255.
   - CSS-to-AE conversions found by testing: rotateZ goes to Orientation Z; Y/X rotations and z are negated; AE blur = 3.3 × CSS px.
9. **Iterate** with "timestamp + word + one change". Keep the README and STYLE_GUIDE, and resume later with Prompt 10.

**Key techniques**
- **Four-layer occlusion:** plate, words behind, subject cutout, words in front.
- **Parallax dolly:** footage scale k goes 1.0 → 1.16; the 3D stages use perspective P = 1600 px and move by dz = P(1−1/k), so z = 0 stays glued to the footage.
- **Arc text:** θ = x/R.
- **Text ring:** each letter gets rotateY(a) translateZ(r), the ring is tilted 24°, letters with cos(a) ≥ 0 go to the front stage and the rest behind the cutout. The ring follows the tracked head.
- **Liquid-ink wipe:** a clip-path polygon whose edge is wobbled by simplex noise, with 4 droplets, over 8–10 frames.
- **Silhouette card:** the cutout drawn with `source-in` fill.
- **Recipe table with spring values** (damping/stiffness/mass): swing 13/140/0.7; pop 10/230/0.6; stretch 8/150/0.8; slam 9/190/0.8; slide is ease-out-expo over 6 frames.
- **Full 17-scene shot table**, colour hexes, and typography: Poppins Black at −0.05 em, Six Caps with a same-colour outline.

**Prompts**
- **Seven prompts actually typed**, each with a "why it worked" note and an "add next time" note.
- **Eight principles:** give paths and a purpose; stage the work ("Do not build yet"); demand proof on real data; "Make Claude review its own output"; talk in frames and words; use the recipe vocabulary; state constraints up front; leave breadcrumbs.
- **Eleven copy-paste prompts:** analyse; install; prepare footage; draft the test clip (includes "review your own render… fix anything off-screen, overlapping…"); full video; AE export; SFX-only with null test; change-request templates; missing recipes; resume; rebrand.
- **Troubleshooting table of real bugs:**
  - Remotion `delayRender` with async troika text.
  - faster-whisper vs PyAV 15: decode with ffmpeg yourself.
  - OpenCV 5 dropped Haar cascades: use YuNet.
  - SAM score was poor with an overlay in the frame.
  - Matting leaks across cuts.
  - AE fonts must be installed system-wide.

**Novel.** The occlusion/parallax maths, the ring split across front and back stages, the null-test sync proof, the browser-vs-AE convention test with frame diffs, and "every frame stamped with its number" as the shared review language.

**Links:** remotion.dev/license; PeterL1n/RobustVideoMatting (GPL-3.0); facebookresearch/sam2; mobiuslabsgmbh/faster-whisper-large-v3-turbo; depth-anything/Depth-Anything-V2-Small-hf; opencv/opencv_zoo YuNet; download.pytorch.org/whl/cu128; Pixabay and Mixkit (SFX).

---

## 4. Level 5 Workflow Guide (12 slides, @visionaryclown.tv)
**What it is.** A carousel. The output is a 47 s video with 16 scenes, 49 keywords, 76 sound hits and "0 editing apps", made from code only: GLSL shaders on WebGL2, a canvas HUD, headless Chrome, frames piped into ffmpeg.

**Master prompt** ("You are my motion designer…"; inputs are the voiceover, script, handle and CTA word), in 10 numbered blocks:
1. **LISTEN:** faster-whisper word timestamps, snapped to the real audio start, keywords marked.
2. **PLAN:** a new scene on the first word of each idea; every keyword gets a visual hit and a sound hit; "Leave a short silence before my biggest line, then drop."
3. **SOUND:** no music; SFX made in code (whoosh on cuts, blips on keywords, 808 hits on big words, riser into drop, pops on UI). Voice about 8 dB over SFX; −14 LUFS; −1 dBTP.
4. **LOOK:** black #0B0A09, orange #FF5A26, red #FF3B1F, warm white #ECEAE4, indigo #1B1D4A for quiet moments. Fonts: Unbounded 900, Space Grotesk, JetBrains Mono, Instrument Serif for the emotional line.
5. **HUD, always on:** corner brackets, title, timecode with words-per-minute, a live transcript down the left edge, a bottom timeline strip (waveform, keyword markers, playhead), handle, chapter label.
6. **CAPTIONS:** word by word; keywords in orange detection brackets with a "05.58s ▸ WORD" readout.
7. **SCENES:** a library of 16, one per idea: flash card, terminal, Claude chat, chrome core with lock-on, editor-by-hand, composer, stacked verbs, counter, fractal drop, manga panel, workspace, wormhole, indigo serif, file cards, CTA comment box, end card.
8. **FINISH:** chromatic aberration, feedback trails, bloom, glitch on cuts, push-ins.
9. **BUILD:** the stack above.
10. **REVIEW:** first a storyboard with "one real rendered frame per scene", listing time, line, visual and SFX; "Wait for my 'go'"; after the full render, self-check, fix and re-render.

**Rules of thumb:** "1 idea = 1 scene, 1 keyword = 1 hit, 1 big line = 1 drop". It shows a cue-sheet table (time / you say / on screen / sound).
- **Voiceover tips:** one idea per sentence; say keywords clearly; pause before the big line ("That breath is where the drop goes"); end with one CTA word, which becomes the comment box.
- **Pre-post checklist:** captions match the speech, voice clearly above SFX, −14 LUFS, handle and CTA on screen.

**Novel.** The persistent HUD that ties 16 disparate scenes together, and a real-frame storyboard gate before the full render.
- **Inconsistency:** the stats slide says 1180×1526 render size while the prompt asks for 1080×1920.
- About 2.5 min per change. No code or repo is provided.

---

## 5. Claude + Blender: Make 3D Motion Graphics From Code (7 pp, Nate Herk, AI Automation Society)
**What it is.** A 12 s, 1080p, 30 fps film. Clawd, the Claude Code mascot, hops on the buttons of a fake After Effects UI (Type, Rectangle, Pen, Glow, keyframes, playhead, Play) to build a title card, then the panels fall away.
- **Tools:** Claude Code with Opus 5.5 at effort high; Blender 5 headless (`blender -b`) with Cycles on GPU; Node with Puppeteer; Python numpy/scipy/pedalboard; ffmpeg.
- **Render time:** about 20 min (3.3 s per frame on an RTX 5090).
- "Claude doesn't generate the video. It writes a program that answers… what should the screen look like at this exact moment?"

**Architecture: one `timeline.py` is the single source of truth.** It holds every button position (in pixels of the fake app) and every event time. The pieces that read it:
- The UI: HTML screenshotted by Puppeteer as one 3840×2160 image.
- The comp: an HTML canvas rendered as 360 frames.
- The Blender scene: `scene.py` keys every object.
- The sound: a 120 BPM beat plus one effect per action.

The 12 generated files: `timeline.py`, `build_ui.py`, `render_ui.js`, `ui.html`, `comp.html`, `scene.py`, `gpu.py`, `render.py`, `render_chunks.sh`, `sound.py`, `encode.py`, `contact.py`.

**The prompt.** It is rari's (@0xwhrrari), and the text itself is **not in the PDF**, only its six blocks:
- **BRAND:** the only block you change between films.
- **FORMAT**, **BEATS** ("every jump changes something in the comp"), **CAMERA**.
- **LOOK:** screens glow under black glossy glass; lights stay out of the reflections.
- **CHECKS:** the interface image and a comp contact sheet first, then 18 half-size stills at 40 samples, then the full film.

"It's a production brief, not a vibe."

**Techniques and gotchas**
- Give specific fixes, with real rounds as examples: the hero read salmon pink instead of terracotta, fixed with exposure −0.4 and a darker base colour, checked against the hex by pixel. "Polish comes from these rounds", four of them before the full render.
- **Chunked, resumable renders:** `blender -b scene.blend -P gpu.py -P render.py -- --frames 105-145,285-360`. "Pass gpu.py every time", because the GPU choice is a Blender preference and isn't saved in the .blend.
- Scan every frame's brightness for blank or corrupt frames and re-render only those (16 bad frames from a memory crunch, fixed in 53 s).
- **Troubleshooting:**
  - AgX colour management lightens colours.
  - Hide lights from glossy rays to avoid white blocks on the glass.
  - Call `view_layer.update()` before parenting, or children snap to the parent's origin.
  - Use a full ffmpeg build (the vignette filter is missing from minimal builds).
- **Sound:** check loudness every half second (quiet before the drop) and true peak. Synth overshoot read +2.7 dB until a high-frequency roll-off and a −1 dBTP ceiling were added.
- **Final mux:** `ffmpeg … -vf vignette=angle=PI/6 -crf 17 … -movflags +faststart`.
- **Make it yours:** change HERO/APP/RESULT/SET; "Every press has to change something visible"; leave out real logos. For 9:16, make a separate composition with bigger type; "Don't crop the 16:9 film."

**Relevance.** This is the closest of the documents to the user's Blender shot-script approach. The ideas that stand out are the shared timeline file feeding Blender, UI and sound, and the GPU/AgX/parenting gotchas.

**Links:** x.com/0xwhrrari/status/2112166940081004693; rari's article "Motion Engineering: Build a Video Studio Around Opus 5.5"; blender.org; pedalboard.

---

## 6. notion-page.pdf: "Aidos — the voice, and the harness around it" (5 pp, Jesse / @jesserurka, sponsored by Fish Audio)
**What it is.** A spoken assistant: hold Space and talk.
- **Brain:** Claude Code headless (`claude -p`) on the Claude subscription; "No Anthropic API key".
- **Speech:** OpenAI Whisper for speech-to-text; Fish Audio S2.1 Pro for text-to-speech, streamed sentence by sentence as PCM over Fish's live socket.
- **Figure:** a particle "Sentinel" of about 43,000 points baked from a 3D mesh, with states: it burns ember while thinking and flares while speaking.
- It says "on it" immediately, before the answer starts.
- **Repo:** github.com/jdrurka/jarvis-demo. It runs on macOS/Linux; Windows only via WSL.
- **Three layers:** the voice; a data layer (a database of creators' posts, extracted hooks, your own retention); and the question it answers. Only the voice is open source. "Intelligence is a commodity. Distribution is king."

**Setup**
- Config at `~/.config/fish-audio/speak.json`: apiKey, voiceId, model `s2.1-pro-free`, format `pcm`, speed 1.1, openaiKey.
- A set-up prompt that asks Claude to clone the repo and confirm `claude -p "say hi"` works headless ("30 seconds, saves you an hour").
- `npm run build`, then `node server.js`, served on :3210.
- The personality lives in the `VOICE` constant in `lib/brain.js`. If your plan lacks the pinned model, fall back to `["--model","haiku"]`.

**The harness idea, which is the substantive part.** "What should I post today" is treated as a query: what's pulling attention right now, **minus** what you've already covered, **filtered through** what your own retention says holds.
- **Extension point: "primitives".** One file per kind of build, starting from `primitives/_template.mjs`.
- **Example prompt for a `niche-read` primitive:** read the RSS/JSON feeds listed in `feeds.json`, take the last 24 h, group by platform, and write a spoken brief "under 120 words": one line per platform, one connecting thread, one recommendation.

**Safety notes.** "Permission scoping, not a sandbox": there is a deny list over dotfiles, keys and PATH. Read `brain.js`, `builder.js` and every primitive before running; be wary of primitives that feed remote content to the model; use a VM or container if you need a hard boundary.

**Document issues:** the page-1 table is clipped, and an unfilled placeholder "[[FISH-AUDIO-CUSTOM-LINK]]" is left in the text.

**Links:** github.com/jdrurka/jarvis-demo; fish.audio.

---

## 7. shashwat-youtube-agent-skill-setup-guide.pdf (11 slides, @shashwat___agarwal; the repo is by Jakeschincariol)
**What it is.** A setup guide for **youtube-agent-skill** (MIT): 11 Claude skills, 21 hook formulas, 6 Python tools.
- "It writes. You upload." Nothing is published for you, and `/yt-viral` reads public listings only, never logging in as you.
- Without Claude Code, "Paste any single SKILL.md at the top of a chat and it runs as a mode" (the 6 Python tools are lost).

**Install:**
- **A:** paste the repo URL and say "Install this skill, then confirm /yt-script works".
- **B:** git clone, then `cp -r skills/yt-* ~/.claude/skills/`.
- **C:** `/plugin marketplace add Jakeschincariol/youtube-agent-skill`, then `/plugin install youtube-agent`.
- **D:** copy into the project's `.claude/skills/`.

**Shared voice file** `~/.claude/youtube/voice.md`, which every skill reads.
- **Sections:** who I talk to ("One real person, not 'creators'"), how I talk (real transcripts), words I never use ("Unlock. Game-changer."), words I do use (your tics), what I won't claim, my format.
- Fastest route: "Write my voice.md from these" with three of your own videos. Each skill asks for three videos if the file is missing.

**The 11 commands:**
- `/yt-script`: five hooks from the 21 formulas, scored, best two shown; a beat-by-beat script with `[ON SCREEN]` notes; a runtime at 150 wpm; which formula won and why.
- `/yt-package`: title and thumbnail as one pair; checks truncation, repeats and vague words.
- `/yt-edit`: an edit list of dead air, filler and retakes with timecodes.
- `/yt-comment`: four piles, replies in your voice, which comment to pin.
- `/yt-plan`: a week with one anchor video, one cheap one and three Shorts.
- `/yt-viral`, `/yt-retention` (hook leak, cliffs, slide), `/yt-shorts` (with a new first line for each), `/yt-seo`, `/yt-chapters` (checked against YouTube's rules), `/yt-audit` ("one fix, not twenty").

**/yt-viral, called "the one worth the install":**
- Collects listings with `yt-dlp --flat-playlist -J <channel>`.
- Ranks each video by its multiple of its *own channel's median* views, keeping only 2.0× or better. It needs at least 4 videos per channel.
- Returns the top five, their title formulas and shared structure.
- "The formula label judges the title. It does not explain why the video worked."

**The six tools** (plain Python): `hookscore.py` (scores five properties; "a heuristic, not a predictor", calibrated on 74 real hooks), `title.py`, `deadair.py`, `chapters.py`, `retention.py`, `swipe.py`. "They are why the skills are more than prompts."
- Every skill ends with the question "Ship it, or change it?"
- **Inconsistency:** the guide says nothing needs installing, but `/yt-viral` needs yt-dlp.
- The PDF doesn't show SKILL.md contents, only what each skill does.

**Novel.** Outlier-by-own-median ranking; one shared voice file feeding every skill; deterministic helper scripts paired with prompts; a single closing question.

**Link:** github.com/Jakeschincariol/youtube-agent-skill. Inputs it relies on: Whisper or faster-whisper transcripts, and the YouTube Studio retention CSV.

---

## Patterns across the documents (observations only, no recommendations)
- **Every frame a pure function of time.** Motion as Code, Kinetic Type, Level 5 and Blender all render frame by frame and re-render only what changed.
- **One shared timing source.** Words or a timeline file drive both the visuals and the SFX: `lyrics.json`, `words.json`, `timeline.py`.
- **Self-review on images before the user sees anything:** numbered contact sheets, sheets around cuts, 18 stills, a real-frame storyboard.
- **Precise feedback:** "timestamp + word + one change", with fixes given as exact numbers and colours checked by pixel against the hex.
- **Audio norms:** −14 LUFS with a −1 to −1.5 dB true-peak ceiling; SFX ducked about 7–8 dB under the voice; hits on keywords and cuts; a silence before the drop.
- **Brand and assets:** logos recreated as vectors rather than downloaded; style guides kept as markdown so a new session can resume.
- **Against the user's engine:**
  - **Voice:** Motion as Code is the only one that aligns a *known script* (CTC forced alignment), which is the same situation as TTS narration with a known text. The others use faster-whisper on recorded speech.
  - **Blender:** the Blender guide is the only one using Blender, and it pairs Blender with HTML/canvas layers through a shared timeline.
  - **Reference study:** Kinetic Type's reference-analysis phase (every frame numbered, spectrogram, sampled hexes, named recipes written into STYLE_GUIDE.md) is the most detailed counterpart to the user's "study reference video" step.

