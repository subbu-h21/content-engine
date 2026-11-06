---
name: style-art-deco
description: Visual style "Art Deco": a 1930s poster that moves, gold engraved keylines on warm lacquer black, airbrushed volumes, one centre axis, light arriving bulb by bulb. Use when a video is made in this style.
---

# Art Deco

## 1. In one line

A 1930s poster that moves: gold keylines on warm lacquer black, airbrushed hard-edged volumes, one sacred centre axis, and light arriving bulb by bulb. Suits luxury, galas, invitations, launches, countdowns, award nights and milestones.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background | `#0d0b09` | Warm black ground of every frame. Never neutral grey-black. |
| surface (lacquer) | `#060504` | Plaques at 88 %, door leaves, the engraved underline of every gold line. |
| text (ivory) | `#F2E8D5` | Titles, plaque text, body. |
| muted (gold base) | `#C9A24B` | Eyebrows, labels, dial numerals, the metal's mid band. |
| faint (gold shadow) | `#6F5220` | The metal's dark band, unlit bulbs. |
| accent (burgundy) | `#8E1B2E` | The hero of the frame only: the one large saturated area. |
| accent2 (emerald) | `#1D6B57` | Arch fills, fish scales, doors, secondary surfaces. Never competes in area with the hero. |
| goldLight | `#F3D98B` | The metal's light band, sunburst wedges. |
| goldHot | `#FFF4D2` | Hot band, hairline highlight, lit bulb cores. |
| exception | `#3478BE` *(proposed)* | The one-colour exception the source allows: one element in its own colour, when the story needs that colour named. In the samples, scattered blue light. Swap it per video. |
| skyTop | `#0a0e16` | Top of a sky ground. |
| horizon | `#10231f` | Sky near the horizon. |

Three constants (warm black, gold, ivory), one saturated accent reserved for the protagonist, one cooler jewel tone. Other triads that work (accent / jewel / metal): coral / sapphire / pale gold; jade / plum / rose gold. Hex is always six digits.

## 3. Typography

- **Faces:** Limelight 400 (titles), Josefin Sans 400 and 600 (subtitles, labels, body), Italiana 400 (numerals), Poiret One 400 (plaques, signs). All Google Fonts. Units beside a numeral (×) are Josefin Sans at about half size: Italiana's × is too wide.
- **Sizes at 1080×1920** *(proposed; the source gives only a 40–42 px subtitle at 1920×1080)*: title 150, headline 116, number 300, body 44, label 34, eyebrow 30, dial numerals 38. Smallest allowed: 26.
- **Case and tracking:** titles and labels in capitals. Titles tracked +2 px, eyebrows +6 px *(proposed)*. Body stays in sentence case.
- **Leading:** 1.08 on titles, 1.26 on body *(proposed)*.
- **Emphasis:** the emphasised word turns to banded gold metal and a sheen sweeps it. Everything else is ivory.
- **Words on screen:** about 10 at most, stacked in short lines on the axis. Numbers carry the plot on dials, medallions and badges, not in narration.

## 4. Layout

- **One vertical centre axis (x = 540).** It is sacred: everything stands on it. Symmetry may open or rotate, never drift.
- **Margins:** 100 px *(proposed)*. **Safe zones:** text inside top 230 / bottom 330. Ornament (fish scales, keyline, sunburst) may run past them; text never does.
- **Ornament is structure:** a sunburst is the background, a stepped arch the frame, a dial the progress bar, a bulb marquee the reveal.
- **Vertical stack:** a plaque at y 310, the main figure in the middle, fish scales from y 1610 to the bottom.
- **At a peak** the hero, or the type tower, fills at least a third of the frame height.

## 5. Elements

- **Keyline (`gline`):** three strokes: a lacquer underline 1.6 px wider, the banded gold line, a hairline `goldHot` highlight. It replaces every outline. No black cartoon outlines.
- **Gold metal:** bands dark, light, hot, light, dark, repeating every 620 px *(proposed)*, tilted. Animate the offset −0.2 → 1.2 for a sheen. On type the dark band is lifted to gold base, so a word never sinks into the ground.
- **Persistent frame:** a double keyline inset 40 px with two 26 px steps in each corner *(proposed)*, drawn on in the first second.
- **Plaque (subtitle card):** lacquer bar at 88 %, stepped ends, double gold keyline. Unfolds from the centre.
- **Volumes:** a hard edge, an airbrushed gradient inside (light from the upper left), a gold rim. Burgundy for the hero, emerald for the rest.
- **Motifs:** 72-ray sunburst, stepped arch or ziggurat, fish scales (lower half-circles row by row with an inner arc), four-point sparkle, semicircle dial, diamond badge, bulb marquee, door leaves. Also available: chevrons, fan, clock face, speed lines.
- **Diagrams:** symmetrical about the axis. The subject is a burgundy medallion; forces arrive along the axis and leave as wedges.
- **Images:** none. Everything is drawn.

## 6. Motion

- **Unfold** (titles, plaques): point → hairline → bars open symmetrically → text rises → sparkle. Bezier `[0.7, 0, 0.2, 1]`, 0.75 s *(proposed)*.
- **Rise:** cubic-out, 0.5 s, 26 px, 0.09 s stagger between words *(proposed)*.
- **Draw-on:** gold lines grow along their path, cubic-in-out, 1.2 s *(proposed)*, and land on the hit. In a video, follow the music's phrase.
- **Sheen:** offset −0.2 → 1.2, sine-in-out, 1.0 s *(proposed)*, on a hit.
- **Bulb ignition:** one bulb after another, 1.6× flash settling in about 0.18 s, then a chase at 0.125 s per step *(chase speed proposed)*.
- **Mechanical moves** (doors, dials, needles): firm with a small settle. Needle spring: damping 19, stiffness 130, mass 1 *(proposed)*. Nothing floats.
- **Fish scales:** rows rise one after another, 0.08 s apart *(proposed)*.
- **Sunburst:** extends in quart-out, 1.3 s, then turns 1.2°/s *(proposed)*.
- **Rate:** characters on twos (12 fps); camera, light, bulbs, gold and sheen on ones.
- **Holds:** at least max(1.8 s, speech + 0.6 s) for a subtitle plaque.
- **Performance beats** escalate in threes: once, twice, mash.

## 7. Transitions and rhythm

- **Transitions:** door leaves hinged at the frame edges, a revolve, an arch opening, a match-cut on shape. Leaves sliding shut over the live shot end a piece. Never a generic dissolve or slide.
- **Camera:** a slow 6 % push; a low tilt for aspiration; a push into a dial when the number is the plot; pull back from detail to skyline for scale.
- **Rhythm:** symphonic jazz of the 1920s–30s (foxtrot, Charleston, tango, torch ballad). Counted light: one hit per bulb or event. Accelerate by dividing the beat. Silence before the most important sound.

## 8. Finish

Light film grain 0.03, vignette 0.34 *(both proposed; the source says light grain and gives no vignette value)*. Soft glow around lit bulbs only. Sunburst wedges stay lifted above black so the frame is never empty. No blur.

## 9. 3D look

None. Perspective is drawn in 2D: one-point with a floor, two-point from below.

## 10. Banned

- A gold-foil slideshow: things must move and have volume.
- Art Nouveau whiplash curves or flowers.
- A flat vector poster, or 1960s spy silhouettes on flat colour.
- Black cartoon outlines.
- A neutral grey-black ground.
- Generic dissolves or slides.
- Anything drifting off the centre axis.
- Generic cartoon characters; a 1960s big band.
- Copying a real poster layout, building, character, typeface design or melody.
- Three-digit hex.

## 11. Where it came from

- **Source:** Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT, original name "Art Deco" (No. 18, Graphic & Type), read through `docs/research/styles/five-skills.md`, section Art Deco, on 2026-11-06.
- **Taken:** palette, fonts, the rules for colour and axis, the gold line, unfold grammar, motif library, bulb ignition values, transitions, banned list.
- **Proposed here:** every size, margin, easing curve and finish value marked above.
- **Changed for vertical:** the source is 1920×1080. It was re-laid out, not cropped: titles stack into short lines on the axis, the arch and marquee are tall, a plaque-figure-scales stack replaces wide scenes, and type is larger.
- **Left out of the previews:** characters, the perspective lobby, and the bulb sign built from glyph skeletons. The marquee stands in for the sign.
