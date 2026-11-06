---
name: style-one-line
description: Visual style "One Line": a single warm-black ink line that never leaves the paper. It thickens where the hidden pen slows on turns and thins on fast runs, bleeds a little into warm paper, pools at corners and spreads into a teardrop blot when it stops; the camera follows the nib and pulls back to reveal one finished picture; one stretch of the line carries the only colour; a connected script writes the title and Caveat writes the words in empty paper. Use when a video is made in this style.
---

# One Line

## 1. In one line

One ink line that never lifts: it travels across warm paper, turning into a face, a sun, a wave, a number, and the
camera follows it until the whole picture is revealed. It suits life stories and company histories, journeys and
processes ("one continuous thing"), reveals where small moments add up to one picture, data drawn as a line, and calm
explainers.

## 2. Palette

Ink on paper only; nothing fills the frame.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f4efe4` | the warm white page: nearly the whole frame |
| text (ink) | `#1d1a17` | the line (warm black), the script title |
| muted (ink at 84%) | `#4a4540` | the hand-written words *(proposed hex for the source's ink at 84%)* |
| faint | `#e6dfd0` | paper mottling and fibres *(proposed)* |
| accent (blue) | `#2c5d97` | the one coloured stretch of the line (blue = water, cold, sky; here the scattered blue) *(proposed hex)* |
| accentRed | `#b3332b` | the source's accent (red = love, danger), for a film whose one stretch means that |

- **One accent at most, used once per film,** on a stretch of the line that means something; it stays visible in the
  final picture. Never a second accent. (Each preview sample shows its own stretch: in a film there is one.)
- **The pen's shadow** is ink at 15%.

## 3. Typography

- **Title:** Sacramento (a monoline connected script), 124 px (headlines 96 px), written on left to right over 1.6 s
  behind a paper-coloured halo (12 px) so passing lines never cross the letters; in empty paper away from the drawing.
- **Words:** Caveat 500, 46–58 px, ink at 84%, no box, left-aligned or centred; written on in 0.2 s + 17 ms a character
  behind the same halo; they fade out over 0.45 s.
- **The end card's style name** (when shown): Caveat 600, caps, tracking 0.2 em.
- **Case:** sentence case. **Words:** few (about 8 on screen). **Emphasis:** the coloured stretch, and the stop.
- **The smallest text** is 32 px.

## 4. Layout

- **Most of the frame is paper.** Each picture is composed so the finished drawing sits centred in its zone; the title
  sits in the top third, the words beside or under the drawing.
- **The nib stays inside the central ~72% × 66%** of the frame while the camera follows it.
- **Margins** 90 px; words between x = 90 and 960. **Safe zone:** 230 px top, 330 px bottom for words; the line may
  run off the frame's bottom.
- **Lines never closer than 5 px** (they braid); connectors fall on natural lines of the picture (a jaw, a swash under a
  number, a chain between pictures).

## 5. Elements

- **The one line:** a filled ribbon (not a stroked path). Width = 5.2 px × pen pressure (0.66 + 0.8·e^(−v/300),
  where v is the pen's speed: fast = thin, slow = fat) × ±8% noise. A bleed: the same ribbon 1.6× wider, blurred
  (0.9 px), at 22%. Ink pools as small dots where the pen is slowest (sharp corners).
- **Retracing** over an existing line is legal and invisible (it only thickens slightly): the line can go out to a sun
  and come back.
- **The stop:** a teardrop blot (tip at the nib, belly sagging downward, a darker rim) that spreads over 0.7 s.
- **The pen is never drawn:** only a soft blurred shadow wedge towards the lower right (ink at 15%) and a 3 px
  contact dot. Hands only ever as shadows.
- **Pictures** in these samples: a face in profile looking up whose gaze climbs to the sun; a sun whose line becomes six
  waves, each shorter; a beam into a molecule and out as a star; numerals written by the line with a spiral for a
  decimal point; a chain through a sun, a molecule and an eye; a sky line and an eye looking up.
- **No fills, no shading, no second line weight, no background art.**

## 6. Motion

- **On ones,** at 30 fps (stepping breaks the illusion of continuous drawing). No boil.
- **draw:** the whole picture over ~3 s (sine in-out); within it, the pen's time follows arc length weighted by
  curvature (1 + 12 × turn, smoothed over ±4 points so the speed never jumps): turns take longer. Travelling runs
  ~520 px a second; the most important stroke is usually the slowest.
- **Camera:** one continuous move: it starts close (zoom 1.5–2.0) following the nib's position averaged over
  −0.55…+0.4 s (lag and anticipation) with a follow weight of 0.55–0.75, then pulls back to the composed frame
  (sine in-out) over the last 45–50% of the drawing, and holds.
- **The stop is an event:** the nib stops, the blot spreads, and the sound cuts to silence for 1.5–3 s.
- **Holds:** ~1 s on the finished picture.

## 7. Transitions and rhythm

- **No cuts.** Transitions are morphs: the last stroke of one picture is the first stroke of the next.
- **Rhythm:** the score is written to the drawing: key notes on corners and marks, fast lines with short notes, a
  stopped line as one long fading note.
- **Arc of a film:** a single touch on blank paper (a hook within 3 s) → quick light chapters → the one coloured
  chapter → a stop → the line resumes, changed → slow final strokes during the pull-back → the whole picture held.

## 8. Finish

- Warm paper with soft mottling (soft-light, 30%) and faint long fibres (8%), anchored to the page.
- Vignette 0.13. No grain, no glow, no bloom.

## 9. 3D look

None.

## 10. Banned

- A whiteboard explainer: no hand, no marker, no erasing, no text-heavy boards.
- Ink wash: no tones, no brush blooms.
- Line-art animation with cuts and many strokes.
- Fills, shading, a second line weight, background art.
- The pen lifting, or the pen drawn.
- A second accent, or the accent on more than one stretch in a film.
- Stray connectors (they read as wrinkles), lines closer than 5 px.
- Copying a famous continuous-line character or illustration.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 05 "One-line Drawing" (`styles/one-line/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "One-line Drawing". Its demo films and
  stills are CC BY 4.0; none were used.
  - Taken: paper `#F4EFE4`, ink `#1D1A17`, words at 84%, the source's red accent; one accent used once on a stretch
    that means something; Sacramento for the title (written over 1.6 s) and Caveat for the words (0.2 s + 17 ms a
    character behind a paper halo, 0.45 s fade); the line as a filled ribbon with pressure from speed
    (0.66 + 0.8·e^(−v/300)), ±8% noise, a blurred bleed at 22%, pooling where slow; the teardrop blot; the pen never
    drawn, only its 15% shadow and a contact dot; retracing allowed; timing by curvature; the camera following the
    averaged nib (−0.55…+0.4 s) and pulling back; on ones; no cuts, morphs only; the nib kept in the central ~72% ×
    66%; the score and the arc; the paper finish and vignette 0.13; the bans.
  - **Rebuilt for Remotion:** the canvas renderer becomes SVG ribbons computed from hand-authored paths (Catmull-Rom
    curves, arcs, waves), with the camera as an SVG transform.
  - **Changed for vertical:** the source is 1920×1080 with the drawing beside the title; here the 1080×1920 frame
    stacks the script title in the top third and the picture below it, words are bigger (Caveat 46–58 px instead of
    46 px at 1080 high; the title 96–124 px instead of 76 px), and each sample is one picture.
- *(Proposed):* the blue accent hex (this topic's one stretch is the scattered blue), the muted and faint hexes, the
  5.2 px base width, the curvature weight 12, the 520 px/s speed, the zoom and follow values, the curves, the type
  sizes, and the sample pictures.
- Added to the catalog on 2026-11-01.
