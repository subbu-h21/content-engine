# Sources: Technical Documentary

## The user's own video: `project-7-how-does-a-4-stroke-engine-work`

- **Where:** `D:\code_files\animations\project-7-how-does-a-4-stroke-engine-work\` (read only; nothing in it was
  changed, run or rendered).
- **Licence:** the user's own video and code.
- **Read:** `style.md`, `brief.md`, `plan.md`, `src/lib/theme.ts`, `src/Root.tsx` (the Reel's saved props: leading
  1.04, stagger 0.09, word 0.55 s, rise 18, halo 1; grain 0.03, vignette 0.32), `src/components/Tech.tsx` (envelopes,
  partial paths, arrows, dimension lines, dots, tags, inline maths, equation lines, axes, scrims, crank dial),
  `src/components/Leader.tsx`, the scenes `S02Anatomy`, `S03Strokes`, `S05Otto`, `S08WorkPower`, `util.tsx`, and the
  Blender shot `blender/shot_engine.py` + `blender/lib/engine.py` (materials, lights, world, camera poses, gas
  colours, AgX look, EEVEE samples).
- **Looked at:** `brief/frames/01_four_strokes.png`, `02_otto_cycle.png`, `03_ideal_vs_real.png`, and 14 frames
  sampled with ffmpeg from `out/video.mp4` into a scratch folder outside the project (hook, anatomy labels, TDC/BDC
  and bore/stroke dimensions, displacement and compression-ratio equations, the stroke panel with the crank dial,
  the valve-timing diagram, the P–V and T–s plots, the efficiency derivation with strike-throughs, the boxed result,
  the η–r plot with the knock band, ideal vs real, the loss bars, the worked torque/power example, the recap).

### Taken from it
- Palette and meanings: ink, bone, ash, dim; ember = heat and worked results; ice = cool; the 3D-only exhaust colour;
  intake ice / exhaust ember throughout.
- Type: Bodoni with italic variables and upright numbers, Inter labels on ink pills, equations built term by term,
  the spoken term bone and the rest ash (style.md), boxed results, ember results.
- Every drawing value: axes 1.6 px / 75% / 11 px arrowheads / 30 px overshoot / 9 px ticks; curves 3 and 3.5 px;
  area fill 24%, band 12%; state dot r 8 with a 3.4× halo at 25%; dimension lines 1.6 px / 90% with 1.2 px / 45%
  extension lines 10 px past; reference dashes 10/7; leaders 1.4 px / 55% with a 40 px tick; tag pills at 74%,
  radius 10; result box 1.5 px / 55% / radius 8; crank dial (14 px ring, sector opacities, 2.5 px needle);
  superscripts, subscripts and fraction rules.
- Motion: expo-out type rise (0.55 s, 18 px, 0.09 s stagger), expo-out fades (0.6 s), smoothstep draws (1.2 s),
  axes (1.0 s, ticks over the last 40%), strike (0.6 s), leader (0.6 s), out (0.35 s); 1.5 s equation holds;
  0.4–0.6 s cross-fades.
- Finish: grain 0.03, vignette 0.32, ink halo 1; no 2D glow; bloom only in the plates.
- The whole 3D look (section 9 of STYLE.md).

## The engine's ink/bone palette and type (`library/catalog/visual/editorial-neuro`)
- Licence: the engine's own. The style is built on it, as the source video was.

### Proposed (not in the source)
- Sizes for vertical: headings 88 px, titles 116 px, equations 64 px, results 88 px, symbols 40 px, numbers 220 px,
  labels 28 px, ticks 24 px, notes 30 px, process-step rows 72 px.
- The vertical stack, the 3D plate framed in the upper part with the 2D panel below it, and the vertical lens shift.
- The 1.4 s state-dot move in the previews (in a video it follows the exported crank angle).
- The sample scenes themselves: a dimensioned wave, a wavelength axis, a polar scattering plot (1 + cos²θ), a plot of
  I ∝ λ⁻⁴ with a moving state dot and the worked ratio (700/450)⁴ ≈ 5.9, a process schematic, and the boxed law.

### Changed for vertical
- The source is 16:9 (1920×1080), with the engine on the left and the diagrams on the right. Here everything stacks
  top to bottom, with fewer elements per frame and bigger sizes (see STYLE.md section 11). Ticks and dial labels
  were raised from 20–22 px to the 24 px minimum.
