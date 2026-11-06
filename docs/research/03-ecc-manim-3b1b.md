# Explore ECC, manim, 3b1b videos

## Research report: ECC, 3b1b/manim, 3b1b/videos

Everything here is read-only. I didn't install or run anything, so all behaviour described comes from reading code and docs. Paths are relative to `D:\code_files\resources to make content engine\github repos\`. The same folder also holds `manimgx`, `NullMotion` and `VoiceStudio`, which were out of scope and not reviewed.

---

## 1. ECC (affaan-m/ECC)

### Purpose and maturity
- **What it is:** a cross-harness plugin and "agent harness OS" for Claude Code. It also has adapters for Codex, Cursor, OpenCode, Gemini, Kimi, Qwen, Zed, Copilot and others. Its loop is plan → test → implement → review → verify → remember → improve. Its slogan is "Optimize the context window. Persist everything else."
- **Release:** version 2.2.3 (released 2026-10-01). It is distributed as npm `ecc-universal`, with the Claude plugin slug `ecc@ecc`. There is a paid "ECC Pro" GitHub App for private repos.
- **License:** MIT, © 2026 Affaan Mustafa.
- **Activity:**
  - 4,059 commits. Last commit 2026-10-26.
  - 789 commits in the last 30 days, so it is extremely active.
  - About 493 author names in shortlog. Affaan Mustafa has about 1,636 commits and "haelyra" about 558.
  - The earliest commit in this clone is 2026-01-17. The history may have been rewritten; I can't tell.
- **Size:**
  - Skills: 311 (614 files).
  - Agents: 71.
  - Commands: 97, now framed as "legacy shims"; skills are the main entry point.
  - Hooks: 27 hook entries in `hooks/hooks.json` backed by about 60 scripts in `scripts/hooks/`.
  - Rules: 122 files.
  - Tests: 518 files.
  - Docs: 1,540 files, mostly translations.
- **Maturity read:**
  - Heavy engineering on install, safety and validation: schema-checked hooks, CI validators, per-platform installers.
  - The catalogue is very broad, and many skills are "community"-origin niche packs (homelab, supply chain, prediction markets, HarmonyOS).
  - Quality claims are self-reported. GateGuard's "+2.25 quality points A/B" is one example.
  - `ecc2/` is explicitly labelled alpha.

### Structure map (top level)
- `agents/` holds 71 subagent `.md` files. Frontmatter has `name`, `description`, `tools` and `model` (opus, sonnet or haiku). Every agent body starts with an identical "Prompt Defense Baseline" block.
- `skills/<name>/SKILL.md` has frontmatter `name`, `description` and `metadata.origin` (ECC or community). Many skills bundle `scripts/`, `references/`, `rules/` or `assets/`.
- `commands/` holds slash-command markdown. `legacy-command-shims/` holds the opt-in old short names.
- `hooks/` contains:
  - `hooks.json`, the harness-facing file.
  - `hooks.metadata.json`, a sidecar with stable IDs and fingerprints.
  - `memory-persistence/`, `codex-hooks.json` and `qoder-hooks.json`.
- `scripts/` holds about 372 Node and Python files: hook implementations, install/doctor/repair, the memory vault, plan-canvas and CI validators.
- `manifests/` drives selective installs (`install-modules.json`, `install-components.json`, `install-profiles.json`). For example, module `media-generation` installs blender-motion-state-inspection, fal-ai-media, manim-video, remotion-video-creation, ui-demo, video-editing, videodb, taste, tasteforge-video, taste-distillation and taste-application. Other modules include `social-distribution` (crosspost, x-api, social-publisher) and `business-content`.
- `rules/` holds always-loaded standards (common plus per-language). `contexts/` and `mcp-configs/` hold one MCP config.
- Per-harness adapter dirs: `.claude-plugin/`, `.codex/`, `.cursor/`, `.opencode/`, `.gemini/`, `.kiro/` and so on.
- `ecc2/` is a Rust control plane. `ecc_dashboard.py` is a Tk GUI.
- There is no `docs/` index file. The useful docs are:
  - `docs/ECC-2.0-REFERENCE-ARCHITECTURE.md`
  - `docs/continuous-learning-v2-spec.md`
  - `docs/SKILL-DEVELOPMENT-GUIDE.md`
  - `docs/token-optimization.md`
  - `docs/business/social-launch-copy.md`, which is ECC's own launch-post templates.
- `the-shortform-guide.md` and `the-longform-guide.md` are guides to ECC and Claude Code usage, not to short-form video.

### Content, video and social skills (the directly relevant ones)

| Path | What it does / structure |
|---|---|
| `skills/content-engine/SKILL.md` | Same name as the user's project, but it is a **copywriting** skill, not a video pipeline. It covers platform-native posts and scripts for X, LinkedIn, TikTok/short video, YouTube and newsletters. Content is "source-first": voice comes from `brand-voice`. Repurposing flow: anchor asset → 3–7 atomic claims → rank → one idea per output → per-platform adapt → quality gate. It has a hard-ban phrase list and rules like "first seconds show result/problem/punch" and "don't write narration that sounds better on paper than on screen". |
| `skills/video-editing/SKILL.md` | A 6-layer pipeline for **editing real footage**: capture → Claude (transcript, EDL) → FFmpeg (cuts, loudnorm, scene and silence detect, 9:16 and 1:1 reframes) → Remotion (overlays) → ElevenLabs/fal (VO, music, SFX) → Descript/CapCut (human polish). Its thesis is "the value is compression, not generation". It also ships DaVinci Fusion preset bundles with provenance.json and an idempotent Lua installer. It warns: "save a versioned project checkpoint; an API readback proves in-memory state, not that it was saved". |
| `skills/remotion-video-creation/` | A 43-line index plus 29 rule files (`rules/*.md`) covering 3D/R3F, audio, captions (`createTikTokStyleCaptions`, word highlighting), SRT import, transcribe-captions, timing (spring presets), sequencing, transitions, measuring-text, fonts, charts and Lottie. It reads like Remotion's official agent rules, but there is no origin field, so I can't confirm the source. |
| `skills/manim-video/` | Short workflow: one-sentence visual thesis, 3–6 scenes each proving one thing, outline before code, `-ql` smoke render first, export one thumbnail frame. Ships a starter `assets/network_graph_scene.py`. It assumes the `manim` CLI (ManimCommunity), not ManimGL. |
| `skills/taste/` | An opinionated creative-direction layer: angelcore / cloud-trance / hyperpop, with a 74-line genre taxonomy. It gives hex palettes, "one accent per shot", beat-locked cut grammar and do-nots. Thesis: "taste must be decided first". |
| `skills/taste-distillation/` (plus Python `scripts/taste/*`) | Measures reference videos into a **style pack**: `grade.json`, `cadence.json`, a 33³ `look.cube` LUT, stills, overlay plates, GLB props and a VLM `spec.json`. Detailed in the mechanisms section below. |
| `skills/taste-application/` (81 files: `pipeline.py`, `forge.py`, `verify.py`, `blender_prop.py`, `mint3d.py`, `resolve_ingest.py`, fal workflow JSONs) | Generates against a pack and cuts. Ships FCPXML 1.9 + CMX3600 EDL beside the MP4, and numeric verification. Detailed in the mechanisms section below. |
| `skills/tasteforge-video/` | Documents the packaged offline CLI `python -m tasteforge` (interview, distill, validate, apply, export, multimodal, provenance). It enforces a strict **fail-closed provider boundary** and SHA-256 receipts. |
| `skills/blender-motion-state-inspection/` | Says don't judge 3D animation from screenshots. Instead, extract structured state with `blender --background --python` (bones, bounds, contacts, facing, per-frame samples), then confirm with renders. Has a report template and thresholds: more than 1–2 cm floor penetration, more than 5% scale drift, more than 30°/frame heading jump. |
| `skills/fal-ai-media/` | fal.ai MCP (`npx fal-ai-mcp-server`) for images (Nano Banana), video (Seedance, Kling, Veo 3), TTS (CSM-1B), video-to-audio (ThinkSound), plus cost estimation. |
| `skills/videodb/` | The VideoDB SDK (SaaS): ingest, spoken/visual indexes, timestamped search to clips, subtitles, dubbing, reframe, RTSP alerts, desktop capture. |
| `skills/ui-demo/` | Playwright demo videos in three phases: Discover (dump the DOM's interactive elements), Rehearse, Record. |
| `skills/frontend-slides/`, `motion-foundations`, `motion-patterns`, `motion-advanced` | HTML slide decks, and React motion/react tokens and patterns. Web UI, not video. |
| `skills/social-publisher/` | Schedules and publishes to 13 platforms (including YouTube, Instagram, TikTok and Facebook) through the third-party **SocialClaw** SaaS (`socialclaw validate` → `apply` → `status`). The rule: show every post and get explicit approval, and "never run `apply` in the same step that generated the content". |
| `skills/crosspost/`, `skills/x-api/` | Per-platform adaptation across X, LinkedIn, Threads and Bluesky (never identical copy), plus X OAuth, rate limits and posting. |
| `skills/marketing-campaign/` + `agents/marketing-agent.md` (sonnet; Read, Grep, WebSearch, WebFetch) | Research → positioning (locked before any copy) → landing page → email → social → timestamp-blocked short-video scripts → ad variants → content calendar → review gate. |
| `skills/brand-voice/`, `brand-discovery/`, `article-writing/`, `seo/`, `agents/seo-specialist.md` | `brand-voice` builds a voice profile from the author's real examples. `brand-discovery` is a resumable 8-module interview that persists answers to disk. |
| Research: `deep-research`, `exa-search`, `research-ops`, `market-research`, `competitive-platform-analysis`, `data-scraper-agent`, `lead-intelligence` | MCP-based (firecrawl, exa) cited research with untrusted-source rules. `data-scraper-agent` runs on a schedule on GitHub Actions. |
| `skills/growth-log/`, `content-hash-cache-pattern/`, `cost-aware-llm-pipeline/` | Respectively: learning-log entry format; SHA-256 content-addressed caching of expensive file processing; model routing and budget tracking. |

No analytics-ingestion skill exists for YouTube or Instagram metrics. Analytics only appears as "delivery status" in social-publisher and in x-api.

### Hooks system
- `hooks.json` contains only keys Claude Code accepts. Stable IDs and descriptions live in `hooks.metadata.json`, aligned by event and index, and each entry carries a **fingerprint** of matcher plus command. CI (`scripts/ci/validate-hooks.js`) fails if the two files drift. This avoids the unknown-key warnings Claude Code gives on plugin hooks.
- **Every hook command is `node run-with-flags.js <hookId> <script> <profiles>`.** The runner checks:
  - the profile (`ECC_HOOK_PROFILE` = minimal, standard or strict);
  - `ECC_DISABLED_HOOKS`;
  - bounded stdin (1 MB cap). The hooks that can't inspect a truncated request "fail closed".
- Bash and PostToolUse checks are **consolidated into dispatchers**, one process per event, to cut latency.
- **Events covered:**
  - PreToolUse: bash dispatcher, PowerShell gate, doc-file warning, suggest-compact, continuous-learning observe (async), governance capture, config-protection, MCP health-check, GateGuard, Hookify.
  - UserPromptSubmit (Hookify), PreCompact (save state), SessionStart (load context and instincts, Plan Canvas resume).
  - PostToolUse (sync and async dispatchers), PostToolUseFailure (MCP health, skill-failure telemetry).
  - Stop: Hookify, plan-canvas-pending, batched format plus tsc, console.log audit, session persist, evaluate-session, cost tracker, desktop notify.
  - SessionEnd.
- **Notable hooks:**
  - **config-protection** blocks edits to linter/formatter configs, which "steers agent to fix code instead of weakening configs".
  - **mcp-health-check** marks failing MCP servers unhealthy, blocks calls to them, and tries to reconnect.
  - **Hookify** loads `.claude/hookify.*.local.md` rules (regex or condition lists; warn or block). Git-tracked rules are disabled by default so that cloning a repo can't activate its instructions. Each regex has a 25 ms timeout. Stop rules respect `stop_hook_active` to avoid loops.
  - **stop:format-typecheck** batches formatting and type-checking once at Stop instead of after every edit.
  - **delivery-gate** (separate opt-in Python Stop hook) blocks finishing a "complex task" (3 or more edits) if learning logs weren't touched today (checked by mtime) or disk is critically low. It blocks at most once per Stop.

### The most clever mechanisms, in detail
1. **Continuous Learning v2: "instincts"** (`skills/continuous-learning-v2/`, `scripts/hooks/session-start.js`)
   - **Capture.** `hooks/observe.sh` runs on every Pre and PostToolUse; hooks are deterministic, whereas v1's skill-based capture fired only "~50-80%" of the time. It appends to `~/.local/share/ecc-homunculus/projects/<12-char hash of git remote>/observations.jsonl`. Tool input and output are truncated to 5,000 chars and secret-scrubbed with a linear-time regex.
   - **Analysis.** A background `observer-loop.sh` periodically runs `claude --model haiku --print` with `ECC_SKIP_OBSERVE=1` (so it doesn't observe itself). It triggers every 5 minutes or after 20 or more observations, or on SIGUSR1, which is throttled.
   - **What the observer looks for:** user corrections, error→fix sequences, repeated tool sequences and tool preferences.
   - **Output.** Atomic YAML+MD "instincts" (`id`, `trigger`, `confidence` 0.3–0.9, `domain`, `scope` project or global, evidence). Confidence rises with repetition and with the user *not* correcting, and falls on correction, contradiction or disuse.
   - **Promotion.** An instinct seen in 2 or more projects with average confidence ≥ 0.8 moves to global.
   - **Evolution.** `/evolve` clusters instincts into generated commands (user-invoked sequences), skills (auto-triggered) or agents (multi-step).
   - **Feedback.** At SessionStart, instincts with confidence ≥ 0.7 are ranked by confidence plus a small boost for project scope or a detected-stack match. The top 6 are injected as `Active instincts: - [project 85%] <action>`, capped at 8,000 characters of context.
   - **Limitation:** the docs say the observer **doesn't survive on native Windows** (Git Bash Job Object kill) and needs WSL.
2. **GateGuard fact-forcing** (`scripts/hooks/gateguard-fact-force.js`, `skills/gateguard/`)
   - It denies the *first* Edit or Write of each file and the first destructive Bash/PowerShell command.
   - The denial lists the facts to gather, chosen by target class. For code: all importers, the affected public API, the data schema, and the user's instruction quoted verbatim.
   - The retry is allowed once the facts are presented, and a completed search naming the file counts as credit.
   - Rationale: "LLM self-evaluation doesn't work… asking 'list every file that imports this' forces Grep/Read."
3. **Santa Method** (`skills/santa-method/`). The generator, then **two context-isolated reviewers** with the same rubric return structured JSON verdicts. Output ships only if both PASS; otherwise all flags are fixed and both re-review, up to an iteration cap, then it escalates to a human. Explicitly meant for gating published or brand-sensitive content.
4. **GAN-style harness** (`skills/gan-style-harness/`, agents `gan-planner`, `gan-generator`, `gan-evaluator`; `/gan-build`). A planner expands the spec. Generator and evaluator (the evaluator drives a live app with Playwright) iterate 5–15 times, after first agreeing a "sprint contract". It cites Anthropic's harness-design post.
5. **skill-comply** (`skills/skill-comply/`, Python). It auto-generates expected behavioural specs from any skill or rule `.md`. It then builds scenarios at three prompt-strictness levels, runs `claude -p` capturing **stream-json** tool traces, classifies tool calls against the spec steps with an LLM, and checks ordering deterministically. The report gives compliance rates and suggests which steps to promote into hooks.
6. **TasteForge "measure, don't prompt"** (taste-distillation and taste-application)
   - The core finding is measured: colour words in generation prompts moved the target a* by +0.3 to +2.8 against a +24.9 target, while a measured LUT hit chroma MAE 1.88 in one free pass. So prompts say "Colour: none. Render neutral."
   - **Measurement choices:**
     - chroma is measured per luminance zone, as median + MAD rather than mean;
     - contrast = std(L*);
     - background share below L*10;
     - static UI is masked by temporal variance, and burnt-in chrome is detected by Sobel energy on the temporal *median*;
     - adaptive scene-cut threshold sweep in one decode pass.
   - **Generation and cutting:**
     - generates **takes, not shots** (about 5 s takes cut internally: 77% vs 21% generation efficiency);
     - re-encodes rather than stream-copying, to keep sub-second cuts;
     - samples shot lengths from the reference distribution.
   - **Outputs and checks:**
     - every run ships an editable FCPXML/EDL, validated (offsets sum, refs resolve, files exist);
     - verification is numeric (background share, zone MAE, banding, cadence);
     - everything has `--dry-run`, and live provider calls need `TASTE_FORGE_ALLOW_LIVE=1`;
     - "an ambiguous provider timeout is not retried as a new paid job";
     - receipts bind every artifact by path, size and SHA-256 with `provider_calls:0`.
   - **Blender:** `blender_prop.py` uses a black world with transparent film, key plus rim light with the rim colour taken from the pack's peak-chroma zone, and **view transform Standard, not AgX/Filmic**, to avoid double tone-mapping before the LUT.
7. **Plan Canvas** (`skills/plan-canvas/`, `scripts/plan-canvas.js`). A loopback server on `127.0.0.1:4517` opens a plan or HTML artifact in the browser; the human annotates elements, chats and clicks Approve or Request changes. The agent blocks on `ecc-plan-canvas await <path>`, run in the background so the loop survives across turns. A Stop hook delivers undelivered feedback, and SessionStart resumes open reviews.
8. **Unified Memory Vault** (`skills/unified-memory/`, `ecc memory`, `ecc-memory-mcp`). Portable `ecc.memory.v1` markdown files at three scopes: project (`.ecc/memory/project`, with a fail-closed gitignore), team (version-controlled) and user. Searchable across harnesses for handoffs. Recalled content is treated as untrusted evidence.
9. **`/learn-eval`** extracts a pattern from the session as a draft `SKILL.md`. It then runs a checklist: grep existing skills and MEMORY.md for overlap, and decide global vs project placement. Finally a verdict decides whether to absorb, rename or overwrite, and saving needs explicit approval.

Other loop and orchestration skills, all markdown patterns:
- `verification-loop` (build, types, lint, tests, security grep, diff review → PASS/FAIL report);
- `eval-harness` (pass@k / pass^k);
- `council` (four voices);
- `continuous-agent-loop` and `autonomous-loops`;
- `loop-design-check` (Goodhart and spinning risks);
- `ralphinho-rfc-pipeline` (RFC → DAG → merge queue);
- `team-agent-orchestration` and `claude-devfleet` (worktrees);
- `dmux-workflows` (tmux panes);
- `orch-*` (gated Research → Plan → TDD → Review → Commit with two human gates);
- `iterative-retrieval` (refines subagent context across passes);
- `operator-approval-loop` (hashed drafts plus approval receipts for outbound messages);
- `agents/loop-operator.md` and `agents/harness-optimizer.md`.

### ecc2 and ecc_dashboard.py
- **`ecc2/`** is a Rust "control plane" alpha of about 55k lines, mostly `main.rs`, `tui/dashboard.rs`, `session/{manager,store}.rs` and `worktree/`. It offers:
  - a terminal UI dashboard;
  - a SQLite session store that is the cross-process truth, read by monotonic cursor;
  - start, stop, resume and daemon for agent sessions, optionally in their own git worktree;
  - risk scoring and observability;
  - a `harness-eval` registry: candidate configs are SHA-256-addressed, compared on paired seeds against the active baseline, and promoted only if minimum samples, mean delta and win rate pass. DB triggers forbid edits to audit rows.

  Its own README says don't market it as done.
- **`ecc_dashboard.py`** is a Tkinter desktop GUI (`npm run dashboard`). It scans `agents/`, `skills/`, `commands/` and `rules/` frontmatter into searchable tabs, can launch terminals, and its version label still says v1.10.0. `npm run dashboard:web` is a browser alternative (`scripts/dashboard-web.js`, not read).

### Points of comparison with the user's engine (notes only)
- ECC's `content-engine` is copywriting. ECC has no end-to-end narrated-explainer pipeline (brief → TTS → 3D → 2D keyed to cues → publish). Its video skills are separate pieces: editing footage, Remotion rules, Manim, and taste/grade matching.
- The ideas closest to the user's rules:
  - fail-closed paid calls, dry-run modes and SHA receipts (compare the user's "never pay for a file that exists");
  - the approval gate before publish, with generation and publishing in separate steps;
  - skill-comply's use of `claude -p` stream-json (the same channel the user's chat uses);
  - Plan Canvas as a local browser approval loop (compare BriefBoard).
- ECC's publishing goes through SocialClaw SaaS, whereas the user calls the platform APIs directly.

---

## 2. 3b1b/manim (ManimGL)

- **What it is:** Grant Sanderson's own animation engine. The PyPI package is `manimgl`, the CLI is `manimgl` (or `manim-render`), the import is `manimlib`. MIT licence. 6,478 commits since 2015; last commit 2026-09-09; 105 commits in the last 3 months. Grant has about 4,932 of the commits.
- **Version:** `setup.cfg` says 1.7.2, and the last tag `v1.7.2` is from 2024-12-12. Master has moved far past it; the 3b1b/videos README says to install from source because PyPI is out of date. Requires Python 3.10+, FFmpeg, and optionally LaTeX.
- **Correction to the brief: rendering is no longer OpenGL on master.** In August 2026 the renderer was ported from moderngl/GLSL to **wgpu-py (WebGPU)**:
  - commits such as "Draw on wgpu: the renderer…" (2026-08-04) and "Install what the port actually needs" (2026-08-06);
  - `requirements.txt` lists `wgpu` and `rendercanvas`, with no moderngl;
  - shaders are now `manimlib/shaders/*.wgsl` (fill, stroke, surface, textured_surface, image, video, true_dot, fractals);
  - a new `manimlib/renderer/` package (gpu.py, pipeline.py, shared uniform buffers, render bundles that replay unchanged draw sequences, `draw_together` batching, z-index).

  Output is still raw frames piped to an `ffmpeg` subprocess (libx264/yuv420p by default, `-t` for alpha). Audio is mixed with pydub (`add_sound(file, time_offset, gain)`).
- **New in September 2026:** `VideoMobject` (decodes video with PyAV and preloads short clips to the GPU as a layered texture; `set_time`, `loop`) and `Sprite` (nearest-neighbour filtering). `ThreeDModel` and `TexturedGeometry` load OBJ and GLB via trimesh and pywavefront.
- **How scenes are written:** subclass `Scene`, `ThreeDScene` or `InteractiveScene` and implement `construct()`. Inside it, build mobjects (`Tex(R"...")`, `Text`, `VGroup`, `NumberPlane`, `ValueTracker`) and call `self.play(Write(x), FadeIn(y, lag_ratio=0.1))`, `x.animate.shift(...)`, `self.wait()`. Dynamic behaviour comes from updaters (`add_updater`, `always(...)`, `f_always`). The camera is `self.frame`. Config comes from `default_config.yml`, overridden by a per-directory `custom_config.yml`.
- **Interactive mode, the signature feature:**
  - `manimgl file.py Scene -e <line>` (`-se` = skip to that line) drops into an embedded IPython shell at that line, with the live window and the scene's local variables. Shortcuts include `play`, `add`, `undo`, `redo`, `save_state`, `reload()` (which re-runs the file with the window kept open, after a syntax check) and `autoreload`.
  - `checkpoint_paste()` runs the clipboard. If the snippet starts with a `# comment`, the first run saves the scene state under that key and later runs restore it first, so a block can be re-run idempotently. Variants are `skip=True` (no animation) and `record=True` (render that block to file).
  - Errors flash a red border.
  - `InteractiveScene` adds mouse selection, grab/resize (g/h/v/t) and copy/paste of mobjects or Tex.
  - Other flags: `-p` presenter mode (pauses at each `wait` like slides; `wait(note=…)`), `--subdivide` (one movie file per animation), `-n` (start at animation N), `--prerun`, `--uhd`, `--hd`, `-l`.
- **Differences from ManimCommunity** (only partly visible in this repo; the rest is my general knowledge):
  - CE is a 2020 fork that values stability, tests, documentation and plugins, with the `manim` CLI and `MathTex`.
  - GL is Grant's fast-moving personal tool: GPU renderer (now wgpu), live window plus IPython embed and checkpoint workflow, `Tex`/`TexText`, fewer stability guarantees. Older 3b1b code breaks across versions.
  - ECC's `manim-video` skill targets CE.
  - Narration sync tools such as `manim-voiceover` exist for CE but aren't in either of these repos.

---

## 3. 3b1b/videos

- **What it is:** scene code for 3Blue1Brown videos. Content is licensed CC BY-NC-SA 4.0, not MIT. 593 commits; last commit 2026-09-29; 74 commits in the last 3 months.
- **Structure:**
  - `_2015/` … `_2026/`, one folder per video project. Recent ones: `_2026/cross_entropy` (16.6k lines, 134 scene classes), `_2025/laplace` (14.7k lines, 209 classes), `_2024/transformers` (21k lines, 265 classes), `_2026/hairy_ball`, `print_gallery`, `RL`.
  - Typical files: `main.py`/`partN.py` or topic files, `supplements.py` (Pi-creature reaction shots, titles, inserts) and helpers. Data assets sit alongside, e.g. `huffman_table.json` and cached `qwen_completions_*.json` LLM outputs.
  - `custom/`: Pi creatures (`PiCreature`, `Randolph`, `Mortimer`, `Blink`, `PiCreatureSays`, `TeacherStudentsScene` with `self.teacher.says(..., mode="hooray")` and `change_students(...)`), `end_screen.py` (Patreon and side-scroll end screens), `opening_quote.py`, `banner.py`, `logo.py`, `drawings.py` (SVG props), and `backdrops.py`. In backdrops, `VideoWrapper`/`Spotlight` are framed screen templates for inserting external footage. `filler.py`'s `ExternallyAnimatedScene` is a placeholder for shots made elsewhere.
  - `once_useful_constructs/` holds legacy reusable scene types (graph_scene, vector_space_scene, sample_space_scene, plus some GLSL).
  - `outside_videos/` holds thumbnails (`misc_thumbnails.py`: thumbnails are Manim scenes too), banners, merch, talks and tweets.
  - `sublime_custom_commands/manim_plugins.py`: Sublime plus Terminus keybindings that send "run scene at cursor line" (`-se N`) and `checkpoint_paste()`/skip/record to the terminal.
  - `stage_scenes.py` orders rendered clips by a `SCENES_IN_ORDER` list or by source-line order and copies them into a numbered `staged_scenes_N` folder for the editor. A hard-coded Dropbox path is marked TODO.
  - `custom_config.yml`: 4K at 30 fps, black background, `saturation: 1.5`, CMU Serif, assets and output in a Dropbox base, `mirror_module_path`, `autoreload: True`, and `universal_import_line: "from manim_imports_ext import *"`.
- **A repo `CLAUDE.md` exists**: style guidance for Claude, covering the patterns above plus code-style rules such as using `color_gradient` and `.arrange`/`.next_to` instead of coordinate maths, and building VGroups declaratively. One inaccuracy: it calls `-p` "preview"; in manimlib `-p` is presenter mode.
- **Typical scene file:** helper mobject classes at the top (e.g. `ProbIcon(VGroup)` with `set_value`/`get_sector`/`get_label`, `bit_string_mobject`), then many `InteractiveScene` subclasses. Each `construct()` is split into `# Set up` / `# Show X` / `# Collapse to Y` comment blocks. Those comments are exactly the checkpoint keys for `checkpoint_paste`, so the code is authored block by block live in the window. Scenes subclass each other to reuse setup (`RandomNoiseIsIncompressible(SpaceOfCodewords)`).
- **Narration and timing:** there is essentially **none in code**. I found no voice-over, TTS, script or cue files; `add_sound` appears in only about 11 files, used for physics SFX such as block "clacks" with a `time_offset`. Scenes are rendered as many short silent clips; pacing is set by `run_time`/`wait()` and by the presenter-mode/subdivide tooling. I'm inferring that the voice is recorded separately and the clips are cut to it in an NLE: the code doesn't show it, but `stage_scenes` and `ExternallyAnimatedScene` fit that workflow. Thumbnails, end screens and opening quotes are reusable scene templates.
- **Compatibility:** the README warns that older projects may not run on current manim. The wgpu port probably breaks some newer ones too; I didn't verify.

---

## What I couldn't determine
- Whether any of the ECC hooks, tasteforge scripts, ecc2 or the dashboards actually work, especially on Windows. Nothing was run, and CL-v2's observer is documented as not surviving on native Windows.
- Whether ECC's claimed gains are real (GateGuard +2.25, TasteForge MAE figures). They are self-reported.
- Where ECC's Remotion rules came from.
- ECC's real-world adoption: star counts are badge images only.
- Whether ManimGL's wgpu port has reached PyPI. It probably hasn't: the version is still 1.7.2.
- How 3b1b actually syncs narration in post-production. The repo doesn't show it.
- `scripts/dashboard-web.js` and most of `ecc2`'s Rust internals, which I only skimmed.
