---
name: style-one-shape-morph
description: Visual style "One-Shape Morph": B-roll that never cuts; one rounded shape on a warm-grey stage morphs pill → card → diagram → chart → lanes → session bar on springs, its content blur-swaps in on spoken words, a black arrow cursor drives every change, black/white components with one orange accent, Geist and Geist Mono. Use when a video is made in this style.
---

# One-Shape Morph

## 1. In one line

Calm, tactile B-roll in which one rounded shape never cuts: it morphs from state to state while a cursor drives it,
and its content swaps with a short blur on each spoken word. It suits cutaways in talking-head videos and shorts, tool
and AI explainers, tutorials, and fact reels told through a single object.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (stage) | `#e9e7e2` | the warm-grey stage behind full-frame cutaways |
| text (ink) | `#0b0b0b` | dark pills, chips and session bars; all text on light; bar fills; the cursor |
| surface (component) | `#ffffff` | the shape in its card, doc and comparison states |
| muted | `#8a8782` | sub-labels, captions, mono statuses |
| muted2 | `#9a9791` | sub-lines inside black shapes |
| faint (hairline) | `#e2dfd9` | dividers, progress tracks |
| skeleton | `#e6e3de` | skeleton text lines, slider tracks |
| docLine | `#dcd8d1` | lines in the document state |
| accent | `#ff5a1f` | the one accent: the chip that fills in, the first bar, a badge, the name pulse, a chapter number |
| accent2 | `#e14a12` | the accent's darker side (a folder's tab) |
| panel | `#f4f2ee` | the light shape of transparent panel clips over dark footage |
| ghost | `#bdb8b0` | a drop target's 3 px dashed border; its text `#a29e97` |

- Shape shadow: `0 1px 2px rgba(20,18,14,.06), 0 10px 30px -8px rgba(20,18,14,.16)` (removed on alpha clips).
- One accent, used for the one thing that matters in each state.

## 3. Typography

- **Faces:** Geist 400/600 for UI text, Geist Mono 400/500 for code, file names, statuses and terminals (Google Fonts;
  the source embeds the same OFL faces). Tabular digits everywhere (`tnum`).
- **Sizes are world px on the shape**, then multiplied by the camera zoom (`cam` 1.2 for cards, 1.4 for pills in
  vertical), so on screen they are bigger:

  | Text | World px | Weight | Tracking | Colour |
  |---|---|---|---|---|
  | Pill title | 48 | 600 | −0.02 em | white on ink |
  | Big heading | 54 | 600 | −0.025 em | ink |
  | Card title | 34 | 600 | −0.02 em | ink |
  | Section title | 27 | 600 | — | ink |
  | Subtitle / body | 25 | 400 | — | muted |
  | Badge | 22 | 600 | — | white on accent, padding 6/14, radius 999 |
  | Mono file name / status | 25 / 22 | 400 | — | muted |
  | Terminal | 26, line-height 40 | 400 | — | ink |
  | Chapter number | 150 | 600 | −0.05 em | accent (or ink with an accent unit) |
  | Chapter title / sub-line | 60 / 28 | 600 / 400 | −0.03 em | white / muted2 |

- **Smallest:** 20 world px, which is 24 px on screen at cam 1.2.
- **Case:** sentence case. The middle dot `·` joins label pairs (`Out · Blue, in every direction`).
- **Emphasis is colour and shape, never type:** the accent chip fills in around the key word, a row name flashes accent
  (Gaussian pulse), segmented-control labels invert under a moving black pill (`mix-blend-mode: difference`).
- **Words:** a short title plus 3–4 labelled rows; body copy is often drawn as skeleton lines.

## 4. Layout

- **One shape, centred** at world (0, 0), placed at y = 900 on screen in vertical *(proposed)*; for panel clips beside
  a picture-in-picture speaker, the centre moves into the empty area and the shape stays clear of the speaker's box.
- **Per-state camera zoom** so each state fills the frame: about 1.2 for cards and 1.4 for pills in vertical (the
  16:9 source uses 1.2–1.6 and 1.8–2.2).
- **State sizes (world px, vertical *(proposed from the source's)*):** pill 640 × 120 r 60; card 760 × 520 r 36;
  diagram 760 × 820 r 40; chart 760 × 900 r 40; lanes 760 × 540 r 36; session bar 700 × 120 r 60. The radius is
  clamped to half the height. Source sizes for reference: pill 440 × 120 r 60, session pill 720 × 120, cards
  780 × 560 r 36 / 840 × 300 r 44 / 1000 × 600 r 40, doc 600 × 720 r 28, terminal 1060 × 640 r 26, comparison
  1240 × 330 r 40.
- **Anchors:** content is anchored centre, top-centre or left; top-anchored content rides the top edge as the shape
  grows. Inner padding 48/44 world px *(proposed)*.
- **Safe zones:** 230 px top, 330 px bottom.
- **Density:** one idea per clip; 4–7 clips per minute by default (2–4 light, most lines heavy).

## 5. Elements

- **Interaction vocabulary:** primary action (pill + click), progress (loader, bars, lanes), confirmation (check,
  toast), live status island, detail card with a drag, slider with rubber band, toggle, tabs, chart with tooltip,
  search-and-filter list, file → drag → drop target, terminal typing, side-by-side comparison, chapter card.
- **Icons:** one simple line set on a 24 grid, stroke normalised to **2.2 world px** whatever the icon's size (up to
  3–4.2 only on small filled badges); round caps and joins. Drawn generic (arrow, check, sparkle, pencil, file, sun,
  list…), never a product's icons.
- **Cursor:** a generic arrow, fill `#0b0b0b`, white stroke 2.6, shadow `0 2px 3px rgba(0,0,0,.25)`, a constant
  44–46 px on screen whatever the camera.
- **Chips and badges:** black pills with white text (and an icon) for objects; accent badges for the key word.
- **Progress lanes:** name, a 14 px track and fill, a mono status `queued` → `NN%` → `done ✓`.
- **Bars:** radius 12/12/6/6, relative heights only; the first bar is the accent.
- **Skeleton lines:** 12–14 px tall, radius half the height; a doc's first line is a 20 px accent bar.
- **"vs" disc:** a 96 px black circle that flips to the accent.
- **Terminal:** three monochrome dots, a centred mono title, a hairline, a rounded welcome box with an accent mark, a
  typed prompt with a block caret.
- **Real numbers only:** labels come from the transcript; bars are relative.

## 6. Motion

All springs are the source's closed-form step response `S(τ, ω, ζ)`; Remotion values at mass 1 are stiffness = ω²,
damping = 2·ζ·ω, checked against the kit's `springAt()` (identical curves). A value re-targeted many times is the sum
of one spring per change.

| Recipe | Source [ω, ζ] | Use | stiffness / damping |
|---|---|---|---|
| morph | [15, 0.84] | shape width, height, radius | 225 / 25.2 |
| fast | [27, 0.86] | leading edges (liquid indicators) | 729 / 46.44 |
| slow | [12.5, 0.9] | trailing edges | 156.25 / 22.5 |
| soft | [10, 0.95] | gentle moves | 100 / 19 |
| cam | [7.5, 1] | camera zoom, critically damped | 56.25 / 15 |
| colour | [20, 1] | colour tracks (fills flipping) | 400 / 40 |
| intro | [13, 0.78] | the shape's pop-in | 169 / 20.28 |
| press | [45, 1] | press down | 2025 / 90 |
| release | [22, 0.72] | press release | 484 / 31.68 |
| bars | [13, 0.82] | bars rising | 169 / 21.32 |
| badge | [16, 0.7] | badge pop | 256 / 22.4 |

- **intro:** scale `0.55 + 0.45·S(t − 0.02, 13, 0.78)`, opacity linear over 0.12 s.
- **vis** (content swap): enter waits 0.07 s, then 0.26 s easeOutCubic from a 12 px blur at 0.94 scale; exit 0.12 s
  to a 9.6 px blur at 0.97. Old and new content get separate timings so they never overlap. The curve is stored as
  `cubic-bezier(0.33, 1, 0.68, 1)`, the usual stand-in for easeOutCubic.
- **Rows on words:** `vis` plus a 12–14 px rise (13 used) or −18 px slide; rows 0.27–0.32 s apart (0.3), lanes 0.1 s.
- **Skeleton lines:** grow with smootherstep over 0.45 s, 0.18 s apart (doc lines 0.3 s, 0.075 s apart). Stored as
  `cubic-bezier(0.65, 0, 0.35, 1)` for the engine; the previews use the smootherstep itself where it matters.
- **Liquid indicator:** the leading edge on fast, the trailing edge on slow, so a pill stretches as it travels.
- **Press:** starts 0.07 s before the click, releases 0.035 s after; the shape scales by `1 − 0.035·press`, the cursor
  by `1 − 0.13·press`; a drag holds the press.
- **Cursor path:** smootherstep between keys with a perpendicular arc of `sin(πu)·0.06` of the segment.
- **Accent pop:** scale `1 + 0.12·sin(πu)` over 0.3 s (`1 + 0.25·sin` over 0.35 s for the "vs" disc).
- **Name pulse:** colour toward the accent with a Gaussian of σ ≈ 0.16 s. **Spinner:** 240°/s. **Caret:** about
  2.2 Hz. **Typing:** deliberately fast (about 98 chars/s in the source's example).
- **Rules:** a tiny overshoot at most; the camera zooms so each state fills the frame; a clip ends by holding its last
  state.

## 7. Transitions and rhythm

- **Inside a clip:** never a cut. The shape morphs, the content blur-swaps.
- **Between clip and face:** a hard cut in the edit.
- **Pacing to speech:** one change per spoken beat, 0.4–1.2 s apart, each landing on a word (put important changes on
  the first or last word of a caption cue: word times are ±0.2 s).
- **Cutaways:** 3–10 s each, never in the first second of the hook, never on personal or emotional lines, at least
  about 2 s of face between them. A chapter card holds `Up next →` for about 0.9 s, then morphs to the number + title.

## 8. Finish

- No grain, no vignette, no glow.
- Real motion blur in the final: 4 sub-frames centred on the frame time over a 180° shutter.
- Gotcha: never put `will-change` on anything the camera scales, or text renders blurry.
- Panel clips render with alpha (ProRes 4444) and lose the shape shadow.

## 9. 3D look

None.

## 10. Banned

- Cuts inside a clip.
- Bouncy easing (a tiny overshoot at most).
- Particles.
- Glows.
- Gradients on UI chrome.
- Mixed icon strokes.
- Dead time.
- Anything that looks like a template.
- Made-up data, numbers, quotes, prices or results.
- A second accent colour.

## 11. Where it came from

- **Barty-Bart/motion-graphics, `skills/motion-broll`** (`SKILL.md`, `reference/engine-api.md`, `engine/motion.js`,
  `engine/base.css`, examples `opus-aoe2/01–06` and `plan.json`; MIT, © 2026 Bart; Geist / Geist Mono SIL OFL 1.1;
  icons in the source adapted from Lucide, ISC), through `docs/research/styles/barty-bart-and-prompt-motion.md`,
  section "One-Shape Morph B-roll"; the two demo GIFs were looked at. Taken: the full palette, Geist + Geist Mono,
  tabular digits, the type table, the `·` separator, emphasis by colour and shape, state sizes and per-state camera,
  anchors, density, the interaction vocabulary, icon stroke rules, the cursor, lanes, bars, skeleton lines, the disc,
  every spring preset, `vis`, rows on words, press, cursor arc, pops, pulse, pacing to speech, cutaway rules, motion
  blur, the `will-change` gotcha and the bans.
- **Proposed:** the vertical state sizes and cams, the stage centre at y = 900, inner padding, the diagram and chart
  layouts, ray strokes (4.2, the badge maximum), the bezier stand-ins for easeOutCubic and smootherstep.
- **Changed for vertical:** the source is 1920 × 1080 only. States are narrower and taller (760 wide) and the camera
  zoom is lower (1.2 / 1.4 instead of 1.2–2.2) so they fit a 1080-wide frame; text stays ≥ 24 px on screen.
- **Footage:** the source is B-roll for a speaker. Full-frame cutaways (what the previews show) need no footage; panel
  clips sit beside the speaker's own footage, which the video supplies.
- The examples' product names, model names and file names were not used; icons are redrawn generic shapes.
- Added to the catalog on 2026-10-31.
