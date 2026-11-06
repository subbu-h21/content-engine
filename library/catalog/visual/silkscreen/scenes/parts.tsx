/**
 * Silkscreen's pieces: a poster (1000 × 1500 u) taped to a workbench and printed on camera. Each ink is one flat,
 * opaque path pulled in by a ragged squeegee front, offset 1–3 px out of register, with a faint overprint ghost and
 * a light/dark ink-thickness rim. Stepped bands stand in for gradients; ridges come from midpoint displacement; pines
 * are drooping tiers; water is flat with paper glints. Text inks are picked by contrast. Every value comes from
 * style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, useFontsReady, useSeconds } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, LABEL } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  teal: color(P, "muted"),
  orange: color(P, "accent2"),
  gold: color(P, "bannerGold"),
  table: color(P, "table"),
  tableDark: color(P, "tableDark"),
  tape: color(P, "tape"),
};
export type Pal = { sky1: string; sky2: string; far: string; mid: string; near: string; sun: string };
export const PAL = style.palettes as Record<"noon" | "dawn" | "golden" | "dusk", Pal>;
const R = style.motion.recipes;
const T = style.type;
const E = style.elements;
const LY = style.layout;
const PO = LY.poster;
export const U = { w: PO.w, h: PO.h, border: LY.border, art: LY.artBottom, band: LY.band as [number, number] };
const f1 = (n: number) => n.toFixed(1);

export const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- colour ---------- */

const lum = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** The text ink with the best WCAG contrast against the ink underneath (never a fixed key). */
export const pickInk = (under: string, options: string[]): string => options.reduce((best, c) => (contrast(c, under) > contrast(best, under) ? c : best), options[0]);

/* ---------- shapes, in poster units ---------- */

/** A ridge by midpoint displacement between x0 and x1 around `base`, filled down to `bottom`. Returns path and points. */
export const ridge = (x0: number, x1: number, base: number, rough: number, seed: number, bottom: number = U.art, peaks: [number, number][] = []) => {
  let pts: [number, number][] = [
    [x0, base - rand(seed) * rough * 0.4],
    ...peaks,
    [x1, base - rand(seed + 1) * rough * 0.4],
  ];
  let amp = rough;
  for (let level = 0; level < 6; level++) {
    const next: [number, number][] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      next.push([(ax + bx) / 2, (ay + by) / 2 + (rand(seed * 31 + level * 997 + i) - 0.5) * amp], [bx, by]);
    }
    pts = next;
    amp *= 0.5;
  }
  const d = `M ${x0} ${bottom} L ${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L ")} L ${x1} ${bottom} Z`;
  return { d, pts };
};

/** A jagged lit facet on the sunward side of each given peak: a sliver following the slope, cut back in steps. */
export const facets = (pts: [number, number][], peakXs: number[], side: -1 | 1, seed: number): string => {
  let d = "";
  for (const px of peakXs) {
    const i = pts.reduce((bi, p, k) => (Math.abs(p[0] - px) < Math.abs(pts[bi][0] - px) ? k : bi), 0);
    const slope: [number, number][] = [];
    for (let k = i; k >= 0 && k < pts.length && Math.abs(pts[k][0] - pts[i][0]) < 150; k += side) slope.push(pts[k]);
    if (slope.length < 3) continue;
    const back = slope
      .slice()
      .reverse()
      .map(([x, y], k) => [x - side * (14 + rand(seed + k) * 26), y + 26 + k * 3 + rand(seed + k + 50) * 18] as [number, number]);
    d += ` M ${slope.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L ")} L ${back.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(" L ")} Z`;
  }
  return d;
};

/** A pine: one outline of drooping tiers and a trunk. */
export const pine = (x: number, base: number, h: number, w: number): string => {
  const tiers = 5;
  const left: string[] = [];
  const right: string[] = [];
  for (let k = 0; k < tiers; k++) {
    const yTop = base - h + (k * h * 0.78) / tiers;
    const yBot = yTop + h * 0.26;
    const half = (w / 2) * (0.35 + (0.65 * (k + 1)) / tiers);
    left.push(`${f1(x - half * 0.45)} ${f1(yTop + h * 0.06)} L ${f1(x - half)} ${f1(yBot)} L ${f1(x - half * 0.5)} ${f1(yBot - h * 0.03)}`);
    right.unshift(`${f1(x + half * 0.5)} ${f1(yBot - h * 0.03)} L ${f1(x + half)} ${f1(yBot)} L ${f1(x + half * 0.45)} ${f1(yTop + h * 0.06)}`);
  }
  const tw = w * 0.07;
  return `M ${x} ${base - h} L ${left.join(" L ")} L ${f1(x - tw)} ${f1(base - h * 0.2)} L ${f1(x - tw)} ${base} L ${f1(x + tw)} ${base} L ${f1(x + tw)} ${f1(base - h * 0.2)} L ${right.join(" L ")} Z`;
};

/** A row of pines on a solid base. */
export const forest = (x0: number, x1: number, base: number, seed: number, h = 110, bottom: number = U.art): string => {
  let d = `M ${x0} ${bottom} V ${base - 10} H ${x1} V ${bottom} Z`;
  for (let x = x0 + 18; x < x1; x += 34 + rand(seed + x) * 22) d += ` ${pine(x, base, h * (0.7 + rand(seed + x * 3) * 0.5), h * 0.5)}`;
  return d;
};

/** Stepped bands instead of a gradient: a flat colour, then stripes thinning out over `n` steps. */
export const stepped = (x0: number, x1: number, y0: number, flatTo: number, fadeTo: number, n: number = E.bandSteps): string => {
  let d = `M ${x0} ${y0} H ${x1} V ${flatTo} H ${x0} Z`;
  const g = (fadeTo - flatTo) / n;
  for (let i = 0; i < n; i++) {
    const th = g * (1 - (i + 1) / (n + 1));
    const y = flatTo + i * g;
    d += ` M ${x0} ${f1(y)} H ${x1} V ${f1(y + th)} H ${x0} Z`;
  }
  return d;
};

export const disc = (x: number, y: number, r: number) => `M ${x - r} ${y} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0 Z`;
const discCCW = (x: number, y: number, r: number) => `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
/** A ring (annulus) between r0 and r1. */
export const ring = (x: number, y: number, r0: number, r1: number) => `${disc(x, y, r1)} ${discCCW(x, y, r0)}`;
/** A sun with concentric rings. */
export const sun = (x: number, y: number, r: number) => `${disc(x, y, r)} ${ring(x, y, r + 20, r + 32)} ${ring(x, y, r + 52, r + 60)}`;

/** A faceless figure standing, head tipped back, one arm raised: one silhouette. `h` in units. */
export const figure = (x: number, feet: number, h: number): string => {
  const u = h / 100;
  const pts = [
    [-8, 0], [-6, -42], [-11, -44], [-12, -76], [-8, -82], [10, -100], [16, -96], [8, -80], [12, -76], [11, -44], [6, -42], [8, 0], [2, 0], [0, -40], [-2, 0],
  ];
  const body = `M ${pts.map(([a, b]) => `${f1(x + a * u)} ${f1(feet + b * u)}`).join(" L ")} Z`;
  return `${body} ${disc(x + 1 * u, feet - 90 * u, 8 * u)}`;
};

/* ---------- printing ---------- */

/** The ragged squeegee front: what lies above it is printed. A ~30 u drag tail lags in the middle of the blade. */
const frontClip = (p: number, dir: "down" | "right", seed: number): string => {
  const tail = R.pull.tail;
  const pts: string[] = [];
  if (dir === "right") {
    const x = -40 + (U.w + 80 + tail) * p;
    for (let y = -20; y <= U.h + 20; y += 25) pts.push(`${f1(x - tail * Math.sin((Math.PI * y) / U.h) + (rand(seed + y) - 0.5) * 8)} ${y}`);
    return `M -60 -20 L ${pts.join(" L ")} L -60 ${U.h + 20} Z`;
  }
  const y = -40 + (U.h + 80 + tail) * p;
  for (let x = -20; x <= U.w + 20; x += 25) pts.push(`${x} ${f1(y - tail * Math.sin((Math.PI * x) / U.w) + (rand(seed + x) - 0.5) * 8)}`);
  return `M -20 -60 L ${pts.join(" L ")} L ${U.w + 20} -60 Z`;
};

/**
 * One pull of one ink: an opaque flat path (or children), pulled in linearly (a squeegee doesn't ease) from `at`,
 * offset out of register by `reg`, with an overprint ghost under it and the ink-thickness rim.
 */
export const Ink: React.FC<{
  id: string;
  at: number;
  col: string;
  d?: string;
  rule?: "evenodd" | "nonzero";
  reg?: [number, number];
  dir?: "down" | "right";
  dur?: number;
  mask?: string;
  children?: React.ReactNode;
}> = ({ id, at, col, d, rule = "nonzero", reg = E.registration as [number, number], dir = "down", dur = R.pull.duration, mask, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = clamp(t / dur);
  const body = d ? <path d={d} fill={col} fillRule={rule} /> : <g fill={col}>{children}</g>;
  const ts = E.trap.shift;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-c`}>
          <path d={p >= 1 ? `M -100 -100 H ${U.w + 100} V ${U.h + 100} H -100 Z` : frontClip(p, dir, id.length * 7)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`} mask={mask}>
        <g transform={`translate(${reg[0] + ts} ${reg[1] + ts})`} opacity={E.trap.alpha} style={{ mixBlendMode: "multiply" }}>
          {body}
        </g>
        <g transform={`translate(${reg[0]} ${reg[1]})`} filter="url(#sk-thick)">
          {body}
        </g>
      </g>
      {p < 1 ? <Blade p={p} dir={dir} col={col} /> : null}
    </g>
  );
};

/** The squeegee blade and its ink bead, riding the front while a pull runs. */
const Blade: React.FC<{ p: number; dir: "down" | "right"; col: string }> = ({ p, dir, col }) => {
  if (dir === "right") {
    const x = -40 + (U.w + 80 + R.pull.tail) * p + 10;
    return (
      <g>
        <rect x={x + 4} y={-30} width={16} height={U.h + 60} fill="#2a2a2a" />
        <rect x={x - 2} y={-30} width={9} height={U.h + 60} rx={4} fill={col} />
      </g>
    );
  }
  const y = -40 + (U.h + 80 + R.pull.tail) * p + 10;
  return (
    <g>
      <rect x={-30} y={y + 4} width={U.w + 60} height={16} fill="#2a2a2a" />
      <rect x={-30} y={y - 2} width={U.w + 60} height={9} rx={4} fill={col} />
    </g>
  );
};

/** Text printed as part of a pull: SVG text in poster units. */
export const Txt: React.FC<{
  x: number;
  y: number;
  size: number;
  col: string;
  children: React.ReactNode;
  weight?: number;
  font?: "display" | "label";
  tracking?: number;
  anchor?: "start" | "middle" | "end";
}> = ({ x, y, size, col, children, weight = 900, font = "display", tracking = 0, anchor = "start" }) => (
  <text x={x} y={y} fill={col} textAnchor={anchor} style={{ fontFamily: font === "display" ? DISPLAY : LABEL, fontWeight: font === "display" ? weight : 600, fontSize: size, letterSpacing: `${tracking}em` }}>
    {children}
  </text>
);

/** Largest size (≤ max, ≥ min) at which `text` fits `width` units, by the face's average character width. */
export const fitSize = (text: string, width: number, max: number = T.display, min: number = T.displayMin, em: number = T.charEm): number => clamp(Math.floor(width / (text.length * em)), min, max);

/* ---------- the bench and the poster ---------- */

/** The workbench: planks with seams, grain and a knot, a few muted ink stains (never random coloured dots). */
const Bench: React.FC = React.memo(() => {
  const planks = 8;
  const ph = H / planks;
  const grain = useMemo(() => {
    let d = "";
    for (let k = 0; k < planks; k++) {
      for (let j = 0; j < 7; j++) {
        const y = k * ph + 18 + j * (ph - 36) / 6 + rand(k * 13 + j) * 10;
        const a = 3 + rand(k * 7 + j) * 6;
        d += ` M 0 ${f1(y)} C ${f1(W * 0.3)} ${f1(y - a)} ${f1(W * 0.6)} ${f1(y + a)} ${W} ${f1(y - a * 0.5)}`;
      }
    }
    return d;
  }, []);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: planks }, (_, k) => (
        <rect key={k} x={0} y={k * ph} width={W} height={ph} fill={C.table} opacity={1 - rand(k + 3) * 0.18} />
      ))}
      <path d={grain} fill="none" stroke={C.tableDark} strokeOpacity={0.35} strokeWidth={1.5} />
      {Array.from({ length: planks }, (_, k) => (
        <rect key={`s${k}`} x={0} y={k * ph - 2} width={W} height={4} fill={C.tableDark} />
      ))}
      <ellipse cx={180} cy={H - 120} rx={26} ry={12} fill="none" stroke={C.tableDark} strokeOpacity={0.6} strokeWidth={3} />
      <ellipse cx={180} cy={H - 120} rx={12} ry={5} fill={C.tableDark} opacity={0.6} />
      <ellipse cx={880} cy={70} rx={70} ry={40} fill={C.teal} opacity={0.18} />
      <ellipse cx={940} cy={H - 70} rx={90} ry={34} fill={C.orange} opacity={0.15} />
    </svg>
  );
});

/** Torn masking tape over a poster corner. */
const Tape: React.FC<{ x: number; y: number; rot: number; seed: number }> = ({ x, y, rot, seed }) => {
  const [tw, th] = E.tape;
  const pts: string[] = [];
  for (let i = 0; i <= 5; i++) pts.push(`${f1(-tw / 2 + (rand(seed + i) - 0.5) * 6)} ${f1(-th / 2 + (i * th) / 5)}`);
  for (let i = 5; i >= 0; i--) pts.push(`${f1(tw / 2 + (rand(seed + i + 9) - 0.5) * 6)} ${f1(-th / 2 + (i * th) / 5)}`);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon points={pts.join(" ")} transform={`translate(${x} ${y}) rotate(${rot})`} fill={C.tape} opacity={0.88} />
    </svg>
  );
};

/** Filters and the paper's texture inside the poster. */
const PosterDefs: React.FC = () => {
  const sh = E.thickness.shift;
  return (
    <defs>
      <filter id="sk-thick" x="-5%" y="-5%" width="110%" height="110%">
        <feOffset in="SourceAlpha" dx={sh} dy={sh} result="o1" />
        <feComposite in="SourceAlpha" in2="o1" operator="out" result="tl" />
        <feFlood floodColor="#ffffff" floodOpacity={E.thickness.light} result="w" />
        <feComposite in="w" in2="tl" operator="in" result="light" />
        <feOffset in="SourceAlpha" dx={-sh} dy={-sh} result="o2" />
        <feComposite in="SourceAlpha" in2="o2" operator="out" result="br" />
        <feFlood floodColor="#000000" floodOpacity={E.thickness.dark} result="k" />
        <feComposite in="k" in2="br" operator="in" result="dark" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="light" />
          <feMergeNode in="dark" />
        </feMerge>
      </filter>
      <filter id="sk-mottle" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={4} result="a" />
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={1} seed={8} result="b" />
        <feComposite in="a" in2="b" operator="arithmetic" k1={0} k2={0.6} k3={0.4} k4={0} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.38  1.2 0 0 0 -0.5" />
      </filter>
    </defs>
  );
};

/** Pinholes: paper-coloured specks, visible only where there is ink. */
const Pinholes: React.FC = React.memo(() => {
  const d = useMemo(() => {
    let s = "";
    for (let i = 0; i < E.pinholes; i++) {
      const x = rand(i * 3 + 1) * U.w;
      const y = rand(i * 3 + 2) * U.h;
      const r = 0.6 + rand(i * 3 + 3) * 1.3;
      s += `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`;
    }
    return s;
  }, []);
  return <path d={d} fill={C.paper} opacity={0.75} />;
});

/**
 * A poster taped to the bench: its paper (border included), the pulls in `children` (poster units), the paper's
 * mottle multiplied over the ink, pinholes, a soft shadow on the table. Waits for the fonts.
 */
export const Poster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const w = PO.w * PO.scale;
  const h = PO.h * PO.scale;
  return (
    <AbsoluteFill style={{ backgroundColor: C.table, overflow: "hidden" }}>
      <Bench />
      <div style={{ position: "absolute", left: PO.x + 8, top: PO.y + 12, width: w, height: h, backgroundColor: "rgba(0,0,0,0.45)", filter: "blur(10px)" }} />
      <svg width={w} height={h} viewBox={`0 0 ${PO.w} ${PO.h}`} style={{ position: "absolute", left: PO.x, top: PO.y }}>
        <PosterDefs />
        <rect width={PO.w} height={PO.h} fill={C.paper} />
        <clipPath id="sk-sheet">
          <rect x={0} y={0} width={PO.w} height={PO.h} />
        </clipPath>
        <g clipPath="url(#sk-sheet)">
          {children}
          <rect width={PO.w} height={PO.h} filter="url(#sk-mottle)" opacity={E.mottle * 0.5} style={{ mixBlendMode: "multiply" }} />
          <Pinholes />
        </g>
      </svg>
      <Tape x={PO.x + 20} y={PO.y + 14} rot={-38} seed={1} />
      <Tape x={PO.x + w - 20} y={PO.y + 14} rot={36} seed={2} />
      <Tape x={PO.x + 20} y={PO.y + h - 14} rot={34} seed={3} />
      <Tape x={PO.x + w - 20} y={PO.y + h - 14} rot={-40} seed={4} />
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The art area's frame (inside the paper border). */
export const ART = { x0: U.border, x1: U.w - U.border, y0: U.border, y1: U.art };

/**
 * The info band printed last in the near ink: the band, then its items left to right, one every 0.18 s, each pulled
 * in quickly from the left in its own ink.
 */
export const Band: React.FC<{ at: number; col: string; items: { col: string; node: React.ReactNode }[]; id: string }> = ({ at, col, items, id }) => {
  const [b0, b1] = U.band;
  return (
    <>
      <Ink id={`${id}-band`} at={at} col={col} d={`M ${U.border} ${b0} H ${U.w - U.border} V ${b1} H ${U.border} Z`} reg={[0, 0]} />
      {items.map((it, i) => (
        <Ink key={i} id={`${id}-i${i}`} at={at + R.pull.duration + 0.05 + i * R.item.duration} col={it.col} dir="right" dur={0.12} reg={[(i % 2) + 1, -(i % 3)]}>
          {it.node}
        </Ink>
      ))}
    </>
  );
};
