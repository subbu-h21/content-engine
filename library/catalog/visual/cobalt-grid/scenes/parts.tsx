/**
 * Cobalt Grid's pieces: paper with its permanent graph grid, hairlines and page furniture; type that prints on in hard
 * steps; data as grid cells that switch on one at a time; the stair-stepped pixel-glitch band; data patches.
 * Everything moves in steps: nothing fades. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, rgba, run, seeded, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  soft: color(P, "muted"),
  faint: color(P, "faint"),
};
const R = style.motion.recipes;
const T = style.type;
const E = style.elements;
const L = style.layout;
export const U = L.cell;
export const COL = W - 2 * M;
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

/** Progress of a recipe held to its hard steps: `steps` jumps, no in-betweens. */
export const stepped = (name: keyof typeof R, t: number): number => {
  const r = R[name];
  const p = run(r as unknown as Recipe, t);
  return p >= 1 ? 1 : Math.floor(p * r.steps) / r.steps;
};

/**
 * The sheet. The grid prints on first, in six hard steps down the frame; the hairlines and the page furniture follow. At
 * `leave` the content un-prints from the bottom up, in steps; the grid stays. Waits for the fonts.
 */
export const Ground: React.FC<{ n: number; hint: string; leave?: number; children: React.ReactNode }> = ({ n, hint, leave, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const uid = useUid("cg");
  const g = stepped("plate", t);
  const r = stepped("rule", t - 0.1);
  const out = leave === undefined ? 0 : stepped("out", t - leave);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <svg width={W} height={H} style={{ ...abs, clipPath: `inset(0 0 ${(1 - g) * 100}% 0)` }}>
        <defs>
          <pattern id={uid} width={U} height={U} patternUnits="userSpaceOnUse">
            <path d={`M ${U} 0 L 0 0 0 ${U}`} fill="none" stroke={rgba(C.ink, E.grid.alpha)} strokeWidth={E.grid.stroke} />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#${uid})`} />
      </svg>
      <div style={{ position: "absolute", left: M, top: L.topRule, width: COL * r, height: E.rule, backgroundColor: C.ink }} />
      <div style={{ position: "absolute", left: M, top: L.bottomRule, width: COL * r, height: E.rule, backgroundColor: C.ink }} />
      {r >= 1 ? <div style={{ position: "absolute", left: M, top: L.chromeY, fontFamily: MONO, fontSize: T.mono, letterSpacing: `${T.monoTracking}em`, textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap" }}>{hint}</div> : null}
      {r >= 1 ? <div style={{ position: "absolute", right: M, top: L.chromeY, fontFamily: MONO, fontSize: T.mono, letterSpacing: `${T.monoTracking}em`, color: C.ink }}>{String(n).padStart(2, "0")}</div> : null}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${out * 100}% 0)` }}>{children}</AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A clip that prints a block on from the top in hard steps. */
const scanned = (p: number): React.CSSProperties => (p >= 1 ? {} : { clipPath: `inset(-10% -5% ${(1 - p) * 110}% -5%)` });

/** Newsreader 400 lines, each printed on from the top in eight hard steps. `*stars*` are italic. */
export const News: React.FC<{ lines: string[]; x?: number; y: number; size: number; at?: number; right?: boolean; leading?: number; col?: string; tracking?: number }> = ({ lines, x = M, y, size, at = 0, right = false, leading = T.leading, col = C.ink, tracking = T.tracking }) => {
  const t = useSeconds() - at;
  return (
    <div style={{ position: "absolute", left: right ? undefined : x, right: right ? W - x : undefined, top: y, textAlign: right ? "right" : "left", fontFamily: DISPLAY, fontWeight: 400, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${tracking}em`, color: col, whiteSpace: "nowrap" }}>
      {lines.map((line, i) => {
        const p = stepped("scan", t - i * style.motion.stagger);
        return (
          <div key={i} style={{ height: size * leading, visibility: p > 0 ? "visible" : "hidden", ...scanned(p) }}>
            {words(line).map((w, wi) => (
              <React.Fragment key={wi}>
                {wi > 0 && !w.glue ? " " : null}
                <span style={{ fontStyle: w.em ? "italic" : "normal" }}>{w.text}</span>
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Mono chrome: DM Mono, set at once. */
export const Mono: React.FC<{ text: string; x?: number; y: number; at?: number; right?: boolean; col?: string; plate?: boolean; size?: number }> = ({ text, x = M, y, at = 0, right = false, col = C.ink, plate = false, size = T.mono }) => {
  if (useSeconds() - at <= 0) return null;
  return (
    <div style={{ position: "absolute", left: right ? undefined : x, right: right ? W - x : undefined, top: y, padding: plate ? "6px 10px" : undefined, backgroundColor: plate ? C.paper : undefined, fontFamily: MONO, fontSize: size, letterSpacing: `${T.monoTracking}em`, lineHeight: 1.2, textTransform: "uppercase", color: col, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Hanken body on a paper plate, so the grid never runs through reading text. */
export const Body: React.FC<{ text: string; x?: number; y: number; w: number; at?: number }> = ({ text, x = M, y, w, at = 0 }) => {
  const p = stepped("scan", useSeconds() - at);
  return <div style={{ position: "absolute", left: x, top: y, width: w, visibility: p > 0 ? "visible" : "hidden", fontFamily: BODY, fontWeight: 400, fontSize: T.body, lineHeight: 1.4, color: C.ink, ...scanned(p) }}>{text}</div>;
};

/** A hairline row divider, stepping across. */
export const Rule: React.FC<{ x?: number; y: number; w?: number; at?: number; faint?: boolean }> = ({ x = M, y, w = COL, at = 0, faint = false }) => {
  const p = stepped("rule", useSeconds() - at);
  return <div style={{ position: "absolute", left: x, top: y, width: w * p, height: E.rule, backgroundColor: faint ? C.faint : C.ink }} />;
};

/**
 * Grid cells that switch on one at a time. `cells` are [column, row] in grid units from the frame's corner; each turns on
 * `cellStep` after the one before it, in the array's order.
 */
export const Pix: React.FC<{ cells: [number, number][]; at?: number; step?: number; gap?: number; size?: number }> = ({ cells, at = 0, step = style.motion.cellStep, gap = E.cellGap, size = U }) => {
  const t = useSeconds() - at;
  return (
    <svg width={W} height={H} style={abs}>
      {cells.map(([c, r], i) => (t >= i * step ? <rect key={i} x={c * size + gap / 2} y={r * size + gap / 2} width={size - gap} height={size - gap} fill={C.ink} /> : null))}
    </svg>
  );
};

/** A row of data cells: `on` of them cobalt, the rest at 10%, switching on one at a time. Grid units; wraps to `cols`. */
export const Stack: React.FC<{ x: number; y: number; cols: number; rows: number; on: number; at?: number }> = ({ x, y, cols, rows, on, at = 0 }) => {
  const t = useSeconds() - at;
  const g = E.cellGap;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const lit = i < on && t >= i * style.motion.cellStep * 1.6;
    if (t < 0) continue;
    out.push(<rect key={i} x={(x + c) * U + g / 2} y={(y + r) * U + g / 2} width={U - g} height={U - g} fill={lit ? C.ink : rgba(C.ink, E.offAlpha)} />);
  }
  return (
    <svg width={W} height={H} style={abs}>
      {out}
    </svg>
  );
};

/**
 * The pixel glitch: scanline rows (3 px bars every 12 px) stair-stepping across a band, each row snapping on at its own
 * moment. `rows` are grid rows; `alpha` lowers it on chapter frames.
 */
export const Glitch: React.FC<{ y: number; rows: number; at?: number; seed?: number; alpha?: number; x?: number; w?: number; from?: "left" | "right" }> = ({ y, rows, at = 0, seed = 5, alpha = 1, x = 0, w = W, from = "right" }) => {
  const t = useSeconds() - at;
  const rnd = seeded(seed);
  const { bar, gap, rowH } = E.glitch;
  const stripes = `repeating-linear-gradient(90deg, ${C.ink} 0 ${bar}px, transparent ${bar}px ${gap}px)`;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: alpha }}>
      {Array.from({ length: rows }, (_, i) => {
        const j = rnd();
        const k = rnd();
        // a stair: the band narrows row by row, with a jitter of whole cells
        const inset = Math.round((i / Math.max(1, rows - 1)) * (w * 0.62) / U + (j - 0.5) * 5) * U;
        const width = Math.max(U * 3, w - Math.max(0, inset));
        if (t < k * style.motion.rowStep * rows * 0.5) return null;
        return <div key={i} style={{ position: "absolute", left: from === "right" ? x + w - width : x, top: y + i * rowH, width, height: rowH, background: stripes }} />;
      })}
    </div>
  );
};

/** A data patch: 8 × 8 seeded cells in a paper outset. Texture only: it isn't a real code and doesn't scan. */
export const Patch: React.FC<{ x: number; y: number; at?: number; seed?: number }> = ({ x, y, at = 0, seed = 11 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const rnd = seeded(seed);
  const { cells, size, outset } = E.patch;
  const full = cells * size;
  const rects: React.ReactNode[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const on = rnd() > 0.46;
    if (on && t >= i * 0.006) rects.push(<rect key={i} x={(i % cells) * size} y={Math.floor(i / cells) * size} width={size} height={size} fill={C.ink} />);
  }
  return (
    <div style={{ position: "absolute", left: x - outset, top: y - outset, width: full + 2 * outset, height: full + 2 * outset, backgroundColor: C.paper }}>
      <svg width={full} height={full} style={{ position: "absolute", left: outset, top: outset }}>
        {rects}
      </svg>
    </div>
  );
};
