# Sources: Shadow Puppet

## Lemo-Opuscar, style 07 "Shadow Puppetry"

- **Repository:** `lemomo-ai/lemo-opuscar`, `styles/shadow-puppet/STYLE.md`, `DEMO.md`, `style.json`.
- **Research file:** `docs/research/styles/five-skills.md`, section "Shadow Puppetry" (the research only).
- **Licence:** MIT for code and docs (credit: Lemo-Opuscar, lemomo-ai/lemo-opuscar). Demo films and stills are CC BY
  4.0; none were used.

### Taken from it
- Palette: vermilion `#b8211a`, flame `#d9541c`, ochre `#dc9d1e`, gold `#c98a26`, malachite `#236e3a`, jade
  `#2f8a5c`, indigo `#22647e`, raw hide `#e2bd80`, ink `#1a100a`, shaft `#4a2612`, lamp ≈ `#FFC475`, bloom ≈
  `#FFD199`, vignette ≈ `#B37840`, placard text `#f3e2bf`; all colour transmitted, warm, overlap = darkness,
  brightness from lamps.
- Type: the storyteller's placard (dark lacquer at 0.93, gold inner line, small vermilion seal, Cormorant Garamond 600
  at 46 px at 1080 high, cream, slides up 18 px in 0.22 s); plaques with letters cut out, carved border with a meander
  band, cloud-scroll roundels, a seal, carried on rods.
- Layout and elements: puppets in profile, empty lit cloth, a carved ground strip, the lacquer frame with a carved
  lintel and gold cloud curls, the puppet recipe, the carving vocabulary, carved fire and water.
- Motion: press on (2.6 → 1, blur 34 → 0 px, 0.55 s), lift off (×1.9, +30 px, ~0.9 s), hand tremor (~3 px, 0.018
  rad), operatic phrasing, lamp flares with overshoot, gutters over 0.35 s, the camera vocabulary.
- Finish: lamp lobe ~700 px and hotspot ~120 px, flicker ±6% at 7 Hz + 23 Hz, the cloth weave and blotches, warm
  bloom, saturation ×1.1, film grain.
- Bans: as in STYLE.md section 10.

### How it was rebuilt
- SVG: gradients and a pattern for the lit cloth; masked, multiplied hide pieces with generated carving; jointed
  figure pieces with rivets and rods; plaques as masks with cut-out text; CSS blur for the press-on.

### Proposed (not in the source)
- Lit cloth `#f0bf78`, lacquer `#7a1a12`, lacquer black `#140b07`, placard `#2a160c`; Cinzel 700 for plaques; simple
  carved lines in the seal instead of a character; sizes; the figure; the samples.

### Changed for vertical
- A wide stage → a tall proscenium with the audience below; plaque high, placard low; bigger words; one puppet group
  per scene.
