# Sources: Black Glass Studio

## Claude + Blender: Make 3D Motion Graphics From Code

- **File:** `D:\code_files\resources to make content engine\pdf guides\Claude + Blender_ Make 3D Motion Graphics From Code.pdf`
  (7 pp, text only, no frames). Pages: 1 (what you make), 2 (pieces and tools), 3 (the prompt's six blocks: BRAND,
  FORMAT, BEATS, CAMERA, LOOK, CHECKS), 4 (files, review checklist), 5 (fix rounds, chunked GPU render), 6 (sound,
  encode, "make it yours", the 9:16 rule), 7 (troubleshooting).
- **Research notes:** `docs/research/styles/local-guides.md`, "Claude + Blender — Black Glass Studio (glowing UI panels
  in 3D)".
- **Licence:** none stated for the guide. The prompt it builds on is a creator's free prompt pack on X (linked in the
  PDF), not included here. The look is described in our own words; nothing copied.
- **Not used:** the film's hero is a company's mascot and its app a look-alike of a real editor ("leave out real
  logos", p. 6). This style uses an invented toy hero (a glossy rounded block, no face) and a generic app (tool
  buttons, timeline, nodes, meters) instead.
- **Fonts:** Sora, Geist and Geist Mono are SIL OFL (Google Fonts); the source names no fonts.

### Taken from it
- The concept: floating black glossy glass slabs with glowing screens, a toy-shaped hero pressing buttons, every press
  building a title card, panels powering down and falling, the card as the poster.
- Format: Blender + Cycles GPU, 30 fps, 12 s at 120 BPM (24 beats, 360 frames); the interface as one 3840 × 2160 HTML
  render; the comp as a per-frame canvas; one shared timeline file.
- Camera: wide to start, following each hop at the hero's height with shallow focus, ending on the comp alone.
- Look: screens glow under black glossy glass; lights hidden from glossy rays; AgX with exposure −0.4 and a darker
  hero base colour, checked against the hex.
- Review: text readable at phone size and inside the frame; elements where they belong; hero colour; no white blocks;
  last frame works as a poster; stills at half size and 40 samples first.
- Sound: synthesised, 120 BPM, one sound per action; loudness every 0.5 s; −1 dBTP true-peak ceiling.
- Encode: `vignette=angle=PI/6`, libx264 high, CRF 17, yuv420p, AAC 320k, faststart.
- Gotchas: `view_layer.update()` before parenting; GPU script every render; chunked renders; brightness scan.
- Vertical: a separate composition with bigger type and fewer elements, never a crop.

### Proposed (the source gives no visual numbers)
- Every colour (set, glass, edge, screen, UI, screen light, hero), every font and size, every motion value (pop
  spring, hop, press, stamp, build, ride, power-down, fall, peel), the material values, lens, f-stop, lights, final
  sample count, the CSS approximations used in the previews (slab faces, sheen, depth-of-field blur, billboard hero).

### Changed for vertical
- The 16:9 film becomes a vertical stack: the card on top, the working panel tilted below like a floor, at most one
  more slab far and soft; type sized for the phone.
