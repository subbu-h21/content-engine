/**
 * Engraving's pieces: laid paper with a pressed plate mark and a ruled border; a small hatching engine (families of
 * parallel burin lines whose width swells with tone and along each line, cut at constant speed, many at once);
 * tone fields from shape (spheres lit from the upper left, skies darker toward the top); swelling contours and wave
 * lines; magnification roundels on a ruled ground; hairline leaders; roman capitals and italics cut glyph by glyph;
 * script written in one stroke; a hand-laid watercolour wash that blooms from where the brush touched; a deckled
 * subtitle slip. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, ROMAN, SCRIPT } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  script: color(P, "muted"),
  plate: color(P, "faint"),
  blue: color(P, "accent"),
  amber: color(P, "accent2"),
  foxing: color(P, "foxing"),
  slip: color(P, "slip"),
  earth: color(P, "earth"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;
export const HATCH = E.hatch;
const f1 = (n: number) => n.toFixed(1);
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

export const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- the hatching engine ---------- */

/** A point on a burin line: x, y and the line's width there. */
export type HP = [number, number, number];
/** One cut line: its points, its place in the cutting order (0..1) and its length. */
export type Run = { pts: HP[]; order: number; len: number };
export type Tone = (x: number, y: number) => number | null;
export type Box = [number, number, number, number];

const length = (pts: HP[]): number => {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
};

/** The swell law: width × (0.2 + 0.8·sin(πu)^0.7) along the line, so it tapers in and out. */
const swell = (pts: HP[], lo = 0.2): HP[] => pts.map(([x, y, w], i) => [x, y, w * (lo + (1 - lo) * Math.pow(Math.max(0, Math.sin((Math.PI * i) / Math.max(1, pts.length - 1))), 0.7))]);

export const mkRun = (pts: HP[], order = 0, lo = 0.2): Run => {
  const s = swell(pts, lo);
  return { pts: s, order, len: Math.max(1, length(s)) };
};

/** A filled ribbon along the points (their widths), up to fraction p of its length. */
const ribbon = (pts: HP[], p: number): string => {
  const n = pts.length;
  const m = Math.max(2, Math.min(n, Math.ceil(n * p)));
  const l: string[] = [];
  const r: string[] = [];
  for (let i = 0; i < m; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const k = Math.hypot(dx, dy) || 1;
    const h = pts[i][2] / 2;
    l.push(`${f1(pts[i][0] - (dy / k) * h)} ${f1(pts[i][1] + (dx / k) * h)}`);
    r.push(`${f1(pts[i][0] + (dy / k) * h)} ${f1(pts[i][1] - (dx / k) * h)}`);
  }
  return `M${l.join("L")}L${r.reverse().join("L")}Z`;
};

/**
 * A family of parallel hatch lines at `angle` over `box`: where the tone passes `thr` a line is cut, its width
 * growing with tone from wMin to wMax; the swell law shapes each run. Runs are ordered across the form.
 */
export const field = (o: { box: Box; angle: number; spacing: number; tone: Tone; thr: number; wMin?: number; wMax?: number; step?: number; phase?: number }): Run[] => {
  const { box, angle, spacing, tone, thr } = o;
  const wMin = o.wMin ?? HATCH.wMin;
  const wMax = o.wMax ?? HATCH.wMax;
  const step = o.step ?? HATCH.step;
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const [x0, y0, x1, y1] = box;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rad = Math.hypot(x1 - x0, y1 - y0) / 2;
  const n = Math.ceil((2 * rad) / spacing);
  const runs: Run[] = [];
  for (let i = 0; i <= n; i++) {
    const v = -rad + i * spacing + (o.phase ?? 0);
    let cur: HP[] = [];
    const flush = () => {
      if (cur.length > 3) runs.push(mkRun(cur, i / n));
      cur = [];
    };
    for (let u = -rad; u <= rad; u += step) {
      const x = cx + u * dx - v * dy;
      const y = cy + u * dy + v * dx;
      const tn = x < x0 || x > x1 || y < y0 || y > y1 ? null : tone(x, y);
      if (tn !== null && tn > thr) cur.push([x, y, wMin + (wMax - wMin) * Math.pow(clamp((tn - thr) / (1 - thr)), 0.8)]);
      else flush();
    }
    flush();
  }
  return runs;
};

/** Tone on a sphere lit by the film's one light (upper left): 0 lit, 1 dark. `excl` circles occlude it. */
export const sphereTone = (cx: number, cy: number, r: number, excl: [number, number, number][] = []): Tone => {
  const [lx, ly, lz] = E.light;
  const k = Math.hypot(lx, ly, lz);
  return (x, y) => {
    for (const [ex, ey, er] of excl) if (Math.hypot(x - ex, y - ey) < er + 3) return null;
    const nx = (x - cx) / r;
    const ny = (y - cy) / r;
    const d2 = nx * nx + ny * ny;
    if (d2 >= 0.985) return null;
    const nz = Math.sqrt(1 - d2);
    const lam = Math.max(0, (nx * lx + ny * ly + nz * lz) / k);
    const rim = 0.18 * Math.pow(Math.max(0, -(nx * lx + ny * ly) / Math.hypot(lx, ly)) * Math.sqrt(d2), 3);
    return clamp(1 - lam - rim);
  };
};

/** The three families on a tone field: first hatching, crossing, and the third (lozenge) family for the darks. */
export const shade = (box: Box, tone: Tone, angle = -35, scale = 1): Run[][] => {
  const [t1, t2, t3] = HATCH.thresholds;
  const s = HATCH.spacing * scale;
  return [
    field({ box, angle, spacing: s, tone, thr: t1 }),
    field({ box, angle: angle + 70, spacing: s * HATCH.cross, tone, thr: t2, wMax: HATCH.wMax * HATCH.crossW }),
    field({ box, angle: angle + 35, spacing: s * HATCH.third, tone, thr: t3, wMax: HATCH.wMax * HATCH.thirdW }),
  ];
};

/** A circle's contour cut in three runs that pinch where they hand over, heavier on the side away from the light. */
export const contour = (cx: number, cy: number, r: number, from = 0, to = Math.PI * 2, excl: [number, number, number][] = []): Run[] => {
  const [lx, ly] = E.light;
  const lk = Math.hypot(lx, ly);
  const runs: Run[] = [];
  const nRuns = E.outline.runs;
  const span = (to - from) / nRuns;
  for (let k = 0; k < nRuns; k++) {
    const pts: HP[] = [];
    const a0 = from + k * span - 0.06;
    const a1 = from + (k + 1) * span + 0.06;
    for (let a = a0; a <= a1; a += 0.03) {
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (excl.some(([ex, ey, er]) => Math.hypot(x - ex, y - ey) < er)) {
        if (pts.length > 3) runs.push(mkRun(pts.splice(0), k / nRuns, 0.35));
        pts.length = 0;
        continue;
      }
      const away = clamp(0.5 - 0.5 * ((Math.cos(a) * lx + Math.sin(a) * ly) / lk));
      const [s0, s1] = E.outline.swell;
      pts.push([x, y, E.outline.w * (s0 + (s1 - s0) * away)]);
    }
    if (pts.length > 3) runs.push(mkRun(pts, k / nRuns, 0.35));
  }
  return runs;
};

/** A swelling wave line from x0 to x1 around y (wavelength `lambda`, amplitude `amp`). */
export const wave = (x0: number, x1: number, y: number, amp: number, lambda: number, w = 2.2, order = 0, angle = 0): Run => {
  const pts: HP[] = [];
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  for (let x = 0; x <= x1 - x0; x += 3) {
    const yy = amp * Math.sin((2 * Math.PI * x) / lambda);
    pts.push([x0 + x * ca - yy * sa, y + x * sa + yy * ca, w * (0.75 + 0.25 * Math.cos((2 * Math.PI * x) / lambda))]);
  }
  return mkRun(pts, order);
};

/** A straight swelling line. */
export const line = (a: [number, number], b: [number, number], w = 2.2, order = 0): Run => {
  const n = Math.max(4, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
  const pts: HP[] = Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, w]);
  return mkRun(pts, order);
};

/**
 * Cut runs: each line is cut at the burin's constant speed, starting at its place in the order × `sweep` after `at`.
 * All runs go into one path.
 */
export const Cut: React.FC<{ runs: Run[]; at: number; sweep?: number; speed?: number; col?: string }> = ({ runs, at, sweep = (R.sweep as { duration: number }).duration, speed = HATCH.speed, col = C.ink }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  let d = "";
  for (const r of runs) {
    const lt = t - r.order * sweep;
    if (lt <= 0) continue;
    d += ribbon(r.pts, Math.min(1, (lt * speed) / r.len));
  }
  return d ? <path d={d} fill={col} /> : null;
};

/* ---------- the sheet ---------- */

/** Laid paper: laid lines, chain lines, fibres, foxing; then the pressed plate mark with its bevel and the ruled border. */
const Paper: React.FC = React.memo(() => {
  const [px0, py0, px1, py1] = L.plate as [number, number, number, number];
  const [bx0, by0, bx1, by1] = L.border as [number, number, number, number];
  const fox = useMemo(
    () =>
      Array.from({ length: E.paper.foxing }, (_, i) => ({
        x: rand(i * 5 + 1) * W,
        y: rand(i * 5 + 2) * H,
        r: 1.5 + Math.pow(rand(i * 5 + 3), 3) * 7,
        a: 0.12 + rand(i * 5 + 4) * 0.25,
      })),
    [],
  );
  const bev = 5;
  const ins = L.borderInset;
  return (
    <svg width={W} height={H} style={abs}>
      <defs>
        <pattern id="en-laid" width={W} height={E.paper.laid} patternUnits="userSpaceOnUse">
          <rect width={W} height={0.8} fill="#6b5838" opacity={0.07} />
        </pattern>
        <filter id="en-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.04" numOctaves={3} seed={6} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  1.8 0 0 0 -0.85" />
        </filter>
        <filter id="en-fox" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
      </defs>
      <rect width={W} height={H} fill={C.paper} />
      <rect width={W} height={H} fill="url(#en-laid)" />
      {Array.from({ length: Math.ceil(W / E.paper.chain) }, (_, i) => (
        <rect key={i} x={30 + i * E.paper.chain} y={0} width={1.4} height={H} fill="#6b5838" opacity={0.05} />
      ))}
      <rect width={W} height={H} filter="url(#en-fibre)" opacity={0.25} />
      <g filter="url(#en-fox)">
        {fox.map((f, i) => (
          <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={C.foxing} opacity={f.a} />
        ))}
      </g>
      {/* the plate mark: plate tone inside, the bevel dark on the top and left walls, light on the bottom and right */}
      <rect x={px0} y={py0} width={px1 - px0} height={py1 - py0} fill={C.plate} opacity={0.55} />
      <path d={`M ${px0} ${py0} H ${px1} L ${px1 - bev} ${py0 + bev} H ${px0 + bev} V ${py1 - bev} L ${px0} ${py1} Z`} fill="#5a4630" opacity={0.28} />
      <path d={`M ${px1} ${py1} H ${px0} L ${px0 + bev} ${py1 - bev} H ${px1 - bev} V ${py0 + bev} L ${px1} ${py0} Z`} fill="#ffffff" opacity={0.5} />
      {/* the ruled border: a 2.4 px rule and a 0.8 px hairline 9 px inside */}
      <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill="none" stroke={C.ink} strokeWidth={E.rule.outer} />
      <rect x={bx0 + ins} y={by0 + ins} width={bx1 - bx0 - 2 * ins} height={by1 - by0 - 2 * ins} fill="none" stroke={C.ink} strokeWidth={E.rule.inner} />
    </svg>
  );
});

/** The plate: paper, plate mark, border; the scene's SVG lines in `children`, HTML lettering in `over`. Waits for fonts. */
export const Plate: React.FC<{ children: React.ReactNode; over?: React.ReactNode }> = ({ children, over }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Paper />
      <svg width={W} height={H} style={abs}>
        {children}
      </svg>
      {over}
    </AbsoluteFill>
  );
};

/* ---------- colour ---------- */

/**
 * A hand-laid wash: transparent pigment multiplied under the ink, spilling 3.5 px past its region, misregistered
 * 2/1.5 px, with a tide-line at the wet edge; it blooms from `from` with a ragged front over `dur` seconds.
 */
export const Wash: React.FC<{ d: string; col: string; alpha?: number; from: [number, number]; at: number; dur?: number; reach?: number; id: string }> = ({
  d,
  col,
  alpha = E.wash.alpha,
  from,
  at,
  dur = R.bloom.duration,
  reach = 900,
  id,
}) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = run({ ...(R.bloom as unknown as Recipe), duration: dur } as Recipe, t);
  const [mx, my] = E.wash.misregister;
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <defs>
        <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feMorphology in="d" operator="erode" radius={3} result="e" />
          <feComposite in="d" in2="e" operator="out" result="rim" />
          <feGaussianBlur in="rim" stdDeviation={0.8} result="rimb" />
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={2} seed={12} result="lift" />
          <feColorMatrix in="lift" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${E.wash.lift} 0 0 0 ${1 - E.wash.lift * 0.5}`} result="lm" />
          <feMerge result="m">
            <feMergeNode in="d" />
            <feMergeNode in="rimb" />
          </feMerge>
          <feComposite in="m" in2="lm" operator="arithmetic" k1={1} k2={0} k3={0} k4={0} />
        </filter>
        <filter id={`${id}-front`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={60} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <circle cx={from[0]} cy={from[1]} r={Math.max(1, reach * p)} fill="#fff" filter={`url(#${id}-front)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`} transform={`translate(${mx} ${my})`}>
        <path d={d} fill={col} fillOpacity={alpha} stroke={col} strokeOpacity={alpha * 0.8} strokeWidth={E.wash.spill * 2} strokeLinejoin="round" filter={`url(#${id}-f)`} />
      </g>
    </g>
  );
};

/* ---------- roundels and leaders ---------- */

/**
 * A magnification roundel: a double rule (2 px and 0.75 px, 4 px inside), a ruled ground of horizontal lines, and its
 * subject in `children` (drawn in frame coordinates) with a paper halo. It flies in on an eased arc with a small lift.
 */
export const Roundel: React.FC<{ cx: number; cy: number; r?: number; at: number; from?: [number, number]; children: React.ReactNode; id: string }> = ({
  cx,
  cy,
  r = E.roundel.r,
  at,
  from,
  children,
  id,
}) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("fly", t);
  const [fx, fy] = from ?? [cx, cy];
  const x = fx + (cx - fx) * p;
  const y = fy + (cy - fy) * p - Math.sin(Math.PI * p) * R.fly.lift;
  const s = Math.exp(Math.log(0.15) * (1 - p));
  const g = (E.roundel.ground * r) / 120 / 2;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`}>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r - E.roundel.gap - 1} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={C.paper} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil((2 * r) / g) }, (_, i) => (
          <rect key={i} x={cx - r} y={cy - r + i * g} width={2 * r} height={0.7} fill={C.ink} opacity={0.75} />
        ))}
        {children}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.ink} strokeWidth={E.roundel.rule[0]} />
      <circle cx={cx} cy={cy} r={r - E.roundel.gap} fill="none" stroke={C.ink} strokeWidth={E.roundel.rule[1]} />
    </g>
  );
};

/** A paper-coloured halo behind a subject inside a roundel (the source's white halo round the subject). */
export const Halo: React.FC<{ d: string; w?: number }> = ({ d, w = E.roundel.halo }) => <path d={d} fill={C.paper} stroke={C.paper} strokeWidth={w * 2} strokeLinejoin="round" />;

/** A hairline leader from a dot on the part to a point (a roundel's rim or a label), cut after `at`. */
export const Leader: React.FC<{ from: [number, number]; to: [number, number]; at: number; via?: [number, number] }> = ({ from, to, at, via }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("cut", t * 2.5);
  const pts = via ? [from, via, to] : [from, to];
  const segs: [number, number][] = [];
  const total = pts.slice(1).reduce((n, q, i) => n + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  let left = total * p;
  segs.push(pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.min(1, left / l);
    segs.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
    left -= l;
  }
  return (
    <g>
      <circle cx={from[0]} cy={from[1]} r={E.leader.dot} fill={C.ink} />
      <path d={`M ${segs.map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L ")}`} fill="none" stroke={C.ink} strokeWidth={E.leader.w} />
    </g>
  );
};

/* ---------- lettering ---------- */

/** Letters cut glyph by glyph (no fades): roman capitals with wide tracking, or italic. */
export const Letters: React.FC<{
  text: string;
  y: number;
  at: number;
  size?: number;
  italic?: boolean;
  caps?: boolean;
  tracking?: number;
  x?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  col?: string;
  numerals?: boolean;
}> = ({ text, y, at, size = T.display, italic = false, caps = true, tracking = caps ? T.titleTracking : 0, x = M, align = "center", weight = 400, col = C.ink }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const chars = Array.from(caps ? text.toUpperCase() : text);
  // 0.045 s a glyph, but a line is cut within `R.letter.line` seconds however long it is
  const step = Math.min((R.letter as { duration: number }).duration, R.letter.line / chars.length);
  const shown = Math.floor(t / step);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? 0 : undefined,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: ROMAN,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${tracking}em`,
        color: col,
        whiteSpace: "nowrap",
        fontVariantNumeric: "lining-nums",
      }}
    >
      {chars.map((ch, i) => (
        <span key={i} style={{ opacity: i <= shown ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

/** Script written in one left-to-right stroke (a hard-edged reveal, no fade). */
export const Script: React.FC<{ text: string; y: number; at: number; size?: number; x?: number; align?: "left" | "center" | "right"; col?: string }> = ({
  text,
  y,
  at,
  size = T.script,
  x = M,
  align = "center",
  col = C.script,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = run({ ...(R.write as unknown as Recipe), duration: Math.max(0.4, text.length * 0.05) } as Recipe, t);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? 0 : undefined,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y - size * 0.85,
        textAlign: align,
        fontFamily: SCRIPT,
        fontSize: size,
        lineHeight: 1.3,
        color: col,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "inline-block", padding: "0 0.4em", margin: "0 -0.4em", clipPath: p >= 1 ? undefined : `inset(-20% ${(1 - p) * 100}% -20% 0)` }}>{text}</span>
    </div>
  );
};

/** The subtitle on a deckled paper slip (Pinyon Script, bottom centre, at most two lines): on at once, no fade. */
export const Slip: React.FC<{ text: string; at: number; y?: number }> = ({ text, at, y = 1560 }) => {
  const t = useSeconds() - at;
  const deckle = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) pts.push(`${(i * 2.5).toFixed(1)}% ${(rand(i + 3) * 4).toFixed(1)}%`);
    for (let i = 0; i <= 12; i++) pts.push(`${(100 - rand(i + 60) * 1.2).toFixed(1)}% ${((i * 100) / 12).toFixed(1)}%`);
    for (let i = 40; i >= 0; i--) pts.push(`${(i * 2.5).toFixed(1)}% ${(100 - rand(i + 90) * 4).toFixed(1)}%`);
    for (let i = 12; i >= 0; i--) pts.push(`${(rand(i + 130) * 1.2).toFixed(1)}% ${((i * 100) / 12).toFixed(1)}%`);
    return `polygon(${pts.join(", ")})`;
  }, []);
  if (t < 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-100%)", filter: "drop-shadow(0 3px 6px rgba(60,40,20,0.25))" }}>
      <div style={{ maxWidth: 860, padding: "10px 44px 14px", backgroundColor: C.slip, clipPath: deckle, fontFamily: SCRIPT, fontSize: T.subtitle, lineHeight: 1.25, color: C.script, textAlign: "center" }}>{text}</div>
    </div>
  );
};
