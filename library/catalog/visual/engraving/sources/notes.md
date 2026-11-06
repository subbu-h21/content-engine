# Sources: Engraving

## Lemo-Opuscar, style No. 53 "Engraving" (Copperplate Engraving)

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/engraving/` (`STYLE.md`, `DEMO.md`, `style.json`);
  film https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/engraving.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Copperplate Engraving". Nothing from the repo
  was downloaded for this style; its hatch engine (`burin.js`) was not read (the notes cover only its documented API).
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). No code was copied:
  the hatching engine here is new SVG code built from the documented values. Bodoni Moda and Pinyon Script are SIL
  OFL.

### Taken from it
- Colours: laid paper `#f1e8d2`, foxing `#9a6a34`, plate tone `#e8ddc2` at 55%, ink `#1c1510`, script `#2b1e14`,
  slip `#f4eddb`, washes (wings `#a9c3cf`, abdomen `#d9962a`, thorax `#a8743e`); the rule "two values, tone is line
  density, colour is transparent wash, one stronger pigment, never on lettering".
- Type: Bodoni Moda capitals (tracking 0.16 titles, 0.14 labels), Bodoni Moda italic for names, Pinyon Script for
  notes and the subtitle on a deckled slip (on 0.1 s before, off 0.6 s after, ≤ 2 lines, 860 px); letters cut glyph
  by glyph, script written in one stroke, nothing fades.
- The plate mark with its bevel (dark top/left, light bottom/right); the ruled border (2.4 px rule + 0.8 px hairline
  9 px inside).
- Line families and ratios: crossing ×0.78 width / ×1.1 spacing, third ×0.6 / ×1.25; thresholds ~0.14, ~0.48,
  ~0.76; the swell law width × (0.2 + 0.8·sin(πu)^0.7); contours 1.8–2.4 px swelling ×0.45–1.35 in pinching runs;
  one light `{x: −0.55, y: −0.62, z: 0.56}`; tone from shape (sphere, cylinder), occlusion.
- Roundels (double rule 2 + 0.75 px, 4 px apart, ruled ground, white halo; fly on an eased arc with a 30 px lift,
  growing log-linearly); leaders (0.95 px, a dot on the part, ≥ 34 px clearance, italic figure number).
- Hand colouring (multiply under ink, spill 3.5 px, misregister 2/1.5 px, tide-line, density lift 0.55; blooms from
  where the brush touched, 1.25–1.6 s, 0.42 s apart).
- Cutting order, the camera vocabulary, printmaking transitions, holds, rhythm notes, banned list.

### Proposed (not in the source)
- Every px size for 1080×1920; line spacing 5 px and minimum width 0.7 px (the source's ~1/180 of the figure height
  and 0.18 px would turn to grey on a phone); burin speed 2,600 px/s (900–1,400 for waves); 0.045 s a glyph with a
  0.9 s cap per line; the script's writing speed.
- Plate content for the sample: a seascape vignette with a sun, a fan of five waves with wavelength drawn
  proportional to nm (red 700, yellow 580, green 530, blue 450, violet 400 — approximate centre wavelengths), an N₂
  molecule as two hatched spheres, line-filled numerals, hatched cylinders as bars; the wording "Plate I", "Fig. 2",
  "a plate on scattered light", "del. et sculp.".

### Changed for vertical
- The source sheet is 1920×1080 with the plate mark at (70, 44)–(1850, 1036) and roundel slots in four corners. Here
  the plate mark and border run the full 1080×1920, the subject sits in the upper middle, lettering sits under it
  (titles 74 px vs 50 px, labels 26 px vs 17 px, script 48 px vs 29 px at 1080p), and roundels go lower right or in a
  column on the left.
