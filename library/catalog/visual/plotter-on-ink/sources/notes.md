# Sources: Plotter on Ink

## Motion as Code workflow guide and kit

- **Files:** `D:\code_files\resources to make content engine\aman thakur's resources\Motion as Code - Workflow Guide.pdf`
  (7 pp; a byte-identical copy sits in `Claude workflow guide\`) and `Claude workflow guide\Motion_as_kit.zip`
  ("the engine and style of pdoom-video"). Kit files the values come from: `app/src/engine/palette.ts`, `post.ts`,
  `type.ts`, `stroke.ts`, `hud.ts`, `util.ts`, `glsl/common.ts`, `app/src/scenes/_vo.ts`, `_motifs.ts`, the nine
  plates, `timeline.ts`, `scripts/render.ts`.
- **Research notes:** `docs/research/styles/local-guides.md`, "Motion as Code — Plotter on Ink (construction sheet)".
- **Licence:** MIT (`LICENSE.pdoom-engine`, © 2026 Giacomo Magnanini); the PDF says MIT covers the palette, fonts,
  spark motif, graph-paper sheets and post-processing. No code was copied: the scenes here are new code that follows
  the described rules. If kit code is ever reused, keep its licence notice.
- **Fonts:** Archivo, IBM Plex Mono and Cormorant Garamond are SIL OFL (Google Fonts). The kit's single-stroke SVG
  fonts (EMS Allure, Hershey Script/Sans/Serif, EMS Readability/Tech/Osmotron/Felix) ship without a licence file: **not
  used**. Pen writing is approximated with a clip wipe that the spark rides.
- **Voice and SFX** in the kit are ElevenLabs output: not used.

### Taken from it
- Palette (ink, ink2, graphite, ash, bone, signal, ember, blood, acid) and the heat ramp.
- Archivo widths 62–125 with discrete steps, Plex Mono roles, Cormorant with lining figures.
- Karaoke (0.3 s early, 1.1 px ash outline at 45%, signal wipe, 0.3 s cool to bone), slam (1.18–1.25 → 1 in
  0.16–0.2 s, ember half-life 0.08–0.09 s, cool over 0.35–0.45 s), width morph, ripple, stretch, odometer, pen and
  type-on timings, panel reveal, strike and snip spring, ignition ring, hits, holds, rewind.
- Graph paper 24/96 px with ignition (5200 px in 1.35 s), pen glow σ 140 px; the spark's sizes; stroke kinds and their
  alphas, widths and hot decay; dimension lines, registration ticks, crop marks, corner furniture, readouts.
- Cut rules, whips, dive hand-offs, rush, shutter, diagonal wipe, implode loop; post values (bloom, halation,
  aberration, grain, vignette, tone, motion blur, encode).

### Derived
- Grid alphas: the kit adds 0.011 (minor) and 0.03 (major) × bone in linear light; over ink that is about 8% and 16%
  bone in sRGB. Used at 6% and 12% *(proposed: slightly lower for a phone screen)*.

### Proposed (not in the source)
- All px sizes for 1080×1920; labels 24 px minimum; 1.6× spark and 1.5× stroke widths for the phone.
- Archivo's per-width character widths for fitting (estimates).
- The clip-wipe stand-in for single-stroke pen writing.
- The sample readouts ("WORDS SAID", "RATIO", "STEPS", "FACTS TODAY") and figure captions.

### Changed for vertical
- The source is 1920×1080 at 60 fps with a moving 2D camera. Here: a 900 px column (the same ~80% of the width), one
  hero element per sheet with rows below, furniture inside the 230/330 px safe zones (caption bottom-left, readout
  bottom-right), labels scaled from 11–13 px to 24 px, and no camera moves in the stills. Timings are in seconds and
  hold at 30 fps.
