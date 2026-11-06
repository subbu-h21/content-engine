---
name: style-urban-sketch
description: Visual style "Urban Sketch": a location sketchbook page, wobbly sepia fineliner first, then loose transparent watercolour blooming in slightly off the lines, handwriting in the blank margins. Use when a video is made in this style.
---

# Urban Sketch

## 1. In one line

A location sketchbook page: sepia fineliner first, loose watercolour after, fraying into cream paper. Warm, unhurried, observed. Suits city and travel diaries, architecture, a day in a place, lifestyle brands, slice of life and gentle comedy; it works without any voice.

## 2. Palette

| Role | Hex | Where it's used |
|---|---|---|
| background (paper) | `#f5eede` | warm cream cold-press paper; the brightest value, reserved, never painted |
| text (ink) | `#2b2520` | the fineliner and all handwriting; one colour forever |
| muted (shadow) | `#5a5f82` | shadow sides: local colour mixed 45 % toward it. Never used alone |
| faint (haze) | `#b9c0cc` | distant blocks: mixed 50 % toward it |
| accent (straw) | `#d8ad5f` | the one coloured thing: a straw hat (band `#4b4a6a`), a sun |
| accent2 (sky) | `#86a6c8` | sky, with `#9fbcd6`; the colour that arrives in this sample |
| surface (path) | `#d8ccb1` | path and pavement |

Pigments (`pigments` in style.json): foliage ramp `#d6d56f`, `#aabf57`, `#7fa04a`, `#56793c`, `#3f5d36`; cloud belly `#b7b3c9`; buildings limestone `#d8c6a0`, ochre `#cfaa72`, glass `#98b1c8`, brick `#c49a7a`; figure shadow mix `#464873` at 40 %; red `#b0453a`.

Wash is light local colour from few pigments. Clouds are bare paper with a tinted belly. Colour may be withheld and arrive as an event: the whole page in ink, one hero thing in colour, then colour spreads.

## 3. Typography

- All text is handwriting on the page, written on left to right. It's never an overlay.
- **Titles, labels, captions:** Caveat 500–600. Title 176 px, headline 120 px, number 330 px, labels 60 px, captions 62 px *(sizes proposed; the source's end title is 190 px at 1920×1080)*.
- **Corner notes:** Reenie Beanie 400, 84 px *(size proposed; the face is small for its size)*: day, time, weather, place, or the chapter.
- **Smallest text:** 44 px *(proposed: handwriting needs more size than type)*. Line height 0.98.
- **Case:** sentence case, as written. **Emphasis:** a loose wash swiped behind the word *(proposed; the source lets colour arrival do this)*. The ink never changes.
- **Words on screen:** 10 at most.

## 4. Layout

- One large page. Nothing is painted edge to edge: the sketch sits in the middle as a vignette, its washes fraying out, and at least 96 px of paper stays bare on each side.
- Handwriting goes in the blank margins, left aligned at x = 96, between the 230 px top and 330 px bottom safe lines. It sits on bare paper; only a swipe may go behind it.
- Subjects take at least a third of the frame height at story beats. A small key object gets a faint paper halo so it reads over busy wash.
- Suggest rather than describe: a few window marks, fragments of a scalloped tree outline.

## 5. Elements

- **Fineliner:** 2.2–4 px (thinner far, thicker near), wobble 0.9–1.3 px, overshoot 3–8 px at corners, and 30–60 % of long strokes skip 3–9 px. Rectangles are separate strokes.
- **Grass:** 2–4 ink flicks per tuft, denser near camera.
- **Figures:** tube limbs, hair and head one mass, face blank (one nose tick in profile). Far crowds are carrot people: one wash blob, two leg lines, a head dot.
- **Drawn forces:** wind as ink curls with a small loop, sound as ink lines, heat as wavy strokes.
- **Diagrams:** never a chart. Sketch the thing in its place, with handwritten labels and thin pen leaders. Amounts are painted strokes whose lengths are true.
- **Corner note:** handwritten day, time, weather or place.
- **Wash:** 2–3 rough layers (edge noise 4–12 px), multiply, alpha 0.4–0.65, dropped 1–3 px off the line, dried rim at 30–40 %, granulation pigment × (0.82 + 0.36 · noise).

## 6. Motion

- **Ink first:** anything that appears is drawn in stroke order, at about 1100 px/s *(proposed)*, 0.1–0.5 s a stroke.
- **Colour after:** it blooms from a point behind a noisy circular front, in 0.9 s *(proposed)*. The wet front is 0.16 s of smoothstep and runs up to 70 % darker just behind the edge. Colour never snaps.
- **Writing:** left to right, about 32 characters a second *(proposed)*. Hold at least max(1.8 s, speech + 0.6 s).
- **Figures boil at 12 fps** (line wobble changes every 1/12 s). The static page never boils. The camera moves on every frame.
- **Wind curls:** spawn on the beat, draw on in 0.4 s, erase from the tail.
- **Camera:** 2D over the page, cubic easing. Follow shots use a critically damped spring (stiffness 28, or 70 for a fall). Moves: push-in (a detail noticed), crane up (a view opening), whip-tilt (a gust), punch-in with a 0.35 s shake (impact), tilt into the margin (to words), pull back to the whole page (summary).

## 7. Transitions and rhythm

Camera travel over the page, a page turn, or colour arriving. No dissolves. Unhurried shots, pen held while it draws. The source's film runs a 150 BPM jazz waltz, with one bar of true silence at the apex and the next gesture as the first sound after it.

## 8. Finish

Paper mottling ±4.5 %. A tooth texture multiplied over everything, figures included. Grain 0.02 *(proposed; the source gives none)*. No vignette, no glow.

## 9. 3D look

None. In the source, figures are posed on a 3D skeleton and projected, but all output is 2D drawing.

## 10. Banned

- Line-free wet-in-wet painting.
- Marker or explainer diagrams, brush calligraphy, monochrome ink tones.
- Painting edge to edge.
- Colour that snaps on; dissolves.
- Ink that changes colour.
- A generic overlay subtitle box, or any typed text.
- Straight edges in the colour field; rectangular masks around silhouettes.
- Painting the paper white.
- Copying the references' characters, melodies, layouts or type.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT:** the style "Urban Sketch" (No. 45, Urban Sketch · Pen & Wash), from the notes in `docs/research/styles/five-skills.md`. Palette, fonts, line and wash numbers, colour arrival, boil, camera vocabulary and banned list. Demo films and stills there are CC BY 4.0 and weren't used. Rules taken 2026-11-04; no code copied, the page is rebuilt in SVG filters in place of the source's WebGL compositor.
- **Fonts:** Caveat and Reenie Beanie, SIL OFL, as the source names them.
- **Changed for vertical:** the 5120×2880 page pan becomes one tall page per shot, with the sketch in the middle and handwriting above and below it. Type is sized for a phone, fewer buildings are shown, and text sits inside the safe zones.
