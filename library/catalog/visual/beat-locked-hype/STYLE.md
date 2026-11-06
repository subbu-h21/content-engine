---
name: style-beat-locked-hype
description: Visual style "Beat-Locked Hype": showreel-energy sting on a 128 BPM grid; heavy Inter Tight caps slams that change treatment per word across hard-swapped cream, ink and electric-blue cards, an Instrument Serif italic human line, an orange spark that becomes every transition, a rippling cube field as the signature shot. Use when a video is made in this style.
---

# Beat-Locked Hype

## 1. In one line

A 12–20 s showreel sting where something lands on every half-beat and one orange spark carries the eye through every
scene change. It suits hooks, teasers, launch stings and punchy fact reels.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (ink) | `#0b0b10` | the canvas: spark open, data, end card, the "accent on black" triplet card |
| text (white) | `#ffffff` | slams on ink and on blue, the serif human line |
| surface (cream) | `#edebe4` | the "dark on cream" triplet card; the highest cubes in the field |
| muted | `#85858c` | mono HUD labels and captions: white at about 50% on ink *(proposed hex)* |
| faint | `#1c1c26` | the faint construction grid *(proposed)* |
| accent (orange) | `#ff4f1a` | the spark, the line, the full-screen flood, the wipe bar, the end-card dot, the cube the spark hits |
| accent2 (electric blue) | `#2f47ff` | the "white on blue" triplet card, the one accent bar in data, the cube field's mid tones |

- **At most 3 colours per scene, not counting black and white.**
- Orange and blue are the brand's main and second colours when there is a brand (a one-colour brand uses a deep shade
  of its colour for the blue).
- Cubes are coloured by height: ink-tinted blue (low) → electric blue → cream (crest).

## 3. Typography

- **Slams:** Inter Tight 900 (Google Fonts; Archivo Black is the alternative), ALL CAPS, huge: fitted to the 920 px
  column, up to 300 px; tracking −0.035 em, leading 0.9 *(sizes and tracking proposed)*. 1–3 words at a time.
- **Human line:** Instrument Serif italic 400, 2–4 lowercase words, 92–150 px *(sizes proposed)*. Used under the name,
  for the emotional word of a triplet, and for the end-card tagline.
- **HUD and captions:** Geist Mono 400/500, tracked +0.14 em, ALL CAPS, 26 px at about 50% white; captions 28 px at
  78% *(the source's 12–14 px at 1080p is raised to the 24 px minimum)*.
- **Kicker:** a small mono line above the slam, like `DAILY INSIGHT — THE SCIENCE`.
- **Emphasis is a change of treatment per word,** never bold-in-a-sentence: its own card colour, the accent colour,
  an outline repetition pattern filling the card, or the serif italic.
- **Numbers:** Inter Tight 900, up to 380 px; the unit in the accent.
- The smallest text is 24 px.

## 4. Layout

- **Centred** slams on an 80 px margin (920 px column) *(proposed)*; lists are left-aligned on the same margin.
- **Safe zones:** 230 px top, 330 px bottom. The HUD sits just inside them (y = 262 and y = 1572).
- **Quiet HUD on every scene:** `SCENE 02 / 06` top right and a category label (`KINETIC TYPE`, `SIGNAL`, `DATA`,
  `STEPS`) bottom left, mono, 50%.
- **Faint grid** (120 px *(proposed)*) on the spark open and data scenes.
- **Triplet cards:** full-frame cards that swap hard on the beat. For vertical they may also stack as three bands of
  one frame (cream / ink / blue), each word slamming into its band two beats after the last; the previews show that
  version.
- **Viewfinder brackets** (56 px arms, 3 px) with a tiny `1080 × 1920` mono label appear only on the blue card.

## 5. Elements

- **Spark:** a tiny orange square that pulses on the beat, stretches into a thin 5 px line with a small mono label
  under it, wobbles once, then floods the screen.
- **Detaching full stop:** the full stop (or the dot of a letter) detaches and grows into the shape that starts the
  next scene.
- **Signature visual** (pick one): a **cube field rippling from the centre** coloured by height (the previews' choice:
  the cube the spark hits is orange and the ripple spreads blue); a particle flow that condenses into a ring and
  bursts; a liquid blob morphing between shapes. The camera slowly tilts or orbits while it plays.
- **Product micro-moment:** a cursor flicks a toggle and presses the main button, an orange progress bar fills with a
  percentage, the button turns to `Done ✓`, a toast slides in.
- **Proof** (real numbers only): a big count-up whose digits blur while they spin; staggered bars (64 px) with one
  accent bar; a donut ring; a line over the bars with a tooltip.
- **Morph bridge:** the shape collapses to a dot → a ring pulse on dark → the dot of the end card.
- **End card:** the name in caps with the orange dot, an italic serif tagline, a 440 px hairline at 40%, a tracked
  mono line typed letter by letter.

## 6. Motion

- **Grid:** 128 BPM. Beat 0.469 s, 1/8 note 0.234 s, 1/16 note 0.117 s. Big changes land on beats; type lands on 1/8
  or 1/16 notes.
- **impact** (every landing): source "overshoot slightly, z ≈ 0.6–0.7, then settle"; taken at w = 14 rad/s,
  z = 0.65 → stiffness 196, damping 18.2, mass 1 (overshoot about 7%).
- **slam:** a fast blur/slide in one 1/8 note: expo-out over 0.234 s from 160 px away and a 24 px blur, position on the
  impact spring *(distance and blur proposed)*.
- **mask** (name reveal): each letter rises out of its own mask, expo-out over 0.117 s, one letter per 1/16 note.
- **spring** (spark stretch and general moves): the source default w = 14, z = 0.82 → stiffness 196, damping 22.96.
- **flood:** a full-screen fill in 0.3 s, `cubic-bezier(0.7, 0, 0.2, 1)` *(proposed)*.
- **count:** expo-out over two beats (0.938 s) *(proposed)*; digits blur up to 14 px while they spin.
- **rule:** hairlines, brackets and wipe bars draw in expo-out over one beat (0.469 s) *(proposed)*.
- **Holds:** each triplet word holds two beats (three for a handwritten word); the end card holds 2 s.
- **No scene without motion:** something always drifts (outline rows slide 60 px/s *(proposed)*, the spark pulses).

Source spring numbers kept for reference: `spring(t, w = 14, z = 0.82)`, w 8 slow / 14 normal / 22 snappy, impacts at
z ≈ 0.6–0.7 (no w given). Converted with stiffness = w², damping = 2·z·w at mass 1; the kit's `springAt()` gives the
same curve exactly.

## 7. Transitions and rhythm

- **6–8 scenes of 1.5–3 s** on a 120–140 BPM grid (default 128 BPM, 8 bars, 15 s). Six strong scenes beat eight weak
  ones. Order menu: spark open → brand slam → kinetic triplet → signature visual → product micro-moment → proof →
  morph bridge → end card (held 2 s).
- **Transitions are objects:** a full-screen orange flood, a wipe by a growing bar, a dot that grows into the next
  background, a word that zooms through the camera.
- **Hard cuts** only on a downbeat, at most twice. Hard background swaps inside the triplet are the rhythm and don't
  count.
- **Sound:** kick on every beat, clap on 2 and 4, sub bass on the scene roots; a riser into the brand slam and the end
  card; an impact (low boom + noise burst) on each flood; a tonal blip per typed word; a whoosh on every carried
  transition; a ring-out on the end card. The music sits under the hits.

## 8. Finish

- Soft radial vignette on every flat background: 0.35 *(strength proposed)*.
- Very subtle film grain: 0.03 *(proposed)*; in the final, a few seeded grain tiles cycled.
- Real motion blur in the final: 8 sub-frames over a 180° shutter.
- No glow.

## 9. 3D look

The signature shot is pseudo-3D in the previews (an isometric SVG cube field). In Blender:
- **Geometry:** an instanced grid of cubes (about 13 × 13, small gaps), heights driven by a radial ripple from the
  centre.
- **Material:** colour by height through a ramp from ink-tinted blue → `#2f47ff` → `#edebe4`; the hit cube `#ff4f1a`;
  matte, slightly rough.
- **Light:** a soft key from above-left and a dim fill so the three faces read as three tones; dark ink world.
- **Camera:** slow tilt or orbit, 35–50 mm, no cuts inside the shot.
- **Product card:** a slight 3D tilt with two ghost cards stacked behind it.

## 10. Banned

- Stock-template looks.
- Glow on everything.
- Emoji.
- More than 3 colours in one scene (black and white excluded).
- Text too small to read at a glance.
- Any scene without motion.
- Hard cuts between scenes, except at most 2 on downbeats.
- An orange field with black words: orange is the spark, line, flood and wipe, never a type card.
- An always-on bracket frame or a running timecode (brackets only on the blue card).

## 11. Where it came from

- **Barty-Bart/motion-graphics, `skills/explainer-high-energy/SKILL.md`** (MIT, © 2026 Bart), through
  `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Beat-Locked Hype Promo". Taken: the palette (ink,
  orange, cream, electric blue, white), the 3-colour rule, Inter Tight / Archivo Black caps, Instrument Serif italic,
  the mono HUD and kicker, emphasis as a change of treatment (card colours, outline repetition), the spark → line →
  flood, the detaching full stop, the signature visuals and cube field, the micro-moment, proof rules, the morph
  bridge, the end card, the 128 BPM grid with 1/8 and 1/16 landings, masks on 1/16 notes, triplet holds, impact
  overshoot z 0.6–0.7, transitions as objects, the cut rule, the scene order, sound, vignette, grain, motion blur and
  the bans.
- **Proposed:** all px sizes, tracking, the margin, grid size, the impact spring's w, slam distance and blur, flood,
  count and rule curves, vignette and grain strengths, the muted and faint hexes.
- **Changed for distinctness:** the source draws a viewfinder frame (corner brackets, a red-dot timecode) on every
  scene. That frame is the core of the catalog's `hud-detection` style, so here it is reduced to a quiet scene counter
  and category label; brackets stay only on the blue card, and the red dot is dropped. Orange is never a type card,
  so it doesn't read like `signal-slam`.
- **Changed for vertical:** the source is 16:9. Slams are fitted to a 920 px column; the triplet may stack as three
  bands in one frame; HUD text is 24–26 px instead of 12–14 px.
- The demo GIF's brand (its colours and words) was not used.
- Added to the catalog on 2026-10-31.
