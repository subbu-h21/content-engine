---
name: style-pop-up-book
description: Visual style "Pop-up Book": a hardcover pop-up book open on a warm walnut desk under a lamp; flat saturated cut-paper pieces with dark-brown outlines, one hard shade crescent, thick off-white borders over a grey card edge and cut-out shadows spring up from the page on a back-ease; a painted sky board, signs dropping on strings, speech bubbles, red ribbons, paper tags; cream Fredoka subtitles with a brown outline, Lilita One signs, IM Fell English taglines. Use when a video is made in this style.
---

# Pop-up Book

## 1. In one line

A children's pop-up book on a real desk becomes the stage: paper pieces spring up from the page, signs drop on
strings, and a warm lamp lights it all. It suits children's stories, step-by-step processes (each step a piece or a
page), story explainers, before-and-after pull-tabs and cosy facts.

## 2. Palette

Saturated children's-book colour, never neon; the real world (desk, lamp) natural and slightly warm. One dominant hue
family per spread (a page turn is also a colour change); red, yellow and gold recur across spreads; pages "outside
the story" drop to graphite on cream (`#f5eedc` + graphite at 45%).

| Role | Hex | Where |
|---|---|---|
| ink | `#3a2a24` | every outline (9 px) and detail line (5 px): dark brown, never black |
| border / card edge / card back | `#fffdf7` / `#b9ad9c` / `#efe8da` | the cut-paper border (16 px) / the grey edge (border + 2.5 px, 1.5 px down) / plain backs |
| page edges | `#efe6d2` | the page block |
| text (subtitle cream) | `#fffaf0` | subtitles, with a dark-brown outline |
| muted (bubble text) | `#7a5e4c` | speech-bubble text |
| ground page | `#9fd57a` → `#86c763` | spine to reader; path `#ecd49a` |
| hills | `#b5e39a` `#a9dd8c` `#8fd06e`, shade `#6fb553` | pop-up hills |
| sky board | `#7cc6ef` → `#c9ecf7`; night `#131d44` → `#4a5a94` | the standing backdrop |
| accent (red) | `#e8413a` | the recurring red: roofs, red light |
| accent2 (blue) | `#3f95d6` | blue light, paper darts; sea tones `#9ad8f5` `#58ade3` |
| kid | skin `#ffe2bd` / `#f3c393`, jacket `#3fa1de` / `#2a78b3`, boots `#8a5530` | the invented reader-kid |
| sun / sign gold / ribbon | `#ffd766` / `#ffcf3f` / `#d8423a` | the sun on a stick / sign text, the beanie / chapter ribbons |
| book | cloth `#1f5566`, foil `#e0b456` | the cover and the sign boards |
| desk | `#6b4630` with walnut `#c9a88a` | the desk *(proposed base)* |
| spectrum | `#e8413a` `#f28c3a` `#ffd766` `#86c763` `#3f95d6` `#8a6cc8` | the paper rainbow (orange and violet *proposed*) |

## 3. Typography

- **Faces (Google Fonts, OFL):** Fredoka 500 / 600 (subtitles, bubbles, tags), Lilita One (the cover, signs,
  banners, action words), IM Fell English italic (taglines, "The End").
- **Subtitles:** Fredoka 500, 52 px (48 px for long captions), cream `#fffaf0`, an 8 px dark-brown outline under the
  fill and a soft shadow, centred at y = 1336 over the front strip of the page, at most 2 lines.
- **Speech bubbles:** Fredoka 600, 50 px, `#7a5e4c` on a white card (radius 44, 6 px ink outline, soft shadow, a tail
  to the speaker), typed at 30 characters a second, a bobbing red "next" triangle.
- **Signs:** Lilita One 100–150 px in sign gold with a 12 px ink stroke, on a cloth-blue board with an ink outline and
  a white border, hanging on two strings.
- **Cover title:** Lilita One 104 px in gold foil with a sheen; tagline in IM Fell English italic 56 px.
- **Action words** ("NICE!") used sparingly: Lilita One italic 120 px, gradient fill, white + ink double stroke, rays.
- **Tags:** Fredoka 600, 36–40 px, ink on white paper with a white border; numbered tags get a red disc.
- **Smallest text:** 32 px.

## 4. Layout

- **The book** fills the frame: the sky board stands from y = 330 to the spine at y = 960 (x 120–960); the ground page
  recedes from the reader's edge at y = 1500 (x 40–1040) to the spine; the page block and cover cloth show under it;
  the out-of-focus desk around it.
- **Pieces** stand on the ground page between the spine and 62% of its depth; the front strip (y ≈ 1300–1500) stays
  clear for subtitles. Things in the sky (sun, molecule) stand on sticks at the back.
- **Signs** drop into the board area (y ≈ 370–600); tags and bubbles sit on the board; ribbons sit low.
- Margins 72 px; safe zone 230 px top, 330 px bottom; must-read text above y = 1470.

## 5. Elements

- **Cut-paper finish:** art with a 9 px dark-brown outline and 5 px detail lines; shading is one hard crescent (fill
  with the shade, refill shifted toward the lamp with the base); the silhouette is dilated into a grey card edge and a
  16 px off-white border; flat colour with a light paper grain over everything.
- **Wobbly shapes** from three harmonics (2.5%, 1.8%, 1.2%), never perfect geometry.
- **Simple faces:** big black oval eyes with two white highlights, a curved mouth, pink cheeks.
- **Pop-up pieces** are cards hinged on the page with a plain paper back; the shadow is the cut-out's shape, never a
  rectangle. "3D" things are several flat cards.
- **Paper mechanisms:** the sun on a stick, hinged doors, sliding wave strips, sky slats flipping day → night, the moon
  and stars dropping on strings, pull-tab columns for numbers.
- **The book:** cloth cover with a gold-foil title, a page block with edge lines, a gutter shadow along the spine.
- **The real world:** a walnut desk (procedural grain, blurred 7 px as if out of focus), a warm lamp pool from the
  upper right, the book's soft contact shadow.

## 6. Motion

- On ones; everything a pure function of time. Paper moves stiffly; life comes from easing.
- **popup:** a piece rises with `back(t, 1.7)` = 1 + u²((s+1)u + s) (u = t − 1) over 0.55 s, its rise delayed by
  (0.3 − d) × 1.2 s by its depth d (metres from the spine on a 0.3 m page); far pieces lie back, near ones fold
  forward; they fold down in the same order.
- **pop:** bubbles, tags, darts and ribbons pop with `back(t, 1.8)` over 0.35 s.
- **string:** signs, moon and stars drop and swing on `1 − e^(−z·k·t)·cos(k·√(1−z²)·t·1.6)`, k = 7, z = 0.35.
- **Sway** of plants and light props: sin(1.6 t + phase) × 0.01–0.08 rad around the base.
- **Characters** are flat cards redrawn per pose; blink every 3.7 s; walks bounce |sin| × 1.2 mm with counter-swinging
  arms; turning flips the card (scale), never an edge-on rotation; jumps are parabolas with a squash and a paper puff.
- **Page turn:** a bending leaf over 2.3 s (ease-in-out), bend 0.55·sin(πu); old pieces fold down as new ones rise.
- **Slats** flip day → night 0.28 s apart.
- **Never moves:** the room.

## 7. Transitions and rhythm

- Real page turns, a book closing and reopening, or a hard cut on a paper sound. Never a video dissolve inside the
  book; no cuts inside a spread.
- Picture-book pace: lines of 2–9 s; silence = the book held still with only room tone.

## 8. Finish

- Shallow depth of field: the desk and far room out of focus (7 px here), the pieces sharp.
- Bloom 0.2 (threshold high); a vignette of 0.35; warmth (1.06, 1.0, 0.9); neutral tone mapping (no ACES shift on
  paper colours); fine temporal grain (strength 2) in the encoder; a light static paper grain.

## 9. 3D look

The source is a three.js scene in real units: a page 0.44 × 0.30 m, actors 3–5 cm, a macro camera 5–10 cm above the
page and 30–45 cm back (fov 30°, shallow aperture), an HDRI room (a CC0 lounge) and CC0 props (desk lamp, teacup,
clock, pencil, plant), a walnut desk, a warm practical lamp that brightens as a story beat, dust motes, cut-out
planes with alpha test and cut-out-shaped shadows, spot shadow maps (4096²). In Blender: image planes with alpha clip
and a separate paper back, hinged empties keyed with the back-ease, a macro camera at real metric scale with a small
f-stop, an HDRI world with a blurred background, compositor DOF / bloom / vignette, Standard view transform. The
previews draw the book in 2D with a fake perspective (pieces scale by depth, hinges as a vertical squash) and a
procedural desk.

## 10. Banned

- A paper-cut silhouette film (one-colour lace, backlight); a 3D cartoon (nothing modelled round); claymation squish.
- Neon colour; black ink; perfect geometry.
- Turning a piece edge-on to show a blank back; rectangle shadows.
- Video dissolves inside the book; near pieces filling the frame with blur; the room moving.
- Copying any pop-up artist's or game's characters, logos, UI or music.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 41 "Paper Pop-up Book (Cut-Paper Diorama on a Real
  Desk)" (`styles/paper-popup/STYLE.md`, `DEMO.md`, values checked in `demo/post.js`, `demo/lib.js`, `demo/mux.sh`);
  demo film and stills CC BY 4.0 (LemoLab). The demo's music (Kevin MacLeod) and Poly Haven props weren't used. Read
  through the research notes `docs/research/styles/five-skills.md`, section "Paper Pop-up Book". The source renders
  in three.js with a real HDRI; this is rebuilt in 2D with React, SVG and CSS in Remotion, the desk drawn
  procedurally.
- **Taken:** the ink, border, card edge, card back, ground, hill, path, sky, night, sea, kid, accent red, sun, gold,
  ribbon, cloth, foil, page-edge, subtitle and bubble-text hexes; Fredoka, Lilita One and IM Fell English with their
  roles and sizes (subtitles 40 px, bubbles 46 px, chapter banner 84 px with a 12 px stroke, action words 120 px at
  1920×1080); the cut-paper construction (outline, detail line, one hard crescent, border, grey edge, wobble, simple
  faces); hinged pop-ups and their `back()` easing, depth delay and fold order; strings and their spring; sway;
  character rules; the page turn; transitions; DOF, bloom, vignette, warmth, grain; the banned list.
- **Proposed:** the desk's base colour and procedural grain (the source uses a photo texture and HDRI), the orange and
  violet of the rainbow, the cheek pink, the house wall cream, the kid's yellow beanie and the whole kid and molecule
  designs (invented), the 2D book geometry, every px size, the sample scenes.
- **Changed for vertical:** the source frames the spread from a low macro angle in 16:9; here the book is seen from
  the reader's edge so the open spread fills a tall frame (sky board above, ground page below); subtitles move from
  the bottom edge to the front strip of the page (y ≈ 1336); type is larger (subtitles 52 px instead of 40) with
  fewer words; signs and bubbles use the board area instead of the sides.
- Added to the catalog on 2026-10-31.
