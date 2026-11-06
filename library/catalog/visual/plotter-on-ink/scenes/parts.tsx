/**
 * Plotter on Ink's pieces: the graph-paper board, the pen spark, plotted strokes that run hot, dimension lines,
 * boxes with registration ticks, spoken-word karaoke, Archivo slams that step through widths, an odometer, typed
 * notes, pen-revealed captions and the corner furniture. Every value comes from style.json.
 * The source writes with single-stroke plotter fonts of unknown licence; here the pen reveals text with a clip wipe.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { bezier, clamp, color, expoOut, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, MONO, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const C = {
  ink: color(style.palette, "background"),
  ink2: color(style.palette, "surface"),
  bone: color(style.palette, "text"),
  ash: color(style.palette, "muted"),
  graphite: color(style.palette, "faint"),
  signal: color(style.palette, "accent"),
  ember: color(style.palette, "accent2"),
  blood: color(style.palette, "blood"),
  hot: color(style.palette, "whiteHot"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const F = style.finish;
const SW = E.strokeScale;
const cubicOut = bezier(0.33, 1, 0.68, 1);

/** Exponential decay used for every hit: 0.5^(t / halfLife). */
export const pulse = (t: number, hl: number): number => (t < 0 ? 0 : Math.pow(0.5, t / hl));

/** "#rrggbb" or "rgb(r, g, b)" → [r, g, b]. */
const hex = (h: string): number[] => {
  if (h.startsWith("rgb")) return (h.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Colour between a and b (k 0..1). */
export const mix = (a: string, b: string, k: number): string => {
  const x = hex(a);
  const y = hex(b);
  const q = clamp(k);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * q)).join(", ")})`;
};
/** The HDR glow (bloom + halation) around hot things, as CSS. */
export const bloomFilter = (k = 1) => `drop-shadow(0 0 ${6 * k}px ${rgba(C.signal, 0.75 * F.bloom)}) drop-shadow(0 0 ${20 * k}px ${rgba(C.blood, F.halation * 2)})`;
export const textGlow = (k = 1) => (k <= 0.01 ? "none" : `0 0 ${10 * k}px ${rgba(C.signal, 0.7 * k * F.bloom)}, 0 0 ${28 * k}px ${rgba(C.blood, F.halation * 1.6 * k)}`);

/** Archivo character width in em at a given width axis value (uppercase 900), estimated from renders. */
export const archivoEm = (wdth: number): number => 0.36 + 0.0042 * wdth;

const G = style.layout.grid;
const gridBg = (alpha: number, w: number) =>
  `linear-gradient(to right, ${rgba(C.bone, alpha)} ${w}px, transparent ${w}px), linear-gradient(to bottom, ${rgba(C.bone, alpha)} ${w}px, transparent ${w}px)`;

/** Crop marks at the frame's corners (bookend frames: the first and the loop end). */
const CropMarks: React.FC = () => {
  const { inset, arm, width, alpha } = style.layout.crop;
  const col = rgba(C.bone, alpha);
  const corners: [number, number, number, number][] = [
    [inset, inset, 1, 1],
    [W - inset, inset, -1, 1],
    [inset, H - inset, 1, -1],
    [W - inset, H - inset, -1, -1],
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {corners.map(([x, y, dx, dy], i) => (
        <g key={i} stroke={col} strokeWidth={width * SW}>
          <line x1={x} y1={y} x2={x + dx * arm} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + dy * arm} />
        </g>
      ))}
    </svg>
  );
};

/**
 * The board: ink, graph paper (minor 24 px, major 96 px, bone at low alpha), a soft signal glow that follows the pen,
 * the content, crop marks on bookend frames, then grain and vignette. Waits for the fonts.
 */
export const Board: React.FC<{ pen?: [number, number]; bookend?: boolean; roll?: number; children: React.ReactNode }> = ({ pen, bookend = false, roll = 0, children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${roll}rad)`, transformOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ backgroundImage: `${gridBg(G.minorAlpha, G.minorWidth)}, ${gridBg(G.majorAlpha, G.majorWidth)}`, backgroundSize: `${G.minor}px ${G.minor}px, ${G.minor}px ${G.minor}px, ${G.major}px ${G.major}px, ${G.major}px ${G.major}px`, backgroundPosition: `${(W / 2) % G.major}px ${(H / 2) % G.major}px` }} />
        {pen ? <AbsoluteFill style={{ background: `radial-gradient(circle ${F.sparkGlow * 2.2}px at ${pen[0]}px ${pen[1]}px, ${rgba(C.signal, 0.14)} 0%, ${rgba(C.signal, 0.05)} 45%, transparent 100%)` }} /> : null}
        {children}
      </AbsoluteFill>
      {bookend ? <CropMarks /> : null}
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The pen: a white-hot core, an ember ring, a signal halo, four spinning rays and a short trail. */
export const Spark: React.FC<{ x: number; y: number; dir?: number; trail?: number }> = ({ x, y, dir = Math.PI, trail = E.spark.trail }) => {
  const t = useSeconds();
  const k = E.spark.scale;
  const flicker = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(t * 61) * Math.sin(t * 23 + 1));
  const spin = t * 9;
  const back = dir + Math.PI;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: bloomFilter(1.2) }}>
      <defs>
        <linearGradient id={`trail-${Math.round(x)}-${Math.round(y)}`} x1={x} y1={y} x2={x + Math.cos(back) * trail * k} y2={y + Math.sin(back) * trail * k} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.ember} stopOpacity={0.9} />
          <stop offset="1" stopColor={C.signal} stopOpacity={0} />
        </linearGradient>
      </defs>
      <line x1={x} y1={y} x2={x + Math.cos(back) * trail * k} y2={y + Math.sin(back) * trail * k} stroke={`url(#trail-${Math.round(x)}-${Math.round(y)})`} strokeWidth={3 * k} strokeLinecap="round" />
      <circle cx={x} cy={y} r={E.spark.halo * k} fill={C.signal} opacity={E.spark.haloAlpha * flicker} style={{ filter: "blur(6px)" }} />
      <circle cx={x} cy={y} r={E.spark.ember * k * 0.75} fill={C.ember} opacity={0.85 * flicker} style={{ filter: "blur(2px)" }} />
      {[0, 1, 2, 3].map((i) => {
        const a = spin + (i * Math.PI) / 2;
        const len = (E.spark.rays[0] + (E.spark.rays[1] - E.spark.rays[0]) * (0.5 + 0.5 * Math.sin(t * 17 + i))) * k;
        const r0 = E.spark.core * k;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * (r0 + len)} y2={y + Math.sin(a) * (r0 + len)} stroke={C.hot} strokeWidth={E.spark.rayWidth * k} strokeLinecap="round" />;
      })}
      <circle cx={x} cy={y} r={E.spark.core * k} fill={C.hot} />
    </svg>
  );
};

export type Pt = [number, number];
const cumulative = (pts: Pt[]): number[] => {
  const out = [0];
  for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return out;
};
/** The part of a polyline between lengths a and b. */
const slice = (pts: Pt[], cum: number[], a: number, b: number): Pt[] => {
  const at = (L: number): Pt => {
    let j = cum.findIndex((c) => c >= L);
    if (j < 0) j = cum.length - 1;
    if (j < 1) j = 1;
    const seg = cum[j] - cum[j - 1] || 1;
    const k = clamp((L - cum[j - 1]) / seg);
    return [pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * k, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * k];
  };
  if (b <= a) return [];
  const inner = pts.filter((_, i) => cum[i] > a && cum[i] < b);
  return [at(a), ...inner, at(b)];
};
const toD = (pts: Pt[]) => (pts.length < 2 ? "" : `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`);

/** A sine wave from a to b (wavelength and amplitude in px) as points. */
export const wave = (a: Pt, b: Pt, wavelength: number, amp: number): Pt[] => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  const n = Math.max(2, Math.ceil(len / 4));
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (len * i) / n;
    const o = amp * Math.sin((2 * Math.PI * s) / wavelength);
    return [a[0] + ux * s - uy * o, a[1] + uy * s + ux * o] as Pt;
  });
};

export type Kind = keyof typeof E.strokes;
/**
 * A plotted stroke drawn by the pen from `at` over `dur` seconds. The fresh end runs hot (ember for 0.05 s, signal
 * for 0.32 s, 1.6× wide) before settling into its kind's colour. The spark rides the tip while it draws.
 */
export const Plot: React.FC<{ points: Pt[]; at: number; dur: number; kind?: Kind; width?: number; pen?: boolean; keepPen?: boolean; col?: string }> = ({
  points,
  at,
  dur,
  kind = "plot",
  width = E.strokeWidth,
  pen = true,
  keepPen = false,
  col,
}) => {
  const t = useSeconds();
  const cum = cumulative(points);
  const total = cum[cum.length - 1];
  const L = (tt: number) => clamp((tt - at) / dur) * total;
  const now = L(t);
  if (now <= 0) return null;
  const base = col ?? (kind === "signal" ? C.signal : C.bone);
  const alpha = E.strokes[kind];
  const w = width * SW;
  const dash = kind === "construction" ? E.dash.map((d) => d * SW).join(" ") : undefined;
  const hot = slice(points, cum, L(t - R.hot.duration), now);
  const ember = slice(points, cum, L(t - R.hot.ember), now);
  const tip = slice(points, cum, Math.max(0, now - 2), now);
  const drawing = now < total;
  const dir = tip.length >= 2 ? Math.atan2(tip[tip.length - 1][1] - tip[0][1], tip[tip.length - 1][0] - tip[0][0]) : 0;
  const end = slice(points, cum, 0, now);
  const last = end[end.length - 1];
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={toD(end)} fill="none" stroke={base} strokeOpacity={alpha} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
        {hot.length > 1 ? <path d={toD(hot)} fill="none" stroke={C.signal} strokeWidth={w * R.hot.widen} strokeLinecap="round" strokeLinejoin="round" style={{ filter: bloomFilter(0.6) }} /> : null}
        {ember.length > 1 ? <path d={toD(ember)} fill="none" stroke={C.ember} strokeWidth={w * R.hot.widen} strokeLinecap="round" /> : null}
      </svg>
      {pen && (drawing || keepPen) && last ? <Spark x={last[0]} y={last[1]} dir={dir} /> : null}
    </>
  );
};

/** A dimension line: arrowheads (9 px), end ticks (8 px) and its label at the midpoint, in ash. */
export const Dim: React.FC<{ a: Pt; b: Pt; label: string; at: number; side?: 1 | -1; size?: number }> = ({ a, b, label, at, side = -1, size = T.label }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("panel", t);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  const nx = -uy;
  const ny = ux;
  const ar = E.arrow * SW * 0.9;
  const tk = E.endTick * SW;
  const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const head = (p0: Pt, d: number) => `M ${p0[0]} ${p0[1]} L ${p0[0] + d * ux * ar + nx * ar * 0.38} ${p0[1] + d * uy * ar + ny * ar * 0.38} L ${p0[0] + d * ux * ar - nx * ar * 0.38} ${p0[1] + d * uy * ar - ny * ar * 0.38} Z`;
  const col = rgba(C.ash, E.strokes.dimension);
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={E.strokeWidth * SW} />
        <path d={head(a, 1)} fill={col} />
        <path d={head(b, -1)} fill={col} />
        {[a, b].map((q, i) => (
          <line key={i} x1={q[0] - nx * tk} y1={q[1] - ny * tk} x2={q[0] + nx * tk} y2={q[1] + ny * tk} stroke={col} strokeWidth={E.strokeWidth * SW} />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: mid[0] + nx * side * (size * 0.9),
          top: mid[1] + ny * side * (size * 0.9),
          transform: `translate(-50%, -50%) rotate(${Math.abs(angle) > 90 ? angle + 180 : angle}deg)`,
          fontFamily: MONO,
          fontSize: size,
          color: C.ash,
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          opacity: p,
        }}
      >
        {label}
      </div>
    </>
  );
};

/** A raised box (ink2, bone hairline) with registration ticks at its corners; it wipes in from the left and rises. */
export const Box: React.FC<{ x: number; y: number; w: number; h: number; at: number; children?: React.ReactNode }> = ({ x, y, w, h, at, children }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const wipe = ease("panel", t);
  const rise = (1 - expoOut(t / 0.5)) * R.panel.rise;
  const [r0, r1] = E.registration;
  const tick = rgba(C.bone, 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y + rise, width: w, height: h, clipPath: `inset(-30px ${(1 - wipe) * 100}% -30px -30px)` }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: C.ink2, border: `${E.strokeWidth * SW}px solid ${rgba(C.bone, E.strokes.ink * 0.7)}` }} />
      <svg width={w + 2 * r1} height={h + 2 * r1} style={{ position: "absolute", left: -r1, top: -r1, overflow: "visible" }}>
        {[
          [r1, r1, -1, -1],
          [w + r1, r1, 1, -1],
          [r1, h + r1, -1, 1],
          [w + r1, h + r1, 1, 1],
        ].map(([cx, cy, dx, dy], i) => (
          <g key={i} stroke={tick} strokeWidth={E.strokeWidth * SW}>
            <line x1={cx + dx * r0} y1={cy} x2={cx + dx * r1} y2={cy} />
            <line x1={cx} y1={cy + dy * r0} x2={cx} y2={cy + dy * r1} />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
};

export type KWord = { text: string; at: number; end: number; hot?: boolean };
/**
 * Spoken-word karaoke: unsaid words appear 0.3 s early as 1.1 px ash hairline outlines (45%); the word being said
 * fills left to right in signal; said words cool from signal to bone over 0.3 s (a `hot` keyword stays signal).
 */
export const Karaoke: React.FC<{ rows: KWord[][]; x: number; y: number; size: number; weight?: number; lh?: number; wdth?: number; align?: "left" | "center" }> = ({
  rows,
  x,
  y,
  size,
  weight = 700,
  lh = T.leading,
  wdth = 100,
  align = "left",
}) => {
  const t = useSeconds();
  const K = R.karaokeLead;
  const font: React.CSSProperties = { fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1, fontStretch: `${wdth}%`, fontVariationSettings: `'wdth' ${wdth}` };
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : 0, right: align === "center" ? 0 : undefined, top: y, textAlign: align }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ height: size * lh, whiteSpace: "nowrap" }}>
          {row.map((w, wi) => {
            const lead = clamp((t - (w.at - K.early)) / K.duration);
            if (lead <= 0) return <span key={wi} style={{ ...font, display: "inline-block", marginRight: "0.26em", opacity: 0 }}>{w.text}</span>;
            const fill = clamp((t - w.at) / Math.max(0.05, w.end - w.at));
            const cool = w.hot ? 0 : clamp((t - w.end) / R.said.duration);
            const heat = fill > 0 ? 1 - cool : 0;
            return (
              <span key={wi} style={{ ...font, position: "relative", display: "inline-block", marginRight: "0.26em" }}>
                <span style={{ color: "transparent", WebkitTextStroke: `${K.outline * SW}px ${rgba(C.ash, K.outlineAlpha * lead)}` }}>{w.text}</span>
                {fill > 0 ? (
                  <span style={{ position: "absolute", left: 0, top: 0, color: mix(C.signal, C.bone, cool), clipPath: `inset(-20% ${(1 - fill) * 100}% -20% -5%)`, textShadow: textGlow(heat * (w.hot ? 0.8 : 0.6)) }}>{w.text}</span>
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * An Archivo 900 uppercase slam: scale 1.22 → 1 in 0.18 s, ember → signal while said, cooling to bone over 0.4 s after
 * it ends (unless `hot`). With `morph`, each letter drops in and steps through the widths 62 → … → `wdth`, staggered.
 */
export const Slam: React.FC<{ text: string; size: number; x?: number; y: number; at: number; end: number; wdth?: number; morph?: boolean; hot?: boolean; align?: "left" | "center" }> = ({
  text,
  size,
  x = W / 2,
  y,
  at,
  end,
  wdth = 100,
  morph = false,
  hot = false,
  align = "center",
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = R.slam.from + (1 - R.slam.from) * ease("slam", t);
  const heat = hot ? 1 : 1 - ease("cool", t - (end - at));
  const emberK = pulse(t, 0.085);
  const col = mix(mix(C.signal, C.ember, emberK), C.bone, 1 - heat);
  const steps = (T.widths as number[]).filter((w) => w <= wdth);
  const letters = Array.from(text.toUpperCase());
  const span = (0.85 * (end - at)) / Math.max(1, letters.length);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        transform: `translateY(-50%) scale(${s})`,
        transformOrigin: align === "center" ? "50% 50%" : "0 50%",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.9,
        color: col,
        whiteSpace: "nowrap",
        textShadow: textGlow(heat * 0.9),
      }}
    >
      {morph
        ? letters.map((ch, i) => {
            const tl = t - i * span;
            if (tl < 0) return <span key={i} style={{ opacity: 0, fontStretch: `${steps[0]}%`, fontVariationSettings: `'wdth' ${steps[0]}` }}>{ch}</span>;
            const q = ease("widthStep", tl);
            const w = steps[Math.min(steps.length - 1, Math.floor(q * (steps.length - 1) + 1e-6))];
            const drop = -(1 - cubicOut(clamp(tl / R.drop.duration))) * R.drop.distance * size;
            return (
              <span key={i} style={{ display: "inline-block", fontStretch: `${w}%`, fontVariationSettings: `'wdth' ${w}`, transform: `translateY(${drop}px)`, whiteSpace: "pre" }}>
                {ch}
              </span>
            );
          })
        : <span style={{ fontStretch: `${wdth}%`, fontVariationSettings: `'wdth' ${wdth}` }}>{text.toUpperCase()}</span>}
    </div>
  );
};

/** A mono note that types on (min(0.45, 0.012 × chars + 0.05) s) with a signal block caret while typing. */
export const Note: React.FC<{ text: string; x: number; y: number; at: number; col?: string; size?: number; spaced?: boolean; align?: "left" | "right" | "center" }> = ({
  text,
  x,
  y,
  at,
  col = C.ash,
  size = T.note,
  spaced = false,
  align = "left",
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const dur = Math.min(R.type.duration, R.type.perChar * text.length + R.type.base);
  const n = Math.floor(text.length * clamp(t / dur));
  const typing = n < text.length;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? x - 500 : undefined,
        right: align === "right" ? W - x : undefined,
        width: align === "center" ? 1000 : undefined,
        textAlign: align,
        top: y,
        fontFamily: MONO,
        fontWeight: spaced ? 500 : 400,
        fontSize: size,
        letterSpacing: spaced ? `${T.labelTracking}em` : "0.02em",
        textTransform: spaced ? "uppercase" : undefined,
        color: col,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {text.slice(0, n)}
      {typing ? <span style={{ display: "inline-block", width: size * 0.16, height: size * 0.9, marginLeft: 2, verticalAlign: "-0.1em", backgroundColor: C.signal }} /> : null}
    </div>
  );
};

/** A caption in Cormorant italic (lining figures) revealed by the pen: a clip wipe whose edge the spark rides. */
export const PenWrite: React.FC<{ text: string; x: number; y: number; at: number; dur: number; size?: number; col?: string; align?: "left" | "center" }> = ({ text, x, y, at, dur, size = T.caption, col = C.bone, align = "left" }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = clamp(t / dur);
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : 0, right: align === "center" ? 0 : undefined, top: y, textAlign: align }}>
      <span style={{ position: "relative", display: "inline-block" }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: size, lineHeight: 1.1, color: col, fontVariantNumeric: "lining-nums", clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, display: "inline-block", whiteSpace: "nowrap" }}>{text}</span>
        {p < 1 ? (
          <span style={{ position: "absolute", left: `${p * 100}%`, top: "62%", width: 0, height: 0 }}>
            <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
              <circle r={E.spark.halo * E.spark.scale * 0.8} fill={C.signal} opacity={0.3} style={{ filter: "blur(5px)" }} />
              <circle r={E.spark.ember * E.spark.scale * 0.6} fill={C.ember} opacity={0.85} style={{ filter: "blur(2px)" }} />
              <circle r={E.spark.core * E.spark.scale} fill={C.hot} />
            </svg>
          </span>
        ) : null}
      </span>
    </div>
  );
};

/** A plain Cormorant line (captions, formulas), lining figures always. */
export const Serif: React.FC<{ x: number; y: number; at: number; size?: number; col?: string; align?: "left" | "center" | "right"; italic?: boolean; children: React.ReactNode }> = ({
  x,
  y,
  at,
  size = T.caption,
  col = C.ash,
  align = "left",
  italic = true,
  children,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : align === "center" ? 0 : undefined,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.1,
        color: col,
        fontVariantNumeric: "lining-nums",
        opacity: ease("panel", t),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Corner furniture: plate number and title top-left; a readout instrument bottom-right (label, digits, tick bar). */
export const Furniture: React.FC<{ plate: string; title: string; readout?: { label: string; value: string; frac: number; at: number } }> = ({ plate, title, readout }) => {
  const t = useSeconds();
  const f = style.layout.furniture;
  const bar = E.readoutBar;
  const p = readout ? ease("panel", t - readout.at) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: f.x, top: f.top, fontFamily: MONO, fontWeight: 500, fontSize: T.label, letterSpacing: `${T.labelTracking}em`, color: rgba(C.bone, 0.6), whiteSpace: "nowrap" }}>
        {`${plate}  ·  ${title.toUpperCase()}`}
      </div>
      {readout ? (
        <div style={{ position: "absolute", right: f.x, top: f.bottom - 118, width: bar + 40, textAlign: "right", opacity: p }}>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: T.label, letterSpacing: `${T.labelTracking}em`, color: rgba(C.bone, 0.6) }}>{readout.label}</div>
          <div style={{ fontFamily: MONO, fontWeight: 400, fontSize: T.readout, color: C.bone, lineHeight: 1.25 }}>{readout.value}</div>
          <svg width={bar} height={16} style={{ display: "block", marginLeft: "auto", marginTop: 6 }}>
            {Array.from({ length: 23 }, (_, i) => (
              <line key={i} x1={(i * bar) / 22} y1={i % 5 === 0 ? 0 : 5} x2={(i * bar) / 22} y2={12} stroke={rgba(C.bone, 0.45)} strokeWidth={1.2} />
            ))}
            <rect x={0} y={13} width={bar * clamp(readout.frac) * p} height={3} fill={C.signal} style={{ filter: bloomFilter(0.4) }} />
          </svg>
        </div>
      ) : null}
    </>
  );
};

/** Digits that roll 0 → value through a clipped window, one after another; the dot pops 1.6 → 1. */
export const Odometer: React.FC<{ value: string; size: number; y: number; at: number; per: number; unit?: string; wdth?: number }> = ({ value, size, y, at, per, unit, wdth = 100 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const chars = Array.from(value);
  let d = 0;
  const font: React.CSSProperties = { fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 1, fontStretch: `${wdth}%`, fontVariationSettings: `'wdth' ${wdth}` };
  const heat = 1 - ease("cool", t - per * chars.length);
  const col = mix(C.signal, C.bone, 1 - heat);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - size / 2, textAlign: "center", whiteSpace: "nowrap", textShadow: textGlow(heat * 0.8) }}>
      {chars.map((ch, i) => {
        if (!/[0-9]/.test(ch)) {
          const q = clamp((t - d * per) / 0.15);
          return (
            <span key={i} style={{ ...font, display: "inline-block", color: col, transform: `scale(${1.6 - 0.6 * expoOut(q)})`, opacity: q > 0 ? 1 : 0 }}>
              {ch}
            </span>
          );
        }
        const n = Number(ch);
        const q = cubicOut(clamp((t - d * per) / Math.max(R.odometer.min, per * 0.9)));
        d += 1;
        return (
          <span key={i} style={{ display: "inline-block", height: size, overflow: "hidden", verticalAlign: "top" }}>
            <span style={{ display: "block", transform: `translateY(${-n * q * size}px)` }}>
              {Array.from({ length: 10 }, (_, k) => (
                <span key={k} style={{ ...font, display: "block", height: size, color: col }}>
                  {k}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {unit ? <span style={{ ...font, color: C.signal, marginLeft: size * 0.04, textShadow: textGlow(0.9) }}>{unit}</span> : null}
    </div>
  );
};
