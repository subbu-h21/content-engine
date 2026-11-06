---
name: style-red-card-kinetic
description: Visual style "Red Card Kinetic": loud lowercase kinetic type on a full-screen red grid card; white Poppins Black word stacks, tall Six Caps key words, spring entrances (swing, pop, stretch, slam, slide, fade, drop), white chips, dark UI mock-ups and a liquid-ink wipe. No footage. Use when a video is made in this style.
---

# Red Card Kinetic

## 1. In one line

Loud, fast and friendly: every spoken word lands on its frame as bold lowercase type on a red grid card. It suits
hooks, creator explainers, tool and product hype, punchlines, and any narration-only short (no footage, no 3D). It is
the card half of the "text in space" look (see the style `text-in-space` for the footage half); the two cut together.

## 2. Palette

Two colours carry everything: white words on red. The rest is card and shadow support.

| Role | Hex | Where |
|---|---|---|
| background (card mid) | `#ae0606` | the red card, mid stop of its radial gradient |
| cardCentre | `#c70808` | the gradient's centre (ellipse 85% × 62% at 50% / 46%) |
| faint (card edge) | `#880404` | the gradient's edge stop; the 216 px grid lines (2 px, 60%) |
| text (white) | `#f4f4f4` | every word on the red card, chips, beams, diagram strokes |
| accent (brand red) | `#b51722` | chip text and number discs, the red X, red bars, red words on the white card, ink-wipe droplets |
| accent2 (slam shadow) | `#5e0006` | the hard offset shadow under slam words, nowhere else |
| muted (grey) | `#7d7d7d` | the grey sticker outline; grey connecting words on the white card |
| surface | `#161618` | dark UI mock-up panels (terminal, readouts) *(proposed: the source shows them dark but gives no hex)* |
| whiteCard / whiteCardEdge | `#fcfcfc` / `#b4b4b4` | the white grid card (the breather): gradient centre / edge and its 120 px grid |

Soft shadow under light words: black at 28%.

## 3. Typography

- **Main words:** Poppins Black 900, **lowercase**, tracking −0.05 em, leading 0.85 so stacked words nearly touch.
  Each word carries a soft shadow `0 0.03em 0.09em` black 28%.
- **Key words:** Six Caps (uppercase), tracking +0.02 em, thickened with a same-colour outline of 8 px (the source
  says 6–10 px). Used for the one biggest word of a beat ("BLUE?", "AGAIN.", "STEPS").
- **Chips:** Poppins Bold 700, lowercase, 40 px, brand-red text on a white pill.
- **UI mock-ups:** DM Mono 400/500, 30 px *(proposed: the source names no UI face)*.
- **Sizes at 1080×1920** *(proposed: the source gives ratios, not px)*:
  - connecting words 96 px; main words 180 px; hero words up to 300 px; numbers up to 330 px;
  - Six Caps key words 380–530 px, fitted to 60–75% of the 936 px column;
  - emphasis words are 2–3× the connecting words (source ratio).
  - The smallest text is 28 px (mono labels).
- **Emphasis:** scale (2–3×), a slam with the hard dark-red shadow, or the Six Caps face. On the white card, emphasis
  is brand red; on the red card it is never red.
- **Words on screen:** a phrase builds up as a stack of 2–5 words (6 at most), one new word per spoken word, then
  clears at the cut.

## 4. Layout

- **Margins:** 72 px, so the column is 936 px *(proposed)*.
- **Safe zone:** 230 px top, 330 px bottom.
- **Alignment:** centred. One stack per card, centred in the frame or in its upper half; a UI mock-up or chips take
  the middle or lower third; a closing word or chip sits under them.
- **Stacks:** small connecting word above, big word below, key word last. Words never touch the frame edge.
- **Fullness:** a card is about half to two-thirds full; the red grid is the empty space.

## 5. Elements

- **Red grid card:** full-frame radial gradient `#c70808` → `#ae0606` (52%) → `#880404`, with a faint 216 px grid
  (2 px lines of `#880404` at 60%) centred on the frame.
- **White grid card:** `#fcfcfc` → `#b4b4b4` with a 120 px grid. The breather between red cards; grey connecting words,
  brand-red key words.
- **Arcs:** a word bent on an arc of radius R; a letter at distance x along the baseline gets angle θ = x / R and
  rotation θ. R > 0 bends like a rainbow, R < 0 like a smile. Arcs are 800–1000 px radius on cards.
- **Sticker outline:** a 9 px grey (`#7d7d7d`) outline painted behind the fill, for pop words.
- **Chips:** white pills (radius 999, padding 0.42 × 0.9 em), brand-red lowercase text, an optional brand-red number
  disc; a soft shadow under them.
- **UI mock-ups:** generic dark panels (`#161618`, 22 px radius, three grey window dots, a mono title) with typing,
  bars and curves that move as pure functions of time and land on the spoken word (a bar hits 100% on its word).
  Never a real app, logo or screen.
- **Diagrams:** thick white strokes (14–18 px, round caps) and white discs with a grey sticker ring. No thin lines.
- **Images:** none. A cutout silhouette filled flat brand red on the white card is allowed when footage exists.

## 6. Motion

All moves start on the spoken word's frame. Springs are Remotion `spring()` damping / stiffness / mass, at 30 fps.

- **swing** (3D swing-in): spring 13 / 140 / 0.7; rotateY ±80° → 0, rotateZ ±18° → 0, z 700 → 0, x ±380 → 0 px;
  letter-spacing +0.2 em mid-flight; perspective 1600 px. Like a door opening toward the camera. For big main words.
- **pop** (letter pop): spring 10 / 230 / 0.6 per letter, 1 frame (0.033 s) apart in a random order; a vertical
  jitter of 0.35 em settles in 9 frames (0.3 s). For small words with the sticker outline, chips and panels.
- **stretch** (elastic stretch): scaleX 0.15 → 1, spring 8 / 150 / 0.8. For Six Caps key words.
- **slam:** scale 0 → 1 with overshoot, spring 9 / 190 / 0.8, hard shadow 4.5% of the size in `#5e0006`.
- **slide** (arc slide-in): ease-out-expo over 6 frames (0.2 s), 280 px travel, ±18° tilt, opacity over 3 frames.
- **fade** (phrase fade-on): 4 frames (0.133 s), scale 1.08 → 1. For connecting words.
- **drop:** falls 320 px, ease-out-cubic over 4 frames.
- **draw:** beams, bars and strokes draw on with ease-in-out-cubic over 0.35 s *(proposed)*.
- **rack focus:** a word blurs 0 → 9 px over about 10 frames when focus moves on.
- **Stagger:** one word per spoken word; letters 1 frame apart.
- **Exits:** none per word: the stack clears at the cut or under the next wipe.
- **Holds:** at least 0.5 s after the last word lands *(proposed)*.

## 7. Transitions and rhythm

- **Liquid-ink wipe** into a red card on punchlines: a red blob grows from the top-right corner over 8–10 frames
  (0.3 s), its radius easing up to 3000 px (ease-in-out-cubic *(proposed)*). The edge wobbles (the source uses simplex
  noise; here three summed sines, 7% of the radius) and four droplets run ahead of it.
- **Hard cuts** between cards on the spoken word; a spoken word can trigger the next wipe.
- **Shot lengths:** cards last 1.0–2.6 s (31–79 frames at 30 fps) and may overlap the shot before by up to 10 frames.
- **Rhythm:** one word per spoken word, every graphic beat on its word (an X lands as the phrase ends, a bar hits 100%
  on its word).
- **Sound:** whoosh on wipes (pink noise 250 Hz–2.8 kHz, 0.7 s), swish (0.9–6 kHz, 0.35 s), thump on slams (58 Hz
  sine + click, 0.45 s); hits 25–50% under the voice.

## 8. Finish

- No grain, no vignette, no bloom (the radial gradient is the built-in vignette).
- Soft shadow under white words (black 28%); hard shadow only on slams; sticker outline only on pops.
- No blur except rack focus (0–9 px).

## 9. 3D look

None. Depth is CSS 3D only (perspective 1600 px, rotateX/Y/Z, translateZ) in the swing and ring moves.

## 10. Banned

- Capitalised or mixed-case Poppins: main words are lowercase. Only Six Caps key words are uppercase.
- A third colour on the red card: white, red and dark red only (plus the dark UI panels).
- Red type on the red card: red words belong on the white card.
- Words off-screen, overlapping, or over each other; more than 6 words in a stack.
- Thin weights for main words (Poppins Black only; Bold for chips).
- Real logos, app screens or brand marks: UI is a generic vector mock-up.
- Slow fades and long eases: everything springs or snaps in within a few frames.
- Grain, glows or gradients on type.

## 11. Where it came from

- **Kinetic Type: the complete workflow guide** (PDF v1.0, Oct 2026, "Made with Claude Code", no author named),
  `D:\code_files\resources to make content engine\aman thakur's resources\`, red-card mode: pp. 3, 6, 14, 21–22.
  Research notes: `docs/research/styles/local-guides.md`, "Kinetic Type — Red Card mode". Licence: none stated; the
  technique is described in our own words, no code or assets copied. Poppins and Six Caps are SIL OFL.
- **Taken:** every hex, the spring and ease recipes, the grid sizes, the wipe, the sticker and shadow values, Six Caps
  outline, leading and tracking, card lengths and sound recipes.
- **Proposed:** every px size, the 72 px margin, the dark panel colour and DM Mono, chip styling, the draw ease, the
  wipe's curve and sine-based wobble, holds.
- **For vertical:** the source is already 1080×1920; nothing was re-laid out.
- Added to the catalog on 2026-10-31.
