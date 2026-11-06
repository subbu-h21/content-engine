/**
 * Red Paper-cut's pieces. Every piece is paper: a flat path with a hand-cut wobble, a light rim upper-left and a dark
 * rim lower-right (the cut face), a soft paper shadow, and dye mottling inside it (holes stay holes). Rosettes are one
 * 45° wedge mirrored eight ways and snap open fold by fold; letters pop in on 12 fps steps; captions sit on serrated
 * swallow-tail banners that drop in on two steps; emphasis is knocked out of a banner (yin cut). Every value comes
 * from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, mix, pulse, run, seeded, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  red: color(P, "text"),
  banner: color(P, "muted"),
  dayFar: color(P, "faint"),
  gold: color(P, "accent"),
  night: color(P, "accent2"),
  heavy: color(P, "heavy"),
  near: color(P, "near"),
  far: color(P, "far"),
  back: color(P, "foldBack"),
  cream: color(P, "cream"),
  inkSky: color(P, "inkSky"),
  nightFar: color(P, "nightFar"),
  nightNear: color(P, "nightNear"),
  houses: color(P, "houses"),
  snow: color(P, "snow"),
  dayMid: color(P, "dayMid"),
  light1: color(P, "light1"),
  light2: color(P, "light2"),
  light3: color(P, "light3"),
  transmission: color(P, "transmission"),
  shadow: color(P, "shadow"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
const E = style.elements;
const T = style.type;
/** Characters and pieces step at 12 fps. */
export const step = (t: number): number => Math.floor(t * E.stepFps) / E.stepFps;
const ONE = 1 / E.stepFps;
export const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

/* ---------- geometry ---------- */

export type Pt = [number, number];
const f1 = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "0");
export const poly = (pts: Pt[]): string => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}Z`;
export const polar = (cx: number, cy: number) => (r: number, a: number): Pt => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
export const circle = (cx: number, cy: number, r: number, n = 40): string => poly(Array.from({ length: n }, (_, k) => polar(cx, cy)(r, (k * 2 * Math.PI) / n)));

/** An almond (lens) from a to b, `hw` wide at its middle on each side. */
export const lens = (a: Pt, b: Pt, hw: number, n = 10): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const o = 4 * hw * u * (1 - u);
    pts.push([a[0] + dx * u + nx * o, a[1] + dy * u + ny * o]);
  }
  for (let i = n - 1; i > 0; i--) {
    const u = i / n;
    const o = 4 * hw * u * (1 - u);
    pts.push([a[0] + dx * u - nx * o, a[1] + dy * u - ny * o]);
  }
  return poly(pts);
};

/** A tapered strip from a (width w0) to b (width w1), its edges serrated with small teeth when `teeth` > 0. */
export const strip = (a: Pt, b: Pt, w0: number, w1: number, teeth = 0, depth = 4): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const n = Math.max(2, teeth > 0 ? Math.round(L / teeth) : 2);
  const side = (sg: number) =>
    Array.from({ length: n + 1 }, (_, i): Pt => {
      const u = i / n;
      const w = (w0 + (w1 - w0) * u) / 2 + (teeth > 0 && i % 2 ? -Math.min(depth, w0 / 3) : 0);
      return [a[0] + dx * u + sg * nx * w, a[1] + dy * u + sg * ny * w];
    });
  return poly([...side(1), ...side(-1).reverse()]);
};

/** The sector [a0, a1] of a circle, as a polygon (for the fold clips). */
const sector = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  const at = polar(cx, cy);
  const n = Math.max(2, Math.ceil((a1 - a0) / (Math.PI / 48)));
  return poly([[cx, cy], ...Array.from({ length: n + 1 }, (_, i) => at(r, a0 + ((a1 - a0) * i) / n))]);
};

/**
 * A window-flower rosette: eight-fold symmetric (every mirror axis is a multiple of 22.5°, so a 45° wedge unfolds
 * into the whole). Rings alternate: a sawtooth fringe, a ring of tapered slits, a yang band (a red zigzag left
 * standing), eight almond petals with crescent-like almonds between them, an inner ring of holes and a diamond in the
 * centre. Holes never touch, so the even-odd fill keeps every one of them a hole and nothing floats.
 */
export const rosette = (cx: number, cy: number, R0: number): string => {
  const at = polar(cx, cy);
  const parts: string[] = [];
  const n = E.rosetteTeeth;
  parts.push(poly(Array.from({ length: n }, (_, k) => at(k % 2 === 0 ? R0 : R0 * 0.93, (k * 2 * Math.PI) / n))));
  for (let k = 0; k < 32; k++) {
    const a = ((k + 0.5) * 2 * Math.PI) / 32;
    const d = 0.022 / 0.86;
    parts.push(poly([at(0.815 * R0, a), at(0.86 * R0, a + d), at(0.895 * R0, a), at(0.86 * R0, a - d)]));
  }
  const tri = (pts: Pt[]) => {
    const c: Pt = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
    return poly(pts.map(([x, y]): Pt => [c[0] + (x - c[0]) * 0.7, c[1] + (y - c[1]) * 0.7]));
  };
  const D = Math.PI / 32;
  for (let k = 0; k < 32; k++) {
    const a = (k * 2 * Math.PI) / 32;
    parts.push(tri([at(0.69 * R0, a - D), at(0.78 * R0, a), at(0.69 * R0, a + D)]));
    const b = a + D;
    parts.push(tri([at(0.78 * R0, b - D), at(0.69 * R0, b), at(0.78 * R0, b + D)]));
  }
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    const b = a + Math.PI / 8;
    parts.push(lens(at(0.34 * R0, a), at(0.64 * R0, a), 0.08 * R0, 12));
    parts.push(lens(at(0.44 * R0, b), at(0.62 * R0, b), 0.04 * R0, 8));
    parts.push(lens(at(0.17 * R0, a), at(0.29 * R0, a), 0.03 * R0, 6));
    const [hx, hy] = at(0.25 * R0, b);
    parts.push(circle(hx, hy, 0.04 * R0, 16));
  }
  parts.push(poly([at(0.075 * R0, 0), at(0.075 * R0, Math.PI / 2), at(0.075 * R0, Math.PI), at(0.075 * R0, (3 * Math.PI) / 2)]));
  return parts.join(" ");
};

/** A sawtooth border strip across the frame at `y` (teeth pointing down when `down`). */
export const sawStrip = (y: number, h: number, down = true, tooth = 22): string => {
  const pts: Pt[] = [];
  const n = Math.ceil(W / tooth);
  const edge = down ? y + h : y;
  const back = down ? y : y + h;
  pts.push([-10, back]);
  pts.push([W + 10, back]);
  for (let i = n; i >= 0; i--) pts.push([i * tooth, edge + (i % 2 ? (down ? 16 : -16) : 0)]);
  pts.push([-10, edge]);
  return poly(pts);
};

/** A banner strip with serrated top and bottom edges and swallow-tail ends. */
export const bannerPath = (x0: number, y0: number, x1: number, y1: number): string => {
  const [tw, td] = E.tooth;
  const ym = (y0 + y1) / 2;
  const notch = Math.min(E.tail * 0.62, (y1 - y0) * 0.45);
  const n = Math.max(2, Math.round((x1 - x0) / tw));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y0 + (i % 2 ? td : 0)]);
  pts.push([x1 - notch, ym]);
  for (let i = n; i >= 0; i--) pts.push([x0 + ((x1 - x0) * i) / n, y1 - (i % 2 ? td : 0)]);
  pts.push([x0 + notch, ym]);
  return poly(pts);
};

/** A night village: far and near hills, a row of houses with window holes, and the windows' light behind them. */
export const village = (base: number, seed: number) => {
  const rnd = seeded(seed);
  const hill = (y: number, amp: number, ph: number) => {
    const pts: Pt[] = [[-20, H + 20]];
    for (let x = -20; x <= W + 20; x += 24) pts.push([x, y - amp * (0.6 * Math.sin(x / 170 + ph) + 0.4 * Math.sin(x / 61 + ph * 2))]);
    pts.push([W + 20, H + 20]);
    return poly(pts);
  };
  let houses = "";
  const windows: [number, number, number, number][] = [];
  for (let x = 20; x < W - 40; ) {
    const w = 110 + rnd() * 70;
    const h = 90 + rnd() * 80;
    const y = base + 70 - h;
    const roof = 40 + rnd() * 30;
    houses += poly([[x, H + 20], [x, y], [x + w / 2, y - roof], [x + w, y], [x + w, H + 20]]) + " ";
    const nw = w > 150 ? 2 : 1;
    for (let k = 0; k < nw; k++) {
      const wx = x + (w * (k + 1)) / (nw + 1) - 13;
      const wy = y + 26;
      houses += poly([[wx, wy], [wx + 26, wy], [wx + 26, wy + 34], [wx, wy + 34]]) + " ";
      windows.push([wx - 4, wy - 4, 34, 42]);
    }
    x += w + 26 + rnd() * 40;
  }
  return { far: hill(base - 120, 60, seed), near: hill(base + 120, 40, seed + 2), houses, windows };
};

/* ---------- ground, filters ---------- */

const Filters: React.FC = () => {
  const sh = E.shadow;
  const region = { filterUnits: "userSpaceOnUse" as const, x: -60, y: -60, width: W + 120, height: H + 120, colorInterpolationFilters: "sRGB" as const };
  const body = (src: string) => (
    <>
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={3} result="wn" />
      <feDisplacementMap in={src} in2="wn" scale={E.wobble} xChannelSelector="R" yChannelSelector="G" result="w" />
      <feTurbulence type="fractalNoise" baseFrequency="0.0077" numOctaves={3} seed={9} result="m" />
      <feTurbulence type="fractalNoise" baseFrequency="0.4 0.04" numOctaves={1} seed={21} result="f" />
      <feComposite in="m" in2="f" operator="arithmetic" k2={E.mottle * 8} k3={0.25} k4={0.5 - E.mottle * 4 - 0.125} result="gm" />
      <feColorMatrix in="gm" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="g" />
      <feBlend in="g" in2="w" mode="soft-light" result="bl" />
      <feComposite in="bl" in2="w" operator="in" result="tex" />
      <feOffset in="w" dx={E.rim} dy={E.rim} result="o1" />
      <feComposite in="w" in2="o1" operator="out" result="tl" />
      <feFlood floodColor="#ffffff" floodOpacity={0.35} />
      <feComposite in2="tl" operator="in" result="light" />
      <feOffset in="w" dx={-E.rim} dy={-E.rim} result="o2" />
      <feComposite in="w" in2="o2" operator="out" result="br" />
      <feFlood floodColor="#000000" floodOpacity={0.3} />
      <feComposite in2="br" operator="in" result="dark" />
      <feGaussianBlur in="w" stdDeviation={sh.blur} />
      <feOffset dx={sh.dx} dy={sh.dy} result="sb" />
      <feFlood floodColor={C.shadow} floodOpacity={sh.alpha} />
      <feComposite in2="sb" operator="in" result="sh" />
      <feMerge>
        <feMergeNode in="sh" />
        <feMergeNode in="tex" />
        <feMergeNode in="light" />
        <feMergeNode in="dark" />
      </feMerge>
    </>
  );
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id="rp-cut" {...region}>
          {body("SourceGraphic")}
        </filter>
        <filter id="rp-cut-slit" {...region}>
          <feMorphology in="SourceAlpha" operator="erode" radius={E.slit[0]} result="e1" />
          <feMorphology in="SourceAlpha" operator="erode" radius={E.slit[1]} result="e2" />
          <feComposite in="e1" in2="e2" operator="out" result="sl" />
          <feComposite in="SourceGraphic" in2="sl" operator="out" result="cut" />
          {body("cut")}
        </filter>
        <filter id="rp-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.32" numOctaves={2} seed={5} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  2.4 0 0 0 -1.3" />
        </filter>
        <filter id="rp-mottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves={3} seed={11} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0.9 0 0 0 -0.35" />
        </filter>
        <filter id="rp-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={40} />
        </filter>
      </defs>
    </svg>
  );
};

/** A paper ground (rice paper by default) with its fibres and dye mottling; waits for the fonts. */
export const Sheet: React.FC<{ ground?: string; children: React.ReactNode }> = ({ ground = C.paper, children }) => {
  useFontsReady(FACES);
  const night = ground !== C.paper;
  return (
    <AbsoluteFill style={{ backgroundColor: ground, overflow: "hidden" }}>
      <Filters />
      <svg width={W} height={H} style={{ ...abs, mixBlendMode: night ? "screen" : "multiply" }}>
        <rect width={W} height={H} filter="url(#rp-mottle)" opacity={night ? 0.25 : 0.5} />
        <rect width={W} height={H} filter="url(#rp-fibre)" opacity={night ? 0.22 : 0.4} />
      </svg>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A full-frame SVG layer. */
export const Layer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style: st }) => (
  <svg width={W} height={H} style={{ ...abs, ...st }}>
    {children}
  </svg>
);

/** Paper pieces: one path (even-odd, so holes stay holes) through the cut filter. */
export const Piece: React.FC<{ d: string; fill: string; slit?: boolean; opacity?: number }> = ({ d, fill, slit = false, opacity = 1 }) => (
  <g filter={`url(#${slit ? "rp-cut-slit" : "rp-cut"})`} opacity={opacity}>
    <path d={d} fill={fill} fillRule="evenodd" />
  </g>
);

/* ---------- moving pieces ---------- */

/**
 * A rosette that unfolds from its folded 45° wedge: three folds snap open `apart` seconds apart (each flap swings
 * over its fold line, showing its back colour past 90° and darkening as it stands up), then a small bump and a warm
 * flash. `lit` draws it as a backlit window: transmission red over a radial light, holes at full light.
 */
export const Rosette: React.FC<{ cx: number; cy: number; r: number; at: number; id: string; fill?: string; lit?: boolean }> = ({ cx, cy, r, at, id, fill = C.red, lit = false }) => {
  const t = useSeconds() - at;
  const d = useMemo(() => rosette(cx, cy, r), [cx, cy, r]);
  if (t < 0) return null;
  const apart = style.motion.recipes.unfold.apart;
  const off = -Math.PI / 2;
  const ps = [0, 1, 2].map((k) => ease("unfold", t - ONE * 2 - k * apart));
  const done = ONE * 2 + 2 * apart + style.motion.recipes.unfold.duration;
  const pop = step(t) < ONE ? E.pop : 1;
  const bump = t >= done && t < done + ONE ? E.bump : 1;
  const flash = pulse(t, done, R.flash.kind === "ease" ? R.flash.duration : 0.12);
  const base = lit ? C.transmission : fill;
  const col = mix(base, C.light3, flash * 0.5);
  const k = ps.findIndex((p) => p < 1);
  const deg = (a: number) => (a * 180) / Math.PI;
  const creases = (
    <g stroke={C.far} strokeOpacity={0.3} strokeWidth={1.2}>
      {[0, 1, 2, 3].map((j) => {
        const a = off + (j * Math.PI) / 4;
        return <line key={j} x1={cx - Math.cos(a) * r * 0.93} y1={cy - Math.sin(a) * r * 0.93} x2={cx + Math.cos(a) * r * 0.93} y2={cy + Math.sin(a) * r * 0.93} />;
      })}
    </g>
  );
  let body: React.ReactNode;
  if (k === -1) {
    body = (
      <>
        <path d={d} fill={col} fillRule="evenodd" />
        {creases}
      </>
    );
  } else {
    const A = (Math.PI / 4) * Math.pow(2, k);
    const p = ps[k];
    const s = -Math.cos(Math.PI * p);
    const flap = s < 0 ? mix(C.back, C.far, (1 - Math.abs(s)) * 0.5) : mix(col, C.far, (1 - Math.abs(s)) * 0.5);
    const tf = `translate(${cx} ${cy}) rotate(${deg(off + A)}) scale(1 ${s.toFixed(4)}) rotate(${-deg(off + A)}) translate(${-cx} ${-cy})`;
    body = (
      <>
        <defs>
          <clipPath id={`${id}-b`}>
            <path d={sector(cx, cy, r * 1.05, off, off + A)} />
          </clipPath>
          <clipPath id={`${id}-f`}>
            <path d={sector(cx, cy, r * 1.05, off + A, off + 2 * A)} />
          </clipPath>
        </defs>
        {k === 0 && p <= 0
          ? [3, 2, 1].map((o) => (
              <g key={o} transform={`translate(${o * 2} ${o * 3})`} clipPath={`url(#${id}-b)`}>
                <path d={d} fill={C.far} fillRule="evenodd" />
              </g>
            ))
          : null}
        <g clipPath={`url(#${id}-b)`}>
          <path d={d} fill={col} fillRule="evenodd" />
        </g>
        {p > 0 ? (
          <g transform={tf}>
            <g clipPath={`url(#${id}-f)`}>
              <path d={d} fill={flap} fillRule="evenodd" />
            </g>
          </g>
        ) : null}
      </>
    );
  }
  const sc = pop * bump;
  return (
    <g>
      {lit && k === -1 ? (
        <>
          <defs>
            <radialGradient id={`${id}-l`}>
              <stop offset="0%" stopColor={C.light1} />
              <stop offset="55%" stopColor={C.light2} />
              <stop offset="100%" stopColor={C.light3} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.35} fill={C.light2} opacity={style.finish.bloom} filter="url(#rp-bloom)" />
          <circle cx={cx} cy={cy} r={r * 0.97} fill={`url(#${id}-l)`} />
        </>
      ) : null}
      <g transform={`translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`} filter="url(#rp-cut)">
        {body}
      </g>
    </g>
  );
};

/** Text on a serrated swallow-tail banner that drops in on two 12 fps steps (like a couplet being pasted). */
export const Banner: React.FC<{
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  at: number;
  children?: React.ReactNode;
  size?: number;
  fill?: string;
  ink?: string;
  italic?: boolean;
}> = ({ x0, y0, x1, y1, at, children, size = T.banner, fill = C.banner, ink = C.cream, italic = false }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const first = step(t) < ONE;
  const drop = style.motion.recipes.banner.drop;
  return (
    <div
      style={{
        ...abs,
        width: W,
        height: H,
        transform: first ? `translateY(${-drop}px) rotate(-1.5deg)` : undefined,
        transformOrigin: `${(x0 + x1) / 2}px ${(y0 + y1) / 2}px`,
      }}
    >
      <Layer>
        <Piece d={bannerPath(x0, y0, x1, y1)} fill={fill} />
      </Layer>
      <div
        style={{
          position: "absolute",
          left: x0 + E.tail,
          width: x1 - x0 - 2 * E.tail,
          top: y0,
          height: y1 - y0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 600,
          fontStyle: italic ? "italic" : "normal",
          fontSize: size,
          lineHeight: 1.22,
          color: ink,
        }}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

/**
 * Cut-out letters (Fraunces 800) that pop in one by one (or word by word) on 12 fps steps, each 1.15× for its first
 * step. Big sizes get the inset slit (the classic double outline).
 */
export const CutText: React.FC<{
  text: string;
  y: number;
  size: number;
  at: number;
  fill?: string;
  by?: "letter" | "word";
  slit?: boolean;
  x?: number;
  align?: "center" | "left";
  tracking?: number;
}> = ({ text, y, size, at, fill = C.red, by = "letter", slit = false, x = 0, align = "center", tracking = 0.01 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const st = step(t);
  const per = style.motion.stagger;
  const units: { text: string; space: boolean }[] =
    by === "letter" ? Array.from(text).map((ch) => ({ text: ch, space: false })) : words(text).map((w) => ({ text: w.text, space: !w.glue }));
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${tracking}em`,
        color: fill,
        whiteSpace: "pre",
        filter: `url(#${slit ? "rp-cut-slit" : "rp-cut"})`,
      }}
    >
      {units.map((u, k) => {
        if (by === "letter" && u.text === " ") return <React.Fragment key={k}> </React.Fragment>;
        const show = st - i * per;
        i += 1;
        const sc = show >= 0 && show < ONE ? E.pop : 1;
        return (
          <React.Fragment key={k}>
            {by === "word" && k > 0 && u.space ? " " : null}
            <span style={{ display: "inline-block", opacity: show >= 0 ? 1 : 0, transform: `scale(${sc})`, transformOrigin: "50% 70%" }}>{u.text}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * A red banner with words knocked out of it (yin cut): the banner drops in on two steps, then the letters are cut
 * one per 12 fps step, so the ground shows through them.
 */
export const KnockBanner: React.FC<{ text: string; cx: number; cy: number; size: number; at: number; id: string; fill?: string; width?: number }> = ({
  text,
  cx,
  cy,
  size,
  at,
  id,
  fill = C.red,
  width,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const st = step(t);
  const w = width ?? text.length * size * T.charEm + 2 * E.tail + 80;
  const h = size * 1.25;
  const first = st < ONE;
  const shown = Math.floor((st - 2 * ONE) / style.motion.stagger) + 1;
  const drop = style.motion.recipes.banner.drop;
  return (
    <Layer>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect width={W} height={H} fill="#fff" />
          <text x={cx} y={cy + size * 0.34} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 800, fontSize: size, letterSpacing: "0.01em" }}>
            {Array.from(text).map((ch, i) => (
              <tspan key={i} fill={i < shown ? "#000" : "#fff"}>
                {ch}
              </tspan>
            ))}
          </text>
        </mask>
      </defs>
      <g transform={first ? `translate(0 ${-drop}) rotate(-1.5 ${cx} ${cy})` : undefined}>
        <g filter="url(#rp-cut)">
          <g mask={`url(#${id})`}>
            <path d={bannerPath(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)} fill={fill} />
          </g>
        </g>
      </g>
    </Layer>
  );
};

/** Small credits printed in ink on the paper (no cut, no shadow); they appear on one step. */
export const Printed: React.FC<{ text: string; y: number; at: number; size?: number; ink?: string; italic?: boolean; x?: number; align?: "center" | "left" }> = ({
  text,
  y,
  at,
  size = T.kicker,
  ink = C.heavy,
  italic = true,
  x = 0,
  align = "center",
}) => {
  if (useSeconds() < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: SERIF,
        fontWeight: 600,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        letterSpacing: "0.02em",
        color: ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Pieces that appear with a pop on one 12 fps step. */
export const Pop: React.FC<{ at: number; cx: number; cy: number; children: React.ReactNode }> = ({ at, cx, cy, children }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const sc = step(t) < ONE ? E.pop : 1;
  return <g transform={`translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`}>{children}</g>;
};

/** Reveal along a scissor path: what's left of the moving cut point shows (for strips cut left to right). */
export const ScissorClip: React.FC<{ id: string; x0: number; x1: number; at: number; dur?: number }> = ({ id, x0, x1, at, dur = style.motion.recipes.cut.duration }) => {
  const t = useSeconds() - at;
  const p = Math.max(0, Math.min(1, t / dur));
  const x = x0 + (x1 - x0 + 40) * p;
  return (
    <defs>
      <clipPath id={id}>
        <rect x={-20} y={0} width={Math.max(0, x + 20)} height={H} />
      </clipPath>
    </defs>
  );
};
