/**
 * Data Story's pieces: cream paper with fibre noise and a dot grid, the data itself ((700 ÷ λ)⁴, computed, never typed),
 * plot axes, data dots with a landing pop, wobbly pencil strokes with graphite grain, handwriting written on letter by
 * letter, un-closed rings, the red-blue pencil, and the figure caption under a hairline rule. Every value comes from
 * style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, HAND, MONO, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const T = style.type;
export const PLOT = style.layout.plot;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  ink: color(P, "text"),
  tick: color(P, "muted"),
  grid: color(P, "faint"),
  red: color(P, "accent"),
  blue: color(P, "accent2"),
  dots: color(P, "dots"),
  zero: color(P, "zero"),
  wood: color(P, "wood"),
};
export const RAMP = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => color(P, `ramp-${i}`));
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);

/** Sample a ramp at u in 0..1. */
export const rampAt = (u: number): string => {
  const x = clamp(u) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  return mix(RAMP[i], RAMP[i + 1], x - i);
};

/** The data: Rayleigh scattering relative to red at 700 nm, (700 ÷ λ)⁴. Computed here, so every mark is true. */
export const REF = 700;
export const scatter = (nm: number): number => Math.pow(REF / nm, 4);
export const WAVES = Array.from({ length: 13 }, (_, i) => 400 + i * 25);

/** A plot: wavelength across (400 at the left), scattering up. */
export const makePlot = (p = PLOT, yMax = 10, xMin = 400, xMax = 700) => ({
  ...p,
  yMax,
  x: (nm: number) => lerp(p.left, p.right, (nm - xMin) / Math.max(1, xMax - xMin)),
  y: (v: number) => lerp(p.bottom, p.top, v / yMax),
});
export type Plot = ReturnType<typeof makePlot>;

/** Points along a list with a small seeded wobble, joined by a smooth path (never a ruler line). */
export const pencilPath = (pts: [number, number][], seed = 1, amp: number = E.wobble): string => {
  const rnd = seeded(seed * 977 + 13);
  const dense: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 46));
    for (let j = 0; j < n; j++) {
      const f = j / n;
      dense.push([lerp(ax, bx, f) + (rnd() - 0.5) * 2 * amp, lerp(ay, by, f) + (rnd() - 0.5) * 2 * amp]);
    }
  }
  dense.push(pts[pts.length - 1]);
  let d = `M ${dense[0][0].toFixed(1)} ${dense[0][1].toFixed(1)}`;
  for (let i = 1; i < dense.length - 1; i++) {
    const mx = (dense[i][0] + dense[i + 1][0]) / 2;
    const my = (dense[i][1] + dense[i + 1][1]) / 2;
    d += ` Q ${dense[i][0].toFixed(1)} ${dense[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = dense[dense.length - 1];
  return `${d} L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
};

/** A pencil stroke drawn on up to p (0..1). */
export const Stroke: React.FC<{ d: string; lead?: string; p?: number; width?: number; dash?: string }> = ({ d, lead = C.blue, p = 1, width = E.pencilStroke, dash }) =>
  p <= 0 ? null : (
    <path d={d} fill="none" stroke={lead} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={dash ? undefined : 1} strokeDasharray={dash ?? `${p} 1`} />
  );

/** An un-closed ring round a mark: it overshoots its start and doesn't meet it. */
export const Ring: React.FC<{ x: number; y: number; rx: number; ry?: number; lead?: string; p?: number; seed?: number; width?: number }> = ({ x, y, rx, ry = rx, lead = C.red, p = 1, seed = 2, width = E.pencilStroke }) => {
  const rnd = seeded(seed * 131 + 7);
  const a0 = -2.1 + rnd() * 0.4;
  const pts: [number, number][] = Array.from({ length: 19 }, (_, i) => {
    const f = i / 18;
    const a = a0 + f * Math.PI * 1.9;
    const k = 1 + 0.07 * f + (rnd() - 0.5) * 0.03;
    return [x + rx * k * Math.cos(a), y + ry * k * Math.sin(a)];
  });
  return <Stroke d={pencilPath(pts, seed, 0.6)} lead={lead} p={p} width={width} />;
};

/** Handwriting: per-glyph rotation and baseline jitter, written on left to right. */
export const Hand: React.FC<{ text: string; x: number; y: number; lead?: string; p?: number; size?: number; seed?: number; weight?: number; anchor?: "start" | "middle" | "end" }> = ({
  text,
  x,
  y,
  lead = C.blue,
  p = 1,
  size = T.hand,
  seed = 3,
  weight = 600,
  anchor = "start",
}) => {
  const rnd = seeded(seed * 311 + 5);
  const chars = [...text];
  const rot = chars.map(() => ((rnd() - 0.5) * 2 * T.glyphRotate).toFixed(2));
  let prev = 0;
  const dy = chars.map(() => {
    const v = (rnd() - 0.5) * 2 * T.glyphJitter * size;
    const d = v - prev;
    prev = v;
    return d.toFixed(2);
  });
  const shown = Math.ceil(clamp(p) * chars.length);
  if (shown <= 0) return null;
  // the full text keeps the anchor, the unwritten part stays invisible
  return (
    <text x={x} y={y} fontFamily={HAND} fontSize={size} fontWeight={weight} fill={lead} textAnchor={anchor} rotate={rot.join(" ")} dy={dy.join(" ")}>
      {chars.map((c, i) => (
        <tspan key={i} opacity={i < shown ? 1 : 0}>
          {c}
        </tspan>
      ))}
    </text>
  );
};

/** Mono text for ticks and kickers. */
export const Mono: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; children: React.ReactNode; opacity?: number; weight?: number }> = ({
  x,
  y,
  size = T.tick,
  fill = C.tick,
  anchor = "start",
  children,
  opacity = 1,
  weight = 400,
}) => (
  <text x={x} y={y} fontFamily={MONO} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={opacity}>
    {children}
  </text>
);

/** Serif text in the frame (world-space headline). */
export const Serif: React.FC<{ x: number; y: number; size?: number; weight?: number; fill?: string; anchor?: "start" | "middle" | "end"; children: React.ReactNode; opacity?: number; italic?: boolean }> = ({
  x,
  y,
  size = T.display,
  weight = 500,
  fill = C.ink,
  anchor = "start",
  children,
  opacity = 1,
  italic = false,
}) => (
  <text x={x} y={y} fontFamily={SERIF} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={opacity} fontStyle={italic ? "italic" : "normal"}>
    {children}
  </text>
);

/** Axes that grow out of the origin, gridlines, ticks and axis labels. */
export const Axes: React.FC<{ plot: Plot; p?: number; xTicks?: number[]; yTicks: number[]; xLabel?: string; yLabel?: string; unit?: string }> = ({ plot, p = 1, xTicks = [], yTicks, xLabel, yLabel, unit = "" }) => {
  const a = clamp(p * 1.4);
  return (
    <g>
      {yTicks.map((v) => (
        <g key={v} opacity={clamp(p * 2 - 0.6)}>
          {v > 0 ? <line x1={plot.left} y1={plot.y(v)} x2={plot.right} y2={plot.y(v)} stroke={C.grid} strokeWidth={E.grid} /> : null}
          <Mono x={plot.left - 16} y={plot.y(v) + 9} anchor="end">
            {v}
            {unit}
          </Mono>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={v} opacity={clamp(p * 2 - 0.6)}>
          <line x1={plot.x(v)} y1={plot.bottom} x2={plot.x(v)} y2={plot.bottom + 12} stroke={C.ink} strokeWidth={E.axis * 0.7} />
          <Mono x={plot.x(v)} y={plot.bottom + 46} anchor="middle">
            {v}
          </Mono>
        </g>
      ))}
      <line x1={plot.left} y1={plot.bottom} x2={lerp(plot.left, plot.right, a)} y2={plot.bottom} stroke={C.ink} strokeWidth={E.axis} strokeLinecap="round" />
      <line x1={plot.left} y1={plot.bottom} x2={plot.left} y2={lerp(plot.bottom, plot.top, a)} stroke={C.ink} strokeWidth={E.axis} strokeLinecap="round" />
      {xLabel ? (
        <Mono x={plot.right} y={plot.bottom + 86} anchor="end" size={T.kicker} opacity={clamp(p * 2 - 1)}>
          {xLabel}
        </Mono>
      ) : null}
      {yLabel ? (
        <Mono x={plot.left - 60} y={plot.top - 30} size={T.kicker} opacity={clamp(p * 2 - 1)}>
          {yLabel}
        </Mono>
      ) : null}
    </g>
  );
};

/** A data dot with a 0.25 s landing pop to ×1.55 and a thin ripple. */
export const Dot: React.FC<{ x: number; y: number; fill: string; t: number; at: number; r?: number }> = ({ x, y, fill, t, at, r = E.dot }) => {
  const u = t - at;
  if (u < 0) return null;
  const d = R.tap.duration;
  const k = u < d ? lerp(R.tap.pop, 1, ease("tap", u)) : 1;
  const rip = clamp(u / 0.4);
  return (
    <g>
      {rip < 1 ? <circle cx={x} cy={y} r={r * (1 + rip * 2.4)} fill="none" stroke={C.ink} strokeWidth={1.2} opacity={1 - rip} /> : null}
      <circle cx={x} cy={y} r={r * k} fill={fill} stroke={C.ink} strokeWidth={E.dotRing} />
    </g>
  );
};

/** The red-blue pencil: only the tip end shows, entering from the lower right; lead picks which half is in use. */
export const Pencil: React.FC<{ x: number; y: number; lead?: string; angle?: number; lift?: number }> = ({ x, y, lead = C.blue, angle = E.pencil.angle, lift = 0 }) => {
  const a = (angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const w = E.pencil.width / 2;
  const cone = E.pencil.cone;
  const L = 1400;
  const q = (al: number, ac: number): string => `${(x + ux * al + nx * ac).toFixed(1)},${(y + uy * al + ny * ac).toFixed(1)}`;
  const body = lead;
  const dark = mix(lead, "#000000", 0.28);
  const lite = mix(lead, "#ffffff", 0.22);
  const tip = cone * 0.22;
  const sh = 8 + lift * 34;
  return (
    <g>
      <polygon points={`${q(0, 0)} ${q(cone, -w)} ${q(L, -w)} ${q(L, w)} ${q(cone, w)}`} transform={`translate(${sh} ${sh * 0.8})`} fill={C.ink} opacity={0.14 - lift * 0.06} filter="url(#dv-soft)" />
      <g transform={`translate(0 ${-lift * 18})`}>
        <polygon points={`${q(tip, -w * 0.22)} ${q(cone, -w)} ${q(cone, w)} ${q(tip, w * 0.22)}`} fill={C.wood} />
        <polygon points={`${q(tip, 0)} ${q(cone, 0)} ${q(cone, w)} ${q(tip, w * 0.22)}`} fill={mix(C.wood, "#7a5a30", 0.28)} />
        <polygon points={`${q(0, 0)} ${q(tip, -w * 0.22)} ${q(tip, w * 0.22)}`} fill={lead} />
        <polygon points={`${q(cone, -w)} ${q(L, -w)} ${q(L, -w / 3)} ${q(cone, -w / 3)}`} fill={lite} />
        <polygon points={`${q(cone, -w / 3)} ${q(L, -w / 3)} ${q(L, w / 3)} ${q(cone, w / 3)}`} fill={body} />
        <polygon points={`${q(cone, w / 3)} ${q(L, w / 3)} ${q(L, w)} ${q(cone, w)}`} fill={dark} />
      </g>
    </g>
  );
};

/** The figure caption: a hairline rule, a small mono kicker with the range drawn so far, the serif line (≤ 2 lines). */
export const Figure: React.FC<{ kicker: string; lines: string[]; t: number; at: number }> = ({ kicker, lines, t, at }) => {
  const c = style.layout.caption;
  const p = ease("caption", t - at);
  if (p <= 0) return null;
  const rise = (1 - p) * R.caption.rise;
  return (
    <g opacity={p} transform={`translate(0 ${rise})`}>
      <line x1={M} y1={c.rule} x2={W - M} y2={c.rule} stroke={C.ink} strokeWidth={1.4} opacity={0.6} />
      <Mono x={M} y={c.kicker} size={T.kicker} weight={500}>
        {kicker}
      </Mono>
      {lines.map((l, i) => (
        <Serif key={i} x={M} y={c.text + i * T.body * 1.18} size={T.body} weight={400}>
          {l}
        </Serif>
      ))}
    </g>
  );
};

/** Paper: base colour, fibre noise, the dot grid, and the filters every pencil mark uses. Waits for the fonts. */
export const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const g = style.layout.dotGrid;
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <pattern id="dv-grid" width={g} height={g} patternUnits="userSpaceOnUse">
            <circle cx={g / 2} cy={g / 2} r={2} fill={C.dots} />
          </pattern>
          <filter id="dv-fibre" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.42" numOctaves={3} seed={11} />
            <feColorMatrix type="matrix" values={`0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 ${S.finish.fibre * 4} 0`} />
          </filter>
          <filter id="dv-graphite" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={3} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 5.7" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
          <filter id="dv-soft" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <feGaussianBlur stdDeviation={12} />
          </filter>
        </defs>
        <rect width={W} height={H} filter="url(#dv-fibre)" />
        <rect width={W} height={H} fill="url(#dv-grid)" />
      </svg>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {children}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Pencil marks go inside this, so they all share the graphite grain. */
export const Graphite: React.FC<{ children: React.ReactNode }> = ({ children }) => <g filter="url(#dv-graphite)">{children}</g>;

export const useT = useSeconds;
