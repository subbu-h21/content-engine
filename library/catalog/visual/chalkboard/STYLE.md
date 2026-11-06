---
name: style-chalkboard
description: Visual style "Chalkboard": a clean classroom blackboard on which chalk writes itself in true stroke order, with no hand, stick or eraser in sight. Deep ink-green slate, grainy white chalk for all structure, one accent chalk for the one thing the lesson tracks, a pale yellow second hand for what people think, wiped in one damp pass and rewritten in the same place, and a soft dark subtitle plate. Use when a video is made in this style.
---

# Chalkboard

## 1. In one line

A quiet lesson on a clean blackboard: the chalk writes itself, stroke by stroke, while the voice explains; a wrong
idea is written, wiped in one damp pass and replaced by the truth in the same place. It suits one-idea lessons, word
and character origins, myth-busting, a worked problem and science facts.

## 2. Palette

Three chalks at most: white for structure, one accent for the tracked component, one pale second hand.

| Role | Hex | Where |
|---|---|---|
| background (slate) | `#0f1c15` | the deep ink-green board |
| backBoard | `#0b130f` | a darker back panel *(for sliding panels)* |
| text (white chalk) | `#f2f0e6` | all structure: words, lines, labels, arrows |
| accent (tracked chalk) | `#8fc3e8` | the one component the lesson tracks; here blue light, so a pale blue chalk *(proposed hex)* |
| accentDefault | `#ff8f42` | the source's orange accent chalk, for a tracked component with no colour of its own |
| accent2 (second hand) | `#fae694` | another person's handwriting: what people think |
| muted | `#d9d4c6` | subtitle text on the plate |
| faint | `#c4b070` | painted rule lines on the slate, at 24–36% *(hex from the source's rgba)* |
| plate | `#0a0f0c` | the subtitle plate at 62% |
| frame / tray / trayShadow | `#6a4a2e` / `#7a5838` / `#5d4128` | the wooden frame and chalk tray |
| wall / dado | `#bdb8a8` / `#56705f` | the classroom in wide shots |
| clock | `#f6f3ea` | the wall clock's face (hands `#222222`) |
| wet | `#000c07` | the damp cloth's streak, at 36%, drying back |

- **The accent is chosen per film** for the one tracked component and never decorates: no accent arrows, underlines
  or boxes that aren't that component. No rainbow, no gradient in chalk, no glow.

## 3. Typography

- **Board writing is drawn, not typeset:** the style's own single-stroke hand (`scenes/glyphs.ts`: a–z, the capitals,
  digits and common marks), written in ordinary stroke order. Straight strokes bow slightly, each glyph tilts up to
  ±1.5° and moves ±1.5% on the baseline, and horizontals rise about 2° to the right.
- **Sizes:** the big word 250 px, numbers 300 px, titles 120 px (smaller to fit the column), headlines 92 px, step
  lines 66 px, labels 62 px, small labels 50 px. The smallest writing is 32 px; chalk is 7.5% of the size wide, never
  under 4 px (small writing gets heavier chalk).
- **Speed:** a big character ~0.1 s a stroke (including the air between strokes), a title ~0.06 s, labels ~0.04 s;
  each stroke draws in the first 80% of its slot.
- **Emphasis:** the accent chalk on the one tracked component, an underline, a circle.
- **Subtitle plate:** Alegreya italic 40 px, `#d9d4c6`, centred on a soft dark rounded plate (`#0a0f0c` at 62%,
  radius 10) just above the bottom safe line; two lines at most; it fades in and out over 0.12 s (the only thing
  that fades). Nothing to read on the board sits behind it.
- **Words on the board:** keywords only, few words, large letters; the explanation is spoken.

## 4. Layout

- **The camera faces the board flat on,** never tilted.
- **Margins** 96 px; must-read writing between x = 96 and 960. **Safe zone:** 230 px top, 330 px bottom; the plate
  sits at y ≈ 1478.
- **Close shots:** the subject fills at least a third of the frame; a block is never cut by the frame edge while it is
  read; never an empty board for more than 0.5 s.
- **A board convention:** a small line at the top right, like the date (here the kicker).
- **At least once** the frame opens wide enough to read board, frame, tray and wall as a classroom (here the end).
- **Left-aligned;** the end card is centred.

## 5. Elements

- **Chalk strokes** (writing, lines, arrows, circles, waves, dashes, ticks): round ends, a roughened edge, only the
  slate's grains that take chalk keep it, a faint powder halo, and 3 loose grains at each lift-off.
- **Chalk as a measuring tool:** an accent arrow laid along a line and ticked off by a white unit (here the red length
  ticked five and nine-tenths times along the blue).
- **The wipe:** one damp pass of a cloth along one smooth path, 170 px wide, leaving a thin even haze (8%) and a soft
  wet streak that dries back.
- **The classroom** (wide shots): a wooden frame and tray with chalk sticks (two white, one accent stub), the warm wall,
  the green dado and its rail, a wall clock.
- **Painted rule lines** dull and thin (24–36%) so chalk always wins.
- **No hand, chalk stick or eraser** on screen while writing; no ghost lessons or dust.

## 6. Motion

- **Things appear only by being written,** wiped, revealed by a sliding panel, or by drying. Nothing fades in on the
  board.
- **stroke:** each stroke is revealed along its length with a round leading end, sine-in-out over its slot × 0.8.
- **wipe:** cubic-in-out over 0.55 s along its path; one wipe per film is plenty. **dry:** the wet streak fades and
  narrows to 55% over 2.6 s (quart-out).
- **Camera:** cubic in-out (~1.2 s), never bouncing except a whip's landing; a whip with motion blur ≤ 0.5 s. Moves:
  close on the writing, a slow lateral pan along a line, a pull back to a fixed medium frame (claim against
  counter-claim), the same frame later (the verdict), a locked frame while a panel slides (a new chapter), a whip to
  another part of the wall, a cut on a line crossing a seam, the wide shot (summary).
- **Voice gaps** 0.25–0.4 s; one longer hold (~1.5 s) before the verdict; the board works under the voice.

## 7. Transitions and rhythm

- **Changes:** hard cuts, a sliding panel, or a line crossing a seam. No dissolves, no page flips.
- **Shots** of 1–7 s; a quiet pulse (the source: two notes a second); a sound marks each finished word.
- **Write what people think, wipe it, rewrite the truth in the same place** (the headline sample).

## 8. Finish

- **Slate:** even colour with a fine grain (soft-light, 15%) and a very slow mottle (soft-light, 24%).
- **Lens vignette** 0.42; a faint warm window patch (`#ffe1b4` up to 16%, screen) at the lower left; film grain 0.015.
- No glow under the chalk, no bloom.

## 9. 3D look

None.

## 10. Banned

- A dirty board (old swirls, ghost lessons, floating dust, bokeh).
- A hand, chalk stick or eraser on screen while writing.
- Anything typeset or faded in on the board (it isn't a slide).
- Glow; equal-width plotter lines.
- The accent on arrows or decoration that isn't the tracked component; rainbow or gradient chalk; more than three
  chalks.
- A perspective tilt; dissolves or page flips; a hard-edged wet streak.
- "Board-speak" in the voice (name what each thing means).
- A glossy board, markers, magnets or ghost marks (that's Whiteboard).

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 73 "Chalkboard" (`styles/chalkboard/STYLE.md`, `DEMO.md`,
  and the demo's `chalk.js`, `stage.js`, `app.js`, `post.js` as summarised in the research), researched in
  `docs/research/styles/five-skills.md`, section "Chalkboard". Its demo films and stills are CC BY 4.0; none were
  used.
  - Taken: the slate, back board, chalk, second-hand, wood, tray, wall, dado, clock, plate, rule-line and wet-streak
    colours (chalk hexes converted from the engine's floats); three chalks with their jobs; true stroke order; chalk
    speeds (0.1 s a stroke for big characters, ~0.04 s for labels); the stroke build (grains that take chalk, a faint
    powder halo, loose grains at lift-off, bowed straights, horizontals rising 2–3°); the wipe (one blurred pass, a
    thin even haze, a wet streak that dries back); chalk as a measuring tool; the subtitle plate (dark, 62%, radius
    10, 0.12 s fades); flat-on camera, its moves and cubic easing; no fades on the board; the lens vignette 0.42;
    grain; the bans.
  - **Rebuilt for Remotion:** the canvas chalk engine becomes SVG strokes revealed by dash offset, with an
    feDisplacementMap edge and an feTurbulence threshold for the grain; the wipe is an SVG mask; the slate is
    feTurbulence in soft-light.
  - **The hand:** the source writes Chinese from hand-authored stroke data and Latin with a single-line EMS font that
    isn't on Google Fonts. Here a small single-stroke Latin alphabet was drawn for the style (`scenes/glyphs.ts`), so
    the board is still written in stroke order.
  - **The plate's face:** the source uses a plain kai face; Alegreya italic (Google Fonts) stands in for Latin.
  - **Changed for vertical:** the source is 1920×1080 over a 6400×1700 slate with sliding panels; here each sample is
    one flat-on 1080×1920 region, words stacked in a narrower column (titles 92–120 px rather than 300–450 px
    characters), and the wide shot stacks wall, clock, board, tray and dado top to bottom.
- *(Proposed):* the pale blue accent chalk (the source's accent is orange; this lesson tracks blue light), the type
  sizes, the 80% draw share, the wipe width and 8% haze, the curves, the clock time (8:55), the slate texture amounts,
  and the sample lessons (the date-corner kicker, "Reflected sea?" wiped and replaced by the truth, the red length
  ticked off along the blue, a three-step chain, the classroom at the end).
- Added to the catalog on 2026-11-01.
