---
name: style-silent-film
description: Visual style "Silent Film": an engraved ink-and-silver-wash drawing projected as a flickering, weaving, scratched print in a picture house; intertitle cards in Playfair Display SC and Old Standard italic whose border follows the emotion (heavy rule, deco double rule, vines), an iris printed with the frame, velvet pelmet and footlights, sepia toned, at most one hand-tinted colour. Use when a video is made in this style.
---

# Silent Film

## 1. In one line

A projected 1920s photoplay: an engraved drawing on a worn print between velvet drapes, with intertitles instead of voices
and a cinema piano playing every beat. It suits wordless comedy, retro brand films, mock newsreels and "company archive"
pieces, and facts told with cards.

## 2. Palette

Monochrome silver, tinted only by the print. Grey values are print densities: ink 0.07, dark cloth 0.15–0.3, mid wood
0.45–0.6, skin 0.8, white linen 0.9–0.95. Sepia is set per section: colder and more damaged when things go wrong, warmer and
cleaner when tender. At most one colour in the whole film.

| Role | Hex | Where |
|---|---|---|
| background (card) | `#0e0d0b` | intertitle cards, the dark screen before the lamp strikes |
| text (card type) | `#ece5d5` | intertitle type, deco borders |
| faint / muted / surface | `#1b120b` / `#9e805e` / `#f7ebd1` | the sepia ramp: low, mid (L = 0.6), high; print black 0.055, white 0.93 |
| accent (the one colour) | `#6f9bc0` | a thing kept in its own hue through the print; here blue light *(proposed for this topic; the source's example is `#d97757`)* |
| theatre | `#050404` | under the drapes |
| velvet / dark | `#4a0f12` / `#240608` | drapes *(proposed)* |
| accent2 (fringe) | `#a8874a` | the pelmet's tarnished fringe *(proposed)* |
| lamp | `#ffaa6e` | footlights |
| burn | `#3a2413` | brown edge fog on the print |

## 3. Typography

- **Faces (Google Fonts, OFL):** Playfair Display SC 900 for titles and shouts, 700 for credits; Old Standard TT italic for
  narration and dialogue.
- **Sizes on the 960 × 1280 card:** title 132–166 px, narration 88 px, shout 72–78 px with the number at 330 px, end line 88
  px, credits 46–54 px. **Smallest text:** 40 px.
- **Case:** small caps for titles and shouts; sentence-case italic for narration.
- **Emphasis:** the border follows the emotion. Level 0 shout: one heavy rule (9 px, 30 px inset), the text shakes (0.35).
  Level 1 narration: a double rule (5.5 + 2.2 px), stepped corners, fans, diamonds. Level 2 tender: vines and small flowers.
- **Words:** a few words a card, 3–5 cards in a short film; a card never explains what the picture shows. Holds 2.5–3.75 s.

## 4. Layout

- **The picture house for vertical:** a tall 3 : 4 gate (960 × 1280 at x = 60, y = 240, radius 22). A velvet pelmet with swags
  fills the top 230 px, thin side drapes run down the edges, and the stage lip with footlights fills the bottom 330 px, so
  the frame's safe zones are the theatre and everything to read sits in the gate.
- **Shots are wide and medium;** figures realistic (7.5 heads). The only close-up lives inside an iris.
- **Density:** one legible idea per frame; check as a thumbnail (dark clothes on pale walls, pale faces on dark interiors).

## 5. Elements

- **The drawing:** ink contours (3 px), about five posterised wash steps (0.07, 0.25, 0.5, 0.75, 0.93), 45° hatching below
  density 0.62, crossed below 0.34.
- **Intertitle cards** with the three borders above.
- **Iris:** a circular mask printed with the frame, so it ages with it.
- **Lettered strip:** a black band at the foot of a picture for a caption line, as on a lantern slide *(proposed)*.
- **Curtains** part and close over 1.1 s; footlights wash the velvet.
- **Figures:** identity by silhouette marks (a boater, a long coat), silent-era make-up.

## 6. Motion

- **crank:** character and camera motion is sampled at 16 fps (18 for a chase); flicker, weave, grain and scratches change every
  output frame.
- **Speed is an emotion:** undercrank panic; back to 16 fps for tender scenes.
- **pose:** keyframed, eased poses (smootherstep 0.8 s); only deliberate gags snap. Deadpan face, the body acts.
- **iris:** opens from r 6 to the whole frame (smootherstep 1.1 s); closes in 2 beats, holds 1.3 beats, shuts in 0.6 beat.
- **Camera:** mostly locked; a tracking shot with foreground passing; a slow motivated push-in; a masked shot; split screen.

## 7. Transitions and rhythm

- Iris, fade to black, straight cuts, the curtain. No dissolves between shots of one scene, no whip pans.
- A cue sheet by mood section (Maestoso, Andante, Hurry, Misterioso, Agitato, Tenderly); the music stops and the projector purr
  remains.

## 8. Finish

The print pass; `strength` is set per section (card 0.5, shout 0.85, tender 0.32) and scales everything:
- softness 0.4 px; flicker from a noise term (0.09) and two sines; uneven density from fbm noise;
- gate weave up to 1.4 px, a rare 4 px perforation jump;
- up to 4 broken vertical scratches, white or dark; 2–9 dust specks; a wiggling hair 22% of the time;
- brown edge burn (`#3a2413`, up to 55%), vignette up to 62%, grain 0.06.

## 9. 3D look

none

## 10. Banned

- Noir; a sepia filter over modern animation (the drawing itself is engraved and inked).
- A pastiche of any star comedian: never the famous bowler, toothbrush moustache and cane.
- Any real film's gags or a published melody; foley and voice.
- Dissolves within a scene; whip pans; big close-ups of rigged faces; implied motion blur.
- More than one colour.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 34 "1920s Silent Film (Projected Photoplay)"
  (`styles/silent-film/`, values from `demo/engine/film.js`, `demo/film.js`, `demo/engine/cards.js`); demo film and stills CC BY
  4.0 (LemoLab). Read through the research notes `docs/research/styles/five-skills.md`, section "1920s Silent Film (Projected
  Photoplay)". The source uses a WebGL print pass; this is rebuilt with SVG and CSS in Remotion. No code was copied.
- **Taken:** card, type, theatre colours, the sepia ramp, densities, footlights; the one-colour rule; both faces and their
  roles; the three border levels; holds; the drawing's construction; iris, curtains; hand-cranked 16 fps; every print-pass
  value and the per-section strengths; transitions; the banned list.
- **Proposed:** the blue as this topic's one colour; velvet and fringe; the lettered strip; the boater figure; all sample scenes.
- **Changed for vertical:** the source's 1440 × 1080 gate between side drapes became a tall 3 : 4 gate with the pelmet above and
  the stage lip below, so the theatre sits in the safe zones; card sizes were reset for the 960 × 1280 card with stacked lines.
- Added to the catalog on 2026-11-06.
