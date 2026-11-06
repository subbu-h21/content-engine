# Sources: Whiteboard

## Lemo-Opuscar, style 06 "Whiteboard Explainer"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/whiteboard/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Whiteboard Explainer" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: board `#fbfbf9` → `#eeede9`, ghost greys `#9aa0a8` / `#8aa0c8`, inks black `#23262c`, blue `#2a5cb3`,
  orange `#d97757`, wall `#d8d3ca`, window sheen white at 10–16%; three colours with fixed meanings; the monochrome
  variant; the accent only on its marker cap and the magnet.
- Type: a single-line hand (EMS Tech, from Architects Daughter), glyphs jittered ±2° rotation and ±3.5% baseline and
  scale; burned subtitles in Architects Daughter on an off-white rounded label at ~90% with a short accent dash;
  clauses of at most 44 characters; emphasis by accent, box, double circle and timing.
- Layout: one big board, regions by idea, a label fully in or out of a shot, the bottom kept free for subtitles,
  frame and wall only past the board's edge.
- Elements: lines, curves, polys, arcs, circles that overlap past closure, rectangles as four strokes with corner
  overshoot, arrows, dashes, hatch; floating markers (white barrel, colour band and posted cap, felt nib, cast
  shadow); the charcoal eraser with an orange label; the glossy orange map-pin magnet; ghost marks; no hands.
- Motion: the stroke curve u − sin(2πu)/(2π) × 0.8; the stroke build (wobble ±2.6 px at ~220 px, tremor, chisel
  0.8–1.0, ramp 0.72 → 1, 12% taper, pooled dot, 6–11 px); durations (title ~3 s, label 0.3–0.8 s, a drawing ~1 s);
  pen hops and parking after 0.75 s; the magnet's 0.3 s drop; the eraser; the 2D camera and its vocabulary.
- Finish: ink ~0.94 multiplied; a dry-marker texture subtracted; scuffs and scratches; the sheen; grain.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- SVG ribbons around seeded-noise centrelines; the dry texture as an feTurbulence streak mask; board textures as
  feTurbulence; Architects Daughter revealed behind the marker (not true stroke order); one `Pen` shows the marker in
  use and swaps colours through the frame edge.

### Proposed (not in the source)
- Frame `#c9ccd0` and eraser `#3a3c40`; type sizes; the stroke speed (~1100 px/s); the 0.36 s colour swap; the
  marker's drawn proportions; hop and magnet curves; scuff 6%, scratch 5%, sheen 13%; grain 0.02; the bezier
  `[0.48, 0.04, 0.52, 0.96]` fitted to the source curve (max error 0.003, computed for this style); the samples.

### Changed for vertical
- 1920×1080 over an 8000×4500 board → one region per 1080×1920 frame, stacked top to bottom; bigger words; the
  subtitle label above the bottom safe line instead of the bottom 12%; 34-character clauses.
