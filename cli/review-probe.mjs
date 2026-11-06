// Renders the frames the quality gate needs from a video's current code and measures its text as the page draws it.
// Run by cli/review.mjs with the video's folder as the working directory; Remotion comes from the video's own packages.
//   node review-probe.mjs <out dir> <frames.json>
// Writes <out dir>/f_<frame>.jpg and <out dir>/probe.json: { width, height, fps, total, audio, frames: [{ f, blocks }], errors }.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { watchFrames } from "./page-text.mjs";

const [outDir, framesFile] = process.argv.slice(2);
const require = createRequire(path.resolve("package.json"));
const { bundle } = require("@remotion/bundler");
const { getCompositions, openBrowser, renderFrames } = require("@remotion/renderer");

fs.mkdirSync(outDir, { recursive: true });
const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src", "index.ts"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { chromiumOptions });
const newPage = browser.newPage.bind(browser);
browser.newPage = async (...args) => {
  const page = await newPage(...args);
  await page.evaluateOnNewDocument(watchFrames);
  return page;
};

const measured = new Map();
const errors = [];
let composition;
try {
  composition = (await getCompositions(serveUrl, { chromiumOptions, puppeteerInstance: browser })).find((c) => c.id === "Reel");
  if (!composition) throw new Error('This video has no "Reel" composition.');
  const wanted = JSON.parse(fs.readFileSync(framesFile, "utf8")).filter((f) => f < composition.durationInFrames);
  // sound off through the video's own switches: Remotion's audio writer can't handle a sparse list of frames
  const audio = composition.props?.audio;
  const props = audio ? { ...composition.props, audio: { ...audio, voice: false, music: false, sfx: false } } : composition.props;
  await renderFrames({
    composition: { ...composition, props },
    serveUrl,
    inputProps: props,
    frames: wanted,
    outputDir: null,
    imageFormat: "jpeg",
    jpegQuality: 80,
    scale: 0.5,
    concurrency: 2,
    muted: true,
    chromiumOptions,
    puppeteerInstance: browser,
    onStart: () => undefined,
    onFrameUpdate: () => undefined,
    onFrameBuffer: (buffer, frame) => fs.writeFileSync(path.join(outDir, `f_${String(frame).padStart(5, "0")}.jpg`), buffer),
    onBrowserLog: ({ text, type }) => {
      if (text.startsWith("CE_PROBE ")) {
        const m = JSON.parse(text.slice("CE_PROBE ".length));
        measured.set(m.f, m);
      } else if (type === "error") errors.push(text.slice(0, 300));
    },
  });
} finally {
  await browser.close({ silent: true });
  fs.rmSync(serveUrl, { recursive: true, force: true }); // the bundle holds a copy of public/, in the system's temp folder
}
fs.writeFileSync(
  path.join(outDir, "probe.json"),
  JSON.stringify({ width: composition.width, height: composition.height, fps: composition.fps, total: composition.durationInFrames, audio: composition.props?.audio ?? null, frames: [...measured.values()].sort((a, b) => a.f - b.f), errors: [...new Set(errors)].slice(0, 20) }),
);
console.log(JSON.stringify({ frames: measured.size }));
