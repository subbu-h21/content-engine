/**
 * Risograph's pieces. A print is paper plus up to three plates; each plate is one translucent spot ink multiplied
 * over the paper, so overprints mix (blue + yellow = green, blue + pink = violet, yellow + pink = orange-red). Tints
 * are halftone dots on a screen anchored to the paper, at each plate's own angle, in a few stepped densities. Every
 * plate has one fixed misregistration per shot, grainy dot edges, pinholes and feed streaks; it arrives by a roller
 * sweep and may get a kick on an accent. Type is printed on a plate, so it misregisters with it. Every value comes from
 * style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, pulse, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  blue: color(P, "text"),
  pink: color(P, "accent"),
  yellow: color(P, "accent2"),
};
export type Ink = "blue" | "yellow" | "pink";
const INKS = style.inks as Record<Ink, { role: string; screen: number }>;
export const INK = (k: Ink): string => color(P, INKS[k].role);
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
const E = style.elements;
const T = style.type;
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };
const f1 = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "0");

export type Pt = [number, number];
export const poly = (pts: Pt[]): string => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}Z`;
export const disc = (x: number, y: number, r: number): string => `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`;

/** A small faceless figure standing, head tipped up, feet at (x, y), `h` tall: one silhouette. */
export const figure = (x: number, y: number, h: number): string => {
  const u = h / 100;
  const body: Pt[] = [[-3, -82], [3, -82], [10, -76], [13, -42], [8, -42], [8, 0], [1.5, 0], [0, -36], [-1.5, 0], [-8, 0], [-8, -42], [-13, -42], [-10, -76]];
  return `${poly(body.map(([a, b]): Pt => [x + a * u, y + b * u]))} ${disc(x + 2 * u, y - 91 * u, 9 * u)}`;
};

/** A tapered wedge from a (half-width w0) to b (half-width w1). */
export const wedge = (a: Pt, b: Pt, w0: number, w1: number): string => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const nx = -(b[1] - a[1]) / L;
  const ny = (b[0] - a[0]) / L;
  return poly([[a[0] + nx * w0, a[1] + ny * w0], [b[0] + nx * w1, b[1] + ny * w1], [b[0] - nx * w1, b[1] - ny * w1], [a[0] - nx * w0, a[1] - ny * w0]]);
};

/* ---------- screens, ink and paper ---------- */

const pid = (ink: Ink, pct: number) => `rg-${ink}-${pct}`;

/** Halftone screens for every plate and band, the ink filters (dot grain that boils on 12 fps prints, feed streaks and
 * blots that stay for the shot, pinholes), the paper fibre. */
const Defs: React.FC<{ seed: number }> = ({ seed }) => {
  const t = useSeconds();
  const print = Math.floor(t * E.boil);
  const per = E.period;
  const [k0, k1, k2] = E.density;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        {(Object.keys(INKS) as Ink[]).map((ink) =>
          E.bands.map((pct) => (
            <pattern key={`${ink}${pct}`} id={pid(ink, pct)} width={per} height={per} patternUnits="userSpaceOnUse" patternTransform={`rotate(${INKS[ink].screen})`}>
              <circle cx={per / 2} cy={per / 2} r={per * Math.sqrt(pct / 100 / Math.PI)} fill={INK(ink)} />
            </pattern>
          )),
        )}
        {(Object.keys(INKS) as Ink[]).map((ink, i) => (
          <filter key={ink} id={`rg-ink-${ink}`} filterUnits="userSpaceOnUse" x={-40} y={-40} width={W + 80} height={H + 80} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={seed * 13 + i * 5 + (print % 9)} result="gn" />
            <feDisplacementMap in="SourceGraphic" in2="gn" scale={E.grain} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.0012" numOctaves={2} seed={seed * 7 + i} result="st" />
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={2} seed={seed * 3 + i + 40} result="bl" />
            <feComposite in="st" in2="bl" operator="arithmetic" k2={k1 * 2} k3={k2 * 2} k4={k0 - k1 - k2 + 0.06} result="dens" />
            <feColorMatrix in="dens" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="densA" />
            <feTurbulence type="turbulence" baseFrequency="0.55" numOctaves={1} seed={seed * 5 + i + 90} result="ph" />
            <feColorMatrix in="ph" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="phR" />
            <feComponentTransfer in="phR" result="phA">
              <feFuncA type="discrete" tableValues={Array.from({ length: 20 }, (_, k) => (k < Math.round(E.pinhole * 20) ? "1" : "0.25")).join(" ")} />
            </feComponentTransfer>
            <feComposite in="densA" in2="phA" operator="arithmetic" k1={1} result="mask" />
            <feComposite in="d" in2="mask" operator="in" />
          </filter>
        ))}
        <filter id="rg-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6 0.15" numOctaves={2} seed={2} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.35  0 0 0 0 0.28  0.6 0 0 0 -0.22" />
        </filter>
      </defs>
    </svg>
  );
};

/** The sheet: warm paper with fibres; plates go on top. Waits for the fonts. */
export const Print: React.FC<{ seed: number; children: React.ReactNode }> = ({ seed, children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Defs seed={seed} />
      <svg width={W} height={H} style={abs}>
        <rect width={W} height={H} filter="url(#rg-paper)" opacity={0.5} />
      </svg>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** How a plate's children fill: solid ink, a stepped tint, or a knockout (zero ink = paper). */
export type Fill = { solid: string; ko: string; tint: (pct: number) => string; ink: Ink };

/**
 * One plate: a translucent spot ink multiplied over the paper. It arrives by a roller sweep from `at` (a moving edge
 * with a heavier ink band), sits out of register by a fixed per-shot offset, and kicks 8–14 px with a little ringing
 * at `kick`.
 */
export const Plate: React.FC<{
  ink: Ink;
  seed: number;
  at?: number;
  dir?: "down" | "right" | "up";
  kick?: number;
  dur?: number;
  children: (f: Fill) => React.ReactNode;
}> = ({ ink, seed, at = 0, dir = "down", kick, dur, children }) => {
  const t = useSeconds();
  if (t < at) return null;
  const rnd = seeded(seed * 31 + INKS[ink].screen);
  const reg = E.registration;
  let dx = (rnd() * 2 - 1) * reg;
  let dy = (rnd() * 2 - 1) * reg;
  const rot = (rnd() * 2 - 1) * E.rotation;
  const ka = rnd() * Math.PI * 2;
  if (kick !== undefined) {
    const k = E.kick * pulse(t, kick, E.kickHalfLife) * Math.cos(2 * Math.PI * E.kickHz * (t - kick));
    dx += Math.cos(ka) * k;
    dy += Math.sin(ka) * k;
  }
  const rec = R.roller;
  const p = run(dur && rec.kind === "ease" ? { ...rec, duration: dur } : rec, t - at);
  const band = style.motion.recipes.roller.band;
  const clip =
    dir === "right" ? { x: -20, y: -20, width: (W + 60) * p, height: H + 40 } : dir === "up" ? { x: -20, y: H + 20 - (H + 60) * p, width: W + 40, height: (H + 60) * p } : { x: -20, y: -20, width: W + 40, height: (H + 60) * p };
  const front =
    p >= 1 ? null : dir === "right" ? (
      <rect x={clip.width - 20 - band} y={-20} width={band} height={H + 40} fill={INK(ink)} opacity={0.22} />
    ) : dir === "up" ? (
      <rect x={-20} y={clip.y} width={W + 40} height={band} fill={INK(ink)} opacity={0.22} />
    ) : (
      <rect x={-20} y={clip.height - 20 - band} width={W + 40} height={band} fill={INK(ink)} opacity={0.22} />
    );
  const id = `rg-clip-${ink}-${seed}`;
  const fill: Fill = { solid: INK(ink), ko: "#ffffff", ink, tint: (pct) => (pct >= E.solidFrom * 100 ? INK(ink) : `url(#${pid(ink, E.bands.reduce((b, x) => (Math.abs(x - pct) < Math.abs(b - pct) ? x : b), E.bands[0]))})`) };
  return (
    <svg width={W} height={H} style={{ ...abs, mixBlendMode: "multiply" }}>
      <defs>
        <clipPath id={id}>
          <rect {...clip} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${f1(dx)} ${f1(dy)}) rotate(${rot.toFixed(3)} ${W / 2} ${H / 2})`}>
          <g filter={`url(#rg-ink-${ink})`}>{children(fill)}</g>
        </g>
        {front}
      </g>
    </svg>
  );
};

/** Display type printed on a plate (Bricolage Grotesque 800). */
export const Big: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: "start" | "middle" | "end"; tracking?: number; stroke?: string; sw?: number }> = ({
  x,
  y,
  size,
  fill,
  children,
  anchor = "middle",
  tracking = -0.01,
  stroke,
  sw = 0,
}) => (
  <text x={x} y={y} textAnchor={anchor} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: `${tracking}em` }}>
    {children}
  </text>
);

/** Caption type printed on a plate (Jost). */
export const Small: React.FC<{ x: number; y: number; size?: number; fill: string; children: React.ReactNode; anchor?: "start" | "middle" | "end"; weight?: number }> = ({
  x,
  y,
  size = T.body,
  fill,
  children,
  anchor = "middle",
  weight = 500,
}) => (
  <text x={x} y={y} textAnchor={anchor} fill={fill} style={{ fontFamily: BODY, fontWeight: weight, fontSize: size, letterSpacing: `${T.captionTracking}px` }}>
    {children}
  </text>
);

/** The paper-white caption strip (6 px radius) as a knockout rectangle, sized from the text estimate. */
export const stripRect = (cx: number, y: number, text: string, size: number = T.body) => {
  const w = text.length * size * 0.5 + 2 * S.layout.strip.padX;
  const h = size * 1.05 + 2 * S.layout.strip.padY;
  return { x: cx - w / 2, y: y - size * 0.82 - S.layout.strip.padY, width: w, height: h, rx: S.layout.strip.radius };
};
