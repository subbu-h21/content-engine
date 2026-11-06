---
name: style-watercolor-wash
description: Visual style "Watercolor Wash": a naturalist's field-journal page that paints itself on warm fibrous paper; translucent washes that darken by passes, dry-brush strokes with flying white, Cormorant Garamond titles with italic emphasis, Caveat hand notes on pen leader lines, spaced IBM Plex Mono labels and one vermilion seal sun. Use when a video is made in this style.
---

# Watercolor Wash

## 1. In one line

A naturalist's field journal that paints itself: washes bloom, brush strokes drag and break into flying white, and
hand-written notes point at each specimen. It suits nature and geography, science explainers, specimen-and-label
explainers, processes and gradients (rain, altitude, depth), and maps that change through time. No footage, no 3D.

## 2. Palette

The paper is the white: nothing is ever painted white. Darker means more passes of the same wash, never a darker
pigment. A scene uses 3–5 hues plus ink.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f1e9da` | the sheet; also the mist that erases a page |
| text (ink) | `#2b2520` | titles, hand notes, leader lines, the darker brush edge along a form |
| muted (ink 2) | `#3d3129` | mono labels, stems, branches, horizon lines |
| faint (pencil) | `#b9ab95` | guides and dimension lines *(proposed)* |
| accent (vermilion) | `#cf4f2c` | the seal sun only: one accent for one recurring element |
| sunBar | `#b8401f` | the seven dry-brush bars across the seal sun |
| accent2 (rain blue) | `#3f7fa8` | the strongest blue: scattered light, the blue bar, a sky dome |
| sky | `#9fb4c4` | the pale sky wash |
| deep | `#5f7486` | extra passes at the top of a sky; the molecule |
| warm | `#f3e2c8` | a warm dawn wash low in a sky |
| ochre | `#cda35f` | sunlight strokes, dry grass |
| rust | `#cf7c4f` | red light (long waves), warm hills |
| green | `#7f9a6c` | hills; green in a spectrum |
| violet | `#6b5b8e` | violet in a spectrum only *(proposed)* |

A colour may carry data or mood. A map ramp is quantised into 4–6 bands, never a continuous ramp.

## 3. Typography

- **Titles:** Cormorant Garamond 500, sentence case, *italic* for emphasis in the same ink. Title 128 px, headlines
  up to 100 px (lower so the longest line fits the 888 px column, never below 64 px), leading 1.02. 1–3 lines,
  about 10 words at most.
- **Numbers:** Cormorant Garamond 500 at 300 px, the unit in italic.
- **Step lines:** Cormorant Garamond 500 at 58 px.
- **Body and subtitles:** Cormorant Garamond italic 500, 42 px, line height 1.2, ink 2. On the paper, never in a box.
- **Hand notes:** Caveat 600, 48 px, ink at 78%, drawn twice over a 12 px paper-coloured halo. Lowercase like a
  field note. 1–5 words.
- **Measured labels:** IBM Plex Mono 400, 24 px, spaced caps with 3 px tracking (`02 — HOW IT WORKS · FIG. 2`,
  `BLUE · 450 NM`).
- **The smallest text** is 24 px. Emphasis is italic, a hand note, or the one accent: never bold.

## 4. Layout

- **Margins:** 96 px each side; the column is 888 px.
- **Safe zone:** 230 px top, 330 px bottom. The mono label sits on y = 250.
- **One hero subject per page with its note.** Notes sit beside the specimen and reach it with a leader; they never
  cover it.
- **Paintings may run to 60 px from the frame edges** (washes are part of the page, not text); text stays in the
  column.
- **Typical page:** label at the top, the painting in the middle band (y 330–1250), the title or body under it
  (y 1290–1590).
- **Alignment:** left; the end card is centred.
- **Depth** by layers: farther = smaller, lighter, less saturated; paper-coloured mist between layers.

## 5. Elements

- **Wash:** one shape laid in 3 passes, each jittered up to ±7 px, at alpha ÷ 3 × 1.6 each; edges displaced by
  smooth noise (scale 16), a pooled rim (4 px, blurred 1.6, alpha × 1.7), a cloudy density lift (alpha × 0.4–1.0 on
  a ~200 px noise) and granulation (±22% alpha) *(rim strength, lift and granulation proposed)*. Overlapping washes
  darken like transparent pigment. An upper pass of a sky may run out softly over its last 30–60% (a wet edge).
- **Dry-brush stroke:** a ribbon with ±22% width noise, filled at opacity × 0.62 (0.92 without bristles; opacity
  0.92 by default), plus clamp(round(w ÷ 3.2), 3, 9) bristle tracks. Each track leaves a darker streak (30–85% ×
  0.45), then, from 35–85% of the length on, breaks into paper-showing dash runs of 18–90 px with paint between them
  (6 px to w ÷ 2), and ends early at 70–100% of the length: the flying white. Profiles: `brush` (tapered both ends),
  `tip` (heavy start), `even` (bars).
- **The only line** is a darker brush edge along a form (ink 2 at 55%). No vector outlines.
- **Seal sun:** a vermilion disc (82%) laid by a growing round wipe, then 7 dry-brush bars in `#b8401f` cross it.
- **Hand notes** with pen leader lines (ink, 2.2 px, 85%, slightly curved) ending in a 4 px dot on the specimen.
- **Mono labels;** painted swatches and bars; a sky dome over a horizon line; hills as ragged ridges.
- **Paper:** base `#f1e9da`, a three-octave cloud ±3.5%, 2,600 short curved fibres ±3.5%, a fine tooth at 5%.

## 6. Motion

Smooth only: nothing jitters, steps, bounces or snaps.

- **paint** (strokes): along the stroke's length, ease-in-out `[0.42, 0, 0.58, 1]`; 0.9 s for a long stroke, 0.3–0.5 s
  for short ones. A list of strokes paints in order, structure before detail; each stroke takes 12–50% of its group's
  time.
- **wipe** (washes): a wavy brush-edge front (±30 px) travels down, up or right across the wash's box, ease-in-out
  1.2 s. Several passes of a sky start 0.3–0.4 s apart, top passes last.
- **burst:** a whole group paints at once in 0.9 s, for a peak.
- **seal:** the disc in the first 40% of 1.6 s (ease-out), the bars across the rest.
- **write** (hand notes, labels, titles): revealed left to right under a soft edge; notes take 0.045 s a character,
  titles 0.8 s a line with 0.25 s between lines. **leader:** grows after 60% of its note, ease-out 0.5 s.
- **subtitle:** fades in 0.25 s, out 0.35 s.
- **mist** (exit): paper-coloured layers with a wavy rising edge, 3.3 s.
- **Sway** only after an object is finished: skew = sway × (sin(1.15t + φ) + 0.4 sin(2.7t + 2φ)), 0.006 for trees,
  0.01–0.03 for grass.
- **Holds:** at least 1.5 s after the last stroke; every line ≥ max(1.8 s, speech + 0.6 s).

## 7. Transitions and rhythm

- **No hard cuts and no dissolves between unrelated pictures.** Change pages with a brush-edge wipe, a mist erase to
  blank paper, a page turn or a continuous camera (a long lateral dolly over one painted world, a tilt along a tall
  object, a slow push to a detail, a pull-back to a map).
- One painted event per spoken line; zones of 10–18 s in a long piece.
- **Silence** is "the brush lifted": music out, only paper and room.

## 8. Finish

- The paper texture above is the finish. Grain 0.02 *(proposed, the paper's own fine grain)*, vignette 0.05.
- No glow, bloom or blur.

## 9. 3D look

None.

## 10. Banned

- Vector outlines; a watercolour texture laid over vector art.
- Pure white paint; darker pigment for depth (use more passes).
- More than 3–5 hues in a scene plus ink; continuous ramps (quantise into 4–6 bands).
- Hard cuts or dissolves between unrelated pictures.
- Labels over the subject.
- Ink-wash calligraphy, impasto, crayon, cute outlines.
- Bold type, coloured type, more than one accent.
- Jitter, stepping, bounce; unseeded randomness.
- Copying a specific artwork, character or layout.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 02
  "Watercolor" (library name "Watercolor Brush", demo film *Follow the Rain*). Research notes:
  `docs/research/styles/five-skills.md`, "Watercolor Field Journal (lib: Watercolor Brush)". The look is rebuilt
  with SVG and CSS; no code was copied. Cormorant Garamond, Caveat and IBM Plex Mono are SIL OFL.
- **Taken:** paper `#f1e9da` and its texture recipe, ink and ink 2, vermilion seal sun with seven bars, rain blue;
  the harbour example's sky `#f3e2c8`, water `#9fb4c4` and hulls `#5f7486` (here warm, sky and deep); map-ramp
  colours for rust, ochre and green; the colour rules (paper is the white, passes not pigment, 3–5 hues, quantised
  ramps); the three fonts and their roles; the wash (3 passes, alpha ÷ 3 × 1.6) and dry-brush values (±22% width,
  rib 0.62/0.92, opacity 0.92, 3–9 bristles, 30–85%, runs 18–90 px, early ends); painting order, burst 0.9 s, seal
  1.6 s, mist 3.3 s, sway values, subtitle fades; transitions and banned list.
- **Proposed:** faint and violet; every size for 1080×1920; easing curves (the source names `ss`, `eio`, `eo` but gives
  no formula); note writing speed; leader timing; grain 0.02.
- **For vertical:** the source is one 1920×1080 painted world under a lateral dolly. Here each sample is one
  full-height journal page: the painting in the middle band, text under it, a mono label at the top. Type is bigger
  (titles 128 px instead of 124 px at 1080p height; notes 48 px instead of 26–42 px; labels 24 px instead of 15 px)
  and each page carries fewer elements (one specimen, two or three notes).
- Added to the catalog on 2026-10-31.
