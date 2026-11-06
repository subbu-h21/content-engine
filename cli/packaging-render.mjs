// Renders a video's thumbnails (src/thumbnails: one Remotion Still per variant, ids Thumb-<id>) and measures their text.
// Run by cli/packaging.mjs with the video's folder as the working directory; Remotion comes from the video's own packages.
//   node packaging-render.mjs <out dir>
// Writes <out dir>/<id>.png, <id>.bg.png (the same picture with its text hidden, to read what's behind it) and
// probe.json: { thumbs: [{ id, width, height, blocks }], errors }.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { watchFrames } from "./page-text.mjs";

const [outDir] = process.argv.slice(2);
const require = createRequire(path.resolve("package.json"));
const { bundle } = require("@remotion/bundler");
const { getCompositions, openBrowser, renderStill } = require("@remotion/renderer");

/** Runs in the page: everything stays but the text, so contrast is measured against what's really behind each line. */
function hideText() {
  document.addEventListener("DOMContentLoaded", () => {
    const s = document.createElement("style");
    s.textContent = `* { color: transparent !important; -webkit-text-fill-color: transparent !important; -webkit-text-stroke-color: transparent !important; text-shadow: none !important; }
      svg text, svg tspan { fill: transparent !important; stroke: transparent !important; }`;
    document.head.append(s);
  });
}

fs.mkdirSync(outDir, { recursive: true });
const entry = ["index.ts", "index.tsx"].map((f) => path.resolve("src", "thumbnails", f)).find((f) => fs.existsSync(f));
if (!entry) throw new Error("This video has no src/thumbnails/index.ts.");
const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: entry, publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { chromiumOptions });
const newPage = browser.newPage.bind(browser);
let hiding = false;
browser.newPage = async (...args) => {
  const page = await newPage(...args);
  await page.evaluateOnNewDocument(hiding ? hideText : watchFrames);
  return page;
};

const thumbs = [];
const errors = [];
try {
  const stills = (await getCompositions(serveUrl, { chromiumOptions, puppeteerInstance: browser })).filter((c) => c.id.startsWith("Thumb-"));
  if (!stills.length) throw new Error('src/thumbnails has no compositions with ids like "Thumb-a".');
  for (const composition of stills) {
    const id = composition.id.slice("Thumb-".length);
    let measured = null;
    const render = (output) =>
      renderStill({
        composition,
        serveUrl,
        output,
        frame: 0,
        imageFormat: "png",
        chromiumOptions,
        puppeteerInstance: browser,
        overwrite: true,
        onBrowserLog: ({ text, type }) => {
          if (text.startsWith("CE_PROBE ")) measured = JSON.parse(text.slice("CE_PROBE ".length));
          else if (type === "error") errors.push(text.slice(0, 300));
        },
      });
    hiding = false;
    // the measurement races the page closing after its screenshot: on a busy PC it can lose
    for (let attempt = 0; attempt < 3 && !measured; attempt++) await render(path.join(outDir, `${id}.png`));
    hiding = true;
    await render(path.join(outDir, `${id}.bg.png`));
    thumbs.push({ id, width: composition.width, height: composition.height, blocks: measured?.blocks ?? null });
  }
} finally {
  await browser.close({ silent: true });
  fs.rmSync(serveUrl, { recursive: true, force: true }); // the bundle holds a copy of public/, in the system's temp folder
}
fs.writeFileSync(path.join(outDir, "probe.json"), JSON.stringify({ thumbs, errors: [...new Set(errors)].slice(0, 20) }));
console.log(JSON.stringify({ thumbs: thumbs.length }));
