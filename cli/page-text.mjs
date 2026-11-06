// Measures text as the page draws it, for the quality gate and the thumbnails. The function runs inside the page.
//
// Remotion has no public hook for "this frame is ready", so a script added to each page watches the two window
// variables its renderer uses (remotion_setFrame, remotion_renderReady; probed on 4.0.535, runtime/package.json pins it).

/** Runs in the page, before its own scripts. Logs one CE_PROBE line per finished frame. */
export function watchFrames() {
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
  // a font counts if the text can really use it, loaded by the page or installed: document.fonts only knows the first kind
  const canvas = document.createElement("canvas").getContext("2d");
  const widthIn = (font) => {
    canvas.font = `72px ${font}`;
    return canvas.measureText("mmmmmmmmmmlliI0Oo").width;
  };
  const available = new Map();
  const isAvailable = (family) => {
    if (!available.has(family)) available.set(family, ["serif", "sans-serif", "monospace"].some((g) => widthIn(`"${family}", ${g}`) !== widthIn(g)));
    return available.get(family);
  };
  // a stack is fine if any font named in it works: only when none does is the text drawn in a fallback nobody chose
  const fontDrawn = (stack) => {
    const named = stack.split(",").map((s) => s.replace(/["']/g, "").trim()).filter((s) => s && !/^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif|ui-monospace|ui-rounded|emoji|math|fangsong)$/.test(s));
    return !named.length || named.some(isAvailable);
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
      const b = blocks.get(block) ?? { key, text: "", x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, px: 0, op: 0, family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(), fontOk: fontDrawn(cs.fontFamily), color: el instanceof SVGElement ? cs.fill : cs.webkitTextFillColor || cs.color };
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
