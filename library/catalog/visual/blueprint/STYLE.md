---
name: style-blueprint
description: Visual style "Blueprint": an engineering drawing that comes alive on one sheet of cyanotype paper, white line work on uneven Prussian blue, hand-lettered notes, one red stamp. Use when a video is made in this style.
---

# Blueprint

## 1. In one line

An engineering drawing that comes alive on one sheet of cyanotype paper: white lines on uneven Prussian blue, built in drafting order, with annotations that move and dry notes that carry the wit. Suits how-it-works explainers, hardware launches, product versions and plans becoming things, at 30–60 s.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (sheet low) | `#18336B` | The paper's deeper blue; also the "paper" fill that hides lines behind a solid. |
| surface (sheet high) | `#2A58A6` | The paper's lighter blue, mottled through the low one. |
| text (line) | `#E7F0F9` | All line work and all lettering. |
| muted | `#B7CCE8` *(proposed)* | The same white at a lighter weight: secondary lettering. |
| faint | `#7E9FD2` *(proposed)* | The same white at its softest. |
| accent (stamp red) | `#C23B2E` | The one rubber stamp: the only non-blue colour, exactly once in a piece. |
| accent2 (bleached) | `#5B8CC4` | Worn edges of the sheet. |
| note | `#0C1C3E` | Note boxes at 58 %. |
| table | `#0D1116` | The drafting table outside the sheet. |

Blue and white only. Blue varies in value (coating, stains, folds); white varies in weight and softness, never in hue. Alternate sheets: sun-bleached `#3A6DA8` → `#5B8CC4`, deep over-exposed `#0F2350` → `#1D3F80`. The stamp may be green (APPROVED) or black (VOID) instead of red, never as well as red.

## 3. Typography

- **Faces:** Architects Daughter 400 (headers, labels, notes), B612 400 and 700 (title-block fields, Fig. lines, balloon numbers), Allura 400 (signature only). All Google Fonts.
- **Sizes at 1080×1920:** header 132, headline 112, number 250, note 40, label 32, Fig. line 30, field 25. Smallest allowed: 24. *(All proposed for vertical; the source's 38 px subtitle at 1920×1080 becomes 40.)*
- **Case and tracking:** headers, labels and title block in capitals, headers tracked +4 px *(proposed)*. Notes in sentence case.
- **Emphasis:** a revision cloud round the emphasised words *(proposed use of the source's cloud)*. Colour never carries emphasis. The title block's status field holds the verdict.
- **Words on screen:** about 10 in a header. Everything is written on left to right; a note takes about 0.35 s a line.

## 4. Layout

- **One sheet.** The whole piece happens on it, and the camera reads it like an eye. A title and an ending show the whole sheet on the dark table; storytelling shots stay close, with the sheet filling the frame.
- **Margins:** 96 px *(proposed)*. **Safe zones:** text inside top 230 / bottom 330. Below y 1590 there is only the scale bar and sheet border.
- **Sheet furniture:** double border with centre ticks, Fig. line at y 250, title block at y 1442–1590, drawn scale bar at the foot.
- **Figures:** the subject takes most of the frame, with empty sky beside it for notes. Notes sit in that sky, never fixed to the bottom. The bottom belongs to the ground line and title block.
- **The payoff object** is about a third of the frame height and clear of notes.

## 5. Elements

- **Four line weights** in sheet units: outline 3.2, detail 2.0, thin 1.25, hair 0.9. Screen width = sheet width × zoom^0.65. The samples use zoom 1.4 *(proposed)*.
- **Dashes:** centre `[34,7,6,7]`, hidden `[11,7]`, phantom `[30,6,5,6,5,6]`, scaled with zoom.
- **Hatching:** 45°, 14 px apart *(source: 8–14 units)*, for sections, soil and weights.
- **Dimension lines** measure moving parts, and their numbers change. **Balloons:** numbered circles with leaders.
- **Revision cloud:** outward scallops. **Rubber stamp:** once, on a pale unexposed patch *(proposed: red alone doesn't read on this blue)*. **Fig. numbers** struck through and rewritten.
- **Note box:** translucent, 1.2 px outer and 0.8 px inner rule, a NOTE / n cell, a leader tick at lower left.
- **Occlusion by painter's order:** each solid is filled with paper before its outline is stroked.
- **People** appear only as a hand shadow or a signature. The designed thing is the character.
- **Images:** none.

## 6. Motion

- **Drafting order:** centre lines → outlines → detail → hatching → dimensions → balloons → labels. Samples start them at 0.15, 0.45, 0.85, 1.15, 1.5, 1.8, 2.1 s *(proposed)*; in a video, one layer per beat.
- **Draw-on:** truncated by arc length with a small white nib at the head; cubic-in-out, 0.8 s *(proposed)*.
- **Lettering:** left to right behind the nib, linear, 0.35 s a line.
- **Hatching:** stroke by stroke, 0.6 s *(proposed)*.
- **Count:** dimension numbers run up, cubic-out, 1.3 s *(proposed)*.
- **Snap:** back-ease `[0.34, 1.56, 0.64, 1]`, 0.6 s, for a part reaching its size *(proposed)*.
- **Stamp:** comes down in 0.16 s, expo-in *(proposed)*, with a small camera bump. The only impact bump.
- **Machine acting:** failure slows, sags and winds down over about 1.5 s; joy snaps upright. A gear steps one tooth (7.5°) per eighth note with a 0.35-beat ease-out. Exploded parts leave one every 0.055 of the progress.
- **Rate:** camera and draw-on on ones (24 fps). Holds at least max(1.8 s, speech + 0.6 s).

## 7. Transitions and rhythm

- **Transitions:** cuts on downbeats, or a Fig. number struck through and rewritten. No dissolves.
- **Camera:** continuous moves within a section; whole sheet, medium on a figure, track along a path of force, 2× close-up on a downbeat, a section line sweeping, oblique depth 0 → 0.5.
- **Rhythm:** contrapuntal, mechanical music: harpsichord, bassoon, spiccato strings, celesta, music box, with a repeated motive as the gear. Hatching foley at 13 strokes a second. A flaw is a slowing into true silence; a full cadence lands on the stamp.

## 8. Finish

- **Paper:** procedural and fixed between frames: low-frequency noise between the two blues, horizontal coating streaks, a slight left-to-right fade, fibres, specks, fold creases (bright edge, dark edge), bleached edges. The noise values are *(proposed)*.
- **Ink:** slightly soft (0.3 px blur) and faintly broken by the paper's grain *(both proposed)*.
- **Grain:** 0.018 *(proposed)*. **Vignette:** none. **Glow:** none, except the nib while it moves.

## 9. 3D look

None, and 3D rendering is banned. Depth is oblique projection drawn in 2D: animate a depth factor 0 → 0.5, stroke the outline at N depth steps at 2× width, then fill with paper. One drawn thing may, at most once, leave the drawing language: soft volume, one radial gradient, white light, a shadow across the lines, a pale imprint where it was drawn.

## 10. Banned

- 3D rendering, glowing wireframes, a 3D orbit.
- Marker on white; burin tonal hatching as the whole look.
- Hue variation in the white.
- A second non-blue colour, or the stamp colour more than once.
- Dissolves. Subtitles fixed to the bottom.
- Dark ink grounds, orange pen sparks, karaoke type, equations and plots: those belong to Plotter on Ink and Technical Documentary. This is paper.
- Real patents, a real inventor's machine or signature.
- Per-lobe shading on blobby shapes; line weights not scaled with zoom.

## 11. Where it came from

- **Source:** Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT, original name "Blueprint" (No. 19, Graphic & Type), read through `docs/research/styles/five-skills.md`, section Blueprint, on 2026-11-06.
- **Taken:** palette, fonts, line weights and dashes, hatching, drafting order, note box, stamp rule, Fig. rewrites, machine acting, paper recipe, banned list.
- **Proposed here:** values marked above, and the revision cloud as the emphasis device.
- **Changed for vertical:** the source is 1920×1080 on a 3200×2200 sheet. It was re-laid out, not cropped: a tall sheet, headers stacked in short lines, figures stacked above notes, the title block a full-width band inside the safe zone, and larger type.
- **Left out:** the WebGL paper shader (SVG noise stands in), water, the hand shadow, and the "one real thing".
