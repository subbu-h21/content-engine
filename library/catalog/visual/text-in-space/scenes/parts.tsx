/**
 * Text in Space's pieces: the four-layer shot (plate, back words, speaker cutout, front words) with its slow push-in,
 * words with the seven entrances, arcs, the text ring and rack focus. Every value comes from style.json.
 * In the previews the plate and the cutout are plain stand-ins: a dark gradient and a flat grey silhouette.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { CONDENSED, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const HEAD = style.layout.head;
export const C = {
  bg: color(style.palette, "background"),
  plate: color(style.palette, "surface"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  stand: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  shadow: color(style.palette, "accent2"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const F = style.finish;

const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** The plate stand-in: a dark gradient, lit a little behind the speaker. */
const Plate: React.FC = () => <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 55% at 50% 40%, ${C.plate} 0%, ${C.bg} 75%)` }} />;

/** The speaker cutout stand-in: a flat grey silhouette, lower-middle, empty space above and to the sides. */
export const Cutout: React.FC = () => {
  const { x, y, rx, ry } = HEAD;
  const sh = S.layout.shoulders;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: "blur(1.2px)" }}>
      <defs>
        <linearGradient id="tis-stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.stand} />
          <stop offset="1" stopColor={C.stand} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <g fill="url(#tis-stand)">
        <ellipse cx={x} cy={y} rx={rx} ry={ry} />
        <rect x={x - 52} y={y + ry - 30} width={104} height={sh - (y + ry) + 60} rx={30} />
        <path
          d={`M ${x - 380} ${H} L ${x - 368} ${sh + 260} C ${x - 360} ${sh + 110}, ${x - 280} ${sh + 30}, ${x - 140} ${sh} L ${x + 140} ${sh} C ${x + 280} ${sh + 30}, ${x + 360} ${sh + 110}, ${x + 368} ${sh + 260} L ${x + 380} ${H} Z`}
        />
      </g>
    </svg>
  );
};

/**
 * One shot in four layers, bottom to top: plate, words behind the speaker, the cutout, words in front.
 * The whole shot pushes in slowly (k 1.0 → 1.16 over the shot), so words at depth 0 stay glued to the footage.
 */
export const Shot: React.FC<{ back?: React.ReactNode; front?: React.ReactNode; length: number }> = ({ back, front, length }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const k = R.push.from + (R.push.to - R.push.from) * clamp(t / length);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: `${HEAD.x}px 900px` }}>
        <Plate />
        <AbsoluteFill>{back}</AbsoluteFill>
        <Cutout />
        <AbsoluteFill>{front}</AbsoluteFill>
      </AbsoluteFill>
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export type Move = "swing" | "pop" | "stretch" | "slam" | "slide" | "fade" | "drop" | "none";
export type Effect = "soft" | "sticker" | "slam" | "none";
const softShadow = (size: number) => `0 ${0.03 * size}px ${0.09 * size}px rgba(0,0,0,${F.softShadow})`;
const slamShadow = (size: number) => `${T.slamShadow * size}px ${T.slamShadow * size}px 0 ${C.shadow}`;

const METRICS = { display: { top: -0.41, base: 0.35 }, condensed: { top: -0.35, base: 0.53 } };
export type Line = { size: number; face?: "display" | "condensed"; gap?: number };
/** Lines that nearly touch (leading 0.85); returns centre ys and the last baseline. */
export const stack = (lines: Line[], top: number): { ys: number[]; bottom: number } => {
  const gapEm = T.leading - (METRICS.display.base - METRICS.display.top);
  let y = top;
  let prev = 0;
  let prevFace = "display";
  const ys = lines.map((l) => {
    const face = l.face ?? "display";
    const m = METRICS[face];
    if (prev) y += l.gap !== undefined ? l.gap * Math.max(prev, l.size) : face === "condensed" && prevFace === "display" ? Math.max(0.3 * prev, 0.14 * l.size) : gapEm * Math.max(prev, l.size);
    const c = y - m.top * l.size;
    y = c + m.base * l.size;
    prev = l.size;
    prevFace = face;
    return c;
  });
  return { ys, bottom: y };
};

/** Rack focus: 0 → 9 px of blur once focus moves away at `at` seconds. */
export const focusOut = (t: number, at: number): number => ease("focus", t - at) * R.focus.blur;

/** One word or phrase centred on (x, y), entering with a named move at `at` seconds (as in the red-card style). */
export const Word: React.FC<{
  text: string;
  size: number;
  y: number;
  x?: number;
  at?: number;
  move?: Move;
  dir?: 1 | -1;
  face?: "display" | "condensed";
  fill?: string;
  effect?: Effect;
  blur?: number;
  seed?: number;
  /** the 9 px grey sticker outline behind the fill, on top of any shadow effect (keeps red words readable on busy footage) */
  sticker?: boolean;
}> = ({ text, size, y, x = W / 2, at = 0, move = "slam", dir = -1, face = "display", fill = C.text, effect = "soft", blur = 0, seed = 1, sticker = false }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const condensed = face === "condensed";
  let transform = "";
  let opacity = 1;
  let spacing = condensed ? T.condensedTracking : T.tracking;
  if (move === "swing") {
    const p = ease("swing", t);
    const q = 1 - p;
    transform = `perspective(${R.push.perspective}px) translateX(${q * R.swing.x * dir}px) translateZ(${q * R.swing.z}px) rotateY(${q * R.swing.rotateY * -dir}deg) rotateZ(${q * R.swing.rotateZ * dir}deg)`;
    spacing += R.swing.spacing * 4 * clamp(p) * (1 - clamp(p));
    opacity = clamp(t / 0.1);
  } else if (move === "stretch") {
    transform = `scaleX(${R.stretch.from + (1 - R.stretch.from) * ease("stretch", t)})`;
  } else if (move === "slam") {
    transform = `scale(${Math.max(0, ease("slam", t))})`;
  } else if (move === "slide") {
    const p = ease("slide", t);
    transform = `translateX(${(1 - p) * R.slide.distance * dir}px) rotate(${(1 - p) * R.slide.tilt * dir}deg)`;
    opacity = clamp(t / R.slide.opacity);
  } else if (move === "fade") {
    const p = ease("fade", t);
    opacity = p;
    transform = `scale(${R.fade.scale + (1 - R.fade.scale) * p})`;
  } else if (move === "drop") {
    transform = `translateY(${-(1 - ease("drop", t)) * R.drop.distance}px)`;
  }
  const base: React.CSSProperties = {
    fontFamily: condensed ? CONDENSED : DISPLAY,
    fontWeight: condensed ? 400 : 900,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: `${spacing}em`,
    textTransform: condensed ? "uppercase" : "lowercase",
    whiteSpace: "nowrap",
  };
  const letters = Array.from(text);
  const order = letters.map((_, i) => i).sort((a, b) => rand(seed * 31 + a) - rand(seed * 31 + b));
  const body =
    move === "pop"
      ? letters.map((ch, i) => {
          const tl = t - order.indexOf(i) * R.pop.stagger;
          const s = tl > 0 ? Math.max(0, ease("pop", tl)) : 0;
          const jit = R.pop.jitter * size * (rand(seed * 7 + i) - 0.5) * 2 * (1 - clamp(tl / R.pop.settle));
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${jit}px) scale(${s})`, opacity: tl > 0 ? 1 : 0 }}>
              {ch}
            </span>
          );
        })
      : text;
  const shadow = effect === "soft" ? softShadow(size) : effect === "slam" ? slamShadow(size) : "none";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "relative", transform, transformOrigin: "50% 60%" }}>
        {effect === "sticker" || sticker ? (
          <div aria-hidden style={{ ...base, position: "absolute", left: 0, top: 0, color: C.muted, WebkitTextStroke: `${T.stickerOutline * 2 + (condensed ? T.condensedStroke : 0)}px ${C.muted}` }}>
            {body}
          </div>
        ) : null}
        <div style={{ ...base, position: "relative", color: fill, textShadow: shadow, WebkitTextStroke: condensed ? `${T.condensedStroke}px ${fill}` : undefined }}>{body}</div>
      </div>
    </div>
  );
};

/** Words bent on an arc of radius r through (x, y): r > 0 bends like a rainbow (y is the apex), r < 0 like a smile. */
export const ArcWords: React.FC<{ id: string; parts: { text: string; fill?: string }[]; size: number; y: number; r: number; x?: number; at?: number; dir?: 1 | -1; blur?: number; sticker?: boolean }> = ({
  id,
  parts,
  size,
  y,
  r,
  x = W / 2,
  at = 0,
  dir = 1,
  blur = 0,
  sticker = false,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("slide", t);
  const a = Math.abs(r);
  const half = Math.min(1.4, (W * 0.7) / a);
  const x0 = x - a * Math.sin(half);
  const x1 = x + a * Math.sin(half);
  const yEnd = r > 0 ? y + a * (1 - Math.cos(half)) : y - a * (1 - Math.cos(half));
  const d = `M ${x0} ${yEnd} A ${a} ${a} 0 0 ${r > 0 ? 1 : 0} ${x1} ${yEnd}`;
  return (
    <svg
      width={W}
      height={H}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        opacity: clamp(t / R.slide.opacity),
        transform: `translateX(${(1 - p) * R.slide.distance * dir}px) rotate(${(1 - p) * R.slide.tilt * dir}deg)`,
        transformOrigin: `${x}px ${y}px`,
        filter: `drop-shadow(0 ${0.03 * size}px ${0.09 * size}px rgba(0,0,0,${F.softShadow}))${blur > 0.05 ? ` blur(${blur}px)` : ""}`,
      }}
    >
      <defs>
        <path id={id} d={d} />
      </defs>
      {sticker ? (
        <text fontFamily={DISPLAY} fontWeight={900} fontSize={size} letterSpacing={`${T.tracking * size}px`} dominantBaseline="central" fill={C.muted} stroke={C.muted} strokeWidth={T.stickerOutline * 2} strokeLinejoin="round">
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
            {parts.map((pt) => pt.text.toLowerCase()).join(" ")}
          </textPath>
        </text>
      ) : null}
      <text fontFamily={DISPLAY} fontWeight={900} fontSize={size} letterSpacing={`${T.tracking * size}px`} dominantBaseline="central">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {parts.map((pt, i) => (
            <tspan key={i} fill={pt.fill ?? C.text}>
              {(i > 0 ? " " : "") + pt.text.toLowerCase()}
            </tspan>
          ))}
        </textPath>
      </text>
    </svg>
  );
};

/**
 * The text ring: letters around a circle on the speaker's head (rotateY(a) translateZ(r), tilted), turning 4–5° a
 * frame. Rendered twice: letters facing the camera (cos a ≥ 0) on the front stage, the rest behind the cutout.
 */
export const Ring: React.FC<{ text: string; stage: "back" | "front"; at?: number; size?: number; fill?: string; cx?: number; cy?: number; start?: number }> = ({
  text,
  stage,
  at = 0,
  size = T.ring,
  fill = C.text,
  cx = HEAD.x,
  cy = HEAD.y - HEAD.ry * 0.35,
  start = 0,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const r = R.ring;
  const letters = Array.from(text.toLowerCase());
  const n = letters.length;
  const turn = start + r.degPerSecond * t;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, perspective: `${R.push.perspective}px`, perspectiveOrigin: `${cx}px ${cy}px` }}>
      <div style={{ position: "absolute", left: cx, top: cy, transformStyle: "preserve-3d", transform: `rotateX(${-r.tilt}deg)` }}>
        {letters.map((ch, i) => {
          const a = (turn + (360 * i) / n) % 360;
          const front = Math.cos((a * Math.PI) / 180) >= 0;
          if ((stage === "front") !== front) return null;
          const shown = clamp((t - i * r.letterGap) / 0.066);
          if (shown <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate(-50%, -50%) rotateY(${a}deg) translateZ(${r.radius}px)`,
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: size,
                lineHeight: 1,
                color: fill,
                opacity: shown,
                textShadow: softShadow(size),
                whiteSpace: "pre",
              }}
            >
              {ch}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** A small floating disc with scatter rays: the only drawn object this style allows (thick white strokes). */
export const Molecule: React.FC<{ x: number; y: number; at?: number; r?: number }> = ({ x, y, at = 0, r = 46 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = Math.max(0, ease("slam", t));
  const rays = Array.from({ length: 9 }, (_, i) => (Math.PI * 2 * i) / 9 + 0.3);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 3px 8px rgba(0,0,0,${F.softShadow}))` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {rays.map((a, i) => {
          const p = Math.max(0, ease("pop", t - 0.25 - i * R.pop.stagger));
          return <line key={i} x1={(r + 22) * Math.cos(a)} y1={(r + 22) * Math.sin(a)} x2={(r + 22 + 52 * Math.min(1.1, p)) * Math.cos(a)} y2={(r + 22 + 52 * Math.min(1.1, p)) * Math.sin(a)} stroke={C.text} strokeWidth={10} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
        })}
        <circle r={r + 6} fill={C.muted} />
        <circle r={r} fill={C.text} />
      </g>
    </svg>
  );
};
