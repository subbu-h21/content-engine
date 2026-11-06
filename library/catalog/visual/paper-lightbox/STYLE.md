---
name: style-paper-lightbox
description: Visual style "Paper Lightbox": a stack of cut-paper sheets in a shallow box lit from behind; moonlit blues stepping from bright translucent back sheets to a near-black front, each sheet one flat colour with a warm top rim and a soft shadow on the next; windows, lanterns and the moon burn through; words are gold paper strips with a red seal, and a quiet Noto Serif subtitle sits under the picture. Use when a video is made in this style.
---

# Paper Lightbox

## 1. In one line

A lamp made of paper: 6–9 cut sheets in a shallow box, lit from behind, light burning through holes and every sheet
casting a soft shadow on the next; the camera is a macro lens inside the lamp. It suits stories and fables,
festivals and holidays, "two places, one light" stories, cultural explainers, keepsakes, and calm science stories.
No footage. 3D in the source (flat planes with real shadows); the previews draw it in 2D.

## 2. Palette

One temperature per stack: changing the ladder means changing place. Back sheets are bright and translucent, front
sheets dark and opaque; each sheet is one flat colour. Warm light is the only saturated thing besides one accent.

| Role | Hex | Where |
|---|---|---|
| background (sky 1) | `#0a1330` | the top of the back panel; the box's dark |
| surface (sky 2) | `#172a58` | the back panel's second step |
| sky3 | `#2e4478` | the back panel's third step |
| faint (sky 4) | `#43598a` | the back panel's lowest, lightest step |
| moon / halo / haloOuter | `#fffaf0` / `#fff0cf` / `#f7dca4` | moon disc, its halo, and the backlight's colour |
| muted (clouds) | `#c3cbe8` | auspicious clouds, translucency 0.9 |
| far | `#6a86c2` | far mountains, 0.7 |
| mid | `#3f5a92` | mid mountains with carved slits, 0.45 |
| walls / roofs | `#5a70a6` / `#1b284f` | the village, 0.25 |
| river / trail | `#22325e` / `#e9cf96` | river 0.3; the moon's trail on it |
| tree / blossom | `#17224a` / `#d9a24a` | tree and bridge 0.12; blossoms |
| bank | `#0e1532` | the near-black front bank and figures, 0.05 |
| lantern / lanternGlow | `#0d1328` / `#ff8a48` | lantern frames and their light |
| accent (window) | `#ffb862` | windows switching on |
| accent2 (seal) | `#b3302a` | seals only |
| strip / strip2 | `#f1dbac` / `#f3d998` | gold title paper; the sign-off strip |
| figure | `#2e170d` | ink on the strips; the warm ladder's front sheet |
| wallWarm / props / glowWarm | `#b08058` / `#6e3b1f` / `#ffc878` | the warm interior ladder (back wall, middle sheets, its light) |
| text | `#fbf3e4` | the burned-in subtitle |
| walnut / room / roomDark / spill | `#8a6a52` / `#2a2018` / `#0a0806` / `#ffc98a` | outside shots: frame, dark room, lamp light on the table |

A second accent only when the story has two sides (the source's red box `#9e2a20` and blue reply box `#2a4f7a`).

## 3. Typography

- **Words in the picture are paper:** titles, letters and short labels are cut gold strips inside the box.
  Cormorant 600, `#2e170d` on `#f1dbac`, sentence case: titles 104 px, headlines 92 px, captions 44 px, labels 38 px.
  A kicker strip in spaced caps (0.16 em) at 30 px on `#f3d998`. One line per strip; a long line becomes two strips.
- **Subtitle:** Noto Serif 500, 40 px, `#fbf3e4`, 0.06 em tracking, a soft dark shadow, centred, its last line on
  y = 1560. At most two lines. In 0.15 s before the line, out 0.3 s after.
- **Words shown as paper are never also subtitled.**
- **Numbers:** cut out of the front sheet in Cormorant 700, up to 470 px, so the lit scene shows through them.
- **Emphasis:** the red seal pressed beside the word, or a character lighting on its spoken word. Never bold or colour
  on the text.
- **The smallest text** is 24 px (strips here are 30 px and up). About 8 words of paper on screen at once.

## 4. Layout

- **Inside shots:** the box edges are fully out of frame. **Outside shots:** the whole frame is clearly in frame (a
  walnut frame 36 px wide around a black lining), never half.
- **The vertical stack** runs top to bottom: sky and moon (y 250–800), clouds and far peaks (700–1300), mid peaks
  with slits (1030–1440), village on y 1440, river 1436–1500, the bank from y 1590, figures on the bank.
- **Strips** sit in the sky band (from y 250) or on the dark front sheet; margins 80 px. The subtitle sits under the
  picture inside the bottom safe line.
- **Safe zone:** 230 px top, 330 px bottom for all words.
- **Focus** is on the story sheet; far clouds are soft (2.2 px blur).

## 5. Elements

- **Sheet:** one flat colour; lit by the lamp it is lifted toward the light colour by translucency × 0.62 × falloff
  (falloff from 1 at the light point to 0.22 at 900 px); a warm rim (`#ffecc8` at 35%) along its top edge, 3 px; a
  fibre texture at 22%; a soft cast shadow on the sheet behind (down 9 px, blur 11, 55%). Unlit, it is a dark
  silhouette (62% toward black).
- **Back panel:** four stepped blues, the only gradient besides light.
- **Emissive light:** moon (disc with bloom and a halo 3.2× its radius), windows, lanterns (flicker
  1 + 0.06·sin 7.3t·sin 3.1t), light through cut slits and glyphs, all with bloom (7 and 20 px).
- **Motifs:** karst peaks with carved contour slits, auspicious clouds, villages with gabled and stepped roofs, a
  flowering tree, a river with the moon's trail, lanterns, faceless black silhouette figures (body sheet plus limb
  sheets that turn at the joint).
- **Gold paper strips** and the **red seal** (a square with a paper-coloured inner border and a cut crescent).
- **Outside:** walnut frame with a bevel (light on top and left walls, dark on bottom and right), black lining, a
  dark room, lamp light spilling onto the table.

## 6. Motion

Everything moves like paper on a stick: it slides, turns about a pivot, grows from one edge, or lights up. No squash,
stretch, morphing or bending.

- **Lamp-on** (the big move): moon up (ease-in-out 1.2 s), then each sheet lights back to front 0.42 s apart
  (ease-in-out 0.6 s each), then the windows, then the lanterns' flicker.
- **strip:** grows from its left edge, ease-in-out 0.6 s, the words revealed, never squashed. The seal presses down
  from its top edge 0.55 s later.
- **slide:** a sheet or light arc slides or grows along one axis, ease-in-out 1.0 s.
- **Hand-held micro drift** of ±1.4 px keeps a locked frame alive (the source's 0.6 mm).
- **Camera:** a slow near-frontal dolly in or out (ease-in-out 7 s, then a creep), rack focus between sheets,
  lateral travel with parallax by depth, tilt up or down the stack, push into or pull out of the box.
- **Holds:** at least 1.8 s on a finished picture; every line ≥ max(1.8 s, speech + 0.6 s).

## 7. Transitions and rhythm

- Dissolves of 0.5–1.2 s, an iris from a centre, the light switching off and on, or a near-plane curtain of clouds
  closing over the last 1.2 s of a shot and opening on the next (its halves meeting exactly at their front edges).
- No whip pans, no digital zooms.
- Timed to the voice: shots start about 0.5 s before their line; a slow storyteller pace, 45–120 s. Silence = the
  lamp switched off, room tone only, until the light returns.

## 8. Finish

- Bloom on emissive light (strength 0.35 in the source; here 7 + 20 px blurs), vignette 0.42, saturation 1.05.
- No grain. A final fade to black over 1.2 s.

## 9. 3D look

In the source a three.js scene of flat textured planes parallel to the box front, never a 3D diorama. In Blender:
planes with emission × translucency and an area light behind them, a top spot giving soft shadows on every sheet
(never off), shallow depth of field focused on the story sheet, bloom, a gentle vignette, a cool night grade (lift
`[0, .005, .018]`, gain `[1.03, 1, .95]`). Outside shots: an extruded walnut frame, a dark room, area-light spill
(`#ffc98a`) onto real objects. The previews draw all of this in 2D.

## 10. Banned

- Flat paper-cut without depth: every sheet is backlit and casts a shadow.
- A pale front sheet; more than one colour on a sheet; gradients on sheets.
- Two temperatures in one stack.
- Squash, stretch, morphing, bending.
- A 3D diorama; sheets larger than the box.
- Whip pans, digital zooms, a drum kit.
- The same words as paper and subtitle.
- Half-visible box edges.
- Copying a specific lamp design, film frame or character.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0, except the demo's
  narration (Edge TTS), which is excluded and not used. Style No. 10 "Paper Lightbox" (Paper-cut Lightbox, the
  layered shadow-box lamp). Research notes: `docs/research/styles/five-skills.md`, "Paper-cut Lightbox (layered
  shadow-box lamp)". Rebuilt with SVG in Remotion; no code was copied. Cormorant and Noto Serif are SIL OFL.
- **Taken:** the night ladder and every sheet colour with its translucency, moon and halo, window and lantern glow,
  the warm interior ladder, seal red, gold strips, subtitle colour, room, walnut and spill colours; the palette rules;
  paper strips grown from an edge, the seal, Noto Serif subtitles (0.06 em, shadow, 0.15 s in, 0.3 s out), never the
  same words twice; the rim (35%, 3 px) and shadow logic, the backlight falloff (0.22 → 1), lamp-on order and 0.42 s
  stagger, lantern flicker, hand-held drift, camera vocabulary, transitions, vignette 0.42, no grain; banned list.
- **Proposed:** every px size for 1080×1920; the shadow's offset and blur in 2D (the source uses real soft shadows);
  the backlight strength 0.62; the unlit darkening; the seal's crescent; the motif drawings; the strip and slide
  curves (the source gives the 7 s ease-in-out push, not the others).
- **For vertical:** the source box is 0.56 × 0.33 m (landscape) and its subtitle sits 74 px from the bottom at 1080p.
  Here the stack is re-laid top to bottom for 1080×1920 (sky and moon above, peaks, village, river, bank below),
  strips sit in the sky band at 30–104 px instead of floating Chinese calligraphy, the subtitle is 40 px and sits on
  y = 1560, and each sample shows one picture with at most three strips.
- Added to the catalog on 2026-10-31.
