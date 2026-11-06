# Sources: Lit Pixel Diorama (folder id `hd-2d`)

## Lemo-Opuscar, style No. 31 "HD-2D Lit Diorama" (library name "HD-2D")

- **Where:** github.com/lemomo-ai/lemo-opuscar, `styles/hd-2d/STYLE.md`, `DEMO.md`, `style.json` (category Games).
  Read through the research notes `docs/research/styles/five-skills.md`, section "HD-2D Lit Diorama". Example frame
  (not downloaded): `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/hd-2d.jpg`.
- **Licence:** MIT for code and docs; the demo film and stills are CC BY 4.0 (credit LemoLab). The demo's music
  (Scott Buckley, *Precipice*, CC BY 4.0) is third-party and not used. Nothing from the demo was copied; the look is
  rebuilt from its written rules. Cinzel and Cormorant Garamond: SIL OFL.
- **Name:** "HD-2D" is a trademark of its owner; the source says never to use it as a title or brand. The style is
  named "Lit Pixel Diorama". The folder id `hd-2d` was the requested working id; renaming it means renaming the
  folder, `id` in style.json and `name:` in STYLE.md together.

### Taken from it
- Hexes: night sky (`#050818` → `#101d3e` → `#2c4262`), harbour fog `#16223a`, moon `#8fa8e0`, fire and windows
  `#ff9d4a`, lantern `#ffb050`, lighthouse `#fff0c8`, cool fill `#9fb2e8`, the crimson cloak ramp, scarf gold, the
  keeper's navy ramp, ink `#1a1016`, selout `#160e1e`, UI golds, parchments, the title gradient, the chapter card.
- Rules: two temperatures, one fog and one key per set, one saturated costume colour, UI = one metal + one paper
  white over a dark translucent plate; always look down on the world.
- Type: Cinzel 500/700 for chapter labels and titles with wide tracking, Cormorant Garamond italic narration on a
  soft dark band (max 0.38) with a 10 px shadow, Cormorant dialogue and name plates; their timing (fade in 0.35 s
  before, out 0.45–0.8 s after; dialogue typed over ~92% of the voice).
- The dialogue box (navy plate gradient, 2 px gold border + inner 1 px line, gold diamond corners, a name plate over
  the top-left edge, a blinking gold ▼, a 14 px slide up), chapter cards with a gold ornament line and diamond and a
  drifting pixel ember, title cards over a set dimmed 50%.
- Pixel textures at one constant density; billboard sprites with a 1 px selout; lights that breathe (three summed
  sines, ±20%) and pop on at a steady cadence (0.7 s); walks at 9 fps, idles at 1.4 Hz; "the set never moves".
- Finish: bloom, a vignette/grade, tilt-shift; no grain. Transitions: short fades or cuts; no wipes or 3D spins.
- The banned list.

### Proposed (not in the source)
- The 2D view (front faces upright, ground receding 0.62 px per unit, heights 0.78), the set's texture colours and
  tile designs, dawn and day keys, per-time fog strength, the harbour layout, the invented hero and keeper sprites,
  every px size, the bloom and vignette amounts in 2D, the tilt band as a fixed strip.
- The sample scenes: a chapter card at night, a prism splitting dawn light, the air molecule lit by the lighthouse
  speaking in the dialogue box, light pillars as the 5.9× chart, lamps lighting one by one for the steps, a title
  card over the day.

### Changed for vertical
- The 1180 × 210 dialogue box became 960 × 280, above the 330 px safe zone.
- Narration moved from y = H − 88 to y = 1320, or above the roofs when the subject sits low in the set.
- The set fills the lower half with titles in the sky above; the tilt band is a horizontal strip across the set.
