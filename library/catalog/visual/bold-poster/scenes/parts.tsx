/**
 * Bold Poster's pieces: white, red and dark plates that come down like a press, Shrikhand lines that stamp in and swing
 * to their tilt, Baskerville lines lifting out of a clip, red left bars, the double-ruled grid and the progress bar.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, lerp, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, LABEL } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  white: color(P, "background"),
  light: color(P, "surface"),
  dark: color(P, "text"),
  red: color(P, "accent"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;

/** The stacked text shadow: only on red panels. `k` scales the steps for big type. */
export const stacked = (k: number = E.stackScale): string => E.stackShadow.map((s) => `${s.step * k}px ${s.step * k}px 0 ${rgba(C.dark, s.alpha)}`).join(", ");

/**
 * The frame. `plate` (red or dark) comes down over the white like a press plate, full bleed; on white, the foot is the
 * light stripe. The progress bar steps on to `index`. At `leave` the `next` plate comes down over everything.
 */
export const Ground: React.FC<{ plate?: string; index: number; next?: string; leave?: number; children: React.ReactNode }> = ({ plate, index, next, leave, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const p = plate ? ease("plate", t) : 1;
  const out = next && leave !== undefined ? ease("out", t - leave) : 0;
  const q = ease("progress", t - 0.2);
  const bar = plate === C.red ? C.white : C.red;
  const y = L.progressY;
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, overflow: "hidden" }}>
      {plate ? null : <div style={{ position: "absolute", left: 0, top: y, width: W, height: H - y, backgroundColor: C.light }} />}
      {plate ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H * p, backgroundColor: plate }} /> : null}
      {children}
      <div style={{ position: "absolute", left: 0, top: y, width: (W * lerp(index - 1, index, q)) / E_SCENES, height: E.progress, backgroundColor: bar }} />
      {out > 0 ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H * out, backgroundColor: next }} /> : null}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};
const E_SCENES = E.scenes;

/**
 * One Shrikhand line. It appears at once, oversized, and stamps down in 0.26 s (opacity is binary). With `swing` it lands
 * flat, then the tilt swings in on a spring, pivoting at its left baseline: the style's signature.
 */
export const Stamp: React.FC<{
  text: string;
  x?: number;
  y: number;
  size: number;
  at?: number;
  tilt?: number;
  swing?: boolean;
  col?: string;
  shadow?: string;
  center?: boolean;
}> = ({ text, x = M, y, size, at = 0, tilt = 0, swing = false, col = C.dark, shadow, center = false }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const s = lerp(R.stamp.from, 1, ease("stamp", t));
  const r = swing ? tilt * ease("swing", t - R.stamp.duration) : tilt;
  return (
    <div
      style={{
        position: "absolute",
        left: center ? 0 : x,
        right: center ? 0 : undefined,
        top: y,
        textAlign: center ? "center" : "left",
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: T.leading,
        color: col,
        whiteSpace: "nowrap",
        textShadow: shadow,
        transformOrigin: center ? "50% 60%" : "0% 80%",
        transform: `rotate(${r}deg) scale(${s})`,
      }}
    >
      {text}
    </div>
  );
};

/** A label: Space Grotesk 600 uppercase; red, or white on a red plate. It lifts out of a clip. */
export const Label: React.FC<{ text: string; x?: number; y: number; at?: number; col?: string; size?: number }> = ({ text, x = M, y, at = 0, col = C.red, size = T.label }) => {
  const p = ease("lift", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: x, top: y, overflow: "hidden", fontFamily: LABEL, fontWeight: 600, fontSize: size, letterSpacing: `${T.labelTracking}em`, lineHeight: 1.2, textTransform: "uppercase", color: col, whiteSpace: "nowrap" }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{text}</div>
    </div>
  );
};

/** Baskerville body, lifting out of a clip. */
export const Body: React.FC<{ text: string; x?: number; y: number; w: number; at?: number; col?: string; size?: number; italic?: boolean; center?: boolean }> = ({ text, x = M, y, w, at = 0, col = C.dark, size = T.body, italic = false, center = false }) => {
  const p = ease("lift", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, overflow: "hidden", paddingBottom: 8, fontFamily: BODY, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: T.bodyLeading, color: col, textAlign: center ? "center" : "left" }}>
      <div style={{ transform: `translateY(${(1 - p) * 100}%)` }}>{text}</div>
    </div>
  );
};

/** The red left bar: a rule drawing down beside something. */
export const LeftBar: React.FC<{ x?: number; y: number; h: number; at?: number; col?: string }> = ({ x = M, y, h, at = 0, col = C.red }) => {
  const p = ease("rule", useSeconds() - at);
  return <div style={{ position: "absolute", left: x, top: y, width: E.leftBar, height: h * p, backgroundColor: col }} />;
};

/** The double-ruled grid: a heavy outer border and thin inner rules, all drawn down from the top. `rows`/`cols` are inner rule positions. */
export const Grid: React.FC<{ x: number; y: number; w: number; h: number; at?: number; rows?: number[]; cols?: [number, number, number][]; col?: string }> = ({ x, y, w, h, at = 0, rows = [], cols = [], col = C.dark }) => {
  const t = useSeconds() - at;
  const p = ease("plate", t);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `${E.grid.outer}px solid ${col}`, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>
      {rows.map((ry) => (
        <div key={ry} style={{ position: "absolute", left: 0, right: 0, top: ry, height: E.grid.inner, backgroundColor: col }} />
      ))}
      {cols.map(([cx, y0, y1]) => (
        <div key={`${cx}-${y0}`} style={{ position: "absolute", left: cx, top: y0, width: E.grid.inner, height: y1 - y0, backgroundColor: col }} />
      ))}
    </div>
  );
};
