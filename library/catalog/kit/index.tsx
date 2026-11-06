/**
 * The catalog kit: what every style's scenes share. Copied to `src/kit/` next to `src/style/` wherever a style is
 * rendered (the preview project, later a video), so a style's scenes import it as `../../kit`.
 */
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import sample from "../sample.json";

export type SampleContent = typeof sample;
export const SAMPLE: SampleContent = sample;

/** One moment of a style's preview. Seconds; `hero` is the moment its still shows. */
export type Sample = {
  id: "title" | "headline" | "diagram" | "number" | "list" | "end" | string;
  duration: number;
  hero: number;
  component: React.FC;
};

/** Named easing curves a recipe may use (see `CURVES`); a bezier [x1, y1, x2, y2] works too. */
export type CurveName = "linear" | "expo-out" | "expo-in" | "expo-in-out" | "cubic-out" | "cubic-in" | "cubic-in-out" | "quart-out" | "quart-in" | "sine-in-out" | "smootherstep";

/** A named move from style.json. A bezier curve is read from JSON as number[], so that's accepted too. */
export type Recipe =
  | { kind: "spring"; damping: number; stiffness: number; mass: number }
  | { kind: "ease"; curve: CurveName | number[] | string; duration: number; distance?: number };

/** Seconds since the sample started. */
export const useSeconds = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const clamp = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const expoOut = (t: number): number => {
  const x = clamp(t);
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
};
export const smooth = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Cubic bezier easing (CSS-style control points). */
export const bezier = (x1: number, y1: number, x2: number, y2: number) => (t: number): number => {
  const x = clamp(t);
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let u = x;
  for (let i = 0; i < 6; i++) {
    const fx = ((ax * u + bx) * u + cx) * u - x;
    const d = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(fx) < 1e-6 || d === 0) break;
    u -= fx / d;
  }
  return ((ay * u + by) * u + cy) * u;
};

/**
 * Closed-form damped spring from 0 to 1 at `t` seconds (mass m, stiffness k, damping c), the same parameters as
 * Remotion's spring(). Overshoots when underdamped, so the result can go above 1.
 */
export const springAt = (t: number, r: { damping: number; stiffness: number; mass: number }): number => {
  if (t <= 0) return 0;
  const { damping: c, stiffness: k, mass: m } = r;
  const w0 = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(k * m));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const s1 = -w0 * (z - Math.sqrt(z * z - 1));
  const s2 = -w0 * (z + Math.sqrt(z * z - 1));
  return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
};

/** Easing functions by name, all 0..1 → 0..1. */
export const CURVES: Record<CurveName, (t: number) => number> = {
  linear: (t) => clamp(t),
  "expo-out": expoOut,
  "expo-in": (t) => (clamp(t) <= 0 ? 0 : Math.pow(2, 10 * clamp(t) - 10)),
  "expo-in-out": (t) => {
    const x = clamp(t);
    return x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  },
  "cubic-out": (t) => 1 - Math.pow(1 - clamp(t), 3),
  "cubic-in": (t) => Math.pow(clamp(t), 3),
  "cubic-in-out": (t) => {
    const x = clamp(t);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
  "quart-out": (t) => 1 - Math.pow(1 - clamp(t), 4),
  "quart-in": (t) => Math.pow(clamp(t), 4),
  "sine-in-out": (t) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2,
  smootherstep: (t) => {
    const x = clamp(t);
    return x * x * x * (x * (x * 6 - 15) + 10);
  },
};

/** Progress of a named recipe `t` seconds after it starts (springs may overshoot 1). Unknown curve names fall back to expo-out. */
export const run = (r: Recipe, t: number): number => {
  if (r.kind === "spring") return springAt(t, r);
  const p = r.duration > 0 ? clamp(t / r.duration) : t >= 0 ? 1 : 0;
  if (Array.isArray(r.curve) && r.curve.length === 4) {
    const [x1, y1, x2, y2] = r.curve;
    return bezier(x1, y1, x2, y2)(p);
  }
  return (CURVES[r.curve as CurveName] ?? expoOut)(p);
};

/** Exponential decay for hits and flashes: 1 at `t0`, halving every `halfLife` seconds, 0 before `t0`. */
export const pulse = (t: number, t0: number, halfLife: number): number => (t < t0 ? 0 : Math.pow(0.5, (t - t0) / halfLife));

/** Seeded random numbers (mulberry32): the same seed gives the same sequence on every render. */
export const seeded = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

/** Mix two #rrggbb colours (t = 0 → a, 1 → b), returned as #rrggbb. */
export const mix = (a: string, b: string, t: number): string => {
  const p = (h: string) => {
    const n = parseInt(h.replace("#", "").slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [x, y] = [p(a), p(b)];
  const k = clamp(t);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;
};

/**
 * "Every colour *at once.*" → [{ text, em, glue }] words; *stars* mark emphasis. `glue` is true when nothing separates
 * a word from the one before it ("5.9*×*" → "5.9" then "×" glued), so scenes leave out the space there.
 */
export const words = (line: string): { text: string; em: boolean; glue: boolean }[] => {
  const out: { text: string; em: boolean; glue: boolean }[] = [];
  let em = false;
  let spaced = true; // was there whitespace before the next word?
  for (const part of line.split("*")) {
    const pieces = part.split(/(\s+)/);
    for (const p of pieces) {
      if (!p) continue;
      if (/^\s+$/.test(p)) {
        spaced = true;
        continue;
      }
      out.push({ text: p, em, glue: out.length > 0 && !spaced });
      spaced = false;
    }
    em = !em;
  }
  return out;
};

/** The text without emphasis marks. */
export const plain = (line: string): string => line.replace(/\*/g, "");

/**
 * Font size at which the longest line fits `width`, capped at `max`. `charEm` is the face's average character width
 * in em (about 0.5 for most text faces, less for condensed ones), so this is an estimate, not a measurement.
 */
export const fit = (lines: string[], width: number, max: number, charEm = 0.5): number =>
  Math.min(max, Math.floor(width / (Math.max(1, ...lines.map((l) => plain(l).length)) * charEm)));

/** Greedy wrap of a line into lines of at most `maxChars` characters, keeping *emphasis* marks balanced per line. */
export const wrap = (text: string, maxChars: number): string[] => {
  const out: string[] = [];
  let cur: { text: string; em: boolean; glue: boolean }[] = [];
  const flush = () => {
    if (!cur.length) return;
    // rebuild the line with its *emphasis* marks; neighbouring emphasised words share one pair of stars
    const line = cur.map((w, i) => (i > 0 && !w.glue ? " " : "") + (w.em ? `*${w.text}*` : w.text)).join("");
    out.push(line.replace(/\* \*/g, " ").replace(/\*\*/g, ""));
    cur = [];
  };
  for (const w of words(text)) {
    // a glued word never starts a line
    const len = cur.reduce((n, x, i) => n + x.text.length + (i > 0 && !x.glue ? 1 : 0), 0) + (cur.length && !w.glue ? 1 : 0) + w.text.length;
    if (cur.length && len > maxChars && !w.glue) flush();
    cur.push(w);
  }
  flush();
  return out;
};

export const rgba = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${clamp(a).toFixed(3)})`;
};

type PaletteEntry = { role: string; hex: string };
/** A colour by role from a style's palette (falls back to `fallback`, then magenta so a missing role is obvious). */
export const color = (palette: PaletteEntry[], role: string, fallback?: string): string =>
  palette.find((p) => p.role === role)?.hex ?? (fallback ? palette.find((p) => p.role === fallback)?.hex : undefined) ?? "#ff00ff";

/**
 * Hold the render until the given CSS font faces are loaded (e.g. `700 80px "Archivo"`). Call once in the style's
 * scenes after the loadFont() calls; gives up after 4 s so a missing font shows instead of hanging the render.
 */
export const useFontsReady = (faces: string[]): void => {
  const [handle] = useState(() => delayRender("Waiting for the style's fonts"));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    Promise.all(faces.map((f) => document.fonts.load(f).catch(() => undefined)))
      .then(() => document.fonts.ready)
      .then(finish, finish);
    const t = setTimeout(finish, 4000);
    return () => clearTimeout(t);
  }, [handle]);
};

/** A prefix for SVG filter, clip and gradient ids that is unique per component, so two samples never share an id. */
export const useUid = (name = "s"): string => `${name}-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** Film grain + vignette, shared so every style's finish is set by numbers (0 = off). */
export const Finish: React.FC<{ grain: number; vignette: number; width: number; height: number }> = ({ grain, vignette, width, height }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {vignette > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {grain > 0 ? (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "overlay", opacity: Math.min(1, grain * 9) }}>
          <svg width={width} height={height}>
            <filter id="kit-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 251} stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width={width} height={height} filter="url(#kit-grain)" />
          </svg>
        </div>
      ) : null}
    </>
  );
};
