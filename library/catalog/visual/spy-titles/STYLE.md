---
name: style-spy-titles
description: Visual style "Spy Titles": a cut-paper, four-ink 1960s opening title, with flat grounds that change by location, condensed caps standing as architecture, a small profile silhouette against a giant circle, and hard cuts on the stab. Use when a video is made in this style.
---

# Spy Titles

## 1. In one line

A cut-paper, four-ink opening title sequence: words are the sets, a small silhouette moves through them, and brass stabs are the cuts. Dry, stylish, quick. Suits title sequences, event openers, trailers, product launches (the product is the object of the chase), festival line-ups and team intros.

## 2. Palette

Four flat opaque inks: black, paper, one hot, one warm. No gradients.

| Role | Hex | Where it's used |
|---|---|---|
| background (ink) | `#1b1714` | figures, type, dark grounds |
| text (paper) | `#efe4c9` | light grounds, type on dark, strips, an eye slit |
| accent (signal red) | `#d23a22` | the hero's tie, danger, emphasis, red grounds |
| accent2 (mustard) | `#e2a52a` | the object of the chase, mustard grounds |
| surface (dark red) | `#9a2a18` | shadow paper, depth only; props on a red ground |
| muted (dark mustard) | `#b07e1c` | shadow paper, depth only; props on a mustard ground |
| faint (distant) | `#3a322b` | far props on black |

One ground colour per location, changing with the location. Background props are a darker version of the ground, never black (they'd read as letters). Alternative sets (`altSets`): ink `#161a22`, bone `#ece6d6`, teal `#1f8a8a`, orange `#f07a28`; or black, pale pink `#f3d6cc`, cobalt `#2a46b8`, lemon `#f0d23a`. A video uses one set. Colour here is never literal: "blue" in a script doesn't add a fifth ink.

## 3. Typography

- **Credits:** League Gothic, capitals, cut letter by letter (edge noise, ±0.8° rotation, ±1.5 px baseline). Title rows 310 px, wall rows up to 300 px, number 640 px, credit lines 112 px, labels 76 px *(sizes proposed)*.
- **Titles:** jauntier than credits: ±1.8° and ±9 px *(proposed)*. A full video's title is custom cut glyphs (straight cuts and arcs, uneven weights) and may give one letter's slot to the object of the chase. Never a real title's lettering.
- **Strips:** League Spartan 600, 46 px *(source: 44 px at 1920×1080)*, sentence case.
- **Smallest text:** 40 px. Line height 0.9 for credits.
- **Emphasis:** the word changes ink. Never italic.
- **Credits are fictional roles only, never real names.** One line per location, each fully readable at some moment.
- **Words on screen:** 10 at most.

## 4. Layout

- Strong diagonals at 30°, big flat grounds, figures small against type.
- A location is one credit line as architecture: letters as pillars, words as carriages, an O as a wheel, a dash as a ledge. Lay words around a gap of 2.2 × the radius where a circular prop drops in.
- In vertical, words stack into a wall or column, each row cut to the column width, instead of running along a wide set. Margin 96 px, type within the 230 px and 330 px safe lines.
- Hide-behind gags: a hat brim, nose or accent sticks out past a letter.
- The strip sits low on the left. The object of the chase is on a black backing, the brightest thing in the frame.

## 5. Elements

- **Scissor-cut edges:** every polygon resampled every 9–10 px, pushed along its normal by slow noise (1.2–2.2 px, more for bigger shapes), with a rare 1–2 px notch. Computed once in local space, so edges never crawl.
- **Paper layering:** 2.4 px cut gap in the ground colour between pieces; shadow offset 2.5/3.5 px, blur 5, alpha 0.3.
- **Figures:** silhouettes about 7 heads tall, profile only, identified by hat, coat cut, shoes and one colour accent. One merged outline; only 1.7 px joint slits. Hands are wedges. No faces except a cream eye slit in close-ups. Empty-handed.
- **Motifs:** a giant circle behind the hero moment, a diagonal grid splitting the frame, a keyhole or lock.
- **Diagrams:** flat paper shapes with wedges and bands, the label on the shape itself. Amounts are strips cut to true length.
- **Strip:** a narrow paper strip, scissor-cut ends, tilted −1°, a small glyph from the film as its bullet. Cream with ink text on dark sets, ink with cream text on light ones.

## 6. Motion

- **Twos and ones:** puppets, hands and landing letters step at 12 fps; camera, credit slides and grid growth run at 24 fps.
- **Land (enter):** credits slide in along the grid lines and stop dead on the beat: 0.2 s, cubic-out *(curve proposed)*. Letters land with a paper slap on consecutive sixteenths (0.1136 s at 132 BPM).
- **Strip:** slides in 60 px from the left in 0.18 s. Hold at least max(1.8 s, speech + 0.6 s).
- **Run cycle:** 8 drawings, one step a beat, lean 0.3 rad, tie streaming back at about 65°. **Walk:** one step a beat, coat swinging.
- **Stop-time:** on a stab, the whole picture freezes for 2 beats in true silence, then resumes.
- **Shatter (exit):** the scene slices into strips parallel to a cut line and they slide off alternately, while the next glyphs fly in along the same diagonal.
- **Camera:** wide on a full credit line then truck in; lateral tracking in one direction; locked single shape on a flat ground; vertical pan down a column of type; push into a letter until it fills the frame.

## 7. Transitions and rhythm

Hard cuts on brass stabs, placed about 8 ms early so the peak hits the frame. Graphic match cuts: the same circle centre and size across shots (wheel, pupil, moon, keyhole). The opening wound and the closing seam sit on the same 30° diagonal. No dissolves. The cut interval shrinks as the chase accelerates (2 bars, 1.5 bars, 2 beats). Arc: cold-open hook in 3 s, theft, 3–4 locations each shorter, stop-time gag, match-cut montage, catch against a giant circle, shatter into the title, a dry button.

## 8. Finish

One paper texture multiplied over the frame (low-frequency mottling, faint horizontal squeegee streaks), sparse ink-void speckle on dark ink only, grain 0.03. No halftone, no gradient, no glow, no vignette. Flat inks and grain encode well at CRF 24 (the source saw no visible difference from CRF 19).

## 9. 3D look

None.

## 10. Banned

- Gradients, halftone dots, glow.
- Flat vector edges: every edge is cut.
- Swiss-grid rigidity.
- Spy parody gadgets, gun-barrel openings, a figure drawing a pistol, agent numbers, a tiptoeing cartoon panther.
- Copying any real title's logo, lettering, characters, silhouettes or shots.
- The famous spy-theme chromatic crawl and its ending chord.
- Real people's names in credits.
- Dissolves.
- Outlining every internal body piece.
- Background props in black.
- An object in its ground's ink without a black backing.
- Credits seen only partially.
- A stepped (12 fps) camera.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT:** the style "60s Spy Title Sequence" (No. 17), from the notes in `docs/research/styles/five-skills.md`. Palette, fonts, scissor and layering numbers, figures, motion, rhythm, finish and banned list. Demo films and stills there are CC BY 4.0 and weren't used. Rules taken 2026-11-04; no code copied, everything is rebuilt in SVG and CSS.
- **Fonts:** League Gothic and League Spartan, SIL OFL, as the source names them.
- **Changed for vertical:** horizontal chase sets become stacked walls and columns of type, each row cut to the column width; type is far bigger; the strip widens and may run to two lines. The figure and every motif are generic: no real franchise's marks or silhouettes.
