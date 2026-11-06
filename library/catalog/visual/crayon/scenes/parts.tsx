/**
 * Crayon's pieces. Everything is drawn procedurally and deterministically:
 * - outlines are ribbons around a hand-wobbled centreline (seeded noise), tapered at both ends, that re-jitter
 *   ("boil") every `boil.hold` frames;
 * - colouring is a zig-zag hatch across the shape, overshooting the outline, laid row by row;
 * - wax only sticks where the paper's tooth is high enough for the stroke's pressure (an SVG filter: feTurbulence
 *   tooth + an arithmetic threshold against the stroke's alpha);
 * - the one watercolour is a set of wide bands with displaced, pooled edges and blooms (feTurbulence +
 *   feDisplacementMap), multiplied over the page under the crayon, so wax resists it;
 * - words are real type, each glyph tilted and offset, written letter by letter and boiling with the lines.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, run, seeded, useFontsReady, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, HAND, TITLE } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  sky: color(P, "accent"),
  yellow: color(P, "accent2"),
  orange: color(P, "orange"),
  red: color(P, "red"),
  pink: color(P, "pink"),
  peach: color(P, "peach"),
  brown: color(P, "brown"),
  ochre: color(P, "ochre"),
  green: color(P, "green"),
  violet: color(P, "violet"),
  wax: color(P, "whiteWax"),
  wash: color(P, "wash"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** A recipe's curve over another duration. */
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration: number): number =>
  run({ ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);

/** Time on twos: drawing, colouring, words and the boil all step every `boil.hold` frames. */
export const useTwos = (): { t: number; step: number } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.floor(frame / E.boil.hold);
  return { t: (step * E.boil.hold) / fps, step };
};

// ------------------------------------------------------------------ geometry

export type Pt = [number, number];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Smooth seeded 1D value noise in [-1, 1]. */
export const noise1 = (seed: number) => {
  const r = seeded(seed);
  const v = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x: number): number => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = v[((i % 256) + 256) % 256];
    const b = v[(((i + 1) % 256) + 256) % 256];
    return a + (b - a) * u;
  };
};

/** A polyline resampled to points `step` px apart. */
export const resample = (pts: Pt[], step = 5): Pt[] => {
  if (pts.length < 2) return pts.slice();
  const out: Pt[] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const d = dist(a, b);
    if (d === 0) continue;
    let s = step - carry;
    while (s <= d) {
      out.push([a[0] + ((b[0] - a[0]) * s) / d, a[1] + ((b[1] - a[1]) * s) / d]);
      s += step;
    }
    carry = d - (s - step);
  }
  const last = pts[pts.length - 1];
  if (dist(out[out.length - 1], last) > step * 0.3) out.push(last);
  return out;
};

/** Points along an ellipse arc (angles in degrees). */
export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 40): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

/** A closed ellipse as a polygon. */
export const ellipse = (cx: number, cy: number, rx: number, ry = rx, n = 48): Pt[] => arc(cx, cy, rx, ry, 0, 360, n).slice(0, n);

/** A quadratic bezier as points. */
export const quad = (p0: Pt, c: Pt, p1: Pt, n = 24): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]] as Pt;
  });

/** A smooth curve through points (Catmull-Rom). */
export const smoothPts = (pts: Pt[], n = 10): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const shift = (pts: Pt[], dx: number, dy: number, s = 1): Pt[] => pts.map(([x, y]) => [dx + x * s, dy + y * s] as Pt);

/** The hand: a slow wobble along the normal (the arm), plus a small boil that changes every step. */
export const handPts = (pts: Pt[], seed: number, boilAmp: number, step: number, amp: number = E.wobble.amp): Pt[] => {
  const r = resample(pts, 5);
  const slow = noise1(seed);
  const boil = noise1(seed * 31 + step * 7919);
  const rb = seeded(seed * 13 + step * 104729);
  const [bx, by] = [(rb() - 0.5) * 2 * E.boil.offset * boilAmp, (rb() - 0.5) * 2 * E.boil.offset * boilAmp];
  let s = 0;
  return r.map((p, i) => {
    if (i > 0) s += dist(r[i - 1], p);
    const a = r[Math.max(0, i - 1)];
    const b = r[Math.min(r.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const off = amp * slow(s / E.wobble.wavelength) + E.boil.wobble * boilAmp * boil(s / 34);
    return [p[0] - (dy / L) * off + bx, p[1] + (dx / L) * off + by] as Pt;
  });
};

/** A ribbon polygon around a centreline, its width from `w(u)` (u = 0..1 along the whole line). */
export const ribbon = (pts: Pt[], w: (u: number) => number, total = pts.length): string => {
  const n = pts.length;
  if (n < 2) return "";
  const L: Pt[] = [];
  const Rr: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const hw = w(i / Math.max(1, total - 1)) / 2;
    L.push([pts[i][0] - (dy / len) * hw, pts[i][1] + (dx / len) * hw]);
    Rr.push([pts[i][0] + (dy / len) * hw, pts[i][1] - (dx / len) * hw]);
  }
  const all = [...L, ...Rr.reverse()];
  return `M${all.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} Z`;
};

/** Zig-zag colouring rows across a polygon at `angle` (degrees), joined at alternate ends, overshooting the edge. */
export const hatchPts = (poly: Pt[], seed: number, angle: number = E.hatch.angle, gap: number = E.hatch.gap, over: number = E.hatch.overshoot): Pt[] => {
  const r = seeded(seed);
  const a = (angle * Math.PI) / 180;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  const rot = poly.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca] as Pt);
  const ys = rot.map((p) => p[1]);
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const out: Pt[] = [];
  let k = 0;
  for (let y = y0 + gap * 0.45; y < y1; y += gap) {
    const xs: number[] = [];
    for (let i = 0; i < rot.length; i++) {
      const p = rot[i];
      const q = rot[(i + 1) % rot.length];
      if ((p[1] <= y && q[1] > y) || (q[1] <= y && p[1] > y)) xs.push(p[0] + ((y - p[1]) * (q[0] - p[0])) / (q[1] - p[1]));
    }
    if (xs.length < 2) continue;
    const xa = Math.min(...xs) - r() * over + 2;
    const xb = Math.max(...xs) + r() * over - 2;
    const yy = y + (r() - 0.5) * gap * 0.3;
    if (k % 2 === 0) out.push([xa, yy], [xb, yy + (r() - 0.5) * 4]);
    else out.push([xb, yy], [xa, yy + (r() - 0.5) * 4]);
    k += 1;
  }
  return out.map(([x, y]) => [x * ca - y * sa, x * sa + y * ca] as Pt);
};

const pathOf = (pts: Pt[]): string => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}` : "");

// ------------------------------------------------------------------ the page

/** The page: warm paper with an embossed tooth anchored to it, fibres, a warm vignette. Waits for the fonts. */
export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const wx = E.wax;
  // wax deposits where tooth > 1 - k * pressure (soft edge ±edge): an arithmetic threshold on the normalised tooth
  const s = 1 / (2 * wx.edge);
  const k2 = s / (wx.hi - wx.lo);
  const k3 = s * wx.k;
  const k4 = 0.5 - s - (s * wx.lo) / (wx.hi - wx.lo);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="cr-tooth" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={wx.toothFrequency} numOctaves={3} seed={7} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="h" />
            <feDiffuseLighting in="h" surfaceScale={2.2} diffuseConstant={1} lightingColor="#ffffff" result="lit">
              <feDistantLight azimuth={225} elevation={52} />
            </feDiffuseLighting>
          </filter>
          <filter id="cr-fibre" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.1 0.52" numOctaves={2} seed={11} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="cr-wax" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={wx.toothFrequency} numOctaves={3} seed={7} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="tooth" />
            <feComposite in="tooth" in2="SourceAlpha" operator="arithmetic" k1={0} k2={k2} k3={k3} k4={k4} result="stick" />
            <feComponentTransfer in="SourceGraphic" result="solid">
              <feFuncA type="linear" slope={24} intercept={0} />
            </feComponentTransfer>
            <feComposite in="solid" in2="stick" operator="in" />
          </filter>
          <filter id="cr-wash" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves={2} seed={3} result="lo" />
            <feDisplacementMap in="SourceAlpha" in2="lo" scale={E.wash.edge} xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feGaussianBlur in="shape" stdDeviation={4} result="soft" />
            <feGaussianBlur in="shape" stdDeviation={13} result="wide" />
            <feComposite in="soft" in2="wide" operator="arithmetic" k2={1.75} k3={-0.75} result="pool" />
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={19} result="mid" />
            <feColorMatrix in="mid" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="bloom" />
            <feComposite in="pool" in2="bloom" operator="arithmetic" k1={0.6} k2={0.66} result="bloomed" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.07" numOctaves={2} seed={23} result="str" />
            <feColorMatrix in="str" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="streak" />
            <feComposite in="bloomed" in2="streak" operator="arithmetic" k1={0.55} k2={0.74} result="density" />
            <feFlood floodColor={C.wash} result="pigment" />
            <feComposite in="pigment" in2="density" operator="in" />
          </filter>
          <radialGradient id="cr-vig" cx="50%" cy="50%" r="75%">
            <stop offset="0.55" stopColor={S.finish.warmVignette} stopOpacity={0} />
            <stop offset="1" stopColor={S.finish.warmVignette} stopOpacity={S.finish.vignette} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} filter="url(#cr-tooth)" style={{ mixBlendMode: "multiply" }} opacity={0.26 * S.finish.emboss} />
        <rect width={W} height={H} filter="url(#cr-fibre)" style={{ mixBlendMode: "multiply" }} opacity={0.07} />
        {children}
        <rect width={W} height={H} fill="url(#cr-vig)" style={{ mixBlendMode: "multiply" }} />
      </svg>
      <Finish grain={S.finish.grain} vignette={0} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A layer of wax: everything inside sticks only to the tooth. */
export const Wax: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#cr-wax)">{children}</g>;

// ------------------------------------------------------------------ crayon marks

type Boil = "char" | "bg" | "still";
const boilAmp = (b: Boil) => (b === "char" ? 1 : b === "bg" ? E.boil.background : 0);

/**
 * A crayon outline drawn on along its length: a tapered ribbon with ±15% width, a denser core and one thin streak.
 * `pressure` is how hard it's pressed (0.5 speckled … 1 near solid).
 */
export const Line: React.FC<{ pts: Pt[]; at: number; dur?: number; width?: number; col?: string; seed: number; boil?: Boil; pressure?: number; smooth?: boolean }> = ({
  pts,
  at,
  dur = R.draw.kind === "ease" ? R.draw.duration : 0.6,
  width = E.outline.character,
  col = C.ink,
  seed,
  boil = "char",
  pressure = 0.84,
  smooth = false,
}) => {
  const { t, step } = useTwos();
  const p = easeFor("draw", t - at, dur);
  if (p <= 0) return null;
  const base = smooth ? smoothPts(pts) : pts;
  const hp = handPts(base, seed, boilAmp(boil), boil === "still" ? 0 : step);
  const n = Math.max(2, Math.ceil(hp.length * p));
  const part = hp.slice(0, n);
  const wn = noise1(seed + 5);
  const tp = E.outline.taper;
  const w = (u: number) => width * (1 + 0.15 * wn(u * 9)) * (0.45 + 0.55 * Math.min(1, u / tp, (1 - u) / tp + (p < 1 ? 1 : 0)));
  const core = (u: number) => w(u) * 0.45;
  return (
    <g>
      <path d={ribbon(part, w, hp.length)} fill={col} fillOpacity={pressure * 0.86} />
      <path d={ribbon(part, core, hp.length)} fill={col} fillOpacity={Math.min(1, pressure * 1.1)} />
      <path d={ribbon(part.map(([x, y]) => [x + width * 0.22, y - width * 0.18] as Pt), (u) => w(u) * 0.16, hp.length)} fill={col} fillOpacity={pressure * 0.7} />
    </g>
  );
};

/** Zig-zag colouring of a polygon, laid row by row; a lighter cross-hatch pass on big areas. Colouring doesn't boil. */
export const Fill: React.FC<{ poly: Pt[]; at: number; dur?: number; col: string; seed: number; pressure?: number; cross?: boolean; angle?: number; gap?: number; width?: number }> = ({
  poly,
  at,
  dur = R.colour.kind === "ease" ? R.colour.duration : 0.9,
  col,
  seed,
  pressure = 0.95,
  cross = false,
  angle = E.hatch.angle,
  gap = E.hatch.gap,
  width = E.hatch.width,
}) => {
  const { t } = useTwos();
  const p = easeFor("colour", t - at, dur);
  if (p <= 0) return null;
  const [lo, hi] = E.hatch.pressure;
  const pass = lo + (hi - lo) * seeded(seed)();
  const main = handPts(hatchPts(poly, seed, angle, gap), seed + 3, 0, 0, 1.2);
  const q = cross ? clamp((p - 0.55) / 0.45) : 0;
  const second = cross ? handPts(hatchPts(poly, seed + 9, angle + 74, gap * 1.15), seed + 4, 0, 0, 1.2) : [];
  return (
    <g fill="none" stroke={col} strokeLinecap="round" strokeLinejoin="round">
      <path d={pathOf(main)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p / (cross ? 0.6 : 1))} strokeWidth={width} strokeOpacity={clamp(pressure * pass * 0.82)} />
      {q > 0 ? <path d={pathOf(second)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} strokeWidth={width * 0.85} strokeOpacity={E.hatch.cross * pressure} /> : null}
    </g>
  );
};

/** A hand-made dot (eyes, tree dots): a small filled blob that boils. */
export const Dot: React.FC<{ x: number; y: number; r: number; col?: string; at: number; seed: number; pressure?: number }> = ({ x, y, r, col = C.ink, at, seed, pressure = 1 }) => {
  const { t, step } = useTwos();
  if (t < at) return null;
  const pts = handPts(ellipse(x, y, r, r * 0.92, 14), seed, 0.6, step, r * 0.08);
  return <path d={`${pathOf(pts)} Z`} fill={col} fillOpacity={pressure} />;
};

/**
 * Hand-lettered words: real type, each glyph tilted and nudged, written on letter by letter and boiling on twos.
 * `col` may be a function of the letter index (a word lettered in several crayons).
 */
export const Words: React.FC<{
  text: string;
  x: number;
  y: number;
  size: number;
  at: number;
  per?: number;
  font?: "title" | "hand";
  col?: string | ((i: number) => string);
  anchor?: "start" | "middle" | "end";
  seed?: number;
  pressure?: number;
}> = ({ text, x, y, size, at, per = S.motion.letter, font = "title", col = C.ink, anchor = "start", seed = 1, pressure = 0.95 }) => {
  const { t, step } = useTwos();
  if (t < at) return null;
  const shown = Math.floor((t - at) / per) + 1;
  const r0 = seeded(seed * 977);
  const rb = seeded(seed * 131 + step * 7);
  const chars = Array.from(text);
  let prev = 0;
  return (
    <text
      x={x}
      y={y}
      fontFamily={font === "title" ? TITLE : HAND}
      fontWeight={font === "title" ? 700 : 400}
      fontSize={size}
      textAnchor={anchor}
      style={{ whiteSpace: "pre" }}
    >
      {chars.map((ch, i) => {
        const tilt = (r0() - 0.5) * 2 * E.glyph.tilt + (rb() - 0.5) * 2 * E.boil.tilt;
        const off = (r0() - 0.5) * 2 * E.glyph.offset * (size / 100) + (rb() - 0.5) * 2 * E.boil.offset;
        const dy = off - prev;
        prev = off;
        return (
          <tspan key={i} rotate={tilt.toFixed(2)} dy={dy.toFixed(2)} fill={typeof col === "function" ? col(i) : col} fillOpacity={i < shown ? pressure : 0}>
            {ch}
          </tspan>
        );
      })}
    </text>
  );
};

/** A ragged knock-out patch of blank paper behind words (never a dark box). */
export const Patch: React.FC<{ x: number; y: number; w: number; h: number; seed: number }> = ({ x, y, w, h, seed }) => {
  const r = seeded(seed);
  const pts: Pt[] = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rx = w / 2 + (r() - 0.5) * 18;
    const ry = h / 2 + (r() - 0.5) * 14;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const sq = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 0.35);
    pts.push([x + w / 2 + rx * sq(c), y + h / 2 + ry * sq(s)]);
  }
  return <path d={`${pathOf(smoothPts([...pts, pts[0]], 4))} Z`} fill={C.paper} />;
};

/** The one watercolour wash: wide overlapping bands laid left to right (with a wandering wet edge), resisted by wax. */
export const Wash: React.FC<{ top: number; bottom: number; at: number; dur?: number; bands?: number; seed?: number; ground?: Pt[] }> = ({ top, bottom, at, dur = R.wash.kind === "ease" ? R.wash.duration : 1.3, bands = 5, seed = 41, ground }) => {
  const { t } = useTwos();
  const p = easeFor("wash", t - at, dur);
  if (p <= 0) return null;
  const r = seeded(seed);
  const bh = (bottom - top) / bands;
  const rects = Array.from({ length: bands }, (_, i) => {
    const lag = i * 0.12;
    const q = clamp((p * (1 + lag * bands * 0.4) - lag) / 1);
    const y = top + i * bh - 30 - r() * 20;
    return { y, h: bh + 70, w: -80 + q * (W + 180), tilt: (r() - 0.5) * 40 };
  });
  return (
    <g style={{ mixBlendMode: "multiply" }} opacity={E.wash.density}>
      <defs>
        {ground ? (
          <clipPath id={`cr-ground-${seed}`}>
            <path d={`${pathOf([[-200, -200], [W + 200, -200], [W + 200, ground[ground.length - 1][1]], ...ground.slice().reverse(), [-200, ground[0][1]]])} Z`} />
          </clipPath>
        ) : null}
      </defs>
      <g clipPath={ground ? `url(#cr-ground-${seed})` : undefined}>
        <g filter="url(#cr-wash)">
          {rects.map((b, i) => (b.w > -60 ? <path key={i} d={`M -100 ${b.y} L ${b.w} ${b.y + b.tilt} L ${b.w + 30} ${b.y + b.h + b.tilt} L -100 ${b.y + b.h} Z`} fill="#000" fillOpacity={0.8 - (0.3 * i) / Math.max(1, bands - 1)} /> : null))}
        </g>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ characters and things

/** A child (a skilled adult drawing like a child): round head, dot eyes looking up, pink cheeks, tube limbs, mittens. */
export const Child: React.FC<{ x: number; y: number; at: number; seed?: number; point?: boolean }> = ({ x, y, at, seed = 100, point = true }) => {
  const head: Pt = [x, y - 270];
  const hr = 64;
  const hair: Pt[] = [
    [x - 74, y - 228],
    ...arc(head[0], head[1] - 4, 76, 74, 168, 372, 24),
    [x + 74, y - 228],
    [x + 54, y - 262],
    [x + 22, y - 290],
    [x - 14, y - 288],
    [x - 46, y - 272],
    [x - 62, y - 246],
  ];
  const dress: Pt[] = [
    [x - 30, y - 204],
    [x + 30, y - 204],
    [x + 74, y - 84],
    [x - 74, y - 84],
  ];
  const armUp: Pt[] = point
    ? [
        [x + 26, y - 196],
        [x + 70, y - 250],
        [x + 98, y - 314],
      ]
    : [
        [x + 26, y - 192],
        [x + 62, y - 142],
        [x + 76, y - 112],
      ];
  const handUp: Pt = point ? [x + 102, y - 328] : [x + 78, y - 102];
  const armDown: Pt[] = [
    [x - 26, y - 192],
    [x - 62, y - 142],
    [x - 76, y - 112],
  ];
  const d = (k: number) => at + k * 0.12;
  return (
    <>
      <Fill poly={ellipse(head[0], head[1], hr - 6)} col={C.peach} at={d(3)} dur={0.5} seed={seed + 1} pressure={0.7} gap={15} />
      <Fill poly={hair} col={C.brown} at={d(4)} dur={0.5} seed={seed + 2} angle={-58} gap={15} />
      <Fill poly={dress} col={C.violet} at={d(4)} dur={0.6} seed={seed + 3} angle={-40} />
      <Fill poly={ellipse(x - 38, y - 238, 13)} col={C.pink} at={d(6)} dur={0.3} seed={seed + 4} gap={9} width={8} />
      <Fill poly={ellipse(x + 36, y - 238, 13)} col={C.pink} at={d(6)} dur={0.3} seed={seed + 5} gap={9} width={8} />
      <Line pts={arc(head[0], head[1], hr, hr, 120, 470, 40)} at={d(0)} seed={seed + 6} />
      <Line pts={arc(head[0], head[1] - 4, 76, 74, 168, 372, 24)} at={d(1)} seed={seed + 7} />
      <Line pts={[[x - 74, y - 228], [x - 76, y - 262]]} at={d(1)} seed={seed + 8} width={6} />
      <Line pts={[[x + 74, y - 228], [x + 76, y - 262]]} at={d(1)} seed={seed + 9} width={6} />
      <Dot x={x - 22} y={y - 262} r={7.5} at={d(2)} seed={seed + 10} />
      <Dot x={x + 20} y={y - 262} r={7.5} at={d(2)} seed={seed + 11} />
      <Dot x={x - 20} y={y - 265} r={2.4} col={C.wax} at={d(2.5)} seed={seed + 12} />
      <Dot x={x + 22} y={y - 265} r={2.4} col={C.wax} at={d(2.5)} seed={seed + 13} />
      <Line pts={ellipse(x, y - 228, 8, 9, 14).concat([[x + 8, y - 228]])} at={d(2.6)} seed={seed + 14} width={5} dur={0.3} />
      <Line pts={[...dress, dress[0]]} at={d(1.5)} seed={seed + 15} />
      <Line pts={armUp} at={d(2)} seed={seed + 16} smooth />
      <Line pts={armDown} at={d(2.2)} seed={seed + 17} smooth />
      <Fill poly={ellipse(handUp[0], handUp[1], 15)} col={C.peach} at={d(3)} dur={0.3} seed={seed + 18} gap={10} width={9} />
      <Line pts={arc(handUp[0], handUp[1], 16, 16, 0, 380, 20)} at={d(2.6)} seed={seed + 19} width={6} />
      <Fill poly={ellipse(x - 78, y - 100, 14)} col={C.peach} at={d(3)} dur={0.3} seed={seed + 20} gap={10} width={9} />
      <Line pts={arc(x - 78, y - 100, 15, 15, 0, 380, 20)} at={d(2.8)} seed={seed + 21} width={6} />
      <Line pts={[[x - 24, y - 84], [x - 26, y - 18]]} at={d(3)} seed={seed + 22} />
      <Line pts={[[x + 24, y - 84], [x + 26, y - 18]]} at={d(3.1)} seed={seed + 23} />
      <Fill poly={ellipse(x - 36, y - 10, 24, 12)} col={C.red} at={d(3.6)} dur={0.3} seed={seed + 24} gap={9} width={9} angle={0} />
      <Fill poly={ellipse(x + 36, y - 10, 24, 12)} col={C.red} at={d(3.6)} dur={0.3} seed={seed + 25} gap={9} width={9} angle={0} />
      <Line pts={arc(x - 36, y - 10, 24, 12, 0, 380, 20)} at={d(3.4)} seed={seed + 26} width={6} />
      <Line pts={arc(x + 36, y - 10, 24, 12, 0, 380, 20)} at={d(3.5)} seed={seed + 27} width={6} />
    </>
  );
};

/** The sun: yellow zig-zag colouring inside an indigo outline, with orange rays. */
export const Sun: React.FC<{ x: number; y: number; r: number; at: number; seed?: number; rays?: number; face?: boolean }> = ({ x, y, r, at, seed = 200, rays = 10, face = false }) => (
  <>
    <Fill poly={ellipse(x, y, r - 4)} col={C.yellow} at={at + 0.3} seed={seed} cross />
    <Line pts={arc(x, y, r, r, -100, 275, 48)} at={at} seed={seed + 1} boil="bg" width={E.outline.building} />
    {Array.from({ length: rays }, (_, i) => {
      const a = (i / rays) * Math.PI * 2 + 0.2;
      const r0 = r + 22;
      const r1 = r + 22 + (i % 2 ? 46 : 70);
      return <Line key={i} pts={[[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]]} col={C.orange} at={at + 0.6 + i * 0.04} seed={seed + 10 + i} width={9} boil="bg" dur={0.3} />;
    })}
    {face ? (
      <>
        <Dot x={x - r * 0.3} y={y - r * 0.1} r={r * 0.07} at={at + 0.9} seed={seed + 40} />
        <Dot x={x + r * 0.3} y={y - r * 0.1} r={r * 0.07} at={at + 0.9} seed={seed + 41} />
        <Line pts={arc(x, y + r * 0.1, r * 0.32, r * 0.24, 20, 160, 12)} at={at + 1.0} seed={seed + 42} width={6} dur={0.3} />
      </>
    ) : null}
  </>
);

/** A cloud outline (bumps along the top, flat-ish belly). */
export const cloudPts = (x: number, y: number, w: number): Pt[] => {
  const h = w * 0.42;
  const bumps = [
    [x - w * 0.36, y, w * 0.16],
    [x - w * 0.14, y - h * 0.32, w * 0.2],
    [x + w * 0.12, y - h * 0.36, w * 0.18],
    [x + w * 0.34, y - h * 0.04, w * 0.15],
  ];
  const out: Pt[] = [[x - w * 0.5, y + h * 0.3]];
  out.push(...arc(bumps[0][0], bumps[0][1], bumps[0][2], bumps[0][2], 160, 300, 10));
  out.push(...arc(bumps[1][0], bumps[1][1], bumps[1][2], bumps[1][2], 200, 330, 10));
  out.push(...arc(bumps[2][0], bumps[2][1], bumps[2][2], bumps[2][2], 210, 340, 10));
  out.push(...arc(bumps[3][0], bumps[3][1], bumps[3][2], bumps[3][2], 230, 400, 10));
  out.push([x + w * 0.5, y + h * 0.3]);
  out.push([x - w * 0.5, y + h * 0.3]);
  return out;
};

/** A molecule with a face (objects with faces get big eyes): two ochre balls, an indigo outline, pink cheeks. */
export const Molecule: React.FC<{ x: number; y: number; r: number; at: number; seed?: number }> = ({ x, y, r, at, seed = 300 }) => {
  const a: Pt = [x - r * 0.62, y + r * 0.05];
  const b: Pt = [x + r * 0.62, y - r * 0.05];
  return (
    <>
      <Fill poly={ellipse(a[0], a[1], r - 4)} col={C.ochre} at={at + 0.4} seed={seed} />
      <Fill poly={ellipse(b[0], b[1], r - 4)} col={C.ochre} at={at + 0.5} seed={seed + 1} angle={-50} />
      <Line pts={arc(a[0], a[1], r, r, 40, 330, 40)} at={at} seed={seed + 2} />
      <Line pts={arc(b[0], b[1], r, r, -150, 215, 44)} at={at + 0.15} seed={seed + 3} />
      <Fill poly={ellipse(b[0] - r * 0.3, b[1] - r * 0.12, r * 0.22)} col={C.wax} at={at + 0.7} seed={seed + 4} gap={8} width={9} pressure={1} />
      <Fill poly={ellipse(b[0] + r * 0.3, b[1] - r * 0.12, r * 0.22)} col={C.wax} at={at + 0.7} seed={seed + 5} gap={8} width={9} pressure={1} />
      <Line pts={arc(b[0] - r * 0.3, b[1] - r * 0.12, r * 0.22, r * 0.22, 0, 380, 18)} at={at + 0.6} seed={seed + 6} width={5} />
      <Line pts={arc(b[0] + r * 0.3, b[1] - r * 0.12, r * 0.22, r * 0.22, 0, 380, 18)} at={at + 0.65} seed={seed + 7} width={5} />
      <Dot x={b[0] - r * 0.26} y={b[1] - r * 0.1} r={r * 0.09} at={at + 0.8} seed={seed + 8} />
      <Dot x={b[0] + r * 0.34} y={b[1] - r * 0.1} r={r * 0.09} at={at + 0.8} seed={seed + 9} />
      <Fill poly={ellipse(b[0] - r * 0.5, b[1] + r * 0.28, r * 0.13)} col={C.pink} at={at + 0.9} seed={seed + 10} gap={8} width={8} />
      <Fill poly={ellipse(b[0] + r * 0.55, b[1] + r * 0.28, r * 0.13)} col={C.pink} at={at + 0.9} seed={seed + 11} gap={8} width={8} />
      <Line pts={ellipse(b[0], b[1] + r * 0.36, r * 0.1, r * 0.13, 12).concat([[b[0] + r * 0.1, b[1] + r * 0.36]])} at={at + 0.95} seed={seed + 12} width={5} dur={0.25} />
    </>
  );
};

/** A wavy crayon arrow (light): a wave along a line, with a two-stroke head. */
export const wavePts = (from: Pt, to: Pt, amp: number, wl: number): Pt[] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const n = Math.max(8, Math.round(L / 6));
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L;
    const fade = Math.min(1, s / 30, (L - s) / 30);
    const o = amp * Math.sin((s / wl) * Math.PI * 2) * fade;
    return [from[0] + ux * s - uy * o, from[1] + uy * s + ux * o] as Pt;
  });
};

export const Arrow: React.FC<{ from: Pt; to: Pt; col: string; at: number; seed: number; amp?: number; wl?: number; width?: number; dur?: number }> = ({ from, to, col, at, seed, amp = 0, wl = 60, width = 9, dur = 0.45 }) => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const hl = Math.min(34, L * 0.3);
  const h1: Pt = [to[0] - ux * hl - uy * hl * 0.62, to[1] - uy * hl + ux * hl * 0.62];
  const h2: Pt = [to[0] - ux * hl + uy * hl * 0.62, to[1] - uy * hl - ux * hl * 0.62];
  return (
    <>
      <Line pts={amp ? wavePts(from, to, amp, wl) : [from, to]} col={col} at={at} seed={seed} width={width} dur={dur} boil="bg" />
      <Line pts={[h1, to, h2]} col={col} at={at + dur * 0.9} seed={seed + 1} width={width} dur={0.2} boil="bg" />
    </>
  );
};

export { HAND, TITLE };
