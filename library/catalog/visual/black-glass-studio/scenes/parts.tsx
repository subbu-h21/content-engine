/**
 * Black Glass Studio's pieces, approximated in CSS 3D for the previews (the real look is a Blender render, STYLE.md §9):
 * the studio void, slabs of black glossy glass (six faces, a glowing screen under a glossy sheen), an invented toy hero
 * standing in the world, generic editor UI (tool buttons, tracks, nodes, meters) and the glowing title card it builds.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const C = {
  bg: color(style.palette, "background"),
  glass: color(style.palette, "surface"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  hero: color(style.palette, "accent"),
  light: color(style.palette, "accent2"),
  screen: color(style.palette, "screen"),
  edge: color(style.palette, "glassEdge"),
  heroShade: color(style.palette, "heroShade"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const L = style.layout;
const F = style.finish;
const WORLD = L.world;

/** The studio: a near-black void with a faint cool light behind the panels, a 3D stage in a 3/4 view, the finish. */
export const Studio: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 42% at 50% 52%, ${rgba(C.light, 0.09)} 0%, transparent 70%), linear-gradient(to bottom, #0b0d13 0%, ${C.bg} 55%, #040506 100%)` }} />
      <AbsoluteFill style={{ perspective: `${WORLD.perspective}px`, perspectiveOrigin: `50% ${WORLD.originY * 100}%` }}>
        <div style={{ position: "absolute", left: W / 2, top: H / 2, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${WORLD.rotateX}deg) rotateY(${WORLD.rotateY}deg)` }}>{children}</div>
      </AbsoluteFill>
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export type SlabPose = { x: number; y: number; z?: number; w: number; h: number; d?: number; rx?: number; ry?: number; rz?: number };

/** A point on a slab's front face (local bx, by from its centre) in world coordinates: where the hero's feet go. */
export const onFace = (s: SlabPose, bx: number, by: number): [number, number, number] => {
  const a = ((s.rx ?? 0) * Math.PI) / 180;
  const d = (s.d ?? L.slab.depth) / 2;
  return [s.x + bx, s.y + by * Math.cos(a) - d * Math.sin(a), (s.z ?? 0) + by * Math.sin(a) + d * Math.cos(a)];
};
/** A point on a slab's top edge (upright slabs only). */
export const onTop = (s: SlabPose, bx: number): [number, number, number] => [s.x + bx, s.y - s.h / 2, s.z ?? 0];

/**
 * A slab of black glossy glass: six faces in CSS 3D. The front face carries the glowing screen (its content) under a
 * glossy sheen; `power` dims the screen (0 = off), `blur` is the depth of field, `pop` scales it in.
 */
export const Slab: React.FC<SlabPose & { power?: number; blur?: number; pop?: number; children?: React.ReactNode }> = ({ x, y, z = 0, w, h, d = L.slab.depth, rx = 0, ry = 0, rz = 0, power = 1, blur = 0, pop = 1, children }) => {
  const f: React.CSSProperties = { position: "absolute", filter: blur > 0.1 ? `blur(${blur}px)` : undefined, backfaceVisibility: "hidden" };
  const edge = (shade: number) => `linear-gradient(to bottom, ${rgba(C.edge, 1)}, ${rgba(C.glass, 1)} ${60 + shade * 20}%)`;
  const inset = L.slab.inset;
  return (
    <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, transformStyle: "preserve-3d", transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${pop})` }}>
      <div style={{ ...f, left: 0, top: 0, width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, backgroundColor: C.glass }} />
      <div style={{ ...f, left: 0, top: (h - d) / 2, width: w, height: d, transform: `rotateX(90deg) translateZ(${h / 2}px)`, background: `linear-gradient(to right, #2a3140, ${C.edge} 40%, #12161e)` }} />
      <div style={{ ...f, left: 0, top: (h - d) / 2, width: w, height: d, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, backgroundColor: "#07080b" }} />
      <div style={{ ...f, left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, background: edge(0) }} />
      <div style={{ ...f, left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(90deg) translateZ(${w / 2}px)`, background: edge(1) }} />
      <div
        style={{
          ...f,
          left: 0,
          top: 0,
          width: w,
          height: h,
          transform: `translateZ(${d / 2}px)`,
          borderRadius: 6,
          backgroundColor: C.glass,
          boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.05)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: inset,
            top: inset,
            right: inset,
            bottom: inset,
            borderRadius: L.slab.radius * 0.5,
            backgroundColor: C.screen,
            boxShadow: `0 0 ${60 * power}px ${rgba(C.light, F.screenGlow * power)}`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.25 + 0.75 * power, filter: power < 1 ? `brightness(${0.25 + 0.75 * power})` : undefined }}>{children}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(118deg, rgba(255,255,255,${F.reflection * 1.4}) 0%, rgba(255,255,255,${F.reflection * 0.3}) 28%, transparent 29%, transparent 62%, rgba(255,255,255,${F.reflection * 0.5}) 63%, transparent 78%)` }} />
      </div>
    </div>
  );
};

/** The invented toy hero: a glossy rounded block on two stubby feet with a little nub, standing with its feet at (x, y, z). */
export const Hero: React.FC<{ at: [number, number, number]; size?: number; squash?: number; lift?: number; blur?: number }> = ({ at, size = 150, squash = 1, lift = 0, blur = 0 }) => {
  const [x, y, z] = at;
  const w = size;
  const h = size * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: -w / 2,
        top: -h,
        width: w,
        height: h,
        transformOrigin: "50% 100%",
        transform: `translate3d(${x}px, ${y - lift}px, ${z + 2}px) rotateY(${-WORLD.rotateY}deg) rotateX(${-WORLD.rotateX}deg) scale(${1 / Math.sqrt(squash)}, ${squash})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, bottom: -h * 0.06 - lift * 0.3, height: h * 0.12, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.7)", filter: "blur(8px)", opacity: clamp(1 - lift / 300) }} />
      {[0.26, 0.58].map((fx, i) => (
        <div key={i} style={{ position: "absolute", left: w * fx, bottom: 0, width: w * 0.17, height: h * 0.15, borderRadius: "40% 40% 30% 30%", background: `linear-gradient(to bottom, ${C.heroShade}, #8a4f06)` }} />
      ))}
      <div style={{ position: "absolute", left: w * 0.47, top: 0, width: w * 0.06, height: h * 0.16, borderRadius: 6, backgroundColor: C.heroShade }} />
      <div style={{ position: "absolute", left: w * 0.41, top: -h * 0.04, width: w * 0.18, height: w * 0.18, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff3d0 0%, ${C.hero} 45%, ${C.heroShade} 100%)` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: h * 0.13,
          width: w,
          height: h * 0.76,
          borderRadius: "46% 46% 38% 38% / 50% 50% 34% 34%",
          background: `radial-gradient(circle at 32% 26%, #fff6dc 0%, ${C.hero} 26%, ${C.hero} 52%, ${C.heroShade} 100%)`,
          boxShadow: `inset -${w * 0.06}px -${w * 0.08}px ${w * 0.12}px rgba(90,40,0,0.45), 0 0 ${w * 0.25}px ${rgba(C.hero, 0.25)}`,
        }}
      />
      <div style={{ position: "absolute", left: w * 0.2, top: h * 0.2, width: w * 0.22, height: h * 0.1, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.75)", filter: "blur(3px)", transform: "rotate(-24deg)" }} />
    </div>
  );
};

/** A generic tool button on a screen: an icon and a label; `active` glows in screen light. */
export const ToolButton: React.FC<{ label: string; icon: "type" | "rect" | "pen" | "glow"; active?: boolean; w: number; h: number; x: number; y: number }> = ({ label, icon, active = false, w, h, x, y }) => {
  const col = active ? C.light : C.muted;
  const s = h * 0.34;
  const ic = {
    type: <text x={s / 2} y={s * 0.86} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={s} fill={col}>T</text>,
    rect: <rect x={s * 0.08} y={s * 0.2} width={s * 0.84} height={s * 0.6} fill="none" stroke={col} strokeWidth={3} />,
    pen: <path d={`M ${s * 0.15} ${s * 0.9} L ${s * 0.3} ${s * 0.45} L ${s * 0.5} ${s * 0.08} L ${s * 0.7} ${s * 0.45} L ${s * 0.85} ${s * 0.9} Z`} fill="none" stroke={col} strokeWidth={3} strokeLinejoin="round" />,
    glow: <path d={`M ${s / 2} 0 L ${s * 0.6} ${s * 0.4} L ${s} ${s / 2} L ${s * 0.6} ${s * 0.6} L ${s / 2} ${s} L ${s * 0.4} ${s * 0.6} L 0 ${s / 2} L ${s * 0.4} ${s * 0.4} Z`} fill={col} />,
  }[icon];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 14,
        border: `2px solid ${active ? C.light : C.faint}`,
        backgroundColor: active ? rgba(C.light, 0.16) : rgba(C.text, 0.03),
        boxShadow: active ? `0 0 28px ${rgba(C.light, 0.55)}, inset 0 0 18px ${rgba(C.light, 0.25)}` : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: h * 0.08,
      }}
    >
      <svg width={s} height={s} style={{ overflow: "visible" }}>
        {ic}
      </svg>
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: T.label, color: active ? C.light : C.muted }}>{label}</div>
    </div>
  );
};

/** A small app header strip for a screen: three dots and a mono title (a generic app, no names). */
export const ScreenHeader: React.FC<{ title: string; right?: string }> = ({ title, right }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, borderBottom: `1.5px solid ${C.faint}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.faint }} />
    ))}
    <div style={{ marginLeft: 12, fontFamily: MONO, fontWeight: 500, fontSize: T.min, color: C.muted, whiteSpace: "nowrap" }}>{title}</div>
    {right ? <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 500, fontSize: T.min, color: C.light, whiteSpace: "nowrap" }}>{right}</div> : null}
  </div>
);

/** The glowing title card the hero builds: lines in Sora, the key word in the hero colour with a glow and spark rays. */
export const TitleCard: React.FC<{ lines: { text: string; key?: boolean; size: number }[]; top: number; width: number; build?: number; rays?: boolean }> = ({ lines, top, width, build = 1, rays = true }) => {
  let y = top;
  return (
    <>
      {lines.map((l, i) => {
        const yy = y;
        y += l.size * T.leading;
        const p = clamp(build * lines.length - i);
        return (
          <div key={i} style={{ position: "absolute", left: 0, width, top: yy, textAlign: "center", fontFamily: DISPLAY, fontWeight: l.key ? 800 : 700, fontSize: l.size, lineHeight: 1, letterSpacing: `${T.tracking}em`, color: l.key ? C.hero : C.text, opacity: p, transform: `scale(${0.9 + 0.1 * p})`, textShadow: l.key ? `0 0 18px ${rgba(C.hero, 0.8)}, 0 0 48px ${rgba(C.hero, 0.45)}` : `0 0 16px ${rgba(C.text, 0.25)}`, whiteSpace: "nowrap" }}>
            {rays && l.key ? (
              <svg width={width} height={l.size * 2.4} style={{ position: "absolute", left: 0, top: -l.size * 0.7, zIndex: -1, overflow: "visible" }}>
                {Array.from({ length: 14 }, (_, k) => {
                  const a = (k / 14) * Math.PI * 2 + 0.2;
                  const cx = width / 2;
                  const cy = l.size * 1.2;
                  const r0 = l.size * 0.9;
                  const r1 = r0 + Math.min(l.size, 110) * (0.45 + 0.35 * ((k * 7) % 3)) * p;
                  return <line key={k} x1={cx + Math.cos(a) * r0 * 1.6} y1={cy + Math.sin(a) * r0 * 0.7} x2={cx + Math.cos(a) * r1 * 1.6} y2={cy + Math.sin(a) * r1 * 0.7} stroke={C.hero} strokeWidth={6} strokeLinecap="round" opacity={0.55} />;
                })}
              </svg>
            ) : null}
            {l.text}
          </div>
        );
      })}
    </>
  );
};

/** A UI line of text on a screen. */
export const UiText: React.FC<{ text: string; x: number; y: number; size?: number; col?: string; weight?: number; mono?: boolean; align?: "left" | "center" | "right"; width?: number }> = ({
  text,
  x,
  y,
  size = T.ui,
  col = C.text,
  weight = 500,
  mono = false,
  align = "left",
  width,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width, textAlign: align, fontFamily: mono ? MONO : BODY, fontWeight: weight, fontSize: size, lineHeight: 1.1, color: col, whiteSpace: "nowrap" }}>{text}</div>
);

/** A keyframe diamond in screen light; `stamp` is seconds since it was stamped (scale 1.6 → 1). */
export const Diamond: React.FC<{ x: number; y: number; size?: number; stamp?: number }> = ({ x, y, size = 20, stamp }) => {
  const s = stamp === undefined ? 1 : R.stamp.from + (1 - R.stamp.from) * ease("stamp", stamp);
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, backgroundColor: C.light, transform: `rotate(45deg) scale(${s})`, boxShadow: `0 0 14px ${rgba(C.light, 0.8)}` }} />;
};

/** The hop: a parabola over one beat, squashing on landing. Returns lift (px) and squash for t seconds into the hop. */
export const hop = (t: number): { lift: number; squash: number } => {
  const d = R.hop.duration;
  if (t < 0 || t > d + 0.2) return { lift: 0, squash: 1 };
  if (t > d) {
    const k = (t - d) / 0.2;
    return { lift: 0, squash: R.hop.squash + (1 - R.hop.squash) * k };
  }
  const p = ease("hop", t);
  return { lift: 4 * R.hop.height * p * (1 - p), squash: 1 + (R.hop.stretch - 1) * Math.sin(Math.PI * p) };
};

export const useT = useSeconds;
