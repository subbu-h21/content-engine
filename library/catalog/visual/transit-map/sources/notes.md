# Sources: Transit Map

## Lemo-Opuscar, style No. 72 "Transit Map"

- **Repo:** https://github.com/lemomo-ai/lemo-opuscar, `styles/transit-map/` (`STYLE.md`, `DEMO.md`, `style.json`;
  counter colours from `demo/timeline.js`, paper and table values from `demo/gl.js`); film
  https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/transit-map.mp4 .
- **Research notes:** `docs/research/styles/five-skills.md`, section "Transit Map". Nothing from the repo was
  downloaded for this style.
- **Licence:** MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link). No code was copied.
  The demo's line colours are Shanghai's published ones (an unofficial tribute) and are not used here. Overpass is
  SIL OFL.

### Taken from it
- Colours: paper `#F2EEE5`, ink `#1B1C1E`, warm grey `#4A4740`, water `#BCD6EA` / edge `#8FB5D6` / labels `#5F88AD`,
  accent `#E3002B`, comparison navy `#24346E`, table ≈ `#1B1918`, counter plate `#17191C` / `#2A2D31`, drums
  `#EFE9DC` / `#FAF6EE`, counter labels `#EFE8D8`, `#AAA395`, `#8B8577`.
- Rules: line colour = identity; mode by form; light lines carry ink in bullets; paper veil not dark overlay; labels
  placed once against the finished network with eight candidates; everything printed on the sheet; reading time.
- Every G measure (line 0.15, thin 0.07, fillet 0.34, parallel 0.20; stop r 0.085 + ring 0.046; terminus r 0.15 +
  0.06; capsule pad 0.13, outline 0.055 / 0.07; river 0.76 + 0.025 edge; tunnel 0.16 / 0.11 with 0.02 casings at 55%;
  pen tip 0.11 / 0.05 / halo 0.8 at 45%; callout bar 0.10; you-are-here 0.17 + 0.04; label halo 0.05 at 92%) and the
  label sizes; the counter plate (width, 86 px rows, 14 px radius, four screws) and drum figures.
- Motion and camera: pen tips on monotone keyframes; stop pop 0.6× with overshoot in ~0.28 s and spreading ring;
  interchange drops; bullets; callouts wiping on in ~0.5 s; drums landing only on sourced values; what never moves;
  32° FOV, DoF formula capped at 26 px, every named camera move with its tilt/zoom/aperture, level of detail; match
  cuts, glides, hard cuts; finish (paper ± 3%, raking light NW +7%, edge shadow, vignette −24%, grain); banned list.

### Proposed (not in the source)
- Overpass as the neutral grotesk (the demo used Inter; Overpass is a signage face and avoids the generic Inter look).
- The invented network "Sunlight lines": six lines named by wavelength (700, 620, 580, 530, 450, 400 nm; approximate
  colour wavelengths) and stations named after the sky (Sun, Stratosphere, Air, Zenith, East/West/North sky, Your eye,
  Sunset, Haze, The sea). The cartouche says on the sheet that it is a metaphor, not a real network. The line colours.
- Bullets r 0.3 G with 0.2 G numerals (the source's 0.25 / 0.15–0.27 would be under 24 px at these zooms).
- The 2.5D camera built from CSS perspective (FOV 32°) and a blurred copy masked to a focus band; pen timing.
- The counter's second label "Rayleigh: (700 ÷ 450)⁴" (the ratio behind the sample's 5.9, which is 5.86).

### Changed for vertical
- A tall 9 × 15 G sheet; the aim point at y = 1000; zooms 66–172 px/G; the counter at y = 250 inside the safe zone;
  each sample one camera move with its own printed extras instead of one continuous 47 s film.
