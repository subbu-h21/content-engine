---
name: style-hd-2d
description: Visual style "Lit Pixel Diorama": flat pixel sprites standing like paper cut-outs in a lit, fogged tabletop diorama seen from high three-quarter; pixel textures at one density, a cold night key with warm practical lights that breathe, fog per set, a tilt-shift band, bloom and a vignette; Cinzel gold titles, Cormorant Garamond italic narration on a soft band and a gold-bordered dialogue box. Light is the subject. Use when a video is made in this style.
---

# Lit Pixel Diorama

## 1. In one line

A storybook game world in miniature: a little pixel-textured harbour on a table, seen from above through a
tilt-shift band, where warm lights in a cold night tell the story. It suits storybook explainers, game-like
trailers, "one place as a map" stories, anything about light and fire, and chaptered pieces.

## 2. Palette

Two temperatures: a large cold, pale ambient (sky, moon, fog) against small warm practicals that carry the story.
Each set owns one fog colour and one light key; the hero wears the one saturated colour no set uses; UI is one metal
(gold) and one paper white over a dark translucent plate.

| Role | Hex | Where |
|---|---|---|
| sky (night) | `#050818` → `#101d3e` → `#2c4262` | the night dome, top to horizon |
| fog (harbour) | `#16223a` | the far part of the set, 62% at the back edge fading out toward the front |
| moon (accent2) | `#8fa8e0` | the dim cold key; blue light in diagrams |
| fire, windows (accent) | `#ff9d4a` | lit windows |
| lantern / beacon | `#ffb050` / `#fff0c8` | lamps and the carried lantern / the lighthouse |
| cool fill | `#9fb2e8` | the front fill on characters |
| hero cloak ramp | `#2e0b14` `#6b1a24` `#9c3330` `#c9503f` | the one saturated costume colour; scarf `#b08424` |
| keeper coat ramp | `#10131f` `#2a3350` `#5a6c98` | the other character |
| ink / selout | `#1a1016` / `#160e1e` | the darkest value (warm, never pure black) / sprite outlines |
| UI gold | `#d8c28e` `#e2c989` `#c9a863` | chapter labels, borders, ornaments, the caret, name plates |
| parchment | `#f3ead6` / `#f6f0e2` | narration / dialogue text |
| title gradient | `#fff3cf` → `#e2c27c` → `#a8803e` | gold titles |
| chapter card | `#11172a` → `#020308` | the card's radial ground |
| set textures *(proposed)* | stone `#2a2633` `#3b3646` `#514a5e`; plaster `#4a4a62` `#625f7c`; brick `#4a2c34` `#6a3a44`; wood `#3a2a26` `#58402f`; slate `#2c3048` `#424a6a`; clay tile `#5a2a26` `#7e3e30`; water `#0c1426` `#1a2a48` | the night set as painted |

**Times of day:** night as painted; dawn *(proposed)* sky `#1c2a5a` → `#7a5a8e` → `#f0a878`, fog `#5a4a6a`, the set
lifted 1.45× and warmed; day *(proposed)* sky `#2f63c0` → `#6fa2e6` → `#cfe2f6`, fog `#8aa4c8`, the set lifted
1.85×. Windows stay lit at night and dawn, mostly dark by day.

## 3. Typography

- **Faces:** Cinzel (Google Fonts) 500 / 700 for chapter labels and titles; Cormorant Garamond 500 italic for
  narration and taglines, 500 for dialogue, 600 for name plates and world labels.
- **Sizes at 1080×1920:** chapter label `CHAPTER  I` 40 px with 0.3 em tracking; titles Cinzel 700, 100–120 px,
  0.12 em tracking, the gold gradient and a warm glow; a number 230 px; narration 56 px (52 px for two long lines);
  dialogue 52 px; name plate 40 px; world plates 40–42 px. Smallest 32 px.
- **Case:** titles and chapter labels in capitals; narration in sentence case.
- **Emphasis:** glow and the gold gradient on titles; none in narration.
- **Narration** sits centred at y = 1320 on a soft dark band (at most 38%) with a 10 px shadow; when the subject is
  low in the set (a prism, light pillars), it moves above the roofs (y ≈ 600–700) so it never covers the light. It
  fades in 0.35 s before its line and out 0.45–0.8 s after; at most 2 lines, about 10 words.
- **Dialogue** (on-screen speech) types over 92% of the voice line.

## 4. Layout

- **Always look down on the world**, never at eye level. Front faces stay upright; the ground recedes up the frame
  (0.62 px up per unit of depth; heights at 0.78).
- **The set** fills the lower half: its front edge at y ≈ 1500 (1180 when a dialogue box sits below), its back edge
  and horizon at ≈ 1130; the sky above it holds titles and labels.
- **The tilt-shift band** is sharp from 47% to 76% of the frame height (it moves to the subject: 28–58% above a
  dialogue box); everything outside blurs 9 px.
- **Characters** are about 1/11 of the frame height (16 × 28 pixels at 6 px).
- **Dialogue box** 960 × 280 at (60, 1150); **narration** at y = 1320; **chapter and title cards** in the upper
  half, the set dimmed 50% behind them.
- Margins 72 px; safe zone 230 px top and 330 px bottom.

## 5. Elements

- **Pixel textures** at one constant density (one texture pixel = 6 px everywhere): cobbles, plaster, brick, wood,
  slate, clay tile, rippled water. Ramps of 2–3 swatches; narrow dither, never a checkerboard band.
- **Buildings** are boxes: an upright textured front face with framed windows and a door, and a textured roof slope
  rising to a ridge. Windows are emissive.
- **Sprites** stand like paper cut-outs (billboards) with a soft contact shadow and a 1-pixel selout; they step, the
  world glides. The hero (invented) wears a crimson hooded cloak and a gold scarf and carries a lantern; the keeper
  (invented) wears a navy coat.
- **Practicals:** windows, street lamps, a lantern, the lighthouse beacon, braziers; each has an additive glow sprite
  (bloom) that breathes ±20% on three summed sines.
- **Light as the diagram:** beams through fog, light pools and pillars, motes of blue light.
- **UI:** the dialogue box (navy plate `rgba(14,18,34,.86)` → `rgba(6,8,18,.9)`, 2 px gold border and an inner
  1 px line, gold diamond corners, a name plate over the top-left edge, a blinking gold ▼); chapter cards with a gold
  ornament line and diamond; one pixel ember drifting across a card; small world plates in the same plate style.

## 6. Motion

- **Sprites step, everything else glides:** walks of 4 frames at 9 fps, idles alternating two frames at 1.4 Hz,
  blinks every few seconds, poses cut between drawings. Camera, lights, particles, beams and focus update every frame.
- **Lights breathe** (±20%); one `lit` level drives flame size, light intensity (∝ lit^1.3), glow opacity and scale.
- **Lights pop on at a steady cadence** (one every 0.7 s).
- **light:** beams, pillars and fans of light grow over 0.6 s (ease-out). **plate:** dialogue and plates slide up
  14 px over 0.35 s. **title:** titles and ornaments fade up over 1.2 s (ease-in-out).
- **Lightning:** a 150 ms strike, a dip, a 60 ms re-strike, exponential decay; thunder 0.25 s after.
- **Camera:** every path a monotone curve with no overshoot; focus follows the subject. Vocabulary: a high, far
  establishing push; dialogue from ~5 m up; a lateral track with blurred foreground; a dive low; a rising pull-back;
  half an orbit; a top-down view with the band as a strip; a rack focus in a locked frame.
- **Never moves:** the set itself; the world shakes only on an impact.

## 7. Transitions and rhythm

- Short fades to black or cuts between sets; no wipes, no 3D spins.
- Long held shots (the source: 6 shots in 76.5 s); one location per chapter; music cut at downbeats, a breath when
  something fails, a hard stop into a reverb tail when the light nearly dies.

## 8. Finish

- **Bloom** 0.55 on lights (the source: strength 0.55, radius 0.75, threshold 0.85).
- **Vignette** 0.55 (the source's grade amount 0.62, warm 0.1, contrast 0.2, saturation 1.05).
- **Tilt-shift** 9 px outside the sharp band; **fog** per set.
- No film grain.

## 9. 3D look

The source is real 3D (three.js): a miniature set of boxes and cylinders wrapped in pixel textures at 24 px per
metre (`NearestFilter`), billboard sprites that receive light and cast cut-out shadows, one dim shadow-casting moon
key (directional 1.1–1.2, 2048 shadow map), a hemisphere fill (`#3a4c7a` / `#0a0a12`), practical point lights with
shadows (windows 8, street lamps 12–14, brazier 16, lantern 2.6–14), a cool front fill (1.2–1.8, range 6–8 m) about
2 m in front of the hero, exponential fog per set, a perspective camera at fov 30–42, physical DOF with the tilt-shift
folded in (band half-width 0.075, feather 0.3), UnrealBloom, ACES filmic at exposure 1.15. In Blender: the same set
with pixel-texture image planes (Closest interpolation), EEVEE soft shadows, point lights per practical, volumetric
or mist-pass fog, compositor defocus with a band mask. The previews approximate it in 2D.

## 10. Banned

- The name "HD-2D" as a title or brand; any reference game's characters, places, logos, UI ornaments or music.
- Voxel or cubic characters; a flat 2D pixel scene without depth and light (that's a pixel RPG); a photo of a real
  miniature.
- An eye-level camera; camera overshoot; wipes; 3D spins; shaking the set except on an impact.
- Pure black; film grain; wide checkerboard dither.
- Lights sitting on the sprite plane (move them toward the camera); skipping the front fill.
- A second saturated costume colour.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 31 "HD-2D Lit Diorama" (`styles/hd-2d/STYLE.md`,
  `DEMO.md`); demo film and stills CC BY 4.0 (LemoLab); the demo's music (Scott Buckley, CC BY 4.0) is third-party
  and not used. Read through the research notes `docs/research/styles/five-skills.md`, section "HD-2D Lit Diorama".
  The source itself says "HD-2D" is a trademark and must not be used as a title, so this style is named "Lit Pixel
  Diorama" (the folder id `hd-2d` is the catalog's working id). The source renders a three.js set; this is rebuilt in
  2D with React, SVG patterns and CSS filters in Remotion.
- **Taken:** the night sky, fog, moon, fire, lantern, lighthouse, fill, cloak, scarf, coat, ink, selout, UI gold,
  parchment, title gradient and chapter card hexes; the two-temperature rule; Cinzel and Cormorant Garamond with
  their roles, sizes and tracking; narration on a soft band (max 0.38) with a 10 px shadow and its timing; the
  dialogue box (plate gradient, gold border and inner line, diamond corners, name plate, caret, typing over 92%); the
  chapter and title cards with a gold ornament and a drifting ember; pixel textures at one density; billboard sprites
  with a selout; lights that breathe (±20%, three sines) and pop on every 0.7 s; walks at 9 fps and idles at 1.4 Hz;
  the camera rules and vocabulary; fades or cuts between sets; bloom, vignette and tilt-shift values; no grain; the
  banned list.
- **Proposed:** the set's texture colours, dawn and day keys, the 2D projection numbers, the harbour layout, the
  invented hero and keeper sprites, the prism and its fan of colours, the air molecule lit by the beacon, light
  pillars as the chart, the world plates, every px size.
- **Changed for vertical:** the 16:9 dialogue box (1180 × 210) becomes 960 × 280 and moves above the 330 px safe
  zone (y 1150–1430); narration moves from y = H − 88 to y = 1320; the set fills the lower half with titles in the
  sky above; the tilt band is a horizontal strip across the set rather than following the subject's projected height.
- Added to the catalog on 2026-10-31.
