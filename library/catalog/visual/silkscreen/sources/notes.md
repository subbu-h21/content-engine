# Sources: Silkscreen

## Lemo-Opuscar, style No. 54 "Silkscreen" (Silkscreen Travel Poster)

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/silkscreen-poster/` (`STYLE.md`, `DEMO.md`,
  `style.json`); film https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/silkscreen-poster.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Silkscreen Travel Poster". Nothing from the repo
  was downloaded for this style; `silk.js` and `poster.js` were not read.
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). No code was copied:
  pulls, inks and shapes are rebuilt in SVG from the documented values. Big Shoulders and Outfit are SIL OFL.

### Taken from it
- Paper `#F2E8D2`; the demo's four poster palettes (dawn, noon, golden, dusk) and the title-banner inks
  (`#F7C66B #E4683F #2F6F73 #1C2A33`); the palette rules (≤ 6 inks by role, light far → dark near, rare accent, one
  template re-inked per item, text ink by WCAG contrast).
- Big Shoulders Display (900 names, 800 values; on Google Fonts it is now the single family "Big Shoulders") and
  Outfit 600 labels; the poster template (1000 × 1500 u, 26 u border, art to 1140 u, info band 1148–1474 u with a 6 u
  sun rule and content-sized stat columns, names auto-fit 122 → 60 u, values ≥ 48 u, headers tracked out at 62 u).
- One path per ink with knock-outs as holes; registration 1–3 px (`[2, −1]`); the trap ghost ~2 u; ink-thickness
  rims; stepped bands; concentric sun rings; midpoint-displaced ridges with jagged lit facets; pines as drooping tiers;
  forests on a solid base; water with glint bars; the dashed route stamped segment by segment.
- Motion: linear pulls with a ragged front and ~30 u drag tail, accents half a beat late, info items 0.18 s apart,
  screen lift ~0.4 s, re-ink with a −12° blade in ~0.35 s, a 0.65 s ease-out pull-back, snapping into register; the
  camera vocabulary; transitions (squeegee, truck through a foreground silhouette, table move; no dissolves or bare
  cuts); rhythm and holds; the texture budget (mottle ~55%, pinholes ~75%, light grain); the banned list.

### Proposed (not in the source)
- The workbench colours (`#5b4636`, `#2e231b`), the tape `#e6dcc2`, the muted stains.
- Pixel placement for 1080×1920 (poster at x 60, y 160, 0.96 px a unit); rim width 1.5 u at 22%; trap opacity 20%;
  1,600 pinholes; grain 0.03; vignette 0.18; pull 0.32 s and 0.3 s between inks (the source ties them to beats).
- The sample posters' wording (headers, stat labels such as "TONIGHT / LOOK UP", "IN / OUT"). Facts are the sample's
  own (450 nm, 700 nm, 5.9×).

### Changed for vertical
- The source hangs the 2:3 poster in a 16:9 frame at 0.49 scale (labels ~18 px, values ~31 px at 1080p). Here the
  poster nearly fills the vertical frame (labels 33 px, values 61 px), the bench shows above and below, and each sample
  is one poster in its own palette instead of a wall of three.
