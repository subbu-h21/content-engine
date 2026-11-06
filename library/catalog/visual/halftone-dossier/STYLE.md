---
name: style-halftone-dossier
description: Visual style "Halftone Dossier": a retro printed case file on cream archive paper; overprinted halftone dots in five flat inks (navy, blue, pink, yellow, red), Alfa Slab One headlines that pop in letter by letter with a pink misregistered shadow, Bagel Fat One giant numerals, a navy caption pill with a yellow keyword, rubber stamps that slam and shake the page, a case-file HUD and a thick-outlined kawaii suspect with line boil. Use when a video is made in this style.
---

# Halftone Dossier

## 1. In one line

A retro printed case file read out one exhibit at a time: cream paper, overprinted dots, huge slab headlines,
slamming stamps and a cute suspect. It suits myth-busting and verdicts, "the case against X" explainers, lists of
counts or causes, humour and pet content, and social shorts that must work with the sound off (the cards carry it).
No footage, no 3D.

## 2. Palette

Paper plus one dark ink plus four flat spot inks; never more than five inks. No gradients and no transparency
ramps: tone is dot size and overprint.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f4ecdd` | the light-scene ground; multiplied over everything as the paper layer |
| text (navy) | `#1d2340` | the one dark ink: outlines, headlines, the caption pill, the HUD, fade-outs |
| accent (pink) | `#ff5a87` | the overprint shadow ink: misregistration, the caption's offset shadow, cheeks, dots over yellow |
| accent2 (yellow) | `#ffc628` | the highlight ink: keywords, numerals, starbursts, folders |
| blue | `#2e55d6` | the title-card ground, halo dots, the suspect, one ink layer, emphasis words in headlines |
| red | `#e8384f` | reserved: stamps, alarms, the REC dot |
| cream | `#fff4e2` | type on dark, bellies, eye highlights, dust specks |
| night | `#18203f` | the night scene's ground |
| muted (night 2) | `#2a3568` | the night scene's lighter dot layer |
| pinkPale | `#ffd3df` | a pale flat fill under a halftone |
| faint (fold) | `#e2d6c0` | the paper's fold line *(proposed)* |

Night or "secret" scenes switch to the dark ground with a lighter dot layer of the same family, still multiplied by
the paper so they look printed, never glowing.

## 3. Typography

- **Headlines:** Alfa Slab One (a black slab, standing in for the source's unnamed Latin "black slab"), 104 px,
  leading 1.08, sentence case, left at x = 80, with a misregistered shadow of +8/+8 px in pink (scaled with size).
  Always built letter by letter, never faded. 3–8 words, one per line when it helps.
- **Numerals and the title word:** Bagel Fat One: the title word 300 px (uppercase), count numerals 660 px bleeding
  off the right edge, list numerals 190 px; yellow fill, a 10–11 px navy outline, pink halftone inside.
- **Captions and stamps:** Noto Sans 900. The caption pill text is 40 px cream (34 px for a two-line caption), the
  keyword in yellow. Stamps are 1–2 words, uppercase, 84–120 px.
- **Data and HUD:** JetBrains Mono 800, 26 px, 2–3 px tracking: case file, chapter chip, REC clock, "EXHIBIT A".
- **The smallest text** is 24 px.
- **Emphasis:** the keyword's colour in the caption pill; giant halftone numerals; a stamp. In a headline, the
  emphasised words may be blue.

## 4. Layout

- **A flat, frontal printed page** with a faint fold across the middle (y = 960).
- **HUD** on y = 250 inside the safe zone: `FILE 450/700` and a navy chapter chip (`COUNT 01 | the science`) top
  left; a blinking red REC dot and the running clock top right. Colours invert on dark scenes; hidden on the title
  card.
- **Headline** top left from y ≈ 460; **the exhibit** (suspect, card, numeral) in the middle band (y 560–1300);
  **the caption pill** centred on y ≈ 1470, above the bottom safe line.
- **Margins:** 80 px. Safe zone 230 px top, 330 px bottom.
- **One idea per 2–4 s card:** one big headline, one gag or exhibit, one caption line.

## 5. Elements

- **Halftone:** a rotated grid of circles drawn as one path; step 22 px (never under 14 px: moiré); screen angles
  15°, 20°, 25°, 30°, 45°, 60°, 70°, one per layer; radius = density × step × 0.66 (about 0.7 merges into solid).
  Density fields: `radial` (halos, glows), `edge` (dots crowding the frame border), a linear ramp
  0.25 + 0.75 × (y − y0)/(y1 − y0) ("lit from above"). Dot layers multiply, so inks overprint.
- **Halftone-filled shapes:** a flat fill, then a darker dot screen clipped to the glyph or shape.
- **Paper layer** over everything (multiply): low-frequency mottling, fine noise (about ±13 levels, warmer), a radial
  vignette `rgba(120,100,80,.35)`, the fold.
- **Dust:** 520 cream specks (r 0.6–2.4, 75%) and 90 navy specks, reseeded every 2 frames (not film grain).
- **Line boil** on characters and drawn props only: displacement (frequency 0.022, scale 5) reseeded every 0.1 s on a
  40-seed cycle, plus a fine ink-grain mask.
- **The suspect:** chunky kawaii shapes, 7 px navy outline, flat blue fill, cream bellies, pink cheeks, big glossy eyes
  (navy ellipse, two cream highlights) that blink and squint. Generic and original; never a real mascot.
- **Stamps:** a double rounded rectangle (12 px outer border, 0.35× inner) and the words, through an ink filter
  (displacement 7 and a coarse grain mask), at 93%, tilted −10° to +12°.
- **Caption pill:** navy, radius 14, pink +8/+8 offset shadow, tilted −1.2°.
- **Props:** 24-point starbursts, speech bubbles (cream, 6 px navy stroke), radial rays (28 wedges turning 12°/s),
  pinned evidence cards with a red push pin, a mugshot height chart, name plates, folders, redaction bars.

## 6. Motion

Everything enters with overshoot; nothing fades in.

- **pop:** back ease (overshoot about 1.9, here the curve `[0.3, 1.75, 0.6, 1]`) over 0.38 s, scaling from 0 or
  rising from below the frame.
- **char:** each glyph drops 70 px (30–100) and squashes on landing; 0.025 s between letters (0.05–0.08 s in CJK).
- **fall** (title letters): 700 px in 0.2 s each (ease-in), 0.25 s apart, then a squash wobble.
- **squash:** sq = 1 − k·e^(−7a)·cos(21a), applied as scale(1/sq, sq) from the baseline (k 0.22 for letters, 0.3 for
  the title word).
- **stamp:** 0.09 s from 2.6× to 1× (ease-in), then a 5% damped bounce; on the same frame the page shakes and flashes.
- **shake:** quadratic decay over 0.45 s, different x/y frequencies: 5–7 px small landings, 16 px the first stamp,
  26 px the verdict.
- **flash:** white from 0.5 to 0 over 0.3 s (never a 100% white frame).
- **caption:** pops in over 0.4 s at −1.2°, about 1 s after its headline, and holds to the end of the card.
- **push:** 1 → 1.05 over 4 s (a profile), or 1 → 1.08 ease-in over 2 s (tension before a verdict).
- **Idle:** the suspect breathes (±2% height), blinks, and the REC dot blinks at 1 Hz.
- **Holds:** every caption ≥ max(1.8 s, speech + 0.6 s).

## 7. Transitions and rhythm

- **Dot wipe:** an 80 px grid of circles grows to r = 62 (covering the cell diagonal) and shrinks over 0.44 s, centred
  on the cut, with a diagonal delay; the scene changes while covered. Each cut may use its own ink.
- **Hard cuts** only as contrast on the big hit (the drop). No dissolves.
- **Rhythm:** cards of 2–4 s, every cut on a bar line at 120 BPM (a bar = 2 s). Title 1 bar → accusation 1 → mugshot
  2 → counts 2+2+2 → summary 1 → verdict on the drop 1 → reason 1 → close 2. The first half of the drop bar is
  empty so the stamp lands alone. Final fade to navy over 0.7 s.

## 8. Finish

- The paper layer, its vignette and the dust are the finish. No film grain, no gradients, no glow.

## 9. 3D look

None.

## 10. Banned

- Gradients or transparency ramps; more than five inks plus paper; a dot step under 14 px.
- Fading text in.
- Line boil on text, dots, the HUD or captions.
- A frame without dots and paper; a frame without the HUD outside the title card.
- Dissolves; a 100% white flash.
- Glowing night scenes.
- Risograph zine collage as the whole look; Swiss grid type on white; candy game-show sets.
- Copying a specific pop-art or comic reference; real mascots.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 13 "Halftone
  Dossier" (retro print case file). Research notes: `docs/research/styles/five-skills.md`, "Halftone Dossier (retro
  print case file)". Rebuilt with SVG and CSS in Remotion; no code was copied. Alfa Slab One, Noto Sans, JetBrains
  Mono and Bagel Fat One are SIL OFL.
- **Taken:** every ink (paper, navy, blue, pink, yellow, red, cream, night, night 2, pale pink) and the ink rules; the
  font roles (Bagel Fat One, JetBrains Mono 800, a black sans for captions and stamps); the misregistration
  (+8/+8 pink), the caption pill (radius 14, +8/+8 pink, 46 px at 1080p, −1.2°); the halftone construction (step
  20–26 px, angles, maxK 0.6–0.72, density fields, multiply); the paper layer (noise ±13, vignette, fold), dust
  (520 + 90, every 2 frames), line boil (0.022 / 5 / 0.1 s / 40 seeds); the suspect's construction; stamps (borders,
  ink filter 7, 0.93, tilt); every motion constant (back ease, letter drops, title falls, stamp slam, squash formula,
  shakes, flash, push, dot wipe); rhythm; banned list.
- **Proposed:** Alfa Slab One for the unnamed Latin black slab and Noto Sans 900 for the black sans; the fold
  colour; every px size for 1080×1920; the HUD wording (`FILE 450/700` names the two wavelengths; the clock is the
  sample's real running time); the bezier standing in for the back ease.
- **For vertical:** the source frames are 1920×1080 with the caption pill at y = 980 and a vertical fold at x = 960.
  Here the page is a tall case file: the fold runs across at y = 960, the headline sits top left, the exhibit fills
  the middle band, the caption pill sits at y ≈ 1470, the HUD sits on y = 250 inside the safe zone, the count numeral
  is 660 px (the source's 700–760 px), and each card carries one exhibit.
- **Kept apart from Halftone Collage** (halftone paper cut-outs on a flat colour field): this style is a printed case
  file: cream paper, HUD, stamps, slab headlines, caption pill and a suspect.
- Added to the catalog on 2026-10-31.
