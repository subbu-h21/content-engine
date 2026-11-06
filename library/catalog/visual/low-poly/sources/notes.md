# Sources: Low-poly

## Lemo-Opuscar, style No. 43 "Low-poly Isometric Island"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/lowpoly-island/STYLE.md`, `DEMO.md`, `style.json`
  (category Materials & 3D). Read through the research notes `docs/research/styles/five-skills.md`, section
  "Low-poly Isometric Island". Example frame (not downloaded):
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/lowpoly-island.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab); third-party assets per
  the demo's `CREDITS` (none used). Nothing from the demo was copied; the look is rebuilt from its written rules.
  Josefin Sans and Quicksand: SIL OFL.

### Taken from it
- Every tile, wall, roof, pine, leaf, window and lighthouse hex; the dawn / day / dusk / night keyframes (zenith,
  horizon, deep, shallow; dusk sun `#ff9a68` at 8°; moon `#a9b0e8`); the subtitle colour `#fffdf8`.
- Rules: pastel, low contrast, a handful of hues; time of day as interpolated colour sets; night desaturates toward
  blue-violet with warm windows the only bright things; no outlines, no black.
- Type: Quicksand 600 subtitles (44 px at 1080p) with a soft navy drop shadow (blur 14) and the hex icon whose top
  follows the time of day; Josefin Sans 600 capitals with wide tracking (78 px, 16 px), letters rising one by one 55 ms
  apart from under a thin water line with overshoot; a 300-weight lower-case sub-line.
- Camera: orthographic, azimuth 45°, elevation 30° (20–25° at night, ~50° map-like); never a perspective change.
- Elements: pointy-top hex columns with the axial → world formula, heights by material (sand 0.36–0.42, grass
  0.74–0.9, hills 1.1–1.4, rock 1.95), a 0.16 top cap, a 1.5% gap, ±4% lightness jitter; box houses 0.92 wide with
  gable-prism roofs (overhang 0.08) and emissive windows; 6-sided cone pines; icosahedron trees; a lighthouse of four
  tapered 8-sided rings; the light ribbon with a 2.4× halo at 0.32; the surf ring (0.99–1.12 r, ≈ 0.32).
- Motion: rise from below (0.5 s cubic, overshoot `sin(13s)·e^(−7s)·0.18`), drop and stack (2.4 units in 0.22 s,
  bounce, squash), pop (`1 − e^(−9s)·cos(17s)`); growth on a 16th-note grid, one piece per slot, speeding up by
  density; the camera vocabulary; hard cuts on the beat; no dissolves or whip-pans.
- Finish: bloom 0.22 day / 0.5 night; no grain; very light edge tilt-shift (3 px).

### Proposed (not in the source)
- The navy ink `#2b3157` for type on light skies and for the shadow; the sunlight colour `#fff3d6`; dawn and day sun
  colours; intensities normalised to 0–1.
- The 2D light model (ambient 0.76, diffuse 0.38, sun tint 30%, sky haze 10%) standing in for three.js lighting and
  GTAO; the screen-space triangle water (84 px cells, ±7 px) standing in for the 3D water plane.
- Every px size; emphasis colours on titles; the blue shard bursts; the sample scenes (the rising island, six spectrum
  columns around a faceted sun, the air molecule, two hex columns as the 5.9× chart, three tiny islands, the island at
  night). The edge tilt-shift is described but not drawn in the previews.

### Changed for vertical
- The sky band stays in the top third (430–760 px of 1920); the island sits in the middle; subtitles move from 118 px
  above the bottom to under the island, above y = 1470.
- Bigger type with fewer words a line (titles 104 px instead of 78; subtitles 54 px instead of 44).
- One island per frame instead of wide panoramas; lists stack three small islands with their text beside them.
