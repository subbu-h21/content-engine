// Render the preview stills of the style in src/style/: one JPEG per sample into out/stills/ (grain makes PNGs about
// 500 KB each), then print what was made as JSON on the last line. Run by `ce catalog preview` with this folder as the
// working directory.
//   node render.mjs [--scale 0.5]
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill } from "@remotion/renderer";

const i = process.argv.indexOf("--scale");
const scale = i > 0 ? Number(process.argv[i + 1]) : 0.5;
const out = path.resolve("out", "stills");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src", "index.ts"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { chromiumOptions });
const made = [];
try {
  const stills = (await getCompositions(serveUrl, { chromiumOptions, puppeteerInstance: browser })).filter((c) => c.id.startsWith("Still-"));
  for (const composition of stills) {
    const id = composition.id.slice("Still-".length);
    const output = path.join(out, `${id}.jpg`);
    const frame = Number(composition.defaultProps?.hero ?? 0);
    await renderStill({ composition, serveUrl, output, frame, scale, imageFormat: "jpeg", jpegQuality: 86, chromiumOptions, puppeteerInstance: browser, overwrite: true });
    made.push({ id, file: output });
  }
} finally {
  await browser.close({ silent: true });
}
console.log(JSON.stringify({ stills: made }));
