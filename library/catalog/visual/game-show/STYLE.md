---
name: style-game-show
description: Visual style "Game Show": a flat-vector quiz show on candy-coloured sets (stripes, dots, sunbursts) with bean contestants in thick ink outlines, white and yellow Fredoka telops with ink strokes and hard shadows, cream cards, bursts, a racing counter and a "Perfect!" judgement word, every move on a 150 BPM beat grid. Use when a video is made in this style.
---

# Game Show

## 1. In one line

A loud, happy variety-show round in flat vector: the fact becomes a quiz, contestants are toy beans, and every pop,
drop and stamp lands on the beat. It suits quizzes, rankings, year-in-review lists, playful explainers for families,
and shorts that work with no narration (the telops carry the words).

## 2. Palette

Ink + paper + candy hues + a few deep hues. One set = one hue; neighbouring sets never share a hue; a contestant is
never the hue of its set.

| Role | Hex | Where |
|---|---|---|
| ink | `#1b1b1b` | every outline, every hard shadow, text on cream, name-tag pills |
| text (white) | `#ffffff` | telop fill on a set, catch-lights, mitten hands, bursts' rings |
| surface (cream) | `#fff6e5` | round cards, scoreboards, banners, telop plates |
| accent (yellow) | `#ffd23f` | emphasised telop words, the judgement word, burst stars, the sun, stamps |
| accent2 (pink) | `#ff8fb1` | blush; the judgement word on a non-pink set |
| red · orange · green · lime · sky · blue | `#ff5a5f` `#ff8c42` `#5bd68a` `#c6f16d` `#8ed1fc` `#4d7cfe` | candy primaries: contestants' bodies, balls, bars; blue also emphasis on cream |
| purple · teal | `#6b4fbb` `#3fb8af` (`#46318f`, `#2b8f88` darker) | deep sets |
| background (navy) | `#26264a` | the ending set and the one final fade |
| muted (grey) | `#c3cad9` | props, empty bar tracks |

**Sets** (ground / pattern one step lighter / floor):
orange `#ffb870` `#ffa85a` `#e08a4a` (stripes) · teal `#3fb8af` `#4cc4bb` `#2b8f88` (dots) · purple `#6b4fbb`
`#7a5fc7` `#46318f` (sunburst) · pink `#ff8fb1` `#ff9fbc` `#e0708f` (stripes) · green `#5bd68a` `#6be096` `#3fb06a`
(dots) · navy `#26264a` `#323260` `#1b1b38` (sunburst).

## 3. Typography

- **Face:** Fredoka 700 (Google Fonts) for every telop, title, number and tag; 600 for longer lines on cream.
- **Telops:** white fill (emphasis yellow) with an ink stroke of 14% of the size painted under the fill (so 7% shows
  outside the letters) and a hard ink shadow 10 px below. Never thin captions.
- **Sizes at 1080×1920:** title telops 170 px, end telop 190 px, headline telops 128 px, the counter 300 px, the
  judgement word 128 px at −6°, card text 52–66 px, labels and pills 40 px, name tags 34 px. Smallest: 28 px.
- **Words:** at most about 6 words on screen in telops, 1–2 words a line. Long lines go on cream cards instead.
- **Case:** sentence case for telops; tags, round names and pills in capitals ("ROUND 2", "BLUE", "IN 3 STEPS").
- **Emphasis:** yellow fill on a set; the set's or the subject's hue on cream (e.g. "blue?" in blue).

## 4. Layout

- **Margins:** 72 px; the column is 936 px.
- **Safe zone:** 230 px top, 330 px bottom; must-read text above y = 1470.
- **Stage:** frontal and symmetrical. The floor band starts at y = 1400 with an 8 px ink line on top; contestants
  stand on it with name tags under their feet (y 1416–1465). Below y = 1590 is the stage front with its marquee
  bulbs (decoration only, never words).
- **Telops** sit in the upper half (y 260–930), centred. Pills sit at the safe-top line (y ≈ 262), centred.
- **Banners** dock top-left (x 72, y 250). **Cards and scoreboards** take the column (x 72–1008) in the middle band.
- A frame is about two-thirds full; the set's pattern fills the rest.

## 5. Elements

- **Vector only:** flat fills, an 8 px ink outline on characters and props (5–7 px on small parts), round joins and
  caps. No gradients, blur, texture or soft shadows.
- **Hard shadows:** the same shape in ink, 10 px down (stickers, banners) to 14 px (cards).
- **Set patterns:** 45° stripes 56 px wide scrolling at 40 px/s; offset polka dots (r 20, 112 px apart, white at
  22%); a sunburst of 15° rays turning at 12°/s.
- **Bean contestants** (160 × 172 at scale 1): a round bean body, a lighter belly patch, oval ink eyes with a white
  catch-light, pink blush, a smile that swaps to an open red mouth when shouting, stubby arms with white mittens
  (arms up = shout pose), two foot ovals in a darker shade, one head mark, an ink name-tag pill under the feet.
  Identity = body hue + head mark. In the samples the contestants are the colours of light: RED (a long lazy wave on
  its antenna), GREEN (a medium wave), BLUE (a short choppy wave); SUN (a crown of rays) hosts; AIR MOLECULE (a
  bubble antenna) scatters. All invented.
- **Cards:** cream, radius 50, 10 px outline, 14 px shadow; scoreboards radius 40, 8 px outline, tilted −1.5°.
- **Stage front** *(proposed)*: from y = 1590, the floor colour mixed 35% toward ink under an 8 px ink line, with a
  row of marquee bulbs (r 24, 108 px apart, at y 1710, 6 px ink outline); every third bulb is lit yellow and the
  pattern chases one step per beat.
- **Pills:** ink with yellow or white capitals.
- **Burst:** an 8-point yellow star, an expanding white ring (40 → 170 px) and 8 ink speed lines, 0.3 s.
- **Balls:** candy discs with an ink outline and a white catch-light.
- **Bars** grow one segment per beat, rounded, ink-outlined, on a grey track. **Stamps:** a yellow disc with an ink
  check, slapped on at −12°.
- **Counters** race to a true target in steps of an eighth of a beat.

## 6. Motion

- **Tempo grid:** 150 BPM (beat 0.4 s, bar 1.6 s). Every pop, drop, stamp, typed letter and punch sits on a beat or a
  subdivision.
- **glyph:** telop glyphs pop 0.05 s apart, 0.38 s each, rising 60 px with the back-ease
  `1 + (c+1)(p−1)^3 + c(p−1)^2`, c = 1.9.
- **pop:** cards, pills, stamps and sun scale in with the same back-ease over 0.35 s. **banner:** slides in from the
  left with the back-ease, lifts out upward.
- **drop:** contestants and balls fall 700 px from the sky with ease-in cubic over one beat, landing exactly on the
  beat; crowds drop one per beat or half-beat.
- **hop:** an idle parabola per beat, 8–30 px; neighbours hop on the off-beat so a row ripples. **squash** on each
  landing: `1 − 0.1·e^(−16·frac(t))`.
- **fly:** scattered balls fly out with ease-out cubic over 0.8 s, a new wave every beat.
- **punch:** a zoom of 0.8% (tick), 2% (hit) or 4% (slam) around the centre, decaying in 0.16 s; simultaneous
  punches stay under 6%.
- **Shout pose:** arms up and mouth open for about half a beat. **Typewriter:** one letter per 1/8 beat.
- **Exits** ease in. Nothing fades in slowly.

## 7. Transitions and rhythm

- **Hard cuts on bar lines** with a white flash of 0.08 s; no dissolves. A single fade to navy only at the very end
  (0.8 s).
- **A round** = a one-bar title card + 8 bars of play: the pattern is set up in the first half and answered or
  escalated in the second, with the slam and "Perfect!" on bar 7, beat 3. Call-and-response speeds up by
  subdivision (quarters → eighths).
- Sets change hue every round.

## 8. Finish

None: no grain, no vignette, no glow, no blur, no gradients. Flat vector only.

## 9. 3D look

None.

## 10. Banned

- Gradients, blur, texture, glow or soft shadows.
- Slow fade-ins, dissolves, crossfades (except the one final fade to navy).
- Anything off the beat grid.
- Neighbouring sets in the same hue; a contestant in its set's hue.
- Thin generic captions: words are outlined telops or sit on cream.
- Real game shows' or rhythm games' names, characters, stages, logos or music; real logos or product UI.
- Counters or scores that aren't true.
- Realistic people: contestants are beans.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 33 "Game Show Flat" (`styles/game-show/STYLE.md`,
  `DEMO.md`, easing constants in `demo/frame_head.html`); demo film and stills CC BY 4.0 (LemoLab). The demo's shouts
  (macOS `say` voices) are excluded from that licence and weren't used; the demo's real company names weren't used.
  Read through the research notes `docs/research/styles/five-skills.md`, section "Game Show Flat". Lemo draws with
  SVG/canvas; this is rebuilt with React, SVG and CSS in Remotion.
- **Taken:** every hex (ink, cream, the candy and deep hues, navy, the orange example set), Fredoka 700, the 14% ink
  stroke under the fill, the 120 px judgement word at −6° with an 18 px stroke, 8 px outlines, 10–14 px hard
  shadows, the card shape (radius 50, 10 px outline), the board tilt (−1.5°), stripes / dots / sunburst sets, bean
  construction, the burst, the 150 BPM grid, the back-ease with c = 1.9, glyph pops (0.05 s apart, 0.38 s, 60 px),
  drops from the sky landing on the beat, idle hops, the downbeat squash, beat punches, hard cuts with a 0.08 s white
  flash, the round structure and the banned list.
- **Proposed:** the px sizes for vertical, the floor line at y = 1400, the stage front with chasing bulbs, the pattern sizes (56 px stripes, 20 px dots,
  15° rays) and speeds, the pink, green, teal and navy set tones, the contestants (light colours with wave antennas,
  the Sun host, the air molecule), the ball fly-out, bars growing per beat, the stamp.
- **Changed for vertical:** the 16:9 proscenium (floor band at y 860–900 of 1080) becomes a tall stage with the floor
  at y 1400; telops stack 1–2 words a line in the upper half instead of one wide line; the level card (1240×460)
  becomes column-wide cards (936 px); banners move from (56, 44) to the safe-top line; at most three contestants on
  stage.
- Added to the catalog on 2026-10-31.
