/**
 * Keynote Glass Blue's pieces: the grounds (white page, blue haze, sky wallpaper, black end card), thin white line
 * art, frosted glass, sky cards with frosted titles cut by their bottom edge, the app icon with four squares locking
 * into a cross, the cursor, and "already moving" entries. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  page: color(P, "background"),
  text: color(P, "text"),
  grey: color(P, "muted"),
  rim: color(P, "faint"),
  surface: color(P, "surface"),
  band: color(P, "windowBand"),
  haze: color(P, "haze"),
  ice: color(P, "ice"),
  floor: color(P, "floorGlow"),
  skyTop: color(P, "skyTop"),
  skyBottom: color(P, "skyBottom"),
  navy: color(P, "navy"),
  blue: color(P, "accent"),
  cyan: color(P, "accent2"),
  mint: color(P, "mint"),
  capsule: color(P, "capsule"),
  hover: color(P, "hoverRing"),
  halo: color(P, "halo"),
  endOuter: color(P, "endOuter"),
  endInner: color(P, "endInner"),
  endWord: color(P, "endWord"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const beatAt = (k: number): number => S.motion.beatOffset + S.motion.beat * k;

export type GroundKind = "page" | "haze" | "sky" | "end";
const GROUNDS: Record<GroundKind, string> = {
  page: C.page,
  haze: `linear-gradient(180deg, ${C.haze} 0%, ${C.ice} 38%, ${C.page} 70%, ${C.floor} 100%)`,
  sky: `linear-gradient(180deg, ${C.skyTop} 0%, ${C.skyBottom} 100%)`,
  end: `radial-gradient(ellipse 75% 55% at 50% 50%, ${C.endInner} 0%, ${C.endOuter} 100%)`,
};

/** A ground; waits for the fonts. No grain, no vignette. */
export const Ground: React.FC<{ kind?: GroundKind; children: React.ReactNode }> = ({ kind = "page", children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ background: GROUNDS[kind], fontFamily: SANS, color: C.text, letterSpacing: `${S.type.tracking}em` }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** "Already moving" entry: covers 12–19% of the remaining distance per frame (= expo-out over 1.1–1.8 s). */
export const arrive = (t: number, from: number, to: number, rec: "enter" | "enterFast" | "enterSlow" = "enter"): number => lerp(from, to, ease(rec, t));

/** A four-point sparkle path centred on (x, y). */
export const sparkle = (x: number, y: number, r: number): string =>
  `M ${x} ${y - r} C ${x + r * 0.12} ${y - r * 0.12} ${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y} C ${x + r * 0.12} ${y + r * 0.12} ${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r} C ${x - r * 0.12} ${y + r * 0.12} ${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y} C ${x - r * 0.12} ${y - r * 0.12} ${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r} Z`;

/** Thin white line art for wallpapers and card images: a big circle, two lines, a sparkle. */
export const LineArt: React.FC<{ w: number; h: number; seed?: number; opacity?: number }> = ({ w, h, seed = 0, opacity = 0.5 }) => {
  const cx = w * (0.62 + 0.18 * Math.sin(seed * 1.7));
  const cy = h * (0.42 + 0.2 * Math.cos(seed * 2.3));
  const r = Math.max(w, h) * 0.38;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff" strokeOpacity={opacity * 0.6} strokeWidth={1.5} />
      <line x1={cx} y1={0} x2={cx} y2={h} stroke="#ffffff" strokeOpacity={opacity * 0.45} strokeWidth={1.2} />
      <line x1={0} y1={cy + r * 0.35} x2={w} y2={cy + r * 0.35} stroke="#ffffff" strokeOpacity={opacity * 0.45} strokeWidth={1.2} />
      <path d={sparkle(cx, cy + r * 0.35, 16)} fill="#ffffff" opacity={opacity * 1.4} />
    </svg>
  );
};

/** Frosted glass: the scene behind blurred and lightened (milk), a bright top rim, a soft lift shadow. */
export const Glass: React.FC<{ x: number; y: number; w: number; h: number; r?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, r = 60, children, style: st }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      backdropFilter: `blur(${S.finish.glass.blur}px) saturate(1.2)`,
      WebkitBackdropFilter: `blur(${S.finish.glass.blur}px) saturate(1.2)`,
      backgroundColor: rgba("#ffffff", S.finish.glass.milk),
      border: `1px solid ${rgba("#ffffff", 0.35)}`,
      boxShadow: `inset 0 1.5px 0 ${rgba("#ffffff", S.finish.glass.rim)}, 0 24px 60px -24px rgba(16,32,64,0.45)`,
      overflow: "hidden",
      ...st,
    }}
  >
    {children}
  </div>
);

/** A sky card (radius 57) with line art; `title` is a huge frosted word cut off by the card's bottom edge. */
export const SkyCard: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; title?: string; titleSize?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  seed = 0,
  title,
  titleSize = S.type.frosted,
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: S.layout.card.radius, overflow: "hidden", background: `linear-gradient(160deg, ${C.skyTop} 0%, ${C.skyBottom} 100%)`, boxShadow: "0 30px 60px -30px rgba(16,32,64,0.55)" }}>
    <LineArt w={w} h={h} seed={seed} />
    {title ? (
      <div
        style={{
          position: "absolute",
          left: 34,
          bottom: -titleSize * 0.16,
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          whiteSpace: "nowrap",
          backgroundImage: `linear-gradient(180deg, ${rgba("#ffffff", 0.94)} 0%, ${rgba(C.ice, 0.82)} 55%, ${rgba(C.ice, 0.6)} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 1px rgba(255,255,255,0.4))",
        }}
      >
        {title}
      </div>
    ) : null}
    {children}
  </div>
);

/** The macOS-style pointer (generic): 32 × 39, black with a white outline, faces its direction, grows on hover. */
export const Cursor: React.FC<{ x: number; y: number; angle?: number; hover?: number }> = ({ x, y, angle = 0, hover = 0 }) => {
  const s = lerp(1, S.layout.cursor.hover, clamp(hover));
  return (
    <svg
      width={S.layout.cursor.w}
      height={S.layout.cursor.h}
      viewBox="0 0 24 30"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: `rotate(${angle}deg) scale(${s})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
    >
      <path d="M2 2 L2 24 L7.5 18.8 L11.2 27.2 L14.6 25.7 L11 17.4 L18 17.4 Z" fill="#000000" stroke="#ffffff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
};

/** The squircle app icon (navy gradient, a generic sky glyph) on its grey halo, with four squares that orbit and lock into a cross. */
export const IconCross: React.FC<{ cx: number; cy: number; at?: number }> = ({ cx, cy, at = 0 }) => {
  const t = useSeconds() - at;
  const { size, radiusPct, square, squareRadius, orbit } = S.layout.icon;
  const p = ease("orbit", t);
  const shrink = lerp(276, size, ease("enter", t));
  const spin = (1 - p) * 220;
  const rr = lerp(orbit * 1.5, orbit, p);
  const sq = [
    { a: -90, fill: C.blue },
    { a: 0, fill: C.cyan },
    { a: 90, fill: C.mint },
    { a: 180, fill: C.surface },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: cx - 150, top: cy - 150, width: 300, height: 300, borderRadius: "50%", backgroundColor: C.halo, opacity: clamp(t / 0.3) }} />
      {sq.map((q, i) => {
        const a = ((q.a + spin) * Math.PI) / 180;
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - square / 2,
              top: y - square / 2,
              width: square,
              height: square,
              borderRadius: squareRadius,
              backgroundColor: q.fill,
              boxShadow: q.fill === C.surface ? `0 0 0 1px ${C.rim}, 0 10px 24px -10px rgba(16,32,64,0.3)` : "0 10px 24px -10px rgba(16,32,64,0.35)",
              opacity: clamp(t / 0.25),
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: cx - shrink / 2,
          top: cy - shrink / 2,
          width: shrink,
          height: shrink,
          borderRadius: `${radiusPct}%`,
          background: `linear-gradient(160deg, ${C.skyTop} 0%, ${C.navy} 100%)`,
          boxShadow: "0 18px 40px -16px rgba(16,32,64,0.6)",
        }}
      >
        <svg width={shrink} height={shrink} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={50} cy={50} r={22} fill="none" stroke="#ffffff" strokeWidth={3} />
          <line x1={50} y1={14} x2={50} y2={86} stroke="#ffffff" strokeOpacity={0.5} strokeWidth={1.6} />
          <line x1={14} y1={58} x2={86} y2={58} stroke="#ffffff" strokeOpacity={0.5} strokeWidth={1.6} />
          <path d={sparkle(50, 58, 9)} fill="#ffffff" />
        </svg>
      </div>
    </>
  );
};
