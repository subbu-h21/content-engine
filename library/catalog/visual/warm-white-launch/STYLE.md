---
name: style-warm-white-launch
description: Visual style "Warm White Launch": a one-take consumer-app launch look on warm white with black UI and a lime accent; an iridescent glow round a composer box, typed questions on fixed lines, lime chat bubbles, a lime flood that fills the frame on the drop and carries a dark result card, a black outro page with big white words, a route with a running orange dot, and a soft serif for the name. Use when a video is made in this style.
---

# Warm White Launch

## 1. In one line

Friendly, fresh and quick, like a launch film for a consumer AI app: one continuous 2D take on warm white where each
scene grows out of the last, with lime ripples and floods carrying the eye. It suits assistant and chat stories,
app launches, ordering/booking flows, and question-and-answer facts.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (canvas) | `#f5f5f2` | the warm-white base |
| text (UI black) | `#0e0e10` | text, buttons, dark result cards, the outro page, the phone bezel |
| surface | `#ffffff` | the composer box, reply bubbles, light cards *(proposed)* |
| muted | `#86868a` | placeholders, sub-lines *(proposed)* |
| faint | `#e4e4df` | hairlines, the route's track *(proposed)* |
| accent (lime) | `#cdf24f` | the ripple, the flood, sent bubbles, the key word's mark, the key pill |
| accent2 (orange) | `#ff6a2a` | the secondary accent: the running dot and the mark it becomes |
| send | `#2f6bff` | the blue send button only (and the caret) |
| AI glow | pink `#ff5fa2` → orange `#ff6a2a` → lime `#cdf24f` → cyan `#4fd8f2` → violet `#8a6bff` | only inside the composer's glow *(pink, cyan and violet hexes proposed; the source names the hues)* |

## 3. Typography

- **UI:** Geist 400 / 500 / 600 (Google Fonts), tracking −0.02 em.
- **Typed request:** on **fixed lines** (up to three), so the camera never chases a wrapping caret; 66 px in the
  composer *(proposed)*; a blue caret.
- **Outro lines:** 92 px, white on black, word by word (72 px for long captions *(proposed)*).
- **End card name:** a serif (the source names none): **Fraunces** 600, with the emphasised word in Fraunces italic
  500, 128 px *(proposed)*.
- **Chat bubbles:** 26 phone px (38 px on screen at the phone's 1.45× scale *(proposed)*); labels 30 px.
- **Emphasis:** the key word sits on a lime mark (inside a bubble) or in a lime pill.
- Smallest text 24 px on screen.

## 4. Layout

- **Centred** objects with generous warm-white space; margins 90 px *(proposed)*.
- **Phone:** a 428 × 900 screen with an 11 px black bezel and a `9:41` status bar (generic, no real OS chrome),
  shown at 1.45× in vertical.
- **Result cards:** 330 × 440, radius 28, dark, picture on top, then name, one-liner and details (shown at 2× in
  vertical).
- **Composer:** 880 × 430, radius 44 *(proposed; the source gives no size)*, the glow 26 px beyond its edge.
- **Safe zones:** 230 px top, 330 px bottom.

## 5. Elements

- **The glowing composer:** a white input box with a blurred conic gradient (pink, orange, lime, cyan, violet)
  rotating round it, a `+` button and the blue send button.
- **Chat:** the question as a lime bubble on the right, answers as white bubbles on the left.
- **"Thinking" moment:** an object doing the thinking on beats (in the source a wok tossing ingredients) under
  shimmering text such as `Finding something for you…`.
- **Card strip** with a lime pill on the best one (`Best match` in the source; `Key idea` here), dark cards with a
  drawn picture (previews never use real photos).
- **Two pills:** one black, one outlined.
- **A spinner, then `✓ Done`-style confirmation.**
- **The route:** a dot (orange, white rim) runs along a route to a pin; stops pop their cards as it passes; the dot
  then becomes the brand mark.

## 6. Motion

- **Camera:** one eased move per scene (`camera`, easeInOutCubic over 1.2 s *(proposed)*), keyed as
  `[time, zoom, x, y]` with **zoom interpolated in log space**. The first push is about **3×** into the composer.
  Never zoom in and out back to back, never reverse direction.
- **pop / settle** (bubbles, cards, pills, the mark): closed-form springs, values not given; pop w 16, z 0.8 →
  stiffness 256, damping 25.6; settle w 14, z 0.95 → 196 / 26.6 *(proposed)*.
- **flood:** the lime flood fills the frame in about **0.35 s** (`cubic-bezier(0.7, 0, 0.2, 1)` *(curve proposed)*),
  overscaling past every corner.
- **ripple:** the lime ring on send, expo-out over 0.6 s *(proposed)*.
- **word** (outro): each word rises 24 px and fades in over 0.3 s, a quarter-beat apart *(proposed)*.
- **typing:** 22 characters/s *(proposed)*.
- **route:** the dot runs the route on easeInOutCubic over 1.6 s *(proposed)*.
- **Glow:** turns a quarter turn per second *(proposed)*.
- **Holds:** never longer than 1 s.

## 7. Transitions and rhythm

- **One take:** each scene grows out of the last. No crossfades, no blur-ins.
- **Shared-element handoffs:** the lime flood carries a copy of the bubble's words; a button carries its label into
  the next page; the running dot becomes the mark.
- **Tempo:** 130 BPM, 32 beats (14.8 s); the song starts 12 beats before its drop. Beat map: ask (0–6), send with a
  lime ripple and a pull-back revealing the phone (6), think (6–12), the drop with the lime flood (12), chat
  (16–21), outro (21–32).
- **Sound:** one SFX per event placed by its measured peak; master at −14 LUFS.

## 8. Finish

- The iridescent composer glow is **the only glow** (blur 34 px, 26 px beyond the edge *(proposed)*).
- Motion blur in the final: 8 sub-frames ("four sub-frames leave ghost copies on fast moves").
- No grain, no vignette.

## 9. 3D look

None (3D is banned).

## 10. Banned

- Crossfades and blur-ins.
- 3D.
- Particles.
- Camera moves that reverse, or zooming in and out back to back.
- Holds longer than 1 s.
- Any glow but the composer's.
- A template feel.
- Real food, product or brand photos in previews (draw illustrations).

## 11. Where it came from

- **A creator's app launch-film prompt on prompt-motion.com** (https://prompt-motion.com/ultimaxbt-2ddf1e), read
  through `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Warm-White Lime Composer Launch"; the
  run's contact sheet was looked at. **Licence: none stated; the prompt belongs to its creator.** Its rules are
  described here in our own words; no prompt text, code, photos, product names or brand are used.
- **Taken (as values and rules):** canvas `#f5f5f2`, UI `#0e0e10`, lime `#cdf24f`, orange `#ff6a2a`, send `#2f6bff`,
  the glow's hue order; Geist; a serif for the name; 92 px outro lines word by word; typed text on fixed lines; the
  phone and card sizes; the elements (composer, bubble, thinking object, card strip with a pill, two pills, spinner and
  check, route and dot that becomes the mark); one eased camera move per scene in log-space zoom, the ~3× first push,
  no reversing; the ~0.35 s flood; 130 BPM and the beat map; shared-element handoffs; −14 LUFS; 8-sub-frame motion
  blur; the bans.
- **Proposed:** the muted, faint and surface hexes; pink, cyan and violet hexes; Fraunces as the serif; every px size
  not listed above; the composer size; all spring and ease values; typing speed; glow blur and speed.
- **Changed for vertical:** the source is 1920 × 1080. The phone and cards are scaled up (1.45×, 2×) and stacked in
  the middle of the frame; long outro captions drop to 72 px; the food story is replaced by the sample's science
  (the thinking object and the photo cards become drawn diagrams).
- **Note on the source section:** the request named this "prompt-motion entry 10"; counting the research note's style
  sections, entry 10 is "Liquid-Glass Keynote One-Take". The name "Warm White Launch" matches "Warm-White Lime
  Composer Launch", so that section was used.
- Added to the catalog on 2026-10-31.
