# Sources: Red Card Kinetic

## Kinetic Type: the complete workflow guide (red-card mode)

- **File:** `D:\code_files\resources to make content engine\aman thakur's resources\Kinetic Type_ the complete workflow guide.pdf`
  (v1.0, Oct 2026, "Made with Claude Code", no author named). Pages used: 1 (cover: red grid card), 3 (ten frames of
  the finished video), 6 (text engine, cards, wipe), 14 (review sheet, card table), 21–22 (recipes, colours, type).
- **Research notes:** `docs/research/styles/local-guides.md`, sections "Kinetic Type — red text-in-space over footage"
  and "Kinetic Type — Red Card mode (footage-free variant)".
- **Licence:** the guide states none. Its own rule (p. 24): use the technique on your own words, not the reference
  creator's footage, branding or script. Nothing was copied: no code, no images, no frames. Fonts Poppins and Six Caps
  are SIL OFL (Google Fonts).

### Taken from it
- Colours: card gradient `#c70808` / `#ae0606` / `#880404`, white `#f4f4f4`, brand red `#b51722`, slam shadow
  `#5e0006`, grey `#7d7d7d`, white card `#fcfcfc` / `#b4b4b4`, soft shadow black 28%.
- Grid sizes: 216 px on the red card, 120 px on the white card. The cover (p. 1) shows the lines darker than the field.
- Type: Poppins Black lowercase, tracking −0.05 em, leading 0.85; Six Caps uppercase, +0.02 em, 6–10 px same-colour
  outline; emphasis 2–3× the connecting words; soft shadow `0 0.03em 0.09em`; sticker outline 9 px grey; slam shadow
  4.5% of the size.
- Recipes (30 fps): swing 13/140/0.7 with rotateY ±80°, rotateZ ±18°, z 700, x 380, +0.2 em mid-flight; pop
  10/230/0.6, 1 f stagger, 0.35 em jitter settling in 9 f; stretch 8/150/0.8 from scaleX 0.15; slam 9/190/0.8; slide
  ease-out-expo 6 f, 280 px, ±18°, opacity over 3 f; fade 4 f, scale 1.08 → 1; drop 320 px ease-out-cubic 4 f; rack
  focus 0 → 9 px over ~10 f; liquid-ink wipe from the top-right, 8–10 f, radius to 3000 px, wobbly edge, 4 droplets.
- Arcs: θ = x / R; R > 0 rainbow, R < 0 smile.
- Card lengths 31–79 f (1.0–2.6 s), overlapping the previous shot by up to 10 f; sound recipes (p. 15).
- Chips ("style chips"), dark UI mock-ups, the red X, render bars: named on p. 14 and seen on p. 3; rebuilt here as
  generic shapes.

### Proposed (not in the source)
- Every px size (connecting 96, main 180, hero 300, number 330, Six Caps 380–530, chips 40, mono 30), the 72 px margin.
- The dark panel colour `#161618` and DM Mono for UI text.
- Chip styling (white pill, brand-red text, number disc).
- The draw ease for beams and bars (ease-in-out-cubic, 0.35 s); the wipe's ease-in-out-cubic curve; the wobble as three
  summed sines at 7% of the radius instead of simplex noise; the droplets' sizes and angles.
- The grid line weight and opacity (2 px of `#880404` at 60%).
- Holds (0.5 s), at most 6 words in a stack.
- The diagram treatment (thick white strokes, a white disc with a grey sticker ring).

### Changed for vertical
- Nothing: the source is already 1080×1920.
