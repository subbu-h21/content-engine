---
name: style-swiss-poster
description: Visual style "Swiss Poster": International Typographic Style in motion; a visible 6-column grid on a warm grey page, white poster sheets built from flat black bars on their own grid, one neo-grotesque (Archivo) set flush left, giant numerals beside tiny technical notes, caption rows under 1 px rules, and one signal colour (red by default) for the single protagonist; every move snaps onto a 120 BPM beat. Use when a video is made in this style.
---

# Swiss Poster

## 1. In one line

International Typographic Style in motion: a modular grid, one typeface, one signal colour, and every move landing on
a beat like a printing press. It suits rules and steps, spec sheets, timetables, feature lists, brand systems,
countdowns and facts with one big number. No footage, no 3D.

## 2. Palette

Paper, ink, greys and exactly one signal colour, chosen per topic, never a second. Black type may overprint the
signal.

| Role | Hex | Where |
|---|---|---|
| background (page) | `#eae9e5` | the frame's ground |
| surface (paper) | `#ffffff` | poster sheets (the artifact) |
| text (ink) | `#111111` | all type and the black bars |
| muted (grey) | `#6f6e6a` | lead-ins and technical notes *(proposed: the source says "Medium grey")* |
| faint (grid on page) | `#cfcec9` | the page's column lines |
| accent2 (second voice) | `#cfcec9` | light-grey bars under or beside the black ones (not a colour) |
| gridBuild | `#c9c8c2` | grid lines while they draw in |
| gridPaper | `#e2e1dc` | grid lines on the paper |
| accent (signal) | `#e30613` | the one protagonist: the circle (here the sun) and the knife line |

Other signal sets for other topics (page / ink / signal): orange `#f2f0ea` / `#141414` / `#ff5a00`; ultramarine
`#e9ecef` / `#0b0b0b` / `#1f3fff` (in `style.json` under `signals`). Use one set for a whole film.

## 3. Typography

- **One family for the whole film:** Archivo (Regular 400, Medium 500, Bold 700). Never Helvetica or Akzidenz files.
- **Sizes at 1080×1920:**
  - titles 116–140 px Bold, two lines, flush left, lowercase allowed (`why is the sky / blue?`);
  - statements 96 px (a lead-in of 32 px Medium grey above them);
  - rule numerals 150 px Bold; rule lines 56 px Medium;
  - giant numerals 640–780 px Bold, bottom-aligned, optically flush left;
  - notes and caption rows 24–26 px Medium under a 1 px rule; technical notes 26 px grey; sign-off 40 px.
- **Tracking** −2.2% at 90 px and up; leading 0.98.
- **Emphasis:** scale contrast (a giant numeral beside tiny notes) and weight (Regular for the lead, Bold for the
  statement). Never colour, except the one signal element.
- **Words on screen:** a statement of up to about 8 words; subtitles are part of the layout (each line at a column
  start, each word clip-revealed on its timestamp).
- **The smallest text** is 24 px.

## 4. Layout

- **Page grid:** 6 columns of 136 px, 72 px margins, 24 px gutters, a 24 px baseline; the column lines are visible on
  the page.
- **The frame as a stacked spread:** the programme (lead-in, statement or numeral, notes) at the top or bottom, the
  artifact (a white poster sheet on its own grid, derived from its content: 6–7 columns, 10–12 rows) on the grid
  columns. Fewer, wider modules so bars have mass.
- **Flush left, ragged right.** Big white space is part of the layout.
- **Corner technical notes** (`Columns 7 · Rows 12 · Module 111 × 72`, `bar 01.1`) and a coordinate readout beside the
  exception (`col 3.50 · row 6.00 · on grid`).
- **Safe zone:** 230 px top, 330 px bottom. Lead-ins sit on y ≈ 290; technical notes end above y = 1560.
- **A final composition** has one strong diagonal of long and short bars, the signal at about 2× scale bleeding off
  the paper edge, and type over the signal colour.

## 5. Elements

- **Bars:** flat rectangles, a module's width minus 8 px; consecutive cells merge into one bar. Black, or light grey
  as the second voice.
- **Caption rows:** a 1 px rule above, Medium text under it.
- **The signal circle:** the one protagonist (the sun in the sample).
- **The knife:** a 2 px signal line crossing an element.
- **Technical notes, a coordinate readout, a playhead, a wall of artifacts from the same system.**
- **No icons, gradients, shadows or device renders.**

## 6. Motion

Two curves only: the snap `cubic-bezier(.7, 0, .2, 1)`, and linear for lines being drawn, playheads and the
exception. No overshoot, spring or bounce. Durations are note values at 120 BPM: 1/16 = 0.125 s, 1/8 = 0.25 s; a
snap starts one note early and lands on the beat.

- **word:** each word rises out of a clip rect from below its baseline in 1/16, one after another; it leaves upward
  in 1/8.
- **snap:** bars grow along their length in 1/8 from one end.
- **line:** rules and grid lines draw in linearly (0.5 s for the grid).
- **wipe:** a poster sheet appears by a vertical wipe (0.5 s).
- **climb:** a giant numeral climbs into place in 4 eased steps of 1/16.
- **knife:** the 2 px line crosses in 1/16, then the cut element collapses to its midline in 1/8.
- **The exception** (the signal) moves linearly, unsnapped, pauses one eighth mid-flight, and grows as it travels.
- **Ripple / re-flow:** ordered by distance from the cause, two units per sixteenth, nearest first.
- **Camera:** a 2D matrix that moves only with the snap and only on beats: a locked spread, a hard pan by a page or
  column, a 90° turn and stop, a pull-out to a wall of artifacts, a push into one module, a vertical scroll down a
  column.
- **Holds:** every line ≥ max(1.8 s, speech + 0.6 s).

## 7. Transitions and rhythm

- Wipes, knife cuts, camera moves and re-flows. Never dissolves.
- A steady pulse (120 BPM) sets every snap; one element is added per rule; one near-silent bar before a reveal;
  silence is a hard stop of everything on a downbeat. Visual onsets fall on whole frames.

## 8. Finish

None by design: no gradients, glow, shadows, particles or grain.

## 9. 3D look

None.

## 10. Banned

- Gradients, glow, shadows, particles, grain, device renders (not a keynote).
- Words that fly, spin or bounce; overshoot, springs, bounce.
- Fades and dissolves.
- A second signal colour; colour for emphasis.
- A Bauhaus pastiche of primary shapes; copying a historic poster's composition (no concentric-circle or fan layouts).
- Helvetica or Akzidenz files; naming a real institution.
- Rotating and labelling at the same time.
- Too many thin columns (it reads as a chart); centred layouts.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 16 "Swiss"
  (Swiss Motion Graphics). Research notes: `docs/research/styles/five-skills.md`, "Swiss Motion Graphics". Rebuilt with
  CSS and SVG in Remotion; no code was copied. Archivo is SIL OFL.
- **Taken:** page `#EAE9E5`, paper, ink `#111111`, signal `#E30613`, the grid-line and second-voice greys, the two
  alternate sets; the one-signal rule; Archivo as the one family (the demo's face), the size roles (title 120 px Bold
  in two lines, lead-in 30 px Medium + statement 76 px Bold, notes ~19 px with a 1 px rule, sign-off 36 px), −2.2%
  tracking, lowercase headlines, emphasis by scale and weight; the grid logic (12 columns, 96 px margins, 24 px
  gutters, 24 px baseline at 1920 wide; the artifact's grid derived from content), bars (column − 8 px), technical
  notes, the coordinate readout, the knife line; both curves, note-value durations, clip reveals, linear lines, the
  vertical paper wipe, numerals climbing in 4 steps, the knife cut and collapse, ripples, the exception's linear
  move with a pause; the camera vocabulary, transitions, rhythm, no finish, the banned list.
- **Proposed:** the grey `#6f6e6a`; the 6-column vertical grid (136 px columns, 72 px margins); every px size for
  1080×1920; the wording of notes and lead-ins; the signal circle standing for the sun.
- **For vertical:** the source frame is a landscape spread (programme on columns 1–6, a 706 × 1008 px poster on
  columns 8–12). Here the spread is stacked: the programme above or below a poster sheet that spans 5–6 of 6
  columns; type is larger (statements 96 px vs 76 px; notes 24–26 px vs 19 px), and each sample shows one statement
  or one numeral with its notes.
- **Kept apart from Clean Launch** (white, tight sans, a red now-dot, mist windows): this style shows its grid, builds
  posters from bars on a warm grey page, and uses the signal only as the one exception (here a circle), never as a
  dot in type.
- Added to the catalog on 2026-10-31.
