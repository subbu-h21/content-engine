/**
 * Warm White Launch's pieces: the warm-white canvas, the iridescent glow, the composer box, the phone, bubbles,
 * pills, the dark result card, the lime flood and ripple, and the orange mark. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  bg: color(P, "background"),
  ink: color(P, "text"),
  white: color(P, "surface"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  lime: color(P, "accent"),
  orange: color(P, "accent2"),
  send: color(P, "send"),
  glow: ["glowPink", "glowOrange", "glowLime", "glowCyan", "glowViolet"].map((r) => color(P, r)),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const beat = (n: number): number => n * S.motion.beat;

/** The canvas (warm white, lime or black); waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.bg }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: bg, fontFamily: SANS, color: C.ink, letterSpacing: `${S.type.tracking}em` }}>
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The iridescent "AI glow": a blurred conic gradient (pink → orange → lime → cyan → violet) slowly rotating behind a box. */
export const Glow: React.FC<{ x: number; y: number; w: number; h: number; r: number; on?: number }> = ({ x, y, w, h, r, on = 1 }) => {
  const t = useSeconds();
  const a = t * 360 * S.motion.glowTurn;
  const sp = S.finish.glowSpread;
  const stops = [...C.glow, C.glow[0]].join(", ");
  return (
    <div style={{ position: "absolute", left: x - sp, top: y - sp, width: w + 2 * sp, height: h + 2 * sp, borderRadius: r + sp, overflow: "visible", opacity: on }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r + sp, background: `conic-gradient(from ${a}deg, ${stops})`, filter: `blur(${S.finish.glowBlur}px)` }} />
    </div>
  );
};

/** A pill: black filled, lime, or outlined. */
export const Pill: React.FC<{ text: string; kind?: "black" | "lime" | "outline"; size?: number; dot?: boolean }> = ({ text, kind = "black", size = S.type.label, dot = false }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.5}px ${size * 0.95}px`,
      borderRadius: 999,
      backgroundColor: kind === "black" ? C.ink : kind === "lime" ? C.lime : "transparent",
      color: kind === "black" ? "#ffffff" : C.ink,
      border: kind === "outline" ? `2px solid ${C.ink}` : undefined,
      fontSize: size,
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {dot ? <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", backgroundColor: kind === "lime" ? C.ink : C.lime }} /> : null}
    {text}
  </div>
);

/** The round blue send button with an up arrow. */
export const Send: React.FC<{ size?: number; press?: number }> = ({ size = 76, press = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: C.send, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.08 * press})` }}>
    <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24">
      <path d="M12 19 V5 M6 11 L12 5 L18 11" fill="none" stroke="#ffffff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** A lime ripple ring expanding from a point (the send moment). */
export const Ripple: React.FC<{ x: number; y: number; at: number; r?: number }> = ({ x, y, at, r = 260 }) => {
  const k = useSeconds() - at;
  if (k < 0 || k > 0.8) return null;
  const p = ease("ripple", k);
  return <div style={{ position: "absolute", left: x - r * p, top: y - r * p, width: 2 * r * p, height: 2 * r * p, borderRadius: "50%", border: `${10 * (1 - p) + 2}px solid ${rgba(C.lime, 1 - p)}` }} />;
};

/** A full-frame lime flood growing from a point past every corner in about 0.35 s. */
export const Flood: React.FC<{ x: number; y: number; at: number; col?: string }> = ({ x, y, at, col = C.lime }) => {
  const p = ease("flood", useSeconds() - at);
  if (p <= 0) return null;
  const r = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.08 * p;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", backgroundColor: col }} />;
};

/** A phone (generic: 428 × 900 screen, 11 px black bezel, a 9:41 status bar), scaled; children are in screen px of the phone. */
export const Phone: React.FC<{ x: number; y: number; scale?: number; children: React.ReactNode }> = ({ x, y, scale = S.type.phoneScale, children }) => {
  const { w, h, bezel, radius } = S.layout.phone;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w + 2 * bezel, height: h + 2 * bezel, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: radius + bezel, backgroundColor: C.ink, boxShadow: "0 40px 80px -40px rgba(14,14,16,0.45)" }} />
      <div style={{ position: "absolute", left: bezel, top: bezel, width: w, height: h, borderRadius: radius, backgroundColor: C.bg, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 16, fontSize: 17, fontWeight: 600, letterSpacing: 0 }}>9:41</div>
        <div style={{ position: "absolute", right: 28, top: 20, display: "flex", gap: 6, alignItems: "flex-end" }}>
          {[6, 9, 12].map((hh, i) => (
            <div key={i} style={{ width: 4, height: hh, borderRadius: 1, backgroundColor: C.ink }} />
          ))}
          <div style={{ width: 24, height: 12, borderRadius: 3, border: `1.5px solid ${C.ink}`, marginLeft: 6 }} />
        </div>
        {children}
      </div>
    </div>
  );
};

/** A chat bubble inside the phone (phone px); `sent` bubbles are lime on the right. */
export const Bubble: React.FC<{ text: React.ReactNode; sent?: boolean; y: number; at: number; w?: number }> = ({ text, sent = false, y, at, w = 300 }) => {
  const p = ease("pop", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: sent ? undefined : 22,
        right: sent ? 22 : undefined,
        maxWidth: w,
        padding: "12px 16px",
        borderRadius: 20,
        borderBottomRightRadius: sent ? 6 : 20,
        borderBottomLeftRadius: sent ? 20 : 6,
        backgroundColor: sent ? C.lime : C.white,
        border: sent ? undefined : `1px solid ${C.faint}`,
        fontSize: S.type.bubble,
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        transform: `scale(${clamp(p, 0, 1.05)})`,
        transformOrigin: sent ? "100% 100%" : "0% 100%",
      }}
    >
      {text}
    </div>
  );
};

/** The orange mark: the running dot that becomes the name's mark at the end. */
export const Mark: React.FC<{ x: number; y: number; size?: number; at?: number }> = ({ x, y, size = 40, at = 0 }) => {
  const p = ease("pop", useSeconds() - at);
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", backgroundColor: C.orange, transform: `scale(${clamp(p, 0, 1.06)})` }} />;
};

/** Camera zoom interpolated in log space between `from` and `to`. */
export const logZoom = (p: number, from: number, to: number): number => Math.exp(lerp(Math.log(from), Math.log(to), clamp(p)));

export { SANS, SERIF };
