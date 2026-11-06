/**
 * Pictogram's pieces: a card in one hue (five tones) over the square-grid pattern of discs and motif cells whose rows
 * drift sideways; the sun-disc stage with one slow light sweep; faceless geometric figures built from capsules (far
 * limbs mixed 42% toward the ground) that assemble from sliding bands; titles sliding up out of masks; DM Mono meta
 * that types on; tag chips; HUD corners and the progress ticks. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, TITLE } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  cream: color(P, "text"),
  ink: color(P, "ink"),
  darkFg: color(P, "darkFg"),
  coral: color(P, "accent"),
  sand: color(P, "accent2"),
};
export type HueName = keyof typeof style.hues;
export const HUES = style.hues as Record<HueName, string[]>;
/** The type and figure colour on a hue: cream on dark and mid hues, the dark foreground on light ones. */
export const fgOn = (hue: HueName): string => ((style.light as string[]).includes(hue) ? C.darkFg : C.cream);
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const L = style.layout;
const E = style.elements;
export const CELL = L.cell;
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

/* ---------- the pattern ---------- */

type Part = { d: string; tone: number };
const circ = (x: number, y: number, r: number) => `M ${f1(x - r)} ${f1(y)} a ${f1(r)} ${f1(r)} 0 1 1 ${f1(2 * r)} 0 a ${f1(r)} ${f1(r)} 0 1 1 ${f1(-2 * r)} 0 Z`;
const circCCW = (x: number, y: number, r: number) => `M ${f1(x - r)} ${f1(y)} a ${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a ${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0 Z`;

/** Twelve generic motifs, drawn in a cell of size c with its corner at the origin (rotated later). */
const MOTIFS: ((c: number, s: number) => Part[])[] = [
  (c) => [{ d: `M 0 0 L ${c} 0 A ${c} ${c} 0 0 1 0 ${c} Z`, tone: 3 }], // quarter-disc
  (c) => [{ d: `M 0 ${c} A ${c / 2} ${c / 2} 0 0 1 ${c} ${c} Z`, tone: 4 }], // half-disc
  (c) => [
    { d: circ(c / 2, c / 2, c * 0.42), tone: 3 },
    { d: circ(c / 2, c / 2, c * 0.14), tone: 0 },
  ], // disc + dot
  (c) => [{ d: `M 0 ${c} A ${c / 2} ${c / 2} 0 0 1 ${c} ${c} Z ${[0.62, 0.75, 0.88].map((k) => `M 0 ${c * k} H ${c} V ${c * k + c * 0.05} H 0 Z`).join(" ")}`, tone: 4 }], // striped sunset (stripes cut by evenodd)
  (c) => [0, 1, 2].map((k) => ({ d: [0, 1, 2, 3].map((i) => `M ${(c / 4) * i} ${c * (0.4 + k * 0.25)} a ${c / 8} ${c / 8} 0 0 1 ${c / 4} 0 Z`).join(" "), tone: k % 2 ? 4 : 3 })), // fish-scale waves
  (c) => [c, c * 0.72, c * 0.44].map((r, i) => ({ d: `M 0 0 L ${r} 0 A ${r} ${r} 0 0 1 0 ${r} Z`, tone: [0, 3, 4][i] })), // concentric arcs
  (c) => [{ d: `M 0 0 h ${c / 2} v ${c / 2} h ${-c / 2} Z M ${c / 2} ${c / 2} h ${c / 2} v ${c / 2} h ${-c / 2} Z`, tone: 3 }], // checker
  (c) => [{ d: `${circ(c / 2, c / 2, c * 0.42)} ${circCCW(c * 0.64, c * 0.42, c * 0.36)}`, tone: 4 }], // crescent
  (c) => [{ d: `M 0 ${c} L ${c / 2} 0 L ${c} ${c} Z`, tone: 3 }, { d: `M ${c * 0.25} ${c} L ${c / 2} ${c * 0.5} L ${c * 0.75} ${c} Z`, tone: 0 }], // triangle scales
  (c) => [0.36, 0.24, 0.14, 0.06].map((k, i) => ({ d: `M 0 ${c * (0.08 + i * 0.25)} H ${c} V ${c * (0.08 + i * 0.25) + c * k * 0.5} H 0 Z`, tone: 4 })), // fading bars
  (c) => {
    let d = circ(c / 2, c / 2, c * 0.28);
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 * i) / 8;
      const p = (r: number, da: number) => `${f1(c / 2 + Math.cos(a + da) * r)} ${f1(c / 2 + Math.sin(a + da) * r)}`;
      d += ` M ${p(c * 0.3, -0.18)} L ${p(c * 0.46, 0)} L ${p(c * 0.3, 0.18)} Z`;
    }
    return [{ d, tone: 3 }];
  }, // sun wheel
  (c) => [{ d: `M 0 ${c / 2} A ${c / 4} ${c / 4} 0 0 1 ${c / 2} ${c / 2} A ${c / 4} ${c / 4} 0 0 0 ${c} ${c / 2} L ${c} ${c * 0.62} A ${c / 4} ${c / 4} 0 0 1 ${c / 2} ${c * 0.62} A ${c / 4} ${c / 4} 0 0 0 0 ${c * 0.62} Z`, tone: 4 }], // S-wave
];

/**
 * The core graphic: the hue's t1 ground; on each grid node a 34% chance of a cell-radius disc in a random tone and a
 * 16% chance of a t3 disc with a t0 half-radius disc inside; then half the cells get a motif, turned by 90° steps.
 * Odd rows drift right and even rows left at 26 px/s. `spread` pulls tones toward the ground (0.42 under type).
 */
export const Pattern: React.FC<{ hue: HueName; spread?: number; seed?: number; rows?: [number, number]; drift?: boolean; multi?: boolean }> = ({
  hue,
  spread = E.pattern.underType,
  seed = 1,
  rows = [0, Math.ceil(H / CELL)],
  drift = true,
  multi = false,
}) => {
  const t = useSeconds();
  const tones = HUES[hue];
  const base = tones[1];
  const cells = useMemo(() => {
    const out: { row: number; x: number; y: number; parts: Part[]; rot: number; hue: HueName }[] = [];
    const names = Object.keys(HUES).filter((h) => h !== "ink") as HueName[];
    for (let r = rows[0]; r < rows[1]; r++) {
      for (let c = -1; c <= Math.ceil(W / CELL); c++) {
        const k = seed * 1000 + r * 37 + c;
        const h = multi ? names[Math.floor(rand(k + 900) * names.length)] : hue;
        const parts: Part[] = [];
        const u = rand(k);
        if (u < E.pattern.disc) parts.push({ d: circ(CELL / 2, CELL / 2, CELL / 2), tone: Math.floor(rand(k + 1) * 5) });
        else if (u < E.pattern.disc + E.pattern.ringed) parts.push({ d: circ(CELL / 2, CELL / 2, CELL / 2), tone: 3 }, { d: circ(CELL / 2, CELL / 2, CELL / 4), tone: 0 });
        if (rand(k + 2) < E.pattern.density) parts.push(...MOTIFS[Math.floor(rand(k + 3) * MOTIFS.length)](CELL, k));
        out.push({ row: r, x: c * CELL, y: r * CELL, parts, rot: Math.floor(rand(k + 4) * 4) * 90, hue: h });
      }
    }
    return out;
  }, [hue, seed, rows[0], rows[1], multi]);
  return (
    <svg width={W} height={H} style={abs}>
      <rect width={W} height={H} fill={base} />
      {cells.map((cl, i) => {
        const dir = cl.row % 2 ? 1 : -1;
        const off = drift ? (((dir * E.pattern.drift * t + 30 * Math.sin(cl.row * 1.7)) % CELL) + CELL) % CELL - CELL / 2 : 0;
        const tn = HUES[cl.hue];
        return (
          <g key={i} transform={`translate(${f1(cl.x + off)} ${cl.y}) rotate(${cl.rot} ${CELL / 2} ${CELL / 2})`}>
            {cl.parts.map((p, j) => (
              <path key={j} d={p.d} fill={mix(base, tn[p.tone], spread)} fillRule="evenodd" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- the figure ---------- */

/** A pose: angles in degrees from hanging straight down (positive = forward, 180 = straight up). */
export type Pose = { lean: number; head: number; near: [number, number]; far: [number, number]; legNear: [number, number]; legFar: [number, number] };
export const POSES: Record<string, Pose> = {
  lookUp: { lean: -8, head: -34, near: [128, 14], far: [-38, -18], legNear: [16, -10], legFar: [-14, 8] },
  open: { lean: 0, head: -12, near: [138, 10], far: [-138, -10], legNear: [16, -4], legFar: [-16, 4] },
  stand: { lean: 0, head: 0, near: [10, -6], far: [-10, 6], legNear: [4, 0], legFar: [-4, 0] },
  reach: { lean: 8, head: -14, near: [118, 6], far: [30, 40], legNear: [22, -28], legFar: [-18, 4] },
};

const dirv = (deg: number): [number, number] => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];

/** The figure's shapes (capsules and a head), drawn far leg, far arm, torso, near leg, near arm, head. */
const FigureShapes: React.FC<{ x: number; y: number; h: number; pose: Pose; fg: string; farCol: string; flip?: boolean }> = ({ x, y, h, pose, fg, farCol, flip = false }) => {
  const F = E.figure;
  const s = flip ? -1 : 1;
  const pt = (o: [number, number], deg: number, len: number): [number, number] => {
    const [dx, dy] = dirv(deg);
    return [o[0] + s * dx * len * h, o[1] + dy * len * h];
  };
  const hip: [number, number] = [x, y];
  const sh = pt(hip, 180 + pose.lean, F.torso);
  const neck = pt(sh, 180 + pose.lean + pose.head, F.neck);
  const head = pt(neck, 180 + pose.lean + pose.head, F.head);
  const limb = (o: [number, number], a: number, b: number, l1: number, l2: number) => {
    const m = pt(o, a, l1);
    return [o, m, pt(m, a + b, l2)];
  };
  const seg = (pts: [number, number][], w: number, col: string) => (
    <polyline points={pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join(" ")} fill="none" stroke={col} strokeWidth={w * h} strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <g>
      {seg(limb(hip, pose.legFar[0], pose.legFar[1], F.thigh, F.shin) as [number, number][], F.legW, farCol)}
      {seg(limb(sh, pose.far[0], pose.far[1], F.upperArm, F.forearm) as [number, number][], F.armW, farCol)}
      {seg([hip, sh], F.torsoW, fg)}
      {seg(limb(hip, pose.legNear[0], pose.legNear[1], F.thigh, F.shin) as [number, number][], F.legW, fg)}
      {seg(limb(sh, pose.near[0], pose.near[1], F.upperArm, F.forearm) as [number, number][], F.armW, fg)}
      <circle cx={head[0]} cy={head[1]} r={F.head * h} fill={fg} />
    </g>
  );
};

/**
 * A faceless pictogram figure (hip at x, y; `h` = body height). For its first 0.42 s it is cut into 54 px bands
 * offset alternately left and right by 90–250 px, which slide into register.
 */
export const Figure: React.FC<{ x: number; y: number; h: number; pose: Pose; fg: string; ground: string; at: number; flip?: boolean; id: string }> = ({ x, y, h, pose, fg, ground, at, flip, id }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("assemble", t);
  const farCol = mix(fg, ground, E.figure.farMix);
  const shapes = <FigureShapes x={x} y={y} h={h} pose={pose} fg={fg} farCol={farCol} flip={flip} />;
  if (p >= 1) return shapes;
  const band = E.figure.band;
  const top = y - h * 0.65;
  const n = Math.ceil((h * 1.15) / band) + 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const off = (i % 2 ? 1 : -1) * (90 + rand(i + 7) * 160) * (1 - p);
        return (
          <g key={i}>
            <clipPath id={`${id}-b${i}`}>
              <rect x={x - h} y={top + i * band} width={2 * h} height={band + 0.5} />
            </clipPath>
            <g clipPath={`url(#${id}-b${i})`} transform={`translate(${f1(off)} 0)`}>
              {shapes}
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** The stage: a sun disc (grows in) crossed by one slow 9% white light sweep, the only gradient. */
export const Disc: React.FC<{ cx: number; cy: number; r?: number; col: string; at: number; id: string; rings?: string[] }> = ({ cx, cy, r = E.disc.r, col, at, id, rings }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("disc", t);
  const sweep = ((t * 0.25) % 1.6) - 0.3;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-c`}>
          <circle cx={cx} cy={cy} r={r * p} />
        </clipPath>
        <linearGradient id={`${id}-g`} x1={0} y1={0} x2={1} y2={1}>
          <stop offset={Math.max(0, sweep - 0.12)} stopColor="#fff" stopOpacity={0} />
          <stop offset={Math.max(0, sweep)} stopColor="#fff" stopOpacity={E.disc.sweep} />
          <stop offset={Math.min(1, sweep + 0.12)} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * p} fill={col} />
      {rings
        ? rings.map((rc, i) => <circle key={i} cx={cx} cy={cy} r={r * p * (1 - (i + 1) / (rings.length + 1.4))} fill={rc} />)
        : null}
      <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill={`url(#${id}-g)`} clipPath={`url(#${id}-c)`} />
    </g>
  );
};

/* ---------- type ---------- */

/** Title lines in Inter Tight 900 capitals sliding up out of a mask; each next line 0.08 s later. */
export const Title: React.FC<{ lines: string[]; x?: number; y: number; size: number; at: number; col: string; align?: "left" | "right" | "center"; weight?: number; ghost?: boolean }> = ({
  lines,
  x = M,
  y,
  size,
  at,
  col,
  align = "left",
  weight = 900,
}) => {
  const t = useSeconds() - at;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? 0 : undefined,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: TITLE,
        fontWeight: weight,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        letterSpacing: `${T.tracking}em`,
        color: col,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      {lines.map((l, i) => {
        const p = ease("title", t - i * R.title.second);
        return (
          <div key={i} style={{ overflow: "hidden", paddingTop: size * 0.06, marginTop: -size * 0.06 }}>
            <div style={{ transform: `translateY(${(1 - p) * 105}%)` }}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

/** DM Mono meta that types on (no caret), widely spaced: `SKY   01 / 06`. */
export const Meta: React.FC<{ text: string; x?: number; y: number; at: number; col: string; align?: "left" | "right"; size?: number }> = ({ text, x = M, y, at, col, align = "left", size = T.meta }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const n = Math.min(text.length, Math.floor(t / R.type.duration));
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? W - x : undefined, top: y - size * 0.8, fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: T.metaTracking, color: col, whiteSpace: "pre" }}>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

/** A mono tag chip (`IN · SUNLIGHT`), outlined or filled; slides up 0.2 s after its title. */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; col: string; fill?: string }> = ({ text, x, y, at, col, fill }) => {
  const p = ease("title", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, overflow: "hidden" }}>
      <div style={{ transform: `translateY(${(1 - p) * 105}%)`, padding: "6px 14px", border: `2px solid ${fill ?? col}`, backgroundColor: fill ?? "transparent", borderRadius: 4, fontFamily: MONO, fontWeight: 500, fontSize: T.meta, letterSpacing: 2, color: fill ? C.cream : col, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/** HUD corners and the progress bar: `n` ticks, the current one tall, done ones at 75%, the rest at 28%. */
export const Hud: React.FC<{ index: number; total: number; topLeft: string; bottomLeft: string; col: string }> = ({ index, total, topLeft, bottomLeft, col }) => {
  const tk = E.ticks;
  const w = 360;
  const gap = w / total;
  return (
    <>
      <Meta text={topLeft} y={L.hudTop} at={0} col={col} size={T.hud} />
      <Meta text={`${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} x={W - M} y={L.hudTop} at={0} col={col} align="right" size={T.hud} />
      <Meta text={bottomLeft} y={L.hudBottom} at={0} col={col} size={T.hud} />
      <svg width={W} height={H} style={abs}>
        {Array.from({ length: total }, (_, i) => {
          const now = i === index - 1;
          return <rect key={i} x={W - M - w + i * gap} y={L.hudBottom - (now ? 30 : 14)} width={now ? tk.now : 3} height={now ? 30 : 14} fill={col} opacity={i < index - 1 ? tk.done : now ? 1 : tk.todo} />;
        })}
      </svg>
    </>
  );
};

/** The card: its pattern ground and the finish. Waits for the fonts. */
export const Card: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => {
  useFontsReady(FACES);
  useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: bg ?? HUES.sky[1], overflow: "hidden" }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={abs}>
    {children}
  </svg>
);
