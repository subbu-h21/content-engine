# Five Skills, Five Different Worlds: visual styles extracted

Research only, done 2026-10-31. Nothing from these repos was installed or run. Downloads (text files only) are in
`C:\Users\subra\AppData\Local\Temp\claude\d--code-files-content-engine\d397bad3-8832-4aa1-9c55-4c7d7f94162b\scratchpad\stylesresearch\fiveskills\`.

**Frame-size warning.** Lemo-Opuscar lays out at **1920×1080, 24 fps** by default (its README says vertical feeds
want 1080×1920 or 1080×1440, and its renderer takes `--size WxH`). So every pixel size quoted from Lemo below is at
1920×1080 unless the entry says otherwise. Our default is 1080×1920 at 24–30 fps, so sizes need re-deriving, not
copying.

## Sources and what was read

| # | Repo | Licence | Verdict |
|---|---|---|---|
| 1 | `lemomo-ai/lemo-opuscar` | MIT for code and docs; demo films and stills CC BY 4.0 (credit LemoLab + link) | Usable. 66 styles (not 43) + 98 OPUSCAR 98 film-style prompts |
| 2 | `pyang5166/gbro-collage-broll` | MIT | Usable; the visuals depend on Gemini image/video generation |
| 3 | `JohnHeibel/ClaudeAnimationBase` | MIT | Usable code; the mascot (Clawd) is Anthropic's character |
| 4 | `feitangyuan/onetake` | PolyForm Noncommercial | **DO NOT USE** |

### Lemo-Opuscar: what it is, where styles live, how it renders
- **Count has grown.** The poster said "43 different film styles". The repo now says 66 (pushed 2026-10-29). The 43
  match exactly the styles numbered 01–54 in `style.json` (the numbering has gaps: 11, 14, 30, 35, 38–40, 47, 49–51
  are unused). The other 23 came later: Evidence Films (8, 2026-10-16), Edit & Documentary (8, 2026-10-22), and 7 new
  ones (2026-10-29, one contributed by @EianLu).
- **Where styles are defined.** `styles/<slug>/STYLE.md` (the reusable style prompt, fixed 11 sections: essence,
  materials, colour logic, type, motion, camera, sound, native moves, pitfalls, engine, variation),
  `styles/<slug>/DEMO.md` (the demo film's actual palette, sizes, shots, score, build notes) and
  `styles/<slug>/style.json` (name, category, number, uses). Index: `styles/README.md`; template: `styles/_template/`.
  Rule of the library: STYLE.md holds rules, DEMO.md holds the demo's numbers, so exact hex values and pixel sizes are
  usually in DEMO.md.
- **A second set of styles:** `styleboard/opuscar98_styles.json` holds 98 short style prompts, one per Best Picture
  winner 1927–2025, used in the 6:31 film *OPUSCAR 98* (77 in 2D, 4 in 2.5D, 17 in 3D). Each has hex values, finish
  values and an "Avoid" list. They are condensed into their own section below.
- **Stack.** Each film is a web page exposing `window.DUR`, a deterministic `window.render(t)`, `window.READY`, an
  optional event list `window.EV` and `window.TEXTS(t)` (for a reading-time check). Canvas 2D for most 2D styles,
  three.js r170 (WebGL2, headless GPU, depth of field + GTAO from `core/three/post.js`, rendered at 2× and
  downsampled) for 3D, WebGL2 shaders for post passes (film damage, CRT, ink redraw). Headless Chrome screenshots
  each frame as JPEG, one browser per worker, ffmpeg encodes. Grain is added in ffmpeg (`mux.sh … [grain]`), not in
  the page, because page grain makes frames incompressible. One `timeline.js` (sections, BPM, beats, hit points)
  drives picture, score, foley and subtitles; `cuecheck.py` checks every visual hit against its music cue (aim 0 ms).
  Voice: Kokoro (English, local), edge-tts (Chinese), checked with faster-whisper. Music: `core/audio/sampler.py`
  over free sample libraries (VSCO 2 CE, VCSL, FreePats, Karoryfer, Salamander), Karplus–Strong plucks, numpy synths.
  Foley: procedural `core/audio/sfx.py`. Master: two-pass loudnorm to −14 LUFS. Fonts: Google Fonts (OFL),
  self-hosted. Assets: only CC0 / CC BY / OFL. Node 20+, ffmpeg 7+, Python 3.11+.
- **Example media.** Gallery: https://lemomo-ai.github.io/lemo-opuscar/ . Per style: frame
  `https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/<slug>.jpg`, poster
  `…/main/styles/<slug>/poster.jpg`, film `https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/<slug>.mp4`.
- **Licence detail.** Code/docs MIT; demo films and stills CC BY 4.0. Three voice tracks are excluded and must not be
  reused: the shouts in Game Show Flat (macOS `say`), the narration in Paper-cut Lightbox (Edge TTS), the narration
  in Broadcast News Package (Doubao TTS). Third-party assets in demos keep their own licences (each demo's `CREDITS`).
- The styles are written as prompts tuned for Claude Opus 5.5; they describe rules in prose, and the numbers come
  from the demos.

---

### Lemo-Opuscar: rules that apply to every style (from `DIRECTOR.md`, `TECHNIQUE.md`)
These sit above the per-style rules, so a style entry below doesn't repeat them.
- **Length and format:** 30–60 s; 1920×1080 at 24 fps unless a style sets 30/60 fps; vertical with `--size 1080x1920`; −14 LUFS.
- **Story:** one subject, one goal, one turn; a hook in the first 3 s; an ending that echoes the opening; one "native move" of the medium placed at the emotional peak.
- **Reading time:** every subtitle holds ≥ max(1.8 s, speech + 0.6 s); after text finishes animating in, hold ≈ letters ÷ 15 + 1.5 s (English) or characters ÷ 4.5 + 1.5 s (Chinese); title cards ≥ 4 s; go fast with fewer words per screen, never by cutting before people finish reading.
- **Pace:** vary it, with one clear acceleration or deceleration and one breath (a long take or held pause); don't cut on every beat.
- **Camera:** at least four different camera moves per film, one signature shot, transitions built from the medium itself (avoid default fades and hard cuts); at key moments the subject fills ≥ 1/3 of the frame height.
- **Sound:** every visible action has a sound; three layers (ambience, foley, music); at least two real silences before the turn or peak; sound used as a transition (J/L-cut) at least twice; never generic piano-and-strings.
- **Mix:** compress TTS, voice ≈ 10 dB above music by RMS, two-pass loudnorm −14 LUFS; low end 20–120 Hz ≈ −3 dB relative to the rest.
- **Common failures they list:** subject too small or at the frame edge; too dark, or colour on the same colour; subtitles covering the subject; gags too fast; blank frames in transitions; effects that don't track the subject after the camera moves.
- **Copyright red lines:** references teach grammar only; never copy characters, designs, melodies, shots, logos or type designs; no real works, brands or events unless the user owns the rights. Several demos are unofficial fan films (Pictogram Motion copies a real event identity, Living Screencast uses Anthropic's Clawd and Claude UI, Game Show Flat names real AI companies): keep the grammar, never those marks.

## Index of every style found, with ratings

**How to read the ratings.** All 66 Lemo entries came out *full*: every style has a STYLE.md and a DEMO.md, with exact hex values and motion numbers. So "full" alone doesn't separate them. Two extra columns do:
- **Spec** is a crude, mechanical measure: how many numbers the entry contains. **A** means 200 or more, **B** means 120–199, **C** means under 120. A C entry is still complete in prose; it just has fewer numbers.
- **★** marks my pick of the most distinct *and* best specified styles. **≈** marks a style that overlaps strongly with another in the library; the overlap is named in the Notes column.

**Needs column.** "footage" means it needs real video; "real data/material" means scans, photos, datasets or CAD; "3D" means the demo is three.js, so for us it would be Blender. No Lemo style needs AI images. News Package lets you use them optionally, for background plates only.

| No. | Style | slug | Category | Needs | Spec | Notes |
|---|---|---|---|---|---|---|
| 63 | Caption News | `caption-news` | Edit & Documentary | footage | A | ★ built for sound-off social feeds |
| 64 | 1920s Newsreel | `newsreel` | Edit & Documentary | footage (archive film, print, recordings) | A | ≈ silent-film (shared projector finish) |
| 65 | Live Countdown Split-screen | `countdown` | Edit & Documentary | footage (2–8 synced cameras) | B |  |
| 66 | Time-lapse Symphony | `city-symphony` | Edit & Documentary | footage (time-lapse, aerials) | A |  |
| 67 | Visual Investigation (Evidence Desk) | `visual-investigation` | Edit & Documentary | footage + documents + photos | C |  |
| 68 | Constructivist Montage (Red-Ink Archive Montage) | `kino-montage` | Edit & Documentary | footage + archive photos/documents | B |  |
| 69 | Sports Telestrator (Pundit's Freeze-and-Draw) | `telestrator` | Edit & Documentary | footage (match) | B | match footage licence/Content ID caveat |
| 70 | Broadcast News Package (Bulletin Graphics System) | `news-package` | Edit & Documentary | real news facts; footage optional; AI plates optional | B | demo narration excluded from licence; LemoLab brand colours |
| 55 | Satellite Briefing | `satellite-briefing` | Evidence Films | real data/material (satellite rasters); WebGL globe | B |  |
| 56 | Engineering Briefing Board | `briefing-board` | Evidence Films | real data/material (photos) | B |  |
| 57 | LiDAR Survey | `lidar-survey` | Evidence Films | real data/material (lidar point cloud); 3D | B |  |
| 58 | Projection on White Model | `white-model` | Evidence Films | real data/material (footprints + heights); 3D | B |  |
| 59 | Data Physicalization | `data-physical` | Evidence Films | real data/material (statistics); 3D | B |  |
| 60 | Exploded Teardown | `teardown` | Evidence Films | real data/material (CAD/KiCad); 3D | C |  |
| 61 | Microscope Story | `microscope` | Evidence Films | real data/material (slide scans) | C |  |
| 62 | Archive Light Table | `archive-lighttable` | Evidence Films | real data/material (archive scans) | C |  |
| 01 | Crayon Picture Book | `crayon-book` | Hand-drawn & Painting | none | C |  |
| 02 | Watercolor Field Journal (lib: Watercolor Brush) | `watercolor` | Hand-drawn & Painting | none | A | ★ |
| 03 | Chinese Ink Wash (Xieyi) | `ink-wash` | Hand-drawn & Painting | none | C |  |
| 04 | Impasto Palette Knife | `impasto` | Hand-drawn & Painting | none | C |  |
| 05 | One-line Drawing | `one-line` | Hand-drawn & Painting | none | C |  |
| 06 | Whiteboard Explainer | `whiteboard` | Hand-drawn & Painting | none | C | ≈ chalkboard |
| 45 | Urban Sketch · Pen & Wash | `urban-sketch` | Hand-drawn & Painting | none | B |  |
| 73 | Chalkboard | `chalkboard` | Hand-drawn & Painting | none | B | ≈ whiteboard (dark slate, true stroke order) |
| 07 | Shadow Puppetry | `shadow-puppet` | East Asian Traditions | none | C |  |
| 08 | Ukiyo-e | `ukiyoe` | East Asian Traditions | none | B |  |
| 09 | Red Paper-cut (Chinese window flowers) | `papercut-red` | East Asian Traditions | none | B | ≈ paper-lantern, spy-titles (cut paper) |
| 10 | Paper-cut Lightbox (layered shadow-box lamp) | `paper-lantern` | East Asian Traditions | 3D | A | ★ 3D in practice; demo narration excluded from licence |
| 12 | Risograph Print | `risograph` | Print & Printmaking | none | B | ≈ halftone-dossier, silkscreen-poster |
| 13 | Halftone Dossier (retro print case file) | `halftone-dossier` | Print & Printmaking | none | A | ★ |
| 15 | Woodcut Print (relief print that carves itself) | `woodcut` | Print & Printmaking | none (photo input optional) | C | ≈ engraving, printed-long-take |
| 53 | Copperplate Engraving | `engraving` | Print & Printmaking | none | A | ★ ≈ woodcut / printed-long-take (line-print family) |
| 54 | Silkscreen Travel Poster | `silkscreen-poster` | Print & Printmaking | none | A | ★ |
| 75 | Printed Long Take | `printed-long-take` | Print & Printmaking | 3D | C | ≈ woodcut (scratchboard print, in 3D) |
| 16 | Swiss Motion Graphics | `swiss-motion` | Graphic & Type | none | C | ★ |
| 17 | 60s Spy Title Sequence | `spy-titles` | Graphic & Type | none | C |  |
| 18 | Art Deco | `art-deco` | Graphic & Type | none | C |  |
| 19 | Blueprint | `blueprint` | Graphic & Type | none | C |  |
| 20 | Stained Glass | `stained-glass` | Graphic & Type | none | B |  |
| 21 | Pictogram Motion | `pictogram-motion` | Graphic & Type | none | A | ★ demo palette/identity copies a real event: grammar only |
| 22 | ASCII / CRT Terminal | `ascii-crt` | Graphic & Type | none | B |  |
| 23 | Data Storytelling (pencil chart on cream paper) | `dataviz` | Information & Keynote | none | B |  |
| 24 | Isometric Infographic (flat three-tone diorama) | `iso-infographic` | Information & Keynote | none | B | ≈ isometric-picture-book, lowpoly-island |
| 25 | Dark Tech Keynote (software launch on a black stage) | `dark-keynote` | Information & Keynote | none | B | ≈ generic launch-keynote genre |
| 46 | Living Screencast (pixel mascot inside a redrawn real UI) | `living-screencast` | Information & Keynote | none | B | fan film: Clawd + Claude UI |
| 52 | Sci-fi Hologram HUD (wireframe spec scan) | `hologram-hud` | Information & Keynote | pseudo-3D wireframe (2D canvas) | A | scene style driven by content.json |
| 72 | Transit Map | `transit-map` | Information & Keynote | 2.5D (perspective camera over a flat map) | A | ★ most numbers in the library |
| 74 | Isometric Picture Book | `isometric-picture-book` | Information & Keynote | none | B | ≈ iso-infographic |
| 76 | Circuit Board | `circuit-board` | Information & Keynote | none | B |  |
| 26 | 1930s Rubber Hose Cartoon | `rubber-hose` | Cartoon & Anime | none | B | 4:3 gate |
| 27 | 80s Cel Anime (OVA on a CRT) | `cel-anime-80s` | Cartoon & Anime | none | A | ★ |
| 28 | Sci-Fi Sitcom Toon | `scifi-toon` | Cartoon & Anime | none | B |  |
| 48 | Mid-century Cartoon (1950s how-to card) | `midcentury-toon` | Cartoon & Anime | none | B |  |
| 29 | 16-bit Pixel RPG | `pixel-rpg` | Games | none | A | ★ native 320×180 |
| 31 | HD-2D Lit Diorama (library name "HD-2D") | `hd-2d` | Games | 3D | A | ★ "HD-2D" is a trademark: don't use the name |
| 32 | Microgame Frenzy | `microgame` | Games | none | C |  |
| 33 | Game Show Flat | `game-show` | Games | none | B | ★ demo shouts excluded from licence; names real companies |
| 34 | 1920s Silent Film (Projected Photoplay) | `silent-film` | Cinema & Eras | none (footage input optional) | A | ≈ newsreel |
| 36 | Liminal Found Footage (VHS Camcorder Rule-Horror) | `backrooms` | Cinema & Eras | 3D | B | 4:3 inside 16:9, VHS |
| 37 | Brick Toy (Macro Stop-Motion on a Real Desk) | `brick-toy` | Materials & 3D | 3D | B |  |
| 41 | Paper Pop-up Book (Cut-Paper Diorama on a Real Desk) | `paper-popup` | Materials & 3D | 3D | A | ★ |
| 42 | Tilt-Shift Miniature | `tilt-shift` | Materials & 3D | 3D | A |  |
| 43 | Low-poly Isometric Island | `lowpoly-island` | Materials & 3D | 3D | A | ★ ≈ iso-infographic in 3D |
| 44 | Glass Product Render | `glass-product` | Materials & 3D | 3D | B |  |
| 71 | Memphis Diorama | `memphis-diorama` | Materials & 3D | 3D | A | ★ 60 fps; by @EianLu |
| 77 | Desktop Flythrough | `desktop-flythrough` | Materials & 3D | 3D | A | 30 fps |

**OPUSCAR 98** (98 condensed entries, Part 1b). The two readers picked these as most distinct and best specified: No. 1, 4, 18, 19, 28, 33, 41, 42 (first half) and No. 70, 73, 79, 86, 88, 92, 94, 95 (second half). Many entries overlap a library style; each one names its closest.

| Other sources | Style | Completeness | Notes |
|---|---|---|---|
| gbro-collage-broll | Halftone Paper-Collage B-roll | partial | distinct; rules but almost no numbers; all visuals come from Gemini/Codex image and video generation |
| ClaudeAnimationBase | Painted Boil Cartoon (p5.brush) | full | distinct; every paint and motion value is in the code; needs p5 + p5.brush |
| onetake | (not extracted) | n/a | PolyForm Noncommercial: DO NOT USE |

---

# Part 1: Lemo-Opuscar styles (66)

Ordered by the library's own categories. Sizes are at 1920×1080 unless an entry says otherwise. A value marked ≈ or "converted" is our conversion from RGB or HSL numbers in the source, not a hex the source wrote.

<!-- category: Edit & Documentary -->

## Caption News
- Source: `lemomo-ai/lemo-opuscar` `styles/caption-news/STYLE.md`, `DEMO.md`, `style.json` (No. 63, Edit & Documentary); hex fallbacks from `styles/caption-news/demo/main.js`; licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo is built from third-party footage (Wikimedia Commons CC BY clips, USDA public-domain footage/photos, Natural Earth), each keeping its own licence (see `demo/CREDITS`, `SOURCES.md`); the channel "简闻" is fictional.
- One line: Sound-off social news (mid-2010s captions-first grammar): huge bilingual captions slammed in chunks over real footage, one yellow keyword block, rolling numbers, a source tag on every figure, the original document highlighted on screen.
- Suits: report explainers, data news shorts, "the number you heard is wrong" stories, myth-busting. Real footage: **yes** (footage, photos and the source document are the ground; never generated images as footage). Real data: yes, every number sourced (`FACTS.md`). 3D: no. AI images: explicitly banned.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ink / background | `#0E0E0C` | keyword text on yellow, gradients, dark chips (`rgba(14,14,12,…)`) |
| ivory | `#F7F5EF` | caption text, everything neutral |
| honey (accent) | `#FFC21A` | keyword block, gains, the point, channel bug, lower-third bar, dividers |
| loss red | `#FF4A3D` | losses, the spike, the bad number; split-screen "bad" tint |
| label grey | `#8D8B83` | labels and units |
| unimportant bars | `#5E5C55` | bars that don't matter |
| ledger sheet | `#151512` | data-card ground; ruled lines `rgba(255,255,255,.045)` every 54 px; red double margin `rgba(255,74,61,.38)` at x 78/86 |
| document desk | `#23221E` | dark desk under PDF pages |
| map ramp (5 steps, one hue) | `#4A3530` / `#6E4136` / `#A9503D` / `#E0573F` / `#FF4A3D` | <5 / 5–10 / 10–15 / 15–20 / ≥20 % loss rate (demo) |
| map no data | `#2A2925` | states without data ("未单列" swatch) |
| highlighter | `rgba(255,200,30,.88)` multiply | document highlight rects |
| warm grade layer | `rgba(255,170,70,.06)` soft-light | over all footage (4 % on documents) |
Rule: one accent colour (honey) carries the point; red only for losses; ivory for everything else.
### Typography
- Chinese line: Noto Sans SC 900 (Google Font), 88 px, verdict lines 110 px; ivory with a 20 px dark soft shadow (`rgba(0,0,0,.6)`, blur 20, offset y 4). Hook numbers/words up to 130 px.
- English line: Inter Tight 500 (Google Font), 33 px, ivory. It is the spoken line with digits, not a translation.
- Numbers: Inter Tight 800 with fixed-width digit cells so rolling counters don't jitter; units in Chinese set smaller after the number.
- Chart titles: Noto Sans SC 900 64 px, ≤ 6 characters, plus one grey English line; label chips 21–26 px Inter Tight 500; footage credit 19 px.
- Also used: Inter Tight 600 italic (pull quotes), Noto Sans SC 500. All sizes at 1920×1080.
- Case: English small caps in the channel bug. Emphasis: one `{keyword}` per caption gets the honey block wiping left → right behind it and turns ink-coloured.
- Words on screen: one Chinese line (≤ ~14 characters) + one English line, never wrapped; if it would wrap, split into two captions. Hold ≥ 1.8 s and ideally ≥ spoken line + 0.6 s; captions change at most every ~2.5 s.
### Layout
- 1920×1080. Footage full bleed (never a pillar-boxed vertical).
- Caption card left-aligned at x 120; Chinese baseline y ≈ 948, English baseline y ≈ 1014.
- Channel bug top left x 96, y 52, 46 px high (yellow block, fictional channel name + topic in zh + English small caps). Source tag under it at y 108, 36 px (white "来源" + dark label like `USDA NASS · 2026.08.03`), only on data/document shots.
- Footage credit top right, 19 px on a 50 % dark chip (`视频 作者 · CC BY 3.0`) on every CC BY shot.
- Lower third at x 120, y 742, 96 px high (8 px yellow bar + 78 % dark panel + label + one English line), only for place/date/speaker.
- Shading: bottom gradient 0 → 84 % from y 560 plus a dark radial (45 %, radius 1100) from bottom-left; top gradient 55 % → 0 over 200 px under bug/credit; data cards use a lighter gradient from y 820.
- Charts sit right of centre and bleed to the frame edge; title and source top left, never centred.
- Vertical 9:16 is a separate layout: caption under a 1080×1560 footage band (horizontal sources scaled ≤ 1.5×), chunks stacked on two lines, bug and source tag in the top safe area.
### Elements
- Ledger card (dark ruled "account book" sheet, red double margin) for all data cards; slides in from the right over 0.18 s with yellow speed streaks, then a slow push ×1.025–1.03.
- Rolling counters (ease-out, change colour on arrival); line charts drawn segment by segment; key point = bigger dot + expanding ring (0.7 s) + block label; bars grow from the left one after another (the point first, slower).
- Choropleth map (Natural Earth, Albers), subject outlined in yellow with leader and label.
- Documents: PDF page at 220 dpi as white paper on a dark desk, ±1–2° tilt, soft shadow, vignette; highlighter rects from `pdftotext -bbox` (1 pt = 3.0556 px), multiply, swept left → right in 0.3–0.5 s; the number re-set as a big yellow block beside the page.
- Split screen: 4 px yellow divider drops first; bad half desaturated, darkened, red-tinted; label blocks and counters in each; shared stamp on the divider.
- Three-panel grid: 632 px panels, 12 px gaps, staggered rise, each lights (yellow 8 px border, label turns yellow) on its word; numbered 1–2–3.
- Freeze-frame kit: yellow corner brackets, timecode chip with pause mark top right.
- Circle callout + leader + Latin name; pull-quote mark; stamp on a big number.
- Image treatment: one grade for all footage; captions, numbers and charts always vector.
### Motion
- Chunk slam: caption split into 2–3 chunks with `|`; each chunk 0.12 s after the previous; scale 1.3 → 1 in 0.13 s with back ease (overshoot 1.6), opacity full in 0.04 s.
- Keyword block wipe left → right in 0.12 s.
- English line: fades and rises 10 px in 0.18 s, starting 0.1 s after the first chunk.
- Source tag slides in 0.2 s. Card slide-in 0.18 s with streaks. Grid panels rise 0.1 s apart. Punch-in 0.3 s ease-out to ~1.25× on the culprit.
- Freeze: 0.14 s white flash, punch 1.0 → 1.12, saturation to 45 %, brackets close in.
- Frame-4 hook: kicker line, then the film's biggest number in a yellow block rolling to its value in 0.45 s (demo: number block at 0.13 s, value by 0.6 s), then unit and subject word.
- Easing in code: ease-out cubic `1-(1-t)^3`, ease-in-out cubic, back ease `s` default 1.8 (1.6 for slams).
- Slow pushes keep every shot alive (demo 1.0 → 1.035); no frame flat > 1 s; a strong action within 0.5 s of every shot.
- Scale limits on pushes: modern footage ≤ 1.5× total, photos ≤ 1:1 of source, archive ≤ 2.5× after deblocking.
- Start split/grid/sting animations 0.1–0.15 s before the cut so frame 1 already has picture.
- Rendered at 30 fps (demo 1,785 frames).
### Transitions and rhythm
- Cuts on a 120 BPM half-beat grid (every cut at a multiple of 0.5 s). Footage shots 1.5–3 s; data cards and documents 3–4.5 s; comparison shots hold until every item has been on screen ≥ 2.5 s.
- Captions cross cuts; reading time sets the caption clock, not shot length.
- Fixed transitions: hard cut (default); 1–2-frame white flash on the turn and the freeze; card slide from the right with streaks (0.18 s); split screen opening from its divider; grid panels rising staggered; punch-in; mask transition (a photo grows out of a map shape).
- Fact order: footage (feeling) → number on a card → the document line that says it → consequence.
- Pace: one held breath (2–3 s, a text-only beat) after the turn; two real silences (hard stop of music).
- Title sting: a yellow ruled page wipes across the left 45 % over live footage, title slams, dateline chip follows, page wipes off left and the title becomes the channel bug.
### Finish
- Footage grade: `contrast(1.07) saturate(0.92) brightness(0.98)` + 6 % warm soft-light layer (documents 4 %).
- Footage prep: crop, lanczos, `unsharp=5:5:0.45`; station logos cropped out; private details blurred with `delogo`.
- Light grain in the master (`mux.sh … 30 1`). Document vignette radial to 55 % black.
### 3D look (if any)
None.
### Banned
Not Data Storytelling (charts are short inserts, never a dashboard); not a TV news package (no anchor, no ticker/crawl, no studio); not a keynote (no centred title-and-bullets, no page turns). No dissolves, page turns or 3D flips. No two-line Chinese captions in 16:9. No number without its source tag in the same shot. Never cover a station logo with a caption (crop it). No close-up or slow motion of identifiable private persons. Never generated images as footage. No CC BY-SA, "no known restrictions", YouTube re-uploads, colourised or "restored" footage. Words never stronger than the source. Never copy NowThis/AJ+/Bloomberg Quicktake logos, fonts, colour ratios, idents or shots, or name them.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/caption-news.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/caption-news/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/caption-news/demo/stills/styleframe.jpg (22.3 s, the split screen)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/caption-news.mp4
### Gaps
Captions are designed for Chinese + English; no single-language (English-only) sizes. The 9:16 layout is described but not measured beyond the 1080×1560 band. Shadow colour of the caption is only in code. No guidance on footage colour when sources differ wildly beyond the one grade.

## 1920s Newsreel
- Source: `lemomo-ai/lemo-opuscar` `styles/newsreel/STYLE.md`, `DEMO.md`, `style.json` (No. 64, Edit & Documentary); pencil colours from `styles/newsreel/demo/index.html`; licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo is cut from public-domain archive material (NARA Ford Motor Company Film Collection, 1926 newspaper, 1925 magazine, 1926 book, a 1925 Edison record via UCSB); "THE SPOTLIGHT NEWS" is invented. Sources must be PD/CC0/CC BY only; LOC/DPLA "no known restrictions" and CC BY-SA are rejected.
- One line: A late-1920s sound newsreel cut from real archive: searchlight-and-globe ident with brass fanfare, spinning newspaper, a fast cheerful announcer on an optical-track voice, place·date cards, maps and documents, period wipes and irises, a hot dance band that edits the film and stops dead for the punchline.
- Suits: history stories, fads and eras, anniversaries, "then vs now" pieces; comic or straight reportage (not disasters or deaths). Real footage: **yes**, archive film, print and recordings (nothing "archive" may be generated). Real data/facts: yes (`FACTS.md`). 3D: no. AI images: banned.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| outside the gate | `#000000` (pure black) | everything outside the 1.37:1 gate |
| silver multiply | `#efe7d6` | warm silver tint over the picture layer (multiply) |
| silver screen (lift) | `#17140f` | screen layer lifting the blacks |
| type cream | `#f3eee4` | place-card English, labels |
| type cream 2 | `#d6cfc0` | secondary type |
| type box | `rgba(12,11,10,.8)` (≈ `#0c0b0a`) | dark box behind place cards; 2 px cream rule frame |
| Chinese display | `#ece7dc` | Noto Serif SC titles |
| deco metal gradient | `#fff → #d9d4ca` then hard break `#9e978a → #efebe2` | Limelight ident/card lettering, black outline 0.12 em |
| subtitle strip | ≈ 93–96 % `#0a0908` | 180 px strip across the bottom of the gate |
| grease pencil | `rgba(250,248,240,.92)` | rings and arrows on the picture layer |
| soft lead | `rgba(20,18,16,.85)` | underlines on printed pages |
Rule: monochrome warm silver; values do the work; no colour accents, no sepia wash, no colourised archive.
### Typography
- All OFL / Google Fonts: **Limelight** (ident, item cards, end title; 104–118 px, silver gradient, black outline); **Noto Serif SC 900** (Chinese display, 50–76 px, letter-spacing 10–26 px); **Oswald 600** (English place cards and labels, 26–34 px, letter-spacing 4–6 px, UPPER CASE "PLACE · DATE"); **Noto Sans SC 500–600** (Chinese labels, 24–30 px); subtitles **Noto Sans SC 600 40 px** over **Oswald 400 29 px**, black stroke 8 / 6 px, baselines H−82 / H−38. Sizes at 1920×1080.
- Place-card hold ≥ CJK chars ÷ 4.5 + Latin chars ÷ 15 + 1.5 s from when it is complete.
- Subtitles: Chinese over English, one line per language, never wrapped; cue = max(1.8 s, spoken + 0.6 s), ends 50 ms before the next; ≤ 23 Chinese characters, 6–12 English words per line.
- Emphasis: never re-type printed text as a caption; the voice carries it and an underline or grease-pencil ring points at it.
### Layout
- Gate 1480 × 1080 centred in 1920 × 1080 (1.37:1), corner radius 26 px, pure black outside; nothing ever drawn outside the gate.
- Two layers: picture layer (gets the film look; grease pencil weaves with it) and type layer (sharp, steady).
- Place card top left of the gate (gate x + 48, y 56): dark box with inset 2 px cream frame, English line over one Chinese line.
- Subtitle strip: 180 px across the bottom of the gate, transparent at its top edge.
- Split-screen labels: one per panel, top centre, enter one beat apart. Grids: 5 + 4 grid of stills, four-way grid.
- Print cropped to the relevant fold so unrelated old stories never show.
### Elements
- Code-drawn packaging only: ident (sunburst, two searchlights, wire globe, deco title), item title card (black, double Art Deco frame with quarter-fan corners drawn in 0.35 s, Limelight + Chinese line, slow push, ≥ 2.5 s, max one per film), maps, end card.
- Map: Natural Earth outline, Albers; dotted arcs drawn on the beat with telegraph clicks, star pulses on arrival, screen-space place labels, an odometer of years in a corner.
- Grease-pencil rings (hand-drawn loop, ~1.12 turns) and arrows; soft-lead double underlines placed word-exact from OCR boxes (archive.org hOCR).
- A spinning 78 record inset top right with its label during a needle drop.
- Image treatment: base grade for every source (greyscale → percentile stretch 0.6 % / 99.6 %; print 0.2–0.3 % / 99.0–99.7 % with black lifted to 26–30 → S-curve `x + 0.18·(x−0.5)·(1−|2x−1|)` → output 14–238), one level set per clip, never per frame.
### Motion
- Spinning paper: scale grows by `u^2.3`, rotation decays by `(1−u)^1.25` over 2.5 turns, three ghost copies 18 ms apart as motion blur, a vertical jolt (damped sine, 16 px) and a 3 % bounce on the slam, then push and punch in on the next beat.
- Ident: searchlights snap on with a flash in the first 0.2 s (demo 0.15 s), globe grows and turns, name lands with overshoot, iris closes on the globe.
- Place card pulls out left → right in 0.22 s, fades 0.15 s before it leaves. Subtitle strip fades in 0.25 s before the first cue of a run, held through gaps < 1 s.
- Archive is never reframed with fake moves bigger than ~6 %; stills always get a purposeful move. Camera vocabulary on stills: spin-and-slam, slow push then punch-in on a beat, pan across a wide print, tilt to reveal, map push, grid deal (one still per beat), flip-book (stills on the beat as stop motion), freeze + jolt, split/quad.
- Never a static frame > ~1 s without something moving.
- Archive frames played as 24 fps sequences by `floor((t − t0)·24)`.
### Transitions and rhythm
- The band is the clock: hot-dance tempo 190–220 BPM (demo 200 BPM: beat 0.3 s, bar 1.2 s); every cut/landing/slam/label on a beat, most cuts on bar lines; quick inserts on beat 3 or the Charleston accent (beat 1 and the "and" of 2). Under a period record, cut on the record's measured beat (demo: 0.12 s ahead of the grid).
- Shot lengths: archive 1–2.5 s; print and documents 2.5–4 s; comparisons ≥ 2.5 s fully in frame before the verdict. Stories shorten toward the end (2–3 bars → 1 bar → beats), then one held button.
- Period transitions, each used once as punctuation: iris close/open, diagonal hard wipe with a bright 6 px edge (`rgba(255,250,235,.85)`), vertical-axis flip, venetian blinds (12 slats), clock wipe from 12 o'clock, spinning paper, page turn, panel push-over, freeze.
- L-cuts: announcer may run 0.3–0.5 s over a cut; new music state may start one beat early (J-cut).
- Two silences: a dead stop before a turn; only the projector before the button. Demo 54.6 s, 1,310 frames (24 fps).
### Finish
- Projection look (picture layer only): warm silver (multiply `#efe7d6`, screen `#17140f`), vignette from 0.42 H to 0.95 H, flicker ±3.5 % per frame + 3 Hz drift, gate weave ±1.6 px / ±2.2 px (value noise), 0–3 vertical scratches living 9 frames, 0–4 one-frame dust specks.
- Grain added at mux (`mux.sh … 24 7`), never in the page.
- Archive upscale ≤ ~2.5×: NTSC 720×480 treated as 4:3, cropped to 1.37 and scaled 2.31× to 1480×1080 via `hqdn3d=4:3:6:5` → lanczos → `unsharp=5:5:0.55` → base grade.
### 3D look (if any)
None.
### Banned
Not `silent-film` (no drawn comedy, curtains, intertitle dialogue cards, cinema pianist). Not a documentary with a vintage filter: no talking heads, no slow Ken Burns drifts, no modern lower-third bars. No colour accents, sepia wash or colourised archive. No cross-dissolves between stories, no modern whip pans, no zoom blur. Never draw outside the gate. No per-frame auto-levels. No generated "archive" pictures. No re-typing print as captions. No slowing down or close-ups of ordinary people's faces. No YouTube mirrors, "restored/AI-enhanced" versions. Never copy a real newsreel's name, logo, globe design, typeface or fanfare. Not for disasters and deaths (jaunty grammar is wrong).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/newsreel.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/newsreel/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/newsreel/demo/stills/styleframe.jpg (30.2 s, rendered without subtitles)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/newsreel.mp4
### Gaps
No vertical (9:16) layout for the 1.37 gate. Ident geometry (sunburst ray count, globe size) only in code. Place-card box sizes not given. Variation eras (silent newsreel, 1940s wartime) named but not specified.

## Live Countdown Split-screen
- Source: `lemomo-ai/lemo-opuscar` `styles/countdown/STYLE.md`, `DEMO.md`, `style.json` (No. 65, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo is NASA launch-day material (US federal works, public domain; no NASA insignia as graphics, no implied endorsement); news-agency footage, re-uploads, CC BY-SA and "no known restrictions" items are not usable without explicit agreement.
- One line: Real-time edit of one event with a known zero; screen time equals event time, a clock ticks every second, the frame splits into more and more synced cells as zero nears, and at zero they merge into one picture as the clock inverts.
- Suits: launches, verdicts, final whistles, polls closing, premieres, deadlines, any live event with a countdown. Real footage: **yes** (2–8 synced cameras of the same moment, plus documents and photos). Real data: yes, official sources only (`FACTS.md`). 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ground | `#06080A` | frame background between cells |
| panels | `#0B0E11` | clock, transcript, checklist cells |
| main text | `#F2F5F7` | |
| secondary text | `#7C878D` | tenths digits, pending items |
| accent "now / synced / done" | `#FF5B1F` | T− sign, synced dots, ticks done, event flags, active control segment, thrust bar, new-cell border |
| speaking / heard | `#FF3B30` | speaking light, "heard −32.1" tags |
| plates over full-screen footage | `rgba(6,8,10,.80)` | clock/transcript plates |
| cell border | `rgba(222,232,238,.16)` | 1 px |
| after zero (inverted clock) | ground `#FF5B1F`, text `#0A0B0C` | clock block |
| zero flash | `rgba(255,248,236,.7)` | warm white flash at merge |
Rule: orange = now/synced/done, grey = pending/not synced; nothing else is coloured; colour belongs to the footage.
### Typography
- Clock: Barlow Condensed SemiBold (Google Font), drawn digit by digit in fixed-width slots; up to 132 px; T−/T+ sign at 0.85×; tenths at 0.41× in grey; a ten-segment sub-second bar under it. Sizes at 1920×1080.
- Chinese: Noto Sans SC 500/700 (Google Font), subset. English text: Barlow (Google Font). Labels, codes, English small print: IBM Plex Mono (Google Font).
- End-card title Noto Sans SC 700 112 px.
- The live transcript is the subtitle: a fixed box (bottom right or a grid cell) with a speaking light and speaker type (commentary / loop / narrator; the narrator marked orange); English appears word by word at spoken times (0.08 s fade per word, block cursor), Chinese line whole at cue start. One line per language, never wrapped; cue ≥ max(1.8 s, speech + 0.6 s). Split counts into separate cues to avoid spoilers.
- Reading time for other text: CJK ÷ 4.5 + other ÷ 15 + 1.5 s from complete; comparisons ≥ 2.5 s fully on screen.
- Case: codes in caps (`CAM 4`, `DOC`, `LIST`, `LIVE SYNC`).
### Layout
- Hard-rectangle cells on `#06080A`, 24 px outer margin, 8–9 px gutters, 1 px border; no rounded corners, no shadows, no 3D.
- Demo cell sizes (1920×1080): HUD clock 656×184 and transcript 1,208×184 at the bottom; pre-zero big cell 1,240×840 with a 624-wide right column; 3×3 grid 618×338 per slot (transcript spans two; clock in the centre cell).
- Cell count is the tension curve: 1 → 2 → 3–4 → 6–9 → **1** at zero → a few after → 1 under the title.
- Full-screen moments carry clock and transcript as bottom plates over a 0 → 75 % black gradient.
- Camera chip top-left of every cell (dark plate 84 %, square dot orange/grey, code, Chinese name, small English name); sync badge top-right.
- Document cells show 2–3 rows of paper with an annotation band below (28 % of the cell); paper window fixed 600 source px wide.
### Elements
- Camera chips; sync badges (`● 实时同步 LIVE SYNC`; hatched grey `○ 同一时段 · 未逐帧同步 SAME WINDOW`; `慢动作还原 1× REAL-TIME`).
- Control strip in the clock header (who has control; segment fills orange with a short flash on the hand-over call).
- Planned-vs-heard checklist (milestones tick as the clock passes; red "heard" tag with a small waveform when the audio says it).
- Event flag: orange bar, black type, slides in at the bottom of the relevant cell (`ENGINE START · T−6.36`).
- Second countdown to the next milestone along a schematic profile drawn by time.
- Thrust/comparison bars (demo: SLS orange 820 px vs Saturn V grey 820/1.15, dashed orange "+15%" marker).
- Dashed "standby" frames for empty grid slots.
- Image treatment: light radial vignette (to 36 % black) on video cells; burned-in source text cropped by per-shot usable region or `delogo`'d.
### Motion
- 30 fps.
- Clock tick: each whole second the new digits drop 14 px in 0.12 s ease-out; sub-second bar empties one segment per 0.1 s (fills after zero).
- Re-layout: 0.34 s easeInOutCubic; staying cells interpolate rects; new cells open from their left edge; leaving cells close to the left; a landing cell flashes a 3 px orange border ~0.2 s. Grid fill: one cell per spoken count, 0.30 s pop.
- Swaps wipe in from the left; hard cuts only between full-screen sources.
- Photos push ≤ 6 % over their whole stay; names pop 0.16 s apart. Documents move down a row in 0.45 s; highlight sweeps left → right in 0.35 s.
- Many into one (zero): every cell moves to its tile of the full frame (3×3 → nine 640×360 tiles) while cross-fading to the same shot, chips/borders vanish in the first half, warm flash peaks (decay τ ≈ 0.11 s), clock and transcript slide back to the bottom; 0.42 s total.
- Punch-in on a call: hard digital punch from a higher-resolution extraction (demo 2,880 px), not an enlargement.
- Never: slow push-ins on video to fake motion, speed ramps.
### Transitions and rhythm
- Screen time = event time, one mapping `M = t − T0`; per-camera offsets baked into frame extraction; slow-motion sources re-timed to 1× (`setpts=PTS/k`).
- Cuts are layout changes landing on the first word of a real call in the native audio or a visible event; music never sets a cut. Inside a cell, the source's own camera switching stays.
- Every 1–2 s a new element (cell, tick, flag, punch-in) so a static wide never runs ~10 s.
- Score at 60 BPM (one beat = one second = one tick); music drops out 0.25 s before zero.
- Demo 59.5 s (T−32.5 to T+27.0), 1,785 frames.
### Finish
- One grade for every source: `eq=contrast=1.07:saturation=0.9:gamma=0.97:brightness=-0.01,colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02` (cool shadows, slightly warm highlights).
- Film grain 1 at the master (`mux.sh … 1`).
- Resolution: modern footage ≤ 1.5× source pixels; documents ≥ 1 source px per screen px.
### 3D look (if any)
None.
### Banned
Not a montage (no time jumps), not a security wall (layout must move), not a flashback structure, not a slide deck (no text-filled cells, centred titles or page turns). Never cut, re-order or speed up the event; never fake sync (label unsynced cells). No rounded corners, drop shadows or 3D cells. No slow push-ins on video, page-turn transitions, centred pop-up words, speed ramps. Burned-in source text never shown as ours. No agency insignia as graphics. No piano-and-strings pad. Narrator never over the native sound. Never copy *24* or *Apollo 11* type, colours, sounds, graphics or shots, or name them.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/countdown.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/countdown/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/countdown/demo/stills/styleframe.jpg (t 28.5, the 3×3 grid)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/countdown.mp4
### Gaps
No 9:16 layout (cell grids are all 16:9; a vertical version would need its own cell plan). Chip and badge font sizes not given. Transcript box type sizes not given.

## Time-lapse Symphony
- Source: `lemomo-ai/lemo-opuscar` `styles/city-symphony/STYLE.md`, `DEMO.md`, `style.json` (No. 66, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo uses CC BY 2.0/3.0 footage from Wikimedia Commons and Flickr (each needs a passed licence review; credits with author, full title, licence and changes on the end card), plus public-domain DVIDS, Library of Congress (1899 Edison film, Highsmith photos), NASA ISS and Internet Archive material. Unlike most Lemo styles, compositing and grading run in Python (`demo/tools/render.py`), not a canvas page.
- One line: A city film cut like minimalist music; time-lapse turns traffic, crowds and clouds into rivers of light, cuts get denser with the score's subdivisions, one fragile thing slows almost to a stop, and it ends on a hard cut to black on a downbeat. No narrator.
- Suits: city/place films, music montages, openers, a port/airport/campus/factory/river-over-a-year portrait. Real footage: **yes**, footage only (time-lapse, hyperlapse, aerials, slow motion, pre-1931 archive, photographs, a scanned page). Real data: 2–4 official numbers. 3D: no. AI images: banned.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| type (warm white) | `#EDE8DF` | titles, numbers, quote |
| secondary | `#B0AAA0` | English lines, labels |
| sodium orange (only accent) | `#D9772F` | 2 px rules under numbers, source lines, crowd tracks, day-ring hand |
| matte and black | `#000000` | 1.85:1 bars, gutters, hard stop |
| bloom tint | multiplier (1, .82, .62) | warm bloom added back |
| page paper tint | multiplier (1, .93, .80) | scanned page |
Rule: colour comes from the footage and one LUT; sodium orange is the only graphic accent; night shots keep their sodium and blue.
### Typography
- Latin: **Michroma** (Google Font), CAPITALS, tracking 0.06–0.32 em. Chinese: **Noto Sans SC** variable (Google Font), weight 300–350, tracking 0.08–0.14 em.
- Sizes at 1920×1080: number 84 px Michroma (44 px when three numbers stack), Chinese line 28 px, English line 14–16 px; archive year 22 px Michroma bottom-left of the archive panel; closing quote Chinese 60 px, English original in capitals 20 px, source line 14 px sodium; credits 16 px fine print on a 29 px line pitch (Noto Sans SC 17 px also named).
- Left-aligned, left margin 168–196 px, never centred, never on a box; legibility from a soft elliptical darkening (α ≤ 0.6).
- Emphasis: a 2 px sodium rule grows under each number. "About" numbers carry `≈` / "约".
- Words on screen: a title, 2–4 official numbers, an archive year, one public-domain quote at the end. One line per language, never wrapped; hold ≥ CJK ÷ 4.5 + other ÷ 15 + 1.5 s. Text may stay across cuts only while the shots under it belong to what it counts. The `.srt` carries on-screen text (no voice).
### Layout
- 1920×1080 with a 1.85:1 matte (21 px black bars top and bottom).
- Text block left at x 168–196 px over the dark half of the frame.
- Day ring: a thin 24-hour ring bottom-right with a sodium hand and a 3-hour arc.
- Grid split: 1×2 → 2×2 → 3×3 → 4×4, 6 px black gutters. Counterpoint split: archive 4:3 centre 960 px | today centre 960 px, 6 px gutter grown from the centre.
- Density: very sparse text; picture carries the film.
### Elements
- Number cards (number, growing sodium rule, one Chinese + one English line with source year); number lock (census number locks digit by digit on sixteenths, others roll) and count-up (flow number from 0 in 0.6 s ease-out).
- Day ring (graphic, not a clock reading): runs with the film's day, freezes and dims in the brake, spins backwards in the reverse flashback.
- Crowd tracks: people as 2 px sodium lines (median background, blobs > 22/255 difference, area 8–900 px at half size, link < 70 px, lines fade ×0.9 per frame, plate darkened/desaturated over 0.15 → 0.55 s). Fixed cameras only.
- Reading light on a scanned page: 16:9 window pushed 1.06 → 1.56 page widths, side light from top-left, Gaussian band (σ 95–140 px) over the quoted line growing to +38 %.
- No lower thirds, no headers, no logo stings, no boxes.
### Motion
- Speed is the main instrument: 0.3× to 75×; every speed above 1× uses frame blending (360° shutter, each output frame averages the source frames it covers, capped at N). Demo values: night 40× / blend 30; clouds 37.5× / blend 24; one-second nightfall 75× / blend 30; traffic → light top-down aerial at 5× with full blending; next-dawn 8× / blend 8. About 40 % shutter (24 of 60 frames) beats 100 % for noon clouds.
- Speed ramps: smoothstep between keyed speeds, always meaningful: corridor 1× → 6×; time-lapse frenzy 1× → 7×; brake 2.2× → 0.3× in 0.55 s on the bar where the music stops (ffmpeg `minterpolate` mci bidir for soft subjects; crossfade of nearest frames for thin lines).
- Post camera moves, sparingly: slow push 1.00 → 1.05–1.10 over a shot; falling push on the opening still 1.0 → 1.3 in 0.35 s ease-out, then accelerating to ×2 by the cut. No shakes, whip pans or zooms past the upscale limit.
- Machines fast, people slow: the one slowed moment is a fragile thing (soap bubble, steam, flag, flock); people are crowds, tracks or long-exposure ghosts.
- Grid cells light up in scattered order within 0.3 s over the previous stage (never back to black); in the last beat cells re-cut every sixteenth.
### Transitions and rhythm
- Cut-point table at 120 BPM / 30 fps (1 beat = 15 frames, triplet = 5, sixteenth = 3.75): opening hit + eighth arpeggio → cuts of 2 bars → 1 bar (120 → 60 frames); eighths → 2 beats → 1 beat (30 → 15); triplets vs eighths (3:2) → 1 beat → ½ beat (15 → 7/8 alternating); full sixteenths → grid cells every 1–2 frames, re-cut each sixteenth (1–4); arpeggios stop on one chord → 3–4 s, one or two shots (90–120); sixteenths + triplets + horns → ½ beat → 4 frames → 2 frames; dry ensemble cut → hard cut to black on the bar line.
- All cut times from one function `bar(n, beat)`; never typed in seconds; music rendered from the same file. Tempo 96–132 BPM; prefer tempos whose beat is a whole number of frames at 30 fps (120: 15, 100: 18, 112.5: 16).
- One long single-camera time-lapse (≥ 12 h) is the clock and returns 3–4 times from the same position.
- Shape match cuts on the beat (clock → clock, arch → arch, street grid → cell grid); small-to-large punch-in on the same shape allowed.
- Day/night flicker: noon and night frames of the same camera alternating every 2 frames; same-position photo pair alternating every 2 frames.
- Reverse flashback in the last bar: earlier shots in reverse order, 4 frames each, then 2 frames each.
- Hard cuts only; fades only from black for the page and end card. Coda after the hard stop: page (≈ 1 s) → quote over one last moving shot (≈ 4 s) → end card over the same shot darkened to 22 % (4–5 s).
- Score arc: minimal repetition → acceleration → climax → sudden stop (held maj7/9th chord) → acceleration → hard stop (every instrument cut dry in 15 ms, reverb left ringing) → unresolved coda. Demo 52 s.
### Finish
- One 35 mm release-print look: 1.85:1 matte, warm highlights, lifted blacks, bloom, clumped mid-tone grain, ±0.5 px gate weave, soft vignette.
- Grade: per-shot partial grey-world white balance (only pixels with luminance 0.12–0.88, strength 0–0.6, **0 for night**), then one LUT for all: S-curve (sigmoid slope 6.2, pivot 0.47, blended 55/45 with linear) → black 7/255, white 250/255 → R ×1.025, B ×0.965 → saturation 0.86.
- Bloom: pixels above 170/255, blurred 6 px at ⅛ size, added back × (1, .82, .62); strength 0.09 by day, 0.15–0.2 at night.
- Grain (in picture): half-resolution Gaussian noise, up-sampled, blurred 0.6 px, weighted `0.35 + 1.3·L·(1−L)`, strength 9/255; mux grain 0.
- Archive stays black-and-white through the same LUT. Upscale limits: archive ≤ 2.5× (denoise → lanczos → light sharpen → grain); modern ≤ 1.5×.
### 3D look (if any)
None.
### Banned
Not a travel reel (no drone montage on a pop track), vlog, news package, narrated explainer or postcard slideshow. No narrator, no source sound, no sound effects (music only; at most one short line at the very start or end). No lower thirds with names, headers, centred title cards, page-turn transitions, logo stings. No dissolves. No text boxes. No shakes, whip pans or digital zoom past limits. No generated images; no restored, colourised or speed-corrected archive; no YouTube mirrors. No identifiable ordinary person as the slowed/close-up hero. No CC BY-SA or "no known restrictions" without a basis. Never take footage, melody, title lettering or names from the Qatsi films or city symphonies. Don't end on dead black.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/city-symphony.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/city-symphony/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/city-symphony/demo/stills/styleframe.jpg (11.2 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/city-symphony.mp4
### Gaps
No 9:16 layout or matte guidance (1.85:1 inside 16:9 only). Day-ring size and stroke not given. Vignette and gate-weave values only partly given (weave ±0.5 px; vignette strength not given).

## Visual Investigation (Evidence Desk)
- Source: `lemomo-ai/lemo-opuscar` `styles/visual-investigation/STYLE.md`, `DEMO.md`, `style.json` (No. 67, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo is built from real archive material (Universal Newsreels via NARA, U.S. Navy/NHHC photos, the FBI file, the Commerce accident report, USGS maps), all public domain; the style only allows PD, CC0 or CC BY material (no CC BY-SA, no "no known restrictions", no colourised/restored copies; Hearst, Pathé, Movietone, Paramount newsreels are not PD).
- One line: a cold, dark investigation desk where footage, photos, documents, sound and maps of one real event are laid on one shared clock until they point at the same second and spot.
- Suits: reconstructions, fact-checks, incident reports, disputed sports calls, launch failures, collisions. Real footage: **yes** (at least three kinds of source: moving image, documents, photographs; plus sound, data, maps). 3D: no. AI images: **forbidden** (never generate a stand-in for a historical image).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ground | `#0B0C0E` | frame background |
| panels | `#141619` | evidence panels |
| hairlines, frames | `#2E3238` | 1 px panel frames |
| text | `#ECEAE4` | headings, findings |
| secondary text | `#8B9097` | tags, translations |
| ticks, *uncertain* | `#4A4F57` | axis ticks, dashed/uncertain marks |
| the one accent (here / now / match) | `#FF4A2E` | circles, chart playhead, sync lines, highlights, ✓ badges, convergence zone, *unresolved* column, strike-throughs |
| paper card | `#E4E0D4` | typeset telegram/radiogram cards |
| paper-card ink | `#1D1D1B` | text on paper cards |
Rule: all sources greyscale; red is the only colour and it only ever points.
### Typography
- Headings and findings (Chinese): Noto Sans SC 700, 30–124 px (Google Font). Tags, timecodes, ticks: IBM Plex Mono 400/600 (Google Font). Quotes: Source Serif 4 Italic for original wording (Google Font); Noto Serif SC 500 for a translation underneath in secondary colour (Google Font). All OFL, subset to the words on screen. Latin-only films would swap the CJK faces (not stated).
- Sizes at 1920×1080: lower third place name 36 px bold + one mono line (place code); subtitles Chinese 34 px bold over English 23 px, centred, 10 px black shadow, Chinese baseline y ≈ 984, English y ≈ 1022, one line per language measured against 1,500 px; source-tag chip 6×12 px + `type · source` in mono, ≤ ~12 characters, just above its frame.
- Letter spacing: not given. Case: sentence case; tags like `T+xx.x`, `18:25:00 EST`.
- Emphasis: the decisive line in a scanned document is highlighted red (`multiply`, α ≈ 0.6, wiped left to right); wrong claims struck through in red; big readouts ("4 分钟", "32 秒").
- Words on screen: few per frame; only the main readout or heading, the highlighted original, one short tag per source. No eyebrow labels, no English twin under every label, no archive numbers or footnotes unless the beat is about them, nothing the subtitle says at the same time.
- Reading time: key text still and whole for CJK chars ÷ 4.5 + other chars ÷ 15 + 1.5 s; verdict/comparison frames ≥ 2.5 s; counters exempt.
### Layout
- 1920×1080, 60 px margins; content y 60–900; subtitles y ≈ 950–1030; nothing else lives in the subtitle area. Sections without subtitles are centred vertically.
- No reserved timeline strip at the bottom (a permanent timeline band is "optional and usually wrong").
- Panels: hard-edged rectangles with 1 px frames; footage keeps its source aspect.
- One finding per layout; at most five sources on a board. Avoid centred layouts, page headers, slide-like page turns.
- Named layouts: map → plan (left) + reference photo + footage panel (right); one big statement + one quote + one wide schematic; five-source board (three evidence frames on top, sound and report below, schematic right, red links converging); three-column sync grid (report / photo / video under one stopwatch); document strip + two-column verdict; claim card + fact-check card + dot matrix; evidence map (plan, broken-axis mini timeline, schematic, thumbnails with links).
### Elements
- Red circles 2.5 px drawn clockwise, leader + bold label appearing at 60 %; ×2 loupe beside it cropped from the same source pixels (never beyond 1 source px per screen px).
- Source tags (chip + mono text); lower third = red bar + place name + mono code line.
- `T+` stopwatch; data chart with time axis, one-word event bands (storm, outage), message pins, red playhead carrying the clock; broken-axis mini timeline.
- Plan drawings: bearing, distance ring, camera point, inferred view cone, scale bar, locator map inset; 16-cell side schematic with zone/flutter; dot matrix (one dot per person, the dead turn to red open rings).
- ✓ badges (drawn tick in a red box, no words); dashed boxes and `≈`, *inferred*, *schematic* marks for uncertainty; known / unresolved columns (ticked vs dashed boxes).
- Waveform of original sound with a red play-line and word-by-word lighting.
- Image treatment (canvas `ctx.filter`): footage/photos `grayscale(1) contrast(1.22) brightness(0.94)`; paper `grayscale(1) contrast(1.05) brightness(0.86)`; maps greyscale, inverted, `brightness(.62)` (dark line drawings). Documents shown as scanned strips/pages, never redrawn; transcription-only text is re-typeset and labelled as transcription. Remove channel bugs, watermarks and source title cards.
- Archive pipeline (pre-1950 film, upscale ≤ ~2.5×): `bwdif=0` deinterlace → crop borders → `hqdn3d=2:2:3:3` → lanczos upscale → `unsharp 5:5:0.5` → greyscale. Modern footage ≤ 1.5×.
### Motion
- 30 fps. Elements cut in (≤ 0.1 s opacity) with a 3–4-frame white flash ("pulled from the evidence locker"); nothing flies, bounces or scale-pops.
- Only drawn things are progressive: circles clockwise in 0.5 s (ease-out cubic); leaders and links 0.4–0.8 s; plans stroke by stroke; highlights wiped; typewriter text for telegrams.
- Slow push inside a frame only: ≤ 1.9× on a map, ≤ 1.06× on a photo. The "camera" itself never moves; layouts change on cuts.
- Event clock eases between keyframes; constant speed in a timed run (each tick = one real second).
- ✓ badges land 0.12 s apart.
- Time scale changes (minutes → seconds → days) happen on section cuts by the readout changing form (clock → `T+` stopwatch → date).
- Something changes at least every second; holds only for verdicts.
### Transitions and rhythm
- Hard cuts on a 0.5 s grid (except where following the voice), white flashes, and a rewind (footage backwards with scan lines). No dissolves.
- Demo 60 s, 12 shots of 2.4–8 s; cold open 2.4 s.
- Sound rhythm: pendulum tick every 0.5 s in minute-scale sections; one tick per event second in a timed run (accent every 5); demo 32 ticks in 4.3 s. Demo score in D minor.
### Finish
- One grain for everything: six 256² Gaussian tiles rotated per frame, `overlay`, α 0.22 on footage/photos, 0.10 on paper; never on type or lines; mux grain 0.
- Greyscale grade as above; no glow, no colour except the red accent.
### 3D look (if any)
None (Canvas 2D).
### Banned
Not Satellite Briefing (no orbital zoom), not Archive Light Table (no paper on glass, loupes-as-props or hands), not Halftone Dossier (no print texture, stamps, collage), not a newsreel package (no channel bug, ticker, anchor voice), not a keynote (no centred title slides, page turns). No permanent timeline band; no empty "no footage" placeholder boxes; no slow motion of the catastrophe, no full-screen flames, no sound effects on deaths, no music that tells you to feel; never colourised/restored copies; never AI images for historical ones; no inference passed off as fact; early reports never the source of a number; no borrowing clips of unclear origin; no dissolves; never copy or name real investigation units/branding.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/visual-investigation.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/visual-investigation/poster.jpg (poster frame at 55.3 s, the evidence map)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/visual-investigation/demo/stills/styleframe.jpg (30.9 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/visual-investigation.mp4
### Gaps
No vertical layout; no letter spacing; Latin-only type pairing not specified (Chinese-first film); stopwatch/readout sizes not given; exact flash colour/opacity curve beyond "3–4 frames white" not given.

## Constructivist Montage (Red-Ink Archive Montage)
- Source: `lemomo-ai/lemo-opuscar` `styles/kino-montage/STYLE.md`, `DEMO.md`, `style.json` (No. 68, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo is cut from real archives (a 1930–31 American Bridge/U.S. Steel construction film, Lewis Hine photos from NARA and the Met (CC0), a 1931 brochure from Columbia University Libraries); one rivet-gun recording is CC BY 4.0 (credit needed). Only PD / CC0 / CC BY material; CC BY-SA, "no known restrictions" and "copyright status undetermined" are not used. Cut-outs use the u2net_human_seg model (onnxruntime).
- One line: real archive film, photos and documents printed as one red/black/paper constructivist poster, cut on a 120 BPM machine beat, with type as beams on a steep diagonal and people stacked into the thing they built.
- Suits: construction and engineering histories, industrial anniversaries, milestones, collective effort, infrastructure openings, mass events. Real footage: **yes** (archive film, photographs, scanned documents are the whole film). 3D: no. AI images: no (all evidence; nothing illustrated).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| red | `#D52B1E` | bands, wedges, blocks, the key number, marker bars, circles and leaders, the one winner in a comparison |
| ink | `#141210` | type, beams under each floor, window borders, dark grounds |
| paper | `#EDE4D0` | ground, reversed type, cut-out borders |
Rules: all photographic material mapped ink → paper; red is the only colour, laid on top as a printed element; red never on red (a red block on a red ground becomes ink). Alternate grounds to land cuts (paper → ink → paper); in an acceleration the ground alternates red / ink per cut. Red's exact hue may vary per film.
### Typography
| use | face (Google Font?) | size at 1920×1080 |
|---|---|---|
| Chinese display, slogans | Noto Sans SC 900, subset (yes) | 110–210 px; stacked vertically 170 px per character |
| numbers, English display | Oswald 600–700 (yes) | numbers 230–440 px; English lines 30–62 px, letter-spacing 2–10 px, capitals |
| source/footage tags | Space Mono Bold (yes), CJK falls back to Noto | 17–18 px on an ink or red tab, padding 6 |
| subtitles | Noto Sans SC 700 40 px over Oswald 500 28 px (yes) | bottom-left on an ink bar at 90 %, with a 10 px red tick |
- Placement: along the −18° axis on a band, or as an ink/red block; never centred, never a header. Numbers may be bigger than the words that explain them.
- Bilingual: Chinese block, then one English Oswald line directly under it (or on a neighbouring band); one measured line per language.
- Tags: every archive window carries `FILM · <TITLE> · <PLACE> <YEAR>` / `PHOTO · <AUTHOR> <YEAR>`; every fact a source tag `来源 · <PUBLISHER> <YEAR>`; stand-in footage is tagged as what it really is.
- Subtitles in a bottom-left 960–1056 px strip; key type stays above y 930 while narration runs; hold ≥ max(1.8 s, speech + 0.6 s); on-screen text CJK ÷ 4.5 + other ÷ 15 + 1.5 s; comparison items ≥ 2.5 s before the verdict.
- Every counter carries its unit (小时 / 层 / 人 MEN).
### Layout
- Asymmetric and diagonal: one axis at −18° (range −15° to −30°); wipe band perpendicular at 72°.
- Four element kinds only: bands, windows (rectangles or parallelograms holding film/photos), cut-outs (people with a paper-white border), type blocks; plus one paper-fibre texture.
- Lower third: 92 px red bar from the left edge at y ≈ 760–850 (Chinese) + ink tab (English).
- Split strips: frame rotated to the axis, three strips of two panels, panels ≤ 1,160 px wide; red seam on the middle strip.
- Grid format: 3 × 3 windows. Multiple-exposure window ≤ 1,700 px on red.
- Type on bands placed from the band's centre line (point + normal offset), rotated with the axis. Verdict blocks go where no compared item is.
- Never two paper documents in a row; one marked sentence per document shot.
### Elements
- Red highlighter bar in `multiply` over the exact sentence on a full-resolution scan (never retyped); hand-drawn red ellipse round a heading; red circle on a map; red triangles/arrows between process windows; red dimension lines.
- Drawings lifted off documents, keyed from paper with `alpha = (205 − luminance) / 90`, stood on one ground line to scale (winner tinted red via `source-in`).
- Cut-outs: segmentation → threshold 0.5 → median filter → largest component → 7 px paper border dilated outside the mask (hides edge errors). Group photos stay whole in windows.
- Counters (graphic; only end values and dated anchors are facts), four-digit counters per cut, a huge red "?", a red rivet dot.
- Film-within-frame: a red-framed live inset during freezes.
- Image treatment, "print grade": luminance → percentile stretch (one pair per clip so it never pumps: film 0.7 / 99.5, photos 0.8 / 99.4) → S-curve `x + s·(x−0.5)·(1−|2x−1|)·2` with s = 0.32 (documents 0.18) → `rgb = INK + (PAPER − INK)·g`. Archive film keeps ±2.5 % per-frame flicker inside its window (`hash(frame)`); photos and documents don't.
- Resolution ceiling: archive film ≤ 2.5× source pixels, modern footage ≤ 1.5×, photos ≥ 1 source px per screen px; prep `hqdn3d → lanczos → light unsharp`. A 720-line transfer fills a 1,700 px window, not full 1080p.
### Motion
- Grid: 120 BPM (beat 0.5 s, bar 2 s); every cut, slam, wipe, count on a beat, half-beat or sixteenth; times exported as `window.EV` and read by the mix. Tempo range 100–140 BPM.
- Slam: element arrives from outside along the axis in 0.08–0.2 s, ease-out, hard stop, frame shake amplitude 3–18 px decaying `exp(−14·Δt)`.
- Lower third slams in 0.14 s, slides off with the next transition.
- Digits stamp one per eighth; vertical CJK titles slam per character 1/16 apart.
- Grid of windows lights one per sixteenth in a spiral, cells `back()`-scale in, each a different clip at 1.4–1.8× speed, ping-pong; centre counts 1…9 and lights last in red.
- Process staircase: windows 0.75 s apart along a diagonal, counter climbing.
- Photomontage tower: floors slam in from alternate sides every sixteenth, an ink beam under each, a cut-out worker on every other; camera y follows the eased count of floors; counter rests on the dated anchor while its caption is up.
- Freeze + annotation: flash, freeze, push, red ellipse, leader to number block; jump-in to a 1.2× crop (annotation scales with it).
- Acceleration windows tilted ±4–6°.
- Nothing static for more than 1 s (except the comparison hold, one silence beat, the end card).
### Transitions and rhythm
- Shot length 0.5–2 s for footage, one idea per shot; accelerate by halving 0.5 → 0.25 → 0.125 s (never shorter than 3 frames). Holds only for reading.
- Cut rule: adjacent shots conflict in direction (left/right slam), value (paper/ink ground) or geometry (diagonal band / upright window).
- In-medium transitions: red wipe (260 px band at 72° sweeps in 0.25 s, lands on the downbeat); iris (a red marker circle becomes an aperture, `arc` clip growing to the frame); slam; flash cut (one frame of 50–80 % paper over a window); hard cut between opposite-value grounds; jump-in (1.2× crop). No fades.
- Two silences: the orchestra stops and only an original recording carries the cut; one true half-bar of nothing (ink frame + one red dot) before the heaviest hit.
- Demo: 60 s, 17 shots, 1,440 frames at 24 fps; title held 4 s; end card 4 s.
### Finish
- Paper fibre: fixed seeded noise canvas multiplied over the frame at α 0.5; film grain 4 added in `mux.sh`. Per-window archive flicker ±2.5 %. No glow, no blur.
### 3D look (if any)
None (Canvas 2D).
### Banned
Not Data Storytelling or a keynote (no centred headline with bullets, slide transitions, header bars); not Swiss (no grid of white space, no thin decorative rules); not Art Deco / Spy Titles (no gold, fine lines, jazz); not a museum slideshow (archive never shown "as is" in a neutral frame). No floating captions; no single face as protagonist, no slow motion or close-up hero; never copy Soviet montage shots, layouts, slogans or lettering or name them; no fades; red never on red; never upscale archive film beyond 2.5× or full-frame a 720-line source; no per-frame grading; no counters without units or disagreeing with their caption; no three highlights on one page; no text in 1/8-beat cuts; no piano-and-strings bed; no YouTube mirrors or colourised/restored versions.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/kino-montage.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/kino-montage/poster.jpg (51.0 s)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/kino-montage/demo/stills/styleframe.jpg (2.5 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/kino-montage.mp4
### Gaps
No vertical layout (the −18° axis and band sizes are for 16:9); letter spacing given only for English Oswald lines; exact shake per slam type not tabled (only the 3–18 px range); Latin-only type pairing not specified.

## Sports Telestrator (Pundit's Freeze-and-Draw)
- Source: `lemomo-ai/lemo-opuscar` `styles/telestrator/STYLE.md`, `DEMO.md`, `style.json` (No. 69, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the demo uses real broadcast footage released CC BY by the broadcaster (beIN SPORTS Türkiye, verified YouTube channel; one clip via Wikimedia Commons), plus a CC BY photo, a CC0 photo and a CC BY drum kit; DEMO.md warns the rights chain from league/clubs is not visible and re-uploads may still hit Content ID. Use your own footage or footage whose licence you checked the same way.
- One line: the TV football analysis segment; play at full speed, rewind, freeze with a flash and punch, draw fluorescent rings and marker arrows on the real broadcast picture, then flatten the pitch into a top-down board.
- Suits: sports analysis, match recaps, coaching (football, basketball pick-and-roll, tennis landing zones, F1 racing lines; anything with a wide camera). Real footage: **yes** (match footage is the ground; 16:9). 3D: no (a 2D homography flatten). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| our team / player, the ball, main marker lines | `#FFD400` fluorescent yellow | rings, arrows, comet, board numbers, wipe band, split divider, subtitle edge |
| opponents | `#3FD8FF` cyan | rings, block arrows, link lines; REPLAY mode |
| space nobody covers | `#FF3B30` red | patch fill at 0.34–0.38 + dashed edge; LIVE dot |
| chalk | `#F4F1E8` | traced pitch lines, neutral marks, stamps |
| show board | `#0C1411` ink green-black | shot map, data card (faint 60 px grid) |
| label / bug background | `rgba(8,12,14,0.9)`; opaque `#080C0E` over logos | label cards, corner bug, score bar |
Rule: one colour = one identity for the whole film; a label's left bar takes the colour of what it names. Hues may change per show; the three roles never.
### Typography
- Labels: Noto Sans SC 900, 40 px (30 px for a name), with an English line in Barlow Condensed 600, 21 px, letter-spacing 2 px, in the role colour (both Google Fonts). Sizes at 1920×1080.
- Packaging numbers (score, minute, stopwatch, big data): Barlow Condensed 800 Italic (Google Font).
- Clock / frame numbers: IBM Plex Mono 500, 24 px (Google Font).
- Board pages: title Noto Sans SC 900 60–64 px; rows Noto Sans SC 700 34–42 px with a grey note under each; numbers Barlow Condensed 800 Italic 64–150 px in yellow; text clip-revealed left to right.
- Subtitles: Chinese Noto Sans SC 500 38 px above English Barlow Condensed 600 32 px, on a black bar at 0.64 opacity with a 4 px yellow edge; one line per language, never wrapped (shorten instead of shrinking).
- Case: English label lines spaced capitals (e.g. `A MAIN CAMERA`, `REWIND`); otherwise not given.
- No handwriting fonts anywhere.
- Reading: freeze labels echo the subtitle and live ~1 s; anything that must be read (scores, board rows, data card) ≥ 2.5 s and goes into `TEXTS`.
### Layout
- 1920×1080, full-frame footage most of the time; packaging in corners:
  - Corner bug top right x 1452–1880, y 38–110: show name on a yellow block + mode line LIVE (red dot) / ANALYSIS (yellow) / REPLAY (cyan). Present from frame 1 (it sits over the broadcaster's logo).
  - Score bar bottom right x 1392–1880, y 926–996: HOME n – n AWAY + minute (sits over the broadcaster's URL).
  - Source clock top left x 40–370, y 38–90 on analysis shots: `❚❚ 04.20s F106` (▶ ½ in slow motion, ◀◀ in rewind); hidden in live play.
  - Subtitle bar bottom, centred at x 880, y 938–1044 (right edge left of the score bar).
- Labels (black card, coloured left bar, Chinese line + small spaced English line) in empty grass or crowd, never over the action.
- Split screen: two 960×1080 windows, each a 960 px slice of the 1920 frame at 1:1, 6 px yellow divider, camera label top left of each; slices chosen so logos/URLs fall outside.
- Board pages: left column text, right side drawing; no headers, no centred title-and-bullets.
### Elements
- Marker line: dark outline (width + 6, black 0.55) + coloured core with glow 18 + thin white highlight (width × 0.28); drawn along its length; arrowhead pops over the last 10 %; small deterministic wobble at vertices. Dashed = intended/future path, solid = what happened.
- Ring: perspective ellipse (ry = 0.36 r) under the feet, drawn clockwise, outer dashed ring rotating at 60 px/s; vertical light beam while the player moves.
- Red space patch, cyan link lines between defenders, traced box line, block arrow, ball comet trail.
- Frame-counting stopwatch (source frames ÷ fps; stops and turns yellow on the strike).
- VAR-style stamp card (once per film), polaroid photo on the data card, red marker circle on the key number, commentary transcript box (original words with timecodes + translation; inaudible = ellipsis).
- Image treatment: `hqdn3d=1.2:1.2:2.5:2.5` → lanczos to 1920×1080 (modern footage ≤ 1.5×) → `unsharp=5:5:0.55` → `eq=saturation=0.9:contrast=1.04:gamma=0.97` + slightly cool shadows; one grade for all clips. Logos/URLs covered by the packaging, never by cropping past 1.5×.
### Motion
- Freeze entry: white flash 0.1 s (0.55 opacity) + punch scale 1.035 → 1.0 in 0.35 s ease-out + desaturate 42 % + cool cast + heavier vignette; then a slow 1.2 % creep. Overlays share the picture's transform.
- Spotlight: outside a focus ellipse darkens to 0.42 (even-odd hole), 0.3 s fade.
- Draw order inside a freeze: ring (who) → area or link (what) → label (finding), 0.3–0.6 s apart.
- Slow motion 0.6–0.85×, neighbouring source frames cross-blended.
- Rewind: clip reversed in 0.6 s (ease-in-out), ±13 px horizontal jitter, four white tracking bars, big ◀◀ and the word REWIND.
- Trails in screen space: last ~0.6 s only (ball 0.24 s).
- Stamp: framed card drops 1.7× → 1× with overshoot, slightly rotated, small flash. Sting title stamped 1.6 → 1 with overshoot.
- Score-bar flip: 0.5 s roll with a yellow flash on the frame the ball crosses the line.
- Tracked rings: hand keyframes of the feet point every ~3–6 source frames, linear interpolation.
- Perspective flatten: 6–8 known pitch points per shot → least-squares ground-plane homography (residual ≤ 6 px); strike frame drawn as a triangle mesh in pitch coordinates (1.5 m cells), each vertex moving from image to board position, triangles affine-mapped; picture fades as the chalk board takes over (demo flatten 0.9 s).
- Camera: none beyond the footage's own camera, the freeze punch/creep and split-screen opening from the centre.
### Transitions and rhythm
- Order inside one piece of action: live 1× → rewind 0.6 s → freeze ① → slow play 0.6–0.85× → freeze ② → slow play with stopwatch → freeze ③ → ball flight with comet → another angle (replay).
- Lighter variants: freeze-in-play (no rewind); dual-angle freeze (both windows reach the same instant on the same beat).
- Freeze length 1.8–2.4 s (longer than ~2.5 s needs a second action); 2–4 freezes per piece of action.
- Between segments only the packaging wipe: a yellow slanted band with dark edges crossing the frame in 0.34 s. Inside a segment hard cuts. No dissolves, no page turns.
- Comparison frames drawn early and held ≥ 2.5 s.
- Score ~120 BPM (demo E minor); the groove restarts at the head of each played segment; on every freeze the drums stop (brass stab + timpani + thump + shutter, then closed hi-hat only).
- Demo 54.4 s, 21 shots, 1,632 frames at 30 fps; strong action by 0.5 s.
### Finish
- Film grain 2 added once at the master (`mux.sh`). Freeze: desaturate 42 %, cool cast, heavier vignette (vignette value not given). Marker glow 18.
### 3D look (if any)
None (2D; the flatten is a homography mesh warp).
### Banned
Not Visual Investigation (no restrained multi-camera evidence timeline), not a highlight reel (no goal montage to music), not Data Storytelling (charts are not the film; the board appears once). Never explain before showing the action; no more than one finding per freeze; no handwriting fonts; never copy or name a broadcaster's logo, fonts, colours, idents or graphics; no numbers the footage can't support (ball speed, distance run); packaging never fades in over footage (logo would show); no dissolves or page turns; never freeze or slow an identifiable spectator; no AI-upscaled streams, re-uploads, fan mirrors; no CC BY-SA or unclear licences.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/telestrator.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/telestrator/poster.jpg (same image as the styleframe)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/telestrator/demo/stills/styleframe.jpg (13.6 s, dual-angle freeze)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/telestrator.mp4
### Gaps
16:9 only (split-screen and packaging coordinates assume 1920×1080); vignette strength not given; wipe band width/angle not given; easing for draws beyond "drawn along its length" not given; Latin-only type pairing not specified.

## Broadcast News Package (Bulletin Graphics System)
- Source: `lemomo-ai/lemo-opuscar` `styles/news-package/STYLE.md`, `DEMO.md`, `style.json` (No. 70, Edit & Documentary); licence: MIT (docs), demo film/stills CC BY 4.0, **except the demo narration**: Doubao TTS 2.0 (voice `zh_male_jieshuoxiaoming_uranus_bigtts`, under Volcengine's terms) is excluded from the licence and must not be reused. The demo's colours are stated to be LemoLab's own brand. Two background plates in the demo are AI-generated (via the Codex CLI) and tagged ILLUSTRATION.
- One line: a TV newsroom's on-air package built in code; a sting that becomes the channel bug, a rundown, one lower-third strap that never leaves, and flat full-frame graphics (split-flap boards, threshold charts, explainer maps, quote and spec cards, stamps) carrying one fact each.
- Suits: news round-ups, weekly bulletins, market updates, election-night or results countdowns, product launches as spec cards. Real footage: no (optional; data graphics drawn in code are the default). Real data: **yes** (charts from real series only; otherwise tagged SCHEMATIC). 3D: no. AI images: **optional** (illustrative plates only, behind graphics, tagged `ILLUSTRATION / 示意`, never for the event, a place in the news or a person; no generated anchor).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ink | `#121417` | backgrounds, panels, strap end block |
| ink2 | `#1B1E23` | cards, land on maps |
| ink3 | `#22262C` | cards, land on maps |
| accent (lemon) | `#F2CF1D` | brand plate, tabs, band wipe, bars, stamps, the line that breaks |
| accent light | `#F8DE4A` | plate gradient / highlights |
| accent dark | `#D8B30C` | plate gradient / shading |
| gold | `#D4B064` | thresholds (dashed line), datelines, source lines, light fins, badges |
| paper | `#F4F1E8` | strap, documents, the chart line |
| breaking (reserved) | `#FE6B3D` | only BREAKING / LIVE; unused in a weekly round-up |
| dark olive | `#6E5A1E` | English secondary lines on paper (gold is too weak there) |
| plate duotone | `#0E1013` → `#ECE7D8` | grade for photographic/illustrative plates |
Structure to keep when re-branding: one accent + one gold-like secondary + paper + ink + a reserved alarm colour. Ink text on the accent.
### Typography
- Chinese: Noto Sans SC 900 (headlines, strap) / 700 (labels) (Google Font).
- Latin: Barlow Condensed 800 (numbers, names, the plate), 600 (secondary lines, quotes), 600 italic (end-card English title) (Google Font).
- Mono: IBM Plex Mono 500 for datelines, sources, axis labels; all caps with 1–4 px tracking (Google Font).
- Sizes at 1920×1080: strap headline Chinese 50 px + one English line 27 px; source line mono 13 px + Chinese 16 px at 75 % opacity, English ≤ 36 characters; end-card title 120 px. Other sizes not given.
- Every label bilingual, one line each (Chinese first, English smaller), never wrapped. No handwriting faces.
- Emphasis: an underline sweeps the key word in a quote as the voice says it; stamps for the verdict (one per story max); accent colour for the breaking line.
- Words on screen: one fact per screen; no burned-in subtitles (external `.srt` only), no crawl.
### Layout
| zone | position (1920×1080) | content |
|---|---|---|
| content | x 96–1824, y 56–840 | full-frame graphic; nothing important below y 840 while the strap is up |
| strap tab | x 96, y 856, 48 high | category in accent with ink text, Chinese + English (模型 MODELS, 市场 MARKETS, 监管 POLICY…) |
| strap | x 96, y 904, 1250×104 + 120 px ink end block | headline |
| source line | right-aligned at x 1836, y 950 / 978 | `SOURCE: …` |
| channel bug | top right, plate centre (1739, 86), 0.327 of the sting plate | plate + `AI NEWS` |
| corner tag | top left x 96, y 56, 330×64 | `ILLUSTRATION / 示意 · AI 生成画面` or `SCHEMATIC / 示意图`; flips in/out 0.2 s |
- Content sits 60–110 px lower than a subtitled layout would, so no dead band above the strap; re-lay the page when removing subtitles/crawl.
- Rundown: left date block (big numerals, month, week); right rows 1024×140 with an accent number block.
- Not centred title-and-bullets; no virtual set, no anchor.
### Elements
- Brand plate: parallelogram 520×180, accent gradient, ink and gold bars at the left, name in condensed 800; the same object is sting, bug, desk front and end card.
- Split-flap board: tiles 220×130, top and bottom halves clipped separately; old and new value on the same board; ×2 / +x % called out to the right.
- Threshold chart: line from the peak, dashed gold threshold; readout panel slides in after the break; axes only what data supports; streak counter.
- Bars growing down from a zero line for losses, values rolling; reference line at a shared threshold + badge.
- Explainer map (Natural Earth via `world-atlas` TopoJSON): members light in order of distance from the city, city ring, institution label with leader, stamp.
- Documents: 380×490 paper with ink header, fly out of a city dot on an arc; check boxes tick on key words.
- Quote card: ink with light streaks, large accent quotation mark lands first, lines push up, Chinese gist, gold rule, name, occasion, date; official wording in the original language only.
- Spec card: eyebrow (source · date), product name pushed up from a mask, category stamp, proportion bars on one true scale, percentage badge, context chip, a second group filling cell by cell joined by a bracket to its total.
- Stamps: accent fill or ink with a double accent frame, rotated −6° to −10°.
- Profile strap (`人物 PROFILE`) names a speaker. Company names set in type, never logos.
- Image treatment (plates): greyscale → auto black/white points (0.5 / 99.6 percentile) → γ 1.05 → 35 % S-curve → black 8, white 232 → duotone `#0E1013` → `#ECE7D8`, plus a left-dark ink gradient for type, 50–55 % vignette, 7 % overlay grain cycling six tiles. Real footage takes the same path (modern ≤ 1.5×, archive ≤ 2.5× after deblocking; crop station logos).
### Motion
- Sting (0–1.5 s): two accent slashes at 0.04 and 0.10 s → plate slams in with overshoot, an impact ring and shake (0.16–0.42 s) → letters drop in one by one → wordmark and dateline open from the centre (0.5 s) → glint (0.85 s) → plate flies to the top right and becomes the bug (1.12–1.45 s) while a vertical band wipes into the first shot (1.2–1.5 s). A hit within 0.4 s.
- Rundown rows flip in vertically on the beat (back ease) with a glint; demo rows at 2.3 / 2.7 / 3.1 / 3.5 s; at the close the same rows are ticked (demo 0.4 s apart).
- Strap flip: new words up from below, old up and out, 0.32 s; tab flashes white on a category change; strap enters with the first story and slides out when the recap starts.
- Threshold chart: line head advances one trading day per step (demo 0.1 s per day ≈ 14.15–15.65 s); the last step crosses in accent with shake and ring.
- Documents fly on an arc in 0.5 s, scale 0.08 → 1, rotation settles.
- Quote lines push up 0.18 s apart.
- Stamps land from 1.9× in 0.16 s with an expanding ellipse.
- Masked push-up titles start fully below the mask and aren't drawn at progress 0.
- Map: one long take; push, then pan to make room; one world→screen function keeps labels attached.
- A package action every 0.5–1 s inside a shot; no frame flat > 1 s; strong action within 0.5 s of every cut.
### Transitions and rhythm
- 120 BPM grid, beat 0 at the end of the sting (1.5 s); every cut and wipe on a beat or half-beat.
- Between stories and programme parts: vertical band wipe (accent 84 px + ink 5 px + gold 14 px edge, 0.3 s). Inside a story: hard cut + timpani. Into the end card: slanted wipe. Nothing else (no dissolves, 3D flips, page turns, fly-throughs).
- The package layer travels with its picture: under a wipe each side draws its own strap words, tab, source line, corner tag; on a hard cut they change on the same frame. The incoming picture's entry animation starts under the band.
- Shot lengths: sting 1.5 s; rundown 4–5 s; story shots 3–7 s; map long take 6–12 s; comparisons held until every item has been fully on screen ≥ 2.5 s.
- Order inside an item: what → how big → who it hits / who said it → verdict stamp.
- One beat of silence before the biggest break, then the heaviest hit. Demo 53.5 s, 11 shots, 1,605 frames at 30 fps; end card held 6 s.
### Finish
- Plates only: 50–55 % vignette, 7 % overlay grain (six tiles), duotone grade. Graphics and package never grained; master with no grain.
### 3D look (if any)
None (flat graphics over ink).
### Banned
Not Caption News (no huge slammed captions leading), not Data Storytelling (no dashboard), not a keynote (no centred title-and-bullets, page turns), not a studio show (no virtual set, anchor, fly-throughs). No crawl, no burned-in subtitles; no dissolves, 3D flips, page turns; never copy or name a broadcaster's logo, set, fonts, colours, music or idents; no company logos for companies in the news; no text baked into images; no generated anchor; generated plates never stand in for events, places or people; no paraphrase inside quotation marks; words never stronger than the source; no single report's allegations about real companies/people; no rolling counters on a close price (schematic posing as data); no unsupported axis labels; gold never on paper; no close-up or slow motion of private individuals; strap words never flip or overlap during a wipe.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/news-package.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/news-package/poster.jpg (same image as the styleframe)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/news-package/demo/stills/styleframe.jpg (18.4 s, the broken threshold with readout)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/news-package.mp4 (narration excluded from reuse)
### Gaps
16:9 only; most graphic font sizes not given beyond strap/source/end card; easing curves named only as "back ease" and "overshoot" without parameters; shake amplitude not given; Latin-only type pairing not specified.

<!-- category: Evidence Films -->

## Satellite Briefing
- Source: `lemomo-ai/lemo-opuscar` `styles/satellite-briefing/STYLE.md`, `DEMO.md`, `style.json` (No. 55, Evidence Films); constants checked in `demo/overlay.js`; licence: MIT (docs), demo film/stills CC BY 4.0. Caveat: the imagery itself must be licence-clean: usable are USGS Landsat (1972 on), USGS NAIP, NASA Blue Marble / MODIS / VIIRS (public domain or free with credit); EOX Sentinel-2 cloudless is CC BY 4.0 only for 2016 (2018 on is non-commercial); raw Copernicus Sentinel needs "Contains modified Copernicus Sentinel data [year]". Not usable: Google Earth/Maps, Bing, Esri World Imagery, Mapbox Satellite, Planet, Maxar, news photos, AI imagery. OSM (ODbL) / CC BY-SA only after telling the user the terms. The demo carries a "not made or endorsed by USGS/NASA" note.
- One line: real satellite imagery graded to an analyst's grey, thin white measurement hairlines drawn on the ground, one continuous log-zoom from orbit to the ground and back, time running inside a locked frame.
- Suits: climate, geography, news explainers, "the map says X, the ground says Y" stories, land-use change. Real footage: no video, but **needs real georeferenced satellite rasters** (Planetary Computer STAC for Landsat C2 / Sentinel-2 L2A, USGS EarthExplorer, NASA GIBS for MODIS/VIIRS/Blue Marble, Natural Earth outlines) plus a `FACTS.md` of every claim. Demo used only stdlib + numpy + SciPy + Pillow (no GDAL), 3–4 GB of cached scenes, ~1 GB textures per render worker. 3D: a WebGL2 ray–sphere globe + plate shader (no 3D models). AI images: forbidden ("never fill a gap with generated imagery presented as evidence").
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ground, darkest | `#070B0E` | analyst grade low end (blue-black) |
| ground, lightest | `#A1A7A9` | analyst grade top (cool silver, ~65 % grey) |
| marks / ink | `#F2F5F6` | every hairline, label, reticle (white = "measured") |
| marks dim | `rgba(242,245,246,.55)` | secondary marks |
| halo | `rgba(3,6,8,.82)` (text) / `rgba(3,6,8,.45)` (lines) | dark halo behind every mark |
| reading accent | `#FFBE55` | the one measured reading on screen (amber) |
| claim / map blue | `rgb(46,112,206)` | the claim layer (printed map), never for measured things |
| map line | `#A9D2FF` | map linework over imagery |
| map name over sand | `#D6EAFF` | serif place name floating over the ground |
| printed map paper | `#ECE2CB` | atlas page |
| printed map sea | `#8CB5DB` | atlas page water |
| coast ink | `#1A3B6B` | atlas coastline |
| map serif name on page | `#1F3F6B` | atlas place name |
| graticule | not given (hex) | "faded red-brown" |
| subtitle plate | `rgba(5,8,11,.62)` → `.50` at 85 % → `0` | transcript strip gradient, dark fading right |
| info plate | `rgba(6,9,12,.62)` | instrument plates |
Rules: grey ground about 3–65 % value, a fifth of the chroma; white belongs only to marks; one warm accent for the single reading; an optional second hue only for the claim being tested; true colour only at orbit and where the story turns (the demo: only the North Aral's water inside a 0.75° circle); no false-colour ramps.
### Typography
- Roles (all OFL, self-hosted; CJK subset to used characters): light condensed grotesk for the reading, 96–130 px (demo **Barlow Condensed**, Google Font, weight 300, tracking −1 px; unit at 0.36× the value size, weight 400); monospace for instruments and dates, 20–34 px (demo **IBM Plex Mono**, Google Font); a sans for labels, 24–42 px (demo Noto Sans SC 500 28 px label, 400 23 px note; Google Font); a serif only for the claim layer and the title (demo **Noto Serif SC**, Google Font).
- Readout block: label above (28 px), value (96–130 px light), source note 56 px below ("Landsat, measured", 23 px at 82 % white, tracking 0.5).
- Subtitles = transcript strip, bottom left: x = 96 px, a 2 px white rule, dark plate fading right; bilingual demo has Chinese at y 962 (500 38 px, tracking 1) above English at y 1007 (Barlow Condensed 400 33 px, tracking 0.3); safe width 1100 px; always one line per cue (`nowrap`, measured with the real font; split a long sentence into two cues). Sizes at 1920×1080.
- Nothing below 20 px at 1080p, imagery credit included. Text halo: shadow blur 7 px (12 on the reading).
- Holds: subtitles ≥ max(1.8 s, speech + 0.6 s); labels ≥ characters ÷ 4.5 + 1.5 s (CJK); a rolling counter is judged by its landing value.
- Emphasis: the single amber reading; everything else white.
### Layout
- The reading sits in the right third, beside what it measures. Subtitles bottom left. Instruments (altitude readout, scale bar, imagery credit) in the corners, in screen space.
- At key moments the subject fills about a third of the frame height.
- Labels attach to the ground with leader lines; everything except instruments and the transcript strip is anchored to world coordinates via one world → screen function.
- Density: one finding per screen; marks thin and sparse.
### Elements
- Hairlines 1.2–2.6 px with a dark halo (code default 1.4 px + 3.2 px halo); dashes for history and claims; brackets, ticks, leader lines; lock-on reticle; outlines that "print" behind the scan.
- Range line: 4 px (demo), ticks every 10 km, numbers every 50 km, a reticle and rolling "km" at its tip, a lit corridor along it.
- Shoreline "rings" per dated plate; the band lost between two rings flashes; a light runs along the newest edge.
- Altitude readout and scale bar computed from the same camera; burned-in imagery credit.
- Claim layer = a printed atlas page drawn in the shader from a distance field: paper grain a few px wide at any zoom, halftone ink, coast and waterlines, graticule, serif name; may carry a fold.
- Image treatment: the "analyst grade" uniform: luminance with local contrast and clarity, a shoulder that keeps salt/snow/cloud below white, toned blue-black → cool silver, 1/5 chroma. Raise local contrast only at close range and dim outside the measured corridor.
### Motion
- The camera never stops: distance interpolated in log space, eased segments, holds keep a 2–5 % creep or slow rotation; no frozen frame longer than 1 s (demo check: no stretch over 1 s below 0.6 mean pixel change).
- Marks arrive by being made: lines grow, outlines print behind the scan, counters roll and land with a small pop, the reticle snaps with overshoot.
- Time changes are soft scan fronts (a satellite pass, never a hairline): north → south forward, south → north for a rewind; their spacing sets speed and the camera accelerates with them. Demo rings spaced 1.8 / 1.2 / 0.9 / 0.6 / 0.9 s, camera motion per second 1.2 → 3.9, braking in 0.3 s at the stop.
- Growth can run outward from an old edge ordered by a distance map.
- Demo camera numbers: opening oblique orbit at tilt 57°; dive 3,800 → 160 km with tilt 55° → 0° (accelerate then brake); scanner bar tear 0.34 s; push 520 → 92 km; whip pan ~280 km in 0.6 s with directional blur; climb back with tilt to 50°.
- Never moves: the ground under its annotations; instrument positions.
- Camera vocabulary: oblique orbit with limb in frame (scale, context); dive = log zoom + tilt to nadir (going to check); locked nadir with slow creep (evidence, time running); push-in on a point (one town, one dam); track along a line (distance); whip pan with blur (counter-example, "meanwhile"); climb back to orbit (consequence, ending).
### Transitions and rhythm
- Transitions: scan-line swaps, a map layer switched off, zooming through nested plates, whip pans, the reticle opening into a title card. No crossfades between unrelated places; no hard cuts inside a zoom. The demo is one continuous take (37.8 s).
- Rhythm: demo 100 BPM 4/4, every key action on a beat or half-beat (cuecheck 0 ms on 26 cues); acceleration by subdivision (ticks 8ths → 16ths), not tempo. Silences as tools: music and foley stop, a thin bed stays; suck-outs of 0.2–0.45 s (music + foley down ~25 dB) before the heaviest impacts.
### Finish
- Light grain added in ffmpeg; a vignette; directional blur only on whip pans. Globe: thin atmosphere rim, limb shading at orbit only.
- Mix-side finish (demo): −14.4 LUFS master target, measured −13.8 LUFS, true peak −1.6 dBTP; 20–60 Hz ~15–16 dB under the full band, high-pass ~38–40 Hz.
### 3D look (if any)
A ray–sphere globe from a perspective camera (compute |C|² − R² in double precision; float32 fails below a few tens of km), nested georeferenced plates sampled in a WebGL2 shader with feathered edges (world → region → detail). No modelled 3D objects. Demo plates: region mosaics 3917×2652 at ~190 m, detail plates at ~32–40 m, Blue Marble 4096×2048.
### Banned
Not Data Storytelling (no chart on paper), not Sci-fi HUD (no glowing wireframes or invented chrome), not Blueprint, not Isometric Infographic (no diorama, only real nadir/oblique views), not a keynote (no slides, header bars, chapter numbers). Nothing on the ground drawn, stylised or generated; no false-colour ramps; no crossfades between unrelated places; no hard cuts inside a zoom; no frozen frame > 1 s; never copy the reference films' layouts, typefaces, icons or music, never name them; never use the non-licensed imagery sources listed above; never paint out plumes/haze (swap the scene date instead); no text below 20 px.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/satellite-briefing.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/satellite-briefing/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/satellite-briefing/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/satellite-briefing.mp4
### Gaps
No vertical layout (all positions at 1920×1080); the reticle's overshoot amount and the counter "pop" size are not given in the docs; the scan-front softness width is not given; the vignette and grain amounts are not given; the graticule hex is not given.

## Engineering Briefing Board
- Source: `lemomo-ai/lemo-opuscar` `styles/briefing-board/STYLE.md`, `DEMO.md`, `style.json` (No. 56, Evidence Films); also `demo/kit/README.md`; licence: MIT (docs), demo film/stills CC BY 4.0. Caveats: photos must be CC0 / public domain / CC BY (Wikimedia Commons file pages, Library of Congress rights statements, agency media, Flickr Commons); CC BY-SA or "no known restrictions" only after telling the user the terms; the demo's six Commons photos keep their own licences (`demo/CREDITS`). Matting model BiRefNet-general (MIT, ~970 MB ONNX).
- One line: one real whiteboard wall, filmed in window light; cut-out photos of real things land on it with weight, magnets and stamps pin them, three-colour marker ink draws itself, and the camera rides the lines until one final pull-back reveals the whole wall as a poster.
- Suits: engineering explainers, option comparisons, "which one wins" tests against a limit, briefings, roadmaps, budgets. Real footage: no video, but **needs real, licensable photographs of the real objects** (cut out at full resolution) and a `FACTS.md` of every claim; drawn marker sketch only if no photo exists. 3D: no (2D layers with depth: parallax, shadows, DOF, motion blur). AI images: forbidden as stand-ins for real objects.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| enamel board | `#F3F1EB` | the whiteboard surface (demo) |
| wall | `#8F8B83` | warm neutral grey wall around the board |
| ink graphite | `#23272E` | names, rules, facts |
| ink blue | `#1F4FC8` | water and measurement: dimension lines, projection lines, measured numbers |
| ink red | `#D33A21` | the decision only (rejection, verdict key word, stamp); ≤ 2–3 red marks per frame, never on a red object |
| water hatching | `#5F86DA` | river hatching |
| drafting grey | `#6C727B` | extension lines, ground hatching |
| erased ghost | not given (hex) | wiped ink left at ~7 % |
Rules: full colour belongs to the photographs; props stay neutral; a red magnet is a verdict. Ink at ~90 % flat colour with a lighter core, multiplied onto the board.
### Typography
- Marker lettering: one single-weight marker face covering every script used; demo **LXGW Marker Gothic** (OFL; on Google Fonts, but CJK subsets fetched via the CSS API `&text=`), revealed glyph by glyph with seeded tilt and baseline jitter. Sizes in **board px** (zoom 1 = 1,920 board px across the 1920×1080 frame): content 100–160, a verdict 230–400 (demo verdict 400).
- Printed labels (tags, cards, stamps): a sturdy sans; demo name tags Noto Sans SC 700 at 78 px with the number in blue marker at 100 px; stamp "否决" in Noto Sans SC 900, pitted red. Credit lines in a monospace (demo **IBM Plex Mono**, Google Font). A tag holds 1–3 words.
- Subtitles: a frosted acrylic strip at the bottom centre with a blue marker tick at its left; bilingual demo has Chinese Noto Sans SC 500 42 px over English **Archivo** 500 29 px (both Google Fonts); one line per language (`nowrap`), measured in the page against a 1,500 px safe width; a long line becomes two cues. Key content stays above the strip (bottom 15 %).
- Reading time: subtitles ≥ max(1.8 s, speech + 0.6 s); board text fully in frame for CJK chars ÷ 4.5 + other chars ÷ 15 + 1.5 s from when it appears; text meant to be read in the final wall ≥ 20 px on screen.
- Emphasis: colour meaning (red = decision), stamps, a hand-drawn ring around the deciding number, a leader arrow to the verdict.
### Layout
- One continuous wall, no pages. Demo board 6,400 × 3,600 board px (16:9, so the final pull-back fills the frame).
- Design the wall as a poster first (hierarchy, reading path, filling the frame), then plan every shot as a crop of it; keep one zone (secondary layer, verdict, title card) for the reveal alone.
- Drafting conventions: plan view above elevation view, linked by dashed projection lines so both share one scale (demo 1.24 px per metre).
- Framing: off-centre, cropped, close. Before the reveal: ≤ ~60 % of the board width (demo max 51.4 %), never both side edges, never the reveal zone.
- Judgement frame per tested item: the whole item, the limit and the verdict, held ≥ 2.5 s; each wider than the last (demo 1,768 → 1,945 → 2,361 → 3,205 board px, 28 % → 50 % of wall width).
- Label blocks pinned where the camera rests; name tags placed from the number's measured width so they never touch.
- Secondary layer (pinned prints, a source card, sums on sticky notes, a small sketch) lives only where the camera does not go before the end.
### Elements
- Board: procedural enamel, ghosts of erased marker, smudges, window light falloff, a sliding diagonal reflection, frame and tray (tray nearest the lens).
- Depth stack: board z 0; prints z ≈ 6–14; props z ≈ 8–26; tray z 70. Prints cast a blurred-silhouette shadow along one light vector, softer the higher.
- Prints: photos cut out at full resolution (BiRefNet matte, or hand polygon / mask), clean edges, one shared grade (lower saturation, a touch warmer, lifted blacks); thin structure (cables, stays, railings) measured and redrawn as clean lines; lettering in photos (signs, logos, names) painted out. Rule: ≥ 1 source px per screen px at every frame.
- Props: magnetic tags, round magnets (graphite, red, blue, white), a brushed-steel ruler with engraved graduations on two magnets, printed cards, pitted rubber-stamp impressions, sticky notes.
- Ink kinds: line (optional arrow, dashes), dimension (arrowheads + extension lines), write (lettering), hatch (many short timed strokes), ring, wake lines behind a moving print. Wet-tip glint on the stroke being drawn; round caps.
- No slide chrome: no headers, page margins, number blocks, centred bullets.
### Motion
- 24 fps on ones; nothing stepped.
- Camera: overlapping eased moves, each with velocity ∝ u^a (1−u)^b, a and b ≈ 1.5–4 (b > a = quick start, long settle / inertia); moves are deltas in x, y, ln zoom and roll. Hand-held breath ≤ 3 px; shake only on impacts (`{t, amp, f, k, dir}`). Sub-frame motion blur at 180° shutter.
- Prints are lowered from the camera side, land, bounce and settle as the shadow tightens; magnets clack on to pin them (two per print in the demo); tags swing; removed magnets pop toward the lens; struck things jolt and spring back. The camera may meet a landing close on the object's most telling detail, then pull out.
- Ink draws at hand speed; dimension lines land with an arrowhead tap. Erasing wipes to a ~7 % blurred ghost.
- Something lands, draws or swings every 1–2 beats; only silences and judgement holds go still.
- Demo numbers: hook = dimension arrow snaps across in 0.25 s, camera whips with it, overshoots, settles (z 2.6 → 1.32, roll −3°); slow push with −1.6° Dutch tilt for tension; judgement holds 2.6 / 2.6 / 4.1 / 3.0 s; the final pull-back z 1.42 → 0.2795 in 2.05 s; final slow push ×1.025.
- Camera vocabulary: ride a line (measuring), tilt along projection lines (same quantity, other view), slow push-in + Dutch tilt (approaching problem), pull back and sideways (stating a rule), whip with the line + overshoot + settle (a result that exceeds), rise along a leader (evidence → verdict), staircase framing (each item with the previous result), judgement frame, long pull-back to the whole wall (the end).
### Transitions and rhythm
- One continuous camera; transitions are moves only: no cuts, fades or zoom-to-fit. The first frame holds a readable subject; the first strong action within 0.5 s.
- Rhythm: demo 120 BPM 4/4, every landing, pin, stamp, arrow, strike and tag on the 16th-note grid (cuecheck 27/27 at 0 ms). Silences (demo 7.0–8.0 s and 35.25–35.75 s) keep only room tone. Demo 40.0 s, 960 frames.
### Finish
- Light grain (mux grain 1); depth of field and motion blur from the depth stack; window light falloff and a sliding reflection; a cloud shadow may cross the wall at the end.
### 3D look (if any)
None; 2.5D layered photos with parallax by height.
### Banned
Not Whiteboard Explainer (no hand drawing flat line art), not Data Storytelling (comparisons are dimension lines in real units beside real objects), not a keynote (no headers, centred bullets, page turns). No dissolves, no scale-pops on text, no bouncy UI easing, no text fading in by itself, no cuts or fades or zoom-to-fit. Never a generated image presented as a real object; never upsample a photo; no lettering left in photos; never show the whole wall before the end; red never more than 2–3 marks per frame; no piano-and-strings pad; never copy or name the reference explainers.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/briefing-board.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/briefing-board/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/briefing-board/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/briefing-board.mp4
### Gaps
Bounce/settle amounts for landing prints and swing amplitude for tags are not given in the docs (they live in `kit/board.js`, not read); no vertical layout (a 16:9 board is assumed so the final wall fills the frame; a 9:16 board would need re-planning); the exact frosted-strip colour and opacity are not given.

## LiDAR Survey
- Source: `lemomo-ai/lemo-opuscar` `styles/lidar-survey/STYLE.md`, `DEMO.md`, `style.json` (No. 57, Evidence Films); licence: MIT (docs), demo film/stills CC BY 4.0. Caveats: the point data must be public domain / CC0 / CC BY / attribution-only government licence (USGS 3DEP via Entwine Point Tiles, OpenTopography per dataset, AHN CC0, England EA LiDAR OGL, France IGN LiDAR HD Licence Ouverte, Spain PNOA-LiDAR CC BY 4.0, Finland NLS CC BY 4.0, NZ LINZ CC BY 4.0); ODbL / CC BY-SA / non-commercial only after asking the user; never commercial scans or Google 3D tiles. The demo notes it was not made or endorsed by USGS, USDA or the town.
- One line: real airborne laser points floating in the dark; a scan line or cutting plane passes through, the canopy lifts away by height, the rest condenses into a raking-lit surface measured with amber hairlines, all in one designed camera move.
- Suits: heritage and archaeology under forest, environment, site surveys, flood channels, building scans, clearances. Real footage: no, but **needs a real lidar point cloud** (fetched as an EPT subset by box and depth) and a `FACTS.md`; extra Python packages `laspy`, `lazrs`, `scikit-image`, `fonttools` + `brotli` in a private venv. 3D: yes (WebGL points + a mesh surface, built in three.js-style shaders; Blender not used). AI images: forbidden ("never stand in a generated or invented cloud for real evidence").
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| background | `#05080A` | near-black with a cold tint; never pure black, never a gradient sky |
| canopy ramp low | `#1F3F35` | points by height above ground, 0 m end (demo ramp 0–28 m) |
| canopy ramp mid | `#5C9A7A` | |
| canopy ramp high | `#E2F3DC` | |
| ground returns | `#C8B38C` | class-2 points |
| solid surface | `#BDB5A6` | warm neutral, lit from azimuth 315°, 26° up |
| fronts / seams | `#D4FFF0` | the scan front and cutting-plane glow (light, not a colour) |
| accent | `#FFB347` | traced features, readings, the section line only |
| chart second hue | `#83C495` | only inside a comparison chart |
Rules: one desaturated ramp by height or class; intensity modulates value, not hue; no rainbow elevation ramps; the surface colour never competes with the accent.
### Typography
- Readings: light condensed numerals 110–130 px (demo **Barlow Condensed** 300, Google Font).
- Instruments, coordinates, counts, source lines: monospace 19–22 px (demo **IBM Plex Mono**, Google Font).
- Labels in the film's language: sans 24–36 px (demo **Noto Sans SC** 500, Google Font; CJK subset to the characters used). End-card title in Noto Sans SC 500.
- Sizes at 1920×1080; nothing below 19 px at 1080p.
- Subtitles: transcript strip bottom-left (2 px rule, plate fading right), one line per language measured with the real font, split rather than wrapped; bilingual: film's language on top. Demo widest line 595 px against an 1,100 px limit.
- Holds: subtitles ≥ max(1.8 s, speech + 0.6 s); labels ≥ chars ÷ 4.5 + 1.5 s (CJK), letters ÷ 15 + 1.5 s (Latin). A rolling counter reports its landing value.
- Emphasis: the amber reading with a small landing pop; one reading at a time.
### Layout
- Instruments in one corner (place, coordinates, area, data source, point count, any exaggeration); they change only when the medium changes.
- Readings in the right third beside what they measure: label, number, source/method line, a leader when the feature is in frame.
- Subject ≥ a third of the frame height at key moments; nothing in the subtitle strip area.
- A survey window: the measured area is a stage; outside it the cloud stays as dim unpeeled points instead of ending in black (also used to keep houses out for privacy).
- Density: one held reading per screen ("museum film cadence").
### Elements
- Points: GL points sized in world units 0.12–0.3 m with a floor of one output pixel, soft discs, opaque and depth-tested (additive only for a ghost layer), distance fog.
- Solid surface: 0.5–1 m mesh, smooth normals, baked short-radius AO, low raking sun 20–35°, faint contours, crests lightened; micro-relief exaggeration ×2–3 only with an on-screen note (demo ×2), measure on undistorted data.
- Cutting plane by height above ground with a glowing ring where it meets the trees and a ruler (with a height histogram) on the frame edge tracking it.
- Marks on the surface as a distance field kept hairline with `fwidth`; traced features light up along their length in order, labelled "traced".
- Section chart: raw returns across one feature (demo 1,451 returns, vertical ×5) with a median profile and dimension marks (demo 0.56 m high, 2.5 m wide at half height).
- Bar cards for history comparisons (demo bars against the town's ~100 km²).
- Image treatment: an aerial photo can be draped on the canopy surface as the opening "claim".
### Motion
- 24 fps on ones; the camera never stops; keys as a C1 spline in target / distance / heading / pitch (no `lookAt` from nadir).
- The front moves on an ease, slowest where the subject is; the cutting plane steps on the beat (eased steps, short holds) so layers read (demo 30, 24, 18, 12, 6, 0 m, one per beat, finishing at −6 m to clear low vegetation).
- Points appear only behind a front or by height, never by a random fade across the frame; returns above the plane lift away and fade; the surface fills in over tens of metres behind the seam.
- Readings land with a small pop; counters roll (demo 3.4 km rolls in 0.6 s).
- Never moves: points relative to each other (no wobble, no noise displacement); instrument positions.
- Demo camera numbers: nadir push 480 → 395 m with a 6° turn; crane down tilting nadir → 44°; low oblique 105 m at 15° pitch; slow orbit +12° at 92–105 m during the peel; rising pull-back to 480 m at 48°; push 230 → 88 m, pitch 34° → 21° to the section; crane up to 470 m at 56°; end rise 470 → 560 m.
- Camera vocabulary: locked nadir + slow push (what a photo shows), crane down + tilt to oblique (entering the data), low oblique close (10–20° pitch, 90–150 m: volume), slow orbit (studying, the plane does the work), rising pull-back (scale reveal), lateral track (travelling a feature), push to a section (the proof).
### Transitions and rhythm
- Transitions are fronts and planes: no crossfades or hard cuts inside the cloud; one continuous camera (demo 40.0 s).
- Rhythm: demo 96 BPM 4/4 (beat 0.625 s), every picture cue on a beat or half-beat (cuecheck 0 ms on 17 cues); acceleration by subdividing ticks 8ths → 16ths → 32nds. Near silence (air only, demo −22 dB under programme median) before the main reveal; the first sound after it is the impact.
### Finish
- Render at 2×, high-threshold bloom only on fronts and seams, vignette; **no grain** (points are already fine detail; encode at a higher CRF). Distance fog on points.
### 3D look (if any)
Real point cloud (quantised uint16 positions at 2 cm / 1 cm plus one byte each for height above ground, class, intensity, seed; demo 4,789,797 returns) and a 0.5 m ground mesh triangulated from class-2 returns, raking sun 20–35°, short AO, contours. Points by height or class colour, opaque soft discs. Convert Web-Mercator EPT data to a local east/north/up frame and check the vertical datum.
### Banned
Not Sci-fi Hologram HUD (no invented interface), not Satellite Briefing, not Blueprint, not Low-poly Isometric, not Glass Product Render. Never move points into a shape; no wobble or noise displacement; no rainbow elevation ramps; no pure black, no gradient sky; no glow except at the front; no random fade-ins; no crossfades or hard cuts inside the cloud; no grain; never commercial scans or Google 3D tiles; never invented clouds as evidence; don't frame a reveal on scan striping at grazing angles; don't show houses/yards; never copy the reference visualisations' layouts, ramps, typefaces or music.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/lidar-survey.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/lidar-survey/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/lidar-survey/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/lidar-survey.mp4
### Gaps
Bloom threshold/strength, vignette amount and fog distances not given; the reading "pop" size not given; no vertical layout; the end-card rule length not given.

## Projection on White Model
- Source: `lemomo-ai/lemo-opuscar` `styles/white-model/STYLE.md`, `DEMO.md`, `style.json` (No. 58, Evidence Films); constants checked in `demo/overlay.js`; licence: MIT (docs), demo film/stills CC BY 4.0. Caveats: building data must be CC0 / public domain / CC BY (3DBAG NL CC BY 4.0, PLATEAU JP CC BY 4.0-compatible, city portals), credited in CREDITS and on screen; OpenStreetMap / Overture (ODbL), CC BY-SA, "no known restrictions" only after telling the user; the demo notes 3DGI, TU Delft, Kadaster and Rotterdam did not make or endorse it.
- One line: a pure white massing model of a real place on a plinth in a dark room; a projector paints data onto it as light, one layer at a time, and the model itself never changes.
- Suits: urban planning, exhibitions, city data, growth over time, building heights, shadow studies, flood depth, zoning. Real footage: no, but **needs real building footprint + height data** (demo adapter reads 3DBAG + BGT only; other sources need their own adapter to the same `model.json`; pyproj/shapely may be needed in a private venv) and a `FACTS.md`; every on-screen number computed by script from the same data. 3D: yes (three.js meshes, real directional sun with shadow maps, DOF; Blender not used). AI images: forbidden.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| model | `#F3F3F1` | matte white massing, roughness 0.88 (≈ 0.9 rule) |
| water inlay | rgb(0.10, 0.13, 0.17) (linear floats) | darker satin inlay in the base plate |
| plinth | `#17181A` | dark satin plinth |
| room | not given (hex) | dark radial gradient, near black |
| layer: pre-1940 / "the old" | `#FFA13D` | categorical warm amber; reused later only with the same meaning |
| layer 1940–64 | `#2A46FF` | time ramp, blue → cyan → white |
| layer 1965–89 | `#2F98FF` | |
| layer 1990–2009 | `#6FDCFF` | |
| layer 2010–25 | `#E6FBFF` | |
| height ramp | `#1A1440` → `#5A35D6` → `#E2509A` → `#FFE7C4` | violet → magenta → peach, continuous height |
| projected shade | `#1C2C66` | deep blue projected shade when the sun arrives |
| sun | `#FFD9AD` | warm directional sun |
| shadow trace fill | rgb(0.10, 0.22, 0.65) + pale edge | the one traced shadow |
| newer shaded roofs | `#BFF3FF` | pick-out of roofs inside the shadow |
| overlay ink | `#FFFFFF`, `#EEF1F4`, `#F4F5F6`, `rgba(225,230,236,.78)` | readout figure, layer name, label, source note |
| plates / gradients | `#05060A` at 62 %; `rgba(4,5,8,.6)` and `rgba(6,7,10,.7)` fading to 0 | pin tag plate; subtitle / end-card gradients |
Rules: white model, dark room, dark plinth; one hue family per layer; never colour the model in the house light; never more than two layer palettes on screen at once; data colours are put away when the sun arrives.
### Typography
- Figure: a light grotesk, **Inter Tight** 200 at 120–140 px (demo readout figure 128 px, unit 60 px); Google Font.
- Labels in the film's language: **Noto Sans SC** 300/500 at 20–36 px (demo layer name 500 24 px tracking 3 px; label 500 32 px; source note 300 21 px); Google Font. End-card title Noto Sans SC 500 64 px; English title Inter Tight 200.
- Instruments, years, coordinates: **IBM Plex Mono** 18–22 px (demo index 20 px, tracking 2 px); Google Font.
- Pins: tag on a dark plate, title 26 px + one sub line 20 px.
- Subtitles centred at the bottom on a soft dark gradient, no box; demo Chinese Noto Sans SC 500 36 px over English Inter Tight 400 30 px; each language one line against a 1,500 px safe width; split into two cues rather than wrap.
- Sizes at 1920×1080; nothing below 18 px at 1080p. Holds: subtitles ≥ max(1.8 s, speech + 0.6 s); labels ≥ chars ÷ 4.5 + 1.5 s (CJK), letters ÷ 15 + 1.5 s (Latin).
- Emphasis: one big figure per layer, with soft text shadows (blur 10–18 px) for legibility over the model.
### Layout
- Readout in the left third, one per layer (demo x 96, baseline y 560): index + layer name, a 2 px colour rule that grows to 48 px, one figure (+ unit), one label, one source line, a legend bar.
- Identity label top-left, quiet: place, scale, data sources.
- Subtitles bottom centre; pins never over the readout.
- At key moments the subject fills a third of the frame height.
- Density: one layer, one figure, one label, one source at a time.
### Elements
- Model: extruded real footprints at a stated scale (demo 1:1000, 2.3 × 2.6 km, 3,887 buildings, 8,860 roof parts, 108 bridge decks); crisp edges; bridges as low white slabs; thin base plate on the plinth.
- Pins: a 1.6 px hairline (over a 4 px dark under-stroke) from the tallest roof part up to a tag (demo default length 110 px, drawn in 0.45 s), a 4 px dot at the anchor.
- Measured range line on the model with ticks (demo 0 → 777 m with 100 m ticks).
- Legend rows per layer; a year counter; a date stamp.
- Image treatment: none (no photos); colour is projected light only.
### Motion
- Camera moves continuously and slowly; changes speed with the layers, never stops dead. Demo camera keys in target / azimuth / elevation / distance: macro glide az 152 → 142, el 7 → 11, d 0.55 → 0.72; crane up el 11 → 36, d 0.72 → 1.85; orbit az 104 → 52 with rise d 1.62 → 2.75; boom down el 36 → 17; final pull back d 1.3 → 2.85, el 35 → 44.
- Light is the actor. Layer gestures: a soft wash spreading from the projector axis; buildings switching on one by one with a short flash (demo spreads 1.0 / 0.9 / 0.9 / 0.75 s, faster each layer: acceleration by spread, not tempo); a level of light climbing every facade (25 m rings, low buildings finish first); the sun clock running (demo 10:55 → 12:40 solar noon). Never a hard line sweeping the table.
- House lights cut fast (relay, 0.25 s) and return slowly (1 s); the projector lamp strikes with a brief flicker.
- Counters roll while the light moves and land when it lands; measured lines grow A → B with ticks.
- Overlay: readouts rise 22 px into place over 0.5 s with ease-out; pin tags appear 0.15–0.4 s after the line starts.
- Projection term in the shader: `colour × (0.42 + 0.58 · max(N·toProjector, 0)) × throw mask`, scaled by albedo, reduced on water; never a texture on the mesh.
- Never moves: the model, the plinth, pin anchors.
- Camera vocabulary: macro glide at rooftop height with shallow focus (the model is real), crane up and back (pattern from above), slow orbit with a rise (layers accumulating), boom down to a low angle against black (heights), side-on track along a line (a measured distance), pull back as house lights return (ending/reset).
### Transitions and rhythm
- One continuous take; transitions are light changes (lights out, a layer replacing another, the projector going dark), not cuts, fades or wipes.
- Rhythm: demo 100 BPM 4/4, every layer onset, date, top of climb, sun, line landing, roofs and lights on a beat (cuecheck 0 ms on 19 cues). Silence: projector dark, only a thin fan hum (demo 21.6–22.8 s); a short suck-out before the heaviest hit (demo 5.55–6.0 s). Demo 40.0 s.
### Finish
- Physical depth of field (stronger on close shots), bloom only above projection highlights, vignette, light grain in ffmpeg. GTAO only on close shots (fades out after the lamp strikes; it bands on wide grazing views). Neutral studio environment (warm HDRIs turn the white model beige).
### 3D look (if any)
Matte white extruded massing (roughness ~0.9) with outward normals derived from ring orientation and shared walls removed; one soft key + neutral studio environment + AO for house light; the sun as a real directional light with shadow maps from latitude, date and time (NOAA/Meeus); projection as an additive lit-surface term; dark satin plinth in a dark room; shallow focus at rooftop height on macro shots.
### Banned
Not Isometric Infographic (no diorama or icons), not Low-poly Island (no invented terrain), not Sci-fi HUD (no wireframes), not Satellite Briefing (no imagery), not a point-cloud film (no scan lines; projection fronts need a wide soft edge). Nothing invented or "representative" on the model; no generated images; never paint colour into the material; never fake a shadow; never invent a year layer where data lacks it; no cuts, fades or wipes; no generic piano-and-strings melody; no warm HDRIs; no more than two layer palettes at once; never copy or name the reference galleries.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/white-model.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/white-model/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/white-model/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/white-model.mp4
### Gaps
Throw-mask softness, bloom threshold, vignette and grain amounts not given; DOF aperture values not given; room gradient colour not given; no vertical layout.

## Data Physicalization
- Source: `lemomo-ai/lemo-opuscar` `styles/data-physical/STYLE.md`, `DEMO.md`, `style.json` (No. 59, Evidence Films); licence: MIT (docs), demo film/stills CC BY 4.0. Demo data IRENA 2026 via Our World in Data, CC BY 4.0 (credit both); the demo is flagged as unofficial, not endorsed by IRENA/OWID. Walnut veneer and HDRI from Poly Haven (CC0).
- One line: real statistics built as countable physical pieces (plates, blocks, coins) stacked to exact scale on a crafted base and shot like a studio product: soft warm key, long shadows, shallow focus.
- Suits: annual reports, investor decks, energy/economic data, any "one number grows" or "A overtakes B" story. Real footage: no. Real data: **yes**, published statistics or the user's own figures, every number sourced on screen and logged in a `FACTS.md` (suggested sources: Our World in Data, World Bank, Eurostat CC BY 4.0; US Census/BLS/EIA public domain; IRENA/IEA/UN check terms). 3D: **yes** (three.js PBR, instancing, transmission, GTAO, DoF; Poly Haven HDRI via `tools/fetch.sh hdri`). AI images: no, explicitly forbidden as a stand-in for data.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| sweep / background | `#C4BEB4` | seamless greige sweep, fog fades to it (demo) |
| inlay on base | `#EFE4CF` | tick ring, spiral paths, years cut into the walnut dial |
| series 1 metal (aluminium) | `#C8CCD1` | solar plates, metalness 1, roughness 0.27 |
| series 2 acrylic | `#9FD3D6` | wind plates, transmission 0.72, clearcoat, teal attenuation |
| ruler pieces (brass) | `#D2B07A` | every 10th plate in both series; the final puck |
| ink | `#1C1D20` | values; labels at ~60 % strength |
| accent | `#D4521C` | the one reading/verdict that matters on this screen |
| key light | `#FFF1DC` | warm key from the left ~35° |
| rim lights | `#B9D2FF` / `#C6DBFF` | cool rims behind-right and front-right |
| base | not given (walnut veneer texture) | dial with aluminium rim |
Rule: warm neutral set; series separated by material, not paint; one accent; no rainbow series, no colour ramps on objects, no dark mode.
### Typography
- Numbers: light grotesk, Inter 200–300 (Google Font). Hero reading 130–170 px, stack reading 46–56 px (frame 1920×1080).
- Labels, verdicts, subtitles: sans in the film's language, Noto Sans SC 500 (Google Font), 24–46 px.
- Units, years, source lines: monospace, JetBrains Mono (Google Font), 20–24 px; source line 20–22 px at ~60 % ink.
- Title only: serif, Noto Serif SC 600 (Google Font).
- Letter spacing, case: not given.
- Emphasis: the accent colour on one verdict plate, underlined by a growing rule; appears only after the readings it judges have been still ≥ 2.5 s.
- Subtitles bottom-left on a 2 px ink rule with a paper plate fading right; bilingual = film language on top; one line only, measured with the real font (`nowrap`), split into two cues rather than wrapped (demo widest 836 px vs 1100 px limit). Hold ≥ max(1.8 s, speech + 0.6 s). Labels hold ≥ CJK chars ÷ 4.5 + 1.5 s or letters ÷ 15 + 1.5 s. Nothing below 20 px.
### Layout
- Subject fills ≥ 1/3 of frame height at key moments; comparisons keep both subjects fully in frame.
- Readings live in empty background, never over the subtitle strip; a reading pinned to a moving object is clamped to a safe box (demo kept reading columns below y = 430 to avoid the verdict plate).
- Verdict in the upper-left third; source line in a corner away from subtitles, on screen from the first reading to the summary and on the title card.
- Density: one reading per screen (annual-report editorial); two readings of a pair stack in one column, larger value on top.
- End card in the left third over the turning set (demo).
### Elements
- A reading = a dot on the object, a 1.4 px leader, a small swatch of the series material, the category line, then value + unit, on a translucent paper plate (~84 %).
- Brackets on single pieces stating the unit rule ("1 plate = 10 GW", "brass = 100 GW").
- Base with inlaid marks cut into the surface: 2° tick ring, series paths (long dashes vs short dashes), years in monospace.
- Rolling counter tied to landed pieces, not to time; "last object" (brass puck r 0.64, engraved with dark patina).
- Pieces: thin boxes/cylinders instanced in thousands, each with a few-mm random offset and yaw, ±7 % value change and a hairline gap (demo plate 0.50 × 0.42 × 0.0125 units = 10 GW; 27.6° per year on a spiral, solar ring r 2.25–2.58, wind ring 0.6 inside).
- No icons, outlines, glow or fake UI.
### Motion
- 24 fps on ones; camera never fully stops (2–5 % creep on holds; demo 2–3 %).
- Cascade: a stack assembles bottom to top in 0.5–1.0 s, each piece dropping a few cm with an ease-out (demo: one pair every 1.25 s).
- Feed: one period's increase arrives piece by piece from out of frame, quintic ease-out, a yaw that unwinds, 8–16 pieces per second (demo: 52 plates, one per 1/10 beat at 96 BPM), counter rolling with landings.
- Single heavy object: falls with gravity, one small damped bounce, shadow tightens (demo puck: five small settling ticks).
- Readings fade in with a 16 px rise and draw their leader; leave by fading, never sliding.
- Never moves: the base, a landed piece, the ruler pieces.
- Camera vocabulary: macro dolly along a stack edge with rack focus (the unit is countable); low lateral track (time/growth); locked three-quarter on two subjects (comparison); crane with the rising top (accumulation); pull-back to near top view, demo ~70° (the whole as object); slow orbit (title, breath).
### Transitions and rhythm
- One continuous take inside one set where possible; transitions are camera moves; no cuts to a chart, no wipes, no page turns.
- Demo: 39.4 s single take, 96 BPM, 4/4, D major, a bar = 2.5 s; comparisons held ~2.7–2.8 s before a verdict.
- Accelerate by subdivision (8ths → 16ths), not tempo. A 0.3–0.6 s suck-out (music and foley −30 dB) before each designed impact; only 2–3 designed impacts, the loudest moments.
### Finish
- PBR, HDRI at low intensity for reflections only (demo `photo_studio_loft_hall` at 0.8), warm key 20–35° with long soft shadows (4096 shadow map), one or two cool rims, GTAO, physical depth of field, 2× supersampling, light vignette.
- Grain light (pale background), no lens flares, no chromatic aberration, nothing glows.
### 3D look (if any)
Studio still-life of data: instanced plates in brushed metal, tinted acrylic (roughness ≥ 0.2, tinted attenuation to avoid transmission streaks), brass ruler pieces, on a real-texture slab (wood veneer, stone) with inlaid typography, on a seamless sweep with fog. Shallow DoF, long shadows, cool rims to keep metal from going brown at distance.
### Banned
No icons or flat colour coding (not Isometric Infographic); not a product render; no paper chart or inked axes (not Data Storytelling); no black stage or neon (not Dark Tech Keynote); no toy proportions or characters (not Brick Toy); data never scales or morphs, it grows by placed pieces; no glow, outlines or fake UI; no rainbow palettes, colour ramps or dark mode; readings never slide out; counters never roll by time; never invent or round user numbers into a better story; never let generated images stand in for real data; no lens flares, no chromatic aberration; rounding never more than one unit (and say so when two values are within one unit).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/data-physical.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/data-physical/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/data-physical/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/data-physical.mp4 (style frame at 28.6 s, poster at 37.8 s)
### Gaps
No vertical-frame layout; letter spacing and case not given; base colour only as a texture; exact easing curve for the cascade (beyond "ease-out") and camera key values live in `demo/film.js`, not in the docs; no guidance for more than two series.

## Exploded Teardown
- Source: `lemomo-ai/lemo-opuscar` `styles/teardown/STYLE.md`, `DEMO.md`, `style.json` (No. 60, Evidence Films); licence: MIT (docs), demo film/stills CC BY 4.0. Demo geometry from the open-source Corne v4 keyboard (foostan/crkbd, CC BY 4.0 / MIT), flagged as unofficial and not endorsed; the STEP importer `occt-import-js` is LGPL-2.1 (not in the library, installed per project). Hardware under CERN-OHL, CC BY-SA, GPL or "no known restrictions" needs the user's explicit OK.
- One line: a real product rebuilt from its own engineering files, lit like a studio packshot, lifted apart layer by layer on one axis while the camera orbits and dives between layers, every part labelled with sourced numbers, then closed again with dimension lines.
- Suits: hardware launches, product pages, spec explainers, "what's inside" stories. Real footage: no. Real data: **yes**, the product's CAD/STEP/IGES, KiCad layout, BOM, spec sheet or datasheets (open-hardware sources: GitHub/GitLab, OSHWA list, Hackaday.io, Printables/Thingiverse); without files only published dimensions, said on screen to be a model; `FACTS.md` required. 3D: **yes** (three.js r170 PBR, DoF, AO, bloom; Python KiCad extractor; STEP → mesh via occt-import-js). AI images: no, never for a real part.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ground (gradient top) | `#34363a` | dark graphite seamless sweep, screen-space radial gradient |
| ground (gradient edge) | `#0d0e10` | outer end of the sweep gradient |
| ink | `#f1efe9` | warm white: names at full, specs at ~60 % |
| accent | `#ff6b3d` | measured things only: label indices, dimension lines, plus one matching product detail (the 1.5u key, switch stems) |
| keycap off-white | `#d9d4c9` | demo product colour |
| keycap grey | `#686c73` | outer column and thumb keys (demo) |
| other product colours | not given as hex | green mask, gold pads, brass spacers, black FR-4 plate (demo) |
Rule: the product brings its colours and must be the brightest, most saturated thing; frame neutral and dark; value order ground < product < labels; black plastics lifted to dark grey.
### Typography
- Part names: clean medium-weight sans in the film's script, 28–32 px (frame 1920×1080); demo Noto Sans SC 500 (Google Font).
- Specs and numbers: monospace, 15–22 px; demo JetBrains Mono (Google Font).
- Latin running text: neutral grotesque, Inter (Google Font); end-card subtitle in Inter Light.
- Letter spacing, case: not given (end card uses an all-caps line `产品拆解 · EXPLODED TEARDOWN`).
- Label structure fixed: two-digit index in the accent, then the name, then one spec line; units always written (mm, MB, ×n); at most one fact per label that the voice does not say.
- Dimension text on a small dark plate, follows the line's angle, never upside down.
- Subtitles: centred bottom strip, soft shadow, no box; bilingual = film language on top; single-line width checked with the real font (demo widest 552 px vs 1500 px limit). Hold ≥ max(1.8 s, speech + 0.6 s); labels fully in frame for CJK ÷ 4.5 + other ÷ 15 + 1.5 s.
### Layout
- Subject fills ≥ 1/3 of frame height at key moments.
- Labels in a column on the free side; the object is shifted with a camera view offset rather than moved (demo model slides left with view offset 170 px; end card uses −230 px). The label column's x never moves.
- Subtitles in the bottom 12 %.
- End card on the left, product drifting on the right (demo).
- Density: one fact per label, about six labels in the overview (demo).
### Elements
- Leader lines from an anchor dot on the part, projected from 3D points every frame.
- Dimension lines with ticks drawn in the scene's own perspective (key pitch 19.05 mm etc. in demo), never a spec table beside the object.
- Accent-coloured two-digit label indices.
- Boards painted from layout files at 14–20 px per mm (copper, traces, vias, pads, drills, silkscreen, both sides) with roughness/metalness/bump from the same drawing; components at footprint positions.
- No step numbers, arrows or hands (not an assembly manual); no brand marks on chip tops or connectors.
### Motion
- 24 fps on ones, smooth and deterministic.
- Separation: ease-in-out cubed (smooth start, fast middle, long settle); layers leave top first, 0.15–0.2 s apart; repeated parts (keys, screws) fan out in a wave ordered by distance from a corner.
- Closing: bottom first, quicker, about 1 s per layer; the last layer lands with real mechanical response (a key travels its stroke and returns; demo stroke 4 mm); no rubbery bounce unless it is rubber.
- Held apart: layers float 1–2 mm with offset phases; during macro shots they hold perfectly still.
- Labels: anchor dot, leader grows, text slides 10 px; they fade out before parts move again.
- Never moves: the floor, the light rig relative to the camera, the label column x.
- Camera: one or a few continuous moves, never stops travelling; keys in the product's own coordinates, interpolated with monotone cubic (no Catmull-Rom overshoot). Vocabulary: orbit while layers separate; grazing macro dolly (demo eye 33 mm above floor, lens 30°); dive between layers (demo 452 mm → 30 mm); slow push on one still part; rise through the stack; fast pull back; high three-quarter drift (demo az 20° → 40°).
### Transitions and rhythm
- Transitions are camera moves through the object; no cuts to black, no slide transitions, no split screens.
- Demo: one continuous camera, 38.75 s, 96 BPM, bar 2.5 s; every hit on a beat or half-beat of `timeline.js`; macro stops last ~3 s.
- At least two near-silences (room tone only) before big separations or the turn back (demo 4.4–5.0 s and 24.6–25.0 s); the first sound after each is the key hit.
### Finish
- Real-time PBR (`MeshPhysicalMaterial`) at 2× then downsampled; ambient occlusion; one-aperture depth of field where blur follows 1/focus − 1/z (grows in macro); high-threshold bloom for emitters only; vignette.
- Materials: plastics roughness 0.55–0.7 with soft sheen; boards with thin clearcoat and raised lighter traces; metallic pads; tight highlights on machined metal; matte rubber; minimal-example aluminium metalness 1, roughness .35.
- Light: warm key from above front, cool rectangular rim behind that follows the camera, soft top light, low HDRI for reflections, practical fill only inside. Light sweeps at a fraction of the key; bloom threshold above the brightest diffuse surface.
- Grain: not given.
### 3D look (if any)
Studio packshot of a real, exact product exploded on one axis with even gaps, each layer still oriented as installed, on a dark graphite seamless; floor visible only as soft contact shadow; emitters (LEDs) can switch on inside while apart.
### Banned
Not a glass product render (no single-object beauty without disassembly); not a blueprint (no line drawing on a grid); not a keynote (no slides, headline type or stage); not an assembly manual (no step numbers, arrows, hands); no eyeballed or invented numbers; no mixed revisions; no spec tables beside the object; no text on busy bright parts without a dark backing; no cuts to black, slide transitions or split screens; no overshooting camera splines; no trademarks on parts unless it is the user's product; no generated images standing in for real parts; no crushed blacks; no rubbery bounce on rigid parts.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/teardown.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/teardown/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/teardown/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/teardown.mp4 (signature frame 9.75 s)
### Gaps
No vertical-frame layout; letter spacing not given; no grain value; exact DoF aperture, bloom threshold and light intensities are in `demo/src/main.js`, not the docs; layer gap distances only as demo examples (30 mm, 16 mm extra lifts).

## Microscope Story
- Source: `lemomo-ai/lemo-opuscar` `styles/microscope/STYLE.md`, `DEMO.md`, `style.json` (No. 61, Evidence Films); licence: MIT (docs), demo film/stills CC BY 4.0. Demo specimen: one public whole-slide scan, Ventana-1.bif (PathAI, CC0). Most web microscopy is CC BY-NC or all rights reserved and is unusable; CC BY-SA/ODbL/"no known restrictions" need the user's OK.
- One line: one continuous log-zoom dive through a real whole-slide scan, from the glass slide on a graphite bench down to a single cell, with focus that breathes at each magnification change and every scale bar and reading measured from the file.
- Suits: biomedicine, materials science, skincare/cosmetics science, coatings, anything "zoom into the real thing and measure". Real footage: no, but **real imagery and real data required**: a real micrograph or whole-slide image (WSI) pyramid with pixel size in its metadata (sources: OpenSlide test data, NCI Imaging Data Commons, Cell Image Library, Wellcome Collection, Wikimedia Commons, NIH/CDC PHIL/NASA/USGS; or the user's SVS/NDPI/MRXS/SEM TIFFs). Extra packages: `tifffile` + `imagecodecs` (BIF, SVS, NDPI, pyramidal TIFF), or `openslide-python` + OpenSlide for MRXS/SCN/VMS. `FACTS.md` required; describe measurements, never diagnose. 3D: no (2D canvas with a similarity-transform camera). AI images: no, forbidden.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| glass | `#F4F1EC` | slide photo and scan normalised to this warm white |
| bench (dark) | `#0B0D0F` | graphite bench, gradient end |
| bench (light) | `#2A3036` | graphite bench, gradient under the light pool |
| ink | `#181B1F` | type on glass (near-black) |
| frosted panel | `rgba(12,14,17,0.74)` = `#0C0E11` @ 74 % | readings, instruments, subtitles, credit; 1 px light rim |
| accent on stain | `rgb(120,240,205)` = `#78F0CD` (mint) | measured reading, counted pixels, rings, scan front |
| accent on glass | `rgb(0,122,99)` = `#007A63` | same accent where it sits on white glass |
| stain | not a fixed hex: the specimen's true colour | e.g. trichrome red and blue, H&E pink and purple |
Rule: the stain is evidence and keeps its true colour; one accent, cool and away from the stain's hues (mint against red/blue, amber against green/purple), only for the measured reading and counted pixels; type on stain sits on a frosted panel in warm white.
### Typography
- Readings and scale bar: light condensed grotesk, 40–72 px at 1080p; demo Barlow Condensed (Google Font).
- Instruments and pixel counts: monospace, 20 px; demo IBM Plex Mono (Google Font).
- Labels: sans in the film's language, 20–34 px; demo Noto Sans SC (Google Font).
- Title only: serif; demo Noto Serif SC 600 (Google Font).
- Letter spacing: not given. Case: end card has an all-caps line `MICROSCOPE STORY · 显微叙事`.
- Emphasis: the number large in the accent, a small label above it, the method or raw counts below; each new magnification flashed large once.
- Subtitles: frosted strip at bottom centre; bilingual one line per language, film language on top, never wrapped; long lines split into two cues (demo widest 642 px vs 960 px limit). Nothing below 20 px at 1080p. Labels hold ≥ characters ÷ 4.5 + 1.5 s (CJK); rolling readings reported by landing value.
### Layout
- Measured structure fills ≥ 1/3 of frame height at key moments.
- Instruments in one frosted panel in a corner (scale bar + value, field of view, magnification with a small nosepiece glyph); the source credit in a small panel in the opposite corner; readings in a frosted panel beside their mark, joined by a leader; subtitles bottom centre.
- One reading per screen.
- End card: title written in ink on the empty cover glass, tissue fleck to the right (demo).
### Elements
- Marks in screen space, anchored to the specimen through one world → screen function: hairlines 1.5–2.5 px with a dark or light halo; circles drawn on as arcs with cardinal ticks; dimension lines with end ticks; leader lines with one elbow; caliper ticks on a ring.
- Counted pixels shown as a mask revealed behind a scan front, then kept as a faint trace.
- Scale bar in a 1-2-5 sequence that shortens and jumps; rolling field-of-view readout; magnification steps (1.25×, 2.5×, 5×, 10×, 20×, 40× in demo).
- Frosted panels: dark translucent glass over a blurred copy of the frame, 1 px light rim.
- Image treatment: the specimen is a photograph, never drawn, retouched or generated; manufacturer logos on the slide filled with surrounding frosted glass; barcodes and IDs stay.
### Motion
- Camera = similarity transform (zoom, roll, position) interpolated as a log spiral between keys (M^u about the fixed point of the two frames), so each push is a true dive to one point with roll included. Moves eased; 2–5 % creep during holds; never a frozen frame longer than 1 s.
- Plate selection: draw the finest pyramid plate downsampled no more than ~1.45×, blend the next level between 2.2× and 1.45×; coarse levels alpha-feathered at the scan edge (demo 0.3 mm feather). Upsampling beyond ~1.6× shows as mush: end the dive at the scan's real resolution.
- Focus grammar: rack-in from soft at the start (demo 0–0.95 s); a short "breath" (blur + slight field change) at every magnification change, with a turret click; a focal-plane sweep (tilted sharp front crossing a softened frame) when the camera lands.
- Marks arrive by being made: a dimension line grows from its centre; a circle is drawn as an arc; a scan front counts pixels while the reading rolls (demo ~1.5 s); the reading lands with a small spring (constants not given).
- Never moves: the specimen under its marks, the instrument positions.
- Camera vocabulary: the dive (demo ×7, ×3.2, ×11 with roll); locked frame with slow creep; truck at one magnification (demo 1.41 mm at 10×); pull back to frame two marks; focal-plane sweep; the climb (reverse dive, scale bar jumping back; demo pull ×145 in ~2.7 s).
### Transitions and rhythm
- One continuous take; transitions are scale changes, trucks and focus, never cuts or crossfades between samples. Different samples never zoom into each other; if sources must be joined, cut on a focus breath and say so.
- Magnification changes happen only where the pyramid level on screen really changes.
- Demo: 39.5 s, 90 BPM, 4/4, every designed hit on the grid (cuecheck 0 ms); each reading held ≥ 2.5 s before a verdict; silences before the verdict and before the climb (demo 0.37–0.87 s).
### Finish
- One grade for every plate: glass normalised to warm white, a little density and chroma in the stain, nothing else; no false colour, no film emulation.
- Focus blur: screen-space Gaussian on a frame rendered with a margin so edges never darken.
- Light illumination vignette only; slow pool of light drifting over the bench; soft shadow under the slide.
- Grain: not given.
### 3D look (if any)
None (2D plates under a 2D log-spiral camera).
### Banned
No grey grade (not Satellite Briefing); no glowing wireframes or crosshairs (not Sci-fi HUD); no chart paper (not Data Storytelling); no slides or header bars (not a keynote); nothing drawn, retouched or generated on the specimen; no false colour, no film emulation; no diagnosis or clinical scores, only the measured region and stated threshold; no NC, journal-figure or AI images; no zooming from one sample into a different sample; no upsampling past ~1.6×; no visible tile seams; no manufacturer logos; never wrap a subtitle line; no frozen frame longer than 1 s; no text that switches colour mid-shot.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/microscope.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microscope/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microscope/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/microscope.mp4 (frame at 24.6 s)
### Gaps
No vertical-frame layout; letter spacing and the landing spring constants not given; blur radii for the focus breath and sweep are in `demo/film.js`, not the docs; grain not mentioned; only one demo accent pair.

## Archive Light Table
- Source: `lemomo-ai/lemo-opuscar` `styles/archive-lighttable/STYLE.md`, `DEMO.md`, `style.json` (No. 62, Evidence Films); licence: MIT (docs), demo film/stills CC BY 4.0. Demo objects: five public-domain Library of Congress scans (Wright brothers, 1903), flagged as an unofficial film. Europeana items need a per-item rights check; "no known restrictions" and CC BY-SA are not CC0 and need the user's OK.
- One line: real archive objects (glass negatives, telegrams, clippings) on a cool backlit light table; a loupe lands on one and inside the lens it changes state (negative turns positive, a line lights up, a photo opens into depth), with catalogue numbers and readings pinned on. Clean and modern, no vintage filter.
- Suits: brand/company history, archive stories, museums, "the record says otherwise" fact-checks. Real footage: no. **Archive material required**: real scans at true proportions with their catalogue records (Library of Congress `tile.loc.gov` files + SRU server `lx2.loc.gov:210/lcdb` records, Smithsonian Open Access CC0, Rijksmuseum CC0, NARA, Europeana; or the user's own scans and archive numbers); `FACTS.md` required. No extra packages beyond core + voice/music tiers; sample libraries salamander (piano), vsco2ce (strings), vcsl (glass, bowed vibraphone). 3D: no (WebGL2 2D shader with a 2.5D parallax "photograph space"). AI images: no, forbidden.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| light table | `#F7F9FB` | emissive near-white, slightly cool (≈ 0.97 white) |
| desk | `#0E0F11` | dark desk beyond the aluminium frame |
| ink | `#15171A` | text on light areas |
| signal | `#FF5A1F` | marks, readings, anchors, the verdict strike, subtitle edge, end-card rule |
| caption plates | `rgba(14,15,17,0.74)` = `#0E0F11` @ 74 % | readings and subtitles, paper-white text |
| negative tint | not given as hex | warm silver-gelatin tint on glass negatives |
| table frame | not given (brushed aluminium) | |
Rule: neutral ground of the table plus the archive's own silver greys and paper tans; never regrade the archive into a scheme; one signal colour, never as a fill behind pictures or decoration; never colour on colour.
### Typography
- Identifiers, dates, readings: monospace, e.g. IBM Plex Mono (Google Font), 17–34 px; readings 74–120 px (frame 1920×1080).
- Labels in the film's language: sans, e.g. Noto Sans SC or Inter (both Google Fonts), 21–36 px.
- Titles and the one name a photograph carries: serif only, 60–76 px; demo end card Noto Serif SC (Google Font).
- Letter spacing: not given. Case: end card line `ARCHIVE LIGHT TABLE` in caps.
- Emphasis: a lit line of type (rest of the paper dims) + drawn underline + ring around the number, which lifts out into a reading card; quote the source (a crop of the actual line, or the record's wording in quotation marks) rather than paraphrase.
- Subtitles: caption strip bottom centre on a dark plate with a 3 px signal-coloured edge; bilingual = film language on top; hold ≥ max(1.8 s, speech + 0.6 s); single-line widths checked with real fonts (demo widest 648 px vs 1500 px).
### Layout
- At a reading moment the subject fills ≥ 1/3 of frame height; readings and labels stay clear of the subtitle strip (bottom 140 px).
- Labels attach to objects: anchor dot and ring, vertical leader, then text; a reading sits in a dark caption plate with a small label above and the source (catalogue number or original wording) below.
- Objects laid close together on the table so the loupe never sweeps over empty table; true scale (demo 5000 world units = 7 in).
- Crop corners preview the 16:9 frame a photograph will open to.
- End card bottom left over the pulled-back table, archive index on the right (demo).
### Elements
- The loupe: ≈ 2.5× magnification, pincushion term k ≈ 0.16 at the rim, slightly different per RGB channel for colour fringes; black ring with bevel highlight; clear acrylic skirt that refracts the table and glows at its foot; soft shadow (demo lens radius 1000 world units ≈ 1.4 in).
- Marks on a 2D canvas above the picture: hairlines 1.5–3 px, rings, crop corners, underlines, leaders; table marks clipped out under the loupe; marks inside a photograph follow its forward mapping including parallax.
- Perspective ruler on a photo's ground plane, ticks crowding toward the horizon (demo every 100 ft, labels 100/200/400), labelled "schematic" when it is one.
- Two caption cards side by side, each with a crop of its source; one struck in the signal colour.
- Archive index panel: every object's tag flies into one list with identifier and reading.
- Image treatment: real scans with real damage (broken corners, emulsion edges, folds, pencil marks); nothing drawn or generated. Glass negatives: transmission `T = 0.035 + 0.9 · (1 − pos)^1.25` with an emulsion mask from the scan, so broken corners show the table; paper is backlit (paper tone × light), lit lines get darker ink and brighter paper; positives may be gently levelled.
### Motion
- 24 fps on ones; every camera parameter on smooth monotone curves through keys, no overshoot, no stepping. Camera = 2D centre, zoom and roll through one world → screen function.
- Camera glides, slows to let the loupe land, then pushes; speed lives in glides and pushes, holds are for reading.
- Loupe lands with a fast ease-out (≈ 0.4 s) and lifts the same way, scaling ≈ 1.35× → 1 with its shadow tightening; drop it straight onto the object, never slide it in.
- Push into the lens: rim grows past the frame while the view inside widens (demo zoom 0.31 → 1.5; signature push 0.335 → 1.45 over 2 s).
- Lines draw on in 0.3–0.6 s; text wipes in from its leader side; numbers count up and land with the voice.
- Develop front: spreads from the lens centre with a thin warm edge, negative → positive only inside the lens (demo 0.8 s).
- Photograph space (2.5D): ground-plane nearness map (zero at horizon, linear below), cut-out layers for upright subjects, filled background; dolly + lateral shift drive parallax (demo dolly 0.55, shift (260, −140) px, subject layer drifts 125 px); keep moves small so the fill is barely seen.
- Light table switch-on flicker (demo on at 0.0, 0.17, 0.42, 0.55 s, steady at 0.67 s); off state ambient ≈ 0.04.
- Never moves: the archive content outside a photograph space, the table itself.
- Camera vocabulary: table glide (pan + roll, demo 4° roll that levels the object); loupe landing + push; tracking along a line inside the lens; photograph-space dolly + parallax; rise out of the lens; pull back to the whole table (demo zoom 0.094).
### Transitions and rhythm
- One continuous camera over one table; transitions only by the loupe (land, push, rise, lift) and the glide; no cuts, fades to black or page turns between objects.
- Demo: 40.0 s, 90 BPM, 4/4, every key action on a beat or half-beat; two "breaths" (sound sucked out) placed just before their downbeats; comparison held still 2.67 s before the verdict; no narration during the signature push, the chord lands, narration starts 0.35 s later.
- Build by subdivision and register, not drums; real silences before a reveal or verdict; the first sound after is the loupe, the place or the verdict.
### Finish
- Light vignette; fine moving grain, heavier inside photographs (amount not given).
- Light table: emissive, soft falloff, diffuser noise; procedural dust and scratches anchored to the table.
- Explicit-gradient texture sampling (`textureGrad`) inside the lens branches to avoid dashed mip seams.
- No film damage, no sepia, no halftone, no paper-ageing overlay.
### 3D look (if any)
None in the 3D-render sense; a 2.5D layered parallax inside photographs (depth map + cut-out subject layers + fill).
### Banned
No newsprint dots or aged-paper grade (not Halftone Dossier); not the ground from orbit (not Satellite Briefing); no charts, numbers live on the objects (not Data Storytelling); no slides or header bars (not a keynote); no vintage filter, sepia, halftone, film damage or ageing overlays; never regrade the archive into a colour scheme; signal colour never as fill or decoration; no colour-on-colour text; no generated images for archive objects; no cuts, fades to black or page turns; no over-magnifying weak scans (keep under ~1.5 screen px per scan px); no loupe sliding over empty table; no single depth map tearing people apart; no labels that scroll out before they are read.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/archive-lighttable.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/archive-lighttable/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/archive-lighttable/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/archive-lighttable.mp4 (frame at 22.3 s)
### Gaps
No vertical-frame layout; letter spacing, grain amount and vignette strength not given; the warm negative tint and frame colours have no hex; the loupe's ease curve is only "fast ease-out"; shader details live in `demo/film.js`.

<!-- category: Hand-drawn & Painting -->

## Crayon Picture Book
- Source: `lemomo-ai/lemo-opuscar` `styles/crayon-book/STYLE.md`, `DEMO.md`, `style.json` (No. 01, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a picture-book page drawn live in wax crayon on toothy paper, every line boiling, with one watercolour wash that reveals what white crayon was hiding.
- Suits: picture books, bedtime stories, kids' learning, gentle explainers, thank-you/year-in-review cards, "hidden feature" reveals. Real footage: no. 3D: no. AI images: no (all procedural: WebGL2 compositor + stroke engine).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#f4efe3` | warm off-white page (STYLE.md says "around" this; DEMO uses it exactly) |
| ink / indigo | `#2d3263` | every outline, subtitles (outlines never black) |
| yellow | `#f5c63c` | demo crayon (moon, eyelid scribbles) |
| orange | `#ec8a3c` | demo crayon |
| red | `#d4483c` | demo crayon (tree dots) |
| pink | `#ee8ea4` | demo crayon (cheeks, blush scribble) |
| peach | `#f4c7a4` | demo crayon (skin) |
| brown | `#7a4b31` | demo crayon |
| ochre | `#e7b867` | demo crayon |
| green | `#62a24c` | demo crayon (grass) |
| sky | `#79acd9` | demo crayon |
| violet | `#6a5aa6` | demo crayon (quilt) |
| white wax | `#fbfaf4` | wax resist: invisible until the wash passes (250 stars in the demo) |
| watercolour (ultramarine) | not given as hex; transmission `(0.15, 0.19, 0.44)` | the one wash, multiplied over the page |
Rules: a box of about a dozen crayons, never more; outlines in one dark colour (indigo, dark brown or plum), never black; one white crayon reserved for resist; at most one watercolour per film, chosen for what it reveals (ultramarine = night, rose = dawn, sap green = rain), and it never paints characters; value comes from pressure, not extra hues. Example boxes (STYLE.md): seaside = navy line, coral, sand, teal, turquoise, lemon, white; orchard = brown line, russet, apple red, mustard, olive, plum, cream, white (no hexes).
### Typography
- Subtitles: Patrick Hand (Google Font), 50–56 px (demo 54 px) at 1920×1080, in the outline colour, bottom-centre; each glyph tilted and offset, boiling on twos, written left→right in ~0.35 s, sitting on a ragged knock-out patch of blank paper (never a dark box). Hold ≥ max(1.8 s, speech + 0.6 s); no subtitles during wordless music.
- Titles: hand-lettered on the page in Gaegu Bold (Google Font) "or similar", written letter by letter; demo title in two lines in a corner; size not given.
- Case / letter spacing: not given. Emphasis: not typographic; colouring and the wash carry emphasis.
- Words on screen: the narration is "the words printed on the page"; demo 6–8 short lines in 52 s.
- Text can't fade: it leaves by the camera moving off it, a page turn, or being coloured over. Text placed where the wash passes survives it (wax resists).
### Layout
- One large page as the world (demo world 3200×1800; full page = camera scale 0.6); one continuous camera over it.
- Key figures ≥ 1/4 of frame height in close shots; keep bare paper at the bottom for the printed words.
- Lots of bare paper; child perspective (gable front + slanted side wall; people bigger than doors).
- Margins/grid: not given.
### Elements
- Crayon strokes: ribbons with a low-frequency hand wobble (1–2 px; demo ~1.7 px), width ±15 %, tapered ends, a denser core and 1–2 thin streaks. Outline widths (demo): ~7 px characters, 8 px buildings, 4–5 px refined "adult" objects (about half).
- Colouring: zig-zag back-and-forth hatching with a visible gap (demo gap ~10.5 px, width ~11 px), pressure varied per pass (0.72–1.14×), overshooting the outline 0–7 px; a lighter cross-hatch pass at 40–50 % on big areas.
- Characters: a skilled adult imitating a child: round head, ≈2.5 heads tall (demo girl 2.6), dot eyes with a white-wax catchlight, pink cheeks, tube limbs, mitten hands, bold hair shapes; objects with faces get big eyes and eyelids. Outline hair masses only on their outer edge.
- Occlusion: front parts erase what's behind inside their outline; characters "keep the paper white" (knock-out restores paper and resets wax).
- Model sheets drawn first (`sheet.js`, `?test=model&page=…`).
- Pull-back to a physical book on a table with crayons beside it; page turn.
### Motion
- Everything drawn steps at 12 fps (lines, colouring, characters, boil seed); camera, the wash's leading edge and twinkles at 24 fps.
- Boil: each stroke re-jitters every 2 frames (offset < 1 px; demo offset ±0.8 px, wobble ±0.9 px). Characters full amplitude, background lines ×0.6, background colouring still. Calm to ~×0.5 when the film goes quiet.
- Drawing on: lines reveal along their length in 0.4–0.9 s; colouring row by row; text letter by letter.
- Acting: substitution (a new drawing per pose, on the beat); two key drawings alternate for a repeated action (climbing: two drawings per rung); big simple poses, no in-betweens. Demo comic toss = scrunched face rotated 35° on the beat.
- Colouring is an action: scribbled coat = putting it on; pink scribble = blush; wash = night falling; eyelids come down as yellow scribbles.
- Camera vocabulary: locked full page (paper before drawing), push toward a character (title gives way), locked medium close-up (substitution comedy), tilt along a gaze, tight follow (world draws itself ahead of the subject), held wide while the brush moves (wash reveal), slow truck across the page (reading left to right), pull out past the page edge (page becomes an object), page turn (new chapter).
- Easing curves / spring values: not given.
### Transitions and rhythm
- Transitions: drawing on, colouring over, the wash, a pan or a page turn; never a dissolve. Page turn built from strips each with its own affine transform (rectangle strips show a staircase).
- Rhythm: music-led; demo 3/4 at 72 BPM (bar = 2.5 s), 52 s, one take. Silence as a beat: a full beat of nothing after a failure; a 0.3 s breath before the song. The full theme heard exactly once, at the wash; ends with a music box winding down (ritardando + pitch droop).
### Finish
- Paper tooth anchored to the page (pans with the camera; on zoom two octaves cross-fade so grains stay ~1 px on screen): three octaves of value noise (demo 1.35 / 2.9 / 6.3 px) plus a horizontal fibre term (x/10, y/1.9), contrast `smoothstep(.16,.86)`.
- Wax adhesion shader: each crayon layer is a canvas with RGB = colour, A = pressure; wax deposits where `tooth > 1 − k·pressure` (demo k = 1.22, soft edge ±0.07); darkening ×(1 − 0.1·p²). Light pressure = speckled peaks, heavy = near solid.
- Watercolour: a separate density canvas multiplied over the page; pigment pools at edges (density minus blurred density), granulates in the deepest pits, blooms with noise, resisted by wax: density × (1 − 0.93·smoothstep(.12,.55, waxCoverage)). Brush = wide bands with bristle streaks (α ≤ 0.12) and a darker wet leading edge while moving; bands overlap.
- Final emboss pass lit top-left (demo strength ~0.55), less where wax filled the tooth; mottling ±2 %; warm vignette; desk "lamp" pass for the book shot.
- No ffmpeg grain (the paper is the grain); demo encoded CRF 26 (190 MB → 74 MB after anchoring the tooth and not boiling background fills).
### 3D look (if any)
None.
### Banned
Not "cute vector art with a crayon filter" (the look must come from material physics); not a whiteboard explainer (no marker, no hand), not a watercolour painting (the wash is a guest), not a chalkboard; never black outlines; never more than ~12 crayons or more than one watercolour; wash never paints characters; never a dark subtitle box; never fade crayon or titles; never a dissolve; no strings or grand piano; no famous picture-book phrases; never copy *The Snowman*'s characters, song or imagery, or name it; screen-fixed paper tooth; light-pressure colour under a wash (goes muddy: use pressure ≥ 0.8 or cross-hatch).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/crayon-book.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/crayon-book/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/crayon-book/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/crayon-book.mp4 (*The Moon Can't Sleep*, 52 s; style frame at 43.68 s)
### Gaps
No vertical layout; title size not given; easing curves for camera moves not given; no hex for the watercolour pigment (only a transmission triple); example crayon boxes in STYLE.md have names only.

## Watercolor Field Journal (lib: Watercolor Brush)
- Source: `lemomo-ai/lemo-opuscar` `styles/watercolor/STYLE.md`, `DEMO.md`, `style.json` (No. 02, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0 (demo music: Scott Buckley *Wildflowers*, CC BY 4.0)
- One line: a naturalist's field-journal page that paints itself: translucent brush strokes with dry-brush flying white on warm fibrous paper, hand-written notes and leader lines beside each specimen, no vector lines.
- Suits: nature/geography documentaries, transects and gradients (rainfall, altitude, depth), process and recipe sheets, specimen-and-label explainers, maps changing through time. Real footage: no. Real data: optional but encouraged ("numbers are real", palette can carry data). 3D: no. AI images: no (procedural Canvas2D stroke engine).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#f1e9da` | base of the pre-generated paper image; also the mist eraser |
| ink | `#2b2520` | lines, text, trunk edges (`INK`) |
| ink 2 | `#3d3129` | branches, stems (`INK2`) |
| accent: vermilion sun | `#cf4f2c` with 7 dry-brush bars `#b8401f` | the "stamped" sun that reads as a seal |
| accent: rain blue | `#3f7fa8` | raindrops, gauge fill |
| burnt sprite | `#2a2320` | trees after the fire |
| zone: desert | sky `#f0d6b8`, far hills `#dcae8e`, mid `#dba47e`, ground `#dda27a` | blended by camera position |
| zone: mulga | `#efdcc6`, `#c89b8c`, `#d0ae80`, `#dbb584` | same order |
| zone: woodland | `#ece2cd`, `#bdb99c`, `#cbc28f`, `#dccb92` | same order |
| zone: wet forest | `#dfe3dc`, `#9fb1b8`, `#98aa8a`, `#a7b48e` | same order |
| zone: rainforest | `#dbe3d8`, `#9ab19f`, `#6f8d6d`, `#6e8b69` | same order |
| map ramp | 150 mm `#cf7c4f` → 300 `#cda35f` → 650 `#b3b07a` → 1150 `#7f9a6c` → 2000 `#46705a` → 4000 `#2f5a45` | rainfall map, quantised into 5 bands |
| example (STYLE.md): harbour at dawn | sky `#f3e2c8`, water `#9fb4c4`, hulls `#5f7486`, accent `#c8442a` | example only |
| example (STYLE.md): vegetable garden | soil light `#e8e0c0`, leaves `#8ea860`, shade `#4e6e3c`, accent `#d9632e` | example only |
Rules: paper is the white (never paint pure white); darker = more passes, not darker pigment; 3–5 hues per scene plus ink; ink only for lines, text, edges, stems; one accent reserved for one recurring element; colour may carry data or mood, blended by position or time; map ramps quantised into 4–6 bands (continuous ramps "read as software").
### Typography
- Titles and subtitles: Cormorant Garamond (Google Font). Demo sizes at 1920×1080: film title italic 124 px; biome titles weight 500, 52 px; subtitles italic 500, 36 px; map year 150 px, "today" italic 104 px; gauge value 54 px; end-card sign-off italic 30 px.
- Hand notes: Caveat 500/600 (Google Font), 26–42 px, drawn twice over a paper-coloured 12 px shadow halo, revealed left to right like writing, with a pen leader line that grows to its specimen.
- Measured labels: IBM Plex Mono 400 (Google Font), wide tracking (3 px letter-spacing), e.g. `ANNUAL RAINFALL`, `01 / 05`; credits 15 px.
- Chinese: Noto Serif SC 400 (Google Font), subset to the characters used; second-language subtitle line at ~2/3 size (demo 24 px).
- Subtitles on the paper, not in a box: centred at the bottom, max 2 balanced lines (auto-wrapped at 1400 px, baseline 1000 or 962/1000; Chinese at y 1042), ink at ~78 % over an 18 px paper-coloured halo, drawn twice for density; visible from start − 0.15 s to start + dur + 0.45 s with 0.25/0.35 s fades. Hold ≥ max(1.8 s, speech + 0.6 s).
- Case: spaced caps for the subtitle under the title and for mono labels; otherwise sentence case. Numbers spelled out in TTS, digits on screen.
- Emphasis: the one accent colour and the hand note; no bold styling given.
### Layout
- Generous paper margins; one hero subject per view with its note; labels never cover the subject.
- HUD corners (demo): biome card top-left (painted swatch, `01 / 05` mono, name 52 px, italic subtitle); gauge top-right (`ANNUAL RAINFALL`, value 54 px, a log-scale bar 100–4,000 mm with a blue drop marker).
- Depth by parallax layers (demo `LAY`): far (parallax 0.25, ground y 640, scale 0.38, alpha 0.5), mid (0.55, y 690, 0.62, 0.78), main (1.0, y 745, 1.0, 1.0), foreground (1.55, y 1115, 1.75, 0.95); clouds at 0.2; paper-coloured mist bands between layers. Farther = smaller, lighter, less saturated.
- Grid: not given.
### Elements
- Brush strokes only (no vector outlines); a darker edge stroke along a form (`edgeOf`) is the only "line".
- Hand-written labels with pen leader lines; a small measured value; mono labels; a painted swatch; a log-scale gauge bar; a dimension line ("≈ 100 m") drawn during a tilt.
- A painted map (equirectangular, cos 26° correction, 24 px/°) with quantised fills and a drawn "our walk" arrow.
- A vermilion "seal" sun stamped in 1.6 s.
### Motion
- Painting-in is the main motion: an object's progress is a function of its screen position or a cue. Demo: progress = (REV(t) − screenX) / (span × max(.55, parallax)); after the reveal, things entering from the right paint in over ~380 px of travel. A stroke list draws in order, each stroke taking clamp(4/N, .12, .5) of the progress, so structure (trunk) comes before detail (leaves).
- Burst: a whole group paints in at once (≤ 1 s; demo 0.9 s) for a peak.
- Sway only after an object is finished: horizontal skew = sway × (sin(1.15t + φ) + 0.4 sin(2.7t + 2φ)); sway 0.006 for trees, 0.01–0.03 for grass and ferns.
- Brush-edge wipes: a vertical wavy clip reveals a whole scene; horizon by stroke progress left to right; labels by a left-to-right rect clip; leader lines by growing point count.
- Mist erase: paper-coloured layers with a wavy rising edge (demo two layers over 3.3 s).
- Creature motion may be phased to the music beat grid (demo BEAT0 = 11.865 s, BEAT = 0.5805 s, one kangaroo hop per 2 beats).
- Painted transformation: cross-fade to a burnt/wet/aged sprite, then regrow (demo fire front 1,250 world px in 3 s; 14 raindrops 0.36 s apart).
- Easing: smooth only (`ss`, `eio`, `eo`, `ei`); monotone cubic keyframe tracks for camera. 60 fps suits it (demo 1920×1080 at 60 fps, 113.6 s); nothing jitters, nothing steps.
- Camera: one long lateral dolly over a continuous world (demo camX keyframes 700 → 9,800 world px over 10.3–73 s, faster between zones, slower on events); vertical tilt along one tall object (demo up 980 px over 3.6 s, back down over 2.5 s); locked sheet; slow push into a detail; pull-back to a map; mist wash to blank paper; page turn / new sheet sliding over; time change on a locked view.
### Transitions and rhythm
- No hard video cuts and no dissolves between unrelated pictures; transitions are brush-edge wipes, mist, a page turn, or continuous camera. The demo has no cuts at all (one painted sheet).
- Demo rhythm: zones ≈ 10–18 s each; 13 voice lines of 1.7–7.4 s; music 103.4 BPM, edited with one beat-aligned jump (0.18 s equal-power crossfade starting 60 ms before the beat).
- Silence = "the brush lifted": music out, only paper and room.
### Finish
- Paper is a pre-generated image (`paper.py`): base `#f1e9da`, three octaves of smooth noise ±3.5 %, 2,600 short curved fibres (±3.5 % light/dark), fine grain, 5 % vignette; drawn first every frame.
- Stroke material: a variable-width ribbon (profiles `brush`, `leaf`, `even`, `tip`, `trunk`) with ±22 % value-noise width roughness, body filled at opacity × rib (≈ 0.57 with bristles; rib 0.62 with bristles, 0.92 without; default opacity 0.92), plus 3–9 bristle tracks (default clamp(round(w/3.2), 3, 9) when w ≥ 6 px) at 30–85 % opacity, each a random dash pattern (runs 18–90 px, gaps up to w/2) with a random early end = flying white.
- Wash: the same polygon in 3 passes with jittered vertices at a/3 × 1.6 opacity each, so edges darken where passes disagree (pooled edge). Overlapping strokes darken like transparent pigment (source-over at partial alpha).
- Finished objects cached as sprites; only objects being painted or transformed are drawn stroke by stroke.
- Grain, bloom, glow: none beyond the paper. Encode: intermediates x264 CRF 12, final x264 slow CRF 16, GOP 120.
### 3D look (if any)
None.
### Banned
Not ink wash (colour, not ink tones; no calligraphic gesture brush); not impasto (no thick paint, no knife); not a children's picture book (no crayon, no cute outlines); not vector illustration with a watercolour texture on top; no vector outlines; never pure-white paint; no hard cuts or dissolves between unrelated pictures; labels never cover the subject; continuous map ramps (quantise into 4–6 bands); never copy a specific artwork, character or layout; any stroke built inside `render(t)` without a fixed seed (breaks parallel rendering).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/watercolor.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/watercolor/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/watercolor/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/watercolor.mp4 (*Follow the Rain*, 113.6 s)
### Gaps
No vertical layout; no named easing curves beyond helper names (`ss`, `eio`…; curve formulas not in the docs); plant colour sets (`plants.js` `COL`) named but not given as hex in the docs; no guidance for footage or 3D.

## Chinese Ink Wash (Xieyi)
- Source: `lemomo-ai/lemo-opuscar` `styles/ink-wash/STYLE.md`, `DEMO.md`, `style.json` (No. 03, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: xieyi ink painting on rice paper, animated: mostly empty paper, five ink tones and one vermilion seal; one brushstroke is a mountain, a wave, a gesture or a cut.
- Suits: contemplative stories, origin and journey stories, history as a handscroll, "one decisive moment" films, brand films built on one line, Chinese/East-Asian topics. Real footage: no. 3D: no. AI images: no (procedural brush engine + WebGL compositor).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| rice paper | `#F2ECDE`–`#F3EBDD` (rgb .95/.925/.87) | procedural paper in the compositor |
| ink, low density | rgb(.52,.55,.58) ≈ `#858C94` (converted) | cool grey end of the ink ramp |
| ink, full density | rgb(.075,.068,.062) ≈ `#13110F` (converted) | warm black end |
| vermilion | `#B02E22` | the seal; at most one tiny story accent (demo: the sword tassel) |
Ink tones (墨分五色) as stroke opacity multiplied onto paper: 焦 burnt ~.96 (calligraphy, sharpest lines, moss dots, sword); 浓 thick ~.82 (contours, dark edge of loaded strokes, hat); 重 heavy ~.60 (secondary lines, folds); 淡 light ~.34 (mountain bodies, robe/body washes); 清 clear ~.16 (far mountains, faces, mist). Rules: ink only, no other hue in the world; one vermilion, never a red wash or red type; far = pale and soft, near = dark and textured; if busy, remove ink rather than add tone.
### Typography
- Subtitles are inscriptions (题跋): Cormorant Garamond italic (Google Font), demo weight 500, 46 px at 1920×1080, 1 px tracking, ink-coloured, no box, ≤ 2 lines, placed in each shot's empty paper; a small vermilion square marks the start of each line; they appear wet → dry in ~0.35 s. Hold ≥ max(1.8 s, speech + 0.6 s). Screen-space overlays reset the camera transform (otherwise they slide off in pans).
- Titles: written on the painting in vertical columns in its empty space (demo: English letterforms rotated 90°, Cormorant SC 600, wide tracking; Google Font), with a code-drawn vermilion 白文 seal; they move with the world, fade in wet → dry, evaporate when the pan starts.
- End card: "CHINESE INK WASH" Cormorant SC 600, 44 px, 14 px tracking; credit italic 30 px in pale paper colour.
- Calligraphy: an OFL brush font used only as a skeleton (demo Ma Shan Zheng, Google Font): trace centrelines in stroke order, pressure from glyph thickness, hidden-tip entry (藏锋, demo 45° lead-in), tapered exits (demo .12–.18), dryness .17.
- Case: small caps for titles; emphasis by placement in empty paper. Words on screen: few (demo 4–6 voice lines in 48 s).
### Layout
- 60–80 % empty paper (留白); dark foreground may pass along the frame bottom.
- Demo framing: high wide with the figure 150–180 px tall in a huge blank river; travel with the figure at ~60 % of frame width and lead room ahead.
- Subtitles placed per shot in the empty area; titles in vertical columns. Grid/margins: not given.
### Elements
- Brushstroke model: centreline × pressure profile × width noise, plus 4–60 bristles whose ink load drops along the stroke and breaks on long-scale noise; `dry` from solid wet to flying white (dry .3 = textured, .6+ = flying white; body fill fades as (1 − dry)^1.6). Profiles: `brush`, `tip`, `nail`, `lens`, `fan`, `rise`, `robe`, `even` + per-point pressure.
- Loaded stroke: bristles darker on one side so the stroke carries its own contour (没骨 boneless painting); no Western outlines.
- Masses: soft polygons with jittered edges and a gradient, never flat fills.
- Landscape: mountains dissolve downward into mist bands; 披麻皴 hemp-fibre texture and 苔点 moss dots on near ranges only; far ranges tone .12–.16 untextured, near .4–.5 textured; range ends faded with a horizontal alpha mask. Rocks: outline → axe-cut texture → shadow wash → dots. Pine: one crooked loaded trunk, tip branches, fan needle clusters. Reeds: foreground only.
- Water is blank paper: faint dry streaks and open ink rings (demo ring = one stroke of 1.86π with a gap, r ∝ age^0.6, fading over ~2.4 s); solid water as Song-dynasty parallel wave lines (dense near the edge) or a pale body with a few huge loaded strokes.
- Figures: xieyi, one pale body mass + two loaded strokes, burnt-ink limbs; features (if ever) in 3–5 strokes; demo face stays under the hat.
- Seal: lines knocked out of a slightly irregular red square with ink-paste speckles.
### Motion
- Figures step at 12 fps (on twos); their position, camera, blooms, ripples and splatter on ones at 24 fps.
- Stable strokes on twos: seed each stroke by index; bristle breaks along normalised arc length × a fixed reference length (`gapLen`) so flying-white gaps don't crawl; small boil on width noise only (demo 5-drawing cycle).
- Painted into existence in stroke order; nothing tweened like a vector shape (things are painted, bloom, or dissolve into mist).
- Stillness before action: hold with at most a slow push-in (demo 5 %), then the decisive stroke crosses the frame in ~4 frames; consequences begin only after the stroke finishes.
- Demo qinggong step cycle: touch 14 % → rise → glide 45 % → descend; height = sin(π·phase); body pitched ~30° forward; one ink ring per touch.
- Splitting a mass: halves clipped either side of the cut; one rises/rotates and fades, one slumps/squashes; splatter flies along the cut direction with gravity.
- Camera vocabulary: locked frame on the paper; right-to-left pan (handscroll); vertical tilt (hanging scroll); lateral tracking with lead room and slow far parallax; high wide with a tiny figure; low angle with a towering dark mass and a slow push-in with growing shake; hard cut to an extreme close-up (the style's only hard cut); push into an ink bloom or mist; pull back until a mark joins the whole; return to an earlier framing.
- Easing curves / spring values: not given.
### Transitions and rhythm
- Transitions: ink blooms (next scene grows inside a spreading drop with a dark tide-line; mask d·(0.62 + 0.8·fbm); element blooms use a 1/4-res mask with `destination-in`), pans along the scroll, or mist. Never a generic dissolve or a wipe. Hard cut only to an extreme close-up.
- Rhythm: cued to the picture, never looped. Demo: free-time opening, 60 BPM for landscape, 90 BPM for travel (footsteps on beats), drum roll for threat, digital silence (whole bus zeroed, at most one sound inside: a drip or one ring), three glassy harmonics for three written strokes, then drum + seven-string sweep on the cut. Demo 48 s, 1152 frames at 24 fps.
### Finish
- Procedural rice paper in the compositor (never a texture file), anchored to the world: cloud mottling (demo ±7 %), long fibres (three fibre directions, +1.8 % light), pulp flecks, grain that fades when zoomed out (or it shimmers), vignette ~.22.
- Ink multiplied onto paper (never an overlay). Two layers: wet layer bleeds in the compositor (12-tap noisy Poisson blur of ~5 px at 1:1, edge pigment accumulation = small blur − large blur, granulation); dry layer gets only fibre jitter and paper tooth. A loaded stroke's body goes fully in the dry layer plus a wet halo.
- No ffmpeg grain (mux grain 0: the paper is in the shader). No glow or bloom (other than ink bloom transitions).
### 3D look (if any)
None.
### Banned
Not watercolour (no colour washes); not vector art with a brush texture (no flat fills or closed outlines); not a calligraphy title sequence; no Western outlines; no hue other than ink and the one vermilion; never a red wash or red type; no generic dissolves or wipes; no piano-and-strings (guqin-led); no metal whooshes for brush air; never copy *Feelings of Mountains and Water* or *Crouching Tiger* characters, compositions or music; clipping calligraphy with the font outline (notches junctions); parallel semi-transparent strokes for bodies ("organ pipes"); uniform hatching inside a wave ("wire mesh"); dry brush that looks like dashed lines.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/ink-wash.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ink-wash/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ink-wash/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/ink-wash.mp4 (*The Swordsman and the River*, 48 s)
### Gaps
No vertical layout; camera easing curves not given; ink ramp given as RGB fractions (hex above converted by me); bristle counts per stroke type not given beyond the 4–60 range.

## Impasto Palette Knife
- Source: `lemomo-ai/lemo-opuscar` `styles/impasto/STYLE.md`, `DEMO.md`, `style.json` (No. 04, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a moving oil painting made of thick palette-knife strokes, raked by light so every ridge shows; graphic, value-planned and readable at thumbnail size, with colour itself as the event.
- Suits: music films without narration, "colour returns" stories (recovery, relaunch, a town waking), city and street scenes, crowds and choreography seen from above, still lifes that come alive. Real footage: no. 3D: no (a 2D height field with lighting, WebGL2). AI images: no (sets are designed as reference illustrations in code, then converted to strokes).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| sky (top) cobalt | `#34507e` | after-rain sunset sky gradient, made by stroke-to-stroke steps |
| sky (mid) peach | `#d99a78` | |
| sky (low) gold | `#f7dca0` | |
| facade ochre | `#dca064` | buildings |
| facade rose | `#c98d7e` | buildings |
| shutter green | `#3f7a6c` | |
| awning red | `#b8342a` | |
| umbrella cadmium red | `#dc2f28` | the first (and in the first half only) colour |
| umbrella yellow | `#f4bc2a` | full-chroma props |
| umbrella cobalt | `#2f62c0` | |
| umbrella viridian | `#23906c` | |
| umbrella magenta | `#cc3a82` | |
| umbrella orange | `#ee7a2a` | |
| umbrella turquoise | `#26aab4` | |
| umbrella violet | `#6e4cc0` | |
| grey world | luminance of the same strokes, slightly cool, 5 % colour residue | everything before colour returns (slightly higher specular: wet) |
| end-card ground | "deep ultramarine" (no hex) | end card |
| engine example (STYLE.md) | `#D97757`, `#f0a07a`, `#f6c0a0` | warm-orange sparkle example only |
Rules: planes of mixed, slightly broken colour; each stroke may drag a second colour (`c2`) into the first; no pixel-blended gradients (gradients are stroke-to-stroke steps); warm light vs cool shadow by default; brightest, purest chroma reserved for the story's subject, not the background; colour can be an event (every stroke has a grey and a colour version). Other fitting palettes named without hex: harvest field (straw, burnt sienna, one viridian tractor), night kitchen (umber, sodium orange, one cold blue window).
### Typography
- Display serif: Cormorant (Google Font, "e.g."); size, weight and tracking not given.
- Titles are laid in with the knife (a stroke-by-stroke `appear` sweep of about 1 s), move with the world, and can be taken off by it (washed by rain, scraped, painted over). Demo title drifts down with the rain and fades.
- Small text (credits, data, captions) stays crisp DOM text over the painting: knife strokes can't carry small letters.
- Subtitles (if a voice): plain serif, ≤ 2 lines, in a calm plane; hold ≥ max(1.8 s, speech + 0.6 s). Demo has no narration.
- Case, letter spacing, emphasis: not given.
### Layout
- Value first: design each set as a flat, value-planned illustration (≥ 3 values) that reads at 480 px wide, then convert to strokes.
- The subject gets the hard edges and the smallest strokes; everything else stays in big calm planes. Demo stroke sizes at 1920×1080: 40–60 px planes in sky and walls, 3–6 px only at edges and faces.
- Keep the camera inside the painted plate (half = W/2/zoom), or the canvas shows.
- Grid/margins: not given.
### Elements
- Knife stroke: longer than wide (≈ 1.7–3.1 × radius long, 0.95–1.45 × radius wide), slanted ends, skew ±0.55, angle jitter ±13°, value jitter ±6 %; a ridge where the blade pressed, a lip where it lifted, broken streaks where paint ran out (`run`). Solid silhouettes (figures, props) use run 0–0.25.
- Stroke types: `KNIFE`, `BRUSH`, `DAB`, `LINE`; params x, y, ang, len, wid, c, c2, taper, bend, skew, alpha, hgt, rev, app, seed.
- Strokes never cross shape groups (crisp silhouettes); lost edges opt-in by sharing a group.
- Thin underpainting (the reference blurred ~1.5 px) under the strokes so canvas never shows as outlines.
- Reflections on wet ground/glass/water: explicit stacks of short horizontal knife dabs under each light, broken and fading; never a painted rectangle.
- Figures: procedural strokes from fixed seeds; silhouettes need taper, a lit edge and one or two defining dabs (shoulder, hair, handle); faces with separate eye/brow/mouth strokes so they act. Proportions carry identity (demo umbrella radius 0.34 × body height; 0.46 read as a parasol table).
- Sound made visible: a note as a paint ribbon that carries colour to what it touches.
### Motion
- Static paint never moves; only what the story moves moves (weather, figures, props, ribbons, light). Smooth 24 fps, no stepping.
- Moving strokes rebuilt each frame from fixed seeds so they don't boil.
- Actions on the music grid: a change of direction, a pop, a swell lands on a beat (demo nine umbrellas, one per beat at 132 BPM; pops with a scale bounce and a burst of paint dabs; crowd rings swell on every downbeat).
- Anticipation → action → follow-through on every gesture (the girl dips the umbrella before it snaps open; umbrellas swing down after closing).
- Colour re-laid by the knife: a reveal wave re-paints strokes from grey to colour stroke by stroke (`reveal`, `revDur`, `revC:[x,y,speed]`); paint-over: next shot's strokes laid over the previous in a sweep (`appear`, `appDur`).
- Raking light at the peak: drop the light to a grazing angle so every ridge catches it, then settle.
- Camera: slow truck + push on a wide; push-in through a silence; tilt-up from the ground or a reflection; pull-back from a close-up; rotating crane-out overhead; the same wide repeated (before/after); locked frame with moving light; macro slide along the paint surface; whip-pan into a new plate. Demo used six moves (push, truck, tilt-up, pull, rotate, crane-out), CU to extreme wide and overhead.
- Easing curves / spring values: not given.
### Transitions and rhythm
- Transitions: paint-over sweeps and scrapes, hard cuts on beats ("one action = one sound = one cut"); no dissolves (two layers of knife ridges turn to mud).
- Demo shot lengths (39.7 s, 9 shots): 2.65, 4.5, 5.25, 4.5, 2.7, 4.1, 8.2, 4.1, 3.9 s. Part A solo cello D minor 3/4 at 80 BPM; silence 10.45–12.4 s with a J-cut of footsteps; Part B waltz D major 3/4 at 132 BPM; grand pause to digital zero at 31.21 s (the rain freezes in the air), final chord at 31.66 s.
### Finish
- Raking light over a height field (demo light vector [−.55, −.6, .7], norm 3.2, ambient .8, diffuse .28, specular .16–.3 (more on wet/glossy), AO 1.2; grade params `expo`, `sat`, `vig` exist, values not given).
- WebGL2 renderer with supersampled colour + height buffers (2×).
- No film grain (grain + compression eats knife edges); high bitrate; muxed with grain 0.
### 3D look (if any)
None (lit 2D height field only).
### Banned
Not a Van Gogh swirl filter (strokes boiling everywhere); not a brush texture over flat vector art; not watercolour (paint is opaque); not a painterly photo filter (strokes designed, not sampled from noise); no dissolves; no film grain; no pixel-blended gradients; strokes never cross shape groups; never a painted rectangle for a reflection; strokes re-seeded every frame (boil); camera leaving the painted plate; plain rectangles as figures (read as posts/bollards); never copy *The Umbrellas of Cherbourg*, Afremov, Sorolla/Sargent or Edgar Wright images, compositions, melodies or characters, or name them.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/impasto.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/impasto/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/impasto/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/impasto.mp4 (*The Colour of Rain*, 39.7 s, 952 frames at 24 fps)
### Gaps
No vertical layout; no title/subtitle sizes; camera easing not given; grade values (exposure, saturation, vignette) not given; height-field profile of a knife stroke described only qualitatively.

## One-line Drawing
- Source: `lemomo-ai/lemo-opuscar` `styles/one-line/STYLE.md`, `DEMO.md`, `style.json` (No. 05, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a single warm-black ink line that never leaves the paper; the camera follows the nib, scenes morph instead of cutting, and the whole film can end as one picture.
- Suits: life stories, company histories, journeys and processes ("one continuous thing"), reveals where vignettes add up to a logo/face/map, data as a drawn line (heartbeat, chart). Real footage: no. 3D: no. AI images: no (SVG path strings + a canvas ink renderer).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F4EFE4` | warm white page |
| ink | `#1D1A17` | the line (warm black), subtitles at 84 % |
| accent (demo) | `#B3332B` | red, used once on one stretch of the line (the smile); returns to ink after |
| pen shadow | ink at alpha .15 | blurred wedge from the nib |
Rules: ink on paper only; nothing fills the frame; one accent at most, used once, on a stretch that means something (red = love/danger, blue = water/cold, gold = money/prize), kept visible in the final picture; never a second accent.
### Typography
- Subtitles: Caveat (Google Font), demo weight 500, 46 px at 1920×1080, ink at ~84 %, no box, centred, baseline 100 px from the bottom; written on left to right in 0.2 s + 17 ms per character behind a soft paper-coloured halo (so passing lines never cross the letters); fade out over 0.45 s. Hold ≥ max(1.8 s, speech + 0.6 s).
- Title: Sacramento (Google Font; a monoline connected script), 76 px, written on over 1.6 s in empty paper away from the drawing, with a small Caveat sub-line; gone before the camera moves into it.
- End card: Sacramento title on two lines; "ONE-LINE DRAWING" in Caveat 600 with wide tracking (value not given).
- Case: sentence case; caps only for the end-card style name. Words on screen: few (demo 5–6 short voice lines in 47.5 s).
### Layout
- Most of the frame is paper; the nib kept inside the central ~70 % of the frame (demo soft clamp 72 % × 66 %).
- Each vignette composed so the finished drawing sits centred; titles and end card written in empty paper beside the drawing.
- Line widths in paper units (demo): child 2.4 (alpha .82), teen 2.5, adult 2.9 (.96), old 2.7 (.93), next generation 2.0 (.76); screen-space minimum ≈ 3–4 px at the reveal.
- Grid/margins: not given.
### Elements
- The one line: a filled polygon around the path (not `ctx.stroke`), mixed with paper to an opaque tone per point. Width = voice base width × pen pressure × fine noise (±8 %); pressure from speed = 0.66 + 0.8·exp(−v/300) (fast = thin, slow = fat). Character changes along the path (width, alpha, tremble, dryness), blended over ±60 units at chapter boundaries.
- Ink bleed: same polygon slightly wider, blurred on an offscreen layer (≈ 0.9 × zoom px), composited at 22 %. Pooling: extra round dots where speed < 45 units/s.
- Tremble and dry brush (age, fear, fatigue): perpendicular noise (two octaves, up to ≈ 1.1 units), dry gaps from long-scale noise + three thin bristle strands; reduce dryness for the final strokes.
- Stop blot: a teardrop (tip at the nib, belly sagging downward as it spreads, dark tide line at the rim); a round blot reads as a mole.
- The pen is never drawn: a soft blurred shadow wedge toward the lower right (length ≈ 560 × zoom px, alpha .15) and a 1–4 px contact dot. Hands only as shadows, each composited as one flat layer.
- Paths: chapters as SVG path strings sampled by arc length, joined by tangent-continuous connectors; connectors must fall on natural lines of the final picture.
### Motion
- Everything on ones at 24 fps (stepping breaks the illusion of continuous drawing).
- Timing = chapter windows + curvature: within a window, time per point weighted by 1 + K·turn (sharp turns get more time, smoothed so speed never jumps). Beats pinned with marks by arc-length fraction or by position ("the second time the pen passes here"); a stop = two marks at the same place.
- Speeds: ~300–700 units/s for travelling lines, ~50–150 for small details; the most important stroke is usually the slowest.
- Retracing over an existing line is legal and invisible (only thickens slightly).
- Stopping is an event: the nib stops, ink pools, music cuts to silence for 1.5–3 s.
- Camera: one continuous move with keys for composition centre, zoom, a few degrees of roll, and a follow weight f (0 = composed, 1 = locked to nib); follow point = average nib position over −0.55…+0.4 s (lag + anticipation). Demo: opening macro z ≈ 4.3 with f ≈ 0.1; travelling f 0.6–0.85 at zoom ≈ 2.4; vignettes f 0.15–0.35; the stop = hold with a very slow push-in 4.6 → 5.4; reveal = one continuous pull-back from ≈ 3 to 1 over 5 s while the last strokes draw, then hold ≈ 1 s; clamp the zoom used for line width to ≥ 1.3 during pull-backs.
- Camera vocabulary: follow the nib; composed frame; macro on the nib; hold with slow push-in; mirrored framing; continuous pull-back; lateral scroll with the line running ahead; roll with the line.
### Transitions and rhythm
- No cuts. Transitions are morphs: the last stroke of one image is the first stroke of the next.
- Rhythm: score written to the drawing: key notes on marks and corners (corners = speed minima at high turn, exported as candidate note onsets); fast line = short notes; a stopped line = one long note fading to silence; highest note on the most important touch. Demo 47.5 s, 1140 frames, solo cello legato with 0.14 s overlaps.
- Arc template (40–50 s): a single touch on blank paper (hook within 3 s) → quick light early chapters → the one coloured chapter → a stop → the line resumes changed → slow final strokes during the pull-back → whole picture held → coda passing the pen on. Find the one final picture and 6–8 moments that each become a part of it.
### Finish
- Procedural paper anchored to the page: mottling (soft-light, demo 1400-unit tile), long fibres (260-unit tile, fading when zoomed out so they don't shimmer), a sparse paper-tooth speckle screened over the ink at close zoom, vignette 0.13 multiply.
- No grain (mux grain 0; paper texture is in the render). No glow/bloom.
### 3D look (if any)
None.
### Banned
Not a whiteboard explainer (no hand, no marker, no erasing, no text-heavy boards); not ink wash (no tones, no brush bloom as a look); not line-art animation with cuts and many strokes; no fills, no shading, no second line weight, no background art; the pen never lifts and is never drawn; no cuts; never a second accent; no pads in the score; no copying La Linea's character or gibberish voice or any specific continuous-line illustration; stray connectors (they read as wrinkles/beards in the reveal); lines drawn too close (they braid; keep ≥ 5 units apart); translucent overlapping hand shadows.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/one-line.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/one-line/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/one-line/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/one-line.mp4 (*The Line That Never Lifted*, 47.5 s)
### Gaps
No vertical layout; K (curvature weight) value not given; "paper units" vs pixels mapping not stated; easing between camera keys not given; end-card tracking value not given.

## Whiteboard Explainer
- Source: `lemomo-ai/lemo-opuscar` `styles/whiteboard/STYLE.md`, `DEMO.md`, `style.json` (No. 06, Hand-drawn & Painting); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a lesson written live on one glossy dry-erase board, stroke by stroke, by floating markers with no hand, while a 2D camera travels across the board instead of cutting.
- Suits: science explainers, "how does X work", online courses, proofs, timelines, two-quantity comparisons. Real footage: no. 3D: no. AI images: no. (Demo uses real facts, but the look needs no data.)
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| board gradient top | `#fbfbf9` | warm white board, gradient start |
| board gradient bottom | `#eeede9` | gradient end |
| ghost marks grey | `#9aa0a8` | ~46 old words/circles/arrows at 5–10 % opacity |
| ghost marks pale blue | `#8aa0c8` | same, alternate |
| ink black | `#23262c` | things and structure |
| ink blue | `#2a5cb3` | signals, light, measurement, process |
| ink orange (accent) | `#d97757` | "you", time, the thing that matters; one accent per region; hero magnet; subtitle dash |
| wall (final wide shot only) | `#d8d3ca` | warm grey wall behind the aluminium-framed board |
| window sheen | white at 10–16 % | soft diagonal highlight |
| alt set A | black / `#2e8b57` / `#c8363a` | dark / green / red (example) |
| alt set B | `#1f2a44` / `#1f8a8a` / `#7a4fb3` | navy / teal / purple (example) |
Rule: three marker colours at most, each with a fixed meaning for the whole film. Monochrome variant: all dark ink, one element in the accent. Board and ghosts stay neutral; the accent never appears on props except its own marker cap and the hero magnet.
### Typography
- Board text: a single-line (single-stroke) hand, **EMS Tech** (OFL, a single-stroke version of Architects Daughter; not a Google Font, converted from an SVG font with `tools/svgfont2json.py`). Written in stroke order; each glyph jittered ±2° rotation, ±3.5 % baseline and scale. Missing glyphs (μ ≈ → × − ✓ ² ↓ ° ± .) hand-defined.
- Sizes at 1920×1080: titles 120–200 px cap height (demo title 200 / 120 px), labels 30–70 px cap height. Lettering stroke width ~13 % of cap height.
- Burned subtitles: **Architects Daughter** (Google Font) ~44 px, dark ink text on an off-white rounded label at ~90 % opacity, a short accent-colour marker dash bottom-left. Split at clauses, ≤ 44 characters per line, short clauses merged, two lines above 1250 px width. Bottom ~12 % of frame kept free for them in every shot. Hold ≥ max(1.8 s, speech + 0.6 s).
- Case: mixed, handwriting. Emphasis: the accent colour, a box or a double circle, and timing (a term finishes being written exactly on the spoken word).
- Title and end card are written on the board in the same hand; the end card is written under the title.
### Layout
- One large board (demo 8000 × 4500 px world); each idea owns a region; distance on the board = distance in the argument.
- A label is fully in or fully out of every shot it appears in (never half-cut by a push-in).
- Bottom 12 % reserved for subtitles. Density: one sentence = one drawing; simplest geometry that carries the idea.
- Frame, tray and wall appear only when the camera goes past the board edge.
### Elements
- Hand-drawn shapes: line, curve, poly, arc, circle, rect, roundRect, arrow, dashed, hatch. Circles start at an angle and overlap past closure; rectangles are 4 strokes with small corner overshoot.
- Props: dry-erase markers (white barrel, colour band and posted cap in ink colour, felt nib) floating with a cast shadow; a charcoal felt eraser with a small orange label; a glossy orange map-pin magnet (radial gradient, white dot, specular highlight, soft cast shadow).
- No hands, arms or cursors, ever.
- Ghost marks of old lessons; equations written term by term.
### Motion
- Stroke speed curve: `u − sin(2πu)/(2π) × 0.8` (slow landing, fast middle, slow lift). Strokes are scheduled into a deadline window (`by:`) and the engine solves the speed so writing finishes on the word.
- Stroke build: resampled every ~0.6 × width; low-frequency wobble along the normal ±2.6 px at ~220 px wavelength plus finer tremor; chisel width by direction 0.8–1.0; pressure ramp 0.72 → 1 at start; 12 % taper at end; darker pooled dot just inside the start of long strokes. Drawing width 6–11 px.
- Durations: title ~3 s, a label 0.3–0.8 s, a full satellite drawing ~1 s.
- Pen hops: lift proportional to distance, max 35 % of the window; gaps > 0.75 s send the pen to an off-frame park spot, returning 0.42 s before its next stroke.
- Magnet: drop 0.3 s (lift → 0, big shadow shrinking); slide = smoothstep per step with a small lift; sink = tilt 0.5 rad and drop 40 px.
- Eraser: constant speed along a path, 90–230 px band at 90 % strength (10 % ghost remains).
- Camera: 2D (position, zoom interpolated in 1/z so pushes feel like dollies, a little roll), on ones; keyed with eases `io i o l s`. Real 180° motion blur when camera moves > 14 px/frame: up to 12 sub-frames averaged, ≤ 4 px apart.
- Camera vocabulary: pull back from a tiny drawing (scale), ride the line the pen draws (one idea leads to the next), hold still to read, whip to a new region (a twist), return to an earlier region (callback), split view of two regions (before/after), slow push into one symbol, track along a long diagram, pull back past the board edge to the wall (summary).
### Transitions and rhythm
- No cuts on the board; if a cut is needed it is a whip. Transitions are drawn lines the camera rides.
- Rhythm: demo clockwork minimalism at 120 BPM (D major / B minor). A full stop into silence before the surprise ("But, there's a catch."); a wall-clock tick is the only sound in that silence. Demo 111 s.
### Finish
- Ink alpha ~0.94 composited with **multiply** so overlaps darken.
- Dry-marker texture: a 512 px speckle-and-streak tile subtracted from the ink layer (destination-out), locked to board space, faded out when the camera is wide.
- Board: faint scuff and micro-scratch tile; diagonal window sheen (white 10–16 %) moving at 0.35× the camera ("sells glossy").
- Grain at mux: `mux.sh … 24 2` (grain value 2).
### 3D look (if any)
None (2D canvas).
### Banned
Never draw a hand, arm or cursor; text never animated as blocks (not kinetic type); no blue sheet or drafting conventions (not Blueprint); no wax texture or children's story (not Crayon Book); no more than three marker colours; no labels half-cut by a push-in; no cuts on the board except a whip; never copy RSA Animate/minutephysics drawings, characters, hands or music; pooled-ink dot never larger than the stroke start; no motion blur with too few sub-frames (strobes text).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/whiteboard.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/whiteboard/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/whiteboard/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/whiteboard.mp4
### Gaps
No vertical-frame layout; EMS Tech is not on Google Fonts (needs the SVG-font conversion); no rule for how much board area a region gets; music tempo is the demo's only.

## Urban Sketch · Pen & Wash
- Source: `lemomo-ai/lemo-opuscar` `styles/urban-sketch/STYLE.md`, `DEMO.md`, `style.json` (No. 45, Hand-drawn & Painting); hat colours from `demo/engine.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a location sketchbook page; wobbly sepia fineliner first, loose transparent watercolour dropped slightly off the lines, fraying into cream cold-press paper at the edges.
- Suits: city and travel diaries, architecture, a day in a place, lifestyle brands, slice-of-life, gentle comedy; works without any voice. Real footage: no. 3D: no (figures use a 3D skeleton projected orthographically, but output is 2D). AI images: no. Needs WebGL for the compositor.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#f5eede` | warm cream cold-press page |
| ink | `#2b2520` | dark sepia fineliner, never changes |
| foliage ramp (light → dark) | `#d6d56f` → `#aabf57` → `#7fa04a` → `#56793c` → `#3f5d36` | base wash (sun `#d6d56f`), then leaf dabs by light direction |
| sky | `#9fbcd6` / `#86a6c8` | soft ellipses at 10–20 % alpha, fading upward |
| cloud belly | `#b7b3c9` | tint under reserved (paper-white) clouds |
| limestone | `#d8c6a0` | buildings |
| ochre | `#cfaa72` | buildings |
| glass | `#98b1c8` | buildings |
| brick | `#c49a7a` | buildings |
| building shadow mix | `#5a5f82` | shadow side = local colour mixed 45 % with it |
| haze | `#b9c0cc` | distant blocks mixed 50 % with it |
| lawn light bands | `#c3c96f` / `#dcd98b` | |
| lawn shade dabs | `#7f9c52` | |
| path | `#d8ccb1` | |
| figure shadow mix | `#464873` | figure shadow side = colour mixed 40 % with it |
| straw hat (the one coloured thing) | `#d8ad5f` | hat wash; band `#4b4a6a` |
| bikes | `#3f6a8a`, `#b0453a` | demo props |
| example: harbour morning | sea `#7fa6b8`, hulls `#c9573f`, rope `#c8a86b`, sky `#bcd0dc` | STYLE.md example |
| example: winter market | roofs `#8b93a6`, lights `#e2b04a`, awnings `#b8483e`, snow = paper | STYLE.md example |
Rule: ink is one colour forever; wash is light local colour from few pigments; shadows mix toward one shared cool violet; distance mixes toward one haze; paper white is the brightest value and is reserved, never painted; colour may be withheld and arrive as an event.
### Typography
- All text is handwriting on the page, written on left to right with pen sound, and moves with the camera (never an overlay).
- Corner note: **Reenie Beanie** (Google Font), e.g. `Sun. 3:40 pm — windy`.
- Titles and colophon: **Caveat** (Google Font) 500–600, left-aligned in the blank margin. Demo end title Caveat 500 at 190 px (1920×1080).
- Subtitles if there is a voice: handwritten lines in the margin or a caption strip written into the lower margin; hold ≥ max(1.8 s, speech + 0.6 s). Demo had no voice and no subtitles.
- Emphasis: not given (colour arrival does the emphasis).
### Layout
- One large page (demo 5120 × 2880; final pull-back shows it whole at 0.375×). Nothing painted edge to edge; margins left blank for handwriting.
- Subjects ≥ ⅓ of frame height at story beats; a small key object gets a faint paper halo (reserve) so it reads over busy foliage.
- Page edge: noisy boundary (fbm 0.004, ±80 px), a 70 px white-dab band inside and a 70 px coloured-dab spray outside.
- Density: suggest rather than describe (a few window marks, scalloped fragments of a tree outline).
### Elements
- Fineliner strokes with wobble, overshoot and gaps; grass = 2–4 ink flicks per tuft, denser near camera.
- Figures: 3D skeleton in orthographic projection, torso from cross-sections, limbs as tapered tubes, hair and head one mass, face blank (one nose tick in profile).
- Carrot people for far crowds: one wash blob, two leg lines, a head dot.
- Drawn invisible forces: wind as ink "~@" curls with trailing leaf dabs; sound as ink lines; heat as wavy strokes.
- Handwritten corner note (day, time, weather, place).
### Motion
- Figures **boil at 12 fps** (line wobble and wash seeds change every 1/12 s); the static page never boils; the camera moves every frame, smoothly.
- Anticipation, action, follow-through; footsteps on the beat (demo run cycle = 2 beats).
- Wind curls spawn on every beat, draw on in 0.4 s, then erase from the tail.
- Colour never snaps: it blooms from a point with a noisy circular clip (figures) or arrives through the colour-arrival field (world). Wet front: reveal smoothstep over 0.16 s of arrival time, front band darkened +70 % (Gaussian at +0.07 s, σ 0.08 s), edge noise ±240 px coarse + ±40 px fine.
- Stroke-order draw-on for anything that appears (strokes baked with per-pixel draw time, replayed in the shader).
- Camera: 2D over the page; designed moves use cubic easing; follow shots use a critically damped spring on a lead-ahead target (stiffness 28, or 70 for a fall); punch-in with a 0.35 s shake on impact.
- Camera vocabulary: push-in (a detail noticed), lateral spring follow (travel, pursuit), crane up (a view opening), whip-tilt with slight roll (a gust, a fall), punch-in + shake (impact), pull back to the whole page (summary), tilt into the margin (to words), slow pan over line-only areas (the world before colour), hold while the pen draws, page turn (another time or place).
### Transitions and rhythm
- Transitions: camera travel on the page, page turns, or colour arriving; no dissolves.
- Rhythm: demo 150 BPM jazz waltz in F (3/4); one bar of true silence (ambience included) at the apex, the next gesture is the first sound after it. Demo 32.4 s, 778 frames at 24 fps.
### Finish
- Paper: two-octave fbm mottling at 0.0011 and 0.0062 cycles/px, ±4.5 %; a tooth tile multiplied over everything, figures included.
- Ink: 96 % coverage; world line width 1.3–3.4 px (thinner far, thicker near); wobble 0.9–1.3 px; overshoot 3–8 px; 30–60 % of long strokes get one 3–9 px gap.
- Wash: 2–3 rough-edged layers (edge noise 4–12 px), multiply, alpha 0.4–0.65, offset from the line by 0.7–1× line width (misregistered 1–3 px), dried-edge stroke at 30–40 %; granulation = pigment × (0.82 + 0.36 · fbm(p · 0.21)).
- WebGL compositor: paper × wash (revealed by arrival time, wet front) × ink (revealed by stroke time). Arrival field uploaded as an `R16F` float texture; ink and time packed into RGBA byte textures.
- Grain: not given.
### 3D look (if any)
None visible; figures and hat/bike props are posed in true 3D orientation and projected, then drawn as sketch.
### Banned
No line-free wet-in-wet painting (not Watercolor Brush); no marker or explainer diagrams (not Whiteboard); no brush calligraphy or monochrome ink tones (not Ink Wash); never painting edge to edge; colour never snaps; ink never changes colour; no generic overlay subtitle box; no dissolves; no straight edges in the colour field (clip by noisy distance, not a bounding box); no rectangular masks round complex silhouettes; no copying of the references' characters, melodies, layouts or type.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/urban-sketch.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/urban-sketch/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/urban-sketch/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/urban-sketch.mp4
### Gaps
No vertical layout; no subtitle sizes (demo had no voice); no grain value; handwriting font sizes only for the end title.

## Chalkboard
- Source: `lemomo-ai/lemo-opuscar` `styles/chalkboard/STYLE.md`, `DEMO.md`, `style.json` (No. 73, Hand-drawn & Painting, added 2026-10-29); chalk/room colours and subtitle sizes from `demo/js/chalk.js`, `stage.js`, `app.js`, `post.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a clean classroom blackboard on which chalk writes itself in true stroke order, no hand or eraser in sight; write what people think, wipe it in one pass, rewrite the truth in the same place.
- Suits: one-idea lessons, word and character origins, myth-busting, a worked problem; Chinese or Latin. Real footage: no. 3D: no. AI images: no. Real facts: the demo keeps a `FACTS.md` with sources; Chinese characters need hand-authored stroke data checked against a reference font.
- Catalog rating: completeness **full** · distinctness high (vs Whiteboard: dark matte slate, flat-on camera, wipe-and-rewrite in place) · specification high
### Palette
| role | hex | where used |
|---|---|---|
| slate | `#0f1c15` | deep ink-green board (DEMO.md and `stage.js`) |
| back board | `#0b130f` | darker back panel (`stage.js`) |
| white chalk | ≈ `#F2F0E6` (RGB .95/.94/.90) | all structure: characters, lines, labels, arrows |
| accent chalk (orange) | ≈ `#FF8F42` (RGB 1.0/.56/.26) | only the one component the lesson tracks |
| second-hand chalk (child) | ≈ `#FAE694` (RGB .98/.90/.58) | another person's handwriting |
| wood frame | `#6a4a2e`; tray `#7a5838` / `#5d4128` | frame, stiles, tray |
| wall | `#bdb8a8` (lit toward `rgb(255,250,240)`) | warm white wall, seen in wide shots |
| dado | `#56705f` | green dado below the wall |
| clock face | `#f6f3ea` → `#d9d4c6`, hands `#222` | wall clock (demo at 7:58) |
| painted grid lines | `rgba(196,176,112,.36)` / `.24` | dull, thin tian-zi grids |
| subtitle plate | `#0a0f0c` at 62 % | soft dark rounded plate |
| subtitle text | `#f3efe4` (Chinese) / `#d9d4c6` (English) | |
| window patch | `rgba(255,225,180,.16)` | faint warm light, lower left |
Rule: three chalks at most (white structure, one accent for the tracked part, one pale second hand). Accent never decorates or draws arrows/underlines that aren't that component. No rainbow, no gradient in chalk, no glow. Painted grids dull and thin so chalk always wins. (Hex for chalks converted from the engine's 0–1 RGB floats.)
### Typography
- Chinese: never a font outline; hand-authored centre-line stroke data (`hz.js`, 100 × 100 box, standard order GF 0023-2020, stroke types h/s/p/n/d/t/x + turns + hook endings) drawn by the chalk engine, checked against **LXGW WenKai** (OFL, on Google Fonts as "LXGW WenKai TC"; the demo ships its own file).
- English on the board: a single-line OFL handwriting font from the **EMS** family (not a Google Font), drawn by the same engine; missing symbols drawn as strokes.
- Board content: keywords only; one line of Chinese, the next line English a size smaller.
- Sizes at 1920×1080: big characters 300–450 px; labels ≥ 55 px CJK and ≥ 30 px Latin cap height; small writing gets heavier chalk so no stroke is under 3 px.
- Subtitle plate: Chinese line over a free English translation, a plain kai face subset (`SubKai`) at 38 px (zh) / 25 px (en) at 1080 high, baselines at H−100 / H−62, centred, rounded plate radius 10, fades in/out over 0.12 s; long lines split at sentence ends. Nothing to read on the board sits behind the plate.
- Reading time: block fully in frame ≥ CJK chars ÷ 4.5 + other chars ÷ 15 + 1.5 s, counted from when it is wholly visible, and only after it is fully written.
- Emphasis: the accent chalk on one component, underlines, circling.
### Layout
- Camera always faces the board flat on (no perspective tilt). World units: slate x 0…6400, y 0…1700, sliding panel width 3200.
- Close shots: subject ≥ ⅓ of frame; text blocks never cut by the frame edge while read; never an empty board for more than 0.5 s.
- At least once the frame opens wide enough to read board, frame, tray and wall as a classroom.
- Few words, large letters; the explanation is spoken.
### Elements
- Sliding double blackboard panels, painted tian-zi grids, wooden frame, tray with chalk sticks (two white, one orange stub), wall clock, wall and dado, window light patch.
- Chalk lines, arrows, underlines, circles; "chalk as a measuring tool" (an accent arrow laid along a line and ticked off).
- A wet streak from a damp cloth that dries back.
### Motion
- 30 fps, continuous (renderer default is 24; pass `--fps 30`).
- Chalk speed: big character ~0.1 s per stroke including air time (10 strokes ≈ 1 s); labels ~0.04 s per stroke; faster than ~0.07 s per stroke for a big character stops looking like a hand. Engine speeds (sizes per second): 9–11 for 520-unit characters, 16–22 for titles, 40–90 for labels, Latin `lspeed` 90–200.
- Stroke build: baked once into a board-space coverage sprite (coverage, arc length, lateral position); partial strokes reveal up to the current arc length with a round leading edge; slate grain decides which grains take chalk (2×2 supersample, faint powder halo); 2–5 loose grains only at a stroke's lift-off. Width profile per stroke type (start bump, corner bumps, taper for 撇/提, foot for 捺, quick hook lift) and pressure heavier at both ends; straight strokes bow slightly; horizontals rise 2–3° to the right; 横/竖/折 enter with a short pressed tick from the upper left.
- Erase: one blurred destination-out band along one smooth path, leaving a thin even haze; one wipe per film is plenty.
- Things appear only by being written, wiped, revealed by a sliding panel, or by drying. Nothing fades in.
- Camera: cubic ease in/out, never bounces except a whip landing; whip with motion blur ≤ 0.5 s. Vocabulary: close shot on the writing, slow lateral pan along a line (sequence), pull back to a fixed medium frame (claim vs counter-claim), same frame later (judgement), locked frame while a panel slides (new chapter), whip to another part of the wall, cut on a line crossing a seam (connection), wide shot of the whole wall (summary).
- Voice gaps 0.25–0.4 s (demo 0.35–0.5 s); one longer hold ~1.5 s before the verdict; board action runs under the voice.
### Transitions and rhythm
- Hard cuts, a sliding panel, or a line across a seam; no dissolves or page flips.
- Demo 49.3 s, 13 shots of 1–7 s; quiet pulse in D, two notes a second (marimba + pizzicato bass); guqin notes mark finished characters.
### Finish
- WebGL2 post pass only: camera motion blur (within one shot), lens vignette (strength 0.42, smoothstep 0.35–1.25), gentle filmic grade, dither.
- Slate: even colour with fine grain and very slow mottling; grain tile in world space (soft-light) only when the camera is close.
- Light: gentle multiply falloff away from the windows, at most a faint warm window patch; light never draws shapes across writing in close shots.
- Wet streak: soft mask with a wide blur at the drying edge, fading at top and bottom, darkening the slate slightly (`rgba(0,12,7,.36)`); never a hard rim.
- Mux grain 1 (`mux.sh … 30 1`).
### 3D look (if any)
None (Canvas 2D; WebGL2 only for post).
### Banned
No dirty board (old swirls, ghost lessons, floating dust, bokeh); no hand, chalk stick or eraser on screen; nothing typeset or faded in (not a slide); no glow (drop the demo's radial gradient under the chalk front); no equal-width plotter lines; no accent on arrows or decoration; no rainbow or gradient chalk; no perspective tilt; no dissolves or page flips; no hard-edged wet streak; no "board-speak" in the voice (name what each component means); not Whiteboard (no glossy board, markers, magnets, ghost marks, knowledge-map travel).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/chalkboard.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/chalkboard/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/chalkboard/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/chalkboard.mp4
### Gaps
No vertical layout; chalk hex values only as engine floats; no Latin-only example; mix target given as −16 LUFS before mastering (library master is −14).

<!-- category: East Asian Traditions -->

## Shadow Puppetry
- Source: `lemomo-ai/lemo-opuscar` `styles/shadow-puppet/STYLE.md`, `DEMO.md`, `style.json` (No. 07, East Asian Traditions); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: Chinese shadow theatre; translucent dyed-hide puppets carved like lace, pressed on a cotton screen and lit from behind by flickering oil lamps, so colour arrives by transmitted light.
- Suits: myths and folklore, heritage, festivals, fables with good/bad actors, "behind the scenes / who pulls the strings" stories. Real footage: no. 3D: no. AI images: no. Needs WebGL2 for the compositor.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| vermilion dye | `#b8211a` | costume pieces, seals, borders |
| flame dye | `#d9541c` | fire, suns |
| ochre dye | `#dc9d1e` | |
| gold dye | `#c98a26` | |
| malachite dye | `#236e3a` | |
| jade dye | `#2f8a5c` | |
| indigo dye | `#22647e` | water strip |
| raw hide (neutral) | `#e2bd80` | undyed pieces |
| ink | `#1a100a` | carved outlines, hair, boots |
| arrow shaft | `#4a2612` | thin things that must read are dark (3 px) |
| lamp light | ≈ `#FFC475` (RGB 1/.77/.46) | the only light; warm, never white |
| bloom tint | ≈ `#FFD199` (RGB 1/.82/.6) | |
| vignette target | ≈ `#B37840` (RGB .7/.47/.25) | warm vignette, never grey |
| subtitle text | `#f3e2bf` | cream on dark placard |
| holes | brightest value (lamp through cloth) | |
Rule: all colour is transmitted, so nothing is brighter than the lamp and every hue leans warm; 3–5 saturated dyes + raw hide + ink; overlap is darkness; brightness comes from the number of lamps lit, never grading; night = fewer lamps, never added blue. Example sets: court (vermilion, ochre, malachite), river (indigo, jade, one ochre), harvest (flame orange, gold, one green). (Light/bloom/vignette hex converted from the engine's 0–1 RGB.)
### Typography
- Subtitles belong to the theatre: a storyteller's placard (narrow dark-lacquer board, dark brown gradient at 0.93 alpha, thin gold inner line, a small vermilion seal with 说 in **Ma Shan Zheng** (Google Font) on the left). Text **Cormorant Garamond** (Google Font) 600, 40–50 px (demo 46 px at 1920×1080), cream `#f3e2bf`, centred 58 px above the bottom; slides up 18 px in 0.22 s; shown from line start until speech + 0.8 s (≥ 1.8 s), cut 0.3 s before the next.
- Titles are puppets: dark hide plaques with letters cut out (`fillText` + `destination-out`, so words glow), carved border (demo: red border with meander band, green cloud-scroll corner roundels, red seal), carried on rods, pressed on to enter, lifted off to exit. Case: demo title in caps ("HOU YI / SHOOTS THE SUNS") with a lowercase subline.
- Emphasis: not given beyond the plaque/placard devices.
### Layout
- Puppets in profile; most of the cloth stays empty lit space. Scenery = one carved lace piece per element on mostly empty cloth, a narrow carved ground strip at the bottom, separate liftable strips for water or sky.
- Stage frame: red-and-black lacquer frame, carved lintel with gold cloud curls, pillars; optional blurred audience heads along the bottom.
- When zoomed in, clamp the camera to the screen rectangle (no black bars); push on frame centre unless diving into a lamp.
### Elements
- Jointed puppets of 8–12 pieces (demo hero 11): head ~1.2× natural with large headwear (~¼ of the figure), sleeves a different dye from the torso, round joint lobes with a rivet (dark ring + pale knot), arms by 2-bone IK from hand targets, held objects as separate pieces; thin rods (neck and hands) as soft grey lines just off the screen.
- Sympathetic figures have open-cut faces (features as thin strips round a hole); antagonists have solid faces.
- Carving vocabulary: crescent rows (scales, tiles), diamond lattice, coin holes (round hole with a square of hide inside), cloud collars and scrolls, tapered slits (cracks, rain, fur), strata along a ridge, leaf holes in a canopy; a dark carved outline 1.5–2.4 px on every region. Carving is density: thin strips, most area cut out.
- Fire, smoke, moving water are carved pieces on rods, swapped and shaken, never particles. Flame tongues: fat base, belly, hooked tip, alternating curl (sun rim tongues ~40 px long × 0.78 of arc spacing, teardrop holes between).
- Backstage: hanging lamps (dish + cords, additive flame glow, snuffed lamps trailing dark smoke), hands and sleeves as silhouettes with a warm rim, rods sharp.
### Motion
- 24 fps continuous for puppets and camera; only swapped effect pieces (fire, water) step at 12 fps.
- Hand tremor on every puppet ≈ 3 px / 0.018 rad, ×1.8 under tension (low frequency).
- Legs, plumes, tassels: damped pendulums / spring chains driven by body acceleration, pre-simulated at 120 Hz for determinism.
- Operatic phrasing: shuffling run → hop → crouch → freeze pose on a percussion accent (~1 s, only loose parts quiver) → head turn. Faces never change; attitude = head angle + body tilt (up = resolve, down = sorrow).
- Press on: arrivals scale 2.6 → 1 and blur 34 → 0 px over 0.55 s, snapping sharp. Lift off: scale ×1.9, blur +30 px, fade over ~0.9 s.
- Lamps: a new lamp flares with overshoot to 1.5×; a snuffed lamp gutters with fast flicker and goes out over 0.35 s.
- Never moves: the cloth, the frame. Nothing morphs: pieces rotate on rivets, slide on rods, or are swapped.
- Camera vocabulary: audience seat (whole stage, heads below), push through the frame onto the cloth, lateral pan across a wide cloth (demo 1.5×), follow a puppet with slight zoom (demo 1.15×), crash zoom of a few frames on a percussion hit (demo 5 frames on the freeze gong), whip pan along a moving piece, locked wide (count every step of a change), medium-close with empty cloth between two pieces, close on a carved detail, tilt from ground strip to top, truck round to the back (mirror view, `x → −x`), pull back from cloth into the dark room.
### Transitions and rhythm
- Transitions: lamps dimming, a blurred foreground pillar wipe, a piece lifting off in light, a flash to warm white; never a generic crossfade or digital wipe.
- Rhythm from gong-and-drum patterns: one hit per visual step, accelerating rolls into an entrance, one big gong per decisive hit, heartbeat drum under dread, hard stop ≤ 30 ms (tails included) into silence with at most one sound inside. Demo 54.4 s, 1306 frames at 24 fps.
### Finish
- Rendering model per pixel: `tonemap(lampLight × hideTransmission × clothTexture)`, `tonemap = 1 − exp(−hdr)`, exposure `1.75 / √(lamps lit)` (ten lamps ≈ 3× one lamp, frame bleaches but stays readable).
- hideTransmission: a canvas that starts white; every piece drawn with `multiply` (holes stay white, overlaps darken). Hide texture: tileable 512² (mottling, fibres, specks) multiplied into each piece, alpha restored with `destination-in`.
- Lamp: per lamp a broad lobe σ ≈ 700 px + hotspot σ ≈ 120 px (~6:1); flicker ≈ ±6 % value noise at 7 Hz plus a small 23 Hz sine, each lamp independent.
- Cloth: procedural weave (sin × sin, noise-warped) at ~2.6 rad/px, fibre speckle, low-frequency density blotches, darker edges at the frame.
- Post: warm-tinted bloom from a 3-level pyramid, threshold 0.72; warm vignette; saturation ×1.1; soft S-curve; heat haze only when the story burns; film grain 2 in ffmpeg (demo mux CRF 22).
### 3D look (if any)
None (2D canvas + WebGL2 compositor).
### Banned
Not a black silhouette film (colour is the second protagonist), not paper-cut (light comes through), not stained glass (no lead lines), not flat vector cut-out; no particles for fire/smoke/water; no morphing; no white or blue light, no grey vignette; no pale thin pieces (they vanish); no generic crossfade or digital wipe; no piano and strings; never reproduce a specific historical puppet, melody or recording, never name the references; no beds leaking into a silence; smoke never drawn with `lighter` on bright cloth.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/shadow-puppet.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/shadow-puppet/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/shadow-puppet/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/shadow-puppet.mp4
### Gaps
No vertical layout; dye hexes are demo-only (STYLE.md gives families); no title plaque sizes; puppet piece proportions only for the demo hero.

## Ukiyo-e
- Source: `lemomo-ai/lemo-opuscar` `styles/ukiyoe/STYLE.md`, `DEMO.md`, `style.json` (No. 08, East Asian Traditions); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: Edo woodblock prints brought to life; flat colour blocks slightly out of register under a carved key line, bokashi skies, visible washi, and a camera that slides over the prints like an unrolling handscroll.
- Suits: travel, journeys and pilgrimages, Japanese culture, poetry, "one subject in many places/seasons" series, supply chains or step sequences as stations. Real footage: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper (washi) | `#eee2c6` | base, ±3 % mottling; the only white (foam, snow, mist, blank sky) |
| paper fibres | `#fbf6e9` / `#c7b893` | light and dark fibres over the sheet |
| Prussian blue | `#1d3a66` · dark `#13284a` · light `#4d6f98` | skies, water, mountain, wave (dominant family) |
| deep trough | `#0f2344` | inside of the wave |
| pale blue | `#8db0c6` · `#bcd0d6` | water reflections, lower sky |
| sumi (key block) | `#231f1c` | all key lines |
| beni red | `#b8412f` · pale `#e3a08a` · peach `#efc4a8` | sun, seals, a garment, dawn bokashi, cartouche tab (rare) |
| ochre / straw | `#cf9f4a` · `#c9a45c` | hats, roads, obi |
| greens | `#8aa152` · dark `#50703c` · pine `#3e5a3a` | fields, trees |
| indigo cloth | `#2c4a70` · gaiters `#1d2c44` | clothing |
| mounting scroll | `#c9b690` | tan paper between sheets (260 px gaps) |
| cartouche | `#f3e7c6` (subtitle slip `rgba(243,231,198,.96)`) | cream slips |
| end-card ground | `#161a22` | dark indigo behind the whole scroll |
Rule: a pigment set of 6–9 flat hues, each printed from its own block; sumi key line over everything; paper is the white (no white pigment); one dominant hue family for sky and water; red is rare (seals, a sun, one garment); far layers pale and low-contrast, near layers saturated. Alternates (no hex): bijin-ga interior (pale pink, mauve, grey-green, lacquer black, mica-grey ground); autumn surimono (persimmon, ochre, grey-green, deep brown, one blue).
### Typography
- Subtitle cartouche: **Shippori Mincho** (Google Font) 500, 42 px at 1920×1080, sumi on a cream slip with 2.6 px + 1 px ink border and a small red seal at the left ("旅"), centred 72 px above the bottom; prints in over 0.22 s with the reveal mask, fades out over 0.25 s; covers the bottom ~150 px, so keep ground lines and figures above it. Hold ≥ max(1.8 s, speech + 0.6 s) (demo + 0.75 s).
- View cartouche: vertical cream slip, thick + thin border, a pale beni tab with the series title, the view title below in a brush font, **Yuji Syuku** (Google Font), seal beside; drops in with fade + 14 px slide.
- Titles live on the print as cartouches and seals, never as floating type. English title as a horizontal slip.
- Emphasis: the red seal stamp; otherwise not given.
### Layout
- The sheet is the frame: 1920×1080 sheet = screen at zoom 1; ink border at x 44–1876, y 38–1042 (3.4 px) plus a thin outer line 9 px outside; paper margin beyond. Sheets sit on a long mounting scroll with 260 px gaps and a wooden roller at one end.
- Flat world: depth by stacked horizontal layers, mist bands and bold cropping; extreme foreground elements (branch, post, lantern) crossing the frame; never perspective.
- Figures small in the landscape (80–130 px at full sheet). Subtitle band keeps the bottom ~150 px clear.
### Elements
- Every shot is a complete print: double ink border, flat blocks, key line, vertical title cartouche, red seal (characters cut out of red, chipped edges).
- Motifs: suyari-gasumi mist as long rounded flat bands fading at both ends; pines with flat-topped needle pads; fields as high flat parallel layers with parallel slanted cross lines; rain as two sets of fine straight lines at slightly different angles under a sumi bokashi sky; water as banded blues with bokashi between bands, foam and spray left as paper.
- Wave recipe (original, not *The Great Wave*): three blue bands with bokashi between, grouped white flow lines (3 per group) following the back-slope contour, foam rim, fractal claws (each claw splits into 3 fingers, each splits again, tips hook inward), claw roots tapered to ~40 % width and buried in foam blobs, spray in clusters (one big dot, few medium, many small).
- Mountain recipe: asymmetric concave slopes (`y = s^1.55` left, `s^1.8` right), notched summit, snowcap as 12 narrow pointed drips of random depth.
- Figure: side view, low conical hat hiding the upper face, faces in a few strokes.
### Motion
- Prints are still: most of the frame doesn't move; one or two small actions per view (steam, rain, a lantern, a leaf).
- Stepping: figures and nature at **8 fps**; rain and fast water at **12 fps**; camera on ones (24 fps) — a stepped camera judders.
- Printing reveal: each block appears over ~0.3 s (demo 0.34 s) with a diagonal baren sweep with a noisy edge, sliding 5–6 px into registration as it lands.
- Seal stamp: scale ~1.35 → 1 in 0.2 s. Cartouche: fade + short slide (14 px).
- A native move needs a held beat of ~1 s; a peak flashed in under a second reads as noise (demo climax in four beats: rise ~1.9 s, hang ~1.2 s with claw jitter ×0.25 and an 80 ms silent breath, fall ~1.2 s with claws ×2.5 and push to 3× with small roll, foam ~0.7 s).
- Camera moves over and between prints, never rotates in 3D inside one. Vocabulary: locked frame on one sheet (reading a print), handscroll slide right → left through the mounting gap (travel; shorter = urgency; demo 1.0 → 0.9 → 0.6 s), very slow push toward a framing device (demo 1.00 → 1.065), tilt past the border into the mount (something larger than the print), pull back from one sheet to many (the series), crash-zoom into the texture, pan across a triptych, hard cut to a blank sheet (ma).
### Transitions and rhythm
- Allowed: scroll slides, printing reveals, a wash back to paper, a cut to blank. No cross-dissolves, no 3D flips.
- Rhythm: jo-ha-kyū (slow open → gathering pulse → rush to a peak), then absolute silence (ma, reverb tails cut too). Demo shamisen pulse 72 → 96 BPM; hyōshigi clap per printed block, accelerating; taiko heartbeat from 0.9 s intervals to a roll. Demo 44 s, 5 views, 1056 frames at 24 fps.
### Finish
- Registration: blocks `g0` key lines, `g1` blues, `g2` greens/secondary, `g3` reds/figures, each cached offscreen, composited with fixed offsets g1 (2.2, −1.3), g2 (−1.8, 1.9), g3 (1.5, 2.2) px (range 1.5–2.5 px).
- Texture per colour block, in order: woodgrain `source-atop` α 0.1–0.17 (strongest in sky/water); baren streaks `destination-out` α ≈ 0.38 (0.2 on dark wood); goma-zuri specks `destination-out` α ≈ 0.3. Key block: specks only α 0.12. Fibres over the finished sheet α ≈ 0.09.
- Woodgrain = iso-lines of a warped noise field (`u = y·0.035 + fbm·9 + knots`), thin dark lines where `|frac(u) − 0.5| > 0.4`, plus broad tonal bands. Baren = ~260 blurred circular arcs + zigzag streaks.
- Bokashi per pixel: gradient whose top edge wanders ±20–30 px per column by low-frequency noise (never `fillRect` strips).
- Key lines 2.4–3 px; large contours as variable-width filled strokes tapered at both ends with ±20–35 % low-frequency width jitter; distant things get a grey key line or none.
- No grain at mux (grain 0: "the paper is the grain"). No shading or lighting on forms.
### 3D look (if any)
None (Canvas 2D).
### Banned
No flat vector with a paper overlay (needs woodgrain and misregistration); no bleeding washes (not ink wash); no cel light/shade on forms; no perspective grids for fields (parallel slanted layers only); no gradients except bokashi; no white pigment; no cross-dissolves or 3D flips; never reproduce a famous print (*The Great Wave*, *Red Fuji*, *Sudden Shower over Ōhashi*) or copy characters/compositions; no piano and pads; no pine clusters as half-discs (parasols); not too much speckle/fibre (sandpaper look); seal never drawn with `multiply` on dark ground; no stepped camera.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/ukiyoe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ukiyoe/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ukiyoe/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/ukiyoe.mp4
### Gaps
No vertical layout (a portrait sheet would suit the medium's tall hashira-e format, but the source doesn't say); view-cartouche sizes not given; alternate pigment sets have no hex.

## Red Paper-cut (Chinese window flowers)
- Source: `lemomo-ai/lemo-opuscar` `styles/papercut-red/STYLE.md`, `DEMO.md`, `style.json` (No. 09, East Asian Traditions); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: Chinese window-flower paper-cuts come alive; jointed red cut-outs on paper grounds, where the cut is the drawing and every hole is where light gets in.
- Suits: Lunar New Year, festive greetings, folk tales, "one thing becomes many" stories (fold–cut–unfold), craft-as-plot explainers. Real footage: no. 3D: no (pure 2D layers with parallax). AI images: no (every pattern generated in code).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| hero red (China red) | `#d2201f` | heroes, window flowers (rule range `#c8102e`–`#d7261e`) |
| antagonist / heavy, one step deeper | `#b00f26` | Nian (the monster) |
| near limbs, one step brighter | `#c4162c` | near-side limbs |
| far limbs, darker | `#8a0c20` / `#b8191b` | far limbs (monster / girl) |
| fold back colour | `#de3b30` | back of a flap past 90° |
| rice paper (day ground) | `#f2e8d0` | day ground, title paper |
| night paper indigo | `#1c2446` | night ground |
| ink sky | `#0f142a` | night sky |
| night far hills / near hills / houses / trees / snow | `#1f2a55` / `#29356e` / `#35457f` / `#28346c` / `#7a88ba` | all indigo papers at night |
| day far hills / mid hills | `#e0877f` / `#cf4f4a` | pale-red day layers |
| gold foil (one late accent) | `#d9a93f` | sun, title flecks, only at the end |
| subtitle banner | `#a8111f` | banner strip, darker than picture reds |
| subtitle text cream | `#fff1d6` | caption text |
| backlight radial | `#fff6d6` → `#ffc46e` → `#ec782e` | lit window behind a rosette |
| transmission sprite | `#b51d18` | the backlit rosette's red |
| paper shadow | `rgba(52,6,10,.38)` | drop shadow under each piece |
| night ambient | ~`rgb(214,214,236)` | night light map |
Rules: depth and role by paper tones one step apart, never by shading; ground and hero must be different paper families (red on red stops popping); gold foil only for one late moment, never a second main colour. Other ground families allowed: indigo night, warm rice-paper day, jade-green or black paper for non-festive topics.
### Typography
- Subtitles: a sturdy OFL serif, Fraunces SemiBold (Google Font) ~44 px at 1920×1080, cream `#fff1d6` on a red banner strip (`#a8111f`) with serrated edges and swallow-tail ends, centred 70 px from the bottom, with a paper shadow. Drops in on two 12 fps steps (like a couplet being pasted). Hold ≥ max(1.8 s, speech + 0.7 s); lines never overlap.
- Titles: cut-out letters, *yang*-cut with counters as real holes, Fraunces 800 (Google Font) on rice paper, popping in letter by letter on 12 fps steps, sawtooth border strips, a code-cut seal (the demo's 年 cut as a hole), an italic subline.
- Ma Shan Zheng (Google Font) is shipped in the demo's fonts folder (Chinese brush face); its exact role is not given in the docs.
- Small credits may be printed ink on paper. Case: demo title uppercase (*NIAN COMES TO TOWN*). Letter spacing: not given.
- Emphasis: by paper material (red banner, gold flecks), not by colour change in text.
### Layout
- Layers stay parallel to the screen; depth comes only from parallax and paper tones, never from perspective.
- Night village in three parallax layers (far hills / houses / bare branches) plus punched snow.
- Cutting close-up: the camera holds the scissor tip at ~32 % of the frame.
- Subtitle low and centred (70 px from bottom). Margins / grid: not given.
### Elements
- Every piece is paper: polygon silhouette with low-frequency hand-cut wobble (≈ 0.35 units), 1 px light rim upper-left and dark rim lower-right (the cut face); architecture and machines are straight segments + wobble, never smoothed (smoothing made houses look like bread loaves).
- Inset contour on every figure piece: a 1.5-unit slit 3.5 units inside the outline (the classic double outline; separates red-on-red overlaps).
- Paper shadow: offset 2.6/3.6 px, blur 5 px × zoom, `rgba(52,6,10,.38)`; stacked folded paper shows 2–6 offset darker edges.
- Paper grain: neutral-grey texture composited `soft-light` inside each piece (dye mottling ±7 % at ~130 px scale, fibres, specks), alpha restored with `destination-in` so holes stay holes.
- Folk cutting vocabulary (`motifs.js`): sawtooth rows (fur, grass, tiles, fringe), serrated edges, crescents (scales, quilting), swirls (joints), cloud cuts, rosettes, plum blossoms, coins, tapered slits.
- No floating islands: a closed ring cut would drop out; eyes are two crescents (upper + lower lid) leaving bridges, plus a pupil hole.
- Expressions are swappable face pieces (smile, surprise, fear, determined, asleep); faces never morph.
- Rosette (团花): one 45° wedge mirrored 8× (D4); 2×, 4×, 6× folds also possible; alternating rings of *yang* cut (band cut away, red lines left) and *yin* cut (lines cut out of a red field); faint fold-crease lines kept.
- Image treatment: none (no photos).
### Motion
- Characters step at 12 fps (pose sampled at `floor(t·12)/12`); camera, light, weather, flames and flying pieces move on ones at 24 fps.
- Rigs pin pieces at rivets (neck, shoulders, elbows, hips, knees, jaws, tails). Hard poses, tiny eases, 1-frame overshoots: "pop" = 1.15× for one step. Weight from size and camera shake (monster step ≈ 6 px frame shake).
- Fold: flap split into ~16 strips; each compressed by cosθ and enlarged along the fold by `1 + 0.28·height` (fake perspective), darkened as it stands up, back colour past 90°, growing shadow, crease after. About 0.5 s per fold (demo ≈ 0.55 s), each on a hit.
- Cut: pattern revealed through a mask of circles along the scissor path (r ≈ 62 units); offcut drops once the outer edge is passed; blades open/close on a beat subdivision (demo every 0.25 s = one eighth at 120 BPM); scraps flutter out and land. Blade axis follows the direction of travel, rivet slightly behind the cutting point.
- Unfold: successive unfolds a fraction of a second apart (demo 0.25 s), each flap swings folded → flat with ease-out (the "pa!" snap), then a scale bump and warm flash on the accent.
- Subtitle banner drops in on two 12 fps steps; title letters pop in one by one on 12 fps steps.
- Camera vocabulary: extreme close-up tracking the scissor tip (craft, a precise act); flat locked front view (emblem, title); slow parallax pan across layers (a village, a route, a timeline); low wide with a shape standing up from the ground layer (threat, scale); top-down tabletop (folding, cutting, sorting); push toward a lit piece, pull back to many (one act spreading); page turn / sheet peel (time or place change); pull back to an object in a room (the film was a made thing); rotation around a rosette's centre (cycles).
### Transitions and rhythm
- Transitions are paper actions only: fold, page turn, peel (demo: night sheet peels from the top-right corner to reveal the day sheet), a sheet flying off, a cut through the frame. No dissolves. Overlap outgoing and incoming paper actions so there are no blank frames.
- Demo rhythm: 120 BPM in 2/4 (beat 0.5 s, bar 1.0 s), 49 s, 12 shots of 1–7 s; windows go out one per beat; eight windows light one per eighth note, nearest first; a full music stop (2.5 s of wind and breath) before the climax; 0.5 s of silence right before the unfold downbeat.
### Finish
- No film grain at mux (the paper fibres are the texture).
- Night lighting: `frame × lightmap` plus warm pools; emissive backlit pieces (light × paper transmission via `multiply`, holes at full light); two-level bloom (10 px / 40 px blurs, half-res, strength ≈ 0.55), optional rays. Keep bloom low so the pattern stays legible at the centre.
- Projected pattern: a piece's hole mask squashed onto the ground (demo matrix `[1.25,0,-0.9,0.3]`) and added with `lighter`; on a character, masked by its layer alpha over a solid warm spot so cut features still read as holes.
- Backlit window: rice-paper fibres multiplied at 50 % over the radial light.
### 3D look (if any)
None. Pure 2D layered paper with parallax.
### Banned
No painting, gradient shading or outline strokes; not shadow puppetry (no light-behind-screen, translucent hide or rods; backlight is a saved special event); not flat vector art; not a silhouette film (every shape's interior is cut); no perspective depth; no dissolves; no smoothing of architecture; no floating islands in cuts; no morphing faces; red ground under red hero; gold as a second main colour; no studio characters, named artists' works or real motif sheets copied, and references never named in the film; no piano-and-strings, opera percussion or suona (keeps it apart from shadow-puppet and ink-wash); no film grain.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/papercut-red.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/papercut-red/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/papercut-red/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/papercut-red.mp4
### Gaps
No vertical-frame layout; no margins/grid; letter spacing not given; the role of Ma Shan Zheng is not documented; sizes are only the demo's at 1920×1080.

## Paper-cut Lightbox (layered shadow-box lamp)
- Source: `lemomo-ai/lemo-opuscar` `styles/paper-lantern/STYLE.md`, `DEMO.md`, `style.json` (No. 10, East Asian Traditions); licence: MIT (docs), demo film/stills CC BY 4.0, **except the demo's narration (Microsoft Edge TTS, `zh-CN-XiaoxiaoNeural`), which is excluded from CC BY: don't reuse it**; demo music is Kevin MacLeod "Ripples" + "Nu Flute" (CC BY 4.0, incompetech), Poly Haven assets CC0
- One line: a stack of 6–9 cut-card sheets in a shallow box, lit from behind, windows and moons burning through holes and every layer casting a soft shadow on the next; the camera is a macro lens inside a lamp.
- Suits: festivals (Mid-Autumn, holidays), gift brands, cultural stories, long-distance/"two places, one light" stories, keepsake framing. Real footage: no. 3D: yes in practice (three.js scene of flat planes with real soft shadows, DoF, bloom; the bookend room shots use a 3D walnut frame, table and Poly Haven tea set). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| night sky gradient | `#0a1330` → `#172a58` → `#2e4478` → `#43598a` | unlit back panel (z −0.135) |
| moon disc / halo | `#fffaf0` / `#fff0cf` / `#f7dca4` | moon + additive halo |
| auspicious clouds | `#c3cbe8` | far layer, trans .9 |
| far mountains | `#6a86c2` | trans .7 |
| mid mountains | `#3f5a92` | trans .45 |
| village walls / roofs | `#5a70a6` / `#1b284f` | trans .25 |
| window glow | `#ffb862` | emissive windows |
| river / moon trail | `#22325e` / `#e9cf96` | trans .3 |
| tree + bridge / blossoms | `#17224a` / `#d9a24a` | trans .12 |
| foreground bank | `#0e1532` | trans .05 (near-black front) |
| lanterns / lantern glow | `#0d1328` / `#ff8a48` | front, trans .05 |
| warm interior ladder | `#b08058` wall, `#6e3b1f` props, `#2e170d` figure, glow `#ffc878` | kitchen scenes |
| far city ladder | `#2a2456`, windows `#e8cc90` | violet city |
| seal red (accent) | `#b3302a` | seals |
| gold title paper | `#f1dbac` / `#f3d998` | titles, sign-off strip |
| box red / blue reply box | `#9e2a20` / `#2a4f7a` | the two story objects (two accents = two sides) |
| subtitle text | `#fbf3e4` | burned-in subtitles |
| real room | walnut tint `#8a6a52`, wall `#2a2018` → `#0a0806`, spill light `#ffc98a` | bookend room shots |
| paper rim / shade | `rgba(255,236,200,.35)` / `rgba(0,0,0,.28)` | top-edge light rim / bottom-edge shade, each shifted 3 px |
| example ladder: desert caravan | `#f0c890` → `#c07850` → `#6a3020` → `#1e0e08`, fires `#ffd080` | STYLE.md example |
| example ladder: winter forest | `#dfe6ee` → `#9aaec4` → `#4a6078` → `#101820`, one red scarf | STYLE.md example |
Rules: back layers bright and translucent, front layers dark and opaque, each layer one flat colour; never a pale front layer. One temperature per stack (changing ladder = changing place). Light is warm (amber–gold) and is the only saturated element besides one accent; a second accent only when the story has two sides.
### Typography
- In-picture text is paper: titles, letters, poems are cut strips inside the box, revealed by growing from an anchor edge (scale the texture repeat with the mesh so glyphs don't squash), with an optional small seal. Vertical brush calligraphy for Chinese titles, revealed column by column.
- Faces (all Google Fonts, OFL): Ma Shan Zheng (brush titles/poems), Zhi Mang Xing (running script), Long Cang (a child's handwriting), Noto Serif SC (subtitles, credits); Latin: Cormorant suggested.
- Subtitles: a quiet burned-in line under the box, Noto Serif SC 500, 40 px CJK / ~38 px Latin at 1920×1080, `#fbf3e4`, letter spacing .06em, soft black shadow, 74 px from the bottom; fade in 0.15 s before the line, out 0.3 s after. Split at the comma nearest the middle above ~21 CJK / ~42 Latin characters. Hold ≥ max(1.8 s, speech + 0.6 s).
- Words shown as paper are never also subtitled (never the same words twice).
- Credit block 19 px, two lines. Case/emphasis: emphasis by a character flashing on its spoken word, or a red seal.
### Layout
- World units in metres, y up. Box cavity 0.56 × 0.33 m, 0.16 m deep; layers from z ≈ −0.14 (sky) to 0 (front); in-box camera at z ≈ 0.3–0.56, fov ~26°. Full-bleed sheets ≤ 0.558 × 0.328 m (never larger than the cavity). Canvas resolution 5200 px/m.
- Framing: the story layer in focus, foreground and far layers soft; box edges either fully out of frame (inside shots) or clearly in frame (outside shots), never half.
- Subtitle centred under the picture, 74 px from bottom. Grid/margins: not given.
### Elements
- Paper layer = a Canvas2D drawing mapped to a plane; cut-outs punched with `destination-out` (needs an opaque fillStyle first or holes are half-cut). Finish on every sheet: tiled fibre grain (512², α .9, `source-atop`), warm top rim band and dark bottom band, each shifted 3 px.
- Emissive windows: a second canvas (white = light) gated by a 0→1 "switch on" uniform; bloom makes them burn.
- Silhouette figures: black faceless cut-outs, a body sheet + separate limb sheets anchored at the joint.
- Motif library: karst mountains with carved contour slits, ridges, auspicious clouds (祥云), waves, osmanthus, pine, willow, reeds, Jiangnan houses, pavilions, lanterns, mooncakes; interior props.
- Red seals; paper title strips; near-plane cloud curtain. Titles, lights and curtains in front neither cast nor receive shadows.
- Real-world set (optional): wood frame, black lining, dark room, area-light spill onto real objects.
### Motion
- Everything moves like paper on a stick: slide x/y, rotate about a pivot, scale in from 0 along one axis ("written out"), or light up. No squash and stretch, no morphing, no bending. Jointed figures animate rotation only.
- Light cues are the big motion. Lamp-on sequence: moon (0.5–3.2 s) → sky → each layer's translucency staggered by 0.42 s (rule ~0.4 s) → key light → windows → lantern flicker `1 + .06·sin(7.3t)·sin(3.1t)`.
- Hard action lands on spoken words via Whisper word timings (a mould slams on its word, a character flashes, a light arc grows).
- Camera: hand-held micro-drift ~0.6 mm (`hand ≈ .0006 m`) keeps locked frames alive; render on ones at 30 fps, never stepped. Opening push from room (z 1.45) through the frame to z ≈ 0.56 over a 7 s ease-in-out, then keeps creeping; ending pull-back z 0.5 → 1.08.
- Lens: aperture 12–26 in the post step, focus on the story layer; bloom e.g. strength .35, radius .6, threshold 1.15; grade e.g. exposure 1.05, vignette .42, saturation 1.05, contrast .1.
- Camera vocabulary: slow near-frontal dolly in (intimacy, a lit window) / out (context, loneliness); rack focus between layers (attention in depth); lateral travel with depth parallax (journey; layers scroll proportional to depth); top-down layer stack (a made thing); pull out of / push into the box (keepsake, "a story told"); locked frame with only light changing (vigil, a day passing); tilt up/down the stack; near-plane occluder wipe (curtain between scenes).
### Transitions and rhythm
- Dissolves 0.5–1.2 s, an iris (circular wipe from a centre), light off/on, a near-plane curtain (auspicious clouds) closing over the last 1.2 s of a shot and opening on the next, its two halves meeting exactly at their front edges. No whip pans, no digital zooms.
- Timeline anchored to voice lines: lines start at 2.6 s, each line = its spoken length + a per-line gap (e.g. 4.2 s for a title beat, 5.0 s for the ending); shots anchored to lines (e.g. start = line − 0.5 s), so re-voicing re-times everything. Demo 121.8 s (45–120 s works), 18 shots, slow storyteller pace, no drum kit.
- Silence: lamp switched off, everything drops to room tone, returns with the light.
### Finish
- Backlight shader: `emissive += albedo × lightCol × trans × lit × falloff × (.35 + 1.3·cloud)`, falloff `mix(.22, 1, exp(−d²/R²))` around a per-shot light point; tiled pulp-mottle texture; per-layer `trans` ~.9 far → ~.05 front.
- VSM soft shadows from a top spot (2048² map, radius 10) on every layer; never turned off.
- Custom DoF (CoC + 96-tap gather), UnrealBloom, gentle vignette, neutral tone map, sRGB; SSAA 2× so cut edges stay crisp; MSAA 4 half-float targets.
- Default grade (cool night): lift `[0, .005, .018]`, gain `[1.03, 1, .95]`; interiors set a warm lift (e.g. `[.012, .006, 0]`). Every grade key a shot omits must fall back to the default each frame.
- No grain at mux (grain 0). Final fade to black 1.2 s.
### 3D look (if any)
three.js 0.170 scene of flat textured planes parallel to the box front (never a 3D diorama); a top LED spot with VSM soft shadows, ambient fill, analytic additive glows; bookend room shots with an extruded walnut frame (Poly Haven `american_walnut_veneer`), walnut table, `RectAreaLight` spill (`#ffc98a`, intensity 6–7), hemisphere fill .25, Poly Haven `tea_set_01`, procedural bump-mapped mooncakes, PMREM room environment map. A Blender equivalent: planes with emission × translucency, area light behind, soft shadows, shallow DoF, bloom.
### Banned
Not flat paper-cut animation (must have depth, backlight, cast shadows); not shadow puppetry (no single screen, no rods); not a 3D diorama (every element a flat sheet parallel to the front); no squash/stretch, morphing or bending; no pale front layer; no sheets larger than the cavity; no whip pans or digital zooms; no drum kit (only single soft strokes); never the same words both as paper and as subtitle; no half-visible box edges; no copying a specific lamp design, film frame or character; no transparent radial-gradient textures for glows (square edges).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/paper-lantern.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/paper-lantern/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/paper-lantern/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/paper-lantern.mp4 (voice track not CC BY)
### Gaps
Frame size not stated explicitly (subtitle px imply 1920×1080); no vertical layout; Latin typography only sketched (Cormorant ~38 px); the demo is Chinese-language, the English path is described but not demoed.

<!-- category: Print & Printmaking -->

## Risograph Print
- Source: `lemomo-ai/lemo-opuscar` `styles/risograph/STYLE.md`, `DEMO.md`, `style.json` (No. 12, Print & Printmaking); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: animation that looks stencil-printed frame by frame; two or three translucent spot inks overprinting on warm paper, halftone dots, ink grain, and plates that never quite line up.
- Suits: indie brands, zines, lifestyle, small-figure-in-a-big-world stories, "something new arrives" structures (one plate per turning point), duets/overlaps of two things. Real footage: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper (demo) | `#F6F1E6` | ground; paper white = knockouts, highlights, subtitle strip |
| paper (rule) | around `#F4EEE2` | warm off-white, never pure white |
| ink 1 Riso Blue | `#0078BF` | plate R in demo, screen angle 15°, the one-ink silhouette plate |
| ink 2 Yellow | `#FFE800` | plate G, screen 0° |
| ink 3 Fluorescent Pink | `#FF48B0` | plate B, screen 75° |
| example set 2 | Teal `#00838A` + Fluorescent Orange `#FF7477` | two-ink option |
| example set 3 | Federal Blue `#3D5588` + Red `#FF665E` + Sunflower `#FFB511` | three-ink option |
Mixes are multiplied, not picked: Blue+Yellow = green, Blue+Pink = violet/indigo, Yellow+Pink = orange-red, all three ≈ black; 60 % Blue dots over solid Pink = purple. Rules: 2–3 spot inks, never more; every other colour is an overprint or a tint; no gradients except stepped halftone; at least one ink must carry a silhouette alone; skin = a light tint of the palest ink (demo: Yellow 26 %), never dots of a saturated ink; save the full overprint for the climax. Demo character recipes (plate densities): sweater Blue 40 + Pink 100; trousers Blue 75 + Yellow 100; hair Blue 100 + Pink 22; shoes Blue 100.
### Typography
- Type is printed on one plate, so it misregisters and grains with it; a title can be a "double-hit" on two plates with a visible offset (demo end card Pink + Blue, 10 px offset).
- Titles: heavy grotesque, Bricolage Grotesque 800 (Google Font); demo title "SUNDAY RIDE" 190 px at 1920×1080, uppercase, on the Blue plate in the sky, revealed by a left→right wipe on the first chord, removed on a beat.
- Captions/subtitles: geometric sans, Jost 500–700 (Google Font); demo subtitles Jost 500 42 px (rule ~40–46 px), 0.5 px tracking, Blue text on a paper-white knockout strip (zero ink, 6 px radius) centred 1000 px down; strip edges catch misregistration fringes. Hold ≥ max(1.8 s, speech + 0.6 s).
- Prints don't fade: titles arrive with a roller wipe or on a beat and leave on a cut. Preload every weight before READY.
### Layout
- One horizon, one big flat field or disc, one small figure; the figure's head against the flattest colour in the frame (demo: head against the sun disc).
- Lots of solid paper and solid ink; text on empty sky or a knockout strip; wide shots keep the sky big and empty for the title.
- Every area uses at most two plates, at most one of them as a tint; halftone only in a few stepped bands (rule 20/40/60/100 %; demo sky bands 20/38/62/100 %).
- Design for the one-plate version: every main colour contains some of plate 1, so a one-ink frame still reads; a deliberate exception stays blank paper until its plate arrives (a reveal).
- Margins/grid: not given.
### Elements
- Flat shapes, no outlines: colour fields and silhouettes.
- Paper-white knockout halo around characters, 4–5 px: stamp the layer 12 times in a ring with `filter: brightness(0)` (zero ink = paper), then draw the character; plates misregister around it like a real trap.
- Registration crosshairs in corners (end card); a printer and a stack of earlier prints for the scale reveal.
- Secondary motion (scarf, flag, tail) as a travelling sine wave.
### Motion
- Characters on twos (12 fps), camera on ones (24 fps).
- Registration is never jittered per frame: one fixed set of per-plate offsets per shot (±1–3 px) plus rotation ±0.0005 rad; a **kick** of ≈ 8–14 px decaying in ~0.25 s with slight ringing on an accent (title, plate arrival, a burst); a **drift** up to ~25 px through a held moment, snapping back on the downbeat.
- Grain boils partly: ~35 % re-rolls per print (rule "about a third"); sheet streaks and blots change only at cuts.
- Plate arrival: a per-plate gate plus a **roller sweep** (moving edge with a slightly heavier ink band) lets a plate arrive mid-shot.
- Simple cycles on few drawings (demo pigeon: a 4-frame flap cycle on twos; flocks stagger take-off by up to 0.35 s; pedalling crank angle = distance / wheelRadius / 2.2, legs by 2-bone IK).
- Camera vocabulary: wide lateral tracking with a small figure and empty sky (travel, routine, title); static wide with the subject crossing the frame (comedy of scale, Tati-like); locked horizon-disc-figure composition (stillness, the one pause); ground-level low angle with big foreground shapes (energy, burst); medium two-shot held for a look (reaction); straight top-down with long shadows (pattern, map); push into a halftone field until dots become shapes; pull back to reveal the paper (it was one sheet); match cut on a flat shape.
### Transitions and rhythm
- Overprint growths (a shape of one ink grows over the frame, turning everything under it into the mix, then shrinks into the next scene's key shape), roller sweeps, shape match cuts, hard cuts on beats. Never a cross-dissolve, never a soft digital wipe.
- Demo: 40 s = 20 bars of 2 s at 120 BPM (bossa nova, D major), cuts on even seconds, 11 shots of 2–8 s; a hook inside 3 s; each plate brings an instrument (guitar → + shaker/clave/brushes → + bass/whistle → + vibraphone); a fully silent bar under the climax drift; instruments leave one by one during the pull-back.
### Finish
- Pipeline: each frame drawn into one RGB canvas where each channel is one plate's density (R = ink 1, G = ink 2, B = ink 3; 0 none, 1 solid). `source-over` = true knockouts; `globalCompositeOperation = 'lighter'` adds ink only to chosen channels = true overprint. A WebGL2 shader then "prints" it.
- Halftone: cosine spot function on a rotated grid per plate, period ~6–8 px at 1080p (demo 7 px), anti-aliased threshold smoothstep ±0.07; densities ≥ 0.9 print solid; screen angles ≥ 15° apart (demo 15° / 0° / 75°). Dots are anchored to the paper (screen), not to objects: a pan slides the image under a fixed screen.
- Ink imperfection: grain ±0.08 on the dot threshold; pinholes in solids where noise > 0.93 (×0.75 density); ink density `k = 0.80 + 0.14·streak + 0.08·blot` (streak = noise stretched ×10 along the feed direction; blot = slow noise); paper fibre ±1.5 %.
- Composite: `paper × Π mix(1, ink_i, coverage_i)` (multiply of translucent inks).
- Reflections: each plate wobbles on its own phase (water).
- No grain added at mux (grain is in the print). Encoding: PNG frames → lossless yuv444 intermediate (qp 0) → one encode at CRF 16 `-tune grain` (or CRF 20 without); avoid JPEG 4:2:0 screenshots (they smear saturated dots); check at 100 % and 50 % for moiré. Use a well-mixed hash (`fract(vec3(p.xyx)*.1031)` family), not `fract(p*vec2(233.34,851.73))` (stripes).
### 3D look (if any)
None (2D).
### Banned
Not flat vector art with a noise overlay (every colour must come from plates); not CMYK pop-art halftone (no process colours, no keyline); not screen-print posters (riso ink is translucent and grainy); never the RISO brand, logo or machine trade dress (ink names are colour references only); never more than 3 inks; no three halftoned plates in one area (mud); no gradients except stepped halftone; no per-frame registration jitter or per-frame streaks; no cross-dissolves or soft digital wipes; no fading titles; no saturated dots on skin; never pure white paper; no copying Haugomat/Tati characters, compositions or palettes.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/risograph.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/risograph/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/risograph/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/risograph/demo/stills/modelsheet_v2.jpg (shows the "plates = story" row: one character with 1, 2, 3 plates)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/risograph.mp4
### Gaps
Exact per-plate registration offsets per shot not listed in the docs (only ranges); no vertical layout; halftone period given for 1080p only (scale for 1080×1920 must be chosen); no type sizes beyond the demo.

## Halftone Dossier (retro print case file)
- Source: `lemomo-ai/lemo-opuscar` `styles/halftone-dossier/STYLE.md`, `DEMO.md`, `style.json` (No. 13, Print & Printmaking); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a retro printed case file; cream archive paper, overprinted halftone dots in a few flat inks, huge heavy headlines with misregistered shadows, slamming rubber stamps and thick-outlined kawaii characters, read out one exhibit at a time.
- Suits: humour, pet content, social shorts, "the case against X" explainers, myth-busting/verdict formats, lists of counts/causes, mock investigations. Works with no voice (cards carry it). Real footage: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high (one of the best-specified: palette tokens, every motion constant, engine line map)
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F4ECDD` | light-scene background |
| navy (dark ink) | `#1D2340` | all outlines, body text, caption bar, fade-out colour |
| blue | `#2E55D6` | title background, halo dots, tables, one ink layer |
| pink | `#FF5A87` | accents, misregistration shadow, caption offset shadow, verdict stamp |
| yellow | `#FFC628` | highlight keywords, numerals, starburst, folder |
| orange / ored | `#F58A34` / `#D9621E` | mascot fur / stripes (character-owned colours) |
| cream | `#FFF4E2` | bellies, paws, text on dark |
| red | `#E8384F` | stamps, alarms, REC dot |
| night / night2 | `#18203F` / `#2A3568` | night-scene ground / its dots |
| mint, skin | `#56C29E`, `#F7C9A1` | tiny accents only |
| numeral fill alt | `#FFD3DF` | pale pink flat fill under halftone |
| paper vignette | `rgba(120,100,80,.35)` | radial vignette in the paper layer |
Rules: paper ground + one dark ink (outlines, text, caption bar, fade) + four or five flat spot inks: one is the overprint-shadow ink, one the highlight for keywords/numerals, one warm red reserved for stamps and alarms. Flat inks only, no gradients or transparency ramps: tone = dot size + overprint. Night/"secret" scenes switch to a dark ink ground with a lighter dot layer of the same family, still multiplied by paper. Max five inks + paper. Example alternates (no hexes given): cream/navy/cobalt/hot pink/yellow/red; manila/sepia-black/teal/mustard/vermilion; off-white/forest green/tomato/sky/ochre.
### Typography
All Google Fonts (OFL), self-hosted, `font-display: block`, preloaded before layout. Sizes at 1920×1080.
- Headlines: black-weight serif, Noto Serif SC 900 (CJK) / a black slab for Latin, 100–230 px (Latin ~130 px max), left-aligned at x ≈ 120–170, with a misregistration shadow +8/+8 px in pink or yellow, multiplied. Always built with per-character pop, never faded.
- Display/numerals: Bagel Fat One (title word 330 px; count numerals 700–760 px bleeding off the right edge; times, big numbers).
- Interjections: ZCOOL KuaiLe, cream fill + thick navy stroke (16 px) + blue offset shadow.
- Data/HUD: JetBrains Mono 800 (case numbers at 22 px, dates, rulers, file names, clock). Sign-off line 30 px, letter spacing 3.
- Captions and stamps: Noto Sans SC 900 (Latin: a black-weight sans).
- Caption bar (the subtitle): navy rounded pill (radius 14) with a pink +8/+8 multiplied offset shadow, 46 px cream text, keyword in yellow or pink; pops in over 0.4 s with a slight −1.2° tilt ~1 s after the headline, holds to scene end (≥ max(1.8 s, speech + 0.6 s)); sits bottom-centre at y = 980.
- Stamps: 120–210 px text, 1–2 words in Latin (GUILTY, ACQUITTED, CLOSED). Case: Latin stamps uppercase.
- Emphasis: keyword colour in the caption bar; giant halftone numerals; stamps.
### Layout
- Flat, frontal printed page: headline top-left, subject right-centre, caption bar bottom-centre (y = 980), HUD in the corners (top-left case number + chapter chip, e.g. "Count 01 | testing gravity"; top-right blinking REC dot + date; colours invert on dark scenes; hidden on the title card).
- One idea per 2–4 s card: one big headline, one gag or exhibit, one caption line.
- Faint centre fold at x = 960. Margins: headline x ≈ 120–170 px. Grid: not given.
### Elements
- Halftone: a rotated grid of circles drawn as one SVG path; step 20–26 px (never < ~14 px at 1080p, moiré); per-layer screen angle (15°/20°/25°/30°/45°/60°/70°); radius = density × step × maxK, maxK 0.6–0.72 (~0.7 merges into solid). Density fields: `radial(cx,cy,R,pw)` halos/blooms/corner glows, `edge(R,pw)` dots crowding the frame border, linear ramp `0.25 + 0.75·clamp((y−250)/650)` "lit from above". Second layer `mix-blend-mode: multiply` so inks overprint.
- Halftone-filled numerals/shapes: flat fill then a darker halftone clipped to the glyph (unique clipPath ids).
- Paper layer (built once, multiplied over everything): 96×54 random tile (grey 242–255) upscaled for mottling, per-pixel noise ±13 with a −4 blue bias (warmth), radial vignette, faint fold line.
- Grain layer per frame: 520 cream specks (r 0.6–2.4, α .75) + 90 navy specks, reseeded every 2 frames (dust, not film grain).
- Line boil: `feTurbulence` 0.022 → `feDisplacementMap` scale 5, reseeded every 0.1 s (40-seed cycle) + fine ink-grain mask (frequency 0.75) eating a little of each fill. Characters and hand-drawn props only, never text, dots, HUD or captions.
- Characters: chunky kawaii shapes, 7 px navy outline, flat fills, cream belly/paws, pink ear-insides and cheeks, round-capped stripe strokes; big glossy eyes (navy ellipse + two cream highlights) that squint, blink or close into a happy arc; one shared head rig with a `setFace` interface.
- Stamps: double rounded rectangle (outer border 10–14 px, inner 0.35×) + bold text, through an ink filter (displacement 7 + coarse grain mask), opacity 0.93, tilted −10° … +12°.
- Props: 24-point starbursts, speech bubbles (cream, 6 px navy stroke), hearts, 5-colour flipping confetti, radial rays (28 alternating wedges rotating 12°/s), paw prints, sticky notes, folders, clocks, height chart + name plate (mugshot), pinned evidence cards, redaction bars.
### Motion
- 30 fps transforms; line boil at ~10 fps on characters.
- Everything enters with overshoot: back ease (overshoot 1.9) over 0.3–0.45 s, rising from below frame (e.g. y 1200 → 470) or scaling from 0. Nothing fades in.
- Per-character pop: each glyph drops 30–100 px and squashes in, stagger 0.05–0.08 s (0.02 s small text; Latin 0.02–0.03 s).
- Title letters fall 700 px in 0.2 s each, 0.25 s apart (one per eighth at 120 BPM), then squash with a damped cos wobble.
- Stamp slam: 0.09 s from 2.6× to 1× (ease-in), then a 5 % damped bounce; camera shake + white flash + stamp SFX on the same frame.
- Squash landing preserving volume: `sq = 1 − k·e^(−a·7)·cos(a·20…22)`, applied as `scale(1/sq, sq)`.
- Run cycle: 4 capsule legs ±50° at 30 rad/s, body bob `|sin(28t)|·12`, stretch `scaleX 1 + 0.35·speed`, 4 speed lines.
- Idle: breathing ±2 % y-scale, tail sway, ear twitch, scripted blinks, twinkles, REC dot at 1 Hz, clock colon blink.
- Camera (2D group): beat pulse ~0.6 % on every beat in groove sections; slow push-in 1 → 1.05 over 4 s (profile) or 1 → 1.08 ease-in over 2 s (tension before a verdict); shakes with quadratic decay and different sin/cos x/y frequencies, 5–26 px (16 px first stamp, 14 px crash, 26 px / 0.45 s verdict, 5–7 px small landings); flash frames white 0.95 → 0 over 0.3 s (big hits capped at 0.5); pan across a pinned board; snap zoom into a halftone detail; page turn / folder slide; pull back to the desk.
### Transitions and rhythm
- Dot wipe: an 80 px grid of circles grows to r = 62 (full cover; must cover the cell diagonal) and shrinks over 0.44 s centred on the cut with a diagonal delay; the scene switches while covered; each cut can have its own wipe colour. Hard cuts reserved as contrast on big hits (the drop). No dissolves.
- Demo: 30 s at 120 BPM (bar = 2 s), every cut on a bar line; title 1 bar → accusation 1 → mugshot 2 → counts 2+2+2 → summary/build 1 → verdict on the drop 1 → reason 1 → close 2. Three counts suit 30 s, five suit 60 s. Silence before the stamp: the first half of the drop bar is empty so the stamp lands alone. Final fade to navy over 0.7 s.
### Finish
- Paper multiply layer + vignette + specks (above); dark scenes still multiplied by paper so they look printed, never glowing.
- No film grain; no gradients. Master encode CRF 12, delivery x264 CRF 16.
### 3D look (if any)
None (SVG + Canvas 2D).
### Banned
No gradients or transparency ramps; never fade text in; no boil on text, halftone, HUD or captions; not Risograph (no grainy two-ink riso as the whole look, no zine collage); not Swiss motion (no grid-driven kinetic type on white); not Game Show Flat (no candy sets, rhythm-game rounds); dots, paper and stamps must be visible in every frame; no dissolves; no 100 % white flash; dot step < ~14 px; more than five inks; never copy the pop-art/comic references.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/halftone-dossier.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/halftone-dossier/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/halftone-dossier/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/halftone-dossier.mp4
### Gaps
Demo text is Chinese (English adaptation described, not demoed; no Latin slab named); no vertical layout; no narration guidance beyond "deadpan report voice"; hexes for the alternate palettes not given.

## Woodcut Print (relief print that carves itself)
- Source: `lemomo-ai/lemo-opuscar` `styles/woodcut/STYLE.md`, `DEMO.md`, `style.json` (No. 15, Print & Printmaking); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: every frame is a black wood block and light exists only where a knife has cut it away; plates carve stroke by stroke, with at most one colour, kept for the thing that burns.
- Suits: folk tales, craft brands, book trailers, labour/perseverance stories, wordless-novel sequences, "a line becomes a world". Real footage: optional (a `woodcutFilter` turns a photo or video frame into form-following cuts, ~1,900 cuts / 140 ms per 1080p frame). 3D: no (close-ups use small 2D height-field sculpts). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ink | `#111111` | the uncut block, captions |
| paper | `#EFE8D8` | warm laid paper: carved whites and the margin |
| wood block | `#D8C29C` | only in shots that show the block itself |
| colour plate "copper" | `#C8502A` | the one thing that matters (molten metal), printed only on carved white |
| engine example plate | `#D97757` | warm orange spark in the minimal engine example |
Rules: two values carry everything (near-black ink, warm paper); at most one colour plate, printed only where white has been carved so it glows out of the cuts and never sits on black; reserved for one meaningful thing, may spread at a peak and shrink to a single highlight. Example plates (no hexes): burnt copper-orange (heat), cold Prussian blue (water, night), deep oxblood (wound, seal). Never grey on grey.
### Typography
- Captions: letterpress in the bottom paper margin, never over the image; IM Fell English (Google Font) ~40–44 px at 1920×1080 (demo 42 px), ink `#111`, pushed through the same print shader. Ink comes up in 0.1 s with no slide, fades over 0.15 s. Hold ≥ max(1.8 s, speech + 0.6 s).
- Titles: carved, not typed, in IM Fell English SC (Google Font); mirrored while the block is shown, readable once the print is pulled. Closing text: a fresh print (letterpress in the margin, or carved out of a black panel).
- Few words: four or five spoken lines at most. Case / letter spacing: not given.
### Layout
- Each shot is one printed plate inside a paper margin. Demo print frame at 1920×1080: image area `36, 36, 1848×912`; bottom margin 132 px holds captions. The image edge is the block edge (ragged ink, never a clean rectangle).
- The paper margin never moves; the camera moves over the paper.
- Framing: black masses on carved white or white on uncut black; text only in the margin; the knife tip or the brightest cut is the focus.
### Elements
- Knife classes (px at 1080p, 1× camera): knife `k` 1.2–2 (contours, the white halo separating a black figure from a black ground); V-gouge `v` 2–8 (hatching, hair, fine light); U-gouge `u` 10–22 (rays, sky sweeps, first rough-out); stab r 3–8 (snow, sparks, chips).
- Hatching (Doré grammar in wood): direction follows form (arcs around round things, fall lines on slopes, radiating light/fire, cloth folds); width follows tone (bright = wide cuts nearly merging, mid = thin, dark = uncut); far = dense and fine, near = sparse and coarse. Every line a separate cut 30–160 px, blunt entry, tapered exit, chipped edge; long cuts (14–50 × spacing) to avoid chevrons.
- Figures: black silhouette + white knife halo + grazing-light hatching on the lit edge only (light z ≈ 0.2; 3–6 cuts), skin carved white with features left black, a black keep-line around white parts.
- Close-ups: a small height field (capsules, blobs, planks, creases) lit and run through `woodcutFilter` (luminance → cut width, structure tensor → cut direction).
- Carved light: radial ray bursts (e.g. 36 rays, r0 300, r1 420–640, width 10).
- Image treatment: photos/frames re-cut through the filter, never threshold-filtered.
### Motion
- Characters on twos (12 fps); camera, particles, fire and light on ones (24 fps). Hatching lives in each body part's local space so cuts move with the limb and don't boil; only fire and liquids re-cut every 2 frames (deliberate boil).
- Key actions: anticipation (a few frames back) → a 2-frame strike → settle + short shake (demo hammer: lean back 4 frames → strike 2 → settle + 3-frame camera shake).
- Carve reveal: nothing fades in; each stroke has its own start time and speed (0.08–0.35 s); coarse gouges first, fine lines after; reveal keys `light` (bright areas first), `radial` (from a point), `down`, or any function.
- Hard cut = a new impression: two frames of misregistration (demo jolt [5,−3] then [−2,1] px).
- Paper transition: brayer rolls ink (wet highlight sweeps) → paper lays down → baren spirals and the image soaks through → the sheet peels on a cylinder toward camera, heavy then fast, its back showing mirrored show-through.
- Camera vocabulary: track with the knife tip (making); continuous pull-back as cuts spread (demo 3.5× → 1×, and 8× → 1× as a bell rings so sound and camera travel the same distance); locked plate (reading time); slow macro push on a sculpted close-up (demo 1.0 → 1.13 over 4 s); snap zoom (0.2 s) and hold (1.3 s); frame in a frame (door, window, arch); hard cuts on the beat, each a new impression (demo montage 1/1/1/.5/.5/.25/.25 s); crane up from detail to whole; rack between two plates via the peel.
### Transitions and rhythm
- Hard cut (new impression) or the paper peel; never a dissolve.
- Demo: 58.5 s, 17 shots; tempo grid 60 BPM switching to 90 BPM by a 3:2 metric modulation (60's triplet eighth = 90's eighth); cues checked to 0 ms against picture. Two real silences: 2.6 s at −40 dB (distant wind only) and 3 s of digital silence (−91 dB) before the loudest moment. J/L cuts carry sound across plates and peels. Wordless-novel pacing: a silent plate after a failure.
### Finish
- Mask (white = cut) through a WebGL2 print compositor: knife burr on edges, ±6 % ink unevenness, wood-grain streaks, specks where ink didn't take, a mottled colour plate with a small fixed misregistration (demo 3 px); per-impression ink seed, paper seed.
- Block mode (shots of the block): glossy inked wood with grain sheen, pale wood in the grooves.
- Mux grain 6; encode CRF 28 with `-tune grain` (CRF 19 gave 326 MB for 58 s, CRF 28 gave 93 MB with no visible difference at 1:1).
### 3D look (if any)
None. Close-ups are 2D height-field sculpts shaded and filtered into cuts.
### Banned
Not copperplate engraving (no swelling burin lines on white, no crosshatch built up from white ground); not linocut poster art (no flat colour areas); not a photo run through a threshold filter (cuts must follow form); nothing fades in; no dissolves; no colour sitting on black; the colour plate is never decoration; no hatching on every surface (reads as fur or rain); no black faces with white cuts at small sizes; no hand-drawn close-up props (use height fields); no steam/smoke drawn over the subject (reads as flames); no text over the image; never copy Masereel/Ward/Kollwitz/Doré plates, figures, borders or titles; no timbre of the story's key object before it appears (sound rule).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/woodcut.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/woodcut/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/woodcut/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/woodcut/demo/stills/engine_example.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/woodcut/demo/stills/frame_filter.jpg (a photo re-cut by the filter)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/woodcut.mp4
### Gaps
No vertical frame/margin layout; exact print-shader values beyond ±6 % ink and 3 px misregistration not in the docs (would need `engine/print.js`); title sizes not given.

## Copperplate Engraving
- Source: `lemomo-ai/lemo-opuscar` `styles/engraving/STYLE.md`, `DEMO.md`, `style.json` (No. 53, Print & Printmaking); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a 19th-century natural-history intaglio plate that engraves itself: a burin cuts swelling lines, a proof is pulled, hatching builds tone, magnified roundels fly to the margins, and a hand-laid watercolour wash arrives last.
- Suits: museum/case labels, science explainers ("one minute on…"), textbook figures with labelled parts, craft heritage (watch, violin, knife), maps and site plans. Real footage: no. Archive/data: only the user's facts. 3D: no (analytic tone fields in 2D). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| laid paper | `#f1e8d2` | the sheet, world-space texture (fibres, laid lines) |
| foxing | `#9a6a34` | sparse paper spots |
| plate tone | `#e8ddc2` at 55 % | inside the pressed plate mark |
| ink | `#1c1510` | every line; warm near-black |
| subtitle script | `#2b1e14` | Pinyon Script on the paper slip |
| subtitle slip | `#f4eddb` | deckled paper slip, soft shadow |
| wash: abdomen | `#d9962a` | hand colouring (demo) |
| wash: thorax | `#a8743e` | |
| wash: head | `#8a6242` | |
| wash: eyes | `#6e4a3c` | |
| wash: wings | `#a9c3cf` (alpha 0.5) | pale blue-grey |
| wash: legs | `#7a5a3c` | |
| wash: pollen | `#eaa21a` (alpha 0.95) | the one stronger pigment |
| copper gradient | `#5e2a12 → #94502c → #4e220e` | opening copper close-up |
| groove trough | `#240c05` | cut line in copper; burr `rgba(255,226,186)` toward the light |
| burin steel | `#d9e0e6` lit / `#262b30` shadow | tool faces |
| engine example wash | `#D97757` | "only colour" example in the engine reference |
Rule: the print is two values (paper and ink); all tone is line density, never a grey fill. Colour is transparent wash only, muted earth/mineral pigments, one stronger pigment at most, never on lettering, rules or paper outside the figure; reserve it (whole subject at one moment, one part, or none). Example sets given: amber insect + blue-grey wings; sea-green coastal band on buff land; one madder-rose organ on a black plate.
### Typography
- Roman capitals: Bodoni Moda (Google Font). Title ~44–56 px with wide tracking (demo 50 px, tracking 0.16); labels ~15–19 px (demo 17 px, tracking 0.14). Sizes at 1920×1080.
- Italics for scientific names, 20–24 px (Bodoni Moda italic).
- Script for notes: Pinyon Script (Google Font), demo 29 px; fixed size, balanced over two lines, never shrunk.
- Roman letters are cut glyph by glyph; script is written in one left-to-right stroke. Nothing fades in.
- Subtitles: Pinyon Script 38 px `#2b1e14` on a deckled paper slip, bottom centre, max width 860 px, ≤ 2 lines, on 0.1 s before the line and off 0.6 s after, never over a label or the call to action. Hold ≥ max(1.8 s, speech + 0.6 s); an engraved note stays chars ÷ 12 + 1 s from when it starts writing.
- Emphasis: hierarchy roman title → italic Latin name → script note; colour never on type.
### Layout
- The sheet is the world: 1920×1080 world units. Plate mark (pressed, bevelled rectangle) at (70, 44)–(1850, 1036); bevel dark on top/left walls, light on bottom/right. Ruled border: 2.4 px rule + 0.8 px hairline 9 px inside, (100, 72)–(1820, 1008).
- Centred subject inside the plate mark; labels and roundels in the margins. Roundel slots: upper left (300, 300), lower left (300, 700), lower right (1620, 700), upper right (1620, 300). An unused slot shows the specimen at natural size (plate ≈ 20 cm wide, so a 13 mm bee is 0.19× the main figure).
- Order details so push-ins never crop a fresh note (consecutive details on one side).
- Density: sparse lettering; the final plate shows every label, credits ("del." / "sculp." convention) and the call to action at once.
### Elements
- Line families with width ratios: outlines 1.8–2.4 px swelling ×0.45–1.35; first hatching 0.18–2.0 px; cross-hatching ×0.78; third (lozenge) family ×0.6; hair and stipple 0.6–0.9 px. Spacing relative to the figure (~1/180 of its height): on a 600 px figure 3.1–3.7 px (first), ×1.1 (cross), ×1.25 (third).
- Swell law for each hatch line: width × (0.2 + 0.8·sin(πu)^0.7), tapered over its first and last ~22 %. Families switch on at tone thresholds ~0.14, ~0.46–0.5, ~0.74–0.78 on a 0–1 tone. Contours cut in several runs that pinch where runs hand over.
- One light direction for the film (demo `{x: −0.55, y: −0.62, z: 0.56}`, upper left); tone fields from shape (pillow lighting, analytic sphere/cylinder fields), never texture; geometric occlusion (lines stop at shapes in front, occluders passed as `excl`).
- Magnification roundels: radius 120, double rule (2 px + 0.75 px, 4 px inside), ruled ground of horizontal lines every 11 local units with a white halo round the subject; content authored at 500-unit radius and scaled in.
- Leaders: 0.95 px hairlines from a dot on the part to the rim, ≥ 34 px clearance (one waypoint), small italic figure number at the root.
- Hand colouring: multiply over paper, under ink; 3.5 px spill, 2/1.5 px misregister, tide-line at the wet edge, low-frequency density lift 0.55, 1–2 backruns in large regions, granulation; each region blooms from where the brush touched.
- Copper close-up: polished warm metal, polishing hairlines, soft reflected 4-pane window (blurred 14 px over a 90 px room glow); grooves = dark trough + bright burr toward the light; burin (lozenge shaft, bevelled face, brass ferrule, mushroom wooden handle) turned 0.22 rad (≤ 15°) off the line; swarf = narrowing copper ribbon curling irregularly, one edge lit.
### Motion
- Cutting order is the animation: outline → first hatching sweeping across each form → crossing → darks, hair, stipple. Constant burin speed; many strokes at once (demo 6–90 concurrent: a few for outlines, dozens for hatching). Full build kept to a few seconds (demo < 5 s, 3.2–6.2 s).
- Long single stroke followed by the camera, started partly cut (demo first line 5.4 s, already one third cut at frame 0).
- Roundels fly on an eased arc with a small lift (demo 30 px at mid-flight), growing log-linearly to radius 120.
- Colour blooms from one point with a ragged front and a wet rim that dries; regions 1.25–1.6 s each, starting 0.42 s apart.
- Nothing fades or slides like UI: lines are cut, text cut or written, colour blooms, sheets pressed, peeled or laid down.
- Camera = a loupe over a sheet. Vocabulary: loupe following the burin tip (demo 4.2× with 3° roll); log-zoom pull-out (demo 4× → 1× in 3 s); push to a part and ride with its roundel (demo 4.3× easing out to a 1.45× reading frame); tilt/pan along the sheet at reading zoom; pull back while something flies; locked frame or ≤ 2 % breathing push; raking view across the copper; cut from mirrored copper to true proof.
### Transitions and rhythm
- Transitions from printmaking only: proof pulled (sheet peels across, demo 0.7 s), tissue guard laid over, region burnished out and re-cut, new sheet on the bed. No dissolves, no wipes.
- Demo rhythm: harpsichord + string quartet, 96 BPM, D major, 4/4 (beat 0.625 s, bar 2.5 s, 16 bars = 40.0 s); strings pizzicato while lines are cut, bow used only when colour arrives; true digital silence 25.0–26.25 s before the first wash; final plate on a V–I cadence. Details sections: first 9 beats, others 7 beats each.
- Use-case holds: museum label title ≥ 2.2 s, note ≥ chars/12 + 1 s, final ≥ 4 s (30–40 s total); "one minute on…" number ≥ 2.5 s alone (35–60 s); map inset ≥ 3 s, legend ≥ 4 s.
### Finish
- No film grain or vignette specified; the texture is world-space paper (fibres, laid lines, foxing) that zooms with the camera, plus the pressed plate mark bevel. Copper scene uses a blurred reflected window (14 px) and room glow (90 px). Wash effects (spill, misregister, tide-line, backruns, granulation) carry the finish.
### 3D look (if any)
None; volume comes from analytic 2D tone fields (`B.sphereTone`, `B.cylTone`, `B.formTone` pillow lighting).
### Banned
Uniform-width lines (reads as pen/vector); any grey fill in the ink; opaque colour; colour on lettering, rules or paper outside the figure; fades and UI-style slides; dissolves and wipes; burin skew > 15° (reads as poking); a regular swarf helix (reads as a spring); leaders hugging the subject; outline-only parts beside a hatched body; not a woodcut, pen sketch, engineering drawing or sepia filter; never copy a historic plate, pose, border or title.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/engraving.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/engraving/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/engraving/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/engraving/demo/stills/engine_example.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/engraving.mp4
### Gaps
No vertical layout (plate mark, roundel slots and margins are all 1920×1080 landscape); no grain value; camera easing curves not named (only "eased", "log-zoom"); the hatch engine (`burin.js`, 33 KB) was not read, only its documented API.

## Silkscreen Travel Poster
- Source: `lemomo-ai/lemo-opuscar` `styles/silkscreen-poster/STYLE.md`, `DEMO.md`, `style.json` (No. 54, Print & Printmaking); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a WPA-style national-park poster screen-printed on camera, one opaque flat ink per squeegee pull and per beat, stepped colour bands instead of gradients, facts printed last in a dark info band.
- Suits: trail/attraction guides, event and festival posters, destination series, product drops with colourways, seasonal/opening-hours notices; works with no narration. Real footage: no. Real data: only a few user facts (names, distances, dates). 3D: no (multi-plane 2D parallax). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F2E8D2` | cream stock; unprinted paper is the brightest colour (water, snow, beams) |
| dawn: sky1, sky2, far, mid, near, sun | `#F6CD98 #EE9A73 #9A7FA8 #3E7079 #1E3B3F #FBE6B4` | demo poster palette |
| noon | `#E4EEDC #86BCD0 #C2AE92 #4C8753 #1D4331 #F2C14A` | demo poster palette |
| golden | `#F7D787 #E9A94F #A57C68 #5E7A45 #2B3A28 #FFF1C4` | demo poster palette |
| dusk | `#F4B461 #D8613F #7C3E5F #43325A #1B1B2F #FBE3A6` | demo poster palette |
| title banner | `#F7C66B #E4683F #2F6F73 #1C2A33` | 4:1 title banner inks |
| example: harbour noon | `#E8F0F2 #7FB3C8 #D9C7A3 #2F6E8E #173247 #E8553D` | STYLE.md example (sky1 → near, accent) |
| example: winter | `#EEF1F4 #B8C9D9 #8B9BB0 #4A5D78 #1F2A3C #F2B134` | STYLE.md example |
| engine example | `#1C2A33` sky, `#D97757` spark | minimal engine example |
Rule: one palette per poster, ≤ 6 inks assigned by role (light sky, deep sky/bands, far, mid, near = darkest and also the info band, one bright accent for sun/route/key number; optional lit-face `glow`). Values step far (light) → near (dark): depth is value, never blur. The accent is rare. A series = one template re-inked in a new palette per item. Text inks are chosen by WCAG contrast against the ink underneath (`pickInk`), never a fixed key.
### Typography
- Condensed display for names and values: Big Shoulders Display (Google Font; demo 900 for names, 800 for values) or League Gothic (Google Font); auto-fit.
- Letter-spaced labels: a geometric sans, e.g. Outfit 600 (Google Font).
- Sizes in poster units (poster = 1000×1500 u): trail name up to 122 u, auto-fit 122 → 60 u; stat labels 34–38 u; values 48–68 u (min 48 u); park header tracked out at 62 u; banner title auto-fits 132 → 60 u. On a wall at 0.49 scale at 1080p: labels ~18 px, values ~31 px (rule: labels ≥ ~18 px, values ≥ ~30 px at 1080p).
- Headers are printed into the sky, tracked out; the info band is printed last.
- The poster text is the subtitle; no floating captions. With a voice, subtitles are a printed strip (a band pull).
- Reading rule: each text stays ≥ chars/12 + 1 s (min 1.5 s) after its last item lands; ≥ max(1.8 s, speech + 0.6 s) with voice; computed from content and rounded up to the beat.
- Emphasis: the accent ink (number `01`–`04`, elevation `↑1,100 M`, difficulty), and scale of the condensed display.
### Layout
- Poster template 1000×1500 u: 26 u paper border; art area to y = 1140 (scene shifted up 50 u, cropping a little sky); info band y 1148–1474 in `near` ink holding name, number in `sun`, a 6 u `sun` rule, and a row of stats with content-sized columns.
- Title card: a printed 4:1 banner (1800×440 u, two balanced lines) filling the frame width with ≈ 5 % margins and ≈ 40 % of frame height; it becomes the header of the final wall (hung 1150 px wide). A 7:1 banner is a sliver in 16:9.
- Close-ups on a band keep the whole band in frame with ≥ 5 % side margins (z ≤ 1.75 for a 1000 u poster); close-ups on a sheet keep its edge in frame.
- Final lockup: a series wall of all prints (hold ≥ 3 s).
- Table: a real workbench (planks, grain, knots, muted ink stains, torn tape), never random dots.
### Elements
- One `Path2D` per ink layer; knock-outs are holes in the path. Hard edges, no line work: an edge is where an ink stops.
- Registration: each layer offset 1–3 px at 1080p (demo `reg: [2, -1]`); a knocked-out shape leaves a crescent of bare paper.
- Overprint edge (trap): a faint multiply ghost ~2 u off under each ink, darker sliver where ink laps ink; done with fills only (fill, then fill shifted inside a clip), never strokes.
- Ink thickness: light rim top-left, dark rim bottom-right; fresh ink wet sheen that fades within ~1 s (fade by time).
- Stepped bands (`bandSteps`) replace gradients: a flat colour, thinning stripes, the next colour. Concentric sun rings.
- Shapes: midpoint-displaced ridges with a jagged lit facet; pines as one outline of drooping tiers + trunk; water as a flat body with horizontal glint bars; forests as rows of pines on a solid base.
- Squeegee: blade, round ink bead (lit half, dark underside, rolling glints, viscous strands; split fountain = several colours in one bead), sliver of handle. Hinged screen with mesh, emulsion and tape; its shadow is a ring (even-odd), never a full rectangle.
- Route: a dashed accent line stamped segment by segment. Difficulty as filled triangles.
### Motion
- Pulls are linear and steady (a squeegee doesn't ease), revealed by a ragged squeegee front used as a clip with a ~30 u drag tail. Accent inks start half a beat after their layer's main ink (`sub: 1`).
- Info items print left to right on beat subdivisions (demo 0.18 s each on eighth notes). No fade anywhere.
- Screen lift: frame hinges up (vertical squash + growing shadow) in ~0.4 s.
- Palette re-ink: a wide squeegee travels diagonally (demo blade at −12°) over the sheet in ~0.35 s; geometry identical either side of the blade, only inks change.
- Loose layers: in a multi-plane move planes parallax by depth with paper gaps (demo 3 u) and thickness shadows (9 u at 28 %), scaled by "looseness", then snap into register (zero) on one hit. Demo climb parallax `(camTopY − camY) × (depth − 1) × 0.42`; spurs slide sideways by a Gaussian bump 190 u × depth.
- Camera vocabulary: truck with the squeegee with slight roll (demo −1.7°) and frame edge in view; locked top-down full sheet; fast pull-back as the screen lifts (demo ease-out 0.65 s); push + tilt to the info band; truck through a foreground silhouette in screen space (poster to poster); crane through loose planes (multi-plane parallax); slow lateral dolly along a row of prints; push into the mesh until the weave shows; log-zoom pull-back to the wall (hold ≥ 3 s).
### Transitions and rhythm
- Layers change by squeegee; posters change by trucking through a foreground silhouette (tree, lamp post, sail) in the previous poster's `near` ink, centred on the switch so full cover lasts ~1 frame (0.4 s of cover read as a dark blank); or by a table move. The film ends with a squeegee pull. No dissolves, no bare cuts.
- One pull, one hit: each ink lands on a musical event; accelerate by subdividing (demo poster 2 doubles to eighths), not by changing tempo. A registration snap is the loudest downbeat. Music drops out for a beat before key facts (demo silences 18.0–19.2 s and 23.4–24.0 s).
- Demo: American outdoor folk, 100 BPM, D major, chords D – D/F# – G – A climbing as layers come nearer; 38.4 s; trail guide holds: title 3.2 s, stat row ≥ 2.2–3.0 s after last item; 3 trails in 30–40 s (4 trails ≈ 45 s).
### Finish
- Texture budget: fine paper tile (0.6 u per texel), mottle multiply ~55 %, pinholes ~75 % (paper colour, visible only on ink), then light ffmpeg grain (demo `mux.sh … 24 3`). More reads as risograph.
- No blur for depth, no glow, no halftone.
### 3D look (if any)
None; depth is multi-plane 2D parallax with paper-thickness shadows.
### Banned
Gradients (use stepped bands); halftone; fluorescent/translucent ink; line work; fades; dissolves and bare cuts; blur for depth; strokes for edge effects on unioned paths; full-rectangle screen shadows; cool shadow facets beside water (read as water); jagged ink beads; parallax without paper gaps; fixed text inks on night palettes; random coloured table dots; 7:1 banners; not risograph, ukiyo-e, woodcut or low-poly; never copy a real poster's composition, park name, lettering or logo; never name a real agency.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/silkscreen-poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silkscreen-poster/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silkscreen-poster/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silkscreen-poster/demo/stills/alt_1_title.jpg (also `alt_2_band.jpg`, `alt_3_ascent_night.jpg`, `alt_4_wall.jpg`)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/silkscreen-poster.mp4
### Gaps
No vertical-frame layout (the 2:3 poster would fit 1080×1920 better than 16:9, but this isn't stated); the `night` palette hexes are not in the docs (only named); easing for camera moves other than the 0.65 s ease-out not given; engine source (`silk.js`, `poster.js`) not read beyond its documented API.

## Printed Long Take
- Source: `lemomo-ai/lemo-opuscar` `styles/printed-long-take/STYLE.md`, `DEMO.md`, `style.json` (No. 75, Print & Printmaking; added 2026-10-29); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a real 3D world drawn entirely as a scratchboard print (warm ink, warm paper, one small red) and crossed by one unbroken camera move, the layers sliding past like a printed diorama.
- Suits: journeys, wildlife, landscapes, place histories, "the same place over the years" counts, river/road/migration stories; narrated or not. Real footage: no. Real data: optional (the demo cites facts in `FACTS.md`). 3D: **yes** (three.js scene, custom ink/paper shaders). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ink | `#16171b` | warm black; shadow faces, forest bands, sky, water, night |
| paper | `#ede5cd` | warm off-white; lit faces, snow, cloud, steam, foam |
| red | `#c4332b` | the one subject only (crane crowns), with a thin paper ring on ink |
| yellow | `#dfa443` | light itself (sun disc, its road on water, warm dawn cuts) and one material (corn) |
Rule: two values carry everything; never pure black or white, never a third grey fill (grey only as line density). One red reserved for one small subject, never < ~3 px at 1080p (demo: never under 5 px by day), may carry into its own trace (ripple, trail) but never onto another object; a flat stab, no outline/highlight/gradient. Yellow only for light and one material. Value order by depth: far mountains paper with ink shadow facets → forest bands solid ink → middle ground paper → foreground ink silhouettes; the subject always on the opposite value of what is behind it. Ink and paper roughly half and half.
### Typography
- One bold serif: Noto Serif SC 700 (Google Font, OFL), subset to the characters used (`tools/subset.py`). Chinese and English each on their own line.
- Sizes at 1920×1080 (1080p): at most three sizes per frame; Chinese ≥ 28 px, Latin ≥ 22 px; every word ≥ 5 % inside the frame. Left-aligned blocks, aligned by optical edge.
- Type lives in the world: carved into a board, cast on a plate, printed on a pasted notice, or cut as a plate of type into the sky (ink block, paper letters). World text carries only keywords and numbers; no centred title cards, no headers.
- Words appear as the medium makes them: cut left to right with chips at the knife, pressed by a seal, revealed under a peeled sheet.
- Reading time: ≥ max(1.8 s, CJK chars ÷ 4.5 + Latin chars ÷ 15 + 1.5 s); judged comparisons hold still ≥ 2.5 s before the verdict lands.
- Subtitles: one bar per spoken line at the bottom inside the 5 % safe area; one Chinese line above one English line, never wrapped, the film's serif, paper letters on an ink band ~80 % opaque (demo 62 % over a dark picture); appears and leaves with the line; subject kept above it.
- Emphasis: a strike-through and a seal for a verdict (demo: 易危 struck, seal 近危 2026.3).
### Layout
- At least three layers in every held frame: sky / mountain or forest band / middle ground of fields, water or snow / foreground of branches, fences or posts. A pass through steam or a structure is exempt for its half second.
- Horizon on a third; a subject that must be recognised is ≥ 1/20 of frame height (distant animals drawn up to 3× real scale); words inside a 5 % margin, never crossing another object.
- Props with words sit at a 3/4 angle with thickness, a snow cap or a rim. Demo board: two columns (1952 | 2025) over a pasted notice, square seal. End card: ink plate in the day sky, upper right, ≥ 5 % inside.
- Sky only in frame while camera pitch + half the vertical FOV stays above the horizon: for high wides stand farther back on a longer lens, stretch horizontal distances, or break a far plane into bands (headlands, islands, boats).
### Elements
- Two kinds of field: paper with ink cuts, or ink with paper cuts; tone only from cut width and density. Cuts have a blunt entry and a tapered exit.
- Cut direction follows the matter: down the fall line on slopes; horizontal in sky, cloud and still water; across the flow in running water; along crests for waves; along grain for wood and stone; along drifts/furrows on flat ground. Spacing fixed in world units (metres; radians for the sky).
- Faceted terrain: low-poly cones with flat facets; lit facet = paper with a few fine ink cuts near the terminator; shadow facet = ink with paper cuts down the slope. Lit/shadow per face from one light `uL` with a threshold, no gradient inside a face.
- Sky in direction space: a sphere travelling with the camera; cuts are rows of constant elevation (stay horizontal). Night = sparse wavy wind cuts + square stab stars; day = dense parallel cuts, thicker near the horizon. Dawn carved row by row from the horizon up (`uFront`).
- Billboard atlases drawn on canvas with a knife-stroke `cut()` function: cylindrical billboards for standing things, spherical with screen rotation for flying ones; negative mip bias + alpha test. Animals as flat silhouettes with 3–4 poses per action (demo 16 crane poses).
- Water: a ribbon cut into snow (ground discarded inside a river mask) with bank walls and a narrow paper snow lip; ripples are short cuts across the flow, fading to solid ink with distance.
- Distance fade: once a quarter of a row or more passes in one pixel (`fwidth`), cuts go to the field's value: `k *= 1. - smoothstep(.25, .7, aa)`.
- Red point kept at a minimum pixel size (`gl_PointSize = max(px, uMin)`).
### Motion
- Output 30 fps; camera and world move on every frame. The print pass steps its paper flicker and blotches at 12 Hz inside the shader (`floor(t*12)/12`) regardless of output rate.
- Easing: long monotone curves; camera keeps momentum through key positions and decelerates into every hold. No bounce, no shake except one frame for an impact (demo: the seal).
- Wings cycle on fixed frames; never morph between poses. Steam, snow and splashes are paper marks (horizontal wisps, square stabs, short arcs).
- Mountains, horizon and sky texture never move; trees never sway.
- A clock warp (`WARP`) slows one stretch (demo: bridge pass at half speed with ease in/out, 10.0–11.3 s) and moves texts, events and subtitles with it.
- Camera vocabulary: high wide establishing frame sinking and pushing; low glide over water or snow; long-lens hold on a prop with words; pass through a structure (bridge, gate, tunnel); locked frame (document, comparison, count); rise and pull back to the opening angle; follow a flying or falling subject.
### Transitions and rhythm
- One continuous move carries the story; cuts are rare and designed. Allowed: through a structure; through steam or snow (< 0.5 s of white paper; demo 19.1–19.55 s); match on a falling/rising subject; a sheet peeled from the corner (demo peels at 39.3, 40.1, 40.8 s, each new print's red a beat later and a hair off register); a seal. Forbidden: fades to black, cross-dissolves, slides, page flips, zoom cuts.
- Music: a three-beat or slow pulse that can stop; silence before a verdict, then one heavy low stroke. Demo 72 BPM in three, D dorian → D major, 60.0 s, 15 shots in one take, 11 narration lines.
### Finish
- 2× supersampled render, box-filtered down in a final print pass. Print pass (screen space): paper fibre, ink mottling in the darks, soft grey blotches near the top of the sheet, a two-frame flicker (12 Hz), a light vignette. Keep vignette and blotches light (they make the print dirty). `uFresh` = ink not quite taken after a peel; `uWhite` = steam whiteout (mask the red out of it if the take follows the red).
- No smooth shading, no gradients, no specular, no lighting beyond one direction choosing lit/shadow faces.
### 3D look (if any)
- three.js scene: terrain heightfield/faceted meshes under `carveMat`, river ribbon, thousands of instanced billboard trees, bridge/pier, props as canvases on meshes. Every material is a small shader deciding ink or paper per pixel. Close props get real materials (carved wood, concrete formwork, cast iron); living subjects stay at mid shot as flat silhouettes. Clear the camera path of trees, posts and scatter within a radius; dithered fade on near sprites; smaller facets near the camera path.
- Translates to Blender as: emission-only ink/paper shaders with world-anchored line patterns, one sun to choose faces, sprite cards for animals and trees, no lighting falloff.
### Banned
Pure black or white; any third grey fill; a second accent colour; red on anything but the one subject; smooth shading, gradients, specular (not a toon-shaded game); screen-space line spacing (lines swim); trees swaying, sky texture moving; morphing between poses; camera shake (except one frame); fades to black, cross-dissolves, slides, page flips, zoom cuts; centred title cards and headers; full sentences on props; synth pads and drum kits; CC BY-NC animal sounds; regular bank dashes (read as a road); empty paper fields without three layers; not woodcut, ukiyo-e, a toon game or a pencil sketch; never copy a print, an illustrator's figures or a film's route.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/printed-long-take.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/printed-long-take/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/printed-long-take/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/printed-long-take.mp4 (a Chinese-narration build `printed-long-take-zh.mp4` is made locally by `build.sh zh`; not confirmed in releases)
### Gaps
No cut spacing values in metres, no FOV/lens values, no vignette/flicker amplitudes; no vertical framing guidance (the 5 % margins and 1/20-height rule would carry over); shader source (`look.js`, `scene.js`) was not read beyond the documented API.

<!-- category: Graphic & Type -->

## Swiss Motion Graphics
- Source: `lemomo-ai/lemo-opuscar` `styles/swiss-motion/STYLE.md`, `DEMO.md`, `style.json` (No. 16, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: International Typographic Style in motion; a modular grid, one typeface, one signal colour, every move landing on a beat like a printing press.
- Suits: rules, steps, spec sheets, feature lists, brand systems, countdowns, timetables. Real footage: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| page | `#EAE9E5` | frame background (demo) |
| paper | `#FFFFFF` | the poster/artifact |
| ink | `#111111` | type, bars |
| signal | `#E30613` | the one protagonist element (red circle), the knife line |
| grid line on page | `#CFCEC9` | |
| grid line while building | `#C9C8C2` | |
| grid line on paper | `#E2E1DC` | |
| secondary bars | `#CFCEC9` | light-grey "second voice" under black bars |
| alt set A | `#F2F0EA` / `#141414` / `#FF5A00` | page / ink / signal (example in STYLE.md) |
| alt set B | `#E9ECEF` / `#0B0B0B` / `#1F3FFF` | page / ink / signal (example in STYLE.md) |
Rule: paper, ink, greys and exactly one signal colour (red, orange, ultramarine or green), chosen per topic, never a second. Black type may overprint the signal colour.
### Typography
- One family for the whole film, an OFL neo-grotesque: Archivo (demo, variable, weights 400–800), Inter, Schibsted Grotesk, Instrument Sans; all Google Fonts. Never Helvetica or Akzidenz files.
- Sizes at 1920×1080: rule numerals ~980 px font size (700 px figure height), bottom-aligned with the poster; title 120 px Bold, two lines flush left; subtitle lead-in 30 px Medium grey + statement 76 px Bold; notes/caption rows ~19 px Medium with a 1 px rule above; end-card sign-off 36 px.
- Letter spacing about −2 % at ≥ 90 px (demo −2.2 %). Headlines may be lowercase (`neue musik`).
- Emphasis: scale contrast (giant numeral beside tiny notes) and weight (Regular for non-rule lines, Bold for statements); never colour except the one signal element.
- Subtitles are part of the layout: each line at a column start, each word clip-revealed on its Whisper timestamp; hold ≥ max(1.8 s, speech + 0.6 s), asserted in code.
### Layout
- Frame grid 1920×1080: 12 columns, 96 px side margins, 24 px gutters (122 px columns), 24 px baseline.
- Frame as a spread: left page cols 1–6 = the "programme" (numeral, rule text, notes); right page cols 8–12 = the artifact (poster 706×1008, ratio 0.70).
- Artifact grid derived from content (Gerstner): demo poster 7 columns × 91 px, 16 rows × 40 px, 26 px baseline in the text zone. Fewer, wider modules so bars have mass.
- Flush left, ragged right; giant numerals optically flush left (subtract left bearing). Big white space is part of the layout. Corner technical notes (`Columns 7 · Rows 16 · Module 91 × 40`), bar counter (`bar 04.3`).
- A "better" final composition: one strong diagonal with long/short rhythm, signal element ~2× scale, bleeds off the paper edge, type over the signal colour.
### Elements
- Flat rect bars (width = column − 8 px); consecutive cells merge into one bar, overdrawn 1 px at seams.
- Caption rows with a 1 px rule above; technical notes; coordinate readout beside the exception (`col 5.00 row 0.00 · on grid` turning to red `off grid` with non-integer values).
- Knife-cut line 2 px; playhead; a wall of artifacts from the same system.
- No icons, no gradients, no shadows, no device renders.
### Motion
- Two curves only: snaps `cubic-bezier(.7,0,.2,1)`; linear for lines being drawn, playheads and the exception. No overshoot, spring or bounce.
- Durations are note values: at 120 BPM, 1/8 = 0.25 s, 1/16 = 0.125 s. A snap starts one note value early and lands on the beat.
- Entrances are wipes or clip-reveals, never fades: words rise out of a clip rect from below the baseline in 1/16, leave upward in 1/8; lines grow along their length; paper appears by a vertical wipe; big numerals climb in 4 eased steps.
- Deletion = knife cut: a 2 px line crosses the element in 1/16, then it collapses to its midline in 1/8.
- Ripple / re-flow ordered by distance from the cause, two units per sixteenth, nearest first.
- The exception moves linearly, unsnapped, pauses one eighth mid-flight, grows as it travels.
- Rotation reveal: rotate 90° in 1.5 beats, hold, then grid lines, labels, playhead sweep (2 bars). Visual onsets on whole frames (multiples of 0.25 s at 24 fps).
- Smooth 24 fps, no stepping.
- Camera: a 2D matrix (centre, scale, rotation) that moves only with the precise ease and only on beats. Vocabulary: locked spread (cause → effect), hard pan by one page or column (next step), rotate 90° and stop (same thing read another way), pull out to a wall of artifacts (one programme, many outputs), push into one module (the unit), grid extends past the page (scale), split into equal cells (parallel cases), vertical scroll through a column (a list).
### Transitions and rhythm
- Transitions: wipes, knife cuts, camera moves and re-flows; never dissolves.
- Rhythm: a steady pulse whose subdivisions set snap lengths; demo motorik/krautrock at 120 BPM in A dorian, one instrument added per rule; drums drop for the one bar of the break; one near-silent bar before a reveal; silence = a hard stop of everything on a downbeat. Demo 44 s (1056 frames at 24 fps).
### Finish
None by design: no gradients, glow, shadows, particles or grain (mux grain 0).
### 3D look (if any)
None (2D only).
### Banned
No gradients, glow or device renders (not a keynote); words never fly, spin or bounce (not lyric kinetic type); not a Bauhaus pastiche of primary shapes; no fades or dissolves; no overshoot/spring/bounce; no second signal colour; never Helvetica/Akzidenz files; never copy a historic poster's composition (no concentric-circle or fan layouts); never name a real institution; no generic piano-and-strings score; no rotating and labelling at the same time; not too many thin columns (reads as a chart).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/swiss-motion.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/swiss-motion/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/swiss-motion/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/swiss-motion.mp4 (and the derived "Material Grid" user style: `…/films/my-style-material-grid.mp4`)
### Gaps
No vertical-frame grid; the signal-colour choice is qualitative; no guidance on how many words per screen beyond the reading-time rule; type sizes only for the demo.

## 60s Spy Title Sequence
- Source: `lemomo-ai/lemo-opuscar` `styles/spy-titles/STYLE.md`, `DEMO.md`, `style.json` (No. 17, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a cut-paper, four-ink opening title sequence in the 1950s–60s Bass grammar: profile silhouettes chase through sets built from the credits, brass stabs are the cuts, and the pieces finally assemble the title.
- Suits: title sequences, event openers, trailers, product launches (product = the MacGuffin, its logo = the title), festival line-ups, award nominees, team intros. Real footage: no. Real data: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ink black | `#1b1714` | figures, type, cold-open/rooftop ground (demo) |
| paper cream | `#efe4c9` | velvet and title grounds, eye slit, strips |
| signal red | `#d23a22` | hero's tie, danger, keyhole bullet, grid/train/casino ground |
| mustard | `#e2a52a` | the object of the chase (key), airport ground |
| dark red (shadow paper) | `#9a2a18` | depth only |
| dark mustard (shadow paper) | `#b07e1c` | depth only |
| distant city | `#3a322b` | far props on black |
| alt set A | `#161a22` / `#ece6d6` / `#1f8a8a` / `#f07a28` | ink / bone / teal / orange (example) |
| alt set B | black / `#f3d6cc` / `#2a46b8` / `#f0d23a` | ink / pale pink / cobalt / lemon (example) |
Rule: four flat opaque inks (black, paper, one hot, one warm secondary), no gradients; darker "shadow paper" variants only for depth. One dominant ground colour per scene, changing with location. Hot colour reserved for one accent on the hero and danger; secondary marks the object of the chase. Background props in a darker version of the ground, never black (they'd read as letters).
### Typography
- Credits: League Gothic (Google Font), condensed; glyph outlines extracted with opentype.js and re-cut per letter (edge noise, ±0.8° rotation, ±1.5 px baseline jitter).
- Title: custom geometric cut glyphs (straight cuts + arcs, uneven weights, staggered jaunty baselines); the MacGuffin's slot is a letter (demo: the I of CIPHER as a black lock plate with a red keyhole). Never a real title's lettering.
- Subtitles: League Spartan 600 (Google Font), ~44 px at 1920×1080, on a narrow paper strip with scissor-cut ends tilted −1°, bottom-left at (96, 958), a small glyph from the film (red keyhole) as bullet; cream strip/ink text on dark scenes, ink strip/cream text on light ones; slides in 60 px from the left in 0.18 s. Hold ≥ max(1.8 s, speech + 0.6 s).
- Case: credits in caps ("STARRING THE AGENT"). Credits are fictional roles only, never real names.
- Credits live in the set, one line per location, each fully readable at some moment (open wide on the full line); never in the subtitle band.
### Layout
- Strong diagonals (~30°), big flat grounds, figures small against type.
- Each location = one credit line as architecture: letters as pillars, words as train carriages, an O as a roulette wheel, an em-dash as a ledge, a letter as a lock. Lay words out around a gap (2.2 × radius) where a circular prop drops in.
- Hide-behind gags: let hat brim, nose and accent stick out past the letter.
- Subtitle strip bottom-left; MacGuffin on a black backing, the brightest thing in frame.
### Elements
- Scissor-cut edges: every polygon resampled every ~9–10 px, displaced along its normal by low-frequency noise (amp 1.2–2.2 px, larger for bigger shapes) plus a rare 1–2 px notch; computed once in local space and cached (screen-space edges crawl).
- Paper layering: 2.4 px cut gap in the ground colour between pieces; paper shadow offset 2.5/3.5 px, blur 5, alpha ~0.3. Whole figures get the gap as an 8-direction outline so black reads on black.
- Silhouette figures ~7 heads tall, profile only; identity by hat, coat cut, shoes and one colour accent that doubles as motion indicator (tie streaming back at ~65° when running; villain 1.2× taller with a red coat lining showing only when running). Pieces merged into one outline in an offscreen layer; only 1.7 px joint slits (shoulder, elbow, hip/hem, knee) cut with `destination-out`. Hands are wedges; no faces except a cream eye slit in close-ups. Streamers as multi-segment ribbons with a travelling sine + width wobble.
- Giant circle (moon) behind the hero moment; diagonal grid splitting the frame; keyhole/lock motif.
### Motion
- Puppets on twos (12 fps): figure poses and positions, hands, letters landing, vehicles. Camera, credit slides and grid growth on ones (24 fps).
- Run cycle: 8 drawings, one step per beat (cycle = 2 beats at 132 BPM), lean 0.3 rad, tie at ~65°. Walk: one step per beat, coat swinging.
- Credits slide in along grid lines and stop dead on the beat (short ease-out, 0.2 s); letters land with a paper slap.
- Stop-time: at a brass stab the whole picture (background scroll included) freezes for 2 beats in true silence, then resumes.
- Shatter: the scene sliced into strips parallel to a cut line that slide off alternately along the diagonal, while title glyphs fly in along the same diagonal and land on consecutive 16th notes.
- Camera vocabulary: wide on a full credit line then truck in; lateral tracking in one screen direction (pursued ahead, pursuer behind, left → right); hard cut on a brass stab; graphic match cut (same shape, same position and size); locked single shape on a flat ground; silhouette against a giant circle; diagonal split into a grid; vertical pan down a column of type; push into a letter until it fills the frame.
### Transitions and rhythm
- Hard cuts on brass stabs (stacked staccato trumpet + trombone in octaves + crash, ~0.25 s, placed ~8 ms early so the peak hits the frame). Graphic match cuts with identical circle centres and sizes (wheel → roulette → pupil → moon → keyhole). Opening wound → closing seam on the same 30° diagonal. No dissolves.
- Cut interval shrinks as the chase accelerates (demo 2 bars → 1.5 bars → 2 beats).
- Demo: ~132 BPM minor-key 1960s spy big band, 44 s (1058 frames at 24 fps); arc: cold open hook in 3 s → theft → 3–4 locations each shorter → stop-time gag → match-cut montage → catch against a giant circle → shatter into the title → button (one beat of digital silence, one dry bongo, one deadpan line).
### Finish
- One full-frame paper texture multiplied on top (low-frequency mottling + faint fibres); sparse "ink void" speckle screened on dark ink only; faint horizontal squeegee streaks; film grain in the mux at ~6. Encode note: flat inks + grain at CRF 19 = 270 MB, at CRF 24 = 18.5 MB with no visible difference.
- No halftone, no gradients, no glow.
### 3D look (if any)
None.
### Banned
Gradients; halftone dots; flat vector edges (edges must be cut); Swiss-grid rigidity; spy parody gadgets, gun-barrel openings, a tiptoeing cartoon panther; copying any real title's logo, lettering, characters or shots; the famous spy-theme chromatic crawl (E–F–F♯–F) and its Em(maj9) ending chord; real people's names in credits; dissolves; outlining every internal body piece (mannequin look); background props in black; an object in its ground's ink without a black backing; credits seen only partially; a stepped (12 fps) camera.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/spy-titles.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/spy-titles/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/spy-titles/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/spy-titles/demo/stills/modelsheet.jpg (silhouette model sheet)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/spy-titles.mp4
### Gaps
No credit type sizes; no vertical layout (lateral tracking and 30° diagonals assume landscape); camera easing beyond "short ease-out 0.2 s" not given; the custom title glyph construction is described, not specified; engine code (`paper.js`, `chars.js`) not read beyond the docs.

## Art Deco
- Source: `lemomo-ai/lemo-opuscar` `styles/art-deco/STYLE.md`, `DEMO.md`, `style.json` (No. 18, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a 1930s Cassandre poster that moves; gold engraved keylines on warm lacquer black, airbrushed hard-edged volumes, one centre axis, and light arriving bulb by bulb.
- Suits: luxury and hospitality, galas, invitations, launches and countdowns with a deadline, award nights, company "floors"/stages. Real footage: no. 3D: no (true one- and two-point perspective drawn in Canvas2D through a pinhole camera). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| ground (warm black) | `#0d0b09` | background (demo) |
| lacquer | `#060504` | deepest black surfaces |
| night sky | `#0a0e16` | sky top |
| horizon emerald | `#10231f` | sky near horizon |
| gold shadow | `#6F5220` | metal gradient dark band |
| gold base | `#C9A24B` | metal gradient base |
| gold light | `#F3D98B` | metal gradient light band |
| gold specular | `#FFF4D2` | hot band / sheen |
| accent burgundy | `#8E1B2E` | the hero's uniform, the only large saturated area |
| jewel emerald | `#1D6B57` | fans, door panels, night (secondary surfaces) |
| ivory | `#F2E8D5` | the letter, gloves, carpet, type, light |
| one-colour exception (example) | `#D97757` | engine example: one element in its own colour |
Rule: three constants (warm black, gold, ivory) + one saturated accent reserved for the protagonist + an optional cooler jewel tone that never competes in area. Ground is never neutral grey-black. Other example triads (accent / jewel / metal): burgundy / emerald / gold; coral / sapphire / pale gold; jade / plum / rose gold. Always six-digit hex (three-digit hex broke colour mixing: emerald fans turned blue-violet).
### Typography
- Limelight (titles), Poiret One (numbers, sign skeletons, plaques), Josefin Sans (subtitles, labels), Italiana (numerals). All four are Google Fonts (OFL).
- Titles are architecture: a stepped gold title bar over an arch or sunburst, optional diamond year badge and wings; drawn on in gold, then a sheen sweep.
- Subtitle card: lacquer bar ~88 % black with stepped ends, double gold keyline, Josefin Sans SemiBold ~40–42 px ivory (at 1920×1080), optional small speaker icon per voice (demo: gold ribbon mic for the announcer, burgundy pillbox cap for the hero). It unfolds from the centre like every title. Hold ≥ max(1.8 s, speech + 0.6 s).
- Emphasis: gold sheen sweep on a hit; numbers carry plot (dials, clock faces, floor medallions, badges) instead of narration. Title/plaque sizes and tracking: not given.
- Case: demo titles and signs in capitals (MIDNIGHT / AT THE STARLIGHT HOTEL, OUT OF ORDER, THE STARLIGHT).
### Layout
- One vertical centre axis per composition; it is "sacred": an asymmetric frame must resolve to it within the shot; symmetry may rotate or open but never drift off-centre.
- Ornament is structure: sunbursts as backgrounds, stepped arches/ziggurats as frames, a dial as progress bar, a bulb marquee as reveal.
- Real perspective: one-point with a mode-7 floor (lobby), two-point from below (rooftop sign).
- At an emotional peak the protagonist fills ≥ ~1/3 of frame height (a hero at 1/4 height read as a prop).
- Margins, grid, safe zones: not given.
### Elements
- Signature stroke `gline`: a dark engraved underline ~1.6 px wider than the line, the gold gradient line, a hairline highlight on top; optional glow and a parallel twin (`double`). No black cartoon outlines anywhere.
- Gold = banded metal gradient (dark – light – hot – light – dark); animate the `sheen` offset −0.2 → 1.2 for a light sweep.
- Volumes: hard edge + directional airbrush gradient inside the shape (shade → light), one light direction (upper left by default), a thin gold rim on the lit side.
- Motif library: sunburst (lines or wedges; demo 72 rays), stepped arch/ziggurat, fish-scale (lower half-circles row by row, overlapping, with an inner arc), chevrons, fan, four-point sparkle, speed lines, clock face, semicircle floor dial, floor medallion, diamond year badge, bulb sign built from glyph skeletons.
- Characters: ~7 heads tall, tapered streamline bodies, faceted lacquer planes (Lempicka), almond or arc eyes, one-stroke nose, airbrush + gold rim; one or two silhouette marks readable at 1/4 frame height.
### Motion
- Characters on twos (12 fps); camera, light, bulbs, gold draw-on and sheen on ones (24 fps).
- Unfold from the centre: a point → a hairline → bars open symmetrically → text rises → wings and sparkle.
- Draw-on follows the music: a gold line grows at the speed of the phrase (demo: the clarinet glissando, slow → fast) and lands on the hit.
- Bulb ignition: ~1.6× flash overshoot settling in ~0.18 s, plus a relay "chunk"; once lit, a fast chase may run across the sign (demo: a 16th-note chase).
- Mechanical easing: doors, dials and hands use firm ease-in-out with a small settle; nothing floats. Exact curves: not given.
- Performance beats get anticipation and escalation in threes (once, twice, mash).
- Camera vocabulary: symmetric split (door leaves hinged at the edges) or revolving-door wipe = threshold; leaves sliding shut over the live shot = an ending; extreme low-angle Cassandre tilt = aspiration; architectural section pull-out (hero becomes a coloured dot with speed lines) = progress; Busby Berkeley overhead, mirrored (demo 8-way) and slowly rotating = people as pattern; push-in on a dial/medallion/clock = the number is the plot; match-cut on shape; low oblique along a marquee = light travelling letter by letter; pull back from detail to skyline = scale. Demo opening: a 6 % slow push.
### Transitions and rhythm
- Transitions: symmetric splits, revolves, arch openings, shape matches; never a generic dissolve or slide. J/L-cuts carry architecture (the next room's sound enters a bar before its door opens).
- Rhythm: symphonic jazz of the 1920s–30s (foxtrot, Charleston, tango, torch ballad, newsreel fanfare). Counted light: one hit per bulb or event. Accelerate by dividing the beat. Silence before the most important sound, reduced to one diegetic sound (a clock tick, wind). Demo: 116 BPM foxtrot → 16 beats accelerating to 138 BPM Charleston → stop → 12 bells on the 116 grid → the song in D♭; 53 sync points checked (max offset 0.5 ms); 58.4 s, 1401 frames.
### Finish
Light film grain (demo mux grain 3); optional glow on keylines; a vignette motif exists in the engine (values not given). Lift background wedges/glow slightly so a gold point on black doesn't trip `blackdetect`.
### 3D look (if any)
None; perspective is drawn in 2D (pinhole camera `makeCam`, `cardTransform` maps flat cards onto 3D quads, mode-7 floors).
### Banned
Not a gold-foil slideshow (things must move and have volume); no Art Nouveau whiplash curves or flowers; not a flat vector poster (volumes are airbrushed and rimmed); no 60s-spy silhouettes on flat colour; no black cartoon outlines; no neutral grey-black ground; no generic dissolve or slide; the centre axis never drifts; no generic cartoon characters; not a 60s big band; never copy a poster layout, a real building, a character, a typeface design or a melody; no three-digit hex.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/art-deco.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/art-deco/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/art-deco/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/art-deco/demo/stills/kit_v2.jpg (component kit: title bar, numerals, clocks, sunburst, arches, patterns, bulb marquee, subtitle cards)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/art-deco/demo/stills/modelsheet_v2.jpg, `frame_v2_lobby.jpg`, `frame_v2_roof.jpg`
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/art-deco.mp4
### Gaps
No title/label pixel sizes or tracking (only the subtitle ~40–42 px); no easing curves or durations for doors and dials; no margins or safe zones; no vertical-frame guidance; vignette/glow strengths not given.

## Blueprint
- Source: `lemomo-ai/lemo-opuscar` `styles/blueprint/STYLE.md`, `DEMO.md`, `style.json` (No. 19, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: an engineering drawing that comes alive on one sheet of cyanotype paper; white line work on uneven Prussian blue, drawn in drafting order, with annotations that move and dry notes that carry the wit.
- Suits: engineering, hardware launches, tech explainers, "how it works", product versions/revisions, plans becoming buildings; 30–60 s. Real footage: no. 3D: no (3D rendering is banned; oblique/isometric projection drawn in 2D). AI images: no. Needs a WebGL2 shader for the procedural paper.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| sheet blue low | `#18336B` | fbm between two Prussian blues (demo) |
| sheet blue high | `#2A58A6` | fbm upper blue (demo) |
| line | `#E7F0F9` | all line work, lettering |
| drafting table cloth | `#0D1116` | outside the sheet, with drop shadow |
| stamp red | `#C23B2E` | the one rubber stamp; the only non-blue colour, used exactly once |
| subtitle box | `rgba(12,28,62,.58)` | translucent note box |
| alt: sun-bleached sheet | `#3A6DA8` → `#5B8CC4` | example in STYLE.md |
| alt: deep over-exposed sheet | `#0F2350` → `#1D3F80` | example in STYLE.md |
Rule: blue and white only; blue varies in value (coating, stains, folds), white varies in weight and softness, never in hue. One non-blue stamp colour, once (red classic; green APPROVED or black VOID also work). The one "real" object may carry white light, not a new hue.
### Typography
- Architects Daughter (hand lettering: header, labels, notes, subtitles); B612 / B612 Bold (title-block fields, "PATENT PENDING", NOTE cells); Allura (signature only). All three are Google Fonts (OFL).
- Sizes: subtitle text Architects Daughter 38 px (frame size 1920×1080); title = sheet header in Architects Daughter 132 sheet units, letter-spaced, double underline (the sheet is 3200×2200 units; screen size depends on zoom).
- All text is written on left to right with a glowing nib; subtitle lettered on in ~0.35 s.
- Subtitles are drawing notes: light translucent box (~110–150 px tall, 1.2 px outer + 0.8 px inner white rule), a "NOTE / n" cell, a small leader tick at lower left; placed per shot in empty sky, never at the bottom; wrap at ~880 px; hold ≥ max(1.8 s, speech + 0.6 s). Each subtitle is also lettered into the sheet's GENERAL NOTES column so the final wide shows the whole voiceover.
- Emphasis: the notes carry jokes/warmth while the drawing stays dry; Fig. numbers struck through and rewritten; the title block's status field holds the verdict. Case: labels and title block in capitals ("FIG. 2 · EXPLODED VIEW", "ALL DIMENSIONS IN MILLIMETRES.").
### Layout
- The whole film happens on one sheet (demo 3200×2200 units, folded in quarters) on a dark drafting table; the camera reads it like an eye.
- Sheet furniture: border, header (title), title block (status, verdict, revisions, STYLE / DRAWN BY), parts list, GENERAL NOTES column.
- Medium shot: the subject ~80 % of frame height with empty sky on one side for subtitles. Keep storytelling shots close; full-sheet wides only for establishing and closing.
- Keep the main figure at least `960/zoom` from any sheet edge you will frame (or wides show the desk).
- The bottom of the frame belongs to the ground line, base and title block, never subtitles.
- The payoff object ~1/3 of frame height, centred, subtitles off it.
### Elements
- Four line weights in sheet units: outline 3.2, detail 2.0, thin 1.25, hair 0.9. Screen width = sheet width × zoom^0.65.
- Dash patterns (scaled with zoom): centre line `[34,7,6,7]`, hidden `[11,7]`, phantom / cutting plane `[30,6,5,6,5,6]`.
- Hatching (fine-line shading) for sections, soil, weights at 45°, spacing 8–14 units.
- Dimension lines that measure moving parts (numbers change), leader lines with numbered balloons that fly with exploded parts, section line A–A sweeping to reveal the inside, revision cloud (outward scallops), rubber stamp, hand shadow with a pen tip, signature.
- Occlusion by painter's order: each solid filled with "paper" before its outline is stroked; oblique extrusion = stroke the outline at N depth steps at 2× width, then fill the same steps with paper.
- People appear only as a hand shadow or a signature; the designed thing is the character (boom angle, vane droop, bellows volume, gauge needle = its face).
### Motion
- Camera and draw-on on ones (24 fps); continuous moves within a section, hard cuts on downbeats between sections; tiny camera bumps only for physical impacts (paper slap, stamp).
- Draw-on truncated by arc length with a glowing nib at the head; items staggered within a layer; each layer starts on a beat.
- Drafting order: centre lines → outlines → detail → hatching → dimensions → balloons → labels.
- Exploded view: parts leave one every ~0.055 of the progress on eighth notes, eased; return one eighth note per group with a brass click; camera pulls back to make room.
- Mechanisms step like an escapement: a gear advances one tooth (7.5°) per eighth note with a 0.35-beat ease-out; meshing phase computed so teeth interlock; chains move with sprockets; bellows breathe per beat.
- Machine acting: failure = slowing, sagging, winding down over ~1.5 s; joy = snapping upright, needle overshooting to 1 with a back-ease.
- Oblique depth factor animated 0 → 0.5: the flat elevation "turns" and gains thickness.
- Camera vocabulary: whole sheet on the table; medium on a figure (~80 % height); track along a path of force (chain, pipe, wire); 2× close-up cut on a downbeat; locked-off hold of a beat; oblique 0 → 0.5; section-line sweep; lateral pan Fig. 1 → Fig. 2 → Fig. 3; slow push-in with no voice for wonder.
- The magic object's shadow offset grows with lift (up to ~240 units down); inner lobes grow early (`r × min(1, pf × 2.2)`).
### Transitions and rhythm
- Transitions: cuts on downbeats, or Fig.-number rewrites on the sheet; no dissolves.
- Rhythm: contrapuntal, mechanical music (harpsichord, bassoon, spiccato strings, harp, celesta, music box); a repeated motive as the "gear". Demo: two-part baroque invention at 108 BPM in G major; flaw = written-out ritardando into true silence; the miracle on an unresolved Dsus4 chord; full cadence on the stamp. Demo 46.7 s, 1120 frames at 24 fps. Hatching foley at 13 strokes/s; wind-down ticks slow by ×1.35.
### Finish
Procedural cyanotype paper in a WebGL2 fragment shader in sheet coordinates (crisp at any zoom): low-frequency fbm between two blues, horizontal coating streaks, a slight left-to-right fade, fibre noise and sparse fibres, fold creases (bright edge, dark edge, worn whitening), irregular bleached edges and corners, specks. Lines slightly soft (mipmap bleed) with faint ink breakup from paper grain. Water: drops bloom deeper blue with a pale tide line, lines inside soften, ink signatures bleed. Composite in buffers: greyscale ink canvas; fx canvas R = shadow darkening, G = wetness, B = stamp ink, added with `lighter`; subtitle overlay last (premultiplied alpha). Shadows darken lines too. Grain: little (demo mux grain 4).
### 3D look (if any)
None. The "one real thing" (optional, at most once): a drawing symbol that leaves the drawing language gets soft volume, one radial gradient across its whole union (top-left light), a blurred white glow, crescent shading (mask = union minus union shifted up-left), a thicker outline on the shadow side, a shadow falling across the lines, and a pale unexposed imprint where it was drawn.
### Banned
Never 3D rendering; no glowing wireframe or 3D orbit (not Hologram HUD); no marker on white (not Whiteboard); no burin tonal hatching as the whole look (not Engraving); no hue variation in the white; no second non-blue colour, and the stamp colour only once; no dissolves; no subtitles fixed to the bottom; no Marvel elements, real patents, real inventor's machine or signature; per-lobe shading on blobby shapes ("grapes"); line weights not scaled with zoom.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/blueprint.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/blueprint/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/blueprint/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/blueprint.mp4
### Gaps
Easing curve families beyond "eased"/"0.35-beat ease-out"/"back-ease" not named numerically; no margins/grid in screen pixels; no vertical-frame layout; label and balloon sizes not given; paper-shader noise parameters (octaves, scales) not given.

## Stained Glass
- Source: `lemomo-ai/lemo-opuscar` `styles/stained-glass/STYLE.md`, `DEMO.md`, `style.json` (No. 20, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a medieval-craft window seen from a dark stone hall, alive only where the sun touches it; light is the clock, the camera and the story.
- Suits: legends, heritage, holiday stories, sequences of stations/steps/seasons, a reinvention or repair story, product lineups as lancets. Real footage: no. 3D: no (2D vector glass + a WebGL2 compositor for light, floor projection and shafts). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| cobalt (dominant) | `#1d3a9c` | ground glass (demo) |
| deep blue | `#142a70` | darker blue glass |
| ruby | `#a8101c` | hot hue; border band |
| gold | `#dc9a22` | touches; pearls |
| emerald | `#2f7f36` | touches |
| olive | `#6b7a22` | touches |
| murrey | `#632a63` | touches |
| flesh | `#d2a288` | faces (keep darker than you think) |
| white glass | `#cfdac6` | greenish white: faces, fillets, sky, sparingly |
| mail | `#a9b7b2` | armour |
| sky | `#7fa2cf` | sky glass |
| umber | `#7a4e24` | |
| ember amber | `#ff9a2a` | the story light (a colour no glass uses) |
| lead | `#1d1f23` | cames |
| grisaille trace | `rgba(44,26,12,.88)` | painted lines |
| sun dawn | rgb `(.70,.83,1.0)` × 2.2 | low, long patches |
| sun noon | rgb `(1,.97,.9)` × 2.7 | brightest, short patches |
| sun afternoon | rgb `(1,.84,.6)` × 2.35 | |
| sun dusk | rgb `(1,.6,.34)` × 2.6 | raise intensity rather than redness |
| moon | rgb `(.55,.66,1.0)` × 0.5 | night through every pane |
Rule: two hues carry the picture (one deep, one hot: cobalt + ruby in the Chartres logic), three or four more only as small touches; stone and lead take colour only from spilled or projected light; the sun's colour is the clock.
### Typography
- Subtitles: IM Fell English ~44 px (at 1920×1080) in dark ink on a parchment banderole near the bottom (curled ends, gentle sag, thin rule); it unfurls from the centre, text fades in only once it is ≥ 75 % open; pad the ribbon well past the text. Hold ≥ max(1.8 s, speech + 0.6 s). IM Fell English is a Google Font.
- Titles: incised Roman capitals in Cinzel 600 (Google Font) carved into the stone string course: dark cut, light lower lip, gilding, revealed by a moving band of light; small lines ≥ 30 px on screen.
- Inside the glass, text only as grisaille on a white-glass scroll.
- Emphasis: the light itself (a lit pane = "now"); letter spacing: not given. Case: titles in capitals.
### Layout
- Always show the room: warm grey ashlar (courses 86 units), a lighter splayed embrasure, mullions, iron saddle bars, a floor of large irregular flagstones (never the wall's running bond).
- Demo window: four lancets side by side + a rose above, title carved on the string course below; left to right = one day.
- Framing: subjects big (close-ups ~1.3–2.3× a lancet width; demo lancet 300 units, opening pane ≈ 85 % of frame height); in a narrow lancet stack figures diagonally (knight lower-left, dragon upper-right); a revealed thing near centre, ≥ ~1/8 frame width with glow.
- Backgrounds: hand-cut lozenge quarries (jittered lattice, shared vertices, a painted motif each); borders = a coloured band with pearls + a white fillet with a running vine.
- Margins and safe zones: not given (banderole sits near the bottom).
### Elements
- Pieces: smooth Catmull-Rom cuts (no deep concave corners); every piece textured (multiply in its clip): streaks at a per-piece angle, hue drift ±10 %, darker aged edges by the lead (two soft strokes, rgb 206 / 168), ±9 % thickness variation; shader adds seed bubbles, scratches and thickness clouds in world space (fade features below ~0.6× zoom).
- Lead: near-black single planar network, 6 units (4.2 on quarries, 3–4 on small details), round joins, faint grey flange, solder blobs; only where colours meet (one colour = one piece).
- Grisaille: tapered trace lines (brows 3.8, eyes 3.0, folds 2.3–2.6 units), matting wash .35–.45 (stippled, graded, soft band inside the lead), scraped highlights in the piece's own colour; mail/scales/plates as grisaille arcs and bands.
- Faces: almond eyes, heavy upper lid, big pupils, brow flowing into the nose; expression in brows and mouth, changed by swapping the face piece, never morphing.
- Figures: rigid pieces on 2D FK; long bodies as spine chains of banded pieces; knight ~7.5 heads tall, big hands.
### Motion
- Figures step at 8 fps; light, camera, shafts and dust on ones (24 fps).
- Freeze rule: a pane's figures use `min(t, t_lightLeft)`; actions land on the beat (demo 80 BPM: beat 0.75 s, bar 3.0 s).
- Light band: lit pane backlight 2.2–2.8 (STYLE: ~2–3×), band edge `bandW` ≈ lancet width + 10, softness 24, slight diagonal skew. Opening ray: `bandW` 18 → 310, skew .45 → .06 in ~1 s.
- Crack: jagged lines race from the impact in ~¼ s (demo 9 white lines in 0.28 s), bright with light, white flash 0.45 s, 2-frame shake.
- Re-leading: piece groups slide one beat each with a small outward bump along the lead, each ending in a weld spark; cracks become mending leads (a scar remains).
- Things appear by being lit, never faded in; glass never bends or morphs.
- Camera vocabulary: truck sideways with the band of light (time passing); locked close-up on one pane; pull back to the whole window (the rule); tilt down the shafts to the floor, then top-down (the picture becomes light); hold through a crack, no cut; slow push toward a small light; tilt up to a rose; rack between a lit and a dark pane; low angle along the embrasure; return to an earlier framing under new light.
### Transitions and rhythm
- Transitions: moving light, shafts, a crack, darkness; never a dissolve, wipe or flip.
- Rhythm: church modes (demo D Dorian), drones, open fifths, organum; free unmetred chant in darkness; one note meaning "the light" each time a pane wakes; a rising scale, one step per lit piece. Demo 80 BPM for metred cues, 60 (free) for the reveal; 56.5 s, 1356 frames at 24 fps; shots 1.4–7.5 s. Silence = a hard stop including reverb tails, only the glass's own ring or creak inside.
### Finish
- One WebGL compositor formula for everything: glass = tonemap(backlight × transmittance × texture) + weathering haze × room light; surfaces = albedo × (ambient + spill from lit panes + point lights); floor = flagstones × (ambient + projected colour-patch map, blurred + halo); additive light shafts with dust; bloom so bright glass eats into the lead ("irradiation").
- Hue-preserving tone mapping: blend to per-channel `1-exp(-x)` only at the very top so the sun disc burns white while blue stays jewel blue.
- Unlit panes: weak sky light + room-lit haze, figures ghostly but readable.
- Floor projection: blurred, ~20 % desaturated, stone-modulated, haloed, mirrored; shafts near 0 at the window, peaking ~40 % down.
- Grain: demo mux grain 4, CRF 22.
### 3D look (if any)
None (2.5D lighting in a 2D compositor; the floor shown in perspective or top-down).
### Banned
No vector art with black outlines; no kaleidoscope or Voronoi filter; no Tiffany Art Nouveau; not mosaic; no crosses, saints, halos or religious imagery (secular only); no morphing or bending glass; no fades-in (things are lit); no dissolve, wipe or flip; no generic piano or strings; no flat fills (clip-art); no sharp decal-like floor patch; no full-strength shafts at the window; never copy the references' characters, compositions, subjects or music.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/stained-glass.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/stained-glass/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/stained-glass/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/stained-glass.mp4
### Gaps
Bloom strength, shaft opacity and blur radii not given numerically; no easing curves for slides; no vertical-frame layout (a tall lancet would suit 9:16 but isn't discussed); letter spacing not given.

## Pictogram Motion
- Source: `lemomo-ai/lemo-opuscar` `styles/pictogram-motion/STYLE.md`, `DEMO.md`, `style.json` (No. 21, Graphic & Type); licence: MIT (docs), demo film/stills CC BY 4.0. **Caution:** the demo is an unofficial fan promo that imitates a real event's identity (Aichi-Nagoya 2026 Asian Games): its palette values and colour names, emblem-like mark, slogan and grid pattern language belong to the organiser and must not be reused; the `demo/ref/` images must never be shipped. The style grammar is reusable; the demo palette is not.
- One line: a beat-locked flash-card catalogue film; a square-grid pattern of discs and motif cells whose rows slide sideways, faceless geometric pictogram figures, and huge bilingual type sliding out of masks, every cut on a drum hit.
- Suits: any list of 20–80 items (sports, tools, dishes, stations, features), event openers, visual identities, countdowns, a day in pictograms. Real footage: no. 3D: no. AI images: no. Works with no narration.
- Catalog rating: completeness **full** · distinctness high · specification high (the most numerically specified of this group)
### Palette
Five hues + one dark neutral, each in five tones `t[0]` darkest → `t[4]` lightest, `t[2]` = base. Demo values (sampled from the real event's identity; reference only, do not reuse):
| role | hex | where used |
|---|---|---|
| red t0–t4 | `#c21d15` `#d22419` **`#e83220`** `#ec5a26` `#f07a45` | chapter hue; fg cream |
| purple t0–t4 | `#231a6e` `#2c2084` **`#4e3a93`** `#644d9d` `#7a62a9` | chapter hue; fg cream |
| green t0–t4 | `#006d35` `#008440` **`#079a3e`** `#2da547` `#68b15d` | chapter hue; fg cream |
| gold t0–t4 | `#b48900` `#c69b00` **`#d5b102`** `#debc2f` `#e7d16c` | chapter hue; fg dark `#211904` |
| ochre t0–t4 | `#946a2e` `#ac7d38` **`#c18e46`** `#d2a55c` `#e0bf84` | chapter hue; fg dark `#1e1409` |
| ink neutral t0–t4 | `#0f0c15` `#16121d` **`#1e1a27`** `#2a2535` `#3a3447` | dark chapter; fg cream, accent = gold |
| cream | `#fbf6ec` | type and figures on dark hues; end card |
| ink | `#15111c` | global ink |
Rules: a chapter = one hue (multi-hue chapters rotate the set per card); pattern at low contrast under type (`spread 0.42`) and full contrast on chapter cards (`spread 0.95`); light hues take dark type/figures and their sun disc uses the lighter tone `t[4]`; on the ink neutral the disc uses `t[3]`; disc on other hues `t[1]`. One cream and one ink serve every hue. No outlines, no highlights except one light sweep. Invent your own hue names; example sets: warm festival (red, violet, forest green, gold, ochre); coastal (navy, teal, coral, sand, sky); kitchen (tomato, basil, saffron, aubergine, flour cream).
### Typography
- Title: Inter Tight 900, 170 px (150 px in layout C, 160 px on the track, 150–330 px range) at 1920×1080, letter spacing −0.02 em, auto-fitted to 820 px; in layout B the title fills the frame at 330 px fitted to 1760 px in a "ghost" tone. Google Font.
- Second language: Noto Sans JP 900 at 92 px (or Noto Sans SC 900, with an extra JP line at 28 px/500). Google Fonts. Layout B info bar: JP name 80 px, EN name 44 px.
- Meta: DM Mono 500, 22 px, letter spacing 3 px (e.g. `ATHLETICS   01 / 43`); tags as mono chips (`5×5 · 3×3`, `NEW` in red). HUD text DM Mono 17 px in all four corners. Google Font.
- Outline index number 300 px at 20 % opacity (layout A); chapter numeral 330 px outline.
- Case: titles in capitals. Bilingual rule: one language is always the big title; the second language is a version switch (`?lang=`), never hand-edited.
- Captions (if narrated): a mono line on a solid band in the chapter hue at the bottom, never over the title; hold ≥ max(1.8 s, speech + 0.6 s); a card that must be read holds ≥ 1.6 s. An `.srt` of title cards is generated from the edit list.
### Layout
- Canvas 1920×1080; one square grid `CELL = 180` px (≈1/6 of frame height; 10.7 columns × 6 rows); everything snaps to it: chapter band 2 rows tall, transitions cut by 180 px rows or 240 px columns, finale icon wall 9×5 with 10 px gutters.
- Card layouts rotated per chapter (order string, e.g. `'ACBAB'`):
  - **A**: text block left (x 130, baseline 610); disc + figure right (centre x 1290, or 1370 for horizontal poses); outline index bottom-right.
  - **M**: mirror of A (figure at x 640, text right-aligned at x 1800).
  - **B**: title fills the frame; disc and figure over the title; bottom info bar with names and right-aligned mono meta.
  - **C**: solid 820 px left panel (`t[0]` or `t[4]`) wipes in with a 90 px hairline grid at 10 %, text on it; pattern, disc, figure on the right (1370).
- Text and figure never overlap (one text column, one stage); the figure layer is masked to zero 90–120 px before the text area; horizontal poses move the stage outward (text max width 700).
- HUD always in the corners + a progress bar of N ticks at the bottom.
### Elements
- Pattern ("core graphic"): fill with `t[1]`; on each grid node 34 % chance of a cell-radius disc in a random tone, 16 % chance of a `t[3]` disc with a `t[0]` half-radius disc inside; then a `density` fraction (default 0.5) of cells get one of 14 generic motifs (quarter-disc, half-disc, disc + dot, striped sunset, fish-scale waves, dot-scale disc, triangle scales, concentric arcs, sun wheel/gear, checker, crescent, S-wave, gradient quarter-disc, fading bars), rotated by multiples of 90°. Pattern canvas 3 cells wider than the screen (2520×1260) so rows shift ±1 cell. Never mascots, landmarks or logos in cells.
- Pictogram figure: unit = body height, origin at the hip; torso 0.30, neck 0.045, head radius 0.082, upper arm 0.16, forearm 0.15, thigh and shin 0.225; widths torso 0.145, arm 0.076, leg 0.094, round caps. Draw order: far leg, far arm (fg mixed 42 % toward background), torso, near leg, near arm, head. A second person behind at 60 % mix. Faceless; never emotes.
- Props: discs, rings, capsules, straight lines, speed lines, flight arcs.
- Stage: the figure on a sun disc (r 360–380 px) crossed by one slow 9 % white light sweep.
- HUD progress bar: current item a tall 4 px tick, done items at 75 %, the rest at 28 % opacity.
- Count-up slams (big number rolling to value in one bar).
### Motion
- Grid of time: one tempo per film; demo 150 BPM, beat 0.4 s, bar 1.6 s, 60 fps. Every shot starts on a beat; every key pose action (release, contact, landing) lands on an integer beat.
- Pace ladder: normal card = 4 beats (1.6 s); sub-family runs = 2 beats; chapter card = 8 beats; intro/finale 48 beats. Second tempo by dividing the beat, never changing BPM.
- Easing: exponential ease-out (`oExp`) for nearly every entrance; exponential in-out (`ioExp`) for whips and wipes; `o5`/`o3` for panels and discs; a back ease (`oBack`) once at most (demo: only the intro's first dot).
- Type: mask slide-up from below a clip rect; title over 0–0.5 s, second line +0.08 s, tag +0.2 s; meta lines type on without a caret; 2-beat cards compress all timings by 0.7.
- Figure assembly: for the first 0.42 s (0.28 s on 2-beat cards) the figure is cut into 54 px horizontal bands offset alternately left/right by 90–250 px that slide into register.
- Backgrounds breathe: odd rows drift right, even rows left at 26 px/s plus a fixed sine offset per row; on chapter cards every row jumps a quarter-cell on each beat of the second bar.
- Chapter card: a 2-row solid band grows from the centre (`o5`), a 330 px outline numeral rises into it, title and second line slide up, hairlines above and below.
- Long take (camera exists only here): stations one screen width apart; camera drifts 42 px/s and on every cut whips one full screen (`ioExp` from 0.14 s before to 0.24 s after the beat); two background rows of 360 px motif cells at parallax 0.28 and 0.42; event spec painted on the track sheared −0.35 at 12 % cream.
- Finale: 9×5 icon wall flips in, turns one colour, zooms to 0.9, tiles collapse to the centre into one sun; end-card sun and rings rise to y 330 while shrinking to 0.62×; last 1.3 s fade to black, 2 s black tail.
- Motion blur only inside transition/whip windows: 5 sub-frames over a 0.5/60 s shutter; static frames render once.
- Camera vocabulary: locked flat frame (default); lateral track with a one-screen whip per beat; slow drift along a row; vertical scroll by grid rows; push into one motif cell until it becomes the next frame; pull back to a tiled wall; tiles collapsing to one point; split screen along a grid line.
### Transitions and rhythm
- Grid transitions, window 0.12 s before to 0.26 s after the cut: `rows` (6 rows slide in alternating directions; into every chapter), `cols` (8 columns drop or rise; after chapter cards, in 2-beat runs), `slide` (push with a thin shadow edge; racket runs), `quarter` (quarter-discs grow from cell corners; into the finale), `iris` (circle opens from the previous figure's centre with a shrinking ring), `flip` (11×6 tile flip). Normal cards rotate `['quarter','rows','iris','flip','cols']`. No transition inside the long take (the camera whips).
- Rhythm: percussion spine (demo: wadaiko × electronic, 150 BPM 4/4, D miyako-bushi scale over D minor), per-chapter accent on every shot onset (splash, pok, clank, crack…), a big hit at chapter starts preceded by half a beat of drums-and-bass silence; onsets checked to ±15 ms (demo 79/79, ≤ 0.2 ms). Demo 163.6 s, 70 cards, 9816 frames.
### Finish
Flat, clean canvas; grain only at mux (`noise=c0s=4:c0f=t+u`); one soft light sweep (9 % white) as the only gradient; no outlines, no textures. Encode: per-worker libx264 CRF 12 from JPEG-100 screenshots, final `-preset slow -crf 14`, 60 fps, GOP 120, AAC 320k. Master: 2:1 glue compressor + limiter, −14 LUFS, ≤ −1 dBTP.
### 3D look (if any)
None.
### Banned
No depth or 3D (not an isometric infographic); figures never emote and have no faces (not a cartoon); numbers are labels, not charts; no dissolves, 3D camera moves, handheld shake or depth of field; no outlines; no gradients except the sweep; text and figure never overlap; no cream type on light hues; never copy a real event's pictograms, emblem, slogan, pattern artwork or colour names, and never name them; no mascots, landmarks or logos in pattern cells; no unbounded pattern cache.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/pictogram-motion.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/pictogram-motion/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/pictogram-motion/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/pictogram-motion.mp4
### Gaps
Exact exponential easing exponents not given (named only); no vertical-frame layouts (the demo makes 3:4 and 4:3 posters, not 9:16 film layouts); an original non-event palette is only described in words.

## ASCII / CRT Terminal
- Source: `lemomo-ai/lemo-opuscar` `styles/ascii-crt/STYLE.md`, `DEMO.md`, `style.json` (No. 22, Graphic & Type); shared post reference `core/post/crt.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: everything on screen is a real glyph on a monospace grid, lit by the amber phosphor of an old monochrome CRT; the only camera is the font size of the grid.
- Suits: developer tools, sci-fi, tech brands, logs/launch days/migrations, a machine or remote operator as narrator, messages across distance or time. Real footage: no. 3D: no. AI images: no. Needs a WebGL2 post pass for the phosphor CRT.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| phosphor dim | `#FF6605` | low end of the P3 amber ramp |
| phosphor mid | `#FFB000` | amber |
| phosphor overexposed | `#FFEBB8` | near-white top of the ramp |
| second colour (screen G channel) | `#B8E0FF` | CRT mapping of the one soft second colour |
| second colour (story) | `#BFE4FF` | blue-white Earth, the only non-amber thing, switched on a downbeat |
| unlit glass | `#090604` | warm near-black |
Rule: one phosphor (amber P3, green P1 or white P4) carries everything in its own brightness ramp; at most one soft second colour for one thing only, switched on once on a downbeat and not taken back casually. Other examples: green screen + warm pink for a living thing; white P4 + pale gold for a memory. Brightness tools only: dim / normal / bold (0.42 / 0.7 / 1.0) and inverse video.
### Typography
- One monospace bitmap-style font: VT323 (Google Font, OFL); cell 0.4 em × 0.8 em (1:2). Atlas prerendered at 160 px with a 2.2 px stroke (beam spread), scaled with `drawImage`.
- Grids per shot at 1920×1080: title 20 columns (cell width 84 px), terminal 80 columns (21 px), picture 240 columns (8 px), room 213 columns (9 px), fractal push-in up to a 450 px cell with a 40-column sub-grid (sub-text ~28 px).
- Subtitles = terminal output in a reserved LOG strip at the bottom: dim dashed separator, inverse-video `LOG` tag, `> ` prompt, the line in uppercase VT323 ~45 px, typed word by word in sync with Whisper word timestamps; holds ≥ max(1.8 s, speech + 0.6 s) (demo: 1.4 s after the line completes). Lives outside the zooming grid like a status line, same scanlines and glow. Idle states show system status (`TRANSMIT [#####.....] 40%`, `SENT … AWAITING REPLY`).
- Story text on screen is picture, exported in the `.srt` as `[SCREEN] …`. Titles typed with key clicks as a filename, command or header.
- Case: uppercase. Emphasis: bold vs dim, inverse video, font size (push-in), typing speed.
### Layout
- One monochrome terminal screen, curved at the edges; text stays in the safe area inside the curvature; keep the LOG strip clear.
- Density: negative space makes ASCII art readable; cells below luminance 0.05 stay blank.
- Depth on a grid: far = darker and sparser (×0.3), near = brighter and denser; a thin bright rim (10 px falloff) separates planes.
- One possible shot outside the screen: pull back until the screen sits inside a character-drawn terminal in a dark room (demo: with a porthole showing Earth 18–20 rows tall).
### Elements
- Density ramp: each glyph's measured ink coverage × dim/normal/bold → ~20 levels, near-duplicates dropped; small ordered-plus-hash dither per cell (amplitude 0.7).
- Picture pipeline: paint grayscale into an offscreen "negative" aligned exactly to the grid (demo 3×6 samples per cell; R = phosphor luminance, G = second-colour luminance, B = a flag such as "night side"), average per cell, pick a glyph; local contrast `m + 0.9·(m − mean)` (3×3 for rooms); gamma ≈ 1.25.
- Subjects as silhouettes, not noise (real coastline polygons; demo Earth: ocean albedo 0.14, land 0.96, clouds 0.5, terminator smoothstep −0.03…0.10, night side sparse `.` only).
- Cursor (blinking as suspense), progress bars, timestamps, error codes, status lines, inverse-video tags.
- No sprites, no free pixels, no vector lines, no free-floating panels.
### Motion
- Characters never move off-grid except in a declared transformation moment; typing, scrolling and counters jump cell to cell; a roller flips digits discretely, fast then slowing.
- Only three things move continuously: grid scale (the camera), CRT physics, particles in a transformation.
- Typing speed is performance: machine output ~10–40 ms/char (demo: boot lines 12 ms/char, commands 38 ms); dramatic lines on note values (demo: title and reply 120–150 ms/char = sixteenths at 100 BPM); human typing hand-timed and uneven, with pauses and bursts.
- Letter fall (text → image): hold the sentence 1.5 s with the cursor blinking; letters jitter and throw a ghost copy; each target cell spawns a particle from a random point inside a matching source letter, starting at 18 px, shrinking to grid size, fading in over 0.2 s; path eases in x with y = u·(0.6 + 0.4u); landing flash 1.9× brightness decaying over 0.12 s; source letters dim as they are used.
- Fractal push-in: hold 1 s where the whole glyph reads, then push until its inner text reads; inside text 100 %, outside 3–6 %, neighbour glyphs 20 %.
- Afterglow: disappearing text decays with τ ≈ 0.1–0.12 s (analytic); moving glyphs get one trail sample at t − 35 ms × 0.3.
- Power on: dot → line → full frame; power off: collapse to a dot (exposure 0 before power-on).
- Camera vocabulary (grid scale only): static 80-column terminal; push in (cells grow, demo 21 → 80 px); pull out (title at 20 columns becoming line 1 of an 80-column log); push into a single glyph; scroll the buffer; clear screen / hard redraw; text becomes image (grid shrinks as glyphs fall, 80 px letters → 8 px cells); power on/off, degauss; pull back off the glass into a drawn room.
### Transitions and rhythm
- Transitions happen on the screen: clear, redraw, scroll, power on/off; never a crossfade between two screens.
- Rhythm: analog-synth score (demo D minor, 100 BPM, every cut on a bar or beat); silence as the main instrument (room tone under typing and blinking); the score drops to digital zero including reverb tails on a shock (demo: 5 s); 1–1.5 s near-silence before a transformation; one arpeggio grows as an image forms. Demo 59.8 s, 1435 frames at 24 fps.
### Finish
- Monochrome phosphor CRT post (WebGL2, demo `crt.js`): luminance mapped along the phosphor ramp; four-level bloom at 0.55 + halo at 0.22; 3 px scanlines at 0.3 (narrower on bright areas); barrel curvature 0.045; rounded mask; warm unlit glass `#090604`; faint top-left reflection; 1.2 % HV flicker; fine noise. **No RGB grille** (monochrome tubes have none).
- No grain in the mux (the noise lives in the picture).
- For comparison, the shared colour CRT/videotape post `core/post/crt.js` (used by other styles) defaults to: bloom .85, halo .22, glow threshold .9, soft .2, sat 1.05, lift .04, contrast .15, flicker .01, exposure 1.06, fade .03, scanlines 3 px at .18, RGB grille .06, chroma bleed 7 px, red shift 2 px, phosphor glow .35, corner darkening .28, noise .018, tint (1.0,.985,.97), shadow tint (.16,.08,.22); `power < 1` animates power-on, `track > 0` adds tape tracking noise.
### 3D look (if any)
None.
### Banned
Never fake it with an image plus an "ASCII filter" (characters must be drawn as characters on a grid); no hacker-movie green rain; no pixel-art sprites or free pixels; no sci-fi HUD vector lines or floating panels; no second hue for decoration; no RGB grille; no crossfades between screens; never chiptune; copy no film's interface text, fonts or logos; no real agency names; no noise-textured subjects (silhouettes instead).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/ascii-crt.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ascii-crt/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/ascii-crt/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/ascii-crt.mp4
### Gaps
No vertical-frame column counts (grid widths are for 1920×1080); bloom radii/levels beyond "four-level" not given; the green/white phosphor ramps not given as hex; no margins in pixels for the curvature safe area.

<!-- category: Information & Keynote -->

## Data Storytelling (pencil chart on cream paper)
- Source: `lemomo-ai/lemo-opuscar` `styles/dataviz/STYLE.md`, `DEMO.md`, `style.json` (No. 23, Information & Keynote); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: one real chart drawn mark by mark on cream paper by a red–blue pencil, with handwritten notes pinned to the numbers; the chart is the camera, the rhythm and the plot.
- Suits: data journalism, reports, climate/science, any series, ranking or distribution with a human angle. Real footage: no. Real data: **yes** (openly licensed, traceable; numbers never changed). 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F6F3EC` | background, with fixed-seed fibre noise |
| dot grid | `#E4DDCF` | 24 px world-space dot grid |
| ink | `#2B2723` | axes (1.4–1.6 px), series line (2.4 px), caption, dot rings |
| gridlines | `#DDD6C9` | 1 px |
| zero line | `#BDB4A5` | 1.3 px |
| tick numbers | `#6E665C` | IBM Plex Mono ticks |
| blue pencil lead | `#2F5D8A` | memories, human notes |
| red pencil lead | `#A8283A` | records, warnings |
| pencil wood cone | `#E3C79C` | the pencil prop |
| diverging ramp (cold → centre → hot) | `#2166AC` → `#4393C3` → `#92C5DE` → `#D1E5F0` → `#F2EEE8` (centre) → `#FDDBC7` → `#F4A582` → `#D6604D` → `#B2182B` → `#7A0F1E` (beyond +1) | data values only (ColorBrewer RdBu family); u = (v − centre)/half |
| accent (non-data) | `#D97757` | engine showcase spark; one accent may bypass the ramp |
Rule: colour encodes one thing, the value. Diverging ramp centred on a meaningful reference mean with a symmetric span (demo: 1971–2000 mean 0.22 °C, half-span 0.85 °C); sequential ramp when there is no natural centre. Never stretch a ramp for drama; pale values stay pale. Everything else is ink on cream. A change of pencil lead (blue → red) marks a turn.
### Typography
- Newsreader (Google Font, text serif): chart headline in world space above the plot, 66 px; figure-caption subtitle 42 px at x = 180, baseline y ≈ 985 (1920×1080), ≤ 2 lines, left-aligned with the chart, hairline rule above, small mono kicker with the range drawn so far (`1926–1958`).
- Caveat (Google Font): handwriting, 30 px world size, pencil colours, per-glyph ±1.7° rotation and ±2.5 % baseline jitter, 16 % of pixels knocked out for graphite grain, written on left to right as the pencil tip moves.
- IBM Plex Mono (Google Font): tick numbers 17–20 px.
- Case: sentence case; notes like `1926 — she is born.`
- Emphasis: lead colour (blue human notes / red records), un-closed ring around the mark, position pinned in data space.
- Caption words appear on Whisper timestamps over a paper-colour band; 3-frame rise and fade, flips up when it leaves; hold ≥ max(1.8 s, speech + 0.6 s), asserted in `tools/subs.py`. No captions over a signature chart operation or a silence. Title fades when the camera is close, returns with the full view.
### Layout
- Frame 1920×1080. Plot box fixed in world space (demo 1500 × 520); a "memory zone" for early notes; bottom 150 px band for the caption.
- Every note pinned in data space (value + pixel offset) so rescales keep the layout; first note above its mark, late notes above-left of their dot.
- When the real axis scrolls off-screen, its tick labels pin to a paper strip at the frame edge (frozen pane).
- Key moments: subject fills ≥ 1/3 of frame height. Tracking: newest mark at ~60 % of frame width (demo 62 %).
- One idea at a time (not a dashboard). Pick the chart the data asks for: bars/bar race (categories), scatter/bubble (relationship), map/choropleth (place), unit/waffle (parts, people), slope/dumbbell (before→after), histogram/beeswarm (distribution), Sankey (flow), line/dots/stripes/area (time).
### Elements
- Data dots r = 6 px with a 1.5 px ink ring; landing pop 0.25 s to ×1.55 plus a thin ripple (ripples suppressed when marks land < ~0.1 s apart).
- Leaders: wobbly pencil curves ending in an un-closed ring around the mark. Doodles (three-curl wave, heart), brackets, sparkles.
- The red–blue pencil: hex body, blue half/red half, sharpened wood cone; only the tip end shows, entering from lower right at 35–58°; shadow drifts farther and softer with lift; sharp tip, soft body.
- Dashed "next cell" for the unknown next value; warming stripes; ink shapes = flat fill + hatching + hand outline.
- Engine functions (Canvas 2D, `demo/engine.js`): `drawPaper`, `applyCam`, `valueColor`, `pencilStroke`, `inkShape`, `plotShape`, `stripesFill`, `dotTrail`, `handText`, `setType`, `dataDot`, `morphMark`, `dashedCell`, `drawPencil`, `caption`.
### Motion
- Data rhythm = film rhythm: marks mapped to a musical grid; accelerate by dividing the beat, not changing tempo. Choose a tempo whose finest subdivision lands on whole frames (demo 90 BPM: a 1/32 note = exactly 2 frames at 24 fps). Demo density: 7 points on quarters → 24 on eighths → 40 on sixteenths → 27 on thirty-seconds (a point every 2 frames).
- Pencil acting: lift before each tap, land with shadow meeting tip, tiny rebound; hurries as data densifies; trembles at a peak; can flinch (recoil and freeze; demo freezes half a beat then a 0.5 s end-over-end flip to the red lead), hesitate (hover), exit.
- Rescale as ratchet clicks: four steps on 1/32 notes, each eased over 0.09 beat; a calm rescale is smooth. A frame-break must hold the pierced state ≥ half a beat (a rescale after 0.17 s was invisible).
- Morph: staggered sweep over 0.85 beat; each dot falls to the band centre (first 45 %), then stretches to a full stripe (ease-out) and loses its ring; line segments fade as their left dot starts; notes return as tiny pencil marks.
- Camera: 2D `{x, y, zoom, roll}` over one sheet; one take. Demo values: cold open ECU ≈ 4×; pull back to 1.55×; tracking 2.3 → 1.7×; Dutch angle creep 0 → −1.5°; punch-in over 2 frames 1.22 → 1.42× with decaying shake; rush pull-out to 1.0× with roll −3° and constant 2 px tremor; full view 1.06×; scale pull to 0.72×. Vocabulary: ECU on one mark following its leader; full view then dive; pull back as axes grow; track the pencil; pedestal with Dutch angle; 2-frame punch-in; fast pull-out with roll; locked-off for a morph; hold then pull back; pull and pan to add more real data; lateral pan across the memory zone.
### Transitions and rhythm
- No fades to blank, no dissolves. Transitions are chart operations: axis growth, pull-backs, rescales, morphs, a cell widening into the next frame (frame within frame). A hard cut is rare and meaningful (demo: one cut, into silence).
- Demo 50.0 s, 1200 frames at 24 fps, 90 BPM. Silences: 1.0 s true digital silence before the last point; 0.67 s near-silence before the empty cell.
### Finish
Cream paper with fixed-seed fibre noise and faint dot grid (world space); graphite grain in pencil strokes; rack focus (defocused foreground pencil to its tip) at the cut. No grain at mux (grain 0).
### 3D look (if any)
None.
### Banned
Not a dashboard (one idea at a time); not a keynote with chart slides; never decoration; never change the numbers or extrapolate; never stretch a colour ramp; no fades to blank or dissolves; no captions over a chart operation or a silence; voice never over a rush, silence or morph; no synthesized human sounds (use a soft non-human sound); never select data columns by index; never copy Rosling/Hawkins/Pudding/NYT charts, layouts or typefaces or name them.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/dataviz.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/dataviz/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/dataviz/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/dataviz/demo/stills/engine_demo.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/dataviz.mp4
### Gaps
No vertical layout; plot box size only for the demo; sequential-ramp hex values not given; no type sizes for title at other zooms beyond demo; data-space pin offsets not quantified.

## Isometric Infographic (flat three-tone diorama)
- Source: `lemomo-ai/lemo-opuscar` `styles/iso-infographic/STYLE.md`, `DEMO.md`, `style.json` (No. 24, Information & Keynote); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a system diagram comes alive as a floating isometric diorama of flat three-tone blocks, thin ink labels and Isotype numbers; things open up to show their insides and numbers are drawn from icons.
- Suits: process explainers, supply chains, annual reports, "how X works" (hospital, data centre, recycling, city power). Real footage: no. Real data: numbers must be real and add up. 3D: no (2D canvas projection, no 3D engine). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| coffee red (top/left/right) | `#CF5140` / `#B3352B` / `#8C2620` | subject hue (demo), title block sides, legend chip |
| leaf green | `#7BA75F` / `#5E8C4A` / `#476F37` | plants, hill |
| sea blue | `#5A9BCB` / `#3C7FB1` / `#2D6390` | water (always the same blue) |
| cream | `#FBF4E6` / `#F2E6D0` / `#D9C8A9` | plinth, plates, subtitle card (`#FBF4E6`) |
| background | `#F2E6D0` | ground behind the board, with a faint isometric dot lattice |
| soil | `#A77850` / `#8A5B3A` / `#6A432A` | board strata |
| mustard | `#E9BE5C` / `#D9A53A` / `#B0832A` | cranes, road |
| ink | `#2E2522` | 2 px infographic lines, labels |
| shadow mix target | `#231A2C` | `tri()` mixes the dark face 22 % toward this; the top face 20 % toward warm white |
| process colour change (example) | `#A9B27C` → `#D9C27A` → `#B07A45` → `#6A3B22` | green → yellow → cinnamon → brown roast |
| accent (engine demo) | `#D97757` | any-shape test |
Rule: pale neutral ground + 5–7 flat hues, each with three tones from its face normal (top light, left/+y mid, right/+x dark), one ink. Colour codes meaning like a legend; never one hue for two meanings. The subject's hue is reserved: for "this one", everything else desaturates toward warm grey (focus + context). Example sets given in words only: recycling (bottle green, kraft brown, can silver-blue, compost umber, mustard on cream), hospital (teal, coral, lavender, steel grey on pale grey), data centre (electric blue, amber, graphite, mint on off-white).
### Typography
- One geometric sans: Jost (Google Font). Titles 600 all caps, tracking ~0.12 em; numbers 400 at ~44 px; units 500 at half size (sizes at 1920×1080).
- All text has a ~7 px halo in the ground colour (cream) so it reads over any block.
- Titles can be isometric type on a world plane, extruded as blocks (demo: Jost 700 words extruded on a cream plate, cream face, coffee-red sides, one word per eighth note).
- Subtitle = a map label: cream card, 10 px radius, 2 px ink border, tiny coffee-red iso cube as legend chip, Jost 500 at 42 px in ink, bottom-centre 64 px from the bottom edge; border draws first (0.2 s), text wipes left to right; exits sliding down 8 px and fading. Keep the bottom ~170 px clear. Hold ≥ max(1.8 s, speech + 0.6 s); lines never overlap titles, each other or the end card.
- Emphasis: label pins with Isotype rows under them; "NOT TO SCALE" on the legend end card.
### Layout
- True isometric, axes at 30°: `sx = (x − y)·cos30°·k`, `sy = ((x + y)·½ − z)·k`; x down-right, y down-left, z up; painter depth = x + y + z; everything queued, depth-sorted, then flushed. The projection never rotates or tilts.
- A square diorama board (demo S = 240 world units) projects to a rhombus of almost exactly 16:9; lay a process route as a Z across it (far corner → right → across the middle → near corner).
- Board floats on the pale ground with a soft blurred shadow; front faces show strata (soil, water column, floors, pipes).
- Stations to be found in a wide shot: pale cream plate with a dashed ink outline + one accent hue; keep surrounding buildings low.
- Subject ≥ 1/3 of frame height at key moments; labels never cover it; subtitle zone clear. End card sits in the empty cream corner.
### Elements
- Solids: no outlines; separated only by the three tones. Primitives: box, prism (any footprint), cylinder (standing/lying, spinning stripes), cone, gable roof, flat-disc sphere with lit cap and dark crescent, ground decals, 3D polylines, billboards, iso text.
- Ink lines 2 px only for infographic furniture: leaders, label pins (dot with ink ring + cream fill → vertical leader → horizontal rule → text, pointing up/down/left/right per station), dashed cut lines, hatched section faces, rotating dashed tracking ring with a tag ("you are here"), route line, legend.
- Circular inset callout ("frame within the frame") grown from a leader.
- Isotype numbers: identical three-tone icons (sun, moon, box, sack, bean, cherry) re-arranged each time (calendar grid, bar, silhouette of a cup, distance bar); fractional lit count for pop-in.
- People: minimal billboards (round head, tapered two-tone body, thick arm stroke, hat/hair for identity, no faces), stepping at 12 fps.
- Hero close-ups (hands, objects): flat faceted shapes in three tones; opening and closing close-ups share the same pose, camera, zoom and tag position.
- Flat isometric clouds with fake parallax (1.25× ground motion), fading out above k ≈ 40.
### Motion
- "Nothing moves without a line leading it": route drawn slightly ahead, leader grows before an inset opens, cut line draws before a skin slides.
- Cutaway: cut line 0.3 s → near skin slides out along its normal 0.35 s ease-out (alpha 1 → 0 between 10 % and 75 %) → hatched rims fade in over the last 40 %.
- Isotype fill: icons pop with a back-ease (overshoot 2.2), one per sixteenth note; count-up numbers over the same span.
- Accumulation = acceleration: arrivals on quarter notes, then eighths, then waves (demo: four sixteenth-note waves of ~44 boxes, each dropping 7 units with a small bounce).
- Solids arrive by motion, never by alpha. Squash on landing ~18 % + two small bounces; sway ±0.09 rad; colour changes show a process.
- Vehicles follow polylines with ease-in-out and face their tangent.
- Camera: world centre + log-interpolated zoom k (px per unit); demo range k = 3.75 (whole board) to 8,000 (one bean). Demo moves: open ECU k ≈ 600 with slight drift; pull ×35 to first station; dive = three pushes through nested cutaways, slow → faster → fastest (0.9 s, 0.6 s, 0.6 s); silence push k 3,200 → 8,000 while colour drains; snap-out pull ×470 in 1.2 s, ease-out in log zoom. Fade tall objects in by zoom (`alpha = clamp((80 − k)/40)`); skip small detail above k = 120.
- Vocabulary: follow along a route; hold wide + circular inset; push through nested cutaways; fast log pull-out; locked frame while things accumulate; lateral follow over emptiness; top-to-bottom tilt through strata; switch boards.
### Transitions and rhythm
- One continuous take is one option (demo: no cuts); a cut to a new board or an inset is the other. Hidden time/place jumps go inside a dive, drawn in screen space anchored on the tracked subject.
- Demo: 58.8 s, 1,411 frames at 24 fps; acoustic world groove ~100 BPM, café section slowing to ~70 BPM and stopping, one guitar restarting at 80 BPM. Two real silences (dive 30.0–33.6 s; 45.3–45.9 s digital zero). 68 cue points checked at 0 ms.
- Sound J-cuts 0.5–0.6 s before a station appears; one kalimba note per station in the final pull-back.
### Finish
Flat; soft blurred shadow under the board; faint dot lattice on the ground. No grain (mux grain 0). No lighting beyond three face tones.
### 3D look (if any)
Not real 3D: a 2D canvas isometric projection with three-tone face shading; reads as a diorama. Could be rebuilt in Blender with an orthographic camera at true-isometric angles and flat emission shading, but the source does not do that.
### Banned
No perspective; never rotate or tilt the projection; no outlines on solids; no lighting beyond three face tones (not low-poly 3D); not a flat 2D explainer; not a blueprint; no semi-transparent moving solids (ghosts); no hue reused for two meanings; numbers must add up; no piano or string pads in the demo score; high-band ambience beds (2.5–7 kHz) kept very low under speech; never copy Monument Valley / SimCity / Kurzgesagt / Isotype characters, buildings, icons, palettes or music.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/iso-infographic.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/iso-infographic/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/iso-infographic/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/iso-infographic/demo/stills/frame_v2_hands.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/iso-infographic/demo/stills/engine_shape.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/iso-infographic.mp4
### Gaps
No vertical framing (the square board is chosen to fill 16:9); margins not given; label pin leader lengths only as parameters; colours for non-demo palettes described in words only.

## Dark Tech Keynote (software launch on a black stage)
- Source: `lemomo-ai/lemo-opuscar` `styles/dark-keynote/STYLE.md`, `DEMO.md`, `style.json` (No. 25, Information & Keynote); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a software launch film where the interface is the star; near-black stage, hairline grid, soft cool light, one brand accent, and UI that snaps to grid and beat.
- Suits: product launches, SaaS features, keynotes, app promos, "one stat" announcements. Real footage: no. Real data: no (one number). 3D: no (2.5D canvas camera). AI images: no. UI is original and drawn in code.
- Catalog rating: completeness **full** · distinctness medium-high (common genre, but very precisely specified) · specification high
### Palette
| role | hex | where used |
|---|---|---|
| stage base | `#0A0B0F` | background |
| radial lift | `#151822` | upper-centre lift on the stage |
| cool glow | `#3B4CCA` at 8 % | one large glow, upper right |
| grid line | `rgba(255,255,255,.032)`, every 4th `.06` | hairline grid, 48 px module |
| window surface / raised / raised-2 | `#12151C` / `#1A1E28` / `#222734` | three raised dark surface steps |
| border / inner top highlight | `rgba(255,255,255,.08)` / `rgba(255,255,255,.07)` | 1 px |
| text / secondary / label | `#E8EAF0` / `#8A90A0` / `#5C6272` | three greys, slightly blue |
| brand accent (the one colour) | `#B7F34A` lime, glow `rgba(183,243,74,.35)` | cursor, CTA pill, checkmarks, key number |
| alt accents (pick one per film) | `#8B7CFF` electric violet, `#FF7A1A` signal orange | |
| problem red | `#FF5A5F` | badges/warnings only while the problem exists; never after the turn |
| category flow colours | files `#C9D3E6`, photos `#F2A65A`, notifications `#7E95FF` | motion trails only, never static UI |
| caption toast | `rgba(12,14,19,.72)` (`.88` over busy frames), border `rgba(255,255,255,.09)` | caption pill |
| accent (engine demo) | `#D97757` | `setAccent` example |
Rule: cool neutral ladder only (neutrals slightly blue, never warm brown); one saturated luminous accent with its own glow, reserved for what the product is or does; "if two things are accent-coloured, one is wrong". Problem colour = noise, accent = product.
### Typography
- Inter (Google Font, variable): UI, captions, headlines. Inter Tight 600 (Google Font): giant numbers, tracking ~−4.5 %. JetBrains Mono (Google Font): labels, filenames, status text; wide tracking in small-caps labels (e.g. overline `TIDY · A LAUNCH FILM`).
- Sizes at 1920×1080: hook text ~150 px in an extreme close-up; captions Inter 500 at ~40 px; window title bar 40 px tall.
- One line per screen for headlines. The big number gets its own screen with no caption over it.
- Captions are a UI component: bottom-centre toast pill, 1 px light border, soft shadow, Inter 500 40 px `#E8EAF0`, 8 px accent "speaking" dot; enters with a 12 px rise + fade in 0.16 s. Hold ≥ max(1.8 s, speech + 0.6 s). Product content lifts (demo 25 px) while captions are up.
- Text typed by the cursor in frame is its own subtitle (goes only to the .srt, not burned twice).
### Layout
- Generous negative space, one focal element, the accent at the focal point.
- 48 px hairline grid module; elements snap to grid slots (uniform tiles 60–64 px, radius 20 %).
- Windows radius 14 px; title bar with only a small glyph and title.
- Dutch angle and wobble only for disorder (demo 1–2° with handheld wobble).
- Margins/safe zones: not given beyond the caption lift.
### Elements
- Original UI kit drawn in code: rounded windows (never traffic-light buttons, menu bars or docks), notification cards ("now"), folded-corner file icons with mono filenames, procedural photo thumbnails, inbox rows with unread dots, tab strips, badges (999+), storage bar, uniform snap tiles, a brand mark (squircle + cursor) and wordmark.
- Surfaces: three raised dark steps, 1 px border ~8 % white, 1 px inner top highlight, soft shadows.
- The cursor (caret) as protagonist and brand mark.
- Light trails (9 segments, additive) in category colours; four-point sparkle path; accent-lit grid slot outlines.
### Motion
- 24 fps on ones, no stepping, no boil. Everything lands on the grid and the beat; moves start a beat early.
- Easing: fast-out with one small overshoot (`back`, s ≈ 1.3) and an immediate settle; no floaty sine drift.
- Spawns 0.2–0.3 s, one motion per element type: files drop 34 px with a 6 px bounce (0.22 s); photos fling in with rotation (0.3 s); notifications slide 90 px from the right (0.24 s); windows pop 0.94 → 1.0 (0.22 s). Tension tremble ±2.4 px in the last second before a freeze.
- Collapse (signature): a ring expands from the cursor at 2600 px/s; as it passes, each element flies to its own type's row along a curved path (same type bends the same way, rows filled by y then x order so paths never cross); flights 0.26–0.40 s, morph into tiles in the first third, overshoot along the final tangent, settle.
- Cursor acting: blink 0.5 s on / 0.5 s off (metronome); interrupted = 8 px shove + 10 % squash + 0.25 s decaying wobble; wind-up height ×1.35, width ×0.8, ease-in over 12 frames (≥ 8); press 2 frames at height ×0.3, width ×2.4; spring follow-through with overshoot over 0.6 s.
- Light reveal: lit area trails the front by 700 px, 360 px soft glint at 20 % rides the front, unlit areas at 7 %, ≤ ~1.3 s total.
- Number scramble: glyphs cycle at 24 fps with a 3-copy vertical smear; digits lock right to left on sixteenth notes, each with a small damped bounce.
- Put-away: one element retracts per beat, window rim lights in accent, window collapses vertically like a CRT off (ease-in 0.22 s) and shrinks into the cursor. Nothing just fades.
- Stage and grid never move on their own. Camera: 2.5D (`s = 1/(1/zoom − z)`), near cards blur with magnification; strip-rendered Y rotation ≤ ~24°. Demo moves: hook push ×1.04; continuous pull-back ×5 → ×1 over 4 bars, keyed per bar in log space with monotone interpolation; freeze push-in ×0.8 → ×2.6 ease-in-out; whip pull-out ×2.6 → ×0.78 in one beat (cubic ease-out); product turn −24° → 0° over 4.5 s under a light sweep; dive log-zoom to ×16 + match cut; breath push ×1.08; echo = exact first framing.
- Camera vocabulary: locked ECU on a tiny UI element; continuous log pull-back; push-in through a frozen frame; whip pull-out in one beat; dive into a UI element + match cut; half-second inserts expanding from source; near-locked turn under a light sweep; slow lateral track; top-down plan; return to an earlier framing.
### Transitions and rhythm
- Every shot change is a UI expand/collapse; no fades, no blank frames. An expansion on a beat starts one frame early so the beat frame is ~80 % open. Half-second inserts for overload.
- Demo: 42 s at 120 BPM; every UI element spawns on a score note (two marimbas phasing on a 12-note pattern; files on the on-grid voice, notifications on the drifting voice); all voices land on one A major 9 chord at the press. Silences: 15.0–16.0 s digital zero on every track; 33.0–34.0 s near-silence (−60 dB room).
### Finish
No grain (mux grain 0). Radial lift + one cool glow + 50–55 % corner vignette; soft shadows; accent glow; multi-sample motion blur on flights (`motionBlur`). Soft light-band reveals with glint ≤ 20 % (a hard white glint reads as a sticker).
### 3D look (if any)
None in 3D; 2.5D depth with lens blur and strip-perspective rotations up to 24°.
### Banned
Not a glass product render (no physical object); not a screencast (no real OS or apps); not a hologram HUD (no scanlines); not a chart film; no traffic-light buttons, menu bars, docks or any real OS chrome, app layouts, fonts, logos or melodies; no fades or blank frames; no floaty sine drift; no stepping or boil; problem red never after the turn; never two accent-coloured things; no caption over the big number; no warm-brown neutrals; secondary hues never on static UI; nearest-slot snapping (reads as flicker); flat tinted rectangle for "closing"; never name Apple/Linear/Stripe/Vercel/Reich/Wright in the film.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/dark-keynote.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/dark-keynote/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/dark-keynote/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/dark-keynote.mp4
### Gaps
No vertical layout or safe zones; headline sizes other than the hook not given; vignette shape unspecified beyond 50–55 %; easing curves named (`back` s ≈ 1.3, cubic ease-out) but no bezier values.

## Living Screencast (pixel mascot inside a redrawn real UI)
- Source: `lemomo-ai/lemo-opuscar` `styles/living-screencast/STYLE.md`, `DEMO.md`, `style.json` (No. 46, Information & Keynote); CSS/overlay values from `demo/index.html` and `demo/main.js`; licence: MIT (docs), demo film/stills CC BY 4.0. Note: the demo is an unofficial fan film using Anthropic's Clawd mascot and a close redraw of the Claude app; a user's film must use its own product and mascot.
- One line: a product walkthrough that looks like a real screen recording, but every pixel is redrawn in HTML/CSS/SVG and a low-res square-pixel mascot lives on the hi-res UI and acts out what the software does.
- Suits: product tutorials, feature launches, onboarding, app walkthroughs (45–75 s). Real footage: no (no screenshots; real UI redrawn, labels must match the real product's docs). Real data: coherent demo content. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
Rule: the product's own interface colours rule (follow its real light and dark themes exactly); the mascot keeps the brand mascot colour or one saturated hue no UI element uses; overlays are neutral frosted glass with at most one accent from the product. Demo values (Claude app theme):
| role | hex | where used |
|---|---|---|
| ink (light / dark theme) | `#1F1E1C` / `#EEEAE2` | UI text |
| clay accent (light / dark) | `#D97757` / `#E08565` | accent, send button, caret, mascot body, chapter number chip |
| clay2 (light / dark) | `#BD5D3A` / `#EE9A7B` | stressed word in captions/slogan, @-mention text |
| window bg ivory (light / dark) | `#FAF9F5` / `#1E1D1B` | app window |
| oat / side / panel (light) | `#F0EEE6` / `#F4F2EC` / `#FFFFFF` | UI surfaces |
| lines (light) | `#E6E3D9` / `#D9D5C8` | borders |
| mute / faint (light) | `#85827A` / `#B8B3A6` | secondary text |
| diff add / del (light) | bg `#E7F3E8` ink `#2F7D3F` / bg `#FBE9E7` ink `#B4432F` | diff lines |
| plan mode (light) | bg `#EEF0FA`, border `#C9CDEA`, ink `#3F4AA0` | plan pill |
| wallpaper (light) | `#E9E1D1` base + radial blobs `#F3D9C6`, `#E7C6AE`, `#EFE6D2` | desktop behind the window |
| mascot shading / eyes | `#B85F40` / `#2A2622` | Clawd sprite |
| props | pencil `#F2C14E`, heart `#E0543A`, check `#2F9E4F` | pixel props |
| caption pill (light / dark) | `rgba(250,249,245,.88)` text `#1F1E1C` / `rgba(30,29,27,.82)` text `#EEEAE2` | frosted caption |
| key HUD | `rgba(31,30,28,.88)` panel, keycaps `#3A3834`, pressed key `#D97757`, label `#D8D2C6` | keystroke HUD |
| spotlight vignette | `rgba(25,22,18,.55)` at the edge | spotlight freeze |
### Typography
- UI type follows the product, or licence-free look-alikes: Inter (Google Font), JetBrains Mono (Google Font), Newsreader (Google Font) for editorial UI.
- Demo sizes at 1920×1080: caption pill Inter 500 33 px, line-height 1.3, letter-spacing −0.005 em, max width 1400 px, 52 px from the bottom, padding 12/26 px, radius 16 px, backdrop blur 14 px, stressed words in clay2 (not italic); key HUD Inter 600 17 px, keycaps 38 px tall, radius 8 px; chapter pill Newsreader 450 30 px with an Inter 700 14 px number chip (`01`–`04`, clay fill, tracking .04 em) at top-left 56/48 px; time-lapse tag JetBrains Mono 700 22 px on clay at top-right; diegetic title Newsreader 96 px weight 340, tracking −0.02 em; chapter wipe label Newsreader 112 px weight 360 with Mono 700 30 px number (tracking .2 em); end slogan Newsreader 64 px, last word clay italic.
- Information layers only: chapter pill, KeyCastr-style key HUD, frosted caption pill, optional "▶▶ 4×" tag. Nothing else overlays the screen.
- Captions at the bottom, never over the element being discussed, never under the mascot; hold ≥ max(1.8 s, speech + 0.6 s).
- A title, if any, is diegetic (empty-state heading, window title, notification).
### Layout
- One app window floating on wallpaper with a soft shadow (window radius 14 px; shadow `0 30px 80px` + `0 8px 24px`); zoom never shows beyond the monitor (zoom ≥ 1).
- Overlay corners: chapter pill top-left (56, 48 px), tag top-right (56, 48 px), key HUD bottom-left (56, 56 px), caption bottom-centre (52 px up).
- A text-free lane reserved for the mascot; caption and discussed element never overlap.
### Elements
- Redrawn real UI (windows, menus, popovers, diff lines, stat bars `+24 −3`, mode pills, file tree, sessions sidebar), all live DOM.
- The mascot: square-pixel sprite (demo 18×10 grid unfolded 1:1 from the terminal logo's quadrant block characters), props on the same grid (pencil, "!", sparkles, heart, dust); hard edges against anti-aliased UI is the look.
- Cursor: black arrow with white 1.6 px stroke and drop shadow; click ring 3 px clay border.
- Spotlight: radial vignette around one badge. Pixel wipes for chapter changes; theme-reveal circle (clip-path circle growing from the toggle).
### Motion
- 30 fps (STYLE.md); UI on ones; mascot position snapped to half-pixels of its grid so it feels stepped; the sprite scales with the camera.
- Mascot stands only on top edges of real UI elements, position measured from the live DOM every frame.
- Jump: anticipation crouch 0.14 s with squash 0.28, stretch on take-off, tucked legs, landing squash with damped bounce, dust puffs (~0.4 s). Idle: tiny squash on every beat, irregular blinks. Walk: 9 steps/s leg alternation, sprite flip for direction. Eyes: neutral/left/right/up/down/wide/happy/shut/blink, looking at what matters; arms down/up/wave.
- Cursor: smoothed spring-eased paths, small push on click, never teleports.
- Cause and effect: every mascot action triggers a real UI change; every user action is a cursor move, click or keystroke on the HUD. UI animates only like the real product.
- Camera: recording-software camera, one continuous take, zoom ≥ 1, cuts only under chapter transitions. Vocabulary: push-in to cursor/caret; slow drift at rest; whip-pan between panes with blur; push-in + vignette freeze; rack focus between panes; pull back to full window; follow the mascot along a list; split-window reframe.
- Motion blur only on whips: from camera velocity, anisotropic Gaussian on an untransformed wrapper; blur per axis = min(36, max(0, |v| − 30) × 0.3) px, so slow pushes stay sharp.
### Transitions and rhythm
- Transitions: chapter-pill wipes, pixel wipes, theme-reveal circle; never dissolves or screenshots. Cuts only under chapter transitions.
- Demo: 59.4 s, 12 shots in 4 chapters, ~104 BPM; every visual beat hung on a spoken word (`W(id, word)`); tom fill + crash at each chapter seam.
### Finish
Clean digital; soft window shadow; frosted-glass overlays (backdrop blur 14 px); rack focus only on panes not being read; vignette spotlight. No grain stated.
### 3D look (if any)
None.
### Banned
No screenshots or real capture; no invented features or renamed modes (if it isn't in the docs it isn't in the film); no lorem ipsum; no hand, arm or finger on screen (the cursor is the user); mascot never floats, covers readable text or sits under a caption; no blur on text to be read; never zoom out past the screen; no dissolves; no UI flourishes the product doesn't have; foley never on word onsets; not a dark keynote (no black stage, no invented UI), not a pixel-art game (only the mascot is pixels); never copy Screen Studio/Apple/Duolingo/Headspace/Arc characters, UI, music or footage.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/living-screencast.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/living-screencast/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/living-screencast/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/living-screencast.mp4
### Gaps
Palette is product-dependent (only the demo's theme given); no vertical layout; push-in zoom levels and spring constants for the cursor not given in the docs; pixel size of the sprite relative to frame not stated in docs (code uses px 6 in one chapter label).

## Sci-fi Hologram HUD (wireframe spec scan)
- Source: `lemomo-ai/lemo-opuscar` `styles/hologram-hud/STYLE.md`, `DEMO.md`, `style.json` (No. 52, Information & Keynote); theme colours from `demo/engine/hud.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: an object is scanned into a glowing line wireframe over a projector pad; target boxes lock onto parts, each explodes along its axis, a leader pulls out and its number rolls from glyph noise into the real value; once, it may ignite into a solid hologram.
- Suits: spec walkthroughs, launch videos, trade-show loop screens, teardowns, upgrades (v1 → v2), assembly order. A "scene style": content swaps via `content.json`. Real footage: no. Real data: the product's real specs. 3D: yes, but as a canvas wireframe engine (vertices/edges/quads, perspective orbit camera), not a renderer; a model must be built (primitives or a CAD export). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
Colours are parametric: one cold `hue` + one warm `accent` (0–360). Demo hue 188 (cyan), accent 38 (amber); alternate content 204 / 18 (blue / orange); suggested pairs mint/orange, violet/lime, ice-blue/red. Values below are the engine's HSL formulas; hex is computed from them for hue 188 / accent 38 (not given in the source).
| role | value (source) | hex at 188/38 (computed) | where used |
|---|---|---|---|
| stage base | `hsl(hue+12, 70%, 2.4%)` | ≈ `#02080A` | background |
| radial lift | `hsl(hue+6, 65%, 7%)` | ≈ `#06181D` | lift behind the subject |
| line | `hsla(hue, 100%, 72%, a)` (wireframe 50–80 % lightness) | ≈ `#70ECFF` | wireframe, HUD |
| dim | `hsla(hue, 70%, 52%, a)` | ≈ `#2FC3DA` | resting HUD |
| hot / hi | `hsla(hue, 60–70%, 92–93%)` | ≈ `#E2F5F8` | scan front (the 7 cm under it), opened hot pieces, pings, flashes |
| accent | `hsla(accent, 100%, 64%, a)` | ≈ `#FFBC47` | locked values only, from the frame they become true |
| text plate | `rgba(1,8,12,.72)`, border 28 % | | every text block |
| subtitle plate | `rgba(1,8,12,.62)` | | subtitle |
| keep exception | e.g. `#D97757` | | one object may keep its own colour (brand mark) |
Rule: the hue carries lines, HUD and fills; the accent is spent only on locked values; white = heat (active); everything at rest sits in the hue's alpha levels.
### Typography
- Rajdhani (Google Font), all caps: Light 300 for big numbers and the product name (wide tracking, demo 26 px tracking; product name up to 176 px in a 410 px column), Medium/SemiBold 500/600 for labels (2–3 px tracking). Share Tech Mono (Google Font) 20–22 px for micro data (coordinates, counters, zoom, model code).
- Numbers monospaced so rolls never jitter; the decimal point is a small square.
- Subtitles are HUD: dark plate with two diagonal brackets and four "voiceprint" bars moving with speech, near-white Rajdhani Medium 38 px, wrap 1180 px, bottom centre (baseline y 962 at 1920×1080); in 0.1 s before the voice, out 0.12 s before the next line; hold ≥ max(1.8 s, speech + 0.6 s).
- No title card: the name rolls in like a value, then code, category and tagline (tagline wraps at 420 px, shrinks to 20 px).
- Text never sits on the wireframe: every block on its own dark plate (1 px border, 10 px corner ticks).
### Layout
- Frame 1920×1080. Big spec cards at x ≥ 1240; chip rail at x 110–470 (rail step `min(112, 410/(n−1))` px, fits 5 chips); subtitles bottom centre; loupe above y 580.
- HUD chrome: 46 px corner brackets 44 px from the edge; rulers tick every 24 px (every 5th long); top-left `product // SPEC SCAN`; top-right live status line (`SCANNING 042%` → `SCAN COMPLETE · 3 SYSTEMS` → `TARGET 2/3 · MOTOR` → `HOLO SOLID · 360°` → `SPEC SHEET · READY`); telemetry at the bottom.
- Three depth layers always: background dot grid (48 px, parallax 0.2), subject + pad + floor, foreground HUD (rulers parallax faster).
- Subject ≥ 1/3 of frame height at every key moment; cards one side, rail the other; shorten explode vectors rather than fly a piece into text.
- Use-case information order (STYLE §11): spec walkthrough = name + tagline → one spec per part → weight/price → CTA (title ≥ 5 s, value ≥ 2.5 s then docked, final sheet ≥ 3 s, 30–40 s, 2–5 parts); loop screen 3 s per spec, 5 s final, 20–30 s, last frame = first; teardown 4–6 s per part, 40–60 s; upgrade 3 s per upgrade; assembly one bar per part.
### Elements
- Projector pad in true perspective: rings at r = 0.7 / 1.05 (bright) / 1.12 (dashed) / 1.45 / 2.1, 120 ticks (every 10th long), 24 radial rays, rotating 0.12 rad/s.
- Wireframe: additive (`lighter`) 1.3 px strokes in 7 alpha levels by depth fog (near bright, far ~25 %); real CAD topology (tubes = rings + longitudinal lines); every piece physically connected.
- Target box: oversized, rotated 45°, faint, with tag `TGT 0N · LOCK`. Leader: anchor ring on the part body → diagonal → horizontal to the card. Spec card, docked chips, markers, loupe (frame in frame, ×4.3 with its own counter-orbit), scan plane, beam (one path, nonzero winding, gradient 10 % → 0, 26 rays, 70 dust motes).
- Solid hologram: faces = screen-space Fresnel `0.3 + 0.7·(1 − facing)^1.6` × scrolling interlace (2 px full / 2 px at 38 %, scrolling 1 px per frame); lines stay on top.
### Motion
- Everything on ones at 24 fps; only glyph scrambling steps every frame.
- Target lock: starts at 1.9× the rest-pose bbox at 30 % alpha, snaps in ~0.2–0.22 s (cubic ease-out), flashes white 3 frames on the downbeat.
- Explode along each piece's assembly axis: shell slides along its own axis, contents stay and glow hot; open over 1 beat (key part 2 beats), close over 0.5 s. Motor-type parts split axially with counter-rotating rotor/stator.
- Leader draws in ~0.5 s. Rolling value: characters lock right-to-left (0.5 s; key part 1 s), turn accent on the downbeat with a one-frame flash.
- Chip dock: card fades 0.35 s, chip slides x 140 → 110 into the rail and stays to the end.
- Ignition: line width ×1.5 easing to ×1.12; a light wave ±7 cm climbs the model.
- Camera: orbit (yaw, pitch, distance, narrow fov 0.6) with a screen position for the target. Whip follows the box: 0.5 s cubic in-out, starting 0.45 s before the next lock; real motion blur only inside the whip (5 sub-frames over 1/48 s, 180° shutter); HUD stays sharp. Demo values: hook pitch 14°, orbit yaw 57° → 24° craning down; push-in dist 2.85 → 1.6 (1.5 s ease-out) then drift; orbit about hub axis yaw −11° → 46°; regroup to pitch 0; turntable 360° + crane 0 → 13°; lockup dolly 3.5 → 3.4.
- Vocabulary: high 3/4 slow orbit craning down; top-down plan; eye-level locked profile; push-in then drift; whip following the box; orbit around a part's axis; lateral dolly along a long part; pull back + loupe; crane to eye level or up; turntable 360°; nearly static slow dolly.
### Transitions and rhythm
- No cuts or fades inside the scene: only the scan plane (scan in / scan-erase top-down) and a loupe iris. A glitch of three frames at most once, on the biggest change.
- Music on a grid, a bar = one information beat; locks on downbeats (demo 120 BPM, 1 bar = 2 s, all cues on the 1/16 grid, 0 ms). Key part 3 bars, others 2 bars each. Demo 39 s (34 s scene + 5 s end card), 936 frames.
- Density follows information: half-time for reading, one beat of true digital silence before the biggest change, a drop (808-style glide + wide saw chord) at ignition, a layer added per part.
### Finish
Additive glow: two low-res passes (¼-res blur 3 px ×0.85, ⅛-res blur 4 px ×0.7); depth fog on lines; strong vignette (0.5); fading dot grid; scrolling interlace on solid faces. No grain (mux grain 0).
### 3D look (if any)
Line wireframe made of light in perspective (no shaded render); optional once-only translucent Fresnel faces with interlace. Models in metres, y up, normalised to a bbox diagonal of 2.3117; ~5k vertices / 6k edges. Translates to Blender as an emission wireframe (Wireframe modifier or line-art) with bloom, but the source is canvas.
### Banned
Never a rendered product (always a wireframe; not glass-product); not a type-driven keynote; not a blueprint drafting sheet; text never on the wireframe; accent never on anything but locked values; no cuts or fades inside the scene; at most one 3-frame glitch; no floating/disconnected pieces; no generic-box parts (give characteristic silhouettes); no UI blips inside a silence; no pumping ducks (hold the duck through word gaps); no long diagonal leaders pointing ambiguously; never copy Iron Man/Avengers/Oblivion layouts, icons, fonts or colours.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/hologram-hud.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/hologram-hud/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/hologram-hud/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/hologram-hud/demo/stills/alt_title.jpg (also `alt_signature.jpg`, `alt_lockup.jpg`: the blue/orange drone swap)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/hologram-hud.mp4
### Gaps
No vertical layout (card/rail x positions are 16:9-specific); hex values not given (HSL formulas only); requires a hand-built wireframe model per product; glitch look not specified beyond "three frames".

## Transit Map
- Source: `lemomo-ai/lemo-opuscar` `styles/transit-map/STYLE.md`, `DEMO.md`, `style.json` (No. 72, Information & Keynote, added 2026-10-29); counter colours from `styles/transit-map/demo/timeline.js`, paper/table values from `demo/gl.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a printed octilinear metro schematic lying on a dark table, drawn on by glowing pen tips while a real perspective camera rides, dips and sweeps over the paper with shallow focus.
- Suits: growth of a network over time (transport, rollouts, store/sensor networks), routes, roadmaps or careers drawn as lines, two rivals on one time axis. Real footage: no. Real data: yes, a checked network with dates and lengths (`FACTS.md` required; an invented network only for fiction or metaphor, labelled on screen). 3D: no Blender, but a WebGL perspective camera over a flat plane with analytic depth of field. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high (the most numerically specified style in this group: every mark is given in grid units)
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F2EEE5` | the printed sheet (shader paper ≈ rgb .952/.936/.900) |
| ink | `#1B1C1E` | text, interchange outlines, casings |
| secondary text | `#4A4740` | second-language lines, notes (warm grey) |
| river / water fill | `#BCD6EA` | water bands and areas |
| water edge | `#8FB5D6` | 0.025 G darker edge |
| water labels | `#5F88AD` | river/bay names |
| accent | `#E3002B` | first section, "you are here" dot, verdict stamp (also Line 1) |
| comparison navy | `#24346E` | anything compared against (London line) |
| table | about `#1B1918` | near-black warm table under the sheet (shader ≈ rgb .105/.098/.094) |
| counter plate | `#17191C` / `#2A2D31` | dark enamel plate (from code) |
| counter drums | `#EFE9DC` / `#FAF6EE` | cream rolling drums (from code) |
| counter labels | `#EFE8D8`, `#AAA395`, `#8B8577` | native label, second label, units (from code; roles approximate) |
| line colours (demo, as published for Shanghai) | 1 `#E3002B`, 2 `#82BF25`, 3 `#FCD600`, 4 `#461D84`, 5 `#944D9A`, 6 `#D40068`, 7 `#ED6F00`, 8 `#0094D8`, 9 `#87CAED`, 10 `#C6AFD4`, 11 `#871C2B`, 12 `#007A60`, 13 `#E999C0`, 14 `#626020`, 15 `#BCA886`, 16 `#98D1C0`, 17 `#BC796F`, 18 `#C4984F`, Pujiang `#B5B5B6`, Maglev `#008B9A`, airport `#3D688A` | lines |
Rules: line colour = identity only (published colours for a real network; for an invented one, hues spaced round the wheel at similar weight). Transport mode is shown by line form, never hue. Light line colours (yellow, lilac, aqua, light green, sand) carry ink inside bullets, deep ones white. Fade the network back with a paper veil (60 % paper; stations under it keep ~20 %), never a dark overlay.
### Typography
- Faces: a neutral grotesk for Latin and figures, Inter in the demo (Google Font); a CJK sans of matching weight, Noto Sans SC subset to the characters used (Google Font). OFL, self-hosted.
- Bilingual on every printed text: native language above, second language below, one line each, never wrapped.
- Sizes are in grid units G on the sheet (native / second): hub label 0.30 / 0.17 bold; interchange 0.23 / 0.14 semibold; named stop 0.20 / 0.14 semibold, second line warm grey 0.03 G below; callout date figures 0.58 heavy, native line 0.34, second 0.24; printed panel titles 0.58–0.60 / 0.36–0.38; cartouche title 0.64 / 0.30, note 0.24 grey; water names 0.22 / 0.17 set along the band; bullet numerals weight 800 at 0.27 (one figure) / 0.22 (two) / 0.15 (short word), opening year 0.17 bold.
- On-screen legibility at 1920×1080 (size on sheet × zoom, foreshortened by tilt): native line ≥ 20 px, second ≥ 12 px (≥ 16 px on the counter); a two-line label counts only if its block is ≥ 26 px tall on screen.
- Counter (screen space, 1080p): native label 24 px, second label 17 px, drum figures heavy (weight 800 at 0.7 × 60 px drum height).
- Every label gets a paper-coloured halo (0.05 G stroke at 92 %). Emphasis: the red accent and stamped verdicts; hub labels grow on pull-back by × (85 / zoom)^0.6, max 1.75.
- Words on screen: everything is printed on the sheet or on the counter; the film title is printed on the map (cartouche, bullet, name plate or callout), never a floating card. Reading time ≥ (CJK chars ÷ 4.5 + other chars ÷ 15) + 1.5 s.
### Layout
- Unit = grid step G; stations on a 0.1 G lattice, ≥ 0.7 G apart along a line; a city network ≈ 30 × 30 G, sheet ≈ 45 × 47 G with margins for the cartouche and printed panels. Zoom is measured in px per G at the aim point (1080p).
- Eight directions only: every segment horizontal, vertical or 45°; every corner one fillet radius.
- Labels placed once before frame 1 against the finished network: eight candidates, preference E, W, NE/SE, N/S, NW/SW; hubs and interchanges first.
- Counter owns the top-left corner (plate ~660 px wide, 86 px per row, 14 px radius, four screws); nothing important under it. Subject off-centre with room ahead of a moving tip.
- Density: roughly one new event (line, interchange, landed value, callout) every 3–5 s. Minimums for a whole network in 30–60 s: ≥ 5 lines, ≥ 40 named stations, ≥ 8 interchanges, ≥ 1 water body, ≥ 3 landmarks, ≥ 4 dated states. One route (≤ ~20 s): the line + ≥ 3 crossing lines, ≥ 8 stations, ≥ 3 interchanges, ≥ 2 states. A topic drawn as a network: ≥ 4 lines, ≥ 20 stations, ≥ 4 interchanges, ≥ 3 states.
- Cartouche in one corner: ink bar, map name in both languages, one-line grey note. Last shot shows the whole network with the end title printed in a margin.
### Elements
All in G:
- Line 0.15 wide, round caps, fillet 0.34; thin line (second rail mode, ferry thread) 0.07, fillet 0.30; parallel lines offset ±0.10 (0.20 centre to centre).
- Stop: white disc r 0.085, ring 0.046 in line colour; minor stop r 0.065, ring 0.036, ≤ 1 per 0.78 G; terminus ring r 0.15 with 0.06 ink outline when it matters.
- Interchange capsule: bounding box of the station's line points padded 0.13, stadium corners, white fill, ink outline 0.055 (0.07 major hub); crossing at one point → circle r 0.13; never rotated to 45° (diagonal spread → rounded square).
- River band 0.76 wide (0.70–1.0 big river), 0.025 darker edge; creeks 0.15 with 0.02 edges; seas/lakes as eight-direction outlines.
- Tunnel under water: line dashed 0.16 on / 0.11 off + two ink casing lines 0.02 at 55 % opacity, 0.05 outside each edge.
- Bus: hollow line (colour as two edges of max(0.04 G, 2.5 px), paper core ≥ 2.5 px; ink rim max(0.015 G, 1 px) if luminance < 0.4). Ferry: 0.07 thread on a 0.25 G paper lane (≥ 10 px on screen), piers = white rounded square 0.17 with 0.04 ring. Walking transfer in-station: white bar 0.06 with 0.055 ink outline; through the street: ink dots r 0.015 every 0.08.
- Pen tip: white core r 0.11, ring 0.05 in line colour, halo r 0.8 (45 % at centre). Line bullet: rail disc r 0.25; bus/ferry rounded square 0.48, radius 0.12. Vehicle: white capsule 0.40 × 0.14, ink outline 0.026, three windows 0.064 × 0.056.
- Callout: accent bar 0.10 G wide, heavy date, native line, second line; paper block with soft shadow (no border) if over lines. "You are here" dot r 0.17 with 0.04 white outline and a pulsing ring.
- Paper inside a line (bus core, ferry lane) is erased (`destination-out`) so the real paper shows; ink order water → surface lines → rail → stops/capsules → labels.
- Objects near the lens in screen space: a cream enamel station name plate on a post, out of focus.
### Motion
- 30 fps (demo), smooth. Pen tips on monotone keyframes; may slow at stations, never stop mid-segment.
- Stop pop: from 0.6× with small overshoot in ~0.28 s, ring spreading 0.10 → 0.42 G, fading in 0.6 s.
- Interchange: scales down from 2× in 0.22 s with an ink ring to 0.64 G. Major interchange falls from above in ~0.4 s from 3.4× size, shadow offset and blurred, sharpening on landing; then rings in ink and in the meeting lines' colours spread to 1.4–2.6 G in 0.9 s. A line leaving an existing station starts ≥ 0.5 s after the first line arrived there.
- Line bullets spring in with a back ease carrying the opening year; fade when the story moves on.
- Vehicles: constant speed, ~2 G/s trains and buses, boats 0.85 size at ~1.2 G/s; one per 4 G of track each way, only on finished track.
- Callouts wipe on from their bar in ~0.5 s. Odometer drums land only on sourced values and spin blurred between; plan ~1 landing per 2 s (≈ 1.8 s hold for five characters).
- Never moves: built geometry, label positions, paper and its light.
- Camera: pinhole, 32° vertical FOV (~42 mm full-frame), no roll; tilt from straight down, heading, zoom in px/G, focus always on the aim point. DoF blur = aperture × |depth − focus| ÷ depth, capped at 26 px at 1080p. Tilt never above 65°; top views no blur, any tilt > 10° some blur. When riding a tip, tip speed × zoom ≤ ~500 px/s on screen.
  - Ride the pen tip: aim ~1.5 G ahead, tilt 15–30°, heading ±15°, 130–260 px/G for 1–3 G/s, aperture 16.
  - Drop low where a line meets water: tilt ~60°, 185 px/G, aperture 26, eased over ~0.5 s.
  - Continuous pull-back with level-of-detail fades: tilt 12° → 0°, 80 → 50 px/G, aperture 6 → 0.
  - Low oblique sweep: tilt 57–62°, heading swinging ~40°, ~100 px/G, aperture 24.
  - Glide to another panel: tilt rises to ~25° mid-move and back, aperture ≤ 8.
  - Rise until sheet edge and table show: tilt ~30°, ~40 px/G.
  - Push in under a paper veil: tilt 4° → 0°, 60 → 140 px/G, aperture 3 → 0.
  - Locked frame: tilt 0°, aperture 0; hold ≥ 2.5 s before a verdict.
- Level-of-detail by zoom: minor stops fade in 55–85 px/G, interchange names 62–90, named-stop names 100–130; hubs always shown.
### Transitions and rhythm
- Match cuts on round shapes (a headlight, a lamp, a coin becomes a station dot), glides across the sheet, hard cuts to a new panel. No page turns, no fades to black mid-film.
- Camera changes every 3–5 s (demo); demo 47.0 s, 12 shots, 120 BPM D major with a two-note station chime (vibraphone A5 → F♯5 + glockenspiel an octave up) at each turn; one beat of near-silence before a verdict. Accelerate by adding voices, not tempo; grooves run in film time.
### Finish
- Procedural tileable paper in world coordinates: value cloud ~9 G period with detail to 0.04 G, tooth ~2.4 G period, fibres 0.02–0.1 G; paper value ±3 % (fibres up to 3 % darker); ink multiplied by tooth so flat colour varies 7–10 %.
- One raking light ~33° above the paper from one corner (NW in demo), neutral, fixed; lifts that corner ~7 %. Specular sheen up to +10 % only when tilt > ~30°, full at 65°.
- Sheet edge contact shadow fading over ~0.2 G; far table into warm dark haze.
- Grade: vignette up to −24 % in corners, gamma 1.02, light film grain at master (mux grain 1); no colour cast, no bloom except the pen-tip halo.
- Ink texture rendered at ~1.35× screen density at focus, capped 4096², mipmapped, anisotropic.
### 3D look (if any)
2.5D: a flat printed plane seen by a real perspective camera (WebGL ray–plane intersection, analytic DoF, raking light, sheen). No extruded buildings or terrain.
### Banned
- Not Data Storytelling, not Blueprint (no white-on-blue linework), not Isometric Infographic, not a 3D city map, not a keynote (no slides, header bars, centred titles, page turns).
- No segment off 0/45/90°; no wiggling lines; capsules never rotated to 45°.
- No mode-by-colour (no "ferry blue"); no paper-coloured strokes painted in place of erased paper; no dark overlays (use paper veil).
- No floating title cards or captions over the picture; no time-flashed labels; no labels placed against a partly drawn network.
- No counters that interpolate or show unsourced figures; no unchecked facts; no operator logos or branded bullets (real networks are an unofficial tribute, said on screen); never copy Beck/Vignelli layouts, typefaces, icons or bullets or name them.
- Paper texture never stronger than a few percent; camera never lower than ~25° above the paper; no fades to black mid-film; no top view throughout.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/transit-map.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/transit-map/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/transit-map/demo/stills/styleframe.jpg (at 36.2 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/transit-map.mp4
### Gaps
Sizes are in G and 1080p screen pixels only; no vertical-frame layout (the counter and camera zooms would need re-deriving for 1080×1920). Bus, ferry and walking-link forms are specified but not shown in the demo. Counter colours are only in code, not in the docs. No subtitle style (the demo has no narration).

## Isometric Picture Book
- Source: `lemomo-ai/lemo-opuscar` `styles/isometric-picture-book/STYLE.md`, `DEMO.md`, `style.json` (No. 74, Information & Keynote, added 2026-10-29); extra colours and subtitle values from `styles/isometric-picture-book/demo/kit.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a calm, full-bleed true-isometric place in flat three-tone paper colours, where small faceless people seen from behind obey a rule in order and serif words land on the floor one character at a time.
- Suits: everyday rules and manners (queues, boarding, crossings, lifts, triage), process orders, "two ways compared" explainers. Real footage: no. Real data: yes when it states facts (the demo cites a 2012 test in `FACTS.md`). 3D: no (2D canvas isometric). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper ground (bg) | `#F1E8D8` | every ground, warm neutral |
| paper light | `#FAF4E8` | lid undersides, light paper (kit) |
| concrete / apron | `#EAE2D3` | outdoor ground, a touch cooler (joint lines `#DDD3C1`) |
| carpet | `#F2E5CE` | indoor ground, a touch warmer (lane `#EADAC0`, edge `#DCCAAC`) |
| ink | `#2A2E29` | floor type, dark marks |
| soft ink | `#7A7468` | secondary marks (kit) |
| ghost | `#D6CCBA` | the pale ghost a floor character fades from |
| accent persimmon | `#D0573A` | reserved for the rule: key character, "stand here" outline, arrows, lit sign, winning number (light tint `#EDBFA9`) |
| subject green | `#3D6B59` / `#6E9886` / `#A7C2B2` | the place's own hue: seats, livery bands, chairs (paler tint) |
| marking ginger | `#E2AE3A` | lead-in lines, tugs, baggage tractor |
| people tops | `#B9824F` ochre, `#7F98AE` fog blue, `#8C8199` grey violet, `#D3C29E` oat | four muted tops, an even four-colour weave |
| people legs | `#3E4450`, `#59534A`, `#3A3D42`, `#4B4F5A` | trousers |
| hair / skin / shoes | `#2A2624` / `#D9A882` / `#232524` | figures |
| fuselage / glass / metal / screen | `#F6F2EA` / `#C3D8D1` / `#CEC7BA` / `#2F3532` | demo props |
| tone targets | lift toward `#FFF8EA` (22 %), drop toward `#5B4434` warm umber (20 %) | `tri()` three-tone shading of every solid |
| subtitle bar | `rgba(250,245,236,.86)` | pale bar; English line `#4A4A42` |
Rules: warm paper neutral, one dark ink, one accent only where the rule is (many frames carry none), one subject hue, one marking colour; the subject hue and marking colour must differ clearly in hue and value from the four tops. Shade toward warm umber and paper, never grey or violet.
### Typography
- Chinese: Noto Serif SC (Google Font), 700 for keywords, 500 for particles; Latin and numerals: Newsreader (Google Font). Subset to the characters used.
- Floor type sizes are in metres on the ground: big ≈ 1.5 m, small ≈ 0.8 m, read along the up-right axis. A painted title or pair of numbers may scale up to ×1.6.
- One phrase per beat (one line where tight), one accent character or number per phrase (never a single thin stroke such as 一).
- Subtitles at 1920×1080: one cue per narration line on a pale rounded bar (radius 6, pad 18 px) in the lower safe area; Chinese line 34 px weight 500 above, English line 25 px Newsreader weight 420 below, English baseline at y = 1022 (≥ 54 px from the bottom); hard switch, never two cues at once. (A single-line English variant: 32 px Newsreader 420.)
- World signs face the camera side at the iso angle, never a flat card facing the lens.
- Words on screen: the floor carries only the line's key word or number, never the sentence. At most three numbers to remember, each with what it compares to, held ≥ 2.5 s. Reading time ≥ CJK/4.5 + Latin/15 + 1.5 s fully in frame.
### Layout
- One real place, full bleed: the ground runs off every frame edge; no board, frame line or vignette. A travelling topic = one continuous ground at one scale with stops along it.
- Type on clear ground, nothing raised in front of it, ≥ 5 % from every frame edge and clear of the subtitle bar.
- Large calm ground areas around the type; people in tidy lines and rows; few props; one place, one action, one phrase per beat. Queues keep ~0.75 m between feet; floor numbers beside people need ~1 m spacing.
- Routes run along world axes with few right-angle turns, walkers heading up-left, up-right or across (never toward the camera).
### Elements
- True isometric (axes 30°), Canvas 2D painter's sort by floor footprint (x + y at floor level).
- Solids: flat three tones per colour (top lifted to paper, +y face base, +x face dropped to umber); curved bodies faceted and quantised to the same tones plus one in-between; no outlines, shadows, textures or highlight spots.
- Vehicles from boxes/prisms at real size in metres, small low dark wheels mostly under the body.
- Ground carries only functional markings (lanes, chevrons, lead-in lines, stop bars, seat squares) and a faint tile/slab grid.
- Cut-aways: near wall cut low, far wall keeps windows; lids are separate solids with paper-coloured undersides, hinged on the far edge; glass a pale tint with thin mullions, cut to a parapet when in the way.
- People: billboards anchored at the feet, 1.6–1.8 m tall, round dark head with a sliver of skin at the ear, two-tone torso, separate trouser legs, dark shoes, optional long hair/skirt, rolling case; no faces, no hands. Seated: shoulders and back of head over a low seat back.
- Diagram marks: accent outlines ("stand here"), flat accent arrows that grow ahead of walkers and branch, light running along a path, floor bars in proportion with a dashed bracket for the difference, timer.
### Motion
- 30 fps on ones.
- Floor characters land ≈ 0.14 s apart: fade and scale 1.22 → 1 (ease-out over ~0.34 s) while the colour goes from pale ghost to ink (~0.1–0.48 s after start).
- Walk ≈ 1.5 m/s; nobody faster than ~3 m/s on screen even in time-lapse (> ~6 m/s, 0.2 m per frame, reads as teleporting). Compress a long process by showing places filling, not people zipping.
- People move only when the rule says, in order; walking scissors the legs along the screen with counter-swinging arms; sitting = step back into legroom, sidestep, sit; a case is lifted up over the bin and lowered in.
- Everything eases, nothing pops. A beat = one floor phrase + one diagram mark + one action.
- Crowds simulated once at load (deterministic) and sampled with interpolation.
- Rewind = the same motion backwards, faster, with a counter running down.
- Camera: the iso angle never changes; moves are translation and zoom only. Slow drift and push ≈ 6–8 % zoom; follow the head of a line; travel along the ground at the subject's pace; rise to wide while a lid opens; locked frame; step back to frame a whole incident; tilt down from outside to the people; scale jump (room → building → site).
- Easing helpers in the kit: `ss` (smoothstep), `eo` (ease-out), `eio` (ease-in-out), `seg`.
### Transitions and rhythm
- A continuous move, a lid opening, a run back along the same path, or a cut on the beat at the same angle. No page turns, wipes, black or blank frames. A pull-out shows its next subject within 0.5 s. A lid finishes turning paper side up inside the frame before gliding off away from the camera.
- One shot per narration line, each line starting as its action starts (demo: 14 shots in 59.8 s, 100 BPM F major). A sustained low string root overlaps every cut; music ducks ~16 dB under the voice.
### Finish
Flat: no lighting, gradients, shadows, glints, textures, vignette or frame line. Mix ≈ −16 LUFS before mux, true peak under −1.5 dBFS. Grain not given.
### 3D look (if any)
None; isometric solids are drawn in 2D (boxes, prisms, cylinders, cones, roofs, faceted polygons) with three-tone flat shading.
### Banned
- Not Isometric Infographic (no floating board, dot lattice, sans-serif pins, icon stats, inset bubbles), not Low-poly Island (no lighting, faceted terrain, shadows or glow), not a cartoon (no expressions or gags), not a slide (no headers, centred titles or cards).
- No faces or hands; no people walking toward the camera; no people passing through seats, walls or each other.
- No outlines, shadows, textures or highlight spots on solids; no shading toward grey or violet; no gradients.
- No zigzag paths; no serpentine crowds; no high seat backs hiding seated people.
- No accent as decoration; no accent trail across the whole film.
- No page turns, wipes, black frames; no type standing behind raised objects; no flat sign cards facing the lens; no sentence on the floor.
- Never copy reference explainers' characters, layouts, typefaces or music.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/isometric-picture-book.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/isometric-picture-book/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/isometric-picture-book/demo/stills/styleframe.jpg (at 37.5 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/isometric-picture-book.mp4 (an English build `isometric-picture-book-en.mp4` is described but not listed in the release)
### Gaps
No zoom levels in pixels per metre; no vertical-frame guidance (subtitle bar position is for 1920×1080); grain/finish values not given; exact easing durations for camera moves not given (only the 6–8 % push).

## Circuit Board
- Source: `lemomo-ai/lemo-opuscar` `styles/circuit-board/STYLE.md`, `DEMO.md`, `style.json` (No. 76, Information & Keynote, added 2026-10-29); full palette from `styles/circuit-board/demo/src/palette.js`, finish values from `demo/src/post.js`; licence: MIT (docs), demo film/stills CC BY 4.0
- One line: the subject redrawn as a top-down printed circuit board (copper under green mask, gold pads, white silkscreen) with information running as amber light along the traces, the camera riding the pulse and zooming between map scale and component scale.
- Suits: energy, power and signal paths, supply chains, networks and latency, "how a thing travels" explainers, devices from country to chip (nested scales). Real footage: no. Real data: yes for factual films (demo keeps `FACTS.md`; real geography re-routed octilinear). 3D: no (flat top-down 2D canvas). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high (motion described qualitatively but the engine, palette and finish are exact)
### Palette
| role | hex | where used |
|---|---|---|
| laminate (FR-4) / board bg | `#05190F` | dark green base, bare laminate, sea, holes (what is absent) |
| glass-weave texture | `rgba(120,200,150,0.045)` / `rgba(120,200,150,0.03)` / `rgba(0,0,0,0.10)` | two crossfaded weave octaves |
| bottom copper through laminate | `rgba(60,140,96,0.22)` | faint show-through |
| copper pour | `#1C6A44` | fills the board (mid green) |
| pour / trace rim | `#4AA977` | bevelled light rim on every copper edge |
| trace fill | `#2B8158` | narrower fill stroke |
| via fence ring / hole | `rgba(63,158,108,0.85)` / `rgba(3,18,11,0.85)` | stitching vias, fences along clearances |
| ENIG gold pad | `#D9B25B` (edge `#A07B30`, sheen `rgba(255,240,190,0.28)`, drill `#06130D`) | pads and vias |
| bare copper accent (one part only) | hi `#F2B184`, mid `#C9784A`, lo `#8F4C27`, edge `#6E3A1E` | demo dam bar |
| silkscreen | `#F2EEE1` | all type, outlines, symbols |
| current (amber) | rgb(255,190,84), head rgb(255,236,180), edge rgb(255,196,110) | energy/current light, near-white core |
| second flow (silver-cyan) | rgb(170,214,226), head rgb(228,246,252) | water, data, goods |
| fault | red (no hex given) | at most once in a film |
| vignette | `rgba(0,10,6,0.55)` (post uses 0.58) | screen-space |
| desk | `#0B0D0C` (highlight `rgba(52,56,50,0.45)`) | only when the whole board is the subject |
Rules: the film is green in three values; never recolour the mask per scene. Gold for metal, at most one bare-copper accent, one off-white ink. Light is the only saturated colour and carries meaning (amber = energy, silver-cyan = second flow; a third colour only if it must be told apart).
### Typography
- All board type is silkscreen in one monoline stroke font routed like traces (0/45/90° strokes, chamfered corners, round caps), drawn in code (`font.js` + `hanzi.js`); not a Google Font. Hanzi are hand-routed on a 12 × 12 grid with the same stroke width as the Latin; simplified characters only, proofed at large size. Latin set: capitals, digits, common signs and lowercase `a b d e k l m o p s u z` only (missing glyphs print `?`), so English labels go in capitals.
- Roles: bilingual labels (Chinese line above a smaller English line, same stroke width); board-native one-language text (designators, voltages, timestamps, km, values); micro texture (pinyin tags, notes, REV/SHEET lines) that may fade below reading size (< ~9 px not checked).
- Sizes at 1920×1080: title caps ≥ 60 px (demo end-card title ≈ 75 px, sign-off ≈ 25 px caps).
- Text is world-anchored and plotted stroke by stroke; it stays when the camera pulls back.
- Subtitles (with voice): bottom safe area, dark translucent plate, Chinese over English in an open sans (Noto Sans SC, Google Font, subset), 34 px / 24 px at 1080p, coming and going with the voice (~5.6 characters/s in the demo). The board prints only the voice's key words and numbers, never sentences; picture text stays above the subtitle band.
- Reading time ≥ 1.5 s + CJK chars ÷ 4.5 + Latin chars ÷ 15, fully in frame; a label that leaves frame during a ride fails even if it returns.
### Layout
- Straight-down view always (small rotation about the view axis allowed). Lit subject on a third, or dead centre for symbols.
- At least two layers of detail around the subject (background copper/vias/routes; foreground motes or depth-of-field blur).
- Board edge shown only when the whole board is the subject; keep the view inside the outline by the frame half-diagonal + 4 % of board width.
- Keep labels out of the top and bottom depth-of-field bands and the vignette; never cut text at the frame edge in a held shot.
- Density: fill empty copper with real board texture (stitching vias visible at map scale, via fences along every clearance, mask mottling, micro silk, real unlit routes); never decorative routing.
- Demo matched step-down: one on-screen symbol size (300 px) across four cuts, label in the same screen place.
### Elements
- Layers bottom-up: FR-4 laminate with glass-weave basket texture; copper pour with every feature as a clearance (rim pass then fill pass with clearance grown ~1.6 px → bevelled rim), mottling on the pour only; traces (rim stroke + narrower fill, round caps, laminate channel each side, 0/45/90° runs, mitred corners); ENIG gold pads (rect, round, square pin-1) with a sheen band on the top third and a dark drill; vias as gold rings with dark bores; fiducials and mounting holes at corners; silkscreen (off-white monoline with pinhole texture punched out, blurred 0.35 px): outlines, designators, polarity marks, component symbols.
- Components as schematic footprints: chip, electrolytic cap, transformer, bridge rectifier (diamond with four diode symbols), reactor, capacitor bank, ground, tag, box.
- Geography as copper: rivers, lakes, coasts as clearances with via fences; cities as test points; corridors as buses of parallel traces. Demo main line ≥ 6.5 px wide at map scale.
- Detail callout: an assembly-drawing circle showing another place or board at a chosen scale beside the compared thing. Timestamp tags: silk frames printing times at two stations. Title block with REV A / SHEET 1 OF 1.
### Motion
- 30 fps on ones; `render(t)` pure. Motion blur from measured screen motion, 180° shutter, 1 to ~20 sub-frames, never across a cut.
- Current types told apart only by motion: AC = short dashes rocking back and forth over a faint energised line (demo swing slowed to ~0.55 Hz); DC = continuous stream behind a travelling head with slow inner streaks and slowly dimming afterglow; step-down = thinner trace, smaller dashes; second flow = several parallel streamlines of dashes, faster in the middle, short glints.
- Pads flash on arrival (quick bright bloom, then steady glow); a component's internal symbol edges glow while current passes.
- Silkscreen appears only by plotting stroke by stroke; copper and pads never pop in; the board never moves (only the camera).
- Camera vocabulary: ride the pulse (head on a third); rise while following until both ends are in frame; crash zoom onto a pad; locked macro hold; whip along a trace; matched cut on a centred symbol; plunge through a hole/via and reverse out of another (hold on the hole first, plunge ≥ 0.6 s); continuous log pull-out across nested boards (six+ orders of magnitude). Demo: pull-out ×10 in 2.0 s, step-down cuts 0.7 s each, whip at 18.75 s, end push with a 2° turn.
- Level of detail: textures crossfade octaves; vias, designators, rims fade before going sub-pixel so zooms never shimmer.
### Transitions and rhythm
- Motion-into-motion and matched cuts; no fades, wipes or page turns.
- Each spoken line gets one picture action (a pad lights, a stream changes shape, a tag prints). Demo: 60 s, 12 shots, 100 BPM in G with the drone tuned to mains hum (50 Hz ≈ G1; 60 Hz ≈ B♭1); AC heard as an amplitude-gated tremolo tone, DC as a steady tone; relay clicks for arrivals; drop the rhythm before a verdict (demo verdict held 5.4 s before "=").
### Finish
- Additive light layer: two blurs (≈ 24 px and ≈ 5 px) under a sharp copy; cap glow widths and flash radii in pixels so wide traces don't turn into white bars.
- Screen space per frame (post.js): depth of field as a blurred copy (blur 2 + 7 × dof px) faded into top and bottom bands (band 0.12 + 0.12 × dof of frame height); warm key light radial pool rgba(255,246,220,0.10 → 0) from upper left (centre ~0.3 W, 0.22 H, drifting), screen blend; 26 out-of-focus motes (radius 14–60 px, alpha 0.025–0.075, parallax 1.25–2.15×, 60 % warm rgb(255,206,130), rest rgb(210,240,250)); optional noon window light (soft-light parallelogram rgba(255,232,190) with one multiplied mullion shadow); vignette radial from 0.36 H to 1.05 H reaching rgba(0,10,6,0.58); film grain at mux (amount not given).
- Mix ≈ −16 LUFS before master, true peak < −3 dBTP, high-pass ≈ 55 Hz; bed 15–18 dB under voice.
### 3D look (if any)
None. Top-down 2D only; "macro photography" feel comes from screen-space DoF, motes and key light.
### Banned
- Not Engineering Briefing Board (no photos, no handwriting), not Blueprint (no white-on-blue, no paper), not a sci-fi HUD (no glass, floating panels, glowing UI chrome), not a 3D circuit city (no rising buildings, no perspective).
- No perspective ever; no decorative traces; no two traces crossing on one layer (use a via; crossing a bare channel is fine); no flat empty pour.
- No mask recolouring per scene; red only for one fault; no overexposed bloom bars.
- No text in DoF bands or cut at the frame edge; no whole sentences on the board; no system fonts for subtitles; no auto-skeletonised hanzi; no traditional forms.
- No fades, wipes or page turns; no hole plunges under 0.6 s; no accidental board edge in close shots.
- Never copy a real board layout, logo or part marking.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/circuit-board.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/circuit-board/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/circuit-board/demo/stills/styleframe.jpg (at 58.0 s)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/circuit-board.mp4 (an English build `circuit-board-en.mp4` is described but not in the release list)
### Gaps
Trace widths, pad sizes and dash lengths are not given as rules (only in world units in code); AC/DC dash speeds beyond the 0.55 Hz example not given; grain amount not given; the routed font is custom code with a limited glyph set (any new language or lowercase needs routing by hand); no vertical-frame guidance (page always draws at 1920×1080 and is scaled by CSS).

<!-- category: Cartoon & Anime -->

## 1930s Rubber Hose Cartoon
- Source: `lemomo-ai/lemo-opuscar` `styles/rubber-hose/STYLE.md`, `DEMO.md`, `style.json` (No. 26, Cartoon & Anime); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: black-and-white hand-inked early-sound-era cartoon where every object is alive, squashing and stretching to a hot jazz band, projected as a worn 35 mm print in a 4:3 gate.
- Suits: food and drink, retro ads, kids, mascot intros, jingles/slogans, chases and "a place comes alive" pieces. Real footage: no. 3D: no (one box prop is a projected 3D shape drawn in 2D). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F1EEE6` | lightest background grey (demo, warm paper ramp) |
| light | `#C8C5BC` | light grey; form-shadow band |
| mid | `#9A978F` | mid grey |
| dark-mid | `#6B6963` | furniture |
| dark | `#3B3A37` | dark grey |
| ink | `#0E0D0C` | outlines, pupils, shoes |
| character white | `#FCFBF7` | character fills only (brighter than any background) |
| walls (contrast fix) | `#8C8981` | kitchen walls |
| tiles | `#A29F97` | tile wall |
| cabinets | `#66635D`–`#7C7972` | panelled cabinets |
| subtitle plate | `rgba(12,11,10,.92)` | title-card subtitle plate |
Rule: strictly greyscale, about 6 grey steps plus a separate character white; no hue anywhere, not even in film damage. Characters own the extremes (pure white and ink); backgrounds live in the mid greys (walls ~mid grey, furniture 1–2 steps darker). Final composite `contrast(1.14)` (rule: 1.1–1.15). Pick one ramp temperature (warm paper, cool silver-nitrate, faint sepia) for the whole film.
### Typography
- Subtitles: IM Fell English SC (Google Font) ~36 px, paper white, on a small near-black plate with a white double-rule border and dot-and-ring corner ornaments (demo adds a tiny ribbon-microphone icon). Bottom at y ≈ 986 (of 1080) by default, top when the action is low. Drawn in the scene layer so it weaves and flickers with the film; pops on/off, no fades. One card may span two short voice clips; hold ≥ max(1.8 s, speech + 0.6 s).
- Titles: Shrikhand (Google Font), fat retro script, white face, heavy ink outline ~14 % of cap height, ink drop shadow down-right; letters hop in a travelling wave on the beat over a rotating sunburst.
- Sub-lines: Limelight (Google Font) caps.
- Sizes at 1920×1080. Letter spacing: not given. Emphasis: by the hopping letters and the band hit, not by colour.
### Layout
- 1920×1080 output with a 4:3 gate: 1440×1080 centred, black pillarbox, gate corners rounded r ≈ 28 px, soft inner shadow on the gate edge.
- Theatre staging: stage-wide locked eye-level proscenium; props lined up along a counter.
- Character size in follow shots ≈ 1/4–1/3 of frame height; no far-wide shots for gags or musical moments (faces must read). Crowd climaxes as a packed medium-full with a foreground row of bigger dancers.
- The destination prop enters frame before the gag lands; arcs and leaps stay inside the gate at the current zoom.
- Margins/grid: not given.
### Elements
- Anatomy kit: rubber-hose limbs = constant-width tubes ~1/20 of character height (demo 13 px on a 280 px character), one smooth bend, round caps, no elbows/knees.
- White four-finger gloves: palm + 3 fat fingers + thumb, flared cuff with a fold line, 3 stitch lines on the back; stroke all parts thick first, then fill all, so only the union is outlined.
- Pie eyes: white oval, black pupil ≈ 64 % × 74 % of the eye with a wedge cut toward upper right; blink with a body-colour eyelid and lid line.
- Mouth set: smile with cheek ticks, open grin, "O", wavy (scared), pucker, tongue-out. Shoes: big black ovals with a white toe glint. Brows defined by inner/outer end (inner = near nose) so "sad" doesn't read "angry".
- Object characters: the whole object is the body (face on the body, no human torso), a secondary feature carries mood (steam, flame, lampshade tilt, spring). Demo mug's steam states: lazy waves / bitter zigzag / straight-up alarm / wilted droop / heart.
- Box-shaped props: a real projected 3D shape seen slightly from above (elevation ≈ 0.26 rad, slight 3/4 turn), face mapped onto the front with an affine transform.
- Backgrounds: soft grey watercolour, painted once into a cached canvas at 1.25–1.5× (stays crisp in push-ins): flat wash + soft blotches (±5 %) + inner edge darkening + thin dark-grey outline + paper grain; never boil. Period motifs: patterned wallpaper (stripes with small diamonds), panelled furniture, checker floors, brick, clapboard, hanging lamp.
- Title card with rotating sunburst; end card a wavy-edged sign "The End".
- Smoke puffs scattered and growing (a row reads as thought bubbles).
### Motion
- Characters on twos (12 fps), camera on ones (24 fps).
- Tempo grid: one beat = an even whole number of frames at 24 fps (8, 10, 12, 16 or 20). Demo 144 BPM, 4/4 → 1 beat = 10 frames, 1 bar = 1.667 s, 28 bars.
- Breathing: every idle object squashes/stretches with `cos(2π·beats)`, stretch on the beat, squash on the off-beat, sampled on twos, amplitude ~5–7 %, all props in phase. Peak of joy: amplitude ×3 and the whole background painting squashes around the floor line ~2.5 %.
- Walk: one step per beat with body bob (demo bob 10 px; sad walk steps 34 px, bob 4 px, limp arms). Run: legs as a windmill (feet orbit a circle), forward lean (demo 0.24 rad), speed lines.
- Anticipation–hold–action: crouch (squash to ~0.8), hold (band stops), snap. Impacts: squash with an exponential spring-back.
- Held-frame acting: a chain of holds, each glance on an eighth note with a woodblock tick, while the camera slowly pushes in.
- Freeze on a band stop: everything freezes, background breathing included. Climax ends in a ta-da pose on the last beat, held into the iris.
- Line boil: ±1.2 px, 3 drawings cycling at 12 fps (characters only).
- Ink outline constant in screen space at any zoom (~6 px at 1080p; transform points first, then stroke).
- Camera vocabulary: stage-wide locked eye level; hard cut to a face close-up (reaction = joke); trucking pan beside a runner with eased start/stop; medium follow shot; tilt with a fall or rise; slightly high angle in one unbroken shot (hazard + answer); tabletop pan (flat characters before a model set turning in depth); pull-back from close-up to packed medium-full; iris in/out that a character can grab.
### Transitions and rhythm
- Transitions: iris, hard cut on a beat, title card rolling up like a window shade; no dissolves. A small vertical jump (demo 3 px) on every cut.
- Rhythm: 1930s hot dance band/ragtime, Mickey-moused; hard stops (silence including reverb tails) before gags and on stares (demo: 2 full beats of silence after the stretch); stinger per gag; slide whistle on every stretch/fall. Demo 50 s; one 4-bar syncopated theme restated (title, chase, solo-clarinet tender version, key-change out-chorus).
### Finish
- Film-damage composite pass (not in the scene): low-frequency gate weave ±1.2 px with a rare 3–6 px jump; flicker ±4 %; 0–3 drifting vertical scratches; 3–8 dust specks per frame; an occasional hair; strong vignette (0 → 62 % black at the corners); 0.55 px blur; contrast 1.14.
- Grain added in ffmpeg (`mux.sh` grain 3), not in the page.
- Form shadow: one hard-edged light-grey band on the side away from an upper-left light, never a gradient.
### 3D look (if any)
None; flat 2D. Only "tabletop pan" implies a model set turning in depth, and box props are projected 3D shapes drawn as flat cels.
### Banned
No colour/hue anywhere; no gradients in shading; no joints or rendered shading (not a retro filter on modern animation); not 1950s limited animation with graphic backgrounds; not a silent film; no dissolves; no far-wide shots for gags; no string pads, no modern synths; never an existing cartoon character, name, silhouette, design, melody or logo; no "cup-head on a human body with a straw" design; no period racial caricature; no flat grey frames; no subtitles flashing (merge short lines); backgrounds never boil.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/rubber-hose.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/rubber-hose/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/rubber-hose/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/rubber-hose.mp4
### Gaps
No vertical-frame version of the 4:3 gate (in 1080×1920 the gate would need rethinking); letter spacing and title sizes not given; scratch/dust sizes and opacities not given; spring-back constants for impacts not given (only "exponential"); lip-sync method not described.

## 80s Cel Anime (OVA on a CRT)
- Source: `lemomo-ai/lemo-opuscar` `styles/cel-anime-80s/STYLE.md`, `DEMO.md`, `style.json` (No. 27, Cartoon & Anime), plus `demo/pal.js` for exact colour models; licence: MIT (docs/code), demo film/stills CC BY 4.0
- One line: late-80s Japanese OVA cel animation in code: flat two-tone cels with coloured lines over airbrushed painted plates, backlit neon glowing through the frame, limited-animation timing, played back as videotape on a CRT.
- Suits: city/night journeys, deadlines and deliveries, launches, mock anime openings, slice-of-life in four lighting models, nostalgia pieces. Real footage: no. 3D: no (pseudo-3D canyon shots are 2D projection). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
Daylight colour model (`pal.js`, fill f / shadow s / highlight h / line l):
| role | hex | where used |
|---|---|---|
| skin | f `#ffd9c4` s `#e2a395` h `#fff1e8` l `#5a2e2e` | heroine skin; line is thin warm dark brown |
| blush | `#ff9a9a` | one faint blush layer, never hatched |
| hair | f `#4a3472` s `#2d1e4e` h `#8f74cc` l `#2e1850` | hair locks, dark purple line |
| lash | `#1c0f26` | lash line |
| eye (iris) | f `#5b3fb0` s `#2c1d66` h `#b69cff` l `#150a33` | layered tall oval iris |
| eye white | `#fbf8ff` | |
| mouth interior | `#9a3b4a` | |
| jacket | f `#2f6fe2` s `#1d45a2` h `#86b6ff` l `#112459` | |
| scarf (hero accent) | f `#ff6b6b` s `#cf3d5b` h `#ffb6a2` l `#761b34` | the one accent colour, readable in every lighting set |
| teal / cuff | f `#1fc4b2` s `#12857c` h `#8ff5e8` l `#0b3e3a` (cuff `#22c3b2`) | |
| magenta | f `#ff4fa8` s `#b8327a` l `#5c1238` | neon |
| gold | f `#e2b24e` s `#9a6c28` h `#fff0b0` l `#4d3210` | |
| chrome | f `#dfe7f3` s `#646f90` h `#ffffff` l `#2b3350` | |
| white (bike) | f `#f3f6fc` s `#a9b3cd` l `#39456a` | |
| dark | f `#2b2d40` s `#181a26` h `#50546e` l `#08090f` | hard props (only these near-black) |
| subtitle | `#fff0a0` | cream-yellow subtitles |
| second speaker (radio) | `#8ff4ff` | cyan subtitles with boxed "● BASE" tag |
Lighting multipliers (lit / shade / line, applied per channel RGB): day 1/1/1; night lit `[.78,.74,1.0]`, shade `[.58,.52,.92]`, line `[.8,.7,1.1]`; dawn lit `[1.04,.9,.84]`, shade `[.86,.66,.8]`, line `[1,.8,.85]`; silhouette lit `[.2,.16,.32]`; backlit lit `[.42,.3,.55]` (dark purple with orange rim). Night skin set by hand: f `#e9c9c4`, s `#9b82b4`, h `#fff2f2`, blush `#e0869a` (multiplying turned faces pink).
Rules: painted plates carry gradients and atmosphere; cels are flat, few-colour, saturated. Each time of day gets its own colour model (色指定), never a filter. Lines are dark versions of their fill, never pure black. Example plate moods: night city (indigo, violet, neon magenta, cyan, window gold); dawn (periwinkle, rose, peach, pale gold); seaside noon (cobalt, white cumulus, sand, coral); classroom dusk (amber, chalk green, brown wood, purple shadows). Plate hexes: not given in docs.
### Typography
- Subtitles: Barlow Semi Condensed 600 (Google Font), ~50–56 px (demo 54 px) at 1920×1080, cream-yellow `#fff0a0`, 9 px dark outline + soft shadow, baseline area ~96 px above the bottom; second speaker in a second colour with a small boxed tag. Composited inside the CRT pass after grading. Hold ≥ max(1.8 s, speech + 0.6 s) (demo max(duration + 0.6 s, 1.9 s)); a line yields to the next.
- Titles: heavy italic Latin in a chrome gradient (sky → white horizon line → violet → pink → gold) with dark + neon outlines; optional katakana line in Dela Gothic One (Google Font); also Kanit (Google Font) in the demo font set. Glow through the emissive layer, flicker on at 12 fps with a light sweep and a star glint, landed on a brass hit. Demo: "CITY LIGHTS" with シティ・ライツ above, a red "1987", a spaced-out tagline.
- Letter spacing: "spaced-out tagline" only; otherwise not given.
### Layout
- Full 16:9 as a theatrical feature; 4:3 pillarbox valid for an OVA feel.
- Keep the lower ~120 px clear for subtitles. Cels must read against the painted plate.
- Small flat hero in a huge painted world is a signature composition.
- Margins/grid: not given.
### Elements
- Cel shading: fill → hard shadow crescent → hard highlight crescent → coloured outline. Automatic: clip to shape and fill (shape − shape shifted toward the light) with shadow, even-odd; same shifted away for highlight and for a saturated neon rim light 2–4 px. Hand-placed cast shadows. No gradients inside a cel shape (one "harmony" painted still at a peak is the exception).
- Outlines ~2–3 px at 1080p, scaled 0.45–0.8× in extreme close-ups.
- 80s face: constructed head (sphere + jaw), long egg face, soft-point chin, far eye foreshortened with a cheekbone turn in 3/4; almond eyes at the vertical middle of the head; mouth at the upper third between nose base and chin; thick upper lash line flicking outward (2–3 separate lashes); tall oval layered iris (top dark band → dark upper half → main colour → bright lower crescent) with one large + one small highlight; long thin brows; nose = shadow plane + one stroke. Hair: overlapping locks with sharp uneven tips over a wider dark under-layer, continuous "angel ring" highlight with a zigzag lower edge. Mouth set: closed / set / talk / "oh" / pant / smile / open smile.
- Approve a model sheet first; every shot draws from the same head function (3 views × expressions).
- Backgrounds: painted once at load, always with a matching emissive plate that slides with the colour plate; wet ground = flipped, blurred, streaked copy darkened with ripple bands; generic sign words only (BAR, CAFE, 喫茶, ホテル, カラオケ), never brands; moving plates get ~16 px horizontal smear.
- FX: rain, splashes, radial speed lines, flares (star-burst, anamorphic streak, hexagonal ghosts through frame centre), lamps, light trails; HUD gauges, backlit level meters.
### Motion
- Characters on twos (12 fps); performance beats (blinks, eye openings, lip flaps, gestures) on threes (8 fps); camera, light sweeps, flares, rain on ones (24 fps).
- Cycles: hair and cloth as ribbons driven by a travelling sine, 4-drawing cycle (6 when calm); bounce = 12 fps jitter of a few px.
- Move light, not drawings: coloured bands sweeping across a held cel (`source-atop`).
- Impact frames: 2 frames of an inverted or monochrome silhouette over radial lines, then the result.
- Hold the peak: painted still with a slow pan, only cycles moving.
- Blinks: one 8 fps closed drawing (demo holds closed 2–3 frames). Eye openings: three drawings at 8 fps. Lip flaps: 3–4 mouth shapes at 8 fps, ending on a held expression.
- Peak sequence (demo): radial speed lines → one-beat freeze + white flash → impact frame → painted harmony still with slow pan → impact frame → landing with sparks and camera shake.
- Delayed tilt with quadratic climb to follow a rising object.
- Camera vocabulary: multiplane crane over a tall plate (foreground faster); side tracking with 3–4 parallax layers; rear view into a pseudo-3D canyon (clamp z to near plane); held bust with light bands; insert with bokeh and a sliding highlight; extreme close-up on eyes; slow pan across a painted still; radial speed lines + one-beat freeze; truck-in through a window/screen; locked two-shot with lip flaps; an earlier composition repainted in another light.
### Transitions and rhythm
- Cut on bars (demo 116 BPM, bar = 2.069 s). Transitions: cuts, white flashes, impact frames, tracking noise at a tape-related beat; no digital dissolves or wipes.
- One beat of true silence before a peak; semitone lift for a last chorus; diegetic tape moment band-passes the score to cassette for one bar, then opens. Demo 59 s, 1416 frames.
### Finish
- Bloom: strong from the emissive canvas, weak from the colour canvas above ~0.9 threshold; widest bloom tinted red-orange (halation). Cel silhouettes stamped black into the emissive canvas so glow never bleeds through characters. Clamp before S-curves.
- Videotape + CRT (WebGL pass, deterministic): chroma bleed (sharp luma, chroma blurred ~7 px horizontally, Cr shifted ~2 px); scanlines 3 px period, strength 0.18, gap `1 − a·ph·(1 − 0.6·L)` (gap shrinks on brights), anchored to output pixels; RGB grille ±0.06; phosphor glow 0.35; corner darkening `1 − 0.28·(2u²v² + 0.25(u²+v²))`, no curved borders; faint signal noise.
- Optional accents: power-on (dot → line → picture, with thunk + line whine), tracking noise (a few frames of tearing, rolling band, vertical hop).
- Encode: noise in the shader, only `noise=c0s=2:allf=t` in ffmpeg, CRF ≈ 23 (~31 MB/min). Moiré check on a 720p downscale.
- No gate weave, dust, scratches or misregistration (that's film, not tape).
### 3D look (if any)
None; pseudo-3D projection only for canyon/rear-view shots.
### Banned
Not moe anime (round eyes, giant irises, hatched blush); not vector clip-art (uniform black lines, gradients in shapes); no film-print artefacts (gate weave, scratches); no pure-black lines except hard props; no gradients inside cels; no digital dissolves or wipes; no colour filter as a time-of-day change; never a specific work's characters, mecha, logos, place names or signature shots; no brand names on signs; avoid front views where possible (hide behind visor, windscreen or backlight); no thick rim light on thin shapes (6–8 px turned hair pink); no hot limiter flattening the chorus.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/cel-anime-80s.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/cel-anime-80s/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/cel-anime-80s/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/cel-anime-80s.mp4
### Gaps
Painted-plate hex values not given in docs (they live in `demo/bg.js`, not read); title sizes and chrome-gradient stops not given as numbers; bloom radii/strengths not given; no vertical-frame guidance; drawing a convincing 80s face in code is the hard part and depends on the demo's `head80.js` (24 KB, not read).

## Sci-Fi Sitcom Toon
- Source: `lemomo-ai/lemo-opuscar` `styles/scifi-toon/STYLE.md`, `DEMO.md`, `style.json` (No. 28, Cartoon & Anime); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: adult-animation sci-fi sitcom; thick boiling dark outlines, flat colour with hard shadow shapes, a deadpan/panic duo, one glowing portal, and a new 3–5-colour palette for every world.
- Suits: comedic explainers, product-version comparisons, "rule of three" lists, brand skits, dialogue sketches between two characters (e.g. an AI and its user). Real footage: no. 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| line | `#1b1422` | every outline, slightly purple black; never changes between worlds |
| home lab | `#a7c3b1` | sage green walls (plus olive floor, warm wood, one orange accent: hex not given) |
| jelly world sky | `#ff4f9a` → `#ff9bcb` | magenta sky bands (flat bands, not gradients) |
| jelly | `#b8f03c` | lime jelly |
| jelly world accent | `#52e0e0` | cyan |
| mug world sky | `#ff7a2f` → `#ffb862` | orange sky bands |
| mug world hills | `#2b9c98` | teal (plus cream) |
| teeth world | `#c3122f` / `#ff8fa6` | red / gum pink (plus tooth white) |
| pigeon world | `#5f78a8` | slate blue + greys |
| clone world | `#3b1f66` / `#e8d84a` | inverted purple / yellow |
| "normal" world | `#f1e3c6` | deliberately bland beige (+ brown) |
| portal rim | `#3fd93a` | lumpy goo rim (glow colour reserved for the portal only) |
| portal arms | `#b8ff5a` / `#21b33c` | 5 alternating spiral arms |
Rules: one palette per world, 3–5 colours, maximally different from the previous world in hue and value so the jump reads from colour alone; line colour and eye white constant; the glow colour belongs to the travel device only; a bland beige/brown palette is itself the joke for a "suspiciously normal" world.
### Typography
- Subtitles: Baloo 2 ExtraBold (Google Font) ~50 px at 1920×1080, white with ~11 px black outline, bottom centre, with a small speaker pill in the character's colour (boiling outline) on the left. Lines over ~1300 px wrap to two lines. Overlapping lines stack; the older dims to ~70 %.
- Subtitle timing: narration ≥ max(1.8 s, speech + 0.6 s); rapid dialogue `max(audio + 0.35 s, 0.9 s + chars / 17)`. Clip at world changes and before a silent beat, so silence plays on a clean screen.
- World tag / screen graphics: VT323 (Google Font) retro-terminal tag, top-left, typed in, coloured per world.
- Title: chunky display lettering popped in on 12 fps steps on a musical hit; demo uses Bungee (Google Font) in cream with a hard magenta offset shadow and thick ink outline, wrapped by a tilted cyan orbit ring (1950s atomic-age TV look). Avoid acid green + slime drips + wobbly bubble lettering together (reads as a specific show).
- Letter spacing and case: not given.
### Layout
- Keep faces out of the subtitle band (bottom ~170 px at 1080p); keep the world tag clear of faces.
- Montage rule: same framing in every world (demo: duo left, creature right) so only the world changes.
- Silhouettes must read in solid black; anything behind furniture must still show face and upper body.
- Margins/grid: not given.
### Elements
- Line ~7 px for characters and props, 4–6 px for background detail, round joins; constant in screen space (transform points to screen, stroke with identity transform; close-ups are "redrawn" at the same weight).
- Fill: flat only; shadows are hard-edged darker shapes clipped inside the fill (one per form, away from the light); glows are 1–2 flat translucent rings; skies are flat colour bands.
- Faces: big white eyes touching in 3/4 view, 4–5 px pupils, heavy lids for deadpan, eye bags; parametric mouths (open, width, curl, skew) with interior, teeth, tongue; brows carry emotion. Noodle limbs, parametric hands.
- Cast: each lead gets one absurd costume idea (demo: bathrobe + fuzzy slippers + goggles; bike helmet + giant round glasses). Never white lab coat + spiky hair.
- Creatures: one per world, disgusting and adorable, non-verbal (SFX only).
- The portal: vertical oval (x-scale ~0.74), lumpy rim with 7–8 px outline, 5 rotating spiral arms (on ones), pale core, orbiting sparks, drips off the bottom, flat translucent wash over the scene while open.
- Food/liquids need cues (surface detail, drips, steam): a plain brown blob read as a potato.
### Motion
- Characters on twos (12 fps): poses, mouths, blinks, walk cycles and boil. Camera moves, portal swirl, flying props and wipes on ones (24 fps).
- Line boil: resample every outline in screen space at ~7 px steps, displace along the normal with low-frequency noise, amplitude ~1.7 px; 3 boil drawings cycling at 12 fps. Everything boils, including holds and backgrounds.
- Acting over moving: held poses with small changes (eye twitch, sliding pupils, gulp, sweat drops). Idle breathing ±1 % squash; a nod driven by speech loudness.
- Anticipation → action before every gesture.
- Squash & stretch: landings get a decaying cosine squash ~22 %; stretch while flying out of a portal; "sucked in" = scale toward the portal centre while stretching.
- Portal open: gentle overshoot ~12 %, back-ease ~0.3 s (demo 0.32 s). A springy overshoot (demo spring hit ~135 %) swallows the actors.
- Lip-sync from audio: per line, RMS (mouth open) and spectral centroid (wide vs round) at 24 Hz, sampled at the 12 fps drawing time; screams exaggerated ×1.5–1.9.
- Nervous jitter: 12 fps random offset of 3–6 px plus trembling pupils, growing with panic.
- In a cold pause nothing moves but the boil.
- Camera vocabulary: medium two-shot; hard cut to a close-up on an interruption; insert extreme close-up of the absurd object; reaction close-up after every absurd image; tight close-up + short shake on one word; rush zoom into the portal → swirl wipe; same framing repeated across worlds; very slow push-in on a still two-shot (cold silence); wide with device and both leads; over-the-shoulder onto a screen; whip pan between two faces.
### Transitions and rhythm
- Transitions: swirl wipes through the travel device, or hard cuts; no dissolves.
- Rhythm: demo 120 BPM so cuts snap to half-second beats; each world's cue starts with its first beat on the cut. Rule of three → machine-gun: two slow wrong answers (6–8 s each), then 1 s worlds cut on the beat with the same rejection word.
- Silence is the punchline: hard-cut music including reverb tails on a reveal and for a cold pause (demo 2+ s after the reversal), leaving only room tone (fluorescent hum, clock tick). Demo 57.5 s, 1380 frames; beat sheet: cold open 8–12 s, portal + title slam 2–3 s, jump 1 6–8 s, jump 2 6–8 s, montage 3 × 1 s, break 4–5 s, home 12–16 s, end card 4–5 s.
### Finish
Clean flat TV-animation finish; no gradients, no film grain or post effects mentioned. The only glow is the portal (flat translucent rings/wash). Grain/finish values: not given.
### 3D look (if any)
None.
### Banned
Never reproduce an existing show's characters, silhouettes or colour combos (e.g. spiky-blue-haired old man in a lab coat + kid in a yellow shirt), names, catchphrases, burp gags, logos or portal-gun look; never name the source show; no gradients; no sparkly anime eyes; not a kids' cartoon; not a non-boiling vector explainer; no glow colour on anything but the portal; no springy overshoot on the portal; no acid green + slime drips + bubble lettering title; no dissolves; no sustained bass below ~40 Hz; no square-wave synth cymbals (alias fizz).
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/scifi-toon.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/scifi-toon/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/scifi-toon/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/scifi-toon.mp4
### Gaps
Home-lab olive/wood/orange hexes not given; title size not given; no vertical-frame guidance; the shake amplitude for the panic close-up not given; character proportions beyond eyes/pupils not given.

## Mid-century Cartoon (1950s how-to card)
- Source: `lemomo-ai/lemo-opuscar` `styles/midcentury-toon/STYLE.md`, `DEMO.md`, `style.json` (No. 48, Cartoon & Anime); licence: MIT (docs/code), demo film/stills CC BY 4.0
- One line: 1950s UPA-style flat colour and limited animation for "follow along" films; fills printed a few px off a broken breathing ink line, a held presenter whose hands do the step, colour-block rooms, numbered medallions, cool jazz.
- Suits: a **scene style** for practical jobs: product set-up guides, safety/rules cards, recipe cards, app onboarding, store/event notices (20–45 s). Real footage: no. 3D: no. AI images: no. Content-driven: all words, numbers and colours come from `demo/content.json`.
- Catalog rating: completeness **full** · distinctness high · specification high (best-specified of this group: palette, sizes, timings and a content schema)
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F4EAD5` (shades `#E6D8BC`, `#D4C29F`) | ground, caption cards, drop shadows |
| ink (warm black) | `#2B2420` | all lines and slab lettering |
| coral accent | `#E4613F` / dark `#B8452B` | presenter's sweater, caption stars |
| mustard | `#E8B43A` / light `#F3D37F` | hook ground, belts, dots |
| turquoise (the product) | `#3FA7A0` / dark `#257A74` | the product keeps this one colour all film |
| step grounds | `#7F9CC0` dusty blue · `#A7AE5B` avocado · `#F0B4A8` pink · `#6E4A6B` plum | one ground colour per scene |
| navy / hair / skin | `#3B4766` / `#3A2621` / `#F2C7A0` | presenter |
| kraft (box) | `#C9955D` / `#A2713F` / `#DDB47F` | packaging |
Rules: warm paper ground, warm near-black ink, soft atomic-age complements; nothing pure or neon. One ground per scene: walls = `tint(col, .45)`, floors = `shade(col, .16)`. Never put the product on its own colour or the presenter on their own accent. Product colour fixed; accent a different hue; step grounds rotate through the rest. Example sets: coral/mustard/turquoise on cream; tomato/olive/powder blue on oatmeal; plum/lime/sand on off-white.
### Typography
- Kicker: Oleo Script Bold (Google Font), 1950s script, writes on left→right with a clip (demo "Meet Pip.").
- Titles, numerals, step headers: Alfa Slab One (Google Font), ink over an off-register cream or colour plate offset 4–7 px; step title 64 px (shrinks to 40 px in the header for long titles); lockup title shrinks to 50 px.
- Body, details, labels, captions: Jost 500/600 (Google Font); letter-spaced caps for small labels ("STEP n OF N"); caption card text Jost 500 42 px; detail tags Jost 36 px.
- Sizes at 1920×1080. Words on screen: one clause per narration line; title ≤ 36 chars, subtitle ≤ 24, step title ≤ 22, step detail ≤ 30, payoff caption ≤ 40, CTA ≤ 48 (shrinks to 20 px).
- Caption card: paper-coloured rounded slab with thin ink border (its colour cel offset 5 px too), small turning coral 8-point stars at the ends, bottom-centre, 60 px above the bottom; fades in 0.16 s with a 10 px rise. Hold ≥ max(1.8 s, speech + 0.6 s, chars/12 + 1 s).
- Emphasis: the numbered medallion and data landing on the picture on the action beat ("Data lands on the picture, never as a slide").
### Layout
- Rooms are not drawn: one colour plane, a floor band, a horizon line with gaps, one or two props (wall edge, socket, phone).
- Key subjects ≥ 1/3 frame height and out of the bottom ~140 px (caption band).
- Round detail call-out (frame-in-frame with a dashed leader line) is the close-up, drawn at native scale so line weight stays constant; context stays visible in the wide.
- Lockup: the steps as a row of medallions (radius 104 px, 88 px beyond 3 steps), held dead still ≥ 3 s (the "screenshot" frame).
- Labels under the plan, captions in the top margin when a plan fills the frame.
- Timeline from content at 132 BPM: hook 4 bars, each step ≥ 3 bars (5.45 s), last step 2, payoff 3, tip 2, lockup 3, end 2 → 3 steps = 22 bars = 40.0 s.
### Elements
- Off-register cels: every fill offset from its line (demo `REG = {dx:6, dy:4, jit:1.6}` px, down-right), re-rolled ±1.6 px at 12 fps; on everything including text; off only for crisp diagrams.
- Line: 3–5 px ink ribbons with ±40 % width breathing and 12–25 % breaks; characters 4 px, props 3–4.5 px, walls in plans 6–7 px broken; hands one 6 px outline around the union of palm and fingers, 2.4 px finger separations, slender fingers (rx 12–13, ry 5).
- Shading: one flat darker plane clipped inside a shape, never a gradient. Drop shadow: shape copy offset (12, 12) in a paper shade at 50 %.
- Ornaments: 4-point atomic sparkles, 8–18-point starbursts, sunburst rays (30 wedges at 55 % alpha), boomerang and kidney shapes, polka dots.
- Characters: geometric egg/bean heads with the nose part of the face outline (one open spline from bridge round the skull, closed at the nose tip); simple 2–3-colour garments; four-finger gloves in four shapes (open, flat, point, grip); shoulders at torso corners, sleeves as a thick ink ribbon with a colour ribbon on top. Presenter body is a held drawing; only arms, hands, eyes, mouth animate.
- Step header: ink disc with a paper numeral + letter-spaced "STEP n OF N" + step title on a cream plate.
- Detail tags: paper card with a star bullet popping on the action beat beside the call-out. Manual arrows (draw-on, bob on the beat, dashed shafts), dimension arrows, signal rings, hold ring, 18-icon set (dock, phone, start, cable, wifi, plug, water, beans, cup, filter, box, clock, check, leaf, key, bulb, spark, gear).
- Payoff: a real process (e.g. a vacuum route: wall-follow then boustrophedon lanes as potential-flow streamlines bending around furniture + 30 px, a small curl at each turn, stars and dots between lanes) drawn region by region, reading as an atomic-age textile when seen whole.
### Motion
- On twos (12 fps): poses, hand shapes, cel jitter. On ones (24 fps): camera, iris wipes, arrows, plan routes, rays.
- Held body, moving hands: pose switches with a single in-between. Hand action = anticipation (pull back/lift 20–60 px) → fast action 0.15–0.25 s eased out → follow-through (recoil 6–10 px, settle, lift away), landing exactly on a beat. One hand action per step.
- Pop-ins (medallions, tags, labels, titles): scale in with back-ease ~0.25 s (demo 0.24–0.3 s, overshoot 1.9).
- Floor reach: kneel pose (hips drop 150 units) with 2-bone IK keeping hands on the object; never stretch standing arms (hands stop ~190 units under the shoulder).
- Lettering: script writes on left→right with a clip; headers slide in on twos.
- Camera = "the stand", never handheld: slow push (demo 1.00 → 1.07); iris through the medallion (circle grows from the stamp to full frame in 0.9 beat); round call-out with leader line; tilt with a pointing finger; push into a device then pan along signal rings; iris from a round object into a top view; signature pull-back with counter-rotation (5.4× → 1.0×, −6° → 0°) from detail to plan; colour-block wipe (side, bottom-up); dead still ≥ 3 s; iris-out onto one object.
### Transitions and rhythm
- Transitions: circles (medallion iris, button iris, iris-out), colour-block wipes, cuts on a beat; no dissolves. J/L cuts: each step's line starts half a beat before its iris.
- Rhythm: demo 132 BPM cool jazz; every step lands on its own vibraphone chord (F6, B♭maj7, C9), recalled one per medallion in the lockup; double-time + up a whole step for the payoff, half-time for the tip; hits checked against the half-beat grid (0 off). Three planned silences: before the first sound, everything off (ambience too) on the beat before the key press, room tone only before the lockup.
### Finish
- Light dry-brush tooth, paper grain overlay, warm vignette; grain light (mux grain 4): print, not film.
### 3D look (if any)
None.
### Banned
Not 1930s rubber-hose (no black-and-white, no bouncing world, no hot jazz); not a whiteboard explainer (shows how, not why; pictures are printed, not written on); nothing pure or neon; no gradients; no handheld camera; no dissolves; no data as a slide; no product on its own colour, no presenter on their own accent; no stretched standing arms; no separate nose wedge; no fat-blob fingers; no zoomed-world close-ups (triples the ink); routes that ignore obstacles or get laid all at once; no ragtime, spy big band, or piano-and-strings; never copy UPA/Coronet/Harper/Blair characters, drawings, lettering or music, never name them.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/midcentury-toon.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/midcentury-toon/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/midcentury-toon/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/midcentury-toon/demo/stills/modelsheet_v2.jpg (presenter turnaround, expressions, hands, product states)
- Content-swap stills: `…/demo/stills/alt_1_hook.jpg`, `alt_2_step.jpg`, `alt_3_payoff.jpg`, `alt_4_lockup.jpg`
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/midcentury-toon.mp4
### Gaps
No vertical-frame layout (plan coordinates are 1920×1080); vignette strength not given; tooth/grain amounts only as 0–1 parameters; lip-sync method for the presenter not described.

<!-- category: Games -->

## 16-bit Pixel RPG
- Source: `lemomo-ai/lemo-opuscar` `styles/pixel-rpg/STYLE.md`, `DEMO.md`, `style.json` (No. 29, Games); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a short film that looks, sounds and behaves like a mid-90s console RPG: 320×180 indexed pixels, dialog boxes that type, menus, save files, chip music with echo; the game's systems used straight as a language for feeling.
- Suits: game trailers, recaps, nostalgia, "levelling up" stories (careers, product versions, a town's history told in eras). Real footage: no. 3D: no (a few props may be flat-shaded 3D quantised to the palette). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| master palette (ENDESGA-32, free) | `#be4a2f #d77643 #ead4aa #e4a672 #b86f50 #733e39 #3e2731 #a22633 #e43b44 #f77622 #feae34 #fee761 #63c74d #3e8948 #265c42 #193c3e #124e89 #0099db #2ce8f5 #ffffff #c0cbdc #8b9bb4 #5a6988 #3a4466 #262b44 #181425 #ff0044 #68386c #b55088 #f6757a #e8b796 #c28569` | 16-bit era, identity LUT |
| protected scarf red | `#e43b44` / `#a22633` / `#f6757a` | duplicated indices no palette effect touches; the thread through the film |
| protected crystal cyan | `#2ce8f5` / `#0099db` / `#ffffff` / `#124e89` | save crystal |
| 8-bit set (15) | `#000000 #fcfcfc #a4a4b8 #58587c #1c2c8c #3c7cfc #94e0fc #b8141c #fc7454 #fcb81c #8c4c1c #2c9c2c #fcd8a8 #0c4c18 #4c2410` | 8-bit era, nearest-colour LUT (must include dark green and dark brown) |
| 4-colour set | `#1f2a1c #4b5e3a #93a263 #d6dba6` | oldest era; luminance thresholds <60, <115, <175; drawn natively at 160×90 and doubled |
| faded set | `#0e0d17 … #c3c9d6` (7 blue-greys) | the "present after a loss"; `lum^0.8 × 7` |
| collapse steps | 16- and 8-colour subsets that keep orange, pink, plum; then 4 grey-blues, 2 tones, faded | palette collapse one level per beat |
Rules: palette = feeling; change the whole palette by lookup table in one frame, never by alpha; colour depth can stand for time (older = fewer colours, lower resolution); one or two protected colours only; map by luminance, never by rank.
### Typography
- An **original** variable-width pixel font drawn in the framebuffer (cap 7 px, x-height 5, descender 2 at 320×180 native), white with a 1-px night shadow. Not a Google Font; the style forbids existing game fonts.
- Titles: the pixel font at 2×, 8-neighbour ink outline, row-by-row white→silver→steel gradient, Bayer-dissolved in and out.
- Case: not specified; UI prompts in caps (`▶ CONTINUE`, `NEW FILE`, `PRESS START`).
- Emphasis: game UI itself (a greyed-out party name = a death; item descriptions; stat screens; level-up fanfare).
- Subtitles = the dialog box (see Elements); types with the voice at ~38–40 chars/s (30 for 8-bit era), ▼ blinks at 3 Hz when done; hold ≥ max(1.8 s, speech + 0.6 s); the next box cuts the previous one; `.srt` exported from the same subtitle array.
### Layout
- Native 320×180, scaled ×6 nearest-neighbour to 1920×1080; everything, text included, in the framebuffer. 4-colour scenes at 160×90, doubled.
- Dialog box occupies the bottom quarter (y 134–176 native); floor line at y 128 so standing characters stay above it.
- Battle and system messages in a thin top window. Menus: UI on the left third, hero and prop visible on the right.
- Battle layout: enemy left, party right facing left, UI window below, message window on top.
- Hero small in journeys (1/6 of frame height).
### Elements
- Dialog box: three-layer rounded border (ink / white / silver), blue→navy→night dithered fill, 32×32 portrait on the left (3/4 view, base face + eye/brow and mouth overlays: neutral, wistful, smile, sad, resolve). Skins follow era: 4-colour light box with dark text; 8-bit black box with white frame; 16-bit blue.
- Menus, file list (save slots as memories), status/HP bars, battle messages, item fanfares, hand cursor.
- Sprites ~20–34 px tall (demo 22×34) from a rig: capsule limbs, 3-tone shading from upper-left light, per-part inner line in the darkest tone of the material, global 1-px ink outline, hand-placed ASCII heads. Lower eras drop the highlight tone. A silhouette mark for the hero (demo: long scarf with 3-frame stepped tail cycle + cowlick).
- Props: flat-shaded 3D shapes quantised to protected indices (save crystal octahedron, 8 frames per 90°, dithered halo).
- Light = index stepping via `LIGHT[]`/`DARK[]` tables; glows are Bayer-thresholded rings; firelight in low eras is a warm remap (greens → browns → rust).
- Dither: 4×4 Bayer for gradients and glows; light shafts = flat 50 % checker with 25 % edge.
- Parallax (side-scroller): far wall 0.35×, colonnade 0.7×, floor 1×, black foreground pillars 1.6×.
### Motion
- Output 24 fps. Sprites step at 8 fps (walk) to 12 fps (flames, blinks, KO blink); camera and parallax move on ones at integer pixels (each layer rounds its own offset). Walk speed 30 px/s ≈ 1.25 px/frame.
- Game-native acting: hop forward to act, cast pose (raised staff), knockback recoil, kneel, KO blink (12 fps on/off) then vanish; breath = shoulders up 1 px for 0.6 s.
- UI: windows slide in over 0.3 s, ease-out, integer px; hand cursor bobs 1 px at 4 fps and stops when the character hesitates.
- Camera vocabulary: side-scroll with parallax (journey), locked frame with UI on one third (a choice), battle side view (conflict as a system), top-down overworld pan (the whole world), integer-pixel tilt up something tall (awe; demo: a three-screen-tall door), hold while the palette changes (loss without motion), back view at a threshold (resolve), zoom by mosaic into a thumbnail (entering a memory).
### Transitions and rhythm
- Thumbnail expand + mosaic: block 10 → 1 over 0.75 s.
- Mosaic cross: 1 → 16 → 1 over 0.8 s, palette switched at the peak.
- Encounter swirl: polar twist growing with `s^1.6` + mosaic + Bayer dissolve to white, 0.8 s.
- Screen shake 3–2–1 px over 8 frames; white flash on the climax; palette step fades in 4 levels. Never alpha fades.
- Palette collapse: colour depth drops one level per beat; music loses one layer per step, ending in one beat of silence when the image reaches the faded grey. Colour floods back through an ordered-dither wave on the bar the full band returns.
- Demo 54.5 s (1308 frames at 24 fps); BPM in `timeline.json` (not stated in the doc).
### Finish
None: no scanlines, no grain, no bloom, no depth of field (mux grain 0). Hard nearest-neighbour pixels only.
### 3D look (if any)
Only small props: flat-shaded 3D geometry rotated and quantised to a few protected indices, stepped at 8 frames per 90°.
### Banned
Not HD-2D (no depth of field, bloom or real-time light); not CRT nostalgia (no scanlines, no grain); not a parody; never existing game names, characters, UI frames, fonts, logos, melodies or sound effects; no alpha fades or blended gradients (dither only); no rank-based palette mapping; no post-quantising a full-colour scene to 4 shades (draw low eras natively); no generic brightening near fire; no smooth-dome hair (reads as a helmet), no single-pixel alternating hair, no pale clothing that reads as skin, no dark plank door (reads as a jail); more than one or two protected colours.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/pixel-rpg.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/pixel-rpg/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/pixel-rpg/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/pixel-rpg.mp4
### Gaps
No vertical layout (320×180 is 16:9; a 1080×1920 version would need e.g. 180×320 native and a rethought dialog box); BPM/key not in the docs; font glyph design not described beyond metrics; no word-count limit per box.

## HD-2D Lit Diorama (library name "HD-2D")
- Source: `lemomo-ai/lemo-opuscar` `styles/hd-2d/STYLE.md`, `DEMO.md`, `style.json` (No. 31, Games); licence: MIT (docs), demo film/stills CC BY 4.0. "HD-2D" is Square Enix's term and trademark: the source says never use it as a title or brand in a film, so a catalog name should differ. The demo's music (Scott Buckley, *Precipice*) is CC BY 4.0 third-party.
- One line: flat, stepped pixel sprites standing like paper cut-outs inside a lit, fogged 3D tabletop diorama, seen from high 3/4 through a tilt-shift band, with heavy bloom and vignette; light is the subject.
- Suits: game trailers, fantasy, storybook films, "one place as a map" explainers (a town, a network lighting up). Real footage: no. 3D: yes (three.js boxes/cylinders/billboards with real point lights and shadows; Blender could do the same). AI images: no (all textures procedural pixels).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| sky (top → mid → horizon) | `#050818` → `#101d3e` → `#2c4262` | night sky dome (demo) |
| fog, harbour | `#16223a` | per-set fog colour |
| fog, forest | `#152a48` | |
| fog, storm | `#1c2334` | |
| moon light | `#8fa8e0` | dim shadow-casting key |
| hemisphere fill | `#3a4c7a` / `#0a0a12` | sky / ground |
| fire and windows | `#ff9d4a`, `#ffae55`, `#ff8c3a` | practicals |
| lantern | `#ffb050` | carried light |
| lighthouse | `#fff0c8` | landmark light |
| cool character fill | `#9fb2e8` (also `#8fa6e0`) | front fill ~2 m before the hero |
| hero cloak ramp | `#2e0b14 … #c9503f` (crimson) | the one saturated costume colour |
| scarf gold | `#b08424` | |
| keeper coat ramp | `#10131f … #5a6c98` (navy) | NPC |
| ink | `#1a1016` | darkest value (warm, never pure black); selout darkens toward `#160e1e` |
| UI gold | `#d8c28e`, `#e2c989`, `#c9a863` | chapter label, borders, caret |
| UI parchment | `#f3ead6`, `#f6f0e2` | subtitle and dialogue text |
| title gradient | `#fff3cf` → `#e2c27c` → `#a8803e` | title card |
| chapter card background | `#11172a` → `#020308` (radial) | |
| dialogue plate | `rgba(14,18,34,.86)` → `rgba(6,8,18,.9)`; border `rgba(214,190,130,.9)` | |
Rules: two temperatures (large cold/pale ambient key vs small warm practicals that carry the story); each set owns one fog colour and one light key; the hero wears the one saturated colour no set uses; UI = one metal + one paper white over a dark translucent plate.
### Typography
- Cinzel (Google Font) 500/700: chapter labels and title; wide tracking.
- Cormorant Garamond italic 500 (Google Font): narration subtitles, tagline. Cormorant 500/600 (Google Font): dialogue text, name plate.
- Sizes at 1920×1080: narration subtitle 50 px (range 46–54) centred at y = H − 88 on a soft dark gradient band (max .38 alpha), 10 px drop shadow; dialogue body 44 px; name plate 34 px; chapter label `CHAPTER  I` 34 px with 10 px tracking; chapter name 78 px italic with warm glow; title 118 px Cinzel 700, 14 px tracking; tagline 50 px italic; credits 24 px at 75 % alpha.
- Case: titles and chapter labels in capitals; subtitles sentence case.
- Emphasis: glow and gold gradient on titles; otherwise none.
- Subtitles: one line per voice clip, fade in 0.35 s before the voice, out 0.45–0.8 s after; hold ≥ max(1.8 s, speech + 0.6 s). On-screen speech uses a dialogue box instead, typed over ~90 % (demo 92 %) of the voice.
### Layout
- Characters ~1/12–1/8 of frame height; the sharp tilt band follows the subject's projected height, clamped .2–.8 of screen; fixed band height per shot (demo 34 %, 36 %) when there is no character.
- Dialogue box 1180×210 px, bottom-centred; subtitles low-centre; chapter card full-screen.
- Always look down on the world, never at eye level. Density: one location per chapter, 6 shots in a 76.5 s film.
### Elements
- Dialogue box: navy gradient plate, 2 px gold border + inner 1 px line, gold diamond corners, name plate overlapping the top-left edge, blinking gold ▼ caret, slides up 14 px on entry, soft chime.
- Chapter card with gold ornament line and diamond; one pixel ember drifting across. Title card with screen dimmed 50 %.
- Pixel textures at constant density (24 px/m), `NearestFilter`, world-space UVs; colour from 3–6 swatch ramps through a narrow 4×4 Bayer dither (band .22 on sprites, .45 on textures); 1 px selout outline on sprites.
- Characters 34×50 px frames at 1/30 m per pixel (~1.67 m tall; range ~30–60 px). Boxes and cylinders for buildings; instanced billboards for foliage and distant props; emissive pixel window panes (emissive 2.2); fire as a 6-frame pixel atlas at 10 fps; water shader with quantised ripples and light columns toward camera; additive glow sprite on every light.
### Motion
- Sprites step, everything else glides: walk 4 frames at 6–10 fps (demo 9), idles alternate two frames at ~1–2 Hz (demo 1.4), blinks every few seconds, pose changes are instant cuts between drawings. Camera, lights, particles, beams and focus update every output frame (demo 60 fps).
- Lights breathe: flicker = three summed sines, about ±20 %; one `lit` level (0–1) drives sprite flame size, point light (intensity ∝ lit^1.3), glow opacity and scale.
- Lightning flash curve: 150 ms strike, dip, 60 ms re-strike, exponential decay, boosting sky, fill and exposure together; thunder 0.25 s after each flash. Ignition exposure burst `exp(-(t-53.5)/.22)`.
- Lights popping on at a steady cadence (demo ships' lamps one every 0.7 s).
- Camera: every path a monotone cubic spline of 2–7 keys, no overshoot; focus distance recomputed every frame to the subject. Demo values: establishing fov 36, very high and far, slow push (aperture 520, focus 44 m); dialogue ~5 m up, 8–10 m away, fov 30, aperture 300; lateral tracking 6.3 m up, fov 30, aperture 380, foreground ferns blurred; dive low to ~2.2 m up, 6 m away (aperture 140–170); rising pull-back fov 30 → 40, aperture 150 → 320. Vocabulary also: orbit half-way round, top-down overhead with the band as a strip, rack focus in a locked frame, return to an earlier framing changed.
- The set never moves; the world never shakes except for impact.
### Transitions and rhythm
- Short fades to black or cuts between sets; no wipes, no 3D spins.
- Music: one piece whose arc fits the story, cut inside it at downbeats (demo: a key-change downbeat placed on the ignition frame, error < 5 ms); a 0.8 s breath when something fails; a hard stop into a reverb tail when the light nearly dies. Shots ~10–14 s each in the demo (6 shots / 76.5 s).
### Finish
- Post chain at render time: 2× supersample (3840×2160 internal) + MSAA → physical DOF (CoC = aper × (1/focus − 1/z) px, 96-tap spiral gather, far never bleeds over sharp near) with tilt-shift folded into the same signed CoC → UnrealBloom strength .55, radius .75, threshold .85 → vignette/grade amt .62, warm .1, contrast .2, saturation 1.05 → ACES filmic, exposure 1.15.
- Tilt-shift cut: tiltAmt 17, band half-width .075, feather .3 (fractions of screen height), maxCoc ≥ 24, saturation ×1.16, contrast .28.
- No film grain (mux grain 0).
### 3D look (if any)
Yes: a miniature set of boxes and cylinders wrapped in pixel textures; billboarded 2D sprites that receive light and cast cut-out shadows; light rig per set = one dim shadow-casting key (DirectionalLight 1.1–1.2, 2048 shadow map), hemisphere fill, practical point lights with shadows (windows 8, street lamps 12–14, brazier 16, lantern 2.6–14), a cool front fill (1.2–1.8, range 6–8 m) ~2 m in front of the hero; PCF soft shadows; perspective camera fov 30–42. Exponential fog per set.
### Banned
Not voxel (no cubic characters); not flat 2D pixel RPG; not a photo of a real miniature (textures are pixels, not materials); never eye-level camera; no wipes or 3D spins; no overshoot on camera; no pure-black darks; no film grain; tilt as a separate blur pass (breaks occlusion); wide dither bands (checkerboard); light sitting on the sprite plane (move it ~0.45 m toward camera, cap sprite lighting); skipping the front fill; never use the reference games' characters, places, logos, UI ornaments or music, never name them, never use "HD-2D" as a title.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/hd-2d.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/hd-2d/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/hd-2d/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/hd-2d.mp4 (tilt-shift cut, 1920×1080, 60 fps)
### Gaps
No vertical framing guidance (tilt band and dialogue box are sized for 16:9); daytime palette only described in words; no exact sprite-art rules for faces; music relies on a licensed track (no score recipe).

## Microgame Frenzy
- Source: `lemomo-ai/lemo-opuscar` `styles/microgame/STYLE.md`, `DEMO.md`, `style.json` (No. 32, Games); licence: MIT (docs), demo film/stills CC BY 4.0
- One line: a rapid-fire party-game film; one shouted command word, 2.5–4 s, one action, one result, each microgame drawn in a completely different medium, the whole film accelerating between returns to one fixed toon game-show stage.
- Suits: game trailers, onboarding, social shorts, "steps of a process" told as challenges (a product launch as UNBOX!/PLUG IN!/SHIP IT!). Short films only (demo 59.8 s). Real footage: no. 3D: no. AI images: no. Note: it is a meta-style that needs several other medium mini-engines (crayon, ink, ASCII, riso, pixel, blueprint, Swiss).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| outline / ink | `#1a1030` | 7 px home-stage outline (near-black violet) |
| stage violet | `#2a0f5c` / `#3d168f` | ground and rotating sunburst |
| magenta | `#ff2e88` | loud accent; command-word drop |
| gold | `#ffc928` / `#e08a00` | accent; command burst, TV frame, subtitle cards |
| cyan | `#1fd1d1` | accent |
| success green | `#3bdc5a` | ✓ stamp and lives board only |
| fail red | `#ff3b3b` | ✗ stamp and lives board only |
| Swiss medium signal | `#e30613` | inside the Swiss microgame only |
| ASCII medium | amber phosphor (hex not given) | terminal microgame |
Rules: the home stage owns a saturated party palette (deep ground + rotating sunburst + 2–3 loud accents + fixed success/fail colours); each medium brings its own traditional palette and is never tinted with the home palette; one accent follows the hero across media (vermilion dot in ink, inverse `@` in ASCII, red circle in Swiss). Other example home palettes: teal ground with coral and lemon; black stage with hot orange and electric blue (no hex).
### Typography
- Command word = the subtitle: Titan One (Google Font), white, 22 px ink outline, magenta drop, gold burst behind, skewed −6° (at 1920×1080). Listed in the .srt only, never burned twice.
- Other lines: a gold rounded card with 7 px ink outline and hard shadow, Lilita One (Google Font) 50 px, small speaker icon (stopwatch for host, helmet for hero), placed above the timer; pops in over 2 steps at 12 fps; hold ≥ max(1.8 s, speech + 0.6 s), never during a big banner.
- Inside a game all text uses that medium's own typography (e.g. Inter (Google Font) in the Swiss game).
- Title card: a marquee with chasing bulbs lighting letter by letter, all caps.
- Case: commands in caps with `!` (PUMP!, DON'T SNEEZE!, ZIP!, SPEED UP!, BOSS STAGE!).
### Layout
- Home stage: locked frontal, symmetrical frame; a frame-within-the-frame where games play (demo: central 16:9 gold TV, screen 768×432 = 1/2.5 of the 1920×1080 frame; STYLE.md says ~40 % of frame width); lives board of icons; stage-number badge; trigger prop (podium with big red button).
- Command word slams centrally, then shrinks into a corner tag before the first action so the result is never covered.
- Fuse timer along the bottom of the game.
- Mixed-media frames: one focal chain only (A leads to B leads to C); info panels pushed into a corner.
### Elements
- Home toon look: thick ~7 px outline, flat fills, one hard-edged shadow (fill shape in shade colour, clip to shape, refill shifted up-left by 9 px).
- Fuse timer: braided rope with one knot per beat; the spark passes each knot exactly on the beat, ends at a firecracker; freezes during replays.
- ✓ / ✗ stamps slapped onto the TV screen; lives board (3 → 2 → 1 blinking); slot-machine reels; flip tiles; chasing-bulb marquee.
- Characters: host = stopwatch head (dial face, red second hand as pointer and nose, ticks every beat); hero 2.3 heads tall with three silhouette marks that survive every medium (round helmet, antenna ball, "05"). Model sheet of the hero in every medium before animating.
- Medium recipes (100–200 lines each): crayon = RGB colour + A pressure, wax only where paper tooth > 1 − 1.22·pressure, 8 fps with line boil on 12; ink = R wet / G dry channels, bristle strokes, vermilion dot; ASCII = hand-authored glyph art, amber phosphor shader with bloom, 3 px scanlines, barrel curvature; riso = R/G/B plate densities, additive overprint, 7 px rotated halftone, fixed misregistration per shot, plate kick on the key action; pixel = 240×135 indexed buffer ×8, auto 1 px outline, Bayer dither, 12 fps; blueprint = blue paper, white lines in 4 weights, dimension lines, one red stamp; Swiss = 12-column grid, Inter, black/white + `#e30613`.
### Motion
- Speed ladder (demo): 120 → 140 → 160 BPM; game length 2 bars (4.0 s) → 1.5 bars (2.57 s); stage dwell 1 bar → 2 beats; command hold 0.75 s → 0.64 s; character stepping 8 fps → 12 fps → 24 fps (boss). Five things accelerate together at each speed-up. Camera, transitions and the fuse spark always on ones.
- Command-word slam: over 3 frames, scale 1.9 → 0.92 → 1.0 (overshoot → settle), hold, shrink to corner tag. One-off banners fly out instead.
- Transition into a game: camera push into the TV screen, 0.25 s. Return: whole frame shrinks back into the TV, 0.33 s, with stamp. No fades, no blank frames.
- Instant replay: freeze 3 frames, play at 0.5× with a 1.4× push-in, black letterbox bars, caption in the medium's type; costs 2 beats; record scratch + half-time in the music.
- Failure is performed: the action overshoots and hits something (demo salute arm rotates past 90° and grows past its module), splats, bonks, rolls off.
- Host ticks every beat; stopping dead is the strongest emotional tool. Last life: lights cut to one top spot.
- Camera vocabulary: start inside a game (command already slamming), pull back out of the screen (scale reveal), locked home frame, slot reels (three strips of earlier frames with motion smear, stopping one per beat on SPEED | UP | !), extreme insert on the trigger (glove smashes the button on the beat), tile flip (8 tiles flip in on eighth notes, then become pieces of the boss frame), push into a detail and hold, snap back to wide on one beat, split screen of two media.
- Ink parachute build (climax): jet 0.15 s, round drop 0.3 s, then 9 gores fan out (vertical gradient, ±7 % alternating tone, paper-white seams, scalloped hem).
### Transitions and rhythm
- Only the TV push / shrink, slot reels, tile flips, snap-to-wide; never fades.
- Music first: tempo grid and cue table before animation; 57 picture events checked against the score (max offset 4.7 ms). Constant groove (kit with 16th hats and ghost notes, synth slap bass, brass stabs, e-piano) + one colour instrument per medium (xylophone crayon, guqin ink, square beeps ASCII, vibes+sax riso, pulse arpeggio pixel, muted trumpet blueprint, claves+dry piano Swiss). Rising brass run into each speed-up; key rises a whole step per round. Real silences before the biggest hit (heartbeat only on the last life). Host shouts each command 0.1 s after the stab.
- Microgames 2.5–4 s each.
### Finish
Home stage flat (no grain, mux grain 0). Media-specific finishes only inside games (CRT bloom/scanlines/curvature, riso halftone and misregistration, paper tooth). Impact white flash capped at ~60 %.
### 3D look (if any)
None.
### Banned
Not Game Show Flat (one art style, bars, call-and-response); not a style sampler reel (every game has stakes; lives connect them); not a montage (each rule grasped in under a second); never the reference series' name, characters, UI, microgames or music; never tint a medium with the home palette; no fades or blank frames; luminance-ramp ASCII figures (mush); ink shapes without designed silhouette (read as smoke); command tags piling up; 100 % white flash; letting the frenzy go on after it stops building.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/microgame.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microgame/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microgame/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microgame/demo/stills/modelsheet_v2.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/microgame/demo/stills/modelsheet_v2_styles.jpg (one character in 8 media)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/microgame.mp4
### Gaps
No vertical layout (TV at 1/2.5 of a 16:9 frame); medium palettes beyond Swiss not given as hex; no exact sizes for corner tags, lives icons or badges; easing curves for the TV push/shrink not given.

## Game Show Flat
- Source: `lemomo-ai/lemo-opuscar` `styles/game-show/STYLE.md`, `DEMO.md`, `style.json` (No. 33, Games); easing constants from `styles/game-show/demo/frame_head.html`; licence: MIT (docs), demo film/stills CC BY 4.0, **except the demo's shouts (macOS `say` system voices), which are excluded from the CC BY licence and must not be reused**. The demo also names real AI companies as an unofficial fan piece; real products only as name tags on original mascots.
- One line: a rhythm-game variety show in flat vector; toy bean mascots with thick ink outlines on candy stripes and sunbursts, every hit on a fixed tempo grid, call-and-response rounds, and a judgement word ("Perfect!") when each round is won.
- Suits: tech timelines, year in review, variety-show explainers, rankings, quizzes; works with no narration (shouts and telops only). Real footage: no. Real data: optional (stats as game UI; facts must be sourced). 3D: no. AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| outline / ink | `#1B1B1B` | all outlines, hard offset shadows |
| white | `#FFFFFF` | telop fill, catch-lights |
| cream | `#FFF6E5` | cards, report card, paper props |
| yellow | `#FFD23F` | candy primary; big words, judgement |
| orange | `#FF8C42` | candy primary |
| red | `#FF5A5F` | candy primary |
| pink | `#FF8FB1` | candy primary; judgement words |
| green | `#5BD68A` | candy primary |
| lime | `#C6F16D` | candy primary |
| sky | `#8ED1FC` | candy primary |
| blue | `#4D7CFE` | candy primary |
| purple / dark | `#6B4FBB` / `#46318F` | deep set |
| teal / dark | `#3FB8AF` / `#2B8F88` | deep set |
| navy | `#26264A` | ending set, final fade |
| wood / dark | `#C98A52` / `#8E5530` | props |
| gray | `#C3CAD9` | props |
| chalk | `#2F5D50` | chalkboard prop |
| skin | `#FFD1A8` | humans |
| character hues | `#19B388`, `#D97757`, `#4E7CF6` / `#9B6CF0`, `#F4E9D8`, `#4D6BFE`, `#2B59C3` | one body colour per contestant (identity, never changes) |
| example set | ground `#FFB870`, stripes `#FFA85A`, floor `#E08A4A` | one round's set (same hue, pattern one step lighter) |
| page background | `#F4ECDD` | HTML body behind the SVG (frame_head) |
Rules: ink + paper + ~8 candy hues + 2–3 deep hues with darker partners; one set = one hue (background, pattern and round card share it); neighbouring rounds never share a hue; a character is never the same hue as its background; big words white or yellow with ink stroke; judgement words pink or yellow.
### Typography
- Latin display/numbers: Fredoka 700 (Google Font). CJK: Noto Sans SC 900 (Google Font). Hand-written props only: ZCOOL KuaiLe (Google Font). Fonts loaded before measuring text.
- Telop text: white or yellow fill with an ink stroke ≈ 14 % of font size painted under the fill (`paint-order: stroke`); titles built glyph by glyph.
- Sizes at 1920×1080: title 200 px with 26 px ink stroke, glyphs popping 0.06 s apart; judgement word 120 px Fredoka with 18 px stroke at −6°; credit card lines 66 / 60 / 50 px; level name auto-fitted to 720 px.
- Telops are the subtitles: round cards, corner banners, labels, prop text, judgement words; ≤ ~20 CJK characters on a banner line, ≤ ~12 on a plate (Latin runs ~1.6× wider). With narration, subtitles become outlined telop plates at the bottom, never thin generic captions. Hold ≥ max(1.8 s, speech + 0.6 s); judgement words may be shorter.
- Case: mixed; words like "Perfect!", "GAME N".
### Layout
- Frontal, symmetrical proscenium; floor band at y = 860–900 with an 8 px ink line on top; characters stand on the floor band; banners top-left (default x 56, y 44); judgement words centre-top.
- Level card: full-bleed set colour + scrolling stripes, cream panel 1240×460 (radius 50, 10 px outline, 14 px shadow), "GAME N" pill tag, name, years in set colour, icon hopping on the left.
- Remix board: a month ribbon across the top, each item 2 bars centre stage, then shrunk ×0.27 into a slot along the bottom.
- Credit/report card: cream 1440×360, radius 40, 8 px outline, −1.5° tilt.
### Elements
- Vector only (SVG/canvas paths): flat fills, one near-black outline 8 px on characters and props, 5–7 px on small parts, round joins and caps.
- Hard offset shadow: same shape in outline colour shifted ~10 px (stickers, banners) to ~14 px (cards).
- Set patterns: diagonal stripes (often slowly scrolling), offset polka dots (18–25 % white), rotating sunburst.
- Bean characters: rounded bean body (160×172 px at scale 1), stubby arms with white mitten hands, foot ovals, oval eyes with catch-light, pink blush, mouth that swaps to an open red one; identity = body colour + belly patch + one head mark + ink name-tag pill under the feet. Humans share the construction; older machines are boxier robots.
- UI kit: round card, corner sticker banner (year + name + subtitle), judgement word, burst (8-point star + expanding white ring + 8 ink speed lines, 0.3 s), scoreboards, podium scores, counters racing to a target, price tags hammered, bar charts growing per beat, typewriter report card with a grade stamp, NEXT egg hatching.
### Motion
- Tempo grid: demo 150 BPM, beat 0.4 s, bar 1.6 s; every pop, drop, stamp, typed character and punch sits at (bar, beat) and is also a sound event. Nothing moves off the grid (between-beat events sit on subdivisions).
- Idle hop: a parabola per beat, 8–30 px; neighbours hop on the off-beat so a crowd ripples.
- Hit squash: damped wobble ~30 rad/s for ~0.35 s; downbeat squash `1 − 0.1·exp(−frac(t)·16)`.
- Entrances drop from the sky (500–900 px fall) with ease-in, landing exactly on the beat; crowds drop one per beat or half-beat with a pitched pip each.
- Pops: back-ease `1 + (c+1)(p−1)^3 + c(p−1)^2` with c = 1.9, default pop 0.35 s; per-glyph pop stagger 0.05 s, duration 0.38 s, rising 60 px from below; other eases: out = cubic out, in = cubic in, io = cubic in-out. Exits ease-in. Nothing fades in slowly.
- Shout pose: arms up + open mouth for about half a beat ("Hey!" window 0.24 s).
- Typewriter: one character per 1/8 beat, key click every 2 characters.
- Banner: slides in from the left with back-ease, lifts out upward. Credit card back-ease pop over 0.3 s.
- Camera: no travel. Beat punch = zoom 0.8–5 % around centre decaying in ~0.16 s (demo 0.008 ticks, 0.02 hits, 0.03–0.05 slams); several punches per bar for a chorus; sum of simultaneous punches < ~0.06. Also: locked frontal wide, split stage, shrink to thumbnail, vertical scroll floor to sky, snap zoom to 2× on a prop for one bar.
### Transitions and rhythm
- Hard cuts on bar lines with a very short white flash (demo 0.08 s); no dissolves; a fade only at the very end (demo last 0.8 s to navy).
- Round = 1-bar title card on a jingle (crash + kick + rising brass arpeggio + snare roll) + 8 bars of play: pattern set up in the first half, answered/escalated in the second, slam + "Perfect!" on bar 7 beat 3. Call-and-response escalates by subdivision (quarters → eighths).
- Demo structure: 4-bar cold open count-in, 7 levels × 9 bars, 1-bar remix card, 16-bar remix, 9-bar ending = 93 bars = 148.8 s at 30 fps.
- Score: synthesized from the picture's own event list (474 events); bright major pop on a one-chord-per-bar loop (demo F–G–Em–Am), one flavour per round; remix transposed up 2 semitones. Shouts placed 20–30 ms before the beat; crowd shout = 6 voices stacked 5–6 ms apart, panned −0.6…+0.6.
### Finish
None: no gradients, blur, texture or soft shadows; flat vector only.
### 3D look (if any)
None.
### Banned
Not a microgame frenzy (no per-3 s timer, no art-style change per round); not a mid-century cartoon (no textured painted backgrounds, no character acting); not a keynote (no slow reveals, no gradients); no blur, texture or soft shadows; no slow fade-ins; no dissolves; no off-grid motion; no stateful updates (render must be a pure function of t); never the reference games' names, characters, UI, levels or music (don't name the genre's series on screen); no real logos, wordmarks or product UI; real people only as generic stand-ins; same hue for neighbouring rounds or for a character and its background.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/game-show.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/game-show/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/game-show/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/game-show.mp4 (on-screen text in Chinese; shouts in English, excluded from CC BY)
### Gaps
No vertical layout; English telop sizes not tested in the demo (only "runs ~1.6× wider"); no rule for how many characters on stage at once; punch easing curve beyond the ~0.16 s decay not stated.

<!-- category: Cinema & Eras -->

## 1920s Silent Film (Projected Photoplay)
- Source: `lemomo-ai/lemo-opuscar` `styles/silent-film/STYLE.md`, `DEMO.md`, `style.json` (No. 34, Cinema & Eras); exact post values from `styles/silent-film/demo/engine/film.js`, `demo/film.js`, `demo/engine/redraw.js`, `demo/engine/cards.js`, `demo/cardspecs.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0
- One line: an engraved ink-and-silver-wash drawing projected as a flickering, weaving, scratched 4:3 print between velvet theatre curtains, with intertitles instead of voices and a cinema piano playing every beat.
- Suits: wordless comedy, retro brand films, silent storytelling, mock newsreels, trick films, "company archive" pieces. Real footage: optional (a Redraw pass turns real video into the same ink drawing). 3D: no (2.5D rig). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high (post-pass values are exact in code)
### Palette
| role | hex | where used |
|---|---|---|
| card background | `#0e0d0b` | intertitle card, dark screen before the lamp strikes |
| card text / border | `#ece5d5` | intertitle type and deco borders |
| theatre black | `#050404` | base under the theatre drapes |
| "the one colour" (example) | `#D97757` | an element kept in its own hue through the print via a colour mask |
| sepia low end | rgb(.105,.07,.045) ≈ `#1B120B` | sepia tone ramp, darks |
| sepia mid | rgb(.62,.50,.37) ≈ `#9E805E` | sepia ramp at L ≈ 0.6 |
| sepia high | rgb(.97,.92,.82) ≈ `#F7EBD1` | sepia ramp, highlights |
| dust (white) | rgba(240,232,215,.55–.95) | scraped-emulsion specks |
| dust (dark) / hair | rgba(12,10,8,.6–.95) / rgba(10,8,6,.75) | dirt specks, hair in the gate |
| footlights | rgba(255,170,110,.42) → rgba(170,70,50,.16) | radial wash up the closed velvet (screen blend) |
Rule: monochrome silver, tinted only by the print. Grey values as print densities: ink 0.07, dark cloth 0.15–0.3, mid wood 0.45–0.6, skin 0.8, white linen 0.9–0.95. Sepia amount 0.10–0.36 per section (colder and more damaged when things go wrong, warmer and cleaner when tender). At most one colour in the whole film. Alternative: period tints per section (amber day interiors, blue night, rose romance), one per section.
### Typography
- Faces (both Google Fonts, OFL): **Playfair Display SC** (titles and shouts, weight 900; 700 for small caps credits) and **Old Standard TT Italic** (narration and dialogue).
- Sizes on the 1440×1080 card: title 112 px (subtitle line 40 px italic, spacing 2); narration 80 px italic; tender dialogue 76 px italic; shout 128 px + 150 px small caps, weight 900; end card 104 px, credits 24–34 px. Line gap multiplier 1.12 (shout) to 1.55 (end card).
- Case: small caps for shouts and titles; sentence case italic for narration.
- Emphasis: the card's border ornament follows the emotion: level 0 shout = one heavy rule (9 px stroke, 30 px inset) and the text shakes (shake 0.35); level 1 narration = double rule (2.2 px + 5.5 px) with stepped corners and fans; level 2 tender = vines and small flowers.
- Words on screen: a few words per card; 3–5 cards in a short film; a card never explains what the picture shows. The intertitles are the subtitles (the `.srt` lists them). Card hold 2.5–3.75 s (≥ max(1.8 s, reading + 0.6 s)).
### Layout
- Canvas 1920×1080; the film image is a 1440×1080 (4:3) gate centred at x = 240, with a rounded 22 px aperture and soft dark rim. The two 240 px side strips are the picture house: velvet drapes lit by the screen's spill (mean frame brightness, min 0.3) and by footlights.
- Shots are wide and medium; figures realistic (7.5-head adults, ~5-head children). Big close-ups are avoided (rigged faces read as mannequins); the only close-up lives inside an iris.
- Density: one legible gag chain per frame; check each shot as a thumbnail (value contrast: dark clothes on pale walls, pale faces on dark interiors).
### Elements
- Intertitle cards with deco borders (heavy rule / double rule with fans and diamonds / vines).
- Iris (circular mask printed with the frame, so it ages with it); half-open iris held for a look at the audience; masked POV shots (keyhole, binoculars); split screen / double exposure.
- Theatre curtains that part at the start and close at the end (1.1 s smoothstep each way), footlights on the closed velvet.
- Ink drawing: XDoG contours on the dark side of every edge, ~5 posterised wash steps, 45° hatching then crossed (third family at 0.12 rad) in the darks.
- Figures: 2.5D rig, silent-era make-up (pale skin, dark lids and lips), identity by silhouette marks (hat, garment, tool).
### Motion
- Hand-cranked sampling: character and camera motion sampled at **16 fps** (18 fps to undercrank a fast scene; demo chase 18 fps with crank 1.3–1.35, "1.3× speed"); flicker, weave, grain and scratches change every output frame at **24 fps**.
- Speed is an emotion: undercrank chases and panic (faster motion and faster flicker); back to 16 fps and a calmer print for tender scenes.
- Keyframed, eased poses (smoothstep); only deliberate gags snap (the two-frame double take with a little jump). Deadpan face; body acts (crouch before effort, held poses, hands on knees). Objects act (wobble before a fall, ritardando to rest; rotation = distance / radius).
- Iris: opens from r 6 to ~1900 px on the subject (demo: from the iris hit to 0.45 s after the lift); closes in 2 beats to r 190, holds 1.3 beats for the wink, shuts in 0.6 beat.
- Camera: mostly locked. Vocabulary: locked-off extreme wide (the wait is the joke), locked full shot (premise in one frame), tracking shot with foreground passing (demo: town parallax 0.8, lamp posts in front at 1.35), iris in/out, half-open iris held, slow motivated push-in (demo zoom 1.6 → 2.1 as the hero kneels), masked shot, split screen / double exposure.
### Transitions and rhythm
- Transitions: iris, fade to black, straight cuts, the curtain. No dissolves between shots of the same scene, no modern whip pans.
- Rhythm: a photoplay cue sheet by mood section (Maestoso, Andante, Hurry, Misterioso, Agitato, Tenderly); demo Hurry at 144 BPM in A minor, ritardando to 88, Tenderly at 72 BPM; a single `timeline.js` cue sheet drives picture and score (hits land at 0 ms).
- Silence: music stops, the projector purr alone remains (demo: 2 s before the reed organ enters). Demo 54.2 s, 1301 frames.
### Finish
`FilmPost` WebGL2 print pass (defaults; `strength` master 0.3–0.85 per section):
- Softness: 45 % mix with a 4-tap blur at 0.7 px ("print of a print").
- Halation: +0.22 × max(0, L_blur − 0.55) × 1.8 (×1.4 on cards).
- Flicker (exposure multiplier per frame): 1 + ((rnd − 0.5) × 0.09 + sin(f × 1.9) × 0.025 × crank + sin(f × 0.37) × 0.02) × strength.
- Uneven density: 4-octave fbm, ±0.045 × strength, drifting 0.021 per frame.
- S-curve contrast; print black **0.055**, white **0.93**.
- Gate weave: x ≈ (sin·0.6 + sin·0.8 + noise·0.5) × 1.4 × strength px, y ≈ (… ) × 1.6 × strength px; perforation jump +4 px × strength with probability 2.5 % per 2-frame pair.
- Scratches: up to 4 vertical lines, each living (5 + 3i) frames, width 0.6–2.0 px, wobbling ±3 px, broken along their length; white (+0.7, scraped emulsion) or dark (−0.55, dirt on negative).
- Burn: brown edge fog creeping ~0.12–0.22 of frame height in from the edges, darkening up to 55 %.
- Vignette: up to 62 % darkening, smoothstep 0.10–0.62 (aspect 1 : 1.15).
- Silver grain: 2 octaves (1.25 px hash ±0.04 + 2.6 px value noise ±0.035), strongest in the mid-tones.
- Tone: neutral silver (×0.985/0.99/1.0) mixed toward sepia by 0.10–0.36.
- `damage()` overlay: 2–9 dust specks per frame × strength (radius 0.8–4 px, 35 % white), a wiggling hair (40–130 px, 1.2 px) that stays ~11 frames with 22 % × strength chance, a single-frame blotch (10–28 px) at 1.2 % × strength.
- Mux grain 1 (grain in the picture); re-encode `-tune grain -crf 25` (demo 170 MB at CRF 19 → ≈ 77 MB).
- Per-section look (demo): pre-roll str 0.7 / sepia 0.12; bakery 0.5 / 0.14; chase 0.85 / 0.10, 18 fps, crank 1.35; tender 0.32 / 0.34; iris close 0.3 / 0.36.
### 3D look (if any)
None; figures use a 2.5D rig (joints solved in 3D, projected with a yaw). Note for Blender: the print pass could be reproduced in compositor, but nothing in the source is 3D.
### Banned
Not noir (no hard shadows as mood, no voice-over); not a sepia filter over modern animation (the drawing itself must be engraved and inked); not a Chaplin pastiche: never the Tramp look (bowler, toothbrush moustache, cane); no real film's gags; no published melody; no foley and no voice (the piano is the sound design); no dissolves within a scene; no whip pans; no big close-ups of rigged faces; no pose switching by `if` branches (pops); no motion blur implied; never cross raised arms over a face; never more than one colour.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/silent-film.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/demo/stills/frame_cards.jpg (the four card types)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/demo/stills/frame_redraw.jpg (real footage through the ink pass)
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/demo/stills/frame_v2_tender.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/silent-film/demo/stills/modelsheet_v2.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/silent-film.mp4
### Gaps
Vertical framing is not addressed (the 4:3 gate + curtains concept assumes a 16:9 canvas; in 1080×1920 the curtains would sit above/below or the gate would need rethinking). Exact tint hexes for amber/blue/rose period tinting are not given. Hatch spacing defaults (gap 5.5 px, sigma 1.1) are code defaults, not style rules.

## Liminal Found Footage (VHS Camcorder Rule-Horror)
- Source: `lemomo-ai/lemo-opuscar` `styles/backrooms/STYLE.md`, `DEMO.md`, `style.json` (No. 36, Cinema & Eras); post values checked in `styles/backrooms/demo/main.js`, `demo/vhs.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0
- One line: one continuous first-person 1990s camcorder tape walking an empty, endless, fluorescent-lit interior where printed rules, the OSD and failing autofocus carry the dread; a chill, never a jump scare.
- Suits: horror, mystery/ARG, game teasers, "procedure/orientation/checklist" stories, night-watch logs, walkthroughs. Real footage: no (all procedural 3D). 3D: **yes** (three.js scene with custom lighting). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| wallpaper (dominant sickly hue) | `#d5bd66` | walls; stripes `rgba(140,112,40,.7)`, every roll faded differently |
| baseboard / trim | `#4d3d26` | darker trim of the same family |
| carpet | `#8c763c` | mottled floor; damp patches ×0.6 with faint specular |
| ceiling tile | `#d9d3b8` | drop ceiling |
| ceiling grid | `#e6e1cf` | tile grid |
| troffer diffuser | `#fbfaf0` | light panels, emissive ×5 |
| the one saturated signal | `#ff2a1a` | red EXIT sign, emissive ×9 so it blooms |
| OSD text | `#ecece4` | camcorder title / OSD |
| alt location: pool | `#9fc7c0` / `#e6ece6` / `#5e8f96` | tile / grout / water (example) |
| alt location: school | `#b9c49a` / `#6f7f66` / `#a89a7d` | corridor / lockers / linoleum (example) |
Rule: one dominant sickly hue from the location's materials plus a darker trim and same-family floor; ceiling and panels near-white, slightly warm; exactly one saturated colour (alarm red, emergency green, amber), the only thing that blooms; white balance drifts, never graded clean.
### Typography
- Captions: **IBM Plex Mono 600** (Google Font), 42 px at 1920×1080, white on a solid black box per row, ≤ 32 characters per row, centred inside the 4:3 image just above the OSD clock (CEA-608 style); untouched by tape noise. Hold ≥ max(1.8 s, speech + 0.6 s).
- Speaker marks: `[PA]` prefix for announcements; italics for the operator (first line tagged `(whispering)`); SDH sound descriptions in brackets (`[FLUORESCENT LIGHTS HUMMING]`, `[LIGHTS FLICKER]`, `[TAPE NOISE]`, `[SILENCE]`).
- Notices (in-world print): **IBM Plex Sans Condensed** 700/600 headers (Google Font), numbered rules in **IBM Plex Sans 600** (Google Font); all-caps headers with form numbers and revisions ("FORM NS-01 (REV. 9)"), polite closing line from "Management". Rules on notices are not captioned; readable at 1080p, ≥ 3–4 s uncovered.
- OSD: a hand-made 5×7 bitmap font with black outline (not a Google Font); title generator uses the same font ×2 (demo scale 9).
- Emphasis: rules drift wrong and contradict each other; the last addresses the viewer.
### Layout
- 4:3 image pillarboxed in 1920×1080 (black side bars); 3D rendered at **720×540** and upscaled by the VHS pass.
- OSD: `● REC` top-left, battery top-right, time `PM 11:58` and date `SEP.27.1996` bottom-right; barrel and vignette apply to the image but not the OSD.
- Framing: text readable and uncovered; any presence small, far (demo ~33 m), in a region of dead lights. Close-ups of notices: lower the camera so the lens is parallel to the page (pitching down shears text into fake italics).
### Elements
- Printed notices on yellowed laser-print paper, pinned to cork or taped to wallpaper; repeated notices in different places.
- Camcorder OSD (REC dot, battery icon that drains, clock that jumps), title-generator text over the first shot.
- The "thing": a 2.4 m organic Canvas2D silhouette on a camera-facing billboard, wrong by 15–40 % (small head, long tilted neck, narrow high shoulders, arms to the knee), slow wave on a 3.6 s cycle; "you can tell it is waving, you cannot count fingers"; never a close-up.
- Operator's body: only shoe toes (extruded outline with bevel, lighter sole, laces), never legs.
- Restrained decay (single-digit %): tide-marks at some wall feet, nicotine-yellow band under the ceiling, peeling seams on ≈7 % of rolls, ~4 % yellowed tiles, ~2 % return-air grilles, < 1 % missing tiles, dead insects in diffusers.
### Motion
- One continuous handheld take; cuts only where the tape breaks (power-on roll-in, tracking tear, REC off).
- Handheld rig: 0.72 m stride, head bob 3 cm, sway 1.8 cm, roll ±0.8°, breathing 0.27 Hz, tremor noise at 1, 3.5 and 9 Hz whose amplitude follows a "fear" curve; at a held breath freeze all of it.
- Looking down: pitch ≈ −1.2 rad, camera pushed 0.2 m forward.
- Autofocus: DOF focus distance animated with overshoot (blur → lock → slip → lock); blur from pulling focus near; the figure exists only in the ~0.5 s of correct focus. Zoom FOV 52° → 27° with aperture ×5.
- Light flicker: three 0.1 s blackouts; auto-exposure catches up with ~0.45 s lag; gain noise pumps.
- Things move by themselves slowly: doors open over 1.3 s, eased; nothing snaps.
- Camera vocabulary: walking POV down a corridor; slow pan off a detail to the space; glance down at the feet; crouch and hold on printed text (≥ 4 s); zoom + focus hunt into the distance; identical framing after a tear with only the OSD changed; turn a corner and hold; slow silent push-in; backing away while filming; camera set down recording alone; whip toward a sound, then nothing.
### Transitions and rhythm
- Transitions: tape events only (roll-in, tracking tear, REC off: freeze, tear, black). Tracking tear adds frame roll ±0.06 for its duration.
- Rhythm: deliberately slow; demo opens with ≈ 20 s of almost nothing. No score; in-world hold music only (demo 88 BPM F major, tape speed sagging 1.00 → 0.97 → 0.89). Climax = one full second of digital zero captioned `[SILENCE]`. Length follows the walk (demo 59.7 s, 1433 frames at 24 fps).
### Finish
VHS camcorder ShaderPass (not a CRT), demo values:
- Per-line time-base jitter 0.3 (low-frequency wobble ≤ 0.25 px so text doesn't skew); head-switching band on the bottom 8 lines; tracking tear on demand.
- Barrel 0.07 and vignette 0.42 on the image only.
- Luma bandwidth limit (Gaussian σ ≈ 1.25 px at 720) + edge-enhancement ringing (sharp 0.9); chroma averaged over ±10 px (chromaW 5.0) and shifted 1.6 px right; bright lights smear right (smear 0.35, above luma 0.82).
- AWB tint drifting (opening swings blue → yellow); AGC gain noise 0.03, streaky, stronger in darks; 0–2 dropout lines per frame; black lift 0.045; soft highlight clip above 0.55.
- Noise steps at 30 fps (tape rate) while output is 24 fps. No scanlines, no RGB mask.
- Before VHS: three.js `NeutralToneMapping`, exposure 0.85; GTAO (radius ≈ 0.55 m) on seams; physical DOF (max CoC 14); bloom strength 0.5, radius 0.55, threshold 1.1.
- Mux grain 0 (noise is in the picture); VHS noise makes big files, CRF 24 ≈ 47 MB per 60 s.
### 3D look (if any)
- Space: axis-aligned partitions 0.16 m thick on a 2.4 m grid with random gaps and stubs, square pillars; ceiling 2.70 m; drop-ceiling tiles 0.6×1.2 m; recessed prismatic troffers (0.6×1.2 m) every 2.4 m. Hand-authored route through procedurally filled offices so every doorway shows more emptiness.
- Lighting = thousands of lights, no shadows: every troffer's colour/intensity in a 128×128 float DataTexture; each fragment sums the nearest 5×5 panels (emitter cosine × Lambert / (d² + 0.3)) plus a bounce term; no occlusion. Per-light variation ±8 % warm/cool, +0–7 % green, 3.5 % dead, 2.5 % flickering. A dead zone needs every light within ±5 m dead.
- Fog follows local light (fog colour × local bounce / average); background = fog × 0.15 so corridors dissolve to dark.
- Camera: perspective, FOV 52° (horizontal, converted for 4:3), zooming to 27°.
- Blender mapping: Eevee/Cycles with many emissive area panels and shadows disabled approximates it; fog-following-light needs a volume or compositor trick; render at 720×540 then a VHS compositor/ffmpeg pass. Procedural textures (wallpaper, carpet, ceiling, notices) are canvas-generated in `tex.js`.
### Banned
Never the word "Backrooms", wiki "Level" numbers, community entity names, or any existing organisation/logo on screen; no monster close-ups, gore, jump scares or score stings; not an ASCII/CRT piece (no phosphor, scanlines, RGB mask); not a ruin (decay in single-digit %); no fully bright scene (reads as a hospital); no bright background wall at a corridor end; no uniform fog; no primitive-built figures or tube legs; no camera pitched down at notices; no score; never show the operator above the shoes; only one saturated colour.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/backrooms.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/backrooms/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/backrooms/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/backrooms.mp4
### Gaps
No vertical (9:16) guidance (the 4:3 pillarbox assumes 16:9). OSD font is hand-made (5×7 bitmap) and not supplied as a standard font. Exact AF overshoot curve shape and fear-curve amplitudes are in code, not stated.

<!-- category: Materials & 3D -->

## Brick Toy (Macro Stop-Motion on a Real Desk)
- Source: `lemomo-ai/lemo-opuscar` `styles/brick-toy/STYLE.md`, `DEMO.md`, `style.json` (No. 37, Materials & 3D); lighting/lens values checked in `styles/brick-toy/demo/set.js`, `demo/main.js`, `demo/bricks.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0; demo music is Kevin MacLeod (CC BY 4.0), props/HDRI from Poly Haven (see `demo/CREDITS`)
- One line: a world of glossy interlocking plastic bricks on a real wooden desk, shot like macro toy photography and animated a pose at a time, the toy world against the real room.
- Suits: toys and kids, product builds/assembly stories, space, "how it's put together", recycling/pivot stories, before/after rebuilds. Real footage: no. 3D: **yes** (three.js, real materials, DOF). AI images: no. Real-world props: yes (scanned/CC0 models and textures, e.g. Poly Haven).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| brick red | `#c91a09` | toy primaries (characters/hero objects take the most saturated) |
| brick blue | `#0055bf` | toy primary |
| brick yellow | `#f2cd37` | toy primary; title sub-line, subtitle brick icon |
| brick green | `#237841` | toy primary |
| brick white | `#f2f2ee` (STYLE/DEMO) / `#f4f4f1` (code) | white bricks, must read white |
| brick black | `#1b2a34` | |
| orange | `#fe8a18` | extra brick colour (code) |
| light grey / dark grey | `#a0a5a9` / `#6c6e68` | (code) |
| tan | `#e4cd9e` | (code) |
| azure | `#36aebf` | (code) |
| lime | `#bbe90b` | (code) |
| matte baseplate green | `#4f9e3a` | large baseplate, clearcoat only 0.12 |
| key light | `#fff4e8` | warm-white directional key |
| fill | `#cfe0ff` | cool directional fill |
| softbox key / rim | `#fff6ee` / `#e4eeff` | RectAreaLight softboxes |
| lamp bulb | `#ffe2b8` | practical point light |
| subtitle pill | `rgba(18,20,26,.62)` | dark rounded pill behind subtitles |
Rule: a handful of saturated brick primaries plus white, black, greys, tan; each object one dominant colour plus at most one or two trims; the real world stays natural and muted (wood, paper, ceramic, daylight); translucent orange/yellow/clear/blue reserved for effects (fire, light, water, glass); grade slightly cool so whites don't go cream.
### Typography
- Face: **Fredoka** (Google Font, OFL, rounded and friendly; also in `core/fonts`). Title Fredoka 700; subtitles Fredoka 600 at 46 px (1920×1080), white.
- Subtitles live on a toy element: dark rounded pill centred 150 px above the bottom, a small yellow 2×1 brick icon on the left; ≤ 2 lines. A second speaker (radio/device) gets a different icon colour (red brick) and a tag ("MISSION CONTROL"). Hold ≥ max(1.8 s, speech + 0.6 s).
- Title pops in on 12 fps steps like a piece being placed, with a short sub-line in a brick colour, uppercase ("A BRICK TOY FILM" in yellow).
- Words on screen: few; 4–6 short narrator lines in the demo.
### Layout
- 1920×1080, 24 fps, rendered at 2× (3840×2160) and downsampled.
- Keep foreground clutter (part piles) out of the frame edges; check headroom in every shot; check each real prop against every camera so it doesn't sneak into another shot's background.
- Scale: 1 stud pitch = 8 mm = 1 unit; brick height 1.2, plate 0.4; 1 m = 125 studs; real props at true scale.
### Elements
- Bricks: rounded-box bodies (bevel ~0.045 stud in STYLE, 0.06 in demo), studs with a thin lip and no lettering, plates, round bricks, translucent pieces.
- Characters built from bricks (1×1 columns for legs, 2×2 brick torso, round-brick arms, round 2×2 helmet with a curved open-cylinder visor panel). Arms and legs rotate at joints; nothing bends.
- Effects are bricks: fire = translucent orange/yellow round plates jittered every frame; smoke = white round bricks that grow and roll outward; moon = grey round plates with crater tiles. No particles, no soft gradients.
- Household objects as landscape (teapot = mountain, books = moon, desk lamp = sun).
### Motion
- Characters and bricks step at **12 fps** (on twos); camera, focus, fire and flying vehicles move on ones at **24 fps** (a stepped camera reads as judder).
- Brick snap: flies in on an arc, overshoots 0.35 stud → 0 in ~0.17 s (~4 frames); every snap is a click on the soundtrack.
- Acting: big readable poses held several drawings (V of arms = pride, arms flung up = alarm, bowed head = sadness, hop = joy). Walk cycle legs ±0.55 rad with a small bob.
- Collapses: pre-simulated rigid-body physics; tip about the base edge, then free bodies with gravity ~420 studs/s² (true would be 1225, lower reads better at this scale), restitution ~0.3, friction, settle flat. Deterministic.
- Bricks never stretch, squash or morph; tiny imperfections allowed.
- Camera vocabulary: extreme macro on one brick/stud with the room blurred behind; low angle at minifig eye level (heroic); high wide over the whole surface (scale reveal); low, wide, lonely frame with the character small in a corner; frontal close-up on hands and brick; handheld shake on impact; tracking alongside a moving object with its destination in frame; top-down plan view; rack focus from a real object to a brick; orbit around a finished build.
- Lens: perspective FOV 32° default, 24–46° per shot (24° for the tightest close-up, 44–46° for low heroic angles). Focus always on a character's head or the brick being placed.
### Transitions and rhythm
- Cut on beats or bars (demo: cut every bar while building); a snap can be the cut point.
- Transitions: a hand-placed brick covering the lens, a whip along the desk, a pull out of one set into the next. No generic dissolves.
- Music edited to picture (bar-aligned jumps, chroma similarity at joins), not looped under it. Silence: music cut dead on a failure, leaving room tone and one real-world sound (ticking clock); pull music out before a big moment, leaving a pulse/heartbeat. Demo 54 s (1296 frames), arc opening 0–6 s, act one 6–18, act two 18–30, act three 30–50.
### Finish
- Tone mapping three.js `NeutralToneMapping`, exposure 1.0.
- Bloom strength 0.14, threshold 1.3 (very subtle).
- Grade/vignette pass: vignette 0.36, warmth −0.35 (cool), contrast +0.26, saturation ×1.1.
- GTAO mandatory (radius ~3.5 studs, scale 2.5) to darken seams, stud bases and contacts; plus a soft contact-shadow blob behind hero objects.
- 2× supersampling against shimmering stud edges.
- Physical DOF, CoC ∝ |1/focus − 1/z|, max CoC 16; aperture scaled with shot size: ~500–700 close-ups (up to 1100 for the extreme macro), ~800 mediums, ~380–450 wides.
- Grain: not stated (default mux).
### 3D look (if any)
- Plastic (ABS): `MeshPhysicalMaterial`, clearcoat 0.85, clearcoat roughness 0.07, roughness map with faint fingerprints and scratches (base ~0.17–0.27, scratches up to ~0.65), specular intensity 0.9, env map intensity 1.15; bevelled edges catch highlights. Translucent pieces: transmission 0.92, thickness 0.8, roughness 0.06, IOR 1.52, clearcoat 1. Large baseplates matte (clearcoat 0.12, clearcoat roughness 0.5, roughness 0.55) or they reflect softboxes as a coloured wash.
- Set: real walnut desk texture (Poly Haven `american_walnut_veneer`), Poly Haven models (tea set, desk lamp), books, pencil.
- Light: neutral daylight studio HDRI (`photo_studio_loft_hall`), environment intensity 0.45, background intensity 0.22, background blurriness 0.5 (never tungsten: whites go orange). Directional key `#fff4e8` intensity 3.0 from upper left with shadow frustum fitted per shot (±95 units); cool fill `#cfe0ff` 0.45; RectAreaLight softboxes: key front-left `#fff6ee` 6 (70×45), cool rim behind `#e4eeff` 9 (60×30), one over the finale set `#fff6ee` 5 (50×35); practical lamp bulb point light `#ffe2b8`.
- Blender mapping: Principled BSDF with Coat 0.85 / coat roughness 0.07 and a fingerprint roughness texture; bevel modifier; area lights as softboxes with a low-strength studio HDRI; Cycles/Eevee AO; camera DOF with f-stop scaled per shot size; 12 fps stepping via keyframe "constant" interpolation on characters only, camera on ones; rigid-body sim baked.
### Banned
Never the LEGO name, logo or minifigure silhouette; no lettering on studs; never copy brick-film characters, sets or music; not a low-poly island (no flat facets, no floating diorama); not clay/felt stop-motion (no deformation); not a clean product render (the world is handled and knocked over); no particle systems or soft gradients for effects; no tungsten HDRI; no clearcoat on large baseplates; no stepped camera; no excess aperture blurring the hero at mid distance; no fast object flying off into blank space (track it with its destination in frame); no generic dissolves.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/brick-toy.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/brick-toy/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/brick-toy/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/brick-toy.mp4
### Gaps
No vertical framing guidance; aperture values are in the engine's own units (not f-stops); grain/film finish not specified; music in the demo is licensed (MacLeod), the style gives no original score structure.

## Paper Pop-up Book (Cut-Paper Diorama on a Real Desk)
- Source: `lemomo-ai/lemo-opuscar` `styles/paper-popup/STYLE.md`, `DEMO.md`, `style.json` (No. 41, Materials & 3D); finish values checked in `styles/paper-popup/demo/post.js`, `demo/lib.js`, `demo/mux.sh`; licence: MIT (docs/code), demo film/stills CC BY 4.0; demo music is Kevin MacLeod (CC BY 4.0), props/HDRI Poly Haven CC0 (`demo/CREDITS`)
- One line: a hardcover pop-up book on a photoreal desk becomes a stage; flat, saturated cut-paper actors with thick white borders perform among paper sets that spring up from the page, under real lamp light and a shallow macro lens.
- Suits: children's stories, game trailers, story films, process/stages explainers (page turn = scene change), product-at-home stories ("the real object plays a part"), before/after with pull-tabs. Real footage: no. 3D: **yes** (three.js scene with flat cards, real HDRI and props). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high (one of the best-specified styles: scales, colours, motion formulas, mix values)
### Palette
| role | hex | where used |
|---|---|---|
| ink (never black) | `#3a2a24` | outlines 9 px, detail lines 5 px |
| off-white border | `#fffdf7` | cut-paper border, 12–16 px |
| cardboard edge | `#b9ad9c` | grey card edge, border + 2.5 px, offset 1.5 px down |
| card back | `#efe8da` (door `#8a5a34`) | plain paper backs of pop-up pieces |
| home valley grass | `#86c763` → `#9fd57a` | ground page gradient |
| hills | `#b5e39a` `#a9dd8c` `#8fd06e` (shade `#6fb553`) | pop-up hills |
| path | `#ecd49a` | |
| day sky | `#7cc6ef` → `#c9ecf7` | backdrop |
| forest ground | `#4f8f46` → `#62a653` | |
| pines back / front | `#8cc9a0` / `#3f9a5c` | |
| forest sky | `#a8e0cf` | with light shafts |
| sea waves light→dark | `#9ad8f5` `#79c3ee` `#58ade3` `#3f95d6` `#2f7fc4` | sliding wave strips |
| sea sky day / night | `#4fb3ea` / `#131d44` → `#4a5a94` | flipping slats |
| last page | `#f5eedc` + graphite `rgba(70,72,82,.45)` | "unfinished" page: graphite on cream |
| hero skin / shade | `#ffe2bd` / `#f3c393` | |
| hero cap | `#62c24c` / `#3e9a34` | |
| hero tunic | `#3fa1de` / `#2a78b3` | |
| boots / wings | `#8a5530` / `#d4f3ff` | |
| accent red (house) | `#e8413a` | recurring accent across spreads |
| sun | `#ffd766` | |
| sign/banner gold | `#ffcf3f` | chapter banner title, end title |
| ribbon red | `#d8423a` | chapter ribbon |
| book cloth / foil | `#1f5566` / `#e0b456` | cover cloth, gold foil (metalness map) |
| page edges | `#efe6d2` | page block |
| subtitle text | `#fffaf0` | cream with dark-brown outline |
| bubble Chinese text | `#7a5e4c` | |
| walnut tint | `#c9a88a` | desk veneer tint |
Rule: saturated children's-book colour, never neon; real world natural and slightly warm; one dominant hue family per spread (a page turn is also a colour change); a few accents (red, yellow, gold) recur across spreads; unfinished/"outside the story" pages drop to graphite on cream; night is a change of the paper art, while the real lamp stays warm.
### Typography
- Faces (all Google Fonts, OFL): **Fredoka** 500/600/700 (subtitles, bubbles, signs); **Lilita One** (cover, chapter banners, action words, end title); **IM Fell English** (taglines, "The End"); **ZCOOL KuaiLe** (Chinese, subset to used characters, with Fredoka in the stack for Latin).
- Sizes at 1920×1080: narration subtitles Fredoka 500 40 px, cream `#fffaf0`, 8 px dark-brown outline, soft shadow, wrap at 1720 px, bottom centre; Chinese line ZCOOL KuaiLe 32 px below. Speech bubbles Fredoka 600 46 px (Chinese 32 px). Chapter banner title Lilita One 84 px gold with 12 px ink stroke. Action words ("NICE!", "GREAT!") italic Lilita One 120 px, gradient fill, white + ink double stroke, rays. End title Lilita One 96 px; credits 22 px.
- Subtitle timing: fade in 0.3 s before the line, hold until 0.25 s after the audio, fade 0.3 s; hold ≥ max(1.8 s, speech + 0.6 s).
- Bubbles: white card, radius 44, 6 px ink outline, soft drop shadow, tail projected from the 3D speaker every frame, pop in with `back()` overshoot, type on at 30 chars/s with a blip every second letter, bobbing red "next" triangle.
- Titles are paper objects (a cardboard sign dropping on strings and swinging; the book cover is the film title). Action words used sparingly, like a game rating.
### Layout
- 1920×1080 at **60 fps** (smooth macro camera). Real units in metres: page 0.44 × 0.30 m (0.3–0.5 m range), page block 0.0175 m, actors 3–5 cm (hero 0.036 m), camera near plane 0.004 m. Art drawn at 5200 px/m.
- Book open: one board stands up as the backdrop (painted sky), the lower page is the ground; page coordinates x ∈ [−0.22, 0.22], z from spine (0) to reader (0.30).
- Actors in focus; room objects as soft foreground/background; keep near pop-ups out of the lens path.
### Elements
- Cut-paper finish: Canvas2D art with dark-brown ink outline, silhouette dilated (16+ angles on 3 rings: r, 0.66r, 0.33r) into a grey cardboard edge and a wide off-white border; shared 512 px paper grain at alpha 0.5–0.85 on top.
- Drawing: thick outline + thinner detail line, round joins; shading = one hard crescent (fill with shade, refill shifted with base colour); wobbly shapes from 3-harmonic noise, never perfect geometry; simple faces (big black oval eyes with two white highlights, curved mouth, pink cheeks).
- Pop-up pieces: planes with art front / plain paper back, `alphaTest 0.5` + `alphaToCoverage`, alpha-mapped custom depth material so the shadow is the cut-out silhouette; "3D" objects are several flat cards (sail behind, hull in front; a plane of four triangles hinged on a keel).
- Paper mechanisms: sun on a stick, hinged door, sliding wave strips (±12 mm), four sky slats flipping day → night (0.28 s apart), moon and stars dropping on strings.
- The book: cloth cover with gold-foil title (roughness/metalness map), page block with edge lines, curling leaf.
### Motion
- On ones at 60 fps; everything a pure function of `t`. Paper moves stiffly; life comes from easing.
- Easings (from `lib.js`): `back(t, s) = 1 + u²((s+1)u + s)` with u = t − 1 (default s 1.8; pop-ups use s 1.7); `eio` = cubic ease-in-out; `eo` / `ei` cubic; `spring(t, k=7, z=0.35) = 1 − e^(−z·k·t)·cos(k·√(1−z²)·t·1.6)` for things on strings.
- Pop-ups: `back(seg(t, t0, t0 + 0.55), 1.7)` (0.55 s), rising back to front: delay = (0.3 − z) × 1.2 s after the spread's rise time; far pieces lie back, near ones fold forward face-down; fold down in the same order.
- Sway of plants/light props: sin(1.6 t + phase) × 0.01–0.08 rad around the base.
- Characters: flat cards redrawn per quantized pose (1/40), eyes open/happy/wide/closed/dizzy, mouth smile/open/o/grin/worried/determined, blink every 3.7 s; walk legs swing by sin(phase), bounce |sin(phase)| × 1.2 mm, arms counter-swing, phase advances 1.8 cm per half step (feet never slide). Turning = `scale.x` flip between front and back drawings, never `rotation.y`. Jumps: parabolic arcs, squash at take-off and landing, a paper puff.
- Page turn: 40-segment strip, φ = θ·(1 − L·(s − ½)), bend L = 0.55·sin(πu), eased with `eio` over 2.3 s.
- Never moves: the room.
- Camera: one virtual macro camera keyed as position/target/fov/aperture/focus with monotone-cubic interpolation; a new key list = a hard cut. FOV 30° (56° for the reverse shot, 32° for the desk wide). In-book: camera 5–10 cm above the page, 30–45 cm back, aperture 2.2–2.5 (shallow); 3/4 spread view aperture 1.8–2; emotional push-in to 28 cm (aperture 2.5); desk-level at aperture 4, focus ~0.52 m. Vocabulary: eye-level macro track; pull up to a 3/4 view of the spread; descending dolly from human height; push-in on a face; reverse shot from inside the book to the blurred room; rack focus paper ↔ real object; top-down over the spread; locked frame on a pull-tab; rising crane leaving the book small.
### Transitions and rhythm
- Transitions: real page turns (old pop-ups fold down while new ones spring up; front of the leaf = old ground, back = new sky), a book closing and reopening, a hard cut on a paper sound; never a video dissolve inside the book; no cuts inside a spread.
- Rhythm: picture-book narration (15 lines of 2–9 s in the demo); music bar-aligned with one internal jump cut (multiple of 4 beats, 0.42 s crossfade, chosen by chroma + MFCC self-similarity) so the track's real ending lands on the key picture event. Silence = the book held still with only room tone. Demo 133 s (7980 frames at 60 fps).
### Finish
- Neutral tone mapping (ACES shifts paper colours), sRGB output.
- Hand-made DOF: CoC = aperture × (1/focus − 1/z) in pixels, max CoC 14 (demo; default 18), 64-tap golden-angle spiral gather with far-sample spread capped at the centre's own CoC (no background bleed over sharp foreground).
- Bloom (UnrealBloomPass) strength 0.2, radius 0.5, threshold 1.6.
- Vignette amt 0.35 (smoothstep 0.25–0.85, aspect ×1.25), warmth mixes toward (1.06, 1.0, 0.9).
- Grain in ffmpeg: `noise=c0s=2:c0f=t+u` (temporal, uniform, strength 2); x264 CRF 17, slow, 60 fps.
- Shadows: spot shadow map 4096², bias −6e-5, normalBias 4e-4; PCF soft shadows. Leaves: emissive map = colour map, emissive 0.42 (so turning pages don't go black).
### 3D look (if any)
- Real world: Poly Haven `lythwood_lounge_2k.hdr` as environment and background (blurriness 0.22, yaw 2.3), walnut veneer (tint `#c9a88a`, env 0.8), CC0 props (desk lamp, teacup, alarm clock, pencil, potted plant), dust motes in the lamp beam; warm practical lamp that brightens as a story beat.
- Paper world: all flat textured planes (cards) with alpha cut-outs, paper-coloured backs and cut-out-shaped shadows; nothing modelled round. Directional "sun" `#fff3e0` intensity 2.6 in the minimal example.
- Blender mapping: image planes with alpha (Alpha Clip / hashed) and a separate back material, shadow from alpha; pop-ups as hinged empties with back() keyframes; macro camera with real metric scale, f-stop shallow; HDRI world with blurred background; compositor DOF/bloom/vignette; avoid Filmic/AgX if it shifts paper colours (use Standard).
### Banned
Not a papercut silhouette film (no one-colour lace, no backlight); not a 3D cartoon (nothing modelled round); not claymation (paper never squishes); never neon; no black ink (dark brown only); no perfect geometry; no `rotation.y` turns (edge-on card, blank back); no rectangle shadows; no ACES tone mapping; no video dissolves inside the book; never copy Paper Mario or Sabuda/Reinhart characters, logos, UI or music or name them; no near-lens pop-ups filling the frame with blur; the room never moves.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/paper-popup.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/paper-popup/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/paper-popup/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/paper-popup.mp4
### Gaps
No vertical framing guidance; aperture values are in the engine's own units, not f-stops; the demo runs 60 fps while the library default is 24 (no rule on which fps to use otherwise); demo music is licensed, not original.

## Tilt-Shift Miniature
- Source: `lemomo-ai/lemo-opuscar` `styles/tilt-shift/STYLE.md`, `DEMO.md`, `style.json` (No. 42, Materials & 3D); colour constants also checked in `demo/main.js`, `demo/sky.js`, `demo/post.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0 (credit LemoLab); third-party assets per `demo/CREDITS`
- One line: a photoreal place seen from high above through a tilted lens and a time-lapse clock, so the whole world reads as a tabletop model railway.
- Suits: city promos, real estate, transport, logistics, "a system with many small actors and one tiny actor it bends around", day-in-the-life of a place. Real footage: no (procedural three.js town). 3D: yes, required (three.js r170 here; maps to Blender). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| park green | `#6fa24a` | parks (demo) |
| asphalt | `#4b4e53` | roads: dark ground so markings and vehicles pop |
| dawn east fill | `#ffb48c` | pink-orange low fill from the sunrise side |
| sign green | `#0f5e3c` | subtitle road-sign panel, end card |
| traffic-light housing | `#1b1f24` | subtitle icon |
| lamp red / amber / green | `#ff4a3d` / `#ffc233` / `#3dff8a` | icon lamps; `#ffc233` = `×24 TIME-LAPSE` readout, `#3dff8a` = `×1 REAL TIME` |
| clock plate | `rgba(12,16,20,.55)` + `rgba(255,255,255,.5)` 2 px keyline | HUD clock panel |
| crowd figures | `#e8463c` `#2f5fb3` `#f2c230` `#f4f4f0` `#2a2d33` `#3f8f5a` `#e07bb0` `#f08a2c` `#6fb7e0` `#7a4a8c` `#c9c2b4` `#1f3b66` | 0.5 m colour capsules (model-railway figures) |
| parked cars | `#f4f4f0` `#2a2d33` `#c9ccd0` `#1f4e9c` `#b8272c` `#8a8f96` | white, black, silver, blue, red, grey |
| taxi | `#f2c230` | yellow taxis |
| sky keys (sky.js) | e.g. night `#0b1633`, dawn orange `#ff7a3c`, day zenith `#4f7fc4`, horizon `#f8c690` / `#ffb877` | clock-driven sky/fog gradient |
Rules: saturated, sunny "freshly painted model": pale warm facades (warm whites, cream, terracotta, brick, pale yellow, mint, sky blue) with a few candy accents, very saturated greens, dark ground. Shadows stay blue and clean, never grey. Only night and dawn are low-saturation; dawn must read as early morning, not midnight. The subject should be the one saturated thing in the sharp band, or move against the flow.
### Typography
- Subtitles belong to the world's signage: demo uses **Overpass** 600, 44 px, white, on a rounded `#0f5e3c` road-sign panel with an inset white keyline and a tiny traffic-light icon lit green, 118 px above the bottom, inside the lower blur band (1920×1080). Overpass is a Google Font (Highway Gothic revival).
- Time-lapse clock top-left: **Overpass Mono** (Google Font) 600 46 px for `07:12`, 500 24 px for seconds, Overpass 700 19 px for the speed readout `×24  TIME-LAPSE` (amber) / `×1  REAL TIME` (green); plate 212×92 px at (56, 52), radius 14.
- Titles live in the world: letters on a roof, sign or field; the demo's title is an in-world neon sign lighting one letter per 8th note, with a road-sign tag.
- Hold ≥ max(1.8 s, speech + 0.6 s) (code: `max(voice + 0.7, 1.9)`); case: the HUD is upper case; emphasis via the sharp band, not type.
### Layout
- Stay high: oblique views at 45–55° pitch, 100–200 m from the subject (demo 110–200 m), ~27–30° vertical FOV; straight top-down for the "board game" look.
- Close-up exception: camera ~1.7 m up, 6–8 m away, ~12° pitch, 17° FOV, near plane 0.08 m; actors fill ~1/4–1/3 of frame height, a blurred foreground object frames them.
- The sharp band carries the subject; vehicles and people stay tiny. Subtitles sit in the lower blur band, HUD top-left.
- Low to mid-rise buildings at 45°+ pitch so streets stay visible; route the subject on the camera-side lane.
### Elements
- In-world signage (road signs, platform boards, harbour notices) as the caption system; HUD clock with speed readout; neon roof sign for titles.
- Long-exposure light trails (head/tail ribbons) at dawn/dusk.
- Model-like detail: several window types (punched / ribbon / curtain-wall / brick), 1.6–3 m bays, dark reveals, world-space grime, sky-reflective glass (roughness 0.08–0.22, metalness 0.35), walls darkening toward the ground, roof clutter, awnings, worn markings, manholes, oil stains; vehicles with dark glass, soft contact shadow, brake lights.
- People as 0.5 m colour capsules; close-up actors organic with sheen, 20–30 % larger than real.
### Motion
- **Time-lapse stutter**: the whole world (vehicles, people, lights, sun) updates at a low rate and holds: 8 Hz in fast-forward (= 3 frames at 24 fps = a 16th note at 120 BPM), 12 Hz between ×2 and ×6, smooth below ×2. The camera stays smooth every frame.
- Speed: ×24–×40 fast-forward; the native "speed drop" ×40 → ×1 during a camera dive.
- Simulations pre-computed per clip: IDM car-following, lights on a 96 s cycle, "don't block the box", crowds gather on red and surge on green (closed-form); cycle offsets chosen so changes land on bar lines. Hero actors are art-directed on scripted paths fitted through beat times.
- Close-up acting: anticipation squash (0.28 s) → stretch jump → land squash → settle; a failed attempt before success.
- Camera vocabulary: high oblique wide with a very slow slide; band follows one subject; rack the band between subjects; slow push on an intersection/station; straight top-down slowly rotating; continuous dive from high to actor height with a speed ramp (look target eases out faster than position); band narrowing to a sliver; vertical rise with logarithmic height (demo 40 m → 820 m) through a thin cloud layer; lateral track along a rail/river/road; locked frame across hours.
### Transitions and rhythm
- Cuts on the beat, speed ramps, dives and rises; avoid dissolves (they reveal the fake lens).
- Each time-lapse clip is its own shot (sun azimuth cheated per shot).
- Demo: 38 s, 912 frames, 120 BPM so the 8 Hz stutter is exactly a 16th note; tape-stop (varispeed 1 → 0.22) into true silence at the real-time drop.
### Finish
- Tilt-shift DOF (`demo/post.js`): CoC px = `mix(aper·(1/focus − 1/z), sign(dy)·amp·(max(0,|dy|−w)/0.5)^1.2, mix)`, clamped 30 px; demo band half-width `w` 0.055 (0.035 on the narrowest moment), `amp` 30, `mix` 0.55–0.7, `aper` 5000–9000; 128 spiral taps with per-pixel rotation, gathered at output resolution after a 2× supersampled render; far samples must not bleed onto near sharp ones. The band is projected to the subject every frame (`band.follow`).
- Bloom: UnrealBloomPass strength 0.25, radius 0.6, threshold 1.2.
- Grade: NeutralToneMapping, saturation ×1.55 (shader default 1.35), soft contrast +0.42, slight warm highlights (tint multiplier toward (1.07, 1.0, 0.88)), vignette 0.3; lower saturation at night.
- Grain at mux: 1 (light).
### 3D look (if any)
- Photoreal procedural town (three.js): hard sun with sharp shadows (4096 shadow map fitted per shot), low hemisphere fill ~0.6 with warm ground bounce, sky-gradient environment map for glass and paint, GTAO over everything, fog from the clock-driven sky.
- Dawn: sun ~3.5° below the horizon, pink-orange east fill `#ffb48c`, ~9 % of windows lit, sodium street-light pools (dense, large, faint, or they read as bubbles).
- Ducks: lathe-turned, `MeshPhysicalMaterial` sheen 1, sheenRoughness 0.55.
- Blender mapping: Sun light + sky texture, AO, camera DOF won't give the band; do the band as a compositor/screen-space mask blur driven by a projected subject position; Simple Subdivision-free low-detail figures; Geometry Nodes for facades/traffic; stepped object animation via constant interpolation at 8/12 Hz while the camera keyframes stay smooth.
### Banned
Not a toy/clay render (world is photoreal; only lens and clock make it small); not a game's top-down view (no UI, no clean flat shading); not drone footage (band, saturation and stutter are mandatory); no street-level shots except the deliberate close-up; no dissolves; no grey murky shadows; one fixed sun across all shots (leaves half the film backlit); no real landmarks, brands or logos; don't copy *The Sandpit*'s places or music; no generic piano and strings; don't step the camera.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/tilt-shift.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/tilt-shift/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/tilt-shift/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/tilt-shift.mp4
### Gaps
No vertical-frame guidance (a horizontal band in 9:16 would be a much thinner proportion); facade hexes not given (only named colours); no type sizes beyond the demo's; vignette only as an amount (no radius/softness); bloom/grade values are code-only.

## Low-poly Isometric Island
- Source: `lemomo-ai/lemo-opuscar` `styles/lowpoly-island/STYLE.md`, `DEMO.md`, `style.json` (No. 43, Materials & 3D); licence: MIT (docs/code), demo film/stills CC BY 4.0 (credit LemoLab); third-party assets per `demo/CREDITS`
- One line: a tiny faceted pastel world under an orthographic isometric camera, where every piece that appears arrives with a bounce and a note.
- Suits: game trailers, world building, calm content, "something grows" stories (a startup's first year, a neighbourhood, a reef), a day/season cycle. Real footage: no. 3D: yes (three.js orthographic; maps to Blender with an orthographic camera). AI images: no.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| sand top / side | `#f3dfab` / `#e2c68e` | hex tile cap / column |
| grass | `#93c96c`, `#7fbd62` | tile caps |
| earth side | `#c99c6e` | grass tile columns |
| rock | `#b4b8bd` / `#8f949c` | peak caps / sides |
| walls | `#fbf3e6` `#f5c2b0` `#b5dccb` `#a9cbe8` `#f7df8f` `#e9c9e6` | box houses |
| roofs | `#d9644a` `#4f7fb8` `#e0874f` `#6a5a8e` `#3f8f86` | gable prisms |
| pines | `#3f8a5a` `#4f9c63` | cone trees |
| leaves | `#7fc36a` `#9ad06f` | icosahedron trees |
| warm windows | `#ffc676` | emissive, the only bright things at night |
| lighthouse | `#f6f2ea` / `#d9544a` | white/red rings |
| dawn (zenith / horizon / deep / shallow) | `#9fb6cf` / `#f3d2c4` / `#4f8ea3` / `#8fc9c4` | time-of-day keyframe |
| day | `#88c8e8` / `#eaf5f2` / `#38a5bc` / `#86e2d4`, sun intensity 2.7 | keyframe |
| dusk | `#6f6fa8` / `#ffa888` / `#5a6a9e` / `#b08aa6`, sun `#ff9a68` at 8° elevation | keyframe |
| night | `#12163a` / `#4a4478` / `#23264a` / `#363a66`, moon `#a9b0e8` at 0.9 | keyframe |
| subtitle text | `#fffdf8` | with a navy drop shadow |
Rules: pastel, low contrast, a handful of hues (one ground family, one neutral rock, a small repeated set of wall/roof colours). Time of day is a keyframed colour set (zenith, horizon, deep, shallow, sun colour, intensity, elevation, azimuth) interpolated; night desaturates toward blue-violet with warm emissives the only bright things. No outlines, no black: shadows and AO are the only darks.
### Typography
- Subtitles: **Quicksand** 600 (Google Font), 44 px, `#fffdf8`, no box, soft navy drop shadow (blur 14), centred 118 px above the bottom (frame 1920×1080; demo rendered at 3840×2160 and downsampled). A small flat-shaded hex icon beside them whose top colour follows time of day (dawn pink, day grass, dusk orange, night window-yellow). Shown from 0.05 s before the line; hold ≥ max(1.8 s, speech + 0.6 s), never overlapping the next line or a title.
- Titles: **Josefin Sans** (Google Font) 600, all caps, 78 px, 16 px tracking; letters rise one by one 55 ms apart from under a thin water line, overshoot and settle; a 300-weight lowercase sub-line.
- Text cards over the world leave a gap where the world stays visible.
### Layout
- Orthographic camera, azimuth 45° default; elevation 30° (build), 33–35° (day detail), 20–25° (night: widens the sky band so stars show), ~50° (map-like, beam sweep).
- Frustum height is the zoom: 5–7 for close-ups, 12–16 for the whole island, up to 420 for the final scale reveal. Camera distance ≥ 3 × frustum height.
- Horizon/sky band stays in the top third at any zoom; lots of empty space and negative space (night: island lower left, one tiny light far out).
### Elements
- Pointy-top hex columns (`CylinderGeometry(r, r, h, 6)`, axial → world `x = √3(q + r/2)`, `z = 1.5 r`); terrain height encodes material: sand 0.36–0.42, grass 0.74–0.9, hills 1.1–1.4, rock peak 1.95; top cap 0.16 thick, side column sunk 0.1 below it; 1.5 % gap between tiles; lightness jitter ±4 %.
- Props as primitive assemblies: box houses 0.92 wide, 0.62 per floor, gable prism roof (overhang 0.08); windows = small quads with their own emissive material per house; 6-sided cone pines, icosahedron (detail 0) broadleaf trees, 3-sided-cone palm fronds; windmill; dock planks; pinched-box boat + triangle sail; lighthouse of 4 tapered 8-sided rings.
- Light beams: camera-facing Gaussian ribbon + a halo copy 2.4× wider at 0.32 strength, tilted 7° down.
- No HUD; title, subtitles and end card only.
### Motion
- On ones (24 fps), smooth; the charm is the arrival curves.
- **Rise from below**: 0.5 s cubic ease up, overshoot `sin(13 s)·e^(−7 s)·0.18`; a hex splash ring + 14 droplets 0.12 s before it settles; the event time is the settle.
- **Drop and stack**: fall 2.4 units in 0.22 s (ease-in), bounce `|sin(15 s)|·e^(−9 s)·0.22`, squash `1 − 0.16·e^(−12 s)·cos(26 s)` on Y with volume preserved.
- **Pop**: scale `1 − e^(−9 s)·cos(17 s)` (~25 % overshoot).
- Life: mills turn, chimney smoke, three gulls circle, boats bob with the same wave function as the water.
- Growth on the music grid: at most one piece per smallest slot (16th grid); accelerate by density (halves → quarters → eighths), not tempo.
- Never moves: the projection (no perspective or FOV change).
- Camera vocabulary: turntable (demo +45° azimuth over ~5 s with slow zoom-out), pure orthographic zoom (demo ×25 at the end), elevation change, locked 3/4 wide, tight close-up on one arrival (demo elevation 23°, frustum 5.2; 26°, 6; 27°, 6.6), side angle trailing a mover (never toward the lens), lateral truck along a row, time-lapse sun sweep with camera still (demo sun 100° in 2.5 s). Climax: high 50° turning at 0.22× the beam speed, easing down to 25° so the sky "rises".
### Transitions and rhythm
- Hard cuts on the beat, a time-of-day change, a zoom through the sky; no dissolves, no perspective whip-pans. Intercut wide (shape) and close (bounce) on beats.
- Demo: 53 s, 1272 frames, 96 BPM, D major pentatonic feel; windows light one per eighth note at dusk; lighthouse beam one turn per 12 beats, one ring cell per beat (12 cells at 30°), replaying the build's notes in spatial order; digital zero on the music bus for the last half-beat before the climax downbeat.
### Finish
- Post chain: MSAA + depth → GTAO (radius 0.7, scale 1.5; mandatory, draws tile seams) → sky/haze composite (linearised ortho depth blended into a vertical screen gradient; haze start/end as fractions of frustum height × cot(elevation)) + hash-grid twinkling stars where haze is thick → very light tilt-shift at the frame edges (max 3 px) → bloom (threshold 0.95, strength 0.22 day / 0.5 night) → pastel grade (sat 1.04–1.1, soft contrast, small blue lift at night) → Neutral tone mapping. Supersample 2× (rendered 3840×2160).
- Grain 0 (flat colour shimmers with grain).
### 3D look (if any)
- `MeshStandardMaterial({ flatShading: true, roughness ≈ .9 })` (demo .88), no textures; hard flat facets that re-colour with the sun.
- Water: dense non-indexed 220×220 plane, 200×200 segments, four summed sines (amplitude ≈ 0.2), flat-shaded, roughness 0.55 (not lower or facets flash white); coarse 5000-unit plane 0.55 below for zoom-outs; per-frame 512² shallow-lagoon map where land exists; surf ring 0.99–1.12 r at opacity ≈ 0.32; the sea receives no shadows.
- Keep the sun sideways to the camera in key shots (low sun behind the target turns water into glare).
- Blender mapping: orthographic camera with Orthographic Scale as "frustum height"; flat shading (Shade Flat), Principled roughness ~0.9; AO/GTAO via EEVEE AO or Cycles AO pass; sky gradient as a compositor mix over Z/mist pass rather than a world horizon; emissive window materials per object; Geometry Nodes for hex grids.
- Gotcha: shared post code using `perspectiveDepthToViewZ` breaks DOF/AO with an orthographic camera; use `orthographicDepthToViewZ`.
### Banned
Not a voxel game (no cubes-of-cubes, no pixel texture); not a tilt-shift photo of a real place (no perspective, no photo detail); not a smooth-shaded 3D cartoon (no rounded normals, no subsurface); no outlines or black; no textures; no dissolves or perspective whip-pans; no piano, no strings; no grain; never copy *Townscaper* / *Monument Valley* grids, buildings, characters, UI or type, never name them; two pieces in one grid slot (muddies the melody); movers heading at the lens.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/lowpoly-island.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/lowpoly-island/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/lowpoly-island/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/lowpoly-island.mp4
### Gaps
No vertical-frame layout (the "sky band in the top third" rule would need rechecking at 9:16); no bloom radius; grade contrast amount not numeric; tilt-shift band shape not given beyond "frame edges, 3 px".

## Glass Product Render
- Source: `lemomo-ai/lemo-opuscar` `styles/glass-product/STYLE.md`, `DEMO.md`, `style.json` (No. 44, Materials & 3D); licence: MIT (docs/code), demo film/stills CC BY 4.0 (credit LemoLab); fonts and credits per `demo/CREDITS`
- One line: a fictional glass-metal-and-light hero object floating in an infinite black studio, strip lights drawing white rainbow-edged outlines, light running inside it, every move landing on the beat.
- Suits: product launches, consumer tech, beauty, "make the invisible thing the product does visible as light inside glass". Real footage: no. 3D: yes, required (three.js physical transmission; maps well to Blender Cycles/EEVEE glass). AI images: no. The object must be fictional.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| accent start | `#62DCFF` | ice-blue light: emission, comet pulses, caustic rings, subtitle top line |
| accent end | `#A98BFF` | soft violet: the pulse hue drifts toward it with age |
| clear-glass attenuation | `#f3f8fb` | at 160 mm distance (near-neutral) |
| frosted-glass tint | `#eef2f5` | milky frosted parts |
| light guide | `#15181b` | dark polished acrylic, clearcoat 1 |
| background sweep | `#34383d` → `#16181b` → `#000` | radial at 0–1.1, separates glass edges |
| studio | black | everything else neutral: greys, white strip reflections, metals' own tints |
Rules: neutral world; one accent colour family reserved for light, optionally drifting between two neighbouring hues (examples: ice blue → violet; amber → rose; green → cyan), chosen from what the product does, never from a brand. Emitters inside frosted glass stay cool-white and dim. Dispersion rainbows only at thick glass edges and in the caustic, never as a gradient on surfaces or type.
### Typography
- One licence-free grotesk; demo **Inter Tight** (Google Font).
- Titles: Inter Tight 200 (ultra-thin), 112–132 px (rule 100–140 px), very wide tracking 56–64 px, centred in the upper third; a diagonal glint sweeps the letters in sync with the sweep light on the object.
- Kickers and credits: small tracked caps 18–20 px, tracking 8–10 px ("A GLASS PRODUCT FILM", "MEET").
- Subtitles: Inter Tight 300, 40 px (rule 36–44 px), tracking 1 px, near-white, on a frosted-glass slab: centred rounded bar 76 px tall, radius 38, filled with the live frame blurred (`blur(18px) brightness(1.25)` + 10 % cool white, canvas `preserveDrawingBuffer: true`), 1.2 px gradient stroke, blue → violet accent line on top. Hold ≥ 1.9 s and ≥ speech + 0.7 s (rule ≥ max(1.8 s, speech + 0.6 s)).
- Product name and slogan are title cards, not subtitles. Sizes at 1920×1080.
### Layout
- One hero, centred or on a strong diagonal, never cropped by the frame edge in a wide.
- Exploded view: axis ~40° to the view so parts form a diagonal with depth, spanning ~80 % of frame.
- Titles in the upper third; end pull-back into negative space makes room for type; no horizon line.
- Each shot is its own presentation stage: no spatial continuity needed between shots.
### Elements
- No HUD, no wireframes, no UI. Frosted subtitle slab; title glint; caustic rings on the floor.
- Image treatment: none (no footage); the object's internals (metal bands, PCB with gold traces, diaphragms) act as ornament seen through glass.
### Motion
- Everything on ones (24 fps), eased: ease-in-out for orbits, ease-out for parts decelerating into a float, ease-in for a snap back.
- Camera always drifts (slow orbits/push-ins); never locked, never handheld, except two frames of micro-shake on an impact.
- Demo camera orbits 0.2–0.4 rad per shot; high 3/4 orbit 40° while the lid opens; macro 25–45 mm away with rack focus from glass surface to the part inside.
- **Exploded view and snap**: parts spread along the axis (~2× product size), tilts `sin(i·1.7)·0.32`, `cos(i·2.3)·0.28`, spin proportional to offset; 3 s ease-out apart → 0.75 s hover (drifting +3 %) → **0.25 s ease-in snap** exactly on the downbeat; camera pushes in ~40 % during the 0.9 s after the snap; light pattern first lights in the snap frame.
- Magnetic lift 1.2–1.4 s (ease-in-out); objects lift out of cradles tilted toward camera and settle upright; lids hinge at the back and stand at ~100° behind as a backlit halo.
- Light pulses ("comets") along a UV axis: Gaussian head σ = w/2, exponential tail length 4w at 55 %, white-hot core head³ × 0.35, hue drifting with age; idle emission ≈ 0. Pulses and sweeps are beat-grid events (demo pulses follow the 808 pattern [0, .75, 1, 1.5] per bar).
- Camera vocabulary: sweep over a dark object with a slow push (contour before content); slow high 3/4 orbit; macro rack focus; side macro orbit; exploded view orbit; straight-on front with slight push (declaration); top-down macro; top-down on the floor (caustics); low orbit under the object (monument); slow pull-back into negative space.
### Transitions and rhythm
- Cut only on beats (bar lines where possible), or a sweep passing through black; never dissolves or wipes.
- Demo: 32 s, 768 frames, 120 BPM minor; half a bar of total silence (reverb tails cut) with a reverse whoosh before the drop; opens and ends with the same sweep (bookend); hook within 3 s.
### Finish
- 2× supersampling; physical DoF (demo aperture 700–900 for macro, 70 for exploded view, 160–300 for wides); bloom only above ~1.1 (strength 0.16–0.3); **Neutral tone mapping** (AgX washes accents to white), exposure 1.1; grain 0.
- Floor: black gloss, blurred mirror (Reflector with a 12-tap blur, ×0.32), radial fade into the background; procedural caustics (lens ring with R/G/B radii offset, warped Voronoi filaments, rings spreading from events).
### 3D look (if any)
- **Studio = strip-light scene baked to PMREM every frame** (`pmrem.fromScene(env, 0, 1, 1000)`), not an HDRI. Strip kit (mm, intensity): left & right tall strips 22×170 at ×3.2 (silhouette, behind); horizon strip 260×14 at ×1.4 (rim); top box 160×70 at ×1.1 (volume); low front card ×0.18 (0 when concave glass faces camera); top-front key 150×60 at ×2.5 for exploded views only; **sweep strip** 26×240 on an arc ±1.35 rad behind the camera (azimuth = camera + π); accent card tinted by and driven by the pulses.
- Clear glass: `MeshPhysicalMaterial` transmission 1, roughness 0.015, IOR 1.52, thickness 3–4.5, dispersion 5, attenuation `#f3f8fb` at 160 mm, DoubleSide.
- Frosted glass: transmission 0.82–0.9, roughness 0.4, tint `#eef2f5`, thickness 7–14, with an opaque emissive disc inside (else it reads as dark plastic on black).
- Metals: satin titanium (roughness 0.16), mirror chrome (≥ 0.14; 0.05 blew out to a white disc), brushed steel and champagne diaphragm via concentric-brush roughness map, graphite PCB with gold traces. Anything inside transmissive glass must be opaque.
- Model in mm, near plane 1.
- Blender mapping: emissive plane "strip box" world instead of an HDRI; Principled BSDF transmission 1, roughness ~0.015, IOR 1.52 (Cycles gives real dispersion only via per-channel IOR tricks/thin-film; caustics need Cycles with shadow caustics or a fake projected texture); glossy black floor with roughness for the blurred mirror; a keyframed sweep emitter plane orbiting behind the camera.
### Banned
Not a white-cyclorama catalogue shot, not a wireframe HUD, not a keynote slide; never a real product silhouette, brand, logo, typeface or UI; no photo-studio HDRIs (messy streaks); never paint a 2D highlight; no AgX tone mapping; no coloured emitter inside frosted glass; no rainbow gradients on surfaces or type; no locked-off or handheld camera; no dissolves or wipes; no piano-and-strings; no grain; never a product name alone as a voice line; exploded views seen perpendicular to the axis; pure profiles (read as mushrooms/pot lids); the demo also avoided stemmed earbuds, dot-matrix type and a red accent.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/glass-product.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/glass-product/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/glass-product/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/glass-product.mp4
### Gaps
No vertical-frame guidance; caustic shader parameters not numeric in the docs; no shot-length numbers beyond the demo's timings; title glint shape/width not specified.

## Memphis Diorama
- Source: `lemomo-ai/lemo-opuscar` `styles/memphis-diorama/STYLE.md`, `DEMO.md`, `style.json` (No. 71, Materials & 3D; contributed by **@EianLu**, Eian made the style and its demo); frame and type constants checked in `demo/memphis.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0 (credit LemoLab; the demo's sign-off also credits Eian); fonts OFL
- One line: a place built as a tabletop model on warm white paper, inside a grainy organic frame: flat Memphis colours, indigo ink outlines, hard purple shadows with halftone dots, and small motions everywhere under a slow camera.
- Suits: web heroes, ambient/focus loops, live wallpapers, seasonal/solar-term series, "how things work" cutaways, city data maps. Real footage: no. 3D: yes (three.js r170 with flat materials, shadow map and outline pass; maps to Blender with toon/flat shading + Freestyle or an outline pass). AI images: no. No characters acting (people are distant decoration).
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#FFFCF6` | ground outside the frame; nothing else drawn there |
| ink | `#25214A` | outlines, tyres, window frames (and section hatching) |
| shadow tint | multiplier (0.70, 0.58, 0.90) | hard cool-purple shadows |
| window / lamp light | `#FFD36E` | every light is the same warm yellow |
| warm pool | `#FFE3A3` | lamp-pool warm (shader uniform) |
| window day glass / dark | `#BFE4FF` / `#2C2752` | windows by day / unlit at night |
| dusk layer | about `#FF9E7A` | orange-pink on the way to night |
| type line 1 / 2 / 3 | `#2B2840` / `#8D8AA0` / `#B7B4C6` | title (dark), sentence (grey), data (light grey) |
| marks | `#FFC93C` dot, `#FF7FAA` triangle, `#2E5BE6` zigzag | three Memphis marks above the type |
| example hues | yellow `#FFD234`, pink `#FF7EB3`, sky `#5CC8FF`, mint `#5EDFB0`, lilac `#B9A0FF`, peach `#FF9C6B`, cobalt `#2F5BFF`, coral `#FF5A5F`, green `#2FCB7A` | STYLE.md example palette |
| grass (spring/summer/autumn/winter) | `#9DE8A6` `#6FD889` `#D6E68E` `#FBFCFF` | demo seasonal material |
| paddy | `#A6E3FB` `#A4E35F` `#F2C14E` `#FBFCFF` | striped |
| water | `#8ED8F7` `#72C9F3` `#7BBFE8` `#9FD0F4` | with a deeper channel |
| winter field ridges | `#DCD0F2` | lilac |
| crowns (pink set / white set) | `#FFB8D9 → #3CBE7E → #FF6F61 → #E6DCFF` / `#FFF1F7 → #2FCB7A → #FFD21F → #D6EAFF` | per season |
Rules: 5–7 saturated hues + 2–3 pastels; flat fills, no gradients. Cluster colour by area (a field type about a third of the ground), leave large calm single-colour areas. Day bright and warm. Night is a luminance shift toward violet (never grey all over; demo dusk stops at night = 0.62, max ~0.8). Seasons and time change only the large areas (ground, crowns, roofs, water). Winter is not all white: pastel lilac, ice blue, mint crowns with white dots.
### Typography
- Latin **Inter Tight**, Chinese **Noto Sans SC**, data **IBM Plex Mono** (all Google Fonts, OFL; subset via the CSS2 `&text=` API).
- Three centred lines under the frame (1920×1080): line 1 title 600, 25 px, `#2B2840`; line 2 one sentence 400, 18 px, `#8D8AA0` (21 px 600 dark when it must not be missed); line 3 small data (time, solar term, place, coordinates) mono 400, 15 px, `#B7B4C6`. Baseline `y0 = FRAME.cy + FRAME.hh + 64` (= 904); lines at y0 + 34, + 64, + 91; three marks at y0.
- Bilingual layout: line 1 Chinese, line 2 English, each one line, never wrapped; cross-fade both ~0.4 s out, 0.4 s in; marks stay at full strength. Empty lines leave their place empty (others don't move up).
- No voice by default (the type is the narration); with a voice, plain bottom subtitles (one Chinese, one English line), no caption boxes. Hold ≥ max(1.8 s, reading time + 0.6 s).
- Callouts: rounded pill + leader line + dot, Chinese main and English small, popping out with a back-ease, fading when done.
### Layout
- The picture lives in a rounded organic frame about 1520 × 744 px, a little above centre: `FRAME = { cx: 960, cy: 468, hw: 760, hh: 372, r: 34 }` (1920×1080). The type sits under it and never covers the subject.
- Model-maker's eye: high three-quarter, top-down or cutaway; always a place, never a person.
- Screen space holds only the grainy frame, the bottom type and explainer callouts. Keep large quiet areas of colour so the picture breathes.
### Elements
- Detail is built, not textured: a house = plinth, plank-striped walls, white corner trims, two roof slabs and a ridge, gable with a round window, framed windows with shutters and flower boxes, door with step, awning and lamp. Trees: trunk + branch + lobe cluster, lighter lobes on the sun side, at least five crown shapes (cloud, round, egg, three-tier cone, column). Water layered: bank, shallows, deeper channel, white foam lines, drifting white squiggles.
- World-space patterns (`pat`: 1 dots, 2 diagonal stripes, 3 zigzag, 4 vertical stripes, 5 hatch, 6 horizontal stripes), pattern scale growing with distance.
- Lamp = flat warm colour + hard-edged warm pool disc on the ground (1.5 cm up, no outline, no shadow).
- Cutaway section faces: `pat: 5` hatching in a colour one step darker, never hollow.
- Three Memphis marks: yellow dot (r 5), pink triangle (11 px), blue zigzag (2.2 px stroke, round caps).
### Motion
- **60 fps, every frame moves**; no stepping, no jitter. Only the frame's grain boils at 12 fps (grain changes every 5 frames).
- Everything eases; vehicles accelerate, brake and nod; turns follow smooth curves.
- Natural motion procedural and looping (water, trees, cloud shadows, leaves, snow, smoke, flocks), each object with its own phase.
- Things never pop: they grow from nothing or bounce in with a back-ease.
- **Squash and spring** announces a state change: in the demo the big tree squats for half a second (8.8–9.3 s) and springs back, then the wave spreads from it.
- **Wave**: a ring from one point; inside it colours swap per pixel (`setSeason(x, z, r)`; example speed 12 m/s); objects act as the ring reaches them (`at(n, p)` gives 0 → 1 per position).
- **Grow the frame**: the organic frame opens from the centre (demo 0–1.2 s) and draws back in (44–45 s); can close and reopen as a chapter break.
- Never moves: frame position, type position, paper, sun direction.
- Camera: prefer one continuous take; high slow orbit/drift, straight-down slowly turning, locked three-quarter, lateral move along a cutaway, slow push to one detail, following one vehicle. Demo: orbit at FOV 30°, starting 92 m out and 70 m up, slowly closing in, easing down to 0.3× speed after 18 s so the subject stays in frame. Never pass through geometry (rise, then travel).
### Transitions and rhythm
- Only three transitions: the frame draws in and grows out again; a wave sweeps across (colour, light, season); the ground is cut open (cutaway, near part leaving in two steps: lid lifts then slides back, or wall/slab sinks straight down). No white flash, spin or fast hard cut.
- Demo: 45 s, one take, ten seconds per season; F major, 96 BPM, bar = 2.5 s, downbeat of bar 0 at 1.8 s so the three squats land on bar downbeats (9.3, 19.3, 29.3 s); bottom-type lines change halfway through each wave (10.45, 20.45, 30.45 s); dusk windows light one by one with twelve celesta tings on F-pentatonic notes.
### Finish
- Outline post pass from normals and depth: about 2 px deep indigo `#25214A` at 1080p (rendered at 2×); no outline on light cones, decals, particles and thin stems.
- Halftone in the shade: staggered world-space dot grid (cell 0.38 world units, dot radius 0.2 of a cell, every other row offset half a cell) of lighter dots inside shadows.
- Grainy organic frame: rounded rect (radius 34) whose edge is displaced by fbm noise (±22 px at 1/170 scale + ±5.5 px at 1/38) plus cubed hash grain (×40), reseeded every 5 frames; open/close by a noisy radial mask.
- Three tones only: top face brightest, sun sides base colour, away faces ×0.5–0.95 (shader 0.95). Hard shadows, never blurred.
- Never: depth of field, real reflections, bloom, motion blur, volumetric light. No added grain at mux.
### 3D look (if any)
- three.js r170, PCF shadow map, sun direction fixed for the whole film, flat custom shader material (`flat(hex, o)`) with pattern, second-state colour (`col2`) for waves, night colour, emissive and facade-window options; antialias off with 2× render.
- Hero objects do not receive shadows as they pass through shade.
- Blender mapping: Shader-to-RGB / constant-colour toon materials with three face tones, hard sun shadows tinted via a shadow-colour mix, Freestyle or a normal/depth outline in the compositor (~2 px indigo), world-space procedural dot/stripe textures (object or world coordinates), a Z-mask for the frame with noise, and a sphere-mask driven colour swap for the wave (attribute or shader driven by an empty's radius).
### Banned
Not character animation (no faces, gestures, acting, close-ups of people); not an isometric infographic (cool, diagrammatic); not tilt-shift (no photo, no DOF); not low-poly (no faceted shading or plastic highlights); no gradients; no DOF, reflections, bloom, motion blur, volumetrics; no stepping except the frame grain; no white flash, spin or fast hard cut; colours sprinkled at random; grey nights or grey days; yellows going olive at night; identical trees; outlines on thin objects (ink scribbles); camera passing through objects; a state change with no cause; a medley score (keep one piece, change only accompaniment thickness); styled caption boxes; copying Memphis Group objects, layouts or palettes.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/memphis-diorama.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/memphis-diorama/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/memphis-diorama/demo/stills/styleframe.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/memphis-diorama/demo/stills/frame_spring.jpg, `frame_summer.jpg`, `frame_squat.jpg`, `frame_winter.jpg` (same folder)
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/memphis-diorama.mp4
### Gaps
No vertical layout (the 1520×744 frame + three bottom lines would need re-proportioning for 1080×1920); callout pill sizes and back-ease constant not given; squash depth/overshoot amounts not numeric; outline thickness at other resolutions only "about 2 px at 1080p".

## Desktop Flythrough
- Source: `lemomo-ai/lemo-opuscar` `styles/desktop-flythrough/STYLE.md`, `DEMO.md`, `style.json` (No. 77, Materials & 3D); light, grade and palette constants checked in `demo/src/world.js`, `post.js`, `cards.js`; licence: MIT (docs/code), demo film/stills CC BY 4.0 (credit LemoLab); demo voice is Microsoft edge-tts (`zh-CN-XiaoxiaoNeural`, English `en-US-AvaNeural`), not listed among the excluded tracks but online-service TTS; claims sourced in `demo/FACTS.md`
- One line: app screens lie on a sunlit desk as printed paper cards; pixel-sprite characters pop up into voxel toys and carry the work card to card while one unbroken camera flies after them and finally pulls back over the whole desk.
- Suits: app explainers, workflows, "how X travels through a system", product how-tos, pipelines. Real footage: no. 3D: yes (three.js r170 + Canvas 2D card textures; maps to Blender). AI images: no. Needs a pixel-art mascot (drawn as cells) and a voice-over when it explains.
- Catalog rating: completeness **full** · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper mat | `#e2e8f5` | ground (cool-tinted) |
| dot | `#c4cde3` | dot grid on the mat |
| card | `#fbfcff` | cards and screens (near-white) |
| ink | `#171c2e` | all print |
| mute / line / faint | `#7d8597` / `#dfe3ec` / `#eef0f6` | secondary print, rules, fills |
| accent | `#2f5bff` | cobalt: the route, step badges, send button, lit window, drawer, impact ring |
| red | `#e2483d` | only failure/trouble (weak signal bar) |
| green | `#3fa57a` | only success |
| mustard | `#f2c14e` | bell, data cubes (data in motion) |
| owl (warm cast) | `#a8744a` | warm support hue |
| terminal | `#1f2535` / ink `#d9deea` / mute `#7f889e` | terminal cards |
| sun / sky / ground fill | `#ffdcb4` / `#c8d6ff` / `#f3e3cc` | light colours |
| alt "Lilac and violet" | paper `#e7e4f3`, dot `#cbc5e2`, card `#fcfbff`, ink `#1d1a2e`, mute `#807a96`, line `#e2dfee`, accent `#6b4ce6`; support `#f39a5b` `#5fb4e8` `#f2c94c`; red `#e2483d`, green `#3fa57a`; haze `#e8e4e6` | example for creative/music/learning |
| alt "Cool grey and amber" | paper `#e5e9ed`, dot `#c8cfd7`, card `#fdfdfc`, ink `#20252b`, mute `#7f8790`, line `#e0e4e8`, accent `#e8890c`; support `#2f8fb0` `#8a5a9e` `#f4e3b5`; red `#d23a3a`, green `#3c9c6e`; haze `#e6e4e1` | example for money/logistics/energy/food |
Rules: one light cool ground, a warm wooden desk, near-white cards, one dark ink, one accent reserved for what matters now; 2–3 mid-saturated support hues (never neon), one warm cast colour against the cool ground; red only for failure, green only for success; a brand colour becomes the accent; avoid grey on grey.
### Typography
- Three roles (families free, roles fixed): a mono for labels and numbers in spaced caps (demo **IBM Plex Mono**; alternatives DM Mono, JetBrains Mono), a sans with a heavy weight for pills, titles and subtitles (demo **Instrument Sans**; alternatives Manrope, Space Grotesk), and a CJK/script face both fall back to (demo **Noto Sans SC**). All Google Fonts, self-hosted and subset; never a system fallback; no pixel font on print.
- In the world, only keywords and numbers: step badges (camera-facing accent pill with a digit and one word), sizes, a name on a screen, a banner; card heads carry two lines (English mono caps over the other language in bold).
- Titles are desk objects: an opening tent card beside the first stop, a large paper title card dropped into open desk at the end.
- Subtitles (1920×1080): one cue per spoken line, a quiet rounded ink box at about 72 % opacity, about 64 px above the frame edge; spoken language bold about 40 px, translation about 26 px on a second line; one language per line, never wrapped; cue appears and leaves with the line.
- Readability: flat print reads from 55–70° down; card canvases drawn at 3–3.4× (pills 3×); no CSS/canvas blur on anything read; text framed above the subtitle area and held still for its reading time.
### Layout
- The camera keeps its subject about 110 px above centre (fixed vertical view offset) so nothing sits under the subtitle bar.
- Wide shots frame the stations to fill at least 70 % of frame width; the closing wide keeps every character ≥ ~35 px wide (on-screen width ≈ `width × 1080 / (2 · dist · tan(fov / 2))`; demo cat ~63 px, copy ~37 px).
- Leave open desk (demo: the middle) for the closing title card, clear of stations, route, characters and the subtitle bar.
- Scale: 1 unit = 1000 canvas px; cards 0.3–0.7 units wide; dots 0.03 apart; mat sizes multiples of 0.06; a character about 1/5–1/3 of its card (0.006–0.0075 units per pixel; a 16-px sprite ≈ 0.1 wide).
- Desk props (pen, sticky notes, mug, earbuds, eraser) at the edges as foreground/background layers so each close shot has something soft in front or behind.
### Elements
- Cards: rounded slabs a few mm thick with the interface printed on top (canvas texture with faint deterministic grain; one ink, mono spaced-caps labels, bold numerals, thin rules). A phone card has a dark bezel and a whole interface (status bar, header naming the screen, content, bottom controls) or it reads as a blank slab.
- Voxel cast: instanced bevelled cubes per pixel, depth growing with distance from the silhouette (`depthK` 0.6–0.9 for large picture-like sprites); pure-black pixels are protruding eyes that blink (taking the colour of the pixel above); rig root → hinge (flat ↔ standing) → squash (at the feet) → spin; state `e` (0 sticker … 1 toy).
- Props from the same voxel recipe (crosses, ticks, bells) or rounded primitives (bricks, presses, drawers, towers, tent cards, stamps); data rising out of a card is extruded from its printed shape.
- Route: dotted accent line between stations; impact ring: thin accent ring spreading over the paper, fading in about 1 s (not lifted dots, which read as pegs).
- Labels and pills cast no shadow.
### Motion
- 30 fps; one steady tempo 110–130 BPM (engine `BEAT`/`BAR` fixed at 120); every action on the 16th grid, big moments on downbeats.
- **Hop**: arc with stretch about 14 % in the air, squash about 30 % for 0.2 s on landing, a small anticipation squash before take-off; groups follow the leader, each a 16th behind.
- **Pop** (sticker → toy): 0.25–0.5 s, hinge up with overshoot, cells extrude from the centre, small jump, squash on landing; **reverse pop** when stored/delivered.
- **Slam**: drops with ease-in, lands on a downbeat, squashes, jolts the card, sends a ring; camera shakes are `[t, amplitude, decay]`.
- UI comes alive in sequence: digits, bars, ticks, typed characters on 16ths with an overshooting ease.
- Characters blink every couple of seconds, bounce on the beat while waiting, squint when squashed, lean toward what they look at. No dead hold over ~1.5 s. Paper and cards never move except a jolt or curtain-call hop.
- Camera vocabulary: macro glide with a slow orbit (close, 20–45° down); **whip** card to card in 0.3–0.5 s banking into the turn (arcs up mid-way between far stops); rise to near top-down (55–70°) to read; ride along low behind the subject; pull back over the desk; hold with a shake. Targets follow a Hermite path between keys with live end points; at a whip's start key the target rests (`ease: 1`); drift is a breath, not handheld wobble. Demo camera FOV 38°.
### Transitions and rhythm
- One take: no cuts, no dissolves. The film closes on the whole desk (curtain call: every stop hops once left to right, characters pop back up, the title card drops into open space and bounces).
- Demo: 59.95 s, 120 BPM, D major, bar = 2 s, one chord per bar; badges stay 3.4 s and leave before the camera moves on; voice lines 0.8 s lead, 0.3–0.6 s gaps.
### Finish
- Per frame: 16–24 sub-frames with Halton sub-pixel jitter (AA + a little motion blur), shutter shrinking with camera speed so no streak exceeds ~8 px.
- DOF on each sub-frame, behind the focus plane only (set a little beyond the subject), light (≤ 5 px); nothing in front blurred.
- Bloom on highlights only: UnrealBloomPass strength 0.28, radius 0.55, threshold 1.05.
- Grade: light vignette (amt 0.45), slight warmth (warm 0.35 toward (1.07, 1.0, 0.88)), contrast 0.12, saturation 1.05, tiny lift (0.010, 0.006, 0.004). NeutralToneMapping, exposure 1.0.
- Exponential fog (FogExp2 density 0.075, haze = paper × 0.97) thinned as the camera pulls back. Subtitles are DOM on top.
### 3D look (if any)
- Physically based three.js; one directional sun `#ffdcb4` at 3.8, low from back-left about 20° up (shadows 2–3× a toy's height), 4096 PCF soft shadow map following the camera target and resizing with distance (bias −0.0001, normalBias 0.0006); hemisphere fill sky `#c8d6ff` / ground `#f3e3cc` at 0.7 (blue shadows, warm lit faces); faint RoomEnvironment PMREM at intensity 0.25.
- Desk: dotted paper mat (thin rounded slab) on a procedural light-oak plane (planks, long soft grain); soft warm additive four-pane window-light patches at low opacity under the cards. Props matte or satin.
- Blender mapping: Sun lamp ~20° elevation with soft shadow angle, sky/ground world gradient for the cool/warm fill, image-textured rounded card slabs, Geometry Nodes "instance cube on pixel" for voxel sprites (depth from distance-to-edge), camera DOF with focus a little behind the subject, motion blur with shutter tied to camera speed, a light compositor vignette/warm grade; window patches as a gobo/light-texture.
### Banned
Not a screen recording (no cursor, no glowing monitor, no real app chrome or logos, no named apps/companies); not a brick/clay toy film; not an isometric infographic (perspective camera, real light); not flat motion graphics (everything has thickness and a shadow); no cuts or dissolves; no handheld wobble; no pixel font on print; no system font fallback; no blur on readable text; no DOF in front of the subject; no streaks over ~8 px; no shadows from floating labels across text; no dead stations or dead holds over ~1.5 s; no lifted-dot ripples; upright bars/ticks seen from above; red/green used for anything but failure/success; neon support colours; never copy reference characters, layouts, icons or music.
### Example frames
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/docs/frames/desktop-flythrough.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/desktop-flythrough/poster.jpg
- https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styles/desktop-flythrough/demo/stills/styleframe.jpg
- Film: https://github.com/lemomo-ai/lemo-opuscar/releases/download/films/desktop-flythrough.mp4 (an English build `desktop-flythrough-en.mp4` is described but not in the release list)
### Gaps
No vertical-frame guidance; pill sizes and badge type sizes not given numerically; hop height and arc shape not numeric; overshooting-ease constant for UI not given; the window-light patch sizes and opacity not numeric.

---

# Part 1b: OPUSCAR 98 film-style prompts (98)

Source: `lemomo-ai/lemo-opuscar` `styleboard/opuscar98_styles.json` (MIT; the film itself is CC BY 4.0). These are the styles of the 6:31 film *OPUSCAR 98*: one short prompt per Best Picture winner, 1927–2025 (77 in 2D, 4 in 2.5D, 17 in 3D). Each prompt is about 900 characters, so these entries use a condensed form of the template, one line per heading. Every prompt names a real film or director as a grammar reference. A device most of them share: the whole frame stays neutral and only the hero keeps colour, usually Clawd orange `#D97757`. In the original, each film gets 2.5–5 s, so the cut rhythms are for a montage. Frames are at `styleboard/img/opuscar98/NN.jpg`; the film is at https://lemomo-ai.github.io/lemo-opuscar/opuscar98/ .

### No. 1 · Tinted Ortho Dogfight 3D (after *Wings*, 1927/28; ref. William Wellman)
- Lemo name: "Silent-era 3D Dogfight, Tinted Ortho B&W" · render 3D · tone 3D·B&W · blend: three.js 3D; orthochromatic B&W; silent-film tinting; projector wear and iris
- One line: smooth 3D graded like a 1927 orthochromatic release print: cream-amber skies, deep black silhouettes, scratches and gate weave.
- Palette: tint target amber `#FFCC80` (whites blended half-way toward it, never solid orange); hero accent e.g. `#D97757` at ~70 % saturation, whole figure; blacks stay black. Values: sky near-white, ground mid-greys, deep blacks 25–35 % of frame, only in silhouettes; reds render black.
- Type: none on screen.
- Motion & camera: signature shot = camera rigged to something moving with the subject, rig in frame, slight shake; then chase and POV. Open on a 1 s iris. Demo shots 0.6–1.1 s.
- Cuts & rhythm: hard cut every 2–3 s (demo about every two beats); white-out through cloud, smoke or glare as the transition.
- Finish: 24 fps gate weave ±1 px; flicker ±5 %; fine grain ±4 %; 1–3 thin scratches; sparse dust; rounded gate corners; vignette.
- 3D: smooth-shaded models (planes, clouds, trenches); every lamp/fire/light source stays grey; only the hero keeps colour.
- Avoid: motion blur; colour in the greys.
- Overlaps: silent-film (look), but in 3D: largely new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/01.jpg

### No. 2 · Black-Gold Deco Revue Poster (after *The Broadway Melody*, 1928/29; refs A. M. Cassandre, Erté)
- Lemo name: "Black-Gold Art Deco Revue Poster" · render 2D · tone 2D · blend: Art Deco poster; airbrush metallic gradients; Cassandre; Erté costume
- One line: a black-lacquer Deco revue poster in banded gold and silver, chasing bulbs and sound rings pouring from a chrome mic.
- Palette: ground `#0A0908`; gold `#D6B560`; highlight `#F3E2A2`; silver `#BFC4C9`; skin pale silver-cream (no hex); one saturated hero accent e.g. `#D97757`.
- Type: marquee lettering (demo "ALL TALKING · ALL SINGING · ALL DANCING"); face not given.
- Motion & camera: metals as 3–5 hard banded gradients; chasing bulbs; a row of repeated elements rippling toward the centre; rings radiating from the main sound/light source; slow pushes and pull-backs; frontal symmetry, central spotlight.
- Cuts & rhythm: cut on the music beat (without music every 2–3 s); demo 4 hard cuts in 3.3 s.
- Finish: fine grain, glints, stars, airbrush glows, sunbursts.
- Avoid: flat yellow for metal; faceless figures; extra hues.
- Overlaps: art-deco
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/02.jpg

### No. 3 · Expressionist Anti-war Woodcut (after *All Quiet on the Western Front*, 1929/30; ref. Käthe Kollwitz, *Krieg* 1921–22)
- Lemo name: "Kollwitz Anti-war Woodcut" · render 2D · tone 2D·B&W · blend: woodcut; Kollwitz; German Expressionism; two-block colour print
- One line: massive black woodcut with white knife-cut contours and one flat orange block for the hero; slow, grieving, quiet.
- Palette: ink `#17130F`; paper `#E8DFCA`; hero block e.g. `#D97757` (flat on body/clothes, cuts over it). 60–70 % of frame solid black (stays ≥ 60 % even with colour).
- Type: none on screen.
- Motion & camera: quiet motion only (breathing, a small gesture); slow pans and push-ins; demo held slow (1.2×).
- Cuts & rhythm: demo 4 hard cuts in 3.3 s.
- Finish: white contour cuts 1/300–1/150 of frame width, tapering in and out with chipped edges, wider nearer the light, in slightly uneven bundles; texture only wood-grain streaks and under-inked speckle (±5 %); faces are white shapes with a few black features; hands large; figures fill and are cropped by the frame. Light through one opening; lamps get a short ring of cuts; ground under figures stays uncut black.
- Avoid: grey fog or midtones; even striped hatching; gore.
- Overlaps: woodcut
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/03.jpg

### No. 4 · Gold-toned Albumen Panorama (after *Cimarron*, 1930/31)
- Lemo name: "1889 Sepia Albumen Panorama" · render 2D · tone 2D·Sepia · blend: gold-toned albumen print; frontier panorama photograph; hand-tinted figure
- One line: a moving 1880s albumen photograph, soft and blotchy in cream and umber, with only the hero hand-tinted.
- Palette: highlight multiply cream `#F2DCB4`; blacks lifted to umber `#2E1C0F`; vignette to `#785634`; hero dye e.g. `#D97757` (transparent, mask feathered 2–3 px). Value plan: subjects 15–30 %, ground 50–60 %, sky ~90 %.
- Type: none on screen.
- Motion & camera: one 4–5 s ease-out pull-back from the hero to the whole panorama (demo then one cut to a close shot with a recoil jolt). Middle band packed with repeated small elements (figures, animals, vehicles; for a lone subject fences, posts, trees); no big plane dominating.
- Cuts & rhythm: demo 1 hard cut in 2.5 s.
- Finish: paint soft flat shapes by brightness with hatching and grass tufts (~1/300 of frame width), then "print": greyscale, blur ~1/800 of frame width, a smear of three horizontal offset copies that grows with camera speed, blotchy development ±5 %, per-frame grain ±4 %, dust, scratches; lamps stay sepia.
- Avoid: hard ink outlines; colour beyond the hero; a flat grey print.
- Overlaps: new (tone near archive-lighttable / newsreel)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/04.jpg

### No. 5 · Studio-Silver Deco Set 3D (after *Grand Hotel*, 1931/32; refs Cedric Gibbons, William Daniels)
- Lemo name: "MGM Silver B&W 3D Lobby" · render 3D · tone 3D·B&W · blend: three.js 3D; MGM silver B&W; Art Deco interiors; overhead symmetry
- One line: a glossy symmetrical Deco interior in 1930s studio silver, one orange figure crossing a checkerboard floor.
- Palette: neutral grey only; ~40 % deep black, glossy whites near 90 %, no washed-out greys; hero e.g. `#D97757`, at least 1/6 of frame height; warm lamps render white.
- Type: none on screen.
- Motion & camera: signature = eye-height wide into a deep symmetrical set with floor and ceiling in frame and floor reflections; 4–6 s tracks; one overhead on rings with figures as chess pieces. Figures really walk (demo 1.4 m/s at 2.4 strides/s, matched to ground covered).
- Cuts & rhythm: demo 1 hard cut at 1.08 s (overhead → tracking).
- Finish: ambient occlusion; soft bloom only around lamps; grain ±3 %; halation; light in shafts from one high source.
- 3D: marble, chrome, chandelier, glossy checkerboard floor; outdoors keeps glossy surfaces (wet pavement, still water) and symmetry; period figures (heads, hats, limbs) walking routes.
- Avoid: walking in place; frame-filling abstract patterns; colour casts.
- Overlaps: new (3D B&W)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/05.jpg

### No. 6 · Art Nouveau Litho Panel (after *Cavalcade*, 1932/33; ref. Alphonse Mucha)
- Lemo name: "Mucha Art Nouveau Panel" · render 2D · tone 2D · blend: Mucha; colour lithograph; Art Nouveau ornament
- One line: a Mucha colour lithograph: swelling brown contours, pastel flats, a ringed halo behind the central figure and a mosaic ground.
- Palette: contour brown `#4B3326`; cream `#F5ECD6` paper/sky; sage `#A9B490` foliage/drapery; pale gold `#CFA55A` halo/ornament; rose `#DBA49C` skin/flowers; hero accent e.g. `#D97757`; mosaic in muted teal (sage + grey, no hex).
- Type: bottom band of serif capitals in the user's language, 1/25 of frame height; face not named.
- Motion & camera: slow sway; tilt down to the halo; pull back to the whole panel.
- Cuts & rhythm: demo 2 hard cuts then a settling pull-back (2.5 s).
- Finish: contours ~1/250 of frame width, doubling on the shadow side (light upper left), tapered ends; each flat has a hard-edged darker shadow tone; hair/cloth in three-tone strands; almond eyes, heavy lids; litho grain, paper mottle, vignette. Layout: figure + halo in the middle third, arched panels either side, square-tile mosaic behind; no plain area over 1/8 of frame.
- Avoid: thin clean lines; saturated colour; empty backgrounds.
- Overlaps: new (closest art-deco)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/06.jpg

### No. 7 · B&W Rubber-hose Road Gag (after *It Happened One Night*, 1934; refs Fleischer Betty Boop, Disney Silly Symphonies backgrounds)
- Lemo name: "1930s B&W Rubber-hose Cartoon" · render 2D · tone 2D·B&W · blend: Fleischer rubber hose; cel painting; Silly Symphonies watercolour backgrounds; projected film wear
- One line: thick-thin inked rubber-hose characters in black and white over grey watercolour backgrounds, with projector wear.
- Palette: ink `#141414`; character fills pure black and white + at most one light grey for hard shadow; backgrounds 30–80 % grey (never pure black/white); hero e.g. `#D97757` (whole body, or its key prop if human).
- Type: none on screen.
- Motion & camera: anticipate, overshoot, settle; squash on landing, stretch on fast moves, eyes pop on surprise; camera jolt on hits; slow push-ins.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s; the payoff beat played at 1×.
- Finish: ink line 1/400–1/150 of frame width, swelling away from the light (default upper left); gloss on blacks; backgrounds keep graphite lines, grey washes with pooled edges and granulation, paper grain; ±1 px gate weave, grain ±4 %, flicker, scratches, dust.
- Avoid: smooth vector lines; grey characters merging with the background.
- Overlaps: rubber-hose
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/07.jpg

### No. 8 · Admiralty Chart Copperplate (after *Mutiny on the Bounty*, 1935; refs Robert Dodd, 1770s–80s Admiralty charts)
- Lemo name: "Admiralty Sea Chart Copperplate" · render 2D · tone 2D · blend: 18th-c. Admiralty chart; copperplate engraving; thin hand colouring; Robert Dodd aquatint
- One line: the whole film stays on an engraved, hand-coloured sea chart; one glide into an engraved vignette while a dotted route inks itself.
- Palette: ink `#1C1610`; laid paper `#EFE3C4`; water wash `#9EBCBC` along edges; land `#B8C08C`; hero e.g. `#D97757` (the one strong colour).
- Type: serif map lettering and a cartouche; sizes not given.
- Motion & camera: one continuous 5–6 s glide from the whole sheet into the vignette, chart kept around it; a dotted route inks itself in. The vignette fills 60–75 % of frame height at the end of the move.
- Cuts & rhythm: no cuts (demo one 2.5 s move).
- Finish: burin hatching and cross-hatching ~1/1200 of frame width give all tone, with a minimum line width so small detail darkens rather than vanishes; light foxing, folds; rhumb lines from 32-point roses, graduated border, hachured hills, one ornament (e.g. a sea monster); the vignette is unboxed and fades into the chart.
- Avoid: cropping the paper; heavy washes; stiff figures.
- Overlaps: engraving (map device near transit-map)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/08.jpg

### No. 9 · Silver Revue Stage 3D (after *The Great Ziegfeld*, 1936; ref. Robert Z. Leonard)
- Lemo name: "Silver B&W 3D Wedding-cake Stage" · render 3D · tone 3D·B&W · blend: three.js 3D; MGM silver B&W; 1936 revue spectacle; ostrich feathers and chiffon
- One line: a revolving tiered revue stage in 1930s studio silver: satin, chiffon and feathers rim-lit against deep black.
- Palette: neutral greys (costumes light satin grey, set mid-grey, pleated backdrop darker, theatre deep black, whites below pure white); hero e.g. `#D97757`; lamps render white.
- Type: none on screen.
- Motion & camera: round tiered platform turning ~3°/s; signature = low medium along the tiers, figures 1/4–1/3 of frame height, hero on the front tier; then a 3 s curtain rise and a 10 s crane up to a level medium of the hero (demo compressed, 1.2×).
- Cuts & rhythm: demo 2 hard cuts in 2.5 s.
- Finish: soft front key, brighter rim lights edging satin and feathers near-white; faint light shafts; grain ±3 %.
- 3D: draped, garlanded tiered set; rows of costumed chorus figures with faces and arms.
- Avoid: flat lighting; faceless cones; fast spinning.
- Overlaps: new (sibling of No. 5)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/09.jpg

### No. 10 · 1890s Newsprint and Line Engraving (after *The Life of Emile Zola*, 1937)
- Lemo name: "Newsprint Letterpress and Line Engraving" · render 2D · tone 2D·B&W · blend: wood-type headline; letterpress on newsprint; 1890s line engraving
- One line: a front page that prints itself: wood-type headline slamming down, dense lead-type columns, an engraved picture, ink spread on yellowed newsprint.
- Palette: warm black `#17130F`; newsprint `#E8E0CC`; hero accent plate e.g. `#D97757`, offset 1–2 px.
- Type: masthead; wood-type headline across the width ~1/6 of frame height (letters as grained blocks); 3–6 columns of small type in the user's language ~1/80 of frame height; faces not named.
- Motion & camera: type blocks slam down, bounce and leave their print; one repeating mechanical motion (the press); pages turning; push-in, pull-back + truck.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s; the last letter lands on beat 2 with a page jolt.
- Finish: text set as a sharp mask, then printed: ~1 px blur + noisy threshold for ink spread, ragged edges, under-inked patches, faint mirrored show-through. Engraving: hatching ~1/1000 of frame width spaced 1/400, following form, cross-hatching only in darks, heavier shadow-side contours, paler distance.
- Avoid: clean digital type; smooth grey shading; other colours.
- Overlaps: engraving / halftone-dossier / newsreel (newspaper device)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/10.jpg

### No. 11 · WPA Six-ink Silkscreen Poster (after *You Can't Take It with You*, 1938; ref. WPA Federal Art Project posters 1936–39)
- Lemo name: "WPA Silkscreen Poster" · render 2D · tone 2D · blend: 1930s WPA silkscreen; split-fountain inks; six flat opaque inks
- One line: a Depression-era silkscreen poster: six opaque inks laid light to dark, coarse split-fountain skies, slightly off register on rag paper.
- Palette: cream `#F0E2C0` light; ochre `#E0A842` and vermilion `#C84A2A` sky and warm planes; teal `#22686E` water and shade; hero ink e.g. `#D97757` (hero only); brown keyline `#322018` printed last. Shadows = a darker ink overprinted, never grey.
- Type: a bold capital title band in the user's language; face/size not given.
- Motion & camera: screens pop in one by one; slow pushes and pull-backs. Figures fill 1/2–2/3 of frame height: big planes, crescent shadows, expressive faces.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s.
- Finish: each later screen cut away around lighter shapes (clouds, sun); split-fountain blends of two inks in 2–3 coarse steps, the middle step their overprint; screens 1–3 px off register; wandering stencil edges; squeegee streaks; warm rag-paper grain ±5 % on every flat.
- Avoid: halftone dots; smooth gradients; clean vector flats.
- Overlaps: silkscreen-poster
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/11.jpg

### No. 12 · Technicolor Knife Impasto (after *Gone with the Wind*, 1939; refs Ernest Haller, Ray Rennahan, William Cameron Menzies)
- Lemo name: "Technicolor Impasto Oil" · render 2D · tone 2D · blend: impasto oil; palette knife; 1939 Technicolor palette; epic poster painting
- One line: palette-knife oil in burning Technicolor: gold-to-blood skies, red earth, huge black silhouettes on a low horizon.
- Palette: sunset sky wine `#3A0912`, red `#A8241A`, orange `#F27A22`, gold `#FFD878`; ground red-brown `#6E2214`; warm near-black silhouettes; hero a readable warm mid-tone e.g. `#D97757`, never a silhouette.
- Type: none on screen.
- Motion & camera: slow push on the wide, low push-in on the hero, crane up to a vista (demo: one crane over the last five beats); sky warms gold → blood red over seven beats.
- Cuts & rhythm: demo 4 hard cuts in 6.7 s, shots 0.4–2.1 s.
- Finish: sky as long horizontal knife slabs 1/15–1/6 of frame width long and ~1/60 tall; shorter form-following strokes on land and figures; calm thin areas between; ridges lit from upper left, paint thickest in highlights, canvas weave where thin; strong backlight with gold rims; close shots get warm side light on half the face; lamps as painted flames.
- Avoid: tiled same-size strokes; muddy browns; smooth gradients.
- Overlaps: impasto
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/12.jpg

### No. 13 · Gothic Charcoal (after *Rebecca*, 1940; refs Alfred Hitchcock, George Barnes, William Kentridge, Odilon Redon)
- Lemo name: "Gothic Charcoal Drawing" · render 2D · tone 2D·B&W · blend: vine charcoal; eraser lifts and smudging; Kentridge; Gothic suspense
- One line: velvet-black charcoal on toothed paper, moonlit mist erased out of toned areas, every shot pushing toward a fire.
- Palette: charcoal `#121111`; paper `#EEECE7`; hero in pastel e.g. `#D97757` (laid fairly solid, tooth showing, outlined in charcoal); flames stay charcoal and paper. Values: ~60 % dark-to-mid grey, 15 % deep black in nearest foreground and largest masses, lights small.
- Type: none on screen.
- Motion & camera: slow subjective push with foreground parting; 2–3 fog bands drifting at different speeds; every shot pushes in.
- Cuts & rhythm: demo 3 hard cuts in 2.5 s.
- Finish: paper tooth ~1/600 of frame width (light pressure catches peaks, heavy fills valleys; grain only in midtones); broken vine lines; side-of-stick sweeps 1/60–1/30 of frame width following form; hatching; finger smudges; eraser lifts for edges and glows; mist = horizontal streaks erased from a toned area; moonlight from above.
- Avoid: digital noise; smooth digital glows; grey blacks; empty bright skies.
- Overlaps: new (closest urban-sketch / chalkboard)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/13.jpg

### No. 14 · Welsh Valley Gouache (after *How Green Was My Valley*, 1941; refs John Ford, Arthur C. Miller, Kyffin Williams)
- Lemo name: "Welsh Valley Gouache" · render 2D · tone 2D · blend: opaque gouache; Kyffin Williams palette-knife landscape; 1941 poster colours
- One line: opaque, fully covering gouache strokes in gold and green with coal-dark hills and broken dark contours, seen from high ground.
- Palette: sky/light pale gold `#F1C565` (not mustard); fields green `#86A03F`; darks coal `#1D1B1E`; far hills and water slate `#48505E`; small accents yellow `#F6CF2F`; hero `#D97757`, at least 1/8 of frame height; other colours mixed from these. Fields and sky light (~60 %), hills and buildings dark.
- Type: none on screen.
- Motion & camera: looping smoke or cloud; lateral tracking shot; locked-off insert; true perspective from high ground with a path leading the eye down; small repeated buildings stepping along slopes.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s.
- Finish: directional strokes 1/80–1/40 of frame width, 2–5× as long, ragged, fully covering; broken dark dashes outline buildings, walls, ridges; dark hills flecked with lighter green or slate knife marks; warm grade under 10 %; vignette; grain; low late-afternoon side light with rim-lit ridges.
- Avoid: watercolour transparency; vector fills; mud.
- Overlaps: impasto (gouache variant)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/14.jpg

### No. 15 · Home Front Stone Lithograph (after *Mrs. Miniver*, 1942; refs Frank Newbould, Abram Games)
- Lemo name: "Home Front Stone Lithograph" · render 2D · tone 2D · blend: stone lithograph with crayon shadow plate; Newbould and Games WWII posters; Ministry of Information palette
- One line: a WWII British poster lithograph: flat brick red, deep green, cream and grey-blue, with a grainy crayon shadow plate.
- Palette: cream `#EBDFC2` paper and highlights; grey-blue `#8497A6` sky and shadow; brick red `#A23F2D` and deep green `#34503F` accents (at most a quarter of the frame); key `#1E2422`; browns and skin mixed from cream and brick.
- Type: none on screen.
- Motion & camera: slow drifts; a tilt up; slow push with slight roll; figures stand frontally.
- Cuts & rhythm: demo hard cuts linked by one upward look (3 shots in 2.5 s).
- Finish: three plates 1–3 px off register: a colour plate with all flat fills; a grey-blue crayon plate darkening every shadow with short slanted stone grain; a green-black key line ~1/500 of frame width around every shape; airbrushed skies; only the paper grain boils, at 12 fps; pale light bands angled from the source cancel the shadow plate.
- Avoid: dot screens; clean vector edges; big saturated fields.
- Overlaps: silkscreen-poster (litho variant)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/15.jpg

### No. 16 · Studio Glamour B&W (after *Casablanca*, 1943; refs Michael Curtiz, Arthur Edeson)
- Lemo name: "Studio Glamour Black-and-White" · render 2D · tone 2D·B&W · blend: airbrushed glamour-still portraits; Edeson studio lighting; diffusion filter and silver grain
- One line: 1940s studio black-and-white painted like a retouched glamour still: short-key faces, blind shadows, light shafts in smoke.
- Palette: greys only; 30–40 % of frame deep black, whites small and glowing, outdoor skies mid-dark; hero colour only on body/costume e.g. `#D97757`; skin and lamps stay grey.
- Type: none on screen.
- Motion & camera: a long glide, a push to a face, a pull-back into fog (demo: one 2.5 s travelling move through a room ending on a toast, then one hard cut).
- Cuts & rhythm: demo 1 hard cut at the halfway beat in 5 s.
- Finish: smooth airbrushed tone blocks; faces in short key with a Rembrandt triangle on the near cheek and two catchlights per eye; slatted shadows (blinds, railings, branches) fall diagonally; light shafts only in smoke or fog; diffusion glow; S-curve; fine grain ±3 %; soft vignette; faint flicker; fog stays local.
- Avoid: flat lighting; grey haze; stiff busts.
- Overlaps: new (noir; nearest silent-film in tone)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/16.jpg

### No. 17 · Backlit Gothic Stained Glass (after *Going My Way*, 1944; refs Chartres Cathedral, Harry Clarke)
- Lemo name: "Backlit Gothic Stained Glass" · render 2D · tone 2D · blend: leaded pot-metal glass with grisaille; Chartres blue quarries; Harry Clarke jewel colour
- One line: a backlit leaded window with grisaille faces, Chartres blue and ruby, its coloured light pooling on the church floor.
- Palette: background cobalt `#1B3F9E`; border ruby `#B3121F`; highlights gold `#E3A526`; lead `#16161A`; skin pale amber, scenery deep greens (no hex); hero the only orange glass e.g. `#D97757`.
- Type: banderole lettering (demo); face not given.
- Motion & camera: tilt down, pan, settle on the pooled light (demo one tilt then hard cuts, run 1.8× fast).
- Cuts & rhythm: demo 2 hard cuts in 2.5 s.
- Finish: window fills 80–90 % of frame height and ~60 % of width, neighbouring windows glowing at the edges; every shape is cut glass, lightness ±8 % per piece, streaks, seed bubbles, brown edge mat; black lead ~1/250 of frame width; sky/empty ground in diamond quarries ~1/30 of frame width; ruby beaded border; main figure ≥ half the window height in dark-brown grisaille line; bright glass blooms into the leads; coloured light spills onto floor and sill.
- Avoid: flat fills; random cuts; dark empty wall.
- Overlaps: stained-glass
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/17.jpg

### No. 18 · Typewriter Character Art (after *The Lost Weekend*, 1945; refs Billy Wilder, John F. Seitz, Paul Smith, Flora Stacey)
- Lemo name: "Typewriter Character Art" · render 2D · tone 2D·B&W · blend: typewriter art with overstrikes; Paul Smith and Flora Stacey; Seitz hard-light noir
- One line: every image typed on bond paper in a monospaced grid, grey from character density and overstrikes, the hero struck in red-orange ribbon.
- Palette: paper `#EBE6DA`; ink `#1D1C21`; hero red-orange `#D4704F` (at least 1/3 of frame height), its shadow black.
- Type: one bold monospaced glyph per keystroke; cells 1/150 of frame width wide, twice as tall; key ladder light `. : -`, mid `= + o`, dark `X # M`; darks (~30 %) are overstrikes like `M#`; each material repeats its own keys (`I H` verticals, `_|` courses, `~` water); signs stay legible.
- Motion & camera: the picture types itself within the first second, then holds; walking legs on alternate frames; camera eases back, slow push-ins.
- Cuts & rhythm: demo 2 quick hard cuts in 2.5 s (run 1.8× fast).
- Finish: 85–95 % of cells struck (bare paper only for highlights); uneven ribbon (half-inked strikes, a few keys always high or low); hard sidelight casts long crisp dense shadows.
- Avoid: sparse frames; shapeless streaks.
- Overlaps: ascii-crt (on paper instead of a CRT)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/18.jpg

### No. 19 · Picture-Magazine Halftone Spread (after *The Best Years of Our Lives*, 1946; refs Gregg Toland, *Life* photo essays)
- Lemo name: "Picture-Magazine Halftone Spread" · render 2.5D · tone 2.5D·B&W · blend: coarse 45° halftone; Toland deep focus; 1946 picture-magazine layout; spot-orange plate
- One line: each frame is a deep-focus news photo printed in coarse halftone across a 1946 magazine spread, the hero on its own spot-orange plate.
- Palette: ink `#1A1A1A`; coated stock `#ECE6D8`; hero spot plate e.g. `#D97757` (another angle, 2–3 px off, black only in its deepest shadows; hero ≥ 1/4 of frame height).
- Type: a short black headline and caption in a quiet area (demo "GRAVEYARD OF THE FORTRESSES"); face not given.
- Motion & camera: walk in, push to a detail, pull back to reveal an open magazine lying on a dark desk (one continuous pull-back).
- Cuts & rhythm: demo 2 hard cuts in 2.5 s.
- Finish: render the scene as a grey photo (3D or painted) with low sun, long shadows, deep focus; photo bleeds across both pages with a soft vertical gutter crease; 45° black halftone, dot pitch ~1/250 of frame width.
- 3D: 2.5D: scene rendered (3D or painted) then printed flat as halftone.
- Avoid: the gutter cutting the hero; dots so coarse they break the photo.
- Overlaps: halftone-dossier / risograph (photo-halftone variant)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/19.jpg

### No. 20 · 1940s Graphite Magazine Illustration (after *Gentleman's Agreement*, 1947; refs Al Parker, Robert Fawcett)
- Lemo name: "1940s Graphite Magazine Illustration" · render 2D · tone 2D·B&W · blend: graphite hatching and rubbed tone; Parker and Fawcett; coloured-pencil subject
- One line: a controlled graphite magazine illustration that draws itself (construction lines → hatching → rubbed tone) and then holds.
- Palette: paper `#F2EEE5` with light tooth; lead `#2C2B2E`; hero's clothing in coloured pencil e.g. `#D97757` (skin stays graphite). About 15 % dark accents; setting in mid-greys nearly edge to edge, only the outer tenth fading to loose margins.
- Type: none on screen.
- Motion & camera: the drawing builds in the first 1–1.5 s then holds: faint perspective rays and head ovals, pressure-tapered contours ~1/600 of frame width overshooting at corners, then 1–4 near-parallel hatching passes ~1/300 of frame width apart following form, then rubbed tone and eraser lifts. Slow ease out, then cuts to close-ups; little movement.
- Cuts & rhythm: beats land on the cuts; demo 2 hard cuts in 2.5 s (run 1.8× fast).
- Finish: pencil only; faces carry the drama.
- Avoid: cross-hatch grids; scribbly sketching; a near-empty page.
- Overlaps: urban-sketch (pencil, no wash)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/20.jpg

### No. 21 · Deep-Focus Fog Castle 3D (after *Hamlet*, 1948; refs Laurence Olivier, Desmond Dickinson, Roger Furse)
- Lemo name: "Deep-Focus Fog Castle, 3D B&W" · render 3D · tone 3D·B&W · blend: three.js 3D with volumetric fog; Dickinson deep-focus B&W; Furse bare Romanesque sets
- One line: a real 3D masonry castle in high-contrast deep-focus black and white, low fog, wet stone, lace-foam surf.
- Palette: greys only (dark masses against a silver sky; far background ends at 60–70 % grey; true blacks, unclipped whites); hero e.g. `#D97757`; every light source stays grey.
- Type: none on screen.
- Motion & camera: slow drift in; a track along a high edge; a low angle on the hero.
- Cuts & rhythm: demo 3 hard cuts in 2.5 s (run 1.8× fast); key action on the beat in the last shot.
- Finish: ambient occlusion; gentle bloom; high-contrast silver grade; grain ±3 %; faint flicker; soft overcast light, no hard shadows; a bright patch behind cloud throws faint shafts.
- 3D: bare masonry built block by block, bevelled and staggered (Romanesque arches only where the setting has them); wet surfaces dark and glossy; low fog filling the lower third; midground sharp; water as layered swells, lace foam, misty spray.
- Avoid: hard sunlit shadows; white-out fog; tiled textures.
- Overlaps: new (3D B&W; sibling of No. 5 and 9)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/21.jpg

### No. 22 · Wood-Type Campaign Poster (after *All the King's Men*, 1949; refs Hatch Show Print, Burnett Guffey)
- Lemo name: "Wood-Type Campaign Poster" · render 2D · tone 2D · blend: wood-type letterpress; Hatch Show Print; linocut figures; halftone portraits
- One line: a Southern rally poster in red, blue and black wood-type letterpress with linocut figures, starved ink and misregistered formes.
- Palette: cream stock `#EEE3C7`; blue `#20488C` sky, water, shadow masses; red `#C82C28` warm surfaces, stripes; black `#1E1B1E` outlines and type; hero spot ink e.g. `#D97757`.
- Type: short wood-type lines ~1/10 of frame height in the user's language, with offset shadows, on banners and signs (demo "STARK FOR GOVERNOR", "EVERY MAN A KING"); face not named.
- Motion & camera: small pushes; a lateral track; a camera bump on each strong beat (or every 2 s); picture fills ~70 % of frame.
- Cuts & rhythm: hard cuts throughout (demo 3 shots in 2.5 s).
- Finish: each ink 2–4 px off register; solids knock out the inks beneath, halftones overprint; wood grain, pinholed starved patches, squeezed edges; coarse halftone dots ~1/200 of frame width at varied angles on at most a third of the frame; figures as linocuts (heavy outlines, gouged white lines, crescent shadows).
- Avoid: busy grey mid-tones; perfect registration.
- Overlaps: silkscreen-poster / kino-montage (poster type)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/22.jpg

### No. 23 · Theatre-Page Line Caricature (after *All About Eve*, 1950; ref. Al Hirschfeld)
- Lemo name: "Hirschfeld One-Line Caricature" · render 2D · tone 2D·B&W · blend: single-line ink caricature; Hirschfeld theatre drawings; hand-lettered dialogue
- One line: one elastic swelling ink line per contour, solid blacks, lots of paper white, one exaggerated trait per figure.
- Palette: paper `#FBFAF6`; ink `#131012`; hero body/main garment filled flat with one colour e.g. `#D97757` instead of black. About 60 % paper white, never an empty page.
- Type: a short hand-lettered line may sit in the white (demo a dialogue quote); face not given.
- Motion & camera: lines write on within the first second, then hold; ease back, pan across, push in.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s (run 1.8× fast); a gesture lands on the beat after the last cut.
- Finish: lines long and continuous, ~1/800 of frame width at the ends swelling to 1/250 on curves; dark clothing, hair, big objects solid black; grey only as sparse parallel hatching; setting fully drawn in thin line.
- Avoid: stiff limbs; stick figures; a bare setting.
- Overlaps: one-line
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/23.jpg

### No. 24 · Offset-Wash Watercolour (after *An American in Paris*, 1951; refs Raoul Dufy, Preston Ames, Irene Sharaff)
- Lemo name: "Dufy Watercolour Ballet" · render 2D · tone 2D · blend: loose ink line over offset colour; Dufy; Minnelli's ballet sets; cold-press watercolour paper
- One line: Dufy's manner: big transparent washes of cobalt, lemon and rose laid first, then quick blue-black ink drawn over them, never aligned.
- Palette: cobalt `#2258CE` sky and water; lemon `#FCE02E` light and ground; rose `#EC3A7C` warm planes; ink `#1E1E3A`; hero wash e.g. `#D97757` (kept off blue). Overlaps mix violet or green, never brown; bare paper 20–30 %, skin included.
- Type: none on screen.
- Motion & camera: figures bounce (demo hops on every beat, so the dance is the cutting rhythm); small pushes.
- Cuts & rhythm: cuts on the beat (or every 2 s); demo 2 hard cuts in 2.5 s (run 1.8× fast).
- Finish: washes with wet edges, pooled rims and granulation cover most of the frame, 10–40 % oversized and slid one way by ~1/30 of frame width; ink ~1/700 of frame width with flicked ends, drawn densely (buildings, windows, figures, extras); straight edges overshoot corners; trees and clouds as looped strings.
- Avoid: muddy colour; lines tracing the colour; sparse line.
- Overlaps: urban-sketch / watercolor
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/24.jpg

### No. 25 · Four-stone Circus Chromolithograph (after *The Greatest Show on Earth*, 1952; ref. Strobridge Lithographing Co., c. 1890)
- Lemo name: "Strobridge Circus Lithograph" · render 2D · tone 2D · blend: four-ink chromolithograph; Strobridge circus posters; flat ink with heavy black outline
- One line: flat chrome yellow, vermilion and cobalt with heavy black outlines, exaggerated perspective and several actions at once.
- Palette: chrome yellow `#F4C416`; vermilion `#D62C24`; cobalt `#1E4EA0`; key black `#181210`; warm cream paper `#EBD9B4`; overprints/tints give only orange, green, brown, tan, pale blue, grey; hero = solid yellow under solid vermilion, a flat orange (e.g. `#D97757`).
- Type: none on screen.
- Motion & camera: tilt up; lateral dolly; cut on action; follow with slight push and roll; radial lines converging on the action.
- Cuts & rhythm: demo 2 cuts in 2.5 s, the last a cut on action.
- Finish: heavy outlines ~1/300 of frame width; crescent shadows, light from upper left; solids print flat; screens (dots ~1/250 of frame width) only on gradients (sky, skin, ground), each stone at its own angle, 1–3 px off register; stone grain; crowds as tiny individual figures.
- Avoid: off-palette colours; dot-only crowds; a screened, pinkish hero.
- Overlaps: silkscreen-poster / risograph
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/25.jpg

### No. 26 · High-Key Beach B&W (after *From Here to Eternity*, 1953; ref. Burnett Guffey)
- Lemo name: "High-Key Beach Black-and-White" · render 2D · tone 2D·B&W · blend: 1953 high-key B&W photography; Guffey; silver grain and halation
- One line: painted 2D that reads as a 1950s high-key photo: hard sun, pale sky, blown lace foam, wet sand mirroring the sky.
- Palette: greys; ~70 % of frame above mid-grey; sky light-mid grey one step below bright clouds; deep blacks small; hero whole figure e.g. `#D97757`, shaded photographically.
- Type: none on screen.
- Motion & camera: tilt down from the sky; tight level frame; slow pull-back; slow push with drift.
- Cuts & rhythm: demo 2 cuts in 2.5 s; gesture on the beat on the last cut.
- Finish: no outlines or flat fills, only soft gradients plus fine texture (sand, rock pitting, cloth); hard midday sun, short crisp shadows; foam and mist blow out at the peaks but keep lace detail; gentle S-curve; slightly soft lens; halation; fresh fine grain ±4 %; light vignette; flicker.
- Avoid: low-key frames; white blanks; cartoon fills.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/26.jpg

### No. 27 · Blotted-line Social Realism (after *On the Waterfront*, 1954; refs Ben Shahn, Boris Kaufman)
- Lemo name: "Ben Shahn Social Realism" · render 2D · tone 2D · blend: trembling blotted ink line; flat tempera colour blocks; Shahn; 1950s American social realism
- One line: a trembling, blotted ink line over flat tempera blocks laid slightly off it; big hands, long working faces, restrained slate, brick and ochre.
- Palette: slate `#768492` sky and cool areas; brick `#9E4834` and ochre `#C89852` ground, buildings, clothes; ink `#1F1A1A`; warm board `#F0E9DA`; skin pale ochre; hero's main garment the one warm accent e.g. `#D97757`; other colours = these darkened or greyed.
- Type: none on screen.
- Motion & camera: short pushes; tilt up; close-up.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s (run 1.8× fast), juxtaposing two worlds.
- Finish: ink lines ~1/500 of frame width that jitter and wander, each outline broken into 2–3 strokes, sometimes doubled by a fainter offset ghost (blotted line); tempera blocks 2–4 px off the line, rough-edged, dry-brush streaks (one brush ~1/100 of frame width) over a third of each block; form modelled with a darker flat of the same hue.
- Avoid: smooth gradients; clean closed outlines; cheerful colour.
- Overlaps: midcentury-toon (off-register line) but painterly: mostly new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/27.jpg

### No. 28 · Kinescope on a Living-Room TV (after *Marty*, 1955; ref. Delbert Mann's Philco Television Playhouse)
- Lemo name: "1955 Kinescope on a Living-Room TV" · render 2D · tone 2D (B&W screen) · blend: kinescope B&W; curved CRT screen and scanlines; warm 1950s living-room illustration
- One line: a soft black-and-white broadcast on a bulging wood-cabinet TV in a warm lamp-lit room, then a push through the glass into the show.
- Palette: screen whites with cool phosphor tint `#DCE6EA`; hero keeps colour e.g. `#D97757` under the same artefacts; room in ochre wallpaper, wood, lamp warmth (no hex); screen throws cold-blue glow on nearby walls.
- Type: none on screen.
- Motion & camera: signature = hold ~2 s with the TV filling 60 % of the frame, then push through the glass over 4–5 s until the broadcast fills the frame with scanlines visible, then steady TV-studio mid shots; tracks and slight pushes.
- Cuts & rhythm: demo 2 cuts in 2.5 s, the last on the key gesture.
- Finish: inside the screen: half resolution scaled up, halation, ghosting, tearing bands, a rolling hum bar, light snow, lifted blacks, flicker, grain; tube with rounded corners, sides bowing outward, ~330 scanlines, glass reflections.
- Avoid: heavy snow; a dull, evenly lit room.
- Overlaps: ascii-crt / backrooms (CRT/VHS) but as a framed device: partly new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/28.jpg

### No. 29 · UPA Modernist Cartoon (after *Around the World in 80 Days*, 1956; refs UPA *Gerald McBoing-Boing*, Saul Bass titles)
- Lemo name: "1950s UPA Modernist Cartoon" · render 2D · tone 2D · blend: UPA limited animation; Saul Bass end-title animation; 1956 poster colours; crayon-grain print
- One line: flat geometric 1950s cartoon: cut-out facets printed off broken ink lines, crayon grain on cream paper, one big graphic shape per poster frame.
- Palette: ink `#221C19`; cream paper `#F2E9D3` and pale aqua sky cover most of the frame; accents mustard `#E3A92B`, teal `#2B8C86`, orange-red `#D4452B`; sky, greens, slate blues = these mixed toward paper; other times of day change only the sky colour.
- Type: none on screen.
- Motion & camera: slow parallax drift; locked-off map insert with a route running; slow lateral pan; slight push.
- Cuts & rhythm: hard cuts every 1–2 s (demo three cuts, two beats each).
- Finish: uneven ink lines ~1/400 of frame width, sometimes broken; colour blocks ~1/300 of frame width off the lines, all offset one way; objects as overlapping flat cut-out facets, shadow face one flat step (~15 %) darker; crayon grain ±5 % brightness everywhere, few flecks; light beams as flat pale wedges.
- Avoid: gradients; perfect registration; saturated colour everywhere.
- Overlaps: midcentury-toon
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/29.jpg

### No. 30 · Cyanotype Engineering Blueprint (after *The Bridge on the River Kwai*, 1957; ref. David Lean)
- Lemo name: "Cyanotype Engineering Blueprint" · render 2D · tone 2D · blend: cyanotype blueprint; timber trestle G.A. drawing; red-pencil revisions; gouache-tinted hero
- One line: a dense general-arrangement blueprint filling the frame, red-pencil notes, and one hand-painted warm subject; the drama happens inside the drawing.
- Palette: Prussian-blue paper `#143874` (mottled, greenish over-exposed margin); white lines `#ECF4FF`; red pencil `#D63426` for notes and actions; hero opaque gouache e.g. `#D97757` (nothing else warm); walnut drafting table only on a pull-back.
- Type: single-stroke drafting lettering, title block; notes in red pencil in the user's language (demo "PLUNGER – ONE PUSH").
- Motion & camera: layered parallax push-in; cuts to detail views; slow pull-back; explosions drawn as a red-pencil scribble and hatched smoke rather than real fire.
- Cuts & rhythm: demo 2 cuts in 2.5 s (cause → effect).
- Finish: outlines ~1/600 of frame width, hatching and dimensions half that, sharp but printed, broken where exposure was weak, slight cyan bloom; uneven exposure, creases, faint water stains; drafting grammar (elevations, sections, detail circles, dimension chains, hidden lines); hero drawn above scale (≥ 1/5 of frame height).
- Avoid: neon glow; clean digital blue; sparse sheets.
- Overlaps: blueprint
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/30.jpg

### No. 31 · Belle Époque Crachis Lithograph (after *Gigi*, 1958; refs Toulouse-Lautrec, Cecil Beaton)
- Lemo name: "Lautrec Belle Époque Lithograph" · render 2D · tone 2D · blend: colour lithograph poster; Toulouse-Lautrec; crachis ink spatter; Beaton costumes
- One line: flat Lautrec poster plates with loaded-brush contours, spattered crachis instead of halftone and caricatured profiles, one big figure cropped in front.
- Palette: yellow `#F1C232`; orange-red `#E0602C`; olive `#6E7036`; black `#1D1A16`; cream stone-grained paper `#EFE3C3`; plus a muted bottle teal and a greyed mauve (no hex); flesh = orange-red thinned with paper.
- Type: none on screen.
- Motion & camera: shallow parallax; a slow pan settling on a medium shot; lateral pan along a row of staring faces.
- Cuts & rhythm: three cuts on the beat (2.5 s).
- Finish: flat plates with wobbly edges; brush outline ~1/250 of frame width (blunt start, swelling middle, split dry tail); crachis only on shadow sides, cast shadows and glows: 1–3 px dots at 1920×1080, sparse, under 15 % of the frame, a darker step of the colour beneath; grouped dry-brush streaks on large surfaces; flat even light, shadows as flat plates.
- Avoid: Mucha halos; smooth gradients; regular halftone; all-over speckle.
- Overlaps: new (closest silkscreen-poster)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/31.jpg

### No. 32 · 65mm Epic Arena 3D (after *Ben-Hur*, 1959; refs Yakima Canutt, Andrew Marton, Robert Surtees)
- Lemo name: "3D Circus Chariot Race, 65mm Epic" · render 3D · tone 3D · blend: procedural 3D (three.js); MGM Camera 65 widescreen; Technicolor print grade; second-unit action staging
- One line: a procedural 3D monument-filled arena in hard desert sun with a warm Technicolor print grade and 65 mm grain.
- Palette: cobalt sky fading to sandy white (low sun: amber sky); marble, gilt, red granite, sandstone (no hex); hero e.g. orange `#D97757`, the most saturated thing in frame.
- Type: none on screen.
- Motion & camera: signature = low tracking shot beside the moving hero at 35–50 mm full-frame equivalent; then wide, top-down, close-up, low angle; every set-up moves with the action; repeated motion (stride, wheel, oar) keeps time with speed.
- Cuts & rhythm: demo 6 shots in 5 s (0.6–1.1 s each).
- Finish: hard high sun ~50°, short crisp shadows; warm sunlit haze mixing ~20 % into mid-distance colours; warm, saturated, slightly contrasty grade with no clipping or bloom; fine grain ±3 %; slight gate weave.
- 3D: monumental architecture with mouldings and fluted columns (never bare boxes), statues and repeated elements filling the background; dust.
- Avoid: clean CG light; empty or primitive sets; overexposure.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/32.jpg

### No. 33 · Title-Line Office in B&W (after *The Apartment*, 1960; refs Saul Bass titles, Joseph LaShelle, Alexandre Trauner)
- Lemo name: "Saul Bass Line Titles in Black & White" · render 2D · tone 2D·B&W · blend: Bass title design; one-point perspective office; B&W film grain; one warm accent
- One line: thin white title lines slide in on black and build an endless one-point-perspective set, then fill with flat greys; one orange-red accent.
- Palette: 4–5 even grey steps from `#140F0D` to `#F4F1E8`; the only warm colour orange-red `#E2472A` (hero + one prop); all light stays white.
- Type: none on screen.
- Motion & camera: a shot opens on black; white lines ~1/800 of frame width slide in and grow into a grid; by 2–3 s grey planes fill in and lights switch on row by row; hold the finished frame 3 s; a fast (crash) push to the hero; a hard cut to top-down where the grid becomes pattern.
- Cuts & rhythm: demo one 1.9 s build shot + 1 hard cut.
- Finish: flat fills; every shape outlined in dark line ~1/600 of frame width; strict one-point perspective, centred vanishing point; identical elements repeat into depth; figures as flat two-tone shapes; B&W film grain.
- Avoid: sketchy lines; gradients; colour leaks; skewed perspective; unfilled wireframe.
- Overlaps: spy-titles (Bass) / swiss-motion (grid)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/33.jpg

### No. 34 · Technicolor Musical Stage Set 3D (after *West Side Story*, 1961; refs Boris Leven, Saul Bass end titles)
- Lemo name: "Technicolor 3D Stage Set" · render 3D · tone 3D · blend: procedural 3D (three.js); Technicolor sunset grade; Leven set design; 1961 poster red sky, black fire escape
- One line: a saturated, stagey 3D city block under a red-orange painted sunset, dense built detail and puppet-like dancers.
- Palette: painted sky red-orange `#E0481E` with gold-edged cloud bands, violet only at the top edge; hero saturated orange `#D97757`, ≥ 1/6 of frame height, set against dark brick or given a black rim so it never melts into the sky; warm haze in the distance.
- Type: none on screen.
- Motion & camera: signature = low angle against the orange sky; then one continuous descent into the set and a ground-level push; leaps as one clean arc from crouch to landing squash; snaps on drum hits; a push until a flame sits at frame centre (used as a match cut into No. 35).
- Cuts & rhythm: demo 4 shots in 5 s.
- Finish: theatrical light: low warm sun raking long shadows, cool fill at a quarter of the key; warm saturated grade; fine grain ±3 %.
- 3D: simplified geometry with dense detail on every built surface (sills, ledges, railings, ladders, strung lines); textured brick, plaster or rock, never plain; puppet-like mannequin figures.
- Avoid: photoreal grime; violet-pink skies; plain walls; poses that pop.
- Overlaps: new (closest lowpoly-island / tilt-shift as stylised 3D)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/34.jpg

### No. 35 · Epic Poster Gouache, Warm-Cool Split (after *Lawrence of Arabia*, 1962; refs Howard Terpning poster, Freddie Young)
- Lemo name: "Terpning Epic Poster Gouache" · render 2D · tone 2D · blend: gouache and oil poster painting; Terpning's 1962 poster; Young's 70 mm desert light
- One line: a hand-painted 1960s epic poster: directional gouache strokes, three-value modelling and a hard amber-sand vs cobalt-sky contrast.
- Palette: cobalt sky `#1F4D97` to pale blue `#A9C3D6`, warming to cream near a low sun; ground `#EEC27A` (any terrain); ochre-red `#B56A33` skin, earth, costume; violet `#6C6394` distant shadows.
- Type: none on screen.
- Motion & camera: bounce; slow push to a low close-up; whip pan out (used as a hand-over); jolting camera-car shake; opened with a match cut (flame → sun at frame centre).
- Cuts & rhythm: demo 3 shots in 2.5 s; action held at a constant 1.5×.
- Finish: opaque mid-tone base, then directional strokes following each form (1/80–1/50 of frame width on large areas, smaller on faces and hands), soft-blended edges; dry-brush only on dust, cloth, distant figures; sharp warm-cream highlights last on lit edges; light board grain ±3 %; warm vignette; haze. Hero centred and largest, diagonal gesture, cloth streaming.
- Avoid: scratchy uniform hatching; flat digital fills; cold-only colour.
- Overlaps: impasto (poster gouache variant)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/35.jpg

### No. 36 · Hand-coloured Georgian Satire Print (after *Tom Jones*, 1963; refs Hogarth, Rowlandson, Gillray)
- Lemo name: "Hand-Coloured Georgian Satirical Print" · render 2D · tone 2D · blend: Hogarth copperplate engraving; Rowlandson/Gillray hand colouring; satirical speech balloon
- One line: swelling burin lines and form-following hatching under bright hand colour brushed slightly off the line, with a slanted speech balloon.
- Palette: claret `#B3262E`; brass `#D8A93A`; flesh `#F0C4A4`; slate blue `#6D8AA6`; warm ochre and umber on large surfaces (no hex); brown-black line; sepia laid paper.
- Type: one slanted handwritten speech balloon in the user's language.
- Motion & camera: hold the full plate 2 s, whip in, glide to another detail (replacing shot/reverse), close-up; an object clapped over the lens to black as the exit.
- Cuts & rhythm: demo 1 cut in 2.5 s.
- Finish: burin outlines ~1/400 of frame width, heavier on the shadow side; hatching on every surface spaced ~1/250 of frame width, cross-hatched in darks, ruled on flat areas; washes spill a few px off the line and cover nearly the whole picture; foxing, plate mark, engraved border; Hogarth-style staging with caricatures, bystanders, comic props and animals.
- Avoid: even mechanical hatching; blank paper; colour exactly inside lines; muddy colour.
- Overlaps: engraving
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/36.jpg

### No. 37 · Pink-wash Fashion Illustration (after *My Fair Lady*, 1964; refs Bob Peak poster, Cecil Beaton)
- Lemo name: "Bob Peak Fashion Illustration" · render 2D · tone 2D · blend: fast ink line; pink and magenta watercolour; Peak's 1964 poster; Beaton's Ascot costumes
- One line: fast dry-edged ink line, solid black-and-white costume pattern over loose pink and magenta pools, a frieze of slender profile figures.
- Palette: bare paper faces `#FBF7F1`; main field pink `#EE84B2`; hot spots magenta `#CE3076`; rose `#F4B2CC`; touch of plum `#80285C`; warm grey for secondary figures and shading (no hex); solid black for dark clothing, hats, stripes.
- Type: none on screen.
- Motion & camera: slow drift along the figures; graphic-mask transitions (demo: hat brim lifting out of black; closing into two binocular circles that the next film opens inside); pans.
- Cuts & rhythm: three unhurried cuts in 2.5 s.
- Finish: ink line 1/600–1/250 of frame width, thicker in turns, dry-brush tail and flick-off, thinning on tight curves; soft-edged watercolour pools darker at drying edges; directional splatter; washes cover 60–80 % of the frame; figures 9–10 heads tall repeated across the frame; settings as a few lines in the washes.
- Avoid: even-width outlines; flat digital fills; polygon-edged washes; a lone figure on an empty page.
- Overlaps: watercolor / urban-sketch (fashion variant): mostly new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/37.jpg

### No. 38 · Storybook Alpine Aerial 3D (after *The Sound of Music*, 1965; refs Ted McCord, Miyazaki meadows)
- Lemo name: "Storybook 3D Alpine Aerial" · render 3D · tone 3D · blend: procedural 3D terrain (three.js); Todd-AO widescreen colour; McCord's helicopter opening; Miyazaki meadows
- One line: smooth sculpted storybook 3D mountains in saturated emerald, cobalt and snow white, with gusts running through the grass.
- Palette: emerald grass `#3FA33A`; cobalt sky `#2F6FD0`; clean white snow and clouds; haze only on farthest ridges, ~25 % lilac; grey-ochre rock bands (no hex).
- Type: none on screen.
- Motion & camera: one continuous move: 0–2 s high flight, 2–4 s descent, then a low orbit through the grass around the subject at ~20°/s with the subject ~1/4 of frame height; cuts land mid-turn of a continuous spin.
- Cuts & rhythm: demo 3 shots in 2.5 s, opening inside two binocular circles carried from the previous film.
- Finish: bright high sun a little behind camera; cloud shadows; a lower sun lengthens shadows and warms only cloud edges.
- 3D: procedural terrain with rounded ridges, snow lines following slope; cumulus as lit white cotton puffs; knee-high grass and wildflowers in the foreground bending in gusts.
- Avoid: violet wash; needle peaks; grey photoreal rock; static grass.
- Overlaps: lowpoly-island (but smooth, not low-poly): new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/38.jpg

### No. 39 · Tudor Glazed Oil Portrait (after *A Man for All Seasons*, 1966; ref. Hans Holbein the Younger, *Sir Thomas More* 1527)
- Lemo name: "Holbein Tudor Portrait in Oils" · render 2D · tone 2D · blend: Old Master oil glazing; Holbein's More; candlelit Tudor interior
- One line: an Old Master half-length portrait in glazed oils, every material rendered (fur hair by hair, velvet ridges, chain links), varnish and craquelure.
- Palette: deep green curtain `#1F4A26`; black `#141113`; velvet red `#6E0C15`; gold `#B0801E`; fur brown `#3E2818`; warm, fully modelled skin.
- Type: none on screen.
- Motion & camera: signature = the portrait against the curtain; material close-ups; a slow pull-back into a dark room lit by warm pools; a guttering candle takes the frame dark. Stillness: tiny actions (eyes to lens, blink, nod).
- Cuts & rhythm: demo 1 cut then one long 1.6 s pull-back.
- Finish: painted in layers: toned underlayer, directional strokes following light and shadow, soft glazes, fine detail last; brushwork faint in background and fabric; metal with two highlights per piece; soft light from upper left; warm varnish; light craquelure. Any subject becomes a formal half-length sitter with its setting through a window or in a held object.
- Avoid: flat fills; hard digital edges; even light; unmodelled faces.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/39.jpg

### No. 40 · Three-ink Risograph Night (after *In the Heat of the Night*, 1967; refs Haskell Wexler, Tom Haugomat)
- Lemo name: "Three-Ink Risograph Night" · render 2D · tone 2D · blend: Risograph overprint; 1967 poster orange-red; Wexler night exteriors; silhouette staging
- One line: a hot orange-red Riso field with deep-blue silhouettes and fluorescent-pink rims, where light is printed as missing ink.
- Palette: orange-red `#EC5032` dominant field (~60 %, with drip streaks); deep blue `#162C76` silhouettes and shadows; fluorescent pink `#FF48B0` only for rims and halos; warm paper `#F7F2E7`; skin 30–60 % orange with a blue shadow step.
- Type: none on screen.
- Motion & camera: handheld behind someone carrying a light (flashlight POV); a reverse close-up; a push.
- Cuts & rhythm: demo 3 cuts in 2.5 s building a confrontation.
- Finish: each ink halftoned at its own angle, dots 1/300 of frame width; plates misregistered 2–4 px; grain, pinholes, slight boil; orange knocked out under blue so silhouettes print pure blue; only the darkest accents overprint to near-black; beams, lamps, lit ground show bare paper ringed in pink; at cooler times blue rises only into the top of the sky.
- Avoid: blue-dominated frames; smooth gradients; a fourth ink; clean registration.
- Overlaps: risograph
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/40.jpg

### No. 41 · Victorian Toy Theatre 2.5D (after *Oliver!*, 1968; refs Pollock's toy theatre, George Cruikshank)
- Lemo name: "Victorian Toy Theatre" · render 2.5D · tone 2.5D · blend: Pollock's toy theatre; hand-coloured lithograph sheets; cut card with footlight shadows; Cruikshank caricature
- One line: hand-coloured lithographed card figures with white scissor margins on wire slides, parallax flats and flickering candle footlights throwing big shadows.
- Palette: deep red `#C8262C` and dull gold `#E0AB36` on proscenium and curtains (never bright yellow); blue `#2F5A9A` costumes; cream card `#F4ECD6`; scenery, sky, water, skin in greyed browns and greys (no hex).
- Type: none (demo proscenium sign "Theatre Royal").
- Motion & camera: slow push; lateral tracking; shaky close-ups (shake on a roar); a final pull-back reveals the dark room and the player's hand. Three clearly different shot sizes (wide → stage → close) to build a beat.
- Cuts & rhythm: demo 3 shots in 2.5 s.
- Finish: black litho outlines ~1/400 of frame width; sparse crayon hatching on one side of each piece; white scissor margin 1/200 of frame width on every cut-out; candle footlights cast each cut-out's shadow onto the scenery behind at ~1.5× enlargement, soft and flickering; stage opening 80–90 % of frame width inside a gilt proscenium with red drapes and painted audience boxes.
- 3D: parallel 2.5D layers in parallax, each flat within its plane.
- Avoid: bright vector colour; true 3D depth; soft studio light; figures without margins.
- Overlaps: paper-popup / shadow-puppet / papercut-red (card theatre): partly new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/41.jpg

### No. 42 · Pop Photo-Silkscreen Repeat (after *Midnight Cowboy*, 1969; ref. Andy Warhol, *Double Elvis* 1963)
- Lemo name: "Warhol Photo-Silkscreen, Double Elvis" · render 2D · tone 2D · blend: photo silkscreen; Warhol; silver paint ground; off-register colour blocks
- One line: a black halftone photo printed unevenly over loose flat colour blocks on silver, the figure repeated two then three times.
- Palette: taxi yellow `#F3BE14`; skin pink `#F2A197`; cream `#EFE6CF`; red `#E2462B`; brushed silver ground `#BABCC0` with a soft sheen; hero takes the strongest block colour.
- Type: none on screen.
- Motion & camera: handheld shake; a push in; flat frontal tableaux; a scene "drains to silver and prints itself" into the repeat as the transition.
- Cuts & rhythm: demo 3 shots in 2.5 s.
- Finish: high-contrast black halftone at 45°, dots ~1/200 of frame width, few mid-tones; colour blocks offset ~1/100 of frame width with wobbly edges; uneven squeegee pressure (dots flood into blotches, drag into dry horizontal streaks and pinholes); faint canvas weave; repeats full-length side by side, slightly overlapping, on empty silver; settings only as drained-to-silver prints.
- Avoid: clean even halftone; perfect registration; uniform crispness.
- Overlaps: silkscreen-poster / halftone-dossier: new as pop-art
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/42.jpg

### No. 43 · WWII War-Bond Lithograph (after *Patton*, 1970; refs US war-bond posters 1942–45, J. C. Leyendecker)
- Lemo name: "WWII War-Bond Lithograph" · render 2D · tone 2D · blend: stone lithograph poster; 1942–45 US war-bond and recruiting posters; 45° halftone, off-register colour stones
- One line: posterised flat-ink lithograph with a dark key line and coarse halftone shadows: a tiny figure before a stage-high graphic shape.
- Palette: red `#C2342C`; navy `#213261`; olive `#5F5C31`; khaki `#B7975E`; fibrous, foxed cream paper `#E6D5B3`; brown-black key line.
- Type: lettering optional, in the user's language; face not given.
- Motion & camera: slow push-ins; one crisp pull-back (demo shrinks the hero before the flag to an empty theatre); a graphic match from the previous frame (stripes) as the entry.
- Cuts & rhythm: demo 2 hard cuts in 2.5 s; the salute snaps up on the cut.
- Finish: three values per form (bare paper, flat ink, ink + halftone) in hard posterised steps; key line ~1/500 of frame width printed last; shadows as coarse 45° halftone bands (dots ~1/150 of frame width) with crayon grain; colour plates offset ~1/600 of frame width; lights as hard pale shapes or bare paper. Default composition: symmetrical frontal stage, small subject before a huge shape (flag, emblem, sunburst).
- Avoid: airbrushed gradients; perfect registration; halftone so fine it reads grey.
- Overlaps: silkscreen-poster / kino-montage (propaganda poster)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/43.jpg

### No. 44 · Pushed-16mm Street Chase 3D (after *The French Connection*, 1971; refs William Friedkin, Owen Roizman)
- Lemo name: "16mm Chase Under the El" · render 3D · tone 3D · blend: three.js 3D street set; 16 mm documentary grain; cold cyan-shadow print grade
- One line: a dense 3D street finished as gritty pushed 16 mm: cold grey, cyan shadows, warm brick-brown mid-tones, clumped grain, handheld rush.
- Palette: neutral-cold greys `#7A7C7A`; cyan shadows `#1E2A2C`; warm-brown mid-tones `#6E4A34` in brick, wood, vehicles (≥ a quarter of the frame); hero saturated e.g. `#D97757`; never an overall blue; sky near-white.
- Type: none on screen.
- Motion & camera: handheld cameras ride the action: a low 18–25 mm lens rushing forward as repeated objects strobe past (bumper mount, motion blur in the demo); a rig looking back at the subject; a corner wide; vehicle shake. The action clock runs ahead of screen time to read as more speed.
- Cuts & rhythm: demo 3 hard cuts in 2.5 s, no pauses.
- Finish: low saturation, high contrast; grain clumps ~1/700 of frame width at ±8 % brightness; gate weave; flicker; dust; occasional faint ghosts of bright lights; default overcast; sun through any overhead grid falls in hard stripes.
- 3D: detailed street set with dense clutter fitting the place.
- Avoid: clean CG shine; blue tint; empty places; mushy grain.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/44.jpg

### No. 45 · Top-light Chiaroscuro Oil (after *The Godfather*, 1972; refs Gordon Willis, Rembrandt, Caravaggio)
- Lemo name: "Rembrandt Top-Light Oil Painting" · render 2D · tone 2D · blend: chiaroscuro oil painting; Willis's top light; Rembrandt and Caravaggio glazing
- One line: deep amber-umber oil where only a single overhead light is warm: thin glazes in the darks, ridged impasto on lit edges, patient camera.
- Palette: umber `#24150B` (~70 % of frame readable warm dark); near-black `#070403` only in the deepest corners; amber mid-tones `#8F5D2A` (~20 %); top planes up to `#E2B673`; one red accent `#9C1A1A`.
- Type: none on screen.
- Motion & camera: slow pull-backs and pushes; all at 1× (patient); hero stands in the light pool (lit area ≥ 1/4 of frame height), brows shading the eyes; tiny repeated action (a stroke taking ~4 s, one blink).
- Cuts & rhythm: demo 4 shots in 5 s, hard cuts.
- Finish: darks as thin smooth glazes; lights as thick impasto with ridged strokes ~1/100 of frame width; soft modelling, never scratchy; amber varnish; heavy vignette; canvas grain ±3 %; a warm bright opening may glow behind; an in-frame lamp is a small glow, not a second key.
- Avoid: lifting the darks; flat light; faces popping out; frames too dark to read.
- Overlaps: impasto (glazed variant): new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/45.jpg

### No. 46 · 1930s Magazine Cover Illustration (after *The Sting*, 1973; refs Leyendecker, Rockwell, Jaroslav Gebr)
- Lemo name: "Saturday Evening Post Illustration" · render 2D · tone 2D · blend: Saturday Evening Post cover illustration; Leyendecker block modelling; Gebr's chapter cards
- One line: warm, clean realist magazine illustration built from blocky lit planes and form-following strokes, one long push in.
- Palette: plaster `#E2C492`; oak `#764626`; slate `#28322C`; brass `#E2B046`; ink `#341E18`; oak and ink darks ~1/3 of frame; sky = plaster cooled with slate; water light slate; skin plaster + brass.
- Type: none on screen.
- Motion & camera: one long smooth push in (demo: no cut at all, 2.5 s); each figure drawn once and moves whole (breathing, sway, sliding along a path); a wink/gesture to camera at the end.
- Cuts & rhythm: no cuts.
- Finish: planes (lit, shadow, warm bounce from below) filled with blended strokes ~1/150 of frame width, varied in length, following form, never stripes; dark contour thicker on the shadow side, 1/800–1/300 of frame width; warm key from upper left; grainy board ±3 %; warm vignette; one-point perspective, period detail, haze.
- Avoid: stiff cut-out figures; even outlines; muddy colour.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/46.jpg

### No. 47 · Hand-tinted Silver Print 2.5D (after *The Godfather Part II*, 1974; refs Lewis Hine, Augustus Sherman)
- Lemo name: "Hand-Tinted Sepia Photograph" · render 2.5D · tone 2.5D · blend: toned silver print; Hine's Ellis Island photographs; hand-brushed dyes; raymarched 3D figures
- One line: lit 3D figures "printed" as a turn-of-the-century toned silver photo with loosely brushed dyes, foxing and silvered edges.
- Palette: sepia range `#281A12`, `#987048`, `#EEE0C2` (≥ a fifth of the frame at the dark end); hero dye e.g. orange-red `#D97757` at 60–80 % opacity; faint dye on one or two props (demo verdigris, red, blue; no hex); dyes die in shadow.
- Type: none (demo a name tag prop).
- Motion & camera: frontal, documentary: figures stand still facing the lens; slow pan across faces; POV push; slight pull-back.
- Cuts & rhythm: demo 3 hard cuts in 2.5 s (screen time ~1.3×, key shot at 1×).
- Finish: soft key from upper left, then "print": soft focus, light halation, grain heaviest in mid-tones ±5 %; vignette; silvered edges (grey-blue sheen in border darks); small foxing spots; fine scratches; at most one cracked corner; dyes brushed loosely past edges.
- 3D: raymarched lit forms with real proportions (head 1/7 of body), soft shading.
- Avoid: toy figures; digital fill colour; low-contrast fog; big mould blotches.
- Overlaps: archive-lighttable (sibling of No. 4)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/47.jpg

### No. 48 · Quiet American Realism (after *One Flew Over the Cuckoo's Nest*, 1975; ref. Edward Hopper)
- Lemo name: "Hopper-Style American Realism" · render 2D · tone 2D · blend: Hopper realism; hard-edged slanting window light; flat oil planes with dragged strokes
- One line: big flat pale-green planes, hard parallelograms of low sun, figures standing apart in stillness, then one sudden event.
- Palette: institutional greens `#9EB8A0` and `#5E7C66`; grey-green floor `#7E8876`; cream `#ECE6D2`; warm light `#FCE6AC`; sky pale cream-green; skin warmed cream; clothes darkened greens.
- Type: none on screen.
- Motion & camera: stillness, then one sudden event under a second (a whip pan, a burst of light); signature = a still one-point interior with light on the floor; blurred whip pans replace cuts (demo one 2.5 s travelling shot).
- Cuts & rhythm: no hard cuts; whip pans.
- Finish: visible canvas ±3 %; a few long dragged strokes ~1/80 of frame width at 5–10 % off the base; hard-edged light parallelograms crossed by crisp shadows of frames or railings; figures from 3–4 overlapping soft-edged value shapes, no outline, real proportions.
- Avoid: heavy outlines; vector figures; dark saturated walls; fuzzy light patches.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/48.jpg

### No. 49 · Sunrise City on 35mm 3D (after *Rocky*, 1976; refs John G. Avildsen, Garrett Brown, James Crabe)
- Lemo name: "Philadelphia Sunrise, 3D on 35mm" · render 3D · tone 3D · blend: three.js 3D city; 1970s 35 mm film grade; Steadicam chase and rising orbit
- One line: a detailed 3D city at sunrise graded like 1970s 35 mm: low gold sun, cold blue sky, long shadows, fine grain, a rising orbit at the climax.
- Palette: sun warm orange `#F0A060` (sun 5–10° up, side or three-quarter front, no full backlight); cool blue sky `#7FA3CF`; pink cloud undersides `#E6B2AE`; haze golden toward the sun, blue-violet away.
- Type: none on screen.
- Motion & camera: a low Steadicam following the hero from behind up an ascent; at the top one continuous orbit that circles, rises and pulls back over 6–8 s, showing the lit face, until the place spreads out below (demo compressed to 2.1 s); montage shots fixed-camera.
- Cuts & rhythm: demo montage at ~1.7× over three quick cuts (0.4–0.6 s), then no cut: the run flows straight into the orbit at 1×.
- Finish: fine grain ±3 %; cool shadows, warm highlights, nothing clipped; flare and ghosts only with the sun in frame.
- 3D: detailed city world; long ground shadows must read.
- Avoid: flat noon light; detail-less silhouettes; a static climax; plastic CG shine.
- Overlaps: new
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/49.jpg

### No. 50 · Magazine Gag Cartoon, Nib and Wash (after *Annie Hall*, 1977)
- Lemo name: "New Yorker Cartoon, Ink and Wash" · render 2D · tone 2D · blend: New Yorker single-panel cartoon; nib-pen ink line; light watercolour wash; hand-lettered caption
- One line: a full-bleed single-panel gag cartoon: lively nib line, a few pale pooled washes, lots of white paper and one deadpan hand-lettered caption.
- Palette: wash grey `#9698A0`; sea blue `#78A0BE`; sand `#E2CCA0`; rust `#C45C32`; cold-press paper `#FBF8F1` fading to white at the edges
- Type: one hand-lettered caption line under the action, about 1/30 of frame height, written out letter by letter (no typeface)
- Motion & camera: the drawing holds still, only living things wobble; small drifts and pushes; the frame may split into two side-by-side drawings; demo runs about 1.8× with the key action near 1×
- Cuts & rhythm: hard cuts; a split screen used as a graphic exit; demo shots 0.6 / 1.5 / 0.4 s
- Finish: nib line about 1/1000 of frame width on straights, swelling to 1/300 in turns, flicking off at the ends; box corners overlap; washes with pooled edges slip past the lines by at most 1/150 of frame width
- Avoid: saturated colour; uniform vector lines; a small framed panel floating in white
- Overlaps: urban-sketch (pen & wash), plus a gag-cartoon caption grammar
- References: James Thurber, William Steig, Jean-Jacques Sempé
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/50.jpg

### No. 51 · Dry Egg Tempera, Hatched Grass (after *The Deer Hunter*, 1978)
- Lemo name: "Andrew Wyeth Egg Tempera" · render 2D · tone 2D · blend: Egg tempera on gesso; Andrew Wyeth; fine cross-hatched strokes
- One line: a dry, matte, lonely landscape built from hairline cross-hatching in muted straw and umber under a pale empty sky, the subject small and off-centre.
- Palette: overcast sky `#D9D5C6`; straw grass `#CDB27A`; umber `#6A5234`; misty grey-green hills `#8E938C`; rust `#8A4E32`; one accent only on the hero (e.g. a red cap, hex not given); water, stone, clothes and skin mixed from these
- Type: none on screen
- Motion & camera: slow drift, quiet push; a through-the-scope shot with a black circular mask and crosshair swaying with the hands; demo never faster than about 1.25×
- Cuts & rhythm: four hard cuts in 2.5 s (0.6 / 0.7 / 0.3 / 0.8 s); a circular iris may mark a cut
- Finish: colour from dense cross-hatched strokes about 1/400 of frame width long, hairline thin; ground built as big light/dark patches, then fine strokes, dark tufts, then single wind-combed blades; rocks and buildings hatched along their planes; soft overcast light; any light source a small pale dot with no halo; no warm glow at any time of day
- Avoid: wet watercolour blooms; saturated colour; thick shiny strokes
- Overlaps: new (closest: impasto, but dry and hatched instead of thick)
- References: Andrew Wyeth (*Christina's World*, 1948; *Winter 1946*); cinematographer Vilmos Zsigmond
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/51.jpg

### No. 52 · Child's Wax-Crayon Drawing (after *Kramer vs. Kramer*, 1979)
- Lemo name: "Child's Wax-Crayon Drawing" · render 2D · tone 2D · blend: Wax crayon on textured paper; 6–8-year-old's drawing conventions; hand-lettered labels
- One line: a careful 6–8-year-old's crayon picture: wobbly outlines, back-and-forth scribble fills, arrowed labels and a smiling sun.
- Palette: red `#E0382C`; orange `#F28A1E`; yellow `#F7D23A`; green `#3AA345`; blue `#2E6BD8`; outlines black or dark-brown crayon (hex not given); white paper
- Type: text in the user's language drawn as wobbly crayon strokes, never a typeface; one mirrored letter (in Chinese, a reversed stroke)
- Motion & camera: shaky handheld close-ups, then a calm drift; demo about 1.35× overall
- Cuts & rhythm: a match cut on the same object (first vs last attempt) compresses time; demo 0.7 / 0.4 / 1.4 s
- Finish: crayon catches the paper-grain peaks: light pressure leaves 40–60 % paper showing, heavy pressure fills it; overlaps show through; outlines about 1/300 of frame width; fill strokes about 1/40 of frame width long and 1/250 wide, rows overshooting the outlines, each area in its own direction with uneven spacing and angle; child conventions: ground line, flattened perspective, arrowed labels, smiling sun, patterns coloured cell by cell
- Avoid: neat adult rendering; random scrawl; uniform stipple or mesh; smooth gradients
- Overlaps: crayon-book
- References: children's drawings ages 6–8; cinematographer Néstor Almendros
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/52.jpg

### No. 53 · Autumn Transparent Watercolour (after *Ordinary People*, 1980)
- Lemo name: "Autumn Transparent Watercolour" · render 2D · tone 2D · blend: Transparent watercolour glazes; Winslow Homer and John Singer Sargent; HB pencil underdrawing
- One line: quiet layered watercolour glazes with tide-mark edges and paper-white highlights, autumn gold and rust against cool grey-blue mist.
- Palette: autumn gold `#ECAA34`; scarlet `#E46030`; rust `#B8743C` (foliage, accents); grey-blue mist `#C2C6D2`; violet-grey shadows `#8A8496`; sky pale and cool at any time of day; ground pale green-ochre (hex not given); paper is the brightest white
- Type: none on screen
- Motion & camera: slow pan, gentle push, leaves drifting past the lens; demo at 1.1× throughout
- Cuts & rhythm: three hard cuts (0.8 / 1.0 / 0.7 s)
- Finish: shapes drawn crisply first, then 2–3 glazes, each smaller and darker, drying to a tide-mark edge; 2–3 blooms about 1/10 of frame width inside large washes, never on figures; light granulation ±4 %; sky and water wet-in-wet, ripples dry-brush; foliage as pale wash, scallop-edged clusters, dark dots, flicked leaves; light from one side
- Avoid: opaque gouache; airbrushed blur; vector edges; muddy colour; saturated sunsets
- Overlaps: watercolor
- References: Winslow Homer and John Singer Sargent watercolours; cinematographer John Bailey
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/53.jpg

### No. 54 · 1920s Four-Stone Lithograph Poster (after *Chariots of Fire*, 1981)
- Lemo name: "1924 Paris Olympics Stone Lithograph" · render 2D · tone 2D · blend: Four-stone lithograph; Jean Droit's 1924 Olympic poster; classical anatomical figures
- One line: a pale, calm 1920s poster in four grainy inks on aged cream, classical athletes in a row, slow motion carried by spray and cloth.
- Palette: sea blue `#245A8C` (sky, water, cool shadow); ochre `#D49640` (ground, skin); deep brown `#40271B` (outlines, darks, clothes); warm red `#E47E62` (sparingly); aged cream paper `#F1E7D1`
- Type: optional serif title band that prints in over the last shot (face not given)
- Motion & camera: long-lens front views, ground-level shots, lateral slides; slow motion is carried by spray, dust, hair and cloth; the demo runs at 1× and reads as slow motion
- Cuts & rhythm: four hard cuts (0.7 / 0.6 / 0.5 / 0.8 s); the final shot becomes the poster as the title band prints in
- Finish: inks misregistered about 1/700 of frame width; every tone is ink grain, never a flat fill: specks about 1/1000 of frame width in soft clumps covering 20–40 % of pale areas, 50–80 % of mid-tones, nearly all of solids (with pinholes); no stray specks on bare paper; classical figures with an ochre lit side and a brown core-shadow line down each limb, head 1/8 of the body; values calm and pale
- Avoid: coarse speckle; pictogram figures; vector fills
- Overlaps: silkscreen-poster / risograph (but lithographic grain, not flat inks or halftone)
- References: Jean Droit, 1924 Paris Olympics poster
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/54.jpg

### No. 55 · Hand Block Print on Cotton (after *Gandhi*, 1982)
- Lemo name: "Rajasthani Hand Block Print" · render 2D · tone 2D · blend: Bagru dabu indigo resist; Sanganer block-printed borders; Rajasthani miniature profiles
- One line: a flat cotton frieze stamped in indigo, madder and turmeric with a carved black key block, slipping at the block seams.
- Palette: undyed cotton `#EEE5CF` (ground, over half the frame, and skin); indigo `#2A3A68` (water/sky bands, patterns); madder red `#AA322A` (borders, clothing, hero); turmeric `#DEA42C` (small motifs); black key block `#281E1C` (outlines)
- Type: none on screen
- Motion & camera: pan along the frieze, push in; cut on a turning motif (demo ends on a spinning wheel used as a spin transition); demo 1.1×, no slow motion
- Cuts & rhythm: hard cuts (0.8 / 1.1 / 0.6 s); cut on a turning motif
- Finish: stamp blocks about 1/8 of frame height, misregistered 2–4 px, tone jumping slightly at the seams even in large bands; dye bleeds along the weave and fills unevenly; mud-resist crackle only inside indigo, fine and sparse; carved, rough outlines about 1/300 of frame width; a paisley-and-vine border; waves as scallop rows; profile figures with miniature-painting faces and kohl-lined eyes
- Avoid: vector edges; perfect registration; faceless figures; dense crackle; indigo flooding the frame
- Overlaps: new (closest: woodcut for the carved key block, papercut-red for the frieze)
- References: Bagru dabu and Sanganer block prints; Rajasthani miniature painting
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/55.jpg

### No. 56 · Faded Family-Album Snapshots (after *Terms of Endearment*, 1983)
- Lemo name: "Family Album Polaroids" · render 2D · tone 2D · blend: SX-70 and Polaroid 600 prints; Kodacolor snapshots; 1970s–80s magnetic-page album; panning-shot motion smear
- One line: an open album of faded Polaroids seen from above; the camera pushes into one print and it comes alive as colour floods back.
- Palette: blacks lifted to teal-grey about `#2F3A3A`; creamy rolled-off highlights and a mild warm cast (hex not given); white Polaroid borders; cream album pages; saturation about 60 % of normal
- Type: ballpoint captions in the user's language (handwritten; no face given)
- Motion & camera: overhead push into one photo until it fills the frame (about 3 s), a cut into the living scene as colour returns, then a pull-back; moving subjects get a panning-shutter look (background smeared sideways, subject sharp); still subjects get shallow depth of field; demo about 1.8× overall
- Cuts & rhythm: the push-in becomes a cut into the photo; demo 1.2 / 0.8 / 0.5 s
- Finish: faded dyes, slight overexposure, softness, fine grain ±4 %; soft even overhead light on the album with a faint plastic sheen; photo-booth strips of four stacked frames; people look photographed (real proportions, soft shading, slight blur, small faces)
- Avoid: flat cartoon shapes; crisp modern colour; light shafts; saturated prints
- Overlaps: archive-lighttable (photos on a surface), but nostalgic and fictional rather than evidential
- References: Polaroid SX-70, Kodacolor prints, 1970s magnetic-page albums
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/56.jpg

### No. 57 · Rococo Cut Silhouettes in Candlelight (after *Amadeus*, 1984)
- Lemo name: "Rococo Silhouettes in Gilt Candlelight" · render 2D · tone 2D · blend: 18th-century cut silhouettes; Rococo gilt relief; Candlelight bloom; Schinkel's star vault
- One line: black paper profiles rimmed in gold fill a gilt-and-velvet opera house facing a bright stage, flickering in candlelight.
- Palette: silhouette black `#0B0705`; pale-gold rim `#F7E3A0`; gilt relief `#B88A2E`; red velvet `#6E0F14`; night blue `#0C1A3A` (far sky only); reds and golds fill most of the frame
- Type: none on screen
- Motion & camera: signature shot = silhouettes framing a bright stage far back; slow lateral glide, then push; demo is one continuous track-and-crane (1.6 s) then a hard cut; real time, no slow motion
- Cuts & rhythm: one long move landing on the music's peak note, then a hard cut (1.6 / 0.9 s)
- Finish: each profile has its own cut detail (hair, nose, lace holes, props), a 2–3 px pale-gold rim at 1920×1080 toward the nearest flame, and hairline gold lines along clothing folds; only the hero gets a painted, coloured face; candles flicker ±5 % with warm halos about five flames wide; light haze, vignette, fine grain (amounts not given); an outdoor subject becomes a lit painted backdrop on a stage
- Avoid: plain black blobs; copy-pasted profiles; blue walls; strobing flames
- Overlaps: shadow-puppet / paper-lantern (cut paper and light), but front-lit gilt theatre
- References: silhouettists Augustin Edouart, John Miers; Schinkel's Queen of the Night set (1815); cinematographer Miroslav Ondříček
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/57.jpg

### No. 58 · Warm Widescreen Aerial 3D (after *Out of Africa*, 1985)
- Lemo name: "3D Biplane over the Rift Valley" · render 3D · tone 3D · blend: three.js real-time 3D; David Watkin aerial photography; Warm filmic grade; Instanced flamingo flocks
- One line: pale, hazy late-afternoon flight over open land in real-time 3D, thousands of birds lifting in staggered waves as the hero passes.
- Palette: flock pink `#F3B3AE` with crimson `#DF3F55` (example); pale cream sky, amber haze, ochre ground, warm-grey shadows (hex not given)
- Type: none on screen
- Motion & camera: signature shot over the moving hero's shoulder across open land; then a high chase 10–20 m up and one shot straight into the sun; the in-story flight clock runs 1.5–1.6× screen time
- Cuts & rhythm: two exterior hard cuts for speed and scale, then a held interior shot for the gesture (0.8 / 0.7 / 1.0 s)
- Finish: about 70 % of the frame in light mid-tones, under a fifth near-white, shadows warm grey, not deep brown; filmic curve, low saturation, light grain, soft vignette (values not given); distant ridges in 3–4 paler layers; long soft shadows
- 3D: true-scale models with fine detail (struts, wires, rivets); smooth terrain, not low-poly; low sun behind the hero as seen from camera; thousands of instanced animals lifting in staggered waves
- Avoid: cold clean CG daylight; dark sepia; lockstep flocks
- Overlaps: new
- References: cinematographer David Watkin
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/58.jpg

### No. 59 · Combat-Artist Field Sketch, Pen & Wash (after *Platoon*, 1986)
- Lemo name: "Combat Artist Field Sketch · Pen & Wash" · render 2D · tone 2D · blend: Fast pen line; Transparent wash; Sketchbook paper; Vietnam Combat Artists Program
- One line: a war artist's on-the-spot sketch: fast hard pen, loose olive/ochre/smoke washes, one hot orange, bare paper at the edges.
- Palette: olive `#70783E`; ochre `#CEA054`; smoke grey `#706C70`; hot accent `#F0822E` (sky and light sources only); skin in diluted ochre; sketchbook paper `#F2ECDE`; pen warm black (hex not given)
- Type: a scrawled pencil note (place, time, weather) in a corner, 1/40 of frame height, in the user's language
- Motion & camera: lateral tracks with layered planes; slow pull-outs; demo at 1.1×
- Cuts & rhythm: hard cuts "like turning a page", each shot a different sketchbook page (0.8 / 0.8 / 0.9 s)
- Finish: pen lines about 1/600 of frame width, flicked ends, overshooting corners; quick hatching and zigzags for shadow; bold transparent washes with soft wet edges, blooms and uneven pigment cover about 70 % of the frame, shifted 2–4 px (at 1920×1080) off the line; bare paper only in highlights, a thin edge band and brush gaps; light grain
- Avoid: polished finish; empty page; muddy washes; heavy noise
- Overlaps: urban-sketch (pen & wash), but reportage-fast and war-toned
- References: US Army Vietnam Combat Artists Program (1966–70)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/59.jpg

### No. 60 · Gongbi Court Painting on Silk (after *The Last Emperor*, 1987)
- Lemo name: "Gongbi Court Painting on Silk" · render 2D · tone 2D · blend: Gongbi zhongcai; Ruled-line architecture (jiehua); Qing court scrolls; Storaro's colour
- One line: fine iron-wire outlines and graded mineral colours on warm aged silk, a ruled-line palace and an ordered, symmetrical court.
- Palette: cinnabar `#C23A22`; azurite `#2C5A9A`; malachite `#3A8A6A`; gamboge `#E8B830`; gold `#CAA04A`; all muted by the glaze; ground and sky mid-value warm silk ochre (never near-white, saturated blue or orange); outline dark brown (hex not given)
- Type: none on screen
- Motion & camera: slow pushes; symmetrical one-point composition with a large figure before a deep ordered space; low lateral tracks across rows of figures; demo at 1.1×
- Cuts & rhythm: hard cuts; the demo opens with a curtain of patterned silk parting (1.0 / 0.6 / 0.9 s)
- Finish: per form, far to near: flat base, a wash darkening its lower and overlapped edges, an even iron-wire outline about 1/900 of frame width, gold and white lifts; finally a 30 % warm ochre glaze over everything with lines still clear; no cast shadows or glare; fine-line water ripples; every roof tile drawn; faint silk weave ±3 %; brown vignette; time of day only as overall warmth
- Avoid: copy-pasted figures; unwashed flat fills; loose ink wash; poster saturation
- Overlaps: new (closest: ink-wash, but the opposite: fine line and heavy colour)
- References: Qing court scrolls (*Kangxi's Southern Inspection Tour*, *Qianlong's Grand Review*); cinematographer Vittorio Storaro
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/60.jpg

### No. 61 · 80s Airbrush with Counting Callouts (after *Rain Man*, 1988)
- Lemo name: "80s Airbrush + Raymond's Count" · render 2D · tone 2D · blend: 80s airbrush illustration; Patrick Nagel figures; Hajime Sorayama chrome; Technical-drawing callouts
- One line: high-key 1980s airbrush (hard masks, sprayed gradients, chrome glints, mint and neon pink) overlaid with thin cyan drafting callouts that count things.
- Palette: mint `#79BDA6` (walls/sky); cream (hex not given); neon pink `#F58CB5`; magenta `#C9467F`; black-and-white checker floor; callout cyan `#56E6FF`; callout text near-white `#D9FBFF`; purple and night under 20 % of the frame; pink carries any sunset
- Type: callout text 1/40 of frame height, near-white; monospace numbers that count up as each group is circled (face not given)
- Motion & camera: slow push/pull; overhead views for counting; the count drives the edit; demo 1.1×
- Cuts & rhythm: hard cuts timed to the count (1.0 / 0.8 / 0.7 s)
- Finish: every shape a hard-edged mask filled with a smooth sprayed gradient and a 1–2 px overspray rim (at 1920×1080); figures with flat pale skin, few crisp lines, dark hair masses, pink and mint rim light; metal and glass as banded sky reflection with a hard horizon line and cross-star glints; overlay of dotted leaders, dashed rings, dimension lines
- Avoid: synthwave suns; UI boxes; soft edges
- Overlaps: new (callout overlay resembles hologram-hud / blueprint annotation)
- References: Patrick Nagel; Hajime Sorayama; cinematographer John Seale
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/61.jpg

### No. 62 · Mid-century Magazine-Cover Oil (after *Driving Miss Daisy*, 1989)
- Lemo name: "Rockwell-style Oil Illustration" · render 2D · tone 2D · blend: Norman Rockwell oil illustration; Saturday Evening Post covers; 3D-modelled car repainted in oil strokes
- One line: warm, solid mid-century cover realism: modelled faces, visible but faint oil strokes, afternoon sun through trees, every bystander busy.
- Palette: cream sky `#E6DCC2`; brick red `#9A4A38`; bottle green `#1F3A24`; leaf greens and soft skin (hex not given); shadows cool blue-grey
- Type: none on screen
- Motion & camera: deep three-quarter wide, slow push, then closer cuts ending on a hand or face; locked-off interior shot; demo scene time about 1.8× screen time but unhurried
- Cuts & rhythm: three hard cuts, tighter each time, payoff on the last (0.9 / 0.8 / 0.8 s)
- Finish: figures near-realistic, head about 1/7 of body height, faces and hands modelled from 3–4 value planes, not outlines; strokes about 1/150 of frame width following form, each within ±5 % of the colour beneath; warm afternoon key from upper left with clear cast and dappled cool shadows; gloss reflects surroundings; light canvas texture, warm varnish, soft vignette; a 3D-modelled car repainted in oil strokes
- 3D: blend notes a 3D-modelled vehicle repainted in strokes (render still 2D)
- Avoid: cartoon faces; texture filters; flat digital shading; empty backgrounds
- Overlaps: impasto (oil), but smooth illustrative realism rather than knife texture
- References: Norman Rockwell, *Saturday Evening Post* covers (1940s–50s)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/62.jpg

### No. 63 · Explorer's Field Journal, Pencil & Watercolour (after *Dances with Wolves*, 1990)
- Lemo name: "Field Journal · Pencil & Watercolour" · render 2D · tone 2D · blend: Graphite under-drawing; Transparent watercolour; Iron-gall ink handwriting; Bodmer and Catlin field sketches
- One line: a 19th-century field journal that comes alive: visible pencil under rich warm magic-hour washes on yellowed rag paper with inked notes.
- Palette: pencil `#3A363A`; dusty-rose sky `#C88F76` turning lavender above; ochre-gold land `#DEBE87`; yellowed rag paper `#F0E4C8`; iron-gall ink `#34221C` (labels, arrows); violet distance and pale-gold lifts (hex not given)
- Type: small iron-gall ink labels and arrows (handwritten)
- Motion & camera: signature move once at the opening (about 2 s): bare pencil, then colour arrives wash by wash, far to near, during a push-in; afterwards full colour; one push per shot; 1:1 time
- Cuts & rhythm: the cut to the living scene comes mid-phrase; demo two shots (1.2 / 1.3 s)
- Finish: pressure-varied, broken pencil, lightly hatched in shadow, readable through the washes; washes with soft wet edges, blooms, pooled rims and granulation cover about 80 % of the frame; streaky clouds, low sun, long shadows; opaque pale-gold lifts on sun-facing edges; faint stains and foxing
- Avoid: grey, muddy or pale washes; uniform digital outlines; pencil-only frames after the opening
- Overlaps: watercolor (field-journal page)
- References: Karl Bodmer, George Catlin field sketches; cinematographer Dean Semler
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/63.jpg

### No. 64 · Hand-coloured Natural-History Copperplate (after *The Silence of the Lambs*, 1991)
- Lemo name: "Hand-coloured Natural-history Copperplate" · render 2D · tone 2D · blend: Copperplate engraving; Hand-colouring; Victorian entomology plates; Moses Harris, The Aurelian
- One line: a cold, still specimen plate in engraved hatching and stipple with flat hand-coloured tints, numbered figures and Latin labels.
- Palette: paper `#EFE3C4`; umber `#5A3A22`; rust `#B4431E`; yellow `#E6AD24`; grey-violet `#7D6F8E`; engraving line warm black-brown (hex not given)
- Type: spaced small-caps title, numbered legend, plate number, Latin labels (face not given)
- Motion & camera: a still plate where one thing moves (insect, leaf, hand), then a slow push to a key detail; one continuous push with no cut for the payoff; scene time about 1.8× screen time
- Cuts & rhythm: one hard cut between plate and interior (0.9 / 1.6 s)
- Finish: dense parallel and cross-hatching, spacing about 1/400 of frame width, thicker in darks; stipple for soft tones; hatched shadows beneath; sky bare or sparsely lined; flat medium-saturation tints inside the line; plate layout: subject as Fig. 1 centred at about 60 % of plate height, 3–6 numbered figures around it, each about 1/5 high; bevelled plate mark; light foxing; even daylight, dark interiors cold with hard side light
- Avoid: smooth gradients; garish colour; a tiny vignetted subject
- Overlaps: engraving
- References: Moses Harris, *The Aurelian* (1766); cinematographer Tak Fujimoto
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/64.jpg

### No. 65 · Western Oil, Sunset and Nocturne (after *Unforgiven*, 1992)
- Lemo name: "Remington Western Oil · Sunset & Nocturne" · render 2D · tone 2D · blend: Remington's warm plains; Remington's late nocturnes; Thick oil impasto; Opening-title silhouette
- One line: thick Western oil in two keys: red-gold sunset silhouettes on a low horizon, and blue-green rainy nocturnes lit by warm windows.
- Palette: sunset register orange into deep red (hex not given); nocturne sky `#17333A`; moonlit edges `#9CC4BC`; warm window light `#FFCC6A`; dark ground `#1E1C16`
- Type: none on screen
- Motion & camera: one slow push from a silhouetted wide to the figure; low horizon, sky 50–60 % of the frame, figures small to medium; 1:1 time, no slow motion
- Cuts & rhythm: one long push, then the only cut jumps from sunset to night rain (1.4 / 1.1 s)
- Finish: broad readable shapes first, then loaded strokes about 1/80 of frame width wide and 3–6 times as long, soft broken ends, each within ±6 % brightness of the colour beneath, following the surface; sky in long horizontal strokes; a thin warm rim sunward on silhouettes; light canvas texture; nocturne only after full dark
- Avoid: smooth gradients; hard-edged flat bands; shattered shapes; grey figures in warm scenes; wide pans
- Overlaps: impasto
- References: Frederic Remington's late nocturnes; cinematographer Jack N. Green
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/65.jpg

### No. 66 · Black-and-White with One Colour (after *Schindler's List*, 1993)
- Lemo name: "Black-and-white Film, One Red Coat" · render 2D · tone 2D·B&W · blend: High-contrast B&W film; Coarse silver grain; Selective colour; Janusz Kamiński
- One line: cold high-contrast black and white with coarse grain and haloed highlights, where only the one hero (and at most one story object) keeps colour.
- Palette: blacks near `#111`; whites near `#EEE`; hero clothing saturated (e.g. terracotta `#D97757`); optional one red story object `#A3241F`–`#C9463C`; everything else neutral grey
- Type: none on screen
- Motion & camera: long-lens compression, soft foreground branches; signature = a high long-lens view of many small walking figures with the coloured one among them (or the hero tiny in wide grey space); lateral tracks at walking pace; slow push-ins
- Cuts & rhythm: four hard cuts following a gaze, each held about a beat and a half (0.7 / 0.6 / 0.6 / 0.6 s)
- Finish: strong S-curve, cold neutral greys; highlights halo in haze; soft old lens; silver grain re-rolled every frame ±6 %; slight flicker; rare dust; vignette; lamps and fires stay grey unless a flame turning from grey to warm is the beat; default overcast mid-key with open shadows; in crowds no two people alike in build, tone or gait
- Avoid: sepia or blue toning; grain-free greys; more than two coloured things
- Overlaps: new (selective-colour B&W; closest newsreel / silent-film for the B&W finish)
- References: cinematographer Janusz Kamiński
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/66.jpg

### No. 67 · Pop-up Book on a Real Desk, One Take (after *Forrest Gump*, 1994)
- Lemo name: "Sabuda Pop-up Book on a Real Desk" · render 2.5D · tone 2.5D · blend: Robert Sabuda pop-up engineering; Watercolour and coloured-pencil print; three.js paper cards; Physical depth of field
- One line: printed die-cut cards standing on parallel folds in a real pop-up book on a walnut desk, filmed in one continuous move with page turns instead of cuts.
- Palette: walnut desk `#6B3E1E`; print colours sky blue, warm sand, greens (hex not given); room a warm blur
- Type: none on screen
- Motion & camera: signature = high three-quarter view of the whole spread; one continuous move: dive into a page, pull back, turn the page instead of cutting, push into the next spread; demo 5.0 s with page turns at about 2.7 s and 4.2 s
- Cuts & rhythm: no cuts; page turns stand in for cuts (12 beats in the demo)
- Finish: each card printed with transparent watercolour and grainy coloured-pencil hatching; cut edges show a white core and grey board; bright window daylight from upper left, soft shadows between layers; room light stays daylight whatever the story's time (time of day only in the print); physical depth of field, focus on the hero's layer
- 3D: three.js flat paper cards on parallel folds before a 90° backdrop page; physical DOF
- Avoid: solid-looking cards; dark moody rooms; cartoon faces
- Overlaps: paper-popup
- References: Robert Sabuda, Matthew Reinhart; cinematographer Don Burgess
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/67.jpg

### No. 68 · Illuminated Manuscript with Gold Leaf (after *Braveheart*, 1995)
- Lemo name: "Illuminated Manuscript with Gold Leaf" · render 2D · tone 2D · blend: Book of Kells interlace; Gothic miniature (Morgan Bible); Luttrell Psalter marginalia; Burnished gold leaf
- One line: a medieval manuscript page of burnished gold, lapis and vermilion with textura script and a battle miniature framed like a window.
- Palette: vellum `#ECDCB4`; brown ink outline `#2A1A10`; lapis `#27469A`; vermilion `#C43A20`; burnished gold leaf (hex not given) filling at least a tenth of the frame; night miniatures lapis with gold stars
- Type: broad-nib textura for the story's text (Latin or user's language), red-and-blue line fillers, one large gilded initial; no modern typefaces
- Motion & camera: a slow candle glint sweeps the gold only; layered miniature for parallax on pushes; figures may break out of the frame; scene time about 1.8× screen time
- Cuts & rhythm: four hard cuts: initial, page, into the miniature, close (0.7 / 0.6 / 0.6 / 0.6 s); a speech scroll unrolls in the last shot
- Finish: gold on raised gesso with punched dot rosettes; Gothic figures in flat colour and ink outline; Celtic interlace, ivy borders, marginal grotesques; miniature about half the page beside the text column; warm candle from upper left; brown vignette; pigment grain
- Avoid: flat yellow for gold; modern typefaces; glints on faces
- Overlaps: new (closest: stained-glass / art-deco for gold-and-jewel colour)
- References: Book of Kells, Morgan Bible, Luttrell Psalter
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/68.jpg

### No. 69 · Traveller's Scrapbook Watercolour (after *The English Patient*, 1996)
- Lemo name: "Explorer's Scrapbook Watercolour" · render 2D · tone 2D · blend: Transparent watercolour; Pen notes and handwriting; Scrapbook collage: tape, photos, maps; Amber-sepia grade
- One line: a crowded traveller's scrapbook in amber-sepia: a taped watercolour among maps, photos and notes, and a push that goes through the painting into its world.
- Palette: amber paper `#E8D6B0`; sepia `#6B4A2E`; ochre `#D08A3C`; rose-violet `#9C6A86`; ink `#2A1E16`
- Type: handwritten notes and printed pages as collage items (no faces given)
- Motion & camera: signature = push into the painting until the page edges slide out (acts as the transition); then lateral drifts inside; never pan while a page frames the painting; scene time about 1.8× screen time
- Cuts & rhythm: the push replaces a cut; then two hard cuts inside the painted world (1.2 / 0.6 / 0.7 s)
- Finish: page crowded edge to edge with 6–10 overlapping items, some running off frame (watercolour about 40 % of frame, map, sepia photo, printed pages, notes, pressed flower), each softly shadowed with yellowed tape; the watercolour wet-in-wet with warm ochre lights, hard-edged violet-rose shadows, pen contours, pooled edges; one warm source (torch, lamp) pooling in a dark foreground; light amber grade on the page only, never on the painting; vignette about 20 %; faint grain
- Avoid: smooth gradients; sparse tidy layouts; panning while a page frames the painting
- Overlaps: watercolor + archive-lighttable (collage of documents)
- References: cinematographer John Seale
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/69.jpg

### No. 70 · Blueprint Developing into 3D Golden Hour (after *Titanic*, 1997)
- Lemo name: "Blueprint Developing into 3D Sunset" · render 3D · tone 3D · blend: Shipyard general-arrangement blueprint; three.js ship at true scale; Russell Carpenter's colour; One continuous camera move
- One line: white lines on Prussian-blue paper stand up into perspective and develop into a golden-hour 3D world in one unbroken move, which then falls into night.
- Palette: Prussian-blue paper `#12306B` to `#244D8F`; white edge lines; amber highlights `#F2B860`; warm shadows `#3A2530`
- Type: blueprint lettering on the sheet (face not given)
- Motion & camera: opening only (1–2 s, under 15 % of the film): blueprint; a dolly-zoom stands the elevation up into perspective; colour spreads from the hero along a soft warm edge, ghost lines fading within 1 s; then one unbroken move in equal shares: drift low past the hero, rise and orbit, descend; demo 6.7 s (16 beats): blueprint unfolded by 1.5 s, colour developed by 2.4 s, sunset-to-night as a time-lapse inside the move
- Cuts & rhythm: no cuts at all
- Finish: blueprint lines about 1/800 of frame width, hidden lines dashed, figures and terrain as contours, uneven exposure, folds; then golden-hour low sun, sun glitter on water, soft mist, shallow focus, gentle bloom, fine grain; then blue hour and night with warm lights coming on
- 3D: three.js model at true scale, the same model drawn as the blueprint (edge lines) and rendered as the real object
- Avoid: lingering on the drawing; hard cuts; flat CG light
- Overlaps: blueprint (opening) + glass-product/white-model (3D reveal)
- References: cinematographer Russell Carpenter; Harland & Wolff general-arrangement drawings
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/70.jpg

### No. 71 · Elizabethan Portrait Miniature (after *Shakespeare in Love*, 1998)
- Lemo name: "Hilliard Elizabethan Miniature" · render 2D · tone 2D · blend: Portrait miniature (limning); Body colour on vellum; Shell gold; Crimson damask still life
- One line: a jewel-like oval miniature: flat opaque colour on vellum, an ultramarine ground, shell-gold motto, white briar roses, lying in a gold locket on red damask.
- Palette: ultramarine ground `#203E92`; shell gold `#D6B05C` (granular flecks, a few burnished highlights); carmine `#A8202C`; lead white `#F6F2E8`; verdigris `#346C40`; outlines red-brown (hex not given); damask rust-red
- Type: a short motto in gold Roman capitals arcing along the top of the oval (face not given)
- Motion & camera: slow push with a slight tilt; only flowers, cloth and gestures move; wide scenes may leave the locket with the same method in true perspective
- Cuts & rhythm: four hard cuts from intimate to public (0.8 / 0.6 / 0.6 / 0.6 s)
- Finish: opaque watercolour laid flat on warm vellum; very fine hatching in shadows (lines about 1/1000 of frame width); lead-white dots on lit edges; the oval's ground stays ultramarine; landscape and sky as flat colour bands
- Avoid: airbrush gradients; thick oil strokes; flat yellow gold
- Overlaps: new
- References: Nicholas Hilliard, *Young Man Among Roses* (c. 1587)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/71.jpg

### No. 72 · Frontal Suburban Symmetry + DV Camcorder (after *American Beauty*, 1999)
- Lemo name: "Suburban Symmetry + DV Camcorder" · render 2D · tone 2D · blend: Conrad Hall frontal symmetry; Rose-petal fantasy; 1990s DV camcorder video
- One line: two registers: a clean, saturated, dead-on symmetrical illustration of a home, and the same world as noisy 1990s DV tape, joined by a petal blizzard.
- Palette: red accent (door) `#C3141F`; white trim; saturated greens; orange-red autumn trees (hex not given); warm grade
- Type: camcorder OSD only (REC, battery, date/time), never a real brand's OSD
- Motion & camera: slow push-ins; dead-on symmetry with the hero centred before its home; demo one push from wide to close (1.3 s)
- Cuts & rhythm: about 70 % clean register, 30 % DV; one register per frame; the cut is hidden in a 1-second blizzard of curled petals (about 1/60 of frame width) across the lens
- Finish: clean register: shapes softly modelled in 2–3 tones, dense foliage detail, bright daylight (gold at sunset, never dim), light vignette and grain; DV register: soft, low-res, chroma bleed, macroblocks, interlace, noise, breathing exposure, greenish shadows
- Avoid: video artefacts in the clean part; real brands' OSD; flat vector shapes
- Overlaps: backrooms (camcorder OSD) for the second register; first register new
- References: cinematographer Conrad L. Hall
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/72.jpg

### No. 73 · Roman Floor Mosaic (after *Gladiator*, 2000)
- Lemo name: "Roman Floor Mosaic" · render 2D · tone 2D · blend: Opus vermiculatum tesserae; Gold-leaf glass smalti; Zliten gladiator mosaic
- One line: everything laid in square stone and glass tesserae whose courses follow the outlines, with slow-glinting gold-leaf tiles and stiff frontal figures.
- Palette: burnt gold `#E2B24C`; umber `#5B4332`; terracotta `#8E3C2B`; warm marble `#E9DDC4`; imperial-purple glass for one accent only (hex not given); sky and water pale grey-blue and cream stone, never saturated bands
- Type: none on screen
- Motion & camera: short pushes and pulls; motion from details (a gesture, a crowd, plants, a light shaft)
- Cuts & rhythm: three hard cuts of about 1 s each (0.8 / 1.0 / 0.8 s)
- Finish: tesserae about 1/150 of frame width over a flat underdrawing; 2–3 courses follow each outline (opus vermiculatum), flat areas in straight rows, figures outlined with one course of dark stones; tiles slightly irregular, lit from upper left, shadowing into dark 1–2 px grout; gold-leaf glass glints slowly on light sources; frontal, slightly stiff figures before a faded field of fine stones
- Avoid: a neat grid that reads as pixel art; oversized tiles; smooth gradients; bright grout
- Overlaps: new (closest: stained-glass for tiled colour; must not read as pixel-rpg)
- References: *Alexander Mosaic* (Pompeii), Zliten mosaic; cinematographer John Mathieson
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/73.jpg

### No. 74 · Window Marker and Chalk, Gold Pattern (after *A Beautiful Mind*, 2001)
- Lemo name: "Window Marker & Chalk, Gold Pattern" · render 2D · tone 2D · blend: White china marker on glass; Blackboard chalk; Glowing gold pattern lines; Deakins window light
- One line: handwriting is the image: white marker formulas written on leaded window glass (or chalk on slate), and at the key moment chosen symbols light up and join in gold lines.
- Palette: slate green `#2F3E35`; chalk white `#F1EFE6`; lamp amber `#E0A050`; soft gold `#D9B45A`; outside the window overcast gold and muted green, never brighter than the writing, never cold blue
- Type: handwritten strokes only, no typed fonts; writing in small blocks on about a quarter of the glass
- Motion & camera: slow push-ins, each cut closer to the writing until only the pattern remains
- Cuts & rhythm: hard cuts, each tighter (1.0 / 0.8 / 0.8 s)
- Finish: translucent white wax-marker strokes about 1/300 of frame width, appearing stroke by stroke on square leaded panes; soft-focus, mid-toned warm exterior; warm interior frame (shelves, green-shaded lamp, amber light); gold lines draw a star or polygon with lights running along them; chalk variant with ghost writing
- Avoid: HUD graphics; typed fonts; writing filling the glass; cold blue outside
- Overlaps: chalkboard / whiteboard
- References: cinematographer Roger Deakins
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/74.jpg

### No. 75 · Broadway Stage in Red and Black (after *Chicago*, 2002)
- Lemo name: "Fosse Stage in Red and Black" · render 2D · tone 2D · blend: Bob Fosse staging; Red-rimmed backlit silhouettes; Neon and sequins; Chicago 2002 poster colours
- One line: a black stage cut by hard spots: barred cells backlit red through haze, rim-lit black silhouettes, one flickering neon shape, the hero alone in a warm-white follow spot.
- Palette: signal red `#D0202A` (about 40 % of the frame glows it); neon orange-red `#FF5A3C` with white-hot core; marquee bulbs `#FFD9A0`; follow spot warm white `#FFF1D6`; black stage
- Type: one big neon shape (a letter or pictogram)
- Motion & camera: moves on the jazz beat; cells snap on one by one; push in to end in the follow spot; real speed
- Cuts & rhythm: wide, quick cut to one cell, then the hero shot (0.8 / 0.5 / 1.2 s)
- Finish: cells bright at centre falling off to black; hard-edged spots; full-bodied black silhouettes with costume shapes and a 2–3 px red rim; neon slight flicker; glossy black floor reflecting it; sequins and white gloves as accents; the hero is the only lit figure in its own colours
- Avoid: flat even fills; extra colours; rimless silhouettes
- Overlaps: new (closest: spy-titles for silhouettes; dark-keynote for black stage)
- References: Bob Fosse staging; cinematographer Dion Beebe
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/75.jpg

### No. 76 · Fantasy Concept-Art Watercolour and Parchment Map (after *The Return of the King*, 2003)
- Lemo name: "Alan Lee Watercolour & Tolkien Map" · render 2D · tone 2D · blend: Watercolour and pencil concept art; Tolkien-style parchment map; Alan Lee and John Howe
- One line: soft granulated watercolour and pencil with deep aerial perspective, where one burning light source is the subject; journeys cut to an ink map on parchment.
- Palette: parchment `#E9DCC0`; deep umber `#3A2418`; ember orange `#E07A2E`; hot red `#B23A1E` (only at the light's core); lavender `#B8A8C8` (distance)
- Type: map lettering (face not given)
- Motion & camera: long lateral pans, slow push-ins to the hero; top-down push into a map then fly along a dashed route line with the hero as a small game piece
- Cuts & rhythm: hard cuts, long moves within each shot (demo 5.0 s: 1.3 / 1.9 / 0.4 / 1.5 s; a 0.4 s shot as a short beat of threat)
- Finish: transparent washes, granulation ±6 % brightness, a few blooms, darker pooled edges; every contour and ridge carries a dark-brown pencil line about 1/800 of frame width, short hatching on shadow sides; 3–5 receding planes, each paler and cooler; one strong source per scene burning through haze, ember glow on about a quarter of the frame, about half the frame in deep umber and violet shadow; the map is never the main look
- Avoid: smooth digital gradients; vector shapes; pale frames
- Overlaps: watercolor
- References: Alan Lee, John Howe; Tolkien's maps; cinematographer Andrew Lesnie
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/76.jpg

### No. 77 · Original 16-bit Arcade Fighter (after *Million Dollar Baby*, 2004)
- Lemo name: "16-bit Arcade Fighting Game" · render 2D · tone 2D · blend: 16-bit pixel art; Arcade fighting-game HUD; CRT scanlines
- One line: the story as one round of an original 16-bit fighting game: health bars, timer, ROUND 1 / FIGHT!, hit-stop and a big K.O.
- Palette: health bar yellow `#F5C53A` with a red damage trail (hex not given); crowd band dark purple `#1D1435` (example); about 32 colours per frame
- Type: a self-drawn 5×7 pixel font for all UI (timer, banner, ROUND 1 / FIGHT!, combo counter, K.O., WINNER)
- Motion & camera: fixed side-on game camera, no cuts; hits spark, freeze 3–4 frames and flash white; loser knocked back, then K.O. and WINNER; demo choreography: uppercut at 1.46 s with hit-stop, K.O. at 1.6 s, victory at 1.95 s
- Cuts & rhythm: one 2.5 s locked shot
- Finish: drawn at 320×180 and nearest-neighbour upscaled by a whole number (×6 for 1080p); CRT scanlines (alternate lines about 15 % darker); chunky sprites about 50 px tall (at 320×180), 1-px highlights, dark outlines; stage and backdrop flattened side-on
- Avoid: real games' characters or logos; anti-aliased pixels
- Overlaps: pixel-rpg / microgame
- References: early-1990s arcade fighters (genre grammar)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/77.jpg

### No. 78 · Long-Exposure Night City with Lit Snow (after *Crash*, 2005)
- Lemo name: "LA Night Light Trails & Snow" · render 2D · tone 2D · blend: Long-exposure night photography; Sodium orange and neon cyan; Anamorphic bloom and film grain
- One line: a polished long-exposure night photograph: sodium orange against neon cyan, headlight ribbons, wet asphalt, bokeh, and snow visible only in light cones.
- Palette: sodium orange `#F2A24A` (about half the frame in warm light); cyan neon `#3FD0D8`; headlight white `#FFF4E0`; tail-light red `#E0303A`; blacks cyan-tinged, never grey; odd red-blue emergency lights
- Type: none on screen
- Motion & camera: one continuous tilt, pan and rack focus; the hero sharp in a lamp cone mid-frame; only traffic streaks; motion blur on fast stretches
- Cuts & rhythm: a single 2.5 s oner
- Finish: headlights as thin continuous ribbons about 1/150 of frame width with hot cores; snow in three layers of short soft streaks seen only in light cones; two-level bloom, blue lens streaks, edge bokeh, vignette, moving grain; layered composition (pavement and figures, lit shopfronts mid-frame, roads or bridges across the upper third)
- Avoid: evenly lit snow; empty black frames; dotted trails
- Overlaps: city-symphony (light trails), but a single fictional night photo
- References: cinematographer J. Michael Muro; Four Level Interchange long-exposure photography
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/78.jpg

### No. 79 · Street Stencil on Red Brick (after *The Departed*, 2006)
- Lemo name: "Street Stencil on Boston Brick" · render 2D · tone 2D · blend: Multi-layer spray stencil; Banksy's rats; Red-brick wall texture; Halftone paste-up poster
- One line: flat multi-layer spray stencils with overspray and drips, sinking into brick mortar on a busy wall beside tags and a torn paste-up poster.
- Palette: black `#151312`; mid grey `#8C8A85`; gold `#C99A2E`; red `#C3261F`; brick `#7A3224`; cream painted patches under the main pieces (hex not given)
- Type: short hand-sprayed slogans about the subject in the user's language; old tags (no face)
- Motion & camera: pieces spray on layer by layer, then close-ups and lateral tracks; slow drifts; tracking with a moving subject
- Cuts & rhythm: fast hard cuts after the build (0.8 / 0.6 / 0.6 / 0.4 s)
- Finish: each piece 3–5 stencils sprayed as flat colour, photo-derived in look (smallest cut detail about 1/200 of frame width); hard cut edges, soft overspray where a stencil lifted, spray dots, drips, stencil bridges; brick relief, mortar and rain streaks show through; soft raking daylight, mild contrast, a faint swaying wire shadow; no heavy vignette; a siren light may wash the brick
- Avoid: clean vector edges; paint floating on the brick; too many colours; a dark wall
- Overlaps: new (closest: halftone-dossier / silkscreen-poster for flat inks)
- References: Banksy; cinematographer Michael Ballhaus
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/79.jpg

### No. 80 · 3D Desert Dusk, Locked Wide (after *No Country for Old Men*, 2007)
- Lemo name: "3D West Texas Dusk, Deakins Light" · render 3D · tone 3D · blend: Real-time 3D (three.js); Roger Deakins dusk light; Desaturated film grade
- One line: a photoreal-leaning desaturated dusk landscape, sun pressed onto the horizon, a backlit figure with a long shadow toward the lens, locked low wide frames.
- Palette: horizon dusty ochre `#D8A060` up to pale cream; dark warm earth `#2A2622`; grey-green scrub (hex not given)
- Type: none on screen
- Motion & camera: signature shot locked, low, wide (about 35 mm); all three demo shots locked; the hero backlit in the mid-ground at about a third of frame height
- Cuts & rhythm: three locked shots, hard cuts (0.8 s each); light carries the day from dusk to dark
- Finish: sky fills 60 % of the frame with thin streaked clouds lit from below; sun 1–2° above the horizon still casting shadows; expose for the sky (the sun may clip, glow within a tenth of the frame); neutral tone mapping, warm highlights, fine grain, vignette; low saturation
- 3D: hundreds of grey-green scrub clumps receding to the horizon, stones, dry grass; macro insert of a spinning coin
- Avoid: saturated orange sunsets; blown-out glare; bare ground; busy camera moves
- Overlaps: new
- References: cinematographer Roger Deakins
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/80.jpg

### No. 81 · Quiz-Show Studio + Orange-Teal City (after *Slumdog Millionaire*, 2008)
- Lemo name: "Quiz-Show Studio & Mumbai Orange-Teal" · render 2D · tone 2D · blend: TV game-show lighting; Blue-violet beams and lens flares; Anthony Dod Mantle orange and teal
- One line: a glossy hard-lit TV studio in blue-violet beams and flares, cut against hot golden-hour orange-and-teal street views.
- Palette: beams blue-violet `#5A3FD0`; locked answer amber `#F0A020`; accents magenta `#E2206B`, teal `#0F7C7A`, tangerine `#F06A14`
- Type: big screen of elongated-hexagon answer frames (face not given)
- Motion & camera: push in on the screen and the hot seat as beams close on one person; elsewhere slow pans; studio seen three-quarter from slightly above
- Cuts & rhythm: two registers: studio about 70 %, outside world about 30 % as full-frame hard cuts (demo 0.8 / 1.0 / 0.8 s)
- Finish: glass stage lit from below with concentric blue rings; moving-head beams through haze; bloom and horizontal flares; as tension rises the edges dim to about half, never black; characters rounded and softly shaded; outside register saturated and busy
- Avoid: real show logos; a mostly black studio; even lighting; grey, empty places
- Overlaps: game-show (studio stage) + news-package
- References: cinematographer Anthony Dod Mantle
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/81.jpg

### No. 82 · Military Technical-Manual Line Art (after *The Hurt Locker*, 2009)
- Lemo name: "EOD Technical Manual Line Art" · render 2D · tone 2D · blend: Military technical-manual line drawing; Exploded-view diagram; Typewriter callouts; Olive and sand flat tints
- One line: a procedure manual page: even black line, hatched shadows, stippled ground, exploded views with numbered callouts, WARNING boxes, a little olive and sand.
- Palette: paper `#EFEADB` with a faint engineering grid; ink `#1B1A16`; olive `#6C6D42`; sand `#D9C79C` (tints on 20–30 % of the drawing)
- Type: typewriter labels in the user's language, FIG numbers, circled numbers on leader lines, a parts table, WARNING and CAUTION boxes, a black chapter card; no decorative fonts
- Motion & camera: animate on twos (parts slide apart, a tool works, a figure walks); whole page first, then cuts to enlarged insets; slow pushes
- Cuts & rhythm: four cuts tightening from page to insert (0.8 / 0.6 / 0.5 / 0.6 s)
- Finish: outlines about 1/700 of frame width, hatching thinner; shading only by hatching, ground by stippling; lights as ray lines, not glows; main figure a one-point-perspective view filling most of the page; exploded views along a dash-dot axis
- Avoid: gradient shading; too much colour; decorative fonts; sparse pages
- Overlaps: blueprint / teardown (exploded views)
- References: US Army technical manuals; cinematographer Barry Ackroyd
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/82.jpg

### No. 83 · Painterly Wall Interiors with Gold Sound Waves (after *The King's Speech*, 2010)
- Lemo name: "Peeling Wall & Gold Broadcast Booth" · render 2D · tone 2D · blend: Painterly digital oil texture; Peeling layered-paint wall; 1930s broadcast booth; Gold sound-wave lines
- One line: painterly interiors where the wall carries the image: a gold padded booth or a peeling grey-green wall, figures small in a corner, thin gold oscilloscope lines for sound.
- Palette: padded wall gold `#C9A050` over deep brown `#3A2610`; secondary wall cool grey-green worn through to blue, pink, ochre and plaster (hex not given); brass button highlights
- Type: none on screen (an ON AIR light in the demo)
- Motion & camera: slow push-ins, one close-up of the sound source; figures in a corner, lots of wall; never centred symmetry
- Cuts & rhythm: three hard cuts (0.8 / 0.9 / 0.9 s)
- Finish: clean-edged shapes under a subtle brush texture (strokes about 1/120 of frame width, ±5 % brightness); faces and small objects crisp; peel patches irregular and under a third of the wall, with damp lines and fine cracks; a warm glow behind the sound source; 4–8 thin gold oscilloscope lines crossing the wall, spiky (struggle) then smooth (fluency)
- Avoid: centred symmetry; coarse dabbed strokes; map-like peel; neon-bright waves
- Overlaps: new
- References: cinematographer Danny Cohen; designer Eve Stewart
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/83.jpg

### No. 84 · Polished Silent-Film Homage (after *The Artist*, 2011)
- Lemo name: "Polished Silent-Film Black & White" · render 2D · tone 2D·B&W · blend: Late-1920s silent-film black and white; Art Deco intertitle cards; Hollywood studio glamour light
- One line: clean, glossy late-1920s black and white with glowing highlights, Art Deco intertitles and light flicker, the hero the only colour.
- Palette: B&W with glowing highlights, soft mid-greys, deep blacks; hero wholly in tones of terracotta `#D97757`; lamps and fire stay grey
- Type: intertitles on black with an Art Deco border and spaced capitals, in the user's language (face not given)
- Motion & camera: smooth push-ins and pull-backs; title cards flashed in (0.3 s in the demo); cuts landing on gestures (a bow, a wave); near real speed
- Cuts & rhythm: five quick cuts in 3.3 s (1.0 / 0.5 / 0.3 / 0.5 / 0.9 s)
- Finish: gentle S-curve, grey halation around lights, slight flicker ±3 %, fine grain, rare dust, 1.33 pillarbox inside 16:9; grand ordered interiors, figures in elegant profile, crowds in backlit silhouette
- Avoid: heavy scratches; sepia tint; colour bleeding into the greys
- Overlaps: silent-film (a cleaner, glossier variant)
- References: cinematographer Guillaume Schiffman
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/84.jpg

### No. 85 · 1970s Cosmic Comic Page (after *Argo*, 2012)
- Lemo name: "Jack Kirby 70s Comic Page" · render 2D · tone 2D · blend: Jack Kirby cosmic comics; Ben-Day four-colour print; Aged newsprint; Lord of Light concept art
- One line: a 1970s cosmic comic page on yellowed newsprint: heavy tapered brush ink, energy-bubble crackle, block sound effects and 45° Ben-Day dots.
- Palette: cyan `#1696CD`; magenta `#DE2C70`; yellow `#FFD616`; black `#1C161A`; aged newsprint `#EEE2C2`
- Type: block sound effects; hand-lettered balloons; yellow caption boxes
- Motion & camera: move between panels: push into the splash, pan along a strip; dots stay round and grow into pop-art dots on push-ins
- Cuts & rhythm: three panels in 2.5 s, hard cuts read like page turns (0.9 / 0.8 / 0.8 s)
- Finish: heavy tapered brush contours, feathered spot blacks, exaggerated perspective; CMYK flats as 45° Ben-Day dots, colour plates 1 px off register; paper grain, browned edges, a gutter fold shadow, warm lamp falloff
- Avoid: smooth digital gradients; clean white paper; stiff tube-like machines
- Overlaps: halftone-dossier (dots) but full comic-page grammar: new
- References: Jack Kirby (*Lord of Light* concept art 1979; *New Gods* / *Eternals*); cinematographer Rodrigo Prieto
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/85.jpg

### No. 86 · Cased Daguerreotype, Developing (after *12 Years a Slave*, 2013)
- Lemo name: "Cased Daguerreotype, Developing" · render 2D · tone 2D·B&W · blend: 1850s cased daguerreotype; Hand-tinted tintype; Studio still life
- One line: one 1850s silver plate in a brass mat and velvet case, developing from blank mirror-grey while the camera pushes in; a single still pose.
- Palette: brass mat `#8a6a2c`; silver greys from near-black `#1c1a18` to pale `#ecebe6`; thin blue-violet-to-amber tarnish halo; hero hand-tinted with a translucent flat wash (e.g. `#D97757`); lamps stay grey
- Type: none on screen
- Motion & camera: one shot: push from the open case to the plate framing in about 1 s, then hold; the image develops from blank mirror-grey, shadows first, a front sweeping left to right, done by about 3 s; the only other motion is one slow gesture
- Cuts & rhythm: one uncut 2.5 s shot; no fast cuts
- Finish: plate about 85 % of frame width inside a beaded brass mat with a rounded-rectangle opening; velvet and leather only at the edges; light swirls, hairline scratches, specks ±4 % brightness; soft window light from upper left; subject still before a plain backdrop (outdoor places painted on it)
- Avoid: sepia; a small plate; fast cuts
- Overlaps: archive-lighttable (photographic object), new as a developing-plate move
- References: 1850s cased daguerreotypes and ambrotypes
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/86.jpg

### No. 87 · 3D Handheld Backstage Long Take (after *Birdman*, 2014)
- Lemo name: "3D Backstage Long Take" · render 3D · tone 3D · blend: Real-time 3D (three.js); Lubezki handheld long take; Tungsten and fluorescent light; Digital-cinema grain
- One line: one handheld wide-lens long take down a narrow lived-in corridor lit only by practicals, warm tungsten against a cold flickering tube.
- Palette: blood-red enamel dado `#6e2a22` (lower third); nicotine plaster `#cdb98e` above; red exit sign `#ff2a1a`; warm tungsten and cold fluorescent (hex not given)
- Type: none on screen (pinned notices as set dressing)
- Motion & camera: wide lens 18–24 mm, slow sway ±1°; over 20–40 s in any order: lead the subject walking backwards, whip aside to a doorway, let it brush past the lens, turn and follow
- Cuts & rhythm: one unbroken take (the 2.5 s demo cuts out through a door into glare: 1.3 / 0.7 / 0.5 s)
- Finish: practicals every 2–3 m (caged tungsten bulbs, one flickering fluorescent tube, exit sign), far door glowing; mid-key, never below mid-grey between lamps, floor visible; soft ambient occlusion, light bloom, fine grain ±3 %
- 3D: a detailed narrow passage with pipes, cable trays, doors, pinned notices; no repeated textures
- Avoid: a locked-off camera; blank walls; repeated textures; a crushed dark frame
- Overlaps: backrooms (corridor), but 3D handheld cinema rather than VHS
- References: cinematographer Emmanuel Lubezki
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/87.jpg

### No. 88 · Microfiche Reader, Green Halftone (after *Spotlight*, 2015)
- Lemo name: "Microfiche Reader, Newsprint Halftone" · render 2D · tone 2D · blend: Library microfiche reader; 2001 newspaper CMYK halftone; Phosphor-green monochrome
- One line: a newspaper colour halftone seen on a library microfiche screen: low-contrast phosphor green, scan lines, a rolling scan bar, dust; scenes change by sliding the fiche.
- Palette: film base `#1b2320`; frame gaps `#0c110f`; highlights no brighter than `#a0dcaf`; hero keeps its colour (e.g. `#D97757`), screened and equally low-contrast; every light source turns green
- Type: a small monospace fiche index; lettering inside the picture stays solid; no newspaper layout or columns
- Motion & camera: slow push-ins, drifts; scene changes slide the fiche sideways past a dark gap (0.5 s)
- Cuts & rhythm: no hard cuts; three frames joined by fiche transport (0.8 / 0.8 / 0.9 s)
- Finish: CMYK screens at 15°, 75°, 0°, 45°, dots about 1/250 of frame width, 1 px misregistration, then converted to phosphor-green monochrome with dots still visible; scan lines every 3 px; a faint scan bar every 4 s; lamp hot-spot, dust, a hair; light rounded hood vignette (outer about 5 %)
- Avoid: newspaper layout; colour leaking; hard cuts
- Overlaps: ascii-crt (phosphor screen) + halftone-dossier (dots); new as a device
- References: library microfiche readers; cinematographer Masanobu Takayanagi
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/88.jpg

### No. 89 · Moonlit Blue Oil Portraiture (after *Moonlight*, 2016)
- Lemo name: "Moonlight-Blue Oil Portraiture" · render 2D · tone 2D · blend: Oil portrait brushwork; Teal / magenta / violet duotones; Split-level waterline camera
- One line: calm night oil portraits in saturated blue-violet, teal and magenta, smooth faces with blue top planes and a wet highlight under a full moon.
- Palette: sky, sea, far land mid blue-violet `#32377a` (about 60 % of the frame); teal `#128a91` (water, lit sides); magenta `#7a2f86` (soft rim only, from a distant glow); deepest shadows `#07071c`; moonlit planes and sand pale lavender-blue (hex not given); small lights cyan-white points
- Type: none on screen
- Motion & camera: signature = the figure calm at about 2/3 of frame height; slow push-ins; split-level waterline shot; three portraits sliding into one wedge collage as the camera reframes
- Cuts & rhythm: three hard cuts (0.8 / 0.8 / 0.9 s), slow pushes so stillness carries
- Finish: smooth volumes repainted in two passes of short low-contrast (±8 % value) form-following strokes: broad (1/60 of frame width) on water, sky and cloth, fine (1/150) on faces, which stay smooth; skin takes blue top planes and a wet highlight, eyes open and lit; one key light (full moon with a broken glitter path); grain ±3 %
- Avoid: coarse dabs; small dark statue eyes; a murky frame
- Overlaps: impasto (oil), but smooth, night duotone portraiture: new
- References: Barry Jenkins; cinematographer James Laxton
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/89.jpg

### No. 90 · 3D Underwater Teal with Caustics (after *The Shape of Water*, 2017)
- Lemo name: "3D Underwater Teal Caustics" · render 3D · tone 3D · blend: Real-time 3D (three.js); Projected caustics and volumetric light shafts; Dan Laustsen teal-and-gold grade
- One line: everything fully under water in teal: moving caustic cells, fanning light shafts, bubbles and motes, warm gold practical lamps and cyan glow.
- Palette: background `#041414`; hemisphere light `#5fb3a6` above and `#0c2a24` below; warm gold practicals and cyan bioluminescence (hex not given); reds fade first with distance
- Type: none on screen
- Motion & camera: signature = low angle looking up, subject half the frame height, off-centre beside the light; slow push-ins; demo steady 1.25× pace
- Cuts & rhythm: four cuts in 2.5 s (0.9 / 0.5 / 0.6 / 0.4 s)
- Finish: teal fog; a strong source above the surface projects moving caustics (bright cells about 1/20 of frame width on near surfaces, sliding over floor, walls and subject); shafts fan down, edges stay dark; rippled surface seen from below; warm gold on 1–3 practicals, at least one large (about 1/10 of frame width); ambient occlusion, shallow focus, modest bloom, grain ±3 %
- 3D: smooth-shaded models in a flooded room; land subjects sink into a flooded or sunken place
- Avoid: flat water; caustics as sky stripes; tiny warm accents
- Overlaps: new (closest: glass-product for caustics)
- References: Guillermo del Toro; cinematographer Dan Laustsen
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/90.jpg

### No. 91 · Mid-century Linen Postcard (after *Green Book*, 2018)
- Lemo name: "1960s Linen Postcard" · render 2D · tone 2D · blend: Curt Teich linen postcard; "Greetings from" large-letter type; Airbrushed hand colouring; Offset-litho misregistration
- One line: a saturated airbrushed linen-weave tourist postcard with big 3D block letters that comes alive when the camera pushes in.
- Palette: sky blue `#3fa0dc`; grass green `#4fae57`; pink `#f08cb0`; teal `#2fb5b8` (main object or water); cream card `#f6e4b8` (paper, border); navy block letters with white outlines; red ribbon banner (hex not given)
- Type: big navy 3D block letters across the top third spelling the place or title, a small scene inside each letter, a red ribbon banner above (lettering, not a font)
- Motion & camera: open on the card on a desk, push in until it fills the frame and comes alive (water, figures move), then track sideways; main object large, side-on, about half the card's height
- Cuts & rhythm: one continuous push into the card replaces a cut, then a single cut (1.9 / 0.6 s)
- Finish: ink only on raised threads: a fine linen crosshatch about 1/300 of frame width with white specks in the hollows; airbrush blends; star glints on shiny surfaces; registration off 1–2 px
- Avoid: weave-less gradients; greyish colour; photographic perspective
- Overlaps: silkscreen-poster (travel poster), new as a postcard
- References: Curt Teich & Co. linen postcards
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/91.jpg

### No. 92 · Architectural Section Axonometric (after *Parasite*, 2019)
- Lemo name: "Architectural Section Axonometric" · render 2D · tone 2D · blend: Dimetric section drawing; Architectural poché and scale figures; Rainy-night colour grade
- One line: one vector section cut through a whole place, rooms stacked by level, and a camera that cranes vertically through the slabs so different levels share a frame.
- Palette: concrete `#b3ada2`; oak `#d6b58a`; charcoal `#3e4146`; pine `#3f6b3e`; white walls, green lawn, translucent blue water (hex not given); night = multiply 30–40 % moonlit blue with lit rooms painted back warm
- Type: none on screen
- Motion & camera: crane slowly framing 2–3 rooms along one continuous path; end on the whole drawing at about 80 % of the frame; descents follow a figure down stairs, tunnels and floors
- Cuts & rhythm: few cuts (demo two cuts in 5.0 s: 0.8 / 1.3 / 2.9 s); no cuts between levels
- Finish: low dimetric view: cut face along the near-flat 7° axis facing us, depth along the 42° axis at half scale; roof and near walls cut away; poché on cut faces (dark concrete with aggregate, earth hatched at 45° with stones); 1 px dark-grey lines at every zoom; furnished rooms, simple scale figures
- Avoid: 30° isometric; thick outlines; cuts between levels; a small drawing
- Overlaps: iso-infographic / isometric-picture-book (but dimetric section with poché)
- References: architectural section axonometrics; cinematographer Hong Kyung-pyo; designer Lee Ha-jun
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/92.jpg

### No. 93 · Magic-Hour Soft Pastel (after *Nomadland*, 2020)
- Lemo name: "Magic-Hour Soft Pastel" · render 2D · tone 2D · blend: Soft pastel on toned paper; Magic-hour dusk palette; Paper-tooth texture
- One line: chalky soft pastel on grey-violet toned paper: a long quiet horizon, the sky drifting gold to rose to violet, the land in fine upright grass strokes.
- Palette: toned paper `#7d7079`; horizon gold `#f6cf7a`; lower-sky rose `#c9738a`; high sky, clouds, far land violet `#4b3f78`; shadows dusk blue `#2b2d5c`; dry-grass ochre (gold dulled toward the paper grey)
- Type: none on screen
- Motion & camera: one slow pan with a light push-in; a long horizon near mid-frame, subject mid-sized in the lower half; demo one 2.5 s oner travelling with a walking figure
- Cuts & rhythm: one uncut shot; sky colour changes over the shot; lamps brighten as it darkens
- Finish: paper tooth everywhere as fine speckle ±8 % brightness; sky blended smooth with a few long thin cloud bands; grass strokes 1/400 of frame width wide, 1/40 long, ±15 % value, dense in the foreground, thinning to the horizon; objects get soft diagonal hatching and broken edges
- Avoid: oily impasto; sharp edges; bare smooth ground
- Overlaps: crayon-book / chalkboard (dry media), new as pastel
- References: Chloé Zhao; cinematographer Joshua James Richards
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/93.jpg

### No. 94 · Scrimshaw on a Whale Tooth (after *CODA*, 2021)
- Lemo name: "Scrimshaw on a Whale Tooth" · render 2D · tone 2D · blend: 19th-century whaler's scrimshaw; Burin hatching and stipple; Tabletop product lighting
- One line: a polished engraved tooth on an oak table, fine near-black needle hatching with a few touches of red, blue and yellow, then a cut into the engraving.
- Palette: engraving near-black `#17110c`; red `#9a2a22`, blue `#2b4a78`, yellow `#e9b526` (small touches only, plus the coloured hero); warm ivory with growth bands, honey tip (hex not given)
- Type: ribbon motto in the folk layout (face not given)
- Motion & camera: signature = tooth lying horizontal on an oak table at about 85 % of frame width and 70 % of height with ink bottle and jackknife; push in, then pan slowly as waves animate
- Cuts & rhythm: one cut from the object into the picture, then one gentle pan (0.8 / 1.7 s)
- Finish: needle hatching lines 1/800 of frame width, spaced about 1/500, swelling outlines, stipple; lines cover about 70 % of the face (dense in sea, subject, land; sky lightly hatched); seas as rows of stylised waves; hero about 1/3 of the tooth's height, coloured; rope border, rayed sun, motifs from the subject's world; edges shaded, one gloss streak; the picture is not warped to the curve
- Avoid: thick lines; solid fills; a slim horn
- Overlaps: engraving (hatching), new as an object-on-table carrier
- References: New Bedford Whaling Museum scrimshaw collection
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/94.jpg

### No. 95 · Ray-Marched Multiverse Jump-Cuts (after *Everything Everywhere All at Once*, 2022)
- Lemo name: "Ray-Marched Multiverse Jump-Cuts" · render 3D · tone 3D · blend: GLSL ray-marched universes; One look per universe (office realism, cosmic surreal, landscape, commercial); Googly-eye rainbow mandala
- One line: the subject jumps through 3–4 universes, each with its own look and grade, linked by one sticker and a smear-RGB-split-rainbow-ring jump transition.
- Palette: ring segments `#e5322d`, `#f7c928`, `#1fa39a`, `#2a6fc0`, `#e0478f`; per-universe grades (cold green fluorescent office; candy-pink product shot with pink and cyan rims; etc., hex not given)
- Type: white subtitles in the quiet landscape universe (face not given)
- Motion & camera: each universe holds 2–4 s; first jump at about 1 s; jump = push into the sticker (a googly eye about 1/10 of frame height), smear, split RGB, then a rainbow ring of colour segments studded with eyes and beads blooms to about 80 % of frame height and bursts to white; signature frame = the ring around the subject
- Cuts & rhythm: transitions 0.5–0.8 s; demo 9 shots in 6.7 s (0.4–1.7 s each)
- Finish: one look per universe, invented from its world (realistic dressed workplace, surreal cosmic version with a gravitational-lens halo, silent wide landscape, commercial product shot)
- 3D: GLSL ray-marched scenes in real time
- Avoid: look-alike universes; a small plain ring
- Overlaps: microgame (each segment a different medium), new as ray-marched montage
- References: Daniels; cinematographer Larkin Seiple
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/95.jpg

### No. 96 · 3D Particle Fireball, IMAX Grain (after *Oppenheimer*, 2023)
- Lemo name: "3D Particle Fireball, IMAX Grain" · render 3D · tone 3D · blend: Real-time 3D (three.js); GPU particle simulation; IMAX 65 mm print grade; Trinity test high-speed photographs
- One line: a pre-dawn blue night lit by one huge textured particle event that swells behind the subject like a halo.
- Palette: fireball billows `#ff9a50` with white-gold core; warm glow `#ffd8a0` on ground and cloud undersides; pre-dawn blue `#2a3654`; dark earth `#16120e`; black smoke only as thin veins and the top edge (under 15 %)
- Type: none on screen
- Motion & camera: low wide angle, subject centred, slow push-ins; locked-off reverse shots of watchers
- Cuts & rhythm: five hard cuts building a countdown, the flash landing on a cut (0.6 / 0.4 / 0.4 / 0.8 / 1.0 s)
- Finish: event shape follows time: white flash (0.5 s), billowing dome by 1 s, rolling toroid, a dust wall sweeping out; event about 40 % of the frame right behind the subject; hot rim on the subject, faces lit warm at half strength; long shadows toward camera; clip only the core; IMAX grade: grain ±3 %, warm halation, vignette, slight gate weave
- 3D: a ~500k-particle GPU simulation (demo about 720,000 particles); also abstract visions (orbits, interference waves)
- Avoid: a smooth CG ball; smoke-shrouded fire
- Overlaps: new
- References: Christopher Nolan; cinematographer Hoyte van Hoytema; Berlyn Brixner's Trinity photographs
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/96.jpg

### No. 97 · Snowy Neon Night (after *Anora*, 2024)
- Lemo name: "Snowy Neon Night" · render 2D · tone 2D · blend: Neon tube signage; Wet-ground reflections and snow; 35 mm night photography
- One line: photographic neon night: real glass tubes in pink, cyan, orange and green smeared into wet ground and falling snow, a warm key on the face.
- Palette: neon pink `#ff4fa8`; cyan `#4fdcff`; orange `#ff9a2e`; green `#3dff9a`; warm sodium light; deep purple-blue night `#1e1838`
- Type: neon signage as lettering in the world (no flat neon lettering)
- Motion & camera: short 2–3 s shots, new angles on one place, each a slow push-in or pull-back; distance melts into bokeh
- Cuts & rhythm: short shots on the beat (demo 0.6 / 0.7 / 0.6 / 0.6 s)
- Finish: tubes built as glass tube, glow, bright tube, white-hot core, clips and dark jumper wires; rare flicker every 5–10 s; wet ground fills the lower quarter with long vertical reflections broken by plank gaps, joints or ripples; snow falls and drifts at the edges, tinted by spill; subject with a warm face key and narrow neon rims on both sides; bloom, vignette, grain ±3 %
- Avoid: flat neon lettering; strobing
- Overlaps: cel-anime-80s (neon city), new as photographic neon
- References: Sean Baker; cinematographer Drew Daniels
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/97.jpg

### No. 98 · 3D Long-Lens Dip-Road Chase (after *One Battle After Another*, 2025)
- Lemo name: "3D Dip-Road Chase, Long Lens" · render 3D · tone 3D · blend: Real-time 3D (three.js); Extreme telephoto compression; Heat haze and road mirage; VistaVision fine grain
- One line: a bleached desert road of stacked dips and crests seen through an extreme telephoto, vehicles sinking and reappearing through heat shimmer.
- Palette: sky `#7fb0e0`; haze `#ece4d2` (far horizon only); pale sand `#d2ae80` (never orange); hard sun `#fff0d8`; main vehicle faded seafoam `#86b5ad`; dark cracked asphalt, dense green scrub (hex not given)
- Type: none on screen
- Motion & camera: signature shot 3–5 s at a 2–5° horizontal field of view, stacking dips into waves, sky a thin band at most; then 1–2 s each of a low camera at a crest and a mount on the vehicle; real speed; vehicles leave the ground over crests
- Cuts & rhythm: alternate long-lens waves with close moments (demo five set-ups in 5.0 s: 1.2 / 0.8 / 0.6 / 1.1 / 1.3 s); end on a held pose
- Finish: hard sun from high to one side, crisp shadows; heat shimmer and mirage growing with distance; dust on landings; grain ±2 %
- 3D: a straight road over rolling dips and crests, roadside posts, scrub; three vehicles
- Avoid: wide lenses; a washed-out frame
- Overlaps: new
- References: Paul Thomas Anderson; cinematographer Michael Bauman (VistaVision)
- Frame: https://raw.githubusercontent.com/lemomo-ai/lemo-opuscar/main/styleboard/img/opuscar98/98.jpg

---

# Part 2: Collage B-roll (pyang5166/gbro-collage-broll)

## Halftone Paper-Collage B-roll
- Source: `pyang5166/gbro-collage-broll` `SKILL.md`, `README.md` (Chinese, translated here), `agents/openai.yaml`, `evals/evals.json`, `scripts/generate_video.py`; licence: MIT (© 2026 狗哥笔记)
- One line: a ~5 s vertical B-roll in which black-and-white halftone photo cut-outs and a few coloured cardstock pieces slide in and lock together on a flat, saturated paper field, like editorial stop-motion collage.
- Suits: B-roll laid under a talking-head voiceover, one abstract idea per line (AI, work, process, systems, "experience being lost"). Real footage: no. 3D: no. **AI images: yes, everything visual.** The still is made by Codex's built-in `image_gen`, and the motion by Google's `gemini-omni-flash-preview` interpolating from an empty first frame to the approved last frame. The only non-AI parts are the metaphor method, colour rules, spec template, QA and ffmpeg steps.
- Catalog rating: completeness **partial** (strong rules, almost no numbers) · distinctness high · specification low–medium
### Palette
| role | hex | where used |
|---|---|---|
| background field | not given | the spec has an empty `background_hex` slot; chosen per line by meaning (see below) |
| accents | not given | coloured cardstock: red, yellow, cyan, orange, purple, cream white |
| keylines | not given | "thin warm-cream" |
| measured from the demo GIFs (not stated by the source) | `#A62F23` red, `#DBA719` mustard, `#0D7169` teal, `#554767` purple (darkened corner) | corner average of the last frame of each 240×427, palette-reduced demo GIF; approximate only |
Colour-by-meaning table (translated): burnt orange / red = time being spent, labour, urgency; mustard yellow = tools, warning, lost experience; ink (dark) green = cognition, taste, a system reset; deep purple = norms, things settling into long-term memory; teal = judgement, collaboration, automation. Cobalt blue is explicitly *not* the default. A batch keeps one design language but changes the background colour. The subjects are mainly black-and-white halftone; colour paper only where it serves the information hierarchy ("not colour for colour's sake").
### Typography
None. Text, readable letters, numerals, subtitles, logos and UI are all banned in the frame. The voiceover line is never written on screen.
### Layout
- Vertical 9:16, a locked "poster" frame (no camera move).
- Central subject within the middle 70 % of the frame; generous clean colour-field negative space.
- 3–6 large, separable paper groups (so each can be animated in), never a screen full of fragments.
- One visual metaphor per line, 3–6 key objects. Metaphor vocabulary suggested: machines, clocks, film strips, filing cabinets, consoles, rule books, funnels, tracks, chess pieces. Action verbs: open, connect, leak, bind, file, light up, compress, branch, assemble.
### Elements
- Black-and-white halftone photographic cut-outs (people, hands, machines) as the skeleton; visible printed halftone dots.
- Coloured cardstock pieces for key items (cards, buttons, film, rule books).
- Crisp machine-cut edges, a thin warm-cream keyline round every piece, a soft low-opacity physical drop shadow, fine uncoated-paper fibre grain on the field.
- Demo subjects (from the README alt text and frames): a chessboard with a director's hand placing pieces and a teal projector throwing a yellow cone (red field); a printing press amplifying errors (mustard); workers feeding a press that outputs cyan sci-fi film (purple); scissors cutting a camera track (teal).
### Motion
- "Assemble from empty": the first frame is the empty colour field (made with ffmpeg as a solid `1080x1920` frame of the background hex), the last frame is the approved still; pieces slide in, snap into place, connect, perform the action, then the final composition holds.
- Order: base structure → people or key cards → connectors → action → final result ("structure first, subject or cards second, action and result last").
- Stop-motion feel ("crisp physical stop-motion timing"). No fades, no gentle drift or wobble, no slow zoom, no morphing, no new objects.
- No exact durations, easing or stagger: the video model decides the timing within the 5 s.
- Camera: locked off; one continuous shot.
### Transitions and rhythm
- One shot per clip, no cuts. Default deliverable 5 s, 9:16, 720×1280, 24 fps, silent MP4 (audio stripped with `ffmpeg -an` even when the prompt says no sound). The script accepts 3–10 s.
- Rhythm comes from the voiceover it sits under; a batch of lines should form a small narrative (e.g. manual waste first, then rules and human–machine division of labour).
### Finish
Paper grain ("fine uncoated-paper fibre"), halftone dots, soft shadows. No other finish values given. No glossy 3D, no photoreal environment.
### 3D look (if any)
None; "glossy 3D" is banned.
### Banned
Typography, readable letters, numerals, logos, watermarks, UI, subtitles, the full script on screen, glossy 3D, photoreal environments, clutter; fade-ins, slight drift/shake, slow zoom; cuts or camera moves inside the clip. Not for: shots needing precise layer/occlusion control or camera fly-throughs (use a layered HTML tool like HyperFrames), real people or product ads with presenters, or editable transparent layers.
### Example frames
- https://raw.githubusercontent.com/pyang5166/gbro-collage-broll/main/assets/demo-red.gif
- https://raw.githubusercontent.com/pyang5166/gbro-collage-broll/main/assets/demo-yellow.gif
- https://raw.githubusercontent.com/pyang5166/gbro-collage-broll/main/assets/demo-purple.gif
- https://raw.githubusercontent.com/pyang5166/gbro-collage-broll/main/assets/demo-teal.gif
(The GIFs are 240×427, 10 fps, 50 frames.)
### Gaps
No hex values; no halftone dot size, screen angle or LPI; no keyline width; no shadow offset, blur or opacity; no per-piece timing, easing or stagger (left to the video model); no sound; no type rules (no type at all). To make this look in our engine without AI generation we would need real photos to halftone (public-domain or our own), a halftone shader or filter, cut-out masks, and our own slide-in/snap timing; none of that is in the source.

---

# Part 3: Claude Animation Base (JohnHeibel/ClaudeAnimationBase)

## Painted Boil Cartoon (p5.brush)
- Source: `JohnHeibel/ClaudeAnimationBase` `ANIMATION_GUIDE.md`, `README.md`, `src/core.js`, `src/timeline.js`, `src/clawd.js` (grepped for values), `src/config.js`, `render.mjs`, `package.json`; licence: MIT (© 2026 John Heibel). Caveat: the star, Clawd, is Anthropic's Claude Code mascot; the guide says the design is a starting point, so for our videos design our own character with the same tools. Based on the music video "I'm Upping My P(doom)" (github.com/JohnHeibel/PDoomVideo).
- One line: a hand-painted, wordless 2D cartoon on warm paper; flat gouache-like washes inside boiling ink outlines, watercolour backgrounds that bleed, additive glows, everything bouncing on one beat.
- Suits: short character skits, mascot moments, emotional beats, music videos (acting the lyrics, never showing them). Real footage: no. 3D: no (forbidden). AI images: no. Stack note: p5.js 2 (`^2.3.3`) + p5.brush (`^2.2.3`, WebGL) in headless Chrome via puppeteer-core; using it inside Remotion would mean adding p5/p5.brush (a new dependency: ask first).
- Catalog rating: completeness **full** (motion and paint numbers in code; few type/layout numbers because there is no type) · distinctness high · specification high
### Palette
| role | hex | where used |
|---|---|---|
| paper | `#F3EBDC` | base sheet under everything; also "white" |
| ink | `#2B2233` | all outlines and "black" (never pure black) |
| clay | `#D97757` | Clawd's body; brush-wipe stroke colour |
| clayDk | `#A84D33` | body shade, far legs; brush-wipe stroke colour |
| clayLt | `#F2A283` | light clay (the body code defaults its light tone to `#F5B394`) |
| night | `#1F2550` | night skies |
| indigo | `#2F3C7A` | night/distance |
| rose | `#E27A92` | |
| ochre | `#E8AA38` | |
| sap | `#6E9F58` | grass/ground |
| teal | `#3A9C98` | |
| violet | `#7B5CA8` | |
| cream | `#FFF5E2` | highlights, eye whites, "white" |
| sky | `#8EC3E6` | day sky, tears |
| mood tints | pale `#F6E6D2`, flush `#E23E36`, blue `#6D86BE`, rosy `#EF8EA8`, green `#98B25E`, gold `#F0BE46` | mixed into the body at 0.55 × tintK (fear, anger, sadness, love, disgust, pride) |
| glow default | `#FFC766` | additive light |
| flash | `#FFFDF6` | full-frame flash |
| other props | blush fill `#E2476E`; mouth interior `#4A1F2A`; shades lens `#2A2740`; bulb `#FFE68A` with glow `#FFD27A`; demo star `#FFE27A` / `#FFE9A8` / `#FFD96A` | |
Rules: soft, harmonious colours, no pure black or white; pick a small palette per video; one world with a colour arc across the film (e.g. cold night → warm dawn). Keep the character clearly separated from the background.
### Typography
- No text, by rule: no captions, titles, labels, signs, speech bubbles, words on screens or typed "ZZZ". Reactions are painted marks (`!`, `?`, `!!`, `!?`, zzz, sweat, hearts, bulb, cloud, steam, stars, music…).
- Escape hatch only when the word *is* the joke: `letter()` in **Permanent Marker** (Google Font), 1–2 words, once; filled in the colour with an ink drop copy offset by (0.045, 0.055) × size, optional outline 0.12 × size; pops in with backOut. `sfx()` comic sound words live 1.2 s, tilt −0.08 rad wobbling ±0.03 × sin(20·age), fade over the last 0.25 s.
### Layout
- Canvas 1920×1080, origin top-left. (No vertical layout given.)
- Character scale by unit u (Clawd is 10u wide × 8u tall): wide 10–16, medium 20–28 (normal acting), close-up 40–70, extreme close-up 90+. Below u 12 only for establishing shots, never the whole video.
- One focal action at a time with a clear silhouette; depth from overlap, scale and colour (farther = smaller, bluer, paler), never from projection.
- Each shot paints the full frame; paper may show through as a valid look.
### Elements
- Every shape is a `paint()` call: flat `wash` (opacity 255 = exact colour) for characters and props, watercolour `fill` (default opacity 170, bleed 0.1, range 0.05–0.3; texture 0.4, range 0.3–0.9; border 0.35) for skies, hills, shading; optional `hatch` (e.g. charcoal/HB) sparingly; ink outline by default.
- Brushes (with `brush.scaleBrushes(5)`): `ink` weight 5, scatter .25, sharpness .8, grain 40, opacity 235, spacing .2, pressure [1.15, .75], noise .15; `inkfine` weight 2.6, scatter .15, sharpness .85, opacity 230, pressure [1.1, .8], noise .1; `dry` weight 14, scatter 3, sharpness .3, grain 6, opacity 90, spacing .6, pressure [1, .6], noise .4. p5.brush built-ins also allowed (2B, HB, charcoal, marker, pen, cpencil, rotring, spray).
- Outline weight scales with the character: sw = clamp(u / 15, 0.45, 2.4).
- "One shape, one outline": tails, vines, arms as one tapered `ribbon`, not stacked circles.
- Light is the one non-paint mark: `glow()` is an additive radial texture (stops 0:1, .18:.8, .45:.32, .75:.08, 1:0) tinted at alpha 150 × a, under the paper grain; p5.brush mixes like pigment, so yellow over blue would turn green.
- Character kit: 5 drawn key views (front, 3/4, side, 3/4 back, back), 31 emotions, 24 eye shapes, 16 mouths, hats, emotes, a "lunchbox lid" mouth for fury.
### Motion
- Boil: random streams reseeded 12×/s (`BOIL = 12`), so at 24 fps each drawing holds 2 frames; still things get their own `boilSeed(key)` so a moving thing doesn't make them re-boil every frame. `onTwos(t) = floor(t·12)/12` to step a whole shot.
- Easings: `ease` = smoothstep x²(3−2x); `easeIn` x³; `easeOut` 1−(1−x)³; `backOut` overshoot s = 1.9; `elasticOut` 2^(−10x)·sin((10x−0.75)·2π/3)+1.
- `spring(t, t0, k = 6, w = 18)` = e^(−k·Δt)·sin(w·Δt) (damping 6, 18 rad/s) for settles and follow-through; `ring()` sums one kick per event.
- `jump`: crouch over 0.12 s before take-off to squash 0.18, parabolic flight dy = −h·4k(1−k) with stretch −0.16·|1−2k|, landing squash 0.22·e^(−8a)·cos(20a).
- `take` (surprise): 0.1 s pre-squash 0.12·amt, then squash −0.26·amt·e^(−6a)·cos(16a) and lift −1.2·amt·e^(−7a)·max(0, cos 9a).
- Turns step through drawn key views over 0.12–0.25 s with a smear of 0.55·sin(kπ); never a 3D rotation.
- Emotion change (`emotions()`): eyes squint shut over the last 0.1 s before the change and reopen over 0.14 s after; pose blends with backOut over 0.4 s, colour/blush/gloom crossfade over 0.3 s; a take sized per emotion (e.g. neutral 0.3, happy 0.6, excited 1.0, laugh 0.8, love 0.7, proud 0.5, sad 0.3).
- Beat: default 120 BPM; `pulse(t, 6)` = e^(−6·frac(beat)) on each beat (`pulse2` on eighths); every idle, bounce and dance locks to it.
- Principles enforced: anticipation, squash and stretch, slow in/out (no plain lerp), weight, arcs (`arcPt` parabola), overlap and follow-through, no twinning (offset arms, blinks, crowd phases), exaggeration, strong key poses, eyes lead the thought.
- Nothing is ever still: per-emotion idle, cameras drift or push (demo: x drift 20·sin(0.6·lt) px, zoom 1 + 0.02·lt), grass sways, linework boils.
- Camera: `camBegin(cx, cy, zoom, rot)` 2D camera; `shakeXY` changes at 24 fps for impacts.
### Transitions and rhythm
- A transition at every seam, including into the first shot and out of the last; never start on a hard frame or just stop.
- Brush wipe: 5 fat painted strokes tilted −0.1 rad cover the frame (p 0→0.5, easeOut) then drag off (0.5→1, ease), per-stroke delays [0, .14, .06, .18, .1], alternating clay/clayDk with a 70-opacity watercolour fill and charcoal hatching (spacing 44); called in the last 0.3 s of one shot and the first 0.3 s of the next, cut under full cover.
- Iris / shaped iris (any polygon, e.g. a star or keyhole); demo iris-in 0.45 s, radius 0→1500 with easeIn. Flash. Whip pan with a smear. Match cut. Cut on action. A camera move that carries into the next shot. Fade or push from paper or black. A plain cut only on action or as a deliberate smash cut.
- Timing for the viewer: list each shot's "reads", one read at a time, fast actions but held meanings; 24 frames = 1 s when counting. Demo ending: throw 0.15 s, flight 0.8 s, payoff 0.45 s, reaction 0.6 s, wave 0.45 s, answer 0.4 s, iris + hold 1.2 s (the first version crammed it into ~1.3 s and failed).
- Music optional: set BPM and first-downbeat offset; land hits, cuts and takes on beats, big changes on bar lines; act lyrics, never show them.
### Finish
- Paper: base `#F3EBDC` with 70 soft radial stains (radius 120–500 px, rgba(160,125,80) at alpha ≤ 0.045) and 1,400 fibre strokes (1 px, 6–32 px long, rgba(110,88,60) at 0.035–0.095).
- Grain + vignette, static, multiplied over the whole frame so pigment sits "in" the paper: per pixel, 55 % chance of darkening by rnd·rnd·34 (warm: G −1, B −3); radial vignette from 0.45·H to 1.05·H fading to rgba(120,95,70,0.35).
- Glow is additive light under the grain. Output: 24 fps, JPEG frames at quality 0.94, x264 preset slow, CRF 17, yuv420p, faststart. Budget ≤ 1.5 s per frame (watercolour fills are slow without a GPU).
### 3D look (if any)
None: no 3D, no perspective boxes, no `rotateY`/WEBGL 3D, no fake-depth maths.
### Banned
Any text on screen (captions, titles, labels, signs, word bubbles, lyrics); plain p5 shapes (`rect`, `ellipse`, `fill()`: "2000s Flash"), gradients or digital glows in the paint; any 3D rotation or projection; pure black or pure white; faces that snap between expressions; linear or constant-speed moves, every part moving at once, mirrored/synchronised limbs or crowds; timid poses; a tiny character for the whole film; a character standing still with nothing happening; events stacked with no holds; hard starts/ends and hard cuts everywhere; jittery re-boiling of still things; muddy green-grey glows (yellow painted over blue); props floating near a hand; shots in unrelated worlds; copying the demo's story, sky, hills, star or shot structure.
### Example frames
- https://raw.githubusercontent.com/JohnHeibel/ClaudeAnimationBase/main/docs/emotions.jpg (all 31 emotions; animated: `docs/emotions.webp`)
- https://raw.githubusercontent.com/JohnHeibel/ClaudeAnimationBase/main/docs/views.jpg (views, motion helpers, hats)
### Gaps
No vertical layout; no typography system (by design); palette is a kit default, not a style rule; no sound design guidance beyond beat-locking; the look depends on p5.brush's pigment-mixing and brush engine, which Remotion doesn't have natively.

---

# Part 4: OneTake (feitangyuan/onetake)

## OneTake (feitangyuan/onetake)
- Source: `feitangyuan/onetake` `LICENSE`; licence: **PolyForm Noncommercial 1.0.0** (Required Notice: "Copyright (c) 2026 Patrick. onetake is free for noncommercial use only."; GitHub reports it as NOASSERTION/"Other"). **DO NOT USE.**

Nothing was extracted, as instructed. Only the LICENSE file was opened.

---

## Not styles, but useful parts

One line each, with the file it came from. Lemo paths are relative to `lemomo-ai/lemo-opuscar`.

### Library-wide rules, Swiss Motion, Collage B-roll, Painted Boil Cartoon
- Swiss knife-cut deletion: a 2 px line crosses the element in 1/16 note, then the element collapses to its midline in 1/8 (styles/swiss-motion/DEMO.md)
- Swiss clip-reveal words: rise from a clip rect below the baseline in 1/16, leave upward in 1/8; never fade (styles/swiss-motion/DEMO.md)
- Swiss snap curve: `cubic-bezier(.7,0,.2,1)`, start one note value early so the move lands on the beat; at 120 BPM 1/8 = 0.25 s (styles/swiss-motion/STYLE.md)
- Numeral climb: a giant number rises in 4 eased steps "one module at a time" (styles/swiss-motion/DEMO.md)
- Re-flow ripple: neighbours rearrange two units per sixteenth, nearest to the cause first (styles/swiss-motion/DEMO.md)
- Rotation reveal: rotate 90° in 1.5 beats, hold, then grid lines, labels, playhead sweep; never rotate and label together (styles/swiss-motion/DEMO.md)
- Coordinate readout gag: `col 5.00 row 0.00 · on grid` flips to red `off grid` with non-integer values as the rule-breaker moves (styles/swiss-motion/DEMO.md)
- Picture = score: one JSON drives both the graphic (column → pitch, row → onset) and the music (styles/swiss-motion/STYLE.md)
- Print foley set: letterpress clack (metal transient + 3.3/5.1 kHz resonances + wooden tray), ruling-pen "tss", guillotine snick, paper slap, numeral thunk, 58 Hz felt thump (styles/swiss-motion/DEMO.md)
- Lemo reading-time rule: hold every subtitle ≥ max(1.8 s, speech + 0.6 s); after text animates in, hold ≈ letters ÷ 15 + 1.5 s (English) or characters ÷ 4.5 + 1.5 s (Chinese); title cards ≥ 4 s (DIRECTOR.md §7)
- Lemo sound rules: every visible action has a sound; at least two real silences before the turn/peak; use sound as a transition (J-/L-cut) at least twice; no generic piano-and-strings (DIRECTOR.md §6)
- Lemo camera rules: at least four different camera moves per film; one signature shot; transitions made from the medium itself; subject ≥ 1/3 of frame height at key moments (DIRECTOR.md §8)
- Lemo mix recipe: compress TTS first, voice ≈ 10 dB above music by RMS, two-pass loudnorm to −14 LUFS; keep 20–120 Hz around −3 dB relative to the rest, no pad notes below MIDI 48 (TECHNIQUE.md §4–5)
- Grain in the encoder, not the page: page-drawn grain makes frames incompressible; add it at mux time, less on light grounds, none on pixel/vector looks (TECHNIQUE.md §2, §6)
- Text-on-screen check: each page exposes `TEXTS(t)` (every visible text with its box) so a script verifies reading time (TECHNIQUE.md §2, core/render/readcheck.mjs)
- Cue check: every visual hit compared with its music cue from one timeline file, aim 0 ms (TECHNIQUE.md §3)
- Collage assemble-from-empty: first frame = flat colour field, last = finished collage; order structure → people/cards → connectors → action → result, then hold (gbro-collage-broll SKILL.md)
- Collage colour-by-meaning: orange/red = time and labour, mustard = tools and warnings, dark green = cognition/reset, deep purple = norms and memory, teal = judgement and automation (gbro-collage-broll SKILL.md)
- Collage QA sheet: 1 fps frames tiled 5×1 at 270×480 plus first-frame and end-frame-vs-still comparisons (gbro-collage-broll SKILL.md)
- Brush-wipe transition: 5 fat painted strokes at −0.1 rad cover the frame then drag off, delays [0, .14, .06, .18, .1], 0.3 s each side of the cut (ClaudeAnimationBase src/timeline.js)
- Shaped iris: any polygon (star, keyhole, mouth) as the iris hole, aimed at the character's screen position (ClaudeAnimationBase src/core.js)
- Acted emotion change: squint shut 0.1 s before, reopen 0.14 s after, pose blends with backOut (s 1.9) over 0.4 s, colour crossfade 0.3 s, take sized per emotion (ClaudeAnimationBase src/clawd.js)
- Cartoon jump: 0.12 s crouch to squash 0.18, parabolic flight with stretch, landing squash 0.22·e^(−8t)·cos(20t) (ClaudeAnimationBase src/core.js)
- Settle spring: e^(−6t)·sin(18t) after any event, summed per event for hats, tails, stacks (ClaudeAnimationBase src/core.js)
- Boil on twos: reseed hand-drawn jitter 12×/s and give each still element its own seed so it holds between boils (ClaudeAnimationBase src/core.js)
- Paper + grain recipe: 70 faint radial stains, 1,400 fibre strokes, static multiplied grain (55 % of pixels darkened up to 34 levels) and a warm vignette to rgba(120,95,70,.35) (ClaudeAnimationBase src/core.js)
- "Reads" timing sheet: list what the viewer must understand per shot, give each read its own time, never overlap two (ClaudeAnimationBase ANIMATION_GUIDE.md §4)

### Lemo: Caption News, Newsreel, Countdown, Time-lapse Symphony
- Chunk-slam caption: split a line into 2–3 chunks, each 0.12 s apart, scale 1.3 → 1 in 0.13 s back-ease (overshoot 1.6), opacity in 0.04 s; one keyword gets a yellow block wiping left→right in 0.12 s (styles/caption-news/STYLE.md)
- Frame-4 hook: the film's biggest number in a yellow block lands within 0.15 s and rolls to its value in 0.45 s, then unit + subject word (styles/caption-news/STYLE.md)
- Source tag rule: every figure on screen gets a sliding source tag (0.2 s) in the same shot, e.g. `USDA NASS · 2026.08.03` (styles/caption-news/STYLE.md)
- Document highlighter: PDF page at 220 dpi on a dark desk (±1–2° tilt), highlight rects from `pdftotext -bbox` (1 pt = 3.0556 px), multiply blend, swept in 0.3–0.5 s, number re-set as a type block beside it (styles/caption-news/STYLE.md)
- Proportion-by-darkness: a yellow line sweeps across footage to the percentage; the passed side goes grey/dark; figure appears on the dark side; works for any "X % of…" (styles/caption-news/STYLE.md)
- Freeze-and-question: 0.14 s white flash, punch 1.0 → 1.12, saturation 45 %, corner brackets close in, timecode chip with pause mark, music hard-stops to silence (styles/caption-news/STYLE.md)
- Ledger split: 4 px divider drops first, bad half desaturated + red tint, two counters race, difference stamped after both settle; hold ≥ 2.5 s (styles/caption-news/STYLE.md)
- Map-to-ground mask transition: map pushes in on a region, then a photo of that place grows out of the region's outline (styles/caption-news/DEMO.md)
- Cut grid: every cut on a 120 BPM half-beat (multiples of 0.5 s); footage 1.5–3 s, data cards 3–4.5 s; captions cross cuts, change ≤ every ~2.5 s (styles/caption-news/STYLE.md)
- Voice-clarity mix: under speech the music also loses 1.2–5 kHz (consonant band), music ~10 dB under voice; fixed an ASR mishearing (styles/caption-news/DEMO.md)
- Spinning-newspaper montage: scale by u^2.3, rotation decays by (1−u)^1.25 over 2.5 turns, 3 ghost copies 18 ms apart as blur, 16 px damped-sine jolt + 3 % bounce on the slam (styles/newsreel/STYLE.md)
- Projected-gate film look: 1.37:1 gate 1480×1080 with 26 px corners; flicker ±3.5 % + 3 Hz drift, weave ±1.6/±2.2 px, 0–3 scratches living 9 frames, 0–4 one-frame dust specks, vignette 0.42 H → 0.95 H; grain at mux (styles/newsreel/STYLE.md)
- Archive base grade: greyscale → percentile stretch 0.6 %/99.6 % → S-curve x+0.18(x−0.5)(1−|2x−1|) → output 14–238, one level set per clip (never per frame, it pumps) (styles/newsreel/STYLE.md)
- Period transitions as one-time punctuation: iris, diagonal hard wipe with bright 6 px edge, vertical flip, 12-slat venetian blinds, clock wipe from 12, page turn, push-over (styles/newsreel/STYLE.md)
- Grid deal → flip-book: stills land one per beat with a shutter click, camera dives into cell 1, the series plays on the beat as stop motion (styles/newsreel/STYLE.md)
- Grease-pencil freeze: freeze the telling frame, jolt, ring the detail with a hand-wobbled loop (~1.12 turns, two offset strokes) + arrow (styles/newsreel/demo/index.html)
- Word-exact document underline: soft-lead double underline placed from the scan's OCR boxes (archive.org hOCR) (styles/newsreel/STYLE.md)
- 1930 optical-track voice: HP 260 Hz, LP 3.7 kHz, +4 dB at 1.5–2.3 kHz, tanh drive 2.0, 4:1 comp, wow 0.22 % @ 0.55 Hz + flutter 0.07 % @ 6.3 Hz, reflections 31/67 ms (styles/newsreel/STYLE.md)
- Needle drop: band cuts dead, a public-domain 78 takes over (band-pass 110–6500 Hz, crackle only while the needle is down, varispeed ≤ 2 % to tempo), ends on its own final chord at the freeze (styles/newsreel/STYLE.md)
- Split-screen duel: two sides each with its own band panned L/R, trading 1 bar, then ½, then ¼; winner pushes the loser out (styles/newsreel/DEMO.md)
- Jitter-free clock: digits drawn one by one in fixed-width slots; each second the new digit drops 14 px in 0.12 s ease-out; tenths at 0.41× grey; 10-segment sub-second bar (styles/countdown/STYLE.md)
- Many-into-one merge: 3×3 cells move to their 640×360 tiles of the full frame while cross-fading to one shot, chips vanish in the first half, warm flash rgba(255,248,236,.7) τ ≈ 0.11 s, 0.42 s total (styles/countdown/STYLE.md)
- Re-layout recipe: 0.34 s easeInOutCubic; new cells open from the left edge, leaving cells close to the left, landing cell flashes a 3 px accent border ~0.2 s (styles/countdown/STYLE.md)
- Word-by-word live transcript box: speaking light + speaker type, each word fades in 0.08 s at its spoken time with a block cursor; narrator marked in a different colour (styles/countdown/STYLE.md)
- Sync badge honesty: "LIVE SYNC" vs hatched grey "SAME WINDOW · not frame-synced" vs "1× REAL-TIME" on re-timed slow motion (styles/countdown/STYLE.md)
- Planned-vs-heard checklist: milestones tick as the clock passes; a red "heard −32.1" tag with tiny waveform when the audio actually says it (styles/countdown/STYLE.md)
- Clock inversion at zero: dark block with orange T− flips to orange block with dark T+, header countdown → elapsed (styles/countdown/STYLE.md)
- Countdown score: 60 BPM so beat = second = tick; drone low-pass opens 140 → 1,300 Hz toward zero; tom per spoken count; music silent 0.25 s before zero; ticks alternate 1,850/1,480 Hz panned ±15 % (styles/countdown/DEMO.md)
- Pre-master for a loud climax: normalise to −14 LUFS, then linked look-ahead limiter 5 ms / 150 ms release, ceiling −3.3 dBFS (styles/countdown/DEMO.md)
- Light river (frame-blended time-lapse): integrate the speed curve to source time, each output frame averages the source frames it covers (night 40×/blend 30, clouds 37.5×/blend 24, nightfall 75×/blend 30); ~40 % shutter for daytime clouds (styles/city-symphony/STYLE.md)
- Cut-point table by subdivision at 120 BPM/30 fps: eighths 30→15 frames, triplets 15→7/8, sixteenths 1–4, brake 90–120, finale 7→4→2; never cut faster than the current subdivision (styles/city-symphony/STYLE.md)
- Brake into slow motion: ramp 2.2× → 0.3× in 0.55 s on the bar where the arpeggios stop; minterpolate for soft subjects, frame crossfade for thin lines (styles/city-symphony/STYLE.md)
- Crowd → light tracks: per-pixel median background, blobs > 22/255, centroids linked < 70 px with 2 px accent lines fading ×0.9/frame, plate darkened over 0.15–0.55 s; tripod shots only (styles/city-symphony/STYLE.md)
- Growing split grid: 1×2 → 2×2 → 3×3 → 4×4 per half bar, new cells light in scattered order within 0.3 s (never via black), 6 px gutters, last beat re-cuts every sixteenth (styles/city-symphony/STYLE.md)
- Day/night flicker and "photo that moves": two same-position frames alternating every 2 frames (styles/city-symphony/STYLE.md)
- Reverse flashback before the end: earlier shots in reverse, 4 frames each then 2 frames each, then hard cut to black on the bar line with music cut dry in 15 ms, reverb left ringing (styles/city-symphony/STYLE.md)
- Number lock: a census number locks one digit per sixteenth while others roll, one glockenspiel note per digit; flow numbers count up from 0 in 0.6 s ease-out (styles/city-symphony/STYLE.md)
- Release-print grade: partial grey-world WB (0 for night) → S-curve slope 6.2 pivot 0.47 blended 55/45 → black 7 white 250 → R×1.025 B×0.965 → sat 0.86; bloom >170/255 blurred 6 px at ⅛ size × (1,.82,.62) (styles/city-symphony/STYLE.md)
- Reading light on a scanned page: window pushed 1.06 → 1.56 page widths, top-left side light, Gaussian band σ 95–140 px over the quoted line growing to +38 % (styles/city-symphony/STYLE.md)

### Lemo: Visual Investigation, Constructivist Montage, Telestrator, News Package
- Freeze, circle, magnify: white-flash freeze, 2.5 px red circle drawn clockwise in 0.5 s ease-out cubic, label at 60 %, ×2 loupe cropped from the same source pixels (styles/visual-investigation/STYLE.md)
- Evidence cut-in: element appears in ≤ 0.1 s with a 3–4-frame white flash, never flies or pops (styles/visual-investigation/STYLE.md)
- Three-column sync grid: report / photo / video under one big stopwatch, each column cuts in when its source begins, freeze on sync with a red dashed line (styles/visual-investigation/STYLE.md)
- Rewind cold open: open on the decisive frozen frame, slam other sources into a 2×2 grid, sweep a sync line, rewind under scan lines (styles/visual-investigation/DEMO.md)
- Archive film clean-up chain: bwdif=0 → crop → hqdn3d=2:2:3:3 → lanczos ≤ 2.5× → unsharp 5:5:0.5 → greyscale; modern footage ≤ 1.5× (styles/visual-investigation/STYLE.md)
- Document highlight: red `multiply` at α ≈ 0.6 wiped left to right over only the decisive line of a scanned page (styles/visual-investigation/STYLE.md)
- Grain on sources only: six 256² Gaussian tiles rotated per frame, overlay α 0.22 on footage, 0.10 on paper, never on type (styles/visual-investigation/STYLE.md)
- Reading-time formula: CJK ÷ 4.5 + other chars ÷ 15 + 1.5 s; verdict boards ≥ 2.5 s; counters exempt (styles/visual-investigation/STYLE.md)
- Audible stopwatch: pendulum tick every 0.5 s, then one tick per event second (accent every 5); silence cut 0.2 s before the key hit (styles/visual-investigation/DEMO.md)
- Dots for people: one dot per person, the dead turn into red open rings one by one, one large number (styles/visual-investigation/STYLE.md)
- Two-tone print grade: per-clip percentile stretch (0.7/99.5 film, 0.8/99.4 photos) → S-curve s = 0.32 (docs 0.18) → lerp ink #141210 → paper #EDE4D0 (styles/kino-montage/STYLE.md)
- Slam with shake: arrive along the axis in 0.08–0.2 s ease-out, hard stop, shake 3–18 px decaying exp(−14·Δt) (styles/kino-montage/STYLE.md)
- Red band wipe: 260 px red band at 72° sweeps the frame in 0.25 s, landing on the downbeat, next scene behind it (styles/kino-montage/STYLE.md)
- Iris from a marker circle: a red circle drawn on a map becomes an arc clip that grows to frame size onto footage (styles/kino-montage/STYLE.md)
- Acceleration by halving: shot lengths 0.5 → 0.25 → 0.125 s (min 3 frames), grounds alternate red/ink, a counter jumps per cut (styles/kino-montage/STYLE.md)
- Photo cut-out recipe: person segmentation → threshold 0.5 → median → largest component → 7 px paper border outside the mask (styles/kino-montage/STYLE.md)
- Key drawings off a scanned page: alpha = (205 − luminance)/90, then stand them on one ground line to scale as a chart (styles/kino-montage/STYLE.md)
- 3×3 counting grid: windows light one per sixteenth in a spiral, clips at 1.4–1.8× ping-pong, centre counts to 9 and lights red (styles/kino-montage/STYLE.md)
- Photomontage tower: floors slam from alternating sides every sixteenth, camera y follows eased floor count, counter rests on the dated anchor while its caption shows (styles/kino-montage/DEMO.md)
- Silence before the heaviest hit: one half-bar of true silence (ink frame, one red dot), then tutti + gong; and a 25 ms fade at sample 0 to stop AAC overshoot (styles/kino-montage/STYLE.md)
- Freeze entry punch: white flash 0.1 s at 0.55 + scale 1.035 → 1.0 in 0.35 s ease-out + desaturate 42 % + cool cast + vignette, then 1.2 % creep (styles/telestrator/STYLE.md)
- Spotlight hole: darken outside a focus ellipse to 0.42 with an even-odd clip, 0.3 s fade (styles/telestrator/STYLE.md)
- Broadcast marker line: outline width+6 black 0.55, coloured core with glow 18, white highlight width×0.28, arrowhead pops in last 10 %, dashed = intended, solid = happened (styles/telestrator/STYLE.md)
- Perspective ring under feet: ellipse ry = 0.36 r drawn clockwise, outer dashed ring rotating 60 px/s, light beam while moving (styles/telestrator/STYLE.md)
- Tape rewind: clip reversed in 0.6 s ease-in-out, ±13 px horizontal jitter, four white tracking bars, ◀◀ REWIND (styles/telestrator/STYLE.md)
- Frame-counting stopwatch: counts source frames ÷ fps from the receive frame, stops and turns yellow on the strike; tick sound every 0.2 s (styles/telestrator/STYLE.md)
- Homography flatten: fit a ground plane from 6–8 known markings (≤ 6 px residual), warp the frame as a 1.5 m triangle mesh into a top-down board (styles/telestrator/STYLE.md)
- Packaging wipe: yellow slanted band with dark edges crossing the frame in 0.34 s, only between segments (styles/telestrator/STYLE.md)
- Music freezes with the picture: on every freeze the drums stop; brass stab + timpani + thump + shutter, then closed hi-hat only (styles/telestrator/STYLE.md)
- Packaging over watermarks: corner bug and score bar placed exactly over the source logo/URL from frame 1, never faded in (styles/telestrator/STYLE.md)
- Sting becomes the bug: slashes 0.04/0.10 s, plate slam 0.16–0.42 s with ring + shake, glint 0.85 s, plate flies to the corner 1.12–1.45 s and stays all film (styles/news-package/STYLE.md, DEMO.md)
- Persistent lower-third strap with flipping words: new words up from below, old up and out in 0.32 s; tab flashes white on category change (styles/news-package/STYLE.md)
- Package layer travels with its picture: under a wipe each side draws its own strap/tab/source/corner tag so the band brushes the headline over (styles/news-package/STYLE.md)
- Three-colour band wipe: accent 84 px + ink 5 px + gold 14 px edge, vertical, 0.3 s, between stories only (styles/news-package/STYLE.md)
- Split-flap before/after board: tiles 220×130, halves clipped separately, old and new value on one board, ×2 called out (styles/news-package/STYLE.md)
- Threshold break: line advances one period per step to a dashed gold threshold; music stops one beat before the last step; crossing gets the heaviest hit, shake and ring (styles/news-package/STYLE.md)
- Stamp landing: from 1.9× to 1× in 0.16 s with an expanding ellipse, rotated −6° to −10°, max one per story (styles/news-package/STYLE.md)
- Documents fly from a city: 380×490 paper on an arc in 0.5 s, scale 0.08 → 1, rotation settles, boxes tick on key words (styles/news-package/STYLE.md)
- Duotone plate grade: percentile 0.5/99.6 → γ 1.05 → 35 % S-curve → black 8 / white 232 → #0E1013 → #ECE7D8, 50–55 % vignette, 7 % grain (styles/news-package/STYLE.md)
- Rundown open and tick-off: the same list opens and closes the bulletin, rows flip in on the beat with glockenspiel notes, ticked at the end (styles/news-package/STYLE.md)

### Lemo: Satellite Briefing, Briefing Board, LiDAR Survey, White Model
- Map vs photograph tear (Satellite Briefing): dive into a printed map of the claim until it fills the frame, a scanner bar sweeps down in 0.34 s and tears it away to reveal the real ground; precede with a 0.45 s suck-out (styles/satellite-briefing/DEMO.md)
- Time rings in a locked frame: dated plates scan in one by one, each leaves its outline ring, the band lost between rings flashes; spacing 1.8/1.2/0.9/0.6/0.9 s while the camera accelerates (motion/s 1.2 → 3.9) and brakes in 0.3 s (styles/satellite-briefing/DEMO.md)
- Range line recipe: mark destination, grow a 4 px ticked line (ticks 10 km, numbers 50 km) with a reticle and rolling counter at the tip, chase the tip, land the number on the spoken word, pull back to show the whole distance (styles/satellite-briefing/DEMO.md)
- Transcript-strip subtitles: bottom-left at x 96, 2 px white rule, dark plate rgba(5,8,11,.62) fading to 0 rightward, always one line per cue measured with the real font, safe width 1100 px at 1080p (styles/satellite-briefing/demo/overlay.js)
- Readout block: 28 px label above, 96–130 px light condensed value with unit at 0.36× size, 23 px source note ("Landsat, measured") 56 px below, placed in the right third beside the thing measured (styles/satellite-briefing/demo/overlay.js)
- Analyst grade: one uniform from colour to grey: luminance + local contrast, a shoulder that keeps bright ground below white, toned #070B0E → #A1A7A9 at 1/5 chroma, so white is reserved for marks; colour returns only on the story's turning subject (styles/satellite-briefing/STYLE.md)
- Never-still camera rule: log-space distance interpolation, holds keep 2–5 % creep, automated check that no 1 s stretch falls below 0.6 mean pixel change (styles/satellite-briefing/DEMO.md)
- Suck-out before impact: 0.2–0.45 s dip of music + foley ~25 dB before the two or three designed hits, which are kept out of the bus compressor and carry weight at 60–120 Hz (styles/satellite-briefing/STYLE.md)
- Sound motif: an FM "lock-on ping" when a reticle locks (D6), answered later by a second lock; dry palette for most of the film, one wet timbre (glass harp, water) only at the turn (styles/satellite-briefing/DEMO.md)
- Reticle-to-end-card: the lock-on brackets open out into the frame of the title card (styles/satellite-briefing/STYLE.md)
- Whole-wall reveal (Briefing Board): design the final wall as a poster first, plan every shot as a crop of it, never show > ~60 % of its width or both side edges before the end, then one pull-back (z 1.42 → 0.28 in 2.05 s) (styles/briefing-board/DEMO.md)
- Judgement frame: for each item tested against a limit, frame the whole item + the limit + the verdict and hold ≥ 2.5 s (demo 2.6–4.1 s), each frame wider than the last so widening becomes the rhythm (styles/briefing-board/DEMO.md)
- Continuous-velocity ease: velocity ∝ u^a (1−u)^b with a, b ≈ 1.5–4, overlapping moves added as deltas in x, y, ln(zoom), roll; a < b gives a quick start and long settle (styles/briefing-board/demo/kit/README.md)
- Three-ink meaning system: graphite = names and rules, blue = measurement, red = the decision only (≤ 2–3 red marks per frame); grey for drafting lines (styles/briefing-board/STYLE.md)
- Erase to a ghost: a rejected idea wiped to a ~7 % blurred ghost that stays visible under the new plan (styles/briefing-board/STYLE.md)
- Board reading-time rule: text must stay fully in frame for CJK chars ÷ 4.5 + other chars ÷ 15 + 1.5 s from its appearance; pin labels where the camera rests, never on a move (styles/briefing-board/STYLE.md)
- Resolution guard: automated check that no frame shows a photo at < 1 source px per screen px; cap the zoom or find a bigger source (styles/briefing-board/DEMO.md)
- Magnets as countable things: units clack on in rhythm (eighths, each magnet a different pitch) and pop toward the lens when a rule removes them (styles/briefing-board/DEMO.md)
- Frosted-acrylic subtitle strip at bottom centre with a blue marker tick, one line per language against a 1,500 px safe width, key content kept above the bottom 15 % (styles/briefing-board/STYLE.md)
- Room-tone floor: air-conditioning + traffic bed ~20 dB under the voice, never ducked, and silences gated down to it rather than to digital silence (styles/briefing-board/DEMO.md)
- Photo to points: a scan line crosses an aerial photo left → right and the place behind it becomes its point cloud, with crackle and a 700 → 3800 Hz noise sweep riding the line (styles/lidar-survey/DEMO.md)
- Canopy peel on the beat: a horizontal cutting plane steps down by height above ground (30/24/18/12/6/0 m, one step per beat), points above lift away and glow, a ruler + histogram on the frame edge tracks it, one descending FM ping per layer (styles/lidar-survey/DEMO.md)
- Points condense: a world-space front shared by the point and surface shaders; points ahead brighten, a thin seam glows, the solid surface fills in behind over tens of metres (styles/lidar-survey/STYLE.md)
- Survey window: keep everything outside the measured area as dim points instead of black, so the subject reads as a lit stage (and private property stays unpeeled) (styles/lidar-survey/STYLE.md)
- Regrowth ending: the removed layer returns as a faint additive ghost over what was found, while the found features keep glowing (styles/lidar-survey/DEMO.md)
- Section chart: a plane crosses one feature, its profile glows and a dimensioned chart of the real samples (vertical ×5, median profile, two dimensions) hangs beside it (styles/lidar-survey/DEMO.md)
- Dry → wet sound turn: electronics (FM blips, ticks, sweeps) while the subject is data, one wooden/bowed timbre (marimba, bowed vibraphone) once it becomes a real thing (styles/lidar-survey/STYLE.md)
- Lights out, lamp on (White Model): house lights cut by a relay in 0.25 s, darkness, the projector lamp strikes with a brief flicker (zap + thump + fan rising), first layer washes in; lights return slowly over 1 s at the end (styles/white-model/STYLE.md)
- Projection shading term: colour × (0.42 + 0.58 · max(N·toProjector, 0)) × throw mask, scaled by albedo and reduced on water, so data reads as light on matter, never a texture (styles/white-model/STYLE.md)
- Layers by time with accelerating spread: each decade's buildings switch on one by one with a short flash, spreads 1.0 / 0.9 / 0.9 / 0.75 s, a year counter rolling, bass climbing one step per layer (styles/white-model/DEMO.md)
- The hole: light only the set that answers a question (e.g. built before a date) and let the absence draw the shape (styles/white-model/STYLE.md)
- Rising level: a soft level of light climbs every facade at once (25 m rings), low buildings finish first, the reading rides up the tallest one (styles/white-model/DEMO.md)
- Sun clock: a real sun for a real date/time sweeps shadows, then one shadow is traced (fill + edge) and measured by a range line with 100 m ticks (styles/white-model/DEMO.md)
- Left-third readout block: 20 px mono index, 24 px layer name, a 2 px colour rule growing to 48 px, a 128 px light figure + 60 px unit, 32 px label, 21 px source line, rising 22 px into place over 0.5 s (styles/white-model/demo/overlay.js)
- Model pin: 1.6 px hairline over a 4 px dark under-stroke from the tallest roof part up ~110 px to a 26 px tag (+20 px sub line) on a 62 % dark plate, line drawn in 0.45 s (styles/white-model/demo/overlay.js)

### Lemo: Data Physicalization, Teardown, Microscope, Archive Light Table
- Data reading plate: dot on object + 1.4 px leader + material swatch + category line + value/unit on a ~84 % translucent paper plate; pair readings stacked, larger on top (styles/data-physical/STYLE.md)
- Verdict after stillness: verdict plate in accent colour with a growing underline, only after the readings have been still >= 2.5 s (styles/data-physical/STYLE.md)
- The feed: a period's increase arrives piece by piece, quintic ease-out, unwinding yaw, 8-16 pieces/s, counter tied to landed pieces not time (styles/data-physical/STYLE.md)
- Stack-as-ruler: every 10th unit in a heavier material (brass) that also rings a pitched note up a pentatonic ladder, so the chart plays an arpeggio (styles/data-physical/STYLE.md)
- Suck-out before impact: music and foley -30 dB for 0.3-0.6 s before each of only 2-3 designed impacts (punch 60-120 Hz + bass drum + timpani + bell) (styles/data-physical/STYLE.md)
- Material foley: metal ticks 3-8 kHz inharmonic, acrylic toks 1-3 kHz, wood knocks, coins ring; density-scaled bursts at landing times (styles/data-physical/STYLE.md)
- Chart-to-installation pull-back: crane back and up to ~70 deg top view so stacks and inlaid ticks read as one dial; end card in left third (styles/data-physical/DEMO.md)
- Single-line subtitle rule: measure with the real font (nowrap), split into two cues instead of wrapping; bilingual = film language on top (styles/data-physical/STYLE.md)
- Label hold formula: >= CJK chars / 4.5 + 1.5 s or letters / 15 + 1.5 s; subtitles >= max(1.8 s, speech + 0.6 s) (styles/data-physical/STYLE.md)
- Stacked-piece anti-moire: per-piece random mm offset and yaw, +/-7 % value, hairline gap, 2x supersampling (styles/data-physical/STYLE.md)
- Exploded-view separation: ease-in-out cubed, layers top first 0.15-0.2 s apart, repeated parts in a wave by distance from a corner; close bottom first ~1 s/layer (styles/teardown/STYLE.md)
- Fixed label grammar: two-digit index in accent + name + one spec line, units always written, max one fact the voice doesn't say; anchor dot, growing leader, 10 px text slide (styles/teardown/STYLE.md)
- Perspective dimension lines: ticks drawn in scene perspective, text on a small dark plate following the line angle, never upside down; pen hiss per line (styles/teardown/STYLE.md)
- Label column via view offset: keep the label column x fixed and shift the projection (view offset ~170 px) instead of moving the object (styles/teardown/DEMO.md)
- Monotone cubic camera keys: avoid Catmull-Rom overshoot so macro holds really hold (styles/teardown/STYLE.md)
- One real motion: a part performs its true mechanical motion once (e.g. 4 mm key stroke and return) as the hook (styles/teardown/DEMO.md)
- DoF that grows in macro: one aperture, blur proportional to 1/focus - 1/z (styles/teardown/STYLE.md)
- Room-tone silences: two near-silences (~0.4-0.6 s) before the big separation and the turn back; first sound after is the key hit (styles/teardown/STYLE.md)
- QA: scan frames for one-frame black tiles (NaN normals after bloom) with a motion check (styles/teardown/STYLE.md)
- Log-spiral camera: similarity transform (zoom, roll, position) interpolated as M^u about the fixed point of two frames, so every zoom is a true dive with roll built in (styles/microscope/STYLE.md)
- Pyramid plate blending: draw the finest level downsampled <= ~1.45x, blend the next between 2.2x and 1.45x; stop before ~1.6x upsampling (styles/microscope/STYLE.md)
- Focus grammar: rack-in from soft (~0.95 s), a blur "breath" plus turret click at each magnification step, a tilted focal-plane sweep on landing (styles/microscope/STYLE.md)
- 1-2-5 scale bar + rolling field-of-view readout + magnification with a nosepiece glyph turning a quarter per change, all in one corner frosted panel (styles/microscope/STYLE.md)
- Counting the colour: circle drawn as an arc with cardinal ticks, scan front crosses it lighting counted pixels while the % rolls, lands with a small spring, raw counts below (styles/microscope/STYLE.md)
- Frosted panel: dark translucent glass rgba(12,14,17,0.74) over a blurred copy of the frame with a 1 px light rim, so white type reads on any background (styles/microscope/DEMO.md)
- Mark style: hairlines 1.5-2.5 px with a dark/light halo, one-elbow leaders, dimension lines growing from their centre (styles/microscope/STYLE.md)
- Instrument foley: turret click + detent + small metal ring, focus servo, pen on glass per line, band-passed scan with accelerating counter ticks, filtered sweep for the focal plane (styles/microscope/STYLE.md)
- Two circles, one verdict: measure A, truck at the same scale to B, pull back to frame both, silence, then the ratio (styles/microscope/DEMO.md)
- Loupe transition: loupe drops onto an object (scale 1.35 -> 1, ~0.4 s ease-out, shadow tightens), push until the rim passes the frame while the inside widens; rise out to leave (styles/archive-lighttable/STYLE.md)
- Loupe lens shader: ~2.5x, pincushion k ~0.16 at rim, per-RGB offset for fringes, black bevelled ring + glowing acrylic skirt (styles/archive-lighttable/STYLE.md)
- Negative-to-positive develop front: spreads from lens centre with a thin warm edge in ~0.8 s; negative transmission T = 0.035 + 0.9*(1-pos)^1.25 (styles/archive-lighttable/STYLE.md)
- Line lights up: one line of type brightens while the rest of the page dims, underline draws (0.3-0.6 s), number ringed then lifts into a reading card (styles/archive-lighttable/STYLE.md)
- Into the photograph (2.5D): ground-plane depth map + cut-out subject layers + fill, small dolly + lateral shift, subject drifts ~125 px (styles/archive-lighttable/DEMO.md)
- Light-table switch-on: flicker at 0.0/0.17/0.42/0.55 s, steady at 0.67 s, with ballast hum (100 Hz + harmonics) and starter clicks (styles/archive-lighttable/DEMO.md)
- Caption subtitle: dark plate rgba(14,15,17,0.74) with a 3 px signal-coloured edge, bottom centre, bilingual film language on top (styles/archive-lighttable/STYLE.md)
- Two records side by side, held 2.67 s, silence, then one struck in signal orange with a pen-stroke sound (styles/archive-lighttable/DEMO.md)
- The table becomes the index: pull back to the whole table, each object's tag flies into one list with ID and reading (styles/archive-lighttable/STYLE.md)
- Breath before the downbeat: cut all sound ~0.4 s before the landing chord; no narration during the signature push (styles/archive-lighttable/DEMO.md)

### Lemo: Crayon Book, Watercolor, Ink Wash, Impasto, One-line
- Boil on twos: re-jitter every stroke every 2 frames (offset ±0.8 px, wobble ±0.9 px), background lines ×0.6, background fills still, ×0.5 when the film goes quiet (styles/crayon-book/DEMO.md)
- Split stepping: drawn things at 12 fps, camera / wash edge / twinkles at 24 fps, so the hand-made look never reads as camera lag (styles/crayon-book/STYLE.md)
- Wax-resist reveal: hide the payoff in white "wax" from frame one; a wash band multiplied over the page uncovers it, density × (1 − 0.93·smoothstep(.12,.55,wax)) (styles/crayon-book/DEMO.md)
- Printed-words captions: handwriting face (Patrick Hand 54 px) in outline colour, bottom-centre, glyphs tilted/offset, written left→right in ~0.35 s on a ragged knock-out patch of paper, never a dark box (styles/crayon-book/STYLE.md)
- Text can't fade: titles leave by camera moving off, a page turn, or being coloured over (styles/crayon-book/STYLE.md)
- Pull-back reveal: a one-take film over one page ends by pulling out until the page is a book on a desk, then a strip-wise affine page turn to "The End" (styles/crayon-book/DEMO.md)
- Colouring as action: being coloured in = doing (scribble a coat = put it on, pink scribble = blush, wash = night falls) (styles/crayon-book/STYLE.md)
- Anchored paper tooth: grain lives in world space and cross-fades octaves on zoom to stay ~1 px; screen-fixed grain bloated the file 190 MB → 74 MB fixed (styles/crayon-book/DEMO.md)
- Lullaby sound: music box / toy piano (one note per counted thing) / glockenspiel note per uncovered sparkle, a full beat of silence after a failure, music box winds down with pitch droop at the end (styles/crayon-book/DEMO.md)
- Storyteller voice chain: HPF 75 Hz → compress (thr 0.2, 2.5:1, 8/140 ms) → +1.5 dB @220 Hz, −2 dB @3.2 kHz, high shelf −4 dB @6 kHz → de-ess 4.8–10 kHz 4:1 → near-field reverb wet ~−17 dB (styles/crayon-book/DEMO.md)
- Painting-in by screen position: progress = (REV(t) − screenX) / (span × max(.55, parallax)); each of N strokes takes clamp(4/N, .12, .5) of it so structure paints before detail (styles/watercolor/DEMO.md)
- Gradient walk: map one measured quantity to horizontal distance and dolly sideways across 4–6 zones (≈10–18 s each), palettes blended by camera position, a rising gauge in the corner (styles/watercolor/DEMO.md)
- Specimen + note: one hero object per view with a hand-written Caveat label drawn twice over a 12 px paper halo and a pen leader line that grows to it (styles/watercolor/DEMO.md)
- Post-finish sway: skew = k·(sin(1.15t+φ) + 0.4·sin(2.7t+2φ)), k 0.006 trees, 0.01–0.03 grass (styles/watercolor/STYLE.md)
- Mist erase: paper-coloured layers rise with a wavy edge to wipe the world back to blank paper, no cut (styles/watercolor/DEMO.md)
- Bilingual on-paper subtitles: serif italic 36 px + second language at 24 px beneath, ink 78 % over an 18 px paper halo, shown start−0.15 s to end+0.45 s with 0.25/0.35 s fades (styles/watercolor/DEMO.md)
- Quantised map ramp: 5–6 colour bands instead of a continuous gradient so data reads as paint (styles/watercolor/STYLE.md)
- Beat-aligned music edit: librosa beat track + chroma/MFCC self-similarity to find one jump that hits a target length, 0.18 s equal-power crossfade 60 ms before the beat; picture beat constants read from the same beats file (styles/watercolor/DEMO.md)
- Peaky-TTS fix: Kokoro is ~17 dB peak-to-RMS, so run a 5 ms look-ahead limiter (ceiling = speech RMS + 11 dB) before level-matching voice to music RMS + 8 dB; music ducks ×0.62 with 0.3 s smoothing (styles/watercolor/DEMO.md)
- Paper-brush foley: band-passed noise with 9 Hz tremolo and a panned sweep for every painting-in (styles/watercolor/DEMO.md)
- Five ink tones as opacity: burnt .96 / thick .82 / heavy .60 / light .34 / clear .16 multiplied onto paper; a usable value system for any monochrome style (styles/ink-wash/STYLE.md)
- Stillness-then-strike: hold with a slow 5 % push-in, the decisive stroke crosses the frame in ~4 frames, consequences start only after it finishes (styles/ink-wash/DEMO.md)
- Digital silence: zero music, ambience and reverb tails with short fades; allow at most one sound inside (a drip, one ring) (styles/ink-wash/STYLE.md)
- Ink-bloom transition: next scene grows inside a spreading drop with a dark tide-line, mask d·(0.62 + 0.8·fbm) (styles/ink-wash/DEMO.md)
- Inscription subtitles: italic serif in empty space, no box, a small vermilion square marking each line start, drying in ~0.35 s; reset camera transform so they don't slide in pans (styles/ink-wash/STYLE.md, DEMO.md)
- Stable stepped strokes: seed by stroke index and place bristle breaks on normalised arc length × fixed reference length so drawings on twos don't crawl (styles/ink-wash/STYLE.md)
- Font as skeleton: trace a brush font's centrelines in stroke order with hidden-tip entry and tapered exits instead of filling its outline (styles/ink-wash/STYLE.md)
- Footfall ripple: open ring stroke of 1.86π, radius ∝ age^0.6, fading over ~2.4 s (styles/ink-wash/DEMO.md)
- Handscroll ending: continuous pull-back until the whole journey is one painting on a silk mount, then the seal (styles/ink-wash/DEMO.md)
- Code-drawn seal: white lines knocked out of a slightly irregular red square with paste speckles; seal sound = wooden thump + paper crackle (styles/ink-wash/STYLE.md)
- Grey world, one colour: render every element with a grey (luminance, slightly cool, 5 % residue) and a colour version; reveal colour stroke by stroke with a travelling wave (styles/impasto/STYLE.md, DEMO.md)
- Value-first check: design each set as a flat 3-value illustration that reads at 480 px wide before adding texture (styles/impasto/STYLE.md)
- Wet reflections: stacks of short horizontal dabs under each light source, broken and fading, never a rectangle (styles/impasto/STYLE.md)
- One action = one sound = one cut: music-locked edit, hard cuts only on beats; pops pitched as a rising arpeggio (G→B→D / A→C#→E / D→F#→A) so a sequence climbs (styles/impasto/DEMO.md)
- Grand pause: cut music and beds to digital zero for ~0.45 s and freeze the rain mid-air, then the final chord (styles/impasto/DEMO.md)
- J-cut into silence: next scene's footsteps enter before the picture, a big splash is the first sound after the cut (styles/impasto/DEMO.md)
- Same-wide rhyme: reuse one wide set-up for opening, middle and finale so the change is the story (styles/impasto/DEMO.md)
- Overhead choreography: rotating crane-out above a crowd whose paths leave coloured trails that resolve into a pattern (styles/impasto/DEMO.md)
- Raking-light peak: drop light to a grazing angle at the climax so texture flares, then settle (styles/impasto/STYLE.md)
- Small text as crisp DOM/vector over a textured image; textured media can't carry small letters (styles/impasto/STYLE.md)
- Nib-follow camera: follow point = average of the nib over −0.55…+0.4 s (lag + anticipation), follow weight 0–1 per key, soft clamp keeping the nib inside 72 % × 66 % of frame; reusable for any "drawing on" or cursor-following shot (styles/one-line/DEMO.md)
- Pen pressure from speed: width × (0.66 + 0.8·exp(−v/300)) ± 8 % noise, fast = thin, slow = fat; pooling dots below 45 units/s (styles/one-line/DEMO.md)
- Curvature-weighted timing: time per point ∝ 1 + K·turn, smoothed; pin beats by arc-length fraction or by position; corners exported as note onsets (styles/one-line/STYLE.md)
- Written-on handwriting captions: 0.2 s + 17 ms per character, left to right, paper halo behind, 0.45 s fade out (styles/one-line/DEMO.md)
- Reverse-designed scale reveal: draw the final picture first, cut it into 6–8 chapters that each read as their own scene, then pull back ≈ 3 → 1 over 5 s and hold 1 s (styles/one-line/DEMO.md)
- Minimum screen-space line width: clamp the zoom used for width (≥ 1.3) during pull-backs so wide views keep weight (styles/one-line/DEMO.md)
- Pen-scratch foley from the speed track: band-passed noise 2.2–7.5 kHz when fast, 0.7–2.4 kHz when slow, fibre ticks with density ∝ speed, amplitude ∝ (v/520)^0.5, panned with the nib (styles/one-line/DEMO.md)
- Stop as climax: nib stops, teardrop blot spreads, music bus (and reverb tails) to zero, room tone to 15 %, 1.5–3 s (styles/one-line/STYLE.md, DEMO.md)
- Shadow-only pen and hands: blurred wedge at alpha .15 plus a 1–4 px contact dot; each hand one flat layer (styles/one-line/DEMO.md)

### Lemo: Whiteboard, Urban Sketch, Chalkboard, Shadow Puppet, Ukiyo-e
- Deadline-solved handwriting: each stroke follows u − sin(2πu)/(2π)×0.8 and the stroke set is scheduled into a window (`by:`) so a word finishes writing exactly on the spoken word (styles/whiteboard/DEMO.md)
- Hand-drawn stroke recipe: resample every 0.6×width, ±2.6 px normal wobble at ~220 px wavelength + tremor, pressure ramp 0.72→1, 12 % end taper, circles overlap past closure, rects = 4 strokes with corner overshoot (styles/whiteboard/DEMO.md)
- Marker ink compositing: alpha 0.94 multiply + 512 px speckle/streak tile via destination-out, locked to world space, faded when camera is wide (styles/whiteboard/DEMO.md)
- Glossy-surface sheen: soft diagonal white highlight at 10–16 % moving at 0.35× the camera, so a flat board reads as glossy (styles/whiteboard/DEMO.md)
- Floating-pen parking: pen lift ∝ hop distance (max 35 % of window); gaps > 0.75 s send it off-frame, returning 0.42 s before the next stroke (styles/whiteboard/DEMO.md)
- Camera pushes interpolated in 1/z so zooms feel like dollies; motion blur only when camera moves > 14 px/frame, sub-frames ≤ 4 px apart (styles/whiteboard/STYLE.md)
- Eraser-as-rewind: wipe a trail backwards along its path at constant speed, 90–230 px band at 90 % strength, leaving a 10 % ghost; pair with the previous music cue reversed and squeezed (styles/whiteboard/DEMO.md)
- Phasing duet: the same musical figure at two tempi for two diverging quantities, snapped into unison at the fix (styles/whiteboard/STYLE.md)
- Marker stroke sound: band-passed noise 2.2–7.5 kHz hiss + 0.5–1.5 kHz body enveloped by the stroke speed, 4 ms nib tick, squeak = 1.5–2.6 kHz sine with 7–13 Hz vibrato on ~28 % of long strokes, pan = screen x (styles/whiteboard/DEMO.md)
- Subtitle label: off-white rounded label at 90 %, Architects Daughter 44 px, accent marker dash, ≤ 44 chars/line, bottom 12 % kept free in every shot (styles/whiteboard/DEMO.md)
- Colour-arrival field: every pixel gets a time at which colour reaches it from event sources; wash revealed with a 0.16 s smoothstep wet front darkened +70 % just behind it (styles/urban-sketch/DEMO.md)
- "Only colour" hook: whole scene at colour 0 (pure ink), one hero object at colour 1, then colour spreads where that object travels (styles/urban-sketch/DEMO.md)
- Boil only the figures at 12 fps while the static page stays still and the camera moves every frame (styles/urban-sketch/STYLE.md)
- Hand-held follow camera: critically damped spring on a lead-ahead target, stiffness 28 (70 for a fall); punch-in with 0.35 s shake on impact (styles/urban-sketch/DEMO.md)
- Frayed page edge: noisy boundary fbm 0.004 ±80 px, 70 px white-dab band inside + 70 px coloured-dab spray outside; doubles as end card when you pull back to the whole page (styles/urban-sketch/DEMO.md)
- Carrot people for far crowds: one wash blob, two leg lines, a head dot (styles/urban-sketch/STYLE.md)
- Drawn wind: ink curls spawned on each beat, draw on in 0.4 s, erase from the tail, with trailing leaf dabs (styles/urban-sketch/DEMO.md)
- Pen-on-paper foley: band-passed noise 1.6–7.5 kHz with fibre texture and grain clicks, one burst per real stroke; J-cut a place's ambience a bar before it is seen (styles/urban-sketch/DEMO.md)
- One bar of true silence (ambience included) at the apex; the next gesture is the first sound (styles/urban-sketch/STYLE.md)
- Write–wipe–rewrite in place: write the misconception under its object, one wipe pass, rewrite the truth in the same spot from the same camera position (styles/chalkboard/STYLE.md)
- Reading-time formula for bilingual text: hold ≥ CJK chars ÷ 4.5 + other chars ÷ 15 + 1.5 s from when the block is wholly visible and fully written (styles/chalkboard/STYLE.md)
- Chalk-stroke reveal: stroke baked to a coverage sprite with arc length, revealed up to current arc length with a round leading edge; grain texture decides which pixels take chalk; 2–5 loose grains only at lift-off (styles/chalkboard/STYLE.md)
- Handwriting tempo: ~0.1 s per stroke for a big character, ~0.04 s per stroke for labels; faster than 0.07 s/stroke stops reading as a hand (styles/chalkboard/STYLE.md)
- Bilingual subtitle plate: zh 38 px over en 25 px at 1080p, baselines H−100 / H−62, plate #0a0f0c at 62 %, radius 10, 0.12 s fade (styles/chalkboard/demo/js/app.js)
- Sliding-panel reveal: front panel slides away to show a clean back board and slides back to close for the end card (styles/chalkboard/DEMO.md)
- Drying wet streak as an opening: soft darkened mask with a wide blurred drying edge receding to reveal what was left (styles/chalkboard/STYLE.md)
- Chalk foley from CC0 recordings cut into tagged grains (tap, stroke, squeak), one grain chain per stroke, level from stroke length, accent chalk low-passed (styles/chalkboard/STYLE.md)
- A line that sews two boards: one accent line crosses a panel seam to join cause and effect, used as a cut point (styles/chalkboard/STYLE.md)
- Transmitted-light compositor: white canvas, every piece drawn with multiply (holes stay bright, overlaps darken), times a lamp field (lobe σ 700 px + hotspot σ 120 px), tonemap 1 − exp(−hdr) (styles/shadow-puppet/DEMO.md)
- Lamp count as a story dial: exposure 1.75 / √(lamps lit); each lamp lit or snuffed steps the whole frame brighter or darker (styles/shadow-puppet/DEMO.md)
- Press-on / lift-off entrance: scale 2.6 → 1 and blur 34 → 0 px over 0.55 s; exit scale ×1.9, blur +30 px, fade ~0.9 s (styles/shadow-puppet/DEMO.md)
- Crash zoom of ~5 frames on a percussion accent, so the drum hit becomes a camera move (styles/shadow-puppet/DEMO.md)
- Hand tremor ≈ 3 px / 0.018 rad (×1.8 under tension) plus loose parts on damped pendulums pre-simulated at 120 Hz (styles/shadow-puppet/DEMO.md)
- Lamp flicker: ±6 % value noise at 7 Hz plus a small 23 Hz sine, independent per lamp; flare overshoot 1.5×, snuff over 0.35 s (styles/shadow-puppet/DEMO.md)
- Cut-out title plaque: fillText then destination-out so letters glow through dark material, carried on rods and pressed on/lifted off (styles/shadow-puppet/STYLE.md)
- Storyteller placard subtitle: dark gradient board 0.93 alpha, gold inner line, small seal, serif 46 px, slides up 18 px in 0.22 s, cut 0.3 s before the next line (styles/shadow-puppet/DEMO.md)
- Blurred foreground pillar wipe as a transition into a mirrored "behind the screen" view (x → −x) (styles/shadow-puppet/STYLE.md)
- Hard stop ≤ 30 ms with reverb tails cut, then a single tiny tap inside the silence (styles/shadow-puppet/STYLE.md)
- Misregistered colour blocks: each colour group cached offscreen and composited with a fixed 1.5–2.5 px offset in a different direction (demo g1 (2.2,−1.3), g2 (−1.8,1.9), g3 (1.5,2.2)) under the key line (styles/ukiyoe/DEMO.md)
- Printing reveal: each block lands over ~0.34 s with a diagonal noisy-edged sweep, sliding 5–6 px into register; a hyōshigi clap per block, accelerating (styles/ukiyoe/DEMO.md)
- Woodgrain texture: iso-lines of warped noise u = y·0.035 + fbm·9 + knots, dark lines where |frac(u)−0.5| > 0.4, source-atop α 0.1–0.17 (styles/ukiyoe/DEMO.md)
- Per-pixel bokashi gradient with a top edge wandering ±20–30 px per column, never fillRect strips (styles/ukiyoe/STYLE.md)
- Handscroll transition: camera slides right → left through a 260 px mounting gap to the next sheet; slides shorten to build urgency (1.0 → 0.9 → 0.6 s) (styles/ukiyoe/DEMO.md)
- Seal stamp: scale 1.35 → 1 in 0.2 s, source-over on dark grounds (styles/ukiyoe/STYLE.md)
- Mixed stepping: characters/nature 8 fps, rain/water 12 fps, camera on ones at 24 fps (styles/ukiyoe/STYLE.md)
- Four-beat climax (rise ~1.9 s, hang ~1.2 s + 80 ms silent breath, fall ~1.2 s, foam ~0.7 s) then hard cut to silence: a peak needs a ~1 s held beat (styles/ukiyoe/DEMO.md)
- Breaking the frame: the climax element escapes the sheet border into the mount, clipped at the sides so only the top breaks out (styles/ukiyoe/DEMO.md)
- Scale-reveal ending: pull back from the last sheet to the whole scroll of every view side by side as the end card (styles/ukiyoe/DEMO.md)

### Lemo: Red Paper-cut, Paper-cut Lightbox, Risograph, Halftone Dossier, Woodcut
- Fold–cut–unfold reveal: fold a sheet 2/4/8×, one cut, unfold on a strong beat; flap = ~16 strips scaled by cosθ and `1 + 0.28·height`, ≈0.55 s per fold, unfolds 0.25 s apart with ease-out "snap" + scale bump (styles/papercut-red/DEMO.md)
- Paper-piece builder recipe: grain texture in `soft-light` then alpha restored with `destination-in`; 1 px light rim upper-left / dark rim lower-right; shadow offset 2.6/3.6 px, blur 5 px, rgba(52,6,10,.38) (styles/papercut-red/STYLE.md)
- Inset-contour double outline: a 1.5-unit slit 3.5 units inside each figure outline, separates same-colour overlaps (styles/papercut-red/DEMO.md)
- 12 fps character stepping with 24 fps camera: pose at `floor(t·12)/12`, "pop" = 1.15× for one step (styles/papercut-red/STYLE.md)
- Scissor-cut reveal mask: circles r≈62 along the path, blades snip every 0.25 s (= one eighth at 120 BPM), camera holds the tip at ~32 % of frame (styles/papercut-red/DEMO.md)
- Pasted-couplet caption: red banner strip with serrated edges and swallow-tail ends, Fraunces SemiBold 44 px cream, 70 px from bottom, drops in on two 12 fps steps (styles/papercut-red/DEMO.md)
- Backlit-cutout projection: hole mask squashed onto the ground with matrix [1.25,0,-0.9,0.3] and added with `lighter`; bloom 10/40 px at ≈0.55 (styles/papercut-red/DEMO.md)
- Sheet-peel transition: night sheet peels from the top-right corner to reveal the day sheet; no dissolves (styles/papercut-red/DEMO.md)
- Paper foley set: scissors = shear sweep 2.5–9 kHz + short ring + fibre crack; cardboard thud steps (55 Hz + low noise); firecrackers = clicks 20–60 ms apart + low booms (styles/papercut-red/STYLE.md)
- Pull-back scale reveal: the whole film turns out to be one window flower pasted on a real lattice window (styles/papercut-red/DEMO.md)
- Lamp-on light cue: source (moon 0.5–3.2 s) → sky → each layer's translucency staggered 0.42 s → key → windows → flicker `1 + .06·sin(7.3t)·sin(3.1t)` (styles/paper-lantern/DEMO.md)
- Backlit paper shader: `emissive += albedo × lightCol × trans × lit × mix(.22,1,exp(−d²/R²)) × (.35 + 1.3·cloud)`, trans .9 far → .05 front (styles/paper-lantern/DEMO.md)
- Value-ladder depth: back layers bright/translucent, front near-black/opaque; one temperature per stack, change ladder to change place (styles/paper-lantern/STYLE.md)
- Near-plane curtain transition: two cloud-shaped halves close over the last 1.2 s of a shot and open on the next; front edges must meet (±.035 offset) (styles/paper-lantern/DEMO.md)
- Push-into-the-object opening / pull-out ending: room wide z 1.45 → 7 s ease-in-out push into the box; end pull-back z 0.5 → 1.08 to reveal the real lamp on a table (styles/paper-lantern/DEMO.md)
- Hand-held micro-drift on a locked shot: ~0.6 mm camera drift, renders on ones at 30 fps (styles/paper-lantern/STYLE.md)
- Quiet serif subtitle: Noto Serif SC 500 40 px, #fbf3e4, .06em, 74 px from bottom, fade in 0.15 s before / out 0.3 s after, split at comma nearest middle >21 CJK / >42 Latin chars; never subtitle words already shown in-picture (styles/paper-lantern/DEMO.md)
- Voice-anchored timeline: shot starts = line cue − 0.5 s, per-line gap table, so re-voicing re-times every shot (styles/paper-lantern/DEMO.md)
- Music hand-over solved backwards: start the second track so its swell lands on the key line (`T = line.at − 70 + .3`), 4.5 s crossfade (styles/paper-lantern/DEMO.md)
- Lightbox mix: voice compressed (−22 dB, 3:1, HP 70 Hz) to RMS −18 dB, music RMS −27.5 dB with 5.5 dB ducking (0.25 s envelope), foley −24…−34 dB, limit −1 dBFS (styles/paper-lantern/DEMO.md)
- Plate-channel rendering: draw into one RGB canvas where R/G/B = density of ink 1/2/3; `source-over` = knockout, `lighter` = overprint; shader composites `paper × Π mix(1, ink_i, coverage_i)` (styles/risograph/STYLE.md)
- Riso halftone + ink numbers: cosine spot, 7 px period at 1080p, angles 15°/0°/75°, threshold smoothstep ±0.07, solid ≥0.9, grain ±0.08, pinholes noise>0.93, density 0.80+0.14·streak+0.08·blot, paper fibre ±1.5 %, boil 35 % (styles/risograph/DEMO.md)
- Registration as emotion: fixed ±1–3 px per shot; kick 8–14 px decaying ~0.25 s with ringing on accents; drift up to ~25 px through a held bar, snap back on the downbeat (styles/risograph/STYLE.md)
- Knockout halo trap: stamp subject 12× in a 4–5 px ring with `filter: brightness(0)` before drawing it (styles/risograph/DEMO.md)
- "Plates as narrative" structure: one-ink opening, each turning point adds an ink and an instrument, full overprint at the climax, instruments leave one by one on the pull-back (styles/risograph/DEMO.md)
- Overprint transition: a disc of one ink grows over the frame turning everything beneath into the mix, then shrinks into the next scene's key shape (styles/risograph/STYLE.md)
- Knockout caption strip: paper-white zero-ink strip, 6 px radius, Jost 500 42 px, 0.5 px tracking, text on one plate so it fringes (styles/risograph/DEMO.md)
- Printer pull-back ending: the last frame slides out of a printer onto a stack of the film's earlier prints (styles/risograph/DEMO.md)
- Riso machine foley: paper feed "shhk" + drum "ka-chunk" at every plate arrival; bicycle bell = inharmonic partials ~2.1/3.4 kHz, 5 fast strikes (styles/risograph/DEMO.md)
- Grain-safe encode: PNG frames → lossless yuv444 qp0 intermediate → single CRF 16 `-tune grain`; per-frame jitter had pushed x264 from ~280 MB to 900 MB for 40 s (styles/risograph/DEMO.md)
- Stamp slam recipe: 0.09 s from 2.6× to 1× ease-in, 5 % damped bounce, same-frame camera shake (16–26 px, quadratic decay) + white flash ≤0.5 + boom-and-click SFX; empty the music just before it (styles/halftone-dossier/DEMO.md)
- Dot-wipe transition: 80 px grid of circles grows to r 62 (full cover) and back over 0.44 s centred on the cut, diagonal delay, switch while covered, per-cut colour (styles/halftone-dossier/DEMO.md)
- Telop caption bar: navy pill r 14, pink +8/+8 multiplied offset shadow, 46 px black-weight sans in cream, keyword in yellow/pink, pops in 0.4 s with −1.2° tilt ~1 s after the headline (styles/halftone-dossier/DEMO.md)
- Per-character headline pop: glyphs drop 30–100 px with squash, stagger 0.05–0.08 s (0.02 s for small text), back-ease overshoot 1.9 over 0.3–0.45 s (styles/halftone-dossier/DEMO.md)
- Misregistration headline shadow: same text +8/+8 px in an accent ink, multiply blend (styles/halftone-dossier/STYLE.md)
- Halftone density fields: radial halo, edge vignette, linear "lit from above" ramp; step 20–26 px, maxK 0.6–0.72, second layer multiplied at another angle (styles/halftone-dossier/DEMO.md)
- Volume-preserving squash landing: `sq = 1 − k·e^(−a·7)·cos(a·20…22)`, `scale(1/sq, sq)` (styles/halftone-dossier/DEMO.md)
- Case-file HUD: top-left case number (mono 22 px) + chapter chip, top-right REC dot blinking at 1 Hz + date, inverts on dark scenes (styles/halftone-dossier/DEMO.md)
- Dossier structure: title → accusation → mugshot (height chart, name plate, two flash frames) → Count 01/02/03 with giant halftone numerals → summary evidence cards → verdict stamp → reason → case closed (styles/halftone-dossier/DEMO.md)
- Boil without jitter: SVG turbulence displacement scale 5 reseeded every 0.1 s on characters only, transforms stay smooth at 30 fps (styles/halftone-dossier/DEMO.md)
- Carve-reveal instead of fade: every stroke has its own start and speed (0.08–0.35 s), coarse first, keyed by light / radial / down (styles/woodcut/STYLE.md)
- New-impression hard cut: two frames of misregistration jolt, [5,−3] then [−2,1] px (styles/woodcut/DEMO.md)
- Print-pull transition: brayer wet highlight → paper lays down → baren spiral soak-through → sheet peels on a cylinder toward camera showing mirrored show-through; mirrored title reads true once pulled (styles/woodcut/STYLE.md)
- Form-following hatching rules: direction follows form, width follows tone, far dense/fine, near sparse/coarse; cuts 30–160 px, blunt in, tapered out; knife 1.2–2 / V 2–8 / U 10–22 / stab r3–8 px at 1080p (styles/woodcut/STYLE.md)
- Photo/footage → woodcut filter: luminance = cut width, structure tensor = direction; re-run on twos with a fixed seed for moving shots (styles/woodcut/DEMO.md)
- Accelerating montage: hard cuts on beats of 1/1/1/.5/.5/.25/.25 s, each landing with a jolt (styles/woodcut/DEMO.md)
- Sound-equals-camera pull-back: 8× → 1× continuous pull-back from the source to the whole valley while the sound travels (styles/woodcut/DEMO.md)
- Margin letterpress caption: IM Fell English 42 px in the 132 px bottom margin, ink up in 0.1 s no slide, fade 0.15 s (styles/woodcut/DEMO.md)
- Metric modulation instead of tempo jump: 60 → 90 BPM via 3:2 (60's triplet eighth = 90's eighth) (styles/woodcut/DEMO.md)
- Digital silence before the loudest hit: 3 s at −91 dB, then the withheld timbre (a modal bell: partials 0.5/1/1.2/1.5/2/2.5/3/4 with own decays + two echoes) (styles/woodcut/DEMO.md)

### Lemo: Engraving, Silkscreen Poster, Printed Long Take, Spy Titles
- Swelling hatch line law: width × (0.2 + 0.8·sin(πu)^0.7), tapered over first/last 22 %; families at tone 0.14 / 0.5 / 0.75 (styles/engraving/STYLE.md)
- Magnification roundel: ring scribed around a part, inside re-cut at magnification, flown on an arc (30 px lift) to a margin slot with a 0.95 px leader routed ≥ 34 px clear; label cut on landing (styles/engraving/DEMO.md)
- Proof-pull transition: a sheet peels across a mirrored copper image and reveals the true-reading print (~0.7 s) (styles/engraving/DEMO.md)
- Watercolour bloom: region fills from the brush-touch point with a ragged front and drying wet rim, 1.25–1.6 s per region, 0.42 s stagger, multiply under ink, 3.5 px spill, 2/1.5 px misregister (styles/engraving/DEMO.md)
- Script subtitle on a deckled paper slip: Pinyon Script 38 px, ≤ 2 lines, max 860 px, on 0.1 s early, off 0.6 s late (styles/engraving/DEMO.md)
- Engraved-note reading rule: hold chars ÷ 12 + 1 s from the start of writing (styles/engraving/STYLE.md)
- Music trick: pizzicato only while lines are cut, first bowed note when colour arrives, 1.25 s of true digital silence just before (styles/engraving/DEMO.md)
- Burin foley: band-passed hiss 2.6–9 kHz + chatter clicks + plate resonances 1.18/2.31/3.47 kHz; swarf pings 5–9 kHz; hatching = granular micro-scratches densifying each pass (styles/engraving/DEMO.md)
- Cue-timing check: accent onset = first 30 % rise in [t − 60 ms, t + 120 ms] on its own stem, tolerance ±42 ms (1 frame at 24 fps) (styles/engraving/DEMO.md)
- Museum-label information order: title + scientific name → detail + term + note ×N → where to see it; 30–40 s (styles/engraving/STYLE.md)
- Stepped-band sky instead of a gradient: flat colour → thinning stripes → next colour (`bandSteps(x, w, y0, y1, n)`) (styles/silkscreen-poster/STYLE.md)
- Squeegee pull reveal: linear ragged clip front with ~30 u drag tail; accent ink half a beat behind its layer; one pull = one strum (styles/silkscreen-poster/STYLE.md)
- Registration look: every ink layer offset 1–3 px at 1080p + a ~2 u multiply ghost under each ink (trap) + light top-left / dark bottom-right rims, fills only (styles/silkscreen-poster/STYLE.md)
- Palette re-ink as "time passes": a diagonal blade (−12°) sweeps the whole sheet in 0.35 s, geometry unchanged, only inks change (styles/silkscreen-poster/DEMO.md)
- Loose-layer → register snap: planes parallax with 3 u paper gaps and 9 u thickness shadows at 28 %, then clamp to zero on the loudest downbeat before key facts (styles/silkscreen-poster/DEMO.md)
- Foreground-silhouette transition: truck through a tree/lamp post in the previous scene's darkest ink, centred on the switch so full cover lasts ~1 frame (styles/silkscreen-poster/DEMO.md)
- Info-band layout: dark band at the poster foot with name, accent number, 6 u accent rule and a content-sized stat row printed left to right on eighth notes (0.18 s each) (styles/silkscreen-poster/DEMO.md)
- Text-ink contrast picker: choose text colour by WCAG contrast against the ink underneath, never a fixed colour (`pickInk`) (styles/silkscreen-poster/DEMO.md)
- Reading rule for stacked items: hold ≥ chars/12 + 1 s (min 1.5 s) after the last item lands, rounded up to the beat (styles/silkscreen-poster/STYLE.md)
- Squeegee foley: band-passed noise with a 220–280 Hz mesh grain (faster = brighter); wet-ink squelch = falling sine + sticky noise; ambience J-cut 0.9 s early as a print "wakes up" (styles/silkscreen-poster/DEMO.md)
- 12 Hz "worn sheet" breathing: step paper flicker and blotches at floor(t*12)/12 in the post shader while camera and world move every frame at 30 fps (styles/printed-long-take/STYLE.md)
- World-anchored line shading rule: cut spacing in world units (or direction space for skies) so lines never swim; fade cuts to the field value when ≥ 1/4 row per pixel: k *= 1 − smoothstep(.25, .7, aa) (styles/printed-long-take/STYLE.md)
- Minimum-size accent point: keep the one accent mark ≥ 3–5 px at 1080p via gl_PointSize = max(px, uMin) (styles/printed-long-take/STYLE.md)
- Through-the-steam transition: a paper whiteout under 0.5 s that lands in a new scale or place (styles/printed-long-take/STYLE.md)
- "Same place printed again": locked frame, top sheet peels from the corner to reveal the next year's print, its accent a beat later and a hair off register (styles/printed-long-take/DEMO.md)
- Clock warp for reading holds inside a long take: slow one stretch of time and shift text, events and subtitles with it (WARP) (styles/printed-long-take/STYLE.md)
- Bilingual subtitle bar: one CJK line over one Latin line, never wrapped, paper letters on an ~80 % ink band inside the 5 % safe area (styles/printed-long-take/STYLE.md)
- Reading-time formula for mixed scripts: max(1.8 s, CJK chars ÷ 4.5 + Latin chars ÷ 15 + 1.5 s); comparisons hold ≥ 2.5 s before the verdict (styles/printed-long-take/STYLE.md)
- Verdict beat: silence, then strike-through + seal pressed with one frame of shake and a heavy low stroke (gran cassa) (styles/printed-long-take/DEMO.md)
- Ducking numbers for narrated long takes: music −17 dB under speech, foley −7 dB, master pre-mux −16 LUFS / −3 dBTP (styles/printed-long-take/STYLE.md)
- Scissor-cut edge recipe: resample polygon every 9–10 px, displace along the normal by low-frequency noise 1.2–2.2 px + rare 1–2 px notch, cache in local space (styles/spy-titles/STYLE.md)
- Paper cut-out layering: 2.4 px gap in the ground colour + shadow offset 2.5/3.5 px, blur 5, alpha 0.3 (styles/spy-titles/DEMO.md)
- Twos/ones split: puppets and landing letters at 12 fps, camera and credit slides at 24 fps (styles/spy-titles/STYLE.md)
- Stop-time gag: freeze the whole picture on a stab for 2 beats in true digital silence, then resume (styles/spy-titles/DEMO.md)
- Stab-as-cut: staccato brass placed 8 ms early so the sample peak lands on the cut frame (styles/spy-titles/DEMO.md)
- Accelerating match-cut montage: same circle centre and size across cuts, interval 2 bars → 1.5 bars → 2 beats (styles/spy-titles/DEMO.md)
- Diagonal shatter into title: strips parallel to a 30° cut slide off alternately while title glyphs fly in along it on consecutive 16ths (styles/spy-titles/DEMO.md)
- Paper-strip subtitle: tilted −1° cut-end strip bottom-left, film glyph as bullet, League Spartan 600 44 px, slides 60 px in 0.18 s, inverts per scene value (styles/spy-titles/DEMO.md)
- Tape-chain briefing voice: band-pass 220–5200 Hz, soft saturation, 0.9 Hz wow, hiss rising under the voice; music −7 dB under it (styles/spy-titles/DEMO.md)
- Encode tip for flat inks + grain: CRF 24 looks the same as CRF 19 at 1/15 the size (styles/spy-titles/DEMO.md)

### Lemo: Art Deco, Blueprint, Stained Glass, Pictogram Motion, ASCII/CRT
- Gold keyline stroke (`gline`): dark underline ~1.6 px wider than the line + banded gold gradient + hairline highlight; animate a `sheen` offset −0.2 → 1.2 for a light sweep on a hit (styles/art-deco/DEMO.md)
- Bulb-sign reveal: any text → glyph skeleton → evenly spaced bulbs; letter i lights at times[i] with ~1.6× flash settling in ~0.18 s, then a 16th-note chase; weld skeleton chain ends within ~14 px using the crossing number (styles/art-deco/STYLE.md, DEMO.md)
- Symmetric door-split transition: the outgoing frame becomes two leaves hinged at the frame edges swinging open from the centre seam; ending variant = leaves slide shut over the live shot (never over a flat interior) (styles/art-deco/DEMO.md)
- Centre-unfold title grammar: point → hairline → bars open symmetrically → text rises → wings + sparkle; the same unfold used for titles, subtitles and transitions (styles/art-deco/STYLE.md)
- Subtitle card as a stepped lacquer bar (~88 % black), double gold keyline, Josefin Sans SemiBold ~40–42 px, a small speaker icon per voice (styles/art-deco/STYLE.md, DEMO.md)
- Busby Berkeley kaleidoscope: 8 figures open fans one per eighth note, then overhead 8-way mirror slowly rotating, locking into a clock face (styles/art-deco/DEMO.md)
- Architectural section shot: rise with the hero, pull out to a cutaway of the whole building where the hero is a coloured dot with speed lines, push back in on a floor medallion, match-cut on shape (styles/art-deco/DEMO.md)
- Distance-as-filter sound: a band far away is low-passed (2.5 kHz on the street, 1.2 kHz through a floor) and opens as the hero approaches; a narrator moved through horn (band-pass 320–3.8 kHz, slap echo) → radio → PA → live mic (styles/art-deco/DEMO.md)
- Silence before the key sound: drop to one diegetic sound (clock tick, wind) and cut back in with that sound alone (styles/art-deco/STYLE.md)
- Zoom-aware line weight: screen width = world width × zoom^0.65, so close-ups don't turn into sausages and wides don't vanish; dash patterns scaled with zoom (centre `[34,7,6,7]`, hidden `[11,7]`, phantom `[30,6,5,6,5,6]`) (styles/blueprint/DEMO.md)
- Drafting-order build: centre lines → outlines → detail → hatching (45°, 8–14 units) → dimensions → balloons → labels, one layer per beat, draw-on truncated by arc length with a glowing nib (styles/blueprint/STYLE.md)
- Escapement mechanism motion: a gear advances one tooth (7.5°) per eighth note with a 0.35-beat ease-out; exploded parts leave one every ~0.055 of progress and return one eighth per group with a click (styles/blueprint/DEMO.md)
- Subtitle as drawing note: translucent box rgba(12,28,62,.58), 1.2 px + 0.8 px white rules, "NOTE / n" cell, hand lettering 38 px written on in 0.35 s, placed in empty sky per shot, wrap ~880 px, also collected into a notes column for the final wide (styles/blueprint/DEMO.md)
- Fig.-number transition: "FIG. 1" struck through and rewritten "FIG. 2 · EXPLODED VIEW" instead of a cut (styles/blueprint/STYLE.md)
- Fake 3D by oblique projection: animate the oblique depth factor 0 → 0.5 so a flat elevation gains thickness; extrude by stroking N depth steps at 2× width then filling them with paper (styles/blueprint/STYLE.md, DEMO.md)
- Machine acting: failure = slow, sag and wind down over ~1.5 s (ticks slowing ×1.35); joy = snap upright + needle back-ease overshoot (styles/blueprint/DEMO.md)
- Shadow-proves-lift: an object lifting off the page casts a shadow that also darkens the lines beneath, offset growing with lift (up to ~240 units) (styles/blueprint/STYLE.md, DEMO.md)
- One-use colour rule: a single stamp colour (`#C23B2E`) appears exactly once and carries the verdict (styles/blueprint/DEMO.md)
- Paper foley set: roll crackle/slap, T-square slide, pen scratch 2–6 kHz with length = stroke length, compass squeak, hatching 13 strokes/s, part clicks 3.1/5.2 kHz; whooshes low-passed at 2.5 kHz so they don't mask consonants (styles/blueprint/DEMO.md)
- Light-as-clock freeze rule: only the lit panel animates; its figures use `min(t, t_lightLeft)` so they freeze when the light moves on (styles/stained-glass/STYLE.md)
- Hue-preserving tone map: keep hue in mid-tones and blend to per-channel `1-exp(-x)` only at the very top, so bright sources burn white but saturated blues stay jewel-like (styles/stained-glass/STYLE.md)
- Sun-colour-as-time table: dawn (.70,.83,1.0)×2.2, noon (1,.97,.9)×2.7, afternoon (1,.84,.6)×2.35, dusk (1,.6,.34)×2.6, moon (.55,.66,1.0)×0.5 (styles/stained-glass/DEMO.md)
- Crack transition without a cut: 9 bright jagged lines in 0.28 s, white flash 0.45 s, 2-frame shake, all music hard-cut including reverb tails (styles/stained-glass/DEMO.md)
- Re-leading recipe: piece groups slide along the leads one beat each with a small outward bump, a weld spark per beat, one rising modal note per weld (styles/stained-glass/STYLE.md, DEMO.md)
- Banderole subtitle: parchment ribbon near the bottom that unfurls from the centre; text fades in only once ≥ 75 % open; IM Fell English ~44 px (styles/stained-glass/STYLE.md)
- Carved-title reveal: Cinzel 600 incised in stone (dark cut, light lower lip, gilding) revealed by a moving strip of light; push in so small lines are ≥ 30 px (styles/stained-glass/STYLE.md, DEMO.md)
- Projected-light scene: play the key action in a blurred, ~20 %-desaturated coloured patch on the floor, shot top-down, with shafts peaking ~40 % of the way down (styles/stained-glass/STYLE.md)
- Struck-glass foley: inharmonic partials ~1 : 2.32 : 4.25 : 6.63 : 9.38; crack = snap + pane thump + tinkle rain; lead = stick-slip creak (styles/stained-glass/STYLE.md)
- Opening knife-thin ray: band width 18 → 310 with skew .45 → .06 over ~1 s on a black frame, paired with a single glass tink, rhymed at the end (styles/stained-glass/DEMO.md)
- Row-shift grid pattern: 180 px square grid, discs on 34 % of nodes, ringed discs on 16 %, generic motifs in half the cells, five tones of one hue, canvas 3 cells wider than the screen so rows can shift ±1 cell (styles/pictogram-motion/DEMO.md)
- Breathing background: odd rows drift right, even rows left at 26 px/s plus a per-row sine offset; on section cards every row jumps a quarter-cell per beat (styles/pictogram-motion/DEMO.md)
- Mask slide-up type cascade: title over 0–0.5 s, second line +0.08 s, tag +0.2 s, meta types on without a caret; compress all timings ×0.7 on short cards (styles/pictogram-motion/DEMO.md)
- Band assembly entrance: cut a layer into 54 px horizontal bands offset alternately 90–250 px left/right and slide them into register over 0.42 s (styles/pictogram-motion/DEMO.md)
- Grid transitions in a 0.12 s-before / 0.26 s-after window: rows, cols, slide, quarter-discs from cell corners, iris from the last subject, 11×6 tile flip; rotate them per card (styles/pictogram-motion/DEMO.md)
- Pace ladder: normal item 4 beats, sub-family runs 2 beats, section card 8 beats; a second tempo by dividing the beat, never changing BPM (styles/pictogram-motion/STYLE.md, DEMO.md)
- Broadcast HUD: mono corner text (17 px) + a progress bar of N ticks (current tall 4 px, done 75 %, rest 28 %) derived from the item list (styles/pictogram-motion/DEMO.md)
- Long take with whips: stations one screen apart, camera drifting 42 px/s and whipping one full screen per cut (in-out expo, 0.14 s before to 0.24 s after the beat), parallax rows 0.28/0.42 (styles/pictogram-motion/DEMO.md)
- Icon-wall finale: all items return as a 9×5 grid, flip in, turn one colour, zoom to 0.9, collapse to the centre into one mark (styles/pictogram-motion/DEMO.md)
- Selective motion blur: average 5 sub-frames over a 0.5/60 s shutter only inside transition windows; static frames render once (styles/pictogram-motion/DEMO.md)
- Silence before a hit: mute drums and bass for half a beat before each section's big hit; check every shot onset to ±15 ms against the edit list (styles/pictogram-motion/DEMO.md)
- Geometric pictogram figure proportions: torso 0.30, neck 0.045, head r 0.082, upper arm 0.16, forearm 0.15, thigh/shin 0.225, widths 0.145/0.076/0.094, round caps, far limbs mixed 42 % to background (styles/pictogram-motion/DEMO.md)
- Font-size-as-camera: push in/out by changing the character grid's cell size (20 → 80 → 240 columns at 1920 wide), never by scaling an image (styles/ascii-crt/STYLE.md, DEMO.md)
- Text-to-image letter fall: particles spawn at random points inside matching source letters, start 18 px, shrink to cell size, fade in over 0.2 s, path y = u·(0.6 + 0.4u), landing flash 1.9× decaying 0.12 s; the image is built only from the sentence's own letters (styles/ascii-crt/DEMO.md)
- Fractal glyph push-in: hold 1 s where the whole glyph reads, then push until its inner sub-grid text reads; inside 100 %, outside 3–6 %, neighbours 20 % (styles/ascii-crt/DEMO.md)
- Terminal LOG-strip captions: dashed separator + inverse-video tag + `> ` prompt, uppercase mono ~45 px typed word by word on Whisper timestamps; idle state shows a progress bar (styles/ascii-crt/STYLE.md, DEMO.md)
- Typing speed as performance: machine 12–38 ms/char, dramatic lines on sixteenth notes (120–150 ms at 100 BPM), human typing hand-timed with pauses (styles/ascii-crt/DEMO.md)
- CRT power-on/off: dot → horizontal line → full frame, and collapse to a dot to end; analytic afterglow τ ≈ 0.12 s with one trail sample at t − 35 ms × 0.3 (styles/ascii-crt/STYLE.md, DEMO.md)
- Shared CRT/videotape post defaults (core/post/crt.js): scanlines 3 px × .18, RGB grille .06, chroma bleed 7 px, red shift 2 px, bloom .85, halo .22, glow .35, corner .28, noise .018, flicker .01; power-on and tape-tracking modes (core/post/crt.js)
- Modem/terminal foley: buckling-spring keys with a 3.4 kHz spring ping, teletype ticks for remote text, 2100 Hz answer tone with phase reversals + 1200/2400 FSK, 1 kHz BEL, degauss = 60 Hz + harmonics over 0.35 s, very quiet 15.7 kHz flyback whine (~−50 dBFS) (styles/ascii-crt/DEMO.md)
- Machine-voice processing: 16 % ring mod at 52 Hz, 6 ms comb (0.22), 140–7000 Hz band-pass, soft saturation; re-check with Whisper (styles/ascii-crt/DEMO.md)
- Digital-zero shock: drop the whole score including reverb tails to silence for several seconds (demo 5 s) on the story's disturbance (styles/ascii-crt/DEMO.md)

### Lemo: Data Storytelling, Isometric Infographic, Dark Keynote, Living Screencast, Hologram HUD
- Tempo picked for whole frames: choose BPM so the finest note is an integer frame count (90 BPM → 1/32 = 2 frames at 24 fps); accelerate by subdividing quarters → 8ths → 16ths → 32nds, not by changing tempo (styles/dataviz/DEMO.md)
- Ratchet rescale: axis rescale in four steps on 1/32 notes, each eased over 0.09 beat; hold any "frame break" ≥ half a beat or it reads as nothing (styles/dataviz/DEMO.md)
- Dot-to-stripe morph: staggered sweep over 0.85 beat, dot drops to band centre in first 45 %, then ease-out stretch to full stripe, ring removed (styles/dataviz/DEMO.md)
- Data-dot landing: r 6 px dot with 1.5 px ink ring, 0.25 s pop to ×1.55 plus thin ripple, ripples off when marks land < 0.1 s apart (styles/dataviz/DEMO.md)
- Figure-caption subtitle: serif 42 px left-aligned with the chart, hairline rule above, mono kicker showing the range drawn so far, 3-frame rise/fade (styles/dataviz/DEMO.md)
- Frozen-pane axis: when the axis scrolls off-screen, pin its tick labels to a paper strip on the frame edge (styles/dataviz/STYLE.md)
- Data-space annotation pins (value + pixel offset) plus a "memory zone" so later rescales never collide with notes (styles/dataviz/STYLE.md)
- Sonification recipe: midi = 62 + (v + 0.4) × 17, low values snapped to a pentatonic, mid to semitones, extremes unquantized, detune growing (5 → 45 cents) away from the reference; low-pass-gate "plonk" whose FM index rises with value (styles/dataviz/DEMO.md, STYLE.md)
- Silence before the verdict: 1.0 s true digital silence (all layers, render before/after in separate buffers) before the key mark; the first sound after it is the payoff (styles/dataviz/DEMO.md)
- Empty next cell ending: a dashed slot for the unknown next value that widens into the end card (frame within frame) (styles/dataviz/DEMO.md)
- Three-tone face shading from one base colour: top = mix 20 % toward warm white, dark side = mix 22 % toward cool `#231A2C`, mid = base; picked per face normal (styles/iso-infographic/STYLE.md, DEMO.md)
- Cutaway reveal: dashed cut line 0.3 s → skin slides out along its normal 0.35 s ease-out (alpha 1→0 between 10–75 %) → hatched section rims fade in over the last 40 % (styles/iso-infographic/DEMO.md)
- Isotype count: identical icons pop in with back-ease overshoot 2.2, one per sixteenth, count-up number over the same span; rearrange the icons differently each time (calendar, bar, silhouette) (styles/iso-infographic/DEMO.md)
- Nested-cutaway dive: three pushes 0.9 s, 0.6 s, 0.6 s (slow → fast reads as a fall), one instrument drops and the low-pass closes per level, then a snap-out ×470 in 1.2 s ease-out in log zoom (styles/iso-infographic/DEMO.md)
- Log-interpolated zoom camera (world centre + k px/unit) with zoom-based LOD: skip small detail above a threshold, fade tall objects in by zoom `clamp((80−k)/40)` so pull-outs never sweep a giant shape (styles/iso-infographic/DEMO.md)
- Focus + context: desaturate everything toward warm grey except items flagged "keep" (styles/iso-infographic/STYLE.md)
- Map-label subtitle: cream card, 10 px radius, 2 px ink border, tiny legend-chip cube, 42 px sans, bottom-centre 64 px up; border draws 0.2 s, text wipes L→R, exits down 8 px with fade (styles/iso-infographic/DEMO.md)
- Label pin anatomy: ringed dot → vertical leader → horizontal rule → title/number/unit with a 7 px ground-colour halo; direction chosen per station so it never covers the subject (styles/iso-infographic/DEMO.md)
- Echo bookend: opening and closing close-ups share pose, camera, zoom and tag position; only the object/tag value changes (styles/iso-infographic/DEMO.md)
- Accumulation as acceleration: arrivals on quarters, then eighths, then sixteenth-note waves; solids arrive by motion with squash 18 % + two bounces, never by fading (styles/iso-infographic/DEMO.md)
- Spawn-on-note: every generated UI element spawns on a note of the score from a shared note table; two marimbas phasing on one 12-note pattern make visual chaos = audible phasing, all voices realign on one chord at the "press" (styles/dark-keynote/DEMO.md)
- Typed spawn motions, 0.2–0.3 s: drop 34 px + 6 px bounce (0.22 s), fling with rotation (0.3 s), slide 90 px from right (0.24 s), pop 0.94 → 1.0 (0.22 s); tremble ±2.4 px before a freeze (styles/dark-keynote/DEMO.md)
- Ring-front collapse: ring expands at 2600 px/s; each item flies on a curved path to its own type's row (no crossings), 0.26–0.40 s, morph to tile in first third, overshoot along tangent, additive 9-segment trails (styles/dark-keynote/DEMO.md)
- Cursor acting recipe: blink 0.5/0.5 s as metronome; wind-up h×1.35 w×0.8 over 12 frames; 2-frame press at h×0.3 w×2.4; spring follow-through 0.6 s; shove 8 px + 10 % squash + 0.25 s wobble (styles/dark-keynote/DEMO.md)
- Light-sweep reveal: lit area trails the front by 700 px, 360 px soft glint at 20 %, unlit at 7 %, 1.3 s max (styles/dark-keynote/DEMO.md)
- Number from glyph noise: glyphs cycle at 24 fps with 3-copy vertical smear, digits lock right-to-left one per sixteenth with a damped bounce; number gets its own screen with no caption (styles/dark-keynote/DEMO.md, STYLE.md)
- UI expand/collapse as the only transition; start the expansion one frame early so the beat frame is ~80 % open (styles/dark-keynote/STYLE.md)
- CRT-off put-away: retract one UI part per beat, rim lights in accent, window squashes vertically (ease-in 0.22 s) into the cursor (styles/dark-keynote/DEMO.md)
- Toast caption: dark translucent pill `rgba(12,14,19,.72)`, 1 px border, Inter 500 40 px, 8 px accent "speaking" dot, 12 px rise + fade 0.16 s; lift content 25 px while up; typed in-frame text only goes to the .srt (styles/dark-keynote/DEMO.md)
- Two sound families: disorder sounds scattered (±45 cents, random pans, per-source timbre) vs product sounds one family in one pentatonic mode, centred, so hundreds of landings make one in-key shimmer; press "doom" = felt mallet + 55→40 Hz sine drop (styles/dark-keynote/DEMO.md)
- Speed-gated motion blur: blur only whips, from camera velocity; per-axis sigma = min(36, max(0, |v| − 30) × 0.3) px, applied to an untransformed wrapper so sprites don't smear wrong (styles/living-screencast/demo/main.js)
- Frosted caption pill: Inter 500 33 px, padding 12/26, radius 16, backdrop blur 14 px, `rgba(250,249,245,.88)`, 52 px from bottom, stressed words recoloured in the accent (styles/living-screencast/demo/index.html)
- KeyCastr-style key HUD bottom-left: dark pill, 38 px keycaps with 3 px inset bottom shadow, pressed key drops 2 px and turns accent (styles/living-screencast/demo/index.html)
- Chapter pill: serif 30 px label + accent number chip `01–04`, top-left at 56/48 px; "▶▶ 4×" time-lapse tag with rack focus for long waits (styles/living-screencast/STYLE.md, demo/index.html)
- Mascot on DOM top edges: measure live element rects each frame and stand the character only on top edges (inputs, menus, rows, heading letters) (styles/living-screencast/STYLE.md)
- Pixel-mascot jump: crouch 0.14 s squash 0.28 → stretch → tucked legs → landing squash with damped bounce + dust ~0.4 s; idle squash on each beat; walk 9 steps/s (styles/living-screencast/DEMO.md)
- Match-cut origin: the mascot's pixels come 1:1 from something already on screen (logo block characters) and it climbs out leaving a dashed outline (styles/living-screencast/DEMO.md)
- Film changes state: a dark-mode toggle's reveal circle keeps growing over the whole app and desktop, and the band crossfades to a low-passed "night" mix; reversed at the end from the mascot's feet (styles/living-screencast/DEMO.md)
- Karaoke-ball slogan end card: mascot hops word to word as each is spoken, each landing a chiptune note (C5 E5 G5 C6) (styles/living-screencast/DEMO.md)
- Two-resolution score: hi-fi band = the world, chiptune square = the mascot; duet left/right in split screen (styles/living-screencast/STYLE.md, DEMO.md)
- Target lock: box starts at 1.9× the part's bbox, 30 % alpha, rotated 45°, snaps in 0.22 s cubic ease-out, 3-frame white flash on the downbeat, tag `TGT 0N · LOCK` (styles/hologram-hud/DEMO.md, STYLE.md)
- Rolling value: characters lock right-to-left over 0.5 s (key spec 1 s), monospaced digits, turns accent with a one-frame flash on the downbeat; then the card fades 0.35 s and a chip slides x 140 → 110 into a side rail (step min(112, 410/(n−1)) px) for the rest of the film (styles/hologram-hud/DEMO.md)
- Axis-true explode: shell slides along its own assembly axis while contents stay and glow hot; open 1 beat, close 0.5 s (styles/hologram-hud/DEMO.md)
- Whip with real blur: 0.5 s cubic in-out starting 0.45 s before the next lock; 5 sub-frames over 1/48 s (180° shutter) only inside the whip, HUD sharp (styles/hologram-hud/DEMO.md)
- Scan plane in / scan-erase out as the only transitions; hook from high 3/4 orbit craning down so the rising plane reads as an ellipse (styles/hologram-hud/STYLE.md, DEMO.md)
- HUD subtitle: dark plate, two diagonal brackets, four voiceprint bars moving with speech, Rajdhani Medium 38 px, in 0.1 s before the voice, out 0.12 s before the next (styles/hologram-hud/DEMO.md)
- Spec-film information grammar: title ≥ 5 s; each value ≥ 2.5 s then docked; final sheet ≥ 3 s; 2–5 parts in 30–40 s; key part 3 bars, others 2 (styles/hologram-hud/STYLE.md)
- Additive wireframe glow: 1.3 px `lighter` strokes in 7 depth-fog alpha levels + ¼-res blur 3 px ×0.85 + ⅛-res blur 4 px ×0.7 (styles/hologram-hud/DEMO.md)
- Held voice duck: duck music −16.5 dB and foley −15 dB with a 0.5 s max-filter hold (no pumping between words); only the first 0.2 s of lock hits escape (styles/hologram-hud/DEMO.md)
- Theme from two numbers: `theme(hue, accent)` derives line/hi/dim/accent/background HSL so the whole film re-themes from two hue values (styles/hologram-hud/demo/engine/hud.js)

### Lemo: Transit Map, Isometric Picture Book, Circuit Board
- Headlight-to-dot match cut: tunnel lamps streak, oncoming headlights white out from 1.1 s, the white collapses into the red first-station dot at 1.4 s (styles/transit-map/DEMO.md)
- Falling interchange: a capsule drops from 3.4× size in ~0.4 s with a blurred offset shadow sharpening on landing, then shock rings in both lines' colours spread to 1.4–2.6 G in 0.9 s; sound = descending whistle + bass drum/timpani hit (styles/transit-map/STYLE.md)
- Stop pop recipe: scale from 0.6× with small overshoot in 0.28 s plus a ring 0.10 → 0.42 G fading in 0.6 s (styles/transit-map/STYLE.md)
- Odometer that never lies: enamel counter with cream drums (38 × 60 px at 1080p) landing only on sourced values, spinning blurred in between; ~1 landing per 2 s (styles/transit-map/STYLE.md)
- Analytic depth of field for a camera over a flat sheet: blur = aperture × |depth − focus| ÷ depth, capped 26 px at 1080p; never tilt beyond 65° (styles/transit-map/STYLE.md)
- Level-of-detail by zoom instead of by time: minor stops fade in 55–85 px/G, interchange names 62–90, stop names 100–130, hubs grow × (85/zoom)^0.6 max 1.75 (styles/transit-map/STYLE.md)
- Paper veil focus: 60 % paper wash over everything except the lit segment, never a dark overlay; used for "you are here" endings (styles/transit-map/STYLE.md)
- Label placement once against the finished layout (8 candidate sides scored, hubs first) so labels never jump as content arrives (styles/transit-map/STYLE.md)
- Reading-time formula for mixed CJK/Latin text: hold ≥ (CJK chars ÷ 4.5 + other chars ÷ 15) + 1.5 s (styles/transit-map/STYLE.md)
- Underwater mix: low-pass the whole score to 520 Hz with a water bed while a line runs under the river; mix to −16 LUFS, true peak ≤ −3 dBTP oversampled, before −14 master (styles/transit-map/DEMO.md)
- Floor type landing: key word painted on the ground, characters 0.14 s apart, each fading in and scaling 1.22 → 1 while going pale ghost → ink; one accent character per phrase (styles/isometric-picture-book/STYLE.md, demo/kit.js)
- Lid off reveal: roof flips open on its far hinge, paper side up, finishes turning inside the frame, then glides away while the camera rises to see the whole interior (styles/isometric-picture-book/STYLE.md)
- Three-tone flat shading `tri()`: top mixed 22 % toward #FFF8EA, side face base, other face mixed 20 % toward warm umber #5B4434; never toward grey/violet (styles/isometric-picture-book/demo/kit.js)
- Bilingual subtitle bar: pale rgba(250,245,236,.86) rounded bar, Chinese 34 px above, English 25 px below, baseline ≥ 54 px from bottom, one cue at a time, hard switch (styles/isometric-picture-book/demo/kit.js)
- Bars on the ground: two quantities painted as floor strips in proportion, held still 2.5 s, then a dashed bracket marks the difference (styles/isometric-picture-book/DEMO.md)
- Order lighting / weave fill: places light one by one in the order they will be used, then fill in a pattern so the room becomes a four-colour woven grid (styles/isometric-picture-book/STYLE.md)
- Speed cap for crowd time-lapses: nobody faster than ~3 m/s on screen; compress by showing places filling (styles/isometric-picture-book/STYLE.md)
- Motion check tool: render every frame at 30 fps and flag jumps, stop-start stepping and people closer than a body width, from positions pushed to a global hook (styles/isometric-picture-book/demo/tools/motion_check.mjs)
- One shot per narration line, a sustained low cello root overlapping every cut so scene changes never drop out; music ducks 16 dB under voice (styles/isometric-picture-book/DEMO.md)
- AC vs DC told by the shape of light: rocking short dashes (slowed ~0.55 Hz swing) for alternating, a continuous stream behind a travelling head with dimming afterglow for one-way; thinner trace + smaller dashes for step-down (styles/circuit-board/STYLE.md, DEMO.md)
- Matched step-down cut: same symbol held centred at one screen size (300 px) for 0.7 s per cut while the world around it changes scale; label stays in the same screen place (styles/circuit-board/DEMO.md)
- Plunge through a hole: hold on the hole first, plunge ≥ 0.6 s, reverse out of another hole the opposite way; sound = suction + pop (styles/circuit-board/STYLE.md, DEMO.md)
- Nested boards for deep zooms: each level its own coordinate system composited into its footprint, cameras converted between levels in double precision, so one pull-out spans 6+ orders of magnitude (styles/circuit-board/STYLE.md)
- Screen-space macro finish: DoF blur 2 + 7×dof px faded into top/bottom bands, drifting warm key light pool, 26 parallax motes (14–60 px, alpha 0.025–0.075), vignette to rgba(0,10,6,0.58) (styles/circuit-board/demo/src/post.js)
- Bevelled copper rim trick: draw the clearance once as a lighter rim, then the fill with the clearance grown ~1.6 px (styles/circuit-board/STYLE.md)
- Hum tuned to the key: drone on mains hum (50 Hz ≈ G1, 60 Hz ≈ B♭1); gated tremolo tone = AC smoothing into a steady tone = DC at the converter; relay clicks one step lower per step-down (styles/circuit-board/STYLE.md)
- Detail callout circle: an assembly-drawing circle showing another place or board at the same size beside the thing it is compared with; verdict held 5.4 s before "=" (styles/circuit-board/STYLE.md, DEMO.md)
- Reading check on moving cameras: a label's clock starts when first fully in frame and stops when it first leaves; plan label placement along the camera path (styles/circuit-board/STYLE.md)

### Lemo: Rubber Hose, 80s Cel Anime, Sci-Fi Sitcom Toon, Mid-century Cartoon
- Beat-locked tempo grid: pick a BPM where one beat is an even whole number of frames at 24 fps (8/10/12/16/20; 144 BPM = 10 frames) so beats land on drawings on twos (styles/rubber-hose/STYLE.md)
- Breathing props: every idle object scales by cos(2π·beats), ~5–7 % amplitude, all in phase, sampled on twos; ×3 at the emotional peak (styles/rubber-hose/STYLE.md)
- Constant screen-space outline: transform points first, then stroke, so ink stays ~6 px at 1080p at any zoom (styles/rubber-hose/STYLE.md)
- Line boil: ±1.2 px jitter, 3 drawings cycling at 12 fps, characters only, backgrounds never boil (styles/rubber-hose/STYLE.md)
- 4:3 gate film-damage pass: 1440×1080 gate, r ≈ 28 px corners, weave ±1.2 px + rare 3–6 px jump, flicker ±4 %, 0–3 scratches, 3–8 dust specks, vignette to 62 % at corners, 0.55 px blur, 3 px jump on every cut (styles/rubber-hose/DEMO.md)
- Title-card subtitle: near-black plate rgba(12,11,10,.92), white double-rule border, dot-and-ring corners, IM Fell English SC 36 px, drawn inside the film so it weaves and flickers, pops on/off (styles/rubber-hose/DEMO.md)
- Window-shade transition: a title card rolls up to reveal the set; iris that a character grabs and pulls shut as the ending (styles/rubber-hose/STYLE.md)
- Held-frame "thinking" beat: a chain of holds, each glance on an eighth note with a woodblock tick, slow push-in, music stops and everything freezes (styles/rubber-hose/DEMO.md)
- Optical-soundtrack ageing: band-limit 110 Hz–6.2 kHz, wow 0.6 Hz, flutter 7 Hz, soft saturation, hiss/crackle + 24 Hz projector clatter as the only sound inside silences (styles/rubber-hose/STYLE.md)
- Radio-announcer voice chain: HP 260 Hz / LP 4.6 kHz, tanh saturation, short room, compression, music ducked ~8 dB (styles/rubber-hose/STYLE.md)
- Automatic cel shading: clip to the shape, fill (shape − shape shifted toward the light) with the shadow colour (even-odd); shift away for highlight and a 2–4 px neon rim (styles/cel-anime-80s/STYLE.md)
- Colour models by multiplication: day fills × per-channel multipliers (night lit [.78,.74,1.0] / shade [.58,.52,.92] / line [.8,.7,1.1]; dawn lit [1.04,.9,.84]), skin overridden by hand (styles/cel-anime-80s/demo/pal.js)
- Emissive plate pair: every painted background has a matching emissive canvas for bloom; stamp character silhouettes black into it so glow never bleeds through (styles/cel-anime-80s/STYLE.md)
- Mixed stepping: characters on twos, blinks/lip flaps/eye openings on threes (8 fps), camera/light/rain on ones (styles/cel-anime-80s/STYLE.md)
- Impact frame: 2 frames of inverted/monochrome silhouette over radial lines, then the result; peak = one-beat freeze + white flash + painted "harmony" still with slow pan (styles/cel-anime-80s/DEMO.md)
- Light-band sweep on a held cel (`source-atop`) to show speed or tension without animating the drawing (styles/cel-anime-80s/STYLE.md)
- CRT/VHS pass numbers: chroma blur ~7 px + Cr shift ~2 px, 3 px scanlines at 0.18 with gap shrinking on brights, grille ±0.06, phosphor glow 0.35, corner darkening formula, power-on dot→line→picture (styles/cel-anime-80s/DEMO.md)
- VHS subtitle: Barlow Semi Condensed 600 54 px, cream-yellow #fff0a0, 9 px dark outline, 96 px above bottom; second speaker cyan #8ff4ff with a boxed tag (styles/cel-anime-80s/DEMO.md)
- Diegetic score switch: band-pass the score to cassette/AM for one bar when a tape plays in-world, then open to full range with a semitone key change (styles/cel-anime-80s/DEMO.md)
- Radio/phone voice: band-pass ~380–2800 Hz + saturation + squelch clicks (styles/cel-anime-80s/STYLE.md)
- Screen-space line boil: resample outlines every ~7 px, displace along normals with low-frequency noise ~1.7 px, 3 drawings at 12 fps, applied to everything incl. holds and backgrounds (styles/scifi-toon/STYLE.md)
- Audio-driven lip-sync: RMS → mouth open, spectral centroid → wide vs round, analysed at 24 Hz and sampled at the 12 fps drawing time; screams ×1.5–1.9 (styles/scifi-toon/STYLE.md)
- Dialogue subtitle with speaker pill: Baloo 2 ExtraBold ~50 px white, 11 px black outline, coloured speaker pill on the left, wrap over ~1300 px, older stacked line dims to 70 %; fast-dialogue hold max(audio + 0.35 s, 0.9 s + chars/17) (styles/scifi-toon/STYLE.md)
- Portal swirl wipe: rush zoom into the device → full-screen swirl wipe → next scene opens from a swirl; portal opens with ~12 % overshoot, back-ease 0.32 s (styles/scifi-toon/DEMO.md)
- Landing squash: decaying cosine squash ~22 %; nervous jitter 3–6 px random offset at 12 fps (styles/scifi-toon/STYLE.md)
- Rule of three → machine-gun montage: two slow 6–8 s beats, then 1 s beats on the cut with the same rejection word (styles/scifi-toon/DEMO.md)
- Same-framing montage: repeat one composition across worlds/versions so only palette changes (styles/scifi-toon/STYLE.md)
- Silence as punchline: hard-cut music and its reverb tails, leave only room tone (fluorescent hum, clock tick) for 2+ s (styles/scifi-toon/DEMO.md)
- Theremin lead recipe: sine + a little 2nd/3rd harmonic, ~70 ms legato portamento, vibrato fading in ~150 ms after onset, spring reverb (styles/scifi-toon/STYLE.md)
- Voice casting by measurement: generate test lines, compare median f0 / pitch variance; deadpan voice speed 0.82–0.9 + 180 Hz bump, nervous voice 1.1–1.15 + presence boost (styles/scifi-toon/DEMO.md)
- Off-register print look: fill offset (6, 4) px down-right from its line, re-rolled ±1.6 px at 12 fps, on everything incl. text; drop shadow = shape copy offset (12, 12) in paper shade at 50 % (styles/midcentury-toon/DEMO.md)
- Breathing broken ink line: 3–5 px ribbons, ±40 % width breathing, 12–25 % breaks (styles/midcentury-toon/STYLE.md)
- Medallion iris transition: a numbered medallion stamps on the outgoing subject, then a circle grows from it to full frame in 0.9 beat into the next step (styles/midcentury-toon/DEMO.md)
- Round call-out: frame-in-frame circle with a dashed leader line as the close-up, drawn at native scale so line weight stays constant; data lands inside it on the action beat (styles/midcentury-toon/STYLE.md)
- Hand-action recipe: anticipation 20–60 px → action 0.15–0.25 s ease-out → recoil 6–10 px → settle, landing on a beat; pop-ins back-ease 0.24–0.3 s overshoot 1.9 (styles/midcentury-toon/DEMO.md)
- How-to timeline grammar: hook 4 bars, each step ≥ 3 bars, payoff 3, tip 2, lockup 3, end 2 at 132 BPM (3 steps = 40 s); lockup held dead still ≥ 3 s as the screenshot frame (styles/midcentury-toon/DEMO.md)
- Function-as-ornament payoff: draw a real route region by region (potential-flow streamlines around obstacles) while pulling back 5.4× → 1.0× with −6° → 0° counter-rotation (styles/midcentury-toon/DEMO.md)
- Caption card: paper rounded slab, thin ink border, coral 8-point stars at the ends, Jost 500 42 px, 60 px above bottom, 0.16 s fade with 10 px rise; hold ≥ max(1.8 s, speech + 0.6 s, chars/12 + 1 s) (styles/midcentury-toon/DEMO.md)
- Per-step chord: each step lands on its own vibraphone chord, recalled one per medallion in the summary; double-time for the payoff, half-time for the tip (styles/midcentury-toon/DEMO.md)
- Planned silence before the key action: cut everything incl. ambience for one beat so the first sound after it (click, pour) is the step (styles/midcentury-toon/STYLE.md)

### Lemo: Pixel RPG, HD-2D, Microgame, Game Show
- Indexed framebuffer + palette LUT: draw indices into a Uint8Array, present through index→RGB table so a whole palette (era, fade, night) swaps in one frame (styles/pixel-rpg/STYLE.md)
- Palette collapse as grief: drop colour depth one level per beat (16-bit → 16-col → 8-col → 4 grey-blues → 2 tones → faded), music loses one layer per step, one beat of true silence at the bottom (styles/pixel-rpg/DEMO.md)
- Protected-colour match cut: duplicate 1–2 palette indices exempt from every effect; place the object at the same screen position (demo (197,104)) in two eras (styles/pixel-rpg/DEMO.md)
- Mosaic transitions: thumbnail expand block 10→1 over 0.75 s; mosaic cross 1→16→1 over 0.8 s with palette switch at the peak (styles/pixel-rpg/DEMO.md)
- Encounter swirl: polar twist growing with s^1.6 + mosaic + Bayer dissolve to white, 0.8 s (styles/pixel-rpg/DEMO.md)
- Screen shake recipe: 3–2–1 px over 8 frames, integer pixels (styles/pixel-rpg/DEMO.md)
- Dialog-box captions: typed at 38–40 chars/s, ▼ blinks at 3 Hz when done, text blips pitched per speaker, next box hard-cuts the previous (styles/pixel-rpg/DEMO.md)
- Hesitation cue: a menu hand cursor bobbing 1 px at 4 fps stops bobbing while the character hesitates (styles/pixel-rpg/STYLE.md)
- SNES-style echo for chip music: 3 taps ~180/270/370 ms, feedback 0.35–0.45, low-pass ~3 kHz in the loop; "present" = same music low-passed at 2.2 kHz (styles/pixel-rpg/DEMO.md)
- Audio fidelity follows image fidelity: 4-colour era = mono, 4-bit volume, 11 kHz sample-and-hold; one un-crushed organic sound (a breath) to make a sprite human (styles/pixel-rpg/DEMO.md)
- Tilt-shift folded into DOF: one signed circle of confusion (above band = far, below = near), band half-width .075, feather .3 of screen height, band follows the subject's projected height clamped .2–.8 (styles/hd-2d/DEMO.md)
- "Light level as one value": a single 0–1 level drives the flame drawing, point-light intensity (∝ level^1.3), glow opacity and scale together; flicker = 3 summed sines ±20 % (styles/hd-2d/DEMO.md)
- Lightning flash curve: 150 ms strike, dip, 60 ms re-strike, exp decay, lifting sky + fill + exposure; thunder 0.25 s later (styles/hd-2d/DEMO.md)
- Lights popping on one by one at a steady cadence (demo one every 0.7 s) with a small bell each: users joining, a village electrified (styles/hd-2d/DEMO.md)
- RPG dialogue box for on-screen speech: 1180×210 navy plate, 2 px gold border, diamond corners, name plate on the top-left edge, text typed over 92 % of the voice, ▼ caret, slides up 14 px, chime (styles/hd-2d/DEMO.md)
- Storybook subtitle: italic serif 50 px centred at H−88 on a dark gradient band (max .38 alpha), in 0.35 s before the voice, out 0.45–0.8 s after (styles/hd-2d/DEMO.md)
- Billboard sprite lighting fixes: cool front fill ~2 m before the hero; carried light offset 0.45 m toward camera; cap sprite light at diffuse×1.35+emissive (styles/hd-2d/DEMO.md)
- Edit one licensed music piece inside itself at downbeats; auto-locate a key-change downbeat by the steepest <250 Hz onset and place it on the visual climax (<5 ms error) (styles/hd-2d/DEMO.md)
- Per-line auto-duck: music + ambience pulled to ≈10 dB under each voice line, only down never up; in-world characters low-passed at 7 kHz (styles/hd-2d/DEMO.md)
- Readability fill: lift environment mid-tones ×2–2.5 in dark scenes except the one beat that must go dark (styles/hd-2d/STYLE.md)
- Command-word slam caption: heavy display face, white + thick ink outline + coloured drop + burst, skewed −6°, scale 1.9 → 0.92 → 1.0 over 3 frames, then shrinks to a corner tag before the action (styles/microgame/DEMO.md)
- Speed ladder: step tempo, segment length, dwell, caption hold and character frame rate up together (demo 120→140→160 BPM; 4.0→2.57 s; 8→12→24 fps) (styles/microgame/DEMO.md)
- Beat-locked fuse timer: a rope with one knot per beat, the spark crossing each knot exactly on the beat; freezes in replays (styles/microgame/DEMO.md)
- Frame-within-the-frame transition: push into the on-stage screen 0.25 s to enter, shrink the whole frame back in 0.33 s with a ✓/✗ stamp to exit, no fades (styles/microgame/DEMO.md)
- Slot-reel speed-up: split the frame into three spinning strips of earlier frames with motion smear, stopping one per beat on SPEED | UP | ! (styles/microgame/DEMO.md)
- Instant replay: freeze 3 frames, 0.5× playback, 1.4× push-in, letterbox, caption; record scratch + half-time; costs 2 beats (styles/microgame/DEMO.md)
- Tile-flip recap: last frames of past segments flip in on eighth notes, then flip again into pieces of the finale frame (styles/microgame/DEMO.md)
- Hard toon shadow trick: fill shape in the shade colour, clip to it, refill shifted up-left by 9 px (styles/microgame/DEMO.md)
- Hero translation rule: three silhouette marks that survive every medium; make a model sheet in every medium first (styles/microgame/STYLE.md)
- TTS single-word fix: generate a two-word phrase ("Pump, now!") and cut after the first word from ASR timestamps; shout the command 0.1 s after the brass stab (styles/microgame/DEMO.md)
- Beat punch camera: zoom 0.8–5 % around centre decaying in ~0.16 s (0.008 ticks, 0.02 hits, 0.03–0.05 slams); keep simultaneous punches summed < 0.06 (styles/game-show/STYLE.md, DEMO.md)
- Outlined telop caption: white/yellow fill, ink stroke ≈ 14 % of font size painted under the fill (paint-order: stroke); ≤ 20 CJK / ≤ 12 per plate; Latin ~1.6× wider (styles/game-show/STYLE.md)
- Judgement word: 120 px rounded sans, pink/yellow with 18 px ink stroke, pops at −6° on the round's last hit (bar 7 beat 3) with a burst (8-point star + white ring + 8 speed lines, 0.3 s) (styles/game-show/DEMO.md)
- Back-ease pop: 1 + (c+1)(p−1)^3 + c(p−1)^2 with c = 1.9 over 0.35 s; per-glyph title pop stagger 0.05–0.06 s, 0.38 s each, rising 60 px (styles/game-show/demo/frame_head.html)
- Beat hop + squash: parabola per beat 8–30 px with off-beat neighbours; hit wobble ~30 rad/s for 0.35 s; downbeat squash 1 − 0.1·exp(−16·frac(t)) (styles/game-show/DEMO.md)
- Round structure: 1-bar card on a jingle (crash + kick + rising brass arpeggio + snare roll) + 8 bars of play, hard cut + 0.08 s white flash on the card bar (styles/game-show/DEMO.md)
- Remix board / recap: one set, a month ribbon on top, each item 2 bars centre stage then shrinks ×0.27 into a bottom slot; all slots bounce together at the climax (styles/game-show/DEMO.md)
- Score from picture events: export every visual event (474 in demo) and map names to synthesized SFX so sound can never drift from picture (styles/game-show/DEMO.md)
- Crowd shout: 6 different voices stacked 5–6 ms apart, panned −0.6…+0.6; shouts placed 20–30 ms before the beat so the consonant lands on it (styles/game-show/DEMO.md)
- Bus ducking: music ducked up to 40 % from a 12 Hz envelope of the voice+SFX bus, tanh soft-clip instead of hard limiting (styles/game-show/DEMO.md)

### Lemo: Silent Film, Liminal Found Footage, Brick Toy, Paper Pop-up
- Hand-cranked sampling: sample character/camera motion at 16 fps (18 for undercranked chases) while film damage changes every 24 fps output frame; reads "projected", not "low frame rate" (styles/silent-film/STYLE.md §5)
- Film print pass recipe: 0.7 px print softness, halation above L 0.55, flicker ±4.5 % noise + 2.5 % + 2 % sines, weave ~±1.4/±1.6 px × strength, 2.5 % perforation jumps of 4 px, ≤ 4 broken scratches (white +0.7 / dark −0.55), edge burn, 62 % vignette, 2-octave mid-weighted grain, print black 0.055 / white 0.93 (styles/silent-film/demo/engine/film.js)
- Damage as a mood control: raise strength and drop sepia when things go wrong (0.85 / 0.10), lower strength and warm the print when tender (0.3 / 0.36), set per section (styles/silent-film/demo/film.js)
- Redraw pass: XDoG ink contours + 5 posterised wash steps + 45°/crossed hatching re-drawn every 2 frames turns any frame or real footage into an engraved drawing (styles/silent-film/demo/engine/redraw.js)
- The one colour through a monochrome print: draw one element into a separate colour mask so it keeps its hue but still gets grain, flicker and vignette (styles/silent-film/DEMO.md "Engine reference")
- Intertitle cards whose border ornament follows emotion: heavy single rule + shaking text for a shout, double rule with fans for narration, vines for tenderness; hold 2.5–3.75 s (styles/silent-film/DEMO.md)
- Iris close with a held stop: close in 2 beats to r 190 px, hold 1.3 beats for a wink at the audience, shut in 0.6 beat; the iris is printed with the frame so it ages too (styles/silent-film/demo/film.js)
- Chain gag in one locked-off wide: A triggers B, B leaves frame, 2.5 s of waiting, B returns and hits C; the wait is the joke (styles/silent-film/DEMO.md "Shots")
- Piano as the sound design (mickey-mousing menu): chromatic bass creep = sneaking, grace note = wink, forearm cluster = crash, diminished tremolo = wait, descending gliss = fall, minor second = something breaking; projector purr as the only ambience in silences (styles/silent-film/STYLE.md §7)
- Theatre frame: a 4:3 gate in a 16:9 canvas with velvet drapes lit by the screen's mean brightness; curtains part/close over 1.1 s; add footlights so closed velvet isn't pure black (styles/silent-film/demo/film.js)
- Handheld POV rig: 0.72 m stride, 3 cm head bob, 1.8 cm sway, ±0.8° roll, 0.27 Hz breathing, tremor at 1/3.5/9 Hz scaled by a "fear" curve; freeze everything for a held breath (styles/backrooms/DEMO.md "Shots")
- Autofocus hunt as a reveal: animate DOF focus distance with overshoot (blur → lock → slip → lock), the subject only "exists" in ~0.5 s of correct focus; zoom FOV 52° → 27° with aperture ×5 (styles/backrooms/DEMO.md)
- VHS camcorder pass: line jitter ≤ 0.25 px, head-switch band on bottom 8 lines, barrel 0.07, vignette 0.42 (not on OSD), luma blur σ 1.25 px + ringing 0.9, chroma ±10 px smear shifted 1.6 px right, AGC noise 0.03, 0–2 dropouts/frame, black lift 0.045, noise stepped at 30 fps (styles/backrooms/DEMO.md, demo/vhs.js)
- Tracking tear as a cut: tear, then the identical framing with only the OSD clock/battery changed = "time removed" (styles/backrooms/STYLE.md §8)
- CEA-608 closed-caption style: monospace 600 at 42 px, white on per-row black boxes, ≤ 32 chars, `[PA]` prefixes and bracketed SDH like `[SILENCE]` (styles/backrooms/DEMO.md "Titles & subtitles")
- Thousands-of-lights-without-shadows: panel intensities in a float texture, each fragment sums nearest 5×5 emitters / (d² + 0.3); fog colour × local light so dead zones read as holes in the light; background = fog × 0.15 (styles/backrooms/DEMO.md "Palette & props")
- Light flicker + lagging auto-exposure: three 0.1 s blackouts, AE recovers over ~0.45 s with pumping gain noise; ballast "tink" + arc buzz on each (styles/backrooms/DEMO.md)
- Fluorescent hum bed: 120 Hz + harmonics (1, .55, .42, .22, .16, .06), buzzy band-passed square, ~9 kHz ballast whine, gated by the picture's light curve (styles/backrooms/DEMO.md "Score structure")
- Ceiling-speaker PA voice: band-pass ~310–3500 Hz, cone resonance ~1.3 kHz, tanh saturation, light room reverb; ASR-check after processing (styles/backrooms/DEMO.md)
- One second of digital zero (tails included) as the climax, captioned `[SILENCE]` (styles/backrooms/STYLE.md §7)
- Mixed stepping: characters/objects on twos (12 fps) while camera, focus and fast vehicles stay on ones (24 fps); stepping the camera reads as judder (styles/brick-toy/STYLE.md §5)
- Snap-in recipe: piece flies in on an arc, overshoots 0.35 unit → 0 in ~0.17 s (4 frames), with a click SFX (short transient + resonances ~2.9 kHz and 4.6 kHz) (styles/brick-toy/DEMO.md, STYLE.md §7)
- Toy-scale rigid-body collapse: gravity ~1/3 of true (420 vs 1225 studs/s²), restitution 0.3, pre-simulated for determinism (styles/brick-toy/DEMO.md)
- Toy-photography lighting: warm directional key + 2–3 rect-area softboxes (key front, cool rim behind) + low studio HDRI (0.45) for clean rectangular highlights on gloss; AO mandatory (styles/brick-toy/demo/set.js)
- Aperture scaled to shot size: widest for macro/close-ups, less for mediums, least for wides, focus always on a head or the piece being placed (styles/brick-toy/STYLE.md §2)
- Toy-element subtitle: dark rounded pill rgba(18,20,26,.62) 150 px above bottom, rounded font 600 at 46 px, small coloured icon left; second speaker = different icon colour + tag (styles/brick-toy/DEMO.md)
- Device/radio voice filter: band-pass 380–2800 Hz + soft saturation, optional Quindar beeps (styles/brick-toy/DEMO.md)
- Lens-covering transition: a hand-placed piece covers the lens, or a whip along the desk, or a pull out of one set into the next (styles/brick-toy/STYLE.md §6)
- Scale reveal ending: slow pull-back to a high wide of the whole table showing it was a toy all along (styles/brick-toy/STYLE.md §6, §8)
- Music edited to picture with bar-aligned jumps and chroma similarity at joins so the climax lands on the hit and the last chord on the end card (styles/brick-toy/DEMO.md "Score structure")
- Cut-paper sticker finish: dilate the art's silhouette (16+ angles on 3 rings) into a grey card edge (`#b9ad9c`, offset 1.5 px down) and a 12–16 px off-white border (`#fffdf7`), then paper grain at alpha 0.5–0.85 (styles/paper-popup/DEMO.md "Palette & props")
- Crescent shading: fill a shape with its shade colour, refill shifted with the base colour, leaving one hard crescent; dark-brown ink, never black (styles/paper-popup/STYLE.md §2)
- Pop-up back-to-front: each piece `back(seg(t, t0, t0+0.55), 1.7)` with delay (0.3 − z) × 1.2 s; far pieces lie back, near fold forward; fold down in the same order (styles/paper-popup/DEMO.md "Motion numbers")
- Easing kit: back(t,s)=1+u²((s+1)u+s), spring(t,k=7,z=0.35)=1−e^(−zkt)·cos(k√(1−z²)·1.6t), cubic eio/eo/ei, monotone-cubic `track` keyframes for cameras (styles/paper-popup/demo/lib.js)
- Flat-card turn: animate `scale.x` through 0 between front and back drawings instead of rotating (a rotated card shows its edge and blank back) (styles/paper-popup/STYLE.md §5, §9)
- Walk phase from distance: advance the walk cycle 1.8 cm per half step so feet never slide; bounce |sin(phase)| × 1.2 mm (styles/paper-popup/DEMO.md)
- Page-turn curl: 40-segment strip, φ = θ·(1 − L·(s − ½)), L = 0.55·sin(πu), eased over 2.3 s; front shows old ground, back new sky (styles/paper-popup/DEMO.md)
- Typed speech bubble: white card r 44, 6 px ink outline, tail re-projected to the speaker each frame, pop-in with back(), 30 chars/s, a blip every second letter with one waveform/pitch per character (square bright for hero, low 180–240 Hz for grump, triangle for companion) (styles/paper-popup/DEMO.md)
- Reverse shot out of the world: once only, camera behind the hero looking past the page edge at the huge blurred real room (fov 56) (styles/paper-popup/DEMO.md "Shots")
- Voice-first mix: voice HP 90 Hz, compressed −24 dB 3:1, 8.5 dB above music, music ducked 40 % with 300 ms smoothing, 7 % reverb, loudnorm I −14 TP −1.2 LRA 11 (styles/paper-popup/DEMO.md "Score structure")
- DOF that doesn't bleed: 64-tap golden-angle gather, far samples' spread capped at the centre pixel's CoC so the background can't smear over a sharp foreground (styles/paper-popup/demo/post.js)

### Lemo: Tilt-Shift, Low-poly Island, Glass Product, Memphis Diorama, Desktop Flythrough
- Time-lapse stutter tied to tempo: world updates at 8 Hz (3 frames at 24 fps = a 16th at 120 BPM), 12 Hz between ×2–×6, smooth below ×2; camera always smooth (styles/tilt-shift/DEMO.md)
- Speed drop ×40 → ×1 inside one continuous camera dive, landing on the narrowest focus band; audio tape-stop varispeed 1 → 0.22 into true silence (styles/tilt-shift/DEMO.md)
- Screen-space tilt-shift band mixed with physical CoC: half-width 0.055 (0.035 for intimacy), amp 30, mix 0.55–0.7, clamp 30 px, 128 spiral taps, band projected onto the moving subject each frame (styles/tilt-shift/STYLE.md §2, DEMO.md)
- Speedometer HUD: monospace clock top-left with `×24 TIME-LAPSE` in amber `#ffc233` / `×1 REAL TIME` in green `#3dff8a` whenever speed changes carry meaning (styles/tilt-shift/DEMO.md)
- In-world caption panel: subtitles as a road-sign plate (`#0f5e3c`, inset white keyline, Overpass 600 44 px, traffic-light icon) sitting inside the lower blur band (styles/tilt-shift/DEMO.md)
- Event-gated score: a fixed phrase skeleton where world events (cars crossing a line, lights turning green, crowds) decide which notes sound, plus a base fill rate (styles/tilt-shift/STYLE.md §7)
- Logarithmic vertical rise (40 m → 820 m) through a thin unlit low-opacity cloud layer until the place becomes a pattern, as a scale-reveal ending (styles/tilt-shift/DEMO.md)
- Cheat the sun azimuth per shot so visible facades are front-lit; treat each clip as its own lighting set-up (styles/tilt-shift/STYLE.md §2)
- Top-down → oblique dive: pre-rotate the top-down so its screen-up matches the target shot, or the dive twists 180° (styles/tilt-shift/STYLE.md §9)
- Dive eye-line: the look target eases out faster than the camera position, so the eye lands on the subject before the body arrives (styles/tilt-shift/DEMO.md)
- Rise-from-below arrival: 0.5 s cubic ease, overshoot sin(13s)·e^(−7s)·0.18, splash ring + 14 droplets 0.12 s before settle; event time = settle (styles/lowpoly-island/DEMO.md)
- Drop-and-stack arrival: fall 2.4 units in 0.22 s ease-in, bounce |sin(15s)|·e^(−9s)·0.22, Y squash 1 − 0.16·e^(−12s)·cos(26s), volume preserved (styles/lowpoly-island/DEMO.md)
- Pop-in for small details: scale 1 − e^(−9s)·cos(17s), about 25 % overshoot (styles/lowpoly-island/DEMO.md)
- "Building is composing": every arriving piece exports a MIDI note in the event list and the score synthesises it at that exact time; at most one piece per 16th slot; accelerate by density halves → quarters → eighths (styles/lowpoly-island/STYLE.md §5, §8)
- Spatial replay: a sweeping beam (one turn per 12 beats over 12 cells at 30°) lights the pieces in spatial order and replays the shuffled build notes as the finished theme (styles/lowpoly-island/DEMO.md)
- Title letters rising from under a water line 55 ms apart, Josefin Sans 600 caps 78 px, 16 px tracking (styles/lowpoly-island/DEMO.md)
- Boxless subtitle with a time-of-day-coloured icon beside it (Quicksand 600 44 px, navy shadow blur 14, 118 px from bottom) (styles/lowpoly-island/DEMO.md)
- Horizonless sky: blend linearised depth into a vertical screen gradient so the sky band stays in the top third at any orthographic zoom (styles/lowpoly-island/STYLE.md §2)
- Silence trick: digital zero on the music bus for the last half-beat before a big downbeat (styles/lowpoly-island/DEMO.md)
- Light beam that reads: camera-facing Gaussian ribbon plus a 2.4× wider halo at 0.32 strength instead of an additive cone (styles/lowpoly-island/STYLE.md §2, DEMO.md)
- Exploded-view-and-snap: 3 s ease-out apart → 0.75 s hover drifting +3 % → 0.25 s ease-in snap on the downbeat, camera pushes in ~40 % over the next 0.9 s, 2 frames of micro-shake (styles/glass-product/DEMO.md)
- Strip-light studio instead of an HDRI: emissive planes (two tall back strips, horizon strip, top box, sweep strip on an arc behind the camera at azimuth camera + π) baked to an env map every frame (styles/glass-product/STYLE.md §2, DEMO.md)
- Frosted-glass subtitle slab: rounded bar 76 px tall, radius 38, live frame blurred 18 px at brightness 1.25 + 10 % cool white, 1.2 px gradient stroke, accent line on top (styles/glass-product/DEMO.md)
- Ultra-thin launch titles: weight 200, 112–132 px, tracking 56–64 px, upper third, with a glint synced to the light sweep on the object; kickers 18–20 px caps tracked 8–10 px (styles/glass-product/DEMO.md)
- Comet light pulse shader: Gaussian head σ = w/2, exponential tail 4w at 55 %, white-hot core head³ × 0.35, hue drifting with age, idle emission 0; pulses follow the bass pattern (styles/glass-product/DEMO.md)
- Bookend: open with a light sweep revealing a dark object, end with the same sweep over the object now glowing by itself (styles/glass-product/DEMO.md)
- Pre-drop silence: half a bar of total silence with reverb tails cut, a reverse whoosh inside, then the drop (styles/glass-product/DEMO.md)
- Snap sound: a cluster of six clicks 15 ms apart plus an inharmonic glass chord (partials ×2.76, ×5.4); magnetic click = sub-2 ms transient + 3–5 kHz resonances + low thump (styles/glass-product/STYLE.md §7, DEMO.md)
- Mix for bass-heavy launch music: duck music −12 dB and foley −6 dB under voice; limit 808 peaks ~3 dB so two-pass loudnorm stays linear (styles/glass-product/DEMO.md)
- Voice rule: never a product name alone as a line (ASR and viewers mishear it): give it a verb, "Meet Aura." (styles/glass-product/STYLE.md §7)
- Squash-and-spring cause marker: one landmark squats ~0.5 s and springs back, then a colour/state wave spreads from it; always the same sound (low thump at T − 0.42 s, rising "boing" at T, ten-note harp run, quiet whoosh) (styles/memphis-diorama/DEMO.md)
- Ring wave state swap: per-pixel colour swap inside a growing radius (e.g. 12 m/s), objects act when the ring reaches their distance; works for seasons, night/day by area, coverage maps (styles/memphis-diorama/STYLE.md §8, §10)
- Grainy organic frame on paper: rounded frame (radius 34) with fbm-displaced edge (±22 px + ±5.5 px) and grain reseeded every 5 frames (12 fps boil), grows open from the centre to start and draws in to end (styles/memphis-diorama/demo/memphis.js)
- Three-line bottom type under the frame: title 600 25 px / sentence 400 18 px grey / data mono 15 px light grey, three marks (dot, triangle, zigzag) above; empty lines keep their place (styles/memphis-diorama/STYLE.md §4)
- Halftone shade: staggered world-space dot grid inside shadows so dark areas read as print texture, not dirt (styles/memphis-diorama/STYLE.md §2)
- Night as luminance shift toward violet (not darkening) so yellows don't go olive; all lights one warm yellow `#FFD36E`; lamp = flat colour + hard-edged ground pool (styles/memphis-diorama/STYLE.md §3)
- Long-take camera that eases to 0.3× speed after 18 s so the subject doesn't drift out of frame (styles/memphis-diorama/DEMO.md)
- Two-step cutaway: near part as its own group, lid lifts then slides back (or wall sinks straight down), cut faces hatched one step darker, hide the group once away (styles/memphis-diorama/STYLE.md §8, DEMO.md)
- One-piece score across state changes: same harmony and tempo, change only accompaniment thickness; tuned foley (light coming on) uses notes of the current chord/pentatonic (styles/memphis-diorama/STYLE.md §7)
- Bar-locked state changes: put bar 0's downbeat at 1.8 s so squats land on bar downbeats every 10 s at 96 BPM (styles/memphis-diorama/DEMO.md)
- Hop recipe: arc with ~14 % stretch in the air, ~30 % squash for 0.2 s on landing, small anticipation squash before take-off; followers each a 16th behind the leader (styles/desktop-flythrough/STYLE.md §5)
- Sticker pop: a flat sprite on a surface hinges up with overshoot and extrudes into a voxel toy in 0.25–0.5 s on a 16th; reverse pop when the item is stored or delivered (styles/desktop-flythrough/STYLE.md §5, §8)
- Card-to-card whip: 0.3–0.5 s, banking into the turn, arcing up mid-way so intermediate stops stay in frame; the camera target rests at the whip's start key (styles/desktop-flythrough/STYLE.md §6)
- Read angle rule: flat printed text reads only from 55–70° down; at low angles put words on a standing tent card (styles/desktop-flythrough/STYLE.md §4, §9)
- Bilingual subtitle bar: rounded ink box ~72 % opacity, ~64 px above the bottom, spoken line bold ~40 px over translation ~26 px, one cue per spoken line; subject kept ~110 px above centre so nothing hides under it (styles/desktop-flythrough/STYLE.md §4)
- Speed-capped shutter: 16–24 Halton-jittered sub-frames per frame, shutter shrinking with camera speed so streaks stay ≤ ~8 px; DOF only behind a focus plane set just beyond the subject, ≤ 5 px (styles/desktop-flythrough/STYLE.md §2, §9)
- Curtain-call ending: pull back until every station and the route are in frame, each stop hops once left to right, characters pop back up, the title card drops into open space and bounces (styles/desktop-flythrough/STYLE.md §8, DEMO.md)
- "Blurry, then sharp": a picture printed blurred on a screen snaps sharp the moment the character lands in it (loading, focus, draft → final) (styles/desktop-flythrough/STYLE.md §8)
- Whoosh sized by measured camera speed; pitched foley (pops, dings) taken from the score's chord table, all on the 16th grid; music ducked ~16 dB under voice (styles/desktop-flythrough/STYLE.md §7, DEMO.md)
- Minimum on-screen character size check: width_px ≈ width × 1080 / (2 · dist · tan(fov/2)) ≥ ~35 px in the closing wide (styles/desktop-flythrough/STYLE.md §9)

### OPUSCAR 98, No. 1–49
- One-colour hero rule: grade the whole frame neutral and let only the protagonist keep colour (Lemo's orange `#D97757`, ~70 % saturation in B&W looks); every lamp, fire and light source stays grey/white so nothing competes (styleboard/opuscar98_styles.json No. 1, 5, 9, 16, 21)
- Tinted ortho print recipe: high contrast, reds to black, whites blended half-way to amber `#FFCC80`, deep blacks 25–35 % of frame; 24 fps gate weave ±1 px, flicker ±5 %, grain ±4 %, 1–3 thin scratches, rounded gate corners, 1 s iris open (styleboard/opuscar98_styles.json No. 1)
- White-out transition: push through cloud, smoke or glare until the frame goes to the next shot's paper/cream colour, so the next film/scene opens out of that tone (styleboard/opuscar98_styles.json No. 1, 2)
- Albumen photo pass: greyscale, blur ~1/800 of frame width, three horizontal offset copies whose smear grows with camera speed, multiply cream `#F2DCB4`, blacks lifted to umber `#2E1C0F`, vignette to `#785634`, blotchy development ±5 %, grain ±4 % (styleboard/opuscar98_styles.json No. 4)
- Hand-tint mask: hero dye as transparent colour at 60–80 % opacity, mask feathered 2–3 px and brushed loosely past edges; dyes die in shadow (styleboard/opuscar98_styles.json No. 4, 47)
- Letterpress print pass for any type: set text as a sharp mask, then ~1 px blur + noisy threshold for ink spread, ragged edges, under-inked patches and faint mirrored show-through; type blocks slam, bounce and leave their print (styleboard/opuscar98_styles.json No. 10, 22)
- Misregistration budget by medium: litho 1–3 px, letterpress 2–4 px, Riso 2–4 px, accent plate 1–2 px, UPA colour offset ~1/300 of frame width all one way, Warhol blocks ~1/100 of frame width (styleboard/opuscar98_styles.json No. 10, 15, 22, 29, 40, 42)
- Split-fountain sky: two inks blended in 2–3 coarse steps, the middle step their overprint, instead of a smooth gradient (styleboard/opuscar98_styles.json No. 11)
- Typewriter-art ladder: monospaced cells 1/150 of frame width × twice as tall; light `. : -`, mid `= + o`, dark `X # M`, darks as overstrikes `M#`; 85–95 % of cells struck; picture types itself within 1 s then holds (styleboard/opuscar98_styles.json No. 18)
- Draw-then-hold build: construction lines → contours → hatching passes → rubbed tone within the first 1–1.5 s, then hold the finished frame (also white-line title grid filling to greys by 2–3 s, then a 3 s hold) (styleboard/opuscar98_styles.json No. 20, 23, 33)
- Magazine-spread reveal: render the scene as a deep-focus grey photo, print it as 45° halftone (pitch ~1/250 of frame width) across a gutter crease, then pull back to reveal an open magazine on a desk (styleboard/opuscar98_styles.json No. 19)
- TV-in-room push-through: hold ~2 s with a bulging CRT (≈330 scanlines, rolling hum bar, ghosting, lifted blacks) filling 60 % of a warm lamp-lit room, then push through the glass over 4–5 s until the broadcast fills the frame (styleboard/opuscar98_styles.json No. 28)
- Match-cut chain between scenes: struck match pushed to frame centre → rising sun at frame centre; hat clapped over the lens to black → next scene opens from black under a hat brim; frame closing into two binocular circles → next scene opens inside them; red-cream stripes graphic match (styleboard/opuscar98_styles.json No. 34, 35, 36, 37, 38, 43)
- Toy-theatre footlight shadow: each flat card cut-out (white scissor margin 1/200 of frame width) throws a soft flickering shadow ~1.5× enlarged onto the flat behind (styleboard/opuscar98_styles.json No. 41)
- Rising climax orbit: low Steadicam follow from behind up an ascent, then one continuous orbit that circles, rises and pulls back over 6–8 s until the place spreads out below (styleboard/opuscar98_styles.json No. 49)
- Low orbit in grass: subject ~1/4 of frame height, camera orbiting ~20°/s, after a 0–2 s high flight and 2–4 s descent, with cuts landing mid-turn of one continuous spin (styleboard/opuscar98_styles.json No. 38)
- Rush lens: low 18–25 mm lens rushing forward as repeated objects (columns, posts) strobe past; pushed-16mm grain clumps ~1/700 of frame width ±8 % (styleboard/opuscar98_styles.json No. 44)
- Stillness then one event: hold a still frame, then a single sudden event under one second (whip pan, burst of light); blurred whip pans replacing cuts (styleboard/opuscar98_styles.json No. 48)
- Glamour-still face light: short key with a Rembrandt triangle on the near cheek, two catchlights per eye, slatted diagonal shadows, light shafts only in smoke or fog, diffusion glow + S-curve + grain ±3 % (styleboard/opuscar98_styles.json No. 16)

### OPUSCAR 98, No. 50–98
- Petal-blizzard hidden cut: curled petals/leaves about 1/60 of frame width thicken into a 1 s blizzard across the lens to hide a register change (styleboard/opuscar98_styles.json No. 72)
- Push-through-the-picture transition: push into a taped painting / postcard / album photo until its edges slide out, then it "comes alive" (colour returns, water moves), replacing a cut; album version takes about 3 s (styleboard/opuscar98_styles.json No. 56, 69, 91)
- Page-turn instead of cut: in one continuous move, dive into a spread, pull back, turn the page, push into the next; demo turns at about 2.7 s and 4.2 s of a 5 s shot (styleboard/opuscar98_styles.json No. 67)
- Fiche-transport transition: slide the whole frame sideways past a dark gap in 0.5 s instead of a hard cut (styleboard/opuscar98_styles.json No. 88)
- Blueprint-to-3D develop: 1–2 s of white edge lines on Prussian blue (`#12306B`–`#244D8F`), a dolly-zoom stands the elevation up, colour spreads from the hero along a soft warm edge, ghost lines fade within 1 s (styleboard/opuscar98_styles.json No. 70)
- Developing-plate reveal: image develops from blank mirror-grey, shadows first, a front sweeping left to right, done by about 3 s, while the camera pushes in for about 1 s then holds (styleboard/opuscar98_styles.json No. 86)
- Selective colour on greyscale: S-curve blacks near `#111`, whites near `#EEE`, grain re-rolled every frame ±6 %; only the hero (e.g. `#D97757`) and at most one story object keep colour; lamps stay grey unless a flame turning warm is the beat (styleboard/opuscar98_styles.json No. 66, 84, 88)
- Universe-jump transition: push into a sticker on the subject (about 1/10 of frame height), smear, RGB split, then a five-colour segmented ring blooms to about 80 % of frame height and bursts to white; 0.5–0.8 s (styleboard/opuscar98_styles.json No. 95)
- Fighting-game hit-stop: freeze 3–4 frames and flash white on each hit; draw at 320×180, nearest-neighbour ×6 for 1080p, scanlines every other line about 15 % darker (styleboard/opuscar98_styles.json No. 77)
- Counting callouts overlay: thin cyan `#56E6FF` leaders, dashed rings and dimension lines with near-white `#D9FBFF` monospace numbers (1/40 of frame height) counting up as each group is circled (styleboard/opuscar98_styles.json No. 61)
- Gold sound-wave lines: 4–8 thin gold oscilloscope lines crossing the background, spiky for struggle then smoothing out as speech becomes fluent (styleboard/opuscar98_styles.json No. 83)
- Gold pattern connect: handwritten symbols brighten and soft gold `#D9B45A` lines join them into a star/polygon with lights running along the lines (styleboard/opuscar98_styles.json No. 74)
- Section-axonometric crane: dimetric cut at 7°/42° (depth at half scale), 1 px dark-grey lines, camera cranes vertically through slabs along one path, ending on the whole drawing at about 80 % of the frame (styleboard/opuscar98_styles.json No. 92)
- Extreme telephoto stacking: 2–5° horizontal field of view to stack road dips into waves; heat shimmer grows with distance; grain ±2 % (styleboard/opuscar98_styles.json No. 98)
- Underwater caustics recipe: background `#041414`, hemisphere light `#5fb3a6` / `#0c2a24`, caustic cells about 1/20 of frame width sliding over near surfaces, one large warm practical about 1/10 of frame width, grain ±3 % (styleboard/opuscar98_styles.json No. 90)
- Real neon tube build: glass tube + glow + bright tube + white-hot core + clips + dark jumper wires, rare flicker every 5–10 s, wet-ground vertical reflections in the lower quarter (styleboard/opuscar98_styles.json No. 97)
