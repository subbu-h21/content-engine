---
name: style-cobalt-grid
description: Visual style "Cobalt Grid": a two-colour trend report from a lab notebook; cream paper, electric cobalt as the ONLY ink, a permanent graph-paper grid, Newsreader serif, data drawn as grid cells, a stair-stepped pixel-glitch band and data patches; everything prints on in hard steps and nothing fades. Use when a video is made in this style.
---

# Cobalt Grid

## 1. In one line

A two-colour trend report: cream paper, electric cobalt as the only ink, a permanent graph grid, a serif, a scanline
glitch and data patches. It suits tech or culture trend reports, data explainers, research summaries and "lab notebook"
brands. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f0ebde` | ground |
| surface (paper-2) | `#e6e0ce` | secondary paper |
| text (ink, cobalt) | `#1f2be0` | ALL type, rules, grid, glitch, data patches, data cells |
| muted (ink-soft) | `#5560e5` | editorial subtitles only (the italic callout) |
| faint | `#cbc8de` | ink at 18% on paper: faint row dividers *(proposed flat hex)* |
| accent, accent2 | same inks | there's no other colour |

Grid and off cells are cobalt at 10–12%. **Strictly two colours.** Emphasis comes from size, a face switch (Hanken →
Newsreader), a mono delta arrow or opacity, never a hue.

## 3. Typography

- **Newsreader 400** for all display: size, not weight, makes hierarchy; never bold. **Hanken Grotesk** 400/600 for body and
  labels. **DM Mono 400** for chrome.
- **Sizes at 1080×1920** *(proposed: the source's px at 1920 wide are kept for display where they fit)*:

  | Role | px | Notes |
  |---|---|---|
  | display hero (≤ 3 words a line) | 224 | leading 0.9, −0.008em |
  | closing | 180–200 | |
  | chapter (4–6 words) | 124 | leading 1.0 |
  | headline (7+ words) | 88 | leading 0.95 |
  | big numeral | 390 | −0.015em |
  | row names | 66–76 | |
  | callout, italic, ink-soft | 50–60 | |
  | body, Hanken 400 | 36 | line height 1.4 |
  | micro, Hanken 600, uppercase | 26 | 0.16em |
  | mono chrome, DM Mono 400 | 26 | 0.05em |

- **Smallest text:** 24 px. **Words on screen:** about 8 in Newsreader.

## 4. Layout

- **The grid:** 30 px cells on a 36 × 64 sheet *(proposed; the source's 2 cqw)*. Place things on it.
- **Edge inset:** 60 px. **Safe zone:** 230 px top, 330 px bottom; the hairlines sit on those lines (y = 228 and y = 1590),
  with the page furniture just above the bottom one.
- **Declarative frames** (cover, chapter, closing) are 45–60% empty with the grid showing. The index and data frames are
  dense.
- **Anchors vary:** left for index and chapter, right-aligned for the colophon.
- **For 9:16:** the glitch becomes a full-width band; fewer ledger rows; bars become rows of cells.

## 5. Elements

- **Frame furniture on every frame:** the graph grid, two cobalt hairlines, the page number bottom-right, the nav hint
  bottom-left.
- **Pixel glitch:** a stair-stepped band of scanlines (3 px bars every 12 px), rows 30 px tall. Full strength on covers;
  34% on chapter and closing frames.
- **Data patch:** 8 × 8 cells of 20 px in a paper outset (an "anti-shadow"). It's texture: never a real, scannable code.
- **Ledger row:** mono number · Newsreader name · mono delta arrow, on faint dividers.
- **Pixel stack:** data as grid cells, cobalt on, 10% off. A cell has a stated value.
- **Figures** are drawn in cells on the grid: no curves, no circles.
- **Labels over a figure** sit on a paper plate.

## 6. Motion

The source has no motion but a caption pop and a note of a 280 ms crossfade; the spec's risograph line says "the frame is
printed, plate by plate, not faded in". Everything here is *(proposed)* from that and the taste rules T36–T60. **Everything
moves in hard steps: there are no in-between frames and no fades.**

- **plate** (the grid): prints down the frame in 6 hard steps over 0.25 s, first.
- **scan** (type): each line prints from the top in 8 hard steps, quart-out over 0.5 s (long tail, held to steps), 0.12 s
  between lines.
- **rule:** hairlines step across in 10 jumps, quart-out over 0.4 s.
- **cells:** data cells switch on one at a time, 0.012–0.02 s apart. A count ticks up with its cells: one cell, one tick.
- **glitch:** each scanline row snaps on at its own seeded moment over about 0.25 s.
- **Mono chrome** is set at once.
- **out:** the content un-prints from the bottom up in 6 hard steps, quart-in over 0.25 s; the grid stays.
- **Captions:** a hard cobalt knockout block with cream text, scale 0.985 → 1 in 0.1 s *(from the source's caption skin)*.
- **Holds:** at least 1.0 s. A landed line is dead still.

## 7. Transitions and rhythm

- **Cuts:** the sheet never changes. Old content un-prints, new content prints on the same grid. Cells may carry a cut: a
  figure's cells become the next chart.
- **Rhythm:** 2.5–4 s a frame; data frames may hold while cells tick. Grid and hairlines are plate one, type plate two,
  data plate three.

## 8. Finish

Flat. No shadow, gradient, radius, circle, grain or glow. The grid is the measured tone of the plane.

## 9. 3D look

None.

## 10. Banned

- A second ink colour; bold Newsreader; rounded corners; circles; drop shadows.
- Disabling the grid or the hairlines.
- Crowding chapter, quote or closing frames; edge-to-edge headlines.
- Fades, blurs and soft easing on anything.
- Gradients other than the scanline bars; halftones and translucent overprints.
- Three cards in a row.
- A real, scannable code.

## 11. Where it came from

- **HyperFrames frame preset Cobalt Grid (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "Cobalt Grid". Rebuilt in Remotion; no code was copied. Newsreader,
  Hanken Grotesk and DM Mono are SIL OFL.
- **Taken:** every hex and alpha, the strict two colours, the faces and roles, the display sizes, the grid, hairlines, page
  number and nav hint, the scanline glitch, the 8 × 8 patch with its outset, ledger rows, pixel stacks, the frames (cover,
  index, chapter, data, colophon), "printed, plate by plate", the caption's knockout block, the banned list.
- **Proposed:** the stepped motion grammar, the 30 px cell, phone sizes, the sample's cell figure, and a cell value of 0.1×,
  so 5.9× is 59 lit cells and red is 10.
- **For vertical:** the glitch column becomes a full-width band; bars become rows of cells; fewer ledger rows; body rises
  from about 16 px to 36 px.
- **BANNED-list note:** HyperFrames bans cream, serif and mono labels by default. Here it's on purpose: a one-ink grid medium.
- **Kept apart from** Risograph (translucent overprints, halftones), Dataviz (dot-grid paper, pencil notes, red and blue),
  Blueprint (white on blue), Blue Professional (rounded cards) and Pixel RPG: one cobalt ink, hard steps, data in cells.
- Added to the catalog on 2026-11-06.
