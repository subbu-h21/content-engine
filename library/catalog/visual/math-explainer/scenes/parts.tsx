/**
 * Math Explainer's pieces: the pure-black ground (with the 1.5× saturation of the render), Write (outline first, then
 * fill), fades with a small shift, dimming, superscripts, a yellow surrounding box, show-creation strokes, growing
 * arrows, braces, glowing dots, labels with a black backstroke, and a number plane. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const U = style.layout.unit;
export const B = style.layout.buff;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  white: color(P, "text"),
  greyB: color(P, "muted"),
  grey: color(P, "faint"),
  plate: color(P, "plate"),
  yellow: color(P, "accent"),
  blue: color(P, "accent2"),
  blueD: color(P, "blueDark"),
  teal: color(P, "teal"),
  green: color(P, "green"),
  red: color(P, "red"),
  pink: color(P, "pink"),
  gold: color(P, "gold"),
  purple: color(P, "purple"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** A recipe's ease stretched to another run time (3b1b run times vary: 1, 1.5, 2, 3 s). */
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, runTime: number): number =>
  run({ ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration: runTime }, t);

/** Pure black, crisp vectors; the render's 1.5× saturation applied to everything drawn. */
export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ filter: `saturate(${E.saturation})` }}>{children}</AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Opacity of something that dims to `to` (default 0.2) starting at `at`. */
export const dimmed = (t: number, at: number, to: number = E.dim): number => lerp(1, to, ease("dim", t - at));

/**
 * Write: the outline is drawn first (left to right), the fill follows 30% behind, as text and equations are written.
 * An approximation of a per-glyph stroke-then-fill with a 0.1 lag ratio.
 */
export const Write: React.FC<{ at: number; runTime?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, runTime = S.motion.recipes.write.duration, children, style: st }) => {
  const p = easeFor("write", useSeconds() - at, runTime);
  if (p <= 0) return <span style={{ display: "inline-block", visibility: "hidden", ...st }}>{children}</span>;
  const po = clamp(p / 0.7);
  const pf = clamp((p - 0.3) / 0.7);
  const clip = (q: number) => `inset(-30% ${((1 - q) * 105).toFixed(2)}% -30% -5%)`;
  return (
    <span style={{ position: "relative", display: "inline-block", ...st }}>
      <span style={{ visibility: "hidden" }}>{children}</span>
      {pf < 1 ? (
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", WebkitTextFillColor: "transparent", WebkitTextStroke: "2px currentColor", clipPath: clip(po) } as React.CSSProperties}>{children}</span>
      ) : null}
      <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", clipPath: clip(pf) }}>{children}</span>
    </span>
  );
};

/** Fade in with a small upward shift. */
export const FadeIn: React.FC<{ at: number; runTime?: number; children: React.ReactNode; style?: React.CSSProperties; shift?: number }> = ({ at, runTime = 1, children, style: st, shift = S.motion.recipes.fade.distance }) => {
  const p = easeFor("fade", useSeconds() - at, runTime);
  return <span style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * shift}px)`, ...st }}>{children}</span>;
};

/** An italic variable in its colour. */
export const V: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = C.white, children }) => <span style={{ fontStyle: "italic", color: c }}>{children}</span>;
/** A superscript. */
export const Sup: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c }) => (
  <span style={{ fontSize: `${T.sup}em`, position: "relative", top: `${-T.supRaise}em`, marginLeft: "0.04em", color: c }}>{children}</span>
);
/** A stacked fraction. */
export const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode; size?: number }> = ({ n, d, size = 0.78 }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", fontSize: `${size}em`, lineHeight: 1.05, margin: "0 0.12em", position: "relative", top: "-0.12em" }}>
    <span style={{ padding: "0 0.1em" }}>{n}</span>
    <span style={{ alignSelf: "stretch", height: "0.055em", minHeight: 3, background: "currentColor" }} />
    <span style={{ padding: "0 0.1em" }}>{d}</span>
  </span>
);

/** A centred line of maths or text at `y` (its vertical centre). */
export const Line: React.FC<{ y: number; size: number; children: React.ReactNode; color?: string; opacity?: number; x?: number; align?: "center" | "left" }> = ({ y, size, children, color: c = C.white, opacity = 1, x, align = "center" }) => (
  <div
    style={{
      position: "absolute",
      left: align === "center" ? 0 : x ?? M,
      right: align === "center" ? 0 : undefined,
      top: y - size * 0.62,
      textAlign: align,
      fontFamily: SERIF,
      fontSize: size,
      lineHeight: `${size * T.leading}px`,
      color: c,
      opacity,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** A full-frame SVG layer. */
export const Svg: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible" }}>
    {children}
  </svg>
);

/** Show-creation: a path drawn along its length. */
export const Create: React.FC<{ d: string; at: number; runTime?: number; stroke: string; width?: number; opacity?: number; fill?: string }> = ({ d, at, runTime = 2, stroke, width = E.stroke.line, opacity = 1, fill = "none" }) => {
  const p = easeFor("create", useSeconds() - at, runTime);
  if (p <= 0) return null;
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} stroke={stroke} strokeWidth={width} strokeOpacity={opacity} fill={fill} strokeLinecap="round" strokeLinejoin="round" />;
};

/** An arrow that grows from its start; the tip is a quarter of its length at most. */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; c: string; runTime?: number; width?: number; opacity?: number }> = ({ x1, y1, x2, y2, at, c, runTime = 1, width = E.arrow.width, opacity = 1 }) => {
  const p = easeFor("grow", useSeconds() - at, runTime);
  if (p <= 0) return null;
  const len = Math.hypot(x2 - x1, y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const tip = Math.min(E.arrow.tip, len * E.arrow.tipRatio);
  const ex = x1 + Math.cos(a) * len;
  const ey = y1 + Math.sin(a) * len;
  const bx = ex - Math.cos(a) * tip;
  const by = ey - Math.sin(a) * tip;
  const nx = -Math.sin(a) * tip * 0.5;
  const ny = Math.cos(a) * tip * 0.5;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={c} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${ex},${ey} ${bx + nx},${by + ny} ${bx - nx},${by - ny}`} fill={c} />
    </g>
  );
};

/** A glowing dot: solid core and a soft glow (the only glow in the style). */
export const Dot: React.FC<{ x: number; y: number; c?: string; at?: number; r?: number }> = ({ x, y, c = C.yellow, at = 0, r = E.dot.r }) => {
  const p = ease("quick", useSeconds() - at);
  if (p <= 0) return null;
  const id = `me-glow-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g opacity={p}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={c} stopOpacity={E.dot.glowOpacity} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={E.dot.glow} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill={c} />
    </g>
  );
};

/** A horizontal curly brace from x1 to x2 at y, its point towards `dir` (−1 up, +1 down). */
export const bracePath = (x1: number, x2: number, y: number, dir: -1 | 1, h = 34): string => {
  const m = (x1 + x2) / 2;
  const q = h / 2;
  return `M ${x1} ${y} Q ${x1} ${y + dir * q} ${x1 + h} ${y + dir * q} L ${m - h} ${y + dir * q} Q ${m} ${y + dir * q} ${m} ${y + dir * h} Q ${m} ${y + dir * q} ${m + h} ${y + dir * q} L ${x2 - h} ${y + dir * q} Q ${x2} ${y + dir * q} ${x2} ${y}`;
};

/** An SVG label with a black backstroke so it stays legible over lines. */
export const Label: React.FC<{ x: number; y: number; size?: number; c?: string; at?: number; anchor?: "start" | "middle" | "end"; italic?: boolean; children: React.ReactNode }> = ({ x, y, size = T.label, c = C.white, at = 0, anchor = "middle", italic = false, children }) => {
  const p = ease("fade", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y + (1 - p) * S.motion.recipes.fade.distance}
      textAnchor={anchor}
      fontFamily={SERIF}
      fontSize={size}
      fontStyle={italic ? "italic" : "normal"}
      fill={c}
      stroke={C.bg}
      strokeWidth={E.backstroke}
      strokeLinejoin="round"
      paintOrder="stroke"
      opacity={p}
    >
      {children}
    </text>
  );
};

/** A yellow surrounding rectangle drawn around a box (show-creation). */
export const Box: React.FC<{ x: number; y: number; w: number; h: number; at: number; c?: string }> = ({ x, y, w, h, at, c = C.yellow }) => {
  const b = E.box.buff;
  const d = `M ${x - b} ${y - b} H ${x + w + b} V ${y + h + b} H ${x - b} Z`;
  return <Create d={d} at={at} runTime={S.motion.recipes.box.duration} stroke={c} width={E.stroke.box} />;
};

/** The number plane: blue background lines every unit (and faint half units), white axes through the origin. */
export const Plane: React.FC<{ ox: number; oy: number; at: number; top?: number; bottom?: number }> = ({ ox, oy, at, top = 0, bottom = H }) => {
  const t = useSeconds() - at;
  const p = easeFor("create", t, 2);
  if (p <= 0) return null;
  const lines: React.ReactNode[] = [];
  const half = U / 2;
  for (let x = ox % half; x <= W; x += half) {
    const major = Math.abs(((x - ox) / U) % 1) < 0.01;
    lines.push(<line key={`v${x}`} x1={x} y1={top} x2={x} y2={lerp(top, bottom, p)} stroke={C.blueD} strokeWidth={E.stroke.grid} strokeOpacity={major ? E.grid.opacity : E.grid.halfOpacity} />);
  }
  for (let y = top + ((oy - top) % half); y <= bottom; y += half) {
    const major = Math.abs(((y - oy) / U) % 1) < 0.01;
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={lerp(0, W, p)} y2={y} stroke={C.blueD} strokeWidth={E.stroke.grid} strokeOpacity={major ? E.grid.opacity : E.grid.halfOpacity} />);
  }
  return (
    <g>
      {lines}
      <line x1={0} y1={oy} x2={lerp(0, W, p)} y2={oy} stroke={C.white} strokeWidth={E.stroke.axis} strokeOpacity={0.8} />
      <line x1={ox} y1={top} x2={ox} y2={lerp(top, bottom, p)} stroke={C.white} strokeWidth={E.stroke.axis} strokeOpacity={0.8} />
    </g>
  );
};

/** A sine wave path from x0 to x1 around y with amplitude a and wavelength l. */
export const wavePath = (x0: number, x1: number, y: number, a: number, l: number, phase = 0): string => {
  const pts: string[] = [];
  for (let x = x0; x <= x1 + 0.1; x += 4) pts.push(`${pts.length ? "L" : "M"} ${x.toFixed(1)} ${(y - a * Math.sin(((x - x0) / l) * Math.PI * 2 + phase)).toFixed(1)}`);
  return pts.join(" ");
};

export { SERIF };
