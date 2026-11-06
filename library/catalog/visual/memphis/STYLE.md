---
name: style-memphis
description: Visual style "Memphis": a place built as a tabletop model on warm white paper, seen through a grainy organic frame; flat Memphis colours, 2.5 px indigo outlines, hard cool-purple shadows filled with halftone dots, patterns instead of texture, houses built from parts, five crown shapes, paper strips of light, callout pills, and three quiet centred lines of type under the frame below a yellow dot, a pink triangle and a blue zigzag. Use when a video is made in this style.
---

# Memphis

## 1. In one line

A cheerful, calm model-maker's world: a little town on a table, flat bright colours and patterns, and a few quiet
words under the picture. It suits "how things work" explainers, place and city stories, calm facts, seasonal series
and ambient loops. It's about places, not people: no character acting.

## 2. Palette

5–7 saturated hues plus 2–3 pastels; flat fills, no gradients. Colour is clustered by area with large calm
single-colour areas.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#fffcf6` | outside the frame; nothing but the type and marks is drawn there |
| ink | `#25214a` | every outline (2.5 px), window frames, leader lines, rods, section hatching |
| text / muted / faint | `#2b2840` / `#8d8aa0` / `#b7b4c6` | type line 1 (title) / line 2 (sentence) / line 3 (data) |
| accent (coral) | `#ff5a5f` | red light, roofs |
| accent2 (cobalt) | `#2f5bff` | blue light, the zigzag mark and zigzag rays, the emphasised word on line 1 |
| yellow · pink · sky · mint · lilac · peach · green | `#ffd234` `#ff7eb3` `#5cc8ff` `#5edfb0` `#b9a0ff` `#ff9c6b` `#2fcb7a` | walls, roofs, awnings, the sun, the sky backdrop, the molecule, the spectrum strips |
| grass | `#9de8a6` | the model's ground, with lighter dots |
| crown / crown-light | `#3cbe7e` / `#6fd889` | tree crowns / their sun-side lobes |
| water / channel / bank | `#8ed8f7` / `#72c9f3` / `#7bbfe8` | the river's shallows / deeper channel / bank |
| glass / glass-dark | `#bfe4ff` / `#2c2752` | windows by day / unlit at night; the night sky |
| light / pool | `#ffd36e` / `#ffe3a3` | every light (one warm yellow) / lamp pools on the ground at night |
| dusk | `#ff9e7a` | the dusk layer on the way to night |
| marks | `#ffc93c` dot, `#ff7faa` triangle, `#2f5bff` zigzag | the three marks above the type |
| trunk / soil | `#b07a55` / `#c99a76` | tree trunks and doors / the cut face *(proposed)* |

**Shadows** are the colour under them multiplied by (0.70, 0.58, 0.90): hard, cool purple, never blurred, filled
with a staggered grid of lighter halftone dots. **Night** is a luminance shift toward violet (multiply by
(0.45, 0.42, 0.78), at most 80%), never grey; lights keep their warm yellow.

## 3. Typography

- **Faces:** Inter Tight (Google Fonts) 600 for line 1 and callout labels, 400 for line 2; IBM Plex Mono 400 for the
  data line and callout sub-lines. (Inter Tight is on the visual-taste list of "generated" tells; the source chooses
  it on purpose, and here it stays small and quiet under a busy picture.)
- **Three centred lines under the frame**, each with a fixed place (an empty line leaves its place empty):
  - line 1, the title: 600, 64 px (a number: 96 px), `#2b2840`, leading 1.12, tracking −0.01 em, up to 2 lines;
  - line 2, one sentence: 400, 38 px, `#8d8aa0`, leading 1.28, up to 2 lines;
  - line 3, data (time, place, numbers): Plex Mono 400, 28 px, `#b7b4c6`, lower case, one line.
- **Emphasis:** the emphasised word of line 1 in cobalt. Nothing else.
- **Callouts:** Inter Tight 600 at 30 px in a white pill; an optional Plex Mono sub-line at 26 px.
- **Smallest text:** 26 px. Words on screen: about 10 on line 1 at most.

## 4. Layout

- **The frame:** a rounded rectangle 952 × 834 px at (64, 236), radius 40, its edge wandering by two octaves of
  noise (±22 px over 170 px, ±5.5 px over 38 px) and a fine grain. It never moves.
- **The marks** sit centred at y = 1122, 44 px apart. **The lines** start at y = 1158, 1306 and 1414 (all above
  y = 1470). Safe zone 230 px top, 330 px bottom.
- **Inside the frame:** a painted sky backdrop over the top half (to y ≈ 636), the model's slab below it, its hatched
  cut face along the bottom edge. The view is a high three-quarter: depth goes up and to the right (0.38 px right and
  0.72 px up per unit of depth).
- **Keep large quiet areas** of one colour; the type never covers the picture.

## 5. Elements

- **Detail is built, not textured.** A house = a plinth, plank-striped walls, white corner trims, two roof slabs and a
  ridge, a gable with a round window, framed windows with shutters in the roof colour, a door with a step, an awning,
  and a lamp near it.
- **Three tones only:** top faces brightest (12% toward white), sun sides the base colour, away sides × 0.78.
- **Trees:** a trunk plus one of five crown shapes (cloud, round, egg, three-tier cone, column), a lighter lobe on the
  sun side; no two neighbours alike.
- **Water** is layered: bank, shallows, a deeper channel, a white dashed foam line, white squiggles drifting
  downstream.
- **Patterns** instead of texture: dots, diagonal stripes, zigzag, vertical stripes, hatching, horizontal stripes.
  The cut face of the slab is hatched in a tone one step darker.
- **Hard shadows** fall right and toward the viewer, filled with halftone dots (16 px cell, 3.2 px dots).
- **Light:** flat paper strips with ink outlines (the sunbeam, a fan of six spectrum strips); scattered blue light is
  the cobalt zigzag mark flying out. Things in the sky hang on thin ink rods, like parts of a model.
- **Callouts:** a white dot on the thing, a 2.5 px ink leader, a white rounded pill with an ink outline; numbered
  callouts get an ink disc.
- **Lamps:** a thin post and a warm head; at night a hard-edged warm pool on the ground (no outline, no shadow).
- **No outline** on light pools, particles or thin stems.

## 6. Motion

- Everything moves a little and eases; nothing pops on.
- **grow:** the frame opens from its centre over 1.2 s (ease-in-out cubic) and closes the same way.
- **back:** callouts, marks, the sun and molecules bounce in with a back-ease (overshoot 1.7) over 0.5 s.
- **squash and spring:** houses and trees grow from nothing on a spring (damping 9, stiffness 160, mass 1); a state
  change is announced by a squat of about half a second and a spring back.
- **wave:** a ring spreads from one point (about 900 px/s here) and swaps colours (season, day → dusk → night) as it
  passes; objects react when it reaches them.
- **line:** the three type lines cross-fade over 0.4 s; the marks stay.
- **Natural motion** loops: water squiggles drift, zigzags breathe, each with its own phase. The frame's grain boils at
  12 fps; nothing else steps.
- **Never moves:** the frame, the type positions, the paper, the sun direction.
- **Camera:** one continuous take; a high slow drift or orbit, a straight-down view slowly turning, a lateral move
  along a cutaway, a slow push to one detail. Never through geometry.

## 7. Transitions and rhythm

- Only three transitions: the frame draws in and grows out again; a wave sweeps across (colour, light, season); the
  ground is cut open (cutaway: a lid lifts then slides back, or a slab sinks straight down).
- No white flash, no spin, no fast hard cut. Type lines change halfway through each wave.
- Slow: about 10 s per state in a loop; one change at a time.

## 8. Finish

- No grain on the picture, no vignette, no depth of field, no reflections, no bloom, no motion blur.
- The frame's edge is grainy (a fine turbulence displacement, reseeded at 12 fps).

## 9. 3D look

The source is a three.js model: flat custom materials with three face tones, a fixed sun with hard PCF shadows tinted
cool purple, world-space halftone dots inside shadows, a 2 px indigo outline pass from normals and depth, antialias
off at 2× render. In Blender: Shader-to-RGB or constant toon materials with three tones, hard sun shadows tinted by a
shadow-colour mix, Freestyle or a compositor outline (~2 px indigo), object-space dot and stripe textures, a Z-mask
with noise for the frame. The previews draw it in 2D with an oblique view and the same rules.

## 10. Banned

- Gradients; depth of field, reflections, bloom, motion blur, volumetric light.
- Faceted shading or plastic highlights (low-poly); a cool diagram look (isometric infographic).
- Characters acting; people only as distant decoration.
- Colours sprinkled at random; grey nights or days; yellows going olive at night.
- Identical trees; outlines on thin things.
- Type over the picture; caption boxes.
- White flashes, spins, fast hard cuts.
- Copying Memphis Group objects, layouts or palettes.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 71 "Memphis Diorama", made by @EianLu
  (`styles/memphis-diorama/STYLE.md`, `DEMO.md`, frame and type constants in `demo/memphis.js`); demo film and stills
  CC BY 4.0 (LemoLab; the demo credits Eian). Read through the research notes `docs/research/styles/five-skills.md`,
  section "Memphis Diorama". The source renders a three.js model; this is rebuilt with React and SVG in Remotion.
- **Taken:** the paper, ink, shadow multiplier, light, pool, window, dusk, type and mark colours and the example hues;
  grass, water and crown colours; three centred type lines (Inter Tight 600 / 400, IBM Plex Mono) with fixed places
  and the three marks; the organic frame (radius 34, ±22 px and ±5.5 px noise, grain reseeded on a slow clock);
  parts-built houses, five crown shapes, layered water; the six pattern kinds; hatched cut faces; halftone dots in
  shade; three tones only; lamp pools; the motion rules (ease everything, grow or back-ease in, squash and spring, the
  wave, the frame growing open in 1.2 s, the 0.4 s line cross-fade, what never moves); the three transitions; the
  banned list.
- **Proposed:** the oblique 2D view and its numbers, every px size, the trunk and soil colours, the paper strips for
  light and the zigzag rays for scattered blue, rods for things in the sky, the callout sizes, the spring numbers, the
  night multiplier, the sample scenes.
- **Changed for vertical:** the 1520 × 744 frame above three lines at 25 / 18 / 15 px (1920×1080) becomes a 952 × 834
  frame at the top with the lines at 64 / 38 / 28 px below it, all above y = 1470; one line of type may take two lines;
  the picture shows a smaller piece of a town (three houses, five trees) seen closer, with a sky backdrop so the
  subject (the sky) is in the picture.
- Added to the catalog on 2026-10-31.
