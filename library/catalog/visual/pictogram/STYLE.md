---
name: style-pictogram
description: Visual style "Pictogram": a beat-locked flash-card catalogue; a square grid of discs and motif cells whose rows drift sideways, faceless geometric pictogram figures built from capsules standing on a sun disc, huge Inter Tight 900 capitals sliding up out of masks, DM Mono meta and tag chips, HUD corners and progress ticks; one hue per chapter in five tones (an original coastal set: sky, navy, teal, coral, sand, plus an ink neutral). Use when a video is made in this style.
---

# Pictogram

## 1. In one line

A flash-card catalogue cut on the beat: a patterned square grid, a faceless pictogram figure on a sun disc, and a huge
title sliding out of a mask, one card per item. It suits lists of 20–80 items (sports, tools, dishes, stations,
features), event openers and visual identities, countdowns, a day in pictograms, and step-by-step facts. Works with
no narration. No footage, no 3D.

## 2. Palette

Five hues and one dark neutral, each in five tones `t0` (darkest) → `t4` (lightest), `t2` the base. A chapter is one
hue; a multi-hue moment rotates the set. This set is original *(proposed: the source's demo palette belongs to a real
event and must not be reused)*.

| Hue | t0 | t1 | t2 | t3 | t4 | Type and figures |
|---|---|---|---|---|---|---|
| sky | `#1e5f99` | `#2a74b5` | `#3a8bd0` | `#62a5dc` | `#9cc8e9` | cream |
| navy | `#141c48` | `#1b2660` | `#26357c` | `#3a4b92` | `#5466a8` | cream |
| teal | `#00575a` | `#006b6e` | `#0a8483` | `#3a9c98` | `#6cb5ae` | cream |
| coral | `#b83a2a` | `#cc4a35` | `#e4624a` | `#ec8167` | `#f2a185` | cream |
| sand (light) | `#b48c3e` | `#c69d4e` | `#d8b266` | `#e2c486` | `#ecd7a8` | dark `#1e1708` |
| ink neutral | `#0f0e14` | `#16151d` | `#1e1d27` | `#2a2935` | `#3a3947` | cream; accent sand |

| Role | Hex | Where |
|---|---|---|
| background | `#2a74b5` | sky t1: the default ground |
| text (cream) | `#fbf6ec` | type and figures on dark and mid hues; the end card's band |
| muted | `#9cc8e9` | sky t4 |
| faint | `#1e5f99` | sky t0 |
| accent (coral t2) | `#e4624a` | a filled tag chip, one per card *(proposed)* |
| accent2 (sand t2) | `#d8b266` | the accent on the ink chapter; the sun |
| ink | `#15111c` | global ink (type on the cream band) |
| darkFg | `#1e1708` | type and figures on sand |

- **Pattern** at low contrast under type (spread 0.42 toward the ground) and full contrast on chapter cards (0.95).
- **Sun disc:** `t1` on mid hues (here `t0` where `t1` would vanish into the ground *(proposed)*), `t4` on light hues,
  `t3` on the ink neutral.
- One cream and one ink serve every hue. No outlines, no highlights except one light sweep.

## 3. Typography

- **Titles:** Inter Tight 900, capitals, −0.02 em, leading 0.9: 150–170 px, fitted to the column; a ghost title up to
  360 px in the hue's `t3`.
- **Second lines:** Inter Tight 500, 52–60 px.
- **Meta, HUD, tags:** DM Mono 500, 24–26 px, 3 px tracking (`THE SCIENCE   EVERY COLOUR`, `03 / 06`); tags as mono
  chips, outlined or filled.
- **Numbers:** Inter Tight 900 at 430 px, counting up; an outline index numeral at 300–330 px, 20%.
- **The smallest text** is 24 px. One title of 1–6 words per card.

## 4. Layout

- **One square grid:** `CELL` = 180 px (6 columns × 10.7 rows on 1080×1920); everything snaps to it.
- **Card layouts,** rotated per chapter:
  - **A:** text block on top (meta, title), the stage (disc and figure) under it.
  - **B:** the title fills the frame in a ghost tone; disc and figure over it; a bottom info bar in `t0` with the name
    and mono meta.
  - **C:** a solid `t0` panel wipes in across the top with a 90 px hairline grid at 10%, the text on it; the pattern,
    the disc and the stage below.
  - **Chapter card:** a 2-row (360 px) cream band grown from the centre with hairlines above and below, the title and
    meta on it, an outline numeral rising into it.
- **Text and figure never overlap:** one text column, one stage, ≥ 100 px apart.
- **HUD** always: meta top left and top right (`01 / 06`) on y = 250, meta bottom left and the progress ticks bottom
  right on y = 1560.
- **Margins:** 90 px. Safe zone 230 px top, 330 px bottom.

## 5. Elements

- **The pattern ("core graphic"):** the hue's `t1`; on each grid cell a 34% chance of a cell-radius disc in a random
  tone and a 16% chance of a `t3` disc with a `t0` half-radius disc inside; then half the cells get one of twelve
  generic motifs (quarter-disc, half-disc, disc + dot, striped sunset, fish-scale waves, concentric arcs, checker,
  crescent, triangle scales, fading bars, sun wheel, S-wave), turned by multiples of 90°. Never mascots, landmarks or
  logos in cells.
- **The figure:** unit = body height, origin at the hip: torso 0.30, neck 0.045, head radius 0.082, upper arm 0.16,
  forearm 0.15, thigh and shin 0.225; widths torso 0.145, arm 0.076, leg 0.094; round caps. Drawn far leg, far arm
  (mixed 42% toward the ground), torso, near leg, near arm, head. Faceless; never emotes. Poses: looking up, arms open,
  standing, reaching.
- **The stage:** the figure on a sun disc (r 300–330 px) crossed by one slow 9% white light sweep (the only gradient);
  the disc may carry concentric rings in other hues for a multi-hue moment.
- **Props:** discs, rings, capsules, straight lines, speed lines, dashed flight arcs.
- **Progress ticks:** 6 here; the current one a tall 4 px tick, done ones at 75%, the rest at 28%.

## 6. Motion

One tempo per film (150 BPM: beat 0.4 s, bar 1.6 s). Every card starts on a beat; every key pose lands on a beat.

- **title:** slides up out of a mask with expo-out over 0.5 s; the second line 0.08 s later, tags 0.2 s later; 2-beat
  cards compress every timing by 0.7.
- **meta:** types on without a caret (0.03 s a character).
- **assemble:** for the first 0.42 s the figure is cut into 54 px horizontal bands offset alternately left and right by
  90–250 px that slide into register (expo-out).
- **disc:** grows from its centre (cubic-out 0.45 s); **panel** wipes and **chapter band** grows from the centre
  (quint-out 0.5 s).
- **count:** a number rolls up to its value in one bar (1.6 s, expo-out).
- **The pattern breathes:** odd rows drift right, even rows left at 26 px/s plus a fixed offset per row; on chapter
  cards every row jumps a quarter cell on each beat of the second bar.
- **whip** (in-out exponential, from 0.14 s before to 0.24 s after a beat) for camera whips and wipes. A back ease at
  most once per film.
- **Pace ladder:** a normal card 4 beats (1.6 s), runs of a sub-family 2 beats, chapter cards 8 beats; the second tempo
  divides the beat, never changes the BPM. A card that must be read holds ≥ 1.6 s.

## 7. Transitions and rhythm

- **Grid transitions** in a window from 0.12 s before to 0.26 s after the cut: `rows` (6 rows slide in alternating
  directions; into every chapter), `cols` (columns drop or rise), `slide` (a push with a thin shadow edge), `quarter`
  (quarter-discs grow from cell corners), `iris` (a circle opens from the last figure's centre), `flip` (an 11 × 6
  tile flip). Rotate them per card. No dissolves.
- **Long take:** stations one screen apart; the camera drifts 42 px/s and whips one screen on every cut.
- **Finale:** an icon wall flips in, turns one colour, collapses to one sun; end card; 1.3 s fade to black.
- A percussion spine; an accent hit on every card onset; half a beat of silence before a chapter.

## 8. Finish

Flat and clean: light grain 0.02 only; one soft light sweep (9% white) on the disc; no outlines, no textures. Motion
blur only in whips.

## 9. 3D look

None.

## 10. Banned

- Depth, 3D, isometric; dissolves, 3D camera moves, handheld shake, depth of field.
- Faces or emotions on figures.
- Outlines; gradients except the sweep.
- Text and figure overlapping; cream type on light hues.
- Numbers as charts: numbers are labels.
- Mascots, landmarks or logos in cells.
- Copying a real event's pictograms, emblem, slogan, pattern art or colour names, or naming them.

## 11. Where it came from

- **Lemo-Opuscar** (lemomo-ai/lemo-opuscar), MIT; its demo films and stills are CC BY 4.0. Style No. 21 "Pictogram"
  (Pictogram Motion). Research notes: `docs/research/styles/five-skills.md`, "Pictogram Motion". The demo is an
  unofficial promo that imitates a real event's identity: **its palette, colour names, emblem-like mark, slogan and
  pattern art are not used.** Only the grammar is. Rebuilt with SVG and CSS in Remotion; no code was copied. Inter
  Tight and DM Mono are SIL OFL.
- **Taken:** the five-hues-in-five-tones system and its rules (one hue per chapter, spread 0.42 / 0.95, disc tones,
  one cream and one ink, light hues take dark type); Inter Tight 900 titles (−0.02 em), DM Mono 500 meta and tags,
  outline index numerals at 20%; the square grid (`CELL` 180), card layouts A, B, C and the chapter card, text and
  figure never overlapping, HUD corners and progress ticks; the pattern recipe (34% / 16% / density 0.5 / motif
  families / 90° turns / rows drifting 26 px/s); the figure's proportions and draw order (far limbs 42% toward the
  ground); the sun-disc stage with a 9% sweep; every motion rule (beat grid, pace ladder, mask slide-ups 0–0.5 s with
  +0.08 s / +0.2 s, typed meta, 54 px band assembly over 0.42 s, chapter band, count-up, whips); grid transitions;
  finish; banned list.
- **Proposed:** the coastal palette (sky, navy, teal, coral, sand; the source names "coastal" only in words), the
  ink-neutral tones kept from the source's neutral (generic dark greys); the coral tag; every px size for 1080×1920;
  the poses; the vertical layouts; the sun disc in `t0` on the sky card. No second language (the source treats it as a
  version switch).
- **For vertical:** the source frame is 1920×1080 (`CELL` 180 = 1/6 of its height, 10.7 × 6 cells). Here `CELL` stays
  180 px, now 1/6 of the width (6 × 10.7 cells). Layouts are stacked: text on top and the stage below (A), the ghost
  title stacked on two lines (B), the panel across the top (C), the chapter band across the lower middle. Titles are
  150–170 px (the source's 170 px at 1080p height), meta 24–26 px (source 17–22 px).
- Added to the catalog on 2026-10-31.
