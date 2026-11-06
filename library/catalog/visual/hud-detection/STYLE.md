---
name: style-hud-detection
description: Visual style "HUD Detection": a black, grained "the machine is listening" look; a persistent HUD frame (corner brackets, title, timecode, live transcript edge, waveform timeline, chapter) around very different scenes, every keyword locked in orange detection brackets with a mono readout; Unbounded slams, Space Grotesk captions, JetBrains Mono data, Instrument Serif for the quiet line. Use when a video is made in this style.
---

# HUD Detection

## 1. In one line

"The machine is listening": a broadcast HUD frames the whole video while very different scenes cut underneath, and
every keyword is caught in orange detection brackets the moment it is said. It suits voice-over tech and AI
explainers, "how it works" reels, tool launches, keyword-heavy scripts and comment-keyword CTAs. No footage needed;
3D is optional (the core, the drop and the wormhole were shaders in the source).

## 2. Palette

Five colours from the source, plus support tones measured from its frames.

| Role | Hex | Where |
|---|---|---|
| background (black) | `#0b0a09` | the ground of every dark scene |
| text (warm white) | `#eceae4` | titles, captions, HUD text |
| accent (orange) | `#ff5a26` | keywords, detection brackets, tags, hits, the counter ring, flash-card and CTA grounds |
| accent2 (red) | `#ff3b1f` | the playhead, errors ("everything turns red"), the thin circle around the core, radar lines |
| indigo | `#1b1d4a` | quiet moments: the serif scene's ground |
| glow | `#2a140c` | the warm brown radial glow behind dark scenes, top-right and bottom-left *(measured from the guide's pages)* |
| chocolate | `#4a1204` | type and HUD on orange cards *(measured from the flash-card frame)* |
| ringLine | `#d9400f` | the concentric rings on orange cards *(measured)* |
| salmon / verbInk | `#e8b4a0` / `#504747` | the stacked-verbs ground and its words *(measured)* |
| muted | `#8a847c` | HUD sub-labels, readouts, transcript words *(proposed)* |
| faint | `#3b3631` | HUD hairlines, unplayed waveform, ticks *(proposed)* |
| surface | `#171412` | code pills and panels *(proposed)* |

## 3. Typography

- **Unbounded 900:** titles, slams and THE DROP. UPPERCASE, very wide and heavy, tracking −0.01 em *(proposed)*.
  About 0.95 em a character, so fit by width: 118 px for title words, up to 300 px for one flash-card word, 170 px
  for counter numerals *(proposed sizes)*.
- **Space Grotesk 500:** captions and UI, sentence case, 56 px *(proposed)*.
- **JetBrains Mono:** timecodes and data. HUD title 28 px 700 with 0.3 em tracking; sub-labels, readouts and the
  transcript 24 px *(proposed sizes)*; uppercase, widely spaced.
- **Instrument Serif italic:** the emotional line only, 120–190 px *(proposed)*.
- **The smallest text** is 24 px.
- **Emphasis:** the keyword turns orange inside orange corner brackets, with a readout under the caption:
  `09.80s · BLUE`. Big words become full-width Unbounded slams.
- **Words on screen:** the caption builds word by word on the timestamps (one short line); the scene shows 1–5 big
  words; the transcript edge runs the whole script.

## 4. Layout

Re-laid out for 1080×1920 (the source's frames are about 4:5). The HUD sits inside the safe zones:

1. **Corner brackets:** L-shapes at (48, 200), (1032, 200), (48, 1612), (1032, 1612), 40 px arms, 2 px.
2. **Title** top-left at y 238 (mono 28, 700, 0.3 em) with a sub-label under it (`WORD-LEVEL · 01`).
3. **Timecode** top-right (`00:00:09:24`) with a word counter under it (`W.019`), both from the real clock and words.
4. **Live transcript** rotated down the left edge (x ≈ 70, y 380–1380), keywords orange.
5. **Caption** centred at y 1300 (Space Grotesk 56).
6. **Readout** under the caption (mono 24).
7. **Timeline strip** at y 1450: waveform, orange keyword ticks, red playhead.
8. **Handle / series** bottom-left and **chapter** bottom-right (`03 / DETECT`, sub `KEYWORD`) at y 1508–1570.

- **Scene band:** y 360–1240, between the top HUD row and the caption, centred.
- **Margins:** 80 px for scene content *(proposed)*. Safe zone 230 px top, 330 px bottom: all HUD text is inside it.
- **Fullness:** busy edges, one strong element in the band.

## 5. Elements

- **HUD frame** (above): on every scene, recoloured chocolate on orange and salmon grounds.
- **Detection brackets:** four orange corners that close on a keyword (caption) or an object (lock-on), with an
  orange **tag** in chocolate mono: `AIR MOLECULE · 07.20s`.
- **Scene library** (one scene per idea):
  - flash card: one giant chocolate Unbounded word on orange concentric rings;
  - title words: warm-white Unbounded lines, the keyword orange and bracketed;
  - glowing core: an orange wireframe sphere with bloom, two orbit ellipses with RGB fringing, a circular mono text
    ring inside a thin red circle, lock-on brackets and a tag;
  - counter: a thin orange ring drawing with 60 ticks, a big Unbounded numeral counting up;
  - stacked verbs on salmon: three dimensional Unbounded verbs (extruded, with thin white and orange slashes), each with
    a dark code pill (`● name  1 / 3 ✓`);
  - indigo serif: italic serif lines on indigo smoke with a small red radar sweep (`SIGNALS FOUND · 02`);
  - also allowed: terminal on a dot grid, AI-chat panel with tool steps, editor timeline, manga panel with speed lines,
    wormhole, CTA card (orange rings + comment pill), end card. Generic UI only.
- **Pills:** dark surface, orange dot, mono text; or orange-outlined chips.
- **Numbers:** every HUD number is true: timecodes from the clock, counts from the words and objects shown.

## 6. Motion

The source names moves but gives no numbers; every value here is *(proposed)*.

- **word** (caption): each word appears on its timestamp, expo-out 0.12 s, rising 8 px.
- **lock** (detection brackets): corners start 0.6 × 3 arm-lengths out and close in, expo-out 0.25 s, fading in.
- **slam** (Unbounded): scale 1.35 → 1, expo-out 0.18 s, opacity in 0.04 s.
- **stamp** (tags, pills, "snap onto the timeline"): scale 1.25 → 1, expo-out 0.12 s.
- **count:** numbers count up and rings draw, expo-out 0.9 s.
- **draw:** circles and lines draw on, ease-in-out-cubic 0.5 s.
- **push:** every scene pushes in slowly, scale 1.0 → 1.04 over the scene, linear.
- **spin:** cores and rings turn 20°/s.
- **glitch** (on cuts and hits): 0.1 s, 6 horizontal slices offset up to 40 px.
- **Stagger:** 0.08 s *(proposed)*; in practice every move lands on a spoken word's real start.
- **Exits:** none: scenes cut.

## 7. Transitions and rhythm

- "1 idea = 1 scene, 1 keyword = 1 hit, 1 big line = 1 drop."
- New scene on the first word of each idea; about 2.9 s a scene on average (16 scenes in 47 s in the source).
- **Glitch** on every cut and hit; **whoosh** on every scene cut.
- **The drop:** a counter builds up, a short silence before the biggest line, then the drop scene with a glitching
  chrome title. "That breath is where the drop goes."
- "Everything turns red" on an error word: the whole frame, HUD included, goes red.
- **Sound, no music:** whoosh (cuts), blip (keywords), 808 hit (big words), riser → drop, pop (UI and cards), glitch,
  typing, stamp, ping (radar). Voice about +8 dB over SFX; −14 LUFS; peaks under −1 dBTP.

## 8. Finish

- **Film grain** 0.06, **vignette** 0.45 *(proposed values; the source names both)*.
- **Bloom** on orange elements: two orange drop-shadow glows (7 px and 18 px) *(proposed)*.
- **Chromatic aberration:** RGB fringing on thin lines, 2 px *(proposed)*.
- **Warm brown radial glow** in the corners of dark grounds.
- Feedback trails and slice glitch on cuts and hits; slow push-ins.

## 9. 3D look

Optional. In the source the chrome core, the fractal drop and the wormhole are GLSL shaders; here the core is drawn
in 2D. In Blender: an emissive orange wireframe sphere (emission strength high enough to bloom), chrome bevelled
Unbounded titles in a dark fractal corridor for the drop, a radial wormhole of orange, black and white rays; dark
world with a warm brown glow; slow push-ins; bloom and chromatic aberration in compositing.

## 10. Banned

- Music.
- A scene without the HUD frame.
- A keyword without its brackets and readout.
- HUD numbers that aren't true (no invented WPM or confidence percentages).
- More than one giant word on a flash card.
- Colours outside the five and the measured support tones.
- An editing app, templates or AI video for the visuals.
- SFX over the voice.

## 11. Where it came from

- **Level 5 Workflow Guide** (12 slides, by a creator credited on the slides),
  `D:\code_files\resources to make content engine\aman thakur's resources\Level 5 Workflow Guide.pdf`: master prompt
  (slide 1), overview (2), cue sheet (5), sound (6), the look (7), the HUD (8), scene library (9–10), review and specs
  (11), tips (12). Research notes: `docs/research/styles/local-guides.md`, "Level 5 — HUD detection". Licence: none
  stated; the look is described in our own words; no code or assets copied. The four fonts are SIL OFL.
- **Taken:** the five hex colours, the four fonts and their roles, the HUD's eight parts and their order, detection
  brackets and readout format, the scene library, finishing effects, rhythm rules, cue and sound vocabulary, mix
  levels.
- **Measured from the guide's frames:** the brown glow, chocolate, ring-line, salmon and verb colours.
- **Proposed:** every motion number, every size and position, finish intensities, muted/faint/surface colours.
- **For vertical:** the source frames are about 4:5 (1180×1526 in its specs); here the HUD is spread over 1080×1920
  inside the safe zones, with the scene band in the middle. The handle is replaced by the series line, and the WPM
  readout by a word counter (a WPM figure would not be true for a preview).
- Added to the catalog on 2026-10-31.
