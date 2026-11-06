---
name: packaging
description: A video's hooks, titles, thumbnails and post captions. Use for the hook step before the script is written, and when the user asks to package a video or presses the Package tab's button.
---

# Packaging: hooks, titles, thumbnails, captions

What brings a viewer to the video and keeps them past the first second. The user chooses on the website: the **Hook**
card on the Brief board, and the **Package** tab. Write the files below and tell the user where to look. Nothing here
uploads anything, and nothing here costs money.

**Never invent facts.** No numbers, results or sources that aren't in the script or the brief.

## Hook (before the script)

The hook is the video's first spoken line. Pick it first and build the script on it: everything after that line pays
off what it promises. Changing it after the voice is recorded costs a re-record and new timing.

1. Read `hook-formulas.md` next to this file, and pick the formulas that suit this idea.
2. Write five options to `brief/hooks.json`, each from a different formula:
   ```json
   {"options": [{"id": "a", "text": "Why is the sea salty?", "formula": "The Question", "judged": 70, "why": "one short reason"}], "chosen": null}
   ```
   - `text` is the line as it will be spoken, with no stage directions.
   - `judged` is your own mark from 0 to 100, below. Be hard on them: most hooks are 40 to 70.
3. Run `ce hooks .`. It prints each hook's score and what's weak. It's a lint, not a prediction: rewrite anything marked
   weak unless you can say why it's right, but don't chase the number.
4. Tell the user the board shows the best two and that they can see all five. **Wait for their pick** before writing
   the script. It arrives as a chat message, and `chosen` is set in the file. If they say "you pick", pick the best
   and set `chosen` yourself.

Marking a hook (`judged`):

| Mark | What it is |
|---|---|
| 80–100 | Bold or surprising, a complete thought a stranger understands at once, and it makes them need the answer |
| 60–79 | A clear question or claim with something at stake |
| 40–59 | True and clear, but the viewer can guess where it goes |
| 10–39 | A warm-up: "So today I want to talk about…", "Have you ever wondered…" |

## Titles, thumbnails, captions (after the preview)

Read `brief.md`, `script.json`, `plan.md` and the style (`src/style/STYLE.md`, or `style.md`). Write the three parts, then
run `ce package .`, then read `package/report.json` and open every thumbnail. Fix what's wrong and run it again, at
most 3 rounds. Then tell the user to open the **Package** tab, and name your pick and why.

### Titles: `package/titles.json`

Ten titles, each paired with a thumbnail. A title and its thumbnail are one idea: they should add to each other, never
repeat each other.
```json
[{"id": "t1", "title": "35 grams of salt in every kilo of sea", "thumb": "a"}]
```
- A phone cuts a title at about 40 characters: put the point in the first 40.
- Be specific: a number, a name, a thing. Avoid vague praise (amazing, ultimate, best).
- Capitals on two words at most.
- The title isn't the hook: the hook is heard, the title is read before the viewer decides to watch.

### Thumbnails: `src/thumbnails/`

Three variants, each a different idea, not the same picture recoloured. Draw them from the video's own scene pieces and
style, in code: a frame grabbed from the video carries its captions and HUD. For 3D, use a rendered still as the
background. Real type only: an image model misspells.

- **Size:** the video's shape from `project.json` → `format`: 1080×1920 for a vertical video, 1280×720 for a wide one.
- **Words:** three at most, large. Fewer is better. They say what the title doesn't.
- **One focal point** and strong contrast. Text in the top third for a hook, the bottom third for a number, the centre
  only for a single word.
- **Clear areas:** the bottom 28% of a vertical thumbnail; the bottom-right corner of a wide one, where the video's
  length shows.
- **The style's rules hold:** its fonts, colours and banned moves.

`src/thumbnails/index.ts`:
```ts
import { registerRoot } from "remotion";
import { Thumbs } from "./Thumbs";

registerRoot(Thumbs);
```
`src/thumbnails/Thumbs.tsx`, one `Still` per variant with the ids `Thumb-a`, `Thumb-b`, `Thumb-c`:
```tsx
import React from "react";
import { AbsoluteFill, Still } from "remotion";
import { useFonts } from "../lib/fonts";

const A: React.FC = () => {
  useFonts(); // every variant waits for its fonts
  return <AbsoluteFill style={{ backgroundColor: "#000" }}>{/* the picture and the words */}</AbsoluteFill>;
};

export const Thumbs: React.FC = () => (
  <>
    <Still id="Thumb-a" component={A} width={1080} height={1920} />
  </>
);
```
A scene piece that needs the video's props or timing can't simply be dropped in: copy what you need into a small
component here, or pass it fixed values. `npm run typecheck` covers this folder.

### Post captions: `package/captions.json`

Five options for Facebook and Instagram.
1. Find the core insight of the video, which the caption must never state.
2. Find the phrase someone would type into a search box.
3. Write two lines: line 1 opens a loop, line 2 carries the search phrase.
4. Mark each from 1 to 5 on curiosity, `aeo` (how well it answers that search), voice and brevity. Post at 16 of 20 or
   more, so rewrite what's below.

```json
[{"id": "c1", "text": "Rain did this to the ocean.\nWhy is the sea salty?", "keyphrase": "why is the sea salty", "curiosity": 4, "aeo": 5, "voice": 4, "brevity": 5}]
```
No hashtags (Settings adds its own), at most two sentences, no semicolons or long dashes, no summary of the video, and
none of the tired words: delve, unlock, unleash, realm, elevate.

## What the checks mean

`ce package .` prints a line per problem. FAIL must be fixed: text cut off, a font that didn't load. WARN is a question:
text too small for a phone, low contrast, too many words, text in a covered area. Fix it, or keep it on purpose and say
why. The checks can't see taste: look at each thumbnail at phone size yourself.
