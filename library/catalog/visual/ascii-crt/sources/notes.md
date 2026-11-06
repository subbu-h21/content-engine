# Sources: ASCII CRT

## Lemo-Opuscar, style No. 22 "ASCII / CRT Terminal"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/ascii-crt/` (`STYLE.md`, `DEMO.md`, `style.json`), shared post
  `core/post/crt.js`. Read through `docs/research/styles/five-skills.md`, section "ASCII / CRT Terminal". Nothing was
  downloaded for this style.
- **Licence:** MIT for code and docs; demo film and stills CC BY 4.0 (credit LemoLab). No code was copied. VT323 is
  SIL OFL.

### Taken from it
- Colours: phosphor `#FF6605` / `#FFB000` / `#FFEBB8`, second colour `#BFE4FF`, glass `#090604`; the one-phosphor and
  one-second-colour rules; levels 0.42 / 0.7 / 1.0; inverse video.
- Type: VT323, 1 : 2 cell, capitals, the LOG strip (dashed separator, inverse tag, `> ` prompt, status lines).
- Pictures: density ramp by ink coverage, dither 0.7, gamma 1.25, blank level 0.05, silhouettes not noise.
- Motion: typing speeds, roller digits, letter fall, afterglow, power on/off, push by grid size.
- Transitions, bloom 0.55 / halo 0.22, scanline strength 0.3, flicker 1.2%, reflection, no grille; the banned list.

### Proposed (not in the source)
- Faint and bezel colours; every grid and size for the tall frame; banner numerals; glyph bars; line glyphs by
  direction; 4 px scanlines (the source's 3 px moirés in half-size previews); rounded glass with edge darkening in
  place of a barrel warp; all sample scenes.

### Changed for vertical
- Grids of 20 / 80 / 240 columns across 1920 px became 9–60 columns across 936 px; the LOG strip moved to
  y = 1400–1575, clear of the bottom 330 px; a dim prompt line sits at the top safe line.
