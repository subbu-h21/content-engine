---
name: style-woodcut
description: Visual style "Woodcut": a relief print that carves itself, a black wood block in a paper margin with light only where a gouge has cut it, and one colour plate printed inside the cuts. Use when a video is made in this style.
---

# Woodcut

## 1. In one line

Every frame is a black wood block inside a warm paper margin and light exists only where a knife has cut it away: heavy, patient, handmade. Suits folk tales, craft and heritage brands, book trailers, labour and perseverance stories, wordless-novel sequences.

## 2. Palette

Two values carry everything: near-black ink and warm paper. Never grey on grey.

| Role | Hex | Where it's used |
|---|---|---|
| background (paper) | `#efe8d8` | carved whites and the margin |
| text (ink) | `#111111` | the uncut block and the letterpress captions |
| accent (colour plate) | `#3a76ad` | this style's plate, cold Prussian blue *(proposed hex, lifted so it reads inside letters at phone size; the source names the colour without a value)*. Printed only inside cuts, on the one thing that matters |
| accent2 (copper plate) | `#c8502a` | the source's plate, for heat stories (metal, fire). A video uses one plate, never both |
| surface (wood) | `#d8c29c` | only in shots that show the block itself |
| muted | `#5a5348` | small credits in the margin *(proposed)* |
| faint | `#d9d0bd` | the paper's laid lines *(proposed)* |

The plate may spread at a peak (the whole sky of the end card) and shrink back to one highlight. It never sits on black and is never decoration.

## 3. Typography

- **Carved titles:** IM Fell English SC 400, cut out of uncut black. Title 170 px, headline 92 px, number 400 px, carved labels 44–57 px *(sizes proposed; the source gives none)*.
- **Letterpress captions:** IM Fell English 400, 52 px (body 60 px) in the paper margin, ink `#111111`. The source's 42 px at 1920×1080, enlarged for a phone.
- **Smallest text:** 30 px. Line height 1.12.
- **Case:** carved text is small capitals from the face; captions are sentence case.
- **Emphasis:** in captions, italic. In the block, the colour plate printed inside the carved letters, 3 px off register.
- **Words on screen:** 10 at most; four or five spoken lines per video at most.

## 4. Layout

- Each shot is one printed plate: the block is `54, 150` to `1026, 1300`, its edge ragged, never a clean rectangle. Margins 54 px left and right.
- The block starts above the 230 px text line on purpose: its top strip is picture only, and carved text starts at y = 230 or lower.
- Letterpress sits in the bottom margin from y = 1440 and ends above the 330 px bottom safe zone. The paper below it stays empty.
- Black masses against carved white, or white on uncut black. The brightest cut is the focus. The paper margin never moves: a camera move happens inside the block.

## 5. Elements

- **Tools (px at 1× camera):** knife 1.2–2 (contours, the white halo around a black figure on black); V-gouge 2–8 (hatching, fine light); U-gouge 10–22 (rays, sky, first rough-out); stab radius 3–8 (sparks, chips).
- **A cut:** one separate stroke, 30–220 px, blunt entry, tapered exit, chipped edge.
- **Hatching:** direction follows form (arcs around round things, fall lines on slopes, radiating light); width follows tone (bright = wide cuts nearly merging, mid = thin, dark = uncut); far = dense and fine, near = sparse and coarse. Never on every surface.
- **Carved light:** radial bursts (36 rays, width 10–15), and arcs of sky around a cleared sun.
- **Figures:** black silhouette, white knife halo, 3–6 cuts on the lit edge only. No black faces with white cuts at small sizes.
- **Diagrams:** labels are carved into uncut black or set in the margin, never over cuts. Lengths in a chart are lengths of gouged line, drawn true.
- **Photos and frames:** only re-cut so that cuts follow form (luminance to cut width, direction from the picture's structure); never threshold-filtered.

## 6. Motion

- **Carve (enter):** nothing fades in. Each stroke has its own start and speed: its length at 1300 px/s *(proposed)*, kept to 0.08–0.35 s, linear. Coarse gouges first, fine lines after. Reveal order by light, radial from a point, or downward.
- **Letter:** carved letters appear one at a time, 0.06 s apart.
- **Ink (captions):** up in 0.1 s with no slide, off in 0.15 s. Hold at least max(1.8 s, speech + 0.6 s).
- **Characters** step on twos (12 fps); camera, particles and light run on ones (24 fps). Hatching belongs to the body part so it doesn't boil; only fire and liquids re-cut, every 2 frames.
- **Key action:** lean back 4 frames, strike 2 frames, settle with a 3-frame shake.
- **Camera:** locked plate for reading; slow push 1.0 to 1.13 over 4 s; pull-back as cuts spread (3.5× to 1×); snap zoom 0.2 s then hold 1.3 s.

## 7. Transitions and rhythm

- **Hard cut = a new impression:** two frames off register, `[5, -3]` then `[-2, 1]` px.
- **The peel:** ink rolled, paper laid, the sheet peels toward camera, heavy then fast (0.9 s), showing mirrored show-through. Never a dissolve.
- **Montage:** cuts on the beat, 1, 1, 1, 0.5, 0.5, 0.25, 0.25 s. A silent plate after a failure.

## 8. Finish

Paper grain 0.03, no vignette, no glow. Burr on every cut edge (1.6 px), ink unevenness 6 % as wood-grain streaks, specks where ink didn't take, plate misregistered by 3 px. Each impression gets its own ink seed. Encode with `-tune grain`, CRF 28 (the source found no visible loss at 1:1).

## 9. 3D look

None. Close-ups are small 2D height fields, lit and re-cut.

## 10. Banned

- Copperplate engraving: no swelling burin lines on white, no crosshatch built up from a white ground (that's the `engraving` style: there a white sheet gains fine lines; here a black block loses fat ones).
- Linocut poster art with flat colour areas.
- A photo through a threshold filter.
- Fades in, dissolves.
- Colour on black, a decorative plate, two plates.
- Hatching on every surface (it reads as fur or rain); grey on grey.
- Text over the picture.
- Steam or smoke drawn over the subject.
- Copying named printmakers' plates, figures, borders or titles.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT:** the style "Woodcut" (No. 15, Woodcut Print), from the notes in `docs/research/styles/five-skills.md`. Palette, tools, hatching grammar, carve reveal, new-impression cut, peel, finish and banned list. Demo films and stills there are CC BY 4.0 and weren't used. Rules taken 2026-11-04; no code copied, the cuts are rebuilt in SVG.
- **Fonts:** IM Fell English and IM Fell English SC, SIL OFL, as the source names them.
- **Changed for vertical:** the source's 1848×912 image with a 132 px caption strip is now a tall 972×1150 block with a wide bottom margin; type sizes are bigger, burst radii are smaller, and one plate carries one idea. *(Proposed: the Prussian blue hex, title sizes, knife speed.)*
