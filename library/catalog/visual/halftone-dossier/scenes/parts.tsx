/**
 * Halftone Dossier's pieces: a printed page (paper multiplied over everything, a fold, dust specks), rotated
 * halftone dot screens with density fields, the case-file HUD, per-character popping slab headlines with a pink
 * misregistered shadow, the navy caption pill, rubber stamps that slam and shake the page, starbursts, rotating
 * rays, a thick-outlined kawaii suspect with line boil, and speech bubbles. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, SANS, SLAB } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
const P = style.palette;
export const C = {
  paper: color(P, "background"),
  navy: color(P, "text"),
  night2: color(P, "muted"),
  fold: color(P, "faint"),
  pink: color(P, "accent"),
  yellow: color(P, "accent2"),
  blue: color(P, "blue"),
  red: color(P, "red"),
  cream: color(P, "cream"),
  night: color(P, "night"),
  pinkPale: color(P, "pinkPale"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const f1 = (n: number) => n.toFixed(1);
const abs: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

export const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Box = [number, number, number, number];
/** Density fields for dot screens (0..1). */
export const radial = (cx: number, cy: number, r: number, pw = 1) => (x: number, y: number) => Math.pow(clamp(1 - Math.hypot(x - cx, y - cy) / r), pw);
export const edge = (r: number, pw = 1.5) => (x: number, y: number) => Math.pow(clamp(1 - Math.min(x, y, W - x, H - y) / r), pw);
export const ramp = (y0: number, y1: number) => (_x: number, y: number) => 0.25 + 0.75 * clamp((y - y0) / (y1 - y0));

/** A rotated halftone screen as one path of circles: radius = density × step × maxK. */
export const dotPath = (box: Box, dens: (x: number, y: number) => number, step = E.dots.step, angle = 45, maxK = E.dots.maxK): string => {
  const s = Math.max(E.dots.minStep, step);
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const [x0, y0, x1, y1] = box;
  const corners = [
    [x0, y0],
    [x1, y0],
    [x0, y1],
    [x1, y1],
  ];
  const us = corners.map(([x, y]) => x * ca + y * sa);
  const vs = corners.map(([x, y]) => -x * sa + y * ca);
  const parts: string[] = [];
  for (let u = Math.floor(Math.min(...us) / s) * s; u <= Math.max(...us); u += s) {
    for (let v = Math.floor(Math.min(...vs) / s) * s; v <= Math.max(...vs); v += s) {
      const x = u * ca - v * sa;
      const y = u * sa + v * ca;
      if (x < x0 - s || x > x1 + s || y < y0 - s || y > y1 + s) continue;
      const r = clamp(dens(x, y)) * s * maxK;
      if (r < 0.6) continue;
      parts.push(`M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`);
    }
  }
  return parts.join("");
};

/** A dot screen in one ink, overprinted (multiplied) on what's under it. */
export const Dots: React.FC<{ box?: Box; dens: (x: number, y: number) => number; col: string; step?: number; angle?: number; maxK?: number; clip?: string; opacity?: number; blend?: "multiply" | "normal" }> = ({
  box = [0, 0, W, H],
  dens,
  col,
  step,
  angle = 45,
  maxK,
  clip,
  opacity = 1,
  blend = "multiply",
}) => {
  const d = useMemo(() => dotPath(box, dens, step, angle, maxK), [box.join(","), step, angle, maxK]);
  return <path d={d} fill={col} clipPath={clip} opacity={opacity} style={{ mixBlendMode: blend }} />;
};

/**
 * The paper layer, multiplied over everything: low-frequency mottling, fine per-pixel noise (about ±13 levels, a
 * little warmer), a radial vignette and the faint fold.
 */
const PaperLayer: React.FC = React.memo(() => (
  <svg width={W} height={H} style={{ ...abs, mixBlendMode: "multiply" }}>
    <defs>
      <filter id="hd-mottle" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={4} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.84  0 0 0 0 0.8  0 0 0 0 0.72  1.1 0 0 0 -0.35" />
      </filter>
      <filter id="hd-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={1} seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.78  0 0 0 0 0.72  1.2 0 0 0 -0.45" />
      </filter>
      <radialGradient id="hd-vig" cx="50%" cy="50%" r="75%">
        <stop offset={0.55} stopColor="rgb(120,100,80)" stopOpacity={0} />
        <stop offset={1} stopColor="rgb(120,100,80)" stopOpacity={E.paper.vignette} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="#fff" />
    <rect width={W} height={H} filter="url(#hd-mottle)" opacity={0.45} />
    <rect width={W} height={H} filter="url(#hd-grain)" opacity={(E.paper.noise / 13) * 0.35} />
    <rect width={W} height={H} fill="url(#hd-vig)" />
    <line x1={0} y1={style.layout.fold} x2={W} y2={style.layout.fold} stroke={C.fold} strokeWidth={3} opacity={0.8} />
  </svg>
));

/** Dust: 520 cream and 90 navy specks, reseeded every 2 frames. */
const Specks: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / E.specks.every);
  const d = useMemo(() => {
    let cream = "";
    let navy = "";
    for (let i = 0; i < E.specks.cream + E.specks.navy; i++) {
      const x = rand(seed * 977 + i * 3 + 1) * W;
      const y = rand(seed * 977 + i * 3 + 2) * H;
      const r = 0.6 + rand(seed * 977 + i * 3 + 3) * 1.8;
      const c = `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`;
      if (i < E.specks.cream) cream += c;
      else navy += c;
    }
    return { cream, navy };
  }, [seed]);
  return (
    <svg width={W} height={H} style={abs}>
      <path d={d.cream} fill={C.cream} opacity={0.75} />
      <path d={d.navy} fill={C.navy} opacity={0.55} />
    </svg>
  );
};

/**
 * The printed page. `ground` sets the paper colour; `hits` are stamp times: each shakes the page (quadratic decay,
 * different x/y frequencies) and flashes white (capped at 0.5). `push` scales the page slowly. Waits for the fonts.
 */
export const Page: React.FC<{ ground?: "paper" | "blue" | "night"; hits?: { at: number; px: number }[]; push?: number; children: React.ReactNode }> = ({
  ground = "paper",
  hits = [],
  push = 0,
  children,
}) => {
  useFontsReady(FACES);
  const t = useSeconds();
  let sx = 0;
  let sy = 0;
  let flash = 0;
  for (const h of hits) {
    const a = t - h.at;
    if (a < 0 || a > R.shake.duration) continue;
    const k = Math.pow(1 - a / R.shake.duration, 2) * h.px;
    sx += k * Math.sin(a * 2 * Math.PI * 23);
    sy += k * Math.cos(a * 2 * Math.PI * 17);
    flash = Math.max(flash, R.flash.from * (1 - clamp(a / R.flash.duration)));
  }
  const z = 1 + (push ? (R.push.to - 1) * clamp(t / R.push.duration) : 0);
  const bg = ground === "blue" ? C.blue : ground === "night" ? C.night : C.paper;
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${z})` }}>{children}</AbsoluteFill>
      <PaperLayer />
      <Specks />
      {flash > 0 ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

/** The case-file HUD: case number and chapter chip top left; blinking REC dot and the running clock top right. */
export const Hud: React.FC<{ count: string; title: string; clock: number; dark?: boolean }> = ({ count, title, clock, dark = false }) => {
  const t = useSeconds();
  const ink = dark ? C.cream : C.navy;
  const secs = clock + t;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(Math.floor(secs % 60)).padStart(2, "0");
  const y = style.layout.hudY;
  return (
    <>
      <div style={{ position: "absolute", left: M, top: y - 4, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 800, fontSize: T.label, color: ink, whiteSpace: "nowrap" }}>
        <span>FILE 450/700</span>
        <span style={{ backgroundColor: ink, color: dark ? C.night : C.paper, padding: "4px 12px", borderRadius: 6 }}>
          {count} | {title}
        </span>
      </div>
      <div style={{ position: "absolute", right: M, top: y - 4, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: T.label, color: ink }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C.red, opacity: Math.floor(t * 2) % 2 === 0 ? 1 : 0.25 }} />
        <span>REC {mm}:{ss}</span>
      </div>
    </>
  );
};

/** Squash on landing, volume kept: sq = 1 − k·e^(−7a)·cos(21a), applied as scale(1/sq, sq). */
const squash = (a: number, k = 0.22): number => (a <= 0 ? 1 : 1 - k * Math.exp(-7 * a) * Math.cos(21 * a));

/**
 * A line or lines of type where each glyph drops in and squashes on landing (never a fade), with an optional
 * misregistered offset shadow. `*stars*` mark emphasis words, drawn in `emCol`.
 */
export const PopText: React.FC<{
  lines: string[];
  x?: number;
  y: number;
  size: number;
  at: number;
  font?: string;
  weight?: number;
  col?: string;
  emCol?: string;
  shadow?: string | false;
  stroke?: string;
  strokeW?: number;
  align?: "left" | "center" | "right";
  stagger?: number;
  leading?: number;
  upper?: boolean;
  /** title letters: fall 700 px in 0.2 s each, 0.25 s apart, then squash */
  fall?: boolean;
}> = ({ lines, x = M, y, size, at, font = SLAB, weight = 400, col = C.navy, emCol, shadow = C.pink, stroke, strokeW = 0, align = "left", stagger, leading = T.leading, upper = false, fall = false }) => {
  const gap = stagger ?? (fall ? R.fall.gap : R.char.stagger);
  const dur = fall ? R.fall.duration : R.char.duration;
  const drop = fall ? R.fall.distance : R.char.drop;
  const t = useSeconds();
  let i = 0;
  const m = T.misregister * (size / 104);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : 0,
        right: align === "right" ? W - x : align === "center" ? 0 : undefined,
        top: y - size * 0.82,
        textAlign: align,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: `${size * leading}px`,
        whiteSpace: "nowrap",
        textTransform: upper ? "uppercase" : "none",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => (
            <React.Fragment key={wi}>
              {wi > 0 ? " " : null}
              <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {Array.from(w.text).map((ch, ci) => {
                  const lt = t - at - i * gap;
                  i += 1;
                  if (lt < 0) return <span key={ci} style={{ display: "inline-block", opacity: 0 }}>{ch}</span>;
                  const p = ease(fall ? "fall" : "char", lt);
                  const sq = squash(lt - dur, fall ? 0.3 : 0.22);
                  return (
                    <span
                      key={ci}
                      style={{
                        display: "inline-block",
                        color: w.em && emCol ? emCol : col,
                        transform: `translateY(${-(1 - p) * drop}px) scale(${1 / sq}, ${sq})`,
                        transformOrigin: "50% 100%",
                        textShadow: shadow ? `${m}px ${m}px 0 ${shadow}` : undefined,
                        WebkitTextStroke: stroke ? `${strokeW}px ${stroke}` : undefined,
                        paintOrder: "stroke fill",
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

/** The caption pill: navy, radius 14, a pink +8/+8 offset shadow, cream Noto Sans Black, keyword in yellow. */
export const Caption: React.FC<{ text: string; at: number; y?: number; size?: number; width?: number }> = ({ text, at, y = style.layout.captionY, size = T.caption, width = COLUMN }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("caption", t);
  const sh = E.caption.shadow;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: width,
          padding: `${size * 0.32}px ${size * 0.6}px ${size * 0.38}px`,
          backgroundColor: C.navy,
          borderRadius: E.caption.radius,
          boxShadow: `${sh}px ${sh}px 0 ${C.pink}`,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.18,
          color: C.cream,
          textAlign: "center",
          transform: `rotate(${E.caption.tilt}deg) scale(${p})`,
        }}
      >
        {words(text).map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
            <span style={{ color: w.em ? C.yellow : C.cream }}>{w.text}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * A rubber stamp: a double rounded rectangle (12 px and 0.35× inside) and black-weight words, through an ink filter
 * (displacement 7 and a coarse grain), at 93%, tilted. Slams from 2.6× to 1× in 0.09 s, then a 5% damped bounce.
 */
export const Stamp: React.FC<{ lines: string[]; cx: number; cy: number; at: number; rotate?: number; size?: number; col?: string; seed?: number }> = ({
  lines,
  cx,
  cy,
  at,
  rotate = -8,
  size = T.stamp,
  col = C.red,
  seed = 3,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const st = R.stamp;
  const p = ease("stamp", t);
  const a = t - st.duration;
  const s = a < 0 ? st.from + (1 - st.from) * p : 1 + st.bounce * Math.exp(-14 * a) * Math.sin(40 * a);
  const longest = Math.max(...lines.map((l) => l.length));
  const w = longest * size * 0.66 + size * 0.9;
  const h = lines.length * size * 0.98 + size * 0.62;
  const b = E.stamp.border;
  const id = `hd-ink-${seed}`;
  return (
    <svg width={w + 60} height={h + 60} viewBox={`-30 -30 ${w + 60} ${h + 60}`} style={{ position: "absolute", left: cx - w / 2 - 30, top: cy - h / 2 - 30, transform: `rotate(${rotate}deg) scale(${s})`, opacity: E.stamp.opacity, overflow: "visible" }}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={E.stamp.ink} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves={2} seed={seed + 5} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.3" result="gm" />
          <feComposite in="d" in2="gm" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill="none" stroke={col}>
        <rect x={b / 2} y={b / 2} width={w - b} height={h - b} rx={size * 0.18} strokeWidth={b} />
        <rect x={b + 8} y={b + 8} width={w - 2 * b - 16} height={h - 2 * b - 16} rx={size * 0.1} strokeWidth={b * E.stamp.inner} />
        {lines.map((l, i) => (
          <text key={i} x={w / 2} y={size * 0.31 + (i + 0.82) * size * 0.98} textAnchor="middle" fill={col} stroke="none" style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: "0.02em" }}>
            {l.toUpperCase()}
          </text>
        ))}
      </g>
    </svg>
  );
};

/** A 24-point starburst. */
export const starburst = (cx: number, cy: number, r0: number, r1: number, n = 24): string => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 ? r0 : r1;
    pts.push(`${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`);
  }
  return `M ${pts.join(" L ")} Z`;
};

/** Radial rays: 28 alternating wedges turning at 12°/s. */
export const Rays: React.FC<{ cx: number; cy: number; r: number; col: string; opacity?: number }> = ({ cx, cy, r, col, opacity = 1 }) => {
  const t = useSeconds();
  const n = E.rays.wedges;
  const rot = (t * E.rays.speed * Math.PI) / 180;
  let d = "";
  for (let i = 0; i < n; i += 2) {
    const a0 = rot + (2 * Math.PI * i) / n;
    const a1 = rot + (2 * Math.PI * (i + 1)) / n;
    d += `M ${cx} ${cy} L ${f1(cx + Math.cos(a0) * r)} ${f1(cy + Math.sin(a0) * r)} L ${f1(cx + Math.cos(a1) * r)} ${f1(cy + Math.sin(a1) * r)} Z `;
  }
  return <path d={d} fill={col} opacity={opacity} />;
};

/** Line boil for characters and drawn props: displacement reseeded every 0.1 s on a 40-seed cycle. */
export const Boil: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const t = useSeconds();
  const seed = Math.floor(t / E.boil.every) % E.boil.cycle;
  return (
    <>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={E.boil.frequency} numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={E.boil.scale} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency={E.boil.grain} numOctaves={1} seed={seed + 7} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.05" result="gm" />
          <feComposite in="d" in2="gm" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </>
  );
};

/**
 * The suspect: a kawaii air molecule (two joined round atoms, N₂), 7 px navy outline, blue body, cream bellies, pink
 * cheeks, big glossy eyes with two cream highlights. `squint` 0..1 narrows the eyes.
 */
export const Suspect: React.FC<{ cx: number; cy: number; r: number; at: number; squint?: number }> = ({ cx, cy, r, at, squint = 0 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("pop", t);
  const sq = squash(t - R.pop.duration, 0.12);
  const o = E.outline;
  const atoms: [number, number][] = [
    [cx - r * 0.62, cy],
    [cx + r * 0.62, cy + r * 0.04],
  ];
  const blink = Math.abs(((t + 0.7) % 2.6) - 0.06) < 0.06 ? 0.15 : 1 - 0.6 * squint;
  return (
    <g transform={`translate(${cx} ${cy + r}) scale(${p / sq} ${p * sq}) translate(${-cx} ${-cy - r})`}>
      <Boil id={`hd-boil-${Math.round(cx)}`}>
        {atoms.map(([x, y], i) => (
          <circle key={`o${i}`} cx={x} cy={y} r={r} fill={C.navy} stroke={C.navy} strokeWidth={2 * o} />
        ))}
        {atoms.map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r={r} fill={C.blue} />
        ))}
        {atoms.map(([x, y], i) => (
          <ellipse key={`c${i}`} cx={x + (i ? 0.12 : -0.12) * r} cy={y + r * 0.62} rx={r * 0.42} ry={r * 0.22} fill={C.cream} />
        ))}
        {/* face on the front atom */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <ellipse cx={cx + s * r * 0.34} cy={cy - r * 0.1} rx={r * 0.17} ry={r * 0.24 * blink} fill={C.navy} />
            {blink > 0.5 ? (
              <>
                <circle cx={cx + s * r * 0.34 + r * 0.06} cy={cy - r * 0.19} r={r * 0.07} fill={C.cream} />
                <circle cx={cx + s * r * 0.34 - r * 0.05} cy={cy - r * 0.0} r={r * 0.035} fill={C.cream} />
              </>
            ) : null}
            <ellipse cx={cx + s * r * 0.62} cy={cy + r * 0.16} rx={r * 0.11} ry={r * 0.065} fill={C.pink} />
          </g>
        ))}
        <path d={`M ${cx - r * 0.1} ${cy + r * 0.16} Q ${cx} ${cy + r * 0.28} ${cx + r * 0.1} ${cy + r * 0.16}`} fill="none" stroke={C.navy} strokeWidth={o * 0.8} strokeLinecap="round" />
      </Boil>
    </g>
  );
};

/** A speech bubble: cream with a 6 px navy stroke and a tail to `to`. Pops in. */
export const Bubble: React.FC<{ text: string; x: number; y: number; w: number; to: [number, number]; at: number; size?: number }> = ({ text, x, y, w, to, at, size = 38 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("pop", t);
  const h = size * 2.3;
  const bx = x + w * 0.35;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${p})`, transformOrigin: `${to[0]}px ${to[1]}px` }}>
      <svg width={W} height={H} style={abs}>
        <path
          d={`M ${x + 20} ${y} H ${x + w - 20} Q ${x + w} ${y} ${x + w} ${y + 20} V ${y + h - 20} Q ${x + w} ${y + h} ${x + w - 20} ${y + h} H ${bx + 50} L ${to[0]} ${to[1]} L ${bx} ${y + h} H ${x + 20} Q ${x} ${y + h} ${x} ${y + h - 20} V ${y + 20} Q ${x} ${y} ${x + 20} ${y} Z`}
          fill={C.cream}
          stroke={C.navy}
          strokeWidth={E.bubble}
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, color: C.navy }}>{text}</div>
    </div>
  );
};

/** Text that types on: JetBrains Mono, no caret. */
export const MonoLine: React.FC<{ text: string; x?: number; y: number; at: number; col?: string; size?: number; align?: "left" | "center"; spacing?: number }> = ({
  text,
  x = M,
  y,
  at,
  col = C.navy,
  size = T.label,
  align = "left",
  spacing = 3,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const n = Math.min(text.length, Math.floor(t / 0.03));
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y - size * 0.8, textAlign: align, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: spacing, color: col, whiteSpace: "nowrap" }}>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};
