/** Night-sky Classroom on the shared sample content: title, headline, diagram, number, list, and the day-sky payoff. */
import React from "react";
import { expoOut, fit, lerp, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import {
  Body,
  Burst,
  C,
  COLUMN,
  E,
  ease,
  Eyebrow,
  Frame,
  GlowBar,
  Ground,
  Headline,
  Hill,
  Kid,
  kidHead,
  M,
  Molecules,
  Pill,
  Ray,
  S,
  scatterDots,
  Sparkle,
  SPECTRUM,
  Sun,
  TOP,
  W,
  Wave,
} from "./parts";
import { DISPLAY } from "./fonts";

const HEAD_Y = S.layout.headlineY;
const chapter = (n: number, title: string) => `${String(n).padStart(2, "0")}  —  ${title}`;
/** Headline size: the style's size, lowered so the longest line fits the column, never under the floor. */
const sizeFor = (lines: string[], max: number) => Math.max(S.type.minDisplay, fit(lines, COLUMN, max, S.type.charEm));
/** "Blue, in every direction" → "Blue, in every *direction*": the key word is set heavier. */
const starLast = (s: string) => s.replace(/(\S+)$/, "*$1*");

/** Title: the night ground, a glowing sun sending a travelling rainbow wave across the frame. */
const Title: React.FC = () => {
  const t = useSeconds();
  const size = S.type.title;
  const lines = wrap(SAMPLE.title, Math.floor(COLUMN / (size * S.type.charEm)));
  const sun = { x: 150, y: 1180 };
  const x1 = lerp(sun.x, W, ease("draw", t - 0.5));
  return (
    <Ground>
      <Eyebrow text={SAMPLE.kicker} y={TOP} at={0.1} rule />
      <Frame>
        <defs>
          <linearGradient id="nsc-rainbow" x1={sun.x + 62} y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            {SPECTRUM.map((c, i) => (
              <stop key={c.name} offset={i / (SPECTRUM.length - 1)} stopColor={c.hex} />
            ))}
          </linearGradient>
        </defs>
        <Wave kind="rainbow" x0={sun.x} x1={x1} y={sun.y} t={t} stroke="url(#nsc-rainbow)" />
      </Frame>
      <Sun x={sun.x} y={sun.y} r={62} alpha={expoOut(t / 0.6)} />
      <Headline lines={lines} size={size} y={HEAD_Y} at={0.3} />
    </Ground>
  );
};

/** Headline: a white sunbeam fans out into the six colours, each named on a pill. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const size = sizeFor(SAMPLE.headline, S.type.display);
  const SUN_X = 150;
  const BEAM_Y = 1080;
  const SPLIT_X = 430;
  const FAN_X = 760;
  const FAN_TOP = 860;
  const step = E.fan.step;
  const beam = ease("beam", t - 0.2);
  const fan = ease("fan", t - 0.8);
  const beamEnd = lerp(SUN_X + 60, SPLIT_X, beam);
  return (
    <Ground>
      <Eyebrow text={chapter(1, SAMPLE.chapter)} y={TOP} at={0.1} rule />
      <Sun x={SUN_X} y={BEAM_Y} r={62} alpha={expoOut(t / 0.6)} />
      <Frame>
        <line x1={SUN_X + 60} y1={BEAM_Y} x2={beamEnd} y2={BEAM_Y} stroke={C.sun} strokeOpacity={E.beam.glowOpacity} strokeWidth={E.beam.glow} strokeLinecap="round" />
        <line x1={SUN_X + 60} y1={BEAM_Y} x2={beamEnd} y2={BEAM_Y} stroke={C.beam} strokeWidth={E.beam.core} strokeLinecap="round" />
        {fan > 0
          ? SPECTRUM.map((c, i) => {
              const yEnd = FAN_TOP + i * step;
              const xe = lerp(SPLIT_X, FAN_X, fan);
              const ye = lerp(BEAM_Y, yEnd, fan);
              const y0 = BEAM_Y - 12 + (i * 24) / (SPECTRUM.length - 1);
              const pts = `${SPLIT_X},${y0 - 2} ${xe},${ye - E.fan.half * fan} ${xe},${ye + E.fan.half * fan} ${SPLIT_X},${y0 + 2}`;
              return (
                <g key={c.name}>
                  <polygon points={pts} fill={c.hex} opacity={E.fan.glowOpacity} style={{ filter: `blur(${E.fan.blur}px)` }} />
                  <polygon points={pts} fill={c.hex} />
                </g>
              );
            })
          : null}
      </Frame>
      {SPECTRUM.map((c, i) => (
        <Pill key={c.name} text={c.name} dot={c.hex} x={FAN_X + 26} y={FAN_TOP + i * step + 20} at={1.3 + i * 0.14} />
      ))}
      <Headline lines={SAMPLE.headline} size={size} y={HEAD_Y} at={0.5} />
    </Ground>
  );
};

/** Diagram: air molecules fill the frame; a blue wave hits one and blue sparks fly off in every direction. */
const HIT = { x: 600, y: 1130 };
const LANE = 90;
const DOTS = scatterDots(44, 4, { x0: 70, y0: 760, x1: 1010, y1: 1500 }).filter((d) => Math.abs(d.y - HIT.y) > LANE || d.x > HIT.x + 60);
const NEAR = DOTS.filter((d) => Math.hypot(d.x - HIT.x, d.y - HIT.y) < 380).slice(0, 6);

const Diagram: React.FC = () => {
  const t = useSeconds();
  const go = 1.0; // the blue wave sets off
  const front = HIT.x * ease("travel", t - go);
  const hitAt = go + S.motion.recipes.travel.duration * 0.6;
  const every = S.motion.burstEvery;
  const lines = wrap(starLast(SAMPLE.diagram.out), Math.floor(COLUMN / (S.type.display * S.type.charEm)));
  return (
    <Ground>
      <Eyebrow text={chapter(2, "How it works")} y={TOP} at={0.1} rule />
      <Frame>
        <Molecules dots={DOTS} t={t} start={0.1} />
        <Wave kind="hit" x0={0} x1={front} y={HIT.y} t={t} stroke={C.accent2} />
        {Array.from({ length: 8 }, (_, k) => (
          <Burst key={k} x={HIT.x} y={HIT.y} age={t - hitAt - k * every} stroke={C.accent2} size={1.1} turn={k * 0.4} />
        ))}
        <Sparkle dots={NEAR} t={t} start={hitAt + 0.5} stroke={C.accent2} period={1.3} size={0.65} />
        <Molecules dots={[{ ...HIT, r: 16 }]} t={t} start={0.1} spread={0} />
      </Frame>
      <Pill text={SAMPLE.diagram.in} dot={C.sun} x={M} y={HIT.y - 120} at={0.9} />
      <Pill text={SAMPLE.diagram.label} dot={C.accent2} x={W - M} y={HIT.y - 250} align="right" at={hitAt + 0.3} />
      <Pill text={SAMPLE.diagram.object} x={W / 2} y={1560} align="center" at={1.4} />
      <Headline lines={lines} size={sizeFor(lines, S.type.display)} y={HEAD_Y} at={0.3} />
    </Ground>
  );
};

/** Number: the count in heavy Fredoka, then two glowing bars that compare blue and red. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.4);
  const size = S.type.number;
  const y = 820;
  const barA = (at: number) => ease("pill", t - at);
  return (
    <Ground>
      <Eyebrow text={chapter(3, "By the numbers")} y={TOP} at={0.1} rule />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - size * 0.78,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: S.type.emphasisWeight,
          fontSize: size,
          lineHeight: 1,
          color: C.text,
          opacity: expoOut((t - 0.2) / 0.4),
        }}
      >
        {(n.value * p).toFixed(n.decimals)}
        <span style={{ fontWeight: S.type.weight }}>{n.unit}</span>
      </div>
      <Body text={n.caption} y={1000} at={0.9} width={COLUMN} />
      <Frame>
        <GlowBar x={M} y={1300} width={COLUMN} frac={p} stroke={C.accent2} alpha={barA(1.0)} />
        <GlowBar x={M} y={1500} width={COLUMN} frac={p / n.value} stroke={C.red} alpha={barA(1.1)} />
      </Frame>
      <Pill text="blue · 450 nm" dot={C.accent2} x={M} y={1230} at={1.0} />
      <Pill text="red · 700 nm" dot={C.red} x={M} y={1430} at={1.1} />
    </Ground>
  );
};

/** List: three steps down a dashed path, each with a small glowing picture. */
const SunIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => <Sun x={x} y={y} r={34} />;

const EyeIcon: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const w = 62;
  const h = 34;
  return (
    <g>
      {[-1, 0, 1].map((k) => (
        <Ray key={k} x0={x + k * 90} y0={y - 120} x1={x + k * 24} y1={y - 44} stroke={C.accent2} t={t} at={0} offset={k * 0.33} />
      ))}
      <path d={`M ${x - w} ${y} Q ${x} ${y - 2 * h} ${x + w} ${y} Q ${x} ${y + 2 * h} ${x - w} ${y} Z`} fill={C.bg} stroke={C.text} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={x} cy={y} r={22} fill={C.accent2} />
      <circle cx={x} cy={y} r={9} fill={C.bg} />
      <circle cx={x + 8} cy={y - 8} r={5} fill={C.text} />
    </g>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const size = S.type.list;
  const ICON_X = 190;
  const TEXT_X = 300;
  const maxChars = Math.floor((W - M - TEXT_X - 84) / (size * S.type.charEm));
  const rows = SAMPLE.list.map((item, i) => ({ item, y: 730 + i * 340, at: 0.3 + i * 0.45 }));
  return (
    <Ground>
      <Eyebrow text={chapter(4, "In three steps")} y={TOP} at={0.1} rule />
      <Frame>
        {rows.slice(1).map((r, i) => {
          const a = rows[i];
          const d = ease("draw", t - r.at + 0.1);
          return d > 0 ? (
            <line key={i} x1={ICON_X} y1={a.y + 80} x2={ICON_X} y2={lerp(a.y + 80, r.y - 140, d)} stroke={C.muted} strokeOpacity={E.ray.opacity} strokeWidth={E.ray.width} strokeDasharray={E.ray.dash.join(" ")} strokeLinecap="round" />
          ) : null;
        })}
        {rows[1] && ease("pop", t - rows[1].at) > 0 ? (
          <g opacity={ease("pop", t - rows[1].at)}>
            <Burst x={ICON_X} y={rows[1].y} age={(t - rows[1].at - 0.25) % S.motion.sparkEvery} stroke={C.accent2} size={0.62} />
            <circle cx={ICON_X} cy={rows[1].y} r={E.molecule.r[1] * 1.6 * E.molecule.halo} fill={C.text} opacity={E.molecule.haloOpacity} />
            <circle cx={ICON_X} cy={rows[1].y} r={E.molecule.r[1] * 1.6} fill={C.text} opacity={E.molecule.opacity} />
          </g>
        ) : null}
        {rows[2] && ease("pop", t - rows[2].at) > 0 ? (
          <g opacity={ease("pop", t - rows[2].at)}>
            <EyeIcon x={ICON_X} y={rows[2].y} t={t - rows[2].at} />
          </g>
        ) : null}
      </Frame>
      {ease("pop", t - rows[0].at) > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease("pop", t - rows[0].at) }}>
          <SunIcon x={ICON_X} y={rows[0].y} />
        </div>
      ) : null}
      {rows.map((r, i) => {
        const lines = wrap(r.item, maxChars);
        return <Headline key={i} lines={lines} size={size} x={TEXT_X} align="left" y={r.y - (lines.length * size * S.type.leading) / 2 + size * 0.78} at={r.at + 0.1} />;
      })}
    </Ground>
  );
};

/** End: the payoff. The ground has turned into the day sky; blue sparkles everywhere, and blue reaches the child's eyes. */
const SKY_DOTS = scatterDots(16, 11, { x0: 90, y0: 760, x1: 990, y1: 1200 });
const RAY_FROM = [0, 3, 6, 9, 12].map((i) => SKY_DOTS[i]);

const End: React.FC = () => {
  const t = useSeconds();
  const size = sizeFor([SAMPLE.end.line], S.type.title);
  const head = kidHead();
  return (
    <Ground day={1}>
      <Sun x={850} y={860} r={E.sun.r} alpha={expoOut(t / 0.6)} />
      <Frame>
        <Sparkle dots={SKY_DOTS} t={t} start={0.3} stroke={C.paleBlue} />
        {RAY_FROM.map((d, i) => (
          <Ray key={i} x0={d.x} y0={d.y} x1={head.x} y1={head.y} stroke={C.paleBlue} t={t} at={0.8 + i * 0.12} offset={i * 0.37} />
        ))}
        <Hill />
        <Kid />
      </Frame>
      <Headline lines={[SAMPLE.end.line]} size={size} y={HEAD_Y} at={0.2} />
      <Pill text={SAMPLE.end.cta} x={W / 2} y={HEAD_Y + 170} align="center" at={1.0} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.6, component: Title },
  { id: "headline", duration: 3.6, hero: 3.1, component: HeadlineSample },
  { id: "diagram", duration: 3.8, hero: 3.2, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.7, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.9, component: List },
  { id: "end", duration: 3.4, hero: 2.8, component: End },
];
