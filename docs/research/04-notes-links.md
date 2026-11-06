# Research Notes.txt links

## Research report: the 8 saved links (findings only, no recommendations)

The links in item 3 came to the user as one creator's auto-DM. It was "Sent via @SuperProfile.bio" and ended with an upsell for a paid eBook by "surajdsgn" on getvik.com, which I did not open. The links themselves are third-party sites.

---

### 1. Fish Audio: https://fish.audio
- **What it is:** a commercial voice AI platform from Hanabi AI Inc. It offers TTS, STT, voice cloning, voice changer, voice design, sound effects and audio separation. It also sells avatar, video and image generators and an MCP integration. It hosts a library of more than 2M community voices. "OpenAudio" was an earlier brand name; the S1 model was published under it.
- **Models and API IDs** (docs.fish.audio):
  - `drama-3` is the new flagship, released 2026-10-13. It is a 35B mixture-of-experts model with 3B parameters active per token, and allows up to 16 speakers per request.
  - `s2.1-pro` is the recommended production model.
  - `s2.1-pro-free` costs $0 and has no latency or uptime guarantees. The Aidos page calls it "free for a limited time".
  - `s2-pro` is the previous generation, with about 100 ms time to first audio.
  - `s1` is deprecated. From 2026-12-31, `s1` requests are served by s2.1-pro.
- **API pricing**, charged per million UTF-8 bytes of input text:
  - s2.1-pro, s2-pro and s1: **$15**
  - drama-3: **$50**, or $10 on a promo until 2026-11-12
  - Fish's own scale: 1M bytes is about 180k English words, or roughly 12 hours of speech.
  - **Indian scripts cost more.** Devanagari and Kannada letters take 3 bytes each in UTF-8, so the same text costs roughly 2.5–3 times what it would in Latin script.
  - STT (`transcribe-1-pro`, which can return timestamps): $0.36 per audio hour.
  - Voice design: $0.01 per request.
  - Concurrency: 5 requests at under $100 prepaid, 15 at $100 or more, 50 at $1,000 or more.
  - The API is REST plus SDKs, with realtime streaming over WebSocket. I found no word-level timestamps documented for TTS output.
- **OpenRouter:** all Fish models are listed there. TTS goes through `POST /api/v1/audio/speech` (mp3 or pcm) with an OpenRouter key. That is a different route from the chat-completions gpt-audio call in the engine's `pipeline/or_audio.py`.
- **Consumer plans:**

  | Plan | Price | Credits/month | Other limits | Commercial use |
  |---|---|---|---|---|
  | Free | $0 | 8k | 500 characters per generation | Personal only, per the FAQ (the feature list contradicts this) |
  | Plus | $11/mo | 250k | "up to 200 min" | Allowed |
  | Pro | $75/mo | 2M | 3 team seats | Allowed |

  The FAQ puts generation at about 600–625 credits per minute. The plan minutes don't quite add up against that.
- **Languages:**
  - Docs say S2.1 Pro supports 83 languages but don't list them.
  - The S2-Pro Hugging Face card lists **hi, kn, ta, te only under "Other supported languages"**. That is below Tier 1 (JA, EN, ZH) and Tier 2 (KO, ES, PT, AR, RU, FR, DE), and no quality is claimed for them.
  - Language is detected automatically.
  - I found **no independent Hindi or Kannada quality test**. I'm not sure how good it is there; only a native listen would tell.
- **Emotion and style control:**
  - S2, S2.1 and Drama 3 take free-form tags in square brackets anywhere in the text, e.g. `[whisper in small voice]`, `[laughs]`, `[pause]`, `[very excited]`. The card claims 15k+ distinct tags.
  - S1 used `(parentheses)`, which S2 ignores.
  - Multi-speaker dialogue is supported.
- **Voice cloning:** 10–15 seconds of audio for an instant clone, or a trained persistent model.
- **Open weights** (github.com/fishaudio/fish-speech, 33.5k stars):
  - **S2-Pro (5B):** under the Fish Audio Research License. Research and non-commercial use only; commercial use needs a separate license.
  - **Drama 3:** the card says Community License, while the Hugging Face metadata says research license. Secondary sources say it is free commercially below $500k annual revenue and needs a single GPU with 48 GB or more in FP8, with no CPU or Apple support.
  - I found no stated VRAM figure for S2-Pro and no mention of native Windows support.
- **Quality vs ElevenLabs** (Artificial Analysis Speech Arena, blind votes; I'm not sure how English-dominated the votes are):

  | Model | Elo | Rank |
  |---|---|---|
  | Eleven v4 Turbo | 1336 | 1 |
  | Eleven v4 | 1334 | 2 |
  | Fish Drama 3 | 1278 | 6 |
  | Fish S2.1 Pro | 1188 | 22 |
  | Eleven v3 | 1188 | about the same as S2.1 Pro |
  | Fish S2 Pro | 1109 | 40 |
  | OpenAI TTS-1 HD | 1106 | 42 |

  Reviews generally say ElevenLabs still leads on English naturalness, while Fish is far cheaper and covers more languages. Fish's own "preferred over ElevenLabs" blind test has been called biased.

### 2. "ooto.ai": https://ooto.ai
- **ooto.ai with one "t" is a parked domain.** It returns a 302 redirect to a sale listing at atom.com/name/Ooto.ai, which gave 403 when fetched.
- **The most likely intended product is Ootto, at https://www.ootto.ai (two t's).** It fits: Instagram reels plus Claude skills. I can't be sure this is what the user saw.
- **What it is:** "Marketing Autopilot for your business." It reads your website, audits your Instagram, drafts reels and posts them only after you approve. Features:
  - A voice clone from about one minute of talking, and clone-yourself avatars.
  - Stock AI presenters, labelled as AI on Instagram.
  - A weekly or monthly content plan, captions, scheduling at your best time, and comment-to-DM.
  - Editing of your own footage.
  - It is **Instagram only**. The rendering engine is not disclosed. Login is required.
- **Pricing:** $10/week (up to 16 reels), $48/mo self-serve (up to 100 per month), $199/mo Starter, $499/mo Done-for-you. Avatar clips cost 35 credits at about $0.10 per credit.
- **API:** no public API is mentioned, only connectors (MCP for Claude, plus ChatGPT and Cursor). No founder is named.
- **Free side:** the GitHub org Ootto-AI publishes MIT-licensed material:
  - **`claude-content-skills`** (321 stars): about 30 "plain prompt" Instagram skills, such as hook writer, reel scripter, a beat-by-beat reel builder, captions, a calendar and a comment responder. It installs through the Claude Code plugin marketplace.
  - **`claude-instagram-autopilot`** (12 stars): research, then script, then **Remotion** renders a 9:16 video from a `carousel.json`, then it posts through the **Composio Instagram MCP**, run by a daily GitHub Action with an approval gate.
  - **`ootto-watch`**: puts video frames and the transcript on one timeline so Claude can "watch" a video.
- **Marketing claims** such as "3.5M views" and "67k views / 3,000+ lead comments" are unverified.

### 3. Prompt Motion: https://prompt-motion.com/
- **What it is:** a free curated gallery of about 233 motion videos made with Claude Opus 5.5, each paired with the prompt or skill behind it. It is curated by @p4nthera_, and creators are credited.
- **Each entry has:** the video, creator, model, stack, tags (Product UI, Charts, Kinetic type, Particles and so on), and either the prompt text or a skill install command, plus the source post on X.
  - Meng To's "HTML app demo skill" (React/HTML): `npx skills add MengTo/Skills --skill html-demo`.
  - @tequilafunks' Remotion reel is a single sentence: a 15-second showreel, "go all out".
- **Gating:** none. No login, and the "Customize a prompt" tool is free and runs in the browser.
- **Genuinely useful: the `/templates/showreel` template.**
  - It is written in XML-style blocks: `<direction>`, `<structure>`, `<build>`, `<start>`.
  - Timing: a 120 BPM grid with an action on every beat, one technique per bar, holds under 0.5 s, and each shot transforms out of the previous one instead of cutting.
  - Banned: glows, lens flares, crossfades and bouncy easing. Easing is spring or exponential curves written as functions of time, with motion blur that scales with speed.
  - Build: a single HTML file where every style is computed from `window.seek(t)` (no CSS animations or timers). Audio is generated with Web Audio and rendered to WAV. Playwright renders at 60 fps with 3 subframes per frame, blended with ffmpeg `tmix` for motion blur.
  - Process: storyboard first, and review one frame per beat before the full render.
- **Other templates:** a three.js "realtime" template. Explainer, product film and short film templates are "coming soon".
- **Weaker part:** many entries are one-line prompts that rely entirely on the model.

### 4. Promptslove "Motion Graphics PRO": https://promptslove.com/motion-graphics-claude-skill/
- **What it is:** a sales page for a **paid** skill from Promptslove LLC. No founder is named.
- **Access and price:** you must create an account, then buy. $49 one-time (the "Prompter" plan, said to rise to $99) or $199 Premium, which adds 87 skills, apps and courses.
- **Marketing tactics:** "7 seats left" scarcity counters and "50,000+ AI professionals" claims. Neither is substantiated.
- **What it claims:**
  - Invoked as `/promptslove-motion-gfx`.
  - Flow: Ask (attach screenshots, logo, SRT or CSV), then a Brief card after up to three rounds of questions, then a Storyboard (a beat sheet plus 3 stills, revisable by scene number), then Render. Output is a 1080p MP4, a contact sheet and the project file.
  - A "beat-synced soundtrack at −14 LUFS", with no method given.
  - 54 video types, 18 styles and 184 "moves". Move descriptions are visible, e.g. "weight morph" and "one word per beat", but the prompt text is not in the page.
- **Not disclosed:** the render stack (Remotion, HTML or anything else) and the SKILL.md contents.
- **Assessment:** nothing technical is available without paying. The described workflow is a standard brief → storyboard → render loop.

### 5. AI × Leaders prompt library: https://ai-x-leaders.com/en/prompt/
- **Who and what:** run by a French training company (brand of SAS BFC Group, Paris). The library is **free, with no account**: 28 videos, each with a prompt labelled either "Complete prompt" (original) or "Reproduction prompt" (a creator's published recipe). Cards with missing text are hidden.
- **Sources:**
  - **github.com/X-RayLuan/awesome-opus-5-5-video-prompts**: 83 examples, MIT, 16 stars. Every entry carries a sponsored "Remake with EasyVeo" link, and many entries say "prompt not shared".
  - Revid and posts on X.
- **Stacks:** HTML/CSS, Three.js, Blender. The GitHub list also includes Remotion, HyperFrames, p5, Manim, plus Seedance and Kling.
- **Useful example: Bilal Demirer's HyperFrames captioned vertical clip.**
  - 1080×1920 and 15 s, with a local TTS voiceover.
  - Word timestamps come from `npx hyperframes transcribe`.
  - Captions are grouped 3–6 words with each word highlighted as it is spoken, under a code card.
  - Notes: Kokoro failed to install, so the macOS Samantha voice was used, and one word was fixed by hand.
- **Paid side:** a waitlist and bootcamps (a 4-week job-search bootcamp at €599; others unpriced). The bootcamps are in French.

### 6. Claude Code Club, "Three Levels Of Motion Graphics With Claude Design": https://www.claudecodeclub.ai/free-resources/claude-design-motion-graphics
- **Access:** the long article is free with no login, and an offline HTML copy is offered (no email requirement stated). **The packaged skill and exact prompts are paywalled** in a Skool community at $9/mo. The footer links author pages for David Iya and Duncan Rogoff; there is no byline.
- **Tools:** Claude Design (inside the Claude desktop app), Higgsfield as a custom MCP connector, Seedance 2.5 for video and GPT Image 2 for storyboards. **No Remotion, HyperFrames, GSAP or After Effects.**
- **The three levels:**
  - **Level 1:** a bare prompt as a baseline. Tell it to ignore existing design files.
  - **Level 2:** have Claude extract a **motion design system** from a reference video into one reusable rules file. Their example, "scatter and settle", has 8 rules; five are shown: elements "arrive, they don't fade", overshoot then settle, per-letter text, named and typed transitions, and curves written out. Review the system's demos before generating.
  - **Level 3:** Claude writes a timestamped Seedance prompt (premise, assets, look, beat sheet). Optionally make a 12-panel storyboard first, since direct video misspells text. On-screen talent comes from a character sheet, in one continuous 22 s generation.
- **Useful ideas:** approve the cheap sheets (palette, shot list, camera) before paying for renders, and the listed failure modes. Once the pipeline works twice, package a skill with 5 elements: the system file path, the beat structure, a scope fence, the generation path, and the character sheet.
- **Assessment:** substantive, though the concrete prompts are behind the paywall.

### 7. Promptcat, Animation use cases: https://promptcat.org/use-cases/animation/
- **What it is:** an anonymous "Community Prompt Archive" for Claude Opus 5.5. It has 277 ideas overall, 161 under animation. It is free with no login visible, and the operator is unnamed.
- **Content falls into three groups:**
  - Lottie and SVG micro-animations from OpenVGLab on GitHub: loader, like button, coffee steam.
  - A "100 HTML collection" by MiaAI Lab: Harmonograph, Rule 30, Aurora Glass. These link to source code.
  - Video cases scraped from X posts.
- **Caveat:** many "reusable prompts" are **editorial templates the site wrote**. The After Effects case, for example, is explicitly "not a verified transcript of the creator's prompt", and "After Effects" appears only in the title.
- **Genuine value:** the general guidance.
  - Interface motion: give states, easing, loop behavior and an export format.
  - Film: give duration, aspect ratio, shot order, typography and audio.
  - Verifiable motion: give the opening state, the key transition and the final hold, with enough reading time.
  - Review for overlaps, abrupt cuts, missing frames and unreadable text.
- **Tools named:** After Effects, Runway MCP, Seedance, ComfyUI, Blender. No Remotion, HyperFrames or GSAP.

### 8. "Aidos — the voice and the harness around it" (Notion): https://glamorous-pencil-2e4.notion.site/Aidos-the-voice-and-the-harness-around-it-3d3f8ee127218196aa07c667136f24be
- **How I read it:** WebFetch got only the JavaScript shell. I read the live page through Notion's public page-data endpoint, which is read-only. It was last edited around 2026-09-06.
- **It is the same page as the local `D:\code_files\resources to make content engine\pdf guides\notion-page.pdf`:** same title and sections (What Aidos is, New in v2, Part 1 Steps 1–5, Part 2 harness, Gotchas, Safety note, Links).
- **Author:** Jesse Rurka (@jesserurka). **Fish Audio sponsors the series**, and the Fish link on the page is his partner link. This is probably why "fish audio" is item 1.
- **The open part:** **github.com/jdrurka/jarvis-demo** (MIT, 18 stars, 4 commits).
  - Pipeline: push-to-talk in the browser, then Whisper STT through an OpenAI key, then `claude -p` headless on the user's Claude subscription (no Anthropic API key).
  - Speech: Fish S2.1 Pro streamed sentence by sentence over Fish's live socket as PCM, with an instant spoken "on it" acknowledgement.
  - Visual: a particle "Sentinel" figure of about 43k points.
  - Build requests spawn a second Claude session with file tools in `builds/<timestamp>/`, with a deny list. The README calls this "permission scoping, not a sandbox".
  - Config lives in `~/.config/fish-audio/speak.json`. The persona is the `VOICE` constant in `lib/brain.js`.
  - It runs on macOS and Linux; Windows only through WSL.
- **The "harness" (Part 2) is not provided.** It is his private "Content Engine". He shares only its shape: "what's pulling attention" minus what you've covered, filtered by your own retention. He also gives a paste-in prompt for a `niche-read` primitive: read RSS or JSON feeds from `feeds.json`, take the last 24 h, group by platform, and write a spoken brief under 120 words. The database, hook extraction and retention join are promised for future videos.
- **Assessment:** the voice demo is real, working code. The headline "harness" is a teaser.

---

### Couldn't open, or gated
- **ooto.ai:** a parked domain that redirects to an atom.com sale listing (403). I researched ootto.ai instead, assuming a misspelling; I can't confirm that.
- **Notion page:** blocked for WebFetch because it needs JavaScript. I read it through Notion's public JSON endpoint; it matches the local PDF.
- **Promptslove skill contents:** paywalled. The user would need an account plus $49 or more.
- **Claude Code Club skill and exact prompts:** paywalled. Skool membership at $9/mo.
- **Ootto product:** sign-in needed; no public API docs.
- **Promptcat:** many "prompts" aren't the creators' originals, and some original X posts may need an X login to view.
- **artificialanalysis.ai S2.1 Pro model page:** 404. I used the leaderboard instead.
- **Fish Audio Hindi/Kannada quality:** no independent test found anywhere.

