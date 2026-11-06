/**
 * Silent Film's pieces: the picture house (pelmet, side drapes, stage lip, footlights) round a tall gate; the print pass
 * (softness, flicker, weave, uneven density, scratches, dust, a hair, edge burn, vignette, grain), whose strength is set
 * per section; engraved wash shapes on the sepia tone ramp with 45° hatching; intertitle cards whose border follows the
 * emotion; the iris; figures marked by silhouette. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, color, Finish, mix, rgba, run, seeded, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, ITALIC, SC } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const T = style.type;
export const G = style.layout.gate;
const P = style.palette;
const col = (r: string) => color(P, r);
export const C = {
  card: col("background"),
  type: col("text"),
  mid: col("muted"),
  low: col("faint"),
  high: col("surface"),
  blue: col("accent"),
  fringe: col("accent2"),
  theatre: col("theatre"),
  velvet: col("velvet"),
  velvetDark: col("velvet-dark"),
  lamp: col("lamp"),
  burn: col("burn"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const useT = useSeconds;
/** Hand-cranked sampling: picture motion moves at 16 drawings a second, the print changes every frame. */
export const crank = (t: number): number => Math.floor(t * S.motion.crank) / S.motion.crank;

/** The sepia tone ramp: density L (0 ink … 1 white linen) to a print colour, clipped to the print's black and white. */
export const tone = (L: number): string => {
  const x = clamp(L, 0.055, 0.93);
  return x < 0.6 ? mix(C.low, C.mid, x / 0.6) : mix(C.mid, C.high, (x - 0.6) / 0.4);
};

/** A wash shape: one posterised tone, hatched in the darks, with a thin ink contour. */
export const Wash: React.FC<{ d: string; L: number; contour?: boolean; hatch?: boolean }> = ({ d, L, contour = true, hatch = true }) => (
  <g>
    <path d={d} fill={tone(L)} />
    {hatch && L < 0.62 ? <path d={d} fill="url(#sf-h1)" /> : null}
    {hatch && L < 0.34 ? <path d={d} fill="url(#sf-h2)" /> : null}
    {contour ? <path d={d} fill="none" stroke={tone(0.07)} strokeWidth={E.contour} strokeLinejoin="round" strokeLinecap="round" /> : null}
  </g>
);

export const Defs: React.FC = () => (
  <defs>
    <pattern id="sf-h1" width={E.hatch} height={E.hatch} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1={0} y1={0} x2={0} y2={E.hatch} stroke={tone(0.08)} strokeWidth={2.2} opacity={0.75} />
    </pattern>
    <pattern id="sf-h2" width={E.hatch} height={E.hatch} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1={0} y1={0} x2={0} y2={E.hatch} stroke={tone(0.06)} strokeWidth={2.2} opacity={0.75} />
    </pattern>
    <filter id="sf-density" filterUnits="userSpaceOnUse" x={0} y={0} width={G.w} height={G.h}>
      <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves={4} seed={21} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.06  0 0 0 0.9 -0.36" />
    </filter>
  </defs>
);

const fan = (x: number, y: number, r: number, sx: number, sy: number) => {
  const ribs = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 5) * (Math.PI / 2);
    return `M ${x} ${y} L ${x + sx * r * Math.cos(a)} ${y + sy * r * Math.sin(a)}`;
  }).join(" ");
  return `${ribs} M ${x + sx * r} ${y} A ${r} ${r} 0 0 ${sx * sy > 0 ? 1 : 0} ${x} ${y + sy * r}`;
};

/** Level 0: one heavy rule. */
const Heavy: React.FC = () => {
  const { stroke, inset } = E.heavyRule;
  return <rect x={inset} y={inset} width={G.w - 2 * inset} height={G.h - 2 * inset} fill="none" stroke={C.type} strokeWidth={stroke} />;
};

/** Level 1: a double rule with stepped corners, fans and diamonds. */
const Deco: React.FC = () => {
  const { outer, inner, inset, gap } = E.doubleRule;
  const a = inset;
  const b = inset + gap;
  const w = G.w;
  const h = G.h;
  const st = 46;
  const step = (m: number) =>
    `M ${m + st} ${m} L ${w - m - st} ${m} L ${w - m - st} ${m + st / 2} L ${w - m - st / 2} ${m + st / 2} L ${w - m - st / 2} ${m + st} L ${w - m} ${m + st} L ${w - m} ${h - m - st} L ${w - m - st / 2} ${h - m - st} L ${w - m - st / 2} ${h - m - st / 2} L ${w - m - st} ${h - m - st / 2} L ${w - m - st} ${h - m} L ${m + st} ${h - m} L ${m + st} ${h - m - st / 2} L ${m + st / 2} ${h - m - st / 2} L ${m + st / 2} ${h - m - st} L ${m} ${h - m - st} L ${m} ${m + st} L ${m + st / 2} ${m + st} L ${m + st / 2} ${m + st / 2} L ${m + st} ${m + st / 2} Z`;
  const q = b + 40;
  const diamond = (x: number, y: number, s: number) => `M ${x} ${y - s} L ${x + s * 0.7} ${y} L ${x} ${y + s} L ${x - s * 0.7} ${y} Z`;
  return (
    <g fill="none" stroke={C.type}>
      <path d={step(a)} strokeWidth={outer} />
      <path d={step(b)} strokeWidth={inner} />
      <path d={fan(q, q, 70, 1, 1)} strokeWidth={inner} />
      <path d={fan(w - q, q, 70, -1, 1)} strokeWidth={inner} />
      <path d={fan(q, h - q, 70, 1, -1)} strokeWidth={inner} />
      <path d={fan(w - q, h - q, 70, -1, -1)} strokeWidth={inner} />
      <path d={diamond(w / 2, b + 34, 22)} fill={C.type} stroke="none" />
      <path d={diamond(w / 2, h - b - 34, 22)} fill={C.type} stroke="none" />
    </g>
  );
};

/** Level 2: vines and small flowers. */
export const Vines: React.FC = () => {
  const m = 56;
  const w = G.w;
  const h = G.h;
  const r = seeded(9);
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const n = 10;
    const out: React.ReactNode[] = [];
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = -(y1 - y0) / L;
    const ny = (x1 - x0) / L;
    let d = `M ${x0} ${y0}`;
    for (let i = 0; i < n; i++) {
      const a = (i + 0.5) / n;
      const s = i % 2 ? 1 : -1;
      const cx = x0 + (x1 - x0) * a + nx * 22 * s;
      const cy = y0 + (y1 - y0) * a + ny * 22 * s;
      const ex = x0 + (x1 - x0) * ((i + 1) / n);
      const ey = y0 + (y1 - y0) * ((i + 1) / n);
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      const lx = cx + nx * 8 * s;
      const ly = cy + ny * 8 * s;
      const rot = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 30 * s + (r() - 0.5) * 20;
      out.push(<ellipse key={i} cx={lx} cy={ly} rx={13} ry={5.5} fill={C.type} transform={`rotate(${rot.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)})`} />);
      if (i % 3 === 1) {
        const fx = ex;
        const fy = ey;
        out.push(
          <g key={`f${i}`}>
            {[0, 1, 2, 3, 4].map((k) => {
              const a2 = (k / 5) * Math.PI * 2;
              return <circle key={k} cx={fx + 9 * Math.cos(a2)} cy={fy + 9 * Math.sin(a2)} r={5.5} fill={C.type} />;
            })}
            <circle cx={fx} cy={fy} r={4} fill={C.card} />
          </g>,
        );
      }
    }
    return (
      <g>
        <path d={d} fill="none" stroke={C.type} strokeWidth={2.4} />
        {out}
      </g>
    );
  };
  return (
    <g>
      {edge(m, m, w - m, m)}
      {edge(w - m, m, w - m, h - m)}
      {edge(w - m, h - m, m, h - m)}
      {edge(m, h - m, m, m)}
    </g>
  );
};

/** An intertitle card; `level` is the emotion: 0 shout, 1 narration, 2 tender. */
export const Card: React.FC<{ level: 0 | 1 | 2; children: React.ReactNode }> = ({ level, children }) => (
  <g>
    <rect width={G.w} height={G.h} fill={C.card} />
    {level === 0 ? <Heavy /> : level === 1 ? <Deco /> : <Vines />}
    {children}
  </g>
);

export const Small: React.FC<{ text: string; y: number; size?: number; weight?: number; x?: number; dx?: number; dy?: number }> = ({ text, y, size = T.title, weight = 900, x = G.w / 2, dx = 0, dy = 0 }) => (
  <text x={x + dx} y={y + dy} fontFamily={SC} fontWeight={weight} fontSize={size} fill={C.type} textAnchor="middle">
    {text}
  </text>
);

export const Italic: React.FC<{ text: string; y: number; size?: number; x?: number; anchor?: "start" | "middle" | "end"; fill?: string }> = ({ text, y, size = T.narration, x = G.w / 2, anchor = "middle", fill = C.type }) => (
  <text x={x} y={y} fontFamily={ITALIC} fontStyle="italic" fontSize={size} fill={fill} textAnchor={anchor}>
    {text}
  </text>
);

/** The iris: a circular mask printed with the frame, so it ages with it. */
export const Iris: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <path fillRule="evenodd" d={`M -20 -20 H ${G.w + 20} V ${G.h + 20} H -20 Z M ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} Z`} fill={tone(0.055)} />
);

/** A figure from behind, marked by silhouette: a boater, a long coat; pale hands and neck, dark cloth. */
export const Figure: React.FC<{ x: number; y: number; s?: number; look?: number }> = ({ x, y, s = 1, look = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Wash d="M -30 0 L -26 -150 L -56 -300 Q -30 -340 0 -342 Q 30 -340 56 -300 L 26 -150 L 30 0 L 8 0 L 2 -130 L -6 -130 L -10 0 Z" L={0.2} />
    <Wash d="M -40 2 L -8 2 L -6 -14 L -36 -14 Z M 8 2 L 42 2 L 38 -14 L 8 -14 Z" L={0.08} hatch={false} />
    <Wash d="M -56 -300 Q -74 -220 -60 -150 L -40 -152 Q -46 -220 -34 -296 Z" L={0.26} />
    <Wash d="M 56 -300 Q 74 -220 60 -150 L 40 -152 Q 46 -220 34 -296 Z" L={0.3} />
    <circle cx={look * 6} cy={-372} r={34} fill={tone(0.8)} stroke={tone(0.07)} strokeWidth={E.contour} />
    <Wash d={`M ${-36 + look * 6} -376 Q ${look * 6} -420 ${36 + look * 6} -376 L ${30 + look * 6} -360 Q ${look * 6} -340 ${-30 + look * 6} -360 Z`} L={0.14} />
    <Wash d={`M ${-58 + look * 6} -384 Q ${look * 6} -372 ${58 + look * 6} -384 L ${50 + look * 6} -394 L ${-50 + look * 6} -394 Z`} L={0.72} hatch={false} />
    <path d={`M ${-32 + look * 6} -412 L ${32 + look * 6} -412 L ${38 + look * 6} -392 L ${-38 + look * 6} -392 Z`} fill={tone(0.82)} stroke={tone(0.07)} strokeWidth={E.contour} />
    <path d={`M ${-37 + look * 6} -400 L ${37 + look * 6} -400`} stroke={tone(0.1)} strokeWidth={6} />
  </g>
);

/** Print damage, re-rolled every frame. */
const Damage: React.FC<{ frame: number; k: number }> = ({ frame, k }) => {
  const r = seeded(frame * 48271 + 11);
  const scratches = Array.from({ length: Math.round(r() * S.finish.scratches * k + 0.5) }, () => ({ x: r() * G.w, w: 0.6 + r() * 1.4, j: (r() - 0.5) * 6, white: r() < 0.6 }));
  const dust = Array.from({ length: 2 + Math.floor(r() * (S.finish.dust - 2) * k) }, () => ({ x: r() * G.w, y: r() * G.h, r: 0.8 + r() * 3.2, white: r() < 0.35 }));
  const hair = r() < 0.22 * k;
  const hx = r() * G.w;
  const hy = r() * G.h;
  const hl = 40 + r() * 90;
  return (
    <g>
      {scratches.map((s, i) => (
        <path key={i} d={`M ${s.x} 0 L ${s.x + s.j} ${G.h * 0.4} L ${s.x - s.j} ${G.h * 0.7} L ${s.x} ${G.h}`} fill="none" stroke={s.white ? "rgba(240,232,215,0.55)" : "rgba(12,10,8,0.5)"} strokeWidth={s.w} strokeDasharray={`${180 + i * 70} ${30 + i * 13}`} />
      ))}
      {dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.white ? "rgba(240,232,215,0.75)" : "rgba(12,10,8,0.75)"} />
      ))}
      {hair ? <path d={`M ${hx} ${hy} q ${hl / 3} ${-hl / 2} ${hl / 2} ${-hl / 7} t ${hl / 2} ${hl / 3}`} fill="none" stroke="rgba(10,8,6,0.75)" strokeWidth={1.2} /> : null}
    </g>
  );
};

/** The drapes round the gate: the pelmet in the top safe zone, thin side drapes, the stage lip and footlights below. */
const House: React.FC<{ spill: number }> = ({ spill }) => {
  const folds = `repeating-linear-gradient(90deg, ${C.velvetDark} 0px, ${C.velvet} 22px, ${mix(C.velvet, C.lamp, 0.16)} 34px, ${C.velvet} 46px, ${C.velvetDark} 68px)`;
  const swags = 6;
  const sw = W / swags;
  const top = 196;
  const swag = Array.from({ length: swags }, (_, i) => `Q ${i * sw + sw / 2} ${top + 62} ${(i + 1) * sw} ${top}`).join(" ");
  const lamps = [130, 270, 410, 540, 670, 810, 950];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: G.x, background: folds, opacity: 0.55 + spill * 0.35 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: W - G.x - G.w, background: folds, opacity: 0.55 + spill * 0.35 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: top + 70, background: folds, clipPath: `path('M 0 0 H ${W} V ${top} ${Array.from({ length: swags }, (_, i) => `Q ${W - i * sw - sw / 2} ${top + 62} ${W - (i + 1) * sw} ${top}`).join(" ")} Z')` }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M 0 ${top} ${swag}`} fill="none" stroke={C.fringe} strokeWidth={7} opacity={0.8} />
        <path d={`M 0 ${top + 8} ${swag.replace(/Q ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)/g, (_m, a, b, c, d) => `Q ${a} ${Number(b) + 8} ${c} ${Number(d) + 8}`)}`} fill="none" stroke={C.fringe} strokeWidth={9} strokeDasharray="3 9" opacity={0.7} />
        <rect x={0} y={G.y + G.h + 34} width={W} height={H - G.y - G.h} fill={mix(C.theatre, "#3a2413", 0.6)} />
        <rect x={0} y={G.y + G.h + 34} width={W} height={12} fill={C.fringe} opacity={0.5} />
        {lamps.map((x) => (
          <g key={x}>
            <path d={`M ${x - 46} ${G.y + G.h + 110} Q ${x} ${G.y + G.h + 56} ${x + 46} ${G.y + G.h + 110} Z`} fill={C.theatre} stroke={C.fringe} strokeWidth={3} />
            <ellipse cx={x} cy={G.y + G.h + 94} rx={22} ry={10} fill={C.lamp} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: G.y + G.h - 180, background: `radial-gradient(ellipse 66% 36% at 50% 55%, ${rgba(C.lamp, 0.34 * (0.7 + spill * 0.5))} 0%, rgba(170,70,50,0.14) 55%, rgba(170,70,50,0) 100%)`, pointerEvents: "none", mixBlendMode: "screen" }} />
    </>
  );
};

type Section = keyof typeof style.finish.strength;

/** The projected print inside the picture house. `section` sets the damage. Waits for the fonts. */
export const Print: React.FC<{ section?: Section; children: React.ReactNode }> = ({ section = "card", children }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = S.finish.strength[section];
  const r = seeded(frame * 7919 + 2);
  const f = frame;
  const flick = 1 + ((r() - 0.5) * S.finish.flicker + Math.sin(f * 1.9) * 0.025 + Math.sin(f * 0.37) * 0.02) * k;
  const wx = (Math.sin(f * 0.61) * 0.6 + Math.sin(f * 1.3) * 0.8 + (r() - 0.5)) * S.finish.weave * k;
  const wy = (Math.sin(f * 0.47) * 0.6 + Math.sin(f * 1.7) * 0.7 + (r() - 0.5)) * 1.6 * k + (r() < 0.025 * (fps / fps) ? 4 * k : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: C.theatre, overflow: "hidden" }}>
      <House spill={k} />
      <div style={{ position: "absolute", left: G.x, top: G.y, width: G.w, height: G.h, borderRadius: G.radius, overflow: "hidden", backgroundColor: C.card, boxShadow: `0 0 0 3px ${C.theatre}, 0 0 60px ${rgba(C.lamp, 0.18)}` }}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${S.finish.soft * 0.8}px) brightness(${flick.toFixed(3)})`, transform: `translate(${wx.toFixed(2)}px, ${wy.toFixed(2)}px)` }}>
          <svg width={G.w} height={G.h} style={{ position: "absolute", left: 0, top: 0 }}>
            <Defs />
            {children}
            <rect width={G.w} height={G.h} filter="url(#sf-density)" opacity={0.22 + k * 0.22} />
            <Damage frame={frame} k={k} />
          </svg>
        </div>
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${150 + k * 90}px ${40 + k * 40}px ${rgba(C.burn, S.finish.burn * k + 0.1)}` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 62% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${(S.finish.vignette * (0.4 + k * 0.6)).toFixed(3)}) 100%)` }} />
        <Finish grain={S.finish.grain} vignette={0} width={G.w} height={G.h} />
      </div>
    </AbsoluteFill>
  );
};
