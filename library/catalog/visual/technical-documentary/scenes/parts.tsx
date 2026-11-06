/**
 * Technical Documentary's pieces: ground, chapter eyebrow, Bodoni headline, and the engineering layer: arrows,
 * dimension lines, state dots, plot axes, label tags, leader lines, and equations built term by term (the term being
 * spoken is bone, terms already read are ash). Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const TOP = style.layout.safe.top;
export const COLUMN = W - 2 * M;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  text: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  accent: color(P, "accent"),
  accent2: color(P, "accent2"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const E = style.elements;

export type Pt = [number, number];

/** The soft ink halo that keeps type legible over pictures. */
export const halo = (strength = style.finish.halo): string =>
  strength <= 0
    ? "none"
    : [`0 0 2px ${rgba(C.bg, 0.55 * strength)}`, `0 0 6px ${rgba(C.bg, 0.45 * strength)}`, `0 0 14px ${rgba(C.bg, 0.35 * strength)}`, `0 0 28px ${rgba(C.bg, 0.25 * strength)}`].join(", ");

/** Mix two #rrggbb colours. */
export const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, clamp(t)));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/** Ink ground + the style's finish; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A full-frame SVG layer. */
export const Svg: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity }}>
      {children}
    </svg>
  );

// ------------------------------------------------------------------ type
/** Chapter eyebrow `01  —  Title` (or a kicker): Inter in ash, sliding in; optional 140 px rule under it. */
export const Eyebrow: React.FC<{ text: string; y: number; at?: number; align?: "left" | "center"; rule?: boolean }> = ({ text, y, at = 0, align = "left", rule = false }) => {
  const t = useSeconds() - at;
  const p = ease("eyebrow", t);
  const q = ease("rule", t - 0.1);
  const size = S.type.eyebrow;
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: align === "center" ? 0 : M,
          right: align === "center" ? 0 : undefined,
          top: y - size * 0.8,
          textAlign: align,
          fontFamily: BODY,
          fontSize: size,
          letterSpacing: S.type.eyebrowTracking,
          color: C.muted,
          opacity: p,
          transform: `translateX(${(1 - p) * -S.motion.recipes.eyebrow.distance}px)`,
          whiteSpace: "nowrap",
          textShadow: halo(0.6),
        }}
      >
        {text}
      </div>
      {rule ? <div style={{ position: "absolute", left: align === "center" ? W / 2 - E.rule.width / 2 : M, top: y + 18, width: E.rule.width * q, height: 1, backgroundColor: C.text, opacity: E.rule.opacity }} /> : null}
    </>
  );
};

/** Bodoni headline: bone, *italic* for the one word that matters, words rise and fade in one after another. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; x?: number; align?: "left" | "center"; tone?: string }> = ({
  lines,
  size,
  y,
  at = 0,
  x = M,
  align = "left",
  tone = C.text,
}) => {
  const t = useSeconds() - at;
  const { distance } = S.motion.recipes.rise;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.78,
        textAlign: align,
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: `${size * S.type.leading}px`,
        color: tone,
        whiteSpace: "nowrap",
        textShadow: halo(),
        fontKerning: "normal",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("rise", t - i * S.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", opacity: Math.max(0, p), transform: `translateY(${(1 - p) * distance}px)`, fontStyle: w.em ? "italic" : "normal" }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A note: Inter, ash by default, at body size (units, captions, one-line explanations). */
export const Note: React.FC<{ x: number; y: number; children: React.ReactNode; at?: number; size?: number; width?: number; align?: "left" | "center"; tone?: string }> = ({
  x,
  y,
  children,
  at = 0,
  size = S.type.body,
  width,
  align = "left",
  tone = C.muted,
}) => {
  const p = ease("fade", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - (width ?? COLUMN) / 2 : x,
        top: y,
        width,
        textAlign: align,
        fontFamily: BODY,
        fontSize: size,
        lineHeight: 1.35,
        letterSpacing: 0.3,
        color: tone,
        opacity: p,
        whiteSpace: width ? "normal" : "nowrap",
        textShadow: halo(0.7),
        textWrap: "balance",
      }}
    >
      {children}
    </div>
  );
};

/** A label at a point: Inter on a quiet ink pill, or bare. `anchor` is which side of it sits on (x, y). */
export const Tag: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  opacity?: number;
  anchor?: "left" | "right" | "center";
  size?: number;
  tone?: string;
  pill?: boolean;
  display?: boolean;
}> = ({ x, y, children, opacity = 1, anchor = "left", size = S.type.label, tone = C.text, pill = true, display = false }) => {
  if (opacity <= 0) return null;
  const tx = anchor === "left" ? "0" : anchor === "right" ? "-100%" : "-50%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, -50%)`,
        padding: pill ? `${size * E.tag.padY}px ${size * E.tag.padX}px` : 0,
        borderRadius: E.tag.radius,
        backgroundColor: pill ? rgba(C.bg, E.tag.fill) : "transparent",
        fontFamily: display ? DISPLAY : BODY,
        fontSize: size,
        lineHeight: 1.15,
        letterSpacing: display ? 0 : S.type.labelTracking,
        color: tone,
        opacity,
        whiteSpace: "nowrap",
        textShadow: pill ? "none" : halo(0.6),
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------------ inline math
/** An italic variable. */
export const I: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c }) => <span style={{ fontStyle: "italic", color: c }}>{children}</span>;
export const Sup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: `${E.math.sup}em`, verticalAlign: `${E.math.supRaise}em`, lineHeight: 0, marginLeft: "0.04em" }}>{children}</span>
);
export const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: `${E.math.sup}em`, verticalAlign: `-${E.math.subDrop}em`, lineHeight: 0, marginLeft: "0.02em" }}>{children}</span>
);
export const Frac: React.FC<{ n: React.ReactNode; d: React.ReactNode }> = ({ n, d }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 0.18em", lineHeight: 1.05 }}>
    <span style={{ padding: "0 0.12em" }}>{n}</span>
    <span style={{ alignSelf: "stretch", borderTop: `${E.math.fracRule}em solid currentColor`, margin: "0.06em 0 0.04em" }} />
    <span style={{ padding: "0 0.12em" }}>{d}</span>
  </span>
);

/**
 * One term of an equation: fades in at `at` as it is read. It is bone while it is the term being spoken (until
 * `next`, when the next term starts) and settles to ash after; `c` keeps a meaning colour (ember heat / result, ice cool).
 */
export const Term: React.FC<{ at: number; next?: number; c?: string; children: React.ReactNode }> = ({ at, next, c, children }) => {
  const t = useSeconds();
  const a = Math.max(0, ease("term", t - at));
  const spoken = next === undefined ? 1 : 1 - ease("spoken", t - next);
  return <span style={{ opacity: a, color: c ?? mix(C.muted, C.text, spoken) }}>{children}</span>;
};

/** One equation line at (x, y): Bodoni, upright numbers and operators, italic variables through <I>. */
export const Eq: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode; align?: "left" | "center" }> = ({ x, y, size = S.type.equation, children, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      left: align === "center" ? x - W : x,
      width: align === "center" ? 2 * W : undefined,
      textAlign: align,
      top: y,
      transform: "translateY(-50%)",
      fontFamily: DISPLAY,
      fontSize: size,
      lineHeight: S.type.eqLeading,
      color: C.text,
      whiteSpace: "nowrap",
      textShadow: halo(0.6),
    }}
  >
    {children}
  </div>
);

/** The result box: a thin bone frame drawn round a finished result. */
export const ResultBox: React.FC<{ x: number; y: number; w: number; h: number; at: number }> = ({ x, y, w, h, at }) => {
  const p = ease("fade", useSeconds() - at);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `${E.box.width}px solid ${rgba(C.text, E.box.opacity)}`, borderRadius: E.box.radius, opacity: p }} />;
};

// ------------------------------------------------------------------ drawing (inside <Svg>)
/** SVG path for the first `frac` (0..1, by length) of a polyline. */
export const partialPath = (pts: Pt[], frac = 1): string => {
  if (pts.length < 2 || frac <= 0) return "";
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    total += d;
  }
  let left = total * clamp(frac);
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length && left > 0; i++) {
    if (seg[i - 1] <= left) {
      d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
      left -= seg[i - 1];
    } else {
      const u = left / seg[i - 1];
      d += ` L ${lerp(pts[i - 1][0], pts[i][0], u).toFixed(1)} ${lerp(pts[i - 1][1], pts[i][1], u).toFixed(1)}`;
      left = 0;
    }
  }
  return d;
};

/** The end point of a partial polyline (where the pen is). */
export const partialEnd = (pts: Pt[], frac = 1): Pt => {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let left = total * clamp(frac);
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d >= left) {
      const u = d > 0 ? left / d : 0;
      return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)];
    }
    left -= d;
  }
  return pts[pts.length - 1];
};

export const closedPath = (pts: Pt[]): string => (pts.length ? `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} Z` : "");

export const Arrowhead: React.FC<{ x: number; y: number; angle: number; size?: number; fill: string; opacity?: number }> = ({ x, y, angle, size = E.axis.arrow, fill, opacity = 1 }) => {
  const a1 = angle + Math.PI * 0.84;
  const a2 = angle - Math.PI * 0.84;
  return <path d={`M ${x} ${y} L ${x + size * Math.cos(a1)} ${y + size * Math.sin(a1)} L ${x + size * Math.cos(a2)} ${y + size * Math.sin(a2)} Z`} fill={fill} opacity={opacity} />;
};

/** A straight arrow from p0 to p1, drawn progressively (`frac`). */
export const Arrow: React.FC<{ p0: Pt; p1: Pt; stroke: string; frac?: number; width?: number; head?: number; opacity?: number }> = ({
  p0,
  p1,
  stroke,
  frac = 1,
  width = E.arrow.width,
  head = E.arrow.head,
  opacity = 1,
}) => {
  if (frac <= 0 || opacity <= 0) return null;
  const x = lerp(p0[0], p1[0], frac);
  const y = lerp(p0[1], p1[1], frac);
  const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  return (
    <g opacity={opacity}>
      <line x1={p0[0]} y1={p0[1]} x2={x - Math.cos(ang) * head * 0.6} y2={y - Math.sin(ang) * head * 0.6} stroke={stroke} strokeWidth={width} strokeLinecap="round" />
      <Arrowhead x={x} y={y} angle={ang} size={head} fill={stroke} />
    </g>
  );
};

/** An engineering dimension line between p0 and p1 (it grows from its middle), with extension lines from the measured points. */
export const DimLine: React.FC<{ p0: Pt; p1: Pt; e0?: Pt; e1?: Pt; frac?: number; opacity?: number }> = ({ p0, p1, e0, e1, frac = 1, opacity = 1 }) => {
  if (frac <= 0 || opacity <= 0) return null;
  const k = E.dimension;
  const mx = (p0[0] + p1[0]) / 2;
  const my = (p0[1] + p1[1]) / 2;
  const a: Pt = [mx + (p0[0] - mx) * frac, my + (p0[1] - my) * frac];
  const b: Pt = [mx + (p1[0] - mx) * frac, my + (p1[1] - my) * frac];
  const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  const ext = (e: Pt, p: Pt) => {
    const L = Math.hypot(p[0] - e[0], p[1] - e[1]) || 1;
    return <line x1={e[0]} y1={e[1]} x2={p[0] + ((p[0] - e[0]) / L) * k.overshoot} y2={p[1] + ((p[1] - e[1]) / L) * k.overshoot} stroke={C.text} strokeOpacity={k.extOpacity} strokeWidth={k.ext} />;
  };
  return (
    <g opacity={opacity}>
      {e0 ? ext(e0, p0) : null}
      {e1 ? ext(e1, p1) : null}
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.text} strokeOpacity={k.opacity} strokeWidth={k.width} />
      <Arrowhead x={a[0]} y={a[1]} angle={ang + Math.PI} size={k.arrow} fill={C.text} />
      <Arrowhead x={b[0]} y={b[1]} angle={ang} size={k.arrow} fill={C.text} />
    </g>
  );
};

/** The state dot: a filled dot with a flat translucent halo (no blur). */
export const Dot: React.FC<{ x: number; y: number; fill?: string; r?: number; halo?: number; opacity?: number }> = ({ x, y, fill = C.text, r = E.dot.r, halo: h = E.dot.haloOpacity, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <g opacity={opacity}>
      {h > 0 ? <circle cx={x} cy={y} r={r * E.dot.halo} fill={fill} opacity={h} /> : null}
      <circle cx={x} cy={y} r={r} fill={fill} />
    </g>
  );

/** A dashed guide (readouts from a dot to the axes, reference levels). */
export const Guide: React.FC<{ p0: Pt; p1: Pt; stroke?: string; opacity?: number }> = ({ p0, p1, stroke = C.text, opacity = 1 }) =>
  opacity <= 0 ? null : <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={stroke} strokeOpacity={E.guide.opacity * opacity} strokeWidth={E.guide.width} strokeDasharray={E.guide.dash.join(" ")} />;

// ------------------------------------------------------------------ plots
export type Box = { x: number; y: number; w: number; h: number };
export const mapper = (box: Box, x0: number, x1: number, y0: number, y1: number) => ({
  X: (v: number) => box.x + ((v - x0) / (x1 - x0)) * box.w,
  Y: (v: number) => box.y + box.h - ((v - y0) / (y1 - y0)) * box.h,
});

type Tick = { at: number; label: React.ReactNode };

/** Two axes from the box's bottom-left corner, drawn in (`frac`), with arrowheads, ash ticks and display-face labels. */
export const Axes: React.FC<{ box: Box; frac: number; xLabel?: React.ReactNode; yLabel?: React.ReactNode; xTicks?: Tick[]; yTicks?: Tick[]; opacity?: number }> = ({
  box,
  frac,
  xLabel,
  yLabel,
  xTicks = [],
  yTicks = [],
  opacity = 1,
}) => {
  if (opacity <= 0 || frac <= 0) return null;
  const k = E.axis;
  const x0 = box.x;
  const y0 = box.y + box.h;
  const ticks = clamp((frac - 0.6) / 0.4);
  return (
    <>
      <Svg opacity={opacity}>
        <line x1={x0} y1={y0} x2={x0 + (box.w + k.overshoot) * frac} y2={y0} stroke={C.text} strokeOpacity={k.opacity} strokeWidth={k.width} />
        <line x1={x0} y1={y0} x2={x0} y2={y0 - (box.h + k.overshoot) * frac} stroke={C.text} strokeOpacity={k.opacity} strokeWidth={k.width} />
        {frac > 0.98 ? (
          <>
            <Arrowhead x={x0 + box.w + k.overshoot} y={y0} angle={0} fill={C.text} opacity={k.opacity} />
            <Arrowhead x={x0} y={y0 - box.h - k.overshoot} angle={-Math.PI / 2} fill={C.text} opacity={k.opacity} />
          </>
        ) : null}
        {xTicks.map((t, i) => (
          <line key={`x${i}`} x1={t.at} y1={y0} x2={t.at} y2={y0 + k.tick} stroke={C.text} strokeOpacity={k.tickOpacity * ticks} strokeWidth={k.tickWidth} />
        ))}
        {yTicks.map((t, i) => (
          <line key={`y${i}`} x1={x0 - k.tick} y1={t.at} x2={x0} y2={t.at} stroke={C.text} strokeOpacity={k.tickOpacity * ticks} strokeWidth={k.tickWidth} />
        ))}
      </Svg>
      {xTicks.map((t, i) => (
        <Tag key={`xl${i}`} x={t.at} y={y0 + 34} anchor="center" pill={false} size={S.type.tick} tone={C.muted} opacity={opacity * ticks}>
          {t.label}
        </Tag>
      ))}
      {yTicks.map((t, i) => (
        <Tag key={`yl${i}`} x={x0 - 18} y={t.at} anchor="right" pill={false} size={S.type.tick} tone={C.muted} opacity={opacity * ticks}>
          {t.label}
        </Tag>
      ))}
      {xLabel ? (
        <Tag x={x0 + box.w + k.overshoot} y={y0 + (xTicks.length ? 76 : 38)} anchor="right" pill={false} display size={S.type.symbol} opacity={opacity * ticks}>
          {xLabel}
        </Tag>
      ) : null}
      {yLabel ? (
        <Tag x={x0} y={y0 - box.h - k.overshoot - 34} anchor="left" pill={false} display size={S.type.symbol} opacity={opacity * ticks}>
          {yLabel}
        </Tag>
      ) : null}
    </>
  );
};

/** A leader line from a point to a mixed-case label on an ink pill: the line reaches first, then a 40 px tick and the pill. */
export const Leader: React.FC<{ text: string; from: Pt; to: Pt; at: number; side?: "left" | "right"; accent?: string }> = ({ text, from, to, at, side = "right", accent }) => {
  const p = ease("leader", useSeconds() - at);
  if (p <= 0) return null;
  const k = E.leader;
  const reach = Math.min(1, p * 1.6);
  const mx = lerp(from[0], to[0], reach);
  const my = lerp(from[1], to[1], reach);
  const q = p > 0.55 ? clamp((p - 0.55) / 0.45) : 0;
  const tick = k.tick * q;
  const dir = side === "right" ? 1 : -1;
  const size = S.type.label;
  return (
    <>
      <Svg>
        {accent ? <circle cx={from[0]} cy={from[1]} r={k.ring} fill={accent} opacity={k.ringOpacity * p} /> : null}
        <circle cx={from[0]} cy={from[1]} r={k.dot} fill={accent ?? C.text} opacity={p} />
        <line x1={from[0]} y1={from[1]} x2={mx} y2={my} stroke={C.text} strokeOpacity={k.opacity * p} strokeWidth={k.width} strokeLinecap="round" />
        {q > 0 ? <line x1={to[0]} y1={to[1]} x2={to[0] + dir * tick} y2={to[1]} stroke={C.text} strokeOpacity={k.opacity * p} strokeWidth={k.width} strokeLinecap="round" /> : null}
      </Svg>
      {q > 0 ? (
        <Tag x={to[0] + dir * (k.tick + 6)} y={to[1]} anchor={side === "right" ? "left" : "right"} opacity={q}>
          {text}
        </Tag>
      ) : null}
    </>
  );
};
