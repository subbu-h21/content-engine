/**
 * Night-sky Classroom's pieces: the grounds (night, day, sunset), sun, sunlight beam, glowing waves, air molecules,
 * scatter sparks, rays, the hill and the child, quiet pills, the eyebrow and the Fredoka headline.
 * Every value comes from style.json. SVG pieces go inside one full-frame <Frame>.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, expoOut, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
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
  surface: color(P, "surface"),
  text: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  accent: color(P, "accent"),
  accent2: color(P, "accent2"),
  sun: color(P, "sun"),
  beam: color(P, "beam"),
  red: color(P, "red"),
  blue: color(P, "blue"),
  paleBlue: color(P, "pale-blue"),
  hill: color(P, "hill"),
  figure: color(P, "figure"),
};
/** The six colours of sunlight, in order. */
export const SPECTRUM = ["red", "orange", "yellow", "green", "blue", "violet"].map((name) => ({ name, hex: color(P, name) }));
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const E = style.elements;

/** The soft ink halo that keeps type legible over the sky. */
export const halo = (strength = style.finish.halo): string =>
  strength <= 0
    ? "none"
    : [`0 0 2px ${rgba(C.bg, 0.55 * strength)}`, `0 0 6px ${rgba(C.bg, 0.45 * strength)}`, `0 0 14px ${rgba(C.bg, 0.35 * strength)}`, `0 0 28px ${rgba(C.bg, 0.25 * strength)}`].join(", ");

/** Deterministic 0..1 noise, so every render of a frame is identical. */
export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const gradient = (stops: (string | number)[][]): string => `linear-gradient(to bottom, ${stops.map(([c, p]) => `${c} ${p}%`).join(", ")})`;

/** The ground: night (ink + a soft radial lift), with the day and sunset skies laid over it by opacity. Waits for the fonts. */
export const Ground: React.FC<{ day?: number; sunset?: number; children: React.ReactNode }> = ({ day = 0, sunset = 0, children }) => {
  useFontsReady(FACES);
  const n = style.grounds.night;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${n.ellipse[0]}% ${n.ellipse[1]}% at ${n.at[0]}% ${n.at[1]}%, ${color(P, n.glow)} 0%, ${C.bg} ${n.fade}%)` }} />
      {day > 0 ? <AbsoluteFill style={{ background: gradient(style.grounds.day), opacity: clamp(day) }} /> : null}
      {sunset > 0 ? <AbsoluteFill style={{ background: gradient(style.grounds.sunset), opacity: clamp(sunset) }} /> : null}
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
    {children}
  </svg>
);

/** The sun: a solid disc of radius r with a soft glow falling off to 4 r. */
export const Sun: React.FC<{ x: number; y: number; r?: number; alpha?: number }> = ({ x, y, r = E.sun.r, alpha = 1 }) => {
  if (alpha <= 0) return null;
  const glow = E.sun.glow;
  const outer = r * glow[glow.length - 1][1];
  const stops = [`${C.sun} 0px`, `${C.sun} ${r}px`, ...glow.map(([a, k]) => `${rgba(C.sun, a)} ${r * k}px`)].join(", ");
  return <div style={{ position: "absolute", left: x - outer, top: y - outer, width: 2 * outer, height: 2 * outer, borderRadius: "50%", opacity: alpha, background: `radial-gradient(circle, ${stops})` }} />;
};

/** A sine wave from x0 to x1 along y; `phase` (in wavelengths) moves it along. */
export const wavePath = (x0: number, x1: number, y: number, lambda: number, amp: number, phase: number): string => {
  if (x1 <= x0) return "";
  const pts: string[] = [];
  for (let x = x0; ; x += 5) {
    const xx = Math.min(x, x1);
    const yy = y - amp * Math.sin(((xx - x0) / lambda - phase) * Math.PI * 2);
    pts.push(`${xx.toFixed(1)} ${yy.toFixed(1)}`);
    if (xx >= x1) break;
  }
  return `M ${pts.join(" L ")}`;
};

type WaveKind = "red" | "blue" | "rainbow" | "hit";

/** A glowing wave that keeps travelling: a wide faint pass under a crisp one. `stroke` may be a `url(#gradient)`. */
export const Wave: React.FC<{ kind: WaveKind; x0: number; x1: number; y: number; t: number; stroke: string; alpha?: number }> = ({ kind, x0, x1, y, t, stroke, alpha = 1 }) => {
  if (alpha <= 0 || x1 <= x0) return null;
  const w = E.wave[kind];
  const d = wavePath(x0, x1, y, w.lambda, w.amp, t * w.speed);
  return (
    <g opacity={alpha}>
      <path d={d} fill="none" stroke={stroke} strokeOpacity={E.wave.glowOpacity} strokeWidth={w.width * E.wave.glowWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={w.width} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export type Dot = { x: number; y: number; r: number };

/** `n` molecules scattered over a box, deterministic for a seed. */
export const scatterDots = (n: number, seed: number, box: { x0: number; y0: number; x1: number; y1: number }): Dot[] =>
  Array.from({ length: n }, (_, i) => ({
    x: lerp(box.x0, box.x1, rnd(i, seed)),
    y: lerp(box.y0, box.y1, rnd(i, seed + 7)),
    r: lerp(E.molecule.r[0], E.molecule.r[1], rnd(i, seed + 13)),
  }));

/** Air molecules: soft cream dots that pop in one after another from `start` and wobble gently. */
export const Molecules: React.FC<{ dots: Dot[]; t: number; start: number; spread?: number; alpha?: number }> = ({ dots, t, start, spread = style.motion.popSpread, alpha = 1 }) => {
  const m = E.molecule;
  return (
    <g>
      {dots.map((d, i) => {
        const p = ease("pop", t - start - (spread * i) / Math.max(1, dots.length));
        if (p <= 0) return null;
        const x = d.x + m.wobble * Math.sin(t * 1.3 + i * 1.7);
        const y = d.y + m.wobble * Math.cos(t * 1.1 + i * 2.3);
        return (
          <g key={i} opacity={p * alpha}>
            <circle cx={x} cy={y} r={d.r * m.halo * p} fill={C.text} opacity={m.haloOpacity} />
            <circle cx={x} cy={y} r={d.r * p} fill={C.text} opacity={m.opacity} />
          </g>
        );
      })}
    </g>
  );
};

/** One scatter burst `age` seconds old: short sparks flying out in every direction, gone after the spark recipe's life. */
export const Burst: React.FC<{ x: number; y: number; age: number; stroke: string; size?: number; turn?: number; alpha?: number }> = ({ x, y, age, stroke, size = 1, turn = 0, alpha = 1 }) => {
  const life = style.motion.recipes.spark.duration;
  if (age < 0 || age > life || alpha <= 0) return null;
  const s = E.spark;
  const p = ease("spark", age);
  const r0 = lerp(s.from, s.to, expoOut(p * s.reach)) * size;
  const len = s.length * size * (1 - p * 0.5);
  return (
    <g opacity={(1 - p) * alpha}>
      <circle cx={x} cy={y} r={lerp(s.ring[0], s.ring[1], p) * size} fill="none" stroke={stroke} strokeOpacity={s.ringOpacity * (1 - p)} strokeWidth={s.ringWidth} />
      {Array.from({ length: s.count }, (_, i) => {
        const a = turn + (i * Math.PI * 2) / s.count;
        const c = Math.cos(a);
        const n = Math.sin(a);
        return <line key={i} x1={x + c * r0} y1={y + n * r0} x2={x + c * (r0 + len)} y2={y + n * (r0 + len)} stroke={stroke} strokeWidth={s.width * size} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Bursts going off all over a set of dots from `start`, each dot at its own phase, every `period` seconds. */
export const Sparkle: React.FC<{ dots: Dot[]; t: number; start: number; stroke: string; period?: number; size?: number; alpha?: number }> = ({
  dots,
  t,
  start,
  stroke,
  period = style.motion.sparkEvery,
  size = 0.6,
  alpha = 1,
}) => (
  <g>
    {dots.map((d, i) => {
      const t0 = start + rnd(i, 3) * period;
      if (t < t0) return null;
      const k = Math.floor((t - t0) / period);
      return <Burst key={i} x={d.x} y={d.y} age={t - (t0 + k * period)} stroke={stroke} size={size} turn={k * 0.5 + i} alpha={alpha} />;
    })}
  </g>
);

/** A dashed ray from (x0,y0) to (x1,y1) that draws in, then carries a dot of light along it. */
export const Ray: React.FC<{ x0: number; y0: number; x1: number; y1: number; stroke: string; t: number; at: number; offset?: number; alpha?: number }> = ({
  x0,
  y0,
  x1,
  y1,
  stroke,
  t,
  at,
  offset = 0,
  alpha = 1,
}) => {
  const draw = ease("ray", t - at);
  if (alpha <= 0 || draw <= 0) return null;
  const r = E.ray;
  const f = (((t * r.speed + offset) % 1) + 1) % 1;
  return (
    <g opacity={alpha}>
      <line x1={x0} y1={y0} x2={lerp(x0, x1, draw)} y2={lerp(y0, y1, draw)} stroke={stroke} strokeOpacity={r.opacity} strokeWidth={r.width} strokeDasharray={r.dash.join(" ")} strokeLinecap="round" />
      {draw >= 0.98 ? <circle cx={lerp(x0, x1, f)} cy={lerp(y0, y1, f)} r={r.dot} fill={stroke} /> : null}
    </g>
  );
};

/** The hill along the bottom: a quadratic curve from the left edge over a crest at mid-width to the right edge. */
export const hillY = (x: number): number => {
  const h = E.hill;
  const t = x / W;
  return (1 - t) * (1 - t) * h.left + 2 * t * (1 - t) * h.crest + t * t * h.right;
};

export const Hill: React.FC<{ alpha?: number }> = ({ alpha = 1 }) => {
  if (alpha <= 0) return null;
  const h = E.hill;
  return <path d={`M 0 ${h.left} Q ${W / 2} ${h.crest} ${W} ${h.right} L ${W} ${H} L 0 ${H} Z`} fill={C.hill} opacity={alpha} />;
};

/** Where the child's head is (rays aim at it). */
export const kidHead = (): { x: number; y: number } => ({ x: E.kid.x + 6, y: hillY(E.kid.x) - 188 });

/** The child standing on the hill, pointing at the sky: a flat silhouette. */
export const Kid: React.FC<{ alpha?: number }> = ({ alpha = 1 }) => {
  if (alpha <= 0) return null;
  const x = E.kid.x;
  const y = hillY(x) + 6;
  const h = kidHead();
  return (
    <g opacity={alpha} stroke={C.figure} strokeLinecap="round" fill={C.figure}>
      <line x1={x - 12} y1={y - 70} x2={x - 18} y2={y} strokeWidth={18} />
      <line x1={x + 12} y1={y - 70} x2={x + 18} y2={y} strokeWidth={18} />
      <path d={`M ${x - 34} ${y - 58} Q ${x - 38} ${y - 140} ${x} ${y - 150} Q ${x + 38} ${y - 140} ${x + 34} ${y - 58} Z`} strokeWidth={4} />
      <line x1={x - 24} y1={y - 128} x2={x - 46} y2={y - 72} strokeWidth={15} />
      <line x1={x + 22} y1={y - 132} x2={x + 74} y2={y - 214} strokeWidth={15} />
      <circle cx={h.x} cy={h.y} r={E.kid.head} stroke="none" />
    </g>
  );
};

/** A quiet label pill: Inter in the text colour on an ink fill with a faint border; `dot` ties it to a diagram colour. */
export const Pill: React.FC<{ text: string; x: number; y: number; at: number; align?: "left" | "right" | "center"; dot?: string }> = ({ text, x, y, at, align = "left", dot }) => {
  const p = ease("pill", useSeconds() - at);
  if (p <= 0) return null;
  const size = S.type.label;
  const k = E.pill;
  const lift = (1 - p) * style.motion.recipes.pill.distance;
  const box: React.CSSProperties =
    align === "left" ? { left: x, transform: `translateY(${lift}px)` } : align === "right" ? { right: W - x, transform: `translateY(${lift}px)` } : { left: x, transform: `translateX(-50%) translateY(${lift}px)` };
  return (
    <div
      style={{
        position: "absolute",
        top: y - size * 0.95,
        ...box,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: `${k.padY}px ${k.padX}px`,
        borderRadius: 999,
        backgroundColor: rgba(C.bg, k.fill),
        border: `${k.border}px solid ${rgba(C.muted, k.borderOpacity)}`,
        fontFamily: BODY,
        fontWeight: S.type.labelWeight,
        fontSize: size,
        lineHeight: 1.1,
        color: C.text,
        opacity: p,
        whiteSpace: "nowrap",
        textShadow: halo(0.4 * style.finish.halo),
      }}
    >
      {dot ? <span style={{ width: k.dot, height: k.dot, borderRadius: "50%", backgroundColor: dot, boxShadow: `0 0 ${k.dotGlow}px ${dot}` }} /> : null}
      {text}
    </div>
  );
};

/** Eyebrow (chapter marker / kicker): small Inter in the muted colour, sliding in from the left; optional rule under it. */
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
          transform: `translateX(${(1 - p) * -style.motion.recipes.eyebrow.distance}px)`,
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

/** Fredoka headline: one colour, *emphasis* set heavier (no italics), words rise and fade in one after another. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; x?: number; align?: "left" | "center" }> = ({ lines, size, y, at = 0, x = M, align = "center" }) => {
  const t = useSeconds() - at;
  const { distance } = style.motion.recipes.rise;
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
        color: C.text,
        whiteSpace: "nowrap",
        textShadow: halo(),
        fontKerning: "normal",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("rise", t - i * style.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", opacity: Math.max(0, p), transform: `translateY(${(1 - p) * distance}px)`, fontWeight: w.em ? S.type.emphasisWeight : S.type.weight }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Body copy: Inter in the muted colour (rare in this style: the narration carries the words). */
export const Body: React.FC<{ text: string; y: number; at?: number; width?: number; align?: "left" | "center" }> = ({ text, y, at = 0, width = COLUMN, align = "center" }) => {
  const p = ease("pill", useSeconds() - at);
  const size = S.type.body;
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : M,
        top: y - size * 0.8,
        width,
        textAlign: align,
        fontFamily: BODY,
        fontWeight: S.type.labelWeight,
        fontSize: size,
        lineHeight: 1.35,
        color: C.muted,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        textShadow: halo(0.5),
        textWrap: "balance",
      }}
    >
      {text}
    </div>
  );
};

/** A glowing rounded bar (for comparisons): a faint track, then the bar with the wave's glow under it. Use inside <Frame>. */
export const GlowBar: React.FC<{ x: number; y: number; width: number; frac: number; stroke: string; alpha?: number }> = ({ x, y, width, frac, stroke, alpha = 1 }) => {
  if (alpha <= 0) return null;
  const h = E.bar.height;
  const x1 = x + Math.max(0, width * frac - h);
  return (
    <g opacity={alpha}>
      <line x1={x + h / 2} y1={y} x2={x + width - h / 2} y2={y} stroke={C.text} strokeOpacity={E.bar.track} strokeWidth={h} strokeLinecap="round" />
      {frac > 0 ? (
        <>
          <line x1={x + h / 2} y1={y} x2={x1 + h / 2} y2={y} stroke={stroke} strokeOpacity={E.wave.glowOpacity} strokeWidth={h * E.bar.glow} strokeLinecap="round" />
          <line x1={x + h / 2} y1={y} x2={x1 + h / 2} y2={y} stroke={stroke} strokeWidth={h} strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
};
