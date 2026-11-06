---
name: style-painted-boil
description: Visual style "Painted Boil": a hand-painted 2D cartoon on warm paper; flat gouache washes inside ink outlines that boil (redrawn every 2 frames), watercolour skies and hills that bleed and pool at their edges, dry-brush strokes, additive glows, an invented pebble-shaped character (Pip) acting the idea with squash, bounce and painted reaction marks, a few hand-lettered marker words, and brush-stroke wipes. Use when a video is made in this style.
---

# Painted Boil

## 1. In one line

A warm, wordless-feeling cartoon painted on paper: a little character acts the idea, the linework shivers like hand
drawing, and light glows through watercolour. It suits character skits, emotional beats, children's explainers,
music-led shorts and mascot moments.

## 2. Palette

Soft, harmonious colours, no pure black or white. A small palette per video and one colour arc across it (cold night
→ warm dawn). The character always separates clearly from the background.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f3ebdc` | the sheet under everything; the world's "white" |
| ink | `#2b2233` | every outline and "black"; the lettering's drop copy and outline |
| text (cream) | `#fff5e2` | lettering fill, highlights, eye whites, the belly |
| accent (ochre) | `#e8aa38` | sunlight, emphasised lettering, the sun's shade |
| accent2 (sky) | `#8ec3e6` | the day sky, blue light |
| muted (indigo) | `#2f3c7a` | night and distance, deep blue light, blue lettering |
| faint (night) | `#1f2550` | night skies |
| rose · sap · teal · violet · gold | `#e27a92` `#6e9f58` `#3a9c98` `#7b5ca8` `#f0be46` | red light and hearts · grass and hills · Pip · violet light · yellow light and the sun |
| teal-dark | `#2a7470` | Pip's shade and feet *(proposed)* |
| glow / flash | `#ffc766` / `#fffdf6` | additive light / a full-frame flash |
| blush / mouth | `#e2476e` / `#4a1f2a` | cheeks / mouth interior |
| paper stains / fibres | `#a07d50` at ≤ 4.5% / `#6e583c` at 3.5–9.5% | the paper itself |

Mood tints mixed into the character at 55%: pale `#f6e6d2` (fear), flush `#e23e36` (anger), blue `#6d86be` (sadness),
rosy `#ef8ea8` (love), green `#98b25e` (disgust), gold `#f0be46` (pride).

## 3. Typography

- **Mostly no text.** Reactions are painted marks (!, ?, sparkles, hearts, sweat, zzz…). Words appear only when the
  word is the point: 1–5 words a beat, hand-lettered.
- **Lettering:** Permanent Marker (Google Fonts, Apache 2.0), filled in a colour (cream by default; ochre, indigo or
  sky for the emphasised word) with an ink outline of 0.12 × the size under the fill and an ink drop copy offset by
  (0.045, 0.055) × the size; tilted about −0.05 rad; each word pops in with backOut.
- **Sizes at 1080×1920:** titles 140–160 px, headline words 104–132 px, a number 300 px, small hand-written labels and
  captions 46–56 px. Smallest 36 px.
- **Sound words** (sfx) live 1.2 s, tilt −0.08 rad wobbling ±0.03·sin(20·age), fade over their last 0.25 s.

## 4. Layout

- **One focal action at a time** with a clear silhouette; depth from overlap, scale and colour (farther = smaller,
  bluer, paler), never from projection.
- **Character scale** in units u (Pip is about 9 u wide, 11 u tall): u 22–30 px for medium shots (normal acting),
  15 px inside panels, 40–70 px for close-ups. Never tiny for a whole video.
- **The ground:** a sap-green hill wash from y ≈ 1380–1460 down; sky washes above. Lettering sits in the upper third
  (y 250–720); the character stands on the hill.
- Safe zone 230 px top and 330 px bottom; margins 80 px. Each shot paints the full frame; paper may show through.

## 5. Elements

- **Watercolour fills** (skies, hills, panels, swatches): 67% opacity, multiplied like pigment, the edge bled by a
  seeded turbulence displacement (16 px), a textured body (alpha modulated by fine noise, texture 0.4) and a darker
  pooled rim (border 0.35, about 7 px wide). Yellow over blue turns green, so lights are added, not painted over.
- **Gouache washes** (characters, props): the exact colour, a slight edge wobble and fine texture, one shade crescent
  (fill with the shade, refill shifted toward the light with the base).
- **Ink:** every shape outlined in ink (6 px, finer 3.2 px), boiling: a turbulence displacement (frequency 0.035,
  ±3.2 px) reseeded every 2 frames, each element on its own seed key. "One shape, one outline": arms and tails are one
  tapered ribbon.
- **Dry brush:** streaky strokes for rays and splashes.
- **Light** is the one non-paint mark: an additive radial glow (stops 0 : 1, 0.18 : 0.8, 0.45 : 0.32, 0.75 : 0.08,
  1 : 0) tinted at 150/255, under the paper grain.
- **Pip** (invented for this style): a round, pebble-shaped teal creature with a cream belly, a curl on top, big cream
  eyes with ink pupils that lead the thought, pink blush, tapered ribbon arms, small feet. Poses: idle, wave, arms
  up, point, cheer; moods: happy, wonder, surprised.
- **Marks:** painted !, ?, sparkles, hearts that pop in and wobble.
- **Paper:** 70 soft radial stains (radius 120–500 px), 1,400 fibres (1 px, 6–32 px long); static grain multiplied
  over everything (about 55% of pixels darkened up to 34 levels, warm) and a warm vignette from 0.45 H to 1.05 H fading
  to `rgba(120,95,70,0.35)`.

## 6. Motion

- **Boil:** the drawing changes every 2 frames (12 a second at 24 fps, 15 at 30); still things hold their own seed so
  a moving thing doesn't make them re-boil differently.
- **Easing:** ease = smoothstep; easeIn x³; easeOut 1 − (1 − x)³; **backOut** with overshoot 1.9 (words, marks,
  props popping in, 0.4 s); elasticOut for springy settles. No plain linear moves.
- **settle:** `e^(−6·Δt)·sin(18·Δt)` kicks for follow-through after an event.
- **jump:** a 0.12 s crouch (squash 0.18), a parabola with stretch −0.16·|1 − 2k|, a landing squash
  0.22·e^(−8a)·cos(20a). **take** (surprise): a 0.1 s pre-squash, then a squash and lift that ring out.
- **Turns** step through drawn views over 0.12–0.25 s with a smear; never a 3D rotation.
- **Emotion changes:** eyes squint over the last 0.1 s and reopen over 0.14 s; pose blends with backOut over 0.4 s;
  colour crossfades over 0.3 s.
- **Beat:** 120 BPM by default; idles and bounces lock to `e^(−6·frac(beat))`.
- **Nothing is ever still:** idles breathe, linework boils, the camera drifts (x 20·sin(0.6 t) px, zoom 1 + 0.02 t).
- Principles: anticipation, squash and stretch, slow in and out, arcs, overlap, no twinning, strong key poses, eyes
  lead.

## 7. Transitions and rhythm

- **A transition at every seam**, into the first shot and out of the last.
- **Brush wipe:** five fat painted strokes tilted −0.1 rad cover the frame (first half, ease-out) and drag off
  (second half, ease), delays 0 / 0.14 / 0.06 / 0.18 / 0.10, alternating two colours with a watercolour body and dry
  brush; it runs over the last 0.3 s of one shot and the first 0.3 s of the next, cut under full cover.
- **Iris** (any shape) in 0.45 s, ease-in; flashes; whip pans with a smear; match cuts; cut on action.
- One read at a time: fast actions, held meanings (for example: a throw 0.15 s, flight 0.8 s, payoff 0.45 s,
  reaction 0.6 s).

## 8. Finish

- Paper grain and the warm vignette multiplied over the whole frame; glows added under the grain.
- No digital glow inside the paint, no film grain beyond the paper's.

## 9. 3D look

None: no 3D, no perspective boxes, no 3D rotations, no fake-depth maths.

## 10. Banned

- Lots of text; text that isn't hand-lettered.
- Plain vector shapes with still, even outlines ("2000s Flash"); gradients or digital glows inside the paint.
- 3D rotation or projection; pure black or pure white.
- Faces that snap between expressions; linear moves; every part moving at once; mirrored limbs or crowds.
- A tiny character for the whole video; a character standing still with nothing happening.
- Hard starts and ends; hard cuts everywhere; events stacked with no holds.
- Jittery re-boiling of still things; muddy green-grey glows (yellow painted over blue).
- Anthropic's mascot or any existing character; copying the source demo's story, sky, hills, star or shots.

## 11. Where it came from

- **ClaudeAnimationBase (JohnHeibel/ClaudeAnimationBase), MIT (© 2026 John Heibel)**: `ANIMATION_GUIDE.md`,
  `README.md`, `src/core.js`, `src/timeline.js`, `src/config.js` (values grepped by the research), based on the music
  video "I'm Upping My P(doom)". Read through the research notes `docs/research/styles/five-skills.md`, section
  "Painted Boil Cartoon (p5.brush)". The source paints with p5.js and p5.brush in headless Chrome; this engine has no
  p5, so the washes are approximated with seeded SVG turbulence, displacement and morphology, and the boil is a
  per-element turbulence displacement reseeded every 2 frames. The source's star character (Clawd) belongs to
  Anthropic and isn't used: Pip is invented.
- **Taken:** the palette (paper, ink, cream, night, indigo, rose, ochre, sap, teal, violet, sky, mood tints, glow,
  flash, blush, mouth), the no-text rule and its `letter()` escape hatch (Permanent Marker, drop copy offset
  (0.045, 0.055), outline 0.12), sound-word timing, character scale by units, one focal action, depth by overlap and
  colour, watercolour fill values (opacity 170, bleed, texture 0.4, border 0.35), flat washes, ink outlines, dry
  brush, one-shape-one-outline, the glow stops and alpha, the boil on twos with per-element seeds, the easing set
  (smoothstep, cubic, backOut 1.9, elasticOut), the settle spring (k 6, w 18), jump and take formulas, turns, emotion
  changes, the beat pulse, camera drift, the brush wipe and iris, timing for the viewer, the paper recipe (70 stains,
  1,400 fibres, grain, warm vignette), the banned list.
- **Proposed:** Pip's design and its teal-dark shade, the SVG approximation of p5.brush (filter numbers), the dry-brush
  filter, every px size, the 1–5-word lettering limit and the small caption size for the number sample, the sample
  scenes (a wondering title, a sun throwing every colour, a splashing molecule, paint swatches as the chart, three
  painted panels, a waving ending, the wipe).
- **Changed for vertical:** the source is 1920×1080 with no layout for vertical; here the ground sits low
  (y ≈ 1380–1460), lettering takes the upper third, the character stands lower-right or lower-left at u 22–30 px, and
  lists become three stacked painted panels.
- Added to the catalog on 2026-10-31.
