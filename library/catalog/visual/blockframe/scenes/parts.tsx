/**
 * BlockFrame's pieces: a pastel ground that wipes over the last one, the dot grid, cards that rise out of their hard
 * shadow, stickers that slap down on a spring, label pills, star bursts, stripe blocks, chunky arrows, and slab lines
 * that drop in. Opacity is binary: nothing fades. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, Finish, lerp, rgba, run, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, LABEL } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
const P = style.palette;
export const C = {
  off: color(P, "background"),
  white: color(P, "surface"),
  black: color(P, "text"),
  yellow: color(P, "accent"),
  pink: color(P, "accent2"),
  blue: color(P, "blue"),
  green: color(P, "green"),
  cream: color(P, "cream"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

/**
 * The frame's one pastel. It wipes in over the previous ground (`from`), and at `leave` the next ground (`next`) wipes
 * over everything: the pastel cycle is the rhythm. Waits for the fonts.
 */
export const Ground: React.FC<{ fill: string; from?: string; next?: string; leave?: number; dots?: boolean; children: React.ReactNode }> = ({ fill, from, next, leave, dots = true, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const uid = useUid("bf");
  const inP = from ? ease("wipe", t) : 1;
  const outP = next && leave !== undefined ? ease("out", t - leave) : 0;
  const { size, gap, alpha } = E.dots;
  return (
    <AbsoluteFill style={{ backgroundColor: from ?? fill, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundColor: fill, clipPath: `inset(0 ${(1 - inP) * 100}% 0 0)` }}>
        {dots ? (
          <svg width={W} height={H} style={abs}>
            <defs>
              <pattern id={uid} width={gap} height={gap} patternUnits="userSpaceOnUse">
                <circle cx={gap / 2} cy={gap / 2} r={size / 2} fill={rgba(C.black, alpha)} />
              </pattern>
            </defs>
            <rect width={W} height={H} fill={`url(#${uid})`} />
          </svg>
        ) : null}
        {children}
      </AbsoluteFill>
      {outP > 0 ? <AbsoluteFill style={{ backgroundColor: next, clipPath: `inset(0 ${(1 - outP) * 100}% 0 0)` }} /> : null}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A card rising out of its own hard shadow: it starts pressed flat onto the shadow, then lifts to its tilt. */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  tilt?: number;
  fill?: string;
  small?: boolean;
  border?: string;
  shadow?: string;
  shadowSize?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at = 0, tilt = 0, fill = C.white, small = false, border = C.black, shadow = C.black, shadowSize, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("press", t);
  const e = small ? E.small : E.card;
  const sh = shadowSize ?? e.shadow;
  const lift = sh * p;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        backgroundColor: fill,
        border: `${e.border}px solid ${border}`,
        boxShadow: `${lift}px ${lift}px 0 ${shadow}`,
        transform: `translate(${sh - lift}px, ${sh - lift}px) rotate(${tilt}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** A sticker: appears at once, oversized and twisted, and slaps down onto its tilt on a spring (ratio 0.47). */
export const Sticker: React.FC<{ x: number; y: number; w: number; h: number; at?: number; tilt?: number; children: React.ReactNode }> = ({ x, y, w, h, at = 0, tilt = 0, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("slap", t);
  const s = lerp(style.motion.slapScale, 1, p);
  const r = tilt + (1 - p) * style.motion.slapTwist;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${r}deg) scale(${s})` }}>{children}</div>;
};

/** Label pill: the eyebrow on every region. A label is never plain text. */
export const Pill: React.FC<{ text: string; x: number; y: number; at?: number; fill?: string; tilt?: number; size?: number }> = ({ text, x, y, at = 0, fill = C.pink, tilt = -2, size = T.label }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const s = lerp(R.pop.from, 1, ease("pop", t));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: `${size * 0.38}px ${size * 0.9}px`,
        borderRadius: 9999,
        border: `${E.small.border}px solid ${C.black}`,
        boxShadow: `${E.small.shadow}px ${E.small.shadow}px 0 ${C.black}`,
        backgroundColor: fill,
        fontFamily: LABEL,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: `${T.labelTracking}em`,
        textTransform: "uppercase",
        color: C.black,
        lineHeight: 1,
        whiteSpace: "nowrap",
        transform: `rotate(${tilt}deg) scale(${s})`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Slab lines: Inter 900 uppercase; each line appears at once below its place and drops up into it (T59's waterfall).
 * `*stars*` get the hard yellow stamp, snapping in with the word.
 */
export const Slab: React.FC<{ lines: string[]; x: number; y: number; size: number; at?: number; col?: string; weight?: number; leading?: number; align?: "left" | "center" }> = ({
  lines,
  x,
  y,
  size,
  at = 0,
  col = C.black,
  weight = 900,
  leading = T.leading,
  align = "left",
}) => {
  const t = useSeconds() - at;
  const { distance } = R.drop;
  return (
    <div style={{ position: "absolute", left: x, right: align === "center" ? x : undefined, top: y, textAlign: align, fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: `${size * leading}px`, letterSpacing: `${T.tracking}em`, color: col, whiteSpace: "nowrap" }}>
      {lines.map((line, i) => {
        const local = t - i * style.motion.stagger;
        if (local <= 0) return <div key={i} style={{ visibility: "hidden" }}>{line.replace(/\*/g, "").toUpperCase()}</div>;
        const p = ease("drop", local);
        return (
          <div key={i} style={{ transform: `translateY(${(1 - p) * distance}px)` }}>
            {words(line).map((w, wi) => (
              <React.Fragment key={wi}>
                {wi > 0 && !w.glue ? " " : null}
                {w.em ? (
                  <span style={{ display: "inline-block", backgroundColor: C.yellow, padding: `0 ${size * 0.1}px`, marginLeft: -size * 0.1, lineHeight: `${size * 1.02}px` }}>{w.text.toUpperCase()}</span>
                ) : (
                  w.text.toUpperCase()
                )}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Body copy: Inter 500, sentence case, black. Snaps on with its card. */
export const Body: React.FC<{ text: string; x: number; y: number; w: number; size?: number }> = ({ text, x, y, w, size = T.body }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: DISPLAY, fontWeight: 500, fontSize: size, lineHeight: 1.32, color: C.black }}>{text}</div>
);

const starPoints = (cx: number, cy: number, r: number): string => {
  const n = E.star.points;
  const out: string[] = [];
  for (let i = 0; i < 2 * n; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rr = i % 2 ? r * E.star.inner : r;
    out.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
  }
  return out.join(" ");
};

/** The star burst: a 10-point sticker with a black outline and a hard shadow. Centre (cx, cy), radius r. */
export const Star: React.FC<{ cx: number; cy: number; r: number; at?: number; fill?: string; tilt?: number; line?: string; children?: React.ReactNode }> = ({ cx, cy, r, at = 0, fill = C.yellow, tilt = 0, line = C.black, children }) => {
  const sh = E.card.shadow;
  const box = 2 * r + 2 * sh + 16;
  const c = box / 2;
  return (
    <Sticker x={cx - c} y={cy - c} w={box} h={box} at={at} tilt={tilt}>
      <svg width={box} height={box} style={{ ...abs, overflow: "visible" }}>
        <polygon points={starPoints(c + sh, c + sh, r)} fill={line} stroke={line} strokeWidth={E.card.border} strokeLinejoin="miter" />
        <polygon points={starPoints(c, c, r)} fill={fill} stroke={C.black} strokeWidth={E.card.border} strokeLinejoin="miter" />
      </svg>
      {children}
    </Sticker>
  );
};

/** The stripe block: 45° black and pastel stripes in a bordered, shadowed sticker. */
export const Stripes: React.FC<{ x: number; y: number; w: number; h: number; at?: number; tilt?: number; fill?: string; line?: string }> = ({ x, y, w, h, at = 0, tilt = 0, fill = C.pink, line = C.black }) => (
  <Sticker x={x} y={y} w={w} h={h} at={at} tilt={tilt}>
    <div
      style={{
        width: w,
        height: h,
        boxSizing: "border-box",
        border: `${E.card.border}px solid ${line}`,
        boxShadow: `${E.card.shadow}px ${E.card.shadow}px 0 ${line}`,
        background: `repeating-linear-gradient(45deg, ${C.black} 0 ${E.stripe}px, ${fill} ${E.stripe}px ${2 * E.stripe}px)`,
      }}
    />
  </Sticker>
);

/** A flat pastel rectangle sticker. */
export const Block: React.FC<{ x: number; y: number; w: number; h: number; at?: number; tilt?: number; fill: string }> = ({ x, y, w, h, at = 0, tilt = 0, fill }) => (
  <Sticker x={x} y={y} w={w} h={h} at={at} tilt={tilt}>
    <div style={{ width: w, height: h, boxSizing: "border-box", border: `${E.card.border}px solid ${C.black}`, boxShadow: `${E.card.shadow}px ${E.card.shadow}px 0 ${C.black}`, backgroundColor: fill }} />
  </Sticker>
);

/** The 22 px deco dot: the only round shape on a card. */
export const Dot: React.FC<{ x: number; y: number; fill?: string }> = ({ x, y, fill = C.pink }) => (
  <div style={{ position: "absolute", left: x, top: y, width: E.dot, height: E.dot, boxSizing: "border-box", borderRadius: "50%", border: `${E.small.border}px solid ${C.black}`, backgroundColor: fill }} />
);

/** Points of a chunky arrow from (x1, y1) to (x2, y2): a shaft with a head. Guards a zero-length arrow. */
export const arrow = (x1: number, y1: number, x2: number, y2: number, shaft: number, head: number): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return `${x1},${y1}`;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const hl = Math.min(head * 0.9, len * 0.7);
  const bx = x2 - ux * hl;
  const by = y2 - uy * hl;
  const pts = [
    [x1 + nx * shaft, y1 + ny * shaft],
    [bx + nx * shaft, by + ny * shaft],
    [bx + nx * head, by + ny * head],
    [x2, y2],
    [bx - nx * head, by - ny * head],
    [bx - nx * shaft, by - ny * shaft],
    [x1 - nx * shaft, y1 - ny * shaft],
  ];
  return pts.map(([a, b]) => `${a},${b}`).join(" ");
};
