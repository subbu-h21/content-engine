/**
 * Clean Launch's pieces: the white paper (with the camera's slow creep), statements that slam in batched with a short
 * entry blur and arrive in red before relaxing to ink, the red now-dot (inline, so it can be a full stop or a decimal
 * point, and able to iris the whole frame at frame 0), descriptors, mist windows, tracks and bars.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const T = style.type;
export const E = style.elements;
export const L = style.layout;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  mist: color(P, "surface"),
  ink: color(P, "text"),
  mute: color(P, "muted"),
  line: color(P, "faint"),
  red: color(P, "accent"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** Cinetic's rule: a move lasts 0.35 s + 1.35 ms per pixel travelled. */
export const durationFor = (px: number): number => S.motion.durationBase + S.motion.durationPerPx * Math.abs(px);

/** Mix two #rrggbb colours. */
export const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, clamp(t)));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

/** White paper; everything inside creeps (the camera never fully stops: at most +6% over a long hold). */
export const Ground: React.FC<{ children: React.ReactNode; creepOver?: number }> = ({ children, creepOver = 8 }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const s = 1 + S.motion.creep * 0.5 * clamp(t / creepOver);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * The red now-dot, inline so it sits on the baseline like a full stop. `irisFrom` > 0: at `at` it starts that many
 * times its size (covering the frame in red) and shrinks to itself in log space over the iris time.
 */
export const NowDot: React.FC<{ size?: number; at?: number; iris?: boolean; inline?: boolean; style?: React.CSSProperties }> = ({ size = L.dot, at = 0, iris = false, inline = true, style: st }) => {
  const t = useSeconds() - at;
  let scale = 1;
  if (iris) {
    const from = (2 * Math.hypot(W, H)) / size;
    const p = ease("iris", t);
    scale = Math.exp(lerp(Math.log(from), 0, p));
    if (t < 0) scale = from;
  } else {
    if (t <= 0) return <span style={{ display: inline ? "inline-block" : "block", width: size, height: size, ...st }} />;
    scale = Math.max(0, ease("pop", t));
  }
  return (
    <span
      style={{
        display: inline ? "inline-block" : "block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.red,
        transform: `scale(${scale})`,
        position: "relative",
        zIndex: iris && scale > 1.5 ? 10 : undefined,
        ...st,
      }}
    />
  );
};

/** A statement line: words slam in batched (0.03 s apart) from 60 px below with a 7 px blur for 0.1 s, arrive red, relax to ink. */
export const Statement: React.FC<{
  lines: string[];
  size: number;
  y: number;
  at: number;
  x?: number;
  align?: "left" | "center";
  dot?: { at: number; size?: number; iris?: boolean };
  red?: boolean;
  lineGap?: number;
}> = ({ lines, size, y, at, x = M, align = "left", dot, red = true, lineGap = 0.5 }) => {
  const t = useSeconds();
  const rc = S.motion.recipes;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        letterSpacing: `${T.tracking}em`,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {lines.map((line, li) => {
        const ws = words(line);
        const lineAt = at + li * lineGap;
        return (
          <div key={li}>
            {ws.map((w, wi) => {
              const a = lineAt + wi * S.motion.batch;
              const p = ease("out", t - a);
              const b = 1 - ease("blur", t - a);
              const landed = t - a - rc.out.duration;
              const col = red ? mix(C.red, C.ink, ease("relax", landed)) : C.ink;
              const em = w.em ? T.emphasisScale : 1;
              return (
                <React.Fragment key={wi}>
                  {wi > 0 ? " " : null}
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: `${em}em`,
                      color: col,
                      opacity: clamp((t - a) / 0.1),
                      transform: `translateY(${(1 - p) * rc.out.distance}px)`,
                      filter: b > 0 ? `blur(${b * rc.blur.distance}px)` : undefined,
                    }}
                  >
                    {w.text}
                  </span>
                </React.Fragment>
              );
            })}
            {dot && li === lines.length - 1 ? <NowDot size={dot.size} at={dot.at} iris={dot.iris} style={{ marginLeft: size * 0.06 }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

/** One piece of type slamming in (from 60 px below, 7 px blur for 0.1 s), arriving red unless `red` is false. */
export const Slam: React.FC<{ at: number; red?: boolean; children: React.ReactNode }> = ({ at, red = true, children }) => {
  const t = useSeconds() - at;
  const rc = S.motion.recipes;
  const p = ease("out", t);
  const b = 1 - ease("blur", t);
  const col = red ? mix(C.red, C.ink, ease("relax", t - rc.out.duration)) : C.ink;
  return (
    <span style={{ display: "inline-block", color: col, opacity: clamp(t / 0.1), transform: `translateY(${(1 - p) * rc.out.distance}px)`, filter: b > 0 ? `blur(${b * rc.blur.distance}px)` : undefined }}>
      {children}
    </span>
  );
};

/** A descriptor: 44 px, 500, grey, a short blur on entry. */
export const Descriptor: React.FC<{ text: string; y: number; at: number; x?: number; align?: "left" | "center"; width?: number }> = ({ text, y, at, x = M, align = "left", width = COLUMN }) => {
  const t = useSeconds() - at;
  const p = ease("out", t);
  if (t <= 0) return null;
  const b = 1 - ease("blur", t);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : x,
        width,
        top: y,
        textAlign: align,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: T.descriptor,
        lineHeight: 1.18,
        letterSpacing: `${T.descriptorTracking}em`,
        color: C.mute,
        opacity: clamp(t / 0.1),
        transform: `translateY(${(1 - p) * S.motion.recipes.out.distance * 0.5}px)`,
        filter: b > 0 ? `blur(${b * 5}px)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

/** A mist window with a hairline and a soft shadow, rising 120 px (outSoft). */
export const Window: React.FC<{ y: number; h: number; at: number; children?: React.ReactNode; w?: number }> = ({ y, h, at, children, w = Math.round(W * L.window.width) }) => {
  const t = useSeconds() - at;
  const p = ease("outSoft", t);
  if (t <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: (W - w) / 2,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        padding: L.window.pad,
        borderRadius: L.window.radius,
        background: C.mist,
        border: `${E.hairline}px solid ${C.line}`,
        boxShadow: E.shadow,
        opacity: clamp(t / 0.12),
        transform: `translateY(${(1 - p) * S.motion.recipes.outSoft.distance}px)`,
        fontFamily: SANS,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

/** UI text inside a window (32 px minimum in vertical). */
export const ui = (c: string = C.ink, weight = 500): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: weight,
  fontSize: T.ui,
  letterSpacing: `${T.uiTracking}em`,
  color: c,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});

/** A horizontal bar on a line-grey track, filling with the ui ease. */
export const Bar: React.FC<{ frac: number; at: number; width: number; c?: string }> = ({ frac, at, width, c = C.ink }) => {
  const p = ease("ui", useSeconds() - at);
  const b = E.bar;
  return (
    <div style={{ position: "relative", width, height: b.height, borderRadius: b.radius, background: C.line }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: b.height, borderRadius: b.radius, width: Math.max(b.height, width * frac * p), background: c, opacity: p > 0 ? 1 : 0 }} />
    </div>
  );
};

export { SANS };
