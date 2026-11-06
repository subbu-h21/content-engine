---
name: style-biennale-yellow
description: Visual style "Biennale Yellow": an art-biennale catalogue in motion; warm parchment, one indigo ink for all type and rules, huge Instrument Serif, soft solar-yellow sun blooms that rise once behind the page, a hard yellow block under one key word, and words that soak in from pale to ink without moving. Use when a video is made in this style.
---

# Biennale Yellow

## 1. In one line

An art-biennale catalogue: warm parchment, one deep indigo ink, soft solar-yellow sun blooms for depth. Calm, airy and
literary. It suits culture, events, programmes, essays, quote cards and slow explainers. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#e9e5db` | the ground of every frame; never white or grey |
| surface (paper-deep) | `#dcd6c4` | secondary paper; the pale tone words soak in from |
| text (ink) | `#1b2566` | ALL type and ALL rules: there's no second text colour |
| muted | `#555b87` | ink at 72% on paper: the page number only *(proposed)* |
| faint | `#c0bfc4` | ink at 20% on paper: soft hairlines *(proposed)* |
| accent (sun) | `#f1ee2e` | bloom core, the yellow panel, block tiles (40–70%), the light beam, the hard block under a key word |
| accent2 (ember) | `#e26b4a` | only a 15–22% counter-bloom in the corner opposite the sun; never a fill or text |
| sunSoft | `#f8f39b` | bloom mid stop; light that has passed through something |
| haze | `#f0da7c` | bloom outer stop (18–22%) |

Bloom gradient: radial, sun at 92% (0%) → sun at 50% (30%) → haze at 22% (55%) → paper at 0 (78%). Never inverted: ink
on yellow, never yellow on ink.

## 3. Typography

- **Instrument Serif 400** for display, numerals and quotes; never bold. **Archivo 400/600** for body and labels.
  **JetBrains Mono 400** only for figures and the page number.
- **Sizes at 1080×1920** (the source's px at 1920 wide are kept for display; the reading sizes are raised for a phone):

  | Role | px | Leading / tracking |
  |---|---|---|
  | display (≤ 3 words a line) | 280 | 0.86 / −0.018em |
  | display italic (manifesto) | 216 | 0.98 / −0.005em |
  | headline (4–6 words) | 132 | 1.02 / −0.005em *(proposed)* |
  | headline-sm (7+ words) | 88 | 1.02 *(proposed)* |
  | jumbo numeral | 500 | −0.04em *(proposed, 538 in the source)* |
  | strand numeral | 168 | *(proposed)* |
  | strand and row titles | 74 | *(proposed)* |
  | body (Archivo 400) | 38 | line height 1.4 *(proposed)* |
  | micro-label (Archivo 600, uppercase) | 26 | 0.18em tracking; rail 0.32em |
  | mono figures | 30 | 0.04em |
  | page number | 24 | 0.08em, 72% ink |

- **Smallest text:** 24 px.
- **Case:** sentence case for display; labels uppercase with at least 0.16em tracking.
- **Emphasis:** one italic key word, or the hard square sun block under one word. Never both on one frame, except the
  manifesto (all italic, one block). Never bold, never a second colour.
- **Fit to length:** a block is at most 842 px wide (78% of the frame). Never shrink the jumbo numeral: cut words.
- **Words on screen:** about 8 in the serif.

## 4. Layout

- **Margins:** 84 px *(proposed)*. Only blooms, tiles and panels bleed.
- **Safe zone:** 230 px top, 330 px bottom. The page number sits at y = 1558, above the bottom safe line.
- **Empty:** frames are 55–60% empty; the ledger (rows of figures) is the one dense exception.
- **Alignment:** cover, panel and list frames sit left or asymmetric; numeral and manifesto frames are centred.
- **One serif moment** dominates at 3–6× its neighbour.
- **For 9:16:** cover: display on top, the 4-column footer stacks into 2 × 2. Chapter: numeral centred, label on top.
  Ledger: 3 columns. Poster: the panel becomes a top band.

## 5. Elements

- **Sun bloom:** one per frame, 42–70% of the frame, off-centre or behind the focal element. Flat parchment with no
  bloom or yellow surface reads as a template, so every frame has one.
- **Ember bloom:** a counter-bloom in the opposite corner, 20%.
- **Yellow panel:** a full-bleed band with no border; ink type sits on it.
- **Block tiles:** translucent yellow squares, 135 px, on the 8-column grid, spilling out of a panel's edge.
- **Hairline:** ink, 2 px at this size *(proposed: the source's 1 px disappears on a phone)*; soft variant at 20%. It's
  the only border.
- **Strand row:** serif numeral + serif title on a hairline.
- **Ledger row:** serif name · mono figure · mono figure.
- **Footer band:** metadata cells: micro-label over a serif value.
- **Vertical rail:** a rotated label up the left edge.
- **Page number** bottom-right, on every frame.
- **Diagrams:** light is a flat yellow beam, and what it does is drawn in ink. Blue light can be the ink itself.

## 6. Motion

The source has no motion (only the caption pop). Everything here is *(proposed)* from the HyperFrames taste rules T36–T60,
except where noted. The idea: print soaking into paper, light rising behind it.

- **sunrise** (blooms): opacity 0 → 1 and scale 0.78 → 1, sine-in-out over 1.5 s. A bloom rises once, then holds.
- **ink** (the title entrance): each word goes from paper-deep to ink where it stands, quart-out over 0.6 s, 0.09 s
  apart. No translate at all (T43).
- **block** (key word): the sun block snaps in from the left, quart-out over 0.14 s, 0.25 s after the word starts; the
  word pops from 0.97 to 1 over 0.14 s *(from the source's caption skin)*.
- **rule:** hairlines draw left to right, expo-out over 0.9 s.
- **panel:** the yellow band wipes down, quart-out over 0.8 s. Light beams grow along their axis on the same curve.
- **tile:** each tile wipes down, quart-out over 0.4 s, 0.04 s apart.
- **lift** (jumbo numeral): rises out of a clip, expo-out over 0.9 s. It's the only thing that travels.
- **ray:** scattered rays grow from their source, expo-out over 0.8 s, 0.025 s apart.
- **out:** everything but the paper fades, cubic-in over 0.3 s, shorter than anything that enters.
- **Hero move:** one per shot: the bloom on covers, the panel on headlines, the beam in diagrams, the lift on numerals.
- **Holds:** at least 1.2 s after the last word lands. A landed line is dead still.
- Nothing bounces. No idle pulse on blooms.

## 7. Transitions and rhythm

- **Cuts:** the ground is the same paper, so a change is: the old frame fades in 0.3 s, a new bloom rises, words soak in.
- **Carriers:** a bloom may stay across a cut and become the next frame's sun, or swell to the yellow panel (ease-in-out,
  0.8 s) *(proposed)*.
- **Rhythm:** slow: shots of 3–5 s, one new thing per sentence. Swap the bloom's corner between shots; ember always
  opposite.

## 8. Finish

- No shadows, text shadows or corner radius. Depth is atmospheric only (the blooms).
- Grain at 0.015, only to stop the blooms banding *(proposed)*. No vignette, no glow beyond the blooms.

## 9. 3D look

None.

## 10. Banned

- Drop shadows, text shadows, rounded corners, bordered cards, borders over the hairline.
- A second text colour, bold Instrument Serif, inverted ink grounds.
- Mono in body or display; any substitute face.
- Crowding; a frame with no bloom or yellow surface; a headline blown edge to edge.
- Ember as a fill or as text, or stronger than 22%.
- Rows of three cards, KPI grids.
- Text that moves while it's read; pulsing or drifting blooms.
- Bounce, overshoot and linear easing.

## 11. Where it came from

- **HyperFrames frame preset Biennale Yellow (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on
  2026-10-31. Research notes: `docs/research/styles/hyperframes.md`, "Biennale Yellow". Rebuilt in Remotion; no code
  was copied. The fonts are SIL OFL.
- **Taken:** every palette hex, the bloom stops, the three faces and their roles, the display ramp at its source px
  (280, 0.86, −0.018em), the micro-label and rail tracking, the 78% block, the frames (cover, chapter, poster panel,
  strand list, ledger, manifesto), bloom, tile and panel elements, the page number, the hard yellow block and 0.97 pop
  from the caption skin, the banned list.
- **Proposed:** the whole motion grammar (from taste rules T36–T60), the muted and faint hexes, the 84 px margin, reading
  sizes for a phone, the 2 px hairline, the grain, the sample's footer cells (Subject, Medium, Blue, Red), the yellow
  beam and ink rays.
- **For vertical:** the source is a 16:9 deck. The cover stacks (display on top, footer in 2 × 2), the poster's side panel
  becomes a top band, the chapter numeral is centred, the ledger keeps 3 columns, and body type rises from about 16 px
  to 38 px.
- **BANNED-list note:** HyperFrames bans radial glows and cream serif looks for films without a brand; the blooms and
  parchment are this style's identity, so it's used on purpose, never as a fallback.
- **Kept apart from** Editorial Neuro (dark, Bodoni), Paper Launch (grotesk, product windows) and Swiss Poster (grey page,
  bars): one indigo ink and yellow light.
- Added to the catalog on 2026-11-06.
