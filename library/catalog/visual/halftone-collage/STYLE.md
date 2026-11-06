---
name: style-halftone-collage
description: Visual style "Halftone Collage": editorial stop-motion paper collage. Black-and-white halftone cut-outs (dot screens drawn in SVG, on newsprint with a cream keyline and a soft shadow) and a few coloured cardstock pieces slide in on twos and lock together on a flat saturated paper field whose colour carries the line's meaning; words appear only as printed newsprint or cardstock strips; between beats the camera falls through the layers in an endless zoom. Use when a video is made in this style.
---

# Halftone Collage

## 1. In one line

A cut-and-paste editorial page coming together by hand: newspaper photos in coarse dots, a few bright cardstock
pieces, all landing with stop-motion snaps on a flat coloured sheet. It suits B-roll under a voice-over (one
metaphor per line), essays and idea explainers, history and nostalgia pieces, and music loops.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (field red) | `#a62f23` | the default field: time being spent, labour, urgency |
| fieldMustard | `#dba719` | field: tools, warnings, lost experience |
| fieldTeal | `#0d7169` | field: judgement, collaboration, automation |
| fieldPurple | `#554767` | field: norms, things settling into memory |
| fieldGreen | `#1f4a3a` | field: cognition, taste, a reset *(proposed hex)* |
| fieldOrange | `#c4551f` | field: burnt orange, time and urgency *(proposed hex)* |
| surface (newsprint) | `#ede6d6` | the paper of every halftone cut-out and word strip *(proposed)* |
| text (ink) | `#1a1714` | halftone dots and printed type *(proposed)* |
| keyline (cream) | `#f3e9d2` | the thin warm-cream keyline around every piece *(proposed hex)* |
| muted / faint | `#6b6358` / `#cfc6b4` | grey ink, paper fibre *(proposed)* |
| accent (cyan card) | `#3aa6c8` | cardstock for the line's key item (here: blue light) |
| accent2 (yellow card) | `#e9b92f` | cardstock for a second key item (here: the sun) |
| cardRed / cardOrange / cardPurple / cardCream | `#c8372d` / `#e07a2e` / `#6d5a9c` / `#f1e6cc` | other cardstock |

- **The field carries the meaning of the line** (the source's colour-by-meaning table, above). A batch keeps one
  design language but changes the field from line to line. Cobalt blue is never the default field.
- **Subjects are black-and-white halftone.** Cardstock colour only where it serves the information: the key item,
  a connector, a bar. Not colour for colour's sake.
- Pick cardstock that stands off the field (no yellow on mustard, no cyan on teal).

## 3. Typography

- **The source has no type at all** (it is B-roll under a voice-over). This catalog version adds one deliberate
  exception: **words only as printed strips**, cut from newsprint (or cardstock for the key word), pasted like any
  other piece. Never subtitles, never the whole voice-over line, never type floating on the field.
- **Face:** Libre Franklin (a Franklin Gothic revival, the newspaper headline grotesque) *(proposed)*.
  - Headline strips 800, 80 px, caps, tracking −0.01 em; a hero strip 120–150 px (the emphasised word, on cyan
    cardstock); numbers 900 at 280 px.
  - Label strips 600, 30 px, caps, tracking 0.04 em.
  - Strip padding: 0.14 em top and bottom, 0.32 em at the sides; scissor-cut edges; tilted −3° to +3°.
- **Smallest text:** 28 px. **Words:** at most about 6 on screen; one to three strips a frame.

## 4. Layout

- **A locked poster frame:** the camera doesn't move while a collage assembles.
- **The subject** sits in the middle 70% of the frame, with generous clean field around it.
- **3–6 large, separable pieces** per frame (so each can be animated in), never a screen of fragments.
- **One visual metaphor per line,** with 3–6 key objects (the source suggests machines, clocks, film strips, filing
  cabinets, consoles, rule books, funnels, tracks, chess pieces) and one action (open, connect, leak, bind, file,
  light up, compress, branch, assemble).
- **Margins:** 96 px; **safe zone:** 230 px top, 330 px bottom for strips; cut-outs may bleed off the frame edge.

## 5. Elements

- **Halftone cut-out:** a silhouette (spheres, clouds, an eye, a molecule; in a video also hands, people, machines)
  filled with newsprint and printed with a dot screen: dots on a 14 px pitch at 45°, each dot's area following the
  tone (radius = ½ pitch × √tone × 1.12; tones under 3% print nothing), a little photographic noise in the tone. Then
  a 7 px cream keyline outside the silhouette and a soft shadow (6 px right, 12 px down, 9 px blur, 32%).
- **Cardstock pieces:** flat colour, the same shadow, a thinner keyline (4 px): beams, shards, bars, discs.
- **Printed strips:** newsprint or cardstock, ink type, cream keyline, shadow, scissor-cut ends.
- **Cardstock over halftone:** a key item may be cardstock printed over with a lighter dot screen (the sun: yellow
  card with ink dots at 55%).
- **Field:** flat colour with a faint paper fibre (10%, multiplied).
- **Depth layers** (the zoom): cut-outs at three depths, Z = 0.45, 0.8 and 1.22.
- **No drawn images of real people, logos, signs or UI;** in a video, real photographs may be halftoned and cut out
  (public-domain or the user's own), credited.

## 6. Motion

- **On twos:** every cut-out moves 12 times a second (each pose held two frames at 24 fps), like stop-motion.
- **slide → snap:** a piece slides in from off the frame along a straight line and snaps into place with a slight
  overshoot (`[0.22, 1.18, 0.45, 1]`, 0.5 s), turning 8° into its resting angle *(proposed)*. Then it holds dead still.
- **Assemble from empty:** the first frame is the empty field; pieces arrive in order: **structure → subject or
  cards → connectors → the action → the result**, then the finished composition holds. Groups 0.25 s apart, pieces
  inside a group 0.08 s apart *(proposed)*.
- **No fades,** no gentle drift or wobble, no slow zoom while assembling, no morphing, no objects appearing from
  nothing: everything enters by sliding in.
- **The endless zoom** (between lines, or as a loop): the camera falls into the collage at constant speed in log
  space (camera = e^(0.35 t) *(proposed rate)*); each layer scales by camera^Z (Z 0.45 far, 0.8 middle, 1.22 near), so
  near pieces rush past and far ones open up. The cut-outs keep moving on twos inside it.
- **Holds:** the finished collage holds at least 1.5 s.

## 7. Transitions and rhythm

- **One shot per line, no cuts inside it,** 3–10 s (5 s by default).
- **Between lines:** zoom through a piece into the next field (the endless zoom), or cut to the next empty field and
  assemble again. The field colour changes on the cut, never inside a shot.
- **A batch** of lines forms a small story (e.g. the problem first, then the rule, then the result).
- **As a loop:** 20 s of continuous zoom, 8 bars at 96 BPM, seamless.

## 8. Finish

- Paper fibre on the field (10%), film grain 0.03, a faint print flicker (±2.5% brightness on twos), vignette 0.25.
- Halftone dots and soft paper shadows. No glossy 3D, no photoreal environments, no glow.

## 9. 3D look

None (2.5D layers; "glossy 3D" is banned).

## 10. Banned

- Type anywhere but on a printed strip; subtitles; the voice-over line written out.
- Logos, watermarks, UI, readable signage inside cut-outs.
- Fades, slight drift or shake, slow zooms while assembling, morphing, objects appearing from nothing.
- Glossy 3D, photoreal environments, gradients on the field.
- Colour for colour's sake; colour on the halftone subjects.
- Cobalt blue as a field; a field that changes inside a shot.
- A screen full of fragments (keep 3–6 large pieces).
- Camera moves while pieces assemble.
- AI-generated or downloaded images standing in for the cut-outs in this catalog version.

## 11. Where it came from

- **gbro-collage-broll** (`pyang5166/gbro-collage-broll`: `SKILL.md`, `README.md`, `agents/openai.yaml`,
  `evals/evals.json`, `scripts/generate_video.py`), researched in `docs/research/styles/five-skills.md`, section
  "Halftone Paper-Collage B-roll". Licence: MIT (© 2026 狗哥笔记).
  - Taken: the look (black-and-white halftone photo cut-outs, a few coloured cardstock pieces, crisp machine-cut edges,
    a thin warm-cream keyline, a soft low-opacity shadow, fine uncoated-paper fibre on a flat saturated field); the
    field colours measured from its demo GIFs (`#A62F23`, `#DBA719`, `#0D7169`, `#554767`, approximate) and its
    colour-by-meaning table; the layout (locked 9:16 poster frame, subject in the middle 70%, 3–6 large pieces, one
    metaphor per line, the metaphor vocabulary); "assemble from empty" in the order structure → subjects → connectors
    → action → result; crisp stop-motion timing; the bans (type, letters, numerals, logos, UI, subtitles, glossy 3D,
    photoreal, clutter, fades, drift, slow zoom, cuts inside the clip).
  - **Changed:** the source makes everything with AI image and video models. Here the cut-outs are drawn: halftone dot
    screens computed in SVG from tone functions (spheres, clouds, an eye, a molecule), paper and cardstock shapes, and
    edges in SVG/CSS, so nothing is generated and `needs` stays false. The source leaves timing to the video model;
    the timings here are *(proposed)*.
  - **Changed:** the source bans all type. The catalog's samples need words, so words are allowed only as printed
    paper strips, pasted like any other piece.
- **"Halftone Collage Zoom"** (entry #77 of `X-RayLuan/awesome-opus-5-5-video-prompts`, by @koldo2k), researched in
  `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Halftone Collage Zoom". Licence: the creator keeps all
  rights, so only the look's rules are described here and nothing is copied.
  - Taken (as rules): the endless constant-speed exponential zoom; depth layers scaled by camera^Z with Z from 0.45
    to 1.22; cut-outs animated on twos; white-bordered halftone cut-outs with soft shadows; film grain, vignette and
    flicker; a 20 s loop of 8 bars at 96 BPM.
  - Not taken: its subjects (a man and a whale), the green-screen keying, the generative stack.
- **Merged:** the two sources describe one look (halftone paper collage), so they make one style: the gbro rules for
  each assembled shot, the zoom between shots.
- *(Proposed):* the paper, ink, keyline, green and orange field hexes and the cardstock hexes; dot pitch, angle and
  gain; keyline and shadow values; the type (Libre Franklin strips); the slide-snap curve, group and piece gaps, zoom
  rate; flicker, fibre, grain and vignette amounts; the sample scenes.
- Added to the catalog on 2026-10-31.
