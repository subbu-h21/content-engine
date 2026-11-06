# Sources: Night-sky Classroom

## The user's own video: `project-5-why-the-sky-is-blue`

- **Where:** `D:\code_files\animations\project-5-why-the-sky-is-blue\` (read only; nothing in it was changed or run).
- **Licence:** the user's own video and code.
- **Read:** `style.md` ("Night-sky classroom"), `brief.md`, `plan.md`, `script.json`, `src/lib/theme.ts`,
  `src/lib/fonts.ts`, `src/lib/motion.ts`, `src/Root.tsx` (the Reel's saved props), `src/components/Headline.tsx`,
  `Text.tsx`, `Finish.tsx`, `src/scenes/sky.tsx` and all seven scenes `S01Hook` … `S07End`.
- **Looked at:** `out/check/all.png` (seven stills across the video), `brief/frames/01_sunlight.png`,
  `02_bounce.png`, `03_sunset.png`. Colours sampled with Pillow (8-colour quantise + pixel samples): the night
  ground measures `#0b1026` at the edges and `#172047` at the glow centre, matching the code.

### Taken from it
- Palette: night ink, ground glow, bone text, quiet, dim, ember, the six spectrum colours, sun, beam white, pale blue,
  hill, child; the day and sunset sky gradients (from `sky.tsx`).
- Type: Fredoka 500 headlines at 112 px with 700 for emphasis, centred, leading 1.1; Inter 500 38 px pill labels;
  Inter 24 px eyebrow with 1.5 px tracking and the 140 px rule.
- Motion: word rise 20 px / expo-out 0.55 s / 0.09 s stagger; pill expo-out 0.5 s rising 12 px; beam 0.9 s; fan
  1.1 s; wave draw-in 1.4 s; wave travel 0.9 s; molecule pop 0.5 s over 1.2 s; ray draw 0.8 s; burst life 1 s,
  every 0.55 s on a hit; sky change smoothstep 1.4 s; fade-out 0.35 s; 1.5 s holds; ~0.4 s cross-fades.
- Elements, with their exact sizes: sun gradient, beam and prism fan, glowing waves (red / blue / rainbow / hit
  wavelengths, amplitudes, widths, speeds), molecules, scatter bursts, sparkle, dashed rays with travelling dots,
  hill curve, child silhouette, pills with colour dots.
- Finish: grain 0.02, vignette 0.3, ink halo 0.8.
- The idea of the ground colour changing at the payoff (night → day sky → sunset → night).

### Proposed (not in the source)
- Title size 124 px (inside the source's stated 110–130 px), 84 px floor for long lines, number 280 px, list rows
  72 px, body 34 px.
- The count-up (expo-out 1.4 s) and the glowing comparison bars for the number sample.
- The list layout (pictures down a dashed path) and the eye drawing (the source style.md suggested an eye icon; the
  video used the child instead).
- The sample scenes themselves: each shows the shared sample content (`library/catalog/sample.json`) in this style.

### Changed for vertical
- Nothing: the source was already 1080×1920.
