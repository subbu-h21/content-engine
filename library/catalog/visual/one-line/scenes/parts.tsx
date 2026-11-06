/**
 * One Line's pieces, all procedural and deterministic:
 * - one continuous path per picture, built from pieces that join end to start (connectors fall on the picture's
 *   own lines);
 * - timing by arc length weighted by curvature: the pen slows on turns (1 + K·turn, smoothed so speed never jumps);
 * - the line is a filled ribbon whose width follows pen pressure from speed (0.66 + 0.8·e^(−v/300), fast = thin) with
 *   ±8% noise, over a blurred bleed at 22%, with ink pooling where the pen is slowest;
 * - one stretch may carry the accent colour; the pen is never drawn, only its soft shadow and a contact dot; when it
 *   stops, a teardrop blot spreads;
 * - the camera follows the nib (lagging and anticipating) and pulls back to the composed picture;
 * - words: a connected script written on behind a paper halo; hand-written lines in Caveat.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, HAND, SCRIPT } from "./fonts";

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
  words: color(P, "muted"),
  faint: color(P, "faint"),
  accent: color(P, "accent"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration?: number): number =>
  run(duration === undefined ? R[name] : { ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

export type Pt = [number, number];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const pathOf = (pts: Pt[]) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}` : "");

const noise1 = (seed: number) => {
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

const resample = (pts: Pt[], step = 4): Pt[] => {
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

// ------------------------------------------------------------------ building a path

/** A smooth curve through points (Catmull-Rom). */
export const through = (pts: Pt[], n = 14): Pt[] => {
  if (pts.length < 3) return pts.slice();
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

/** An ellipse arc (degrees, 0 = right, 90 = down). */
export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 60): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

/** A wave along a line, easing to zero at both ends so it joins what comes before and after. */
export const wave = (from: Pt, to: Pt, amp: number, wl: number, fade = 30): Pt[] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const n = Math.max(8, Math.round(L / 4));
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L;
    const o = amp * Math.sin((s / wl) * Math.PI * 2) * Math.min(1, s / fade, (L - s) / fade);
    return [from[0] + ux * s - uy * o, from[1] + uy * s + ux * o] as Pt;
  });
};

/** Rotate points about a centre (degrees). */
export const rotate = (pts: Pt[], c: Pt, deg: number): Pt[] => {
  const a = (deg * Math.PI) / 180;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  return pts.map(([x, y]) => [c[0] + (x - c[0]) * ca - (y - c[1]) * sa, c[1] + (x - c[0]) * sa + (y - c[1]) * ca] as Pt);
};

export type Piece = Pt[] | { pts: Pt[]; accent: true };

/** Join pieces end to start into one line (a short smooth connector where they don't meet). Returns the points and the accent ranges. */
export const chain = (pieces: Piece[]): { pts: Pt[]; accent: [number, number][] } => {
  const out: Pt[] = [];
  const accent: [number, number][] = [];
  for (const pc of pieces) {
    const pts = Array.isArray(pc) ? pc : pc.pts;
    if (out.length && pts.length && dist(out[out.length - 1], pts[0]) > 2) out.push(...resample([out[out.length - 1], pts[0]], 4).slice(1));
    const s0 = out.length;
    out.push(...resample(pts, 4));
    if (!Array.isArray(pc)) accent.push([s0, out.length - 1]);
  }
  return { pts: out, accent };
};

// ------------------------------------------------------------------ the line

type Prepared = { pts: Pt[]; cum: number[]; total: number; width: number[]; slow: boolean[] };

/** Time weights from curvature (smoothed), widths from the pen pressure that speed implies. */
const prepare = (pts: Pt[], seed: number): Prepared => {
  const n = pts.length;
  const turn = pts.map((p, i) => {
    if (i === 0 || i === n - 1) return 0;
    const a = Math.atan2(p[1] - pts[i - 1][1], p[0] - pts[i - 1][0]);
    const b = Math.atan2(pts[i + 1][1] - p[1], pts[i + 1][0] - p[0]);
    let d = Math.abs(b - a);
    if (d > Math.PI) d = 2 * Math.PI - d;
    return d;
  });
  const K = S.motion.turnWeight;
  const raw = turn.map((d) => 1 + K * d);
  const w = raw.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = -4; k <= 4; k++) {
      const j = i + k;
      if (j >= 0 && j < n) {
        s += raw[j];
        c += 1;
      }
    }
    return s / c;
  });
  const cum: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0) acc += dist(pts[i - 1], pts[i]) * w[i];
    cum.push(acc);
  }
  const pr = E.pressure;
  const nz = noise1(seed);
  const width = w.map((wi, i) => {
    const v = S.motion.speed / wi;
    return E.line.width * (pr.base + pr.gain * Math.exp(-v / pr.speed)) * (1 + E.line.noise * nz(i / 18));
  });
  return { pts, cum, total: acc, width, slow: w.map((wi) => wi > E.line.pool) };
};

const ribbon = (pts: Pt[], width: number[], k = 1): string => {
  const n = pts.length;
  if (n < 2) return "";
  const L: Pt[] = [];
  const Rr: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const d = dist(a, b) || 1;
    const hw = (width[i] * k) / 2;
    L.push([pts[i][0] - ((b[1] - a[1]) / d) * hw, pts[i][1] + ((b[0] - a[0]) / d) * hw]);
    Rr.push([pts[i][0] + ((b[1] - a[1]) / d) * hw, pts[i][1] - ((b[0] - a[0]) / d) * hw]);
  }
  const all = [...L, ...Rr.reverse()];
  const capA = pts[0];
  const capB = pts[n - 1];
  const cap = (p: Pt, r: number) => `M ${(p[0] + r).toFixed(1)} ${p[1].toFixed(1)} a ${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0 a ${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0`;
  return `${pathOf(all)} Z ${cap(capA, (width[0] * k) / 2)} ${cap(capB, (width[n - 1] * k) / 2)}`;
};

/** The index (fractional) the pen has reached at drawing progress q (0..1 of the weighted length). */
const reach = (p: Prepared, q: number): number => {
  const target = q * p.total;
  let lo = 0;
  let hi = p.pts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (p.cum[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo === 0) return 0;
  const a = p.cum[lo - 1];
  const b = p.cum[lo];
  return lo - 1 + (b > a ? (target - a) / (b - a) : 1);
};

const pointAt = (p: Prepared, f: number): Pt => {
  const i = Math.floor(f);
  const k = f - i;
  const a = p.pts[Math.min(i, p.pts.length - 1)];
  const b = p.pts[Math.min(i + 1, p.pts.length - 1)];
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
};

export type LineProps = {
  path: { pts: Pt[]; accent: [number, number][] };
  at: number;
  dur: number;
  seed?: number;
  /** the camera: starting zoom, how hard it follows the nib at first, when the pull-back starts (fraction of the drawing) */
  zoom?: number;
  follow?: number;
  pullFrom?: number;
  blot?: boolean;
  children?: React.ReactNode;
};

/**
 * The one line, drawn on over `dur` seconds from `at`. The camera follows the nib (averaged over −0.55…+0.4 s)
 * and pulls back to the composed frame; `children` share the camera (things that live on the page).
 */
export const OneLine: React.FC<LineProps> = ({ path, at, dur, seed = 1, zoom = 1.9, follow = 0.7, pullFrom = 0.5, blot = true, children }) => {
  const id = useSvgId("olb");
  const t = useSeconds();
  const p = prepare(path.pts, seed);
  const qAt = (tt: number) => easeFor("draw", tt - at, dur);
  const q = qAt(t);
  const f = reach(p, q);
  const n = Math.max(0, Math.floor(f));
  const drawn = q > 0 ? [...p.pts.slice(0, n + 1), pointAt(p, f)] : [];
  const widths = q > 0 ? [...p.width.slice(0, n + 1), p.width[Math.min(n + 1, p.width.length - 1)]] : [];
  const nib = pointAt(p, f);
  // camera: follow the averaged nib, then pull back to the composed frame
  const avg: Pt = [0, 0];
  const samples = [-0.55, -0.35, -0.15, 0, 0.2, 0.4];
  for (const dt of samples) {
    const pt = pointAt(p, reach(p, qAt(t + dt)));
    avg[0] += pt[0] / samples.length;
    avg[1] += pt[1] / samples.length;
  }
  const pull = easeFor("camera", t - (at + dur * pullFrom), dur * (1 - pullFrom) + 0.4);
  const z = lerp(zoom, 1, pull);
  const fw = lerp(follow, 0, pull);
  const focus: Pt = [lerp(W / 2, avg[0], fw), lerp(H / 2, avg[1], fw)];
  const pen = E.pen;
  const done = q >= 1;
  const blotP = blot && done ? easeFor("blot", t - (at + dur)) : 0;
  const end = p.pts[p.pts.length - 1];
  const accents = path.accent
    .map(([a, b]) => [a, Math.min(b, n)] as [number, number])
    .filter(([a, b]) => b > a)
    .map(([a, b]) => ({ pts: p.pts.slice(a, b + 1), w: p.width.slice(a, b + 1) }));
  return (
    <g transform={`translate(${W / 2} ${H / 2}) scale(${z.toFixed(4)}) translate(${(-focus[0]).toFixed(2)} ${(-focus[1]).toFixed(2)})`}>
      <defs>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={0.9 * z} />
        </filter>
      </defs>
      {children}
      {drawn.length > 1 ? (
        <>
          <path d={ribbon(drawn, widths, E.line.bleedWidth)} fill={C.ink} opacity={E.line.bleed} filter={`url(#${id})`} />
          <path d={ribbon(drawn, widths)} fill={C.ink} opacity={E.line.alpha} />
          {accents.map((a, i) => (
            <path key={i} d={ribbon(a.pts, a.w, 1.04)} fill={C.accent} />
          ))}
          {p.pts.slice(0, n).map((pt, i) => (p.slow[i] && i % 3 === 0 ? <circle key={i} cx={pt[0]} cy={pt[1]} r={p.width[i] * 0.62} fill={C.ink} opacity={0.35} /> : null))}
        </>
      ) : null}
      {blotP > 0 ? (
        <path
          d={`M ${end[0]} ${end[1]} C ${end[0] + E.blot.r * 0.9 * blotP} ${end[1] + E.blot.r * 0.6 * blotP} ${end[0] + E.blot.r * 1.1 * blotP} ${end[1] + E.blot.r * 2.2 * blotP} ${end[0]} ${end[1] + E.blot.r * 2.3 * blotP} C ${end[0] - E.blot.r * 1.1 * blotP} ${end[1] + E.blot.r * 2.2 * blotP} ${end[0] - E.blot.r * 0.9 * blotP} ${end[1] + E.blot.r * 0.6 * blotP} ${end[0]} ${end[1]} Z`}
          fill={C.ink}
          stroke={C.ink}
          strokeOpacity={0.5}
          strokeWidth={1.4}
          opacity={0.92}
        />
      ) : null}
      {q > 0 && !done ? (
        <g>
          <path d={`M ${nib[0]} ${nib[1]} L ${nib[0] + pen.length * 0.62} ${nib[1] + pen.length * 0.78 - 16} L ${nib[0] + pen.length * 0.62 + 30} ${nib[1] + pen.length * 0.78 + 14} Z`} fill="#000" opacity={pen.shadow} filter={`url(#${id}s)`} />
          <circle cx={nib[0]} cy={nib[1]} r={pen.contact} fill={C.ink} />
          <defs>
            <filter id={`${id}s`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={10} />
            </filter>
          </defs>
        </g>
      ) : null}
    </g>
  );
};

// ------------------------------------------------------------------ words

/** The title in a connected script, written on left to right over 1.6 s behind a paper-coloured halo. */
export const Script: React.FC<{ lines: string[]; x: number; y: number; at: number; size?: number; anchor?: "start" | "middle" }> = ({ lines, x, y, at, size = T.title, anchor = "start" }) => {
  const id = useSvgId("ols");
  const t = useSeconds();
  const per = S.motion.recipes.title.duration / lines.length;
  return (
    <g>
      {lines.map((l, i) => {
        const p = easeFor("title", t - at - i * per, per);
        if (p <= 0) return null;
        const est = l.length * size * 0.42;
        const x0 = anchor === "middle" ? x - est / 2 : x;
        return (
          <g key={i}>
            <defs>
              <clipPath id={`${id}${i}`}>
                <rect x={x0 - size * 0.4} y={y + i * size * T.leading - size * 1.1} width={p >= 0.995 ? W * 2 : size * 0.4 + est * 1.15 * p} height={size * 1.7} />
              </clipPath>
            </defs>
            <text clipPath={`url(#${id}${i})`} x={x} y={y + i * size * T.leading} fontFamily={SCRIPT} fontSize={size} fill={C.ink} textAnchor={anchor} stroke={C.paper} strokeWidth={E.halo} style={{ paintOrder: "stroke" }}>
              {l}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** Hand-written words (Caveat, ink at 84%), written on in 0.2 s + 17 ms a character behind a paper halo. */
export const Words: React.FC<{ lines: string[]; x: number; y: number; at: number; size?: number; anchor?: "start" | "middle" | "end"; weight?: number; tracking?: number }> = ({ lines, x, y, at, size = T.body, anchor = "start", weight = 500, tracking = 0 }) => {
  const id = useSvgId("olw");
  const t = useSeconds();
  let t0 = at;
  return (
    <g>
      {lines.map((l, i) => {
        const dur = S.motion.recipes.words.duration + S.motion.perChar * l.length;
        const p = clamp((t - t0) / dur);
        t0 += dur;
        if (p <= 0) return null;
        const est = l.length * size * 0.42;
        const x0 = anchor === "middle" ? x - est / 2 : anchor === "end" ? x - est : x;
        return (
          <g key={i}>
            <defs>
              <clipPath id={`${id}${i}`}>
                <rect x={x0 - size} y={y + i * size * 1.2 - size} width={p >= 1 ? W * 2 : size + est * 1.2 * p} height={size * 1.5} />
              </clipPath>
            </defs>
            <text clipPath={`url(#${id}${i})`} x={x} y={y + i * size * 1.2} fontFamily={HAND} fontWeight={weight} fontSize={size} letterSpacing={`${tracking}em`} fill={C.words} textAnchor={anchor} stroke={C.paper} strokeWidth={E.halo} style={{ paintOrder: "stroke" }}>
              {l}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ the paper

/** Warm paper: soft mottling, faint long fibres, a sparse tooth, a light vignette. Waits for the fonts. */
export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ol-mottle" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={3} seed={4} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="ol-fibre" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.25" numOctaves={2} seed={9} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 8 -5.3" />
          </filter>
        </defs>
        <rect width={W} height={H} filter="url(#ol-mottle)" style={{ mixBlendMode: "soft-light" }} opacity={0.3} />
        <rect width={W} height={H} filter="url(#ol-fibre)" opacity={0.08} />
        {children}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};
