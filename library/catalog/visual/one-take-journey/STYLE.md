---
name: style-one-take-journey
description: Visual style "One-Take Journey": one unbroken shot on a near-black dot-grid world; a single bright white ball bounces on the beat through dark system-UI stations (messages, notifications, sliders, checklists, buttons) that react to it, the camera following tightly, then pulling out with a tilt to reveal the whole course. Words live only inside the stations. Use when a video is made in this style.
---

# One-Take Journey

## 1. In one line

Playful and satisfying: one continuous take in which a white ball travels through a chain of little UI "stations"
that react to it, the camera riding along. It suits loopable process explainers, "how it works" chains, workflow
stories and social loops of 10–30 s.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (canvas) | `#0c0c0e` | the world |
| faint (dot grid) | `#1e1e22` | the dot grid that moves with the camera |
| surface | `#1c1c1f` | station cards |
| surface2 | `#2c2c2e` | raised surfaces: key caps, tracks, input fields, inactive knobs, empty rings |
| text | `#f2f2f7` | station names and messages |
| muted | `#8e8e93` | the state after the dot, sub-labels, `now` |
| accent | `#0a84ff` | fills, toggles on, track fill, sent bubbles, checks, reactions (the brand's colour) |
| accent2 (hero) | `#ffffff` | the hero ball: always the brightest thing on screen |
| lightCanvas | `#f2f2f4` | the canvas of the light variant (for a light brand; then the hero is the accent) |

## 3. Typography

- **Face:** Inter 400 / 500 / 600 (Google Fonts), standing in for the system face (the source: Inter or Geist).
- **Station labels:** `Name · state` at 30 px: the name in text 600, `· state` in muted 400. The state changes when the
  hero arrives (`Waiting` → `Scatters blue light`, `Ready` → `Done`, `2 of 3` → `3 of 3`).
- **Inside stations** *(sizes proposed)*: notification titles 36/600, body 40/400 at 1.25 leading, messages 52/400,
  big readouts 140/600 (−0.03 em), sub-labels 26–30 muted, tooltips 30/600 dark-on-light.
- **No headlines, no captions, no explanatory overlays.** Every word belongs to a station and is written with a little
  wit (`Name · state`). About 12 words in view at most.
- Smallest text 24 px.

## 4. Layout

- **The world** is about 3× the frame, with stations in visiting order on a zig-zag path; each station stays in a
  fixed spot for the whole video. For vertical the path runs mostly downward (side-on gravity): stations stack in a
  staircase, each offset sideways from the last.
- **Framing:** during an interaction the station fills about 80% of the width (880 px card *(proposed; the 16:9
  source says half the width)*) and the hero is 56 px. During falls the framing widens so the next station is already
  visible; neighbours are often cut by the frame edge (shapes only, never their text).
- **The hero never leaves the middle half of the frame**: lay stations out (or offset the camera) so the contact
  points sit between x = 270 and 810.
- **Safe zones:** 230 px top, 330 px bottom for all text; neighbours may run past them.
- **Cards:** 36 px radius, inset 1 px top highlight at 4%, a deep soft shadow *(proposed)*.

## 5. Elements

- **Hero:** one object that never disappears. Default: a white ball (56 px) that is a toggle's knob. Alternatives: a
  caret, a file tile, a message bubble, a coin, a data point.
- **Stations** (real-looking system UI, rebuilt generic): toggles; sliders with tick marks and a value tooltip;
  notification cards (app-icon square, title, body, `now`); a keyboard with key caps and a return key; list and
  checklist rows; charts whose leading dot is the hero; chat bubbles; a big button followed by a toast.
- **App icons** are generic rounded squares with a simple glyph, never a real app's icon.
- **Empty slot:** when the hero leaves, a dim dashed outline of its slot stays and fills again when it returns.
- **Trail:** a sparse dotted arc may show the path just flown *(proposed)*.
- **Cursor:** may click the first station, then gets out of the way.

## 6. Motion

- **Contacts land on beats** (110–120 BPM; 116 BPM *(proposed)*, a beat of 0.517 s). Between contacts the hero flies
  a parabola: x linear in time, `y = y0 + v·t + ½·g·t²` with v solved so it lands on the next beat; gravity constant
  for the whole video (6000 px/s² *(proposed)*).
- **roll:** along a track the hero moves with easeInOutCubic (0.6 s *(proposed)*), and the station's value follows the
  hero's position.
- **Squash on impact:** 1.25 × 0.8 for 60 ms, then **squashBack** (w 22, z 0.5 → stiffness 484, damping 22, mass 1
  *(proposed)*). The surface that was hit dips 8 px *(proposed)* on the same spring.
- **Stretch in flight:** up to 1.15 × 0.9 along the velocity.
- **react** (stations answering, bubbles and checks arriving): the source default spring w 14, z 0.82 → stiffness 196,
  damping 22.96. **toast:** w 14, z 0.95 → 196 / 26.6 *(proposed)*.
- **Camera follow:** the target blends the hero (plus 0.15 s of velocity lead) with the station anchor; anchor weight
  0.7 during an interaction, 0.15 during falls and hops, 0.85 on the payoff hold. Smoothed by a critically damped
  spring w ≈ 6 → stiffness 36, damping 12, mass 1. It blends in from a fixed first framing over 0.8 s.
- **Launch back to the start:** one long arc; pick the apex height first, then warp time with speed
  `1 − 0.9·sin(πu)^0.6` (5–10× slower at the apex). Stations reset in reverse during the reveal hold.
- **Payoff hold:** 0.4–0.6 s on the final result.
- **Reveal:** the camera eases (1.2 s *(proposed)*) to a fixed framing at about 0.3× zoom with a 15–25° rotateX tilt
  (20° *(proposed)*), holds about 1 s; the hero scales up with a soft halo and stays at least 24 px on screen.
- **Dive back** to the first station, timed so the camera arrives as the hero lands. The loop point is that landing:
  the last frame equals the first.

Source spring numbers kept for reference: `spring(t, w = 14, z = 0.82)` and the camera's critically damped w ≈ 6.
Converted with stiffness = w², damping = 2·z·w at mass 1; checked against the kit's `springAt()`: identical curves.

## 7. Transitions and rhythm

- **None:** one continuous take. No cuts, no fades; the camera and the hero carry everything.
- **Length:** 10–30 s (default a 12 s seamless loop). Longer means more stations, not slower ones.
- **Sound:** a 110–120 BPM minimal groove (soft kick, clicky hats, muted pluck bass). The hero's contacts are the
  instrument: a pitched tick or marimba note per impact, rising as the story advances; keys click; the slider plays
  fine ticks that speed up with its value; notifications pop; a whoosh up on the launch and down on the dive. The
  audio tail is folded back onto the start so the loop is seamless.

## 8. Finish

- No grain, no vignette, no glow.
- Real motion blur in the final (8 sub-frames): the hero and the world smear on fast moves, as part of the look. The
  previews fake it with faint ghost copies along the velocity.
- A soft halo on the hero during the reveal only (48 px *(proposed)*).

## 9. 3D look

Only a CSS perspective tilt (rotateX 15–25°) at the reveal. In Blender it would be a flat card world on a dark plane,
with an orbit/tilt camera and an emissive white ball.

## 10. Banned

- Cuts and fades to black.
- Text overlays that explain what is happening: words live inside the stations.
- More than one hero.
- Stations that don't react to the hero.
- Floaty physics (slow arcs without the time warp, gravity that changes).
- The hero leaving the middle half of the frame.
- Glow, grain or vignette (except the hero's halo in the reveal).

## 11. Where it came from

- **Barty-Bart/motion-graphics, `skills/explainer-engaging/SKILL.md`** (MIT, © 2026 Bart), through
  `docs/research/styles/barty-bart-and-prompt-motion.md`, section "One-Take Hero Journey"; the demo GIF was looked at
  for framing. Taken: the palette, Inter/Geist, `Name · state` labels, no overlays, the 3× world and staircase,
  framing rules, the hero and its alternatives, the stations, the empty slot, contacts on beats with parabolas, rolling,
  squash and stretch values, the time-warped launch, the follow camera (lead, anchor weights, w ≈ 6), payoff hold,
  reveal (0.3×, 15–25°, 1 s, halo, 24 px), dive back, loop seam, music and sound, motion blur, bans.
- **Proposed:** every px size, card radius and shadow, gravity, BPM inside the range, squashBack and toast springs,
  the 8 px dip, roll and reveal durations, the tilt value, the halo size, the trail.
- **Changed for vertical:** the source is 16:9 with a zig-zag world. Here the path runs downward, a station fills
  about 80% of the width instead of half, and labels grow to 30 px. The previews show single framings of the take;
  the tilted reveal is described above but not rendered, because its text is deliberately tiny.
- The demo's brand (its orange accent, app name and URL) was not used: the accent is the source's default blue.
- Added to the catalog on 2026-10-31.
