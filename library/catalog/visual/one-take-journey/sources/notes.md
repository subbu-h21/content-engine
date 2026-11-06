# Sources: One-Take Journey

## Barty-Bart/motion-graphics: explainer-engaging

- **Repo:** https://github.com/Barty-Bart/motion-graphics, `skills/explainer-engaging/SKILL.md` (+ `README.md`,
  `docs/explainer-engaging.gif`), read on 2026-10-31.
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, sections "Paste-in helpers" and
  "One-Take Hero Journey"; the gallery's "White Ball UI Loop" (rossaxbt-94583b) is a variant of the same look.
- **Licence:** MIT, © 2026 Bart. No code copied; the stations are drawn from scratch as generic UI.

### Taken from it
- Palette: canvas `#0C0C0E`, dot grid `#1E1E22`, surfaces `#1C1C1F` / `#2C2C2E`, text `#F2F2F7`, secondary
  `#8E8E93`, accent `#0A84FF`, hero `#FFFFFF`, light variant `#F2F2F4`.
- Type: Inter or Geist; only the stations' own words, `Name · state`, with wit; no explanatory overlays.
- Layout: a world about 3× the frame, stations in visiting order, staircase of notifications, the station filling a
  large part of the frame during interactions, wider during falls, the hero inside the middle half.
- Elements: the hero (ball / caret / tile / bubble / coin / data point), stations (toggles, sliders with ticks and
  tooltip, notifications, keyboard with return key, rows, charts, bubbles, deploy button + toast), the empty slot, the
  cursor that clicks once.
- Motion: contacts on beats, parabolas with constant gravity, rolling with ease/spring, squash 1.25 × 0.8 for about
  60 ms, stretch up to 1.15 × 0.9, launch with time warp `1 − 0.9·sin(πu)^0.6`, follow camera (0.15 s lead, anchors
  0.7 / 0.15 / 0.85, critically damped w ≈ 6, 0.8 s blend-in), payoff hold 0.4–0.6 s, reveal at 0.3× with 15–25°
  tilt and a 1 s hold, halo, 24 px minimum, dive back, loop seam.
- Rhythm and sound: one take, 10–30 s, 110–120 BPM groove, contacts as the instrument, folded audio seam.
- Finish: 8 sub-frame motion blur, halo in the reveal; bans.

### Spring check
- Source helper `spring(t, w = 14, z = 0.82)`; camera w ≈ 6 critically damped. The research note's conversion
  (stiffness = w², damping = 2·z·w, mass 1) matches the kit's `springAt()` exactly: w 6, z 1 → 36 / 12;
  w 14, z 0.82 → 196 / 22.96.

### Proposed (not in the source)
- All px sizes (labels 30, titles 36, body 40, messages 52, readouts 140), the 880 px station width, 36 px radius,
  shadows, 56 px hero, dot grid spacing 44 px and size 5 px, gravity 6000 px/s², 116 BPM, squashBack spring
  (w 22, z 0.5), toast spring (w 14, z 0.95), 8 px dip, roll 0.6 s, reveal 1.2 s and 20°, halo 48 px, the dotted
  trail, ghost copies standing in for motion blur in stills.

### Changed for vertical
- The zig-zag world becomes a mostly downward staircase; a station fills about 80% of the width; the reveal is
  described but not in the previews (its text is meant to be tiny).
