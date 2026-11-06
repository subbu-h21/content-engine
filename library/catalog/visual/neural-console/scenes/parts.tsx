/**
 * Neural Console's pieces: the rounded, feathered console field (grid, depth orbs, dust, scanlines, chroma tint, scan
 * beam), the header with its octagon mark, the glowing ring hub, scrolling mono logs, the glass status card with
 * meters and cells, network paths and nodes, and glowing headlines. Every value comes from style.json.
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
export const L = style.layout;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  surface: color(P, "surface"),
  text: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  core: color(P, "accent"),
  coreHot: color(P, "accentHot"),
  second: color(P, "accent2"),
  secondHot: color(P, "accent2Hot"),
  orb: color(P, "orb"),
};
const roleHex = (role: string) => color(P, role);
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** Seeded random numbers (deterministic per seed). */
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

/** The stacked glow (2 / 10 / 35 / 90 px) as a CSS filter. */
export const glow = (hex: string, k = 1): string =>
  E.glow.map((b, i) => `drop-shadow(0 0 ${b}px ${rgba(hex, [0.9, 0.5, 0.28, 0.16][i] * k)})`).join(" ");
export const textGlow = (hex: string, k = 1): string => `0 0 ${T.metricGlow / 3}px ${rgba(hex, 0.7 * k)}, 0 0 ${T.metricGlow}px ${rgba(hex, 0.45 * k)}`;

const F = L.field;
export const FIELD = { x: F.side, y: F.top, w: W - 2 * F.side, h: H - F.top - F.bottom };

/** Dust motes rising inside the field. */
const Dust: React.FC = () => {
  const t = useSeconds();
  const d = E.dust;
  const r = rand(7);
  const k = ease("dust", t);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: d.count }, (_, i) => {
        const x = FIELD.x + 40 + r() * (FIELD.w - 80);
        const y = FIELD.y + 120 + r() * (FIELD.h - 240);
        const rise = lerp(d.rise[0], d.rise[1], r());
        const size = lerp(d.min, d.max, r()) / 2;
        const o = 0.35 + r() * 0.5;
        return <circle key={i} cx={x} cy={y - rise * k} r={size} fill={C.coreHot} opacity={o * clamp(t / 0.6)} />;
      })}
    </svg>
  );
};

/** The console ground: void, the rounded field with grid, orbs and dust, scanlines, chroma tint, scan beam, vignette. */
export const Ground: React.FC<{ children: React.ReactNode; scan?: boolean }> = ({ children, scan = true }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const p = ease("field", t);
  const g = E.grid;
  const feather = "radial-gradient(ellipse 70% 62% at 50% 48%, black 55%, transparent 100%)";
  const orbK = ease("orbs", t);
  const beamY = FIELD.y + ease("scan", t - 0.4) * FIELD.h;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div
        style={{
          position: "absolute",
          left: FIELD.x,
          top: FIELD.y,
          width: FIELD.w,
          height: FIELD.h,
          borderRadius: F.radius,
          overflow: "hidden",
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.surface} 0%, ${C.bg} 100%)`,
          boxShadow: `inset 0 0 0 1px ${rgba(C.core, 0.16)}`,
          opacity: clamp(p * 1.2),
          transform: `scale(${lerp(1.025, 1, p)})`,
        }}
      >
        {E.orbs.map((o, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: o.x * FIELD.w - o.r + Math.sin(i * 2.1) * S.motion.recipes.orbs.distance * orbK,
              top: o.y * FIELD.h - o.r + Math.cos(i * 1.7) * S.motion.recipes.orbs.distance * orbK,
              width: o.r * 2,
              height: o.r * 2,
              borderRadius: "50%",
              background: roleHex(o.role),
              opacity: o.opacity,
              filter: `blur(${o.blur}px)`,
              transform: `scale(${lerp(1, 1.09, orbK)})`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: g.opacity,
            backgroundImage: `repeating-linear-gradient(0deg, ${C.faint} 0 1px, transparent 1px ${g.size}px), repeating-linear-gradient(90deg, ${C.faint} 0 1px, transparent 1px ${g.size}px)`,
            backgroundPosition: `${(FIELD.w / 2) % g.size}px ${(FIELD.h / 2) % g.size}px`,
            maskImage: feather,
            WebkitMaskImage: feather,
          }}
        />
      </div>
      <Dust />
      {children}
      {scan ? (
        <div
          style={{
            position: "absolute",
            left: FIELD.x,
            width: FIELD.w,
            top: beamY - E.scanBeam.height / 2,
            height: E.scanBeam.height,
            background: `linear-gradient(180deg, ${rgba(C.core, 0)} 0%, ${rgba(C.core, E.scanBeam.opacity * 0.5)} 60%, ${rgba(C.core, E.scanBeam.opacity)} 85%, ${rgba(C.core, 0)} 100%)`,
            mixBlendMode: "screen",
            opacity: clamp((t - 0.4) / 0.5),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: FIELD.x,
          top: FIELD.y,
          width: FIELD.w,
          height: FIELD.h,
          borderRadius: F.radius,
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,${E.scanlines.opacity}) 0 2px, transparent 2px ${E.scanlines.period}px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
          background: `radial-gradient(ellipse 60% 45% at 15% 12%, ${rgba(C.core, E.chroma)} 0%, transparent 100%), radial-gradient(ellipse 60% 45% at 88% 90%, ${rgba(C.second, E.chroma)} 0%, transparent 100%)`,
        }}
      />
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The octagon outline used for the brand mark and the node "satellites". */
export const octagon = (cx: number, cy: number, r: number): string =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8 + Math.PI / 8;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

/** Header: octagon mark, brand title in caps, a mono label on the right, a hairline under it. */
export const Header: React.FC<{ title: string; right?: string; at?: number }> = ({ title, right, at = 0.16 }) => {
  const t = useSeconds() - at;
  const p = ease("header", t);
  const m = ease("mark", t);
  const y = L.headerY;
  if (p <= 0) return null;
  return (
    <>
      <svg width={64} height={64} style={{ position: "absolute", left: M - 6, top: y - 32, opacity: clamp(m * 2), transform: `scale(${lerp(0.35, 1, m)}) rotate(${lerp(-12, 0, m)}deg)`, filter: glow(C.core, 0.7) }}>
        <polygon points={octagon(32, 32, 24)} fill="none" stroke={C.core} strokeWidth={2.5} />
        <circle cx={32} cy={32} r={6} fill={C.coreHot} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: M + 76,
          top: y - T.brand * 0.6,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: T.brand,
          lineHeight: 1.2,
          letterSpacing: `${T.brandTracking}em`,
          textTransform: "uppercase",
          color: C.text,
          opacity: p,
          transform: `translateY(${-(1 - p) * S.motion.recipes.header.distance}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      {right ? (
        <div style={{ position: "absolute", right: M, top: y - T.label * 0.55, ...labelStyle(C.muted, T.mutedOpacity), opacity: p * T.mutedOpacity, transform: `translateY(${-(1 - p) * S.motion.recipes.header.distance}px)` }}>{right}</div>
      ) : null}
      <div style={{ position: "absolute", left: M, top: y + 48, width: (W - 2 * M) * ease("path", t), height: 1, background: rgba(C.core, 0.28) }} />
    </>
  );
};

export const labelStyle = (hex: string, opacity = 1): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 600,
  fontSize: T.label,
  lineHeight: 1.1,
  letterSpacing: `${T.labelTracking}em`,
  textTransform: "uppercase",
  color: hex,
  opacity,
  whiteSpace: "nowrap",
});

/** A mono caps label. */
export const Label: React.FC<{ text: string; x: number; y: number; at?: number; hex?: string; align?: "left" | "center" | "right"; opacity?: number }> = ({ text, x, y, at = 0, hex = C.core, align = "left", opacity = 0.9 }) => {
  const p = ease("copy", useSeconds() - at);
  if (p <= 0) return null;
  const pos: React.CSSProperties = align === "left" ? { left: x } : align === "right" ? { right: W - x } : { left: x - 400, width: 800, textAlign: "center" };
  return <div style={{ position: "absolute", top: y - T.label * 0.55, ...pos, ...labelStyle(hex, opacity * p), transform: `translateY(${(1 - p) * 10}px)` }}>{text}</div>;
};

/** Glowing headline: Arimo 700, tight; *emphasis* in core cyan with glow. Words rise 24 px with blur, 0.09 s apart. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; x?: number; align?: "left" | "center" }> = ({ lines, size, y, at = 0, x = M, align = "left" }) => {
  const t = useSeconds() - at;
  const { distance } = S.motion.recipes.copy;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        letterSpacing: `${T.tracking}em`,
        color: C.text,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("copy", t - i * S.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    opacity: clamp(p),
                    transform: `translateY(${(1 - p) * distance}px)`,
                    filter: `blur(${(1 - clamp(p)) * 6}px)`,
                    color: w.em ? C.core : C.text,
                    textShadow: w.em ? textGlow(C.core) : `0 0 18px ${rgba(C.core, 0.18)}`,
                  }}
                >
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

/** Body copy: paper at 72% so it reads (labels and logs are the 48% muted). */
export const Body: React.FC<{ text: string; x?: number; y: number; at?: number; width?: number; align?: "left" | "center" }> = ({ text, x = M, y, at = 0, width = COLUMN, align = "left" }) => {
  const p = ease("copy", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : x,
        top: y,
        width,
        textAlign: align,
        fontFamily: BODY,
        fontSize: T.body,
        lineHeight: 1.35,
        color: C.text,
        opacity: 0.72 * p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** The ring hub: dashed outer ring, glowing 8 px arc, magenta second ring, thin inner ring; children at its core. */
export const Hub: React.FC<{ cx: number; cy: number; r: number; at?: number; pulseAt?: number; children?: React.ReactNode }> = ({ cx, cy, r, at = 0, pulseAt, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const rg = E.rings;
  const dIn = S.motion.recipes.hubIn.duration;
  const s = t < dIn ? lerp(rg.fromScale, rg.overshoot, ease("hubIn", t)) : lerp(rg.overshoot, 1, ease("hubSettle", t - dIn));
  const blur = t < dIn ? (1 - ease("hubIn", t)) * rg.fromBlur : 0;
  const pulse = pulseAt === undefined ? 0 : Math.sin(Math.PI * clamp((t + at - pulseAt) / (2 * S.motion.recipes.pulse.duration)));
  const turn = rg.turn * ease("rings", t);
  const size = r * 2 + 80;
  const c = size / 2;
  const rArc = r * 0.87;
  const rSec = r * 0.76;
  const rIn = r * 0.61;
  return (
    <>
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          left: cx - c,
          top: cy - c,
          opacity: clamp(t / 0.25),
          transform: `scale(${s * (1 + 0.04 * pulse)})`,
          filter: `blur(${blur}px) ${glow(C.core, 0.9 + pulse)}`,
          overflow: "visible",
        }}
      >
        <circle cx={c} cy={c} r={r} fill="none" stroke={C.core} strokeOpacity={rg.dashed.opacity} strokeWidth={rg.dashed.width} strokeDasharray={rg.dashed.dash.join(" ")} transform={`rotate(${turn * 0.5} ${c} ${c})`} />
        <circle cx={c} cy={c} r={rArc} fill="none" stroke={C.faint} strokeOpacity={0.35} strokeWidth={rg.arc.width} />
        <circle cx={c} cy={c} r={rArc} fill="none" stroke={C.core} strokeWidth={rg.arc.width} strokeLinecap="round" strokeDasharray={rg.arc.dash.join(" ")} transform={`rotate(${-120 + turn} ${c} ${c})`} />
        <circle cx={c} cy={c} r={rSec} fill="none" stroke={C.second} strokeOpacity={rg.second.opacity} strokeWidth={rg.second.width} strokeDasharray={rg.second.dash.join(" ")} transform={`rotate(${40 - turn * 0.7} ${c} ${c})`} />
        <circle cx={c} cy={c} r={rIn} fill="none" stroke={C.core} strokeOpacity={rg.inner.opacity} strokeWidth={rg.inner.width} />
        {[0, 90, 180, 270].map((a) => {
          const rad = ((a + turn * 0.5) * Math.PI) / 180;
          return <circle key={a} cx={c + r * Math.cos(rad)} cy={c + r * Math.sin(rad)} r={5} fill={C.coreHot} />;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - rIn,
          top: cy - rIn,
          width: rIn * 2,
          height: rIn * 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: clamp((t - 0.2) / 0.4),
          transform: `scale(${1 + 0.05 * pulse})`,
        }}
      >
        {children}
      </div>
    </>
  );
};

/** The hub's core label: Arimo 700, core hot, glowing. */
export const CoreLabel: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = T.core }) => (
  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.02, letterSpacing: `${T.tracking}em`, color: C.coreHot, textShadow: textGlow(C.core), textAlign: "center", whiteSpace: "nowrap" }}>
    {children}
  </div>
);

/** Scrolling mono logs in the right column, faded top and bottom. Lines: [prompt text, value, magenta?]. */
export const Logs: React.FC<{ lines: [string, string, boolean?][]; y: number; h: number; at?: number }> = ({ lines, y, h, at = 0 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const lg = L.logs;
  const x = W - lg.right - lg.width;
  const off = ease("logs", t) * S.motion.recipes.logs.distance;
  const fade = "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)";
  const rows = Array.from({ length: Math.ceil((h + S.motion.recipes.logs.distance) / T.logLine) + 2 }, (_, i) => lines[i % lines.length]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: lg.width, height: h, overflow: "hidden", maskImage: fade, WebkitMaskImage: fade, opacity: clamp(t / 0.6) }}>
      <div style={{ transform: `translateY(${-off}px)` }}>
        {rows.map(([a, b, hot], i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: T.log, lineHeight: `${T.logLine}px`, whiteSpace: "nowrap", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.muted, opacity: T.mutedOpacity }}>
              <span style={{ color: C.core }}>›</span> {a}
            </span>
            <span style={{ color: hot ? C.second : C.coreHot, opacity: 0.85 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** The glass status card (bottom of the field): rises 58 px from scale 0.96. */
export const Card: React.FC<{ y: number; h: number; at?: number; x?: number; w?: number; children?: React.ReactNode; active?: boolean }> = ({ y, h, at = 0, x = L.card.x, w = L.card.width, children, active = false }) => {
  const p = ease("card", useSeconds() - at);
  if (p <= 0) return null;
  const k = E.card;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        padding: "30px 40px",
        borderRadius: L.card.radius,
        background: rgba(C.surface, k.fill),
        border: `1px solid ${rgba(C.core, active ? 0.6 : k.border)}`,
        boxShadow: `inset 0 1px 0 ${rgba(C.coreHot, 0.12)}, 0 24px 60px rgba(0,0,0,0.5)${active ? `, 0 0 40px ${rgba(C.core, 0.25)}` : ""}`,
        backdropFilter: `blur(${k.blur}px)`,
        opacity: clamp(p * 1.3),
        transform: `translateY(${(1 - p) * S.motion.recipes.card.distance}px) scale(${lerp(0.96, 1, p)})`,
      }}
    >
      {children}
    </div>
  );
};

/** An 8 px meter: core-deep → core (or → magenta), filling with power4.out. */
export const Meter: React.FC<{ frac: number; at: number; width: number; hex?: string }> = ({ frac, at, width, hex = C.core }) => {
  const p = ease("meter", useSeconds() - at);
  const m = E.meter;
  return (
    <div style={{ position: "relative", width, height: m.height, borderRadius: m.radius, background: rgba(C.core, m.track) }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: m.height,
          width: width * frac * Math.max(0, p),
          borderRadius: m.radius,
          background: `linear-gradient(90deg, ${C.faint} 0%, ${hex} 100%)`,
          boxShadow: `0 0 12px ${rgba(hex, 0.7)}, 0 0 30px ${rgba(hex, 0.35)}`,
        }}
      />
    </div>
  );
};

/** A row of cells popping on one after another (back.out 1.4, 0.08 s apart). */
export const Cells: React.FC<{ n: number; at: number; lit?: number; hex?: string }> = ({ n, at, lit = n, hex = C.core }) => {
  const t = useSeconds() - at;
  const c = E.cell;
  return (
    <div style={{ display: "flex", gap: c.gap }}>
      {Array.from({ length: n }, (_, i) => {
        const p = ease("cell", t - i * S.motion.cellStagger);
        const on = i < lit;
        return (
          <div
            key={i}
            style={{
              width: c.size,
              height: c.size,
              borderRadius: 3,
              background: on ? hex : "transparent",
              border: `1.5px solid ${rgba(hex, on ? 1 : 0.4)}`,
              boxShadow: on ? `0 0 10px ${rgba(hex, 0.6)}` : "none",
              opacity: clamp(p),
              transform: `scale(${Math.max(0, p)})`,
            }}
          />
        );
      })}
    </div>
  );
};

/** A dashed network path that draws from a to b (dash 8/12 flowing), with a glow. */
export const Path: React.FC<{ a: [number, number]; b: [number, number]; at: number; hex?: string; solid?: boolean; width?: number }> = ({ a, b, at, hex = C.core, solid = false, width }) => {
  const t = useSeconds() - at;
  const p = ease("path", t);
  if (p <= 0) return null;
  const pa = E.paths;
  const x2 = lerp(a[0], b[0], p);
  const y2 = lerp(a[1], b[1], p);
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={x2}
      y2={y2}
      stroke={hex}
      strokeWidth={width ?? (solid ? 3 : pa.width * 1.6)}
      strokeOpacity={solid ? 0.9 : Math.min(1, pa.opacity * 2)}
      strokeDasharray={solid ? undefined : pa.dash.join(" ")}
      strokeDashoffset={solid ? undefined : 170 * (1 - p)}
      strokeLinecap="round"
    />
  );
};

/** A node: a hot dot inside a glow ring, popping in with back.out(2). */
export const Node: React.FC<{ x: number; y: number; at: number; hex?: string; hot?: string; r?: number; octa?: boolean }> = ({ x, y, at, hex = C.core, hot = C.coreHot, r = 8, octa = false }) => {
  const p = ease("node", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, p)})`}>
      {octa ? <polygon points={octagon(0, 0, r * 3)} fill={rgba(C.surface, 0.8)} stroke={hex} strokeWidth={2} /> : <circle r={r * 2.2} fill={hex} opacity={0.18} />}
      <circle r={r} fill={hot} />
    </g>
  );
};

export { BODY, DISPLAY, MONO };
