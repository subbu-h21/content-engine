---
name: style-text-in-space
description: Visual style "Text in Space": bold lowercase Poppins words placed inside a talking-head shot, behind the speaker's head, on arcs, orbiting as a ring, racking in and out of focus; white plus one brand red; four layers (plate, back words, cutout, front words) with a slow push-in. Needs the speaker's footage and a cutout. Use when a video is made in this style.
---

# Text in Space

## 1. In one line

Words live in the room with the speaker: they tuck behind the head, bend on arcs, orbit as a halo and blur out when
focus moves, every word on its spoken frame. It suits talking-head shorts, creator explainers, "how I made this"
reels and tool hype. **Needs real footage** of a person and a per-frame cutout (matte) plus a head track. It cuts
together with the footage-free cards of `red-card-kinetic`.

## 2. Palette

The look is two colours over the footage: white and one brand red.

| Role | Hex | Where |
|---|---|---|
| text (white) | `#f4f4f4` | main and connecting words, the ring, arc words, diagram strokes |
| accent (brand red) | `#b51722` | emphasis: the big word behind the head, slams in front of the body, Six Caps key words |
| accent2 (slam shadow) | `#5e0006` | the hard offset shadow under slam words, nowhere else |
| muted (grey) | `#7d7d7d` | the 9 px sticker outline; small grey words |
| background | `#141416` | the plate stand-in in previews only; in a video the plate is the footage *(proposed)* |
| surface | `#2c2c31` | the stand-in's lit centre *(proposed)* |
| faint | `#5c5c63` | the flat grey silhouette standing in for the speaker in previews *(proposed)* |

Soft shadow under light words: black at 28%.

## 3. Typography

- **Words:** Poppins Black 900, **lowercase**, tracking −0.05 em, leading 0.85 (stacked words nearly touch). Soft
  shadow `0 0.03em 0.09em` black 28%.
- **Key words:** Six Caps uppercase, +0.02 em, thickened with an 8 px same-colour outline, usually red, in front of
  the body ("AGAIN.").
- **Sizes at 1080×1920** *(proposed: the source gives ratios, not px)*:
  - connecting words 96 px, main words 170 px, the word behind the head up to 300 px, numbers up to 330 px;
  - arcs 78–110 px; ring letters 100 px; small labels and sticker words 64 px;
  - Six Caps key words up to 420 px;
  - emphasis words are 2–3× the connecting words (source ratio). The smallest text is 48 px: footage is busy.
- **Emphasis:** red and bigger. Connecting words are small and white.
- **Words on screen:** every spoken word appears; a phrase builds 2–5 words around the speaker, then clears at the cut.

## 4. Layout

- **The shot:** a locked-off tripod shot, plain evenly lit background, the speaker lower-middle (head around
  y = 700–980), empty space above and to the sides. Words fill that space.
- **Four layers, bottom to top:** plate → words behind → speaker cutout → words in front.
- **Behind the head:** the biggest word of a beat sits at head height behind the cutout; the head hides only its
  lower edge, so it stays readable.
- **In front:** slams and Six Caps key words sit in front of the chest and legs, never over the face or hands.
  Red words over the body carry the 9 px grey sticker outline (as well as their shadow) so they hold against clothing.
- **Arcs:** a letter at distance x along the baseline gets angle θ = x / R, position (R sin θ, ±R(1 − cos θ)) and
  rotation θ. R > 0 bends like a rainbow above the head; R < 0 like a smile across the body. Radii 700–900 px.
- **Ring:** centred on the tracked head (a little above its centre), radius 285 px (source: 260–285), tilted 24°.
- **Margins:** 72 px *(proposed)*; leave 100 px at the sides for the push-in. Safe zone 230 px top, 330 px bottom.
- **Fullness:** dense: 3–5 word groups around the speaker, each in its own zone (above, around the head, in front).

## 5. Elements

- **Ring / halo:** letters on a circle (rotateY(a) translateZ(r)), the ring tilted 24°, turning 4–5° a frame. Letters
  facing the camera (cos a ≥ 0) are drawn on the front stage; the far half goes behind the cutout and reads mirrored.
- **Arc words:** whole phrases on one arc (textPath), white with a red word inside when emphasised.
- **Sticker words:** small words with a 9 px grey outline behind the fill, popped in letter by letter.
- **Slam words:** red or white with the hard `#5e0006` shadow at 4.5% of the size.
- **Drawn objects:** only thick white strokes and discs (beams, a molecule with rays), floating at a depth.
- **Footage treatment:** untouched; digital punch-ins up to 1.6×; the slow push-in (section 6).
- **Not built in the source but allowed:** a counter counting up on an arc behind the head; a draw-on face box with
  corner handles; a word clipped inside the head matte with a difference blend.

## 6. Motion

Every entrance starts on the spoken word's frame: frame = round(whisper start × 30). Springs are Remotion `spring()`
damping / stiffness / mass at 30 fps (the same vocabulary as `red-card-kinetic`).

- **swing:** spring 13 / 140 / 0.7; rotateY ±80°, rotateZ ±18°, z 700 → 0, x 380 → 0; +0.2 em letter-spacing
  mid-flight. Huge red words swinging in behind the head.
- **pop:** spring 10 / 230 / 0.6 per letter, 1 frame apart in a random order, 0.35 em jitter settling in 9 frames.
- **stretch:** scaleX 0.15 → 1, spring 8 / 150 / 0.8 (Six Caps).
- **slam:** scale 0 → 1, spring 9 / 190 / 0.8, hard shadow.
- **slide** (arc slide-in): ease-out-expo 6 frames, 280 px, ±18° tilt, opacity over 3 frames.
- **fade:** 4 frames, scale 1.08 → 1. **drop:** 320 px, ease-out-cubic, 4 frames.
- **ring:** 4.5° a frame (135°/s); letters appear 0.15–0.45 frame apart (0.01 s here), each fading in over 2 frames
  *(proposed)*.
- **rack focus:** 0 → 9 px blur over about 10 frames (ease-in-out-cubic *(proposed)*) when focus moves to the face or
  to the next word; near words blur out. Blur secondary words (connecting words, nearer layers), never the line that carries the beat.
- **push-in:** the whole shot scales 1.0 → 1.16 over the shot (linear *(proposed)*). Text stages use perspective
  1600 px and move by dz = P(1 − 1/k), so depth-0 words stay glued to the footage and nearer words grow faster.
- **Exits:** none per word; groups clear at the cut; near words blur out.
- **Holds:** 0.5 s after the last word *(proposed)*.

## 7. Transitions and rhythm

- **Hard cuts** every 2–4 s; the speaker's jump cuts are reused as shot boundaries so they hide.
- **Shot pattern:** wide with push-in → red card (from `red-card-kinetic`) → medium punch-in → ring shot → ink wipe
  → close punch-in.
- **Liquid-ink wipe** into red cards on punchlines (radius to 3000 px in 8–10 frames from the top-right, 4 droplets).
- **Rhythm:** one word per spoken word; a gesture can pull a word one frame late on purpose.
- **Sound:** whoosh (pink noise 250 Hz–2.8 kHz, 0.7 s) on transitions, thump (58 Hz + click) on slams, swish on
  swings; 25–50% under the voice.

## 8. Finish

- No grain, vignette, bloom or grade: the footage stays as shot.
- Depth comes only from rack focus (0–9 px) and parallax.
- Soft shadow under words; hard shadow on slams; sticker outline on pops.
- Render H.264 CRF 16 at 30 fps.

## 9. 3D look

None in Blender. Depth is CSS 3D in Remotion: perspective 1600 px, rotateX/Y/Z and translateZ on text stages.
When moving to After Effects: CSS rotateZ → AE Orientation Z; rotateY/X and z are negated; AE blur ≈ 3.3 × CSS px.

## 10. Banned

- Words over the face or the hands; words off-screen, overlapping or unreadable.
- Capitalised Poppins (only Six Caps key words are uppercase).
- A second emphasis colour: white and one brand red.
- Words simply on top of everything: every shot uses the four layers.
- Another creator's footage, branding or script; real logos (rebuild them as vector components).
- AI-generated video for the plate.
- Grain, glow or colour grades on the type.

## 11. Where it came from

- **Kinetic Type: the complete workflow guide** (PDF v1.0, Oct 2026, "Made with Claude Code", no author named),
  `D:\code_files\resources to make content engine\aman thakur's resources\`, pp. 3, 5–8, 11, 13, 21–22, 24. Research
  notes: `docs/research/styles/local-guides.md`, "Kinetic Type — red text-in-space over footage". Licence: none stated;
  the technique is described in our own words, no code or footage copied. Poppins and Six Caps are SIL OFL.
- **Taken:** colours, type rules, every recipe, the four layers, arcs, the ring, rack focus, push-in, cut rhythm and
  sound recipes.
- **Proposed:** px sizes, margins, the 48 px minimum, the stand-in colours, ring letter fade, the rack-focus and push
  curves, holds.
- **For vertical:** the source is already 1080×1920. The previews use a flat grey silhouette on a dark gradient as a
  stand-in for the footage and its cutout (the original backdrop is light grey).
- Added to the catalog on 2026-10-31.
