# HyperFrames (heygen-com/hyperframes): styles, taste rules, review checks

- Repo: https://github.com/heygen-com/hyperframes, licence Apache-2.0 (checked via the GitHub API on 2026-10-31).
- Read at commit `a04b45a6db0d1f724be9cf1985c3b13657195f0d` (main, 2026-10-31; latest release v0.8.223). The project ships several releases a day, so paths and numbers can move.
- Everything below is paraphrased. Hex values, numbers, short phrases and banned-list items are quoted exactly.
- **Frame size caveat.** HyperFrames' default is **1920×1080 at 30 fps** (`skills/hyperframes/SKILL.md`). Sizes below are at the size the source states. Most preset sizes are for a 1920×1080 frame. To scale them to our 1080×1920 vertical frame, the source's own vertical guide (`types/vertical.md`) gives the 9:16 rules; see the "Vertical" style.
- **What counts as a style here.**
  - The 13 **frame presets** (`skills/hyperframes/assets/frame-presets/*/FRAME.md`) are full design specs with exact hex, faces and sizes. The source calls them "slide-deck looks". It says to use one only when the person names it or for a deck, and never as the fallback look for a film without a brand (`references/look.md`). They are still the most complete styles in the repo, so each gets an entry.
  - The 7 **type guides** (`references/types/*.md`) are mostly grammar (structure, pacing, motion), not palettes. Each gets an entry (Part 2), marked partial or thin where it gives no palette or faces.
  - Part 2 also has the risograph "look built from a medium" example in `references/spec.md`, and the internal `changelog-video` skill (HeyGen's own house look).
  - The 6 distinct **registry examples** (`registry/examples/*`) are Part 3. One of them is native 1080×1920.
  - Totals: 13 + 9 + 6 = 28 entries.
- **Units in the presets.** Preset type is sized in `cqw` (1 cqw = 1% of the frame width). At 1920 wide, 1 cqw = 19.2 px. At our 1080 wide, 1 cqw = 10.8 px. Biennale Yellow's `FRAME.md` says display sizes clamp on the shorter axis so portrait doesn't blow out headlines. My reading: treat cqw as a % of the short side (1080) for 9:16; that's my inference, not a stated formula. px values in brackets are at 1920×1080.
- **Motion in the presets.** Every `FRAME.md` says motion is out of scope. The only motion a preset defines is in its `caption-skin.html`: a karaoke caption where the current word pops in from a smaller scale. Each style's Motion section gives that pop. All other motion comes from the general rules in `## Taste rules` (from `references/motion.md`).
- **Shared preset grammar.** Each `FRAME.md` has YAML tokens (colours, typography, spacing, components). It also has a "Frame Craft Bar" of eyeball tests (Squint, Silence, Restraint, Reference), 6 named frame treatments, a Do/Don't list, a 16:9 / 9:16 / 1:1 table, a "never invent figures" rule and a pre-render self-audit. Every face is a Google Font; I checked the Google Fonts links in each `frame-showcase.html`.
- **Caption skins.** Each `caption-skin.html` has three word states: upcoming, `.is-active` and `.is-spoken`. It also has optional per-word accent classes: `cap-brand`, `cap-num` and `cap-cta`. Exactly one group shows at a time. A group closes at whichever comes first: the next group's start, or its own end + 0.3 s. The last word turns "spoken" at its end + 0.1 s.

---

# Part 1: Frame presets (13)

## Biennale Yellow (museum catalogue)
- Source: `skills/hyperframes/assets/frame-presets/biennale-yellow/FRAME.md` (+ `caption-skin.html`, `frame-showcase.html`); licence: Apache-2.0
- One line: an art-biennale catalogue. Warm parchment, one deep indigo ink and soft solar-yellow "sun blooms" for depth. Calm, airy, literary.
- Suits: culture, events, programmes, essays, quote cards, slow explainers. No footage or 3D needed; everything is CSS (blooms, panels, hairlines).
### Palette
| role | hex | where used |
|---|---|---|
| paper (ground) | `#E9E5DB` | every frame; never white or grey |
| paper-deep | `#DCD6C4` | secondary paper |
| sun | `#F1EE2E` | bloom core, full-bleed yellow panel, block-tile underprint (40–70%), the active caption word's underprint |
| sun-soft | `#F8F39B` | bloom mid stop |
| haze | `#F0DA7C` | bloom outer stop (18–22%) |
| ink | `#1B2566` | ALL type and ALL rules; there's no second text colour |
| ember | `#E26B4A` | only as a 15–22% counter-bloom in the corner opposite the sun; never a fill or text; caption CTA underline |
- Bloom gradient (showcase): radial, `rgba(241,238,46,0.92)` 0% → `rgba(241,238,46,0.5)` 30% → `rgba(240,218,124,0.22)` 55% → paper at 0 alpha 78%.
- Never inverted: ink on yellow, never yellow on ink.
### Typography
- Faces, all Google Fonts: **Instrument Serif 400** (display, numerals, quotes; 400 only, never bold), **Archivo** 400/600 (body, labels), **JetBrains Mono 400** (all dates, figures, pagenum).
- Display ramp (Instrument Serif 400), cqw [px at 1920] / line-height / tracking:
  - ledger-title 1.55 [30] / 1.15;
  - strand-title 1.7 [33] / 1.1;
  - headline-sm 2.9 [56] / 1.0;
  - headline 4.6 [88] / 1.06 / −0.005em;
  - date-rail 5.0 [96] / 0.96 / −0.005em;
  - display-it 7.0 [134] italic / 1.04 / −0.005em;
  - numeral-md 7.5 [144] / 0.92 / −0.01em;
  - display 14.6 [280] / 0.86 / −0.018em;
  - numeral-jumbo 28 [538] / 0.84 / −0.04em.
- Reading ramp:
  - body Archivo 0.85 cqw [16] / 1.5; body-lede 0.95 cqw / 1.55;
  - micro-label Archivo 600 13 px, 0.18em, UPPERCASE; rail-label 13 px, 0.32em, uppercase;
  - mono-data JetBrains Mono 0.73 cqw, 0.04em; pagenum 13 px, 0.08em, 75% opacity.
- Legibility floor: any line that carries meaning is ≥ 1.4 cqw [27 px]. px-sized mono and labels are chrome only.
- Fit to length: a block is ≤ 78 cqw wide; ≤ 3 words → display; 4–6 → headline; 7+ → headline-sm. Never shrink the jumbo numeral.
- Case: sentence case for display. Labels UPPERCASE with ≥ 0.16em tracking. The only emphasis is one italic key word (cover) or an italic quote.
### Layout
- Safe area 4 cqw edge padding; regions padded 4.2 cqw with 2.5 cqw gaps. Only blooms, tiles and panels bleed.
- Frames are 55–60% empty; the ledger is the one dense exception.
- Cover, chapter and list frames anchor left or asymmetric; the manifesto is centred. One serif moment dominates at 3–6× its neighbour.
- 9:16 rules:
  - cover: display top, footer stacks;
  - chapter: numeral centred, rail on top;
  - ledger: drop the venue column, so 3 columns;
  - poster: the panel becomes a top or bottom band.
### Elements
- sun-bloom: one per frame, 42–70% of the frame, off-centre or behind the focal element.
- ember-bloom: subordinate counter-bloom.
- block-tile: translucent yellow rectangles on an 8×4 grid.
- yellow-panel: full-bleed column or third, no border.
- hairline-rule: 1 px ink, soft variant at 18–20%, the ONLY border.
- Rows and strips:
  - strand-row: serif numeral + serif title + sans body;
  - ledger-row, 4 columns: mono date · serif title · sans venue · mono duration;
  - footer-band: 4-column metadata strip;
  - vertical-rail: rotated label up the left edge.
- pagenum bottom-right: the only chrome that stays on every frame.
### Motion
- FRAME.md: out of scope. It notes the source's 280 ms crossfade is a deck mechanic.
- Caption pop: the active word goes scale 0.97 → 1 in 0.14 s, `power2.out`.
### Transitions and rhythm
- Not given.
### Finish
- Zero box-shadow, zero text-shadow, zero corner radius, no border over 1 px.
- Depth is atmospheric only (blooms). Flat parchment with no bloom "reads as a CMS template".
### 3D look
- None.
### Banned
- Drop shadows, rounded corners, bordered cards, borders over 1 px.
- A second text colour, bold Instrument Serif, inverted ink grounds.
- Mono in body or display; font substitutes.
- Crowding; omitting the bloom; a headline blown edge to edge.
### Example frames
1. Cover: a 2-line display title (italic key word) left, under a micro-label, with a sun bloom left of centre, an ember bloom in the opposite corner, a serif date-rail top-right and a 4-column footer band.
2. Chapter divider: a 28 cqw jumbo numeral, a serif title under it, a rotated rail label on the left, a corner bloom.
3. Ledger: a 4-column tabular calendar on soft hairlines under a 1 px header rule.
4. Manifesto: a centred 2-line italic quote under an oversized serif quote mark, with a centred bloom.
5. Poster panel: an ink headline sitting on a full-bleed yellow panel, the paper side left open.
6. Strand list: numbered rows (serif numeral + title + sans body).
### Caption skin
- A parchment card with a 1 px ink border, square corners and no shadow. Padding 20/44/24 px, max-width 78% (92% in portrait).
- Type: Instrument Serif 400 at `clamp(40px,4.4vw,58px)` (portrait `clamp(34px,5.4vw,48px)`), line-height 1.16, −0.01em.
- Word states:
  - upcoming: ink at 42% mixed with the canvas;
  - active: ink on a hard square `#F1EE2E` block, no blur;
  - spoken: solid ink.
- Accents: brand words in italic; numbers in mono at 72% ink; CTA words get a 2 px ember underline.
- Default band: top 900 px, height 180 px.
### Gaps
- Sizes are for slides. Body at 0.85 cqw (~9 px at 1080 wide) is far below the engine's 28 px reading floor, so a video use must re-scale it.
- No motion grammar; no transitions.
- CJK fallbacks given: Smiley Sans / Noto Serif SC / Noto Sans SC.

## BlockFrame (loud neobrutalist)
- Source: `skills/hyperframes/assets/frame-presets/blockframe/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: maximal neobrutalism, like a zine, a 1990s sticker book or toy packaging. 4 px black borders, hard 8 px offset shadows, candy pastels and tilted stickers.
- Suits: playful product promos, feature lists, kids' or creator brands, energetic socials. No footage or 3D; all CSS.
### Palette
| role | hex | where used |
|---|---|---|
| black | `#000000` | every border, structural text, the close-frame ground |
| white | `#FFFFFF` | card fills, the close-frame border |
| offwhite | `#FFFDF5` | default ground |
| pink | `#FE90E8` | cycled ground, decorations |
| blue | `#C0F7FE` | cycled ground (feature cards) |
| green | `#99E885` | cycled ground (stat grid) |
| yellow | `#F7CB46` | the CTA button, the close-frame's 12 px shadow, the active caption word |
| cream | `#FFDC8B` | cycled ground (cover), caption CTA underline |
- The five pastels carry no meaning. One pastel ground per frame, cycled frame to frame: **the cycle is the rhythm**. Pair them as a pink+blue+green trio or a cream+yellow warm pair. No sixth pastel.
### Typography
- Faces, all Google Fonts: **Inter** 500 (body), 700 / 800 / 900 (display); **Space Grotesk** 600/700 (labels, counters).
- Display, Inter UPPERCASE, cqw [px at 1920]:
  - heading-md 2.1 [40] 700, lh 1.1, −0.01em;
  - quote-text 2.7 [52] 900, lh 1.15, −0.02em;
  - stat-number 3.3 [63] 900, lh 1.0;
  - heading-lg 3.3 [63] 800, lh 1.0, −0.02em;
  - close-title 4.2 [81] 900, lh 0.95, −0.03em;
  - heading-xl 5.0 [96] 900, lh 0.95, −0.03em.
- Body and chrome:
  - body Inter 500 0.95 cqw [18], lh 1.6, sentence case;
  - card-title 1.15 cqw 700 uppercase;
  - label Space Grotesk 600 13 px, 0.08em, uppercase; counter 14 px 700, 0.1em.
- Floor ≥ 1.4 cqw. Fit to length: ≤ 3 words → heading-xl; 4–6 → heading-lg; 7+ → heading-md; block ≤ 78 cqw wide.
- No sentence-case display; no display without negative tracking.
### Layout
- Padding 3.1 cqw (60 px); gap 1.7 cqw. Decorations may bleed off the edges.
- Lean left. "Comfortably dense": an empty corner reads as broken. Feature and stat grids are the dense exception.
- 9:16 rules:
  - cover: title on top, decorations below;
  - cards: 3 stacked;
  - timeline: vertical, connectors hidden;
  - use fewer decorations on tighter ratios.
### Elements
- Cards:
  - card-elevated: white, 0.4 cqw black border, 0.8 cqw offset shadow;
  - card-small: 0.3 cqw border, 0.4 cqw shadow.
  - Border and shadow are coupled: 4↔8 px and 3↔4 px.
- label-pill: rounded 9999 px, 3 px border, 4 px shadow, pastel. It's the eyebrow on every region; a label is never plain text.
- Yellow CTA button.
- Decorations:
  - star-burst: a 10-point clip-path star;
  - stripe-block: 45° black + pastel stripes;
  - bg-dot-grid: ~1.2 px dots on a 24 px grid;
  - tilt-deco: rotated ±2–12°; stat cards alternate −2° / +2°.
- stat-deco-dot: 12 px, 2 px border, the ONLY round shape.
- close-frame: black ground, 4 px white border, 12 px yellow shadow.
- At least one decoration per frame.
### Motion
- FRAME.md: out of scope; the source deck switches slides with no transition.
- Caption pop: scale 0.86 → 1 in 0.2 s, `back.out(2.4)` ("snappy… a little crooked").
### Transitions and rhythm
- Not given beyond the ground-colour cycle per frame.
### Finish
- Flat colour; solid black hard shadows to the bottom-right with zero blur. 6 px is the hover shadow.
- No gradients, no blur, square corners.
### 3D look
- None; tilt stands in for depth.
### Banned
- Rounded corners (except the dot); blurred shadows.
- Coloured borders; a sixth pastel.
- Sentence-case display; untracked display; labels as plain text.
- Perfect alignment; empty corners; edge-to-edge headlines.
### Example frames
1. Cover: a cream ground with a faint dot grid. A 2–3 line uppercase title sits left under a label pill; tilted pastel rectangles and a star burst puncture the right third.
2. Feature cards: a blue ground with three white bordered cards (pastel icon square + title + body).
3. Stat grid: a green ground with three tilted stat cards, each with a deco dot.
4. Closing plate: black ground; a white title inside a white-bordered frame with a 12 px yellow shadow; a pink star in a corner.
5. Quote: pink ground, a 900 uppercase quote in a bordered white card.
6. Timeline: 3–4 bordered step cards joined by black connector bars.
### Caption skin
- White card, 4 px black border, 8 px hard shadow, square corners. Padding 18/40/22 px; max-width 80% (92% in portrait).
- Inter 900 UPPERCASE at `clamp(38px,4.2vw,56px)` (portrait `clamp(34px,5.4vw,48px)`), lh 1.12, −0.02em.
- Word states:
  - upcoming: black at 40%;
  - active: a hard `#F7CB46` "stamp" block;
  - spoken: solid black.
- Accents: CTA words get a 4 px cream underline.
### Gaps
- Its feature-card frame is "three cards in a row", which the film BANNED list forbids. Use that frame only for a deck.
- Sizes are for slides.

## Blue Professional (consulting restraint)
- Source: `skills/hyperframes/assets/frame-presets/blue-professional/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: an investment-research or McKinsey briefing. Warm cream, ONE saturated cobalt and grey text. Soft cobalt-tinted cards with no shadows. Measured and executive.
- Suits: business explainers, reports, KPI or data stories, B2B launches. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| bg | `#fdfae7` | every frame |
| primary (cobalt) | `#1e2bfa` | the ONLY accent: eyebrows, every numeral, CTA, chart fills, progress bar, 4 px highlight rule, active caption chip |
| text | `#111111` | headlines (never cobalt) |
| text-muted | `#6b6b6b` | body |
| text-light | `#9a9a9a` | tertiary |
| accent-light | `rgba(30,43,250,0.08)` | tag pills, bar tracks, highlight blocks |
| accent-medium | `rgba(30,43,250,0.15)` | quote mark (15%) |
| border | `rgba(30,43,250,0.2)` | card borders, 1.5 px |
| card-bg | `rgba(30,43,250,0.04)` | card fill |
| positive | `#059669` | only as inline ↑ change-chip text |
| negative | `#dc2626` | only as inline ↓ change-chip text; caption CTA underline |
### Typography
- Faces, Google Fonts: **Space Grotesk** 500/600/700 (display, all numerals, chrome); **Inter 400** (body).
- Display and numerals, Space Grotesk, cqw [px at 1920]:
  - h3 1.25 [24] 500, lh 1.3, −0.02em;
  - stat-num 1.9 [36] 700 cobalt;
  - blockquote 2.4 [46] 500, lh 1.35;
  - h2 2.6 [50] 600, lh 1.1, −0.02em;
  - metric-value 3.0 [58] 700 cobalt;
  - h1 4.2 [81] 700, lh 1.08, −0.02em;
  - quote-mark 8.0 [154] 700 cobalt at 15%, lh 0.5.
- Reading and chrome:
  - body Inter 0.85 cqw muted, lh 1.6;
  - eyebrow Space Grotesk 0.8 cqw 600, 0.08em, UPPERCASE, cobalt;
  - tag 12 px 500; counter 13 px 500, 0.05em.
- Floor ≥ 1.4 cqw. Fit: ≤ 3 words → h1; 4–6 → h2; 7+ → h3.
- No italic, no uppercase body, no cobalt headline.
### Layout
- pad-x and pad-y-top 5 cqw; card gap 1.4 cqw. The bottom is kept for the counter and the progress bar.
- Content frames are "balanced, not crowded"; the dashboard is the dense exception.
- Cover, dashboard and split lean left; quote and closer are centred.
- 9:16: the cover's diagonal panel becomes a top or bottom band; cards stack 3 high; the split stacks.
### Elements
- Cards:
  - card-tinted: 4% fill, 1.5 px 20% border, radius 14/12/10 px by size, no shadow;
  - metric-card: a cobalt value, a label, a muted description and an optional green/red change chip with no fill.
- Chrome:
  - tag-pill: radius 100 px;
  - cta-button: a solid cobalt pill, the one solid element;
  - accent-line: 60×4 px, 2 px radius;
  - progress-bar: 3 px tall at the bottom edge, growing with the slide index;
  - slide-header: cobalt eyebrow left, tag pill right, h2 below.
- Data and sequence:
  - bar-track: 28 px track at 8% cobalt, 6 px radius;
  - step-circle: 56 px cobalt circle; step opacities go 1.0 → 0.85 → 0.7 → 0.55;
  - split-highlight: 8% fill, 4 px cobalt left rule, 12 px radius.
- Atmosphere, on cover and closing only:
  - a clipped diagonal cobalt-tint panel (the right ~36%);
  - a 3×3 cobalt dot grid;
  - concentric rings.
### Motion
- FRAME.md: out of scope. It notes the source deck's 500 ms translateX slide changes and bar-fill animations.
- Caption pop: scale 0.985 → 1 in 0.18 s, `power1.out`.
### Transitions and rhythm
- Not given for video.
### Finish
- Soft, tinted, flat. Zero content shadows; the only shadow is a soft cobalt glow on CTA hover, which doesn't apply in video.
- Rounded everywhere except the progress bar.
### 3D look
- None.
### Banned
- A second accent colour; cobalt headlines.
- Drop shadows on content; opaque cobalt borders.
- Square corners; font substitutes; uppercase body.
- Green/red used as general accents.
- Heavier borders to fill space; edge-to-edge headlines.
### Example frames
1. Cover: a cobalt accent line and meta, then a 2-line near-black h1 on the left. A diagonal cobalt-tint panel on the right third, a 3×3 dot grid.
2. Dashboard: a slide header plus three tinted metric cards with cobalt values.
3. Bar ranking: 3–5 labelled cobalt bars on 8% tracks.
4. Pull quote: centred, with a 15% cobalt quote mark and faint concentric rings.
5. Split and highlight: a body column beside a highlight block with a 4 px left rule.
6. Closing: a centred h1 and one solid cobalt CTA pill, rings behind.
### Caption skin
- A cobalt 4% card with a 1.5 px 20% border and 14 px radius. Padding 20/44/24 px; max-width 78%.
- Space Grotesk 600 at `clamp(40px,4.4vw,58px)`, −0.02em.
- Word states:
  - upcoming: ink at 52%;
  - active: a solid cobalt chip (0.32em radius) with cream text;
  - spoken: near-black.
- Accents: brand words and numbers in cobalt; CTA words get a 2 px red underline.
### Gaps
- The dashboard frame is a 3-up KPI grid, which the film BANNED list forbids ("KPI grids").
- Space Grotesk and Inter are both on HyperFrames' "where generated design lands" list (`look.md`): use them only when the brand does.

## Bold Poster (vintage editorial poster)
- Source: `skills/hyperframes/assets/frame-presets/bold-poster/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: the cover of a vintage Italian sports magazine. Heavy tilted Shrikhand display, a classical serif body, one tomato red and grids ruled in ink. Feels *printed*.
- Suits: sports, culture, retro promos, stat-led reels, annual-report numbers. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| bg | `#FFFFFF` | default ground |
| dark | `#1C1410` | body, borders, headers, dark statement panel |
| red | `#D8000F` | the lone accent: every numeral, rules, eyebrows, leftbars, bullets, progress bar, the full red statement panel |
| light | `#F5F2EF` | off-white stripes on alternating panels |
- Four colours only. Red is never body text, never a tint, never a fill with no text on it.
- Stacked text-shadow, the system's only shadow, used on red panels only: `2px 2px 0 rgba(28,20,16,.25), 4px 4px 0 rgba(28,20,16,.2), 6px 6px 0 rgba(28,20,16,.15)`.
### Typography
- Faces, Google Fonts: **Shrikhand 400** (all display, numerals, card titles; 400 only), **Libre Baskerville** 400/700/italic (all body), **Space Grotesk** 400/600 (chrome only).
- Display (Shrikhand), cqw [px at 1920] / lh / rotation:
  - card-title 1.9 [36] / 1.1;
  - cell-number 2.7 [52] red;
  - section-header 3.3 [63] / 1.0;
  - red-quote 4.7 [90] / 1.15, white with the stacked shadow;
  - hero-title-bottom 10.4 [200] / 0.9 / +2°;
  - hero-title 11.5 [221] / 0.88;
  - hero-title-red 13.5 [259] / 0.85 / −4°;
  - close-big 13.5 / 0.88 / −5° red;
  - stat-big 22 [422] / 0.82 / −6° red.
- Body and chrome:
  - body Baskerville 0.85 cqw, lh 1.75; body-cell 0.7 cqw, lh 1.55;
  - label Space Grotesk 600 10 px, 2 px tracking, UPPERCASE, red;
  - bullet-body 0.62 cqw.
- Floor ≥ 1.4 cqw. Fit: ≤ 2 words → stat-big or hero-title-red; 3–4 → hero-title; 5+ → section-header.
- Inline `<strong>` switches to Space Grotesk 600. No italic display; no untilted red hero.
### Layout
- Tight padding (3 cqw × 3.6 cqw) "so the poster type crowds the frame"; grid gaps 1.5 cqw × 2 cqw.
- One display moment per frame at 3–6× everything else.
- Statement frames keep ~50–60% negative space; the financial grid is the dense exception.
- 9:16: the hero stack centres and gets taller; grids go 2 across or stack.
### Elements
- hero-title-stack: 3 Shrikhand lines, at least one tilted (−4° / +2°) and at least one red.
- stat-big poster numeral.
- fin-grid: a 0.3 cqw (3 px) outer + 0.15 cqw (1.5 px) inner ink double border.
- red-leftbar-card: a 4 px red left rule, no outline.
- red-panel and dark-panel: full-bleed statement surfaces.
- Bullets: a red em-dash, max 3.
- progress-bar: red, 0.5 cqw tall at the bottom edge, "the most prominent chrome".
- Hint pill: the only rounded thing (4 px).
### Motion
- FRAME.md: out of scope; it notes the source deck's 550 ms slide transitions.
- Tilt is the "signature movement" (static).
- Caption pop: scale 0.9 → 1 in 0.16 s, `back.out(2.2)`.
### Transitions and rhythm
- Not given.
### Finish
- A flat printed plane. No box-shadow, no gradient, square corners.
- Depth comes from heavy borders, surface inversion (red or dark panels) and tilt.
### 3D look
- None.
### Banned
- A second accent colour; rounded corners.
- Drop shadows; font substitutes.
- Shrikhand body, Baskerville labels, Space Grotesk headlines.
- Default disc bullets; an untilted red statement.
- A crowded statement frame; edge-to-edge long lines.
### Example frames
1. Hero stack: a 3-line Shrikhand stack (ink / red at −4° / ink at +2°) on the left of white, a mono eyebrow, a Baskerville tagline, the red progress bar.
2. Hero stat: a full red panel with a white numeral at −6°, the stacked shadow, centred.
3. Financial grid: double-bordered cells with red Shrikhand numerals.
4. Pull quote: a white Shrikhand quote on red, with the stacked shadow.
5. Editorial cards: 2–3 red-leftbar cards.
6. Closing: a red close-big sign-off at −5°.
### Caption skin
- White card with a 1.5 px ink border and a 4 px red left border, square. Padding 20/44/24 px.
- Shrikhand 400 at `clamp(40px,4.4vw,58px)`, −0.01em. (The file's comment says "Serif body face", but the CSS sets Shrikhand.)
- Word states:
  - upcoming: ink at 42%;
  - active: "slams into" a red block with white text and the stacked text-shadow;
  - spoken: ink.
- Accents: numbers in Baskerville.
### Gaps
- Slide sizes. Shrikhand tilts need checking so they don't clip at 9:16.

## Broadside (protest poster, two registers)
- Source: `skills/hyperframes/assets/frame-presets/broadside/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a protest poster where type is so big it stops being text and becomes a shape. Massive lowercase Barlow 900 on ink-black or fire-orange, with mono chrome. Flat and loud.
- Suits: manifestos, opinion pieces, bold claims, startup or activist promos, statement reels. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| ink-black | `#111111` | dark-register ground; ink on orange |
| ink-black-alt | `#1A1A18` | alternate dark |
| fire-orange | `#E85D26` | the ONLY colour: the accent on dark (kickers, one clause, stat numerals, `/` bullet, quote mark, rule stub); the full ground of the orange register |
| cream | `#F0ECE5` | text on dark |
| cream-muted | `#888880` | muted text on dark |
| cream-hint | `#505048` | non-accent chart bars |
| border-dark | `#282826` | 1 px hairlines on dark |
| ink on orange | `rgba(17,17,17,0.75/0.55/0.40/0.20)` | muted, hint, faint and border tones on orange |
- Two registers, one per frame: dark (cream text, orange accent) or orange (ink text). No cream or paper register. Never cream text on orange.
### Typography
- Faces, Google Fonts: **Barlow** 400–900 (every text role); **IBM Plex Mono** 400/500 (chrome only: kickers, tags, numbers, axis labels, the `/` bullet).
- Display, all lowercase, cqw [px at 1920]:
  - h3 2.8 [54] 600, lh 1.2;
  - quote-text 3.8 [73] 700, lh 1.15, −0.02em;
  - h2 4.5 [86] 700, lh 1.1, −0.02em;
  - stat-value 5.5 [106] 900, −0.04em;
  - h1 7.5 [144] 800, lh 0.9, −0.03em;
  - fadelist-item 7.5 900, −0.03em;
  - quote-mark 10 [192] 900, lh 0.6;
  - fadelist-title 10.5 [202] 900, lh 0.9, −0.04em;
  - display 13 [250] 900, lh 0.88, −0.04em.
- Reading and chrome:
  - body Barlow 400 1.2 cqw [23], lh 1.6; lead 1.6 cqw [31]; caption 0.9 cqw;
  - label IBM Plex Mono 500 0.72 cqw, 0.14em, UPPERCASE.
- Floor ≥ 1.4 cqw. Fit: ≤ 2 words → display; 3–4 → h1; 5+ → h2. ONE display moment per frame.
- No italic, no underline, no uppercase display.
### Layout
- Tight 5.5 cqw padding so the type crowds the edge; gaps 3.5 / 2 / 1 cqw. Lean left; "the type IS the composition".
- Declarative frames are 45–55% empty; the stat grid is the dense exception.
- Chrome bars (1 px hairline top and bottom, label left, number right) are SUPPRESSED on cover, chapter, statement, quote and end frames.
- 9:16: the word goes on top and the lead below; compare panels stack dark over orange.
### Elements
- Chrome ornaments:
  - kicker: a mono eyebrow;
  - rule stub: 36×2 px, the only ornament;
  - broadside-num: a mono catalogue numeral, top-left, low opacity.
- stat-card: top border only.
- Bullets: an orange mono `/`, max 3.
- Vertical bar chart: left axis only, one orange accent bar, the rest cream-hint.
- compare-panel: two halves split by a 1 px rule, the right half orange as the payoff.
- fadelist: 3 stacked words at opacity 1.0 / 0.5 / 0.22 beside one oversized orange title.
### Motion
- FRAME.md: out of scope; it notes the source deck's 0.8 s slide and per-element entries.
- Caption pop: scale 0.92 → 1 in 0.1 s, `power3.out`.
### Transitions and rhythm
- Not given. The register flip (dark ↔ orange) between frames is the implied rhythm.
### Finish
- Flat plane only. No shadow, no elevation, no radius (except nav dots), no gradient ground.
- Hierarchy comes from weight, size, 1 px hairlines and negative space.
### 3D look
- None.
### Banned
- Uppercase Barlow display; a second accent.
- Cream text on orange; a cream or paper register.
- Drop shadows, rounded surfaces, gradient grounds.
- A serif companion; Barlow used for chrome.
- Two display moments in one frame; edge-to-edge long lines.
### Example frames
1. Cover (orange): a 1–2 word lowercase display in ink at 13 cqw, left, over an ink rule stub and a mono kicker, with a lead line at 75% ink. A mono catalogue number top-left.
2. Statement (dark): 2–4 lowercase cream words with ONE clause in orange.
3. Stat grid: three top-border cards with orange 900 numerals.
4. Fadelist: three words at 1.0 / 0.5 / 0.22 opposite an orange title (before, during, after).
5. Pull quote: a 10 cqw orange quote mark over a lowercase quote.
6. Compare: a dark left panel (the documentation) and an orange right panel (the declaration).
### Caption skin
- An ink-black plate with a 1 px fire-orange hairline, sharp corners. Padding 18/44/22 px; max-width 80%.
- Barlow 900 lowercase at `clamp(38px,4.2vw,56px)` (portrait `clamp(32px,5.2vw,46px)`), lh 1.02, −0.03em.
- Word states:
  - upcoming: faint cream;
  - active: "flips register" to a hard orange block with ink text;
  - spoken: cream.
### Gaps
- Slide sizes; only the caption moves.

## Capsule (friendly pill editorial)
- Source: `skills/hyperframes/assets/frame-presets/capsule/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: Memphis-meets-ice-cream-parlour editorial. Every container is a 2 px-outlined pill on sun-bleached cream, with nine candy accents, Bodoni Moda headlines, confetti pills and soft grain.
- Suits: lifestyle and consumer brands, friendly explainers, community or creator content. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| cream | `#F5F5F0` | ground |
| ink | `#1A1A1A` | all type |
| outline | `#1E1E1E` | the universal 2 px stroke |
| white | `#FFFFFF` | content pill fills |
| coral | `#E85D4E` | accent line (60×4, 80×4 on the closer), active caption word |
| lime | `#C4D94E` | candy; orbit centre; quote highlight |
| lavender | `#C5B5E0` | candy |
| sky | `#8BB4F7` | candy; quote highlight |
| violet | `#A06CE8` | candy; the closing italic word |
| yellow | `#F2D160` | the title pill |
| peach | `#F5B895` | candy |
| mint | `#A8E6CF` | candy |
| shadow | `rgba(26,26,26,0.08)` | every shadow (8% ink) |
- The candies carry no meaning. Pair a warm (coral / yellow / peach) with a cool (sky / lavender / violet / mint) and a neutral-bright (lime). Never two of one family side by side.
- Colour only touches stat numerals and pill fills, never a headline. No tenth colour.
- Atmosphere on every frame: 1–3 radial candy glows at 6–15% opacity plus a 4% grain overlay.
### Typography
- Faces, Google Fonts: **Bodoni Moda** 600/700/800 (all display, stats, quotes; ink, sentence case, never uppercase); **Space Grotesk** 400/500/600 (body and uppercase pill text).
- Display (Bodoni), cqw [px at 1920]:
  - card-headline 1.9 [36] 700;
  - orbit-numeral 2.6 [50] 700;
  - stat-number 3.6 [69] 800, −0.03em;
  - section-headline 4.0 [77] 700, −0.01em;
  - quote-display 4.2 [81] 600, lh 1.3, −0.01em;
  - headline 5.0 [96] 700, −0.02em;
  - closing-display 8.5 [163] 800, lh 0.95, −0.03em;
  - display 12 [230] 800, lh 0.88, −0.03em.
- Body and pills:
  - body Space Grotesk 0.85 cqw, lh 1.6;
  - subtitle 0.95 cqw, 0.18em, UPPERCASE;
  - pill-text 0.75 cqw 600, 0.12em, uppercase;
  - label 14 px 500, 0.1em.
- Italic only via `<em>`; an italic key word may take a candy hue.
- Emphasis inside quotes is a candy highlight pill, never bold.
- Fit: ≤ 3 words → display; 4–6 → headline; 7+ → section-headline. Floor ≥ 1.4 cqw.
### Layout
- Padding 5 cqw, gap 2 cqw, card padding 2 × 1.6 cqw. Floating pills may bleed.
- Cover and closer centred; cards and quote lean left. "Bare corners read as broken."
- 9:16: the display goes on top with a band of pills; stat grid 2×2; orbit with 3 satellites.
### Elements
- pill: radius 9999 px small or 2rem cards, 0.2 cqw outline, on everything.
- Content pills:
  - pill-card: white, 8 px soft shadow;
  - stat-pill: a coloured Bodoni numeral and a 40 px accent bar;
  - title-pill: yellow, above the cover headline;
  - card-icon: a 60 px circle.
- Shapes:
  - step-node 56 px; orbit-centre 160 px lime;
  - floating-pill wallpaper: 5–8 per declarative frame, rotated −20° to +25°, flat, no shadow;
  - bar-track: a 36 px pill.
### Motion
- FRAME.md: out of scope; it notes the source deck's 0.6 s fade.
- Caption pop: scale 0.92 → 1 in 0.18 s, `back.out(2)`.
### Transitions and rhythm
- Not given.
### Finish
- Soft hard-offset shadows in 8% ink, bottom-right, no blur:
  - 4 px nodes; 6 px stat pills; 8 px cards; 12 px the visual frame.
- Floating pills cast no shadow, which keeps content apart from atmosphere.
- 4% grain plus radial glows always present.
### 3D look
- None.
### Banned
- Sharp-cornered text containers; unstroked pills.
- Coloured or uppercase Bodoni headlines.
- Blurred or recoloured shadows; a tenth accent.
- Shadows on decorative pills; edge-to-edge headlines.
### Example frames
1. Cover: a centred Bodoni display (italic key word in candy) under a yellow title pill, a coral accent line, and 5–8 tilted candy pills around the edges.
2. Pillar cards: three white pill cards (the dense frame).
3. Stat grid: white stat pills with coloured numerals.
4. Pull quote: one phrase wrapped in a lime or sky pill.
5. Orbit: a 160 px lime centre with 4–6 tilted satellites.
6. Closing plate: a centred closing display with pills.
### Caption skin
- A cream 9999 px pill with a 2 px ink outline and an 8 px shadow at 8% ink. Padding 18/46/20 px.
- Bodoni Moda 700 at `clamp(38px,4.2vw,56px)`, −0.02em.
- Word states:
  - upcoming: faint ink;
  - active: a rounded coral highlight (0.14em spread);
  - spoken: ink.
### Gaps
- It's a cream-ground serif look with pill chips. That's close to the film BANNED item "cream/off-white paper ground with a serif display… pill-shaped chips". Use it only on purpose.
- Slide sizes.

## Cartesian (quiet stone catalogue)
- Source: `skills/hyperframes/assets/frame-presets/cartesian/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a quiet museum catalogue (Vignelli, Cooper Hewitt, pencil on tracing paper). Warm stone, thin Playfair, 1 px taupe hairlines and faint compass rings. Sparse and breathing.
- Suits: architecture, design, luxury, heritage, calm documentary explainers. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| bg-primary | `#EDE8E0` | ground |
| bg-secondary | `#E2DBD1` | the only secondary fill: placeholders, photo frames |
| text-primary | `#1A1A1A` | headlines; the one ink accent rule |
| text-secondary | `#5A5A5A` | body |
| accent (taupe) | `#8A8178` | labels, numerals, small text, the active caption word underline |
| line | `#B8B0A4` | every 1 px structural line; quote mark |
| white-overlay | `rgba(255,255,255,0.3)` | card fill |
- No populist accent (no red, blue or green). To emphasise: grow the type, switch sans to serif, or add the one ink rule.
### Typography
- Faces, Google Fonts: **Playfair Display 400** (all display; never bold, never uppercase; italic only for emphasis); **Inter** 400/500 (body, labels).
- Display (Playfair 400), cqw [px at 1920]:
  - h3 1.8 [35];
  - timeline-headline 1.9;
  - card-headline 2.0;
  - stat-figure 3.0 [58]: stats stay modest, there's no hero numeral;
  - h2 4.0 [77] / 1.1;
  - h1 6.2 [119] / 1.06;
  - display 8.0 [154] / 1.04;
  - quote-mark 9.0, line colour.
- Reading and labels:
  - body Inter 1.0 cqw [19] grey, lh 1.6; body-sm 0.85; subtitle 1.3 cqw;
  - label 14 px 500, 3 px tracking, UPPERCASE, taupe;
  - attribution 15 px, 2 px tracking; micro 12 px, 2 px tracking.
- Fit: ≤ 3 words → display or h1; 4–6 → h2; 7+ → h3. Floor ≥ 1.4 cqw.
### Layout
- Generous gutters: pad-x 7 cqw, pad-y 5 cqw; gaps 6 / 5 cqw.
- Declarative frames are 55–60% empty. There's NO dense frame; even the agenda breathes.
- Cover, agenda and editorial are asymmetric or left; quote and closer are centred.
- 9:16: the headline goes on top with the ring below; two columns stack; the timeline becomes a vertical list.
### Elements
- hairline: 0.07 cqw (1 px) taupe, the universal separator.
- card: a white-overlay fill with a 1 px border.
- card-icon: a 40 px ringed circle with a Playfair numeral.
- agenda-row: a taupe numeral left, an ink label right, over a rule.
- timeline: one top rule, no nodes or dots.
- geo-ring: compass rings 10–50 cqw, solid plus an inner dashed ring at 70–80%, opacity 0.2–0.5, max 1–2 per frame.
- horizontal-accent: ~18 cqw × 1 px INK, used sparingly.
- vertical-line: a drafting guide 5 cqw from the edge at 0.3–0.4 opacity.
- image-placeholder: a stone fill with a ±30° taupe X.
- team-photo: a ringed circle with a Playfair initial.
### Motion
- FRAME.md: out of scope; it notes the source deck's 0.6 s fade.
- Caption pop: scale 0.985 → 1 in 0.2 s, `power1.out`.
### Transitions and rhythm
- Not given.
### Finish
- Flat. Zero shadow, zero gradient, no rounded rectangles (circles only).
- Depth is only implied by the rings.
### 3D look
- None.
### Banned
- A populist accent; bold Playfair; taupe headlines.
- Borders of 2 px or more; shadows, elevated cards, rounded rectangles.
- Crowding; more than 2 geo decorations; edge-to-edge headlines.
### Example frames
1. Cover: a 2–3 line Playfair headline left (italic key word), a taupe label above, a ~34 cqw solid-plus-dashed ring right, a vertical guide line left.
2. Agenda: an h2 over 4–6 hairline rows.
3. Pull quote: centred, inside a ~26 cqw dashed ring.
4. Closing: a centred sign-off inside a ~40 cqw ring, a short ink rule under it.
5. Two-column editorial with a crossed-X placeholder.
6. Stats or timeline on a hairline rail.
### Caption skin
- A stone card with a 1 px taupe border, sharp, no shadow. Padding 20/44/24 px.
- Playfair 400 at `clamp(40px,4.4vw,58px)`, −0.01em.
- Word states:
  - active: marked "QUIETLY", with an 18% taupe wash and a 1 px taupe underline;
  - spoken: ink.
### Gaps
- Playfair Display and a cream/stone serif ground are close to the film BANNED "cream paper serif" look; the small uppercase labels too.
- Slide sizes.

## Cobalt Grid (two-colour risograph report)
- Source: `skills/hyperframes/assets/frame-presets/cobalt-grid/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a two-colour risograph trend report (WIRED Japan, Shift). Cream paper, electric cobalt as the ONLY ink, a permanent graph-paper grid, Newsreader serif, a pixel-glitch scanline column and QR patches.
- Suits: tech or culture trend reports, data explainers, research summaries, "lab notebook" brands. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F0EBDE` | ground |
| paper-2 | `#E6E0CE` | secondary paper |
| ink (cobalt) | `#1F2BE0` | ALL type, rules, grid, glitch, QR, data cells; the active caption block |
| ink-soft | `#5560E5` | editorial subtitles only (the italic callout) |
| grid | `rgba(31,43,224,0.10)` | the permanent grid; chart "off" cells |
| ink-faint | `rgba(31,43,224,0.18)` | faint row dividers |
- Strictly two colours. Emphasis comes from size, a face switch (Hanken → Newsreader), a mono delta arrow or opacity, never a hue.
### Typography
- Faces, Google Fonts: **Newsreader 400** (all display; size, not weight, makes hierarchy; never bold), **Hanken Grotesk** 400/600 (body, labels), **DM Mono 400** (chrome).
- Display (Newsreader 400), cqw [px at 1920]:
  - table-name 1.5 [29];
  - row-headline 2.1 [40];
  - ed-callout 2.6 [50] italic;
  - headline 4.6 [88] / 0.95;
  - headline-index 5.0;
  - display-quote 5.7 [109], −0.005em;
  - display-chapter 6.8 [131], −0.005em;
  - display-closing 9.4 [180];
  - display-hero 10.4 [200] / 0.9, −0.008em;
  - vbig-numeral 12.5 [240] / 0.9, −0.015em.
- Reading and chrome:
  - body Hanken 0.83 cqw, lh 1.5; body-lede 0.95;
  - micro 13 px 600, 0.16em, UPPERCASE; micro-strong 16 px, 0.18em;
  - mono-tag DM Mono 0.78 cqw, 0.05em; mono-chrome 13 px, 0.06em.
- Fit: ≤ 3 words → display-hero or vbig-numeral; 4–6 → display-chapter; 7+ → headline. Floor ≥ 1.4 cqw.
### Layout
- Edge inset 4 cqw (~80 px); pad-top 7 cqw, pad-bottom 6 cqw; gap 2 cqw.
- Declarative frames (cover, chapter, quote, colophon) are 45–60% empty with the grid showing. The index ledger and data frame are dense.
- Anchors vary: left for index and chapter, centred for quote, right-aligned for the colophon.
- 9:16: the glitch becomes a full-width band; fewer ledger rows; 4–5 taller bars.
### Elements
- Frame furniture on every frame:
  - graph-grid: ~2 cqw cells at 10% cobalt;
  - hairlines: 0.12 cqw (1.5 px) cobalt, ≈ 3 cqw from top and bottom;
  - page number bottom-right, nav hint bottom-left.
- pixel-glitch: a stair-stepped scanline column, `repeating-linear-gradient(90deg, ink 0 2px, transparent 2px 8px)`, 14–30 cqw wide. Right on cover and data, left on chapter and colophon.
- qr-block: 8×8 cells, 3–9 cqw square, with a 0.12 cqw paper outset (an "anti-shadow").
- topbar-rule.
- ledger-row: mono number · Newsreader name · Hanken description · mono ↑/↓/— delta.
- pixel-stack-bar: data as grid cells, cobalt on, 10% off.
- vstack-label: vertical mono text.
### Motion
- FRAME.md: out of scope; it notes the source deck's 280 ms crossfade.
- `spec.md`'s risograph example adds medium-true motion: "the frame is printed, plate by plate, not faded in".
- Caption pop: scale 0.985 → 1 in 0.1 s, `power3.out`.
### Transitions and rhythm
- Not given.
### Finish
- Flat. No shadow, gradient, radius or circle; zero round elements.
- The grid is the "measured-plane tone".
### 3D look
- None.
### Banned
- A second ink colour; bold Newsreader; rounded corners; drop shadows.
- Disabling the grid or the hairlines.
- Crowding chapter, quote or colophon frames; edge-to-edge headlines.
### Example frames
1. Hero cover: a 1–2 line cobalt display left, an italic ink-soft callout, a ~26 cqw glitch column right, a QR patch top-right.
2. Index ledger: a topbar over 4–6 rows.
3. Chapter opener: a mono `CHAPTER NN` above the display, with a low-opacity glitch on the left.
4. Data frame: 6–8 pixel-stack bars on a cobalt baseline.
5. Manifesto: a centred 2–3 line pull with an attribution rule.
6. Colophon: a right-aligned closer with 3–4 mono credit columns.
### Caption skin
- A cream card carrying a 16 px graph grid at 10% cobalt, 1.5 px cobalt rules top and bottom, square, no shadow. Padding 20/44/24 px.
- Newsreader 400 at `clamp(40px,4.4vw,58px)`, −0.01em.
- Word states:
  - active: a hard cobalt knockout block with cream text;
  - spoken: cobalt.
### Gaps
- Cream paper plus a serif display plus small mono labels sits close to the film BANNED "cream-paper-serif-mono-label" look. The risograph medium is what justifies it.
- The CSS glitch replaces the source's SVG.

## Code Editorial (developer brand book)
- Source: `skills/hyperframes/assets/frame-presets/code-editorial/FRAME.md` (+ `caption-skin.html`, bundled `fonts/` with OFL licences); licence: Apache-2.0 (fonts OFL)
- One line: a warm literary-imprint brand book for code. Cream paper, ink voice, coral rationed as "voltage", EB Garamond display, and a warm-navy code window.
- Suits: changelogs, pull-request videos, developer tools, technical essays. Needs real code or diffs (the source's `code-*` blocks render them). No 3D.
### Palette
| role | hex | where used |
|---|---|---|
| ink | `#141413` | headlines and body on cream |
| cream | `#FAF9F5` | default ground; text on navy |
| tile | `#EFE9DE` | half-step content surface |
| tile-strong | `#ECE3D4` | stronger tile |
| coral | `#CC785C` | ONE moment per frame (CTA, inline link OR full-bleed band); ✱ spike mark; caption 3 px underline |
| navy | `#181715` | code and terminal surface body |
| navy-soft | `#1F1E1B` | dark card |
| navy-elev | `#252320` | code title bar and status strip |
| syntax: keywords | coral | hand-set code only |
| syntax: strings | `#5DB8A6` | teal |
| syntax: numbers | `#E8A55A` | amber |
| status | `#5DB872` success / `#C64545` warn | status strip |
- Borders: hairline 1 px ink@12%; strong ink@20%; on navy cream@14%.
- No pure white, cool grey or pure black.
- Cream `#FAF9F5`, ink `#141413` and coral `#CC785C` look the same as Anthropic's public brand colours. I'm fairly but not fully sure. Don't reuse the palette as-is for our own videos.
### Typography
- Faces, Google Fonts (also shipped as local WOFF2 400/700): **EB Garamond 400** (all display; 700 "reads as a heavy bold, off-register"; italic is the stance register), **Inter** 400/500 (body, chrome), **JetBrains Mono** 400/500 (kickers, labels, code).
- Display (EB Garamond 400, sentence case), cqw [px at 1920]:
  - headline 4.6 [88] / 1.06 / −0.018em;
  - quote-pull 5.0 [96] italic / 1.12 / −0.012em;
  - display-italic 6.7 [129];
  - display 7.3 [140] / 1.02 / −0.022em;
  - number-hero 9.4 [180] / 0.95 / −0.025em;
  - display-cover 9.9 [190] / 0.98 / −0.028em.
- number-unit: JetBrains Mono 500 2.08 cqw. A figure is always serif and its unit always mono.
- Reading and chrome:
  - body Inter 1.5 cqw [29], lh 1.5; lead 2.08 cqw [40];
  - card-title 2.3 cqw 500; tag-upper 1.35 cqw, 0.18em uppercase;
  - kicker JetBrains Mono 500 28 px, 0.16em, UPPERCASE, prefixed by a coral ✱; mono-label 26 px;
  - code 1.67 cqw, lh 1.6.
- Fit: ≤ 3 words → display-cover; 4–6 → display; 7+ → headline.
- No uppercase or title-case serif, no sans headline, no serif label.
- This is the only preset whose body sizes clear the 1.4 cqw floor.
### Layout
- slide-pad 4.2 cqw (~80 px); gap 1.7 cqw. "Density is free": one focal, or a dense layered frame.
- 9:16: the code panel gets taller with fewer lines; the avatar row wraps rather than shrinks.
### Elements
- card-hairline: 1 px ink@12% border plus one soft warm shadow, 12 px radius.
- kicker-spike: the ✱ eyebrow, 2–5 words, never a sentence.
- coral-callout.
- number-lockup: e.g. `+1,204 / −318`, `17 files`.
- pull-quote: italic, with an Inter uppercase cite.
- section-rule: 1 px; coral may draw on.
- code-surface: 8 px radius, a cream@14% hairline, a navy-elev title bar with the filename in mono.
- spike-mark: the coral ✱.
- Contributor avatar chips in hairline rings.
- Radii: 6 / 8 / 12 / 9999 px. "No square corners, no heavy rounding."
### Motion
- FRAME.md calls motion out of scope, but names its "motion register":
  - short cross-dissolves; no overshoot, bounce or elastic;
  - coral is the only draw-on;
  - numbers count up; code types on line by line.
- The ✱ spike fades and scales 0.92 → 1 on one emphasis beat and never spins.
- Caption pop: scale 0.98 → 1 in 0.16 s, `power1.out`.
### Transitions and rhythm
- Short cross-dissolves (no numbers given).
### Finish
- Hairline elevation only. One soft warm shadow, `0 1px 3px ink@8%, 0 4px 16px ink@4%`.
- No heavy drop, glow, gradient on content, or tilt.
### 3D look
- None.
### Banned
- Pure white, cool grey, pure black; a fourth brand hue.
- Heavy shadows, glow, gradients, tilt.
- Uppercase or title-case serif display; sans headlines; serif labels; units set in the serif.
- Two coral moments in one frame; coral headlines or body.
### Example frames
1. Cover: a 2–3 line EB Garamond display under a coral ✱ kicker, a mono repo · branch index strip.
2. Statement: one 2-line serif sentence (italic if it's a stance), on cream or navy.
3. Code surface: a navy code window framed in cream (diff, typing or snippet).
4. Number or impact: a serif figure with a mono unit over a 1 px rule.
5. Pull quote: a commit message in italic.
6. Closing: a sign-off, one coral CTA and a row of contributor avatars.
### Caption skin
- A cream card with a 1 px ink@12% border, 12 px radius and the soft warm shadow. Padding 22/44/26 px.
- EB Garamond 500 at `clamp(40px,4.4vw,56px)`, lh 1.24, −0.02em.
- Word states:
  - active: full ink with a 3 px coral underline (border-bottom);
  - spoken: ink.
### Gaps
- `FRAME.md` repeats its "Known Gaps" section twice; I read both copies.
- Cream plus serif plus mono kicker is the BANNED film default unless it's the brand.

## Coral (bold magazine, hard-edged planes)
- Source: `skills/hyperframes/assets/frame-presets/coral/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a sports-magazine cover or a Saul Bass travel poster. Coral, ink and cream planes meet at hard edges, with tall tracked Bebas Neue caps, a 45° hatch and giant wallpaper numerals.
- Suits: sports, travel, events, bold product promos, stat reels. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| coral | `#E85D5D` | accent AND environment: full regions, 5 px card tops, 4 px tile lefts, 48 px icon squares, timeline nodes, eyebrows on cream or ink |
| coral-dark | `#D44A4A` | only in the rare 135° coral-dark → coral feature gradient |
| cream | `#F5F0E8` | surface; text on ink |
| cream-dark | `#E8E0D4` | info-bar footer band |
| black | `#1A1A1A` | surface; headlines on cream or coral |
| gray | `#6B6B6B` | body and meta only |
| light-gray | `#B0B0B0` | meta |
| white | `#FFFFFF` | card fill |
- Ink-on-fire: type on coral is always ink, never white. No coral on coral.
- Coral fires as an accent OR one full region per frame, not both at full strength.
- Textures:
  - hatch `repeating-linear-gradient(45deg, transparent 0 20px, rgba(0,0,0,.06) 20px 40px)` over coral;
  - variants −45° 30/60 px, and 90° at 60/62 px with 10% ink;
  - wallpaper numeral at `rgba(0,0,0,0.12)`; giant mark at `rgba(0,0,0,0.35)`.
### Typography
- Faces, Google Fonts: **Bebas Neue 400** (every headline, stat, title, meta figure; always UPPERCASE and tracked); **Inter** 300–700 (body, labels, attribution).
- Display (Bebas), cqw [px at 1920] / tracking:
  - card-title 1.9 [36] / 1 px;
  - sidebar-value 2.3; bar-title 2.3 / 2 px;
  - card-stat 2.5;
  - column-title 3.7 [71] / 2 px;
  - section-headline 4.2 [81] / 2 px;
  - stat-numeral 5.0 [96];
  - hero-title 6.5 [125] / lh 0.9 / 4 px;
  - jumbo-feature 9.0 [173] / 12 px;
  - background-numeral 10 [192] at 12% ink; giant-mark 14 [269] at 35% ink.
- Reading and labels:
  - body Inter 400 1.0 cqw, lh 1.7;
  - body-light Inter **300** 1.5 cqw (the pull-quote voice);
  - section-label 12 px 700, 4 px tracking, UPPERCASE; item-label 11 px, 3 px;
  - attribution 14 px 600, 3 px.
- "Bebas declares; Inter explains." No italic, no underline, no sentence-case Bebas.
- Fit: ≤ 3 words → hero or jumbo; 4–6 → section-headline; 7+ → column-title.
### Layout
- The region split IS the layout: rows 38/62, columns 40/60, or 50/50, at hard edges. Regions may bleed full-frame.
- Padding 5 cqw × 4 cqw; column pad 3 cqw; grid gap 1.7 cqw; card pad 2 cqw.
- Regions are 40–55% empty. An underfilled coral region gets a wallpaper numeral, never more content.
- 9:16: a taller coral band with the title below; the quote stacks (coral mark on top); the timeline goes vertical.
### Elements
- region-split; diagonal-hatch; background-numeral; giant-mark.
- card: white with a 0.26 cqw (5 px) coral top.
- sidebar-item: a 0.2 cqw coral left border.
- card-icon: a 2.5 cqw coral square with a white Bebas glyph.
- accent-line: 4 × 0.25 cqw (60×4 on the closer).
- timeline: a 0.2 cqw ink line, 20 px coral nodes with cream halos.
- info-bar.
- Circles only for 10 px nav dots, 44 px arrows and nodes.
### Motion
- FRAME.md: out of scope; it notes the source deck's 0.6 s opacity fade.
- Caption pop: scale 0.97 → 1 in 0.14 s, `power2.out`.
### Transitions and rhythm
- Not given.
### Finish
- Flat, hard colour edges. The hatch is texture, not depth.
- No box-shadow; no gradient except the one 135° feature; zero radius on rectangles.
### 3D look
- None.
### Banned
- Sentence-case or untracked Bebas; a non-Inter body.
- A fourth surface; shadows, elevation, rounded rectangles.
- White on coral; grey headlines.
- Gradient region boundaries; sparse fragments in a coral region.
- Edge-to-edge headlines.
### Example frames
1. Region-split cover: a 38% coral band on top (hatch, wallpaper numeral, Bebas brand and meta) over cream; a 2-line ink hero title with the second line in coral.
2. Feature stat: full coral with hatch, an ink jumbo figure, a 12% wallpaper numeral behind.
3. Quote: a coral left panel (40%) with a 35% giant quote mark; an ink right panel with a cream Inter 300 quote and a 60×4 coral line.
4. Closing: a centred sign-off on cream over a coral bottom band.
5. Three-column catalog of white cards with coral tops (the dense frame).
6. Timeline: an ink rail with 4–5 coral nodes.
### Caption skin
- A cream block with a 1 px ink border, square. Padding 18/44/20 px.
- Bebas Neue UPPERCASE at `clamp(44px,4.8vw,64px)` (portrait `clamp(38px,5.8vw,54px)`), lh 1.04, 0.06em.
- Word states:
  - active: a solid coral block with ink text;
  - spoken: ink.
- Accents: brand words get a coral hairline underline.
### Gaps
- Its three-column catalog frame is "three cards in a row", BANNED for films.

## Creative Mode (sparse neobrutalist poster)
- Source: `skills/hyperframes/assets/frame-presets/creative-mode/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a risograph editorial poster or punk-zine spread. Warm cream, 4 px ink borders, Archivo Black caps at 0.92 line-height and rationed collision accents. "Loud by construction, calm by restraint."
- Suits: creator, agency and launch promos; bold claims; stat beats. No footage or 3D.
- Note: its type ramp is the only one written with px values for 1920 next to the cqw.
### Palette
| role | hex | where used |
|---|---|---|
| cream | `#EFE9D9` | ground on nearly every frame |
| cream-2 | `#E4DCC4` | the comparison-table fill |
| ink | `#0F0F0F` | borders and type |
| ink-2 | `#2A2A2A` | secondary ink |
| green | `#1F8A4C` | stat cells; the ground of the ONE closing plate only |
| green-dark | `#136636` | |
| pink | `#F06CA8` | marker block, stamp, cells, the wordmark's second line |
| pink-dark | `#D14E8B` | |
| orange | `#E85A1F` | cells; the hard-shadow colour |
| yellow | `#F5C518` | rotated badge, decorative circle, the active caption block |
- Two or three accents per frame, never all four, never a fifth.
- No pure white, no gradient.
- Type on an accent is ink, never white.
### Typography
- Faces, Google Fonts: **Archivo Black 400** (all display; UPPERCASE, line-height 0.92, tracking only −0.01em); **JetBrains Mono 400** (every label, kicker, counter, axis); **Space Grotesk 400** (the few body lines).
- Display (Archivo Black), cqw [px at 1920] / line-height / tracking:
  - stamp-num 2.2;
  - marker 2.4;
  - display-head 4.2 [81] / 0.92 / −0.01em;
  - stat-num 6.4 [123] / 0.88;
  - step-num 7.0 [134] / 0.85;
  - display-lg 8.0 [154] / 0.9;
  - display-xl 11 [211] / 0.9;
  - display-hero 15.5 [298] / 0.84 / −0.02em.
- Smaller Archivo Black: step-title 34 px (1.77 cqw); badge-label 28 px; table-head 28 px.
- Reading:
  - body-lg Space Grotesk 28 px (1.46 cqw), lh 1.4; body-md 24 px, lh 1.3;
  - mono-label 24 px, 0.06em, UPPERCASE; mono-kicker 24 px, 0.14em.
- Floor ≥ 1.4 cqw (≈ 27 px). Fit: ≤ 3 words → hero or xl; 4–6 → lg; 7+ → head.
- Body is never centred.
### Layout
- Chrome inset 3.3 cqw (64 px); content gutter 5 cqw (96 px); grid gap 1.5 cqw (28 px); cell pad 1.7 cqw (32 px).
- One idea per frame; the focal element is 3–6× its neighbour, "a chasm, not a ramp".
- Lean centred; the marker and ledger are asymmetric.
- Sparse frames are 45–60% empty; the stat grid (~25% empty) and the ledger are dense.
- 9:16: the wordmark stacks with the circle on top; the claim goes on top; the stat cells stack 3 high.
### Elements
- frame-chrome:
  - a mono topbar 2.5 cqw from the top (label + a 999 px ink-stroked pill);
  - a meta footer (descriptor + `NN • NN` counter with a 0.5 cqw dot).
- Cards:
  - stat-cell: flat, 0.4 cqw border;
  - step-card: a giant step number; the sequence ENDS on green.
- marker-block: pink, with the one hard shadow per frame: `1.25cqw 1.25cqw 0 orange, 1.25cqw 1.25cqw 0 0.2cqw ink`.
- Small chips and stickers:
  - kicker-block: an inverted ink chip;
  - badge-rotated: yellow at −4°;
  - pill-badge: 999 px, the ONLY rounded thing;
  - stamp: ~18 cqw pink square at −6° with a cream inner ring.
- comparison-table: 0.3 cqw rules, one column filled to mark the winner.
- decorative-circle: a yellow disc.
- Diagram stacks may use a 0.95 cqw ink-only offset.
### Motion
- FRAME.md: out of scope. It calls the closing green "a *plate*, not a transition".
- Caption pop: scale 0.92 → 1 in 0.16 s, `back.out(2.2)`.
### Transitions and rhythm
- Not given. The green closing plate is a one-time "ground swap".
### Finish
- Zero blur. Depth is the hard offset shadow (one per frame) or colour-block contrast.
- Rotation only at −4° (badge) and −6° (stamp).
### 3D look
- None.
### Banned
- Rounded corners except the pill; gradients, blur, glow.
- Sentence-case Archivo Black, or tracking past −0.01em.
- All four accents at once; a fifth accent; pure white.
- Centred body; labels in anything but JetBrains Mono.
- Edge-to-edge headlines; two hard shadows on one frame.
### Example frames
1. Wordmark cover: a 15.5 cqw two-line centred wordmark, the second line in pink or orange, a corner circle bleeding off, mono chrome top and bottom.
2. Big claim: a full-bleed accent ground with a 2–3 line ink claim on the left under an ink kicker chip.
3. Stat grid: three green / pink / orange cells.
4. Closing plate: a green ground, a cream sign-off, a pink stamp at −6°.
5. Featured marker: a pink block with an orange + ink hard shadow.
6. Comparison ledger.
### Caption skin
- A cream card with a 4 px ink border and the hard shadow `14px 14px 0 #e85a1f, 14px 14px 0 4px #0f0f0f`, square. Padding 18/40/22 px.
- Archivo Black UPPERCASE at `clamp(34px,3.8vw,52px)` (portrait `clamp(30px,5vw,44px)`), lh 0.92, −0.01em.
- Word states:
  - active: a yellow block;
  - spoken: ink.
### Gaps
- The stat grid is a 3-up row (BANNED in films).

## Daisy Days (picture-book sticker sheet)
- Source: `skills/hyperframes/assets/frame-presets/daisy-days/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a cheerful children's picture book or kawaii sticker sheet. Sunny pastels, 3 px charcoal outlines, hard 6 px offset shadows, chunky Fredoka and hand-drawn daisies, stars and suns in the corners.
- Suits: kids' content, education, wellness, friendly apps, character or mascot shorts (pair with the Character grammar). No footage or 3D. Needs hand-drawn SVG ornaments.
### Palette
| role | hex | where used |
|---|---|---|
| cream | `#F5F0E6` | default ground; content-dense frames |
| turquoise | `#7ECDC0` | saturated surface (cover) |
| soft-pink | `#F7C8D4` | surface (quote); quote mark |
| butter | `#FDE68A` | badge pill; bullet dots |
| mint | `#A8E6CF` | surface; markers |
| lavender | `#D4A5E8` | surface (closing); markers |
| peach | `#FFCBA4` | surface (process) |
| sky | `#A8D8F0` | surface; markers |
| coral | `#F8635F` | the lone warm pop: small markers only, never a surface; the active caption block |
| text-dark (charcoal) | `#2D2D2D` | every border, shadow and headline on cream |
| text-muted | `#6B6B6B` | body on cream or white only |
| white | `#FFFFFF` | card fills; headlines on saturated surfaces |
- Shadows: 6px 6px 0 charcoal (default), 4px 4px 0 (small); headline text-shadow 3px 3px 0 charcoal (a soft `rgba(0,0,0,0.2)` variant on pink or mint).
- Marker fills rotate coral → mint → sky → lavender → butter.
### Typography
- Faces, Google Fonts: **Fredoka One** (or Fredoka variable at weight 600) for all display, single weight, never italic; **Quicksand** 500/600/700 for all body.
- Display (Fredoka), cqw [px at 1920], tracking 0.02em:
  - badge 0.9;
  - label-display 1.3 [25];
  - subtitle 1.8 [35];
  - quote 2.6 [50] / 1.35;
  - title 3.0 [58];
  - headline 4.5 [86] / 1.1;
  - display 6.5 [125] / 1.1.
- Body: Quicksand 500 0.95 cqw [18], lh 1.6; strong 600; meta 0.78 cqw 600.
- Headlines on saturated pastels are WHITE with the 3 px charcoal text-shadow ("outlined"); on cream they sit flat in charcoal.
- Fit: ≤ 3 words → display; 4–6 → headline; 7+ → title. Never uppercase body.
### Layout
- Padding ~3 cqw; ornaments deliberately bleed past the edge.
- ONE content container per frame inside a wreath of 3–7 ornaments; the info-card grid is the dense exception.
- Mostly centred. Saturated grounds for cover, quote and closer; cream for content.
- 9:16: centred and taller with more ornaments (5–7); process steps go vertical with the arrows rotated down.
### Elements
- card: white, 3 px border, 20 px radius (28 px featured), 6 px shadow.
- framed-header: a pastel cap plus a white body as one bordered unit.
- badge-pill: butter, 50 px radius, 4 px shadow.
- circle-markers: bullet 20 / icon 44 / dot 48 / step 90 px.
- bullet-dot: an outlined butter disc (never glyph bullets).
- ornaments: hand-drawn SVG daisy, star, sun, cloud and rainbow, 2.1 px charcoal stroke, behind content, cropping past the frame.
- quote-mark: an oversized soft-pink Fredoka glyph.
- `→` arrows in Fredoka.
### Motion
- FRAME.md: out of scope; the source uses scroll-snap.
- Caption pop: scale 0.82 → 1 in 0.2 s, `back.out(2.6)`, "a bouncy scale pop" (the bounciest of the 13).
- If characters are used, `types/character.md` adds a hand-drawn line boil: redraw outlines ~12×/s with jitter seeded by `Math.floor(t*12)`.
### Transitions and rhythm
- Not given.
### Finish
- Sticker-on-paper: a thick outline plus a hard offset.
- No blur, no gradient, no glow; no rgba except the soft text-shadow. Zero square corners.
### 3D look
- None.
### Banned
- Square corners; blurred or rgba shadows; coloured borders.
- A coral surface; a ninth colour; a third font; crossed roles.
- Italic or underlined Fredoka; glyph bullets.
- Empty corners; two competing panels; edge-to-edge headlines.
### Example frames
1. Cover: turquoise, a centred white Fredoka display with a charcoal text-shadow under a butter badge, daisies and stars cropping off the corners.
2. Info cards: three white cards on cream.
3. Process steps: on peach, a row of 90 px step circles (coral → mint → sky → lavender) joined by arrows.
4. Quote: a white card on soft pink under a big pink quote mark.
5. Framed section: a pastel cap plus a white body with butter-dot bullets.
6. Closing: lavender with a wreath.
### Caption skin
- A cream card with a 3 px charcoal outline, a 6 px hard shadow and a 24 px radius. Padding 18/40/22 px.
- Fredoka 600 at `clamp(38px,4.2vw,56px)`, lh 1.22, 0.02em.
- Word states:
  - active: a coral candy block with a 3 px charcoal outline, a 3 px offset shadow and a 12 px radius;
  - spoken: charcoal.
### Gaps
- `FRAME.md` repeats its Known Gaps section.
- Keep muted text off pastel grounds for contrast.

## Editorial Forest (literary green, pink and cream)
- Source: `skills/hyperframes/assets/frame-presets/editorial-forest/FRAME.md` (+ `caption-skin.html`); licence: Apache-2.0
- One line: a Penguin classic, a quiet annual report or an art book. Forest green, dusty rose and oat cream. Source Serif 4 at weight 500, mono chrome, flat paper.
- Suits: books, culture, sustainability, annual reports, thoughtful brand stories. No footage or 3D.
### Palette
| role | hex | where used |
|---|---|---|
| green | `#2e4a2a` | ground for cover, statement, summary and KPI ("gravity"); headlines on cream; tiles |
| green-deep | `#243a21` | text on pink |
| green-lite | `#3a5a36` | tile fill |
| pink | `#e89cb1` | display on green at hero scale; tiles; bars; the monogram ring |
| pink-deep | `#d27e96` | caption border and active word |
| cream | `#efe7d4` | ground for content; text on green |
| cream-2 | `#e6dcc4` | tile fill with a 2 px green border |
| ink | `#1a1a17` | body on cream |
- Two surface tones per frame at most ("three is loud"). No fourth colour family; no rgba surfaces.
- Green-on-pink and pink-on-green only at display scale (84 px and up).
### Typography
- Faces, Google Fonts: **Source Serif 4** with the opsz axis (8..60). 500 for ALL display, 400 for body, 600 only for an attribution name. **JetBrains Mono 500** UPPERCASE for chrome.
- Display (Serif 500), cqw [px at 1920] / line-height / tracking:
  - title-card-sm 2.9 [56] / 0.98 / −0.01em;
  - title-card 3.5 [67];
  - headline 4.4 [84] / 1.0 / −0.02em;
  - headline-xl 5.0 [96];
  - display 7.3 [140] / 1.02;
  - display-hero 11.5 [221] / 0.92 / −0.02em;
  - stat-figure 11.5 / −0.03em, with its unit at 5.7;
  - name 2.3 cqw 600.
- Body and chrome:
  - body Serif 400 1.56 cqw [30], lh 1.38; body-card 1.35 cqw;
  - label Mono 26 px (1.35 cqw), 0.18em; caption-mono 24 px, 0.14em.
- The 500 → 400 step is "the reading rhythm".
- No italic, no underline, no third face, no serif body at 500, no mono at headline scale.
- Fit: ≤ 3 words → display-hero; 4–6 → headline-xl; 7+ → headline.
### Layout
- slide-pad 5 cqw (the source's 96–140 px). One subject per frame in deep negative space; lean left, editorial.
- Topic and step grids are the dense exception.
- 9:16: display on top with the monogram below; tiles stack; bars get taller.
### Elements
- topbar on EVERY frame: a mono label left, the monogram or counter right. It's "the spine"; without it a frame "reads untreated".
- footline: two mono strings, on cover, data and summary frames.
- monogram-circle: 130 px, a 2 px pink ring, cover and summary only.
- topic-tile: 6 px radius, rotating fills, never repeated in a grid.
- step-tile: 8 px radius, 2.5 px border.
- kpi-block: a mono tag → a 220 px serif figure → a description, over a 2 px rule.
- meta-dl: a 3-column dt/dd grid.
- bar: 56 px wide with 3 px top radius, its value above in mono.
- rule-thin: exactly 2 px (never 1, never 3+).
### Motion
- FRAME.md: out of scope.
- Caption pop: scale 0.985 → 1 in 0.18 s, `power1.out`.
### Transitions and rhythm
- Not given.
### Finish
- Flat paper. Zero shadow ("adding box-shadow shatters the paper feel"), no gradient, no glow.
- Elevation comes from colour block, 2 px hairlines, and border versus fill.
### 3D look
- None.
### Banned
- Shadows, gradients, glow.
- A third face; italic or underline; serif body at 500; mono headlines.
- A fourth colour; rgba surfaces; 1 px or 4 px+ rules.
- Two competing blocks; omitting the topbar; edge-to-edge headlines.
### Example frames
1. Cover: green, a 2-line pink display-hero left (one word in cream), a mono topbar with a 130 px monogram ring, a footline.
2. Topic tiles: 3–4 rotating fills on cream.
3. KPI: a pink 11.5 cqw figure on green over a 2 px pink rule.
4. Statement: a green serif quote on cream with a 600 name.
5. Step framework.
6. Chart: pink, cream and green bars on green.
### Caption skin
- An oat-cream card with a 2 px pink-deep border (the comment says green; the CSS fallback is `#d27e96`) and a 6 px radius, no shadow. Padding 20/44/24 px.
- Source Serif 4 500 at `clamp(40px,4.4vw,58px)`, −0.02em.
- Word states:
  - active: a quiet dusty-rose panel, 6 px radius;
  - spoken: ink.
- Accents: emphasis is a 2 px green underline.
### Gaps
- `FRAME.md` repeats its Known Gaps.
- Needs the opsz axis; a fallback without it flattens the letterforms.

---

# Part 2: Film grammars from the type guides, plus the internal house look

The type guides set grammar (structure, pacing, camera, what to show), not palettes. HyperFrames' rule is that the palette and faces come from the brand, a reference or the subject's own medium (`references/look.md`). So most Palette and Typography sections below say "not given".

## Launch Film (real product, worlds entered through objects)
- Source: `skills/hyperframes/references/types/launch.md` (+ `story.md` §3–8, `motion.md`); licence: Apache-2.0
- One line: a 20–45 s product film. A real user does a real task in the real UI; the camera punches into the control the cursor needs; each world is entered through an object already on screen; the mark lands once at the end.
- Suits: product launches, feature promos, SaaS and app reels. **Needs real footage or real screens** (recordings, screenshots, Figma, `capture`). 3D not needed (product UI is never tilted into 3D).
### Palette
- Not given; from the brand. One accent, rationed: one highlighted word, the payoff, the end card (`story.md` §7).
- Website captures: link blue `#0000EE` and status reds and greens are never the accent. The accent is the colour that recurs across the most roles (`film.md`).
### Typography
- Not given. Titles take ≤ 6 words a line, one line on screen at a time, no trailing periods (`story.md` §6).
- Title size (`motion.md`): 4–9% of frame height, 1–2 lines. Quiet lines at 2.5–4% against hero words filling 60–90% of the width. One highlighted word in the accent.
- Product text stays ≥ 26 px at 1080p after any push.
### Layout
- The camera cycles between three framings: the window on its ground, one pane, and a punch-in on one control.
- The isolated piece is shown at 1.6–2× its real size, keeping its real labels and values. Never a small window in the middle of an empty canvas.
- The result goes back into its place in the interface, or the camera pulls back to show where it's used.
### Elements
- A big cursor, 4–7% of the frame, entering from off-screen. Its click causes the next thing on the same frame.
- Containers morph instead of cutting: the button becomes the menu, the message becomes the bubble.
- A missing screen is a labelled placeholder ("Screenshot: Settings → Motion"). Never invented UI or a coloured square for an app icon.
### Motion
- Camera moves take 0.4–0.6 s with motion blur, arrive at the control the cursor needs, then hold while the UI acts.
- A demo holds one framing for 7–10 s while the UI acts (`motion.md`).
- Beat shape for ~35 s (`story.md` §4):
  - hook ~8%;
  - tension ~12%;
  - reveal ~8% (20–30% in);
  - proof ~40% (3–6 verbs: paste, pick, watch it build, ship);
  - payoff ~20% (60–80% in, the biggest moment, once);
  - claim ~8%;
  - end card ~8%.
- The process runs fast; the payoff plays at normal speed. Hold 0.3–0.75 s before the payoff.
### Transitions and rhythm
- 3–5 kinds of transition per film, each caused by something on screen (table in `## Not styles, but useful parts`). At most a third of the seams are hard cuts; worlds never crossfade.
- Several worlds (a desktop, the product on a brand gradient, a white void with a character, live action), each with its own background, light and scale. Keep one home stage, one carrier the eye follows, and constant palette and type.
### Finish
- Motion blur on fast moves: 6–12 px on text-sized elements, 15–20 px full-frame (`motion.md`). Opt-in render blur is `data-motion-blur="on"`.
- Grades, grain and vignette go through `media-treatment`, never CSS filters (`SKILL.md` contract 11).
### 3D look
- None for UI ("never product UI tilted in 3D").
### Banned
- The film defaults (see `## Taste rules`, BANNED).
- Typing into a prompt box as the opener.
- A feature list as three cards; a title over a dimmed screenshot.
- An invented dashboard; the logo docked in a corner.
- A camera move over a frozen screenshot standing in for the product acting.
- Opening lines "Introducing" or "Meet". The words "unlock", "seamless", "supercharge", "game-changer", "revolutionize", "effortless", and "in seconds" unless measured.
### Example frames
1. Hook (frame 0, never black): the feature already working on something recognisable.
2. Tension: the old way failing (the wait, the wall of text).
3. Proof: a punch-in on one control at 1.6–2×, the big cursor clicking.
4. Payoff: the output arriving already moving, full frame.
5. End card: in the last 5–10%, a centred lockup at 15–30% of the frame width, performed (the cursor clicks the mark and a fill rises through it, or a character carries it in), the wordmark wiping in, then the CTA held 1.5–3 s.
### Gaps
- No palette or faces by design.
- "Effects-heavy pieces drew about a tenth of the views" is the vendor's own observation.

## Explainer (one diagram that grows)
- Source: `skills/hyperframes/references/types/explainer.md` (+ `film.md` "Script and pacing"); licence: Apache-2.0
- One line: one idea, understood by the end, through one concrete worked example. It starts in a situation the viewer knows and builds a single diagram part by part as the voice names each part.
- Suits: how-it-works, tutorials, science and tech explainers, 30–90 s. Footage optional; 3D optional (the object as explanation).
### Palette
- Not given.
### Typography
- Narrated: about 19 spoken words per scene (9 s); at most two scenes reach 26 words (12 s). TTS reads ~2.2 words/s; 30–90 s is ≤ ~155 words; a whole film ≤ ~400 (`film.md`).
- Not narrated: large lines of up to ~10 words, each held 0.5 s + 0.3 s a word.
- Labels sit on the part they name (a leader line if needed) and appear with it. No legends.
### Layout
- Grounded opening: a person, place or situation plus the question they'd ask.
- The abstract device enters inside that situation; the film returns to the person with the answer.
### Elements
- Devices:
  - the object is the explanation (machine, model, map, light clock, drawn so it reads as what it is: material, mount, setting);
  - one diagram that grows;
  - continuous transformation (a bar becomes an axis, a dot becomes a population);
  - one real input travelling through every step.
- "Shapes of information", each with its own picture:
  - a number lands;
  - a myth struck through and the right idea printed over it;
  - before / after; many things converging into a few groups;
  - a network that densifies; one chosen out of many;
  - steps in order; a real screenshot with the detail circled;
  - a quote set as a poster; a chapter card.
### Motion
- Reveal each part when the voice names it, across the back half of the scene.
- Everything shown in the first quarter and then frozen "reads as a slideshow" (`film.md`).
- Camera: cutaways, an exploded view, a dive into the part that matters.
### Transitions and rhythm
- Each step morphs out of the last so the thread is never lost to a cut.
- Something new every 2–4 s (`spec.md`).
### Finish
- Not given.
### 3D look
- Optional: a machine or model toured by the camera (see 3D Hero Object).
### Banned
- A slide of bullets; icons in circles; three cards in a row.
- The whole diagram at once; a narrator repeating the screen text word for word.
- A finished diagram dropped on screen; a brand end card unless asked.
- "A beautiful wrong diagram is worse than none."
### Example frames
1. A person in a known situation with the question on screen.
2. The simplest true diagram, one part.
3. The same diagram with the newly named part labelled on itself.
4. The cutaway or dive into the key part.
5. The person again; the one idea in one line.
### Gaps
- No palette, type faces or timings beyond the word counts.

## Music Film (song structure as edit structure, physical medium)
- Source: `skills/hyperframes/references/types/music.md` (+ `film.md` "On music", `motion.md` beat grid); licence: Apache-2.0
- One line: the song is the structure. Sections become chapters; each lyric line gets its own picture; one strong physical medium (watercolour, cut paper, risograph, film grain) instead of effects.
- Suits: music videos, lyric films, beat-cut montages. Footage if the song is about something real; otherwise one medium-built world. 3D optional.
### Palette
- Not given; from the medium.
### Typography
- Lyrics only when asked. Then each line holds at least a beat and is set as type, not subtitles.
- A word meant to be read holds ≥ 1 beat.
### Layout
- One home stage for the chorus, escalating each return. The ending rhymes with the opening.
### Elements
- Show what the line means, not the line itself.
### Motion
- Cut density follows energy:
  - slower shots in verses;
  - one picture per strong beat in the chorus;
  - a held image on a breakdown;
  - shots ~1.4–4 s.
- Beat maths: frames per beat = fps × 60 / BPM. Compute each beat from its index and round it; never add a rounded beat repeatedly (at 128 BPM and 30 fps that drifts 2 frames in 32 beats). Cut on the beat; change the layout on the bar.
- Hit timing:
  - a move that must land on a hit starts 40–190 ms early; a reaction starts 0–45 ms after;
  - the hit itself is a 0 ms `tl.set` ("easing a hit kills it").
- Any single treatment goes stale after ~6 s: add a hold or a new treatment, never slower tweens.
- Footage: one clip per strong beat on rhythmic sections. On calm ones, one slow push from 1.0 to 1.08.
- Trust beat times only on rhythmic stretches. On calm music the tracker invents a metronome, often at double tempo (check `bpmConfidence`).
### Transitions and rhythm
- Chapter breaks land on section boundaries, with a transition that belongs to the medium (a brush wipe, a paper tear, a match cut).
- Scenes tile the track with no gaps.
- Library loops: loop the bed with a 0.4 s fade-in and 1.5 s fade-out. Start from a stronger later section if the opening is a quiet build.
### Finish
- The medium carries it (watercolour with ink outlines, cut paper, risograph, film grain on footage).
### 3D look
- Optional.
### Banned
- The same treatment for more than ~6 s.
- A spectrum bar or waveform as the main picture.
- Every cut on every beat; words about the music instead of the song's world.
### Example frames
1. Intro: the home stage in the medium.
2. Verse line: a literal picture of the line's meaning.
3. Chorus: the home stage escalated, a cut per strong beat.
4. Breakdown: a held image.
5. Outro: rhymes with the opening frame.
### Gaps
- No palette or type numbers.

## Data Story (one number at a time)
- Source: `skills/hyperframes/references/types/data.md` (+ `film.md` "Short motion pieces"); licence: Apache-2.0
- One line: each number is earned by the scene before it, then made physical (a count that becomes a skyline, a share that becomes a crowd). The number is the biggest thing on screen.
- Suits: stat reels, report highlights, charts in films. No footage or 3D needed.
### Palette
- Not given. Highlight one series and grey the rest.
### Typography
- The number is the biggest thing on screen, in tabular figures (`font-variant-numeric: tabular-nums`) so a count-up doesn't jitter.
- A small source line on screen. A chart with one thing to say says it in its title.
### Layout
- Build in reading order: frame and axis → reference line → data drawing in → one annotation on the point that matters. Annotate on the mark; no legends.
### Elements
- The same object carries across beats: a bar becomes the ground of the next scene; a line becomes the road the camera follows.
- Registry charts first.
### Motion
- A count-up runs 1.2–1.6 s, then holds, landing on a downbeat or a hard stop.
- The camera can dive into the one value that matters, then the rest falls away.
- Drive any chart library from a GSAP tween's `onUpdate`, never its own transitions.
### Transitions and rhythm
- Object carries; something new every 2–4 s.
### Finish
- Not given.
### 3D look
- None.
### Banned
- A grid of KPI cards; a dashboard; a pie chart.
- Every number counting up at once; numbers with no source.
- Invented or re-derived claims ("40 min to 2 min" is not "20× faster"; `story.md` §1).
### Example frames
1. The setup scene that earns the number.
2. The count-up landing at full size with a source line.
3. The number made physical (a skyline of bars).
4. A bar becoming the ground for the next scene.
### Gaps
- No palette or face given.

## Vertical Social (9:16)
- Source: `skills/hyperframes/references/types/vertical.md` (+ `overlays.md`, `captions.md`); licence: Apache-2.0
- One line: recomposed for the phone, not squeezed. The hook is on frame 0, one centred subject stacked vertically, big type inside the platform-safe band, 1–2 s shots.
- Suits: Reels, Shorts, TikTok, the engine's default 1080×1920. Works with or without footage.
### Palette
- Not given.
### Typography
- Larger than landscape: titles ~×1.35; portrait type in general = landscape × 1.3; stats × 1.4 (`overlays.md`).
- Nothing meant to be read under 28 px.
- Word limit per claim line: ~5 English words or ~8 Chinese characters. "Cut words, never shrink."
- Captions (`captions.md`):
  - `fitTextFontSize` with maxWidth 900 portrait, base 78, minimum 42, step 2;
  - portrait captions sit about 600–700 px from the bottom.
### Layout (1080×1920)
- Nothing in the top 168 px (status and search bar).
- Every word and the product inside the band from **168 to 1330 px**.
- Below 1330 px only texture or decoration (caption, handle, buttons). No text under the right-hand action rail.
- Ads and some apps reserve more at the bottom.
- Burned-in captions sit at the bottom of the band.
- General safe boxes (`SKILL.md`): content inside the 90% action-safe box; captions and key text inside 80% title-safe.
- Landscape layouts (side-by-side panels, wide charts) are rebuilt as a vertical sequence.
- Portrait overlay placements (`overlays.md`):
  - split: video at 0, 960, 1080×960;
  - stack: video at 0, 0, 1080×844;
  - PiP: 28 px margin, 16:9 source at 690, 28, 360×203; 9:16 source at 738, 28, 312×555;
  - side panel: the bottom 40%; glass card slot: 24, 1280, 1032×564;
  - padding 24–36 px.
### Elements
- Talking heads: punch-ins on emphasis, B-roll cut on the sentence, the face never under a card.
### Motion
- Shots 1–2 s; a new beat every 2–4 s; the payoff before the swipe.
- The viewer decides in about a second, so the change or question arrives in the first beat.
### Transitions and rhythm
- A loop that cuts from the last frame back to the first is a choice, not a default.
### Finish
- Many watch muted: speech is captioned and the picture carries the hook without sound.
### 3D look
- Not given.
### Banned
- Black or logo-only frame 0.
- A landscape film squeezed into 9:16.
- Text in the top 168 px or below 1330 px; text under the action rail.
### Example frames
1. Frame 0: a face, the result, or one bold ≤ 5-word line already on screen inside 168–1330 px.
2. A punch-in on the speaker with a caption at the band's bottom.
3. A stacked split: footage at the top (1080×844), a card below.
4. The payoff before ~the swipe point.
### Gaps
- Conflict: `captions.md` says portrait captions sit ~600–700 px from the bottom (y ≈ 1220–1320), but the internal `captions-overlay` skill says captions are an overlay around the bottom 5–8% and nothing is reserved. For 9:16 the vertical guide's 1330 px floor should win.

## 3D Hero Object (warm key, cool rim, one dive)
- Source: `skills/hyperframes/references/types/3d.md` (+ `runtimes.md`, `spec.md` word table); licence: Apache-2.0
- One line: one hero object or set as the payoff, lit like a product studio, flown *into* rather than orbited. Simulated once, so every frame is a pure function of time.
- Suits: product hero shots, simulations that explain, generative payoffs. **Needs 3D** (Three.js or WebGPU there; Blender here).
### Palette
- Not given. The environment is dark with 2–3 soft strips.
### Typography
- Chapters with one caption line each, plus labels carrying real numbers.
### Layout
- One hero object beats a crowd.
- The hero fills ≥ 40% of the frame's height or width (`spec.md`).
### Elements
- Cutaways, exploded views, labels with real numbers.
### Motion
- "One dive is worth ten turns": fly through or into the object.
- A slow orbit of a background stage at 3–5° a second is allowed continuous motion (`motion.md`).
- Turn the environment, not the object, so highlights sweep across it.
### Transitions and rhythm
- Not given beyond the general rules.
### Finish
- Bloom only on the brightest points ("bloom eats detail").
- One NaN pixel turns a whole frame black through bloom: clamp values that can divide by zero.
### 3D look
- Lighting: a warm key, a cool rim, a dark environment with 2–3 soft strip lights, a contact shadow under the object.
- Metal: glossy metal under low light streaks white, so roughness ≈ 0.45 or more and environment intensity ≈ 0.5.
- `spec.md` numbers:
  - "premium" = a product on a seamless sweep with a 0.55 contact shadow, or chrome at roughness 0.05;
  - "cinematic" = a 35 mm framing, a key from upper left, a rim from behind, 6% vignette.
- Determinism: simulate once at load (physics, agents, particles) into arrays; seed every random choice; `render(t)` is pure.
### Banned
- Product UI tilted into 3D.
- Orbiting as the main move; bloom on everything.
- `Math.random()`.
### Example frames
1. The hero object on a dark stage, warm key from upper left, cool rim, contact shadow.
2. The camera diving into the part that matters.
3. An exploded view with numeric labels.
4. The payoff: the object full frame.
### Gaps
- No palette hex or focal lengths beyond 35 mm.

## Character Short (acting, hand-drawn boil)
- Source: `skills/hyperframes/references/types/character.md`; licence: Apache-2.0
- One line: a mascot or character gives every transition a cause and the film its jokes. Real acting (anticipation, squash, settle), parts offset, and hand-drawn outlines that "boil" ~12 times a second.
- Suits: mascot shorts, story shorts, playful explainers. 2D (Lottie or a code rig); no footage needed.
### Palette
- Not given. Pairs naturally with Daisy Days.
### Typography
- Not given.
### Layout
- Lead the eye to where the action will happen.
### Elements
- A rig is parameters over time: position, squash, arm angles, an eye state and a mouth state.
- Mood changes are keyed states, e.g. `[[t0,"normal"],[t1,"scared"]]`, that the rig eases between.
### Motion
- A mood change goes through a take: anticipation → squash → the new face → settle. A face never snaps.
- Squash and stretch, anticipation, overshoot and follow-through belong to the character. Here an idle breath or blink is life, not a tell.
- Offset the parts (the head leads, the arms follow) and vary the amounts. Never move both arms, both eyes or a crowd in unison.
- Contact sells it: feet on the ground, props in the hand, eyes on what they look at.
- Each action is one read: play the action fast, let its meaning land slowly, hold the reaction.
- Line boil: redraw outlines ~12×/s with jitter seeded by `Math.floor(t * 12)`.
### Transitions and rhythm
- The character carries the result into the player, rejects its own first try, reads the manual.
- A long piece is one chapter per sub-composition sharing one rig.
### Finish
- The hand-drawn boil.
### 3D look
- None.
### Banned
- A sign or caption repeating what the action already shows ("the classic failure").
- Every part moving at once on one curve.
### Example frames
1. Anticipation pose before the action.
2. The action mid-squash.
3. The held reaction.
4. The character carrying the result into the next world.
### Gaps
- No palette, faces or sizes.

## Risograph Print (look built from a medium)
- Source: `skills/hyperframes/references/spec.md` "A look built from a medium"; licence: Apache-2.0
- One line: the worked example of building a look from one medium's rules rather than a palette. Flat paper with fibre noise, one reading ink, one fluorescent accent, overprint and halftone.
- Suits: editorial, music, culture, data. No footage or 3D. Cobalt Grid is a full preset version of this idea.
### Palette
- Five parts and nothing else:
  - paper: one flat colour with fibre noise, no gradients;
  - ink A: every word that must be read and every structural line;
  - ink B: one fluorescent accent, one focus per frame (the number, the bar, the stamp);
  - overprint: where inks overlap a third colour appears;
  - halftone: every gradient is dots.
- Hex not given.
### Typography
- Not given.
### Layout
- Not given.
### Elements
- The B plate sits **3 px off register**.
### Motion
- From the medium: "the frame is printed, plate by plate, not faded in".
- Other media in the same spirit: "paper is cut and lifted, ink is printed, glass refracts, clay is pressed".
### Transitions and rhythm
- Not given.
### Finish
- Fibre noise, halftone dots, misregistration.
### 3D look
- None.
### Banned
- Gradients (except as halftone dots).
### Example frames
1. A paper ground with ink A type and one ink B number.
2. The B plate printing onto the A plate 3 px off.
### Gaps
- Thin: no hex, faces or timings.

## HyperFrames Weekly (internal house look: dark glass, rationed green)
- Source: `.claude/skills/changelog-video/SKILL.md`, `references/build-spec.md`, `references/script-voice.md`, `references/visualization-registry.md`, `examples/master-skeleton.html`; licence: Apache-2.0 (the bundled brand fonts are commercial faces; their licence isn't stated in what I read)
- One line: HeyGen's weekly changelog. 1080×1080, 45–60 s. A darkened animated pattern background, near-black glass cards with green-tinted hairlines, ONE green moment per scene, a calm VO with a quiet one-line caption rail, mock UI acting out each change.
- Suits: changelogs, release recaps, dev-tool updates. Needs a pattern video and mock UI; no 3D.
### Palette
| role | hex | where used |
|---|---|---|
| bg | `#0a0c0b` | page |
| ink | `#f5f6f4` | display, active progress dot |
| ink2 | `rgba(245,246,244,.72)` | chips, kicker text |
| dim | `rgba(245,246,244,.66)` | the minimum for small text ("NOT .45: the contrast gate fails") |
| green | `#5ef17c` | RATIONED: one moment per scene (rule sweep, progress fill, ✓, snap-line flash) |
| chip-bg / glass fill | `rgba(10,12,11,.78)` | glass cards |
| glass-line | `rgba(190,255,205,.32)` | 1 px card border |
| chip | `rgba(255,255,255,.05)` fill, `rgba(255,255,255,.14)` border | kicker and section chips |
| scrim | `rgba(8,10,9,.25)` | over the background video |
- Background: the bundled pattern looped and encoded with `eq=saturation=0.72` and `drawbox=c=black@0.5:t=fill` ("the raw pattern is far too loud").
### Typography
- Faces: **ABC Solar Display 700** (display) and **TT Norms Pro** 400/500/700 (body), **TT Norms Mono** (code, UI labels, chips). None are Google Fonts; all are bundled woff2.
- Sizes at 1080×1080:
  - title h1 ~104 px;
  - theme headline 54 px, −0.01em;
  - outro "See what shipped." ~96 px;
  - chips mono 18–22 px (kicker 20 px .06em; section chip 22 px .05em);
  - terminal mono 19–20 px;
  - caption rail TT Norms Pro 500 32 px, .01em, ink at .94.
- Captions: ≤ ~40 characters a line; script sentences ≤ ~14 words.
### Layout
- Safe margins x and y in [76, 1004].
- Chrome:
  - kicker chip top-left (44, 76): `HYPERFRAMES WEEKLY · <RANGE>`;
  - progress dots top-right (8 px; active `#f5f6f4`, done .45, idle .18).
- Theme scene:
  - section chip `0N · THEME NAME` at top 128;
  - headline at top 186;
  - the mock fills y 288–944.
- Caption rail at top 990, height 52, centred.
- Budget: title ≤ 2 s, outro ≤ 3.5 s, 4 themes at ≈ 9–12 s each; one hero visualisation and ≤ 3 spoken items per theme; ≤ 14 spoken beats in total.
### Elements
- Glass card: radius 22, `box-shadow: 0 24px 60px rgba(0,0,0,.5)`, NO backdrop-filter. Chips: radius 12.
- Visualisation routing, strongest first: ui-recreate → ui-analog → terminal → checklist.
- Proven mocks:
  - Studio timeline;
  - inspector;
  - canvas;
  - variant cards;
  - storyboard row;
  - terminal (chars type at 0.02 stagger, the result after a 0.3–0.5 s beat);
  - render panel (tabular counter + bar on `power2.in`, "slow→fast reads as faster").
- Checklist (last resort): ≤ 6 mono rows; green ✓ landing on each VO word with `back.out(1.5)` over 0.3 s.
### Motion
- All ordinary seams are cut-the-curve LEFT, stamped from `ledger.json`; the outro entry travels 8.
- Inside a scene:
  - reveals start ≥ 0.4 s after the cut and end ≥ 0.45 s before the next cut (stamped exits begin at cut − 0.34 s);
  - every beat lands on a VO word.
- Kicker in: `y`→0, autoAlpha 1, 0.5 s `power3.out`.
- Caption words fade in over 0.12 s `power1.out` on their timestamps; phrase swaps are sets.
- Outro: fade everything plus the chrome ~0.5 s before the end.
### Transitions and rhythm
- One current (LEFT).
- Sound: VO at 1.0; BGM at 0.14 (the house track is 159 s).
### Finish
- A dark crushed pattern video plus a scrim; glass cards with a deep soft shadow.
### 3D look
- None (the video must stay flat 2D, no 3D ancestors).
### Banned
- Bullet slides for UI changes; fake UI for things that can't be represented.
- Green everywhere.
- Hand-made `@font-face`, WebGL shader backgrounds, custom BGM, or starting from a prior video's `index.html`.
- Phonetic spellings in captions.
### Example frames
1. Title: a mono date kicker, a ~104 px ABC Solar title, a green rule sweeping in.
2. Theme: section chip + headline + a glass Studio-timeline mock with a green snap-line flash.
3. Terminal mock typing a command.
4. Outro: "See what shipped." with a green rule and a mono URL chip.
### Gaps
- The brand fonts aren't free or Google Fonts; we'd swap in Google faces.
- Its dark ground is close to the BANNED "dark void"; the busy pattern video is what keeps it from being empty.
- The skill also includes an internal CDN invalidation step, which isn't relevant to us.

---

# Part 3: Registry example styles (`registry/examples/*`)

These are the 8 example projects in the registry; 6 of them are distinct looks. Most are talking-head overlays: an A-roll video with stat graphics and captions on top, driven by one transcript. I read their `index.html` and `compositions/*.html` for values. They're examples, not doctrine, and some break the skill's own rules (noted under Gaps). `decision-tree` and `product-promo` weren't read in depth: they're a flowchart and a Figma-asset promo, not distinct looks.

## Vignelli Talking Head (vertical, red on white)
- Source: `registry/examples/vignelli/` (`index.html`, `compositions/overlays.html`, `compositions/captions.html`); licence: Apache-2.0
- One line: Massimo Vignelli on a phone. A white ground, a hidden 6-column grid, heavy Helvetica, one red, charcoal full-screen stat takeovers and curtain-wipe cuts over a talking head.
- Suits: vertical talking-head reels with stats, survey results, founder videos. **Needs real footage (A-roll).** No 3D. **Native 1080×1920**, the only vertical example.
### Palette
| role | hex | where used |
|---|---|---|
| ground | `#ffffff` | page, stat cards, caption box |
| red | `#cc0000` | 20 px stat bar, 180 px right column on the takeover, highlight text, 8 px caption top border, logo underline, red curtain |
| charcoal | `#1a1a1a` | full-canvas stat ground, black curtain |
| black | `#000000` | type, 10 px side bar |
| grid guide | `rgba(204,0,0,0.1–0.2)` | 1 px column lines (hidden, opacity 0) |
### Typography
- Face: "Helvetica Neue" / Helvetica / Arial. Not a Google Font; HyperFrames swaps system fonts for the nearest bundled face. A Google stand-in would be needed (my suggestion: Inter or Archivo, not from the source).
- Sizes at 1080×1920:
  - stat number 120 px 900, −2 px;
  - label 32 px 700 UPPERCASE;
  - takeover number **400 px** 900, line-height 0.8, −10 px, white; takeover label 80 px 700 uppercase, max-width 600;
  - right stat text 48 px 700 right-aligned, highlight 64 px 900 red;
  - wordmark 64 px, letter-spacing 10 px, 900;
  - captions 64 px 900 UPPERCASE, −0.02em, lh 1.1.
### Layout
- A 6-column grid on 1080 (180 px columns); content inset 90 px.
- Stat card: bottom 200, left 0, 540×240 (3 columns).
- Right stat: top 400, 360 wide (2 columns), placed in columns 5–6 "to avoid face (x: 300-776)".
- Takeover: full canvas with a 1-column red bar on the right.
- Wordmark: bottom 100.
- Captions: bottom 672 px, max-width 920.
### Elements
- Flat cards with a coloured bar edge (20 px red, or 10 px black).
- A full-canvas charcoal stat takeover; an 8 px red underline under the wordmark.
- Curtain panels (black, red) for cuts.
### Motion
- Side stats slide in from off-screen along the grid (x −540 → 0 or +360 → 0) over 0.8 s `expo.out`, and leave the same way in 0.6 s `expo.in`. The exit ends exactly on the word that closes the stat.
- Takeover:
  - the charcoal ground slides from x 100% in 0.8 s `expo.out`, the red column follows +0.1 s later;
  - the number rises y 100 → 0 with a fade over 1 s `expo.out` (+0.3 s), the label y 50 → 0 (+0.5 s);
  - exit: x −100% over 0.8 s `expo.in`.
- Wordmark: y 20 → 0 over 0.6 s `expo.out`, then the underline scaleX 0 → 1 over 0.8 s `expo.out` (+0.2 s).
- Captions: y 20 → 0 with opacity over 0.4 s `expo.out`. Exit y −10 over 0.3 s, ending at the group end, then a hard `visibility: hidden` kill.
- Every stat is timed to transcript words (start on "Forty-seven", end on "graphics").
### Transitions and rhythm
- Curtain pull:
  - a black panel wipes in over 0.2 s `power2.inOut` (xPercent −100 → 0);
  - the A-roll is hidden under it, then the panel wipes off over 0.4 s;
  - the return uses a red curtain.
- The A-roll leaves the screen at least once (for the takeover).
### Finish
- Flat: no shadows, no gradients, no radius.
### 3D look
- None.
### Banned
- Not stated. Implied by the look: no second accent, nothing over the face.
### Example frames
1. A talking head full-frame with a white stat card bottom-left (red bar, "47%" 120 px, "MOTION GRAPHICS").
2. A full charcoal takeover: "62%" at 400 px white, "STATIC CONTENT" 80 px, a red column on the right.
3. The talking head with a right-side 2-column text block, "3 out of 4" in red.
4. The wordmark "HYPERFRAMES" with the red underline drawing.
5. A caption: a white box with an 8 px red top rule, black 64 px caps.
### Gaps
- The captions centre with `left:50%; transform:translateX(-50%)`, which `captions.md` says clips at the frame edges.
- Caption bottom at 672 px puts the text around y 1150–1250, inside the 168–1330 band.

## Swiss Grid Talking Head (navy and gold on a 12×12 grid)
- Source: `registry/examples/swiss-grid/` (`index.html`, `compositions/graphics.html`, `captions.html`, `intro.html`); licence: Apache-2.0
- One line: International Typographic Style. A light grey ground with a visible grid, the talking-head frame snapping between grid positions, gold stat blocks with hard tinted shadows, navy caption bars.
- Suits: corporate or explainer talking heads, survey stats. **Needs A-roll footage.** 1920×1080.
### Palette
| role | hex | where used |
|---|---|---|
| ground | `#f2f2f2` | page, stat cards, caption text |
| navy | `#0a1e3d` | text, borders, caption bar, intro ground |
| gold | `#d4a017` | stat values, 10 px left border, progress fill, blocks |
| grey | `#e0e0e0` | progress track |
| intro paper | `#f5f5f5` | intro |
- Hard shadow: `20px 20px 0px rgba(10,30,61,0.1)`.
### Typography
- Face: Helvetica / Helvetica Neue (not a Google Font).
- Intro: title 180 px 900, −0.04em, UPPERCASE; subtitle 64 px **300**, 0.1em uppercase.
- Stat value 140 px 900 gold, lh 0.8. Label 24 px **300**, 2 px tracking, uppercase, navy.
- Captions: bold 72 px uppercase, −2 px.
- Heavy-versus-light weight contrast is the system.
### Layout
- A 12×12 CSS grid, 80 px padding, 20 px gaps.
- Stats occupy columns 2–6 or 7–12, rows 3–7.
- The A-roll frame (radius 8, `0 20px 40px rgba(0,0,0,.3)`) moves between grid slots:
  - 960×840 centred;
  - 720×720 right;
  - 780×780 right, nudged up;
  - 720×720 left;
  - final 1440×810.
- Captions at bottom 120.
### Elements
- A stat card with a gold left border and a hard shadow.
- A 24 px progress bar with a 2 px navy border.
- 80 px square blocks with a 3 px navy border, gold or navy, as a "3 of 4" pictogram.
### Motion
- Stat slides: ±200 px in 0.25 s `power2.out` in and `power2.in` out. Direction varies per stat (from left, from below, from right).
- The progress bar fills linearly (`none`) across the whole stat window.
- Blocks pop: scale 0 → 1, 0.3 s, stagger 0.1, `back.out(1.7)`.
- A-roll repositions in 0.25 s `expo.out` (the final one 0.5 s). Entrance from x −1000 in 0.8 s `power2.out`.
- Intro: 0.4 s `power4.out`, then "mechanical" `power2.inOut` moves.
### Transitions and rhythm
- The frame jumps on each stat's first word; quick 250 ms "sharp" moves.
### Finish
- A flat grid SVG background; hard tinted offset shadows.
### 3D look
- None.
### Banned
- Not stated.
### Example frames
1. Intro: a navy 180 px uppercase title.
2. The talking head right, a gold "47%" card left.
3. The talking head left, "3 OF 4" with four blocks (3 gold, 1 navy) right.
4. A navy caption bar at the bottom.
### Gaps
- Landscape only. Helvetica needs a Google stand-in.

## Warm Grain Talking Head (cream, forest, ochre, grain)
- Source: `registry/examples/warm-grain/` (`index.html`, `compositions/*.html`); licence: Apache-2.0
- One line: warm and organic. A cream ground under a film-grain overlay, a rounded talking-head frame drifting between positions, soft rounded colour shapes (forest circle, ochre pill, terracotta card) that spring in.
- Suits: wellness, lifestyle, creator talking heads. **Needs A-roll footage.** 1920×1080.
### Palette
| role | hex | where used |
|---|---|---|
| cream | `#f5f0e0` | ground; text on the green card and caption |
| forest green | `#3b5e3a` | intro card, circle shape |
| ochre | `#cc8832` | subtitle, pill shape |
| terracotta | `#c45d3e` | card shape |
| brown | `#7a6248` | caption pill |
| white 90% | `rgba(255,255,255,0.9)` | secondary text on shapes |
### Typography
- Faces: **Outfit** (Google, bundled in HyperFrames) for the page and graphics; **Inter** (Google) for intro and captions.
- Intro title 100 px 600, −2 px; sub 50 px 400 ochre.
- Shape text 80 px 700, −2 px and 54 px, −1 px; small 36 px 400.
- Captions Inter 700 48 px cream on brown.
### Layout
- A-roll framing strategy:
  - 0–1.8 s: 60% → 80% scale;
  - shift left (x 600, 70%) for stat 1;
  - centre-bottom (y 800, 70%) for stat 2;
  - right (x 1320, 75%) for stat 3;
  - full 100% at the end.
- The A-roll frame has radius 16 and a `0 10px 30px rgba(0,0,0,.1)` shadow.
### Elements
- Intro card: radius 30, `0 15px 40px rgba(0,0,0,.2)`.
- Shapes: a circle, a pill (radius 110), a card (radius 40).
- Caption pill: radius 24, `0 4px 15px rgba(0,0,0,.2)`.
### Motion
- A-roll moves: 1.8 s and 0.5 s, `power2.inOut`; the final reveal 1.0 s.
- Shapes enter from a small offset (±40 / ±15 px) at scale 0.8 → 1 over **1.2 s `back.out(1.7)`**. Exit scale 0.8 over 0.3 s `power2.in`.
- Intro card: 0.8 s `power2.out` in, 0.6 s `power2.in` out.
- Captions: 0.1 s in and out.
### Transitions and rhythm
- Soft, continuous reframing of the A-roll; no hard cuts.
### Finish
- Grain overlay at opacity 0.15, jumping position every 0.5 s with `steps(1)`.
- Soft diffuse shadows; generous radii.
### 3D look
- None.
### Banned
- Not stated.
### Example frames
1. A forest-green intro card with a cream 100 px title and an ochre subtitle, over grainy cream.
2. A rounded talking-head frame at 70% left, an ochre pill with a stat right.
3. A brown caption pill, cream Inter 700.
### Gaps
- Its grain uses a CSS `animation: … infinite`. That breaks the skill's own rule ("Finite repeats only"; CSS keyframes need finite iterations, `runtimes.md`). Our version needs a seeded per-frame grain.

## Play Mode (elastic candy pop)
- Source: `registry/examples/play-mode/` (`index.html`, `compositions/intro.html`, `stats.html`, `captions.html`); licence: Apache-2.0
- One line: loud and toy-like. Nunito Black, hot pink, electric blue, yellow and chartreuse; everything springs with elastic overshoot; the background floods colour.
- Suits: playful social content, kids or gaming, energetic talking heads. **Needs A-roll footage.** 1920×1080.
### Palette
| role | hex | where used |
|---|---|---|
| hot pink | `#ff2d8a` | intro title, stat accents, caption pill |
| electric blue | `#0057ff` | background flood, stat |
| yellow | `#ffe500` | stat shape |
| chartreuse | `#7fff00` | stat shape |
| white | `#ffffff` | ground, 8 px video border, title drop-shadow |
### Typography
- Face: **Nunito** 900 (Google, bundled).
- Intro 180 px UPPERCASE with `drop-shadow(8px 8px 0 #fff) drop-shadow(15px 15px 0 rgba(0,0,0,.1))`.
- Stat numbers 180 px 900; labels 48 px.
- Captions 64 px 900 on a pink pill (radius 16, `0 10px 30px rgba(0,0,0,.2)`).
### Layout
- The talking-head container has an 8 px white border, radius 16 and `0 20px 60px rgba(0,0,0,.4)`. It moves and scales between 1.4× (x −300), 0.7× (x +400) and 0.9×.
### Elements
- Blob shapes (`border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%`); circles; pills (radius 35–100).
### Motion
- Container: drops in with `elastic.out(1, 0.6)` over 1.2 s; rescales with `back.out(1.7)` over 1 s.
- Background colour floods to `#0057FF` (and back to white) over 0.5 s.
- Intro title: scale 0 → 110% → 100% with `elastic.out(1, 0.3)`, plus one `sine.inOut` yoyo (repeat 1).
- Stats: `elastic.out(1, 0.6)` in, `back.in(1.7)` out.
### Transitions and rhythm
- The colour flood marks each new stat.
### Finish
- Hard white offset drop-shadows on type; soft drop-shadows on cards.
### 3D look
- None.
### Banned
- Not stated.
### Example frames
1. A giant hot-pink "PLAY" bouncing in with a white offset shadow.
2. The talking head shrunk to 0.7× right on an electric-blue flood, a yellow blob with a 180 px stat left.
3. A pink caption pill.
### Gaps
- It uses elastic and bounce, which the internal `motion-doctrine` forbids (`bounce.out` / `elastic.out`). `motion.md` allows springs "0.4-0.6 playful" on position and scale only. Treat it as a deliberately playful outlier.

## NYT Print Chart (editorial data graphic)
- Source: `registry/examples/nyt-graph/compositions/nyt-chart.html`; licence: Apache-2.0
- One line: a newspaper chart. Off-white paper, a Libre Baskerville headline wiping in, Libre Franklin labels, grey bars plus one blue line, hairline gridlines, a source line.
- Suits: data stories, news-style explainers. No footage or 3D. 1920×1080.
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#faf9f6` | ground |
| text | `#333` | headline and body |
| muted | `#737373` / `#666` | subtitle, source, axis labels |
| bars | `#5c5c5c` | bar series |
| line | `#326fa8` | the one highlighted series, 1.5 px |
| gridlines | `#e8e8e8` | 0.5 px |
### Typography
- Faces: **Libre Baskerville** (headline 42 px) and **Libre Franklin** (subtitle 16 px, axis 14 px, key 13 px, source 11 px, weight 600 for emphasis). Both Google Fonts.
### Layout
- A left-aligned header (headline, subtitle, key) over a 1600×900 chart scaled 1.15; the source sits bottom-left.
### Elements
- A key with a 10 px box and a 16×1.5 px line swatch; gridlines; bars; a line; a source note.
### Motion
- The headline and subtitle reveal by `clip-path: inset(0 100% 0 0)` → 0 (a left-to-right wipe).
- Mostly `power2.out` at 0.8–1.2 s. Bars stagger 0.25.
- The line draws over 3 s, linear, segment by segment (3 / months).
### Transitions and rhythm
- Reading order: header → key → grid → bars → line → source.
### Finish
- Flat print.
### 3D look
- None.
### Banned
- Not stated. `data.md` adds: no legends (this example has a key, which contradicts it).
### Example frames
1. The headline wiping in over blank paper.
2. Grey bars rising with a blue line drawing across them.
### Gaps
- Its text sizes (11–16 px, about 13–18 px after the 1.15 scale) are below HyperFrames' own 28 px floor (`text_below_floor`). It's a print look that needs re-sizing for video.

## Kinetic Type Sampler (Swiss / Wes Anderson / Vignelli in one promo)
- Source: `registry/examples/kinetic-type/compositions/main-graphics.html`; licence: Apache-2.0
- One line: a 15 s dark promo that flips through typographic homages: a Swiss panel with a rotated square and circle, a "Wes Anderson" symmetric scene with a rule, and a Vignelli title.
- Suits: reference for kinetic-type moves only. No footage needed (one A-roll section is hidden for the Wes Anderson scene).
### Palette
| role | hex | where used |
|---|---|---|
| ground | `#0a0a0f` | page |
| cyan | `#00e5ff` | accents |
| red | `#e53935` | Swiss shapes |
| gradient | `#f24e1e → #a259ff` | a shape fill (these look like Figma's brand colours) |
### Typography
- **Inter** 900 and 400; **Playfair Display**. Sizes 120, 48, 44, 32 px.
### Layout
- Not given.
### Elements
- A Swiss panel, a square rotated 45°, a circle, a glyph wipe, line rules.
### Motion
- Hook: "What if" y −30 over 0.8 s `power3.out`; "motion graphics" scale-in with `back.out(1.7)` over 0.8 s.
- Swiss panel: in over 0.8 s `expo.out` (xPercent 0), out to xPercent 120 over 0.7 s `expo.in`. Square rotates 45° with `back.out`.
- Glyph wipe: width 100% over 1 s `power2.inOut`; lines stagger 0.2.
- Rules grow to 300–400 px in 0.4–0.6 s.
### Transitions and rhythm
- Scene flips at ~2.3, 6.2, 11.7, 13.8 s.
### Finish
- Not given.
### 3D look
- None.
### Banned
- Not stated.
### Example frames
1. "What if" rising on near-black.
2. A red Swiss panel sliding in with a rotated square.
### Gaps
- Thin. A dark ground plus a purple gradient puts it in the BANNED defaults ("dark void", "purple… gradients").

---

## Taste rules

Rules that hold whatever the style. They're numbered (T1…) so the "visual taste" skill can cite them. Sizes are converted for our 1080×1920 frame where the source gives a percentage. Source paths are under `skills/hyperframes/` unless they start with `.claude/` or `registry/`.

### The SPEC method (`references/spec.md`)

**T1. Every adjective becomes a number before any scene is built.**
- Write `SPEC.md` as a director's brief with these lines:
  - **GOAL**: what the viewer feels or does at the end.
  - **OUTPUT**: W×H, fps.
  - **TIME**: seconds × fps = frames; BPM and frames per beat when there's music.
  - **LOOK**: ground (hex, texture and its amount); ink; ONE accent and where it may appear; display face + weight + px + tracking; body face the same; the medium with its numbers; light and depth (shadow offset, blur, opacity, grain %, vignette %).
  - **OBJECTS**: every thing the viewer must recognise, drawn with the material and details that make it read without a label ("a mirror is silvered glass with a bright edge and a mount, not a bar").
  - **MOTION**: eases by role as named curves; springs as damping ratio; durations and staggers in frames.
  - **SHOTS**: one line per shot (frame range, the one hero move, what the viewer reads and in which window, the sound, the hand-off).
  - **BANNED**.
  - **QA**: the frames to check and what each must show.
- Build from it, check against it, update it when review changes the film.
- "The spec serves the story". A look that turns the story's things into abstract shapes has failed.

**T2. Word → number table:**

| word | becomes |
|---|---|
| premium | a material with numbers: satin paper with 2% grain; a product on a seamless sweep with a 0.55 contact shadow; chrome at roughness 0.05 |
| modern | a camera and a type system: a 30-frame push on one ease; a display face at 9% of frame height (≈173 px on 1920 tall) with −2% tracking |
| clean | a grid and a ration: 12 columns, 96 px margins, the accent on one word per shot |
| dynamic | cuts on the beat, a layout change on the bar (every 4 beats), one hero move per shot |
| playful | springs at damping 0.45–0.6 on position and scale (never opacity or colour), poses exaggerated 10–30% |
| cinematic | a lens and a light: 35 mm framing, a key from upper left, a rim from behind, 6% vignette |

**T3. BANNED by default, in full.** Each item is banned unless the brand's own material or the person's reference uses it, and then only the way they use it:
- "a black or dark navy void as the ground, with small elements floating in its middle";
- "glow, bloom, neon, lens flares, glowing orbs and rings; floating particles as decoration";
- "purple or blue gradients, mesh gradients, glass cards";
- "a cream or off-white paper ground with a serif display, italic accent words, numbered "01 / 02" labels, small monospace caps labels, pill-shaped chips and buttons";
- "everything centred; everything fading in at once; every element fading and sliding up";
- "text that moves while it is read; titles that keep drifting after they land";
- "corner labels, frame borders, corner brackets, HUD readouts as decoration";
- "three cards in a row, KPI grids, a title over a dimmed screenshot";
- "the logo docked in a corner".

**T4. The BANNED list grows with every film.** After the first render, name every default it used anyway (from the list or not), add each to the film's BANNED line, and fix them.

**T5. Extra tells of a generated film** (`references/story.md` §8):
- every scene entering the same way, or the same move beat after beat;
- side-by-side panels and floating cards standing in for a scene;
- titles that keep sliding or shrinking after they land;
- breathing or floating loops standing in for motion on titles and UI.

**T6. Motion defaults that look generated** (`references/motion.md`):
- breathing, floating or pulsing loops on titles and UI;
- titles that keep sliding or scaling after they land;
- a slow creeping scale on a title, or a slow push late in a scene;
- bounce on UI; click rings;
- every scene entering the same way; every element fading and sliding up.
- A character's idle and overshoot are acting, not tells.

**T7. A look holds together when it is the rules of one medium, not a palette.** List its parts, what each part may carry, and how the medium itself moves ("paper is cut and lifted, ink is printed, glass refracts, clay is pressed"). Worked example: Risograph Print.

**T8. Three storylines, then one** (`references/story.md` §2).
- Three different films, each with its own **world**, **device** and **form**.
- Sketch 5+ device-and-form pairings first. Drop the ones the subject can't carry and keep the 3 that differ most; one must be the bold one you wouldn't pick first.
- Each storyline gives:
  - a name, its device and form;
  - two sentences of what the viewer sees and feels;
  - the first 2 seconds exactly;
  - its beats in one line;
  - its look in one line;
  - its sound in one line.
- Storylines are words only; build nothing before one is picked. Pick for story (people or a situation a stranger knows) over the most striking picture.
- Recommendation first, with a one-clause reason. Save all three in `STORYLINES.md`.
- A pitch where all three are plain cuts between scenes "has not tried the forms".

**T9. Device table** (`references/story.md`), what the viewer sees:

| device | what the viewer sees |
|---|---|
| A moment in someone's day | a person, a time stamp, the message that creates the need ("launch is tomorrow") |
| A character does the work | a mascot or cursor carries, drags, draws and reacts; every cut has a cause |
| The feature as the hook | the feature acting on a recognisable image in the first half second |
| The result first | the finished output plays, then the camera pulls back to show its origin |
| One object across apps | the thing being made travels from one app into the product, which keeps working on it |
| Life before and after | the old way as a scene (one person drowning in tabs), then the new way |
| Type carries the argument | giant kinetic type, colour fields and grids cutting on the beat |
| A number lands | one real number earned by a scene, then made physical |
| A question with the input | "What if you could make a video from your ⟨website⟩?", the blank filled by a real input |
| The object is the explanation | a machine or model whose working is the idea; the camera tours it |

**T10. Form table** (`references/story.md`):

| form | what the viewer sees |
|---|---|
| One continuous take | the camera never cuts; it pushes, pulls and travels from world to world |
| Object-to-object chain | each shot ends on the thing that opens the next (button → card → phone) |
| An endless zoom | the camera dives into a detail that turns out to be the next world, again and again |
| A flight through one world | a 3D set, map or desk the camera travels; each idea is a stop |
| Cut on the beat | hard cuts on the music; type and colour fields changing every half beat |
| Match cuts | one shape holds while everything around it changes (circle → lens → wheel → logo) |
| Split screen to one | several panes play, then collapse into the one that matters |
| One frame that rebuilds | a single composition keeps rearranging itself and never leaves the frame |

- Before and after: the new side moves calmly while the old side churns. Never mock a named competitor.

### Look (`references/look.md`, `references/film.md`, `SKILL.md`)

- **T11. Outside input breaks the default look,** in this order:
  - the project's design spec;
  - a real brand;
  - a reference the person gave;
  - the subject's own world.
  - Settle it as numbers before the first scene. Banning a default only moves the look to the next default.
- **T12. Design spec values versus prose.**
  - Frontmatter values (colours, typography, spacing) are normative: quote hex, families and weights exactly.
  - The prose is intent.
  - Brand hex, fonts and Do/Don'ts are strict; sizes, spacing, border weight and decoration are yours to scale for video. "A 1px border or a 6% shadow from a web page vanishes on screen."
- **T13. A reference gives grammar, never content:** shot lengths, how titles enter and leave, the transitions, palette roles, type scale and weight. Write it down, marking what you measured apart from what you guessed.
- **T14. "Generated design" fonts:** Inter, Space Grotesk, Instrument Serif, Geist and JetBrains Mono are "where generated design lands". Use them only when the brand does.
- **T15. The ground and the hero come from a medium, not from effects.**
- **T16. Video-compression facts.**
  - Full-screen linear gradients on dark grounds band under H.264: use a radial gradient, a solid fill, or a solid plus a local glow.
  - An accent at 5% opacity disappears: use 15–25% for atmosphere and full saturation for the focal element.
- **T17. Brand capture hygiene** (`film.md`).
  - Link blue `#0000EE` and status reds and greens are never the accent; the accent is the colour that recurs across the most roles.
  - Icon fonts are never the display or body face.
  - Use only the weights a font ships, or 600/700 render as fake bold.
  - For a dark brand on a light preset, swap ground and ink.
- **T18. Show real things from their source** (the product's screens, the brand's logo, a real place's imagery); draw only what has none (`SKILL.md`).
  - A real place goes on real imagery, not vector outlines, which "read as a diagram". Credit the imagery on screen.
  - Logos and icons are the brand's own files, "never a coloured square for an app icon" (`types/launch.md`).
- **T19. Footage treatments go through one tool.** Grades, grain, blur and vignettes on footage go through a dedicated media-treatment step, never CSS filters (`SKILL.md` contract 11).
- **T20. Palette and fonts are root variables,** so a re-brand is one edit (`look.md`).

### Composition (`references/spec.md`, `SKILL.md`, frame presets, `registry/…/placeholder-material.md`)

- **T21.** The hero of a shot fills **≥ 40%** of the frame's height or width. A small object in the middle of an empty frame is never a shot: push in, crop, or give it a world.
- **T22. One hero move per shot.** Secondary moves travel **50–70%** as far and start **100–200 ms** after; everything else holds.
- **T23. Information cards** (B-roll over a talking head, a data beat, a vertical explainer card) put their information on screen within **~2.5 s**, then hold, so any paused frame reads as a finished poster.
- **T24.** Something new every **2–4 s**; with music, a new layout every bar.
- **T25. Type floor.** Reading text ≥ **28 px at 1080** (2.6% of the short side; 28 px on our 1080-wide frame). Holds are **0.5 s + 0.3 s a word**. Too many words: cut words, never shrink type.
- **T26. Safe areas.**
  - Content inside the **90% action-safe** box; captions and key text inside the **80% title-safe** box.
  - On 9:16: nothing in the top 168 px; all words between **168 and 1330 px**; no text under the right-hand action rail.
- **T27. Preset "craft bar" eyeball tests** (all 13 `FRAME.md`):
  - **Squint**: one element dominates at **3–6×** its nearest neighbour.
  - **Silence**: declarative frames are **40–60% empty** (per look); only data or grid frames run dense.
  - **Restraint**: one accent, rationed.
  - **Reference**: name the real-world artefact you're aiming at and what failure looks like.
- **T28. Fit-to-measure headlines.** The headline block is ≤ **78%** of the frame width. ≤ 3 words take the biggest tier, 4–6 the middle, 7+ the smaller. "Don't blow a headline edge-to-edge."
- **T29. Numerals and claims.**
  - Never invent figures. An unsupplied value is a placeholder (`— figure —`, `{metric}`).
  - Never derive a claim the source didn't make ("40 min to 2 min" is not "20× faster"); mark example numbers as illustrative.
  - Sources: presets, `story.md` §1, `types/data.md`.
- **T30. Worlds** (`story.md` §5).
  - A film visits several worlds, each with its own background, light and scale, "never one dark canvas with small UI floating in it".
  - Enter each through an object already on screen.
  - Keep one home stage, one carrier the eye follows, and constant palette and type.
- **T31. Placeholder material is monochrome** (`registry/…/placeholder-material.md`).
  - Use the ink at **72 / 45 / 18 / 8%** alpha (L1–L4) plus a **14%** hairline. Each step is ≥ 1.6× the one below.
  - Text never goes below L1. L2 is the floor for anything a viewer must compare.
  - Circle = person, rounded square = app or brand.
  - Shadows are achromatic and diffuse (`0 Npx 3Npx rgba(0,0,0,0.18)`), "never a coloured glow".
- **T32. Accent marks at most ONE element (one role) per composition,** only where the accent *is* the meaning (the selected tier, the current step, the figure a count-up lands on). Placeholder content is never accent-coloured (`placeholder-material.md`; also `story.md` §7: one highlighted word, the payoff, the end card).
- **T33. Banned "AI default" placeholder hexes:** `#7c3aed`, `#2563eb`, `#6366f1`, `#8b5cf6`, `#a855f7`, `#4f46e5` ("the purple and blue palette standing in for content"; `placeholder-material.md`, `component-quality-bar.md` X4).
- **T34. No gradient inside a chart bar.** A light-to-dark fill makes the tallest bar palest exactly where the eye compares heights. Use flat fills; primary series at L1, comparison at L2 (`placeholder-material.md`).
- **T35. Gradients that are allowed:** physical surfaces (bezels, metal, glass, screen vignette), sheens and sweeps driven across an element, scrims and vignettes for contrast, and effects whose subject is the gradient (`placeholder-material.md`).

### Motion (`references/motion.md`)

- **T36. Fast moves.**
  - A fast move takes **0.3–0.6 s** and carries motion blur on its own ease, peaking at its fastest frame.
  - Blur is **6–12 px** on text-sized elements and **15–20 px** full-frame, horizontal-only on a horizontal move.
  - One move is one tween.
- **T37. Arrive slow, leave clean.**
  - Arrivals get long-tailed ease-outs; landing takes longer than leaving.
  - An exit is one smooth motion (never slide, stop, leave).
  - Entrances that are too snappy read as glitches. Slowing the whole video by ~1 s often fixes it.
- **T38. Ease by role.**
  - Arrival: `expo.out` or `power4.out`.
  - Camera move or colour flood: `power2.inOut`.
  - Zoom-through or exit: `power3.in`.
  - Linear only for rotation, progress, or constant speed that is the point.
  - "The same `power2.out` at 0.5 s on everything is the flat default that makes a film feel generated."
- **T39. Springs by damping ratio.**
  - 1.0 = no bounce; **0.7–0.85 = premium**; **0.4–0.6 = playful**; < 0.3 = cartoon.
  - Position and size may bounce; opacity and colour never do.
  - Nearest built-ins: `elastic.out(1, 0.5)` and `back.out(1.4)`. Prefer a closed-form spring of t.
- **T40. Exits, overlap and stagger.**
  - Exits are **40–50% shorter** than entrances.
  - The next element starts when the previous is **30–50% done** ("fully sequential looks robotic, all at once looks cheap").
  - Stagger: letters **1 frame** apart, words **60–120 ms**, list items **40–80 ms**.
- **T41. Beat grid.**
  - Frames per beat = fps × 60 / BPM. Compute each beat from its index and round it; never accumulate rounded beats (at 128 BPM and 30 fps that drifts 2 frames in 32 beats).
  - Cut on the beat; change the layout on the bar.
  - A move landing on a hit starts **40–190 ms** early; a reaction **0–45 ms** after; the hit itself is an instant set (`film.md`).
- **T42. Cuts.**
  - Cut at the fastest frame of a move, with matching direction and speed both sides.
  - A click into a new screen is a match cut on the click's rebound; the new screen comes in slightly large and settles.
- **T43. A landed title is dead still.** The motion moves to the next element, the camera or the world. Vary the title entrance within a film. Recipes:
  - per word: `blur(6px)` → 0 and opacity 0 → 1 in **0.13 s**, **0.067 s** apart, no translate;
  - per word from light grey to ink, **0.07–0.1 s** apart, no movement;
  - the whole line blurring in, **8 px → 0 in 0.13–0.2 s**;
  - per letter for a name, **0.1 s** apart, opacity **0.3 → 1** with a slight blur;
  - the title behind the subject (between the plate and a matte);
  - one word rolling through options like a slot machine, **~0.1 s** a roll.
- **T44. Holds.**
  - A read holds **0.5 s + 0.3 s a word**; the film's last line holds **≥ 2 s**; a 1–2-word chapter line may hold **0.4 s**.
  - Then exit with a blur-out and fade of **0.13–0.25 s**, word by word or with the scene's move.
- **T45. Title size.**
  - **4–9%** of frame height (≈ 77–173 px on 1920 tall), 1–2 lines.
  - Quiet lines at **2.5–4%** (≈ 48–77 px) against hero words filling **60–90%** of the width.
  - One highlighted word in the accent, which carries meaning.
- **T46. Rhythm.**
  - Contrast speeds. Montages cut every **0.13–0.8 s**; a demo holds one framing **7–10 s** while the UI acts; shots average **1.8–3 s** with motion inside.
  - Hold **0.3–0.75 s** before the payoff, which plays at normal speed.
- **T47. Continuous motion that works:** the product's UI working, footage playing, a character acting, a 3D world turning, a slow orbit of a background stage at **3–5° a second**.
- **T48. Feedback → change table:**
  - "too fast" → slow every zoom and pan to **0.7×** its speed, nothing else;
  - "speed this up" → speed the content and shorten the beat by the same amount, moving later beats up;
  - "the titles move" → land them, then hold dead still;
  - "it feels like slides" → enter the next scene through an object on screen; cut a move mid-flight.
- **T49. A film that feels busy:** remove a third of the motion and keep the moves that lead the eye (`references/review.md`).

### Seams and continuity (`.claude/skills/motion-doctrine/SKILL.md`, `.claude/skills/cut-the-curve/SKILL.md`)

- **T50. The vector law:** how scene A exits decides how scene B enters.
  - **Axis**: never trade axes across a cut.
  - **Direction**: never mirror. On Z the direction is the SIGN of the scale change (growing = push, shrinking = pull).
  - **Speed**: mirrored eases (`power4.in` exit + `power4.out` entry, same distance and duration; the entry picks up ≥ 50% through the notional path).
  - **Phase**: cut mid-motion on BOTH sides.
- **T51. The current.**
  - Each film picks ONE dominant direction (house default LEFT) for ordinary seams.
  - Reserved vectors carry meaning: upward = elevation or reveal; Z forward = deeper into the same thought; Z backward = arrival; scale-burst = leaving a world.
  - Never run consecutive seams in opposing directions; a direction change needs a visible cause or a chapter boundary.
- **T52. Carriers.**
  - The eye follows objects: hand a concrete carrier (cursor, docking container, flying mark, word group) across the cut at matched position and velocity.
  - "Never a crossfade — it has no carrier at all."
- **T53. Causal motion.**
  - Chain click → squash → release → flight → impact → recoil → reveal.
  - Effects start ON the causing frame. Reactions scale with implied mass (big elements rebound slower).
- **T54. No idle wobble.** Breathe, float, drift and glow-pulse loops are banned as sustained motion. Every phase between entry and exit is owned by one route:
  - staged reveals;
  - camera with intent (establish wide → travel → arrive);
  - sequenced UI life;
  - animated sequences;
  - cursor-led action.
  - Test: pause on any second and something meaningful is mid-flight.
- **T55. Stillness before climax:** a **0.3–0.75 s** pause between the major action and its result.
- **T56. Timing intents.**
  - A single entry is ≤ **~800 ms**; longer build-ups are a stagger.
  - Exit ≈ **75%** of entry (cut-the-curve inverts this: entry ~127% of exit).
  - Total stagger ≤ **500 ms**.
  - `bounce.out` and `elastic.out` are forbidden; entry overshoot `back.out(1.4–1.7)` is fine.
  - Similar elements share one ease and duration.
- **T57. Partial travel.** Seam moves travel ~**12% of the frame** (≈ 230 px at 1920; ≈ 130 px across our 1080 width, ≈ 230 px along our 1920 height), never fully off-screen.
- **T58. Seam blur.**
  - Peak **10 px** on text-scale subjects and **18–20 px** on full-frame surfaces, the same on both sides at the swap.
  - Blur the wrapper, never the children.
  - Never blur and fade one element in one tween; never blur a video directly.
- **T59. Waterfall entry** (arrivals, not seams).
  - Opacity is binary (an instant set), never faded. One direction (default from below). The next element starts within ±2 frames of the previous one settling. Ease `power4.out`, never `.inOut`.
  - By element weight:

| element | Y offset | duration | overlap |
|---|---|---|---|
| anchor or heavy | 60–80 px | 0.16–0.20 s | 0–2 f gap |
| normal word | 40–50 px | 0.13–0.16 s | 1 f overlap |
| light word or punctuation | 30–48 px | 0.10–0.13 s | 1–2 f overlap |
- **T60. Nudge curve** (in-scene group slide). Three chained tweens:
  - ramp-in: `power3.in`, ~10% of the distance in ~20% of the time;
  - burst: linear, ~65% in ~18%;
  - tail: `power4.out`, ~25% in ~62%.
  - The tail is ≥ 3× the ramp-in in time. Reveal new content during the burst.
- **T61. Paint the stage.** A mid-window cut opens a moment where summed opacity is < 1, which flashes white over an unpainted background (`.claude/skills/seam-craft/SKILL.md`).

### Cursor (`.claude/skills/oversized-cursor/SKILL.md`, `types/launch.md`)

- **T62. Size.** Oversized: **7 cqw** full-frame (≈ 134 px at 1920; ≈ 76 px on our 1080 width), **4.6–5.5 cqw** inside a mock. `launch.md` says 4–7% of the frame. "When unsure, bigger."
- **T63. Entry.** It always enters from off-screen (from below, top 115–120%) on one continuous decelerating vector, **0.4–0.92 s `power3.out`**. Never faded or mask-revealed in place.
- **T64. Tip and click.**
  - The tip, not the box centre, lands on the target; presses pivot on the tip (`transformOrigin: 21% 14%`).
  - Click = scale **0.84 in 0.1 s `power2.in`**, back to 1 in **0.22 s `power2.out`** (a 1:2 ratio).
  - The target reacts in a parallel tween (button scale 0.94).
- **T65. The click ignites the next beat on the same frame.** During beats it doesn't own, the cursor drifts aside (**0.5–0.9 s `power2.out`**), never frozen on top, never wobbling.
- **T66. Exit.** Physically off the nearest edge in **0.5–0.7 s `power2.in`**, or as a carrier across the cut (the last 0.3 s heads for the next scene's click point). Drop shadow `0 4px 6px rgba(0,0,0,.3)`.

### Story and copy (`references/story.md`, `references/film.md`)

- **T67. The one thing.**
  - What it is in one line; the one thing to remember, in the viewer's words.
  - One viewer doing one real task is the spine, with one real piece of data travelling from hook to payoff.
  - An explainer's spine is one worked example.
- **T68. The hook.**
  - The first 2 s are the densest.
  - **Frame 0 is the thumbnail: never black, never a logo alone.**
  - Open on the feature working on something recognisable, a real moment that creates the need, a question with the input inside, or a sentence whose last word becomes the picture.
  - Typing into a prompt box as the opener is a tell.
- **T69. Copy.**
  - Titles ≤ **6 words a line**, one line on screen at a time, no trailing periods; explainer lines up to ~10.
  - The first line is never "Introducing", "Meet" or the logo.
  - Never "unlock", "seamless", "supercharge", "game-changer", "revolutionize", "effortless", or "in seconds" unless measured.
  - Use the person's own copy verbatim.
- **T70. Two cover tests.** Read the lines alone: a stranger gets the pitch. Watch the pictures alone: they tell the same story.
- **T71. Voiceover.** No voiceover unless asked or the source calls for one. When there is one, the screen never repeats the spoken sentence word for word.
- **T72. Show, don't list.** No bullet slides, no three-card rows. Similar things each get their own idea and layout.
- **T73. Brand.**
  - The mark lands once, with weight, usually on the end card; before that the brand shows only inside the product and the story.
  - The end card is built (carried in, typed, wiped), not a still.
- **T74. Script pacing.**
  - TTS reads ≈ **2.2 words/s**.
  - A scene is ~**19 words (9 s)**; at most two scenes reach 26 words (12 s).
  - 30–90 s ≈ ≤ 155 words; a whole film ≤ ~400.
  - A voiceover longer than its visuals: trim the script, never stretch the motion.
  - Reveal each piece when the voice names it, across the back half of the scene.
- **T75. Kinetic type.**
  - **3–7 English words** (or 4–12 Chinese characters) per scene.
  - A count-up runs **1.2–1.6 s**, then holds, landing on a downbeat or a hard stop.
  - Any single treatment goes stale after **~6 s** (`film.md`).

### Captions (`references/captions.md`, `.claude/skills/captions-overlay/SKILL.md`, `skills/media-use/audio/references/captions/*`)

- **T76. Grouping.**
  - **2–3 words** for high energy, **3–5** conversational, **4–6** calm.
  - Break at a sentence end, a pause of **≥ 150 ms**, or the word limit.
  - One group visible at a time. Never put two words in one timed entry.
- **T77. Timing.**
  - The first caption starts **0.1–0.3 s** in (one at exactly 0 s "looks pre-existing").
  - Each group ends with a hard kill after its exit (fade **0.12 s `power2.in`**, then hide).
- **T78. Fit and place.**
  - Fit text to a max width: **1600** landscape, **900** portrait; base **78 px**, min **42 px**, step 2.
  - Use a full-width container with centred text, never `left:50%; translateX(-50%)`; `overflow: visible`.
  - Landscape 80–120 px from the bottom; portrait ~600–700 px from the bottom.
  - Never over the speaker's face.
  - Fade the group or its words, not both (the opacities multiply into a pop).
- **T79. Over footage, choose the blend by the brightness behind the text** (0–255):
  - < 60: `screen`;
  - 60–180: `overlay`;
  - > 180: normal with opaque colour.
  - Plain subtitles over brightness > 60 get a **30–40%** scrim sized to the text, never a full-width bar.
- **T80. Text behind the speaker.**
  - A big word behind the head reads best **30–55% covered**: under ~15% it floats; over ~65% it's eaten.
  - Re-lay out when a content word is 80% covered, or two neighbouring words are 50% each.
  - Measure against the matte over each caption's own window.
- **T81. Drop / rail / embed.**
  - Filler is dropped. Ordinary speech rides a verbatim lower-third "rail".
  - An embed (one big word behind the subject) is the scarce peak: ≤ 1 per beat, never two adjacent or visible together.
  - Captions are an overlay, not a reserved band: centre the composition on the true centre (y = 960 on 1920).
- **T82. Caption tone table** (`media-use/…/captions/authoring.md`):

| tone | font | animation | colour | size |
|---|---|---|---|---|
| hype or launch | heavy condensed 800–900 | scale-pop `back.out(1.7)` 0.1–0.2 s | bright on dark | 72–96 px |
| corporate | clean sans 600–700 | fade + slide `power3.out` 0.3 s | white or neutral, muted accent | 56–72 px |
| tutorial | mono or clean sans 500–600 | typewriter or fade 0.4–0.5 s | high contrast | 48–64 px |
| storytelling | serif 400–500 | slow fade `power2.out` 0.5–0.6 s | warm muted | 44–56 px |
| social | rounded sans 700–800 | bounce, `elastic.out`, word by word | playful coloured pills | 56–80 px |
- **T83. Caption energy** (`…/captions/motion.md`).
  - Karaoke highlight is the baseline: high energy = accent + glow + **15%** scale pop; low energy = gentle white with **3%** scale.
  - Emphasis words break the pattern. Cycle highlight styles every 2–4 groups.
  - Music captions are audio-reactive at **3–6%** scale variation, kept subtle.

### Sound (`references/sound.md`, `references/film.md`)

- **T84.** A film over ~**15 s** that tells something gets a music bed plus sounds on its visible actions, unless silence was asked or it autoplays muted.
- **T85. The clock.** Narrated: the voice is the clock and text lands on the word that says it. Music only: the music is the clock; land the payoff and the mark on strong beats; cuts follow the motion, not the drums.
- **T86. Effects only on a cause:**
  - click: a real cursor click;
  - whoosh: a scene cut or a large fast card;
  - soft key tick: text arriving letter by letter;
  - pop: a badge, chip or number landing;
  - riser into impact: the payoff or the mark, once.
  - No synthesised tones, chimes or dings.
  - Rotate 2–3 takes ("the same whoosh on every cut is the most common tell").
- **T87. Effect placement.** An effect peaks **one frame after** its picture. Hits sit **3–6 dB** over the bed. A bed with most of its energy under **150 Hz** plays as nothing on a phone.
- **T88. Levels.**
  - Music under voice ≈ **0.14** volume.
  - True peak ≤ **−1 dBTP**; the mix **−16 to −14 LUFS** for social.
  - Library loops: **0.4 s** fade-in and **1.5 s** fade-out; enter at the strongest bar, not a quiet intro.
- **T89. Say the sound was measured, not heard.**

### Talking-head overlays (`references/overlays.md`)

- **T90. Card timing.**
  - Cards fade in over **0.4 s `power2.out`** and out over **0.35 s `power2.in`**.
  - Re-frame the video (**0.5–0.7 s**) only in a gap between cards.
  - A static card goes dead after **~8 s**; past ~15 s it needs a staged reveal.
  - Density: one card per **6–8 s** under a minute, **8–12 s** up to 3 min, **12–20 s** up to 10 min.
- **T91. Portrait type.**
  - Portrait type = landscape × **1.3** (titles × 1.35, stats × 1.4); padding drops to **24–36 px**.
  - Glass over bright footage: dark scrim `rgba(0,0,0,.55)` fading from the top, `.72` at the bottom; a dark glass base `rgba(15,16,22,.78)` with `blur(22px)`.

### Determinism (`SKILL.md`, `references/runtimes.md`, `types/3d.md`)

- **T92. Everything visible is a function of timeline time.**
  - No clock reads, no unseeded random, no network, no timers or infinite repeats.
  - Seed with a small PRNG (mulberry32). Use finite repeats only (`repeat: max(0, floor(duration / cycle) − 1)`).
  - Simulate once at load into arrays; `render(t)` stays pure; clamp values that can divide by zero (one NaN pixel blacks the frame through bloom).

### Review stance (`references/review.md`)

- **T93. Review as a harsh motion director, not a proud author.**
  - Describe each beat frame in one sentence as a stranger would: an object you'd have to explain is a P0.
  - "Never score the film out of 10: a score finds nothing to fix."
  - Fix text first, then timing, then detail.

### Conflicts between sources (flagged, not resolved)

- **Exit length:**
  - `motion.md`: exits are 40–50% shorter than entrances;
  - `motion-doctrine`: exit ≈ 75% of entry;
  - `cut-the-curve`: entry ~127% of exit.
- **Transition budget:** `motion.md` says use 3–5 kinds per film; `motion-doctrine` says 2–3 inter-scene transitions, repeated.
- **Crossfades:**
  - `motion-doctrine` bans crossfades between scenes; `motion.md` says worlds never crossfade;
  - but `storyboard-format.md` lists `crossfade` as a `transition_in` value, and the registry ships `transitions-dissolve` and `fade-through`.
- **Springs and elastic:**
  - `motion.md` allows springs (0.4–0.6 playful) with `elastic.out(1, 0.5)` as the nearest built-in;
  - `motion-doctrine` forbids `bounce.out` / `elastic.out`;
  - the Play Mode example and the "social" caption tone use elastic.
- **Caption placement:**
  - `captions.md`: portrait captions ~600–700 px from the bottom;
  - the preset caption skins: a reserved band (default top 900 px, height 180 px);
  - `captions-overlay`: never reserve a band, the caption sits in the bottom ~5–8%;
  - `vertical.md`: nothing readable below 1330 px.
  - For our 9:16, `vertical.md` is the constraint that matters.
- **The presets themselves** contain things the BANNED list names:
  - three-card rows (BlockFrame, Coral, Creative Mode, Capsule, Daisy Days);
  - cream serif paper with mono labels (Cartesian, Cobalt Grid, Code Editorial, Capsule);
  - bloom-like radial glows (Biennale Yellow, Capsule).
  - The source reconciles this by calling presets deck looks, never a film fallback.

---

## Review checks

Sources:
- `skills/hyperframes/references/review.md`;
- `skills/hyperframes-cli/references/lint-validate-inspect.md`;
- the implementation in `packages/cli/src/utils/craftAudit.ts` and `packages/cli/src/commands/snapshotReview.ts` (I checked these against the docs: the numbers match);
- `.claude/skills/motion-doctrine/scripts/seam-gate.mjs`.

Counted R1… for reference.

### `check --json` craft warnings
Warnings only, even under `--strict` ("a film may break one on purpose"). Measured on an **8 fps sweep** of the whole film; skipped under `--range`. Sizes scale with the frame's short side (1080 reference, so our 1080×1920 frame uses the same numbers).

| # | code | threshold | catches |
|---|---|---|---|
| R1 | `line_unread` | A reading-size line (≥ **30 px** tall at 1080, ≥ **0.5** opacity) on screen less than its floor. Floor for 1–2 words = **0.4 s**. Otherwise **¾ × (0.5 s + 0.3 s/word)** (3 words 1.05 s, 6 words 1.73 s). The film's last line needs **2 s**. Edges re-measured to ~0.01 s, 1/30 s tolerance. Caption-track text and `data-layout-ignore` are exempt. | text that flashes by too fast to read |
| R2 | `dead_stretch` | More than **3 s** where nothing on screen changes. The final 3 s and any time a `data-hold` element is visible are exempt. Quiet when `sweep_static` fires or a `keepsMoving` assertion sets the limit. | dead air, a scene that finished entering too early |
| R3 | `text_below_floor` | Text under **2.6% of the short side** (28 px on 1080; half a pixel of slack) held **≥ 0.5 s**. One finding per file listing every element. | type too small for a phone |
| R4 | `first_frame_empty` | Frame 0 paints only the background (no text, image, video, canvas or svg), or one opaque element covers every other clip. | a black or empty thumbnail on social players |
| R5 | `film_silent` | A film over **15 s** with no unmuted `<audio>` or audible `<video>`. | a forgotten soundtrack |

Fix or keep each on purpose and say why in the note: "A warning is a question, not a rule."

### Other `check` audits
Defaults: 9 samples; `--samples N`, `--at`, `--at-transitions`; overflow tolerance 2 px.

| # | check | threshold or behaviour | catches |
|---|---|---|---|
| R6 | Contrast (WCAG AA) | **4.5:1** normal text, **3:1** large (≥ 24 px, or ≥ 19 px bold), sampled at 5 grid points. These are **errors**; each gives fg/bg, the ratio and a `suggestedColor` in the same palette direction. | unreadable text |
| R7 | Layout: text overflow, text clipped by its own box, children escaping clip containers | overflow past 2 px | crops, text off the edge |
| R8 | `content_overlap` (held) | held across samples → error | text collisions |
| R9 | `canvas_covered` | an opaque element above every other clip for most of the film | a forgotten full-screen cover |
| R10 | `canvas_overflow` | held, partly visible, breaching ≥ **5%** of the canvas → warning | content sliding off-frame |
| R11 | `canvas_content_at_edge` | sharp canvas pixels along the frame edge | text drawn into a `<canvas>` cut at the edge |
| R12 | `escaped_container`, `panel_out_of_canvas`, `connector_detached` | geometry computed in one frame but drawn in another | stuck panels, detached connector lines |
| R13 | `text_occluded` / transparent video | words under a cutout video measured per word against alpha: partly hidden = info; **≥ 80%** hidden, or two neighbouring words **each half** hidden = error | captions eaten by the speaker cutout |
| R14 | `sweep_static` | a **3 s+** composition with no visible change at any sample = fail. Opacity-only reveals count only while in flight. | the seek not driving the page, or a reveal that ends early then sits frozen |
| R15 | Persistence-aware severity | an issue seen at a single sample is demoted to info (an entrance or exit in flight) | stops transient false positives |
| R16 | Runtime | console errors, unhandled exceptions, failed requests, HTTP 4xx/5xx | broken scripts or assets |
| R17 | Audio | `audio_source_unreadable` (error); `audio_source_rejected` (error, no audio track); `audio_starts_past_source_end` (warn); `audio_clip_silent` (warn, silent for the whole clip; long clips sampled at three 1 s spots first); `audio_none` (info); `audio_src_not_found` (error) | silent or broken mixes |
| R18 | `timeline_track_too_dense` (`overlays.md`) | more than **3** timed elements on one track | an overloaded chapter |
| R19 | `--caption-zone x0;y0;x1;y1` (opt-in) | a text box overlapping the caption band (fractions of the canvas). The changelog skill uses `y0=.90`, error, seeking 25 points. | content under the captions |
| R20 | `--frame-check` (opt-in) | media breaching the canvas beyond **max(120 px, 6% of the shorter canvas side)** | images or video pushed off-frame |
| R21 | Motion sidecar `*.motion.json` | these are errors:<br>• `appearsBy` (opacity ≥ 0.5 by `bySec`) → `motion_appears_late`;<br>• `before(a,b)` → `motion_out_of_order`;<br>• `staysInFrame` → `motion_off_frame`;<br>• `keepsMoving` (static window > `maxStaticSec`, **default 2 s**; the final 3 s exempt) → `motion_frozen`;<br>• a selector that matches nothing → `motion_selector_missing` | motion intent diverging from the render |

- Opt-outs (the narrowest wins):
  - `data-layout-allow-overflow`, `-bleed`, `-allow-overlap` (not inherited), `-allow-occlusion`, `-allow-caption-zone`, `data-layout-ignore`;
  - `data-hold`, for deliberate stillness in `dead_stretch`.
- The docs warn that `check` "passes compositions that render nothing" (`component-quality-bar.md`), so frames must always be looked at.

### `snapshot --review` (`snapshotReview.ts`)
- **R22. `review-beats.jpg`.** Each scene (a top-level timed clip or sub-composition host, captions and audio excluded) at **start + 0.3 s** and at its middle. Plus each `data-beat="name"` element at start + 0.3 s, labelled with time and id.
  - With fewer than two scenes, **5 evenly spread** beats are used.
  - Sheets page at 16 tiles.
- **R23. `review-seam-NN.jpg`.** A strip at **−0.2, −0.1, 0, +0.1, +0.2 s** around every cut. It catches jumps, collisions at a seam and mismatched states.
- **R24. `review-phone.jpg`.** The beat frames at **360 px wide**, to judge whether every line can be read on a phone.
- `--json` returns `{ok, outputDir, frames[{path,time,role,label}], contactSheets, review{window, scenes, beats, seams[...], sheets, notes}}`.
- For a single move:
  - `snapshot --range A,B --frames 8`;
  - `keyframes --shot` draws an element's path, 9 samples by default;
  - `snapshot --at … --against ref.mp4` gives a side-by-side with a reference.

### The review pass (`references/review.md`)
- **R25. Measure, then look.**
  1. `check --json`;
  2. `snapshot --review`, opening all three sheets;
  3. `--range` around the hero move and the payoff;
  4. `audio --json` on the render ("you cannot hear it; say so").
  - Trust numbers over the eye where they disagree ("a clipped label or a 0.6 s line looks fine on a contact sheet").
- **R26. Describe each beat frame as a stranger would,** naming every object. An object you'd have to explain is a **P0**.
  - Then: do the beat frames tell a story a stranger follows, each causing the next?
  - Compare each frame with its SPEC shot; name every BANNED default seen and fix those first.
- **R27. One pass per question:**

| question | catches |
|---|---|
| Does it read as what it is? | a shape that reads as another object; plastic-looking material; a product screen that reads as a mockup; a face or mascot that reads wrong |
| Does the subject separate? | subject and ground too close in value; two focal points; nowhere for the eye to go |
| Framing and contact | crops; text at the edge or under platform UI; collisions at a seam; things floating that should touch |
| Timing as a first-time viewer | a read shorter than its words; a pop-on with no move; a jump at a cut; everything on one curve |
| Tells | items from `story.md` §8 and `motion.md` "Defaults that look generated" |
| The pictures alone | with the words covered, do the beats still tell the story? |
| The phone sheet | is every line readable at 360 px? |
- **R28. Notes are one line each: `t=4.2s · where · problem → exact change · what stays`.**
  - **P0**: breaks the read or the contract (unreadable, wrong, broken, a tell in the hero shot).
  - **P1**: weakens the film (a dead stretch, a soft payoff, a seam that jumps).
  - **P2**: polish.
  - Fix every P0 and the worthwhile P1s: text, then timing, then detail. Snapshot only what changed, once. Do a second pass only if a P0 is still open.
  - When a fix doesn't hold: snapshot either side, list every difference, and change only the line that causes it.
- **R29. Fresh eyes.** A sub-agent reviewer gets only `STORYBOARD.md` and the three sheets, and returns P0/P1 lines in the same format. The author keeps the editing. Commit or copy the project before fixing.

### `REVIEW.md` format (`references/review.md` §4)
Written at the project root, with a short form in the reply:
1. the creative calls made, and the storylines not built;
2. what was measured versus only looked at, and what nobody checked ("the sound was measured, not heard");
3. the weakest shot and what you'd change with more time;
4. warnings kept on purpose, and why.

The next turn reads it before changing anything. The storyboard plan carries a `reads` line per frame (what the viewer must understand, each with a non-overlapping time window long enough for its words) and a `sound` line, so build and review check the same thing (`storyboard-format.md`).

### Seam Gate (`.claude/skills/motion-doctrine/scripts/seam-gate.mjs` + `references/seam-gate.md`)
Samples each cut at **cut − 0.1 s, cut − 1 f, cut + 1 f, cut + 0.1 s** at 30 fps.

| # | row | threshold | catches |
|---|---|---|---|
| R30 | `ledger` | exit and entry axis and direction equal in the plan | a mirrored or mixed vector before any render |
| R31 | `exit-moving` / `entry-moving` | speed ≥ **15 px/s** (x, y) or ≥ **0.04 scale/s** (z) | an exit settled before the cut; an entry from rest |
| R32 | `exit-visible` / `entry-visible` | cumulative opacity ≥ **0.04** | a mover that's moving but invisible |
| R33 | `exit-direction` / `entry-direction` | measured sign = ledger sign | a mirrored zoom or wrong direction |
| R34 | `speed-match` (WARN) | entry/exit velocity ratio within **1/3 – 3** | a speed jump at the cut |
| R35 | `zero-overlap` | incoming invisible at cut − 1 f AND outgoing invisible at cut + 1 f | a cut that reads as a dissolve |
| R36 | `z-sign-scan` | the incoming scene's own entrances don't fight the Z sign during ~0.5 s | a grow-from-small intro under a pull seam |
| R37 | `carrier-*` | carrier rect centre within **12 px**, size within **5%** across cut ± 1 frame, ancestors included | a carrier that jumps at a match cut |

- The gate cannot check:
  - edits to a scene's first or last ~1 s re-open the seam;
  - re-timing to a new VO re-opens every seam;
  - the clip-gating gotcha: a clip un-hides before its entry tween.

### Other gates seen
- **R38. Changelog gates** (`.claude/skills/changelog-video`):
  - dim text alpha ≥ **.66** (".45 fails the 4.5:1 gate over the glass");
  - a caption-presence gate: sample 3–4 frames across the spoken window and confirm caption text;
  - verify decoded MP4 frames after render: captions present, background not black, no tiny or frozen frames.
- **R39. Component audit** (`registry/…/component-quality-bar.md`).
  - Fatal:
    - F1, doesn't implement its description;
    - F2, duplicate motion fingerprint and markup skeleton;
    - F3, renders nothing;
    - F4, the promised event never happens;
    - F5, can't be made seekable (snapshots of the same timestamp differ by seek path).
  - Fixable:
    - X1, no timeline;
    - X2, the name claims a technique the code lacks;
    - X3, illegible (< 4.5:1, or a feature < ~24 px at 1920);
    - X4, purple/blue placeholder gradients;
    - X5, hard-coded ink;
    - X6, no markup;
    - X7, `Math.random`;
    - X8, unbounded variables.
  - Environment-like sets score PSNR ≥ 45 between frames; things that genuinely move score 17–24.
- **R40. Render verification** (`hyperframes-cli/SKILL.md`): the file is non-empty, its ffprobe duration matches the root duration, and decoded frames have been looked at.

---

## Not styles, but useful parts

One line each, with the source. "(1080p)" means the item is authored for 1920×1080. All are Apache-2.0 HTML/GSAP; for Remotion we'd re-implement the idea, not copy the code.

### Transitions with a cause (`skills/hyperframes/references/motion.md`, measured on HyperFrames' launch films)
- **Zoom through a button**: the camera tracks to the button with blur (0.6 s), then the button scales from ~8% to ~250% of the frame in 0.35 s on a strong ease-in; its fill becomes the next frame.
- **Object becomes the world**:
  - a pill or card grows past the frame in 0.65 s ease-in-out while its radius shrinks;
  - its surroundings blur ~15 px and fade in 0.3 s;
  - the new content fades in while it's still growing.
- **Morph**: one container widens into the next (icon card → prompt box, ~110 → ~880 px in 0.2 s `power3.out`) with a horizontal blur from 12 to 0.
- **Carry across**: the result shrinks 1 → 0.6 with blur peaking at 6 px mid-move and lands inside the next app as that app builds around it.
- **Colour flood**: the hero object stays while the whole ground changes colour in ~0.4 s `power2.inOut`.
- **Whip**: a horizontal or vertical smear of 0.13–0.3 s; the arriving element lands blurred and sharpens in ~0.13 s.
- **Iris from the click**: `clip-path: circle()` opens from the clicked point onto the next world in 0.15 s.
- **Dip cut**: the outgoing frame darkens ~40% for 3 frames before a hard cut, "so the cut reads as meant".
- **Blur swap on one stage**: out is opacity → 0 with ~8 px blur in 0.13–0.2 s; in is blur → 0 in 0.13 s; the ground never cuts.
- Rules: 3–5 kinds per film; at most a third of seams are hard cuts; hard cuts belong inside a scene (punch-ins).

### Velocity-matched seams (`.claude/skills/cut-the-curve/SKILL.md`, `examples/gsap-implementation.md`, `motion-doctrine/scripts/seam-stamp.mjs`)
- **Zoom-through** (push), ≈ 0.4 s total, for text swaps:
  - exit: scale 1 → 1.2, blur 0 → 10 px, opacity 1 → 0.15, 0.2 s `power3.in` (opacity on its own linear tween);
  - a hard set at the cut;
  - entry: 0.75 → 1, blur 10 → 0, 0.15 → 1 opacity, 0.5 s `expo.out`.
- **Inverse zoom-through** (pull, for arrival or payoff), ≈ 0.7 s:
  - exit 1 → 0.8 in ~0.2 s;
  - entry from 1.25 → 1 in ~0.5 s `expo.out`;
  - 10 px blur (18–20 px if both sides are full-bleed).
- **Cut the curve** (the default scene boundary), ≈ 0.6 s:
  - partial travel ±230 px at 1920 (~12%);
  - exit `power4.in`, entry `power4.out`, same distance and duration;
  - the exit fade finishes at ~25–30% of its travel (0.18–0.3 s against 0.3–0.34 s of motion);
  - the entry ignites at 0.35 opacity mid-path;
  - optional 8–10 px blur.
- **Stamp defaults** (`seam-stamp.mjs`):
  - x/y: exit 12% offset with fade over 0.34 s `power3.in`; entry from 10% at 0.35 opacity, 0.42 s `power4.out`;
  - z: exit to 0.8 (pull) or 1.18 (push), blur 18 px, 0.21 s; entry from 1.25 or 0.78 at 0.15 opacity, 0.5 s `expo.out`.
- **Waterfall cut** (word by word):
  - exit 0.34 s `power4.in`, fade 0.18 s, +0.022 s per word in reading order;
  - entry 0.3 s `power4.out` from 0.35 opacity, gaps 0.05 s × 0.84 decay per word.
- **Rack-focus blur-cut** (a seen cut, ≤ once per ~8 s):
  - the outgoing frame stays opaque and goes x −80, scale 1.06, blur 12 px in 0.3 s `power2.in`;
  - a hard swap at peak blur;
  - the incoming goes from x 80, 1.06, 12 px to rest in 0.35 s `power2.out`;
  - peak blur 8–12 px, ≤ 16–18 px.
- Registry zoom-through template: scale to 2.5 with 8 px blur `power3.in`, entry from 0.5 `power3.out` (`gsap-implementation.md`).

### The right mechanism (`references/motion.md`)
- Punch-in, zoom, pan, Ken Burns, reframe: tween `scale` and x/y on a wrapper inside the clip, never on the timed media.
- Crop or mask reveals: `clip-path` or a mask on an inner wrapper.
- Constant speed change: playback rate 0.1–10, pitch preserved.
- Speed ramp: a rate automation lane on the media (0.1–10).
- Freeze mid-source: export a still and place it as its own clip.

### Small techniques (`references/film.md`)
- **Highlighter across lines**: tween a custom property on a `background-size` band with `box-decoration-break: clone`.
- **Hiding a round-capped line** before draw-on: `stroke-dasharray="100 120"` with `stroke-dashoffset="110"` on `pathLength="100"` (equal dash, gap and offset leaves a dot). Give `getTotalLength()` a fallback, since it can return 0 before layout.
- **Locating a point in an image**: a direct guess misses by 16–24% of the frame. Narrow it with a numbered 9×9 grid, then 6×6 on the crop, then a check render (≈ 2% error) (`scripts/locate.mjs`).
- **Map camera bake**:
  - render the move once to an all-intra MP4 over satellite tiles (`scripts/bake-basemap.mjs`, MapLibre);
  - globe-to-street dive: `PROJECTION=globe ZSTART=1.85 ZEND=16`;
  - draw borders, pins and labels live from the exported coords, animating them only while the camera holds;
  - credit "Esri, Maxar, Earthstar Geographics" or "© CARTO, © OpenStreetMap" in small type on a soft dark backing.
- **Website as subject**: show its screenshots; rebuild only the part that moves, or overlay captured assets at measured positions. Push in past 1:1 only with a 2× capture.
- **Pull-request films**:
  - length from diff size: ≲ 50 lines → 20–40 s; 50–200 → 40–70 s; 200–600 → 70–110 s; ≳ 600 lines or 25+ files → 110–180 s;
  - show 2–4 hunks of 4–12 lines; put +N/−M on a stat card, not in the VO;
  - credit commit authors by commit count; never invent a version.

### Launch end card (`types/launch.md`)
- The mark lands in the last **5–10%** of the film, centred, with the lockup at **15–30%** of the frame width.
- It's performed: the cursor clicks the mark and a fill rises through it, or a character carries it in; then the wordmark wipes in.
- Then the CTA (a real button or the command to type) holds **1.5–3 s**.

### Talking-head layout tables (`references/overlays.md`)
- Video placement (x, y, w×h):

| layout | landscape | portrait |
|---|---|---|
| split | 960, 0, 960×1080 | 0, 960, 1080×960 |
| stack | 14, 14, 1892×548 | 0, 0, 1080×844 |
| overlay | full frame | full frame |

- PiP, 28 px from the edges:

| canvas | source | rectangle |
|---|---|---|
| landscape | 16:9 | 1432, 28, 460×258 |
| landscape | 9:16 | 1644, 28, 248×440 |
| portrait | 16:9 | 690, 28, 360×203 |
| portrait | 9:16 | 738, 28, 312×555 |

- Zones:
  - lower third = the bottom 30%;
  - side panel = the right 42% (landscape) or the bottom 40% (portrait);
  - glass card slot = 48, 460, 660×540 (landscape) or 24, 1280, 1032×564 (portrait).
- Re-encode footage with keyframes more than ~1 s apart (`-g <fps>`), or it freezes on seek.

### Storyboard approval loop (`references/storyboard.md`, `storyboard-format.md`)
- Pose each shot at its key moment in the real composition with real words, fonts and colours.
- Snapshot all stills in one run to `boards/stills/frame-NN-at-<s>s.png`.
- Write a board page:
  - one `.frame` card per still, with `.title` "NN: name" and `.time`;
  - an optional `.words` line and `.act` headings.
- Restore the film, then stop for a "go". Notes re-pose only the frames they name.
- `STORYBOARD.md` frontmatter: `format`, `duration`, `message`, `arc`, `audience`, `mode`.
- Each frame: `status` (outline → built → animated), `src`, `duration`, `transition_in`, `scene`, `voiceover`, `poster`, plus the `reads` and `sound` extras.

### Registry overview (`skills/hyperframes-registry/SKILL.md`, `references/discovery.md`, `registry/registry.json`)
- At this commit: **210 blocks + 238 components + 8 examples**. The skill says "about 450"; `discovery.md`'s "180 blocks" is out of date.
- Blocks are scenes with their own timeline; components are snippets merged into a scene.
- Categories (from the skill):
  - blocks: transitions; overlays and lower thirds; title cards and kinetic type; social, chat and UI cards; code, charts, data and maps; 3D, shader and backgrounds;
  - components: motion primitives and text effects; caption styles; camera moves; product demo and UI props; textures, particles and effects.
- Largest tags:
  - motion-primitive 125, showcase 62, transition 52, typography 45, overlay 43;
  - webgpu 40, background 34, reveal 30, carousel 27;
  - captions 17, camera 17, caption-style 16, cursor 15, title-card 15, lower-third 13, handwritten 13, vertical 13.
- **Hero primitive shelf** (`registry/components/CATALOG.md`, 21 items):
  - accent is an enum (green → `--brand`, blue → `--accent`, violet → `--accent-2`) and marks ONE element;
  - `exit` defaults to none, so primitives hold their final frame and the frame root owns transitions;
  - `cues` lists comma-separated seconds that lock reveals to narration;
  - "Extra duration becomes HOLD, never a time-stretched animation".

### Caption styles
- Registry components, `registry/components/caption-*`:
  - `caption-highlight`: a red background sweeps behind each active word, TikTok-style.
  - `caption-pill-karaoke`: a pill container with a per-word karaoke colour highlight.
  - `caption-editorial-emphasis`: two fonts with dramatic size contrast for emphasis words.
  - `caption-weight-shift`: an elegant font-weight transition between lines (minimal).
  - `caption-clip-wipe`: a left-to-right clip-path wipe per word.
  - `caption-kinetic-slam`: a full-screen single word, alternating entrance directions.
  - `caption-camera-follow`: one sentence written across a world bigger than the frame. Each word is sized against everything written so far and the camera pulls back at a steady rate (portrait).
  - `caption-parallax-layers`: 3D text layered behind the subject with a vertical stretch.
  - `caption-blend-difference`: auto-inverting text via `mix-blend-mode: difference`.
  - `caption-texture`: a flowing texture mask over large uppercase text (lava, marble, metal, wood, concrete, rock).
  - `caption-gradient-fill`: gradient-clipped text with an elastic entrance.
  - `caption-emoji-pop`: emoji with stroked text and a horizontal squeeze entrance.
  - `caption-matrix-decode`: character scramble before the reveal.
  - `caption-glitch-rgb`: RGB aberration with a CRT scanline overlay.
  - `caption-neon-glow` and `caption-neon-accent`: cyan and magenta neon (both BANNED-adjacent, "neon").
  - `caption-particle-burst`: keywords trigger particle explosions (BANNED-adjacent, "particles").
- Related blocks:
  - `mk-callout-highlight`: word emphasis driven by one scalar synced to VO;
  - `streaming-text`: words arrive in uneven AI-token bursts, landing grey and inking to full colour;
  - `inline-highlight`, `marker-highlight`: hand-drawn highlight, circle, underline or scribble on one word;
  - `hw-callout-circle`, `hw-underline`.
- The 13 preset caption skins (karaoke, one group at a time, word pop scale and ease per preset) are in Part 1.
- The Changelog caption rail is in Part 2.
- The Vignelli, Swiss Grid, Warm Grain and Play Mode caption looks are in Part 3.
- The tone and energy tables are T82–T83.

### Transitions in the registry
- Shader transition blocks (≤ 2 per video, `discovery.md`), 14:
  - `chromatic-radial-split`, `cinematic-zoom`, `cross-warp-morph`, `domain-warp-dissolve`;
  - `flash-through-white` ("rarely a neutral default"), `glitch`, `gravitational-lens`;
  - `light-leak`, `ridged-burn`, `ripple-waves`, `sdf-iris`;
  - `swirl-vortex`, `thermal-distortion`, `whip-pan`.
- Galleries (reference only), `transitions-*`: 3d, blur, cover, destruction, dissolve, distortion, grid, light, mechanical, other, push, radial, scale.
- Standout primitives:
  - `cut-the-curve`; `whip-pan-cut` (capped directional blur, matched velocity, speed ramp);
  - `match-cut` (a circle accelerates into a one-frame swap and continues);
  - `text-match-cut` (one line becomes another, hard swap at peak speed on one easy-ease curve);
  - `type-match-cut` (a headline splits around an incoming panel);
  - `zoom-through-transition`, `iris-reveal`, `morph-swap`, `parallax-zoom` / `parallax-unzoom`;
  - `shared-axis-y` / `shared-axis-z` (editorial word swaps);
  - `beat-freeze-cut` (speed ramp + freeze hit + hard cut for music);
  - medium-true wipes: `torn-paper-rip`, `paper-collage-reveal`, `ink-bleed-reveal`, `halftone-dissolve`, `hw-scribble-transition`;
  - `mk-clone-wall-transition` (a tiled word wall inverts and clears);
  - `curtain-reveal`, `fade-through`, `grid-pixelate-wipe`, `slit-scan-reveal`, `chromatic-aberration-wipe`, `colorama-wipe`.

### Camera moves
- `camera-shake`: nine measured handheld, telephoto and rig profiles, closed-form and seek-safe.
- `push-in`: one slow continuous push on a headline.
- `pull-back-reveal`: hold a tight detail, then one decelerating pull-back reveals the context.
- `pan-stations`: a lateral pan across feature stations with a dwell at each.
- `ui-focus-zoom`: an app surface settles, then the camera zooms and pans to an anchored region.
- `cursor-zoom-follow`: screen-recording auto-zoom toward each click on a spring.
- `parallax-device-dive`: a phone rises, then the camera pushes through its screen.
- `scroll-camera-story`: a forced-scroll pass with parallax depth layers.
- `focus-rack`: focus shifts between two cards at different depths.
- `camera-rig-depth-stack`.
- `yt-camera-move`: zoom, slide and 3D tilt-pan helpers with an edge-defocus pulse.
- Blocks:
  - `camera-dolly-zoom` (the vertigo effect);
  - `rack-focus` (WebGL, with real aperture bokeh);
  - `frost-sequence-camera-orbit`;
  - `orbit-card` ("a single feature card orbits a dot sphere on approved Blender camera motion").

### Lower thirds (blocks, 1080p, 4.8 s)
- `lt-clean-bar` (white card, accent tab, clip-wipe).
- `lt-accent-underline` (cardless, the rule draws on).
- `lt-side-rule` (vertical accent bar, condensed name + mono role).
- `lt-kicker-name` (kicker tag, heavy name, drawn baseline).
- `lt-mask-reveal` (an accent sweep clip-reveals the name).
- `lt-dark-card` (charcoal for bright footage).
- `lt-soft-pill` (white pill with a status dot, scale-pop).
- `lt-bold-block` (dark block wipe + name slam).
- `lt-color-block` (accent block with overshoot).
- `lt-stack-bars` (name bar from the left, role bar from the right).
- `lt-neon-border` (BANNED-adjacent glow).
- Also: `lower-third-bild` (news), `news-ticker`, `yt-lower-third`.

### Titles and kinetic type
- Components:
  - `titlecard-calm` (a mono kicker + generous grotesque fading up, a clean exit);
  - `titlecard-lockup` (the "calm breather": the wordmark settles dead centre, a hairline draws, a truly still hold);
  - `headline-slam` (scales down into frame, a deterministic three-frame shake);
  - `per-word-rise`, `per-word-crossfade`, `kinetic-type-swap` (one slot rolls through options);
  - `kinetic-center-build`, `tracking-in` (a letter-spacing reveal);
  - `variable-axis-type` (a weight or width axis morphs on the emphasis beat);
  - `slot-machine-roll`, `number-wheel`, `scramble-reveal`, `strikethrough-replace`;
  - `mk-emphasis-type` (an oversized low-contrast word behind the subject as texture).
- Blocks:
  - `split-flap-board` (a Solari board);
  - `hw-write-title` (true glyph write-on in stroke order);
  - `hw-title`;
  - `extruded-logo` (beveled 3D letters flip up; chrome, gold or matte);
  - `canopy-part-title`, `glass-shard-title`, `wireframe-portal-title`, `code-slice-hero`.

### Data, product demo, code and social
- Data:
  - `count-up` (lands on the exact integer with one restrained scale pulse);
  - `chart-story` (builds in reading order, an accent callout on one datum);
  - `data-chart` ("NYT-style typography");
  - `bar-chart-race`;
  - `mk-progress-stat`, `mk-line-graph`, `mk-usage-arc`, `conic-progress-ring`, `star-rating-fill`, `decline-chart`;
  - maps: `us-map*`, `world-map`, `spain-map`.
- Product demo:
  - `browser-device-stage`, `oversized-cursor` (3.5× the macOS arrow), `press-ripple`;
  - `before-after-wipe`, `grid-card-assemble` (no overshoot, then still);
  - `screen-flow-carousel`, `notification-stack`, `telemetry-hud`, `segmentation-flood`, `toggle-flip`.
- Code (all 1080p, need a caption inset):
  - `code-typing`, `code-diff`, `code-morph`, `code-highlight`, `code-scroll`;
  - GPU heroes: `code-3d-extrude`, `code-shader-dissolve`, `code-particle-assemble`;
  - 24 `code-snippet-*` themes.
- **Native portrait blocks** (1080×1920): `chatgpt-exchange`, `claude-exchange`, `instagram-follow`, `tiktok-follow`, `spotify-card`, `slack-notification-ad`, `heygen-avatar-promo-card`.
  - Portrait-tagged: `message-thread-reveal`, `notes-reveal`, `notification-cascade`, `share-sheet-carousel`, `ai-chat-reveal`, `yt-vertical-fill`; `flowchart-vertical` is 1440×2560.
- End cards: `cta-close`, `logo-brand-close`, `store-badge-lockup`, `social-proof-card`, `logo-outro` ("glow bloom" is BANNED-adjacent).

### 3D, textures and backgrounds
- 3D objects:
  - `product-turntable` (a GLB on a studio plinth, a seamless loop);
  - `exploded-stack` (isometric layer plates explode apart with labels, for architecture diagrams);
  - `extruded-logo`;
  - `vfx-iphone-device` / `macos-tahoe-liquid-glass` (GLTF devices; need WebGPU).
- Texture and finish:
  - `grain-overlay`, `grain-field`, `vignette`, `ordered-dither-pass`, `ascii-render-pass`, `halftone-field`;
  - `stop-motion-cadence` (quantises time to `floor(t*fps)/fps` for every motion: on-twos or stepped animation);
  - `hw-boil` (hand-drawn line boil);
  - `cinemagraph` (a still photo with one living region);
  - `freeze-frame-dressing` (paper, tape and flash on a freeze or cutout);
  - `camcorder-hud`, `editorial-flash-overlay`, `filmed-screen` (a scene filmed off a monitor, with DOF, LED sub-pixels and per-shot grades).
- Backgrounds (many BANNED-adjacent: aurora, mesh gradients, nebula, orbs): `aurora`, `mesh-gradient`, `flowing-gradient`, `plasma`, `starfield`, `godrays`, `lens-flare`, `chrome-orb`, `cosmic-orb`, `liquid-metal`, `marble`, `stripes`, `voronoi`, `worley-noise`.
  - Under the BANNED list, use them only when the brand or medium calls for it.

### Changelog mock-UI routing (`.claude/skills/changelog-video/references/visualization-registry.md`)
- Route each item, strongest first:
  - **ui-recreate** (a faithful mock);
  - **ui-analog** (an honest metaphor whose *behaviour* is the change: caching = a second request row short-circuiting to ✓; batching = brackets around tick groups; concurrency = chips at a gate);
  - **terminal**;
  - **checklist** (last resort, ≤ 6 rows).
- "Never invent UI that implies a screen that doesn't exist."

### Not opened or not read in full
- Not read in full, by choice:
  - the `frame-showcase.html` contact sheets (I used them only to confirm the Google Fonts and the Biennale bloom gradient);
  - the other `.claude/skills` scripts (`align-captions.mjs`);
  - most block and component HTML. I read every `registry-item.json` description, but not the code.
- The `/hyperframes` `story`, `spec`, `storyboard`, `review`, `captions`, `overlays`, `runtimes`, `look`, `film`, `format` and `motion` references, all 7 type guides, all 13 `FRAME.md`, and all 6 `.claude/skills` SKILL.md files were read in full.
- Not read, as irrelevant to styles: `references/skill-lifecycle.md`, `references/plugin-installation.md`, the cloud, Lambda and render references, and the other published skills (`figma`, `slideshow`, `remotion-to-hyperframes`, `reverse-any-video`, most of `media-use`). From `media-use` I did read the caption `authoring.md` and `motion.md`, plus the headers of `grading.md` and `media-treatments.md`.
- Nothing failed to open.

