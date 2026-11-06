/**
 * Broadside's pieces: two registers that flood over each other, a waterfall of lowercase Barlow Black (opacity is
 * binary), a word rising out of a mask, mono chrome, the rule stub, the / bullet and the hairline chrome bars.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  ink: color(P, "background"),
  cream: color(P, "text"),
  muted: color(P, "muted"),
  hint: color(P, "faint"),
  orange: color(P, "accent"),
  line: color(P, "accent2"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;
export const COL = W - 2 * M;

/** Text colour for ink on the orange register. */
export const onOrange = (k: keyof typeof E.inkAlpha): string => rgba(C.ink, E.inkAlpha[k]);

/**
 * One register per frame. `fill` floods up from the bottom edge over the other register; at `leave`, `next` floods up over
 * everything. Waits for the fonts.
 */
export const Ground: React.FC<{ fill: string; from?: string; next?: string; leave?: number; children: React.ReactNode }> = ({ fill, from, next, leave, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const p = from ? ease("flood", t) : 1;
  const out = next && leave !== undefined ? ease("out", t - leave) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: from ?? fill, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: H * p, backgroundColor: fill }} />
      {children}
      {out > 0 ? <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: H * out, backgroundColor: next }} /> : null}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * The waterfall (T59): opacity is an instant set. Each word appears low and rises into place, the next starting as the
 * last settles; heavy lines travel further. `*stars*` take `em` (the one clause, orange on the dark register).
 */
export const Words: React.FC<{
  lines: string[];
  x?: number;
  y: number;
  size: number;
  at?: number;
  col?: string;
  em?: string;
  weight?: number;
  leading?: number;
  tracking?: number;
}> = ({ lines, x = M, y, size, at = 0, col = C.cream, em, weight = 900, leading = T.leading, tracking = size >= T.display ? T.tracking : size >= T.h1 ? T.trackingH1 : T.trackingH2 }) => {
  const t = useSeconds() - at;
  const heavy = size >= T.h1;
  const rec = heavy ? R.drop : R.word;
  const gap = style.motion.wordStagger;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${tracking}em`, color: col, whiteSpace: "nowrap", textTransform: "lowercase" }}>
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const local = t - i * gap;
            i += 1;
            const p = ease(heavy ? "drop" : "word", local);
            return (
              <React.Fragment key={wi}>
                {wi > 0 && !w.glue ? " " : null}
                <span style={{ display: "inline-block", visibility: local > 0 ? "visible" : "hidden", color: w.em && em ? em : undefined, transform: `translateY(${(1 - p) * rec.distance}px)` }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A hero word rising out of a mask (an alternative entrance for one display moment). */
export const Masked: React.FC<{ text: string; x?: number; y: number; size: number; at?: number; col?: string; tracking?: number }> = ({ text, x = M, y, size, at = 0, col = C.cream, tracking = T.tracking }) => {
  const p = ease("mask", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: x - size * 0.04, top: y, height: size * 1.02, padding: `0 ${size * 0.06}px`, overflow: "hidden", fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: `${size * 1.02}px`, letterSpacing: `${tracking}em`, color: col, whiteSpace: "nowrap" }}>
      <div style={{ transform: `translateY(${(1 - p) * 104}%)` }}>{text}</div>
    </div>
  );
};

/** A mono label: IBM Plex Mono 500 uppercase, tracked; chrome only. It's set at once, with no entrance of its own. */
export const Label: React.FC<{ text: string; x?: number; y: number; at?: number; col?: string; right?: boolean; opacity?: number; size?: number }> = ({ text, x = M, y, at = 0, col = C.muted, right = false, opacity = 1, size = T.label }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  return (
    <div style={{ position: "absolute", left: right ? undefined : x, right: right ? W - x : undefined, top: y, fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: `${T.labelTracking}em`, textTransform: "uppercase", lineHeight: 1.2, color: col, opacity, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** The rule stub: the only ornament. */
export const Stub: React.FC<{ x?: number; y: number; at?: number; col?: string }> = ({ x = M, y, at = 0, col = C.orange }) => {
  const p = ease("stub", useSeconds() - at);
  return <div style={{ position: "absolute", left: x, top: y, width: E.stub.w * p, height: E.stub.h, backgroundColor: col }} />;
};

/** Barlow body or lead. It drops a short way, set at once. */
export const Lead: React.FC<{ text: string; x?: number; y: number; w?: number; at?: number; col?: string; size?: number }> = ({ text, x = M, y, w = 840, at = 0, col = C.cream, size = T.lead }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("word", t);
  return <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: DISPLAY, fontWeight: 500, fontSize: size, lineHeight: 1.3, color: col, transform: `translateY(${(1 - p) * R.word.distance * 0.5}px)` }}>{text}</div>;
};

/** Hairline chrome bars at the top and bottom of a data frame, label left and number right. Suppressed on statement frames. */
export const Chrome: React.FC<{ label: string; n: number; at?: number }> = ({ label, n, at = 0 }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: M, top: L.barTop, width: COL, height: E.hairline, backgroundColor: C.line }} />
      <div style={{ position: "absolute", left: M, top: L.barBottom, width: COL, height: E.hairline, backgroundColor: C.line }} />
      <Label text={label} y={L.barTop + 16} at={at} />
      <Label text={String(n).padStart(2, "0")} x={W - M} y={L.barTop + 16} at={at} right />
    </>
  );
};
