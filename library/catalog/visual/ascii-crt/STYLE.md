---
name: style-ascii-crt
description: Visual style "ASCII CRT": everything is a real glyph on a monospace grid lit by the amber phosphor of an old monochrome tube; VT323 typed in capitals, brightness and inverse video for emphasis, ASCII pictures from a density ramp, banner numerals, a LOG strip for captions, one soft blue for one thing only, scanlines, bloom and a rounded glass edge. Use when a video is made in this style.
---

# ASCII CRT

## 1. In one line

A message coming through an old amber terminal: every picture, word and number is typed or built from characters on
a grid, and the only camera is the size of the grid. It suits developer tools, launches and logs, a machine or a
remote operator as narrator, messages across distance or time, and facts told as program output.

## 2. Palette

One phosphor carries everything in its own brightness ramp. Brightness is the only tool: dim 0.42, normal 0.7,
bold 1.0, plus inverse video. One soft second colour for one thing only, switched on once on a downbeat and not
taken back.

| Role | Hex | Where |
|---|---|---|
| background (unlit glass) | `#090604` | the ground of every frame; the text colour inside inverse-video blocks |
| muted (phosphor dim) | `#ff6605` | brightness 0.42: prompts, timestamps, separators, far planes, axis labels |
| text (phosphor mid) | `#ffb000` | brightness 0.7: every normal glyph; inverse-video blocks |
| accent (phosphor overexposed) | `#ffebb8` | brightness 1.0: bold glyphs, titles, the cursor, landing flashes |
| faint | `#3a1f08` | barely lit cells *(proposed)* |
| accent2 (second colour) | `#bfe4ff` | the one thing: here, blue light (the scattered rays, the blue bar, the sky). Never type decoration |
| bezel | `#000000` | outside the tube's rounded glass *(proposed)* |

Glyph colours run along the ramp glass → dim → mid → overexposed; the second colour runs glass → blue → a touch of
white. Other phosphors are allowed per film (green P1 with a warm pink, white P4 with a pale gold), never two in one.

## 3. Typography

- **One face:** VT323 (Google Fonts, OFL), a monospace bitmap-style face. Each glyph sits centred in its own cell of
  0.4 em × 0.8 em (1 : 2), so the grid is exact whatever the font's advance.
- **Grids for 1080×1920** (columns across the 936 px between 72 px margins; cell width = 936 ÷ columns, font size =
  cell width ÷ 0.4):

  | Use | Columns | Cell | Font |
  |---|---|---|---|
  | title, end line | 9 | 104 × 208 px | 260 px |
  | headline | 22 | 42.5 × 85 px | 106 px |
  | list | 24 | 39 × 78 px | 97.5 px |
  | banner numerals (each pixel of a 5 × 7 figure is two inverse cells wide, so it is square) | 38 | 24.6 × 49 px | 62 px |
  | terminal text, labels | 30 | 31.2 × 62 px | 78 px |
  | LOG strip | 34 | 27.5 × 55 px | 69 px |
  | prism picture | 36 | 26 × 52 px | 65 px |
  | bold diagrams (a few big shapes, line glyphs) | 40 | 23.4 × 47 px | 58 px |
  | fine ASCII pictures (the sky) | 60 | 15.6 × 31 px | 39 px |

- **Smallest text:** 40 px font (VT323 draws small inside its em); must-read text uses the 30-column grid or bigger.
- **Case:** capitals only. **Emphasis:** bold vs dim, inverse video, a bigger grid, slower typing. Never colour.
- **Words on screen:** one typed line per beat; titles 2–3 short lines of at most 7 characters on the 9-column grid.
- **Captions are terminal output** in the LOG strip: a dim dashed separator, an inverse-video `LOG` tag, a `> `
  prompt, the line typed in capitals; a dim status line under it (`READY`, `3 OF 3 OK`). At most 26 characters per
  line.

## 4. Layout

- **The tube fills the frame:** glass inset 18 px with a 96 px corner radius; outside it, black bezel.
- **Margins:** 72 px each side, so every grid is 936 px wide and starts at x = 72.
- **Safe zones:** nothing must-read above y = 230 or below y = 1590. A dim prompt line (what the machine is doing)
  sits at y = 250; the LOG strip owns y = 1400–1575 and stays clear of everything else.
- **Density:** negative space makes ASCII readable; cells below luminance 0.05 stay blank. Far = darker and sparser,
  near = brighter and denser.
- **Alignment:** left, on the grid. Labels sit on blank cells of a picture, never over lit ones.

## 5. Elements

- **Density ramp** ` .:-=+*#%@` by ink coverage; brightness 0.42 → 1.0 follows luminance; a Bayer 4 × 4 ordered
  dither plus a small hash (amplitude 0.7 of a level); gamma 1.25.
- **Pictures** are silhouettes painted as a luminance field and sampled once per cell (a sun with limb darkening, a
  two-atom molecule, a beam, dashed rays, a prism of `/ \ _`). Lines use the glyph that matches their direction
  (`-`, `\`, `|`, `/`); bands use one glyph each.
- **Banner numerals:** 5 × 7 figures built from inverse-video cells on the 38-column grid, two cells per figure
  pixel, so they read as solid at phone size.
- **Bars:** `[` + `#` cells + `]`; a cell more than 40% full shows `=`. Lengths are true ratios.
- **Cursor:** a bright block (period 1.06 s, lit half the time); it blinks while waiting, as suspense.
- **Inverse-video tags** for names (` AIR MOLECULE `), status (` OK `) and the one emphasised word.
- **Prompt lines** say what the machine does (`> TRACE AIR_MOLECULE`); invented file names only, never a real
  product's commands.
- **None:** sprites, free pixels, vector lines, floating panels.

## 6. Motion

- **Characters never move off the grid** except in a declared transformation (letters falling into a picture).
  Typing, scrolling and counters jump cell to cell.
- **typing:** machine output 0.012 s a character, commands 0.038 s, titles 0.1 s, dramatic lines 0.13 s (a
  sixteenth at 100–120 BPM). Human typing is hand-timed and uneven.
- **roller:** digits flip discretely, fast then slowing (quart-out over 0.9 s), landing only on the sourced value.
- **push:** the camera is the grid size; push in by moving to a grid with fewer columns (sine-in-out over 1.2 s).
- **afterglow:** what disappears decays with τ ≈ 0.11 s (expo-out 0.12 s); a moving glyph leaves one trail sample.
- **fall** (text → picture): hold the sentence 1.5 s with the cursor blinking; each target cell's glyph flies from a
  source letter, starting at 18 px and shrinking to the cell, fading in over 0.2 s on a path y = u·(0.6 + 0.4u);
  landing flash 1.9× brightness decaying over 0.12 s.
- **power:** on = dot → line → full frame (cubic-out 0.45 s); off = collapse to a dot.
- **Holds:** at least 1.5 s after a line finishes typing.
- **Only three things move continuously:** the grid scale, the tube's physics (flicker), particles in a
  transformation.

## 7. Transitions and rhythm

- Transitions happen on the screen: clear screen, hard redraw, scroll the buffer, power off and on, degauss. Never a
  crossfade between two screens.
- Cut on a bar or a beat; one typed line per beat. Silence (room tone under typing) is the main instrument; 1–1.5 s
  of near-silence before a transformation.

## 8. Finish

- **Bloom:** every lit glyph glows in its own colour: 3 px at 55% and 14 px at 22% (scaled with the cell).
- **Scanlines:** 4 px period at 0.3 *(the source's 3 px at 1080p 16:9; 4 px here so half-size previews don't
  moiré)*.
- **Glass edge:** the rounded mask (radius 96) with inner darkening 0.85 over 90 px; a faint top-left reflection
  (5%).
- **Flicker:** ±1.2% brightness per frame. **Grain:** 0.02. **Vignette:** 0.3.
- **No RGB grille** (a monochrome tube has none). Barrel curvature (0.045 in the source) is suggested by the rounded
  edge only.

## 9. 3D look

none

## 10. Banned

- Faking it with an image or photo run through an "ASCII filter": every character is a character on the grid.
- Green falling code rain and other hacker-movie clichés.
- Pixel-art sprites, free pixels, vector lines, floating HUD panels.
- A second hue for decoration; colour on type.
- An RGB grille.
- Crossfades between screens.
- Noise-textured subjects (subjects are silhouettes).
- Chiptune.
- Copying any film's or product's interface text, fonts or logos; real agency names.

## 11. Where it came from

- **Lemo-Opuscar (lemomo-ai/lemo-opuscar), MIT**: style No. 22 "ASCII / CRT Terminal" (`styles/ascii-crt/STYLE.md`,
  `DEMO.md`, `style.json`; shared post `core/post/crt.js`); demo film and stills CC BY 4.0 (LemoLab). Read through
  the research notes `docs/research/styles/five-skills.md`, section "ASCII / CRT Terminal". The source draws with
  Canvas 2D and a WebGL2 CRT pass; this is rebuilt with React and CSS in Remotion (each glyph a cell, bloom as
  text-shadow, scanlines as a repeating gradient). No code was copied.
- **Taken:** the amber P3 ramp (`#ff6605`, `#ffb000`, `#ffebb8`), the second colour `#bfe4ff`, the glass `#090604`;
  the one-phosphor and one-second-colour rules; brightness levels 0.42 / 0.7 / 1.0 and inverse video; VT323 and the
  1 : 2 cell; uppercase; the LOG strip (dashed separator, inverse `LOG` tag, `> ` prompt, status lines); the density
  ramp, dither amplitude 0.7, gamma 1.25 and the blank level 0.05; silhouettes not noise; typing speeds (12 / 38 /
  120–150 ms a character); roller digits; the letter fall, afterglow, power on/off and push-by-grid moves;
  transitions; bloom 0.55 / halo 0.22, scanline strength 0.3, flicker 1.2%, the reflection, no grille; the banned
  list.
- **Proposed:** the faint and bezel colours; every grid for the tall frame and its sizes; banner numerals and glyph
  bars; the 4 px scanline period; the rounded glass in place of a barrel warp; the sample scenes (prism bands, the
  ASCII sun and molecule, the boot log, the blue sky).
- **Changed for vertical:** the source's grids are 20 / 80 / 240 columns across 1920 px; here they are 9–60 columns
  across 936 px so text stays large (the 80-column terminal became 30 columns); the LOG strip moved up to
  y = 1400–1575 to clear the bottom 330 px; a dim prompt line sits at the top safe line; pictures use the middle
  band instead of the full width.
- Added to the catalog on 2026-11-04.
