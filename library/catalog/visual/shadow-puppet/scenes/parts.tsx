/**
 * Shadow Puppet's pieces, all procedural and deterministic:
 * - the stage: a red-and-black lacquer frame with a carved lintel of gold cloud curls, and a cotton screen lit from
 *   behind by an oil lamp (a broad lobe and a hotspot, flickering ±6% at ~7 Hz with a faster ripple), a fine weave, a
 *   warm vignette (never grey) and a warm bloom; blurred audience heads along the bottom;
 * - hide pieces: dyed, translucent, multiplied onto the lit cloth (so overlaps darken and colour is transmitted light),
 *   carved like lace (crescent rows, diamond lattice, coin holes, tapered slits, teardrops) through an SVG mask, each
 *   region with a dark carved outline;
 * - puppets: jointed pieces with rivets, held on thin rods, with a slow hand tremor; they arrive by pressing onto the
 *   cloth from behind (scale 2.6 → 1, blur 34 → 0 px in 0.55 s);
 * - plaques: dark hide with letters cut out so the words glow, a vermilion meander border, malachite corner roundels and
 *   a seal; the storyteller's placard: a dark-lacquer board with a gold line, a seal and cream text that slides up.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, PLACARD, PLAQUE } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const T = style.type;
export const E = style.elements;
export const SCREEN = style.layout.screen;
const P = style.palette;
export const C = {
  cloth: color(P, "background"),
  cream: color(P, "text"),
  hide: color(P, "muted"),
  vig: color(P, "faint"),
  vermilion: color(P, "accent"),
  indigo: color(P, "accent2"),
  flame: color(P, "flame"),
  ochre: color(P, "ochre"),
  gold: color(P, "gold"),
  malachite: color(P, "malachite"),
  jade: color(P, "jade"),
  ink: color(P, "ink"),
  shaft: color(P, "shaft"),
  lamp: color(P, "lamp"),
  bloom: color(P, "bloom"),
  lacquer: color(P, "lacquer"),
  black: color(P, "lacquerBlack"),
  placard: color(P, "placard"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const easeFor = (name: keyof typeof style.motion.recipes, t: number, duration?: number): number =>
  run(duration === undefined ? R[name] : { ...(R[name] as Extract<Recipe, { kind: "ease" }>), duration }, t);
const useSvgId = (prefix: string): string => `${prefix}${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

export type Pt = [number, number];
const pathOf = (pts: Pt[], close = true) => (pts.length ? `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}${close ? " Z" : ""}` : "");

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

/** A closed smooth outline through points (Catmull-Rom, wrapping). */
export const blob = (pts: Pt[], n = 8): Pt[] => {
  const out: Pt[] = [];
  const m = pts.length;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % m];
    const p3 = pts[(i + 2) % m];
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
  return out;
};

export const circle = (cx: number, cy: number, r: number, n = 40, ry = r): Pt[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + ry * Math.sin((i / n) * Math.PI * 2)] as Pt);

export const rotatePts = (pts: Pt[], c: Pt, deg: number): Pt[] => {
  const a = (deg * Math.PI) / 180;
  const [ca, sa] = [Math.cos(a), Math.sin(a)];
  return pts.map(([x, y]) => [c[0] + (x - c[0]) * ca - (y - c[1]) * sa, c[1] + (x - c[0]) * sa + (y - c[1]) * ca] as Pt);
};

// ------------------------------------------------------------------ carving patterns (holes, in local coordinates)

/** Rows of small crescents (scales, tiles) filling a box; drawn as holes. */
export const crescents = (x0: number, y0: number, w: number, h: number, size = 16): string => {
  const out: string[] = [];
  let row = 0;
  for (let y = y0 + size; y < y0 + h - size * 0.4; y += size * 1.05, row++) {
    for (let x = x0 + size * (row % 2 ? 1.1 : 0.55); x < x0 + w - size * 0.5; x += size * 1.15) {
      const r = size * 0.5;
      out.push(`M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r * 1.15} ${r * 0.7} 0 0 1 ${x - r} ${y} Z`);
    }
  }
  return out.join(" ");
};

/** A diamond lattice: small diamond holes on a grid. */
export const lattice = (x0: number, y0: number, w: number, h: number, step = 20): string => {
  const out: string[] = [];
  const d = step * 0.36;
  for (let y = y0 + step * 0.6; y < y0 + h - step * 0.3; y += step)
    for (let x = x0 + step * 0.6; x < x0 + w - step * 0.3; x += step) out.push(`M ${x} ${y - d} L ${x + d} ${y} L ${x} ${y + d} L ${x - d} ${y} Z`);
  return out.join(" ");
};

/** A coin hole: a round hole with a square of hide left inside (drawn: hole black, square white in the mask). */
export const coin = (x: number, y: number, r: number) => ({ hole: `M ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} Z`, keep: `M ${x - r * 0.42} ${y - r * 0.42} h ${r * 0.84} v ${r * 0.84} h ${-r * 0.84} Z` });

/** A tapered slit along a direction (cracks, rays, fur). */
export const slit = (x: number, y: number, len: number, w: number, deg: number): string => {
  const a = (deg * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  return `M ${x - ux * len * 0.5} ${y - uy * len * 0.5} Q ${x + nx * w} ${y + ny * w} ${x + ux * len * 0.5} ${y + uy * len * 0.5} Q ${x - nx * w} ${y - ny * w} ${x - ux * len * 0.5} ${y - uy * len * 0.5} Z`;
};

// ------------------------------------------------------------------ hide pieces

/**
 * A piece of dyed hide: translucent (multiplied onto the lit cloth, so overlaps darken), carved with `holes` (and
 * `keep` shapes of hide left inside holes), outlined in dark ink.
 */
export const Hide: React.FC<{ d: string; dye: string; holes?: string; keep?: string; cuts?: string; outline?: number; opacity?: number }> = ({ d, dye, holes, keep, cuts, outline = E.outline, opacity = E.hide }) => {
  const id = useSvgId("sph");
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-3000} y={-3000} width={6000} height={6000}>
          <path d={d} fill="#ffffff" />
          {holes ? <path d={holes} fill="#000000" /> : null}
          {cuts ? <path d={cuts} fill="none" stroke="#000000" strokeWidth={5} strokeLinecap="round" /> : null}
          {keep ? <path d={keep} fill="#ffffff" /> : null}
        </mask>
      </defs>
      <path d={d} fill={dye} opacity={opacity} mask={`url(#${id})`} />
      <path d={d} fill="none" stroke={C.ink} strokeWidth={outline} strokeLinejoin="round" opacity={0.92} />
    </g>
  );
};

/** A rivet: a dark ring with a pale knot. */
export const Rivet: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 7 }) => (
  <g style={{ mixBlendMode: "multiply" }}>
    <circle cx={x} cy={y} r={r} fill={C.ink} opacity={0.85} />
    <circle cx={x} cy={y} r={r * 0.45} fill={C.hide} />
  </g>
);

/** A thin rod running off the bottom of the screen: soft grey, just off the cloth. */
export const Rod: React.FC<{ from: Pt; to: Pt }> = ({ from, to }) => (
  <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={C.shaft} strokeWidth={E.rod.width} strokeOpacity={E.rod.opacity} strokeLinecap="round" style={{ filter: "blur(1.2px)", mixBlendMode: "multiply" }} />
);

/**
 * A puppet arriving: pressed onto the cloth from behind (scale 2.6 → 1, blur 34 → 0 px over 0.55 s, then sharp),
 * with a slow hand tremor once it's on (3 px / 0.018 rad).
 */
export const Press: React.FC<{ at: number; origin: Pt; children: React.ReactNode; seed?: number; tremor?: number }> = ({ at, origin, children, seed = 1, tremor = 1 }) => {
  const t = useSeconds();
  const p = easeFor("pressOn", t - at);
  if (p <= 0) return null;
  const k = 1 + (S.motion.pressScale - 1) * (1 - p);
  const blur = S.motion.pressBlur * (1 - p);
  const tr = S.motion.tremor;
  const nx = noise1(seed * 3);
  const ny = noise1(seed * 5 + 1);
  const nr = noise1(seed * 7 + 2);
  const tt = t * tr.hz;
  const dx = tr.px * nx(tt) * tremor;
  const dy = tr.px * ny(tt) * tremor;
  const rot = ((tr.rad * nr(tt) * 180) / Math.PI) * tremor;
  return (
    <g
      transform={`translate(${(origin[0] + dx).toFixed(2)} ${(origin[1] + dy).toFixed(2)}) rotate(${rot.toFixed(3)}) scale(${k.toFixed(4)}) translate(${-origin[0]} ${-origin[1]})`}
      opacity={Math.min(1, p * 1.6)}
      style={{ filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}
    >
      {children}
    </g>
  );
};

// ------------------------------------------------------------------ puppets and pieces

/** The sun: a flame-dye disc with hooked flame tongues, a coin hole at its heart, teardrops between the tongues. */
export const Sun: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const n = 14;
  const tongues: string[] = [];
  const tear: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const curl = i % 2 ? 1 : -1;
    const w = ((Math.PI * 2) / n) * 0.39;
    const p = (ang: number, rr: number): Pt => [x + Math.cos(ang) * rr, y + Math.sin(ang) * rr];
    const b0 = p(a - w, r - 4);
    const b1 = p(a + w, r - 4);
    const belly = p(a + curl * w * 0.4, r + 0.3 * r);
    const tip = p(a + curl * w * 1.1, r + 0.42 * r);
    tongues.push(`M ${b0[0]} ${b0[1]} Q ${p(a - w * 1.1, r + 0.2 * r)[0]} ${p(a - w * 1.1, r + 0.2 * r)[1]} ${belly[0]} ${belly[1]} Q ${tip[0]} ${tip[1]} ${tip[0]} ${tip[1]} Q ${p(a + w * 0.9, r + 0.18 * r)[0]} ${p(a + w * 0.9, r + 0.18 * r)[1]} ${b1[0]} ${b1[1]} Z`);
    const ta = a + Math.PI / n;
    const tc = p(ta, r * 0.8);
    tear.push(slit(tc[0], tc[1], r * 0.22, r * 0.06, (ta * 180) / Math.PI));
  }
  const cn = coin(x, y, r * 0.3);
  const disc = `M ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} Z`;
  const ring = circle(x, y, r * 0.55, 12).map(([cx, cy]) => `M ${cx + 6} ${cy} A 6 6 0 1 0 ${cx - 6} ${cy} A 6 6 0 1 0 ${cx + 6} ${cy} Z`);
  return <Hide d={`${disc} ${tongues.join(" ")}`} dye={C.flame} holes={`${cn.hole} ${tear.join(" ")} ${ring.join(" ")}`} keep={cn.keep} />;
};

/** A jointed figure in profile (facing right), looking up, one arm raised; open-cut face (a sympathetic figure). */
export const Figure: React.FC<{ x: number; y: number; s?: number; raise?: boolean }> = ({ x, y, s = 1, raise = true }) => {
  const P2 = (px: number, py: number): Pt => [x + px * s, y + py * s];
  const head: Pt = P2(10, -548);
  const headPts = rotatePts(
    blob([P2(-42, -548), P2(-30, -590), P2(10, -600), P2(44, -586), P2(56, -566), P2(76, -552), P2(60, -542), P2(64, -528), P2(52, -508), P2(22, -496), P2(-12, -500), P2(-38, -520)], 6),
    head,
    -16,
  );
  const faceHole = rotatePts(blob([P2(22, -578), P2(42, -566), P2(58, -552), P2(46, -544), P2(50, -530), P2(40, -514), P2(16, -508), P2(6, -540)], 5), head, -16);
  const eye = rotatePts(blob([P2(18, -560), P2(34, -566), P2(44, -560), P2(32, -555)], 4), head, -16);
  const hat = rotatePts([P2(-52, -578), P2(46, -604), P2(30, -622), P2(4, -716), P2(-8, -716), P2(-30, -628)], head, -16);
  const robe = blob([P2(-46, -470), P2(50, -470), P2(70, -300), P2(96, -60), P2(40, -44), P2(-20, -48), P2(-80, -60), P2(-62, -300)], 4);
  const collar: Pt[] = [P2(-44, -486), P2(48, -486), P2(52, -456), P2(-48, -456)];
  const boots = [pathOf([P2(-44, -60), P2(6, -60), P2(12, 0), P2(-46, 0), P2(-56, -14)]), pathOf([P2(24, -60), P2(64, -60), P2(70, -18), P2(104, -6), P2(100, 2), P2(26, 2)])];
  const shoulderF = P2(40, -450);
  const elbowF = raise ? P2(110, -520) : P2(70, -360);
  const handF = raise ? P2(150, -630) : P2(96, -270);
  const shoulderB = P2(-34, -450);
  const elbowB = P2(-70, -360);
  const handB = P2(-58, -270);
  const limb = (a: Pt, b: Pt, w0: number, w1: number): Pt[] => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [nx, ny] = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
    return [
      [a[0] + nx * w0 * s, a[1] + ny * w0 * s],
      [b[0] + nx * w1 * s, b[1] + ny * w1 * s],
      [b[0] - nx * w1 * s, b[1] - ny * w1 * s],
      [a[0] - nx * w0 * s, a[1] - ny * w0 * s],
    ];
  };
  const box = (pts: Pt[]) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] as const;
  };
  const [rx, ry, rw, rh] = box(robe);
  const [hx, hy, hw, hh] = box(hat);
  const sleeveF1 = limb(shoulderF, elbowF, 30, 24);
  const sleeveF2 = limb(elbowF, handF, 24, 30);
  const sleeveB1 = limb(shoulderB, elbowB, 30, 26);
  const sleeveB2 = limb(elbowB, handB, 26, 32);
  const lat = (pts: Pt[], step: number) => {
    const [a, b, c, d] = box(pts);
    return lattice(a, b, c, d, step * s);
  };
  return (
    <g>
      <Rod from={P2(-6, -470)} to={[x - 160 * s, SCREEN.y + SCREEN.h + 40]} />
      <Rod from={handF} to={[handF[0] + 120 * s, SCREEN.y + SCREEN.h + 40]} />
      <Hide d={pathOf(sleeveB1)} dye={C.ochre} holes={lat(sleeveB1, 18)} />
      <Hide d={pathOf(sleeveB2)} dye={C.ochre} holes={lat(sleeveB2, 18)} />
      <Hide d={`M ${handB[0] - 12 * s} ${handB[1]} a ${13 * s} ${13 * s} 0 1 0 ${26 * s} 0 a ${13 * s} ${13 * s} 0 1 0 ${-26 * s} 0`} dye={C.ink} />
      {boots.map((d, i) => (
        <Hide key={i} d={d} dye={C.ink} />
      ))}
      <Hide d={pathOf(robe)} dye={C.malachite} holes={crescents(rx + 18 * s, ry + 30 * s, rw - 36 * s, rh - 60 * s, 18 * s)} />
      <Hide d={pathOf(collar)} dye={C.vermilion} holes={lattice(collar[0][0] + 6, collar[0][1], 90 * s, 30 * s, 13 * s)} />
      <Hide d={pathOf(headPts)} dye={C.hide} holes={pathOf(faceHole)} keep={pathOf(eye)} />
      <Hide d={pathOf(hat)} dye={C.vermilion} holes={lattice(hx + 10, hy + 20, hw - 20, hh - 30, 16 * s)} />
      <Hide d={pathOf(sleeveF1)} dye={C.ochre} holes={lat(sleeveF1, 18)} />
      <Hide d={pathOf(sleeveF2)} dye={C.ochre} holes={lat(sleeveF2, 18)} />
      <Hide d={`M ${handF[0] - 12 * s} ${handF[1]} a ${13 * s} ${13 * s} 0 1 0 ${26 * s} 0 a ${13 * s} ${13 * s} 0 1 0 ${-26 * s} 0`} dye={C.ink} />
      <Rivet x={shoulderF[0]} y={shoulderF[1]} />
      <Rivet x={elbowF[0]} y={elbowF[1]} />
      <Rivet x={shoulderB[0]} y={shoulderB[1]} />
      <Rivet x={elbowB[0]} y={elbowB[1]} />
      <Rivet x={P2(-4, -486)[0]} y={P2(-4, -486)[1]} r={6} />
    </g>
  );
};

/** A carved disc (an air molecule): indigo hide with a coin hole and a ring of diamonds. */
export const Disc: React.FC<{ x: number; y: number; r: number; dye?: string }> = ({ x, y, r, dye = C.indigo }) => {
  const cn = coin(x, y, r * 0.32);
  const ring = circle(x, y, r * 0.66, 10)
    .map(([cx, cy]) => `M ${cx} ${cy - 8} L ${cx + 8} ${cy} L ${cx} ${cy + 8} L ${cx - 8} ${cy} Z`)
    .join(" ");
  return <Hide d={`M ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} Z`} dye={dye} holes={`${cn.hole} ${ring}`} keep={cn.keep} />;
};

/** A carved strip (a beam, a shard, a bar): a tapered piece along a direction with slits down its length. */
export const Strip: React.FC<{ from: Pt; to: Pt; w0: number; w1: number; dye: string; slits?: number }> = ({ from, to, w0, w1, dye, slits = 4 }) => {
  const L = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const [ux, uy] = [(to[0] - from[0]) / L, (to[1] - from[1]) / L];
  const [nx, ny] = [-uy, ux];
  const pts: Pt[] = [
    [from[0] + nx * w0, from[1] + ny * w0],
    [to[0] + nx * w1, to[1] + ny * w1],
    [to[0] - nx * w1, to[1] - ny * w1],
    [from[0] - nx * w0, from[1] - ny * w0],
  ];
  const deg = (Math.atan2(uy, ux) * 180) / Math.PI;
  const holes = Array.from({ length: slits }, (_, i) => {
    const f = (i + 0.5) / slits;
    const w = w0 + (w1 - w0) * f;
    return slit(from[0] + ux * L * f, from[1] + uy * L * f, (L / slits) * 0.62, Math.max(2, w * 0.28), deg);
  }).join(" ");
  return <Hide d={pathOf(pts)} dye={dye} holes={holes} />;
};

/** The ground strip at the bottom of the scene: carved strata along a ridge. */
export const Ground: React.FC<{ y: number; dye?: string }> = ({ y, dye = C.gold }) => {
  const r = seeded(3);
  const top: Pt[] = Array.from({ length: 13 }, (_, i) => [SCREEN.x - 10 + (i / 12) * (SCREEN.w + 20), y - 14 * Math.sin(i * 1.3) - r() * 10] as Pt);
  const pts: Pt[] = [...top, [SCREEN.x + SCREEN.w + 10, y + 120], [SCREEN.x - 10, y + 120]];
  const strata = Array.from({ length: 9 }, (_, i) => slit(SCREEN.x + 70 + i * 105, y + 34 + (i % 2) * 22, 70, 4, (i % 3) * 4 - 4)).join(" ");
  return <Hide d={pathOf(pts)} dye={dye} holes={strata} />;
};

// ------------------------------------------------------------------ words

/** A plaque of dark hide with the words cut out (they glow), a vermilion meander border, malachite corner roundels, a seal. */
export const Plaque: React.FC<{ lines: string[]; x: number; y: number; w: number; size?: number; at: number; rods?: boolean }> = ({ lines, x, y, w, size = T.plaque, at, rods = true }) => {
  const id = useSvgId("spq");
  const b = E.plaque.border;
  const h = lines.length * size * T.leading + b * 2 + size * 0.55;
  const meander: string[] = [];
  const step = 26;
  for (let mx = x + b + 6; mx < x + w - b - step; mx += step) {
    for (const yy of [y + b * 0.18, y + h - b * 0.82]) meander.push(`M ${mx} ${yy + 16} V ${yy + 4} H ${mx + 16} V ${yy + 12} H ${mx + 8}`);
  }
  const roundel = (cx: number, cy: number) => {
    const rr = b * 0.95;
    return { d: `M ${cx + rr} ${cy} A ${rr} ${rr} 0 1 0 ${cx - rr} ${cy} A ${rr} ${rr} 0 1 0 ${cx + rr} ${cy} Z`, cut: `M ${cx} ${cy} m -2 0 a 4 4 0 1 1 6 3 a 8 8 0 1 1 -12 -6 a 12 12 0 1 1 18 9` };
  };
  const corners = [roundel(x, y), roundel(x + w, y), roundel(x, y + h), roundel(x + w, y + h)];
  return (
    <Press at={at} origin={[x + w / 2, y + h / 2]} seed={7} tremor={0.6}>
      {rods ? (
        <>
          <Rod from={[x + w * 0.22, y + h]} to={[x + w * 0.16, SCREEN.y + SCREEN.h + 40]} />
          <Rod from={[x + w * 0.78, y + h]} to={[x + w * 0.84, SCREEN.y + SCREEN.h + 40]} />
        </>
      ) : null}
      <g style={{ mixBlendMode: "multiply" }}>
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x={x - 50} y={y - 50} width={w + 100} height={h + 100}>
            <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} fill="#ffffff" />
            {lines.map((l, i) => (
              <text key={i} x={x + w / 2} y={y + b + size * 0.98 + i * size * T.leading} textAnchor="middle" fontFamily={PLAQUE} fontWeight={700} fontSize={size} letterSpacing={`${T.tracking}em`} fill="#000000">
                {l}
              </text>
            ))}
          </mask>
        </defs>
        <path d={`M ${x} ${y} h ${w} v ${h} h ${-w} Z M ${x + b} ${y + b} v ${h - 2 * b} h ${w - 2 * b} v ${-(h - 2 * b)} Z`} fill={C.vermilion} fillRule="evenodd" opacity={0.92} />
        <path d={meander.join(" ")} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.8} />
        <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} fill={C.ink} opacity={0.94} mask={`url(#${id})`} />
        <rect x={x} y={y} width={w} height={h} rx={E.plaque.radius} fill="none" stroke={C.ink} strokeWidth={E.outline + 1} />
        <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} fill="none" stroke={C.ink} strokeWidth={E.outline} />
      </g>
      {corners.map((c, i) => (
        <Hide key={i} d={c.d} dye={C.malachite} cuts={c.cut} />
      ))}
      <Hide d={`M ${x + w - b - 54} ${y + h - b - 54} h 40 v 40 h -40 Z`} dye={C.vermilion} cuts={`M ${x + w - b - 46} ${y + h - b - 40} h 24 M ${x + w - b - 34} ${y + h - b - 46} v 28 M ${x + w - b - 46} ${y + h - b - 24} h 24`} />
    </Press>
  );
};

/** The storyteller's placard: a narrow dark-lacquer board, a thin gold line, a small seal, cream text that slides up. */
export const Placard: React.FC<{ lines: string[]; at: number; y?: number }> = ({ lines, at, y }) => {
  const t = useSeconds();
  const p = easeFor("placard", t - at);
  if (p <= 0) return null;
  const pl = E.placard;
  const size = T.body;
  const h = Math.max(pl.height, lines.length * size * 1.18 + 36);
  const w = Math.min(SCREEN.w - 60, Math.max(...lines.map((l) => l.length)) * size * 0.46 + 150);
  const x = W / 2 - w / 2;
  const top = (y ?? SCREEN.y + SCREEN.h - 58 - h) + (1 - p) * pl.slide;
  return (
    <g opacity={p}>
      <defs>
        <linearGradient id="sp-placard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1f10" />
          <stop offset="1" stopColor={C.placard} />
        </linearGradient>
      </defs>
      <rect x={x} y={top} width={w} height={h} rx={8} fill="url(#sp-placard)" opacity={pl.opacity} />
      <rect x={x + 7} y={top + 7} width={w - 14} height={h - 14} rx={5} fill="none" stroke={C.gold} strokeWidth={1.6} opacity={0.8} />
      <rect x={x + 22} y={top + h / 2 - 20} width={40} height={40} rx={3} fill={C.vermilion} />
      <path d={`M ${x + 30} ${top + h / 2 - 8} h 24 M ${x + 30} ${top + h / 2 + 2} h 24 M ${x + 42} ${top + h / 2 - 14} v 28`} stroke={C.cream} strokeWidth={3} opacity={0.85} />
      {lines.map((l, i) => (
        <text key={i} x={W / 2 + 26} y={top + h / 2 + size * 0.34 + (i - (lines.length - 1) / 2) * size * 1.18} textAnchor="middle" fontFamily={PLACARD} fontWeight={600} fontSize={size} fill={C.cream}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** A small label placard (for diagrams). */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; anchor?: "start" | "middle" | "end" }> = ({ text, x, y, at, anchor = "middle" }) => {
  const t = useSeconds();
  const p = easeFor("placard", t - at);
  if (p <= 0) return null;
  const size = T.label;
  const w = text.length * size * 0.46 + 44;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g opacity={p} transform={`translate(0 ${(1 - p) * 12})`}>
      <rect x={x0} y={y - size * 0.95} width={w} height={size * 1.45} rx={6} fill={C.placard} opacity={0.9} />
      <rect x={x0 + 4} y={y - size * 0.95 + 4} width={w - 8} height={size * 1.45 - 8} rx={4} fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.7} />
      <text x={x0 + w / 2} y={y + size * 0.05} textAnchor="middle" fontFamily={PLACARD} fontWeight={600} fontSize={size} fill={C.cream}>
        {text}
      </text>
    </g>
  );
};

// ------------------------------------------------------------------ the stage

/** The lacquer frame: a carved lintel with gold cloud curls, pillars, a bottom rail; audience heads below. */
const Frame: React.FC = () => {
  const s = SCREEN;
  const curl = (cx: number, cy: number, k: number) => `M ${cx} ${cy} m -4 0 a ${6 * k} ${6 * k} 0 1 1 ${9 * k} ${4 * k} a ${12 * k} ${12 * k} 0 1 1 ${-18 * k} ${-8 * k} a ${18 * k} ${18 * k} 0 1 1 ${27 * k} ${12 * k}`;
  // ruyi clouds: pairs of spirals curling towards each other, joined by a wave along the lintel
  const curls = Array.from({ length: 7 }, (_, i) => {
    const cx = 110 + i * 143;
    return `${curl(cx - 22, 92, 1.3)} M ${cx + 22} 92 m 4 0 a 7.8 7.8 0 1 0 -11.7 5.2 a 15.6 15.6 0 1 0 23.4 -10.4`;
  }).join(" ");
  const wave = `M 20 140 ${Array.from({ length: 14 }, (_, i) => `Q ${40 + i * 75} ${i % 2 ? 128 : 152} ${58 + i * 75 + 20} 140`).join(" ")}`;
  const heads = seeded(11);
  return (
    <g>
      <rect x={0} y={0} width={W} height={s.y} fill={C.lacquer} />
      <rect x={0} y={s.y - 26} width={W} height={26} fill={C.black} />
      <rect x={0} y={14} width={W} height={10} fill={C.black} />
      <path d={curls} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      <path d={curls} fill="none" stroke={C.black} strokeWidth={2} strokeLinecap="round" opacity={0.5} transform="translate(2 3)" />
      <path d={wave} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.7} />
      <rect x={0} y={s.y} width={s.x} height={s.h} fill={C.lacquer} />
      <rect x={s.x - 14} y={s.y} width={14} height={s.h} fill={C.black} />
      <rect x={s.x + s.w} y={s.y} width={W - s.x - s.w} height={s.h} fill={C.lacquer} />
      <rect x={s.x + s.w} y={s.y} width={14} height={s.h} fill={C.black} />
      <rect x={0} y={s.y + s.h} width={W} height={H - s.y - s.h} fill={C.black} />
      <rect x={0} y={s.y + s.h} width={W} height={22} fill={C.lacquer} />
      <g style={{ filter: "blur(10px)" }}>
        {Array.from({ length: 7 }, (_, i) => {
          const hx = 60 + i * 160 + heads() * 40;
          return <ellipse key={i} cx={hx} cy={H - 40 + heads() * 30} rx={66} ry={92} fill="#050302" />;
        })}
      </g>
    </g>
  );
};

/** The stage: the lit cloth (lamp lobe, hotspot, flicker, weave, warm vignette, bloom) with the puppets pressed onto it. */
export const Stage: React.FC<{ children: React.ReactNode; over?: React.ReactNode; lamp?: Pt; lamps?: number }> = ({ children, over, lamp = [540, 760], lamps = 1 }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fl = S.motion.flicker;
  const fn = noise1(17);
  const flick = 1 + fl.amount * (0.8 * fn(t * fl.hz) + 0.2 * Math.sin(t * fl.fast * Math.PI * 2));
  const s = SCREEN;
  const exposure = clamp((E.lamp.exposure / Math.sqrt(lamps)) * 0.55 * lamps);
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="sp-lobe" gradientUnits="userSpaceOnUse" cx={lamp[0]} cy={lamp[1]} r={E.lamp.lobe * 1.25}>
            <stop offset="0" stopColor={C.cloth} />
            <stop offset="0.45" stopColor="#d69248" />
            <stop offset="1" stopColor="#6a3814" />
          </radialGradient>
          <radialGradient id="sp-hot" gradientUnits="userSpaceOnUse" cx={lamp[0]} cy={lamp[1]} r={E.lamp.hot * 2.6}>
            <stop offset="0" stopColor="#fff0d2" stopOpacity={0.85} />
            <stop offset="1" stopColor={C.bloom} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="sp-vig" cx="50%" cy="45%" r="70%">
            <stop offset="0.55" stopColor={C.vig} stopOpacity={0} />
            <stop offset="1" stopColor={C.vig} stopOpacity={S.finish.warmVignette} />
          </radialGradient>
          <pattern id="sp-weave" width={4} height={4} patternUnits="userSpaceOnUse">
            <rect width={4} height={2} fill="#000" opacity={0.05} />
            <rect width={2} height={4} fill="#000" opacity={0.04} />
          </pattern>
          <filter id="sp-blot" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={6} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 1.6 -0.6" />
          </filter>
          <clipPath id="sp-screen">
            <rect x={s.x} y={s.y} width={s.w} height={s.h} />
          </clipPath>
        </defs>
        <g clipPath="url(#sp-screen)">
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#sp-lobe)" opacity={Math.min(1, exposure * flick)} />
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#sp-hot)" opacity={0.75 * flick} />
          <rect x={s.x} y={s.y} width={s.w} height={s.h} filter="url(#sp-blot)" style={{ mixBlendMode: "multiply" }} opacity={0.22} />
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#sp-weave)" />
          {children}
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#sp-hot)" opacity={0.28 * flick} style={{ mixBlendMode: "screen" }} />
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="url(#sp-vig)" style={{ mixBlendMode: "multiply" }} />
        </g>
        <Frame />
        {over}
      </svg>
      <Finish grain={S.finish.grain} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export { PLAQUE };
