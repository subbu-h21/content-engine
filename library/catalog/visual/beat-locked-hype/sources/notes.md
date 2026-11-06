# Sources: Beat-Locked Hype

## Barty-Bart/motion-graphics: explainer-high-energy

- **Repo:** https://github.com/Barty-Bart/motion-graphics, `skills/explainer-high-energy/SKILL.md` (+ `README.md`,
  `docs/explainer-high-energy.gif`), read on 2026-10-31.
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, sections "Paste-in helpers" and
  "Beat-Locked Hype Promo". The GIF contact sheet was looked at to see the cube field and the product card.
- **Licence:** MIT, © 2026 Bart. No code or assets copied; the cube field is drawn from scratch.

### Taken from it
- Palette: ink `#0B0B10`, accent `#FF4F1A`, cream `#EDEBE4`, electric blue `#2F47FF`, white; at most 3 colours per
  scene besides black and white.
- Type: heavy grotesk caps (Inter Tight 900 / Archivo Black), Instrument Serif italic human line, mono HUD (JetBrains
  Mono or Geist Mono) at about 50%, kicker line, emphasis as a change of treatment per word, outline repetition, 1–3
  words at a time.
- Elements: spark → line → flood, detaching full stop, signature visual (cube field / particle ring / blob), product
  micro-moment, proof with blurring digits and one accent bar, morph bridge, end card (name + dot, serif tagline,
  tracked mono, hairline), viewfinder brackets with a size label on the blue card.
- Motion: 128 BPM grid, beats for big changes, 1/8 or 1/16 for type, impacts at z ≈ 0.6–0.7, mask reveals on 1/16
  notes, triplet words two beats each, hard swaps inside the triplet, no scene without motion.
- Transitions: 6–8 scenes of 1.5–3 s, transitions as objects, at most 2 hard cuts on downbeats, scene order, sound.
- Finish: soft vignette, subtle grain, 8 sub-frame motion blur, no glow-on-everything; banned list.

### Spring check
- Source helper `spring(t, w = 14, z = 0.82)`; impacts z ≈ 0.6–0.7 with no w. Conversion stiffness = w²,
  damping = 2·z·w, mass 1, checked against the kit's `springAt()`: identical. w 14, z 0.65 → 196 / 18.2;
  w 14, z 0.82 → 196 / 22.96.

### Proposed (not in the source)
- Every px size and tracking, the 80 px margin, the 120 px grid, w = 14 for impacts, slam distance 160 px and blur
  24 px, flood curve and 0.3 s, count over two beats, rule over one beat, outline drift, vignette 0.35, grain 0.03,
  muted `#85858c`, faint `#1c1c26`, Geist Mono over JetBrains Mono.
- The stacked three-band triplet for vertical.

### Changed
- For distinctness from `hud-detection`: no always-on bracket frame, no timecode or red dot; brackets only on the
  blue card. From `signal-slam`: orange is never a type card.
- For vertical: slams fitted to a 920 px column, HUD raised to 24–26 px, triplet may stack as bands.
