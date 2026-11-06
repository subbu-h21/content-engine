---
name: style-blockframe
description: Visual style "BlockFrame": maximal neobrutalism like a zine or 1990s sticker book; thick black borders, hard offset shadows with no blur, one candy pastel ground per frame cycling as the rhythm, huge uppercase Inter Black, label pills, star bursts and tilted stickers that slap down on a spring while opacity stays binary. Use when a video is made in this style.
---

# BlockFrame

## 1. In one line

Loud, cheerful neobrutalism: a zine, a 1990s sticker book, toy packaging. It suits playful product promos, feature lists,
kids' or creator brands and energetic socials. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (offwhite) | `#fffdf5` | the default ground |
| surface (white) | `#ffffff` | card fills; the close frame's border |
| text (black) | `#000000` | every border, every hard shadow, all structural text, the close frame's ground |
| muted, faint | `#000000` | there's no grey: body is black; the dot grid is black at 22% |
| accent (yellow) | `#f7cb46` | the CTA, the close frame's shadow, the stamp behind a key word, a cycled ground |
| accent2 (pink) | `#fe90e8` | a cycled ground, decorations |
| blue | `#c0f7fe` | a cycled ground, feature cards, decorations |
| green | `#99e885` | a cycled ground, stat frames, decorations |
| cream | `#ffdc8b` | a cycled ground (cover) |

The five pastels carry no meaning. One pastel ground per frame, cycled frame to frame: **the cycle is the rhythm**. On a
frame, pair a pink + blue + green trio or a cream + yellow warm pair. No sixth pastel. Exception for a sample: bars that
stand for blue and red light use the blue and pink pastels, as the nearest two.

## 3. Typography

- **Inter** 500 (body), 700/800/900 (display). **Space Grotesk** 600/700 (labels and counters).
- **Sizes at 1080×1920** *(proposed: the source's cqw sizes are for a 16:9 slide; these keep its ratios for a phone)*:

  | Role | Size | Leading / tracking |
  |---|---|---|
  | display, Inter 900 uppercase (≤ 3 words) | 184 px | 0.95 / −0.03em |
  | heading-lg, Inter 900 uppercase (4–6 words) | 124 px | 1.06 / −0.03em |
  | heading-md, Inter 900 uppercase (7+ words) | 84–102 px | 1.08 / −0.03em |
  | stat numeral, Inter 900 | 330 px | −0.04em |
  | close title, Inter 900 | 158 px | 1.08 / −0.03em |
  | step title, Inter 900 uppercase | 64 px | 1.14 |
  | body, Inter 500 sentence case | 40 px | 1.32 |
  | label, Space Grotesk 700 uppercase | 28–30 px | 0.08em |

- **Smallest text:** 24 px.
- **Case:** display always uppercase and always negatively tracked. Body in sentence case.
- **Emphasis:** the hard yellow stamp behind a key word, or the key word on its own tilted sticker.
- **Words on screen:** about 8 in display type. The block is at most 842 px of text wide, inside its card.

## 4. Layout

- **Margins:** 60 px. Decorations may bleed off the edges.
- **Safe zone:** text stays inside 230 px top and 330 px bottom. The bottom band holds only decorations, so the frame
  never ends in an empty strip.
- **Lean left, comfortably dense:** an empty corner reads as broken. Nothing lines up perfectly: every card has a tilt.
- **For 9:16:** cover: title on top, stickers below. Cards stack, never in a row. Timeline: vertical, with connector
  bars, cards staggered left and right.

## 5. Elements

- **Cards:** white, 6 px black border, 12 px hard shadow to the bottom-right. Small cards: 4 px border, 6 px shadow.
  Border and shadow are coupled (the source's 4↔8 and 3↔4, scaled for a phone) *(proposed)*.
- **Label pill:** fully rounded, 4 px border, 6 px shadow, a pastel fill. It's the eyebrow on every region; a label is
  never plain text.
- **CTA:** a yellow button with a hard shadow.
- **Decorations (at least one per frame):** star burst (10 points), stripe block (45° black + pastel), flat pastel
  rectangles, tilted ±2–12°; stat cards alternate −2° / +2°.
- **Dot grid:** 2.4 px dots on a 32 px grid at 22% on every pastel ground *(proposed scale)*.
- **Deco dot:** 22 px, 4 px border: the only round shape.
- **Close frame:** black ground, white-bordered frame, 18 px yellow shadow, a pink star at the corner.
- **Diagrams:** chunky bordered arrows with hard shadows; molecules and objects are bordered squares.
- **Tilt stands in for depth.**

## 6. Motion

The source has no motion but its caption pop; the rest is *(proposed)* from the HyperFrames taste rules T36–T60. The
idea: stickers being slapped on a page. **Opacity is always binary:** a thing is there or it isn't.

- **slap** (stickers, stars, stripe blocks): appears at once at scale 1.4, twisted 7° past its tilt, and lands on a
  spring (damping 18, stiffness 360, mass 1: ratio 0.47). Hero move of a cover.
- **press** (cards): appears pressed flat onto its own shadow, then lifts up and to the left as the shadow opens, on a
  spring (damping 26, stiffness 420, mass 1: ratio 0.63).
- **drop** (display lines): T59's waterfall: each line appears at once 70 px low and rises into place, quart-out over
  0.2 s, 0.1 s apart.
- **pop** (pills): scale 0.86 → 1 over 0.2 s, `back.out(2.4)` as the bezier `[0.3, 2.2, 0.55, 1]` *(from the source's
  caption skin)*.
- **grow** (bars): width on a spring (damping 20, stiffness 260, mass 1: ratio 0.62).
- **count:** numbers count up, quart-out over 0.6 s.
- **wipe / out:** the next pastel wipes over the frame from the left: in cubic-in-out over 0.3 s, out cubic-in over
  0.2 s. Content never leaves on its own.
- **Holds:** at least 0.9 s after the last sticker. Landed things are dead still.

## 7. Transitions and rhythm

- **The ground cycle:** every change is a hard-edged pastel wipe: cream → blue → pink → green → yellow → black close.
- **Beat:** short shots of 1.5–3 s, one region per beat, the order always pill → main card → sticker.
- **Direction:** wipes always travel left to right.

## 8. Finish

None: flat colour. Hard black shadows, down and right, with zero blur. No gradients, no grain, no glow.

## 9. 3D look

None. Tilt stands in for depth.

## 10. Banned

- Rounded corners (except the label pill and the deco dot); blurred shadows.
- Coloured borders (white only on the black close frame); a sixth pastel.
- Sentence-case display; untracked display; labels as plain text.
- Perfect alignment; empty corners; edge-to-edge headlines.
- Gradients, grain, glow, grey type.
- Three cards in a row: cards stack and stagger.
- Fades: opacity is binary.
- Landed things that keep wobbling.

## 11. Where it came from

- **HyperFrames frame preset BlockFrame (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "BlockFrame". Rebuilt in Remotion; no code was copied. Inter and
  Space Grotesk are SIL OFL.
- **Taken:** every hex, the pastel cycle as the rhythm, the faces and roles, tracking and leading, card, pill, star,
  stripe, dot-grid, tilt and close-frame rules, the yellow stamp and the 0.86 pop from the caption skin, the banned list.
- **Proposed:** the whole motion grammar, sizes for a phone, the 6/12 and 4/6 borders, the sample's arrows and bars.
- **For vertical:** type is much larger than the slide's, stickers fill the bottom band, the feature row becomes
  stacked, staggered cards, the timeline runs down the frame. The source's three-card row isn't used.
- **Note:** Inter and Space Grotesk are on HyperFrames' "where generated design lands" list; here they're the preset's
  chosen voice, at weights and sizes no default uses.
- **Kept apart from** Memphis (a tabletop model with halftone shadows), Game Show (characters, telops) and Red Card
  Kinetic: black-bordered stickers on a cycling pastel page.
- Added to the catalog on 2026-11-06.
