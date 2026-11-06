---
name: style-ink-wash
description: Visual style "Ink Wash": xieyi ink painting on rice paper, animated. Mostly empty paper, ink only in five tones (burnt, thick, heavy, light, clear), loaded brushstrokes whose bristles break into flying white, mountains dissolving downward into mist, Cormorant SC titles in vertical columns, italic inscriptions that go on wet and dry, and one small vermilion seal. Use when a video is made in this style.
---

# Ink Wash

## 1. In one line

An ink painting that paints itself: most of the frame is empty rice paper, one brush lays down a mountain, a pine, a
decisive stroke, and words sit quietly in the empty space like a painter's inscription. It suits contemplative
stories, origin and journey stories, history told as a scroll, one-decisive-moment films, films built on one line,
and East Asian topics. It is not watercolour: there is no colour at all.

## 2. Palette

Ink only, plus one vermilion.

| Role | Hex | Where |
|---|---|---|
| background (rice paper) | `#f2ecde` | 60–80% of every frame; also sky, water and mist |
| text (ink, full density) | `#13110f` | every stroke and word, at one of the five tones below |
| muted (ink, lowest density) | `#858c94` | the cool far end of the ink ramp (a density, not a second paint) |
| faint | `#e2d9c6` | paper fibres and pulp flecks *(proposed)* |
| accent (vermilion) | `#b02e22` | the seal; the small square that marks an inscription line; at most one tiny story accent |

**The five tones** (墨分五色, opacity of the one ink, multiplied onto the paper):

| Tone | Opacity | For |
|---|---|---|
| burnt | 0.96 | calligraphy, the sharpest lines, moss dots, pine needles, numerals |
| thick | 0.82 | contours, the dark edge of loaded strokes, words |
| heavy | 0.60 | secondary lines, folds, near rocks |
| light | 0.34 | mountain bodies, washes, bodies, scattered light |
| clear | 0.16 | far mountains, mist, faces |

- **Far = pale and soft, near = dark and textured.** If a frame is busy, remove ink rather than add tone.
- **Never a red wash or red type.** Blue is never painted: the sky is the empty paper.

## 3. Typography

- **Titles:** Cormorant SC 600, 84 px, tracking 0.16 em, written in vertical columns in the painting's empty space
  (letters turned 90°, read top to bottom; a second column steps down and to the left), with the seal under them.
- **Inscriptions** (subtitles, labels, headlines): Cormorant Garamond italic 500, ink at the thick tone, 50–66 px,
  tracking 1 px, no box, at most two lines, placed in each shot's empty paper; a small vermilion square may mark
  the start of a line. They go on wet (soft, darker) and dry sharp in 0.35 s.
- **The end card:** Cormorant SC 600 with 14 px tracking.
- **Numbers** are painted as brushstrokes (hidden-tip entry, tapered exit, flying white), not typeset.
- **The smallest text** is 32 px. **Emphasis:** placement in empty paper, and the seal. **Words:** few (about 8).

## 4. Layout

- **60–80% empty paper** (留白). The empty paper is the subject as often as the ink is.
- **The vertical frame is a hanging scroll:** depth runs top to bottom (sky, far range, mid range, near rock); dark
  foreground may sit along the frame bottom and run off it.
- **Margins** 96 px; must-read words between x = 96 and 960. **Safe zone:** 230 px top, 330 px bottom for words;
  painting runs to the edges.
- **Figures are small** in the landscape (100–150 px tall) with lead room in the direction they look.
- **Columns** stand at one side of the frame (right in the title, left at the end), clear of the painting.

## 5. Elements

- **The loaded brush:** a centreline × a pressure profile × width noise (±12%). Profiles: `brush` (hidden-tip entry,
  full belly, long taper), `tip` (heavy start), `nail`, `even`, `rise`, `lens`. A body whose ink fades as the brush
  dries ((1 − dry)^1.6) and 6–60 bristles, darker on the loaded side, so the stroke carries its own contour (boneless
  painting, no outlines). Bristle ink varies in long streaks and breaks on long-scale noise (170 px) into flying
  white, first at the edges and towards the end. A faint bled halo under wet strokes. Dry 0.3 = textured, 0.6+ =
  flying white.
- **Masses** (mountains, rocks, molecules, bodies): soft shapes with ragged, bled edges and pigment pooled at the rim,
  fading downward into mist; mountains carry a darker band of ink along the ridge.
- **Landscape:** far ranges clear and untextured; near ranges light to heavy with hemp-fibre strokes down the slopes
  and burnt moss dots on the ridge; rocks with a loaded contour, axe-cut strokes and dots; a pine with one crooked
  trunk, tip branches and fans of burnt needles over pale washes.
- **Water is blank paper:** a few dry streaks and open ink rings (one stroke of 1.86π with a gap).
- **Figures:** xieyi, a pale body mass, two loaded strokes, a burnt-ink conical hat; no faces.
- **The seal:** a slightly irregular vermilion square with a character knocked out in white lines (here 天, "sky")
  and ink-paste speckles.
- **No Western outlines, no flat fills, no vector shapes.**

## 6. Motion

- **Painted into existence in stroke order;** nothing is tweened like a vector shape. Things are painted, bloom, or
  dissolve into mist.
- **On twos:** strokes, figures and the boil step every 2 frames; the boil is on width noise only, a 5-drawing cycle
  (±4%), so flying-white gaps never crawl.
- **paint** (most strokes): cubic in-out, about 1200 px a second (0.25–1.1 s).
- **decisive** (the one stroke that matters): quart-in over 0.14 s, about 4 frames, after a stillness.
- **mass** (washes): sine in-out over 1.2 s. **inscribe:** cubic-out over 0.35 s, wet to dry. **seal:** scale
  1.35 → 1 in 0.18 s.
- **Stillness before action:** hold, with at most a slow push-in (5%), then the decisive stroke; consequences only
  after it lands.
- **Holds:** 1.2 s once a painting is complete.

## 7. Transitions and rhythm

- **Transitions:** an ink bloom (the next scene grows inside a spreading drop with a dark tide line), a pan along the
  scroll (right to left, or a vertical tilt down the hanging scroll), or mist. Never a generic dissolve or wipe. The
  one hard cut is to an extreme close-up.
- **Camera:** a locked frame on the paper, the handscroll pan, the vertical tilt, lateral tracking with lead room,
  a high wide with a tiny figure, a low angle under a dark mass, a push into a bloom or mist, a pull back until a
  mark joins the whole.
- **Rhythm:** cued to the picture, never looped; slow (60 BPM) for landscape; a held silence before the decisive
  stroke.

## 8. Finish

- **Rice paper,** never a texture file: cloud mottling (soft-light, ±7%), short fibres, sparse pulp flecks.
- **Ink multiplied** onto the paper; wet masses bleed (displacement 10 px, blur 2.2 px) with pigment pooled at the
  rim (small blur − large blur); strokes get a fine ragged edge (displacement 3.2 px).
- **Vignette** 0.22. **No grain** (the paper is the grain). No glow, no bloom.

## 9. 3D look

None.

## 10. Banned

- Watercolour: colour washes, any hue but ink and the one vermilion.
- Vector art with a brush texture: flat fills, closed outlines, Western contour lines.
- A red wash or red type; a calligraphy title sequence as the whole film.
- Generic dissolves or wipes.
- Parallel semi-transparent strokes for bodies ("organ pipes"); uniform hatching ("wire mesh"); dry brush that looks
  like dashed lines; clipping calligraphy with a font's outline.
- A busy frame (remove ink instead).
- Copying a specific painting, film composition, character or piece of calligraphy, or naming them.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 03 "Chinese Ink Wash (Xieyi)" (`styles/ink-wash/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "Chinese Ink Wash (Xieyi)". Its demo
  films and stills are CC BY 4.0; none were used.
  - Taken: the paper, ink-ramp and vermilion values (the ink hexes converted from the source's RGB fractions); the
    five tones and their jobs; ink-only and one-vermilion; 60–80% empty paper; the brush model (centreline ×
    pressure × width noise, 4–60 bristles losing load, flying white from long-scale noise, dryness, the (1 − dry)^1.6
    body, loaded strokes carrying their own contour); masses with jittered edges dissolving into mist; landscape
    recipes (far ranges pale and untextured, hemp-fibre texture and moss dots on near ranges, the pine, rocks, water
    as blank paper with open rings of 1.86π); xieyi figures; the seal; inscriptions in Cormorant Garamond italic going
    on wet to dry in ~0.35 s with a small vermilion square; titles in vertical columns in Cormorant SC 600 with a
    seal; stepping on twos with a small width boil; the decisive stroke in ~4 frames after a stillness; ink-bloom and
    mist transitions, the scroll pans, the camera vocabulary; the paper finish and vignette ~0.22, no grain; the bans.
  - **Rebuilt for Remotion:** the brush engine and WebGL compositor become SVG: ribbons and bristle polylines from
    seeded noise, masses with feDisplacementMap and a two-blur rim, a fine displacement for ragged stroke edges, the
    paper from feTurbulence.
  - **Changed for vertical:** the source is 1920×1080 (a handscroll, a figure 150–180 px tall in a huge river); here
    the 1080×1920 frame is treated as a hanging scroll (depth stacked top to bottom, the vertical tilt as the main
    camera move), inscriptions are bigger (50–66 px instead of 46 px), titles larger (84 px), and there is one
    painting per frame.
- *(Proposed):* the faint hex; the seal's character (天, "sky", chosen for this topic); the profile shapes, the 170 px
  gap length, the stroke speed and curves; the type sizes; the sample paintings (a hanging-scroll landscape under an
  empty sky, an ensō sun over the five tones of one ink, the scattering as pale strokes round two washes, painted
  numerals with two strokes in the true 5.9 : 1 ratio, three small scenes, a figure by a river of blank paper).
- Added to the catalog on 2026-11-01.
