# Visual styles from ECC, NullMotion, 3Blue1Brown and four web sources

Research only. Values are taken from the sources themselves (local files read in full where listed, web pages read on
2026-10-31). Paraphrased; short phrases, numbers and hex values are quoted as given. Nothing was installed or run.

Target engine: Remotion 4.0.535 (2D), Blender 5.1 (3D), 1080x1920 vertical, 24-30 fps, Google Fonts.

Completeness key used below: **full** = palette + type + motion values + rhythm given; **partial** = some exact values,
some fields missing; **thin** = a name and a few descriptive words, few or no numbers.

Licences: ECC (affaan-m/ECC) is MIT (checked `ECC/LICENSE`). NullMotion is MIT (checked `NullMotion/LICENSE`; its
template previews show third-party app marks, which stay their owners' property). 3b1b/videos is CC BY-NC-SA 4.0
(checked `videos/LICENSE.txt`): rules only, no code, no characters, no brand.

---

# Part A. ECC (`D:\code_files\resources to make content engine\github repos\ECC\skills\`)

Files read in full: `taste/SKILL.md`, `taste/references/genre-taxonomy.md`, `taste-distillation/SKILL.md`,
`taste-application/SKILL.md`, `taste-application/SOURCE.md`, `taste-application/scripts/HANDOFF-TEMPLATE.md`, the
`tasteforge/fixtures/flashethereal/*` pack (pack.json, grade.json, cadence.json, spec.json, grounding.txt),
`tasteforge/schema.py`, `tasteforge/interview.py`, the genre part of `tasteforge/workflow.py`, `tasteforge/media/glitch.py`,
`tasteforge/media/manim_geo.py` (skimmed), `tasteforge-video/SKILL.md`, the three `motion-*` skills, all of
`frontend-slides/` except the PPTX/PDF scripts, and `remotion-video-creation/rules/{timing,animations,transitions,
text-animations,3d,charts,display-captions}.md` plus the two text-animation asset files.

Important correction to the brief: the taxonomy file does **not** give a hex palette per genre. Only one look has hex
values: the angelcore x cloud-trance "mood system" in `taste/SKILL.md` (with a hyperpop accent inside it). The ~50
named genres in `genre-taxonomy.md` are a name plus 3-6 words each. They are listed below as thin family entries.

## Divine Void (angelcore x cloud-trance, hyperpop accent)
- Source: `ECC/skills/taste/SKILL.md` ("The Mood System", "Editing Grammar", "Beat Math", shot plan, prompt presets); licence: MIT
- One line: near-black void pierced by one warm holy light, cut hard on the beat, with bright iridescent "hyperpop bloom" frames at the drop.
- Suits: music videos, lyric videos, visualisers, mood reels, fancams. Built for footage: AI-generated or filmed b-roll
  cut on beats, with Remotion overlays (blooms, lyric text). Needs real or generated footage for the subjects (winged
  figures, portraits, clouds); 3D can supply the hero-on-black objects, crystals and particles.
### Palette
| role | hex | where used |
|---|---|---|
| base dark (void) | #05060a | "most frames are one or the other"; composition background |
| base light (bone white) | #f4f1ea | the light half of the frames; with gold in "winged ascension" |
| divine accent, start | #ffb24d | molten gold; the one warm light in dark frames; bloom gradient end colour |
| divine accent, end | #ff7a18 | ember orange; gold ramps to this |
| crystalline accent | #8a6bff | violet bokeh, bright frames only |
| crystalline accent | #4fc3ff | cyan bokeh, bright frames only |
| crystalline accent | #ff6ad5 | magenta bokeh, bright frames only |
| danger accent | #ff2a2a | one glowing red on monochrome, for 1-2 shock cuts in the whole video |
| bloom core | #fff | centre of the "divine flash" radial gradient (#fff -> #ffb24d) |
| hyperpop subject | not given | candy-pink hair, chrome, glossy white against blue sky (words only) |

Rule: one accent per shot. Gold lives in dark frames, iridescence in light frames, never both in one shot. Red once.
### Typography
- Faces, weights, sizes, spacing: not given.
- Case and emphasis: captions all caps; one or two words highlighted in the accent colour, synced to the vocal.
- Words on screen: only in lyric or talking sections. The pure visualiser has no text ("no text, no watermark" in every generation prompt).
### Layout
- 9:16 vertical; landscape sources centre-cropped (`crop=ih*9/16:ih,scale=1080:1920`).
- Signature frame: one sharp hero object centred in black negative space (macro: key, eye, gear, petal, water drop).
- No mixed aspect ratios in one timeline. Crop out any UI chrome or status bars from screen-recorded references.
### Elements
- Ember bloom, single gold shaft / god-rays, rising dust, glitter, crystalline bokeh, lens flares, light leaks, halos,
  clouds, wings, crystalline structures, candy-cyber portraits.
- Bloom overlay: full-frame radial gradient #fff -> #ffb24d, `mix-blend-mode: screen`.
### Motion
- Camera: slow, floating, weightless: drift, slow push, slow orbit. Numbers not given.
- Bursts of speed only at the drop; "otherwise everything breathes".
- Particles rise (embers, dust, glitter): upward = ascension.
- Divine flash: opacity keyframes 0 -> 1 -> 0 at frames [0, 3, 12] (30 fps), screen blend, placed on a transient
  for 1 beat. Clamp right.
- Speed ramp: slow to fast across the last bar before the drop, then hard cut to tempo on the one.
### Transitions and rhythm
- Every hard cut lands on a beat or transient. No dissolves/crossfades in verse or drop.
- Beat maths for the source track (138 BPM): 1 beat = 0.43478 s = 10.43 frames at 24 fps, 13.04 at 30 fps;
  1 bar = 1.7391 s = 52.17 frames at 30 fps; 8-bar phrase = 13.913 s. Snap every sequence start to `round(n * 60/BPM * fps)`.
- Hero-on-black inserts held 1-2 beats each, then cut: a rhythmic montage of these is the signature.
- Colour-pop on monochrome: run a passage in B&W, then one coloured element (red eye, gold flame, pink hair) punches in on the downbeat.
- Section plan: Intro = slow push, no cuts; Verse = hard cut every 2 beats (macro montage); Drop = speed-ramp in, cut on
  the one, fast; Bridge = one long held shot plus one colour-pop; Drop 2 = add divine-flash blooms on transients, light
  leaks maxed; Outro = slow fade to black.
- Never hold a shot past its musical phrase.
### Finish
- High contrast, deep blacks. Film grain plus subtle chromatic aberration on dark frames; clean gloss on bright frames.
- Bloom, glitter bokeh, flares, light leaks: "heavenly, not dirty".
- Generation suffix for every clip: "9:16, vertical, cinematic, film grain, volumetric light, no text, no watermark".
- Generate 6-10 per preset, keep 2-3 ("throw away 80%").
### 3D look
- Not specified as 3D. The "macro hero" preset implies: one object on pure black, razor-sharp detail, single rim light.
  Cold outro: pale crystalline ice dissolving, cold blue and bone white.
### Banned
- Crossfades in tempo sections; more than one accent colour per shot; gold and iridescence together; red used more
  than once or twice; a shot held past its phrase; readable UI chrome, status bars or captions from references; mixed
  aspect ratios; deciding the look after generating.
### Example frames
1. Divine void: one molten-gold ember bloom rising in near-black, dust particles, one warm source.
2. Macro hero: antique brass key (or eye, or gears) centred on black, single rim light.
3. Crystalline bloom: violet-cyan-magenta bokeh, refraction, soft focus, lens flares.
4. Candy-cyber portrait: candy-pink-haired figure, chrome accents, bright blue sky, glossy saturated.
5. Winged ascension: winged figure rising into clouds, halo, bone white and gold, god-rays.
6. Cold outro: pale ice structure dissolving into black.
### Gaps
- No typefaces, sizes or caption layout; no easing curves or camera speeds; no hex for candy pink, sky blue or chrome;
  no grain amount or aberration offset. The 138 BPM maths is for one specific track: the method generalises, the numbers do not.

## Flash Ethereal (measured style pack)
- Source: `ECC/skills/taste-application/scripts/tasteforge/fixtures/flashethereal/` (pack.json, grade.json,
  cadence.json, grounding.txt) and `taste-application/scripts/HANDOFF-TEMPLATE.md`; test signature in
  `taste-application/tests/test_multimodal_workflow.py`; licence: MIT
- One line: black and pale-lavender frames with a violet/orchid cast living only in the shadows and low mids, an electric-blue accent, and a frantic but uneven cut (median 0.47 s) broken by long holds.
- Suits: hype edits, music-driven reels, glitch-collage promos. Needs footage (the references are screen-recorded
  reels; the pack grades and cuts footage). 3D props are rendered in Blender and graded like footage.
### Palette
Dominant palette from `grade.json` (k-means, share of masked pixels):

| role | hex | share / where used |
|---|---|---|
| near-black base | #131215 | 35.6% |
| pale lavender-white | #e4e4eb | 26.2% |
| dusk mauve (shadow cast) | #67505b | 14.5% |
| dusty rose (mid cast) | #b19b9c | 9.6% |
| electric blue accent | #1214f4 | 7.8% |
| steel blue | #4b92cc | 6.3% |
| electric blue accent (handoff doc) | #2938e7 | "a separate accent, not part of the cast" |

Measured grade (grade.json): L\*a\*b\* mean 44.29 / +9.03 / -11.23; contrast (std L\*) 34.67 (handoff: 34.55); black
point L\*0.0; white point L\*99.66; mean chroma 21.58; background share below L\*10 = 26.3% (handoff); grain sigma
0.0086 (grade.json) / 0.0071 (handoff). Chroma per luminance zone (medians, zone edges L\* 0/15/35/55/75/100):
L\*7.5 a\* 0.0 b\* -0.41 (neutral); **L\*25 a\* +24.9 b\* -17.5 (violet, the signature)**; L\*45 +11.5 / -7.1;
L\*65 +2.1 / -5.3; L\*87.5 +1.1 / -1.1 (neutral). The handoff doc's table differs (L\*25 +19.75 / -14.20) and
grounding.txt's means differ again (L\*25 +35.4 / -44.7); the shape is the same: neutral ends, violet low mids.
### Typography
- Not given. The references contain burnt-in titles (one plate run lifted the words "HYPER MOTION"), which the method masks out.
### Layout
- Reference stills are "glitch collages with several subjects". Test signature: "high-key centered subject".
- Delivered cut was 1280x720; vertical sources were scaled to cover (never padded), after cropping the capture app's UI.
### Elements
- Glow and streak overlay plates lifted onto black, 2-12% of frame each; a grain plate.
- Test signature materials: "glass bloom", "white phosphor". Workflow effect name: `bloom_flash`.
### Motion
- Test signature motion: "hard-cut flash", "slow orbital drift". No speeds given.
### Transitions and rhythm
- Reference: 77 shots in 59.99 s (60 fps sources): mean 0.779 s, median 0.467 s, p25 0.333 s, p75 0.75 s, min 0.2 s,
  max 4.567 s, 77 cuts/min, rhythm variance (std/mean) 1.06.
- Variance 1.06 = "not metronomic": long holds punctuated by very fast runs. Sample shot lengths from the distribution, never even spacing.
- Delivered cut: 33 shots, mean 0.74 s, 81 cuts/min (5% faster than reference, "inside tolerance").
### Finish
- Plates composited Screen (or Add), every 3rd shot at 0.30 base opacity, each placed at a seeded random scale,
  position and rotation (one plate in one spot reads as a watermark).
- Grain plate at the measured sigma, Overlay blend (Screen lifts the blacks).
- LUT: 33^3 `.cube`, node 1 only. Never a global tint: the ends must stay neutral.
### 3D look
- Blender: black world, transparent film; key + rim, no fill; rim colour = the pack's signature zone in linear sRGB
  (0.392, 0.236, 0.401); view transform Standard (not AgX/Filmic), no grading in Blender. Turntable 72 frames / 3 s.
  Shipped prop: a chrome helmet GLB with full PBR maps.
### Banned
- Global tint; evenly spaced cuts; Screen-blending the grain; lifted (grey) blacks; grading the delivered shots twice;
  AgX/Filmic before the LUT; borrowed UI chrome (like button, counter, comment bubble); one plate in a fixed spot;
  "muddy shadows" (test signature).
### Example frames
1. Black frame, one electric-blue streak plate screened at 30%, violet in the shadow falloff.
2. High-key pale lavender frame with a centred subject, grain overlaid.
3. Chrome helmet turntable on black, violet rim light.
### Gaps
- spec.json in the fixture is a dry-run placeholder: no verbal look description, lighting, lens or framing text.
- No type, no motion values, no transition types. Source media is not bundled. The three zone tables disagree in magnitude.

## 3D Cyber Glitch (named genre, test-fixture signature only)
- Source: `ECC/skills/tasteforge-video/SKILL.md` (genre list) and `ECC/skills/taste-application/tests/test_multimodal_workflow.py`
  (signature), `tasteforge/workflow.py` (effect rules); licence: MIT
- One line: full-frame 3D interstitials in wireframe chrome and emissive scanlines, orbiting in depth and rupturing into macroblocks.
- Suits: tech/hype edits, music reels. Needs 3D (full-frame, not decorative corner meshes); CV effects need a tracked subject in footage.
### Palette
- not given.
### Typography
- not given.
### Layout
- "full-frame 3D interstitial". Effects keep 8% safe area, cover at most 30% of frame, preserve faces and readable type.
### Elements
- "wireframe chrome", "scanline emissive". Effect `cv_wireframe_lock` locks a wireframe to a segmentation-tracked primary subject.
### Motion
- "depth orbit", "macroblock rupture". Effects scheduled aperiodically: first at 0.35-0.75 s, gaps 0.61-2.17 s,
  each 0.08-0.42 s long, at most 18 (seeded random, never periodic). See glitch parameters in Part E.
### Transitions and rhythm
- not given beyond the effect schedule.
### Finish
- not given.
### 3D look
- Wireframe chrome, emissive scanlines, full-frame. If the subject track is lost: disable the effect until it recovers.
### Banned
- "decorative corner mesh"; a corner overlay replacing full-frame 3D; continuing a CV effect without an anchor.
### Example frames
1. Full-frame chrome wireframe of the subject's silhouette, camera orbiting in depth, scanlines glowing.
### Gaps
- Everything except the four signature phrases. These phrases come from a test fixture, not from measured references.

## Fluid Sketch (named genre, test-fixture signature only)
- Source: same as 3D Cyber Glitch; licence: MIT
- One line: ink-wash and graphite drawing on an open field, contours flowing non-linearly and bleeding into paper.
- Suits: reflective explainers, poetry, music. 2D; no footage or 3D needed.
### Palette
- not given (ink and graphite implies monochrome on paper; not stated).
### Typography
- not given.
### Layout
- "negative-space drawing field". Effects cover at most 35% of frame, 8% safe area.
### Elements
- "ink wash", "graphite edge". Effect name `fluid_contour_bleed`.
### Motion
- "nonlinear contour flow", "paper bleed". Same aperiodic effect schedule as above.
### Transitions and rhythm
- not given.
### Finish
- not given.
### 3D look
- none.
### Banned
- "rigid neon grid".
### Example frames
1. Graphite line drawing self-tracing across cream paper while ink wash blooms behind it.
### Gaps
- Everything except the four phrases (test fixture).

## ECC genre taxonomy families (seven thin entries)
- Source: `ECC/skills/taste/references/genre-taxonomy.md` and the family table in `taste/SKILL.md`; licence: MIT
- The source says these names were "transcribed from low-resolution screen frames" of a third-party style library and
  may be misspelt; "the families are the durable, reusable layer". No hex, type, motion or timing values for any of them.
  Rule from the source: pick one primary family and at most one accent; never more than primary + one accent per section.

| Proposed style | Reads as | Members (one-line descriptions in the source) | Completeness |
|---|---|---|---|
| Ethereal / Divine | weightless, holy, glowing, soft | spiritualism (halos, god-rays), glacial folk (cold blue + bone white, crystalline, calm), beacons (single light in darkness), zen core (empty space, stillness, muted), fairy tale (storybook, illustrated), cozy blanket (warm, tactile, soft focus) | thin (Divine Void above is its worked example) |
| Hyperpop / Y2K-cyber | glossy, chrome, neon, kawaii-cyber | cyberdelia (psychedelic, melting digital), acid house (rave graphics, smileys, acid colour), acid nora (acid painterly, warped), neo aggressano (maximal, clashing colour), new liquid (wet chrome, liquid metal), 8-bit/pixel (dithered lo-fi) | thin |
| Dark / Occult | high-contrast, ominous, grain | dark academia (sepia, candlelit, gothic), smoke nostalgia (hazy, faded), communist core (red star, poster, red/black), abstract tech (schematic, cold), microzoathic (dark microscopic forms) | thin |
| Retro / Print | flat, graphic, halftone, nostalgic | retro surfers (60s-70s, sun-faded), art deco (geometric gold, symmetry), adventure pulp (pulp covers), classic advertising (mid-century), magazine collage (cut paper), bumper stickers (sticker-bomb), retro print/riso (limited palette, halftone, misregistration), neo lisboa (azulejo tiles), factory pomo (postmodern industrial), 2026 austurbano (near-future urban editorial) | thin |
| Organic / Textural | tactile, macro, woven, wet | microbiology core (cells, petri), weaving patterns (textile), fruitage retro (glossy produce still life), pacific punk wave (wet, oceanic), shape design (bold flat Bauhaus-ish shapes), colour fusion (blended colour fields) | thin |
| Systemic / Data | gridded, generative, schematic | numbers (numeric type, ledgers), mazes, code web (node graphs), heatmap (thermal mapping), the builds (blueprint), multilayer (stacked transparent layers), scrapbooking | thin |
| Cultural / Kitsch | loud, specific, referential | catholic kitsch, Latin-American vernacular graphic, East-Asian retail pop, battle of culture, premium brands (luxury packaging), pro collectibles (trading-card framing), Americana preppy, carnival, soft-club portraits, misc presets | thin |

- Gaps: every field. Use as inspiration tags only; values would have to be designed or measured (taste-distillation).

## ECC slide presets (twelve looks, deck-oriented)
- Source: `ECC/skills/frontend-slides/STYLE_PRESETS.md` (catalog), `animation-patterns.md` (motion), `html-template.md`
  (theme tokens); licence: MIT
- These are HTML slide-deck looks, but each names a font pairing, a palette in words and a signature device, so they
  port to vertical title cards and explainer scenes. **No hex values are given for any preset**, except the template's
  default theme, which matches Neon Cyber. Completeness: Neon Cyber partial, the other eleven thin.
- Shared motion for all presets (template): reveal = opacity 0 -> 1 + translateY 30px -> 0 over 0.6 s with ease-out-expo
  `cubic-bezier(0.16, 1, 0.3, 1)`; children staggered by transition-delay 0.1 / 0.2 / 0.3 / 0.4 s. Variants: scale-in
  0.9 -> 1 (0.6 s); slide from left -50px -> 0 (0.6 s); blur-in 10px -> 0 (0.8 s).
- Feel-to-motion map (animation-patterns.md): Dramatic/cinematic = slow fade-ins 1-1.5 s, large scale 0.9 -> 1,
  parallax, dark backgrounds, spotlight; Techy = neon glow, glitch/scramble text, grid reveals, particles, monospace
  accents, cyan/magenta/electric blue; Playful = spring easing, floating/bobbing, rounded corners; Corporate = subtle
  200-300 ms transitions, navy/slate/charcoal; Calm/minimal = very slow subtle motion, high whitespace, serif type;
  Editorial = staggered text reveals, pull quotes, grid-breaking layouts, serif headlines + sans body.
- Mood map: Impressed = Bold Signal, Electric Studio, Dark Botanical; Energised = Creative Voltage, Neon Cyber, Split
  Pastel; Calm = Notebook Tabs, Paper & Ink, Swiss Modern; Inspired = Dark Botanical, Vintage Editorial, Pastel Geometry.
- Shared banned list: purple-on-white startup templates; generic startup gradients; Inter / Roboto / Arial as the voice
  (unless utilitarian neutrality is wanted); system-font decks unless intentionally editorial; bullet walls; tiny type;
  decorative illustrations where abstract geometry would do ("abstract shapes only").

| Preset | Feels | Fonts (Google?) | Palette (words only) | Signature elements |
|---|---|---|---|---|
| Bold Signal | confident, high-impact, keynote | Archivo Black + Space Grotesk (both Google) | charcoal base, hot orange focal card, crisp white text | oversized section numbers; one high-contrast card on a dark field |
| Electric Studio | clean, bold, agency-polished | Manrope only (Google) | black, white, saturated cobalt accent | two-panel split; sharp editorial alignment |
| Creative Voltage | energetic, retro-modern, playful | Syne + Space Mono (both Google) | electric blue, neon yellow, deep navy | halftone textures, badges, punchy contrast |
| Dark Botanical | elegant, premium, atmospheric | Cormorant + IBM Plex Sans (both Google) | near-black, warm ivory, blush, gold, terracotta | blurred abstract circles, fine rules, restrained motion |
| Notebook Tabs | editorial, organised, tactile | Bodoni Moda + DM Sans (both Google) | cream paper on charcoal, pastel tabs | paper sheet, coloured side tabs, binder details |
| Pastel Geometry | approachable, friendly | Plus Jakarta Sans only (Google) | pale blue field, cream card, soft pink / mint / lavender | vertical pills, rounded cards, soft shadows |
| Split Pastel | playful, creative | Outfit only (Google) | peach + lavender split, mint badges | split backdrop, rounded tags, light grid overlay |
| Vintage Editorial | witty, magazine | Fraunces + Work Sans (both Google) | cream, charcoal, dusty warm accents | geometric accents, bordered callouts, punchy serif headlines |
| Neon Cyber | futuristic, techy, kinetic | Clash Display + Satoshi (**Fontshare, not Google**) | midnight navy, cyan, magenta | glow, particles, grids, "data-radar energy" |
| Terminal Green | developer, hacker-clean | JetBrains Mono only (Google) | GitHub-dark + terminal green | scan lines, command-line framing, monospace rhythm |
| Swiss Modern | minimal, precise, data-forward | Archivo + Nunito (both Google) | white, black, signal red | visible grids, asymmetry, geometric discipline |
| Paper & Ink | literary, story-driven | Cormorant Garamond + Source Serif 4 (both Google) | warm cream, charcoal, crimson accent | pull quotes, drop caps, elegant rules |

### Neon Cyber detail (the template's placeholder theme: same fonts as Neon Cyber, but no magenta)
| role | hex | where used |
|---|---|---|
| background | #0a0f1c | slide field |
| secondary background | #111827 | cards |
| text | #ffffff | headings, body |
| secondary text | #9ca3af | captions |
| accent | #00ffcc | highlights; glow `rgba(0,255,204,0.3)` |
- Gradient-mesh background (animation-patterns.md): radial ellipse at 20% 80% `rgba(120,0,255,0.3)` to transparent 50%,
  plus radial ellipse at 80% 20% `rgba(0,255,200,0.2)` to transparent 50%, over the base colour.
- Grid background: 1px lines `rgba(255,255,255,0.03)` every 50px both ways.
- Type sizes (web, clamp): title clamp(2rem, 6vw, 5rem); subtitle clamp(0.875rem, 2vw, 1.25rem); body clamp(0.75rem, 1.2vw, 1rem).
- Gaps (all presets): no hex for eleven presets, no weights, no letter-spacing, no transitions between slides, no
  video rhythm. Satoshi and Clash Display would need substitutes (Google) or local files.

---

# Part B. NullMotion (`D:\code_files\resources to make content engine\github repos\NullMotion\`)

Files read: `data/template-catalog.json` (all 23 entries), `data/reference-policy.json`, `AGENTS.md`, `README.md`
(skimmed), `THIRD_PARTY_NOTICES.md`, and the template pages for exact values: `public/01-cta-pill`,
`22-kinetic-headline`, `05-app-icons` (in full or its timeline), and colours/eases/type sizes grepped from every other
`public/NN-*/index.html`, plus `public/27-cinematic-hud-overlay` (not in the catalog) and `public/drafts.mjs`.

Finding: nearly all of the 23 catalog entries share one house look (obsidian glass + silver gradient + metallic glint), so that
look is written up below as a full style, with the 23 templates as its shots (table at the end of this part). One extra
page, `27-cinematic-hud-overlay`, is not in the catalog but defines a separate full look, so it gets its own entry.

## Obsidian Chrome (NullMotion house look)
- Source: `NullMotion/data/template-catalog.json` prompts + `NullMotion/public/*/index.html` values; licence: MIT
  (template previews include third-party app marks: do not reuse those marks)
- One line: premium product-ad overlays: glossy obsidian pills and glass cards, silver-gradient type, one metallic glint, eased hard on power4/expo, on transparent alpha.
- Suits: SaaS/product promos, AI-tool explainers, app launches, stat callouts, CTAs, lower thirds over talking heads or
  screen recordings. Works as transparent overlays on real footage, or alone on a dark field. No 3D needed (CSS pseudo-3D);
  Blender could do the obsidian/chrome props.
### Palette
| role | hex | where used |
|---|---|---|
| obsidian top | #2b2b2e | pill/button gradient start (180deg) |
| obsidian mid | #161618 | gradient at 46% |
| obsidian base | #0a0a0b | gradient end; darkest surface |
| card surfaces | #1b1b1f, #232327, #26262b | glass cards, list rows, chart cards |
| silver text top | #ffffff | silver-gradient label start |
| silver text mid | #cfcfcf | at 45% (CTA); #dedee2 at 44% in the approved headline |
| silver text base | #9a9a9a | gradient end (CTA); #999aa2 in the approved headline |
| headline silver | #f4f4f6 | approved Kinetic Headline base text colour |
| warm accent (approved look) | #e8b768 | amber guide line, inner pill rim, glow, sheen tint |
| spark core | #fff6df | travelling spark in Kinetic Headline |
| muted subcopy | rgba(214,214,218,0.72) | subtitles |
| light tile (vertical icon lineup) | #fafafd -> #ececf2 (58%) -> #d8d8e1 | approved App Icon Float tiles, 145deg |
| pale glow tints | #cfe0ff, #cfd6ff, #cfe0d6, #bfffd9 | icon-tile glows in list/grid templates |
| alert red | #ff4b4b, #d33 | notification badge only |
### Typography
- Face: Inter (Google Font) everywhere, with system fallbacks. Micro labels: "SFMono-Regular"/Consolas monospace (not Google Fonts).
- CTA label 40px, weight 600, letter-spacing 0.18em, uppercase, silver gradient clipped to text; subcopy 21px/400/0.04em.
- Approved Kinetic Headline (1920x1080): words 132px, weight 780, line-height 0.88, letter-spacing -0.055em, all caps,
  silver gradient; the emphasised word sits in a pill at 102px / -0.045em. Index and microcopy labels 13px mono,
  weight 560/500, tracking 0.19-0.2em, caps, at 52% / 42% opacity.
- Editorial headline (Slide-In Showcase): 150px/700/-0.05em, eyebrow tracked 0.28em; logo wordmark 104px/700/-0.03em.
- Vertical showreel: 150px headline and a 200px year, weight 800, -0.04em.
- Words on screen: one headline of 1-3 words, one emphasised; or one CTA word + one subcopy line.
### Layout
- Transparent overlays. 16:9 lower third: centred, bottom 140px. Editorial: left-aligned, after a 1px metallic divider.
- Kinetic Headline: centred line on a 1px guide at mid-height (1472px wide, fades at both ends), word gap 34px,
  perspective 1400px.
- Vertical (1080x1920) icon lineup: centred row, tiles 200px with 46px radius and 48px gap; single hero tile 380px / 86px radius.
### Elements
- Glossy obsidian pill: radius 999px; inset highlight `0 2px 1px rgba(255,255,255,.22)`, inset shade
  `0 -3px 6px rgba(0,0,0,.85)`, drop shadow `0 30px 55px rgba(0,0,0,.55)`, 1px border `rgba(255,255,255,.10)`, a
  specular cap over the top ~48% (white .30 -> 0).
- Metallic glint: a band 45% of the pill wide, skewed -18deg, white peaking at .55 opacity mid-band; one sweep per shot.
- Contact shadow under hero objects: ellipse `rgba(0,0,0,.48)` blurred 18px.
- Glass cards with faint gridlines; silver-gradient bars with soft bloom on the hero bar; pseudo-3D bars with floor
  reflections; cursor glide + press + ripple + focus ring; blinking caret typing; notification toasts; phone mockup.
### Motion
- Ease vocabulary (GSAP names): `expo.out` (pill/plate entrances), `power4.out` (cards, bars, lists, rises),
  `power3.inOut` / `power2.inOut` (line draws, glint sweeps), `back.out(1.3-2.4)` (pops, presses, toasts, markers),
  `sine.inOut` (idle drift, float). Remotion has no GSAP names: these need translating to `Easing.bezier` curves.
- Chrome CTA: pill from y +90, opacity 0, scale 0.96, 0.85 s expo.out at 0.1 s; label from y +14 0.6 s at 0.45 s;
  subcopy y +18 0.6 s at 0.65 s; glint sweeps -60% -> +160% over 0.9 s power2.inOut at 2.3 s; 4 s total.
- Kinetic Headline (approved, 4 s): atmosphere from scale 0.72 + blur 22px (0.72 s power3.out); orbit ring from scale
  0.9 / -9deg (0.82 s); guide scaleX 0 -> 1 (0.68 s power3.inOut); side words in on opposing arcs from x -/+112, y +/-18,
  rotation -/+1.2deg, blur 8px (0.72 s power4.out, 0.09 s apart); pill anticipation scaleX 0.93 / scaleY 1.06 ->
  stretch 1.08 / 0.95 (0.43 s power3.out) -> settle to 1 with back.out(1.55) over 0.34 s ("one restrained overshoot");
  one spark crosses x -205 -> +210 (0.68 s) with one sheen (0.76 s power3.inOut) at 1.22 s; idle drift 1.8 s sine.inOut; readable hold to 4 s.
- App Icon Float (approved, vertical, 5 s): tiles start 1120px below, squashed (scaleX 0.9 / scaleY 0.72, rotationX
  12deg, rotationZ -4deg, perspective 1500, origin 50% 82%); 0.13 s stagger from 0.16 s; rise 0.9 s power4.out
  overshooting to y -24 with scaleY 1.045 / scaleX 0.98, then settle 0.34 s power2.out; exit at 4.06 s: dip y +10 with
  squash 1.03/0.97 (0.12 s), then fly off with stretch 0.92/1.06 and rotationX -6deg (0.6 s power2.in), fade 0.16 s.
- Slide-In Showcase: masked lines rise from yPercent 115-130 over 0.9-1.1 s, 0.15 s apart; underline draws to 560px
  over 1.0 s power4.inOut; idle drift x +18 over 3.2 s.
- Data: card from y +60 / scale 0.97 (0.8 s); bars scaleY 0 -> 1 (0.7 s, hero bar 0.95 s power4.out, 0.17 s later);
  values from y +14 (0.5 s); caption pill y +30 / scale 0.96 (0.7 s expo.out). Line chart: axes 0.5-0.6 s, gridlines
  0.08 s stagger, curve draws 1.6 s power2.inOut, fill fades 0.8 s, markers pop back.out(1.8) 0.5 s apart.
- Toast drop: from y -120, 0.7 s back.out(1.7); badge pop scale 0 -> 1, 0.4 s back.out(2.4); phone idle float y -20, 1.1 s sine yoyo.
- Blur reveal: plate y +70 / scale 0.9 (0.8 s back.out(1.3)); light sweep 1.1 s power2.inOut; unblur 0.9 s power2.out.
### Transitions and rhythm
- Each shot is 4-7 s at 30 fps: reveal, readable hold, clean alpha-safe exit (exit upward in the brand-family reveal).
- Stagger steps 0.08-0.15 s. One glint/sheen per shot, late (2.3 s of 4, or 1.2 s of 4).
- Hosted pipeline (from UI text, see 02 summary): sparse overlay windows of 4-12 s over the source video, never one
  monolithic composition.
### Finish
- Transparent alpha output (hosted pipeline: ProRes 4444). No grain. Soft deep drop shadows, restrained bloom.
### 3D look
- CSS pseudo-3D only: perspective 1400-1600px, small rotationX/Y, contact shadows, floor reflections, a phone tilting in
  from a 3D angle, icons turning on Y up to 360deg. Blender material values: not given.
### Banned
- "generic tiles", "looping bob", "decorative glow spam"; distorting or redrawing a real mark (keep it "undistorted and
  locally frozen"); "fake UI or decorative clutter"; "decorative telemetry that competes with the message".
### Example frames
1. Black field, one obsidian pill centred low with a silver uppercase label, glint mid-sweep.
2. "YOU [LAUNCH] WANT": side words arcing in, middle word squashed inside a dark pill, amber guide line behind.
3. Vertical: three pale glossy icon tiles risen to centre, settled, with soft contact shadows.
4. Obsidian glass card: a dim grey "1x" bar beside a tall silver "10x" bar blooming, caption pill below.
### Gaps
- Most legacy templates are 16:9; only five are vertical. The approved amber accent appears in one template. Mono font is
  not a Google Font. No transition between shots. Note the cross-source conflict: ECC's slide skill bans Inter as the
  visual voice; NullMotion uses it everywhere (the silver gradient carries the look, not the face).

## Neural HUD (NullMotion page outside the catalog)
- Source: `NullMotion/public/27-cinematic-hud-overlay/index.html` ("Cinematic Neural HUD"; not listed in
  `template-catalog.json`, so not marked approved); licence: MIT
- One line: a vertical sci-fi control screen: cyan/magenta glow on near-black, a rotating ring hub, scrolling mono logs, glass status card, scanlines and vignette.
- Suits: AI/tech explainers, "system online" intros, data/stat reveals, cyber hooks. 2D only (Remotion); no footage.
### Palette (default "cyber"; four alternates swap the same roles)
| role | hex | where used |
|---|---|---|
| void | #03050d | field base |
| void soft | #09111f | field gradient |
| core | #00e5ff | rings, labels, corner brackets, meter |
| core hot | #c6faff | dust motes, metric text, node fill |
| core deep | #087c9c | meter gradient start |
| secondary | #ff2bd6 | secondary ring, log emphasis, meter end |
| secondary hot | #ffc4f3 | secondary nodes |
| paper | #eafcff | body text |
| muted | rgba(210,241,247,.48) | small labels |
| depth orb violet | #6c43ff | blurred orb at .045 opacity |

Alternates (core / hot / deep / secondary / secondary-hot): emerald #38ff87 / #e2ffeb / #0b9448 / #66e8ff / #ddfbff;
ultraviolet #a978ff / #eee4ff / #6032ba / #ff4ecd / #ffd6f3; solar #ffbd38 / #fff1c9 / #bd6d0b / #ff4d6d / #ffd6de;
ice #b8f7ff / #ffffff / #4e9aac / #6c7cff / #d8dcff.
### Typography
- Headings Arial (not a Google Font) with tight tracking -0.04 to -0.06em; labels Consolas monospace (not Google), 9-13px,
  tracking 0.17-0.29em, uppercase. Sizes: core label 44px, brand title 35px caps, metric 48px with a 24px glow, status
  title 30px, log lines 12px on a 29px line.
### Layout (1080x1920)
- Field inset 34/28/30px, 54px radius, feathered by a radial mask. Header at x 86 / y 102, 908 wide. Hub 620x620 at
  x 132 / y 424. Log column right 66px, y 296, 258x844, faded top and bottom. Glass status card x 122, bottom 190, 836
  wide, 34px radius. Corner brackets 72px, inset 72px. Clock bottom-left (80, 92).
### Elements
- 74px grid at 0.18; fractal-noise layer at 0.14 (screen); three blurred depth orbs (blur 132-158px, opacity
  0.045-0.075); 30 dust motes 2-4px; octagon-clipped icon "satellites" (back 82px, blur 3.6px, 0.23; mid 116px, 0.52);
  dashed network paths (dash 8/12, stroke 1.7, 0.42); hub rings (dashed 4/15; solid 8px with dash 510/1170;
  secondary 114/38/24/72); 8px meter filling to 78.4%; scan beam; scanlines 0.19; chroma tint 0.085 (screen);
  vignette to 0.87 black at the edge.
### Motion
- Field fades in with scale 1.025 -> 1 (1.05 s power3.out). Header y -32 (0.72 s expo.out, 0.16 s). Brand mark scale
  0.35 + rotation -12deg (0.68 s back.out(1.65)); copy staggered 0.09 s.
- Orbs drift 30-42px with scale up to 1.09 over 7.2-7.4 s sine.inOut. Dust rises 74-164px over 7.05 s.
- Network paths draw (dashoffset 170 -> 0, 1.25 s power3.inOut, 0.08 s apart); nodes pop back.out(2), 0.11 s apart.
- Hub: from scale 0.6 + blur 6px to 1.15 (0.78 s expo.out), settle to 1 (0.34 s); rings rotate 356deg over 6.12 s power1.inOut.
- Logs scroll -612px over 5.92 s; status card y +58 / scale 0.96 (0.82 s expo.out at 2.0 s); meter fills 1.18 s
  power4.out; cells pop back.out(1.4) 0.08 s apart; scan beam sweeps down 5.52 s power2.inOut.
- End: dot and metric pulse once (0.28-0.3 s yoyo) at 6.8-7.0 s; dust fades out at 7.24 s. 8 s total.
### Transitions and rhythm
- One continuous 8 s build: layered entrances over the first ~2.7 s, then slow drift and one end pulse. No cuts.
### Finish
- Scanlines, chromatic tint, vignette, noise grain, glow drop-shadows on hub (2/10/35/90px stacked).
### 3D look
- none (one perspective 900px on the hub).
### Banned
- not given in the file. The catalog's approved prompts ban "decorative telemetry", which this page is full of: treat it
  as a distinct maximal look, not part of Obsidian Chrome.
### Example frames
1. Cyan ring hub upper-left of centre with a glowing label, magenta arc segment, logs scrolling at right, glass card below with a meter at 78%.
### Gaps
- Fonts are system fonts (substitutes needed). Not marked approved. No exit or transition values.

## NullMotion catalog: the 23 templates as shots
All are 30 fps. "V" = 1080x1920, "H" = 1920x1080. Look = Obsidian Chrome unless noted. Brand names in the prompts are
placeholders ("swap in my brands").

| id | name (category, status) | size, s | look in one or two lines |
|---|---|---|---|
| 05-app-icons | App Icon Float (short, approved v3) | V, 5 | approved marks rise from below on shallow arcs, settle as equal weights, hold with restrained depth; no generic tiles, looping bob or glow spam |
| 27-icon-stack-rise | Icon Stack Rise (short, approved v2) | V, 5 | master mark rises with three product marks behind; master flips into the lead product, rear marks fan into a balanced row; hold, exit upward |
| 07-chat-sim | AI Chat Sim (short, legacy) | V, 7 | grey user bubble pops, typing dots pulse, answer types per character with blinking cursor, action icons fade in; clean chat-app look |
| 08-prompt-bar | Prompt Bar (short, legacy) | V, 5 | glassy dark pill input slides up, phrase types with cursor, white round send button presses |
| 24-showreel-notify | Showreel Notify (short, legacy) | V, 5 | glowing silver headline drops in, dark phone rises centre, glass toast bounces on with red badge, huge silver year rises, phone floats |
| 02-three-step | Triple Sequence (long, legacy) | H, 7 | three metallic glass cards 01/02/03 stagger up with scale+fade, each with icon, title, text, metallic progress bar wipe; "mannequin grey", power4.out |
| 03-slide-showcase | Slide-In Showcase (long, legacy) | H, 5 | 1px metallic divider draws, eyebrow + big silver headline + subtitle slide from a mask, left-aligned, expo/power4 |
| 04-morph-panel | Morph Panel (long, legacy) | H, 6 | small obsidian button rises then morphs into a large panel; label fades as header and rows fade in; power4.inOut |
| 13-compare-bars | Compare Bars (data, legacy) | H, 5 | obsidian glass card with faint grid: dim grey 1x bar, then tall silver 10x bar with bloom, caption pill rises |
| 14-leaderboard | Model Leaderboard (data, legacy) | H, 5 | four ranked rows slide from left: rank, glowing obsidian icon tile, name, silver score fades in |
| 15-bar-3d | 3D Bar Hero (data, legacy) | H, 5 | three pseudo-3D bars with floor reflections grow, centre bar blooms, icon tile + silver headline ride in; back.out tile pop |
| 16-line-growth | Line Growth (data, legacy) | H, 5 | silver axes draw, faint gridlines, glowing silver curve draws left to right with soft fill, three marker tiles pop on |
| 17-integrations-grid | Integrations Grid (ui, legacy) | H, 5 | 3x2 obsidian glass cards pop one by one: glowing icon tile, app name, one-line text, "+" button |
| 19-phone-showcase | Phone Showcase (ui, legacy) | H, 5 | silver phone tilts in from 3D angle and settles, glint sweeps bezel, dark app UI rises, gentle idle rotation |
| 20-search-typing | Search Typing (ui, legacy) | H, 5 | silver wordmark, obsidian search pill slides up, query types with caret, two dark buttons fade in; power3.out |
| 21-connector-list | Connector List (ui, legacy) | H, 5 | obsidian rows slide from left (icon, name, text, chevron), cursor glides in, glass highlight snaps onto one row with glow pulse |
| 23-prompt-composer | Prompt Composer (ui, legacy) | H, 5 | obsidian composer card rises, prompt types with some words bold and some silver-highlighted, attachment chip pops, cursor presses send |
| 18-cta-click | Button Click (overlay, legacy) | H, 4 | obsidian CTA pill with silver label and faint focus ring settles; cursor presses: dip, spring back, ripple, ring pulse; expo.out in, back.out press |
| 22-kinetic-headline | Kinetic Headline (overlay, approved v3) | H, 4 | one word emphasised in a dimensional pill; side words on opposing shallow arcs; anticipation squash, one restrained overshoot, one sheen; readable hold |
| 26-null-manifesto | Null Manifesto (overlay, approved v2) | H, 5 | brand statement: mark + headline with masked type entrance, restrained orbit, one chrome glint, readable hold, alpha-safe exit (the source's own brand piece; reuse the structure only) |
| 01-cta-pill | Chrome CTA (overlay, legacy) | H, 4 | lower-third obsidian pill rises with silver label and subcopy; metallic glint near the end; expo.out |
| 06-notification | Notification Stack (overlay, legacy) | H, 5 | glass toasts (icon, title, subtitle, time) drop in and stack, each with back.out bounce; phone-OS style on dark glass |
| 12-blur-reveal | Blur Reveal (overlay, legacy) | H, 5 | dark glass plate with logo + wordmark drops in heavily blurred; light sweep, mark sharpens with soft glow bloom |

Counts: short 5, long 3, data 4, ui 5, overlay 6; approved 4, legacy 19. Only one entry has customizer fields
(05: visible count 1-4, entrance up/down/left/right, view angle front / three-quarter L/R / half-turn / full-turn,
split-from-hero on/off); the other 22 have `customizer: null`.

---

# Part C. 3Blue1Brown (`D:\code_files\resources to make content engine\github repos\videos\`)

Files read: `videos/CLAUDE.md`, `videos/custom_config.yml`, `videos/LICENSE.txt` (head), the opening scenes of
`_2025/laplace/main_equations.py`, and usage statistics (counts of animation types, run times, waits, lag ratios, font
sizes, strokes, opacity values, camera calls) over all of `_2026/cross_entropy/*.py` and `_2025/laplace/*.py`, plus
colour-constant counts in `_2026/hairy_ball`. Hex values come from the engine's own defaults in
`github repos/manim/manimlib/default_config.yml` and `constants.py` (3b1b/manim, **MIT**), not from the CC content.
The smooth rate function is from `manim/manimlib/utils/rate_functions.py` (MIT).

## Math Explainer (generic grammar distilled from 3b1b scenes)
- Source: `videos/` (rules only) + `manim/manimlib` (default values); licence: videos = CC BY-NC-SA 4.0 -> code, scenes,
  characters and branding **DO NOT USE**; this entry describes rules only, as asked. Engine defaults: MIT.
- One line: crisp vector maths on pure black, colour-coded variables, objects that transform into each other instead of cutting, everything easing smoothly with long holds to think.
- Suits: maths, physics, CS and ML explainers; any "build the idea step by step" video. 2D in Remotion (SVG + KaTeX/MathJax);
  3D surfaces and camera orbits in Blender or Three. No footage needed (screen inserts sit in a 16:9 frame on a dark grey plate).
### Palette
Base: pure black background. Each variable or concept gets one colour and keeps it all video (passed as a
text-to-colour map on every equation). Most used colours in the two recent projects: YELLOW, BLUE, GREEN, PINK, TEAL,
WHITE, RED, then GREY_B and darker/lighter shades.

| role | hex | where used |
|---|---|---|
| background | #000000 | every frame (`custom_config.yml`) |
| primary text / neutral strokes | #FFFFFF | equations, labels, axes lines |
| YELLOW (= yellow_c) | #FFFF00 | most-used highlight colour: emphasis boxes, the key variable, moving dots |
| BLUE (= blue_c) | #58C4DD | second variable, grid lines of planes (stroke 1) |
| TEAL (= teal_c) | #5CD0B3 | graphs (stroke 3), third variable |
| GREEN (= green_c) | #83C167 | variables, "correct"/positive |
| RED (= red_c) | #FC6255 | variables, "wrong"/negative |
| PINK | #D147BD | frequencies, accents |
| GOLD (= gold_c) | #F0AC5F | accents (less used) |
| PURPLE (= purple_c) | #9A72AC | accents (less used) |
| GREY_B / GREY_A | #BBBBBB / #DDDDDD | secondary labels |
| GREY (= grey_c) | #888888 | dimmed items |
| GREY_E | #222222 | full-screen backing plate behind inserted screens |

Each hue has five shades A (lightest) to E (darkest): blue #C7E9F1 / #9CDCEB / #58C4DD / #29ABCA / #1C758A; teal
#ACEAD7 / #76DDC0 / #5CD0B3 / #55C1A7 / #49A88F; green #C9E2AE / #A6CF8C / #83C167 / #77B05D / #699C52; yellow
#FFF1B6 / #FFEA94 / #FFFF00 / #F4D345 / #E8C11C; gold #F7C797 / #F9B775 / #F0AC5F / #E1A158 / #C78D46; red
#F7A1A3 / #FF8080 / #FC6255 / #E65A4C / #CF5044; maroon #ECABC1 / #EC92AB / #C55F73 / #A24D61 / #94424F; purple
#CAA3E8 / #B189C6 / #9A72AC / #715582 / #644172; grey #DDDDDD / #BBBBBB / #888888 / #444444 / #222222. Also orange
#FF862F, light pink #DC75CD. Gradients between two concept colours are interpolated in HSL (e.g. teal -> red over
three derivative orders).

The render step boosts saturation by 1.5 (`file_writer: saturation: 1.5`), so on-screen colours read stronger than these hex values.
### Typography
- Maths in LaTeX (Computer Modern look). Plain text: "CMU Serif" (not a Google Font; Computer Modern Unicode), centred.
  Equations are ~3x more common than plain text (Tex 869 vs Text 223 + TexText 72 calls).
- Sizes in Manim units (frame height 8 units; font_size 144 = 1 unit tall; default 48). Most used: 72 (titles and key
  equations), 30, 36, 60, 42, 90, 24; axis numbers ~20. Worked out: at size 72 a digit "0" is 0.5 units tall, i.e.
  1/16 of frame height (135px on 2160px; 120px on a 1920px-tall vertical frame).
- Emphasis: colour the term (never bold), box it, or dim everything else. Labels drawn over busy graphics get a black
  backstroke (width 5 most common; 3 and 8 also used) so they stay legible.
- Words on screen: an equation, a short label, or a one-line title at the top edge; sentences are rare.
### Layout
- 16:9, frame 8 units tall; spacing on a fixed scale: 0.1 / 0.25 / 0.5 / 1.0 units (small, med-small, med-large,
  large buff); 0.5 from frame edges; 0.25 between neighbours. Small buff is by far the most used.
- Place things relative to each other (arrange in rows/columns, next to, align to edge), not by raw coordinates.
- Title or the governing equation pinned to the top edge; the diagram fills the rest; axes often pushed to one edge.
### Elements
- Equations (built from tagged pieces so parts can be moved independently), axes and planes (grid lines in BLUE, stroke 1),
  complex plane, graphs (stroke 3), a faint "ghost" copy of the graph at 0.5 opacity behind the one being drawn,
  glowing dots (a solid dot plus a soft glow) for moving points, braces with labels, arrows and vectors, decimal
  counters bound to a tracker, surrounding rectangles (YELLOW, stroke 2, buff 0.05 or 0.1), underlines, dashed lines,
  16:9 screen rectangles for inserts on a #222222 plate.
### Motion
- Default animation 1 s with "smooth" easing: 10t^3 - 15t^4 + 6t^5 (zero velocity and acceleration at both ends).
  Remotion has no exact preset; `Easing.inOut(Easing.cubic)` is close but not identical (my note, not from the source).
- Run-time distribution in the two projects: 2 s (most common by far), 3 s, 1.5 s, 1 s, 5 s, 4 s, 6 s; long continuous
  moves 10-20 s; quick beats 0.3 s.
- Holds: `wait()` = 1 s is the default and the most common call (865 of ~1,300 waits); then 2 s, 3 s, 1 s, 0.5 s.
- Staggers: lag ratio 0.1 most common, then 0.2, 0.5, 0.25, 0.05, 0.01 (for many small parts).
- Move vocabulary, by frequency: fade in / fade out (often with a small shift), write (stroke-then-fill for text and
  equations), grouped simultaneous moves, transform-from-copy (a copy flies from the source to where it is used),
  show-creation (draw a line or graph along its length), lagged starts, replacement transform, fade-transform,
  move-to-target, grow arrow, transform matching tex (equation pieces slide to their new places), restore, flash-around /
  indicate for emphasis, change-decimal-to-value for counters.
- Dim to focus: non-focus items animate to opacity 0.2 (the most common value), or fade by 0.7-0.8, or fill 0.35; then
  restore to 1.
- Camera: continuous reorientation of the 3D frame (theta, phi, gamma, centre) for orbits; set-height for zooms; return
  to default state; slow updater-driven drift during long holds.
### Transitions and rhythm
- Inside a scene there are no cuts: new ideas arrive by transforming existing objects (continuity is the point).
- Scenes are short silent clips; pacing comes from run times and waits, and the voice is cut to them later (inferred:
  no narration timing in code).
- Rhythm: animate (~2 s) -> hold (~1 s) -> next step. Equation steps: transform matching pieces, then hold.
### Finish
- Pure black, crisp anti-aliased vectors, no grain, no texture, no vignette. Saturation x1.5 at render. Glow only on
  moving dots. 4K (3840x2160) at 30 fps.
### 3D look
- 3D axes, parametric surfaces and spheres, shown with a slow orbiting camera; specific shading values not taken.
### Banned
- Not stated as a list. Rules implied by the repo guidance: no bespoke coordinate maths for layout (use relative
  placement); keep a variable's colour consistent; build grouped objects declaratively. For our use: no characters, no
  logos or brand elements, no copied scene code (licence).
### Example frames
1. Black frame, one equation at the top with x(t) in teal, its derivatives shading towards red, the forcing frequency in pink.
2. Axes on the left, a teal cosine drawing itself left to right over a faint copy, a yellow glowing dot on the y-axis tracking its height.
3. An equation with all terms dimmed to 0.35 except one, which is boxed in yellow.
4. A 3D surface over a blue grid, camera slowly orbiting.
### Gaps
- Native frame is 16:9; vertical 9:16 would be 8 units tall by 4.5 wide, so layouts need re-stacking (not addressed in
  the source). CMU Serif is not a Google Font. No audio or narration rules in code.

---

# Part D. Web sources (read 2026-10-31)

## D1. Claude Code Club, "Three Levels Of Motion Graphics With Claude Design"
URL: https://www.claudecodeclub.ai/free-resources/claude-design-motion-graphics (free article, no login; "Updated
October 2026"; no byline, footer links author pages for two people). **Paywalled**: the installable motion-graphics
skill, "the exact prompts behind it", and the full motion-system file with its values (Claude Code Club on Skool,
$9/month). No licence stated for the article: describe only.

### The Level 2 "motion design system" method (as published)
1. Find one rich reference (they used Pinterest, search "motion graphics"): several element types, several
   transitions, text animation and a clear rhythm. "A thin reference video produces a thin system." Use it as a
   target, not something to copy.
2. Give the model the link and one instruction: make a motion design system from it. It studies the video frame by
   frame and writes the rules as one reusable file, plus runnable demos (theirs: a grid animation, a landing element
   that overshoots and settles, a shuffle move, animated type, shape transitions).
3. Review before generating: open the system, **watch the demos**, change any rule you disagree with (people "read
   the system file, nod, and never open the examples").
4. Save it somewhere permanent and point every later sequence at it.
5. Their measured result: layout, composition, colour and type animation good; dynamism and transition variety "soft",
   pacing "average", because the rules covered element behaviour, not sequence rhythm.
- The motion design sheet it produced also held "a full colour palette", "the type treatment", small camera-angle
  mockups and animated shot previews, at no generation cost. No values published.

## Scatter and Settle (Claude Code Club example system)
- Source: the article above; licence: not stated; the 8-rule file itself is paywalled (5 rules shown, 3 hidden, no values)
- One line: elements fly in fast, overshoot their mark and settle back; type arrives a letter at a time; scene changes reuse a few named moves.
- Suits: product and brand motion graphics, social explainers. 2D; no footage needed.
### Palette
- not given (the system had "a full colour palette"; values not published).
### Typography
- Text animates one letter at a time, "not as a block". Faces, sizes: not given.
### Layout
- not given (demos included a grid animation).
### Elements
- not given beyond "multiple element types" and shapes.
### Motion
- Elements "arrive, they don't fade": fast entry, overshoot the mark, settle back. Curves "written out" in the file
  (values not shown). Demos: overshoot-and-settle landing, shuffle move, shape transitions.
### Transitions and rhythm
- Scene transitions are named and typed so the same move repeats instead of being reinvented per cut. Pacing was
  weak until pacing and transition-variety rules were added.
### Finish
- not given.
### 3D look
- none.
### Banned
- Fade-in arrivals (implied by "arrive, they don't fade").
### Example frames
1. A grid of tiles scattering in from off-frame, each overshooting its cell and settling.
### Gaps
- No numbers at all; three of eight rules hidden behind the paywall.

### Level 3 notes (generative video; useful for planning only)
- Brief = premise + asset list + look pulled from the motion system + a second-by-second timestamped beat sheet.
- Optional 12-panel storyboard as one image before the video; storyboard when someone must approve or the sequence has
  more than a few beats.
- On-screen person: a character sheet from a few photos in on-camera clothes, passed to every generation.
- One continuous 22 s generation vs 8 stitched shots (stitching = per-beat control; one take = continuity).
- Camera asked for: "slow push-ins and slight orbits".
- Packaged skill = 5 elements: path to the system file; beat structure (length, what the first and last beat do); a
  scope fence (produce the sequence and stop); the generation path (board first or straight to video, which models);
  the character sheet if a person appears.

### Failure modes listed
1. Misspelt words inside generated video ("gulp"): put critical text on top as editable type.
2. Existing design files get read and blended in: say "start from scratch" and name the assets to ignore.
3. Thin reference -> thin system: pick one with several transitions, behaviours and text animation.
4. System written but never applied: watch the thinking; confirm the folder was read before the prompt is written.
5. Flat pacing: add pacing and transition variety as explicit rules.
6. "Iteration contamination": later runs copy earlier attempts: tell it to ignore earlier iterations.

## D2. AI x Leaders prompt library (https://ai-x-leaders.com/en/prompt/) and the GitHub list

### AI x Leaders: 28 entries checked one by one (detail pages `/en/prompt/video/<id>/`)
- **One-liners or short briefs with no look (skipped, 24):** lime-and-black showreel (17 words), turbofan (12),
  17-styles story (11; the 17 style names are from the page, not the prompt), Tokyo Highway rules (19, "no text"),
  farm-to-glass Blender (8, Turkish), F1 pit stop Three.js (~20), paper airplane (8), dot-to-world (17), human
  progress (18), Japan chronology (Japanese, 30 s), Hermes Fleet (20), Friday weekday (Japanese, 30 s), Human flaws
  (12, no words), Uptimepage Three.js (21, "not too fast"), launch prompt (8), AI without words (10), self-portraits
  (12), promo for X (Chinese, ~10), TypingMind logo reveal (18), 15 s reel (9), poster breaks frame (11), Opus
  introduces itself (17), agency showreel (23), muda inference launch (15).
- **Look-defining (written up below):** #21 "tessel" = the **Cinetic** skill bundle (MIT); #27 "AI workspace launch" =
  Moritz Kremb's launch-video recipe (MIT).
- **Parts only (thin look):** #17 and #18, Bilal Demirer's two HyperFrames recipes (MIT, 2026): see Part E.

## Cinetic Clean Launch (the "tessel" bundle)
- Source: https://ai-x-leaders.com/en/prompt/video/revid-2104148233106723099/ (bundle of ~29 docs; I read the first
  200,000 of 712,445 characters: SKILL.md, the Tessel worked example, README, setup, treatment template, critic prompts)
  plus `references/transitions.md` fetched from https://github.com/Leonxlnx/cinetic at commit bee5d78; licence: **MIT**
  (SKILL.md frontmatter and repo LICENSE)
- One line: Swiss-clean product launch film: near-black ink on white, one red accent that means "now", a single story device that never leaves the frame, every move on a 120 BPM grid with measured holds.
- Suits: product launches, teasers, feature videos, logo stings, UI walkthroughs. 2D (Remotion 4.0.529 or HyperFrames);
  real product UI rebuilt in code; no footage, no 3D. Built for 16:9 at 60 fps; 9:16 and 1:1 re-layouts described.
### Palette (Tessel worked example; the method says pick one accent per brand)
| role | hex | where used |
|---|---|---|
| ink | #0B0B0C | type, dark surfaces |
| paper | #FFFFFF | background |
| mist | #F4F5F7 | secondary surfaces |
| line | #E3E4E8 | hairlines, borders |
| mute | #8A8D96 | descriptors, secondary text |
| accent red | #EC2A3A | only for "now" / "just happened"; <= 8% of pixels; floods the frame at most once |
- Rules: one accent from red, green, teal, blue or yellow, with a stated reason; neutrals cool, never warm; new elements
  arrive in the accent and relax to neutral over 10-30 f; gradients shipped as dithered PNGs.
- Shadows `0 20-40px 60-120px rgba(0,0,0,.12-.22)`; dark surfaces get a 1px top hairline at 8-12% white.
### Typography
- Tessel: Geist + Geist Mono, local variable fonts, tabular figures (Geist is on Google Fonts as far as I know; verify).
  Headline 128px / 600 / -0.05em; wordmark 190px / 620 / -0.055em; feature lines 120px / 600; descriptor 44px / 460
  grey; payoff 176px / 600; statement leading 0.95-1.05.
- General: one clean modern sans in 2 weights + optional mono; statements 88-128px; emphasis inside a line 1.5-1.7x;
  a standalone hero word 2-5x or 14-48% of frame height; secondary 44-56px; UI >= 22px after camera scale (32px in
  vertical); one tracking value per role.
- Copy: <= 5 words per line, <= 2 lines per shot, one line at a time; launch film <= 20-35 words total; open inside the
  problem; pay off the film's own words; no stock phrases ("seamless", "unlock", "AI-powered", "streamline"); never a
  feature name as a headline.
- Blur text only on entry (statements 6-8px -> 0, body 4-6px), sharp within 6 f.
### Layout
- Safe margins 96px sides, 64px top/bottom, >= 24px headroom; overscan moving layers 5-8%.
- Hero covers 40-70% of frame; no empty region over ~1/4 of frame; product windows centred at 70-92% of width.
- 9:16: content mass in the band y 270-1500 (of 1920). Lockup spans 28-45% of frame width.
- Avoid "text left, UI card right" and small floating cards under ~40% of frame width.
### Elements
- One story device (an owned object; Tessel's is a red "now-dot") that travels through every shot and never blinks out.
- Mark from three primitives on a 100-unit grid (tall block, square block, red dot), 8-unit gaps, 13-unit corner
  radius, one fully rounded corner; must read at 16px.
- Every element names its job; grain absent or global at 1.5-2%.
### Motion
- Cubic-bezier tokens: out (.16,1,.3,1) arrivals; outSoft (.22,1,.36,1); in (.7,0,.84,0) implosions; exit
  (.55,.055,.675,.19) exits into a cut; inOut (.87,0,.13,1) whips/slides; smooth (.65,0,.35,1) drifts and 10-14 f fades;
  ui (.4,0,.2,1); cam (.48,.1,0,.9); glide (.47,.2,.15,1); rest (.45,0,.1,1); contact (.55,0,.9,.55) impacts; whip
  (.6,0,.15,1); dolly (.35,0,.65,1). A film uses ~3 easing characters; linear only for drift.
- Springs (damping / stiffness / mass): snap 18/260/0.7; pop 11/180/0.6 (landings only); soft 26/120/1; heavy 30/90/1.4.
  Damping >= 2*sqrt(stiffness*mass). Overshoot 1-7% only on true landings, at most 2 per film.
- Duration = 0.35 s + 1.35 ms per px travelled; camera moves clamped 0.6-2.4 s; slowest move >= 3x the fastest.
- Shape settles 6 f before position; secondary moves start at 55-75% of the leading move; punches use hitPulse(attack 2, tau 5).
- Speeds (60 fps): text being read <= ~3 px/f; camera cruise under text 1.5-3 px/f; travelling labels < ~20 px/f;
  ceiling ~60-80 px/f (frame-filling edges may peak 150-300 px/f for a few frames); motion blur required above 12 px/f.
- Camera: "cam" curve (slow start, peak ~27%, long settle); zoom in log space; push 2-5x on story moments; wide shot of
  readable UI <= ~1.7 s; whoosh 100-450 ms before a camera apex (~2 per film); the last third keeps moving; a lockup
  hold over ~1.3 s keeps building (creep <= 6% or a 10-20% push).
### Transitions and rhythm
- Grid at 60 fps: 90 BPM = 40 f, 100 = 36, 120 = 30, 144 = 25, 150 = 24 per beat. Section changes on downbeats, cuts
  on 8ths, batched landings on 16ths with 0-3 f spread; picture change starts at cue -1; pulses peak 2 f after their sound.
- Holds: resolved text holds >= 36 f + 6 f per word; unresolved text never exits. Nothing static over 48 f except a
  freeze <= 15 f on silence and one near-still hold of 60-96 f per film.
- Density: 45-60 events per 30 s; one motion peak per bar; 30-70 f calm between peaks; first 6 s twice as dense as the
  middle. Biggest peak at 75-90% of runtime; a designed 1-4 s lull at 55-85%.
- Shots: median 60-90 f, min 24 f (no text), max 180 f in cut-driven films; continuous takes 300-560 f with an in-shot
  beat at least every 72 f.
- Hook: frame 0 composed and moving; something changes ~every 0.5 s; problem felt by 1 s, stated by 2 s; product named by ~25% of runtime.
- Acts: hook -> turn -> proof (1-2 capabilities) -> promise -> lockup. End card 1.5-2.5 s (lockup assembles over 60-80 f,
  holds 36-80 f); URL readable >= 1.7 s; logo time <= ~12% of runtime; lockup only once, at the end.
- Transitions: 6-8 types per film, each <= 2 uses, plus one signature move from the mark used 3 times (open, middle,
  close). Crossfade never the default and never through black. Full seam catalogue in Part E.
- Formats: launch film 20-45 s, 60 fps, 120 BPM, 8-10 beats per 30 s, <= 20-35 words; product/feature 8-30 s, 100-120
  BPM, 1 beat per 8-10 s, <= 15 words; feature loop 4-15 s whole bars, <= 8 words, reads muted (GIF 25 fps); logo sting
  3-8 s, 2-4 beats, name + <= 4 words; UI walkthrough 20-90 s, 90-110 BPM, <= 6 words per caption. "24 fps is never right for UI."
- Tessel example: 1920x1080, 60 fps, 33 s (1,980 f), 120 BPM (beat 30 f, bar 120 f). Acts fit 0-6 s, mark 6-10, prompt
  10-14, plan 14-18, feature 18-24, end 24-33. Iris opens on the dot at 80x (2,240px) at f0; headline slam f240;
  implosion f330-360; typing f660-780; shutter f840; pull-back f1440-1680; lockup f1740; URL f1800.
### Finish
- 60 fps, H.264 yuv420p BT.709; no glow, halo or bloom; grain off or global 1.5-2%.
- Sound: every sound caused by something visible; the idea reads with sound off. -14 LUFS +/-0.5 (-16 for stings),
  true peak <= -1 dBTP, LRA 5-8 LU for films >= 20 s; whooshes ~2 per film; SFX >= +6 dB over music in their band.
- Review: measured checks (frame forensics for pops, stalls, dead holds, ghost frames, banding; A/V sync <= 48 samples)
  plus critic lenses (director, forensics, sound/sync, art/copy/UI) with P0-P2 severities; ship when an 11-dimension
  rubric averages >= 4.2 with Finish and Sync at 5.
### 3D look
- none.
### Banned
- Eyebrow/kicker labels, stacked taglines, "Introducing...", text walls, filler, decorative mono captions, fake metrics.
- Serif type; italic or faked oblique.
- Orange, amber, beige, cream, tan or sand as accent/paper/glow; neon, glows, bloom, halos; purple, violet, indigo;
  purple-to-blue or multi-hue gradients; glassmorphism.
- Emoji, stock icons, AI sparkles, particles, confetti, lens flares, code rain; bouncy overshoot except on landings.
- Transition presets: glitch/RGB split, light leak, film burn, swirl, ripple, dreamy zoom, flash through white, page burn.
- (A user-supplied brand element that breaks a ban wins, and is recorded.)
### Example frames
1. White frame, one red dot iris-opening from huge to small at frame 0.
2. Ink headline at 128px slamming in on a downbeat, the red dot sitting at the end of the line.
3. Product window centred at ~80% width, camera pushed 3x into the one interaction that matters.
4. Lockup of three block primitives + wordmark at ~35% width, held while creeping 4%.
### Gaps
- Built for 60 fps: at our 24-30 fps all frame counts halve (or less) and the speed limits must be re-derived. The bans
  are style-specific (they contradict Divine Void and Neural HUD), not universal. Rest of the 712k-character bundle (a
  273-entry technique library) not read.

## Paper Launch (Moritz Kremb's launch-video recipe)
- Source: https://ai-x-leaders.com/en/prompt/video/revid-2103066071838466494/ (7-document "reproduction recipe":
  playbook + assets, story, shots, music, HyperFrames notes, a practice piece); licence: **MIT**, (c) 2026 Moritz Kremb
- One line: warm off-white page, near-black ink, one blue accent, real product UI in floating hairline windows tilting in on expo.out, cut hard on a 120 BPM downbeat.
- Suits: SaaS/app launch videos 20-60 s, feature promos. 2D; needs real product screen recordings (1440x900 logical,
  2x capture) or rebuilt UI; no 3D.
### Palette (the practice piece recreates a real brand's palette: use as a reference for structure only)
| role | hex | where used |
|---|---|---|
| ground | #F7F6F3 | warm off-white background |
| ink | #191918 | type |
| accent | #0075DE | the only accent |
| dark register | not given | only for the hook and the use-case roll |
### Typography
- Practice piece: the brand's own sans for display (proprietary), at most one serif-italic word per frame (commercial
  face), mono for kickers (iA Writer Mono; open-licensed, not on Google Fonts). Open substitute for the sans: Inter
  (Google) — my note, not the source's.
- Headlines 1-7 words, >= 64px at 1080p; hierarchy ~3:1 size ratio, weight 700 vs 500.
### Layout
- 1920x1080 default (9:16 or 1:1 on request); 96px side margins at 1080p; keep content in the top ~85% when captions
  sit at the bottom.
### Elements
- Product windows: radius 12-20px, 1-2px hairline border, optional chrome of three hairline dots only (no full browser).
### Motion
- Arrivals expo.out 0.5-0.7 s; settles power3.out; exits power2.in 0.3 s.
- Product window entry: rotateX 18-30deg -> 0, y +80..+300 -> 0, scale 0.94 -> 1, blur 8px -> 0, expo.out over
  0.8-1.5 s; shadow deepens on landing. Camera zoom inside windows max 2.4x on 2x captures.
- Blur peaks 10px for text, 18-20px for full-frame surfaces; word waterfall stagger ~0.02 s per word; held-frame jitter <= 2px.
### Transitions and rhythm
- Zoom-through: outgoing 1 -> 1.2 scale, blur to 10px, opacity to 0.15 over 0.2 s power3.in; incoming 0.75 -> 1 over
  0.5 s expo.out. Inverse zoom: outgoing to 0.8, incoming 1.25 -> 1. "Cut the curve": 230px horizontal move,
  power4.in out / power4.out in. Default: hard cut on the downbeat.
- 110-128 BPM, 120 default (beat 0.5 s, bar 2 s). Hook 3-4 s; end card >= 1.5 s; music fades over 1-2 s.
- Length 20-60 s (X feed 30-45 s, Reels <= 30 s). Practice timeline: hook 0-4 (slam drops on beats, implode to a dot),
  brand 4-8 (drop at 4.0), hero 8-14, capture 14-20, answers 20-26, agents 26-32, use cases 32-36 (breakdown + riser),
  proof 36-42 (drop at 36.0), CTA 42-46 (final hit at 42.0).
### Finish
- Clean, no grain stated. Music-only by default; voice-over ducks music 6-9 dB.
### 3D look
- none (CSS perspective tilts only).
### Banned
- Browser chrome, real OS cursors, scrollbars, notification badges, bokeh; purple AI gradients, neon, glassmorphism,
  generic stock shapes; bounce (one deliberate pop allowed), screensaver float, breathing, drifting cameras; showing
  the whole frame at once; invented numbers; em dashes in copy; CSS animations, randomness, infinite loops.
### Example frames
1. Off-white field, a 3-word ink headline slammed on the beat.
2. A product window tilted back 24deg rising into place with a deepening shadow.
### Gaps
- Fps not given. The example palette and type are a real brand's: design our own before use.

### GitHub list: X-RayLuan/awesome-opus-5-5-video-prompts
- 84 entries checked (README index + detail sections). Repo MIT covers only the maintainers' docs and tooling;
  `RIGHTS.md`: "Creators retain all rights to their media, prompts, music, and code." So: describe looks, copy nothing.
  Many entries are "prompt not shared" or one-liners; every entry carries the maintainer's sponsored remake link.
- Look-defining entries written up below: #57, #77, #21 + #22 (merged), #8, #48. Partial looks noted under Part E:
  #72, #2, #39. Others: not shared, one-liner, or no visual spec.

## Cream Paper Cosmos (GitHub #57, procedural short)
- Source: awesome-opus-5-5-video-prompts entry 57 (Chinese prompt by @leo_xiaolei); licence: creator retains rights
  (describe only)
- One line: a warm cream paper world where a squashy orange character travels through neurons, a prism, a sunflower and a galaxy, each object morphing into the next.
- Suits: playful science/AI shorts, brand stories. 2D (Canvas; Three.js only where needed); no footage.
### Palette
| role | hex | where used |
|---|---|---|
| background | #F2E8CF | warm cream (given as an example value) |
| dark scenes | not given | deep sea blue, dark purple, near-black night blue (words) |
| accents | not given | orange, sunflower yellow, violet, cyan, magenta, coral red; gradients sparing |
| black hole | not given | pure black core, orange-gold inner disc, purple-blue outer glow |
### Typography
- not given.
### Layout
- 1920x1080, 16:9, 30 fps, 25-30 s.
### Elements
- Rounded-rectangle orange creature; neurons; prism; colour geometry; sunflower; log-spiral galaxy of thousands of
  seeded particles; black hole; tunnel; vector-stylised Earth (no photos).
### Motion
- Squash and stretch, easing and secondary motion on the character. Timeline: 0-4 s character; 4-7.5 neurons; 7.5-10
  prism; 10-13.5 colour geometry -> sunflower; 13.5-17 sunflower -> galaxy; 17-20.5 galaxy -> black hole; 20.5-23.5
  tunnel; 23.5-27 Earth rise; 27-30 return.
### Transitions and rhythm
- Morphs, particles, scale, camera pushes, radial and object-to-object transitions; no crossfades. ~3.5 s per beat.
### Finish
- Procedural paper grain and noise; no large photo textures.
### 3D look
- none required.
### Banned
- SaaS icon style, UI elements, photorealism, cyberpunk, excess neon, generic AI gradients, stock-library feel, hyperspace effects.
### Example frames
1. Cream paper field, orange creature mid-squash, a sunflower unfolding from flat colour geometry behind it.
### Gaps
- Only one hex value; no type; accents named not specified.

## Halftone Collage Zoom (GitHub #77, vintage collage infinite zoom)
- Source: awesome-opus-5-5-video-prompts entry 77 (@koldo2k; generative stack via an image/video-model MCP);
  licence: creator retains rights (describe only)
- One line: an endless zoom through black-and-white newspaper-halftone cut-outs with white borders, animated on twos, flickering like old print.
- Suits: music loops, essay intros, history or nostalgia pieces. 2D; can be built from cut-out stills in Remotion
  (source used generated images and video; keyed elements shot on green).
### Palette
| role | hex | where used |
|---|---|---|
| cut-outs | not given | black-and-white newspaper halftone |
| borders | not given | white borders around each cut-out |
| key colour | #00B140 | green screen behind elements to be keyed (production only) |
### Typography
- not given.
### Layout
- 1920x1080, 30 fps, 20 s seamless loop; collage landscapes in depth layers.
### Elements
- Halftone cut-outs with white borders and soft shadows; realistic collage landscapes; a man and a whale (keyed).
### Motion
- Constant-speed exponential zoom. Parallax: layer scale = camera^Z, Z from 0.45 to 1.22. Cut-outs animate on twos (15 fps inside a 30 fps file).
### Transitions and rhythm
- One continuous zoom loop; music 96 BPM, 8 bars = 20 s.
### Finish
- Film grain, vignette, flicker. MP4 under 30 MB.
### 3D look
- none (2.5D layers).
### Banned
- not given.
### Example frames
1. A halftone whale cut-out with a white border and soft drop shadow, half-way through the zoom into a collage valley.
### Gaps
- No grain/flicker amounts, no type.

## Integer Pixel Arcade (GitHub #21 pixel wizard + #22 rainbow runner)
- Source: awesome-opus-5-5-video-prompts entries 21 (Majid Manzarpour) and 22 (Rikuo, Japanese); licence: creators retain rights (describe only)
- One line: crisp low-resolution pixel art scaled by whole numbers, a small fixed palette, chunky 8-12 fps poses on a smooth 60 Hz world.
- Suits: game-themed shorts, retro intros, playful explainers. 2D (Canvas or Remotion with image-rendering pixelated); no footage.
### Palette
| role | hex | where used |
|---|---|---|
| fixed palette size | not given | ~24 colours (#21) / ~32 colours (#22) |
| sky | not given | deep blue/purple (#21) |
| character body | #CD7B5E | orange body (#22, "near"), with a highlight and a shadow shade |
| floor | not given | 7-colour rainbow in 1-2px bands, wavy (#22) |
| warning | not given | magenta, 0.5 s before a beam (#22) |
### Typography
- not given (pixel fonts implied, not named).
### Layout
- Logical canvas 128x96 (#21) or 160x90 (#22), scaled by the largest whole number that fits, centred, black letterbox; smoothing off.
### Elements
- Sprites ~24x32px (wizard) and 12x8px (runner); pooled particles; 1px gem rim light; meteors in 3 sizes; beams; after-images on dash.
### Motion
- Fixed 60 Hz update, poses quantised to 8-12 fps; 4-frame run cycle; states idle -> charge -> cast -> recover; jump,
  double jump, slide, dash. Hit-stop 3-4 frames; ~0.3 s slow motion; damped camera follow with integer offsets;
  3-layer parallax.
### Transitions and rhythm
- Scripted, looping attack patterns; a BOOST/WARP flash makes the loop seamless.
### Finish
- Hard pixels: no anti-aliasing, no gradients, no shadow blur.
### 3D look
- none.
### Banned
- External assets, libraries, network; anti-aliasing; gradients; shadowBlur; sub-pixel positions; rotation; zoom;
  random numbers in screen shake; per-frame allocation.
### Example frames
1. 160x90 scene scaled 12x: a tiny orange runner on a wavy rainbow floor, a magenta warning stripe flashing ahead.
### Gaps
- Palettes counted, not listed; no type.

## Code-Drawn Documentary (GitHub #8, AI history film)
- Source: awesome-opus-5-5-video-prompts entry 8 (by "Chubby"; Remotion); licence: creator retains rights (describe only)
- One line: a dark, near-wordless documentary drawn entirely in code, one warm accent that shifts era by era, transitions grown out of the content.
- Suits: history and timeline explainers, long-form (3 min) essays. 2D Remotion; no footage or stock.
### Palette
- Deep dark background + one warm accent that evolves by era. Hex: not given.
### Typography
- One display font + one mono font (mono for "model output"); Google Fonts allowed. <= ~8 words on screen; each text up >= 2.5 s.
### Layout
- 1920x1080, 30 fps, 180 s (5,400 frames), one composition per scene in a master composition.
### Elements
- SVG, Canvas, CSS and code particles; real paper snippets, small UI details, plausible model outputs; chat bubble, user counter.
### Motion
- Springs and easing, never linear. Camera pulls back on the "scaling" beat; zooms through a node between scenes.
### Transitions and rhythm
- Transitions grow from content (a web morphs, the camera flies through a node), never generic fades. Nine beats of
  15-25 s each (cold open 0:00-0:15 ... title card 2:50-3:00).
### Finish
- not given.
### 3D look
- none.
### Banned
- Linear motion, generic fades, slideshow or timeline-infographic feel, external images, unverified facts (list them in notes instead).
### Example frames
1. Darkness, scattered words lighting one by one in sequence, a single warm accent on the newest word.
### Gaps
- No hex, no faces named, no timing numbers below the beat level.

## One-Camera Desktop Teaser (GitHub #48)
- Source: awesome-opus-5-5-video-prompts entry 48 (Jake Moran; HyperFrames); licence: creator retains rights (describe only)
- One line: one unbroken, unhurried camera flying over a single desktop, lowercase copy, one orange wipe, light grain.
- Suits: app/tool teasers, "problem -> product" reveals. 2D with rebuilt UI (do not recreate real third-party apps).
### Palette
- One orange accent (a text colour wipe). Others: not given.
### Typography
- All on-screen copy lowercase; opening line enters word by word, holds ~1 s, then scales into place.
### Layout
- Landscape, ~27 s; the whole film is one desktop.
### Elements
- Windows piling in from behind the camera; a fast-spinning list of 30 items landing slowly on one; a pop-in question
  mark 0.2 s after; an oversized cursor; a closing checklist with rings and ticks drawing on.
### Motion
- Pushes, pulls and pans of 1.5-3 s on gentle ease-in-out, about half the default speed; motion blur on fast moves.
### Transitions and rhythm
- No hard cuts at all; every change is a camera move.
### Finish
- Light film grain. No audio.
### 3D look
- none (2.5D camera).
### Banned
- Hard cuts, snappy motion, audio.
### Example frames
1. Camera pulling back as a dozen app windows tumble in from behind it onto one desktop.
### Gaps
- Only one colour; no type face; relies on recreated real apps (avoid).

## D3. Promptcat, Animation use cases (https://promptcat.org/use-cases/animation/)
- 161 animation examples (cards dated 2026-09-22 to 09-27). **No entry with a specific, real look was found.**
- Provenance: the MiaAI Lab "100 HTML" cards checked (Sumi, Aurora Glass, Aquarelle) carry "Editorial reference
  template. This is not a verified transcript of the creator's prompt and has not been verified to reproduce the
  displayed result." Their template text names the categories (palette, composition, motion rules, timing, one
  reveal) but gives no values. The After Effects card carries the same disclaimer. The Tasher and ajith_io briefs and
  the OpenVGLab SVG card say "Original prompt wording has not been verified"; their "Adapt this example" sections are
  site-written. Video cards have generic descriptions only. No licences stated.
- General guidance (site's own, see Taste rules): interface motion = states, easing, loop behaviour, export format
  (SVG/Lottie); rendered film = duration, aspect ratio, shot order, typography, audio; describe opening state, key
  transition, final hold; give text reading time; keep key elements in frame; say whether a loop must join seamlessly;
  review the real render for overlaps, abrupt cuts, missing frames, unreadable text; honour reduced motion; start sound
  after user interaction (browser).

---

## Taste rules

General rules that apply whatever the style. Paths are relative to the source roots given in Parts A-D. Where two
sources disagree, both are given and marked **conflict**.

### Direction and coherence
1. **Decide the look before the first render or generation; judge it again at the end.** Source: ECC `taste/SKILL.md` (thesis 1, principle 7).
2. **One look across all shots.** Pick one primary style family and at most one accent family; never more per section. Source: `taste/SKILL.md`, `genre-taxonomy.md`.
3. **One accent colour per shot, with one meaning.** Cinetic adds numbers: <= 8% of pixels, floods the frame at most once. Sources: `taste/SKILL.md`; Cinetic SKILL.md (law 3).
4. **Every element and every move must have a job** (guide attention, show state, or keep spatial continuity); otherwise remove it. "When in doubt, remove." Sources: ECC `motion-foundations`; Cinetic quality bar.
5. **Generate or draft many, keep few:** 6-10 per preset, keep 2-3 (throw away ~80%). Source: `taste/SKILL.md`.
6. **Use a rich reference and watch the extracted system's demos, not just its rules.** A thin reference gives a thin system. Source: Claude Code Club (Level 2, failure mode 3).
7. **Element rules are not enough: write pacing and transition-variety rules explicitly.** Source: Claude Code Club (Level 2 result, failure mode 5).
8. **Start from scratch: tell the model to ignore old design files and earlier iterations.** Source: Claude Code Club failure modes 2 and 6.
9. **Approve the cheap sheets (palette, type, shot list, camera) and the written prompt before any paid render.** Source: Claude Code Club.
10. **Storyboard first; render 3-4 stills per scene and review before the full render.** Source: GitHub list #8; similar in Cinetic workflow.

### Colour and finish
11. **Colour comes from the grade, not from prompt words.** Generation prompts carry zero colour language ("Colour: none. Render neutral. Grading is applied afterwards."). Source: ECC `taste-distillation`, `taste-application`.
12. **Keep content (what happens) and look (how it looks) in separate fields.** Merging leaks style words into the scene and vice versa. Source: `taste-application`; `tasteforge/interview.py`.
13. **Write local, checkable rules, not adjectives** ("backgrounds pure black and unlit" works; "extreme contrast" does not). Ban hedge words (varied, mixed, dynamic, some, often, neutral, or) in any spec. Source: `taste-application`; `taste-distillation`.
14. **Protect the blacks:** track the share of frame below L\*10 against the reference; a grade can hit average colour and contrast while lifting blacks to grey. Source: `taste-distillation`.
15. **A colour cast often lives in one luminance band; never apply a global tint when the identity is in the shadows or mids.** Source: `taste-distillation`; flashethereal handoff.
16. **Grain: Overlay blend, not Screen; clean generated or vector frames graded towards a grainy reference still look wrong without it.** Cinetic: grain off or global at 1.5-2%. Sources: ECC HANDOFF-TEMPLATE.md; Cinetic.
17. **Overlay plates are elements, not washes:** crop each to its own bounding box; diffuse ones (< 10% cover) full-frame at low opacity, concentrated ones at 35-70% of frame width; vary scale, position and rotation per shot from a seeded RNG (one mark in one spot reads as a watermark). Source: `taste-application`.
18. **Crop the chrome:** no status bars, like buttons, counters or captions from borrowed footage; scale to cover, never pad. No mixed aspect ratios. Source: `taste/SKILL.md`, `taste-application`.
19. **3D props that sit in graded footage: black world, transparent film, key + rim (no fill), rim colour taken from the grade, Standard view transform, no grading in Blender.** Source: `taste-application`, HANDOFF-TEMPLATE.md.
20. **One glint or sheen per shot, late in the shot; no decorative glow spam.** **Conflict:** Cinetic bans glow, bloom and halos outright. Sources: NullMotion catalog prompts; Cinetic bans.

### Type and words
21. **Real marks and logos stay undistorted and untouched; if a required real asset is missing, stop rather than invent one.** Source: NullMotion catalog prompts; hosted "strict asset mode" (02 summary).
22. **Never trust text rendered by an image/video model; set critical words as live type on top.** Source: Claude Code Club failure mode 1.
23. **Few words:** <= 5 words per line, <= 2 lines per shot, one line at a time (Cinetic); <= ~8 words on screen (GitHub #8); launch film <= 20-35 words total. Sources: Cinetic; GitHub list #8.
24. **Reading time:** resolved text holds >= 36 f + 6 f per word at 60 fps (= 0.6 s + 0.1 s/word); text that has not resolved never leaves. GitHub #8: every text >= 2.5 s. Sources: Cinetic; GitHub #8.
25. **Type scale (1080p):** statements 88-128px, secondary 44-56px, UI >= 22px (>= 32px in vertical); hierarchy ~3:1 at weights 700/500 (Kremb). Sources: Cinetic; Kremb recipe.
26. **Emphasise by colour, a box, or dimming the rest, not by adding styles.** Dim non-focus items to opacity 0.2. Source: 3b1b scene statistics.
27. **Labels over busy graphics get a dark backstroke** (5 units most common) to stay legible. Source: 3b1b scenes.
28. **Density limits:** title = 1 heading + 1 subtitle; content = 1 heading + 4-6 bullets; <= 6 cards; <= 8-10 code lines. Too much: split, never shrink below readable. Source: ECC `frontend-slides`.
29. **Avoid default-looking type and colour:** purple-on-white gradients; Inter/Roboto/Arial as the voice unless chosen on purpose. **Conflict:** NullMotion's house look uses Inter throughout. Sources: `frontend-slides`; Cinetic ("avoid UI default families unless chosen on purpose").
30. **Typewriter text by slicing the string, not per-letter opacity** (Remotion example: 2 frames per character, cursor blink every 16 frames, 1 s pause after the first sentence). Source: ECC `remotion-video-creation/rules/text-animations.md` + asset.
31. **Captions: switch pages every ~1200 ms and highlight the word being spoken;** Bilal's recipe groups 3-6 words in the lower third. Sources: ECC `display-captions.md`; AI x Leaders #17.

### Motion
32. **All motion is driven by the frame number** (no CSS transitions or animations, no self-animating shaders or `useFrame` in Remotion). Source: ECC `remotion-video-creation/rules/animations.md`, `3d.md`.
33. **Use named tokens, never ad-hoc numbers.** ECC web set: durations 0.08 / 0.18 / 0.35 / 0.6 / 1.0 s; easings smooth [0.22,1,0.36,1], sharp [0.4,0,0.2,1], bounce [0.34,1.56,0.64,1]; distances 4/8/16/24/48px; scales 0.98 / 0.95 / 1.04. Cinetic: ~3 easing characters per film; linear only for drift. Sources: `motion-foundations`; Cinetic.
34. **Spring presets (Remotion):** default mass 1 / damping 10 / stiffness 100 (bounces); smooth {damping 200}; snappy {damping 20, stiffness 200}; bouncy {damping 8}; heavy {damping 15, stiffness 80, mass 2}. Source: ECC `remotion-video-creation/rules/timing.md`.
35. **Overshoot only where something truly lands:** 1-7%, at most 2 per film (Cinetic); Kremb: bounce only once, deliberately. **Conflict:** Scatter and Settle overshoots every arrival; NullMotion uses back.out on most pops. Sources: Cinetic; Kremb; Claude Code Club; NullMotion.
36. **Stagger between items 0.05-0.10 s** (ECC web); 3b1b's most common lag ratio is 0.1 (each part starts 10% of the way into the previous one); Cinetic batches landings within 0-3 frames. Sources: `motion-patterns`; 3b1b statistics; Cinetic.
37. **Every entrance has a matching exit,** ideally the entrance reversed and shorter (Cinetic seam 4.11, e.g. 14 f on E.in). Sources: `motion-patterns` rule 2; Cinetic transitions.md.
38. **Distance-based duration:** 0.35 s + 1.35 ms per px; camera moves 0.6-2.4 s; slowest move >= 3x the fastest. Source: Cinetic.
39. **Speed limits (60 fps):** text being read <= ~3 px/f; ceiling ~60-80 px/f; motion blur above 12 px/f. Source: Cinetic.
40. **Nothing fully static for long:** Cinetic: nothing static over 48 f (0.8 s) except freezes <= 15 f on silence and one near-still hold of 60-96 f per film. **Conflict:** 3b1b holds still for 1-3 s after each step on purpose (thinking time). Sources: Cinetic; 3b1b statistics.
41. **Animate, then hold:** 3b1b's typical step is a ~2 s animation then a ~1 s wait (most common values). Source: 3b1b statistics.
42. **Anticipation -> one restrained overshoot -> settle -> readable hold** for a hero word. Source: NullMotion Kinetic Headline (approved template).
43. **Camera:** slow start, peak ~27%, long settle; zoom in log space; push 2-5x only on story moments. Kremb bans drifting cameras; Divine Void wants slow weightless drift. **Conflict** (style-dependent). Sources: Cinetic; Kremb; ECC `taste`.

### Cuts, transitions and rhythm
44. **Cut on the beat:** frame of beat n = round(n x 60 / BPM x fps); section changes on downbeats, cuts on 8ths; start the picture change 1 frame before the cue. Sources: `taste/SKILL.md`; Cinetic.
45. **Rhythm variance matters as much as average shot length:** sample shot lengths from a distribution, never space cuts evenly (Flash Ethereal: variance 1.06). Source: `taste-application`, HANDOFF-TEMPLATE.md.
46. **Never hold a shot past its musical phrase.** Source: `taste/SKILL.md`.
47. **Crossfades are never the default and never dip through black** (two layers both fading dip ~25% in luminance); morph one object instead of crossfading two copies. **Conflict:** none, but Divine Void also bans crossfades in tempo sections. Sources: Cinetic transitions.md; `taste/SKILL.md`.
48. **Name and type the transitions so the same moves repeat:** 6-8 types per film, each <= 2 uses, plus one signature move 3 times (open, middle, close). Sources: Claude Code Club; Cinetic.
49. **Transitions grow out of the content** (zoom through a node, a web morphs, the story device carries across), never a generic preset (glitch, light leak, film burn, swirl, ripple, dreamy zoom, flash through white). Sources: GitHub #8; Cinetic.
50. **Remotion transitions overlap scenes:** total = sum of scenes - transition lengths (60 + 60 - 15 = 105). Add the overlap to the outgoing scene so the next stays on the grid. Sources: ECC `transitions.md`; Cinetic transitions.md.
51. **Hook:** frame 0 already composed and moving; a change ~every 0.5 s; problem felt by 1 s and stated by 2 s; first 6 s about twice as dense as the middle. Kremb: hook 3-4 s. Sources: Cinetic; Kremb.
52. **Shape the energy:** one motion peak per bar, 30-70 f calm between peaks, the biggest peak at 75-90% of runtime, a designed 1-4 s lull at 55-85%. Source: Cinetic.
53. **End card 1.5-2.5 s; URL readable >= 1.7 s; logo on screen <= ~12% of runtime, once, at the end.** Source: Cinetic; Kremb (end card >= 1.5 s).
54. **Describe every animation as opening state -> key transition -> final hold, and say whether a loop must join seamlessly.** Source: Promptcat general guidance.
55. **Within an explanation, transform rather than cut:** new objects come out of existing ones (copy flies from source to destination). Source: 3b1b scene statistics (transform-from-copy is the 5th most used move).
56. **Colour = meaning, kept for the whole video** (a variable or concept keeps its colour everywhere). Source: 3b1b `CLAUDE.md`.
57. **Place things relative to each other on a fixed spacing scale,** not by ad-hoc coordinates (3b1b: 0.1 / 0.25 / 0.5 / 1.0 of an 8-unit-high frame; edge margin 0.5). Source: 3b1b `CLAUDE.md`; `manim/manimlib/default_config.yml`.

### Layout for vertical
58. **Safe margins** 96px sides / 64px top and bottom at 1080p (Cinetic, Kremb); in 9:16 keep the content mass in y 270-1500 of 1920; keep content in the top ~85% when captions sit at the bottom. Sources: Cinetic; Kremb.
59. **Hero covers 40-70% of frame; no empty region over ~1/4 of the frame; avoid small floating cards (< ~40% width).** Source: Cinetic.

### Sound and review
60. **Every sound is caused by something visible; the idea must read with sound off.** Source: Cinetic quality bar.
61. **Loudness:** -14 LUFS +/-0.5 (-16 for stings <= 8 s), true peak <= -1 dBTP, LRA 5-8 LU for films >= 20 s; voice-over ducks music 6-9 dB; ~2 whooshes per film, 100-450 ms before the apex. Sources: Cinetic; Kremb.
62. **Review the real render, not the plan:** overlaps, abrupt cuts, missing frames, unreadable text (Promptcat); frame forensics for pops, stalls, dead holds, ghost frames, banding, plus A/V sync (Cinetic). Sources: Promptcat; Cinetic.
63. **Verify numerically against the reference's distribution** (median, not mean; background share; per-zone chroma; banding between occupied bins; cut cadence), and never ship on one average error figure. Source: `taste-application` "Verify, Then Believe".
64. **Long-running or looping effects pause when off-screen/hidden; honour reduced motion** (opacity-only fades <= 0.2 s). Web-only, but the same idea keeps preview players light. Sources: `motion-advanced` rule 2; `motion-foundations` rule 3; Promptcat.

## Style-pack and catalog formats seen

### ECC style pack (taste-distillation / taste-application / tasteforge)
Folder `stylepacks/<genre>/`, one per named genre (never merge genres; "a measured zero is valid data"):

| file | field | meaning |
|---|---|---|
| `pack.json` | `name` | genre slug, `^[a-z0-9][a-z0-9_-]*$` |
| | `version` | integer, must be 1 |
| | `created`, `updated` | ISO timestamps |
| | `refs[]` | each `{id, src, duration (s), n_shots}` |
| | `artifacts` | `{lut (file name or null), grade, cadence, spec (booleans), stills, props, plates (counts)}` |
| | `mint` | `{lut_size (e.g. 33), strength (e.g. 1.0), pixels_analyzed, ui_masked}` |
| | `distill` | `{generated, stills_used[], vlm_endpoint, vlm_model, dry_run, prop{source_still, detail_score, mesh_url, file, endpoint}}` |
| `grade.json` | `lab_mean`, `lab_std` | L\*, a\*, b\* mean and std |
| | `l_cdf` | luminance CDF (256 values) used for tone matching |
| | `black_point`, `white_point` | 1st / 99th percentile L\* |
| | `contrast` | std(L\*) |
| | `saturation` | mean chroma sqrt(a\*^2 + b\*^2) |
| | `warmth`, `tint` | mean b\*, mean a\* |
| | `noise_sigma` | grain estimate (MAD of high-pass luma) |
| | `palette` | `[["#rrggbb", share], ...]`, k = 6 |
| | `zones` | per luminance zone (edges L\* 0/15/35/55/75/100): `[a centre, a spread, b centre, b spread]` |
| | `n_frames` | frames sampled |
| | (background share) | share below L\*10, recorded and checked (in the handoff/verify step) |
| `cadence.json` | `shots[]` | each `{index, start, end, duration}` (seconds) |
| | `mean_shot`, `median_shot`, `p25_shot`, `p75_shot`, `min_shot`, `max_shot` | seconds |
| | `cuts_per_min`, `rhythm_variance` (std/mean), `total_duration`, `fps`, `n_shots` | |
| `look.cube` | | 33^3 3D LUT (normalising: neutral footage -> reference grade) |
| `spec.json` | `palette_description`, `grain`, `lighting`, `focal_length`, `camera_motion`, `subject_framing`, `grade_description` | strings, written by a vision model grounded in the measurements, hedge words banned |
| | `mood_adjectives[]`, `avoid[]` | lists |
| | `source` | `{pack, generated, stills[], dry_run, provider, endpoint, attempts[{attempt, chars, problems}]}`; optional `extra` |
| `grounding.txt` | | the measured facts fed to the vision model ("These values are FACTS...") plus the banned-words list |
| `stills/` | | full-res frames from the longest shots (conditioning images) |
| `plates/` | | glow and streak elements on black (screen-blend), a grain plate (overlay) |
| `props/` | | GLB meshes (original kept; retopology a separate file) |

Related records:
- **Taste profile** (interview output): `schema_version` 1, `genre`, `created`, `answers{}`, `unanswered[]`,
  `constraints{look{palette, grain, lighting, focal_length, camera_motion, subject_framing, grade_description,
  mood_adjectives[], avoid[]}, content{brief}}`. Missing answers are listed, never invented.
- **Genre signature** (multimodal workflow config): `number`, `slug`, `label`, `references[]`,
  `signature{materials[], motion[], composition[], avoid[] (must be non-empty)}`; generic signatures (e.g. "cinematic",
  "dynamic", "beautiful") and duplicate fingerprints across genres are rejected.
- **Effect recipe event**: `event_id`, `time`, `duration`, `genre_number`, `effect`, `requires_subject_anchor`,
  `placement{safe_area 0.08, max_coverage 0.30-0.35, occlusion_policy "preserve_subject_face_and_readable_type",
  track_space}`, `evidence{reference_sha256, time, source_duration, style_fingerprint}`, optional
  `subject_anchor{mode "segmentation_track", target, lost_policy "disable_effect_until_track_recovers"}`; recipe-level
  `seed`, `periodic: false`, `placement_constraints`.
- **Handoff doc** (HANDOFF-TEMPLATE.md): files delivered; grade table (contrast, black/white point, background share,
  grain); zone chroma table; cut table (shots, mean, median, p25/p75, cuts/min, variance); plates and blend modes;
  Blender lighting; a "Don't / Why" list.

### NullMotion catalog entry (`data/template-catalog.json`)
Top level: `schemaVersion` (1), `templates[]`. Each template:

| field | meaning / values seen |
|---|---|
| `id` | "NN-slug", also the preview folder name |
| `version` | integer (1-3) |
| `name` | display name |
| `description` | one line |
| `category` | short / long / data / ui / overlay |
| `prompt` | dense art-direction paragraph: subject, entrance path, settle, hold, exit, ease names, "no X" bans |
| `output` | `{width, height, duration (s), fps}`: 1080x1920 or 1920x1080, 4-7 s, 30 fps |
| `preview` | `{html: "NN-slug/index.html", thumbnail: null}` |
| `customizer` | null, or `{id, defaults{}, fields[{key, type (integer / select), label, minimum, maximum / options[]}]}` |
| `assetIntent[]` | `{type (logo / screenshot), count, required (optional bool), purpose}` |
| `qualityStatus` | approved / legacy |

The preview page contract (HyperFrames-style): `<meta name="hyperframes" content="duration:5,fps:30,width:1080,height:1920,transparent:true">`;
each layer tagged `data-start`, `data-duration`, `data-track-index`; one **paused** GSAP timeline registered as
`window.__timelines["root"]` (a renderer seeks it frame by frame); optional `window.startRender()`;
`window.reactToAudio(amplitude, frequency)` writing CSS variables `--audio-energy` / `--audio-tone` (0-1); controls via
URL params or `window.__nullMotionTemplateControls`; transparent background.

### Claude Code Club motion design system (thin)
- One rules file (theirs: 8 named rules) + runnable demo files per rule + (in Level 3) a motion design sheet: palette,
  type treatment, camera-angle mockups, animated shot previews. Packaged skill: system file path, beat structure,
  scope fence, generation path, character sheet. Values paywalled.

### Cinetic film bundle (seen, not read in full)
- `BRIEF.md` (incl. recorded brand-supplied exceptions), `TREATMENT.md` (8-section template), `timeline.ts` (all
  frame numbers come from here), house motion tokens, critic prompts (`critics/*.md`), measured-check scripts, an
  11-dimension rubric. Listed for comparison; I did not read every file.

## Not styles, but useful parts

**Moves and recipes with values**
- Divine flash bloom: radial #fff -> #ffb24d, screen blend, opacity 0 -> 1 -> 0 at frames 0 / 3 / 12, one beat long, on a transient. (`ECC taste/SKILL.md`)
- Colour-pop on monochrome; speed-ramp into the drop over the last bar; hero-on-black macro inserts held 1-2 beats. (`ECC taste/SKILL.md`)
- Glitch modes (seeded, effect strength p ramps 0 -> 1 over the first 60% of the clip): drift = red channel shifted 2-18px x p, blue the opposite half; mosh = bands 8-28px tall, each shifted 4-40px x p with 12% x p chance, plus RGB split red 2+8p px / blue 1+6p px once p > 0.2; feedback = previous frame zoomed 1.008x and decayed 0.90+0.06p, max-blended; pixel-sort by lightness, thresholds max(0.08, 0.45-0.35p) to 0.95, vertical. (`ECC taste-application/scripts/tasteforge/media/glitch.py`)
- Sacred-geometry line art on black (Manim): 72 radial ticks (r 3.2-3.45, stroke 1, 55% white) rotating -0.05 rad/s; flower-of-life of 7 circles r 1.05 (stroke 1.2, 85%) rotating 0.08 rad/s; golden spiral 14 quarter turns drawn over 3.4 s ease-in-out-sine; centre dot pulsing +/-25% size and 0.75 +/- 0.18 opacity on a 2.2 s period. (`ECC tasteforge/media/manim_geo.py`)
- Aperiodic effect schedule: first event 0.35-0.75 s, gaps 0.61-2.17 s, each 0.08-0.42 s, <= 18 events, seeded. (`ECC tasteforge/workflow.py`)
- Overlay plate rules: top ~3% by energy, rank by p99.5/median separation (>= 3), reject plates covering > 22% of frame; composite every 3rd shot at 0.30 opacity. (`ECC taste-distillation`, HANDOFF-TEMPLATE.md)
- Word highlight wipe: a 1.05em-tall rounded (0.18em) bar behind the word, scaleX 0 -> 1 from the left, spring damping 200, starting frame 30, 18 frames, colour #A7C7E7 on white/black 72px bold type. (`ECC remotion-video-creation/rules/assets/text-animations-word-highlight.tsx`)
- Typewriter: 2 frames per character, cursor U+258C blinking every 16 frames, 1 s pause after the first sentence, 72px/700. (`ECC .../text-animations-typewriter.tsx`)
- Staggered bar chart: bars 5 frames apart, spring damping 200; pie segments drawn with stroke-dashoffset from 12 o'clock. (`ECC remotion-video-creation/rules/charts.md`)
- TikTok-style caption pages: combine tokens within 1200 ms, highlight the active word. (`ECC remotion-video-creation/rules/display-captions.md`)
- Remotion 3D baseline: ThreeCanvas with explicit width/height, ambientLight 0.4 + directionalLight 0.8 at [5,5,5], rotation driven by frame (e.g. frame x 0.02), Sequences inside with `layout="none"`. (`ECC remotion-video-creation/rules/3d.md`)
- ECC web motion recipes: modal = opacity + scale 0.95 + y 8 on spring gentle (120/14); toast = x 48 + scale 0.98 on snappy (300/30); page change = y 8 over 0.35 s smooth; scroll reveal = y 24 over 0.6 s; word reveal = y 12, 0.05 s stagger, gentle; counter over 1.0 s smooth; SVG path draw pathLength 0 -> 1 over 0.6 s; progress ring stroke-dashoffset over 0.35 s; shimmer sweep -100% -> 100% over 1.0 s linear; pulse dot scale 1 -> 1.4 -> 1 with opacity 1 -> 0.6 -> 1 every 1.0 s. (`ECC motion-patterns`, `motion-advanced`)
- Slide reveals: fade + rise 30px over 0.6 s on cubic-bezier(0.16,1,0.3,1), 0.1 s steps; scale-in 0.9 -> 1; blur-in 10px -> 0 over 0.8 s; 3D card tilt +/-10deg at perspective 1000px. (`ECC frontend-slides`)
- Cinetic seam catalogue (60 fps): energy bands calm 30-48 f (blur 20-30px), medium 18-30 f (8-15px), high 9-18 f (3-6px). Twelve seams: relay handoff (device crosses untouched); container morph 46 f inOut, swap at landing; iris in 80x (28 -> 2240px) in log space by frame 30, flood out 18 f; implosion (world scale 1 -> 0, rotate -14deg, 19 f on E.in, device x1.25, <= 15 f silence, drop on downbeat); shutter collapse (height over 16 f, then width over frames 13-26); split on a seam (42 f, hinge rotateY -12deg at perspective 2400); velocity-matched cut (exit accelerating x1.1-1.2/frame over 10-24 f, entry decaying x0.89-0.94/frame over 48-84 f); zoom-through (exit 1 -> 1.2 + blur 10px text / 18-20px full frame in 12 f; entry 0.75 -> 1 in 30 f); partial slide +/-230px both shots, same 24 f; word waterfall (line A exits at half its entry stagger, 3-4 f, over 16 f); exit reverses entrance (shorter, e.g. 14 f); words become the mark (underline 0.1em at baseline + 0.07em in 16 f, then blocks). Plus: properties (position, size, radius, colour, shadow, opacity, blur) never change at the cut; show a rest pose once. (Cinetic `references/transitions.md`, MIT)
- Kremb seams: zoom-through (out 1 -> 1.2, blur 10px, opacity 0.15 in 0.2 s; in 0.75 -> 1 in 0.5 s), inverse zoom (0.8 / 1.25), 230px "cut the curve". Product-window entry: rotateX 18-30deg, y +80..300, scale 0.94, blur 8px -> rest over 0.8-1.5 s expo.out. (AI x Leaders #27, MIT)

**Shot templates and layouts**
- NullMotion's 23 catalog templates (table in Part B): CTA pill, kinetic headline, icon lineups, chat sim, prompt bar, compare bars, leaderboard, 3D bars, line growth, integration grid, phone showcase, search typing, connector list, prompt composer, CTA click, notification stack, blur reveal, showreel notify, three-step cards, slide-in headline, morph panel. (`NullMotion/data/template-catalog.json`)
- NullMotion mono drafts (animatic look): 640x360, Arial, black/white only (dark: bg #000000, fg #ffffff, card #0d0d0d, line #3a3a3a, muted #8c8c8c, fill #262626; light: bg #ffffff, fg #000000, line #d0d0d0, muted #7a7a7a, fill #ececec); font size by text length (< 8 chars 84px, < 16 50px, < 28 36px, else 28px); words rise 24px over 0.45 s power3.out, 0.09 s apart; whole scene drifts +3-4% scale linearly over the section; ~20 beat kinds (text, logo, phone, window, input, chat, cards, list, chart, notify, icons, hub, cloud, collage, logos, shape, burst, grid, split, face). (`NullMotion/public/drafts.mjs`)
- NullMotion section planning for breaking a reference into drafts: ffmpeg scene threshold 0.18 at 320px wide; sections = clamp(round(duration / 4.5), 3, 8); boundaries snapped to a real cut within 45% of a section length and >= 1.2 s from the ends. (`NullMotion/scripts/plan-sections.mjs`)
- 3b1b-style screen insert: a 16:9 screen rectangle on a full-frame #222222 plate (GREY_E) for showing outside footage. (`manim/manimlib/mobject/frame.py`, MIT; usage in `videos/custom/backdrops.py`)
- Captioned vertical clip: 1080x1920, 15 s, local voice-over, word timestamps from a transcribe step, big centred captions in the lower third in groups of 3-6 words with each word highlighted as spoken, a code card above whose lines fade in, dark background with one warm accent. (AI x Leaders #17, Bilal Demirer, MIT)
- Kinetic-type fact explainer: 1920x1080, 16 s, one fact per ~2 s beat as big bold numbers, warm off-white background, one accent, progress bar along the bottom, a source line. (AI x Leaders #18, Bilal Demirer, MIT)
- Talking head -> line-art explainer: speaker shrinks to a circular picture-in-picture bottom-right (clear of subtitles) while line-art B-roll follows the narration; original audio, subtitles and length kept. (GitHub list #39; creator's rights)
- Reaction PiP (talking head over b-roll) and all-caps keyword captions with 1-2 accent words: noted by ECC as recurring in reference edits. (`ECC taste/SKILL.md`)
- Painterly time-of-day 3D: painterly, not photoreal; soft shadows, AO, bloom, filmic grade; a dawn -> night cycle (storm with rain streaks, splash crowns and branching lightning; golden hour with long shadows, god rays, backlit blossoms; night with stars, Milky Way, cratered moon, lanterns); no text, no primitive shapes, nothing floating or intersecting. Thin on numbers; a Blender look reference. (GitHub list #72; creator's rights)
- Glass and gold-leaf tile mosaic: figures made of flocks of tiles that lift, flip, fly and click back; 80 s square. No colour values. (GitHub list #2; creator's rights)
- Seed-to-bloom SVG loop: 16 s, 1280x720 viewBox, watercolour-paper look, SMIL/CSS only, seamless loop (seed -> roots -> flower -> butterfly -> petals fall -> seed). Wording unverified by the site. (Promptcat, OpenVGLab card)

## Could not open / not read
- Claude Code Club: the packaged skill, exact prompts and full "scatter and settle" values are paywalled (Skool, $9/month). The free article was read in full.
- AI x Leaders: all 28 detail pages opened. The Cinetic bundle page is 712,445 characters; I read characters 0-200,000 and fetched `references/transitions.md` from the Cinetic GitHub repo; the remaining ~512k characters (incl. the 273-entry technique library) were not read.
- GitHub awesome list: README read in two parts; `RIGHTS.md` read; the `data/` folder was not opened, so per-entry prompt files (if any) were not checked. Some entries say "prompt not shared".
- Promptcat: no paywall; three MiaAI cards, the After Effects card, the Tasher and ajith_io briefs and one OpenVGLab card opened; the other ~150 cards not opened individually (the listing shows generic descriptions only).
- Nothing was downloaded; nothing was run.
