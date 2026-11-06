# Sources: One-Shape Morph

## Barty-Bart/motion-graphics: motion-broll

- **Repo:** https://github.com/Barty-Bart/motion-graphics, `skills/motion-broll/SKILL.md`, `reference/engine-api.md`,
  `engine/motion.js`, `engine/base.css`, `engine/build.py`, `engine/render.js`, `examples/opus-aoe2/01–06*.html` and
  `plan.json`; GIFs `docs/demo-cutaway.gif`, `docs/demo-panel.gif`. Read on 2026-10-31.
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, section "One-Shape Morph B-roll"; also
  "Variants of Barty-Bart styles found in the gallery" (Morphing UI States Loop, the same look as a loop).
- **Licence:** MIT, © 2026 Bart. Geist / Geist Mono SIL OFL 1.1 (loaded here from Google Fonts). The source's icons
  are adapted from Lucide (ISC); the icons here are redrawn simple paths, not copied. No engine code was copied.

### Taken from it
- Palette: canvas `#E9E7E2`, ink `#0B0B0B`, component `#FFFFFF`, accent `#FF5A1F`, panel `#F4F2EE`, secondary
  `#8A8782`, on-dark `#9A9791`, hairline `#E2DFD9`, skeleton `#E6E3DE`, doc line `#DCD8D1`, folder tab `#E14A12`,
  ghost `#BDB8B0` / `#A29E97`, the shape shadow.
- Type: Geist + Geist Mono, `tnum`, the size/weight/tracking table, badge padding 6/14 and radius 999, terminal
  line-height 40, sentence case, `·` pairs, emphasis by colour and shape, skeleton body copy.
- Layout: one shape at the centre, per-state camera zoom, state sizes, radius clamp, anchors, density, panels clear of
  the speaker.
- Elements: interaction vocabulary, icon stroke 2.2 (up to 3–4.2 on badges), cursor (ink, white 2.6 stroke, shadow,
  44–46 px), terminal, lanes, bars 12/12/6/6 with the first in accent, skeleton lines, the 96 px disc, real numbers
  only.
- Motion: every spring preset, intro pop, `vis` timings and blur/scale, liquid indicator, press timings and scales,
  cursor smootherstep + arc, rows on words, skeleton timing, bars, badge pop, accent pop, name pulse, spinner, caret,
  typing; rules (tiny overshoot, camera fills, hold the last state).
- Rhythm: no cuts inside a clip, pacing to speech, cutaway rules, chapter card timing.
- Finish: 4 sub-frame motion blur, ProRes 4444 for panels, no grain/vignette/glow, `will-change` gotcha; bans.

### Spring check
- `motion.js` defines `S(τ, ω, ζ)` as the closed-form step response (under-, critically and over-damped). Converted
  at mass 1 with stiffness = ω², damping = 2·ζ·ω and checked numerically against the kit's `springAt()` (1/240 s
  steps, 3 s): identical. The research note rounded some values (CAM 56, SLOW 156, FAST 46.4, intro 20.3); the exact
  ones are used here: 56.25, 156.25, 46.44, 20.28.

### Proposed (not in the source)
- Vertical state sizes, cams 1.2 / 1.4, stage centre y = 900, inner padding 48/44, ray stroke 4.2, the diagram and
  chart layouts, the bezier stand-ins `[0.33, 1, 0.68, 1]` (easeOutCubic) and `[0.65, 0, 0.35, 1]` (smootherstep),
  cursor move 0.7 s.

### Changed for vertical
- States re-laid out narrower and taller; lower camera zoom; on-screen text ≥ 24 px.
