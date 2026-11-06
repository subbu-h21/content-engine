/**
 * Game Show's pieces: candy sets (stripes, dots, sunburst) with an inked floor, telops that pop glyph by glyph with a
 * back-ease, cream cards and banners with hard ink shadows, bean contestants, candy balls, bursts and the judgement
 * word. Everything sits on the beat grid (motion.bpm). Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const FLOOR = style.layout.floor;
export const E = style.elements;
const P = style.palette;
const c = (role: string) => color(P, role);
export const C = {
  navy: c("background"),
  cream: c("surface"),
  white: c("text"),
  ink: c("ink"),
  grey: c("muted"),
  yellow: c("accent"),
  pink: c("accent2"),
  red: c("red"),
  orange: c("orange"),
  green: c("green"),
  lime: c("lime"),
  sky: c("sky"),
  blue: c("blue"),
  purple: c("purple"),
  teal: c("teal"),
};
export type SetName = keyof typeof style.sets;
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** One beat in seconds. */
export const BEAT = 60 / style.motion.bpm;
/** The time of beat n (0-based), plus a subdivision. */
export const beat = (n: number): number => n * BEAT;

/** Back-ease `1 + (c+1)(p−1)^3 + c(p−1)^2` with overshoot c (the source's pop). */
export const back = (p: number, k: number): number => {
  const u = clamp(p) - 1;
  return 1 + (k + 1) * u * u * u + k * u * u;
};
/** A back-eased pop for a recipe with an overshoot, `t` seconds after it starts. */
export const pop = (name: "pop" | "glyph" | "banner", t: number): number => (t <= 0 ? 0 : back(t / R[name].duration, R[name].overshoot));

/** Mix two hex colours (k = 0 → a, 1 → b), for darker feet and lighter bellies of the same hue. */
export const mix = (a: string, b: string, k: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

const ink = (w: number) => ({ stroke: C.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });

/** A set: one hue, its pattern one step lighter (stripes scrolling, dots, or a turning sunburst) and an inked floor. */
export const Set: React.FC<{ set: SetName; floor?: boolean; children: React.ReactNode }> = ({ set, floor = true, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const s = style.sets[set];
  const st = E.stripe;
  const period = 2 * st * Math.SQRT2;
  let pattern: React.ReactNode = null;
  if (s.kind === "stripes")
    pattern = (
      <div
        style={{
          position: "absolute",
          left: -period * 2,
          top: 0,
          width: W + period * 4,
          height: H,
          background: `repeating-linear-gradient(45deg, ${s.ground} 0px, ${s.ground} ${st}px, ${s.pattern} ${st}px, ${s.pattern} ${2 * st}px)`,
          transform: `translateX(${(t * style.motion.scroll) % period}px)`,
        }}
      />
    );
  else if (s.kind === "dots") {
    const d = E.dot;
    const dot = `radial-gradient(circle, rgba(255,255,255,${d.alpha}) ${d.r}px, rgba(255,255,255,0) ${d.r + 1}px)`;
    pattern = <AbsoluteFill style={{ backgroundImage: `${dot}, ${dot}`, backgroundSize: `${d.gap}px ${d.gap}px`, backgroundPosition: `0 0, ${d.gap / 2}px ${d.gap / 2}px` }} />;
  } else
    pattern = (
      <AbsoluteFill
        style={{ background: `repeating-conic-gradient(from ${t * style.motion.spin}deg at 50% 36%, ${s.pattern} 0deg ${E.ray}deg, ${s.ground} ${E.ray}deg ${2 * E.ray}deg)` }}
      />
    );
  return (
    <AbsoluteFill style={{ backgroundColor: s.ground, overflow: "hidden" }}>
      {pattern}
      {floor ? <Stage floorCol={s.floor} t={t} /> : null}
      {children}
    </AbsoluteFill>
  );
};

/**
 * The stage: the floor band from y = layout.floor with an 8 px ink line, then the stage front (the floor colour mixed
 * 35% toward ink) with a row of marquee bulbs; every `chase`-th bulb is lit, stepping once a beat.
 */
const Stage: React.FC<{ floorCol: string; t: number }> = ({ floorCol, t }) => {
  const st = E.stage;
  const front = mix(floorCol, C.ink, 0.35);
  const n = Math.floor(W / st.bulbGap) + 1;
  const off = (W - (n - 1) * st.bulbGap) / 2;
  const step = Math.floor(t / BEAT);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: FLOOR, width: W, height: H - FLOOR, backgroundColor: floorCol, borderTop: `${style.layout.floorLine}px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 0, top: st.edge, width: W, height: H - st.edge, backgroundColor: front, borderTop: `${style.layout.floorLine}px solid ${C.ink}` }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const lit = (i + step) % st.chase === 0;
          return <circle key={i} cx={off + i * st.bulbGap} cy={st.bulbY} r={st.bulb} fill={lit ? C.yellow : mix(front, C.white, 0.18)} stroke={C.ink} strokeWidth={6} />;
        })}
      </svg>
    </>
  );
};

export const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {children}
  </svg>
);

type Glyph = { ch: string; em: boolean };
const glyphLines = (lines: string[]): Glyph[][] =>
  lines.map((line) => {
    const out: Glyph[] = [];
    line.split("*").forEach((part, k) => [...part].forEach((ch) => out.push({ ch, em: k % 2 === 1 })));
    return out;
  });

/**
 * A telop: white (emphasis yellow) Fredoka with an ink stroke of `type.stroke` × size under the fill and a hard ink
 * shadow below. Glyphs pop in one by one (back-ease, rising), `glyph.stagger` apart.
 */
export const Telop: React.FC<{
  lines: string[];
  size: number;
  y: number;
  at?: number;
  align?: "center" | "left";
  x?: number;
  fill?: string;
  emFill?: string;
  rotate?: number;
}> = ({ lines, size, y, at = 0, align = "center", x = M, fill = C.white, emFill = C.yellow, rotate = 0 }) => {
  const t = useSeconds() - at;
  const g = R.glyph;
  const gl = glyphLines(lines);
  const strokeW = size * style.type.stroke;
  const box: React.CSSProperties = {
    position: "absolute",
    left: align === "center" ? 0 : x,
    right: align === "center" ? 0 : undefined,
    top: y,
    textAlign: align,
    fontFamily: DISPLAY,
    fontWeight: 700,
    fontSize: size,
    lineHeight: style.type.leading,
    whiteSpace: "pre",
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
  const copy = (kind: "shadow" | "stroke" | "fill") => {
    let i = 0;
    return (
      <div style={{ ...box, top: y + (kind === "shadow" ? style.type.shadow : 0) }}>
        {gl.map((line, li) => (
          <div key={li}>
            {line.map((gph, k) => {
              const p = pop("glyph", t - i * g.stagger);
              i += 1;
              const st: React.CSSProperties = {
                display: "inline-block",
                visibility: p > 0 ? "visible" : "hidden",
                transform: `translateY(${(1 - p) * g.rise}px)`,
                color: kind === "fill" ? (gph.em ? emFill : fill) : C.ink,
                WebkitTextStroke: kind === "fill" ? undefined : `${strokeW}px ${C.ink}`,
              };
              return (
                <span key={k} style={st}>
                  {gph.ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      {copy("shadow")}
      {copy("stroke")}
      {copy("fill")}
    </>
  );
};

/** A cream card or banner with an ink outline and a hard ink shadow; pops in with the back-ease. */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  radius?: number;
  outline?: number;
  shadow?: number;
  tilt?: number;
  from?: "pop" | "left";
  fill?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at = 0, radius = E.card.radius, outline = E.card.outline, shadow = E.shadowCard, tilt = 0, from = "pop", fill = C.cream, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = pop(from === "left" ? "banner" : "pop", t);
  const transform = from === "left" ? `translateX(${(1 - p) * -(x + w + 40)}px) rotate(${tilt}deg)` : `scale(${p}) rotate(${tilt}deg)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        backgroundColor: fill,
        border: `${outline}px solid ${C.ink}`,
        boxShadow: `0 ${shadow}px 0 ${C.ink}`,
        boxSizing: "border-box",
        transform,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </div>
  );
};

/** Plain text on cream (ink, emphasis in a hue). */
export const Ink: React.FC<{ text: string; size: number; x?: number; y: number; w?: number; align?: "center" | "left"; em?: string; col?: string; weight?: number; leading?: number }> = ({
  text,
  size,
  x = 0,
  y,
  w,
  align = "center",
  em = C.blue,
  col = C.ink,
  weight = 700,
  leading = 1.05,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w ?? "100%", textAlign: align, fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: leading, color: col }}>
    {text.split("\n").map((line, li) => (
      <div key={li}>
        {line.split("*").map((part, k) => (
          <span key={k} style={{ color: k % 2 === 1 ? em : col }}>
            {part}
          </span>
        ))}
      </div>
    ))}
  </div>
);

/** An ink pill with white or yellow capitals (round tags, name tags). */
export const Pill: React.FC<{ text: string; x: number; y: number; size?: number; at?: number; col?: string; align?: "center" | "left" }> = ({ text, x, y, size = style.type.label, at = 0, col = C.yellow, align = "left" }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = pop("pop", t);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${align === "center" ? "-50%" : "0"}) scale(${p})`,
        transformOrigin: "50% 50%",
        padding: `${size * 0.28}px ${size * 0.7}px`,
        borderRadius: 999,
        backgroundColor: C.ink,
        color: col,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "nowrap",
        letterSpacing: 1,
      }}
    >
      {text}
    </div>
  );
};

export type BeanKind = "red" | "green" | "blue" | "sun" | "air";
const BEAN: Record<BeanKind, { body: () => string; mark: "long" | "mid" | "short" | "crown" | "bubble" }> = {
  red: { body: () => C.red, mark: "long" },
  green: { body: () => C.green, mark: "mid" },
  blue: { body: () => C.blue, mark: "short" },
  sun: { body: () => C.yellow, mark: "crown" },
  air: { body: () => C.sky, mark: "bubble" },
};

/** A wave drawn as an antenna: wavelength `lam`, amplitude `amp`, from x0 to x1 at y. */
const wave = (x0: number, x1: number, y: number, lam: number, amp: number): string => {
  const pts: string[] = [];
  for (let x = x0; x <= x1 + 0.01; x += 2) pts.push(`${x.toFixed(1)} ${(y - amp * Math.sin(((x - x0) / lam) * Math.PI * 2)).toFixed(1)}`);
  return `M ${pts.join(" L ")}`;
};

/**
 * A bean contestant (160 × 172 at scale 1): rounded body, belly patch, oval eyes with a catch-light, blush, stubby arms
 * with white mittens, feet, one head mark (red = a long lazy wave, green = a medium wave, blue = a short choppy wave,
 * sun = a crown of rays, air = a bubble) and an ink name tag under the feet. Feet at (x, y). Hops once a beat.
 */
export const Bean: React.FC<{ kind: BeanKind; x: number; y: number; s?: number; hop?: number; phase?: number; pose?: "idle" | "shout"; tag?: string; at?: number }> = ({
  kind,
  x,
  y,
  s = 1,
  hop = E.hop[0],
  phase = 0,
  pose = "idle",
  tag,
  at = 0,
}) => {
  const t = useSeconds();
  if (t < at) return null;
  const b = BEAN[kind];
  const body = b.body();
  const dark = mix(body, C.ink, 0.25);
  const belly = mix(body, C.white, 0.45);
  // drop in from the sky on the first beat, then hop once a beat
  const dropT = t - at;
  const dr = R.drop;
  const fall = dropT < dr.duration ? (1 - ease("drop", dropT)) * dr.distance : 0;
  const f = (((t - at - dr.duration) / BEAT + phase) % 1 + 1) % 1;
  const lift = dropT < dr.duration ? 0 : hop * 4 * f * (1 - f);
  const sq = R.squash;
  const squash = dropT < dr.duration ? 1 : 1 - sq.depth * Math.exp(-f * sq.decay) * (f < 0.5 ? 1 : 0);
  const shout = pose === "shout";
  const arm = (side: number) => {
    const sx = side * 64;
    const hx = side * (shout ? 100 : 94);
    const hy = shout ? -184 : -56;
    return (
      <g key={side}>
        <line x1={sx} y1={-104} x2={hx} y2={hy} stroke={C.ink} strokeWidth={34} strokeLinecap="round" />
        <line x1={sx} y1={-104} x2={hx} y2={hy} stroke={body} strokeWidth={18} strokeLinecap="round" />
        <circle cx={hx} cy={hy} r={18} fill={C.white} {...ink(E.outlineSmall)} />
      </g>
    );
  };
  const mark = () => {
    const top = -182;
    if (b.mark === "crown")
      return (
        <g>
          {[-2, -1, 0, 1, 2].map((k) => {
            const a = (k * 22 * Math.PI) / 180;
            const bx = Math.sin(a) * 70;
            const by = -96 - Math.cos(a) * 80;
            const tx = Math.sin(a) * 118;
            const ty = -96 - Math.cos(a) * 128;
            const nx = Math.cos(a) * 14;
            const ny = Math.sin(a) * 14;
            return <polygon key={k} points={`${bx - nx},${by - ny} ${tx},${ty} ${bx + nx},${by + ny}`} fill={C.orange} {...ink(E.outlineSmall)} />;
          })}
        </g>
      );
    if (b.mark === "bubble")
      return (
        <g>
          <line x1={0} y1={top + 4} x2={0} y2={top - 30} {...ink(6)} />
          <circle cx={0} cy={top - 48} r={20} fill={C.white} {...ink(E.outlineSmall)} />
          <circle cx={-6} cy={top - 54} r={5} fill={C.sky} />
        </g>
      );
    const w = b.mark === "long" ? { lam: 96, amp: 12 } : b.mark === "mid" ? { lam: 48, amp: 11 } : { lam: 22, amp: 10 };
    const d = wave(-48, 48, top - 40, w.lam, w.amp);
    return (
      <g>
        <line x1={0} y1={top + 4} x2={0} y2={top - 28} {...ink(6)} />
        <path d={d} fill="none" stroke={C.ink} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={body} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  const tagSize = style.type.tag;
  const tagW = tag ? tag.length * tagSize * 0.62 + tagSize * 1.4 : 0;
  return (
    <g transform={`translate(${x} ${y - lift - fall}) scale(${s})`}>
      <g transform={`scale(${1 / squash} ${squash})`}>
        <ellipse cx={-36} cy={-10} rx={32} ry={17} fill={dark} {...ink(7)} />
        <ellipse cx={36} cy={-10} rx={32} ry={17} fill={dark} {...ink(7)} />
        {mark()}
        {shout ? null : [arm(-1), arm(1)]}
        <ellipse cx={0} cy={-100} rx={80} ry={86} fill={body} {...ink(E.outline)} />
        <ellipse cx={0} cy={-66} rx={48} ry={40} fill={belly} />
        {shout ? [arm(-1), arm(1)] : null}
        <ellipse cx={-26} cy={-126} rx={10} ry={15} fill={C.ink} />
        <ellipse cx={26} cy={-126} rx={10} ry={15} fill={C.ink} />
        <circle cx={-23} cy={-132} r={4.5} fill={C.white} />
        <circle cx={29} cy={-132} r={4.5} fill={C.white} />
        <ellipse cx={-50} cy={-100} rx={12} ry={7} fill={C.pink} />
        <ellipse cx={50} cy={-100} rx={12} ry={7} fill={C.pink} />
        {shout ? (
          <path d="M -18 -106 Q 0 -70 18 -106 Z" fill={C.red} {...ink(6)} />
        ) : (
          <path d="M -15 -104 Q 0 -90 15 -104" fill="none" {...ink(6)} />
        )}
      </g>
      {tag ? (
        <g transform={`translate(0 ${lift + fall})`}>
          <rect x={-tagW / 2} y={16} width={tagW} height={tagSize * 1.45} rx={(tagSize * 1.45) / 2} fill={C.ink} />
          <text x={0} y={16 + tagSize * 1.06} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={tagSize} fill={C.white} letterSpacing={1}>
            {tag}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** A candy ball: flat colour, ink outline, a white catch-light. */
export const Ball: React.FC<{ x: number; y: number; col: string; d?: number; squash?: number }> = ({ x, y, col, d = E.ball, squash = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${1 / squash} ${squash})`}>
    <circle cx={0} cy={-d / 2} r={d / 2} fill={col} {...ink(7)} />
    <ellipse cx={-d * 0.16} cy={-d * 0.68} rx={d * 0.12} ry={d * 0.08} fill={C.white} />
  </g>
);

/** A burst `age` seconds old: an 8-point star, an expanding white ring and 8 ink speed lines (0.3 s). */
export const Burst: React.FC<{ x: number; y: number; age: number; size?: number }> = ({ x, y, age, size = 1 }) => {
  const life = R.burst.duration;
  if (age < 0 || age > life * 1.6) return null;
  const p = ease("burst", age);
  const b = E.burst;
  const n = b.points;
  const ro = (70 + 50 * p) * size;
  const ri = ro * 0.52;
  const star = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const r = i % 2 === 0 ? ro : ri;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  const ring = (b.ring[0] + (b.ring[1] - b.ring[0]) * p) * size;
  return (
    <g>
      {age <= life ? <circle cx={x} cy={y} r={ring} fill="none" stroke={C.white} strokeWidth={10 * size} /> : null}
      {Array.from({ length: b.lines }, (_, i) => {
        const a = (i / b.lines) * Math.PI * 2 + Math.PI / b.lines;
        const r0 = (110 + 70 * p) * size;
        const r1 = r0 + 50 * size;
        return <line key={i} x1={x + r0 * Math.cos(a)} y1={y + r0 * Math.sin(a)} x2={x + r1 * Math.cos(a)} y2={y + r1 * Math.sin(a)} {...ink(9 * size)} />;
      })}
      <polygon points={star} fill={C.yellow} {...ink(7 * size)} />
    </g>
  );
};

/** The judgement word ("Perfect!"): yellow or pink telop at −6°, popped in on its beat. */
export const Judgement: React.FC<{ text: string; y: number; at: number; fill?: string }> = ({ text, y, at, fill = C.yellow }) => (
  <Telop lines={[text]} size={style.type.judgement} y={y} at={at} rotate={-6} fill={fill} />
);
