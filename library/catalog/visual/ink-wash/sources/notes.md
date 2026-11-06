# Sources: Ink Wash

## Lemo-Opuscar, style 03 "Chinese Ink Wash (Xieyi)"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/ink-wash/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Chinese Ink Wash (Xieyi)" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: rice paper `#F2ECDE`–`#F3EBDD`, the ink ramp rgb(.52,.55,.58) → rgb(.075,.068,.062) (converted to
  `#858C94` and `#13110F` by the research), vermilion `#B02E22`; the five tones (.96 / .82 / .60 / .34 / .16) and what
  each is for; ink only, one vermilion, far pale and near dark, remove ink when busy.
- Type: Cormorant Garamond italic 500 inscriptions (46 px at 1080 high, 1 px tracking, no box, ≤ 2 lines, in empty
  paper, a small vermilion square at the start of a line, wet → dry in ~0.35 s); titles in vertical columns in
  Cormorant SC 600 with a vermilion seal; the end card in Cormorant SC 600 with 14 px tracking.
- Layout: 60–80% empty paper; the high wide with a small figure; lead room.
- Elements: the brushstroke model; loaded strokes without outlines; masses dissolving into mist; landscape recipes;
  water as blank paper with open rings; xieyi figures; the seal knocked out of an irregular red square with speckles.
- Motion: figures on twos; stable strokes seeded by index with a small width boil (5-drawing cycle); painted in stroke
  order; stillness then the decisive stroke in ~4 frames; the camera vocabulary.
- Transitions: ink blooms, scroll pans, mist; no generic dissolves or wipes; the one hard cut to an extreme close-up.
- Finish: procedural paper (mottling ±7%, fibres, flecks), ink multiplied, a wet layer with edge pigment
  accumulation, vignette ~.22, no grain, no glow.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- SVG in Remotion: body ribbons and bristle polylines from seeded value noise; masses with feDisplacementMap and a
  small-blur − large-blur rim; feTurbulence paper; a fine displacement for ragged stroke edges; type for inscriptions
  and columns; painted numerals as brush centrelines.

### Proposed (not in the source)
- Faint `#e2d9c6`; the 天 character in the seal; profile shapes; gap length 170 px; stroke speed and curves; type sizes
  for vertical; the sample paintings.

### Changed for vertical
- A 1920×1080 handscroll → a 1080×1920 hanging scroll: depth stacked top to bottom, the vertical tilt as the main
  move, one painting per frame, bigger inscriptions (50–66 px) and columns (84 px).
