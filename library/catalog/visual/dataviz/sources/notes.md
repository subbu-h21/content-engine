# Sources: Data Story

## Lemo-Opuscar, style No. 23 "Data Storytelling"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/dataviz/` (`STYLE.md`, `DEMO.md`, `style.json`). Read through
  `docs/research/styles/five-skills.md`, section "Data Storytelling (pencil chart on cream paper)". Nothing was
  downloaded for this style.
- **Licence:** MIT for code and docs; demo film and stills CC BY 4.0 (credit LemoLab). No code was copied. Newsreader,
  Caveat and IBM Plex Mono are SIL OFL. The ramp is the ColorBrewer RdBu family.

### Taken from it
- Paper, dot grid, ink, gridlines, zero line, ticks, blue and red leads, wood, the diverging ramp; colour encodes the
  value only.
- Newsreader, Caveat, IBM Plex Mono and their roles; glyph rotation ±1.7°, jitter ±2.5%, 16% knock-out; the figure
  caption (hairline rule, mono kicker, serif line).
- Dots with a landing pop and ripple, wobbly leaders, un-closed rings, ink shapes, the red-blue pencil, the dashed next
  cell, stripes, pinned notes, the memory zone.
- Motion, camera vocabulary, transitions as chart operations, the banned list.

### Proposed (not in the source)
- Every px size for the tall frame; the use of the ramp's cold half as a sequential scale.
- The sample data, computed in `scenes/parts.tsx` as (700 ÷ λ)⁴ (Rayleigh scattering relative to 700 nm). 450 nm gives
  5.85, shown as the sample's 5.9. Nothing on screen is typed in by hand except that sourced value.
- All sample scenes.

### Changed for vertical
- A 1500 × 520 plot became about 814 × 620; headline above the plot; the caption block sits at y = 1380–1530, clear of
  the bottom 330 px; ticks grew to 28 px.
