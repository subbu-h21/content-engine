/**
 * Urban Sketch's pieces: the page, the fineliner (wobble, overshoot, gaps, stroke-order draw-on), the wash (rough edge,
 * granulation, dried rim, blooming from a point) and handwriting. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, plain, run, seeded, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, HAND, NOTE } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const P = style.pigments;
export const C = {
  paper: color(style.palette, "background"),
  ink: color(style.palette, "text"),
  shadow: color(style.palette, "muted"),
  haze: color(style.palette, "faint"),
  hat: color(style.palette, "accent"),
  sky: color(style.palette, "accent2"),
  path: color(style.palette, "surface"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

export type Pt = [number, number];
export type Stroke = { pts: Pt[]; at: number; w?: number; boil?: boolean };
export type WashItem = { d: string; hue: string; at: number; from: Pt; r: number; alpha?: number };

const lengthOf = (pts: Pt[]): number => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const pointAt = (pts: Pt[], s: number): Pt => {
  let left = s;
  for (let i = 0; i < pts.length - 1; i++) {
    const len = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    if (left <= len || i === pts.length - 2) {
      const k = len > 0 ? left / len : 0;
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    left -= len;
  }
  return pts[pts.length - 1];
};

/** One pen stroke as a path, drawn to `p`: overshoots its ends, wobbles, and long strokes skip a few px of paper. */
const trace = (s: Stroke, p: number, seed: number): string => {
  const rnd = seeded(seed * 613 + 7);
  const pts = s.pts;
  const total = lengthOf(pts);
  if (total <= 0) return "";
  const over = total > 40 ? lerp(E.overshoot[0], E.overshoot[1], rnd()) : 0;
  const amp = lerp(E.wobble[0], E.wobble[1], rnd()) * 1.5;
  const [p1, p2] = [rnd() * 6.28, rnd() * 6.28];
  const gapped = total > 120 && rnd() < lerp(E.gapChance[0], E.gapChance[1], rnd());
  const gapAt = lerp(0.25, 0.8, rnd()) * total;
  const gapLen = lerp(E.gap[0], E.gap[1], rnd());
  const n = Math.max(3, Math.ceil(total / 12));
  let d = "";
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    if (u > p) break;
    const at = u * total;
    if (gapped && at > gapAt && at < gapAt + gapLen) {
      pen = false;
      continue;
    }
    const [x, y] = pointAt(pts, at);
    const [ax, ay] = pointAt(pts, Math.max(0, at - 2));
    const [bx, by] = pointAt(pts, Math.min(total, at + 2));
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const [tx, ty] = [(bx - ax) / len, (by - ay) / len];
    const off = amp * (Math.sin(at / 34 + p1) + 0.55 * Math.sin(at / 11 + p2));
    const end = i === 0 ? -over : i === n ? over : 0;
    const q = `${(x - ty * off + tx * end).toFixed(1)} ${(y + tx * off + ty * end).toFixed(1)}`;
    d += pen ? `L${q}` : `M${q}`;
    pen = true;
  }
  return d;
};

/** Strokes in draw order. Each takes its length at pen speed; figures boil at 12 fps, the static page never does. */
export const Ink: React.FC<{ strokes: Stroke[] }> = ({ strokes }) => {
  const t = useSeconds();
  const boil = Math.floor(t * E.boilFps);
  const groups: Record<string, string> = {};
  strokes.forEach((s, i) => {
    const dur = clamp(lengthOf(s.pts) / E.penSpeed, E.strokeTime[0], E.strokeTime[1]);
    const p = run({ kind: "ease", curve: "sine-in-out", duration: dur }, t - s.at);
    if (p <= 0) return;
    const w = (s.w ?? E.line[0]).toFixed(1);
    groups[w] = (groups[w] ?? "") + trace(s, p, i + 1 + (s.boil ? boil * 97 : 0));
  });
  return (
    <>
      {Object.entries(groups).map(([w, d]) => (
        <path key={w} d={d} fill="none" stroke={C.ink} strokeWidth={Number(w)} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </>
  );
};

/** A closed noisy loop around a centre. Never a clean ellipse. */
export const blob = (cx: number, cy: number, rx: number, ry: number, seed: number, rough = 0.12): string => {
  const rnd = seeded(seed);
  const n = 40;
  const [a, b, c] = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
  const pts = Array.from({ length: n }, (_, i) => {
    const th = (i / n) * Math.PI * 2;
    const k = 1 + rough * (Math.sin(th * 3 + a) * 0.6 + Math.sin(th * 5 + b) * 0.4 + Math.sin(th * 9 + c) * 0.25);
    return `${(cx + rx * k * Math.cos(th)).toFixed(1)} ${(cy + ry * k * Math.sin(th)).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
};
/** A polygon as wash: dropped a little off the lines. */
export const patch = (pts: Pt[], seed: number): string => {
  const rnd = seeded(seed);
  const [dx, dy] = [lerp(E.washOffset[0], E.washOffset[1], rnd()) * (rnd() < 0.5 ? -1 : 1), lerp(E.washOffset[0], E.washOffset[1], rnd())];
  return `M${pts.map(([x, y]) => `${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`).join("L")}Z`;
};

/** Washes in order. Colour never snaps: each one blooms from a point behind a noisy circular front that dries darker. */
export const Wash: React.FC<{ items: WashItem[] }> = ({ items }) => {
  const t = useSeconds();
  const uid = useUid("wash");
  const edge = React.useContext(WetFilter);
  return (
    <g filter={`url(#${edge})`} style={{ mixBlendMode: "multiply" }}>
      {items.map((w, i) => {
        const p = ease("bloom", t - w.at);
        if (p <= 0) return null;
        const a = w.alpha ?? lerp(E.washAlpha[0], E.washAlpha[1], seeded(i + 3)());
        const front = blob(w.from[0], w.from[1], w.r * p * 1.25, w.r * p * 1.25, i + 40, 0.14);
        return (
          <g key={i} style={{ mixBlendMode: "multiply" }}>
            <clipPath id={`${uid}-${i}`}>
              <path d={p >= 1 ? `M-9 -9H${W + 9}V${H + 9}H-9Z` : front} />
            </clipPath>
            <clipPath id={`${uid}-s${i}`}>
              <path d={w.d} clipRule="evenodd" />
            </clipPath>
            <g clipPath={`url(#${uid}-${i})`}>
              <path d={w.d} fill={w.hue} fillRule="evenodd" opacity={a} />
              <path d={w.d} fill={w.hue} fillRule="evenodd" opacity={a * 0.5} transform="translate(2.5 1.5)" />
            </g>
            {p < 1 ? (
              <g clipPath={`url(#${uid}-s${i})`}>
                <path d={front} fill="none" stroke={mix(w.hue, C.ink, 0.25)} strokeWidth={24} opacity={E.frontDark * a} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
const WetFilter = React.createContext("");

/** The page: cream cold-press paper with fbm mottling; tooth over everything, figures included. */
export const Page: React.FC<{ seed: number; children: React.ReactNode }> = ({ seed, children }) => {
  useFontsReady(FACES);
  const uid = useUid("page");
  const brown = "0 0 0 0 0.42 0 0 0 0 0.34 0 0 0 0 0.22";
  const [g0, g1] = E.granulation;
  return (
    <WetFilter.Provider value={`${uid}-wet`}>
      <AbsoluteFill style={{ backgroundColor: C.paper }}>
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id={`${uid}-mottle`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.0062} numOctaves={2} seed={seed} />
              <feColorMatrix type="matrix" values={`${brown} ${E.paperMottle * 2.4} 0 0 0 ${-E.paperMottle * 0.9}`} />
            </filter>
            <filter id={`${uid}-tooth`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.55} numOctaves={2} seed={seed + 1} />
              <feColorMatrix type="matrix" values={`${brown} 0.5 0 0 0 -0.2`} />
            </filter>
            <filter id={`${uid}-wet`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.016} numOctaves={3} seed={seed + 2} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={E.washEdge[1] * 1.4} xChannelSelector="R" yChannelSelector="G" result="rough" />
              <feMorphology in="rough" operator="erode" radius={3} result="core" />
              <feComposite in="rough" in2="core" operator="out" result="rimRaw" />
              <feComponentTransfer in="rimRaw" result="rim">
                <feFuncA type="linear" slope={E.driedEdge * 1.6} />
              </feComponentTransfer>
              <feTurbulence type="fractalNoise" baseFrequency={0.21} numOctaves={2} seed={seed + 3} result="g" />
              <feColorMatrix in="g" type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${g1 * 2} 0 0 0 ${g0 - g1 * 0.5}`} result="ga" />
              <feComposite in="rough" in2="ga" operator="in" result="pigment" />
              <feMerge>
                <feMergeNode in="pigment" />
                <feMergeNode in="rim" />
              </feMerge>
            </filter>
          </defs>
          <rect width={W} height={H} filter={`url(#${uid}-mottle)`} />
          {children}
          <rect width={W} height={H} filter={`url(#${uid}-tooth)`} style={{ mixBlendMode: "multiply" }} />
        </svg>
        <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
      </AbsoluteFill>
    </WetFilter.Provider>
  );
};

/** Handwriting, written on left to right. The ink is one colour: *emphasis* gets a loose wash swiped behind the word. */
export const Written: React.FC<{ lines: string[]; size: number; y: number; x?: number; at?: number; note?: boolean; weight?: number; leading?: number; swipe?: string }> = ({ lines, size, y, x = M, at = 0, note = false, weight = 500, leading = S.type.leading, swipe = C.sky }) => {
  const t = useSeconds();
  const uid = useUid("hand");
  const em = S.type.charEm * (note ? 0.86 : 1);
  let start = at;
  const rows = lines.map((line, i) => {
    const text = plain(line);
    const dur = text.length / E.writeRate;
    const p = clamp((t - start) / dur);
    const row = { line, text, p, top: y + i * size * leading, at: start };
    start += dur + 0.06;
    return row;
  });
  return (
    <>
      {rows.map(({ line, text, p, top, at: rowAt }, i) => {
        if (p <= 0) return null;
        let col = 0;
        const swipes = words(line).flatMap((w, k) => {
          if (k > 0 && !w.glue) col += 1;
          const x0 = col;
          col += w.text.length;
          return w.em ? [[x0, col] as Pt] : [];
        });
        const items: WashItem[] = swipes.length
          ? [{ d: blob(x + ((swipes[0][0] + swipes[swipes.length - 1][1]) / 2) * size * em, top - size * 0.22, ((swipes[swipes.length - 1][1] - swipes[0][0]) / 2) * size * em * 1.2, size * 0.36, i + 9, 0.08), hue: swipe, at: rowAt + (swipes[0][1] / text.length) * 0.5, from: [x + swipes[0][0] * size * em, top], r: size * 5, alpha: 0.6 }]
          : [];
        return (
          <React.Fragment key={i}>
            <Wash items={items} />
            <clipPath id={`${uid}-${i}`}>
              <rect x={x - 30} y={top - size * 1.3} width={p >= 1 ? W : text.length * size * em * 1.08 * p + 30} height={size * 2} />
            </clipPath>
            <text x={x} y={top} clipPath={`url(#${uid}-${i})`} fontFamily={note ? NOTE : HAND} fontWeight={note ? 400 : weight} fontSize={size} fill={C.ink}>
              {text}
            </text>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** Straight run of a polygon's edges, one stroke per edge, so corners overshoot. */
export const edges = (pts: Pt[], at: number, w?: number, step = 0.08): Stroke[] => pts.slice(1).map((p, i) => ({ pts: [pts[i], p], at: at + i * step, w }));
export const circle = (cx: number, cy: number, r: number, a = 0.4): Pt[] => Array.from({ length: 29 }, (_, i) => [cx + r * Math.cos(a + (i / 26) * Math.PI * 2), cy + r * Math.sin(a + (i / 26) * Math.PI * 2)] as Pt);

export type Sketch = { strokes: Stroke[]; washes: WashItem[] };

/** A row of buildings, suggested rather than described. `colour: false` leaves the line alone: the world before colour. */
export const city = (o: { x0: number; x1: number; base: number; hMin: number; hMax: number; seed: number; at: number; washAt?: number; far?: boolean; colour?: boolean }): Sketch => {
  const rnd = seeded(o.seed);
  const out: Sketch = { strokes: [], washes: [] };
  let x = o.x0;
  let n = 0;
  while (x < o.x1 - 60) {
    const w = Math.min(lerp(110, 190, rnd()), o.x1 - x);
    const h = lerp(o.hMin, o.hMax, rnd());
    const top = o.base - h;
    const gable = rnd() < 0.35;
    const at = o.at + n * 0.14;
    const outline: Pt[] = gable ? [[x, o.base], [x, top + 34], [x + w / 2, top - 22], [x + w, top + 34], [x + w, o.base]] : [[x, o.base], [x, top], [x + w, top], [x + w, o.base]];
    out.strokes.push(...edges(outline, at, o.far ? E.line[0] : E.line[0] + 0.6));
    if (!o.far) {
      const cols = w > 150 ? 3 : 2;
      for (let r = 0; r < Math.floor(h / 92); r++) {
        for (let c = 0; c < cols; c++) {
          if (rnd() < 0.4) continue;
          const [wx, wy] = [x + (w * (c + 0.5)) / cols - 11, top + 46 + r * 88];
          out.strokes.push(...edges([[wx, wy + 40], [wx, wy], [wx + 22, wy], [wx + 22, wy + 40]], at + 0.3 + rnd() * 0.3, E.line[0], 0.03));
        }
      }
    }
    if (o.colour !== false) {
      const local = P.buildings[Math.floor(rnd() * P.buildings.length)];
      const hue = o.far ? mix(local, C.haze, E.hazeMix) : local;
      const washAt = (o.washAt ?? o.at + 1) + n * 0.1;
      const shadeX = x + w * 0.66;
      out.washes.push({ d: patch(outline, o.seed + n), hue, at: washAt, from: [x + w / 2, top + h * 0.4], r: h, alpha: o.far ? 0.3 : undefined });
      if (!o.far) out.washes.push({ d: patch([[shadeX, o.base], [shadeX, top + 10], [x + w, top + 18], [x + w, o.base]], o.seed + n + 50), hue: mix(hue, C.shadow, E.shadowMix), at: washAt + 0.15, from: [shadeX, top], r: h, alpha: 0.3 });
    }
    x += w + (rnd() < 0.3 ? lerp(10, 24, rnd()) : 0);
    n++;
  }
  return out;
};

/** A tree: fragments of a scalloped outline, a trunk, foliage dabs from the ramp, dark side away from the light. */
export const tree = (cx: number, base: number, r: number, seed: number, at: number, washAt: number): Sketch => {
  const rnd = seeded(seed);
  const cy = base - r * 2.1;
  const out: Sketch = { strokes: [{ pts: [[cx - 7, base], [cx - 4, cy + r * 0.5]], at }, { pts: [[cx + 8, base], [cx + 5, cy + r * 0.5]], at: at + 0.06 }], washes: [] };
  for (let a = 0.2; a < 6; a += 0.62) {
    if (rnd() < 0.3) continue;
    const [x, y] = [cx + r * Math.cos(a), cy + r * 0.9 * Math.sin(a)];
    out.strokes.push({ pts: Array.from({ length: 9 }, (_, i) => [x + r * 0.24 * Math.cos(a - 1.4 + (i / 8) * 2.8), y + r * 0.24 * Math.sin(a - 1.4 + (i / 8) * 2.8)] as Pt), at: at + 0.15 + rnd() * 0.3 });
  }
  out.washes.push({ d: blob(cx, cy, r * 1.04, r * 0.95, seed + 1, 0.16), hue: P.foliage[1], at: washAt, from: [cx - r * 0.3, cy - r * 0.3], r: r * 2 });
  P.foliage.slice(2).forEach((hue, i) => {
    for (let k = 0; k < 3; k++) out.washes.push({ d: blob(cx + lerp(-0.5, 0.75, rnd()) * r, cy + lerp(-0.5, 0.75, rnd()) * r, r * 0.26, r * 0.2, seed + 9 + i * 7 + k, 0.2), hue, at: washAt + 0.2 + i * 0.1, from: [cx, cy], r: r * 2, alpha: 0.26 });
  });
  return out;
};

/** A figure, face blank, in a straw hat: the one coloured thing. It boils; the page around it doesn't. */
export const person = (x: number, y: number, s: number, at: number, washAt: number, looks = true): Sketch => {
  const hy = y - 176 * s;
  const b = (pts: Pt[], d: number): Stroke => ({ pts, at: at + d, boil: true, w: E.line[1] - 0.8 });
  const px = (u: number, v: number): Pt => [x + u * s, y + v * s];
  const curve = (list: [number, number][]): Pt[] => list.map(([u, v]) => px(u, v));
  const strokes: Stroke[] = [
    b(circle(x + 4 * s, hy, 21 * s), 0),
    b(curve([[-20, -146], [-26, -100], [-22, -70]]), 0.1),
    b(curve([[20, -146], [26, -100], [20, -70]]), 0.14),
    b(curve([[-22, -70], [20, -70]]), 0.18),
    b(curve([[-14, -70], [-20, -30], [-22, 0], [-36, 2]]), 0.22),
    b(curve([[12, -70], [18, -30], [22, 0], [38, 2]]), 0.26),
    b(curve([[-20, -146], [-44, -112], [-34, -84]]), 0.3),
    b(curve([[20, -146], [62, -168], [86, -212]]), 0.34),
    b(curve([[-34, -197], [4, -206], [46, -204]]), 0.38),
    b(curve([[-14, -200], [-6, -224], [18, -224], [26, -203]]), 0.42),
  ];
  const washes: WashItem[] = [
    { d: blob(x, y - 106 * s, 28 * s, 42 * s, 71, 0.08), hue: P.buildings[2], at: washAt, from: [x, y - 100 * s], r: 90 * s, alpha: 0.5 },
    { d: blob(x + 10 * s, y - 100 * s, 15 * s, 34 * s, 72, 0.08), hue: mix(P.buildings[2], P.figureShadow, 0.4), at: washAt + 0.1, from: [x, y - 100 * s], r: 90 * s, alpha: 0.45 },
    { d: blob(x + 6 * s, y - 203 * s, 42 * s, 13 * s, 73, 0.05), hue: C.hat, at: washAt + 0.2, from: [x, y - 205 * s], r: 70 * s, alpha: 0.95 },
    { d: blob(x + 6 * s, y - 214 * s, 21 * s, 12 * s, 74, 0.05), hue: C.hat, at: washAt + 0.25, from: [x, y - 205 * s], r: 70 * s, alpha: 0.95 },
    { d: blob(x + 6 * s, y - 205 * s, 21 * s, 3 * s, 75, 0.05), hue: P.hatBand, at: washAt + 0.4, from: [x, y - 205 * s], r: 70 * s, alpha: 0.8 },
  ];
  return looks ? { strokes, washes } : { strokes: strokes.slice(0, 8), washes };
};

/** Drawn wind: a wavering stem that ends in a clear spiral, the "~@" of the sketchbook. */
export const curl = (x: number, y: number, a: number, s: number, at: number, seed: number): Stroke => {
  const flip = seeded(seed)() < 0.5 ? 1 : -1;
  const stem = 96 * s;
  const pts: Pt[] = [];
  for (let i = 0; i <= 16; i++) pts.push([(i / 16) * stem, Math.sin((i / 16) * 5) * 9 * s]);
  const [ex, ey] = pts[pts.length - 1];
  const r0 = 30 * s;
  const cy = ey + flip * r0;
  for (let i = 1; i <= 30; i++) {
    const u = i / 30;
    const th = -flip * (Math.PI / 2) + flip * u * Math.PI * 2.7;
    const r = r0 * (1 - 0.8 * u);
    pts.push([ex + r * Math.cos(th), cy + r * Math.sin(th)]);
  }
  return { pts: pts.map(([u, v]) => [x + u * Math.cos(a) - v * Math.sin(a), y + u * Math.sin(a) + v * Math.cos(a)] as Pt), at, w: E.line[0] + 0.5 };
};
