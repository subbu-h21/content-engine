# Visual styles in the local guides and kit

Research notes for the style catalog. Values are taken from the sources themselves (the prior summary in
`docs/research/01-pdf-guides-and-kit.md` was used only for orientation). Nothing from the sources was installed or run.
Target engine: Remotion 4.0.535 (2D), Blender 5.1 (3D), default 1080×1920 at 24–30 fps, Google Fonts available.

Sources read:
- `D:\code_files\resources to make content engine\aman thakur's resources\Kinetic Type_ the complete workflow guide.pdf` (25 pp, read whole)
- `D:\code_files\resources to make content engine\aman thakur's resources\Level 5 Workflow Guide.pdf` (12 slides, read whole)
- `D:\code_files\resources to make content engine\aman thakur's resources\Motion as Code - Workflow Guide.pdf` (read whole)
- `...\aman thakur's resources\Claude workflow guide\` (contains `Motion-as-Code-Workflow-Guide.pdf`, a byte-identical copy of the PDF above, and `Motion_as_kit.zip`, already extracted to the scratchpad `motion_kit\Motion_as_kit\`)
- `D:\code_files\resources to make content engine\pdf guides\Claude + Blender_ Make 3D Motion Graphics From Code.pdf` (read whole)

Page numbers are the PDF's own page numbers.

Coverage:
- All four PDFs in the source list opened and were read whole (Kinetic Type 25 pp; Level 5 12 slides; Motion as Code 7 pp; Claude + Blender 7 pp).
- `Claude workflow guide\` holds only `Motion-as-Code-Workflow-Guide.pdf` (byte-identical to the Motion as Code PDF, SHA-256 b6571bb1…) and `Motion_as_kit.zip` (≈107 MB).
- Kit files read: README, LICENSE, palette, post, type, stroke, hud, util, scene, engine, `_vo.ts`, `_motifs.ts`, all nine plates, timeline, package.json, index.html; the relevant parts of render.ts, lines.ts and sfx_mix.py. `app/src/engine/glsl/common.ts` was missing from the earlier extraction and was unzipped on its own into `scratchpad\stylesresearch\local\kit-glsl\`. Nothing was run.
- Not read (binary or bulk data): fonts, SFX mp3s, voiceover, `data/*.json`, the ONNX model. The kit ships no preview images or rendered videos.
- `Five Skills, Five Different Worlds.pdf` sits in the same folder but was not in the source list, so it is not covered (the earlier summary describes it as a link list with no style values).
- Nothing failed to open.

---

## Kinetic Type — red text-in-space over footage
- Source: `Kinetic Type_ the complete workflow guide.pdf` (v1.0, Oct 2026, "Made with Claude Code", no author named). Look described pp. 3, 5–6, 11; recipes and numbers p. 21; colours, type and shot table pp. 21–22; limits p. 24. Licence: the guide itself states none. Fonts Poppins and Six Caps are SIL OFL (p. 9, p. 24). The guide says to use the *technique* on your own footage and words, not the reference creator's footage, branding or script (p. 24). Claude and Adobe logos are trademarks; the guide's versions are look-alike redraws (p. 24).
- One line: bold lowercase words land on the spoken frame *inside* the shot — behind the speaker's head, bent on arcs, orbiting as a halo, drifting in and out of focus — punctuated by full-screen red grid cards.
- Suits: talking-head shorts, creator explainers, "how I made this" reels, tool/product hype. **Needs real footage** of a person (locked-off tripod, plain evenly lit background, subject lower-middle with empty space above and to the sides, p. 8) plus a per-frame cutout (matting) and face track. Not Blender 3D: the depth is CSS 3D in Remotion (three.js was tried and rejected for the final type, p. 13).

### Palette
| role | hex | where used |
|---|---|---|
| White text | #F4F4F4 | main words, connecting words (p. 11, p. 22) |
| Brand red | #B51722 | emphasis words, silhouette fill, wipe blob (p. 11, p. 22) |
| Card centre | #C70808 | red grid card radial gradient centre (p. 6, p. 22) |
| Card mid | #AE0606 | red card gradient mid stop (p. 22) |
| Card edge | #880404 | red card gradient edges (p. 6, p. 22) |
| Grey text | #7D7D7D | small/secondary words, grey "sticker" outline (p. 22; the 'watching' pop uses a grey sticker outline, p. 6) |
| Slam shadow | #5E0006 | hard offset shadow on slam words (p. 22) |
| White card light | #FCFCFC | white grid card gradient (centre, by analogy with red card) (p. 6) |
| White card dark | #B4B4B4 | white grid card gradient edge (p. 6) |
| Soft shadow | black at 28% | under light text (p. 22) |

The reference was analysed as "two colours only": white #F4F4F4 and red #B51722 (p. 11); everything else is card/shadow support.

### Typography
- **Poppins** (Google Font, OFL): Black 900 for every main word; ExtraBold, Bold, SemiBold also loaded (p. 9). Lowercase. Tracking −0.05 em. Stacked words nearly touch: leading about 0.85 (p. 22).
- **Six Caps** (Google Font, OFL) for tall condensed key words (e.g. CLAUDE, AI VIDEO GENERATOR, WANT IT), uppercase in the frames, tracking +0.02 em, thickened with a same-colour outline of about 6–10 px (p. 22). Bebas Neue and Anton were the rejected candidates (p. 9).
- Sizes: no pixel sizes given. Emphasis words are red and 2–3× larger than connecting words (p. 11); emphasis big and red, connecting words small and white (Prompt 4, p. 19). Frame is 1080×1920.
- Emphasis: colour (red), scale (2–3×), condensed face for the biggest beats, slam with hard shadow.
- Text effects: light text soft shadow `0 0.03em 0.09em` at 28% black; "sticker" look = 9 px grey outline painted behind the fill; slam words hard offset shadow #5E0006 at 4.5% of size (p. 21–22).
- Words on screen: one new word per spoken word; a phrase builds up as a stack of 2–5 words, then clears at the cut (frames p. 3, p. 14).

### Layout
- Subject in the lower-middle; words fill the empty space above and to the sides (p. 8).
- Big emphasis words sit at head height **behind the head** (occluded by the cutout); others sit in front of the legs/body (p. 11).
- Four layers bottom→top: plate, words behind, subject cutout, words in front (p. 5, recipe J p. 21).
- Arcs: letter at baseline distance x on radius R gets angle θ = x/R, position (R sin θ, ±R(1 − cos θ)), rotation θ; R > 0 bends like a rainbow, R < 0 like a smile (p. 6).
- Ring: centred on the tracked head, radius 260–285 px, tilted 24° (p. 21).
- Safe zones: none in px. Review rule: nothing off-screen, overlapping, unreadable, or over the face or hands (Prompt 4, p. 19); first draft failures were ring too small, three words off-screen, a word on the legs, a word colliding with a hand (p. 13).
- Density: high — every spoken word appears.

### Elements
- **Red grid card**: full-screen radial gradient #C70808 → #AE0606 → #880404 with a faint 216 px grid (p. 6, p. 22).
- **White grid card**: #FCFCFC → #B4B4B4 with a 120 px grid (p. 6).
- **Silhouette card**: the live cutout filled flat brand red (canvas `source-in`) on the white grid card, still moving (p. 6, p. 14).
- **Text ring / halo** around the head; far half hidden behind the head (p. 6).
- **Motion-graphics UI rebuilt as vector/React**: prompt box that types and gets a red X drawn over it; Claude spark burst + wordmark rise; Claude Code terminal typing, code lines, render bar filling to 100%; After Effects icon spinning in, AE timeline with layers named after the video's words, graph-editor curve bending from linear to ease; "style chips" popping in (p. 14, p. 16, p. 22).
- From the reference but not built (p. 20–21): G counter counting up (e.g. 123,000 hrs) with ease-out on an arc behind the head; H draw-on face-tracking box with corner handles, curved arrow and name label; K word clipped inside the head matte with a difference blend.
- Image treatment: the footage itself, untouched, with digital punch-ins up to 1.6× (p. 8, p. 24).

### Motion
All at 30 fps; springs are Remotion `spring()` damping / stiffness / mass (p. 21). Entrances start on the spoken frame, frame = round(whisperStart × 30) (p. 5–6); one example lands +1 frame late on purpose to match a gesture (p. 6).

| Recipe | Code name | Numbers |
|---|---|---|
| A Arc slide-in | slide | ease-out-expo over 6 f; 280 px travel; ±18° tilt; opacity over 3 f |
| B Phrase fade-on | fade | 4 f; scale 1.08 → 1 |
| (unlettered) Drop | drop | falls 320 px, ease-out-cubic, 4 f |
| C 3D swing-in | swing | spring 13 / 140 / 0.7; rotateY ±80°; rotateZ ±18°; z 700 → 0; x 380 → 0; letter-spacing +0.2 em mid-flight; "like a door opening toward the camera" |
| D Letter pop | pop | spring 10 / 230 / 0.6; 1 f stagger; random order adds vertical jitter 0.35 em settling in 9 f |
| E Elastic stretch | stretch | scaleX 0.15 → 1; spring 8 / 150 / 0.8 |
| F Slam | slam | scale 0 → 1 with overshoot; spring 9 / 190 / 0.8; hard shadow 4.5% of size |
| G Counter | (not built) | count-up with ease-out on an arc |
| H Face box | (not built) | draw-on box with corner handles, arrow, name label |
| I Liquid-ink wipe | RedCard wipe | red blob from top-right; 8–10 f; radius eases up to 3000 px; simplex-noise wobbly edge; 4 droplet circles run ahead (p. 6, p. 21) |
| J Occlusion | back / front stage | plate, back words, cutout, front words |
| K Head-matte clip | (not built) | word clipped inside the head matte, difference blend |
| L Rack focus | blur keyframes | 0 → 9 px blur over about 10 f; near words blur out when focus moves to the face |
| Text ring | Ring | 4–5° per frame rotation; radius 260–285 px; tilt 24°; letters fade in 0.15–0.45 f apart; letters with cos(a) ≥ 0 go to the front stage |

- Camera: constant slow push-in on every shot, factor k 1.0 → 1.16 over the shot; text stages use perspective P = 1600 px and move by dz = P(1 − 1/k) so z = 0 stays glued to the footage; z > 0 grows faster (parallax) (p. 5).
- Examples (p. 6): 'video' at f5 huge red swing from the left behind the head; 'watching' f23 pop with grey sticker outline; 'CLAUDE' f83 stretch on the red card; 'right'/'now' f233/f238 two slams with hard shadow while the words above blur.
- Exits: not specified per word; phrases clear at cuts/wipes; near words blur out (rack focus).
- Holds: not specified.

### Transitions and rhythm
- Hard cuts every 2–4 s (reference, p. 11); the source's jump cuts are reused as shot boundaries so they are hidden (p. 14).
- Liquid-ink wipe into red cards on punchlines; a spoken word can "trigger the next wipe" (S04, p. 21).
- Cards cut in on the words they illustrate; graphic beats land on words (X lands as "AI video generator" ends; render bar hits 100% on "code"; graph eases on "animations") (p. 14).
- Shot list (p. 21–22): 17 scenes in 24.8 s (743 f), shots 20–74 f long, cards overlap the shot before by a few frames (e.g. C01 52–99 over S01 0–62):
  S01 0–62, C01 52–99, S02 99–149, S03 149–193, S04 193–213, C02 203–245, S05 245–292, S06 292–342, C03 334–413, S07 413–436, C04 436–510, C05 510–541, S08 541–586, C06 578–615, S09 615–653, S10 653–686, S11 686–743.
- Test-clip shot pattern (p. 13): wide with push-in → red card → medium punch-in → ring shot → wipe → close punch-in.
- Sound (p. 15): whoosh = pink noise 250 Hz–2.8 kHz, 0.7 s; swish = pink noise 0.9–6 kHz, 0.35 s; thump = 58 Hz sine + short noise click, 0.45 s; 24 hits on transition and slam frames at 25–50% volume under the voice; whoosh and pop on transitions (Prompt 4). No music in the build (a music bed is suggested). BPM not given.

### Finish
- No grain, vignette, bloom or colour grade is specified. Depth cues are rack-focus blur (0–9 px) and parallax only.
- Render: H.264, CRF 16, 30 fps (p. 4, p. 19).
- Bloom (`@react-three/postprocessing`) is installed but not described as used (p. 9).

### 3D look (if any)
CSS 3D only (perspective 1600 px, rotateX/Y/Z, translateZ); no lighting or materials. Not a Blender look. Conversion notes if moved to After Effects: CSS rotateZ → AE Orientation Z; rotateY/X and z negated; AE blur ≈ 3.3 × CSS px (p. 7).

### Banned
- Downloading logos or brand assets — recreate them as vector/React components (Prompt 5, p. 19; p. 14).
- Words off-screen, overlapping, unreadable, or on top of the face or hands (Prompt 4, p. 19).
- Reusing another creator's footage, branding or script (p. 24).
- AI video generators for the visuals (the whole point of the guide, p. 7).
- Normalising the mix up when the voice is hot; keep SFX 25–50% under the voice (p. 23).

### Example frames
Embedded in the PDF only (no separate files): p. 1 (red cover, grid), p. 3 (ten frames of the finished video), p. 13 (cutouts over brand red), p. 14 (numbered review sheet, frames 405–474), p. 15 (Remotion vs After Effects frames).

### Gaps
Pixel font sizes per role; exit animations and hold lengths; push-in easing (linear assumed?); ink-wipe ease curve name; UI mockup typefaces and colours (terminal is dark in the frames, no hex); any grain/vignette/grade; music and BPM; exact grid line colour/opacity ("faint"); behaviour at 24 fps (all numbers are at 30 fps).

---

## Kinetic Type — Red Card mode (footage-free variant)
- Source: same PDF, pp. 6, 14, 21–22 (the card scenes C01–C06). Licence: as above.
- One line: full-screen red grid card where white Poppins/Six Caps words stack and small vector UI mockups animate on the spoken word.
- Suits: any narration-only explainer; works **without footage** and without 3D. This is the part of the Kinetic Type look that a TTS-driven engine can use on its own (the silhouette card C05 still needs a cutout).

### Palette
Same tokens: #C70808 / #AE0606 / #880404 card gradient, #F4F4F4 words, #B51722 red accents (X, silhouette), #5E0006 slam shadow, #7D7D7D grey.

### Typography
As the parent style. On cards the frames (p. 3, p. 14) show white Poppins Black lowercase stacks ("you are / seeing / right / now"), small connecting words above big ones, and Six Caps uppercase for the biggest word ("AI VIDEO GENERATOR").

### Layout
Centred stack in the upper half with a UI mockup in the middle third, closing word(s) at the bottom (p. 3 frame "typing a prompt … into an AI VIDEO GENERATOR"). No numbers given.

### Elements
216 px faint grid on the red card; prompt box + red X; Claude spark/wordmark; dark terminal with render bar; AE icon + timeline + graph editor; style chips (p. 14).

### Motion
Enter by liquid-ink wipe from the top-right (8–10 f, radius to 3000 px, 4 droplets); words use stretch, slam, pop, fade recipes; UI parts are pure functions of frame (typing, progress bar, curve) synced to words (p. 6, p. 14).

### Transitions and rhythm
Cards last 31–79 f (1.0–2.6 s) in the shot table (p. 21–22) and overlap the previous shot by up to 10 f.

### Finish
Not given beyond the radial gradient (acts as a built-in vignette).

### 3D look (if any)
None.

### Banned
As the parent style.

### Example frames
PDF p. 3 (frames 4, 5, 6, 8), p. 14 (review sheet frames 405–474).

### Gaps
Card typography sizes; card exit (cut back to footage, no exit move stated); UI component colours.

---

## Level 5 — HUD detection (dark broadcast HUD with keyword lock-on)
- Source: `Level 5 Workflow Guide.pdf` (12 slides, @visionaryclown.tv). Master prompt slide 1; overview 2; cue sheet 5; sound 6; look 7; HUD 8; scene library 9–10; review/specs 11; tips 12. Licence: none stated (slide 12 only says "Made with Claude by @visionaryclown.tv. Tag me when you post yours."). No code or repo is provided. All four fonts are Google Fonts (OFL).
- One line: a black, film-grained "the machine is listening" look — a permanent HUD frame (brackets, timecode, WPM, live transcript, waveform timeline) around 16 very different shader scenes, with every keyword boxed in orange detection brackets.
- Suits: voiceover-led tech/AI explainers, "how it works" reels, tool launches, any script with clear keywords and one big line; comment-keyword CTA reels. **No real footage needed** (voiceover only). 3D is optional: the chrome core, fractal drop and wormhole are GLSL shader scenes in the original; in this engine they map to Blender or Remotion three.js.

### Palette
| role | hex | where used |
|---|---|---|
| Black | #0B0A09 | background (slide 7) |
| Orange | #FF5A26 | keywords, hits, detection brackets, flash-card / CTA backgrounds (slide 7, frames slides 9–10) |
| Red | #FF3B1F | playhead, errors; "everything turns red: MANUAL" (slides 5, 7) |
| Warm white | #ECEAE4 | text (slide 7) |
| Indigo | #1B1D4A | quiet moments, the indigo-smoke serif scene (slide 7, scene 13) |

Visible in frames but not given as hex: soft salmon/peach background on the stacked-verbs scene; near-white paper on the composer and manga scenes; dark chocolate type on orange cards; a warm brown radial glow in the backgrounds.

### Typography
- **Unbounded 900** (Google Font): titles and THE DROP; uppercase, very wide and heavy (slide 7; "STOP", "LEVEL 5", "WATCHES / FINDS / PLACES" in frames).
- **Space Grotesk** (Google Font): captions and UI (slide 7).
- **JetBrains Mono** (Google Font): timecodes and data — timecode, WPM, readouts, transcript JSON (slide 7).
- **Instrument Serif** (Google Font): the emotional line; italic in the frames ("Honestly, I haven't seen many people in *India* talking about this", "Bye!") (slide 7, scenes 13 and 16).
- Small HUD labels: uppercase, widely letter-spaced mono ("LEVEL 5 WORKFLOW", "AUTO-MOTION · 01"); no em value given.
- Sizes: none given in px.
- Emphasis: keyword coloured orange inside orange corner "detection brackets", with a small mono readout under the caption in the form `05.58s ▸ WORD` (prompt block 6); the HUD sample reads `10.80s · BELONGS 96%` (slide 8). Big words become full-screen Unbounded slams.
- Words on screen: caption word by word on the timestamps (one short line, e.g. "where it [belongs]"), plus the running transcript on the left edge.

### Layout
HUD positions (slide 8, numbered):
1. Title top-left ("LEVEL 5 WORKFLOW", sub-label "AUTO-MOTION · 01").
2. Timecode `00:00:10:29` + words per minute (`182 WPM`, plus a small `W.034` counter) top-right.
3. Live transcript running vertically down the left edge (rotated mono text, keywords orange).
4. Caption lower-centre, keywords in orange brackets.
5. Timestamp readout directly under the caption.
6. Timeline strip along the bottom: waveform, orange keyword ticks, red playhead.
7. Handle bottom-left (sub-label "WORD-LEVEL / AUTO-EDIT").
8. Chapter label bottom-right (e.g. "02 / DETECT", sub-label "KEYWORD").
Thin L-shaped corner brackets at all four corners. Scene content sits in the centre band between the top HUD row and the caption. Margins/grid: not given.

### Elements
- Corner brackets (frame); detection brackets around keywords; lock-on brackets with an orange tag `KEYWORD • 8.10s` around the core (slide 8).
- Circular text ring around the core ("KEYWORD DETECTION • AUTO-MOTION • WORD-LEVEL TIMESTAMPS") inside a thin red circle (slide 8).
- Mini editor timeline at the top of some scenes (tracks V2/V1/A1, an orange clip "SFX @ 8.10s", red playhead) (slide 8).
- Waveform strip with keyword ticks (slides 4, 8).
- Scene library, one per idea (slides 9–10):
  01 Flash card — one giant word (dark "STOP" on orange with a concentric-ring pattern);
  02 Terminal — black dot grid, thin red cross-hair lines, mono command marked DEPRECATED;
  03 Claude-style chat — tool steps with check marks ("Watching video", "Transcribing audio") and a live transcript JSON;
  04 Chrome core — glowing orange wireframe sphere with orbit ellipses and keyword lock-on;
  05 Editor by hand — wireframe tunnel of nested rectangles behind an editor timeline with a keyframe graph;
  06 Composer — light paper UI, an input box with orange light streaks, chat input;
  07 Stacked verbs — three huge dimensional/outlined Unbounded words (WATCHES / FINDS / PLACES) on salmon, each with a small orange code pill (`match_video`, `find_keywords`, `place_motion`);
  08 Counter — thin orange ring with a big level numeral, build-up before the drop;
  09 Fractal drop — chrome bevelled 3D "LEVEL 5" in a brown Menger-sponge-like fractal corridor;
  10 Manga panel — white halftone, radial speed lines, speech bubble, red X over a TITLE badge, orange "FLEX!" burst;
  11 Workspace — full editor UI with clips and meters;
  12 Wormhole — radial orange/black/white rays, chrome "THE WHOLE EDIT";
  13 Indigo serif — indigo smoke, italic serif lines, a small radar sweep ("SIGNALS FOUND");
  14 File cards — locked files listed in a chat, "Ready to share";
  15 CTA card — orange concentric rings, "COMMENT" + giant dark "LEVEL 5", a comment pill typing the keyword then "Posted", "→ AND I'LL SHARE IT WITH YOU";
  16 End card — black, italic serif "Bye!", handle.
- Pills: orange-outlined rounded pills (slide 7 chips), orange KEY tags (slide 4).

### Motion
- Every motion lands on a spoken word; each word snapped to its real audio start (prompt blocks 1, 8).
- Named moves, no numbers: slam ("WATCHES slams in"), snap onto timeline with a stamp, lock-on brackets closing on the keyword, comment box typing the keyword, counter build-up, whole frame turning red on "manually", slow push-ins (slides 5, 7).
- No spring, easing, duration or stagger values anywhere in the source.

### Transitions and rhythm
- New scene on the first word of each idea: "1 idea = 1 scene, 1 keyword = 1 hit, 1 big line = 1 drop" (slide 5).
- Glitch on cuts and hits; whoosh on every scene cut (prompt block 8, slide 6).
- Drop structure: level counter → short silence before the biggest line → fractal drop with a glitching chrome title (prompt block 7); "That breath is where the drop goes" (slide 12).
- Measured: 47.2 s, 16 scenes (≈ 2.9 s average), 140 words, 49 keywords, 76 sound hits, 1,416 frames at 30 fps (slides 2, 4, 11). Storyboard timings: 01 HOOK 0.00–0.58 s, 02 HOOK 0.58–2.68 s, 03 WATCH 2.68–6.34 s, 04 DETECT 6.34–11.35 s (slide 11).
- Cue sheet (slide 5): 0.34 s "stopped" → giant STOP card / impact; 2.72 s "Claude" → chat opens / whoosh + impact; 8.10 s "keyword" → lock-on brackets / lock blip; 10.80 s "belongs" → graphic snaps onto the timeline / stamp; 17.39 s "manually" → everything red, MANUAL / error buzz; 19.55 s "watches" → WATCHES slams / 808 hit; 26.22 s "Level" → THE DROP / sub drop + crash; 27.56 s "flex" → FLEX! manga hit / punch; 41.68 s "comment" → comment box types LEVEL 5 / impact + keys.
- Sound (slide 6): no music; whoosh (every cut), blip (keywords), 808 hit (big words), riser → drop (biggest line), pop (UI clicks + cards), glitch (transitions), typing (terminal + comment box), stamp (something lands), ping (radar moments). Voice about +8 dB over SFX; master −14 LUFS; peaks under −1 dBTP. BPM: not given ("182 WPM" is speech rate).

### Finish
Chromatic aberration, feedback trails, bloom, slice glitch, film grain, vignette, slow push-ins (slide 7; prompt block 8 adds glitch on cuts and hits). No intensities given. Visible in frames: RGB fringing on the core's orbit lines, strong orange bloom on the core, a warm brown radial glow in the background.

### 3D look (if any)
Shader-made, not modelled: glowing orange wireframe sphere ("chrome core"), chrome bevelled title in a fractal corridor (drop), radial wormhole with chrome title, wireframe rectangle tunnel. Original stack: GLSL on WebGL2 + canvas HUD in headless Chrome, frames piped to ffmpeg, 30 fps H.264 + AAC (prompt block 9). No material, light or camera values.

### Banned
- No editing app, no templates, no AI video generator (prompt opening, slide 2).
- No music (prompt block 3, slide 6).
- SFX never over the voice ("your voice always wins", slide 6).
- No full render before the user approves a storyboard of real rendered frames (prompt block 10).

### Example frames
Embedded in the PDF only: slide 2 (chat, fractal drop, CTA), slide 4 (chat scene), slide 8 (annotated HUD over the chrome core), slides 9–10 (all 16 scenes), slide 11 (storyboard strip).

### Gaps
No motion numbers at all. No px sizes or margins. No finish intensities. Hex for only 5 colours. Render size conflict: specs slide says 1180×1526, prompt asks for 1080×1920 (slides 1, 11). Shader scenes are named and pictured, not specified.

---

## Motion as Code — Plotter on Ink (construction sheet)
- Source: `Motion as Code - Workflow Guide.pdf` (7 pp; byte-identical copy in `Claude workflow guide\Motion-as-Code-Workflow-Guide.pdf`, same SHA-256) and the kit `Motion_as_kit` (extracted at `scratchpad\motion_kit\Motion_as_kit\`). Values below come from the kit's code: `app/src/engine/palette.ts`, `post.ts`, `type.ts`, `stroke.ts`, `hud.ts`, `util.ts`, `glsl/common.ts` (extracted separately to `scratchpad\stylesresearch\local\kit-glsl\`), `app/src/scenes/_vo.ts`, `_motifs.ts`, the nine plates, `timeline.ts`, `scripts/render.ts`. Licence: **MIT** — the look is "the engine and style of pdoom-video by mexicat (Giacomo Magnanini)", `LICENSE.pdoom-engine` (MIT, © 2026). The PDF says MIT covers the palette, fonts, spark motif, graph-paper sheets and post-processing (PDF p. 7). Keep the licence notice if code is reused. Fonts: Archivo, IBM Plex Mono and Cormorant Garamond are SIL OFL (an `OFL.txt` ships in `fonts/src`); the EMS/Hershey single-stroke SVG fonts carry no licence file in the kit (I'm not sure of their terms; check before use). The voiceover and SFX are ElevenLabs output; the PDF says to check your own plan's terms.
- One line: a dark engineer's drawing board where a glowing orange spark plots every line, word and diagram live, exactly as the voice says it — deadpan technical annotation, Archivo slams that step through widths, HDR bloom and film grain.
- Suits: voiceover explainers about process, tools, code, AI, "how X works", product/tech narratives, diagrams and pipelines; deadpan humour. **No footage needed. No 3D needed** (one faint wireframe 3D stage appears in one plate). Built for 1920×1080 at 60 fps; needs re-layout for 1080×1920.

### Palette
| role | hex | where used |
|---|---|---|
| ink | #0A0A0B | background black, slightly warm; type on paper/signal plates (`palette.ts`) |
| ink2 | #151517 | raised black: panels, prompt field, inset graphs, film-strip backing |
| graphite | #5E5B57 | dim lines, secondary text, line numbers, paper-grid tint |
| ash | #9C978F | mid grey: unsaid-word outlines, notes, dimension text, axes |
| bone | #EEE9DF | paper white, primary text, said words, plotted lines |
| signal | #FF4D12 | "hazard orange": the spark, word being said, carets, playheads, strikes, numbers in code |
| ember | #FF8A3D | hotter/lighter orange for cores and the first frames of a fresh stroke or slam |
| blood | #C21D0B | deep red-orange: shadows of signal; signal's stand-in on paper |
| acid | #D8FF3C | "only for the shrooms moment" — a single rare accent; **defined but not used by any plate in this kit** (the `edits` comment says acid, the code mixes to signal) |

Heat ramp used by shaders (`heat()` in `common.ts`): ink → blood (0–0.3) → signal (0.25–0.55) → ember (0.55–0.8) → white-hot linear (1.0, 0.93, 0.85) (0.8–1.0). Halation tint (1.0, 0.18, 0.04) linear.

### Typography
- **Archivo** (Google Font, variable wdth 62–125 / wght): shipped as static instances at widths 62, 75, 87.5, 100, 112.5, 125 × weights 300/500/700/900, plus Archivo Italic at widths 75/100 × 400/800 (`type.ts`). Width is animated in **discrete steps** between instances. 900 for hero slams (uppercase), 700 for spoken-word rows (sentence case), 112.5/900 for form headers.
- **IBM Plex Mono** (Google Font) 300/400/500/600/700 + italic 400: UI voice — spaced uppercase labels, notes, code, typed prompts, readouts. Plex Mono lacks ▸ and ⏎, so those are drawn as shapes (`_vo.ts`).
- **Cormorant Garamond** (Google Font) 400/600 + italics, with lining figures forced on (`"lnum" 1`, because old-style "10" reads as "IO"): captions, formulas, dictionary entries.
- **Single-stroke plotter fonts** (not Google Fonts; SVG): EMS Allure (script), Hershey Script 1, Hershey Sans 1, EMS Readability ("readable"), EMS Tech, Hershey Serif Med, EMS Osmotron, EMS Felix. Drawn as polylines so the pen can write them; optical kerning computed from glyph profiles (strength 0.6, min clearance 0.1 em) (`stroke.ts`).
- Sizes (logical 1920×1080 px, before the 2D camera's zoom):
  - Hero slams fit a ~1440–1520 px column: MOTION/GRAPHICS fitted to 1520 px (cap 420 px), CLAUDE to 1440 (cap 400) with OPUS at 0.78×; full-frame slams fitted to 1500–1700 px wide (cap ~760–1000 px); "PRETTY / INSANE." fitted to 1520 (cap 400).
  - Spoken-word rows: Archivo 700 at 54–76 px (most 60–72); emphasis rows Archivo 900 at 72–150 px.
  - Mono labels 11–13 px, letter-spacing 3 px, uppercase, bone at 60% alpha; node titles 22–24 px, spacing 4–5 px; notes 11–17 px in ash.
  - Typed input: mono 42–50 px (prompt, 76 px line height); code listing mono 23 px on a 38 px line; chat 30 px, diff 22 px.
  - Cormorant: captions italic 26 px; formula italic ~62 px; dictionary headword 600 at ~150 px, definitions italic 44 px.
  - Form headers Archivo 112.5/900 at 64 px; typed form answers mono 30–46 px.
- Case: hero slams uppercase; spoken rows as written; labels spaced caps.
- **Emphasis = the voice.** World-space karaoke (`drawKaraoke`): unsaid words appear 0.12–0.3 s before they are said (default 0.3 s) as 1.1 px hairline outlines in ash at 45% (fading in over 0.18 s); the word being said fills by a left-to-right per-glyph wipe in signal; said words cool from signal to bone over 0.3 s after the word ends (to ink on paper). Optional per-word `hot: 'signal'` keeps a keyword orange.
- Words on screen: whole sentence rows are laid out ahead (as outlines) and light up word by word; 1–2 rows per beat, plus one hero word or phrase per line.

### Layout
- One large world-space sheet per plate, viewed through a 2D camera (pan, log-interpolated zoom about the move's fixed point, roll ±0.02 rad); layouts are columns ~1440–1520 px wide centred on the 1920 frame (≈ 75–80% width).
- Bookend frame only: crop marks 36 px in from each edge, 22 px arms, 1.25 px line, bone at 34% (ink 45% on paper) — shown on the first frame and the loop end, flown out along the diagonals otherwise (`hud.ts`).
- Corner furniture at ~64–72 px margins: plate number and title top-left (mono 13 px), readout instrument bottom-right (label 13 px, digits 40 px, 220 px tick bar with signal fill), Cormorant caption bottom-right at (W−64, H−66).
- Boxes carry registration ticks at the corners (from 6 to 18–20 px out). Annotations hang off everything ("fig. 0", "cap height", "baseline", "(0, 0)", "keyframes set by hand: 23").
- Density: high but quiet — many hairlines and small mono notes around one bold element.

### Elements
- **Graph paper** (`gridPass(24, 96)`): minor 24 px, major 96 px; minor line strength 0.011 × density, major 0.03 (bone over ink); it "ignites" as a disc revealed from the pen (radius 0 → 5200 px over 1.35 s, ease-out-cubic) with a signal glow on the reveal front (falloff 220 px, strength 0.09); a soft signal glow follows the pen (σ 140 px, 0.018).
- **The spark (pen)**: white-hot core 5 px, ember ring 12 px (×2.5), signal halo 26 px at 35%, four 1.2 px rays 9–14 px long spinning, flicker 0.85–1.0; trail of 12 samples 7 ms apart, max 90 px; sputter particles (rate 50–90/s, speed 220–260 px/s, gravity 520, life 0.42–0.45 s, 18 ms streaks, heat-coloured).
- **Plotted strokes** by kind (alpha): axis 0.6, construction 0.5 (dashed 10 px, 55% duty), dimension 0.85, hatch 0.55, plot 0.88, ink 0.95, signal 1.0; default width 1.2 px, written words 1.6–2.2 px, strikes 3–6 px, marker strike 12 px. Fresh line is hot: ember with 0.05 s decay, signal with 0.32 s decay, then the kind's colour; width ×1.6 while hot.
- **Engineering drawing kit**: axes with 100 px ticks and value labels, dimension lines (9 px arrowheads, 8 px end ticks, label at midpoint), bezier with dashed handles and 7 px handle circles, "ease.inOutCubic" / "cubic-bezier(.62, 0, .38, 1)" notes, a title block (TITLE / DRAWN BY / KEYFRAMES 0 / SCALE 1:1 / SHEET 1 of 9).
- **UI mock-ups**, all hairline on ink2: keyframe timeline (layers, 7 px diamond keyframes, signal playhead with triangle head), graph editor with a cursor dragging a handle (arrow cursor ×1.9, bone; signal while pressed) and "manual adjustments: n" counter, prompt field (› glyph, signal block caret 3.5–4 px wide, blink 2.2 Hz, 3 px karaoke bar under each typed word), token brackets with 5-digit IDs and next-token probability pop-ups (300 px wide, 21 px rows, bars to 80 px), code listing (line numbers graphite, numbers signal, comments ash, current line marked by an 8 px signal bar), chat with diff answers ("- …" ash struck through, "+ …" signal), film strip with sprocket holes, player with a play triangle that fills signal, node diagram boxes 340×130 with signal "01" numbers and packets (signal/ember dashes moving at 520 px/s every 0.22 s), keyframe "field" of 960 diamonds.
- **Readouts**: deadpan numbers ("CRAZINESS 0.97", "touched: 0", "keyframes requested: 0", "CONTEXT 012 / 200000").
- **Mask motif** (bone disc, two ink eyes, one smile arc; `_motifs.ts`): defined but unused in this kit.
- Image treatment: no photos; everything is vector, line and type.

### Motion
All timings in seconds (the kit renders at 60 fps); every move is keyed to a word's start/end from forced alignment.
- **Easing set** (`util.ts`): linear, in/out/inOut Quad, Cubic, Quart, outQuint, in/out/inOut Expo, outBack (s = 1.70158), outElastic; camera default ease-in-out-cubic. `pulse(t, t0, hl)` = 0.5^((t−t0)/hl) decay is used for every hit.
- **Slam** (CLAUDE, OPUS, GRAPHICS letters, PRETTY/INSANE.): scale 1.18–1.25 → 1 over 0.16–0.2 s ease-out-expo; colour ember (half-life 0.08–0.09 s) → signal → bone over 0.35–0.45 s after the word ends.
- **Width morph** (MOTION): letters start staggered across 85% of the word's duration; each steps through Archivo widths 62 → 75 → 87.5 → 100 over 0.32 s (ease-out-expo, quantised) while dropping in from −0.12 × size over 0.25 s (ease-out-cubic).
- **Width ripple** ("like this"): a sine bump of 0.42 s per glyph pushes widths 100 → 125, staggered 0.045 s per glyph and 0.14 s per row.
- **CRAZY. stretch**: per-glyph stagger 0.05 s, widths 62 → 125 over 0.3 s ease-out-expo, scale 1.3 → 1 over 0.15 s, 6 px per-frame jitter decaying (hl 0.12 s).
- **Odometer** ("5.5"): each digit rolls 0 → 5 through a clipped window over max(0.12 s, 90% of its spoken syllable), ease-out-cubic; the dot pops 1.6 → 1 over 0.15 s.
- **Pen writing**: each word's strokes are drawn while that word is said (ends 0.02–0.04 s early, min 0.12 s); pen travel between strokes ease-in-out-cubic, 0.08–0.3 s (0.08 + 0.00035 × distance px).
- **Type-on**: notes type at min(0.45, 0.012 × chars + 0.05) s; typed prompt/form words type over 70–85% of the spoken word; code lines over 0.35 s; tokens drop 10 px over 0.18 s ease-out-expo with an ember flash (hl 0.06 s).
- **Panel reveal**: wipe from the left over 0.45 s ease-out-expo plus a 120 px rise over 0.5 s.
- **Cross-out / strike**: signal line 4–6 px in 0.08–0.2 s ease-in-out-quad; the snip's halves recoil with a damped spring 1 − e^(−9t)·cos(30t)·0.15.
- **Ignition ring**: radius 30 → 930 px over 0.75 s ease-out-cubic, intensity (1 − age/0.75)^1.5.
- **Stamp** (paper): scale 1.6 → 1 over 0.12 s ease-out-expo, opacity in 0.05 s, rotated −0.07 rad.
- **Hit accents** (post): zoom punch +1–3% (hl 0.07–0.1 s), shake 4–14 px (noise at 40–60 Hz, hl 0.06–0.1 s), bone flash 0.008–0.25.
- **Holds**: the said word stays; groups dim to 25–45% when the next idea starts (e.g. `1 − 0.75·prog`).
- **Rewind**: a plate's local clock τ rewinds to 0 over the word "mathematically" (ease-in-out-cubic) and replays at 6× speed.

### Transitions and rhythm
- **Cuts sit in the pause before a line**: 0.18 s before its first word, or gap × 0.45 (min 0.04 s) if the pause is short; never after the word (`timeline.ts`).
- Inside plates the camera **whips** between areas of the sheet in 0.16–0.3 s (ease-out-expo), often with a small roll (±0.01–0.02 rad).
- **Dive hand-offs**: a plate ends by zooming into a node/box (zoom to 4.4–5.5 with ease-in-quart); the next plate opens at zoom 2.3–4.4 on the same element and pulls back (`hook` → `model`, `crazy` → `code`).
- **Rush**: the ⏎ key fills the frame (zoom to 48× ease-in-quart, CA up to 5.2, bloom to 1.5) and becomes the next plate's signal field; that field later **closes like a shutter** to ink (ease-in-quart).
- **Diagonal wipe** (±130 px slant, 3 px signal edge) flips an artboard ink ↔ paper and back.
- **Implode loop**: the last slam scales into the centre spark (ease-in-cubic), particles burst (300/s), flash 0.25, crop marks return, and the final frame equals frame 0 so the video loops.
- Engine default if two timeline entries overlap: a plain crossfade over the overlap (not used by this timeline).
- Rhythm: 9 plates in 92.6 s (4.1–18 s each); a hit (zoom/shake/flash, plus an SFX cue) on most stressed words. A nominal 120 BPM grid exists in `audio.json`, but "scenes time everything from the words".
- Sound: 28 ElevenLabs effects (whoosh fast/soft, impact slam/small, key click, typewriter, enter key, mouse click, marker strike, pen line/tick, paper slide, stamp, projector click/run, reverse suck, riser, scan sweep, snip, spark ignite/sizzle/zip, tape rewind, confirm chime, falling pieces, ui blip/tick, zap slash) on ~500 cues; ducked up to 7 dB under the voice; −14 LUFS.

### Finish
Global post (`post.ts`, applied to the linear HDR frame) — defaults, then per-plate values:
- Defaults: exposure 1; bloom 0.55 (threshold 0.85, knee 0.5, radius 0.75, 7-mip pyramid); halation 0.25 (red-orange (1.0, 0.18, 0.04) × luma of a wide bloom mip); chromatic aberration 1.2 px at the frame edge (radial, r² falloff); grain 0.055; vignette 0.35.
- Ink plates: bloom 0.7–0.72, threshold 0.82–0.86, vignette 0.42, grain 0.05. Prompt plate: threshold 0.92, knee 0.25, vignette 0.45.
- Tone: identity below 0.72 then an exponential shoulder; very bright values (2–12) desaturate toward white by up to 85%.
- Vignette shape: smoothstep(0.95, 0.25, length(d × (1, 0.8))), multiplied by the vignette amount.
- Grain: two scales (1 px and 2×2 px cells, mixed 0.6/0.4), amplitude grain × (0.55 + 1.2 × L(1 − L)) so it is strongest in mid-tones, plus ±0.5/255 dither; HUD is composited before grain and vignette.
- Flash adds bone; invert swaps ink ↔ bone (0.8515 − 0.84 × c); fade to black.
- Motion blur: shutter 0.5 (180°), adaptive 4 → 12 sub-frames (more where motion is fast).
- Encode: H.264 libx264, CRF 16 (script default) / 17 (npm script), preset slow, `-tune grain`, aq-mode 3, BT.709 matrix/primaries/transfer tags, yuv420p, 60 fps.

### 3D look (if any)
Only in the `prompt` plate: a faint "engraved" wireframe stage behind the UI — additive bone lines at 11% on a floor grid (4 × 6 units, fading over 130 units), a perspective camera (FOV 34°) that dollies slowly and orbits on "seamless camera movement", single-stroke letters hopping 0.45 s each, a circle → square → triangle morph, and wireframe cube/octahedron that flash signal (hl 0.25 s) as named. No shading, lights or materials.

### Banned
- Hand-set keyframes; anything that is not a deterministic function of time (PDF p. 4; `scene.ts`).
- Cutting after a line's first word (`timeline.ts`).
- Off-palette colours — the paper grid uses graphite at 3.5% because "light blue would be off-palette" (`pipeline.ts`); acid only for one rare moment (`palette.ts`).
- Old-style figures in Cormorant (use lining) (`type.ts`); relying on ▸/⏎ glyphs in Plex Mono (draw them).
- A dark halo behind captions on paper ("reads as a pale patch") (`hud.ts`).
- Workflow rules from the demo prompt: don't edit `app/src/engine/`; no full 4K render without asking (PDF p. 5).

### Example frames
No preview images or videos ship with the kit (no `out/` folder; the 2 GB renders were left out). The PDF has no screenshots (cover p. 1 shows the ink + grid + single orange dot look). Stills can be made only by running the kit, which this research did not do.

### Gaps
Designed for 16:9 at 60 fps; no vertical layout, safe zones or 24/30 fps values. Plate content sizes are in world px under a moving camera, so on-screen sizes vary with zoom. Single-stroke font licences not stated. No music. The acid accent is never shown.

---

## Motion as Code — Bone Paper Form (paper plates)
- Source: same kit — `app/src/scenes/pipeline.ts` ("FORM 2-B") and the first half of `verdict.ts` ("FORM 9, exit questionnaire"); README calls these "the bone-paper forms". Licence: MIT (pdoom-video).
- One line: a deadpan bureaucratic paper form, typewritten as it is spoken, ticked and struck by an orange marker, and slammed with a distressed rubber stamp.
- Suits: comparisons (old way vs new way), checklists, verdicts, process charts, FAQs, humour; a palette-inverted breather inside a dark video. No footage, no 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Paper | bone #EEE9DF × 0.965 in linear light (≈ #EAE5DC, my computation) | page base, then darkened up to ~6.5% by fibre noise |
| Ink | #0A0A0B | header band (94%), type, box outlines, rules |
| Graphite | #5E5B57 | 24 px printed grid at 3.5%, box notes |
| Signal | #FF4D12 | typing "hot" colour, ticks, X marks, marker strike, stamp |
| Blood | #C21D0B | proposed-row numbers, chosen answers, totals on the "good" row |
| Bone | #EEE9DF | header text on the ink band |

### Typography
- Header band: Archivo width 112.5 / 900 at 64 px ("FORM 2-B", "FORM 9") in bone on an ink band 1720 × 104 px; beside it spaced mono caps 19 px (spacing 5) and 14 px subtitles.
- Section labels: IBM Plex Mono 600, 17–18 px, spacing 3 ("1. CURRENT PROCESS").
- Typed answers: Plex Mono 400, 30–46 px, each character with ±0.8 px vertical jitter (typewriter); typed while said, hot signal → ink over 0.35 s after the word.
- Box names: Plex Mono 500, 30 px (row 1) / 36 px (row 2); notes under boxes mono 15 px graphite; fine print mono 15 px at 75%.
- Answer options: mono 500, 26 px, spacing 4.

### Layout
Page 1720 px wide (x −860…860) under a hand-held camera; header band at top, a 1.6 px rule at 150 px, numbered sections, process rows of boxes (5 × 262 px with 64 px gaps; 4 × 300 px with 92 px gaps; boxes 116 px tall), right-aligned totals in the margin ("STEPS 5 · KEYFRAMES 412"), fine print at the bottom with a rule above. Checkboxes 28–30 px.

### Elements
Ink-outlined boxes (1.6 px; 2.4 px for the proposed row) with "1.1"-style numbers; pen-drawn arrows on each spoken "to" (2.2 px, 14 × 8 px heads, 0.16 s + 0.07 s); wobbly orange marker strike through a whole row (12 px, sine + noise wobble, 0.3 s); signal ✕ and ✓ ticks (4–5 px); rubber stamp 1400 × 340 canvas: 12 px outer and 4 px inner border, "NO KEYFRAMES" in Archivo 900 (≤ 170 px), mono 28 px lines with 9 px spacing, knocked out by 3,600 speckles and 34 dry streaks.

### Motion
Boxes fade in 0.2 s just before their word; names typewrite over 85% of the word; stamp slams scale 1.6 → 1 in 0.12 s (ease-out-expo), rotated −0.07 rad, 92% opacity, with zoom +2.5% and 7 px shake (hl 0.07 s); strike zoom +1%. Camera "reads along the rows" (ease-out-expo / in-out-cubic moves) with hand-held drift: ±6 px, ±5 px and ±0.004 rad of slow noise (0.5–0.7 Hz).

### Transitions and rhythm
Enters by a hard cut in the pause before the line; `verdict` leaves the paper by cutting to ink 0.12 s before the next line.

### Finish
bloom 0.15, bloom threshold 1.4, vignette 0.28, grain 0.04, halation 0.05, chromatic aberration 0.6; HUD switched to "paper" mode (ink crop marks/captions). Paper texture: fbm fibres (×0.004 / ×0.05 stretch, −3.5%) and cloud (×0.0025, −3%) plus sparse darker specks.

### 3D look (if any)
None.

### Banned
Light blue grid ("off-palette"); halos behind captions on paper.

### Example frames
None shipped.

### Gaps
Designed at 16:9; no vertical layout. Paper hex is derived, not given.

---

## Motion as Code — Signal Field Slam (orange interlude)
- Source: kit `app/src/scenes/crazy.ts`, part A ("And this is where it gets crazy"). Licence: MIT (pdoom-video).
- One line: the frame floods hazard orange and one black word per spoken word slams full-frame, each at a different Archivo width, until a stretching "CRAZY." — then the orange shutters shut to black.
- Suits: a 3–5 s hype beat or punchline inside a darker video; hook openers. No footage, no 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Field | #FF4D12 | full-frame background, brightened ~12% at centre (radial) |
| Hatch | #C21D0B | faint diagonal engraving lines at 16% (9 px pitch, noise-varied) |
| Glow | #FF8A3D | centre glow pulse on the final word |
| Type | #0A0A0B | slam words, corner labels, readout |

### Typography
Archivo 900, uppercase, one word at a time, fitted to ~1500 px wide (max ~1000 px tall), each at its own width: AND 125, THIS 112.5, IS 125, WHERE 87.5, IT 125, GETS 100; final "CRAZY." at width 125 fitted to 1700 px (max 760 px). Corner labels Plex Mono 13 px, spacing 3, ink at 55–80%.

### Layout
Word centred on the frame; plate number top-left at (72, 86); "CRAZINESS" readout bottom-right (220 px bar at W−72−220, H−96) with 40 px mono digits.

### Elements
Corner furniture only; a ⏎ glyph shrinking from 560 px to 0 over 0.35 s (ease-in-cubic) carries over from the previous plate.

### Motion
Each slam: scale 1.25 → 1 over 0.16 s ease-out-expo, hard cut to the next word; CRAZY. letters stagger 0.05 s, step widths 62 → 125 over 0.3 s, scale 1.3 → 1 over 0.15 s, 6 px jitter decaying; readout rolls 0.12 → 0.97 over 0.6 s ease-out-expo.

### Transitions and rhythm
In: the previous plate's keycap rushes to fill the frame. Out: the orange field closes vertically like a shutter to ink (ease-in-quart) just after the last word. One cut per spoken word.

### Finish
bloom 0.4 (threshold 1.2), vignette 0.3, grain 0.06, zoom punch +2% per word (hl 0.07 s), shake 14 px on the last word, chromatic aberration spiking to 4.2 px.

### 3D look (if any)
None.

### Banned
Not stated beyond the parent style.

### Example frames
None shipped.

### Gaps
Only one example (≈ 2 s long); vertical sizes not given.

---

## Claude + Blender — Black Glass Studio (glowing UI panels in 3D)
- Source: `Claude + Blender_ Make 3D Motion Graphics From Code.pdf` (7 pp, Nate Herk, AI Automation Society). Look and format p. 3 (LOOK, FORMAT, CAMERA blocks); pieces p. 2; review checklist p. 4; fix rounds p. 5; sound p. 6; encode p. 6; troubleshooting p. 7. The prompt itself is **not in the PDF**; it is rari's (@0xwhrrari) prompt pack on X (x.com/0xwhrrari/status/2112166940081004693), "shared for free" (p. 3). Licence: none stated for the guide or the prompt. The film's hero is Clawd, the Claude Code mascot (Anthropic's character), and its app is a fake After Effects; the guide says to "leave out real logos" (p. 6) — a catalog version needs its own hero and its own fictional app.
- One line: a toy-like hero hops across floating slabs of black glossy glass whose screens glow like a real app; every press visibly builds a glowing title card, then the panels power down and fall away.
- Suits: product/tool demos, "how this app works" stories, launch teasers, mascot-led shorts, process explainers with UI. **Needs 3D (Blender + Cycles).** No real footage. Original is 16:9; the guide says a 9:16 version must be a separate composition with bigger type and fewer elements, never a crop (p. 6).

### Palette
| role | hex | where used |
|---|---|---|
| Glass | not given ("black glossy glass") | panel slabs |
| Screen light | not given ("screens glow") | the UI image shown on the panels |
| Hero | not given (terracotta brand colour; a fix round checked "the pixel value against the hex") | Clawd |
| Set | not given ("SET: where it all floats") | background |

### Typography
Not given. UI labels mimic a real app ("name every panel and its state; real labels make it read as the real app", p. 6). Review rule: text readable at phone size and inside the frame (p. 4).

### Layout
- Interface: one fake app workspace rendered as a single 3840×2160 image (HTML + Puppeteer) mapped onto the glass panels (p. 2).
- Comp: the title card being built, an HTML canvas rendered per frame (360 frames) (p. 2, p. 4).
- One shared `timeline.py` holds every button position (in pixels of the fake app) and every event time, so feet land on buttons exactly (p. 2).
- Last frame must work as a poster (p. 4).

### Elements
Glass panel slabs; the hero as "a simple toy shape" (p. 6); app buttons Type, Rectangle, Pen, Glow; four keyframes; a playhead the hero rides; Play button; the comp/title card with spark rays and glow; shatter cracks; panels that power down and fall (p. 1, p. 5).

### Motion
- Beats by second range, each hop changes something in the comp (BEATS block, p. 3). Stamping a keyframe jumps the title to that pose; riding the playhead plays the animation back (p. 2).
- Sequence: hero peels off the screen → pops into 3D → hops on buttons → four keyframes → rides the playhead → Play → every panel powers down and falls away → only the finished comp remains (p. 1).
- No easing, spring or height values given. Fix examples: "spark rays twice as wide"; "shorter cracks that fade faster"; a jump "too high" is fixed by one number (pp. 1, 5).

### Transitions and rhythm
- One continuous film, no cut list given; CAMERA: wide to start, follows each hop at the hero's height with shallow focus, ends on the comp alone (p. 3).
- 12 s at 120 BPM (24 beats), 30 fps, 360 frames (p. 3, p. 4).
- Sound (p. 6): fully synthesised; 120 BPM beat that drops on the pop; glass knocks, a sticker peel, a keycap click per button, a ding per keyframe, a power-down per falling panel; quiet before the pop, loud from the drop, softer on the fade (loudness checked every 0.5 s); high-frequency roll-off and −1 dBTP ceiling (raw synth overshot to +2.7 dB).

### Finish
- Cycles on GPU; AgX colour management (it lightens colours: the hero read salmon pink until **exposure 0 → −0.4** and a darker base colour) (p. 5, p. 7).
- Lights hidden from glossy rays so the glass shows no white blocks (p. 3, p. 7).
- Shallow depth of field (CAMERA block, p. 3).
- Review stills at half size and 40 samples (≈ 1.3 s each on an RTX 5090); final sample count not given (p. 4).
- Final encode: `vignette=angle=PI/6`, libx264 high profile, CRF 17, yuv420p, AAC 320k, faststart; 10.1 MB for 12 s (p. 6).

### 3D look (if any)
The whole style is 3D: floating black glossy glass slabs carrying an emissive UI texture, a toy-shaped hero, shallow focus following the hero at its height, lights invisible to glossy rays, AgX view transform with negative exposure for faithful brand colour, falling panels with power-down at the end. Practical notes: call `view_layer.update()` before parenting (else children snap to the parent origin); pass `gpu.py` on every render (the GPU choice is a Blender preference, not saved in the .blend); render in resumable chunks and re-render frames whose brightness scan flags them (p. 5, p. 7).

### Banned
- Real logos (p. 6); presses that don't change anything visible (p. 6).
- Cropping the 16:9 film for vertical (p. 6).
- White light reflections blowing out the screens (p. 4, p. 7).
- Vague notes ("make it better") — fixes must be exact numbers (p. 5).
- AI video models / hand animation ("Nobody animated a frame of it, and no AI video model made it", p. 1).

### Example frames
None in the PDF (text only). The source film is linked only through rari's X post.

### Gaps
Everything visual that needs numbers: no hex, fonts, sizes, lens/f-stop, light setup, glass roughness/IOR, emission strength, samples for the final render, hop heights or timings, BPM-to-beat map. The actual prompt text is not included.

---

## Not styles, but useful parts

Shots and scene types
- Four-layer occlusion shot: plate → words behind → subject cutout → words in front (Kinetic Type p. 5, recipe J p. 21).
- Parallax push-in: footage scale k 1.0 → 1.16, text stage perspective 1600 px moved by dz = P(1 − 1/k) so z = 0 sticks to the footage (Kinetic Type p. 5).
- Text ring / halo around a tracked head: rotateY(a) translateZ(r), tilt 24°, radius 260–285 px, 4–5°/frame, front/back halves split by cos(a) (Kinetic Type pp. 6, 21).
- Silhouette card: the subject's cutout filled flat brand colour on a white 120 px grid card (Kinetic Type p. 6).
- Red grid card with UI mock-ups that act on the spoken word (prompt box crossed out, terminal + render bar to 100%, timeline + graph editor easing) (Kinetic Type p. 14).
- Level 5 scene library as shot types: flash card, terminal boot, AI chat with tool steps, glowing core with lock-on, wireframe tunnel + editor, composer, stacked verbs, counter, fractal drop, manga panel, workspace, wormhole, indigo serif, file cards, CTA comment card, end card (Level 5 slides 1, 9–10).
- Node diagram with packets and a "snip" that cuts a link, halves recoiling on a damped spring 1 − e^(−9t)cos(30t)·0.15 (Motion as Code kit `hook.ts`).
- Process chart on a paper form, old row struck through with a marker, new row approved by a rubber stamp (kit `pipeline.ts`).
- Typed prompt with next-token probability pop-ups above each token (kit `prompt.ts`, data in `prompt-data.ts`).
- Code listing typed line per named concept beside an artboard that builds each concept; then rewind the clock and replay at 6× (kit `code.ts`).
- Film strip that snaps one frame per spoken word, accelerates, then collapses into a player (kit `frames.ts`).
- Chat command → diff answer → live preview changes (kit `edits.ts`).
- Hero-builds-it 3D film: a toy hero presses UI buttons on floating glass panels; every press changes the result (Claude + Blender pp. 1, 6).

Caption and type styles
- Word-by-word caption with keywords in orange corner "detection brackets" and a mono readout `05.58s ▸ WORD` under it (Level 5 slides 1, 8).
- Live transcript running vertically down the left edge with keywords coloured (Level 5 slide 8).
- World-space karaoke: unsaid = 1.1 px ash outline (45%) shown 0.3 s early; saying = per-glyph left-to-right signal wipe; said = signal → bone over 0.3 s (kit `_vo.ts`).
- Pen-written captions: single-stroke Hershey/EMS fonts, each word's strokes drawn while the word is said (kit `_vo.ts` `writeWords`, `stroke.ts`).
- Width-step type: letters stepping through static widths 62 → 100 (or 100 → 125 ripple) of Archivo (kit `hook.ts`, `crazy.ts`).
- Odometer number that rolls one digit per spoken syllable (kit `model.ts`).
- Sticker outline (9 px grey behind the fill), soft shadow `0 0.03em 0.09em` black 28%, slam hard shadow 4.5% of size in dark red (Kinetic Type p. 22).
- Condensed display face thickened with a same-colour 6–10 px outline (Six Caps) (Kinetic Type p. 22).
- Arc text: θ = x/R, position (R sin θ, ±R(1 − cos θ)) (Kinetic Type p. 6).
- Deadpan instrument readouts and counters ("keyframes set by hand: 23", "touched: 0", "CRAZINESS 0.97") (kit `hook.ts`, `verdict.ts`, `crazy.ts`).

Transitions
- Cut in the pause before a line: 0.18 s before its first word, or gap × 0.45 (min 0.04 s); never after the first word (kit `timeline.ts`).
- Liquid-ink wipe from the top-right corner: radius eases to 3000 px in 8–10 frames, simplex-noise edge, 4 droplets ahead (Kinetic Type pp. 6, 21).
- Dive hand-off: end a scene zooming into an element (to 4.4–5.5× with ease-in-quart); open the next scene zoomed in on the same element and pull back (kit `hook.ts` → `model.ts`, `crazy.ts` → `code.ts`).
- Rush: a key/button zooms to 48× (ease-in-quart) while chromatic aberration and bloom spike, and becomes the next scene's background (kit `prompt.ts` → `crazy.ts`).
- Colour-field shutter close to black (ease-in-quart) (kit `crazy.ts`).
- Diagonal wipe with a ±130 px slant and a 3 px hot edge, flipping dark ↔ paper (kit `code.ts`).
- Implode-to-first-frame loop: last word scales into a centre spark, particle burst, flash 0.25, crop marks return, final frame = frame 0 (kit `verdict.ts`).
- Glitch on cuts and hits; whoosh on every cut (Level 5 slides 1, 6).
- Hide source jump cuts by making them shot boundaries (Kinetic Type p. 14).

Motion recipes
- Kinetic Type recipe vocabulary with springs (damping/stiffness/mass at 30 fps): swing 13/140/0.7, pop 10/230/0.6 with 1 f stagger, stretch 8/150/0.8, slam 9/190/0.8, slide ease-out-expo 6 f / 280 px, fade 4 f scale 1.08 → 1, drop 320 px ease-out-cubic 4 f, rack focus 0 → 9 px over ~10 f (Kinetic Type p. 21).
- Slam in seconds: scale 1.18–1.25 → 1 over 0.16–0.2 s ease-out-expo, colour ember → signal → final over ~0.4 s (kit `model.ts`, `verdict.ts`).
- Hit accent kit: exponential pulse 0.5^((t − t0)/hl); zoom +1–3% (hl 0.07–0.1 s), shake 4–14 px of 40–60 Hz noise, additive flash (kit scenes, `util.ts`).
- 2D camera that zooms about the move's fixed point with log-interpolated zoom, so dives and pull-backs read as one gesture (kit `_vo.ts` `Cam2D`).
- Hot strokes: a freshly drawn line glows ember (0.05 s decay) then signal (0.32 s) before settling, 1.6× width while hot (kit `_vo.ts`).
- Graph paper that ignites outward from the pen: reveal disc to 5200 px over 1.35 s with a glowing front (kit `hook.ts`, `_vo.ts`).
- Stamp slam: scale 1.6 → 1 in 0.12 s, tilted −0.07 rad, distressed by 3,600 knock-out speckles and 34 dry streaks (kit `pipeline.ts`).
- Hand-held document camera: slow noise ±6 px / ±5 px / ±0.004 rad (kit `pipeline.ts`, `verdict.ts`).
- Graphics land on the spoken word: X lands as the phrase ends, a bar hits 100% on a key word, a curve eases on "animations" (Kinetic Type p. 14).

Layout patterns
- Persistent HUD frame that ties very different scenes together: corner brackets, title, timecode + WPM, transcript edge, waveform timeline with keyword ticks and playhead, handle, chapter label (Level 5 slide 8).
- Engineering-sheet annotation layer: crop marks, registration ticks on boxes, dimension lines, "fig." captions, title block (kit `_vo.ts`, `hook.ts`, `hud.ts`).
- Subject lower-middle with empty space above and to the sides for type (Kinetic Type p. 8).
- 9:16 is its own composition with bigger type and fewer elements, not a crop (Claude + Blender p. 6).

Finish recipes
- HDR post chain with values: bloom 0.55–0.72 (threshold 0.82–0.92), halation 0.25 in (1.0, 0.18, 0.04), CA 1.2 px at edge, grain 0.04–0.06 weighted to mid-tones at two cell sizes, vignette 0.28–0.45, tone shoulder at 0.72 (kit `post.ts`).
- Adaptive motion blur at a 180° shutter (4 → 12 sub-frames where motion is fast) (kit `engine.ts`, `package.json`).
- Encode for grain: libx264 `-tune grain`, aq-mode 3, CRF 16–17, preset slow, BT.709 tags (kit `render.ts`).
- Blender: AgX with exposure −0.4 to keep brand colours, lights hidden from glossy rays, ffmpeg `vignette=angle=PI/6`, CRF 17 (Claude + Blender pp. 5–7).

Sound ideas
- Level 5 hit vocabulary: whoosh on cuts, blip on keywords, 808 on big words, riser → drop on the biggest line, pop on UI, glitch on transitions, typing, stamp, ping; voice +8 dB over SFX; −14 LUFS, −1 dBTP; no music (Level 5 slide 6).
- Silence before the biggest line, then drop ("That breath is where the drop goes") (Level 5 slides 1, 12).
- SFX placement by transient (onset − 8 ms), peak (whooshes) or end (risers, reverse sucks); ±5% pitch jitter on repeats; typing strikes every ~0.05–0.075 s with swing; ducking up to 7 dB under the voice (10 ms attack, 180 ms release); two-pass loudnorm to −14 LUFS, TP −1.5 (kit `sfx_mix.py`).
- Placeholder SFX from noise: whoosh pink noise 250 Hz–2.8 kHz 0.7 s, swish 0.9–6 kHz 0.35 s, thump 58 Hz sine + click 0.45 s; hits 25–50% under the voice (Kinetic Type p. 15).
- One sound per on-screen action (glass knock, sticker peel, keycap click, ding per keyframe, power-down per panel) on a 120 BPM beat that drops on the reveal (Claude + Blender p. 6).
- SFX-only stem proven in sync by a null test (residual −54 dB) (Kinetic Type p. 15).

Review and process
- Contact sheets of every frame (8×5, frame numbers stamped) for reference study; review sheets every 3rd frame; `sheet --cuts` = 4 frames around every cut (Kinetic Type pp. 11, 13; kit `render.ts`).
- Storyboard with one real rendered frame per scene before the full render (Level 5 slide 11); comp contact sheet + 18 half-size stills before the full 3D render (Claude + Blender p. 4).
- Feedback format "timestamp + word + one change" and exact-number fixes (Kinetic Type p. 19; Claude + Blender p. 5).
