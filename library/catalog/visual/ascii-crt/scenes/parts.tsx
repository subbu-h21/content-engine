/**
 * ASCII CRT's pieces: the tube (unlit warm glass, rounded edge, scanlines, bloom, flicker, a faint reflection), rows of
 * glyphs on a monospace grid lit along the amber phosphor ramp, typing, the cursor, inverse-video tags, ASCII pictures
 * built from a density ramp, banner numerals made of glyphs, and the LOG strip. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, Finish, mix, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const LV = style.type.levels;
const P = style.palette;
export const C = {
  glass: color(P, "background"),
  mid: color(P, "text"),
  dim: color(P, "muted"),
  faint: color(P, "faint"),
  over: color(P, "accent"),
  blue: color(P, "accent2"),
  bezel: color(P, "bezel"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const TY = style.motion.typing;

/** The phosphor ramp: 0 = unlit glass, 0.42 = dim, 0.7 = normal, 1 = overexposed. */
export const phosphor = (L: number): string => {
  const x = clamp(L);
  if (x <= LV.dim) return mix(C.glass, C.dim, x / LV.dim);
  if (x <= LV.normal) return mix(C.dim, C.mid, (x - LV.dim) / (LV.normal - LV.dim));
  return mix(C.mid, C.over, (x - LV.normal) / (LV.bold - LV.normal));
};
/** The one second colour along its own ramp (glass → blue → near white). */
export const second = (L: number): string => {
  const x = clamp(L);
  return x <= 0.8 ? mix(C.glass, C.blue, x / 0.8) : mix(C.blue, "#ffffff", (x - 0.8) / 0.2 * 0.5);
};

/** Grid geometry: a grid of `cols` columns across the usable width; cells are 0.4 em × 0.8 em (1 : 2). */
export const USABLE = W - 2 * M;
export const grid = (cols: number) => {
  const cw = USABLE / cols;
  const [ex, ey] = style.type.cell;
  return { cw, ch: (cw / ex) * ey, font: cw / ex };
};

/** Text typed so far: `per` seconds a character, starting at `at`. */
export const typed = (text: string, t: number, at: number, per: number): string => (t < at ? "" : text.slice(0, Math.floor((t - at) / per) + 1));
/** When a typed line finishes. */
export const doneAt = (text: string, at: number, per: number): number => at + text.length * per;

/** The cursor is lit for the first half of each period. */
export const cursorOn = (t: number): boolean => (t % E.cursor.period) / E.cursor.period < E.cursor.duty;

const glow = (strength = 1): string =>
  `0 0 ${3 * strength}px color-mix(in srgb, currentColor ${Math.round(S.finish.bloom * 100)}%, transparent), 0 0 ${14 * strength}px color-mix(in srgb, currentColor ${Math.round(S.finish.halo * 100)}%, transparent)`;

export type Glyph = { ch: string; L: number; inv?: boolean; blue?: boolean };

/** One row of glyphs on a grid: each glyph sits in its own cell. `cells` is the text, or glyphs with their own levels. */
export const Row: React.FC<{
  x?: number;
  y: number;
  cols: number;
  text?: string;
  L?: number;
  inv?: boolean;
  blue?: boolean;
  glyphs?: Glyph[];
  cursor?: boolean;
  col?: number;
}> = ({ x = M, y, cols, text = "", L = LV.normal, inv = false, blue = false, glyphs, cursor = false, col = 0 }) => {
  const { cw, ch, font } = grid(cols);
  const list: Glyph[] = glyphs ?? [...text].map((c) => ({ ch: c, L, inv, blue }));
  return (
    <div style={{ position: "absolute", left: x + col * cw, top: y, height: ch, display: "flex", fontFamily: MONO, fontSize: font, lineHeight: `${ch}px` }}>
      {list.map((g, i) => {
        const fg = g.blue ? second(g.L) : phosphor(g.L);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: cw,
              height: ch,
              textAlign: "center",
              color: g.inv ? C.glass : fg,
              backgroundColor: g.inv ? fg : undefined,
              textShadow: g.inv ? undefined : glow(cw / 30),
              whiteSpace: "pre",
            }}
          >
            {g.ch}
          </span>
        );
      })}
      {cursor ? <span style={{ display: "inline-block", width: cw, height: ch * 0.78, marginTop: ch * 0.1, backgroundColor: C.over, boxShadow: `0 0 12px ${C.mid}` }} /> : null}
    </div>
  );
};

/** Bayer 4×4 for the ordered dither. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const hash = (i: number, j: number) => {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export type Sampled = { L: number; blue?: boolean; ch?: string };
/**
 * An ASCII picture: `field(u, v)` gives each cell's luminance (u, v in cell units from the picture's top left). The
 * glyph comes from the density ramp, its brightness from the phosphor ramp; cells under the blank level stay empty.
 */
export const Picture: React.FC<{ x?: number; y: number; cols: number; rows: number; field: (u: number, v: number) => Sampled | null; offsetCol?: number }> = ({
  x = M,
  y,
  cols,
  rows,
  field,
}) => {
  const { cw, ch } = grid(cols);
  const ramp = E.ramp;
  const n = ramp.length - 1;
  const lines: Glyph[][] = [];
  for (let j = 0; j < rows; j++) {
    const line: Glyph[] = [];
    for (let i = 0; i < cols; i++) {
      const s = field(i + 0.5, j + 0.5);
      if (!s || !Number.isFinite(s.L)) {
        line.push({ ch: " ", L: 0 });
        continue;
      }
      let L = Math.pow(clamp(s.L), 1 / E.gamma);
      if (L < E.blank) {
        line.push({ ch: " ", L: 0 });
        continue;
      }
      const d = (BAYER[(j % 4) * 4 + (i % 4)] / 16 - 0.5 + (hash(i, j) - 0.5) * 0.3) * (E.dither / n);
      const k = Math.round(clamp(L + d) * n);
      const g = s.ch ?? ramp[Math.max(1, k)];
      const lvl = LV.dim + (LV.bold - LV.dim) * L;
      line.push({ ch: g, L: lvl, blue: s.blue });
    }
    lines.push(line);
  }
  return (
    <>
      {lines.map((g, j) => (
        <Row key={j} x={x} y={y + j * ch} cols={cols} glyphs={g} />
      ))}
    </>
  );
};

/** 5 × 7 banner numerals, each lit cell drawn as a glyph. */
const BANNER: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ".": ["0", "0", "0", "0", "0", "1", "1"],
  "×": ["00000", "10001", "01010", "00100", "01010", "10001", "00000"],
};
/** Width in banner pixels of a string (one blank pixel between characters). */
export const bannerWidth = (s: string): number => [...s].reduce((n, c, i) => n + (BANNER[c]?.[0].length ?? 3) + (i > 0 ? 1 : 0), 0);
/**
 * Banner numerals: each lit pixel of a 5 × 7 figure is two inverse-video cells wide and one tall, so the pixels are
 * square on the 1 : 2 grid and the figure reads as solid at phone size.
 */
export const Banner: React.FC<{ text: string; x: number; y: number; cols: number; L?: number }> = ({ text, x, y, cols, L = LV.bold }) => {
  const rows: Glyph[][] = Array.from({ length: 7 }, () => []);
  const off: Glyph = { ch: " ", L: 0 };
  [...text].forEach((c, ci) => {
    const g = BANNER[c] ?? BANNER["."];
    for (let r = 0; r < 7; r++) {
      if (ci > 0) rows[r].push(off, off);
      for (const b of g[r]) {
        const on: Glyph = { ch: " ", L, inv: true };
        rows[r].push(...(b === "1" ? [on, on] : [off, off]));
      }
    }
  });
  const { ch } = grid(cols);
  return (
    <>
      {rows.map((g, j) => (
        <Row key={j} x={x} y={y + j * ch} cols={cols} glyphs={g} />
      ))}
    </>
  );
};

/** The LOG strip: a dim dashed separator, an inverse-video LOG tag, a `> ` prompt and the caption typed in capitals. */
export const Log: React.FC<{ text: string; at: number; per?: number; t: number; status?: string }> = ({ text, at, per = TY.command, t, status }) => {
  const cols = style.layout.grids.log;
  const { ch } = grid(cols);
  const y = style.layout.log.y;
  const line = typed(text.toUpperCase(), t, at, per);
  const dash = Array.from({ length: cols }, (_, i) => (i % 2 === 0 ? "-" : " ")).join("");
  return (
    <>
      <Row y={y} cols={cols} text={dash} L={LV.dim * 0.8} />
      <Row y={y + ch * 1.05} cols={cols} text={` ${E.inverseTag} `} inv L={LV.normal} />
      <Row y={y + ch * 1.05} cols={cols} col={6} text={`> ${line}`} L={LV.normal} cursor={line.length < text.length || cursorOn(t)} />
      {status ? <Row y={y + ch * 2.15} cols={cols} col={6} text={status} L={LV.dim} /> : null}
    </>
  );
};

/** The tube: bezel, rounded warm glass, bloom on everything lit, scanlines, edge darkening, reflection, flicker. Waits for the fonts. */
export const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const { inset, radius } = style.layout.screen;
  const rnd = seeded(frame * 7919 + 3);
  const flick = 1 + (rnd() - 0.5) * 2 * S.finish.flicker;
  const sl = S.finish.scanlines;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bezel }}>
      <div style={{ position: "absolute", left: inset, top: inset, width: W - 2 * inset, height: H - 2 * inset, borderRadius: radius, overflow: "hidden", backgroundColor: C.glass }}>
        <div style={{ position: "absolute", left: -inset, top: -inset, width: W, height: H, filter: `brightness(${flick.toFixed(4)})` }}>{children}</div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${sl.period / 2}px, rgba(0,0,0,${sl.strength}) ${sl.period / 2}px, rgba(0,0,0,${sl.strength}) ${sl.period}px)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, boxShadow: `inset 0 0 90px 30px rgba(0,0,0,${S.finish.edge}), inset 0 0 14px 4px rgba(0,0,0,0.9)` }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 55% 30% at 22% 12%, rgba(255,240,220,${S.finish.reflection}) 0%, rgba(255,240,220,0) 100%)`,
          }}
        />
      </div>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export const useT = useSeconds;
