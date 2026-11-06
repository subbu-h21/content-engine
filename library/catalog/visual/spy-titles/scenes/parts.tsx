/**
 * Spy Titles' pieces: flat grounds, scissor-cut paper shapes with a cut gap and a paper shadow, letters that land and
 * stop dead, the paper strip and the profile silhouette. Puppets and letters step at 12 fps. Every value comes from
 * style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, lerp, rgba, run, seeded, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, GOTHIC, SPARTAN } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const C = {
  ink: color(style.palette, "background"),
  paper: color(style.palette, "text"),
  red: color(style.palette, "accent"),
  mustard: color(style.palette, "accent2"),
  darkRed: color(style.palette, "surface"),
  darkMustard: color(style.palette, "muted"),
  distant: color(style.palette, "faint"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** Time on twos: puppets and letters move on this; the camera and credit slides never do. */
export const twos = (t: number): number => Math.floor(t * E.stepFps) / E.stepFps;
const RAD = (style.layout.diagonal * Math.PI) / 180;
export const DIAG: [number, number] = [Math.cos(RAD), Math.sin(RAD)];
const SHADOW = `drop-shadow(${E.shadow[0]}px ${E.shadow[1]}px ${E.shadow[2] / 2}px ${rgba("#000000", E.shadow[3])})`;

export type Pt = [number, number];

/** A closed polygon re-cut with scissors: resampled, pushed along its normal by slow noise, with a rare notch. */
export const scissor = (pts: Pt[], seed: number): string => {
  const rnd = seeded(seed * 17 + 1);
  const [p1, p2] = [rnd() * 6.28, rnd() * 6.28];
  const amp = lerp(E.edgeNoise[0], E.edgeNoise[1], rnd());
  const out: string[] = [];
  let s = 0;
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len <= 0) return;
    const [nx, ny] = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const n = Math.max(1, Math.round(len / E.resample));
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const notch = rnd() < 0.015 ? lerp(E.notch[0], E.notch[1], rnd()) : 0;
      const off = amp * (Math.sin(s / 47 + p1) * 0.7 + Math.sin(s / 19 + p2) * 0.5) - notch;
      out.push(`${(a[0] + (b[0] - a[0]) * u + nx * off).toFixed(1)} ${(a[1] + (b[1] - a[1]) * u + ny * off).toFixed(1)}`);
      s += len / n;
    }
  });
  return `M${out.join("L")}Z`;
};
export const ring = (cx: number, cy: number, r: number): Pt[] => {
  const n = Math.max(24, Math.round((r * 6.28) / 18));
  return Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 6.283), cy + r * Math.sin((i / n) * 6.283)] as Pt);
};
/** A band along the diagonal through (x, y), `w` wide, running off the frame at both ends. */
export const band = (x: number, y: number, w: number, len = 1600): Pt[] => {
  const [dx, dy] = DIAG;
  const [nx, ny] = [-dy * (w / 2), dx * (w / 2)];
  return [[x - dx * len + nx, y - dy * len + ny], [x + dx * len + nx, y + dy * len + ny], [x + dx * len - nx, y + dy * len - ny], [x - dx * len - nx, y - dy * len - ny]];
};

/** One cut piece of paper. It lands from `from` px away on twos and stops dead. */
export const Piece: React.FC<{ pts: Pt[]; fill: string; seed: number; at?: number; from?: Pt; shadow?: boolean; grow?: Pt }> = ({ pts, fill, seed, at = 0, from = [0, 0], shadow = true, grow }) => {
  const t = useSeconds();
  const p = ease(grow ? "grow" : "land", twos(t) - at);
  if (p <= 0) return null;
  const [dx, dy] = [(1 - p) * from[0], (1 - p) * from[1]];
  const transform = grow ? `translate(${grow[0]} ${grow[1]}) scale(${p}) translate(${-grow[0]} ${-grow[1]})` : `translate(${dx} ${dy})`;
  return <path d={scissor(pts, seed)} fill={fill} transform={transform} style={{ filter: shadow ? SHADOW : undefined }} />;
};

const Edge = React.createContext("");

/** One location: one flat ground, then a paper texture multiplied over everything. */
export const Ground: React.FC<{ hue: string; seed: number; children: React.ReactNode; dark?: boolean }> = ({ hue, seed, children, dark = false }) => {
  useFontsReady(FACES);
  const uid = useUid("set");
  const mottle = "0 0 0 0 0.25 0 0 0 0 0.2 0 0 0 0 0.14";
  return (
    <Edge.Provider value={`${uid}-cut`}>
      <AbsoluteFill style={{ backgroundColor: hue }}>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={`${uid}-cut`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency={0.028} numOctaves={2} seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale={E.edgeNoise[1] * 2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply" }}>
          <filter id={`${uid}-tex`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.11" numOctaves={3} seed={seed + 1} />
            <feColorMatrix type="matrix" values={`${mottle} ${E.streaks * 7} 0 0 0 ${-E.streaks * 2.4}`} />
          </filter>
          <rect width={W} height={H} filter={`url(#${uid}-tex)`} />
        </svg>
        {dark ? (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            <filter id={`${uid}-void`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.35} numOctaves={2} seed={seed + 2} />
              <feColorMatrix type="matrix" values={`0 0 0 0 0.94 0 0 0 0 0.89 0 0 0 0 0.79 ${E.voidSpeckle * 24} 0 0 0 ${-E.voidSpeckle * 18}`} />
            </filter>
            <rect width={W} height={H} filter={`url(#${uid}-void)`} opacity={0.4} />
          </svg>
        ) : null}
        <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
      </AbsoluteFill>
    </Edge.Provider>
  );
};

/** An SVG layer of the frame, for pieces. */
export const Set: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

/**
 * A line of credit in cut letters. `each`: letters fly in one by one along the diagonal on consecutive sixteenths; the
 * default slides the whole line along the diagonal. Both stop dead. *Emphasis* changes ink.
 */
export const Credit: React.FC<{ line: string; size: number; y: number; x?: number; at?: number; ink?: string; em?: string; each?: boolean; jaunty?: boolean; align?: "left" | "center"; seed?: number; box?: number }> = ({ line, size, y, x = M, at = 0, ink = C.ink, em = C.red, each = false, jaunty = false, align = "left", seed = 1, box }) => {
  const t = useSeconds();
  const edge = React.useContext(Edge);
  const rnd = seeded(seed * 53 + 11);
  const [maxRot, maxBase] = jaunty ? [E.titleRotate, E.titleBaseline] : [E.letterRotate, E.letterBaseline];
  const list = words(line).flatMap((w, k) => [...(k > 0 && !w.glue ? [{ ch: " ", em: false }] : []), ...[...w.text].map((ch) => ({ ch, em: w.em }))]);
  const whole = ease("land", t - at);
  if (!each && whole <= 0) return null;
  const slide = each ? 0 : 1 - whole;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: box,
        textAlign: align,
        whiteSpace: "pre",
        fontFamily: GOTHIC,
        fontSize: size,
        lineHeight: S.type.leading,
        filter: `url(#${edge}) ${SHADOW}`,
        transform: `translate(${-DIAG[0] * 700 * slide}px, ${-DIAG[1] * 700 * slide}px)`,
      }}
    >
      {list.map((g, i) => {
        const rot = (rnd() - 0.5) * 2 * maxRot;
        const base = (rnd() - 0.5) * 2 * maxBase;
        const p = each ? ease("land", twos(t) - at - i * E.sixteenth) : 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: g.em ? em : ink,
              opacity: p > 0 ? 1 : 0,
              transform: `translate(${-DIAG[0] * 500 * (1 - p)}px, ${base - DIAG[1] * 500 * (1 - p)}px) rotate(${rot}deg)`,
            }}
          >
            {g.ch}
          </span>
        );
      })}
    </div>
  );
};

/** The paper strip: scissor-cut ends, tilted, a small glyph as its bullet. Cream on dark sets, ink on light ones. */
export const Strip: React.FC<{ text: string; y: number; width: number; at?: number; onDark?: boolean; x?: number }> = ({ text, y, width, at = 0, onDark = true, x = M }) => {
  const p = ease("strip", useSeconds() - at);
  if (p <= 0) return null;
  const [bg, fg] = onDark ? [C.paper, C.ink] : [C.ink, C.paper];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        boxSizing: "border-box",
        padding: "18px 40px 12px 76px",
        backgroundColor: bg,
        color: fg,
        fontFamily: SPARTAN,
        fontWeight: 600,
        fontSize: S.type.body,
        lineHeight: 1.16,
        clipPath: "polygon(0 6%, 3% 0, 100% 3%, 98% 52%, 100% 100%, 2% 96%, 0.8% 60%)",
        transform: `translateX(${-(1 - p) * E.stripIn}px) rotate(${E.stripTilt}deg)`,
        filter: SHADOW,
      }}
    >
      <span style={{ position: "absolute", left: 30, top: 28, width: 24, height: 24, borderRadius: "50%", backgroundColor: C.red }} />
      {text}
    </div>
  );
};

const merge = (parts: Pt[][]): Pt[][] => parts;

/** A profile silhouette, about 7 heads tall, in a hat and coat, feet at (x, y). Generic, faceless, empty-handed. */
export const Figure: React.FC<{ x: number; y: number; height: number; fill?: string; gap: string; tie?: string; at?: number; lookUp?: boolean; flip?: boolean }> = ({ x, y, height, fill = C.ink, gap, tie = C.red, at = 0, lookUp = true, flip = false }) => {
  const t = useSeconds();
  const p = ease("land", twos(t) - at);
  if (p <= 0) return null;
  const u = height / (E.figureHeads + 0.3);
  const tilt = lookUp ? -0.32 : 0;
  const head = (hx: number, hy: number): [number, number] => {
    const [cx, cy] = [0.05, -5.75];
    const [dx, dy] = [hx - cx, hy - cy];
    return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
  };
  const body = merge([
    [[-0.62, -5.7], [0.46, -5.7], [0.66, -4.4], [0.56, -3.2], [0.72, -2.25], [-0.9, -2.25], [-0.74, -3.4], [-0.8, -4.6]],
    [[0.08, -2.4], [0.5, -2.4], [0.62, -0.24], [1.18, -0.12], [1.2, 0], [0.26, 0]],
    [[-0.62, -2.4], [-0.18, -2.4], [-0.3, -0.24], [0.14, -0.12], [0.16, 0], [-0.72, 0]],
    [[-0.28, -5.8], [0.26, -5.8], [0.26, -5.5], [-0.28, -5.5]],
  ]);
  const hat: Pt[][] = [
    [[-0.28, -6.42], [-0.04, -6.8], [0.56, -6.72], [0.6, -6.12], [0.84, -5.96], [0.56, -5.86], [0.46, -5.62], [-0.32, -5.66], [-0.46, -6]].map(([a, b]) => head(a, b)),
    [[-0.78, -6.42], [1.0, -6.5], [1.02, -6.38], [-0.76, -6.28]].map(([a, b]) => head(a, b)),
    [[-0.44, -6.4], [-0.34, -7.02], [0.52, -7.08], [0.64, -6.44]].map(([a, b]) => head(a, b)),
  ];
  const shapes = [...body, ...hat];
  const at2 = (pt: Pt): Pt => [x + (flip ? -1 : 1) * pt[0] * u, y + pt[1] * u];
  const d = shapes.map((s, i) => scissor(s.map(at2), 80 + i)).join("");
  const tieD = scissor(([[0.3, -5.62], [0.46, -5.62], [0.62, -4.3], [0.42, -4.1]] as Pt[]).map(at2), 90);
  const slit = (a: Pt, b: Pt, k: number) => <line key={k} x1={at2(a)[0]} y1={at2(a)[1]} x2={at2(b)[0]} y2={at2(b)[1]} stroke={gap} strokeWidth={E.slit} />;
  return (
    <g>
      <path d={d} fill="none" stroke={gap} strokeWidth={E.gap * 2} strokeLinejoin="round" />
      <path d={d} fill={fill} style={{ filter: SHADOW }} />
      <path d={tieD} fill={tie} />
      {[slit([-0.74, -5.1], [-0.34, -3.2], 1), slit([0.34, -2.4], [0.36, -1.3], 2)]}
    </g>
  );
};
