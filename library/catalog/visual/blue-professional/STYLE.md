---
name: style-blue-professional
description: Visual style "Blue Professional": an investment-research briefing that moves; warm cream, one saturated cobalt for every numeral and chart, near-black Space Grotesk headlines, soft cobalt-tinted rounded cards with no shadows, a counter and progress bar on every frame, and measured slides along one axis. Use when a video is made in this style.
---

# Blue Professional

## 1. In one line

Consulting restraint: a research briefing on warm cream with ONE saturated cobalt and grey text. Measured and executive.
It suits business explainers, reports, data stories and B2B launches. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background | `#fdfae7` | every frame |
| surface (card-bg) | `#f6f3e8` | cobalt at 4% on the cream (`rgba(30,43,250,0.04)` in scenes) |
| text | `#111111` | headlines, never cobalt |
| muted | `#6b6b6b` | body |
| faint (text-light) | `#9a9a9a` | tertiary text; light that passes straight through |
| accent (cobalt) | `#1e2bfa` | the ONLY accent: eyebrows, every numeral, the CTA, chart fills, the progress bar, the 4 px highlight rule |
| accent2 (accent-light) | `#ebeae8` | cobalt at 8%: tag pills, bar tracks, highlight blocks (`rgba(30,43,250,0.08)` in scenes) |
| positive | `#059669` | only as inline ↑ change-chip text |
| negative | `#dc2626` | only as inline ↓ change-chip text |

Card borders are cobalt at 20%, 1.5 px; a quote mark is cobalt at 15%.

## 3. Typography

- **Space Grotesk** 500/600/700 for display, all numerals and chrome. **Inter 400** for body.
- **Sizes at 1080×1920** *(proposed: the source's cqw sizes are for slides; these keep the ramp for a phone)*:

  | Role | px | Notes |
  |---|---|---|
  | display, 700 (≤ 3 words a line) | 196 | leading 1.08, −0.02em |
  | h1, 700 (closers) | 168 | |
  | h2, 700 (4–6 words) | 104 | |
  | h3, 600 (7+ words, rows) | 58–66 | |
  | metric value, 700, cobalt | 300 | |
  | stat value, 700, cobalt | 42 | |
  | body, Inter 400, muted | 38 | line height 1.45 |
  | eyebrow, 600, uppercase, cobalt | 28 | 0.08em |
  | tag, 500 | 26 | |
  | counter, 500, muted | 26 | 0.05em |

- **Smallest text:** 24 px.
- **No italic, no uppercase body, no cobalt headline.**
- **Emphasis:** a tinted highlight with a 4 px cobalt left rule, on a word or a block.
- **Words on screen:** about 8 in a headline.

## 4. Layout

- **Margins:** 84 px, so the column is 912 px *(proposed)*.
- **Safe zone:** 230 px top, 330 px bottom. The bottom is kept for the counter (y = 1528) and the progress bar (y = 1584, on
  the safe line rather than the frame's edge, so platform buttons don't cover it).
- **Slide header at y = 244:** cobalt eyebrow left, tag pill right; content from y = 340.
- **Alignment:** cover, finding and data lean left; the closer is centred.
- **Balanced, not crowded:** one metric per frame. Below the progress bar runs a foot of cobalt at 8%, so the frame ends
  on purpose *(proposed)*; on the cover the diagonal panel takes its place.
- **For 9:16:** the cover's diagonal panel becomes a bottom band; cards stack; a split stacks.

## 5. Elements

- **Tinted card:** 4% fill, 1.5 px 20% border, 14 px radius (12 px small), no shadow.
- **Tag pill:** 100 px radius, 8% fill, cobalt text.
- **CTA:** a solid cobalt pill, the one solid element on a frame.
- **Accent line:** 60 × 4 px, 2 px radius.
- **Progress bar:** 6 px on an 8% track, growing with the frame's index *(proposed height)*. Square ends: the one thing
  that isn't rounded.
- **Bars:** 36 px track at 8%, 6 px radius, a label left and a cobalt value right; 3–5 rows.
- **Step circle:** 96 px, solid cobalt, opacity 1.0 → 0.85 → 0.7 → 0.55 down a list.
- **Split highlight:** 8% fill, 4 px cobalt left rule, 12 px radius.
- **Atmosphere, on cover and closing only:** the diagonal cobalt-tint panel, a 3 × 3 cobalt dot grid, concentric rings
  (2 px, cobalt at 22%). Figures may ring their subject.
- **Figures:** a near-black line for what comes in, cobalt for what matters, grey for what passes.

## 6. Motion

The source notes 500 ms translateX slide changes and bar fills; everything else is *(proposed)* from the HyperFrames taste
rules T36–T60. The idea: a calm presenter advancing a deck. **One axis, one current:** all content arrives from the
right and leaves to the left (T50–T51). Nothing bounces.

- **slide** (type): each line travels 64 px from the right, quart-out over 0.6 s, fading in over its first half; 0.08 s
  between lines.
- **card:** travels 90 px from the right, expo-out over 0.7 s, a longer tail than the type on it.
- **fill** (bars): expo-out over 1.0 s, 0.07 s between rows.
- **count** (numbers): expo-out over 1.2 s; bars fill alongside.
- **line:** the accent line and highlights grow from the left, quart-out over 0.5 s.
- **panel:** the cover's band rises 240 px, cubic-in-out over 0.7 s: the one move off the axis.
- **ring:** rings draw round from the top, expo-out over 1.2 s, 0.08 s apart.
- **dot:** dots grow, quart-out over 0.35 s, 0.03 s apart.
- **progress:** the bar advances one step, cubic-in-out over 0.6 s.
- **out:** content slides 130 px left and fades, quart-in over 0.32 s (T57's partial travel).
- **Captions:** the active word sits on a cobalt chip; it pops 0.985 → 1 over 0.18 s *(from the source's caption skin)*.
- **Holds:** at least 1.0 s after the last line. Landed type is dead still.

## 7. Transitions and rhythm

- **Cuts:** the cream never changes. Old content slides out left while the new content enters from the right, at the
  same speed, overlapping by about 0.1 s. Counter and progress bar stay fixed through the cut and step on.
- **Rhythm:** even and calm: 3–5 s a frame, with a chart allowed 6 s. One finding a frame.

## 8. Finish

None: soft, tinted, flat. No content shadows, no grain, no vignette, no glow. Rounded everywhere except the progress bar.

## 9. 3D look

None.

## 10. Banned

- A second accent colour; cobalt headlines.
- Drop shadows on content; opaque cobalt borders.
- Square corners (except the progress bar); font substitutes; uppercase body; italic.
- Green or red as general accents.
- Heavier borders to fill space; edge-to-edge headlines.
- KPI grids and three cards in a row: one metric per frame, cards stack.
- Bounce, overshoot, spinning; any move off the axis except the panel.
- More than one solid cobalt surface per frame.

## 11. Where it came from

- **HyperFrames frame preset Blue Professional (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on
  2026-10-31. Research notes: `docs/research/styles/hyperframes.md`, "Blue Professional". Rebuilt in Remotion; no code was
  copied. Space Grotesk and Inter are SIL OFL.
- **Taken:** every hex and alpha, the faces and roles, tracking and leading, the elements (tinted card, tag, CTA, accent
  line, progress bar, slide header, bar track, step circle with its opacities, split highlight, diagonal panel, dot
  grid, rings), the frames (cover, bar ranking, split, closing), the caption chip and pop, the banned list.
- **Proposed:** the motion grammar (the source only notes 500 ms translateX and bar fills), all px sizes, the flattened
  surface and accent2 hexes, the counter's and progress bar's height on the safe line, the sample figures. The bar
  values are (700 ÷ wavelength)⁴, the Rayleigh ratio behind the sample's 5.9×.
- **For vertical:** the 16:9 slide stacks: the diagonal panel becomes a bottom band, cards stack, the split stacks, type
  is larger. The 3-up metric dashboard isn't used: one metric card with bars below.
- **Note:** Space Grotesk and Inter are on HyperFrames' "where generated design lands" list; here they're the preset's
  chosen voice.
- **Kept apart from** Clean Launch (white, red), Paper Launch (raspberry, product windows), Swiss Poster (bars, grid) and
  Cobalt Grid (one ink, serif, graph paper): rounded tinted cards, grey body, a deck counter.
- Added to the catalog on 2026-11-06.
