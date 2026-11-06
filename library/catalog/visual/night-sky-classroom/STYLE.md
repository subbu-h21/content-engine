---
name: style-night-sky-classroom
description: Visual style "Night-sky Classroom": friendly kids' science on a night-blue ground, round Fredoka headlines with heavier-weight emphasis, glowing colourful light diagrams (sun, beams, waves, molecules, sparks), quiet Inter pills, and a ground that turns into the day sky at the payoff. Use when a video is made in this style.
---

# Night-sky Classroom

## 1. In one line

A kind teacher pointing at the sky with you: calm night-blue ground, glowing coloured light, round friendly type,
one idea at a time. It suits science explainers for children (about 8 to 11) and anything about light, colour, sky,
weather or nature that should feel warm and clear, readable from the back of a classroom.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (night) | `#0b1026` | the ground of every frame; pill fills are this colour at 66% |
| surface (ground glow) | `#18224a` | a soft radial lift behind the main object: ellipse 90% × 60% at 50% / 58%, fading to night by 75% |
| text | `#f4ecdc` | every headline and label (the only text colour); also the air molecules |
| muted | `#8a90a8` | eyebrows, chapter markers, pill borders (55%), dashed guides |
| faint | `#3a4166` | inactive tracks and guides |
| accent | `#ff7a45` | warm diagram light (sunset, heat); never type |
| accent2 (blue light) | `#4aa8ff` | short blue waves, scatter sparks, the blue bar; never type |
| sun | `#ffe9a8` | the sun disc and its glow; the beam's glow |
| beam | `#fffaf0` | the white core of the sunlight beam |
| red · orange · yellow · green · blue · violet | `#ff5a4e` `#ff9a3c` `#ffd84a` `#5fd68a` `#4aa8ff` `#a77bff` | the spectrum: the prism fan, the rainbow wave, colour dots on pills; red also the long red wave |
| pale blue | `#d9eeff` | blue sparks and rays over the day sky, where plain blue would vanish |
| hill | `#1b4d3e` | the hill in day and sunset frames |
| figure | `#0d1430` | the child silhouette |

**Grounds** (the ground itself is a colour that changes):
- **Night** (default): night ink + the surface glow.
- **Day sky** (the payoff): a vertical gradient `#1c4fbf` 0% → `#3f8cf2` 45% → `#8cc4ff` 80% → `#cfe9ff` 100%,
  laid over the night by opacity.
- **Sunset**: `#2a1b5e` 0% → `#7a3f8f` 38% → `#e0645a` 72% → `#ffb465` 100%.

Spectrum colours are for light and diagrams only, never for text.

## 3. Typography

- **Headlines:** Fredoka (Google Fonts), weight 500. Round and friendly.
  - **Emphasis:** the key word is set heavier, Fredoka 700, in the same colour. Fredoka has no italic.
  - Sizes: headlines 112 px, titles 124 px *(proposed, inside the source's 110–130 px range)*. Lower the size so the
    longest line fits the 888 px column (Fredoka averages about 0.47 em per character); never below 84 px
    *(proposed)*.
  - 3 to 5 words per headline, 6 at most, and at most 2 lines. Leading 1.1. Sentence case.
- **Labels:** Inter 500 at 38 px (Inter 18pt when installed), on pills.
- **Eyebrows:** Inter 400 at 24 px, tracking 1.5 px, muted colour: chapter marker `01  —  Title`.
- **Body copy:** rare (the narrator carries the words). When needed: Inter 500 at 34 px, muted, centred, line height
  1.35 *(proposed)*.
- **Numbers:** Fredoka 700 at 280 px *(proposed)*; the unit in Fredoka 500.
- **List rows:** Fredoka 500 at 72 px, left-aligned beside their picture *(proposed)*.
- The smallest text is 24 px.

## 4. Layout

- **Margins:** 96 px each side (888 px column).
- **Safe zone:** 230 px at the top, 330 px at the bottom.
- **Bands:**
  - headlines are **centred in the top band**, first line at y ≈ 500;
  - the diagram lives in the middle band, y ≈ 760–1520;
  - the chapter eyebrow sits at the top-left at the safe line (x 96, y 230).
- **Type stays in the dark band**, never over the bright sun or a busy diagram.
- **One idea on screen at a time**, lots of empty night around it.
- The sun sits low-left (x 150) when it feeds a beam or a wave, upper-right (850, 830–860) over the day sky.

## 5. Elements

All flat 2D: simple shapes and soft glows, no textures.

- **Sun:** a solid disc (r 62–70 px) with a radial glow: 45% at 1.25 r, 12% at 2.2 r, gone by 4 r.
- **Sunlight beam:** a 26 px white core (`beam`) over a 70 px sun-coloured glow at 25%, round caps. "Every colour": the
  beam reaches a split point and fans out into six coloured stripes (prism fan), 88 px apart at the far end, each
  52 px wide, with a 10 px blur copy at 30% under it.
- **Waves:** smooth sine lines with round caps and a glow (a pass 3.2× wider at 22% under the crisp line). They always
  travel.
  - Red: wavelength 420 px, amplitude 90, 11 px, 0.45 wavelengths/s (long and lazy).
  - Blue: 110 px, amplitude 52, 9 px, 1.6/s (short and choppy).
  - Rainbow: 260 px, amplitude 70, 9 px, 0.6/s, stroked with a left-to-right spectrum gradient.
  - The wave hitting a molecule: 80 px, amplitude 34, 8 px, 2/s.
- **Molecules:** soft cream dots, r 7–11 px (16 for the one being hit), each with a 2.2× halo at 12%, 90% opaque,
  wobbling 4 px. Placed by a deterministic scatter; a lane is kept clear for the wave.
- **Scatter sparks:** a burst is 8 round-capped sparks (6 px, 26 px long) flying from 16 to 150 px out, plus a thin
  ring (10 → 40 px, 3 px, 40%), all fading over 1 s. A hit fires a burst every 0.55 s; nearby molecules sparkle at
  their own phase every 1.3–1.6 s.
- **Rays:** dashed lines (4 px, dash 4/14, 55%) from the sky to the eyes, each carrying a 9 px dot of light at 0.7
  lengths/s.
- **Hill and child:** a green hill curve along the bottom (y 1580 left, crest 1420, 1540 right) with a small flat
  child silhouette at x 700 pointing up. Used on day and sunset grounds.
- **Eye:** a simple almond outline (text colour, 6 px) with a blue iris, for "reaches your eyes".
- **Pills:** fully rounded, ink fill at 66%, a 2 px border in muted at 55%, padding 12 × 26 px, Inter 500 38 px.
  An optional 18 px colour dot with a 12 px glow ties the pill to a diagram colour. Pills sit next to what they name
  (no leader lines).
- **Comparison bars** *(proposed)*: 24 px fully rounded bars with a glow 1.8× their height at 22%, on a track of text
  colour at 10%.
- **Icons:** none from stock; only the drawn sun, molecule, spark, eye, hill and child.

## 6. Motion

- **rise** (headlines): each word fades in and rises 20 px, expo-out over 0.55 s, 0.09 s between words, timed to the
  narration.
- **eyebrow:** fades in sliding 10 px from the left, expo-out 0.5 s; **rule:** a 140 px line at 22% draws in,
  expo-out 0.9 s.
- **pill:** fades in rising 12 px, expo-out 0.5 s; colour pills follow the words one by one.
- **beam:** draws across, expo-out 0.9 s; **fan:** the stripes open, expo-out 1.1 s.
- **draw** (waves): a wave draws in across the frame, expo-out 1.4 s, then keeps travelling.
- **travel:** a wave front reaches its molecule, expo-out 0.9 s; the first burst fires at 60% of it.
- **pop** (molecules): each pops in (expo-out 0.5 s), one after another over 1.2 s.
- **ray:** draws in, expo-out 0.8 s, then the dot of light keeps running along it.
- **ground** (the aha): night → day sky (or day → sunset) as a smoothstep over 1.4 s.
- **count** *(proposed)*: numbers count up, expo-out 1.4 s, bars filling with them.
- **out:** type leaves with a quick fade, expo-out 0.35 s.
- **Holds:** each headline stays at least 1.5 s after its line ends.
- Nothing snaps and nothing is ever frozen: waves travel, molecules wobble, sparks keep going.

## 7. Transitions and rhythm

- **Scene changes:** soft cross-fades of about 0.4 s (smoothstep), or one object turning into the next (the beam
  becomes the waves, the waves fly into the molecules).
- **The ground change is the big beat:** night → day sky at the payoff ("blue fills the whole sky"), then sunset
  colours for the bonus, and back to night for the ending.
- **One clear beat per sentence:** something new appears on every narration line.
- Scenes run 6–17 s, with a new headline every 2–6 s (one per narration line); the source video is 82 s in 7 scenes.

## 8. Finish

- Grain 0.02 (overlay, very light).
- Vignette 0.3.
- **Glow: yes, on light only:** sun gradient, beam and wave under-strokes, 10 px blur under the fan, pill-dot glows.
  Never on type.
- An ink halo behind type at strength 0.8 (four soft ink shadows at 2, 6, 14 and 28 px), so headlines read over the
  day sky.

## 9. 3D look

None. The whole style is flat 2D.

## 10. Banned

- A second text colour, or colour on type: spectrum colours are for light only.
- Italics: emphasis is the heavier weight.
- More than about 5 words per headline, or more than 2 lines.
- Type over the bright sun or a busy diagram.
- Textures, photos, 3D renders or realistic shading.
- Jargon and formulas on screen (no equations, no "Rayleigh").
- Snapping, bouncing or linear moves on type; frozen frames.
- Harsh flashes, strobing, fast cuts.
- Emoji, stock icons, mascots or brand characters.

## 11. Where it came from

- **The user's own video** `project-5-why-the-sky-is-blue` (style.md "Night-sky classroom", brief, plan, the scene
  code in `src/scenes/` and `src/components/`, and the check frames in `out/check/` and `brief/frames/`). Licence:
  the user's own. Values are taken from the code (theme, `sky.tsx`, `Headline.tsx`, `Text.tsx`, the Reel's props:
  type scale 1, leading 1.1, stagger 0.09, word 0.55 s, rise 20, halo 0.8; grain 0.02, vignette 0.3) and the
  colours were checked by sampling the frames.
- **Where the code and the source's style.md differ, the code wins:** the day sky is the four-stop gradient above
  (style.md listed `#4f9dff` → `#bfe3ff`), and type moves on expo-out, not ease-in-out.
- *(Proposed)*: the title size, the number, list and body sizes, the 84 px floor, the count move, the comparison bars,
  and the list layout. The source video had no number, list or end card of this kind.
- The source was already vertical (1080×1920), so nothing was re-laid out.
- Added to the catalog on 2026-10-31.
