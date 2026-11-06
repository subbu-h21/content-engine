---
name: style-dataviz
description: Visual style "Data Story": one real chart drawn mark by mark on cream dot-grid paper by a red-blue pencil, one number at a time; Newsreader headlines and figure captions, Caveat pencil notes pinned to the data, IBM Plex Mono ticks, a colour ramp that encodes the value only, un-closed rings, hatched ink shapes. True values only. Use when a video is made in this style.
---

# Data Story

## 1. In one line

A real chart drawn on cream paper with a red-blue pencil, one mark and one number at a time, with handwritten notes
pinned to the data. The chart is the camera, the rhythm and the plot. It suits data journalism, reports, climate and
science, and any series or ranking with a human angle. Real data is required: numbers are never changed.

## 2. Palette

Colour encodes one thing, the value. Everything else is ink on cream, and a change of pencil lead (blue → red) marks a
turn.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f6f3ec` | the sheet, with fixed-seed fibre noise |
| dots | `#e4ddcf` | the 24 px dot grid |
| text (ink) | `#2b2723` | axes (3 px), series line (4.4 px), dot rings, headline, caption |
| faint (gridlines) | `#ddd6c9` | 1.4 px |
| zero | `#bdb4a5` | the zero line |
| muted (ticks) | `#6e665c` | tick numbers and kickers |
| accent2 (blue lead) | `#2f5d8a` | human notes |
| accent (red lead) | `#a8283a` | records, the one number, the turn |
| wood | `#e3c79c` | the pencil's cone |
| ramp | `#2166ac` `#4393c3` `#92c5de` `#d1e5f0` `#f2eee8` `#fddbc7` `#f4a582` `#d6604d` `#b2182b` | data values only |

**Ramp rules:** diverging around a meaningful centre with a symmetric span; sequential (one half of the ramp) when
there is no natural centre. Never stretch a ramp for drama: pale values stay pale.

## 3. Typography

- **Newsreader** (Google Fonts, OFL): headlines 500 at 84–100 px, the title at 138 px, the number at 300 px; captions
  400 at 44 px, at most 2 lines, left-aligned with the margin.
- **Caveat** (OFL): pencil notes 600 at 58 px in a lead colour, per-glyph rotation ±1.7°, baseline jitter ±2.5%, graphite
  grain knocking out 16% of the pixels, written on left to right as the pencil moves.
- **IBM Plex Mono** (OFL): ticks 28 px, kickers 500 at 30 px. **Smallest text:** 28 px.
- **Case:** sentence case. **Emphasis:** the lead colour, an un-closed ring round the mark, a position pinned in data
  space. Never bold, never italic.
- **Words:** one idea per frame, at most 12 words besides ticks.

## 4. Layout

- **Plot box** (x 170–984, y 640–1260 by default): fixed in the frame; ticks left and below, axis names in mono.
- **The headline** sits above the plot in the frame's own space; **the figure caption** below it: a hairline rule at
  y = 1380, a mono kicker with the range drawn so far at y = 1424, the serif line at y = 1480.
- **A memory zone:** the chart's emptiest corner holds early notes and doodles.
- **Notes are pinned in data space** (a value plus a pixel offset), so rescales keep the layout. They sit above their
  mark; a late note sits above-left.
- **Margins:** 96 px. **Safe zones:** 230 px top, 330 px bottom. The newest mark sits at about 60% of the frame's width
  when tracking.
- **Pick the chart the data asks for:** bars (categories), scatter (relationship), map (place), unit or waffle (parts),
  slope or dumbbell (before and after), histogram (distribution), Sankey (flow), line, dots, stripes or area (time or a
  continuous axis).

## 5. Elements

- **Data dots:** r 12 with a 2.6 px ink ring, filled by value.
- **Leaders:** wobbly pencil curves ending in an un-closed ring round the mark.
- **Ink shapes:** flat fill + hatching (ink at 32%, 15 px apart) + a hand outline.
- **Doodles** in the memory zone (a hatched circle, rays, a small arrow): brackets, waves, sparkles.
- **The red-blue pencil:** a hex body, a sharpened wood cone, only the tip end showing, entering from the lower right at
  48° (the source's 35–58°); its shadow drifts farther and softer with lift.
- **A dashed next cell** for the unknown next value. **Stripes** for a continuous axis.
- **Paper:** fibre noise and the dot grid belong to the sheet and move with it.

## 6. Motion

- **Data rhythm = film rhythm:** marks land on a musical grid (0.1 s apart in the samples); accelerate by dividing the
  beat, never by changing tempo.
- **tap:** a dot lands with a 0.25 s pop from ×1.55 and a thin ripple (no ripples when marks land under 0.1 s apart).
- **draw:** pencil lines and axes, cubic-in-out over 0.8 s. **ring:** cubic-out over 0.45 s. **write:** linear over
  0.7 s, letter by letter.
- **Pencil acting:** lifts before each tap, lands with its shadow meeting the tip, a tiny rebound; hurries as the data
  gets denser; trembles at a peak; may flinch, hesitate or leave.
- **rescale:** four ratchet clicks, each eased over 0.09 beat; a frame-break holds at least half a beat.
- **morph:** a staggered sweep (dots fall to the band centre in the first 45%, then stretch to a stripe).
- **caption:** rises 8 px over 3 frames; flips up when it leaves.
- **Camera:** 2D x, y, zoom, roll over one sheet, in one take. Extreme close-up on one mark, pull back as axes grow,
  track the pencil, a 2-frame punch-in, a fast pull-out with −3° roll.

## 7. Transitions and rhythm

- No fades to blank, no dissolves. Transitions are chart operations: axis growth, pull-backs, rescales, morphs, a cell
  widening into the next frame. A hard cut is rare and meaningful.
- One true silence before the key mark.

## 8. Finish

Fixed-seed fibre noise (0.02) and a faint dot grid; graphite grain inside pencil strokes (16%). No film grain, no
vignette, no glow.

## 9. 3D look

none

## 10. Banned

- A dashboard; a keynote with chart slides; a chart as decoration.
- Changing a number, extrapolating, a value with no source or formula.
- Stretching a colour ramp; colour that means anything but the value.
- Fades to blank or dissolves.
- Captions over a chart operation or a silence.
- Copying any data storyteller's or newspaper's charts, layouts or typefaces, or naming them.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 23 "Data Storytelling" (`styles/dataviz/`); demo film and
  stills CC BY 4.0 (LemoLab). Read through the research notes `docs/research/styles/five-skills.md`, section "Data
  Storytelling (pencil chart on cream paper)". The source draws on Canvas 2D; this is rebuilt as SVG in Remotion. No code
  was copied.
- **Taken:** paper, dot grid, ink, grid, zero, tick, both leads, wood and the ColorBrewer-family ramp; the
  colour-means-value rule; Newsreader, Caveat and IBM Plex Mono with their roles, the glyph rotation, jitter and 16%
  knock-out; the figure caption; pinned notes and the memory zone; dots, leaders, un-closed rings, ink shapes, the
  pencil, the dashed next cell; all motion and camera rules; transitions; the banned list.
- **Proposed:** every px size for the tall frame; the sample data, which is computed, not measured: Rayleigh scattering
  relative to red, (700 ÷ λ)⁴, so 450 nm gives 5.9 and 400 nm gives 9.4; the use of the cold half of the ramp as a
  sequential scale; the stripes for the visible range; all sample scenes.
- **Changed for vertical:** the source's 1500 × 520 plot became 814 × 620 with its height kept; the headline moved above
  the plot at 84–100 px; the caption moved from y ≈ 985 of 1080 to a block at y = 1380–1530, clear of the bottom 330 px;
  tick sizes went from 17–20 px to 28 px.
- Added to the catalog on 2026-11-06.
