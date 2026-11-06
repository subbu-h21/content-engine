---
name: style-rubber-hose
description: Visual style "Rubber Hose": a black-and-white hand-inked early-sound-era cartoon with an invented cast; every object alive and breathing on the beat, noodle limbs, white four-finger gloves, pie eyes, a Shrikhand title hopping over a rotating sunburst, IM Fell English SC subtitle plates with double rules and dot-and-ring corners, grey watercolour backdrops, projected as a worn print with weave, scratches, dust and a strong vignette. Use when a video is made in this style.
---

# Rubber Hose

## 1. In one line

A hand-inked 1930s cartoon where everything is alive and squashes to a hot band, projected as a worn print. It suits
food and drink, retro ads, kids, mascot intros, jingles and "a place comes alive" pieces. Its character is bouncy, so
idle breathing and overshoot are part of the look here.

## 2. Palette

Strictly greyscale: about six grey steps plus a separate character white, no hue anywhere, not even in film damage.
Characters own the extremes (white and ink); backgrounds live in the mid greys.

| Role | Hex | Where |
|---|---|---|
| surface (paper) | `#f1eee6` | the lightest background grey; fences |
| background (light) | `#c8c5bc` | the main wash, the form-shadow band |
| muted (mid) | `#9a978f` | walls, sunburst wedges |
| faint (dark-mid) | `#6b6963` | hills, floors, furniture |
| dark | `#3b3a37` | cards, deep shade |
| ink | `#0e0d0c` | outlines, pupils, shoes, hose limbs |
| text (character white) | `#fcfbf7` | character fills only, plate type, title faces |
| plate | `#0c0b0a` at 92% | the subtitle plate |
| accent, accent2 | white, ink | the format needs them; this style has no hue |

Pick one ramp temperature for the whole film (this one is warm paper).

## 3. Typography

- **Titles:** Shrikhand (Google Fonts, OFL), a fat retro script at 216–250 px, white face, heavy ink outline at 14% of the
  size, an ink drop shadow down-right; letters hop in a travelling wave.
- **Sub-lines:** Limelight caps at 44–62 px, white with an ink outline.
- **Subtitles:** IM Fell English SC at 50 px, paper white on the plate. At most 2 lines. **Smallest text:** 40 px.
- **Emphasis:** the hopping letters and the band hit, never colour.
- **Words:** at most 8 on screen besides the title.

## 4. Layout

- **The gate:** the source's 4:3 picture in a 16:9 canvas became a full-height gate: the print fills the frame, inset 14
  px, with rounded corners (radius 28), a soft inner shadow and black outside.
- **Theatre staging:** a locked eye-level stage with props in a row; characters take 1/4–1/2 of the frame height; no
  far-wide shots for gags (faces must read).
- **The destination prop** enters before the gag lands; arcs stay inside the gate.
- **The plate** sits at y = 1480 (centre) inside the safe zone; drawn in the scene so it weaves and flickers with the film.
- **Safe zones:** 230 px top, 330 px bottom. **Margins:** 72 px.

## 5. Elements

- **Anatomy kit:** hose limbs of constant width (13 px, one smooth bend, round caps, no elbows); white four-finger gloves
  (palm, three fat fingers, thumb, flared cuff with a fold, three stitch lines; every part stroked first and then filled,
  so only the union is outlined); big black shoes with a white toe glint.
- **Pie eyes:** a white oval, a black pupil 64% × 74% of the eye with a wedge cut toward the upper right.
- **Mouths:** smile with cheek ticks, open grin, "O", wavy, pucker, tongue-out.
- **Object characters:** the whole object is the body; a secondary feature carries mood. The sample cast is invented: a
  round sun with rays, a two-atom air molecule, clouds with faces.
- **Form shadow:** one hard-edged light-grey band on the side away from the upper-left light, never a gradient.
- **Backgrounds:** soft grey watercolour, painted once: a wash, soft blotches, a thin dark outline; picket fences, checker
  floors, wallpaper, panelled furniture. Backgrounds never boil.
- **Cards:** a rotating sunburst of 18 wedges behind a title; a wavy-edged sign; a sing-along card with a bouncing ball.
- **Ink outline:** 6 px at any zoom.

## 6. Motion

- **Characters on twos** (12 fps), camera on ones. Beat: 144 BPM.
- **Breathing:** every idle object squashes and stretches with cos(2π·beats), stretch on the beat, 6%, all in phase. At the
  peak of joy, ×3.
- **Line boil:** characters only, three drawings cycling at 12 fps, about ±1.2 px (here a seeded displacement).
- **pop:** spring, damping 9, stiffness 170, mass 1, for arrivals. **stretch:** expo-out over 0.3 s.
- **Anticipation, hold, action:** crouch (squash to 0.8), hold, snap. Impacts squash with an exponential spring-back.
- **Walk:** one step per beat with a body bob. **Run:** legs as a windmill, a forward lean, speed lines.
- **Freeze on a band stop:** everything freezes. The climax ends in a ta-da pose held into the iris.
- **Hop:** letters rise and settle 0.08 s apart. **Camera:** eye level, hard cuts to a face, trucking pans, tilts; an iris
  a character can grab.

## 7. Transitions and rhythm

- Iris, a hard cut on a beat, a title card rolling up like a window shade. No dissolves. A 3 px jump on every cut.
- Hot dance band, every action mickey-moused; hard stops before gags; a stinger per gag.

## 8. Finish

The film-damage pass, drawn over the scene: gate weave ±1.2 px with a rare 4 px jump; flicker ±4%; 0–3 scratches; 3–8 dust
specks a frame; an occasional hair; a vignette to 62% black; 0.55 px blur; contrast 1.14; grain 0.05. No hue in any of it.

## 9. 3D look

none

## 10. Banned

- Colour or hue of any kind; gradients in shading; joints or rendered shading.
- 1950s limited animation with graphic backgrounds; a silent film; dissolves.
- Far-wide shots for gags.
- Any existing cartoon character, name, silhouette, design, melody or logo; a cup-headed figure on a human body.
- Period racial caricature.
- Flat grey frames; flashing subtitles; backgrounds that boil.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 26 "1930s Rubber Hose Cartoon" (`styles/rubber-hose/`); demo
  film and stills CC BY 4.0 (LemoLab). Read through the research notes `docs/research/styles/five-skills.md`, section
  "1930s Rubber Hose Cartoon". Rebuilt with SVG and CSS in Remotion; no code was copied.
- **Taken:** the grey ramp and character white, the greyscale rule; Shrikhand, Limelight, IM Fell English SC and their
  roles; the plate; the anatomy kit (hose limbs, gloves, pie eyes, mouths, shoes), object characters, form shadow,
  backgrounds, sunburst, wavy sign; twos, the beat grid, breathing, boil, squash, freezes, the iris; transitions; the
  film-damage values; the banned list.
- **Proposed:** the invented cast (a sun, a two-atom molecule with a grey atom on a bond, faced clouds; no real studio's characters); every px size
  for the tall frame; patterned ribbons as "colours" in a world without hue; the carnival high striker; the sing-along card
  and bouncing ball; the spring values; boil by displacement.
- **Changed for vertical:** the source's 4:3 gate with pillarbox became a full-frame gate with the same rounded corners, so
  nothing is cropped and no side bars waste the frame; title lines stack in three; plates moved up to y = 1480; characters
  are drawn large enough that faces read at phone size.
- Added to the catalog on 2026-11-06.
