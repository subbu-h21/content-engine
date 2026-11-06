---
name: style-capsule
description: Visual style "Capsule": a friendly pill editorial, Memphis meets ice-cream parlour; every container is a 2 px-outlined capsule stretching out of a dot on sun-bleached cream, nine candy accents, Bodoni Moda headlines that blur into focus, confetti pills that scatter and settle, soft candy glows and grain. Use when a video is made in this style.
---

# Capsule

## 1. In one line

Memphis meets the ice-cream parlour: everything sits in an outlined pill on sun-bleached cream, with candy colours, Bodoni
headlines and confetti pills. It suits lifestyle and consumer brands, friendly explainers, community or creator content.
No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (cream) | `#f5f5f0` | ground |
| surface (white) | `#ffffff` | content pill fills |
| text (ink) | `#1a1a1a` | all type |
| muted | `#1a1a1a` | there's no grey type |
| faint (outline) | `#1e1e1e` | the universal 2 px stroke |
| accent (coral) | `#e85d4e` | accent line (60 × 4; 80 × 4 on the closer), the active caption word; a candy |
| accent2 (sky) | `#8bb4f7` | candy; highlight pill |
| lime | `#c4d94e` | candy; orbit centre; highlight pill |
| lavender | `#c5b5e0` | candy |
| violet | `#a06ce8` | candy; stat numerals; the closing italic word |
| yellow | `#f2d160` | the title pill |
| peach | `#f5b895` | candy |
| mint | `#a8e6cf` | candy |

Every shadow is ink at 8%. The candies carry no meaning, except where a sample's content asks for one (sky for blue light).
Pair a warm (coral, yellow, peach) with a cool (sky, lavender, violet, mint) and a neutral-bright (lime); never two of one
family side by side. Colour only touches stat numerals and pill fills, never a headline. No tenth colour.

## 3. Typography

- **Bodoni Moda** 600/700/800 for all display, stats and quotes: ink, sentence case, never uppercase. **Space Grotesk**
  400/500/600 for body and uppercase pill text.
- **Sizes at 1080×1920** *(proposed: the display keeps its source px, the rest are raised for a phone)*:

  | Role | px | Notes |
  |---|---|---|
  | display, 800 (≤ 3 words a line) | 226 | leading 0.92, −0.03em |
  | closing display, 800 | 186–220 | |
  | headline, 700 (4–6 words) | 122 | leading 1.02, −0.02em |
  | card headline, 700 | 58–74 | −0.01em |
  | stat numeral, 800, candy | 300 | −0.03em |
  | body, Space Grotesk 400 | 38 | line height 1.36 |
  | pill text, Space Grotesk 600, uppercase | 26–30 | 0.12em |

- **Smallest text:** 24 px.
- **Italic** only for a key word, which may take a candy hue. **Emphasis** in a line is a lime or sky highlight pill,
  never bold.
- **Words on screen:** about 8 in Bodoni.

## 4. Layout

- **Margins:** 84 px; floating pills may bleed.
- **Safe zone:** text stays inside 230 px top and 330 px bottom. Only textless confetti goes below y = 1590, so the frame
  doesn't end in an empty strip.
- **Alignment:** cover and closer centred; cards lean left. Bare corners read as broken: use confetti.
- **For 9:16:** the display goes on top with a band of pills below it; rows stack, never in a row of three; a stat is one
  big card, with tracks below; the orbit is one centre with its satellites.

## 5. Elements

- **Pill:** radius 9999 (40 px for cards) with a 2.4 px outline, on everything *(proposed scale of 2 px)*.
- **Pill card:** white, 8 px shadow. **Stat card:** a coloured Bodoni numeral and an 80 × 4 coral bar, 12 px shadow.
- **Title pill:** yellow, above the headline.
- **Step node:** a candy circle with a Bodoni numeral, 4 px shadow. **Capsule rows:** a full pill holding a node and a line.
- **Orbit:** a lime centre with tilted satellites on a dotted path.
- **Floating pills:** 5–11 per declarative frame, rotated −20° to +25°, flat, outlined, no shadow, no text.
- **Bar track:** an outlined 56 px pill with a candy fill.
- **Atmosphere on every frame:** 2–3 radial candy glows at 6–15%.

## 6. Motion

The source has no motion but a caption pop; everything here is *(proposed)* from the HyperFrames taste rules T36–T60. The
idea: a capsule is a dot that stretches.

- **stretch** (every pill and card): appears as a dot and stretches to full width on a spring (damping 15, stiffness 190,
  mass 1: ratio 0.54); its content is uncovered as it grows. Rows stretch from one end.
- **scatter** (confetti): pills burst out from behind the headline and settle at their angles on a spring (damping 13,
  stiffness 130, mass 1: ratio 0.57), 0.05 s apart. This is a cover's hero move. They settle, then stay.
- **focus** (Bodoni, T43): each word blurs in, 6 px → 0 and opacity 0 → 1 in 0.13 s, 0.067 s apart, with no translate.
- **line:** a highlight pill sweeps open behind its words, and accent lines grow, expo-out over 0.5 s.
- **fill:** tracks fill on a spring (damping 17, stiffness 120, mass 1: ratio 0.78).
- **orbit:** satellites burst out to the path, and the whole ring turns at 10° a second: a diagram at work, not an idle wobble.
- **glow:** glows swell in once, sine-in-out over 1.0 s.
- **out:** content shrinks 8% and fades, quart-in over 0.26 s.
- **Captions:** the active word gets a rounded coral highlight, scale 0.92 → 1 in 0.18 s with `back.out(2)` *(from the
  source's caption skin; the bezier is `[0.32, 1.9, 0.6, 1]`)*.
- **Holds:** at least 1.0 s. A landed headline is dead still.

## 7. Transitions and rhythm

- **Cuts:** a pill on screen grows to carry the cut: a capsule stretches past the frame's edge and its fill becomes a
  glow's colour, or everything shrinks away and the next dot stretches *(proposed)*.
- **Rhythm:** easy-going: 2–4 s shots, one pill at a time, a change of candy each shot.

## 8. Finish

- **Shadows:** soft hard-offset in 8% ink, down and right, no blur: 4 px nodes, 6 px stat pills, 8 px cards, 12 px the main
  frame. Floating pills cast no shadow, which keeps content apart from atmosphere.
- **Grain:** 0.04, always. **Glows:** 2–3 radial candy glows at 6–15%. No vignette.

## 9. 3D look

None.

## 10. Banned

- Sharp-cornered text containers; unstroked pills.
- Coloured or uppercase Bodoni headlines (a highlight pill or one italic key word in candy is the exception).
- Blurred or recoloured shadows; a tenth accent.
- Shadows on decorative pills; edge-to-edge headlines.
- Two candies of one family side by side.
- Three cards in a row.
- Floating pills that keep bobbing.
- Text on a confetti pill.

## 11. Where it came from

- **HyperFrames frame preset Capsule (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "Capsule". Rebuilt in Remotion; no code was copied. Bodoni Moda and
  Space Grotesk are SIL OFL.
- **Taken:** every hex, the candy pairing rule, the faces, the display size, the pill rules, shadows, grain, glows, title
  pill, accent line, stat pill, step node, orbit, floating-pill wallpaper, highlight pill, the caption's pop, the banned list.
- **Proposed:** all other motion, the px sizes for a phone, the 2.4 px stroke, the capsule rows, the orbit's blue satellites,
  the spectrum of capsules on the headline frame, track height.
- **For vertical:** the display goes on top with a band of pills; the source's three pillar cards become stacked capsule
  rows; the 2 × 2 stat grid becomes one stat card with tracks.
- **BANNED-list note:** HyperFrames' film list bans the cream serif with pill chips by default; here it's the look, on
  purpose: the candy colour and capsule grammar make it this and nothing else.
- **Kept apart from** Memphis (a tabletop model), Game Show (flat vector characters) and Editorial Neuro (dark Bodoni):
  capsules on cream.
- Added to the catalog on 2026-11-06.
