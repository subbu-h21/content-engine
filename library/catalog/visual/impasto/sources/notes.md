# Sources: Impasto

## Lemo-Opuscar, style 04 "Impasto Palette Knife"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/impasto/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Impasto Palette Knife" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: sky `#34507e` / `#d99a78` / `#f7dca0`; facades `#dca064` / `#c98d7e`; shutter `#3f7a6c`; awning `#b8342a`;
  cadmium red `#dc2f28`; umbrella yellow `#f4bc2a`, cobalt `#2f62c0`, viridian `#23906c`, magenta `#cc3a82`, orange
  `#ee7a2a`, turquoise `#26aab4`, violet `#6e4cc0`; the grey world with a 5% residue.
- Rules: broken colour with a second dragged colour; stroke-to-stroke gradients; warm light, cool shadow; the purest
  chroma for the subject; colour as the event.
- Type: titles laid in with the knife (a ~1 s sweep), small text crisp, plain subtitles ≤ 2 lines.
- Layout: value-planned sets readable at 480 px; hard edges and small strokes for the subject, big calm planes
  elsewhere; the camera inside the plate.
- Elements: the knife stroke (1.7–3.1 × r long, 0.95–1.45 × r wide, slanted ends, skew ±0.55, angle ±13°, value
  ±6%, ridge, lip, running-out streaks); strokes never crossing shape groups; the thin underpainting; reflections as
  dabs; figures with taper, a lit edge and defining dabs.
- Motion: static paint never moves; no boil; actions on the beat; anticipation → action → follow-through; the reveal
  wave and paint-over sweeps; raking light at the peak; the camera vocabulary.
- Finish: light [−.55, −.6, .7], ambient .8, diffuse .28, specular .16–.3; no grain.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- Each stroke in SVG with its own body, dragged colour, striations, lips and cast shadow; planes clipped to their
  shapes; one raking-light filter (luminance as height → feDiffuseLighting + feSpecularLighting); type as a clip
  filled with knife strokes.

### Proposed (not in the source)
- Cream `#f4ead6`, umber `#3b2c24`, dark umber `#2a201b`, ultramarine `#1f2a6e`; Fraunces; sizes; the grid and ridge
  values; curves; reveal speed; the pop spring; vignette; the samples.

### Changed for vertical
- 1920×1080 → 1080×1920: scenes stacked top to bottom, titles much bigger, one idea per frame, similar stroke sizes.
