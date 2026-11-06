---
name: style-calm-product-demo
description: Visual style "Calm Product Demo": calm premium product-demo look on a near-white canvas, one small centred Geist line the camera pushes into, a soft accent box sweeping behind the key word, clean rebuilt UI cards used by a slow cursor, blur-dissolves between scenes. Use when a video is made in this style.
---

# Calm Product Demo

## 1. In one line

Calm and premium, like a good product homepage demo: an airy near-white canvas, one short line at a time that the
camera pushes into, then a clean rebuilt UI used at real speed. It suits "how it works" explainers, feature
walkthroughs and product demos, and calm science facts told through a simple interface.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (canvas) | `#f7f7f8` | every frame, and the plain canvas between scenes |
| surface | `#ffffff` | UI cards, panels, inputs, popovers |
| text | `#111114` | title lines and UI text; the cursor fill |
| muted | `#8a8a94` | secondary labels, captions, the opening kicker |
| faint (border) | `#e7e7ec` | 1 px borders on surfaces, bar tracks, dividers |
| accent | `#2e6bff` | the single accent: ticks, the button, the key bar, rays in diagrams. At 18% it is the highlight box |
| accent2 (pale accent) | `#dce6ff` | the silk light bands on the open and the end card only *(proposed)* |

- The accent is the brand's colour when the video has one; everything else stays neutral.
- One accent per frame. A second data series is `muted`, never a new hue.

## 3. Typography

- **Face:** Geist 400 / 500 / 600 (Google Fonts). The source allows Inter or Geist, or the brand's own face.
- **Title lines:**
  - Regular weight (400), sentence case, tight tracking −0.02 em *(proposed value; the source only says "tight")*.
  - They grow through the camera, not the font size: the camera pushes until the longest line spans **75% of the
    frame width** (810 px). In practice that lands at 72–112 px; the cap is 112 px *(proposed)*.
  - One short line (two at most), about 8 words on screen *(proposed)*. Leading 1.14 *(proposed)*.
- **Emphasis:** one key word or short phrase gets the highlight box (accent at 18%) sweeping left → right behind it.
  Never bold, italic or a colour change on the word itself.
- **Proof numbers:** Geist 400 at 210 px, tracking −0.04 em, with the highlight box behind the number *(proposed
  sizes)*.
- **UI text:** body 32 px (400/500), labels 26 px, kicker 32 px muted *(proposed)*. The smallest text is 24 px.

## 4. Layout

- **Centred.** Lines are centred on the plain canvas with generous whitespace; the line's centre sits near y = 880–960.
- **Margins:** 96 px each side; UI cards are 888 px wide *(proposed)*.
- **Safe zones:** 230 px top, 330 px bottom.
- **Density rule:** never more than **one line of text plus one UI element** on screen. A text scene comes first, then
  a UI scene. The kicker on the open is the only exception.
- **UI framing:** the UI is cropped to the part that matters and shown big, filling most of the width.

## 5. Elements

- **Rebuilt UI:** clean vector surfaces that keep a real product's layout and labels, simplified to what the scene
  needs: white, 1 px `#e7e7ec` border, 28 px radius *(proposed)*, soft shadow
  `0 1px 2px rgba(17,17,20,.04), 0 14px 36px -14px rgba(17,17,20,.14)` *(proposed)*. Never a screenshot.
- **Input:** a large rounded input with placeholder text and suggestion chips under it; text types in at 25
  characters/s with a blinking caret.
- **Agent steps:** each step spins (accent arc on a faint ring), then becomes an accent check; a count like `2 of 3`.
- **Result cards** stack up; the far ones are blurred as depth of field. **Tables** fill row by row; a new column's
  cells shimmer before their value appears.
- **Popover** with reasoning: a small white card with a 30 px line and a muted 26 px line.
- **Cursor:** a generic arrow (48 px, text fill, white outline, small shadow). It glides on gentle curves, arrives a
  beat before it clicks, dips 12% on the press, and leaves a soft accent ripple (88 px, 22% → 0 over 0.55 s
  *(proposed)*). Hover states darken the control slightly.
- **Integration tiles:** rounded squares at several depths; near ones larger and slightly blurred, far ones small and
  sharp, all drifting with parallax. Neutral tiles with a name unless real logos are supplied.
- **Proof:** relative bars (14 px, 7 px radius, on a `faint` track), skeleton lines; a subtle dotted grid behind
  proof is allowed.
- **Silk light:** slow diagonal bands (−24°) of white → pale accent → accent, blurred 40 px, only on the open, the
  closer and the end card.

## 6. Motion

- **push** (camera into a line): easeInOutCubic over 1.0 s (source range 0.6–1.2 s), from 0.5× to 1×
  *(start scale proposed)*. The curve is stored as `cubic-bezier(0.65, 0, 0.35, 1)`, the usual CSS stand-in for
  easeInOutCubic.
- **pushSpring** (alternative camera move): source "heavily damped spring, z ≥ 0.95", taken at w = 14 rad/s,
  z = 0.95 → Remotion stiffness 196, damping 26.6, mass 1.
- **word:** each word fades in, easeInOutCubic over 0.45 s, 0.08 s apart *(proposed; the source gives no stagger)*.
- **highlight:** the box sweeps left → right over 0.5 s, easeInOutCubic, about 0.1 s after the push lands
  *(proposed)*.
- **typing:** 25 characters/s with a blinking caret; the camera rides the caret.
- **count** (proof numbers): `lerp(a, b, ease(...))`, easeInOutCubic over 1.2 s *(duration proposed)*.
- **tick:** the check settles on a spring w = 22, z = 0.95 → stiffness 484, damping 41.8, mass 1 *(proposed)*.
- **cursor:** easeInOutCubic between keys (0.8 s per move *(proposed)*), with a small perpendicular arc.
- **pull back:** after an action the camera pulls back over 1.0 s to show the whole screen for a beat, then glides on.
- **Holds:** a title line holds about **2 s** after it lands; **0.5 s** after each result. UI moments run at real
  speed. Nothing bounces.

Source spring numbers kept for reference: the explainer helper `spring(t, w = 14, z = 0.82)` (w 8 slow, 14 normal,
22 snappy; z = 1 means no overshoot). In Remotion terms stiffness = w², damping = 2·z·w at mass 1: checked against the
kit's `springAt()`, the curves are identical.

## 7. Transitions and rhythm

- **No hard cuts.** Each scene is its own layer with its own camera. The outgoing layer **blur-dissolves over
  0.3–0.4 s** (0.35 s, blur 16 px *(proposed)*) into the next one, which is already moving. A camera move (push, pull,
  glide) is the other option.
- **Timing budget** (60 s video): open 0–5 s, problem about 5 s, 3–4 feature chapters of about 10 s, optional proof or
  integrations, closer, end card 3 s. 45 s: 2–3 features of about 9 s; 90 s: 4–5 of about 12 s.
- **Sound:** an uplifting gentle bed at 100–110 BPM (soft piano or pluck), key ticks while typing, soft clicks, a tick
  per completed step, a soft whoosh on big camera moves, a chime on the end card.

## 8. Finish

- No grain, no vignette, no glow.
- Soft shadows only (values above); depth-of-field blur on far result cards and near integration tiles.
- Real motion blur in the final render: 4 sub-frames over a 180° shutter.

## 9. 3D look

None. Depth is faked with blur and parallax only.

## 10. Banned

- Busy backgrounds behind UI.
- More than one accent colour.
- Bouncy easing.
- Emoji.
- Big drop shadows.
- Glassmorphism.
- Invented metrics, users or testimonials (use relative bars and skeleton lines).
- Hard cuts between scenes.
- More than one line of text plus one UI element on screen.
- Screenshots of real apps; real logos unless supplied.
- Grain, vignette or glow.

## 11. Where it came from

- **Barty-Bart/motion-graphics, `skills/explainer-default/SKILL.md`** (MIT, © 2026 Bart), read through the research
  notes `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Calm Product Demo", and the skill's own text
  for the spring helper. Taken: the palette (canvas, text, secondary, surface, border, accent, highlight at 15–20%),
  Inter/Geist, the push-in to 75% width, the highlight sweep, the UI vocabulary, cursor behaviour, 25 chars/s typing,
  holds, blur-dissolves of 0.3–0.4 s, the timing budget, music and sound, the bans, motion blur.
- **Proposed:** every px size, the 28 px card radius and shadow values, the word stagger and fade, the highlight
  duration, the push's start scale, the dissolve blur, the tick spring, the silk band angle/speed and pale accent.
- **Changed for vertical:** the source is 16:9 with titles about 28 px that grow by camera push. Here the push still
  ends at 75% of the width, which gives 72–112 px lines on a 1080-wide frame; UI cards are 888 px wide and stacked
  in the middle of the frame instead of filling a wide screen.
- The demo GIF's brand (an orange accent) was not used: the accent here is the source's default blue.
- Added to the catalog on 2026-10-31.
