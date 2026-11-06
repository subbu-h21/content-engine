/**
 * Halftone Collage's pieces: the flat paper field (fibre, grain, print flicker), halftone cut-outs drawn in SVG (a dot
 * screen at 45° whose dot size follows a tone function, clipped to the shape, on newsprint with a cream keyline and a
 * soft drop shadow), cardstock shapes, printed word strips with scissor-cut edges, pieces that slide in on twos and
 * snap into place, and depth layers for the endless zoom. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  red: color(P, "background"),
  mustard: color(P, "fieldMustard"),
  teal: color(P, "fieldTeal"),
  purple: color(P, "fieldPurple"),
  green: color(P, "fieldGreen"),
  orange: color(P, "fieldOrange"),
  paper: color(P, "surface"),
  ink: color(P, "text"),
  keyline: color(P, "keyline"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  cyan: color(P, "accent"),
  yellow: color(P, "accent2"),
  cardRed: color(P, "cardRed"),
  cardOrange: color(P, "cardOrange"),
  cardPurple: color(P, "cardPurple"),
  cream: color(P, "cardCream"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** Time on twos: the cut-outs move 12 times a second, like stop-motion. */
export const useTwos = (): number => {
  const t = useSeconds();
  return Math.floor(t * S.motion.twos) / S.motion.twos;
};

/** A small deterministic hash in [0, 1). */
export const hash = (x: number, y: number, s = 0): number => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + s * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

/** The flat paper field: fibre texture, film grain, a faint print flicker, a vignette. */
export const Ground: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const flick = (hash(step, 3) - 0.5) * 2 * E.flicker;
  return (
    <AbsoluteFill style={{ backgroundColor: field, overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply", opacity: E.fibre }}>
        <filter id="hc-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.32" numOctaves={3} seed={4} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#hc-fibre)" />
      </svg>
      {children}
      <AbsoluteFill style={{ backgroundColor: flick > 0 ? "#ffffff" : "#000000", opacity: Math.abs(flick), pointerEvents: "none" }} />
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * A piece that slides in from off the frame on twos and snaps into place (a slight overshoot), then holds dead
 * still. `from` is the direction it comes from.
 */
export const Piece: React.FC<{ x: number; y: number; at: number; from?: "left" | "right" | "top" | "bottom"; rot?: number; children: React.ReactNode; z?: number }> = ({ x, y, at, from = "left", rot = 0, children, z }) => {
  const t = useTwos() - at;
  if (t < 0) return null;
  const p = ease("slide", t);
  const d = 1300;
  const [vx, vy] = from === "left" ? [-1, 0] : from === "right" ? [1, 0] : from === "top" ? [0, -1] : [0, 1];
  const dx = vx * d * (1 - p);
  const dy = vy * d * (1 - p);
  const r = rot + (1 - p) * 8 * (from === "left" || from === "bottom" ? -1 : 1);
  return <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${r}deg)` }}>{children}</div>;
};

/** A primitive of a cut-out's silhouette. */
export type Prim = { type: "circle"; cx: number; cy: number; r: number } | { type: "path"; d: string };
const prim = (p: Prim, props: React.SVGProps<SVGCircleElement & SVGPathElement>, key: React.Key) =>
  p.type === "circle" ? <circle key={key} cx={p.cx} cy={p.cy} r={p.r} {...(props as React.SVGProps<SVGCircleElement>)} /> : <path key={key} d={p.d} {...(props as React.SVGProps<SVGPathElement>)} />;

/** The halftone dot screen for a tone function (0 = paper, 1 = solid ink); null = outside. */
export const dots = (w: number, h: number, tone: (x: number, y: number) => number | null, pitch = E.halftone.pitch, angle = E.halftone.angle): [number, number, number][] => {
  const out: [number, number, number][] = [];
  const a = (angle * Math.PI) / 180;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  const [cx, cy] = [w / 2, h / 2];
  const rr = Math.hypot(w, h) / 2 + pitch;
  for (let u = -rr; u <= rr; u += pitch)
    for (let v = -rr; v <= rr; v += pitch) {
      const x = cx + u * ca - v * sa;
      const y = cy + u * sa + v * ca;
      if (x < -pitch || y < -pitch || x > w + pitch || y > h + pitch) continue;
      const d = tone(x, y);
      if (d === null || d < E.halftone.min) continue;
      out.push([x, y, 0.5 * pitch * Math.sqrt(Math.min(1, d)) * E.halftone.gain]);
    }
  return out;
};

/** Shading of a sphere lit from the upper left (0 bright → 1 dark), with a little photographic noise. */
export const sphereTone = (cx: number, cy: number, r: number, base = 0.08, gain = 0.82) => (x: number, y: number): number | null => {
  const nx = (x - cx) / r;
  const ny = (y - cy) / r;
  const q = nx * nx + ny * ny;
  if (q > 1) return null;
  const nz = Math.sqrt(1 - q);
  const lam = Math.max(0, -0.5 * nx - 0.58 * ny + 0.64 * nz);
  return clamp(base + gain * (1 - lam) + (hash(x, y) - 0.5) * 0.08);
};

let uid = 0;
/** A halftone cut-out: newsprint (or cardstock) silhouette, cream keyline, soft shadow, and the dot screen inside. */
export const Cutout: React.FC<{ w: number; h: number; shape: Prim[]; tone: (x: number, y: number) => number | null; paper?: string; ink?: string; inkOpacity?: number; keyline?: number; extra?: React.ReactNode }> = ({
  w,
  h,
  shape,
  tone,
  paper = C.paper,
  ink = C.ink,
  inkOpacity = 1,
  keyline = E.keyline,
  extra,
}) => {
  const [id] = React.useState(() => `hc${uid++}`);
  const pad = keyline + 30;
  const ds = dots(w, h, tone);
  const sh = E.shadow;
  return (
    <svg width={w + pad * 2} height={h + pad * 2} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}-clip`}>{shape.map((p, i) => prim(p, {}, i))}</clipPath>
        <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={sh.dx} dy={sh.dy} stdDeviation={sh.blur} floodColor="#000" floodOpacity={sh.opacity} />
        </filter>
      </defs>
      <g transform={`translate(${pad} ${pad})`}>
        <g filter={`url(#${id}-sh)`}>
          {shape.map((p, i) => prim(p, { fill: C.keyline, stroke: C.keyline, strokeWidth: keyline * 2, strokeLinejoin: "round" }, `k${i}`))}
        </g>
        {shape.map((p, i) => prim(p, { fill: paper }, `p${i}`))}
        <g clipPath={`url(#${id}-clip)`} fill={ink} opacity={inkOpacity}>
          {ds.map(([x, y, r], i) => (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r.toFixed(2)} />
          ))}
          {extra}
        </g>
      </g>
    </svg>
  );
};

/** A flat cardstock shape (no dots): keyline, shadow, colour. */
export const Card: React.FC<{ w: number; h: number; shape: Prim[]; fill: string; keyline?: number }> = ({ w, h, shape, fill, keyline = E.keyline * 0.6 }) => {
  const [id] = React.useState(() => `hcc${uid++}`);
  const pad = keyline + 30;
  const sh = E.shadow;
  return (
    <svg width={w + pad * 2} height={h + pad * 2} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={sh.dx * 0.7} dy={sh.dy * 0.7} stdDeviation={sh.blur * 0.8} floodColor="#000" floodOpacity={sh.opacity} />
        </filter>
      </defs>
      <g transform={`translate(${pad} ${pad})`}>
        <g filter={`url(#${id}-sh)`}>{shape.map((p, i) => prim(p, { fill: C.keyline, stroke: C.keyline, strokeWidth: keyline * 2, strokeLinejoin: "round" }, `k${i}`))}</g>
        {shape.map((p, i) => prim(p, { fill }, `f${i}`))}
      </g>
    </svg>
  );
};

/** Scissor-cut edges: a polygon with slightly uneven corners (seeded). */
const cut = (seed: number): string => {
  const j = (k: number, s: number) => (hash(seed, k) - 0.5) * s;
  return `polygon(${j(1, 1.6)}% ${j(2, 10)}%, ${100 + j(3, 1.6)}% ${j(4, 10)}%, ${100 + j(5, 1.6)}% ${100 + j(6, 10)}%, ${j(7, 1.6)}% ${100 + j(8, 10)}%)`;
};

/** A printed word strip: newsprint (or cardstock) with ink type, a cream keyline, a soft shadow. */
export const Strip: React.FC<{ text: string; size?: number; paper?: string; ink?: string; seed?: number; weight?: number; tracking?: number }> = ({ text, size = T.display, paper = C.paper, ink = C.ink, seed = 1, weight = 800, tracking = T.tracking }) => {
  const k = E.keyline * 0.7;
  const s = E.shadow;
  const clip = cut(seed);
  return (
    <div style={{ filter: `drop-shadow(${s.dx}px ${s.dy}px ${s.blur}px rgba(0,0,0,${s.opacity}))` }}>
      <div style={{ background: C.keyline, clipPath: clip, padding: k }}>
        <div
          style={{
            background: paper,
            clipPath: clip,
            padding: `${size * E.strip.padY}px ${size * E.strip.padX}px`,
            fontFamily: DISPLAY,
            fontWeight: weight,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: `${tracking}em`,
            textTransform: "uppercase",
            color: ink,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** A small label strip (Libre Franklin 600, 30 px). */
export const Label: React.FC<{ text: string; seed?: number; paper?: string; ink?: string }> = ({ text, seed = 7, paper = C.paper, ink = C.ink }) => (
  <Strip text={text} size={T.label} weight={600} tracking={T.labelTracking} seed={seed} paper={paper} ink={ink} />
);

/** A depth layer of the endless zoom: scaled by camera^Z around the frame's centre (constant-speed exponential zoom). */
export const ZoomLayer: React.FC<{ z: number; children: React.ReactNode; origin?: [number, number] }> = ({ z, children, origin = [W / 2, H / 2] }) => {
  const t = useTwos();
  const cam = Math.exp(S.motion.zoomRate * ease("zoom", t) * S.motion.recipes.zoom.duration);
  const s = Math.pow(cam, z);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${origin[0]}px ${origin[1]}px` }}>{children}</AbsoluteFill>;
};

// ------------------------------------------------------------------ shapes

/** A sphere cut-out. */
export const Sphere: React.FC<{ r: number; paper?: string; base?: number; gain?: number; inkOpacity?: number }> = ({ r, paper, base, gain, inkOpacity }) => (
  <Cutout w={r * 2} h={r * 2} shape={[{ type: "circle", cx: r, cy: r, r }]} tone={sphereTone(r, r, r, base, gain)} paper={paper} inkOpacity={inkOpacity} />
);

/** A nitrogen molecule: two overlapping spheres (air is mostly N2). */
export const Molecule: React.FC<{ r: number }> = ({ r }) => {
  const w = r * 3.3;
  const h = r * 2;
  const a = sphereTone(r, r, r);
  const b = sphereTone(w - r, r, r);
  return (
    <Cutout
      w={w}
      h={h}
      shape={[
        { type: "circle", cx: r, cy: r, r },
        { type: "circle", cx: w - r, cy: r, r },
      ]}
      tone={(x, y) => {
        const tb = b(x, y);
        return tb !== null ? tb : a(x, y);
      }}
    />
  );
};

/** A cloud: overlapping puffs, bright tops, darker bellies. */
export const Cloud: React.FC<{ w: number; seed?: number }> = ({ w, seed = 1 }) => {
  const h = w * 0.6;
  const puffs = Array.from({ length: 6 }, (_, i) => {
    const f = i / 5;
    const r = w * (0.13 + 0.09 * Math.sin(Math.PI * f) + hash(seed, i) * 0.04);
    return { cx: w * (0.14 + 0.72 * f), cy: h * 0.66 - r * 0.55 - Math.sin(Math.PI * f) * h * 0.16, r };
  });
  puffs.push({ cx: w * 0.5, cy: h * 0.62, r: w * 0.22 });
  const tone = (x: number, y: number): number | null => {
    let best: number | null = null;
    for (const p of puffs) {
      const dx = (x - p.cx) / p.r;
      const dy = (y - p.cy) / p.r;
      const q = dx * dx + dy * dy;
      if (q > 1) continue;
      const v = clamp(0.06 + 0.42 * ((dy + 1) / 2) + 0.18 * q * q + (hash(x, y, seed) - 0.5) * 0.08);
      best = best === null ? v : Math.min(best, v);
    }
    if (best !== null) best = clamp(best + 0.3 * clamp((y - h * 0.55) / (h * 0.45)));
    return best;
  };
  return <Cutout w={w} h={h} shape={puffs.map((p) => ({ type: "circle" as const, ...p }))} tone={tone} />;
};

/** An eye: an almond of white with a dark iris and pupil, shaded under the lids. */
export const Eye: React.FC<{ w: number }> = ({ w }) => {
  const h = w * 0.5;
  const [cx, cy] = [w / 2, h / 2];
  const lid = (x: number) => (h / 2) * (1 - Math.pow((x - cx) / (w / 2), 2));
  const d = `M 0 ${cy} Q ${cx} ${cy - h * 1.0} ${w} ${cy} Q ${cx} ${cy + h * 1.0} 0 ${cy} Z`;
  const ri = h * 0.36;
  const tone = (x: number, y: number): number | null => {
    const l = lid(x);
    if (Math.abs(y - cy) > l) return null;
    const dr = Math.hypot(x - cx, y - cy);
    if (dr < ri * 0.42) return 1;
    if (dr < ri) return clamp(0.62 + 0.25 * (dr / ri) + (hash(x, y, 9) - 0.5) * 0.12);
    const edge = Math.abs(y - cy) / Math.max(1, l);
    return clamp(0.06 + 0.4 * edge * edge + (y < cy ? 0.12 : 0));
  };
  return <Cutout w={w} h={h} shape={[{ type: "path", d }]} tone={tone} extra={<circle cx={cx + ri * 0.3} cy={cy - ri * 0.32} r={ri * 0.16} fill={C.paper} />} />;
};

/** The sun: yellow cardstock disc with an ink halftone shading printed over it. */
export const Sun: React.FC<{ r: number }> = ({ r }) => <Sphere r={r} paper={C.yellow} base={0} gain={0.42} inkOpacity={0.55} />;

/** A shard (thin triangle) of cardstock pointing along angle a from a centre, for rays. */
export const shard = (len: number, width: number): Prim[] => [{ type: "path", d: `M 0 ${width / 2} L ${len} 0 L ${len} ${width} Z` }];

export { DISPLAY };
