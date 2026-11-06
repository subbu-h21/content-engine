---
name: style-iso-picture-book
description: Visual style "Isometric Picture Book": a calm full-bleed true-isometric place in flat three-tone paper colours; small faceless people seen from behind obey a rule in order, flat marks and arrows lead the way, serif words land on the floor one character at a time from a pale ghost to ink, one persimmon accent only where the rule is, a pale caption bar. No outlines, shadows, gradients or cards. Use when a video is made in this style.
---

# Isometric Picture Book

## 1. In one line

A quiet place seen from high up: small people from behind do things in the right order, and words are painted on the
floor as they matter. It suits everyday rules and manners, process orders, "two ways compared" and gentle science.

## 2. Palette

A warm paper neutral, one dark ink, one accent only where the rule is (many frames carry none), one subject hue, one
marking colour. Shade toward warm umber and paper, never grey or violet.

| Role | Hex | Where |
|---|---|---|
| background (paper) | `#f1e8d8` | every ground |
| surface (paper light) | `#faf4e8` | lid undersides, the caption bar |
| concrete / joint | `#eae2d3` / `#ddd3c1` | plinths / slab joint lines |
| text (ink) | `#2a2e29` | floor type, dark marks |
| muted (soft ink) | `#7a7468` | secondary marks, bench legs, the molecule |
| faint (ghost) | `#d6ccba` | the pale ghost a floor character fades from |
| accent (persimmon) / tint | `#d0573a` / `#edbfa9` | the rule: key character, "stand here" outlines, the winning number / the shorter floor bar |
| accent2 (subject hue) | `#3f6f9a` `#6f9bbd` `#abc7d9` | the place's own hue, here blue light and seats *(proposed; the source's demo place is green `#3d6b59`)* |
| marking ginger | `#e2ae3a` | lead-in lines, sunlight |
| people's tops | `#b9824f` `#7f98ae` `#8c8199` `#d3c29e` | an even four-colour weave |
| people's legs | `#3e4450` `#59534a` `#3a3d42` `#4b4f5a` | trousers |
| hair / skin / shoes | `#2a2624` / `#d9a882` / `#232524` | figures |
| sage | `#6e9886` | the sixth lane of the spectrum |
| bar text | `#4a4a42` | the caption line |
| tone targets | `#fff8ea` (22%), `#5b4434` (20%) | top faces lift, +x faces drop |

## 3. Typography

- **Newsreader** (Google Fonts, OFL), the source's Latin face: 700 for keywords, 500 for small lines.
- **Floor type** lies on the ground reading up-right, at about 1.6 m (150 px) big and 0.9 m (84 px) small at 90 px a
  metre; a painted title or number may reach 240 px.
- **One phrase per beat,** one accent character or number per phrase, never a thin single stroke.
- **The floor carries only the line's key word or number,** never the sentence; a title may run to one short phrase. At
  most three numbers to remember, each with what it compares to, held ≥ 2.5 s.
- **A × on the floor** is two painted strokes along the world axes; typed, it would read as a +.
- **Caption bar:** Newsreader 400 at 44 px, `#4a4a42`, one cue at a time, a hard switch. **Smallest text:** 36 px.
- **World signs** face the camera side at the iso angle, never a flat card facing the lens.

## 4. Layout

- **One real place, full bleed:** the ground runs off every frame edge. No board, frame line or vignette.
- **True isometric,** axes at 30°, 90 px a metre: sx = (x − y)·cos30°·k, sy = ((x + y)·½ − z)·k; x runs down-right, y
  down-left. Painter's sort by floor footprint.
- **Type on clear ground,** nothing raised in front of it, at least 5% from every edge and clear of the bar.
- **Large calm areas** around the type; people in tidy lines and rows; few props; one place, one action, one phrase per
  beat. Queues keep about 0.75 m between feet.
- **Routes** run along the world axes with few right-angle turns; walkers head up-left, up-right or across.
- **Safe zones:** 230 px top, 330 px bottom; the bar is centred at y = 1500.

## 5. Elements

- **Solids:** flat three tones per colour (top lifted, +y base, +x dropped); curved bodies are faceted into the same
  tones. No outlines, shadows, textures or highlight spots.
- **The ground** carries only functional markings: lanes, arrows, "stand here" outlines, stop bars, slab joints (2 m).
- **People:** billboards anchored at the feet, 1.7 m tall, a round dark head with a sliver of skin at the ear, a two-tone
  torso, separate trouser legs, dark shoes; no faces, no hands. **Seated:** shoulders and the back of the head over a
  low seat back.
- **Diagram marks:** accent outlines, flat arrows that grow ahead of walkers and branch, floor bars in true proportion
  with a dashed bracket for the difference.
- **Cut-aways:** the near wall cut low, lids hinged on the far edge with paper undersides.

## 6. Motion

- 30 fps on ones. Everything eases, nothing pops. A beat = one floor phrase + one diagram mark + one action.
- **char:** floor characters land 0.14 s apart, fading and scaling 1.22 → 1 (cubic-out 0.34 s) while the colour goes
  from ghost to ink (0.1–0.48 s after the start).
- **walk:** about 1.5 m/s, legs scissoring; nobody over 3 m/s on screen, even in time-lapse.
- **People move only when the rule says,** in order. **Lanes and arrows** grow over 0.9 s (cubic-in-out), ahead of the
  people.
- **Bars:** held still 2.5 s, then the dashed bracket marks the difference.
- **Camera:** the iso angle never changes; translation and zoom only. A slow drift or push of 6–8%; follow the head of a
  line; travel along the ground at the subject's pace; locked frame.

## 7. Transitions and rhythm

- A continuous move, a lid opening, a run back along the same path, or a cut on the beat at the same angle. No page
  turns, wipes, black or blank frames.
- One shot per narration line, each line starting as its action starts.

## 8. Finish

Flat: no lighting, gradients, shadows, glints, textures, vignette or frame line. No grain.

## 9. 3D look

none (isometric solids drawn in 2D with three flat tones)

## 10. Banned

- A floating board, dot lattice, sans-serif pins, icon stats or inset bubbles; lighting, faceted terrain, shadows or glow;
  expressions or gags; headers, centred titles or cards.
- Faces or hands; people walking toward the camera; people passing through seats, walls or each other.
- Outlines, shadows, textures or highlight spots on solids; shading toward grey or violet; gradients.
- Zigzag paths or serpentine crowds; high seat backs hiding seated people.
- The accent as decoration; an accent trail across the whole film.
- Page turns, wipes, black frames; type behind raised objects; flat sign cards facing the lens; a sentence on the floor.
- Copying any reference explainer's characters, layouts, typefaces or music.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 74 "Isometric Picture Book"
  (`styles/isometric-picture-book/`, extra values from `demo/kit.js`); demo film and stills CC BY 4.0 (LemoLab). Read
  through the research notes `docs/research/styles/five-skills.md`, section "Isometric Picture Book". The source draws on
  a 2D canvas; this is rebuilt as SVG in Remotion. No code was copied.
- **Taken:** every palette value but the subject hue; the tone targets; Newsreader for Latin; floor type and its landing
  (0.14 s, 1.22 → 1, ghost to ink); the floor-word rules; full bleed, painter's sort, people, seated people, markings,
  outlines, arrows, floor bars and the bracket; walk speeds; the camera rules; transitions; flat finish; the banned list.
- **Proposed:** the blue subject hue for this topic; the 90 px a metre scale; a Latin-only type scale (the source sets
  Chinese first); bench and planter props; the sample scenes (six people on six lanes for "at once", the molecule on a
  plinth, people in outlines); a character's landing scale drawn through its font size.
- **Changed for vertical:** the source's Chinese-over-English bar became one Latin line at 44 px at y = 1500; the scale
  rose so people read at phone size; fewer props fit, so each shot uses one place, one route and one phrase.
- Added to the catalog on 2026-11-06.
