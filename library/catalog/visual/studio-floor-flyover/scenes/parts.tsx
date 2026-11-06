/**
 * Studio Floor Fly-over's pieces: the bright floor, the camera (CSS 3D: the page lies on a plane 56° off straight-down,
 * seen through the source's focal length scaled to 1920 px), lifted pieces standing up toward the lens with contact
 * shadows, tilt-shift depth of field from the source's formula, and the end card's two-line title.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const PW = style.layout.page.width;
export const C = {
  floor: color(style.palette, "background"),
  corner: color(style.palette, "floorCorner"),
  shadow: color(style.palette, "shadow"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  white: color(style.palette, "surface"),
  faint: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  sky: color(style.palette, "accent2"),
  sun: color(style.palette, "sun"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
const CAM = style.camera;
const rad = (d: number) => (d * Math.PI) / 180;

/** The studio floor: near-white centre falling off to the corners; waits for the fonts. */
export const Floor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${C.floor} 0%, ${C.corner} 100%)`, fontFamily: SANS, color: C.text }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A piece of the page that lifts off it and stands up toward the lens (page px; `stand` in degrees). */
export type Lift = { key: string; x: number; y: number; w: number; h: number; lift: number; stand: number; radius?: number; node: React.ReactNode };

/** How far a piece has stood up: it starts rising about 450 page px before it reaches the focus and is up just after. */
export const standing = (focusY: number, y: number): number => ease("stand", (focusY - y + S.motion.standLead) / CAM.cruise);

/**
 * The fly-over. `page` is drawn flat in page px (width PW, from y = 0); `focusY` is the page y under the frame's centre;
 * `distance` is the camera's distance to that point. Pieces in `lifts` stand up off the page with their contact shadow.
 * Depth of field: blur = 75·(focus − depth)/depth in front, 6·(depth − focus)/depth behind, capped at 120 px, laid
 * over the frame in thin bands (on a tilted plane depth only changes with screen y).
 */
export const Fly: React.FC<{ focusY: number; distance: number; pageH: number; page: React.ReactNode; lifts: Lift[]; dof?: boolean }> = ({ focusY, distance, pageH, page, lifts, dof = true }) => {
  const p = CAM.focal;
  const th = CAM.tilt;
  const base = `translate(${W / 2}px, ${H / 2}px) translateZ(${p - distance}px) rotateX(${th}deg)`;
  const sorted = [...lifts].sort((a, b) => a.y - b.y);
  const sh = S.finish.liftShadow;
  const k = Math.sin(rad(th)) / (p * Math.cos(rad(th)));
  const bands = 32;
  const bh = H / bands;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, perspective: `${p}px`, perspectiveOrigin: `${W / 2}px ${H / 2}px`, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PW,
            height: pageH,
            transformOrigin: "0 0",
            transform: `${base} translate(${-PW / 2}px, ${-focusY}px)`,
            backgroundColor: C.white,
            borderRadius: S.layout.page.radius,
            boxShadow: `0 6px 30px ${rgba(C.shadow, 0.08)}`,
          }}
        >
          {page}
          {sorted.map((l) => {
            const s = standing(focusY, l.y);
            const z = l.lift * s;
            return (
              <div
                key={`s-${l.key}`}
                style={{
                  position: "absolute",
                  left: l.x + sh.dx * z,
                  top: l.y + sh.dy[0] + sh.dy[1] * z,
                  width: l.w,
                  height: l.h * Math.cos(rad(l.stand * s)),
                  borderRadius: l.radius ?? 18,
                  backgroundColor: C.shadow,
                  opacity: sh.opacity * clamp(s * 3),
                  filter: `blur(${sh.blur[0] + sh.blur[1] * z}px)`,
                }}
              />
            );
          })}
        </div>
        {sorted.map((l) => {
          const s = standing(focusY, l.y);
          return (
            <div
              key={l.key}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: l.w,
                height: l.h,
                transformOrigin: "0 0",
                transform: `${base} translate3d(${l.x - PW / 2}px, ${l.y - focusY}px, ${l.lift * s}px) translateY(${l.h}px) rotateX(${-l.stand * s}deg) translateY(${-l.h}px)`,
                borderRadius: l.radius ?? 18,
                overflow: "hidden",
              }}
            >
              {l.node}
            </div>
          );
        })}
      </div>
      {dof
        ? Array.from({ length: bands }, (_, i) => {
            // overlapping bands with soft masks (a progressive blur), so band edges never show as seams
            const ys = (i + 0.5) * bh - H / 2;
            const b = Math.min(S.finish.dof.cap, (ys > 0 ? S.finish.dof.front : S.finish.dof.back) * Math.abs(ys) * k);
            if (b < 0.4) return null;
            const mask = "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -40,
                  top: (i - 0.5) * bh,
                  width: W + 80,
                  height: i === bands - 1 ? bh * 3 : bh * 2,
                  backdropFilter: `blur(${b.toFixed(2)}px)`,
                  WebkitBackdropFilter: `blur(${b.toFixed(2)}px)`,
                  maskImage: i === bands - 1 ? "linear-gradient(180deg, transparent 0%, #000 30%)" : mask,
                  WebkitMaskImage: i === bands - 1 ? "linear-gradient(180deg, transparent 0%, #000 30%)" : mask,
                }}
              />
            );
          })
        : null}
    </>
  );
};

/** The page y under the frame's centre at time t, gliding at the cruise speed so that it reaches `target` at `hero`. */
export const glide = (t: number, target: number, hero: number): number => target + CAM.cruise * (t - hero);

/** The camera's distance for a moment of the flight: it only ever grows (1360 → 1700 px in the source, scaled). */
export const distanceAt = (k: number): number => lerp(CAM.distance[0], CAM.distance[1], clamp(k));

/** The end card's title: Geist words every 0.06 s, then the grey Instrument Serif italic tail every 0.05 s; each rises 16 px out of a 12 px blur in 0.34 s. */
export const TwoLine: React.FC<{ line: string; tail: string; y: number; at?: number }> = ({ line, tail, y, at = 0 }) => {
  const t = useSeconds() - at;
  const mv = S.motion;
  const word = (w: string, k: number, i: number) => {
    const p = ease("word", t - k);
    return (
      <span key={i} style={{ display: "inline-block", opacity: clamp(p), transform: `translateY(${(1 - p) * mv.wordRise}px)`, filter: p < 1 ? `blur(${(1 - p) * mv.wordBlur}px)` : undefined, marginRight: "0.24em" }}>
        {w}
      </span>
    );
  };
  const a = words(line).map((w) => w.text);
  const b = words(tail).map((w) => w.text);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: y, textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontSize: S.type.display, fontWeight: 500, letterSpacing: `${S.type.tracking}em`, lineHeight: S.type.leading, color: C.text, paddingLeft: "0.24em" }}>{a.map((w, i) => word(w, i * mv.wordStep, i))}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: S.type.tail, lineHeight: 1, color: C.muted, paddingLeft: "0.24em" }}>{b.map((w, i) => word(w, a.length * mv.wordStep + i * mv.tailStep, i))}</div>
    </div>
  );
};

/** The white badge pill above the title. */
export const Badge: React.FC<{ text: string; y: number; at?: number }> = ({ text, y, at = 0 }) => {
  const p = ease("word", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: y, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 999, backgroundColor: C.white, boxShadow: `0 4px 16px ${rgba(C.shadow, 0.1)}`, fontSize: S.type.badge, fontWeight: 500, color: C.text }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.accent }} />
        {text}
      </div>
    </div>
  );
};

/** A generic logo tile (rounded square + a simple glyph) that grows from 32 px and hangs outside the page's corner. */
export const Tile: React.FC<{ x: number; y: number; size: number; bg: string; glyph: "sun" | "spark" | "drop" | "ring"; fg: string; at?: number; rot?: number }> = ({ x, y, size, bg, glyph, fg, at = 0, rot = 0 }) => {
  const p = ease("tile", useSeconds() - at);
  const s = lerp(32, size, clamp(p, 0, 1.05));
  const g: Record<string, React.ReactNode> = {
    sun: <circle cx={50} cy={50} r={18} fill={fg} />,
    spark: <path d="M50 22 C53 44 56 47 78 50 C56 53 53 56 50 78 C47 56 44 53 22 50 C44 47 47 44 50 22 Z" fill={fg} />,
    drop: <path d="M50 24 C62 42 70 52 70 61 A20 20 0 0 1 30 61 C30 52 38 42 50 24 Z" fill={fg} />,
    ring: <circle cx={50} cy={50} r={18} fill="none" stroke={fg} strokeWidth={8} />,
  };
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.26, backgroundColor: bg, boxShadow: `0 ${s * 0.08}px ${s * 0.2}px ${rgba(C.shadow, 0.22)}`, transform: `rotate(${rot}deg)`, opacity: clamp(p * 4) }}>
      <svg width={s} height={s} viewBox="0 0 100 100">
        {g[glyph]}
      </svg>
    </div>
  );
};

export { SANS, SERIF };
