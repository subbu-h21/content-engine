# Sources: HUD Detection

## Level 5 Workflow Guide

- **File:** `D:\code_files\resources to make content engine\aman thakur's resources\Level 5 Workflow Guide.pdf`
  (12 slides). Slides used: 1 (master prompt), 2 (overview), 5 (cue sheet), 6 (sound), 7 (look: 5 colours, 4 fonts,
  finishing effects), 8 (the HUD, eight numbered parts), 9–10 (scene library), 11 (review and specs), 12 (tips).
- **Research notes:** `docs/research/styles/local-guides.md`, "Level 5 — HUD detection (dark broadcast HUD with
  keyword lock-on)".
- **Licence:** none stated (the last slide asks to be tagged). No code or repo ships with it. The look is described in
  our own words; nothing was copied. Unbounded, Space Grotesk, JetBrains Mono and Instrument Serif are SIL OFL.
- **No names carried over:** the series title and the handle in the HUD are replaced by the sample content's own
  lines.

### Taken from it
- Colours: black `#0b0a09`, orange `#ff5a26`, red `#ff3b1f`, warm white `#eceae4`, indigo `#1b1d4a`, with their roles.
- Fonts and roles: Unbounded 900 (titles, the drop), Space Grotesk (captions, UI), JetBrains Mono (timecodes, data),
  Instrument Serif (the emotional line).
- The HUD's parts and positions; corner brackets; detection brackets with an orange readout; the lock-on tag; the
  circular text ring in a thin red circle; waveform with keyword ticks and red playhead.
- The scene library and which scene suits which idea; finishing effects (chromatic aberration, feedback trails,
  bloom, slice glitch, film grain, vignette, slow push-ins); rhythm rules; cue sheet; sound vocabulary; mix levels.

### Measured from the PDF's frames (Pillow, 8-colour quantise)
- Page glow `#25120c` → glow `#2a140c`; flash-card dark type `#5a1404` (anti-aliased) → chocolate `#4a1204`;
  ring lines `#cc3a0c`–`#e3440e` → `#d9400f`; stacked verbs ground `#e8b4a0`, words `#504747`; indigo scene
  `#1a1d3e` (matches the given indigo).

### Proposed (not in the source)
- Every motion value: word 0.12 s, lock 0.25 s, slam 1.35 → 1 in 0.18 s, stamp 1.25 → 1 in 0.12 s, count 0.9 s,
  draw 0.5 s, push 1.0 → 1.04, spin 20°/s, glitch 0.1 s × 6 slices × 40 px.
- Every px size and position; muted `#8a847c`, faint `#3b3631`, surface `#171412`.
- Finish values: grain 0.06, vignette 0.45, bloom 7/18 px, aberration 2 px.
- The word counter instead of the WPM readout; the series line instead of the handle.

### Changed for vertical
- The source frames are about 4:5 (its specs slide says 1180×1526; its prompt asks for 1080×1920). The HUD here is
  spread over 1080×1920 inside the 230/330 px safe zones, the scene band is y 360–1240, and each scene shows fewer
  elements with bigger type.
