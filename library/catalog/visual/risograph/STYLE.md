---
name: style-risograph
description: Visual style "Risograph": stencil-printed animation; two or three translucent spot inks (Riso blue, yellow, fluorescent pink) multiplied over warm paper so overprints mix, stepped halftone bands on per-plate screen angles instead of gradients, grainy streaky ink with pinholes, fixed per-shot misregistration with a kick on accents, plates that arrive by roller, and Bricolage Grotesque titles printed on one plate or double-hit on two. Use when a video is made in this style.
---

# Risograph

## 1. In one line

Animation that looks stencil-printed frame by frame: translucent spot inks overprinting on warm paper, halftone dots,
ink grain, and plates that never quite line up. It suits indie brands and zines, lifestyle, small-figure-in-a-big-world
stories, "something new arrives" structures (one plate per turning point) and two things meeting. No footage, no 3D.

## 2. Palette

Two or three spot inks, never more. Every other colour is an overprint or a tint: inks multiply, so blue + yellow =
green, blue + pink = violet, yellow + pink = orange-red, all three ≈ black. Paper is the only white.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f6f1e6` | warm off-white: knockouts, highlights, the caption strip (never pure white) |
| text (Riso blue, plate 1, screen 15°) | `#0078bf` | type, silhouettes, the one-ink plate every main colour contains |
| accent2 (yellow, plate 2, screen 0°) | `#ffe800` | sun, beams, light tints |
| accent (fluorescent pink, plate 3, screen 75°) | `#ff48b0` | ground, double-hits, the emphasised word |
| muted / faint | `#98c3d7` / `#c5d9de` | the 38% and 20% blue tints as flat colours, only where dots can't print (UI) |
| other ink sets | teal `#00838a` + orange `#ff7477`; federal `#3d5588` + red `#ff665e` + sunflower `#ffb511` | alternatives: one set per video |

Rules: each area uses at most two plates, at most one of them as a tint; never three halftoned plates in one area; at
least one ink carries a silhouette alone; skin is a 26% tint of the palest ink, never dots of a saturated ink; save
the full three-ink overprint for the climax.

## 3. Typography

- **Titles:** Bricolage Grotesque 800, uppercase, tracking −0.01 em; the title line 104 px, the key word 260 px,
  numbers 430 px. Fitted to the 900 px column.
- **Headlines and list items:** Bricolage Grotesque 800, sentence case, 100–112 px (list 60 px), leading 1.02.
- **Captions and labels:** Jost 500 (600 for kickers and units), 42 px (labels 38 px, kickers 34 px in capitals),
  0.5 px tracking, printed in blue on a paper-white knockout strip (zero ink, 6 px radius).
- **Type is printed on one plate,** so it grains and misregisters with it. **Emphasis** is a second plate: the word
  prints on pink, or **double-hits** pink + blue 10 px apart (violet core, coloured fringes).
- The smallest text is 26 px; at most about 8 words of display type on screen.

## 4. Layout

- **One horizon, one big flat field or disc, one small figure;** the figure's head against the flattest colour in the
  frame (the sun disc).
- Lots of solid paper and solid ink; text on bare paper or a knockout strip. Margins 90 px; text inside 230 px top /
  330 px bottom; centred.
- **Design for the one-plate version:** the blue plate alone still reads (title, figure, sky bands).
- Stepped bands for skies: 100 / 62 / 38 / 20% from the top down.

## 5. Elements

- **Plates:** each plate is one ink multiplied over the paper. Solid areas, halftone tints (bands 20 / 26 / 38 / 62%;
  ≥ 90% prints solid), knockouts (zero ink = paper).
- **Halftone:** round dots on a 10 px screen anchored to the paper (a moving shape slides under a fixed screen), at
  15° (blue), 0° (yellow), 75° (pink).
- **Ink imperfection:** grainy dot edges (2.2 px displacement), feed streaks and blots that change density
  (k = 0.80 + 0.14·streak + 0.08·blot), pinholes in solids; paper fibres ±1.5%.
- **Flat shapes, no outlines:** colour fields and silhouettes only.
- **Knockout halo** around figures: 4.5 px of bare paper in every other plate, so plates misregister around it like a
  trap.
- **Registration crosshairs** only on the end card.

## 6. Motion

- **Registration:** one fixed offset per plate per shot (±2.5 px, ±0.03°), never jittered per frame.
- **kick:** on an accent (a plate's arrival, the title word, the number) the plate jumps 11 px and decays with a
  half-life of 0.07 s, ringing at 7 Hz.
- **drift:** through a held moment a plate may drift up to 25 px (sine-in-out, 2 s) and snap back on the downbeat.
- **roller:** a plate arrives by a moving edge with a heavier ink band (26 px at +22%), linear, 0.45 s, top to
  bottom (or left to right for text, bottom to top for grounds).
- **grain boils:** the dot-edge grain re-rolls on every 12 fps print; streaks and blots stay for the shot.
- Characters on twos (12 fps), camera on every frame. Plates arrive 0.35–0.5 s apart.
- **Holds:** ≥ 1.8 s after the last plate lands. Prints never fade.

## 7. Transitions and rhythm

- **Overprint growth:** a shape of one ink grows over the frame (cubic-in-out, 0.6 s), turning everything under it
  into the mix, then shrinks into the next scene's key shape. Also roller sweeps, match cuts on a flat shape, hard cuts
  on beats. Never a cross-dissolve or a soft digital wipe.
- **Rhythm:** about 120 BPM, cuts on bar lines (2 s); each plate brings an instrument; a silent bar under the climax
  drift.

## 8. Finish

- No added grain and no vignette: the grain is in the print (dot edges, streaks, pinholes, paper fibres). No glow.

## 9. 3D look

None.

## 10. Banned

- Flat vector art with a noise overlay: every colour comes from the plates.
- CMYK pop-art halftone (process colours, keylines); screen-print poster looks (opaque flat ink).
- The RISO brand, logo or machine trade dress (ink names are colour references only).
- More than 3 inks; three halftoned plates in one area; gradients other than stepped halftone.
- Registration jitter or streaks that change every frame.
- Cross-dissolves, soft digital wipes, fading titles.
- Saturated dots on skin; pure white paper.
- Copying a named illustrator's characters, compositions or palettes.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 12 "Risograph"
  (Risograph Print). Research notes: `docs/research/styles/five-skills.md`, "Risograph Print". The source prints with a
  WebGL2 shader over an RGB plate canvas; here each plate is an SVG layer multiplied over the paper, with SVG patterns
  for the screens and SVG filters for grain, streaks and pinholes. No code copied. Bricolage Grotesque and Jost are SIL
  OFL.
- **Taken:** paper `#F6F1E6`; the three inks and their screen angles (15° / 0° / 75°); the alternative ink sets;
  multiplied overprints and the palette rules; Bricolage Grotesque 800 titles in capitals on the blue plate; the
  double-hit (pink + blue, 10 px); Jost 500 captions with 0.5 px tracking in blue on a paper-white knockout strip with a
  6 px radius; stepped bands (20 / 38 / 62 / 100%); the layout rule (horizon, disc, figure, head against the flattest
  colour); the knockout halo of 4–5 px; registration (fixed per shot ±1–3 px, ±0.0005 rad), the kick (8–14 px,
  ~0.25 s, ringing), the drift (≤ 25 px), grain that partly boils, the roller sweep with a heavier band; density
  k = 0.80 + 0.14·streak + 0.08·blot; transitions, rhythm and banned list.
- **Proposed:** the 10 px screen period (the source's 7 px at 1080p, raised so dots survive a phone screen and the
  half-size previews); the 26% band; the halo 4.5 px; kick 11 px with a 0.07 s half-life at 7 Hz; the roller 0.45 s
  and its band; grain 2.2 px; the pinhole threshold; every type size for 1080×1920; the Venn of three inks for "every
  colour"; the sample wording ("By the numbers", "In three steps").
- **For vertical:** the source's wide tracking shots (small figure, big empty sky) become a centred dome: the sky is a
  410 px disc in stepped bands with the figure's head against the sun, the title prints above it and the key word
  (260 px) below it; captions are 42 px instead of the demo's 42 px in a 1920 frame, so they read on a phone.
- Added to the catalog on 2026-11-04.
