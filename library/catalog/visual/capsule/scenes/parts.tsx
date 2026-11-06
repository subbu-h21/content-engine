/**
 * Capsule's pieces: the cream ground with its candy glows and grain, capsules that stretch out of a dot, confetti pills
 * that scatter out from the middle and settle, Bodoni words that blur into focus, highlight pills, step nodes, accent
 * lines and bar tracks. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  cream: color(P, "background"),
  white: color(P, "surface"),
  ink: color(P, "text"),
  outline: color(P, "faint"),
  coral: color(P, "accent"),
  sky: color(P, "accent2"),
  lime: color(P, "lime"),
  lavender: color(P, "lavender"),
  violet: color(P, "violet"),
  yellow: color(P, "yellow"),
  peach: color(P, "peach"),
  mint: color(P, "mint"),
};
export type Candy = keyof typeof C;
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
export const COL = W - 2 * M;
const line = `${E.stroke}px solid ${C.outline}`;
const hard = (k: keyof typeof E.shadow): string => `${E.shadow[k]}px ${E.shadow[k]}px 0 ${rgba(C.ink, E.shadowAlpha)}`;

/** A soft radial candy glow at 6-15%: atmosphere on every frame. It swells in once and holds. */
const Glow: React.FC<{ cx: number; cy: number; r: number; col: string; alpha: number }> = ({ cx, cy, r, col, alpha }) => {
  const p = ease("glow", useSeconds());
  return <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, background: `radial-gradient(circle closest-side, ${rgba(col, alpha * p)} 0%, ${rgba(col, 0)} 100%)` }} />;
};

/** Cream + glows + grain. `leave` shrinks the content away (the frame stays cream). Waits for the fonts. */
export const Ground: React.FC<{ glows: [number, number, number, Candy, number][]; leave?: number; children: React.ReactNode }> = ({ glows, leave, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const out = leave === undefined ? 0 : ease("out", t - leave);
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, overflow: "hidden" }}>
      {glows.map(([cx, cy, r, col, a], i) => (
        <Glow key={i} cx={cx} cy={cy} r={r} col={C[col]} alpha={a} />
      ))}
      <AbsoluteFill style={{ transform: `scale(${1 - 0.08 * out})`, opacity: 1 - out }}>{children}</AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * The capsule: starts as a dot (as wide as it's tall) and stretches to full width on a spring (ratio 0.54); its content
 * is uncovered as it grows. `from` is the end it stretches from.
 */
export const Capsule: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  fill?: string;
  radius?: number;
  shadow?: keyof typeof E.shadow;
  tilt?: number;
  from?: "left" | "center" | "right";
  children?: React.ReactNode;
}> = ({ x, y, w, h, at = 0, fill = C.white, radius = 9999, shadow, tilt = 0, from = "center", children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const g = ease("stretch", t);
  const ww = Math.max(0, lerp(Math.min(h, w), w, g));
  const left = from === "left" ? x : from === "right" ? x + w - ww : x + (w - ww) / 2;
  const s = Math.min(1, g * 2.4);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: y,
        width: ww,
        height: h,
        boxSizing: "border-box",
        borderRadius: radius,
        border: line,
        backgroundColor: fill,
        boxShadow: shadow ? hard(shadow) : undefined,
        overflow: "hidden",
        transform: `rotate(${tilt}deg) scale(${s})`,
      }}
    >
      <div style={{ position: "absolute", left: (ww - w) / 2, top: 0, width: w, height: h }}>{children}</div>
    </div>
  );
};

/** Uppercase pill text, centred in a capsule. */
export const PillText: React.FC<{ text: string; h: number; size?: number }> = ({ text, h, size = T.pill }) => (
  <div style={{ width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 600, fontSize: size, letterSpacing: `${T.pillTracking}em`, lineHeight: `${h - 2 * E.stroke}px`, textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap" }}>{text}</div>
);

/** A labelled pill, sized from its text: the yellow title pill above a headline, or any label. */
export const LabelPill: React.FC<{ text: string; y: number; x?: number; at?: number; fill?: string; size?: number; tilt?: number; w?: number }> = ({ text, y, x, at = 0, fill = C.yellow, size = T.pill, tilt = 0, w }) => {
  const h = size * 2.4;
  const ww = w ?? text.length * size * 0.74 + size * 2.4;
  return (
    <Capsule x={x ?? (W - ww) / 2} y={y} w={ww} h={h} at={at} fill={fill} tilt={tilt}>
      <PillText text={text} h={h} size={size} />
    </Capsule>
  );
};

/** One confetti pill as [x, y, w, h, rotation, candy]. */
export type Bit = [number, number, number, number, number, Candy];

/** Floating pills: flat, outlined, no shadow, no text. They scatter out from the middle of the frame and settle (ratio 0.57). */
export const Confetti: React.FC<{ bits: Bit[]; at?: number; origin?: [number, number] }> = ({ bits, at = 0, origin = [W / 2, 900] }) => {
  const t = useSeconds() - at;
  return (
    <>
      {bits.map(([x, y, w, h, rot, candy], i) => {
        const local = t - i * style.motion.pillStagger;
        if (local <= 0) return null;
        const p = ease("scatter", local);
        const cx = lerp(origin[0], x + w / 2, p);
        const cy = lerp(origin[1], y + h / 2, p);
        return <div key={i} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, boxSizing: "border-box", borderRadius: 9999, border: line, backgroundColor: C[candy], transform: `rotate(${rot * p}deg) scale(${Math.min(1, 0.3 + p * 0.7)})` }} />;
      })}
    </>
  );
};

/**
 * Bodoni lines: each word blurs into focus (6 px to 0 in 0.13 s, 0.067 s apart, no movement; T43). `*stars*` are italic;
 * with `pill` they sit in a candy highlight pill that sweeps open behind them.
 */
export const Bodoni: React.FC<{
  lines: string[];
  x?: number;
  y: number;
  size: number;
  at?: number;
  align?: "left" | "center";
  weight?: number;
  leading?: number;
  tracking?: number;
  pill?: string;
  emCol?: string;
}> = ({ lines, x = M, y, size, at = 0, align = "center", weight = 800, leading = T.leading, tracking = T.tracking, pill, emCol }) => {
  const t = useSeconds() - at;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y, textAlign: align, fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${tracking}em`, color: C.ink, whiteSpace: "nowrap" }}>
      {lines.map((ln, li) => {
        const ws = words(ln);
        const groups: { text: string; em: boolean; glue: boolean }[] = [];
        for (const w of ws) {
          const last = groups[groups.length - 1];
          if (pill && last && last.em && w.em) last.text += ` ${w.text}`;
          else groups.push({ ...w });
        }
        return (
          <div key={li}>
            {groups.map((w, wi) => {
              const local = t - i * style.motion.stagger;
              i += 1;
              const p = ease("focus", local);
              const open = w.em && pill ? ease("line", local - 0.1) : 0;
              return (
                <React.Fragment key={wi}>
                  {wi > 0 && !w.glue ? " " : null}
                  <span style={{ position: "relative", display: "inline-block", isolation: "isolate", opacity: p, filter: p < 1 ? `blur(${(1 - p) * R.focus.blur}px)` : undefined, fontStyle: w.em ? "italic" : "normal", color: w.em && emCol ? emCol : undefined, padding: w.em && pill ? `0 ${size * 0.2}px` : undefined }}>
                    {w.em && pill ? <span style={{ position: "absolute", left: 0, right: 0, top: size * 0.08, bottom: size * -0.04, boxSizing: "border-box", borderRadius: 9999, border: line, backgroundColor: pill, clipPath: `inset(-4px ${(1 - open) * 100}% -4px -4px round 9999px)`, zIndex: -1 }} /> : null}
                    {w.text}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** The accent line: coral, 60 × 4 (80 × 4 on the closer), growing from the middle. */
export const AccentLine: React.FC<{ y: number; at?: number; closer?: boolean }> = ({ y, at = 0, closer = false }) => {
  const p = ease("line", useSeconds() - at);
  const w = (closer ? E.accentLine.closer : E.accentLine.w) * p;
  return <div style={{ position: "absolute", left: (W - w) / 2, top: y, width: w, height: E.accentLine.h, borderRadius: 9999, backgroundColor: C.coral }} />;
};

export const Body: React.FC<{ text: string; x: number; y: number; w: number; size?: number; align?: "left" | "center"; weight?: number }> = ({ text, x, y, w, size = T.body, align = "left", weight = 400 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: BODY, fontWeight: weight, fontSize: size, lineHeight: 1.36, color: C.ink }}>{text}</div>
);

/** A step node: a candy circle with a Bodoni numeral. */
export const Node: React.FC<{ n: number; x: number; y: number; size: number; fill: string }> = ({ n, x, y, size, fill }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size, boxSizing: "border-box", borderRadius: "50%", border: line, boxShadow: hard("node"), backgroundColor: fill, fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.52, lineHeight: `${size - 6}px`, textAlign: "center", color: C.ink }}>{n}</div>
);

/** A bar track: an outlined pill with a candy fill growing inside it on a spring. */
export const Track: React.FC<{ x: number; y: number; w: number; frac: number; fill: string; at?: number }> = ({ x, y, w, frac, fill, at = 0 }) => {
  const t = useSeconds() - at;
  const g = Math.max(0, ease("fill", t));
  const h = E.track;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 9999, border: line, backgroundColor: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(h, (w - 2 * E.stroke) * frac * g), borderRadius: 9999, backgroundColor: fill, opacity: t > 0 ? 1 : 0 }} />
    </div>
  );
};
