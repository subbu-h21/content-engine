---
name: make-style
description: Turn sources into a catalog style for the content engine. Sources can be uploaded images (Pinterest, posters, screenshots, video frames), PDFs and style guides, design-system documents, taste documents, reference videos, links, research notes, or a description in words. The result is one folder in the standard format (STYLE.md, style.json, Remotion sample scenes, preview stills), checked and looked at. Use when the user adds something to the catalog or asks for a new or changed style.
---

# Make a catalog style

A style is one folder in the format described in `D:\code_files\content-engine\library\catalog\README.md`. Read that
file first. Then study the worked example, `library/catalog/visual/editorial-neuro/`, which is today's look: every
file in it. Copy its structure, not its look.

## 1. Read the sources

- **Read everything you were given, in full.** For a PDF, read the whole file (on this PC the `pages` parameter of
  Read fails).
- **Images and video frames:** look at them, then **measure** the colours rather than guessing them. For example, use
  Python with Pillow: quantise the image to 8 colours, then sample the background, the text and the accents.
- **Reference videos:** `yt-dlp` into a new empty folder, then sample frames with ffmpeg and look at them. Do the
  same for a local file.
- **Design-system documents:** take the tokens as they are (palette, type scale, spacing, radii, motion), then map
  them onto the format.
- **A taste document with general rules, not a look** (for example "good motion design is…") isn't a style. Propose
  its rules as additions to the visual taste skill (`library/catalog/skills/visual-taste/`) and stop.
- **One coherent look = one style.** When a source holds several really different looks, make several styles; when
  two sources describe the same look, make one.

## 2. Name it

- `id`: lowercase, digits and dashes (`plotter-on-ink`).
- `name`: two or three descriptive words ("Plotter on Ink").
- Never use a person's, channel's or brand's name: the look gets a name of its own, and the source is credited in
  section 11.

## 3. Write `style.json` and `STYLE.md`

- **Exact values from the sources:** hex, px, seconds, spring damping/stiffness/mass, easing curves.
- **Values you choose** because the source doesn't give them are marked *(proposed)* in STYLE.md. Choose them to fit
  the source's spirit.
- **Sizes** are for 1080×1920 (`frame`). A 16:9 source is re-laid out for vertical: bigger type, fewer elements,
  never a crop. Say what changed in section 11.
- **Safe zones:** keep text inside top 230 px / bottom 330 px unless the style has a reason (and says it).
- **The smallest text** (`type.min`) is 24 px or more.
- **STYLE.md has all 11 sections, in order.** It must be specific enough that Claude could build any scene in this
  style from the file alone:
  - what enters how;
  - which colour goes where;
  - what is banned.
- **Status:** `built-in` for styles shipped with the engine, `experimental` for anything made from a user's upload
  until the user approves it.

## 4. Write the scenes

The `scenes/` folder holds:
- `fonts.ts`: loads the fonts and lists the faces to wait for;
- `parts.tsx`: the style's pieces;
- `index.tsx`: exports `samples`.

Look at editorial-neuro's three files for the pattern.

- **What to show:**
  - every style shows the shared sample content from the kit (`SAMPLE`, from `library/catalog/sample.json`) in its
    own way;
  - samples `title`, `headline`, `diagram` and `number` are required; `list` and `end` are welcome;
  - each sample's `hero` moment is when it looks complete and characteristic: after things have landed, before
    anything leaves.
- **Where values come from:** read every value from `style.json` (colours by role through `color()`, recipes through
  `run()` from the kit), so editing the numbers changes the scenes.
- **Imports:** only `remotion`, `react`, `@remotion/google-fonts/<Family>`, `@remotion/fonts`, `../style.json` and the
  kit (`../../kit`). No other packages.
- **Fonts:**
  - **Google Fonts:** only families that exist in the installed package, i.e. the file
    `D:\code_files\content-engine\runtime\node_modules\@remotion\google-fonts\dist\esm\<FamilyWithoutSpaces>.mjs`
    exists. Use `loadFont(style, { weights, subsets: ["latin"] })`.
  - **A font the user uploaded:** it goes in `fonts/`, with `"source": "file"`. Load it with `loadFont` from
    `@remotion/fonts` and `staticFile("style/fonts/<file>")`.
  - **Fonts whose licence is unknown:** never use them.
  - **Unavailable fonts:** when a source's font isn't available, choose the closest Google font, and name both in
    STYLE.md.
  - **Waiting:** wait for every face with `useFontsReady(FACES)` (the editorial-neuro `Ground` does this).
- **Footage:** a style that needs real footage (`needs.footage`) draws a plain stand-in in its previews: a dark
  gradient with a soft grey silhouette of a person. It must clearly be a placeholder, never a fake photo.
- **3D:** a style that needs 3D (`needs.3d`) approximates its look in 2D or CSS 3D for the previews. Its full Blender
  look goes in section 9.
- **No real logos, app UIs, mascots, faces or brand marks.** Rebuild generic shapes instead: a generic chat window, a
  generic editor timeline.
- **Every number shown is true:** the sample content's numbers already are.
- **Known traps:**
  - Remotion spells out digits in some Google family names ("Jersey 10" → "Jersey OneZero"): use the `fontFamily` that
    `loadFont()` returns, never a typed name.
  - An SVG filter on a perfectly horizontal or vertical stroked line renders nothing, because the line's box has zero
    height: use `filterUnits="userSpaceOnUse"`, or a filled shape.
  - One NaN in an SVG path silently cuts off everything drawn after it: guard divisions.
  - Use the kit's helpers (`seeded`, `mix`, `pulse`, `run` with named curves, `words` with `glue`) rather than your own.

## 5. Check, render, look, fix

```
ce catalog check <folder>
ce catalog preview <folder>
```

To try built-in styles without touching anyone's real workspace, set `CE_WORKSPACE` to a scratch folder first
(PowerShell: `$env:CE_WORKSPACE = 'D:\tmp\<name>'`). The preview project is made inside it.

Then **look** at `preview/sheet.jpg` and at every still (open the image files). Check each one:
- nothing clipped at the frame edge, and text inside the safe zones;
- no overlaps, no text over busy areas, every label readable at phone size;
- the colours, fonts and moves are the style's own: it should be recognisable at a glance and clearly different from
  the other catalog styles;
- the hero moment is complete: nothing half-faded, no empty frame;
- the composition is balanced: no huge empty half by accident; empty space is deliberate.

Fix and render again, for at most 3 rounds. Then say plainly what's still weak.

## 6. Sources

`sources/notes.md` lists:
- each source (path, URL, research file and section);
- its licence;
- what was taken from it;
- what was proposed;
- what was changed for vertical.

A user's uploaded files are copied into `sources/` untouched.

## Rules

- Change only the style folders you were asked to make. Don't edit the kit, the preview project, the CLI or other
  styles; if one of them needs a change, say so.
- Non-commercial or unclear licences: describe the look's rules in your own words, and copy no code or assets. A
  source marked "do not use" is not used at all.
- No new packages, no paid calls, no commits.
- Don't touch the user's real workspace or a running engine on port 4100.
