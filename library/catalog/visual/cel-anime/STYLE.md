---
name: style-cel-anime
description: Visual style "Cel Anime": late-80s cel animation played back on videotape; flat two-tone cels with hard shadow and highlight crescents and coloured lines over airbrushed painted plates (night city, dawn, day), neon glowing through the frame, a back-view heroine, chrome italic title cards with neon outlines, cream-yellow outlined subtitles, speed-line bursts, backlit meters, limited animation on twos and threes, scanlines and chroma bleed. Use when a video is made in this style.
---

# Cel Anime

## 1. In one line

A late-80s anime OVA on a CRT: a small cel-shaded heroine in a huge painted world, neon and sunrise light doing the
acting, a chrome title card, subtitles in cream-yellow. It suits night and city stories, mock opening titles,
journeys and deadlines, nostalgic explainers and music-led shorts.

## 2. Palette

Two worlds of colour: **plates** are painted (airbrushed gradients, atmosphere); **cels** are flat, few-colour and
saturated, each part with a fill, a shadow, a highlight and a line that is a dark version of its fill (never black,
except hard props). Every time of day is its own colour model, never a filter.

| Part (fill / shadow / highlight / line) | Hex | Where |
|---|---|---|
| skin | `#ffd9c4` / `#e2a395` / — / `#5a2e2e` | hands, the eye's lids |
| hair | `#4a3472` / `#2d1e4e` / `#8f74cc` / `#2e1850` | long hair, the angel ring (highlight) |
| jacket | `#2f6fe2` / `#1d45a2` / `#86b6ff` / `#112459` | jacket and sleeves |
| scarf (accent, the hero accent) | `#ff6b6b` / `#cf3d5b` / `#ffb6a2` / `#761b34` | the scarf; red light |
| teal (accent2) | `#1fc4b2` / `#12857c` / — / `#0b3e3a` | the skirt |
| chrome | `#dfe7f3` / `#646f90` / white / `#2b3350` | the air molecule |
| dark (hard props) | `#2b2d40` / `#181a26` / `#50546e` / `#08090f` | tights, shoes, rooftops, dashboards, skyline |
| iris | `#5b3fb0`, dark half `#2c1d66`, top band `#150a33` | the layered iris |
| lash / eye white | `#1c0f26` / `#fbf8ff` | the eye |
| neon | magenta `#ff4fa8`, cyan `#8ff4ff`, window gold `#e2b24e` / `#fff0b0` | signs, rim light, windows |
| subtitle (text) | `#fff0a0` | cream-yellow subtitles |
| second speaker (muted) | `#8ff4ff` | cyan subtitles and the boxed tag |
| outline | `#1a1030` | the subtitles' and titles' dark outline *(proposed)* |

**Lighting sets** (multipliers on fill / shadow / line, per channel): day 1 / 1 / 1; night lit (0.78, 0.74, 1.0),
shade (0.58, 0.52, 0.92), line (0.8, 0.7, 1.1); dawn lit (1.04, 0.9, 0.84), shade (0.86, 0.66, 0.8), line
(1, 0.8, 0.85); backlit lit (0.42, 0.3, 0.55): dark purple with a saturated rim.

**Plates** *(proposed hexes; the source names the moods)*: night city `#0e0b2e` → `#24185a` → `#5a2a86` → `#c0407e`
→ `#ff8a5c` at the horizon; dawn `#5d6bc4` → `#8e9ae0` → `#e89ab8` → `#ffc8a0` → `#ffe9a8`; day `#1f4fc2` →
`#3f7fe6` → `#8fc4ff` → `#dff0ff`; interior `#120f24` → `#1c1836`.

## 3. Typography

- **Subtitles:** Barlow Semi Condensed 600 (Google Fonts), 60 px (52–56 px for long lines), cream-yellow `#fff0a0`, a
  9 px dark outline painted under the fill and a soft shadow. Emphasis is italic. Sentence case, up to about 9 words,
  2 lines. A second speaker is cyan `#8ff4ff` with a small boxed tag ("● AIR MOLECULE", 38 px, 3 px border).
- **Titles:** Kanit 900 italic capitals (the demo's font set), 150–170 px (a number 300 px), leading 0.98, filled
  with a chrome gradient (sky `#9ee4ff` → pale → a white horizon line at 47% → deep violet → violet → pink → gold),
  a 14 px dark outline and a 26 px magenta neon outline that glows (18 px). A light band sweeps across; a four-point
  star glint lands at the end.
- **Tagline:** Barlow Semi Condensed 600 capitals, 40 px, tracking 0.42 em, cream with a magenta glow.
- **Signs:** generic words only (CAFE, BAR, HOTEL) in Kanit 800 with neon glow; never brands.
- **Smallest text:** 32 px. Subtitles sit low (y ≈ 1324–1470).

## 4. Layout

- **Margins:** 72 px. **Safe zone:** 230 px top, 330 px bottom; subtitles start at y = 1336 and stay above 1470.
- **Signature composition:** a small flat heroine in a huge painted world. She is always seen from behind (or
  backlit), standing on a rooftop at the bottom of the frame, her head below the subtitle band.
- **Title cards** fill the upper half (y 300–860), centred, with the tagline under them.
- **Medium shots** crop her at the feet; the end shot is a big back view pointing at the sky.
- **Cuts in a list** are framed panels (936 × 380, 6 px dark border) stacked with their subtitle inside.

## 5. Elements

- **Cel shading:** fill → a hard shadow crescent (the shape minus itself shifted 10 × 8 px toward the light) → a
  hard highlight crescent (minus itself shifted 5 × 4 px away) → a saturated rim light 3 px wide where it's backlit →
  a coloured line 2.6 px. No gradient inside a cel.
- **The heroine** (invented): long purple hair with uneven sharp tips over a darker under-layer, a continuous angel
  ring with a zigzag lower edge, a blue jacket, a teal skirt, dark tights, a red scarf whose two tails ride a
  travelling sine (a 4-drawing cycle on twos). Never a front view.
- **Plates:** painted once with gradients and atmosphere; skylines of dark blocks with gold windows; neon signs
  glowing; a dark rooftop with a railing in the foreground.
- **Light FX:** the sun with a star-burst flare, an anamorphic streak across the frame and hexagonal ghosts through the
  centre; light trails; radial speed lines (tapered wedges) for anything bursting outward; a four-point glint.
- **Light moves, drawings hold:** coloured bands sweep across a held cel (masked to the character).
- **HUD:** backlit segmented level meters in a dark dashboard.
- **The 80s eye** (for extreme close-ups): almond lids, a thick upper lash flicking outward with 2–3 separate lashes,
  a tall oval layered iris (top dark band → dark upper half → main colour → bright lower crescent), one large and one
  small highlight, a long thin brow.

## 6. Motion

- **On twos and threes:** characters on twos (12 drawings a second), performance beats (blinks, eye openings, lip
  flaps, gestures) on threes (8); camera, light sweeps, flares and rain on ones.
- **Cycles:** hair and cloth as ribbons on a travelling sine, a 4-drawing cycle (6 when calm).
- **flicker:** titles flicker on at 12 fps over 0.42 s, then hold; **sweep:** the light band crosses in 1.1 s
  (ease-in-out); the glint lands on a hit.
- **streak:** a light trail draws in over 0.5 s (ease-out); **burst:** speed lines shoot out over 0.35 s.
- **Impact frames:** 2 frames of an inverted or monochrome silhouette over radial lines, then the result.
- **Peak:** radial speed lines → a one-beat freeze + white flash → impact frame → a painted still with a slow pan →
  landing with sparks and camera shake.
- **Camera:** multiplane crane (foreground faster), side tracking with 3–4 parallax layers, a held bust with light
  bands, a slow pan across a painted still, a delayed tilt with a quadratic climb, a truck-in through a window.
- Subtitles cut on and hold at least max(1.9 s, speech + 0.6 s); a line yields to the next.

## 7. Transitions and rhythm

- Cut on bars (the source's demo: 116 BPM, a bar = 2.069 s). Transitions: hard cuts, white flashes, impact frames,
  tracking noise at a tape moment. No digital dissolves or wipes.
- One beat of true silence before a peak.

## 8. Finish

- **Videotape + CRT:** chroma bleed (the red channel shifted 2.5 px and smeared 1.6 px sideways), scanlines on a 4 px
  period at 18% *(source: 3 px at 1920×1080; 4 px keeps them clean on the half-size previews)*, corner darkening 28%,
  faint signal noise (grain 0.025).
- **Glow:** strong on emissive things (neon, windows, the sun, light trails), never through a character.
- In finished videos the source also uses an RGB grille (±0.06) and phosphor glow (0.35); the previews omit them.
- No gate weave, dust, scratches or misregistration.

## 9. 3D look

None. Pseudo-3D only for canyon and rear-view shots (2D projection).

## 10. Banned

- Moe anime (round faces, giant irises, hatched blush); vector clip-art (uniform black lines, gradients in cels).
- Film artefacts (gate weave, dust, scratches); pure-black lines except on hard props.
- A colour filter as a time-of-day change; digital dissolves or wipes.
- Any existing work's characters, mecha, logos, place names or signature shots; brand names on signs.
- Front views of faces where a back view, a visor or backlight will do; thick rim light on thin shapes.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 27 "80s Cel Anime (OVA on a CRT)"
  (`styles/cel-anime-80s/STYLE.md`, `DEMO.md`, colour models in `demo/pal.js`); demo film and stills CC BY 4.0
  (LemoLab). Read through the research notes `docs/research/styles/five-skills.md`, section "80s Cel Anime". The
  source draws on canvas with a WebGL CRT pass; this is rebuilt with React, SVG masks and CSS in Remotion.
- **Taken:** every part's colour model (skin, hair, eye, jacket, scarf, teal, chrome, dark, neon, subtitle, second
  speaker), the night / dawn / backlit lighting multipliers, the cel-shading method (shape minus shifted shape for
  shadow and highlight, a saturated rim), coloured lines, the 80s eye and hair rules (uneven tips, angel ring),
  Barlow Semi Condensed 600 cream-yellow subtitles with a 9 px outline, Kanit and the chrome-gradient italic title
  with dark and neon outlines, flicker-on at 12 fps with a light sweep and a star glint, the spaced tagline, generic
  sign words, flares (star-burst, anamorphic streak, hexagonal ghosts), radial speed lines, HUD meters, timing on
  twos and threes, the 4-drawing cloth cycle, impact frames, the camera vocabulary, cuts on bars with no dissolves,
  the CRT values (scanline strength 0.18, chroma shift ~2 px with ~7 px horizontal smear, corner darkening 0.28) and
  the banned list.
- **Proposed:** the plate hexes (the source's plates live in a file the research didn't read), the outline colour,
  the heroine's design (shapes invented for the back view; the source's head model wasn't read), the spectrum light
  band, the scanline period (4 px), the chroma blur radius, every px size, the sample scenes.
- **Changed for vertical:** 16:9 (or a 4:3 pillarbox) became 9:16: subtitles move from ~96 px above the bottom to
  y ≈ 1336 (above the platform zone), the title card fills the upper half in 2–3 short lines instead of one wide
  line, the heroine stands lower and smaller so the subtitles never cover her, lists become stacked 936 × 380 cuts.
- Added to the catalog on 2026-10-31.
