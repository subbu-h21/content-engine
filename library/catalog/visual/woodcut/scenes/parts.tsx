/**
 * Woodcut's pieces. Every picture is a list of knife cuts (tapered polygons, each with its own start time), carved out
 * of one black block on laid paper. Light exists only where a cut is. Every value comes from style.json.
 */
import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, Finish, lerp, run, seeded, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { CARVED, FACES, PRESS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const [BX0, BY0, BX1, BY1] = style.layout.block;
export const C = {
  paper: color(style.palette, "background"),
  ink: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  plate: color(style.palette, "accent"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

export type Pt = [number, number];
export type Cut = { pts: Pt[]; w: number; at: number; dur: number; plate?: boolean };

const lengthOf = (pts: Pt[]): number => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** How long a stroke takes: its length at the knife's speed, kept inside strokeTime. */
export const strokeTime = (len: number): number => clamp(len / E.speed, E.strokeTime[0], E.strokeTime[1]);
export const cut = (pts: Pt[], w: number, at: number, plate = false): Cut => ({ pts, w, at, dur: strokeTime(lengthOf(pts)), plate });
export const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number): Pt[] => {
  const n = Math.max(3, Math.ceil((Math.abs(a1 - a0) * r) / 24));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = lerp(a0, a1, i / n);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
  });
};

/** One cut as a closed polygon, drawn to `p` of its length: blunt entry, tapered exit, chipped edge. */
const cutPath = (c: Cut, p: number, seed: number): string => {
  const rnd = seeded(seed * 7919 + 13);
  const pts = c.pts;
  const total = lengthOf(pts);
  if (total <= 0) return "";
  const steps = Math.max(4, Math.ceil(total / 22));
  const left: Pt[] = [];
  const right: Pt[] = [];
  let seg = 0;
  let walked = 0;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const chip = 1 + (rnd() - 0.5) * 0.34;
    if (u > p) break;
    const want = u * total;
    while (seg < pts.length - 2 && walked + Math.hypot(pts[seg + 1][0] - pts[seg][0], pts[seg + 1][1] - pts[seg][1]) < want) {
      walked += Math.hypot(pts[seg + 1][0] - pts[seg][0], pts[seg + 1][1] - pts[seg][1]);
      seg++;
    }
    const [ax, ay] = pts[seg];
    const [bx, by] = pts[seg + 1];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const k = clamp((want - walked) / len);
    const x = lerp(ax, bx, k);
    const y = lerp(ay, by, k);
    const profile = (u < 0.06 ? 0.72 + (0.28 * u) / 0.06 : 1) * Math.pow(1 - u, 0.55);
    const hw = (c.w / 2) * profile * chip;
    const nx = -(by - ay) / len;
    const ny = (bx - ax) / len;
    left.push([x + nx * hw, y + ny * hw]);
    right.push([x - nx * hw, y - ny * hw]);
  }
  if (left.length < 2) return "";
  const all = [...left, ...right.reverse()];
  return `M${all.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
};

/** A set of cuts, carved up to now. A plate cut prints the colour inside the cut, a little off register. */
export const Cuts: React.FC<{ cuts: Cut[]; clip?: string }> = ({ cuts, clip }) => {
  const t = useSeconds();
  const uid = useUid("cuts");
  const paper: string[] = [];
  const plate: string[] = [];
  cuts.forEach((c, i) => {
    const p = run({ kind: "ease", curve: "linear", duration: c.dur }, t - c.at);
    if (p <= 0) return;
    const d = cutPath(c, p, i + 1);
    paper.push(d);
    if (c.plate) plate.push(d);
  });
  const k = plate.join("");
  return (
    <g clipPath={clip ? `url(#${uid}-area)` : undefined}>
      {clip ? (
        <clipPath id={`${uid}-area`}>
          <path d={clip} />
        </clipPath>
      ) : null}
      <path d={paper.join("")} fill={C.paper} />
      {k ? (
        <>
          <clipPath id={`${uid}-plate`}>
            <path d={k} />
          </clipPath>
          <g clipPath={`url(#${uid}-plate)`}>
            <path d={k} fill={C.plate} transform={`translate(${E.colourShift} ${-E.colourShift / 3})`} />
          </g>
        </>
      ) : null}
    </g>
  );
};

/** Carved light: gouged rays around a point, between angles a0 and a1, coarse first. */
export const burst = (o: { cx: number; cy: number; n: number; r0: number; r1: [number, number]; a0?: number; a1?: number; w: number; at: number; seed: number; plate?: boolean; skip?: (a: number) => boolean }): Cut[] => {
  const rnd = seeded(o.seed);
  const { a0 = 0, a1 = Math.PI * 2 } = o;
  const out: Cut[] = [];
  for (let i = 0; i < o.n; i++) {
    const a = lerp(a0, a1, (i + 0.5) / o.n) + (rnd() - 0.5) * 0.02;
    const r = lerp(o.r1[0], o.r1[1], rnd());
    const order = rnd();
    const w = o.w * lerp(0.8, 1.3, rnd());
    if (o.skip?.(a)) continue;
    out.push(cut([[o.cx + o.r0 * Math.cos(a), o.cy + o.r0 * Math.sin(a)], [o.cx + r * Math.cos(a), o.cy + r * Math.sin(a)]], w, o.at + order * 0.45, o.plate));
  }
  return out;
};

/** A disc cleared to white with parallel U-gouge strokes, leaving a ragged rim. */
export const disc = (cx: number, cy: number, r: number, at: number, seed: number, half = false): Cut[] => {
  const rnd = seeded(seed);
  const out: Cut[] = [];
  const w = E.ugouge[1];
  for (let y = -r + w * 0.4; y < (half ? 0 : r); y += w * 0.72) {
    const hw = Math.sqrt(Math.max(0, r * r - y * y));
    if (hw < 3) continue;
    out.push(cut([[cx - hw - 2, cy + y], [cx + hw + 8, cy + y + (rnd() - 0.5) * 3]], w, at + rnd() * 0.25));
  }
  return out;
};

/** The sky: arcs cut around the light. Bright near it (wide, nearly merging), dark far away (thin), each arc in separate cuts. */
export const sky = (o: { cx: number; cy: number; r0: number; r1: number; at: number; seed: number; plate?: boolean }): Cut[] => {
  const rnd = seeded(o.seed);
  const out: Cut[] = [];
  const rows = E.skySpacing * 1.8;
  for (let r = o.r0; r < o.r1; r += rows) {
    const tone = Math.pow(1 - (r - o.r0) / (o.r1 - o.r0), 1.5);
    const w = lerp(E.vgouge[0] + 1, E.ugouge[1], tone);
    let a = -Math.PI + rnd() * 0.3;
    while (a < Math.PI) {
      const len = lerp(E.cutLength[0] * 3, E.cutLength[1] * 1.6, rnd());
      const da = len / r;
      const mid = a + da / 2;
      const [mx, my] = [o.cx + r * Math.cos(mid), o.cy + r * Math.sin(mid)];
      if (mx > BX0 - 80 && mx < BX1 + 80 && my > BY0 - 80 && my < BY1) {
        out.push(cut(arcPts(o.cx, o.cy, r + (rnd() - 0.5) * 3, a, a + da), w * lerp(0.85, 1.15, rnd()), o.at + ((r - o.r0) / (o.r1 - o.r0)) * 0.9 + rnd() * 0.12, o.plate));
      }
      a += da + lerp(14, 46, rnd()) / r;
    }
  }
  return out;
};

/** A hill line: its height at x. */
export const hillY = (x: number, base: number, seed: number): number => base + 52 * Math.sin(x / 210 + seed) + 22 * Math.sin(x / 83 + seed * 2.1);
/** The area above a hill, for clipping the sky to it. */
export const aboveHill = (base: number, seed: number): string => {
  const pts: string[] = [];
  for (let x = BX0 - 10; x <= BX1 + 10; x += 12) pts.push(`${x} ${hillY(x, base, seed).toFixed(1)}`);
  return `M${BX0 - 10} ${BY0 - 10}L${BX1 + 10} ${BY0 - 10}L${pts.reverse().join("L")}Z`;
};
/** Fall-line hatching on the side of the hill that faces the light: a few cuts on the lit edge, the rest stays uncut. */
export const hillHatch = (base: number, seed: number, sunX: number, at: number): Cut[] => {
  const rnd = seeded(seed * 31 + 5);
  const out: Cut[] = [];
  for (let x = BX0 + 10; x < BX1 - 6; x += lerp(15, 25, rnd())) {
    const y = hillY(x, base, seed);
    const slope = (hillY(x + 4, base, seed) - y) / 4;
    const lit = clamp(-slope * Math.sign(x - sunX || 1) * 2.4 + 0.3);
    if (lit < 0.12) continue;
    const len = lerp(E.cutLength[0], E.cutLength[1] * 0.55, lit) * lerp(0.7, 1.1, rnd());
    const dx = slope * 26 + (rnd() - 0.5) * 6;
    out.push(cut([[x, y + 8], [x + (dx * len) / 60, y + 8 + len]], lerp(E.vgouge[0], E.vgouge[1], lit), at + rnd() * 0.4));
  }
  return out;
};

const InkEdge = createContext("");

/** The ragged block edge: never a clean rectangle. */
const blockPath = (seed: number): string => {
  const rnd = seeded(seed * 101 + 3);
  const j = () => (rnd() - 0.5) * 5;
  const pts: string[] = [];
  const add = (x: number, y: number) => pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  for (let x = BX0; x < BX1; x += 14) add(x, BY0 + j());
  for (let y = BY0; y < BY1; y += 14) add(BX1 + j(), y);
  for (let x = BX1; x > BX0; x -= 14) add(x, BY1 + j());
  for (let y = BY1; y > BY0; y -= 14) add(BX0 + j(), y);
  return `M${pts.join("L")}Z`;
};

const rgb = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** One impression: laid paper, the black block, its cuts, ink unevenness. A hard cut lands with two frames off register. */
export const Print: React.FC<{ seed: number; children: React.ReactNode; margin?: React.ReactNode }> = ({ seed, children, margin }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const uid = useUid("print");
  const [jx, jy] = E.jolt[frame] ?? [0, 0];
  const block = blockPath(seed);
  const [r, g, b] = rgb(C.paper);
  const paperRow = (k: number, o: number) => `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${k} 0 0 0 ${o}`;
  return (
    <InkEdge.Provider value={`${uid}-burr`}>
      <AbsoluteFill style={{ backgroundColor: C.paper }}>
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <pattern id={`${uid}-laid`} width={132} height={9} patternUnits="userSpaceOnUse">
              <rect width={132} height={1.4} fill={C.faint} opacity={0.5} />
              <rect width={1.6} height={9} fill={C.faint} opacity={0.7} />
            </pattern>
            <clipPath id={`${uid}-block`}>
              <path d={block} />
            </clipPath>
            <filter id={`${uid}-burr`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
              <feTurbulence type="fractalNoise" baseFrequency={0.09} numOctaves={2} seed={seed} />
              <feDisplacementMap in="SourceGraphic" scale={E.burr * 2.6} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id={`${uid}-grain`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.24" numOctaves={2} seed={seed + 1} />
              <feColorMatrix type="matrix" values={paperRow(E.ink * 7, -E.ink * 3)} />
            </filter>
            <filter id={`${uid}-specks`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.42} numOctaves={2} seed={seed + 2} />
              <feColorMatrix type="matrix" values={paperRow(14, -10.3)} />
            </filter>
          </defs>
          <rect width={W} height={H} fill={`url(#${uid}-laid)`} />
          <g transform={`translate(${jx} ${jy})`}>
            <path d={block} fill={C.ink} />
            <g clipPath={`url(#${uid}-block)`}>
              <g filter={`url(#${uid}-burr)`}>{children}</g>
              <rect width={W} height={H} filter={`url(#${uid}-grain)`} />
              <rect width={W} height={H} filter={`url(#${uid}-specks)`} />
            </g>
          </g>
        </svg>
        {margin}
        <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
      </AbsoluteFill>
    </InkEdge.Provider>
  );
};

type Glyph = { ch: string; em: boolean; n: number };
const glyphs = (line: string, start: number): Glyph[] => {
  const out: Glyph[] = [];
  words(line).forEach((w, i) => {
    if (i > 0 && !w.glue) out.push({ ch: " ", em: false, n: start + out.length });
    for (const ch of w.text) out.push({ ch, em: w.em, n: start + out.length });
  });
  return out;
};

/** Letters carved out of uncut black, one at a time. *Emphasis* prints the colour plate inside the carved letters. */
export const Carved: React.FC<{ lines: string[]; size: number; y: number; x?: number; at?: number; anchor?: "start" | "middle"; leading?: number; plate?: boolean }> = ({ lines, size, y, x = W / 2, at = 0, anchor = "middle", leading = S.type.leading, plate = false }) => {
  const t = useSeconds();
  const uid = useUid("carved");
  let count = 0;
  const rows = lines.map((l) => {
    const g = glyphs(l, count);
    count += g.length;
    return g;
  });
  const on = (g: Glyph) => ease("letter", t - at - g.n * S.motion.stagger) > 0;
  const layer = (want: (g: Glyph) => boolean, fill: string) =>
    rows.map((row, i) => (
      <text key={i} x={x} y={y + i * size * leading} textAnchor={anchor} fontFamily={CARVED} fontSize={size} fill="none" style={{ whiteSpace: "pre" }}>
        {row.map((g, k) => (
          <tspan key={k} fill={on(g) && want(g) ? fill : "none"}>
            {g.ch}
          </tspan>
        ))}
      </text>
    ));
  const coloured = (g: Glyph) => plate || g.em;
  return (
    <g>
      {layer(() => true, C.paper)}
      <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        {layer(coloured, "#ffffff")}
      </mask>
      <g mask={`url(#${uid}-m)`}>
        <g transform={`translate(${E.colourShift} ${-E.colourShift / 3})`}>{layer(coloured, C.plate)}</g>
      </g>
    </g>
  );
};

/** Letterpress in the paper margin: ink comes up with no slide. *Emphasis* is italic. */
export const Press: React.FC<{ text: string; y?: number; at?: number; size?: number; ink?: string }> = ({ text, y = S.layout.captionY, at = 0, size = S.type.caption, ink = C.ink }) => {
  const edge = useContext(InkEdge);
  const p = ease("ink", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: BX0 + 24, right: W - BX1 + 24, top: y, textAlign: "center", fontFamily: PRESS, fontSize: size, lineHeight: S.type.leading, color: ink, opacity: p, filter: `url(#${edge})` }}>
      {words(text).map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 && !w.glue ? " " : ""}
          {w.em ? <i>{w.text}</i> : w.text}
        </React.Fragment>
      ))}
    </div>
  );
};
