---
name: style-engraving
description: Visual style "Engraving": a natural-history copperplate that engraves itself on laid paper; swelling burin lines and cross-hatching build every tone (never a grey fill), a pressed plate mark and ruled border frame the sheet, magnified roundels sit in the margins on hairline leaders, Bodoni Moda roman capitals and italic names label the parts, Pinyon Script writes the notes, and a transparent watercolour wash blooms in last. Use when a video is made in this style.
---

# Engraving

## 1. In one line

A 19th-century natural-history plate that engraves itself: a burin cuts swelling lines, hatching builds the tone,
magnified roundels fly to the margins, and a hand-laid watercolour wash arrives last. It suits science explainers
("one minute on…"), museum and specimen labels, textbook figures with labelled parts, craft heritage, and maps or
site plans. No footage, no 3D (volume comes from tone fields in 2D).

## 2. Palette

The print is two values, paper and ink: all tone is line density, never a grey fill. Colour is transparent wash only,
muted earth and mineral pigments, one stronger pigment at most, never on lettering, rules or paper outside the
figure; reserve it (the whole subject at one moment, one part, or none).

| Role | Hex | Where |
|---|---|---|
| background (laid paper) | `#f1e8d2` | the sheet, with laid lines, chain lines and fibres |
| faint (plate tone) | `#e8ddc2` | inside the pressed plate mark, at 55% |
| text (ink) | `#1c1510` | every line and every roman or italic letter (warm near-black) |
| muted (script ink) | `#2b1e14` | script notes and the subtitle |
| accent (blue-grey wash) | `#a9c3cf` | the pale wash, 45–65%: skies, the blue bar, the scattered glow |
| accent2 (amber wash) | `#d9962a` | the one stronger pigment, used for one part (the sun) |
| earth | `#a8743e` | a second, rarer earth wash |
| foxing | `#9a6a34` | sparse foxing spots |
| slip | `#f4eddb` | the deckled paper slip under a subtitle |

## 3. Typography

- **Roman capitals:** Bodoni Moda 400, wide tracking 0.16 em: titles 74 px, headlines 64 px; labels 26 px with
  0.14 em (`PLATE III · BY THE NUMBERS`).
- **Italics** for names and emphasis: Bodoni Moda italic, 34–40 px for names, 104 px for the emphasised title word.
- **Script** for notes: Pinyon Script, 48 px (56–58 px on an end plate), never shrunk; balanced over two lines when
  long.
- **Subtitle:** Pinyon Script 46 px `#2b1e14` on a deckled paper slip, bottom centre, at most 860 px wide and two
  lines; on 0.1 s before the line and off 0.6 s after; never over a label.
- **Numbers:** Bodoni Moda 500 at 330 px, outlined and filled with horizontal burin lines.
- **Hierarchy is the emphasis:** roman title → italic name → script note. Colour never on type.
- **The smallest text** is 24 px. Lettering is sparse: a few labels per plate.

## 4. Layout

- **The sheet is the world.** Plate mark (pressed, bevelled) at (44, 96)–(1036, 1824); inside it the ruled border:
  a 2.4 px rule and a 0.8 px hairline 9 px inside, at (84, 136)–(996, 1784).
- **Subject centred** inside the border; labels and roundels in the margins. Roundel slots on the vertical sheet:
  lower right (800, 1290), and a column at x = 250 for a sequence of figures.
- **Lettering:** the plate label at y = 262, the title block under the picture (y 1160–1550), credits at the foot in
  italic ("del. et sculp.").
- **Margins:** 120 px for lettering. Safe zone 230 px top, 330 px bottom.
- **Leaders** keep ≥ 34 px clear of the subject, with one waypoint at most.
- **The final plate** shows every label, the credits and the call to action at once.

## 5. Elements

- **Line families**, all from one light (upper left, `{x: −0.55, y: −0.62, z: 0.56}`):
  - first hatching at −35°, spacing 5 px, width 0.7–2.6 px by tone, switching on at tone 0.14;
  - crossing at +35° (70° to the first), spacing × 1.1, width × 0.78, from tone 0.48;
  - the third (lozenge) family at 0°, spacing × 1.25, width × 0.6, from tone 0.76.
- **Swell law** on every line: width × (0.2 + 0.8·sin(πu)^0.7) along it, so lines taper in and out.
- **Contours** 2.2 px, swelling 0.45–1.35× (heavier on the side away from the light), cut in three runs that pinch
  where they hand over. Lines stop at shapes in front (occlusion).
- **Tone from shape:** spheres (lambert from the light, a touch of reflected light at the rim), cylinders for bars,
  skies darker toward the zenith and lighter round the sun, seas with a glitter path. Never a texture.
- **Magnification roundels:** radius 150, a double rule (2 px and 0.75 px, 4 px inside), a ruled ground of horizontal
  lines, the subject on a paper halo.
- **Leaders:** 0.95 px hairlines from a 3 px dot on the part; an italic figure number near the roundel.
- **Hand colouring:** multiplied over paper and under the ink; 3.5 px spill, a 2/1.5 px misregister, a tide-line at
  the wet edge, a low-frequency density lift (0.55).
- **Paper:** laid lines every 4.5 px, chain lines every 96 px, fibres, 26 foxing spots, the plate tone and bevel.

## 6. Motion

Nothing fades or slides like UI: lines are cut, letters are cut or written, colour blooms, sheets are pressed, peeled
or laid down.

- **cut:** each line is cut at the burin's constant speed (2,600 px/s; 900–1,400 px/s for waves), linear. Many lines
  at once.
- **Cutting order is the animation:** contour → first hatching sweeping across the form (`sweep`, ease-in-out, about
  0.8–1.1 s) → crossing → the darks. A full build takes a few seconds (the source: 3.2–6.2 s).
- **Letters:** roman and italic letters cut glyph by glyph, 0.045 s apart (a long line within 0.9 s). **Script** is
  written in one left-to-right stroke (0.05 s a character, ease-in-out).
- **bloom:** colour spreads from where the brush touched with a ragged front, 1.25–1.6 s a region, regions 0.42 s
  apart, ease-out.
- **fly:** roundels fly on an eased arc with a 30 px lift, growing log-linearly to their radius, 0.9 s.
- **Camera:** a loupe over the sheet: follow the burin tip (about 4×, 3° roll), log-zoom pull-outs (4× → 1× in 3 s),
  push to a part and ride with its roundel, pan along the sheet at reading zoom, or a locked frame with at most a 2%
  breathing push.
- **Holds:** a title ≥ 2.2 s; a note ≥ characters ÷ 12 + 1 s from when it starts writing; a number ≥ 2.5 s alone; the
  final plate ≥ 4 s.

## 7. Transitions and rhythm

- **From printmaking only:** a proof pulled (the sheet peels across, 0.7 s), a tissue guard laid over, a region
  burnished out and re-cut, a new sheet laid on the bed. No dissolves, no wipes.
- **Rhythm:** plucked strings while lines are cut, the bow only when colour arrives; true silence for a beat before
  the first wash; the final plate on a cadence. 30–40 s for a museum label, 35–60 s for "one minute on…".

## 8. Finish

- No grain and no vignette. The texture is the paper itself (laid and chain lines, fibres, foxing) and the plate mark's
  bevel; the washes (spill, misregister, tide-line, density lift) carry the rest.

## 9. 3D look

None.

## 10. Banned

- Uniform-width lines (they read as pen or vector).
- Grey fills in the ink.
- Opaque colour; colour on lettering, rules or paper outside the figure; more than one strong pigment.
- Fades and UI-style slides; dissolves and wipes.
- Leaders hugging the subject; outline-only parts beside a hatched body.
- A woodcut, a pen sketch, an engineering drawing, a sepia filter.
- Copying a historic plate, pose, border or title.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 53 "Engraving"
  (Copperplate Engraving). Research notes: `docs/research/styles/five-skills.md`, "Copperplate Engraving". The
  hatching engine is rebuilt in SVG from the documented values; the source's `burin.js` was not read and no code was
  copied. Bodoni Moda and Pinyon Script are SIL OFL.
- **Taken:** paper, foxing, plate tone, ink, script ink, slip, the wash colours (blue-grey wings `#a9c3cf`, amber
  `#d9962a`, earth `#a8743e`) and the colour rules; Bodoni Moda capitals with 0.16 / 0.14 em tracking, italics for
  names, Pinyon Script for notes and subtitles (on 0.1 s before, off 0.6 s after); the plate mark with its bevel and
  the 2.4 + 0.8 px ruled border 9 px apart; the line families, width ratios (×0.78, ×0.6), spacing ratios (×1.1,
  ×1.25), thresholds (0.14, ~0.48, ~0.76), the swell law, contours in pinching runs, the one light direction;
  roundels (double rule 2 + 0.75 px, 4 px apart, ruled ground, halo), leaders (0.95 px, ≥ 34 px clearance); the
  wash (spill 3.5 px, misregister 2/1.5 px, tide-line, lift 0.55, blooms 1.25–1.6 s, 0.42 s apart); roundel flights
  with a 30 px lift; cutting order; the camera vocabulary, transitions, holds and banned list.
- **Proposed:** every px size for 1080×1920; the line spacing (5 px, about 1/60 of a 300 px figure instead of the
  source's 1/180, and a 0.7 px minimum width instead of 0.18 px, so lines survive a phone screen and video
  compression); burin speed; the letter and script timing; the lettering wording ("Plate I", "Fig. 2", "a plate on
  scattered light", "del. et sculp."); the seascape vignette, the spectrum of waves (wavelength drawn proportional to
  nm) and the line-filled numerals.
- **For vertical:** the source's plate mark (70, 44)–(1850, 1036) and roundel slots are landscape. Here the plate
  mark and border run the full height of 1080×1920, the subject sits in the upper middle, lettering goes under it
  (titles 74 px instead of 50 px at 1080p; labels 26 px instead of 17 px; script 48 px instead of 29 px), and roundels
  sit lower right or in a column on the left.
- Added to the catalog on 2026-10-31.
