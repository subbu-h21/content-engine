/**
 * Isometric Picture Book's pieces: one full-bleed true-isometric ground in metres (axes at 30°, painter's sort by floor
 * footprint), slab joints, flat markings, lanes and arrows on the floor, three-tone solids with no outlines, faceless
 * people seen from behind, benches with seated people, serif type lying on the floor and landing character by
 * character from a pale ghost to ink, and the pale caption bar. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const T = style.type;
const P = style.palette;
const col = (r: string) => color(P, r);
export const C = {
  paper: col("background"),
  light: col("surface"),
  ink: col("text"),
  soft: col("muted"),
  ghost: col("faint"),
  accent: col("accent"),
  tint: col("accent-tint"),
  blue: col("accent2"),
  blue2: col("subject-2"),
  blue3: col("subject-3"),
  ginger: col("marking"),
  joint: col("joint"),
  concrete: col("concrete"),
  hair: col("hair"),
  skin: col("skin"),
  shoes: col("shoes"),
  sage: col("sage"),
  barText: col("bar-text"),
};
export const TOPS = [1, 2, 3, 4].map((i) => col(`top-${i}`));
export const LEGS = [1, 2, 3, 4].map((i) => col(`legs-${i}`));
export type Tone = { top: string; left: string; right: string };
/** Three tones from one base: top lifted to paper, +y face the base, +x face dropped to warm umber. */
export const tri = (base: string): Tone => ({ top: mix(base, col("lift"), E.lift), left: base, right: mix(base, col("drop"), E.drop) });

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const COS = Math.cos(Math.PI / 6);
export const useT = useSeconds;

export type XY = [number, number];

export class Place {
  items: { depth: number; node: React.ReactNode }[] = [];
  floor: React.ReactNode[] = [];
  n = 0;
  k: number;
  constructor(
    public cx: number,
    public cy: number,
    k: number = style.layout.k,
  ) {
    this.k = k;
  }
  p(x: number, y: number, z = 0): XY {
    return [this.cx + (x - y) * COS * this.k, this.cy + ((x + y) / 2 - z) * this.k];
  }
  /** The floor point under a place on screen. */
  at(sx: number, sy: number): XY {
    const d = (sx - this.cx) / (COS * this.k);
    const u = (2 * (sy - this.cy)) / this.k;
    return [(u + d) / 2, (u - d) / 2];
  }
  str(pts: [number, number, number?][]): string {
    return pts.map(([x, y, z]) => this.p(x, y, z ?? 0).map((v) => v.toFixed(1)).join(",")).join(" ");
  }
  poly(pts: [number, number, number?][], fill: string) {
    return <polygon key={this.n++} points={this.str(pts)} fill={fill} stroke={fill} strokeWidth={0.8} strokeLinejoin="round" />;
  }
  /** A flat mark on the floor (drawn under everything raised). */
  mark(pts: XY[], fill: string) {
    this.floor.push(this.poly(pts, fill));
  }
  /** A lane along a polyline of floor points, up to p (0..1) of its length. */
  lane(path: XY[], w: number, fill: string, p = 1) {
    if (p <= 0) return;
    const seg = path.slice(1).map((q, i) => Math.hypot(q[0] - path[i][0], q[1] - path[i][1]));
    let left = seg.reduce((a, b) => a + b, 0) * p;
    for (let i = 0; i < seg.length && left > 0; i++) {
      const [ax, ay] = path[i];
      const [bx, by] = path[i + 1];
      const f = seg[i] > 0 ? Math.min(1, left / seg[i]) : 1;
      left -= seg[i];
      const ex = lerp(ax, bx, f);
      const ey = lerp(ay, by, f);
      const L = Math.hypot(ex - ax, ey - ay) || 1;
      const nx = (-(ey - ay) / L) * (w / 2);
      const ny = ((ex - ax) / L) * (w / 2);
      const ux = ((ex - ax) / L) * (w / 2);
      const uy = ((ey - ay) / L) * (w / 2);
      // run half a width past each joint so right-angle turns close
      const end = i < seg.length - 1 && f >= 1 ? 1 : 0;
      this.mark([[ax + nx, ay + ny], [ex + nx + ux * end, ey + ny + uy * end], [ex - nx + ux * end, ey - ny + uy * end], [ax - nx, ay - ny]], fill);
    }
  }
  /** A flat arrow on the floor from a to b, growing ahead of whatever follows it. */
  arrow(a: XY, b: XY, fill: string, p = 1, w: number = E.lane) {
    if (p <= 0) return;
    const ex = lerp(a[0], b[0], p);
    const ey = lerp(a[1], b[1], p);
    const L = Math.hypot(ex - a[0], ey - a[1]) || 1;
    const ux = (ex - a[0]) / L;
    const uy = (ey - a[1]) / L;
    const h = E.arrow;
    const bx = ex - ux * h * 1.3;
    const by = ey - uy * h * 1.3;
    this.lane([a, [bx, by]], w, fill);
    this.mark([[ex, ey], [bx - uy * h, by + ux * h], [bx + uy * h, by - ux * h]], fill);
  }
  /** A rectangular outline on the floor ("stand here"). */
  outline(x: number, y: number, w: number, d: number, fill: string) {
    const o = E.outline;
    this.mark([[x, y], [x + w, y], [x + w, y + o], [x, y + o]], fill);
    this.mark([[x, y + d - o], [x + w, y + d - o], [x + w, y + d], [x, y + d]], fill);
    this.mark([[x, y], [x + o, y], [x + o, y + d], [x, y + d]], fill);
    this.mark([[x + w - o, y], [x + w, y], [x + w, y + d], [x + w - o, y + d]], fill);
  }
  /** A solid box. */
  box(x: number, y: number, z: number, w: number, d: number, h: number, c: Tone, bias = 0) {
    const a = x + w;
    const b = y + d;
    const u = z + h;
    this.items.push({
      depth: x + w / 2 + y + d / 2 + bias,
      node: (
        <g key={this.n++}>
          {this.poly([[x, b, z], [a, b, z], [a, b, u], [x, b, u]], c.left)}
          {this.poly([[a, y, z], [a, b, z], [a, b, u], [a, y, u]], c.right)}
          {this.poly([[x, y, u], [a, y, u], [a, b, u], [x, b, u]], c.top)}
        </g>
      ),
    });
  }
  /** A faceted ball: a many-sided disc cut into three flat tones (no highlight spot, no gradient). */
  ball(x: number, y: number, z: number, r: number, c: Tone, bias = 0) {
    const [sx, sy] = this.p(x, y, z);
    const R0 = r * this.k;
    const ring = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
      return [sx + R0 * Math.cos(a), sy + R0 * Math.sin(a)];
    });
    const pts = (l: number[][]) => l.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ");
    const mid = [sx, sy + R0 * 0.05];
    this.items.push({
      depth: x + y + bias,
      node: (
        <g key={this.n++}>
          <polygon points={pts(ring)} fill={c.left} stroke={c.left} strokeWidth={0.8} />
          <polygon points={pts([mid, ...ring.slice(0, 5)])} fill={c.right} stroke={c.right} strokeWidth={0.8} />
          <polygon points={pts([mid, ...ring.slice(6, 12)])} fill={c.top} stroke={c.top} strokeWidth={0.8} />
        </g>
      ),
    });
  }
  /** A person from behind: feet at (x, y), `look` toward up-left (−1) or up-right (1); `step` 0 stands, else scissors the legs. */
  person(x: number, y: number, top: string, legs: string, look: -1 | 1 = 1, step = 0, bias = 0) {
    const [sx, sy] = this.p(x, y);
    const u = (E.person.height * this.k) / 17; // the figure is 17 units tall
    const sw = Math.sin(step) * 1.5 * (step === 0 ? 0 : 1);
    const dark = mix(top, col("drop"), E.drop);
    this.items.push({
      depth: x + y + 0.3 + bias,
      node: (
        <g key={this.n++}>
          <path d={`M ${sx - 1.7 * u + sw * u} ${sy} L ${sx - 1.7 * u + sw * u} ${sy - 7 * u} L ${sx - 0.1 * u} ${sy - 7 * u} L ${sx - 0.25 * u + sw * u} ${sy} Z`} fill={legs} />
          <path d={`M ${sx + 1.7 * u - sw * u} ${sy} L ${sx + 1.7 * u - sw * u} ${sy - 7 * u} L ${sx + 0.1 * u} ${sy - 7 * u} L ${sx + 0.25 * u - sw * u} ${sy} Z`} fill={mix(legs, col("drop"), 0.2)} />
          <ellipse cx={sx - 1 * u + sw * u} cy={sy + 0.1 * u} rx={1.2 * u} ry={0.55 * u} fill={C.shoes} />
          <ellipse cx={sx + 1 * u - sw * u} cy={sy + 0.1 * u} rx={1.2 * u} ry={0.55 * u} fill={C.shoes} />
          <path d={`M ${sx - 2.5 * u} ${sy - 13.2 * u} Q ${sx} ${sy - 14.4 * u} ${sx + 2.5 * u} ${sy - 13.2 * u} L ${sx + 2 * u} ${sy - 6.2 * u} L ${sx - 2 * u} ${sy - 6.2 * u} Z`} fill={top} />
          <path d={`M ${sx} ${sy - 13.9 * u} Q ${sx + 1.5 * u} ${sy - 13.8 * u} ${sx + 2.5 * u} ${sy - 13.2 * u} L ${sx + 2 * u} ${sy - 6.2 * u} L ${sx} ${sy - 6.2 * u} Z`} fill={dark} />
          <ellipse cx={sx + look * 1.25 * u} cy={sy - 15 * u} rx={0.3 * u} ry={0.5 * u} fill={C.skin} />
          <circle cx={sx} cy={sy - 15.3 * u} r={1.45 * u} fill={C.hair} />
        </g>
      ),
    });
  }
  /** A bench along y with a low back on its −x side (so sitters are seen from behind). */
  bench(x: number, y: number, len: number, c: Tone) {
    this.box(x, y, 0.32, 0.5, len, 0.1, c);
    this.box(x + 0.06, y + 0.1, 0, 0.36, 0.1, 0.32, tri(C.soft));
    this.box(x + 0.06, y + len - 0.2, 0, 0.36, 0.1, 0.32, tri(C.soft));
    this.box(x + 0.5, y, 0.32, 0.08, len, 0.42, c, 0.5);
  }
  /** A seated person from behind: shoulders and the back of the head over the low seat back. */
  seated(x: number, y: number, top: string, look: -1 | 1 = 1) {
    const [sx, sy] = this.p(x + 0.25, y, 0.42);
    const u = (E.person.height * this.k) / 17;
    const dark = mix(top, col("drop"), E.drop);
    this.items.push({
      depth: x + 0.5 + y + 0.4,
      node: (
        <g key={this.n++}>
          <path d={`M ${sx - 2.5 * u} ${sy - 6.2 * u} Q ${sx} ${sy - 7.4 * u} ${sx + 2.5 * u} ${sy - 6.2 * u} L ${sx + 2.2 * u} ${sy} L ${sx - 2.2 * u} ${sy} Z`} fill={top} />
          <path d={`M ${sx} ${sy - 6.9 * u} Q ${sx + 1.5 * u} ${sy - 6.8 * u} ${sx + 2.5 * u} ${sy - 6.2 * u} L ${sx + 2.2 * u} ${sy} L ${sx} ${sy} Z`} fill={dark} />
          <ellipse cx={sx + look * 1.25 * u} cy={sy - 8 * u} rx={0.3 * u} ry={0.5 * u} fill={C.skin} />
          <circle cx={sx} cy={sy - 8.3 * u} r={1.45 * u} fill={C.hair} />
        </g>
      ),
    });
  }
  /** Floor type reading up-right along −y; characters land one by one (ghost → ink, 1.22 → 1). `key` marks the accent character. */
  word(text: string, x: number, y: number, size: number, t: number, at: number, opts: { weight?: number; accent?: number; fill?: string } = {}): number {
    const { weight = 700, accent = -1, fill = C.ink } = opts;
    const [sx, sy] = this.p(x, y);
    const chars = [...text];
    const every = S.motion.charEvery;
    this.floor.push(
      <text key={this.n++} transform={`matrix(${COS} -0.5 ${COS} 0.5 ${sx} ${sy})`} fontFamily={SERIF} fontWeight={weight} fontSize={size}>
        {chars.map((c, i) => {
          const u = t - at - i * every;
          const a = ease("char", u);
          const g = ease("ink", u - 0.1);
          const target = i === accent ? C.accent : fill;
          return (
            <tspan key={i} fill={mix(C.ghost, target, g)} opacity={clamp(a)} fontSize={size * lerp(R.char.from, 1, a)}>
              {c}
            </tspan>
          );
        })}
      </text>,
    );
    return at + chars.length * every;
  }
  /** The same, placed by where its baseline starts on screen. */
  wordAt(text: string, sx: number, sy: number, size: number, t: number, at: number, opts: { weight?: number; accent?: number; fill?: string } = {}): number {
    const [x, y] = this.at(sx, sy);
    return this.word(text, x, y, size, t, at, opts);
  }
  /** Slab joints across the frame, then floor marks, then everything raised in painter's order. */
  draw(): React.ReactNode {
    const g = style.layout.slab;
    const span = 24;
    const lines: React.ReactNode[] = [];
    for (let i = -span; i <= span; i += g) {
      const a = this.p(i, -span);
      const b = this.p(i, span);
      const c = this.p(-span, i);
      const d = this.p(span, i);
      lines.push(<line key={`a${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.joint} strokeWidth={1.6} />);
      lines.push(<line key={`b${i}`} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke={C.joint} strokeWidth={1.6} />);
    }
    return (
      <>
        {lines}
        {this.floor}
        {[...this.items].sort((p, q) => p.depth - q.depth).map((it, i) => (
          <React.Fragment key={i}>{it.node}</React.Fragment>
        ))}
      </>
    );
  }
}

/** The pale caption bar: one cue at a time, a hard switch. */
export const Bar: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  if (t < at) return null;
  const { y, pad, radius, alpha } = style.layout.bar;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: "translate(-50%, -50%)",
        padding: `${pad * 0.55}px ${pad * 1.6}px`,
        borderRadius: radius,
        backgroundColor: `rgba(250,245,236,${alpha})`,
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: T.body,
        color: C.barText,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** The paper ground runs off every edge: no board, no frame line, no vignette. Waits for the fonts. */
export const Ground: React.FC<{ place: Place; children?: React.ReactNode; over?: React.ReactNode }> = ({ place, children, over }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {place.draw()}
        {over}
      </svg>
      {children}
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};
