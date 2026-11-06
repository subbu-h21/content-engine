# Sources: Painted Boil

## ClaudeAnimationBase (JohnHeibel/ClaudeAnimationBase)

- **Where:** github.com/JohnHeibel/ClaudeAnimationBase: `ANIMATION_GUIDE.md`, `README.md`, `src/core.js`,
  `src/timeline.js`, `src/clawd.js` (grepped for values), `src/config.js`, `render.mjs`, `package.json`. Read through
  the research notes `docs/research/styles/five-skills.md`, section "Painted Boil Cartoon (p5.brush)". Example images
  (not downloaded): `docs/emotions.jpg`, `docs/views.jpg` in that repo.
- **Licence:** MIT (© 2026 John Heibel). Its star character (Clawd) is Anthropic's mascot and is **not** used; the
  character here (Pip) is invented. No code was copied: the source draws with p5.js + p5.brush, which this engine
  doesn't have; the look is rebuilt with SVG filters. Permanent Marker: Apache 2.0 (Google Fonts).

### Taken from it
- The palette (paper `#F3EBDC`, ink `#2B2233`, cream, night, indigo, rose, ochre, sap, teal, violet, sky, glow,
  flash, blush, mouth interior) and the mood tints; no pure black or white.
- The no-text rule with the `letter()` escape hatch (Permanent Marker, ink drop copy offset (0.045, 0.055) × size,
  outline 0.12 × size, backOut pop) and sound-word timing.
- Watercolour fill values (opacity 170/255, bleed, texture 0.4, border 0.35), flat washes for characters, ink
  outlines, dry brush, "one shape, one outline", the additive glow (stops 0 : 1, .18 : .8, .45 : .32, .75 : .08, 1 : 0,
  alpha 150).
- Boil on twos (reseeded 12×/s at 24 fps) with per-element seeds; the easing set (smoothstep, cubic in/out, backOut
  1.9, elasticOut); `spring(t, t0, k = 6, w = 18)`; jump and take formulas; turns through drawn views; emotion-change
  timing; the 120 BPM beat pulse e^(−6·frac(beat)); camera drift (20·sin(0.6 t), zoom 1 + 0.02 t).
- The brush wipe (5 strokes at −0.1 rad, delays [0, .14, .06, .18, .1], cover then drag off), the iris, the rule of a
  transition at every seam, timing for the viewer.
- The paper recipe (70 stains up to 4.5%, 1,400 fibres at 3.5–9.5%, static multiplied grain, a warm vignette from
  0.45 H to 1.05 H to rgba(120,95,70,.35)); character scale by units; the banned list.

### Proposed (not in the source)
- Pip (shape, colours, poses, moods) and its shade `#2a7470`.
- The SVG approximation of p5.brush: turbulence displacement for bleed (16 px), alpha texture from fine noise, an
  eroded rim for pooled edges, multiply blending for pigment; the boil as a displacement (frequency 0.035, ±3.2 px)
  reseeded every 2 frames; a streaky dry-brush filter.
- Lettering limits (1–5 words a beat, a 46 px caption allowed for numbers) and every px size; the sample scenes.

### Changed for vertical
- The source is 1920×1080 with no vertical layout. Here the ground sits low (y ≈ 1380–1460), lettering takes the
  upper third, the character stands lower left or right at u 22–30 px, and lists become three stacked painted panels.
