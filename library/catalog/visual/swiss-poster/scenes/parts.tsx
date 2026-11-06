/**
 * Swiss Poster's pieces: the page and its visible 6-column grid, white poster sheets laid in by a vertical wipe, flat
 * bars that snap along their length, words that rise out of a clip below their baseline, caption rows under a 1 px
 * rule, numerals that climb in four steps, the signal circle (the one exception: it travels linearly and grows), the
 * knife line, and technical notes. Two curves only: the snap and linear. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACE, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  page: color(P, "background"),
  paper: color(P, "surface"),
  ink: color(P, "text"),
  grey: color(P, "muted"),
  line: color(P, "faint"),
  signal: color(P, "accent"),
  second: color(P, "accent2"),
  build: color(P, "gridBuild"),
  paperLine: color(P, "gridPaper"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const L = style.layout;
const E = style.elements;
export const COLW = (W - 2 * M - (L.columns - 1) * L.gutter) / L.columns;
/** Left edge of column `i` (1-based). */
export const col = (i: number): number => M + (i - 1) * (COLW + L.gutter);
/** Width of `n` columns with their gutters. */
export const span = (n: number): number => n * COLW + (n - 1) * L.gutter;
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

/** The page with its column grid; the grid lines draw in linearly from the top at `gridAt`. Waits for the fonts. */
export const Page: React.FC<{ children: React.ReactNode; grid?: boolean; gridAt?: number }> = ({ children, grid = true, gridAt = 0 }) => {
  useFontsReady(FACES);
  const t = useSeconds() - gridAt;
  const p = ease("line", t);
  const xs: number[] = [];
  for (let i = 1; i <= L.columns; i++) xs.push(col(i), col(i) + COLW);
  return (
    <AbsoluteFill style={{ backgroundColor: C.page, overflow: "hidden" }}>
      {grid ? (
        <svg width={W} height={H} style={abs}>
          {xs.map((x, i) => (
            <rect key={i} x={Math.round(x)} y={0} width={1} height={H * p} fill={p < 1 ? C.build : C.line} />
          ))}
        </svg>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

/** A white poster sheet laid in by a vertical wipe (top to bottom), optionally with its own faint grid. */
export const Sheet: React.FC<{ x: number; y: number; w: number; h: number; at: number; grid?: [number, number]; children?: React.ReactNode }> = ({ x, y, w, h, at, grid, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("wipe", t);
  const lines: React.ReactNode[] = [];
  if (grid) {
    const [cols, rows] = grid;
    for (let i = 1; i < cols; i++) lines.push(<rect key={`c${i}`} x={(w * i) / cols} y={0} width={1} height={h} fill={C.paperLine} />);
    for (let j = 1; j < rows; j++) lines.push(<rect key={`r${j}`} x={0} y={(h * j) / rows} width={w} height={1} fill={C.paperLine} />);
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: C.paper, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, overflow: "hidden" }}>
      <svg width={w} height={h} style={abs}>
        {lines}
      </svg>
      {children}
    </div>
  );
};

/** A flat bar that snaps along its length from one end (`from` = "left" | "right" | "top" | "bottom"). */
export const Bar: React.FC<{ x: number; y: number; w: number; h: number; at: number; col?: string; from?: "left" | "right" | "top" | "bottom" }> = ({ x, y, w, h, at, col = C.ink, from = "left" }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("snap", t);
  const clip = from === "left" ? `inset(0 ${(1 - p) * 100}% 0 0)` : from === "right" ? `inset(0 0 0 ${(1 - p) * 100}%)` : from === "top" ? `inset(0 0 ${(1 - p) * 100}% 0)` : `inset(${(1 - p) * 100}% 0 0 0)`;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: col, clipPath: clip }} />;
};

/**
 * Words that rise out of a clip rect from below their baseline, one sixteenth (0.125 s) each, one after another.
 * `*stars*` mark words set in the other weight (regular in a bold line, or bold in a regular one).
 */
export const Words: React.FC<{
  lines: string[];
  x?: number;
  y: number;
  size: number;
  at: number;
  weight?: number;
  emWeight?: number;
  col?: string;
  leading?: number;
  tracking?: number;
}> = ({ lines, x = M, y, size, at, weight = 700, emWeight = 400, col = C.ink, leading = T.leading, tracking = size >= 90 ? T.tracking : 0 }) => {
  const t = useSeconds() - at;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y - size * 0.86, fontFamily: FACE, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${tracking}em`, color: col, whiteSpace: "nowrap" }}>
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("word", t - i * style.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
                  <span style={{ display: "inline-block", fontWeight: w.em ? emWeight : weight, transform: `translateY(${(1 - p) * 110}%)` }}>{w.text}</span>
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A caption row: a 1 px rule that draws in (linear), then the note rising under it (Medium, 26 px). */
export const Note: React.FC<{ text: string; x?: number; y: number; w?: number; at: number; col?: string; size?: number; ruleCol?: string }> = ({ text, x = M, y, w = span(3), at, col = C.ink, size = T.note, ruleCol = C.ink }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const r = ease("line", t * 2);
  const p = ease("word", t - 0.12);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w * r, height: E.rule, backgroundColor: ruleCol }} />
      <div style={{ position: "absolute", left: x, top: y + 8, width: w, overflow: "hidden", fontFamily: FACE, fontWeight: 500, fontSize: size, lineHeight: 1.25, color: col }}>
        <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{text}</div>
      </div>
    </>
  );
};

/** A giant numeral that climbs into place in four eased steps, optically flush left, bottom on `y`. */
export const Numeral: React.FC<{ text: string; x?: number; y: number; size: number; at: number; col?: string; weight?: number }> = ({ text, x = M, y, size, at, col = C.ink, weight = 700 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const steps = R.climb.steps;
  const d = R.climb.duration;
  const k = Math.min(steps, Math.floor(t / d));
  const p = k >= steps ? 1 : (k + ease("climb", t - k * d)) / steps;
  return (
    <div style={{ position: "absolute", left: x - size * 0.045, top: y - size * 0.92, height: size * 0.92, overflow: "hidden", fontFamily: FACE, fontWeight: weight, fontSize: size, lineHeight: `${size * 0.92}px`, letterSpacing: "-0.04em", color: col, whiteSpace: "nowrap" }}>
      <div style={{ transform: `translateY(${(1 - p) * 100}%)` }}>{text}</div>
    </div>
  );
};

/**
 * The signal circle: the one exception. It travels linearly from `from` to its place, unsnapped, pauses for one eighth
 * half way, and grows as it travels.
 */
export const Signal: React.FC<{ cx: number; cy: number; r: number; at: number; from?: [number, number]; dur?: number; col?: string }> = ({ cx, cy, r, at, from, dur = 0.75, col = C.signal }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const pause = R.snap.duration;
  const half = (dur - pause) / 2;
  const u = t < half ? (t / half) * 0.5 : t < half + pause ? 0.5 : 0.5 + clamp((t - half - pause) / half) * 0.5;
  const [fx, fy] = from ?? [cx, cy + 300];
  const x = fx + (cx - fx) * u;
  const y = fy + (cy - fy) * u;
  const rr = r * (0.35 + 0.65 * u);
  return <div style={{ position: "absolute", left: x - rr, top: y - rr, width: 2 * rr, height: 2 * rr, borderRadius: "50%", backgroundColor: col }} />;
};

/** The knife: a 2 px signal line drawn linearly between two points in one sixteenth. */
export const Knife: React.FC<{ from: [number, number]; to: [number, number]; at: number; dur?: number; col?: string }> = ({ from, to, at, dur = R.knife.duration, col = C.signal }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = clamp(t / dur);
  return (
    <svg width={W} height={H} style={abs}>
      <line x1={from[0]} y1={from[1]} x2={from[0] + (to[0] - from[0]) * p} y2={from[1] + (to[1] - from[1]) * p} stroke={col} strokeWidth={E.knife} />
    </svg>
  );
};

/** A technical note in the corner (`Columns 6 · Rows 17 · Module 136 × 80`), set like a caption without the rule. */
export const Tech: React.FC<{ text: string; x?: number; y: number; at: number; align?: "left" | "right"; col?: string }> = ({ text, x = M, y, at, align = "left", col = C.grey }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("word", t);
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? W - x : undefined, top: y, overflow: "hidden", fontFamily: FACE, fontWeight: 500, fontSize: T.note, color: col, whiteSpace: "nowrap" }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{text}</div>
    </div>
  );
};
