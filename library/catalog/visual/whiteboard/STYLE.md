---
name: style-whiteboard
description: Visual style "Whiteboard": a lesson written live on one glossy dry-erase board by floating markers with no hand. Architects Daughter handwriting written on behind the marker, three marker colours with fixed meanings (black things, blue light and process, orange for you and the thing that matters), wobbly circles that overshoot their start, ghosts of old lessons, a window sheen, an orange map-pin magnet, and an off-white subtitle label with an orange dash. Use when a video is made in this style.
---

# Whiteboard

## 1. In one line

A good teacher's board, written live: the words and drawings appear stroke by stroke under a floating marker while
the voice explains, on a glossy white board that still shows the ghosts of yesterday's lesson. It suits science
explainers, "how does X work", online courses, proofs and worked problems, timelines and two-quantity comparisons.

## 2. Palette

Three marker colours at most, each with one meaning for the whole film. The board and the ghosts stay neutral.

| Role | Hex | Where |
|---|---|---|
| background (board top) | `#fbfbf9` | the warm white board, top of its gradient |
| boardLow | `#eeede9` | the bottom of the board's gradient |
| text (black marker) | `#23262c` | things and structure, most words |
| accent2 (blue marker) | `#2a5cb3` | signals, light, measurement, process |
| accent (orange marker) | `#d97757` | "you", time, the thing that matters (one per region); the magnet; the subtitle dash |
| muted / faint (ghosts) | `#9aa0a8` / `#8aa0c8` | ghost marks of old lessons, at 5–10% |
| wall | `#d8d3ca` | the warm grey wall, only when the camera passes the board's edge |
| frame | `#c9ccd0` | the aluminium frame and tray *(proposed)* |
| label | `#fbfbf9` | the subtitle label, at 90% |
| eraser | `#3a3c40` | the charcoal felt eraser *(proposed)* |

- A **monochrome variant** is allowed: all black, one element in orange.
- The accent never appears on props except its own marker's cap and the magnet.

## 3. Typography

- **Board writing:** Architects Daughter (the source writes with EMS Tech, its single-stroke version, which isn't on
  Google Fonts). Mixed case, handwriting. Every glyph is tilted up to ±2°, its baseline and size moved up to ±3.5%.
- **Sizes:** titles 112 px, the emphasised title word 220 px, numbers 300 px, headlines 100 px, step lines 62 px,
  labels 52 px, small labels 42 px, subtitles 46 px. The smallest text is 32 px.
- **Writing on:** left to right behind the marker, about 0.04 s a character (0.25–1.1 s a line) on the stroke curve;
  a term finishes being written exactly on its spoken word.
- **Emphasis:** the accent colour, a box, a double circle (orange), or the blue marker for light; never bold.
- **Burned-in subtitles:** Architects Daughter 46 px in black on an off-white rounded label (radius 18, 90%), a short
  orange marker dash at its bottom left, clauses of at most 34 characters a line, two lines at most.
- **Words on screen:** keywords, labels and one-line statements; about 10 words of board text at once.

## 4. Layout

- **One big board** is the world; each idea owns a region, and distance on the board is distance in the argument.
  Each vertical frame shows one region.
- **Margins** 90 px; must-read words stay between x = 90 and 960. **Safe zone:** 230 px top, 330 px bottom; the
  subtitle label sits just above the bottom safe line (y ≈ 1440–1590), kept free in every shot.
- **A label is wholly in or wholly out of a shot,** never half-cut by a push-in.
- **One sentence = one drawing:** the simplest geometry that carries the idea.
- **Frame, tray and wall** appear only when the camera goes past the board's edge (the end card's wide shot).
- **Left-aligned** board text; the end card is centred.

## 5. Elements

- **Marker stroke:** a ribbon 6–11 px wide around a centreline with a slow wobble (±2.6 px at a ~220 px wavelength)
  and a fine tremor (±0.6 px); chisel width by direction (0.8–1.0×, widest across the 45° nib); a pressure ramp from
  0.72 to 1 over the first 8%; a 12% taper at the end; a darker pooled dot just inside the start of strokes longer
  than 120 px (never larger than the stroke).
- **Shapes:** line, curve, wave (light), arrow (shaft + two head strokes), dashed line, box (four strokes with
  corner overshoot), hatch, circle (starts at an angle and runs ~20–30° past its start).
- **Ink** is multiplied onto the board at 94%, so crossings darken, through a dry-marker mask of short streaks.
- **Floating markers** (no hand): white barrel, a colour band and a posted cap in the ink colour, a felt nib, a cast
  shadow that grows when the marker lifts. Only the marker in use is on screen; colours swap through the frame edge.
- **The magnet:** a glossy orange map-pin magnet (radial gradient, specular highlight, white dot, soft cast shadow)
  dropped on the point that matters.
- **Ghost marks:** about 14 old words, circles and arrows in grey or pale blue at 5–8%.
- **Props in the wide shot:** the aluminium frame and tray, markers lying on the tray, a charcoal felt eraser with a
  small orange label.
- **No hands, arms or cursors, ever.**

## 6. Motion

- **stroke** (every mark): the source's curve u − 0.8·sin(2πu)/2π (slow landing, fast middle, slow lift), written as
  the bezier `[0.48, 0.04, 0.52, 0.96]` (within 0.3%). Each stroke's time comes from its length (~1100 px a second,
  0.06 s at least); a title about 1–1.5 s, a label 0.3–0.8 s, a whole small drawing about 0.5–1 s.
- **One marker writes at a time.** Between its strokes it hops (cubic-in-out, lifting with a bigger shadow). A change
  of colour takes 0.36 s: the old marker leaves through the right edge, the new one arrives.
- **Park:** 0.75 s after its last stroke the marker lifts away from the ink and leaves the frame.
- **magnet:** drops in 0.3 s (cubic-out), shrinking from 1.35× with its shadow tightening.
- **Eraser:** constant speed along a path, a 90–230 px band at 90% (a 10% ghost stays).
- **Camera:** 2D position and zoom (zoom interpolated in 1/z so pushes feel like dollies), a little roll, cubic
  in-out over about 1.2 s; real motion blur over 12 sub-frames when it moves more than 14 px a frame.
- **Holds:** 1 s after a region is complete.

## 7. Transitions and rhythm

- **No cuts on the board.** The camera rides a line the marker is drawing to the next region, whips to a new region
  (a twist), returns to an earlier one (a callback), shows two regions side by side (before/after), pushes into one
  symbol, or pulls back past the board's edge to the wall (the summary, used for the end card).
- **Rhythm:** clockwork-calm (the source: 120 BPM); a full stop into silence before the surprise.

## 8. Finish

- The board: a vertical gradient `#fbfbf9` → `#eeede9`, faint scuffs (6%) and micro-scratches (5%), and a diagonal
  window sheen (white up to 13%).
- Ink multiplied at 94% through the dry-marker streak mask.
- Film grain 0.02. No vignette, no glow. Shadows only under floating props.

## 9. 3D look

None.

## 10. Banned

- A hand, arm or cursor, ever.
- Text animated as blocks (kinetic type): words are written.
- A blue sheet or drafting conventions (that's Blueprint).
- Wax texture or a children's-book look (that's Crayon); chalk or a dark slate (that's Chalkboard).
- More than three marker colours, or a colour changing its meaning.
- A label half-cut by the frame or a push-in.
- Cuts on the board (only a whip).
- A pooled-ink dot larger than the stroke's start.
- Copying a famous animated lecture's drawings, characters, hands or music.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 06 "Whiteboard Explainer" (`styles/whiteboard/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "Whiteboard Explainer". Its demo films and
  stills are CC BY 4.0; none were used.
  - Taken: every hex (board gradient, ghost greys, the three marker colours, the wall, the sheen at 10–16%); three
    colours with fixed meanings and the monochrome variant; the stroke model (wobble ±2.6 px at ~220 px, tremor,
    chisel 0.8–1.0, pressure ramp 0.72 → 1, 12% taper, pooled dot, 6–11 px); the stroke curve
    u − 0.8·sin(2πu)/2π; circles that overlap past closure and four-stroke boxes; glyph jitter ±2°, ±3.5%; ink at
    0.94 multiplied with a dry-marker texture; floating markers with a cast shadow and no hand; the orange map-pin
    magnet; the eraser; ghost marks at 5–10%; the subtitle label (Architects Daughter, off-white at 90%, accent dash,
    clauses ≤ 44 characters); pen hops and the 0.75 s park; the camera vocabulary and no cuts; the bans.
  - **Rebuilt for Remotion:** the canvas engine becomes SVG ribbons from seeded noise; the dry-marker tile becomes an
    feTurbulence streak mask; the board's scuffs and scratches are feTurbulence; the writing is real type revealed
    behind the marker.
  - **Font:** EMS Tech (single-stroke, OFL) isn't on Google Fonts; Architects Daughter, the face it was made from, is
    used, written on with a left-to-right reveal instead of true stroke order.
  - **Changed for vertical:** the source is 1920×1080 over an 8000×4500 board; here each sample is one region in a
    1080×1920 frame, words are bigger (titles 112 px instead of a 120–200 px cap height across a wide frame; labels
    42–62 px), regions are stacked top to bottom, and the subtitle label sits above the bottom safe line rather than
    in the bottom 12%.
- *(Proposed):* the frame and eraser hexes, the type sizes, the 1100 px/s stroke speed, the 0.36 s marker swap, the
  marker's proportions, the hop and magnet curves, the scuff and scratch amounts, grain 0.02 (the source muxes grain
  2), and the sample lessons (a double-circled "blue?", a beam fanning into waves with 450 nm in blue, a molecule
  with a magnet, (700 ÷ 450)⁴ = 5.86 with the red box ticked off five times along the blue one, a three-step chain,
  and the wide shot of the board on its wall).
- Added to the catalog on 2026-11-01.
