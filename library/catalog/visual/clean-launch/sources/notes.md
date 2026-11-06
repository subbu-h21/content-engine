# Sources: Clean Launch

## Cinetic (the "tessel" skill bundle)

- **Where:** AI × Leaders prompt library, entry #21 "tessel"
  (https://ai-x-leaders.com/en/prompt/video/revid-2104148233106723099/): a bundle of about 29 documents (SKILL.md, the
  Tessel worked example, README, setup, treatment template, critic prompts). The research read the first 200,000 of
  712,445 characters, plus `references/transitions.md` from https://github.com/Leonxlnx/cinetic at commit bee5d78.
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Cinetic Clean Launch (the tessel
  bundle)" (and the seam catalogue under "Not styles, but useful parts").
- **Licence:** MIT (SKILL.md front matter and the repo's LICENSE). No code was copied.

### Taken from it
- Palette (the Tessel worked example): ink #0B0B0C, paper #FFFFFF, mist #F4F5F7, line #E3E4E8, mute #8A8D96, accent red
  #EC2A3A; the rules: one accent with a reason, red only for "now", ≤ 8% of the pixels, one flood per film, new things
  arrive in the accent and relax to neutral over 10–30 f, cool neutrals; shadows 0 20–40 px 60–120 px at 12–22%; a
  1 px top hairline at 8–12% white on dark surfaces.
- Type: statements 88–128 px (Tessel 128 / 600 / −0.05 em; payoff 176; wordmark 190 / −0.055 em), descriptors 44 px /
  460 grey, emphasis 1.5–1.7×, a hero word 2–5× or 14–48% of the frame height, UI ≥ 32 px in vertical, leading
  0.95–1.05, one tracking value per role, blur on entry (statements 6–8 px, sharp within 6 f).
- Copy: ≤ 5 words a line, ≤ 2 lines a shot, one line at a time, 20–35 words a film, no stock phrases, no feature name
  as a headline.
- Layout: 96 px side margins, the 9:16 content band y 270–1500, hero 40–70% of the frame, no empty region over a
  quarter, product windows at 70–92% of the width, the lockup at 28–45%, no small floating cards.
- The story device: one owned object travelling through every shot (Tessel's red now-dot).
- Motion: the 13 cubic-bezier tokens, the four springs, duration = 0.35 s + 1.35 ms per px, camera 0.6–2.4 s, the
  slowest move ≥ 3× the fastest, shape settles before position, secondary moves at 55–75%, the speed limits, the camera
  rules (zoom in log space, 2–5× pushes, creep ≤ 6% on long holds).
- Rhythm: the BPM grid, holds (≥ 36 f + 6 f per word at 60 fps), nothing static over 48 f, density, shot lengths, the
  hook, the acts, end card timing, 6–8 seam kinds with one signature move, the seam catalogue, no crossfades by
  default.
- Finish and bans: no glow / halo / bloom; grain off or 1.5–2%; the banned lists (copy, serif and italic, warm and
  purple colours, multi-hue gradients, glassmorphism, emoji, sparkles, particles, confetti, flares, transition
  presets).

### Not taken
- The Tessel example's brand mark (three block primitives on a 100-unit grid) and its name. Only the generic idea of a
  red dot as the story device is used.

### Proposed (not in the source)
- Schibsted Grotesk (Google Fonts) instead of the example's Geist + Geist Mono: the source's rule is "one clean modern
  sans in 2 weights", and a different face keeps this style apart from the catalog's Geist-based styles. Weight 500
  for the descriptors (the source's 460 isn't a shipped weight).
- The 0.4 s relax from red to ink (inside the source's 10–30 f at 60 fps), the 3% creep over 8 s in the previews, the
  140 px statement and 112 px title, the 290 px hero word and 360 px number, the 44 px now-dot (0.15 em), window
  padding 48 and radius 28, the 18 px bars and 40 px handles.
- The sample scenes: the red iris at frame 0 landing on the dot, the wavelength range selector opening to 400–700 nm,
  the molecule as the now-dot, the dot as the decimal point of 5.9×, the three-stop step track, the window of strokes
  arriving at "you", the end lockup with the dot as its full stop.

### Changed for vertical
- The source is 1920×1080 at 60 fps; its 9:16 notes give the content band (y 270–1500) and the 32 px UI minimum, used
  here. Statements stay at the source's sizes (140 px, a little above 128 px, fits five words in the 888 px column).
  Frame counts at 60 fps are written as seconds.
