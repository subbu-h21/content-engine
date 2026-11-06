// Render the previews of the style in src/style/: one JPEG per sample into out/stills/ (grain makes PNGs about 500 KB
// each) and the "Reel" composition, every sample in a row, into out/reel.mp4. Prints what was made as JSON on the last
// line. Run by `ce catalog preview` with this folder as the working directory.
//   node render.mjs [--scale 0.5] [--reel-scale 0.3333] [--reel-only]
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderMedia, renderStill } from "@remotion/renderer";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? Number(process.argv[i + 1]) : fallback;
};
const scale = arg("--scale", 0.5);
const reelScale = arg("--reel-scale", 1 / 3);
const reelOnly = process.argv.includes("--reel-only");
const out = path.resolve("out", "stills");
const reel = path.resolve("out", "reel.mp4");
fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(reel, { force: true });
fs.mkdirSync(out, { recursive: true });

const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src", "index.ts"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { chromiumOptions });
const made = [];
try {
  const compositions = await getCompositions(serveUrl, { chromiumOptions, puppeteerInstance: browser });
  if (!reelOnly) {
    for (const composition of compositions.filter((c) => c.id.startsWith("Still-"))) {
      const id = composition.id.slice("Still-".length);
      const output = path.join(out, `${id}.jpg`);
      const frame = Number(composition.defaultProps?.hero ?? 0);
      await renderStill({ composition, serveUrl, output, frame, scale, imageFormat: "jpeg", jpegQuality: 86, chromiumOptions, puppeteerInstance: browser, overwrite: true });
      made.push({ id, file: output });
    }
  }
  // small and silent: it plays on hover in the gallery. Two pages at a time keeps the memory use low.
  const composition = compositions.find((c) => c.id === "Reel");
  await renderMedia({ composition, serveUrl, codec: "h264", crf: 30, muted: true, scale: reelScale, concurrency: 2, outputLocation: reel, chromiumOptions, puppeteerInstance: browser, overwrite: true });
} finally {
  await browser.close({ silent: true });
}
console.log(JSON.stringify({ stills: made, reel }));
