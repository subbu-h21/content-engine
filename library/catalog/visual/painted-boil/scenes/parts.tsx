/**
 * Painted Boil's pieces: warm paper (stains and fibres), watercolour washes that bleed (seeded turbulence displacement
 * with a textured body and a darker rim), flat gouache fills, ink lines that boil (a turbulence displacement reseeded
 * every `boilHold` frames, each element with its own key), dry-brush strokes, additive glows, the invented character
 * Pip, painted marks, hand-lettered words, the brush wipe, and the multiplied grain and warm vignette.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
const P = style.palette;
export const col = (role: string) => color(P, role);
export const C = {
  paper: col("background"),
  cream: col("text"),
  ink: col("ink"),
  indigo: col("muted"),
  night: col("faint"),
  ochre: col("accent"),
  sky: col("accent2"),
  rose: col("rose"),
  sap: col("sap"),
  teal: col("teal"),
  tealDark: col("teal-dark"),
  violet: col("violet"),
  gold: col("gold"),
  glow: col("glow"),
  blush: col("blush"),
  mouth: col("mouth"),
  stain: col("stain"),
  fibre: col("fibre"),
};
export const SPECTRUM = [C.rose, C.ochre, C.gold, C.sap, C.sky, C.violet];

const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
/** backOut with overshoot 1.9 (the source's): 1 + (s+1)(p−1)^3 + s(p−1)^2. */
export const backOut = (t: number, dur = R.backOut.duration): number => {
  if (t <= 0) return 0;
  const u = clamp(t / dur) - 1;
  const s = R.backOut.overshoot;
  return 1 + (s + 1) * u * u * u + s * u * u;
};
/** A settling kick after an event: e^(−k·Δt)·sin(w·Δt). */
export const kick = (dt: number): number => (dt <= 0 ? 0 : Math.exp(-R.settle.k * dt) * Math.sin(R.settle.w * dt));
/** The beat pulse: e^(−6·frac(beat)) on each beat. */
export const pulse = (t: number): number => Math.exp(-style.motion.pulse * (((t * style.motion.bpm) / 60) % 1));

export const rnd = (i: number, seed = 0): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** The boil index: the drawing changes every `boilHold` frames. */
export const useBoil = (): number => Math.floor(useCurrentFrame() / E.boilHold);

/** A wobbly closed shape from three harmonics (paint never makes perfect circles). */
export const blob = (cx: number, cy: number, rx: number, ry: number, seed = 1, n = 64): string => {
  const p = [rnd(seed, 1), rnd(seed, 2), rnd(seed, 3)].map((v) => v * 6.28);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.03 * Math.sin(3 * a + p[0]) + 0.02 * Math.sin(5 * a + p[1]) + 0.012 * Math.sin(8 * a + p[2]);
    return `${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`;
  });
  return `M ${pts.join(" L ")} Z`;
};

// ---------------------------------------------------------------- filters

const KEYS = 10;
/**
 * The frame's filters: boil-k (ink lines: a turbulence displacement reseeded every boil, each key its own seed),
 * wc-k (watercolour: bleed, a textured body, a darker rim), gouache-k (flat paint with a slight edge wobble), dry
 * (bristle streaks), and the paper grain.
 */
export const Defs: React.FC<{ boil: number }> = ({ boil }) => {
  const wa = E.wash;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        {Array.from({ length: KEYS }, (_, k) => (
          <React.Fragment key={k}>
            <filter id={`boil-${k}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency={E.boilFreq} numOctaves={2} seed={(boil * 13 + k * 101) % 997} />
              <feDisplacementMap in="SourceGraphic" scale={E.boilScale * 2} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id={`wc-${k}`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.011} numOctaves={3} seed={k * 17 + 3} result="n1" />
              <feDisplacementMap in="SourceGraphic" in2="n1" scale={wa.bleed} xChannelSelector="R" yChannelSelector="G" result="bled" />
              <feTurbulence type="fractalNoise" baseFrequency={0.04} numOctaves={3} seed={(boil * 7 + k * 31) % 997} result="n2" />
              <feColorMatrix in="n2" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${-2 * wa.texture} ${1 + wa.texture * 0.6}`} result="tex" />
              <feComposite in="bled" in2="tex" operator="in" result="body" />
              <feMorphology in="bled" operator="erode" radius={wa.erode} result="inner" />
              <feComposite in="bled" in2="inner" operator="out" result="rim" />
              <feColorMatrix in="rim" type="matrix" values={`0.7 0 0 0 0  0 0.66 0 0 0  0 0 0.72 0 0  0 0 0 ${wa.border} 0`} result="rimDark" />
              <feGaussianBlur in="rimDark" stdDeviation={2.2} result="rimSoft" />
              <feMerge>
                <feMergeNode in="body" />
                <feMergeNode in="rimSoft" />
              </feMerge>
            </filter>
            <filter id={`gouache-${k}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency={0.03} numOctaves={2} seed={(boil * 5 + k * 59) % 997} result="g" />
              <feDisplacementMap in="SourceGraphic" in2="g" scale={4} xChannelSelector="R" yChannelSelector="G" result="d" />
              <feTurbulence type="fractalNoise" baseFrequency={0.09} numOctaves={2} seed={k * 23 + 9} result="g2" />
              <feColorMatrix in="g2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.5 1.2" result="gt" />
              <feComposite in="d" in2="gt" operator="in" />
            </filter>
          </React.Fragment>
        ))}
        <filter id="dry" filterUnits="userSpaceOnUse" x={-400} y={-400} width={W + 800} height={H + 800}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves={2} seed={(boil * 3) % 997} result="s" />
          <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.1" result="st" />
          <feComposite in="SourceGraphic" in2="st" operator="in" />
        </filter>
      </defs>
    </svg>
  );
};

// ---------------------------------------------------------------- paper and finish

/** The paper: base colour, 70 soft stains, 1,400 fibres; static (the paper doesn't boil). */
const PaperTexture: React.FC = React.memo(() => {
  const pa = E.paper;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="stain">
          <stop offset="0%" stopColor={C.stain} stopOpacity={pa.stainAlpha} />
          <stop offset="100%" stopColor={C.stain} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={C.paper} />
      {Array.from({ length: pa.stains }, (_, i) => (
        <circle key={i} cx={rnd(i, 11) * W} cy={rnd(i, 12) * H} r={120 + rnd(i, 13) * 380} fill="url(#stain)" />
      ))}
      {Array.from({ length: pa.fibres }, (_, i) => {
        const x = rnd(i, 21) * W;
        const y = rnd(i, 22) * H;
        const l = 6 + rnd(i, 23) * 26;
        const a = rnd(i, 24) * Math.PI;
        return <line key={`f${i}`} x1={x} y1={y} x2={x + l * Math.cos(a)} y2={y + l * Math.sin(a)} stroke={C.fibre} strokeWidth={1} opacity={pa.fibreAlpha[0] + rnd(i, 25) * (pa.fibreAlpha[1] - pa.fibreAlpha[0])} />;
      })}
    </svg>
  );
});

/** Static grain and the warm vignette, multiplied over everything so pigment sits in the paper. */
const PaperFinish: React.FC = () => {
  const [v0, v1, va] = E.vignette;
  const g = E.grain;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply" }}>
        <filter id="pgrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={0.95} numOctaves={1} seed={5} />
          <feColorMatrix type="matrix" values={`0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 ${(g.max / 255) * 6} ${-(g.max / 255) * 6 * (1 - g.share * 0.6)}`} />
        </filter>
        <rect width={W} height={H} filter="url(#pgrain)" />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(120,95,70,0) ${v0 * H * 0.5}px, rgba(120,95,70,${va}) ${v1 * H * 0.62}px)`, mixBlendMode: "multiply" }} />
    </>
  );
};

/**
 * The frame: paper, the painting (drifting slowly: the camera is never quite still), then grain and the warm
 * vignette on top. Waits for the fonts.
 */
export const Page: React.FC<{ children: React.ReactNode; over?: React.ReactNode }> = ({ children, over }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const boil = useBoil();
  const [dx, df, dz] = E.drift;
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Defs boil={boil} />
      <AbsoluteFill style={{ transform: `translateX(${dx * Math.sin(df * t)}px) scale(${1 + dz * t})` }}>
        <PaperTexture />
        {children}
      </AbsoluteFill>
      {over}
      <PaperFinish />
    </AbsoluteFill>
  );
};

/** A full-frame SVG layer. */
export const Layer: React.FC<{ children: React.ReactNode; blend?: React.CSSProperties["mixBlendMode"] }> = ({ children, blend }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: blend, overflow: "visible" }}>
    {children}
  </svg>
);

// ---------------------------------------------------------------- paint

/** A watercolour wash: bleeding edge, textured body, darker rim; multiplied like pigment. */
export const Wash: React.FC<{ d: string; fill: string; k?: number; opacity?: number }> = ({ d, fill, k = 0, opacity = E.wash.opacity }) => (
  <g style={{ mixBlendMode: "multiply" }} opacity={opacity}>
    <path d={d} fill={fill} filter={`url(#wc-${k % KEYS})`} />
  </g>
);

/** Flat gouache paint (exact colour) with a slight edge wobble. */
export const Gouache: React.FC<{ d: string; fill: string; k?: number }> = ({ d, fill, k = 0 }) => <path d={d} fill={fill} filter={`url(#gouache-${k % KEYS})`} />;

/** A boiling ink line (or outline). */
export const Ink: React.FC<{ d: string; k?: number; w?: number; fill?: string; c?: string }> = ({ d, k = 0, w = E.line, fill = "none", c = C.ink }) => (
  <path d={d} fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" filter={`url(#boil-${k % KEYS})`} />
);

/** A dry-brush stroke from a to b, streaky. */
export const Dry: React.FC<{ a: [number, number]; b: [number, number]; w: number; c: string; p?: number }> = ({ a, b, w, c, p = 1 }) => {
  if (p <= 0) return null;
  const x = a[0] + (b[0] - a[0]) * p;
  const y = a[1] + (b[1] - a[1]) * p;
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={c} strokeWidth={w} strokeLinecap="round" filter="url(#dry)" opacity={0.92} />
    </g>
  );
};

/** Additive light (a glow): stops 0:1, .18:.8, .45:.32, .75:.08, 1:0, tinted at alpha 150/255 × a. */
export const Glow: React.FC<{ x: number; y: number; r: number; a?: number; c?: string; id: string }> = ({ x, y, r, a = 1, c = C.glow, id }) => (
  <g style={{ mixBlendMode: "screen" }}>
    <defs>
      <radialGradient id={id}>
        {E.glowStops.map(([o, v], i) => (
          <stop key={i} offset={`${o * 100}%`} stopColor={c} stopOpacity={v * E.glowAlpha * a} />
        ))}
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** A shape painted in gouache with one shade crescent (lower right) and a boiling ink outline. */
export const Painted: React.FC<{ id: string; d: string; fill: string; shade?: string; k?: number; line?: number }> = ({ id, d, fill, shade, k = 0, line = E.line }) => (
  <g>
    <Gouache d={d} fill={shade ?? fill} k={k} />
    {shade ? (
      <>
        <clipPath id={`${id}-c`}>
          <path d={d} />
        </clipPath>
        <g clipPath={`url(#${id}-c)`}>
          <path d={d} fill={fill} transform="translate(-14 -12)" />
        </g>
      </>
    ) : null}
    <Ink d={d} k={k} w={line} />
  </g>
);

// ---------------------------------------------------------------- the character

export type Pose = "idle" | "wave" | "up" | "point" | "cheer";
export type Mood = "happy" | "wonder" | "surprised";

/**
 * Pip (invented for this style): a round, pebble-shaped teal creature with a cream belly, a curl on top, big eyes
 * that lead the thought, tapered ribbon arms and small feet. Stands at (x, y); `s` is px per unit (u).
 */
export const Pip: React.FC<{ id: string; x: number; y: number; s?: number; pose?: Pose; mood?: Mood; gaze?: [number, number]; t: number; k?: number; flip?: boolean }> = ({
  id,
  x,
  y,
  s = E.char.u,
  pose = "idle",
  mood = "happy",
  gaze = [0, -1],
  t,
  k = 0,
  flip = false,
}) => {
  const u = s;
  const bob = 0.35 * u * pulse(t);
  const body = blob(0, -5.4 * u, 4.6 * u, 5.0 * u, 61);
  const belly = blob(0, -3.9 * u, 2.9 * u, 2.6 * u, 62);
  const arm = (side: number) => {
    const sx = side * 4.1 * u;
    const sy = -5.0 * u;
    const end: [number, number] =
      pose === "up" || pose === "cheer" ? [side * 6.6 * u, -10.2 * u] : pose === "wave" && side > 0 ? [7.8 * u, -9.2 * u + Math.sin(t * 9) * 0.6 * u] : pose === "point" && side > 0 ? [8.8 * u, -6.4 * u] : [side * 6.0 * u, -2.6 * u];
    const mid: [number, number] = [(sx + end[0]) / 2 + side * 0.9 * u, (sy + end[1]) / 2 + 0.6 * u];
    const d = `M ${sx} ${sy} Q ${mid[0]} ${mid[1]} ${end[0]} ${end[1]}`;
    return (
      <g key={side}>
        <path d={d} fill="none" stroke={C.ink} strokeWidth={1.25 * u} strokeLinecap="round" filter={`url(#boil-${(k + 2) % KEYS})`} />
        <path d={d} fill="none" stroke={C.teal} strokeWidth={0.85 * u} strokeLinecap="round" />
      </g>
    );
  };
  const eye = (side: number) => {
    const ex = side * 1.6 * u;
    const ey = -7.0 * u;
    const closed = mood === "happy" && pose === "cheer";
    return (
      <g key={side}>
        {closed ? (
          <Ink d={`M ${ex - 0.8 * u} ${ey + 0.2 * u} Q ${ex} ${ey - 0.7 * u} ${ex + 0.8 * u} ${ey + 0.2 * u}`} k={k + 3} w={0.32 * u} />
        ) : (
          <>
            <Gouache d={blob(ex, ey, 1.05 * u, (mood === "surprised" ? 1.45 : 1.25) * u, 70 + side)} fill={C.cream} k={k + 3} />
            <Ink d={blob(ex, ey, 1.05 * u, (mood === "surprised" ? 1.45 : 1.25) * u, 70 + side)} k={k + 3} w={0.22 * u} />
            <circle cx={ex + gaze[0] * 0.42 * u} cy={ey + gaze[1] * 0.5 * u} r={0.5 * u} fill={C.ink} />
            <circle cx={ex + gaze[0] * 0.42 * u - 0.18 * u} cy={ey + gaze[1] * 0.5 * u - 0.2 * u} r={0.16 * u} fill={C.cream} />
          </>
        )}
      </g>
    );
  };
  const mouth =
    mood === "surprised" ? (
      <>
        <Gouache d={blob(0, -4.9 * u, 0.6 * u, 0.75 * u, 80)} fill={C.mouth} k={k + 4} />
        <Ink d={blob(0, -4.9 * u, 0.6 * u, 0.75 * u, 80)} k={k + 4} w={0.2 * u} />
      </>
    ) : mood === "wonder" ? (
      <Ink d={`M ${-0.5 * u} ${-5.0 * u} Q 0 ${-4.5 * u} ${0.5 * u} ${-5.0 * u}`} k={k + 4} w={0.24 * u} />
    ) : (
      <>
        <Gouache d={`M ${-1.1 * u} ${-5.3 * u} Q 0 ${-3.7 * u} ${1.1 * u} ${-5.3 * u} Z`} fill={C.mouth} k={k + 4} />
        <Ink d={`M ${-1.1 * u} ${-5.3 * u} Q 0 ${-3.7 * u} ${1.1 * u} ${-5.3 * u} Z`} k={k + 4} w={0.22 * u} />
      </>
    );
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx={0} cy={bob} rx={4.4 * u} ry={0.7 * u} fill={C.ink} opacity={0.12} />
      {[-1, 1].map((side) => (
        <g key={`f${side}`}>
          <Gouache d={blob(side * 1.7 * u, -0.4 * u, 1.2 * u, 0.62 * u, 90 + side)} fill={C.tealDark} k={k + 5} />
          <Ink d={blob(side * 1.7 * u, -0.4 * u, 1.2 * u, 0.62 * u, 90 + side)} k={k + 5} w={0.24 * u} />
        </g>
      ))}
      {arm(-1)}
      <Painted id={`${id}-body`} d={body} fill={C.teal} shade={C.tealDark} k={k} line={0.3 * u} />
      <Gouache d={belly} fill={C.cream} k={k + 1} />
      <Ink d={`M ${0.4 * u} ${-10.2 * u} q ${0.3 * u} ${-1.6 * u} ${1.6 * u} ${-1.5 * u} q ${0.9 * u} ${0.2 * u} ${0.5 * u} ${0.9 * u}`} k={k + 6} w={0.3 * u} />
      {[-1, 1].map((side) => (
        <ellipse key={`b${side}`} cx={side * 2.9 * u} cy={-5.6 * u} rx={0.75 * u} ry={0.42 * u} fill={C.blush} opacity={0.55} />
      ))}
      {eye(-1)}
      {eye(1)}
      {mouth}
      {arm(1)}
    </g>
  );
};

// ---------------------------------------------------------------- marks and words

/** Painted reaction marks: "!", "?", a sparkle, a heart, sweat; they pop in with backOut. */
export const Mark: React.FC<{ kind: "!" | "?" | "sparkle" | "heart"; x: number; y: number; s?: number; at: number; k?: number; c?: string }> = ({ kind, x, y, s = 1, at, k = 7, c }) => {
  const t = useSeconds();
  const p = backOut(t - at);
  if (p <= 0) return null;
  const tilt = -6 + 4 * Math.sin(t * 3);
  let g: React.ReactNode;
  if (kind === "!")
    g = (
      <>
        <Ink d="M 0 -70 L 4 -18" k={k} w={16} c={c ?? C.rose} />
        <circle cx={5} cy={4} r={9} fill={c ?? C.rose} />
      </>
    );
  else if (kind === "?") g = <Ink d="M -22 -54 Q -20 -80 4 -80 Q 30 -78 26 -54 Q 22 -38 4 -30 L 4 -12" k={k} w={14} c={c ?? C.indigo} />;
  else if (kind === "sparkle") g = <Gouache d="M 0 -34 Q 6 -6 34 0 Q 6 6 0 34 Q -6 6 -34 0 Q -6 -6 0 -34 Z" fill={c ?? C.gold} k={k} />;
  else
    g = (
      <>
        <Gouache d="M 0 26 C -40 -2 -36 -36 -14 -36 C -4 -36 0 -28 0 -22 C 0 -28 4 -36 14 -36 C 36 -36 40 -2 0 26 Z" fill={c ?? C.rose} k={k} />
        <Ink d="M 0 26 C -40 -2 -36 -36 -14 -36 C -4 -36 0 -28 0 -22 C 0 -28 4 -36 14 -36 C 36 -36 40 -2 0 26 Z" k={k} w={5} />
      </>
    );
  return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s * p})`}>{g}</g>;
};

/**
 * Hand-lettered words: Permanent Marker filled in a colour, an ink drop copy offset (0.045, 0.055) × size and an
 * ink outline 0.12 × size under the fill; each word pops in with backOut, `stagger` apart. *Emphasis* takes `em`.
 */
export const Letters: React.FC<{ lines: string[]; size: number; y: number; at?: number; fill?: string; em?: string; tilt?: number; x?: number; align?: "center" | "left" }> = ({
  lines,
  size,
  y,
  at = 0,
  fill = C.cream,
  em = C.ochre,
  tilt = style.type.tilt,
  x = 0,
  align = "center",
}) => {
  const t = useSeconds() - at;
  const T = style.type;
  const [dx, dy] = T.drop;
  let i = 0;
  const words = lines.map((line) => {
    const out: { w: string; em: boolean }[] = [];
    line.split("*").forEach((part, k) => part.split(" ").filter(Boolean).forEach((w) => out.push({ w, em: k % 2 === 1 })));
    return out;
  });
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        fontFamily: DISPLAY,
        fontSize: size,
        lineHeight: T.leading,
        transform: `rotate(${tilt}rad)`,
      }}
    >
      {words.map((line, li) => (
        <div key={li}>
          {line.map((w, wi) => {
            const p = backOut(t - i * style.motion.stagger * 2);
            i += 1;
            const c = w.em ? em : fill;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", position: "relative", transform: `scale(${Math.max(0, p)})`, transformOrigin: "50% 70%" }}>
                  <span style={{ position: "absolute", left: dx * size, top: dy * size, color: C.ink, WebkitTextStroke: `${T.outline * size}px ${C.ink}` }}>{w.w}</span>
                  <span style={{ position: "absolute", left: 0, top: 0, color: C.ink, WebkitTextStroke: `${T.outline * size}px ${C.ink}` }}>{w.w}</span>
                  <span style={{ position: "relative", color: c }}>{w.w}</span>
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * The brush wipe: five fat painted strokes tilted −0.1 rad cover the frame (first half, ease-out) then drag off
 * (second half, ease), each with its own delay, alternating two colours. `p` runs 0 → 1 over the whole wipe.
 */
export const BrushWipe: React.FC<{ p: number; cols: [string, string] }> = ({ p, cols }) => {
  const delays = style.motion.wipeDelays;
  const tilt = R.wipe.tilt;
  const band = H / 4.2;
  return (
    <Layer>
      <g transform={`rotate(${(tilt * 180) / Math.PI} ${W / 2} ${H / 2})`}>
        {delays.map((d, i) => {
          const q = clamp((p - d * 0.6) / (1 - d * 0.6));
          const cover = ease("easeOut", q * 2 * R.easeOut.duration);
          const leave = q > 0.5 ? ease("ease", (q - 0.5) * 2 * R.ease.duration) : 0;
          const x0 = -300 + leave * (W + 600);
          const x1 = -300 + cover * (W + 600);
          if (x1 <= x0) return null;
          const y = -200 + i * band * 1.05;
          // filled shapes, not stroked lines: a filter on a zero-height line's box renders nothing
          const hb = band * 0.62;
          const cy = y + band * 0.5;
          return (
            <g key={i}>
              <rect x={x0 - hb} y={cy - hb} width={x1 - x0 + 2 * hb} height={2 * hb} rx={hb} fill={cols[i % 2]} filter={`url(#wc-${i})`} />
              <rect x={x0 - hb * 0.7} y={cy - hb * 0.7} width={x1 - x0 + 1.4 * hb} height={1.4 * hb} rx={hb * 0.7} fill={cols[(i + 1) % 2]} opacity={0.25} filter="url(#dry)" />
            </g>
          );
        })}
      </g>
    </Layer>
  );
};
