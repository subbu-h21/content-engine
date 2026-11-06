/**
 * Isometric Infographic's pieces: a small true-isometric engine (axes at 30°, everything queued, depth-sorted, then
 * drawn as flat three-tone SVG shapes with no outlines), boxes, plates, cylinders, cones, gable houses, flat-disc
 * spheres, 3D polylines, billboard people, extruded floor type, thin ink label pins, the cream ground with its dot
 * lattice and the map-label caption. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, mix, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const T = style.type;
const P = style.palette;
export const col = (role: string) => color(P, role);
export type Tone = { top: string; left: string; right: string };
const tone = (name: string): Tone => ({ top: col(`${name}-top`), left: col(`${name}-left`), right: col(`${name}-right`) });
/** Three tones from one base: top toward warm white, dark side toward the cool shadow target. */
export const tri = (base: string): Tone => ({ top: mix(base, "#fff8ea", 0.2), left: base, right: mix(base, col("shadow"), 0.22) });
export const TONE = {
  red: tone("red"),
  green: tone("green"),
  blue: tone("blue"),
  cream: tone("cream"),
  soil: tone("soil"),
  mustard: tone("mustard"),
  orange: tri(col("orange-top")),
  violet: tri(col("violet-top")),
};
export const C = {
  ground: col("background"),
  card: col("surface"),
  ink: col("text"),
  soil: col("muted"),
  faint: col("faint"),
  red: col("accent"),
  blue: col("accent2"),
  shadow: col("shadow"),
};

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** The source's back ease: 1 + u²((s+1)u + s), u = p − 1. */
export const back = (p: number, s: number = R.isotype.overshoot): number => {
  const u = clamp(p) - 1;
  return 1 + u * u * ((s + 1) * u + s);
};
export const pop = (t: number): number => (t <= 0 ? 0 : back(t / R.isotype.duration));
/** Solids arrive by motion: how far above their place they are at time t after their start (world units). */
export const fall = (t: number): number => (t <= 0 ? 1e4 : (1 - ease("drop", t)) * S.motion.dropHeight);

export const COS = Math.cos(Math.PI / 6);
export type V3 = [number, number, number];
export type Item = { depth: number; node: React.ReactNode };

/** One isometric view: a place on screen (cx, cy) and a zoom k (px per world unit). */
export class Iso {
  items: Item[] = [];
  n = 0;
  constructor(
    public cx: number,
    public cy: number,
    public k = 1,
    public id = "iso",
  ) {}
  /** sx = (x − y)·cos30·k, sy = ((x + y)·½ − z)·k */
  p(x: number, y: number, z = 0): [number, number] {
    return [this.cx + (x - y) * COS * this.k, this.cy + ((x + y) / 2 - z) * this.k];
  }
  pts(list: V3[]): string {
    return list.map(([x, y, z]) => this.p(x, y, z).map((v) => v.toFixed(1)).join(",")).join(" ");
  }
  push(depth: number, node: React.ReactNode) {
    this.items.push({ depth, node });
  }
  poly(list: V3[], fill: string): React.ReactNode {
    return <polygon key={this.n++} points={this.pts(list)} fill={fill} stroke={fill} strokeWidth={0.8} strokeLinejoin="round" />;
  }
  /** A box: no outlines, three tones. */
  box(x: number, y: number, z: number, w: number, d: number, h: number, c: Tone, bias = 0) {
    const a = x + w;
    const b = y + d;
    const c2 = z + h;
    this.push(
      x + y + z + (w + d + h) / 2 + bias,
      <g key={this.n++}>
        {this.poly([[x, b, z], [a, b, z], [a, b, c2], [x, b, c2]], c.left)}
        {this.poly([[a, y, z], [a, b, z], [a, b, c2], [a, y, c2]], c.right)}
        {this.poly([[x, y, c2], [a, y, c2], [a, b, c2], [x, b, c2]], c.top)}
      </g>,
    );
  }
  /** A flat decal on a surface at height z. */
  decal(list: [number, number][], z: number, fill: string, bias = 0) {
    const cx = list.reduce((s, q) => s + q[0], 0) / list.length;
    const cy = list.reduce((s, q) => s + q[1], 0) / list.length;
    this.push(cx + cy + z + bias, this.poly(list.map(([x, y]) => [x, y, z]), fill));
  }
  /** A standing cylinder: two tones on the side, the light one on the cap. */
  cylinder(x: number, y: number, z: number, r: number, h: number, c: Tone, bias = 0) {
    const [sx, sy] = this.p(x, y, z);
    const [, ty] = this.p(x, y, z + h);
    const rx = r * 1.2247 * this.k;
    const ry = r * 0.7071 * this.k;
    const id = `${this.id}-cy${this.n++}`;
    this.push(
      x + y + z + h / 2 + bias,
      <g key={id}>
        <clipPath id={id}>
          <path d={`M ${sx - rx} ${ty} L ${sx - rx} ${sy} A ${rx} ${ry} 0 0 0 ${sx + rx} ${sy} L ${sx + rx} ${ty} Z`} />
        </clipPath>
        <g clipPath={`url(#${id})`}>
          <rect x={sx - rx} y={ty} width={rx} height={sy - ty + ry} fill={c.left} />
          <rect x={sx} y={ty} width={rx} height={sy - ty + ry} fill={c.right} />
        </g>
        <ellipse cx={sx} cy={ty} rx={rx} ry={ry} fill={c.top} />
      </g>,
    );
  }
  /** A cone: left half mid, right half dark. */
  cone(x: number, y: number, z: number, r: number, h: number, c: Tone, bias = 0) {
    const [sx, sy] = this.p(x, y, z);
    const [, ty] = this.p(x, y, z + h);
    const rx = r * 1.2247 * this.k;
    const ry = r * 0.7071 * this.k;
    this.push(
      x + y + z + h / 3 + bias,
      <g key={this.n++}>
        <path d={`M ${sx} ${ty} L ${sx - rx} ${sy} A ${rx} ${ry} 0 0 0 ${sx} ${sy + ry} Z`} fill={c.left} />
        <path d={`M ${sx} ${ty} L ${sx + rx} ${sy} A ${rx} ${ry} 0 0 1 ${sx} ${sy + ry} Z`} fill={c.right} />
      </g>,
    );
  }
  /** A flat-disc sphere: mid disc, a dark crescent away from the light, a lit cap. */
  sphere(x: number, y: number, z: number, r: number, c: Tone, bias = 0) {
    const [sx, sy] = this.p(x, y, z);
    const R0 = r * this.k;
    const id = `${this.id}-sp${this.n++}`;
    this.push(
      x + y + z + bias,
      <g key={id}>
        <clipPath id={id}>
          <circle cx={sx} cy={sy} r={R0} />
        </clipPath>
        <circle cx={sx} cy={sy} r={R0} fill={c.right} />
        <g clipPath={`url(#${id})`}>
          <circle cx={sx - R0 * 0.2} cy={sy - R0 * 0.16} r={R0 * 1.02} fill={c.left} />
          <circle cx={sx - R0 * 0.42} cy={sy - R0 * 0.42} r={R0 * 0.72} fill={c.top} />
        </g>
      </g>,
    );
  }
  /** A gable house: box, ridge along x. */
  house(x: number, y: number, w: number, d: number, h: number, roofH: number, wall: Tone, roof: Tone, z = 0, bias = 0) {
    this.box(x, y, z, w, d, h, wall, bias);
    const a = x + w;
    const m = y + d / 2;
    const b = y + d;
    const top = z + h;
    const ov = 3;
    this.push(
      x + y + z + (w + d) / 2 + h + roofH / 2 + 1 + bias,
      <g key={this.n++}>
        {this.poly([[a, y, top], [a, b, top], [a, m, top + roofH]], wall.right)}
        {this.poly([[x - ov, m, top + roofH], [a + ov, m, top + roofH], [a + ov, b + ov, top], [x - ov, b + ov, top]], roof.left)}
        {this.poly([[x - ov, y - ov, top], [a + ov, y - ov, top], [a + ov, m, top + roofH], [x - ov, m, top + roofH]], roof.top)}
      </g>,
    );
  }
  /** A tree: a short trunk and a cone. */
  tree(x: number, y: number, s: number, z = 0, bias = 0) {
    this.cylinder(x, y, z, 3 * s, 10 * s, TONE.soil, bias);
    this.cone(x, y, z + 9 * s, 13 * s, 40 * s, TONE.green, bias + 1);
  }
  /** A 3D polyline up to `p` (0..1) of its length, as a flat band with an arrow head. */
  line(pts: V3[], width: number, fill: string, p = 1, head = true, bias = 0) {
    if (p <= 0) return;
    const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2]));
    const total = seg.reduce((a, b) => a + b, 0) || 1;
    let left = total * p;
    const drawn: V3[] = [pts[0]];
    for (let i = 0; i < seg.length; i++) {
      if (left <= 0) break;
      const f = seg[i] > 0 ? Math.min(1, left / seg[i]) : 1;
      drawn.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * f]);
      left -= seg[i];
    }
    const scr = drawn.map(([x, y, z]) => this.p(x, y, z));
    const last = scr[scr.length - 1];
    const prev = scr[scr.length - 2];
    const dx = last[0] - prev[0];
    const dy = last[1] - prev[1];
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const w = width * this.k;
    const mid = drawn[Math.floor(drawn.length / 2)];
    const tipLen = head ? w * 2.2 : 0;
    const body = [...scr.slice(0, -1), [last[0] - ux * tipLen, last[1] - uy * tipLen]];
    this.push(
      mid[0] + mid[1] + mid[2] + bias,
      <g key={this.n++}>
        <polyline points={body.map((q) => q.join(",")).join(" ")} fill="none" stroke={fill} strokeWidth={w} strokeLinecap={head ? "butt" : "round"} strokeLinejoin="round" />
        {head ? (
          <polygon
            points={`${last[0]},${last[1]} ${last[0] - ux * tipLen - uy * w * 1.15},${last[1] - uy * tipLen + ux * w * 1.15} ${last[0] - ux * tipLen + uy * w * 1.15},${last[1] - uy * tipLen - ux * w * 1.15}`}
            fill={fill}
          />
        ) : null}
      </g>,
    );
  }
  /** A person billboard: round head, tapered two-tone body, a thick arm, no face. */
  person(x: number, y: number, s: number, shirt: Tone, opts: { z?: number; armUp?: boolean; bias?: number } = {}) {
    const { z = 0, armUp = false, bias = 2 } = opts;
    const [sx, sy] = this.p(x, y, z);
    const u = s * this.k;
    this.push(
      x + y + z + bias,
      <g key={this.n++}>
        <path d={`M ${sx - 10 * u} ${sy - 26 * u} L ${sx + 10 * u} ${sy - 26 * u} L ${sx + 7 * u} ${sy} L ${sx - 7 * u} ${sy} Z`} fill={shirt.left} />
        <path d={`M ${sx} ${sy - 26 * u} L ${sx + 10 * u} ${sy - 26 * u} L ${sx + 7 * u} ${sy} L ${sx} ${sy} Z`} fill={shirt.right} />
        <circle cx={sx} cy={sy - 35 * u} r={7.5 * u} fill={TONE.soil.right} />
        <line x1={sx + 9 * u} y1={sy - 24 * u} x2={armUp ? sx + 20 * u : sx + 13 * u} y2={armUp ? sy - 42 * u : sy - 9 * u} stroke={shirt.left} strokeWidth={5 * u} strokeLinecap="round" />
      </g>,
    );
  }
  /** A flat isometric cloud: stacked ellipses in cream tones. */
  cloud(x: number, y: number, z: number, s: number) {
    const [sx, sy] = this.p(x, y, z);
    const u = s * this.k;
    const lobes: [number, number, number][] = [
      [-36, 2, 22],
      [-8, -7, 28],
      [26, 0, 24],
      [50, 6, 15],
    ];
    this.push(
      x + y + z,
      <g key={this.n++}>
        {lobes.map(([a, b, r], i) => (
          <ellipse key={`d${i}`} cx={sx + a * u} cy={sy + (b + 8) * u} rx={r * 1.25 * u} ry={r * 0.72 * u} fill={TONE.cream.right} />
        ))}
        {lobes.map(([a, b, r], i) => (
          <ellipse key={`l${i}`} cx={sx + a * u} cy={sy + b * u} rx={r * 1.25 * u} ry={r * 0.72 * u} fill={TONE.cream.top} />
        ))}
      </g>,
    );
  }
  /** Type lying on a plane at height z, reading up-right along −y, extruded `h` px down. */
  floorText(text: string, x: number, y: number, z: number, size: number, face: string, side: string, h = 0) {
    const [sx, sy] = this.p(x, y, z);
    const k = this.k;
    const m = (dy: number) => `matrix(${COS * k} ${-0.5 * k} ${COS * k} ${0.5 * k} ${sx} ${sy + dy})`;
    const common = { fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: size * 0.01 } as const;
    this.push(
      1e5 + x + y + z,
      <g key={this.n++}>
        {Array.from({ length: Math.ceil(h) }, (_, i) => (
          <text key={i} transform={m(h - i)} {...common} fill={side}>
            {text}
          </text>
        ))}
        <text transform={m(0)} {...common} fill={face}>
          {text}
        </text>
      </g>,
    );
  }
  /** The depth-sorted drawing. */
  draw(): React.ReactNode {
    return (
      <>
        {[...this.items]
          .sort((a, b) => a.depth - b.depth)
          .map((it, i) => (
            <React.Fragment key={i}>{it.node}</React.Fragment>
          ))}
      </>
    );
  }
}

/** A floating board: a top surface over soil strata (a is along x, b along y). */
export const board = (iso: Iso, a: number, b: number, top: Tone = TONE.green, z = 0) => {
  const [s1, s2] = E.strata;
  iso.box(0, 0, z - s1 - s2, a, b, s2, { top: TONE.soil.top, left: TONE.soil.right, right: mix(TONE.soil.right, C.shadow, 0.3) }, -1e5);
  iso.box(0, 0, z - s1, a, b, s1, TONE.soil, -1e5 + 1);
  iso.decal([[0, 0], [a, 0], [a, b], [0, b]], z, top.top, -1e5 + 2);
};

/** The board's soft shadow on the ground, drawn before the view. */
export const BoardShadow: React.FC<{ iso: Iso; a: number; b: number; depth?: number }> = ({ iso, a, b, depth = E.shadow.drop }) => {
  const q = (x: number, y: number) => {
    const [sx, sy] = iso.p(x, y, 0);
    return `${sx},${sy + depth * iso.k}`;
  };
  return (
    <>
      <filter id={`${iso.id}-sh`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        <feGaussianBlur stdDeviation={E.shadow.blur} />
      </filter>
      <polygon points={`${q(0, 0)} ${q(a, 0)} ${q(a, b)} ${q(0, b)}`} fill={C.shadow} opacity={E.shadow.alpha} filter={`url(#${iso.id}-sh)`} />
    </>
  );
};

/** Label text with the ground-colour halo so it reads over any block. */
export const Txt: React.FC<{ x: number; y: number; size?: number; weight?: number; fill?: string; anchor?: "start" | "middle" | "end"; track?: number; children: React.ReactNode; opacity?: number }> = ({
  x,
  y,
  size = T.label,
  weight = 600,
  fill = C.ink,
  anchor = "start",
  track = T.tracking,
  children,
  opacity = 1,
}) => (
  <text
    x={x}
    y={y}
    fontFamily={SANS}
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    textAnchor={anchor}
    letterSpacing={size * track}
    stroke={C.ground}
    strokeWidth={T.halo * 2}
    strokeLinejoin="round"
    opacity={opacity}
    style={{ paintOrder: "stroke" }}
  >
    {children}
  </text>
);

/** Label pin: ringed dot → vertical leader → horizontal rule → text above the rule. The leader grows first. */
export const Pin: React.FC<{ from: [number, number]; rise: number; run: number; lines: string[]; t: number; at: number; size?: number; second?: string }> = ({
  from,
  rise,
  run: rule,
  lines,
  t,
  at,
  size = T.label,
  second,
}) => {
  const p = ease("leader", t - at);
  if (p <= 0) return null;
  const [x, y] = from;
  const up = clamp(p * 1.7);
  const out = clamp(p * 1.7 - 0.7);
  const ty = y - rise;
  const ex = x + rule * out;
  const a = clamp((t - at - 0.2) / 0.15);
  const anchor = rule >= 0 ? "start" : "end";
  const tx = rule >= 0 ? x + 6 : x - 6;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - rise * up} stroke={C.ink} strokeWidth={E.line} />
      <line x1={x} y1={ty} x2={ex} y2={ty} stroke={C.ink} strokeWidth={E.line} />
      <circle cx={x} cy={y} r={E.pinRing} fill={C.card} stroke={C.ink} strokeWidth={E.line} />
      {lines.map((l, i) => (
        <Txt key={i} x={tx} y={ty - 14 - (lines.length - 1 - i) * size * 1.18} size={size} anchor={anchor} opacity={a}>
          {l}
        </Txt>
      ))}
      {second ? (
        <Txt x={tx} y={ty + T.note + 12} size={T.note} weight={500} fill={C.soil} anchor={anchor} track={0.04} opacity={a}>
          {second}
        </Txt>
      ) : null}
    </g>
  );
};

/** Map-label caption: cream card, 10 px radius, ink border, a tiny red cube as legend chip; the border draws, the text wipes on. */
export const Caption: React.FC<{ text: string; t: number; at: number; size?: number }> = ({ text, t, at, size = T.body }) => {
  const b = ease("card", t - at);
  if (b <= 0) return null;
  const w = clamp((t - at - 0.2) / 0.5);
  const { y, height, radius } = style.layout.caption;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: y - height / 2,
        height,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 34px",
        backgroundColor: C.card,
        border: `3px solid ${C.ink}`,
        borderRadius: radius,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        color: C.ink,
        whiteSpace: "nowrap",
        opacity: b,
      }}
    >
      <svg width={36} height={40} viewBox="-18 -20 36 40" style={{ flex: "none" }}>
        <polygon points="0,-18 15.6,-9 0,0 -15.6,-9" fill={TONE.red.top} />
        <polygon points="-15.6,-9 0,0 0,18 -15.6,9" fill={TONE.red.left} />
        <polygon points="15.6,-9 0,0 0,18 15.6,9" fill={TONE.red.right} />
      </svg>
      <span style={{ clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{text}</span>
    </div>
  );
};

/** The cream ground with its faint isometric dot lattice. Waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const g = style.layout.lattice;
  const w = g * 2 * COS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <pattern id="ii-dots" width={w} height={g} patternUnits="userSpaceOnUse">
            <circle cx={w / 4} cy={g / 4} r={2.4} fill={C.faint} />
            <circle cx={(w * 3) / 4} cy={(g * 3) / 4} r={2.4} fill={C.faint} />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#ii-dots)" />
      </svg>
      {children}
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

export const useT = useSeconds;
