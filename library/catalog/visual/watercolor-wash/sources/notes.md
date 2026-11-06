# Sources: Watercolor Wash

## Lemo-Opuscar, style No. 02 "Watercolor"

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/watercolor/` (`STYLE.md`, `DEMO.md`, `style.json`);
  library name "Watercolor Brush"; demo film *Follow the Rain* (113.6 s),
  https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/watercolor.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Watercolor Field Journal (lib: Watercolor
  Brush)". Nothing from the repo was downloaded for this style; the notes were the source.
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). The demo's music
  (Scott Buckley, *Wildflowers*, CC BY 4.0) isn't used. No code was copied: the washes and strokes are rebuilt in
  SVG (filters, masks, ribbons) from the documented values. Cormorant Garamond, Caveat and IBM Plex Mono are SIL OFL.

### Taken from it
- Paper `#f1e9da` (three octaves of noise ±3.5%, 2,600 curved fibres ±3.5%, fine grain, 5% vignette); ink
  `#2b2520`, ink 2 `#3d3129`; vermilion seal sun `#cf4f2c` with seven dry-brush bars `#b8401f`; rain blue `#3f7fa8`.
- From the STYLE.md harbour example: sky `#f3e2c8` (here "warm"), water `#9fb4c4` (here "sky"), hulls `#5f7486`
  (here "deep"). From the rainfall map ramp: `#cf7c4f` (rust), `#cda35f` (ochre), `#7f9a6c` (green).
- Colour rules: paper is the white, darker = more passes, 3–5 hues plus ink, one accent for one recurring element,
  quantised ramps.
- Fonts and roles: Cormorant Garamond (titles italic, subtitles italic 500), Caveat 500/600 hand notes over a
  12 px paper halo with pen leaders, IBM Plex Mono labels with 3 px tracking.
- Wash: 3 jittered passes at a ÷ 3 × 1.6. Stroke: ±22% width roughness, rib 0.62 / 0.92, opacity 0.92,
  clamp(round(w ÷ 3.2), 3, 9) bristles at 30–85%, dash runs 18–90 px, gaps up to w ÷ 2, early ends.
- Motion: painting order (structure before detail, each stroke clamp(4/N, .12, .5) of its group), burst 0.9 s, seal
  1.6 s, mist erase 3.3 s, sway values, subtitle fades 0.25 / 0.35 s; smooth easing only.
- Transitions (brush-edge wipe, mist, page turn, camera; no cuts or dissolves between unrelated pictures) and the
  banned list.

### Proposed (not in the source)
- Faint `#b9ab95` and violet `#6b5b8e` (the source names no violet; it's only used in a spectrum).
- Every size for 1080×1920; the curves for `ss`, `eio`, `eo` (named in the source, no formula given); note writing
  speed 0.045 s a character; leader timing; the pooled-rim strength, cloudy density lift and granulation amounts;
  grain 0.02 (the paper's own fine grain).
- The sample pages' wording ("field journal", "a field note on scattered light", the hand notes). All facts are the
  sample's own: red light (700 nm) scatters about 5.9× less than blue (450 nm).

### Changed for vertical
- The source is one painted 1920×1080 world under a long lateral dolly with HUD corners. Here each sample is one
  full-height journal page: a mono label on y = 250, the painting in the middle band, the title or body under it.
- Type is bigger: titles 128 px, notes 48 px (source 26–42 px at 1080p), labels 24 px (source 15 px), and each page
  carries one specimen with two or three notes.
