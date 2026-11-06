---
name: style-silkscreen
description: Visual style "Silkscreen": a travel poster screen-printed on camera, taped to a workbench; one opaque flat ink per squeegee pull, stepped colour bands instead of gradients, 1–3 px misregistration with overprint ghosts, midpoint-displaced ridges, pines and suns with concentric rings, condensed Big Shoulders names and Outfit labels, the facts printed last in a dark info band; a series is one template re-inked (noon, dawn, golden, dusk). Use when a video is made in this style.
---

# Silkscreen

## 1. In one line

A destination poster that prints itself on camera, one ink per pull, the facts printed last. It suits guides to places
and attractions, event and festival posters, series in colourways, seasonal notices, and facts carried by a few big
numbers; it works without narration because the poster's text is the subtitle. No footage, no 3D (depth is value and
multi-plane parallax).

## 2. Palette

One palette per poster, at most six inks by role: light sky, deep sky (and bands), far, mid, near (the darkest, also
the info band) and one bright accent (sun, route, key number; rare). Values step light far → dark near: depth is
value, never blur. Unprinted paper is the brightest colour. A series is one template re-inked in a new palette.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f2e8d2` | cream stock: water glints, knock-outs, the text on the band |
| text (banner ink) | `#1c2a33` | the darkest banner ink |
| muted (banner teal) | `#2f6f73` | the banner's teal |
| accent2 (banner orange) | `#e4683f` | the banner's orange-red |
| bannerGold | `#f7c66b` | the banner's gold |
| surface (noon near) | `#1d4331` | the default info band |
| accent (noon sun) | `#f2c14a` | the default accent |
| faint (noon far) | `#c2ae92` | quiet rules |
| table / tableDark / tape | `#5b4636` / `#2e231b` / `#e6dcc2` | the workbench and the masking tape *(proposed)* |

Poster palettes (sky1, sky2, far, mid, near, sun), in `style.json` under `palettes`:

| Palette | sky1 | sky2 | far | mid | near | sun |
|---|---|---|---|---|---|---|
| noon | `#e4eedc` | `#86bcd0` | `#c2ae92` | `#4c8753` | `#1d4331` | `#f2c14a` |
| dawn | `#f6cd98` | `#ee9a73` | `#9a7fa8` | `#3e7079` | `#1e3b3f` | `#fbe6b4` |
| golden | `#f7d787` | `#e9a94f` | `#a57c68` | `#5e7a45` | `#2b3a28` | `#fff1c4` |
| dusk | `#f4b461` | `#d8613f` | `#7c3e5f` | `#43325a` | `#1b1b2f` | `#fbe3a6` |

**Text inks are chosen by contrast** against the ink underneath (the better WCAG contrast of near ink or paper),
never a fixed key.

## 3. Typography

All sizes are in poster units (the poster is 1000 × 1500 u, drawn at 0.96 px a unit).

- **Names and values:** Big Shoulders (the source's Big Shoulders Display, now one family on Google Fonts) 900 for
  names, 800 for values; uppercase; auto-fit from 122 u down to 60 u. Values 64 u (never under 48 u).
- **Headlines printed into the sky:** Big Shoulders 900 at 150–195 u, centred, in the picked ink.
- **Headers tracked out:** Big Shoulders 800, 62 u, 0.32 em, printed into the sky.
- **Labels:** Outfit 600, 34 u, 0.12 em, uppercase.
- **The poster text is the subtitle:** no floating captions; with a voice, subtitles are a printed strip.
- **Emphasis:** the accent ink (the number `01`–`06`, a key value, the route) and the scale of the display.
- **The smallest text** is 24 px on screen (labels are 33 px).

## 4. Layout

- **The poster** (2:3) taped to a workbench at x 60–1020, y 160–1600 px; the table shows above and below.
- **Inside the poster:** a 26 u paper border; the art area down to y = 1140 u; the info band at y 1148–1474 u in the
  near ink: number (sun ink) and name on the first row, a 6 u sun rule, then a row of stats in content-sized columns.
- **Headers and headlines** are printed into the sky at the top of the art; the info band's text stays inside the
  bottom safe line (its last row ends at y ≈ 1590 px).
- **Close-ups** of a band keep the whole band in frame with ≥ 5% side margins; close-ups of a sheet keep its edge
  in frame.
- **The final lockup** is a wall of all the prints, held ≥ 3 s.

## 5. Elements

- **One path per ink;** knock-outs are holes in the path. Hard edges, no line work: an edge is where an ink stops.
- **Registration:** each ink sits 1–3 px out of register (`[2, −1]` by default), so a knock-out leaves a crescent of
  bare paper.
- **Overprint ghost (trap):** a faint multiply copy of each ink 2 u off, under it (20%).
- **Ink thickness:** a light rim top-left (22% white) and a dark rim bottom-right (22% black), 1.5 u.
- **Stepped bands** replace gradients: a flat colour, then 7 stripes thinning out, then the next colour.
- **Shapes:** suns with concentric rings; ridges by midpoint displacement with jagged lit facets in a lighter ink;
  pines as one outline of drooping tiers and a trunk; forests as rows of pines on a solid base; water as a flat body
  with horizontal paper glint bars; a faceless figure as one silhouette; a dashed route stamped segment by segment;
  numbered markers as accent discs.
- **Paper:** a fine mottle multiplied over the ink (55%), 1,600 pinholes in paper colour (visible only on ink), light
  film grain.
- **The bench:** planks with seams, grain and a knot, a few muted ink stains, torn masking tape on the corners; the
  poster casts a soft shadow.

## 6. Motion

- **pull:** each ink is revealed by a ragged squeegee front (a clip with a 30 u drag tail), linear and steady (a
  squeegee doesn't ease), 0.32 s, top to bottom (or left to right for text); the blade and its ink bead ride the front.
  One ink per beat, 0.3 s apart; accent inks start half a beat after their layer's main ink.
- **items:** the info band's items print left to right, one every 0.18 s, each in 0.12 s.
- **lift:** the screen hinges up (vertical squash and growing shadow) in 0.4 s.
- **reink:** a wide squeegee crosses the sheet diagonally (−12°) in 0.35 s; the geometry stays, only the inks change.
- **snap:** loose layers parallax by depth with paper gaps and thickness shadows, then snap into register on one hit.
- **Camera:** truck with the squeegee (slight roll), a locked top-down sheet, a fast pull-back as the screen lifts
  (expo-out 0.65 s), push and tilt to the info band, crane through loose layers, dolly along a row of prints, log-zoom
  back to the wall.
- **No fade anywhere.**
- **Holds:** each text stays ≥ characters ÷ 12 + 1 s after its last item lands (at least 1.5 s); a title 3.2 s; a
  stat row 2.2–3 s.

## 7. Transitions and rhythm

- Layers change by squeegee; posters change by trucking through a foreground silhouette (a tree, a lamp post, a
  sail) in the previous poster's near ink, centred on the switch so it covers the frame for about one frame; or by a
  table move. The film ends with a squeegee pull. No dissolves, no bare cuts.
- **One pull, one hit:** each ink lands on a musical event; accelerate by subdividing, not by changing tempo. The
  registration snap is the loudest downbeat. The music drops out for a beat before key facts.
- About 100 BPM; 3 posters in 30–40 s.

## 8. Finish

- The paper mottle, pinholes and ink rims are the finish; light grain 0.03; a soft vignette (0.18) on the bench.
- No blur for depth, no glow, no halftone.

## 9. 3D look

None: depth is multi-plane 2D parallax with paper-thickness shadows (9 u at 28%) and 3 u paper gaps.

## 10. Banned

- Gradients (use stepped bands); halftone; line work; strokes for edge effects.
- Fluorescent or translucent inks.
- Fades, dissolves, bare cuts; blur for depth.
- Parallax without paper gaps; full-rectangle screen shadows; jagged ink beads.
- Fixed text inks on dark palettes.
- Random coloured dots on the table; 7:1 banners.
- Risograph, ukiyo-e, woodcut or low-poly looks.
- Copying a real poster's composition, park name, lettering or logo; naming a real agency.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 54 "Silkscreen"
  (Silkscreen Travel Poster). Research notes: `docs/research/styles/five-skills.md`, "Silkscreen Travel Poster".
  Rebuilt with SVG in Remotion; the source's `silk.js` and `poster.js` were not read and no code was copied. Big
  Shoulders and Outfit are SIL OFL.
- **Taken:** paper, the four demo palettes and the title-banner inks; the palette rules (≤ 6 inks by role, value
  steps, rare accent, re-inked series, text ink by contrast); Big Shoulders (900 names, 800 values) and Outfit 600;
  the poster template (1000 × 1500 u, 26 u border, art to 1140 u, info band 1148–1474 u, 6 u rule, auto-fit 122 → 60
  u, values ≥ 48 u); registration offsets, the trap ghost, ink thickness rims, stepped bands, sun rings, ridges and
  facets, pines, water glints, the dashed route; squeegee pulls (linear, ragged front, 30 u tail, accents half a beat
  late), 0.18 s items, screen lift 0.4 s, re-ink at −12° in 0.35 s, the expo-out 0.65 s pull-back, snap into register;
  the camera vocabulary, transitions, rhythm, holds, texture budget and banned list.
- **Proposed:** the workbench, tape and stain colours; every px placement for 1080×1920; the ink-rim width, trap
  opacity, pinhole count, grain and vignette values; the pull and gap durations in seconds (the source ties them to
  the beat); the wording of headers and stats.
- **For vertical:** the source hangs a 2:3 poster in a 16:9 frame (0.49 scale at 1080p). Here the 2:3 poster fills
  the vertical frame almost edge to edge (0.96 px a unit), so labels are 33 px and values 61 px on screen instead of
  ~18 px and ~31 px; the bench shows only above and below it. Each sample is one poster in its own palette (noon,
  dawn, golden, dusk) instead of a wall of three.
- Added to the catalog on 2026-10-31.
