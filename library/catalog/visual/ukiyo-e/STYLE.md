---
name: style-ukiyo-e
description: Visual style "Ukiyo-e Print": an Edo-style woodblock print come to life on a tall pillar sheet (hashira-e). Flat colour blocks printed slightly out of register under a sumi key line, woodgrain, baren streaks and specks in every block, Prussian-blue bokashi skies whose edges wander, mist bands, layered fields, small travellers in conical hats, a double ink border, cream cartouches with a beni tab and a stamped red seal. Use when a video is made in this style.
---

# Ukiyo-e Print

## 1. In one line

Every frame is a complete woodblock print: flat colour from separate blocks, a carved black key line, the grain of the
wood and the rub of the baren in the colour, a sky that fades in bokashi, and a cream cartouche for the words. It
suits travel and journeys, Japanese culture and poetry, "one subject in many places or seasons", steps of a process
told as stations, and calm explainers about nature and the sky.

## 2. Palette

A set of 6–9 flat pigments, each printed from its own block; the paper is the only white.

| Role | Hex | Where |
|---|---|---|
| background (washi) | `#eee2c6` | the paper: foam, snow, mist, blank sky (no white pigment) |
| text (sumi) | `#231f1c` | every key line and every word |
| muted / faint | `#c7b893` / `#fbf6e9` | dark and light paper fibres |
| accent2 (Prussian blue) | `#1d3a66` | sky, water, mountains: the dominant family |
| prussianDark / prussianLight | `#13284a` / `#4d6f98` | the top of a bokashi sky, deep water / middle blues |
| trough | `#0f2344` | the inside of a wave, the deepest water |
| paleBlue / paleBlue2 | `#8db0c6` / `#bcd0d6` | reflections, the lower and palest sky |
| accent (beni red) | `#b8412f` | the sun, seals, a garment (rare) |
| beniPale / peach | `#e3a08a` / `#efc4a8` | dawn bokashi, cartouche tabs, mist at dawn |
| ochre / straw | `#cf9f4a` / `#c9a45c` | hats, roads, sunlight / straw, fields |
| green / greenDark / pine | `#8aa152` / `#50703c` / `#3e5a3a` | fields / trees / pine pads |
| indigoCloth / gaiters | `#2c4a70` / `#1d2c44` | clothing / dark cloth, pine trunks |
| mount | `#c9b690` | the mounting scroll between sheets |
| cartouche | `#f3e7c6` | cream slips |
| endGround | `#161a22` | the dark indigo behind the whole scroll |

- **One dominant hue family** for sky and water; red is rare; far layers pale and low in contrast, near layers
  saturated.

## 3. Typography

- **Cartouche titles:** Yuji Syuku (a brushed mincho), 60–88 px, numbers 230 px, tracking 0.02 em, in a cream
  cartouche with a thick and thin sumi border and a pale beni tab carrying the series title (Shippori Mincho 500,
  30 px); a red seal is stamped beside it.
- **Subtitle slips:** Shippori Mincho 500, 40–52 px, sumi on cream (96%) with a 2.6 px + 1 px border and a small red
  mark at the left; they print in over 0.22 s.
- **Titles live on the print** as cartouches and seals, never as floating type. Emphasis: the red seal stamp.
- **The smallest text** is 30 px. **Words:** about 8 at most.

## 4. Layout

- **The sheet is the frame:** a tall pillar print, a 3.4 px sumi border at x 44 / y 40 from the edges and a thin outer
  line 9 px outside; washi margin beyond.
- **A flat world:** depth by stacked horizontal layers (sky, mountain, mist, fields, road), mist bands and bold
  cropping; extreme foreground elements (a pine, a post) crossing the frame edge; never perspective.
- **Figures are small** in the landscape (130–170 px tall at full sheet).
- **Cartouches** sit in the sky (top right for a title, across the top for a headline); slips sit low; words stay inside
  230 px top and 330 px bottom, and off the right-hand 120 px.

## 5. Elements

- **Colour blocks:** flat shapes, each block group printed slightly out of register: g1 blues (+2.2, −1.3 px), g2
  greens and secondaries (−1.8, +1.9), g3 reds and figures (+1.5, +2.2). Every block carries woodgrain (iso-lines of a
  warped noise field at 14%), baren streaks (lighter, ~30%) and goma-zuri specks.
- **The key block:** sumi lines 2.4–3 px, tapering at both ends with ±28% slow width variation; distant things get a
  grey key line (55%) or none.
- **Bokashi:** a vertical gradient whose top edge wanders ±26 px per column, never stripes; the only gradient allowed.
- **Motifs:** mist (suyari-gasumi) as long rounded flat bands fading at both ends; an asymmetric mountain (concave
  slopes s^1.55 and s^1.8, a notched summit, a snowcap of pointed drips left as paper); pines with flat-topped needle
  pads; fields as flat parallel layers with slanted parallel cross lines; rain or light as sets of fine straight lines;
  water as banded blues with bokashi between and sun reflections as broken dabs; a traveller in a low conical hat that
  hides the face.
- **Cartouches and seals:** cream slips with thick and thin borders, a beni tab, red seals with carved lines and
  chipped edges.
- **No shading or lighting on forms.**

## 6. Motion

- **Prints are still:** most of the frame never moves; one or two small actions per view (steam, rain, a lantern, a
  leaf).
- **print:** each block appears over 0.34 s (cubic-out) under a diagonal baren sweep with a ragged edge, sliding 6 px
  into registration as it lands; blocks print in order (sky, mountain, fields, figures, key lines, cartouche).
- **seal:** stamped in, scale 1.35 → 1 in 0.2 s. **cartouche:** fades in with a 14 px slide in 0.3 s.
- **Stepping:** figures and nature at 8 fps, rain and fast water at 12 fps; the camera on ones (a stepped camera
  judders).
- **Camera:** a locked frame on one sheet; a handscroll slide through the mounting gap to the next sheet (1.0 → 0.6 s as
  the journey speeds up); a very slow push toward a framing device (1.00 → 1.065); a tilt past the border into the
  mount; a pull back from one sheet to the series; a cut to a blank sheet (ma).
- **A native move needs a held beat of ~1 s.**

## 7. Transitions and rhythm

- **Allowed:** scroll slides, printing reveals, a wash back to blank paper, a cut to a blank sheet. No cross-dissolves,
  no 3D flips.
- **Rhythm:** jo-ha-kyū (slow opening → gathering pulse → rush to a peak), then absolute silence (ma). A wooden clap
  for each printed block, accelerating.

## 8. Finish

- **The paper is the grain:** washi with light and dark fibres (14%); no film grain, no vignette, no glow.
- **Misregistration, woodgrain, baren and specks** in every colour block; specks only (12%) in the key block.
- **Never too much speckle or fibre** (a sandpaper look).

## 9. 3D look

None.

## 10. Banned

- Flat vector shapes with a paper overlay (blocks need woodgrain and misregistration).
- Bleeding washes (that's ink wash); light and shade modelled on forms.
- Perspective grids for fields; gradients other than bokashi; white pigment.
- Cross-dissolves or 3D flips; a stepped camera.
- Reproducing a famous print, or copying its composition or characters.
- Too much speckle or fibre.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 08 "Ukiyo-e" (`styles/ukiyoe/STYLE.md`, `DEMO.md`),
  researched in `docs/research/styles/five-skills.md`, section "Ukiyo-e". Its demo films and stills are CC BY 4.0;
  none were used.
  - Taken: every palette hex (washi, fibres, the Prussian family, trough, pale blues, sumi, beni family, ochre and
    straw, greens, indigo cloth and gaiters, mount, cartouche, end ground); the pigment-set rules; Shippori Mincho 500
    subtitle slips with a double border and a red mark; Yuji Syuku for cartouche titles; titles as cartouches and seals,
    never floating; the double ink border; flat layers, mist and cropping, never perspective; small figures; the
    registration offsets of g1 / g2 / g3; woodgrain, baren and specks (and only specks on the key block); fibres;
    bokashi with a wandering edge; key lines 2.4–3 px with ±20–35% width variation and tapered ends, grey for distant
    things; the mist, mountain, pine, field, rain, water and figure recipes; still prints with one or two small
    actions; the printing reveal (~0.34 s, a diagonal baren sweep, sliding into registration); the seal stamp
    (1.35 → 1 in 0.2 s); 8 / 12 fps stepping and an unstepped camera; the camera vocabulary; jo-ha-kyū and ma; no
    grain; the bans.
  - **Rebuilt for Remotion:** the canvas renderer becomes SVG: blocks as groups offset for misregistration, an
    feTurbulence filter with a periodic table for woodgrain iso-lines, lighter baren streaks and specks, a
    displacement along x only for the bokashi edge, ribbons for the key line, a ragged diagonal mask for the printing
    sweep.
  - **Changed for vertical:** the source is a 1920×1080 sheet (with the note that a portrait sheet would suit the
    tall hashira-e format); here every sample is a 1080×1920 pillar print with depth stacked top to bottom,
    cartouches carrying a few short lines, slips and type bigger (slips 40–52 px instead of 42 px at 1080 high), and one
    view per sheet.
- *(Proposed):* the type sizes; texture strengths in px; the seal's carved lines (no real characters); the sample prints
  (a traveller below an asymmetric snow peak and a cropped pine, a dawn sun over banded sea, light as ochre lines into
  two flat discs with blue lines scattering and red lines going on, the number in a cartouche over two bars in the true
  5.9 : 1 ratio, three stations, the traveller under a full blue sky).
- Added to the catalog on 2026-11-04.
