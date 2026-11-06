---
name: style-cartesian
description: Visual style "Cartesian": a quiet museum catalogue drawn with compass and rule; warm stone, thin Playfair Display, taupe hairlines and faint compass rings that draw themselves round, words traced on left to right, one ink rule and no colour at all, sparse and breathing. Use when a video is made in this style.
---

# Cartesian

## 1. In one line

A quiet museum catalogue: pencil on tracing paper, warm stone, thin serif, hairlines and compass rings. Sparse and
breathing. It suits architecture, design, luxury, heritage and calm documentary explainers. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background | `#ede8e0` | ground |
| surface | `#e2dbd1` | the only secondary fill: placeholders, photo frames |
| text | `#1a1a1a` | headlines; the one ink accent rule |
| muted | `#5a5a5a` | body |
| faint (line) | `#b8b0a4` | structural lines; the quote mark |
| accent (taupe) | `#8a8178` | labels, numerals, small text, rings and hairlines at phone size, the active caption word's underline |
| accent2 (line) | `#b8b0a4` | there's no second accent |

No populist accent (no red, blue or green), even when the subject is colour. To emphasise: grow the type, switch sans to
serif, or add the one ink rule. A card's fill is `rgba(255,255,255,0.3)`.

## 3. Typography

- **Playfair Display 400** for all display: never bold, never uppercase, italic only for emphasis. **Inter** 400/500 for
  body and labels.
- **Sizes at 1080×1920** (display keeps its source px; the rest are raised for a phone *(proposed)*):

  | Role | px | Notes |
  |---|---|---|
  | display (≤ 3 words a line) | 154 | leading 1.06 |
  | h1 | 124–140 | |
  | h2 (4–6 words) | 100–112 | leading 1.12 |
  | h3 (7+ words, rows) | 60–72 | leading 1.22 |
  | stat figure | 176 | stays modest: there's no hero numeral |
  | row numeral, taupe | 84 | |
  | body, Inter 400, grey | 36 | line height 1.5 |
  | label, Inter 500, uppercase, taupe | 26 | 0.12em (3 px) |

- **Smallest text:** 24 px.
- **Words on screen:** about 8 in Playfair.

## 4. Layout

- **Margins:** 96 px *(proposed; the source's 7 cqw scaled up a little)*.
- **Safe zone:** 230 px top, 330 px bottom.
- **Empty:** declarative frames are 55–60% empty. There's NO dense frame; even a list breathes.
- **Alignment:** cover, rows and text lean left; the closer is centred.
- **For 9:16:** the headline goes on top with the ring below; columns stack; a timeline becomes a vertical list.

## 5. Elements

- **Hairline:** 1.5 px *(proposed: the source's 1 px is too faint on a phone; it stays under the 2 px ban)*, the universal
  separator.
- **Compass ring:** solid plus an inner dashed ring at 76%, opacity 0.4–0.6 *(raised a little for a phone)*, one or two
  per frame.
- **Ink rule:** about 200 px × 1.5 px in ink, used sparingly: one per frame at most.
- **Vertical guide:** a drafting line 54 px from the left edge at 0.38 opacity.
- **Ringed circle:** a 74 px-radius ink ring holding a Playfair symbol or numeral.
- **Agenda row:** a taupe numeral left, an ink label right, over a hairline.
- **Rail:** one rule with ticks, no nodes or dots.
- **Image placeholder:** a stone fill with a ±30° taupe X, wherever a real picture will go.
- **Figures** are compass constructions: true proportions where there's a ratio (the sample's rings are 5.9 to 1).

## 6. Motion

The source has no motion but a caption pop and a note of a 0.6 s fade; everything here is *(proposed)* from the HyperFrames
taste rules T36–T60. The idea: the page drawn by hand, slowly. Nothing is under 0.5 s except the leave.

- **compass:** a ring draws itself round from the top, sine-in-out over 1.6 s; the dashed ring fades in after it.
- **rule:** hairlines draw from their first point, expo-out over 1.1 s. The guide is ruled first.
- **trace** (Playfair): each line is traced on from left to right by a soft 14% edge, cubic-in-out over 0.9 s, 0.2 s between
  lines. Nothing moves: only the edge does. A traced word stays still.
- **fade** (labels, body): quart-out over 0.7 s.
- **out:** the drawing fades off the sheet, cubic-in over 0.45 s; the stone stays.
- **Captions:** the active word gets an 18% taupe wash and a hairline underline, scale 0.985 → 1 in 0.2 s *(from the
  source's caption skin)*.
- **Holds:** at least 1.4 s.
- **One hero move:** the ring, or the trace; never two at once. Nothing bounces.

## 7. Transitions and rhythm

- **Cuts:** a slow dissolve is allowed here: the drawing fades, stone stays, and the next ring begins. Better: the last
  ring stays and the next drawing is constructed on it *(proposed)*.
- **Rhythm:** slow: 4–7 s a frame, with a still breath before each new line.

## 8. Finish

Flat. No shadow, gradient, grain, vignette or glow. No rounded rectangles: circles only. Depth is only implied by the
rings.

## 9. 3D look

None.

## 10. Banned

- A populist accent, even when the subject is colour.
- Bold Playfair; taupe headlines; uppercase Playfair.
- Borders of 2 px or more; shadows, elevated cards, rounded rectangles.
- Crowding; more than 2 compass decorations; edge-to-edge headlines.
- A hero numeral.
- Bounce, overshoot, anything fast.
- Three cards in a row.
- Text moving once it's traced.

## 11. Where it came from

- **HyperFrames frame preset Cartesian (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "Cartesian". Rebuilt in Remotion; no code was copied. Playfair
  Display and Inter are SIL OFL.
- **Taken:** every hex, the no-accent rule, the faces, the display and h1 sizes, labels, hairline, compass rings (solid plus
  inner dashed), ink rule, vertical guide, ringed circle, agenda row, rail, placeholder, frames (cover, closing, rows),
  the caption wash, the banned list.
- **Proposed:** the whole motion grammar, the 96 px margin, the 1.5 px hairline, reading sizes, slightly stronger ring
  opacities, and the sample figures: the construction with N₂ (nitrogen, the main gas in air), the 5.9 : 1 rings.
- **For vertical:** headline on top, ring below; the two-column frame stacks; the timeline's rail is kept for the spectrum
  only; body rises from about 19 px to 36 px.
- **BANNED-list note:** HyperFrames bans the cream serif kit for films without a brand. Here the compass drawing is the
  point: there are no pills, no mono, and it's used on purpose.
- **Kept apart from** Biennale Yellow (yellow light, indigo ink, huge serif), Engraving and Blueprint: monochrome stone,
  compass rings, no colour.
- Added to the catalog on 2026-11-06.
