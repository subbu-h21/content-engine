---
name: style-plotter-on-ink
description: Visual style "Plotter on Ink": a dark engineer's drawing board where a glowing orange pen spark plots every line and word as it is said; graph paper on ink, spoken-word karaoke (ash outline → signal wipe → bone), Archivo 900 slams stepping through widths, deadpan mono annotation, dimension lines, Cormorant captions, HDR glow and grain. Use when a video is made in this style.
---

# Plotter on Ink

## 1. In one line

A dark engineer's drawing board where a glowing orange pen plots every line, word and diagram live, exactly as the
voice says it: deadpan technical annotation, Archivo slams that step through widths, bloom and film grain. It suits
voice-over explainers about process, tools, code and AI, "how X works", pipelines and diagrams, and deadpan humour.
No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (ink) | `#0a0a0b` | the board, a slightly warm black |
| surface (ink2) | `#151517` | raised panels, boxes, inset graphs, prompt fields |
| text (bone) | `#eee9df` | primary text, said words, plotted lines, the grid |
| muted (ash) | `#9c978f` | unsaid-word outlines, notes, dimension text, axes, captions |
| faint (graphite) | `#5e5b57` | dim lines, secondary text, line numbers |
| accent (signal) | `#ff4d12` | hazard orange: the spark, the word being said, carets, playheads, strikes, numbers |
| accent2 (ember) | `#ff8a3d` | the spark's ring; the first frames of a fresh stroke or slam |
| blood | `#c21d0b` | signal's shadow; the halation tint |
| acid | `#d8ff3c` | one rare accent for a single moment in a whole video; never routine |
| whiteHot | `#fff1e2` | the spark's core |

Heat ramp for anything hot: ink → blood → signal → ember → white-hot.

## 3. Typography

- **Archivo** (variable: width 62–125, weight 100–900), loaded with `loadVariableFont`, so the width axis is live.
  - Hero slams: 900, UPPERCASE, fitted to the 900 px column (up to 360 px).
  - Spoken-word rows: 700, as written, 84–100 px; emphasis rows 900 at 130–150 px.
  - **Width is animated in discrete steps** 62 → 75 → 87.5 → 100 (→ 112.5 → 125), never smoothly.
- **IBM Plex Mono:** the UI voice: spaced uppercase labels (24 px, 500, 0.2 em), notes (26 px, ash), typed text,
  readouts (48 px digits). Plex Mono lacks ▸ and ⏎: draw them as shapes.
- **Cormorant Garamond:** italic captions (44–66 px), formulas (80 px), always with **lining figures** (old-style "10"
  reads "IO").
- **Pen writing:** the source writes captions with single-stroke plotter fonts (Hershey, EMS) whose licence is
  unknown, so they are **not used**. Instead the pen reveals Cormorant italic text with a clip wipe whose edge the spark
  rides.
- **Sizes** were scaled up for the phone (the source's 11–13 px labels become 24 px); the smallest text is 24 px.
- **Emphasis is the voice** (karaoke, section 6); a keyword can stay signal (`hot`).
- **Words on screen:** 1–3 rows per beat laid out ahead as outlines, plus one hero word or phrase.

## 4. Layout

- **One sheet per plate,** seen through a 2D camera (pan, zoom about the move's fixed point, roll ±0.02 rad).
- **Margins:** 90 px; column 900 px (the source's 1440–1520 px of 1920 becomes 900 of 1080: the same ~80%).
- **Alignment:** rows left-aligned on the margin; hero slams centred.
- **Corner furniture:** plate number and title top-left at y 250 (mono 24, bone 60%); the readout instrument
  bottom-right ending at y 1560 (label, digits, a 220 px tick bar with a signal fill); Cormorant captions bottom-left.
- **Crop marks** (bookend frames only: the first frame and the loop end): 36 px in from each corner, 22 px arms,
  1.25 px, bone 34%.
- **Safe zone:** 230 px top, 330 px bottom; the furniture sits inside it.
- **Density:** high but quiet: many hairlines and small notes around one bold element.

## 5. Elements

- **Graph paper:** minor 24 px, major 96 px, bone lines at 6% and 12% (the kit's linear strengths 0.011 and 0.03
  come out at roughly 8% and 16% in sRGB; scaled down slightly for the phone). It **ignites** as a disc revealed from
  the pen (radius 0 → 5200 px over 1.35 s, ease-out-cubic) with a signal glow on the front; a soft signal glow
  follows the pen (σ 140 px).
- **The spark (pen):** white-hot core 5 px, ember ring 12 px, signal halo 26 px at 35%, four 1.2 px rays 9–14 px long
  spinning, flicker 0.85–1.0, a trail up to 90 px. Drawn at 1.6× for the vertical frame *(proposed)*.
- **Plotted strokes** by kind (alpha): axis 0.6, construction 0.5 (dashed, 55% duty), dimension 0.85, hatch 0.55,
  plot 0.88, ink 0.95, signal 1.0. Width 1.2 px (×1.5 for the phone *(proposed)*); written words 1.6–2.2, strikes
  3–6, marker 12. **A fresh line runs hot:** ember for 0.05 s, signal for 0.32 s, 1.6× wide, then its kind's colour.
- **Engineering kit:** axes with ticks and values; dimension lines (9 px arrowheads, 8 px end ticks, label at the
  midpoint); beziers with dashed handles; easing notes ("cubic-bezier(.62, 0, .38, 1)"); a title block;
  annotations everywhere ("fig. 0", "baseline", "cap height", "(0, 0)").
- **Boxes and UI mock-ups:** hairline on ink2, registration ticks 6–18 px out from each corner; node boxes with signal
  "01" numbers and packets (signal/ember dashes at 520 px/s every 0.22 s); keyframe timelines, graph editors, prompt
  fields with a signal block caret, code listings, chat with diffs, film strips. All generic.
- **Readouts:** deadpan, and true ("WORDS SAID 07", "STEPS 3 / 3", "RATIO 5.9×").
- **Images:** none; everything is line, type and glow.

## 6. Motion

Every move is keyed to a word's start or end from forced alignment; times in seconds.

- **Karaoke:** unsaid words appear 0.12–0.3 s before they're said (default 0.3) as 1.1 px ash hairline outlines at
  45%, fading in over 0.18 s; the word being said fills by a left-to-right wipe in signal; said words cool from signal
  to bone over 0.3 s after the word ends. A `hot` keyword stays signal.
- **Slam:** scale 1.18–1.25 → 1 over 0.16–0.2 s ease-out-expo (1.22 / 0.18 here); colour ember (half-life 0.085 s) →
  signal → bone over 0.35–0.45 s after the word ends.
- **Width morph:** letters start staggered across 85% of the word's duration; each steps 62 → 75 → 87.5 → 100 over
  0.32 s (ease-out-expo, quantised) while dropping in from −0.12 × size over 0.25 s (ease-out-cubic).
- **Width ripple:** a sine bump of 0.42 s per glyph pushes widths 100 → 125, 0.045 s per glyph, 0.14 s per row.
- **Stretch** (one-word hype): per-glyph 0.05 s, widths 62 → 125 over 0.3 s, scale 1.3 → 1 over 0.15 s, 6 px jitter
  decaying (half-life 0.12 s).
- **Odometer:** each digit rolls 0 → n through a clipped window over max(0.12 s, 90% of its syllable), ease-out-cubic;
  the dot pops 1.6 → 1 over 0.15 s.
- **Pen writing:** a word's strokes draw while the word is said (ending 0.02–0.04 s early, at least 0.12 s); pen travel
  between strokes ease-in-out-cubic, 0.08 s + 0.00035 s per px.
- **Type-on:** notes type in min(0.45, 0.012 × chars + 0.05) s; tokens drop 10 px over 0.18 s with an ember flash.
- **Panel reveal:** a wipe from the left over 0.45 s ease-out-expo plus a 120 px rise over 0.5 s.
- **Strike:** a signal line 4–6 px in 0.08–0.2 s ease-in-out-quad; a snipped line's halves recoil with
  1 − e^(−9t)·cos(30t)·0.15.
- **Ignition ring:** radius 30 → 930 px over 0.75 s ease-out-cubic, intensity (1 − age / 0.75)^1.5.
- **Hits:** zoom punch +1–3% (half-life 0.07–0.1 s), shake 4–14 px of 40–60 Hz noise, bone flash 0.008–0.25, every
  hit decaying as 0.5^(t / half-life).
- **Holds:** said words stay; a finished group dims to 25–45% when the next idea starts.
- **Rewind:** a plate's clock can rewind to 0 (ease-in-out-cubic) and replay at 6×.

## 7. Transitions and rhythm

- **Cuts sit in the pause before a line:** 0.18 s before its first word, or gap × 0.45 (at least 0.04 s); never after
  the first word.
- **Whips** between areas of a sheet in 0.16–0.3 s (ease-out-expo) with a small roll (±0.01–0.02 rad).
- **Dive hand-off:** a plate ends zooming into a box (to 4.4–5.5×, ease-in-quart); the next opens zoomed on the same
  element and pulls back.
- **Rush:** a key fills the frame (to 48×, ease-in-quart) while aberration and bloom spike, and becomes the next plate.
- **Shutter:** a colour field closes to ink (ease-in-quart).
- **Diagonal wipe:** a ±130 px slant with a 3 px signal edge flips ink ↔ paper.
- **Implode loop:** the last slam scales into the spark (ease-in-cubic), particles burst, flash 0.25, crop marks
  return, and the last frame equals the first.
- **Rhythm:** plates of 4–18 s; a hit on most stressed words; ~500 sound cues in 90 s, ducked up to 7 dB under the
  voice; −14 LUFS.

## 8. Finish

The source grades in linear HDR; here it is approximated with CSS:
- **Bloom** 0.7 (threshold 0.84) and **halation** 0.25 in blood: two drop-shadow glows on hot things.
- **Chromatic aberration** 1.2 px at the frame edge (in a video's post pass; not in the previews).
- **Grain** 0.05 (strongest in mid-tones), **vignette** 0.42.
- **Tone:** identity below 0.72 then a soft shoulder; very bright values desaturate toward white.
- **Motion blur:** 180° shutter, more sub-frames where motion is fast.
- **Encode:** libx264 CRF 16–17, preset slow, `-tune grain`, aq-mode 3, BT.709 tags.

## 9. 3D look

Almost none. One plate in the source has a faint "engraved" wireframe stage behind the UI: additive bone lines at 11%
on a floor grid fading into the distance, a perspective camera (FOV 34°) dollying slowly, wireframe solids that flash
signal (half-life 0.25 s) as they are named. No shading, lights or materials.

## 10. Banned

- Hand-set keyframes: every move is a function of time keyed to a word.
- Cutting after a line's first word.
- Off-palette colours (no light-blue grid); acid more than once per video.
- Old-style figures in Cormorant.
- Relying on ▸ / ⏎ in Plex Mono.
- A dark halo behind captions on paper.
- Photos, footage or stock icons.
- Motion that no word triggers.
- Pen fonts without a known licence.

## 11. Where it came from

- **Motion as Code workflow guide** (PDF, 7 pp) and its kit `Motion_as_kit` ("the engine and style of pdoom-video"),
  `D:\code_files\resources to make content engine\aman thakur's resources\` (the kit is in `Claude workflow guide\`).
  Values from the kit's palette, post, type, stroke, hud, util and shader code, the scene helpers and the plates.
  Research notes: `docs/research/styles/local-guides.md`, "Motion as Code — Plotter on Ink". Licence: **MIT**
  (© 2026 Giacomo Magnanini); no code was copied here, the look is rebuilt. Archivo, IBM Plex Mono and Cormorant
  Garamond are SIL OFL. The Hershey/EMS single-stroke fonts carry no licence file and are not used.
- **Taken:** the palette and heat ramp, fonts and widths, karaoke, slam, width morph and ripple, stretch, odometer,
  pen-writing and type-on timings, panel, strike, ignition, hits, cut rules, transitions, finish values, stroke kinds,
  the spark, graph paper, the engineering kit, furniture and crop marks.
- **Proposed:** every px size for 1080×1920 (labels 24 px, rows 84–100 px, slams up to 360 px), the 1.6× spark and
  1.5× stroke scale, the grid alphas in sRGB, the clip-wipe pen writing, the readout labels in the samples.
- **For vertical:** the source is 1920×1080 at 60 fps. Here: a 900 px column on 1080, one hero element per sheet with
  rows under it, furniture moved inside the safe zones (caption bottom-left, readout bottom-right), labels scaled up
  for the phone, no camera moves in the stills. Timings are in seconds, so they hold at 30 fps.
- Added to the catalog on 2026-10-31.
