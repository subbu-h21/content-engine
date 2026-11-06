/**
 * One-Take Journey's pieces: the dot-grid world, stations (a card with its `Name · state` label), the hero ball with
 * squash, stretch and a motion smear, ballistic arcs that land on the beat, and the small system controls.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const SW = style.layout.stationWidth;
export const C = {
  bg: color(style.palette, "background"),
  dot: color(style.palette, "faint"),
  surface: color(style.palette, "surface"),
  surface2: color(style.palette, "surface2"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  accent: color(style.palette, "accent"),
  hero: color(style.palette, "accent2"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const beat = (n: number): number => n * S.motion.beat;

/** The world: canvas + a dot grid that moves with the camera (`cam` is the camera's world offset). */
export const Ground: React.FC<{ children: React.ReactNode; cam?: [number, number] }> = ({ children, cam = [0, 0] }) => {
  useFontsReady(FACES);
  const g = S.layout.dotGap;
  const ox = -(((cam[0] % g) + g) % g);
  const oy = -(((cam[1] % g) + g) % g);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SANS, letterSpacing: `${S.type.tracking}em` }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <pattern id="otj-dots" x={ox} y={oy} width={g} height={g} patternUnits="userSpaceOnUse">
            <circle cx={g / 2} cy={g / 2} r={S.layout.dotSize / 2} fill={C.dot} />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#otj-dots)" />
      </svg>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** `Name · state` above a station. */
export const Label: React.FC<{ name: string; state: string; x: number; y: number; at?: number }> = ({ name, state, x, y, at = 0 }) => {
  const p = clamp((useSeconds() - at) / 0.2);
  return (
    <div style={{ position: "absolute", left: x, top: y - S.type.label, fontSize: S.type.label, opacity: p, whiteSpace: "nowrap" }}>
      <span style={{ color: C.text, fontWeight: 600 }}>{name}</span>
      <span style={{ color: C.muted }}> · {state}</span>
    </div>
  );
};

/** A station card; `hit` (seconds) gives it a small push-down when the hero lands on it. */
export const Card: React.FC<{ x: number; y: number; w?: number; h: number; hit?: number; children?: React.ReactNode; radius?: number; bg?: string }> = ({
  x,
  y,
  w = SW,
  h,
  hit,
  children,
  radius = S.layout.radius,
  bg = C.surface,
}) => {
  const t = useSeconds();
  let push = 0;
  if (hit !== undefined && t >= hit) {
    const k = t - hit;
    push = k < S.motion.squashHold ? 1 : 1 - ease("squashBack", k - S.motion.squashHold);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + 8 * push,
        width: w,
        height: h,
        borderRadius: radius,
        backgroundColor: bg,
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.8)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

/** A dim neighbour station at the frame's edge: the world goes on (shapes only, no text). */
export const Stub: React.FC<{ x: number; y: number; w: number; h: number; kind?: "track" | "rows" | "toggle" }> = ({ x, y, w, h, kind = "rows" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: S.layout.radius, backgroundColor: C.surface, opacity: 0.55 }}>
    {kind === "track" ? <div style={{ position: "absolute", left: 40, right: 40, top: h / 2 - 5, height: 10, borderRadius: 5, backgroundColor: C.surface2 }} /> : null}
    {kind === "rows"
      ? [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40, top: 40 + i * 56, width: w * (0.6 - i * 0.12), height: 18, borderRadius: 9, backgroundColor: C.surface2 }} />)
      : null}
    {kind === "toggle" ? <div style={{ position: "absolute", left: 40, top: h / 2 - 31, width: 102, height: 62, borderRadius: 31, backgroundColor: C.surface2 }} /> : null}
  </div>
);

export type Motion = { x: number; y: number; vx: number; vy: number };

/** A ballistic hop from `a` (left at t0) to `b` (landed at t1) under the style's gravity: x linear, y parabolic. */
export const arc = (t: number, a: [number, number], b: [number, number], t0: number, t1: number): Motion => {
  const T = t1 - t0;
  const g = S.motion.gravity;
  const v = (b[1] - a[1] - 0.5 * g * T * T) / T;
  const tau = clamp(t - t0, 0, T);
  return { x: a[0] + ((b[0] - a[0]) * tau) / T, y: a[1] + v * tau + 0.5 * g * tau * tau, vx: (b[0] - a[0]) / T, vy: v + g * tau };
};

/**
 * The hero: a white ball. In flight it stretches along its velocity (up to 1.15 × 0.9) and smears like the 8-sub-frame
 * motion blur; on impact it squashes 1.25 × 0.8 for 60 ms, then springs back. (x, y) is its centre.
 */
export const Hero: React.FC<{ m: Motion; impact?: number; size?: number; halo?: number }> = ({ m, impact, size = S.layout.hero, halo = 0 }) => {
  const t = useSeconds();
  const speed = Math.hypot(m.vx, m.vy);
  let sx = 1;
  let sy = 1;
  let rot = 0;
  let oy = 0;
  if (impact !== undefined && t >= impact) {
    const k = t - impact;
    const q = k < S.motion.squashHold ? 1 : 1 - ease("squashBack", k - S.motion.squashHold);
    sx = 1 + (S.motion.squash[0] - 1) * q;
    sy = 1 + (S.motion.squash[1] - 1) * q;
    oy = (size * (1 - sy)) / 2;
  } else if (speed > 1) {
    const k = clamp(speed / 3200);
    sx = 1 + (S.motion.stretch[0] - 1) * k;
    sy = 1 - (1 - S.motion.stretch[1]) * k;
    rot = (Math.atan2(m.vy, m.vx) * 180) / Math.PI;
  }
  const ghosts = impact === undefined && speed > 600 ? [-3, -2, -1, 1, 2, 3] : [];
  const dt = 1 / 30 / 2 / 6;
  const ball = (dx: number, dy: number, op: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: m.x + dx - size / 2,
        top: m.y + dy - size / 2 + oy,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: C.hero,
        opacity: op,
        transform: `rotate(${rot}deg) scale(${sx}, ${sy})`,
        boxShadow: op === 1 ? [S.finish.heroShadow, halo > 0 ? `0 0 ${S.finish.revealHalo * halo}px ${rgba(C.hero, 0.45 * halo)}` : ""].filter(Boolean).join(", ") : undefined,
      }}
    />
  );
  return (
    <>
      {ghosts.map((k) => ball(-m.vx * dt * k, -m.vy * dt * k, 0.16, `g${k}`))}
      {ball(0, 0, 1, "hero")}
    </>
  );
};

/** A dim outline of the hero's slot, left behind when it leaves. */
export const Slot: React.FC<{ x: number; y: number; size?: number; fill?: number }> = ({ x, y, size = S.layout.hero, fill = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      border: `3px dashed ${rgba(C.text, 0.55)}`,
      backgroundColor: rgba(C.hero, 0.9 * fill),
      boxSizing: "border-box",
    }}
  />
);

/** A slider with tick marks and a value tooltip; the knob is drawn by the caller (often the hero). */
export const Slider: React.FC<{ x: number; y: number; w: number; frac: number; ticks?: number }> = ({ x, y, w, frac, ticks = 12 }) => (
  <>
    {Array.from({ length: ticks + 1 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: x + (w * i) / ticks - 1, top: y + 22, width: 2, height: 12, backgroundColor: C.surface2 }} />
    ))}
    <div style={{ position: "absolute", left: x, top: y - 5, width: w, height: 10, borderRadius: 5, backgroundColor: C.surface2 }} />
    <div style={{ position: "absolute", left: x, top: y - 5, width: w * clamp(frac), height: 10, borderRadius: 5, backgroundColor: C.accent }} />
  </>
);

/** A small value tooltip above a point. */
export const Tooltip: React.FC<{ x: number; y: number; text: string; op?: number }> = ({ x, y, text, op = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -100%)", opacity: op }}>
    <div style={{ padding: "10px 18px", borderRadius: 14, backgroundColor: C.text, color: C.bg, fontSize: S.type.small + 4, fontWeight: 600, whiteSpace: "nowrap" }}>{text}</div>
  </div>
);

/** A round checkbox: empty ring, or an accent check. */
export const Check: React.FC<{ x: number; y: number; done: number }> = ({ x, y, done }) => {
  const s = clamp(done, 0, 1.15);
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" style={{ position: "absolute", left: x - 28, top: y - 28, overflow: "visible" }}>
      <circle cx={28} cy={28} r={25} fill="none" stroke={C.surface2} strokeWidth={3} />
      {s > 0 ? (
        <g transform={`translate(28 28) scale(${s}) translate(-28 -28)`}>
          <circle cx={28} cy={28} r={26.5} fill={C.accent} />
          <path d="M17 28.5 L24.5 36 L39 21" fill="none" stroke="#ffffff" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
};

/** A generic app-icon square with a simple sun glyph (no brand). */
export const AppIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={4.5} fill="#ffffff" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * i) / 4;
        return <line key={i} x1={12 + 7 * Math.cos(a)} y1={12 + 7 * Math.sin(a)} x2={12 + 10 * Math.cos(a)} y2={12 + 10 * Math.sin(a)} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />;
      })}
    </svg>
  </div>
);
