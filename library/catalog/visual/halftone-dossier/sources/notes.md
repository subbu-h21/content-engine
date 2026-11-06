# Sources: Halftone Dossier

## Lemo-Opuscar, style No. 13 "Halftone Dossier" (retro print case file)

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/halftone-dossier/` (`STYLE.md`, `DEMO.md`,
  `style.json`); film https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/halftone-dossier.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Halftone Dossier (retro print case file)".
  Nothing from the repo was downloaded for this style.
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). No code was copied:
  dot screens, paper, stamps and the suspect are rebuilt in SVG from the documented values. Alfa Slab One, Noto
  Sans, JetBrains Mono and Bagel Fat One are SIL OFL.

### Taken from it
- Inks: paper `#F4ECDD`, navy `#1D2340`, blue `#2E55D6`, pink `#FF5A87`, yellow `#FFC628`, red `#E8384F`, cream
  `#FFF4E2`, night `#18203F` / `#2A3568`, pale pink `#FFD3DF`; the rules (one dark ink + four or five spot inks, max
  five; overprint ink, highlight ink, red reserved for stamps and alarms; no gradients; night still printed).
- Type roles: a black slab for Latin headlines with +8/+8 pink misregistration, built per character; Bagel Fat One
  for the title word and numerals; JetBrains Mono 800 for data; a black sans for captions and stamps; the caption
  pill (navy, radius 14, pink +8/+8, cream text, keyword yellow, −1.2°, ~1 s after the headline).
- Halftone: one path of circles, step 20–26 px (≥ 14), screen angles, radius = density × step × maxK (0.6–0.72),
  `radial` / `edge` / linear-ramp densities, multiply. Paper layer (mottle, noise ±13 with a warm bias, vignette
  `rgba(120,100,80,.35)`, fold), dust (520 cream + 90 navy, reseeded every 2 frames), line boil (feTurbulence 0.022
  → displacement 5, every 0.1 s, 40 seeds, ink grain 0.75) on characters only.
- Characters (7 px navy outline, flat fills, cream bellies, pink cheeks, glossy eyes with two highlights), stamps
  (double rounded rectangle 10–14 px + 0.35×, ink filter 7, 0.93, −10…+12°), starbursts, bubbles (6 px stroke),
  rays (28 wedges, 12°/s), evidence cards, mugshot height chart and name plate.
- Motion: back ease (overshoot 1.9) 0.3–0.45 s, nothing fades; per-character drops 30–100 px, 0.02–0.03 s apart in
  Latin; title letters falling 700 px in 0.2 s, 0.25 s apart; stamp slam 2.6× → 1× in 0.09 s + 5% bounce with shake
  and flash; the squash formula; shakes 5–7 / 16 / 26 px with quadratic decay; flash white capped at 0.5; push-ins;
  the dot wipe (80 px cells to r 62 over 0.44 s); the 120 BPM bar structure; banned list.

### Proposed (not in the source)
- Alfa Slab One as the Latin black slab (the source names none) and Noto Sans 900 as the black sans (the source's
  Noto Sans SC 900, Latin cut); the fold colour `#e2d6c0`.
- Every size for 1080×1920; the bezier `[0.3, 1.75, 0.6, 1]` standing in for the back ease; HUD wording
  (`FILE 450/700` = the two wavelengths; the REC clock is the sample's real time, no invented date).
- The sample's case: the suspect is an air molecule (N₂, two atoms), the exhibit a sun with rays in every ink, the
  verdict stamps CONFIRMED / PROVEN / CASE CLOSED. The facts are the sample's own (450 nm vs 700 nm, 5.9×).

### Changed for vertical
- The source is 1920×1080 with the caption pill at y = 980, the headline at x ≈ 120–170 and a vertical fold at
  x = 960. Here: a tall case file with the fold across y = 960, the HUD on y = 250, the headline top left, one
  exhibit in the middle band, the caption pill at y ≈ 1470, count numerals 660 px (source 700–760 px).
- Kept clearly apart from Halftone Collage (halftone paper cut-outs on a flat colour field): this one is a printed
  case file with HUD, stamps, slab headlines, caption pill and a suspect.
