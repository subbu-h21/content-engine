---
name: style-iso-infographic
description: Visual style "Isometric Infographic": a floating true-isometric diorama of flat three-tone blocks with no outlines on a cream ground with a dot lattice; thin ink label pins, circular insets, Isotype numbers counted in identical cubes, extruded Jost block titles and map-label caption cards; solids arrive by motion, never by alpha. Use when a video is made in this style.
---

# Isometric Infographic

## 1. In one line

A system diagram comes alive as a floating isometric model: flat coloured blocks, thin ink labels, numbers you can
count. It suits process explainers, "how X works", supply chains, annual reports and any story whose numbers add up.

## 2. Palette

A pale neutral ground plus 5–7 flat hues, each with three tones by face: top light, left (+y) mid, right (+x) dark.
Colour works as a legend: one hue, one meaning, for the whole video. For "this one", everything else may fade toward
warm grey.

| Role | Hex (top / left / right) | Where |
|---|---|---|
| background | `#f2e6d0` | the ground, with a faint dot lattice |
| surface | `#fbf4e6` | caption cards, pin rings, inset fill |
| text (ink) | `#2e2522` | 3 px infographic lines, labels, numbers |
| muted | `#8a5b3a` | a label's second line |
| faint | `#d9c8a9` | the lattice dots |
| red (accent) | `#cf5140` / `#b3352b` / `#8c2620` | red light, roofs, the legend chip, the sides of block titles |
| blue (accent2) | `#5a9bcb` / `#3c7fb1` / `#2d6390` | blue light only, always the same blue |
| green | `#7ba75f` / `#5e8c4a` / `#476f37` | land, trees |
| cream | `#fbf4e6` / `#f2e6d0` / `#d9c8a9` | plates, plinths, walls |
| soil | `#a77850` / `#8a5b3a` / `#6a432a` | board strata, the molecule, trunks |
| mustard | `#e9be5c` / `#d9a53a` / `#b0832a` | sunlight |
| orange, violet | `#e8945a`, `#8876b8` | the two extra lanes of the spectrum *(proposed)*; tones from the mix rule |
| shadow | `#231a2c` | mix target: dark faces go 22% toward it, top faces 20% toward warm white `#fff8ea` |

## 3. Typography

- **One face:** Jost (Google Fonts, OFL). Titles and labels are all caps with tracking 0.12 em.
- **Block titles:** Jost 700, 132–146 px, lying on the plate and reading up-right, extruded 20 px with red sides.
- **Heads in screen space:** Jost 600, 72 px, 3 lines at most. **Numbers:** Jost 400, 260 px; the unit Jost 500 at
  half size (130 px).
- **Labels:** Jost 600, 36–40 px; second lines Jost 500, 30 px in soil. **Smallest text:** 28 px.
- **Every label** has a 7 px halo in the ground colour, so it reads over any block.
- **Caption:** a map label: Jost 500, 42–46 px, sentence case, ink.
- **Emphasis:** colour as a legend, a label pin with a row of icons. **Words:** at most 8 on screen besides labels.

## 4. Layout

- **True isometric:** sx = (x − y)·cos30°·k, sy = ((x + y)·½ − z)·k; x runs down-right, y down-left, z up. Everything
  is queued, sorted by depth (x + y + z), then drawn. The projection never rotates or tilts.
- **The board floats** on the ground over a soft blurred shadow; its front faces show soil strata (34 + 22 px).
- **Vertical frame:** a 500–520 unit square board spans about 900 px; heads and numbers sit above it, the caption
  below it. Title plates are 430 × 680 with the type running along the long side. Lists use three small boards (200
  units) on a Z route down the frame, each with its text beside it.
- **Margins:** 96 px. **Safe zones:** 230 px top, 330 px bottom; the caption is centred at y = 1500.
- **The subject** fills at least 1/3 of the frame height at key moments; labels never cover it.

## 5. Elements

- **Solids:** no outlines. Boxes, cylinders, cones, gable roofs, flat-disc spheres (mid disc, dark crescent, lit cap),
  separated only by their three tones.
- **Ink lines (3 px)** only for furniture: label pins, dashed routes, inset borders.
- **Label pin:** a ring dot → vertical leader → horizontal rule → text above the rule; the direction is chosen so it
  never covers the subject.
- **Circular inset** (radius 190): a frame within the frame on cream with an ink border, grown from a leader.
- **3D polylines:** flat bands (10–22 px) with an arrow head; sunlight mustard, blue light blue, red light red.
- **Isotype numbers:** identical three-tone cubes (58 units with a 6 unit gap, 10 to a layer); the count is the
  real count, and the caption states what one cube is.
- **People:** billboards with a round head, a tapered two-tone body, a thick arm, no face.
- **Clouds:** flat ellipses in cream tones. **Caption chip:** a tiny red cube.

## 6. Motion

- **Nothing moves without a line leading it:** the route draws slightly ahead, a leader grows before an inset opens, a
  cut line draws before a skin slides.
- **drop:** solids fall 150 units on a spring (damping 13, stiffness 190, mass 1). Solids arrive by motion, never by
  alpha; squash about 18% and two small bounces on landing.
- **isotype:** icons pop with a back ease (overshoot 2.2) over 0.28 s, about 0.024 s apart; the number counts up over
  the same span.
- **route:** cubic-in-out over 0.7 s. **leader:** cubic-out over 0.35 s. **inset:** expo-out over 0.45 s.
- **card:** the caption's border draws in 0.2 s, its text wipes left to right, and it leaves down 8 px with a fade.
- **Cutaway:** a cut line in 0.3 s, then the near skin slides out along its normal in 0.35 s, and hatched rims fade in
  over the last 40%.
- **Accumulation is acceleration:** arrivals on quarters, then eighths, then sixteenth-note waves.
- **Camera:** a world centre and a log-interpolated zoom only. Follow along a route, hold wide with an inset, push
  through nested cutaways (0.9, 0.6, 0.6 s), a fast log pull-out.

## 7. Transitions and rhythm

- One continuous take, or a cut to a new board or inset. Hidden jumps go inside a dive. No fades.
- Stations on beats; sound leads a station by 0.5–0.6 s.

## 8. Finish

Flat: no grain, no vignette, no lighting beyond the three face tones; a soft blurred shadow under the board (blur 34,
28%); the faint dot lattice on the ground.

## 9. 3D look

Not real 3D: a 2D isometric projection with three-tone face shading. A Blender version would use an orthographic
camera at true-isometric angles and flat emission shading.

## 10. Banned

- Perspective; rotating or tilting the projection.
- Outlines on solids; lighting beyond the three tones; textures.
- A flat 2D explainer, a blueprint, a low-poly 3D island.
- Semi-transparent moving solids.
- One hue with two meanings.
- Numbers that don't add up.
- Copying any game's, explainer channel's or Isotype archive's characters, buildings, icons, palettes or music.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 24 "Isometric Infographic" (`styles/iso-infographic/`);
  demo film and stills CC BY 4.0 (LemoLab). Read through the research notes `docs/research/styles/five-skills.md`,
  section "Isometric Infographic (flat three-tone diorama)". The source draws on a 2D canvas; this is rebuilt as SVG in
  Remotion. No code was copied.
- **Taken:** the projection and painter sort; every three-tone hue, ground, ink and shadow target; Jost and its
  weights, caps and tracking; the 7 px halo; the map-label caption; label pins, circular insets, Isotype counts,
  billboards, flat clouds, extruded type on a plate, the board with strata; every motion rule; flat finish; the banned
  list.
- **Proposed:** the orange and violet lanes; the px sizes for the tall frame; the Isotype unit (one cube = 0.1 of red's
  scattering, so the towers hold 59 and 10 cubes); soil for the molecule; all sample scenes.
- **Changed for vertical:** the source's square board fills 16:9 as a rhombus; here the board spans the width and heads
  or numbers take the space above it; the title plate is a long slab; the Z route became three small boards down the
  frame; the caption moved from 64 px above the bottom edge to y = 1500, clear of the safe zone.
- Added to the catalog on 2026-11-06.
