/**
 * One-Shape Morph's pieces: the warm-grey stage, the camera (world px × cam), the one shape whose size and radius
 * spring between states, the blur content-swap, badges and chips, icons on one 2.2 stroke, skeleton lines, bars,
 * progress lanes and the cursor. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const C = {
  bg: color(style.palette, "background"),
  ink: color(style.palette, "text"),
  surface: color(style.palette, "surface"),
  muted: color(style.palette, "muted"),
  muted2: color(style.palette, "muted2"),
  faint: color(style.palette, "faint"),
  skeleton: color(style.palette, "skeleton"),
  docLine: color(style.palette, "docLine"),
  accent: color(style.palette, "accent"),
  accent2: color(style.palette, "accent2"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export type State = { w: number; h: number; r: number };
export const ST = style.layout.states as Record<string, State>;

/** The stage: warm grey, no grain, no vignette; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SANS, fontFeatureSettings: '"tnum"', color: C.ink }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** World → screen: world (0, 0) is the shape's centre, at (W/2, centerY) on screen, scaled by `cam`. */
export const toScreen = (cam: number, x: number, y: number): [number, number] => [W / 2 + x * cam, S.layout.centerY + y * cam];

/** The camera: everything inside is in world px around the shape's centre. */
export const Stage: React.FC<{ cam: number; children: React.ReactNode }> = ({ cam, children }) => (
  <div style={{ position: "absolute", left: W / 2, top: S.layout.centerY, transform: `scale(${cam})`, transformOrigin: "0 0" }}>{children}</div>
);

/** A value that springs from `from` to `to` starting at `at`. */
export const track = (t: number, from: number, to: number, at: number, rec: keyof typeof style.motion.recipes = "morph"): number => from + (to - from) * ease(rec, t - at);

/**
 * The one shape. It morphs from `from` to `to` on the MORPH spring (radius clamped to half the height); `intro` pops it
 * in (scale 0.55 + 0.45·S, opacity over 0.12 s); `press` (a time) dips it 3.5%.
 */
export const Shape: React.FC<{ from?: State; to: State; at?: number; fill?: string; intro?: number; press?: number; children?: React.ReactNode }> = ({
  from,
  to,
  at = 0.05,
  fill = C.surface,
  intro,
  press,
  children,
}) => {
  const t = useSeconds();
  const f = from ?? to;
  const w = track(t, f.w, to.w, at);
  const h = track(t, f.h, to.h, at);
  const r = Math.min(track(t, f.r, to.r, at), h / 2);
  let sc = 1;
  let op = 1;
  if (intro !== undefined) {
    sc = 0.55 + 0.45 * ease("intro", t - intro);
    op = clamp((t - intro) / 0.12);
  }
  if (press !== undefined) {
    const down = ease("press", t - (press - S.motion.pressLead));
    const up = ease("release", t - (press + S.motion.releaseAfter));
    sc *= 1 - S.motion.pressScale * clamp(down - up);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${sc})`, opacity: op }}>
      <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: r, backgroundColor: fill, boxShadow: S.finish.shadow }} />
      {children}
    </div>
  );
};

/** The blur content-swap (`M.vis`): waits 0.07 s, then comes in from a 12 px blur at 0.94 scale, plus an optional shift. */
export const Vis: React.FC<{ at: number; dx?: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dx = 0, dy = 0, style: st, children }) => {
  const p = ease("vis", useSeconds() - at - S.motion.visDelay);
  if (p <= 0) return null;
  const s = lerp(S.motion.visScale, 1, p);
  return (
    <div
      style={{
        position: "absolute",
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * S.motion.visBlur}px)` : undefined,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${s})`,
        ...st,
      }}
    >
      {children}
    </div>
  );
};

/** A pill badge (padding 6/14, 999 radius); `pop` springs it in with the badge spring. */
export const Badge: React.FC<{ text: string; at: number; size?: number; bg?: string; fg?: string; pad?: [number, number] }> = ({ text, at, size = S.type.badge, bg = C.accent, fg = "#ffffff", pad = [6, 14] }) => {
  const p = ease("badge", useSeconds() - at);
  return (
    <span
      style={{
        display: "inline-block",
        padding: `${pad[0]}px ${pad[1]}px`,
        borderRadius: 999,
        backgroundColor: bg,
        color: fg,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.15,
        transform: `scale(${clamp(p, 0, 1.2)})`,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
      }}
    >
      {text}
    </span>
  );
};

const PATHS: Record<string, string> = {
  arrow: "M4 12 H19 M13 6 L19 12 L13 18",
  check: "M5 12.5 L10 17.5 L19 7",
  sparkle: "M12 3 C12.7 8.3 15.7 11.3 21 12 C15.7 12.7 12.7 15.7 12 21 C11.3 15.7 8.3 12.7 3 12 C8.3 11.3 11.3 8.3 12 3 Z",
  pencil: "M4 20 L8.5 19 L19.5 8 L16 4.5 L5 15.5 Z M14 6.5 L17.5 10",
  file: "M6.5 3 H14 L18.5 7.5 V21 H6.5 Z M14 3 V7.5 H18.5",
  sun: "M12 8.5 A3.5 3.5 0 1 1 11.99 8.5 Z M12 2.5 V4.5 M12 19.5 V21.5 M2.5 12 H4.5 M19.5 12 H21.5 M5.3 5.3 L6.7 6.7 M17.3 17.3 L18.7 18.7 M5.3 18.7 L6.7 17.3 M17.3 6.7 L18.7 5.3",
  list: "M9 6 H20 M9 12 H20 M9 18 H20 M4.5 6 H5 M4.5 12 H5 M4.5 18 H5",
};

/** An icon on the 24 grid with the stroke normalised to 2.2 world px whatever its size; round caps and joins. */
export const Icon: React.FC<{ name: keyof typeof PATHS | string; size: number; col?: string; fill?: boolean; stroke?: number }> = ({ name, size, col = C.ink, fill = false, stroke = S.layout.iconStroke }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
    <path d={PATHS[name]} fill={fill ? col : "none"} stroke={col} strokeWidth={(stroke * 24) / size} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Skeleton text lines that grow one after another (body copy without words). */
export const Skeleton: React.FC<{ x: number; y: number; widths: number[]; at: number; h?: number; gap?: number; col?: string }> = ({ x, y, widths, at, h = 13, gap = 30, col = C.skeleton }) => {
  const t = useSeconds();
  return (
    <>
      {widths.map((w, i) => {
        const p = ease("skeleton", t - at - i * S.motion.skeletonStagger);
        return <div key={i} style={{ position: "absolute", left: x, top: y + i * gap, width: w * clamp(p), height: h, borderRadius: h / 2, backgroundColor: col }} />;
      })}
    </>
  );
};

/** A colour pulse toward the accent: a Gaussian of sigma 0.16 s around `at`. */
export const pulse = (t: number, at: number): number => Math.exp(-((t - at) ** 2) / (2 * S.motion.pulseSigma ** 2));

/** Generic arrow pointer: ink fill, white 2.6 stroke, 46 px on screen whatever the camera. */
export const Cursor: React.FC<{ keys: [number, number, number][]; press?: number }> = ({ keys, press }) => {
  const t = useSeconds();
  if (t < keys[0][0]) return null;
  let [x, y] = [keys[keys.length - 1][1], keys[keys.length - 1][2]];
  for (let k = 1; k < keys.length; k++) {
    const [t0, x0, y0] = keys[k - 1];
    const [t1, x1, y1] = keys[k];
    if (t <= t1) {
      const u = clamp((t - t0) / (t1 - t0));
      const e = u * u * u * (u * (6 * u - 15) + 10);
      const arc = Math.sin(Math.PI * e) * S.motion.cursorArc;
      x = lerp(x0, x1, e) - (y1 - y0) * arc;
      y = lerp(y0, y1, e) + (x1 - x0) * arc;
      break;
    }
  }
  let p = 0;
  if (press !== undefined) p = clamp(ease("press", t - (press - S.motion.pressLead)) - ease("release", t - (press + S.motion.releaseAfter)));
  const size = S.layout.cursor;
  return (
    <svg
      width={size * 0.68}
      height={size}
      viewBox="0 0 24 36"
      style={{ position: "absolute", left: x - 2, top: y - 2, overflow: "visible", transform: `scale(${1 - S.motion.cursorPressScale * p})`, transformOrigin: "2px 2px", filter: `drop-shadow(${S.finish.cursorShadow})`, opacity: clamp((t - keys[0][0]) / 0.15) }}
    >
      <path d="M2 2 L2 28 L8.5 22 L13 32.5 L17 30.8 L12.6 20.8 L21 20.8 Z" fill={C.ink} stroke="#ffffff" strokeWidth={2.6 * (36 / size)} strokeLinejoin="round" />
    </svg>
  );
};

export { MONO, SANS, rgba };
