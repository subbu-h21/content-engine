/**
 * Memphis's pieces: warm paper, the grainy organic frame, a tabletop model seen from a high three-quarter (an oblique
 * view: depth goes up and to the right), its slab with a hatched cut face, houses built from parts, five crown shapes,
 * a layered river, hard cool-purple shadows filled with halftone dots, paper strips of light, callout pills, and the
 * three centred type lines under the frame with the three marks. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, run, springAt, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const F = style.layout.frame;
const P = style.palette;
const c = (role: string) => color(P, role);
export const C = {
  paper: c("background"),
  t1: c("text"),
  t2: c("muted"),
  t3: c("faint"),
  ink: c("ink"),
  coral: c("accent"),
  cobalt: c("accent2"),
  yellow: c("yellow"),
  pink: c("pink"),
  sky: c("sky"),
  mint: c("mint"),
  lilac: c("lilac"),
  peach: c("peach"),
  green: c("green"),
  grass: c("grass"),
  crown: c("crown"),
  crownLight: c("crown-light"),
  water: c("water"),
  deep: c("water-deep"),
  bank: c("bank"),
  glass: c("glass"),
  glassDark: c("glass-dark"),
  light: c("light"),
  pool: c("pool"),
  dusk: c("dusk"),
  markYellow: c("mark-yellow"),
  markPink: c("mark-pink"),
  trunk: c("trunk"),
  soil: c("soil"),
  white: "#ffffff",
};
/** The six colours of sunlight in the Memphis set. */
export const SPECTRUM = [C.coral, C.peach, C.yellow, C.green, C.cobalt, C.lilac];

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** Back-ease pop with the recipe's overshoot. */
export const backK = (t: number): number => {
  if (t <= 0) return 0;
  const p = clamp(t / R.back.duration);
  const u = p - 1;
  const s = R.back.overshoot;
  return 1 + u * u * ((s + 1) * u + s);
};

// ---------------------------------------------------------------- colour

const rgb = (h: string): number[] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (v: number[]): string => `#${v.map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
export const mix = (a: string, b: string, k: number): string => {
  const x = rgb(a);
  const y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * k));
};
export const mul = (a: string, m: number[] | number): string => hex(rgb(a).map((v, i) => v * (Array.isArray(m) ? m[i] : m)));
/** Night is a luminance shift toward violet, never grey: `n` from 0 (day) to 1. Lights don't change. */
export const nite = (a: string, n: number): string => (n <= 0 ? a : mix(a, mul(a, E.night), n));
/** The hard cool-purple shadow tone of a colour. */
export const shadowOf = (a: string): string => mul(a, E.shadow);
/** Three tones only: top brightest, the sun side the base colour, the away side darker. */
export const tone = (a: string, face: "top" | "sun" | "away", n = 0): string =>
  nite(face === "top" ? mix(a, "#ffffff", E.faces.top) : face === "away" ? mul(a, E.faces.away) : a, n);

// ---------------------------------------------------------------- the view

const V = E.view;
/** World (x = screen x, y = depth into the picture, z = up) → screen px. */
export const pt = (x: number, y: number, z = 0): [number, number] => [x + y * V.dx, V.front - z - y * V.dy];
export const pts = (list: [number, number, number?][]): string =>
  list
    .map(([x, y, z]) => pt(x, y, z ?? 0))
    .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
const inkLine = { stroke: C.ink, strokeWidth: E.outline, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Deterministic smooth 1-D value noise. */
const hash = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const vnoise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = (1 - Math.cos(f * Math.PI)) / 2;
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
};

/** The organic frame's outline: a rounded rectangle whose edge wanders by two octaves of noise (±22 px, ±5.5 px). */
export const framePath = (grow = 1): string => {
  const [a1, s1, a2, s2] = E.frameNoise;
  const { x, y, w, h, r } = F;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const per = 2 * (w + h - 4 * r) + 2 * Math.PI * r;
  const N = 420;
  const out: string[] = [];
  for (let i = 0; i < N; i++) {
    let s = (i / N) * per;
    let px = 0;
    let py = 0;
    let nx = 0;
    let ny = 0;
    const seg = [w - 2 * r, (Math.PI * r) / 2, h - 2 * r, (Math.PI * r) / 2, w - 2 * r, (Math.PI * r) / 2, h - 2 * r, (Math.PI * r) / 2];
    let k = 0;
    while (s > seg[k] && k < 7) {
      s -= seg[k];
      k += 1;
    }
    const arc = (ccx: number, ccy: number, a0: number) => {
      const a = a0 + s / r;
      px = ccx + r * Math.cos(a);
      py = ccy + r * Math.sin(a);
      nx = Math.cos(a);
      ny = Math.sin(a);
    };
    if (k === 0) [px, py, nx, ny] = [x + r + s, y, 0, -1];
    else if (k === 1) arc(x + w - r, y + r, -Math.PI / 2);
    else if (k === 2) [px, py, nx, ny] = [x + w, y + r + s, 1, 0];
    else if (k === 3) arc(x + w - r, y + h - r, 0);
    else if (k === 4) [px, py, nx, ny] = [x + w - r - s, y + h, 0, 1];
    else if (k === 5) arc(x + r, y + h - r, Math.PI / 2);
    else if (k === 6) [px, py, nx, ny] = [x, y + h - r - s, -1, 0];
    else arc(x + r, y + r, Math.PI);
    const d = (vnoise((i / N) * (per / s1), 7) - 0.5) * 2 * a1 * 0.5 + (vnoise((i / N) * (per / s2), 13) - 0.5) * 2 * a2;
    const qx = cx + (px + nx * d - cx) * grow;
    const qy = cy + (py + ny * d - cy) * grow;
    out.push(`${qx.toFixed(1)} ${qy.toFixed(1)}`);
  }
  return `M ${out.join(" L ")} Z`;
};

/** Paper, the picture inside the grainy organic frame, and the type under it. Waits for the fonts. */
export const Page: React.FC<{ grow?: number; picture: React.ReactNode; children?: React.ReactNode; night?: number }> = ({ grow = 1, picture, children, night = 0 }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = Math.floor((frame / fps) * E.grainFps);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="m-grain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency={E.grain} numOctaves={1} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id="m-frame" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <path d={framePath(grow)} fill="#ffffff" filter="url(#m-grain)" />
          </mask>
          <Patterns night={night} />
        </defs>
        <g mask="url(#m-frame)">{picture}</g>
      </svg>
      {children}
    </AbsoluteFill>
  );
};

/** Patterns: halftone dots for shadows on grass, stripes, dots, hatching, planks. */
const Patterns: React.FC<{ night: number }> = ({ night }) => {
  const ht = E.halftone;
  const g = nite(C.grass, night);
  const sh = shadowOf(g);
  return (
    <>
      <pattern id="m-halftone" width={ht.cell} height={ht.cell * 2} patternUnits="userSpaceOnUse">
        <rect width={ht.cell} height={ht.cell * 2} fill={sh} />
        <circle cx={ht.cell / 2} cy={ht.cell / 2} r={ht.r} fill={mix(sh, g, 0.42)} />
        <circle cx={0} cy={ht.cell * 1.5} r={ht.r} fill={mix(sh, g, 0.42)} />
        <circle cx={ht.cell} cy={ht.cell * 1.5} r={ht.r} fill={mix(sh, g, 0.42)} />
      </pattern>
      <pattern id="m-grass" width={44} height={38} patternUnits="userSpaceOnUse">
        <rect width={44} height={38} fill={g} />
        <circle cx={11} cy={10} r={3.4} fill={mix(g, "#ffffff", 0.35)} />
        <circle cx={33} cy={29} r={3.4} fill={mix(g, "#ffffff", 0.35)} />
      </pattern>
      <pattern id="m-hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={14} height={14} fill={nite(C.soil, night)} />
        <rect width={4} height={14} fill={mul(nite(C.soil, night), 0.8)} />
      </pattern>
      <pattern id="m-vstripes" width={22} height={10} patternUnits="userSpaceOnUse">
        <rect width={22} height={10} fill="rgba(255,255,255,0)" />
        <rect width={7} height={10} fill={nite("#ffffff", night)} opacity={0.85} />
      </pattern>
      <pattern id="m-dots" width={30} height={30} patternUnits="userSpaceOnUse">
        <circle cx={8} cy={8} r={5} fill="#ffffff" />
        <circle cx={23} cy={23} r={5} fill="#ffffff" />
      </pattern>
    </>
  );
};

// ---------------------------------------------------------------- the model

/** The painted sky backdrop from the frame top to the slab's back edge, with flat clouds. */
export const Backdrop: React.FC<{ night?: number }> = ({ night = 0 }) => {
  const back = pt(0, 520)[1];
  const skyCol = night > 0 ? mix(C.sky, C.glassDark, night) : C.sky;
  const cloud = (x: number, y: number, s: number, k: number) => (
    <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -70 20 Q -78 -10 -44 -14 Q -36 -44 -2 -38 Q 22 -60 48 -34 Q 82 -36 78 -2 Q 96 22 60 26 Z" fill={nite("#ffffff", night)} {...inkLine} />
    </g>
  );
  return (
    <>
      <rect x={0} y={0} width={W} height={back + 4} fill={skyCol} />
      {night < 0.5 ? [cloud(780, 330, 1, 1), cloud(470, 290, 0.75, 2)] : null}
    </>
  );
};

/** The slab: its top face of patterned grass and its hatched cut face along the front. */
export const Slab: React.FC<{ night?: number }> = ({ night = 0 }) => {
  const top = pts([[-400, 0], [1200, 0], [1200, 520], [-400, 520]]);
  const [, fy] = pt(0, 0);
  return (
    <>
      <polygon points={top} fill="url(#m-grass)" />
      <rect x={0} y={fy} width={W} height={10} fill={nite(C.crown, night)} />
      <rect x={0} y={fy + 10} width={W} height={V.cut} fill="url(#m-hatch)" />
      <line x1={0} y1={fy} x2={W} y2={fy} {...inkLine} />
      <line x1={0} y1={fy + 10} x2={W} y2={fy + 10} {...inkLine} />
    </>
  );
};

/** A layered river across the model: bank, shallows, a deeper channel, white foam lines and drifting squiggles. */
export const River: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => {
  const cl = (y: number) => 900 - (y / 520) * 260;
  const band = (half: number) => {
    const L: [number, number, number][] = [];
    const Rr: [number, number, number][] = [];
    for (let y = 0; y <= 520; y += 26) {
      const x = cl(y) + Math.sin(y / 90) * 26;
      L.push([x - half, y, 0]);
      Rr.push([x + half, y, 0]);
    }
    return pts([...L, ...Rr.reverse()]);
  };
  const squig = Array.from({ length: 7 }, (_, i) => {
    const y = ((i * 74 + t * 26) % 520 + 520) % 520;
    const x = cl(y) + Math.sin(y / 90) * 26 + (i % 2 ? 18 : -22);
    const [sx, sy] = pt(x, y);
    return <path key={i} d={`M ${sx - 18} ${sy} q 6 -7 12 0 t 12 0 t 12 0`} fill="none" stroke={nite("#ffffff", night)} strokeWidth={3} strokeLinecap="round" />;
  });
  return (
    <>
      <polygon points={band(78)} fill={nite(C.bank, night)} {...inkLine} />
      <polygon points={band(64)} fill={nite(C.water, night)} />
      <polygon points={band(28)} fill={nite(C.deep, night)} />
      <polyline points={band(56).split(" ").slice(0, 21).join(" ")} fill="none" stroke={nite("#ffffff", night)} strokeWidth={2.5} strokeDasharray="18 12" />
      {squig}
    </>
  );
};

/** Convex hull of 2-D points (for shadows). */
const hull = (p: [number, number][]): [number, number][] => {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  for (const q of s) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: [number, number][] = [];
  for (const q of [...s].reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** A hard shadow cast by a box footprint of height h: the cool-purple tone filled with halftone dots, no outline. */
export const BoxShadow: React.FC<{ x: number; y: number; w: number; d: number; h: number }> = ({ x, y, w, d, h }) => {
  const sx = -E.sun.dx * h;
  const sy = -E.sun.dy * h;
  const foot: [number, number][] = [
    [x, y],
    [x + w, y],
    [x + w, y + d],
    [x, y + d],
  ];
  const all = [...foot, ...foot.map(([a, b]) => [a + sx, b - sy] as [number, number])];
  return <polygon points={pts(hull(all).map(([a, b]) => [a, b, 0]))} fill="url(#m-halftone)" />;
};

export type HouseSpec = { x: number; y: number; w: number; d: number; h: number; wall: string; roof: string; door?: boolean; awning?: string };

/** A house built from parts: plinth, plank-striped walls, white corner trims, two roof slabs and a ridge, a gable with a
 * round window, framed windows with shutters, a door with a step, an awning and a lamp. `k` grows it (0..1+). */
export const House: React.FC<{ spec: HouseSpec; k?: number; night?: number }> = ({ spec, k = 1, night = 0 }) => {
  if (k <= 0.01) return null;
  const { x, y, w, d, wall, roof } = spec;
  const h = spec.h * k;
  const rh = d * 0.5 * k;
  const o = 8;
  const n = night;
  const [fx0, fy1] = pt(x, y, 0);
  const fy0 = fy1 - h;
  const planks = Array.from({ length: Math.max(0, Math.floor((h - 14) / 14)) }, (_, i) => fy1 - 14 - (i + 1) * 14);
  const win = (cx: number) => {
    const ww = 30;
    const wh = 38;
    const wy = fy0 + h * 0.3;
    if (wy + wh > fy1 - 26) return null;
    return (
      <g key={cx}>
        <rect x={cx - ww / 2 - 14} y={wy} width={12} height={wh} fill={tone(roof, "sun", n)} {...inkLine} />
        <rect x={cx + ww / 2 + 2} y={wy} width={12} height={wh} fill={tone(roof, "sun", n)} {...inkLine} />
        <rect x={cx - ww / 2} y={wy} width={ww} height={wh} fill={n > 0.5 ? C.light : nite(C.glass, n)} stroke={C.ink} strokeWidth={E.outline} />
        <line x1={cx} y1={wy} x2={cx} y2={wy + wh} {...inkLine} />
        <line x1={cx - ww / 2} y1={wy + wh / 2} x2={cx + ww / 2} y2={wy + wh / 2} {...inkLine} />
      </g>
    );
  };
  const doorX = fx0 + w * 0.5;
  return (
    <g>
      {/* back roof slab */}
      <polygon points={pts([[x - o, y + d + o, h], [x + w + o, y + d + o, h], [x + w + o, y + d / 2, h + rh], [x - o, y + d / 2, h + rh]])} fill={tone(roof, "sun", n)} {...inkLine} />
      {/* away side and gable */}
      <polygon points={pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]])} fill={tone(wall, "away", n)} {...inkLine} />
      <polygon points={pts([[x + w, y, h], [x + w, y + d, h], [x + w, y + d / 2, h + rh]])} fill={tone(wall, "away", n)} {...inkLine} />
      {k > 0.8
        ? (() => {
            const [gx, gy] = pt(x + w, y + d / 2, h + rh * 0.42);
            return <circle cx={gx} cy={gy} r={Math.min(12, rh * 0.25)} fill={n > 0.5 ? C.light : nite(C.glass, n)} {...inkLine} />;
          })()
        : null}
      {/* front (sun side) */}
      <rect x={fx0} y={fy0} width={w} height={h} fill={tone(wall, "sun", n)} {...inkLine} />
      {planks.map((py, i) => (
        <line key={i} x1={fx0 + 7} y1={py} x2={fx0 + w - 7} y2={py} stroke={mul(tone(wall, "sun", n), 0.88)} strokeWidth={1.6} />
      ))}
      <rect x={fx0} y={fy1 - 12} width={w} height={12} fill={mul(tone(wall, "sun", n), 0.82)} {...inkLine} />
      <rect x={fx0} y={fy0} width={7} height={h - 12} fill={nite("#ffffff", n)} />
      <rect x={fx0 + w - 7} y={fy0} width={7} height={h - 12} fill={nite("#ffffff", n)} />
      {k > 0.8 ? (
        <>
          {w >= 150 ? [win(fx0 + w * 0.24), win(fx0 + w * 0.76)] : [win(fx0 + w * 0.28)]}
          {spec.door !== false ? (
            <>
              <rect x={doorX - 18 + (w < 150 ? w * 0.16 : 0)} y={fy1 - 12 - 56} width={36} height={56} fill={nite(C.trunk, n)} {...inkLine} />
              <rect x={doorX - 26 + (w < 150 ? w * 0.16 : 0)} y={fy1 - 12} width={52} height={8} fill={nite("#ffffff", n)} {...inkLine} />
              {spec.awning ? (
                <polygon
                  points={`${doorX - 30 + (w < 150 ? w * 0.16 : 0)},${fy1 - 74} ${doorX + 30 + (w < 150 ? w * 0.16 : 0)},${fy1 - 74} ${doorX + 38 + (w < 150 ? w * 0.16 : 0)},${fy1 - 60} ${doorX - 38 + (w < 150 ? w * 0.16 : 0)},${fy1 - 60}`}
                  fill={nite(spec.awning, n)}
                  {...inkLine}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      {/* front roof slab (top, brightest) and ridge */}
      <polygon points={pts([[x - o, y - o, h], [x + w + o, y - o, h], [x + w + o, y + d / 2, h + rh], [x - o, y + d / 2, h + rh]])} fill={tone(roof, "top", n)} {...inkLine} />
      <polyline points={pts([[x - o, y + d / 2, h + rh], [x + w + o, y + d / 2, h + rh]])} fill="none" stroke={C.ink} strokeWidth={E.outline * 1.6} strokeLinecap="round" />
    </g>
  );
};

export type TreeKind = "cloud" | "round" | "egg" | "cone" | "column";

/** A tree: trunk + crown (five shapes), a lighter lobe on the sun side, a hard halftone shadow. */
export const Tree: React.FC<{ kind: TreeKind; x: number; y: number; s?: number; k?: number; night?: number; shadow?: boolean }> = ({ kind, x, y, s = 1, k = 1, night = 0, shadow = true }) => {
  if (k <= 0.01) return null;
  const [bx, by] = pt(x, y);
  const sc = s * k;
  const cr = nite(C.crown, night);
  const lt = nite(C.crownLight, night);
  const crown = (() => {
    switch (kind) {
      case "cloud":
        return (
          <>
            <path d="M -46 -60 a 26 26 0 0 1 20 -42 a 30 30 0 0 1 52 0 a 24 24 0 0 1 22 40 a 24 24 0 0 1 -26 28 l -44 0 a 24 24 0 0 1 -24 -26 Z" fill={cr} {...inkLine} />
            <circle cx={-20} cy={-84} r={14} fill={lt} />
          </>
        );
      case "round":
        return (
          <>
            <circle cx={0} cy={-82} r={44} fill={cr} {...inkLine} />
            <circle cx={-16} cy={-96} r={16} fill={lt} />
          </>
        );
      case "egg":
        return (
          <>
            <ellipse cx={0} cy={-96} rx={32} ry={56} fill={cr} {...inkLine} />
            <ellipse cx={-11} cy={-112} rx={11} ry={22} fill={lt} />
          </>
        );
      case "cone":
        return (
          <>
            {[0, 1, 2].map((i) => (
              <polygon key={i} points={`${-48 + i * 9},${-40 - i * 34} ${48 - i * 9},${-40 - i * 34} 0,${-96 - i * 34}`} fill={cr} {...inkLine} />
            ))}
            {[0, 1, 2].map((i) => (
              <polygon key={`l${i}`} points={`${-40 + i * 9},${-44 - i * 34} -4,${-44 - i * 34} -4,${-88 - i * 34}`} fill={lt} />
            ))}
          </>
        );
      default:
        return (
          <>
            <rect x={-22} y={-150} width={44} height={120} rx={22} fill={cr} {...inkLine} />
            <rect x={-14} y={-138} width={12} height={70} rx={6} fill={lt} />
          </>
        );
    }
  })();
  return (
    <g>
      {shadow ? <ellipse cx={bx + 38 * sc} cy={by + 2} rx={46 * sc} ry={14 * sc} fill="url(#m-halftone)" /> : null}
      <g transform={`translate(${bx} ${by}) scale(${sc})`}>
        <rect x={-7} y={-42} width={14} height={42} fill={nite(C.trunk, night)} {...inkLine} />
        {crown}
      </g>
    </g>
  );
};

/** A lamp post: a thin post, a lamp head; at night a hard-edged warm pool on the ground (no outline, no shadow). */
export const Lamp: React.FC<{ x: number; y: number; night?: number }> = ({ x, y, night = 0 }) => {
  const [bx, by] = pt(x, y);
  return (
    <g>
      {night > 0.4 ? <ellipse cx={bx} cy={by} rx={56} ry={20} fill={C.pool} /> : null}
      <line x1={bx} y1={by} x2={bx} y2={by - 92} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={bx} cy={by - 98} r={10} fill={night > 0.4 ? C.light : nite(C.light, 0.3)} {...inkLine} />
    </g>
  );
};

/** A flat paper strip of light from a to b (screen px), width w, drawn to fraction p, with an ink outline. */
export const Strip: React.FC<{ a: [number, number]; b: [number, number]; w: number; fill: string; p?: number }> = ({ a, b, w, fill, p = 1 }) => {
  if (p <= 0) return null;
  const ex = a[0] + (b[0] - a[0]) * p;
  const ey = a[1] + (b[1] - a[1]) * p;
  const len = Math.hypot(ex - a[0], ey - a[1]) || 1;
  const nx = (-(ey - a[1]) / len) * (w / 2);
  const ny = ((ex - a[0]) / len) * (w / 2);
  return <polygon points={`${a[0] + nx},${a[1] + ny} ${ex + nx},${ey + ny} ${ex - nx},${ey - ny} ${a[0] - nx},${a[1] - ny}`} fill={fill} {...inkLine} />;
};

/** A zigzag mark (the Memphis zigzag), centred at (x, y), pointing along angle a. */
export const Zigzag: React.FC<{ x: number; y: number; a: number; len?: number; col?: string; width?: number }> = ({ x, y, a, len = 64, col = C.cobalt, width = 7 }) => {
  const n = 5;
  const step = len / n;
  const amp = step * 0.55;
  const ptsZ: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = -len / 2 + i * step;
    const v = i % 2 ? amp : -amp;
    ptsZ.push(`${(x + u * Math.cos(a) - v * Math.sin(a)).toFixed(1)},${(y + u * Math.sin(a) + v * Math.cos(a)).toFixed(1)}`);
  }
  return <polyline points={ptsZ.join(" ")} fill="none" stroke={col} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
};

/** A callout: a dot on the thing, a leader line, and a white rounded pill (main label + an optional small mono line). */
export const Callout: React.FC<{ from: [number, number]; to: [number, number]; label: string; sub?: string; at: number; num?: number; align?: "left" | "right" }> = ({
  from,
  to,
  label,
  sub,
  at,
  num,
  align = "left",
}) => {
  const t = useSeconds() - at;
  const k = backK(t);
  if (k <= 0) return null;
  const size = style.type.label;
  const subSize = style.type.min;
  const wLabel = label.length * size * 0.52 + (num ? size * 1.5 : 0);
  const wSub = sub ? sub.length * subSize * 0.62 : 0;
  const pw = Math.max(wLabel, wSub) + size * 1.4;
  const ph = sub ? size * 2.5 : size * 1.6;
  const px = align === "left" ? to[0] : to[0] - pw;
  const py = to[1] - ph / 2;
  const reach = clamp(t / 0.3);
  const lx = from[0] + (to[0] - from[0]) * reach;
  const ly = from[1] + (to[1] - from[1]) * reach;
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={lx} y2={ly} stroke={C.ink} strokeWidth={E.outline} />
      <circle cx={from[0]} cy={from[1]} r={7} fill={C.white} {...inkLine} />
      <g transform={`translate(${px + (align === "left" ? 0 : pw)} ${to[1]}) scale(${k}) translate(${-(align === "left" ? 0 : pw)} ${-ph / 2})`}>
        <rect x={0} y={0} width={pw} height={ph} rx={ph / 2} fill={C.white} {...inkLine} />
        {num ? (
          <>
            <circle cx={size * 0.95} cy={sub ? size * 0.9 : ph / 2} r={size * 0.55} fill={C.ink} />
            <text x={size * 0.95} y={(sub ? size * 0.9 : ph / 2) + size * 0.36} textAnchor="middle" fontFamily={DISPLAY} fontWeight={600} fontSize={size * 0.8} fill={C.white}>
              {num}
            </text>
          </>
        ) : null}
        <text x={size * 0.7 + (num ? size * 1.5 : 0)} y={sub ? size * 1.15 : ph / 2 + size * 0.36} fontFamily={DISPLAY} fontWeight={600} fontSize={size} fill={C.t1}>
          {label}
        </text>
        {sub ? (
          <text x={size * 0.7} y={size * 2.05} fontFamily={MONO} fontSize={subSize} fill={C.t2}>
            {sub}
          </text>
        ) : null}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- type under the frame

/** The three Memphis marks above the type: a yellow dot, a pink triangle, a blue zigzag. */
export const Marks: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const k = backK(useSeconds() - at);
  if (k <= 0) return null;
  const m = E.marks;
  const y = style.layout.marks;
  const cx = W / 2;
  return (
    <svg width={W} height={80} style={{ position: "absolute", left: 0, top: y - 40 }}>
      <g transform={`translate(${cx} 40) scale(${k}) translate(${-cx} -40)`}>
        <circle cx={cx - m.gap} cy={40} r={m.dot} fill={C.markYellow} />
        <polygon points={`${cx - m.triangle / 2},${40 + m.triangle * 0.43} ${cx + m.triangle / 2},${40 + m.triangle * 0.43} ${cx},${40 - m.triangle * 0.43}`} fill={C.markPink} />
        <Zigzag x={cx + m.gap + 4} y={40} a={0} len={34} width={m.zigzag} />
      </g>
    </svg>
  );
};

/**
 * The three centred lines under the frame: line 1 title (Inter Tight 600, dark), line 2 one sentence (400, grey),
 * line 3 data (IBM Plex Mono, light grey). Each has a fixed place; an empty line leaves its place empty. Lines
 * cross-fade in over 0.4 s.
 */
export const Lines: React.FC<{ l1?: string[]; l2?: string[]; l3?: string; at?: number; size1?: number }> = ({ l1, l2, l3, at = 0, size1 = style.type.title }) => {
  const t = useSeconds();
  const [y1, y2, y3] = style.layout.lines;
  const a = (d: number) => ease("line", t - at - d);
  const T = style.type;
  const em = (line: string) =>
    line.split("*").map((part, k) => (
      <span key={k} style={{ color: k % 2 === 1 ? C.cobalt : undefined }}>
        {part}
      </span>
    ));
  return (
    <>
      {l1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y1, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: size1, lineHeight: T.leading, letterSpacing: `${T.tracking}em`, color: C.t1, opacity: a(0) }}>
          {l1.map((line, i) => (
            <div key={i}>{em(line)}</div>
          ))}
        </div>
      ) : null}
      {l2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y2, textAlign: "center", fontFamily: DISPLAY, fontWeight: 400, fontSize: T.body, lineHeight: T.bodyLeading, color: C.t2, opacity: a(0.15) }}>
          {l2.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ) : null}
      {l3 ? <div style={{ position: "absolute", left: 0, right: 0, top: y3, textAlign: "center", fontFamily: MONO, fontSize: T.data, color: C.t3, opacity: a(0.3) }}>{l3}</div> : null}
    </>
  );
};

/** A springy growth (0 → 1 with a little overshoot) for things that grow from nothing. */
export const growK = (t: number): number => (t <= 0 ? 0 : springAt(t, R.squash));
