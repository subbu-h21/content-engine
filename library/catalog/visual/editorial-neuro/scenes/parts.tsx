/** Editorial Neuro's pieces: ground, eyebrow, headline, body, pill label. Every value comes from style.json. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, expoOut, Finish, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, DISPLAY, BODY } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const C = {
  bg: color(style.palette, "background"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  accent2: color(style.palette, "accent2"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** The soft ink halo that keeps type legible over pictures. */
export const halo = (strength = style.finish.halo): string =>
  strength <= 0
    ? "none"
    : [`0 0 2px ${rgba(C.bg, 0.55 * strength)}`, `0 0 6px ${rgba(C.bg, 0.45 * strength)}`, `0 0 14px ${rgba(C.bg, 0.35 * strength)}`, `0 0 28px ${rgba(C.bg, 0.25 * strength)}`].join(", ");

/** Ink ground + the style's finish; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{ text: string; y: number; at?: number; align?: "left" | "center"; rule?: boolean }> = ({ text, y, at = 0, align = "left", rule = false }) => {
  const t = useSeconds() - at;
  const p = ease("eyebrow", t);
  const q = ease("rule", t - 0.1);
  const size = style.type.eyebrow;
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: align === "center" ? 0 : M,
          right: align === "center" ? 0 : undefined,
          top: y - size * 0.8,
          textAlign: align,
          fontFamily: BODY,
          fontSize: size,
          letterSpacing: style.type.eyebrowTracking,
          color: C.muted,
          opacity: p,
          transform: `translateX(${(1 - p) * -style.motion.recipes.eyebrow.distance}px)`,
          whiteSpace: "nowrap",
          textShadow: halo(0.6),
        }}
      >
        {text}
      </div>
      {rule ? <div style={{ position: "absolute", left: align === "center" ? W / 2 - 70 : M, top: y + 18, width: 140 * q, height: 1, backgroundColor: C.text, opacity: 0.22 }} /> : null}
    </>
  );
};

/** Bodoni headline: one colour, *italic* for emphasis, words rise and fade in one after another. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; align?: "left" | "center" }> = ({ lines, size, y, at = 0, align = "left" }) => {
  const t = useSeconds() - at;
  const { distance } = style.motion.recipes.rise;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : M,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.78,
        textAlign: align,
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: `${size * style.type.leading}px`,
        color: C.text,
        whiteSpace: "nowrap",
        textShadow: halo(),
        fontKerning: "normal",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("rise", t - i * style.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", opacity: Math.max(0, p), transform: `translateY(${(1 - p) * distance}px)`, fontStyle: w.em ? "italic" : "normal" }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Body: React.FC<{ text: string; y: number; at?: number; width?: number; align?: "left" | "center" }> = ({ text, y, at = 0, width = W - 2 * M, align = "left" }) => {
  const p = expoOut((useSeconds() - at) / 0.5);
  const size = style.type.body;
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : M,
        top: y - size * 0.8,
        width,
        textAlign: align,
        fontFamily: BODY,
        fontSize: size,
        lineHeight: 1.35,
        color: C.muted,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        textShadow: halo(0.5),
      }}
    >
      {text}
    </div>
  );
};

/** A leader line from a point to a mixed-case label on a quiet ink pill (the line reaches first, then the pill). */
export const PillLabel: React.FC<{ text: string; from: [number, number]; to: [number, number]; at?: number; side?: "left" | "right"; accent?: string }> = ({
  text,
  from,
  to,
  at = 0,
  side = "right",
  accent,
}) => {
  const p = ease("leader", useSeconds() - at);
  if (p <= 0) return null;
  const [mx0, my0] = from;
  const [x1, y1] = to;
  const reach = Math.min(1, p * 1.6);
  const mx = mx0 + (x1 - mx0) * reach;
  const my = my0 + (y1 - my0) * reach;
  const q = p > 0.55 ? expoOut((p - 0.55) / 0.45) : 0;
  const tick = 40 * q;
  const dir = side === "right" ? 1 : -1;
  const size = style.type.label;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {accent ? <circle cx={mx0} cy={my0} r={14} fill={accent} opacity={0.22 * p} /> : null}
        <circle cx={mx0} cy={my0} r={4} fill={accent ?? C.text} opacity={p} />
        <line x1={mx0} y1={my0} x2={mx} y2={my} stroke={C.text} strokeOpacity={0.55 * p} strokeWidth={1.4} strokeLinecap="round" />
        {q > 0 ? <line x1={x1} y1={y1} x2={x1 + dir * tick} y2={y1} stroke={C.text} strokeOpacity={0.55 * p} strokeWidth={1.4} strokeLinecap="round" /> : null}
      </svg>
      {q > 0 ? (
        <div
          style={{
            position: "absolute",
            left: side === "right" ? x1 + tick + 14 - 16 : undefined,
            right: side === "right" ? undefined : W - (x1 - tick - 14) - 16,
            top: y1 - size * 0.42 - size * 0.5,
            padding: `${size * 0.5}px 16px`,
            borderRadius: 10,
            backgroundColor: rgba(C.bg, 0.72 * q),
            fontFamily: BODY,
            fontSize: size,
            letterSpacing: 0.5,
            lineHeight: `${size * 0.84}px`,
            color: C.text,
            opacity: q,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ) : null}
    </>
  );
};
