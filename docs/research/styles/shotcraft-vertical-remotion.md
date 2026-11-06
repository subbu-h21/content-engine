# Visual styles from video-shotcraft, vertical-video-editing, claude-remotion-skill and claude-shorts

Research only, written 2026-10-31. Values are copied from the source files as they were on that date; prose is paraphrased (shotcraft is in Chinese, translated here).

Styles in this file: Ink Press · Shotcraft Lit Stage (dark looks) · Shotcraft Lit Stage (light looks) · Vibe Life · Creator Editorial · Mesh Glow Reel · Syntax Glow. Then: style-pack formats, reusable parts (shotcraft components, rules, all 124 shot cards, caption styles, safe zones, transitions, camera moves, layouts), conflicts, and what I couldn't open.

Sources (default branch `main` of each, read 2026-10-31):
- `Vincentwei1021/video-shotcraft`: Apache-2.0, branch `main`, last push 2026-10-29, 15.3k stars. Read: `SKILL.md`, `template/TEMPLATE.md`, `template/THEMES.md`, all of `template/src/` (Ink Press scenes, themes), `assets/lib/*` (PageCam, ClipCard, DigitRoll, FlashCut, Caption, helpers), `assets/brand/BRAND.md`, `demos/README.md`, `demos/_fixtures/{Look,Polish,Motion,Brand,Fixtures}.tsx`, `references/{aesthetic-rules,pipeline,guided-free-creation}.md`, `gallery/llms.txt`, `gallery/api/library.json`, and the 124 shot cards in `references/shots/` (see "Not styles" below for how far each was read).
- `nopefallacy/vertical-video-editing`: **this URL now returns 404**. The same author's repo `nopefallacy/vertical-video-editing-skills` (MIT, created 2026-06-21, 66 stars, same 38,500-byte SKILL.md the earlier summary described) looks like the renamed repo; GitHub gives no redirect, so that is my inference. A second identical copy is `adriiita/vertical-video-editing-skill`. I read the `nopefallacy/vertical-video-editing-skills` copy.
- `haidrrrry/claude-remotion-skill`: MIT, last push 2026-08-12.
- `AgriciDaniel/claude-shorts`: MIT, last push 2026-07-11.

Frame-size note: shotcraft's whole library is authored at **1920×1080 @ 30 fps** (landscape). Every px value below from shotcraft is at that size unless said otherwise; it needs re-measuring for our 1080×1920 frame. Wherever I converted a value myself (cqw → px, percentages of frame height), the text says so.

---

## Ink Press (paper-and-ink product promo)
- Source: `Vincentwei1021/video-shotcraft` — `template/TEMPLATE.md`, `template/src/aifl/Main.tsx`, `template/src/aifl/{PaperTitleCard,Caption,DigitRoll,FlashCut}.tsx`, `template/src/aifl/live/{SceneOpen,SceneFlyIn,SceneDetail,ScenePapers,SceneWbr,SceneOutroLive,PageCam}.tsx`; cards `brand-ink-open`, `paper-title-card`, `spotlight-hero-card`, `deck-deal-flyin`, `type-and-filter`, `row-embed`, `list-stack-press`, `document-typewriter-reveal`, `outro-group-photo-launch`. Licence: Apache-2.0 (Remotion's own licence still applies to rendering).
- One line: a calm "morning reading room" — warm paper, black serif statements letterpressed word by word, one amber italic word, real product screenshots moved by a slow oblique camera, ending in a launch-event group photo.
- Suits: product / SaaS promos and feature tours, editorial or knowledge products, anything with real UI to show. Needs real footage? It needs **real page screenshots** (2× full-page textures, element cut-outs, a `layout.json` of element boxes) — no video footage. Needs 3D? No WebGL; all depth is CSS 2.5D (perspective 1100–1400, rotateX/Y).

### Palette
The template's colours were authored as oklch tokens; the hex values are the sRGB renderings the source itself lists.

role | hex | where used
---|---|---
film background (paper) | `#f2eee6` | root `AbsoluteFill` behind every shot
scene paper | `#faf7f2` | PageCam backdrop, outro scrim `rgba(250,247,242,…)`
title-card paper | `#f9f6f1` (oklch 97.5% 0.008 82) | title-card field, empty-slot patches
document paper | `#fdfcfa` | weekly-report wipe covers
input field | `#fefcf9` | search-box interior
ink (text) | `#13110f` (oklch 18% 0.006 82) | serif statements, wordmark
muted ink | `#65635f` (oklch 50% 0.006 82) | kicker, tagline, sub-lines
caption grey | `#575552` (oklch 45% 0.006 82) | bottom narration strip
amber accent | `#955905` (oklch 52% 0.115 65) | accent word, underline rule, crosshair, beam, cursor, caption square
deep amber | `#ae6700` (oklch 58% 0.13 65) | empty-slot outline, search accent
amber glow (rgb) | `rgba(180,120,50,…)` | click-ring glow 0.5, seam glow 0.35, slot inner glow 0.12
marker highlight | not given as hex (oklch 88% 0.095 85) | highlighter bar behind annotation words
@-mention wash | not given as hex (oklch 95% 0.05 85) | member-name wash in the document shot
landing glow | not given as hex (oklch 78% 0.13 70, 0.9→0) | radial glow where outro elements land, `multiply`
gold dust | not given as hex (oklch 75% 0.08 85) | 20 outro motes
warm light | `rgba(255,241,214,0.42)` → `0.10` | spotlight pool; stage light `rgba(255,246,228,0.95)`
flash white | `rgba(255,248,235,0.98)` → `rgba(255,244,224,0.55)` 55% → transparent 80% | FlashCut radial
shadow | `rgba(40,30,20,…)`, `rgba(30,25,18,…)`, `rgba(60,45,30,…)` | all card shadows (warm brown, never black)
vignette | `rgba(62,48,32,0.7)` at the edge, opacity 0→0.1 | outro corners; spotlight dim `rgba(70,56,38,0.16→0.42)`
dark metal (one shot only) | `#2a2d33`, `#383c44`, `#22242a`, `#33363e`, `#1d1f24` (115° linear) + streaks; preview flat `#383638` | brushed-metal table under the card-pile close-up

Recolour presets (`template/src/themes/palettes.json`, seven roles each: page / surface / field / text / muted / accent / border). Choosing one swaps the serif and mono for a system sans (`"Segoe UI Variable", "Segoe UI", "Microsoft YaHei", Arial`), drops italics, lowers FlashCut to 0.24 and boxes the caption:
- Modern Light `#f4f7fb` / `#ffffff` / `#edf2f8` / `#142238` / `#5c6b82` / `#2563eb` / `#d8e2ef`
- Midnight `#090f1a` / `#111c2c` / `#162438` / `#f0f5ff` / `#9babbe` / `#61d9ef` / `#293b52`
- Sage (`solar-pop`) `#f9faf6` / `#ffffff` / `#f0f3e7` / `#26342b` / `#637067` / `#527434` / `#dde4d5`
- Coral (`coral-burst`) `#fffffe` / `#ffffff` / `#f9f2f3` / `#1f1235` / `#716579` / `#d94e59` / `#e9dfe6`
- Iris (`color-play`) `#f7f5fb` / `#ffffff` / `#eee9f7` / `#282039` / `#726781` / `#7354b5` / `#e2dbea`
- Deep Ocean `#0b1620` / `#142735` / `#1c3443` / `#e8f1f5` / `#9fb6c3` / `#7cc8b4` / `#304957`
- Obsidian Violet `#14121b` / `#211d2c` / `#2e283d` / `#f0edf7` / `#b3a9c5` / `#bca0e8` / `#41364f`
- Vintage Kraft `#c8aa7d` / `#dfc69e` / `#ccb086` / `#382a20` / `#6b513b` / `#8b4937` / `#ac895e` (keeps a procedural paper texture)

### Typography
All sizes at 1920×1080.
- Faces: serif `ui-serif, Georgia, "Times New Roman", serif`; mono `ui-monospace, SFMono-Regular, Menlo, monospace`; UI sans `ui-sans-serif, system-ui, -apple-system, sans-serif`. **None is a Google Font** — they are system stacks, so the render depends on the machine. A Google substitute would be our choice; the source names none.
- Title-card statement: serif 116 px, weight 600, line-height 1.14, letter-spacing −0.012em, word gap 0.26em, max width 1500, centred, sentence case. Emphasis: one word per card marked `*word*` → amber `#955905` + italic.
- Brand wordmark: serif 132 px (open) / 148 px (outro), weight 600, letter-spacing −0.01em; in the outro it "breathes" from −0.01em to +0.005em once.
- Kicker / tagline: mono 26 px / 25 px, letter-spacing 0.14em, UPPERCASE, muted ink.
- Narration caption: mono 22 px, letter-spacing 0.14em, UPPERCASE, `#575552`, led by a 6×6 px amber square, gap 14, 72 px from the bottom. The library copy says plainly this is **below their own minimum (Q11)** and is a deliberate "info strip" exception.
- Title sub-line with counter: mono 26 px, 0.12em, uppercase, with an amber DigitRoll number.
- 3D annotation beside the hero card: serif 37 px weight 600, line-height 1.16, two lines, second line italic with a marker bar.
- Counter labels: mono 24 px / 0.16em and 20 px / 0.12em, uppercase.
- Words on screen: title cards carry one sentence of 6–8 words; captions 2–6 words (`SEARCH · FILTER · OPEN`); six captions across 36 s, none on title cards or the outro.
- Presets swap sizes: wordmark 116, kicker 44, outro wordmark 124 / tagline 44, caption 36 px boxed (surface fill, 1 px border, radius 8, padding 8×18, weight 500).

### Layout
- 16:9 landscape, centred compositions. Title cards: one centred block on an empty paper field, an amber rule (220×6 px, radius 3) 38 px under the text.
- Product shots fill the frame with a real full-page screenshot moved by **PageCam**; overlays are positioned in page CSS px from `layout.json`, so flying elements always land in a real slot.
- Hero-card framing: focal point set ~30 px left of the card centre so the card sits slightly right of centre and the annotation takes the left.
- Captions: one centred strip near the bottom edge; outro: wordmark centred, nine page elements in an arc around it.

### Elements
Real UI screenshots (2× pages, 4× hero crop), rounded cards (radius 16, 12 for paper rows, 8–10 for bars), two-layer warm shadows, a hand-drawn amber crosshair, amber rules, a block cursor, a marker highlighter bar, an amber perimeter beam (SVG rounded rect, `pathLength=1`, dash `0.14 1`), click rings, warm spotlight pools, 20 gold dust motes, one brushed-metal table.

### Motion
Frames at 30 fps. Shotcraft uses `interpolate` + `Easing.bezier`, not springs, for almost everything here.
- **Word letterpress (title card)**: word *i* starts at 4 + 4i, lasts 9 f, `bezier(0.2,0.75,0.3,1)`; scale 1.28→1, blur 7→0 px, opacity 0→1. Underline scaleX 0→1 over f16–34, `bezier(0.3,0,0.2,1)`. Sub-line fades f10–22. Whole card fades out over its last 8 f. Card length 50–55 f.
- **Brand open** (`brand-ink-open`, 83 f): crosshair vertical stroke draws f0–9 (`bezier(0.3,0,0.2,1)`), horizontal f8–18 (linear), crosshair fades f24–34. Wordmark glyph *i* starts at 10 + 3i, 12 f, `bezier(0.2,0.7,0.25,1)`, scale 1.6→1 from bottom centre, blur 6→0; a 2 px amber under-glint grows and fades over ±4 f around each landing. Mono kicker types from f28 at 0.7 f per character with a 14×24 amber block cursor (opacity 0.85) blinking 2 f on / 2 f off. **Hold f46–76 (1 s)**, then out f76–83 `bezier(0.4,0,0.5,1)`: rise 40 px, shrink 12%, fade.
- **Spotlight hero card** (f82–220): page fades in f82–90. Spotlight roves through waypoints at f86/90/98/104/110/130 (x% 25/25/70/42/50/50, y% 30/30/45/60/67/50), `bezier(0.4,0,0.3,1)`; pool radius 620→420→360 px at f104/114/130 with a +6% pulse f114–123; dim outside the pool 0.16→0.34→0.42. Camera: flat zoom 0.78 f82–114, then push to zoom 2.6, rotX 8°, rotY 34°, rotZ 2°, perspective 1200 by f130 (`bezier(0.35,0,0.2,1)`), held (2.58) to the end. Depth-of-field band 0→9→9→0 px at f114/130/140/150. Card rises f130–140 `bezier(0.2,1.25,0.3,1)` (overshoot), hovers f140–194 at z = 110 px with a sine bob of 4 px, period 40 f; reseats f194–212 `bezier(0.4,0,0.3,1.05)` with a press to scale 0.997 at f208–212. Shadow grows with height: `0 8L 10+12L rgba(40,30,20,.18L), 0 46L 90L rgba(40,30,20,.22L)` (L = lift 0–1). Perimeter beam lap 1 f142–156 linear, stroke 5 + 2.5 core; lap 2 f162–182 `bezier(0.4,0,0.4,1)`, stroke 3.5 + 1.75 at opacity 0.62; a faint amber ring fades 0.35→0 f182–194. A 4× crop of the card crossfades in over 6 f (f114–120) so text stays sharp. The annotation rises 26 px and de-blurs 4→0 over f142–152 (`bezier(0.2,0.75,0.3,1)`), floats at translateZ 92 ± 3 px (period 44 f), its marker bar sweeps f156–168, it fades f198–208. (The newer card version is a dark-theatre variant: page multiplied to ~6–14% brightness, a lap of `0.16 1` dash, a 3D note of 34 px page-space ≈ 100 px after the push.)
- **Deck deal** (190 f): 26 cards leave a pile; departure *k* at 36 + 4k − 0.0792·k(k−1), so the gap shrinks from 4 f to 0.2 f. Each flight: 8 f dive `bezier(0.3,0,0.2,1)` with a z-arc of sin·90 px and scale 1 + 0.06·sin, then 4 f settle `bezier(0.3,0,0.25,1.15)` from a 40 px hover, press 0.996. Camera keys: f0 zoom 1.95 rotX 46 rotY −30 rotZ 9 persp 1100 → f34 zoom 1.85 rotX 42 rotY 26 rotZ −7 (orbit) → f62 zoom 0.88 rotX 26 rotZ 2 persp 1300 (pull back) → f82 zoom 0.78 rotX 14 (~50 px/f) → f98 zoom 0.72 flat (~70 px/f) → **rest f98–113 (0.5 s)** → f124 zoom 0.9 (swoosh back up) → hold to f174 → f190 zoom 2.2 push into the clicked card. Default PageCam ease `bezier(0.33,0,0.15,1)`.
- **Type and filter**: 3 f per typed character from f128, caret blinks on an 8 f cycle; filter at f160, the 25 other cards fade out 5 f each, staggered 0.4 f, ease in-out quad; the kept card slides 10 f to the first slot with scale 1→1.02→1 and z 18 px; click: two amber rings at f176 and f179, 10 f each, `Easing.out(cubic)`, radius 14→54 / 14→78 px; selected outline glow `0 0 40px rgba(180,120,50,0.5)`.
- **Row embed** (100 f): camera zoom 1.1→1.0 while panning down (f0–75); rows fall in from above, scale 1.06→0.995 then press back to 1 (`bezier(0.3,0,0.25,1)`); on touchdown a 2 px amber seam grows from the row centre (`Easing.out(cubic)`, glow `0 0 6px rgba(180,120,50,.35)`).
- **List stack press** (105 f): 5 cards at f18/30/42/54/66 (12 f stagger), 22 f each, `bezier(0.45,0.05,0.25,1.12)`, alternate tilt ±2°; each landing presses the settled stack 6 px and it springs back over ~8 f; a linked-name highlight grows 7 f, fades 5 f; one glaze sweep f82–96 `bezier(0.45,0,0.35,1)`; camera zoom 1.35→1.15→1.02→0.95→0.9; DigitRoll counter.
- **Document writes itself** (110 f): 20 blocks revealed in pairs, pair *g* at 6 + 3.5g, 8 f paper-mask wipe left→right `bezier(0.4,0,0.6,1)` with an amber caret on the wipe edge; member names get an amber wash 4 f after, 8 f long; six past-week rows drop in at 58 + 5i, 8 f each, `bezier(0.2,1.15,0.3,1)`; camera zoom 1.25→1.21 (f22)→0.997 (f64)→1.003 (f78)→0.995 (f102), a deliberate micro-breath.
- **Outro group photo** (145 f): background page blurs 0→14 px over f0–24 (`bezier(0.4,0,0.4,1)`), saturate 0.9, warm scrim. Nine elements fly in at cues f4, 7, 10 … 28 (3 f stagger), 12 f each `bezier(0.34,1.4,0.44,1)` (real overshoot), opacity in 3 f, rotation 2× → settled (−5° to +4°), scale ×1.12→1, a blurred ghost (opacity 0.2, blur 8 px) lagging 8% of the path, a 6 f amber landing glow 0.35→0. Crane on the photo layer: rotateX 4°→0 over f0–40 `bezier(0.3,0,0.2,1)`, scale 1.06→1.0 then +0.035 slow push to the end, perspective 1400. One 600 px warm light band crosses f2–14 at opacity 0.12 (`overlay`). From f42 the elements recede (opacity −12%, saturate −8%), stage light 0→0.5→0.25 at f42/50/58, vignette 0→0.1 f42–54. Wordmark letters at 42 + 1.8i, 8 f, `bezier(0.2,0.75,0.3,1)`, translateY 28→0, scale 1.35→1, blur 8→0. Rule 260×6 grows f58–70; 1 px amber lines shoot 190 px out of each end f58–66 then fade f66–72; letter-spacing breath f62–66; tagline f68–80; **wordmark holds ≥30 f**; fade out over the last 12 f. Gold dust: 20 motes 2–3 px, rising 0.3–0.74 px/f, sway 9–24 px, opacity 0.15–0.35, all index-seeded.
- **DigitRoll**: digit *i* starts at delay + 4i, rolls 22 f `bezier(0.25,0.8,0.25,1)` through one full 0–9 strip and lands; line height 1.15 × font size; tabular numerals.
- **Caption strip**: in over 8 f (opacity + rise 8 px), out over the last 8 f.
- Holds and rests (rules): wordmark ≥30 f; batch motion ends with ≥15 f stillness; opening hero arc ≥3 s; no linear motion.
- Camera: PageCam keyframes `{frame, cx, cy, zoom, rotX, rotY, rotZ, persp}`; push-ins are rotY-dominant side views (34°) with small rotX (8°); info-dense shots stay straight-on.

### Transitions and rhythm
- 36.2 s, 1085 frames, 10 shots: brand open (low energy, 7.3 s incl. hero card) → title card 55 f → feature shot → feature shot → title card → feature → title card → feature → title card → outro at peak (4.8 s). Title cards are the breathing slots between feature shots (1.7–1.8 s each).
- **Warm flash cut** at the 4 hard cuts into feature shots: 10 f centred on the cut (starts 5 f before), opacity 0 → 0.85 at 40% → 0, warm-white radial. Used only to cover hard cuts, never as decoration.
- Other cuts: the brand dissolves (out f76–83) before the page fades in; scenes dissolve to paper over their last 5 f; title cards fade out over 8 f.
- No music bed in the template (SFX only, 30+ cues, volumes 0.25–0.6). Cinematic SFX vocabulary: whoosh on camera moves, impact on landings, riser into the finale, sparkle on the beam, `riser→impact→sparkle` to close; repeated pops step down 0.40→0.25 in six steps at 5 f spacing.

### Finish
Clean digital render, no grain or chromatic effects. Warmth comes from paper tints, warm-brown shadows, a radial "paper glow" behind title cards (`radial-gradient(1100px 750px at 50% 42%, oklch(99.3% 0.014 88 / .85), transparent 65%)`), spotlight pools, a soft vignette only in the outro, and a top-light sheen on the lifted card (`linear-gradient(160deg, rgba(255,255,255,.5), transparent 40%)`). Text must stay razor sharp under zoom: 2× page textures, 4× crop of the hero, CSS `zoom` instead of `transform: scale`.

### 3D look (if any)
No real 3D. Depth is a flat printed page seen by an oblique CSS camera (perspective 1100–1400 px, rotY up to 34°, rotX up to 46° for the pile close-up), translateZ lifts (40–110 px), a top-band blur standing in for depth of field, and one dark brushed-metal table. If rebuilt in Blender this would be a lit paper plane with an image texture and a soft key light from the upper right; the source gives no Blender values, so that translation is mine.

### Banned
From `aesthetic-rules.md` and `TEMPLATE.md`: linear or uniform motion; handheld shake on bright UI promos (Q3); glints or glow sweeps on every card — light effects go to the hero once and must be clipped to its rounded corners (Q4); more than one subject in the opening (Q5); tilted cameras on lists and dense pages (Q6); elements that fly in and hover instead of landing in a real slot (Q9); hand-built fakes of an existing page (Q1); blurry text from `transform: scale` (Q2); using depth of field to fix sharpness; one technique as hero twice, repeated shots or taglines (P4); full-frame beat hits more than 3 times (R4); game-UI sound; `Math.random()`/`Date.now()`; reading text below the size floor (Q11) unless documented.

### Example frames
1. f20 — a centred amber crosshair just drawn, the first glyphs of "AI Foundation Lab" stamping in below it in 132 px black serif on warm paper; by f60 the crosshair has faded and the finished wordmark rests over the typed mono kicker with a blinking amber block cursor.
2. f170 — dashboard tilted 34° from the left, one card hovering 110 px above its slot with an amber beam running its edge, "One card, / *one project.*" floating to its left with a marker bar.
3. f245 — paper title card: "All your team's research, *one* place to go." with the amber word in italic and the 220 px rule under it.
4. f300 — orbit close-up of a 26-card pile on dark brushed metal, warm key light.
5. f800 — the weekly report page writing itself block by block behind an amber caret; by f840 the writing is done and past weeks are dropping into the left rail.
6. f1010 — nine product fragments in an arc, blurred page behind, gold dust, "AI Foundation Lab" in 148 px serif with the amber rule and mono tagline.

### Gaps
Landscape only — nothing is laid out for 1080×1920. Fonts are system stacks, not Google Fonts. Several accent colours exist only as oklch (no hex). The look depends on real product screenshots plus `layout.json`; with no product UI there is nothing for most shots to move. The caption size (22 px) breaks the source's own Q11 floor. The template never calls `spring()`: every "spring" is a cubic-bezier with y > 1 (e.g. `bezier(0.2,1.25,0.3,1)`), so there are no damping / stiffness values to give.

## Shotcraft Lit Stage — dark looks (midnight, aurora, ember, graphite, lime)
- Source: `Vincentwei1021/video-shotcraft` — `demos/_fixtures/Look.tsx` (8 palettes `LOOKS`, type scale `TYPE`, `<Stage>`, `<TextReveal>`, `<Dust>`, `<GridFloor>`, `<Sheen>`, `glow`, `springAt`), `demos/_fixtures/Polish.tsx` (`EASE`, `Grain`, `Vignette`, `SpeedBlur`, `softShadow`, `surface`), `demos/README.md`. This is the "second-round" art direction that most gallery demos were rebuilt on in 2026-10. Licence: Apache-2.0.
- One line: a dark, lit stage — a three-stop vertical gradient, one soft key light from above, a faint accent-coloured fill from the lower right, heavy tinted vignette, moving film grain; bright type and one glowing accent.
- Suits: tech / AI / data promos (midnight), launches and brand moments (aurora), impact and speed (ember), cinematic restrained pieces (graphite), sport / data hits / rhythm edits (lime). Needs real footage? No — designed for generated UI and type (real footage can go inside `ClipCard`). Needs 3D? No; a few cards add three.js scenes on top.

### Palette
One look per shot. Accent only on the hero or key information; `accent2` only as a touch (≤5% of the frame). Stage gradient is top / middle / bottom.

role | midnight | aurora | ember | graphite | lime
---|---|---|---|---|---
stage top | `#0d1426` | `#140d24` | `#1c100a` | `#17181b` | `#141612`
stage middle (52%) | `#090d1a` | `#0b0816` | `#100906` | `#0e0f11` | `#0c0d0b`
stage bottom | `#05070e` | `#06040c` | `#070403` | `#08080a` | `#070806`
key light | `#3d63ff` | `#8b5cf6` | `#ff6a2a` | `#c8ccd6` | `#b8ff3a`
surface (panel) | `#111827` | `#151024` | `#1a120e` | `#16171a` | `#141611`
surface 2 (inputs) | `#172036` | `#1e1733` | `#251913` | `#1e2024` | `#1c1f18`
hairline | `rgba(160,190,255,0.12)` | `rgba(200,170,255,0.13)` | `rgba(255,190,150,0.12)` | `rgba(255,255,255,0.09)` | `rgba(220,255,170,0.11)`
ink | `#f2f5ff` | `#f7f2ff` | `#fff5ee` | `#f4f4f2` | `#f6f8f0`
ink 2 | `#a9b4d0` | `#b9acd6` | `#d4b6a4` | `#a3a5ab` | `#aab09e`
ink 3 (ticks) | `#5d6883` | `#6a5f86` | `#7d6455` | `#5c5f66` | `#5f6556`
accent | `#5b8cff` | `#a78bfa` | `#ff6b2c` | `#ffffff` | `#c6f432`
accent 2 (≤5%) | `#3ee6d0` | `#f472b6` | `#ffc24b` | `#e4c58a` | `#ffffff`
text on accent | `#050816` | `#0b0616` | `#140802` | `#0a0a0b` | `#0b0d06`
shadow (tinted) | `#000208` | `#030108` | `#050100` | `#000000` | `#000000`

Use in the gallery: graphite 12 demos, midnight 10, aurora 10, ember 7, lime 7.

### Typography
Sizes at 1920×1080.
- Faces: sans `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Inter, Arial` (only **Inter** in that stack is a Google Font); mono `"SF Mono", "JetBrains Mono", Menlo` (**JetBrains Mono** is a Google Font); serif `"Iowan Old Style", "Palatino Linotype", Palatino, "Songti SC", Georgia` (no Google Font). The demos deliberately use system fonts and no `@remotion/google-fonts`; a few demos hard-code glyph widths measured on SF Pro.
- Scale `TYPE` (px): mega 260, display 180, h1 120, h2 84, h3 60, body 40, small 32, label 22. Text meant to be read ≥ body (40); headline at least h1 (120); `label` only for ticks and corner marks ("texture" text).
- Default weight 650. Letter-spacing by size: ≥96 px −0.04em, ≥56 −0.03em, ≥28 −0.02em, ≥16 −0.008em, smaller +0.01em; ALL CAPS adds +0.03em. Line-height: ≥90 px 0.94, ≥50 px 1.05, else 1.3. Tabular numerals everywhere.
- Emphasis: accent colour plus `glow()` on one word or number; never more than the hero.

### Layout
Centred stage with the key light at (50%, 8%) and fill at (85%, 90%); optional horizon light band (18% tall) at a chosen height, often 0.86. Hero objects sit in front of the Stage (outside it) so the vignette doesn't darken them. Multi-page shots share one Stage.

### Elements
Panels via `surface()`: radius 14, 1 px hairline (`rgba(255,255,255,0.08)` on dark), top inner highlight `inset 0 1px 0 rgba(255,255,255,0.06)`, two-layer tinted shadow (strength ×2.6 on dark). Glow: text/drop shadow at 6 / 24 / 70 px × strength with alpha 0.55 / 0.45 / 0.30. Dust motes (40, drift 0.25 px/f, 2–18 px, far ones blurred, twinkle), perspective grid floor (horizon 0.62, 1.5 px lines, opacity 0.5, fades into the horizon), one diagonal `Sheen` (18°, width 0.22, strength 0.35, soft-light).

### Motion
- Named eases (`EASE`, cubic-bezier): snappy `(0.16,1,0.3,1)` entrances and pushes; out `(0.22,1,0.36,1)` secondary elements (most used, 437 uses); smooth `(0.65,0,0.35,1)` swaps and camera pans; swift `(0.4,0,0.2,1)` general moves; exit `(0.7,0,0.84,0)` leaving; anticip `(0.5,-0.32,0.25,1)` pull back ~5% before a big move; overshoot `(0.34,1.45,0.64,1)` ~8% past then settle.
- Spring `springAt`: fps 30, default damping 18, stiffness 170, mass 1 (12 lively / 18 crisp / 26 no bounce). Demos mostly use damping 13–16 (13 ×13, 15 ×11, 14 ×8, 16 ×7), mass 0.7–1.1.
- Text reveal `TextReveal` by char / word / line: each unit 18 f, gap 1.6 f (char) / 4 f (word) / 7 f (line), ease snappy; variants **rise** (from under a mask, 105% + 0.3em; 55 uses), **blur** (blur 14→0 px, rise 0.25em; 17 uses), drop (−0.6em with overshoot), scale (1.6→1 + blur 8 px), track (letter gap 0.5em→0). Leave over 12 f with `exit`.
- Stagger `stagger(i, n, span, ease)`: `exit` for "faster and faster", `out` for "dense then sparse".
- Stage "breathing": key light × (1 + breathe·0.12·sin(frame/38)); demos use breathe 0.4–0.6.
- Fast moves get directional `SpeedBlur` (0.45 px blur per px/frame, max 36) instead of `@remotion/motion-blur`.

### Transitions and rhythm
Not fixed by the look; the cards supply them (see "Not styles"). House rules still apply: hold ≥1 s on a brand mark, 0.5 s rest after batch motion, one hero technique per film, ≤3 full-frame beat hits.

### Finish
Film grain on every Stage: SVG `feTurbulence` fractal noise, baseFrequency 0.85, 2 octaves, 256 px tile, new pattern every 2 frames, opacity 0.09 with `soft-light` (dark range 0.06–0.12). Vignette strength 0.55 (dark), clear centre 0.42, ellipse 72% at (50%, 46%), tinted with the look's shadow colour, not pure black. Key light blended with `screen`.

### 3D look (if any)
None defined by the look itself. Cards that are 3D (e.g. `basic-3d-scene`, `terminal-3d`, `carousel-3d`) place flat cards in CSS or three.js space on this stage.

### Banned
More than one look in a shot; accent2 above ~5% of the frame; glow on anything but the hero; more than one sheen per hero, or a sheen not clipped to the rounded parent; `@remotion/motion-blur` for ordinary fast moves (expensive, tints near-still frames grey/yellow); a Stage per page in stacked transitions (vignette and grain double up); heroes inside the Stage under the vignette; `Math.random`/`Date`.

### Example frames
1. graphite: near-black gradient, cool white key light at the top, one white headline in 120 px weight 650 with −0.04em tracking, grain visible in the shadows.
2. midnight: deep navy stage, electric-blue key light, a dashboard panel (`#111827`, 14 px radius, hairline) with one number glowing `#5b8cff`.
3. lime: graphite stage with acid-green `#c6f432` accent on a single data bar, tabular numerals.

### Gaps
Landscape only. Fonts are system stacks (only Inter / JetBrains Mono are Google). No rule for captions or vertical safe zones. The look is a toolkit: each card decides its own timing.

## Shotcraft Lit Stage — light looks (paper, porcelain, sand)
- Source: same files as the dark looks (`demos/_fixtures/Look.tsx`, `Polish.tsx`). Licence: Apache-2.0.
- One line: the same stage system in daylight — a pale vertical gradient, a white key light, a whisper of grain and vignette, near-black ink and one saturated accent (vermilion, cobalt or terracotta).
- Suits: paper = editorial, typography, humanist stories; porcelain = SaaS interfaces and interaction demos (the most used look, 16 demos); sand = warm lifestyle, soft products. Needs real footage? No. Needs 3D? No.

### Palette
role | paper | porcelain | sand
---|---|---|---
stage top | `#f6f2ea` | `#f7f9fc` | `#efe6da`
stage middle | `#f0ebe1` | `#eef2f8` | `#e8ddce`
stage bottom | `#e7e0d3` | `#e3e9f2` | `#ddd0bd`
key light | `#fffaf0` | `#ffffff` | `#fff6e8`
surface | `#fffdf8` | `#ffffff` | `#fbf6ef`
surface 2 | `#f4efe5` | `#f3f6fb` | `#f1e9de`
hairline | `rgba(40,30,20,0.12)` | `rgba(15,30,60,0.10)` | `rgba(70,45,20,0.12)`
ink | `#17130f` | `#0d1324` | `#221a12`
ink 2 | `#5e554b` | `#4c566e` | `#6d5d4c`
ink 3 | `#9b9184` | `#8d96ab` | `#a4927d`
accent | `#e5432d` (vermilion) | `#2f5bff` (cobalt) | `#c4552d` (terracotta)
accent 2 (≤5%) | `#1f5c4a` | `#00b39a` | `#3d5a80`
text on accent | `#fffaf3` | `#ffffff` | `#fff8f0`
shadow (tinted) | `#2a1d10` | `#0c1a3a` | `#3a2410`

Older "first-round" demos use a neutral mock-dashboard palette instead (`demos/_fixtures/Fixtures.tsx` `G`): bg `#ececea`, canvas `#f1f1ef`, panel `#f7f7f6`, card `#ffffff`, ink `#17181c` / `#5d5f66` / `#9b9da3`, fills `#f3f3f1` / `#e7e7e4`, hairline `rgba(20,22,28,0.08)`, single indigo accent `#5b63d3` (soft `rgba(91,99,211,0.11)`), dark scene `#111216` / `#18191e`.

### Typography
Same faces, scale, weights, tracking and line-heights as the dark looks (`TYPE`, `type()`). The paper look pairs well with the serif stack (several typography cards use it); porcelain is sans.

### Layout
Same stage geometry. Light looks run the key light at full strength 0.9 × intensity with normal blending, fill (accent 2) at 0.10.

### Elements
Panels via `surface()`: white, radius 14, hairline `rgba(20,22,28,0.08)`, top inner highlight `inset 0 1px 0 rgba(255,255,255,0.85)`, two-layer shadow (contact alpha 0.12/(1+e/24), ambient 0.08–0.30) by elevation (0 flush, 4 resting card, 16 hovering, 48+ flying). Highlighter bars, pills, cursors and click ripples come from the cards.

### Motion
Same as the dark looks (`EASE`, `springAt`, `TextReveal`).

### Transitions and rhythm
From the cards; paper is used by `shot-transitions`, `wipe-transitions`, `transition-hidden-cut`, `blur-slide`, `title-demote-to-label`, `countdown-arc-scatter`, `sakuga-timing-shift`, `draw-svg-trace`.

### Finish
Grain opacity 0.05 with `overlay` (light range 0.04–0.08), vignette 0.16 (light) — barely there, mainly to stop gradient banding.

### 3D look (if any)
None.

### Banned
As for the dark looks. Plus from the house brand (`assets/brand/BRAND.md`), which the demos show on screen: the shotcraft mark is never rotated and never gets glow, gradient, outline or shadow; amber `#D3923C` is the only brand accent (mix 70% ink `#171714` / 20% paper `#F5F3EE` / 10% amber, amber 3–5% in dense UI); the wordmark is lowercase Avenir Next / Avenir / Inter, weight 700, +0.03em — never an all-caps tech wordmark.

### Example frames
1. porcelain: cool white stage, a white card with hairline and soft shadow, a cobalt `#2f5bff` toggle snapping with a damping-14 spring.
2. paper: warm off-white, a black serif headline rising from under a mask word by word, one vermilion word.
3. sand: beige stage, terracotta accent on a waveform capsule, grain barely visible.

### Gaps
As for the dark looks. No caption style of its own.

## Vibe Life (warm editorial plates)
- Source: `nopefallacy/vertical-video-editing-skills` (the old `nopefallacy/vertical-video-editing` URL is 404) — `skills/video-editing/styles/vibe-life/FRAME.md`, `styles/vibe-life/README.html`, `styles/vibe-life/frame-showcase.html`, plus the style-theming appendix of `skills/video-editing/SKILL.md`. Licence: MIT. Renders with **HyperFrames (HTML + GSAP)**, not Remotion, so easing names are GSAP's.
- One line: a cream-paper zine — oversized grotesque type, a 1.5 px ink outline and a flat "sticker" shadow on everything lifted, one italic serif word per frame inside a peach or butter pill.
- Suits: brand / product explainers, launch posts, creator-tool stories, stat closers; plates between talking-head segments. Needs real footage? No (plates are typographic). Needs 3D? No.

### Palette
role | hex | where used
---|---|---
ground (cream) | `#f3ecd9` | default full-bleed frame ground
ground deep | `#ece2c9` | embedded stage, ledger ground, quiet alternate
surface (paper) | `#faf6ec` | cards, pills, lifted surfaces on the cream
ink | `#161513` | every outline, every flat shadow, inverse ground (ribbon, dark theatre, closer)
muted | `#2a2622` | secondary text
line (dark theatre) | `#1b1a18` | border of the dark theatre
accent peach | `#f0a87a` | the one highlight pill / action chip
accent strong | `#e88c5a` | underline, accent bar
butter | `#f0c860` | selection / voice / active; italic word on dark grounds
moss | `#5b7a4a` | "text agent" state, calm-ready
sky | `#b8c8d8` | "video agent" counterweight
plum | `#6b4a7a` | "edit agent"
ribbon | `#161513` | full-bleed ink ribbon band

Rules: grounds are always full-bleed, never swatches; **one accent at full strength per frame**, any second accent only as a dot inside a mono chip; no hue outside the list. Note: the SKILL.md style-theming example lists *different* hex values for the same names (`--cream #f4efe6`, `--ink #1a1714`, `--peach #f2a07a`, `--butter #f5cf6a`, `--moss #8a9b6e`, `--sky #8fb3c4`, `--plum #9a7aa0`); FRAME.md is the stated source of truth.

### Typography
Faces (all **Google Fonts**, loaded as local woff2 subsets, never from a CDN at render time): **Space Grotesk** (display and body, weight 500 throughout — even the wordmark), **Instrument Serif** italic 400 (the accent voice), **JetBrains Mono** 500 (state and metadata, uppercase).

Sizes are in `cqw` (1% of the frame container's width). FRAME.md says it authors them against the 1920-wide frame (≈px at 1920 in its notes); `_template/FRAME.md` and SKILL.md say 1cqw = 10.8 px at 1080 wide. The px column below is my conversion at 1080 wide.

token | cqw | ≈px at 1080 wide | weight / line-height / tracking | use
---|---|---|---|---
wordmark-mega | 30 | 324 | 500 / 0.84 / −1.6cqw | identity cover, one word
display-hero | 14 | 151 | 500 / 0.92 / −0.6cqw | claims of ≤3 words
display-claim | 9 | 97 | 500 / 0.96 / −0.32cqw | 4–6 words
display-claim-long | 6.2 | 67 | 500 / 1.02 / −0.18cqw | 7+ words
serif-accent-hero | 14 | 151 | italic 400 / 0.92 / −0.2cqw | the one italic word next to display-hero
serif-accent-claim | 9 | 97 | italic 400 / 0.96 | italic word next to display-claim
stat-numeral | 22 | 238 | 500 / 0.88 / −0.6cqw | focal stat
section-head | 4.2 | 45 | 500 / 1.0 / −0.08cqw | ledger / catalogue heads
ribbon-marquee | 4.8 | 52 | 500, UPPERCASE, +0.04em | text in the ink ribbon
stat-ledger | 3.6 | 39 | 500 / 0.92 | ledger numerals
body-lead / body | 1.56 / 1.45 | 17 / 16 | 400 / 1.45–1.5 | running text
card-heading | 1.46 | 16 | 500 / 1.05 | card titles
mono-label-readable | 1.4 | 15 | 500, UPPERCASE, 0.16em | load-bearing mono
mono-label | 0.78 | 8 | 500, UPPERCASE, 0.18em | chrome only

Legibility floor 1.4cqw; in 9:16 it is "re-measured against the long edge", i.e. ≈27 px on a 1920-tall frame. Headline block ≤78cqw wide and stepped down by word count. Italic serif on exactly one word per frame; never italicise the sans; mono is for state labels (`AGENT · READY · DRAFT-04`).

### Layout
Centred anchor by default (identity, claim, focal artifact, closer); don't repeat one anchor more than twice in a row. Safe area 5cqw on the long edge, 5.5cqh on the short edge; nothing touches the edge except a full-bleed ground or the ribbon. Sparse frames are 55–75% empty; ≤2–3 elements per frame (focal + a chip + one accent); one element 3–6× bigger than its neighbour. 9:16 behaviour per treatment: wordmark steps to 36cqw with the italic pill wrapping below; claims drop to display-claim and ≤4 lines; artifact stage 80cqw × 50cqh with card rotation flattened to 0°; ledger 2 × 6; ribbon becomes a vertical mid-band; console 90cqw × 82cqh; stat numeral steps down to 14cqw.

### Elements
Pills (radius 999 px) for every chip, button and nav state; radii small 14, card 22, module 24, stage 32, band 48 px. Outline 1.5 px at chrome scale → 0.14–0.22cqw at frame scale. **Flat hard shadow** `0 0.4–0.6cqw 0 ink` (e.g. card-frame `0 0.5cqw 0`, button `0 0.42cqw 0`, stage `0 0.6cqw 0`), one per surface, never blurred. Components with resolved values: `chip-mono-giant` (surface, 0.16cqw ink border, padding 0.9cqw 1.8cqw), `chip-peach/butter/moss-giant`, `pill-nav-giant(-active)` (0.18cqw border, padding 1.2cqw 2.4cqw, shadow 0 0.32cqw 0; active = ink fill, cream text), `button-primary-giant` (ink pill, padding 1.6cqw 3.2cqw), `highlight-peach/butter-pill` (padding 0.4cqw 2.2cqw, inline, baseline-aligned with the headline), `card-frame` (padding 2.6cqw), `stage-hero` (deep cream, 0.22cqw border, padding 3cqw), `dark-theater` (ink ground, `#1b1a18` border, no shadow), `ledger-cell` (0.14cqw border, radius 14), `ribbon-band` (padding 1.6cqw 5cqw), `state-dot` (1.0cqw). Cards may rotate −1° to +2° to look hand-placed.

### Motion
- "Calm but alive, never anxious." Display type does **not** animate (no kerning-in, no character reveals, no parallax).
- Inside a frame only two things move: the live-state dot pulse (1.6 s ambient) and a mono marquee on the ribbon band (30–40 s per pass, ribbon frames only).
- Dwell: identity cover 1.5–2.0 s, claim 2.5–4.0 s, focal artifact 3.5–5.0 s, ledger 4.0–6.0 s, closer 1.5–2.5 s.
- No springs or numeric durations beyond these; the editorial-look appendix (next style) supplies entrance values that contradict "display type does not animate".

### Transitions and rhythm
**Paper cut**: a clean 80–120 ms swap between plates, never a fade; hard cuts masked by SFX. Section turns may use a **ribbon wipe**: the ink ribbon crosses the frame in 600–900 ms with `cubic-bezier(0.23, 1, 0.32, 1)` — punctuation, not a default.

### Finish
Flat print: no blur on chrome, no layered shadows, no glow. Optional faint paper grid and 4–6% deterministic grain come from the editorial look. Export at native ratio, never letterboxed.

### 3D look (if any)
None.

### Banned
Italic on the sans; two accent pills at full strength in one frame; a kicker chip parked top-left on every frame ("deck reflex"); website layouts (nav + hero + feature grid); soft blur on chrome; any hue, weight, radius or font outside the tokens; invented numbers (a stat is from the script or shown as `— figure —`); dark dev-tool chrome; "pastel AI slop"; layered drop shadows; decorative glow in the dark theatre.

### Example frames
The seven treatments the pack defines:
1. Identity cover — cream, "Vibe" in 30cqw grotesque with italic "life" inside a peach pill, one mono chip at top centre, ~62% empty.
2. Oversized claim — a 3–6 word claim, one word in italic serif inside a butter pill, nothing else, ~70% empty.
3. Focal artifact — a paper card rotated −1° on a deep-cream rounded stage, ink outline and flat shadow, a peach action chip.
4. Agent ledger — deep-cream ground, a 4 × 3 grid of outlined cells, one coloured state dot each (the dense exception).
5. Ribbon break — cream / full-bleed ink ribbon with uppercase cream text / deep cream.
6. Live console — an ink "dark theatre" inset on cream with one butter selection row.
7. Stat closer — ink ground, a huge cream numeral, one butter italic word.

### Gaps
Built for HyperFrames (GSAP), so every value needs translating to Remotion. The cqw basis is stated two ways (1920-wide vs 1080-wide). Palette hex differs between FRAME.md and SKILL.md. `README.html` lists a `design-showcase.html` that is not in the repo. The pack is the brand system of one product called "Vibe Life" (I couldn't tell whether it is a real product): its approved entities, agent roles and agent colours belong to that product and would be dropped in a generic style. No caption style.

## Creator Editorial (vertical-video-editing house look)
- Source: `nopefallacy/vertical-video-editing-skills` — `skills/video-editing/SKILL.md`, appendices "editorial-look", "style-theming", "camera-moves", "sfx-and-audio"; themed with `styles/vibe-life/FRAME.md`. Licence: MIT. HyperFrames (HTML + GSAP).
- One line: Kallaway / Varun Mayya-style talking-head shorts — every frame a designed page: B-roll stacked over the speaker with a serif caption on the seam, boxed highlight-bar supers, a paper stage and a dark grid wall for chapter turns.
- Suits: talking-head and voice-over shorts, news / opinion / tech explainers, creator content. Needs real footage? **Yes** — A-roll talking head or VO is the spine; B-roll clips and screenshots cover it. Needs 3D? No.

### Palette
Roles, filled from the active style pack (values below are vibe-life's): ground `#f3ecd9`, ink `#161513`, accent-strong `#e88c5a` (underlines, accent bars, the lit grid cell), emphasis/butter `#f0c860` (keyword inside bars), paper grid lines = ink at 7% (`color-mix(in srgb, var(--fg) 7%, transparent)`), **dark grid wall `#121110`** with lines `rgba(255,255,255,0.07)`. The reference shorts' red and yellow are treated as roles, never copied.

### Typography
Space Grotesk 500 (heavy-sans statement), Instrument Serif italic 400 (twist word, seam captions, clipping headlines), JetBrains Mono (spec / number / code cards) — all Google Fonts, local woff2. Sizes on a 1080×1920 frame (1cqw = 10.8 px): headline sans and serif 9cqw / 0.96 (≈97 px), sans tracking −0.32cqw, overall line-height 0.95, centred; highlight-bar super 7.4cqw / 1.18 (≈80 px), tracking −0.2cqw; clipping headline serif italic 6.4cqw / 1.15. Serif italic on one or two words max (the verb or the twist); mixed-case serif against caps or title-case sans is the signature. Seam captions: one short phrase at a time ("For *13 years*"), never paragraphs, never full-sentence karaoke.

### Layout
The ten patterns (use the lowest one on the emphasis ladder that does the job):
1. Editorial headline — sans statement + serif-italic twist word + accent underline (46cqw × 0.9cqw, radius 999, 1.6cqw below).
2. Paper stage — off-white ground with a faint 6cqw grid; media sits on it as cards. Hooks, logo beats, UI stacks.
3. Dark grid interstitial — ink wall `#121110`, 4.5cqw grid, a centred mixed-type claim, **one lit accent cell** (blur 0.15cqw); 2–4 cells may flicker (staggered opacity). Hold 0.6–1.2 s. Chapter cards.
4. **Stacked split (workhorse)** — B-roll panel on top (`top: 0; height: 54cqh`, range 52–56cqh), talking head below (`height: 46cqh`), caption centred on the seam at 54cqh (`translateY(-50%)`). Full-frame B-roll is the exception. Panels may sit inside a dark-grid frame for a "mounted" look.
5. Highlight-bar super — type inside solid ink (or accent) bars, padding 0.8cqw 3cqw, `box-decoration-break: clone`, keyword in butter; numbers get the keyword colour.
6. Name pill / seam pill — small rounded pill naming who/what, or holding the serif word at a seam.
7. Headline card (newspaper clipping) — serif italic headline with an ink `mark` bar over the key phrase (padding 0 1cqw), two photo cut-outs in a 2-column grid (gap 0.6cqw) split by a jagged lightning-bolt divider, on the paper stage.
8. UI-card stack ("receipts") — real screenshots as overlapping rounded cards with borders and shadows, alternate cards rotated ±1–2°, one small heavy-sans word beneath.
9. Display word with glow/outline — big heavy-caps word with an outlined-glow twin behind (`-webkit-text-stroke` + accent `text-shadow`), small serif word above. **At most once per short.**
10. Seam caption — small serif italic phrase at a layout seam or in a scrim band over the face, in accent or paper colour.

Emphasis ladder, quiet → loud: seam caption → name pill → highlight bar → editorial headline → glow word. Never two loud patterns in one frame. Every frame is grounded (paper, dark grid or edge-to-edge media); no bare text over raw video without a scrim, bar or pill.

**Face-safe framing**: in any panel holding a person, the face is centred in the visible area with the **eyes in the upper third**; bias the crop with `object-position: 50% <face-y>%` (example `50% 22%` for a 46cqh bottom panel; faces in 9:16 talking-head sources usually sit 20–35% from the top). Default `50% 50%` is "almost always wrong". Check the end pose of every camera move. An off-centre or cropped face fails the gate.

### Elements
Bars, pills, underlines, mark highlights, rounded screenshot cards, a lightning-bolt divider, the lit grid cell. Cards follow the style pack (vibe-life: ink outline + flat shadow).

### Motion
GSAP vocabulary (adopted from hyperframes-helper): `power2.out` / `power3.out` arrivals, `power1.inOut` drifts, `back.out(2)` only on pill pops; `expo` / `back` reserved for accents, never the base camera.
- Underline draws in with scaleX 0→1 (`power3.out`, origin left) after the words land.
- Two-line bars: second bar lands 0.08–0.12 s after the first, `y: 30 → 0`, `power3.out`.
- Name pill: `scale 0 → 1`, `back.out(2)`, a click SFX; exits before the panel changes.
- Clipping: headline types or slides in, the `mark` wipes (scaleX, origin left), photos drop 0.1 s apart with a divider flash.
- UI-card cascade: y-offset + stagger 0.1–0.14 s, `power3.out`.
- Seam caption: fade or rise 20–30 px, timed to the VO clause.
- **Camera (anti-jitter contract)**: animate a `.cam` wrapper, never the clip; `will-change: transform; backface-visibility: hidden; transform: translateZ(0)`; GSAP `force3D: true`; always eased; small magnitudes — push `scale 1.0 → 1.12` over 2–3 s with `xPercent −1.5 → 1.5`, `power1.inOut` (example duration 2.6 s); pan `xPercent ±1.5` plus `scale 1.04` so edges never show; anchor `transform-origin` on the subject.
- Split → full frame: a panel grows (height/y, or width 50cqw → 100cqw) with `power3.inOut` / `power3.out` in 0.45–0.6 s, whoosh on the move.

### Transitions and rhythm
Hook in the first 1–3 s: text supers on top, a pattern interrupt, then a move into frame (a split panel growing to full 9:16); never open on a static talking head. Hook recipe: editorial headline → stacked split with the speaker entering the bottom panel → seam pill → a panel grows to full frame as the body starts. Cuts follow the script's energy, as short as **0.2 s**, never metronomic 1 s. Section turns use the dark grid interstitial or a headline card, never a bare jump cut. Cut B-roll over the A-roll's audio, not in silence. With a calm style pack, keep transitions on-style (hard cuts) and let cut frequency carry the energy.

### Finish
Paper grid at 7% ink; optional deterministic SVG `feTurbulence` grain at 4–6% (fixed seed), never a looping video texture. SFX synthesised with ffmpeg and mixed **−18 to −12 dB under the voice**: whoosh = pink `anoisesrc` 0.45 s, fade in 0.05 s, fade out from 0.2 s over 0.25 s, highpass 300 Hz, lowpass 6000 Hz; click = 2200 Hz sine 0.04 s; riser = rising sweep 0.6–1.0 s; impact = 80–120 Hz sine + short noise burst. Every bar, pill or card landing gets a click or thock.

### 3D look (if any)
None.

### Banned
Uniform 1 s cuts; default fonts; linear or jittery transforms; a stock-template look; opening on a static talking head; bare drop-shadowed text over video; full-sentence karaoke or paragraph captions; more than one glow word per short; two loud patterns in one frame; animating the clip element; `Math.random()`, `Date.now()`, network fetches, `repeat: -1`; `vw`/`vh` units; font CDNs at render time; placeholder or unlicensed media.

### Example frames
1. Hook: cream paper with a faint grid, "Claude Just *Changed* / SOCIAL MEDIA FOREVER" — serif italic verb over heavy caps, peach underline.
2. Stacked split: screen recording in the top 54%, speaker's face in the bottom 46% with eyes in its upper third, "For *13 years*" in serif italic on the seam.
3. Dark grid chapter card: `#121110` wall with a 4.5cqw grid, one glowing accent cell, a mixed serif/sans claim, held 0.8 s.
4. Highlight-bar super: two ink bars with cream text, "**1** out of 3 employees" with the number in butter.
5. Receipts: three rounded screenshot cards cascading at alternating ±2°, one word "connect" below.

### Gaps
HyperFrames/GSAP, not Remotion: easing names need mapping (e.g. `power3.out` ≈ cubic ease-out). Few exact type sizes beyond the CSS snippets; no caption pagination values; no colour grade. The single pre-mixed master audio track advice conflicts with current HyperFrames guidance (noted in our earlier research). "Display type does not animate" in vibe-life conflicts with the animated underline, bars and pills here.

## Mesh Glow Reel (claude-remotion-skill default look)
- Source: `haidrrrry/claude-remotion-skill` — `remotion-motion-graphics/SKILL.md`, `references/design-rules.md`, `references/motion-patterns.md`, `assets/theme.ts`; examples `examples/src/theme.ts`, `examples/src/focuscat/theme2.ts`, `examples/src/components/{Layers,Motion}.tsx`, `examples/src/Root.tsx`. Licence: MIT.
- One line, said honestly: the familiar "AI launch promo" look — near-black ground with two big blurred colour blobs drifting, one glowing purple hero word, everything on screen gently breathing, a tint grade, grain and a vignette on top. Competent and smooth; it reads as a template, and it is exactly the generated look that HyperFrames' own rules ban (mesh blobs, glow, idle breathing).
- Suits: app / product promos, profile promos, logo stings, launch teasers, "30 s Reel" explainers over stills or B-roll. Needs real footage? No (stills get Ken Burns; footage optional). Needs 3D? No.

### Palette
60% base / 30% secondary surfaces / 10% hero; **the hero colour on at most one element per frame**.

palette | base | alt | hero | accent | text / ink | other
---|---|---|---|---|---|---
dark tech (default theme) | `#0A0A0F` | `#12121A` | `#7C3AED` | `#22D3EE` | `#F4F4F5`, dim `#A1A1AA` | glow `rgba(124,58,237,0.4)`
warm editorial ("Claude-like", FocusCat example) | `#FAF7F2` | `#F1EBE1` | `#D97757` | not given | ink `#1F1E1B`, dim `#8A8378` | card `#FFFFFF`, glow `rgba(217,119,87,0.35)`, icon pastels `#7FA99B` `#B48E86` `#8B8FB8`
warm premium | `#1A120B` | not given | `#E8A33D` | `#F4E9DA` | not given | —
clean light | `#F7F5F2` | not given | "one saturated accent" (not given) | — | ink `#1A1A1A` | —

### Typography
- Display: Clash Display, Cabinet Grotesk, General Sans or Satoshi — these are **Fontshare fonts, not Google Fonts** — or "a Google variable font via `@remotion/google-fonts`". The examples actually load **Space Grotesk**, **Inter**, **JetBrains Mono** and **Fraunces** (all Google) with `@remotion/google-fonts`.
- Hero: weight 600–800, letter-spacing −0.03em, line-height 1.05. Reels hero 80–140 px at 1080 wide; landscape 100–160 px at 1920. Example sizes at 1920×1080: hook 130 / 40, bio 118 / 38, CTA 92 / 42, ships 96 / 42.
- Body / captions: Inter (or system) 400–500 in the dim colour.
- Emphasis: one word per headline — hero colour + glow, or an animated underline, or a pill scaling in behind it 5 frames after the word lands. Numbers: tabular counters.
- Word-synced captions: heavy display weight, 2–4 words per page, active word in the hero colour, at ~65% of frame height, `combineTokensWithinMilliseconds: 1200`.

### Layout
Five-layer stack in every scene, bottom → top: background mesh → assets → graphics/type → colour grade → grain + vignette. 9:16: keep critical text inside the middle ~75% vertically; nothing touching the edges. Stills masked into rounded cards (radius 32, `1px solid rgba(255,255,255,0.08)`, shadow `0 40px 80px -20px rgba(0,0,0,0.6)`). Use pixel gaps, not `em`, between big text blocks (em resolves against the parent's 16 px).

### Elements
Mesh blobs (two radial gradients: hero at alpha `33` ≈20%, accent at `22` ≈13%; 1200 and 900 px circles blurred 50 / 70 px in the reference, 1400 / 1100 px blurred 60 / 80 px in the example); a 12-ray spark logo mark; glow `0 0 60px hero66, 0 0 120px hero33`; Ken-Burns stills; counters; synthesised SFX (noise whoosh, pitch-drop pop, sine thump, detuned pad). No emoji as icons (they ignore the palette).

### Motion
- Theme eases: out `bezier(0.16, 1, 0.3, 1)` (entrances), inOut `bezier(0.83, 0, 0.17, 1)` (moves, Ken Burns), in `bezier(0.7, 0, 0.84, 0)` (exits only). Linear is "forbidden"; always clamp both sides.
- Springs: snappy `{damping 14, stiffness 160, mass 0.6}` (UI pops, words), smooth `{20, 90, 1}` (big elements), bouncy `{11, 170, 0.7}` (logos, playful accents).
- **Premium entrance**: smooth spring driving opacity 0→1, translateY 40→0 px, scale 0.94→1 (2–3 properties, never a lone fade).
- **Word reveal**: per-word snappy spring, translateY 30→0, 3 f per word, word gap 0.26em.
- **Stagger**: words 3 f, cards / list items 4–5 f, big blocks 6 f; nothing enters simultaneously.
- **Exit**: last 12 → 2 frames, translateY 0→−42 px with ease `in`, opacity 1→0 (≈10 f vs ≈20 f entrances).
- **Ken Burns** on every still: scale 1→1.08 (component default 1.1) with the inOut ease, pan 0→−25 px over the shot (the pan has no easing in their code — linear, against their own rule); alternate zoom in / out between shots.
- **Counter**: spring `{damping 30, stiffness 60}` mapped to 0→target, tabular numerals.
- **Spark mark**: 12 rays, each a snappy spring delayed 1.2 f; container bouncy-spring scale and smooth-spring rotation −120°→0; drop-shadow size × 0.25 in the glow colour.
- **Idle breathing** (anything on screen >2 s): scale 1 + sin(frame/22)·0.015, float sin(frame/30)·3 px, drift 0→−20 px over 300 f.
- **Mesh drift**: blob 1 x + sin(frame/55)·50 px, blob 2 x − cos(frame/70)·40 px.
- **Parallax**: x 0→−120 px over 90 f (inOut); layers at 0.3 / 0.6 / 1.0.
- Motion blur for anything >30 px/frame: `<Trail layers={4} lagInFrames={0.4}>` from `@remotion/motion-blur` (I have not checked that `Trail` and these props exist in 4.0.535 — please confirm before relying on it).

### Transitions and rhythm
- Scene rhythm: HIT → hold 15–20 still frames → build → HIT. Something moves in the first 15 frames; a new visual element at least every 90 frames; ≥3 moments of stillness per video.
- 30 s Reel: 0–1.5 s hook (boldest visual + claim) · 1.5–3 s context · 3–22 s body (3–4 beats) · 22–27 s payoff (biggest animation) · 27–30 s CTA (calm, glow on the CTA word).
- 5 s logo sting: mark 0–0.8 s → wordmark 0.6–1.8 s → tagline 2–3.5 s → breathe → exit in the last 0.5 s.
- Transitions: `@remotion/transitions` `slide({direction: "from-right"})` with `linearTiming({durationInFrames: 12})`; hand-rolled 8–14 f: whip pan (background moves 1500 px in 6 f with blur 8 px, cut hidden mid-whip), scale-through (A to 1.3 + fade while B scales 0.8→1), brand-colour mask wipe.
- Sound: whoosh/click starting 2–3 frames **before** the visual lands; riser into a cut, bass hit on it; music bed 0.2–0.3 (≈ −18 dB under VO/SFX); cuts on beats at `framesPerBeat = fps × 60 / BPM`.

### Finish
- Grade (above content, below grain): hero colour fill, `soft-light`, opacity 0.18 (0.10–0.15 light themes, 0.18–0.25 dark), plus `linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))`. Per-asset fix `saturate(1.1) contrast(1.08)`.
- Grain: SVG `feTurbulence` fractalNoise, baseFrequency 0.9, 2 octaves, 220 px tile at 0.5, position offset (frame·7, frame·13) for flicker, opacity 0.05, `multiply` on light / `overlay` on dark.
- Vignette (topmost): `radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.22) 100%)`.
- Render masters `--codec h264 --crf 16` (17 in the SKILL); `--image-format png` for heavy transparency.

### 3D look (if any)
None in the skill. (One example, `CodeEdit`, fakes a 3D code shatter with CSS — see the next style.)

### Banned
Linear easing (their rule); unclamped interpolation; lone fades; simultaneous entrances; flat solid backgrounds; more than one glowing / hero-coloured element per frame ("Vegas"); default system fonts on hero text; emoji icons; delivering without extracting and inspecting frames; `<Video>` (they mandate `<OffthreadVideo>` — current Remotion docs point to `<Video>` from `@remotion/media`, so this rule is dated).

### Example frames
1. Near-black `#0A0A0F`, a purple blob glowing top-left and a cyan blob bottom-right, "Ship faster" in 130 px Space Grotesk 700 with "faster" in `#7C3AED` and a double glow, grain over everything.
2. Logo sting: 12 purple rays springing out around a centre while the mark rotates in from −120°.
3. Warm editorial: `#FAF7F2` ground, Fraunces headline in `#1F1E1B`, one terracotta `#D97757` word, a white card with a soft shadow.

### Gaps
Its own examples are mostly 1920×1080 (one 1080×1080) despite the Reels framing. No caption style beyond one paragraph. SFX "2–3 frames before" contradicts shotcraft's measured peak alignment (§S5). Fontshare display faces need manual licensing/loading. The look has no distinct identity of its own — it is a set of anti-amateur defaults.

## Syntax Glow (claude-remotion-skill CodeEdit example)
- Source: `haidrrrry/claude-remotion-skill` — `examples/src/codeedit/CodeEdit.tsx` (an example built with the skill, not a documented style). Licence: MIT.
- One line: the camera lives inside a dark code editor — glowing syntax colours, beat-locked zoom punches, an RGB-split glitch, then a 3D shatter of code fragments.
- Suits: developer / AI-tool promos, beat-synced edits. Needs real footage? No. Needs 3D? CSS 3D only.

### Palette
role | hex
---|---
background | `#070B14`
keyword | `#C792EA`
string | `#8CE99A`
function | `#82AAFF`
number | `#F78C6C`
punctuation | `#5C6B8A`
identifier | `#C9D8F0`
comment | `#49567A`
tag / title | `#F4F6FB`

### Typography
JetBrains Mono (Google) 28 px, advance 0.6 × size, line height 44 px, page padding 70 px, at 1080×1080. Finale title 88 px, URL 34 px with `0 0 18px rgba(140,233,154,0.5)` glow; fragments 20–34 px with `0 0 16px <colour>88`.

### Layout
Square 1080×1080; a full code page as the "world"; the camera brings a world point to the centre at scale s.

### Elements
Syntax-coloured code, hidden messages inside strings, coloured code fragments.

### Motion
600 frames (20 s) at 30 fps, every cut on 15-frame beats (120 BPM). Whip zoom-out scale 3.1→0.9 in 18 f with blur 0→9→0; beat punches spring `{damping 16, stiffness 220, mass 0.5}` with blur 10→0 over 4 f; glitch: two RGB copies (`screen`, opacity 0.55, `hue-rotate(-70deg)` / `120deg`, ±13 px jitter) and `invert(1) hue-rotate(180deg)` flashes; shatter: rotateY frame·0.12°, rotateX sin(frame/90)·4°, scale 0.7→1.25 over 180 f; tag spring `{12, 150, 0.7}`, URL spring `{16, 120, 0.8}`; a whip blur 0→14→0 over f412–428 into the finale.

### Transitions and rhythm
Beat-cut; whip blur; glitch.

### Finish
Glows only; the example sits inside the skill's grade / grain / vignette stack.

### 3D look (if any)
CSS 3D fragment cloud (translateZ per fragment). Not a Blender look.

### Banned
Not stated beyond the skill's rules.

### Example frames
1. Extreme close-up of one line of glowing code, drifting.
2. A zoom punch onto `agent_skills` on the beat, blur snapping out.

### Gaps
Thin: one example file, read for values only; square format; no documentation of intent.

---

## Style-pack formats seen

### vertical-video-editing: `styles/<name>/FRAME.md`
One folder per style; the file is always `FRAME.md`; the editor defaults to `vibe-life` when no style is named. Optional `frame-showcase.html` (a contact sheet of every treatment at true proportions, sized in cqw) and `README.html`. "Keep the same token *roles* across styles (ground, accent-strong, emphasis, ink) so the layout patterns map onto any style."

**YAML frontmatter — "normative source of truth":**
- `colors:` named hex tokens in two groups — *grounds* (`bg`, `bg-deep`, `surface`, `fg` = ink for every outline and text, `muted`) and *accents* (`accent`, `accent-strong`, `emphasis`; vibe-life adds role colours per agent). Rule baked into the template comments: "fire ONE at full strength per frame".
- `typography:` named tokens, each `{fontFamily, fontSize, fontWeight, lineHeight, letterSpacing?, textTransform?, fontStyle?}`, split into a **reading ramp** (body, card-heading, mono-label; legibility floor ~1.4cqw) and a **display/hero ramp** (wordmark-mega 30cqw, display-hero 14cqw for ≤3 words, display-claim 9cqw for 4–6 words, serif-accent-hero, stat-numeral 22cqw). Sizes in `cqw`.
- `rounded:` radius scale (`pill 999px`, `small`, `card`, `stage`).
- `spacing:` `frame-pad` (long edge), `frame-pad-short`, `card-pad`, `chip-gap`.
- `components:` atoms with resolved values `{backgroundColor, textColor, border, rounded, typography, padding, shadow}` that reference other tokens with `{colors.x}` / `{typography.y}` / `{rounded.z}`.

**Prose sections (intent):**
1. Motto line ("Atoms are sacred · composition is free").
2. Overview + **Craft bar**: squint test (one element 3–6× its neighbour), silence test (sparse frames 55–75% empty, named density exceptions), restraint test (name the scarce element that fires once per frame), reference bar (what good and failure look like).
3. Colors (which tokens are grounds, which is ink, which accents are rationed; "no invented hues").
4. Typography (two ramps, the one accent voice, the floor).
5. Layout — The Frame (ratio, safe area, `cqw`/`cqh` only).
6. Elevation & Depth (the depth ceiling, e.g. one flat ink shadow).
7. Shapes (radius usage) — in vibe-life.
8. Components (intent per atom; values stay in frontmatter).
9. Motion & Timing (calm vs punchy, cut grammar, section-transition device, what may move inside a frame, dwell per archetype).
10. **Frame Treatments** (vibe-life) — each archetype as a block with fixed fields: *Ground · Container · Composes · Focal · Chrome · Accent · Silence (% empty) · Fixed vs Free · Density · Construction note*.
11. Do's and Don'ts.
12. Aspect-Ratio Behavior table (treatment × 16:9 / 9:16 / 1:1).
13. Approved Real Entities & Numerals (what names may appear; numbers never invented).
14. Pre-Render Self-Audit checklist (squint, silence, restraint, weight, depth ceiling, geometry, anchor, element count, floor, fidelity, no invention).
15. Known Gaps.

**How it is consumed:** the editor converts FRAME.md into a project-level lowercase `frame.md` design spec: palette → CSS custom properties on `:root`; fonts → local `@font-face` woff2 (largest latin subset); motion personality → easing and cut style ("paper-cut / calm" → hard cuts masked by SFX, `power1.inOut` drifts, no `back`/`elastic` on the spine; "energetic" → faster cuts, `power3.out`, occasional `back.out`); graphic language → reusable motion-graphic recipes. Any deviation is logged in `edit-report.md` under "Design decisions".

**What it lacks** (relevant to our format): motion is prose only (no numeric easing / duration / spring fields); no transition schema, no audio, no caption spec, no 3D, no sample scenes beyond the treatments.

### video-shotcraft: four layers instead of one file
1. **Visual direction, derived from the product** (`references/pipeline.md` stage 1, `guided-free-creation.md` §3, SKILL.md core idea 2). Before any styleframe, extract from the product's design system, source or computed styles and write into a design spec: font families and weights, size ladder, line-height / tracking, grid, spacing, alignment, information density, corner radii, and colour roles (background / surface / body text / accent / status), gradients and materials. Every title, caption, number, title card, layout, transition, particle and light effect must reuse or *restrainedly extend* those tokens. Templates and cards contribute only shot structure, motion grammar, rhythm and tuned parameters — type, layout, colour and material are re-skinned to the product. Deviating for story reasons must be justified (co-creation: user confirms; autonomous: written into the spec). Then: up to **3 text directions**, each with name, one-sentence visual claim, 3–5 keywords, fonts / colours / materials, camera-motion personality, why it fits, trade-offs; Ink Press is offered only if the product genuinely suits paper / editorial texture. Chosen direction → **styleframe**: a pure HTML/CSS page with 2–3 static 1920×1080 key frames (brand open, core feature, brand close) built from real page captures or the extracted tokens, screenshotted with Playwright/Puppeteer; no Remotion code. With a reference film: extract ~100 frames, tile 4×5 contact sheets, and write a motion breakdown table `technique | how the reference does it | adopt / drop`. Skip the styleframe only with a strict brand guide, a clear reference film, Ink Press chosen, or explicit permission — and record why.
2. **Brand → motion personality tokens.** Place the brand on two axes — *energy* (low = calm / premium / institutional ↔ high = sport / startup / entertainment; sets duration, overshoot, squash) and *tone* (serious = finance / medical / enterprise ↔ playful = consumer / social / kids; sets path curvature and amount of secondary action) — then start from the nearest preset (30 fps):

   preset (category) | main duration | entrance easing | overshoot | squash
   ---|---|---|---|---
   professional trust (fintech / enterprise / B2B) | ~21 f | `bezier(0,0,0.2,1)` | 1.0 (none) | 0
   refined premium (luxury / fashion) | ~48 f | `bezier(0.4,0,0.6,1)` | ≤1.02 | 0
   bold energetic (sport / games / startup) | ~18 f | `bezier(0.16,1,0.3,1)` | 1.12 | 0.25
   playful joyful (consumer / social) | ~27 f | `bezier(0.34,1.56,0.64,1)` | 1.08 | 0.18
   calm caring (health / education) | ~42 f | symmetric ease-in-out | 1.0 | ≤0.04
   warm friendly (small business / community) | ~26 f | `bezier(0.25,0.46,0.45,0.94)` | 1.04 | 0.08

   Checks: three words describing the film's motion must match the brand words; one token set governs entrances, transitions *and* hold rhythm ("one brand, one motion voice"). Hard precedents beat presets: anything that lands with a bounce needs bezier y1 > 1 even in the "no overshoot" preset.
3. **Theme presets over a fixed template** (`template/src/themes/`, `THEMES.md`): `palettes.json` holds 7 semantic roles per preset (`page, surface, field, text, muted, accent, border`); derived roles `pageRgb, accentRgb, shadowRgb (= text), lightRgb (= surface), stage (= field)`; each scene exports `*_DEFAULTS` (copy, sizes, colours) as props while easing, timing and camera keys stay constants; per-preset size overrides (`sceneDefaults`); a manifest with `themes[]`, `defaultTheme`, `themeProp`, `paletteProp`, per-unit `themeKey`; precedence **schema defaults → preset defaults → project palette → explicit clip edits**. Saved palettes export as version-1 `shotcraft-palette` JSON. Recolouring works by re-rendering trusted SVG copies of the demo UI with new HEX variables — never by filtering pixels.
4. **Look objects for generated scenes** (`demos/_fixtures/Look.tsx`): a `Look` is `{name, dark, bg[top, mid, bottom], light, surface, surface2, line, ink, ink2, ink3, accent, accent2, onAccent, shadow}`, plus a shared `TYPE` scale, `type(size, weight, {caps, serif, mono})`, a `Stage` (key light, fill, horizon, intensity, breathe, grain, vignette) and `EASE` / `springAt` presets. "One look per shot."

Around those, three more structured formats:
- **Shot recipe card** (`references/shots/<category>/<name>.md`): frontmatter `name`, one-liner, suits, duration, energy, tags; sections *Intent*, *Motion core*, *Parameter table* (`parameter | typical value | tuning feel` — every row says what breaks if you go above or below), *Sound* (SFX pinned to frames), *Known pitfalls* (values marked as "lifeline" may never be downgraded), *Reference implementation* (exact demo TSX). The gallery index `gallery/api/library.json` adds `summary, use, duration, energy, intention, source, category, tags, addedAt` and `styles[] {key, label, description, media.url}` (150 styles over 124 cards); a style may be flagged "reference only, needs custom implementation" or "missing preview".
- **Sequence template** (`references/sequences/promo-energy-arc.md`): slot table `slot | share of duration | energy | job | candidate cards` plus a fill-in procedure (budget holds first, then motion).
- **Aesthetic rules as case law** (`references/aesthetic-rules.md`): each rule = one executable sentence + the precedent (the user's words and the rework) + a self-check question; codes R (rhythm), Q (quality / camera / composition), S (sound), C (copy), P (process) are never renumbered; a rule may be broken on purpose only if the breach is written into the project spec. The final review walks every code and answers `code ✓` or `code ✗ (shot / frame)`.

---


## Not styles, but useful parts

All shotcraft values are at 1920×1080 @ 30 fps unless stated; "f" = frames.

### Shotcraft components (`assets/lib/`, copied into a project, not imported)
- **PageCam** (`assets/lib/PageCam.tsx`, template copy `template/src/aifl/live/PageCam.tsx`): 2.5D camera over a full-page screenshot. Keys `{frame, cx, cy, zoom, rotX?, rotY?, rotZ?, persp?}` (persp default 1400; smaller = stronger), interpolated per segment through one ease (default `bezier(0.33,0,0.15,1)`); children positioned in page CSS px (same space as `layout.json`). Flat mode = `translate(960−cx·zoom, 540−cy·zoom) scale(zoom)`. 3D mode applies magnification with **CSS `zoom`** (layout-level, so text rasterises at the enlarged size) plus `translate(960/zoom − cx, 540/zoom − cy) rotateY rotateX rotateZ` about (cx, cy) and `perspective: persp·zoom`. Optional `blur`, `saturate`, and a depth-of-field band (`dof {focusY, strength}`: a top band with `backdrop-filter: blur`, mask 100% → 100% at 45% → 0). The lib copy adds an absolute `frame` override for use inside `<Sequence>`. Hard-codes the 1920×1080 viewport centre (960, 540).
- **ClipCard** (`assets/lib/ClipCard.tsx`): wraps an mp4 as a square rounded "card hero" so card-designed camera rigs can drive real footage. Defaults: size 560, radius 20, body `#111116`, border `1px solid rgba(255,255,255,0.10)`, shadow `0 24px 80px rgba(0,0,0,0.55)`, muted; optional mono caption bar (height 2.6 × captionSize, default 17 px — raise to ≥32 px on small cards; accent `#4da3ff` "▸"). Seamless loop via overlapping `<OffthreadVideo>` layers (step = loop − startFrom − crossfade; crossfade default 8 f) with complementary opacity *and* volume envelopes; layer count from the enclosing shot's `durationInFrames`. Written against Remotion 4.0.484, where `OffthreadVideo` has no `loop`.
- **DigitRoll** (`assets/lib/DigitRoll.tsx`): odometer. Digit *i* starts at `delay + 4i`, rolls 22 f `bezier(0.25,0.8,0.25,1)` through one full 0–9 strip and lands; line height 1.15 × size; tabular numerals; default 30 px, colour oklch(52% 0.115 65).
- **FlashCut** (`assets/lib/FlashCut.tsx`): warm-white radial bloom over a hard cut; 10 f; opacity 0 → 0.85 at 40% → 0; `radial-gradient(ellipse at 50% 45%, rgba(255,248,235,0.98), rgba(255,244,224,0.55) 55%, transparent 80%)`; place at `from = cut − 5`. Only to cover a hard cut, never as decoration.
- **Caption** (`assets/lib/Caption.tsx`): bottom info strip, mono 22 px, 0.14em, uppercase, `oklch(45% 0.006 82)`, 6×6 amber square, 72 px from the bottom; 8 f in (fade + 8 px rise), 8 f out. Its own comment: 22 px is below Q11 (≥56 px); as a narrative subtitle raise it to 56–60 px or document the exception.
- **FlatPanel** (three.js): a paper card lying on a desk with a radial contact-shadow texture `rgba(58,51,42,0.32)→0`; needs `three`, `@react-three/fiber`, `@remotion/three`.
- **VerticalTicker**: infinite tilted multi-column scroll wall (perspective 1000, `rotateX` tilt, scale to cover); items duplicated, translateY 0 → −50% modulo, `marginBottom = gap` so the loop point is invisible. Its header says it was absorbed from "vibe-motion/skills remotion-3d-ticker" — a third-party origin whose licence I did not check.
- **helpers**: `mulberry32(seed)` PRNG; `handheld(frame, amp = 0.012)` layered sines (0.31/0.83 and 0.47/1.13 rad/f) — banned on bright UI promos; `Rig` three.js camera keyframes `{frame, pos, look, fov (default 36)}` eased `bezier(0.4,0,0.2,1)`; `velocityAt` (central difference ±0.5 f); `lagged(stateAt, frame, delay)` for follow-through (shadow 2 f, ghost 4 f); `dampedSettle(t, freq ~0.1, damping ~0.15) = e^(−damping·t)·sin(2π·freq·t)`.

### Shotcraft rules worth lifting (`references/aesthetic-rules.md`, `SKILL.md`)
- **Minimum text height (Q11)**: narrative captions ≥56 px effective (≥5.2% of a 1080-tall frame; 60 px recommended); auxiliary text (subtitles, stats, URLs) ≥32 px (≥3%). Effective height = font size × every ancestor scale × perspective compression (≈cos(rotY)); measure rendered pixels, not code. Text is either "texture" (decorative, visibly blurred or dimmed so nobody tries to read it) or "to read" (sized and contrasted, with a scrim on light grounds) — nothing in between; delete text that can't be read. The closing URL / CTA is the line that must not be small. Check: shrink a frame to 480 px wide. (For a 1920-tall vertical frame, 5% / 3% of height would be 96 / 58 px — my arithmetic; the source only states the 1080p case.)
- **Each technique is the hero only once (P4)**: one animation technique (fly-in, stack, page-turn…) leads at most once per film; repeated shots, information or taglines are deleted; every shot must answer "what new information does it give?".
- **Breathe (R1, R3)**: ≥1 s hold after the brand mark lands; ≥0.5 s (15 f) stillness after batch motion; opening hero arc ≥3 s. Their feedback history was one-directional — always "slower", never "too slow".
- **Acceleration (R2)**: no uniform motion; mass entrances accelerate on a physical metaphor ("dealing cards"), then rest 0.5 s.
- **Beat hits (R4)**: full-frame / camera-level beat impacts ≤3 per film, ≥16 beats apart, on the strongest hits; beat-pump runs ≤4 beats and once per film; every other beat moves element layers only.
- **Light effects (Q4)**: no mass glints; one high-quality light effect per hero, clipped to its rounded corners.
- Also: opening = one subject (Q5); info-dense shots straight-on (Q6); object close-ups = side tilt + visible height + orbit + contrasting dark material (Q7); finale = "launch group photo" at peak energy (Q8); fly-ins land in real slots (Q9); mock documents at publication density (Q10); 3D annotations live in the same 3D space, large serif + marker highlight (C3); no handheld shake on bright UI (Q3).
- **Sound**: cinematic vocabulary (whoosh / impact / riser / sparkle / transition), real-object foley over game-UI bleeps, `riser → impact → sparkle` to close; repeated SFX alternate two samples, step the volume down (0.40 → 0.25 in six steps) and accelerate with the animation; SFX table `{from, src, volume}` with a comment per row, re-pinned whenever the timeline changes; a measured AAC priming offset (2032–2066 samples ≈ 1.27–1.29 f at 48 kHz / 30 fps in their pipeline) subtracted globally: `from = target peak frame − source peak lag − output offset`.
- **Deterministic**: no `Date.now()` / `Math.random()`; seeds derived from indices.
- **Review**: a clean-context sub-agent reviews with frame-numbered evidence; the maker never does the first check.

### Shot recipe cards: the 10 categories
Folder counts (124 cards; the gallery lists 150 styles because several cards hold A/B/C variants): Opening & Brand 11 · Typography & Title Cards 22 · UI Entrance & Showcase 21 · Camera & Space 10 · Data & Metrics 5 · Interaction & Feature Demo 11 · Transitions 15 · Rhythm & Montage 8 · Light & Emphasis (`effects/`) 15 · Outro 6. Online gallery: https://vincentwei1021.github.io/video-shotcraft/ (it opens; I read its index and `api/library.json` but did not watch the 150 preview videos). 38 cards re-implement techniques studied from other people's published work (the anime.js site, remotion-bits.dev, motion pieces on X and Douyin, and two commercial promos — Firecrawl and Willow Voice); `references/shots/ATTRIBUTION.md` says no original footage, art or code is included and that "publicly released" is not a licence.

For every card I read the frontmatter and the full parameter table; for the starred ones I also read the motion core. ★ = standout. "Vertical?" is my judgement of how easily it moves to 1080×1920.

#### Opening & Brand (`references/shots/opening/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
★ brand-ink-open | crosshair draws, wordmark letterpresses glyph by glyph, mono kicker types, 1 s hold, lifts away | 83 f · low | see Ink Press "Motion"; the kicker's 0.7 f/char is for decorative text only (interactive typing is 3 f/char); exit 7 f | easy
crane-rise-reveal | starts tight on one data row, cranes up and back to reveal the dashboard | 165 f · mid-high | start scale 3.0, hold ≥20 f; rise 102 f `bezier(0.2,0,0.25,1)` 3.0→1.0; other rows 38%→100% 26 f after lift-off; ~24 f light-wash per row as the camera crosses it; ≥30 f still; uses `@remotion/motion-blur` | needs a tall page
dataviz-landscape-open | light streams merge across a dark data landscape under a slow forward flight | 5–8 s · low rising; ≤1 per film | 8–14 tributaries → 1 trunk (>16 reads as a screensaver); pinhole F 1100, camera height 220, horizon 0.39 H; 950 units / 180 f `bezier(0.3,0.3,0.55,1)` + lateral −140→110; near blur 11 px, fog beyond Z′ 2600; trunk 30–40 f out-cubic, branches 3–6 f apart; 5–9 labels scaled 1500/Z′ (0.7–1.7); butt line caps | horizon must move
fracture | 25 3D tiles fly from scatter into a poster in a centre-out ripple, hold, then blast outward | 156 f · high | 5×5 tiles 380×230, perspective 900; scatter dx ±450 / dy ±300 / dz −210…+490; 0.045 per ring, 0.34 each inOutCubic; exit at 0.70 + delay×0.5, 0.18 inCubic, 620–880 px, done before t≈0.97; `@remotion/motion-blur` | regrid needed
icon-field-colorize | a grey icon field staggers in; brand-colour bands ripple down and light it | 3–6 s · mid | 170 icons (17×10, pitch 108×106, keycap 66); fill-in ~48 f; flip 12 f original / ~30 f demo; 4 bands of one hue family (gold → amber → orange → coral); 1.4 f/row + 0.25 f/col; pop 1.22× sine 4 f | regrid
letterspace-materialize | every letter of a widely tracked wordmark draws in parallel and finishes on the same frame | 3–4 s · low | ~50 f (f16–68), zero stagger, continuous path; tracking ~0.6em; glyph aspect ~1.07; ≥30 f hold | short words only
magician-card-flourish | a blue starburst flashes on black for 0.3 s; a card shoots out spinning and freezes near full frame | 156 f · high | flash 9 f, burst turns 90°; launch slow-in 14% → burst; spin decay power 2.4 over the last 60%; hard freeze, no rebound; card 86% of frame height (94% without copy); `@remotion/motion-blur` | easy
orbit-ring-title-open | eight 16:9 cards orbit an ellipse; the headline de-blurs; a marker block sweeps the key phrase | 150 f · mid | RX 720 / RY 380; 0.3 rad/s (>0.5 strobes); ring 0.62→1 f0–24 expo-out; card *i* fades at 2+1.5i over 11 f; playback from f24; depth ±12%, blur ≤1.6 px; title 64 px/500 + 156 px/600; glyph stagger 1 f / 2 f; marker f50, spring damping 20, `#c6f432`; exit blur 0→6.5 px | ring too wide
★ spotlight-hero-card | a spotlight picks one card; side push-in; the card lifts for two outline passes and settles back | 172 f · mid | still zoom 0.8 f0–40 → 18 f push to 2.6, rotY 34°, rotX 8°, persp 1200, focus 105 px left / 10 px up of the card centre; page multiplied 0.90–0.94; 3 spotlight stops f4→28, pool 400→300, +6% pulse, warm soft-light 0.24; volumetric beam from (pool.x+420, −720), screen 0.34→0.06; rise 10 f `bezier(0.2,1.25,0.3,1)`, hover 58 f (bob 4 px, period 40 f, z = 110·lift), reseat 18 f, press 0.997; laps f68–82 (stroke 5 + 2.5) and f88–108 (3.5 + 1.75 at 0.62), dash `0.16 1`; 30 f hold | easy (one card)
stroke-segment-build | disconnected neon strokes light in a scrambled order and read only at the end | 165 f · low → mid | 4 letters / 16 segments, tube 30 px; key segments last; gaps 9 f → 3 f, 14 f breath, 7 f / 6 f final beats; brightness 0.58 → 1.0 + 1.25 surge; landing pulse 1.02; wall light 0.12 + 0.5 × lit share; reflection blur 5 px at 0.42; 2 s hold | short words
text-as-mask | footage moves inside giant letters, then the type expands until the footage takes over | 165 f · mid-high; needs footage | 470 px / 900, tracking −22, ~72% of width; drift ~3.8 px/f; inhale 8 f 1→0.965; push to 46× over 24 f in log space (t^1.8); hold ≥30 f | stack the word

#### Typography & Title Cards (`references/shots/typography/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
★ blur-slide | words rise into place with offset, blur and opacity on one shared ease; subtitle follows | 120 f · low | stagger 4 f (sub 2.4 f); 22 f per word (hero word 30 f, sub 20 f), `EASE.out`; rise 64 px ≈0.38em (sub 26 px); blur (1−p)·18 px (sub ·9); title f10–60, sub f34–80; 170 px serif 400 + 46 px sans 400; ~40 f tail | easy
brace-expand | braces spring apart to title width; text revealed in the gap | 120 f · mid | braces hard-cut in at 6 f; spring from 14 f, damping 14 / stiffness 130 (≈9% overshoot); half-span 676, inner 64 → cavity 1224 px; scale 0.4→1; braces 300 px, text 164 px; tracking −0.05→−0.03em f40–64; SpeedBlur 0.22 / max 16 | narrower cavity
countdown-arc-scatter | numbers on an arc sweep and brake; the winner slides out to start the headline | 100 f · high | [45,35,28,22,17,10,5,4,3] every 24°; R 700, centre below frame; wind-up +3° 5 f → spring 99°→0°, damping 12 / stiffness 60; window (70 − abs(pa))/22; the "5" flies f32–52 `EASE.swift` 112→150 px; others fade f28–44 + blur·6; needle 0.35×; last word tints f64–76 | arc spans the width
document-typewriter-reveal | a typeset document writes itself behind one caret; side rails open; history drops in | 150 f · low-mid | 20 blocks in pairs at 8 + 4.4g, 9 f wipes `bezier(0.4,0,0.6,1)`; 3 px caret on the newest block only; @-wash +4 f, 8 f, multiply; rails at f54 / f62; history ×6 at 66 + 5i, 9 f, `bezier(0.2,1.15,0.3,1)`; camera zoom 1.42 rotY −18° rotX 8° → 1.24 (f26) → 0.86 (f64) → 0.74 (f104) → 0.746 (f150) | crop to the column
flying-words | keywords rush past the camera through a perspective tunnel, two loops | 180 f · high | 22 words, size 20+rand·16 (native 64–120); z −1750→+800, persp 1100; spread 0.5+u·1.35; life [0,1,0.5,0.2,0] at [0,0.25,0.6,0.85,1]; 2 integer cycles; blur from u>0.86; midnight palette | easy
glitch-cycle | status phrases cycle in one mono slot, dissolving into RGB-split noise; a progress bar runs | 168 f · mid-high | 4 phrases ≤17 chars, 42 f each; glitch probability keys [1,0,0,0.1,0,0,1]; re-roll every 2 f; jitter x ±g·10, y ±g·4 (480-unit space, ×3.6 native); RGB split ±g·3 px above g 0.04; mono 104 px; bar 1100×4 linear | shorten phrases
gradient-word-sweep | a gradient light charges a keyword glyph by glyph; then the glow breathes | 2.5–3.5 s · high | sweep 15–20 f; front band ~34% of word width; glow layers 0.55/0.55/0.62/0.72; lightning 6/2.4/1.4 px magenta (216,60,190), ≤2 at once, >8 f apart | easy
lead-word-zoom-assemble | the lead word fills the frame at 2.3× and drifts closer, then recedes as the rest of the line pushes in | 84 f · mid-high | 2.3× start, push 1.06 over a 12 f hold; recede 12 f; slide 24 f; trailing words +6 f, 4 f stagger, 12 f each, 0.5em push, 2 f fade; 96 px / 600 / −0.03em; lift −56 px f34–50; 22 f still; last 12 f crash to 1.2× + blur 9 px | easy
★ marker-underline-title | a tapered, rough marker stroke draws under the keyword, tilted with the italic | 1–1.5 s · low | starts 4–8 f after the title lands; 10 f draw (14 f was "too slow"); ≈−0.1em under the baseline; rises left → right; width ~0.12em mid, ~0.6× at the ends; light edge noise | easy
outline-word-fill | an outlined word snaps down from 3.2×, guides close in, it fills white in one frame | 90 f · high | 3.2→1 in 11 f snappy; 220 px / 500; 2 px warm-grey stroke (138,118,104); dashed circle r 410, dash 22/18, 2.8→1 over 44 f, 0.22°/f spin; guides 14/12 at f28–46; **hard fill at f54**; glow white 14 + orange 60 px, 8 f; ring 14 f; hold 36 f | easy
★ paper-title-card | a sentence stamps onto paper word by word, one amber italic word, a short rule | 50–55 f · low | see Ink Press; the dark variant uses a 40 px rise + blur 10 instead of the scale | easy
pill-chip-slot-cycle-handled | a dark chip inside a sentence rolls through words, pushing the sentence apart; ghost items show | 150 f · mid | 4 words; swaps at t 0.25/0.47/0.69, 0.12 window `inOutCubic`; chip 48 px, radius 99, `#1a1c24`, width = text + 74; ghosts −38 / +58 px at 0.13, half-speed parallax; 30 px/800, chip text 22 px/700; bg `#fbfbfd`, ink `#15171d` | easy
pill-slot-cycle | the sentence's trailing pill spins like a slot machine until the last word locks | ~200 f (6 words) · mid | 21 f per word; swap in the first 8 f; in +120 / out −130 px; vertical blur ≤14 / ≤12 px from real speed; rotateX −38°→0 / 0→34°; final `Easing.back(1.4)` 14 f; hold ≥45 f | easy
text-column-converge | two words at opposite screen edges hard-swap, then slide together once | 5–6 s · mid-low | edge margin 618 px at 1920; dwell 7–16 f, uneven; converge 10 f after the last settles, 36 f in-out cubic; mono step 0.6em; 42 px at 1080p; small text +18 f, 4 f fade | narrow width
title-demote-to-label | a centred headline stands, then shrinks to the top-left as a section label while content grows | 112 / 134 f · low-mid | 26 f asymmetric in-out to scale 0.22 (≈48 px; <40 px unreadable); ≥18 f stand first; content blocks 18–22 f, width 0.3→1, starting +12 f; highlight 10 / 10 / 8 f at accent 20%; old content exits 12 f | easy
type-assembly-moves (A rise, B drift-converge, C text on a path) | three title assemblies | 130 / 150 / 160 f | A 14 f out-cubic to −10% then 6 f back; B one `Easing.out(cubic)` p drives position, rotation, depth, blur 8(1−p) and opacity 0.35→1, 45 f per glyph, 3 f stagger, lock pulse to `#000` + 0–3–0 px stroke over 8 f; C wait 8 f, straighten with 1.1 f stagger, 18 f lift with ~4% overshoot; ≥30 f still | easy
type-entrance-moves | letters fall under gravity and bounce into line | 150 f · mid-high | start 4 + 36·(1−(1−i/(n−1))^1.5); y = −DROP + DROP·(t/24)²; bounces 30% then 9%; tilt ±6° seeded; at ~f110 group straighten 6 f + 1.06→1; ≥20 f still | easy
★ type-rhythm-sync (A weight pump, B karaoke fill) | A: weight pulses on percussion; B: words fill as they are spoken | 165 / 150 f | A: 128 BPM = 14 f/beat; envelope (1−t/D)^0.8, D 9–13 f; weight 250 + 650·env on a variable font, glyphs set in 900-weight slots so nothing reflows; downbeat scaleX 1 + 0.06·env; the drop holds at 780; echo rows +2 f, pushed 26 px (60 on the drop). B: per-word frame ranges with 4–10 f breaths; grey layer at 13% ink + mask-revealed top layer (±4% soft edge); active word in accent, back to ink after 10 f; 8 px underline that retracts in 6 f; 48-bar VO waveform; ≥20 f still | easy
★ typewriter-moves | type a word, hesitate, delete, retype the selling point faster | 160 f · mid-low | `substring(0, floor((f−start)/step))`, no easing; type 2 f/char, delete 1.5, retype 1.5 with zero hesitation; cursor solid while typing, two blinks at a 4 f half-period when hesitating, removed at the end; 60 px mono slots; ≥50 f still | easy
vertical-word-roll-blur-cycle | the tagline's last word rolls through a three-line reel; neighbours blur grey; the settled word takes the accent | 150 f · mid | 4 words; swaps t 0.16/0.36/0.56, window 0.11; ease 0.7·outQuint + 0.3·outBack; row 44 px, 3-row mask, slot 190 px; blur 3 / 5 px; tint 1 − 2.4d; 30 px / 800 / −0.5 px; fade t 0.9–0.985 | easy
word-relay-filmstrip | a filmstrip of page cards steps vertically while a serif relay swaps only its verb | 180 f · mid-low | cards 530 px tall, alternating black / white; 45–60 f per word; step 16–18 f asymmetric in-out, exactly one card; old word greys and leaves in 8 f, new word +7 f, letters 16 f each with 1.2 f stagger; word centred on the card (pixel exact); Didot-like serif, verb italic white; neighbours dim 0.68·dist, −6%, blur ≤3 px | already vertical
word-relay-geometry | three words hand off, each with its own geometry, ending in a metallic sheen to white | 180 f · mid-high | ≈60 f per word, 6 f overlap; in 14 f snappy / out 10 f exit; outline→fill 18 f swift ±7%, outline kept at 0.2; dashed circle r 400, 10/16, 0.4→1 + 160° spin with brake; comet 7.5°/f, 16 segments; rings trim 22 f, 6 f apart, spacing 340→300; sheen 100°, 300% size, 24 f; whiten 12 f; 230 px / 800; graphite look | easy

#### UI Entrance & Showcase (`references/shots/ui-entrance/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
avatar-bracket-carousel | a focus bracket stays still mid-sentence while a vertical avatar queue springs through it | 156 f · mid | swaps t 0.24/0.46/0.68, window 0.14 `E.spring(k, 0.25)`; step 76 px (bracket 92, avatar 58); scale 1−0.38d (≥0.5), opacity 1−0.62d, blur 2.4d ≤3 px, label 1−2.2d; bracket pulse 7% | easy
bezier-source-converge-merge | four nodes draw curves to one point, slide along and are swallowed while packets ride the paths | 168 f · mid | draw start 0.04+0.045i, 0.17 outQuad; converge 0.34→0.74 inOutCubic; size 44→15 px, then 0 after 75%; packets 2 integer cycles, phase 0.13i; erase 0.78→0.9; badge +12% outBack | easy
card-stack | cards spring up into a stack, then fan into a 3D arc | 150 f · mid-high | N 9; entries over 40 f (`EASE.out`), y 820→0 spring damping 13; press 5 px sine 9 f; fan spring damping 20 / stiffness 95; k·6.5° and k·138 px; persp 1800; origin 50% 130%; centre card pulls out 72 px | fan width
carousel-3d | eight cards on a ring turn one revolution, billboarded | 168 f · mid | radius 700 (cards 340×460); 50% constant + 50% stepped (21 f per step, 8 f dwell); persp 2200; rotateX −9°; lit window ±26°; reflection 8% | shrink the ring
cloner-depth-echo | a card duplicates into a diagonal depth trail and snaps back | 138 f · mid | persp 1500, vanishing point (360,120); clone z −250·i, dx −58·i, dy −6·i; 7 clones; opacity 100→28%, blur 0→1.6 px; out spring damping 15, 2.2 f stagger; back 10 f ease-in all together; dwell 32 f; merge 1.06× + 14 f outline; "×N" counter 260 px | easy
★ deck-deal-flyin | a card pile opens the scene; cards accelerate into a live grid; the camera chases | 150 f · high | 10 f anticipation: pile −48 px, top card −30 px (4 / 2 px was invisible); deal k at 36 + 4k − 0.0792k(k−1); flight 8 f `bezier(0.3,0,0.2,1)` (z +110 px sine, scale 1.06) + settle 4 f `bezier(0.3,0,0.25,1.15)` + press 0.996; orbit f0→30 rotX 48 / rotY −30 / rotZ 9 / zoom 1.9 → rotX 42 / rotY 24 / rotZ −6 / zoom 1.8, persp 1100 (Hermite spline); ghost blur 6 px × 0.25(1−t); camera legs ≥30 px/f inside `CameraMotionBlur` (shutterAngle 180, samples 10); chase to f110 zoom 0.5 rotX 52 rotZ −26 persp 3300 | tall grid works
doc-park-left-pill-deal | the document slides to a sliver and scrolls; pills are dealt; captions darken word by word | 174 f · low | pills at t 0.26/0.48/0.70; park 0.06→0.24 inOutCubic, −55% + 0.92; pill opacity 6 f outQuad, motion 11 f outBack, y 14→0, 0.94→1; caption +9 f, darkening over 70% of its time; scroll −t×120 px | park upward instead
★ draw-svg-trace | an ink stroke traces an outline, closes with a dark flash, hands focus to the content | 132 f · mid | lap 40 f inOut cubic; line 6 px, pen 9.6 px, tip r 7.5; closing flash 2 f to black at 11 px, 6 f back; subject 1120×660, radius 28; underline variant 18 f out-cubic, 12 px vermilion, ±5 px wobble; hold 40 f + 0.9% push | easy
element-body-moves (A contact shadow) | a contact shadow separates on lift | 150 f · low-mid | lift −28 px + 1.08 (2D) or z 96 px + 1.05 (2.5D), visible ≥12 px; contact α 0.32→0.14, blur 3→25; ambient α 0.09→0.22, blur 14→54; landing 0.99 for 2 f → 1 over 5 f | easy
integration-hub-map | a page flips into an integration hub; icons pop together; light tubes connect with pulses | 4.5–5 s · mid-high | flip 35 f, monotone ease-out; edge flash 2 f; icons on one frame, tubes +10 f, grow 9 f; pulses ~4.6 px/f | easy
list-reveal | menu rows scale in one by one with a faint overshoot while the list drifts up | 120 f · low | 6 items, 10 f stagger, 24 f each; scale 0.82, offset 44 px, blur 8 px; back ~1.5%; drift 96 px total; opacity min(1, lin·2.2) | ideal
★ list-stack-press | cards fly up, the stack compresses on each landing, a counter advances | ~70 f · mid | cues 18/30/42/54/66, 22 f `bezier(0.45,0.05,0.25,1.12)`; from 600 px below, ±2° alternating, 1.06→1; stack press 6 px, back over 8 f; elevation 56→3; highlighter +2–4 f (7 + 5 f); one glaze 360 px, 14°, soft-light, f74–87; counter 8 f per step `bezier(0.25,0.8,0.25,1)`; camera zoom 1.35→0.86 | ideal
neon-frame-forerun | a neon frame races to outline the scene while components drop and the page lights | 140 f · mid-high | frame 20 f from both ends, swift; hover z 120–170 px; drops 24 f each, landings f54–104; staggered starts, overlapping falls; background layers blink off 6 f each, 7 f apart | ok
neon-frame-orbit-drop | after the frame draws, the camera arcs while every component lands on the same frame | 140 f · mid-high | zero stagger; rotateY +38°→−26°; drops centred on the rotation; hover 100–180 px; frame ~14 f | ok
page-waterfall-wall | page captures stream at different speeds on a tilted 3D wall | 4–6 s loop · mid | 3 columns; loops 12 / 9 / 14 s, middle reversed; rotateX 20°, persp 1000; scale 1.2 → ~1.26 via CSS zoom; masks 200 px | 2 columns
product-card-progressive-assemble | a product card builds field by field; strike-through price; new price springs; highlighter | 172 f · mid | cursor at f8/20/30/42/76/96/114, land +2 f; hop 6 f swift; fields 14 f expo-out, rise 10–26 px; pills spring damping 13, 0.4→1; strike at f62; new price spring damping 14, 1.18→1; highlighter 6 f; card 1→1.035 | ideal
radial-wave | a dot grid lights in rings from the centre, then a pulse collapses inward | 114 f · mid-high | 17×9; delay dist·0.35; each 0.18; peak scale 1.5; second wave 0.62+(1−dist)·0.25, window 0.15, ×0.8; base 0.25 + w1·0.5 + pulse2·0.25; highlight above 0.3 | regrid
research-card-stack-scroll | dark cards drop every 12 f and pile diagonally, only the top one sharp | 144 f · mid-high | 12 f per card, 13 cards; 6 f outCubic; y −40→0, 0.94→1; squash 1.6 f ×0.97; +30 y / +9 x per beat; blur 0→4 px, brightness 1→0.75 over 90 px | ideal
★ row-embed | rows descend in perspective, flatten into the page, flash an amber seam | ~56 f · mid | cues 12/22/31/39/46, 12 f flights; `perspective(900px) translateY(−120·air) rotateX(16°·air)`, `bezier(.5,0,.8,.75)`; 1.06→0.995 + 4 f press; slot patch + 20% dashed outline; seam 2 px, 5 f out from the centre, 8 f fade, 7 px glow; camera cy 500→740, zoom 1.12→1.25 over 68 f | ideal
value-stagger-gradient | 16 bars rise with height, hue, travel and blur spread as gradients; then a centre pulse | 150 f · mid-high | delay i·0.02; 0.22 each outCubic; heights 92→32 px; hue 200→320; travel 46→14 px; blur 8→2 px; pulse from the centre distC·0.13, amplitude 0.42→0.06; brightness 1 + 0.55·pulse | fewer bars
wall-reveal-moves (A bento lights, B wireframe → UI) | two in-place wall reveals | 150 f each · mid | A: cells 12 f apart, comet stroke 8 f (22% of the perimeter, `#e8b45e` / `#ffe3ae`), content back-out `(0.3,1.4,0.5,1)` 8 f, push 1→1.04 over 25 f `bezier(0.33,0,0.2,1)`; B: grouped 30 f line draws, blueprint `#6c7894`, clip wipe f88–118 `bezier(0.55,0,0.25,1)` led by a 4 px `#ffc46b` edge | regrid

#### Camera & Space (`references/shots/camera/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
basic-3d-scene | Impress-style slides: cards at scattered 3D poses; the camera flies to each by inverting its transform; ends on a lit overview | 225 f · mid | flights 28–32 f, stops ≥30 f; 30% pull-out mid-hop; overview scale 2.7; unfocused cards opacity 0.22 + blur 7 px; persp 2600 (≈3× the max abs(z) of 850) | ok
★ crash-zoom-punch (elastic overshoot / impact stop) | a 6-frame push from wide to a close-up | move 6–11 f, ≥30 f before, ≥45 f after · high | 6–8 f wind-up pull-back of 3–4% first; push 6 f (4–8) ease-in, cx/cy converge on the same curve; zoom target 2.4–2.8 (target 60–75% of the frame); elastic: overshoot then 5 f back by 3–6% (2.6→2.45); impact: shake 14 px·e^(−t/1.8), done in 6 f, no rebound; motion blur on the push only (~200° shutter, sub-frame layers ≤40, echo spacing ≤ glyph height) | easy
cursor-flyover | after an overview the camera visits four corners; a cursor arrives with it and clicks | 240 f · mid | close-up s 1.3 (overview 0.66; readable text ≥40 px on screen); flight 20 f / stop 24 f; cursor leaves 2 f early, arrives 6 f early; click ripple 18 f, 0.3→1.5, every 44 f; return 24 f smooth, 18 f hold | ok
depth-layer-moves | layered parallax rails at three speeds; the hero floats up as the rail settles | 165 f · mid | parallax 0.35 / 0.7 / 1.4 (+0 for the text layer); ≤4 layers; anchors: fore/back blur, background desaturation, haze; drive solved so the hero ends centred | vertical rails
graze-face-tour | the camera skims low over the UI while page text hovers above and settles | 4–5 s per leg · mid-high | hover 120–180 px; shadow blur / offset / opacity scale with height; drops staggered along camera travel 0.2→0.85, overlapping not serial; accelerating fall, soft landing; legs crossfade ≥8 f (gaps produced black frames); far blur | ok
overhead-camera-moves (A tilted page levels, B tabletop drop) | two overhead reveals | 120 / 140 f | A: rotateX 86° (creep to 83° f0–20) → −2.2° at f60 → 0° at f70 (`EASE.swift`, overshoot ≤3°), origin 50% 100%, persp 700→1500, scale 2.5→0.84, then 1→1.018 push. B: pan translateX +760→−360 over 50 f (angle fixed), 8 f selection beat, then f58–86 rotateX 62→−1.6→0.5→0 + scale 1→2.04→2.0 + translateX −360→0 together; cards 996×560 | ok
space-camera-moves (A exploded assembly, B subject-locked rotation, C drone dive) | three spatial moves | A 170 f, C 105 f · high | A: persp 2400, axonometric rotateX 54° rotateZ −34°, 5 layers at z 150/270/400/520/640, spring damping 15 / stiffness 120, 5 f stagger; reassemble ease-in 14 f reversed, 3 f stagger, landing sink 8 px; labels 44 + 30 px. C: one p drives rotateX 72°→0 + scale 0.42→1.35; 0–24 f establish + 2.5% back-off → 25 f `Easing.in(cubic)` for 82% → 20 f `Easing.out(poly(5))` for 18% → 36 f hold; `CameraMotionBlur` (shutterAngle 220, samples 12) | ok
steep-tilt-glide | a page stands at −60° and glides past a fixed camera with speed ghosting | 120 f · mid-high | rotateY −60° exactly (−45° / −53° rejected); the camera is fixed, the page moves; bezier whose end slope isn't zero; ghosts at −1.6 / −3.2 / −4.8 f, opacity ∝ speed; page ≥3 screens wide | rotate to rotateX
tension-camera-moves (A frozen orbit, B isolating pull-back) | two emotional camera tools; ≤2 per film | 150–170 f · A high / B low | A: two clocks — content brakes 8 f, freezes 52 f, resumes 8 f while the camera keeps moving; orbit rotateY 0→−52° (26 f smooth) → 12 f drift → back (22 f swift), rotateX +6°, push 160 px, persp 1800. B: scale 2.2→0.62 over 110 f `Easing.out(cubic)`; siblings go dark nearest-first every 8 f (16 f, brightness 0.3, blur 5 px, 0.97); hero gains two cold-white halos f60–100; hold ≥30 f (B ≥40 f) | ok
terminal-3d | three terminal windows float in 3D; the camera flies between them; commands type, results slide in | 246 f · mid | pull-back bulge sin(π·u^0.85)×1250 px; flight 30 f, stops 60–90 f; side angle 8–10°; blur ≤3 px; typing 0.75–1.65 f/char + 0.6 f per space; output lines 6 f snappy, 4 f apart; windows ~1500 px apart, z −220…+260, rotY ±14–28° | stack vertically

#### Data & Metrics (`references/shots/data/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
before-after-slider-scrub | before and after in one frame; a fast-then-slow slider reveals the result | 4–5 s · mid | fast whip 12 f vs slow sweep 48 f (~5:1); after layer `clip-path` follows the handle; handle stretches scaleX up to 1.18 with speed | horizontal split
chart-live-moves (A oscilloscope, B dots regroup into a figure, C axis forced to rescale) | data-driven motions | 165–192 f · mid-high | real titles / axes / units required (grey versions were all rejected); A flow 8 px/f; B 320 dots Ø20 px stretching with speed (+20 px max); C bursts 226 px past the ceiling line; ≥36 f still | ok
gauge-readout-moves (A needle self-test, B scale under a fixed pointer) | instrument reads | 140 / 150 f · mid-high | A full 270° sweep and back with ~8° overshoot, 4 f stagger between gauges; B 5 px per unit, peak ~100 px/f with vertical motion blur, spring overshoot brake; ≥30 f locked | ok
scroll-brake-moves (A brake on a row, B + locking reticle) | fast scroll that stops precisely | 4–5 s · high → mid | A `bezier(.45,0,.06,1)`; B overshoots 30 px and returns; blur from frame-to-frame displacement (`velocityAt`); row heights 72 / 94 / 116; target stops dead centre; reticle mounts on the exact stop frame | ideal
timeline-travel | the camera accelerates along a version timeline, raises cards at stops, brakes on the last milestone | 4–5 s · mid-high | speed remap [0, 0.15, 0.88, 1] → [0, 0.055, 0.9, 1]; cards pop 6 f before the camera arrives; 3–5 major ticks + minor dots; final brake push 1→1.28 over 10 f | run vertically

#### Interaction & Feature Demo (`references/shots/interaction/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
autolayout-gap-dial | a gap dial pushes blocks apart while digits tick, then everything springs back | 150 f · mid | gap 12→104 px (the original 20→24 was invisible); anticipation 12→6 over 10 f swift; out 34 f swift; 20 f held breath; return spring damping 9 with undershoot (×0.45, ~7 px); digits step by 2 with a 0.06 pulse; blur min(9, speed×0.5); uneven widths 252/206/278/268/220 | ok
canvas-materialize-moves (A rows → canvas cards, B prompt → diagram tree) | two materialise moves | 150 / 180 f · mid | A: checks at f14/24/34, spring damping 11 / stiffness 300 + 7 f tick; button f52, rows lift at 56/62/68 (2%, 4 f) then fly on a spring damping 17 / stiffness 95 / mass 0.9 along a quadratic bezier lifted 220 px, size lags 3 f; 626×104 → 486×300, radius 18→24; tilts −2.5 / 1.8 / −1.2°; landing 6 f scaleY 0.97. B: typing 0.95–1.2 f/char (1.7 f on spaces); camera 1.3× → 1.0 over 72 f; root +14 f, levels 22 f apart, siblings 5 f, nodes spring damping 14 / stiffness 190 from top-centre; connectors draw 16 f, 10 f before the child; final breath 1→1.03→1 over 28 f | ok
★ chip-grid-single-select-blackout | five chips fade in; one grey press frame; the chosen chip turns solid black with a tiny bounce; the others drop to 18% without moving | 165 f · low-mid | chips from f8, 3 f apart, 16 f snappy; select at f56; grey flash exactly 1 frame `rgba(120,128,146,.5)`; blacken f57→62 linear; bounce 1 + sin(pr·π)·0.04 over 9 f; others to 18% opacity, position locked; collapse at f101, 18 f smooth to y 330, scale 0.88; price beats 8–10 f apart | ideal
collab-cursor-moves (A five-cursor ensemble) | living collaboration ambience | 156 f · low-mid | delays 2/7/11/16/22 f, spring damping 15 / stiffness 80; name tags +10 f, rise 12 px; drift = two sines 0.055 / 0.021 rad/f, ±40 / 26 px; typing cameo f48–104, 29 chars at 1.6–2.4 f/char (+0.9 f after spaces), steady hand while typing; gather at f98 over 28 f smooth, drift kept at 25% | ok
glass-pill-dictation-typing | a fixed-width glass pill pops in slightly oversized; an inner accent glow fades as a sentence types | 100 f · low (quietest beat) | fixed width 1240 px (≈1.8× the sentence); scale 1.25→1 snappy 20 f; opacity full in 2 f; inner light 90° `0 → .18@38% → .62@78% → .95@100%`; 28 chars from f8 at 2 f/char, linear; light 1→0 f10–72 smooth; ambient 0.15 + 0.6g, floor 0.22g; 5 wave bars ±2.4 px; cursor f2, removed f66–74 | narrower pill
★ hashtag-to-pill-materialize | a typed "#word" hard-cuts into a wide pill, holds, shrinks into its slot, hard-cuts to the finished view | 120 f · mid | typing 4–6 f/char with mulberry32 jitter, cursor never blinks; materialise = 1-frame hard cut + 3 f 1.03→1 settle; pill 740×236 at 1920, no stroke; hold ~18 f; shrink to ~0.55× in 14 f `bezier(0.5,0,0.25,1)` (scale and position on one curve); reveal = second hard cut 3 f after landing | ideal
picker-carousel-feature-cycle | a mobile picker holds its focus pill still while items brake hard into it | 108 f · mid | row 34 px × 5 visible (odd), focus row 3; 5 steps over t 0.05→0.95; HOLD 5/14 ≈ 0.357 of each step still (lifeline); `outQuint` snap; opacity 1 → 0.55 (d≤1) → 0.18 (d≤2); size 17→14 px; icon only on the focus row; pill scaleY 1→1.06→1 | ideal
segmented-thumb-hero | an oversized segmented control: cursor slides in, presses, the thumb snaps across, icons swap | 110 f · mid | control 1080×220, thumb inset 16 px; thumb 8 f `Easing.out(cubic)`; cursor 24 f from off-screen ease-out; press scale 0.86 + 12 f ripple; icon spring damping 10 / stiffness 220; ≥30 f hold | ideal (1080 wide)
theme-switch-moves (A diagonal sweep, B command-palette ripple) | a theme change with a visible cause | 140 / 156 f · mid / mid-high | dark palette hand-mapped key by key (never a filter inversion); A: sweep polygon overshoots by 400 px, the boundary passes the switch ~6 f after the press, wide shot by f40 before the terminator crosses mid-frame (~f44–50). B: source dot holds 5 f, ripple centre = that point, end radius ≈1.1 × distance to the farthest corner (1260 px); old layer unmounted | ok
★ type-and-filter | a real UI types a search, the grid collapses to one result, then clicks through | ~72 f (f118–190) · mid | 3 f per character from f128 (the first version was "too fast"); 11 f breath; caret solid while typing then an 8 f blink; click f176; caret gone f185; 25 non-targets fade 5 f + sink 8 px, 0.4 f apart in reading order; target slides 10 f `bezier(0.35,0,0.2,1)` with a sine lift z 18 px, +0.02; two accent ripples 3 f apart, 10 f, r 14→54 / 78, 3 px stroke, 40 px glow; then a 16 f push to zoom 2.2 under a FlashCut | ok
voice-waveform-live | a recording capsule: 64 bars surge with speech, flatten to dots in pauses, collapse on submit | 172 f · mid | 64 bars, 5 px gaps (1240 px capsule, wave ≈820 px); 1.6 f per sample scroll; speech envelope rise 5 f / fall 7 f (speech f15–57, pause f80–124); syllable noise 0.55 + 0.45·noise(t/4.5); centre weight sin^0.8; silence clamp 6 px dots in neutral grey; submit: 12 f ease-in to 0.06 + 3 f button squash; words appear on their syllable onset with an 8 f blur-in; into the bubble 22 f swift, scale 0.72 | narrower capsule

#### Transitions (`references/shots/transition/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
bottom-push-stack-wipe | each scene pushes up from the bottom on its own saturated colour, shoving the old one out | 26 f push + ~18 f hold (~44 f per chapter), 2–4 chapters · mid | heavy ease-out 26 f (<20 f = flash cut, linear = roller shutter); seam shadow 56 px (chapter colour, deep 0.42) + 2 px lit edge; adjacent chapters far apart in hue; content pinned in chapter coordinates | ideal
card-flip-reveal | feature cards rotate 180° on Y, flash at the edge, show a big result on the back | 150 f · mid-high | 4 f anticipation + 16 f flip + ~10 f spring; overshoot 194°→180°, spring damping 15; faces darken ≤0.55, edge highlight peaks at 90°; 12 f between cards, ≤4 cards; back = a 150–170 px number + one label; ≥40 f still | stack cards
card-flock-tumble | three cards tumble from edge-on into a stepped formation, keep turning, collapse into a smoke ring under a giant word | ~4.5 s · very high (film peak) | scale 1.6–1.74, heavy overlap; standing rotation ~0.34°/f (never static); collapse 10 f ease-in; one turbulent smoke ring; zero blur; one Catmull-Rom spline; giant word 4 f after collapse, 14 f snappy 1.22→1 with tracking tighten; white-hot core + 12% exposure, 6 f | ok
circle-match-iris | an iris grows from a circular UI element and lands on a matching circle in the next scene | 165 f · mid-high | anchor pulses twice (1→1.16, rings at f18 / f30, 22 f each); disc → ring r 36→300, stroke 72→44 px over 28 f expo-out; iris 0→2400 px over 30 f `bezier(.62,0,.32,1)` (a centre error >10 px shows); old page 1.03→1.22, brightness 1→0.45 over 34 f ease-in; gauge sweep f60–118 to 87% `bezier(.4,0,.12,1)` with a synced count; 47 f still | ideal
gradient-transition | the background morphs through linear, radial and conic gradients, every parameter interpolated | 200 f · low | segments overlap 12 f; crossfades f56–68 and f118–132; H/S/L lerped separately (take the short hue path); stop lightness 64 / 40 / 7; radial centre walks diagonally, radius 48%→80%; conic 0→250° ease-out | ideal
line-carry-transition | a progress line exits scene A, leads the camera sideways, turns corners to frame scene B | 190 f · mid | 8 px ink line, square caps, mitred corners; 1920 px in 56 f (~34 px/f; >80 px/f loses the pen head); pen at x≈1480; hard 90° corners (Saul Bass); B content only after the frame closes; ≥24 f still | run vertically
mosaic-reframe | twelve tiles morph between a grid, a hero mosaic and a rotated cascade | 214 f · mid | A→B 26 f, B→C 30 f; holds 30 / 36 / 34 f; control → tiles lag 4 f; stagger span 10 / 14 f; cascade cards 300×372, step (79, 65) px, rotation −15° + 3° each; hero slot 3×2; lift +3.5%, elevation 6→40 | regrid
page-turn-transitions | the old page splits like double doors to reveal the new one | 150 f · mid-high | hairline seam drawn from the centre over 20–30 f, opens 0→16 px f30–40 ease-in; doors slide ∓1000 px in 24 f `bezier(0.42,0,0.8,0.25)`; new page 1.08→1 snappy over 36 f (2 f after the doors); 10 px lit tear edge; hold ≥30 f with 1.5–2% push | ideal
print-texture-transitions | ink bleeds out from a drop point to consume the old scene | 4–4.5 s · mid | SVG mask circle with `feTurbulence(fractalNoise, 0.02, 3 octaves, fixed seed)` + `feDisplacementMap` 60→160; radius 0→1450 px over f20–98 `Easing.out(quad)` × (1 + 0.08·sin(0.32f)·env); ink rims 20–42 px ahead (0.42 with 3.2 px feather, 0.86 with 1 px, wet halo +110 px at 0.12); first drop f14–22; new scene 1.035→1; remove the mask at ~f100 (turbulence jitters forever); ≥30 f still | ideal
★ shot-transitions (A flash cut, B braking whip pan, C portal wipe) | three hand-offs matched to scene energy | technique card (frames borrowed from neighbouring shots) | A: `FlashCut`, from = cut − 5, 5 f each side, peak 0.85 at 40%. B: hold ≥20 f → 70% of the distance in 30% of the time (peak ~300 px/f) → 30% in a ~48 f ease-out tail; one continuous velocity curve (3 f ramp + exponential decay), never stitched eases; `SpeedBlur` sd ≈0.085 × speed, ≤64 px; both scenes on one horizontal line; landed card lifts to 1.2×; avoid `CameraMotionBlur` on bright UI (turns yellow, stepped echoes). C: target lifts −10 px / 1.03× first; window grows 40 f `bezier(0.7,0,0.3,1)`; inner scene counter-scales 0.42→1 on the same t; card face fades in the first ~28% (1 − 3.6t); only 2 parallax layers (0.08, 0.3), no blur; 8 f ease-out stop; ≥30 f still | B vertical whip
tear-streak-transitions | horizontal glitch strips whose displacement hides the hard cut | ~135 f · high | ±70 px per strip (~20% still, 30% full, rest light), exponent 0.6; envelope out-cubic f44–47 → plateau → linear decay f54–60; ±12 px two-colour ghosts (screen) on big strips; 1.5 px lit top / 3 px dark bottom on strips >25 px; 2 scan lines per frame; cut cover: exposure 1.28 (f54) / 1.12 (f55) + 1.6% punch for 6 f; warning strips ±12 px at f30–31; unmount everything at f60 | ideal
★ transition-hidden-cut (A foreground occlusion, B opposing impacts, C amber light leak) | three ways to hide the edit | technique card | A: out-of-focus dark-brown foreground (solid 2600 px + 340 px soft edges) crosses right→left in 14 f `bezier(0.3,0,0.7,1)`; cut on the fully covered frame; one continuous ±40 px drift through the cut, A dragged 28 px ease-in, B settles 28 px ease-out. B: two half-screens on a 78° diagonal slam in from ±1240 px, 10 f ease-in(cubic), blur ≤36 px; on the impact frame together: paper flash 0.85→0 over 3 f + shake 16 px·e^(−t/1.7) (~5 f) + "VS" stamp spring damping 12 / stiffness 260, 1.9→1; ring 16 f, 12 speed lines 7 f. C: three diagonal radial glows `#c2311a` / `#ff5a1f` / `#ffb347` (3000 / 2300 / 1700 px, screen) swept upper-right → lower-left over 71 f; intensity t² rise over 28 f → cut at the peak → 43 f ease-out; at peak a 40% warm wash, core opacity = intensity³, page brightness +85%, contrast −50%, saturation −25% | A/B rotate 90°
transition-travel | pushes through the counter of a giant letter into the next scene | technique card (demo 150 f, push 52 f) | SVG mask cover with a 900-weight word ("EDITS" at 560 px), transform-origin inside the letter's hole (I-stem 107 px × 30 > frame width); warm-black cover vs molten-gold scene; content resolves from 18 px blur mid-push; cover fades between scale 14 and 26 with blur ≤20 px (divided by scale) + 4 lagging ghost layers; background only 1→1.08 + 28 px drift | ok
white-flash-logo-simplify-cut | a liquid gradient wordmark shimmers, the frame burns white, a flat wordmark settles on white | 120 f · mid-high | build-up f34–46 brightness ×1.7 + horizontal flare; burn f44–50 radial (t² ease-in) + f50–54 pure white; exposure fall f54–76 quint-out; flat mark 1.03→1 snappy f52–78; both marks 190 px, same centre | ok
wipe-transitions | twelve vertical blinds flip in a wave | ~132 f · mid | leaf *i* starts 24 + 28·(i/11)^0.78 (gaps 3.4 → 2.1 f); each a spring damping 13 / stiffness 75 (~13 f to 180°, ≈5° overshoot); face shading 0.5·sinθ, highlight at ~35°, 2 px edge ∝ sinθ, slot `#1d1712`→`#120d0a`; unmount after abs(θ − 180°) < 0.3° for 4 frames (≈f80); ≈50 f settle | horizontal blinds

#### Rhythm & Montage (`references/shots/rhythm/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
★ beat-cut-moves | three white flashes hard-cut through tighter crops of one subject, settling on the key number | 140 f · high | cuts at f30 / 52 / 70 (gaps 22 → 18 f); flash 0.95→0 over 4 f ease-out + ±2 px seeded shake; after each cut scale 1.03→1 and a −16 px settle over 6 f; crops via CSS zoom 1.0 / 1.6 / 2.8; a focus frame closes from 1.3× 8 f before each flash and turns champagne 3 f before; final hold 70 f with 1→1.015 | ideal
beat-step-list-theme-cycle | an adjective list steps a row per beat while a centre pill catches each word and the background recolours on the beat | ~140 f (4 beats) · high | beat 18 f (`BEAT_LEN` sets the BPM); jump in the first 6 f, exponential ease-out 3.2; 3–4 beats; squash vertical 1.14→0.96→1 / horizontal 0.97→1.01→1; same-lightness, different-hue backgrounds; 30 f lead-in, ≥30 f hold | ideal
panel-grid-moves (A angled comic split) | one moment cut into three framings, resolving to a poster | 156 f · mid-high | SVG gutters: ink edge + cream core, 18 px total, 12°, each drawn top→bottom in 3 f; inside panels the subject keeps working (focus ring turns 26°, aperture closes); caption box cream + 4 px ink + 7 px hard shadow, −2° stamp; ~50 f poster hold with 1.5% push | ideal
★ quad-split-parallel-scenes | the frame hard-cuts into a 2×2 grid of four micro-scenes, every beat offset by a few frames | 90 f · high (chorus slot) | heavy events 3–6 f apart; TL slow push inQuad 1→1.1 (origin 50% 90%); TR whip zoom f37–47 to 1.85 + blur peak 5 px (sine envelope); typing TL 20 chars over 0–40 f, TR 19 chars over 0–24 f; BR chain: slide-in 4 → cruise 14 → click 25 → colour 27 → cruise 38 → click 52 → notification 56; checkerboard light / dark / accent / light (≥15% lightness difference); 28 f final hold | 2×2 fits
rhythm-interrupt-moves (A stepped punch-in jump cuts) | punch-ins that break cadence on the same frame | 135 f · mid | 1.0 → 1.6 → 2.6, each held ≥35 f; 2 f brightness 0.92 tick on each jump; last step ≥45 f still | ideal
sakuga-timing-shift | motion starts on held drawings (on threes), switches to frame-by-frame acceleration at the climax | 150 f · mid-high | floor(f/3); ≈69 px per step (1040 / 15); poses ±5° with squash / stretch and alternating hops; switch at f48 in one frame (3:2 stepped : dash); dash `Easing.out(poly(4))` + 40 px overshoot + 6 f return; 70 f hold | ok
speed-ramp-freeze | a freeze for on-screen annotation, then motion resumes | 158 f · mid-high | freeze ≥45 f (demo 67 f); unfreeze smootherstep over 22 f (average slope >1); circle annotation draws in 10 f with scale-6 wobble; pause signal = 3 f shutter flash + frame corners + "PAUSED" timecode | ideal
★ trailer-grammar-moves (A trailer bumper) | three 9-frame rapid cuts, a beat of black silence, then the title card | 140 f · high | three cuts of exactly 9 f, no transitions; each 1→1.04 linear inside (still frames read as a slideshow); shot 3 a 2.2× CSS-zoom close-up; black f27–33 (6 f of pure `#000`, nothing in it); 77 f still after the title tightens (f63) | ideal

#### Light & Emphasis (`references/shots/effects/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
assemble-then-type-flyin | textless shells fly in onto an empty dark grid, then every character arrives from 3D space with big rotations | 168 f · mid-high | 10 shells launch f6→44 (4–5 f apart), overshoot 16 f, travel 120–420 px, ±7°, blur 0.32 × speed ≤18 px; 8 f gap (shells done f50, text f58); big titles first (f58 / 66), small labels f104→114; per glyph dx ±260, dy ±200, dz −200→−760, rotate X/Y/Z ±120–190°, perspective 900 in each glyph's transform; glyph gap clamp((128−start−16)/n, 0.35, 1.6) f; `transform: none` once landed | ok
aurora-bloom-bg-flip | a purple-orange aurora rises from the bottom of a light frame; the background slams dark in under half a second while the copy blur-swaps | 156 f · low → high | blob blur 60 px, 90%×85%; rise translateY 32%→−6% + scale 1→1.25 over t 0.04→0.56 outCubic; **flip t 0.57→0.64 inOutQuad ≈ 0.36 s**; bg `#ececec` → `#0a0a12`; blob opacity 1→0.4; orange core drift ±8%; line A blurs out per word (stagger 0.04, 0.10 each, inQuad, blur→8 px); ~0.6 s with no words; line B blurs in (0.05, 0.11 outQuint, purple → white +0.09) | ideal
brand-frame-snap | a thick brand-colour frame grows around the screen, then flips colour on the frame the layout switches | 140 f · mid | frame 60 px at 1080p, corner labels 30 px bold caps; grows 19 f snappy, 10 f before the window; window spring damping 15 / stiffness 115, y 660→0, rotateX 18°→0, scale 0.88→1; colour flip at f84 (≥30 f after landing); white pulse 3 f 0.6→0.2, radial; thickness bounce = exp-decayed cos, 12 px | ideal
fui-hud-moves | a reticle assembles around a target and locks on | 90 f · mid-high | corners rush in from ≥1000 px; overshoot to 0.94× then back to 1; lock frame: white overlay 0.55 → 0.28 + label on the same frame | ideal
glow-flyline-moves (A ambient orbs, B flight arcs, C orb-to-line relay) | three dark-scene accents | 170 / 140 / 165 f · low / mid / mid-high | A: teal / deep-sea blue / coral at 0.55 / 0.5 / 0.42, drift 280–300 px, periods 96–150 f (all different); glass card backdrop blur 44 px + saturate 1.5 (no filtered or translucent ancestors); converge f115–145 out-sine, then 25 f still. B: white core 3.5 px butt segments + 7 / 18 px indigo glow (light version: 4.5 px white on a 9 px dark underlay); head r 7 + r 40 halo + 9-dot tail; landing pulse 6 f out / 12 f decay to 0.25, ring 14 f. C: node lights in 8 f on the arrival frame, ring 20 f | ok
icon-performance-moves | an escalating attention bounce that squashes on landing | 156 f · build-up | icon 360–400 px; 4 hops at 0.35 / 0.6 / 0.85 / 1.2 × icon height, airtime 14 / 18 / 22 / 26 f (∝ √height); contact 2 f, squash 0.1→0.2 (last 1.2× wide, 0.8× tall), damped settle; push 8% f72–90; neighbours blur to 7 px and −30% saturation f30–96 | ideal
impact-feedback (B combo counter, C anime impact frame) | two impact layers | element-level · high | B: hits every 28 f (at 30 / 58 / 86), 10 f ease-in(quad) fall, 2 f global freeze per hit; damage numbers 1.45→1, rise 150 px, fade 12 f after 4 f, 88 / 104 / 124 px yellow italic; counter pulses 1.3 / 1.45 / 1.6, rotate −2 / −4 / −6°, 140 / 166 / 196 px, decay exp(−t/2.4). C: 6 f anticipation to 0.985, crash 6 f to 2.25×; impact frame = 3 f of `invert(1) grayscale(1) contrast(1.45)` + 34 wedge / 22 needle speed lines + red / cyan negative copies ±8 px; frame 4 all removed; shake 6 px, τ≈2.2 f, ~12 f | ok
light-play-moves (A spotlight sweep reveals the title, B single sheen across a card) | controlled light | 170 / 150 f · mid / low | A: dark 0.07 vs lit 1.0; warm white `#f8efe2` serif on wine-black velvet `#1a0a0d` → `#070203`; ellipse 360 px on a pendulum x = 960 + 600·sinθ·env, period 50 f, 2.25 periods to f121, dipping 44 px at the centre. B: band 2× card width at 115°, soft 0.14 + core 0.5 warm white (screen), swift sweep f58–90 while the card turns rotateY 21°→14°; unmount the sheen afterwards; holds 30 / 55 f | ok
radial-ripple-phone-chips | four concentric grey circles breathe out of phase; a phone mock auto-scrolls; two chips spring in | 168 f · low | circles 2240 / 1760 / 1280 / 840 px; breathe 1 ± 0.06, 1.5 cycles; phase step 1.7 rad; phone shadow `0 4px 10px` + `0 40px 80px -20px` + `0 90px 140px -40px` (sand shadow tint); feed scroll 0→−560 px linear over t 0.08→0.98; chips spring damping 13 / stiffness 190, 0.8→1, out 28 px, at f37 and f67; hover ±8 px; chip text 36 px / 600 + 60 px accent icon circle | ideal (phone)
★ riso-print-hits | a risograph hit: one misregistered colour split that snaps into register | 120 f · high | two inks, fluorescent pink `#ff4fa3` + blue `#1f5fc4`, `multiply` over recycled paper `#f3eee2`; offset = A·cos(2πt/18)·e^(−t/60), A = (20, 8) px, opposite per plate (300 px title); **hard snap to zero at f72** (not a fade-out); slam-in 8 f `Easing.in(cubic)` with the split on the hit frame; register pulse 1.03→1 over 4 f + a stamp 1.5→1 + 1.2% page jolt over 10 f; split on the title only; ≥40 f still | ideal
scan-bracket-sweep | a skeleton document pops in, L-brackets drop to its corners, a thin line sweeps it five times | 150 f · mid-low | doc 0.86→1 over t 0–0.11 outCubic; brackets 34 px arms, 1.6 px round stroke, −7 px outset, stagger 0.022, 0.055 each; 5 passes over t 0.17→0.95, each inOutSine with a 12% end pause; line 1.2 px core + ≤82 px trail (multiply) that flips with direction; clipped to the doc's 10 px radius | ideal
scanline-annotate-focus | a scanline descends; as it clears each block, brackets snap onto it and a mono caption types beside it | 150 f · mid | scan 74 f linear, y −20→860 (zero easing); trigger frame from each block's bottom edge; ≥4 f between triggers; bracket close 76→0 px spring damping 15; corners 40→26 px, 3.5 px; focus flash fill 0.075; label +5 f, ~2.2 chars/f, 32 px mono; live counter 30 px | ideal
scanline-assemble-flyin | an empty dark grid; a descending scanline; each component flies in from off-screen to snap behind it | 156 f · mid-high | scan 84 f linear, y −20→880; ≥4 f between landings; travel 260–980 px, ±2–7°; `EASE.overshoot` 14 f; `SpeedBlur` 0.32 × speed ≤18 px; landing corner marks 20→10 px out, 22 px arms, 3 f on / 9 f off | ideal
slam-entrance-moves (A perspective snap, B score drop, C impact that pushes neighbours) | three high-energy arrivals | 120 / 135 / 140 f · high | A: 18 f translateX −1350→0 `EASE.snappy` with perspective / twist / scale on a late `bezier(.62,0,.3,1)` 16 f; `SpeedBlur` 0.2 × speed ≤26 px + 7 speed lines; rotateY to +6° at f15–20, spring damping 16 back; 8 px shake 2 f; 48 radial lines 9 f; text lands 3 f later. B: hovers f0–9 (2.75→2.6, blur 10 px), drops f9–15 ease-in(quad) to 0.965, spring damping 14 to 1; ring 120→1500 px in 16 f, 14 shards 280–580 px + 16 sparks, shake 18 px decaying over 5 f, 2 f white flash. C: ring 100→1100 px / 16 f reaches neighbours ~3 f after landing; neighbour push cos(t/2)·e^(−t/8), clamped at 40 f; f0–16 hover lift 20 px with 1.55→1.6, slam f16–22. Hold ≥45 f | ok
spotlight-sweep-moves (A wake-sleep sweep, B edge-glow pan with purple bleed, C radial reveal from a corner) | three dark-scene spotlight moves | 3.5–4.5 s · mid-low | all motion linear (zero easing is the lifeline); C radius ends exactly at full cover (1300 px at 1080p over 100 f); edge glow 3–4 layers (blur 26 + 9 + core + pink offset); reveal mask feather ~15% | ok

#### Outro (`references/shots/outro/`)
card | what it does | length · energy | exact values | vertical?
---|---|---|---|---
grain-dissolve | a line of text boils into grain inside a hatched frame, then condenses into a larger glowing wordmark | 60 f · mid-high | displacement scale peak 52; baseFrequency 0.9 → +0.4; seed floor(t·46) (≥20 changes/s); sand phase t 0.13–0.28 outCubic; condense crossfade t 0.60–0.71 inOutCubic; glow = burst·0.3 + cond·0.7 − settle·0.45 (never back to 0) | ideal
★ logo-shrink-wordmark-lockup | a neon ring shrinks into a solid mark with a braking overshoot, slides left, letters stagger in, slogan fades | 132 f · mid | scale 5.4→1; +6% overshoot (sine envelope t 0.26–0.37); heal t 0.10–0.28; slide −90.5 px t 0.34–0.47; letters from t 0.46, stagger (0.7−0.46)/n (15 chars = 0.016), 0.10 each; slogan fades t 0.72–0.84 as one line | stack mark over word
neon-triple-marquee | three rows of outlined neon giants scroll in opposite directions, lighting in turn | 150 f · mid-high | 286 px condensed type, 290 px row pitch; 9 / 11 / 9 px/f, middle reversed; 42 f pulse cycle, 14 f per row + 2 f overlap; dark glass 0.3, lit stroke 6→10 px; glow drop-shadows 9 / 36 / 90 px + wall spill 0.55; rotateY −17°→−9°, perspective 1700; power-on 5 f per row, power-off from f124, 6 f per row | more rows
★ outro-group-photo-launch | the film's elements assemble around the wordmark under a crane, stage light and gold dust | 145 f · peak | see Ink Press outro; the card adds speed blur 0.3 × px/f ≤22, contact shadow tightening at cue+9→16 + 1.5% press, a push that starts from zero velocity after f36, and (demo) 20 motes 2.4–4.2 px at 0.35–0.7 + 6 foreground bokeh | re-arc vertically
ui-strip-away-outro | after Publish is clicked the editor UI evaporates edge-inward; the button slides centre and grows; hands off to the wordmark | 144 f · mid | 6 layers, 4 f apart, 14 f each, ease-in; outer → centre, the button's layer last; 50–140 px outward; button 18 f to centre, ×1.5, brighter glow; wordmark ~10 f after the button fades, spring; wordmark hold ≥1 s | ok
ui-to-brand-morph (A icon flips flat and blooms into the mark, B input field contracts into a capsule as pieces assemble the logo) | two UI-to-brand morphs | 130 / 168 f · mid-high | A: anticipation f12–34 tilts −12° / +14° / −18° → 0 (`inOut(sin)`, origin bottom 78%); flatten f34–46 `Easing.in(cubic)` scaleX 1→0.04 with ghosts 0.22 / 0.14; bloom from f46 spring damping 11 / stiffness 130; cut spring damping 16 / stiffness 170 from f53; letters 2.6 f stagger, 12 f, 1.9→1 + blur 14→0, 112 px / 700 / +0.03em. B: send press 0.84 + 6 f white flash; text flies +760 / −420, −9°, 11 f ease-in; ink floods from the send key f28–40 (circular clip, solid); morph spring damping 15 / stiffness 95 from f30 (1040×132 r34 → 89×330); three pieces drop at f58 / 72 / 86, spring damping 13 from −760 px | ok

#### Sequence template (`references/sequences/promo-energy-arc.md`)
Default 30–60 s promo skeleton: ① brand open 8–12% (low; wordmark + ≥1 s hold) → ② single-hero portrait 12–15% (mid; one subject, arc ≥3 s) → ③ feature climb 55–65% (mid-high alternating with low; one technique per feature) with 2–4 breathing title cards of 50–55 f inserted every 1–2 feature shots → ④ launch finale 13–16% (peak; group photo, sign-off hold ≥1 s). Budget holds before motion; put the densest (document / report) shot second- or third-to-last; choose a transition per seam from `shot-transitions`. For 15 s films merge slots, but keep the ① hold and the ④ peak.

#### Beat sync (`references/music-beat-sync.md`)
Least-squares grid fit over librosa beats (the scalar tempo can be 2%+ off: 129.2 vs 131.97); accept residuals ≤ ±15 ms; check 0.5× / 2× grids; classify kick 40–160 Hz, snare 150–500 Hz + 1–3 kHz, hi-hat 6–14 kHz; grid acceptance ≥98% match; timeline in beats, `beatF(n) = round(beatT(n)·FPS)`; strong hits sit on integer beats (a half-beat pin measured +5.75 f off); after render, cut error ≤3 f pass, ≤1.5 f ideal.

### Caption styles (exact values)
claude-shorts presets (`AgriciDaniel/claude-shorts`, `references/caption-styles.md` and `remotion/src/components/{Bold,Bounce,Clean}Captions.tsx`, `styles/theme.ts`, `hooks/useCaptionPages.ts`). All three page words with `createTikTokStyleCaptions({ combineTokensWithinMilliseconds })` from `@remotion/captions`; "words per page" is only the expected result of the combine window — the code does not enforce a word count. All sit 350 px above the bottom of a 1920-tall frame. Fonts are Google Fonts (OFL) shipped as TTFs in `public/fonts/`.

preset | font | size | case | words / page (combine) | colours | outline / shadow | entrance | margins
---|---|---|---|---|---|---|---|---
**Bold** (business, education, motivation) | Montserrat 800 | 72 px, line-height 1.1 | UPPERCASE | 2–3 (800 ms) | text `#FFFFFF`, active word `#FFD700` | four hard 3 px diagonal shadows in `#000000` (reads as an outline) | whole page `scale` from 0 on `spring {mass 1, damping 12, stiffness 200}`, every page | left / right 40, gap 12
**Bounce** (entertainment, reactions) | Bangers 400 | 84 px, line-height 1.0 | UPPERCASE | 1–2 (600 ms) | one colour per page, cycling `#00FFFF` → `#FF00FF` → `#00FF00` → `#FFFF00` → `#FF6600` → `#FF0066`; no active-word highlight | four hard 4 px diagonal black shadows | `scale = 0.7 + 0.3·spring {mass 1, damping 8, stiffness 180}` | left / right 40
**Clean** (interviews, podcasts) | Inter 700 | 56 px, line-height 1.3 | as spoken | 3–5 (1500 ms) | text `#FFFFFF`, active word `#E0E0E0` (the active word is *dimmer*, a very weak cue) | `2px 2px 8px rgba(0,0,0,0.6)` | opacity 0→1 over 6 f (no spring) | left / right 60, word gap 8

The doc's overshoot claims don't match the spring maths (my calculation, damping ratio ζ = c / 2√(k·m)): Bold ζ ≈ 0.42 → the page overshoots to ≈1.23×, not "~1.05"; Bounce ζ ≈ 0.30 → raw spring ≈1.37, so scale peaks ≈1.11×, not "~1.2×". Worth re-tuning if we adopt them.

Related claude-shorts parts:
- **Hook overlay** (`HookOverlay.tsx`, copy rules in `references/scoring-rubric.md`): visible 0.3–3.5 s; line 1 = 4–8 words, Montserrat 800 48 px white with 3 px four-way black hard shadow; line 2 = 3–6 words, Inter 600 28 px `#00BFFF` with `2px 2px 0 black`; must not repeat the first spoken words; pop-in spring `{mass 1, damping 14, stiffness 200}` (≈1.17× overshoot by my maths), fade 3.0→3.5 s; positioned `top: 40`, left / right 40, gap 8 — which sits *inside* the platform top zones in their own table (150–210 px).
- **Progress bar** (`ProgressBar.tsx`): 1080×4 px at the very bottom, track `rgba(255,255,255,0.2)`, fill white, linear with time.
- **Reframe** (`VideoFrame.tsx`): the 9:16 crop is a CSS translate + scale of `<OffthreadVideo>` inside a 1080×1920 `overflow: hidden` box, with optional crop-x keyframes for cursor tracking; no ffmpeg pre-crop.

Caption-like parts from the other sources:
- Ink Press narration strip: mono 22 px, 0.14em, uppercase, 6×6 amber square, 72 px from the bottom, 8 f in / 8 f out; six captions over 36 s, none on title cards or the outro (`template/src/aifl/Caption.tsx`). Below shotcraft's own Q11 floor.
- Creator Editorial seam caption: small serif-italic phrase at the panel seam (54cqh), one VO clause at a time, fade or rise 20–30 px; "never paragraph captions, never full-sentence karaoke" (`vertical-video-editing-skills` SKILL.md pattern 10). It also adopts hyperframes-helper's "white text with a soft glow / stroke" caption styling, without values.
- claude-remotion-skill word-synced captions: heavy display weight, 2–4 words per page, `combineTokensWithinMilliseconds: 1200`, active word in the hero colour, at ~65% of the frame height (`references/motion-patterns.md` §17).
- shotcraft karaoke fill (`type-rhythm-sync` B) and word-level underline: see the typography table.

### Safe zones
claude-shorts `references/platform-specs.md`, 1080×1920, medians of 10+ community measurements (no platform publishes pixel specs):

zone | TikTok | YouTube Shorts | Instagram Reels | Universal
---|---|---|---|---
top | 150 | 150 | 210 | 210
bottom | 320 | 350 | 340 | 450
left | 60 | 60 | 40 | 60
right | 120 | 150 | 100 | 150
safe area | 900×1450 | 870×1420 | 940×1370 | 870×1260

Inconsistencies inside the same repo: `caption-styles.md` says TikTok needs 150 px bottom / 64 px sides and Shorts 120 px bottom, and that the 350 px caption offset "clears all platform UI"; `platform-specs.md` says 350 px clears TikTok and Reels but Shorts wants 400 px+ and universal 450 px+. The hook overlay at `top: 40` and the bar at `bottom: 0` ignore the table.

Other safe-area rules seen: claude-remotion-skill — critical text in the middle ~75% of the height; Vibe Life — 5cqw on the long edge, 5.5cqh on the short edge, nothing touching an edge except full-bleed grounds; Creator Editorial — face centred in its panel with eyes in the upper third, never cut by a seam, caption or edge.

### Transitions from the non-shotcraft sources (one line each)
- Paper cut — 80–120 ms hard swap between plates, masked by SFX, never a fade (`styles/vibe-life/FRAME.md`).
- Ribbon wipe — full-bleed ink ribbon crosses in 600–900 ms, `cubic-bezier(0.23, 1, 0.32, 1)`, section turns only (`styles/vibe-life/FRAME.md`).
- Split → full frame — a panel grows to full 9:16 (height / y, or width 50cqw → 100cqw) with `power3.inOut` / `power3.out` in 0.45–0.6 s plus a whoosh; or the top panel slides off and the bottom takes over (`SKILL.md` editorial-look §4, camera-moves).
- Dark grid interstitial — 0.6–1.2 s typographic chapter card between topics (`SKILL.md` editorial-look §3).
- Slide — `@remotion/transitions` `slide({direction: "from-right"})`, `linearTiming({durationInFrames: 12})` (claude-remotion-skill `motion-patterns.md` §14).
- Whip pan — background travels 1500 px in 6 f with `blur(8px)`, cut hidden mid-whip (same file).
- Scale-through — A scales to 1.3 and fades while B scales 0.8 → 1 underneath (same file).
- Mask wipe — brand-coloured shape sweeps across, cut behind it; all hand-rolled ones 8–14 f (same file).
- Whip blur into a finale — blur 0 → 14 → 0 px over 16 f (claude-remotion-skill `examples/src/codeedit/CodeEdit.tsx`).
- Ink Press dissolves — brand group out over 7 f (rise 40 px, −12%); scenes fade to paper over their last 5 f; title cards fade over 8 f (`template/src/aifl/*`).

### Camera moves (one line each)
- Anti-jitter contract — animate a `.cam` wrapper, never the timed clip; `will-change: transform; backface-visibility: hidden; transform: translateZ(0)`; GSAP `force3D: true`; always eased (`power1.inOut` drifts, `power2/3.out` arrivals); small magnitudes; deliberate `transform-origin`; check 3–5 rendered frames for shimmer, sub-pixel jitter and start/end pops (`vertical-video-editing-skills` SKILL.md "camera-moves").
- Eased push — `scale 1.0 → 1.12` over 2–3 s with `xPercent −1.5 → 1.5`, `power1.inOut` (example 2.6 s) (same).
- Pan — `xPercent ±1.5` only, plus `scale 1.04` so edges never show (same).
- Ken Burns — every still: scale 1 → 1.08 (component default 1.1) on `bezier(0.83,0,0.17,1)`, pan 0 → −25 px (unintentionally linear), alternate in / out between shots (claude-remotion-skill §8).
- Parallax — x 0 → −120 px over 90 f at 0.3 / 0.6 / 1.0 per layer (claude-remotion-skill §13).
- Idle breathing — scale 1 + sin(f/22)·0.015, float sin(f/30)·3 px, drift −20 px over 300 f (claude-remotion-skill §12; the look other sources ban).
- PageCam keyframes, crash zoom, braking whip pan, crane, orbit, frozen orbit, isolating pull-back, drone dive — see the shotcraft component list and the Camera & Space table.
- No handheld shake on bright UI promos; at most 0.02 world units on dark documentary-feel pieces (shotcraft Q3).

### Layout patterns (one line each)
- The editorial look's ten patterns — editorial headline, paper stage, dark grid interstitial, stacked split, highlight-bar super, name / seam pill, headline card, UI-card stack, glow word, seam caption — with values in the "Creator Editorial" style above (`SKILL.md` editorial-look).
- Stacked split — B-roll top 54cqh (52–56), talking head bottom 46cqh, caption on the seam at 54cqh `translateY(-50%)`; bottom panel `object-position: 50% 22%` (same).
- Face-safe positioning — find the face in the source (usually 20–35% from the top in 9:16 talking-head sources), set `object-position: 50% <face-y>%` per panel (bias x too in side-by-side splits), keep the face inside for the whole camera move including its end pose, verify on preview screenshots and the render contact sheet; failure is as severe as jitter (same, §4).
- Vibe Life's seven frame treatments (identity cover, oversized claim, focal artifact, agent ledger, ribbon break, live console, stat closer) with 9:16 re-flow rules (`styles/vibe-life/FRAME.md`).
- Emphasis ladder — seam caption → name pill → highlight bar → editorial headline → glow word; never two loud ones in a frame (`SKILL.md`).
- Five-layer stack — background mesh → assets → graphics → grade → grain + vignette (claude-remotion-skill).
- 2×2 quad split with offset beats; comic-panel angled split; bottom-push chapter stack; hero-slot mosaic — see the shotcraft tables.

### Sound and export parts (one line each)
- ffmpeg SFX synthesis — whoosh `anoisesrc` pink 0.45 s, amplitude 0.5, fades 0.05 s in / 0.25 s out from 0.2 s, highpass 300 Hz, lowpass 6 kHz; click 2200 Hz sine 0.04 s with a 0.03 s fade; riser 0.6–1.0 s sweep; impact 80–120 Hz sine + noise burst; SFX −18 to −12 dB under voice (`vertical-video-editing-skills` SKILL.md).
- Node-synthesised WAV kit — noise-burst whoosh, pitch-drop pop, sine-thump kick / bass, detuned-sine pad (claude-remotion-skill `examples/scripts/gen-sfx.mjs`, `gen-track.mjs`; read by name only).
- Freesound SFX pipeline with CC0 default, licence check on the detail page, provenance ledger and measurements; 5 BGM tracks with attributions (shotcraft `references/sfx-sourcing.md`, `assets/audio/` — not read in full, outside this brief).
- Export per platform — YouTube Shorts 1080×1920, H.264 High 4.2, 12 Mbps target / 14 max / 24 M buffer, AAC 192 kbps 48 kHz, ≤60 s, ≤256 MB; TikTok CRF 18, max 10 Mbps / 20 M buffer, AAC 128 kbps 44.1 kHz, ≤287 MB; Reels 4.5 Mbps / 5 max / 10 M buffer, AAC 128 kbps 44.1 kHz, ≤90 s, ≤250 MB; all `loudnorm I=-14:TP=-1:LRA=11`, `yuv420p`, `+faststart` (claude-shorts `platform-specs.md`).
- Render gate — ffprobe asserts 1080×1920 (overridable), h264, yuv420p, an audio stream, and optionally duration within ±0.5 s by default (`vertical-video-editing-skills/skills/video-editing/scripts/verify-render.mjs`).
- Render masters at `--crf 16`–`17` (claude-remotion-skill).

---

## Conflicts between the sources
- **Glow, mesh blobs, idle breathing**: claude-remotion-skill requires them on every scene; shotcraft allows one light effect per hero and bans mass glints; Vibe Life bans soft blur on chrome and decorative glow; earlier research noted HyperFrames bans them outright.
- **SFX timing**: claude-remotion-skill starts SFX 2–3 frames *before* the visual; shotcraft aligns the measured peak of each file to the frame and subtracts a measured output offset.
- **Display type motion**: Vibe Life says display type never animates; the same repo's editorial look animates underlines, bars and pills.
- **Video element**: claude-remotion-skill and claude-shorts mandate `<OffthreadVideo>`; current official Remotion skills point to `<Video>` from `@remotion/media` (from our earlier research — I did not re-check against 4.0.535).
- **Fonts**: shotcraft demos deliberately use system fonts only; the other three load Google fonts locally.
- **Easing purity**: claude-remotion-skill forbids linear easing but uses `linearTiming` for its slide and an un-eased pan in Ken Burns; shotcraft *requires* linear motion in a few places (scanlines, spotlight sweeps, auto-scroll, the glitch progress bar).

## Couldn't open, or only partly read
- `github.com/nopefallacy/vertical-video-editing` returns 404 (repo and API). Read instead: `nopefallacy/vertical-video-editing-skills` (same author, same creation date, same 38,500-byte SKILL.md; an identical copy exists at `adriiita/vertical-video-editing-skill`).
- `styles/vibe-life/README.html` refers to a `design-showcase.html` that is not in the repo.
- shotcraft: I read every card's frontmatter and parameter table, and the motion core of the starred cards; I did not read the 158 demo TSX files in full (I grepped them for look / spring / stage usage). I did not watch the gallery's 150 preview videos or the template render. `references/{sound-design,sfx-sourcing,workbench,jianying-export,publish-upload-post,final-review}.md` and `shot-polish/*` were outside this brief and not read.
- claude-remotion-skill: example scenes other than `CodeEdit.tsx` were read only for font sizes; the SFX scripts were not read.
- claude-shorts: `references/remotion-patterns.md` skimmed (spring guidance: damping <10 visible bounce, 10–15 slight overshoot, >20 none); Python scripts not read.
- Nothing was installed or run; downloads are in `C:\Users\subra\AppData\Local\Temp\claude\d--code-files-content-engine\d397bad3-8832-4aa1-9c55-4c7d7f94162b\scratchpad\stylesresearch\shotcraft\`.
