# Sources: Calm Product Demo

## Barty-Bart/motion-graphics: explainer-default

- **Repo:** https://github.com/Barty-Bart/motion-graphics, `skills/explainer-default/SKILL.md` (+ `README.md`,
  `docs/explainer-default.gif`), read on 2026-10-31.
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, sections "Paste-in helpers" and
  "Calm Product Demo".
- **Licence:** MIT, © 2026 Bart. No code was copied into the scenes; the spring helper was only used to check the
  Remotion conversion.

### Taken from it
- Palette: canvas `#F7F7F8`, text `#111114`, secondary `#8A8A94`, surface `#FFFFFF`, border `#E7E7EC`, accent
  `#2E6BFF`, highlight box = accent at 15–20%, silk bands white → pale accent → accent.
- Type: Inter or Geist, small regular title lines that grow through a camera push to about 75% of the width, tight
  tracking on big text, sentence case, one key word highlighted by a box sweeping left → right.
- Layout: centred lines, one line plus one UI element at most, UI cropped and shown big.
- Elements: rebuilt vector UI with soft shadows and 1 px borders, input with chips, agent steps spinner → check,
  stacked result cards with depth of field, tables with shimmer, popover, cursor (arrives early, press dip, ripple,
  hover), integration tiles with parallax, dotted backdrop for proof, no invented stats.
- Motion: easeInOutCubic camera moves of 0.6–1.2 s or springs with z ≥ 0.95, no bounce, typing at 25 chars/s, the
  camera following the caret and pulling back, 2 s title hold, 0.5 s pause after results.
- Transitions: no hard cuts, blur-dissolve 0.3–0.4 s, timing budgets, music 100–110 BPM and sound list.
- Finish: motion blur 4 sub-frames over 180°, no grain/vignette/glow; banned list.

### Spring check
- Source: `spring(t, w = 14, z = 0.82)`, closed-form step response; w 8 slow / 14 normal / 22 snappy.
- The research note's conversion (stiffness = w², damping = 2·z·w, mass 1) was checked numerically against the kit's
  `springAt()` at 1/240 s steps over 3 s: identical (largest difference 0). w 14, z 0.95 → stiffness 196, damping 26.6.

### Proposed (not in the source)
- All px sizes (title cap 112, number 210, body 32, label 26, kicker 32), margins 96, card width 888, radius 28,
  shadow values.
- Word stagger 0.08 s and fade 0.45 s, highlight 0.5 s, push start scale 0.5, dissolve blur 16 px, tick spring
  (w 22, z 0.95), cursor move 0.8 s with a small arc, ripple size, silk angle −24° and drift 24 px/s, pale accent
  `#dce6ff`.
- Geist was picked over Inter (both allowed).

### Changed for vertical
- Source is 16:9 (9:16 "supported" with no numbers). Lines still push to 75% of the width; UI cards are 888 px wide in
  the middle of the frame; text stays inside 230 px top / 330 px bottom.
