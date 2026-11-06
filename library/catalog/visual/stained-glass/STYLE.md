---
name: style-stained-glass
description: Visual style "Stained Glass": a hand-cut window seen from a dark stone hall, alive only where the sun touches it, with carved titles, a parchment banderole, and light as the clock. Use when a video is made in this style.
---

# Stained Glass

## 1. In one line

A medieval-craft window seen from a dark stone hall, alive only where the sun touches it: light is the clock, the camera and the story. Suits legends, heritage, holiday stories, sequences of stations, steps or seasons, repair and reinvention stories, and lineups as lancets.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (hall) | `#14120f` *(proposed)* | The dark of the hall, shadow over stone. |
| surface, text (parchment) | `#e7d9b6` *(proposed)* | The banderole; light type on dark, when needed. |
| muted (lit stone) | `#a69c8b` *(proposed)* | String course, embrasure. |
| faint (ashlar) | `#6e675c` *(proposed)* | Wall stone. |
| accent (ruby) | `#a8101c` | The hot hue; the border band. |
| accent2 (cobalt) | `#1d3a9c` | The dominant glass. |
| deep | `#142a70` | Darker blue glass. |
| gold | `#dc9a22` | Touches, pearls, gilding. |
| emerald | `#2f7f36` | Touches. |
| olive | `#6b7a22` | Touches. |
| murrey | `#632a63` | Touches. |
| white | `#cfdac6` | Greenish white glass: scrolls, fillets, sparingly. |
| sky | `#7fa2cf` | Sky glass. |
| amber | `#ff9a2a` | The story light: a colour no glass uses. |
| lead | `#1d1f23` | Cames. |
| trace | `#2c1a0c` | Grisaille at 88 %, ink on parchment, the dark of a carved letter. |
| floor | `#4a453e` *(proposed)* | Flagstones. |

Also in the source: flesh `#d2a288` (keep it darker than you think), mail `#a9b7b2`, umber `#7a4e24`.

Two hues carry the picture, one deep and one hot (cobalt and ruby), with three or four more only as small touches. Stone and lead take colour only from spilled or projected light.

**The sun's colour is the clock** (rgb × intensity): dawn (.70, .83, 1.0) × 2.2; noon (1, .97, .9) × 2.7; afternoon (1, .84, .6) × 2.35; dusk (1, .6, .34) × 2.6; moon (.55, .66, 1.0) × 0.5. Warm suns drain blue glass: when a shot's point is a blue, light it at dawn or noon.

## 3. Typography

- **Faces:** Cinzel 600 (titles, incised capitals), IM Fell English 400 (banderole, scrolls). Both Google Fonts.
- **Sizes at 1080×1920:** title up to 104, carved headline up to 92, carved number 210, banderole 40–42, scroll 44. Smallest allowed: 30, the source's limit for carved lines. *(Sizes proposed; the source's 44 px banderole at 1920×1080 stays about the same on a narrower ribbon.)*
- **Case and tracking:** carved titles in capitals, tracked +3 px *(proposed)*. Banderole and scrolls in sentence case.
- **Emphasis:** the emphasised word is gilded, with a dark cut round it. Otherwise the light itself is the emphasis: a lit pane means "now".
- **Inside the glass,** text only as grisaille on a white-glass scroll.
- **Words on screen:** about 10 carved at most; a banderole takes two lines.

## 4. Layout

- **Always show the room.** One tall lancet (x 180–900, point at y 120, sill at y 1150) in a splayed stone opening in an ashlar wall, with the string course and the floor below. The tall lancet is how this style goes vertical.
- **Stack:** window; string course y 1178–1440 with the carved words; banderole centred on y 1512; flagstones from y 1622.
- **Margins:** 90 px *(proposed)*. **Safe zones:** text inside top 230 / bottom 330. Only glass, stone and floor run past them.
- **Subjects are big** inside the lancet, on or near the centre. A revealed thing is at least an eighth of the frame width.
- **Backgrounds:** hand-cut lozenge quarries. **Borders:** a ruby band with gold pearls and a white fillet.
- **Several lancets** side by side suit a wider frame or a pull-back; in a phone frame, stack panels in one lancet.

## 5. Elements

- **Pieces:** smooth Catmull-Rom cuts, no deep concave corners. Every piece is textured: a gradient at its own angle, colour drift about ±10 %, darker aged edges by the lead, bubbles and scratches. Never flat fills.
- **Lead:** one near-black planar network, 6 px (4.2 on quarries, 3–4 on small details), round joins, faint grey flange, solder blobs. Lead only where colours meet: one colour is one piece.
- **Iron saddle bars** cross the window at intervals, placed per shot so they never run through lettering.
- **Grisaille:** tapered trace lines, matting wash .35–.45, scraped highlights. Mail, scales and plates are grisaille arcs and bands.
- **Faces and figures,** when used: almond eyes, heavy upper lid, big pupils; rigid pieces on 2D joints; expression by swapping the face piece, never morphing.
- **Banderole:** parchment ribbon with folded swallow-tail ends *(the source says curled; folded reads cleaner at phone size)*, a gentle sag and a thin rule.
- **Carved letters:** a dark cut, a light lower lip, gilding on emphasis.
- **Diagrams** are made of glass: a roundel for the subject, wedges for forces, scrolls for names.
- **Images:** none.

## 6. Motion

- **Things appear by being lit, never faded in.** Glass never bends or morphs.
- **Band of light:** lit panes at 2–3× backlight; band edge softness 24, a slight skew.
- **Opening ray:** width 18 → full, skew .45 → .06, in about 1 s; cubic-in-out, 1.1 s in the samples *(curve proposed)*.
- **Step:** a panel lights, 0.45 s cubic-in-out *(proposed)*, one per beat.
- **Carving:** a band of light crosses the letters left to right, cubic-in-out, 0.9 s *(proposed)*.
- **Banderole:** unfurls from the centre, cubic-out, 0.7 s *(proposed)*; text fades in only once it is 75 % open, the one fade allowed. Hold at least max(1.8 s, speech + 0.6 s).
- **Freeze rule:** a pane's figures use `min(t, t_lightLeft)`: only lit panes move. Actions land on the beat.
- **Crack:** 9 white jagged lines in 0.28 s, white flash 0.45 s, 2-frame shake.
- **Re-leading:** piece groups slide one beat each with a small outward bump, ending in a weld spark; cracks become mending leads.
- **Rate:** figures at 8 fps; light, camera, shafts and dust on ones.
- **Camera:** truck with the band of light; locked on one pane; pull back to the whole window; tilt down the shafts to the floor; hold through a crack; tilt up to a rose.

## 7. Transitions and rhythm

- **Transitions:** moving light, shafts, a crack, darkness. Never a dissolve, wipe or flip.
- **Shots:** 1.4–7.5 s.
- **Rhythm:** church modes, drones, open fifths, organum; free unmetred chant in darkness; one note meaning "the light" each time a pane wakes; a rising scale, one step per lit piece. Silence is a hard stop, reverb tails included, with only the glass's own ring or creak inside it.

## 8. Finish

- **Tone:** hue-preserving: scale by the brightest channel (ceiling 0.86, channel ratios raised to 1.3 to keep glass jewel-deep *(both proposed)*), blending to per-channel `1-exp(-x)` only at the very top, so the sun burns white while blue stays jewel blue.
- **Bloom:** bright glass eats into the lead: a blurred copy at 30 %, 14 px, screen *(proposed)*.
- **Spill:** colour on the stone round the opening: 42 %, 54 px *(proposed)*.
- **Floor:** the window's colour on the flagstones: blurred 20 px, about 20 % desaturated, mirrored, stone-modulated. Never a sharp decal.
- **Shafts:** additive, near 0 at the window, peaking about 40 % down; 14 % at peak *(proposed)*, with dust.
- **Unlit panes:** weak sky light, ghostly but readable.
- **Grain:** 0.026, vignette 0.5 *(proposed)*.

## 9. 3D look

None. 2.5D lighting in a 2D compositor, with the floor shown in perspective or top-down.

## 10. Banned

- Vector art with black outlines; flat clip-art fills.
- Kaleidoscope or Voronoi filters.
- Tiffany Art Nouveau; mosaic.
- Crosses, saints, halos or religious imagery: secular only.
- Morphing or bending glass.
- Fades-in: things are lit.
- Dissolves, wipes, flips.
- Generic piano or strings.
- A sharp decal-like floor patch; full-strength shafts at the window.
- Copying the references' characters, compositions, subjects or music.

## 11. Where it came from

- **Source:** Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT, original name "Stained Glass" (No. 20, Graphic & Type), read through `docs/research/styles/five-skills.md`, section Stained Glass, on 2026-11-06.
- **Taken:** palette, sun table, type, lead and glass rules, quarries, border, band of light, freeze rule, crack, banderole, carved titles, compositor rules, banned list.
- **Proposed here:** stone, parchment and floor hexes, sizes, curves and finish strengths, all marked above.
- **Changed for vertical:** the source is 1920×1080 with four lancets and a rose above. It was re-laid out, not cropped: one tall lancet fills the frame, the string course grows to carry stacked words, the banderole sits below it, the floor takes the foot of the frame, and stations stack as panels inside the lancet.
- **Left out of the previews:** figures and faces, cracks and re-leading. An SVG compositor stands in for the WebGL one.
