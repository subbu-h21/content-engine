/**
 * Cartesian's pieces: the stone ground with its drafting guide, compass rings that draw themselves round, hairlines that
 * rule across, words traced on left to right, taupe labels and the one ink rule. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  stone: color(P, "background"),
  deep: color(P, "surface"),
  ink: color(P, "text"),
  grey: color(P, "muted"),
  line: color(P, "faint"),
  taupe: color(P, "accent"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;
export const COL = W - 2 * M;

/** Stone, plus the vertical drafting guide. `leave` fades the drawing off the sheet. Waits for the fonts. */
export const Ground: React.FC<{ leave?: number; guide?: boolean; children: React.ReactNode }> = ({ leave, guide = true, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const out = leave === undefined ? 0 : ease("out", t - leave);
  const g = ease("rule", t);
  return (
    <AbsoluteFill style={{ backgroundColor: C.stone, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 1 - out }}>
        {guide ? <div style={{ position: "absolute", left: L.guideX, top: 0, width: E.hairline, height: H * g, backgroundColor: C.taupe, opacity: E.guideAlpha }} /> : null}
        {children}
      </AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A compass ring: a solid circle drawn round from the top, then its dashed inner ring. Max 1-2 per frame. */
export const Ring: React.FC<{ cx: number; cy: number; r: number; at?: number; dashed?: boolean; inner?: number; alpha?: number }> = ({ cx, cy, r, at = 0, dashed = true, inner = E.ring.inner, alpha = E.ring.alpha }) => {
  const t = useSeconds() - at;
  const p = ease("compass", t);
  const q = ease("fade", t - R.compass.duration * 0.7);
  const c = 2 * Math.PI * r;
  if (p <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.taupe} strokeOpacity={alpha} strokeWidth={E.hairline} strokeDasharray={`${c * p} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />
      {dashed && q > 0 ? <circle cx={cx} cy={cy} r={r * inner} fill="none" stroke={C.taupe} strokeOpacity={E.ring.dashedAlpha * q} strokeWidth={E.hairline} strokeDasharray={E.ring.dash.join(" ")} /> : null}
    </svg>
  );
};

/** A hairline ruled across from (x1, y1) to (x2, y2). `ink` is the one ink rule. */
export const Line: React.FC<{ x1: number; y1: number; x2: number; y2: number; at?: number; ink?: boolean; col?: string }> = ({ x1, y1, x2, y2, at = 0, ink = false, col }) => {
  const p = ease("rule", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={col ?? (ink ? C.ink : C.taupe)} strokeWidth={E.hairline} />
    </svg>
  );
};

/** The mask of a line being traced on: a soft edge sweeping from left to right. */
const traced = (p: number): React.CSSProperties => {
  if (p >= 1) return {};
  const soft = R.trace.soft;
  const edge = p * (100 + soft);
  const m = `linear-gradient(90deg, #000 ${edge - soft}%, transparent ${edge}%)`;
  return { WebkitMaskImage: m, maskImage: m };
};

/** Playfair 400 lines, each traced on from left to right. `*stars*` are the italic key word. */
export const Traced: React.FC<{ lines: string[]; x?: number; y: number; size: number; at?: number; align?: "left" | "center"; leading?: number; col?: string }> = ({ lines, x = M, y, size, at = 0, align = "left", leading = T.leading, col = C.ink }) => {
  const t = useSeconds() - at;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y, textAlign: align, fontFamily: DISPLAY, fontWeight: 400, fontSize: size, lineHeight: `${size * leading}px`, color: col, whiteSpace: "nowrap" }}>
      {lines.map((line, i) => {
        const p = ease("trace", t - i * style.motion.stagger);
        if (p <= 0) return <div key={i} style={{ height: size * leading }} />;
        return (
          <div key={i} style={{ height: size * leading }}>
            <span style={{ display: "inline-block", paddingRight: size * 0.14, marginRight: -size * 0.14, ...traced(p) }}>
              {words(line).map((w, wi) => (
                <React.Fragment key={wi}>
                  {wi > 0 && !w.glue ? " " : null}
                  <span style={{ fontStyle: w.em ? "italic" : "normal" }}>{w.text}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** A taupe label: Inter 500, uppercase, tracked; it fades on. */
export const Label: React.FC<{ text: string; x?: number; y: number; at?: number; align?: "left" | "center" | "right"; col?: string }> = ({ text, x = M, y, at = 0, align = "left", col = C.taupe }) => {
  const p = ease("fade", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : align === "center" ? 0 : undefined, right: align === "right" ? W - x : align === "center" ? 0 : undefined, top: y, textAlign: align, fontFamily: BODY, fontWeight: 500, fontSize: T.label, letterSpacing: `${T.labelTracking}em`, textTransform: "uppercase", color: col, opacity: p, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

export const Body: React.FC<{ text: string; x?: number; y: number; w?: number; at?: number; align?: "left" | "center" }> = ({ text, x = M, y, w = COL, at = 0, align = "left" }) => {
  const p = ease("fade", useSeconds() - at);
  return <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: BODY, fontWeight: 400, fontSize: T.body, lineHeight: 1.5, color: C.grey, opacity: p }}>{text}</div>;
};
