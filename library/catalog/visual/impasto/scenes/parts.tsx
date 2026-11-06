/**
 * Impasto's pieces, all procedural and deterministic:
 * - a scene is planned as flat, value-planned shapes (planes), each filled with seeded palette-knife strokes that stay
 *   inside it (a clip), over a thin underpainting so no canvas shows;
 * - a knife stroke is longer than wide with slanted ends, a skew and a slight bend; its body drags a second colour,
 *   carries striations (some breaking off where the paint ran out), a light lip on the edge the knife pressed and a
 *   dark one opposite, a light crescent where it lifted, and casts a small shadow down and to the right;
 * - raking light from the upper left over the whole painting: the paint's own values as a height field, lit with
 *   feDiffuseLighting and feSpecularLighting;
 * - titles are laid in with the knife: letters filled with small knife strokes (a clip of real type), raised by
 *   their own shadow; small text stays crisp;
 * - colour as the event: every stroke has a grey version, and a reveal wave re-paints them in colour one by one.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, mix, run, seeded, springAt, useFontsReady, useSeconds, type Recipe } from "../../kit";
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
  cobaltSky: color(P, "background"),
  cream: color(P, "text"),
  rose: color(P, "muted"),
  umber: color(P, "faint"),
  red: color(P, "accent"),
  cobalt: color(P, "accent2"),
  peach: color(P, "peach"),
  gold: color(P, "gold"),
  ochre: color(P, "ochre"),
  shutter: color(P, "shutter"),
  awning: color(P, "awning"),
  yellow: color(P, "yellow"),
  viridian: color(P, "viridian"),
  magenta: color(P, "magenta"),
  orange: color(P, "orange"),
  turquoise: color(P, "turquoise"),
  violet: color(P, "violet"),
  ultramarine: color(P, "ultramarine"),
  dark: color(P, "umberDark"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration?: number): number =>
  run(duration === undefined ? R[name] : { ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

export type Pt = [number, number];
const pathOf = (pts: Pt[]) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}` : "");

/** Point in polygon (even-odd). */
const inside = (poly: Pt[], x: number, y: number): boolean => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
/** The grey world: a stroke's luminance, slightly cool, with a 5% residue of its colour. */
const greyOf = (hex: string) => {
  const v = Math.round(lum(hex) * 255)
    .toString(16)
    .padStart(2, "0");
  return mix(mix(`#${v}${v}${v}`, hex, E.grey.residue), "#7f8da0", E.grey.cool);
};

// ------------------------------------------------------------------ knife strokes

export type Knife = { x: number; y: number; ang: number; len: number; wid: number; c: string; c2: string; skew: number; bend: number; seed: number; delay: number };

/** A knife stroke's outline (world space), grown to `g` of its length from its start. */
const knifeOutline = (k: Knife, g = 1): { top: Pt[]; bot: Pt[] } => {
  const [ca, sa] = [Math.cos(k.ang), Math.sin(k.ang)];
  const a = k.len / 2;
  const b = k.wid / 2;
  const top: Pt[] = [];
  const bot: Pt[] = [];
  const n = 6;
  for (let i = 0; i <= n; i++) {
    const u = -a + ((2 * a * i) / n) * g;
    const bend = k.bend * b * (1 - Math.pow(u / a, 2));
    const slantT = i === 0 ? b * 0.35 : i === n ? -b * 0.25 : 0;
    const slantB = i === 0 ? -b * 0.2 : i === n ? b * 0.4 : 0;
    const lt: Pt = [u + k.skew * -b + slantT, -b + bend];
    const lb: Pt = [u + k.skew * b + slantB, b + bend];
    top.push([k.x + lt[0] * ca - lt[1] * sa, k.y + lt[0] * sa + lt[1] * ca]);
    bot.push([k.x + lb[0] * ca - lb[1] * sa, k.y + lb[0] * sa + lb[1] * ca]);
  }
  return { top, bot };
};

/** One knife stroke: cast shadow, body with a dragged second colour, striations, lips. */
const KnifeStroke: React.FC<{ k: Knife; g: number; col: string; col2: string }> = ({ k, g, col, col2 }) => {
  const { top, bot } = knifeOutline(k, g);
  const outline = [...top, ...bot.slice().reverse()];
  const r = seeded(k.seed);
  const sh = E.ridge.shadow;
  const lerpEdge = (f: number): Pt[] => top.map((p, i) => [p[0] + (bot[i][0] - p[0]) * f, p[1] + (bot[i][1] - p[1]) * f]);
  const drag = [...lerpEdge(0.55), ...bot.slice().reverse()];
  const streaks = Array.from({ length: E.ridge.streaks }, (_, i) => {
    const f = 0.15 + (0.7 * (i + r())) / E.ridge.streaks;
    const end = 0.55 + r() * 0.45;
    const line = lerpEdge(f).slice(0, Math.max(2, Math.round(7 * end)));
    return { d: pathOf(line), light: r() < 0.5, w: 1.2 + r() * 1.6 };
  });
  return (
    <g>
      <path d={`${pathOf(outline.map(([x, y]) => [x + 3.5, y + 4.5] as Pt))} Z`} fill="#000" opacity={sh} />
      <path d={`${pathOf(outline)} Z`} fill={col} />
      <path d={`${pathOf(drag)} Z`} fill={col2} opacity={0.42} />
      {streaks.map((st, i) => (
        <path key={i} d={st.d} fill="none" stroke={st.light ? mix(col, "#ffffff", 0.28) : mix(col, "#000000", 0.22)} strokeWidth={st.w * 1.4} strokeOpacity={0.45} strokeLinecap="round" />
      ))}
      <path d={pathOf(top)} fill="none" stroke={mix(col, "#ffffff", E.ridge.lip)} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
      <path d={pathOf(bot)} fill="none" stroke={mix(col, "#000000", 0.3)} strokeWidth={2.2} strokeLinecap="round" opacity={0.4} />
      {g >= 1 ? <path d={pathOf([top[top.length - 1], bot[bot.length - 1]])} fill="none" stroke={mix(col, "#ffffff", 0.5)} strokeWidth={3.2} strokeLinecap="round" opacity={0.8} /> : null}
    </g>
  );
};

/**
 * Knife strokes over a shape: a jittered grid of strokes inside it, sized `r`, angled `angle` (±13°), coloured by
 * `paint(x, y)` → [colour, dragged colour], value jittered ±6%. `delay` orders the lay-in along `sweep` (an angle).
 */
export const knives = (poly: Pt[], opts: { r: number; angle: number; paint: (x: number, y: number) => [string, string]; seed: number; sweep?: number; spread?: number }): Knife[] => {
  const { r, angle, paint, seed, sweep = 0, spread = 1 } = opts;
  const rnd = seeded(seed);
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const K = E.knife;
  const sx = r * 1.55;
  const sy = r * 0.95;
  const out: Knife[] = [];
  const [cs, ss] = [Math.cos(sweep), Math.sin(sweep)];
  const proj = (x: number, y: number) => x * cs + y * ss;
  const pr = [proj(x0, y0), proj(x1, y0), proj(x0, y1), proj(x1, y1)];
  const [p0, p1] = [Math.min(...pr), Math.max(...pr)];
  let row = 0;
  for (let y = y0 - sy * 0.3; y <= y1 + sy * 0.5; y += sy, row++) {
    for (let x = x0 - sx * 0.5 + (row % 2) * sx * 0.5; x <= x1 + sx * 0.5; x += sx) {
      const px = x + (rnd() - 0.5) * sx * 0.6;
      const py = y + (rnd() - 0.5) * sy * 0.6;
      const near = inside(poly, px, py) || inside(poly, px + r * 0.6, py) || inside(poly, px - r * 0.6, py) || inside(poly, px, py + r * 0.4) || inside(poly, px, py - r * 0.4);
      if (!near) continue;
      const [c, c2] = paint(px, py);
      const vj = (rnd() - 0.5) * 2 * K.valueJitter;
      out.push({
        x: px,
        y: py,
        ang: ((angle + (rnd() - 0.5) * 2 * K.angleJitter) * Math.PI) / 180,
        len: r * (K.length[0] + rnd() * (K.length[1] - K.length[0])),
        wid: r * (K.width[0] + rnd() * (K.width[1] - K.width[0])),
        c: vj > 0 ? mix(c, "#ffffff", vj) : mix(c, "#000000", -vj),
        c2,
        skew: (rnd() - 0.5) * 2 * K.skew,
        bend: (rnd() - 0.5) * 0.5,
        seed: seed * 7 + out.length,
        delay: ((proj(px, py) - p0) / Math.max(1, p1 - p0)) * spread + rnd() * 0.06,
      });
    }
  }
  return out;
};

export type Reveal = { x: number; y: number; at: number; speed: number };

/**
 * A plane: its underpainting and its knife strokes, clipped to the shape. Strokes are laid in by a sweep starting at
 * `at` over `sweepDur`, each growing along its length; with `reveal`, they start grey and turn to colour as the
 * reveal wave reaches them.
 */
export const Plane: React.FC<{ poly: Pt[]; strokes: Knife[]; base: string; at: number; sweepDur?: number; reveal?: Reveal; bands?: [number, string][] }> = ({ poly, strokes, base, at, sweepDur = S.motion.recipes.sweep.duration, reveal, bands }) => {
  const id = useSvgId("ipp");
  const t = useSeconds();
  if (t < at) return null;
  const under = Math.min(1, (t - at) / 0.25);
  const rv = (k: { x: number; y: number }) => (reveal ? easeFor("reveal", t - reveal.at - Math.hypot(k.x - reveal.x, k.y - reveal.y) / reveal.speed, 0.35) : 1);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={`${pathOf(poly)} Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path d={`${pathOf(poly)} Z`} fill={reveal ? mix(greyOf(base), base, rv({ x: poly[0][0], y: poly[0][1] })) : base} opacity={under} />
        {bands?.map(([y0, c], i) => {
          const y1 = i + 1 < bands.length ? bands[i + 1][0] : H + 40;
          const f = reveal ? rv({ x: reveal.x, y: (y0 + y1) / 2 }) : 1;
          return <rect key={i} x={-40} y={y0} width={W + 80} height={y1 - y0} fill={f >= 1 ? c : mix(greyOf(c), c, f)} opacity={under} />;
        })}
        {strokes.map((k, i) => {
          const g = easeFor("lay", t - at - k.delay * sweepDur);
          if (g <= 0) return null;
          const f = rv(k);
          return <KnifeStroke key={i} k={k} g={g} col={f >= 1 ? k.c : mix(greyOf(k.c), k.c, f)} col2={f >= 1 ? k.c2 : mix(greyOf(k.c2), k.c2, f)} />;
        })}
      </g>
    </g>
  );
};

/** A convenience: a plane of one colour family. */
export const SolidPlane: React.FC<{ poly: Pt[]; c: string; c2?: string; r?: number; angle?: number; at: number; seed: number; sweep?: number; sweepDur?: number; reveal?: Reveal }> = ({
  poly,
  c,
  c2,
  r = E.knife.plane,
  angle = 0,
  at,
  seed,
  sweep = 0,
  sweepDur,
  reveal,
}) => <Plane poly={poly} base={c} at={at} sweepDur={sweepDur} reveal={reveal} strokes={knives(poly, { r, angle, seed, sweep, paint: () => [c, c2 ?? c] })} />;

// ------------------------------------------------------------------ type laid in with the knife

/** Letters laid in with the knife: real type as a clip, filled with small knife strokes, raised by their own shadow. */
export const PaintedText: React.FC<{ text: string; x: number; y: number; size: number; c: string; c2?: string; at: number; anchor?: "start" | "middle"; seed: number; dur?: number }> = ({
  text,
  x,
  y,
  size,
  c,
  c2,
  at,
  anchor = "start",
  seed,
  dur = 0.9,
}) => {
  const id = useSvgId("ipt");
  const t = useSeconds();
  if (t < at) return null;
  const est = text.length * size * T.charEm;
  const x0 = anchor === "middle" ? x - est / 2 : x;
  const box: Pt[] = [
    [x0 - size * 0.2, y - size * 0.95],
    [x0 + est + size * 0.3, y - size * 0.95],
    [x0 + est + size * 0.3, y + size * 0.3],
    [x0 - size * 0.2, y + size * 0.3],
  ];
  const strokes = knives(box, { r: Math.max(10, (E.knife.letter * size) / 120), angle: -8, seed, paint: () => [c, c2 ?? mix(c, "#ffffff", 0.2)] });
  const textEl = (
    <text x={x} y={y} fontFamily={DISPLAY} fontWeight={900} fontSize={size} letterSpacing={`${T.tracking}em`} textAnchor={anchor}>
      {text}
    </text>
  );
  const shown = clamp((t - at) / dur);
  return (
    <g>
      <defs>
        <clipPath id={id}>{textEl}</clipPath>
        <clipPath id={`${id}r`}>
          <rect x={x0 - size} y={y - size * 1.3} width={shown >= 1 ? W * 2 : size + (est + size) * shown} height={size * 1.9} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}r)`}>
        <g transform="translate(5 7)" opacity={0.38} filter="url(#ip-soft)">
          <text x={x} y={y} fontFamily={DISPLAY} fontWeight={900} fontSize={size} letterSpacing={`${T.tracking}em`} textAnchor={anchor} fill="#000">
            {text}
          </text>
        </g>
        <g clipPath={`url(#${id})`}>
          <text x={x} y={y} fontFamily={DISPLAY} fontWeight={900} fontSize={size} letterSpacing={`${T.tracking}em`} textAnchor={anchor} fill={c}>
            {text}
          </text>
          {strokes.map((k, i) => (
            <KnifeStroke key={i} k={k} g={easeFor("lay", t - at - k.delay * dur * 0.8)} col={k.c} col2={k.c2} />
          ))}
        </g>
      </g>
    </g>
  );
};

/** Small text stays crisp (knife strokes can't carry small letters), set on a calm plane. */
export const Crisp: React.FC<{ lines: string[]; x: number; y: number; at: number; size?: number; col?: string; anchor?: "start" | "middle" | "end" }> = ({ lines, x, y, at, size = T.label, col = C.cream, anchor = "start" }) => {
  const t = useSeconds();
  const p = clamp((t - at) / 0.3);
  if (p <= 0) return null;
  return (
    <g opacity={p}>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * size * 1.25} fontFamily={DISPLAY} fontWeight={600} fontSize={size} fill={col} textAnchor={anchor} style={{ paintOrder: "stroke" }} stroke={mix(col, "#000000", 0.85)} strokeOpacity={0.35} strokeWidth={4}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** A pop on the beat (a spring that overshoots), for a thing that bursts open. */
export const pop = (t: number) => springAt(t, R.pop as Extract<Recipe, { kind: "spring" }>);

// ------------------------------------------------------------------ the canvas and the light

/** The painting: everything under raking light from the upper left, its own values as relief. Waits for the fonts. */
export const Canvas: React.FC<{ children: React.ReactNode; ground?: string; over?: React.ReactNode }> = ({ children, ground = C.umber, over }) => {
  useFontsReady(FACES);
  const L = E.light;
  // diffuse strength from the source's ratio (diffuse .28 against ambient .8); a flat area keeps its own value
  const k1 = (L.diffuse / L.ambient) * 2;
  return (
    <AbsoluteFill style={{ backgroundColor: ground }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ip-light" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0.59 0.11 0 0" result="lumA" />
            <feGaussianBlur in="lumA" stdDeviation={1.1} result="h" />
            <feDiffuseLighting in="h" surfaceScale={L.relief} diffuseConstant={1} lightingColor="#ffffff" result="d">
              <feDistantLight azimuth={L.azimuth} elevation={L.elevation} />
            </feDiffuseLighting>
            <feSpecularLighting in="h" surfaceScale={L.relief} specularConstant={L.specular} specularExponent={16} lightingColor="#fff6e6" result="sp">
              <feDistantLight azimuth={L.azimuth} elevation={L.elevation} />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1={k1} k2={1 - k1 * Math.sin((L.elevation * Math.PI) / 180)} result="lit" />
            <feComposite in="sp" in2="SourceAlpha" operator="in" result="spec" />
            <feComposite in="lit" in2="spec" operator="arithmetic" k2={1} k3={1} />
          </filter>
          <filter id="ip-soft" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation={3} />
          </filter>
        </defs>
        <g filter="url(#ip-light)">
          <rect width={W} height={H} fill={ground} />
          {children}
        </g>
        {over}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A rectangle as a polygon. */
export const rect = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** An ellipse as a polygon. */
export const ellipse = (cx: number, cy: number, rx: number, ry = rx, n = 40): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

export { DISPLAY, mix };
