---
name: style-clean-launch
description: Visual style "Clean Launch": a Swiss-clean launch film. Near-black ink on pure white, one red accent that only ever means "now", a red now-dot that travels through every shot (a full stop, a decimal point, the thing happening), big tight statements of five words or fewer that slam in on a 120 BPM grid, mist windows with rebuilt UI. Use when a video is made in this style.
---

# Clean Launch

## 1. In one line

Confident and exact, like a product launch film from a design-led company: white paper, black type set tight, and a
single red dot that is always where the action is. It suits launches, teasers, feature videos, logo stings and UI
walkthroughs, and short punchy facts.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#ffffff` | every frame |
| surface (mist) | `#f4f5f7` | windows and secondary surfaces |
| text (ink) | `#0b0b0c` | every statement, UI text, strokes, filled bars; dark surfaces |
| muted (mute) | `#8a8d96` | descriptors and secondary text; the compared (lesser) bar |
| faint (line) | `#e3e4e8` | hairlines, window borders, idle tracks |
| accent (red) | `#ec2a3a` | only for "now" or "just happened": the now-dot, a word while it arrives |

- **Red means now, nothing else.** It covers at most 8% of the pixels, and floods the frame at most once per film
  (the opening iris).
- **New things arrive in red and relax to ink** within 0.17–0.5 s of landing (0.4 s here). In a still, everything
  but the now-dot is ink.
- **Neutrals stay cool.** Never warm greys, cream or beige.
- **Shadows:** `0 30px 90px rgba(0,0,0,.16)` (the range is 0 20–40 px 60–120 px at 12–22%). Dark surfaces get a 1 px
  top hairline at 10% white.

## 3. Typography

- **Face:** Schibsted Grotesk, 600 for statements and 500 for descriptors and UI *(proposed: the worked example used
  Geist; a different clean grotesk keeps this style apart from the catalog's Geist styles)*. One face, two weights,
  tabular figures.
- **Sizes:**
  - statements 140 px, titles 112 px (the source: 88–128 px statements, 120 px feature lines);
  - a standalone hero word 290 px (2–5× the line, 14–48% of the frame height); the hero number 360 px (19%);
  - emphasis inside a line 1.6× (1.5–1.7×);
  - descriptors 44 px / 500 / mute; UI 32 px minimum (the source's vertical minimum).
  - Lower a statement's size so its longest line fits the 888 px column.
- **Tracking:** −0.05 em for statements, −0.055 em for hero words and numbers, −0.01 em for descriptors, −0.005 em for
  UI. One tracking value per role. **Leading** 0.98 (0.95–1.05).
- **Case:** sentence. No italic, no serif, no all-caps.
- **Words:** at most 5 words a line, 2 lines a shot, one line at a time. A whole launch film says 20–35 words.
  Open inside the problem, pay off the film's own words, never use a feature name as a headline or stock phrases
  ("seamless", "unlock", "AI-powered", "streamline").
- **Smallest text:** 32 px.

## 4. Layout

- **Margins:** 96 px at the sides (888 px column). **Safe zone:** 230 px top, 330 px bottom; the content mass sits
  in y 270–1500.
- **Alignment:** left for statements and descriptors; centred for the end lockup.
- **The hero covers 40–70% of the frame.** No empty region bigger than about a quarter of the frame; no small
  floating cards (under ~40% of the width); no "text left, UI card right".
- **Windows** are centred at 84% of the width (70–92%), radius 28, 48 px padding.
- **The end lockup** spans 28–45% of the width, centred.

## 5. Elements

- **The now-dot** (the story device): a red disc, 44 px next to a 140 px statement (0.15 em of the type it sits with,
  64 px as an object). It never leaves the film: it opens the film as an iris, sits as a full stop, becomes a decimal
  point, marks the current step, is the thing happening in a diagram. Never a decoration, never two at once.
- **Windows:** mist, 1 px line-grey border, radius 28, the soft shadow. Inside: rebuilt UI only (labels, tracks,
  handles, bars), never a real product's screen or logo.
- **Tracks and handles:** 8 px tracks (line grey, ink when selected), 40 px white handles with a 3 px ink ring.
- **Bars:** 18 px, radius 9, on a line-grey track; the lead bar ink, the compared bar mute.
- **Diagram strokes:** 6 px ink, round caps.
- **Every element has a job:** no ornaments, rules or labels for their own sake.

## 6. Motion

Cinetic's tokens, about three easing characters per film:

- **out** `[0.16, 1, 0.3, 1]` for arrivals; **outSoft** `[0.22, 1, 0.36, 1]` for windows; **in** `[0.7, 0, 0.84, 0]`
  for implosions and the iris; **exit** `[0.55, 0.055, 0.675, 0.19]` into a cut; **inOut** `[0.87, 0, 0.13, 1]`
  whips; **smooth** `[0.65, 0, 0.35, 1]` drifts and 10–14 f fades; **ui** `[0.4, 0, 0.2, 1]` controls; **cam**
  `[0.48, 0.1, 0, 0.9]`; **glide** `[0.47, 0.2, 0.15, 1]` for the dot travelling.
- **Duration = 0.35 s + 1.35 ms per pixel travelled** (a 60 px slam is 0.43 s; a 120 px window rise 0.51 s). Camera
  moves 0.6–2.4 s; the slowest move is at least 3× the fastest.
- **Springs** (damping / stiffness / mass): snap 18 / 260 / 0.7, pop 11 / 180 / 0.6 (landings only), soft 26 / 120 / 1,
  heavy 30 / 90 / 1.4. Overshoot 1–7% only on a true landing, at most twice per film (the now-dot's pop).
- **Slam** (statements): words land batched within 0.03 s, rising 60 px on `out`; a 7 px blur clears in 0.1 s; the
  word arrives red and relaxes to ink over 0.4 s.
- **Descriptors:** 30 px rise, 5 px blur for 0.1 s, in mute.
- **Iris:** frame 0 is red; the now-dot shrinks from covering the frame to its size in log space by 0.5 s.
- **The dot travels** with `glide` and pops on landing.
- **Shape settles before position:** a shape lands 6 frames (0.1 s at 60 fps) before its position does; secondary moves
  start at 55–75% of the leading move.
- **Speeds** (60 fps): text being read ≤ 3 px/frame; travelling labels < 20 px/frame; motion blur above 12 px/frame.
- **Camera creep:** a hold never fully stops: the frame creeps (≤ 6%, linear) or pushes 10–20% on a long lockup. In
  the previews the content creeps 3% over 8 s.
- **Holds:** resolved text holds ≥ 0.6 s + 0.1 s per word; text that hasn't resolved never leaves. Nothing static
  over 0.8 s, except a freeze ≤ 0.25 s on a silence and one near-still hold of 1–1.6 s per film.

## 7. Transitions and rhythm

- **Grid:** 120 BPM (beat 0.5 s, bar 2 s). Section changes on downbeats, cuts on eighths (0.25 s), batched landings on
  sixteenths. The picture changes one frame before its cue; a pulse peaks two frames after its sound.
- **Density:** 45–60 events per 30 s; one motion peak per bar with 0.5–1.2 s of calm between; the first 6 s twice as
  dense as the middle; the biggest peak at 75–90% of the runtime; a designed 1–4 s lull at 55–85%.
- **Shots:** median 1–1.5 s, at least 0.4 s; continuous takes 5–9 s with a beat inside at least every 1.2 s.
- **Hook:** frame 0 composed and moving; something changes about every 0.5 s; the problem felt by 1 s and stated by
  2 s; the subject named by a quarter of the runtime.
- **Acts:** hook → turn → proof (1–2 capabilities) → promise → lockup. End card 1.5–2.5 s (assembling over 1–1.3 s,
  holding 0.6–1.3 s); a URL readable ≥ 1.7 s; a logo once, at the end, ≤ 12% of the runtime.
- **Seams:** 6–8 kinds per film, each used at most twice, plus one signature move from the now-dot used three times
  (open, middle, close): relay hand-off (the dot crosses the cut untouched), container morph, iris, implosion,
  shutter collapse, split on a seam, velocity-matched cut, zoom-through, partial slide (±230 px), word waterfall,
  exit-reverses-entrance, words-become-the-mark. Properties never jump at a cut.
- **Crossfades:** never the default, never through black.

## 8. Finish

- Grain off (or global at 1.5–2%), no vignette, no glow, halo or bloom.
- 60 fps where the platform allows; H.264 yuv420p BT.709. At 30 fps every frame count above halves.
- Sound: every sound is caused by something visible; the idea reads with the sound off; −14 LUFS.

## 9. 3D look

None.

## 10. Banned

- Eyebrow or kicker labels, stacked taglines, "Introducing…", text walls, filler, decorative mono captions, fake
  metrics.
- More than 5 words a line or 2 lines a shot.
- Serif type, italic or faked oblique.
- Orange, amber, beige, cream, tan or sand as an accent, paper or glow; purple, violet or indigo; multi-hue or
  purple-to-blue gradients.
- Neon, glow, bloom, halos, glassmorphism.
- Emoji, stock icons, AI sparkles, particles, confetti, lens flares, code rain.
- Red on anything that isn't happening now; red over 8% of the pixels; more than one red flood per film.
- Bouncy overshoot except on true landings.
- Transition presets (glitch or RGB split, light leak, film burn, swirl, ripple, dreamy zoom, flash through white,
  page burn); crossfades as a default or through black.
- Linear easing except for drift.

## 11. Where it came from

- **Cinetic** (the "tessel" skill bundle), from the AI × Leaders prompt library
  (https://ai-x-leaders.com/en/prompt/video/revid-2104148233106723099/) and `references/transitions.md` from
  https://github.com/Leonxlnx/cinetic, researched in `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section
  "Cinetic Clean Launch (the tessel bundle)". Licence: MIT. Read on 2026-10-31 (the first 200,000 of 712,445
  characters of the bundle plus the transitions reference).
  - Taken: the worked example's palette (paper, mist, line, mute, ink, red) and its accent rules; the shadow and
    hairline values; type sizes, weights, tracking, leading and the copy rules; the layout rules (margins, content
    band, hero share, window width, lockup width); the story-device rule and the red now-dot; every easing token,
    spring, the duration formula, speed limits and holds; the beat grid, density, shot lengths, hook, acts, seams and
    bans; the finish.
  - Not taken: the worked example's brand mark (three block primitives) and its name.
- **Changed for vertical:** the source is 1920×1080 at 60 fps. Statements keep the source's sizes (140 px is
  slightly above its 128 px because a 1080 px column with five words a line has room); UI text uses the vertical
  minimum of 32 px; windows are 84% of the width; the content mass sits in y 270–1500. Frame counts in the source
  are at 60 fps; the seconds above are the same timings.
- *(Proposed):* Schibsted Grotesk instead of the example's Geist; descriptor weight 500 (the source's 460 isn't a
  shipped weight); the 0.4 s relax; the 3% creep in the previews; the hero sizes (290 px word, 360 px number); the
  sample scenes (the iris title, the wavelength range window, the molecule as the now-dot, the dot as a decimal
  point, the three-stop track).
- Added to the catalog on 2026-10-31.
