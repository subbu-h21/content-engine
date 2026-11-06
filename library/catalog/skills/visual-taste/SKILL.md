---
name: visual-taste
description: The content engine's baseline visual taste, the rules every video follows whatever its style. Covers numbers instead of adjectives, composition, type sizes and reading time, colour, motion and easing, transitions and rhythm, honesty, the tells of a "generated" look, and how to review. Use when designing, building or reviewing any scene, style frame or catalog style.
---

# Visual taste

Who wins when rules disagree:
1. the user's words;
2. the video's style (its `STYLE.md`);
3. these rules.

A style may deliberately do something listed here (the HUD style's corner brackets, Editorial Neuro's soft fades). It
then does it the way its STYLE.md says, and nowhere else.

Sources, collected in `docs/research/styles/`:
- HyperFrames' skills (T-numbers in `hyperframes.md`);
- ECC, Cinetic, 3Blue1Brown, NullMotion and Claude Code Club (`ecc-nullmotion-3b1b-web.md`);
- the Kinetic Type, Level 5, Motion-as-Code and Claude + Blender guides (`local-guides.md`);
- Barty-Bart and video-shotcraft.

## 1. Decide in numbers

- **Every adjective becomes a number before a scene is built.** Use hex, px, seconds, frames, springs, opacity.

  | Word | Becomes |
  |---|---|
  | premium | a material with numbers (satin with 2% grain, a 0.55 contact shadow) |
  | modern | one 30-frame push on one ease; a display face at ~9% of frame height with −2% tracking |
  | clean | a grid and a ration: 96 px margins, the accent on one word per shot |
  | dynamic | a cut on the beat, a layout change every bar, one hero move per shot |
  | playful | springs at damping ratio 0.45–0.6 on position and scale (never opacity or colour) |
  | cinematic | a lens and a light: key from upper left, rim from behind, a 6% vignette |

- **Write checkable rules, not hedges.** "Background pure #08070a, unlit" works; "dark, varied, dynamic" doesn't. Ban
  the words varied, mixed, dynamic, some, often, neutral.
- **A look is the rules of one medium,** not a palette. Paper is cut and lifted, ink is printed, glass refracts, a pen
  plots. Say what each part may carry and how the medium moves.
- **Keep what happens apart from how it looks.** Story beats and style values live in different files (`script.json`
  and `plan.md` against `style.md`).

## 2. Story on screen

- **One idea per scene, one hero per shot, one new thing at a time.** Never reveal two unrelated things together.
- **The voice is the clock.** A thing appears when the narration names it: the label on its word, the number as it's
  spoken.
- **The screen supports the voice; it doesn't repeat it.** Show the key word, the number, the diagram, not the
  sentence being read.
- **Show, don't list:**
  - no bullet slides and no rows of three cards;
  - similar things each get their own idea and layout;
  - in an explanation, new things grow out of what's on screen (a copy flies from its source) rather than cutting
    to a new layout.
- **Frame 0 is the thumbnail:** never black, never a logo alone. The first 2 s are the densest; the problem is felt by
  1 s.
- **Two cover tests:**
  - read only the on-screen words: a stranger gets the idea;
  - watch only the pictures: they tell the same story.

## 3. Composition

- **The hero of a shot fills at least 40% of the frame's width or height.** A small thing alone in an empty frame isn't
  a shot: push in, crop, or give it a world.
- **Squint test:** one element dominates, at 3–6× its nearest neighbour.
- **Declarative frames are 40–60% empty;** only data and grid frames run dense. No accidental empty half: emptiness is
  placed.
- **Headlines:**
  - the block is at most 78% of the frame width;
  - ≤ 3 words take the biggest size, 4–6 the middle size, 7+ the smallest;
  - never edge to edge.
- **Safe zones (9:16, 1080×1920):**
  - must-read text stays inside the style's safe top and bottom, and off the right-hand 120 px (the platform's buttons);
  - for Reels, Shorts and TikTok together, must-read text stays above y = 1470 (450 px from the bottom).
- **Worlds.** A longer video visits several worlds, each with its own ground, light and scale, entered through
  something already on screen. Never one dark canvas with small things floating in it for the whole video.
- **Placement:** relative to other things on a fixed spacing scale (e.g. 8, 16, 24, 48, 96 px), not ad-hoc coordinates.

## 4. Type

- **Sizes at 1080 wide:**
  - reading text 28 px or more;
  - labels and eyebrows 24 px or more;
  - captions about 5% of the frame height;
  - titles 4–9% of the frame height (77–173 px), 1–2 lines.
- **Too many words:** cut words, never shrink the type.
- **Words per line:**
  - titles at most 6 words a line, one line on screen at a time where possible;
  - explainer lines up to about 10 words.
- **Reading time:** text holds at least 0.5 s + 0.3 s per word after it lands; the video's last line holds 2 s or more.
  Text that hasn't finished arriving never leaves.
- **Live type only:** text is real type, never drawn by an image or video model.
- **Weights:** use only weights the font ships (no fake bold).
- **Emphasis:** by colour, a box, dimming the rest (to about 20%), or the style's own device (italic, karaoke); never by
  stacking styles.
- **Over pictures:** labels over busy graphics get a dark backstroke, halo or scrim sized to the text, never a
  full-width bar.

## 5. Colour

- **One accent per shot, with one meaning,** on one role. The accent covers at most about 8% of the pixels and floods
  the frame at most once per video.
- **Colour means something and keeps that meaning for the whole video** (ice = cool, ember = heat; a variable keeps
  its colour).
- **Visible accents:** an accent at 5% opacity disappears; use 15–25% for atmosphere and full strength for the focal
  thing.
- **Gradients:**
  - full-screen linear gradients on dark grounds band in H.264: use a radial, a solid, or a solid with a local glow;
  - gradients are fine on physical surfaces (metal, glass, screens), sheens, scrims and vignettes;
  - never inside a chart bar.
- **Protect the blacks:** a grade must not lift them to grey.

## 6. Motion

- **Ease by role:**
  - arrivals: expo-out or quart-out, with a long tail;
  - camera moves and colour floods: ease-in-out;
  - zoom-throughs and exits: ease-in;
  - linear only for rotation, progress bars, or constant speed that is the point;
  - the same 0.5 s ease on everything is the flat default that looks generated.
- **Springs by damping ratio:**
  - 1.0 means no bounce; 0.7–0.85 is premium; 0.4–0.6 is playful; below 0.3 is cartoon;
  - position and scale may bounce, opacity and colour never do;
  - overshoot only where something truly lands, at most twice per video, unless the style's character is bouncy.
- **One hero move per shot.** Secondary moves travel 50–70% as far and start 100–200 ms later; everything else holds.
- **Overlap:** the next element starts when the previous is 30–50% done.
- **Stagger:** letters 1 frame apart, words 60–120 ms, list items 40–80 ms; the whole stagger ≤ 0.5 s.
- **Exits are shorter than entrances,** about 50–75% of the entrance, in one smooth motion (never slide, stop, then
  leave).
- **A landed title is dead still.** The motion moves on to the next element, the camera or the world. Vary how titles
  enter within one video.
- **No idle wobble:**
  - breathing, floating, pulsing or slowly creeping titles and UI are banned;
  - continuous motion has a job: a diagram working, the camera travelling, a process running;
  - stillness is fine as thinking time after a step (1–3 s in an explainer) while the voice continues;
  - no stretch over about 4 s without anything new.
- **Fast moves** take 0.3–0.6 s and carry motion blur on their fastest frames: 6–12 px for text-sized elements,
  15–20 px for full-frame moves.
- **Before the payoff:** a still beat of 0.3–0.75 s, then the payoff at normal speed.
- **Determinism:** everything is a function of time. Seeded randomness only; no timers, clocks or network.

## 7. Transitions and rhythm

- **Something new every 2–4 s.** Shots average 1.8–3 s with motion inside them; a demo may hold one framing 7–10 s
  while things act.
- **Vary the rhythm:** shot lengths come from a spread, never even spacing.
- **Transitions grow out of the content:**
  - zoom through a node, an object becomes the next background, match on a shape;
  - never generic presets (light leak, film burn, swirl, glitch for its own sake).
- **Crossfades:** not the default between scenes (they have no carrier and dip in brightness). Use them only where the
  style says so, e.g. calm editorial styles.
- **Carriers:** the eye follows an object across a cut (a dot, a word, a cursor) at matched position and speed.
- **Motion across cuts:** how scene A leaves decides how scene B enters (same axis, same direction, matched speed).
  Cut at a move's fastest frame. Keep one main direction per video.
- **Variety:** use 2–8 kinds of transition per video and repeat them, plus at most one signature move.
- **Cuts on narration** sit in the pause before a line (about 0.18 s before its first word), never after it.

## 8. Honesty and assets

- **Never invent figures, customers, quotes or claims.** A number on screen is true and sourced, or it is a marked
  placeholder.
- **Logos, app screens, mascots, faces:**
  - the brand's own files with the user's OK;
  - otherwise generic rebuilt shapes (a generic chat window, a generic timeline);
  - never a downloaded logo, and never a coloured square standing in for an app icon.
- **A real place:** real imagery, credited; vector outlines read as a diagram.

## 9. Tells of a generated look

These are avoided unless the style deliberately uses them, and then only its way.
- A black or dark navy void with small elements floating in the middle.
- Decorative glow, bloom, neon, lens flares, glowing orbs and rings, or floating particles.
- Purple or blue gradients, mesh gradients, glass cards. "AI default" hexes: `#7c3aed`, `#2563eb`, `#6366f1`,
  `#8b5cf6`, `#a855f7`, `#4f46e5`.
- The cream-paper serif kit: cream ground, serif display, italic accent words, "01 / 02" numbers, small mono caps
  labels, pill chips.
- Everything centred; everything fading in at once; every element fading and sliding up.
- Text that moves while it's read; titles that keep drifting after they land.
- Corner labels, frame borders, corner brackets and HUD readouts as decoration.
- Rows of three cards, KPI grids, a title over a dimmed screenshot; the logo docked in a corner.
- Every scene entering the same way; the same move beat after beat.
- Inter, Space Grotesk, Instrument Serif, Geist or JetBrains Mono as the voice of a video. They're where generated
  design lands, so use them only when a style chooses them on purpose.
- Bounce on UI and click rings.

After the first render, name every default the video fell into anyway, add it to the video's banned list, and fix it.

## 10. Review

- **Look at the real render, not the plan:** numbered stills, frames around every cut, a phone-size sheet.
- **Review as a harsh director, not a proud author.**
  - Describe each beat's frame in one sentence as a stranger would. Something you'd have to explain is a P0.
  - Never score the video out of 10: a score finds nothing to fix.
- **Write notes as** `t=4.2s · where · problem → exact change`, ranked:
  - P0: must fix;
  - P1: should fix;
  - P2: nice to have.

  Fix text first, then timing, then detail.
- **When the user gives feedback,** turn it into "timestamp + word + one change", with exact numbers:
  - "too fast" means slow every move to 0.7× its speed and nothing else;
  - "the titles move" means land them and hold them dead still;
  - "it feels like slides" means enter the next scene through something on screen.
- **A video that feels busy:** remove a third of the motion and keep the moves that lead the eye.
