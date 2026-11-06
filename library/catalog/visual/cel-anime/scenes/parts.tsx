/**
 * Cel Anime's pieces: airbrushed painted plates (night city, dawn, day), cels with hard shadow and highlight crescents
 * and coloured lines (built from masks of the shape shifted toward and away from the light), the back-view heroine,
 * neon signs, flares, speed lines, the chrome title card, outlined cream-yellow subtitles, backlit meters, the 80s eye,
 * and the videotape/CRT finish. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
const P = style.palette;
export const col = (role: string) => color(P, role);
export const C = {
  ground: col("background"),
  sub: col("text"),
  cyan: col("muted"),
  faint: col("faint"),
  scarf: col("accent"),
  teal: col("accent2"),
  outline: col("outline"),
  magenta: col("magenta"),
  gold: col("gold"),
  goldLight: col("gold-light"),
  dark: col("dark"),
  darkShade: col("dark-shade"),
};

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** Time held on twos (12 drawings a second) or threes (8). */
export const onTwos = (t: number) => Math.floor(t * style.motion.twos) / style.motion.twos;
export const onThrees = (t: number) => Math.floor(t * style.motion.threes) / style.motion.threes;

export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const rgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (v: number[]) => `#${v.map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
export const mix = (a: string, b: string, k: number) => {
  const x = rgb(a);
  const y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * k));
};
const mulc = (a: string, m: number[]) => hex(rgb(a).map((v, i) => v * m[i]));

// ---------------------------------------------------------------- colour models

export type LightName = keyof typeof style.light;
export type Model = { f: string; s: string; h: string; l: string };
/** A part's colour model (fill, shadow, highlight, line) under a lighting set: each light is its own model, not a filter. */
export const model = (part: string, light: LightName): Model => {
  const L = style.light[light];
  const base = (suffix: string, fallback: string) => {
    const role = suffix ? `${part}-${suffix}` : part;
    return P.find((p) => p.role === role)?.hex ?? col(fallback);
  };
  const f = part === "scarf" ? col("accent") : part === "teal" ? col("accent2") : base("", part);
  const s = base("shade", part);
  const h = base("light", part);
  const l = base("line", part);
  return { f: mulc(f, L.lit), s: mulc(s, L.shade), h: light === "backlit" ? mulc(f, L.lit) : mulc(h, L.lit), l: mulc(l, L.line) };
};

/**
 * One cel: a flat fill, a hard shadow crescent (the shape minus itself shifted toward the light), a hard highlight
 * crescent (minus itself shifted away), an optional saturated rim light, and a coloured line (never pure black).
 */
export const Cel: React.FC<{ id: string; d: string; m: Model; light?: [number, number]; rim?: string; hl?: boolean; line?: number }> = ({ id, d, m, light = [-0.7, -0.7], rim, hl = true, line = E.line }) => {
  const [lx, ly] = light;
  const [sx, sy] = E.shadowShift;
  const [hx, hy] = E.lightShift;
  return (
    <g>
      <defs>
        <mask id={`${id}-s`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={8000} height={8000}>
          <path d={d} fill="#fff" />
          <path d={d} fill="#000" transform={`translate(${lx * sx} ${ly * sy})`} />
        </mask>
        <mask id={`${id}-h`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={8000} height={8000}>
          <path d={d} fill="#fff" />
          <path d={d} fill="#000" transform={`translate(${-lx * hx} ${-ly * hy})`} />
        </mask>
        {rim ? (
          <mask id={`${id}-r`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={8000} height={8000}>
            <path d={d} fill="#fff" />
            <path d={d} fill="#000" transform={`translate(${-lx * E.rim} ${-ly * E.rim})`} />
          </mask>
        ) : null}
      </defs>
      <path d={d} fill={m.f} />
      <path d={d} fill={m.s} mask={`url(#${id}-s)`} />
      {hl ? <path d={d} fill={m.h} mask={`url(#${id}-h)`} /> : null}
      {rim ? <path d={d} fill={rim} mask={`url(#${id}-r)`} /> : null}
      <path d={d} fill="none" stroke={m.l} strokeWidth={line} strokeLinejoin="round" />
    </g>
  );
};

// ---------------------------------------------------------------- the heroine (always seen from behind)

const HERO = {
  legL: "M -40 -262 L -18 -262 L -21 -16 L -41 -16 Z",
  legR: "M 16 -262 L 38 -262 L 41 -16 L 21 -16 Z",
  shoeL: "M -54 -12 Q -50 -26 -22 -24 L -18 -2 Q -40 4 -56 -2 Z",
  shoeR: "M 54 -12 Q 50 -26 22 -24 L 18 -2 Q 40 4 56 -2 Z",
  skirt: "M -60 -304 L 60 -304 L 88 -214 L -88 -214 Z",
  jacket: "M -66 -474 Q -88 -466 -92 -424 L -80 -296 L 80 -296 L 92 -424 Q 88 -466 66 -474 Z",
  armL: "M -88 -458 Q -110 -420 -108 -326 L -88 -326 Q -88 -404 -70 -440 Z",
  armR: "M 88 -458 Q 110 -420 108 -326 L 88 -326 Q 88 -404 70 -440 Z",
  armUp: "M 58 -470 L 98 -466 L 166 -604 L 130 -628 Z",
  handL: "M -110 -328 Q -112 -300 -98 -296 Q -84 -300 -86 -328 Z",
  handR: "M 110 -328 Q 112 -300 98 -296 Q 84 -300 86 -328 Z",
  handUp: "M 124 -626 Q 122 -660 146 -668 Q 172 -662 166 -606 Z",
  wrap: "M -50 -496 Q 0 -480 50 -496 L 54 -468 Q 0 -450 -54 -468 Z",
  hair: "M -60 -560 Q -64 -628 0 -630 Q 64 -628 60 -560 L 66 -470 L 56 -440 L 48 -398 L 32 -430 L 20 -378 L 6 -420 L -8 -368 L -22 -416 L -36 -382 L -46 -434 L -60 -402 L -68 -470 Z",
  ring: "M -52 -590 Q 0 -606 52 -590 L 48 -576 L 38 -583 L 27 -572 L 15 -581 L 3 -570 L -9 -580 L -21 -571 L -33 -581 L -46 -573 Z",
};

/** The scarf's two tails: ribbons on a travelling sine, a 4-drawing cycle on twos. */
const tailPath = (t: number, k: number, len: number, wind: number): string => {
  const phase = (Math.floor(t * style.motion.twos) % 4) / 4;
  const top: string[] = [];
  const bot: string[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = 40 + u * len;
    const y = -486 + k * 22 + u * (30 + k * 26) + wind * u * Math.sin(2 * Math.PI * (u * 1.3 - phase - k * 0.2));
    const w = (1 - u * 0.5) * 15;
    top.push(`${x.toFixed(1)} ${(y - w).toFixed(1)}`);
    bot.push(`${x.toFixed(1)} ${(y + w).toFixed(1)}`);
  }
  return `M ${top.join(" L ")} L ${bot.reverse().join(" L ")} Z`;
};

/** The heroine from behind (feet at x, y): tights, skirt, jacket, scarf, long hair with uneven tips and an angel ring. */
export const Heroine: React.FC<{
  id: string;
  x: number;
  y: number;
  s?: number;
  light: LightName;
  dir?: [number, number];
  rim?: string;
  pose?: "stand" | "point";
  t: number;
  wind?: number;
  overlay?: React.ReactNode;
}> = ({
  id,
  x,
  y,
  s = 1,
  light,
  dir = [-0.7, -0.7],
  rim,
  pose = "stand",
  t,
  wind = 22,
  overlay,
}) => {
  const m = (part: string) => model(part, light);
  const tails = [tailPath(t, 1, 190, wind), tailPath(t, 0, 230, wind)];
  const shapes = [HERO.legL, HERO.legR, HERO.skirt, HERO.armL, HERO.jacket, HERO.wrap, HERO.hair, pose === "point" ? HERO.armUp : HERO.armR, ...tails];
  const cel = (key: string, d: string, part: string, hl = true) => <Cel key={key} id={`${id}-${key}`} d={d} m={m(part)} light={dir} rim={rim} hl={hl} line={E.line / s} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {cel("legL", HERO.legL, "dark", false)}
      {cel("legR", HERO.legR, "dark", false)}
      {cel("shoeL", HERO.shoeL, "dark", false)}
      {cel("shoeR", HERO.shoeR, "dark", false)}
      {cel("skirt", HERO.skirt, "teal")}
      {cel("armL", HERO.armL, "jacket")}
      {cel("handL", HERO.handL, "skin", false)}
      {pose === "point" ? (
        <>
          {cel("armUp", HERO.armUp, "jacket")}
          {cel("handUp", HERO.handUp, "skin", false)}
        </>
      ) : (
        <>
          {cel("armR", HERO.armR, "jacket")}
          {cel("handR", HERO.handR, "skin", false)}
        </>
      )}
      {cel("jacket", HERO.jacket, "jacket")}
      {cel("wrap", HERO.wrap, "scarf")}
      {cel("tail2", tails[0], "scarf")}
      {cel("hair", HERO.hair, "hair")}
      <path d={HERO.ring} fill={m("hair").h} />
      {cel("tail1", tails[1], "scarf")}
      {overlay ? (
        <>
          <clipPath id={`${id}-clip`}>
            {shapes.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </clipPath>
          <g clipPath={`url(#${id}-clip)`}>
            <g transform={`scale(${1 / s}) translate(${-x} ${-y})`}>{overlay}</g>
          </g>
        </>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- plates

export type PlateName = keyof typeof style.plates;
/** A painted plate: an airbrushed vertical gradient down to `horizon` px (plates carry the gradients, cels never do). */
export const Plate: React.FC<{ name: PlateName; horizon?: number }> = ({ name, horizon = H }) => {
  const stops = style.plates[name].map(([c, p]) => `${c} ${(Number(p) / 100) * horizon}px`).join(", ");
  return <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${stops}, ${style.plates[name][style.plates[name].length - 1][0]} ${H}px)` }} />;
};

/** A city skyline painted once: dark blocks with gold windows, a few generic neon signs that glow. */
export const Skyline: React.FC<{ base: number; seed?: number; tint?: string; lit?: number; signs?: boolean; t: number; maxH?: number }> = ({
  base,
  seed = 1,
  tint = C.darkShade,
  lit = 0.35,
  signs = true,
  t,
  maxH = 540,
}) => {
  const blocks: React.ReactNode[] = [];
  const windows: React.ReactNode[] = [];
  let x = -20;
  let i = 0;
  while (x < W + 20) {
    const w = 70 + rnd(i, seed) * 110;
    const h = 120 + rnd(i, seed + 1) * (maxH - 120);
    blocks.push(<rect key={`b${i}`} x={x} y={base - h} width={w + 2} height={h + 400} fill={tint} />);
    for (let wy = base - h + 22; wy < base - 20; wy += 26)
      for (let wx = x + 12; wx < x + w - 14; wx += 20) {
        const r = rnd(wx * 3.1 + wy, seed + 5);
        if (r < lit) windows.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width={9} height={13} fill={r < lit * 0.25 ? C.goldLight : C.gold} />);
      }
    x += w;
    i += 1;
  }
  const flick = Math.floor(t * style.motion.threes) % 7 !== 0;
  const sign = (text: string, sx: number, sy: number, c: string, size: number, vertical = false) => (
    <div
      key={text}
      style={{
        position: "absolute",
        left: sx,
        top: sy,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: vertical ? 0 : 4,
        lineHeight: 0.95,
        color: mix(c, "#ffffff", 0.55),
        width: vertical ? size : undefined,
        textAlign: "center",
        textShadow: `0 0 6px ${c}, 0 0 ${E.glow}px ${c}, 0 0 ${E.glow * 2}px ${c}`,
        opacity: flick || text !== "BAR" ? 1 : 0.55,
      }}
    >
      {vertical ? [...text].map((ch, k) => <div key={k}>{ch}</div>) : text}
    </div>
  );
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {blocks}
        {windows}
      </svg>
      {signs ? [sign("CAFE", 120, base - 300, C.magenta, 52), sign("BAR", 760, base - 210, C.cyan, 46), sign("HOTEL", 610, base - 470, C.magenta, 40, true)] : null}
    </>
  );
};

/** A dark rooftop in the foreground with a railing, from y to the bottom of the frame. */
export const Rooftop: React.FC<{ y: number; light: LightName }> = ({ y, light }) => {
  const d = model("dark", light);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={0} y={y} width={W} height={H - y} fill={d.s} />
      <rect x={0} y={y} width={W} height={10} fill={d.f} />
      <line x1={0} y1={y - 90} x2={W} y2={y - 90} stroke={d.f} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={20 + i * 96} y1={y - 90} x2={20 + i * 96} y2={y} stroke={d.f} strokeWidth={6} />
      ))}
    </svg>
  );
};

/** The sun with a star-burst flare, an anamorphic streak across the frame and hexagonal ghosts through the centre. */
export const SunFlare: React.FC<{ x: number; y: number; r: number; k?: number }> = ({ x, y, r, k = 1 }) => {
  const ghosts = [0.35, 0.62, 0.9, 1.25].map((f, i) => {
    const gx = x + (W / 2 - x) * f * 2;
    const gy = y + (H * 0.45 - y) * f * 2;
    const gr = 18 + i * 14;
    const pts = Array.from({ length: 6 }, (_, j) => `${gx + gr * Math.cos((j * Math.PI) / 3)},${gy + gr * Math.sin((j * Math.PI) / 3)}`).join(" ");
    return <polygon key={i} points={pts} fill={i % 2 ? "#ffd6f0" : "#d6f6ff"} opacity={0.22 * k} />;
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id="cel-sun">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fff6d0" />
          <stop offset="60%" stopColor={C.gold} stopOpacity={0.55} />
          <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="cel-streak" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffd6a0" stopOpacity={0} />
          <stop offset="50%" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ffd6a0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3.2} fill="url(#cel-sun)" opacity={k} />
      <circle cx={x} cy={y} r={r} fill="#fffbe8" opacity={k} />
      <rect x={x - W * 0.9 * k} y={y - 3} width={W * 1.8 * k} height={6} fill="url(#cel-streak)" />
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 4;
        const l = r * (i % 2 ? 2.6 : 4.2) * k;
        return <line key={i} x1={x - l * Math.cos(a)} y1={y - l * Math.sin(a)} x2={x + l * Math.cos(a)} y2={y + l * Math.sin(a)} stroke="#ffffff" strokeWidth={3} opacity={0.8} />;
      })}
      {ghosts}
    </svg>
  );
};

/** Radial speed lines (tapered wedges) out of a point: the anime way to say "outward, now". */
export const SpeedLines: React.FC<{ x: number; y: number; r0: number; r1: number; n: number; cols: string[]; k: number; seed?: number }> = ({ x, y, r0, r1, n, cols, k, seed = 3 }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + rnd(i, seed) * 0.12;
      const w = (0.008 + rnd(i, seed + 1) * 0.02) * Math.PI;
      const ra = r0 + rnd(i, seed + 2) * 60;
      const rb = ra + (r1 - ra) * k * (0.6 + 0.4 * rnd(i, seed + 3));
      const p = [
        [x + ra * Math.cos(a - w), y + ra * Math.sin(a - w)],
        [x + rb * Math.cos(a), y + rb * Math.sin(a)],
        [x + ra * Math.cos(a + w), y + ra * Math.sin(a + w)],
      ];
      return <polygon key={i} points={p.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" ")} fill={cols[i % cols.length]} />;
    })}
  </svg>
);

// ---------------------------------------------------------------- type

/**
 * The chrome title card: heavy italic capitals filled with a chrome gradient (sky → white horizon line → violet → pink
 * → gold), a dark outline and a neon outline that glows. It flickers on at 12 fps, a light band sweeps across it and a
 * star glint lands on its last letter.
 */
export const ChromeTitle: React.FC<{ lines: string[]; size: number; y: number; at?: number; glint?: [number, number] }> = ({ lines, size, y, at = 0, glint }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const T = style.type;
  // flicker on: on/off on twos for the flicker recipe's length, then steady
  const step = Math.floor(onTwos(t) * style.motion.twos);
  const on = t > R.flicker.duration || [0, 2, 3].includes(step);
  if (!on) return null;
  const sweep = ease("sweep", t - 0.4);
  const chrome = `linear-gradient(to bottom, #9ee4ff 0%, #e8f8ff 42%, #ffffff 47%, #2b1f6e 49%, #6a3fb8 62%, #ff6fb0 82%, #ffd27a 100%)`;
  const box: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: y,
    textAlign: "center",
    fontFamily: DISPLAY,
    fontStyle: "italic",
    fontWeight: 900,
    fontSize: size,
    lineHeight: T.leading,
    letterSpacing: `${T.tracking}em`,
    whiteSpace: "nowrap",
  };
  const render = (layer: "neon" | "dark" | "chrome" | "sweep") => (
    <div
      style={{
        ...box,
        color: layer === "neon" ? C.magenta : layer === "dark" ? C.outline : "transparent",
        WebkitTextStroke: layer === "neon" ? `${T.neonOutline}px ${C.magenta}` : layer === "dark" ? `${T.titleOutline}px ${C.outline}` : undefined,
        filter: layer === "neon" ? `drop-shadow(0 0 ${E.glow}px ${C.magenta})` : undefined,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          <span
            style={
              layer === "chrome"
                ? { background: chrome, backgroundSize: `100% ${size * T.leading}px`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                : layer === "sweep"
                  ? {
                      background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 140 - 30}%, rgba(255,255,255,0.85) ${sweep * 140 - 20}%, rgba(255,255,255,0) ${sweep * 140 - 10}%)`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : undefined
            }
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      {render("neon")}
      {render("dark")}
      {render("chrome")}
      {sweep > 0 && sweep < 1 ? render("sweep") : null}
      {glint && t > 0.9 ? <Glint x={glint[0]} y={glint[1]} k={clamp((t - 0.9) / 0.25)} /> : null}
    </>
  );
};

/** A four-point star glint. */
export const Glint: React.FC<{ x: number; y: number; k: number; size?: number }> = ({ x, y, k, size = 70 }) => {
  const s = size * (0.6 + 0.4 * k);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <path d={`M ${x} ${y - s} Q ${x + 6} ${y - 6} ${x + s} ${y} Q ${x + 6} ${y + 6} ${x} ${y + s} Q ${x - 6} ${y + 6} ${x - s} ${y} Q ${x - 6} ${y - 6} ${x} ${y - s} Z`} fill="#ffffff" />
      <circle cx={x} cy={y} r={s * 0.3} fill="#ffffff" opacity={0.6} />
    </svg>
  );
};

/** The spaced-out tagline: Barlow Semi Condensed capitals, wide tracking, cream. */
export const Tagline: React.FC<{ text: string; y: number; at?: number; col?: string }> = ({ text, y, at = 0, col: c = C.sub }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: style.type.tagline,
        letterSpacing: `${style.type.taglineTracking}em`,
        marginRight: `-${style.type.taglineTracking}em`,
        color: c,
        textShadow: `0 0 10px ${C.magenta}`,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};

/**
 * A subtitle: Barlow Semi Condensed 600, cream-yellow with a 9 px dark outline and a soft shadow; emphasis is italic.
 * The second speaker is cyan with a small boxed tag. A line cuts on (no fade) and yields to the next.
 */
export const Subtitle: React.FC<{ lines: string[]; y?: number; at?: number; speaker?: string; second?: boolean; size?: number }> = ({ lines, y = style.layout.subtitleY, at = 0, speaker, second = false, size = style.type.body }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const fg = second ? C.cyan : C.sub;
  const T = style.type;
  const layer = (stroke: boolean) => (
    <div style={{ position: "absolute", left: M, right: M, top: 0, textAlign: "center", fontFamily: BODY, fontWeight: 600, fontSize: size, lineHeight: T.bodyLeading }}>
      {lines.map((line, i) => (
        <div key={i}>
          {line.split("*").map((part, k) => (
            <span
              key={k}
              style={{
                fontStyle: k % 2 === 1 ? "italic" : "normal",
                color: stroke ? C.outline : fg,
                WebkitTextStroke: stroke ? `${T.outline * 2}px ${C.outline}` : undefined,
              }}
            >
              {part}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y }}>
      {speaker ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ border: `3px solid ${fg}`, padding: "4px 14px 2px", fontFamily: BODY, fontWeight: 600, fontSize: T.label, letterSpacing: 2, color: fg, background: "rgba(10,8,30,0.55)", textShadow: `0 0 8px ${fg}` }}>
            ● {speaker.toUpperCase()}
          </div>
        </div>
      ) : null}
      <div style={{ position: "relative", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.55))" }}>
        {layer(true)}
        <div style={{ position: "relative" }}>{layer(false)}</div>
      </div>
    </div>
  );
};

/** A backlit segmented level meter (a cockpit gauge): `lit` of `n` segments glow in `c`. */
export const Meter: React.FC<{ x: number; y: number; w: number; h: number; n: number; lit: number; c: string; label: string }> = ({ x, y, w, h, n, lit, c, label }) => {
  const gap = 8;
  const sw = (w - gap * (n - 1)) / n;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={10} fill={C.darkShade} stroke={C.faint} strokeWidth={3} />
        {Array.from({ length: n }, (_, i) => (
          <rect
            key={i}
            x={x + i * (sw + gap)}
            y={y}
            width={sw}
            height={h}
            rx={4}
            fill={i < lit ? mix(c, "#ffffff", 0.25) : mix(c, C.darkShade, 0.82)}
            style={i < lit ? { filter: `drop-shadow(0 0 10px ${c})` } : undefined}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", left: x - 14, top: y - 64, fontFamily: BODY, fontWeight: 600, fontSize: style.type.label, letterSpacing: 2, color: c, textShadow: `0 0 10px ${c}` }}>{label}</div>
    </>
  );
};

/** The 80s eye in extreme close-up: almond lids, a thick upper lash flicking out, a tall layered iris, two highlights. */
export const Eye: React.FC<{ cx: number; cy: number; w: number; reflect: string }> = ({ cx, cy, w, reflect }) => {
  const h = w * 0.36;
  const iris = { rx: w * 0.17, ry: w * 0.24 };
  const upper = `M ${cx - w / 2} ${cy + h * 0.1} Q ${cx - w * 0.1} ${cy - h * 1.05} ${cx + w * 0.42} ${cy - h * 0.35}`;
  const lower = `M ${cx - w / 2 + 20} ${cy + h * 0.2} Q ${cx} ${cy + h * 0.85} ${cx + w * 0.4} ${cy + h * 0.15}`;
  const clipD = `${upper} Q ${cx + w * 0.47} ${cy - h * 0.1} ${cx + w * 0.4} ${cy + h * 0.15} Q ${cx} ${cy + h * 0.85} ${cx - w / 2 + 20} ${cy + h * 0.2} Z`;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="cel-eye">
          <path d={clipD} />
        </clipPath>
      </defs>
      <path d={clipD} fill={col("eye-white")} />
      <g clipPath="url(#cel-eye)">
        <ellipse cx={cx + w * 0.02} cy={cy + h * 0.05} rx={iris.rx} ry={iris.ry} fill={col("iris")} />
        <ellipse cx={cx + w * 0.02} cy={cy + h * 0.05 - iris.ry * 0.35} rx={iris.rx} ry={iris.ry * 0.62} fill={col("iris-dark")} />
        <rect x={cx - iris.rx} y={cy + h * 0.05 - iris.ry} width={iris.rx * 2.2} height={iris.ry * 0.38} fill={col("iris-top")} />
        <ellipse cx={cx + w * 0.02} cy={cy + h * 0.05 + iris.ry * 0.55} rx={iris.rx * 0.75} ry={iris.ry * 0.32} fill={reflect} />
        <ellipse cx={cx + w * 0.02} cy={cy + h * 0.05} rx={iris.rx * 0.28} ry={iris.ry * 0.36} fill={col("iris-top")} />
        <ellipse cx={cx - iris.rx * 0.35} cy={cy - iris.ry * 0.25} rx={iris.rx * 0.32} ry={iris.ry * 0.22} fill="#ffffff" />
        <circle cx={cx + iris.rx * 0.45} cy={cy + iris.ry * 0.45} r={iris.rx * 0.12} fill="#ffffff" />
        <path d={`M ${cx - w / 2} ${cy - h} L ${cx + w / 2} ${cy - h} L ${cx + w / 2} ${cy - h * 0.15} Q ${cx} ${cy - h * 0.55} ${cx - w / 2} ${cy - h * 0.05} Z`} fill={col("skin-shade")} opacity={0.35} />
      </g>
      <path d={upper} fill="none" stroke={col("lash")} strokeWidth={18} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${cx + w * (0.3 + i * 0.06)} ${cy - h * (0.62 - i * 0.12)} q ${30 + i * 8} ${-10 - i * 6} ${52 + i * 10} ${-24 + i * 6}`}
          fill="none"
          stroke={col("lash")}
          strokeWidth={9 - i * 2}
          strokeLinecap="round"
        />
      ))}
      <path d={lower} fill="none" stroke={col("skin-line")} strokeWidth={5} strokeLinecap="round" />
      <path d={`M ${cx - w * 0.42} ${cy - h * 1.55} Q ${cx} ${cy - h * 2.0} ${cx + w * 0.4} ${cy - h * 1.6}`} fill="none" stroke={col("hair-line")} strokeWidth={9} strokeLinecap="round" />
    </svg>
  );
};

// ---------------------------------------------------------------- the screen and the videotape/CRT finish

/**
 * The frame: content goes through a chroma shift (the red channel slid and smeared sideways), then scanlines, corner
 * darkening and faint signal noise sit on top. Waits for the fonts.
 */
export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const sl = E.scanline;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="cel-chroma" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx={E.chroma} dy={0} result="r2" />
          <feGaussianBlur in="r2" stdDeviation={`${E.chromaBlur} 0`} result="r3" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
          <feComposite in="r3" in2="gb" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: "url(#cel-chroma)" }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${sl / 2}px, rgba(0,0,0,${S.finish.scanlines}) ${sl / 2}px, rgba(0,0,0,${S.finish.scanlines}) ${sl}px)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,${S.finish.corner}) 100%)`, pointerEvents: "none" }} />
      <Finish grain={S.finish.grain} vignette={0} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const Layer: React.FC<{ children: React.ReactNode; blend?: React.CSSProperties["mixBlendMode"] }> = ({ children, blend }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: blend }}>
    {children}
  </svg>
);
