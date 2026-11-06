---
name: style-neural-console
description: Visual style "Neural Console": a vertical sci-fi control screen. A rounded, feathered console field on deep navy-black with a 74 px grid, a glowing cyan ring hub with a magenta second ring, dashed network paths with popping nodes, scrolling mono logs, a glass status card with meters and cells, scanlines and a scan beam. Cyan means short (blue) waves, magenta long (red) ones. Use when a video is made in this style.
---

# Neural Console

## 1. In one line

The machine's own screen, booting up and reading the world: a cool, glowing, deliberately maximal control console.
It suits AI and tech explainers, "system online" intros, data and stat reveals, cyber hooks, and science facts told
as a machine's reading. It is a deliberate HUD look (glow, rings, readouts), unlike the engine's quiet styles.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (void) | `#03050d` | the void outside and at the edges of the console field |
| surface (void soft) | `#09111f` | the field's centre (a radial to the void); glass card fill at 60% |
| text (paper) | `#eafcff` | headlines, status titles; body copy at 72% |
| muted | `#d2f1f7` | small labels and log lines, always at 48% |
| faint (core deep) | `#087c9c` | the 74 px grid at 18%; the meter gradient's start; idle cells |
| accent (core) | `#00e5ff` | rings, labels, network paths, meters, emphasis words |
| accentHot (core hot) | `#c6faff` | dust motes, node fills, the metric and the hub's core label |
| accent2 (secondary) | `#ff2bd6` | the second ring, log emphasis, the meter's other end |
| accent2Hot | `#ffc4f3` | magenta nodes and values |
| orb | `#6c43ff` | one blurred depth orb at 4.5% only |

- **Meaning:** in a science video, cyan carries the short or "first" thing (blue light, the main value) and magenta
  the long or "second" thing (red light, the comparison). Keep the meaning for the whole video.
- **Glow belongs to the system:** rings, nodes, meters, the metric and emphasis words glow; paper headlines get only a
  faint 18 px cyan halo.
- The source ships four alternate palettes that swap the same roles (emerald, ultraviolet, solar, ice). Solar is
  orange and would collide with the orange broadcast HUD: don't use it in this catalog.

## 3. Typography

- **Display:** Arial 700 (Arimo from Google Fonts when Arial isn't installed; it has Arial's metrics), tracking
  −0.045 em (the source's −0.04 to −0.06), leading 1.02, sentence case.
  - Titles 112 px, headlines 92 px *(proposed: the source has no headline bigger than its 44 px core label)*. Lower
    the size so the longest line fits the 908 px column.
  - Emphasis: the word in core cyan with a glow (0 0 8 px at 70%, 0 0 24 px at 45%). The emphasised words take a line
    of their own.
- **Hub core label:** 44 px Arial 700, core hot, glowing. The hero metric inside the hub is 150 px *(proposed; the
  source's metric is 48 px with a 24 px glow)*; an end line inside the hub 92 px *(proposed)*.
- **Brand title** (header): 35 px Arial 700 caps, tracking 0.12 em *(proposed)*.
- **Status title** (cards): 34 px Arial 700 *(raised from 30 px)*.
- **Body:** 30 px Arial 400 in paper at 72%, line height 1.35 *(proposed)*.
- **Labels:** Consolas 600 (Inconsolata from Google Fonts when Consolas isn't installed), 24 px *(raised from
  9–13 px)*, caps, tracking 0.22 em (the source's 0.17–0.29), core cyan or muted at 48%.
- **Logs:** Consolas 24 px on a 40 px line *(raised from 12 / 29 px)*, muted at 48%, a cyan `›` prompt, values in core
  hot or magenta.
- **Smallest text:** 24 px. **Words:** at most about 10 words of headline on screen.

## 4. Layout

- **The console field** is inset 34 px top, 28 px at the sides, 30 px at the bottom, radius 54, a hairline cyan edge
  at 16%; its grid and noise are feathered by a radial mask (clear in the centre, fading at the edges).
- **Margins:** 86 px (the source's header x); a 908 px column.
- **Header** at y = 262 *(moved from y 102 to sit inside the 230 px safe top)*: octagon mark, brand title, a mono
  label on the right, a hairline under it.
- **Hub:** 620 px across (r 310) centred at x = 442, left of centre, with the **log column** at the right (66 px from
  the edge, 258 px wide). A hub may move to the centre when it is the hero (a number, the end card).
- **Glass status card:** x 122, 836 px wide, radius 34, its bottom 340 px above the frame's bottom *(raised from
  190 px so its text stays inside the 330 px safe bottom)*.
- **Safe zone:** 230 px top, 330 px bottom; the right-hand log column is decorative and may sit under the platform
  buttons.
- **How full:** dense on purpose. A frame carries the header, one hero module (hub, network, panel) and one support
  module (logs or card). Never two heroes.

## 5. Elements

- **Grid:** 74 px, core deep at 18%, feathered. **Noise:** a fractal-noise layer at 14%. **Depth orbs:** three
  blurred discs (blur 132–158 px, opacity 4.5–7.5%: cyan, magenta, violet).
- **Dust:** 30 motes, 2–4 px, core hot, rising 74–164 px over 7 s.
- **Ring hub:**
  - outer ring dashed 4/15, 2 px, cyan at 55%;
  - a solid 8 px arc (dash 510/1170) in cyan over a core-deep track at 35%;
  - a magenta second ring, 3 px, dash 114/38/24/72;
  - an inner ring at 61% of the radius, 1.5 px at 30%;
  - four core-hot nodes riding the outer ring;
  - stacked glow 2 / 10 / 35 / 90 px.
- **Network paths:** dashed 8/12, 1.7–2.7 px, cyan (or magenta for the second meaning), drawn from source to target.
  The incoming beam is a solid paper line. **Nodes:** core-hot dots inside a 18% halo; a source node sits in an
  octagon "satellite".
- **Logs:** a scrolling column of short true readings (`› blue  450 nm`), faded at the top and bottom.
- **Glass status card:** void soft at 60%, 1 px cyan border at 22% (60% and a glow when active), backdrop blur 18 px.
- **Meters:** 8 px, radius 4, a cyan track at 14%, filling core deep → core (or → magenta), glowing.
- **Cells:** 18 px squares, 8 px apart, popping on one after another.
- **Scanlines** at 19% (2 px every 6 px), a **chroma tint** at 8.5% (cyan top-left, magenta bottom-right, screen
  blend), a **scan beam** (a soft 220 px band, cyan at 4% rising to 8% near its leading edge and fading out, never a hard
  line) sweeping down the field *(proposed values)*.

## 6. Motion

GSAP names in the source; the curves here are their cubic-bezier equivalents.

- **field:** fades in from scale 1.025, power3.out `[0.25, 1, 0.5, 1]` 1.05 s.
- **header:** from y −32, expo-out 0.72 s at 0.16 s; the **mark** from scale 0.35 and −12°, back.out(1.65)
  `[0.34, 1.6, 0.64, 1]` 0.68 s.
- **copy** (headline words, labels): rise 24 px with blur 6 px → 0, expo-out 0.72 s, 0.09 s apart.
- **hubIn:** from scale 0.6 and blur 6 px to 1.15, expo-out 0.78 s; **hubSettle** to 1, power2.out 0.34 s.
- **rings:** turn 356° over 6.12 s, power1.inOut (the outer ring at half speed, the magenta ring backwards).
- **path:** draws over 1.25 s power3.inOut, dashes flowing (offset 170 → 0), 0.08 s apart; **node:** pops with
  back.out(2) 0.4 s, 0.11 s apart.
- **logs:** scroll 612 px over 5.92 s, linear (constant speed is the point).
- **card:** from y +58 and scale 0.96, expo-out 0.82 s. **meter:** fills over 1.18 s power4.out. **cell:** pops with
  back.out(1.4) 0.3 s, 0.08 s apart.
- **scan:** the beam sweeps down over 5.52 s, power2.inOut. **orbs:** drift 30–42 px and scale to 1.09 over 7.2 s,
  sine.inOut. **dust:** rises over 7.05 s, linear.
- **pulse:** once at the end, the hub and the metric swell 4–5% and back in 0.3 s.
- **out** *(proposed; the source has no exit)*: fade, power2.in 0.4 s.
- **Holds:** 1.5 s after the last element lands. Type never moves once it has landed; the system keeps running
  (rings, logs, beam, dust).

## 7. Transitions and rhythm

- **One continuous build per shot, no cuts inside:** layered entrances over the first ~2.7 s (field, header, hero,
  support), then the system runs and the shot ends on one pulse. The source shot is 8 s.
- **Between shots** *(proposed)*: the console stays; only the hero module changes. The old module fades out (0.4 s),
  the new one builds in. The field, header and grid never cut.
- **Stagger:** copy 0.09 s, paths 0.08 s, nodes 0.11 s, cells 0.08 s.

## 8. Finish

- Noise 14% (grain 0.016 in the kit's overlay), scanlines 19%, chroma tint 8.5%, vignette to 87% black at the edge.
- Glow: stacked drop shadows (2 / 10 / 35 / 90 px) on the hub, nodes, meters and the metric.

## 9. 3D look

None (one perspective of 900 px on the hub in the source).

## 10. Banned

- Orange, amber or red as a colour: the console is cyan and magenta (and the faint violet orb) only. That is what keeps
  it apart from the orange broadcast HUD.
- Corner brackets, viewfinder marks and timecodes: this is a rounded, feathered screen, not a camera.
- Invented telemetry: every log line, metric and meter value is true.
- Flat, unlit system graphics: rings, nodes and meters carry their glow.
- Type that moves once it has landed.
- A third accent hue; violet anywhere but the faint depth orb.
- Text in the bottom 330 px or above the safe top line.
- Cuts inside a shot.

## 11. Where it came from

- **NullMotion's "Cinematic Neural HUD"** (`NullMotion/public/27-cinematic-hud-overlay/index.html`; not in the
  approved catalog), researched in `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Neural HUD (NullMotion
  page outside the catalog)". Licence: MIT. No code was copied.
  - Taken: the whole "cyber" palette; the field inset and radius, the feathered radial mask; the 74 px grid at 0.18,
    noise 0.14, depth orbs, 30 dust motes; ring dash patterns and widths; network paths (8/12, 1.7, 0.42) and node
    pops; the 8 px meter; scanlines 0.19, chroma tint 0.085, vignette 0.87; the stacked glow; the hub, log column and
    card positions; the brand, core, status and log sizes; every timing and ease of the 8 s timeline.
  - Substitutes: Arial → Arimo, Consolas → Inconsolata, used only when the system fonts are missing.
  - Changed for vertical and the safe zones (the source is already 1080×1920): the header moved from y 102 to 262; the
    card's bottom from 190 to 340 px; labels 9–13 → 24 px, logs 12 → 24 px on a 40 px line, status titles 30 → 34 px.
  - Changed to stay apart from the catalog's orange broadcast HUD (`hud-detection`): the source's 72 px corner
    brackets and its clock are dropped, and the solar alternate palette isn't used.
  - *(Proposed):* the 112 / 92 px headlines, the 150 px metric and 92 px end line inside the hub, body copy, the
    colour meanings (cyan = short / blue, magenta = long / red), the exit, the between-shot rule, and the sample
    modules (spectrum meter, scattering network, sequence panel). The log lines are rewritten as true readings of the
    sample content.
- Added to the catalog on 2026-10-31.
