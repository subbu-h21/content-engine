---
name: style-paper-launch
description: Visual style "Paper Launch": a SaaS launch-video recipe on newsprint off-white. Near-black Hanken Grotesk headlines with exactly one Newsreader-italic word, IBM Plex Mono kickers, white hairline product windows (three hairline dots, no browser chrome) that tilt back 24° and rise into place with a deepening shadow, one raspberry accent on the active control, a dark register only for the hook and the use-case roll, hard cuts on a 120 BPM downbeat. Use when a video is made in this style.
---

# Paper Launch

## 1. In one line

A well-made product launch, told through the product's own screens: calm paper, sharp black type with one bookish
italic word, windows landing one after another on the beat. It suits SaaS and app launches of 20–60 s, feature
promos, and facts explained through a product's windows.

## 2. Palette

An invented palette (the recipe's practice piece copies a real brand's; this one is our own).

| Role | Hex | Where |
|---|---|---|
| background (newsprint) | `#efeee9` | the ground of every light frame |
| surface (window) | `#ffffff` | product windows |
| text (ink) | `#1b1a18` | headlines, UI text |
| muted | `#6e6c66` | secondary lines, kickers, window labels |
| faint (hairline) | `#d6d4cc` | window borders, chrome dots, tracks |
| accent (raspberry) | `#c8235a` | **the one accent:** the active control, a selection ring, a button, the underline under the serif word |
| accentSoft | `#f7dde6` | the fill behind a selected row |
| dark | `#161513` | the dark register's ground |
| darkWindow | `#22211e` | windows in the dark register (hairline: paper at 12%) |
| skyBlue / skyPale / lightRed | `#4a90d9` / `#cfe3f6` / `#d9534a` | **content** colours inside windows (a picture, a chart's data), never UI |

- **One accent:** raspberry only marks what the viewer should act on or look at (a button, a toggle that is on, the
  selected row, the serif word's underline).
- **Content colours stay inside windows.** A spectrum, a sky, a chart's series may be in colour; the UI around them
  stays ink, grey and raspberry.
- **The dark register** (`#161513`, paper type) is used for the hook and the use-case roll only.

## 3. Typography

- **Headlines:** Hanken Grotesk 700, 112 px (lower to fit the 888 px column), tracking −0.035 em, leading 1.0,
  sentence case, 1–7 words.
- **The serif word:** at most **one** word per frame in Newsreader italic 500, at 1.06× (it reads smaller than the
  grotesk at the same size). It may carry a 4 px raspberry underline drawn after it lands.
- **Secondary lines:** Hanken Grotesk 500, 38 px, muted: about a third of the headline (the recipe's 3:1 hierarchy,
  700 against 500).
- **Kickers:** IBM Plex Mono 500 (iA Writer Mono S when installed), 26 px, caps, tracking 0.12 em, muted.
- **Numbers:** Hanken Grotesk 700 at 300 px; the unit may be the frame's serif word.
- **UI text in windows:** Hanken Grotesk 30 px (700 for names, 500 for values); 26 px for small labels.
- **Smallest text:** 26 px. **Copy:** no em dashes, no invented numbers.

## 4. Layout

- **Margins:** 96 px (888 px column). **Safe zone:** 230 px top, 330 px bottom; keep content in the top 85% when
  captions sit at the bottom.
- **Stack:** kicker at y = 330, headline from y ≈ 390, then one window filling the column (888 px wide) below it.
- **Alignment:** left for type; windows span the column.
- **Layering:** a second, smaller window may overlap the first's corner (a detail, a tooltip, a result), sitting
  higher in the stack with its own shadow. In the dark register, windows cascade: each 36 px right and 330 px down
  of the last, the newest on top.
- **How full:** one headline and one window stack per frame; windows are the hero (40–70% of the frame).

## 5. Elements

- **Product window:** white, 1.5 px hairline border, radius 20 (12–20), a 64 px top bar holding **three hairline dots
  only** (12 px rings); no address bar, tabs, scrollbars or real cursors. Content padding 36 px.
- **Shadow:** deepens as the window lands, from `0 6px 16px` at 5% to `0 44px 90px` at 16% (ink-tinted).
- **Rebuilt UI inside windows:** labels, toggles (76 × 44, raspberry when on), swatches (radius 12), bars (18 px,
  radius 9, on a hairline track), selection rings (4 px raspberry, radius 18, a 4% raspberry fill), buttons
  (84 px pills in raspberry with white 700 text).
- **Pictures in windows:** inset 24 px, radius 12 (a sky gradient here; real screen captures at 2× in a video).
- **Camera inside a window:** push in at most 2.4× on a 2× capture.

## 6. Motion

- **arrive** (headline words, kickers, secondary lines): expo-out 0.6 s (the recipe's 0.5–0.7 s), rising 40 px with a
  10 px blur; words fall in a **waterfall** 0.02 s apart; each next line 0.12 s later.
- **window:** rotateX 24° → 0 (18–30°), y +200 → 0 (80–300 px), scale 0.94 → 1, blur 8 px → 0, expo-out 1.1 s
  (0.8–1.5 s), pivoting at its bottom edge; the shadow deepens with it.
- **settle:** power3.out `[0.25, 1, 0.5, 1]` 0.5 s; **ui** (controls, bars, rings): the same curve over 0.6 s.
- **exit:** power2.in `[0.32, 0, 0.67, 0]` 0.3 s.
- **pop:** one deliberate pop per film (spring 12 / 220 / 0.8 *(proposed)*), e.g. the final button.
- **Blur peaks:** 10 px on text, 18–20 px on full-frame surfaces. Held frames may jitter at most 2 px.
- **Holds:** 1.5 s for the end card; a frame never shows everything at once: things arrive one after another.

## 7. Transitions and rhythm

- **Default: a hard cut on the downbeat** (120 BPM, beat 0.5 s, bar 2 s; 110–128 BPM).
- **Zoom-through:** the outgoing frame scales 1 → 1.2, blurs to 10 px and fades to 15% over 0.2 s (power3.in); the
  incoming one scales 0.75 → 1 over 0.5 s (expo-out). **Inverse zoom:** out to 0.8, in from 1.25.
- **Cut the curve:** both frames move 230 px sideways, power4.in out and power4.out in.
- **Timeline** (a 46 s piece): hook 0–4 s (headlines slam on the beats, then implode to a dot), brand 4–8 s (drop at
  4.0), hero 8–14, capture 14–20, answers 20–26, agents 26–32, use-case roll 32–36 (breakdown and riser), proof
  36–42 (drop at 36.0), call to action 42–46 (final hit at 42.0).
- **Length:** 20–60 s (30–45 s for X, ≤ 30 s for Reels). Hook 3–4 s; end card ≥ 1.5 s; music fades over 1–2 s.

## 8. Finish

- Clean: no grain, no vignette, no glow.
- Music-only by default; a voice-over ducks the music 6–9 dB.

## 9. 3D look

None: CSS perspective tilts only (perspective 1600 px).

## 10. Banned

- Browser chrome, address bars, real OS cursors, scrollbars, notification badges.
- More than one serif-italic word in a frame; serif for whole headlines.
- A second accent; the accent on body text; content colours used as UI.
- Purple AI gradients, neon, glassmorphism, bokeh, generic stock shapes.
- Bounce (except one deliberate pop per film), screensaver float, breathing, drifting cameras.
- Showing the whole frame at once.
- Invented numbers; em dashes in copy.
- The dark register outside the hook and the use-case roll.
- A real brand's palette, type, logo or screens (unless it is the user's own brand).

## 11. Where it came from

- **Moritz Kremb's launch-video reproduction recipe** (seven documents: playbook and assets, story, shots, music,
  HyperFrames notes, a practice piece), AI × Leaders prompt library entry #27
  (https://ai-x-leaders.com/en/prompt/video/revid-2103066071838466494/), researched in
  `docs/research/styles/ecc-nullmotion-3b1b-web.md`, section "Paper Launch (Moritz Kremb's launch-video recipe)".
  Licence: MIT, © 2026 Moritz Kremb. Read 2026-10-31.
  - Taken: the look's structure (off-white ground, near-black ink, one accent, a dark register for the hook and the
    use-case roll); one serif-italic word per frame; mono kickers; headlines of 1–7 words with a 3:1 hierarchy at
    700/500; the window rules (radius 12–20, 1–2 px hairline, three hairline dots only); the window entry (rotateX
    18–30°, y +80–300, scale 0.94, blur 8 px, expo.out 0.8–1.5 s, the shadow deepening); arrivals expo.out 0.5–0.7 s,
    settles power3.out, exits power2.in 0.3 s; blur peaks; the 0.02 s word waterfall; the 2 px jitter limit; the
    2.4× camera limit; the zoom-through, inverse zoom and cut-the-curve seams; the 120 BPM grid; the timeline and
    lengths; the bans.
  - **Not taken:** the practice piece's palette (a real brand's off-white, ink and blue), its proprietary sans and
    commercial serif. The palette here is invented (newsprint `#efeee9`, ink `#1b1a18`, raspberry `#c8235a`), so it
    is also clearly apart from the catalog's warm-white-and-lime launch style.
- **Fonts:** Hanken Grotesk for the brand sans *(proposed)*; Newsreader italic for the commercial serif
  *(proposed)*; IBM Plex Mono for iA Writer Mono (which is built on IBM Plex Mono).
- **Changed for vertical:** the recipe defaults to 1920×1080 with 96 px margins. Here type and windows stack top to
  bottom in the 888 px column; headlines 112 px (≥ 64 px at 1080p in the source), secondary 38 px, UI 30 px.
- *(Proposed):* every hex, the type sizes, the window's 64 px bar and 36 px padding, the shadow values, the 1.1 s
  window time and 24° / 200 px entry within the recipe's ranges, the pop spring, the content-colour rule, and the
  sample scenes (a sky window with a "Why?" button, a spectrum window with all colours selected, a scattering
  window with a result window overlapping it, a chart window with the blue row selected, a dark cascade of three
  step windows, a call-to-action window).
- Added to the catalog on 2026-10-31.
