# Sources: Ukiyo-e Print

## Lemo-Opuscar, style 08 "Ukiyo-e"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/ukiyoe/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Ukiyo-e" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: washi `#eee2c6`, fibres `#fbf6e9` / `#c7b893`, Prussian `#1d3a66` / `#13284a` / `#4d6f98`, trough
  `#0f2344`, pale blues `#8db0c6` / `#bcd0d6`, sumi `#231f1c`, beni `#b8412f` / `#e3a08a` / `#efc4a8`, ochre and straw
  `#cf9f4a` / `#c9a45c`, greens `#8aa152` / `#50703c` / `#3e5a3a`, indigo cloth `#2c4a70` / `#1d2c44`, mount
  `#c9b690`, cartouche `#f3e7c6`, end ground `#161a22`; the pigment-set rules.
- Type: Shippori Mincho 500 slips (42 px at 1080 high, double border, red mark, 0.22 s in, 0.25 s out); Yuji Syuku
  titles; cartouches with a beni tab and a seal.
- Layout: the sheet is the frame with a double border; flat stacked layers, mist, cropping, extreme foreground; small
  figures.
- Elements: registration offsets g1 (2.2, −1.3), g2 (−1.8, 1.9), g3 (1.5, 2.2); woodgrain α .1–.17, baren ≈ .38, specks
  ≈ .3, key-block specks .12, fibres ≈ .09; bokashi with an edge wandering ±20–30 px; key lines 2.4–3 px with
  ±20–35% width jitter; the mist, mountain (s^1.55 / s^1.8, notched summit, snowcap drips), pine, field, rain, water and
  figure recipes.
- Motion: still prints; 8 / 12 fps stepping, camera on ones; the printing reveal (~0.34 s, diagonal baren sweep,
  5–6 px slide); the seal stamp; the cartouche fade and slide; the camera vocabulary.
- Transitions and rhythm: scroll slides, printing reveals, washes to paper, cuts to blank; jo-ha-kyū and ma.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- SVG blocks offset for misregistration; one block filter (feTurbulence through a periodic table for woodgrain
  iso-lines, lighter baren streaks, specks); bokashi as a gradient displaced along x only; key lines as tapered
  ribbons; a ragged diagonal mask for the printing sweep.

### Proposed (not in the source)
- Type sizes; the exact texture strengths in this renderer; carved lines in the seal instead of characters; the
  sample prints.

### Changed for vertical
- A 1920×1080 sheet → a 1080×1920 pillar print (hashira-e), which the research notes suits the medium; depth stacked
  top to bottom; cartouches with a few short lines; bigger slips.
