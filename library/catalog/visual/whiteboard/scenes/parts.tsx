/**
 * Whiteboard's pieces, drawn procedurally and deterministically:
 * - the board: a warm white gradient, scuffs and micro-scratches (feTurbulence), a diagonal window sheen, and ghosts
 *   of old lessons at 5–10%;
 * - marker strokes: ribbons around a centreline with a slow hand wobble and a fine tremor (seeded noise), width by
 *   the chisel's direction, a pressure ramp at the start, a taper at the end and a pooled dot on long strokes; drawn
 *   on with the source's slow-fast-slow stroke curve;
 * - ink is multiplied onto the board (overlaps darken) through a dry-marker mask of streaks (feTurbulence threshold);
 * - words are real type, each glyph tilted, nudged and scaled, written on behind the marker;
 * - floating markers (no hand) with cast shadows, an orange map-pin magnet, the burned-in subtitle label.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, HANDWRITING } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  board: color(P, "background"),
  boardLow: color(P, "boardLow"),
  black: color(P, "text"),
  blue: color(P, "accent2"),
  orange: color(P, "accent"),
  ghost: color(P, "muted"),
  ghostBlue: color(P, "faint"),
  wall: color(P, "wall"),
  frame: color(P, "frame"),
  label: color(P, "label"),
  eraser: color(P, "eraser"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration: number): number =>
  run({ ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);

/** A stable, url()-safe id for SVG defs. */
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

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

export const resample = (pts: Pt[], step = 4): Pt[] => {
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

/** An ellipse arc as points (degrees). */
export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 48): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

/** A hand circle: starts at an angle and runs past its start (overlap), slightly spiralling. */
export const handCircle = (cx: number, cy: number, rx: number, ry: number, start = 200, overlap = 24, drift = 0.04): Pt[] =>
  Array.from({ length: 73 }, (_, i) => {
    const u = i / 72;
    const a = ((start + (360 + overlap) * u) * Math.PI) / 180;
    const k = 1 + drift * (u - 0.5);
    return [cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)] as Pt;
  });

export const quad = (p0: Pt, c: Pt, p1: Pt, n = 24): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]] as Pt;
  });

/** A wave along a line (light). */
export const wavePts = (from: Pt, to: Pt, amp: number, wl: number): Pt[] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const n = Math.max(8, Math.round(L / 4));
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L;
    const fade = Math.min(1, s / 24, (L - s) / 24);
    const o = amp * Math.sin((s / wl) * Math.PI * 2) * fade;
    return [from[0] + ux * s - uy * o, from[1] + uy * s + ux * o] as Pt;
  });
};

/** The hand: slow wobble (±2.6 px at ~220 px) plus a fine tremor along the normal. No boil: a real board. */
const handPts = (pts: Pt[], seed: number): Pt[] => {
  const r = resample(pts, 4);
  const slow = noise1(seed);
  const fine = noise1(seed * 17 + 3);
  let s = 0;
  return r.map((p, i) => {
    if (i > 0) s += dist(r[i - 1], p);
    const a = r[Math.max(0, i - 1)];
    const b = r[Math.min(r.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const off = E.stroke.wobble * slow(s / E.stroke.wavelength) + E.stroke.tremor * fine(s / 18);
    return [p[0] - (dy / L) * off, p[1] + (dx / L) * off] as Pt;
  });
};

/** The marker's ribbon: chisel width by direction, a pressure ramp at the start, a taper at the end. */
const markerRibbon = (pts: Pt[], width: number, total: number, done: boolean): string => {
  const n = pts.length;
  if (n < 2) return "";
  const [c0, c1] = E.stroke.chisel;
  const L: Pt[] = [];
  const Rr: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const u = i / Math.max(1, total - 1);
    const dir = Math.atan2(dy, dx);
    const chisel = c0 + (c1 - c0) * Math.abs(Math.sin(dir - Math.PI / 4));
    const ramp = lerp(E.stroke.rampStart, 1, clamp(u / E.stroke.ramp));
    const taper = done ? lerp(0.35, 1, clamp((1 - u) / E.stroke.taper)) : 1;
    const hw = (width * chisel * ramp * taper) / 2;
    L.push([pts[i][0] - (dy / len) * hw, pts[i][1] + (dx / len) * hw]);
    Rr.push([pts[i][0] + (dy / len) * hw, pts[i][1] - (dx / len) * hw]);
  }
  const all = [...L, ...Rr.reverse()];
  const head = pts[0];
  const capR = (width * E.stroke.rampStart * c0) / 2;
  return `M${all.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} Z M ${(head[0] + capR).toFixed(1)} ${head[1].toFixed(1)} a ${capR.toFixed(1)} ${capR.toFixed(1)} 0 1 0 ${(-2 * capR).toFixed(1)} 0 a ${capR.toFixed(1)} ${capR.toFixed(1)} 0 1 0 ${(2 * capR).toFixed(1)} 0`;
};

const strokeLength = (pts: Pt[]) => pts.reduce((n, p, i) => (i ? n + dist(pts[i - 1], p) : 0), 0);

// ------------------------------------------------------------------ the board

type Ghost = { kind: "text"; x: number; y: number; text: string; size: number; blue: boolean; o: number; rot: number } | { kind: "path"; d: string; blue: boolean; o: number; w: number };

const GHOST_WORDS = ["v = d / t", "Q2?", "ATP", "x + 3 = 7", "p = mv", "test fri", "cell wall", "1066", "√16 = 4", "→ energy", "ok!", "λ", "a² + b²", "mitosis"];

/** Old lessons, wiped but not quite gone. */
const ghosts = (seed: number): Ghost[] => {
  const r = seeded(seed);
  const [o0, o1] = E.ghost.opacity;
  return Array.from({ length: E.ghost.count }, (_, i) => {
    const x = 60 + r() * (W - 260);
    const y = 140 + r() * (H - 280);
    const blue = r() < 0.4;
    const o = o0 + r() * (o1 - o0);
    const k = r();
    if (k < 0.55) return { kind: "text" as const, x, y, text: GHOST_WORDS[(i + Math.floor(r() * 50)) % GHOST_WORDS.length], size: 44 + r() * 50, blue, o, rot: (r() - 0.5) * 10 };
    if (k < 0.75) {
      const rr = 40 + r() * 70;
      return { kind: "path" as const, d: `M ${x + rr} ${y} A ${rr} ${rr * 0.8} 0 1 1 ${x + rr - 1} ${y + 8}`, blue, o, w: 6 };
    }
    const len = 120 + r() * 160;
    const a = r() * Math.PI * 2;
    const [x2, y2] = [x + Math.cos(a) * len, y + Math.sin(a) * len];
    return { kind: "path" as const, d: `M ${x} ${y} L ${x2} ${y2} M ${x2 - Math.cos(a - 0.5) * 30} ${y2 - Math.sin(a - 0.5) * 30} L ${x2} ${y2} L ${x2 - Math.cos(a + 0.5) * 30} ${y2 - Math.sin(a + 0.5) * 30}`, blue, o, w: 6 };
  });
};

/**
 * The board: gradient, scuffs, micro-scratches, ghost marks, and the ink layer (multiplied through the dry-marker
 * mask). `children` go in the ink; `over` floats above it (markers, magnets, labels). Waits for the fonts.
 */
export const Board: React.FC<{ children: React.ReactNode; over?: React.ReactNode; ghostSeed?: number; under?: React.ReactNode; inset?: { x: number; y: number; w: number; h: number } }> = ({
  children,
  over,
  ghostSeed = 3,
  under,
  inset,
}) => {
  useFontsReady(FACES);
  const b = inset ?? { x: 0, y: 0, w: W, h: H };
  const gs = ghosts(ghostSeed).filter((g) => g.kind === "path" || (g.x > b.x && g.x < b.x + b.w - 150 && g.y > b.y + 60 && g.y < b.y + b.h - 40));
  const dry = E.dry;
  return (
    <AbsoluteFill style={{ backgroundColor: inset ? C.wall : C.board }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="wb-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.board} />
            <stop offset="1" stopColor={C.boardLow} />
          </linearGradient>
          <linearGradient id="wb-sheen" x1="0" y1="0" x2="1" y2="0.55">
            <stop offset="0.28" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity={E.sheen} />
            <stop offset="0.47" stopColor="#ffffff" stopOpacity={E.sheen * 0.45} />
            <stop offset="0.53" stopColor="#ffffff" stopOpacity={E.sheen * 0.8} />
            <stop offset="0.66" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <filter id="wb-scuff" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={3} seed={9} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.46  0 0 0 0 0.48  0 0 0 -2.2 1.3" />
          </filter>
          <filter id="wb-scratch" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.55" numOctaves={2} seed={13} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.52  0 0 0 9 -5.6" />
          </filter>
          <filter id="wb-dry" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.5 0.09" numOctaves={2} seed={5} />
            <feColorMatrix type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  10 0 0 0 ${-10 * dry.threshold}`} />
          </filter>
          <mask id="wb-ink" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="#ffffff" />
            <rect width={W} height={H} filter="url(#wb-dry)" opacity={dry.strength} />
          </mask>
          <filter id="wb-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={E.marker.shadow.blur} />
          </filter>
          <clipPath id="wb-boardclip">
            <rect x={b.x} y={b.y} width={b.w} height={b.h} />
          </clipPath>
        </defs>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="url(#wb-grad)" />
        <g clipPath="url(#wb-boardclip)">
          <rect width={W} height={H} filter="url(#wb-scuff)" opacity={0.06} />
          <rect width={W} height={H} filter="url(#wb-scratch)" opacity={0.05} transform={`rotate(-18 ${W / 2} ${H / 2})`} />
          {gs.map((g, i) =>
            g.kind === "text" ? (
              <text key={i} x={g.x} y={g.y} fontFamily={HANDWRITING} fontSize={g.size} fill={g.blue ? C.ghostBlue : C.ghost} opacity={g.o} transform={`rotate(${g.rot} ${g.x} ${g.y})`}>
                {g.text}
              </text>
            ) : (
              <path key={i} d={g.d} fill="none" stroke={g.blue ? C.ghostBlue : C.ghost} strokeWidth={g.w} strokeLinecap="round" opacity={g.o} />
            ),
          )}
          {under}
          <g mask="url(#wb-ink)" style={{ mixBlendMode: "multiply" }} opacity={E.ink}>
            {children}
          </g>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="url(#wb-sheen)" />
        </g>
        {over}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ marks

/** One marker stroke drawn on along its length (slow landing, fast middle, slow lift). */
export const Stroke: React.FC<{ pts: Pt[]; at: number; dur?: number; col?: string; width?: number; seed: number }> = ({ pts, at, dur, col = C.black, width = 9, seed }) => {
  const t = useSeconds();
  const hp = handPts(pts, seed);
  const len = strokeLength(hp);
  const d = dur ?? clamp(len / 900, 0.18, 0.9);
  const p = easeFor("stroke", t - at, d);
  if (p <= 0) return null;
  const n = Math.max(2, Math.ceil(hp.length * p));
  const part = hp.slice(0, n);
  const pool = len > E.stroke.pool ? hp[Math.min(hp.length - 1, 2)] : null;
  return (
    <g fill={col}>
      <path d={markerRibbon(part, width, hp.length, p >= 1)} />
      {pool ? <circle cx={pool[0]} cy={pool[1]} r={width * 0.42} fill={mix(col, "#000000", 0.35)} opacity={0.45} /> : null}
    </g>
  );
};

/** Several strokes one after another (an arrow, a box, a dashed line), sharing a time window. */
export const Strokes: React.FC<{ list: Pt[][]; at: number; dur?: number; col?: string; width?: number; seed: number }> = ({ list, at, dur, col, width, seed }) => {
  const lens = list.map((l) => strokeLength(l));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const d = dur ?? clamp(total / 900, 0.3, 1.6);
  let t0 = at;
  return (
    <>
      {list.map((l, i) => {
        const di = Math.max(0.08, (d * lens[i]) / total);
        const s = <Stroke key={i} pts={l} at={t0} dur={di} col={col} width={width} seed={seed + i * 7} />;
        t0 += di;
        return s;
      })}
    </>
  );
};

/** A rectangle as four strokes with small corner overshoot. */
export const boxStrokes = (x: number, y: number, w: number, h: number, o = 10): Pt[][] => [
  [[x - o * 0.6, y + 2], [x + w + o, y - 2]],
  [[x + w + 2, y - o * 0.6], [x + w - 2, y + h + o]],
  [[x + w + o * 0.5, y + h + 1], [x - o, y + h - 2]],
  [[x - 1, y + h + o * 0.4], [x + 2, y - o]],
];

/** An arrow: a shaft (straight or wavy) and two head strokes. */
export const arrowStrokes = (from: Pt, to: Pt, opts: { amp?: number; wl?: number; head?: number; bend?: number } = {}): Pt[][] => {
  const { amp = 0, wl = 50, head = 34, bend = 0 } = opts;
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const mid: Pt = [(from[0] + to[0]) / 2 - uy * bend, (from[1] + to[1]) / 2 + ux * bend];
  const shaft = amp ? wavePts(from, to, amp, wl) : bend ? quad(from, mid, to) : [from, to];
  const e = shaft[shaft.length - 1];
  const pre = shaft[Math.max(0, shaft.length - 4)];
  const a = Math.atan2(e[1] - pre[1], e[0] - pre[0]);
  return [
    shaft,
    [[e[0] - Math.cos(a - 0.5) * head, e[1] - Math.sin(a - 0.5) * head], e],
    [e, [e[0] - Math.cos(a + 0.5) * head, e[1] - Math.sin(a + 0.5) * head]],
  ];
};

/** A dashed line: separate short strokes. */
export const dashStrokes = (from: Pt, to: Pt, dash = 34, gap = 22): Pt[][] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const out: Pt[][] = [];
  for (let s = 0; s < L - 6; s += dash + gap) {
    const e = Math.min(L, s + dash);
    out.push([
      [from[0] + ux * s, from[1] + uy * s],
      [from[0] + ux * e, from[1] + uy * e],
    ]);
  }
  return out;
};

/** Handwritten words: real type, glyphs tilted ±2°, baseline and scale ±3.5%, written on left to right. */
export const Write: React.FC<{
  text: string;
  x: number;
  y: number;
  size: number;
  at: number;
  dur?: number;
  col?: string;
  anchor?: "start" | "middle";
  seed?: number;
}> = ({ text, x, y, size, at, dur, col = C.black, anchor = "start", seed = 1 }) => {
  const id = useSvgId("wbw");
  const t = useSeconds();
  const d = dur ?? clamp(text.length * 0.05, 0.3, 1.6);
  const p = easeFor("write", t - at, d);
  if (p <= 0) return null;
  const est = text.length * size * T.charEm;
  const x0 = anchor === "middle" ? x - est / 2 : x;
  const r = seeded(seed * 911);
  let prev = 0;
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={x0 - size} y={y - size * 1.3} width={p >= 0.995 ? W * 2 : size + est * 1.15 * p} height={size * 1.9} />
        </clipPath>
      </defs>
      <text x={x} y={y} fontFamily={HANDWRITING} fontSize={size} fill={col} textAnchor={anchor} clipPath={`url(#${id})`} style={{ whiteSpace: "pre" }}>
        {Array.from(text).map((ch, i) => {
          const tilt = (r() - 0.5) * 2 * E.glyph.tilt;
          const off = (r() - 0.5) * 2 * E.glyph.baseline * size;
          const sc = 1 + (r() - 0.5) * 2 * E.glyph.scale;
          const dy = off - prev;
          prev = off;
          return (
            <tspan key={i} rotate={tilt.toFixed(2)} dy={dy.toFixed(2)} fontSize={(size * sc).toFixed(1)}>
              {ch}
            </tspan>
          );
        })}
      </text>
    </>
  );
};

// ------------------------------------------------------------------ props (float above the ink)

export type PenMove = { at: number; dur: number; from: Pt; to: Pt; col: string };

const lerpPt = (p: Pt, q: Pt, k: number): Pt => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
const PARK: Pt = [W + 300, H * 0.42];

/**
 * The one floating marker in use (no hand): it follows each move, hops between moves of its colour, swaps with the
 * next colour's marker through the frame edge, and parks off-frame `hold` seconds after the last move.
 */
export const Pen: React.FC<{ moves: PenMove[]; hold?: number }> = ({ moves, hold = 0.75 }) => {
  const t = useSeconds();
  if (!moves.length) return null;
  const hop = S.motion.recipes.hop.duration;
  const next = moves.findIndex((m) => t < m.at);
  const cur = next === -1 ? moves.length - 1 : next - 1;
  if (cur < 0) {
    const k = ease("hop", t - (moves[0].at - hop));
    return <MarkerBody tip={lerpPt(PARK, moves[0].from, k)} col={moves[0].col} lift={1 - k} />;
  }
  const m = moves[cur];
  const n = moves[cur + 1];
  const end = m.at + m.dur;
  if (t <= end) return <MarkerBody tip={lerpPt(m.from, m.to, easeFor("stroke", t - m.at, m.dur))} col={m.col} lift={0} />;
  if (n && n.col === m.col) {
    const k = clamp((t - end) / Math.max(0.01, n.at - end));
    return <MarkerBody tip={lerpPt(m.to, n.from, easeFor("hop", k, 1))} col={m.col} lift={Math.sin(Math.PI * k)} />;
  }
  if (n) {
    const k = clamp((t - end) / Math.max(0.01, n.at - end));
    return k < 0.5 ? <MarkerBody tip={lerpPt(m.to, PARK, easeFor("hop", k * 2, 1))} col={m.col} lift={1} /> : <MarkerBody tip={lerpPt(PARK, n.from, easeFor("hop", k * 2 - 1, 1))} col={n.col} lift={1} />;
  }
  // after the last move it lifts off the word it finished (down and to the right, clear of the ink), then parks
  const away = ease("hop", t - end);
  const rest: Pt = [m.to[0] + 110 * away, m.to[1] + 40 * away];
  const k = ease("hop", t - (end + hold));
  return <MarkerBody tip={lerpPt(rest, PARK, k)} col={m.col} lift={k > 0 ? 1 : away * 0.6} />;
};

/** A marker lying still (on the tray). */
export const Marker: React.FC<{ at: Pt; col: string; angle?: number }> = ({ at, col, angle = 0 }) => <MarkerBody tip={at} col={col} lift={0.1} angle={angle} />;

/** A dry-erase marker: white barrel, a colour band and posted cap in its ink colour, a felt nib, a cast shadow. */
const MarkerBody: React.FC<{ tip: Pt; col: string; lift: number; angle?: number }> = ({ tip, col, lift, angle = -58 }) => {
  const L = E.marker.length;
  const w = E.marker.width;
  const a = (angle * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const pt = (s: number, o: number): Pt => [tip[0] + ux * s + nx * o, tip[1] + uy * s + ny * o];
  const poly = (ps: Pt[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const sh = E.marker.shadow;
  const shadowK = 0.6 + 0.8 * lift;
  const shadowPt = (s: number, o: number): Pt => {
    const p = pt(s, o);
    const k = (s / L) * shadowK;
    return [p[0] + sh.dx * k * 2, p[1] + sh.dy * k * 2];
  };
  const outline = (f: (s: number, o: number) => Pt) => poly([f(0, -3), f(20, -8), f(44, -w / 2), f(L, -w / 2), f(L + 6, -w / 2 + 6), f(L + 6, w / 2 - 6), f(L, w / 2), f(44, w / 2), f(20, 8), f(0, 3)]);
  return (
    <g>
      <polygon points={outline(shadowPt)} fill="#000" opacity={sh.opacity * (1 - 0.3 * lift)} filter="url(#wb-shadow)" />
      <polygon points={poly([pt(0, -3), pt(22, -8), pt(22, 8), pt(0, 3)])} fill={mix(col, "#000000", 0.25)} />
      <polygon points={poly([pt(22, -9), pt(46, -w / 2), pt(46, w / 2), pt(22, 9)])} fill="#e4e4df" />
      <polygon points={poly([pt(46, -w / 2), pt(L - 86, -w / 2), pt(L - 86, w / 2), pt(46, w / 2)])} fill="#f6f6f2" />
      <polygon points={poly([pt(46, w / 2 - 8), pt(L - 86, w / 2 - 8), pt(L - 86, w / 2), pt(46, w / 2)])} fill="#d9d9d3" />
      <polygon points={poly([pt(46, -w / 2), pt(L - 86, -w / 2), pt(L - 86, -w / 2 + 6), pt(46, -w / 2 + 6)])} fill="#ffffff" />
      <polygon points={poly([pt(110, -w / 2), pt(142, -w / 2), pt(142, w / 2), pt(110, w / 2)])} fill={col} />
      <polygon points={poly([pt(L - 92, -w / 2 - 3), pt(L + 4, -w / 2 - 3), pt(L + 10, -w / 2 + 6), pt(L + 10, w / 2 - 6), pt(L + 4, w / 2 + 3), pt(L - 92, w / 2 + 3)])} fill={col} />
      <polygon points={poly([pt(L - 92, w / 2 - 6), pt(L + 6, w / 2 - 6), pt(L + 4, w / 2 + 3), pt(L - 92, w / 2 + 3)])} fill="#000" opacity={0.18} />
    </g>
  );
};

/** The glossy orange map-pin magnet: dropped on the point that matters. */
export const Magnet: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const id = useSvgId("wbm");
  const p = ease("magnet", useSeconds() - at);
  if (p <= 0) return null;
  const r = E.magnet.r;
  const s = lerp(1.35, 1, p);
  const sh = lerp(3, 1, p);
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor={mix(C.orange, "#ffffff", 0.45)} />
          <stop offset="0.55" stopColor={C.orange} />
          <stop offset="1" stopColor={mix(C.orange, "#000000", 0.38)} />
        </radialGradient>
      </defs>
      <ellipse cx={x + 7 * sh} cy={y + 11 * sh} rx={r * s} ry={r * s * 0.92} fill="#000" opacity={0.22 / sh} filter="url(#wb-shadow)" />
      <circle cx={x} cy={y} r={r * s} fill={`url(#${id})`} />
      <ellipse cx={x - r * 0.32 * s} cy={y - r * 0.36 * s} rx={r * 0.26 * s} ry={r * 0.17 * s} fill="#ffffff" opacity={0.85} transform={`rotate(-30 ${x - r * 0.32 * s} ${y - r * 0.36 * s})`} />
      <circle cx={x + r * 0.08 * s} cy={y + r * 0.05 * s} r={r * 0.12 * s} fill="#ffffff" opacity={0.9} />
    </g>
  );
};

/** The burned-in subtitle: dark handwriting on an off-white rounded label at 90%, a short orange dash bottom-left. */
export const Subtitle: React.FC<{ lines: string[]; y: number; at: number }> = ({ lines, y, at }) => {
  const t = useSeconds();
  const p = clamp((t - at) / 0.2);
  if (p <= 0) return null;
  const size = T.body;
  const lab = E.label;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.5 + lab.padX * 2;
  const h = lines.length * size * 1.3 + lab.padY * 2;
  const x = M;
  return (
    <g opacity={p}>
      <rect x={x} y={y} width={w} height={h} rx={lab.radius} fill={C.label} opacity={lab.opacity} />
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={lab.radius} fill="none" stroke="#000" strokeOpacity={0.05} strokeWidth={3} />
      <path d={`M ${x + 22} ${y + h - 12} L ${x + 22 + lab.dash} ${y + h - 15}`} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
      {lines.map((l, i) => (
        <text key={i} x={x + lab.padX} y={y + lab.padY + size * 1.02 + i * size * 1.3} fontFamily={HANDWRITING} fontSize={size} fill={C.black}>
          {l}
        </text>
      ))}
    </g>
  );
};

export { HANDWRITING };
