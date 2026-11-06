---
name: style-bold-poster
description: Visual style "Bold Poster": the cover of a vintage Italian sports magazine; heavy Shrikhand display that stamps down and swings to its tilt, a classical Libre Baskerville body, one tomato red, ink-ruled double-border grids, full-bleed red and dark plates and a red progress bar. It feels printed. Use when a video is made in this style.
---

# Bold Poster

## 1. In one line

The cover of a vintage Italian sports magazine: heavy tilted display type, a classical serif, one tomato red, grids ruled
in ink. It feels *printed*. It suits sports, culture, retro promos, stat-led reels and annual-report numbers. No footage,
no 3D.

## 2. Palette

Four colours only.

| Role | Hex | Where |
|---|---|---|
| background | `#ffffff` | the default ground |
| surface (light) | `#f5f2ef` | the off-white foot; stripes on alternating panels |
| text (dark) | `#1c1410` | body, borders, headers, the dark statement panel |
| accent (red) | `#d8000f` | every numeral, rules, eyebrows, left bars, bullets, the progress bar, the full red panel |
| accent2 (dark) | `#1c1410` | the dark plate |
| muted, faint | same as dark and light | there's no grey |

Red is never body text, never a tint, never a fill with no text on it. In figures, red is a rule; solid shapes are dark.

**The stacked text shadow, on red panels only:** `2px 2px 0 rgba(28,20,16,.25), 4px 4px 0 rgba(28,20,16,.2), 6px 6px 0
rgba(28,20,16,.15)`, with the steps scaled ×3–4 on very large type *(proposed)*.

## 3. Typography

- **Shrikhand 400** for all display, numerals and card titles. **Libre Baskerville** 400/700/italic for all body. **Space
  Grotesk** 400/600 for chrome only.
- **Sizes at 1080×1920** *(proposed; the source's px at 1920 wide are about the same for display)*:

  | Role | px | Tilt |
  |---|---|---|
  | hero line | 190–220 | 0° or +2° |
  | hero line in red | 204–290 | −4° |
  | close-big, red | 200–244 | −5° |
  | stat-big numeral | 396 | −6° |
  | section header | 128 | −2° |
  | cell numeral, red | 84 | |
  | card title | 60–74 | |
  | body, Baskerville | 36 | line height 1.6 |
  | label, Space Grotesk 600, uppercase, red | 28 | 0.08em tracking |

- **Smallest text:** 24 px.
- **Fit to length:** ≤ 2 words → stat-big or red hero; 3–4 → hero; 5+ → section header.
- **Emphasis:** tilt, red and scale. Inline strong in body switches to Space Grotesk 600. No italic display: Shrikhand is
  its own slant. Shrikhand runs wide (about 0.52 em a character): check tilted lines don't clip at the frame's edge.
- **Words on screen:** about 7 in Shrikhand.

## 4. Layout

- **Margins:** 72 px: tight, so the poster type crowds the frame.
- **Safe zone:** 230 px top, 330 px bottom.
- **One display moment per frame,** at 3–6× everything else. Statement frames keep about 50% empty; the ruled grid is the
  dense exception.
- **The bottom strip:** on white frames, a light foot from y = 1584 to the frame's edge, with the progress bar on its top
  edge *(proposed: the safe line, so platform buttons don't cover it)*.
- **For 9:16:** the hero stack runs tall and left; grids go two across or stack.

## 5. Elements

- **Hero stack:** 3 Shrikhand lines, at least one tilted (−4° / +2°), at least one red.
- **Stat-big poster numeral:** white on the red panel at −6°, with the stacked shadow.
- **The ruled grid:** a 4 px outer and 2 px inner ink double border; cells hold red numerals. On red, the rules are white.
- **Red left bar:** 8 px, no outline, beside body and steps.
- **Red and dark plates:** full-bleed statement surfaces.
- **Bullets:** a red em-dash, three at most.
- **Progress bar:** red, 12 px, the most prominent chrome; white on the red plate.
- **Figures:** solid dark shapes, red rules for what matters, in a ruled cell.

## 6. Motion

The source has no motion but a caption pop; everything here is *(proposed)* from the HyperFrames taste rules T36–T60.
The idea: a press coming down. Display type doesn't fade: it's there or it isn't.

- **stamp** (Shrikhand): appears at once at scale 1.32 and comes down, quart-out over 0.26 s; 0.16 s between lines.
- **swing** (the hero red line): lands flat, then swings to its tilt about its left baseline on a spring (damping 19,
  stiffness 240, mass 1: ratio 0.61). The tilt is the signature move, and it happens once per shot.
- **plate:** a red or dark plate comes down from the top edge, cubic-in-out over 0.4 s. It's also how grids draw.
- **rule:** left bars and figure lines draw, quart-out over 0.5 s.
- **lift** (body and labels): each block rises out of a clip, expo-out over 0.6 s.
- **roll** (the stat): the numeral rolls up in 6 steps of 0.1 s (T43's slot-machine roll) while it's stamping, then holds.
- **progress:** the bar advances one step, cubic-in-out over 0.6 s.
- **out:** the next plate comes down over the frame, cubic-in over 0.22 s. Content never leaves on its own.
- **Captions:** the active word slams into a red block with white text, scale 0.9 → 1 in 0.16 s with `back.out(2.2)`
  *(from the source's caption skin)*.
- **Holds:** at least 1.0 s after the last stamp. A landed title is dead still.

## 7. Transitions and rhythm

- **Cuts:** surface inversion: white → dark → white → red, each by a plate coming down. The direction is always downward.
- **Rhythm:** stamps fall in a steady count, like a press; one hero line per shot; a 0.3–0.5 s still beat before a red
  plate.

## 8. Finish

A flat printed plane: no box shadows, gradients, grain or glow; square corners. Depth comes from heavy borders, surface
inversion and tilt.

## 9. 3D look

None.

## 10. Banned

- A second accent colour; rounded corners.
- Drop shadows, gradients; the stacked shadow anywhere but on a red panel.
- Font substitutes; Shrikhand body, Baskerville labels, Space Grotesk headlines.
- Default disc bullets; an untilted red statement.
- A crowded statement frame; edge-to-edge long lines.
- Red as body text, as a tint, or as a fill with no text on it.
- Italic display.
- Rows of three cards.
- Fades on display type; titles that keep moving after they land.

## 11. Where it came from

- **HyperFrames frame preset Bold Poster (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "Bold Poster". Rebuilt in Remotion; no code was copied. Shrikhand,
  Libre Baskerville and Space Grotesk are SIL OFL.
- **Taken:** every hex, the four-colour rule, the three faces and their limits, the tilts (−4°, +2°, −5°, −6°), the hero
  stack, the poster numeral, the double-ruled grid, left bars, red and dark panels, em-dash bullets, the progress bar,
  the stacked shadow, the caption's red block and pop, the banned list.
- **Proposed:** all other motion, the sizes for a phone, the light foot, the scaled stacked shadow, the sample's ruled
  figure and step rows.
- **For vertical:** the hero stack runs tall; the statement is a full plate; the grid goes two across; body type rises from
  about 16 px to 36 px. Editorial cards stack instead of sitting in a row.
- **Kept apart from** Red Card Kinetic and Signal Slam (one-word kinetic type on colour) and Spy Titles: Shrikhand's slant,
  Baskerville and ruled grids make it a magazine, not a slam.
- Added to the catalog on 2026-11-06.
