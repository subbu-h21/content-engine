---
name: style-black-glass-studio
description: Visual style "Black Glass Studio": a 3D film (Blender + Cycles) of floating slabs of black glossy glass whose screens glow like a generic editor app; an invented toy hero hops across them and every press visibly builds a glowing title card, then the panels power down and fall away, leaving the card as the poster. Previews approximate it in CSS 3D. Use when a video is made in this style.
---

# Black Glass Studio

## 1. In one line

A toy-like hero hops across floating slabs of black glossy glass whose screens glow like a real app, and every press
visibly builds a glowing title card; then the panels power down and fall away. Playful, premium and literal. It suits
product and tool demos, "how this app works" stories, launch teasers, hero-led shorts and process explainers with UI.
**Needs 3D** (Blender + Cycles); no footage.

## 2. Palette

The source gives no hex values ("black glossy glass", "screens glow", a brand-coloured hero); everything here is
*(proposed)* in its spirit.

| Role | Hex | Where |
|---|---|---|
| background (set) | `#06070a` | the void the panels float in, with a faint cool light behind them |
| surface (glass) | `#0c0e13` | black glossy glass: slab faces |
| glassEdge | `#1b202b` | bevelled slab edges; the top edge catches more light |
| screen | `#0b1420` | the screen under the glass |
| text | `#eef3fb` | UI labels and the title card's type |
| muted | `#7f8aa0` | secondary UI labels, inactive tools |
| faint | `#1c2533` | UI hairlines, lanes, inactive bars |
| accent2 (screen light) | `#4fc8ff` | active buttons, keyframes, the playhead, wires, selections: the screens' glow |
| accent (hero) | `#ffb627` | the hero toy, and the glow of what it builds (the card's key word, spark rays) |
| heroShade | `#c7780f` | the hero's shadow side and feet |

Two light colours only: screen light (cool) for the app, hero colour (warm) for the hero and its result.

## 3. Typography

- **Sora 700/800** *(proposed)*: the title card the hero builds. Sentence case, tracking −0.02 em. 64–150 px; the key
  word 800 in the hero colour with a glow; numbers up to 260 px.
- **Geist 400/500/600** *(proposed)*: the generic app's UI. 26–34 px (bigger than a desktop app: the source says
  vertical needs bigger type).
- **Geist Mono 500** *(proposed)*: timecodes, panel titles, counters. 24–26 px.
- **The smallest text** is 24 px; everything is checked readable at phone size (a source review rule).
- **Emphasis:** the hero colour, a glow and spark rays on the card's key word.
- **Words on screen:** the card holds up to ~8 words; UI labels are short and real-sounding ("Type", "Rectangle",
  "Pen", "Glow", "timeline", "layers").

## 4. Layout

- **Vertical is its own composition** (the source: bigger type, fewer elements, never a crop of the 16:9 film).
- **Stack:** the title card (comp) slab upright in the top half; the panel the hero works on below it, tilted back
  like a floor (about 30° plus the camera's 10°, so its UI stays readable); at most one more slab, far and out of focus.
- **Camera:** a 3/4 view (rotateX 10°, rotateY −14° here; in Blender a 50 mm lens at the hero's height).
- **Margins:** 90 px; slabs up to 940 px wide. Safe zone 230 px top, 330 px bottom: the card's type stays inside it.
- **Hero size:** 120–150 px tall on screen, standing on the button or element it acts on.
- **The last frame is a poster:** the finished card alone, centred.

## 5. Elements

- **Glass slabs:** black glossy glass, about 38 px thick, square-edged with a slight bevel; a screen inset 22 px under
  the glass with a glow that spills onto it; a glossy diagonal sheen; a thin bright rim on the top edge.
- **The app (generic, no names):** a header strip (three dots, a mono title), tool buttons (Type, Rectangle, Pen,
  Glow), a timeline with layers named after the video's words, keyframe diamonds and a playhead, a node canvas with
  glowing wires, level meters, checklists. Name every panel and its state, so it reads as a real app, but invent it.
- **The hero:** an invented toy: a glossy rounded block on two stubby feet with a small nub on top, no face. Hero
  colour with a soft specular highlight and a contact shadow.
- **The title card (comp):** what the hero builds: Sora lines, the key word in the hero colour with glow and spark
  rays; each press adds a visible piece (text, a shape, a stroke, the glow).
- **Depth of field:** slabs away from the hero are soft (5 px in the previews).
- **No real logos, apps, mascots or faces.**

## 6. Motion

The source gives no motion numbers ("a jump too high is fixed by one number"); every value here is *(proposed)*,
built on its 120 BPM beat (0.5 s).

- **pop** (into 3D): spring 12 / 180 / 0.8.
- **hop:** one beat (0.5 s) on a parabola 150 px high (ease-in-out), stretching to 1.1 in the air and squashing to 0.84
  on landing, recovering over 0.2 s. Feet land on the button exactly on the beat.
- **press:** the button sinks 6 px and flashes screen light, expo-out 0.15 s; the comp changes on the same frame.
- **stamp** (keyframe): the diamond scales 1.6 → 1, expo-out 0.18 s.
- **build:** each new piece of the card comes in expo-out over 0.35 s.
- **ride:** the hero rides the playhead across one bar (2 s, linear) while the card plays back its animation.
- **power-down:** a screen dims to off over 0.3 s (ease-in), with a flicker.
- **fall:** panels drop under 2400 px/s² of gravity, tumbling 25°/s, out of frame.
- **peel:** the hero peels off a screen like a sticker, 0.4 s, then pops into 3D.
- **Camera:** wide to start, follows each hop at the hero's height with shallow focus (ease-in-out 0.5 s moves), ends
  on the comp alone.

## 7. Transitions and rhythm

- **One continuous shot,** no cuts: the camera moves between panels.
- **12 s at 120 BPM** (24 beats, 360 frames at 30 fps) in the source: peel off → pop into 3D → hop on buttons (each
  press changes the card) → four keyframes → ride the playhead → Play → every panel powers down and falls → only the
  card remains.
- **Every press changes something visible;** every beat has an action.
- **Sound:** fully synthesised; a 120 BPM beat that drops on the pop; glass knocks, a sticker peel, a keycap click per
  button, a ding per keyframe, a power-down per falling panel; quiet before the pop, loud from the drop, softer on the
  fade (loudness checked every 0.5 s); a high-frequency roll-off and a −1 dBTP ceiling.

## 8. Finish

- **Vignette:** ffmpeg `vignette=angle=PI/6` on the final encode (≈ 0.45 in the previews).
- **Grain:** none in the source beyond render noise; 0.02 in the previews *(proposed)*.
- **Glow:** screens glow onto the glass (0.35); the card's key word glows in the hero colour.
- **No white light blocks** on the glass.
- **Encode:** libx264 high profile, CRF 17, yuv420p, AAC 320k, `+faststart` (about 10 MB for 12 s).

## 9. 3D look

The real style is a Blender + Cycles film. Recipe (source values first, then *(proposed)* ones):

- **Engine:** Cycles on the GPU; pass the GPU setup script on every render (the GPU choice is a Blender preference,
  not saved in the .blend). Review stills at half size and 40 samples; final 256 samples with OpenImageDenoise
  *(proposed)*.
- **Colour:** AgX view transform with **exposure −0.4** (AgX lightens colours: at exposure 0 the hero read pink
  instead of its brand colour). Darken the hero's base colour too, then measure a rendered pixel against the hex.
- **Lights:** a large soft area key from top-left and a rim light from behind *(proposed)*, all **hidden from glossy
  rays** (object visibility → glossy off) so the glass shows no white blocks.
- **Glass slabs:** bevelled boxes (bevel 0.02 m *(proposed)*); Principled BSDF base `#0c0e13`, roughness 0.08, coat
  1.0 with coat roughness 0.03 *(proposed)*. The screen is an emissive plane just under the glass surface, carrying the
  app image (emission 2–4 *(proposed)*).
- **The app image:** one 3840 × 2160 render of an HTML page (Puppeteer) mapped onto the panels; the comp is an HTML
  canvas rendered once per frame and mapped onto its slab.
- **Hero:** a simple toy shape; Principled base in the hero colour (darkened for AgX), roughness 0.25, coat 0.5
  *(proposed)*.
- **World:** near-black with a faint cool gradient *(proposed)*.
- **Camera:** 50 mm *(proposed)*, shallow depth of field focused on the hero (f/2 *(proposed)*), wide to start, following
  each hop at the hero's height, ending on the comp alone.
- **One timeline file** holds every button position (in pixels of the app image) and every event time; the app image,
  the comp, the 3D scene and the sound all read it, so a foot lands on a button the moment it clicks.
- **Gotchas:** call `view_layer.update()` before parenting (children snap to the parent's origin otherwise); render in
  resumable chunks; scan every frame's brightness and re-render only blank or broken ones.
- **Vertical:** a separate 1080×1920 composition with bigger type and fewer panels.

## 10. Banned

- Real logos, real app names, a real mascot or faces.
- A press that changes nothing visible.
- White light blocks reflected on the glass.
- Cropping a 16:9 film for vertical.
- A washed-out hero colour (fix exposure and base colour, then measure).
- Vague fixes: every change is a number.
- AI video models or hand-keyed animation.

## 11. Where it came from

- **Claude + Blender: Make 3D Motion Graphics From Code** (guide, 7 pp, credited to its author and community on the
  cover), `D:\code_files\resources to make content engine\pdf guides\`: look, format and camera (p. 3), pieces (p. 2),
  review checklist (p. 4), fix rounds (p. 5), sound and encode (p. 6), troubleshooting (p. 7). The prompt itself is
  not in the PDF (it points to a creator's free prompt pack on X). Research notes: `docs/research/styles/local-guides.md`,
  "Claude + Blender — Black Glass Studio". Licence: none stated; the look is described in our own words.
- **Not used:** the film's hero is a company's mascot and its app a look-alike of a real editor; this style replaces
  both with an invented toy and a generic app.
- **Taken:** the concept, the beat structure, 120 BPM / 12 s / 30 fps, AgX exposure −0.4, lights hidden from glossy
  rays, shallow focus, the one-timeline pipeline, the review and fix rules, sound design, encode settings, the
  vertical rule.
- **Proposed:** every colour, font, size and motion value, the material numbers, lens and lights, the hero's shape.
- **For vertical:** the source is 1920×1080. Here the panels stack vertically (card on top, the working panel tilted
  below), with bigger type and at most three slabs. The previews are CSS 3D approximations, not renders.
- Added to the catalog on 2026-10-31.
