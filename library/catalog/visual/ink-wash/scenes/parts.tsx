/**
 * Ink Wash's pieces, all procedural and deterministic:
 * - rice paper: cloud mottling, long fibres and pulp flecks (feTurbulence), a soft vignette;
 * - the brush: a centreline × a pressure profile × width noise, a body whose ink fades as the brush dries
 *   ((1 − dry)^1.6), and bristles darker on the loaded side whose ink breaks on long-scale noise into flying white;
 *   painted on along its length, stepping on twos with a small 5-drawing boil of the width noise;
 * - masses (mountains, molecules, bodies): soft shapes with ragged, bled edges and pigment pooled at the rim
 *   (feDisplacementMap and two blurs), fading downward into mist;
 * - five ink tones (burnt, thick, heavy, light, clear) as opacity of one ink;
 * - inscriptions that go on wet and dry in 0.35 s, titles in vertical columns, the vermilion seal with a character
 *   knocked out of it, open ink rings on water.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, run, seeded, useFontsReady, type Recipe } from "../../kit";
import style from "../style.json";
import { CAPS, FACES, INSCRIPTION } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const T = style.type;
export const E = style.elements;
export const TONE = style.elements.tones;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  inkLow: color(P, "muted"),
  fibre: color(P, "faint"),
  seal: color(P, "accent"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration?: number): number =>
  run(duration === undefined ? R[name] : { ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** Time on twos (figures and stable strokes step), and the boil drawing (a 5-drawing cycle). */
export const useTwos = (): { t: number; step: number } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.floor(frame / S.motion.twos);
  return { t: (step * S.motion.twos) / fps, step };
};

// ------------------------------------------------------------------ geometry

export type Pt = [number, number];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

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

export const resample = (pts: Pt[], step = 3): Pt[] => {
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

/** A smooth curve through points (Catmull-Rom). */
export const smoothPts = (pts: Pt[], n = 12): Pt[] => {
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

export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 48): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

const pathOf = (pts: Pt[]) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}` : "");
const smooth01 = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// ------------------------------------------------------------------ the brush

export type Profile = "brush" | "tip" | "nail" | "even" | "rise" | "lens";
/** Pressure along a stroke (0..1 → width factor): hidden-tip entries, swells and tapered exits. */
export const profile = (kind: Profile, u: number): number => {
  switch (kind) {
    case "tip":
      return Math.min(1, u / 0.05) * (1 - 0.8 * Math.pow(u, 1.4));
    case "nail":
      return (1.25 - 0.6 * u) * Math.min(1, (1 - u) / 0.12 + 0.25);
    case "even":
      return 0.75 + 0.25 * Math.min(1, u / 0.08, (1 - u) / 0.08);
    case "rise":
      return (0.25 + 0.75 * u) * Math.min(1, (1 - u) / 0.08 + 0.3);
    case "lens":
      return Math.sin(Math.PI * clamp(u)) * 0.9 + 0.1;
    default:
      // brush: a hidden-tip entry, a full belly, a long tapered exit
      return Math.pow(Math.min(1, u / 0.14), 0.6) * (1 - 0.82 * smooth01(0.62, 1, u));
  }
};

export type BrushProps = {
  pts: Pt[];
  width: number;
  tone: number;
  at: number;
  dur?: number;
  dry?: number;
  kind?: Profile;
  bristles?: number;
  seed: number;
  /** the loaded side: +1 or −1 (the stroke carries its own darker edge there) */
  side?: number;
  smooth?: boolean;
  decisive?: boolean;
};

/** One brushstroke: body + bristles, painted on along its length. */
export const Brush: React.FC<BrushProps> = ({ pts, width, tone, at, dur, dry = 0.2, kind = "brush", bristles, seed, side = 1, smooth = true, decisive = false }) => {
  const { t, step } = useTwos();
  const hp = resample(smooth ? smoothPts(pts) : pts, 3);
  const n = hp.length;
  const length = hp.reduce((s, p, i) => (i ? s + dist(hp[i - 1], p) : 0), 0);
  const d = dur ?? (decisive ? S.motion.recipes.decisive.duration : clamp(length / 1200, 0.25, 1.1));
  const p = decisive ? easeFor("decisive", t - at, d) : easeFor("paint", t - at, d);
  if (p <= 0 || n < 2) return null;
  const shown = Math.max(2, Math.ceil(n * p));
  const wn = noise1(seed);
  const boil = noise1(seed * 7 + (step % S.motion.boilCycle) * 131);
  const w = (u: number) => width * profile(kind, u) * (1 + E.brush.widthNoise * wn(u * 7) + E.brush.boil * boil(u * 11));
  // normals
  const nrm: Pt[] = hp.map((_, i) => {
    const a = hp[Math.max(0, i - 1)];
    const b = hp[Math.min(n - 1, i + 1)];
    const L = dist(a, b) || 1;
    return [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
  });
  const [b0, b1] = E.brush.bristles;
  const nb = bristles ?? Math.round(clamp(width / 2.2, b0, b1));
  // body
  const Lp: Pt[] = [];
  const Rp: Pt[] = [];
  for (let i = 0; i < shown; i++) {
    const hw = w(i / (n - 1)) / 2;
    Lp.push([hp[i][0] + nrm[i][0] * hw, hp[i][1] + nrm[i][1] * hw]);
    Rp.push([hp[i][0] - nrm[i][0] * hw, hp[i][1] - nrm[i][1] * hw]);
  }
  const body = `${pathOf([...Lp, ...Rp.reverse()])} Z`;
  const bodyAlpha = tone * Math.pow(1 - dry, 1.6) * 0.82;
  // bristles: each strand follows its lateral place in the stroke; its ink varies in long streaks and breaks on
  // long-scale noise into flying white, first at the edges and towards the end, more as the brush dries
  const strands: { d: string; a: number; sw: number }[] = [];
  let s = 0;
  const arcLen: number[] = hp.map((pt, i) => (i ? (s += dist(hp[i - 1], pt)) : 0));
  for (let k = 0; k < nb; k++) {
    const o = (k + 0.5) / nb - 0.5;
    const gn = noise1(seed * 101 + k * 13);
    const ld = noise1(seed * 211 + k * 7);
    const load = 0.5 + 0.5 * side * o * 2;
    const segs: { pts: Pt[]; a: number }[] = [];
    let cur: Pt[] = [];
    let acc = 0;
    for (let i = 0; i < shown; i++) {
      const u = i / (n - 1);
      const hw = w(u) * 0.48;
      const thr = -1.05 + 2.4 * dry * (0.25 + 0.75 * smooth01(0.05, 0.8, u)) + 1.2 * dry * Math.abs(o) * 2;
      const on = gn(arcLen[i] / E.brush.gapLen) > thr;
      if (on) {
        cur.push([hp[i][0] + nrm[i][0] * o * 2 * hw, hp[i][1] + nrm[i][1] * o * 2 * hw]);
        acc += 0.68 + 0.5 * ld(arcLen[i] / 90);
      } else if (cur.length) {
        segs.push({ pts: cur, a: acc / cur.length });
        cur = [];
        acc = 0;
      }
    }
    if (cur.length) segs.push({ pts: cur, a: acc / cur.length });
    for (const sg of segs) if (sg.pts.length > 2) strands.push({ d: pathOf(sg.pts), a: clamp(tone * load * sg.a * (0.6 + 0.4 * (1 - dry))), sw: Math.max(1.2, (width / nb) * 2.1) });
  }
  return (
    <g filter="url(#iw-brush)">
      {dry < 0.6 ? <path d={body} fill={C.ink} fillOpacity={tone * 0.16 * (1 - dry)} filter="url(#iw-halo)" /> : null}
      <path d={body} fill={C.ink} fillOpacity={bodyAlpha * 1.05} />
      <g fill="none" stroke={C.ink} strokeLinecap="round" strokeLinejoin="round">
        {strands.map((st, i) => (
          <path key={i} d={st.d} strokeWidth={st.sw} strokeOpacity={st.a * 0.62} />
        ))}
      </g>
    </g>
  );
};

/** Several strokes painted one after another (stroke order), each `gap` seconds after the last one ends. */
export const Strokes: React.FC<{ list: Omit<BrushProps, "at" | "seed">[]; at: number; gap?: number; seed: number }> = ({ list, at, gap = 0.08, seed }) => {
  let t0 = at;
  return (
    <>
      {list.map((b, i) => {
        const hp = resample(b.pts, 3);
        const length = hp.reduce((s, p, k) => (k ? s + dist(hp[k - 1], p) : 0), 0);
        const d = b.dur ?? (b.decisive ? S.motion.recipes.decisive.duration : clamp(length / 1200, 0.25, 1.1));
        const node = <Brush key={i} {...b} at={t0} dur={d} seed={seed + i * 17} />;
        t0 += d + gap;
        return node;
      })}
    </>
  );
};

// ------------------------------------------------------------------ washes and masses

/** A soft ink mass (mountain, rock, body): bled ragged edges with pigment pooled at the rim, fading to mist below. */
export const Mass: React.FC<{ poly: Pt[]; tone: number; at: number; dur?: number; fadeFrom?: number; fadeTo?: number; seed?: number }> = ({ poly, tone, at, dur, fadeFrom, fadeTo, seed = 1 }) => {
  const id = useSvgId("iwm");
  const { t } = useTwos();
  const p = easeFor("mass", t - at, dur);
  if (p <= 0) return null;
  const ys = poly.map((q) => q[1]);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const f0 = fadeFrom ?? top;
  const f1 = fadeTo ?? bottom;
  const r = seeded(seed);
  const jit = resample([...poly, poly[0]], 14).map(([x, y]) => [x + (r() - 0.5) * 6, y + (r() - 0.5) * 6] as Pt);
  return (
    <g filter="url(#iw-wet)">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={f0} x2={0} y2={f1}>
          <stop offset="0" stopColor={C.ink} stopOpacity={tone * p} />
          <stop offset="0.45" stopColor={C.ink} stopOpacity={tone * 0.75 * p} />
          <stop offset="1" stopColor={C.ink} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${pathOf(jit)} Z`} fill={`url(#${id})`} />
    </g>
  );
};

/** A ridge line: x from x0 to x1, peaks from noise, `h` tall above `base`. Returns the mountain polygon (to `bottom`). */
export const range = (x0: number, x1: number, base: number, h: number, seed: number, peaks = 3, bottom = base + 220): { ridge: Pt[]; poly: Pt[] } => {
  const n = noise1(seed);
  const ridge: Pt[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const env = Math.pow(Math.sin(Math.PI * u), 0.8);
    const ridgeN = 0.55 + 0.45 * Math.abs(Math.sin(u * Math.PI * peaks + seed)) * (0.7 + 0.3 * n(u * 9));
    ridge.push([x0 + (x1 - x0) * u, base - h * env * ridgeN + n(u * 31) * 6]);
  }
  return { ridge, poly: [...ridge, [x1, bottom], [x0, bottom]] };
};

/** Hemp-fibre texture (long wavy strokes down a slope) and moss dots along a near ridge. */
export const Texture: React.FC<{ ridge: Pt[]; at: number; seed: number; count?: number; len?: number; tone?: number }> = ({ ridge, at, seed, count = 9, len = 120, tone = TONE.heavy }) => {
  const r = seeded(seed);
  const list: Omit<BrushProps, "at" | "seed">[] = [];
  for (let i = 0; i < count; i++) {
    const k = Math.floor((0.12 + 0.76 * r()) * (ridge.length - 1));
    const [x, y] = ridge[k];
    const dx = (r() - 0.5) * 40;
    list.push({ pts: [[x, y + 8], [x + dx * 0.5 + (r() - 0.5) * 16, y + len * 0.5], [x + dx, y + len * (0.8 + r() * 0.4)]], width: 6, tone: tone * 0.7, kind: "tip", dry: 0.55, bristles: 4 });
  }
  const dots = Array.from({ length: Math.round(count * 1.6) }, () => {
    const k = Math.floor((0.08 + 0.84 * r()) * (ridge.length - 1));
    return [ridge[k][0] + (r() - 0.5) * 18, ridge[k][1] + 4 + r() * 14, 3 + r() * 4.5] as [number, number, number];
  });
  const { t } = useTwos();
  const dp = clamp((t - at - 0.6) / 0.5);
  return (
    <>
      <Strokes list={list} at={at} gap={0.02} seed={seed} />
      {dots.slice(0, Math.round(dots.length * dp)).map(([x, y, rr], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rr} ry={rr * 0.72} fill={C.ink} opacity={TONE.burnt * 0.9} transform={`rotate(${(i * 37) % 180} ${x} ${y})`} />
      ))}
    </>
  );
};

/** A pine: one crooked loaded trunk with bark marks, tip branches, fan clusters of burnt needles over pale washes. */
export const Pine: React.FC<{ x: number; y: number; h: number; lean?: number; at: number; seed?: number }> = ({ x, y, h, lean = 0.35, at, seed = 70 }) => {
  const r = seeded(seed);
  const trunk: Pt[] = [
    [x, y],
    [x + h * lean * 0.2, y - h * 0.3],
    [x - h * lean * 0.1, y - h * 0.55],
    [x + h * lean * 0.45, y - h * 0.8],
    [x + h * lean * 0.7, y - h],
  ];
  const tips = [0.3, 0.46, 0.6, 0.74, 0.88, 1].map((u, i) => {
    const base = lerpPt(trunk, u);
    const dir = i % 2 ? 1 : -1;
    const len = i === 5 ? h * 0.08 : h * (0.36 - u * 0.14);
    return { from: base, to: [base[0] + dir * len, base[1] - len * 0.25 - r() * 18] as Pt };
  });
  const rad = h * 0.15;
  const fan = (c: Pt): Omit<BrushProps, "at" | "seed">[] =>
    Array.from({ length: 15 }, (_, i) => {
      const a = Math.PI * 1.02 + (i / 14) * Math.PI * 0.96;
      return { pts: [[c[0] + Math.cos(a) * rad * 0.15, c[1] + Math.sin(a) * rad * 0.1], [c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad * 0.62]] as Pt[], width: 5, tone: TONE.burnt, kind: "tip" as Profile, dry: 0.15, bristles: 3, smooth: false };
    });
  return (
    <>
      <Brush pts={trunk} width={h * 0.085} tone={TONE.thick} at={at} kind="even" dry={0.32} seed={seed} side={-1} />
      <Strokes list={[0.2, 0.42, 0.64].map((u) => {
        const p0 = lerpPt(trunk, u);
        return { pts: [p0, [p0[0] + h * 0.03, p0[1] - h * 0.02]] as Pt[], width: 7, tone: TONE.burnt, kind: "lens" as Profile, dry: 0.2, bristles: 3, smooth: false };
      })} at={at + 0.35} gap={0.02} seed={seed + 3} />
      <Strokes list={tips.slice(0, 5).map((tp) => ({ pts: [tp.from, [(tp.from[0] + tp.to[0]) / 2, tp.from[1] - 14], tp.to], width: h * 0.028, tone: TONE.thick, kind: "tip" as Profile, dry: 0.35 }))} at={at + 0.5} gap={0.03} seed={seed + 5} />
      {tips.map((tp, i) => (
        <React.Fragment key={i}>
          <Mass poly={arc(tp.to[0], tp.to[1] - rad * 0.2, rad * 1.15, rad * 0.5, 0, 360, 24)} tone={TONE.clear * 1.3} at={at + 0.8 + i * 0.08} dur={0.4} seed={seed + 30 + i} />
          <Strokes list={fan(tp.to)} at={at + 0.9 + i * 0.1} gap={0} seed={seed + 50 + i * 20} />
        </React.Fragment>
      ))}
    </>
  );
};

/** A point a fraction u along a polyline (by vertex index, enough for short branches). */
const lerpPt = (pts: Pt[], u: number): Pt => {
  const f = clamp(u) * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(f));
  const k = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
};

/** A mountain: a soft mass dissolving into mist, with a darker band of ink along its ridge. */
export const Mountain: React.FC<{ ridge: Pt[]; poly: Pt[]; tone: number; at: number; fadeTo: number; seed: number }> = ({ ridge, poly, tone, at, fadeTo, seed }) => {
  const top = Math.min(...ridge.map((p) => p[1]));
  const band: Pt[] = [...ridge, ...ridge.slice().reverse().map(([px, py]) => [px, py + 90] as Pt)];
  return (
    <>
      <Mass poly={poly} tone={tone} at={at} fadeTo={fadeTo} seed={seed} />
      <Mass poly={band} tone={tone * 0.9} at={at + 0.2} fadeFrom={top} fadeTo={top + 260} seed={seed + 1} />
    </>
  );
};

/** A xieyi figure: a pale body mass, two loaded strokes, a conical hat in burnt ink; looking up. */
export const Figure: React.FC<{ x: number; y: number; h: number; at: number; seed?: number }> = ({ x, y, h, at, seed = 90 }) => (
  <>
    <Mass poly={[[x - h * 0.16, y], [x - h * 0.1, y - h * 0.62], [x + h * 0.08, y - h * 0.66], [x + h * 0.2, y]]} tone={TONE.light} at={at} dur={0.4} seed={seed} />
    <Brush pts={[[x - h * 0.08, y - h * 0.64], [x - h * 0.14, y - h * 0.3], [x - h * 0.18, y]]} width={h * 0.07} tone={TONE.thick} at={at + 0.25} kind="tip" dry={0.3} seed={seed + 1} decisive />
    <Brush pts={[[x + h * 0.08, y - h * 0.6], [x + h * 0.16, y - h * 0.25], [x + h * 0.22, y]]} width={h * 0.05} tone={TONE.heavy} at={at + 0.4} kind="tip" dry={0.4} seed={seed + 2} decisive />
    <Brush pts={[[x - h * 0.06, y - h * 0.8], [x + h * 0.02, y - h * 0.68]]} width={h * 0.09} tone={TONE.heavy} at={at + 0.5} kind="lens" dry={0.1} seed={seed + 3} smooth={false} />
    <Brush pts={[[x - h * 0.22, y - h * 0.74], [x + h * 0.02, y - h * 0.98], [x + h * 0.2, y - h * 0.8]]} width={h * 0.07} tone={TONE.burnt} at={at + 0.6} kind="even" dry={0.15} seed={seed + 4} />
  </>
);

/** An open ink ring on water (one stroke of 1.86π with a gap). */
export const Ring: React.FC<{ x: number; y: number; r: number; at: number; tone?: number; seed?: number }> = ({ x, y, r, at, tone = TONE.light, seed = 5 }) => {
  const a0 = seeded(seed)() * 360;
  return <Brush pts={arc(x, y, r, r * 0.32, a0, a0 + E.ring.arc * 180, 40)} width={3.5} tone={tone} at={at} kind="lens" dry={0.3} bristles={3} seed={seed} smooth={false} />;
};

// ------------------------------------------------------------------ words and the seal

/** An inscription: italic, ink, in empty paper; goes on wet (soft, dark) and dries sharp in 0.35 s. */
export const Inscription: React.FC<{ lines: string[]; x: number; y: number; at: number; size?: number; mark?: boolean; anchor?: "start" | "middle"; tone?: number }> = ({
  lines,
  x,
  y,
  at,
  size = T.inscription,
  mark = false,
  anchor = "start",
  tone = TONE.thick,
}) => {
  const { t } = useTwos();
  const p = easeFor("inscribe", t - at);
  if (p <= 0) return null;
  return (
    <g opacity={tone * Math.min(1, p * 1.6)} style={{ filter: p < 1 ? `blur(${((1 - p) * 2.2).toFixed(2)}px)` : undefined }}>
      {mark ? <rect x={x - size * 0.42} y={y - size * 0.46} width={size * 0.2} height={size * 0.2} fill={C.seal} /> : null}
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * size * T.leading} fontFamily={INSCRIPTION} fontStyle="italic" fontWeight={500} fontSize={size} letterSpacing={T.tracking} fill={C.ink} textAnchor={anchor}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** A title written in a vertical column (letters turned 90°, read top to bottom), wet to dry. */
export const Column: React.FC<{ text: string; x: number; y: number; at: number; size?: number }> = ({ text, x, y, at, size = T.title }) => {
  const { t } = useTwos();
  const p = easeFor("inscribe", t - at, 0.5);
  if (p <= 0) return null;
  return (
    <g opacity={TONE.burnt * Math.min(1, p * 1.5)} style={{ filter: p < 1 ? `blur(${((1 - p) * 2.4).toFixed(2)}px)` : undefined }}>
      <text x={x} y={y} transform={`rotate(90 ${x} ${y})`} fontFamily={CAPS} fontWeight={600} fontSize={size} letterSpacing={`${T.titleTracking}em`} fill={C.ink} dominantBaseline="central">
        {text}
      </text>
    </g>
  );
};

/** The seal: a slightly irregular vermilion square with 天 ("sky") knocked out in white lines, ink-paste speckles. */
export const Seal: React.FC<{ x: number; y: number; at: number; size?: number; seed?: number }> = ({ x, y, at, size = E.seal.size, seed = 3 }) => {
  const id = useSvgId("iws");
  const { t } = useTwos();
  const p = easeFor("seal", t - at);
  if (p <= 0) return null;
  const r = seeded(seed);
  const j = () => (r() - 0.5) * size * 0.05;
  const s = size;
  const sq: Pt[] = [
    [x + j(), y + j()],
    [x + s * 0.5 + j(), y - 1 + j()],
    [x + s + j(), y + j()],
    [x + s + 1 + j(), y + s * 0.5 + j()],
    [x + s + j(), y + s + j()],
    [x + s * 0.5 + j(), y + s + 1 + j()],
    [x + j(), y + s + j()],
    [x - 1 + j(), y + s * 0.5 + j()],
  ];
  const lw = (E.seal.line * s) / 76;
  const cx = x + s / 2;
  // 天: two horizontals, the left-falling and right-falling strokes
  const strokes = [
    `M ${x + s * 0.27} ${y + s * 0.27} L ${x + s * 0.73} ${y + s * 0.26}`,
    `M ${x + s * 0.18} ${y + s * 0.47} L ${x + s * 0.82} ${y + s * 0.46}`,
    `M ${cx} ${y + s * 0.28} Q ${cx - s * 0.02} ${y + s * 0.6} ${x + s * 0.2} ${y + s * 0.8}`,
    `M ${cx + s * 0.02} ${y + s * 0.5} Q ${cx + s * 0.12} ${y + s * 0.68} ${x + s * 0.8} ${y + s * 0.8}`,
  ];
  const specks = Array.from({ length: 16 }, () => [x + s * (0.08 + 0.84 * r()), y + s * (0.08 + 0.84 * r()), 0.8 + r() * 1.6]);
  const k = 1 + (1 - p) * 0.35;
  return (
    <g transform={`translate(${cx} ${y + s / 2}) scale(${k}) translate(${-cx} ${-(y + s / 2)})`} opacity={Math.min(1, p * 2)}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={x - 10} y={y - 10} width={s + 20} height={s + 20}>
          <path d={`${pathOf(sq)} Z`} fill="#ffffff" />
          <g stroke="#000000" strokeWidth={lw} strokeLinecap="square" fill="none">
            {strokes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {specks.map(([sx, sy, sr], i) => (
            <circle key={i} cx={sx} cy={sy} r={sr} fill="#000000" />
          ))}
        </mask>
      </defs>
      <rect x={x - 6} y={y - 6} width={s + 12} height={s + 12} fill={C.seal} mask={`url(#${id})`} opacity={0.92} />
    </g>
  );
};

// ------------------------------------------------------------------ the paper

/** Rice paper: cloud mottling, fibres in three directions, pulp flecks, a soft vignette. Waits for the fonts. */
export const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const pp = E.paper;
  const wet = E.wet;
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="iw-mottle" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={4} seed={2} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="iw-fibre" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves={2} seed={6} />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 9 -5.9" />
          </filter>
          <filter id="iw-fleck" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves={1} seed={12} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.33  14 0 0 0 -10.6" />
          </filter>
          <filter id="iw-brush" x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={17} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="iw-halo" x="-25%" y="-60%" width="150%" height="220%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={23} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={3.5} />
          </filter>
          <filter id="iw-wet" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={wet.displace} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={wet.bleed} result="s" />
            <feGaussianBlur in="d" stdDeviation={wet.edge} result="l" />
            <feComposite in="s" in2="l" operator="arithmetic" k2={1.55} k3={-0.55} />
          </filter>
        </defs>
        <rect width={W} height={H} filter="url(#iw-mottle)" style={{ mixBlendMode: "soft-light" }} opacity={pp.mottle * 5} />
        <rect width={W} height={H} filter="url(#iw-fibre)" opacity={pp.fibre * 7} />
        <rect width={W} height={H} filter="url(#iw-fleck)" opacity={pp.flecks} />
        <g style={{ mixBlendMode: "multiply" }}>{children}</g>
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export { CAPS, INSCRIPTION };
