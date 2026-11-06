---
name: style-crayon
description: Visual style "Crayon": a picture-book page drawn live in wax crayon on warm toothy paper. Indigo outlines that boil on twos, zig-zag colouring that skips over the paper's tooth, a box of about a dozen crayons, hand-lettered Gaegu titles and Patrick Hand words written letter by letter on ragged patches of blank paper, and one watercolour wash per film that reveals what white crayon was hiding. Use when a video is made in this style.
---

# Crayon

## 1. In one line

A picture book drawing itself: a skilled adult drawing like a child, in wax crayon on toothy paper, every line
gently boiling, and one watercolour wash that reveals a hidden white-crayon secret. It suits picture books and bedtime
stories, kids' learning, gentle science explainers, thank-you and year-in-review cards, and "hidden feature" reveals.

## 2. Palette

A box of about a dozen crayons, never more. Value comes from pressure, not from extra hues.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f4efe3` | the page; the ragged knock-out patches behind words |
| text (indigo) | `#2d3263` | every outline and every lettered word. Outlines are one dark colour, never black |
| muted (light indigo) | `#5d6291` | kickers and small notes *(proposed)* |
| faint | `#ddd5c4` | the paper's shadow side *(proposed)* |
| accent (sky) | `#79acd9` | blue light, the thing the film is about |
| accent2 (yellow) | `#f5c63c` | the sun, sunlight |
| orange / red / pink | `#ec8a3c` / `#d4483c` / `#ee8ea4` | rays and scribbled underlines / red light, dots / cheeks |
| peach / brown / ochre | `#f4c7a4` / `#7a4b31` / `#e7b867` | skin and mittens / hair / the air molecule |
| green / violet | `#62a24c` / `#6a5aa6` | grass and hills / clothes |
| whiteWax | `#fbfaf4` | the white crayon, reserved for resist: nearly invisible until the wash passes |
| wash | `#3f78c8` | the one watercolour (cerulean here), multiplied over the page at density 0.85 *(proposed hex)* |

- **One watercolour per film,** chosen for what it reveals: cerulean = a blue sky (this sample), ultramarine = night,
  rose = dawn, sap green = rain. It never paints characters (they keep the paper white).
- **Colouring is an action:** a scribbled coat is putting it on; a pink scribble is a blush; the wash is the sky
  turning blue.

## 3. Typography

- **Titles:** Gaegu Bold, hand-lettered on the page in indigo crayon (it takes the wax texture too). Title 128 px,
  headlines 116–124 px, end line 150 px, the hidden word 230 px, numbers 300 px. Leading 1.08. Sentence case.
- **Words and labels:** Patrick Hand 400: body 56 px, labels 46 px, kickers 42 px. The smallest text is 32 px.
- **Every glyph** is tilted up to ±4° and nudged up to ±3 px (at 100 px), and boils on twos (±0.8° and ±0.8 px).
- **Writing on:** titles letter by letter, 0.055 s a letter; a body line in about 0.35 s. Text never fades: it
  leaves by a page turn or by being coloured over. Text where the wash passes survives it (wax resists).
- **Emphasis is colour, not type:** a word lettered in a crayon colour ("blue" in sky), each letter in a different
  crayon ("every colour"), a scribbled orange underline, or a word written in white wax for the wash to reveal.
- **Words on screen:** about 10 at most; one to three short lines.

## 4. Layout

- **One page is the world.** Lots of bare paper; key figures fill at least a quarter of the frame height in close
  shots; child perspective (people bigger than doors).
- **Margins** 90 px; must-read words stay between x = 90 and x = 960 (off the platform buttons).
- **Safe zone:** 230 px top, 330 px bottom for words; drawings (hills, sky) run to the frame edges.
- **Bare paper at the bottom** is kept for the printed words; a word over a drawing sits on a ragged knock-out patch
  of blank paper.
- **Left-aligned** words; the end card is centred.

## 5. Elements

- **Crayon outline:** a ribbon around a hand-wobbled centreline (slow wobble 1.7 px at a 90 px wavelength), width
  ±15%, tapered ends (to 45% over the first and last 10%), a denser core at 45% width and one thin streak. Widths:
  characters 7 px, buildings and hills 8 px, refined "adult" objects 4.5 px.
- **Colouring:** a zig-zag hatch across the shape, rows 17 px apart, 11 px wide, at −32°, overshooting the outline
  by up to 7 px, pressure varied per pass (0.72–1.14×); big areas get a second, lighter cross-hatch pass at 45%.
  Rows are laid one after another.
- **Wax on tooth:** wax only sticks where the paper's tooth is higher than 1 − 1.22 × pressure (soft edge ±0.07), so
  light pressure is speckled and heavy pressure nearly solid. The tooth is the page's own (it never slides).
- **Characters:** round head, about 2.6 heads tall, dot eyes with a white-wax catchlight, pink cheeks, a bold hair
  shape outlined on its outer edge only, tube limbs, mitten hands. Objects with faces (the sun, an air molecule) get
  big eyes and cheeks.
- **Light** is a wavy crayon arrow: short, tight wiggles for blue, long lazy waves for red.
- **Knock-out patches:** ragged blobs of blank paper under words placed over a drawing.
- **The wash** (once per film): wide overlapping bands laid left to right, graded from 80% at the top to 50% at the
  bottom, with ragged displaced edges (40 px), a pooled darker rim, blooms and horizontal brush streaks, multiplied over the page under the crayon, so every crayon mark,
  including white wax, resists it.
- **No hands** holding crayons; no rulers; no clip art.

## 6. Motion

- **On twos:** everything drawn (lines, colouring, words, the boil) steps every 2 frames at 30 fps (15 a second).
- **Boil:** each line re-jitters every step: whole-line offset ±0.8 px, wobble ±0.9 px. Characters at full amplitude,
  background lines at 0.6×, colouring still. Calm it to half when the film goes quiet.
- **draw** (lines): along their length, sine-in-out over 0.6 s (0.3–0.9 s by size).
- **colour:** row by row, linear over 0.9 s (constant hand speed is the point).
- **write:** letter by letter, 0.055 s a letter; a body line in 0.35 s.
- **wash:** the bands sweep left to right, sine-in-out over 1.3 s, each band starting a little after the one above.
- **Acting:** substitution (a new drawing per pose, on the beat), big simple poses, no in-betweens.
- **Order in a shot:** outline → colouring → face details → words → the reveal. Stagger 0.12 s between parts.
- **Holds:** at least 1 s once a page is complete.

## 7. Transitions and rhythm

- **Changes:** drawing on, colouring over, the wash, a pan along the page, or a page turn. Never a dissolve.
- **The wash** comes once, at the heart of the film (here: the title's reveal), after a short held beat.
- **Rhythm:** gentle, music-led (the source: a waltz at 72 BPM, a bar every 2.5 s). Silence is a beat: a full beat of
  nothing after a failure.

## 8. Finish

- **Paper:** `#f4efe3` with a three-octave tooth (frequency 0.42) embossed from the upper left (strength 0.55 →
  26% × 0.55 multiplied) and a horizontal fibre texture at 7%.
- **Warm vignette:** `#b08a5a` at 16%, multiplied, from 55% of the radius.
- **No film grain** (the paper is the grain). No glow, no blur, no drop shadows.

## 9. 3D look

None.

## 10. Banned

- Cute vector art with a crayon filter: the look comes from wax catching the paper's tooth.
- Black outlines; more than about 12 crayons; more than one watercolour per film; the wash painting a character.
- Dark subtitle boxes; fading crayon or titles in or out; dissolves.
- A screen-fixed paper tooth.
- Light-pressure colour under a wash (it goes muddy): press 0.8 or more, or cross-hatch.
- A whiteboard (markers, a hand), a chalkboard, or a watercolour painting (the wash is a guest).
- Copying a famous picture book's characters, songs or images, or naming it.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 01 "Crayon Picture Book" (`styles/crayon-book/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "Crayon Picture Book". Its demo films and
  stills are CC BY 4.0; none were used.
  - Taken: the paper and ink hexes and the demo crayon box; the box-of-a-dozen, indigo-not-black, white-wax-resist
    and one-watercolour rules; Patrick Hand and Gaegu Bold; letters tilted and boiling, written left to right, never
    faded, on ragged paper patches; the stroke model (hand wobble ~1.7 px, width ±15%, tapered ends, denser core and
    a streak; outline widths 7 / 8 / 4–5 px); zig-zag colouring with overshoot 0–7 px, pressure 0.72–1.14×, a 40–50%
    cross-hatch; the wax-adhesion rule (tooth > 1 − 1.22 × pressure, edge ±0.07); boil every 2 frames (±0.8 px,
    wobble ±0.9 px; background 0.6×; colouring still); the character recipe; the wash's pooling and resist; the warm
    vignette and no grain; the bans.
  - **Rebuilt for Remotion:** the source's WebGL compositor becomes SVG: feTurbulence for the tooth (embossed with
    feDiffuseLighting), an arithmetic threshold for the wax, feDisplacementMap and two blurs for the wash's edge.
  - **Changed for vertical:** the source is 1920×1080 with one 3200×1800 page and a travelling camera; here each
    sample is one 1080×1920 page, words are bigger (titles 116–150 px instead of a corner title; body 56 px instead
    of 54 px at 1080 high), and there are fewer things per page (one figure, one sun, one idea).
  - The source steps at 12 fps inside 24 fps; at this engine's 30 fps the step is 2 frames (15 a second).
- *(Proposed):* the cerulean wash hex and its density (the source gives only an ultramarine transmission), muted and
  faint hexes, the type sizes, the easing curves and durations, the warm vignette colour, the sample drawings (a
  child pointing at a sun, a sun with a face fanning out crayon colours, a molecule with a face, two bars cut to the
  true 5.9 : 1 ratio).
- Added to the catalog on 2026-10-31.
