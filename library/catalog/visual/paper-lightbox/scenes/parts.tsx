/**
 * Paper Lightbox's pieces: a stack of flat cut-paper sheets in a shallow box, lit from behind. Each sheet is one flat
 * colour; the backlight brightens it by its translucency and its distance from the light; it carries a warm rim on
 * its top edge and casts a soft shadow on the sheet behind. Windows and lanterns burn through; titles are gold paper
 * strips that grow from an edge. Shape generators (karst peaks with carved slits, clouds, village, tree, bank,
 * figure) are seeded. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
const P = style.palette;
const c = (role: string) => color(P, role);
export const C = {
  sky1: c("background"),
  sky2: c("surface"),
  sky3: c("sky3"),
  sky4: c("faint"),
  text: c("text"),
  clouds: c("muted"),
  window: c("accent"),
  seal: c("accent2"),
  moon: c("moon"),
  halo: c("halo"),
  haloOuter: c("haloOuter"),
  far: c("far"),
  mid: c("mid"),
  walls: c("walls"),
  roofs: c("roofs"),
  river: c("river"),
  trail: c("trail"),
  tree: c("tree"),
  blossom: c("blossom"),
  bank: c("bank"),
  lantern: c("lantern"),
  lanternGlow: c("lanternGlow"),
  wallWarm: c("wallWarm"),
  props: c("props"),
  figure: c("figure"),
  glowWarm: c("glowWarm"),
  strip: c("strip"),
  strip2: c("strip2"),
  walnut: c("walnut"),
  room: c("room"),
  roomDark: c("roomDark"),
  spill: c("spill"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
const T = style.type;
const E = style.elements;
export const TR = E.translucency;
const f1 = (n: number) => n.toFixed(1);
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

export const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const hexRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, k: number): string => {
  const x = hexRgb(a);
  const y = hexRgb(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * clamp(k)).toString(16).padStart(2, "0")).join("")}`;
};

/** Lamp-on progress of something that lights at `at` (the light recipe, 0.6 s). */
export const lit = (t: number, at: number): number => ease("light", t - at);

/** Shared filters: the soft cast shadow (light from the top), bloom for emissive light, sheet fibre, a soft blur. */
const Defs: React.FC = () => (
  <defs>
    <filter id="pl-shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx={0} dy={E.shadow.dy} stdDeviation={E.shadow.blur} floodColor="#000" floodOpacity={E.shadow.alpha} />
    </filter>
    <filter id="pl-bloom" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="a" />
      <feGaussianBlur in="SourceGraphic" stdDeviation={20} result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="a" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="pl-fibre" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves={3} seed={8} />
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.7" />
    </filter>
    <filter id="pl-mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={2} seed={3} />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  1.4 0 0 0 -0.55" />
    </filter>
    <filter id="pl-soft" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation={2.2} />
    </filter>
  </defs>
);

/**
 * The box seen from inside: one SVG stage with the shared filters, a hand-held micro drift (±1.4 px), the finish.
 * HTML (paper strips, the subtitle) goes in `over`. Waits for the fonts.
 */
export const Box: React.FC<{ children: React.ReactNode; over?: React.ReactNode; bg?: string }> = ({ children, over, bg = C.sky1 }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const d = E.drift;
  const dx = d * Math.sin(t * 0.9 + 0.3) + d * 0.4 * Math.sin(t * 2.1);
  const dy = d * Math.sin(t * 0.7 + 1.9);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(1.006)` }}>
        <svg width={W} height={H} style={abs}>
          <Defs />
          {children}
        </svg>
        {over}
      </AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The night back panel: four stepped blues (the only gradient besides light), brighter as the lamp comes on. */
export const NightPanel: React.FC<{ on: number; id?: string; y0?: number; y1?: number }> = ({ on, id = "pl-night", y0 = 0, y1 = H }) => (
  <>
    <linearGradient id={id} x1="0" y1={y0} x2="0" y2={y1} gradientUnits="userSpaceOnUse">
      <stop offset={0} stopColor={C.sky1} />
      <stop offset={0.35} stopColor={C.sky2} />
      <stop offset={0.65} stopColor={C.sky3} />
      <stop offset={1} stopColor={C.sky4} />
    </linearGradient>
    <rect x={-20} y={y0 - 20} width={W + 40} height={y1 - y0 + 40} fill={C.sky1} />
    <rect x={-20} y={y0 - 20} width={W + 40} height={y1 - y0 + 40} fill={`url(#${id})`} opacity={0.35 + 0.65 * on} />
    <rect x={-20} y={y0 - 20} width={W + 40} height={y1 - y0 + 40} filter="url(#pl-mottle)" opacity={0.12 * on} />
  </>
);

/** The moon: disc and halo; `on` 0..1 brings it up. */
export const Moon: React.FC<{ x: number; y: number; r: number; on: number; id?: string }> = ({ x, y, r, on, id = "pl-halo" }) => (
  <>
    <radialGradient id={id} cx={x} cy={y} r={r * E.moon.halo} gradientUnits="userSpaceOnUse">
      <stop offset={0} stopColor={C.halo} stopOpacity={0.75} />
      <stop offset={0.32} stopColor={C.halo} stopOpacity={0.42} />
      <stop offset={0.6} stopColor={C.haloOuter} stopOpacity={0.14} />
      <stop offset={1} stopColor={C.haloOuter} stopOpacity={0} />
    </radialGradient>
    <circle cx={x} cy={y} r={r * E.moon.halo} fill={`url(#${id})`} opacity={on} />
    <circle cx={x} cy={y} r={r} fill={C.moon} opacity={on} filter="url(#pl-bloom)" />
  </>
);

/**
 * One cut-paper sheet. `parts` are filled paths (one flat colour each, usually one); the sheet's union is its shape.
 * Lit by `on`: the backlight lifts it toward the light colour by translucency × falloff from the light point; a warm
 * rim sits on its top edge; it casts a soft shadow on what's behind. Unlit, it is a dark silhouette.
 */
export const Sheet: React.FC<{
  id: string;
  parts: { d: string; fill: string; rule?: "evenodd" | "nonzero" }[];
  trans: number;
  on: number;
  light: [number, number];
  lightCol?: string;
  soft?: boolean;
  shadow?: boolean;
}> = ({ id, parts, trans, on, light, lightCol = C.halo, soft = false, shadow = true }) => {
  const fo = E.falloff;
  const a = clamp(trans * on * fo.strength);
  const dark = (f: string) => mix(f, "#02040c", 0.62 * (1 - on));
  const sh = E.rim.shift;
  return (
    <g filter={shadow ? "url(#pl-shadow)" : undefined}>
      <defs>
        <clipPath id={`${id}-c`}>
          {parts.map((p, i) => (
            <path key={i} d={p.d} clipRule={p.rule ?? "nonzero"} />
          ))}
        </clipPath>
        <radialGradient id={`${id}-l`} cx={light[0]} cy={light[1]} r={fo.radius} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={lightCol} stopOpacity={a * fo.near} />
          <stop offset={0.55} stopColor={lightCol} stopOpacity={a * (fo.far + (fo.near - fo.far) * 0.37)} />
          <stop offset={1} stopColor={lightCol} stopOpacity={a * fo.far} />
        </radialGradient>
      </defs>
      <g filter={soft ? "url(#pl-soft)" : undefined}>
        {/* the rim: the whole sheet in a warm light colour, then the body shifted down by the rim width */}
        {parts.map((p, i) => (
          <path key={`r${i}`} d={p.d} fill={mix(dark(p.fill), "#ffecc8", E.rim.alpha * on)} fillRule={p.rule ?? "nonzero"} />
        ))}
        <g clipPath={`url(#${id}-c)`}>
          {parts.map((p, i) => (
            <path key={`b${i}`} d={p.d} transform={`translate(0 ${sh})`} fill={dark(p.fill)} fillRule={p.rule ?? "nonzero"} />
          ))}
          {parts.map((p, i) => (
            <path key={`l${i}`} d={p.d} transform={`translate(0 ${sh})`} fill={`url(#${id}-l)`} fillRule={p.rule ?? "nonzero"} />
          ))}
          <rect x={-20} y={-20} width={W + 40} height={H + 40} filter="url(#pl-fibre)" opacity={E.fibre} />
        </g>
      </g>
    </g>
  );
};

/** Karst peaks: rounded, steep tops over a base line, filled down to the bottom. Peaks are [centre, top, half-width]. */
export const karst = (peaks: [number, number, number][], base: number, bottom = H + 40): string => {
  const pts: string[] = [];
  for (let x = -30; x <= W + 30; x += 6) {
    let y = base;
    for (const [cx, top, w] of peaks) {
      const u = (x - cx) / w;
      if (Math.abs(u) < 1) y = Math.min(y, top + (base - top) * (1 - Math.pow(1 - u * u, 0.55)));
    }
    pts.push(`${x} ${f1(y)}`);
  }
  return `M -30 ${bottom} L ${pts.join(" L ")} L ${W + 30} ${bottom} Z`;
};

/** Carved contour slits inside each peak (light shows through): thin tapered bands that follow the peak's shape. */
export const slits = (peaks: [number, number, number][], base: number, depth = 46, width = 6): string => {
  let d = "";
  for (const [cx, top, w] of peaks) {
    for (const k of [1, 2]) {
      const off = depth * k;
      const span = 0.62 - k * 0.12;
      const up: string[] = [];
      const dn: string[] = [];
      for (let u = -span; u <= span + 1e-6; u += 0.04) {
        const x = cx + u * w;
        const y = top + (base - top) * (1 - Math.pow(1 - u * u, 0.55)) + off;
        const th = width * Math.sin((Math.PI * (u + span)) / (2 * span));
        up.push(`${f1(x)} ${f1(y)}`);
        dn.unshift(`${f1(x)} ${f1(y + th)}`);
      }
      d += ` M ${up.join(" L ")} L ${dn.join(" L ")} Z`;
    }
  }
  return d;
};

/** An auspicious cloud: a capsule base with a row of round puffs on it. */
export const cloud = (x0: number, x1: number, y: number, h: number, seed: number): string => {
  const r = h / 2;
  let d = `M ${x0 + r} ${y} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y + h} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y} Z`;
  const n = Math.max(2, Math.round((x1 - x0) / (h * 1.6)));
  for (let i = 0; i < n; i++) {
    const cx = x0 + h * 0.9 + ((x1 - x0 - h * 1.8) * i) / Math.max(1, n - 1);
    const pr = h * (0.62 + 0.4 * rand(seed * 13 + i));
    d += ` M ${f1(cx - pr)} ${f1(y + h * 0.35)} a ${f1(pr)} ${f1(pr)} 0 1 1 ${f1(2 * pr)} 0 a ${f1(pr)} ${f1(pr)} 0 1 1 ${f1(-2 * pr)} 0 Z`;
  }
  return d;
};

/** A village of houses on a base line: walls, gabled or stepped roofs, and the windows (lit separately). */
export const village = (x0: number, x1: number, base: number, seed: number) => {
  let walls = "";
  let roofs = "";
  const windows: [number, number, number, number][] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = 104 + rand(seed + i * 3) * 60;
    const h = 92 + rand(seed + i * 3 + 1) * 70;
    const top = base - h;
    walls += ` M ${f1(x)} ${base + 60} V ${f1(top)} H ${f1(x + w)} V ${base + 60} Z`;
    if (rand(seed + i * 3 + 2) > 0.45) {
      roofs += ` M ${f1(x - 14)} ${f1(top + 6)} L ${f1(x + w / 2)} ${f1(top - 46)} L ${f1(x + w + 14)} ${f1(top + 6)} Z`;
    } else {
      const s = w / 4;
      roofs += ` M ${f1(x - 8)} ${f1(top + 8)} V ${f1(top - 18)} H ${f1(x + s)} V ${f1(top - 34)} H ${f1(x + w - s)} V ${f1(top - 18)} H ${f1(x + w + 8)} V ${f1(top + 8)} Z`;
    }
    const nw = w > 140 ? 2 : 1;
    for (let k = 0; k < nw; k++) windows.push([x + (w / (nw + 1)) * (k + 1) - 12, top + 30 + rand(seed + i + 50) * 20, 24, 32]);
    x += w + 6 + rand(seed + i * 7) * 30;
    i += 1;
  }
  return { walls, roofs, windows };
};

/** A tapered branch polygon from a to b. */
const limb = (a: [number, number], b: [number, number], w0: number, w1: number): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  return ` M ${f1(a[0] + nx * w0)} ${f1(a[1] + ny * w0)} Q ${f1((a[0] + b[0]) / 2 + nx * (w0 + w1) * 0.7 + dy * 0.05)} ${f1((a[1] + b[1]) / 2 + ny * (w0 + w1) * 0.7)} ${f1(b[0] + nx * w1)} ${f1(b[1] + ny * w1)} L ${f1(b[0] - nx * w1)} ${f1(b[1] - ny * w1)} Q ${f1((a[0] + b[0]) / 2 - nx * (w0 + w1) * 0.3)} ${f1((a[1] + b[1]) / 2 - ny * (w0 + w1) * 0.3)} ${f1(a[0] - nx * w0)} ${f1(a[1] - ny * w0)} Z`;
};

/** A flowering tree: trunk and branches (one sheet colour) and blossom dots (their own colour on the same sheet). */
export const tree = (root: [number, number], seed: number, scale = 1) => {
  const s = scale;
  const [rx, ry] = root;
  const j: [number, number] = [rx + 60 * s, ry - 420 * s];
  const k: [number, number] = [rx + 40 * s, ry - 640 * s];
  let wood = limb(root, j, 34 * s, 22 * s) + limb(j, k, 22 * s, 10 * s);
  const tips: [number, number][] = [
    [j[0] + 300 * s, j[1] - 90 * s],
    [k[0] + 250 * s, k[1] - 40 * s],
    [k[0] - 40 * s, k[1] - 140 * s],
    [j[0] + 160 * s, j[1] - 230 * s],
  ];
  wood += limb(j, tips[0], 14 * s, 3 * s) + limb(k, tips[1], 10 * s, 3 * s) + limb(k, tips[2], 9 * s, 2 * s) + limb([j[0] + 10 * s, j[1] - 60 * s], tips[3], 10 * s, 2 * s);
  let blossoms = "";
  tips.forEach(([tx, ty], i) => {
    for (let n = 0; n < 9; n++) {
      const u = 0.35 + 0.65 * rand(seed + i * 20 + n);
      const base = i === 0 || i === 3 ? j : k;
      const x = base[0] + (tx - base[0]) * u + (rand(seed + i * 20 + n + 7) - 0.5) * 60 * s;
      const y = base[1] + (ty - base[1]) * u + (rand(seed + i * 20 + n + 13) - 0.5) * 50 * s;
      const r = (6 + rand(seed + i * 20 + n + 3) * 7) * s;
      blossoms += ` M ${f1(x - r)} ${f1(y)} a ${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a ${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0 Z`;
    }
  });
  return { wood, blossoms };
};

/** The foreground bank: a soft wavy top at `y`, filled to the bottom. */
export const bank = (y: number, seed: number, amp = 26): string => {
  const pts: string[] = [];
  for (let x = -30; x <= W + 30; x += 15) pts.push(`${x} ${f1(y + amp * Math.sin(x / 190 + seed) + amp * 0.5 * Math.sin(x / 70 + seed * 2))}`);
  return `M -30 ${H + 40} L ${pts.join(" L ")} L ${W + 30} ${H + 40} Z`;
};

/** A faceless figure standing, head tilted back, one arm pointing up: one silhouette sheet. `h` is its height. */
export const figure = (x: number, feet: number, h: number): string => {
  const u = h / 100;
  const head = ` M ${f1(x - 7.5 * u + 3 * u)} ${f1(feet - 91 * u)} a ${f1(7.5 * u)} ${f1(7.5 * u)} 0 1 0 ${f1(15 * u)} 0 a ${f1(7.5 * u)} ${f1(7.5 * u)} 0 1 0 ${f1(-15 * u)} 0 Z`;
  const body = ` M ${f1(x - 9 * u)} ${f1(feet - 80 * u)} L ${f1(x + 9 * u)} ${f1(feet - 80 * u)} L ${f1(x + 12 * u)} ${f1(feet - 40 * u)} L ${f1(x - 12 * u)} ${f1(feet - 40 * u)} Z`;
  const legs = ` M ${f1(x - 10 * u)} ${f1(feet - 42 * u)} L ${f1(x - 2 * u)} ${f1(feet - 42 * u)} L ${f1(x - 4 * u)} ${f1(feet)} L ${f1(x - 11 * u)} ${f1(feet)} Z M ${f1(x + 2 * u)} ${f1(feet - 42 * u)} L ${f1(x + 10 * u)} ${f1(feet - 42 * u)} L ${f1(x + 11 * u)} ${f1(feet)} L ${f1(x + 4 * u)} ${f1(feet)} Z`;
  const arm = limb([x + 6 * u, feet - 76 * u], [x + 26 * u, feet - 116 * u], 3.6 * u, 2.4 * u);
  const arm2 = limb([x - 7 * u, feet - 76 * u], [x - 13 * u, feet - 46 * u], 3.4 * u, 2.6 * u);
  return head + body + legs + arm + arm2;
};

/** Windows that switch on (warm, with bloom and a gentle flicker). */
export const Windows: React.FC<{ rects: [number, number, number, number][]; on: number }> = ({ rects, on }) => {
  const t = useSeconds();
  if (on <= 0) return null;
  const F = E.flicker;
  return (
    <g filter="url(#pl-bloom)">
      {rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={2} fill={C.window} opacity={on * (1 + F.amount * Math.sin(F.a * t + i) * Math.sin(F.b * t + i * 2)) * 0.95} />
      ))}
    </g>
  );
};

/** Hanging lanterns: a string, a glowing paper body (flicker 1 + .06·sin 7.3t·sin 3.1t) and dark caps. */
export const Lanterns: React.FC<{ at: [number, number][]; on: number; top?: number }> = ({ at, on, top = -10 }) => {
  const t = useSeconds();
  const F = E.flicker;
  return (
    <g>
      {at.map(([x, y], i) => {
        const fl = 1 + F.amount * Math.sin(F.a * t + i * 1.3) * Math.sin(F.b * t + i);
        return (
          <g key={i}>
            <line x1={x} y1={top} x2={x} y2={y - 34} stroke={C.lantern} strokeWidth={3} />
            <g filter="url(#pl-bloom)" opacity={on * fl}>
              <ellipse cx={x} cy={y} rx={30} ry={36} fill={C.lanternGlow} />
            </g>
            <ellipse cx={x} cy={y} rx={30} ry={36} fill={C.lantern} opacity={1 - on * 0.85} />
            <rect x={x - 20} y={y - 40} width={40} height={9} rx={2} fill={C.lantern} />
            <rect x={x - 20} y={y + 31} width={40} height={9} rx={2} fill={C.lantern} />
            <line x1={x} y1={y + 40} x2={x} y2={y + 64} stroke={C.lantern} strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

/** A gold paper strip with a title on it, grown from its left edge; the words are revealed, never squashed. */
export const Strip: React.FC<{
  text: string;
  x?: number;
  y: number;
  at: number;
  size?: number;
  weight?: number;
  col?: string;
  paper?: string;
  caps?: boolean;
  align?: "left" | "center";
  seal?: boolean;
}> = ({ text, x = M, y, at, size = T.strip, weight = 600, col = C.figure, paper = C.strip, caps = false, align = "left", seal = false }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("strip", t);
  const sealP = seal ? ease("strip", t - 0.55) : 0;
  const pad = size * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "center",
        gap: size * 0.32,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: `${size * 0.18}px ${pad}px ${size * 0.24}px`,
          backgroundColor: paper,
          backgroundImage: `linear-gradient(180deg, rgba(255,250,235,0.55) 0px, rgba(255,250,235,0) 4px), linear-gradient(0deg, rgba(60,30,10,0.18) 0px, rgba(60,30,10,0) 5px)`,
          fontFamily: DISPLAY,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.15,
          letterSpacing: caps ? "0.16em" : "0.005em",
          textTransform: caps ? "uppercase" : "none",
          color: col,
          whiteSpace: "nowrap",
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      >
        {text}
      </div>
      {seal ? <Seal size={size * 0.95} p={sealP} /> : null}
    </div>
  );
};

/** The red seal: a square with a paper-coloured inner border and a cut crescent; it is pressed down from its top edge. */
export const Seal: React.FC<{ size: number; p: number }> = ({ size, p }) =>
  p <= 0 ? null : (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scaleY(${p})`, transformOrigin: "50% 0%", flex: "none" }}>
      <rect x={2} y={2} width={96} height={96} rx={8} fill={C.seal} />
      <rect x={11} y={11} width={78} height={78} rx={4} fill="none" stroke={C.strip} strokeWidth={4} />
      <path d="M 62 26 A 26 26 0 1 0 62 74 A 20 20 0 1 1 62 26 Z" fill={C.strip} />
    </svg>
  );

/** The burned-in subtitle line under the picture: Noto Serif, warm white, soft dark shadow, in 0.15 s. */
export const Subtitle: React.FC<{ text: string; at: number; y?: number }> = ({ text, at, y = style.layout.subtitleY }) => {
  const p = ease("subtitleIn", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: M,
        right: M,
        top: y - T.body * 1.25,
        textAlign: "center",
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: T.body,
        lineHeight: 1.3,
        letterSpacing: `${T.subtitleTracking}em`,
        color: C.text,
        opacity: p,
        textShadow: "0 2px 6px rgba(0,0,0,0.7), 0 0 18px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};

/**
 * The night stack: back panel, moon, clouds, far and mid karst, village with windows, river with the moon's trail,
 * a flowering tree, the bank and an optional figure looking up. `on` gives each sheet's lamp-on progress.
 */
export type NightOn = { moon: number; clouds: number; far: number; mid: number; village: number; windows: number; river: number; tree: number; bank: number };
export const allOn: NightOn = { moon: 1, clouds: 1, far: 1, mid: 1, village: 1, windows: 1, river: 1, tree: 1, bank: 1 };

export const NightStack: React.FC<{ on: NightOn; moon: [number, number, number]; figureAt?: number; tag?: string; showTree?: boolean }> = ({
  on,
  moon,
  figureAt,
  tag = "n",
  showTree = true,
}) => {
  const [mx, my, mr] = moon;
  const light: [number, number] = [mx, my];
  const g = useMemo(() => {
    const farPeaks: [number, number, number][] = [
      [120, 900, 190],
      [400, 960, 170],
      [640, 880, 200],
      [930, 930, 210],
    ];
    const midPeaks: [number, number, number][] = [
      [40, 1070, 170],
      [300, 1030, 190],
      [600, 1110, 170],
      [880, 1040, 220],
    ];
    const v = village(30, 1060, 1440, 17);
    const tr = tree([90, 1700], 5, 1.0);
    const clouds = cloud(70, 470, 780, 54, 3) + cloud(560, 960, 700 + (my > 700 ? 120 : 0), 46, 9);
    return {
      far: karst(farPeaks, 1300),
      mid: karst(midPeaks, 1420) + slits(midPeaks, 1420),
      v,
      tr,
      clouds,
      bank: bank(1590, 2),
    };
  }, [my]);
  const trail = Array.from({ length: 6 }, (_, i) => {
    const w = 90 - i * 12;
    return <rect key={i} x={mx - w / 2 + (rand(i + 3) - 0.5) * 30} y={1458 + i * 9} width={w} height={4} rx={2} fill={C.trail} opacity={0.9 * on.river} />;
  });
  return (
    <g>
      <NightPanel on={Math.max(on.moon * 0.6, on.clouds)} id={`${tag}-panel`} />
      <Moon x={mx} y={my} r={mr} on={on.moon} id={`${tag}-halo`} />
      <Sheet id={`${tag}-clouds`} parts={[{ d: g.clouds, fill: C.clouds }]} trans={TR.clouds} on={on.clouds} light={light} soft />
      <Sheet id={`${tag}-far`} parts={[{ d: g.far, fill: C.far }]} trans={TR.far} on={on.far} light={light} />
      <Sheet id={`${tag}-mid`} parts={[{ d: g.mid, fill: C.mid, rule: "evenodd" }]} trans={TR.mid} on={on.mid} light={light} />
      <Sheet id={`${tag}-river`} parts={[{ d: `M -30 1436 H ${W + 30} V 1700 H -30 Z`, fill: C.river }]} trans={TR.river} on={on.river} light={light} />
      {trail}
      <Sheet
        id={`${tag}-village`}
        parts={[
          { d: g.v.walls, fill: C.walls },
          { d: g.v.roofs, fill: C.roofs },
        ]}
        trans={TR.walls}
        on={on.village}
        light={light}
      />
      <Windows rects={g.v.windows} on={on.windows} />
      {showTree ? (
        <Sheet
          id={`${tag}-tree`}
          parts={[
            { d: g.tr.wood, fill: C.tree },
            { d: g.tr.blossoms, fill: C.blossom },
          ]}
          trans={TR.tree}
          on={on.tree}
          light={light}
        />
      ) : null}
      <Sheet
        id={`${tag}-bank`}
        parts={[{ d: g.bank, fill: C.bank }, ...(figureAt !== undefined ? [{ d: figure(figureAt, 1600, 230), fill: C.bank }] : [])]}
        trans={TR.bank}
        on={on.bank}
        light={light}
      />
    </g>
  );
};
