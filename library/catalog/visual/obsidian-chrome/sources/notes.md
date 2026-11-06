# Sources: Obsidian Chrome

## NullMotion's house look

- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, sections "Obsidian Chrome (NullMotion house
  look)" and "NullMotion catalog: the 23 templates as shots" (Part B). The research read
  `NullMotion/data/template-catalog.json` and the `NullMotion/public/*/index.html` preview pages.
- **Licence:** MIT (checked `NullMotion/LICENSE`). The template previews show third-party app marks: those stay their
  owners' property and nothing of them is used here. No code was copied; the values were re-implemented in Remotion.

### Taken from it
- Palette: obsidian #2b2b2e / #161618 / #0a0a0b; card surfaces #1b1b1f, #232327; silver gradient #ffffff → #dedee2
  (44%) → #999aa2; headline base #f4f4f6; amber #e8b768; spark #fff6df; subcopy rgba(214,214,218,0.72); pale glow
  #cfe0ff; alert red #ff4b4b.
- Type: Inter everywhere, caps, −0.055 em tracking, 0.88 leading, silver gradient; the emphasised word in a pill at
  102/132 of the headline with −0.045 em; CTA label 40 px / 600 / 0.18 em; subcopy 400 / 0.04 em; mono micro labels
  tracked 0.19–0.2 em at 52% / 42%.
- Pill: radius 999, the two inset shadows, the 0 30 55 drop shadow, 1 px border at 10%, specular cap over the top 48%;
  glint 45% wide, −18°, peak 0.55, −60% → +160%, power2.inOut 0.9 s; contact shadow rgba(0,0,0,.48) blur 18.
- Motion: Chrome CTA (pill y +90 / scale 0.96 / expo.out 0.85 s at 0.1 s; label 0.45 s; subcopy 0.65 s; glint at
  2.3 s of 4 s); Kinetic Headline (atmosphere from scale 0.72 + blur 22 px; orbit from 0.9 / −9°; guide scaleX
  power3.inOut 0.68 s; words on opposing arcs from ∓112 / ±18 / ∓1.2° / blur 8, power4.out 0.72 s, 0.09 s apart;
  anticipation 0.93/1.06 → 1.08/0.95 over 0.43 s → back.out(1.55) 0.34 s; spark −205 → +210 over 0.68 s; one sheen);
  Slide-In Showcase (masked lines from 115–130% over 0.9–1.1 s, 0.15 s apart; divider/underline power4.inOut 1.0 s);
  Compare Bars (card y +60 / 0.97 over 0.8 s; bars 0.7 s, hero bar 0.95 s power4.out 0.17 s later; values y +14
  0.5 s); Connector List (rows slide from the left, a glass highlight snaps onto one row).
- Rhythm: 4–7 s shots at 30 fps, stagger 0.08–0.15 s, one glint per shot late in the shot.
- Finish: no grain, soft deep shadows, restrained bloom; transparent alpha over footage.
- Bans: generic tiles, looping bob, decorative glow spam, fake UI or decorative clutter, decorative telemetry,
  distorting a real mark.

### Proposed (not in the source)
- The faint gridline colour #3a3a40, the 240 px number, 36 px list rows, CTA pill padding (0.8 × 1.3 em), the 80 px
  row slide, the guide line's vertical position (y 1060), the chrome sphere in the diagram, the snap highlight's
  values, the 3D material note.
- GSAP eases translated to cubic-beziers: power3.out [0.25, 1, 0.5, 1], power4.out [0.22, 1, 0.36, 1], power3.inOut
  [0.76, 0, 0.24, 1], power4.inOut [0.83, 0, 0.17, 1], power2.inOut [0.65, 0, 0.35, 1], power2.in [0.32, 0, 0.67, 0],
  back.out(1.55) ≈ [0.34, 1.5, 0.64, 1].
- Fonts: Inter 780 → 800 (static weights only); SF Mono / Consolas (not Google Fonts) → Geist Mono 500.

### Changed for vertical
- The approved Kinetic Headline is 1920×1080 with the words on one centred line. Here the plain words stack in lines
  of 1–2 words above the pill, alternating arc sides, at 156 px (pill 120 px).
- Subcopy 21 → 30 px; micro labels 13 → 24 px (the minimum); cards and rows fill the 888 px column.
- The ECC slide skill bans Inter as a voice; NullMotion uses it on purpose (the silver gradient carries the look), and
  so does this style.
