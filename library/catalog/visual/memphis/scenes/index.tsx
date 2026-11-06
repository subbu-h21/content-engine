/**
 * Memphis on the shared sample content: the model town under its painted sky (title), a fan of paper strips in every
 * colour (headline), an air molecule on a rod scattering blue zigzags (diagram), two patterned columns as the 5.9× chart
 * (number), numbered callouts (list) and the town at night (end).
 */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import {
  Backdrop,
  BoxShadow,
  C,
  Callout,
  ease,
  growK,
  House,
  Lamp,
  Lines,
  Marks,
  Page,
  pt,
  pts,
  River,
  S,
  Slab,
  SPECTRUM,
  Strip,
  tone,
  Tree,
  Zigzag,
  backK,
  type HouseSpec,
  type TreeKind,
} from "./parts";

const SUN: [number, number] = [230, 360];
const HOUSES: Record<"a" | "b" | "c", HouseSpec> = {
  c: { x: 90, y: 40, w: 190, d: 120, h: 150, wall: C.mint, roof: C.lilac, awning: C.pink },
  a: { x: 160, y: 400, w: 160, d: 110, h: 120, wall: C.pink, roof: C.cobalt },
  b: { x: 470, y: 150, w: 150, d: 100, h: 110, wall: C.yellow, roof: C.coral, awning: C.mint },
};
const TREES: { kind: TreeKind; x: number; y: number; s: number }[] = [
  { kind: "cloud", x: 470, y: 470, s: 0.9 },
  { kind: "column", x: 370, y: 250, s: 0.85 },
  { kind: "egg", x: 965, y: 120, s: 0.9 },
  { kind: "cone", x: 380, y: 40, s: 0.95 },
  { kind: "round", x: 690, y: 20, s: 0.8 },
];

/** The model town: river, shadows, houses (back to front), trees, lamp; things grow in from `start`. */
const Town: React.FC<{ start?: number; night?: number; houses?: ("a" | "b" | "c")[]; trees?: number[]; extra?: React.ReactNode }> = ({
  start = 0.3,
  night = 0,
  houses = ["a", "b", "c"],
  trees = [0, 1, 2, 3, 4],
  extra,
}) => {
  const t = useSeconds();
  const g = (i: number) => growK(t - start - i * S.motion.stagger);
  const hs = houses.map((id, i) => ({ id, spec: HOUSES[id], k: g(i) })).sort((a, b) => b.spec.y - a.spec.y);
  return (
    <>
      <River t={t} night={night} />
      {hs.map(({ id, spec, k }) => (k > 0.05 ? <BoxShadow key={`s${id}`} x={spec.x} y={spec.y} w={spec.w} d={spec.d} h={spec.h * Math.min(1, k)} /> : null))}
      {[...trees]
        .sort((a, b) => TREES[b].y - TREES[a].y)
        .map((i) => {
          const tr = TREES[i];
          return <Tree key={`t${i}`} kind={tr.kind} x={tr.x} y={tr.y} s={tr.s} k={g(3 + i)} night={night} />;
        })}
      {hs.map(({ id, spec, k }) => (
        <House key={id} spec={spec} k={k} night={night} />
      ))}
      <Lamp x={318} y={16} night={night} />
      {extra}
    </>
  );
};

const Sun: React.FC<{ at?: number; r?: number }> = ({ at = 0.2, r = 64 }) => {
  const k = backK(useSeconds() - at);
  if (k <= 0) return null;
  return <circle cx={SUN[0]} cy={SUN[1]} r={r * k} fill={C.yellow} stroke={C.ink} strokeWidth={S.elements.outline} />;
};

const grow = (t: number) => ease("grow", t);

const Title: React.FC = () => {
  const t = useSeconds();
  return (
    <Page
      grow={grow(t)}
      picture={
        <>
          <Backdrop />
          <Sun />
          <Slab />
          <Town />
        </>
      }
    >
      <Marks at={0.9} />
      <Lines l1={[SAMPLE.title]} l2={[SAMPLE.kicker]} l3="the science · light · air · colour" at={1.1} />
    </Page>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const targets = SPECTRUM.map((_, i) => pt(330 + i * 70, 150 + (i % 2) * 18));
  return (
    <Page
      grow={grow(t)}
      picture={
        <>
          <Backdrop />
          <Slab />
          <Town houses={["a", "b"]} trees={[0, 2, 3]} />
          {SPECTRUM.map((col, i) => (
            <Strip key={i} a={SUN} b={targets[i]} w={30} fill={col} p={ease("grow", t - 0.9 - i * S.motion.stagger)} />
          ))}
          <Sun r={72} />
        </>
      }
    >
      <Marks at={0.9} />
      <Lines l1={wrap(SAMPLE.headline.join(" "), 24)} l3="visible light · 380–700 nm" at={1.1} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const m: [number, number] = [610, 430];
  const r = 78;
  const k = backK(t - 0.5);
  const beam = ease("grow", t - 0.9);
  const hit = 0.9 + S.motion.recipes.grow.duration * 0.7;
  const red = ease("grow", t - hit);
  const dir = [m[0] - SUN[0], m[1] - SUN[1]];
  const ground = pt(450, 420);
  const rays = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2 + 0.25);
  return (
    <Page
      grow={grow(t)}
      picture={
        <>
          <Backdrop />
          <Slab />
          <Town houses={["a", "c"]} trees={[0, 2, 3, 4]} />
          {k > 0 ? (
            <>
              <ellipse cx={ground[0] + 50} cy={ground[1] + 4} rx={70} ry={20} fill="url(#m-halftone)" />
              <line x1={m[0]} y1={m[1] + r * k} x2={m[0]} y2={ground[1]} stroke={C.ink} strokeWidth={4} />
            </>
          ) : null}
          <Strip a={SUN} b={m} w={28} fill={C.yellow} p={beam} />
          {red > 0 ? <Strip a={m} b={[m[0] + dir[0] * 1.3, m[1] + dir[1] * 1.3]} w={18} fill={C.coral} p={red} /> : null}
          {rays.map((a, i) => {
            const p = backK(t - hit - i * 0.04);
            if (p <= 0) return null;
            const d = r + 40 + 70 * Math.min(1, p) + 14 * Math.sin(t * 3 + i);
            return <Zigzag key={i} x={m[0] + d * Math.cos(a)} y={m[1] + d * Math.sin(a)} a={a} len={62 * Math.min(1.1, p)} />;
          })}
          {k > 0 ? (
            <g transform={`translate(${m[0]} ${m[1]}) scale(${k}) translate(${-m[0]} ${-m[1]})`}>
              <circle cx={m[0]} cy={m[1]} r={r} fill={C.lilac} />
              <circle cx={m[0]} cy={m[1]} r={r} fill="url(#m-dots)" />
              <circle cx={m[0]} cy={m[1]} r={r} fill="none" stroke={C.ink} strokeWidth={S.elements.outline} />
            </g>
          ) : null}
          <Sun />
          <Callout from={[m[0] + 54, m[1] - 56]} to={[712, 292]} label={SAMPLE.diagram.object} at={2.0} />
        </>
      }
    >
      <Marks at={0.9} />
      <Lines l1={[SAMPLE.diagram.label]} l2={[SAMPLE.diagram.out]} l3="air · mostly nitrogen and oxygen" at={1.1} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const unit = 58;
  const col = (x: number, h: number, fill: string, pattern: string, at: number) => {
    const k = Math.max(0, growK(t - at));
    const hh = h * k;
    const y = 160;
    const w = 110;
    const d = 90;
    if (hh <= 1) return null;
    const [fx, fy] = pt(x, y);
    return (
      <g>
        <BoxShadow x={x} y={y} w={w} d={d} h={hh} />
        <polygon points={pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, hh], [x + w, y, hh]])} fill={tone(fill, "away")} stroke={C.ink} strokeWidth={S.elements.outline} strokeLinejoin="round" />
        <rect x={fx} y={fy - hh} width={w} height={hh} fill={tone(fill, "sun")} />
        <rect x={fx} y={fy - hh} width={w} height={hh} fill={`url(#${pattern})`} />
        <rect x={fx} y={fy - hh} width={w} height={hh} fill="none" stroke={C.ink} strokeWidth={S.elements.outline} />
        <polygon points={pts([[x, y, hh], [x + w, y, hh], [x + w, y + d, hh], [x, y + d, hh]])} fill={tone(fill, "top")} stroke={C.ink} strokeWidth={S.elements.outline} strokeLinejoin="round" />
      </g>
    );
  };
  const blueTop = pt(255, 205, n.value * unit);
  const redTop = pt(575, 205, unit);
  return (
    <Page
      grow={grow(t)}
      picture={
        <>
          <Backdrop />
          <Sun />
          <Slab />
          <Town houses={[]} trees={[0, 2, 3]} start={0.2} />
          {col(520, unit, C.coral, "m-dots", 0.9)}
          {col(200, n.value * unit, C.cobalt, "m-vstripes", 0.7)}
          <Callout from={[blueTop[0], blueTop[1] - 8]} to={[blueTop[0] + 120, blueTop[1] - 70]} label="Blue · 450 nm" at={1.8} />
          <Callout from={[redTop[0], redTop[1] - 8]} to={[redTop[0] + 90, redTop[1] - 90]} label="Red · 700 nm" at={1.95} />
        </>
      }
    >
      <Marks at={0.9} />
      <Lines l1={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size1={S.type.number} l2={["more scattering for blue (450 nm)", "than red (700 nm)"]} l3="(700/450)^4 = 5.86" at={1.1} />
    </Page>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const m: [number, number] = [720, 400];
  const ground = pt(560, 420);
  const door = pt(185, 40, 60);
  return (
    <Page
      grow={grow(t)}
      picture={
        <>
          <Backdrop />
          <Sun />
          <Slab />
          <Town trees={[0, 2, 3]} />
          <line x1={m[0]} y1={m[1] + 48} x2={m[0]} y2={ground[1]} stroke={C.ink} strokeWidth={4} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Zigzag key={i} x={m[0] + 82 * Math.cos(a)} y={m[1] + 82 * Math.sin(a)} a={a} len={34} width={5} />;
          })}
          <circle cx={m[0]} cy={m[1]} r={48} fill={C.lilac} />
          <circle cx={m[0]} cy={m[1]} r={48} fill="url(#m-dots)" />
          <circle cx={m[0]} cy={m[1]} r={48} fill="none" stroke={C.ink} strokeWidth={S.elements.outline} />
          {[-0.9, -0.3, 0.3, 0.9].map((dx, i) => (
            <Zigzag key={`h${i}`} x={door[0] + dx * 150} y={door[1] - 150 + Math.abs(dx) * 60} a={Math.PI / 2 - dx * 0.6} len={40} width={5} />
          ))}
          <Callout from={[SUN[0] + 50, SUN[1] - 40]} to={[330, 290]} label={SAMPLE.list[0]} num={1} at={0.9} />
          <Callout from={[m[0] - 50, m[1] + 10]} to={[640, 520]} label={SAMPLE.list[1]} num={2} at={1.4} align="right" />
          <Callout from={[door[0] + 40, door[1] + 20]} to={[400, 960]} label={SAMPLE.list[2]} num={3} at={1.9} />
        </>
      }
    >
      <Marks at={0.9} />
      <Lines l1={["In three steps"]} at={1.1} />
    </Page>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const night = 0.8;
  const stars = Array.from({ length: 26 }, (_, i) => {
    const x = 80 + ((i * 337) % 900);
    const y = 260 + ((i * 151) % 340);
    return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 5 : 3} fill={C.light} />;
  });
  return (
    <Page
      grow={grow(t)}
      night={night}
      picture={
        <>
          <Backdrop night={1} />
          {stars}
          <Slab night={night} />
          <Town night={night} start={-2} />
        </>
      }
    >
      <Marks at={0.6} />
      <Lines l1={[SAMPLE.end.line]} l2={[SAMPLE.end.cta]} l3="daily insight · the science" at={0.8} />
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.8, component: Title },
  { id: "headline", duration: 3.4, hero: 3.0, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.2, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.85, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.85, component: List },
  { id: "end", duration: 2.8, hero: 2.4, component: End },
];
