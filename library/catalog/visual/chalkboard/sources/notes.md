# Sources: Chalkboard

## Lemo-Opuscar, style 73 "Chalkboard"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/chalkboard/STYLE.md`, `DEMO.md`, `style.json`; chalk and room
  colours and subtitle sizes from `demo/js/chalk.js`, `stage.js`, `app.js`, `post.js` (as quoted in the research).
- **Research file:** `docs/research/styles/five-skills.md`, section "Chalkboard" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: slate `#0f1c15`, back board `#0b130f`, white chalk ≈ `#F2F0E6`, orange accent ≈ `#FF8F42`, second hand
  ≈ `#FAE694`, wood `#6a4a2e`, tray `#7a5838` / `#5d4128`, wall `#bdb8a8`, dado `#56705f`, clock `#f6f3ea` and
  `#222`, painted grid lines `rgba(196,176,112,.24–.36)`, plate `#0a0f0c` at 62%, subtitle `#d9d4c6`, window patch
  `rgba(255,225,180,.16)`, wet streak `rgba(0,12,7,.36)`.
- Rules: three chalks with jobs; the accent never decorates; no rainbow, gradient or glow; keywords only, large
  letters; a flat-on camera; one wide classroom shot; nothing typeset or faded in.
- Motion: chalk speeds; the stroke build; one wipe leaving an even haze; the wet streak drying back; camera moves and
  cubic easing; voice gaps and the held verdict.
- Finish: lens vignette 0.42; slate grain and slow mottling; a warm window patch; grain 1.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- A single-stroke Latin alphabet drawn for this style (glyphs.ts), sampled into points; strokes revealed by
  dash offset; an SVG chalk filter (feDisplacementMap edge, feTurbulence grain threshold, a blurred powder halo); the
  wipe as an SVG mask; the wet streak as a blurred band.

### Proposed (not in the source)
- The pale blue accent chalk `#8fc3e8` for this blue-light lesson (the orange is kept as `accentDefault`); Alegreya
  italic for the plate; type sizes; the 80% draw share; wipe width 170 px and haze 8%; dry over 2.6 s; slate texture
  amounts; the clock time; the samples.

### Changed for vertical
- 1920×1080 over a 6400×1700 slate → one flat-on 1080×1920 region per sample; a narrower column and smaller big
  writing (92–300 px); the classroom stacked top to bottom (wall and clock, board, tray, dado).
