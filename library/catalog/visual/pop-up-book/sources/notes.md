# Sources: Pop-up Book

## Lemo-Opuscar, style No. 41 "Paper Pop-up Book (Cut-Paper Diorama on a Real Desk)"

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/paper-popup/STYLE.md`, `DEMO.md`, `style.json`; finish values
  checked in `demo/post.js`, `demo/lib.js`, `demo/mux.sh` (by the research notes). Read through
  `docs/research/styles/five-skills.md`, section "Paper Pop-up Book". Example frame (not downloaded):
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/paper-popup.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab); the demo's music (Kevin
  MacLeod, CC BY 4.0) and Poly Haven HDRI and props (CC0) were not used. Nothing from the demo was copied; the look is
  rebuilt from its written rules. Lilita One, Fredoka and IM Fell English: SIL OFL.

### Taken from it
- Hexes: ink `#3a2a24`, border `#fffdf7`, card edge `#b9ad9c`, card back `#efe8da`, ground and hill greens, path,
  day and night skies, sea blues, the hero's skin / jacket / boots, accent red `#e8413a`, sun `#ffd766`, sign gold
  `#ffcf3f`, ribbon `#d8423a`, cloth `#1f5566`, foil `#e0b456`, page edges `#efe6d2`, subtitle `#fffaf0`, bubble text
  `#7a5e4c`, walnut tint `#c9a88a`; the colour rules (saturated, never neon; a hue family per spread; graphite pages
  outside the story).
- Type: Fredoka for subtitles (cream, 8 px dark-brown outline, soft shadow) and bubbles; Lilita One for the cover,
  chapter banners (gold, 12 px ink stroke) and action words; IM Fell English for taglines and "The End"; bubbles
  (white, radius 44, 6 px outline, a tail, 30 chars/s, a bobbing red triangle).
- Cut-paper finish (outline 9 px, detail 5 px, one hard crescent, dilated grey edge and off-white border, paper
  grain, wobbly shapes, simple faces); pop-ups hinged on the page with paper backs and cut-out shadows; paper
  mechanisms (sun on a stick, slats, strings); the book (cloth, foil, page block).
- Motion: `back(t, s)` with s = 1.7 over 0.55 s for pop-ups and the depth delay (0.3 − z) × 1.2 s; strings
  `spring(t, k = 7, z = 0.35)`; sway; character rules (flat cards, blink every 3.7 s, flips not rotations); the page
  turn (2.3 s, bend 0.55·sin πu); slats 0.28 s apart; the room never moves.
- Transitions (page turns, book close, a hard cut on a paper sound; never a dissolve), finish (DOF, bloom 0.2,
  vignette 0.35, warmth (1.06, 1.0, 0.9), neutral tone mapping, encoder grain), the banned list.

### Proposed (not in the source)
- A procedural walnut desk (turbulence grain, blurred 7 px) and lamp pool instead of the photo HDRI and veneer; the
  desk base colour `#6b4630`.
- The 2D book geometry for a tall frame; pieces scaled by depth and hinges drawn as a vertical squash.
- The invented reader-kid (yellow beanie, blue jacket) and air molecule, the paper rainbow (orange `#f28c3a`, violet
  `#8a6cc8` added), cheek pink, house cream, blue paper darts for scattered light, pull-tab columns for the chart,
  numbered paper tags; every px size; the sample scenes.

### Changed for vertical
- The low macro view of a landscape spread became a view from the reader's edge: the sky board stands in the upper
  half, the ground page fills the lower half, the desk frames it.
- Subtitles moved from the bottom edge (40 px at 1920×1080) to the front strip of the page (52 px at y ≈ 1336).
- Signs, bubbles and tags use the board; pieces stay in the back 62% of the page so subtitles never cover them.
