---
name: style-circuit-board
description: Visual style "Circuit Board": the subject redrawn as a top-down printed circuit board; copper under green mask, ENIG gold pads and vias, off-white silkscreen plotted stroke by stroke in a routed 0/45/90° stroke font, amber and silver-cyan light running along traces, macro depth of field, motes and a key light. Use when a video is made in this style.
---

# Circuit Board

## 1. In one line

The subject redrawn as a printed circuit board seen from straight above, with information running as light along the
copper. It suits energy, power and signal paths, supply chains, networks and latency, and "how a thing travels".

## 2. Palette

The film is green in three values; the mask is never recoloured per scene. Gold is for metal, one off-white ink, and
light is the only saturated colour and carries meaning.

| Role | Hex | Where |
|---|---|---|
| background (laminate) | `#05190f` | what is absent: channels, clearances, holes |
| surface (copper pour) | `#1c6a44` | fills the board |
| faint (rim) | `#4aa977` | the bevelled rim on every copper edge |
| muted (trace fill) | `#2b8158` | traces |
| via | `#3f9e6c` | stitching vias |
| gold / edge / drill | `#d9b25b` / `#a07b30` / `#06130d` | ENIG pads and vias |
| text (silkscreen) | `#f2eee1` | all type, outlines, symbols |
| accent (current) | `#ffbe54`, head `#ffecb4` | energy light with a near-white core |
| accent2 (second flow) | `#aad6e2`, head `#e4f6fc` | water, data, goods; here blue light |
| desk | `#0b0d0c` | only when the whole board is the subject |

Red is for one fault, at most once in a film. Weave: `rgba(120,200,150,0.045)` and `0.03` over `rgba(0,0,0,0.10)`.

## 3. Typography

- **Board type is not a font:** silkscreen is a monoline stroke alphabet drawn in code on a 4 × 6 grid, routed at 0/45/90°
  with chamfered corners and round caps (stroke 0.15 of the capital height). Capitals, digits and `. , ? × - /` only.
- **Sizes (capital height):** title 118 px, headlines 84–92 px, numbers 250 px, labels 44 px, notes 34 px. **Smallest:** 30 px.
- **Text is world-anchored and plotted stroke by stroke.** The board prints only key words and numbers, never sentences.
- **Subtitle plate:** Noto Sans 500 at 42 px *(the source's open sans, Latin set)*, off-white on laminate at 72%, centred
  at y = 1500; it comes and goes with the voice.
- **Reading time** ≥ 1.5 s + characters ÷ 15, fully in frame.

## 4. Layout

- **Straight-down view always.** The lit subject sits on a third, or dead centre for symbols.
- **At least two layers of detail** round the subject: copper, stitching vias and unlit routes behind; motes in front.
- **Type sits on keep-outs:** clear pour with no vias or routes under it, as a real board would.
- **The board edge** shows only when the whole board is the subject.
- **Margins:** 96 px. **Safe zones:** 230 px top, 330 px bottom; labels stay out of the depth-of-field bands (the top and
  bottom 11.5% of the frame) and the vignette.

## 5. Elements

- **Layers bottom-up:** laminate with weave; copper pour with mottling; traces (a laminate channel, a rim stroke, a narrower
  fill, mitred corners, 0/45/90° runs); ENIG pads (round, square pin-1) with a sheen band on the top third and a dark drill;
  vias as rings with dark bores; silkscreen.
- **Traces:** 16 px, main lines 26 px, unlit routes 7 px. **Pads:** r 34.
- **Components** are schematic footprints: a chip with pins and a designator (U1), test points (TP1), title blocks with
  REV A. No part numbers, no real markings.
- **Geography as copper:** rivers and coasts as clearances with via fences; cities as test points; corridors as buses.
- **Fill empty copper** with real board texture; never decorative routing.

## 6. Motion

- 30 fps on ones. Silkscreen appears only by plotting stroke by stroke (plot: cubic-in-out over 0.7 s); copper and pads
  never pop in; the board never moves, only the camera.
- **Current types are told apart only by motion:** AC = short dashes rocking over a faint energised line (0.55 Hz); DC = a
  stream behind a travelling head with slow streaks; step-down = thinner trace, smaller dashes; second flow = parallel
  streamlines of short dashes, faster in the middle. Stream speed 460 px/s.
- **Pads flash on arrival:** a quick bloom (expo-out 0.5 s) then a steady glow.
- **Camera:** ride the pulse with its head on a third; rise until both ends are in frame; crash zoom onto a pad; locked
  macro hold; whip along a trace (0.5 s); matched cut on a centred symbol; plunge through a via (hold first, at least
  0.6 s) and out of another; a log pull-out across nested boards.
- **Level of detail:** vias, designators and rims fade before going sub-pixel.

## 7. Transitions and rhythm

- Motion into motion and matched cuts; no fades, wipes or page turns.
- Each spoken line gets one picture action: a pad lights, a stream changes shape, a tag prints. Drop the rhythm before a
  verdict.

## 8. Finish

- **Additive light:** two blurs (24 and 5 px) under a sharp core, screen-blended; glow widths are capped so wide traces
  don't turn into white bars.
- **Depth of field:** a 9 px blur faded into the top and bottom bands.
- **Key light:** a warm radial pool at 10% from the upper left. **Motes:** 26 out-of-focus discs (r 14–60, alpha
  0.025–0.075, 60% warm). **Vignette:** to `rgba(0,10,6,0.58)`. **Grain:** 0.02 *(proposed)*.

## 9. 3D look

none (top-down 2D; the macro feel comes from screen-space depth of field, motes and key light)

## 10. Banned

- Photos or handwriting; white-on-blue blueprint paper; a sci-fi HUD with glass or floating panels; a 3D circuit city or any
  perspective.
- Decorative traces; two traces crossing on one layer (use a via); a flat empty pour.
- Recolouring the mask per scene; red except for one fault; overexposed bloom bars.
- Text in the depth-of-field bands or cut at the frame edge; whole sentences on the board; system fonts for subtitles.
- Fades, wipes or page turns; hole plunges under 0.6 s; an accidental board edge in close shots.
- Copying a real board layout, logo or part marking.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 76 "Circuit Board" (`styles/circuit-board/`, palette from
  `demo/src/palette.js`, finish from `demo/src/post.js`); demo film and stills CC BY 4.0 (LemoLab). Read through the
  research notes `docs/research/styles/five-skills.md`, section "Circuit Board". The source draws on Canvas 2D; this is
  rebuilt with SVG and CSS in Remotion. No code was copied; the stroke alphabet was drawn afresh.
- **Taken:** every palette value, the board layers, the idea of a routed stroke font, the keep-out of text from bands,
  current told by motion, pad flashes, camera vocabulary, the two-blur light layer, bands, key light, motes, vignette, the
  banned list.
- **Proposed:** the stroke alphabet's glyphs and size rules; trace, pad and via sizes; grain 0.02; Noto Sans in its Latin
  set; all sample scenes (the 59 against 10 pulses show the true ratio on equal traces).
- **Changed for vertical:** the source always draws at 1920×1080. Here routes run down the tall frame, labels are larger
  (capitals 44 px and up against the source's 25 px sign-off), the subtitle plate carries one Latin line at y = 1500 clear
  of the bottom 330 px, and the depth-of-field bands sit in the safe zones so type never enters them.
- Added to the catalog on 2026-11-06.
