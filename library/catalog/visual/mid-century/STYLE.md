---
name: style-mid-century
description: Visual style "Mid-century": a 1950s flat-colour how-to card; fills printed a few pixels off a broken, breathing ink line, one colour plane per scene with a floor band and a horizon line with gaps, a held presenter whose hand does the step, Alfa Slab titles on off-register plates, an Oleo Script kicker, numbered medallions, Jost caption cards with coral stars, atomic sparkles, starbursts, boomerangs. Use when a video is made in this style.
---

# Mid-century

## 1. In one line

Flat 1950s colour and limited animation for "follow along" films: printed cels, a presenter who holds still while a hand
does the step, and data landing on the picture. It suits set-up guides, safety and rules cards, recipe cards, app
onboarding, and notices.

## 2. Palette

Warm paper, warm near-black ink, soft atomic-age complements; nothing pure or neon. One ground per scene: the wall a 45%
tint of the colour, the floor a 16% shade. Never put the subject on its own colour or the presenter on their accent.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f4ead5` | caption cards, plates, the end ground |
| surface, muted (paper shades) | `#e6d8bc`, `#d4c29f` | drop shadows, second plates |
| text (ink) | `#2b2420` | all lines and slab lettering |
| accent (coral) / dark | `#e4613f` / `#b8452b` | the presenter's sweater, caption stars, red light |
| accent2 (turquoise) / dark | `#3fa7a0` / `#257a74` | the subject: it keeps this one colour all film. Here, blue light |
| mustard / light | `#e8b43a` / `#f3d37f` | the hook ground, sunlight, dots |
| step grounds | `#7f9cc0` dusty blue, `#a7ae5b` avocado, `#f0b4a8` pink, `#6e4a6b` plum | one per scene |
| navy / hair / skin | `#3b4766` / `#3a2621` / `#f2c7a0` | the presenter |

## 3. Typography

- **Kicker:** Oleo Script Bold (Google Fonts, OFL), 76 px, writes on left to right with a clip.
- **Titles, numerals, step titles:** Alfa Slab One (OFL), ink over an off-register cream or colour plate offset about 6 px;
  titles 156 px, headlines 108 px, step titles 62 px, numbers 300 px.
- **Labels, captions:** Jost 500/600 (OFL); letter-spaced caps for small labels (`STEP 1 OF 3`) at 32 px, detail tags 40 px,
  caption cards 44 px. **Smallest text:** 30 px.
- **Emphasis:** the numbered medallion, and data landing on the picture on the action beat.
- **Words:** one clause per line: title ≤ 36 characters, step title ≤ 22, detail ≤ 30, caption ≤ 40.

## 4. Layout

- **Rooms are not drawn:** one colour plane, a floor band (y = 1380), a horizon line with gaps, one or two props.
- **Key subjects** take at least 1/3 of the frame height and stay out of the caption band.
- **A round call-out** (frame in frame, a dashed leader) is the close-up, drawn at native scale so the line weight stays
  constant.
- **The lockup:** the steps as medallions (radius 104) held dead still at least 3 s: the screenshot frame. Vertically they
  form a column with their text beside them.
- **Margins:** 80 px. **Safe zones:** 230 px top, 330 px bottom; the caption card sits at y = 1500.

## 5. Elements

- **Off-register cels:** every fill is offset from its line by (6, 4) px, re-rolled ±1.6 px at 12 fps; on everything including
  text; off only for crisp diagrams.
- **Line:** ink ribbons of 3–5 px with ±40% width and 12–25% breaks.
- **Shading:** one flat darker plane inside a shape, never a gradient. **Drop shadow:** a shape copy offset (12, 12) in a paper
  shade at 50%.
- **Ornaments:** 4-point atomic sparkles, 8–18 point starbursts, sunburst rays (30 wedges at 55%), boomerangs, kidneys, dots.
- **The presenter** (invented): a geometric egg head with the nose in the face outline, flat hair, a coral sweater, navy
  trousers; the body is a held drawing; only the working arm (an ink ribbon with a colour ribbon on top) and hand move.
- **Caption card:** a paper slab with a thin ink border, its colour cel 5 px off, small turning coral 8-point stars at the ends.
- **Detail tag:** a paper card with a star bullet, popping on the action beat. **Medallion:** a colour disc, an icon, an ink
  disc with a paper numeral.

## 6. Motion

- **On twos** (12 fps): poses, hand shapes, cel jitter. **On ones:** camera, iris wipes, arrows, rays. Beat: 132 BPM.
- **Held body, moving hands:** anticipation (pull back 20–60 px) → a fast action in 0.15–0.25 s (action: cubic-out 0.2 s) →
  follow-through (recoil 6–10 px, settle), landing on a beat. One hand action per step.
- **pop:** medallions, tags, titles scale in with a back ease over 0.27 s, overshoot 1.9.
- **write:** script writes on with a clip (cubic-out 0.7 s). Headers slide in on twos.
- **card:** a 0.16 s fade with a 10 px rise.
- **Camera = the stand,** never handheld: a slow push (1.00 → 1.07), an iris through a medallion (0.42 s), a round call-out, a
  tilt with a pointing finger, colour-block wipes, a dead-still hold of at least 3 s, an iris-out onto one object.

## 7. Transitions and rhythm

- Circles (medallion iris, iris-out), colour-block wipes, cuts on a beat. No dissolves.
- Each step lands on its own chord; three planned silences; hook 4 bars, each step at least 3 bars, lockup 3 bars.

## 8. Finish

A light dry-brush tooth over everything (0.06), grain 0.03 (print, not film), a warm vignette at 0.14. No glow.

## 9. 3D look

none

## 10. Banned

- 1930s rubber hose: no black-and-white, no bouncing world, no hot jazz.
- A whiteboard explainer: pictures are printed, not written on.
- Anything pure or neon; gradients; a handheld camera; dissolves.
- Data as a slide.
- The subject on its own colour; the presenter on their accent.
- Stretched standing arms; a separate nose wedge; fat-blob fingers; zoomed-world close-ups.
- Copying any 1950s studio's or designer's characters, drawings, lettering or music, or naming them.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 48 "Mid-century Cartoon (1950s how-to card)"
  (`styles/midcentury-toon/`); demo film and stills CC BY 4.0 (LemoLab). Read through the research notes
  `docs/research/styles/five-skills.md`, section "Mid-century Cartoon (1950s how-to card)". Rebuilt with SVG in Remotion; no
  code was copied.
- **Taken:** every palette value and colour rule; the three faces and their roles; off-register values (6, 4, ±1.6) and the
  broken line; shading and drop shadows; ornaments; caption cards, tags, medallions, call-outs; the presenter's construction
  rules; twos and ones, the hand-action recipe, back-ease pop, the stand's camera, transitions; finish; the banned list.
- **Proposed:** the presenter's drawing; every px size for the tall frame; turquoise as blue light; the prism call-out, the
  bar lengths (true 5.9 to 1); tooth and vignette amounts (the source names them without numbers); the `#ee9a4d` orange and
  the use of plum in the six-colour call-out.
- **Changed for vertical:** the source's row of medallions became a column with text beside each; slab titles stack; the
  caption card moved from 60 px above the bottom edge to y = 1500; the presenter stands at the left with a call-out to the
  right.
- Added to the catalog on 2026-11-06.
