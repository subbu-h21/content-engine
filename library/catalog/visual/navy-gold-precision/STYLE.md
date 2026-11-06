---
name: style-navy-gold-precision
description: Visual style "Navy & Gold Precision": an expensive, restrained product-film look; navy-black metal, one precious warm-gold accent that glints, matte dimensional UI surfaces tilted like a macro product shoot, Plus Jakarta Sans with JetBrains Mono numbers, 3–4 words per line, premium ease cubic-bezier(0.16, 1, 0.3, 1). Use when a video is made in this style.
---

# Navy & Gold Precision

## 1. In one line

Ruthless restraint that looks expensive: dark navy metal, one warm-gold accent used like jewellery, the interface
rebuilt as dimensional layers and filmed like a macro product shoot. It suits premium product reveals, finance and
precision topics, and calm facts that should feel valuable.

## 2. Palette

The source's palette belonged to a real brand, so every hue here is re-picked in the same spirit *(all values
proposed)*.

| Role | Hex | Where |
|---|---|---|
| background | `#090d1f` | the navy-black base |
| surface | `#10162c` | cards and panels (matte navy metal) |
| surface2 | `#151c36` | raised rows, the top of a card's gradient, the mark's tile |
| surface3 | `#1d2546` | the highest surfaces, tracks, neutral pills |
| text | `#e3e7f2` | UI text |
| warm | `#f5f1e4` | strong headlines and big numbers |
| muted | `#7f89ad` | labels, captions, mono headers |
| faint | `#2a3358` | hairlines, inactive rings |
| accent (gold) | `#d6a03e` | the precious accent: the active state, the glint, the wordmark, the one key word |
| goldHighlight | `#f0d48e` | the specular highlight on gold |
| goldDepth | `#87601a` | shadowed gold |
| accent2 (steel) | `#7d97d8` | the second data colour in diagrams and charts only, never type |
| positive / negative | `#3ccf95` / `#f27878` | only for a truly positive or negative state |

- **Gold marks the one thing that matters in a frame** (a light path and its label count as one). Never decoration.

## 3. Typography

- **Faces:** Plus Jakarta Sans for all text (headlines 600, wordmark 700, UI 400–500); JetBrains Mono for numbers,
  values and tracked caps headers (Google Fonts, as the source names them).
- **Copy:** very little. At most 3–4 words per line; in vertical a headline may take two lines *(the source: one
  line)*. No marketing paragraphs.
- **Sizes** *(proposed)*: headlines fitted to the 888 px column, up to 96 px, tracking −0.025 em, leading 1.06;
  wordmark up to 120 px, 700, −0.035 em; hero numbers JetBrains Mono 600 at 220 px; body 30–34 px; labels 26 px; mono
  headers 26 px tracked +0.08 em in caps. Smallest 24 px.
- **Emphasis:** the key word turns gold. Type may occasionally scale very large and become the transition itself.

## 4. Layout

- **One shot = one idea**, with room to breathe; the UI is the hero.
- **Margins:** 96 px; left-aligned, except the title and end card which are centred *(proposed)*.
- **Safe zones:** 230 px top, 330 px bottom.
- **Dimensional surfaces:** cards tilted as if shot on a macro lens: perspective 2400 px, rotateX 9°, rotateY −9°
  *(proposed)*, settling slightly flatter as they land. Radius 28 *(proposed)*.
- Headline above, one surface below; never more than one surface in focus.

## 5. Elements

- **The mark:** a navy tile with a gold ring and dot, revealed by a gold glint (generic, the video's own; never a
  brand's).
- **UI surfaces:** matte navy gradients (surface2 → surface), a deep soft shadow, and a soft gold rim light along the
  top edge (gold at 35%, fading to the sides).
- **Pills:** gold with navy text for the active state; surface3 with warm text for neutral labels.
- **Numbers:** mono, counted up; the unit in gold.
- **Bars:** 8 px, radius 4, on a surface3 track; gold for the answer, steel for the comparison.
- **Checks:** a gold ring with a gold check.
- **Diagrams:** gold for the incoming light/signal, steel for what comes out, a warm-white ring for the object with a
  gold arc drawing round it.
- **Avoid:** scanner lasers, floating paper tornadoes, giant CTAs.

## 6. Motion

- **premium** (everything that enters): `cubic-bezier(0.16, 1, 0.3, 1)`, the source's reference curve, over 0.9 s
  *(duration proposed)*; words rise 26 px *(proposed)* with subtle stagger 0.06 s *(proposed)*.
- **settle** (checks, small landings): source "overshoot below about 2%"; taken as w = 12 rad/s, z = 0.8 → stiffness
  144, damping 19.2, mass 1 (overshoot 1.5%) *(w and z proposed)*.
- **draw** (lines, rings, bars): the premium curve over 1.2 s *(proposed)*. **count** (numbers): over 1.4 s.
- **glint:** a specular band sweeps across gold once, easeInOutCubic over 1.1 s *(proposed)*.
- **push:** the camera creeps 1.00 → 1.03 over a scene, linear *(proposed)*; never constant zooming.
- Anticipation and settling; motion continues across scenes with shared velocity; elements arrive at subtly
  different times. No linear movement except the slow push.
- Storyboard rhythm (from the source, 14–15 s): the first premium frame within 1.5 s, the first product moment by
  about 2 s; chaos → control → clarity → brand; the rhythm slows before the payoff.

## 7. Transitions and rhythm

- **Object-driven:** a chart line becomes a document edge, a gold pill becomes a button, a number becomes an amount, a
  card edge becomes the next surface, the camera pushes through an element, masks use the UI's own shapes.
- **Direct cuts** only for a deliberate rhythmic impact.
- **Tempo:** about 115–120 BPM (118 *(proposed)*).
- **Sound:** a low soft impact on the major reveal, restrained clicks, a metallic or glass tick, low movement under
  camera moves, a resolved tone on the wordmark. No trailer booms, EDM risers or whooshes everywhere.

## 8. Finish

All "extremely subtle":
- soft gold rim light on surfaces (35%);
- dark navy falloff (a lighter centre, vignette 0.45 *(proposed)*);
- faint ambient gold bloom behind the mark and the number (18% *(proposed)*);
- a soft specular sweep across gold;
- grain 0.015, only because it helps the gradients *(proposed)*.
- **The UI stays crisp:** no blur on the product, no glossy reflections.

## 9. 3D look

None: depth comes from perspective tilt, soft parallax, foreground/background separation and controlled depth of
field.

## 10. Banned

- Cyberpunk, crypto, neon, gaming looks.
- Generic AI purple; rainbow gradients.
- Particle spam; glassmorphism.
- Excessive blur, or blur on the UI.
- Spinning 3D cards; constant zoom.
- Many animation styles in one video.
- Bouncing UI (overshoot stays below 2%).
- Marketing paragraphs.
- Crossfades, random wipes, spin transitions, glitch, whip-pans, the SaaS slide-left, zoom-blur.
- Gold spread over several unrelated things in a frame.

## 11. Where it came from

- **A creator's product-film prompt on prompt-motion.com** (https://prompt-motion.com/daniel-haida-8691d4, built in
  Remotion), read through `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Dark Navy & Gold Precision
  Film"; the run's contact sheet was looked at. **Licence: none stated; the prompt belongs to its creator.** Nothing
  was copied: the look's rules are described here in our own words.
- **Taken (as rules):** navy-black + one warm gold accent + positive/negative only when meaningful; Plus Jakarta Sans
  and JetBrains Mono; 3–4 words per line; type as a designed object; one idea per shot; the UI rebuilt as dimensional
  layers; the reference curve `cubic-bezier(0.16, 1, 0.3, 1)` with overshoot below 2%; overlap and subtle stagger; the
  macro-shoot camera; object-driven transitions; 115–120 BPM; the sound palette; the subtle finishes; the bans.
- **Re-picked:** the source's palette is a real company's brand, so every hex here is new (navy, gold, highlight,
  depth, text, muted). No marks, wordmarks, app UI or words from the source are used; the mark is generic.
- **Proposed:** all px sizes, tilt values, radius, durations, the settle spring, the push, finish strengths, the steel
  second data colour.
- **Changed for vertical:** the source is a 16:9 master and asks for vertical to be recomposed, not cropped: here a
  headline sits above a single tilted surface, and headlines may take two lines of ≤ 4 words.
- Added to the catalog on 2026-10-31.
