# Content engine: vision and system design

Draft, 2026-10-31. This is a plan for what the engine becomes. **Nothing here is built yet** unless it says so.

It comes from two places:
- **The user's vision:** several channels, a catalog of styles, and one channel that runs by itself.
- **A study of the resources** in `D:\code_files\resources to make content engine`: 8 PDF guides, 6 repos, the links in
  `Notes.txt` and 21 skill links.

What exists today is described in `docs/ENGINE.md`; what's left from earlier plans is in `HANDOFF.md`.

## 1. The idea in short

- **Many channels in one place.** Each channel has its own look, voice, accounts and memory.
- **Two kinds of video.** A video starts either from a topic (*generated*: voice, 2D, 3D) or from a recording
  (*footage*: talking head, screen recording, podcast).
- **A catalog** holds every style and building block, with previews. A look can be picked, tried on the real script,
  mixed with another, or described in words.
- **Learning from results.** After publishing, the engine reads each video's results and learns from them.
- **Autopilot.** One channel can run by itself: it finds an idea, makes the video, checks it, posts it, measures how it
  did, and improves.

Rules that stay:
- **Everything happens in the website.** The user never needs a terminal, the code or File Explorer.
- **Nothing costs money or posts publicly** outside the limits the user set (approvals, budget).
- **A finished video never changes** when the engine, a style or the catalog changes. A video copies the creative code it
  uses, as today.
- **Claude never types passwords, codes, API keys or tokens.** Sign-ins, 2FA and CAPTCHAs stay with the user.
- Every pipeline step stays repeatable, and no paid call is made for a file that already exists.

## 2. Where we are today

- **Videos.** One workspace with a flat list of videos (`project-N-<slug>`), each copied from `template/`.
- **Generated videos only.** Brief (talk → one approval → build) → Editor (Remotion Studio and the Claude chat) → Final
  (resumable render queue) → Publish.
- **Publishing.** YouTube through its API; Facebook and Instagram through Meta's API, or through Claude in Chrome.
- **The look lives inside each video:** `style.md`, `src/lib/theme.ts` and the components. There is one default look,
  "editorial neuro": ink background, bone text, Bodoni headlines. Voice and music are set in `project.json`.
- **Reference study:** stills, contact sheet, cuts, palette and a transcript of each reference video.
- **Accounts.** One YouTube connection. Meta can already choose between several Pages and Instagram accounts.
- **Timing is per sentence (cue), not per word.** Captions are one line per sentence.
- **Not there yet:** channels, a catalog, results, ideas, editing of footage.

## 3. The pieces

```
              ┌──────────────── Catalog: styles + parts, with previews ────────────────┐
              ▼                                                                        │
  Ideas ──▶ Brief ──▶ Make (generated | footage) ──▶ Quality gate ──▶ Publish ──▶ Results
    ▲         ▲                                                                       │
    └─────────┴───────────── Channel memory: voice, preferences, lessons ◀────────────┘
```

Everything belongs to a channel. Each piece is described below.

## 4. Channels

**Decided 2026-10-31:**
- The engine is a suite for any creator. Per-channel choices are settings with defaults.
- **Step 1:** channels are a list in Settings, each with a name, a style and a **Look locked** switch.
- **Choosing a style:** when the look isn't locked and the user gives no style or reference, the channel's last video's
  style is used.
- **Later:** accounts, publishing and memory per channel come with distribution.

A channel holds:

| What | Example |
|---|---|
| Name, topic, audience, language | "Daily Insights": one surprising fact a day, curious adults, English |
| Style | the catalog style it uses now (see below) |
| Formats | vertical 1080×1920, 30–60 s; or long 16:9, 8–12 min |
| Voice and music direction | provider, voice, how it reads; music mood |
| Accounts | its YouTube channel, Facebook Page, Instagram account (X later) |
| Publishing defaults | visibility, posting times, tags, description ending |
| Memory | `voice.md`, `preferences.md`, `lessons.md`, topics already covered (section 13) |
| Ideas watch list | channels and feeds in its niche to learn from (section 10) |
| Autopilot | off by default (section 11) |

**Style choice is the user's, per channel:**
- **Default:** a new video starts with the style of the channel's last video.
- **Lock:** Claude must use the pinned style, and only the user changes it.
- **Change any time:**
  - pick another style;
  - mix two ("style A with B's captions");
  - point at a reference ("like this video");
  - point at an older video ("like the inductor video").
- A video copies the style it uses, so a later change to the style never changes a finished video.
- A style adjusted for one video can be saved back to the catalog as a new version.

**Example channels** from the user's plans (not fixed):
- storytelling;
- daily insights and facts (the existing Page "Daily Insights" and Instagram @daily_insights21);
- mechanical engineering tutorials with 3D;
- a personal channel on how the user works with Claude Code (talking head plus screen recordings);
- podcast clips, which doubles as a place to test styles.

**Files** (proposal):
- Each channel gets `<workspace>/channels/<id>/channel.json` plus its memory files.
- Each video's `project.json` gets `"channel": "<id>"`.
- Videos stay in today's flat list: existing videos keep working, a video can move to another channel, and the website
  filters by channel.

**A Claude per channel.** Today Claude works inside one video's folder. Ideas, results and account setup aren't about
one video, so:
- each channel gets its own Claude chat, working in the channel's folder with the channel's skills;
- Settings gets one more chat for engine-wide jobs such as connecting accounts.

## 5. The catalog: taste for Claude

**Decided 2026-10-31:**
- The catalog has **a page of its own**: the user explores styles there and keeps adding new ones as trends change.
- When a video's style isn't fixed, the user **picks from the catalog or uploads something new**, which is saved into
  the catalog.
- Anything uploaded becomes **one standard style document**, whatever its form: an image, a PDF, a design-system
  document, a taste skill file, a video.
- There will be catalogs for each aspect of a video: visual design, content design (storytelling), sound and others.
  **Visual comes first;** the others come later.
- The starter catalog is curated from the resources, together with a visual taste skill.
- The design for step 1 is in [docs/visual-catalog.md](docs/visual-catalog.md).

The core of the plan. The strongest resources agree on one thing: **taste holds when it is written as numbers, bans
and examples, and checked by measuring.** Adjectives alone drift. The evidence:
- **TasteForge:** colour words in prompts barely moved the colours, while a measured colour look matched in one pass.
- **HyperFrames:** its SPEC step turns every adjective into a number.
- **The Kinetic Type guide:** names its motion recipes and gives each one exact spring values.

### 5.1 What's in it

**Styles** are whole design languages, the thing a channel uses. **Parts** are the pieces a style is made of; any part
can also be mixed into another style.

| Part | Examples |
|---|---|
| Shots and scenes | title card, counter, growing diagram, map, terminal, chat, split screen, 3D object turn |
| Transitions | cut on the word, push, match cut, an object grows into the next background |
| Motion recipes | named springs and eases, e.g. "swing": damping 13, stiffness 140, mass 0.7 |
| Caption styles | word highlight in groups of 2–3, karaoke sweep, clean 3–5 words |
| Type pairs | headline and body fonts with sizes |
| Palettes | colours with roles, usually measured from a reference |
| Frames | a persistent channel frame that ties scenes together (corner marks, timecode, chapter label), as in Level 5 |
| Thumbnail templates | layout, type, where the face or object goes |
| Sound palettes | whooshes, hits, risers, UI clicks, each with its licence |
| Voices | provider, voice and direction, with a sample |
| Music directions | prompt plus a reference |
| 3D looks | materials, lights, world and colour settings for Blender |

### 5.2 What a style contains

- **Numbers** (`style.json`):
  - palette with roles;
  - fonts and type sizes, including a minimum text height (5% of the frame height for captions, per video-shotcraft);
  - motion recipes;
  - pacing: shot lengths, words per scene, holds;
  - allowed transitions;
  - caption style;
  - safe zones per platform;
  - sound: which palette, voice over music by how many dB, loudness target;
  - 3D look.
- **Rules in words** (`STYLE.md`): what the style is for, how emphasis works, what a hook looks like, do and don't, and a
  **banned list**.
- **The code that draws it:** theme and components for Remotion, and the Blender look.
- **Samples:**
  - stills and a short preview made from sample text;
  - the same made from one shared test script, so styles can be compared side by side.
- **Where it came from:** reference videos and their measurements, other sources, licences, version.
- **Status:** approved or experimental.

Bans belong to a style, not to the engine. HyperFrames' default list is a good starting point against the
"AI-generated look": glow, purple gradients, glass cards, everything fading and sliding up, three cards in a row.
But the engine's own default look (dark ink, Bodoni serif) is deliberate, and a list applied everywhere could catch it.

### 5.3 Where entries come from

1. **Measured from a reference: "make a style like this video".** This grows today's reference study into:
   - every frame numbered on contact sheets;
   - the palette measured per brightness zone;
   - the rhythm of shot lengths;
   - fonts identified;
   - motion timed in frames;
   - a spectrogram to find where sounds hit;
   - words per second from the transcript.

   Then:
   - Claude writes `STYLE.md` and `style.json` from these measurements, builds the components and renders samples.
   - The user reviews the style's samples before it is used.
   - Methods from: Kinetic Type, TasteForge, Claude Code Club level 2.

   Channels like Vox or Johnny Harris are studied for their *rules* (pacing, type, colour, motion), never for their
   footage, logos or names.
2. **From open libraries whose licence allows it:**
   - video-shotcraft's 124 shot cards: already Remotion code, Apache-2.0. Some need 3D packages the engine doesn't have,
     so ask first.
   - Ideas from HyperFrames' ~450 blocks: Apache-2.0, but HTML, so they would be rewritten.
   - Barty-Bart's three explainer modes as starting styles: calm demo, high-energy promo, one-take story.
   - Barty-Bart's ~150 free-licence (CC0) sounds, which come with a manifest.
   - claude-shorts' caption styles, with their exact springs.
   - The prompt-motion showreel template as a high-energy recipe: 120 BPM grid, one technique per bar.
3. **From the user's own videos.** A scene or move that worked is promoted into the catalog: Claude proposes, the user
   agrees.
4. **Described in words.** "Warm, like a newspaper" → Claude turns the adjectives into numbers (the HyperFrames SPEC
   method) and shows samples before anything is built.

### 5.4 Using it

- **Catalog page:** a grid of styles and parts with previews, filtered by kind, channel and status.
- **Try this:** 3 stills of the *current video's real script*, rendered in that style before choosing. It's free: no
  voice or music is generated.
- **Mix:** "style A, captions from style B".
- **In the chat:** "show me something calmer", "use the look of the inductor video".
- **Claude at the Look stage:**
  - reads the channel's style and uses its parts unless asked otherwise;
  - runs a taste check before showing anything, comparing its stills with the style's numbers: colours within
    tolerance, type sizes, durations.

## 6. Making videos

### 6.1 Generated videos (today's pipeline, upgraded)

In order of value:

1. **Word-level timing.** Knowing when each word is spoken unlocks:
   - graphics that land exactly on the word;
   - word-by-word captions;
   - sound hits on keywords;
   - cues like `cue(scene, id, "word")`.

   Three ways to get it:

   | Option | How | Trade-off |
   |---|---|---|
   | a | Whisper (already installed) with word timestamps on the recorded voice, matched against the known script | no new packages; less exact |
   | b | Forced alignment of the known script with a wav2vec2 model, as the Motion-as-Code kit does | most exact; needs a new Python package and a 95 MB model (ask first) |
   | c | A voice provider that returns word timings with the audio | ElevenLabs does; Fish doesn't |

   Recommendation: try (a) and measure it on a few lines against the waveform; move to (b) if it's off.
2. **A storyboard with real stills** at the approval step: one still per scene for longer videos. Today the approval
   shows 2–3 style frames.
3. **Sound tied to words.** Each sound is placed by its type:
   - a whoosh peaks on the cut;
   - a riser ends on the hit;
   - a hit lands on the word's start.

   Also a short silence before the biggest line. Levels are measured, never "it sounds good".
4. **Animated captions** as a catalog part, with safe zones per platform.
5. **Motion blur** at final quality (blending in-between frames). Check what Remotion 4.0.535 offers first.
6. **Several versions from one video:** a 16:9 version and a short teaser, each its own composition with bigger type,
   never a crop of the vertical video.
7. **Two things found in the code (2026-10-31):**
   - **Colour:** no colour space is set anywhere. Remotion 4.0.535 then doesn't tag the file as BT.709, which YouTube
     and phones assume for HD video, so colours may shift slightly. The fix is one setting. It changes every new render
     (finished videos keep their files), so look at the result before switching. Not yet checked whether the shift is
     visible.
   - **Safe zone:** the bottom margin is 330 px. Measured platform UI is 340 px on Reels and 350 px on Shorts, and
     captions on Shorts need 400 px or more (claude-shorts' table). Safe zones should come from the style, per platform.

**Voice options.** Today: OpenRouter gpt-audio.
- **Fish Audio S2.1 Pro**, also on OpenRouter but through a different endpoint, `/api/v1/audio/speech`:
  - cheaper per word;
  - emotion tags like `[whisper]`;
  - cloning from 10–15 s of audio;
  - lists Hindi and Kannada, but their quality is untested, and Indian scripts cost about 2.5–3× more per word.
- **ElevenLabs v4:** top of the blind listening tests, and returns timings.

Whatever the provider: direction per line, and A/B samples on the Brief.

### 6.2 Footage videos (new)

For the personal channel and podcast clips. The input is a recording: camera and mic, a screen recording, both, or a
podcast episode.

**Decided 2026-10-31: no fixed "video type" setting.** Claude works out what kind of video it is from what the user
uploads and says while they talk it through:
- a recording to edit, with graphics laid over it;
- or a video generated from scratch.

Then it asks how to treat a recording:
- light overlays on top;
- or cutting the speaker out and putting a new background behind them.

The make-video skill teaches this, and the product doesn't need its own categories for it.

1. **Transcript with word timing:** local Whisper, already installed.
2. **Rough cut** (Tella's cut-video, video-use):
   - remove silences, fillers, false starts and retakes, keeping the last take;
   - never cut inside a word: 30–200 ms of padding;
   - 30 ms audio fades at every cut;
   - thresholds set from the recording's measured noise floor, not a fixed level.
3. **Podcasts: find the clips** (claude-shorts, clipify):
   - score candidates on hook, standing alone, emotion, value and payoff;
   - snap to the start and end of sentences;
   - 15–60 s.
4. **Reframe to 9:16:**
   - follow whoever is speaking (clipify's motion trick needs no face detection);
   - eyes in the upper third;
   - screen recordings zoom to where the action is.
5. **Overlays** (Barty-Bart motion-broll, novoads):
   - motion graphics and B-roll in the channel's style, each change landing on the spoken word;
   - none during the first second of the hook;
   - at least 2 s of face between cutaways.
6. **Finishing:** captions, music ducked under the voice, loudness.
7. **Then the same path as generated videos:** quality gate, packaging, publish.

The user approves the cut plan before the render, or not, as a channel setting.

Clipping other people's podcasts needs their permission; otherwise the uploads get copyright claims.

### 6.3 Storytelling

Depends on the visual approach, which is still open: 2D illustration, 3D, AI-generated images or video (paid per clip),
or stock footage. It uses the generated pipeline plus whichever visual source is chosen.

## 7. Quality gate

Before the user, or the autopilot, sees a video:

- **Review pack:**
  - a numbered contact sheet per scene;
  - strips around every cut;
  - a phone-size sheet;
  - the safe-zone overlay.
- **Automatic checks:**

  | Area | What is checked |
  |---|---|
  | Text | outside the safe zone; too small; on screen shorter than its reading time |
  | Pacing | two things appearing at once; stretches where nothing changes; an empty first frame |
  | 3D frames | black or corrupt frames (brightness scan) |
  | Fonts | actually loaded |
  | Sound | loudness and true peak measured on the final file; the voice clearly above music and effects |

- **Critic.** A fresh Claude with no stake in the video reviews the pack against the style and the brief.
  - Each note reads `t=4.2s · where · problem → exact change`.
  - Notes are ranked P0 (must fix), P1 or P2. No scores out of 10.
  - For the autopilot, two independent critics must both pass (ECC's "Santa method").
- **Fix loop:** Claude fixes the P0 and P1 notes and re-renders only the affected stills, for at most 3 rounds, then asks.
- **For human ears:** the 5 riskiest moments to listen to on headphones.

## 8. Packaging

- **Hooks:** 5 options built from hook formulas (youtube-agent-skill has 21), scored, best 2 shown.
- **Title and thumbnail as one pair**, checked for truncation.
- **Thumbnails rendered in Remotion:**
  - the title is real type, never drawn by an image model, which misspells;
  - the background comes from the video or a 3D still;
  - 3 variants, previewed at phone size in a mock feed;
  - contrast checked, and the timestamp corner kept clear;
  - uploaded through the API. YouTube's custom-thumbnail upload may need a verified channel; to check.
- **Post captions:** 5 options scored on curiosity, search phrase, voice and brevity (Rob Cressy's caption skill).
- **Chapters** from scene start times. Already part of drafting today.

## 9. Publishing

- **Accounts per channel:**
  - one Google app for all the YouTube channels; each channel is one Connect, choosing its account;
  - one Meta app for all Pages and Instagram accounts; the account picker already exists.
- **Scheduling:**
  - upload early as private with a publish time (YouTube `publishAt`, already supported), so the PC doesn't need to be
    on at that moment;
  - Meta's scheduling: to check.
- **Later:** X, planned, pay per use.
- **Export checks per platform:** resolution, codec, length, sound present and not silent.
- **Still unknown:** whether posts from a Meta app in Development mode are visible to the public.

## 10. Results, ideas and the loop between them

### Results

- **What:** per video, at 1, 2, 7 and 28 days:
  - YouTube: views, watch time, average percentage viewed, the retention curve, likes, comments, shares, subscribers
    gained;
  - Instagram and Facebook: reach, views, saves, shares, watch time.

  To check: whether YouTube's API gives thumbnail impressions and click-through rate.
- **Permissions:** YouTube Analytics and Meta insights both need extra permissions, so one re-connect each.
- **The engine's advantage:** it knows what was on screen and what was said at every second, so a drop gets a name:
  "lost 22% at 0:07, during 'the second line', the counter scene". None of the tools in the resources can do this,
  because none of them own the timeline.
- **Compared with the channel's own median,** the same idea as the outlier method below.
- **Where:** a Performance page per channel and a Results tab per video. After 7 days Claude writes "one fix, not
  twenty" (youtube-agent-skill).
- **What they feed:** lessons go into the channel's `lessons.md`; comments are read for questions and new ideas.

### Ideas

- **Sources:**
  - niche outliers: from public listings (yt-dlp), videos at 2× or more of their own channel's median, from channels
    with at least 4 videos;
  - trend feeds (RSS or JSON);
  - comments;
  - an idea inbox for the user;
  - the channel's own results.
- **Minus topics already covered,** weighted by what holds viewers in the channel's own results. This is the Aidos
  idea: what's pulling attention, minus what you've covered, filtered by your own retention.
- **Idea cards:** topic, why now, hook options, format, and the outlier videos behind it.
- **Use:** the user picks one and its Brief starts from it, or the autopilot picks by itself.

## 11. Autopilot (one channel first)

The loop: ideas → pick one → Claude writes the brief in the channel's style → make → quality gate → post on schedule →
results → lessons → ideas.

Settings per channel:
- **Mode:**
  - off;
  - approve each video with one tap;
  - fully automatic.
- **Cadence and posting times,** e.g. one a day at 18:00.
- **Budget cap per day and per month** for voice, music and any paid API. The channel stops when it's reached.
- **Experiments:** e.g. 1 video in 5 tries something new (a style variant, a hook type, a length), compared after 7
  days. Styles and hooks get scored by real results.
- **Off switch,** and a log of every decision and every cent spent.
- **Never posts** while a P0 note is open or a check fails.

Platform rules:
- YouTube doesn't pay for mass-produced, repetitive videos ("inauthentic content"), so variety and quality have to be
  real. Check the current wording before turning it on.
- AI disclosure is set honestly (already mapped to YouTube's `containsSyntheticMedia`).

The PC has to be on with the engine running while videos are made; scheduled uploads cover the posting times.

Proposed first channel: daily insights and facts.

## 12. Account setup as skills

Engine-level skills that Claude runs through Claude in Chrome: `connect-youtube`, `connect-meta`, later `connect-x`.
They describe goals, not exact clicks, because these consoles change their layout often.

- **YouTube:**
  1. Create a Google Cloud project.
  2. Enable the YouTube Data API v3 (and the YouTube Analytics API, for results).
  3. Set up the Auth Platform with an External audience, published **In production**.
  4. Create a Desktop app client and download its JSON file.
  5. The engine imports the file itself. Settings already accepts the file; add "import the newest one from Downloads".
- **Meta:**
  1. The app (the "Content-engine" app already exists).
  2. Its use cases and permissions, and the Facebook Login for Business configuration.
  3. The Pages and Instagram accounts.
  4. Then the engine's own Connect.
- **What the user does:** signs in, does 2FA and CAPTCHAs, and approves each step that creates something or accepts
  terms.
- **Secrets never pass through Claude.** They go straight from Google or Meta to the engine; Claude never reads or
  pastes a secret or token.
- **Once per platform.** A new channel only needs Connect.
- **Meta's sign-in lasts about 60 days.** Either a reminder with one-click reconnect, or a System User token that
  doesn't expire, pasted once by the user.

## 13. Memory and learning

Per channel:
- **`voice.md`** (from youtube-agent-skill): who the channel talks to, how it talks, words it never uses, what it won't
  claim.
- **`preferences.md`:** the user's corrections ("hold longer", "no italics"), each with its date and the video it came
  from. When the user corrects something, Claude proposes an entry and the user confirms it.
- **`lessons.md`:** what the results taught.
- **Topics already covered.**

Claude reads these at the start of every video. This is simpler than ECC's automatic "instincts", which don't run on
native Windows anyway. Preferences that apply to every channel use the same mechanism, at engine level.

## 14. Website changes (proposals)

Each one gets a short list of options and a recommendation before it's built, as with every UX change.

- **Channels** (new): the list of channels. Per channel: style, voice, accounts, schedule, memory files, autopilot.
- **Catalog** (new).
- **Ideas** (new, per channel).
- **Performance** (new, per channel), plus a Results tab per video.
- **Videos:** a channel filter. New video asks which channel, defaulting to the last one.
- **Brief:** style from the catalog, Try this, a storyboard per scene.
- **Review:** the review pack and the critic's notes, inside the Editor or as their own tab.
- **Publish:** accounts per channel, schedule.
- **Settings:** "Ask Claude to set this up" for each platform.

## 15. Build order

**Decided 2026-10-31: build what helps create content first.** Distribution and analytics come later. Each step ends
with something the user can see and check.

**Now: creating content**

| Step | What | Done when |
|---|---|---|
| 1 | The visual catalog: the style format, a visual taste skill, the starter catalog, the Catalog page, styles in the Brief; Daily Insights as the only channel ([docs/visual-catalog.md](docs/visual-catalog.md)) | a new video takes its style from the catalog; an uploaded image or document becomes a catalog style |
| 2 | Quality: review pack, automatic checks, critic, storyboard at the approval step, colour and safe zones | a video arrives with its review pack, and its notes are fixed before the user sees it |
| 3 | Catalog growth: Try this on the real script, a style from a reference video, styles from the user's own videos, parts from open libraries | the user tries three styles on one script and picks one |
| 4 | Word timing and what it unlocks: sound on words, animated captions, graphics landing on the word, 16:9 and teaser versions | a keyword's graphic and sound land on the spoken word |
| 5 | Packaging: hooks, titles, thumbnails (made, not uploaded) | a video comes with scored hooks and three thumbnails |
| 6 | Footage: the personal channel, then podcast clips | a raw recording becomes a cut, captioned, reframed video |
| 7 | Storytelling, once its visuals are decided | — |

Later catalogs (content design, sound, captions, transitions) are added along the way when they're needed.

**Later: distribution and analytics**
- Channels with their own accounts.
- Scheduling and X (§9).
- Account setup skills (§12).
- Results and the Performance page (§10).
- Ideas (§10).
- Autopilot for one channel (§11).
- `lessons.md`.

## 16. Open questions for the user

1. **Accounts:** a separate YouTube channel and a separate Instagram/Facebook for each channel?
2. **Autopilot:** is daily insights and facts the first channel?
3. **Storytelling visuals:** 2D illustration, 3D, AI-generated (paid per clip), or stock?
4. **Lengths per channel:** Shorts/Reels, long YouTube videos, or both?
5. **Recordings for the personal channel:**
   - Camera and mic, screen, or both at once (e.g. OBS)?
   - One clean take, or many takes with mistakes?
6. **Podcast clips:** whose podcasts?
7. **Languages:** English only, or Hindi and Kannada too?
8. **Budget:** a monthly limit for paid generation (voice, music, any AI images or video).
9. **Voice:** stay with gpt-audio, or try Fish Audio or ElevenLabs?

## 17. Not adopting, and why

- **Switching to HyperFrames:**
  - why not: it's strong but pre-1.0, ships several releases a day, has telemetry on by default, and the engine is
    built on Remotion;
  - borrowed instead: its methods (the SPEC, the review pack and lint checks, the banned list).
- **Manim or manimgx as another renderer:**
  - why not: only worth it for a maths channel;
  - borrowed instead: the idea behind `manimgx inspect`'s layout checks.
- **VoiceStudio:** its default voice model is non-commercial, and it needs a 6 GB graphics card.
- **ECC as a whole:**
  - why not: 311 skills, and parts don't run on native Windows;
  - borrowed instead: the critic pair, the preferences memory, "measure, don't prompt".
- **Third-party posting services** (SocialClaw, Composio, Upload-Post): they would hold the tokens and charge. The
  engine posts through the platforms' own APIs.
- **Non-commercial licences:** video-talkcraft, OneTake, Fish's open model weights, VoiceStudio's default model.
- **Broken, or paid with nothing to judge:**
  - thumbcraft's skill: its backend is gone;
  - norstack's shorts skill: its helper scripts were never published;
  - Promptslove: $49, nothing visible;
  - the Claude Code Club skill: $9/month.

## 18. Sources

Folders below are inside `D:\code_files\resources to make content engine`.

| Idea | From | Licence / where |
|---|---|---|
| Word timing by aligning the known script; sounds placed by start/peak/end; cut-review sheets; BT.709 tagging | Motion as Code guide and kit (pdoom-video by mexicat) | MIT; `aman thakur's resources` |
| Reference → STYLE_GUIDE with measured colours, recipes with spring values; review numbered sheets before showing; null test for sound sync | Kinetic Type guide | PDF; `aman thakur's resources` |
| 1 idea = 1 scene, 1 keyword = 1 hit; silence before the drop; persistent HUD; storyboard of real frames | Level 5 guide | PDF; `aman thakur's resources` |
| One timeline file for 3D, UI and sound; chunked renders; corrupt-frame scan; separate 9:16 composition | Claude + Blender guide (Nate Herk) | PDF; `pdf guides` |
| Hook formulas, hook scorer, outliers at 2× the channel median, `voice.md`, title + thumbnail pair, retention reading | youtube-agent-skill (Jakeschincariol) | MIT; `pdf guides\shashwat-…pdf` |
| "Attention minus covered, filtered by your retention" | Aidos (Jesse Rurka) | idea only; `pdf guides\notion-page.pdf` |
| SPEC (adjectives → numbers), banned list, three storylines, lint checks, review pack, P0/P1/P2 notes | HyperFrames (HeyGen) | Apache-2.0; skill links |
| 124 shot cards in Remotion, clean-context reviewers citing frames, beat sync, minimum text height | video-shotcraft | Apache-2.0; skill links |
| Seek-based explainer modes, stills → draft → final, measured sound pass, ~150 CC0 sounds, motion B-roll rules | Barty-Bart/motion-graphics | MIT per README; skill links |
| Hook rubric, safe-zone table, boundary snapping, caption styles with springs | claude-shorts | MIT; skill links |
| Rough-cut rules: padding, fades, noise-floor thresholds, retake detection | video-use, Tella cut-video | MIT; skill links |
| Speaker tracking by motion, check frames before rendering | clipify | MIT; skill links |
| Picking frames to look at: cuts, thinning, duplicates, more frames around cuts | claude-video, claude-video-vision | MIT; skill links |
| Measure the look (colour grade, rhythm, LUT); critic pair; preferences memory | ECC (TasteForge, Santa method, instincts) | MIT; `github repos\ECC` |
| Catalog entry format (prompt, output spec, fields, required assets, status); review → repair → re-render | NullMotion | MIT; `github repos\NullMotion` |
| Layout checks without a full render; voice cache keyed by text and voice | manimgx | MIT; `github repos\manimgx` |
| Fish Audio models, prices, OpenRouter route; quality vs ElevenLabs | fish.audio, OpenRouter, Artificial Analysis | `Notes.txt` |
| Post captions scored on curiosity and search phrase | Rob Cressy's caption skill | web page; skill links |
| Official Remotion rules (captions, voiceover, sound effects, silence detection); version 4.0.539 vs our 4.0.535 | remotion-dev/skills | skill links |

## 19. Where the vision stands

As of 2026-11-06. Steps follow §15. Steps 1, 2 and 5 are on the `visual-catalog` branch, not yet merged into `main`.

| Step | Part of the vision | State |
|---|---|---|
| Before | Generated videos, final render, posting to YouTube, Facebook and Instagram | Working |
| 1 | Catalog page, with uploads turned into one style format | Built; uploads tested with a fake Claude only |
| 1 | Taste skill and curated styles | Built: 73 styles, each with a moving preview |
| 1 | Channels with a lock, last video's style as the default | Built and tested |
| 1 | Theme set automatically from the style | Built and tested on all 73 styles |
| 2 | Quality gate: review pack, automatic checks, critic, storyboard, BT.709 colour, safe zones | Built and tested. Its goal isn't met yet: the first real video still has 2 P1 notes open |
| 2 | First real video in a catalog style (Why the Sea Is Salty) | Rendered; nobody has heard it yet |
| 3 | Catalog growth: try styles on the real script, styles from reference videos and the user's own videos | Not started |
| 4 | Word timing, sound on words, animated captions, 16:9 and teaser versions | Not started |
| 5 | Hooks, titles, thumbnails, post captions | Built and tested, and used on the first real video. Made, not uploaded |
| 6 | Footage: personal channel, then podcast clips | Not started |
| 7 | Storytelling | Not started; its visuals still have to be decided |
| Later | Content-design, sound, caption and transition catalogs | Later, as decided |
| Later | Channels with their own accounts, scheduling and X, account setup skills | Later, as decided |
| Later | Results and the Performance page, ideas, autopilot with two critics, `lessons.md` | Later, as decided |