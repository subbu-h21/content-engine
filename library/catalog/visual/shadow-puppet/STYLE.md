---
name: style-shadow-puppet
description: Visual style "Shadow Puppet": shadow theatre on a lamp-lit cotton screen. Translucent dyed-hide puppets carved like lace (crescent rows, diamond lattice, coin holes, slits) are pressed onto the cloth from behind, so their colour is transmitted lamp light and overlaps darken; jointed figures on thin rods with a slow hand tremor; plaques of dark hide with the words cut out so they glow; a red-and-black lacquer stage frame with gold clouds; a storyteller's dark placard for the words. Use when a video is made in this style.
---

# Shadow Puppet

## 1. In one line

A theatre of light: one oil lamp behind a cotton screen, carved and dyed hide puppets pressed against it, colour
glowing through them, and the story told on lacquer placards. It suits myths and folklore, heritage and festivals,
fables with good and bad actors, "who pulls the strings" stories, and warm storytelling explainers.

## 2. Palette

All colour is transmitted light: nothing is brighter than the lamp, every hue leans warm, overlap is darkness.

| Role | Hex | Where |
|---|---|---|
| background (lit cloth) | `#f0bf78` | the screen at its brightest, lamp light through cotton *(proposed hex)* |
| text (cream) | `#f3e2bf` | placard text; the light seen through cut-out letters |
| muted (raw hide) | `#e2bd80` | undyed pieces, heads |
| faint (warm vignette) | `#b37840` | the cloth's edges (never a grey vignette) |
| accent (vermilion dye) | `#b8211a` | costume pieces, plaque borders, seals, red light |
| accent2 (indigo dye) | `#22647e` | water, sky, scattered blue light (it reads teal through warm light) |
| flame / ochre / gold | `#d9541c` / `#dc9d1e` / `#c98a26` | suns and fire / sunlight, sleeves / the ground strip, carved gold |
| malachite / jade | `#236e3a` / `#2f8a5c` | robes and corner roundels / a second molecule |
| ink | `#1a100a` | carved outlines, boots, hands, plaques |
| shaft | `#4a2612` | rods and thin things that must read |
| lamp / bloom | `#ffc475` / `#ffd199` | the lamp's light and its warm bloom |
| lacquer / lacquerBlack / placard | `#7a1a12` / `#140b07` / `#2a160c` | the stage frame, the dark room, the placard *(proposed)* |

- **3–5 saturated dyes + raw hide + ink per scene.** Brightness comes from lamps, never from grading; night = fewer
  lamps, never added blue. Example sets: court (vermilion, ochre, malachite), river (indigo, jade, one ochre),
  harvest (flame, gold, one green).

## 3. Typography

- **Plaques:** Cinzel 700 caps (carved capitals), letters cut out of dark hide so they glow with the lamp; 64–104 px,
  numbers 250 px, tracking 0.06 em, leading 1.18. Plaques are puppets: carried on rods, pressed on to enter, lifted off
  to exit.
- **The storyteller's placard:** Cormorant Garamond 600, 48 px, cream `#f3e2bf`, centred on a narrow dark-lacquer
  board (93%) with a thin gold inner line and a small vermilion seal on the left; it slides up 18 px in 0.22 s and
  sits just above the screen's bottom edge. Small label tags (40 px) use the same board.
- **Emphasis:** a word on its own plaque; the plaque's seal. **Words:** about 8 at most. The smallest text is 32 px.

## 4. Layout

- **The stage frame is always there:** a red lacquer lintel (y 0–190) with gold cloud curls, lacquer pillars on both
  sides (56 px), a bottom rail, and the blurred heads of the audience below (y 1740–1920). The screen is
  x 56–1024, y 190–1740.
- **Puppets in profile;** most of the cloth stays empty lit space. Scenery is one carved piece per element; a narrow
  carved ground strip at the bottom.
- **The plaque** sits high on the screen (y ≈ 270–600); the placard low (above y ≈ 1680); words stay inside 230 px top
  and 330 px bottom, and off the right-hand 120 px.
- **Centred** plaques and placards; puppets placed by the story.

## 5. Elements

- **Hide pieces:** dyed and translucent (90%), multiplied onto the lit cloth; carved through a mask with crescent
  rows (scales), diamond lattice, coin holes (a round hole with a square of hide left inside), tapered slits, teardrops
  and cloud-scroll cuts; a dark carved outline (2.2 px) on every region. Carving is density: thin strips, much cut away.
- **Jointed puppets** (8–12 pieces): head about 1.2× natural with large headwear (about a quarter of the figure),
  sleeves a different dye from the robe, round joints with rivets (a dark ring and a pale knot), held objects as
  separate pieces. Sympathetic figures have open-cut faces (the face is a hole framed by the profile's strip);
  antagonists have solid faces.
- **Rods:** thin soft lines (3 px, 45%, slightly blurred) from the neck and a hand to below the screen.
- **The sun:** a flame-dye disc with hooked flame tongues (fat base, belly, hooked tip, alternating curl), a coin hole
  at its heart, teardrops between the tongues.
- **Light, fire, water** are carved pieces on rods (strips with slits), never particles.
- **Plaques:** dark hide with cut-out letters, a vermilion border with a meander band, malachite corner roundels with a
  cloud-scroll cut, a small vermilion seal.

## 6. Motion

- **pressOn:** a puppet arrives from behind the cloth: scale 2.6 → 1 and blur 34 → 0 px over 0.55 s (expo-out),
  snapping sharp. **liftOff:** scale ×1.9, blur +30 px and fade over ~0.9 s.
- **Hand tremor** on every puppet: ~3 px and 0.018 rad of slow noise (×1.8 under tension). The cloth and the frame
  never move.
- **Operatic phrasing:** shuffling run → hop → crouch → freeze on a percussion accent (~1 s, only loose parts quiver)
  → head turn. Faces never change: attitude is head angle and body tilt.
- **Lamps:** a new lamp flares with overshoot (a spring, damping 8, stiffness 120); a snuffed lamp gutters and goes out
  over 0.35 s. The lamp flickers ±6% (slow noise at ~7 Hz plus a small 23 Hz ripple).
- **Placard:** slides up 18 px in 0.22 s, shown from the line's start until speech + 0.8 s.
- **Nothing morphs:** pieces rotate on rivets, slide on rods, or are swapped (swapped effect pieces step on twos).
- **Camera:** the audience seat (whole stage), a push through the frame onto the cloth, a lateral pan, a crash zoom of
  a few frames on a percussion hit, a close on a carved detail, a pull back into the dark room.

## 7. Transitions and rhythm

- **Transitions:** lamps dimming, a blurred foreground pillar wipe, a piece lifting off into light, a flash to warm
  white. Never a generic crossfade or digital wipe.
- **Rhythm** from gong and drum: one hit per visual step, accelerating rolls into an entrance, one big gong per
  decisive hit, a hard stop into silence.

## 8. Finish

- **The cloth:** the lamp's broad lobe (~700 px) and hotspot (~120 px), a fine weave, low-frequency density blotches,
  a warm vignette (`#b37840` to 55%, multiplied), a warm bloom round the hotspot (screen).
- Exposure 1.75 / √(lamps lit) per lamp; film grain 0.02. No white or blue light.

## 9. 3D look

None.

## 10. Banned

- A black silhouette film (colour is the second protagonist).
- Paper-cut (light comes through the hide, not around it); stained glass (no lead lines); flat vector cut-outs.
- Particles for fire, smoke or water; morphing.
- White or blue light; a grey vignette.
- Pale thin pieces (they vanish).
- A generic crossfade or digital wipe.
- Reproducing a specific historical puppet, play, melody or recording, or naming one.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**, style 07 "Shadow Puppetry" (`styles/shadow-puppet/STYLE.md`,
  `DEMO.md`), researched in `docs/research/styles/five-skills.md`, section "Shadow Puppetry". Its demo films and
  stills are CC BY 4.0; none were used.
  - Taken: every dye hex (vermilion, flame, ochre, gold, malachite, jade, indigo), raw hide, ink, shaft, lamp,
    bloom and warm vignette (converted from the engine's RGB), the placard cream; transmitted colour, overlap as
    darkness, brightness by lamps, 3–5 dyes, the example sets; the placard (dark lacquer, gold line, seal, Cormorant
    Garamond 600 cream, 18 px slide in 0.22 s); plaques with cut-out letters, a carved red border with a meander band,
    green cloud-scroll corner roundels and a seal, carried on rods; puppets in profile on empty cloth with a carved
    ground strip; the lacquer frame and lintel with gold cloud curls; the jointed puppet recipe (8–12 pieces, big
    headwear, rivets, sleeves in another dye, open-cut faces for sympathetic figures); the carving vocabulary; fire and
    water as carved pieces; press on (2.6 → 1, blur 34 → 0, 0.55 s) and lift off; the tremor; operatic phrasing; lamp
    flares and flicker; the camera vocabulary; the transitions; the rendering idea (lamp × hide × cloth, lobe and
    hotspot); the bans.
  - **Rebuilt for Remotion:** the WebGL compositor becomes SVG: the cloth as radial gradients and a weave pattern, the
    hide as multiplied masked shapes, the bloom and vignette as gradients, press-on with a CSS blur.
  - **Font:** the source doesn't name the plaque face; Cinzel 700 was chosen for carved capitals that stay readable when
    cut out; the seal's 说 character was replaced by simple carved lines.
  - **Changed for vertical:** the source is 1920×1080 with a wide stage; here the stage is a tall proscenium
    (lintel on top, the audience below), the plaque sits high and the placard low, words are bigger (plaques 64–104 px,
    the placard 48 px instead of 46 px at 1080 high), and each scene holds one puppet group.
- *(Proposed):* the lit-cloth, lacquer, black and placard hexes; Cinzel; type sizes; the lamp positions; the curves;
  the figure's proportions; the sample scenes (a scholar looking up at a carved sun under the question plaque, a sun
  throwing carved rays of every dye, an ochre beam into two carved discs with indigo shards and a vermilion strip
  going on, the number cut from a plaque over two bars in the true 5.9 : 1 ratio, three carved medallions, the end
  plaque).
- Added to the catalog on 2026-11-04.
