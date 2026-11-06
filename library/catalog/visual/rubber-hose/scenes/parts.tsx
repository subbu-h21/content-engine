/**
 * Rubber Hose's pieces: the rounded gate and the film-damage pass (weave, flicker, scratches, dust, a hair, vignette,
 * softness, contrast), grey watercolour backdrops that never boil, the anatomy kit (hose limbs, four-finger gloves, pie
 * eyes, mouths, big shoes), two invented characters (a sun and an air molecule) that boil on twos and breathe on the
 * beat, the script title over a sunburst, and the double-rule subtitle plate. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp, color, Finish, run, seeded, springAt, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { CAPS, FACES, SC, SCRIPT } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const E = style.elements;
export const T = style.type;
const P = style.palette;
const col = (r: string) => color(P, r);
export const C = {
  light: col("background"),
  paper: col("surface"),
  white: col("text"),
  ink: col("ink"),
  mid: col("muted"),
  darkMid: col("faint"),
  dark: col("dark"),
  plate: col("plate"),
  bezel: col("bezel"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
export const pop = (t: number): number => (t <= 0 ? 0 : springAt(t, R.pop));
export const useT = useSeconds;

/** Characters are on twos: the time rounded down to 12 drawings a second. */
export const twos = (t: number): number => Math.floor(t * S.motion.twos) / S.motion.twos;
/** Breathing: stretch on the beat, squash off it, all props in phase. */
export const breath = (t: number, amp: number = E.breath): number => 1 + amp * Math.cos(2 * Math.PI * (twos(t) * E.bpm) / 60);

const INK = { stroke: C.ink, strokeWidth: E.ink, strokeLinejoin: "round" as const, strokeLinecap: "round" as const, vectorEffect: "non-scaling-stroke" as const };

/** One drawing of the three-drawing boil: a displacement seeded by which drawing it is. */
export const Boil: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const d = Math.floor(t * S.motion.twos) % 3;
  return <g filter={`url(#rh-boil${d})`}>{children}</g>;
};

/** A hose limb: one smooth bend, constant width, round caps, no elbow. */
export const Hose: React.FC<{ from: [number, number]; to: [number, number]; bend?: number; w?: number }> = ({ from, to, bend = 0.3, w = E.limb }) => {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return <path d={`M ${from[0]} ${from[1]} Q ${mx - dy * bend} ${my + dx * bend} ${to[0]} ${to[1]}`} fill="none" stroke={C.ink} strokeWidth={w} strokeLinecap="round" />;
};

/** A four-finger glove: all parts stroked first, then all filled, so only the union is outlined. */
export const Glove: React.FC<{ x: number; y: number; a: number; s?: number; shape?: "open" | "point" | "fist"; flip?: boolean }> = ({ x, y, a, s = 1, shape = "open", flip = false }) => {
  const fingers = shape === "fist" ? [[-16, -18, 12, 12], [0, -21, 12, 12], [16, -18, 12, 12]] : shape === "point" ? [[0, -46, 11, 26], [-18, -20, 11, 12], [16, -20, 11, 12]] : [[-20, -36, 11, 24], [0, -44, 11, 26], [20, -36, 11, 24]];
  const parts = (extra: object) => (
    <>
      <ellipse cx={0} cy={0} rx={30} ry={26} {...extra} />
      {fingers.map(([fx, fy, rx, ry], i) => (
        <ellipse key={i} cx={fx} cy={fy} rx={rx} ry={ry} {...extra} />
      ))}
      <ellipse cx={-34} cy={-4} rx={18} ry={10} transform="rotate(-24 -34 -4)" {...extra} />
      <path d="M -24 18 L -30 40 L 30 40 L 24 18 Z" {...extra} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${flip ? -s : s} ${s})`}>
      {parts({ fill: C.ink, stroke: C.ink, strokeWidth: 12, strokeLinejoin: "round" })}
      {parts({ fill: C.white })}
      <path d="M -26 30 L 26 30" {...INK} strokeWidth={3} fill="none" />
      {[-12, 0, 12].map((d) => (
        <path key={d} d={`M ${d} 2 L ${d} -12`} {...INK} strokeWidth={3} fill="none" />
      ))}
    </g>
  );
};

/** A big black shoe with a white toe glint. */
export const Shoe: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={20} cy={0} rx={56} ry={30} fill={C.ink} />
    <ellipse cx={46} cy={-10} rx={14} ry={7} fill={C.white} transform="rotate(-14 46 -10)" />
  </g>
);

/** A pie eye: a white oval, a black pupil with a wedge cut toward the upper right; `look` moves the pupil. */
export const Eye: React.FC<{ x: number; y: number; rx?: number; ry?: number; look?: [number, number]; lid?: number }> = ({ x, y, rx = 30, ry = 42, look = [0, 0], lid = 0 }) => {
  const px = rx * 0.64;
  const py = ry * 0.74;
  const cx = x + look[0] * rx * 0.3;
  const cy = y + look[1] * ry * 0.26;
  const a = -0.3;
  const b = -1.15;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.white} {...INK} />
      <path
        d={`M ${cx} ${cy} L ${cx + px * Math.cos(a)} ${cy + py * Math.sin(a)} A ${px} ${py} 0 1 1 ${cx + px * Math.cos(b)} ${cy + py * Math.sin(b)} Z`}
        fill={C.ink}
      />
      {lid > 0 ? <path d={`M ${x - rx} ${y} A ${rx} ${ry} 0 0 1 ${x + rx} ${y} L ${x + rx} ${y - ry + 2 * ry * lid - ry * 0.02} L ${x - rx} ${y - ry + 2 * ry * lid} Z`} fill={C.white} {...INK} /> : null}
    </g>
  );
};

/** Mouths: smile with cheek ticks, open grin, "O", wavy. */
export const Mouth: React.FC<{ x: number; y: number; w?: number; kind?: "smile" | "grin" | "o" | "wavy" }> = ({ x, y, w = 80, kind = "smile" }) => {
  if (kind === "o") return <ellipse cx={x} cy={y + 10} rx={w * 0.28} ry={w * 0.38} fill={C.ink} />;
  if (kind === "grin")
    return (
      <g>
        <path d={`M ${x - w} ${y - 8} Q ${x} ${y + w * 1.4} ${x + w} ${y - 8} Z`} fill={C.ink} {...INK} />
        <path d={`M ${x - w * 0.5} ${y + w * 0.5} Q ${x} ${y + w * 0.1} ${x + w * 0.5} ${y + w * 0.5} Q ${x} ${y + w * 1} ${x - w * 0.5} ${y + w * 0.5} Z`} fill={C.mid} />
      </g>
    );
  if (kind === "wavy") return <path d={`M ${x - w} ${y} q ${w / 3} ${-w / 4} ${(w * 2) / 3} 0 t ${(w * 2) / 3} 0 t ${(w * 2) / 3} 0`} fill="none" {...INK} />;
  return (
    <g fill="none" {...INK}>
      <path d={`M ${x - w} ${y} Q ${x} ${y + w} ${x + w} ${y}`} />
      <path d={`M ${x - w - 10} ${y - 10} Q ${x - w - 2} ${y + 2} ${x - w + 8} ${y + 8}`} />
      <path d={`M ${x + w + 10} ${y - 10} Q ${x + w + 2} ${y + 2} ${x + w - 8} ${y + 8}`} />
    </g>
  );
};

export type Pose = {
  hands: [[number, number], [number, number]];
  gloves?: ["open" | "point" | "fist", "open" | "point" | "fist"];
  mouth?: "smile" | "grin" | "o" | "wavy";
  look?: [number, number];
  feet?: [[number, number], [number, number]];
  wink?: boolean;
};

const limbsAndFeet = (r: number, p: Pose, s: number, armY = 20) => {
  const feet = p.feet ?? [[-70, r + 120], [70, r + 120]];
  const hands = p.hands;
  const ga = (h: [number, number]) => (Math.atan2(h[1] - armY, h[0]) * 180) / Math.PI + 90;
  return {
    back: (
      <>
        <Hose from={[-34, r - 8]} to={[feet[0][0], feet[0][1] - 18]} bend={0.12} />
        <Hose from={[34, r - 8]} to={[feet[1][0], feet[1][1] - 18]} bend={-0.12} />
        <Shoe x={feet[0][0] - 8} y={feet[0][1]} flip />
        <Shoe x={feet[1][0] + 8} y={feet[1][1]} />
      </>
    ),
    front: (
      <>
        <Hose from={[-r + 14, armY]} to={hands[0]} bend={-0.26} />
        <Hose from={[r - 14, armY]} to={hands[1]} bend={0.26} />
        <Glove x={hands[0][0]} y={hands[0][1]} a={ga(hands[0])} shape={p.gloves?.[0] ?? "open"} flip s={0.82} />
        <Glove x={hands[1][0]} y={hands[1][1]} a={ga(hands[1])} shape={p.gloves?.[1] ?? "open"} s={0.82} />
      </>
    ),
    s,
  };
};

/** The sun: an invented character; the whole body is a face with rays, hose limbs, gloves and shoes. */
export const Sunny: React.FC<{ x: number; y: number; s?: number; t: number; pose: Pose; id: string }> = ({ x, y, s = 1, t, pose, id }) => {
  const r = 130;
  const k = breath(t);
  const rays = Array.from({ length: E.rays }, (_, i) => {
    const a = (i / E.rays) * Math.PI * 2;
    const l = i % 2 === 0 ? r + 58 : r + 40;
    const b = 0.16;
    return `M ${(r - 4) * Math.cos(a - b)} ${(r - 4) * Math.sin(a - b)} L ${l * Math.cos(a)} ${l * Math.sin(a)} L ${(r - 4) * Math.cos(a + b)} ${(r - 4) * Math.sin(a + b)} Z`;
  }).join(" ");
  const L = limbsAndFeet(r, pose, s);
  return (
    <Boil t={t}>
      <g transform={`translate(${x} ${y}) scale(${s / k} ${s * k})`}>
        {L.back}
        <path d={rays} fill={C.white} {...INK} />
        <circle r={r} fill={C.white} {...INK} />
        <clipPath id={`${id}-b`}>
          <circle r={r} />
        </clipPath>
        <g clipPath={`url(#${id}-b)`}>
          <path d={`M ${r + 10} ${-r} A ${r * 1.6} ${r * 1.6} 0 0 1 ${-r} ${r + 10} L ${r + 20} ${r + 20} Z`} fill={C.light} />
        </g>
        <circle r={r} fill="none" {...INK} />
        <Eye x={-44} y={-24} look={pose.look} />
        {pose.wink ? <path d={`M 14 -24 Q 44 -6 74 -24`} fill="none" {...INK} strokeWidth={8} /> : <Eye x={44} y={-24} look={pose.look} />}
        <Mouth x={0} y={46} w={62} kind={pose.mouth ?? "smile"} />
        {L.front}
      </g>
    </Boil>
  );
};

/** The air molecule: two atoms joined by a bond, a big white one that carries the face and a small grey one on top. */
export const Molly: React.FC<{ x: number; y: number; s?: number; t: number; pose: Pose; id: string; stretch?: number }> = ({ x, y, s = 1, t, pose, id, stretch = 1 }) => {
  const r = 116;
  const k = breath(t) * stretch;
  const L = limbsAndFeet(r, { feet: [[-80, r + 104], [80, r + 104]], ...pose }, s);
  return (
    <Boil t={t}>
      <g transform={`translate(${x} ${y}) scale(${s / k} ${s * k})`}>
        {L.back}
        <path d="M 0 -110 L 0 -150" fill="none" stroke={C.ink} strokeWidth={E.limb + 6} strokeLinecap="round" />
        <circle cx={0} cy={-196} r={56} fill={C.mid} {...INK} />
        <circle r={r} fill={C.white} {...INK} />
        <clipPath id={`${id}-m`}>
          <circle r={r} />
        </clipPath>
        <g clipPath={`url(#${id}-m)`}>
          <path d={`M ${r + 10} ${-r} A ${r * 1.6} ${r * 1.6} 0 0 1 ${-r} ${r + 10} L ${r + 20} ${r + 20} Z`} fill={C.light} />
        </g>
        <circle r={r} fill="none" {...INK} />
        <Eye x={-40} y={-26} rx={32} ry={44} look={pose.look} />
        <Eye x={40} y={-26} rx={32} ry={44} look={pose.look} />
        <Mouth x={0} y={46} w={50} kind={pose.mouth ?? "o"} />
        {L.front}
      </g>
    </Boil>
  );
};

/** A breathing cloud with a face. */
export const Cloud: React.FC<{ x: number; y: number; s?: number; t: number; face?: boolean }> = ({ x, y, s = 1, t, face = true }) => {
  const k = breath(t);
  const puffs: [number, number, number][] = [[-90, 16, 52], [-34, -22, 66], [36, -18, 62], [94, 18, 48], [0, 26, 66]];
  return (
    <Boil t={t}>
      <g transform={`translate(${x} ${y}) scale(${s / k} ${s * k})`}>
        {puffs.map(([a, b, r], i) => (
          <circle key={`o${i}`} cx={a} cy={b} r={r} fill={C.ink} stroke={C.ink} strokeWidth={E.ink * 2} />
        ))}
        {puffs.map(([a, b, r], i) => (
          <circle key={`f${i}`} cx={a} cy={b} r={r} fill={C.white} />
        ))}
        {face ? (
          <>
            <Eye x={-22} y={-4} rx={14} ry={20} look={[0.6, 0.5]} />
            <Eye x={22} y={-4} rx={14} ry={20} look={[0.6, 0.5]} />
            <Mouth x={0} y={32} w={18} />
          </>
        ) : null}
      </g>
    </Boil>
  );
};

/** A rotating sunburst of grey wedges behind a title. */
export const Burst: React.FC<{ x: number; y: number; t: number; a?: string; b?: string; r?: number }> = ({ x, y, t, a = C.mid, b = C.light, r = 2200 }) => {
  const n = E.wedges;
  const rot = twos(t) * 16;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill={b} />
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2;
        const a1 = a0 + Math.PI / n;
        return <path key={i} d={`M 0 0 L ${r * Math.cos(a0)} ${r * Math.sin(a0)} L ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={a} />;
      })}
    </g>
  );
};

/** The fat script title: white face, heavy ink outline, an ink drop shadow; letters hop in a travelling wave. */
export const Script: React.FC<{ text: string; x: number; y: number; size?: number; t: number; at?: number; hop?: number; fill?: string }> = ({ text, x, y, size = T.title, t, at = 0, hop = 30, fill = C.white }) => {
  const chars = [...text];
  const dyAt = (i: number) => {
    const u = t - at - i * S.motion.stagger;
    if (u < 0) return 400;
    return -Math.max(0, Math.sin(u * 7)) * hop * Math.exp(-u * 1.9) - (1 - pop(u)) * 200;
  };
  let prev = 0;
  const dys = chars.map((_, i) => {
    const v = dyAt(i);
    const d = v - prev;
    prev = v;
    return d.toFixed(1);
  });
  const common = { fontFamily: SCRIPT, fontSize: size, textAnchor: "middle" as const, dy: dys.join(" ") };
  const line = size * T.outline;
  return (
    <g>
      <text x={x + size * 0.055} y={y + size * 0.06} {...common} fill={C.ink} stroke={C.ink} strokeWidth={line} strokeLinejoin="round">
        {text}
      </text>
      <text x={x} y={y} {...common} fill={fill} stroke={C.ink} strokeWidth={line} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
        {text}
      </text>
    </g>
  );
};

/** Caps sub-line. */
export const Caps: React.FC<{ text: string; x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; stroke?: boolean }> = ({ text, x, y, size = T.sub, fill = C.white, anchor = "middle", stroke = true }) => (
  <text x={x} y={y} fontFamily={CAPS} fontSize={size} fill={fill} textAnchor={anchor} stroke={stroke ? C.ink : undefined} strokeWidth={stroke ? size * 0.14 : undefined} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
    {text}
  </text>
);

/** The subtitle plate: near-black, a white double rule, dot-and-ring corners; pops on and off, no fades. */
export const Plate: React.FC<{ lines: string[]; t: number; at: number; y?: number; size?: number }> = ({ lines, t, at, y = style.layout.plateY, size = T.body }) => {
  if (t < at) return null;
  const w = Math.min(960, Math.max(...lines.map((l) => l.length)) * size * 0.56 + 110);
  const h = lines.length * size * 1.24 + 64;
  const x = (W - w) / 2;
  const top = y - h / 2;
  const corners: [number, number][] = [[x + 18, top + 18], [x + w - 18, top + 18], [x + 18, top + h - 18], [x + w - 18, top + h - 18]];
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={C.plate} opacity={0.92} />
      <rect x={x + 8} y={top + 8} width={w - 16} height={h - 16} fill="none" stroke={C.white} strokeWidth={3} />
      <rect x={x + 15} y={top + 15} width={w - 30} height={h - 30} fill="none" stroke={C.white} strokeWidth={1.4} />
      {corners.map(([a, b], i) => (
        <g key={i}>
          <circle cx={a} cy={b} r={11} fill={C.plate} stroke={C.white} strokeWidth={2} />
          <circle cx={a} cy={b} r={3.5} fill={C.white} />
        </g>
      ))}
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={top + 32 + size * 0.95 + i * size * 1.24} fontFamily={SC} fontSize={size} fill={C.white} textAnchor="middle">
          {l}
        </text>
      ))}
    </g>
  );
};

/** A grey watercolour backdrop: a wash with soft blotches and darker edges, then whatever is painted on it. Never boils. */
export const Wash: React.FC<{ fill?: string; children?: React.ReactNode }> = ({ fill = C.light, children }) => (
  <g>
    <rect width={W} height={H} fill={fill} />
    <rect width={W} height={H} filter="url(#rh-wash)" />
    {children}
  </g>
);

/** The stage's far hill, picket fence and floor. */
export const Field: React.FC<{ y?: number }> = ({ y = 1240 }) => (
  <g>
    <path d={`M -20 ${y - 40} Q 240 ${y - 240} 560 ${y - 90} T 1120 ${y - 150} L 1120 ${y + 40} L -20 ${y + 40} Z`} fill={C.mid} stroke={C.dark} strokeWidth={3} />
    <rect x={-10} y={y} width={W + 20} height={H - y + 10} fill={C.darkMid} />
    {Array.from({ length: 13 }, (_, i) => (
      <path key={i} d={`M ${i * 92 - 20} ${y + 4} L ${i * 92 - 20} ${y - 74} L ${i * 92 + 8} ${y - 110} L ${i * 92 + 36} ${y - 74} L ${i * 92 + 36} ${y + 4} Z`} fill={C.paper} stroke={C.dark} strokeWidth={3} />
    ))}
    <rect x={-10} y={y - 60} width={W + 20} height={14} fill={C.paper} stroke={C.dark} strokeWidth={3} />
    {Array.from({ length: 14 }, (_, j) =>
      Array.from({ length: 12 }, (_, i) => ((i + j) % 2 === 0 ? <rect key={`${i}-${j}`} x={i * 100 - 30} y={y + 6 + j * 56} width={100} height={56} fill={C.dark} opacity={0.55} /> : null)),
    )}
  </g>
);

/** Film damage inside the print: hairline scratches, dust and an occasional hair, changing every frame. */
const Damage: React.FC<{ frame: number }> = ({ frame }) => {
  const r = seeded(frame * 2654435 + 17);
  const n = Math.floor(r() * (S.finish.scratches + 1));
  const scratches = Array.from({ length: n }, () => ({ x: r() * W, w: 1 + r() * 1.6, d: (r() - 0.5) * 14, c: r() < 0.7 }));
  const dust = Array.from({ length: 3 + Math.floor(r() * (S.finish.dust - 2)) }, () => ({ x: r() * W, y: r() * H, r: 1.2 + r() * 3.4, c: r() < 0.5 }));
  const hair = r() < 0.2;
  const hx = r() * W;
  const hy = r() * H;
  return (
    <g>
      {scratches.map((s, i) => (
        <path key={i} d={`M ${s.x} 0 Q ${s.x + s.d} ${H / 2} ${s.x + s.d / 3} ${H}`} fill="none" stroke={s.c ? C.white : C.ink} strokeWidth={s.w} opacity={0.32} />
      ))}
      {dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c ? C.white : C.ink} opacity={0.65} />
      ))}
      {hair ? <path d={`M ${hx} ${hy} q 30 -40 60 -8 t 50 34`} fill="none" stroke={C.ink} strokeWidth={1.6} opacity={0.65} /> : null}
    </g>
  );
};

/** The gate and the print: everything inside weaves and flickers together. Waits for the fonts. */
export const Film: React.FC<{ children: React.ReactNode; jump?: boolean }> = ({ children }) => {
  useFontsReady(FACES);
  const frame = useCurrentFrame();
  const r = seeded(frame * 7919 + 1);
  const wv = S.finish.weave;
  const dx = (r() - 0.5) * 2 * wv;
  const dy = (r() - 0.5) * 2 * wv + (r() < 0.03 ? 4 : 0);
  const flick = 1 + (r() - 0.5) * 2 * S.finish.flicker;
  const { inset, radius } = style.layout.gate;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bezel }}>
      <div
        style={{
          position: "absolute",
          left: inset,
          top: inset,
          right: inset,
          bottom: inset,
          borderRadius: radius,
          overflow: "hidden",
          filter: `blur(${S.finish.blur}px) contrast(${S.finish.contrast}) brightness(${flick.toFixed(3)})`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", left: -inset + dx, top: -inset + dy }}>
          <defs>
            {[0, 1, 2].map((d) => (
              <filter key={d} id={`rh-boil${d}`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={d * 7 + 2} />
                <feDisplacementMap in="SourceGraphic" scale={E.boil * 2} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            ))}
            <filter id="rh-wash" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
              <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={5} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 1.1 -0.45" />
            </filter>
          </defs>
          {children}
          <Damage frame={frame} />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${S.finish.vignette}) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, boxShadow: "inset 0 0 40px rgba(0,0,0,0.75)" }} />
      </div>
      <Finish grain={S.finish.grain} vignette={0} width={W} height={H} />
    </AbsoluteFill>
  );
};

export { clamp };
