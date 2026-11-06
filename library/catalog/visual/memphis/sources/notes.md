# Sources: Memphis

## Lemo-Opuscar, style No. 71 "Memphis Diorama" (made by @EianLu)

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/memphis-diorama/STYLE.md`, `DEMO.md`, `style.json`; frame and
  type constants checked in `demo/memphis.js` (by the research notes). Read through
  `docs/research/styles/five-skills.md`, section "Memphis Diorama". Example frame (not downloaded):
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/memphis-diorama.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab; the demo's sign-off
  credits Eian). Nothing from the demo was copied: the look is rebuilt from its written rules. Inter Tight and
  IBM Plex Mono: SIL OFL.

### Taken from it
- Colours: paper `#FFFCF6`, ink `#25214A`, the shadow multiplier (0.70, 0.58, 0.90), light `#FFD36E`, pool `#FFE3A3`,
  window glass `#BFE4FF` / `#2C2752`, dusk `#FF9E7A`, the three type colours, the three mark colours, the example hues
  (yellow, pink, sky, mint, lilac, peach, cobalt, coral, green), spring grass, water tones, the summer crown.
- Rules: 5–7 saturated hues + 2–3 pastels, flat fills, no gradients, colour clustered by area with calm areas; night
  as a luminance shift toward violet, never grey; lights the same warm yellow.
- Type: three centred lines under the frame (title Inter Tight 600 dark, sentence 400 grey, data Plex Mono light
  grey), fixed places, empty lines leave their place empty, ~0.4 s cross-fades; three marks above the type (yellow dot,
  pink triangle, blue zigzag); callouts as a rounded pill + leader + dot popping out with a back-ease.
- Frame: a rounded organic frame (radius 34) whose edge is displaced by noise (±22 px at 1/170, ±5.5 px at 1/38) plus
  grain reseeded on a slow clock; it grows open from the centre (0–1.2 s) and never moves.
- Elements: detail built from parts (the house recipe), at least five crown shapes with lighter sun-side lobes,
  layered water with foam lines and squiggles, six pattern kinds, hatched cut faces one step darker, halftone dots in
  shade, three tones only, lamp pools without outline or shadow.
- Motion and transitions: everything eases; things grow or back-ease in; squash and spring for a state change; the
  wave; natural looping motion with its own phases; only the frame's grain steps; three transitions only; no white
  flash, spin or fast cut. The banned list.

### Proposed (not in the source)
- The oblique 2D view (0.38 right and 0.72 up per unit of depth), a sky backdrop inside the frame (the subject is the
  sky), rods for things in the sky, paper strips for light, cobalt zigzags for scattered blue.
- The trunk and soil colours; the night multiplier (0.45, 0.42, 0.78); halftone cell and dot sizes; the spring and
  back-ease numbers; all px sizes; the sample scenes and their data lines (each one true:
  "(700/450)^4 = 5.86", "visible light · 380–700 nm", "air · mostly nitrogen and oxygen").

### Changed for vertical
- The 1520 × 744 frame (1920×1080) above three lines of 25 / 18 / 15 px became a 952 × 834 frame at the top with
  lines of 64 / 38 / 28 px (number 96 px) below it, all above y = 1470; line 1 and line 2 may wrap to two lines.
- The picture shows a smaller piece of a place (three houses, five trees, a river) seen closer; the paper below the
  type is left empty (it's where platform buttons and captions sit).
