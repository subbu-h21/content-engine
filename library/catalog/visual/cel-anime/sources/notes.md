# Sources: Cel Anime

## Lemo-Opuscar, style No. 27 "80s Cel Anime (OVA on a CRT)"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/cel-anime-80s/STYLE.md`, `DEMO.md`, `style.json`, colour
  models in `demo/pal.js` (category Cartoon & Anime). Read through the research notes
  `docs/research/styles/five-skills.md`, section "80s Cel Anime (OVA on a CRT)". Example frame (not downloaded):
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/cel-anime-80s.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab). Nothing from the demo
  was copied (no frames, no head model, no plates); the look is rebuilt from its written rules. Kanit and Barlow Semi
  Condensed: SIL OFL.

### Taken from it
- Colour models (fill / shadow / highlight / line) for skin, blush, hair, lash, iris, eye white, jacket, scarf,
  teal, magenta, gold, chrome, dark; subtitle `#fff0a0`, second speaker `#8ff4ff`.
- Lighting multipliers for night, dawn and backlit (lit / shade / line); the rule that each time of day is its own
  colour model, never a filter; lines as dark versions of fills, never black except hard props.
- Cel shading by shape minus shifted shape (shadow and highlight crescents), a saturated 2–4 px rim light, no
  gradients in cels; painted plates carry gradients; a small flat hero in a huge painted world; avoid front views.
- The 80s eye (layered tall iris, thick flicking upper lash with 2–3 lashes, one large and one small highlight) and
  hair rules (uneven sharp tips, an angel ring with a zigzag lower edge).
- Type: Barlow Semi Condensed 600 cream-yellow subtitles with a 9 px dark outline and a soft shadow, a second speaker
  in cyan with a boxed tag; heavy italic Latin titles in a chrome gradient (sky → white horizon line → violet → pink →
  gold) with dark and neon outlines, flickering on at 12 fps with a light sweep and a star glint; a spaced-out
  tagline; Kanit; generic sign words only.
- FX: star-burst flares, anamorphic streaks, hexagonal ghosts through the frame centre; radial speed lines; light
  trails; HUD gauges and backlit level meters.
- Motion: characters on twos, performance on threes, camera and light on ones; 4-drawing cloth cycles; light moves
  across held cels; impact frames; the peak sequence; the camera vocabulary; cuts on bars; no dissolves or wipes.
- Finish: chroma bleed (~2 px Cr shift, ~7 px horizontal chroma smear), scanlines at strength 0.18, corner darkening
  0.28, faint signal noise; no film artefacts. The banned list.

### Proposed (not in the source)
- Plate hexes for night city, dawn, day and an interior (the source's plates are in `demo/bg.js`, not read).
- The title/subtitle outline colour `#1a1030`; the heroine's whole design (a back view drawn from simple shapes);
  the spectrum band sweeping across her for "every colour"; skylines, rooftops and the dashboard.
- Scanline period 4 px (3 px in the source at 1920×1080; 4 px avoids moiré in the half-size previews), the chroma
  blur radius, every px size, the sample scenes (title card, dawn, speed-line burst, cockpit meters, three cuts with
  an eye close-up, a day-sky ending).

### Changed for vertical
- 16:9 (or a 4:3 pillarbox) became 9:16. Subtitles moved from ~96 px above the bottom to y ≈ 1336, above the platform
  zone; the title card fills the upper half in 2–3 short lines; the heroine stands lower and smaller so subtitles
  never cover her; the list is three stacked cuts (936 × 380) instead of a sequence of full frames.
