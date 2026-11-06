/**
 * Game Show on the shared sample content, played as a quiz: the title round with three light contestants, the Sun
 * hosting "every colour", an air molecule scattering blue, the score race, the recap board and the winner's ending.
 * Every entrance lands on a beat of motion.bpm.
 */
import React from "react";
import { plain, SAMPLE, useSeconds, type Sample } from "../../kit";
import { Ball, BEAT, Bean, beat, Burst, C, Card, E, ease, FLOOR, Frame, Ink, Judgement, M, Pill, pop, S, Set, Telop, W } from "./parts";
import { DISPLAY } from "./fonts";

const T = S.type;
const COLUMN = W - 2 * M;

const Title: React.FC = () => (
  <Set set="orange">
    <Pill text={SAMPLE.kicker.toUpperCase()} x={W / 2} y={292} at={beat(0) + 0.05} align="center" />
    <Telop lines={["Why is", "the sky", "*blue?*"]} size={T.title + 20} y={410} at={beat(1)} />
    <Frame>
      <Bean kind="red" x={225} y={FLOOR} s={1.2} tag="RED" at={beat(2)} />
      <Bean kind="green" x={540} y={FLOOR} s={1.2} tag="GREEN" at={beat(3)} phase={0.5} />
      <Bean kind="blue" x={855} y={FLOOR} s={1.2} tag="BLUE" at={beat(4)} />
    </Frame>
  </Set>
);

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const balls = [C.red, C.orange, C.yellow, C.green, C.blue, C.pink];
  const d = 84;
  const x0 = 455;
  const gap = 100;
  return (
    <Set set="teal">
      <Telop lines={["Sunlight", "carries", "every colour", "*at once.*"]} size={T.display - 4} y={262} at={beat(0) + 0.05} />
      <Frame>
        <Bean kind="sun" x={220} y={FLOOR} s={1.15} tag="SUN" pose="shout" at={beat(1)} hop={E.hop[0]} />
        {balls.map((col, i) => {
          const at = beat(3) + (i * BEAT) / 2;
          const age = t - at;
          if (age < 0) return null;
          const dr = S.motion.recipes.drop;
          const fall = age < dr.duration ? (1 - ease("drop", age)) * dr.distance : 0;
          const land = age - dr.duration;
          const sq = land >= 0 ? 1 - S.motion.recipes.squash.depth * Math.exp(-land * S.motion.recipes.squash.decay * 2.5) : 1;
          return <Ball key={i} x={x0 + i * gap} y={FLOOR - fall} col={col} d={d} squash={sq} />;
        })}
      </Frame>
    </Set>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [sx, sy] = [858, 640];
  const [bx, by] = [500, FLOOR];
  const head = by - 150 * 1.15;
  const beamAt = beat(2);
  const beam = ease("fly", t - beamAt);
  const hitAt = beamAt + S.motion.recipes.fly.duration * 0.6;
  const ex = sx + (bx + 40 - sx) * beam;
  const ey = sy + (head - sy) * beam;
  const angles = [-180, -150, -122, -90, -58, -30, 0].map((a) => (a * Math.PI) / 180);
  const life = S.motion.recipes.fly.duration;
  const waves: React.ReactNode[] = [];
  for (let k = 0; k < 10; k++) {
    const at = hitAt + k * BEAT;
    const age = t - at;
    if (age < 0 || age > life) continue;
    const p = ease("fly", age);
    angles.forEach((a, i) => {
      const r = 120 + 330 * p;
      waves.push(<Ball key={`${k}-${i}`} x={bx + r * Math.cos(a)} y={head + 40 + r * Math.sin(a) + 30} col={C.blue} d={58} />);
    });
  }
  const burstAge = t >= hitAt ? (t - hitAt) % BEAT : -1;
  const sun = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? 130 : 96;
    return `${sx + r * Math.cos(a)},${sy + r * Math.sin(a)}`;
  }).join(" ");
  const sunP = pop("pop", t - beat(1));
  return (
    <Set set="purple">
      <Card x={M} y={250} w={800} h={196} radius={36} outline={E.outline} shadow={E.shadowSticker} at={beat(0) + 0.05} from="left" tilt={-1.5}>
        <Ink text="ROUND 2" size={T.label} x={40} y={26} w={700} align="left" col={C.purple} />
        <Ink text={SAMPLE.diagram.label} size={66} x={40} y={82} w={720} align="left" />
      </Card>
      <Frame>
        {beam > 0 ? (
          <g>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={C.ink} strokeWidth={62} strokeLinecap="round" />
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={C.white} strokeWidth={44} strokeLinecap="round" />
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={C.yellow} strokeWidth={18} strokeLinecap="round" />
          </g>
        ) : null}
        {sunP > 0 ? (
          <g transform={`translate(${sx} ${sy}) scale(${sunP}) translate(${-sx} ${-sy})`}>
            <polygon points={sun} fill={C.orange} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
            <circle cx={sx} cy={sy} r={84} fill={C.yellow} stroke={C.ink} strokeWidth={8} />
            <ellipse cx={sx - 24} cy={sy - 10} rx={9} ry={14} fill={C.ink} />
            <ellipse cx={sx + 24} cy={sy - 10} rx={9} ry={14} fill={C.ink} />
            <path d={`M ${sx - 18} ${sy + 22} Q ${sx} ${sy + 40} ${sx + 18} ${sy + 22}`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
            <rect x={sx - 150 - 232} y={sy - 25} width={232} height={50} rx={25} fill={C.ink} />
            <text x={sx - 150 - 116} y={sy + 12} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={T.tag} fill={C.white} letterSpacing={1}>
              {SAMPLE.diagram.in.toUpperCase()}
            </text>
          </g>
        ) : null}
        {burstAge >= 0 ? <Burst x={bx} y={head + 10} age={burstAge} size={1.05} /> : null}
        {waves}
        <Bean kind="air" x={bx} y={by} s={1.15} pose={t >= hitAt ? "shout" : "idle"} tag={SAMPLE.diagram.object.toUpperCase()} at={beat(0)} />
      </Frame>
    </Set>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  // the counter races to the true value in steps of an eighth of a beat
  const raceAt = beat(1);
  const steps = 8 * 2;
  const k = Math.max(0, Math.min(steps, Math.floor((t - raceAt) / (BEAT / 8)) + 1));
  const value = ((n.value * k) / steps).toFixed(n.decimals);
  // bars grow one segment per beat
  const growAt = beat(4);
  const segs = 6;
  const g = Math.max(0, Math.min(segs, Math.floor((t - growAt) / BEAT) + 1));
  const full = COLUMN - 120;
  const bar = (label: string, frac: number, col: string, y: number) => (
    <>
      <Ink text={label} size={T.label + 4} x={48} y={y} w={700} align="left" weight={700} />
      <div style={{ position: "absolute", left: 48, top: y + 58, width: full, height: 46, borderRadius: 23, backgroundColor: C.grey, border: `6px solid ${C.ink}`, boxSizing: "border-box" }} />
      {g > 0 ? (
        <div style={{ position: "absolute", left: 48, top: y + 58, width: Math.max(46, full * frac * (g / segs)), height: 46, borderRadius: 23, backgroundColor: col, border: `6px solid ${C.ink}`, boxSizing: "border-box" }} />
      ) : null}
    </>
  );
  return (
    <Set set="pink" floor={false}>
      <Pill text="BLUE vs RED" x={W / 2} y={262} at={beat(0) + 0.05} align="center" col={C.white} />
      {t >= raceAt ? <Telop lines={[`${value}*${n.unit}*`]} size={T.number} y={372} at={raceAt} /> : null}
      <Judgement text="Perfect!" y={700} at={raceAt + 2 * BEAT + BEAT} />
      <Card x={M} y={920} w={COLUMN} h={500} radius={E.board.radius} outline={E.board.outline} at={beat(3)} tilt={E.board.tilt}>
        <Ink text={n.caption.replace(" than", "\nthan")} size={T.body - 6} x={48} y={34} w={COLUMN - 96} align="left" weight={600} leading={1.15} />
        {bar("Blue · 450 nm", 1, C.blue, 170)}
        {bar("Red · 700 nm", 1 / n.value, C.red, 310)}
      </Card>
    </Set>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const rowH = 196;
  const y0 = 370;
  const gap = 240;
  return (
    <Set set="green">
      <Pill text="IN 3 STEPS" x={W / 2} y={262} at={beat(0) + 0.05} align="center" />
      {SAMPLE.list.map((item, i) => {
        const at = beat(1 + i * 2);
        const stamp = pop("pop", t - at - BEAT);
        return (
          <Card key={i} x={M} y={y0 + i * gap} w={COLUMN} h={rowH} radius={40} outline={E.outline} shadow={E.shadowCard} at={at}>
            <div style={{ position: "absolute", left: 32, top: (rowH - 16 - 100) / 2, width: 100, height: 100, borderRadius: 50, backgroundColor: C.ink }} />
            <Ink text={String(i + 1)} size={64} x={32} y={(rowH - 16 - 100) / 2 + 14} w={100} col={C.yellow} />
            <Ink text={item} size={T.body + 2} x={160} y={(rowH - 16) / 2 - (plain(item).length > 22 ? 56 : 28)} w={590} align="left" leading={1.08} />
            {stamp > 0 ? (
              <svg width={120} height={120} style={{ position: "absolute", left: COLUMN - 20 - 140, top: (rowH - 16 - 120) / 2, transform: `scale(${stamp}) rotate(-12deg)`, overflow: "visible" }}>
                <circle cx={60} cy={60} r={50} fill={C.yellow} stroke={C.ink} strokeWidth={7} />
                <path d="M 36 62 L 54 80 L 86 42" fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </Card>
        );
      })}
      <Frame>
        <Bean kind="blue" x={W / 2} y={FLOOR} s={1.15} tag="BLUE" pose="shout" at={beat(6)} />
      </Frame>
    </Set>
  );
};

const End: React.FC = () => (
  <Set set="navy">
    <Telop lines={["Look up", "*again.*"]} size={T.title + 40} y={360} at={beat(0) + 0.05} />
    <Pill text={SAMPLE.end.cta} x={W / 2} y={810} size={52} at={beat(3)} align="center" col={C.white} />
    <Frame>
      <Bean kind="red" x={215} y={FLOOR} s={1.15} tag="RED" at={beat(1)} phase={0.5} />
      <Bean kind="blue" x={540} y={FLOOR} s={1.32} tag="BLUE" pose="shout" at={beat(1)} hop={E.hop[1]} />
      <Bean kind="green" x={865} y={FLOOR} s={1.15} tag="GREEN" at={beat(1)} phase={0.5} />
    </Frame>
  </Set>
);

/** Hero frames sit just after a beat, so hopping contestants have landed. */
const heroAt = (n: number) => beat(n) + 0.03;

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: heroAt(7), component: Title },
  { id: "headline", duration: 3.6, hero: heroAt(8), component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: beat(7) + 0.2, component: Diagram },
  { id: "number", duration: 3.6, hero: heroAt(8), component: NumberSample },
  { id: "list", duration: 4.0, hero: heroAt(9), component: List },
  { id: "end", duration: 3.2, hero: heroAt(7), component: End },
];
