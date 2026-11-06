// Renders the frames the quality gate needs from a video's current code and measures its text as the page draws it.
// Run by cli/review.mjs with the video's folder as the working directory; Remotion comes from the video's own packages.
//   node review-probe.mjs <out dir> <frames.json>
// Writes <out dir>/f_<frame>.jpg and <out dir>/probe.json: { width, height, fps, total, audio, frames: [{ f, blocks, fonts }], errors }.
//
// Remotion has no public hook for "this frame is ready", so a script added to each page watches the two window
// variables its renderer uses (remotion_setFrame, remotion_renderReady; probed on 4.0.535, runtime/package.json pins it).
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const [outDir, framesFile] = process.argv.slice(2);
const require = createRequire(path.resolve("package.json"));
const { bundle } = require("@remotion/bundler");
const { getCompositions, openBrowser, renderFrames } = require("@remotion/renderer");

/** Runs in the page, before its own scripts. Logs one CE_PROBE line per finished frame. */
function watchFrames() {
  const opacityOf = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    return o;
  };
  // a word in a line is an inline piece of it: the line is the nearest block
  const blockOf = (el) => {
    let e = el;
    while (e.parentElement && e.parentElement !== document.body && /^inline/.test(getComputedStyle(e).display) && !(e instanceof SVGElement)) e = e.parentElement;
    return e;
  };
  // from the transforms themselves: the box of a rotated line says nothing about its size
  const scaleOf = (el) => {
    if (el instanceof SVGElement) {
      const m = el.getScreenCTM();
      return m ? Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) : 1;
    }
    let s = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const t = getComputedStyle(e).transform;
      if (t && t !== "none") {
        const m = new DOMMatrix(t);
        s *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
      }
    }
    return s;
  };
  const measure = (frame) => {
    const blocks = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent.trim();
      const el = n.parentElement;
      if (!text || !el || /^(SCRIPT|STYLE|TITLE)$/.test(el.tagName)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const op = opacityOf(el);
      if (op < 0.05) continue;
      const block = blockOf(el);
      const key = block.textContent.replace(/\s+/g, " ").trim().slice(0, 160);
      const b = blocks.get(block) ?? { key, text: "", x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, px: 0, op: 0, family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim() };
      b.text = `${b.text} ${text}`.trim();
      b.x0 = Math.min(b.x0, r.left);
      b.y0 = Math.min(b.y0, r.top);
      b.x1 = Math.max(b.x1, r.right);
      b.y1 = Math.max(b.y1, r.bottom);
      b.px = Math.max(b.px, parseFloat(cs.fontSize) * scaleOf(el));
      b.op = Math.max(b.op, op);
      blocks.set(block, b);
    }
    const round = (v) => Math.round(v * 10) / 10;
    return {
      f: frame,
      blocks: [...blocks.values()].map((b) => ({ ...b, x0: round(b.x0), y0: round(b.y0), x1: round(b.x1), y1: round(b.y1), px: round(b.px), op: round(b.op) })),
      fonts: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")),
    };
  };
  let frame = null;
  let done = null;
  let setFrame;
  let ready = false;
  Object.defineProperty(window, "remotion_setFrame", {
    configurable: true,
    get: () => setFrame && ((f, c, a) => {
      frame = f;
      return setFrame(f, c, a);
    }),
    set: (fn) => {
      setFrame = fn;
    },
  });
  Object.defineProperty(window, "remotion_renderReady", {
    configurable: true,
    get: () => ready,
    set: (v) => {
      ready = v;
      if (v !== true || frame === null || frame === done) return;
      done = frame;
      const f = frame;
      // the ready flag can turn true just before React commits the frame; the screenshot takes longer than this wait
      setTimeout(() => frame === f && console.log(`CE_PROBE ${JSON.stringify(measure(f))}`), 16);
    },
  });
}

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
}
fs.writeFileSync(
  path.join(outDir, "probe.json"),
  JSON.stringify({ width: composition.width, height: composition.height, fps: composition.fps, total: composition.durationInFrames, audio: composition.props?.audio ?? null, frames: [...measured.values()].sort((a, b) => a.f - b.f), errors: [...new Set(errors)].slice(0, 20) }),
);
console.log(JSON.stringify({ frames: measured.size }));
