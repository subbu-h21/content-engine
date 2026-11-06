/** Stained Glass's pieces: the room, the lancet, glass pieces lit by a band of sun, lead, carved stone, the banderole. Values come from style.json. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, plain, rgba, run, seeded, smooth, useFontsReady, useSeconds, useUid, words, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const L = style.layout;
export const WIN = L.window;
const F = style.finish;
const P = style.palette;
export const C = {
  hall: color(P, "background"),
  parchment: color(P, "surface"),
  stoneLit: color(P, "muted"),
  stone: color(P, "faint"),
  ruby: color(P, "accent"),
  cobalt: color(P, "accent2"),
  deep: color(P, "deep"),
  gold: color(P, "gold"),
  emerald: color(P, "emerald"),
  olive: color(P, "olive"),
  murrey: color(P, "murrey"),
  white: color(P, "white"),
  sky: color(P, "sky"),
  amber: color(P, "amber"),
  lead: color(P, "lead"),
  trace: color(P, "trace"),
  floor: color(P, "floor"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

export type Pt = [number, number];
export type SunName = keyof typeof E.suns;
/** One piece of glass. `story` burns in its own colour whatever the sun is doing. */
export type Piece = { d: string; hex: string; story?: boolean };
export type Glass = { field: Piece[]; subject: Piece[]; ring: Piece[] };

const hex2 = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const toHex = (c: number[]): string => `#${c.map((v) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0")).join("")}`;

/** Backlight × transmittance, hue-preserving: scaled by the brightest channel so the hue holds, blending to per-channel 1-exp(-x) only at the very top, so blue stays jewel blue. */
export const glow = (hex: string, sun: SunName): string => {
  const s = E.suns[sun];
  const c = hex2(hex).map((v, i) => v * s.rgb[i] * s.k);
  const m = Math.max(...c);
  const top = Math.min(m, E.toneCeiling);
  const w = smooth((m - 2) / 2) * E.toneWhite;
  return toHex(c.map((x) => lerp(m > 0 ? top * Math.pow(x / m, E.toneSaturation) : 0, 1 - Math.exp(-x * 1.5), w)));
};
/** Unlit: weak sky light, ghostly but readable. */
const unlit = (hex: string): string => mix(mix(hex, "#000000", 0.76), C.sky, 0.05);
/** Each piece is its own sheet of glass: colour and thickness drift about 10 %. */
const drift = (hex: string, i: number): string => {
  const r = seeded(i * 2654435 + 97);
  return mix(hex, r() < 0.5 ? "#000000" : "#ffffff", r() * 0.11);
};

export const poly = (pts: Pt[]): string => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
/** A closed Catmull-Rom cut: hand-cut glass has no deep concave corners. */
export const cut = (pts: Pt[]): string => {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i + n - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
};
export const circle = (x: number, y: number, r: number): string => `M${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}Z`;
export const wedge = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string =>
  poly([[cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0)], [cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0)], [cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1)], [cx + r0 * Math.cos(a1), cy + r0 * Math.sin(a1)]]);

const SPRING = WIN.apex + WIN.w * Math.sqrt(3) / 2;

/** A point round the lancet: u 0..1 runs from the sill up the left side, over the point, and down the right. `inset` moves it inward, or outward when negative. */
const lancet = (inset: number, u: number): Pt => {
  const { cx, w, sill } = WIN;
  const r = w - inset;
  const phi = Math.acos(w / 2 / r);
  const left = cx - w / 2 + inset;
  const bottom = sill - Math.max(0, inset);
  if (u < 0.25) return [left, lerp(bottom, SPRING, u / 0.25)];
  if (u <= 0.5) {
    const a = Math.PI + phi * ((u - 0.25) / 0.25);
    return [cx + w / 2 + r * Math.cos(a), SPRING + r * Math.sin(a)];
  }
  const [x, y] = lancet(inset, 1 - u);
  return [2 * cx - x, y];
};
export const lancetPath = (inset: number): string => poly(Array.from({ length: 121 }, (_, i) => lancet(inset, i / 120)));
/** Half-width of the clear glass at height y. */
export const halfAt = (y: number): number => {
  const inner = WIN.border + WIN.fillet;
  const r = WIN.w - inner;
  if (y >= SPRING) return WIN.w / 2 - inner;
  return Math.sqrt(Math.max(0, r * r - (SPRING - y) * (SPRING - y))) - WIN.w / 2;
};

/** The border: a ruby band with pearls, then a white fillet, cut into pieces round the lancet. */
const ringPieces = (): Piece[] => {
  const n = E.ringPieces;
  const band = (a: number, b: number, pick: (i: number) => string): Piece[] =>
    Array.from({ length: n }, (_, i) => {
      const [u0, u1] = [i / n, (i + 1) / n];
      const mid = (u0 + u1) / 2;
      return { d: poly([lancet(a, u0), lancet(a, mid), lancet(a, u1), lancet(b, u1), lancet(b, mid), lancet(b, u0)]), hex: pick(i) };
    });
  const pearls: Piece[] = Array.from({ length: n }, (_, i) => {
    const [x, y] = lancet(WIN.border / 2, i / n);
    return { d: circle(x, y, 10), hex: C.gold };
  });
  const foot = (a: number, b: number, hex: string): Piece[] => {
    const [x0, x1] = [WIN.cx - WIN.w / 2 + a, WIN.cx + WIN.w / 2 - a];
    return Array.from({ length: 6 }, (_, i) => ({ d: poly([[lerp(x0, x1, i / 6), WIN.sill - a], [lerp(x0, x1, (i + 1) / 6), WIN.sill - a], [lerp(x0, x1, (i + 1) / 6), WIN.sill - b], [lerp(x0, x1, i / 6), WIN.sill - b]]), hex }));
  };
  const b = WIN.border;
  const f = b + WIN.fillet;
  return [...band(0, b, (i) => (i % 2 ? C.ruby : mix(C.ruby, C.murrey, 0.35))), ...foot(0, b, C.ruby), ...band(b, f, () => C.white), ...pearls];
};
export const RING = ringPieces();

/** Hand-cut lozenge quarries: a jittered lattice whose neighbours share their vertices. */
export const quarries = (seed: number, pick: (u: number, v: number, r: number) => string): Piece[] => {
  const s = E.quarry;
  const at = (u: number, v: number): Pt => {
    const r = seeded(Math.imul(u + 40, 73856093) ^ Math.imul(v + 40, 19349663) ^ seed);
    return [WIN.cx + (u - v) * s * 0.62 + (r() - 0.5) * s * 0.2, WIN.apex - 40 + (u + v) * s * 0.86 + (r() - 0.5) * s * 0.2];
  };
  const out: Piece[] = [];
  for (let u = -8; u < 24; u++) {
    for (let v = -8; v < 24; v++) {
      if (u + v < 0 || u + v > 24 || Math.abs(u - v) > 8) continue;
      const r = seeded(Math.imul(u + 90, 83492791) ^ Math.imul(v + 90, 2971215) ^ seed)();
      out.push({ d: poly([at(u, v), at(u + 1, v), at(u + 1, v + 1), at(u, v + 1)]), hex: pick(u, v, r) });
    }
  }
  return out;
};

/** The white-glass scroll that holds any text inside the window. */
export const scroll = (x: number, y: number, w: number, h: number): string => {
  const [l, r, t, b] = [x - w / 2, x + w / 2, y - h / 2, y + h / 2];
  return cut([[l, t + 6], [x - w / 4, t - 4], [x, t + 3], [x + w / 4, t - 4], [r, t + 6], [r + 16, y], [r, b - 6], [x + w / 4, b + 4], [x, b - 3], [x - w / 4, b + 4], [l, b - 6], [l - 16, y]]);
};
/** Grisaille lettering on a scroll. */
export const Trace: React.FC<{ text: string; x: number; y: number; size?: number }> = ({ text, x, y, size = S.type.scroll }) => (
  <text x={x} y={y + size * 0.3} textAnchor="middle" fontFamily={BODY} fontSize={size} fill={C.trace} fillOpacity={0.92}>
    {text}
  </text>
);

/** The moving band of sun: a soft-edged, slightly skewed strip that opens from a knife-thin ray. */
export const ray = (t: number): string => {
  const p = ease("ray", t);
  if (p <= 0) return "";
  const [a, b] = [E.rayStart, E.rayEnd];
  const hw = lerp(a.width, b.width, p) / 2;
  const sk = lerp(a.skew, b.skew, p);
  const [y0, y1] = [WIN.apex - 80, WIN.sill + 80];
  const dx = ((y1 - y0) * sk) / 2;
  return poly([[WIN.cx - hw + dx, y0], [WIN.cx + hw + dx, y0], [WIN.cx + hw - dx, y1], [WIN.cx - hw - dx, y1]]);
};

type Part = "field" | "subject" | "ring";
type LayerProps = { glass: Glass; sun: SunName; light: string; rich?: boolean; part?: Part };

/** Lit glass, showing only where the band of sun is. Without `part` it draws everything: that copy is blurred for bloom, spill and the floor. */
const LitGlass: React.FC<LayerProps> = ({ glass, sun, light, rich = false, part }) => {
  const uid = useUid("lit");
  const fill = (p: Piece) => (p.story ? p.hex : glow(p.hex, sun));
  const draw = (list: Piece[], off: number) =>
    list.map((p, i) => (
      <React.Fragment key={i}>
        <path d={p.d} fill={drift(fill(p), i + off)} />
        {rich ? <path d={p.d} fill={`url(#${uid}-s${(i + off) % 6})`} /> : null}
      </React.Fragment>
    ));
  return (
    <>
      <defs>
        <clipPath id={`${uid}-in`}>
          <path d={lancetPath(WIN.border + WIN.fillet)} />
        </clipPath>
        <filter id={`${uid}-soft`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={E.bandSoft / 2} />
        </filter>
        <mask id={`${uid}-band`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <path d={light || "M0 0"} fill="#ffffff" filter={`url(#${uid}-soft)`} />
        </mask>
        {Array.from({ length: 6 }, (_, k) => {
          const a = k * 1.05;
          return (
            <linearGradient key={k} id={`${uid}-s${k}`} x1={0.5 - 0.5 * Math.cos(a)} y1={0.5 - 0.5 * Math.sin(a)} x2={0.5 + 0.5 * Math.cos(a)} y2={0.5 + 0.5 * Math.sin(a)}>
              <stop offset={0} stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset={0.5} stopColor="#ffffff" stopOpacity={0} />
              <stop offset={1} stopColor="#000000" stopOpacity={0.3} />
            </linearGradient>
          );
        })}
      </defs>
      <g mask={`url(#${uid}-band)`}>
        <g clipPath={`url(#${uid}-in)`}>
          {!part || part === "field" ? draw(glass.field, 0) : null}
          {!part || part === "subject" ? draw(glass.subject, 500) : null}
        </g>
        {!part || part === "ring" ? draw(glass.ring, 900) : null}
      </g>
    </>
  );
};

/** One layer of glass, dark then lit, with its lead on top: aged glass beside the came, the came, a faint flange, solder at the joints. */
const Layer: React.FC<LayerProps & { part: Part; width: number; offset: number }> = ({ glass, sun, light, part, width, offset }) => {
  const uid = useUid("lead");
  const pieces = glass[part];
  const d = pieces.map((p) => p.d).join("");
  const inner = part !== "ring";
  const joints = part === "subject" ? [] : pieces.flatMap((p, i) => (i % 2 ? [] : [p.d.slice(1).split(/[LCA]/)[0].split(" ").map(Number)]));
  const solder = mix(C.lead, "#8a8f96", 0.22);
  const clip = inner ? `url(#${uid}-in)` : undefined;
  return (
    <>
      <defs>
        <clipPath id={`${uid}-in`}>
          <path d={lancetPath(WIN.border + WIN.fillet)} />
        </clipPath>
        <filter id={`${uid}-age`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>
      <g clipPath={clip}>
        {pieces.map((p, i) => (
          <path key={i} d={p.d} fill={drift(unlit(p.hex), i + offset)} />
        ))}
      </g>
      <LitGlass glass={glass} sun={sun} light={light} part={part} rich />
      <g clipPath={clip} fill="none" strokeLinejoin="round">
        <path d={d} stroke="#000000" strokeOpacity={0.4} strokeWidth={width * 2.6} filter={`url(#${uid}-age)`} />
        <path d={d} stroke={C.lead} strokeWidth={width} />
        <path d={d} stroke={mix(C.lead, "#8a8f96", 0.4)} strokeOpacity={0.45} strokeWidth={1} />
        {joints.map(([x, y], i) => (Number.isFinite(x) && Number.isFinite(y) ? <circle key={i} cx={x} cy={y} r={width * 0.8} fill={solder} /> : null))}
      </g>
    </>
  );
};

/** The whole window: field, subject and border in painter's order, the glass's texture, bars, then bloom eating into the lead, then the grisaille lettering. */
const Window: React.FC<LayerProps & { paint?: React.ReactNode; bars: number[] }> = ({ glass, sun, light, paint, bars }) => {
  const uid = useUid("win");
  const rnd = seeded(771);
  const flaws = Array.from({ length: 170 }, () => [lerp(190, 890, rnd()), lerp(140, 1140, rnd()), 0.8 + rnd() * 1.8, 0.08 + rnd() * 0.16]);
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <clipPath id={`${uid}-out`}>
            <path d={lancetPath(0)} />
          </clipPath>
          <filter id={`${uid}-tex`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.014 0.0035" numOctaves={4} seed={21} />
            <feColorMatrix type="matrix" values="1.3 0 0 0 0.25  1.3 0 0 0 0.25  1.3 0 0 0 0.25  0 0 0 0 1" />
          </filter>
        </defs>
        <path d={lancetPath(0)} fill="#050608" />
        <Layer glass={glass} sun={sun} light={light} part="field" width={E.leadQuarry} offset={0} />
        <Layer glass={glass} sun={sun} light={light} part="subject" width={E.lead} offset={500} />
        <Layer glass={glass} sun={sun} light={light} part="ring" width={E.lead} offset={900} />
        {/* the blend sits on the clipped group itself: a clip on a parent would isolate it from the glass */}
        <g clipPath={`url(#${uid}-out)`} style={{ mixBlendMode: "multiply" }}>
          <rect width={W} height={H} filter={`url(#${uid}-tex)`} />
        </g>
        <g clipPath={`url(#${uid}-out)`}>
          {flaws.map(([x, y, r, a], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={a} />
          ))}
          {bars.map((y) => (
            <rect key={y} x={0} y={y - 4} width={W} height={8} fill="#0b0b0d" />
          ))}
        </g>
        <path d={lancetPath(0)} fill="none" stroke={C.lead} strokeWidth={9} />
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `blur(${F.bloomBlur}px)`, opacity: F.bloom, mixBlendMode: "screen" }}>
        <svg width={W} height={H}>
          <LitGlass glass={glass} sun={sun} light={light} />
        </svg>
      </div>
      {paint ? (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {paint}
        </svg>
      ) : null}
    </>
  );
};

/** Warm grey ashlar in courses, each block its own stone. */
const Wall: React.FC = () => {
  const rnd = seeded(404);
  const blocks: React.ReactNode[] = [];
  const h = E.course;
  for (let row = 0, y = 0; y < L.slab.y; row++, y += h) {
    let x = row % 2 ? -90 : -30;
    while (x < W) {
      const w = 170 + rnd() * 150;
      blocks.push(<rect key={`${row}-${x.toFixed(0)}`} x={x} y={y} width={w - 4} height={h - 4} rx={3} fill={mix(C.stone, C.hall, 0.1 + rnd() * 0.3)} />);
      x += w;
    }
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width={W} height={L.slab.y} fill={mix(C.hall, "#000000", 0.25)} />
      {blocks}
    </svg>
  );
};

/** The splayed stone round the opening, lighter than the wall. */
const Embrasure: React.FC = () => {
  const uid = useUid("emb");
  const n = 14;
  const stones = Array.from({ length: n }, (_, i) => {
    const [u0, u1] = [i / n, (i + 1) / n];
    return <path key={i} d={poly([lancet(-WIN.splay, u0), lancet(-WIN.splay, (u0 + u1) / 2), lancet(-WIN.splay, u1), lancet(0, u1), lancet(0, (u0 + u1) / 2), lancet(0, u0)])} fill={`url(#${uid})`} stroke={C.hall} strokeWidth={3} />;
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id={uid} x1={0} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor={C.stoneLit} />
          <stop offset={1} stopColor={mix(C.stone, C.hall, 0.3)} />
        </linearGradient>
      </defs>
      {stones}
    </svg>
  );
};

/** The string course that carries the carved title. */
const Slab: React.FC = () => {
  const { y, h } = L.slab;
  const uid = useUid("slab");
  const joints = [190, 505, 830];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id={`${uid}-g`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor={mix(C.stoneLit, "#ffffff", 0.14)} />
          <stop offset={0.14} stopColor={C.stoneLit} />
          <stop offset={1} stopColor={mix(C.stoneLit, C.stone, 0.55)} />
        </linearGradient>
        <filter id={`${uid}-t`} filterUnits="userSpaceOnUse" x={0} y={y} width={W} height={h} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves={4} seed={9} />
          <feColorMatrix type="matrix" values="0.5 0 0 0 0.68  0.5 0 0 0 0.68  0.5 0 0 0 0.68  0 0 0 0 1" />
        </filter>
      </defs>
      <rect x={0} y={y - 14} width={W} height={14} fill={mix(C.stoneLit, "#ffffff", 0.2)} />
      <rect x={0} y={y} width={W} height={h} fill={`url(#${uid}-g)`} />
      <rect x={0} y={y} width={W} height={h} filter={`url(#${uid}-t)`} style={{ mixBlendMode: "multiply" }} />
      {joints.map((x) => (
        <rect key={x} x={x} y={y} width={3} height={h} fill={rgba(C.hall, 0.45)} />
      ))}
      <rect x={0} y={y + h} width={W} height={10} fill={rgba(C.hall, 0.8)} />
    </svg>
  );
};

/** Large irregular flagstones with the window's colour lying on them: blurred, desaturated, mirrored, never a sharp decal. */
const Floor: React.FC<LayerProps> = (props) => {
  const y0 = L.floorY;
  const rnd = seeded(66);
  const rows = [0, 92, 214];
  const joints = rows.flatMap((ry, i) => {
    const out: string[] = [`M0 ${y0 + ry + rnd() * 8}L${W} ${y0 + ry + rnd() * 8}`];
    for (let x = 120 + rnd() * 220; x < W; x += 260 + rnd() * 260) out.push(`M${x} ${y0 + ry}L${x + (x - W / 2) * 0.12} ${y0 + (rows[i + 1] ?? H - y0)}`);
    return out;
  });
  const sy = (H - y0) / (WIN.sill - WIN.apex);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y0, bottom: 0, backgroundColor: C.floor, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -y0, width: W, height: H, transformOrigin: `${WIN.cx}px ${WIN.sill}px`, transform: `translateY(${y0 - WIN.sill}px) scale(1.25, ${-sy * 1.1})`, filter: `blur(${F.floorBlur}px) saturate(${F.floorSaturate})`, opacity: F.floorPatch, mixBlendMode: "screen" }}>
          <svg width={W} height={H}>
            <LitGlass {...props} />
          </svg>
        </div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={joints.join("")} stroke={rgba(C.hall, 0.75)} strokeWidth={4} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: y0, height: 90, backgroundImage: `linear-gradient(180deg, ${rgba(C.hall, 0.75)}, ${rgba(C.hall, 0)})` }} />
    </>
  );
};

/** Shafts of light: near nothing at the window, strongest about 40 % of the way down; slow dust inside. */
const Shafts: React.FC<{ sun: SunName; strength: number }> = ({ sun, strength }) => {
  const uid = useUid("shaft");
  const t = useSeconds();
  const col = glow("#ffffff", sun);
  const [y0, y1] = [WIN.sill - 200, H];
  const rnd = seeded(13);
  const dust = Array.from({ length: 46 }, () => [190 + rnd() * 700, y0 + rnd() * (y1 - y0), 1.2 + rnd() * 2, rnd() * 6.28]);
  if (strength <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id={uid} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
          <stop offset={0} stopColor={col} stopOpacity={0} />
          <stop offset={0.4} stopColor={col} stopOpacity={F.shaft * strength} />
          <stop offset={1} stopColor={col} stopOpacity={F.shaft * 0.3 * strength} />
        </linearGradient>
        <filter id={`${uid}-b`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>
      <path d={poly([[210, y0], [870, y0], [1020, y1], [60, y1]])} fill={`url(#${uid})`} filter={`url(#${uid}-b)`} />
      {dust.map(([x, y, r, ph], i) => (
        <circle key={i} cx={x + Math.sin(t * 0.5 + ph) * 12} cy={y - t * 7} r={r} fill={col} opacity={0.3 * strength} />
      ))}
    </svg>
  );
};

/** The hall: wall, embrasure, spill, window, string course, floor, shafts. Everything else stands in front. */
export const Room: React.FC<{ glass: Glass; sun: SunName; light: string; strength?: number; paint?: React.ReactNode; bars?: number[]; children?: React.ReactNode }> = ({ glass, sun, light, strength = 1, paint, bars = E.saddleBars, children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.hall }}>
      <Wall />
      <Embrasure />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse 72% 52% at 50% 34%, ${rgba(C.hall, 0)} 38%, ${rgba(C.hall, 0.82)} 100%)` }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(54px)", opacity: F.spill, mixBlendMode: "screen", transform: "scale(1.2)", transformOrigin: `${WIN.cx}px 640px` }}>
        <svg width={W} height={H}>
          <LitGlass glass={glass} sun={sun} light={light} />
        </svg>
      </div>
      <Window glass={glass} sun={sun} light={light} paint={paint} bars={bars} />
      <Slab />
      <Floor glass={glass} sun={sun} light={light} />
      <Shafts sun={sun} strength={strength} />
      {children}
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Capitals cut into the string course: a dark cut with a light lower lip; emphasis is gilded. A band of light reveals them from the left. */
export const Carved: React.FC<{ lines: string[]; size: number; at?: number }> = ({ lines, size, at = 1.2 }) => {
  const p = ease("carve", useSeconds() - at);
  if (p <= 0) return null;
  const edge = lerp(-12, 112, p);
  const mask = `linear-gradient(90deg, #000 ${edge - 12}%, transparent ${edge}%)`;
  const lh = size * S.type.leading;
  const { y, h } = L.slab;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y + (h - lines.length * lh) / 2 + size * 0.03, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: size, lineHeight: `${lh}px`, letterSpacing: S.type.tracking, whiteSpace: "nowrap", WebkitMaskImage: mask, maskImage: mask }}>
      {lines.map((line, i) => (
        <div key={i}>
          {words(line).map((w, j) => (
            <React.Fragment key={j}>
              {j > 0 && !w.glue ? " " : null}
              <span
                style={
                  w.em
                    ? { color: mix(C.gold, "#ffe9a8", 0.35), WebkitTextStroke: `${Math.max(3, size * 0.055)}px ${C.trace}`, paintOrder: "stroke fill", textShadow: `0 2px 0 ${rgba("#ffffff", 0.4)}` }
                    : { color: mix(C.trace, "#000000", 0.2), textShadow: `0 2px 0 ${rgba("#fff6e0", 0.5)}, 0 -1px 1px ${rgba("#000000", 0.5)}` }
                }
              >
                {w.text.toUpperCase()}
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

/** The parchment banderole: unfurls from the centre with curled ends and a gentle sag; the text fades in once it is 75 % open. */
export const Banderole: React.FC<{ lines: string[]; at?: number; w?: number; size?: number }> = ({ lines, at = 1.6, w = 880, size = S.type.body }) => {
  const uid = useUid("band");
  const p = ease("unfurl", useSeconds() - at);
  if (p <= 0) return null;
  const y = L.banderoleY;
  const lh = size * 1.18;
  const h = lines.length * lh + 40;
  const half = (w / 2) * p;
  const [l, r, t, b] = [W / 2 - half, W / 2 + half, y - h / 2, y + h / 2];
  const sag = 12;
  const tail = 56 * p;
  const back = mix(C.parchment, C.trace, 0.3);
  const fold = mix(C.parchment, C.trace, 0.62);
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id={uid} x1={0} y1={0} x2={1} y2={0}>
            <stop offset={0} stopColor={mix(C.parchment, C.trace, 0.2)} />
            <stop offset={0.12} stopColor={C.parchment} />
            <stop offset={0.88} stopColor={C.parchment} />
            <stop offset={1} stopColor={mix(C.parchment, C.trace, 0.2)} />
          </linearGradient>
        </defs>
        <path d={poly([[l + 26, t + 20], [l - tail, t + 20], [l - tail * 0.55, y + 20], [l - tail, b + 20], [l + 26, b + 20]])} fill={back} />
        <path d={poly([[r - 26, t + 20], [r + tail, t + 20], [r + tail * 0.55, y + 20], [r + tail, b + 20], [r - 26, b + 20]])} fill={back} />
        <path d={poly([[l, b], [l + 26, b], [l + 26, b + 20]])} fill={fold} />
        <path d={poly([[r, b], [r - 26, b], [r - 26, b + 20]])} fill={fold} />
        <path d={`M${l} ${t}Q${W / 2} ${t + sag * 2} ${r} ${t}L${r} ${b}Q${W / 2} ${b + sag * 2} ${l} ${b}Z`} fill={`url(#${uid})`} stroke={mix(C.parchment, C.trace, 0.6)} strokeWidth={1.5} />
        <path d={`M${l + 14} ${t + 9}Q${W / 2} ${t + 9 + sag * 2} ${r - 14} ${t + 9}`} fill="none" stroke={mix(C.parchment, C.trace, 0.5)} strokeWidth={1} />
        <path d={`M${l + 14} ${b - 9}Q${W / 2} ${b - 9 + sag * 2} ${r - 14} ${b - 9}`} fill="none" stroke={mix(C.parchment, C.trace, 0.5)} strokeWidth={1} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - (lines.length * lh) / 2 + sag * 0.7, textAlign: "center", fontFamily: BODY, fontSize: size, lineHeight: `${lh}px`, color: C.trace, whiteSpace: "nowrap", opacity: clamp((p - 0.75) / 0.25) }}>
        {lines.map((l2, i) => (
          <div key={i}>{plain(l2)}</div>
        ))}
      </div>
    </>
  );
};
