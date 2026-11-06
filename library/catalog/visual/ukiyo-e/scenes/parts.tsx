/**
 * Ukiyo-e Print's pieces, all procedural and deterministic:
 * - the sheet: washi with fibres, a double sumi border; the frame is the print;
 * - colour blocks: flat shapes printed from separate blocks, each block group slightly out of register (g1 blues, g2
 *   greens and secondaries, g3 reds and figures), each textured with woodgrain (iso-lines of a warped noise field
 *   through a periodic table), baren streaks and goma-zuri specks (feTurbulence);
 * - bokashi: a gradient whose top edge wanders per column (feDisplacementMap along x only);
 * - the key block: sumi lines as ribbons whose width wanders ±28% and tapers at both ends;
 * - motifs: mist bands, an asymmetric mountain with a snowcap of drips, pines with flat needle pads, rain and light as
 *   fine straight lines, a small traveller with a conical hat;
 * - cartouches and slips in cream with a thick and thin border, a beni tab, a red seal stamped in;
 * - the printing reveal: each block arrives under a diagonal baren sweep and slides a few px into registration.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BRUSH, FACES, MINCHO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const T = style.type;
export const E = style.elements;
export const B = style.layout.border;
const P = style.palette;
export const C = {
  washi: color(P, "background"),
  sumi: color(P, "text"),
  fibreDark: color(P, "muted"),
  fibreLight: color(P, "faint"),
  beni: color(P, "accent"),
  prussian: color(P, "accent2"),
  prussianDark: color(P, "prussianDark"),
  prussianLight: color(P, "prussianLight"),
  trough: color(P, "trough"),
  paleBlue: color(P, "paleBlue"),
  paleBlue2: color(P, "paleBlue2"),
  beniPale: color(P, "beniPale"),
  peach: color(P, "peach"),
  ochre: color(P, "ochre"),
  straw: color(P, "straw"),
  green: color(P, "green"),
  greenDark: color(P, "greenDark"),
  pine: color(P, "pine"),
  indigo: color(P, "indigoCloth"),
  gaiters: color(P, "gaiters"),
  cartouche: color(P, "cartouche"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration?: number): number =>
  run(duration === undefined ? R[name] : { ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

export type Pt = [number, number];
export const pathOf = (pts: Pt[], close = true) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}${close ? " Z" : ""}` : "");

const noise1 = (seed: number) => {
  const r = seeded(seed);
  const v = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x: number): number => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = v[((i % 256) + 256) % 256];
    const b = v[(((i + 1) % 256) + 256) % 256];
    return a + (b - a) * u;
  };
};

/** A smooth open curve through points (Catmull-Rom). */
export const through = (pts: Pt[], n = 10): Pt[] => {
  if (pts.length < 3) return pts.slice();
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const ellipse = (cx: number, cy: number, rx: number, ry = rx, n = 48): Pt[] => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * Math.PI * 2), cy + ry * Math.sin((i / n) * Math.PI * 2)] as Pt);
export const rectPts = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

// ------------------------------------------------------------------ blocks and the key line

export type Group = "g1" | "g2" | "g3";

/**
 * One printing block (a group of shapes in one pass): offset by its registration error, textured with woodgrain,
 * baren streaks and specks, and printed in by a diagonal baren sweep that slides it into place.
 */
export const Block: React.FC<{ group: Group; at: number; children: React.ReactNode }> = ({ group, at, children }) => {
  const id = useSvgId("ukb");
  const t = useSeconds();
  const p = easeFor("print", t - at);
  if (p <= 0) return null;
  const [rx, ry] = E.registration[group];
  const slide = (1 - p) * S.motion.slide;
  const sweep = p * (W + H) * 1.1;
  return (
    <g transform={`translate(${(rx + slide).toFixed(2)} ${(ry + slide * 0.6).toFixed(2)})`}>
      {p < 1 ? (
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x={-100} y={-100} width={W + 200} height={H + 200}>
            <path d={`M -100 -100 L ${sweep - 100} -100 L -100 ${sweep - 100} Z`} fill="#ffffff" filter="url(#uk-ragged)" />
          </mask>
        </defs>
      ) : null}
      <g mask={p < 1 ? `url(#${id})` : undefined} filter="url(#uk-wood)">
        {children}
      </g>
    </g>
  );
};

/** A flat colour shape. */
export const Flat: React.FC<{ pts: Pt[]; fill: string; d?: string }> = ({ pts, fill, d }) => <path d={d ?? pathOf(pts)} fill={fill} />;

/** Bokashi: a vertical gradient whose edge wanders ±26 px per column, over a box. */
export const Bokashi: React.FC<{ x: number; y: number; w: number; h: number; stops: [number, string][]; clip?: Pt[] }> = ({ x, y, w, h, stops, clip }) => {
  const id = useSvgId("ukk");
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y + h}>
          {stops.map(([o, c], i) => (
            <stop key={i} offset={o} stopColor={c} stopOpacity={c === C.washi ? 0 : 1} />
          ))}
        </linearGradient>
        {clip ? (
          <clipPath id={`${id}c`}>
            <path d={pathOf(clip)} />
          </clipPath>
        ) : null}
      </defs>
      <g clipPath={clip ? `url(#${id}c)` : undefined}>
        <rect x={x} y={y - 40} width={w} height={h + 80} fill={`url(#${id})`} filter="url(#uk-wander)" />
      </g>
    </g>
  );
};

/** A sumi key line: a ribbon whose width wanders ±28% and tapers at both ends. */
export const Key: React.FC<{ pts: Pt[]; width?: number; seed?: number; close?: boolean; opacity?: number }> = ({ pts, width = E.keyLine.width, seed = 1, close = false, opacity = 1 }) => {
  const pp = close ? [...pts, pts[0]] : pts;
  const n = pp.length;
  if (n < 2) return null;
  const nz = noise1(seed);
  const L: Pt[] = [];
  const Rr: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pp[Math.max(0, i - 1)];
    const b = pp[Math.min(n - 1, i + 1)];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const u = i / (n - 1);
    const taper = close ? 1 : Math.min(1, u / 0.08 + 0.25, (1 - u) / 0.08 + 0.25);
    const hw = (width * (1 + E.keyLine.jitter * nz(i / 9)) * taper) / 2;
    L.push([pp[i][0] - ((b[1] - a[1]) / d) * hw, pp[i][1] + ((b[0] - a[0]) / d) * hw]);
    Rr.push([pp[i][0] + ((b[1] - a[1]) / d) * hw, pp[i][1] - ((b[0] - a[0]) / d) * hw]);
  }
  return <path d={pathOf([...L, ...Rr.reverse()])} fill={C.sumi} opacity={opacity} />;
};

// ------------------------------------------------------------------ motifs

/** An asymmetric mountain: concave slopes (s^1.55 left, s^1.8 right), a notched summit; and its snowcap of drips. */
export const mountain = (cx: number, top: number, base: number, wl: number, wr: number, seed = 1): { body: Pt[]; snow: Pt[] } => {
  const r = seeded(seed);
  const h = base - top;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const s = i / 24;
    left.push([cx - wl * s, top + h * Math.pow(s, 1.55)]);
    right.push([cx + wr * s, top + h * Math.pow(s, 1.8)]);
  }
  const notch: Pt[] = [
    [cx - 16, top + 6],
    [cx - 6, top - 2],
    [cx + 2, top + 8],
    [cx + 12, top],
  ];
  const body: Pt[] = [...left.slice().reverse(), ...notch, ...right];
  const snowY = (x: number) => {
    const s = x < cx ? (cx - x) / wl : (x - cx) / wr;
    return top + h * Math.pow(s, x < cx ? 1.55 : 1.8);
  };
  const sl = wl * 0.42;
  const sr = wr * 0.42;
  const snow: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = cx - sl + ((sl + sr) * i) / 12;
    const depth = 40 + r() * 90;
    snow.push([x, snowY(x) + (i % 2 ? depth : 10)]);
  }
  return { body, snow: [[cx - sl, snowY(cx - sl)], ...notch, [cx + sr, snowY(cx + sr)], ...snow.slice().reverse()] };
};

/** A mist band (suyari-gasumi): a long rounded flat band, fading at both ends. */
export const Mist: React.FC<{ x: number; y: number; w: number; h: number; fill?: string }> = ({ x, y, w, h, fill = C.washi }) => {
  const id = useSvgId("ukm");
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={fill} stopOpacity={0} />
          <stop offset="0.18" stopColor={fill} stopOpacity={1} />
          <stop offset="0.82" stopColor={fill} stopOpacity={1} />
          <stop offset="1" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`url(#${id})`} />
    </g>
  );
};

/** A pine pad: a flat-topped cluster of needles (top line flat, scalloped below). */
export const padPts = (x: number, y: number, w: number, h: number): Pt[] => {
  const pts: Pt[] = [
    [x - w / 2, y],
    [x + w / 2, y],
  ];
  const n = 6;
  for (let i = 0; i <= n; i++) {
    const px = x + w / 2 - (w * i) / n;
    pts.push([px, y + (i % 2 ? h : h * 0.6)]);
  }
  return pts;
};

/** A traveller seen from the side: a low conical hat hiding the face, an indigo robe, gaiters, a staff. */
export const Traveller: React.FC<{ x: number; y: number; h: number; at: number; look?: boolean }> = ({ x, y, h, at, look = true }) => {
  const s = h / 120;
  const P2 = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const hat: Pt[] = look ? [P2(-26, -96), P2(24, -112), P2(-2, -128)] : [P2(-28, -100), P2(28, -100), P2(0, -124)];
  const robe: Pt[] = [P2(-14, -96), P2(14, -96), P2(22, -30), P2(-20, -30)];
  return (
    <>
      <Block group="g2" at={at}>
        <Flat pts={robe} fill={C.indigo} />
        <Flat pts={[P2(-18, -30), P2(-6, -30), P2(-6, 0), P2(-18, 0)]} fill={C.gaiters} />
        <Flat pts={[P2(6, -30), P2(18, -30), P2(20, 0), P2(8, 0)]} fill={C.gaiters} />
      </Block>
      <Block group="g3" at={at + 0.1}>
        <Flat pts={hat} fill={C.ochre} />
        <Flat pts={[P2(-14, -62), P2(14, -62), P2(14, -54), P2(-14, -54)]} fill={C.straw} />
      </Block>
      <Key pts={[...hat, hat[0]]} width={2} seed={3} />
      <Key pts={[...robe, robe[0]]} width={2} seed={4} />
      <Key pts={[P2(30, -110), P2(36, 4)]} width={2.4} seed={5} />
    </>
  );
};

// ------------------------------------------------------------------ cartouches, slips, seals

/** A red seal: characters cut out of red (simple carved strokes), chipped edges; stamped in (1.35 → 1 in 0.2 s). */
export const Seal: React.FC<{ x: number; y: number; at: number; w?: number; h?: number }> = ({ x, y, at, w = E.seal.w, h = E.seal.h }) => {
  const id = useSvgId("uks");
  const p = easeFor("seal", useSeconds() - at);
  if (p <= 0) return null;
  const k = 1 + 0.35 * (1 - p);
  const r = seeded(5);
  const chips = Array.from({ length: 7 }, () => [x + r() * w, r() < 0.5 ? y + r() * 4 : y + h - r() * 4, 1.5 + r() * 2.5]);
  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${k}) translate(${-(x + w / 2)} ${-(y + h / 2)})`}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={x - 10} y={y - 10} width={w + 20} height={h + 20}>
          <rect x={x} y={y} width={w} height={h} rx={2} fill="#fff" />
          <path d={`M ${x + w * 0.22} ${y + h * 0.2} H ${x + w * 0.78} M ${x + w * 0.5} ${y + h * 0.2} V ${y + h * 0.5} M ${x + w * 0.24} ${y + h * 0.5} H ${x + w * 0.76} M ${x + w * 0.3} ${y + h * 0.66} V ${y + h * 0.84} H ${x + w * 0.7} V ${y + h * 0.66}`} stroke="#000" strokeWidth={w * 0.09} fill="none" />
          {chips.map(([cx, cy, cr], i) => (
            <circle key={i} cx={cx} cy={cy} r={cr} fill="#000" />
          ))}
        </mask>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={C.beni} mask={`url(#${id})`} opacity={0.93} />
    </g>
  );
};

/** A cream cartouche with a thick and a thin border; a beni tab with the series title; a brushed title; a seal. */
export const Cartouche: React.FC<{ x: number; y: number; w: number; lines: string[]; tab?: string; at: number; size?: number; seal?: boolean }> = ({ x, y, w, lines, tab, at, size = T.title, seal = true }) => {
  const t = useSeconds();
  const p = easeFor("cartouche", t - at);
  if (p <= 0) return null;
  const dist = S.motion.recipes.cartouche.distance;
  const tabH = tab ? T.tab * 1.9 : 0;
  const h = tabH + lines.length * size * T.leading + size * 0.7;
  return (
    <g opacity={p} transform={`translate(0 ${(-(1 - p) * dist).toFixed(1)})`}>
      <rect x={x} y={y} width={w} height={h} fill={C.cartouche} />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill="none" stroke={C.sumi} strokeWidth={3} />
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} fill="none" stroke={C.sumi} strokeWidth={1} />
      {tab ? (
        <>
          <rect x={x + 9} y={y + 9} width={w - 18} height={tabH - 6} fill={C.beniPale} />
          <text x={x + w / 2} y={y + 9 + (tabH - 6) / 2 + T.tab * 0.36} textAnchor="middle" fontFamily={MINCHO} fontWeight={500} fontSize={T.tab} fill={C.sumi}>
            {tab}
          </text>
        </>
      ) : null}
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={y + tabH + size * 0.98 + i * size * T.leading} textAnchor="middle" fontFamily={BRUSH} fontSize={size} letterSpacing={`${T.tracking}em`} fill={C.sumi}>
          {l}
        </text>
      ))}
      {seal ? <Seal x={x + w - E.seal.w * 0.7} y={y + h + 14} at={at + 0.35} w={E.seal.w * 0.8} h={E.seal.h * 0.8} /> : null}
    </g>
  );
};

/** A subtitle slip: sumi on cream with a 2.6 + 1 px border and a small red seal at the left. */
export const Slip: React.FC<{ lines: string[]; x: number; y: number; at: number; size?: number; w?: number }> = ({ lines, x, y, at, size = T.body, w }) => {
  const t = useSeconds();
  const p = easeFor("subtitle", t - at);
  if (p <= 0) return null;
  const ww = w ?? Math.max(...lines.map((l) => l.length)) * size * 0.5 + 110;
  const h = lines.length * size * 1.25 + 30;
  return (
    <g opacity={p}>
      <rect x={x} y={y} width={ww} height={h} fill={C.cartouche} opacity={0.96} />
      <rect x={x + 1.3} y={y + 1.3} width={ww - 2.6} height={h - 2.6} fill="none" stroke={C.sumi} strokeWidth={2.6} />
      <rect x={x + 6} y={y + 6} width={ww - 12} height={h - 12} fill="none" stroke={C.sumi} strokeWidth={1} />
      <rect x={x + 18} y={y + h / 2 - 14} width={22} height={28} fill={C.beni} />
      {lines.map((l, i) => (
        <text key={i} x={x + 56} y={y + 15 + size * 0.95 + i * size * 1.25} fontFamily={MINCHO} fontWeight={500} fontSize={size} fill={C.sumi}>
          {l}
        </text>
      ))}
    </g>
  );
};

// ------------------------------------------------------------------ the sheet

/** The sheet: washi, fibres, the double sumi border; textures and filters for every block. Waits for the fonts. */
export const Sheet: React.FC<{ children: React.ReactNode; over?: React.ReactNode }> = ({ children, over }) => {
  useFontsReady(FACES);
  const tx = E.texture;
  // a periodic table turns the warped noise field into iso-lines: the woodgrain
  const grain = Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? 1 : 0)).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: C.washi }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="uk-wood" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.03" numOctaves={3} seed={2} result="n" />
            <feComponentTransfer in="n" result="iso">
              <feFuncA type="discrete" tableValues={grain} />
            </feComponentTransfer>
            <feColorMatrix in="iso" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${tx.wood} 0`} result="lines" />
            <feComposite in="lines" in2="SourceAlpha" operator="in" result="wood" />
            <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.016" numOctaves={2} seed={8} result="b" />
            <feColorMatrix in="b" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${tx.baren * 2.4} 0 0 0 ${-tx.baren * 1.55}`} result="baren0" />
            <feComposite in="baren0" in2="SourceAlpha" operator="in" result="baren" />
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={1} seed={13} result="sp" />
            <feColorMatrix in="sp" type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.92  0 0 0 0 0.82  14 0 0 0 -10.2" result="specks0" />
            <feComposite in="specks0" in2="SourceAlpha" operator="in" result="specks" />
            <feComponentTransfer in="specks" result="specksA">
              <feFuncA type="linear" slope={tx.specks * 2} />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="wood" />
              <feMergeNode in="baren" />
              <feMergeNode in="specksA" />
            </feMerge>
          </filter>
          <filter id="uk-wander" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.0001" numOctaves={2} seed={4} result="n" />
            <feColorMatrix in="n" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="ny" />
            <feDisplacementMap in="SourceGraphic" in2="ny" scale={E.bokashi.wander * 2} xChannelSelector="G" yChannelSelector="R" />
          </filter>
          <filter id="uk-ragged" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={9} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={40} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="uk-fibre" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.22" numOctaves={2} seed={21} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.72  0 0 0 0 0.58  9 0 0 0 -6" />
          </filter>
          <clipPath id="uk-inside">
            <rect x={B.x} y={B.y} width={W - 2 * B.x} height={H - 2 * B.y} />
          </clipPath>
        </defs>
        <g clipPath="url(#uk-inside)">{children}</g>
        <rect width={W} height={H} filter="url(#uk-fibre)" opacity={tx.fibres * 1.6} />
        <rect x={B.x} y={B.y} width={W - 2 * B.x} height={H - 2 * B.y} fill="none" stroke={C.sumi} strokeWidth={B.line} />
        <rect x={B.x - B.outer} y={B.y - B.outer} width={W - 2 * (B.x - B.outer)} height={H - 2 * (B.y - B.outer)} fill="none" stroke={C.sumi} strokeWidth={1} />
        {over}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export { BRUSH, MINCHO, clamp };
