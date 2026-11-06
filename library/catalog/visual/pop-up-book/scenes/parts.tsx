/**
 * Pop-up Book's pieces: the walnut desk under a lamp (procedural grain, out of focus), the open book (cover cloth, page
 * block, a standing sky board, the ground page receding to the spine), cut-paper pieces (ink-brown outlines, a hard
 * shade crescent, a thick off-white border over a grey card edge, a cut-out shadow) hinged on the page and popping up
 * with a back-ease, signs on strings, speech bubbles, ribbons, tags and outlined cream subtitles. Every value comes
 * from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, SERIF } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const B = style.layout.book;
const P = style.palette;
export const col = (role: string) => color(P, role);
export const C = {
  desk: col("background"),
  page: col("surface"),
  cream: col("text"),
  ink: col("ink"),
  bubbleText: col("muted"),
  edge: col("faint"),
  red: col("accent"),
  blue: col("accent2"),
  border: col("border"),
  card: col("card"),
  grass: col("grass"),
  grassFar: col("grass-far"),
  path: col("path"),
  sky: col("sky"),
  skyLow: col("sky-low"),
  night: col("night"),
  nightLow: col("night-low"),
  sea1: col("sea-1"),
  sea3: col("sea-3"),
  skin: col("skin"),
  skinShade: col("skin-shade"),
  tunic: col("tunic"),
  tunicShade: col("tunic-shade"),
  wood: col("boots"),
  sun: col("sun"),
  gold: col("gold"),
  ribbon: col("ribbon"),
  cloth: col("cloth"),
  foil: col("foil"),
  forest: col("forest"),
  cheek: col("cheek"),
  orange: col("orange"),
  violet: col("violet"),
  wall: col("wall"),
  hill1: col("hill-1"),
  hill2: col("hill-2"),
  hill3: col("hill-3"),
  hillShade: col("hill-shade"),
};
export const SPECTRUM = [C.red, C.orange, C.sun, C.grass, C.blue, C.violet];

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** The source's back(): 1 + u²((s+1)u + s), u = p − 1. */
export const back = (p: number, s: number): number => {
  const u = clamp(p) - 1;
  return 1 + u * u * ((s + 1) * u + s);
};
export const popupK = (t: number): number => (t <= 0 ? 0 : back(t / R.popup.duration, R.popup.overshoot));
export const popK = (t: number): number => (t <= 0 ? 0 : back(t / R.pop.duration, R.pop.overshoot));
/** Things on strings: 1 − e^(−z·k·t)·cos(k·√(1−z²)·t·1.6). */
export const stringK = (t: number): number => {
  if (t <= 0) return 0;
  const { k, z } = R.string;
  return 1 - Math.exp(-z * k * t) * Math.cos(k * Math.sqrt(1 - z * z) * t * 1.6);
};
/** Rise-time delay of a pop-up piece at page depth z (0 at the spine, 1 at the reader): (0.3 − d) × 1.2 s. */
export const depthDelay = (z: number): number => (S.motion.pageDepth - z * S.motion.pageDepth) * S.motion.depthDelay;

const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** A wobbly ellipse from three harmonics: never perfect geometry. */
export const blob = (cx: number, cy: number, rx: number, ry: number, seed = 1, n = 56): string => {
  const [a1, a2, a3] = E.wobble;
  const p1 = rnd(seed, 1) * 6.28;
  const p2 = rnd(seed, 2) * 6.28;
  const p3 = rnd(seed, 3) * 6.28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + a1 * Math.sin(3 * a + p1) + a2 * Math.sin(5 * a + p2) + a3 * Math.sin(7 * a + p3);
    return `${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`;
  });
  return `M ${pts.join(" L ")} Z`;
};
/** A polygon with its corners nudged a little (hand-cut). */
export const wob = (pts: [number, number][], seed = 1, amp = 3): string =>
  `M ${pts.map(([x, y], i) => `${(x + (rnd(i, seed) - 0.5) * 2 * amp).toFixed(1)} ${(y + (rnd(i, seed + 5) - 0.5) * 2 * amp).toFixed(1)}`).join(" L ")} Z`;

const inkS = (w: number = E.outline) => ({ stroke: C.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });

/** A shape with one hard shade crescent: filled with the shade, refilled shifted toward the lamp with the base. */
export const Shaded: React.FC<{ id: string; d: string; base: string; shade: string; shift?: [number, number]; line?: number }> = ({ id, d, base, shade, shift = [-9, -7], line = E.outline }) => (
  <g>
    <clipPath id={id}>
      <path d={d} />
    </clipPath>
    <path d={d} fill={shade} />
    <g clipPath={`url(#${id})`}>
      <path d={d} fill={base} transform={`translate(${shift[0]} ${shift[1]})`} />
    </g>
    <path d={d} fill="none" {...inkS(line)} />
  </g>
);

// ---------------------------------------------------------------- the desk and the book

/** The walnut desk under the book: procedural grain, out of focus, a warm lamp pool. Waits for the fonts. */
export const Desk: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFontsReady(FACES);
  const [lx, ly] = E.lamp;
  return (
    <AbsoluteFill style={{ backgroundColor: C.desk, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${E.deskBlur}px)` }}>
        <svg width={W} height={H}>
          <defs>
            <filter id="pb-wood" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.05" numOctaves={3} seed={7} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.12  0 0 0 0 0.07  1.7 0 0 0 -0.62" />
            </filter>
          </defs>
          <rect width={W} height={H} fill={C.desk} />
          <rect width={W} height={H} filter="url(#pb-wood)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at ${lx * 100}% ${ly * 100}%, rgba(255,220,160,0.42) 0%, rgba(255,200,140,0.12) 45%, rgba(20,10,5,0.35) 100%)` }} />
      {children}
      <AbsoluteFill style={{ backgroundColor: `rgb(${S.finish.warmth.map((v) => Math.round(255 * Math.min(1, v))).join(",")})`, mixBlendMode: "multiply", opacity: 0.5, pointerEvents: "none" }} />
      <Grain />
      <Finish grain={0} vignette={S.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The shared paper grain, multiplied over everything (static, like the paper itself). */
const Grain: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply", opacity: 1 }}>
    <filter id="pb-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} />
      <feColorMatrix type="matrix" values={`0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 ${E.grain * 6} ${-E.grain * 2}`} />
    </filter>
    <rect width={W} height={H} filter="url(#pb-grain)" />
  </svg>
);

/** A point on the ground page: u across (0..1), z from the spine (0) to the reader (1) → screen x, y and scale. */
export const gp = (u: number, z: number): { x: number; y: number; s: number } => {
  const l = lerp(B.far[0], B.nearX[0], z);
  const r = lerp(B.far[1], B.nearX[1], z);
  return { x: l + u * (r - l), y: lerp(B.spine, B.near, z), s: (r - l) / (B.far[1] - B.far[0]) };
};

/** The open book: cover cloth and page block, the standing sky board (day or night), the ground page and the gutter. */
export const Spread: React.FC<{ night?: number; board?: React.ReactNode; children?: React.ReactNode }> = ({ night = 0, board, children }) => {
  const [fl, fr] = B.far;
  const [nl, nr] = B.nearX;
  const top = B.board;
  const sky = (k: number) => `linear-gradient(to bottom, ${k > 0.5 ? C.night : C.sky}, ${k > 0.5 ? C.nightLow : C.skyLow})`;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="pb-ground" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={C.grassFar} />
            <stop offset="100%" stopColor={C.grass} />
          </linearGradient>
          <linearGradient id="pb-gutter" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(40,25,15,0.45)" />
            <stop offset="100%" stopColor="rgba(40,25,15,0)" />
          </linearGradient>
          <linearGradient id="pb-gutter-up" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="rgba(40,25,15,0.4)" />
            <stop offset="100%" stopColor="rgba(40,25,15,0)" />
          </linearGradient>
        </defs>
        {/* soft contact shadow of the book on the desk */}
        <ellipse cx={W / 2} cy={B.near + 40} rx={560} ry={60} fill="rgba(20,10,5,0.45)" style={{ filter: "blur(18px)" }} />
        {/* cover cloth under the page block */}
        <polygon points={`${fl - 22},${B.spine} ${fr + 22},${B.spine} ${nr + 26},${B.near + 34} ${nl - 26},${B.near + 34}`} fill={C.cloth} />
        {/* page block edge at the reader's side */}
        <polygon points={`${nl},${B.near} ${nr},${B.near} ${nr + 8},${B.near + 26} ${nl - 8},${B.near + 26}`} fill={C.page} />
        {[6, 12, 18].map((d) => (
          <line key={d} x1={nl - d * 0.3} y1={B.near + d} x2={nr + d * 0.3} y2={B.near + d} stroke="#d8ccb2" strokeWidth={1.5} />
        ))}
        {/* the standing sky board: its page edge on top, cloth behind */}
        <rect x={fl - 18} y={top - 22} width={fr - fl + 36} height={B.spine - top + 22} fill={C.cloth} />
        <rect x={fl - 6} y={top - 12} width={fr - fl + 12} height={14} fill={C.page} />
      </svg>
      <div style={{ position: "absolute", left: fl, top, width: fr - fl, height: B.spine - top, background: sky(night), overflow: "hidden" }}>
        <svg width={fr - fl} height={B.spine - top} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(${-fl} ${-top})`}>{board}</g>
        </svg>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={fl} y={B.spine - 90} width={fr - fl} height={90} fill="url(#pb-gutter-up)" />
        <polygon points={`${fl},${B.spine} ${fr},${B.spine} ${nr},${B.near} ${nl},${B.near}`} fill={night > 0.5 ? mixHex(C.grass, C.night, 0.55) : "url(#pb-ground)"} />
        <path
          d={`M ${gp(0.42, 0).x} ${B.spine} C ${gp(0.5, 0.3).x} ${gp(0.5, 0.3).y}, ${gp(0.3, 0.6).x} ${gp(0.3, 0.6).y}, ${gp(0.4, 1).x - 60} ${B.near} L ${gp(0.6, 1).x + 20} ${B.near} C ${gp(0.45, 0.6).x + 50} ${gp(0.45, 0.6).y}, ${gp(0.62, 0.3).x} ${gp(0.62, 0.3).y}, ${gp(0.5, 0).x} ${B.spine} Z`}
          fill={night > 0.5 ? mixHex(C.path, C.night, 0.5) : C.path}
        />
        <rect x={fl} y={B.spine} width={fr - fl} height={70} fill="url(#pb-gutter)" />
        <line x1={fl} y1={B.spine} x2={fr} y2={B.spine} stroke="rgba(40,25,15,0.5)" strokeWidth={3} />
        {children}
      </svg>
    </>
  );
};

export const mixHex = (a: string, b: string, k: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

// ---------------------------------------------------------------- cut-paper pieces

export type Art = { sil: string[]; art: React.ReactNode };

/**
 * A cut-paper piece hinged on the ground page at (u, z): its cut-out shadow on the page, a grey card edge, an
 * off-white border, then the art. `k` is the pop-up (0 lying flat → 1 standing, overshooting on the back-ease).
 */
export const Piece: React.FC<{ u: number; z: number; k: number; art: Art; scale?: number; shadow?: boolean }> = ({ u, z, k, art, scale = 1, shadow = true }) => {
  if (k <= 0.001) return null;
  const g = gp(u, z);
  const stand = 0.06 + 0.94 * Math.sin(clamp(k * 1.0, 0, 1.25) * (Math.PI / 2));
  const sh = E.shadow;
  return (
    <g transform={`translate(${g.x} ${g.y}) scale(${g.s * scale})`}>
      {shadow ? (
        <g transform={`skewX(${sh.skew}) scale(1 ${-sh.flatten * stand})`} opacity={sh.alpha} style={{ filter: `blur(${sh.blur}px)` }}>
          {art.sil.map((d, i) => (
            <path key={i} d={d} fill="#2a1a10" />
          ))}
        </g>
      ) : null}
      <g transform={`scale(1 ${stand})`}>
        <g transform={`translate(0 ${E.edgeDrop})`}>
          {art.sil.map((d, i) => (
            <path key={i} d={d} fill={C.edge} stroke={C.edge} strokeWidth={2 * (E.border + E.edge)} strokeLinejoin="round" />
          ))}
        </g>
        {art.sil.map((d, i) => (
          <path key={i} d={d} fill={C.border} stroke={C.border} strokeWidth={2 * E.border} strokeLinejoin="round" />
        ))}
        {art.art}
      </g>
    </g>
  );
};

/** Paper on the sky board (flat, no hinge): a border and card edge around the art. */
export const Flat: React.FC<{ x: number; y: number; k?: number; art: Art; scale?: number }> = ({ x, y, k = 1, art, scale = 1 }) => {
  if (k <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * k})`}>
      <g transform={`translate(0 ${E.edgeDrop + 3})`}>
        {art.sil.map((d, i) => (
          <path key={i} d={d} fill="rgba(40,25,15,0.3)" stroke="rgba(40,25,15,0.3)" strokeWidth={2 * (E.border + E.edge) + 4} strokeLinejoin="round" />
        ))}
      </g>
      {art.sil.map((d, i) => (
        <path key={i} d={d} fill={C.border} stroke={C.border} strokeWidth={2 * E.border} strokeLinejoin="round" />
      ))}
      {art.art}
    </g>
  );
};

const face = (cx: number, cy: number, s = 1, open = false) => (
  <g>
    {[-1, 1].map((d) => (
      <g key={d}>
        <ellipse cx={cx + d * 22 * s} cy={cy} rx={9 * s} ry={14 * s} fill={C.ink} />
        <circle cx={cx + d * 22 * s - 3 * s} cy={cy - 6 * s} r={3.4 * s} fill="#ffffff" />
        <circle cx={cx + d * 22 * s + 3 * s} cy={cy + 4 * s} r={1.8 * s} fill="#ffffff" />
        <ellipse cx={cx + d * 40 * s} cy={cy + 18 * s} rx={10 * s} ry={6 * s} fill={C.cheek} />
      </g>
    ))}
    {open ? (
      <path d={`M ${cx - 12 * s} ${cy + 22 * s} Q ${cx} ${cy + 44 * s} ${cx + 12 * s} ${cy + 22 * s} Z`} fill={C.red} {...inkS(E.detail * s)} />
    ) : (
      <path d={`M ${cx - 12 * s} ${cy + 24 * s} Q ${cx} ${cy + 36 * s} ${cx + 12 * s} ${cy + 24 * s}`} fill="none" {...inkS(E.detail * s)} />
    )}
  </g>
);

/** The reader-kid (invented): yellow beanie with a pompom, blue jacket, big oval eyes, pink cheeks; can point up. */
export const kid = (id: string, point = false): Art => {
  const head = blob(0, -210, 62, 60, 11);
  const body = wob([[-46, -150], [46, -150], [60, -40], [-60, -40]], 3);
  const beanie = `M -64 -222 Q -60 -292 0 -294 Q 60 -292 64 -222 Q 0 -238 -64 -222 Z`;
  const pom = blob(0, -300, 18, 17, 4);
  const legs = [wob([[-40, -44], [-12, -44], [-12, 0], [-44, 0]], 7), wob([[12, -44], [40, -44], [44, 0], [12, 0]], 8)];
  const armL = wob([[-46, -140], [-30, -130], [-62, -62], [-80, -70]], 9);
  const armR = point ? wob([[36, -146], [52, -132], [96, -236], [76, -246]], 10) : wob([[46, -140], [30, -130], [62, -62], [80, -70]], 12);
  const handR = point ? blob(88, -252, 17, 17, 13) : blob(76, -60, 15, 15, 14);
  const handL = blob(-76, -60, 15, 15, 15);
  return {
    sil: [head, body, beanie, pom, ...legs, armL, armR, handR, handL],
    art: (
      <g>
        {legs.map((d, i) => (
          <path key={i} d={d} fill={C.wood} {...inkS()} />
        ))}
        <Shaded id={`${id}-armL`} d={armL} base={C.tunic} shade={C.tunicShade} />
        <Shaded id={`${id}-armR`} d={armR} base={C.tunic} shade={C.tunicShade} />
        <Shaded id={`${id}-body`} d={body} base={C.tunic} shade={C.tunicShade} />
        <path d={handL} fill={C.skin} {...inkS()} />
        <path d={handR} fill={C.skin} {...inkS()} />
        <Shaded id={`${id}-head`} d={head} base={C.skin} shade={C.skinShade} />
        {face(0, -206)}
        <Shaded id={`${id}-beanie`} d={beanie} base={C.gold} shade={mixHex(C.gold, C.wood, 0.3)} />
        <path d={pom} fill={C.border} {...inkS()} />
      </g>
    ),
  };
};

/** The sun on a stick, with a face and paper rays. */
export const sunArt = (id: string, stick = 260): Art => {
  const disc = blob(0, -stick - 80, 74, 72, 21);
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    const r0 = 80;
    const r1 = 122;
    const cx = 0;
    const cy = -stick - 80;
    return wob(
      [
        [cx + r0 * Math.cos(a - 0.16), cy + r0 * Math.sin(a - 0.16)],
        [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)],
        [cx + r0 * Math.cos(a + 0.16), cy + r0 * Math.sin(a + 0.16)],
      ],
      30 + i,
      2,
    );
  });
  const stickD = `M -8 0 L 8 0 L 8 ${-stick} L -8 ${-stick} Z`;
  return {
    sil: [stickD, disc, ...rays],
    art: (
      <g>
        <path d={stickD} fill={C.wood} {...inkS(E.detail)} />
        {rays.map((d, i) => (
          <path key={i} d={d} fill={C.orange} {...inkS(E.detail)} />
        ))}
        <Shaded id={`${id}-disc`} d={disc} base={C.sun} shade={mixHex(C.sun, C.orange, 0.5)} />
        {face(0, -stick - 84, 1.05)}
      </g>
    ),
  };
};

/** The air molecule (invented): a round sea-blue paper creature on a stick. */
export const moleculeArt = (id: string, stick = 200, open = true): Art => {
  const body = blob(0, -stick - 70, 72, 66, 41);
  const stickD = `M -7 0 L 7 0 L 7 ${-stick} L -7 ${-stick} Z`;
  return {
    sil: [stickD, body],
    art: (
      <g>
        <path d={stickD} fill={C.wood} {...inkS(E.detail)} />
        <Shaded id={`${id}-body`} d={body} base={C.sea1} shade={C.sea3} />
        {face(0, -stick - 76, 1, open)}
      </g>
    ),
  };
};

/** A blue paper dart (scattered blue light), pointing along angle a. */
export const dartArt = (a: number, len = 70, seed = 1): Art => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pts: [number, number][] = [
    [-len / 2, -9],
    [len / 4, -9],
    [len / 4, -20],
    [len / 2, 0],
    [len / 4, 20],
    [len / 4, 9],
    [-len / 2, 9],
  ];
  const d = wob(
    pts.map(([x, y]) => [x * c - y * s, x * s + y * c] as [number, number]),
    seed,
    1.5,
  );
  return { sil: [d], art: <path d={d} fill={C.blue} {...inkS(E.detail)} /> };
};

/** A pop-up hill. */
export const hillArt = (id: string, w: number, h: number, base: string, seed: number): Art => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const x = -w / 2 + (i / 24) * w;
    const y = -h * Math.sin((i / 24) * Math.PI) * (0.85 + 0.15 * Math.sin(i * 1.3 + seed));
    pts.push([x, y]);
  }
  const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
  return { sil: [d], art: <Shaded id={id} d={d} base={base} shade={C.hillShade} shift={[-14, -12]} /> };
};

/** A little house: cream wall, red roof (the recurring accent), a door and a window. */
export const houseArt = (id: string): Art => {
  const wall = wob([[-70, -120], [70, -120], [70, 0], [-70, 0]], 51);
  const roof = wob([[-92, -112], [0, -200], [92, -112]], 52);
  const door = wob([[-16, -62], [16, -62], [16, 0], [-16, 0]], 53, 1.5);
  const win = wob([[30, -92], [56, -92], [56, -66], [30, -66]], 54, 1.5);
  return {
    sil: [wall, roof],
    art: (
      <g>
        <Shaded id={`${id}-wall`} d={wall} base={C.wall} shade={mixHex(C.wall, C.wood, 0.25)} />
        <Shaded id={`${id}-roof`} d={roof} base={C.red} shade={mixHex(C.red, C.ink, 0.3)} />
        <path d={door} fill={col("boots")} {...inkS(E.detail)} />
        <path d={win} fill={C.sea1} {...inkS(E.detail)} />
      </g>
    ),
  };
};

/** A round paper tree. */
export const treeArt = (id: string, seed: number): Art => {
  const trunk = wob([[-10, -70], [10, -70], [12, 0], [-12, 0]], seed, 1.5);
  const crown = blob(0, -120, 58, 64, seed + 2);
  return {
    sil: [trunk, crown],
    art: (
      <g>
        <path d={trunk} fill={C.wood} {...inkS()} />
        <Shaded id={`${id}-crown`} d={crown} base={C.forest} shade={mixHex(C.forest, C.ink, 0.3)} />
      </g>
    ),
  };
};

/** A paper cloud for the sky board. */
export const cloudArt = (seed: number): Art => {
  const d = `${blob(-40, 0, 46, 32, seed)} ${blob(10, -18, 52, 40, seed + 1)} ${blob(56, 4, 40, 28, seed + 2)}`;
  // the outline goes under the fill, so the three puffs read as one cut shape
  return {
    sil: [d],
    art: (
      <g>
        <path d={d} fill="#ffffff" stroke={C.ink} strokeWidth={E.detail * 2} strokeLinejoin="round" />
        <path d={d} fill="#ffffff" />
      </g>
    ),
  };
};

/** A paper rainbow: six arched bands. */
export const rainbowArt = (id: string): Art => {
  const bands = SPECTRUM.map((c, i) => {
    const r0 = 250 - i * 30;
    const r1 = r0 - 30;
    const arc = (r: number, sweep: number) => `A ${r} ${r} 0 0 ${sweep}`;
    const d = `M ${-r0} 0 ${arc(r0, 1)} ${r0} 0 L ${r1} 0 ${arc(r1, 0)} ${-r1} 0 Z`;
    return { d, c };
  });
  const outer = `M -250 0 A 250 250 0 0 1 250 0 L 70 0 A 70 70 0 0 0 -70 0 Z`;
  return {
    sil: [outer],
    art: (
      <g>
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.c} stroke={C.ink} strokeWidth={3} />
        ))}
        <path d={outer} fill="none" {...inkS()} />
        <g id={id} />
      </g>
    ),
  };
};

/** A paper column for charts: a front face, a lighter top and a shade strip. */
export const columnArt = (id: string, h: number, base: string): Art => {
  const front = wob([[-50, -h], [50, -h], [50, 0], [-50, 0]], h, 1.5);
  return { sil: [front], art: <Shaded id={id} d={front} base={base} shade={mixHex(base, C.ink, 0.3)} shift={[-12, 0]} /> };
};

// ---------------------------------------------------------------- type

/** A subtitle: Fredoka 500, cream, an 8 px dark-brown outline under the fill and a soft shadow. */
export const Subtitle: React.FC<{ lines: string[]; y?: number; at?: number; size?: number }> = ({ lines, y = style.layout.subtitleY, at = 0, size = style.type.body }) => {
  const p = ease("sub", useSeconds() - at);
  if (p <= 0) return null;
  const T = style.type;
  const layer = (stroke: boolean) => (
    <div style={{ position: stroke ? "absolute" : "relative", left: 0, right: 0, top: 0, textAlign: "center", fontFamily: BODY, fontWeight: 500, fontSize: size, lineHeight: T.bodyLeading, color: stroke ? C.ink : C.cream, WebkitTextStroke: stroke ? `${T.outline * 2}px ${C.ink}` : undefined }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, opacity: p, filter: "drop-shadow(0 4px 6px rgba(30,15,5,0.5))" }}>
      {layer(true)}
      {layer(false)}
    </div>
  );
};

/** A speech bubble: white card (radius 44), 6 px ink outline, a soft shadow, a tail to the speaker, typed text and a bobbing red ▼. */
export const Bubble: React.FC<{ text: string; x: number; y: number; w: number; tail: [number, number]; at: number }> = ({ text, x, y, w, tail, at }) => {
  const t = useSeconds() - at;
  const k = popK(t);
  if (k <= 0) return null;
  const T = style.type;
  const n = Math.floor(clamp((t - 0.15) * T.bubbleCps, 0, text.length));
  const lines = Math.ceil((text.length * T.bubble * 0.5) / (w - 64));
  const h = lines * T.bubble * 1.15 + 56;
  const bob = Math.sin(t * 6) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `scale(${k})`, transformOrigin: `${tail[0] - x}px ${tail[1] - y}px` }}>
      <svg width={W} height={H} style={{ position: "absolute", left: -x, top: -y, overflow: "visible" }}>
        <path d={`M ${x + w * 0.3} ${y + h - 4} L ${tail[0]} ${tail[1]} L ${x + w * 0.45} ${y + h - 4} Z`} fill="#ffffff" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, background: "#ffffff", border: `6px solid ${C.ink}`, boxShadow: "0 8px 16px rgba(30,15,5,0.35)" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: -x, top: -y, overflow: "visible" }}>
        <path d={`M ${x + w * 0.3 + 6} ${y + h - 9} L ${x + w * 0.45 - 6} ${y + h - 9}`} stroke="#ffffff" strokeWidth={8} />
      </svg>
      <div style={{ position: "absolute", left: 32, right: 32, top: 26, fontFamily: BODY, fontWeight: 600, fontSize: T.bubble, lineHeight: 1.15, color: C.bubbleText }}>
        <span>{text.slice(0, n)}</span>
        <span style={{ color: "transparent" }}>{text.slice(n)}</span>
      </div>
      {n >= text.length ? <div style={{ position: "absolute", right: 34, bottom: 14 + bob, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: `16px solid ${C.ribbon}` }} /> : null}
    </div>
  );
};

/** A gold sign on two strings that drops in and swings to rest (spring k = 7, z = 0.35). Lilita One with a 12 px ink stroke. */
export const Sign: React.FC<{ lines: string[]; y: number; at: number; size?: number; w: number; serif?: boolean }> = ({ lines, y, at, size = style.type.display, w }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const k = stringK(t);
  const drop = (1 - k) * -(y + 300);
  const swing = 5 * Math.exp(-R.string.z * R.string.k * t) * Math.sin(R.string.k * t * 1.2);
  const T = style.type;
  const h = lines.length * size * T.leading + 64;
  const x = (W - w) / 2;
  const text = (stroke: boolean) => (
    <div style={{ position: stroke ? "absolute" : "relative", left: 0, right: 0, top: 0, textAlign: "center", fontFamily: DISPLAY, fontSize: size, lineHeight: T.leading, color: stroke ? C.ink : C.gold, WebkitTextStroke: stroke ? `${T.signStroke}px ${C.ink}` : undefined }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y + drop, width: w, height: h, transform: `rotate(${swing}deg)`, transformOrigin: "50% -400px" }}>
      <svg width={w} height={600} style={{ position: "absolute", left: 0, top: -600, overflow: "visible" }}>
        <line x1={w * 0.18} y1={0} x2={w * 0.18} y2={600} stroke={C.ink} strokeWidth={3} />
        <line x1={w * 0.82} y1={0} x2={w * 0.82} y2={600} stroke={C.ink} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", inset: -14, borderRadius: 26, background: C.border, boxShadow: `0 3px 0 ${C.edge}, 0 10px 18px rgba(30,15,5,0.4)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.cloth, border: `${E.outline}px solid ${C.ink}` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 30 }}>
        {text(true)}
        {text(false)}
      </div>
    </div>
  );
};

/** A red ribbon banner with notched ends and cream text (chapter ribbon). */
export const Ribbon: React.FC<{ text: string; y: number; at: number; w?: number; size?: number; serif?: boolean }> = ({ text, y, at, w = 620, size = style.type.label + 6, serif = false }) => {
  const k = popK(useSeconds() - at);
  if (k <= 0) return null;
  const h = size * 1.7;
  const x = (W - w) / 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `scale(${k})` }}>
      <svg width={w + 120} height={h + 30} style={{ position: "absolute", left: -60, top: 0, overflow: "visible" }}>
        <polygon points={`0,16 60,16 60,${h + 16} 0,${h + 16} 22,${h / 2 + 16}`} fill={mixHex(C.ribbon, C.ink, 0.25)} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <polygon points={`${w + 120},16 ${w + 60},16 ${w + 60},${h + 16} ${w + 120},${h + 16} ${w + 98},${h / 2 + 16}`} fill={mixHex(C.ribbon, C.ink, 0.25)} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <rect x={40} y={0} width={w + 40} height={h} fill={C.ribbon} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.2, textAlign: "center", fontFamily: serif ? SERIF : DISPLAY, fontStyle: serif ? "italic" : "normal", fontSize: size, lineHeight: 1, color: C.cream, letterSpacing: serif ? 0 : 1 }}>{text}</div>
    </div>
  );
};

/** A white paper tag with an ink outline (labels on the board). */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; num?: number; size?: number; align?: "left" | "center" }> = ({ text, x, y, at, num, size = style.type.label, align = "left" }) => {
  const k = popK(useSeconds() - at);
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `${align === "center" ? "translateX(-50%) " : ""}scale(${k})`,
        transformOrigin: "0 50%",
        padding: "10px 24px 10px 18px",
        borderRadius: 16,
        background: "#ffffff",
        border: `5px solid ${C.ink}`,
        boxShadow: `0 0 0 10px ${C.border}, 0 3px 0 10px ${C.edge}, 0 10px 16px 10px rgba(30,15,5,0.3)`,
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: size,
        color: C.ink,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {num ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size * 1.2, height: size * 1.2, borderRadius: "50%", background: C.ribbon, color: C.cream, fontFamily: DISPLAY, fontSize: size * 0.8 }}>{num}</span> : null}
      {text}
    </div>
  );
};

/** The closed book (the cover is the title): cloth, a page block, gold-foil Lilita One with a sheen. */
export const Cover: React.FC<{ lines: string[]; kicker: string; at: number }> = ({ lines, kicker, at }) => {
  const t = useSeconds() - at;
  const sheen = clamp((t - 0.6) / 1.4);
  const x = 130;
  const y = 330;
  const w = 820;
  const h = 1120;
  const foil = `linear-gradient(110deg, ${C.foil} ${sheen * 120 - 30}%, #fff0c0 ${sheen * 120 - 15}%, ${C.foil} ${sheen * 120}%)`;
  return (
    <>
      <div style={{ position: "absolute", left: x + 30, top: y + 40, width: w, height: h, borderRadius: 14, background: "rgba(20,10,5,0.5)", filter: "blur(22px)" }} />
      <div style={{ position: "absolute", left: x + 18, top: y + 10, width: w, height: h, borderRadius: 10, background: C.page, boxShadow: "inset -2px 0 0 #d8ccb2, inset 0 -2px 0 #d8ccb2" }} />
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, background: C.cloth, boxShadow: "inset 26px 0 0 rgba(0,0,0,0.18), inset 30px 0 0 rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", left: x + 70, top: y + 60, width: w - 120, height: h - 120, borderRadius: 8, border: `4px solid ${C.foil}`, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: x + 40, right: W - x - w, top: y + 210, textAlign: "center", fontFamily: DISPLAY, fontSize: style.type.title, lineHeight: style.type.leading }}>
        {lines.map((l, i) => (
          <div key={i}>
            <span style={{ background: foil, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.35))" }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: x + 40, right: W - x - w, top: y + h - 230, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: style.type.tagline, color: C.foil }}>{kicker}</div>
    </>
  );
};
