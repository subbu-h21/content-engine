---
name: style-divine-void
description: Visual style "Divine Void": a deliberate void look. Near-black space pierced by one warm gold light (a shaft, an ember bloom), rising dust and embers, a weightless slow push, Cinzel Roman-capital captions with one or two words in gold; bright bone-white frames carry crystalline bokeh instead of gold; hard cuts on the beat, one divine flash on a hit, a slow fade to black at the end. Use when a video is made in this style.
---

# Divine Void

## 1. In one line

Awe in the dark: one holy light in an endless black, dust rising through it, words that surface out of a veil. It
suits music and lyric videos, visualisers, mood reels and fancams, and "look how vast this is" facts, intros and
outros.

**This is a deliberate void look.** The visual taste rules treat "a black void with small things floating in it",
glow, bloom, flares and floating particles as tells of a generated look. This style uses exactly those, on purpose
and only its own way: one light per frame, particles that rise (never drift aimlessly), a bloom that is the light
source itself, hard cuts on the beat, and bright frames to break the dark.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (void) | `#05060a` | the ground of every dark frame; the type colour in bright frames |
| text (bone white) | `#f4f1ea` | captions in dark frames; the ground of bright frames |
| muted | `#a39e94` | small captions *(proposed)* |
| faint | `#2b2a2e` | dim strokes *(proposed)* |
| accent (molten gold) | `#ffb24d` | the one warm light of a dark frame; one or two caption words |
| accent2 (ember) | `#ff7a18` | where the gold ramps to at the edge of a light; hot embers |
| bloomCore | `#ffffff` | the core of a bloom and of the divine flash |
| violet / cyan / magenta | `#8a6bff` / `#4fc3ff` / `#ff6ad5` | crystalline bokeh, **bright frames only**, one of them per shot |
| danger | `#ff2a2a` | one glowing red on a monochrome frame, for 1–2 shock cuts in a whole video |

- **Most frames are one or the other:** dark (void + one gold light) or bright (bone white + iridescence, or bone +
  gold for a "winged ascension" frame).
- **One accent per shot.** Gold lives in dark frames, iridescence in bright frames, never both in one shot. Red once
  or twice per video.
- **Protect the blacks:** the void stays near-black; the light is local.

## 3. Typography

- **Captions:** Cinzel 500 (600 for a hero word) *(proposed: Roman inscriptional capitals; the source names no
  face)*, ALL CAPS (the source's rule), tracking 0.08 em, leading 1.12, centred.
  - Sizes *(proposed)*: captions 84 px (lower to fit the 860 px column), a hero word 150 px, titles up to 104 px,
    numbers 260 px.
- **Emphasis:** one or two words in gold, timed to the vocal (dark frames). In bright frames, captions are void-black
  and there is no coloured word.
- **Small captions:** Jost 400, 30 px, caps, tracking 0.32 em, muted *(proposed)*.
- **Smallest text:** 28 px. **Words:** only in lyric or talking sections, about 8 words on screen at most; a pure
  visualiser has no text at all.

## 4. Layout

- **Margins:** 110 px (860 px column). **Safe zone:** 230 px top, 330 px bottom.
- **The signature frame:** one sharp hero (a core of light, a pearl, a key, an eye, a petal) centred in black
  negative space, around y = 760; captions below it around y = 1220, centred.
- **Light enters from above** (a shaft from beyond the top edge, angled up to 15° off vertical) or rises from below
  (a bloom under clouds).
- **9:16 only;** landscape sources are centre-cropped, never letterboxed. No mixed aspect ratios.
- **How full:** one light, one hero, one caption. The rest is void, deliberately.

## 5. Elements

- **Gold shaft:** a soft wedge from a source above the frame to the hero, 90 → 420 px wide, blurred 26 px, white at
  its origin → gold → ember → clear, screen blend at 55%. A god-ray fan is 2–3 narrower shafts (40 → 260 px, 32%)
  from one source.
- **Ember bloom:** a radial white → gold (14%) → gold 28% (36%) → ember 10% (60%) → clear, screen blend.
- **Core:** a small white disc with gold glows (r and 3r).
- **Dust, embers, glitter:** 46 seeded motes, 1.4–4.2 px with a faint halo, bone or gold, rising 90–260 px over 6 s,
  twinkling.
- **Halo:** a thin gold ellipse (2 px at 70%, 18 px glow), above a hero or around a number.
- **Clouds:** soft bone blobs blurred 40 px at 8–26%, some lit gold from the light beneath.
- **Crystalline bokeh** (bright frames): soft discs 24–140 px in one iridescent colour, blurred 2–18 px, 25–70%.
- **Divine flash:** a full-frame radial white → gold, screen blend, opacity 0 → 1 → 0 at frames 0 / 3 / 12 (30 fps),
  one beat long, on a transient.
- **Footage and 3D** (optional): filmed or generated b-roll cut on the beats (winged figures, clouds, macro objects),
  or a Blender hero on black (section 9). The previews draw the light, dust and clouds procedurally.

## 6. Motion

- **The world floats:** the camera pushes in 4% and floats up 24 px over a shot, sine in-out `[0.37, 0, 0.63, 1]`
  *(proposed; the source: "slow, floating, weightless")*. Clouds sway; dust rises. Everything breathes **except the
  type**, which lands and holds still.
- **veil** (captions): each word comes out of a 14 px blur, rising 16 px, `[0.22, 1, 0.36, 1]` over 1.6 s, 0.14 s
  apart *(proposed)*.
- **shaft:** the light fades in and widens over 2.0 s `[0.25, 0.1, 0.25, 1]`; **bloom:** grows from 40% over 2.4 s
  `[0.22, 1, 0.36, 1]` *(proposed)*.
- **rise:** particles move up at constant speed (upward = ascension).
- **Divine flash:** frames 0 → 3 → 12 at 30 fps.
- **Speed:** bursts of speed only at the drop; a speed ramp from slow to fast across the last bar before it, then a
  hard cut to tempo on the one.
- **Outro:** a slow fade to black over 2 s.

## 7. Transitions and rhythm

- **Every hard cut lands on a beat or transient.** No dissolves or crossfades in verse or drop.
- **Beat maths:** frame of beat n = round(n × 60 / BPM × fps). At the source's 138 BPM: a beat is 0.435 s (13.04
  frames at 30 fps), a bar 1.739 s, an 8-bar phrase 13.9 s.
- **Section plan:** intro = one slow push, no cuts; verse = a hard cut every 2 beats (a macro montage of hero-on-black
  inserts held 1–2 beats each); drop = speed-ramp in, cut on the one, fast; bridge = one long held shot plus one
  colour-pop (a monochrome passage, then one coloured element punching in on the downbeat); drop 2 = divine flashes on
  transients, light leaks up; outro = slow fade to black.
- **Never hold a shot past its musical phrase.**

## 8. Finish

- Dark frames: high contrast, deep blacks, grain 0.05, vignette 0.5, a subtle chromatic split on type (±1.6 px, red
  and cyan at 35%), bloom and glow on the light.
- Bright frames: clean gloss, no grain, no vignette.
- Bloom, glitter, flares and light leaks are "heavenly, not dirty": always from the one light.

## 9. 3D look

Optional (`needs.3d: false`). The "macro hero" frame in Blender: one object (a brass key, an eye, gears, a petal, a
water drop) on pure black, razor-sharp, lit by a single rim light (warm gold, from behind and above), no fill, black
world; the cold outro: a pale crystalline ice structure dissolving into black, cold blue and bone white. Bloom is
added when the plates are encoded *(proposed values; the source names the frames, not the settings)*.

## 10. Banned

- More than one accent per shot; gold and iridescence together.
- Red more than once or twice in a video.
- Crossfades or dissolves in tempo sections; a shot held past its phrase.
- Grey, lifted blacks.
- Type that keeps moving after it lands.
- Readable UI chrome, status bars or captions from references; mixed aspect ratios.
- Busy frames: more than one light or one hero.
- Lowercase captions; a second display face.

## 11. Where it came from

- **ECC's taste skill** (`ECC/skills/taste/SKILL.md`: "The Mood System", "Editing Grammar", "Beat Math", the shot plan
  and prompt presets), researched in `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Divine Void
  (angelcore x cloud-trance, hyperpop accent)". Licence: MIT. Read 2026-10-31.
  - Taken: the whole palette and its rules (one accent per shot, gold in dark frames, iridescence in bright frames,
    red once); all-caps captions with one or two accent words; the hero-on-black signature frame; the elements (ember
    bloom, gold shaft and god-rays, rising dust and glitter, crystalline bokeh, halos, clouds, wings, flares, light
    leaks); the bloom overlay (#fff → #ffb24d, screen); the divine flash (0 → 1 → 0 at frames 0 / 3 / 12); weightless
    drift, bursts only at the drop, the speed ramp; the beat maths, cutting rules and section plan; high contrast,
    deep blacks, grain and aberration on dark frames, clean gloss on bright ones; the macro-hero and cold-outro
    frames; the bans.
  - The source is built for footage (generated or filmed b-roll cut on beats). Here the light, dust, clouds and
    bokeh are drawn procedurally, so the style works with no footage; footage remains optional.
  - The hyperpop "candy-cyber portrait" frames (candy pink, chrome, blue sky) aren't part of this style: they need a
    subject on footage and have no hex values.
- **Changed for vertical:** the source is already 9:16.
- *(Proposed):* the type (Cinzel and Jost, all sizes and tracking), the muted and faint colours, every motion value
  except the flash (veil, shaft, bloom, drift and push), the element sizes and opacities, the grain (0.05), vignette
  (0.5) and aberration (1.6 px) amounts, the 3D settings, and the sample scenes (a gold shaft onto a molten core, a
  god-ray fan, a bright pearl in cyan bokeh, a number over an ember sunrise, three lines on a thread of light, the
  cloud outro).
- Added to the catalog on 2026-10-31.
