---
name: style-keynote-glass-blue
description: Visual style "Keynote Glass Blue": a keynote-style sting in soft white and bright blues where the camera never rests; blue haze, four coloured squares locking into a cross round an app icon, answer pages in grey with one black key phrase, frosted glass over sky-blue wallpapers with thin white line art, huge frosted titles cut by card edges, hard cuts on the beat, and a black end card whose wordmark is the only glow. Use when a video is made in this style.
---

# Keynote Glass Blue

## 1. In one line

Bright, crisp and always moving, like a product keynote sting: soft white pages, sky-blue wallpapers, frosted glass,
directional smears and hard cuts placed exactly on the music. It suits launch stings, feature teasers, hooks and
short punchy facts.

## 2. Palette

Every value is the source's.

| Role | Hex | Where |
|---|---|---|
| background (page) | `#fdfdfb` | the main white page |
| text | `#05060b` | titles and the key phrase (measured from the run; the source says "black") |
| muted (body grey) | `#bcbcba` | answer-page body, sub-captions |
| faint (rim) | `#e8e8ea` | the 1 px rim of discs and light cards |
| surface (window) | `#fcfdff` | light windows, caption cards; top band `#f1f6ff` |
| haze → ice | `#b7cfeb` → `#e6f0fa` | the opening blue haze; floor glow `#dbeefd` along the bottom |
| sky gradient | `#294376` → `#769cc2` | wallpapers and card images |
| navy | `#1e2f52` | the app icon's gradient end |
| accent (blue) | `#2f6bff` | the send button, the top orbit square, dots, a title's key word |
| accent2 (cyan) | `#3cc8f0` | an orbit square, dots, scattered light |
| mint | `#4ed6a0` | an orbit square, dots |
| capsule | `#2f2e2f` | the dark capsule pill |
| hover ring | `#d5f3ff` → `#f7feff` | the ice ring round a hovered disc |
| flash | `#e2f4fe` | the whip-tilt flash |
| halo | `#e9e9e7` | the grey disc behind the app icon |
| end card | `#020204` corners → `#272729` centre; word `#f3f3f5` | the black radial end card |

- **Banned colours:** no purple, violet, magenta or orange anywhere.

## 3. Typography

- **Face:** Inter 400 / 500 / 600 / 700 (Google Fonts).
- **Answer pages:** body Inter 400 grey at **47 px on a 58 px pitch**; the one key phrase is black 600. Headline lines
  on the same page 66 px on an 80 px pitch *(proposed)*; section title 52 px 600 *(proposed)*.
- **Card captions:** semibold 38 px, with a grey sub-caption (23 px in the source, raised to 26 px).
- **Titles:** Inter 600 up to 92 px, the key word in accent blue *(proposed)*; a header name in Inter 500 beside a
  ⌀132 disc and a capsule pill is the source's lockup.
- **Frosted titles:** huge bold (Inter 700, 300–400 px), cut off by the card's bottom edge, filled with a blurred,
  lightened copy of the card image.
- **Menu-bar clock:** 34 px. **End wordmark:** Inter 600, zoom-smearing in from ≈1650 px wide to ≈516 px (84 px type
  in vertical *(proposed)*).
- Smallest text 24 px.

## 4. Layout

- **The source is a square stage** with every coordinate given (header lockup x474–1063; glass box 726 × 228 at
  x196–922, y568–797; cards 538 × 348, radius 57, 36 px gap). Vertical keeps the same widths on the 1080-wide frame
  and re-stacks vertically: cards become 888 wide, the glass box stays 726 × 228 and sits low, lists stack cards with
  the 36 px gap.
- **Margins:** 96 px; answer pages left-aligned, titles and end card centred.
- **Safe zones:** 230 px top, 330 px bottom.
- The camera zooms about the frame centre.

## 5. Elements

- **App icon:** a squircle (276 → 178 px, radius 28% of its width, navy gradient) on a grey halo disc, with a generic
  glyph in thin white line art (never a real brand's icon). **Four 92 px squares** (radius 26: blue, cyan, mint,
  white) orbit and lock into a cross at a radius of about 216.
- **Light app window:** radius 93. **Logo disc:** ⌀132, rim `#e8e8ea`, ice hover ring.
- **Wallpaper:** the sky gradient with thin white line art: a circle, lines, a four-point sparkle. In diagrams the
  line art *is* the diagram.
- **Frosted glass box:** radius 60, a bright top rim, a ⌀51 accent send button, a caret always on.
- **Sky cards:** radius 57, a translucent pill top-left, a white caption card, the frosted title along the bottom.
- **Cursor:** a generic arrow 32 × 39, black with a white outline; it rotates to face its direction of travel and
  grows ×1.55 on hover.
- **Capsule pill:** `#2f2e2f` with white 600 text.

## 6. Motion

- **enter** ("already moving"): every shot enters on an exponential ease-out covering **12–19% of the remaining
  distance per frame** at 29.97 fps. That is exactly expo-out over **1.1 s (19%) to 1.81 s (12%)**; 1.42 s (15%) is the
  default *(conversion: duration = 10·ln2 / (fps·−ln(1 − r)))*.
- **exit:** shots leave on an accelerating move (`cubic-bezier(0.55, 0, 1, 0.45)` over 0.3 s *(proposed)*) or a blur
  ramp (`24 → 1.5 → 0` px in, `0.3 → 6` px into a cut).
- **Blur follows speed and direction** on every move (SVG `feGaussianBlur` with separate x and y deviations).
- **Exact tables from the source:** the header rises `y932 (f0) → 776 (f2) → 683 (f5) → 608 (f10) → 546 (f24) → 536
  (f37)`, then drifts 1 px per frame; scroll settles through offsets `420, 315, 210, 170, 140, 116, 96, 81 … 0` px, one
  per frame.
- **glass** (the box's width spring): peaks 744 at f126 and settles to 726 by f138, i.e. 2.5% overshoot settling in
  0.4 s → z ≈ 0.76, w ≈ 12.1 → stiffness 147, damping 18.4, mass 1 *(derived here from the source's frames)*.
- **Typing:** about 1 char per frame with a 1-frame hold every 2–3 chars; the caret is always on.
- **Whip-tilt:** about 25 px per frame with a 6–8 px vertical blur, through the light-blue flash.
- **orbit:** the squares spiral in and lock, expo-out over 1.6 s *(proposed)*.
- **hover:** the cursor grows ×1.55, expo-out 0.5 s *(proposed)*.
- **The only freeze** is a short hold on the logo disc; otherwise nothing ever stops (a 1 px/frame drift after every
  settle).

## 7. Transitions and rhythm

- **Tempo 124 BPM:** beat k = 0.048 + 0.4838·k s (14.5 frames per beat).
- **Hard cuts** land **2 frames before a beat**, on the music drop; blur-dissolves happen at the blur peak; other changes
  are whip-tilts through the light-blue flash. No crossfades.
- **Length:** about 12 s (the source's audio is exactly 12.075 s, drop at 2.47 s).
- **Sound:** whooshes peaking at the cuts, clicks on presses, key ticks about every 32 ms while typing; master at
  −14 LUFS, −1 dBTP.

## 8. Finish

- **Frosted glass:** a blurred (26 px *(proposed)*), lightened copy of what is behind, clipped to the shape, with a
  bright top rim.
- **Directional blur** on moves; **end-card zoom smear** of 20–30 scaled, faded copies of the word (24 used).
- **Glow:** only on the end wordmark (a tight glow plus a wide soft halo). No grain, no vignette.

## 9. 3D look

None.

## 10. Banned

- Purple, violet, magenta or orange.
- Crossfades.
- Frozen frames (except the one disc hold).
- Stock UI kits.
- Glows on UI text (the end wordmark is the only glow).
- `Math.random`: every random value is seeded.
- Anything template-like.
- A camera that rests.

## 11. Where it came from

- **A creator's launch-video prompt on prompt-motion.com** (https://prompt-motion.com/notdwd-7de38a; a near-identical
  version at `/notdwd-c2037d` maps brand colours onto the same roles), read through
  `docs/research/styles/barty-bart-and-prompt-motion.md`, section "Keynote Glass Blue Sting"; the run's contact sheet
  was looked at and frames were sampled for the text colour. **Licence: none stated; the prompt belongs to its
  creator.** Its rules are described here in our own words; no prompt text, code, logos or product UI are copied.
- **Taken (as values and rules):** the full palette and the colour bans, Inter and its sizes, element sizes (icon,
  squares, orbit radius, disc, window, glass box, cards, cursor), the "already moving" entry rate, exits and blur
  ramps, the motion tables, typing, whip-tilt, the glass box's overshoot, 124 BPM with its beat formula, cut placement,
  audio targets, frosted glass, directional blur, the zoom smear and the single glow.
- **Proposed:** headline and section sizes on answer pages, the title size and its accent key word, the end word size,
  the exit curve, orbit and hover durations, the glass blur amount, the glass spring's w and z (derived from frames).
- **Changed for vertical:** the source is square (1080 × 1080). Widths are kept on the 1080-wide frame and elements
  re-stack vertically; sub-captions rise from 23 to 26 px. The source's menu bar, course and brand content are
  replaced by the sample's science; the app icon carries a generic sky glyph.
- Added to the catalog on 2026-10-31.
