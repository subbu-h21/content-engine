---
name: style-obsidian-chrome
description: Visual style "Obsidian Chrome": a premium product-ad look on a black field: glossy obsidian pills and dark glass cards, heavy all-caps Inter in a silver gradient, the emphasised word squashed into a pill with an amber rim on an amber guide line, and exactly one metallic glint per shot. Use when a video is made in this style.
---

# Obsidian Chrome

## 1. In one line

Expensive and restrained, like a launch ad for a hardware product: black glass, brushed silver type, one warm
amber line, one glint. It suits product promos, app and AI-tool launches, stat callouts and calls to action, either
on its own black field or as transparent overlays on a talking head or a screen recording.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background | `#0a0a0b` | the black field (obsidian base). Over footage the style is a transparent overlay instead |
| surface | `#1b1b1f` | glass cards and chart cards (top of their gradient) |
| surface2 | `#232327` | list rows; the bottom of a card's gradient |
| obsidianTop | `#2b2b2e` | pill and tile gradient start (180°) |
| obsidianMid | `#161618` | pill gradient at 46% (it ends on the background colour) |
| text | `#f4f4f6` | headline silver base; plain silver strokes |
| silverTop | `#ffffff` | the silver gradient's start, at the top of every glyph; the glint's peak |
| silverMid | `#dedee2` | the silver gradient at 44% |
| silverBase | `#999aa2` | the silver gradient's end, at the bottom of every glyph; the dim bar in a comparison |
| muted | `#d6d6da` | subcopy, always at 72% opacity |
| faint | `#3a3a40` | card gridlines (at 50%) and idle tracks *(proposed)* |
| accent (amber) | `#e8b768` | the guide line, the inner rim of the emphasis pill, the atmosphere tint |
| accent2 (pale glow) | `#cfe0ff` | the glow of an icon tile; light rays in a diagram. Never type |
| spark | `#fff6df` | the travelling spark's core, once per shot |
| alert | `#ff4b4b` | a notification badge only (not used in the samples) |

- **Every glyph is silver:** `linear-gradient(180deg, #ffffff 0%, #dedee2 44%, #999aa2 100%)` clipped to the text.
  No flat white type, no coloured type.
- **Amber marks one group per shot:** the emphasis pill's rim and its guide line (and the faint atmosphere behind
  them). Nothing else is warm.
- **Pale glow** only lights things (a tile's glow, a ray, the hero bar's bloom).

## 3. Typography

- **Display:** Inter 800 (the source's 780 isn't shipped as a static weight), ALL CAPS, tracking −0.055 em, line
  height 0.88, silver gradient.
  - 156 px *(raised from the approved 1920×1080 Kinetic Headline's 132 px: the vertical layout stacks 1–2 words a
    line, so they can be bigger)*. Lower the size until the longest line fits the 888 px column.
  - Big numbers 240 px, tracking −0.04 em *(proposed from the showreel's 200 px year)*.
- **Emphasis:** the emphasised word sits **inside an obsidian pill** at 102/132 of the headline size (0.77×, so 120 px),
  tracking −0.045 em. Never italic, never colour.
- **CTA labels:** Inter 600, 40 px, caps, tracking 0.18 em, silver gradient, in a pill.
- **Subcopy:** Inter 400, 30 px *(raised from 21 px)*, tracking 0.04 em, muted at 72%, line height 1.35.
- **Row text** (lists): Inter 600, 36 px caps, tracking 0.04 em *(proposed)*.
- **Micro labels** (index, eyebrow, axis): Geist Mono 500 (the source's SF Mono / Consolas aren't Google Fonts),
  24 px *(raised from 13 px)*, caps, tracking 0.2 em, at 52%.
- **Smallest text:** 24 px.
- **Words on screen:** one headline of 1–3 words per line (two lines at most) plus the pill word, or one CTA plus one
  subcopy line. About 6 words of headline at most.

## 4. Layout

- **Margins:** 96 px (888 px column). **Safe zone:** 230 px top, 330 px bottom.
- **Alignment:** centred for the kinetic headline, CTA and numbers; left-aligned for the editorial variant (after a
  1 px metallic divider) and list rows.
- **The guide line** sits at y = 1060 (just below mid-frame) for the kinetic headline. The emphasis pill is centred on it; the
  plain lines stack above it, 30 px clear of the pill.
- **Cards and rows** are 888 px wide (the full column): a card is the hero, never a small floating chip.
- **How full:** one hero per frame (a headline block, a card, or a pill) filling 40–60% of the width or height; the
  rest is black. Over footage, keep the overlay in the lower or upper third.

## 5. Elements

- **Obsidian pill:**
  - radius 999 px; fill `linear-gradient(180deg, #2b2b2e 0%, #161618 46%, #0a0a0b 100%)`;
  - inset highlight `0 2px 1px rgba(255,255,255,.22)`, inset shade `0 -3px 6px rgba(0,0,0,.85)`, drop shadow
    `0 30px 55px rgba(0,0,0,.55)`, 1 px border `rgba(255,255,255,.10)`;
  - a specular cap over the top 48% (white 30% → 0);
  - the emphasis pill adds a 1.5 px amber inner rim at 60%;
  - padding 0.2 em × 0.42 em (headline pills), 0.8 em × 1.3 em (CTA pills) *(proposed)*.
- **Metallic glint:** a band 45% of the pill wide, skewed −18°, white peaking at 0.55, screen blend, sweeping from
  −60% to +160% of the pill. **One per shot, late in the shot.**
- **Spark:** one core (`#fff6df`, 3.5 px with a 70 × 10 px amber streak) crossing x −205 → +210 along the guide line
  or a beam, together with the glint.
- **Guide line:** 1 px amber at 85%, 960 px wide, fading to clear at both ends.
- **Atmosphere:** a soft amber radial at 12% behind the headline; an orbit ring (1 px silver at 10%) around it.
- **Glass card:** radius 46, `#1b1b1f → #232327`, 1 px border at 10%, faint 74 px gridlines, the pill's highlight and
  drop shadow.
- **Icon tiles:** 96 px obsidian tiles, radius 26, with a pale glow (34 px at 22%) and a drawn silver glyph. Generic
  glyphs only; a real product mark only when the user supplies it, undistorted.
- **Bars:** brushed metal (`#999aa2 → #ffffff 38% → #dedee2 60% → #999aa2`); the hero bar blooms (pale glow, 28 px
  blur, 22%); the compared bar is dim obsidian-silver at 70%; floor reflections at 12% fading down.
- **Chrome objects:** a sphere or prop is a silver radial gradient with a contact shadow under it (`rgba(0,0,0,.48)`,
  18 px blur).
- **Highlight:** a glass ring (1.5 px white at 32%, pale inner glow) snaps onto the active row.

## 6. Motion

GSAP names in the source; the curves here are their cubic-bezier equivalents.

- **pillIn** (pills, plates): from y +90, opacity 0, scale 0.96; expo-out 0.85 s.
- **labelIn / subIn:** y +14 / +18, power3.out `[0.25, 1, 0.5, 1]`, 0.6 s, after the pill (CTA: pill 0.1 s, label
  0.45 s, subcopy 0.65 s).
- **arc** (kinetic headline words): from x ∓112, y ±18, rotation ∓1.2°, blur 8 px; power4.out `[0.22, 1, 0.36, 1]`,
  0.72 s, words 0.09 s apart; lines alternate sides.
- **guide:** scaleX 0 → 1, power3.inOut `[0.76, 0, 0.24, 1]`, 0.68 s. **atmosphere:** from scale 0.72 and blur 22 px,
  0.72 s power3.out; the orbit ring from scale 0.9 / −9°.
- **squash → settle** (the emphasis pill): anticipation scaleX 0.93 / scaleY 1.06 → stretch 1.08 / 0.95 over 0.43 s
  power3.out → settle to 1 with back.out(1.55) `[0.34, 1.5, 0.64, 1]` over 0.34 s. This is the style's **one
  restrained overshoot**.
- **glint:** power2.inOut `[0.65, 0, 0.35, 1]`, 0.9 s; **spark:** 0.68 s power3.inOut. Late: about 2.3 s into a 4 s
  shot (or 1.2 s after the pill lands).
- **rise** (cards): y +60, scale 0.97, power4.out 0.8 s. **bar:** scaleY 0 → 1, 0.7 s; the hero bar 0.95 s power4.out,
  0.17 s after the other. Values rise 14 px over 0.5 s.
- **maskRise** (editorial lines): each line rises from 120% below its mask, power4.out 1.0 s, 0.15 s apart, after the
  metallic **divider** draws (power4.inOut 1.0 s).
- **slide** (rows): from x −80, power4.out 0.8 s, 0.12 s apart *(proposed within the source's 0.08–0.15 s)*;
  **snap** (highlight): back.out 0.4 s from scale 1.05.
- **out:** alpha-safe exit upward, y −40, power2.in `[0.32, 0, 0.67, 0]`, 0.45 s.
- **Holds:** readable hold to the end of the shot (at least 1.2 s after the glint).
- Nothing loops, bobs or floats once landed.

## 7. Transitions and rhythm

- **Shots** are 4–7 s at 30 fps: reveal, readable hold, clean exit (upward for a brand reveal).
- **Stagger** steps 0.08–0.15 s. **One glint/sheen per shot, late.**
- **Between shots:** the outgoing overlay exits upward; the next one rises in. Over footage, overlays are sparse
  windows of 4–12 s, never one long composition.
- **Morph:** a small pill may grow into the next card (Morph Panel: power4.inOut) when one thing becomes the next.

## 8. Finish

- No grain, no vignette, no texture.
- Soft, deep drop shadows; restrained bloom on the hero bar and on light rays only.
- Delivered as transparent alpha (ProRes 4444) when it sits over footage.

## 9. 3D look

None needed: CSS pseudo-3D only (perspective 1400–1600 px, small rotationX/Y, contact shadows, floor reflections; a
phone may tilt in from a 3D angle). If Blender is used for obsidian or chrome props: polished black glass and
brushed silver on black, one soft key from above, a contact shadow *(proposed; the source gives no material values)*.

## 10. Banned

- More than one glint or sheen per shot; a glint early in the shot.
- Looping bob, idle float, breathing pills, type that drifts after it lands.
- Decorative glow spam: bloom only on the hero bar and on light rays.
- Generic tiles, fake UI, decorative clutter or decorative telemetry.
- A second warm colour; amber on anything but the emphasis pill, its guide line and the atmosphere.
- Lowercase, light-weight or flat-white headlines (every headline is heavy silver caps).
- Bounce anywhere but the emphasis pill's one settle.
- Grain, noise or texture on the field.
- Distorting, redrawing or inventing a real brand mark.

## 11. Where it came from

- **NullMotion** (`NullMotion/data/template-catalog.json` prompts and the `public/*/index.html` preview pages),
  researched in `docs/research/styles/ecc-nullmotion-3b1b-web.md`, sections "Obsidian Chrome (NullMotion house look)"
  and "NullMotion catalog: the 23 templates as shots". Licence: MIT. The previews' third-party app marks are not used.
  - Taken: every hex; the pill recipe (gradient, highlights, shadow, border, cap); the glint (45%, −18°, 0.55); the
    amber accent, spark and guide line; Inter caps with −0.055 em tracking and 0.88 leading; the pill at 102/132 of
    the headline; CTA 40 px / 600 / 0.18 em; the mono micro labels' tracking and opacity; every timing and ease (Chrome
    CTA, Kinetic Headline, Slide-In Showcase, Compare Bars, Connector List); 4–7 s shots; one glint per shot; the bans
    on looping bob, glow spam, generic tiles, fake UI and decorative telemetry; no grain.
  - Changed for vertical: the source's approved headline is 1920×1080 with the words on one line. Here the plain
    words stack in 1–2 word lines above the pill, alternating arc sides; headline 132 → 156 px (pill 102 → 120 px);
    subcopy 21 → 30 px; micro labels 13 →
    24 px; cards fill the 888 px column.
  - Substitutes: Inter 780 → 800; SF Mono / Consolas → Geist Mono. GSAP eases → equivalent cubic-beziers.
  - *(Proposed):* the faint gridline colour, the 240 px number, row sizes, CTA pill padding, the row slide distance,
    the vertical guide position, the chrome sphere in the diagram, and the 3D material note.
- Added to the catalog on 2026-10-31.
