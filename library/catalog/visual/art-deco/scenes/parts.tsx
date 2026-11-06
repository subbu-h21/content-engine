/** Art Deco's pieces: metal gradient, gold keyline, stepped plaques and arches, sunburst, fish scales, bulbs. Values come from style.json. */
import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, pulse, rgba, run, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const CX = W / 2;
export const E = style.elements;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  lacquer: color(P, "surface"),
  text: color(P, "text"),
  gold: color(P, "muted"),
  shadow: color(P, "faint"),
  accent: color(P, "accent"),
  jewel: color(P, "accent2"),
  light: color(P, "goldLight"),
  hot: color(P, "goldHot"),
  exception: color(P, "exception"),
  skyTop: color(P, "skyTop"),
  horizon: color(P, "horizon"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

export type Pt = [number, number];

/** Banded metal: dark, light, hot, light, dark. The offset moves the bands: that's the sheen. */
const BANDS: [number, string][] = [
  [0, C.shadow],
  [0.22, C.gold],
  [0.42, C.light],
  [0.5, C.hot],
  [0.58, C.light],
  [0.78, C.gold],
  [1, C.shadow],
];
const Metal = createContext({ id: "gold", off: 0 });
const useMetal = () => useContext(Metal);

/** The metal as a CSS gradient for type: its dark band is lifted to gold base, so a word never sinks into the ground. */
const goldCss = (off: number): string => {
  const o = off * E.goldPeriod;
  return `repeating-linear-gradient(108deg, ${BANDS.map(([s, c]) => `${c === C.shadow ? C.gold : c} ${(o + s * E.goldPeriod).toFixed(1)}px`).join(", ")})`;
};

export const Art: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

export const poly = (pts: Pt[], close = true): string => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}${close ? "Z" : ""}`;

/** A rectangle with `n` steps cut out of each corner. */
export const steppedRect = (cx: number, cy: number, w: number, h: number, step: number, n: number): Pt[] => {
  const [l, t] = [cx - w / 2, cy - h / 2];
  const q: Pt[] = [[l, t + n * step]];
  for (let i = 1; i <= n; i++) q.push([l + i * step, t + (n - i + 1) * step], [l + i * step, t + (n - i) * step]);
  const mx = ([x, y]: Pt): Pt => [2 * cx - x, y];
  const my = ([x, y]: Pt): Pt => [x, 2 * cy - y];
  return [...q, ...q.map(mx).reverse(), ...q.map((p) => my(mx(p))), ...q.map(my).reverse()];
};

/** A stepped arch standing on `bottom`: a ziggurat of `n` steps, symmetrical about the axis. */
export const steppedArch = (top: number, bottom: number, w: number, sx: number, sy: number, n: number): Pt[] => {
  const l = CX - w / 2;
  const q: Pt[] = [[l, bottom], [l, top + n * sy]];
  for (let i = 1; i <= n; i++) q.push([l + i * sx, top + (n - i + 1) * sy], [l + i * sx, top + (n - i) * sy]);
  return [...q, ...q.map(([x, y]): Pt => [W - x, y]).reverse()];
};

/** Points along a polyline: one on every corner, the rest evenly spaced between corners, about `spacing` apart. */
export const along = (pts: Pt[], spacing: number, closed = false): Pt[] => {
  const path = closed ? [...pts, pts[0]] : pts;
  const out: Pt[] = [];
  for (let i = 0; i + 1 < path.length; i++) {
    const [[x0, y0], [x1, y1]] = [path[i], path[i + 1]];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / spacing));
    for (let k = 0; k < n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  if (!closed) out.push(path[path.length - 1]);
  return out;
};

/** The signature stroke: a dark engraved underline, the banded gold line, a hairline highlight. `p` draws it on. */
export const Gline: React.FC<{ d: string; w?: number; p?: number }> = ({ d, w = E.keyline, p = 1 }) => {
  const { id } = useMetal();
  if (p <= 0) return null;
  const dash = { pathLength: 1, strokeDasharray: `${p} 1` };
  return (
    <g fill="none" strokeLinejoin="miter">
      <path d={d} stroke={C.lacquer} strokeWidth={w + E.underline} {...dash} />
      <path d={d} stroke={`url(#${id})`} strokeWidth={w} {...dash} />
      <path d={d} stroke={C.hot} strokeWidth={Math.max(0.6, w * 0.22)} strokeOpacity={0.6} {...dash} />
    </g>
  );
};

/** The frame every shot sits in, drawn on in the first second. */
const Keyframe: React.FC = () => {
  const t = useSeconds();
  const i = E.frameInset;
  const p = ease("draw", t);
  return (
    <Art>
      <Gline d={poly(steppedRect(CX, H / 2, W - 2 * i, H - 2 * i, E.frameStep, 2))} p={p} />
      <Gline d={poly(steppedRect(CX, H / 2, W - 2 * i - 18, H - 2 * i - 18, E.frameStep, 2))} w={1.2} p={p} />
    </Art>
  );
};

/** Warm black (or night sky) ground, the metal, the persistent stepped keyline and the finish; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode; sky?: boolean; sheenAt?: number }> = ({ children, sky = false, sheenAt = 1.5 }) => {
  useFontsReady(FACES);
  const id = useUid("gold");
  const off = lerp(-0.2, 1.2, ease("sheen", useSeconds() - sheenAt));
  const g = E.goldPeriod;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, backgroundImage: sky ? `linear-gradient(180deg, ${C.skyTop} 0%, ${C.horizon} 62%, ${C.bg} 100%)` : undefined }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={g} y2={g * 0.32} spreadMethod="repeat" gradientTransform={`translate(${off * g} 0)`}>
            {BANDS.map(([s, c]) => (
              <stop key={s} offset={s} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      </svg>
      <Metal.Provider value={{ id, off }}>
        {children}
        <Keyframe />
      </Metal.Provider>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Sparkle: React.FC<{ x: number; y: number; r: number; at?: number; fill?: string }> = ({ x, y, r, at = 0, fill }) => {
  const { id } = useMetal();
  const t = useSeconds() - at;
  const p = ease("rise", t);
  if (p <= 0) return null;
  const k = r * p * (1 + 0.5 * pulse(t, 0.3, 0.1));
  return <path d={`M${x} ${y - k}Q${x} ${y} ${x + k} ${y}Q${x} ${y} ${x} ${y + k}Q${x} ${y} ${x - k} ${y}Q${x} ${y} ${x} ${y - k}Z`} fill={fill ?? `url(#${id})`} />;
};

/** 72 alternating wedges behind everything, slowly turning, fading out with distance. */
export const Sunburst: React.FC<{ cy: number; r: number; at?: number; alpha?: number }> = ({ cy, r, at = 0, alpha = E.sunburstAlpha }) => {
  const uid = useUid("burst");
  const s = useSeconds();
  const p = ease("burst", s - at);
  if (p <= 0) return null;
  const n = E.sunburstRays;
  const step = (Math.PI * 2) / n;
  const rot = (s * E.sunburstSpin * Math.PI) / 180;
  const rr = r * p;
  let d = "";
  for (let i = 0; i < n; i += 2) {
    const [a, b] = [i * step + rot, (i + 1) * step + rot];
    d += `M${CX} ${cy}L${(CX + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}L${(CX + rr * Math.cos(b)).toFixed(1)} ${(cy + rr * Math.sin(b)).toFixed(1)}Z`;
  }
  return (
    <Art>
      <defs>
        <radialGradient id={uid} gradientUnits="userSpaceOnUse" cx={CX} cy={cy} r={r}>
          <stop offset={0} stopColor={C.light} stopOpacity={alpha} />
          <stop offset={0.55} stopColor={C.gold} stopOpacity={alpha * 0.55} />
          <stop offset={1} stopColor={C.shadow} stopOpacity={alpha * 0.12} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${uid})`} />
    </Art>
  );
};

/** Fish scales: lower half-circles, overlapping row by row, with an inner arc; the rows rise in one after another. */
export const Scales: React.FC<{ top: number; rows?: number; at?: number }> = ({ top, rows = E.scaleRows, at = 0.2 }) => {
  const uid = useUid("scale");
  const t = useSeconds();
  const r = E.scale;
  const cols = Math.ceil(W / (2 * r)) + 2;
  const out: React.ReactNode[] = [];
  for (let row = rows - 1; row >= 0; row--) {
    const p = ease("scale", t - at - row * 0.08);
    if (p <= 0) continue;
    const y = top + row * r * 0.72 + (1 - p) * 30;
    for (let c = 0; c < cols; c++) {
      const x = c * 2 * r - (row % 2 ? r : 0);
      const q = r * 0.62;
      out.push(
        <g key={`${row}-${c}`} opacity={p}>
          <path d={`M${x - r} ${y}A${r} ${r} 0 0 0 ${x + r} ${y}Z`} fill={`url(#${uid})`} stroke={C.gold} strokeOpacity={0.75} strokeWidth={2} />
          <path d={`M${x - q} ${y}A${q} ${q} 0 0 0 ${x + q} ${y}`} fill="none" stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.5} />
        </g>,
      );
    }
  }
  return (
    <Art>
      <defs>
        <linearGradient id={uid} x1={0.1} y1={0} x2={0.8} y2={1}>
          <stop offset={0} stopColor={mix(C.jewel, C.light, 0.12)} />
          <stop offset={1} stopColor={mix(C.jewel, C.lacquer, 0.72)} />
        </linearGradient>
      </defs>
      {out}
    </Art>
  );
};

/** Bulbs lighting one after another: a flash past full brightness that settles, then a slow chase. */
export const Bulbs: React.FC<{ pts: Pt[]; at?: number }> = ({ pts, at = 0.6 }) => {
  const t = useSeconds();
  const b = E.bulb;
  return (
    <Art>
      {pts.map(([x, y], i) => {
        const t0 = at + i * b.per;
        if (t < t0) return <circle key={i} cx={x} cy={y} r={b.r * 0.8} fill={C.shadow} />;
        const flash = 1 + (b.flash - 1) * pulse(t, t0, b.settle / 3);
        const chase = Math.floor((t - at) / b.chase) % 4 === i % 4 ? 1 : 0.82;
        const v = flash * chase;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={b.r * 2.4} fill={C.light} opacity={clamp(0.2 * v)} />
            <circle cx={x} cy={y} r={b.r * Math.min(1.25, v)} fill={mix(C.light, C.hot, clamp(v - 0.4))} stroke={C.shadow} strokeWidth={1.5} />
          </g>
        );
      })}
    </Art>
  );
};

/** A hard-edged airbrushed fill: light from the upper left, inside the shape. */
export const Airbrush: React.FC<{ id: string; from: string; to: string }> = ({ id, from, to }) => (
  <linearGradient id={id} x1={0.1} y1={0} x2={0.75} y2={1}>
    <stop offset={0} stopColor={from} />
    <stop offset={1} stopColor={to} />
  </linearGradient>
);

/** The hero: a burgundy volume, airbrushed from the upper left, with a double gold rim. */
export const Medallion: React.FC<{ x?: number; y: number; r: number; at?: number }> = ({ x = CX, y, r, at = 0 }) => {
  const uid = useUid("hero");
  const p = ease("unfold", useSeconds() - at);
  if (p <= 0) return null;
  const k = r * p;
  const ring = (a: number) => `M${x - a} ${y}A${a} ${a} 0 1 1 ${x + a} ${y}A${a} ${a} 0 1 1 ${x - a} ${y}Z`;
  return (
    <>
      <defs>
        <radialGradient id={uid} cx={0.34} cy={0.3} r={0.85}>
          <stop offset={0} stopColor={mix(C.accent, C.light, 0.28)} />
          <stop offset={0.45} stopColor={C.accent} />
          <stop offset={1} stopColor={mix(C.accent, C.lacquer, 0.72)} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={k} fill={`url(#${uid})`} />
      <Gline d={ring(k)} w={5} />
      <Gline d={ring(k * 0.9)} w={1.4} />
    </>
  );
};

/** A diamond badge on the axis. */
export const Diamond: React.FC<{ y: number; r: number; at?: number }> = ({ y, r, at = 0 }) => {
  const p = ease("unfold", useSeconds() - at);
  if (p <= 0) return null;
  const k = r * p;
  const d = poly([[CX, y - k], [CX + k, y], [CX, y + k], [CX - k, y]]);
  return (
    <>
      <path d={d} fill={C.lacquer} />
      <Gline d={d} w={4} />
    </>
  );
};

/** The title grammar: a point, a hairline, bars opening symmetrically, then the text rises. A lacquer bar with stepped ends and a double keyline. */
export const Plaque: React.FC<{ y: number; w: number; h: number; at?: number; children?: React.ReactNode }> = ({ y, w, h, at = 0, children }) => {
  const t = useSeconds() - at;
  const p = ease("unfold", t);
  if (p <= 0) return null;
  const ww = w * clamp(p / 0.6);
  const hh = Math.max(3, h * clamp((p - 0.45) / 0.55));
  const step = Math.min(E.plaqueStep, hh / 5, ww / 5);
  const g = E.plaqueGap;
  const q = ease("rise", t - 0.5);
  const outer = steppedRect(CX, y, ww, hh, step, 2);
  const inner = steppedRect(CX, y, Math.max(1, ww - 2 * g), Math.max(1, hh - 2 * g), step, 2);
  return (
    <>
      <Art>
        <path d={poly(outer)} fill={rgba(C.lacquer, E.plaqueAlpha)} />
        <Gline d={poly(outer)} />
        {hh > 3 * g ? <Gline d={poly(inner)} w={1.2} /> : null}
      </Art>
      <div
        style={{
          position: "absolute",
          left: CX - w / 2,
          width: w,
          top: y - h / 2,
          height: h,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          opacity: Math.max(0, q),
          transform: `translateY(${(1 - q) * style.motion.recipes.rise.distance}px)`,
        }}
      >
        {children}
      </div>
    </>
  );
};

/** Tracked capitals in gold base. */
export const Eyebrow: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color: col = C.gold, size = style.type.eyebrow }) => (
  <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: size, letterSpacing: style.type.eyebrowTracking, textTransform: "uppercase", color: col, lineHeight: 1, paddingTop: size * 0.18, whiteSpace: "nowrap" }}>{text}</div>
);

export const Body: React.FC<{ text: string; size?: number; width?: number }> = ({ text, size = style.type.body, width }) => (
  <div style={{ fontFamily: BODY, fontWeight: 400, fontSize: size, lineHeight: 1.26, color: C.text, width, textAlign: "center", textWrap: "balance" }}>{text}</div>
);

/** Limelight capitals on the centre axis. Emphasis is the gold metal, swept by the sheen; words rise one after another. */
export const Caps: React.FC<{ lines: string[]; size: number; y: number; at?: number }> = ({ lines, size, y, at = 0 }) => {
  const t = useSeconds() - at;
  const { off } = useMetal();
  const { distance } = style.motion.recipes.rise;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: DISPLAY, fontSize: size, lineHeight: `${size * style.type.leading}px`, letterSpacing: style.type.tracking, whiteSpace: "nowrap", color: C.text }}>
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("rise", t - i * style.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 && !w.glue ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    opacity: Math.max(0, p),
                    transform: `translateY(${(1 - p) * distance}px)`,
                    filter: `drop-shadow(0 3px 0 ${C.lacquer})`,
                    ...(w.em ? { backgroundImage: goldCss(off), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}),
                  }}
                >
                  {w.text.toUpperCase()}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Big numerals in the gold metal. */
export const GoldNumber: React.FC<{ text: string; unit: string; size: number; font: string; y: number; opacity?: number }> = ({ text, unit, size, font, y, opacity = 1 }) => {
  const { off } = useMetal();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: font, fontSize: size, lineHeight: 1, opacity }}>
      <span style={{ display: "inline-block", backgroundImage: goldCss(off), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 4px 0 ${C.lacquer})`, padding: "0 12px" }}>
        {text}
        <span style={{ fontFamily: BODY, fontWeight: 400, fontSize: size * 0.5, marginLeft: size * 0.04 }}>{unit}</span>
      </span>
    </div>
  );
};

/** Door leaves hinged at the frame edges, swinging open from the centre seam. */
export const Doors: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const p = ease("door", useSeconds() - at);
  if (p >= 1) return null;
  const leaf = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: 0,
    width: W / 2,
    backgroundImage: `linear-gradient(115deg, ${mix(C.jewel, C.lacquer, 0.55)}, ${C.lacquer})`,
    borderLeft: side === "right" ? `3px solid ${C.gold}` : undefined,
    borderRight: side === "left" ? `3px solid ${C.gold}` : undefined,
    transformOrigin: side,
    transform: `rotateY(${(side === "left" ? 1 : -1) * 96 * p}deg)`,
  });
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1800 }}>
      <div style={leaf("left")} />
      <div style={leaf("right")} />
    </div>
  );
};
