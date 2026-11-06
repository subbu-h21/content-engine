/**
 * Mid-century's pieces: off-register cels (a fill printed a few px off a broken, breathing ink line, re-rolled on
 * twos), one colour plane per scene with a floor band and a horizon line with gaps, slab type on off-register plates,
 * the script kicker, caption cards with coral stars, medallions, starbursts, atomic sparkles, boomerangs and kidneys,
 * round call-outs with dashed leaders, and an invented presenter (a held body whose arm does the step). Every value
 * comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, mix, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS, SCRIPT, SLAB } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const T = style.type;
const P = style.palette;
const col = (r: string) => color(P, r);
export const C = {
  paper: col("background"),
  paper2: col("surface"),
  paper3: col("muted"),
  ink: col("text"),
  coral: col("accent"),
  coralDark: col("faint"),
  turquoise: col("accent2"),
  turquoiseDark: col("turquoise-dark"),
  mustard: col("mustard"),
  mustardLight: col("mustard-light"),
  blue: col("dusty-blue"),
  avocado: col("avocado"),
  pink: col("pink"),
  plum: col("plum"),
  navy: col("navy"),
  hair: col("hair"),
  skin: col("skin"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const back = (p: number, s: number = R.pop.overshoot): number => {
  const u = clamp(p) - 1;
  return 1 + u * u * ((s + 1) * u + s);
};
export const pop = (t: number): number => (t <= 0 ? 0 : back(t / R.pop.duration));
export const useT = useSeconds;

/** The registration of the current drawing: a fixed offset plus a small jitter re-rolled at 12 fps. */
export const useReg = (seed = 0): [number, number] => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = Math.floor((frame / fps) * S.motion.twos);
  const r = seeded(k * 131 + seed * 17 + 3);
  return [E.reg.dx + (r() - 0.5) * 2 * E.reg.jit, E.reg.dy + (r() - 0.5) * 2 * E.reg.jit];
};

/** A broken ink line: ribbons of two widths with 12–25% of the length left out, seeded per shape. */
export const Ink: React.FC<{ d: string; seed?: number; w?: number; color?: string }> = ({ d, seed = 1, w = E.line, color: c = C.ink }) => {
  const r = seeded(seed * 97 + 5);
  const gaps = (share: number) => {
    const parts: number[] = [];
    let left = 100;
    while (left > 0) {
      const on = Math.min(left, 10 + r() * 22);
      const off = on * share;
      parts.push(on, off);
      left -= on + off;
    }
    return parts.map((v) => v.toFixed(1)).join(" ");
  };
  const [lo, hi] = E.breaks;
  const share = lo + r() * (hi - lo);
  return (
    <g fill="none" stroke={c} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} pathLength={100} strokeDasharray={gaps(share)} strokeWidth={w * (1 + E.breath)} />
      <path d={d} pathLength={100} strokeDasharray={gaps(share * 0.4)} strokeWidth={w * (1 - E.breath)} />
    </g>
  );
};

/** A cel: the fill printed off-register, then its broken line. `crisp` keeps diagrams in register. */
export const Cel: React.FC<{ d: string; fill: string; seed?: number; crisp?: boolean; line?: boolean; w?: number }> = ({ d, fill, seed = 1, crisp = false, line = true, w }) => {
  const [dx, dy] = useReg(seed);
  return (
    <g>
      <path d={d} fill={fill} transform={crisp ? undefined : `translate(${dx} ${dy})`} />
      {line ? <Ink d={d} seed={seed} w={w} /> : null}
    </g>
  );
};

export const circle = (x: number, y: number, r: number, ry = r): string => `M ${x - r} ${y} A ${r} ${ry} 0 1 0 ${x + r} ${y} A ${r} ${ry} 0 1 0 ${x - r} ${y} Z`;

/** An n-point starburst path. */
export const burst = (x: number, y: number, r0: number, r1: number, n: number, rot = 0): string =>
  `M ${Array.from({ length: n * 2 }, (_, i) => {
    const a = rot + (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? r1 : r0;
    return `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" L ")} Z`;

/** A four-point atomic sparkle: a filled star with sharp arms. */
export const Sparkle: React.FC<{ x: number; y: number; r: number; fill?: string; k?: number }> = ({ x, y, r, fill = C.paper, k = 1 }) => {
  const q = r * 0.16;
  return (
    <path
      transform={`translate(${x} ${y}) scale(${k})`}
      d={`M 0 ${-r} Q ${q} ${-q} ${r} 0 Q ${q} ${q} 0 ${r} Q ${-q} ${q} ${-r} 0 Q ${-q} ${-q} 0 ${-r} Z`}
      fill={fill}
    />
  );
};

/** A boomerang shape. */
export const boomerang = (x: number, y: number, s: number, a = 0): string => {
  const p = (u: number, v: number) => {
    const c = Math.cos(a);
    const n = Math.sin(a);
    return `${(x + (u * c - v * n) * s).toFixed(1)} ${(y + (u * n + v * c) * s).toFixed(1)}`;
  };
  return `M ${p(-90, 30)} Q ${p(-40, -70)} ${p(0, -60)} Q ${p(40, -70)} ${p(90, 30)} Q ${p(40, -14)} ${p(0, -14)} Q ${p(-40, -14)} ${p(-90, 30)} Z`;
};

/** A kidney shape. */
export const kidney = (x: number, y: number, s: number, a = 0): string => {
  const p = (u: number, v: number) => {
    const c = Math.cos(a);
    const n = Math.sin(a);
    return `${(x + (u * c - v * n) * s).toFixed(1)} ${(y + (u * n + v * c) * s).toFixed(1)}`;
  };
  return `M ${p(-70, 10)} C ${p(-90, -60)} ${p(0, -80)} ${p(50, -50)} C ${p(100, -20)} ${p(80, 50)} ${p(30, 50)} C ${p(0, 50)} ${p(0, 20)} ${p(-20, 30)} C ${p(-40, 44)} ${p(-60, 50)} ${p(-70, 10)} Z`;
};

/** Slab lettering: ink over an off-register plate of the same words. */
export const Slab: React.FC<{ text: string; x: number; y: number; size?: number; plate?: string; fill?: string; anchor?: "start" | "middle" | "end"; k?: number; seed?: number }> = ({
  text,
  x,
  y,
  size = T.title,
  plate = C.paper,
  fill = C.ink,
  anchor = "start",
  k = 1,
  seed = 2,
}) => {
  const [dx, dy] = useReg(seed);
  const off = E.plateOffset / Math.max(1, E.reg.dx);
  const common = { x, y, fontFamily: SLAB, fontSize: size, textAnchor: anchor } as const;
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <text {...common} fill={plate} transform={`translate(${dx * off} ${dy * off})`}>
        {text}
      </text>
      <text {...common} fill={fill}>
        {text}
      </text>
    </g>
  );
};

/** The script kicker: writes on left to right with a clip. */
export const Kicker: React.FC<{ text: string; x: number; y: number; t: number; at: number; fill?: string; size?: number; anchor?: "start" | "middle" }> = ({ text, x, y, t, at, fill = C.ink, size = T.kicker, anchor = "start" }) => {
  const p = ease("write", t - at);
  const id = `mc-k${Math.round(x)}${Math.round(y)}`;
  const w = text.length * size * 0.56;
  const left = anchor === "middle" ? x - w / 2 : x;
  return (
    <g>
      <clipPath id={id}>
        <rect x={left - 30} y={y - size * 1.2} width={(w + 60) * p} height={size * 1.6} />
      </clipPath>
      <text x={x} y={y} fontFamily={SCRIPT} fontWeight={700} fontSize={size} fill={fill} textAnchor={anchor} clipPath={`url(#${id})`}>
        {text}
      </text>
    </g>
  );
};

/** Small letter-spaced caps. */
export const Caps: React.FC<{ text: string; x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; opacity?: number }> = ({ text, x, y, size = T.small, fill = C.ink, anchor = "start", opacity = 1 }) => (
  <text x={x} y={y} fontFamily={SANS} fontWeight={600} fontSize={size} letterSpacing={size * T.smallTracking} fill={fill} textAnchor={anchor} opacity={opacity}>
    {text}
  </text>
);

/** Jost line. */
export const Line: React.FC<{ text: string; x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end" }> = ({ text, x, y, size = T.body, fill = C.ink, anchor = "start" }) => (
  <text x={x} y={y} fontFamily={SANS} fontWeight={500} fontSize={size} fill={fill} textAnchor={anchor}>
    {text}
  </text>
);

/** The caption card: a paper slab with a thin ink border, its colour cel off-register, coral stars at the ends. */
export const Card: React.FC<{ text: string; t: number; at: number; y?: number; size?: number }> = ({ text, t, at, y = style.layout.caption.y, size = T.body }) => {
  const p = ease("card", t - at);
  const [dx, dy] = useReg(9);
  if (p <= 0) return null;
  const w = Math.min(W - 2 * M, text.length * size * 0.48 + 170);
  const h = size * 2.1;
  const x = (W - w) / 2;
  const top = y - h / 2 + (1 - p) * R.card.rise;
  const spin = t * 40;
  return (
    <g opacity={p}>
      <rect x={x + dx} y={top + dy} width={w} height={h} rx={14} fill={C.paper} />
      <rect x={x} y={top} width={w} height={h} rx={14} fill="none" stroke={C.ink} strokeWidth={3} />
      <path d={burst(x + 46, y, 8, 22, 8, (spin * Math.PI) / 180)} fill={C.coral} />
      <path d={burst(x + w - 46, y, 8, 22, 8, (-spin * Math.PI) / 180)} fill={C.coral} />
      <Line text={text} x={W / 2} y={y + size * 0.34} size={size} anchor="middle" />
    </g>
  );
};

/** One ground per scene: the wall a tint of the colour, the floor a shade, a horizon line with gaps. */
export const Room: React.FC<{ color: string; floor?: number; under?: React.ReactNode; children?: React.ReactNode }> = ({ color: c, floor = style.layout.floor, under, children }) => {
  useFontsReady(FACES);
  const wall = mix(c, C.paper, E.wallTint);
  const flo = mix(c, C.ink, E.floorShade);
  return (
    <AbsoluteFill style={{ backgroundColor: wall }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="mc-tooth" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <feTurbulence type="fractalNoise" baseFrequency="0.6 0.09" numOctaves={2} seed={8} />
            <feColorMatrix type="matrix" values={`0 0 0 0 0.17  0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 ${S.finish.tooth * 6} ${-S.finish.tooth * 2.2}`} />
          </filter>
        </defs>
        {under}
        <rect x={0} y={floor} width={W} height={H - floor} fill={flo} />
        <Ink d={`M -10 ${floor} L ${W * 0.38} ${floor} M ${W * 0.46} ${floor} L ${W * 0.8} ${floor} M ${W * 0.86} ${floor} L ${W + 10} ${floor}`} seed={4} w={5} />
        {children}
        <rect width={W} height={H} filter="url(#mc-tooth)" />
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Sunburst rays at 55% from a point, up to `p` (0..1) of their length. */
export const Rays: React.FC<{ x: number; y: number; r: number; fill?: string; p?: number; n?: number; rot?: number }> = ({ x, y, r, fill = C.paper, p = 1, n = E.rays, rot = 0 }) => (
  <g opacity={0.55}>
    {Array.from({ length: n }, (_, i) => {
      const a0 = rot + (i / n) * Math.PI * 2;
      const a1 = a0 + Math.PI / n;
      const R0 = r * p;
      return <path key={i} d={`M ${x} ${y} L ${x + R0 * Math.cos(a0)} ${y + R0 * Math.sin(a0)} L ${x + R0 * Math.cos(a1)} ${y + R0 * Math.sin(a1)} Z`} fill={fill} />;
    })}
  </g>
);

/** A numbered medallion: a colour disc, an ink ring, and an ink disc with a paper numeral on its rim. */
export const Medallion: React.FC<{ x: number; y: number; n: number; fill: string; k?: number; r?: number; children?: React.ReactNode }> = ({ x, y, n, fill, k = 1, r = style.layout.medallion, children }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <Cel d={circle(x, y, r)} fill={fill} seed={n + 20} w={5} />
      {children}
      <circle cx={x - r * 0.72} cy={y - r * 0.72} r={42} fill={C.ink} />
      <text x={x - r * 0.72} y={y - r * 0.72 + 21} fontFamily={SLAB} fontSize={56} fill={C.paper} textAnchor="middle">
        {n}
      </text>
    </g>
  );
};

/** The presenter: a held drawing seen from the side, an egg head with the nose in its outline, a coral sweater, one working arm ending at `hand`. */
export const Presenter: React.FC<{ x: number; y: number; s?: number; hand: [number, number]; look?: number; bust?: boolean }> = ({ x, y, s = 1, hand, look = 0, bust = false }) => {
  const head = "M 44 -372 C 30 -420 -30 -432 -66 -398 C -102 -364 -96 -302 -60 -282 C -30 -266 12 -270 32 -292 L 40 -322 L 66 -330 L 44 -372";
  const hair = "M 46 -384 C 28 -436 -40 -446 -78 -398 C -96 -372 -92 -334 -74 -312 C -70 -340 -60 -354 -36 -364 C -6 -376 26 -372 46 -384 Z";
  const body = "M -66 -266 L 42 -266 L 62 -60 L -74 -60 Z";
  const legs = "M -62 -60 L 52 -60 L 44 118 L 2 118 L -4 -20 L -18 118 L -60 118 Z";
  const shoes = "M -62 116 L -8 116 L 4 142 L -66 142 Z M 0 116 L 52 116 L 92 142 L -2 142 Z";
  const sx = 34;
  const sy = -232;
  const hx = (hand[0] - x) / s;
  const hy = (hand[1] - y) / s;
  const mx = (sx + hx) / 2 - (hy - sy) * 0.06;
  const my = (sy + hy) / 2 + (hx - sx) * 0.06;
  const arm = `M ${sx} ${sy} Q ${mx} ${my} ${hx} ${hy}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {bust ? null : (
        <>
          <Cel d={legs} fill={C.navy} seed={31} />
          <Cel d={shoes} fill={C.ink} seed={32} line={false} />
        </>
      )}
      <Cel d={body} fill={C.coral} seed={33} />
      <path d="M -44 -210 L 38 -210 L 42 -180 L -46 -180 Z" fill={C.coralDark} opacity={0.5} />
      <Cel d={head} fill={C.skin} seed={34} />
      <Cel d={hair} fill={C.hair} seed={35} line={false} />
      <circle cx={8 + look * 3} cy={-340 - look * 5} r={8} fill={C.ink} />
      <Ink d={`M -6 ${-362 - look * 3} Q 8 ${-372 - look * 3} 24 ${-364 - look * 3}`} seed={36} w={3.4} />
      <Ink d="M 4 -300 Q 18 -294 28 -306" seed={37} w={3.4} />
      <path d={arm} fill="none" stroke={C.ink} strokeWidth={38} strokeLinecap="round" />
      <path d={arm} fill="none" stroke={C.coral} strokeWidth={28} strokeLinecap="round" />
      <g transform={`translate(${hx} ${hy}) rotate(${(Math.atan2(hy - my, hx - mx) * 180) / Math.PI + 90})`}>
        <path d="M -24 16 C -28 -6 -22 -20 -12 -20 L -10 -56 C -10 -66 2 -66 2 -56 L 4 -24 L 14 -36 C 20 -42 28 -34 24 -28 L 12 -8 L 16 16 Z" fill={C.skin} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** A round call-out: a frame in the frame, linked by a dashed leader. */
export const CallOut: React.FC<{ x: number; y: number; r: number; from?: [number, number]; k?: number; children?: React.ReactNode; id: string; fill?: string }> = ({ x, y, r, from, k = 1, children, id, fill = C.paper }) => {
  if (k <= 0) return null;
  return (
    <g>
      {from ? <line x1={from[0]} y1={from[1]} x2={x + (from[0] - x) * 0.82 * (r / Math.hypot(from[0] - x, from[1] - y)) * 1.2} y2={y + (from[1] - y) * 0.82 * (r / Math.hypot(from[0] - x, from[1] - y)) * 1.2} stroke={C.ink} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" /> : null}
      <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <Cel d={circle(x, y, r)} fill={fill} seed={40} crisp w={5} />
        <g clipPath={`url(#${id})`}>{children}</g>
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={5} />
      </g>
    </g>
  );
};
