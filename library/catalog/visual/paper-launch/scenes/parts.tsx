/**
 * Paper Launch's pieces: the newsprint ground (and the dark register), mono kickers, grotesk headlines with one
 * serif-italic word arriving in a word waterfall, white hairline product windows that tilt back and rise into place
 * with a deepening shadow, buttons, toggles and selection rings in the one raspberry accent.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, SANS, SERIF } from "./fonts";

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
  window: color(P, "surface"),
  ink: color(P, "text"),
  muted: color(P, "muted"),
  line: color(P, "faint"),
  accent: color(P, "accent"),
  accentSoft: color(P, "accentSoft"),
  dark: color(P, "dark"),
  darkWindow: color(P, "darkWindow"),
  skyBlue: color(P, "skyBlue"),
  skyPale: color(P, "skyPale"),
  lightRed: color(P, "lightRed"),
};
/** JSON reads a bezier curve as number[], not a 4-tuple, hence the unknown cast. */
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** Dark register context: windows and type switch colours inside it. */
const Dark = React.createContext(false);
export const useDark = () => React.useContext(Dark);

export const Ground: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark = false }) => {
  useFontsReady(FACES);
  return (
    <Dark.Provider value={dark}>
      <AbsoluteFill style={{ backgroundColor: dark ? C.dark : C.paper }}>
        {children}
        <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
      </AbsoluteFill>
    </Dark.Provider>
  );
};

/** Mono kicker: caps, tracked, muted. */
export const Kicker: React.FC<{ text: string; y?: number; at?: number; x?: number }> = ({ text, y = L.kickerY, at = 0, x = M }) => {
  const dark = useDark();
  const p = ease("arrive", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - T.kicker * 0.6,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: T.kicker,
        letterSpacing: `${T.kickerTracking}em`,
        textTransform: "uppercase",
        color: dark ? C.line : C.muted,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Headline: words fall in 0.02 s apart (expo-out, 40 px, blur 10 → 0); the *emphasised* word is Newsreader italic. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; align?: "left" | "center"; underline?: boolean }> = ({ lines, size, y, at = 0, align = "left", underline = false }) => {
  const dark = useDark();
  const t = useSeconds() - at;
  const { distance } = S.motion.recipes.arrive;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : M,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: size,
        lineHeight: `${size * T.leading}px`,
        letterSpacing: `${T.tracking}em`,
        color: dark ? C.paper : C.ink,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const a = t - i * S.motion.stagger - li * 0.12;
            const p = ease("arrive", a);
            const u = ease("ui", a - 0.6);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    position: "relative",
                    opacity: clamp(p * 1.5),
                    transform: `translateY(${(1 - p) * distance}px)`,
                    filter: p < 1 ? `blur(${(1 - p) * E.textBlur}px)` : undefined,
                    fontFamily: w.em ? SERIF : SANS,
                    fontStyle: w.em ? "italic" : "normal",
                    fontWeight: w.em ? 500 : 700,
                    fontSize: w.em ? `${T.serifScale}em` : undefined,
                    letterSpacing: w.em ? "-0.01em" : undefined,
                  }}
                >
                  {w.text}
                  {w.em && underline && u > 0 ? (
                    <span style={{ position: "absolute", left: "0.02em", bottom: "0.04em", height: E.underline, width: `${u * 96}%`, background: C.accent, borderRadius: 2 }} />
                  ) : null}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Secondary line: Hanken 500 at a third of the headline size, muted. */
export const Secondary: React.FC<{ text: string; y: number; at?: number; width?: number; align?: "left" | "center" }> = ({ text, y, at = 0, width = COLUMN, align = "left" }) => {
  const dark = useDark();
  const p = ease("arrive", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (W - width) / 2 : M,
        top: y,
        width,
        textAlign: align,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: T.secondary,
        lineHeight: 1.25,
        color: dark ? C.line : C.muted,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

/** UI text styles inside windows. */
export const ui = (c: string, weight = 500, size = T.ui): React.CSSProperties => ({ fontFamily: SANS, fontWeight: weight, fontSize: size, color: c, lineHeight: 1.2, whiteSpace: "nowrap" });
export const mono = (c: string): React.CSSProperties => ({ fontFamily: MONO, fontWeight: 500, fontSize: T.kicker, letterSpacing: `${T.kickerTracking}em`, textTransform: "uppercase", color: c, whiteSpace: "nowrap" });

/**
 * A product window: white, hairline border, radius 20, chrome of three hairline dots only. It tilts back 24°, rises
 * 200 px, scales from 0.94 and unblurs 8 px into place (expo-out 1.1 s); its shadow deepens as it lands.
 */
export const Window: React.FC<{ x: number; y: number; w: number; h: number; at: number; children?: React.ReactNode; padding?: number; z?: number }> = ({ x, y, w, h, at, children, padding = 36, z }) => {
  const dark = useDark();
  const t = useSeconds() - at;
  const p = ease("window", t);
  if (t <= 0) return null;
  const k = E.windowIn;
  const wl = L.window;
  const shadowA = lerp(0.05, 0.16, p);
  const shadowY = lerp(6, 44, p);
  const shadowB = lerp(16, 90, p);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        transform: `perspective(${L.perspective}px) translateY(${(1 - p) * k.y}px) rotateX(${(1 - p) * k.rotateX}deg) scale(${lerp(k.scale, 1, p)})`,
        transformOrigin: "50% 100%",
        filter: p < 1 ? `blur(${(1 - p) * k.blur}px)` : undefined,
        opacity: clamp(t / 0.15),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: wl.radius,
          background: dark ? C.darkWindow : C.window,
          border: `${wl.border}px solid ${dark ? rgba(C.paper, 0.12) : C.line}`,
          boxShadow: `0 ${shadowY}px ${shadowB}px rgba(0,0,0,${dark ? shadowA * 2.5 : shadowA})`,
          overflow: "hidden",
        }}
      >
        <div style={{ height: wl.bar, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", borderBottom: `${wl.border}px solid ${dark ? rgba(C.paper, 0.08) : C.line}` }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: wl.dot, height: wl.dot, borderRadius: "50%", border: `1.5px solid ${dark ? rgba(C.paper, 0.3) : C.line}`, boxSizing: "border-box" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: wl.bar, bottom: 0, padding, boxSizing: "border-box" }}>{children}</div>
      </div>
    </div>
  );
};

/** A raspberry button; `pop` gives it the film's one deliberate pop. */
export const Button: React.FC<{ text: string; at?: number; pop?: boolean }> = ({ text, at = 0, pop = false }) => {
  const t = useSeconds() - at;
  const s = pop ? (t <= 0 ? 0 : ease("pop", t)) : 1;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: E.button.height,
        padding: "0 40px",
        borderRadius: E.button.radius,
        background: C.accent,
        ...ui(C.window, 700),
        transform: `scale(${s})`,
      }}
    >
      {text}
    </span>
  );
};

/** A toggle switch in the accent (on) or the hairline grey (off). */
export const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <span style={{ position: "relative", display: "inline-block", width: 76, height: 44, borderRadius: 22, background: on > 0.5 ? C.accent : C.line, verticalAlign: "middle" }}>
    <span style={{ position: "absolute", top: 5, left: lerp(5, 37, on), width: 34, height: 34, borderRadius: 17, background: C.window, boxShadow: "0 2px 6px rgba(0,0,0,.18)" }} />
  </span>
);

export { MONO, SANS, SERIF };
