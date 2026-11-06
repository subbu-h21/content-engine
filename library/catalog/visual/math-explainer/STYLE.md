---
name: style-math-explainer
description: Visual style "Math Explainer": crisp vector maths on pure black. Every variable or concept keeps one saturated colour for the whole video (yellow for the key variable, blue, teal, red, green…), equations are written in a Computer-Modern-like serif, new things transform out of what is already on screen instead of cutting, and what isn't in focus dims to 20–35%. Smooth easing, about 2 s moves, about 1 s holds. Use when a video is made in this style.
---

# Math Explainer

## 1. In one line

A patient blackboard that is actually black: the idea is built step by step, each symbol in its own colour, each
new object grown out of the last one, with time to think after every step. It suits maths, physics, computer science
and machine-learning explainers, and any "build the idea" video.

## 2. Palette

Pure black, white, and one saturated colour per concept. The render boosts saturation 1.5× (a `saturate(1.5)` over
everything drawn), so the colours read stronger than these values.

| Role | Hex | Where |
|---|---|---|
| background | `#000000` | every frame; unlit, no gradient |
| text (white) | `#ffffff` | equations, labels, axes, neutral strokes, sunlight |
| muted (grey B) | `#bbbbbb` | secondary labels, captions |
| faint (grey) | `#888888` | dimmed items, ghost copies, reference lines at 50% |
| plate (grey E) | `#222222` | the backing plate behind an inserted 16:9 screen |
| accent (yellow) | `#ffff00` | the key variable, emphasis boxes, moving dots |
| accent2 (blue) | `#58c4dd` | the second variable |
| teal | `#5cd0b3` | graphs, a third variable |
| green | `#83c167` | a variable; correct or positive |
| red | `#fc6255` | a variable; wrong or negative |
| pink | `#d147bd` | frequencies, accents |
| gold | `#f0ac5f` | accents (less used) |
| purple | `#9a72ac` | accents (less used) |
| blueDark (blue D) | `#29abca` | number-plane background lines |

- **One colour per concept, for the whole video.** Decide the map before the first scene and pass it to every
  equation. In the samples: λ yellow, *I* teal, blue light blue, red light red, green light green, sunlight white.
- Each hue has shades A–E (lightest to darkest) for nesting: blue `#c7e9f1 / #9cdceb / #58c4dd / #29abca / #1c758a`,
  yellow `#fff1b6 / #ffea94 / #ffff00 / #f4d345 / #e8c11c`, red `#f7a1a3 / #ff8080 / #fc6255 / #e65a4c / #cf5044`,
  teal `#acead7 / #76ddc0 / #5cd0b3 / #55c1a7 / #49a88f`, green `#c9e2ae / #a6cf8c / #83c167 / #77b05d / #699c52`.
- A gradient between two concept colours runs through HSL (e.g. teal → red over three orders of a derivative). A
  phrase may be coloured by gradient when it *is* the colours ("every colour").

## 3. Typography

- **Face:** CMU Serif (Computer Modern) when installed; otherwise **Old Standard TT** from Google Fonts, the closest
  free face (Computer Modern was drawn after the 19th-century "Modern" types that Old Standard revives). Greek and maths
  symbols (λ, ∝, ≈) fall back to Cambria Math. One family for maths and plain text.
- **Maths:** variables *italic* and coloured by concept; numbers and operators upright; superscripts 0.62 em raised
  0.62 em; fractions stacked at 0.78 em with a rule of 0.055 em.
- **Sizes** (Manim sizes × 1.67, since the frame is 8 units tall and one unit is 240 px):
  - key equations 120 px (size 72); titles 110 px; big counters 300 px *(proposed)*;
  - text 64 px *(proposed, between sizes 36 and 42)*; labels 50 px (30); small labels 40 px (24); axis numbers
    33 px (20); captions 50 px.
  - Smallest text: 24 px (axis numbers are 33 px).
- **Emphasis:** colour the term, box it in yellow, or dim everything else. Never bold, never a second style.
- **Labels over lines** get a 9 px black backstroke (Manim's width 5).
- **Words:** an equation, a short label or a one-line title. Sentences are rare: at most about 10 words of text on
  screen.

## 4. Layout

- **Units:** one unit = 240 px (the frame is 8 units tall, 4.5 wide). Spacing comes only from the buff scale:
  small 24 px (0.1), med-small 60 px (0.25), med-large 120 px (0.5), large 240 px (1.0). Small is the usual gap.
- **Margins:** 120 px from the frame edges (0.5 unit); 840 px column. **Safe zone:** 230 px top, 330 px bottom.
- **Alignment:** centred.
- **Place things relative to each other** (next to, below, aligned to an edge, in rows and columns), never by
  free-floating coordinates.
- **The governing equation or title is pinned to the top** (just under the safe line, y ≈ 300–340); the diagram
  fills the rest. An origin or axes may sit off-centre.
- **Inserted footage** sits in a 16:9 screen rectangle on a full-frame `#222222` plate.

## 5. Elements

- **Equations** built from separate pieces, so one term can move, recolour, dim or be boxed on its own.
- **Number plane:** blue-D lines every unit at 45% and every half unit at 16% (1.8 px); white axes (3 px at 80%)
  through the origin.
- **Graphs:** 5.4 px strokes in the concept's colour; a ghost copy at 50% behind a graph being redrawn.
- **Moving dots:** a solid 11 px dot with a soft glow (44 px, 35%). The only glow in the style.
- **Arrows and vectors:** 8 px (6 px for small ones), a triangular tip at most 60 px and a quarter of the arrow's
  length.
- **Braces** with a label (4 px white).
- **Surrounding box:** yellow, 3.6 px, 24 px clear of what it boxes, square corners, drawn around it.
- **Decimal counters** bound to a value.
- **Lines:** 6 px white; reference lines 3 px grey at 50%.

## 6. Motion

- **The curve:** smooth, 10t³ − 15t⁴ + 6t⁵ (zero speed and acceleration at both ends), written as
  `[0.5, 0, 0.5, 1]` (within 1% of it). Everything uses it.
- **Run times:** 2 s is the default for a real move; then 3, 1.5, 1, 5, 4, 6 s; long continuous moves 10–20 s; quick
  beats 0.3 s.
- **Holds:** 1 s after a step (the most common wait), then 2 s or 3 s.
- **Stagger:** lag ratio 0.1 (each part starts a tenth of the way into the previous one); 0.2 or 0.5 for slower
  builds; 0.05 or 0.01 for many small parts.
- **Moves, by how often they are used:**
  - **write** (text and equations): the outline is drawn left to right, the fill follows (2 s);
  - **fade** in or out with a 24 px shift (1 s);
  - **transform-from-copy:** a copy flies from where a thing is to where it is used, changing shape and colour on
    the way (1.5–2 s);
  - **show-creation:** a line, graph, brace or box drawn along its length (1–2 s);
  - **grow** an arrow from its tail (1 s);
  - **transform matching parts:** equation pieces slide to their new places;
  - **indicate / flash** for emphasis; **counters** change to a value (2 s).
- **Dim to focus:** what isn't in focus goes to 20% (shapes) or 35% (equation terms) over 1 s, then is restored.
- **Camera:** a 3D frame turns slowly (theta, phi) during long holds; zooms by changing the frame height.

## 7. Transitions and rhythm

- **No cuts inside a scene.** A new idea arrives by transforming what is already on screen; continuity is the point.
- **Rhythm:** animate (~2 s) → hold (~1 s) → next step. In an equation step: move the matching pieces, then hold.
- **Between scenes:** fade everything out (1 s), or keep the governing equation and clear the rest.
- **Voice:** the scenes are timed by their run times and holds; the narration is cut to them (or the holds are
  stretched to the voice).

## 8. Finish

- Pure black, crisp anti-aliased vectors. No grain, texture, vignette or gradients.
- Saturation 1.5×. Glow only on moving dots.

## 9. 3D look

3D axes, parametric surfaces and spheres over a blue grid, with a slowly orbiting camera, in Three.js or Blender
when needed (`needs.3d: false`; the previews are 2D). Surfaces take their concept colour with a darker shade (D/E)
on the back faces, lit softly, on pure black *(proposed; the source's shading values weren't taken)*.

## 10. Banned

- A variable changing colour, or two concepts sharing one colour, within a video.
- Cuts inside an explanation.
- Bold for emphasis.
- Upright variables, italic numbers.
- Grain, texture, vignette, gradients, glow (except on moving dots).
- Any background but pure black (except the `#222222` screen plate).
- Sentences on screen.
- Bouncy, linear or snappy easing.
- Characters, mascots, logos, channel branding, or anything copied from the source scenes.

## 11. Where it came from

- **3Blue1Brown's scenes** (`3b1b/videos`: `CLAUDE.md`, `custom_config.yml`, scenes of `_2026/cross_entropy` and
  `_2025/laplace`), researched in `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Math Explainer (generic
  grammar distilled from 3b1b scenes)". Licence: **CC BY-NC-SA 4.0**. Only the visual grammar is described here, in
  our own words, from usage statistics: no code, scenes, characters or branding were copied.
  - Taken (as rules): pure black; one colour per concept for the whole video; equations about 3× as common as text;
    emphasis by colour, box or dimming; dim values 0.2 / 0.35; the black backstroke on labels; relative placement
    on a fixed buff scale; the title or equation pinned to the top; run times (2 s most common), 1 s holds, lag ratio
    0.1; the move vocabulary (write, fade with shift, transform-from-copy, show-creation, grow arrow, matching
    transforms, indicate, counters); no cuts inside a scene; saturation 1.5×; glow only on moving dots; the grey
    plate for screens.
- **Manim's defaults** (`3b1b/manim`: `manimlib/default_config.yml`, `constants.py`, `utils/rate_functions.py`).
  Licence: MIT. Taken: every hex, the five shades per hue, the smooth rate function, the font-size scale, spacing
  buffs and stroke habits.
- **Changed for vertical:** the source is 16:9 (8 units tall, 14.2 wide); here the frame is 8 units tall and 4.5
  wide (one unit 240 px), so scenes stack top to bottom: the equation pinned at the top, the diagram below. Text sizes
  are Manim sizes × 1.67; text runs to 64 px rather than 60 so it reads on a phone.
- **Font:** CMU Serif isn't a Google Font; Old Standard TT is the closest one in the installed package.
- *(Proposed):* the 300 px counter, the 64 px text size, stroke widths in px (Manim's widths × 1.8), the Write
  effect's outline-then-fill wipe (an approximation of a per-glyph write), the 24 px fade shift, the 3D surface note,
  and the sample scenes themselves (a written title over a wave with a λ brace; a white beam splitting into three
  wavelengths; I ∝ 1/λ⁴ over a number plane with blue arrows 5.9× longer than red ones; (700/450)⁴ ≈ 5.9 boxed; a
  chain of three steps). The physics shown is true: Rayleigh scattering I ∝ 1/λ⁴, (700/450)⁴ = 5.86.
- Added to the catalog on 2026-10-31.
