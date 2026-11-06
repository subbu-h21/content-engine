---
name: style-red-paper-cut
description: Visual style "Red Paper-cut": folk window-flower paper-cuts that come alive; China-red cut-outs with hand-cut wobbly edges, a light/dark cut rim, an inset double outline and a soft paper shadow, on rice paper or indigo night paper; eight-fold rosettes snap open fold by fold, Fraunces 800 letters pop in on 12 fps steps, captions sit on serrated swallow-tail banners, emphasis is knocked out of a red banner, and gold foil appears once at the end. Use when a video is made in this style.
---

# Red Paper-cut

## 1. In one line

Chinese window-flower paper-cuts come alive: the cut is the drawing and every hole is where light gets in. It suits
festive greetings and new-year stories, folk tales, "one thing becomes many" stories (fold, cut, unfold), craft
explainers and short facts told as a small ceremony. No footage, no 3D: depth is paper tone and layering.

## 2. Palette

Depth and role come from paper tones one step apart, never from shading. Ground and hero are always different paper
families (red on red stops reading). Gold foil appears once, late, and never becomes a second main colour.

| Role | Hex | Where |
|---|---|---|
| background (rice paper) | `#f2e8d0` | the day ground and the title paper, with fibres and mottling |
| text (China red) | `#d2201f` | the hero paper: cut letters, rosettes, strips |
| near / heavy / far | `#c4162c` / `#b00f26` / `#8a0c20` | one step brighter / deeper / darker reds: near pieces, printed credits, stacked folded edges |
| foldBack | `#de3b30` | the back of a flap while it stands past 90° |
| muted (banner) | `#a8111f` | banner strips under captions and labels |
| cream | `#fff1d6` | text on banners; cream cut letters on night paper |
| accent2 (indigo night paper) | `#1c2446` | the second ground family |
| nightFar / nightNear / houses / snow | `#1f2a55` / `#29356e` / `#35457f` / `#7a88ba` | night hills, houses, the pale indigo of scattered light and snow |
| faint / dayMid | `#e0877f` / `#cf4f4a` | pale-red day layers |
| accent (gold foil) | `#d9a93f` | flecks on the end card only |
| light1 → light2 → light3 | `#fff6d6` → `#ffc46e` → `#ec782e` | the lit window behind a backlit rosette; lit house windows |
| transmission | `#b51d18` | a backlit rosette's red |
| shadow | `#34060a` at 38% | the paper shadow under every piece |

## 3. Typography

- **Cut titles:** Fraunces 800, capitals, 140 px (headlines 112 px, fitted to the 900 px column), leading 1.02,
  tracking 0.01 em. Letters are cut-outs: wobbly edges, rims, shadow, and above ~100 px the inset slit (a 1.5 px line
  3.5 px inside the outline).
- **Emphasis is paper, not colour:** the emphasised words are knocked out of a red serrated banner (yin cut), 150 px,
  so the ground shows through the letters (`BLUE?`, `at once.`, `AGAIN.`).
- **Banners (captions, labels, list items):** Fraunces 600, 44 px (labels 34 px), cream `#fff1d6` on the banner red,
  centred, at most two lines.
- **Printed credits** (kicker, chapter, units): Fraunces 600 italic, 34 px, deep red on rice paper or cream on night.
- **Numbers:** Fraunces 800 at 400 px, cut with the inset slit.
- The smallest text is 26 px. At most about 8 words of cut type on screen.
- Fraunces stands in for the source's "sturdy OFL serif" (it is the source's own choice).

## 4. Layout

- **Layers stay parallel to the screen;** depth only from paper tone, overlap and shadow, never perspective.
- **Margins:** 90 px; text inside 230 px top / 330 px bottom. Centred compositions; the printed kicker sits on the
  safe-top line (y ≈ 262).
- **Rice-paper title sheets** carry red sawtooth border strips (54 px) at the top and bottom edge.
- **Night grounds** carry a village at the bottom (far hills, houses with window holes, near hills), kept below the
  last banner.
- Leave paper between pieces: a frame is about half paper.

## 5. Elements

- **Every piece is paper:** a flat path, hand-cut wobble (displacement 4 px at a 33 px scale), a 1.2 px light rim
  upper-left and dark rim lower-right (the cut face), a paper shadow offset (2.6, 3.6) px with a 2.5 px blur at 38%,
  dye mottling inside (±7% at ~130 px, plus fibres) with holes kept as holes.
- **Inset contour** on big pieces and letters: a 1.5 px slit 3.5 px inside the outline.
- **Rosettes (window flowers):** one 45° wedge mirrored eight ways: a sawtooth fringe of 48 teeth, a ring of 32
  tapered slits, a yang band (a red zigzag left standing), eight almond petals with smaller almonds between them, an
  inner ring of holes and a diamond centre. Faint fold creases stay on the four fold lines.
- **Folk vocabulary:** sawtooth rows and serrated edges, almonds, slits, coins (a disc with a square hole), stars of
  gold foil, wave slits.
- **No floating islands:** every hole leaves bridges; nothing inside a hole hangs free.
- **Banners:** serrated top and bottom edges (14 px teeth, 5 px deep) and swallow-tail ends.
- **Accordion strips:** panels hinged edge to edge, each with its own cut, a faint crease at each hinge.
- **Backlit window (a saved special event):** a rosette in transmission red over a radial light, holes at full light,
  a low bloom (30%).
- No photos, no outlines, no gradients on paper.

## 6. Motion

- **Steps:** letters, banners and pieces move on 12 fps steps; folds, light and the camera move on every frame.
- **pop:** a piece or letter appears at 1.15× for one step, then sits at 1×.
- **letters:** titles cut one letter per step (0.083 s); headlines one word per step.
- **banner:** drops in on two steps: the first 26 px high and tilted −1.5°, the second in place.
- **unfold:** a folded 45° wedge (with darker stacked edges) opens in three folds 0.25 s apart, each flap swinging
  over its fold line in 0.5 s, quart-out (the "pa!" snap): it shows its back colour while past 90° and darkens as it
  stands up. Then a 1.05× bump for one step and a warm flash (half-life 0.12 s).
- **accordion:** each panel of a strip unfolds 0.25 s after the last, with the same snap; the panel foreshortens by
  cos θ and grows 10% along the fold as it stands.
- **cut:** a strip is revealed left to right along the scissor path, linear, 0.9 s.
- **Holds:** ≥ 1.8 s after the last piece lands. Nothing fades.

## 7. Transitions and rhythm

- **Paper actions only:** a fold, a page turn, a sheet peeling from a corner (0.7 s, cubic-in-out), a sheet flying off,
  a cut through the frame. Overlap the outgoing and incoming actions so no frame is empty. No dissolves.
- **Rhythm:** about 120 BPM in 2/4 (beat 0.5 s); unfolds and cuts on eighth notes (0.25 s); a full stop of music
  before the big unfold, then the unfold on the downbeat.

## 8. Finish

- No film grain and no vignette: the paper fibres and mottling are the texture.
- Glow only from a backlit rosette (bloom 0.3, 40 px blur); no other glow.

## 9. 3D look

None: pure 2D paper layers.

## 10. Banned

- Painting, gradient shading or outline strokes (the backlight behind a lit rosette is the one exception).
- Shadow-puppet looks (light behind a screen, translucent hide, rods); flat vector art without cut edges.
- A silhouette film: every shape's interior is cut.
- Perspective depth; dissolves and fades.
- Smoothed architecture; floating islands in a cut; morphing faces.
- A red hero on a red ground; gold as a second main colour.
- Copying named artists' cuts, studio characters or real motif sheets.
- Film grain.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 09 "Red
  Paper-cut" (Chinese window flowers). Research notes: `docs/research/styles/five-skills.md`, "Red Paper-cut (Chinese
  window flowers)". Rebuilt with SVG filters and paths in Remotion (the source draws on canvas); no code copied.
  Fraunces is SIL OFL.
- **Taken:** every hex (reds, fold back, rice paper, indigo night family, gold foil, banner, cream, backlight radial,
  transmission, shadow); Fraunces 800 for titles and SemiBold for captions; cream text on a serrated swallow-tail
  banner; the paper rules (hand-cut wobble, 1 px light/dark rims, inset contour 1.5 units at 3.5 units, shadow
  2.6/3.6 px with a 5 px blur at .38, mottling ±7% at ~130 px, holes stay holes); the rosette grammar (one 45° wedge
  mirrored eight times, yang and yin rings, kept fold creases); no floating islands; 12 fps steps and the 1.15× pop;
  folds of ~0.5 s with back colour past 90°, darkening and foreshortening, unfolds 0.25 s apart with an ease-out snap,
  a bump and a warm flash; banners dropping on two steps; the backlit window; paper-only transitions; rhythm; banned
  list.
- **Proposed:** every px size and position for 1080×1920; the displacement strength (4 px) and rim width; the 1.05×
  bump for a big rosette; the knocked-out banner as the emphasis device; the accordion strip with wave slits drawn
  proportional to wavelength (700 → 400 nm) for "every colour"; the coin molecule; the sample wording ("The science",
  "By the numbers", "In three steps").
- **For vertical:** the source is a 1920×1080 landscape with parallax layers and a subtitle 70 px from the bottom.
  Here compositions are centred in a 900 px column, the title stacks into two cut lines plus a knocked-out banner
  (140–150 px instead of the demo's landscape title), banner text is 44 px on a 1080 px-wide frame (the source's
  44 px sat in 1920), the village moves to the bottom 400 px, and the subtitle banner sits above the 330 px safe zone.
- Added to the catalog on 2026-11-04.
