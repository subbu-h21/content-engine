---
name: style-paper-form
description: Visual style "Paper Form": a deadpan bureaucratic form on bone paper, typewritten in IBM Plex Mono as it is spoken, ticked and crossed in signal orange, struck through with an orange marker and slammed with a distressed rubber stamp under an ink header band. Use when a video is made in this style.
---

# Paper Form

## 1. In one line

A deadpan bureaucratic form: typed as it is said, ticked and struck by an orange marker, and slammed with a rubber
stamp. It suits comparisons (old way vs new way), checklists, verdicts, process charts, FAQs and humour, and works as
a light, palette-inverted breather inside a dark video (it pairs with `plotter-on-ink`). No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#eae5dc` | the page: bone × 0.965 in linear light, then darkened up to ~6.5% by fibres and cloud |
| text (ink) | `#0a0a0b` | typed answers, box outlines, rules, arrows, section labels |
| surface (band) | `#171716` | the header band (ink at 94% over the paper) |
| bone | `#eee9df` | header text on the band |
| muted (graphite) | `#5e5b57` | the printed 24 px grid (at 3.5%), box notes, fine print (at 75%) |
| faint (ash) | `#9c978f` | empty checkboxes, dotted answer lines *(proposed)* |
| accent (signal) | `#ff4d12` | typing heat, ticks, crosses, the marker strike, the stamp |
| accent2 (blood) | `#c21d0b` | proposed-row numbers, chosen answers, totals on the good row |

## 3. Typography

- **Header band:** Archivo 900 at width 112.5 (variable font), 76 px, bone on the ink band ("FORM 7-B"); beside it
  spaced mono caps 26 px (0.18 em) and a 24 px subtitle at 70%.
- **Section labels:** IBM Plex Mono 600, 26 px, 0.18 em tracking, numbered ("2. COLOUR OBSERVED").
- **Typed answers:** Plex Mono 400, 40–44 px, sentence case, each character jittered ±0.8 px (typewriter).
- **Box names:** Plex Mono 500, 32 px, uppercase. **Box notes:** 24 px graphite. **Options:** 500, 30 px, 0.14 em.
- **Fine print:** 24 px graphite at 75%.
- **Stamp:** Archivo 900 (up to 150 px) with a 28 px mono line.
- Source sizes were for a 1720 px page in a 16:9 frame; these are scaled for 1080×1920 *(proposed)*. The smallest
  text is 24 px.
- **Emphasis:** a signal tick, a blood answer, a struck row or the stamp. Never bold type.
- **Words on screen:** a full form (up to ~40 words in small type) but one line is being typed at a time.

## 4. Layout

- **The page fills the frame** (re-laid out for vertical: the source shows a 1720 px page in a 16:9 frame).
- **Margins:** 80 px; the column is 920 px.
- **Header band** at y 236–364, the full column wide; a 1.6 px ink rule 34 px under it.
- **Sections** run down the page from y 460: numbered label, then answer lines, checkboxes, boxes or a table.
- **Process rows** run vertically here (boxes 800 × 130 with 100 px between and arrows between); the source ran them
  horizontally (5 × 262 px or 4 × 300 px boxes, 116 px tall).
- **Totals** right-aligned in the margin ("STEPS 3 · CHECKED 3").
- **Fine print** at the foot (rule at y 1500), inside the 330 px bottom safe zone. Top safe zone 230 px.
- **Alignment:** left; the stamp is centred and rotated.

## 5. Elements

- **Paper:** fibres (fractal noise stretched ×0.004 / ×0.05, −3.5%), cloud (×0.0025, −3%), sparse darker specks, and a
  printed 24 px grid in graphite at 3.5%.
- **Boxes:** square ink hairlines, 1.6 px (2.4 px for the proposed or key row), with a "1.1"-style number (blood on
  the key row) and a graphite note under them.
- **Arrows:** pen-drawn, 2.2 px, 14 × 8 px open heads.
- **Checkboxes:** 38 px squares; ✓ and ✕ are drawn strokes in signal, 5 px.
- **Marker strike:** a 12 px wobbling signal line (sine + noise) through a whole row, multiplied into the paper.
- **Rubber stamp:** a 12 px outer and 4 px inner border, Archivo 900 text, a mono line, knocked out by 3,600 speckles
  and 34 dry streaks, in signal at 92%, rotated −0.07 rad, multiplied into the paper. One per form.
- **Answer lines:** dotted ash lines; an empty one is a joke waiting for its answer.
- **"For office use only"** boxes, signature lines and form numbers (`FORM 7-B`): deadpan furniture.

## 6. Motion

- **Boxes** fade in over 0.2 s just before their word.
- **Typing:** each word types over 85% of its spoken time; it runs hot in signal and cools to ink (or blood) over
  0.35 s after the word.
- **Arrows:** the line in 0.16 s, the head in 0.07 s, on each spoken "to".
- **Ticks and crosses:** drawn in 0.14 s, ease-in-out-quad *(proposed: the source draws strikes in 0.08–0.2 s)*.
- **Marker strike:** 0.3 s, left to right.
- **Stamp:** scale 1.6 → 1 in 0.12 s ease-out-expo, opacity in 0.05 s; the page takes a zoom of +2.5% and a 7 px shake
  decaying with a 0.07 s half-life; a strike adds +1% zoom.
- **Camera:** reads along the rows (ease-out-expo or ease-in-out-cubic moves) with a hand-held drift of ±6 px, ±5 px
  and ±0.004 rad of slow noise (0.5–0.7 Hz).
- **Holds:** 0.6 s after the last mark *(proposed)*. Nothing exits; the form cuts away.

## 7. Transitions and rhythm

- Enters by a **hard cut** in the pause before its line (0.18 s before the first word); leaves by cutting back to ink
  0.12 s before the next line.
- One mark per spoken beat: a typed word, a tick, a strike, then the stamp on the verdict.
- **Sound:** typewriter strikes every 0.05–0.075 s with swing, key clicks, a marker squeak, paper slide, the stamp
  thud, all ducked under the voice.

## 8. Finish

- Bloom 0.15 (threshold 1.4: almost none), halation 0.05, chromatic aberration 0.6 px (in a video's post pass).
- **Grain** 0.04, **vignette** 0.28.
- The HUD and captions switch to "paper" mode: ink crop marks and captions, **no dark halo behind captions**.

## 9. 3D look

None.

## 10. Banned

- A light-blue grid or ruled lines (off-palette); the grid is graphite at 3.5%.
- A dark halo or shadow behind captions on paper.
- Rounded, friendly UI: the form is square and bureaucratic.
- More than one stamp per form.
- Colours other than ink, graphite, ash, signal and blood on the page.
- Handwriting fonts or emoji ticks.
- A cheerful tone: the form is deadpan; the joke is in the content.

## 11. Where it came from

- **Motion as Code kit** ("the engine and style of pdoom-video"): the bone-paper forms, `app/src/scenes/pipeline.ts`
  ("FORM 2-B", a process chart) and the first half of `verdict.ts` ("FORM 9", an exit questionnaire), with the
  engine's palette, post and HUD code. `D:\code_files\resources to make content engine\aman thakur's resources\Claude
  workflow guide\Motion_as_kit.zip`. Research notes: `docs/research/styles/local-guides.md`, "Motion as Code — Bone
  Paper Form". Licence: **MIT** (© 2026 Giacomo Magnanini); no code copied, the look is rebuilt. Archivo and IBM Plex
  Mono are SIL OFL.
- **Taken:** the palette and paper derivation, fonts and widths, line weights, arrow, marker, tick and stamp values,
  paper texture scales, typing heat, box timing, stamp slam and hits, hand-held camera, cut timing, finish values.
- **Proposed:** every px size for 1080×1920, the ash role for empty marks, tick timing, holds, the form names and
  office furniture in the samples.
- **For vertical:** the page fills the frame instead of floating in 16:9; process rows run top to bottom; type is
  scaled up for the phone (answers 40–44 px instead of 30–46 px on a much wider page).
- Added to the catalog on 2026-10-31.
