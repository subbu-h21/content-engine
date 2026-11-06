# Visual catalog: design for step 1

Draft, 2026-10-31, for the user to review before anything is built. Part of [vision.md](../vision.md), §5.

## What the user asked for

- **A Catalog page of its own.** It's where the user explores styles and keeps adding new ones as trends change: an
  image from Pinterest, a style guide, a taste document.
- **Using the catalog while making a video.** When a video's style isn't fixed, the user picks one from the catalog, or
  uploads something new, which is saved into the catalog too.
- **Anything uploaded becomes one standard style document**, whatever form it came in:
  - an image ("like this");
  - a skill file about taste;
  - a design-system document from an app project (palette, text sizes, headings);
  - a PDF style guide;
  - a video or a link.
- **Catalogs for each aspect of a video:** visual design, content design (storytelling), sound and others. **Visual
  first;** the others come later.
- **A curated starter catalog** built from the good material in the resources, plus a **taste document** that gives
  Claude good visual taste.
- **The engine is a suite for any creator,** not one person's setup. Choices like "is this channel's look locked?"
  are settings with defaults, not questions.

**Decided 2026-10-31:**
- **The format:** a Markdown style document (a skill) plus a numbers file. It's the easiest for Claude, which reads the
  values directly with nothing to convert. No PDFs.
- **Channels are a list in Settings.** Each channel has a style and a **Look locked** switch:
  - locked: Claude uses the channel's style;
  - not locked: the user can pick or upload any style. If they give none, the channel's last video's style is used.
- **As many starter styles as the resources support,** each one distinct and fully specified.
- **Fonts that aren't on Google Fonts:** the user uploads the font file. The Catalog page has an input for it.

## 1. What is built in step 1

1. **The standard style format**, the same for every visual style.
2. **A visual taste skill:** rules that apply to every video whatever its style.
3. **A starter catalog** of about 10 styles, curated from the resources and the engine's own look.
4. **Previews:** every style draws a few sample frames, so it can be judged by eye.
5. **The Catalog page:** browse, open, add from an upload, edit with Claude, approve.
6. **Styles in the new-video flow:** the Brief uses the chosen style, or the user uploads a new one there.

Not in step 1:
- catalogs for content design, sound, captions and transitions;
- "Try this on my script" (step 3 of the build order);
- comparing styles side by side;
- accounts and publishing per channel (later, with distribution).

## 2. The standard style format

### The options

| Option | Good | Bad |
|---|---|---|
| **A: a style document (Markdown, written as a skill) plus a numbers file** | Claude reads and edits it reliably; the engine reads the exact values from the numbers file; changes can be compared | not a "pretty document" in itself |
| B: a style document only (numbers in its tables) | one file | the engine can't reliably read values out of prose and tables |
| C: a PDF | nice to look at and share | hard to edit, hard for the engine to read, every change means regenerating it |

**Recommendation: A.**
- The Catalog page shows each style as a style sheet: swatches, a type specimen, the preview frames, the rules. That is
  the "nice document" view.
- A PDF export can be added later if needed.
- Whatever was uploaded is kept untouched in the style's `sources/` folder.

### One folder per style

```
<id>/
  STYLE.md      the style document: what Claude reads (a skill: name + description at the top)
  style.json    the numbers the engine uses: colours, fonts, sizes, margins, motion values, finish
  scenes/       a few Remotion scenes that draw the style: title, headline with emphasis, label or diagram,
                number, transition. They make the previews and are a starting point for videos in this style
  preview/      the rendered sample frames (cover.png plus 4–6 stills)
  sources/      what it was made from: uploaded images, PDFs, documents, links, untouched, plus Claude's notes
```

### `STYLE.md` sections

These follow the sections of today's video `style.md`, so the Brief board's Look card keeps working:

1. **In one line:** what it feels like, what kind of video it suits.
2. **Palette:** a table of role, hex, and where it's used.
3. **Typography:**
   - faces and weights;
   - sizes in px at 1080×1920, with the smallest allowed;
   - spacing, case, how emphasis works;
   - how many words are on screen at once.
4. **Layout:** margins, safe zones, alignment, how full a frame gets.
5. **Elements:** labels, pills, lines, diagrams, icons, persistent frames, how images are treated.
6. **Motion:**
   - named moves with exact values (e.g. "pop": spring, damping 10, stiffness 230, mass 0.6);
   - how things enter and leave;
   - holds and stagger.
7. **Transitions and rhythm:** kinds of cut, shot lengths, beat.
8. **Finish:** grain, vignette, blur, glow (yes or no).
9. **3D look,** if any: materials, lights, camera, colour settings.
10. **Banned:** what this style never does.
11. **Where it came from:** each source, what was taken from it, its licence, and the date.

Values Claude had to propose because a source didn't give them are marked *(proposed)*, so the user knows what's
measured and what's invented.

### `style.json`

The same values in a fixed shape:
- id, name, version, status (built-in, approved, experimental);
- summary and tags;
- formats it suits;
- palette by role: background, text, muted, faint, accent, second accent;
- fonts: display, body, mono, each with its source;
- type sizes;
- margins and safe zones;
- motion recipes;
- finish values;
- the banned list.

The exact fields are fixed while building.

## 3. How a style reaches a video

When a video uses a style:

1. The engine **copies the style folder into the video**. Changing the catalog later never changes that video.
2. The video's `style.md` is written from `STYLE.md`. Notes that apply only to this video go into a section of their own.
3. The theme values in `src/Root.tsx` (colours, fonts, sizes, finish) are set from `style.json`. Today's theme names
   (ink, bone, ash, dim, ember, ice) map onto the roles, so the template doesn't need renaming.
4. The make-video skill's Look step changes:
   - read the chosen style and the taste skill, and keep to them;
   - don't invent a new look unless the user asks;
   - when the user changes something, offer "save as a new version of this style".

What changes automatically and what doesn't:
- **Automatic:** colours, fonts, sizes, margins and finish come straight from the numbers.
- **Written by Claude:** motion, elements and layout. Claude follows `STYLE.md` and the style's `scenes/` when it
  writes the video's scenes, as it does today from `style.md`.
- The quality gate (step 2) will check those against the style.

**Channels** (Settings → Channels): a list with name, style and **Look locked**.
- A new video belongs to a channel (the first one by default).
- Its style comes from:
  1. the channel's style, when the look is locked;
  2. otherwise, what the user picks or uploads on the Brief;
  3. otherwise, the style of the channel's last video.
- Existing videos get no channel until one is set.
- Accounts per channel come later, with distribution.

`brief.mjs`, `BriefBoard.tsx` and the make-video skill change together, as `CLAUDE.md` requires.

## 4. Adding a style from an upload

On the Catalog page, or from a video's Brief:

1. **Drop the inputs:**
   - images (Pinterest, posters, screenshots, frames);
   - PDFs;
   - Markdown or skill files;
   - design-system documents;
   - videos or links;
   - and an optional note, e.g. "colours from this one, type from that one".
2. **The engine studies them** with what exists today:
   - images: measured palette;
   - videos and links: stills, contact sheet, cuts, palette, transcript;
   - PDFs and documents: read in full.
3. **The catalog's Claude** (its own chat on the right of the page, working in the catalog folder):
   - writes `STYLE.md` and `style.json` in the standard format;
   - writes the sample scenes;
   - lists what it took from which source.
4. **The engine renders the previews.** Claude looks at them, fixes what's off, then shows the user.
5. **The user decides:** approve it, ask for changes, or throw it away. Until it's approved the style is
   *experimental*.

**A taste document that describes general rules rather than a look** ("good taste is…") becomes proposed additions to
the taste skill, which the user confirms one by one. It doesn't become a style.

From the Brief, the new style is saved as experimental and used for that video.

## 5. The visual taste skill

Rules for every video whatever the style. Each rule is curated from the resources, with its source named in the file.
In outline:

- **Numbers, not adjectives.** Every look decision has a value: hex, px, seconds, spring values.
- **One idea per scene, one hero per shot, one new thing at a time.** Never two unrelated reveals at once.
- **The voice is the clock.**
  - A change lands on the word that names it.
  - Key moments get a hold: at least 1 s after a key reveal.
- **Readable on a phone:**
  - captions at least 5% of the frame height, other text at least 3%;
  - text stays on screen at least as long as it takes to read;
  - everything inside the platform's safe zones.
- **Motion:**
  - no linear easing; named springs and eases;
  - exits faster than entrances;
  - things arrive with weight, they don't just fade.
- **Nothing static for long:** every beat changes something visible.
- **Diagrams:**
  - labels sit on the parts, no legends;
  - "a beautiful wrong diagram is worse than none".
- **Honesty:**
  - no invented numbers, customers or quotes;
  - logos and app screens are rebuilt as vectors, never downloaded;
  - no real brand marks without the user's OK.
- **Colour:**
  - measured hexes;
  - one accent per shot;
  - checked by pixel against the hex.
- **Type is code:** text is set as real type, never drawn by an image model.
- **The "AI-generated look" is avoided unless a style asks for it:** glow, purple gradients, glass cards, everything
  fading and sliding up, three cards in a row, a dark void with particles, emoji icons.
- **Each aspect ratio is its own composition:** never crop 16:9 into 9:16.
- **Review before showing:**
  - look at numbered stills;
  - feedback in the form "timestamp + word + one change".

## 6. The starter catalog

As many styles as the resources support, each distinct and fully specified. The sources are re-read in full first,
with notes saved in `docs/research/styles/`. That includes sources not read in depth yet:
- Lemo Opuscar ("43 film styles");
- Collage B-roll;
- Claude Animation Base;
- video-shotcraft's templates;
- vertical-video-editing's style pack;
- ECC's taste genres;
- HyperFrames' guides for each type of video;
- NullMotion's 23 templates.

The table below is what is known so far. Styles are studied for their rules; nothing is copied from anyone's footage or brand.
Fonts are Google Fonts, already available through `@remotion/google-fonts` 4.0.535, so no new package is needed.

| # | Style | From | Character |
|---|---|---|---|
| 1 | **Editorial Neuro** | the engine's current look | ink ground, bone text, Bodoni headlines with italic emphasis, Inter labels on pills, ember/ice only in diagrams; calm and editorial |
| 2 | **Signal** | Motion as Code (pdoom-video) | ink, bone, signal orange (#FF4D12) and a rare acid accent; Archivo in many widths; words written stroke by stroke as they're spoken; the spoken word lights up; graph-paper construction; bloom, grain, punch-ins |
| 3 | **HUD** | Level 5 guide | black, orange, red, warm white, indigo for quiet moments; Unbounded, Space Grotesk, JetBrains Mono, Instrument Serif for the emotional line; an always-on frame (corner brackets, timecode, live transcript, timeline strip); keywords in detection brackets; glitch on cuts |
| 4 | **Red Card Kinetic** | Kinetic Type guide | Poppins Black tight, Six Caps outlined; red cards illustrating words; ink-wipe reveals; named springs (swing, pop, stretch, slam, slide). Strongest with footage (words behind the speaker), with a type-only version |
| 5 | **Calm Demo** | Barty-Bart explainer-default | one line or one element at a time; the camera is the editor (pushes, 0.3–0.4 s blur dissolves); rebuilt UI; typing at about 25 characters per second; a pause after each result |
| 6 | **Beat Grid** | Barty-Bart high-energy, prompt-motion showreel | 120–140 BPM grid with an action on every beat, one technique per bar, short holds; transitions are objects (a dot grows into the next background); viewfinder frame and grain; no glows, flares, crossfades or bouncy easing |
| 7 | **One Take** | Barty-Bart explainer-engaging | one continuous camera; a hero object travels through "stations"; squash and stretch; a slow-motion reveal; seamless loop |
| 8 | **Glass Studio** | Claude + Blender guide | 3D-first: screens glowing under black glossy glass, lights kept out of the reflections, a warm terracotta hero, vignette |
| 9 | **Growing Diagram** | HyperFrames explainer rules | one diagram that grows as the voice names each part, labels on the parts, about 19 words per scene, neutral palette with one accent |
| 10 | **Scatter and Settle** | Claude Code Club, level 2 | elements arrive rather than fade, overshoot then settle, per-letter type, named transitions. Only 5 of its 8 rules are public; the rest are marked *(proposed)* |

## 7. The Catalog page

What it has to do (the layout gets 2–3 options with sketches before it's built, as with every new page):

- **Browse:** style cards with the cover frame, name, one line, tags and status (built-in, approved, experimental).
  Filter by tag.
- **Open a style:** its sheet (preview frames, swatches, type specimen, motion moves, banned list, sources).
  Actions:
  - Use for the next video;
  - Edit with Claude;
  - Duplicate;
  - Delete (to the Recycle Bin).
- **Add:** the drop zone plus links and a note. The catalog's Claude chat sits on the right, as on the other pages.
- **Fonts:** an input to upload font files for fonts that aren't on Google Fonts. They're stored with the style in
  `fonts/` and loaded from there.

## 8. Where the files live

- **Built-in styles** (the starter catalog): `library/catalog/visual/` in the engine, committed, so every PC has them.
- **The user's own styles:** `<workspace>/catalog/visual/`, next to the videos.
- **Editing a built-in style** saves a copy among the user's own, so engine updates never overwrite the user's version.
- **Previews** are rendered in a hidden preview project, `<workspace>/catalog/_preview/`, which isn't listed as a video.
  It draws each style's sample scenes from a fixed short sample script. No voice or music is generated, so it costs
  nothing.

## 9. Order of work, with checks

**Progress (2026-11-01):**
- **1a: done.**
- **1b: in progress.** About 40 styles are done and reviewed; the remaining batches are queued.
- **1c: done.** The Catalog page uses layout A, which the user chose: a gallery, then a style page with Claude.
  `tests/e2e/t16_catalog.mjs` passes.
- **1d:** next.

| Part | What | Checked by |
|---|---|---|
| 1a | The format, the taste skill, Editorial Neuro as the first style, the preview project | its preview frames match today's look |
| 1b | The other starter styles: sources re-read, entries written, previews rendered, each looked at and fixed | the user reviews the preview frames (shown in chat until the page exists) |
| 1c | The Catalog page: options first, then build; add from an upload with Claude; approve | the user adds a style from a Pinterest image and from a document |
| 1d | Styles in the Brief: choose, or upload new; copied into the video; make-video skill updated; Daily Insights default | a new video takes its style without being asked; an upload from the Brief lands in the catalog |

**Safety checks:**
- No dependencies are expected.
- If the template changes, the phone-reel regression check from `CLAUDE.md` is run.
- Existing videos keep their own copy and don't change.
- Nothing paid is called.

## 10. Still to decide

- The layouts of the Catalog page and of Settings → Channels: 2–3 options with sketches before building (1c, 1d).
