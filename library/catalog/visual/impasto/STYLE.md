---
name: style-impasto
description: Visual style "Impasto": a moving oil painting made of thick palette-knife strokes under raking light from the upper left, so every ridge, lip and cast shadow shows. Value-planned flat shapes filled with knife strokes that stay inside them, colour laid in planes of slightly broken paint with gradients as stroke-to-stroke steps, Fraunces titles laid in with the knife, crisp small text on calm planes, and colour itself as the event (a grey world re-painted in colour). Use when a video is made in this style.
---

# Impasto

## 1. In one line

A thick, knife-laid oil painting that moves: every plane is built of buttery strokes you could touch, the light rakes
across them, and colour arrives as an event. It suits music films without narration, "colour returns" stories (a
recovery, a relaunch, a town waking), city and street scenes, still lifes that come alive, and warm science and
nature explainers.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (cobalt sky) | `#34507e` | the top of an after-rain sky; the default ground |
| peach / gold | `#d99a78` / `#f7dca0` | the middle and low sky, the sun, sunlight |
| text (titanium cream) | `#f4ead6` | titles laid in with the knife; crisp small text *(proposed)* |
| muted (facade rose) | `#c98d7e` | secondary planes |
| ochre / shutter / awning | `#dca064` / `#3f7a6c` / `#b8342a` | facades, shutters and dark greens, awnings |
| faint (burnt umber) | `#3b2c24` | calm dark planes behind diagrams and lists *(proposed hex for the source's "night kitchen umber")* |
| umberDark | `#2a201b` | dark paint for crisp text on light planes, cast ridges *(proposed)* |
| ultramarine | `#1f2a6e` | the deep ultramarine end-card ground *(proposed hex)* |
| accent (cadmium red) | `#dc2f28` | the subject's colour: the brightest, purest paint, the first colour back |
| accent2 (pure cobalt) | `#2f62c0` | blue light, the second subject colour |
| yellow / orange / magenta | `#f4bc2a` / `#ee7a2a` / `#cc3a82` | full-chroma props, the spectrum |
| viridian / turquoise / violet | `#23906c` / `#26aab4` / `#6e4cc0` | full-chroma props, the spectrum, scattered light |

- **Planes of mixed, slightly broken colour:** each stroke drags a second colour into the first (at 42%), values
  jitter ±6%.
- **No blended gradients:** a gradient (a sky) is a step from stroke to stroke, each stroke picking its band.
- **Warm light, cool shadow.** The purest chroma is kept for the story's subject (here: "blue?" in pure cobalt), never
  spent on the background.
- **Colour can be the event:** every stroke has a grey version (its luminance, slightly cool, with a 5% residue of
  colour), and a reveal wave re-paints them in colour one by one.

## 3. Typography

- **Titles:** Fraunces 900, laid in with the knife: the letters are filled with small knife strokes (15 px at 120 px
  type), raised by their own soft shadow (5 px right, 7 px down, 38%), revealed by a left-to-right sweep (~0.6–0.9 s).
  Sizes: the title 114–126 px, the subject word 260 px, numbers 330 px, headlines 112 px, end line 168 px. Leading
  1.02, tracking −0.01 em. Sentence case.
- **Small text stays crisp** (knife strokes can't carry small letters): Fraunces 600, 44–56 px, cream on dark planes
  or umber on light ones, with a faint dark outline; it fades in over 0.3 s. At most two lines.
- **Emphasis:** one word laid in a pure subject colour. **Words:** about 8 at most. The smallest text is 32 px.

## 4. Layout

- **Value first:** each scene is a flat, value-planned illustration (at least three values) that reads at 480 px wide,
  then converted to knife strokes.
- **The subject gets the hard edges and the smallest strokes;** everything else stays in big calm planes. Stroke
  sizes: planes 56–64 px, buildings 42 px, edges and small things 9–16 px, letters 10–15 px.
- **Margins** 90 px; must-read words between x = 90 and 960. **Safe zone:** 230 px top, 330 px bottom for words;
  the painting runs to the edges (the camera never leaves the painted plate).
- **Crisp text sits on calm planes** (umber, deep sky), never on busy colour.

## 5. Elements

- **The knife stroke:** longer than wide (1.7–3.1 × r long, 0.95–1.45 × r wide), slanted ends, skew ±0.55, a slight
  bend, angle jitter ±13°, value jitter ±6%; its body drags a second colour; four or five striations along its length
  (some breaking off early where the paint ran out); a light lip on the edge the knife pressed, a dark one opposite, a
  light crescent where it lifted; a cast shadow 3.5 px right and 4.5 px down at 20%.
- **Strokes never cross from one shape into another** (each plane is clipped to its shape), so silhouettes stay crisp.
- **A thin underpainting** in each plane's colours (bands for a sky) under the strokes, so canvas never shows.
- **Reflections** on wet ground are stacks of short horizontal dabs under each light, broken and fading, never a painted
  rectangle.
- **Light and colour as rays:** wedges of knife strokes (a beam of sunlight, a fan of every colour).
- **Spheres** are painted stroke by stroke: cream where the light hits (upper left), the mid colour, then the shadow
  colour.
- **Figures** (in a video) are built from tapered strokes with a lit edge and one or two defining dabs; never plain
  rectangles.

## 6. Motion

- **Static paint never moves.** Only what the story moves moves (weather, figures, props, light). Smooth at 30 fps, no
  stepping, no boil: moving strokes are rebuilt from fixed seeds.
- **lay** (each stroke): it grows along its length, cubic-out over 0.16 s.
- **sweep** (a plane or a title being laid in): strokes in order along a direction, sine in-out over ~1 s
  (0.3–0.9 s for small planes and titles).
- **reveal** (colour returns): a wave from a point (here the subject word) at ~950 px a second; each stroke turns from
  grey to colour, sine in-out over 0.35 s.
- **pop** (something bursting open on a beat): a spring, damping 9, stiffness 180, mass 1 (it overshoots).
- **Every gesture:** anticipation → action → follow-through, landing on the music grid.
- **Raking light at the peak:** drop the light to a grazing angle so every ridge catches it, then settle.
- **Holds:** 1.2 s once a painting is complete.

## 7. Transitions and rhythm

- **Transitions:** a paint-over sweep (the next shot's strokes laid over the last), a scrape, or a hard cut on the
  beat ("one action = one sound = one cut"). Never a dissolve (two layers of ridges turn to mud).
- **Camera:** a slow truck and push on a wide, a push in through a silence, a tilt up from the ground or a reflection,
  a pull back from a close-up, an overhead crane-out, the same wide repeated before and after, a locked frame with
  moving light, a macro slide along the paint, a whip pan into a new plate.
- **Shots** of 2.5–8 s (the source: 2.65, 4.5, 5.25, 4.5, 2.7, 4.1, 8.2, 4.1, 3.9 s); a silence before colour returns.

## 8. Finish

- **Raking light** from the upper left (azimuth 227°, elevation 41°, the source's light vector [−.55, −.6, .7]) over a
  relief taken from the paint's own values: diffuse at the source's .28 : .8 ratio to ambient (a flat area keeps its
  value), specular 0.22 for a wet sheen.
- **Vignette** 0.2. **No film grain** (it eats the knife edges). No glow.

## 9. 3D look

None: a lit 2D relief only.

## 10. Banned

- A swirl filter, or strokes boiling everywhere.
- A brush texture over flat vector art; a painterly photo filter (strokes are designed, not sampled from noise).
- Watercolour (the paint is opaque); dissolves; film grain; blended gradients.
- Strokes crossing from one shape into another; plain rectangles as figures; a painted rectangle for a reflection.
- The camera leaving the painted plate.
- Copying a painter's or a film's images, compositions, melodies or characters, or naming them.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 04 "Impasto Palette Knife" (`styles/impasto/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "Impasto Palette Knife". Its demo films
  and stills are CC BY 4.0; none were used.
  - Taken: every palette hex of the demo (sky cobalt, peach and gold; facades; shutter, awning; the umbrella
    colours); planes of broken colour with a dragged second colour; no pixel gradients; warm light and cool shadow;
    the purest chroma for the subject; colour as the event with a grey version of every stroke and a reveal wave; value
    first, reading at 480 px; the subject's hard edges and small strokes against calm planes; the knife stroke's
    proportions, skew, angle and value jitter, ridge, lip and running-out streaks; strokes never crossing shapes; a thin
    underpainting; reflections as broken dabs; titles laid in with the knife and small text kept crisp; static paint
    that never moves, no boil; anticipation and follow-through; the paint-over sweep and cuts on the beat; the camera
    vocabulary; raking light from [−.55, −.6, .7] with diffuse .28 and ambient .8; no grain; the bans.
  - **Rebuilt for Remotion:** the WebGL height-field renderer becomes SVG: each stroke draws its own lip, streaks and
    cast shadow, and one feDiffuseLighting / feSpecularLighting pass lights the painting's values as a relief.
  - **Font:** the source names Cormorant as an example; Fraunces 900 was chosen because knife-filled letters need
    weight.
  - **Changed for vertical:** the source is 1920×1080 with 40–60 px plane strokes; here the 1080×1920 frame stacks the
    sky, the subject word and the street top to bottom, stroke sizes stay similar (56–64 px planes), titles are bigger
    (114–330 px), and each frame holds one idea.
- *(Proposed):* the cream, umber, dark umber and ultramarine hexes; Fraunces; the type sizes; the stroke grid, the
  lip, shadow and striation values; the curves and the reveal speed; the pop spring; vignette 0.2; the sample scenes
  (a grey town re-painted in colour from "blue?", a sun throwing a fan of seven colours, a gold beam into two painted
  spheres with cobalt and turquoise dabs flying out and a red stroke going on, bars cut to the true 5.9 : 1 ratio,
  three painted icons, an ultramarine end card over dark rooftops).
- Added to the catalog on 2026-11-01.
