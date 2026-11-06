# Sources: Crayon

## Lemo-Opuscar, style 01 "Crayon Picture Book"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/crayon-book/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Crayon Picture Book" (the research only; nothing
  from the repository was downloaded for this style).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Its demo films and stills are
  CC BY 4.0 (credit LemoLab); none were used here.

### Taken from it
- Palette: paper `#f4efe3`, indigo `#2d3263`, the demo crayons (yellow `#f5c63c`, orange `#ec8a3c`, red `#d4483c`,
  pink `#ee8ea4`, peach `#f4c7a4`, brown `#7a4b31`, ochre `#e7b867`, green `#62a24c`, sky `#79acd9`, violet
  `#6a5aa6`), white wax `#fbfaf4`.
- Rules: about a dozen crayons; outlines in one dark colour, never black; one white crayon for resist; one watercolour
  per film chosen for what it reveals, never painting characters; value from pressure.
- Type: Patrick Hand for words, Gaegu Bold for titles; glyphs tilted, offset and boiling on twos, written left to
  right; text never fades; ragged knock-out patches of paper, never a dark box.
- Elements: the crayon stroke (wobble ~1.7 px, width ±15%, tapered ends, denser core, 1–2 streaks; outline widths
  ~7 / 8 / 4–5 px); zig-zag colouring (overshoot 0–7 px, pressure 0.72–1.14×, a lighter cross-hatch at 40–50%); the
  character recipe (round head, ~2.5 heads tall, dot eyes with a white-wax catchlight, pink cheeks, tube limbs,
  mitten hands, hair outlined on its outer edge; faces on objects).
- Motion: everything drawn on twos; boil ±0.8 px with wobble ±0.9 px, background 0.6×, colouring still; lines drawn
  in 0.4–0.9 s; colouring row by row; substitution acting; colouring as an action.
- Finish: tooth anchored to the page; the wax-adhesion rule (tooth > 1 − 1.22 × pressure, soft edge ±0.07);
  the wash's edge pooling, blooms and wax resist; an emboss from the top left (~0.55); a warm vignette; no grain.
- Bans: as listed in STYLE.md section 10.

### How it was rebuilt
- Canvas/WebGL become SVG in Remotion: seeded value noise for the hand wobble and the boil; ribbons computed from the
  centreline; zig-zag rows computed by scanline; `feTurbulence` + `feDiffuseLighting` for the paper; an arithmetic
  `feComposite` threshold for the wax; `feDisplacementMap` and two blurs (pooled rim) and a low-frequency bloom for
  the wash; type with per-glyph `rotate` and `dy`.

### Proposed (not in the source)
- The cerulean wash `#3f78c8` and density 0.85 (the source has an ultramarine transmission only); muted `#5d6291`,
  faint `#ddd5c4`; type sizes; the curves and durations; the warm vignette `#b08a5a` at 16%; the tooth frequency
  0.42; the sample drawings.

### Changed for vertical
- 1920×1080 with a camera over one big page → one 1080×1920 page per sample, bigger type, fewer elements per page.
- 12 fps inside 24 fps → a 2-frame step at 30 fps.
