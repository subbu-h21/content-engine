---
name: style-technical-documentary
description: Visual style "Technical Documentary": a quiet, precise engineering documentary on the ink/bone palette. Bodoni equations built term by term (the spoken term bone, the rest ash), plots with a moving state dot, dimension lines, dials and leader labels; ember means heat (and the worked result), ice means cool; optional 3D cutaway plates. Use when a video is made in this style.
---

# Technical Documentary

## 1. In one line

A calm lecture on a dark bench: every line is drawn as it is named, every coloured pixel means something, and the
screen carries the symbols, numbers and diagrams while the narrator explains. It suits engineering and physics
explainers, how-things-work pieces and derivations, from a one-minute fact to a long lecture, with or without a 3D
cutaway.

## 2. Palette

The engine's ink/bone palette, used as an engineer would: the accents are meanings, not decoration.

| Role | Hex | Where |
|---|---|---|
| background (ink) | `#08070a` | the ground; pill fills (74%) and scrims (86%) |
| text (bone) | `#ede3d1` | all type, axes, curves, dimension lines, arrows, the state dot; the equation term being spoken |
| muted (ash) | `#857d78` | eyebrows, units, tick labels, notes; equation terms already read; steps already done |
| faint (dim) | `#4d4847` | grid lines, polar rings, the centre line of a wave, inactive dial sectors and parts |
| accent (ember) | `#ff6b29` | heat: heat added, combustion, flame, hot gas, the power stroke, work areas; the final worked result (a number in an equation); the red end of a comparison |
| accent2 (ice) | `#94d1ff` | cool: fresh charge, heat rejected, intake events, the cool or blue counterpart of a comparison |
| exhaust (3D only) | `#8a7a6a` | burnt gas leaving the cylinder in the 3D plates |

- Intake things are ice and exhaust things are ember, consistently in 2D and 3D.
- Colour on type is allowed only on symbols and numbers that carry that meaning (*Q*<sub>in</sub> ember,
  *Q*<sub>out</sub> ice, "≈ 60 %" ember). Prose is bone or ash.

## 3. Typography

- **Display:** Bodoni (Bodoni MT when installed, otherwise Bodoni Moda from Google Fonts), weight 400.
  - Headlines 88 px, titles 116 px, one or two short lines, sentence case, *italic* for the one word that matters.
  - Lower the size so the longest line fits the 888 px column.
  - Big numbers 220 px, the unit in italic.
  - Process steps (lists): 72 px, at most two lines each, the step being spoken in bone and the others in ash.
- **Equations** (Bodoni):
  - variables in *italic* (*p*, *V*, *T*, *r*, *γ*, *λ*, *θ*); numbers and operators upright;
  - lines at 64 px, a boxed result at 88 px, line height 1.2;
  - superscripts at 0.62 em raised 0.72 em, subscripts 0.62 em dropped 0.32 em, fraction rules 0.055 em;
  - Greek letters fall back to the next serif with an italic (Georgia / Cambria Math) because Bodoni has none.
- **Symbols on diagrams** (axis letters, state numbers 1–4, *θ*): Bodoni 40 px.
- **Labels:** Inter (Inter 18pt when installed) 28 px, mixed case, 0.4 px tracking, on quiet ink pills.
- **Ticks and units:** Inter 24 px in ash. **Notes:** Inter 30 px in ash or bone, line height 1.35.
- **Eyebrows:** Inter 24 px, 1.5 px tracking, ash.
- **Smallest text:** 24 px.
- **Words:** at most about 12 words of prose on screen at once.

## 4. Layout

- **Margins:** 96 px (888 px column). **Safe zone:** 230 px top, 330 px bottom.
- **Alignment:** left-aligned type; equations either left on the margin or centred when one stands alone;
  centred only for end cards.
- **Vertical stack** (re-laid out from the 16:9 source, where the engine sat left and the diagrams right):
  - chapter eyebrow at the safe-top line (y 230);
  - a heading in the top band (first line y ≈ 420);
  - the diagram in the middle (y ≈ 560–1300);
  - the equation or note under it (y ≈ 1400–1500).
- **With a 3D plate:** the cutaway fills the upper part of the frame (y ≈ 230–1150), framed by camera shift. The 2D
  panel goes below it on a soft ink scrim (86% fading to clear): stroke name, valve states, crank dial or plot.
  For 2D-only stretches the plate fades to ink and the diagrams take the full frame. *(proposed)*
- **No panels or cards:** diagrams sit straight on the ink. The only box is the result box.
- **How full:** one diagram per frame, plus its equation. Empty ink around it is deliberate.

## 5. Elements

- **Axes:** thin bone lines (1.6 px at 75%) from the bottom-left corner, running 30 px past the plot with 11 px
  arrowheads. Ticks are 9 px (1.4 px at 60%), with Inter 24 px labels in ash. Axis letters are Bodoni italic 40 px
  with units in Inter ash ("*λ* nm", "*p* (bar)").
- **Curves:** 3 px bone. A process carrying meaning is 3.5 px in ember or ice. Enclosed work areas fill with ember at
  24%; bands (limits, the cool pattern) at 12%.
- **State dot:** an 8 px bone dot with a flat halo (3.4× its radius at 25%, no blur). It moves with the thing it
  describes (the piston, the wavelength, the angle). Dashed readout guides (1.4 px, dash 6/6, 60%) run from it to
  the axes, with the values in the meaning colour.
- **Dimension lines:** engineering-drawing style.
  - The line is 1.6 px at 90% with 11 px arrowheads at both ends.
  - Extension lines (1.2 px at 45%) run from the measured points to 10 px past the line.
  - The dimension's symbol (*L*, *B*, *λ*) sits beside it in Bodoni italic.
- **Reference lines:** dashed bone, 1.6 px, dash 10/7 at 85% (TDC / BDC, ideal-cycle overlays).
- **Leaders:** a thin bone line (1.4 px at 55%) from a 4 px dot on the part to a 40 px tick and an ink pill.
  An accent ring (14 px at 22%) marks an ice or ember part.
- **Tags:** Inter 28 px on ink at 74%, 10 px radius, padding 0.32 × 0.55 em. Bare tags (no pill) for symbols and
  ticks.
- **Equations** build term by term, struck terms get an ember slash, and a finished result is boxed: 1.5 px bone at
  55%, 8 px radius, 34 px padding.
- **Polar and dial diagrams:**
  - Polar plots sit on dim rings.
  - The crank-angle dial is a ring marked 0–720°, 14 px wide, with a bone track at 12%. Its sectors are tinted
    (intake ice, power ember, the others ash); the active one is at 95%, the rest at 22%. TDC/BDC ticks, a 2.5 px
    needle, and the angle in Bodoni at the centre.
- **Process schematics:** nodes joined by bone arrows. The current node is filled; finished nodes are ash rings.
- **Images:** 3D cutaway plates only (section 9). No photos, no icons.

## 6. Motion

- **rise** (headlines): each word fades in and rises 18 px, expo-out 0.55 s, 0.09 s between words.
- **eyebrow:** slides 10 px from the left, expo-out 0.5 s; **rule:** expo-out 0.9 s.
- **fade** (diagram pieces, notes, tags): expo-out 0.6 s; leaving: smoothstep 0.5 s.
- **term:** each equation term fades in as it is read, expo-out 0.5 s. **spoken:** when the next term starts, the
  previous one settles from bone to ash (smoothstep 0.4 s).
- **draw** (curves, arrows, loops): smoothstep 1.2 s (curves up to 3 s when long), drawn as they are named.
- **axes:** smoothstep 1.0 s; ticks and labels come in over the last 40%.
- **dimension:** the line grows out from its middle, smoothstep 0.9 s.
- **state:** the state dot travels with its driver, smoothstep 1.4 s in the previews. With a 3D plate it is driven
  by the exported crank angle, frame by frame.
- **strike:** a cancelling slash draws across a term, smoothstep 0.6 s.
- **leader:** expo-out 0.6 s; the line reaches its point at about 60%, then the tick and pill.
- **out:** expo-out 0.35 s.
- **Holds:** an equation stays at least 1.5 s after it is complete.
- Nothing bounces. Type moves on expo-out; drawings and cameras on smooth in-out.

## 7. Transitions and rhythm

- **Chapters** open with the number and title as an eyebrow at the top left, with a short rule.
- **3D to 2D:** the engine dims and moves aside (a camera move), or fades to ink while the diagrams take the frame.
- **Cuts:** cross-fades of 0.4–0.6 s. No flashy wipes.
- **Order:** hardware first, then motion, then the diagram, then the maths, then one worked number.
- **Pace:** lecture pace. One drawing or term per narration phrase, and the screen never runs ahead of the voice.
- **Length:** the source was 14.5 minutes in 9 chapters of 46–144 s. The same rules hold for a short.

## 8. Finish

- Grain 0.03.
- Vignette 0.32.
- An ink halo behind type: four soft ink shadows at 2, 6, 14 and 28 px.
- No glow, bloom or gradients in 2D. The state dot's flat halo is the only soft edge.
- Bloom exists only in the 3D plates, baked in when they are encoded.

## 9. 3D look

Optional (`needs.3d: false`): the style works fully in 2D. When a video uses a Blender cutaway, it looks like the
source's engine.

- **Subject:** a realistic cutaway (here a single-cylinder engine with one intake and one exhaust valve) on a
  near-black ground with a faint floor reflection.
- **Materials:**
  - cast aluminium head and block: base 0.62 grey, roughness 0.48, light noise bump;
  - machined aluminium piston: 0.88, roughness 0.22, anisotropy 0.4;
  - cast-iron liner: 0.30, roughness 0.38;
  - polished steel crank, rod and valves: 0.86, roughness 0.24, anisotropy 0.3;
  - darker steel 0.36, spring steel 0.55, a ceramic-white plug insulator (0.86, roughness 0.18, clear coat 0.3);
  - **cut faces:** a flat, slightly warm matte (0.16 grey, roughness 0.8) with a fine stipple bump (noise scale 400,
    strength 0.15), so the section reads clearly;
  - floor: near-black (0.012), roughness 0.32.
- **Light:** four area lights.
  - Key from the upper left: 900 W, 4 m, warm white (1.0, 0.95, 0.9).
  - Cool rim from behind right: 1400 W, 3 m, (0.75, 0.85, 1.0).
  - Very low fill: 60 W, 6 m, cool.
  - Top light: 300 W, 5 m.
  - The camera sees near-black (0.004); reflections see a dark studio with one bright softbox band around 25°
    elevation, so polished metal reads as metal.
- **Gas:** an emissive, translucent volume between piston and head, coloured by temperature:
  - fresh charge ice (0.42, 0.72, 1.0), warming under compression (0.92, 0.80, 0.70);
  - the flame front (1.0, 0.86, 0.55) grows from the plug tip;
  - hot gas (1.0, 0.30, 0.04) cooling to a brown-orange exhaust (0.50, 0.22, 0.10);
  - the spark is a brief emissive pulse with a point light.
- **Camera:**
  - slow, eased moves;
  - side-on technical views at 50 mm and f/16, so dimension lines read straight; 60 mm on the head; 42–45 mm for the
    belt and flywheel;
  - shallow depth of field (f/5.6–11) only in the hook and recap;
  - lens shift frames the engine and frees space for type (vertically for a 9:16 frame *(proposed)*).
- **Colour and render:** AgX with the Medium High Contrast look. EEVEE with ray tracing, 16 samples for drafts and
  48 for finals. Bloom is added when the plates are encoded.
- **Sync:** the crank angle of every frame is exported, so the 2D dial and the state dot move exactly with the
  piston.
- **The previews:** they show no 3D. The 2D layer is the style's own; a cutaway is only added when a video asks for
  one.

## 10. Banned

- Decoration: every coloured pixel means something (ember for heat or the result, ice for cool).
- Colour on prose. Colour only on the symbols and numbers that carry the meaning.
- Boxes or cards around diagrams. The result box is the only frame.
- Bold or all-caps headlines; upright variables or italic numbers in equations.
- More than about 12 words of prose on screen.
- Unlabelled axes, plots without units, or numbers that aren't true.
- Glows, bloom or gradients in 2D.
- Flashy wipes, spins, bounces or linear easing.
- Calling combustion an "explosion"; hype; emoji or stock icons.

## 11. Where it came from

- **The user's own video:** `project-7-how-does-a-4-stroke-engine-work`. Licence: the user's own.
  - Read: `style.md`, `brief.md`, `plan.md`, `src/components/Tech.tsx`, `Leader.tsx`, the scene code
    (`S02Anatomy`, `S03Strokes`, `S05Otto`, `S08WorkPower` and others), `src/lib/theme.ts`, the Reel's props, and the
    Blender shot (`blender/shot_engine.py`, `blender/lib/engine.py`).
  - Looked at: frames from `out/video.mp4` and `brief/frames/`.
  - Taken from it: the palette and the meanings of ember and ice; the type rules (Bodoni variables, upright numbers,
    term-by-term build, bone vs ash, a boxed result, ember results); every line weight, arrowhead, dash, opacity and
    pill value above; the motion (expo-out type, smoothstep draws, axes 1.0 s, strike 0.6 s, holds 1.5 s); the
    finish (grain 0.03, vignette 0.32, halo 1); and the whole 3D look.
- **Built on the engine's ink/bone palette and Bodoni + Inter type** (`editorial-neuro`).
  - What sets it apart: the engineering layer in every frame (axes, ticks, dimension lines, state dots, dials,
    equations);
  - meaning colours allowed on symbols and results;
  - smaller headings, with the diagram as the hero.
- **Re-laid out for vertical:** the source is 16:9 (1920×1080), with the engine left and diagrams right. Here
  everything stacks top to bottom, and sizes are raised for a 1080 px-wide frame:
  - headings 64–96 → 88 px;
  - equations 50–66 → 64 px;
  - results 84 → 88 px;
  - symbols 30–34 → 40 px;
  - labels 26 → 28 px;
  - ticks 20–22 → 24 px (the minimum).

  The 3D framing below the type and the vertical lens shift are *(proposed)*.
- **The source's style.md and its code differ** on lenses (style.md says 60–100 mm; the code uses 42–60 mm). The
  code wins.
- *(Proposed):* the 116 px title, the 220 px number, process-step rows at 72 px, the 1.4 s state move in the previews, and
  the polar plot and process schematic. The source had no such samples; they show the shared sample content in this
  style. The physics shown is true: Rayleigh scattering I ∝ 1/λ⁴, its angular pattern 1 + cos²θ, and
  (700/450)⁴ = 5.86.
- Added to the catalog on 2026-10-31.
