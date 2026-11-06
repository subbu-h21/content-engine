/**
 * Beat-Locked Hype's pieces: ink ground with the faint grid, the quiet mono HUD, mask-revealed slams, blur-slide
 * slams, the serif human line, the spark line, outline repetition, the blue card's viewfinder brackets and the cube
 * field. Every value comes from style.json; times are on the 128 BPM grid.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, SERIF, SLAM } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const C = {
  bg: color(style.palette, "background"),
  text: color(style.palette, "text"),
  cream: color(style.palette, "surface"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  blue: color(style.palette, "accent2"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** Seconds of n beats / eighths / sixteenths at the style's tempo. */
export const beats = (n: number): number => n * S.motion.beat;
export const eighths = (n: number): number => n * S.motion.eighth;
export const sixteenths = (n: number): number => n * S.motion.sixteenth;

/** The faint construction grid of the spark open and the data scenes. */
export const Grid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const g = S.layout.grid;
  const xs = Array.from({ length: Math.ceil(W / g) + 1 }, (_, i) => (W % g) / 2 + i * g);
  const ys = Array.from({ length: Math.ceil(H / g) + 1 }, (_, i) => (H % g) / 2 + i * g);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      {xs.map((x) => (
        <line key={`x${x}`} x1={x} y1={0} x2={x} y2={H} stroke={C.faint} strokeWidth={1.5} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={0} y1={y} x2={W} y2={y} stroke={C.faint} strokeWidth={1.5} />
      ))}
    </svg>
  );
};

/** Mono label, tracked caps, about 50% white (or a given colour). */
export const Mono: React.FC<{ text: string; x: number; y: number; at?: number; align?: "left" | "right" | "center"; col?: string; size?: number; typed?: boolean }> = ({
  text,
  x,
  y,
  at = 0,
  align = "left",
  col = C.muted,
  size = S.type.mono,
  typed = false,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const shown = typed ? text.slice(0, Math.floor(t / sixteenths(0.5))) : text;
  const style_: React.CSSProperties = {
    position: "absolute",
    top: y - size * 0.75,
    fontFamily: MONO,
    fontSize: size,
    letterSpacing: `${S.type.monoTracking}em`,
    textTransform: "uppercase",
    color: col,
    whiteSpace: "nowrap",
    opacity: typed ? 1 : clamp(t / 0.08),
  };
  if (align === "left") style_.left = x;
  if (align === "right") style_.right = W - x;
  if (align === "center") {
    style_.left = 0;
    style_.width = W;
    style_.textAlign = "center";
  }
  return <div style={style_}>{shown}</div>;
};

/** The quiet HUD: scene counter top right, category label bottom left. No brackets, no timecode. */
export const Hud: React.FC<{ scene: number; total?: number; label: string; top?: string; bottom?: string }> = ({ scene, total = 6, label, top = C.muted, bottom = C.muted }) => (
  <>
    <Mono text={`Scene ${String(scene).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} x={W - M} y={S.layout.hudTop} align="right" col={top} />
    <Mono text={label} x={M} y={S.layout.hudBottom} col={bottom} />
  </>
);

/** Ground: a flat card colour (ink by default) with grain and vignette; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode; bg?: string; grid?: boolean }> = ({ children, bg = C.bg, grid = false }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {grid ? <Grid /> : null}
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A heavy caps line whose letters are revealed by masks, one letter per 1/16 note; `after` is drawn at its end. */
export const MaskLine: React.FC<{ text: string; size: number; y: number; at: number; col?: string; align?: "center" | "left"; after?: React.ReactNode }> = ({ text, size, y, at, col = C.text, align = "center", after }) => {
  const t = useSeconds() - at;
  let k = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : M,
        width: align === "center" ? W : undefined,
        top: y - size * 0.82,
        textAlign: align,
        fontFamily: SLAM,
        fontWeight: 900,
        fontSize: size,
        lineHeight: S.type.leading,
        letterSpacing: `${S.type.tracking}em`,
        textTransform: "uppercase",
        color: col,
        whiteSpace: "nowrap",
      }}
    >
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i}> </span>;
        const p = ease("mask", t - k * S.motion.sixteenth);
        k += 1;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingTop: "0.06em", marginTop: "-0.06em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)` }}>{ch}</span>
          </span>
        );
      })}
      {after}
    </div>
  );
};

/** A slam: enters with a fast blur/slide on an 1/8 note and lands with a slight overshoot (impact spring). */
export const Slam: React.FC<{ lines: string[]; size: number; y: number; at: number; col?: string; from?: "left" | "right" | "bottom" | "top"; serif?: boolean; outline?: string }> = ({
  lines,
  size,
  y,
  at,
  col = C.text,
  from = "bottom",
  serif = false,
  outline,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("impact", t);
  const b = ease("slam", t);
  const d = S.motion.recipes.slam.distance * (1 - p);
  const [dx, dy] = from === "left" ? [-d, 0] : from === "right" ? [d, 0] : from === "top" ? [0, -d] : [0, d];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: y - size * (serif ? 0.7 : 0.82),
        textAlign: "center",
        fontFamily: serif ? SERIF : SLAM,
        fontStyle: serif ? "italic" : "normal",
        fontWeight: serif ? 400 : 900,
        fontSize: size,
        lineHeight: serif ? 1 : S.type.leading,
        letterSpacing: serif ? "-0.01em" : `${S.type.tracking}em`,
        textTransform: serif ? "none" : "uppercase",
        color: outline ? "transparent" : col,
        WebkitTextStroke: outline ? `3px ${outline}` : undefined,
        whiteSpace: "nowrap",
        opacity: clamp(t / 0.05),
        transform: `translate(${dx}px, ${dy}px)`,
        filter: b < 1 ? `blur(${(1 - b) * S.motion.slamBlur}px)` : undefined,
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};

/** The word repeated as an outline pattern filling a band (one triplet treatment). */
export const OutlineRepeat: React.FC<{ text: string; top: number; height: number; size: number; col: string; at: number }> = ({ text, top, height, size, col, at }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const rows = Math.ceil(height / (size * 0.95)) + 1;
  const drift = t * 60;
  return (
    <div style={{ position: "absolute", left: 0, top, width: W, height, overflow: "hidden", opacity: clamp(t / 0.1) }}>
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: -400 + (r % 2 ? -size * 1.6 : 0) + (r % 2 ? drift : -drift),
            top: r * size * 0.95 - size * 0.3,
            fontFamily: SLAM,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: `${S.type.tracking}em`,
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: `2px ${rgba(col, 0.32)}`,
            whiteSpace: "nowrap",
          }}
        >
          {Array.from({ length: 6 }, () => text).join("  ")}
        </div>
      ))}
    </div>
  );
};

/** Viewfinder corner brackets with a tiny size label (only on the blue card). */
export const Brackets: React.FC<{ x: number; y: number; w: number; h: number; col: string; at: number; label?: string }> = ({ x, y, w, h, col, at, label }) => {
  const p = ease("rule", useSeconds() - at);
  if (p <= 0) return null;
  const L = 56 * p;
  const sw = 3;
  const corners: [number, number, number, number][] = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {corners.map(([cx, cy, sx, sy], i) => (
          <path key={i} d={`M ${cx} ${cy + sy * L} L ${cx} ${cy} L ${cx + sx * L} ${cy}`} fill="none" stroke={col} strokeWidth={sw} strokeOpacity={0.85} />
        ))}
      </svg>
      {label ? <Mono text={label} x={x + w - 8} y={y + h - 22} align="right" col={rgba(col, 0.7)} at={at} size={24} /> : null}
    </>
  );
};

/** The spark: a small accent mark that pulses, then stretches into a thin line with a mono label under it. */
export const SparkLine: React.FC<{ y: number; at: number; half?: number; label?: string }> = ({ y, at, half = 300, label }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const pulse = 1 + 0.25 * Math.sin(t * 2 * Math.PI * (S.motion.bpm / 60)) * clamp(1 - t / beats(1));
  const stretch = ease("spring", t - beats(1));
  const w = lerp(18 * pulse, half * 2, clamp(stretch, 0, 1.05));
  return (
    <>
      <div style={{ position: "absolute", left: W / 2 - w / 2, top: y - 9 * pulse + (stretch > 0 ? 6 * clamp(stretch) : 0), width: w, height: lerp(18 * pulse, 5, clamp(stretch)), backgroundColor: C.accent }} />
      {label ? <Mono text={label} x={W / 2} y={y + 56} align="center" at={at + beats(1.5)} /> : null}
    </>
  );
};

const mix = (a: string, b: string, k: number): string => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  const c = x.map((v, i) => Math.round(lerp(v, y[i], clamp(k))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
const shade = (hex: string, k: number): string => mix("#000000", hex, k);

/**
 * The signature visual: an isometric field of cubes rippling out from the centre, coloured by height (deep blue →
 * electric blue → cream). The centre cube, the one the spark hits, is the accent.
 */
export const CubeField: React.FC<{ cx: number; cy: number; n?: number; a?: number; at: number }> = ({ cx, cy, n = 13, a = 34, at }) => {
  const t = useSeconds() - at;
  const b = a * 0.577;
  const mid = (n - 1) / 2;
  const front = Math.max(0, t) * 7.5;
  const polys: React.ReactNode[] = [];
  const deep = mix(C.bg, C.blue, 0.55);
  for (let s = 0; s <= 2 * (n - 1); s++) {
    for (let i = 0; i < n; i++) {
      const j = s - i;
      if (j < 0 || j >= n) continue;
      const r = Math.hypot(i - mid, j - mid);
      const reached = clamp((front - r) / 1.5);
      const wave = Math.max(0, Math.sin(r * 0.95 - Math.max(0, t) * 6.2)) * reached * Math.max(0, 1 - r / (mid + 1));
      const centre = i === mid && j === mid;
      const h = 12 + (centre ? 150 * clamp(t / 0.3) : 150 * Math.max(0, wave));
      const k = clamp((h - 12) / 120);
      const top = centre ? C.accent : k < 0.5 ? mix(deep, C.blue, k * 2) : mix(C.blue, C.cream, (k - 0.5) * 2);
      const x = cx + (i - j) * a;
      const y = cy + (i + j - 2 * mid) * b;
      const T = (dx: number, dy: number) => `${x + dx},${y + dy - h}`;
      const G = (dx: number, dy: number) => `${x + dx},${y + dy}`;
      const g = 0.92;
      polys.push(
        <g key={`${i}-${j}`}>
          <polygon points={`${T(-a * g, 0)} ${T(0, b * g)} ${G(0, b * g)} ${G(-a * g, 0)}`} fill={shade(top, 0.62)} />
          <polygon points={`${T(0, b * g)} ${T(a * g, 0)} ${G(a * g, 0)} ${G(0, b * g)}`} fill={shade(top, 0.45)} />
          <polygon points={`${T(0, -b * g)} ${T(a * g, 0)} ${T(0, b * g)} ${T(-a * g, 0)}`} fill={top} />
        </g>,
      );
    }
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {polys}
    </svg>
  );
};
