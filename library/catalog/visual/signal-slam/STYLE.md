---
name: style-signal-slam
description: Visual style "Signal Slam": a hazard-orange field with a faint diagonal hatch where one black Archivo 900 word slams full-width per spoken word, each at its own width (62–125), with poster stacks, ink-inverted keywords, band splits, a stretching final word with a glow, and a shutter that closes to black. Built for hooks and hype. Use when a video is made in this style.
---

# Signal Slam

## 1. In one line

Loud and percussive: the frame floods hazard orange and every spoken word slams in black, each at a different Archivo
width, then the orange shutters shut. It suits hooks and openers, 3–5 s hype beats or punchlines inside a darker video
(it cuts naturally out of `plotter-on-ink`), countdowns and short manifestos. No footage, no 3D. Use it in bursts: a
whole video in it is tiring.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (field) | `#ff4d12` | the full frame |
| fieldCentre | `#ff6016` | the field lifted ~12% at the centre (radial) |
| text (ink) | `#0a0a0b` | every slam word, labels, readout |
| surface (ink blocks) | `#0a0a0b` | inverted keywords, the ink band, the shutter |
| faint (hatch) | `#c21d0b` | diagonal engraving lines at 16%, 9 px pitch, wobbled by noise |
| accent (glow) | `#ff8a3d` | the centre glow pulse on the final word |
| muted | `#531e0c` | ink at about 70% over the field (labels, the line strip) *(derived)* |
| accent2 (bone) | `#eee9df` | the bone flash on hits; type on the ink shutter *(proposed)* |

## 3. Typography

- **Archivo 900, UPPERCASE,** loaded as the variable font so every word sits at its own width: 62, 75, 87.5, 100,
  112.5 or 125. Widths step between instances, never glide.
- **One word at a time,** fitted to the 960 px column (the source fits ~1500 of 1920 px: the same ~80%), caps no
  taller than 820 px. Character width per width (em, for fitting): 62 → 0.52, 75 → 0.60, 87.5 → 0.67, 100 → 0.74,
  112.5 → 0.81, 125 → 0.88 *(measured roughly from renders)*. A short word at 125 is huge; a long word at 62 still
  fits.
- **Pick widths for rhythm:** alternate wide and narrow so consecutive words never share a width (the source: AND 125,
  THIS 112.5, IS 125, WHERE 87.5, IT 125, GETS 100, then CRAZY. 125).
- **Labels:** IBM Plex Mono 600, 24 px, 0.2 em, ink at 80% (the source's 13 px corner labels, scaled for the phone).
  Line strip: Plex Mono 500, 26 px. Readout digits: Plex Mono 500, 48 px.
- **The smallest text** is 24 px.
- **Emphasis:** width 125 with the stretch and the glow (the final word), or orange type on an ink block (inverted).

## 4. Layout

- **The slam word** is centred on the frame (y ≈ 880).
- **Corner furniture** *(source: plate number and readout; the rest proposed for vertical)*: plate top-left
  (`01 / HOOK`) and word counter top-right (`WORD 05 / 05`) at y 250; the line strip (the whole spoken line in mono,
  the current word inverted) bottom-left at y 1400; the readout bottom-right at y 1490 (label, 48 px digits, a 220 px
  tick bar).
- **Margins:** 60 px; column 960 px. Safe zone 230 px top, 330 px bottom: words and furniture stay inside.
- **Fullness:** one word and the furniture; the hatch and the glow carry the rest.

## 5. Elements

- **The field:** orange, lifted at the centre, with the diagonal hatch (−38°, 9 px pitch, 16%, noise-wobbled).
- **Slam word** (core beat): one word, full width.
- **Stack beat** *(proposed)*: 2–5 words pile up as a poster as they are said, each at its own width, scaled together
  to fit y 330–1340; the keyword inverted.
- **Sequence beat** *(proposed)*: a stack joined by thick ink chevrons (what goes in → what it hits → what comes out).
- **Band split** *(proposed)*: three bands, the middle one ink with orange type, one key word each, the item in mono
  above it.
- **Inverted block:** orange Archivo on an ink block, for the keyword.
- **Readout:** a deadpan instrument that rolls up to a true value (`RATIO 5.9`, `WDTH 125`).
- **Shutter:** ink closes from top and bottom; it can hold as a letterbox band for the end card (CTA in bone mono on
  the ink), then close to black.
- **Carry-over:** a keycap or shape from the previous scene can shrink away (the source's ⏎: 560 px → 0 over 0.35 s,
  ease-in-cubic).

## 6. Motion

- **slam:** scale 1.25 → 1 over 0.16 s ease-out-expo, then a hard cut to the next word.
- **stretch** (the final word): letters 0.05 s apart, each stepping widths 62 → 125 over 0.3 s (ease-out-expo,
  quantised); the word scales 1.3 → 1 over 0.15 s; a 6 px jitter decays with a 0.12 s half-life.
- **punch:** every word punches the frame +2% (half-life 0.07 s); the last word shakes 14 px; chromatic aberration
  spikes to 4.2 px on it.
- **glow:** the centre glow pulses on the final word (half-life 0.25 s) *(proposed half-life)*.
- **readout:** rolls to its value over 0.6 s ease-out-expo (the source rolls 0.12 → 0.97).
- **shutter:** closes vertically, ease-in-quart, just after the last word (0.32 s *(proposed)*).
- **invert / band:** ink blocks and bands wipe in from the left, 0.1–0.14 s ease-out-expo *(proposed)*.
- **Stagger:** one cut per spoken word; letters 0.05 s apart in a stretch.
- **Holds:** none: a word holds exactly until the next word.

## 7. Transitions and rhythm

- **In:** the previous scene's key or button rushes to fill the frame and becomes the orange field.
- **Out:** the field shutters to ink (ease-in-quart) just after the last word.
- **One cut per spoken word;** no fades.
- **Beat length:** 2–5 s (the source's interlude is about 2 s).
- **Sound:** an impact on every word, a riser into the final word, a reverse suck or shutter clunk on the close.

## 8. Finish

- **Bloom** 0.4 (threshold 1.2): the glow pulse; type stays flat.
- **Vignette** 0.3, **grain** 0.06.
- Chromatic aberration spiking to 4.2 px on the last word (in a video's post pass).
- No gradients or shadows on the type.

## 9. 3D look

None.

## 10. Banned

- More than one word on screen in a slam beat (stacks and bands are separate beats of 2–5 words).
- Lowercase, or a second typeface, for slam words.
- Easing in from small: words arrive big and settle in 0.16 s.
- Fades between words: hard cuts only.
- Colours other than signal orange, ink, the hatch and the ember glow.
- Beats longer than about 5 s.
- Smooth width animation.

## 11. Where it came from

- **Motion as Code kit** ("the engine and style of pdoom-video"), the orange interlude of `app/src/scenes/crazy.ts`
  (part A, "and this is where it gets crazy"), with the engine's palette and post.
  `D:\code_files\resources to make content engine\aman thakur's resources\Claude workflow guide\Motion_as_kit.zip`.
  Research notes: `docs/research/styles/local-guides.md`, "Motion as Code — Signal Field Slam". Licence: **MIT**
  (© 2026 Giacomo Magnanini); no code copied, the look is rebuilt. Archivo and IBM Plex Mono are SIL OFL.
- **Taken:** the field, hatch and glow colours and values, Archivo 900 uppercase one word at a time with per-word
  widths, the slam, the stretch, the readout roll, the shutter, the punch, shake and aberration, the finish values,
  plate number and readout placement.
- **Proposed** (the source is one 2 s example): the stack, sequence and band-split beats, inverted blocks, the line
  strip and word counter, the shutter held as an end card, all px sizes for vertical, the per-width character widths,
  the glow half-life, the shutter and band timings.
- **For vertical:** the source is 1920×1080. Here each word is fitted to a 960 px column (the same ~80% of the width),
  so wide words are shorter on screen than in 16:9; furniture moved inside the safe zones and scaled from 13 px to
  24 px; the line strip was added because one word per frame needs its sentence somewhere on a phone.
- Added to the catalog on 2026-10-31.
