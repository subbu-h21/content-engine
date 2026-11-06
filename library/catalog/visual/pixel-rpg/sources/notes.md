# Sources: Pixel RPG

## Lemo-Opuscar, style No. 29 "16-bit Pixel RPG"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/pixel-rpg/STYLE.md`, `DEMO.md`, `style.json` (category Games).
  Read through the research notes `docs/research/styles/five-skills.md`, section "16-bit Pixel RPG" (the repo itself
  wasn't opened for this style). Example frame:
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/pixel-rpg.jpg` (not downloaded).
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab). Nothing from the demo
  (frames, sprites, font, music) was copied: the look is rebuilt from the written rules. The ENDESGA-32 palette is free
  to use. Fonts: Jersey 10 and Silkscreen, SIL OFL (Google Fonts).

### Taken from it
- The ENDESGA-32 master palette, the rule of one or two protected colours, palette = feeling, map by luminance.
- 4×4 Bayer dither for gradients and glows; light shafts as a 50% checker with a 25% edge; no alpha fades.
- Windows: three-layer rounded border (ink / white / silver), blue → navy → night dithered fill; dialog box in the
  bottom quarter with a portrait on the left; battle and system messages in a thin top window; menus with a hand
  cursor; file list, status bars, item fanfares.
- Text types at 38–40 characters a second (30 for 8-bit), the ▼ caret blinks at 3 Hz, hold ≥ max(1.8 s, speech +
  0.6 s), the next box cuts the previous one.
- Titles: the pixel font at 2× with an 8-neighbour ink outline and white → silver → steel row bands, dissolved in by
  Bayer pattern.
- Frame rates: sprites 8 fps, effects 12 fps, camera and windows on ones at whole pixels; window slides 0.3 s
  ease-out; cursor bobs 1 px at 4 fps.
- Sprites: 1-pixel ink outline, 3 tones lit from the upper left, an inner line in the darkest tone, a silhouette
  mark for the hero (here the scarf).
- The save crystal: a flat-shaded octahedron in protected indices at 8 drawings per 90°, with a dithered halo.
- Transitions: mosaic cross, thumbnail expand, encounter swirl, screen shake 3–2–1 px, palette collapse.
- No finish: no scanlines, grain, bloom or depth of field.
- The banned list (not HD-2D, not CRT nostalgia, no existing game's names/characters/frames/fonts, no rank mapping,
  no helmet hair, no pale clothes reading as skin, no dark plank door).

### Proposed (not in the source)
- The faces: Jersey 10 for dialog, titles and numbers, Silkscreen for labels (the source's font is original and not
  available). Pixelify Sans was tried first and dropped: its digits misread (5 → S) at phone size.
- Every px size; the native grid 180×320 at 6 px; the window positions for vertical.
- The protected colours' meanings for this sample (cyan = blue light, red = red light) and the hero's sun-gold scarf.
- The invented hero (hooded traveller), the Sun as a speaker with a portrait, the spark bursts (10 streaks, 60 px,
  every 0.45 s), the stat bar design, the number and its count-up.
- The sample scenes: title screen at dawn, the Sun's dialog, a battle, a status screen, a quest log, the save point.

### Changed for vertical
- Native 320×180 (×6 → 1920×1080) became 180×320 (×6 → 1080×1920).
- The dialog stays in the bottom quarter but above the 330 px safe zone (native y 188–262).
- Menus and logs moved from the left third to a window in the upper half; the battle layout (enemy left, party right)
  is stacked: message on top, the fight in the middle, the result window below.
- Text sizes were raised (dialog 84 px, about a 6 px font pixel), with fewer words per box.
