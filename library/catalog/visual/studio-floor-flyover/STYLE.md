---
name: style-studio-floor-flyover
description: Visual style "Studio Floor Fly-over": a page lies flat on a bright, nearly shadowless studio floor; one unbroken camera 56° off straight-down glides over it with razor-thin tilt-shift focus while its cards, chips and pictures stand up 30–54° toward the lens on soft contact shadows, then rises, dives in, and lands on a two-line title (Geist 500 + a grey Instrument Serif italic tail) above the page as a flat card. Use when a video is made in this style.
---

# Studio Floor Fly-over

## 1. In one line

Light, calm and tactile, like a macro lens gliding over paper on a white studio floor: one take over a page whose
pieces stand up as the camera passes, ending on an elegant two-line title. It suits website and product-page
promos, portfolio pieces, and explainers whose content can live on one long page.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (floor centre) | `#f9fbfb` | the studio floor |
| floorCorner | `#f2f3f6` | the floor's falloff toward the corners |
| shadow | `#1a2133` at 26% | each lifted piece's contact shadow |
| muted (italic tail) | `#8b8b92` | the grey second line of the title; quiet page text |
| surface | `#ffffff` | the page, its cards, the badge pill |
| text | `#14161c` | the title's first line, the page's ink *(proposed)* |
| faint | `#e6e8ee` | page dividers and card rims *(proposed)* |
| accent | `#4a7fe8` | the page's own accent: chips, the diagram *(proposed; a real page brings its own)* |
| accent2 | `#9cc3f2` | the page's sky illustration *(proposed)* |
| sun | `#f4cf6a` | a logo tile and the illustration's sun *(proposed)* |

- The floor and the shadow are the style; everything on the page is the page's own colour.

## 3. Typography

- **Title line 1:** Geist 500, one word every 0.06 s. 74 px at the source's 1440 × 1152; 88 px in vertical
  *(scaled for legibility, proposed)*, tracking −0.025 em.
- **Italic tail (line 2):** Instrument Serif italic in grey `#8b8b92`, one word every 0.05 s. 82 px in the source;
  98 px in vertical *(proposed, same 1.11 ratio)*.
- **Each word** rises 16 px out of a 12 px blur in 0.34 s.
- **Badge pill:** 21 px in the source, 26 px here; white, with a small accent dot.
- **On the page** *(proposed)*: page title 64 page px (with its own serif tail), headings 44–50, body 30, chips 30.
  Page text is part of the picture; it is foreshortened by the camera, so key words live on pieces that stand up.
- **Rule:** no text over the page before the end card.

## 4. Layout

- **Camera:** 56° off straight-down, never turning or swinging sideways. Focal length 1880 px and distance
  1360 → 1700 px at the source's 1152 px height; scaled by 1920/1152 for vertical: **focal 3133 px, distance
  2267 → 2833 px** (keeps the same vertical field of view; the horizon stays above the frame).
- **The page:** a white card with 24 px corners, 720 page px wide here *(proposed so it nearly fills the width at
  the focus)*.
- **End card:** the page lands as a flat card (1018 px wide with 38 px corners, top at y 283 in the source; 900 px
  wide, top at y 700 here *(proposed)*), the badge at the top, the two-line title above the card.
- **Logo tiles:** four tiles grow from 32 px to 140–200 px and hang outside the page's top corners (generic shapes:
  sun, ring, sparkle, drop; never real logos).
- **Safe zones:** 230 px top, 330 px bottom for the end card's text.

## 5. Elements

- **Lifts:** most floating cards, pictures, chips and quotes lift 20–40 px. Some lift 60–200 px and stand up 30–54°
  toward the lens. Source examples: hero chips 60–80 px at 30°; pictures 100–130 px at 46°; chips 200 px at 54°; a
  testimonial 22 → 112 px at 30° showing a 34 px white edge.
- **Pieces stand up as the camera reaches them** (from about 1100 page px before the focus, over 0.9 s
  *(proposed)*), and stay up after.
- **Contact shadow** of each lift (z = lift height): offset (0.10·z, 4 + 0.36·z), blur 7 + 0.5·z, 26% of `#1a2133`.
- **Pictures** on the page are the page's own; in previews they are drawn illustrations (a gradient sky with a sun),
  never fake photos.

## 6. Motion

- **Timeline (14.5 s in the source):** flight 0–8.2 s → rise 7.75–9.25 s → overhead 9.25–9.47 s → dive 9.47–9.97 s
  → title card 9.97–14.5 s.
- **Speed curve** (share of a cruise of about 770 page px/s): 0 at 0 s, 0.5 by 0.6 s, held at 0.5 to 1.25 s, 1.0 by
  1.6 s, held between 0.94 and 1.1 to 7.3 s, easing to 0.12 by 8.3 s. **Position is the integral of this curve**
  (never keyframed positions); check it with optical flow for stops or surges.
- **Distance** only grows (1360 → 1700, scaled); the camera never comes back in.
- **Rise:** log-scale zoom-out with a trapezoid speed profile (up 7.75–8.35 s, even 8.35–8.95 s, down by 9.25 s).
- **dive:** log scale on a quadratic ease-in-out (`cubic-bezier(0.455, 0.03, 0.515, 0.955)` as the stand-in); a
  rounded-rect mask morphs from 24 to 38 px corners.
- **Hold:** the card creeps 2% closer over 10.6–14.5 s (linear).
- **word:** each title word rises 16 px out of a 12 px blur in 0.34 s (`cubic-bezier(0.22, 1, 0.36, 1)`
  *(curve proposed)*).
- **tile:** logo tiles grow on a calm spring w 14, z 0.95 → stiffness 196, damping 26.6 *(proposed)*.

## 7. Transitions and rhythm

- **One continuous camera**, no cuts. The sections of the page are the "scenes".
- **Sound:** the music hit lands on the title card (9.97 s); whooshes at 8.66 s (the rise) and 9.80 s (the dive).

## 8. Finish

- **Depth of field per pixel:** in front of focus blur = 75 × (focus − depth)/depth; behind it 6 × (depth −
  focus)/depth; capped at 120 px; sampled with 40 golden-angle taps from a matched mip level. In the previews it is
  laid over the frame as 48 screen bands with `backdrop-filter` (on a tilted plane, depth depends on screen height
  only, so the formula is exact for the floor and approximate for the lifted pieces).
- **Motion blur:** 16 sub-frames spread over 0.7 of a frame.
- **Textures:** mipmaps with 16× anisotropic filtering.
- No glow, no grain, no vignette.

## 9. 3D look

The source renders in WebGL; Blender maps directly:
- **Scene:** a large white floor plane (`#f9fbfb` centre → `#f2f3f6`), the page as a thin card (24 px corner
  radius) with the page capture as its texture, lifted pieces as paper-thin cards (a 34 px white edge visible when
  they stand) hinged at their near edge.
- **Light:** bright, soft and almost shadowless (a big area light or an HDRI studio); only soft contact shadows,
  tinted `#1a2133`.
- **Camera:** 56° from straight-down, focal length equivalent to 1880 px on a 1152 px-tall frame, distance growing
  1360 → 1700 px, never rotating; position driven by the integrated speed curve.
- **Depth of field:** tilt-shift macro: a very shallow focus band at the frame centre, strong front blur, weak back
  blur (matching the formula above); 16-sample motion blur.
- **Colour:** neutral (AgX/Filmic), no bloom.
- The previews approximate all of this in CSS 3D (one perspective camera, per-piece transforms, banded blur).

## 10. Banned

- Cuts and crossfades.
- Stops or surges in the glide.
- The camera turning or swinging sideways.
- Zooming in and back out.
- Glows.
- Text over the page before the end card.
- A dark or coloured floor.

## 11. Where it came from

- **A creator's "landing page 3D scroll" prompt on prompt-motion.com** (https://prompt-motion.com/twoclipping-d89be5;
  a shorter paraphrase with the same values at `/pankajstwt-49978ed`), read through
  `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Studio-Floor Page Fly-over"; the run's contact
  sheet was looked at. **Licence: none stated; the prompt belongs to its creator.** Its rules are described here in
  our own words; no code, page, photos or brand are used.
- **Taken (as values and rules):** the floor colours, shadow tint and opacity, the grey tail colour, Geist 500 and
  Instrument Serif italic with word timings, the word rise and blur, the badge, the camera angle, focal length and
  distances, the speed curve and phases, rise/overhead/dive/hold, page and landed-card geometry, tile sizes, lift
  heights and angles, the shadow and depth-of-field formulas, motion blur, sound hits and the bans.
- **Proposed:** the page ink, accent, sky and sun colours; vertical type sizes; the page width; the stand-up timing;
  the word and tile curves; the dive's bezier stand-in; the end-card positions.
- **Changed for vertical:** the source is 1440 × 1152. Camera numbers are scaled by height (1920/1152) so the
  horizon stays out of frame; the title and badge grow for legibility; the landed page is 900 px wide and starts
  lower, under the title.
- **Needs:** the source flies over a capture of a real web page. The previews build a generic page from the sample
  content; a video can do the same or use a capture of a page the user owns.
- Added to the catalog on 2026-10-31.
