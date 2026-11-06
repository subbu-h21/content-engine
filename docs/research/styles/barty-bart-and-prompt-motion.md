# Visual styles in Barty-Bart/motion-graphics and prompt-motion.com

Research notes for the style catalog. Values are taken from the sources themselves; the prior summaries
(`docs/research/06-skill-links-11-21.md` #14 and `docs/research/04-notes-links.md` #3) were used only for orientation.
Nothing from the sources was installed or run. Text files were fetched with `gh api` into the scratchpad
(`...\scratchpad\stylesresearch\barty\repo\`, saved as `.txt`); the repo's demo GIFs were downloaded to
`...\scratchpad\stylesresearch\barty\gifs\` and only turned into contact sheets with ffmpeg so I could look at them.
Target engine: Remotion 4.0.535 (2D), Blender 5.1 (3D), default 1080×1920 at 24–30 fps, Google Fonts available.

## Source 1: GitHub `Barty-Bart/motion-graphics`

- Read on 2026-10-31 (last push 2026-10-13, 959 stars).
- **Licence.** GitHub reports `NOASSERTION` only because `LICENSE` has notes added after the MIT text. The `LICENSE` file
  itself is plain **MIT** (© 2026 Bart). The notes say: the Geist / Geist Mono fonts in `skills/motion-broll/engine/fonts`
  are SIL OFL 1.1, and the icon paths are adapted from Lucide (ISC). The README says the same and adds that the sound
  effects in `skills/sound-effects/sfx/` are CC0 1.0. The sound-pass method is credited to Vox (@Voxyz_ai).
  **Usable commercially**, with the MIT notice kept wherever code is copied.
- **Shared engineering across the three explainer skills.** These are identical in all three `SKILL.md` files.
  - **Page contract.** One HTML page with `window.VIDEO={w,h,duration}` and a pure `seek(t)`.
    - No CSS transitions or timers.
    - Seeded RNG (mulberry32-style `rng(s)`).
    - Anything with history is baked at load in 1/240 s steps.
    - Fonts are embedded as base64.
    - Scene layers are transparent over one stage background.
    - Absolutely positioned text gets `nowrap`.
    - Glows and gradients are drawn once to a canvas, because a big CSS `blur()` is slow.
  - **Rendering.** Final at 60 fps with motion blur:
    - Sub-frames are spread over half a frame (a 180° shutter) and averaged with ffmpeg `tmix`.
    - Encode: x264 at CRF 16.
    - Audio: `loudnorm=I=-16:TP=-1.5:LRA=11`, AAC at 192k.
    - Sub-frames: default 4, high-energy 8, engaging 8.
  - **Review ladder.** A stills contact sheet at the beat-sheet times, then a 30 fps draft without blur, then the final.

### Paste-in helpers (exact, from every explainer `SKILL.md`)
- **`spring(t, w = 14, z = 0.82)`.** The closed-form step response of a damped spring, going from 0 to 1. `t` is in
  seconds, `w` is the natural frequency in rad/s, `z` is the damping ratio.
  - The source's own guide to `w`: **8 slow, 14 normal, 22 snappy**.
  - The source's own guide to `z`: **1 = no overshoot**.
  - For `z ≥ 1` it uses the critically damped form `1 − e^(−wt)(1+wt)`.
  - *Conversion to Remotion `spring()`.* This is my own derivation, not from the source; verify it against 4.0.535.
    With `mass: 1`, `stiffness = w²` and `damping = 2·z·w`.

    | Use | w | z | stiffness | damping |
    |---|---|---|---|---|
    | Default | 14 | 0.82 | 196 | ≈ 22.96 |
    | Slow | 8 | 0.82 | 64 | ≈ 13.1 |
    | Snappy | 22 | 0.82 | 484 | ≈ 36.1 |
    | Camera follow (engaging) | 6 | 1 | 36 | 12 |

- **`track(v0, [[time, value, w?, z?], …])`.** A value that is re-targeted many times. Each change adds its delta through
  its own `spring`.
- **`kf([[t0,v0],[t1,v1,easeFn?],…])`.** Eased keyframes, "best for camera moves". The default ease is `ease`.
- **`ease`.** The **easeInOutCubic** curve: `x<.5 ? 4x³ : 1 − (−2x+2)³/2`.
  - In Remotion this is `Easing.inOut(Easing.cubic)`.
  - The usual CSS approximation is `cubic-bezier(0.65, 0, 0.35, 1)`; that approximation is mine, not the source's.
- **Smaller helpers.** `clamp`, `lerp`, `seg(t,a,b)` (0..1 progress through a window), and the mulberry32-style
  `rng(seed)`.
- **Typing and count-ups.**
  - Typing is `full.slice(0, n(t))`, with a caret blinking from `t`.
  - A count-up is `lerp(a, b, ease(seg(t,…)))`.
- **Camera.** A wrapper element with `translate() scale() rotate()`, driven by `kf` or `track`.

---

## Calm Product Demo (light, camera-as-editor)
- Source: `Barty-Bart/motion-graphics` → `skills/explainer-default/SKILL.md` (+ `README.md`, `docs/explainer-default.gif`); licence: MIT
- One line: a calm, premium homepage demo — airy near-white canvas, one small centred line at a time that the camera pushes into, then the product's rebuilt UI filmed close-up while it is used.
- Suits: SaaS/app launch videos, feature walkthroughs, "how it works". 45–90 s (default 60 s); 16:9 default, 9:16 supported. No real footage (UI is rebuilt as vector, never screenshots). No 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | #F7F7F8 | stage background, plain canvas between scenes |
| Text | #111114 | title lines, UI text |
| Secondary text | #8A8A94 | secondary labels |
| UI surface | #FFFFFF | cards, panels, inputs |
| UI border | #E7E7EC | 1 px borders on UI surfaces |
| Brand accent | #2E6BFF | the single accent (replaced by brand colour) |
| Highlight box | #2E6BFF at 15–20% opacity | soft box sweeping behind the key word |
| Brand gradient | white → pale accent → accent | slow diagonal "silk" light bands on open, closer and end card (drawn on canvas) |

The demo GIF uses Replit's orange as the brand accent, which shows the swap working: orange buttons, ticks and the logo
dot on white.

### Typography
- **Faces.** The brand's own font when it is known. Otherwise **Inter** or **Geist**; both are Google Fonts.
- **Title lines.**
  - Small, regular weight, about **28 px at 1080p**. The source means a 1920×1080 frame; it gives no figure for 9:16.
  - They grow through the camera, not through font size: the camera pushes until the line spans about **75% of frame
    width**.
  - **Tight letter-spacing on large text.** No value is given.
- **Case.** Sentence case, as the examples show: `Still building prospect lists by hand?`.
- **Emphasis.** One key word or short phrase gets a soft brand-colour box that sweeps **left → right** behind it.
  - In the closer, a highlighted word rotates through the use cases (`Do all your [prospecting / research / outreach] in
    Product.`).
  - A proof number counts up with the number highlighted.
- **Words on screen.** One short sentence at a time; text and UI almost never share the frame.
- **Open.** A small word, `Introducing`, fades up in the centre.

### Layout
- **Centring.** Lines are centred on the plain canvas, with generous whitespace.
- **UI framing.** The UI is cropped to the part that matters and shown big, filling most of the frame.
- **Density rule.** Never more than **one line of text plus one UI element** on screen. A text scene comes first, then a
  UI scene.
- **Integrations scene.** 8–12 rounded app tiles float in from the edges at different depths.
  - The text scales up by itself here instead of a camera push, so the tiles stay in frame.
- **Not given:** margins, a grid, or 9:16 safe zones.

### Elements
- **Rebuilt UI.** Vector UI that keeps the real layout, labels, colours, fonts and corner radii, simplified to what the
  scene needs. It has soft shadows and 1 px borders.
- **Input.** A large rounded input box, empty with placeholder text, with suggestion chips under it.
- **Agent steps.** Each step ticks off, spinner → check (for example `Found 247 matches`).
- **Result cards** stack up, with the far ones blurred as depth of field.
- **Tables** fill row by row.
  - A new column is added, and each of its cells "thinks" with a **shimmer** before the value appears.
- **Popover** with reasoning and sources.
- **Cursor.**
  - A macOS-style arrow on gentle curves.
  - It arrives a beat before it clicks.
  - It shows a small press dip and a soft ripple on the clicked control.
  - Hover states change.
- **Integration tiles.**
  - Rounded squares, with real logos only if supplied; otherwise neutral tiles with the name.
  - Near tiles are larger and slightly blurred; far tiles are small and sharp; all drift with parallax.
- **Proof backdrop.** A subtle dotted globe or grid.
- **Content rule.** No invented stats, users or testimonials. Use relative bars and skeleton lines instead.

### Motion
- **Camera moves.**
  - `ease` (easeInOutCubic) over **0.6–1.2 s**, or heavily damped springs with **`z ≥ 0.95`**.
  - With w = 14 that is about stiffness 196 and damping ≥ 26.6 (my conversion).
  - Nothing bounces.
- **Push-in on a title.** The camera pushes until the line spans about 75% of the width.
  - The highlight box sweeps behind the key word. Its sweep duration is not given.
- **Title entry.** The line types in or fades in word by word. Its stagger is not given.
- **The camera rides the action.**
  - It follows the caret as text types; `measureText` tells it where the caret is.
  - After the action it **pulls back** to show the whole screen for a beat, then glides on.
- **Typing** runs at about **25 characters/s**, with the caret blinking.
- **Holds.**
  - A title line holds about **2 s** after it lands.
  - Leave a **0.5 s** pause after each result.
  - UI moments run at real speed.
- **Count-ups.** `lerp(a,b,ease(seg(t,…)))`.
- **Brand gradient.** Silk bands drift slowly. The speed is not given.

### Transitions and rhythm
- **No hard cuts.** Each scene is its own layer with its own camera.
- **Scene change.** The outgoing layer **blur-dissolves over 0.3–0.4 s** into the next one, which is already moving. A
  camera move (push, pull or glide) is the other option.
- **Timing budget.**
  - Open: 0–5 s.
  - Problem / ask: about 5 s.
  - Feature chapters: 3–5 of them, about 8–15 s each.
  - Proof: optional.
  - Integrations: optional.
  - Closer.
  - End card: 3 s.

  | Length | Features | Optional sections |
  |---|---|---|
  | 45 s | 2–3, about 9 s each | proof *or* integrations |
  | 60 s | 3–4, about 10 s each | one of proof / integrations |
  | 90 s | 4–5, about 12 s each | both |

- **Music.** An uplifting, gentle bed at **100–110 BPM** with soft piano or pluck chords.
  - Light percussion enters after the open, with a lift into the closer.
- **Sound effects.**
  - Key ticks while typing.
  - Soft clicks.
  - A tick per completed step.
  - A soft whoosh on big camera moves.
  - A chime on the end card.

### Finish
- Real motion blur: the final has 4 sub-frames over a 180° shutter.
- Depth-of-field blur on far result cards and near integration tiles.
- Soft shadows.
- Not used: grain, vignette or glow; none is mentioned. "Big drop shadows" and "glassmorphism everywhere" are banned.

### 3D look
None. Depth is faked with blur and parallax only.

### Banned
- Busy backgrounds behind UI.
- More than one accent colour.
- Bouncy easing.
- Emoji.
- Big drop shadows.
- Glassmorphism everywhere.
- Invented metrics or testimonials.
- Hard cuts.

### Example frames
- https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/docs/explainer-default.gif (800×450 contact GIF).
- What it shows:
  - A Replit "yoga studio" demo: an agent checklist with orange ticks.
  - A blur-dissolve to a clean booking table with orange `Sign up` pills.
  - A pull-back to the full UI.
  - An end card with `Lotus Yoga` / `Find your flow.` in a browser frame.

### Gaps
- No pixel sizes for UI text, radii, shadow values, margins or safe zones.
- No highlight-sweep duration.
- No word stagger.
- No blur amount for the blur-dissolve.
- No silk-band speed or angle.
- No vertical-frame type sizes.

---

## Beat-Locked Hype Promo (dark, shape-carried transitions, viewfinder HUD)
- Source: `Barty-Bart/motion-graphics` → `skills/explainer-high-energy/SKILL.md` (+ `README.md`, `docs/explainer-high-energy.gif`); licence: MIT
- One line: a 12–20 s showreel-energy sting — something lands every half-beat, and a single shape (spark → line → flood → dot) carries the eye through every scene change.
- Suits: launch stings, teasers, hype reels, brand promos. Default 15 s = 128 BPM × 8 bars. No real footage. A pseudo-3D signature moment (canvas projection, not a 3D engine) — maps well to Blender for the signature shot.

### Palette
| role | hex | where used |
|---|---|---|
| Ink | #0B0B10 | near-black canvas (spark open, end card, triplet "accent on black") |
| Accent | #FF4F1A | spark, line, full-screen flood, accent bar, progress fill (replaced by brand main colour) |
| Cream | #EDEBE4 | triplet background "dark on cream" |
| Electric blue | #2F47FF | triplet background "white on electric blue" (replaced by brand 2nd colour; one-colour brand → deep shade of its colour) |
| White | #FFFFFF | type on blue, highlights |
| HUD red dot | not given (red) | running timecode dot |

Rule: at most **3 colours per scene**, not counting black and white.

### Typography
- **Slams.** A heavy grotesk, **all caps, huge**: for example **Inter Tight 900** or **Archivo Black** (both Google Fonts).
  - The weight can morph from thin to black. This needs a variable font with a range, `wght@100..900`.
- **Human line.** **Instrument Serif italic** (Google Font), 2–4 words under the name, and the end-card tagline.
- **HUD and captions.** A mono: **JetBrains Mono** or **Geist Mono** (both Google Fonts).
  - **12–14 px at 1080p**, about **50% opacity**.
  - The end-card line is **tracked** and typed letter by letter, for example `PRODUCT.COM`.
- **Kicker.** A small mono line above the slam: `INTRODUCING — 2026`.
- **Handwritten script word.** It draws itself on. No face is named.
- **Brand fonts.** If the brand has fonts, use them for the name and keep the mono for the HUD.
- **Emphasis is a change of treatment per word.**
  - Every word in the kinetic triplet gets its own background and colour pairing.
  - One variant is an **outline repetition**: the word repeated as an outline pattern filling the frame.
- **Words on screen.** 1–3 words at a time.

### Layout
- **HUD frame on every scene.**
  - Thin **corner brackets**.
  - `SCENE 02 / 07` at the top right.
  - A category label at the bottom left (`KINETIC TYPE`, `PRODUCT`, `DATA`).
  - A running **timecode with a red dot** at the bottom right.
  - It should read like a camera viewfinder.
- **Spark open.** A faint grid on the dark canvas.
- **Blue triplet card.** Viewfinder corner brackets with a tiny `1920 × 1080` label.
- **Product card.** Floats tilted slightly in 3D, with **two ghost cards** stacked behind it.
- **Not given:** margins, grid spacing, or vertical safe zones.

### Elements
- **Spark.** A tiny accent mark that pulses, stretches into a thin horizontal line with a small mono label
  (`product / launch — 2026`), wobbles once, then floods the screen vertically.
- **Detaching full stop.** The full stop or the dot of a letter detaches and grows into the shape that starts the next
  scene.
- **Signature visual.** Pick one:
  - A **3D cube field rippling from the centre**. It is drawn on canvas with its own perspective projection and coloured
    by height from the palette. It suits building blocks.
  - A **particle flow** that condenses into a ring and bursts. It suits data or AI.
  - A **liquid blob** morphing between shapes. It suits flexibility.
  - The camera slowly **tilts or orbits** while it plays.
- **Product micro-moment.**
  - A cursor flicks a toggle and presses the main button.
  - An accent progress bar fills, with a percentage.
  - The button turns to `Done ✓`.
  - A toast slides in at the top right.
- **Proof.** Only with real numbers.
  - A big count-up (`+312%` style) whose digits blur while they spin.
  - A donut ring.
  - Staggered bars with one accent bar.
  - A line drawing over the bars, with a tooltip.
- **Morph bridge.** The shape collapses to a dot, which becomes a ring pulse on dark, which becomes the dot in the logo.
- **End card.** The name with the accent dot, an italic serif tagline, a tracked mono line, and a **hairline rule**.

### Motion
- **Grid.**
  - Big changes land on beats.
  - Typography lands on **1/8 or 1/16 notes**.
  - At 128 BPM a beat is 0.469 s, an 1/8 note 0.234 s and a 1/16 note 0.117 s (my arithmetic).
- **Impacts.** Overshoot slightly, with **`z ≈ 0.6–0.7`**, then settle.
  - With w = 14 that is damping 16.8–19.6 and stiffness 196 (my conversion).
- **Name reveal.** Letters are revealed **by masks on consecutive 1/16 beats**.
- **Triplet words.** Each enters with a **fast blur/slide** and lands with a slight overshoot.
  - Each word holds **two beats**, three for the handwritten word.
- **Hard swaps inside the triplet.** Backgrounds swap hard on the beat. Inside this scene the swaps are the rhythm and do
  not count as cuts.
- **Count-up digits** blur while they spin.
- **HUD timecode** runs continuously.
- **Rule:** no scene without motion.

### Transitions and rhythm
- **Scenes.** 6–8 scenes of **1.5–3 s each** on a **120–140 BPM** grid. Default: 128 BPM, 8 bars, 15 s.
- **Transitions are objects.** Options:
  - A full-screen flood.
  - A wipe by a growing bar.
  - A dot that grows into the next background.
  - A word that zooms through the camera.
- **Hard cuts.** Only on a downbeat, **at most twice**.
- **Scene order menu.** 6 strong scenes beat 8 weak ones.
  1. Spark open.
  2. Brand slam.
  3. Kinetic triplet.
  4. Signature visual.
  5. Product micro-moment.
  6. Proof.
  7. Morph bridge.
  8. End card, **held 2 s**.
- **Sound.**
  - **Music.** Kick on every beat, clap on 2 and 4, sub bass following the scene roots.
  - **Riser** into the brand slam and the end card.
  - **Impact** on each flood: a low boom plus a noise burst.
  - **Tonal blip** on each typed word.
  - **Whoosh** on every carried transition: a band-passed noise sweep.
  - **Ring-out** on the end card.
  - The music sits under the hits.

### Finish
- **Vignette.** A soft radial vignette on every flat background. No strength is given.
- **Grain.**
  - Very subtle film grain.
  - A few seeded grain tiles are pre-generated and cycled.
- **Motion blur.** Real blur with **8 sub-frames** over a 180° shutter in the final.
- **No glow-on-everything** (it is banned).

### 3D look
- **Software.** Pseudo-3D on 2D canvas.
- **Cube field.** A heightfield of extruded cubes coloured by height. In the GIF the colours run from orange to cream on
  dark navy.
  - It ripples from the centre, under a slowly tilting or orbiting camera.
- **Product card.** A slight 3D tilt with two ghost cards behind it.
- **Blender.** These map directly to Blender: an instanced cube grid with a height-driven material, and an orbit camera.

### Banned
- Stock-template looks.
- Glows on everything.
- Emoji.
- More than 3 colours in one scene (black and white excluded).
- Text too small to read at a glance.
- Any scene without motion.
- Hard cuts between scenes, except at most 2 on downbeats.

### Example frames
- https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/docs/explainer-high-energy.gif
- What it shows:
  - A dark navy scene with HUD corner brackets.
  - A tilted product card with an orange `Start` button and a progress bar.
  - An orange cube-field ripple with the Instrument-Serif-style italic line `Turn ideas into apps in minutes`.
  - A ring pulse with `● LIVE`.

### Gaps
- No vignette or grain strength.
- No pixel sizes for the slam type.
- No duration for flood, wipe or bar.
- No overshoot `w`; only `z` is given.
- No letter-spacing values.
- No handwritten face named.
- No vertical-frame specifics.
- The GIF's background is dark navy rather than the `#0B0B10` ink, so the demo was probably brand-tinted; the exact value
  is not given.

---

## One-Take Hero Journey (dark iOS stations, follow-cam, reveal pull-out)
- Source: `Barty-Bart/motion-graphics` → `skills/explainer-engaging/SKILL.md` (+ `README.md`, `docs/explainer-engaging.gif`); licence: MIT
- One line: a single unbroken shot — one bright hero ball bounces through a chain of little UI "stations" that react to it, the camera following tightly, then pulling far out to reveal the whole course before diving back to loop.
- Suits: loopable product animations, workflow explainers, social loops. 10–30 s (default 12 s seamless loop; longer = more stations, not slower). No footage. 2.5D (CSS perspective tilt on the reveal) — no true 3D needed.

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | #0C0C0E | world background |
| Dot grid | #1E1E22 | faint dot grid that moves with the camera |
| Surface 1 | #1C1C1F | station cards |
| Surface 2 | #2C2C2E | raised surfaces / key caps |
| Text | #F2F2F7 | labels |
| Secondary text | #8E8E93 | sub-labels, `now` |
| Accent | #0A84FF | fills, toggles on, track fill (replaced by brand colour) |
| Hero | #FFFFFF | the hero ball, always the brightest thing on screen |
| Light variant canvas | #F2F2F4 | if brand is light; then hero = accent |

### Typography
- **Font.** SF-like: **Inter** or **Geist** (both Google Fonts).
- **Words on screen.** Only the stations' own labels and messages, a few words each, written with some wit.
  - The reference uses `Slider · Reached 100`, `Gravity · Something is falling`, `Messages · What now?`, and then types
    `retry`.
  - Pattern: `Name · state`.
- **No explanatory overlays** (banned).
- **Not given:** sizes or weights.

### Layout
- **World.** About **3× the frame**, with stations placed in visiting order.
  - The path zig-zags: right along the top, down through the middle, across the bottom.
  - Each station stays in a fixed spot for the whole video.
- **Side-on gravity.**
  - Notification cards form a **staircase**, each offset sideways by more than its width.
  - The keyboard is seen head-on.
- **Framing.**
  - During an interaction the station fills about **half the frame width**, and the hero is **50–70 px on screen at
    1080p**.
  - It is wider during falls, so the next station is already visible.
  - The hero never leaves the **middle half** of the frame.

### Elements
- **Hero.**
  - One object that never disappears. Default: a ball that is a toggle's knob.
  - Alternatives: a caret, a file tile, a message bubble, a coin, a data point.
- **Stations.** Real-looking system UI:
  - Toggles.
  - Sliders with tick marks and a value tooltip.
  - Notification cards with an app-icon square, a title, a body line and `now`.
  - A keyboard with key caps and a return key.
  - List and table rows.
  - Charts whose leading dot is the hero.
  - Chat bubbles.
  - A deploy button, followed by a toast or URL.
- **Empty slot.** When the hero leaves, a dim outline of its slot stays and fills again when it returns.
- **Cursor.** It may click the first station, then gets out of the way.

### Motion
- **Contacts land on beats.** Between contacts the hero moves along parabolas:
  - `x` is linear in time.
  - `y = y0 + v·t + ½·g·t²`, with `v` solved so the hero lands on the next contact on the beat.
  - Gravity is constant for the whole video.
- **Rolling.** Along a track the hero moves by `ease` or a spring, and the station's value follows the hero's position.
- **Squash on impact.** Scale **1.25 × 0.8 for about 60 ms**, then spring back.
  - The surface that was hit gets a small push-down.
- **Stretch in flight.** Up to **1.15 × 0.9** along the velocity.
- **Launch.** One long arc back to the start.
  - First pick the apex height; that fixes the real flight time.
  - Then **warp time**, slowest at the apex (often **5–10×** slower there). Example speed curve over the arc:
    `1 − 0.9·sin(πu)^0.6`.
  - Stations reset in reverse **during the reveal hold**, not at the launch.
- **Camera follow.**
  - The target is a blend of the hero (plus a lead of about **0.15 s** of its velocity) and the station anchor.
  - Anchor weight: **0.7** during an interaction, **0.15** during falls and hops, **0.85** on the payoff hold.
  - Smoothed by a critically damped spring with **`w ≈ 6`** (stiffness 36 and damping 12 at mass 1, my conversion).
  - Baked at load.
  - It blends from a fixed first framing into following over the first **0.8 s**.
- **Payoff hold.** **0.4–0.6 s** on the final result.
- **Reveal.**
  - The camera eases to a fixed framing at about **0.3×** zoom, with a 3D tilt (`perspective` + `rotateX` of
    **15–25°**).
  - Hold about **1 s**.
  - The hero scales up with a **soft halo**, staying at least **24 px** on screen.
- **Dive back.** A fixed framing of the first station, timed so the camera arrives as the hero lands.
- **Seam.** The loop point is the landing on the first station. `seek(duration)` must equal `seek(0)`, and the squash
  shows at both ends.

### Transitions and rhythm
- **Shot.** None: one continuous take.
- **Music.** A **110–120 BPM** minimal groove: soft kick, clicky hats, muted pluck bass.
- **The hero's contacts are the instrument.**
  - Each impact plays a pitched tick or marimba note, and the pitch rises as the story advances.
  - Keys click.
  - The slider plays fine ticks that speed up with its value.
  - Notifications pop.
  - The launch gets a whoosh up and the dive a whoosh down.
- **Audio seam.** The audio is rendered longer and its tail is folded back onto the start, so the loop is seamless.

### Finish
- **Motion blur.** Real blur, **8 sub-frames**. The hero and the world smear on fast moves as part of the look.
- **Halo.** A soft halo on the hero during the reveal.
- **Not mentioned:** grain or vignette.

### 3D look
Only a CSS-style perspective tilt of 15–25° on `rotateX` at the reveal. In Blender this would be a flat card world with
an orbit/tilt camera.

### Banned
- Cuts.
- Fades to black.
- Text overlays that explain what is happening.
- More than one hero.
- Stations that don't react.
- Floaty physics.

### Example frames
- https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/docs/explainer-engaging.gif
- What it shows:
  - A Replit-orange brand on near-black with a dot grid.
  - Slider tooltips `14%`, then `97%`, then `100%`.
  - A white ball with heavy motion blur.
  - A `Plant Pal` checklist, a `Published` pill, and `Live at plant-pal.replit.app`.
  - A pulled-out, tilted overview of the whole course.

### Gaps
- No type sizes, radii or card shadows.
- No gravity constant.
- No zoom value for the follow shots, beyond "station about half the frame".
- No halo size.
- No vertical-frame layout (a 3×-frame world laid out for 9:16 would need rethinking).

---

## One-Shape Morph B-roll (warm grey, black-and-white components, one orange accent)
- Source: `Barty-Bart/motion-graphics` → `skills/motion-broll/SKILL.md`, `reference/engine-api.md`, `engine/motion.js`,
  `engine/base.css`, `engine/build.py`, `engine/render.js`, and `examples/opus-aoe2/01–06*.html` + `plan.json`. GIFs:
  `docs/demo-cutaway.gif`, `docs/demo-panel.gif`. Licence: MIT. Fonts Geist / Geist Mono are OFL 1.1. Icons are adapted
  from Lucide (ISC).
- One line: B-roll for talking heads in which one rounded shape never cuts. It morphs pill → card → terminal → chart,
  its content swaps with a short blur, and a cursor drives every change on a spoken word.
- Suits: talking-head YouTube videos and shorts, tool or AI explainers, tutorials.
- **Needs real footage**: the speaker. The clips are either full-frame cutaways of 3–10 s, or transparent panels in the
  empty space beside a picture-in-picture speaker, which can run 15 s or more.
- No 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | #E9E7E2 | warm grey stage behind cutaways (default style) |
| Ink | #0B0B0B | dark pills/chips/session bars, text, fills, cursor fill |
| Component | #FFFFFF | cards, docs, comparison panels |
| Accent | #FF5A1F | one accent: "New" badge, castle tile, `Low` chip, first bar, accent section badge, chapter number |
| Panel shape (on dark footage) | #F4F2EE | light shapes for transparent panel clips |
| Secondary text | #8A8782 | sublabels, captions, terminal title, status text (examples) |
| Secondary text on dark | #9A9791 | sub-lines inside black shapes (examples) |
| Hairline / track | #E2DFD9 | dividers, progress tracks (examples) |
| Skeleton / slider track | #E6E3DE | skeleton text lines, slider tracks (examples) |
| Doc skeleton line | #DCD8D1 | lines in the document state (examples) |
| Other neutrals | #EAE7E2, #EDEAE5, #E9E6E0, #F1EFEB, #D6D3CE | rule, result track, segmented-control bg, icon tile bg, monochrome window dots (examples) |
| Folder tab | #E14A12 | darker accent for the folder's tab (example 02) |
| Drop-target ghost | #BDB8B0 border (3 px dashed), #A29E97 text | dashed pill the chip is dragged into (example 04) |
| Shape shadow | `0 1px 2px rgba(20,18,14,.06), 0 10px 30px -8px rgba(20,18,14,.16)` | on the shape (removed on alpha clips) |

### Typography
- **Faces.** **Geist** (variable 100–900) for UI text and **Geist Mono** for code, file names and terminals. Both are
  Google Fonts; the skill embeds its own OFL copies.
- **Numbers.** `font-feature-settings: "tnum"` is on everywhere, so digits are tabular.
- **Sizes from the examples.** These are world px on a 1920×1080 stage and are then scaled by the per-state camera
  `cam` of 1.05–2.0, so the on-screen size is larger.

  | Text | Size | Weight | Letter-spacing | Colour |
  |---|---|---|---|---|
  | Pill title | 48 | 600 | −0.02em | — |
  | Big heading | 54 | 600 | −0.025em | — |
  | Card title | 34 | 600 | −0.02em | — |
  | Section title | 27 | 600 | — | — |
  | Subtitle | 25 | regular | — | #8A8782 |
  | Badge | 22 | 600 | — | — |
  | Mono file name | 25 | — | — | — |
  | Terminal text | 26 | — | — | — |
  | Chapter number | 150 | 600 | −0.05em | accent |
  | Chapter title | 60 | 600 | −0.03em | white |
  | Chapter sub-line | 28 | — | — | #9A9791 |
  | Small labels | 17–24 | — | — | — |

  - The badge has padding 6/14 and a 999 px radius.
  - The terminal text has a line-height of 40.
- **Case.** Sentence case.
- **Separator.** The `·` middle dot joins label pairs (`Same prompt · different effort`, `Opus 5.5 · Low effort`).
- **Emphasis.** Carried by colour and shape, not by type:
  - The accent chip fills in.
  - A row name flashes accent with a Gaussian pulse.
  - Segmented-control labels use `mix-blend-mode: difference`, so they invert under the moving black pill.
- **Words on screen.** A short title plus 3–4 labelled rows. Body copy is drawn as **skeleton lines**.

### Layout
- **Shape.** One shape, centred at world (0,0). The camera centre defaults to the frame centre.
  - For panel clips, the centre is moved into the empty area; the example uses `center:[1220,540]` beside a PiP box on
    the left.
- **Per-state camera zoom.** Each state fills the frame: about **1.2–1.6 for cards** and **1.8–2.2 for pills**.
- **Shape sizes from the examples.**

  | State | w × h | radius |
  |---|---|---|
  | Pill | 440 × 120 | 60 |
  | Chapter "Up next" pill | 260 × 92 | 46 |
  | Session pill | 720 × 120 | 60 |
  | Card | 780 × 560 | 36 |
  | Card | 840 × 300 | 44 |
  | Card | 1000 × 600 | 40 |
  | Doc | 600 × 720 | 28 |
  | Terminal | 1060 × 640 | 26 |
  | Comparison | 1240 × 330 | 40 |

  - The radius is clamped to half the height.
- **Anchors.** Content layers are anchored centre, top-centre or left-centre. Top-anchored content rides the top edge as
  the shape grows.
- **Density.**
  - Light: 2–4 clips per minute.
  - Medium (default): 4–7 per minute.
  - Heavy: most lines covered.
  - One idea per clip.
- **Panels.** Sized to stay clear of the speaker's box at every moment.

### Elements
- **Interaction vocabulary.** These are the shared `motion.js` interactions:
  - Primary action (pill + click).
  - Progress (loader, bars, lanes).
  - Confirmation (check, toast).
  - Live status island.
  - Detail card with a drag.
  - Slider with rubber band.
  - Toggle.
  - Tabs.
  - Chart with tooltip.
  - Search-and-filter list.
  - File → drag → drop target.
  - Terminal typing.
  - Side-by-side comparison.
  - Chapter card.
- **Icons.** One Lucide-derived set on a 24 grid, with the stroke normalised so every icon has the same stroke in world
  space (default **2.2**, used up to 3–4.2 on small filled badges). Round caps and joins.
  - The set: arrow, check, x, plus, folder, terminal, file, pencil, coin, clock, chip, sparkle, castle, search.
- **Cursor.** An SVG macOS-style arrow, fill `#0B0B0B`, white stroke 2.6.
  - Drop shadow `0 2px 3px rgba(0,0,0,.25)`.
  - Constant on-screen size of **44–46 px**.
- **Terminal.** Three monochrome dots, a centred mono title, a hairline, a rounded "Welcome" box with an accent `✻`, and
  a typed prompt with a block caret.
- **Progress lanes.** A name, a 14 px track and fill, and a mono status that reads `queued` → `NN%` → `done ✓`.
- **Bars.** Radius 12/12/6/6. The first bar is accent; heights are relative only.
- **Skeleton lines.** Height 12–14 px, radius half the height. A doc's first line is a 20 px accent bar.
- **"vs" disc.** A 96 px black circle that flips to accent with a `?`.
- **Real numbers.** Never invented; bars are relative and labels come from the transcript.

### Motion
- **Spring model.** A closed-form spring step response `S(τ, ω, ζ)`. A value that is re-targeted many times is the
  **sum of one spring per change** (`M.track`). Colours use the same mechanism on RGB (`M.ctrack`, spring `[20, 1]`).
- **Spring presets.** Given as `[ω rad/s, ζ]`. The Remotion equivalents are my conversion at mass 1
  (stiffness = ω², damping = 2ζω).

  | Preset | [ω, ζ] | Use | Remotion stiffness / damping |
  |---|---|---|---|
  | MORPH | [15, 0.84] | default for shape w/h/radius | 225 / 25.2 |
  | FAST | [27, 0.86] | leading edges | 729 / 46.4 |
  | SLOW | [12.5, 0.9] | trailing edges | 156 / 22.5 |
  | SOFT | [10, 0.95] | — | 100 / 19 |
  | CAM | [7.5, 1] | camera zoom, critically damped | 56 / 15 |
  | INSTANT | [∞, 1] | invisible resets | — |
  | Colour track | [20, 1] | `M.ctrack` | 400 / 40 |
  | Shape intro | [13, 0.78] | intro pop | 169 / 20.3 |
  | Press down | [45, 1] | press | 2025 / 90 |
  | Release | [22, 0.72] | press release | 484 / 31.7 |

- **Shape intro.** The shape pops in at `intro` (default 0.02 s).
  - Scale runs `0.55 + 0.45·S(t−intro, 13, 0.78)`.
  - Opacity is linear over **0.12 s**.
- **Content swap (`M.vis`).** Defaults:
  - Enter waits **din 0.07 s**, then blurs in over **lin 0.26 s**.
  - Exit takes **lout 0.12 s**.
  - Blur is **12 px** in and 9.6 px out.
  - Scale goes 0.94 → 1 on enter and ×0.97 on exit.
  - The curve is easeOutCubic (`1 − (1−x)³`).
  - The examples tune `lin` to 0.2–0.24 and `din` to 0–0.05.
- **Liquid indicator.** The two edges are separate tracks: the leading edge on **FAST** and the trailing edge on
  **SLOW**, so the pill stretches as it travels. Used for segmented controls and level selectors.
- **Press.** The press starts **0.07 s before** the click and releases **0.035 s after** it.
  - The shape scales by `1 − 0.035·press` and the cursor by `1 − 0.13·press`.
  - A drag holds the press for its whole length.
- **Cursor path.** Smootherstep easing between keys (`x³(6x²−15x+10)`) with a **slight human arc**: a perpendicular
  offset of `sin(πu)·0.06` of the segment.
- **Recipes from the examples.**
  - **Rows on words.** `vis` with lin 0.2–0.24, plus `translateY` 12–14 px or `translateX` −18 px. Rows are about
    0.27–0.32 s apart, set by the words; lanes are staggered by **0.1 s**.
  - **Skeleton lines.** They grow with smootherstep over **0.45 s**, staggered by **0.18 s**. Doc lines take **0.3 s**,
    staggered by **0.075 s**.
  - **Bars.** They rise on spring `[13, 0.82]` (stiffness 169, damping 21.3), staggered by **0.07 s**.
  - **Badge pop.** Spring `[16, 0.7]` (stiffness 256, damping 22.4).
  - **Accent pop.** Scale `1 + 0.12·sin(π·u)` over **0.3 s**, or `1 + 0.25·sin` over **0.35 s** for the "vs" disc.
  - **Slider knob.** Grows 1.18× on grab (`[30, 0.8]`) and back on release (`[20, 0.8]`).
  - **Building blocks.** Pop up with `scaleY` on `[17, 0.62]`, each triggered when the dragged value crosses its
    threshold (`M.crossTimes`).
  - **Name pulse.** The colour flashes to the accent with a Gaussian of **σ ≈ 0.16 s**.
  - **Spinner.** The star spins at **240°/s**.
  - **Typing.** In the example a 122-character prompt types over 1.25 s (about 98 chars/s, deliberately fast).
  - **Caret.** Blinks at about 2.2 Hz.
- **Rules.**
  - Springs have **a tiny overshoot at most**.
  - The camera zooms so each state fills the frame.
  - A clip ends by holding its last state.

### Transitions and rhythm
- **Within a clip.** Never a cut: the shape morphs and the content blur-swaps.
- **Between clip and face.** A hard cut in the editor; the preview composite uses hard cuts.
- **Pacing to speech.** One change per spoken beat, **0.4–1.2 s apart**, and every state change lands on a word.
  - SRT word times are ±0.2 s, so put important changes on the first or last word of a cue.
- **Cutaways.**
  - 3–10 s each.
  - Never in the first second of the hook.
  - Never on personal, emotional or opinion lines.
  - Leave at least about **2 s of face** between cutaways.
- **Example plan.**
  - A 54 s video carries 6 clips: 6.45 s, 15.75 s (panel), 3.8 s, 9.9 s, 7.1 s and 1.5 s (chapter card).
  - The chapter card holds `Up next →` for about 0.9 s, then morphs to `01 First build`.

### Finish
- **Motion blur.** **4 sub-frames per frame**, centred on the frame time and spread over half a frame (a 180°
  shutter), averaged with `tmix` weights `1 1 1 1`.
- **Video output.** x264 at CRF 14 for MP4.
- **Alpha output.** ProRes 4444 (`prores_ks` profile 4, `yuva444p10le`) for panels.
- **Not used:** grain, vignette and glow; glows and particles are banned.
- **Rendering gotcha.** Never put `will-change` on anything the camera scales, or the text renders blurry.

### 3D look
None.

### Banned
- Bouncy easing.
- Particles.
- Glows.
- Gradients on UI chrome.
- Mixed icon strokes.
- Dead time.
- Anything that looks like a template.
- Made-up data, numbers, quotes, prices or results.

### Example frames
- https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/docs/demo-cutaway.gif shows a full-frame cutaway:
  - A `Build notes` card with Liked / Didn't like / Missing rows.
  - A morph to a `master-prompt.md` document.
  - A morph to a black chip that is dragged into a dashed pill.
  - A morph to the black session bar `Opus 5.5 [Low] + master-prompt.md`.
- https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/docs/demo-panel.gif shows a transparent panel
  beside a PiP speaker on black:
  - An orange folder.
  - A morph to a light terminal that types the prompt, with the effort pill sliding High → Low.
  - A morph to the progress lanes.

### Gaps
- Not designed for 9:16; all the examples are 1920×1080. It would port with the pill and card sizes scaled.
- No sound design inside this skill; it is handled by the `sound-effects` skill.
- No guidance for brand fonts beyond "optionally a font".

---

## Source 2: prompt-motion.com

- **Read on 2026-10-31, with no login needed.** These pages were fetched with curl and read as text:
  - the home page;
  - `/templates`, `/templates/showreel`, `/templates/showreel/customize` and `/templates/realtime`;
  - all **236** gallery entry pages and their 236 `/customize/<slug>` pages.
- **Videos.** The two template runs were downloaded and only turned into contact sheets with ffmpeg.
- **Licence.** None is given anywhere. The footer says "Videos and prompts belong to their creators, linked on each
  entry." The two templates say "Written by Prompt Motion".
  - So: **no licence; treat the prompt text as all rights reserved.** It is not marked non-commercial, so I have not
    written "DO NOT USE".
  - Re-implementing a look from these descriptions is fine. Copying prompt text verbatim into our product is not.
  - Several entries are built around real brands (Spotify, Taxtello, Claude, Prompt Motion itself). Those brand
    elements must not be reused.
- **What the gallery holds.**
  - Most of the 236 entries are one-liners; the showreel one-liner alone appears 49 times.
  - About 17 creator prompts are long and well specified. These are written up below.
  - Prompt Motion has written an "improved prompt" for 211 entries. Most are instances of its house templates:
    - showreel (72);
    - product film (82, "Untested");
    - realtime 3D (5);
    - explainer and short film (about 30 between them).

    In these the look is a single "Style:" line. The remaining ~22 are bespoke rewrites of the creator's request. They
    are listed under "Not styles, but useful parts" (style seeds) rather than as styles.
  - 6 entries are skills (install command + GitHub repo). They are listed at the end; I did not read the skill repos
    themselves.

---

## Beat-Grid Transform Showreel (Prompt Motion "showreel" template)
- Source: https://prompt-motion.com/templates/showreel (+ `/templates/showreel/customize`). Licence: none stated;
  "Written by Prompt Motion".
- One line: a 15 s, 120 BPM showreel with one committed concept. Every shot is built out of the previous one (shape,
  type and colour become the next scene) and something happens on every beat. It loops.
- Suits: brand stings, channel intros, "what we do" reels, loopable hooks. No footage. A brief 2D-to-3D moment, done in
  pseudo-3D in the template's run; Blender could do it.
- The customize page offers **1080×1920**, 1080×1080 and 1080×1350 as well as 16:9.

### Palette
| role | hex | where used |
|---|---|---|
| Rule | — | "at most three colors plus black and white" |
| Example in the customize field | #FF4F1F | given as a sample entry ("#FF4F1F, cobalt blue, cream") |
| *Observed in the template's own run (sampled by me, not specified):* cream | ≈#F1ECE7 / #F0EEE8 | base canvas |
| *Observed:* red-orange | ≈#FE491C | floods, stripes, type |
| *Observed:* electric blue | ≈#2C3BFE | second accent (rings, bars, one type card) |
| *Observed:* black | ≈#111111 | type, discs, one type card |

### Typography
- **One typeface:** Geist, Inter, or "a bold display face from Google Fonts".
- **Not given:** sizes, case, tracking.
- **The template's run** uses heavy grotesk caps (`ONE` / `BAR` / `EVERY` / `BEAT`) filling the frame, swapped per
  beat across colour cards.
  - Small caps labels (`KICK`, `CLAP`, `HATS`…) sit beside data rings.
  - The end title is `Claude` with a small `Motion Design` line.

### Layout
- Not given.
- The run uses centred, full-bleed type and a centred radial chart.

### Elements
- **Range to show.** Five pieces, each with an **equal share of the time**:
  - Kinetic type.
  - Shape morphing.
  - A 2D-to-3D moment.
  - A data or UI moment.
  - An end title.
- **The run's interpretation.** Its concept is "one bar, every beat":
  - Stripes.
  - Primitive shapes (circle, square, triangle) morphing.
  - Stacked extruded discs (the 2D→3D moment).
  - Concentric rings.
  - A radial "beat" chart that counts beats (`17`, `18`, `19`, `20`) and labels each instrument.
  - A waveform bar field.
  - A type flood, then the end title.

### Motion
- **Easing.** Spring and exponential easing written as functions of time. No numbers are given.
- **Motion blur.** Blur follows speed and direction on fast moves.
- **Holds.** No hold longer than **0.5 s**.

### Transitions and rhythm
- **Tempo.** **120 BPM**, something on every beat. A beat is 0.5 s and a bar is 2 s.
- **Structure.**
  1. The first bar is the hook.
  2. Then one technique per bar.
  3. The last full bar is the strongest moment.
  4. The final half bar is the end title, and the last frame matches the first so it loops.
- **Transitions.** None as cuts: every shot transforms out of the previous one, with no cuts or fades.
- **Sound.** A kick on every beat, a riser into the last full bar, a hit on each scene change.
- **Pace dial on the customize page.** This is the useful part: one line is added to the prompt per setting.

  | Setting | What it adds |
  |---|---|
  | **Calm** | Slow eased moves; key moments held up to a full beat; cuts only on bar lines |
  | **Relaxed** | Changes on the beat, not between beats |
  | **Balanced** | The default; adds nothing |
  | **Brisk** | A change every half beat; nothing held longer than a beat |
  | **Frantic** | A cut or move every half beat or faster; overlapping moves; the frame never rests |

- **Other dials.** Creativity runs Safe … Wild and Polish runs Quick … Obsessive.
- **Customize ranges.** The page suggests 15–30 s and **100–128 BPM**.

### Finish
- **Final render.** 60 fps with **3 sub-frames per frame**, blended with `tmix`.
- **Not used:** grain or vignette (none is mentioned); glows and lens flares are banned.

### 3D look
- Only "a 2D-to-3D moment".
- The run shows stacked, extruded colour discs tilting into 3D. They are flat-shaded, with no lighting model visible.

### Banned
- Particle bursts.
- Glows.
- Lens flares.
- Camera shake.
- RGB split.
- Crossfades.
- Generic gradients.
- Bouncy easing.
- Holds longer than 0.5 s.
- Anything that looks like a template.

### Example frames
- Poster: https://media.prompt-motion.com/improved-showreel-1/poster.99975d64.webp
- Video: https://media.prompt-motion.com/improved-showreel-1/video.77d74909.mp4 (1920×1080, 60 fps, 15 s, with audio).

### Gaps
- No spring constants or easing curves.
- No type sizes.
- No colour values: the hexes above are sampled from the template's run.
- No vertical layout rules.
- The concept is left to the model, so the look varies run to run. Only the rules (one face, three colours, transform
  transitions, beat grid, bans) are fixed.

---

## Film-Camera Real-time 3D Gallery (Prompt Motion "realtime" / 3D template)
- Source: https://prompt-motion.com/templates/realtime. Licence: none stated; "Written by Prompt Motion".
- One line: a soft-daylight, white-space 3D world of video cards on curved walls, filmed with named camera moves. It
  builds to one signature overhead pull-back in which the corridors spell a wordmark.
- Suits: brand openers, gallery or portfolio reveals, product hero films, logo reveals.
- No footage, but the card textures are real video posters from the site. **3D is required**: three.js in the source,
  and it maps directly to Blender (Eevee or Cycles).

### Palette
| role | hex | where used |
|---|---|---|
| Rule | — | "Prompt Motion's own: black and white, Geist, one orange accent" |
| *Site CSS (my lookup, not in the prompt):* background | #FFFFFF | page |
| *Site CSS:* foreground | #111111 | type / wordmark |
| *Site CSS:* muted | #F2F2F2 | surfaces |
| *Site CSS:* muted text | #6B6B6B | secondary |
| *Site CSS:* orange-500 | #FE6E00 | the orange accent ("wave of orange light", the light tracing the O) |

### Typography
- **Font:** Geist (Google Font).
- **3D type.** The card's prompt is printed on its back and **lifts off as 3D type, line by line**.
- **End.** The wordmark `PROMPT MOTION` plus `prompt-motion.com`.
- **Banned:** "floating text labels".

### Layout
- **Shots.** Six shots of about **3 s** each (a 20 s capture).
- **Camera rules.**
  - The signature shot is designed first.
  - The camera never passes through geometry.
  - Near and far planes are kept tight.

### Elements
- Hundreds of video cards on gently curved walls, which form corridors.
- One card unhinges and swings toward the camera.
- Corridors seen from above resolve into the letters of the wordmark.

### Motion
- **Camera.** A film camera, not orbit controls.
  - Every shot uses **one named move** (dolly, crane, orbit, push-in, rack focus), eased in and out.
- **Things react to each other.** What is hit moves; what is near lights up.
  - Driven by springs or simple physics, never linear tweens.
- **Shot list.**
  1. Macro on a card edge, then rack focus to its playing video.
  2. Dolly back: an orange light wave runs along the wall and each card tilts slightly as it passes.
  3. Crane up over the wall to reveal more walls forming corridors.
  4. A card unhinges, swings in with weight and settles; its prompt lifts off as 3D type.
  5. The signature: pull far back and up while orange light traces the O.
  6. Settle on the wordmark.
- **Not given:** spring numbers.

### Transitions and rhythm
- Each shot lasts about 3 s, and shots are joined by camera moves.
- The template run (20 s, 30 fps, no audio) appears continuous.
- **Not given:** BPM or audio.

### Finish
- **Lighting.** Key, fill and rim lights with **soft shadows**.
- **Environment map.** A PMREM environment from `RoomEnvironment`.
- **Fog** for depth.
- **Materials.** `MeshPhysicalMaterial` with varied roughness.
- **Tone mapping.** **ACES**, with antialiasing.
- **Depth of field** only on the shots that need it.
- **Gotchas.**
  - Set the shadow bias, or acne stripes appear.
  - Keep near and far planes tight, or distant surfaces flicker.
  - Seed every random value.

### 3D look
- Soft-daylight studio white: physical materials, ACES, soft shadows and fog.
- The run shows light-grey curved walls of thin-bezel cards and black glossy extruded letters. An orange emissive light
  streak traces the O.
- **In Blender.** The equivalents are:
  - AgX or Filmic, or ACES via OCIO;
  - an HDRI or a studio environment;
  - a Principled BSDF with varied roughness;
  - volumetric fog or a mist pass;
  - DoF per shot.

### Banned
- Default materials and lighting.
- Floating text labels.
- Glows on everything.
- "A slowly spinning object as the whole idea".
- Anything that looks like a tech demo.

### Example frames
- Poster: https://media.prompt-motion.com/improved-realtime-1/poster.bb539d45.webp
- Video: https://media.prompt-motion.com/improved-realtime-1/video.22ccfd17.mp4 (1920×1080, 30 fps, 20 s, silent).
- **Variants built on this template** use the same rules with a one-line "Style:"; each has its own `/customize/<slug>`
  page:
  - Porco Rosso sunset dogfight: "Ghibli: hand-painted skies, purple cumulus…, stylised, not photoreal".
  - Van Gogh walk-through: "thick swirling strokes on every surface".
  - Beat-synced bouncing ball: "quality of a professional Blender piece, with some humor".
  - Skyraider scale model: "Navy grey over white, panel lines and rivets".
  - Anime robot combine: "cel shading, bold outlines, speed lines, dramatic low angles".

### Gaps
- No colour values in the prompt itself (the hexes above come from the site's CSS).
- No camera focal lengths or move durations beyond "about three seconds".
- No light intensities, fog density, ACES exposure or spring values.
- No audio.

---

### Gallery entries with full, well-specified prompts

Each entry below is a creator's prompt, quoted on the site as "taken directly from @creator's post". The licence is the
same for all of them: **none stated; the prompt belongs to its creator**. Several are built around a real brand (named
in each entry); keep the structure and values, and replace every brand element.

## Dark Navy & Gold Precision Film
- Source: https://prompt-motion.com/daniel-haida-8691d4 ("Taxtello bookkeeping app film", @daniel_haida, Remotion,
  "a few rounds"). Licence: none stated, creator's prompt. **The palette is Taxtello's real brand: re-pick the hues
  before using.**
- One line: an "Apple-level" fintech product film. Dark navy metal, one precious warm-gold accent, the real UI rebuilt
  as dimensional layers, and object-driven transitions, all with ruthless restraint.
- Suits: premium SaaS or fintech reveals, finance explainers, any product that should look expensive. No footage (the
  UI is rebuilt in React from the design system). No true 3D, only perspective and parallax.
- **Remotion-native.** It was built in Remotion, so it fits our engine directly.

### Palette
| role | hex | where used |
|---|---|---|
| Background | #0c0f1a | navy-black base |
| Elevated surfaces | #111525, #131722, #1a2032 | cards, panels |
| Brand gold | #e8b84b | the precious accent: active state, glint, wordmark |
| Gold highlight | #f5d07a | specular / highlight |
| Gold depth | #9b6d18 | shadowed gold |
| Primary text | #e8eaf2 | UI text |
| Warm white | #f6f4eb | strong headlines |
| Secondary text | #8b93b5 | labels |
| Positive | #34d399 | only for a truly positive state |
| Negative | #f87171 | only where semantically needed |

### Typography
- **Faces.** **Plus Jakarta Sans** (Google Font) for all text. **JetBrains Mono** (Google Font) for numbers and
  financial values.
- **Copy.** Very little.
  - At most about **3–4 words** per line (`Alles im Blick.`, `Belege. Erledigt.`).
  - Headlines fit on one line.
- **Type moves as designed objects.** Not every word animates on its own.
  - Type may occasionally scale very large and become the transition device itself.
- **End.** The gold wordmark plus one short brand line.

### Layout
- **Rule.** One shot is one idea, and every scene gets room to breathe. The product UI is the hero.
- **Format.**
  - Master: 1920×1080 at 60 fps, at most 15.0 s, with a target of 14–15 s.
  - A vertical variant should be **recomposed, not cropped**.

### Elements
- **Real UI surfaces.** The real UI is reconstructed and layered so that its regions animate separately. In the
  example:
  - the dashboard, with its hero number and chart;
  - receipts;
  - bookings;
  - invoices;
  - a tax-health ring.
- **Avoid.** No "cheesy scanner laser", no "floating paper tornado", no giant CTA.

### Motion
- **Easing.** A reference curve of **`cubic-bezier(0.16, 1, 0.3, 1)`**.
  - Overshoot **below about 2%**, plus anticipation, settling, and motion continuing across scenes with shared velocity.
  - No linear movement.
- **Overlap.** Elements arrive at subtly different times, with subtle stagger.
- **Camera.** It moves like a high-end macro product shoot, with no constant zooming.
- **Storyboard.** These are suggested times.

  | Time (s) | Scene |
  |---|---|
  | 0–1.2 | A gold glint reveals the mark on navy-black |
  | 1.2–4.4 | The cockpit as a dimensional surface: the hero number resolves, the chart draws, metrics settle later |
  | 4.4–7.5 | A chart point becomes a receipt corner; the document snaps magnetically into its booking |
  | 7.5–10.7 | Invoices; a status or payment resolves |
  | 10.7–12.8 | Tax clarity: noisy signals collapse into one calm overview, and the rhythm slows |
  | 12.8–15 | Pull out; the UI folds into one object; darkness returns; the gold wordmark resolves |

  - The first premium frame should land within 1.5 s, and the first product moment by about 2 s.

### Transitions and rhythm
- **Object-driven.**
  - A chart line becomes a document edge.
  - A gold pill becomes an invoice button.
  - A number becomes an invoice amount.
  - A card edge becomes the next surface.
  - The camera pushes through an element.
  - Masks use the product's own shapes.
- **Direct cuts.** Only for a deliberate rhythmic impact.
- **Tempo.** About **115–120 BPM**.
- **Sound.**
  - A low soft impact on the major reveal.
  - Restrained clicks.
  - A metallic or glass tonal tick.
  - Low movement under camera moves.
  - A resolved tone on the logo.
  - Avoid trailer booms, EDM risers and whooshes everywhere.

### Finish
- **Allowed treatments, all "extremely subtle".**
  - Soft gold rim light.
  - Dark navy falloff.
  - Faint ambient bloom.
  - A soft specular sweep across a surface.
  - A restrained vignette.
  - Subtle grain only if it helps.
- **The UI stays crisp.** No cinematic blur on the product, and no glossy reflections that hurt legibility.

### 3D look
None. Depth comes from perspective, soft parallax, foreground/background separation and controlled depth of field.

### Banned
- Cyberpunk, crypto, neon, gaming looks.
- Generic AI purple.
- Rainbow gradients.
- Particle spam.
- Glassmorphism everywhere.
- Excessive blur.
- Spinning 3D cards.
- Constant zoom.
- 20 animation styles.
- Bouncing UI.
- Marketing paragraphs.
- Crossfades.
- Random wipes.
- Spin transitions.
- Glitch.
- Whip-pans every 2 s.
- SaaS slide-left.
- Zoom-blur spam.

### Example frames
- Poster: https://media.prompt-motion.com/daniel-haida-claude-code-opus-5-5/poster.0d3769b3.webp
- Video: https://media.prompt-motion.com/daniel-haida-claude-code-opus-5-5/video.5fcad5e9.mp4 (1920×1080, 60 fps, 14.06 s).
- What it shows:
  - A gold `t` app mark.
  - A tilted navy dashboard with a big mono `48.260 €`.
  - A paper receipt snapping into bookings.
  - Green `Beleg verknüpft` pills.
  - A green tax ring.
  - A gold wordmark on near-black.

### Gaps
- No spring numbers.
- No type sizes.
- No vignette, bloom or grain values.
- The palette is a real brand's.

---

## Keynote Glass Blue Sting
- Source: https://prompt-motion.com/notdwd-7de38a ("Frame by Frame launch video", @notdwd). A near-identical version at
  `/notdwd-c2037d` adds "my brand colours mapped onto these roles". Licence: none stated, creator's prompt.
- One line: a 12 s Apple-keynote product sting in which the camera never rests. It is soft and white with bright
  blues, frosted glass, directional smears, and hard cuts placed exactly on the music.
- Suits: app or course launch stings, feature teasers, menu-bar and desktop app promos. No footage (one cover image per
  card). No 3D.
- **Format.** Square 1080×1080. Frames are numbered at 29.97 fps (f0–f359), and the master renders at 59.94 fps.

### Palette
| role | hex | where used |
|---|---|---|
| Page | #FDFDFB | main white page |
| Haze | #B7CFEB | opening blue haze |
| Ice | #E6F0FA | ice tint |
| Sky gradient | #294376 → #769CC2 | desktop wallpaper |
| Navy | #1E2F52 | app icon gradient end, menu bar |
| Accent blue | #2F6BFF | send button, orbit square, dot |
| Accent cyan | #3CC8F0 | orbit square, dot |
| Mint | #4ED6A0 | orbit square, dot |
| Floor glow | #DBEEFD | bottom glow in S1 |
| Window | #FCFDFF fill, #F1F6FF top band | hub window |
| Disc | #FBFCFE fill, 1px rim #E8E8EA | logo disc |
| Capsule pill | #2F2E2F | dark "on Whop" pill |
| Hover ring | #D5F3FF → #F7FEFF | ice ring round the disc |
| Body text grey | #BCBCBA | answer-page body |
| Flash | #E2F4FE / tint #E6F4FE | whip-tilt flash |
| Grey halo | #E9E9E7 | disc behind the app icon |
| End card | #020204 corners → ≈#272729 centre; word #F3F3F5 | black radial end card |

- **Banned colours:** no purple, violet, magenta or orange anywhere.

### Typography
- **Face.** **Inter** 400/500/600/700 (Google Font).
- **Header.** The name in Inter 500 on one line, beside a ⌀132 disc and a pill.
- **Answer page.** Body in **47 px** Inter 400 grey with a **58 px** line pitch. One key phrase is black 600.
- **Card captions.** Semibold 38 px, with a grey 23 px sub-caption.
- **Menu-bar clock.** 34 px.
- **"Frosted-glass" titles.** Huge bold titles cut off by the card's bottom edge. They are filled with a blurred,
  lightened copy of the image.
- **End wordmark.** Inter 600, with a tight glow plus a wide soft halo, the only glow allowed. It zoom-smears in from
  ≈1650 px wide to ≈516 px.

### Layout
- All coordinates are given in px on the 1080 stage, for example:
  - the header lockup spans x474–1063;
  - the glass prompt box is 726×228 at x196–922, y568–797;
  - the cards are 538×348 with radius 57 and a 36 px gap.
- The camera zooms about the centre (540,540).

### Elements
- **Light app window.** Radius 93.
- **Logo disc.** ⌀132.
- **Squircle app icon.** 276→178 px, radius 28% of its width. **Four 92 px squares** (radius 26) orbit and lock into a
  cross at a radius of about 216.
- **Mac menu bar** with Wi-Fi, battery and toggles, over the blue wallpaper. The wallpaper carries thin white line art:
  a circle, lines and a four-point sparkle.
- **Frosted glass prompt box.** Radius 60, with a bright top rim and a ⌀51 send button.
- **macOS cursor.** 32×39, black with a white outline. It rotates to face its direction of travel and grows **×1.55 on
  hover**.

### Motion
- **Entries.** Every shot enters already moving: an exponential ease-out covering **12–19% of the remaining distance per
  frame**.
- **Exits.** Shots leave on an accelerating move or a blur ramp.
- **Blur.** Blur follows speed and direction on every move.
- **Exact keyframe tables.** For example, the header centre line rises
  `y932 (f0) → 776 (f2) → 683 (f5) → 608 (f10) → 546 (f24) → 536 (f37)`, then drifts 1 px per frame.
- **Typing.** About **1 char per frame**, with a 1-frame hold every 2–3 chars. The caret is always on.
- **Glass box spring.** Its width peaks at 744 at f126 and settles to 726 by f138.
- **Whip-tilt.** About **25 px per frame** with a vertical blur of **6–8 px**.
- **Scroll settle offsets.** `420, 315, 210, 170, 140, 116, 96, 81 … 0` px.
- **Blur ramps.** For example `24 → 1.5 → 0` px, and `0.3 → 6` px into a cut.
- **The only freeze.** The logo-disc hold at f269–287.

### Transitions and rhythm
- **Tempo.** **124 BPM**: beat k = **0.048 + 0.4838·k s**, and one beat is 14.5 frames.
- **Hard cuts** at f72, f101 and f159. Each lands **2 frames before a beat**, on the music drop.
- **Blur-dissolves** happen at the blur peak. Others are whip-tilts through a light-blue flash.
- **Audio.** Exactly **12.075 s**.
  - The drop is at 2.47 s.
  - Whooshes peak at the cuts.
  - Clicks fall at 2.33 s and 3.83 s.
  - Key ticks come every ~32 ms.
  - Master at **−14 LUFS**, **−1 dBTP**.

### Finish
- **Directional blur.** SVG `feGaussianBlur` with separate x and y deviations.
- **End-card zoom smear.** **20–30 scaled, faded copies** of the word.
- **Frosted glass.** A blurred, lightened copy of the background, clipped to the shape.

### 3D look
None.

### Banned
- Crossfades.
- Frozen frames, except S7.
- Stock UI kits.
- Glows on UI text.
- `Math.random`.
- Anything template-like.

### Example frames
- Poster: https://media.prompt-motion.com/notdwd-another-one-1000-ai/poster.7b32a7a0.webp
- Video: https://media.prompt-motion.com/notdwd-another-one-1000-ai/video.c8dc9ba6.mp4 (1080×1080, 59.94 fps, 12.07 s).
- The brand-colour version is at https://media.prompt-motion.com/notdwd-stop-asking-opus-5-5/video.f0cd0bc3.mp4.

### Gaps
- Square only; a 9:16 layout would need re-laying.
- The palette and type are fully specified.
- Spring constants are given only as tables, not as parameters.

---

## Studio-Floor Page Fly-over (3D tilt-shift)
- Source: https://prompt-motion.com/twoclipping-d89be5 ("Landing page 3D scroll", @twoclipping). A shorter paraphrase
  with the same values is at `/pankajstwt-49978ed`. Licence: none stated, creator's prompt.
- One line: a real landing page lies flat on a bright studio floor. One unbroken camera glides down it with razor-thin
  focus while its cards and photos stand up toward the lens. The camera then rises overhead and dives into the hero
  for a two-line title.
- Suits: website launches, portfolio or landing-page promos, product pages.
- **Needs** a capture of a real web page (screenshots of the page plus its pieces cut out).
- **3D: yes.** A WebGL2 camera in the source; it maps directly to Blender (planes + DoF camera).

### Palette
| role | hex | where used |
|---|---|---|
| Floor centre | #f9fbfb | studio floor |
| Floor corners | #f2f3f6 | studio floor falloff |
| Lift shadow | #1a2133 at 26% | shadow of each lifted piece |
| Italic tail | #8b8b92 | grey second line of the title |
| Badge | white pill | brand badge on the end card |

### Typography
- **Title line 1.** **Geist 500** at **74 px**, one word every **0.06 s**.
- **Italic tail.** **Instrument Serif** (Google Font) at **82 px**, one word every **0.05 s**.
  - Each word rises **16 px** out of a **12 px blur** in **0.34 s**.
- **Badge pill.** 21 px, at y 44.
- **Rule.** No text over the page before the end card.

### Layout
- **Format.** 1440×1152 at 60 fps, 14.5 s.
- **Page.** 24 px rounded corners. It lands as a **1018 px-wide card** with **38 px corners**, its top at **y 283**.
- **Logo tiles.** Four tiles of 32 px grow to **140–200 px** and hang outside the page's top corners.

### Elements
- **Lifts.**
  - Floating cards, mockups, photos, chips and the testimonial lift **20–40 px** (most of them).
  - Some lift up to 60–200 px and stand up **30–54°** toward the lens.
- **Example values.**
  - Hero chips: 60–80 px, standing up 30°.
  - Photos: 100–130 px at 46°.
  - Chips: 200 px at 54°.
  - The testimonial: 22 → 112 px at 30°, showing a 34 px white edge.

### Motion
- **Timeline.**

  | Time (s) | Phase |
  |---|---|
  | 0–8.2 | Flight |
  | 7.75–9.25 | Rise |
  | 9.25–9.47 | Overhead |
  | 9.47–9.97 | Dive |
  | 9.97–14.5 | Title card |

- **Camera geometry.**
  - **56° off straight-down**.
  - Focal length **1880 px**.
  - Distance **1360 → 1700 px**, never back in, and the camera never turns.
- **Speed curve.** Expressed as a share of a cruise speed of about **770 page px/s**:

  | Time (s) | Share of cruise |
  |---|---|
  | 0 | 0 |
  | by 0.6 | 0.5 |
  | to 1.25 | held at 0.5 |
  | by 1.6 | 1.0 |
  | to 7.3 | held between 0.94 and 1.1 |
  | by 8.3 | eases to 0.12 |

  - Position is the integral of this curve.
- **Rise.** Log-scale zoom-out with a trapezoid speed profile: up over 7.75–8.35 s, even over 8.35–8.95 s, down by
  9.25 s.
- **Dive.** Log scale on a quadratic ease-in-out.
  - A rounded-rect mask morphs from 24 to 38 px corners.
- **Hold.** The card creeps **2%** closer over 10.6–14.5 s.

### Transitions and rhythm
- **Shot.** One continuous camera with no cuts.
- **Sound.**
  - The music hit lands at **9.97 s**.
  - Whooshes at **8.66 s** and **9.80 s**.

### Finish
- **Depth of field per pixel.**
  - In front of focus: blur = **75 × (focus − depth) / depth**.
  - Behind focus: blur = **6 × (depth − focus) / depth**.
  - Capped at **120 px**.
  - Sampled with **40 golden-angle taps** from a matched mip level.
- **Shadow of each lift.**
  - Offset **(0.10z, 4 + 0.36z)**.
  - Blur **7 + 0.5z**.
  - **26%** opacity.
- **Motion blur.** **16 sub-frames** spread over **0.7 of a frame**.
- **Textures.** Mipmaps with 16× anisotropic filtering.

### 3D look
- A bright, shadowless-looking studio floor (only soft contact shadows).
- Tilt-shift macro depth of field.
- Paper-thin cards standing up.

### Banned
- Cuts.
- Crossfades.
- Stops or surges in the glide.
- The camera turning or swinging sideways.
- Zooming in and back out.
- Glows.
- Text over the page before the end card.

### Example frames
- Poster: https://media.prompt-motion.com/twoclipping-d89be5/poster.11e3b3b3.webp
- Video: https://media.prompt-motion.com/twoclipping-d89be5/video.c1c2a37f.mp4 (1440×1152, 60 fps, 14.55 s).
- The variant is at https://media.prompt-motion.com/pankajstwt-49978ed/video.1313695c.mp4.

### Gaps
- No vertical framing.
- No music style specified.
- Depends on a real page capture.

---

## Liquid-Glass Keynote One-Take (photo product)
- Source: https://prompt-motion.com/twoclipping-221cab ("Photo print app launch film", @twoclipping). Licence: none
  stated, creator's prompt.
- One line: an Apple-keynote launch film in one continuous 2D take. A black shape keeps morphing (wordmark → pill →
  iris → grid → glass toolbar → phone → Mac window → order states → flood), with iOS-style liquid glass over real
  photos.
- Suits: photo, camera or creative-app launches, consumer product films.
- **Needs** 9–12 hi-res photos, plus one real stock clip (a wall with moving plant shadows). No 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | not given ("warm off-white"; observed ≈#EBEBE6 in the run) | base |
| UI | not given ("black UI") | pills, morphing shape, buttons |
| Glass | — | iOS 26-style liquid glass over photos |

### Typography
- **Wordmark.** **Archivo** (Google Font, variable) at **wdth 125, weight 800**. The demo wordmark is `develop.`.
- **UI.** **Geist**.
- **Wordmark squeeze.** Every letter moves toward the dot by the same factor while its width narrows on the `wdth` axis,
  so the letters stay touching.

### Layout
- **Format.** Square 1440×1440 at 60 fps.
- **Camera.** Zooms "screen-studio style" so each moment fills the square. The cursor scales with it.

### Elements
- **Iris.** Six blades around a hexagonal aperture.
- **Grid.** Unfolds like a paper map (centre, then plus, then corners) and reflows into a bento.
- **Glass toolbar.** A glass word melts into a droplet that stretches into the toolbar.
- **Glass slider.** Relights a photo from day to golden hour.
- **Glass orb** and a lock screen with glass clock digits.
- **Dynamic Island.** Stretches like liquid and grows into a Mac window that rolls up like a blind.
- **Framed print.** The mat and moulding grow out of the photo's edge.
- **Order states.** Ordered ✓ → Printing % → On its way (a van on a route) → Delivered ✓.

### Motion
- **Rules.** Text rises out of a mask line; icons pop from zero on a spring; bars draw across; pages push.
- **Springs.** Closed-form springs, summed per target change. No values are given.
- **Cursor.** Real clicks, drags and long-presses.

### Transitions and rhythm
- **Tempo.** **120 BPM, 54 beats** (27 s), something on every beat.
  - The zoom lands on the drop.
  - The wall shot sits in the breakdown.
  - The wordmark returns with the beat.
- **Loop.** The last frame equals the first.
- **Flood.** A black shape floods edge to edge, holds black for a beat, and contracts into the next scene.
  - The flood must **overscale past the corners** and take about **0.3 s**.
- **Holds.** No hold longer than 1 s.
- **Sound.** A downloaded SFX per event, placed by its measured peak. Mastered at **−14 LUFS**.

### Finish
- **Liquid glass.** Each glass element clones the scene behind it and distorts it with an SVG `feImage` displacement map
  built from a rounded-rect distance field.
  - **Three `feDisplacementMap`s at slightly different scales** give chromatic edges, plus a rim light.
- **Goo.** Blur, then an alpha threshold, with the source composited on top.
- **Motion blur.** 4 sub-frames per frame.

### 3D look
None ("2D only"; 3D flips are banned).

### Banned
- Crossfades.
- Blur-ins.
- Brightness "developing".
- 3D flips.
- Particles.
- Glows.
- Holds longer than 1 s.
- Template looks.

### Example frames
- Poster: https://media.prompt-motion.com/twoclipping-opus-5-5-is-the/poster.3055d7b1.webp
- Video: https://media.prompt-motion.com/twoclipping-opus-5-5-is-the/video.7b6c0f2a.mp4 (1440×1440, 60 fps, 29.08 s).

### Gaps
- No hex values.
- No spring constants.
- No type sizes.

---

## AI-Lab White Launch with Spoken Captions
- Source: https://prompt-motion.com/rossaxbt-3085b7 ("Ora 2 image model launch film", @rossaxbt). Licence: none stated,
  creator's prompt.
- One line: an AI-lab launch film. White canvas, one typeface, black ink and real images. Captions are typed word by
  word exactly when they are spoken, and every control is liquid glass over a pastel aura.
- Suits: AI or creative-tool launches, voice-over product films.
- **Needs** real images (40+), product screenshots and a voice-over. No 3D (banned).

### Palette
| role | hex | where used |
|---|---|---|
| Ink | #111214 | type, chips |
| Canvas | not given ("white canvas"; observed #FFFFFF) | base |
| Aura | brand colours, pastel | slow aura or a blurred photo wash behind glass |
| Emphasis word | gradient of brand colours + faint glow | the single emphasised word |

### Typography
- **Face.** One typeface; default **Geist**.
- **Captions.** Typed word by word at the spoken time; no full stops shown on screen.
- **Emphasis.** Exactly one word types in a brand gradient with a faint glow behind it.

### Layout
- Square **1440×1440** at **60 fps**, 22 s.

### Elements
- **Glass prompt bar** with a black style chip that rolls to each new name.
- **Thumbnail strip.**
- **Moodboard.** 9 images fly into a 3×3 grid, then circle the result.
- **Glass settings panel** with 3 sliders.
- **Finale.** A burst of 120 images behind a glass caption pill, which converge into the logo.

### Motion
- **Camera.** Always drifting: a push from **1.0 → 1.04 per scene**. Each scene starts at the zoom the previous one
  ended on.
- **Fades.** Eased, at least **0.3 s**. "A 0.05 s fade looks like an instant pop-in."
- **Image changes.** On **16th notes**, with a click each. At the default 129.83 BPM a 16th note is ≈0.116 s (my
  arithmetic).

### Transitions and rhythm
- **Scenes.** Seven, timed to the voice. Scene changes land on phrase starts.
- **Drop.** The music drop is aligned to the "[Verb] in ANY style" line.
- **Voice-over editing.**
  - Pauses longer than 0.28 s are cut to 0.2 s.
  - Phrases are levelled 85% toward the median.
- **Music ducking.** A 3-band sidechain:
  - lows 30%, mids 85%, air 55%;
  - 0.3 s hold, 50 ms look-ahead, 0.5 s release.
  - The voice sits about **9 dB above** the music between 300 Hz and 4 kHz.
- **Mastering.** **−14 LUFS**.

### Finish
- **Liquid glass.**
  - The body is the scene behind it blurred about **14 px**.
  - A **12 px** edge band is magnified **1.06×**.
  - Then milk, sheen, a bright rim and a soft lift shadow.
- **Motion blur.** **8 sub-frames**.

### 3D look
None ("3D" is banned).

### Banned
- Selection-box highlights ("looks like a Windows text selection").
- Beat-snapped slams.
- White flashes.
- 3D.
- Templates.

### Example frames
- Poster: https://media.prompt-motion.com/rossaxbt-3085b7/poster.cf192678.webp
- Video: https://media.prompt-motion.com/rossaxbt-3085b7/video.7261bee4.mp4 (1080×1080, 60 fps, 22.1 s).

### Gaps
- No type sizes.
- No aura colours beyond "brand".
- Spring values are not given.

---

## Warm-White Lime Composer Launch
- Source: https://prompt-motion.com/ultimaxbt-2ddf1e ("Food craving launch film", @ultimaxbt). Licence: none stated,
  creator's prompt.
- One line: a one-take 2D launch film. Warm white with black UI and a lime accent, and an iridescent "AI glow" round the
  input box. Each scene grows out of the last, with colour floods and a shared-element handoff.
- Suits: consumer AI apps, chat or assistant products, ordering and booking apps.
- **Needs** real product photography for the result cards. No 3D (banned).

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | #f5f5f2 | warm white base |
| UI | #0e0e10 | black UI, buttons, food cards, outro page |
| Accent | #cdf24f | lime: ripple, flood, chat bubbles |
| Orange | #ff6a2a | the wok, a secondary accent |
| Send button | #2f6bff | blue send button |
| AI glow | pink → orange → lime → cyan → violet | blurred rotating conic gradient round the composer |

### Typography
- **UI.** **Geist**.
- **End card.** A serif for the product name; no face is named.
- **Outro lines.** **92 px**, white on black, word by word.
- **Typed request.** On **three fixed lines**, so the camera never chases a wrapping caret.

### Layout
- **Format.** 1920×1080 at 60 fps, 14.8 s.
- **Phone.** A 428×900 screen with an **11 px** black bezel and a `9:41` status bar.
- **Food cards.** **330×440**, radius **28**, dark, with the photo on top, then name, one-liner, price and rating.

### Elements
- The glowing composer.
- A chat bubble.
- A "thinking" wok tossing 6 ingredients on beats 8–11, under shimmering text `Finding something for you…`.
- A card strip with a `Best match` pill.
- Two pills: `Order now` (black) and `More options` (outlined).
- A spinner, then `✓ Ordered`.
- A courier dot running along a route to a pin, which becomes the brand mark.

### Motion
- **Camera.** **One eased move per scene**. It never zooms in and out back to back, and never reverses direction.
  - Keyed as `[time, zoom, x, y]`, with zoom interpolated in **log space**.
  - The first push is about **3×** into the composer.
- **Pops and settles.** Closed-form springs; no values given.

### Transitions and rhythm
- **Tempo.** **130 BPM, 32 beats** (14.8 s). The song starts 12 beats before its drop.
- **Beat map.**

  | Beats | Section |
  |---|---|
  | 0–6 | Ask |
  | 6 | Send: a lime ripple turns the message into a bubble, then a pull-back reveals the phone |
  | 6–12 | Think |
  | 12 | The drop: a lime flood fills the frame in **≈0.35 s** |
  | 16–21 | Chat |
  | 21–32 | Outro |

- **Shared-element handoffs.** The lime flood carries a copy of the bubble's words; the button carries its label into
  the page.
- **Sound.** A Mixkit SFX per event, placed by its measured peak. Mastered at **−14 LUFS**.

### Finish
- **Motion blur.** **8 sub-frames**: "four subframes leave ghost copies on fast moves".
- **Allowed glow.** The iridescent composer glow is the only glow.

### 3D look
None.

### Banned
- Crossfades.
- Blur-ins.
- 3D.
- Particles.
- Camera moves that reverse.
- Holds longer than 1 s.
- Template feel.

### Example frames
- Poster: https://media.prompt-motion.com/ultimaxbt-2ddf1e/poster.0bb4ae48.webp
- Video: https://media.prompt-motion.com/ultimaxbt-2ddf1e/video.ba2087f8.mp4 (1920×1078, 30 fps, 16.26 s).

### Gaps
- No spring values.
- The end-card serif is not named.
- No sizes for the composer.

---

## Typographic Architecture (spoken-word monument)
- Source: https://prompt-motion.com/gdgtify-287ddf ("Speech built as architecture", @gdgtify). Licence: none stated,
  creator's prompt.
- One line: a literary, monument-scaled kinetic-type film. Words take structural roles (lintel, suspended load, support,
  opening, platform) and the final line stands on a floor the earlier words built.
- Suits: manifesto or quote films, speeches, poetry, brand statements, any "words only" piece.
- No footage, no 3D. Audio optional.

### Palette
| role | hex | where used |
|---|---|---|
| Background | #102820 | deep green-black field |
| Paper | #F4E9D5 | all type |
| Structural accent | #F2B544 | baseline, suspension rules, timing bar |

### Typography
- **Speech.** A high-contrast serif.
- **Load-bearing words.** A heavy grotesque.
- **Timing marks.** A restrained monospace, small.
- No faces are named. In the run the serif looks Playfair-like and the grotesque Archivo-Black-like; that is my
  impression, not the source.
- **Glyphs.** Real glyph paths are used for the structural words, and counters stay legible during deformation.
- **Emphasis.** Through **shared alignment and scale**, never a separate effect.

### Layout
- **Format.** 1080×1080 at 60 fps, a **20 s periodic loop** (`render(0) = render(20)`), 1200 frames.
- **HUD.** A thin mono cue label (`CUE 01` … with a time range) plus a progress tick at the top. Seen in the run.

### Elements
- **WAIT** is a massive lintel over a narrow opening that slowly compresses.
- **WAITING** hangs on two fine vertical rules that become suspension cables, and the baseline bends under it.
- **VOICE** rotates into a vertical support and lifts the baseline.
- The **O in ROOM** becomes an aperture.
- **FLOOR** is a platform.

### Motion
- **Settling.** Critically damped motion for the settling loads.
- **Elastic deformation.** Controlled, and only on the baseline.
- **Stillness.** At least one moment of absolute stillness of **≥ 400 ms**.
- **Phrase reveals** follow reading order.
- **Transitions between unrelated words.** Occlusion or matched structural edges, never point-by-point path
  interpolation.

### Transitions and rhythm
- **Cues.** A cue sheet by phrases, pauses and emphasis, **not a dance beat**.

  | Time (s) | Line |
  |---|---|
  | 0–3 | Line 1 |
  | 3–6.5 | Line 2 |
  | 6.5–10 | Line 3 |
  | 10–12.5 | Line 4: the first perfect horizontal, with a brief stillness |
  | 12.5–16 | Line 5 |
  | 16–18 | Hold |
  | 18–20 | Track under the platform back to the opening, resetting under full occlusion |

### Finish
None mentioned. The run is flat and clean.

### 3D look
None.

### Banned
- Protest-poster clichés: megaphones, flags, crowds, microphones.
- Stock footage.
- Camera shake.
- Restless decorative motion during holds.

### Example frames
- Poster: https://media.prompt-motion.com/gdgtify-inspired-by-what-techhalla/poster.603cbafe.webp
- Video: https://media.prompt-motion.com/gdgtify-inspired-by-what-techhalla/video.ca1fedfb.mp4 (1080×1080, 60 fps, 20 s).

### Gaps
- No font names.
- No sizes.
- No spring or deformation values.

---

## Rounded Dark Stage Product Film (music-app look)
- Source: https://prompt-motion.com/brainextends-e19ac3 ("Spotify product film", @brainextends). Licence: none stated,
  creator's prompt.
- **The prompt is explicitly "Spotify-themed"**, with Spotify's icon, wordmark and green. Use only the layout idea;
  replace every brand element.
- One line: a premium app film staged inside a big near-black rounded "stage" that floats on an atmospheric gradient. A
  persistent mini player bar ties about 1 s ideas together through match-position handoffs of one hero artwork.
- Suits: music, media or consumer-app product films. No footage; generated artwork. No 3D, just perspective tilts.

### Palette
| role | hex | where used |
|---|---|---|
| Accent | #1ED760 (Spotify green: **replace**) | emphasis words, controls, brand fill |
| Stage | not given ("nearly black") | inner rounded stage |
| Outer background | not given | luminous emerald top-left → deeper forest green at the sides → near-black at the bottom |
| Text | white primary, muted grey secondary | — |
| Hero art | lavender, powder cyan, blush pink, champagne gold, mint | iridescent "liquid silk" cover |
| Sleeves | mustard yellow, pink, blue + complements | playlist covers |

### Typography
- **Face.** One clean sans: Geist or Inter.
- **Two-line statements.** White first line, accent second line (`Find your` / `rhythm`).
- **Size.** Advertising-sized, "not oversized presentation headings".

### Layout
- **Stage.** About **80% of canvas width × 75% of height**, centred horizontally and slightly below centre.
- **Content.** Compact and centred, with a lot of negative space. Everything is clipped to the stage.
- **Format.** 1920×1080 at true 60 fps, 18 s. The run was 30 fps.

### Elements
- **Persistent player bar.** Narrow and rounded, with a thumbnail, title and artist, play and skip, a thin progress
  track and volume. Dark, translucent, with a fine border.
- **Screens.** A sidebar UI, album cards, track rows, a search field, and a big cover.
- **Playlist sleeves** with bold type and geometric motifs.

### Motion
- **Pacing.** Most ideas last about **1 s**.
- **Easing.** Critically damped springs or smooth easing; no repeated bounce.
- **Transitions.** Match-position transitions, masked vertical reveals, perspective settles.
- **Text.** Outgoing titles leave before incoming ones take the space.
- **Covers.** They converge into the logo from the same centre.

### Transitions and rhythm
- **Timeline.** Given second by second.

  | Time (s) | Shot |
  |---|---|
  | 0–0.6 | Icon |
  | 0.6–1.5 | Two lines |
  | 1.5–2.4 | Interface rises with a tilt |
  | … | … |
  | 15.2–18 | Lockup and hold |

- **Music.** About **120 BPM** electronic. SFX quieter than the music.

### Finish
- **Motion blur.** **3–5 temporal sub-frames**, restrained; stationary text stays sharp.
- **Zoom.** Controlled blur during the fastest zoom.

### 3D look
None, beyond perspective tilts on cards.

### Banned
- Particles.
- Shockwave rings.
- Lens flares.
- Camera shake.
- Stock footage.
- Full-frame crossfades.
- Overlapping text.
- Camera resets.
- Long blank intervals.
- Outer captions or watermarks.

### Example frames
- Poster: https://media.prompt-motion.com/brainextends-opus-5-5-is-f-cking/poster.967d6a5e.webp
- Video: https://media.prompt-motion.com/brainextends-opus-5-5-is-f-cking/video.783005a8.mp4 (1920×1080, 30 fps, 18.07 s).

### Gaps
- Only one hex, and it is a brand's.
- No type sizes.
- No springs.

---

## Orange Dot Through-Line
- Source: https://prompt-motion.com/ultimaxbt-bbebf5 ("Orange dot motion system", @ultimaxbt). Licence: none stated,
  creator's prompt.
- One line: warm off-white and near-black. A single vivid orange dot connects every scene: it is a toggle knob, the dot
  of an i, a spring-graph marker, a flood, a halftone centre, and the end card's full stop.
- Suits: brand or motion-system intros, design-studio reels, loops. No footage, no 3D.

### Palette
| role | hex | where used |
|---|---|---|
| Canvas | not given ("warm off-white"; observed ≈#EDE9E1) | light scenes |
| Dark | not given ("near-black"; observed ≈#14120E) | dark scenes |
| Accent | not given ("one vivid orange") | the dot, toggle, flood, numbers |

### Typography
- Bold grotesque (no face named), in sentence case and caps.
- **Letter-by-letter transforms.** `Reduce Motion` bends into `Motion`.
- **Orbiting words.** Caps words orbit the dot on a circular path (`SPRINGS · EASING · KINETIC TYPE · 3D · SOUND`).
- **End card.** `Opus 5.5` / `Motion designer.` / `0 keyframes`, with the accent on the full stop and on the `0`.

### Layout
- 16:9, 1920×1080 at 60 fps, about 15 s.

### Elements
- A toggle.
- A spring graph whose curve is drawn from **the same spring function that moves the dot**.
- A `+22%` callout.
- A circle that becomes a rotating rounded square, then a pill.
- A **halftone dot field** whose dot sizes respond to the orange dot.

### Motion
- Small spring overshoots and no dead time. The shape keeps its position through each state change.
- **Floods** scale past all four corners.

### Transitions and rhythm
- A change on every major beat; BPM not given.
- The loop returns through the halftone, the graph and the toggle, and the first frame matches the last.

### Finish
None (gradients and glows are banned).

### 3D look
None.

### Banned
- Stock footage.
- Gradients.
- Glows.
- Particle bursts.
- Random transitions.
- Motion not connected to an element already on screen.

### Example frames
- Poster: https://media.prompt-motion.com/ultimaxbt-bbebf5/poster.8609bc84.webp
- Video: https://media.prompt-motion.com/ultimaxbt-bbebf5/video.1fb88a84.mp4 (1920×1078, 60 fps, 15.1 s).

### Gaps
- No hex values.
- No fonts.
- No BPM.
- No springs.

---

## High-End Minimal Real-Footage Promo
- Source: https://prompt-motion.com/twoclipping-6dd14e ("UGC ad generator promo", @twoclipping). Licence: none stated,
  creator's prompt.
- One line: high-end minimal. One idea per shot, a lot of empty space, one accent and a tight-tracked sans. It moves
  from a light hook into a dark stage of real vertical clips (a wall, a 3D carousel, a phone) on a strict 2 s bar grid.
- Suits: UGC, ads or creator tools, any product whose output is video.
- **Needs** 10–20 real vertical clips the user owns. Some 3D (a carousel with floor reflections, done in CSS 3D).

### Palette
| role | hex | where used |
|---|---|---|
| Accent | not given ("one accent colour"; red-orange in the run) | key word, logo |
| Light hook | not given (warm off-white in the run) | bar 1–2 |
| Dark stage | not given (black in the run) | after the drop |

### Typography
- **Face.** One clean sans, Geist or Inter, with **tight tracking**.
- **Reveals.** Masked type reveals.
- **No full stops** in on-screen text.

### Layout
- 1920×1080 at 60 fps, 10 bars × 2 s = 20 s.
- One idea per shot, a lot of empty space.

### Elements
- A hook word that morphs into the product UI, with a cursor typing and clicking.
- A wall of real clips with a scan line and 3 winners.
- **A 3D carousel of real videos with floor reflections**, and a motion-blurred whip onto one hero clip.
- A phone beside a panel that flips into results.
- Big stats on push cuts. Our engine must not invent stats; the run shows `3.8x`.
- A 3-word ticker, a logo reveal, a fade to black.

### Motion
- One smooth camera language and match cuts. No springs specified.

### Transitions and rhythm
- **Tempo.** **120 BPM, 10 bars of 2 s**.
  - Every cut sits on a downbeat, and every UI hit on a beat.
  - A circle opens out of the button into the dark scene on the drop.
- **Beat grid.** Calibrated to the real kick hits.
- **Sound.** SFX placed by their measured peak. Mastered at **−14 LUFS**.

### Finish
- **Motion blur.** **3 sub-frames at t − 1/240, t and t + 1/240 s**.
- **Gotcha.** Never set opacity or filter on a `preserve-3d` element; fade its wrapper instead.

### 3D look
CSS 3D carousel with floor reflections.

### Banned
- Shockwave rings.
- Particle bursts.
- RGB split.
- Camera shake.
- Lens flares.
- Neon glows.
- Grid floors.
- Flashing backgrounds.
- Bouncy easing.

### Example frames
- Poster: https://media.prompt-motion.com/twoclipping-wow-motion-designers-are/poster.4ef12655.webp
- Video: https://media.prompt-motion.com/twoclipping-wow-motion-designers-are/video.c1ad3270.mp4 (1920×1080, 60 fps, 20.06 s).

### Gaps
- No hex values.
- No sizes.
- No easing values.

---

## Paper & Marker Kinetic Explainer
- Source: https://prompt-motion.com/ik-builds-b8bdcf ("Paper-style product launch film", @ik_builds; HyperFrames +
  GSAP). Licence: none stated, creator's prompt.
- One line: a 15 s product explainer on a paper-light canvas. Handwritten marker notes draw on, a physics ball bounces
  with onion-skin trails, huge kinetic type appears, and the film switches hard between light and dark.
- Suits: B2B or AI product explainers, "what it learns" stories. No footage, no voice-over, no 3D.
- It is a **template**: colours and brand fonts are placeholders (`{{COLOR_CANVAS}}` / `{{COLOR_INK}}` /
  `{{COLOR_ACCENT_1}}` / `{{COLOR_ACCENT_2}}`).

### Palette
| role | hex | where used |
|---|---|---|
| Canvas / ink / 2 accents | placeholders | the notes use the accents; dark mode is "charcoal matching the palette" |
| *Observed in the run:* paper | ≈#D6D7CF at the corner (vignetted) | canvas |
| *Observed:* accents | teal ball, rust-red marker | — |

### Typography
- **Kinetic type.** **Anton** (Google Font).
- **Handwriting.** **Caveat** (Google Font), drawn on with `stroke-dashoffset`.
- **Brand.** Brand fonts plus the real logo mark.
- **Copy rule.** No animator jargon on screen ("squash", "stagger", "easing"…).

### Layout
- 1920×1080. A new idea every **1.5–2 s**.
- No chrome: no scrubber, timecode, fps counter or headers.

### Elements
- Marker notes and arrows that draw on.
- Sticky notes.
- Document cards.
- A physics ball with **onion-skin** trails.
- A connection graph.
- A line chart with a crossed-out "ceiling".

### Motion
- **Principles named:** real easing, squash and stretch, stagger, overlap, onion skin, smear, follow-through.
- One primary move per transition.
- No generic push, slide or rotate-swing.
- Every from-state is set at t = 0, so the timeline is seek-safe.

### Transitions and rhythm
- **Hard light/dark switches.**
- **Music in sections.** The drums drop out on the dark switch and while the ball is airborne, then slam back on the
  type and the logo.
- **SFX.** Pops, pen scribbles, whooshes, a logo sub-hit.
- **Mastering.** **−14 LUFS, −2 dBTP**, re-measured after the AAC encode.

### Finish
The run shows a paper texture with a soft vignette. Neither is specified.

### 3D look
Extruded 3D type appears in the run's kinetic-type scene. It is not specified.

### Banned
- Invented results (%, multipliers, customer names).
- A boxed logo file.
- Generic transitions.

### Example frames
- Poster: https://media.prompt-motion.com/ik-builds-i-was-quoted-3000/poster.756fe33b.webp
- Video: https://media.prompt-motion.com/ik-builds-i-was-quoted-3000/video.12e81ac7.mp4 (1920×1080, 60 fps, 15.06 s).

### Gaps
- Colours are placeholders.
- No sizes.
- No timing values beyond 1.5–2 s per idea.

---

## Through-Line Object Product Film (Prompt Motion "product film" improved template)
- Source: Prompt Motion's improved prompt, which appears on **82** `/customize/<slug>` pages, for example
  https://prompt-motion.com/customize/steventey-0d20e4. Marked "Untested". Licence: none stated; written by Prompt
  Motion.
- One line: a 15 s SaaS film in which one object taken from the product (cursor, key button, logo mark, a data point)
  turns into every scene and finally becomes the logo. The UI is rebuilt as vector layers, a cursor drives it, and
  there are screen-studio zooms.
- Suits: any SaaS launch. No footage (the UI is rebuilt). No 3D.

### Palette
- The brand's own colours.
- **One accent, used only on the through-line object and the key word.**
- A lot of empty space.

### Typography
- One typeface, the brand's own.
- **Hook.** The problem in 3–5 words of big type, which the through-line object interrupts.

### Layout
- 1920×1080 by default. Nothing else is given.

### Elements
- The real UI rebuilt as vector layers ("never slide a flat screenshot in").
- A cursor with real clicks and drags.
- An end card with the name and a one-line CTA.

### Motion
- **Springs.** At most a small overshoot.
- **Nothing appears from nothing.** Things grow, unfold or are revealed by a mask.
- **Camera.** Never sits still: a push from **1.0 → 1.04 per scene**, and each scene starts at the zoom the last one
  ended on.
- **Motion blur.** Blur follows speed and direction.

### Transitions and rhythm
- **Tempo.** **120 BPM**, a change on every beat.
- **Structure.** Hook (first bar), then 3–4 moments, then the payoff on the biggest beat.
- **Sound.** A kick every beat and a hit on each scene change.

### Finish
- 60 fps, 3 sub-frames, `tmix`.

### Banned
Same list as the showreel template:
- Particle bursts.
- Glows.
- Lens flares.
- Camera shake.
- RGB split.
- Crossfades.
- Generic gradients.
- Bouncy easing.
- Holds longer than 0.5 s.
- Template look.

### Example frames
None: the template is "Untested", and each entry's video is the creator's original run.

### Gaps
Almost every visual value comes from the brand, so this is a ruleset rather than a look.

---

## Variants of Barty-Bart styles found in the gallery
- **Morphing UI States Loop.**
  - Sources: https://prompt-motion.com/twoclipping-5cba86 and https://prompt-motion.com/demonugc-4c5753; the two
    prompts are identical.
  - It is a standalone, looping version of **One-Shape Morph B-roll** above:
    - the same warm-grey canvas, black-and-white components, Geist;
    - the same summed closed-form springs, leading/trailing-edge springs, and direct-manipulation drags;
    - the same `will-change` gotcha.
  - **Format.** 1440×1440, **120 BPM, 7 bars**, 4 sub-frames at 60 fps.
  - **State chain.** Button → loader → check → dynamic island → music player (play/pause morph) → scrub → a volume slider
    that stretches past max → toggle → liquid tab indicator → a chart that draws itself, with a tooltip → ⌘K → filter →
    toast → back to the button.
  - **Banned:** the same as motion-broll. The text matches Barty-Bart's style defaults almost word for word.
  - Videos:
    - https://media.prompt-motion.com/twoclipping-opus-5-5-is-f-cking/video.eef090ae.mp4
    - https://media.prompt-motion.com/demonugc-opus-5-5-is-f-cking/video.8b5d1453.mp4
- **White Ball UI Loop.**
  - Source: https://prompt-motion.com/rossaxbt-94583b.
  - It is a 10 s, 16:9 version of **One-Take Hero Journey**:
    - a near-black canvas with a faint dot grid;
    - charcoal controls, one blue accent, a white ball;
    - the same station labels (`Slider - Reached 100`, `Gravity - Something is falling`, `Messages - What now?`,
      `retry`);
    - camera position and log-space zoom through one world;
    - a brief squash on impact;
    - a loop matched on ball direction and cursor.
  - **Banned:** hard cuts, stock footage, glows, particle bursts, disconnected transitions, excessive bouncing,
    **blurry text during camera moves**.
  - Video: https://media.prompt-motion.com/rossaxbt-94583b/video.1377563a.mp4

---

## Gallery skills (install command given; repos not read)
These six entries are skills, not prompts. They lie outside the two named sources, so I recorded only the link and the
site's one-line description:
- `Rieranthony/product-film-skill`
  - Learns the product's design system, then builds a Remotion launch film from the real components.
  - Example video `/anthonyriera-9b1b2a`.
- `buildfastwithai/buildfast-skills`
  - An animated MP4 film on any topic, drawn in code, with a synthesised beat-synced soundtrack.
- `heygen-com/hyperframes-community-skills --skill session-story`
  - Turns Claude Code history into a scored animated short in HyperFrames.
- `Leonxlnx/cinetic`
  - A cinematic launch film or motion piece from code.
- `Leonxlnx/taste-skill --skill design-taste-frontend`
  - Art direction for websites, dashboards and app screens.
- `MengTo/Skills --skill html-demo`
  - A Mac-style app window that plays an app step by step from one clock (loop, scrub, jump to a step, freeze).

---

## Couldn't open / not read
- **Everything named in the brief opened.**
  - The GitHub API and the raw GIFs.
  - Every prompt-motion.com page tried returned 200, with no login or paywall.
- **Not read by choice:**
  - `object-separation`, as instructed.
  - The bundled `.ogg` sound files (binary).
  - The six gallery skill repos (outside the named sources).
- **Not compared.** The Prompt Motion blog was not read, and neither was each entry's source post on X. The prompts
  were taken from the site's quotation of them.

---

## Not styles, but useful parts

### Motion recipes
- **Closed-form damped spring** `spring(t,w=14,z=0.82)`, with w = 8 slow / 14 normal / 22 snappy. In Remotion terms
  stiffness = w² and damping = 2zw at mass 1 (my conversion). Source: Barty-Bart `explainer-*/SKILL.md`.
- **Re-targeted values as a sum of springs** (`track` / `M.track`). Any frame stays a pure function of t, and looping is
  handled by adding the previous cycle's residue. Source: `motion-broll/engine/motion.js`.
- **Spring presets.** MORPH [15,.84], FAST [27,.86], SLOW [12.5,.9], SOFT [10,.95], CAM [7.5,1], colour [20,1].
  Source: `motion.js`.
- **Liquid stretch indicator.** The leading edge rides FAST and the trailing edge SLOW, so tabs, segmented controls and
  toggle knobs stretch as they move. Source: `motion.js`, examples 01/02; also the gallery's twoclipping-5cba86.
- **Blur content-swap.** Enter: wait 0.07 s, then 0.26 s easeOutCubic from a 12 px blur at scale 0.94. Exit: 0.12 s to
  a 9.6 px blur at scale 0.97. Old and new text get separate timings so they never overlap. Source: `M.vis`.
- **Press feedback.** Down 0.07 s before the click on spring [45,1], release at +0.035 s on [22,.72]. The target scales
  1−0.035·p and the cursor 1−0.13·p. Source: `motion.js`.
- **Human cursor path.** Smootherstep between keys plus a perpendicular arc of sin(πu)·0.06. The cursor arrives a beat
  before it clicks, then a press dip and a soft ripple. Source: `motion.js`, `explainer-default`.
- **Direct manipulation.** While held, the value comes from the cursor's position; on release it springs from where it
  was. Use `crossTimes` to fire springs when the dragged value crosses thresholds. Source: motion-broll example 03.
- **Typing.** `full.slice(0, n(t))` with a blinking caret.
  - About 25 chars/s for calm demos (explainer-default).
  - About 1 char per frame with a 1-frame hold every 2–3 chars (Keynote Glass Blue).
  - Type the text on fixed lines so the camera never chases a wrapping caret (Food craving).
- **Count-up.** `lerp(a, b, ease(seg(t,…)))`. For high energy, digits blur while they spin. Source: explainer-default
  and explainer-high-energy.
- **Hero follow-cam.**
  - The target is a blend of the hero (plus 0.15 s of velocity lead) and the station anchor.
  - Anchor weight 0.7 / 0.15 / 0.85 for interaction / flight / payoff.
  - Critically damped with w ≈ 6, and baked at load in 1/240 s steps.
  - Source: explainer-engaging.
- **Squash and stretch.** 1.25×0.8 for about 60 ms on impact; up to 1.15×0.9 in flight along the velocity. Source:
  explainer-engaging.
- **Slow-motion arc.** Pick the apex, then time-warp with speed `1 − 0.9·sin(πu)^0.6` (5–10× slower at the apex).
  Source: explainer-engaging.
- **Exponential "already moving" entries.** Cover 12–19% of the remaining distance per frame, and exit on an
  accelerating move or a blur ramp. Source: Keynote Glass Blue (notdwd-7de38a).
- **Premium ease reference.** `cubic-bezier(0.16, 1, 0.3, 1)` with overshoot below about 2%. Source: Taxtello
  (daniel-haida-8691d4).
- **Camera rules.**
  - Never sit still: push 1.0 → 1.04 per scene and start each scene at the previous zoom (AI-lab and the product-film
    template).
  - Interpolate zoom in log space (Food craving; Studio-floor fly-over).
  - Never zoom in and back out consecutively (Food craving).
- **Constant-speed glide from one speed curve.** Integrate a speed curve, never keyframe positions every half second.
  Check the result with optical flow. Source: Studio-floor fly-over.
- **Wordmark squeeze into its own full stop.** Letters move toward the dot by the same factor while narrowing on the
  `wdth` axis, so they stay touching. Source: twoclipping-221cab.

### Transitions
- **Blur-dissolve between layers that each have their own camera.** 0.3–0.4 s; the incoming layer is already moving.
  Source: explainer-default.
- **Shape-carried transitions.**
  - A spark becomes a line becomes a vertical flood.
  - A detaching full stop grows into the next shape.
  - A word zooms through the lens.
  - A wipe by a growing bar.
  - Source: explainer-high-energy.
- **Flood rules.** Overscale past all four corners and take about 0.3–0.35 s, or "half the screen changes in one frame".
  Source: twoclipping-221cab, ultimaxbt-2ddf1e, ultimaxbt-bbebf5.
- **Shared-element handoffs.** A flood carries a copy of a bubble's words; a button carries its label into the page.
  Source: ultimaxbt-2ddf1e.
- **Match cut via a tile's corner radius.** The radius goes to 0 as the tile reaches full-bleed, making pull-back,
  whip-in and match-back exact. Source: antonio-kodheli-490109.
- **Iris transition.** Six blades round a hexagonal aperture, each blade drawn as its two vertices, both edge extensions
  and the short arc. Source: twoclipping-221cab.
- **Goo / liquid merge.** Blur plus an alpha threshold, with the source composited on top so glass stays sharp. Source:
  twoclipping-221cab.
- **End-card zoom smear.** 20–30 scaled, faded copies of the word. Directional blur through SVG `feGaussianBlur` with
  separate x/y deviations. Source: notdwd-7de38a.
- **Cut placement.** Hard cuts 2 frames before the beat, on the drop. Source: notdwd-7de38a.

### Layout patterns
- **One line of text plus one UI element, maximum.**
  - Title lines are small (about 28 px at 1080p) and become big through a camera push to about 75% of the width.
  - Source: explainer-default.
- **HUD viewfinder frame.**
  - Corner brackets.
  - `SCENE 02 / 07` at the top right.
  - A mono category label at the bottom left.
  - A timecode with a red dot at the bottom right.
  - 12–14 px at 1080p, about 50% opacity.
  - Source: explainer-high-energy.
- **Stations on a world about 3× the frame**, with a zig-zag path and side-on gravity. A pull-out to about 0.3× plus a
  15–25° rotateX reveals the whole course. Source: explainer-engaging.
- **Inner rounded stage.** About 80% × 75% of the canvas, floating on an atmospheric gradient, with a persistent mini
  player bar as the connective element. Source: brainextends-e19ac3.
- **Through-line object.** One element from the product becomes every scene and ends as the logo. Sources: the
  Prompt Motion product-film template, ultimaxbt-bbebf5, and Barty-Bart's high-energy "shape that carries".
- **Content without invented facts.** Relative bars, skeleton lines and illustrative labels, with what is illustrative
  listed. Source: all the Barty-Bart skills.
- **Vertical variants.** Recompose for 9:16, never crop. Sources: Taxtello prompt; palashbagchi11 improved prompt.

### Reusable shots and elements
- **Integration tiles.** Rounded squares at several depths: near ones larger and slightly blurred, far ones small and
  sharp, with parallax. Source: explainer-default.
- **"Thinking" shimmer.** A cell shimmers before its value appears; an agent checklist goes spinner → check. Source:
  explainer-default.
- **Kinetic triplet.**
  - Three words, two beats each.
  - Each word gets its own background: dark on cream, accent on black with an outline-word pattern, white on blue
    inside viewfinder brackets, and a handwritten script word drawn on.
  - Source: explainer-high-energy.
- **Cube-field ripple.** Coloured by height, under a slowly orbiting camera. A good Blender signature shot. Source:
  explainer-high-energy.
- **Empty slot.** When the hero leaves its station, a dim outline of its slot remains. Source: explainer-engaging.
- **Chapter card.** A black pill reading `Up next →` (about 0.9 s), which morphs into a big accent number plus a
  white title and a grey sub-line. Source: motion-broll example 06.
- **Progress lanes.** `queued` → `NN%` → `done ✓`, with name pulses (a Gaussian colour flash, σ ≈ 0.16 s). Source:
  motion-broll example 02.
- **Frosted-glass titles.** Huge letters filled with a blurred, lightened copy of the card image and cut by the card
  edge. Source: notdwd-7de38a.
- **Liquid glass, two recipes.**
  - Clone the scene, blur it about 14 px, magnify a 12 px edge band 1.06×, then add milk, sheen, rim and shadow
    (rossaxbt-3085b7).
  - Or an SVG `feImage` distance-field displacement through three `feDisplacementMap`s for chromatic edges
    (twoclipping-221cab).
  - Gotcha: `backdrop-filter: url()` misreads displacement maps in Chromium, so clone the scene instead.
- **Iridescent AI glow.** A blurred conic gradient (pink, orange, lime, cyan, violet) rotating round an input. Source:
  ultimaxbt-2ddf1e.
- **Halftone dot field** whose dot sizes respond to a moving dot. Source: ultimaxbt-bbebf5.
- **Lifted-page depth of field and shadow.**
  - Blur 75·(f−d)/d in front of focus and 6·(d−f)/d behind it, capped at 120 px.
  - Shadow offset (0.10z, 4+0.36z), blur 7+0.5z, 26% of #1a2133.
  - Source: twoclipping-d89be5.
- **Real-time 3D quality bar.**
  - Key, fill and rim lights with soft shadows.
  - A RoomEnvironment PMREM.
  - Fog.
  - `MeshPhysicalMaterial` with varied roughness.
  - ACES.
  - DoF only where needed.
  - One named camera move per shot.
  - Shadow bias set; near and far planes tight.
  - Source: the Prompt Motion realtime template.

### Caption styles
- **Typed-as-spoken captions.**
  - The caption types word by word at each word's spoken time.
  - No full stops on screen.
  - One emphasised word in a brand gradient with a faint glow.
  - Never a box highlight ("looks like a Windows text selection").
  - Source: rossaxbt-3085b7.
- **Talking-head edit captions.**
  - Word-by-word subtitles, **bold white, one or two words at a time**, never over the face.
  - Jump cuts hidden by small zoom changes.
  - No zoom punch on every line.
  - Hook within 2 s.
  - Source: the improved prompt at https://prompt-motion.com/customize/sab8a-364a5a.
- **Explainer on-screen text.**
  - At most **7 words on screen** at once, held **at least 0.3 s per word**.
  - Labels sit on the thing they name, never in a legend.
  - Source: the Prompt Motion explainer template (for example `/customize/lemomo-ai-0d9cff`).
- **Word-by-word title reveal.**
  - Words come every 0.05–0.06 s, each rising 16 px out of a 12 px blur in 0.34 s.
  - Sans line plus an Instrument Serif italic grey tail.
  - Source: twoclipping-d89be5.
- **Accent highlight box.** The accent at 15–20% opacity sweeps left to right behind a key word. A rotating
  highlighted word cycles through use cases. Source: explainer-default.

### Rhythm and pacing presets
- **Pace dial lines (Prompt Motion customize).**
  - Calm: slow eased moves, holds up to a beat, cuts on bar lines.
  - Relaxed: changes on the beat.
  - Brisk: a change every half beat, no hold over a beat.
  - Frantic: every half beat or faster, overlapping moves.
  - Source: `/templates/showreel/customize`.
- **Timing budgets.** 45/60/90 s → 2–3 / 3–4 / 4–5 features at about 9 / 10 / 12 s. Title holds about 2 s; 0.5 s
  after each result. Source: explainer-default.
- **High-energy grid.** 6–8 scenes of 1.5–3 s at 120–140 BPM. Type on 1/8 or 1/16 notes; at most 2 hard cuts, on
  downbeats. Source: explainer-high-energy.
- **B-roll pacing to speech.**
  - One change per spoken beat, 0.4–1.2 s apart.
  - Cutaways of 3–10 s; none in the first second of the hook or on emotional lines.
  - At least 2 s of face between cutaways.
  - Density of 2–4 / 4–7 per minute.
  - Source: motion-broll.
- **Premium arc.** "Chaos → control → clarity → brand", about 4 visual ideas in 15 s, the first premium frame within
  1.5 s, and the rhythm slowing before the payoff. Source: daniel-haida-8691d4.
- **Stillness as punctuation.** At least one ≥400 ms absolute stillness, and "the first perfect horizontal" as the
  earned moment. Source: gdgtify-287ddf.

### Sound ideas
All from Barty-Bart `skills/sound-effects` (CC0 library, MIT code) unless noted.
- **Cue → category map with placement and gain.** These values come from `scripts/sound_pass.py`.

  | Cue | Category | Placement | Gain |
  |---|---|---|---|
  | Movement / scene_cut | whoosh | **2 frames early** | **−4 dB** |
  | Typing | typing | looped to its duration, 50 ms fade-out | **−8 dB** |
  | Build-up | riser | **ending on the next hit**, default 0.8 s | **−6 dB** |
  | Appear / click / hover | pop / click / tick | on the frame | **−6 dB** |
  | Reveal | impact | on the frame | 0 dB, the loudest |
  | Success | pop (or ding) | on the frame | — |
  | Error / tech | glitch | on the frame | — |
  | Bed | ambience | under everything | — |

- **Mix rules.**
  - Priority: VO > SFX > music.
  - Music about **−12 dB** under the SFX, ducking **8–12 dB** under VO, with a 0.6 s fade at the end.
  - Target **−16 LUFS** integrated and true peak **below −4 dBFS**, measured on the exported MP4.
  - Loop: re-export until within ±0.5 LU; if over the peak, add a limiter at 0.6 and tighten it ×0.9 per pass.
  - Run a mono check.
  - The explainer skills' own renderer uses `loudnorm I=-16:TP=-1.5`; the gallery prompts use −14 LUFS.
- **Beat-grid sanity check.**
  - librosa can lock onto the off-beat.
  - Low-pass below 120 Hz (4th-order Butterworth) and find kick peaks at ≥50% of the maximum.
  - If the median offset from the grid is above 30 ms, shift the whole grid.
  - Plot the first 4 bars, and report the cut-to-beat error in ms.
- **Proof for a model that can't hear.**
  - Before and after frames plus a waveform per cue.
  - The 5 riskiest timestamps for a human to check: the largest beat error, typing, risers, the reveal.
  - Never claim "it sounds good".
- **Default kit.** Six CC0 sounds: whoosh (qubodup), click (adh.dreaming), pop (ethernel0), riser (BeaconStudio),
  impact (peoplearehappy), tick (Squirrel_404). The typing sound is Mixkit #1392, fetched at runtime and never
  committed.
  - About 150 CC0 alternatives are bundled, in 12 folders by category.
  - Vary takes within a category so repeats don't sound robotic.
- **Music by feel.** Mixkit IDs, with the licence limits checked 13 Oct 2026: no TV, no games, no Content ID.
  - High energy: #130 Tech House vibes (about 122 BPM), #171, #132, #702, #1168.
  - Product demo: #834, #732, #634.
  - Calm: #419, #517.
  - Tension: #140, #723.
  - Source: `sound-effects/MUSIC.md`.
- **Sound language per style (explainer skills).**
  - Calm demo: a 100–110 BPM soft piano or pluck bed, key ticks, a tick per step, a soft whoosh on camera moves, an
    end-card chime.
  - Hype: 128 BPM, kick every beat, claps on 2 and 4, riser into the slam, boom plus noise on floods, a blip per typed
    word.
  - One-take: 110–120 BPM, and the hero's contacts are the instrument (pitched ticks rising through the story).
- **SFX placed by measured peak, not file start.** Trim risers (many run 4 s) around their peak. Fill a track's own
  breaks with reversed whooshes into the hits. Sources: twoclipping-221cab, antonio-kodheli-490109.
- **Voice-over clean-up.**
  - Cut pauses longer than 0.28 s to 0.2 s.
  - Level phrases 85% toward the median.
  - Align words with Whisper per pause-split segment, because one pass can be up to 0.5 s late.
  - Three-band sidechain ducking: lows 30% / mids 85% / air 55%, 0.3 s hold, 50 ms look-ahead, 0.5 s release.
  - Voice about 9 dB over the music between 300 Hz and 4 kHz.
  - Source: rossaxbt-3085b7.
- **Restrained premium palette of sounds.** Low soft impact, tactile clicks, a metallic or glass tick, a low movement
  under camera moves, a resolved logo tone. Avoid trailer booms and EDM risers. Source: daniel-haida-8691d4.

### Render and QA recipes
These are for the engine, not the look.
- **Motion blur by sub-frames.**
  - 4 sub-frames over a 180° shutter (Barty-Bart).
  - 8 sub-frames to avoid ghosting on fast moves (ultimaxbt-2ddf1e).
  - 16 sub-frames over 0.7 of a frame for camera glides (twoclipping-d89be5).
  - 3 sub-frames at t±1/240 s (twoclipping-6dd14e).
- **Review ladder.**
  - Stills at every beat-sheet row or key word.
  - A draft without blur.
  - The final.
  - A frame-difference scan for single-frame pops (spikes 3× their neighbours).
  - A "fresh critic who didn't build it" review.
  - Sources: Barty-Bart; twoclipping-221cab; antonio-kodheli.
- **Footage inside a deterministic page.**
  - Re-encode all-intra (`-g 1`), load it as a blob URL and await `seeked`.
  - Or use JPEG sequences.
  - `python http.server` can't range-seek video.
  - Sources: twoclipping-221cab, twoclipping-6dd14e.
- **Transparent overlay clips for a PiP layout.** ProRes 4444 (`prores_ks` profile 4, `yuva444p10le`), named by
  timeline in-point (`0m32s40`). A `compare.html` shows before/after as side-by-side, stacked or wipe. Source:
  motion-broll.
- **Gotchas.**
  - No `will-change` on anything the camera scales.
  - No opacity or filter on a `preserve-3d` element.
  - `visibility: visible` children show through hidden parents.
  - Measure text only after fonts load.
  - Give a white element on white a 1 px edge and a faint shadow.
  - Sources: motion-broll, twoclipping-6dd14e, twoclipping-221cab, notdwd-7de38a.

### Style seeds (one-line looks from Prompt Motion's improved prompts; thin, for later catalogs)
Each is a single "Style:" line in a house template, found on `/customize/<slug>`. The slug is in brackets.
- **Ghibli** painterly skies, purple cumulus, stylised water in three.js [nft-chen-5f8bb0].
- **Van Gogh** brushwork in 3D [mandelduck-95fd08].
- **Anime CG** with cel shading, bold outlines, speed lines, low angles [allforbigfire-86ff3c].
- **80s Star Wars in a 90s cartoon** [ryzoft-4f85bd].
- **Pixar-level 3D** in three.js [anilraok-eff262].
- **2D Pixar-like shapes** [kamstudiolabs-c9bb28].
- **Grand Budapest** symmetry, pastel, flat theatrical depth, slow steady camera [itsolelehmann-e47532].
- **Paper cut-out shadow theatre** with warm backlight [x4b47x-9cc84f]. This one defaults to 1080×1920.
- **Hand-drawn stop-motion** with boiling pencil lines at 12 fps [nikolajankovic-ce4ff4].
- **Claymation and stop-motion collage** [davidshulmanfl-371638].
- **Isometric cutaway** the camera travels through [mdaman010-e7226a].
- **Broadcast graphics:** a 3D field with a drawn line [blueoctopusai-dd17bd].
- **Whiteboard marker explainer** [lemomo-ai-0d9cff, tak3sh8-be5012].
- **Clean editorial:** one typeface, one accent, self-building diagrams [henkvaness-0e06af, 0xnfrith-5be616].
- **Editorial timeline** with maps and archival photos [triglyceee-bd5b08, kloss-xyz-fe0c31].
- **Pixel art** on a strict grid, as a boomerang loop [pluginplay-3d4006].
- **Bright product photography** of liquid and glass [ror-fly-9950f1].
- **Warm wood and brass** [kamstudiolabs-447565].
- **Story structure from the short-film template.**
  - One want, three escalating failed attempts, a turn, an ending, and a last-second gag.
  - Acting: anticipation and follow-through; squash on soft things; the eyes lead; key poses held ≥6 frames.
  - Cut on action; colour shifts with mood.
  - Example: `/customize/x4b47x-9cc84f`.
