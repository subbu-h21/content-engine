/**
 * Watercolor Wash's pieces: the fibrous paper, translucent washes (three jittered passes with a pooled rim and
 * granulation, revealed by a brush-edge wipe), dry-brush strokes (a rough ribbon plus bristle tracks that break into
 * flying white), the vermilion seal sun, hand-written notes on pen leaders, mono labels and Cormorant titles.
 * Everything is seeded, so every frame renders the same. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, HAND, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  ink2: color(P, "muted"),
  faint: color(P, "faint"),
  sun: color(P, "accent"),
  rain: color(P, "accent2"),
  sunBar: color(P, "sunBar"),
  sky: color(P, "sky"),
  deep: color(P, "deep"),
  warm: color(P, "warm"),
  ochre: color(P, "ochre"),
  rust: color(P, "rust"),
  green: color(P, "green"),
  violet: color(P, "violet"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** A recipe's curve over another duration (strokes and notes take as long as they are long). */
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration: number): number => run({ ...(R[name] as Recipe), duration } as Recipe, t);
const T = style.type;
const E = style.elements;
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

export type Pt = [number, number];

export const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Smooth 1D value noise in 0..1. */
const vnoise = (x: number, seed: number): number => {
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  return rand(i + seed * 1013) * (1 - s) + rand(i + 1 + seed * 1013) * s;
};
const f1 = (n: number) => n.toFixed(1);

/** Catmull-Rom through control points, sampled every `step` px. */
export const spline = (ctrl: Pt[], step = 5): Pt[] => {
  const n = ctrl.length;
  if (n < 2) return ctrl;
  const out: Pt[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(n - 1, i + 2)];
    const k = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(ctrl[n - 1]);
  return out;
};

/** A ragged closed blob around an ellipse (for washes): radial noise, seeded. */
export const blob = (cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.08, n = 48): string => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + wobble * (vnoise(i * 0.35, seed) * 2 - 1);
    pts.push(`${f1(cx + Math.cos(a) * rx * k)} ${f1(cy + Math.sin(a) * ry * k)}`);
  }
  return `M ${pts.join(" L ")} Z`;
};

/** A ragged band: a rectangle whose edges wander (for skies, hills, swatches). `topAmp`/`botAmp` in px. */
export const band = (x0: number, y0: number, x1: number, y1: number, seed: number, topAmp = 14, botAmp = 14, sideAmp = 8): string => {
  const pts: Pt[] = [];
  const step = 24;
  for (let x = x0; x <= x1; x += step) pts.push([x, y0 + topAmp * (vnoise(x / 90, seed) * 2 - 1)]);
  for (let y = y0; y <= y1; y += step) pts.push([x1 + sideAmp * (vnoise(y / 70, seed + 3) * 2 - 1), y]);
  for (let x = x1; x >= x0; x -= step) pts.push([x, y1 + botAmp * (vnoise(x / 80, seed + 5) * 2 - 1)]);
  for (let y = y1; y >= y0; y -= step) pts.push([x0 + sideAmp * (vnoise(y / 75, seed + 7) * 2 - 1), y]);
  return `M ${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(" L ")} Z`;
};

/** A hill: a ragged ridge from x0 to x1 around `y`, filled down to `bottom`. */
export const hill = (x0: number, x1: number, y: number, rise: number, bottom: number, seed: number): string => {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 20) {
    const u = (x - x0) / (x1 - x0);
    pts.push([x, y - rise * Math.sin(Math.PI * u) - 18 * (vnoise(x / 60, seed) * 2 - 1)]);
  }
  return `M ${f1(x0)} ${f1(bottom)} L ${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(" L ")} L ${f1(x1)} ${f1(bottom)} Z`;
};

/** The paper: base, a three-octave cloud (±3.5%), 2,600 short curved fibres (±3.5%), and a fine tooth. */
const Paper: React.FC = React.memo(() => {
  const fibres = useMemo(() => {
    let light = "";
    let dark = "";
    for (let i = 0; i < E.paper.fibres; i++) {
      const x = rand(i * 4 + 1) * W;
      const y = rand(i * 4 + 2) * H;
      const a = rand(i * 4 + 3) * Math.PI;
      const len = 6 + rand(i * 4 + 4) * 18;
      const bend = (rand(i + 9000) - 0.5) * 7;
      const x1 = x + Math.cos(a) * len;
      const y1 = y + Math.sin(a) * len;
      const seg = `M${f1(x)} ${f1(y)}Q${f1((x + x1) / 2 - Math.sin(a) * bend)} ${f1((y + y1) / 2 + Math.cos(a) * bend)} ${f1(x1)} ${f1(y1)}`;
      if (i % 2) light += seg;
      else dark += seg;
    }
    return { light, dark };
  }, []);
  const n = E.paper.noise;
  return (
    <svg width={W} height={H} style={abs}>
      <defs>
        <filter id="wc-cloud" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032" numOctaves={3} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.11  2.6 0 0 0 -1.2" />
        </filter>
        <filter id="wc-cloud-light" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032" numOctaves={3} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.99  0 0 0 0 0.96  -2.6 0 0 0 1.4" />
        </filter>
        <filter id="wc-tooth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={2} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.14  1.8 0 0 0 -0.8" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={C.paper} />
      <rect width={W} height={H} filter="url(#wc-cloud)" opacity={n * 3.2} />
      <rect width={W} height={H} filter="url(#wc-cloud-light)" opacity={n * 4} />
      <path d={fibres.dark} fill="none" stroke="#4a3a28" strokeOpacity={E.paper.fibreDelta * 2.6} strokeWidth={0.9} strokeLinecap="round" />
      <path d={fibres.light} fill="none" stroke="#fffaf0" strokeOpacity={E.paper.fibreDelta * 12} strokeWidth={1.1} strokeLinecap="round" />
      <rect width={W} height={H} filter="url(#wc-tooth)" opacity={E.paper.tooth} />
    </svg>
  );
});

/**
 * Filters shared by every wash and stroke. A wash pass: smooth edge noise, a cloudy density lift (blooms), a pooled rim
 * and granulation. The rough filter gives brush strokes a slightly broken edge.
 */
const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {[0, 1, 2].map((k) => (
        <filter key={k} id={`wc-wash-${k}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={0.011 + k * 0.004} numOctaves={2} seed={11 + k * 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={E.wash.edgeNoise} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feMorphology in="d" operator="erode" radius={E.wash.rim} result="e" />
          <feComposite in="d" in2="e" operator="out" result="rim" />
          <feGaussianBlur in="rim" stdDeviation={1.6} result="rimb" />
          <feComponentTransfer in="rimb" result="rimk">
            <feFuncA type="linear" slope={1.7} />
          </feComponentTransfer>
          <feMerge result="m">
            <feMergeNode in="d" />
            <feMergeNode in="rimk" />
          </feMerge>
          <feTurbulence type="fractalNoise" baseFrequency={0.0045 + k * 0.0015} numOctaves={2} seed={31 + k} result="lift" />
          <feColorMatrix in="lift" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.3 0 0 0 0.05" result="liftm" />
          <feComposite in="m" in2="liftm" operator="arithmetic" k1={1} k2={0} k3={0} k4={0} result="ml" />
          <feTurbulence type="fractalNoise" baseFrequency={0.5 + k * 0.1} numOctaves={2} seed={4 + k} result="g" />
          <feColorMatrix in="g" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${-E.wash.granulation * 4} ${1 + E.wash.granulation * 1.6}`} result="gm" />
          <feComposite in="ml" in2="gm" operator="arithmetic" k1={1} k2={0} k3={0} k4={0} />
        </filter>
      ))}
      <filter id="wc-rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={21} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/** The page: paper, shared filters, the scene, then the finish. Waits for the fonts. */
export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Paper />
      <Defs />
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A brush-edge wipe: everything above a wavy front that travels down (or right) by `p`. */
const wipe = (box: [number, number, number, number], p: number, dir: "down" | "right" | "up", seed: number): string => {
  const [x0, y0, x1, y1] = box;
  const amp = 30;
  const pts: string[] = [];
  if (dir === "right") {
    const edge = x0 - amp + (x1 - x0 + 2 * amp) * p;
    for (let y = y0 - 60; y <= y1 + 60; y += 20) pts.push(`${f1(edge + amp * 0.6 * Math.sin(y / 70 + seed) + amp * 0.5 * (vnoise(y / 40, seed) * 2 - 1))} ${f1(y)}`);
    return `M ${x0 - 200} ${y0 - 60} L ${pts.join(" L ")} L ${x0 - 200} ${y1 + 60} Z`;
  }
  const edge = dir === "down" ? y0 - amp + (y1 - y0 + 2 * amp) * p : y1 + amp - (y1 - y0 + 2 * amp) * p;
  for (let x = x0 - 60; x <= x1 + 60; x += 20) pts.push(`${f1(x)} ${f1(edge + amp * 0.6 * Math.sin(x / 70 + seed) + amp * 0.5 * (vnoise(x / 40, seed) * 2 - 1))}`);
  const far = dir === "down" ? y0 - 200 : y1 + 200;
  return `M ${x0 - 60} ${far} L ${pts.join(" L ")} L ${x1 + 60} ${far} Z`;
};

/**
 * A wash: the same shape laid in three passes with jittered positions at alpha/3 × 1.6 each, so it darkens where the
 * passes agree and pools at the rim. It arrives by a brush-edge wipe over `dur` seconds from `at`.
 */
export const Wash: React.FC<{
  d: string;
  col: string;
  alpha: number;
  at: number;
  seed: number;
  box: [number, number, number, number];
  dir?: "down" | "right" | "up";
  dur?: number;
  /** fade the last part of the box (0..1 of its height) like a wet edge running out */
  soft?: number;
}> = ({ d, col, alpha, at, seed, box, dir = "down", dur = style.motion.recipes.wipe.duration, soft = 0 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = easeFor("wipe", t, dur);
  const id = `wc-clip-${seed}`;
  const per = (alpha / E.wash.passes) * E.wash.passGain;
  const [x0, y0, x1, y1] = box;
  return (
    <svg width={W} height={H} style={abs}>
      <defs>
        <clipPath id={id}>
          <path d={p >= 1 ? `M -400 -400 H ${W + 400} V ${H + 400} H -400 Z` : wipe(box, p, dir, seed)} />
        </clipPath>
        {soft > 0 ? (
          <>
            <linearGradient id={`${id}-g`} x1="0" y1={y0} x2="0" y2={y1} gradientUnits="userSpaceOnUse">
              <stop offset={0} stopColor="#fff" />
              <stop offset={1 - soft} stopColor="#fff" />
              <stop offset={1} stopColor="#000" />
            </linearGradient>
            <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={x0 - 100} y={y0 - 100} width={x1 - x0 + 200} height={y1 - y0 + 200}>
              <rect x={x0 - 100} y={y0 - 100} width={x1 - x0 + 200} height={y1 - y0 + 100} fill={`url(#${id}-g)`} />
            </mask>
          </>
        ) : null}
      </defs>
      <g clipPath={`url(#${id})`} mask={soft > 0 ? `url(#${id}-m)` : undefined}>
        {Array.from({ length: E.wash.passes }, (_, k) => {
          const jx = (rand(seed * 17 + k) - 0.5) * 2 * E.wash.jitter;
          const jy = (rand(seed * 23 + k) - 0.5) * 2 * E.wash.jitter;
          return <path key={k} d={d} transform={`translate(${f1(jx)} ${f1(jy)})`} fill={col} fillOpacity={per} filter={`url(#wc-wash-${k % 3})`} />;
        })}
      </g>
    </svg>
  );
};

const profile = (u: number, kind: "brush" | "even" | "tip"): number => {
  const x = clamp(u);
  if (kind === "even") return Math.min(1, 0.35 + Math.min(x, 1 - x) * 8);
  if (kind === "tip") return Math.pow(Math.sin(Math.PI * clamp(0.02 + x * 0.98)), 0.35) * (1.15 - 0.5 * x);
  return Math.pow(Math.sin(Math.PI * clamp(0.04 + x * 0.92)), 0.45);
};

/**
 * A dry-brush stroke: a rough ribbon (±22% width noise) filled at opacity × rib, with 3–9 bristle tracks. Each track
 * leaves a slightly darker streak at 30–85% and, from an early point on, breaks into seeded dash runs (18–90 px) where
 * the paper shows through, and stops early: the flying white. It paints along its length over `dur` s from `at`.
 */
export const Stroke: React.FC<{
  pts: Pt[];
  w: number;
  col: string;
  at: number;
  seed: number;
  dur?: number;
  opacity?: number;
  bristles?: boolean;
  kind?: "brush" | "even" | "tip";
  clip?: string;
}> = ({ pts, w, col, at, seed, dur = 0.9, opacity = E.stroke.opacity, bristles = w >= 6, kind = "brush", clip }) => {
  const t = useSeconds() - at;
  const g = useMemo(() => {
    const line = spline(pts, 5);
    const n = line.length;
    const cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
    const L = cum[n - 1] || 1;
    const nor = line.map((_, i) => {
      const a = line[Math.max(0, i - 1)];
      const b = line[Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      return [-dy / l, dx / l] as Pt;
    });
    const half = line.map((_, i) => 0.5 * w * profile(cum[i] / L, kind) * (1 + E.stroke.roughness * (vnoise(cum[i] / 38, seed) * 2 - 1)));
    const nb = clamp(Math.round(w / E.stroke.bristleEvery), E.stroke.bristleMin, E.stroke.bristleMax);
    const tracks = Array.from({ length: nb }, (_, k) => {
      const o = -1 + (2 * k + 1) / nb + (rand(seed * 41 + k) - 0.5) * (0.6 / nb);
      const end = 0.7 + 0.3 * rand(seed * 31 + k);
      const dry = 0.35 + 0.5 * rand(seed * 37 + k);
      const dash: number[] = [];
      for (let j = 0; j < 16; j++) dash.push(E.stroke.dash[0] + rand(seed * 7 + k * 19 + j) * (E.stroke.dash[1] - E.stroke.dash[0]), 6 + rand(seed * 11 + k * 23 + j) * (w / 2));
      const alpha = E.stroke.bristleAlpha[0] + rand(seed * 13 + k) * (E.stroke.bristleAlpha[1] - E.stroke.bristleAlpha[0]);
      return { o, end, dry, dash: dash.map((x) => x.toFixed(1)).join(" "), alpha };
    });
    return { line, cum, L, nor, half, tracks, nb };
  }, [pts, w, seed, kind]);
  if (t <= 0) return null;
  const p = easeFor("paint", t, dur);
  const upto = p * g.L;
  const idx = g.cum.findIndex((c) => c > upto);
  const last = idx < 0 ? g.line.length : Math.max(2, idx);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i < last; i++) {
    const [x, y] = g.line[i];
    const [nx, ny] = g.nor[i];
    const h = g.half[i];
    left.push(`${f1(x + nx * h)} ${f1(y + ny * h)}`);
    right.push(`${f1(x - nx * h)} ${f1(y - ny * h)}`);
  }
  const body = `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;
  const rib = bristles ? E.stroke.rib : E.stroke.ribBare;
  const track = (o: number, from: number, to: number) =>
    g.line
      .slice(from, to)
      .map(([x, y], j) => {
        const i = from + j;
        return `${j ? "L" : "M"}${f1(x + g.nor[i][0] * g.half[i] * o * 0.95)} ${f1(y + g.nor[i][1] * g.half[i] * o * 0.95)}`;
      })
      .join(" ");
  const mid = `wc-dry-${seed}`;
  const tw = (w / g.nb) * 0.75;
  return (
    <svg width={W} height={H} style={abs}>
      {bristles ? (
        <defs>
          <mask id={mid} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            {g.tracks.map((tr, k) => {
              const n = g.line.length;
              const dryFrom = Math.round(n * tr.dry);
              const stop = Math.round(n * tr.end);
              return (
                <React.Fragment key={k}>
                  {dryFrom < stop ? <path d={track(tr.o, dryFrom, stop)} fill="none" stroke="#000" strokeWidth={tw * 0.5} strokeLinecap="round" strokeDasharray={tr.dash} /> : null}
                  {stop < n - 1 ? <path d={track(tr.o, Math.max(0, stop - 1), n)} fill="none" stroke="#000" strokeWidth={tw * 1.25} /> : null}
                </React.Fragment>
              );
            })}
          </mask>
        </defs>
      ) : null}
      <g clipPath={clip}>
        <g opacity={opacity} filter="url(#wc-rough)" mask={bristles ? `url(#${mid})` : undefined}>
          <path d={body} fill={col} fillOpacity={rib} />
          {bristles
            ? g.tracks.map((tr, k) => {
                const stop = Math.min(last, Math.round(g.line.length * tr.end));
                if (stop < 2) return null;
                return <path key={k} d={track(tr.o, 0, stop)} fill="none" stroke={col} strokeOpacity={tr.alpha * 0.45} strokeWidth={tw * 0.6} />;
              })
            : null}
        </g>
      </g>
    </svg>
  );
};

/** The vermilion seal sun: the disc is laid by a growing round wipe, then seven dry-brush bars cross it (1.6 s). */
export const SealSun: React.FC<{ cx: number; cy: number; r: number; at: number; seed?: number }> = ({ cx, cy, r, at, seed = 5 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const dur = (R.seal as { duration: number }).duration;
  const disc = easeFor("seal", t, dur * 0.4);
  const id = `wc-seal-${seed}`;
  const bars = E.seal.bars;
  return (
    <>
      <svg width={W} height={H} style={abs}>
        <defs>
          <clipPath id={id}>
            <circle cx={cx} cy={cy} r={r * 0.96} />
          </clipPath>
        </defs>
        <g filter="url(#wc-wash-1)">
          <circle cx={cx} cy={cy} r={r * Math.max(0.01, disc)} fill={C.sun} fillOpacity={0.82} />
        </g>
      </svg>
      {Array.from({ length: bars }, (_, i) => {
        const y = cy - r * 0.72 + (i * r * 1.44) / (bars - 1);
        const half = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy))) * 0.95;
        return (
          <Stroke
            key={i}
            pts={[
              [cx - half, y + (rand(seed + i) - 0.5) * 4],
              [cx + half, y + (rand(seed + i + 9) - 0.5) * 4],
            ]}
            w={E.seal.barWidth}
            col={C.sunBar}
            at={at + dur * 0.4 + (i * dur * 0.5) / bars}
            dur={0.25}
            seed={seed * 10 + i}
            opacity={0.55}
            kind="even"
            clip={`url(#${id})`}
          />
        );
      })}
    </>
  );
};

/** A mono label: spaced caps, ink 2. */
export const Label: React.FC<{ text: string; x?: number; y: number; at?: number; align?: "left" | "center" | "right"; col?: string }> = ({ text, x = M, y, at = 0, align = "left", col = C.ink2 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = easeFor("write", t, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? 0 : undefined,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y - T.label * 0.8,
        textAlign: align,
        fontFamily: MONO,
        fontSize: T.label,
        letterSpacing: T.labelTracking,
        color: col,
        whiteSpace: "nowrap",
        WebkitMaskImage: p >= 1 ? undefined : `linear-gradient(90deg, #000 ${p * 110 - 10}%, transparent ${p * 110}%)`,
        maskImage: p >= 1 ? undefined : `linear-gradient(90deg, #000 ${p * 110 - 10}%, transparent ${p * 110}%)`,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};

/** Cormorant lines, *italic* emphasis in the same ink; each line is laid in left to right under a soft brush edge. */
export const Title: React.FC<{ lines: string[]; size: number; y: number; at?: number; align?: "left" | "center"; weight?: number; col?: string; x?: number; joined?: boolean }> = ({
  lines,
  size,
  y,
  at = 0,
  align = "left",
  weight = 500,
  col = C.ink,
  x = M,
  joined = false,
}) => {
  const t = useSeconds() - at;
  return (
    <div
      style={{
        position: "absolute",
        fontVariantNumeric: "lining-nums",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: DISPLAY,
        fontWeight: weight,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        color: col,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => {
        const p = ease("title", t - li * style.motion.stagger);
        const m = p >= 1 ? undefined : `linear-gradient(90deg, #000 ${p * 120 - 20}%, transparent ${p * 120}%)`;
        return (
          <div key={li} style={{ WebkitMaskImage: m, maskImage: m, opacity: p > 0 ? 1 : 0, paddingRight: "0.25em", marginRight: "-0.25em" }}>
            {words(line).map((w, wi) => (
              <React.Fragment key={wi}>
                {wi > 0 && !joined ? " " : null}
                <span style={{ fontStyle: w.em ? "italic" : "normal" }}>{w.text}</span>
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Body copy: Cormorant italic in ink 2, faded on like a subtitle (0.25 s). */
export const Body: React.FC<{ text: string; y: number; at?: number; width?: number; align?: "left" | "center"; size?: number }> = ({ text, y, at = 0, width = COLUMN, align = "left", size = T.body }) => {
  const p = ease("subtitle", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : M,
        top: y - size * 0.8,
        width,
        textAlign: align,
        fontFamily: DISPLAY,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.2,
        color: C.ink2,
        opacity: p,
      }}
    >
      {text}
    </div>
  );
};

/**
 * A hand-written note: Caveat drawn twice over a paper-coloured halo, written left to right, then a pen leader line
 * grows from `from` to the specimen at `to` and ends in a dot.
 */
export const Note: React.FC<{ text: string; x: number; y: number; at: number; from?: Pt; to?: Pt; size?: number; align?: "left" | "right"; bend?: number }> = ({
  text,
  x,
  y,
  at,
  from,
  to,
  size = T.hand,
  align = "left",
  bend = 0.18,
}) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const dur = Math.max(0.35, text.length * E.note.charSeconds);
  const p = easeFor("write", t, dur);
  const q = ease("leader", t - dur * 0.6);
  const m = p >= 1 ? undefined : `linear-gradient(90deg, #000 ${p * 112 - 12}%, transparent ${p * 112}%)`;
  const halo = `0 0 ${E.note.halo}px ${C.paper}, 0 0 ${E.note.halo}px ${C.paper}, 0 0 4px ${C.paper}`;
  let leader: React.ReactNode = null;
  if (from && to && q > 0) {
    const [ax, ay] = from;
    const [bx, by] = to;
    const mx = (ax + bx) / 2 - (by - ay) * bend;
    const my = (ay + by) / 2 + (bx - ax) * bend;
    const len = Math.hypot(bx - ax, by - ay) * 1.15;
    leader = (
      <svg width={W} height={H} style={abs}>
        <path d={`M ${ax} ${ay} Q ${f1(mx)} ${f1(my)} ${bx} ${by}`} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={E.note.leader} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - q)} />
        {q >= 1 ? <circle cx={bx} cy={by} r={E.note.dot} fill={C.ink} opacity={0.85} /> : null}
      </svg>
    );
  }
  const box: React.CSSProperties = {
    position: "absolute",
    left: align === "left" ? x : undefined,
    right: align === "right" ? W - x : undefined,
    top: y - size * 0.82,
    fontFamily: HAND,
    fontWeight: 600,
    fontSize: size,
    lineHeight: 1,
    color: C.ink,
    whiteSpace: "nowrap",
    padding: "0 0.3em 0.2em 0",
    WebkitMaskImage: m,
    maskImage: m,
  };
  return (
    <>
      {leader}
      <div style={{ ...box, textShadow: halo, opacity: 0.78 }}>{text}</div>
      <div style={{ ...box, opacity: 0.78 }}>{text}</div>
    </>
  );
};
