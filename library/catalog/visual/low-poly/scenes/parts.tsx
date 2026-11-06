/**
 * Low-poly's pieces: a small orthographic 3D engine drawn as flat SVG polygons (azimuth 45°, elevation 30°), hex
 * columns, box houses with gable roofs, cone pines, icospheres, faceted water, the sunlight ribbon, the time-of-day
 * colour keyframes, titles whose letters rise from a water line, subtitles with the hex icon. Every value comes from
 * style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, rgba, run, springAt, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
const P = style.palette;
export const col = (role: string) => color(P, role);
export const C = {
  text: col("text"),
  ink: col("ink"),
  muted: col("muted"),
  faint: col("faint"),
  red: col("accent"),
  blue: col("accent2"),
  blueLight: col("wall-4"),
  sand: col("sand"),
  sandSide: col("sand-side"),
  grass: col("grass"),
  grass2: col("grass-2"),
  earth: col("earth"),
  rock: col("faint"),
  rockSide: col("muted"),
  pine: col("pine"),
  pine2: col("pine-2"),
  leaf: col("leaf"),
  leaf2: col("leaf-2"),
  window: col("window"),
  white: col("lighthouse"),
  yellow: col("wall-5"),
  orange: col("roof-3"),
  violet: col("roof-4"),
  teal: col("roof-5"),
  sunlight: col("sunlight"),
};
export const WALLS = [1, 2, 3, 4, 5, 6].map((i) => col(`wall-${i}`));
export const ROOFS = [C.red, C.blue, C.orange, C.violet, C.teal];
/** The six colours of sunlight in the island's pastel set. */
export const SPECTRUM = [C.red, C.orange, C.yellow, C.grass, C.blue, C.violet];

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export type TimeKey = keyof typeof style.times;
export const TIME = style.times;

/** Deterministic 0..1 noise. */
export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const hexRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (c: number[]): string => `#${c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
export const mix = (a: string, b: string, k: number): string => {
  const x = hexRgb(a);
  const y = hexRgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * k));
};

/** The arrival curves: rise (cubic ease up, then sin(13s)·e^(−7s)·0.18 overshoot) and pop (a damped spring). */
export const riseK = (t: number, name: "rise" | "letter" = "rise"): number => {
  const r = R[name];
  if (t <= 0) return 0;
  if (t < r.duration) return ease(name, t);
  const s = t - r.duration;
  return 1 + r.amp * Math.sin(r.freq * s) * Math.exp(-r.decay * s);
};
export const popK = (t: number): number => (t <= 0 ? 0 : springAt(t, R.pop));

// ---------------------------------------------------------------- the camera and the light

export type V3 = [number, number, number];
export type View = { cx: number; cy: number; s: number };
const rad = (d: number) => (d * Math.PI) / 180;
const AZ = rad(E.camera.azimuth);
const EL = rad(E.camera.elevation);
const VIEWDIR: V3 = [Math.sin(AZ) * Math.cos(EL), Math.cos(AZ) * Math.cos(EL), Math.sin(EL)];

/** Orthographic projection: world (x, y, z up) → screen px. */
export const project = (p: V3, v: View): [number, number] => {
  const u = p[0] * Math.cos(AZ) - p[1] * Math.sin(AZ);
  const w = p[0] * Math.sin(AZ) + p[1] * Math.cos(AZ);
  return [v.cx + u * v.s, v.cy + (w * Math.sin(EL) - p[2] * Math.cos(EL)) * v.s];
};
/** Larger = nearer the camera. */
export const depthOf = (p: V3): number => (p[0] * Math.sin(AZ) + p[1] * Math.cos(AZ)) * Math.cos(EL) + p[2] * Math.sin(EL);
/** The screen point → the world point on the plane z = 0 (to place things under a screen position). */
export const unproject = (x: number, y: number, z: number, v: View): V3 => {
  const u = (x - v.cx) / v.s;
  const w = ((y - v.cy) / v.s + z * Math.cos(EL)) / Math.sin(EL);
  return [u * Math.cos(AZ) + w * Math.sin(AZ), -u * Math.sin(AZ) + w * Math.cos(AZ), z];
};

export type Light = { L: V3; k: number; sun: string; haze: string };
export const lightFor = (time: TimeKey): Light => {
  const t = TIME[time];
  const e = rad(t.elevation);
  const a = rad(t.azimuth);
  return { L: [Math.sin(a) * Math.cos(e), Math.cos(a) * Math.cos(e), Math.sin(e)], k: t.intensity, sun: t.sun, haze: t.zenith };
};
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Flat shading: ambient + diffuse·max(0, n·L), tinted by the sun's colour and a little of the sky. */
export const shade = (base: string, n: V3, li: Light): string => {
  const lt = E.light;
  const f = (lt.ambient + lt.diffuse * Math.max(0, dot(n, li.L))) * (0.5 + 0.5 * li.k);
  const b = hexRgb(base);
  const s = hexRgb(li.sun);
  const lit = b.map((v, i) => v * f * (1 - 0.3 + (0.3 * s[i]) / 255));
  return mix(toHex(lit), li.haze, lt.haze);
};

// ---------------------------------------------------------------- meshes

/** One flat face: its points, its base colour, its outward normal; `glow` faces skip shading (windows). */
export type Face = { pts: V3[]; col: string; n: V3; glow?: boolean };
/** An object: faces drawn together, ordered against other objects by `at`. */
export type Obj = { faces: Face[]; at: V3 };

const faceN = (pts: V3[]): V3 => norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));

/** Axial hex (q, r) → world centre. */
export const hexXY = (q: number, r: number, size = E.tile.r): [number, number] => [Math.sqrt(3) * (q + r / 2) * size, 1.5 * r * size];
export const hexRing = (cx: number, cy: number, r: number, z: number): V3[] =>
  Array.from({ length: 6 }, (_, k) => {
    const a = rad(30 + 60 * k);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3;
  });

/** A pointy-top hex column from z0 to z0 + h: a cap `tile.cap` thick in the top colour over a column in the side colour. */
export const hexColumn = (cx: number, cy: number, h: number, top: string, side: string, z0 = 0, size = E.tile.r): Obj => {
  const r = size * (1 - E.tile.gap);
  const capH = Math.min(E.tile.cap, h);
  const zt = z0 + h;
  const zc = zt - capH;
  const faces: Face[] = [];
  const ringT = hexRing(cx, cy, r, zt);
  const ringC = hexRing(cx, cy, r, zc);
  const ringB = hexRing(cx, cy, r * 0.97, z0 - 0.3);
  const ringCi = hexRing(cx, cy, r * 0.97, zc);
  faces.push({ pts: ringT, col: top, n: [0, 0, 1] });
  for (let k = 0; k < 6; k++) {
    const k2 = (k + 1) % 6;
    const a = rad(30 + 60 * k + 30);
    const n: V3 = [Math.cos(a), Math.sin(a), 0];
    faces.push({ pts: [ringT[k], ringT[k2], ringC[k2], ringC[k]], col: top, n });
    if (zc > z0 - 0.3) faces.push({ pts: [ringCi[k], ringCi[k2], ringB[k2], ringB[k]], col: side, n });
  }
  return { faces, at: [cx, cy, z0] };
};

/** A box (x, y centre; w along x, d along y), with optional window quads on the faces seen from the camera. */
export const box = (cx: number, cy: number, z0: number, w: number, d: number, h: number, colr: string, windows?: string): Face[] => {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - d / 2;
  const y1 = cy + d / 2;
  const z1 = z0 + h;
  const faces: Face[] = [
    { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col: colr, n: [0, 0, 1] },
    { pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], col: colr, n: [1, 0, 0] },
    { pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], col: colr, n: [0, 1, 0] },
    { pts: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], col: colr, n: [-1, 0, 0] },
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col: colr, n: [0, -1, 0] },
  ];
  if (windows) {
    const wz0 = z0 + h * 0.35;
    const wz1 = z0 + h * 0.7;
    const ww = Math.min(w, d) * 0.18;
    faces.push({ pts: [[x1 + 0.005, cy - ww, wz0], [x1 + 0.005, cy + ww, wz0], [x1 + 0.005, cy + ww, wz1], [x1 + 0.005, cy - ww, wz1]], col: windows, n: [1, 0, 0], glow: true });
    faces.push({ pts: [[cx - ww, y1 + 0.005, wz0], [cx + ww, y1 + 0.005, wz0], [cx + ww, y1 + 0.005, wz1], [cx - ww, y1 + 0.005, wz1]], col: windows, n: [0, 1, 0], glow: true });
  }
  return faces;
};

/** A house: a box with a gable-prism roof (ridge along x, overhang 0.08). */
export const house = (cx: number, cy: number, z0: number, s: number, wall: string, roof: string, windows?: string): Obj => {
  const w = 0.62 * s;
  const d = 0.56 * s;
  const h = 0.5 * s;
  const o = 0.08 * s;
  const zr = z0 + h;
  const zt = zr + 0.34 * s;
  const x0 = cx - w / 2 - o;
  const x1 = cx + w / 2 + o;
  const y0 = cy - d / 2 - o;
  const y1 = cy + d / 2 + o;
  const faces = box(cx, cy, z0, w, d, h, wall, windows);
  const slope1: V3[] = [[x0, y1, zr], [x1, y1, zr], [x1, cy, zt], [x0, cy, zt]];
  const slope2: V3[] = [[x0, y0, zr], [x0, cy, zt], [x1, cy, zt], [x1, y0, zr]];
  faces.push({ pts: slope1, col: roof, n: norm([0, 0.34, 0.5 * 0.56]) });
  faces.push({ pts: slope2, col: roof, n: norm([0, -0.34, 0.5 * 0.56]) });
  faces.push({ pts: [[cx + w / 2, cy - d / 2, zr], [cx + w / 2, cy + d / 2, zr], [cx + w / 2, cy, zt - 0.04 * s]], col: wall, n: [1, 0, 0] });
  faces.push({ pts: [[cx - w / 2, cy + d / 2, zr], [cx - w / 2, cy - d / 2, zr], [cx - w / 2, cy, zt - 0.04 * s]], col: wall, n: [-1, 0, 0] });
  return { faces, at: [cx, cy, z0] };
};

/** A cone (6 sides by default) with a short trunk: a pine. */
export const cone = (cx: number, cy: number, z0: number, r: number, h: number, colr: string, sides = 6, trunk = C.earth): Obj => {
  const faces: Face[] = [...box(cx, cy, z0, r * 0.3, r * 0.3, h * 0.2, trunk)];
  const apex: V3 = [cx, cy, z0 + h];
  const zb = z0 + h * 0.18;
  for (let k = 0; k < sides; k++) {
    const a0 = (2 * Math.PI * k) / sides + 0.3;
    const a1 = (2 * Math.PI * (k + 1)) / sides + 0.3;
    const p0: V3 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0), zb];
    const p1: V3 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1), zb];
    faces.push({ pts: [p0, p1, apex], col: colr, n: faceN([p0, p1, apex]) });
  }
  return { faces, at: [cx, cy, z0] };
};

const ICO_V: V3[] = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  return (
    [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1],
    ] as V3[]
  ).map(norm);
})();
const ICO_F = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];
const icoTris = (detail: number): V3[][] => {
  let tris: V3[][] = ICO_F.map((f) => f.map((i) => ICO_V[i]));
  for (let d = 0; d < detail; d++) {
    const next: V3[][] = [];
    for (const [a, b, c] of tris) {
      const ab = norm([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
      const bc = norm([(b[0] + c[0]) / 2, (b[1] + c[1]) / 2, (b[2] + c[2]) / 2]);
      const ca = norm([(c[0] + a[0]) / 2, (c[1] + a[1]) / 2, (c[2] + a[2]) / 2]);
      next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
    }
    tris = next;
  }
  return tris;
};
const ICO = [icoTris(0), icoTris(1)];

/** An icosphere (detail 0 = 20 faces, 1 = 80), turned by `spin` around z and `tilt` around x; `cols` alternate by face. */
export const ico = (c: V3, r: number, cols: string[], detail = 1, spin = 0, tilt = 0.4): Obj => {
  const rot = (p: V3): V3 => {
    const x1 = p[0] * Math.cos(spin) - p[1] * Math.sin(spin);
    const y1 = p[0] * Math.sin(spin) + p[1] * Math.cos(spin);
    const y2 = y1 * Math.cos(tilt) - p[2] * Math.sin(tilt);
    const z2 = y1 * Math.sin(tilt) + p[2] * Math.cos(tilt);
    return [x1, y2, z2];
  };
  const faces: Face[] = ICO[detail].map((tri, i) => {
    const pts = tri.map(rot);
    const n = norm([pts[0][0] + pts[1][0] + pts[2][0], pts[0][1] + pts[1][1] + pts[2][1], pts[0][2] + pts[1][2] + pts[2][2]]);
    return { pts: pts.map((p) => [c[0] + p[0] * r, c[1] + p[1] * r, c[2] + p[2] * r] as V3), col: cols[i % cols.length], n };
  });
  return { faces, at: [c[0], c[1], c[2] - r] };
};

/** A broadleaf tree: an icosahedron crown (detail 0) on a box trunk. */
export const tree = (cx: number, cy: number, z0: number, s: number, cols = [C.leaf, C.leaf2]): Obj => {
  const crown = ico([cx, cy, z0 + 0.62 * s], 0.34 * s, cols, 0, cx * 1.3, 0.5);
  return { faces: [...box(cx, cy, z0, 0.1 * s, 0.1 * s, 0.4 * s, C.earth), ...crown.faces], at: [cx, cy, z0] };
};

/** A lighthouse: four tapered 8-sided rings, white and red, with a lamp. */
export const lighthouse = (cx: number, cy: number, z0: number, s: number, lamp?: string): Obj => {
  const faces: Face[] = [];
  const rings = 4;
  for (let i = 0; i < rings; i++) {
    const za = z0 + (i * 0.36 + 0) * s;
    const zb = za + 0.36 * s;
    const ra = (0.3 - i * 0.04) * s;
    const rb = (0.3 - (i + 1) * 0.04) * s;
    for (let k = 0; k < 8; k++) {
      const a0 = (2 * Math.PI * k) / 8;
      const a1 = (2 * Math.PI * (k + 1)) / 8;
      const pts: V3[] = [
        [cx + ra * Math.cos(a0), cy + ra * Math.sin(a0), za],
        [cx + ra * Math.cos(a1), cy + ra * Math.sin(a1), za],
        [cx + rb * Math.cos(a1), cy + rb * Math.sin(a1), zb],
        [cx + rb * Math.cos(a0), cy + rb * Math.sin(a0), zb],
      ];
      faces.push({ pts, col: i % 2 === 0 ? C.white : C.red, n: norm([Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0.1]) });
    }
  }
  faces.push(...box(cx, cy, z0 + 1.44 * s, 0.22 * s, 0.22 * s, 0.18 * s, lamp ?? C.white).map((f) => ({ ...f, glow: !!lamp })));
  faces.push(...cone(cx, cy, z0 + 1.62 * s, 0.17 * s, 0.2 * s, C.red, 8, C.red).faces.slice(5));
  return { faces, at: [cx, cy, z0] };
};

/** A small tetrahedron shard (scattered light). */
export const shard = (c: V3, r: number, cols: string[], spin: number): Obj => ico(c, r, cols, 0, spin, spin * 0.7);

/** Draws objects back to front (painter's order), each object's faces back to front; back faces are culled. */
export const Scene3D: React.FC<{ objs: Obj[]; view: View; light: Light; bloom?: number }> = ({ objs, view, light, bloom = 0 }) => {
  const sorted = [...objs].sort((a, b) => depthOf(a.at) - depthOf(b.at));
  const polys: React.ReactNode[] = [];
  const glows: React.ReactNode[] = [];
  let key = 0;
  for (const o of sorted) {
    const fs = o.faces
      .filter((f) => dot(f.n, VIEWDIR) > 0.0001)
      .map((f) => ({ f, d: depthOf([f.pts.reduce((s, p) => s + p[0], 0) / f.pts.length, f.pts.reduce((s, p) => s + p[1], 0) / f.pts.length, f.pts.reduce((s, p) => s + p[2], 0) / f.pts.length]) }))
      .sort((a, b) => a.d - b.d);
    for (const { f } of fs) {
      const pts = f.pts.map((p) => project(p, view).map((v) => v.toFixed(1)).join(",")).join(" ");
      const fill = f.glow ? f.col : shade(f.col, f.n, light);
      polys.push(<polygon key={key++} points={pts} fill={fill} stroke={fill} strokeWidth={0.6} strokeLinejoin="round" />);
      if (f.glow && bloom > 0) glows.push(<polygon key={key++} points={pts} fill={f.col} />);
    }
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="lp-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {polys}
      {glows.length ? (
        <g filter="url(#lp-bloom)" opacity={clamp(bloom * 1.6)} style={{ mixBlendMode: "screen" }}>
          {glows}
        </g>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------- the world: sky, water, surf

/** The sky: zenith to horizon down to `band`, then the water starts. Waits for the fonts. */
export const World: React.FC<{ time: TimeKey; band?: number; children: React.ReactNode; stars?: boolean }> = ({ time, band = style.layout.skyBand, children, stars = false }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const k = TIME[time];
  return (
    <AbsoluteFill style={{ backgroundColor: k.zenith, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${k.zenith} 0px, ${k.zenith} ${band * 0.25}px, ${k.horizon} ${band}px)` }} />
      {stars ? <Stars band={band} t={t} /> : null}
      <Water top={band} time={time} t={t} />
      {children}
    </AbsoluteFill>
  );
};

const Stars: React.FC<{ band: number; t: number }> = ({ band, t }) => {
  const step = Math.floor(t * 6);
  return (
    <svg width={W} height={band} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: E.stars }, (_, i) => {
        const x = rnd(i, 1) * W;
        const y = rnd(i, 2) * band * 0.92;
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7 + step * 0.9));
        return <rect key={i} x={x} y={y} width={i % 5 === 0 ? 5 : 3} height={i % 5 === 0 ? 5 : 3} fill={C.text} opacity={tw * (y < band * 0.7 ? 1 : 0.5)} />;
      })}
    </svg>
  );
};

/**
 * Faceted water in screen space: a triangle lattice whose points ride four summed sines; each triangle is one flat
 * colour between deep and shallow by its slope, hazed toward the horizon near the top.
 */
export const Water: React.FC<{ top: number; time: TimeKey; t: number }> = ({ top, time, t }) => {
  const k = TIME[time];
  const wv = E.water;
  const cell = wv.cell;
  const hh = cell * 0.866;
  const rows = Math.ceil((H - top) / hh) + 2;
  const cols = Math.ceil(W / cell) + 3;
  const ht = (i: number, j: number) =>
    Math.sin(i * 0.9 + t * 1.3) * 0.45 + Math.sin(j * 1.3 - t * 1.1) * 0.3 + Math.sin((i + j) * 0.55 + t * 0.7) * 0.15 + Math.sin((i - j) * 0.8 + t * 0.9) * 0.1;
  const pt = (i: number, j: number): [number, number, number] => {
    const x = (j - 1) * cell + (i % 2 ? cell / 2 : 0);
    const h = ht(i, j);
    return [x, top + (i - 0.5) * hh + h * wv.amp, h];
  };
  const tris: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const a = pt(i, j);
      const b = pt(i, j + 1);
      const c2 = i % 2 ? pt(i + 1, j + 1) : pt(i + 1, j);
      const d = i % 2 ? pt(i + 1, j + 2) : pt(i + 1, j + 1);
      const draw = (p: number[][], key: string) => {
        const slope = (p[0][2] + p[1][2] - 2 * p[2][2]) * 0.5 + (p[0][2] - p[1][2]) * 0.3;
        const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
        const far = clamp(1 - (yMid - top) / (H * 0.45));
        let fill = mix(k.deep, k.shallow, clamp(0.35 + slope * 0.45));
        fill = mix(fill, k.horizon, far * far * wv.haze);
        tris.push(<polygon key={key} points={p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ")} fill={fill} stroke={fill} strokeWidth={0.8} />);
      };
      draw([a, b, c2], `${i}-${j}-a`);
      draw([b, d, c2], `${i}-${j}-b`);
    }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {tris}
    </svg>
  );
};

/** The surf ring: a pale hexagon 1.12 × the tile at sea level under each coastal tile. */
export const Surf: React.FC<{ tiles: { x: number; y: number; k: number }[]; view: View }> = ({ tiles, view }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {tiles.map((tl, i) => (
      <polygon
        key={i}
        points={hexRing(tl.x, tl.y, E.tile.r * E.surf.scale * clamp(tl.k), 0)
          .map((p) => project(p, view).map((v) => v.toFixed(1)).join(","))
          .join(" ")}
        fill={C.text}
        opacity={E.surf.alpha}
      />
    ))}
  </svg>
);

/** The sunlight ribbon: a soft core plus a halo 2.4× wider at 0.32, from a to b (screen px), drawn to fraction p. */
export const Ribbon: React.FC<{ a: [number, number]; b: [number, number]; p: number; colr?: string; width?: number; id: string }> = ({ a, b, p, colr = C.sunlight, width = E.ribbon.width, id }) => {
  if (p <= 0) return null;
  const x = a[0] + (b[0] - a[0]) * p;
  const y = a[1] + (b[1] - a[1]) * p;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={width * 0.35} />
        </filter>
        <filter id={`${id}-halo`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={width * 0.9} />
        </filter>
      </defs>
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={colr} strokeWidth={width * E.ribbon.halo} strokeLinecap="round" opacity={E.ribbon.haloAlpha} filter={`url(#${id}-halo)`} />
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={colr} strokeWidth={width} strokeLinecap="round" filter={`url(#${id}-soft)`} />
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={colr} strokeWidth={width * 0.4} strokeLinecap="round" />
    </svg>
  );
};

// ---------------------------------------------------------------- type

const textCol = (time: TimeKey) => (TIME[time].text === "ink" ? C.ink : C.text);
const emCol = (time: TimeKey) => (TIME[time].text === "ink" ? C.blue : C.window);
const softShadow = (over: "light" | "dark") =>
  over === "dark" ? `0 3px ${style.type.shadowBlur}px ${rgba(C.ink, style.type.shadowAlpha)}, 0 1px 3px ${rgba(C.ink, 0.35)}` : "none";

/**
 * A title: Josefin Sans 600 capitals, tracked 0.2 em. Letters rise one by one from under a thin water line, overshoot
 * and settle (letter recipe). `time` picks the colour: ink on a light sky, warm white with a navy shadow on a dark one.
 */
export const Title: React.FC<{ lines: string[]; size: number; y: number; at?: number; time: TimeKey; over?: "sky" | "water"; tracking?: number }> = ({
  lines,
  size,
  y,
  at = 0,
  time,
  over = "sky",
  tracking = style.type.tracking,
}) => {
  const t = useSeconds() - at;
  const lh = size * style.type.leading;
  const dark = over === "water" || TIME[time].text === "text";
  const fg = over === "water" ? C.text : textCol(time);
  const em = over === "water" ? C.window : emCol(time);
  let i = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: size, letterSpacing: `${tracking}em`, color: fg }}>
      {lines.map((line, li) => {
        const parts = line.split("*");
        return (
          <div key={li} style={{ position: "relative", height: lh, overflow: "hidden", paddingTop: size * 0.12 }}>
            <div style={{ lineHeight: `${lh}px`, whiteSpace: "pre", textShadow: softShadow(dark ? "dark" : "light"), marginRight: `-${tracking}em` }}>
              {parts.map((part, k) =>
                [...part.toUpperCase()].map((ch, ci) => {
                  const p = riseK(t - i * R.letter.stagger, "letter");
                  i += 1;
                  return (
                    <span key={`${k}-${ci}`} style={{ display: "inline-block", transform: `translateY(${(1 - p) * lh}px)`, color: k % 2 === 1 ? em : fg }}>
                      {ch}
                    </span>
                  );
                }),
              )}
            </div>
            <div style={{ position: "absolute", left: "50%", bottom: 0, width: Math.min(W - 2 * M, size * 5), height: 2, transform: "translateX(-50%)", backgroundColor: fg, opacity: 0.35 }} />
          </div>
        );
      })}
    </div>
  );
};

/** The lower-case sub-line under a title: Josefin Sans 300. */
export const SubLine: React.FC<{ text: string; y: number; at?: number; time: TimeKey; size?: number }> = ({ text, y, at = 0, time, size = style.type.sub }) => {
  const p = ease("subtitle", useSeconds() - at);
  if (p <= 0) return null;
  const dark = TIME[time].text === "text";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 300,
        fontSize: size,
        letterSpacing: `${style.type.subTracking}em`,
        color: textCol(time),
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        textShadow: softShadow(dark ? "dark" : "light"),
      }}
    >
      {text.toLowerCase()}
    </div>
  );
};

/** The small flat-shaded hex icon whose top follows the time of day. */
export const HexIcon: React.FC<{ time: TimeKey; size?: number }> = ({ time, size = E.icon }) => {
  const top = TIME[time].icon;
  const r = size / 2;
  const pts = (cy: number) => Array.from({ length: 6 }, (_, k) => [r + r * Math.cos(rad(60 * k + 30)), cy + r * 0.55 * Math.sin(rad(60 * k + 30))]);
  const t = pts(r * 0.6);
  const b = pts(r * 1.3);
  const poly = (p: number[][]) => p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ");
  return (
    <svg width={size} height={size * 1.15} style={{ display: "inline-block", verticalAlign: "middle", marginRight: size * 0.45, overflow: "visible" }}>
      <polygon points={poly([t[0], t[1], b[1], b[0]])} fill={mix(top, "#000000", 0.18)} />
      <polygon points={poly([t[1], t[2], t[3], b[3], b[2], b[1]])} fill={mix(top, "#000000", 0.3)} />
      <polygon points={poly(t)} fill={top} />
    </svg>
  );
};

/**
 * A subtitle: Quicksand 600 in warm white over the water, no box, a soft navy drop shadow (blur 14), centred, with the
 * hex icon beside the first line. Shown just before its line is spoken.
 */
export const Subtitle: React.FC<{ lines: string[]; y: number; at?: number; time: TimeKey; size?: number; kicker?: string }> = ({ lines, y, at = 0, time, size = style.type.body, kicker }) => {
  const p = ease("subtitle", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: M, right: M, top: y, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 12}px)`, color: C.text, textShadow: softShadow("dark") }}>
      {kicker ? (
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: style.type.label, letterSpacing: `${style.type.tracking}em`, marginBottom: 14 }}>{kicker.toUpperCase()}</div>
      ) : null}
      {lines.map((line, i) => (
        <div key={i} style={{ fontFamily: BODY, fontWeight: 600, fontSize: size, lineHeight: 1.3, whiteSpace: "nowrap" }}>
          {i === 0 ? <HexIcon time={time} /> : null}
          {line}
        </div>
      ))}
    </div>
  );
};

/** Free-standing subtitle text (labels, list rows): the subtitle's face, colour and shadow, placed by its box. */
export const Caption: React.FC<{ lines: string[]; x: number; y: number; w: number; align?: "left" | "center"; at?: number; size?: number; time: TimeKey; icon?: boolean }> = ({
  lines,
  x,
  y,
  w,
  align = "left",
  at = 0,
  size = style.type.body,
  time,
  icon = false,
}) => {
  const p = ease("subtitle", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, width: w, top: y, textAlign: align, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, color: C.text, textShadow: softShadow("dark") }}>
      {lines.map((line, i) => (
        <div key={i} style={{ fontFamily: BODY, fontWeight: 600, fontSize: size, lineHeight: 1.3, whiteSpace: "nowrap" }}>
          {icon && i === 0 ? <HexIcon time={time} /> : null}
          {line}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- islands

export type Tile = { q: number; r: number; x: number; y: number; kind: "sand" | "grass" | "hill" | "rock"; h: number; ring: number };

/** An island of hex tiles: rings by distance from the centre (sand at the coast, grass, hills, a rock peak). */
export const islandTiles = (radius: number, seed: number, opts: { peak?: boolean; ragged?: number } = {}): Tile[] => {
  const out: Tile[] = [];
  const hs = E.heights;
  for (let q = -radius; q <= radius; q++)
    for (let r = -radius; r <= radius; r++) {
      const d = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      if (d > radius) continue;
      const id = (q + 7) * 31 + (r + 7);
      if (d === radius && rnd(id, seed) < (opts.ragged ?? 0.3)) continue;
      const kind: Tile["kind"] = d === radius ? "sand" : d === 0 && opts.peak ? "rock" : d === 1 && opts.peak ? "hill" : "grass";
      const base = kind === "sand" ? hs.sand : kind === "grass" ? hs.grass : kind === "hill" ? hs.hill : hs.rock;
      const [x, y] = hexXY(q, r);
      out.push({ q, r, x, y, kind, h: base + (rnd(id, seed + 3) - 0.5) * 0.08, ring: d });
    }
  return out;
};

/** The columns of an island, each risen by `k` (0..1+ with overshoot). */
export const tileObj = (tl: Tile, k: number, seed = 0): Obj => {
  const j = 1 + (rnd(tl.q * 17 + tl.r * 5, seed + 9) - 0.5) * 2 * E.tile.jitter;
  const tint = (c: string) => (j >= 1 ? mix(c, "#ffffff", j - 1) : mix(c, "#000000", 1 - j));
  const top = tl.kind === "sand" ? C.sand : tl.kind === "rock" ? C.rock : (tl.q + tl.r) % 2 ? C.grass : C.grass2;
  const side = tl.kind === "sand" ? C.sandSide : tl.kind === "rock" ? C.rockSide : C.earth;
  return hexColumn(tl.x, tl.y, Math.max(0.02, tl.h * k), tint(top), side);
};
