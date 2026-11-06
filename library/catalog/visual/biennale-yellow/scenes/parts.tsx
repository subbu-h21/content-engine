/**
 * Biennale Yellow's pieces: the parchment ground, sun and ember blooms that rise once and hold, words that soak in from
 * pale to ink without moving, hairlines, labels, the rail, block tiles, the yellow panel and the page number.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, lerp, mix, rgba, run, seeded, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  deep: color(P, "surface"),
  ink: color(P, "text"),
  muted: color(P, "muted"),
  soft: color(P, "faint"),
  sun: color(P, "accent"),
  ember: color(P, "accent2"),
  sunSoft: color(P, "sunSoft"),
  haze: color(P, "haze"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;

/** Parchment + finish; waits for the fonts. `leave` is when everything but the paper fades away (a soft leave, 0.3 s). */
export const Ground: React.FC<{ children: React.ReactNode; leave?: number }> = ({ children, leave }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const out = leave === undefined ? 0 : ease("out", t - leave);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 1 - out }}>{children}</AbsoluteFill>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A bloom: the source's radial stops; it rises once (slow ease-in-out, growing a little) and then holds still. */
export const Bloom: React.FC<{ cx: number; cy: number; r: number; at?: number; ember?: boolean }> = ({ cx, cy, r, at = 0, ember = false }) => {
  const p = ease("sunrise", useSeconds() - at);
  if (p <= 0) return null;
  const s = lerp(E.bloom.from, 1, p);
  const bg = ember
    ? `radial-gradient(circle closest-side, ${rgba(C.ember, E.bloom.ember)} 0%, ${rgba(C.ember, E.bloom.ember * 0.5)} 40%, ${rgba(C.paper, 0)} 78%)`
    : `radial-gradient(circle closest-side, ${E.bloom.stops.map((s0) => `${rgba(s0.hex, s0.alpha)} ${s0.at}%`).join(", ")})`;
  return <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, background: bg, opacity: p, transform: `scale(${s})` }} />;
};

/**
 * Serif words that soak in where they stand: pale to ink, no movement. `*stars*` are the key word: italic, or (with
 * `block`) a hard square sun block that snaps in behind it while the word pops 0.97 to 1.
 */
export const Serif: React.FC<{
  lines: string[];
  x?: number;
  y: number;
  size: number;
  at?: number;
  align?: "left" | "center";
  leading?: number;
  tracking?: number;
  italic?: boolean;
  block?: boolean;
}> = ({ lines, x = M, y, size, at = 0, align = "left", leading = T.leading, tracking = T.tracking, italic = false, block = false }) => {
  const t = useSeconds() - at;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: DISPLAY,
        fontWeight: 400,
        fontSize: size,
        lineHeight: `${size * leading}px`,
        letterSpacing: `${tracking}em`,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const local = t - i * style.motion.stagger;
            i += 1;
            const p = ease("ink", local);
            const b = block && w.em ? ease("block", local - 0.25) : 0;
            const pop = block && w.em ? lerp(R.pop.from, 1, ease("pop", local - 0.25)) : 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 && !w.glue ? " " : null}
                <span style={{ position: "relative", display: "inline-block", isolation: "isolate", color: mix(C.deep, C.ink, p), opacity: Math.min(1, p * 3), fontStyle: italic || (w.em && !block) ? "italic" : "normal", transform: `scale(${pop})` }}>
                  {block && w.em ? (
                    <span style={{ position: "absolute", left: -size * 0.09, right: -size * 0.09, top: size * 0.06, bottom: -size * 0.07, backgroundColor: C.sun, transformOrigin: "left center", transform: `scaleX(${b})`, zIndex: -1 }} />
                  ) : null}
                  {w.text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A micro-label: Archivo 600, uppercase, tracked; it soaks in like the serif. */
export const Label: React.FC<{ text: string; x?: number; y: number; at?: number; align?: "left" | "center" | "right" }> = ({ text, x = M, y, at = 0, align = "left" }) => {
  const p = ease("ink", useSeconds() - at);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "right" ? undefined : align === "center" ? 0 : x,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: T.label,
        letterSpacing: `${T.labelTracking}em`,
        textTransform: "uppercase",
        color: mix(C.deep, C.ink, p),
        opacity: Math.min(1, p * 3),
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Figures in mono. */
export const Mono: React.FC<{ text: string; x?: number; y: number; at?: number; right?: boolean; size?: number }> = ({ text, x = M, y, at = 0, right = false, size = T.mono }) => {
  const p = ease("ink", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: right ? undefined : x, right: right ? W - x : undefined, top: y, fontFamily: MONO, fontSize: size, letterSpacing: `${T.monoTracking}em`, color: mix(C.deep, C.ink, p), opacity: Math.min(1, p * 3), whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

export const Body: React.FC<{ text: string; x?: number; y: number; at?: number; width?: number; align?: "left" | "center" }> = ({ text, x = M, y, at = 0, width = style.layout.blockWidth, align = "left" }) => {
  const p = ease("ink", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: x, top: y, width, textAlign: align, fontFamily: BODY, fontWeight: 400, fontSize: T.body, lineHeight: 1.4, color: mix(C.deep, C.ink, p), opacity: Math.min(1, p * 3) }}>
      {text}
    </div>
  );
};

/** The hairline: draws from one end. `soft` is the 20% variant. */
export const Rule: React.FC<{ x?: number; y: number; w?: number; at?: number; soft?: boolean }> = ({ x = M, y, w = W - 2 * M, at = 0, soft = false }) => {
  const p = ease("rule", useSeconds() - at);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w * p, height: E.hairline, backgroundColor: C.ink, opacity: soft ? E.softLine : 1 }} />;
};

/** The vertical rail: a rotated label reading up the left edge. */
export const Rail: React.FC<{ text: string; x?: number; y: number; at?: number }> = ({ text, x = 56, y, at = 0 }) => {
  const p = ease("ink", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: "rotate(-90deg)", fontFamily: BODY, fontWeight: 600, fontSize: T.label, letterSpacing: `${T.railTracking}em`, textTransform: "uppercase", color: mix(C.deep, C.ink, p), opacity: Math.min(1, p * 3), whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** The page number: the only chrome on every frame. */
export const PageNum: React.FC<{ n: number; at?: number }> = ({ n, at = 0 }) => {
  const p = ease("ink", useSeconds() - at);
  return <div style={{ position: "absolute", right: M, top: S.layout.pageNumY, fontFamily: MONO, fontSize: T.pagenum, letterSpacing: "0.08em", color: C.muted, opacity: Math.min(1, p * 3) }}>{String(n).padStart(2, "0")}</div>;
};

/** The full-bleed yellow panel: a flat band that wipes down from the top edge (no border). */
export const Panel: React.FC<{ y: number; h: number; at?: number }> = ({ y, h, at = 0 }) => {
  const p = ease("panel", useSeconds() - at);
  return <div style={{ position: "absolute", left: 0, top: y, width: W, height: h * p, backgroundColor: C.sun }} />;
};

/** Translucent yellow tiles on the 8-column grid, each snapping in; `cells` are [column, row] in tile units. */
export const Tiles: React.FC<{ y: number; cells: [number, number][]; at?: number; seed?: number }> = ({ y, cells, at = 0, seed = 7 }) => {
  const t = useSeconds() - at;
  const rnd = seeded(seed);
  const size = W / E.tile.columns;
  return (
    <>
      {cells.map(([c, r], i) => {
        const a = lerp(E.tile.alphaMin, E.tile.alphaMax, rnd());
        const p = ease("tile", t - i * 0.04);
        return <div key={i} style={{ position: "absolute", left: c * size, top: y + r * size, width: size, height: size, backgroundColor: rgba(C.sun, a), clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }} />;
      })}
    </>
  );
};
