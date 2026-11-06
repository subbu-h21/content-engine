# The catalog

Styles a video can use, stored in one standard format whatever they were made from. Design and decisions:
`docs/visual-catalog.md`.

- **Built-in styles** live here, in `visual/<id>/`.
- **The user's own styles** live in `<workspace>/catalog/visual/<id>/`.
- A video that uses a style gets **its own copy**, so changing the catalog never changes a finished video.

Only visual styles exist so far. Content design (storytelling) and sound catalogs will sit next to `visual/` in the same
spirit.

Other folders here:
- `skills/` holds the catalog's skills for Claude: `make-style` turns sources and uploads into a style;
  `visual-taste` holds the rules every video follows whatever its style.
- `kit/` and `sample.json` are shared by every style's scenes.
- `preview/` is the preview project.

## A visual style: one folder

```
visual/<id>/
  STYLE.md      the style document Claude reads (a skill: name + description front matter)
  style.json    the numbers the engine reads
  scenes/       Remotion scenes that draw the style; they make the previews
    index.tsx   exports `samples` (see "Scenes" below)
  fonts/        font files that aren't on Google Fonts (optional)
  preview/      rendered previews: <sample>.jpg, cover.jpg, sheet.jpg, reel.mp4 (made by `ce catalog preview`)
  sources/      what the style was made from, untouched (uploads, links), plus notes.md
```

`<id>` is lowercase letters, digits and dashes (`editorial-neuro`).

## STYLE.md

Front matter:

```
---
name: style-<id>
description: Visual style "<Name>": <one line>. Use when a video is made in this style.
---
```

Then these sections, in this order. Write "none" when a section doesn't apply.

1. **In one line:** what it feels like, and what kind of video it suits.
2. **Palette:** a table of role, hex, and where it's used.
3. **Typography:**
   - faces and weights;
   - sizes in px at 1080×1920, and the smallest allowed;
   - tracking, case, how emphasis works;
   - how many words are on screen at once.
4. **Layout:** margins, safe zones, alignment, how full a frame gets.
5. **Elements:** labels, pills, lines, diagrams, icons, persistent frames, how images are treated.
6. **Motion:** named moves with exact values, how things enter and leave, holds, stagger.
7. **Transitions and rhythm:** kinds of cut, shot lengths, beat.
8. **Finish:** grain, vignette, blur, glow (yes or no, with values).
9. **3D look:** materials, lights, camera, colour settings, or "none".
10. **Banned:** what this style never does.
11. **Where it came from:** each source, what was taken from it, its licence, and the date.

Values that a source didn't give and Claude chose are marked *(proposed)*.

## style.json

```jsonc
{
  "id": "editorial-neuro",
  "name": "Editorial Neuro",
  "kind": "visual",
  "version": 1,
  "status": "built-in",            // built-in | approved | experimental
  "summary": "one line",
  "tags": ["calm", "dark", "serif"],
  "suits": ["explainer", "facts"],
  "needs": { "footage": false, "3d": false },
  "frame": { "width": 1080, "height": 1920 },   // the frame all px values below are given at
  "palette": [                      // roles: background, surface, text, muted, faint, accent, accent2 (+ any extra)
    { "role": "background", "hex": "#08070a", "use": "where it's used" }
  ],
  "fonts": {                        // display and body required, mono optional
    "display": { "family": "Bodoni Moda", "source": "google", "weights": [400], "italic": true },
    "body": { "family": "Inter", "source": "google", "weights": [400, 500] }
  },
  "type": { "display": 104, "body": 32, "label": 28, "min": 24, "leading": 1.04, "tracking": 0, "case": "sentence", "emphasis": "italic" },
  "layout": { "margin": 96, "safe": { "top": 230, "bottom": 330 }, "align": "left" },
  "motion": {
    "recipes": {                    // named moves: springs or eases, exact values
      "rise": { "kind": "ease", "curve": "expo-out", "duration": 0.55, "distance": 18 }
    },
    "enter": "rise", "exit": "fade", "stagger": 0.09, "hold": 0.8
  },
  "finish": { "grain": 0.035, "vignette": 0.42, "glow": false },
  "banned": ["…"],
  "sources": [{ "what": "…", "where": "…", "licence": "…" }]
}
```

Rules for each field:
- **`fonts.*.source`** is one of:
  - `google`: loaded through `@remotion/google-fonts/<Family>`;
  - `file`: a file in `fonts/` named by `"file"`, loaded with `@remotion/fonts`;
  - `local`: installed on this PC only.

  `"prefer"` names a locally installed face to use first when it's there (e.g. Bodoni MT before Bodoni Moda).
- **`motion.recipes`:** a spring is `{ "kind": "spring", "damping", "stiffness", "mass" }`. An ease is
  `{ "kind": "ease", "curve", "duration" }`, with the duration in seconds. The curve is one of `linear`, `expo-out`,
  `expo-in`, `expo-in-out`, `cubic-out`, `cubic-in`, `cubic-in-out`, `quart-out`, `quart-in`, `sine-in-out`,
  `smootherstep`, or a bezier `[x1, y1, x2, y2]`. The kit's `run()` plays any of them. The kit also has `pulse()`
  for hits, `seeded()` for deterministic random numbers and `mix()` for colours.
- **The engine theme:** a video's theme takes its colours from the palette roles (ink = background, bone = text,
  ash = muted, dim = faint, ember = accent, ice = accent2) and its fonts from display and body.
- **Extra objects** (for example `grounds` for gradient backgrounds, or `elements` for sizes of the style's own
  pieces) are welcome when a style needs them. The check ignores them, so the scenes read them the same way.

`ce catalog check <folder>` checks the folder, the fields, the hex values, that every Google family exists in the
installed package, and that every `file` font is present.

## Scenes

`scenes/index.tsx` exports the style's samples:

```ts
export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.2, component: Title },   // seconds; `hero` is the moment its still shows
  …
];
```

- **Types and helpers:** `Sample`, the shared sample content and small helpers (fonts, emphasis) come from `../../kit`.
- **The `kit` folder:** it is copied next to the style wherever the style is rendered, so the paths stay the same:
  `src/style/scenes/` and `src/kit/`.
- **What a sample shows:** each one shows one moment of the shared sample content (`sample.json`), so styles can be
  compared on the same words.
- **Which moments:** at least `title`, `headline`, `diagram` and `number`; `list` and `end` are welcome.
- **What scenes may import:**
  - `remotion`;
  - `@remotion/google-fonts/*`;
  - `@remotion/fonts`;
  - `react`;
  - the style's own `style.json`;
  - the kit.
- **Values:** taken from `style.json`, not repeated in the code, so editing a value changes the scenes.

## Previews

```
ce catalog preview <style folder>
```

- **Where it renders:** in a hidden preview project, `<workspace>/catalog/_preview`. It's made from `preview/` here on
  first use and isn't listed as a video.
- **What it writes:** one JPEG still per sample at half size (540×960), `cover.jpg`, `sheet.jpg` and `reel.mp4` (every
  sample playing in a row, 360×640, silent, about 200 KB; `--reel-only` makes just this one), into the style's
  `preview/` folder. JPEG because film grain makes PNGs about 500 KB each.
- **Cost:** nothing paid is called.
