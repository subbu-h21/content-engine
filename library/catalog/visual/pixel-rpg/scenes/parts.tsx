/**
 * Pixel RPG's pieces. Everything sits on the native 180×320 grid (one native pixel = `elements.grid.px` = 6 px):
 * dithered skies and hills, sprites from ASCII rows, shaded discs, windows with a three-layer border, typed dialog,
 * menus, the hand cursor, the caret and the save crystal. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, UI } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const GRID = style.elements.grid;
/** One native pixel in px. */
export const PX = GRID.px;
export const NW = GRID.w;
export const NH = GRID.h;
export const E = style.elements;
const P = style.palette;
const c = (role: string) => color(P, role);
export const C = {
  night: c("background"),
  navy: c("surface"),
  white: c("text"),
  silver: c("muted"),
  steel: c("faint"),
  red: c("accent"),
  redDark: c("accent-dark"),
  cyan: c("accent2"),
  cyanMid: c("accent2-mid"),
  cyanDark: c("accent2-dark"),
  key: c("keyword"),
  sun: c("sun"),
  sunDark: c("sun-dark"),
  night3: c("night-3"),
  steel2: c("steel-2"),
  g1: c("grass-1"),
  g2: c("grass-2"),
  g3: c("grass-3"),
  g4: c("grass-4"),
  skin: c("skin"),
  skinDark: c("skin-dark"),
  boot: c("boot"),
  green: c("green"),
  orange: c("orange"),
  violet: c("violet"),
  plum: c("plum"),
};
/** The six colours of sunlight, as the palette's nearest indices. */
export const SPECTRUM = [C.red, C.orange, C.key, C.green, C.cyanMid, C.violet];

const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
/** Time held on steps of `fps` (sprites on 8, effects on 12). */
export const stepped = (t: number, fps: number): number => Math.floor(t * fps + 1e-6) / fps;
export const M = style.motion;

/** Deterministic 0..1 noise. */
export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Ordered 4×4 Bayer thresholds (0..15). A cell is lit at level L (0..16) when its threshold is below L. */
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayerAt = (x: number, y: number): number => BAYER[(((y % 4) + 4) % 4) * 4 + (((x % 4) + 4) % 4)];

/** The screen: the night index as ground, waits for the fonts. No finish: hard pixels only. */
export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  return <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>{children}</AbsoluteFill>;
};

/** A full-frame layer in native pixels. */
export const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${NW} ${NH}`} shapeRendering="crispEdges" style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

export type Pix = { x: number; y: number; c: string };

/** Pixels drawn as horizontal runs (one rect per run of the same colour). */
export const Pixels: React.FC<{ pix: Pix[] }> = ({ pix }) => {
  // later pixels win, like painting
  const last = new Map<string, Pix>();
  for (const p of pix) last.set(`${p.x},${p.y}`, p);
  const rows = new Map<number, Pix[]>();
  for (const p of last.values()) {
    const r = rows.get(p.y) ?? [];
    r.push(p);
    rows.set(p.y, r);
  }
  const rects: { x: number; y: number; w: number; c: string }[] = [];
  for (const [y, row] of rows) {
    row.sort((a, b) => a.x - b.x);
    let cur: { x: number; y: number; w: number; c: string } | null = null;
    for (const p of row) {
      if (cur && p.c === cur.c && p.x === cur.x + cur.w) cur.w += 1;
      else {
        if (cur) rects.push(cur);
        cur = { x: p.x, y, w: 1, c: p.c };
      }
    }
    if (cur) rects.push(cur);
  }
  return (
    <>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />
      ))}
    </>
  );
};

/** A sprite from ASCII rows; '.' is transparent. */
export const sprite = (rows: string[], map: Record<string, string>, x0: number, y0: number, flip = false): Pix[] => {
  const out: Pix[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const col = map[ch];
      if (col) out.push({ x: x0 + (flip ? row.length - 1 - x : x), y: y0 + y, c: col });
    }),
  );
  return out;
};

/** A shaded ball lit from the upper left: lit, mid and dark tones, a 1-pixel ink outline. */
export const disc = (cx: number, cy: number, r: number, tones: [string, string, string], ink: string | null = C.night): Pix[] => {
  const out: Pix[] = [];
  const L = [-0.5, -0.6, 0.62];
  const inside = (x: number, y: number) => (x + 0.5) * (x + 0.5) + (y + 0.5) * (y + 0.5) <= r * r;
  for (let y = -r - 1; y <= r; y++)
    for (let x = -r - 1; x <= r; x++) {
      if (inside(x, y)) {
        const nx = (x + 0.5) / r;
        const ny = (y + 0.5) / r;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const d = nx * L[0] + ny * L[1] + nz * L[2];
        out.push({ x: cx + x, y: cy + y, c: d > 0.62 ? tones[0] : d > 0.18 ? tones[1] : tones[2] });
      } else if (ink && (inside(x + 1, y) || inside(x - 1, y) || inside(x, y + 1) || inside(x, y - 1))) out.push({ x: cx + x, y: cy + y, c: ink });
    }
  return out;
};

/** A Bayer-thresholded ring of glow around (cx, cy) from r0 to r1 at `level` of 16. */
export const ditherRing = (cx: number, cy: number, r0: number, r1: number, level: number, col: string): Pix[] => {
  const out: Pix[] = [];
  for (let y = -r1; y <= r1; y++)
    for (let x = -r1; x <= r1; x++) {
      const d = Math.hypot(x + 0.5, y + 0.5);
      if (d > r0 && d <= r1 && bayerAt(cx + x, cy + y) < level) out.push({ x: cx + x, y: cy + y, c: col });
    }
  return out;
};

const DitherPattern: React.FC<{ id: string; col: string; level: number }> = ({ id, col, level }) => (
  <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse">
    {BAYER.map((b, i) => (b < level ? <rect key={i} x={i % 4} y={Math.floor(i / 4)} width={1} height={1} fill={col} /> : null))}
  </pattern>
);

/**
 * A vertical gradient made only of palette colours: between two stops the next colour comes in through 4×4 Bayer
 * dither in eight steps (never a blended colour).
 */
export const DitherBands: React.FC<{ id: string; stops: [number, string][]; x?: number; w?: number }> = ({ id, stops, x = 0, w = NW }) => {
  const steps = 8;
  const defs: React.ReactNode[] = [];
  const rects: React.ReactNode[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const [y0, c0] = stops[i];
    const [y1, c1] = stops[i + 1];
    for (let k = 0; k < steps; k++) {
      const a = Math.round(y0 + ((y1 - y0) * k) / steps);
      const b = Math.round(y0 + ((y1 - y0) * (k + 1)) / steps);
      if (b <= a) continue;
      rects.push(<rect key={`b${i}-${k}`} x={x} y={a} width={w} height={b - a} fill={c0} />);
      if (k > 0) {
        const pid = `${id}-${i}-${k}`;
        defs.push(<DitherPattern key={pid} id={pid} col={c1} level={(16 * k) / steps} />);
        rects.push(<rect key={`d${i}-${k}`} x={x} y={a} width={w} height={b - a} fill={`url(#${pid})`} />);
      }
    }
  }
  const [yl, cl] = stops[stops.length - 1];
  return (
    <>
      <defs>{defs}</defs>
      {rects}
      <rect x={x} y={yl} width={w} height={NH - yl} fill={cl} />
    </>
  );
};

/** A rolling hill: one column per native pixel, a lit top edge, filled to the bottom of the screen. */
export const Hill: React.FC<{ base: number; amp: number; seed: number; fill: string; top?: string; x0?: number; x1?: number }> = ({ base, amp, seed, fill, top, x0 = 0, x1 = NW }) => {
  const cols: React.ReactNode[] = [];
  for (let x = x0; x < x1; x++) {
    const y = Math.round(base - amp * (0.6 * Math.sin(x * 0.045 + seed) + 0.4 * Math.sin(x * 0.11 + seed * 2.3)));
    cols.push(<rect key={x} x={x} y={y} width={1} height={NH - y} fill={fill} />);
    if (top) cols.push(<rect key={`t${x}`} x={x} y={y} width={1} height={1} fill={top} />);
  }
  return <>{cols}</>;
};
export const hillY = (x: number, base: number, amp: number, seed: number): number =>
  Math.round(base - amp * (0.6 * Math.sin(x * 0.045 + seed) + 0.4 * Math.sin(x * 0.11 + seed * 2.3)));

/** Grass tufts and a few flowers scattered on the ground below the hill line (deterministic). */
export const Tufts: React.FC<{ base: number; amp: number; seed: number; n?: number; col?: string }> = ({ base, amp, seed, n = 70, col = C.g1 }) => {
  const pix: Pix[] = [];
  for (let i = 0; i < n; i++) {
    const x = 2 + Math.floor(rnd(i, seed + 40) * (NW - 4));
    const top = hillY(x, base, amp, seed);
    const y = top + 4 + Math.floor(rnd(i, seed + 41) * (NH - top - 8));
    if (i % 9 === 0) pix.push({ x, y, c: C.white }, { x: x - 1, y: y + 1, c: C.white }, { x: x + 1, y: y + 1, c: C.white }, { x, y: y + 2, c: C.white }, { x, y: y + 1, c: C.key });
    else pix.push({ x, y, c: col }, { x: x + 2, y, c: col }, { x: x + 1, y: y - 1, c: col });
  }
  return <Pixels pix={pix} />;
};

/** Fixed stars: single silver and white pixels above `maxY`. */
export const Stars: React.FC<{ n: number; maxY: number; seed?: number; t?: number }> = ({ n, maxY, seed = 3, t = 0 }) => {
  const k = Math.floor(t * M.effectFps);
  const pix: Pix[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rnd(i, seed) * NW);
    const y = Math.floor(rnd(i, seed + 1) * maxY);
    const twinkle = i % 7 === 0 && (k + i) % 9 < 2;
    pix.push({ x, y, c: twinkle ? C.steel : i % 3 === 0 ? C.white : C.silver });
  }
  return <Pixels pix={pix} />;
};

/** The hero: a small traveller in a hooded cloak with a sun-gold scarf (the light bearer). 14 × 22, facing right. */
const HERO = [
  ".....kkkk.....",
  "...kkhhcckk...",
  "..khhcccccck..",
  "..khcccccccck.",
  ".khccckkkkkck.",
  ".khcckssssssk.",
  ".kccksssssesk.",
  ".kccksssssesk.",
  ".kcckSsssssk..",
  "..kckSSSSSk...",
  ".kyyyyyyyyyk..",
  "kyYYYyyyyyyk..",
  "kYk.kccccchhk.",
  ".k..kcccccchk.",
  "...kCcccccccsk",
  "...kCCccccccck",
  "...kCCcccccck.",
  "...kCCCccccCk.",
  "....kCCkkCCk..",
  "....kbbk.kbbk.",
  "...kbbbk.kbbbk",
  "...kkkkk.kkkkk",
];
export const heroPix = (x: number, y: number, flip = false): Pix[] =>
  sprite(HERO, { k: C.night, h: C.steel2, c: C.steel, C: C.night3, s: C.skin, S: C.skinDark, e: C.night, y: C.sun, Y: C.sunDark, b: C.boot }, x, y, flip);

/** The pointing hand cursor, 10 × 7. */
const HAND = ["..kkkk....", ".kwwwwkkkk", "kwwwwwwwwk", "kwwwwkkkk.", "kwwwwk....", ".kwwwk....", "..kkk....."];
export const handPix = (x: number, y: number): Pix[] => sprite(HAND, { k: C.night, w: C.white }, x, y);

/** A check mark, 7 × 6. */
const CHECK = ["......k", ".....kg", "k...kgk", "gk.kgk.", ".gkgk..", "..gk..."];
export const checkPix = (x: number, y: number): Pix[] => sprite(CHECK, { k: C.night, g: C.g1 }, x, y);

/** A four-point sparkle, 5 × 5. */
const STAR = ["..y..", "..y..", "yywyy", "..y..", "..y.."];
export const starPix = (x: number, y: number): Pix[] => sprite(STAR, { y: C.key, w: C.white }, x, y);

/** The blinking ▼ caret (5 × 3). */
export const caretPix = (x: number, y: number): Pix[] => sprite(["wwwww", ".www.", "..w.."], { w: C.white }, x, y);

/** Native pixel units → a CSS px value. */
export const px = (n: number): number => n * PX;

/** How far a window has slid in from its edge (integer native px). */
const slideOffset = (p: number, dist: number): number => Math.round((1 - p) * dist);

/**
 * A window: a three-layer rounded border (ink, white, silver) around a blue → navy → night dithered fill. It slides
 * in from the nearest screen edge over 0.3 s (ease-out, integer pixels). Children are HTML, placed in native px from
 * the window's top-left.
 */
export const Window: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  from?: "bottom" | "top" | "left" | "right";
  children?: React.ReactNode;
  art?: React.ReactNode;
}> = ({ id, x, y, w, h, at = 0, from = "bottom", children, art }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("window", stepped(t, 30));
  const dist = from === "bottom" ? NH - y : from === "top" ? -(y + h) : from === "left" ? -(x + w) : NW - x;
  const off = slideOffset(p, dist);
  const dx = from === "left" || from === "right" ? off : 0;
  const dy = from === "top" || from === "bottom" ? off : 0;
  const b = E.window.border;
  const ring = (i: number, fill: string) => (
    <g key={i}>
      <rect x={i + 1} y={i} width={w - 2 * i - 2} height={h - 2 * i} fill={fill} />
      <rect x={i} y={i + 1} width={w - 2 * i} height={h - 2 * i - 2} fill={fill} />
    </g>
  );
  const fillH = h - 2 * b;
  return (
    <div style={{ position: "absolute", left: px(x + dx), top: px(y + dy), width: px(w), height: px(h) }}>
      <svg width={px(w)} height={px(h)} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ position: "absolute", left: 0, top: 0 }}>
        {ring(0, C.night)}
        {ring(1, C.white)}
        {ring(2, C.silver)}
        <svg x={b} y={b} width={w - 2 * b} height={fillH} viewBox={`0 0 ${w - 2 * b} ${fillH}`} overflow="hidden">
          <DitherBands
            id={`${id}-fill`}
            stops={[
              [0, C.cyanDark],
              [Math.round(fillH * 0.45), C.navy],
              [Math.round(fillH * 0.95), C.night],
            ]}
            w={w - 2 * b}
          />
        </svg>
        {art}
      </svg>
      {children}
    </div>
  );
};

const shadow = `${PX * style.type.shadow}px ${PX * style.type.shadow}px 0 ${C.night}`;

/** UI text (menus, window labels): Silkscreen, upper case. Positions in native px. */
export const UIText: React.FC<{ text: string; x?: number; y: number; size?: number; col?: string; at?: number; align?: "left" | "center" }> = ({ text, x = 0, y, size = style.type.label, col = C.silver, at = 0, align = "left" }) => {
  if (useSeconds() < at) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : px(x), right: align === "center" ? 0 : undefined, textAlign: align, top: px(y), fontFamily: UI, fontSize: size, lineHeight: 1, color: col, textShadow: shadow, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/**
 * Dialog text that types on at `type.charsPerSecond`; *emphasis* is the keyword colour. The untyped part is laid out
 * but invisible, so lines never re-wrap while typing. Returns nothing before `at`.
 */
export const Typed: React.FC<{ text: string; x: number; y: number; w: number; at?: number; size?: number; col?: string }> = ({ text, x, y, w, at = 0, size = style.type.body, col = C.white }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const n = Math.floor(stepped(t, 30) * style.type.charsPerSecond);
  let i = 0;
  // split on plain spaces only, so a no-break space keeps "450 nm" together
  const ws: { text: string; em: boolean }[] = [];
  text.split("*").forEach((part, k) => part.split(" ").filter(Boolean).forEach((w) => ws.push({ text: w, em: k % 2 === 1 })));
  return (
    <div style={{ position: "absolute", left: px(x), top: px(y), width: px(w), fontFamily: BODY, fontWeight: 400, fontSize: size, lineHeight: style.type.leading, color: col }}>
      {ws.map((wd, k) => {
        const s = (k > 0 ? " " : "") + wd.text;
        const shown = Math.max(0, Math.min(s.length, n - i));
        i += s.length;
        const fg = wd.em ? C.key : col;
        return (
          <React.Fragment key={k}>
            <span style={{ color: fg, textShadow: shadow }}>{s.slice(0, shown)}</span>
            <span style={{ color: "transparent" }}>{s.slice(shown)}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
/** Seconds a text takes to type. */
export const typeTime = (text: string): number => text.replace(/\*/g, "").length / style.type.charsPerSecond;

/** A CSS mask that shows `level` of 16 Bayer cells (the dissolve; never an alpha fade). */
export const bayerMask = (level: number): React.CSSProperties => {
  if (level >= 16) return {};
  const cells = BAYER.map((b, i) => (b < level ? `<rect x='${i % 4}' y='${Math.floor(i / 4)}' width='1' height='1'/>` : "")).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4' shape-rendering='crispEdges'>${cells}</svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return { WebkitMaskImage: url, maskImage: url, WebkitMaskSize: `${4 * PX}px ${4 * PX}px`, maskSize: `${4 * PX}px ${4 * PX}px`, WebkitMaskRepeat: "repeat", maskRepeat: "repeat" };
};

/**
 * Title type: Pixelify Sans Bold with an 8-neighbour ink outline one native pixel wide and row bands white → silver →
 * steel (emphasis: white → cyan → blue). It comes in by Bayer dissolve, stepped at 12 fps.
 */
export const TitleText: React.FC<{ lines: string[]; size: number; y: number; at?: number; align?: "center" | "left"; x?: number }> = ({ lines, size, y, at = 0, align = "center", x = 0 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const level = Math.floor(ease("dissolve", stepped(t, M.effectFps)) * 16);
  const o = PX * style.type.outline;
  const outline = [-1, 0, 1].flatMap((dx) => [-1, 0, 1].filter((dy) => dx || dy).map((dy) => `${dx * o}px ${dy * o}px 0 ${C.night}`)).join(", ");
  const band = (a: string, b: string, cc: string) => `linear-gradient(to bottom, ${a} 0%, ${a} 46%, ${b} 46%, ${b} 70%, ${cc} 70%, ${cc} 100%)`;
  const box: React.CSSProperties = {
    position: "absolute",
    left: align === "center" ? 0 : px(x),
    right: align === "center" ? 0 : undefined,
    top: px(y),
    textAlign: align,
    fontFamily: DISPLAY,
    fontWeight: 400,
    fontSize: size,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };
  const render = (front: boolean) =>
    lines.map((line, li) => (
      <div key={li}>
        {words(line).map((wd, k) => (
          <React.Fragment key={k}>
            {k > 0 ? " " : null}
            <span
              style={
                front
                  ? { background: wd.em ? band(C.white, C.cyan, C.cyanMid) : band(C.white, C.silver, C.steel2), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                  : { color: C.night }
              }
            >
              {wd.text}
            </span>
          </React.Fragment>
        ))}
      </div>
    ));
  return (
    <div style={{ position: "absolute", inset: 0, ...bayerMask(level) }}>
      <div style={{ ...box, textShadow: `${outline}, ${o}px ${2 * o}px 0 ${C.night}` }}>{render(false)}</div>
      <div style={box}>{render(true)}</div>
    </div>
  );
};

/** The save crystal: a flat-shaded octahedron in the protected cyans, turning in 8 drawings per 90°. */
export const Crystal: React.FC<{ cx: number; cy: number; t: number }> = ({ cx, cy, t }) => {
  const { r, h, steps } = E.crystal;
  const k = Math.floor(t * M.spriteFps);
  const a = ((k % steps) / steps) * (Math.PI / 2);
  const eq = [0, 1, 2, 3].map((i) => {
    const th = a + (i * Math.PI) / 2;
    return { x: Math.cos(th) * r, z: Math.sin(th) * r };
  });
  const top = { x: 0, y: -h };
  const bot = { x: 0, y: h };
  const faces: { pts: string; shade: string; z: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const p = eq[i];
    const q = eq[(i + 1) % 4];
    const z = (p.z + q.z) / 2;
    if (z < 0) continue;
    const side = (p.x + q.x) / 2 < 0;
    const pt = (v: { x: number; z: number }, yy: number) => `${cx + Math.round(v.x)},${cy + yy + Math.round(v.z * 0.18)}`;
    faces.push({ pts: `${cx + top.x},${cy + top.y} ${pt(p, 0)} ${pt(q, 0)}`, shade: side ? C.white : C.cyan, z });
    faces.push({ pts: `${cx + bot.x},${cy + bot.y} ${pt(p, 0)} ${pt(q, 0)}`, shade: side ? C.cyanMid : C.cyanDark, z });
  }
  return (
    <g>
      <Pixels pix={[...ditherRing(cx, cy, r + 4, r + 8, 8, C.cyanMid), ...ditherRing(cx, cy, r + 8, r + 12, 4, C.cyanDark)]} />
      {faces.map((f, i) => (
        <polygon key={i} points={f.pts} fill={f.shade} stroke={C.night} strokeWidth={1} strokeLinejoin="miter" />
      ))}
    </g>
  );
};

/** A straight pixel line from (x0, y0) toward (x1, y1), drawn to fraction `p`, `w` pixels thick. */
export const pixLine = (x0: number, y0: number, x1: number, y1: number, p: number, w: number, col: string): Pix[] => {
  const out: Pix[] = [];
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  const m = Math.floor(n * p);
  for (let i = 0; i <= m; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / n);
    const y = Math.round(y0 + ((y1 - y0) * i) / n);
    for (let d = -Math.floor(w / 2); d <= Math.floor((w - 1) / 2); d++) {
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) out.push({ x, y: y + d, c: col });
      else out.push({ x: x + d, y, c: col });
    }
  }
  return out;
};

/** A horizontal stat bar in native px: steel track, a filled part with a one-row highlight. */
export const barPix = (x: number, y: number, w: number, h: number, frac: number, fill: string, hi: string): Pix[] => {
  const out: Pix[] = [];
  const f = Math.round(w * frac);
  for (let yy = 0; yy < h; yy++)
    for (let xx = 0; xx < w; xx++) {
      const edge = yy === 0 || yy === h - 1 || xx === 0 || xx === w - 1;
      out.push({ x: x + xx, y: y + yy, c: edge ? C.night : xx <= f ? (yy === 1 ? hi : fill) : C.night3 });
    }
  return out;
};
