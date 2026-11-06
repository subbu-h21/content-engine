---
name: style-editorial-neuro
description: Visual style "Editorial Neuro": calm editorial explainer on an ink ground, one bone text colour, Bodoni headlines with italic emphasis, quiet Inter labels on pills, ember/ice accents only in diagrams. Use when a video is made in this style.
---

# Editorial Neuro

## 1. In one line

Quiet and editorial, like a science magazine at night. It suits explainers, science and facts, especially over dark
3D plates (anatomy, objects, phones). It's the engine's original look.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (ink) | `#08070a` | the ground of every frame; scrims and pill fills are ink at lower opacity |
| text (bone) | `#ede3d1` | every headline and label: the only text colour |
| muted (ash) | `#857d78` | eyebrows, chapter markers, body copy |
| faint (dim) | `#4d4847` | guides, inactive rings and bars |
| accent (ember) | `#ff6b29` | diagram highlights only, never type |
| accent2 (ice) | `#94d1ff` | the second diagram colour, never type |

## 3. Typography

- **Headlines:**
  - Bodoni (Bodoni MT when installed, otherwise Bodoni Moda from Google Fonts), weight 400.
  - Sentence case. Emphasis is *italic*, in the same colour.
  - Sizes: titles 124 px, headlines 104 px. Lower the size so the longest line fits the 888 px column; never shrink
    below 64 px.
  - About 10 words on screen at most, 1–3 lines, leading 1.04.
- **Body and labels:**
  - Inter (Inter 18pt when installed), 400/500.
  - Sizes: body 32 px at line height 1.35, labels 28 px, eyebrows 24 px with 1.5 px tracking.
  - The smallest text is 24 px.
- **Numbers:** Bodoni at 260 px; the unit is in italic.

## 4. Layout

- **Margins:** 96 px each side, so the column is 888 px.
- **Safe zone:** 230 px at the top and 330 px at the bottom.
- **Alignment:** left-aligned; centred only for end cards.
- **Position:** the first headline line sits around y = 420–560. Body copy goes 80–100 px under the headline.
- **Type stays in the dark band,** never over a bright or busy part of the picture. Over pictures, a top scrim of ink
  fading to clear sits behind it.
- **One idea per frame,** with lots of empty ink.

## 5. Elements

- **Chapter marker:** `01  —  Title` as an eyebrow at the safe-top line. A 140 px bone rule draws in under it at 22%
  opacity.
- **Labels:** mixed case, on quiet ink pills (ink at 72%, 10 px radius, 16 px side padding). They're joined to their
  point by a thin bone leader line (1.4 px, 55%) that reaches out first, then a 40 px tick and the pill.
- **Diagrams:**
  - thin bone lines (1.4–3 px) and small filled dots;
  - rings at 18–50% opacity;
  - ember and ice only for the thing that matters (the highlighted node, the signal, the bar being compared).
- **Bars:** 6 px tall, with a track of bone at 12%.
- **Images:** 3D plates fill the frame, and type sits on the scrim above them.

## 6. Motion

- **rise** (headlines): each word fades in and rises 18 px, expo-out over 0.55 s, with 0.09 s between words.
- **eyebrow:** fades in sliding 10 px from the left, expo-out over 0.5 s. **rule:** the line under it draws in,
  expo-out over 0.9 s.
- **leader** (labels): expo-out over 0.6 s. The line reaches its point at about 60%, then the tick and pill appear.
- **count** (numbers): counts up with expo-out over 1.4 s, and bars fill along with it.
- **out:** fades out with expo-out over 0.35 s, faster than anything enters.
- **Holds:** at least 0.8 s after the last word lands.
- Nothing bounces, and nothing moves linearly.

## 7. Transitions and rhythm

- **Changes:**
  - scene changes are soft: what leaves fades out, and the next thing rises in;
  - cut on the narration line, with one new thing per sentence;
  - 3D plates change with the camera, not with wipes.

## 8. Finish

- Grain at 0.035 (overlay).
- Vignette at 0.42 (an elliptical falloff from 55%).
- An ink halo behind type: four soft ink shadows at 2, 6, 14 and 28 px.
- No glow or bloom on 2D. Bloom only comes from the 3D plates.

## 9. 3D look

Used with Blender plates:
- **Materials:** dark, softly lit subjects (tissue, devices).
- **Ground and light:** the ink ground continues into the 3D world; light is low-key with rim light.
- **Camera:** slow, deliberate moves.
- **Colour:** bloom is added when the plates are encoded.

The engine's library (`library/blender`: brain, phone) is built for this look.

## 10. Banned

- A second text colour, or colour on type.
- Accent colours outside diagrams.
- Bold or all-caps headlines.
- Glows, drop shadows or gradients on type (only the ink halo).
- More than about 10 words of headline on screen.
- Type over a busy or bright part of the picture.
- Emoji or stock icons.
- Bouncy or linear easing.

## 11. Where it came from

- **The engine's default look** (`template/src/lib/theme.ts` and the components Headline, Text, Leader, Diagrams,
  Finish). It was first made for the phone reel (project 3, rebuilt as project 4). All values are taken from that
  code; nothing is *(proposed)*.
- Added to the catalog on 2026-10-31.
