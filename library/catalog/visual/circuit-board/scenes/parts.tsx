/**
 * Circuit Board's pieces: laminate, copper pour with weave, mottling, stitching vias and unlit routes, traces with a
 * bevelled rim and a laminate channel, ENIG pads, silkscreen plotted in a routed stroke font (0/45/90° strokes, round
 * caps, not a typeface), light running along traces (a blurred additive layer over a sharp core), and the macro
 * finish: depth-of-field bands, a key light pool, out-of-focus motes and a vignette. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, rgba, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const T = style.type;
const P = style.palette;
const col = (r: string) => color(P, r);
export const C = {
  laminate: col("background"),
  pour: col("surface"),
  silk: col("text"),
  trace: col("muted"),
  rim: col("faint"),
  amber: col("accent"),
  cyan: col("accent2"),
  gold: col("gold"),
  goldEdge: col("gold-edge"),
  drill: col("drill"),
  amberHead: col("current-head"),
  cyanHead: col("flow-head"),
  desk: col("desk"),
  via: col("via"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const useT = useSeconds;

export type Pt = [number, number];
export const path = (pts: Pt[]): string => `M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")}`;
export const lengthOf = (pts: Pt[]): number => pts.slice(1).reduce((n, q, i) => n + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);

/** A copper trace: laminate channel, bevelled rim, narrower fill; mitred corners. */
export const Trace: React.FC<{ pts: Pt[]; w?: number }> = ({ pts, w = E.trace }) => {
  const d = path(pts);
  const c = { fill: "none", strokeLinejoin: "miter" as const, strokeLinecap: "round" as const };
  return (
    <g>
      <path d={d} {...c} stroke={C.laminate} strokeWidth={w + E.rim + E.channel} />
      <path d={d} {...c} stroke={C.rim} strokeWidth={w + E.rim} />
      <path d={d} {...c} stroke={C.trace} strokeWidth={w} />
    </g>
  );
};

/** A stitching via. */
const Via: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = E.via.r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={C.via} opacity={0.85} />
    <circle cx={x} cy={y} r={r * 0.43} fill={C.drill} opacity={0.85} />
  </g>
);

/** An ENIG pad: gold with an edge, a sheen band on the top third, and a dark drill. `lit` flashes it. */
export const Pad: React.FC<{ x: number; y: number; r?: number; lit?: number; square?: boolean; drill?: boolean }> = ({ x, y, r = E.pad, lit = 0, square = false, drill = true }) => {
  const shape = (rr: number, fill: string, extra = {}) =>
    square ? <rect x={x - rr} y={y - rr} width={rr * 2} height={rr * 2} rx={rr * 0.12} fill={fill} {...extra} /> : <circle cx={x} cy={y} r={rr} fill={fill} {...extra} />;
  return (
    <g>
      {shape(r + 6, C.laminate)}
      {shape(r, C.goldEdge)}
      {shape(r - 3, C.gold)}
      <clipPath id={`pad${Math.round(x)}-${Math.round(y)}`}>{shape(r - 3, "#000")}</clipPath>
      <rect x={x - r} y={y - r} width={r * 2} height={r * 0.66} fill="rgba(255,240,190,0.28)" clipPath={`url(#pad${Math.round(x)}-${Math.round(y)})`} />
      {drill ? <circle cx={x} cy={y} r={r * 0.36} fill={C.drill} /> : null}
      {lit > 0 ? shape(r - 3, C.amberHead, { opacity: lit * 0.85 }) : null}
    </g>
  );
};

/** The routed stroke alphabet on a 4 × 6 grid: polylines at 0/45/90°, chamfered corners. */
const O = "1,0 3,0 4,1 4,5 3,6 1,6 0,5 0,1 1,0";
const P_ = "0,6 0,0 3,0 4,1 4,2 3,3 0,3";
const GLYPHS: Record<string, string[]> = {
  A: ["0,6 0,2 2,0 4,2 4,6", "0,4 4,4"],
  B: ["0,0 3,0 4,1 4,2 3,3 4,4 4,5 3,6 0,6 0,0", "0,3 3,3"],
  C: ["4,1 3,0 1,0 0,1 0,5 1,6 3,6 4,5"],
  D: ["0,0 3,0 4,1 4,5 3,6 0,6 0,0"],
  E: ["4,0 0,0 0,6 4,6", "0,3 3,3"],
  F: ["4,0 0,0 0,6", "0,3 3,3"],
  G: ["4,1 3,0 1,0 0,1 0,5 1,6 3,6 4,5 4,3 2,3"],
  H: ["0,0 0,6", "4,0 4,6", "0,3 4,3"],
  I: ["1,0 3,0", "2,0 2,6", "1,6 3,6"],
  J: ["4,0 4,5 3,6 1,6 0,5"],
  K: ["0,0 0,6", "4,0 1,3 0,3", "1,3 4,6"],
  L: ["0,0 0,6 4,6"],
  M: ["0,6 0,0 2,2 4,0 4,6"],
  N: ["0,6 0,0", "0,1 4,5", "4,0 4,6"],
  O: [O],
  P: [P_],
  Q: [O, "2,4 4,6"],
  R: [P_, "1,3 4,6"],
  S: ["4,1 3,0 1,0 0,1 0,2 1,3 3,3 4,4 4,5 3,6 1,6 0,5"],
  T: ["0,0 4,0", "2,0 2,6"],
  U: ["0,0 0,5 1,6 3,6 4,5 4,0"],
  V: ["0,0 0,4 2,6 4,4 4,0"],
  W: ["0,0 0,6 2,4 4,6 4,0"],
  X: ["0,0 0,1 4,5 4,6", "4,0 4,1 0,5 0,6"],
  Y: ["0,0 0,1 2,3 4,1 4,0", "2,3 2,6"],
  Z: ["0,0 4,0 4,1 0,5 0,6 4,6"],
  "0": [O, "1,4 3,2"],
  "1": ["1,1 2,0 2,6", "1,6 3,6"],
  "2": ["0,1 1,0 3,0 4,1 4,2 0,6 4,6"],
  "3": ["0,1 1,0 3,0 4,1 4,2 3,3 4,4 4,5 3,6 1,6 0,5", "1,3 3,3"],
  "4": ["3,6 3,0 0,3 0,4 4,4"],
  "5": ["4,0 0,0 0,3 3,3 4,4 4,5 3,6 1,6 0,5"],
  "6": ["3,0 1,0 0,1 0,5 1,6 3,6 4,5 4,4 3,3 0,3"],
  "7": ["0,0 4,0 4,1 2,3 2,6"],
  "8": ["1,0 3,0 4,1 4,2 3,3 4,4 4,5 3,6 1,6 0,5 0,4 1,3 0,2 0,1 1,0", "1,3 3,3"],
  "9": ["4,3 1,3 0,2 0,1 1,0 3,0 4,1 4,5 3,6 1,6"],
  ".": ["0.5,5.7 0.5,6"],
  ",": ["0.5,5.5 0.5,6.4"],
  "?": ["0,1 1,0 3,0 4,1 4,2 2,4 2,4.6", "2,5.8 2,6"],
  "×": ["0.5,1.5 3.5,4.5", "3.5,1.5 0.5,4.5"],
  "-": ["1,3 3,3"],
  "/": ["0,6 4,2"],
};
const WIDE: Record<string, number> = { ".": 1, ",": 1, " ": 3, I: 4 };
const adv = (c: string): number => (WIDE[c] ?? 4) + T.advance - 4;
export const silkWidth = (text: string, h: number): number => [...text].reduce((n, c) => n + adv(c), 0) * (h / 6) - ((T.advance - 4) * h) / 6;

/** Silkscreen: `text` plotted up to p (0..1), capital height h, x the left edge, y the top. */
export const Silk: React.FC<{ text: string; x: number; y: number; h?: number; p?: number; anchor?: "start" | "middle" | "end"; fill?: string; w?: number }> = ({ text, x, y, h = T.label, p = 1, anchor = "start", fill = C.silk, w }) => {
  if (p <= 0) return null;
  const u = h / 6;
  const total = silkWidth(text, h);
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  const chars = [...text.toUpperCase()];
  const out: React.ReactNode[] = [];
  const n = chars.length;
  chars.forEach((c, i) => {
    const q = clamp(p * n - i);
    const left = cx;
    cx += adv(c) * u;
    if (q <= 0) return;
    (GLYPHS[c] ?? []).forEach((line, j) => {
      const pts = line.split(" ").map((s) => s.split(",").map(Number));
      out.push(
        <polyline
          key={`${i}-${j}`}
          points={pts.map(([a, b]) => `${(left + a * u).toFixed(1)},${(y + b * u).toFixed(1)}`).join(" ")}
          fill="none"
          stroke={fill}
          strokeWidth={w ?? h * T.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${q} 1`}
        />,
      );
    });
  });
  return <g>{out}</g>;
};

/** A plain silkscreen outline with chamfered corners. */
export const SilkBox: React.FC<{ x: number; y: number; w: number; h: number; c?: number; p?: number; sw?: number }> = ({ x, y, w, h, c = 16, p = 1, sw = 4 }) => (
  <path
    d={`M ${x + c} ${y} L ${x + w - c} ${y} L ${x + w} ${y + c} L ${x + w} ${y + h - c} L ${x + w - c} ${y + h} L ${x + c} ${y + h} L ${x} ${y + h - c} L ${x} ${y + c} Z`}
    fill="none"
    stroke={C.silk}
    strokeWidth={sw}
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray={`${p} 1`}
  />
);

export type Flow = { pts: Pt[]; kind: "amber" | "cyan"; t: number; dash?: number; gap?: number; speed?: number; w?: number; p?: number };

/** Light along a trace: a stream of dashes moving from its start; `p` is how far it has reached. */
const stream = (f: Flow) => {
  const dash = f.dash ?? E.dash;
  const gap = f.gap ?? dash * 0.8;
  const len = lengthOf(f.pts);
  const reach = (f.p ?? 1) * len;
  const off = -((f.t * (f.speed ?? S.motion.flow)) % (dash + gap));
  return { d: path(f.pts), dash, gap, off, reach, len };
};

/** The light layer: everything in `flows`, twice blurred and once sharp, screen-blended over the board. */
export const Light: React.FC<{ flows: Flow[]; flashes?: { x: number; y: number; r: number; a: number; kind?: "amber" | "cyan" }[] }> = ({ flows, flashes = [] }) => {
  const [b1, b2] = S.finish.blur;
  const draw = (scale: number, core: boolean) =>
    flows.map((f, i) => {
      const s = stream(f);
      if (s.reach <= 0) return null;
      const id = `lc${i}`;
      return (
        <g key={i}>
          <mask id={`${id}${core ? "c" : "b"}${scale}`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <path d={s.d} fill="none" stroke="#fff" strokeWidth={80} pathLength={s.len} strokeDasharray={`${s.reach} ${s.len + 10}`} />
          </mask>
          <path
            d={s.d}
            fill="none"
            mask={`url(#${id}${core ? "c" : "b"}${scale})`}
            stroke={f.kind === "amber" ? (core ? C.amberHead : C.amber) : core ? C.cyanHead : C.cyan}
            strokeWidth={(f.w ?? E.trace) * scale}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={s.off}
            strokeLinecap={s.dash > 16 ? "round" : "butt"}
          />
        </g>
      );
    });
  const dots = (k: number) =>
    flashes.map((f, i) => (f.a > 0 ? <circle key={i} cx={f.x} cy={f.y} r={f.r * k} fill={f.kind === "cyan" ? C.cyan : C.amber} opacity={f.a} /> : null));
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <filter id="cb-b1" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={b1 / 2} />
        </filter>
        <filter id="cb-b2" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={b2 / 2} />
        </filter>
      </defs>
      <g filter="url(#cb-b1)" opacity={0.7}>
        {draw(1.5, false)}
        {dots(1.9)}
      </g>
      <g filter="url(#cb-b2)" opacity={0.9}>
        {draw(1, false)}
        {dots(1.2)}
      </g>
      {draw(0.42, true)}
    </svg>
  );
};

type Rect = [number, number, number, number];
const inside = (x: number, y: number, r: Rect, pad = 30) => x > r[0] - pad && x < r[0] + r[2] + pad && y > r[1] - pad && y < r[1] + r[3] + pad;

/** The pour: weave, mottling, unlit routes and stitching vias, kept out of the areas in `clear` (type sits there). */
const Pour: React.FC<{ clear: Rect[]; seed: number }> = ({ clear, seed }) => {
  const rnd = seeded(seed * 53 + 9);
  const sp = E.via.spacing;
  const vias: Pt[] = [];
  for (let y = sp / 2; y < H; y += sp) {
    for (let x = sp / 2; x < W; x += sp) {
      if (rnd() < 0.2 && !clear.some((r) => inside(x, y, r))) vias.push([x, y]);
    }
  }
  const routes: Pt[][] = [];
  for (let i = 0; i < 26; i++) {
    const x = 40 + Math.floor(rnd() * 25) * 40;
    const y0 = 40 + Math.floor(rnd() * 42) * 44;
    const l = 120 + rnd() * 360;
    const j = (rnd() < 0.5 ? -1 : 1) * 60;
    const pts: Pt[] = [[x, y0], [x, y0 + l * 0.5], [x + j, y0 + l * 0.5 + Math.abs(j)], [x + j, y0 + l]];
    if (!pts.some(([a, b]) => clear.some((r) => inside(a, b, r, 44)))) routes.push(pts);
  }
  return (
    <>
      <rect width={W} height={H} fill={C.pour} />
      <filter id="cb-mottle" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={seed} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.01  0 0 0 0 0.09  0 0 0 0 0.05  0 0 0 1.6 -0.55" />
      </filter>
      <rect width={W} height={H} filter="url(#cb-mottle)" />
      <defs>
        <pattern id="cb-weave" width={12} height={12} patternUnits="userSpaceOnUse">
          <rect width={6} height={6} fill="rgba(120,200,150,0.045)" />
          <rect x={6} y={6} width={6} height={6} fill="rgba(120,200,150,0.03)" />
          <rect x={6} width={6} height={6} fill="rgba(0,0,0,0.1)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#cb-weave)" />
      {routes.map((r, i) => (
        <Trace key={i} pts={r} w={E.route} />
      ))}
      {vias.map(([x, y], i) => (
        <Via key={i} x={x} y={y} />
      ))}
    </>
  );
};

/** The macro finish in screen space: depth-of-field bands, the key light pool, motes, the vignette. */
const Macro: React.FC = () => {
  const rnd = seeded(77);
  const motes = Array.from({ length: S.finish.motes }, () => ({
    x: rnd() * W,
    y: rnd() * H,
    r: 14 + rnd() * 46,
    a: 0.025 + rnd() * 0.05,
    warm: rnd() < 0.6,
  }));
  const band = S.layout.bands * H;
  const blur = 2 + S.finish.dof.blur;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: band * 1.25, backdropFilter: `blur(${blur}px)`, maskImage: "linear-gradient(to bottom, #000 45%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, height: band * 1.25, backdropFilter: `blur(${blur}px)`, maskImage: "linear-gradient(to top, #000 45%, transparent)", WebkitMaskImage: "linear-gradient(to top, #000 45%, transparent)" }} />
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `radial-gradient(ellipse 80% 42% at 30% 22%, rgba(255,246,220,${S.finish.key}) 0%, rgba(255,246,220,0) 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
        <filter id="cb-mote" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <g filter="url(#cb-mote)">
          {motes.map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={m.warm ? "rgb(255,206,130)" : "rgb(210,240,250)"} opacity={m.a} />
          ))}
        </g>
      </svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 72% 58% at 50% 50%, rgba(0,10,6,0) 40%, rgba(0,10,6,${S.finish.vignette}) 100%)` }} />
    </>
  );
};

/** The board: `under` is copper, `clear` the type's keep-outs, `flows` the light; `over` is silkscreen and pads drawn above light's core. */
export const Board: React.FC<{ clear?: Rect[]; seed?: number; copper?: React.ReactNode; silk?: React.ReactNode; flows?: Flow[]; flashes?: { x: number; y: number; r: number; a: number; kind?: "amber" | "cyan" }[]; children?: React.ReactNode; desk?: boolean }> = ({
  clear = [],
  seed = 4,
  copper,
  silk,
  flows = [],
  flashes = [],
  children,
}) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.laminate, overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Pour clear={clear} seed={seed} />
        {copper}
      </svg>
      <Light flows={flows} flashes={flashes} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {silk}
      </svg>
      <Macro />
      {children}
      <Finish grain={S.finish.grain} vignette={0} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The subtitle plate: dark, translucent, the open sans. Comes and goes with the voice. */
export const Plate: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  const a = clamp((t - at) / 0.2);
  if (a <= 0) return null;
  const { y, pad, alpha } = style.layout.plate;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: "translate(-50%, -50%)",
        padding: `${pad * 0.5}px ${pad}px`,
        backgroundColor: rgba(C.laminate, alpha),
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: T.body,
        color: C.silk,
        whiteSpace: "nowrap",
        borderRadius: 6,
        opacity: a,
      }}
    >
      {text}
    </div>
  );
};
