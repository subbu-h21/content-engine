/**
 * Lit Pixel Diorama's pieces: a tabletop harbour set seen from high three-quarter (front faces upright, the ground
 * receding up the frame), pixel textures at one constant density (6 px pixels), billboard pixel sprites with a
 * one-pixel selout, practical lights that breathe, fog per set, a tilt-shift band (a blurred copy of the set outside
 * the sharp band), bloom and a vignette; Cinzel gold titles, Cormorant narration on a soft band, the gold-bordered
 * dialogue box. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const PX = E.pixel;
const P = style.palette;
export const col = (role: string) => color(P, role);
export const C = {
  sky0: col("background"),
  parchment: col("text"),
  gold: col("muted"),
  gold2: col("gold-2"),
  gold3: col("gold-3"),
  fire: col("accent"),
  moon: col("accent2"),
  lantern: col("lantern"),
  beacon: col("beacon"),
  fill: col("fill"),
  ink: col("ink"),
  selout: col("selout"),
};
export type TimeKey = keyof typeof style.times;
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const rgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (v: number[]) => `#${v.map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
export const mix = (a: string, b: string, k: number) => {
  const x = rgb(a);
  const y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * k));
};
/** A set colour under a time of day: night as painted, dawn and day lifted toward the light. */
export const tc = (h: string, time: TimeKey): string => {
  const k = style.times[time].light;
  if (k === 1) return h;
  const warm = time === "dawn" ? [1.08, 0.96, 0.9] : [0.98, 1.0, 1.04];
  return hex(rgb(h).map((v, i) => v * k * warm[i] + (k - 1) * 22));
};
/** Lights breathe: three summed sines, about ±20%. */
export const flicker = (t: number, seed: number): number =>
  1 + E.flicker * (0.5 * Math.sin(t * 7.3 + seed) + 0.3 * Math.sin(t * 13.1 + seed * 2.1) + 0.2 * Math.sin(t * 23.7 + seed * 3.7));

// ---------------------------------------------------------------- the set's geometry

export type View = { gy: number };
/** World (x = screen x, y = depth, z = up) → screen: front faces stay upright, the ground recedes up the frame. */
export const pt = (v: View, x: number, y: number, z = 0): [number, number] => [x, v.gy - y * E.depth - z * E.height];

// ---------------------------------------------------------------- pixel textures

const tile = (rows: string[], map: Record<string, string>, id: string) => {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <pattern key={id} id={id} width={w * PX} height={h * PX} patternUnits="userSpaceOnUse">
      {rows.flatMap((row, y) => [...row].map((ch, x) => <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={map[ch]} />))}
    </pattern>
  );
};

/** Every texture of the set at one density: cobbles, plaster, brick, wood, slate, clay tile, water. */
export const Textures: React.FC<{ time: TimeKey }> = ({ time }) => {
  const k = (r: string) => tc(col(r), time);
  return (
    <defs>
      {tile(
        ["111111111111", "122223122231", "123332123321", "123322123221", "111111111111", "223122222312", "333123332123", "332123322122"],
        { "1": k("stone-1"), "2": k("stone-2"), "3": k("stone-3") },
        `tx-cobble-${time}`,
      )}
      {tile(["22222222", "22122222", "22222212", "22222222", "21222222", "22222122", "22222222", "22212222"], { "1": k("plaster-1"), "2": k("plaster-2") }, `tx-plaster-${time}`)}
      {tile(["22221222", "22221222", "11111111", "12222222", "12222222", "11111111"], { "1": k("brick-1"), "2": k("brick-2") }, `tx-brick-${time}`)}
      {tile(["122221", "122221", "122221", "122211", "122221", "112221"], { "1": k("wood-1"), "2": k("wood-2") }, `tx-wood-${time}`)}
      {tile(["22222222", "22222222", "11111111", "22221222", "22221222", "11111111"], { "1": k("roof-1"), "2": k("roof-2") }, `tx-slate-${time}`)}
      {tile(["22122212", "22122212", "11111111", "21222122", "21222122", "11111111"], { "1": k("tile-1"), "2": k("tile-2") }, `tx-tile-${time}`)}
      {tile(["111111111111", "111122111111", "111111111111", "111111112211", "111111111111", "121111111111"], { "1": k("water-1"), "2": k("water-2") }, `tx-water-${time}`)}
    </defs>
  );
};

// ---------------------------------------------------------------- sprites

export type Pix = { x: number; y: number; c: string };
const spritePix = (rows: string[], map: Record<string, string>): Pix[] => {
  const out: Pix[] = [];
  rows.forEach((row, y) => [...row].forEach((ch, x) => map[ch] && out.push({ x, y, c: map[ch] })));
  return out;
};
const HERO = [
  "......kkkk......",
  "....kk3333kk....",
  "...k33444333k...",
  "...k34444333k...",
  "..k3344kkkk33k..",
  "..k344kssssk3k..",
  "..k34kssesek3k..",
  "..k34kssssss3k..",
  "..k33ksSSssk3k..",
  "...k3kkSSkk3k...",
  "...kyyyyyyyyk...",
  "..k3yYYyyyyy3k..",
  "..k34yy3333333k.",
  ".k3344333333333k",
  ".k3444333332233k",
  ".k3444333322222k",
  "k33443333222222k",
  "k3443333322222k.",
  "k3443333222222k.",
  "k3343333222222k.",
  ".k333332222222k.",
  ".k333322222222k.",
  ".k33332222222k..",
  "..k3322222222k..",
  "..k3222222222k..",
  "...kk22kk22kk...",
  "...kbbk..kbbk...",
  "...kkkk..kkkk...",
];

/** A billboard pixel sprite standing at (x, y) on the ground (bottom-centre), lit by the warm practicals and a cool fill. */
export const Sprite: React.FC<{ v: View; x: number; y: number; who: "hero" | "keeper"; time: TimeKey; flip?: boolean; lantern?: boolean }> = ({ v, x, y, who, time, flip = false, lantern = true }) => {
  const k = (r: string) => tc(col(r), time);
  const map: Record<string, string> =
    who === "hero"
      ? { k: C.selout, "1": k("cloak-1"), "2": k("cloak-2"), "3": k("cloak-3"), "4": k("cloak-4"), s: k("skin"), S: mix(k("skin"), k("cloak-2"), 0.4), e: C.ink, y: k("scarf"), Y: mix(k("scarf"), C.ink, 0.35), b: k("wood-1") }
      : { k: C.selout, "1": k("coat-1"), "2": k("coat-2"), "3": k("coat-2"), "4": k("coat-3"), s: k("skin"), S: mix(k("skin"), k("coat-2"), 0.4), e: C.ink, y: k("coat-3"), Y: k("coat-2"), b: k("wood-1") };
  const pix = spritePix(HERO, map);
  const w = HERO[0].length;
  const [sx, sy] = pt(v, x, y);
  const x0 = sx - (w * PX) / 2;
  const y0 = sy - HERO.length * PX;
  return (
    <g shapeRendering="crispEdges">
      <ellipse cx={sx} cy={sy} rx={w * PX * 0.55} ry={PX * 2} fill={C.ink} opacity={0.45} />
      {pix.map((p, i) => (
        <rect key={i} x={x0 + (flip ? w - 1 - p.x : p.x) * PX} y={y0 + p.y * PX} width={PX} height={PX} fill={p.c} />
      ))}
      {lantern ? (
        <g>
          <rect x={flip ? x0 - 3 * PX : x0 + w * PX} y={y0 + 14 * PX} width={PX} height={2 * PX} fill={C.selout} />
          <rect x={flip ? x0 - 4 * PX : x0 + (w - 1) * PX} y={y0 + 16 * PX} width={3 * PX} height={4 * PX} fill={C.lantern} />
          <rect x={flip ? x0 - 4 * PX : x0 + (w - 1) * PX} y={y0 + 16 * PX} width={3 * PX} height={PX} fill={C.selout} />
        </g>
      ) : null}
    </g>
  );
};
/** Where a sprite's lantern is, in screen px (for its light). */
export const lanternAt = (v: View, x: number, y: number, flip = false): [number, number] => {
  const [sx, sy] = pt(v, x, y);
  const w = HERO[0].length;
  const x0 = sx - (w * PX) / 2;
  const y0 = sy - HERO.length * PX;
  return [flip ? x0 - 2.5 * PX : x0 + (w + 0.5) * PX, y0 + 18 * PX];
};

// ---------------------------------------------------------------- buildings and props

export type Building = { x: number; y: number; w: number; h: number; d: number; wall: "plaster" | "brick" | "wood"; roof: "slate" | "tile"; windows: [number, number][]; door?: number };
export type Light = { x: number; y: number; r: number; c: string; k?: number; seed?: number };

/** A building's front face and roof slope, windows lit by the time's warmth; returns its window lights too. */
export const house = (v: View, b: Building, time: TimeKey, t: number): { node: React.ReactNode; lights: Light[] } => {
  const [x0, yb] = pt(v, b.x, b.y, 0);
  const [, yt] = pt(v, b.x, b.y, b.h);
  const o = 14;
  const rh = b.d * 0.42;
  const roof = [pt(v, b.x - o, b.y - o * 0.5, b.h), pt(v, b.x + b.w + o, b.y - o * 0.5, b.h), pt(v, b.x + b.w + o, b.y + b.d / 2, b.h + rh), pt(v, b.x - o, b.y + b.d / 2, b.h + rh)];
  const warm = style.times[time].warm;
  const lights: Light[] = [];
  const wins = b.windows.map(([fx, fz], i) => {
    const wx = x0 + fx * b.w - 3 * PX;
    const wy = yb - fz * b.h * E.height - 4 * PX;
    const lit = warm > 0.5 || i % 2 === 0;
    const glass = lit ? mix(col("accent"), "#ffd9a0", 0.25 * (1 - warm)) : tc(col("roof-1"), time);
    if (lit && warm > 0.3) lights.push({ x: wx + 3 * PX, y: wy + 4 * PX, r: 70, c: C.fire, k: warm, seed: i + b.x });
    return (
      <g key={i}>
        <rect x={wx - PX} y={wy - PX} width={8 * PX} height={10 * PX} fill={tc(col("wood-1"), time)} />
        <rect x={wx} y={wy} width={6 * PX} height={8 * PX} fill={glass} />
        <rect x={wx + 3 * PX - PX / 2} y={wy} width={PX} height={8 * PX} fill={tc(col("wood-1"), time)} />
        <rect x={wx} y={wy + 4 * PX - PX / 2} width={6 * PX} height={PX} fill={tc(col("wood-1"), time)} />
      </g>
    );
  });
  const node = (
    <g key={`h${b.x}`} shapeRendering="crispEdges">
      <rect x={x0} y={yt} width={b.w} height={yb - yt} fill={`url(#tx-${b.wall}-${time})`} />
      <rect x={x0} y={yb - 2 * PX} width={b.w} height={2 * PX} fill={tc(col("stone-1"), time)} />
      {wins}
      {b.door !== undefined ? (
        <rect x={x0 + b.door * b.w - 4 * PX} y={yb - 16 * PX} width={8 * PX} height={16 * PX} fill={tc(col("wood-1"), time)} />
      ) : null}
      <polygon points={roof.map((p) => p.join(",")).join(" ")} fill={`url(#tx-${b.roof}-${time})`} />
      <rect x={roof[0][0]} y={roof[0][1] - PX} width={roof[1][0] - roof[0][0]} height={PX * 2} fill={C.selout} />
      <rect x={roof[3][0]} y={roof[3][1] - PX} width={roof[2][0] - roof[3][0]} height={PX} fill={mix(tc(col(b.roof === "tile" ? "tile-2" : "roof-2"), time), "#ffffff", 0.15)} />
    </g>
  );
  return { node, lights };
};

/** A street lamp: a dark post and a lamp head, lit by `k` (0..1). */
export const lamp = (v: View, x: number, y: number, k: number, time: TimeKey): { node: React.ReactNode; light: Light | null } => {
  const [sx, sy] = pt(v, x, y);
  const top = sy - 26 * PX;
  return {
    node: (
      <g key={`l${x}-${y}`} shapeRendering="crispEdges">
        <rect x={sx - PX} y={top} width={2 * PX} height={26 * PX} fill={C.selout} />
        <rect x={sx - 3 * PX} y={top - 5 * PX} width={6 * PX} height={5 * PX} fill={k > 0 ? mix(tc(col("wood-1"), time), C.lantern, k) : tc(col("wood-1"), time)} />
        <rect x={sx - 3 * PX} y={top - 6 * PX} width={6 * PX} height={PX} fill={C.selout} />
      </g>
    ),
    light: k > 0 ? { x: sx, y: top - 2.5 * PX, r: 120, c: C.lantern, k, seed: x } : null,
  };
};

/** The lighthouse: a tall plaster tower with a beacon room at the top. */
export const lighthouse = (v: View, x: number, y: number, time: TimeKey, on: number): { node: React.ReactNode; light: Light | null; beacon: [number, number] } => {
  const [sx, sy] = pt(v, x, y);
  const hgt = 620;
  const w = 15 * PX;
  const top = sy - hgt;
  return {
    node: (
      <g key="lighthouse" shapeRendering="crispEdges">
        <rect x={sx - w / 2} y={top} width={w} height={hgt} fill={`url(#tx-plaster-${time})`} />
        {[0.2, 0.45, 0.7].map((f, i) => (
          <rect key={i} x={sx - w / 2} y={top + f * hgt} width={w} height={6 * PX} fill={tc(col("tile-2"), time)} />
        ))}
        <rect x={sx - w / 2 - 2 * PX} y={top - 2 * PX} width={w + 4 * PX} height={2 * PX} fill={C.selout} />
        <rect x={sx - w / 2 + PX} y={top - 9 * PX} width={w - 2 * PX} height={7 * PX} fill={on > 0 ? C.beacon : tc(col("roof-1"), time)} />
        <polygon points={`${sx - w / 2},${top - 9 * PX} ${sx + w / 2},${top - 9 * PX} ${sx},${top - 15 * PX}`} fill={tc(col("tile-1"), time)} />
      </g>
    ),
    light: on > 0 ? { x: sx, y: top - 5.5 * PX, r: 220, c: C.beacon, k: on, seed: 9 } : null,
    beacon: [sx, top - 5.5 * PX],
  };
};

// ---------------------------------------------------------------- the set and its post chain

/** The ground slab of cobbles with a strip of harbour water at the front and the table under it. */
export const Ground: React.FC<{ v: View; time: TimeKey; back?: number }> = ({ v, time, back = 600 }) => {
  const [, yb] = pt(v, 0, back);
  const [, yw] = pt(v, 0, 110);
  return (
    <g shapeRendering="crispEdges">
      <rect x={0} y={yb} width={W} height={v.gy - yb} fill={`url(#tx-cobble-${time})`} />
      <rect x={0} y={yw} width={W} height={v.gy - yw} fill={`url(#tx-water-${time})`} />
      <rect x={0} y={yw - PX} width={W} height={2 * PX} fill={tc(col("stone-3"), time)} />
      <rect x={0} y={v.gy} width={W} height={7 * PX} fill={tc(col("wood-1"), time)} />
      <rect x={0} y={v.gy + 7 * PX} width={W} height={H} fill={mix(tc(col("wood-1"), time), C.ink, 0.5)} />
    </g>
  );
};

/** The sky dome of a time of day, from the top of the frame to `horizon`, with stars at night. */
export const Sky: React.FC<{ time: TimeKey; horizon: number }> = ({ time, horizon }) => {
  const stops = style.times[time].sky.map(([c, p]) => `${c} ${(Number(p) / 100) * horizon}px`).join(", ");
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${stops})` }} />
      {time === "night" ? (
        <svg width={W} height={horizon} style={{ position: "absolute", left: 0, top: 0 }} shapeRendering="crispEdges">
          {Array.from({ length: 60 }, (_, i) => (
            <rect key={i} x={Math.floor((rnd(i, 3) * W) / PX) * PX} y={Math.floor((rnd(i, 4) * horizon * 0.85) / PX) * PX} width={PX} height={PX} fill={i % 4 ? "#9fb2e8" : "#fff0c8"} opacity={0.4 + 0.6 * rnd(i, 5)} />
          ))}
        </svg>
      ) : null}
    </>
  );
};

/** Light: a soft additive glow per practical (bloom), breathing; plus a warm pool on the ground for lamps. */
export const Glows: React.FC<{ lights: Light[]; t: number }> = ({ lights, t }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
    <defs>
      {lights.map((l, i) => (
        <radialGradient key={i} id={`gl-${i}`}>
          <stop offset="0%" stopColor={l.c} stopOpacity={0.85} />
          <stop offset="28%" stopColor={l.c} stopOpacity={0.38} />
          <stop offset="100%" stopColor={l.c} stopOpacity={0} />
        </radialGradient>
      ))}
    </defs>
    {lights.map((l, i) => {
      const f = flicker(t, l.seed ?? i) * (l.k ?? 1) * E.bloom * 1.6;
      return <circle key={i} cx={l.x} cy={l.y} r={l.r * (0.85 + 0.15 * f)} fill={`url(#gl-${i})`} opacity={clamp(f)} />;
    })}
  </svg>
);

/**
 * The post chain: the set sharp, the same set blurred outside the tilt-shift band, fog over the far part, the lights'
 * bloom, then a vignette. `band` is the sharp band as fractions of the frame height.
 */
export const Diorama: React.FC<{ set: React.ReactNode; lights: Light[]; time: TimeKey; t: number; band?: [number, number]; fogTop: number; fogBottom: number; overlay?: React.ReactNode }> = ({
  set,
  lights,
  time,
  t,
  band = E.tiltBand as [number, number],
  fogTop,
  fogBottom,
  overlay,
}) => {
  const fog = style.times[time].fog;
  const [a, b] = band;
  const mask = `linear-gradient(to bottom, #000 0%, #000 ${(a - 0.12) * 100}%, transparent ${a * 100}%, transparent ${b * 100}%, #000 ${(b + 0.1) * 100}%, #000 100%)`;
  return (
    <>
      <AbsoluteFill>{set}</AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${E.tiltBlur}px)`, WebkitMaskImage: mask, maskImage: mask }}>{set}</AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) ${fogTop - 200}px, ${hexA(fog, style.times[time].fogAlpha)} ${fogTop}px, ${hexA(fog, 0)} ${fogBottom}px)`,
        }}
      />
      {overlay}
      <Glows lights={lights} t={t} />
    </>
  );
};
const hexA = (h: string, a: number) => {
  const [r, g, b] = rgb(h);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** The frame: waits for the fonts; the finish (vignette) on top. */
export const Frame: React.FC<{ children: React.ReactNode; dim?: number }> = ({ children, dim = 0 }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.sky0, overflow: "hidden" }}>
      {children}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(2,3,8,${dim})` }} /> : null}
      <Finish grain={0} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- type and UI

/** A gold ornament: a line with a diamond in the middle. */
export const Ornament: React.FC<{ y: number; w?: number; at?: number }> = ({ y, w = 360, at = 0 }) => {
  const p = ease("title", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <svg width={W} height={40} style={{ position: "absolute", left: 0, top: y - 20, opacity: p }}>
      <line x1={W / 2 - (w / 2) * p} y1={20} x2={W / 2 + (w / 2) * p} y2={20} stroke={C.gold} strokeWidth={2} />
      <polygon points={`${W / 2},10 ${W / 2 + 10},20 ${W / 2},30 ${W / 2 - 10},20`} fill={C.gold} />
    </svg>
  );
};

/** "CHAPTER I": Cinzel 500 capitals, wide tracking, UI gold. */
export const ChapterLabel: React.FC<{ text: string; y: number; at?: number }> = ({ text, y, at = 0 }) => {
  const p = ease("title", useSeconds() - at);
  if (p <= 0) return null;
  const T = style.type;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: DISPLAY, fontWeight: 500, fontSize: T.chapter, letterSpacing: `${T.chapterTracking}em`, marginRight: `-${T.chapterTracking}em`, color: C.gold, opacity: p }}>
      {text}
    </div>
  );
};

/** A gold title: Cinzel 700 capitals in the gold gradient with a warm glow behind; it fades up with the title ease. */
export const GoldTitle: React.FC<{ lines: string[]; size: number; y: number; at?: number }> = ({ lines, size, y, at = 0 }) => {
  const p = ease("title", useSeconds() - at);
  if (p <= 0) return null;
  const T = style.type;
  const box: React.CSSProperties = { position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: size, lineHeight: T.leading, letterSpacing: `${T.tracking}em`, marginRight: `-${T.tracking}em`, opacity: p, whiteSpace: "nowrap" };
  const grad = `linear-gradient(to bottom, ${col("title-1")} 15%, ${col("title-2")} 55%, ${col("title-3")} 90%)`;
  return (
    <>
      <div style={{ ...box, color: "transparent", textShadow: `0 0 24px rgba(255,190,110,0.55), 0 0 60px rgba(255,160,80,0.35), 0 6px 10px rgba(0,0,0,0.6)` }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div style={box}>
        {lines.map((l, i) => (
          <div key={i}>
            <span style={{ background: grad, backgroundSize: `100% ${size * T.leading}px`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{l}</span>
          </div>
        ))}
      </div>
    </>
  );
};

/** Narration: Cormorant Garamond italic 500, parchment, on a soft dark band (max 0.38) with a 10 px drop shadow. */
export const Narration: React.FC<{ lines: string[]; y?: number; at?: number; size?: number; italic?: boolean }> = ({ lines, y = style.layout.subtitleY, at = 0, size = style.type.body, italic = true }) => {
  const p = ease("subIn", useSeconds() - at);
  if (p <= 0) return null;
  const T = style.type;
  const h = lines.length * size * T.bodyLeading;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 60, height: h + 120, background: `linear-gradient(to bottom, rgba(4,6,14,0) 0%, rgba(4,6,14,${E.band * p}) 30%, rgba(4,6,14,${E.band * p}) 70%, rgba(4,6,14,0) 100%)` }} />
      <div style={{ position: "absolute", left: 72, right: 72, top: y, textAlign: "center", fontFamily: BODY, fontStyle: italic ? "italic" : "normal", fontWeight: 500, fontSize: size, lineHeight: T.bodyLeading, color: C.parchment, opacity: p, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </>
  );
};

/**
 * The dialogue box: a navy plate (rgba 14,18,34,.86 → 6,8,18,.9) with a 2 px gold border and an inner 1 px line, gold
 * diamond corners, a name plate over the top-left edge, text typed over `typeShare` of its time, and a blinking ▼.
 */
export const Dialogue: React.FC<{ name: string; text: string; at: number; dur: number }> = ({ name, text, at, dur }) => {
  const t = useSeconds() - at;
  const p = ease("plate", t);
  if (p <= 0) return null;
  const { x, y, w, h } = style.layout.dialogue;
  const T = style.type;
  const n = Math.floor(clamp((t - 0.2) / (dur * style.motion.typeShare)) * text.length);
  const done = n >= text.length;
  const caret = done && Math.floor(t * 2.5) % 2 === 0;
  const diamond = (cx: number, cy: number) => <polygon key={`${cx}-${cy}`} points={`${cx},${cy - 9} ${cx + 9},${cy} ${cx},${cy + 9} ${cx - 9},${cy}`} fill={C.gold} />;
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - p) * R.plate.distance, width: w, height: h, opacity: p }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(to bottom, rgba(14,18,34,0.86), rgba(6,8,18,0.9))", border: `2px solid rgba(214,190,130,0.9)`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", inset: 7, borderRadius: 3, border: `1px solid rgba(214,190,130,0.45)` }} />
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[diamond(0, 0), diamond(w, 0), diamond(0, h), diamond(w, h)]}
        {caret ? <polygon points={`${w - 52},${h - 42} ${w - 32},${h - 42} ${w - 42},${h - 28}`} fill={C.gold} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 34, top: -30, padding: "8px 26px 6px", borderRadius: 4, background: "rgba(10,13,26,0.95)", border: `2px solid rgba(214,190,130,0.9)`, fontFamily: BODY, fontWeight: 600, fontSize: T.name, color: C.gold2, letterSpacing: 1 }}>{name}</div>
      <div style={{ position: "absolute", left: 48, right: 64, top: 52, fontFamily: BODY, fontWeight: 500, fontSize: T.dialogue, lineHeight: T.bodyLeading, color: col("parchment-2"), whiteSpace: "pre-wrap" }}>
        <span>{text.slice(0, n)}</span>
        <span style={{ color: "transparent" }}>{text.slice(n)}</span>
      </div>
    </div>
  );
};

/** A small plate (dark translucent, gold border) for labels in the world. */
export const Plate: React.FC<{ text: string; x: number; y: number; at?: number; size?: number; italic?: boolean; align?: "left" | "center" }> = ({ text, x, y, at = 0, size = style.type.label, italic = false, align = "left" }) => {
  const p = ease("plate", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - p) * R.plate.distance,
        transform: align === "center" ? "translateX(-50%)" : undefined,
        padding: "10px 22px 8px",
        borderRadius: 4,
        background: "linear-gradient(to bottom, rgba(14,18,34,0.86), rgba(6,8,18,0.9))",
        border: `2px solid rgba(214,190,130,0.9)`,
        fontFamily: BODY,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: 600,
        fontSize: size,
        color: C.parchment,
        whiteSpace: "nowrap",
        opacity: p,
      }}
    >
      {text}
    </div>
  );
};
