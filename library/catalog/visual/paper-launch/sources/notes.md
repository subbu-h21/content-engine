# Sources: Paper Launch

## Moritz Kremb's launch-video recipe

- **Where:** AI × Leaders prompt library, entry #27 "AI workspace launch"
  (https://ai-x-leaders.com/en/prompt/video/revid-2103066071838466494/): a seven-document "reproduction recipe"
  (playbook + assets, story, shots, music, HyperFrames notes, a practice piece).
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Paper Launch (Moritz Kremb's
  launch-video recipe)", and the Kremb seams under "Not styles, but useful parts".
- **Licence:** MIT, © 2026 Moritz Kremb. No code was copied.

### Taken from it
- Structure of the look: a warm off-white ground, near-black ink, one accent, a dark register only for the hook and
  the use-case roll.
- Type rules: headlines of 1–7 words, a ~3:1 size hierarchy at weights 700 against 500, at most one serif-italic word
  per frame, mono kickers.
- Windows: radius 12–20 px, a 1–2 px hairline border, optional chrome of three hairline dots only.
- Motion: arrivals expo.out 0.5–0.7 s; settles power3.out; exits power2.in 0.3 s; the window entry (rotateX 18–30° → 0,
  y +80…+300 → 0, scale 0.94 → 1, blur 8 px → 0, expo.out 0.8–1.5 s, the shadow deepening on landing); camera zoom in
  windows ≤ 2.4× on 2× captures; blur peaks 10 px for text and 18–20 px for full-frame surfaces; a word waterfall
  stagger of ~0.02 s; held-frame jitter ≤ 2 px.
- Seams: zoom-through (out 1 → 1.2, blur 10 px, opacity 0.15 in 0.2 s power3.in; in 0.75 → 1 in 0.5 s expo.out), the
  inverse zoom (0.8 / 1.25), "cut the curve" (230 px, power4.in / power4.out); default a hard cut on the downbeat.
- Rhythm: 110–128 BPM (120 default), hook 3–4 s, end card ≥ 1.5 s, music fades 1–2 s, lengths 20–60 s, the practice
  timeline.
- Finish and sound: clean, music-only by default, a voice-over ducking the music 6–9 dB.
- Bans: browser chrome, real OS cursors, scrollbars, notification badges, bokeh, purple AI gradients, neon,
  glassmorphism, generic stock shapes, bounce (one deliberate pop allowed), screensaver float, breathing, drifting
  cameras, showing the whole frame at once, invented numbers, em dashes in copy.

### Not taken
- The practice piece recreates a real brand's palette (#F7F6F3 / #191918 / #0075DE), its proprietary sans and a
  commercial serif. None of these are used.

### Proposed (not in the source)
- The palette: newsprint #efeee9, window white, ink #1b1a18, muted #6e6c66, hairline #d6d4cc, raspberry #c8235a and its
  tint #f7dde6, the dark register #161513 / #22211e, and content colours for pictures and charts. Raspberry was chosen
  so the style stays apart from the catalog's other light launch looks (pure white + red, warm white + lime, near-white
  + blue).
- Fonts: Hanken Grotesk (500/700) for the brand sans, Newsreader italic 500 for the serif word, IBM Plex Mono for the
  kicker (iA Writer Mono, the recipe's open-licensed mono, is built on IBM Plex Mono; it is used first when
  installed).
- Sizes: headline 112 px, secondary 38 px, kicker 26 px, UI 30 / 26 px, number 300 px; the window's 64 px bar, 36 px
  padding, 12 px chrome dots; shadow values; 1.1 s / 24° / 200 px for the window entry (within the recipe's ranges);
  the pop spring; the serif word's raspberry underline; the content-colour rule; the cascade layout of the dark
  register.
- The sample scenes (sky window, spectrum window, scattering window with an overlapping result window, chart window,
  dark cascade of steps, call-to-action window).

### Changed for vertical
- The recipe defaults to 1920×1080 with 96 px margins. Here type and windows stack in the 888 px column, the kicker
  at y 330 and the headline under it, one window stack per frame.
