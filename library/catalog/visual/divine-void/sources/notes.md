# Sources: Divine Void

## ECC's taste skill: the angelcore × cloud-trance mood system

- **Where:** `D:\code_files\resources to make content engine\github repos\ECC\skills\taste\SKILL.md` ("The Mood
  System", "Editing Grammar", "Beat Math", the shot plan, prompt presets).
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Divine Void (angelcore x
  cloud-trance, hyperpop accent)", and "Divine flash bloom" / "Colour-pop on monochrome" under "Not styles, but useful
  parts".
- **Licence:** MIT (checked `ECC/LICENSE`). No code was copied.

### Taken from it
- Palette: void #05060a, bone white #f4f1ea, molten gold #ffb24d ramping to ember #ff7a18, bloom core #fff, crystalline
  violet #8a6bff / cyan #4fc3ff / magenta #ff6ad5 (bright frames only), danger red #ff2a2a (1–2 shock cuts per video).
- Colour rules: most frames are dark or bright; one accent per shot; gold in dark frames, iridescence in bright frames,
  never both; red once or twice.
- Type rules: captions all caps; one or two words in the accent, synced to the vocal; words only in lyric or talking
  sections ("no text, no watermark" in the visualiser).
- Layout: 9:16; landscape sources centre-cropped; the signature frame of one sharp hero centred in black negative space;
  no mixed aspect ratios; crop out UI chrome from references.
- Elements: ember bloom, single gold shaft / god-rays, rising dust, glitter, crystalline bokeh, lens flares, light
  leaks, halos, clouds, wings, crystalline structures; the bloom overlay (#fff → #ffb24d, screen).
- Motion: slow, floating, weightless camera (drift, slow push, slow orbit); bursts of speed only at the drop;
  particles rise; the divine flash (opacity 0 → 1 → 0 at frames 0 / 3 / 12 at 30 fps, screen, on a transient for one
  beat); the speed ramp into the drop.
- Rhythm: hard cuts on beats or transients; no dissolves or crossfades in verse or drop; the beat maths (frame =
  round(n × 60 / BPM × fps); 138 BPM = 0.43478 s a beat); hero-on-black inserts held 1–2 beats; colour-pop on
  monochrome; the section plan (intro, verse, drop, bridge, drop 2, outro); never hold a shot past its phrase.
- Finish: high contrast, deep blacks, film grain and subtle chromatic aberration on dark frames, clean gloss on bright
  frames; bloom, glitter, flares and light leaks "heavenly, not dirty".
- 3D notes: the macro hero (one object on pure black, a single rim light) and the cold outro (pale ice dissolving into
  black).
- Bans: crossfades in tempo sections, more than one accent per shot, gold with iridescence, red more than once or
  twice, a shot held past its phrase, readable UI chrome from references, mixed aspect ratios.

### Not taken
- The hyperpop "candy-cyber portrait" frames (candy-pink hair, chrome, bright blue sky): they need a filmed or
  generated subject and have no hex values.
- The generation prompts and the "generate 6–10, keep 2–3" workflow (they are about AI footage, not about the look).

### Proposed (not in the source)
- Fonts: Cinzel (Roman inscriptional capitals, fitting the all-caps rule) for captions, Jost light for small tracked
  captions. Every size and tracking value.
- Muted #a39e94 and faint #2b2a2e.
- Motion values: the veil (14 px blur, 16 px rise, 1.6 s, 0.14 s apart), shaft (2.0 s), bloom (2.4 s), drift (4% push,
  24 px float over 6 s), particle rise (90–260 px over 6 s), the 2 s fade to black. The rule that type holds still
  while the world drifts (from the engine's visual taste).
- Element sizes and opacities (shaft widths and blur, bloom stops, 46 dust motes, halo, clouds, bokeh).
- Finish amounts: grain 0.05, vignette 0.5, aberration ±1.6 px at 35% (the source gives none).
- The sample scenes, drawn procedurally so the style needs no footage.

### Changed for vertical
- Nothing: the source is already 9:16.
