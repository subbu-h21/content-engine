---
name: style-broadside
description: Visual style "Broadside": a protest poster where type is so big it stops being text and becomes a shape; massive lowercase Barlow Black crowding the frame, two registers only (ink-black or fire-orange) that flood over each other, one orange clause on dark, IBM Plex Mono chrome and a short rule stub as the only ornament. Use when a video is made in this style.
---

# Broadside

## 1. In one line

A protest poster: massive lowercase type on ink-black or fire-orange, flat and loud, with mono chrome. It suits manifestos,
opinion pieces, bold claims, startup or activist promos and statement reels. No footage, no 3D.

## 2. Palette

| Role | Hex | Where |
|---|---|---|
| background (ink-black) | `#111111` | the dark register's ground; ink on orange |
| surface (ink-black-alt) | `#1a1a18` | alternate dark |
| text (cream) | `#f0ece5` | text on dark; never on orange |
| muted (cream-muted) | `#888880` | muted text on dark |
| faint (cream-hint) | `#505048` | non-accent chart bars |
| accent (fire-orange) | `#e85d26` | the ONLY colour: on dark, one clause, stat numerals, the `/` bullet, the rule stub; the full ground of the orange register |
| accent2 (border-dark) | `#282826` | hairlines on dark |

**Ink on orange:** `rgba(17,17,17, 0.75 / 0.55 / 0.40 / 0.20)` for muted, hint, faint and border tones.

**Two registers, one per frame:** dark (cream text, orange accent) or orange (ink text). No cream or paper register. A
frame split by a seam (the compare panel) counts as both, each half keeping its own rules.

## 3. Typography

- **Barlow** 400–900 for every text role. **IBM Plex Mono** 400/500 for chrome only: kickers, tags, numbers, axis labels,
  the `/` bullet.
- **Sizes at 1080×1920** *(proposed: slide sizes rescaled; the display keeps its source px of 250 and up)*:

  | Role | px | Weight / leading / tracking |
  |---|---|---|
  | display (≤ 2 words a line) | 272–288 | 900 / 0.88 / −0.04em |
  | h1 (3–4 words a line) | 168 | 900 / 0.92 / −0.03em |
  | h2 (5+ words) | 120–144 | 900 / 0.98 / −0.02em |
  | stat numeral, orange | 440 | 900 / −0.04em |
  | fadelist title, orange | 174 | 900 / 0.88 |
  | fadelist item | 104 | 900 / 1.0 / −0.025em |
  | lead, Barlow 500 | 44 | line height 1.3 |
  | body, Barlow 500 | 38–40 | line height 1.3 |
  | label, Plex Mono 500, uppercase | 26 | 0.14em |

- **Smallest text:** 24 px.
- **Case:** all lowercase display. No italic, no underline, no uppercase display.
- **Emphasis:** ONE clause in orange on the dark register. On orange: weight and size only.
- **One display moment per frame.** About 6 words in display type.

## 4. Layout

- **Margins:** 60 px: tight, so the type crowds the edge. Lean left: the type IS the composition. Display type may reach
  within 60 px of the right edge: it's a shape, and it's short enough to survive the platform's buttons.
- **Safe zone:** 230 px top, 330 px bottom.
- **Declarative frames are 45–55% empty;** the stat frame is the dense exception. Anchor changes: covers anchor high,
  statements anchor on the bottom safe line, ends sit mid-frame.
- **Chrome bars** (a hairline at the safe top and bottom, label left, number right) appear on data frames only. They're
  suppressed on cover, statement and end frames.
- **For 9:16:** the word goes on top and the lead below; compare panels stack dark over orange, with the seam at y = 960.

## 5. Elements

- **Kicker:** a mono eyebrow. **Rule stub:** 72 × 5 px, the only ornament *(proposed scale)*. **Catalogue number:** mono,
  top-left, at low opacity.
- **Bullets:** an orange mono `/`, three at most.
- **Vertical bar chart:** left axis only, one orange accent bar, the rest cream-hint, mono numbers.
- **Compare panel:** two halves on a seam; the orange half is the payoff.
- **Fadelist:** three stacked items at opacity 1.0 / 0.5 / 0.22 under one oversized orange title.
- **Figures:** flat bars. A thing crossing the seam inverts: orange on dark, ink on orange.

## 6. Motion

The source has no motion but a caption pop; everything here is *(proposed)* from the HyperFrames taste rules T36–T60.
The idea: a poster going up. Display type never fades.

- **drop** (display words, T59's waterfall): opacity is an instant set; each word appears 76 px low and rises, quart-out
  over 0.18 s, 0.11 s apart, the next starting as the last settles.
- **word** (smaller type): the same at 46 px, quart-out over 0.15 s.
- **mask** (the one hero numeral or beam): rises out of a clip, expo-out over 0.55 s.
- **flood** (the register flip): the other register rises from the bottom edge, cubic-in-out over 0.45 s (colour floods
  are ease-in-out, T38). It's the hero move of a cut.
- **stub:** draws in, quart-out over 0.3 s. **Labels** are set at once.
- **ray:** bars grow from their source, expo-out over 0.5 s, 0.02 s apart.
- **bar:** chart bars rise, quart-out over 0.5 s, the smallest first; a still beat, then the orange bar last (T55).
- **dim** (fadelist): as each new line lands, earlier lines step down the fade, cubic-out over 0.3 s.
- **out:** the next register floods up, quart-in over 0.25 s. Content never leaves on its own.
- **Captions:** the active word flips register to a hard orange block with ink text, scale 0.92 → 1 in 0.1 s
  *(from the source's caption skin)*.
- **Holds:** at least 1.0 s. A landed word is dead still.

## 7. Transitions and rhythm

- **The register flip is the rhythm:** orange → dark → compare → dark → orange. Floods always rise; a same-register change
  is a hard cut.
- **Beat:** short and declarative: 1.5–3 s a statement, one display moment each, a 0.3–0.75 s hold before the payoff.

## 8. Finish

A flat plane: no shadow, elevation, radius, gradient, grain or glow. Hierarchy comes from weight, size, hairlines and
negative space.

## 9. 3D look

None.

## 10. Banned

- Uppercase Barlow display; a second accent.
- Cream text on orange; a cream or paper register.
- Drop shadows, rounded surfaces, gradient grounds.
- A serif companion; Barlow used for chrome.
- Two display moments in one frame; edge-to-edge long lines.
- Ornament beyond the rule stub.
- Fades on display type; text that moves after it lands.
- Rows of three cards.

## 11. Where it came from

- **HyperFrames frame preset Broadside (heygen-com/hyperframes), Apache-2.0**, read at commit `a04b45a` on 2026-10-31.
  Research notes: `docs/research/styles/hyperframes.md`, "Broadside". Rebuilt in Remotion; no code was copied. Barlow and
  IBM Plex Mono are SIL OFL.
- **Taken:** every hex and ink tone, the two registers, the faces and roles, the case, tracking and leading, the fit table,
  the kicker, rule stub, catalogue number, `/` bullet, chart, compare panel and fadelist, the rules for chrome bars, the
  caption's register flip, the banned list.
- **Proposed:** all other motion; sizes for a phone; the seam-crossing figure; the bar values, which are (700 ÷ nm)⁴, the
  ratio behind the sample's 5.9×.
- **For vertical:** word on top, lead below; compare panels stack dark over orange; the fadelist's title sits above the
  items instead of beside them. The source's three-card stat grid isn't used.
- **Kept apart from** Signal Slam (one black word per beat, hazard orange, stepping widths) and Red Card Kinetic (white
  words on a red grid): lowercase Barlow held as a composition, two flooding registers, mono chrome.
- Added to the catalog on 2026-11-06.
