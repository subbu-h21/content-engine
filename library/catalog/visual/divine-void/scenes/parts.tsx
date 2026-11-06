/**
 * Divine Void's pieces: the void (or a bright bone frame) with a slow weightless push, one gold light shaft, the ember
 * bloom, rising dust, a halo, clouds, crystalline bokeh for bright frames, the divine flash, and Roman-capital
 * captions with one or two gold words. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  void: color(P, "background"),
  bone: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  gold: color(P, "accent"),
  ember: color(P, "accent2"),
  core: color(P, "bloomCore"),
  violet: color(P, "violet"),
  cyan: color(P, "cyan"),
  magenta: color(P, "magenta"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** Seeded random numbers. */
export const rand = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Bright or dark frame (bright frames are bone white with crystalline bokeh, no grain). */
const Bright = React.createContext(false);
export const useBright = () => React.useContext(Bright);

/** The void (or a bright frame); the world inside pushes in slowly and floats, weightless. */
export const Ground: React.FC<{ children: React.ReactNode; bright?: boolean; fadeAt?: number }> = ({ children, bright = false, fadeAt }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const d = ease("drift", t);
  const s = 1 + S.motion.push * d;
  const y = -S.motion.recipes.drift.distance * d;
  const fin = bright ? style.finish.brightFrames : style.finish;
  const fade = fadeAt === undefined ? 0 : ease("fadeBlack", t - fadeAt);
  return (
    <Bright.Provider value={bright}>
      <AbsoluteFill style={{ backgroundColor: bright ? C.bone : C.void, overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `translateY(${y}px) scale(${s})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>
        <Finish grain={fin.grain} vignette={fin.vignette} width={W} height={H} />
        {fade > 0 ? <AbsoluteFill style={{ backgroundColor: C.void, opacity: fade }} /> : null}
      </AbsoluteFill>
    </Bright.Provider>
  );
};

/** World layer: everything that drifts with the camera but sits behind the type. */
export const Layer: React.FC<{ children: React.ReactNode; blend?: "screen" | "normal" }> = ({ children, blend = "normal" }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: blend, overflow: "visible" }}>
    {children}
  </svg>
);

/** One gold light shaft from a source above the frame down to a point: a soft, blurred wedge. */
export const Shaft: React.FC<{ from: [number, number]; to: [number, number]; at?: number; width?: [number, number]; opacity?: number; id: string }> = ({ from, to, at = 0, width = E.shaft.width as [number, number], opacity = E.shaft.opacity, id }) => {
  const p = ease("shaft", useSeconds() - at);
  if (p <= 0) return null;
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  const [w0, w1] = [width[0] / 2, (width[1] / 2) * lerp(0.7, 1, p)];
  const pts = [
    [from[0] + nx * w0, from[1] + ny * w0],
    [to[0] + nx * w1, to[1] + ny * w1],
    [to[0] - nx * w1, to[1] - ny * w1],
    [from[0] - nx * w0, from[1] - ny * w0],
  ]
    .map((q) => q.map((v) => v.toFixed(1)).join(","))
    .join(" ");
  return (
    <Layer blend="screen">
      <defs>
        <linearGradient id={`${id}-g`} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.core} stopOpacity={0.95} />
          <stop offset="0.35" stopColor={C.gold} stopOpacity={0.75} />
          <stop offset="1" stopColor={C.ember} stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={E.shaft.blur} />
        </filter>
      </defs>
      <polygon points={pts} fill={`url(#${id}-g)`} opacity={opacity * p} filter={`url(#${id}-b)`} />
    </Layer>
  );
};

/** The ember bloom: a radial white → gold → ember glow, growing. */
export const Bloom: React.FC<{ x: number; y: number; r?: number; at?: number; k?: number }> = ({ x, y, r = E.bloom.radius, at = 0, k = 1 }) => {
  const p = ease("bloom", useSeconds() - at);
  if (p <= 0) return null;
  const rr = r * lerp(0.4, 1, p);
  return (
    <div
      style={{
        position: "absolute",
        left: x - rr,
        top: y - rr,
        width: rr * 2,
        height: rr * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle closest-side, ${rgba(C.core, 0.95 * k)} 0%, ${rgba(C.gold, 0.75 * k)} 14%, ${rgba(C.gold, 0.28 * k)} 36%, ${rgba(C.ember, 0.1 * k)} 60%, ${rgba(C.ember, 0)} 100%)`,
        mixBlendMode: "screen",
        opacity: E.bloom.opacity * p,
      }}
    />
  );
};

/** A small hot core (the sun, the hero point). */
export const Core: React.FC<{ x: number; y: number; r: number; at?: number }> = ({ x, y, r, at = 0 }) => {
  const p = ease("veil", useSeconds() - at);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: C.core, boxShadow: `0 0 ${r}px ${rgba(C.gold, 0.9)}, 0 0 ${r * 3}px ${rgba(C.gold, 0.5)}`, opacity: p }} />;
};

/** Dust, embers and glitter rising (upward = ascension) inside a region. */
export const Dust: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; count?: number; at?: number; c?: string }> = ({ x, y, w, h, seed = 3, count = E.dust.count, at = 0, c }) => {
  const t = useSeconds() - at;
  const k = ease("rise", t);
  const r = rand(seed);
  const d = E.dust;
  return (
    <Layer blend="screen">
      {Array.from({ length: count }, (_, i) => {
        const px = x + r() * w;
        const py = y + r() * h;
        const rise = lerp(d.rise[0], d.rise[1], r());
        const size = lerp(d.size[0], d.size[1], r());
        const o = 0.3 + r() * 0.7;
        const hot = r() > 0.7;
        const col = c ?? (hot ? C.gold : C.bone);
        const tw = 0.6 + 0.4 * Math.sin(t * (1.5 + r() * 2) + i);
        return (
          <g key={i} opacity={o * tw * clamp(t / 0.8)}>
            <circle cx={px} cy={py - rise * k} r={size * 2.6} fill={col} opacity={0.18} />
            <circle cx={px} cy={py - rise * k} r={size / 2} fill={col} />
          </g>
        );
      })}
    </Layer>
  );
};

/** A thin gold halo ring with a glow. */
export const Halo: React.FC<{ x: number; y: number; rx: number; ry: number; at?: number }> = ({ x, y, rx, ry, at = 0 }) => {
  const p = ease("veil", useSeconds() - at);
  if (p <= 0) return null;
  const h = E.halo;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: `drop-shadow(0 0 ${h.glow}px ${rgba(C.gold, 0.8)})`, mixBlendMode: "screen" }}>
      <ellipse cx={x} cy={y} rx={rx * lerp(0.92, 1, p)} ry={ry * lerp(0.92, 1, p)} fill="none" stroke={C.gold} strokeWidth={h.width} opacity={h.opacity * p} />
    </svg>
  );
};

/** Clouds: soft blurred bone blobs, lit gold from one side. */
export const Clouds: React.FC<{ y: number; h: number; seed?: number; at?: number; lit?: number }> = ({ y, h, seed = 9, at = 0, lit = 1 }) => {
  const t = useSeconds() - at;
  const p = ease("bloom", t);
  const r = rand(seed);
  const c = E.clouds;
  return (
    <div style={{ position: "absolute", left: -200, top: y, width: W + 400, height: h, filter: `blur(${c.blur}px)`, opacity: p }}>
      {Array.from({ length: c.count }, (_, i) => {
        const cw = 260 + r() * 420;
        const ch = cw * (0.35 + r() * 0.25);
        const cx = r() * (W + 400);
        const cy = r() * h * 0.8;
        const o = lerp(c.opacity[0], c.opacity[1], r());
        const warm = r() < 0.35 * lit;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - cw / 2 + Math.sin(t * 0.2 + i) * 14,
              top: cy - ch / 2,
              width: cw,
              height: ch,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 50% 35%, ${rgba(warm ? C.gold : C.bone, o * 1.6)} 0%, ${rgba(C.bone, o)} 45%, ${rgba(C.bone, 0)} 100%)`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Crystalline bokeh for bright frames: soft discs in one iridescent colour, spread evenly around a centre. */
export const Bokeh: React.FC<{ cx: number; cy: number; spread: number; c: string; seed?: number; at?: number; avoid?: [number, number, number, number][] }> = ({ cx, cy, spread, c, seed = 5, at = 0, avoid = [] }) => {
  const t = useSeconds() - at;
  const r = rand(seed);
  const b = E.bokeh;
  return (
    <>
      {Array.from({ length: b.count }, (_, i) => {
        const a = ((i + r() * 0.8) / b.count) * Math.PI * 2;
        const dist = 150 + r() * spread;
        const size = lerp(b.size[0], b.size[1], r());
        const blur = lerp(b.blur[0], b.blur[1], r());
        const o = lerp(b.opacity[0], b.opacity[1], r());
        const p = ease("veil", t - 0.1 - i * 0.04);
        const d = dist * lerp(0.35, 1, p);
        const [bx, by] = [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
        if (avoid.some(([x0, y0, x1, y1]) => bx + size / 2 > x0 && bx - size / 2 < x1 && by + size / 2 > y0 && by - size / 2 < y1)) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * d - size / 2,
              top: cy + Math.sin(a) * d - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(c, o)} 0%, ${rgba(c, o * 0.75)} 55%, ${rgba(c, o * 0.2)} 100%)`,
              boxShadow: `inset 0 0 ${size * 0.12}px ${rgba("#ffffff", 0.5)}`,
              filter: `blur(${blur}px)`,
              opacity: p,
            }}
          />
        );
      })}
    </>
  );
};

/** The divine flash: a full-frame radial white → gold, screen blend, opacity 0 → 1 → 0 at frames 0 / 3 / 12. */
export const Flash: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const f = useCurrentFrame() - atFrame;
  const { fps } = useVideoConfig();
  const [a, b, c] = E.flash.frames.map((x) => (x * fps) / E.flash.fps);
  const o = f < a || f > c ? 0 : f <= b ? (f - a) / (b - a) : 1 - (f - b) / (c - b);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${C.core} 0%, ${C.gold} 60%, ${rgba(C.gold, 0.6)} 100%)`, mixBlendMode: "screen", opacity: o }} />;
};

/**
 * A caption: Cinzel caps, centred, tracked 0.08 em; *emphasis* words in gold (dark frames). Words come out of a veil:
 * blur 14 px → 0, rising 16 px, 0.14 s apart. A faint chromatic split on dark frames.
 */
export const Caption: React.FC<{ lines: string[]; size: number; y: number; at?: number; color?: string; em?: string; weight?: number }> = ({ lines, size, y, at = 0, color: col, em, weight = 500 }) => {
  const bright = useBright();
  const t = useSeconds() - at;
  const base = col ?? (bright ? C.void : C.bone);
  const emc = em ?? (bright ? C.void : C.gold);
  const ab = E.aberration;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: `${size * T.leading}px`, letterSpacing: `${T.tracking}em`, textTransform: "uppercase" }}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {words(line).map((w, wi) => {
            const p = ease("veil", t - i * S.motion.stagger);
            i += 1;
            const c = w.em ? emc : base;
            const shadow = bright
              ? "none"
              : [`${-ab.offset}px 0 ${rgba("#ff4040", ab.opacity * p)}`, `${ab.offset}px 0 ${rgba("#40c8ff", ab.opacity * p)}`, `0 0 ${size * 0.4}px ${rgba(w.em ? C.gold : C.bone, E.captionGlow * p)}`].join(", ");
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", color: c, opacity: clamp(p * 1.2), filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined, transform: `translateY(${(1 - p) * S.motion.recipes.veil.distance}px)`, textShadow: shadow }}>
                  {w.text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small caption: Jost light, caps, widely tracked. */
export const Small: React.FC<{ text: string; y: number; at?: number; width?: number; color?: string }> = ({ text, y, at = 0, width = COLUMN, color: col }) => {
  const bright = useBright();
  const p = ease("veil", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: (W - width) / 2,
        width,
        top: y,
        textAlign: "center",
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: T.small,
        lineHeight: 1.6,
        letterSpacing: `${T.smallTracking}em`,
        textTransform: "uppercase",
        color: col ?? (bright ? C.void : C.muted),
        textWrap: "balance",
        opacity: p * (bright ? 0.75 : 1),
        filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
};

export { BODY, DISPLAY };
