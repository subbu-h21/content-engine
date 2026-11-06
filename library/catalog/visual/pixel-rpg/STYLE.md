---
name: style-pixel-rpg
description: Visual style "Pixel RPG": a mid-90s console RPG on a native 180×320 pixel grid (6 px per pixel), a 32-colour indexed palette, Bayer-dithered skies, windows with a three-layer border, dialog that types with a talking portrait, menus with a hand cursor, quest logs, battle messages and a save crystal. The topic is told as a quest. Use when a video is made in this style.
---

# Pixel RPG

## 1. In one line

A short film that looks and behaves like a 16-bit console role-playing game: everything, text included, lives on a
coarse pixel grid; the game's own systems (dialog, battle message, status screen, quest log, save point) carry the
explanation. It suits playful explainers, "levelling up" stories, step-by-step processes told as quests, recaps and
nostalgia pieces.

## 2. Palette

One indexed palette (ENDESGA-32, free to use). No colour outside it, no blended in-between colours.

| Role | Hex | Where |
|---|---|---|
| background (night) | `#181425` | the darkest index: night sky top, every sprite's and window's 1-pixel ink outline, the text shadow |
| surface (navy) | `#262b44` | the middle of the window fill and the night sky |
| text (white) | `#ffffff` | dialog and menu text, the inner window border, the brightest highlight |
| muted (silver) | `#c0cbdc` | the third window border, window labels, the middle band of title type |
| faint (steel) | `#5a6988` | greyed-out menu items, the hero's cloak |
| steel-2 | `#8b9bb4` | the bottom band of title type, cloak highlight, the molecule's shade |
| night-3 | `#3a4466` | night sky near the horizon, empty bar tracks, cloak shade |
| accent (protected red) | `#e43b44` / `#a22633` | **red light** (700 nm), nothing else |
| accent2 (protected cyan) | `#2ce8f5` / `#0099db` / `#124e89` | **blue light**: scattered sparks, the save crystal, the day sky (the sky *is* scattered blue light), the top of the window fill |
| keyword (yellow) | `#fee761` | emphasised dialog words, speaker names, window headers, sparkle stars, the sun's core |
| sun | `#feae34` / `#f77622` | the sun's middle and edge, the hero's scarf (the hero carries sunlight) |
| plum · pink · orange | `#68386c` `#b55088` `#f77622` | the dawn sky bands on the title screen |
| grass | `#63c74d` `#3e8948` `#265c42` `#193c3e` | hills from lit top to far shade |
| skin · boots | `#e8b796` `#c28569` · `#733e39` | the hero |
| spectrum orbs | `#e43b44` `#f77622` `#fee761` `#63c74d` `#0099db` `#b55088` | "every colour": the palette's nearest red, orange, yellow, green, blue, violet |

Rules: colour depth is feeling, so a scene changes colour by swapping indices in one frame, never by fading. Only two
protected colours carry meaning: cyan = blue light, red = red light. Map shades by luminance, never by rank.

## 3. Typography

- **Faces:** Jersey 10 (Google Fonts) 400 for dialog, titles and numbers; Silkscreen 400 for window headers, names
  and menu items. The source uses an original variable-width pixel font drawn in the framebuffer (cap 7 px at
  320×180) and forbids existing game fonts; Jersey 10 is the closest OFL variable-width pixel face whose digits read
  clearly (Pixelify Sans was tried: its 5 reads as S and its brackets as braces). Silkscreen's lower case is small
  caps, so it never sets units ("nm" would read as NM).
- **Sizes at 1080×1920:** titles 126 px, the big number 360 px, dialog and captions 84 px (line height 1.15, about
  one font pixel per native pixel), Silkscreen labels 48 px (its pixel lands on the 6 px grid). Smallest: 30 px.
- **A number keeps its unit:** "450 nm" is joined by a no-break space so a line never breaks between them.
- **Case:** sentence case in dialog; UPPERCASE for menus, names and headers ("NEW QUEST", "QUEST LOG", "SUN").
- **Emphasis:** the *keyword* yellow in the same face, like an item name in a game.
- **Title type:** an 8-neighbour ink outline one native pixel (6 px) wide plus a drop of one more pixel, filled in hard
  row bands: white 0–46%, silver 46–70%, steel 70–100% (emphasis: white, cyan, blue). It arrives by Bayer dissolve.
- **Text shadow:** every UI and dialog letter has a 1-pixel (6 px) night shadow down-right.
- **Words:** a dialog box holds one sentence of up to about 12 words, 3 lines at most. A new box cuts the previous one.

## 4. Layout

- **The grid:** native 180×320, one native pixel = 6 px. Every position, size and move is a whole native pixel.
- **Safe zone:** 230 px top and 330 px bottom, i.e. native rows 38–265. Text stays left of x = 160 (960 px).
- **Dialog:** a window across the bottom quarter, native x 8–172, y 188–262 (the source's "bottom quarter"), the
  speaker's 28×28 portrait on the left with the name under it, text from x 50. The floor line sits just above it so
  standing characters stay visible.
- **System and battle messages:** a thin window at the top, native y 40–78. Menus and logs: a window in the upper
  half, the scene visible below.
- **Status screens** fill most of the safe area with one window (y 40–240).
- **Characters:** the hero is 14×22 native (84×132 px), small in a big world, about 1/14 of the frame height.

## 5. Elements

- **Window:** a rounded three-layer border (ink, white, silver, one pixel each, corners cut by one pixel) around a
  dithered fill top to bottom: blue `#124e89` → navy `#262b44` (45%) → night `#181425` (95%). Content is padded 6 px
  (native) inside the border.
- **Dither:** 4×4 ordered Bayer. A gradient between two palette colours steps through 8 levels; glows are Bayer rings
  (50% then 25%). Light shafts are a flat 50% checker with a 25% edge.
- **Sprites:** drawn from ASCII rows: 1-pixel ink outline, three tones lit from the upper left, an inner line in the
  darkest tone. The hero: a hooded traveller with a sun-gold scarf (an invented character).
- **Balls** (sun, molecule, orbs): lit, mid and dark tones by the angle to the light, a 1-pixel ink outline.
- **The save crystal:** a flat-shaded octahedron in the protected cyans with a dithered halo, turning in 8 drawings per
  90°, on a stone block.
- **UI:** the pointing hand cursor (10×7), the ▼ caret (5×3), check marks, four-point sparkles, stat bars (ink frame,
  night-3 track, colour fill with a white top row).
- **Diagrams** are game moments: a battle (sun → beam → molecule → sparks), a status screen with bars, a quest log.
- **No real game's** names, characters, frames, fonts, logos or sounds.

## 6. Motion

- **Frame rates inside 30 fps:** sprites step at 8 fps; effects (sparks, beams, counters, dissolves, twinkles) at
  12 fps; windows and camera on ones, always at whole pixels.
- **window:** slides in from the nearest screen edge over 0.3 s, ease-out cubic `[0.33, 1, 0.68, 1]`, whole pixels.
- **type:** dialog types at 38 characters a second (30 for an 8-bit look); the ▼ caret blinks at 3 Hz when done.
- **cursor:** the hand bobs one pixel at 4 fps.
- **dissolve:** titles come in through the Bayer pattern, 16 levels over 0.5 s, stepped at 12 fps. Never an alpha fade.
- **beam:** a pixel line draws across, linear 0.5 s, stepped at 12 fps. **spark:** 10 blue streaks (7 pixels long, 2
  wide, a white head) fly 60 pixels out, ease-out over 1.35 s, a new burst every 0.45 s while the light keeps
  hitting, so two or three rings are always in the air.
- **count:** numbers count up over 0.9 s (ease-out), stepped at 12 fps; **fill:** bars fill over 0.8 s in whole
  pixels.
- **Acting:** hop forward to act, knockback recoil, KO blink at 12 fps, breath = shoulders up one pixel for 0.6 s.
- **Holds:** a line holds at least max(1.8 s, its reading time + 0.6 s); the next box cuts it.

## 7. Transitions and rhythm

- **Mosaic cross:** block size 1 → 16 → 1 over 0.8 s, the palette switched at the peak.
- **Thumbnail expand:** mosaic 10 → 1 over 0.75 s, into a memory.
- **Encounter swirl:** a polar twist growing with s^1.6, mosaic and a Bayer dissolve to white, 0.8 s, into a battle.
- **Screen shake** 3–2–1 px over 8 frames; a white flash on the climax; a palette step in 4 levels. Never an alpha
  fade.
- **Palette collapse:** colour depth drops one level per beat (16 → 8 → 4 colours → faded), then floods back through
  an ordered-dither wave.
- One beat per line: a new window or a new box every 2–4 s.

## 8. Finish

None: no grain, no scanlines, no bloom, no blur, no vignette. Hard nearest-neighbour pixels only.

## 9. 3D look

None. A small prop may be flat-shaded 3D quantised to the protected indices and stepped (the crystal, 8 drawings per
90°).

## 10. Banned

- Alpha fades, smooth gradients, blur, glow, grain, scanlines (that's CRT nostalgia, not this).
- Sub-pixel positions or sizes off the 6 px grid.
- Colours outside the palette; more than the two protected meanings.
- Existing games' names, characters, window frames, fonts, logos, melodies or sounds; a slime-shaped enemy or any
  well-known game creature.
- Numbers or stats that aren't true: no invented HP, levels or damage.
- Text outside a window or the title screen.
- Smooth-dome hair or helmet heads; pale clothing that reads as skin; a dark plank door (reads as a jail).

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 29 "16-bit Pixel RPG" (`styles/pixel-rpg/STYLE.md`,
  `DEMO.md`); demo film and stills CC BY 4.0 (LemoLab). Read through the research notes
  `docs/research/styles/five-skills.md`, section "16-bit Pixel RPG". The source renders on canvas; this is rebuilt
  with SVG rects and CSS masks in Remotion.
- **Taken:** the ENDESGA-32 palette and its protected-colour rule, the 4×4 Bayer dither and 8-level gradients, the
  three-layer window border and blue → navy → night fill, the bottom-quarter dialog with a portrait, the top message
  window, typing at 38–40 characters a second, the 3 Hz caret, the 4 fps cursor bob, 0.3 s ease-out window slides,
  sprite/effect frame rates (8 and 12 fps), the title's 8-neighbour outline and white → silver → steel bands, the
  octahedron crystal at 8 drawings per 90°, the transitions (mosaic, swirl, shake, palette collapse), no finish.
- **Proposed:** the Jersey 10 and Silkscreen faces (the source's font is original), all px sizes, the hero's
  design, the Sun as a speaker, giving the protected colours the meanings blue light and red light (the source
  protects a scarf red and a crystal cyan), the spark burst, the number and bar sizes.
- **Changed for vertical:** the source's native 320×180 (×6 to 1920×1080) becomes 180×320 (×6 to 1080×1920). The
  dialog keeps the bottom quarter but sits above the 330 px safe zone; menus and logs move from the left third to the
  upper half; battle layout is stacked (message on top, the fight in the middle, the party/result window below)
  instead of enemy left / party right.
- Added to the catalog on 2026-10-31.
