# Explore NullMotion, VoiceStudio, manimgx

## Research report: NullMotion, VoiceStudio, manimgx

Everything here comes from reading the files. I installed nothing and ran no code from these repos; I only used git, diff and node one-liners to read JSON. One side effect: `git status` may have refreshed the stat cache in each repo's `.git/index`. No tracked files changed.

### manimgx: are the two copies the same?
- **Yes, they are identical.** `github repos\manimgx` and `manimgx\manimgx repo\manimgx` are both at HEAD `cfd33af` (2026-10-14, "Run Claude only when a maintainer mentions @claude"), with the same `origin/main`, 190 commits and 54.6 MB packs.
- `diff -rq --exclude=.git` finds no differences.
- They were cloned at different times on Oct 18 (01:18 and 14:01). Neither has been fetched since, so upstream may have newer commits. I did not fetch.
- `manimgx\package\` is **empty**.

---

## 1. NullMotion (blixvip/NullMotion)

**What it is and who it's for.** A local web page for studying, pitching or showing off motion-graphics ads. The finished ad plays on top. Underneath is one deliberately crude black-and-white "HyperFrames draft" per section, all frame-synced to the film, and the whole breakdown exports as one MP4.
- It is a free, open "public UI starter" carved out of a hosted product (Null Studio, nullmotion.com).
- Maturity: 28 commits from 2026-09-16 to 2026-10-28, v1.0.1, MIT. Small, young, actively taking first community PRs (frame-step keys, export crop).

**Architecture**
- Node 22+ with **zero npm dependencies**. `server.js` is a static server; `media.js` does byte-range streaming and runs ffmpeg to pull out the audio.
- Vendored libraries: **GSAP 3.14.2** and **mp4-muxer 5.2.1**. Plain ES modules in `public/`.
- Optional tools: FFmpeg/ffprobe, and Python 3 for `scripts/import-motionclone.py`, which imports references from their sibling repo MotionClone.
- Run with `npm start` → `127.0.0.1:4343`. The output is a 1920-wide, 24 Mbps H.264 MP4 carrying the reference's audio.

**How AI is used: none in this repo.**
- The README says the drafts "are authored, not AI-generated".
- Generation, rendering and Premiere endpoints return `501 NOT_CONNECTED`.
- The leftover UI does reveal the hosted product's AI pipeline, which is worth knowing (see clever ideas).
- `data/template-catalog.json` holds 23 "production prompts". Each template has:
  - a dense art-direction `prompt`, e.g. "Three approved app marks rise from below on shallow arcs… No generic tiles, looping bob, or decorative glow spam";
  - an `output` spec (1080×1920 or 1920×1080, 4–7 s, 30 fps, transparent);
  - typed `customizer` fields;
  - `assetIntent` (for example, 4 real brand logos required);
  - `qualityStatus: approved`.
- `AGENTS.md` is short: keep UI status honest about unconnected services, browser calls same-origin only, never add references to `showcase/` without the owner's choice, imported segments are non-destructive time ranges.

**What HyperFrames is, as far as the repo shows.** HyperFrames itself is not in the repo. The template pages (`public/NN-*/index.html`) follow its composition contract:
- a `<meta name="hyperframes" content="duration:5,fps:30,width:1080,height:1920,transparent:true">` tag;
- a **paused** GSAP timeline registered as `window.__timelines["root"]`;
- `window.startRender()`, and a `reactToAudio(amplitude, frequency)` hook;
- controls injected through `window.__nullMotionTemplateControls` or URL params.

The UI text says the companion "renders it through HyperFrames and Chrome, then produces transparent media with FFmpeg" (ProRes 4444 MOV). My own understanding, not shown in the repo, is that HyperFrames is HeyGen's open-source HTML-to-video renderer, which seeks a GSAP timeline frame by frame in headless Chrome. `public/drafts.mjs` is the repo's own tiny "HyperFrames-style" engine.

**Draft-to-final workflow**
1. **Sections.** `scripts/plan-sections.mjs` runs ffmpeg scene detection (`select='gt(scene,0.18)'`). It picks `clamp(round(dur/4.5), 3, 8)` sections, snapping each boundary to the real cut nearest the ideal split (within 45% of a section, at least 1.2 s from the ends). It writes `sections.json` and `cuts.json`, plus a 2-frames-per-section contact sheet for whoever writes the drafts.
2. **Drafts.** Each section in `drafts.json` is 1–2 beats `[kind, text, options]`. There are about 20 beat kinds (`text, logo, phone, window, input, chat, cards, list, chart, notify, icons, hub, cloud, collage, logos, shape, burst, grid, split, face`). Each builds a 640×360 DOM scene with one entrance and a slow drift.
   - Colours are forced to black/white/grey from the film's light-or-dark luminance only, and type is Arial.
   - A two-beat draft switches at the real scene cut that falls between 30% and 80% of the section.
3. **Playback.** The film's clock drives every draft. The active section seeks to `t - start`; inactive ones loop their own part.
4. **Export.** The breakdown is composed and exported in the browser:
   - A hidden copy of the film plays at **0.5×**. `requestVideoFrameCallback` captures every decoded frame with its `mediaTime`, and the film pauses whenever the encode queue gets 2 frames ahead.
   - Each draft DOM is cloned, put in an SVG `<foreignObject>`, decoded as an image and drawn on a canvas with the film.
   - WebCodecs `VideoEncoder` (avc1.640033, 24 Mbps, a keyframe every 2 s) encodes each frame stamped with the source timestamp. `AudioEncoder` handles the AAC, and mp4-muxer writes the file.
   - Nothing is recorded in real time, so no frames drop. Export needs Chrome or Edge.

**Clever ideas**
- Scene-cut-snapped sectioning; contact sheets as the input for writing drafts.
- Exporting with the browser's own video encoder, timed to the source film's frames.
- The hosted pipeline as the UI text describes it:
  - Ordered job stages: researching → sourcing authentic assets → optimizing → expanding → building HyperFrames source → linting the template contract → rendering transparent frames → **reviewing key frames → repairing visual issues → re-rendering**.
  - A "strict asset mode" that stops before building the composition if a required real logo is missing.
  - Transcript → "psychology analysis" → a sparse storyboard of **4–12 s overlay windows** ("source-video duration never becomes one monolithic composition").
  - Durable SQLite jobs; a skipped vision review is labelled "unreviewed", never shown as reviewed.

---

## 2. VoiceStudio (debpalash/VoiceStudio)

**What it is and who it's for.** A "fully-local ElevenLabs alternative": voice cloning, voice design from text, video dubbing, dictation, transcription, audiobooks and batch jobs, claiming 646 languages. It runs on desktop (Electron), Docker, and preview iOS/Android apps.
- **Very mature and very active.** 6,347 commits from 2026-04-10 to 2026-10-29 (latest merge #3663 that morning), 47 tags, latest v0.5.7 (beta channel too), many contributors.
- License: **AGPL-3.0**, with a paid commercial licence and "Pro" features from Yupcha Softwares, and a CLA.

**Architecture**
- **Backend:** Python ≥3.11 FastAPI (<0.137) + uvicorn, alembic/SQLite.
  - Main libraries: torch ≥2.4, transformers ≥5.10, whisperx ≥3.1, faster-whisper, pyannote 3.x, demucs, pedalboard (<0.9.21, newer wheels crash older CPUs), audioseal, argostranslate, yt-dlp, sherpa-onnx, `mcp` ≥1.28, litellm/openai/boto3/google-auth.
  - Managed with uv; `uv.lock` is 1.8 MB.
- **Frontend:** Electron ^44 + React ^19 under bun 1.4.2. Mobile apps are native Swift and Kotlin. A Rust native helper sits in `native/`.
- **Running it:** installers, the `irm https://voicestudio.sh/install.ps1 | iex` installer, or from source with `bun run dev`. The backend listens on **`localhost:3900`**.

**TTS engines** (registry in `backend/services/tts_backend.py`; heavy engines lazy-load in their own venv or subprocess):

| Engine | Notes |
|---|---|
| **OmniVoice** (k2-fsa, default) | Zero-shot cloning, 600+ languages, 24 kHz mono, plus voice design from attribute tags ("female, young adult, british accent"); the repo's own job map credits it with "best zero-shot clone quality" |
| OmniVoice GGUF | Quantized native binary for low-VRAM/CPU, Vulkan on AMD/Intel/NVIDIA |
| OmniVoice subprocess | Same model in a crash-isolated sidecar |
| VoxCPM2 | Clone + design, 48 kHz |
| CosyVoice 3, CosyVoice 3 GGUF | Clone + written delivery direction |
| IndexTTS 2.5 | Clone + graded emotion vectors |
| MOSS-TTS-Nano, MOSS-TTS-v1.5 (8B) | Cloning |
| dots.tts (2B) | Not on Windows, except through audio.cpp |
| Confucius4-TTS | Cloning |
| audio.cpp | Breeze-TTS-2 (weights non-commercial), dots.tts SOAR |
| KittenTTS, Supertonic-3 | CPU, preset voices |
| PocketTTS (Kyutai) | CPU |
| Sherpa-ONNX | — |
| GPT-SoVITS | External server |
| MLX-Audio | Apple Silicon only (Kokoro, CSM, Dia…) |

- **Not supported:** no F5-TTS, XTTS or Fish Speech engines, and no cloud TTS (ElevenLabs etc.).
  - F5-TTS was evaluated and declined because its weights are CC-BY-NC (`docs/competitive-analysis.md`).
  - Kokoro is only available through MLX on Macs.
- **ASR engines:** WhisperX (default; wav2vec2 word timing ±10–30 ms), faster-whisper, PyTorch/MLX Whisper, whisper.cpp, Parakeet, Moonshine, FunASR, and an OpenAI-compatible server. Diarization uses pyannote.

**Cloning, GPU and quality**
- **Cloning:** clips up to 75 s are accepted; 5–15 s is recommended (3–10 s for OmniVoice). OmniVoice uses up to 20 s, auto-picking the 15 s window with the most speech and auto-transcribing it. Clips are reported per engine as `max_ref_seconds` / `ref_strategy`.
- **GPU:** OmniVoice has a measured **6 GB VRAM floor**; 4 GB cards page to RAM and crawl. CUDA/ROCm runs fp16 + `torch.compile`. CPU works, just slower. On Windows, PyTorch GPU support is NVIDIA-only.
- **Quality:**
  - Mastering chain, 8–64 sampling steps, 16/24/32-bit WAV, and an AudioSeal watermark on output.
  - Long text is chunked at about 15 s with crossfades.
  - `/generate` accepts `duration` (a fixed output length, which overrides `speed`), `speed`, `seed`, `instruct`, emotion parameters, `profile_id` and `engine`.
  - The benchmarks table is **empty** ("No verified rows yet"), so there are no published speed or quality numbers.
- **Licensing:** the default OmniVoice weights are **CC-BY-NC**, and its audio tokenizer carries Higgs Audio/Llama terms. That matters for monetized YouTube output.

**API another program could call: yes, with several surfaces**
- OpenAI-compatible `POST /v1/audio/speech`:
  - `voice` can be a saved profile ID or name; `model` is an engine ID or an alias like `tts-1`.
  - Formats: mp3/opus/aac/flac/wav/pcm; streaming as chunked bytes or SSE.
- `/v1/audio/transcriptions` with `verbose_json` and word timestamps (`timestamp_granularities[]=word`), plus srt/vtt.
- A native `/generate` with the full set of parameters; `/openapi.json`; `/.well-known/voicestudio-speech`.
- A WebSocket for live speech-to-text.
- **MCP** at `:3900/mcp/` (Streamable HTTP) or `python -m backend.mcp_shim` (stdio). Tools:
  - `generate_speech`, `clone_voice`, `describe_voice`, `design_voice`, `transcribe`, `list_*`, `check_health`.
  - `OMNIVOICE_MCP_OUTPUT_MODE=files` keeps audio out of the agent's context; `OMNIVOICE_MCP_BASE_PATH` is the file-access security boundary.
- Loopback calls need no key; remote calls use a bearer key.

**How AI is used**
- All TTS and ASR models run locally.
- LLMs are optional and used only for six named "LLM skills": `dub_translation`, `cinematic_translation`, `slot_fitting`, `glossary_extract`, `direction_parse` and `dictation_refinement`.
  - Each can be switched off or sent to a different provider.
  - Providers: Ollama (qwen3:4b verified on Windows), OpenAI-compatible hosts including OpenRouter, Anthropic/Bedrock/Vertex via LiteLLM, or the **installed Claude Code/Codex CLIs** using their existing login.
- `services/director.py` is a "casting director" prompt. It maps a free-text delivery note onto a fixed taxonomy (energy / emotion / pace / intimacy / formality) and must answer JSON only. A keyword fallback is used when no LLM is configured. The resulting tokens feed translation, the TTS `instruct` and the speech-rate target.

**Agent files**
- `skills/voicestudio/SKILL.md` (for users). It covers:
  - checking `/health` and then `/openapi.json` and `/v1/audio/voices` first, and never inventing profile IDs;
  - curl recipes;
  - verifying the output really is audio, because an error body can land at the output path;
  - never faking success, never downloading models or switching to a cloud provider without authorization;
  - treating 401/403 as auth failures, not a reason to disable auth.
- `skills/voicestudio-maintainer/SKILL.md`: triage, PR review and release preparation with explicit authorization limits.
- `.claude/agents/owner-judge.md` (model: opus): an adversarial reviewer returning BLOCK/CONCERNS/PASS. "PASS means I attacked this and it held." It reverts the fix to prove the regression test fails, and hunts the rest of the bug class.
- `CLAUDE.md` / `AGENTS.md` are long owner-rule documents: dated "owner-set" decisions, a list of sanctioned network calls, a token-economy directive, and "mechanical rules belong in tests, not agent effort".

**Clever ideas**
- "Engines are hired for a job": a job map where each job has exactly one holder.
- Each heavy engine runs in its own venv or subprocess, isolated from the others' dependencies and crashes.
- The voice-cache contract and `max_ref_seconds` honesty.
- A seed for repeatable voice-design identity.

---

## 3. manimgx (academa-labs/manimgx)

**What it is and who it's for.** "A 3D animation engine for agents" with Manim CE's Python API, on a Rust + wgpu core. Aimed at agent-written math and 3D explainer videos.
- 190 commits from 2026-03-27 to 2026-10-14, tags v0.1.0 and v0.1.1. Made by Academa (Abdullah Geduk, Sina Atalay).
- MIT code, but the native wheels are GPL-3.0-or-later as a whole because they bundle x264.
- Engineering is rigorous: a typed API, Hypothesis property tests, mutation testing, and an integration corpus of rendered reference frames with a human review panel.

**How it differs from 3b1b manim and ManimCE**
- ManimCE's *API*, not its *behaviour*: "the corpus is the specification", and CE's bugs aren't copied.
- `import manimgx as m`; the API is fully statically typed (TypedDict kwargs, typed `.animate`). Every frame is evaluated at its exact time.
- Updaters taking `dt` run on a fixed clock, so results don't change with fps.
- Rotations are rigid. Duplicate names are deprecated (`MovingCameraScene` → `Scene`). A tall frame's short side is 8 units.
- **No LaTeX install:** Tex/MathTex go LaTeX → Typst via mitex. No ffmpeg install either.
- It has manim-voiceover and manim-slides built in.
- Benchmark (M4 Pro, 5 scenes, 36.2 s of 1080p60): 3.08 s total. That is 90.6× faster than ManimCE, 11.5× faster than ManimGL, and 18.7× faster than Blender Workbench. The benchmark folder includes the Blender Python scene scripts it raced against.

**Architecture and rendering pipeline**
- The Python 3.13+ package (`src/manimgx`) evaluates scene state.
- The Rust crate `rust/engine` (built with maturin) does the rest:
  - draws with wgpu: Metal on macOS, D3D12 on Windows, Vulkan on Linux, and Mesa lavapipe on the CPU when there is no GPU;
  - WGSL shaders and PBR lighting adapted from Filament (image-based lighting, AO, shadows, bloom, AgX tone mapping);
  - typesets text with Typst and bundled Noto fonts;
  - encodes H.264 with x264 to MP4, and decodes audio with FFmpeg/libopus.
- Python deps: numpy ≥2.4.3, pillow, skia-pathops, svgelements, typer, networkx, isosurfaces.
- **Browser build:** `npm install manimgx` runs Pyodide in a Web Worker with a WASM core on WebGPU, so a scene can be embedded with no render server.
- CLI commands: `render` (`-r WxH --fps --preset --crf`; MP4 only, and I found no transparent/alpha export), `inspect`, `present` (slides in the browser) and `preview` (live window).
- 3D is built from primitives (Surface, Sphere, Torus, polyhedra, lights, materials). I found no glTF/OBJ mesh import.

**How AI is used**
- **AI is used only for TTS in `self.say()`**, through **fal.ai** (cloud, `FAL_KEY`). The default voice is ElevenLabs Eleven v3. Also supported: MiniMax Speech 2.8 HD, Gemini 3.8 Flash TTS, Inworld and Qwen3-TTS 1.7B, each with typed settings.
  - A voice is just a function from text to a `Speech` object, so any TTS can be plugged in.
- **Word timing:** Eleven v3 returns real character timings, which `timed()` maps to words. If the letters don't match (e.g. it said "two" for "2"), words are *estimated*: the voiced span (10 ms frames above a 0.02 level) is shared by letter count, with extra weight after commas and full stops.
- **Cue syncing:** `self.say("The derivative of [x squared] is [two x].", anim1, anim2)`.
  - Bracketed spans are not spoken. Each animation starts at its first bracketed word and lasts at least as long as the span.
  - The scene waits for the line to finish, and editing the words re-times the animations.
  - Captions come out as `.srt`.
- **Voice cache:** `voice/<slug>-<digest>.mp3` plus a JSON of `{text, voice identity, audio digest, words[[w,start,end]]}`, committed alongside the scene.
  - The key is a digest of the voice's identity (dataclass repr, or code + closure values, never the API key) plus the text.
  - It re-renders offline, only changed lines hit the service, and you can drop in your own recording under the same name to have it re-timed.
- **`manimgx inspect`:** runs the scene without encoding. It samples the end of each play/wait, or chosen `-t` times, and writes numbered storyboard PNGs (6 per sheet). It lists every play with its file:line and checks 2D layout:
  - clipped by the frame;
  - text overlapping text;
  - a line or fill over text;
  - text too small to read.
  - Problems are named by the code's variable names (`title`), outlined in red, and give exit code 1. 3D scenes skip the layout checks.
- **Agent files:**
  - `skills/manimgx/SKILL.md` (installed via `npx skills add academa-labs/manimgx`): write a `Scene`, compose placement with VGroup/next_to/arrange, use ValueTracker and time-based updaters, run `inspect`, look at the pictures and fix overlaps, then do a draft render at 1280×720/30 fps, then the final, and deliver the video with its source.
  - An `llms.txt` primer (inside `docs/zensical.toml`, tested by `tests/docs/test_llms.py`): install with `uv tool install --python 3.14 manimgx`, don't install `manim`/ffmpeg/LaTeX, keep within x∈[-7,7], y∈[-4,4], plus an API cheat sheet.
  - `AGENTS.md`: developer rules.
  - A GitHub `claude.yaml` workflow (claude-code-action) that runs only when a write-access maintainer mentions @claude.

---

## Comparisons with your engine (notes only)
- manimgx's `say()` with bracketed words is the same idea as your Remotion layer keyed to narration cue timing, with the word timestamps stored in a committed JSON.
- Its digest-keyed voice cache matches your rule of never making a paid call for a file that exists.
- `inspect` is an automated storyboard and layout QA step, done without a full render.
- NullMotion's ffmpeg scene-cut sectioning, and the hosted pipeline's "review key frames → repair → re-render" loop, are the kind of reference-analysis and visual-QA stages your brief-to-render flow has around it.
- VoiceStudio's `/v1/audio/speech` is OpenAI-shaped, and its speech-to-text returns word timestamps.

## What I couldn't determine
- HyperFrames' actual implementation: it isn't in NullMotion, and Null Studio's companion isn't published.
- VoiceStudio's real speed and quality: the benchmarks table is empty, and I didn't run it.
- Whether VoiceStudio's OpenAI route accepts `duration` or `seed`; I only confirmed them on native `/generate`.
- Whether manimgx upstream has moved past `cfd33af`, since I didn't fetch.
- Whether manimgx can export with transparency or import external meshes. I found neither in the CLI, docs or `mobjects/`.
- How well manimgx's GPU path works on Windows in practice.
