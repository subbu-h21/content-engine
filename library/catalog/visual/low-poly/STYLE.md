---
name: style-low-poly
description: Visual style "Low-poly": a tiny faceted pastel island under an orthographic isometric camera (azimuth 45°, elevation 30°); flat-shaded hex columns, box houses with gable roofs, cone pines and icospheres drawn as SVG polygons, faceted water, time of day as colour keyframes, Josefin Sans capitals rising from a water line and Quicksand subtitles; every piece arrives with a bounce. Use when a video is made in this style.
---

# Low-poly

## 1. In one line

Calm and toy-like: a small faceted world in soft pastel light where each new piece rises or pops in with a little
bounce. It suits calm explainers, "something grows" stories (a town, a project, a reef), place and world-building
pieces, day-cycle stories and game-like trailers.

## 2. Palette

Pastel and low-contrast: one ground family, one neutral rock, a small repeated set of wall and roof colours. No
outlines and no black: facet shading and the night are the only darks.

| Role | Hex | Where |
|---|---|---|
| sand / sand side | `#f3dfab` / `#e2c68e` | coast tile caps / their columns |
| grass, grass-2 / earth | `#93c96c`, `#7fbd62` / `#c99c6e` | inland tile caps / their columns |
| rock (faint) / rock side (muted) | `#b4b8bd` / `#8f949c` | the peak's cap / sides; the thin water line under titles |
| walls | `#fbf3e6` `#f5c2b0` `#b5dccb` `#a9cbe8` `#f7df8f` `#e9c9e6` | box houses; `#a9cbe8` also blue shards' light tone, `#f7df8f` the sun |
| roofs | `#d9644a` `#4f7fb8` `#e0874f` `#6a5a8e` `#3f8f86` | gable roofs |
| accent (red roof) | `#d9644a` | red light (700 nm), lighthouse rings |
| accent2 (blue roof) | `#4f7fb8` | blue light (450 nm), scattered shards, the emphasised word on a light sky |
| pine, pine-2 / leaf, leaf-2 | `#3f8a5a` `#4f9c63` / `#7fc36a` `#9ad06f` | cone pines / icosahedron trees |
| window | `#ffc676` | warm windows (emissive): the only bright things at night; the emphasised word on a dark sky |
| lighthouse | `#f6f2ea` | white rings |
| text (warm white) | `#fffdf8` | subtitles over water; titles on dusk and night skies |
| ink (navy) | `#2b3157` | titles on light day and dawn skies; the soft drop shadow under warm-white text *(proposed)* |
| sunlight | `#fff3d6` | the sunlight ribbon and its halo *(proposed)* |

**Time of day** is a keyframed colour set, never a filter (zenith / horizon / deep water / shallow water / sun colour,
intensity, elevation):

| Time | Zenith | Horizon | Deep | Shallow | Sun | Intensity, elevation | Hex icon |
|---|---|---|---|---|---|---|---|
| dawn | `#9fb6cf` | `#f3d2c4` | `#4f8ea3` | `#8fc9c4` | `#ffd9b8` *(proposed)* | 0.9, 14° | pink `#f5c2b0` |
| day | `#88c8e8` | `#eaf5f2` | `#38a5bc` | `#86e2d4` | `#fff6e8` *(proposed)* | 1.0 (source 2.7 in its units), 48° | grass `#93c96c` |
| dusk | `#6f6fa8` | `#ffa888` | `#5a6a9e` | `#b08aa6` | `#ff9a68` | 0.8, 8° | orange `#e0874f` |
| night | `#12163a` | `#4a4478` | `#23264a` | `#363a66` | moon `#a9b0e8` | 0.42 (source 0.9), 40° | window `#ffc676` |

Night desaturates toward blue-violet; warm windows stay full strength.

## 3. Typography

- **Titles:** Josefin Sans 600 (Google Fonts), all capitals, tracking 0.2 em (source: 78 px with 16 px tracking at
  1920×1080). Sizes at 1080×1920: 104 px for titles (120 px on the end card), 60–64 px for longer title lines, 300 px
  for a number. 1–3 short lines.
- **Sub-line:** Josefin Sans 300, lower case, 46 px, tracking 0.04 em, under a title.
- **Subtitles:** Quicksand 600, 54 px (48 px for long captions, 40 px for labels), warm white `#fffdf8`, no box, a
  soft navy drop shadow (blur 14 px, 55%), centred, with the small hex icon (34 px) beside the first line. Up to about
  8 words a line, 2 lines.
- **Colour by sky:** on a light day or dawn sky, titles are navy ink with no shadow; over water and on dusk or night
  skies they're warm white with the shadow.
- **Emphasis:** only in titles: the emphasised word in blue `#4f7fb8` on a light sky, window yellow on a dark one.
- **Smallest text:** 32 px. A number keeps its unit on the same line.

## 4. Layout

- **Camera:** orthographic, azimuth 45°, elevation 30° (20–25° at night widens the sky, ~50° for map-like views).
  The projection never changes.
- **Sky band:** the sky fills the top 430–760 px (about the top third); the water fills the rest. Titles sit in the
  sky band (y 250–700); subtitles sit over the water under the island (y ≈ 1300–1450).
- **Safe zone:** 230 px top, 330 px bottom; must-read text above y = 1470. Margins 96 px.
- **The island** is centred, about 700–800 px wide (60–66 px per world unit; a tile is 1 unit across its corners),
  its centre at y ≈ 1080–1190. Lots of empty water and sky around it.
- **Lists:** small three-tile islands on the left (x ≈ 260), their text on the right (x 470–990).

## 5. Elements

- **Hex columns:** pointy-top hexagons (`x = √3(q + r/2)`, `y = 1.5 r`), a 1.5% gap between tiles, lightness jitter
  ±4%. Heights encode the ground: sand 0.4, grass 0.82, hills 1.25, rock peak 1.95. The top cap is 0.16 thick in the
  cap colour; the column under it is the side colour, slightly inset.
- **Props** are primitive assemblies: box houses (0.62 × 0.56, 0.5 per floor) with gable-prism roofs (overhang
  0.08) and window quads that glow at night; 6-sided cone pines on a stub trunk; icosahedron (20-face) trees;
  icospheres (80 faces) for the sun and molecules; a lighthouse of four tapered 8-sided rings, white and red.
- **Flat shading:** each face is one colour: ambient 0.76 + diffuse 0.38 × max(0, n·L), scaled by the time's
  intensity, tinted 30% by the sun colour and 10% toward the zenith (haze). Back faces are culled; faces are drawn back
  to front.
- **Water:** a lattice of flat triangles (84 px) whose points ride four summed sines (±7 px); each triangle is one
  colour between deep and shallow by its slope, hazed toward the horizon near the top. A pale surf ring (1.12 × the
  tile, white at 32%) at sea level around the island.
- **Light:** the sunlight ribbon is a soft core plus a halo 2.4× wider at 32% (blurred), drawn on; red light is a
  thinner red ribbon. Scattered light is small blue faceted shards.
- **No HUD:** titles, subtitles, labels and the end card only.

## 6. Motion

- On ones, smooth; the charm is the arrival curves.
- **rise** (tiles, columns, title letters): 0.5 s cubic ease up, then an overshoot of `sin(13s)·e^(−7s)·0.18`; the
  moment it settles is the event time. Title letters rise one by one 0.055 s apart from under their water line.
- **drop and stack:** a piece falls 2.4 units in 0.22 s (ease-in), bounces `|sin(15s)|·e^(−9s)·0.22`, squashes
  `1 − 0.16·e^(−12s)·cos(26s)` on Y with volume kept.
- **pop** (props, the sun, shards): scale `1 − e^(−9s)·cos(17s)` (about 25% overshoot), here as a spring of damping 18,
  stiffness 370, mass 1.
- **Growth on a grid:** one piece per slot (a 16th note; 0.156 s at 96 BPM); speed up by density (halves → quarters
  → eighths), not tempo. Islands rise ring by ring from the centre.
- **fly:** shards fly out with ease-out over 1.2 s, a new burst every 0.5 s while light keeps hitting.
- **Life:** water moves; the sun and molecules turn slowly; stars twinkle at night. Nothing heads at the lens.
- **Camera vocabulary:** turntable (+45° over ~5 s with a slow zoom-out), pure orthographic zoom, elevation change,
  locked three-quarter wide, a tight close-up on one arrival, a lateral truck, a time-lapse sun sweep with the camera
  still.

## 7. Transitions and rhythm

- **Hard cuts on the beat**, a time-of-day change, a zoom through the sky. No dissolves, no perspective whip-pans.
- Intercut wide (the shape) and close (the bounce) on beats. A new arrival every slot during a build; a held wide of
  2–4 s after it.
- Windows light one per eighth note at dusk; a turn of the lighthouse beam per 12 beats.

## 8. Finish

- No grain (flat colour shimmers with grain), no vignette, no outlines.
- Bloom: 0.22 by day, 0.5 at night, only on emissive windows and lamps (a blurred copy, screen blend).
- Haze: far water mixes toward the horizon colour (up to 55%).
- A very light tilt-shift at the frame edges (at most 3 px) in finished videos; omitted in the previews.

## 9. 3D look

The source is real 3D (three.js, orthographic): `MeshStandardMaterial({ flatShading: true, roughness ≈ 0.9 })`, no
textures; GTAO (radius 0.7) to draw tile seams; water as a dense flat-shaded plane of four summed sines (amplitude
≈ 0.2, roughness 0.55); the sun kept sideways to the camera in key shots. In Blender: an orthographic camera
(Orthographic Scale = frustum height 5–7 for close-ups, 12–16 for the island), Shade Flat, Principled roughness 0.9,
EEVEE AO, emissive window materials, Geometry Nodes for hex grids, the sky as a compositor gradient over the mist
pass. The previews rebuild the look in 2D: real orthographic projection of flat polygons with per-face shading.

## 10. Banned

- Outlines or black. Textures, photos, smooth or rounded shading.
- Perspective or a changing projection; perspective whip-pans; dissolves; grain.
- Cubes of cubes or pixel textures (a voxel game).
- Two pieces arriving in the same slot; movers heading at the lens.
- Saturated or neon colour.
- Copying any existing game's grids, buildings, characters, UI or type.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 43 "Low-poly Isometric Island"
  (`styles/lowpoly-island/STYLE.md`, `DEMO.md`); demo film and stills CC BY 4.0 (LemoLab). Read through the research
  notes `docs/research/styles/five-skills.md`, section "Low-poly Isometric Island". The source renders in three.js;
  this is rebuilt with React and SVG polygons in Remotion (no three.js in this engine).
- **Taken:** every tile, wall, roof, tree, window and lighthouse hex; the four time-of-day keyframes; Quicksand 600
  subtitles (44 px at 1080p, warm white, navy shadow blur 14) with the hex icon whose top follows the time of day;
  Josefin Sans 600 capitals with wide tracking and the 300 lower-case sub-line; letters rising from a water line;
  the orthographic camera (azimuth 45°, elevation 30°); hex columns and their heights, caps, gaps and jitter; the prop
  kit; the ribbon with a 2.4× halo at 0.32; the rise, drop-and-stack and pop curves; growth on a 16th-note grid; the
  surf ring (1.12 r, 0.32); bloom 0.22 / 0.5; no grain; the banned list.
- **Proposed:** the ink navy for type on light skies and the shadow colour, the sunlight colour, the dawn and day sun
  colours, the light model's numbers (ambient 0.76, diffuse 0.38, haze 0.1), the water lattice size and wave
  amplitude, every px size, the shard bursts, the sample scenes (spectrum columns around a faceted sun, an air
  molecule, two hex columns as the 5.9× chart, three tiny islands for the list).
- **Changed for vertical:** the 16:9 frame with the island in a wide sky becomes a tall frame: the sky band is the top
  third (430–760 px), the island sits in the middle, subtitles move from 118 px above the bottom to under the island
  (above y = 1470); type is larger (titles 104 px instead of 78 px, subtitles 54 px instead of 44 px) with fewer words a
  line; one island per frame instead of wide panoramas.
- Added to the catalog on 2026-10-31.
