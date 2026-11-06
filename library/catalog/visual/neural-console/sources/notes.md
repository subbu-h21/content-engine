# Sources: Neural Console

## NullMotion's "Cinematic Neural HUD"

- **Page:** `NullMotion/public/27-cinematic-hud-overlay/index.html` (not listed in `data/template-catalog.json`, so
  not one of NullMotion's approved looks).
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Neural HUD (NullMotion page outside
  the catalog)".
- **Licence:** MIT (checked `NullMotion/LICENSE`). No code was copied; the values were re-implemented in Remotion.

### Taken from it
- Palette ("cyber"): void #03050d, void soft #09111f, core #00e5ff, core hot #c6faff, core deep #087c9c, secondary
  #ff2bd6, secondary hot #ffc4f3, paper #eafcff, muted rgba(210,241,247,.48), depth orb violet #6c43ff at .045.
- Type: Arial headings with −0.04 to −0.06 em tracking; Consolas labels, caps, tracking 0.17–0.29 em; core label
  44 px, brand title 35 px caps, metric 48 px with a 24 px glow, status title 30 px, logs 12 px on a 29 px line.
- Layout (1080×1920 already): field inset 34/28/30 px, radius 54, feathered by a radial mask; header x 86; hub
  620×620 at x 132; log column 66 px from the right, 258 px wide; glass card x 122, 836 wide, radius 34.
- Elements: 74 px grid at 0.18; noise 0.14 (screen); three depth orbs (blur 132–158 px, 0.045–0.075); 30 dust motes
  2–4 px; octagon "satellites"; dashed network paths (8/12, 1.7, 0.42); hub rings (dashed 4/15; solid 8 px with dash
  510/1170; secondary 114/38/24/72); an 8 px meter; scan beam; scanlines 0.19; chroma tint 0.085 (screen); vignette
  to 0.87; stacked glow 2/10/35/90 px.
- Motion (8 s, one continuous build): field from scale 1.025 (1.05 s power3.out); header y −32 (0.72 s expo.out at
  0.16 s); brand mark scale 0.35 / −12° (0.68 s back.out(1.65)); copy 0.09 s apart; orbs drift 30–42 px and scale
  1.09 over 7.2–7.4 s sine.inOut; dust rises 74–164 px over 7.05 s; paths draw (dashoffset 170 → 0, 1.25 s
  power3.inOut, 0.08 s apart); nodes pop back.out(2) 0.11 s apart; hub from scale 0.6 + blur 6 to 1.15 (0.78 s
  expo.out) then 1 (0.34 s); rings turn 356° over 6.12 s power1.inOut; logs scroll −612 px over 5.92 s; card y +58 /
  scale 0.96 (0.82 s expo.out); meter fills 1.18 s power4.out; cells pop back.out(1.4) 0.08 s apart; scan beam sweeps
  down 5.52 s power2.inOut; one end pulse (0.28–0.3 s yoyo).

### Proposed (not in the source)
- Headline sizes (titles 112 px, headlines 92 px), the 150 px metric and the 92 px end line inside the hub, body copy
  (30 px paper at 72%), the brand title's 0.12 em tracking, the hubSettle ease (power2.out), node and cell pop
  durations (0.4 s, 0.3 s), the exit (power2.in 0.4 s), the between-shot rule, the soft scan-beam gradient.
- Colour meanings for the samples: cyan = short / blue waves and the main value, magenta = long / red waves and the
  comparison.
- Sample modules: the spectrum meter (400–700 nm), the scattering network, the sequence panel, the two meters. The
  log lines are rewritten as true readings of the sample content (no invented telemetry).
- GSAP eases translated to cubic-beziers: power3.out [0.25, 1, 0.5, 1], power3.inOut [0.76, 0, 0.24, 1], power4.out
  [0.22, 1, 0.36, 1], power2.inOut [0.65, 0, 0.35, 1], power1.inOut [0.45, 0, 0.55, 1], sine.inOut [0.37, 0, 0.63, 1],
  back.out(1.65) ≈ [0.34, 1.6, 0.64, 1], back.out(2) ≈ [0.34, 1.9, 0.64, 1], back.out(1.4) ≈ [0.34, 1.4, 0.64, 1].
- Fonts: Arial and Consolas are used when installed; Arimo (Arial's metric twin) and Inconsolata (the closest open
  Consolas-like mono) from Google Fonts otherwise.

### Changed for vertical and the safe zones
- The header moved from y 102 to y 262 (inside the 230 px safe top); the card's bottom from 190 px to 340 px above the
  frame's bottom (outside the 330 px safe bottom).
- Labels 9–13 → 24 px, logs 12 → 24 px on a 40 px line, status titles 30 → 34 px.

### Changed to stay apart from `hud-detection`
- The source's 72 px corner brackets (inset 72 px) and its bottom-left clock are dropped: the orange broadcast HUD owns
  brackets and timecodes. The source's "solar" alternate palette (orange) isn't used.
