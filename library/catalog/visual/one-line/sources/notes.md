# Sources: One Line

## Lemo-Opuscar, style 05 "One-line Drawing"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/one-line/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "One-line Drawing" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: paper `#F4EFE4`, ink `#1D1A17` (words at 84%), the demo accent `#B3332B`, the pen shadow at 15%; ink on
  paper only, one accent once, never a second.
- Type: Sacramento title written over 1.6 s in empty paper; Caveat 500 words written in 0.2 s + 17 ms a character
  behind a paper-coloured halo, faded out over 0.45 s; Caveat 600 caps with wide tracking for the end card's style
  name.
- Layout: most of the frame is paper; the nib in the central ~72% × 66%; the finished picture centred; titles in
  empty paper.
- Elements: the line as a filled polygon around the path; width = base × pressure (0.66 + 0.8·exp(−v/300)) × noise
  (±8%); the bleed (blurred, 22%); pooling dots where slow; the teardrop stop blot; the pen never drawn (shadow
  wedge, contact dot); retracing is legal; connectors on natural lines; lines ≥ 5 units apart.
- Motion: on ones; timing by chapter windows and curvature (1 + K·turn, smoothed); speeds; stopping as an event; the
  camera following the averaged nib (−0.55…+0.4 s) with a follow weight, then the continuous pull-back.
- Transitions and rhythm: no cuts, morphs; the score written to the drawing; the 40–50 s arc template.
- Finish: procedural paper (mottling, long fibres), vignette 0.13, no grain or glow.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- Paths authored as point lists (Catmull-Rom curves, arcs, waves, a spiral for a decimal point), joined into one line;
  SVG ribbons for the line and its bleed; an SVG transform for the camera; text revealed by a clip behind a halo.

### Proposed (not in the source)
- The blue accent `#2c5d97` (this topic's stretch), muted `#4a4540`, faint `#e6dfd0`; base width 5.2 px; K = 12;
  520 px/s; zoom and follow values; curves; type sizes; the sample pictures.

### Changed for vertical
- 1920×1080 → 1080×1920: the script title in the top third, the picture below; bigger words; one picture per sample.
