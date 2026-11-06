# Sources: Halftone Collage

Two sources describe one look (halftone paper collage), so they are merged into one style: gbro's rules for each
assembled shot, the "Halftone Collage Zoom" rules for the movement between shots.

## 1. gbro-collage-broll (halftone paper-collage B-roll)

- **Repository:** `pyang5166/gbro-collage-broll` (`SKILL.md`, `README.md` in Chinese, `agents/openai.yaml`,
  `evals/evals.json`, `scripts/generate_video.py`).
- **Research file:** `docs/research/styles/five-skills.md`, section "Halftone Paper-Collage B-roll" (Part 2), and the
  "Collage" lines under "Not styles, but useful parts".
- **Licence:** MIT (© 2026 狗哥笔记).

### Taken from it
- The look: black-and-white halftone photographic cut-outs as the skeleton with visible printed dots; coloured
  cardstock for key items; crisp machine-cut edges; a thin warm-cream keyline round every piece; a soft low-opacity
  physical drop shadow; fine uncoated-paper fibre on a flat saturated field.
- Field colours measured by the research from the demo GIFs' last frames (corner averages of 240×427 palette-reduced
  GIFs, approximate): `#A62F23` red, `#DBA719` mustard, `#0D7169` teal, `#554767` purple.
- The colour-by-meaning table (burnt orange / red = time spent, labour, urgency; mustard = tools, warnings, lost
  experience; ink green = cognition, taste, a reset; deep purple = norms, long-term memory; teal = judgement,
  collaboration, automation; cobalt blue not the default); one design language per batch with the field changing.
- Layout: a locked 9:16 poster frame, the subject in the middle 70%, generous field, 3–6 large separable pieces, one
  metaphor per line with 3–6 objects, the metaphor and verb vocabulary.
- Motion: assemble from empty (the first frame is the empty field); the order structure → people or cards →
  connectors → action → result, then hold; crisp stop-motion timing; no fades, drift, wobble, slow zoom, morphing or
  new objects.
- Rhythm: one shot per line, no cuts, 3–10 s (5 s default); a batch of lines forms a small story.
- Bans: type, letters, numerals, logos, watermarks, UI, subtitles, the script on screen, glossy 3D, photoreal
  environments, clutter.

### Changed
- **No AI images.** The source makes every picture with image and video models. Here every cut-out is drawn: a
  halftone dot screen computed in SVG from a tone function (sphere shading, cloud puffs, an eye, a nitrogen molecule),
  newsprint and cardstock shapes, keylines and shadows in SVG, scissor-cut strip edges in CSS. `needs` stays false.
- **Words on strips.** The source bans all type; the catalog's samples need words, so this style allows them only as
  printed newsprint or cardstock strips pasted like the other pieces.
- **Timing.** The source leaves timing to the video model; every timing here is proposed.

## 2. "Halftone Collage Zoom" (GitHub list entry #77)

- **Where:** `X-RayLuan/awesome-opus-5-5-video-prompts`, entry 77 (@koldo2k).
- **Research file:** `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Halftone Collage Zoom (GitHub #77,
  vintage collage infinite zoom)".
- **Licence:** the list's `RIGHTS.md`: creators keep all rights to their prompts. So only the look's rules are
  described here, in our own words; nothing is copied.

### Taken (as rules)
- An endless constant-speed exponential zoom; depth layers scaled by camera^Z with Z from 0.45 to 1.22; cut-outs
  animated on twos (15 fps inside 30 fps there; 12 fps inside 24 fps here); halftone cut-outs with white borders and
  soft shadows; film grain, vignette and flicker; a 20 s seamless loop of 8 bars at 96 BPM.

### Not taken
- Its subjects (a man and a whale), the green-screen keying, the generative pipeline.

## Proposed (not in either source)
- Hexes for newsprint #ede6d6, ink #1a1714, keyline #f3e9d2, muted #6b6358, faint #cfc6b4, the green and orange fields
  (#1f4a3a, #c4551f), and the cardstock (cyan #3aa6c8, yellow #e9b92f, red #c8372d, orange #e07a2e, purple #6d5a9c,
  cream #f1e6cc); the sources name these colours in words only.
- Dot screen: 14 px pitch, 45°, radius ½ pitch × √tone × 1.12, 3% threshold, ±4% tone noise.
- Keyline 7 px (cardstock 4 px), shadow 6 / 12 / 9 px at 32%.
- Type: Libre Franklin strips (800 at 80 px, 900 for numbers, 600 at 30 px for labels), padding and tilt.
- Motion: the slide-and-snap curve [0.22, 1.18, 0.45, 1] over 0.5 s with an 8° turn, 0.25 s between groups and
  0.08 s between pieces, the zoom rate e^(0.35 t).
- Finish amounts: fibre 10%, grain 0.03, flicker ±2.5%, vignette 0.25.
- The sample scenes (sun, cloud and shards with the question; a halftone sun's beam fanning into cardstock colours;
  a nitrogen molecule with cyan shards and a red strip carrying on; the number card and two bars cut to the true
  5.9 : 1 ratio; three small collages for the steps; the cloud zoom with the last line).

## Changed for vertical
- gbro is already 9:16. The zoom entry is 1920×1080; its layers are re-arranged as rings around a centre so the
  vertical frame fills as the camera falls in.
