# Sources: Math Explainer

## 3Blue1Brown's scenes (the visual grammar only)

- **Repository:** `3b1b/videos` (local copy under `D:\code_files\resources to make content engine\github repos\videos\`).
  The research read `CLAUDE.md`, `custom_config.yml`, the opening scenes of `_2025/laplace/main_equations.py`, and
  usage statistics over all of `_2026/cross_entropy/*.py` and `_2025/laplace/*.py` (animation types, run times, waits,
  lag ratios, font sizes, strokes, opacities, camera calls), plus colour-constant counts in `_2026/hairy_ball`.
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Math Explainer (generic grammar
  distilled from 3b1b scenes)".
- **Licence:** CC BY-NC-SA 4.0 (`videos/LICENSE.txt`). So: the grammar is described in our own words; no code, no
  scenes, no Pi creatures or other characters, no logos or channel branding are used.

### Taken from it (as rules)
- Pure black ground; one colour per variable or concept, kept for the whole video (a text-to-colour map passed to
  every equation); the most used colours (yellow, blue, green, pink, teal, white, red, then grey B).
- Equations about three times as common as plain text; a CMU Serif / LaTeX look; emphasis by colouring the term,
  boxing it, or dimming everything else; labels over busy graphics with a black backstroke (width 5 most common).
- Layout: relative placement on a fixed spacing scale (0.1 / 0.25 / 0.5 / 1.0 units, small the most used), 0.5 from the
  frame edges; the title or governing equation pinned to the top edge.
- Motion: 2 s the most common run time (then 3, 1.5, 1, 5, 4, 6 s; long moves 10–20 s; quick beats 0.3 s); 1 s waits
  the most common hold (then 2, 3, 0.5 s); lag ratio 0.1 (then 0.2, 0.5, 0.25, 0.05, 0.01); the move vocabulary by
  frequency (fade with a small shift, write, grouped moves, transform-from-copy, show-creation, lagged starts,
  replacement and fade transforms, move-to-target, grow arrow, matching-tex transforms, restore, indicate / flash,
  counters); dim to focus at 0.2 (most common), or fade by 0.7–0.8, or fill 0.35; the 3D camera's slow reorientation.
- Rhythm: no cuts inside a scene; animate ~2 s, hold ~1 s; scenes are silent clips timed by run times.
- Finish: no grain, texture or vignette; glow only on moving dots; saturation 1.5 at render; 16:9 inserts on a grey E
  plate.

## Manim's defaults

- **Repository:** `3b1b/manim` (`manimlib/default_config.yml`, `constants.py`, `utils/rate_functions.py`). Licence:
  MIT.
- **Taken:** every hex (YELLOW #FFFF00, BLUE #58C4DD, TEAL #5CD0B3, GREEN #83C167, RED #FC6255, PINK #D147BD, GOLD
  #F0AC5F, PURPLE #9A72AC, GREY_A/B/C/E #DDDDDD/#BBBBBB/#888888/#222222, and the A–E shades), the smooth rate function
  10t³ − 15t⁴ + 6t⁵, the font-size scale (144 = one unit), the frame height of 8 units, the spacing buffs.

## Proposed (not in the sources)
- The smooth curve written as the bezier [0.5, 0, 0.5, 1] (its largest difference from 10t³ − 15t⁴ + 6t⁵ is under 1%;
  computed for this style).
- Pixel sizes: one unit = 240 px (the vertical frame is 8 units tall), so Manim size × 1.67; text at 64 px; the 300 px
  counter; stroke widths (Manim width × 1.8); the 24 px fade shift; the Write effect as an outline-then-fill wipe (an
  approximation: a real write draws each glyph's stroke with a 0.1 lag ratio).
- Old Standard TT as the Google substitute for CMU Serif (Computer Modern follows the 19th-century Modern faces that Old
  Standard revives); CMU Serif is used when installed.
- The 3D surface note in STYLE.md section 9.
- The sample scenes (wave with a λ brace, beam → three wavelengths, I ∝ 1/λ⁴ over a plane with blue arrows 5.9× the
  length of the red ones, (700/450)⁴ ≈ 5.9 boxed with the rest dimmed, a chain of three steps, the end line).

## Changed for vertical
- The source frame is 16:9 (8 × 14.2 units); here it is 8 × 4.5 units, so every scene stacks top to bottom with the
  equation pinned at the top. Margins stay 0.5 unit (120 px), which also keeps text off the right-hand 120 px.
