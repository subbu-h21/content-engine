# Sources: Studio Floor Fly-over

## prompt-motion.com gallery entry: a landing-page 3D scroll

- **URL:** https://prompt-motion.com/twoclipping-d89be5 (paraphrase with the same values:
  https://prompt-motion.com/pankajstwt-49978ed). Video:
  https://media.prompt-motion.com/twoclipping-d89be5/video.c1c2a37f.mp4 (1440 × 1152, 60 fps, 14.55 s).
- **Research notes:** `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Studio-Floor Page Fly-over".
  The run's contact sheet was looked at (scratch only).
- **Licence:** none stated; prompts belong to their creators. Treated as all rights reserved: no prompt text, code,
  page capture, photos, logos or brand used. The page in the previews is generic and built from the sample content.

### Taken from it
- Floor `#f9fbfb` → `#f2f3f6`, lift shadow `#1a2133` at 26%, italic tail `#8b8b92`, white badge pill.
- Geist 500 title at 74 px with a word every 0.06 s; Instrument Serif italic tail at 82 px with a word every 0.05 s;
  each word rises 16 px out of a 12 px blur in 0.34 s; badge 21 px; no text over the page before the end card.
- Page with 24 px corners landing as a 1018 px card with 38 px corners, top at y 283; four logo tiles 32 → 140–200 px
  hanging outside the page's top corners.
- Lifts 20–40 px for most pieces, some 60–200 px standing 30–54°; example values (chips 60–80 at 30°, photos 100–130
  at 46°, chips 200 at 54°, testimonial 22 → 112 at 30° with a 34 px white edge).
- Timeline phases, camera 56° off straight-down, focal 1880 px, distance 1360 → 1700 px never back in, no turning; the
  speed curve as shares of ~770 page px/s, position as its integral; rise, dive (quadratic ease-in-out in log scale,
  mask 24 → 38 px corners), 2% creep on the hold.
- Depth of field 75·(f − d)/d in front, 6·(d − f)/d behind, cap 120 px, 40 golden-angle taps; shadow offset
  (0.10z, 4 + 0.36z), blur 7 + 0.5z, 26%; 16 sub-frames over 0.7 of a frame; 16× anisotropic mipmaps.
- Sound hits at 9.97 s, whooshes at 8.66 s and 9.80 s; the banned list.

### Proposed (not in the source)
- Page ink `#14161c`, faint `#e6e8ee`, accent `#4a7fe8`, sky `#9cc3f2`, sun `#f4cf6a`; vertical sizes (title 88,
  tail 98, badge 26, page type); page width 720; stand-up timing (from 1100 page px before focus, over 0.9 s); word
  curve `[0.22, 1, 0.36, 1]`; dive stand-in `[0.455, 0.03, 0.515, 0.955]`; tile spring (196 / 26.6); end-card
  positions (badge y 360, title y 470, card top 700, 900 wide).

### Changed for vertical
- Camera focal/distance scaled by 1920/1152 (3133 px; 2267 → 2833 px) so the vertical field of view matches and the
  horizon stays above the frame. Depth of field drawn as 48 screen bands in the previews.
