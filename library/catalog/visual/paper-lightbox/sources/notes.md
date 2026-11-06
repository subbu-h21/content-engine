# Sources: Paper Lightbox

## Lemo-Opuscar, style No. 10 "Paper Lightbox" (Paper-cut Lightbox, the layered shadow-box lamp)

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/paper-lantern/` (`STYLE.md`, `DEMO.md`,
  `style.json`); film https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/paper-lantern.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Paper-cut Lightbox (layered shadow-box lamp)".
  Nothing from the repo was downloaded for this style.
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). **The demo's narration
  (Microsoft Edge TTS) is excluded from CC BY and is not used.** Its music (Kevin MacLeod, CC BY 4.0) and Poly Haven
  assets (CC0) aren't used either. No code was copied: the sheets, light and shadows are rebuilt in SVG. Cormorant
  and Noto Serif are SIL OFL.

### Taken from it
- The night ladder: sky `#0a1330 → #172a58 → #2e4478 → #43598a`, moon `#fffaf0`, halo `#fff0cf` / `#f7dca4`,
  clouds `#c3cbe8` (0.9), far `#6a86c2` (0.7), mid `#3f5a92` (0.45), walls `#5a70a6` / roofs `#1b284f` (0.25),
  windows `#ffb862`, river `#22325e` / trail `#e9cf96` (0.3), tree `#17224a` / blossoms `#d9a24a` (0.12), bank
  `#0e1532` (0.05), lanterns `#0d1328` / `#ff8a48`; the warm interior ladder `#b08058`, `#6e3b1f`, `#2e170d`,
  `#ffc878`; seal red `#b3302a`; gold strips `#f1dbac` / `#f3d998`; subtitle `#fbf3e4`; walnut `#8a6a52`, room
  `#2a2018 → #0a0806`, spill `#ffc98a`.
- Rules: back bright and translucent, front dark and opaque, one flat colour per sheet, one temperature per stack,
  warm light as the only saturated thing besides one accent.
- Paper strips grown from an anchor edge without squashing the words; the seal; words never both paper and
  subtitle; Noto Serif subtitles at 0.06 em with a soft shadow, in 0.15 s before the line and out 0.3 s after;
  Cormorant for Latin.
- The rim (35%, shifted 3 px) and soft shadows on every sheet; backlight falloff mix(0.22, 1); the lamp-on order with
  layers ~0.42 s apart; lantern flicker 1 + .06·sin(7.3t)·sin(3.1t); hand-held drift; the camera vocabulary and
  transitions (dissolves 0.5–1.2 s, iris, light off/on, cloud curtain; no whip pans or digital zooms); vignette 0.42,
  saturation 1.05, no grain, 1.2 s fade to black; the banned list.

### Proposed (not in the source)
- All px sizes for 1080×1920 and the vertical stack's positions.
- A 2D stand-in for the 3D lighting: shadow offset 9 px, blur 11, 55%; backlight strength 0.62; unlit sheets 62%
  toward black; bloom as 7 + 20 px blurs; a 2.2 px blur for the soft far clouds.
- Shape drawings (karst peaks with two carved slits each, puffed clouds, village roofs, the tree, the figure), the
  seal's crescent, the strip and slide curves (the source gives the 7 s ease-in-out push only).
- The sample pictures: a tunnel of nested cut rings for "every colour at once", the molecule window with cut slits,
  the number cut out of the front sheet, the box on a table for the end.

### Changed for vertical
- The source box is landscape (0.56 × 0.33 m) with the subtitle 74 px from the bottom at 1080p. Here the stack runs
  top to bottom over 1080×1920, words are gold strips in the sky band (30–104 px) instead of vertical Chinese
  calligraphy, the subtitle is 40 px with its last line on y = 1560, and each sample is one picture with at most
  three strips.
