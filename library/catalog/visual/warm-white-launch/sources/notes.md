# Sources: Warm White Launch

## prompt-motion.com gallery entry: a consumer-app launch film

- **URL:** https://prompt-motion.com/ultimaxbt-2ddf1e. Video:
  https://media.prompt-motion.com/ultimaxbt-2ddf1e/video.ba2087f8.mp4 (1920 × 1078, 30 fps, 16.26 s).
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Warm-White Lime Composer
  Launch". The run's contact sheet was looked at; frames at 2, 5, 8, 12.5 and 14 s were quantised (the run's outro
  is black text on white, while the prompt asks for white on black; the prompt was followed).
- **Licence:** none stated; prompts belong to their creators. Treated as all rights reserved: no prompt text, code,
  food photos, product names or brand used.
- **Which section:** the request called this "prompt-motion entry 10" and named it "Warm White Launch". Counting the
  note's style sections, number 10 is "Liquid-Glass Keynote One-Take"; the name matches "Warm-White Lime Composer
  Launch", which is what this style is made from.

### Taken from it
- Palette: canvas `#f5f5f2`, UI `#0e0e10`, lime `#cdf24f`, orange `#ff6a2a`, send `#2f6bff`, the AI glow's hue order
  (pink → orange → lime → cyan → violet) as a blurred rotating conic gradient round the composer, the only glow.
- Type: Geist for UI, a serif for the name, outro lines 92 px white on black word by word, the typed request on three
  fixed lines.
- Layout: phone 428 × 900 with an 11 px bezel and a `9:41` status bar; cards 330 × 440, radius 28, dark, photo on top
  then name, one-liner, details.
- Elements: glowing composer, chat bubble, thinking object on beats with shimmering text, card strip with a pill, a
  black and an outlined pill, spinner then check, a courier dot to a pin that becomes the mark.
- Motion: one eased camera move per scene keyed `[time, zoom, x, y]` with log-space zoom, a first push of about 3×,
  never zooming in and out back to back, never reversing; closed-form springs (no values).
- Rhythm: 130 BPM, 32 beats, the beat map (send ripple at 6, lime flood ≈0.35 s at the drop on 12), shared-element
  handoffs, SFX by measured peak, −14 LUFS.
- Finish: 8 sub-frames of motion blur; bans (crossfades, blur-ins, 3D, particles, reversing camera, holds over 1 s,
  template feel).

### Proposed (not in the source)
- Surface `#ffffff`, muted `#86868a`, faint `#e4e4df`; glow hexes pink `#ff5fa2`, cyan `#4fd8f2`, violet `#8a6bff`.
- Fraunces as the serif (600 + italic 500); typed 66 px; long outro captions 72 px; bubbles 26 phone px; labels 30;
  end name 128; composer 880 × 430 radius 44; phone scale 1.45; card scale 2.
- Springs pop (w 16, z 0.8 → 256 / 25.6) and settle (w 14, z 0.95 → 196 / 26.6); camera ease 1.2 s; flood curve;
  ripple 0.6 s; word 0.3 s at quarter beats; typing 22 chars/s; route 1.6 s; glow ¼ turn/s, blur 34 px, spread 26 px.

### Changed for vertical
- Phone and cards scaled up and centred; the food story replaced by the sample's science with drawn pictures.
