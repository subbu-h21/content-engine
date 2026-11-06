# Sources: Game Show

## Lemo-Opuscar, style No. 33 "Game Show Flat"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/game-show/STYLE.md`, `DEMO.md`, `style.json`, easing constants
  in `styles/game-show/demo/frame_head.html` (category Games). Read through the research notes
  `docs/research/styles/five-skills.md`, section "Game Show Flat". Example frame (not downloaded):
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/game-show.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab), **except the demo's
  shouts** (macOS `say` voices), which are excluded and were not used. The demo is an unofficial fan piece naming
  real AI companies: no names, logos or products were carried over. Nothing from the demo was copied; the look is
  rebuilt from its written rules. Fredoka: SIL OFL.

### Taken from it
- Palette: ink `#1B1B1B`, white, cream `#FFF6E5`, the eight candy hues, purple and teal with their darker partners,
  navy `#26264A`, grey `#C3CAD9`, skin; the example orange set (ground `#FFB870`, stripes `#FFA85A`, floor `#E08A4A`).
- Rules: one set = one hue, pattern one step lighter, neighbouring rounds never share a hue, a character never shares
  its set's hue, big words white or yellow with an ink stroke, judgement words pink or yellow.
- Type: Fredoka 700; ink stroke ≈ 14% of the size painted under the fill; judgement word 120 px with an 18 px stroke
  at −6°; title glyphs popping in turn.
- Elements: 8 px outlines (5–7 px on small parts), round joins; hard offset shadows 10–14 px; stripes, offset polka
  dots at 18–25% white, a rotating sunburst; bean characters (body, belly patch, one head mark, oval eyes with
  catch-light, blush, mouth swapping to open red, stubby arms with white mittens, foot ovals, ink name-tag pill);
  round cards (radius 50, 10 px outline, 14 px shadow); report cards tilted −1.5°; the burst (8-point star, white
  ring, 8 ink speed lines, 0.3 s); counters racing to a target; bar charts growing per beat; stamps.
- Motion: 150 BPM grid; back-ease `1 + (c+1)(p−1)^3 + c(p−1)^2`, c = 1.9, pop 0.35 s; glyph pop 0.05 s apart,
  0.38 s, rising 60 px; drops from the sky with ease-in landing on the beat; idle hop per beat 8–30 px with the
  off-beat ripple; downbeat squash `1 − 0.1·exp(−frac(t)·16)`; beat punches 0.8–5% decaying in ~0.16 s; banners
  slide in with back-ease; exits ease-in; hard cuts with a 0.08 s white flash; one fade to navy at the end.
- The round structure (1-bar title + 8 bars, slam and "Perfect!" on bar 7 beat 3) and the banned list.

### Proposed (not in the source)
- All px sizes for 1080×1920; the floor at y = 1400; the stage front with chasing marquee bulbs.
- Pattern sizes and speeds (56 px stripes at 40 px/s, dots r 20 / 112 px, 15° rays at 12°/s).
- The pink, green, teal and navy set tones (one step lighter / darker by mixing).
- The contestants: RED, GREEN and BLUE light with wave antennas whose wavelength matches their colour, the SUN host
  with a crown of rays, the AIR MOLECULE with a bubble antenna. All invented.
- Balls flying out on each beat for the scatter; bars growing one segment per beat; the yellow check stamp.
- The sample scenes: title round, the Sun's "every colour", the scatter round, the score race with "Perfect!", the
  recap board, the winner's ending.

### Changed for vertical
- The 16:9 proscenium (floor band at y 860–900 of 1080) became a tall stage: floor at y 1400, telops in the upper
  half, a stage front below.
- Telops stack 1–2 words a line; the 1240×460 level card became column-wide cards (936 px); banners moved from
  (56, 44) to the safe-top line (72, 250); at most three contestants on stage.
