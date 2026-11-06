/**
 * Blue Professional's pieces: the cream ground with its counter and progress bar, the slide header, headlines that slide
 * in line by line along one axis, tinted cards, highlight blocks, bars on tracks, step circles, rings, the dot grid and
 * the one solid CTA. Every value comes from style.json.
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
  bg: color(P, "background"),
  text: color(P, "text"),
  muted: color(P, "muted"),
  light: color(P, "faint"),
  cobalt: color(P, "accent"),
  positive: color(P, "positive"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;
export const COL = W - 2 * M;

/**
 * The cream ground. `index` is the frame's place in the deck (the counter, and the progress bar growing to it). At
 * `leave` the content slides away left, the same way the next frame's content arrives: the one current of the film.
 */
export const Ground: React.FC<{ index: number; leave?: number; children: React.ReactNode }> = ({ index, leave, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const out = leave === undefined ? 0 : ease("out", t - leave);
  const n = E.scenes;
  const p = ease("progress", t - 0.15);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-E.seam * out}px)`, opacity: 1 - out }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", right: M, top: L.counterY, fontFamily: DISPLAY, fontWeight: 500, fontSize: T.counter, letterSpacing: "0.05em", color: C.muted }}>
        {String(index).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </div>
      {index > 1 ? <div style={{ position: "absolute", left: 0, top: L.progressY, width: W, height: H - L.progressY, backgroundColor: rgba(C.cobalt, E.tint) }} /> : null}
      <div style={{ position: "absolute", left: 0, top: L.progressY, width: (W * lerp(index - 1, index, p)) / n, height: E.progress, backgroundColor: C.cobalt }} />
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Progress of a slide-in as { opacity, transform }; the whole frame's content arrives from the right. */
export const slideIn = (t: number): React.CSSProperties => {
  const p = ease("slide", t);
  return { opacity: Math.min(1, p * 2.2), transform: `translateX(${(1 - p) * R.slide.distance}px)` };
};

/** The accent line (60 × 4), growing from the left. */
export const AccentLine: React.FC<{ x?: number; y: number; at?: number; center?: boolean }> = ({ x = M, y, at = 0, center = false }) => {
  const p = ease("line", useSeconds() - at);
  const w = E.line.w * p;
  return <div style={{ position: "absolute", left: center ? (W - w) / 2 : x, top: y, width: w, height: E.line.h, borderRadius: E.line.radius, backgroundColor: C.cobalt }} />;
};

/** The slide header: cobalt eyebrow left, tag pill right. */
export const Header: React.FC<{ eyebrow: string; tag?: string; at?: number }> = ({ eyebrow, tag, at = 0 }) => {
  const t = useSeconds() - at;
  return (
    <>
      <div style={{ position: "absolute", left: M, top: L.headerY + 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: T.eyebrow, letterSpacing: `${T.eyebrowTracking}em`, textTransform: "uppercase", color: C.cobalt, whiteSpace: "nowrap", ...slideIn(t) }}>{eyebrow}</div>
      {tag ? (
        <div style={{ position: "absolute", right: M, top: L.headerY, padding: "9px 24px 10px", borderRadius: 100, backgroundColor: rgba(C.cobalt, E.tint), fontFamily: DISPLAY, fontWeight: 500, fontSize: T.tag, color: C.cobalt, whiteSpace: "nowrap", ...slideIn(t - 0.08) }}>{tag}</div>
      ) : null}
    </>
  );
};

/** The line's words, with neighbouring emphasised words joined so they share one highlight. */
const emGroups = (line: string) => {
  const out: ReturnType<typeof words> = [];
  for (const w of words(line)) {
    const last = out[out.length - 1];
    if (last && last.em && w.em) last.text += `${w.glue ? "" : " "}${w.text}`;
    else out.push({ ...w });
  }
  return out;
};

/** A headline: near-black Space Grotesk, line by line along the axis. `*stars*` sit on a tinted highlight with a left rule. */
export const Head: React.FC<{ lines: string[]; x?: number; y: number; size: number; at?: number; weight?: number; align?: "left" | "center"; leading?: number }> = ({ lines, x = M, y, size, at = 0, weight = 700, align = "left", leading = T.leading }) => {
  const t = useSeconds() - at;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y, textAlign: align, fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${T.tracking}em`, color: C.text, whiteSpace: "nowrap" }}>
      {lines.map((line, i) => {
        const local = t - i * style.motion.stagger;
        return (
          <div key={i} style={slideIn(local)}>
            {emGroups(line).map((w, wi) => {
              const b = w.em ? ease("line", local - 0.45) : 0;
              return (
                <React.Fragment key={wi}>
                  {wi > 0 && !w.glue ? " " : null}
                  {w.em ? (
                    <span style={{ position: "relative", display: "inline-block", isolation: "isolate" }}>
                      <span style={{ position: "absolute", left: -size * 0.1, right: -size * 0.1, top: size * 0.1, bottom: size * 0.02, borderRadius: E.card.radiusSmall, backgroundColor: rgba(C.cobalt, E.tint), transformOrigin: "left center", transform: `scaleX(${b})`, zIndex: -1 }} />
                      <span style={{ position: "absolute", left: -size * 0.1, top: size * 0.1, bottom: size * 0.02, width: E.highlightRule, backgroundColor: C.cobalt, opacity: b > 0 ? 1 : 0 }} />
                      {w.text}
                    </span>
                  ) : (
                    w.text
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const Body: React.FC<{ text: string; x?: number; y: number; w?: number; at?: number; col?: string }> = ({ text, x = M, y, w = COL, at = 0, col = C.muted }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: BODY, fontWeight: 400, fontSize: T.body, lineHeight: 1.45, color: col, ...slideIn(useSeconds() - at) }}>{text}</div>
);

/** The tinted card: 4% fill, 1.5 px border at 20%, no shadow. It arrives along the axis with a longer tail than text. */
export const Card: React.FC<{ x?: number; y: number; w?: number; h: number; at?: number; radius?: number; children?: React.ReactNode }> = ({ x = M, y, w = COL, h, at = 0, radius = E.card.radius, children }) => {
  const t = useSeconds() - at;
  const p = ease("card", t);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: radius,
        backgroundColor: rgba(C.cobalt, E.card.fillAlpha),
        border: `${E.card.border}px solid ${rgba(C.cobalt, E.card.borderAlpha)}`,
        opacity: Math.min(1, p * 2),
        transform: `translateX(${(1 - p) * R.card.distance}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** The split highlight: 8% fill, a 4 px cobalt left rule, 12 px radius. */
export const Highlight: React.FC<{ x?: number; y: number; w?: number; h: number; at?: number; children?: React.ReactNode }> = ({ x = M, y, w = COL, h, at = 0, children }) => {
  const t = useSeconds() - at;
  const p = ease("card", t);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: E.card.radiusSmall, overflow: "hidden", backgroundColor: rgba(C.cobalt, E.tint), opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * R.card.distance}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: E.highlightRule, backgroundColor: C.cobalt }} />
      {children}
    </div>
  );
};

/** A labelled bar on an 8% track; the fill grows with `p` of the count. */
export const Bar: React.FC<{ y: number; label: string; value: string; frac: number; at?: number }> = ({ y, label, value, frac, at = 0 }) => {
  const t = useSeconds() - at;
  const p = ease("fill", t);
  const labelW = 160;
  const valueW = 130;
  const track = COL - labelW - valueW;
  const a = slideIn(t);
  return (
    <>
      <div style={{ position: "absolute", left: M, top: y, width: labelW, fontFamily: DISPLAY, fontWeight: 500, fontSize: 30, lineHeight: `${E.track.h}px`, color: C.text, whiteSpace: "nowrap", ...a }}>{label}</div>
      <div style={{ position: "absolute", left: M + labelW, top: y, width: track, height: E.track.h, borderRadius: E.track.radius, backgroundColor: rgba(C.cobalt, E.tint), overflow: "hidden" }}>
        <div style={{ width: track * frac * p, height: E.track.h, borderRadius: E.track.radius, backgroundColor: C.cobalt }} />
      </div>
      <div style={{ position: "absolute", right: M, top: y, width: valueW, textAlign: "right", fontFamily: DISPLAY, fontWeight: 700, fontSize: T.stat, lineHeight: `${E.track.h}px`, color: C.cobalt, ...a }}>{value}</div>
    </>
  );
};

/** The step circle: solid cobalt fading down the list (1 → 0.85 → 0.7 → 0.55). */
export const Step: React.FC<{ n: number; x: number; y: number; at?: number }> = ({ n, x, y, at = 0 }) => {
  const size = E.step.size;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", backgroundColor: C.cobalt, opacity: E.step.opacities[n - 1] ?? 0.55, color: C.bg, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: `${size - 4}px`, textAlign: "center" }}>
      {n}
    </div>
  );
};

/** Concentric rings: each draws round its circle; on covers and closers only. */
export const Rings: React.FC<{ cx: number; cy: number; radii: number[]; at?: number }> = ({ cx, cy, radii, at = 0 }) => {
  const t = useSeconds() - at;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {radii.map((r, i) => {
        const p = ease("ring", t - i * 0.08);
        const c = 2 * Math.PI * r;
        if (p <= 0) return null;
        return <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={C.cobalt} strokeOpacity={E.ring.alpha} strokeWidth={E.ring.stroke} strokeDasharray={`${c * p} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />;
      })}
    </svg>
  );
};

/** The 3 × 3 cobalt dot grid; dots grow in one after another. */
export const Dots: React.FC<{ x: number; y: number; at?: number }> = ({ x, y, at = 0 }) => {
  const t = useSeconds() - at;
  const { size, gap } = E.dots;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const p = ease("dot", t - i * 0.03);
        const s = size * p;
        return <div key={i} style={{ position: "absolute", left: x + (i % 3) * gap + (size - s) / 2, top: y + Math.floor(i / 3) * gap + (size - s) / 2, width: s, height: s, borderRadius: "50%", backgroundColor: C.cobalt }} />;
      })}
    </>
  );
};

/** The one solid element: the cobalt CTA pill. */
export const Cta: React.FC<{ text: string; y: number; at?: number }> = ({ text, y, at = 0 }) => {
  const t = useSeconds() - at;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", ...slideIn(t) }}>
      <span style={{ display: "inline-block", padding: "32px 76px 34px", borderRadius: 100, backgroundColor: C.cobalt, color: C.bg, fontFamily: DISPLAY, fontWeight: 600, fontSize: 46, lineHeight: 1 }}>{text}</span>
    </div>
  );
};
