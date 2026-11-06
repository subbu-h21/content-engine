/**
 * Chalkboard's pieces, all procedural and deterministic:
 * - the slate: even ink-green with a fine grain and a very slow mottle (feTurbulence), a lens vignette, a faint warm
 *   window patch;
 * - chalk: every word is written in true stroke order by the style's own single-stroke hand (glyphs.ts); each stroke
 *   is revealed along its length with round ends, its edge roughened (feDisplacementMap) and only the slate's grains
 *   that take chalk keep it (an feTurbulence threshold), with a faint powder halo and a few loose grains at lift-off;
 * - the wipe: one damp pass along a smooth path leaves a thin even haze and a soft wet streak that dries back;
 * - the subtitle plate: a soft dark rounded plate.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, PLATE } from "./fonts";
import { GLYPH_GAP, GLYPHS, SPACE } from "./glyphs";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const T = style.type;
export const E = style.elements;
const P = style.palette;
export const C = {
  slate: color(P, "background"),
  back: color(P, "backBoard"),
  white: color(P, "text"),
  accent: color(P, "accent"),
  orange: color(P, "accentDefault"),
  second: color(P, "accent2"),
  sub: color(P, "muted"),
  rule: color(P, "faint"),
  plate: color(P, "plate"),
  frame: color(P, "frame"),
  tray: color(P, "tray"),
  trayShadow: color(P, "trayShadow"),
  wall: color(P, "wall"),
  dado: color(P, "dado"),
  clock: color(P, "clock"),
  wet: color(P, "wet"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration: number): number =>
  run({ ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

export type Pt = [number, number];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const pathOf = (pts: Pt[]) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}` : "");

// ------------------------------------------------------------------ the chalk hand

/** A glyph's strokes in glyph units (sampled into points). Straight strokes bow slightly, like a real arm. */
const glyphStrokes = (spec: string, seed: number): Pt[][] => {
  const r = seeded(seed);
  return spec
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const tok = s.split(/\s+/);
      const pts: Pt[] = [];
      let cur: Pt = [0, 0];
      for (let i = 0; i < tok.length; ) {
        const c = tok[i++];
        const n = (k: number) => tok.slice(i, i + k).map(Number);
        if (c === "M") {
          const [x, y] = n(2);
          i += 2;
          cur = [x, y];
          pts.push(cur);
        } else if (c === "L") {
          const [x, y] = n(2);
          i += 2;
          const L = dist(cur, [x, y]);
          const bow = (r() < 0.5 ? -1 : 1) * E.chalk.bow * L;
          const [nx, ny] = L ? [-(y - cur[1]) / L, (x - cur[0]) / L] : [0, 0];
          const k = Math.max(2, Math.ceil(L / 3));
          for (let j = 1; j <= k; j++) {
            const u = j / k;
            const b = Math.sin(Math.PI * u) * bow;
            pts.push([cur[0] + (x - cur[0]) * u + nx * b, cur[1] + (y - cur[1]) * u + ny * b]);
          }
          cur = [x, y];
        } else if (c === "Q") {
          const [cx, cy, x, y] = n(4);
          i += 4;
          for (let j = 1; j <= 14; j++) {
            const u = j / 14;
            const v = 1 - u;
            pts.push([v * v * cur[0] + 2 * v * u * cx + u * u * x, v * v * cur[1] + 2 * v * u * cy + u * u * y]);
          }
          cur = [x, y];
        } else if (c === "A") {
          const [cx, cy, rx, ry, a0, a1] = n(6);
          i += 6;
          const k = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 6));
          for (let j = 0; j <= k; j++) {
            const a = ((a0 + ((a1 - a0) * j) / k) * Math.PI) / 180;
            pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
          }
          cur = pts[pts.length - 1];
        }
      }
      return pts;
    });
};

/** Width of a line of chalk text at `size` px. */
export const chalkWidth = (text: string, size: number): number => {
  let w = 0;
  for (const ch of Array.from(text)) w += ch === " " ? SPACE : (GLYPHS[ch]?.[0] ?? GLYPHS[ch.toLowerCase()]?.[0] ?? 30) + GLYPH_GAP;
  return ((w - GLYPH_GAP) * size) / 100;
};

/** The strokes of a line of text in px, each glyph tilted, nudged and sheared so horizontals rise to the right. */
export const layoutChalk = (text: string, x: number, y: number, size: number, anchor: "start" | "middle" = "start", seed = 1): Pt[][] => {
  const k = size / 100;
  const r = seeded(seed * 7919);
  let pen = anchor === "middle" ? x - chalkWidth(text, size) / 2 : x;
  const out: Pt[][] = [];
  Array.from(text).forEach((ch, gi) => {
    if (ch === " ") {
      pen += SPACE * k;
      return;
    }
    const g = GLYPHS[ch] ?? GLYPHS[ch.toLowerCase()];
    if (!g) {
      pen += 30 * k;
      return;
    }
    const [adv, spec] = g;
    const tilt = ((r() - 0.5) * 2 * E.chalk.tilt * Math.PI) / 180;
    const dy = (r() - 0.5) * 2 * E.chalk.baseline * size;
    const cx = adv / 2;
    const [ct, st] = [Math.cos(tilt), Math.sin(tilt)];
    for (const s of glyphStrokes(spec, seed * 31 + gi)) {
      out.push(
        s.map(([gx, gy]) => {
          const sx = gx - cx;
          const sy = gy + 36 - E.chalk.rise * sx;
          return [pen + (cx + sx * ct - sy * st) * k, y + dy + (sx * st + sy * ct - 36) * k] as Pt;
        }),
      );
    }
    pen += (adv + GLYPH_GAP) * k;
  });
  return out;
};

/** Seconds a stroke takes (including the air between strokes): big characters slower, labels faster. */
export const perStroke = (size: number): number => (size >= 200 ? S.motion.perStroke.big : size >= 90 ? S.motion.perStroke.title : S.motion.perStroke.label);
export const chalkWidthPx = (size: number): number => Math.max(E.chalk.minWidth, size * E.chalk.width);

/** Chalk strokes written one after another from `at`, each over `per` seconds (drawn in the first 80%). */
export const Chalk: React.FC<{ strokes: Pt[][]; at: number; per: number; col?: string; width: number; seed?: number }> = ({ strokes, at, per, col = C.white, width, seed = 1 }) => {
  const t = useSeconds();
  const r = seeded(seed * 104729);
  return (
    <g fill="none" stroke={col} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {strokes.map((s, i) => {
        const p = easeFor("stroke", t - (at + i * per), per * S.motion.draw);
        const grains = Array.from({ length: E.chalk.looseGrains }, () => [(r() - 0.5) * width * 2.6, (r() - 0.5) * width * 2.6, 0.6 + r() * 0.9]);
        if (p <= 0) return null;
        const end = s[s.length - 1];
        return (
          <g key={i}>
            <path d={pathOf(s)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
            {p >= 1 ? grains.map(([dx, dy, gr], j) => <circle key={j} cx={end[0] + dx} cy={end[1] + dy} r={gr} fill={col} stroke="none" opacity={0.6} />) : null}
          </g>
        );
      })}
    </g>
  );
};

/** A line of chalk text. */
export const ChalkText: React.FC<{ text: string; x: number; y: number; size: number; at: number; col?: string; anchor?: "start" | "middle"; seed?: number; per?: number }> = ({ text, x, y, size, at, col, anchor = "start", seed = 1, per }) => (
  <Chalk strokes={layoutChalk(text, x, y, size, anchor, seed)} at={at} per={per ?? perStroke(size)} col={col} width={chalkWidthPx(size)} seed={seed} />
);

// ------------------------------------------------------------------ shapes in chalk

export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 48): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

export const wavePts = (from: Pt, to: Pt, amp: number, wl: number): Pt[] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const n = Math.max(8, Math.round(L / 4));
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L;
    const fade = Math.min(1, s / 24, (L - s) / 24);
    const o = amp * Math.sin((s / wl) * Math.PI * 2) * fade;
    return [from[0] + ux * s - uy * o, from[1] + uy * s + ux * o] as Pt;
  });
};

/** A straight chalk line, bowed a little. */
export const line = (a: Pt, b: Pt, bow = 0.012): Pt[] => {
  const L = dist(a, b);
  const [nx, ny] = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
  const n = Math.max(2, Math.ceil(L / 6));
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const o = Math.sin(Math.PI * u) * bow * L;
    return [a[0] + (b[0] - a[0]) * u + nx * o, a[1] + (b[1] - a[1]) * u + ny * o] as Pt;
  });
};

/** An arrow: a shaft (straight or wavy) and two head strokes. */
export const arrow = (from: Pt, to: Pt, opts: { amp?: number; wl?: number; head?: number } = {}): Pt[][] => {
  const { amp = 0, wl = 40, head = 30 } = opts;
  const shaft = amp ? wavePts(from, to, amp, wl) : line(from, to);
  const e = shaft[shaft.length - 1];
  const pre = shaft[Math.max(0, shaft.length - 4)];
  const a = Math.atan2(e[1] - pre[1], e[0] - pre[0]);
  return [shaft, [[e[0] - Math.cos(a - 0.5) * head, e[1] - Math.sin(a - 0.5) * head], e, [e[0] - Math.cos(a + 0.5) * head, e[1] - Math.sin(a + 0.5) * head]]];
};

export const dashes = (from: Pt, to: Pt, dash = 30, gap = 22): Pt[][] => {
  const L = dist(from, to);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const out: Pt[][] = [];
  for (let s = 0; s < L - 6; s += dash + gap) {
    const e = Math.min(L, s + dash);
    out.push([
      [from[0] + ux * s, from[1] + uy * s],
      [from[0] + ux * e, from[1] + uy * e],
    ]);
  }
  return out;
};

// ------------------------------------------------------------------ the board

/**
 * The slate, flat on to the camera. `children` are chalk (inside the chalk filter); `under` sits on the slate below
 * the chalk (wet streaks); `over` sits above everything (the subtitle plate, a classroom frame). Waits for the fonts.
 */
export const Slate: React.FC<{ children: React.ReactNode; under?: React.ReactNode; over?: React.ReactNode; around?: React.ReactNode; board?: { x: number; y: number; w: number; h: number } }> = ({
  children,
  under,
  over,
  around,
  board,
}) => {
  useFontsReady(FACES);
  const b = board ?? { x: 0, y: 0, w: W, h: H };
  const ch = E.chalk;
  return (
    <AbsoluteFill style={{ backgroundColor: board ? C.wall : C.slate }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ck-grain" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={21} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="ck-mottle" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={3} seed={8} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="ck-chalk" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={ch.grain} numOctaves={2} seed={4} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={ch.rough} xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -2.55" result="takes" />
            <feComposite in="rough" in2="takes" operator="in" result="chalk" />
            <feGaussianBlur in="rough" stdDeviation={3} result="blur" />
            <feComponentTransfer in="blur" result="dust">
              <feFuncA type="linear" slope={ch.dust} />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="dust" />
              <feMergeNode in="chalk" />
            </feMerge>
          </filter>
          <filter id="ck-soft" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={14} />
          </filter>
          <filter id="ck-softer" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation={26} />
          </filter>
          <radialGradient id="ck-window" cx="12%" cy="88%" r="55%">
            <stop offset="0" stopColor="#ffe1b4" stopOpacity={S.finish.window} />
            <stop offset="1" stopColor="#ffe1b4" stopOpacity={0} />
          </radialGradient>
          <clipPath id="ck-board">
            <rect x={b.x} y={b.y} width={b.w} height={b.h} />
          </clipPath>
        </defs>
        {around}
        <g clipPath="url(#ck-board)">
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={C.slate} />
          <rect width={W} height={H} filter="url(#ck-mottle)" style={{ mixBlendMode: "soft-light" }} opacity={E.slate.mottle * 8} />
          <rect width={W} height={H} filter="url(#ck-grain)" style={{ mixBlendMode: "soft-light" }} opacity={E.slate.grain * 3} />
          {under}
          <g filter="url(#ck-chalk)" opacity={0.94}>
            {children}
          </g>
        </g>
        <rect width={W} height={H} fill="url(#ck-window)" style={{ mixBlendMode: "screen" }} />
        {over}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * One damp pass of a cloth along `path` (a smooth stroke `width` wide): what it crosses is erased to a thin even haze.
 * Wrap the chalk to be wiped.
 */
export const Wiped: React.FC<{ path: string; at: number; children: React.ReactNode }> = ({ path, at, children }) => {
  const id = useSvgId("ckw");
  const p = ease("wipe", useSeconds() - at);
  const haze = Math.round(255 * E.wipe.haze).toString(16).padStart(2, "0");
  return (
    <>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="#ffffff" />
          {p > 0 ? <path d={path} fill="none" stroke={`#${haze}${haze}${haze}`} strokeWidth={E.wipe.width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} filter="url(#ck-soft)" /> : null}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>{children}</g>
    </>
  );
};

/** The wet streak the cloth leaves: darker slate with soft edges, drying back from its rims. */
export const WetStreak: React.FC<{ path: string; at: number }> = ({ path, at }) => {
  const t = useSeconds();
  const p = ease("wipe", t - at);
  if (p <= 0) return null;
  const dur = S.motion.recipes.wipe.duration;
  const dry = ease("dry", t - at - dur);
  const o = E.wipe.wet * (1 - dry);
  if (o <= 0.005) return null;
  return <path d={path} fill="none" stroke={C.wet} strokeOpacity={o} strokeWidth={E.wipe.width * (1 - 0.45 * dry)} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} filter="url(#ck-softer)" />;
};

/** The subtitle plate: a soft dark rounded plate, centred above the bottom safe line, fading in and out over 0.12 s. */
export const Plate: React.FC<{ lines: string[]; at: number; y?: number }> = ({ lines, at, y = S.layout.plateY }) => {
  const p = ease("plate", useSeconds() - at);
  if (p <= 0) return null;
  const size = T.body;
  const pl = E.plate;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.43 + pl.padX * 2;
  const h = lines.length * size * 1.3 + pl.padY * 2;
  return (
    <g opacity={p}>
      <rect x={(W - w) / 2} y={y} width={w} height={h} rx={pl.radius} fill={C.plate} opacity={pl.opacity} />
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + pl.padY + size * 1.0 + i * size * 1.3} textAnchor="middle" fontFamily={PLATE} fontStyle="italic" fontSize={size} fill={C.sub}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** A lesson: chalk items written one after another; returns the marks, each item's start and the end time. */
export type Item =
  | { kind: "write"; text: string; x: number; y: number; size: number; col?: string; anchor?: "start" | "middle"; gap?: number }
  | { kind: "draw"; list: Pt[][]; col?: string; width?: number; per?: number; gap?: number };

export const lesson = (items: Item[], start: number) => {
  let t = start;
  const nodes: React.ReactNode[] = [];
  const starts: number[] = [];
  items.forEach((it, i) => {
    t += it.gap ?? 0.08;
    starts.push(t);
    if (it.kind === "write") {
      const strokes = layoutChalk(it.text, it.x, it.y, it.size, it.anchor, i + 1);
      const per = perStroke(it.size);
      nodes.push(<Chalk key={i} strokes={strokes} at={t} per={per} col={it.col} width={chalkWidthPx(it.size)} seed={i + 1} />);
      t += strokes.length * per;
    } else {
      const per = it.per ?? 0.12;
      nodes.push(<Chalk key={i} strokes={it.list} at={t} per={per} col={it.col} width={it.width ?? 6} seed={i + 1} />);
      t += it.list.length * per;
    }
  });
  return { nodes, starts, end: t };
};

export { clamp };
