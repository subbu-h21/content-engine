---
name: style-transit-map
description: Visual style "Transit Map": a printed octilinear metro schematic lying on a dark table; lines (0.15 G, 0.34 G fillets, 0.2 G apart in bundles) drawn by glowing pen tips, white stops with coloured rings, interchange capsules, terminus rings, a river with a tunnel, line bullets, callouts with an accent bar, a cartouche, the you-are-here dot, a cream-drum counter on an enamel plate, every label printed on the sheet in a signage grotesk (Overpass), and a real perspective camera that rides, tilts and pulls back with shallow focus. Use when a video is made in this style.
---

# Transit Map

## 1. In one line

A printed metro schematic on a dark table, drawn on by glowing pen tips while a perspective camera rides, dips and
sweeps over the paper with shallow focus. It suits the growth of a network over time, routes, roadmaps or careers
drawn as lines, two rivals on one time axis, and any topic drawn as a network (always labelled on screen as a
metaphor). No footage; no Blender (a flat plane under a perspective camera).

## 2. Palette

Line colour is identity only: a real network uses its published colours; an invented one uses hues spaced round the
wheel at a similar weight. Transport mode is shown by line form, never hue. Light lines carry ink inside their
bullets, deep ones white. Fade the network back with a paper veil (60% paper), never a dark overlay.

| Role | Hex | Where |
|---|---|---|
| background (table) | `#1b1918` | the near-black warm table under the sheet |
| surface (paper) | `#f2eee5` | the printed sheet |
| text (ink) | `#1b1c1e` | labels, interchange outlines, casings, cartouche bar |
| muted (warm grey) | `#4a4740` | notes and second lines |
| faint (water) | `#bcd6ea` | water bands and areas |
| waterEdge / waterLabel | `#8fb5d6` / `#5f88ad` | the 0.025 G darker edge; water names |
| accent | `#e3002b` | the first section, the you-are-here dot, the verdict, callout bars; also line 700 |
| accent2 (comparison navy) | `#24346e` | anything compared against |
| plate / plate2 | `#17191c` / `#2a2d31` | the counter's enamel plate and rim |
| drum / drumHi | `#efe9dc` / `#faf6ee` | the counter's cream drums |
| plateLabel / plateLabel2 / plateUnit | `#efe8d8` / `#aaa395` / `#8b8577` | the counter's labels and units |

The sample network's lines (an invented metaphor: each line is a wavelength of sunlight) *(proposed)*: 700 `#e3002b`,
620 `#ee7a1f`, 580 `#f2c200` (light), 530 `#3fa34d` (light), 450 `#1f78c8`, 400 `#7a4fb0`.

## 3. Typography

- **One signage grotesk:** Overpass 600/700/800 *(proposed; the source's demo used Inter, "a neutral grotesk")*.
- **Sizes in grid units G** (1 G = 120 px at the standard zoom), all printed on the sheet: hub labels 0.34 G (capitals),
  interchange names 0.27 G, named stops 0.24 G, notes 0.21 G in warm grey, callout figures 0.62 G heavy with a 0.34 G
  line and a 0.24 G note, printed panel titles 0.5–0.6 G, the cartouche title 0.64 G with a 0.24 G note, water names
  0.24 G, bullet numerals 0.2 G weight 800.
- **On screen:** a label counts only if it is ≥ 24 px at the camera's zoom (a two-line block ≥ 26 px tall); hub labels
  grow on pull-back by × (85 / zoom)^0.6, at most 1.75.
- **Every label has a paper halo** (a 0.05 G stroke at 92%).
- **Words on screen:** everything is printed on the sheet or on the counter; the title is printed on the map
  (cartouche, panel or callout), never a floating card.
- **The smallest text** is 24 px.

## 4. Layout

- **Unit G;** stations on a 0.1 G lattice, ≥ 0.7 G apart along a line. Eight directions only: every segment
  horizontal, vertical or 45°; every corner one fillet radius.
- **The sample sheet** is 9 × 15 G: cartouche across the top (0.3–1.9 G), bullets under it, the network in the middle,
  a river near the foot, the end title in the bottom-left margin.
- **Labels are placed once against the finished network:** eight candidate positions, preferring E, W, NE/SE, N/S,
  NW/SW; hubs and interchanges first.
- **The counter** owns the top-left corner (plate 640 px wide at y = 250, 90 px rows, 14 px radius, four screws).
- **The camera's aim point** sits at y = 1000 on screen; subject off-centre with room ahead of a moving tip.
- **Safe zone:** 230 px top, 330 px bottom for the counter and the labels that must be read.
- **Density:** one new event (a line, an interchange, a value, a callout) every 3–5 s.

## 5. Elements

All in G:
- **Line** 0.15, round caps, fillet 0.34; thin line 0.07; parallel lines 0.2 apart.
- **Stop:** white disc r 0.085 with a 0.046 ring in the line colour. **Terminus:** ring r 0.15 with a 0.06 ink outline.
- **Interchange capsule:** the bounding box of its lines padded 0.13, stadium corners (a rounded square for a diagonal
  spread; never turned to 45°), white fill, ink outline 0.055 (0.07 for a major hub).
- **River** 0.76 wide with 0.025 darker edges; a **tunnel** under water: the line dashed 0.16 on / 0.11 off between two
  ink casings 0.02 at 55%, 0.05 outside each edge.
- **Pen tip:** white core r 0.11, a 0.05 ring in the line colour, a halo r 0.8 (45% at the centre).
- **Line bullet:** a disc r 0.3 in the line colour with its numeral *(the source's 0.25; bigger so numerals stay
  legible)*.
- **Callout:** an accent bar 0.10 wide, a heavy figure, a line and a note, on a paper block if it sits over lines.
- **You are here:** r 0.17 in the accent with a 0.04 white outline and a pulsing ring.
- **Cartouche:** an ink bar, the map name, a one-line grey note.
- **Counter:** a dark enamel plate with four screws, cream drums with heavy figures (0.7 × the drum height).
- **Paper:** a value cloud (~9 G) and a tooth (~2.4 G) at a few percent, ink multiplied by the tooth; raking light
  from the north-west lifting that corner ~7%; a contact shadow at the sheet's edge; the table falling into warm dark.

## 6. Motion

- **pen:** pen tips draw the lines on monotone keyframes (ease-in-out 1.6 s here); they may slow at stations, never stop
  mid-segment. When the camera rides a tip, tip speed × zoom ≤ ~500 px/s on screen.
- **pop** (stops): from 0.6× with a small overshoot in 0.28 s; a ring spreads 0.10 → 0.42 G and fades in 0.6 s.
- **Interchanges:** scale down from 2× in 0.22 s with an ink ring to 0.64 G; a major one falls from 3.4× in ~0.4 s,
  its shadow sharpening on landing, then rings in the meeting lines' colours spread to 1.4–2.6 G in 0.9 s. A line
  leaving a station starts ≥ 0.5 s after the first line arrived.
- **Bullets** spring in carrying their numeral; **callouts** wipe on from their bar in ~0.5 s.
- **drum:** odometer drums spin blurred and land only on sourced values (~1 landing per 2 s).
- **Never moves:** built geometry, label positions, paper and its light.
- **Camera:** a pinhole with a 32° vertical field of view, no roll; blur = aperture × |depth − focus| ÷ depth, capped at
  26 px. Moves: ride the pen tip (tilt 15–30°, 130–260 px/G, aperture 16); drop low where a line meets water (tilt
  ~60°, 185 px/G); a continuous pull-back with level-of-detail fades (tilt 12° → 0°, 80 → 50 px/G); a low oblique sweep
  (tilt 57–62°, heading swinging ~40°, ~100 px/G, aperture 24); a glide to another panel; a rise until the sheet edge
  and table show (tilt ~30°, ~40 px/G); a push under a paper veil; a locked top view held ≥ 2.5 s before a verdict.
- **Level of detail by zoom:** minor stops fade in at 55–85 px/G, interchange names at 62–90, named stops at 100–130;
  hubs always.

## 7. Transitions and rhythm

- Match cuts on round shapes (a headlight, a lamp, a coin becomes a station dot), glides across the sheet, hard cuts to
  a new panel. No page turns, no fades to black mid-film.
- The camera changes every 3–5 s; one beat of near-silence before a verdict; a two-note station chime at each turn;
  accelerate by adding voices, not tempo.

## 8. Finish

- The procedural paper (± 3%, fibres up to 3% darker, ink varying 7–10% with the tooth), the raking light, the edge
  shadow; vignette up to −24% in the corners; light grain 0.02. No colour cast, no bloom except the pen-tip halo.

## 9. 3D look

2.5D: a flat printed plane seen by a real perspective camera (here CSS perspective with the 32° field of view, a
blurred copy masked to the focus band for depth of field). No extruded buildings or terrain. A Blender version would
be a textured plane, a 42 mm camera, one raking area light and depth of field.

## 10. Banned

- Segments off 0°, 45° or 90°; wiggling lines; capsules turned to 45°.
- Mode shown by colour; paper-coloured strokes painted in place of erased paper; dark overlays.
- Floating title cards or captions over the picture; time-flashed labels; labels placed against a partly drawn
  network.
- Counters that interpolate or show unsourced figures; unchecked facts; an invented network not labelled as one.
- Operator logos or branded bullets; copying Beck or Vignelli layouts, faces, icons or bullets, or naming them.
- A top view for the whole film; a camera lower than ~25° above the paper; fades to black mid-film.
- Data-storytelling charts, white-on-blue blueprints, isometric infographics, 3D city maps, keynote slides.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 72 "Transit Map"
  (counter colours from the demo's `timeline.js`, paper and table values from `gl.js`). Research notes:
  `docs/research/styles/five-skills.md`, "Transit Map". Rebuilt with SVG and CSS 3D in Remotion; no code was copied.
  The demo's Shanghai line colours are not used. Overpass is SIL OFL.
- **Taken:** paper, ink, warm grey, water and its edge and label colours, accent, comparison navy, table, counter
  plate, drums and labels; the colour rules; every G size (lines, fillets, parallel spacing, stops, terminus,
  capsules, river, tunnel, pen tip, callout bar, you-are-here, label halo) and the label sizes as ratios; the
  on-screen legibility rule and the pull-back growth; label placement; the counter's plate (width, row height, radius,
  screws) and drums; all motion (pen tips, stop pops, interchange drops, bullets, callouts, drums, what never moves);
  the camera (32° FOV, the DoF formula and 26 px cap, every named move with its numbers, level of detail); transitions,
  rhythm, finish, banned list.
- **Proposed:** Overpass instead of Inter (a signage grotesk; the source asks for "a neutral grotesk"); the invented
  network "Sunlight lines" with six wavelength lines and its station names (labelled on the sheet as a metaphor); the
  line colours; bullets at r 0.3 G with 0.2 G numerals; the cartouche wording; pen timing 1.6 s; the 2.5D camera as CSS
  perspective with a masked blur for depth of field.
- **For vertical:** the source frame is 1920×1080 with the counter top left and zooms measured at 1080p. Here the sheet
  is 9 × 15 G (tall), the camera's aim point sits at y = 1000, zooms run 66–172 px/G so labels stay ≥ 24 px, the
  counter sits at y = 250 inside the safe zone, and each sample uses one camera move with its own printed extras
  (cartouche, panel title, callout, counter, numbered route, end title) instead of one continuous film.
- Added to the catalog on 2026-10-31.
