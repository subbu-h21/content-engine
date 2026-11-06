/**
 * Obsidian Chrome's pieces: the black field, the amber atmosphere and guide line, silver-gradient caps that arc in,
 * the glossy obsidian pill (squash, stretch, one restrained settle), the one metallic glint, the travelling spark,
 * glass cards, icon tiles and mono micro labels. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  surface: color(P, "surface"),
  surface2: color(P, "surface2"),
  obTop: color(P, "obsidianTop"),
  obMid: color(P, "obsidianMid"),
  text: color(P, "text"),
  silverTop: color(P, "silverTop"),
  silverMid: color(P, "silverMid"),
  silverBase: color(P, "silverBase"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  accent: color(P, "accent"),
  accent2: color(P, "accent2"),
  spark: color(P, "spark"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const E = style.elements;
export const T = style.type;

/** The silver gradient every glyph carries (top white, 44% silver, bottom grey). */
export const SILVER = `linear-gradient(180deg, ${C.silverTop} 0%, ${C.silverMid} 44%, ${C.silverBase} 100%)`;
export const silverText: React.CSSProperties = {
  backgroundImage: SILVER,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
/** Brushed metal for bars and strokes: dark edge, bright band, dark edge. */
export const METAL = `linear-gradient(90deg, ${C.silverBase} 0%, ${C.silverTop} 38%, ${C.silverMid} 60%, ${C.silverBase} 100%)`;

export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Soft amber atmosphere behind the hero: grows from scale 0.72 and blur 22 px. */
export const Atmosphere: React.FC<{ y: number; at?: number; w?: number; h?: number }> = ({ y, at = 0, w = 1000, h = 700 }) => {
  const p = ease("atmosphere", useSeconds() - at);
  if (p <= 0) return null;
  const a = E.atmosphere;
  return (
    <div
      style={{
        position: "absolute",
        left: (W - w) / 2,
        top: y - h / 2,
        width: w,
        height: h,
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${rgba(C.accent, a.opacity)} 0%, ${rgba(C.accent, a.opacity * 0.35)} 45%, ${rgba(C.accent, 0)} 100%)`,
        opacity: p,
        transform: `scale(${lerp(a.fromScale, 1, p)})`,
        filter: `blur(${(1 - p) * a.blur}px)`,
      }}
    />
  );
};

/** A thin orbit ring behind the hero (from scale 0.9 and −9°). */
export const Orbit: React.FC<{ y: number; at?: number; rx?: number; ry?: number }> = ({ y, at = 0, rx = 470, ry = 300 }) => {
  const p = ease("atmosphere", useSeconds() - at);
  if (p <= 0) return null;
  const o = E.orbit;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
      <ellipse
        cx={W / 2}
        cy={y}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={C.text}
        strokeOpacity={o.opacity}
        strokeWidth={1}
        transform={`rotate(${lerp(o.fromRotate, 0, p)} ${W / 2} ${y}) translate(${W / 2} ${y}) scale(${lerp(o.fromScale, 1, p)}) translate(${-W / 2} ${-y})`}
      />
    </svg>
  );
};

/** The 1 px amber guide line, fading at both ends; draws from the centre outwards. */
export const Guide: React.FC<{ y: number; at?: number }> = ({ y, at = 0 }) => {
  const p = ease("guide", useSeconds() - at);
  if (p <= 0) return null;
  const g = E.guide;
  return (
    <div
      style={{
        position: "absolute",
        left: (W - g.width) / 2,
        top: y - g.stroke / 2,
        width: g.width,
        height: g.stroke,
        background: `linear-gradient(90deg, ${rgba(C.accent, 0)} 0%, ${rgba(C.accent, g.opacity)} 30%, ${rgba(C.accent, g.opacity)} 70%, ${rgba(C.accent, 0)} 100%)`,
        transform: `scaleX(${p})`,
      }}
    />
  );
};

/** Mono micro label: caps, tracked 0.2 em, at 52%. */
export const Micro: React.FC<{ text: string; y: number; at?: number; align?: "left" | "center"; x?: number }> = ({ text, y, at = 0, align = "center", x }) => {
  const p = ease("labelIn", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x ?? M,
        right: align === "center" ? 0 : undefined,
        top: y - T.micro * 0.5,
        textAlign: align,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: T.micro,
        lineHeight: 1,
        letterSpacing: `${T.microTracking}em`,
        textTransform: "uppercase",
        color: C.text,
        opacity: p * T.microOpacity,
        transform: `translateY(${(1 - p) * style.motion.recipes.labelIn.distance}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Subcopy: Inter 400, 0.04 em, muted at 72%. */
export const Sub: React.FC<{ text: string; y: number; at?: number; align?: "left" | "center"; width?: number }> = ({ text, y, at = 0, align = "center", width = COLUMN }) => {
  const p = ease("subIn", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : M,
        width,
        top: y,
        textAlign: align,
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: T.body,
        lineHeight: 1.35,
        letterSpacing: `${T.bodyTracking}em`,
        color: C.muted,
        opacity: p * T.mutedOpacity,
        transform: `translateY(${(1 - p) * style.motion.recipes.subIn.distance}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** Split "Why is the sky *blue?*" into the plain words and the emphasised words (they go in the pill). */
export const splitEm = (lines: string[]): { plain: string[]; em: string } => {
  const all = lines.flatMap((l) => words(l));
  return { plain: all.filter((w) => !w.em).map((w) => w.text), em: all.filter((w) => w.em).map((w) => w.text).join(" ") };
};

/** Greedy line break of words into lines of at most `max` characters. */
export const breakLines = (ws: string[], max: number): string[] => {
  const out: string[] = [];
  let cur = "";
  for (const w of ws) {
    if (cur && (cur + " " + w).length > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) out.push(cur);
  return out;
};

/** A line of heavy silver caps arriving on a shallow arc from one side (blur 8 px → 0). */
export const ArcLine: React.FC<{ text: string; size: number; top: number; at: number; dir: -1 | 1; align?: "left" | "center" }> = ({ text, size, top, at, dir, align = "center" }) => {
  const t = useSeconds() - at;
  const { distance } = style.motion.recipes.arc;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : M,
        right: align === "center" ? 0 : undefined,
        top,
        textAlign: align,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        letterSpacing: `${T.tracking}em`,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = ease("arc", t - i * style.motion.stagger);
        if (p <= 0) return <React.Fragment key={i}>{i > 0 ? " " : null}<span style={{ opacity: 0 }}>{w}</span></React.Fragment>;
        const q = 1 - p;
        return (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
            <span
              style={{
                display: "inline-block",
                ...silverText,
                paddingRight: "0.06em",
                marginRight: "-0.06em",
                opacity: clamp(p * 1.4),
                transform: `translate(${dir * distance * q}px, ${-dir * 18 * q}px) rotate(${dir * 1.2 * q}deg)`,
                filter: `blur(${8 * q}px)`,
              }}
            >
              {w}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Height of a pill of font size `size`. */
export const pillHeight = (size: number, padY = E.pill.padY): number => size * (1 + 2 * padY);

/** The metallic glint: a band 45% of the pill wide, skewed −18°, white peaking at 0.55, sweeping once. */
const Glint: React.FC<{ at: number }> = ({ at }) => {
  const p = ease("glint", useSeconds() - at);
  if (p <= 0 || p >= 1) return null;
  const g = E.glint;
  const left = lerp(g.from, g.to, p) * 100;
  return (
    <div
      style={{
        position: "absolute",
        top: "-10%",
        bottom: "-10%",
        left: `${left}%`,
        width: `${g.width * 100}%`,
        transform: `skewX(${g.skew}deg)`,
        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${g.peak}) 50%, rgba(255,255,255,0) 100%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

/**
 * The glossy obsidian pill with a silver label. `enter`: "rise" = Chrome CTA (from y +90, scale 0.96, expo-out);
 * "squash" = Kinetic Headline (anticipation squash, stretch, one restrained back-out settle).
 */
export const Pill: React.FC<{
  text: string;
  size: number;
  y: number;
  at: number;
  enter?: "rise" | "squash";
  rim?: boolean;
  glintAt?: number;
  tracking?: number;
  weight?: number;
  align?: "left" | "center";
  x?: number;
  caps?: boolean;
  padX?: number;
  padY?: number;
}> = ({ text, size, y, at, enter = "rise", rim = false, glintAt, tracking = T.pillTracking, weight = 800, align = "center", x, caps = true, padX = E.pill.padX, padY = E.pill.padY }) => {
  const t = useSeconds() - at;
  const pe = E.pill;
  let sx = 1;
  let sy = 1;
  let dy = 0;
  let op = 1;
  if (enter === "rise") {
    const p = ease("pillIn", t);
    if (p <= 0) return null;
    const s = lerp(0.96, 1, p);
    sx = s;
    sy = s;
    dy = (1 - p) * style.motion.recipes.pillIn.distance;
    op = clamp(p * 1.3);
  } else {
    if (t <= 0) return null;
    const dA = style.motion.recipes.squash.duration;
    if (t < dA) {
      const a = ease("squash", t);
      sx = lerp(pe.squash[0], pe.stretch[0], a);
      sy = lerp(pe.squash[1], pe.stretch[1], a);
    } else {
      const b = ease("settle", t - dA);
      sx = lerp(pe.stretch[0], 1, b);
      sy = lerp(pe.stretch[1], 1, b);
    }
    op = clamp(t / 0.18);
  }
  const h = pillHeight(size, padY);
  const shadows = [pe.highlight, pe.shade, pe.drop];
  if (rim) shadows.unshift(`inset 0 0 0 ${pe.rim}px ${rgba(C.accent, pe.rimOpacity)}`);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x ?? M,
        right: align === "center" ? 0 : undefined,
        top: y - h / 2,
        height: h,
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity: op,
        transform: `translateY(${dy}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          height: h,
          padding: `0 ${size * padX}px`,
          borderRadius: pe.radius,
          background: `linear-gradient(180deg, ${C.obTop} 0%, ${C.obMid} 46%, ${C.bg} 100%)`,
          border: `1px solid rgba(255,255,255,${pe.border})`,
          boxShadow: shadows.join(", "),
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          transform: `scale(${sx}, ${sy})`,
          transformOrigin: "50% 60%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "4%",
            right: "4%",
            top: 2,
            height: `${pe.cap * 100}%`,
            borderRadius: pe.radius,
            background: `linear-gradient(180deg, rgba(255,255,255,${pe.capOpacity}) 0%, rgba(255,255,255,0) 100%)`,
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily: DISPLAY,
            fontWeight: weight,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: `${tracking}em`,
            textTransform: caps ? "uppercase" : "none",
            whiteSpace: "nowrap",
            ...silverText,
            paddingRight: "0.04em",
          }}
        >
          {text}
        </span>
        {glintAt !== undefined ? <Glint at={glintAt} /> : null}
      </div>
    </div>
  );
};

/** The spark: one bright core crossing the guide line once (x −205 → +210 around `cx`). */
export const Spark: React.FC<{ cx: number; y: number; at: number }> = ({ cx, y, at }) => {
  const p = ease("spark", useSeconds() - at);
  if (p <= 0 || p >= 1) return null;
  const x = cx + lerp(-205, 210, p);
  const a = Math.sin(Math.PI * p);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id="oc-spark">
          <stop offset="0" stopColor={C.spark} stopOpacity={1} />
          <stop offset="0.25" stopColor={C.accent} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.accent} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={70} ry={10} fill="url(#oc-spark)" opacity={a} />
      <circle cx={x} cy={y} r={3.5} fill={C.spark} opacity={a} />
    </svg>
  );
};

/** A dark glass card with faint gridlines (rises from y +60, scale 0.97). */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; at: number; children?: React.ReactNode }> = ({ x, y, w, h, at, children }) => {
  const p = ease("rise", useSeconds() - at);
  if (p <= 0) return null;
  const c = E.card;
  const grid = `repeating-linear-gradient(0deg, ${rgba(C.faint, c.gridOpacity)} 0 1px, transparent 1px ${c.grid}px), repeating-linear-gradient(90deg, ${rgba(C.faint, c.gridOpacity)} 0 1px, transparent 1px ${c.grid}px)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: c.radius,
        background: `${grid}, linear-gradient(180deg, ${C.surface} 0%, ${C.surface2} 100%)`,
        backgroundPosition: "center",
        border: `1px solid rgba(255,255,255,${c.border})`,
        boxShadow: `${E.pill.highlight}, ${E.pill.drop}`,
        opacity: clamp(p * 1.3),
        transform: `translateY(${(1 - p) * style.motion.recipes.rise.distance}px) scale(${lerp(0.97, 1, p)})`,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

/** A glossy obsidian icon tile with a soft pale glow, holding a drawn silver glyph. */
export const Tile: React.FC<{ glyph: "sun" | "scatter" | "eye"; size?: number }> = ({ glyph, size = E.tile.size }) => {
  const s = size;
  const c = s / 2;
  const stroke = { stroke: "url(#oc-metal)", strokeWidth: 3.2, strokeLinecap: "round" as const, fill: "none" };
  return (
    <div
      style={{
        position: "relative",
        width: s,
        height: s,
        flex: "none",
        borderRadius: E.tile.radius,
        background: `linear-gradient(180deg, ${C.obTop} 0%, ${C.obMid} 46%, ${C.bg} 100%)`,
        border: `1px solid rgba(255,255,255,${E.pill.border})`,
        boxShadow: `${E.pill.highlight}, ${E.pill.shade}, 0 0 34px ${rgba(C.accent2, 0.22)}`,
      }}
    >
      <svg width={s} height={s} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="oc-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.silverTop} />
            <stop offset="0.44" stopColor={C.silverMid} />
            <stop offset="1" stopColor={C.silverBase} />
          </linearGradient>
        </defs>
        {glyph === "sun" ? (
          <>
            <circle cx={c} cy={c} r={s * 0.14} {...stroke} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (Math.PI * 2 * i) / 8;
              return <line key={i} x1={c + Math.cos(a) * s * 0.23} y1={c + Math.sin(a) * s * 0.23} x2={c + Math.cos(a) * s * 0.31} y2={c + Math.sin(a) * s * 0.31} {...stroke} />;
            })}
          </>
        ) : glyph === "scatter" ? (
          <>
            <circle cx={c} cy={c} r={s * 0.07} fill="url(#oc-metal)" />
            {Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI * 2 * i) / 6 + 0.3;
              return <line key={i} x1={c + Math.cos(a) * s * 0.15} y1={c + Math.sin(a) * s * 0.15} x2={c + Math.cos(a) * s * 0.3} y2={c + Math.sin(a) * s * 0.3} {...stroke} />;
            })}
          </>
        ) : (
          <>
            <path d={`M ${s * 0.18} ${c} Q ${c} ${s * 0.22} ${s * 0.82} ${c} Q ${c} ${s * 0.78} ${s * 0.18} ${c} Z`} {...stroke} />
            <circle cx={c} cy={c} r={s * 0.1} fill="url(#oc-metal)" />
          </>
        )}
      </svg>
    </div>
  );
};

/** A full-frame SVG layer. */
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style: st }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, ...st }}>
    {children}
  </svg>
);

export { BODY, DISPLAY, MONO };
