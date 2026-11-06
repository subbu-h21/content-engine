/** Shadow Puppet on the shared sample content: title, headline, diagram, number, list, end. */
import React from "react";
import { SAMPLE, wrap, type Sample } from "../../kit";
import { C, Disc, Figure, Ground, Hide, Placard, Plaque, Press, S, SCREEN, Stage as StageWrap, Strip, Sun, Tag, type Pt } from "./parts";

const RIGHT = SCREEN.x + SCREEN.w - 40;

// ------------------------------------------------------------------ title: a scholar looks up at a carved sun; the question cut from hide

const Title: React.FC = () => (
  <StageWrap over={<Placard lines={[SAMPLE.kicker]} at={2.2} />} lamp={[600, 760]}>
    <Press at={0.1} origin={[540, 1600]} seed={1} tremor={0}>
      <Ground y={1560} />
    </Press>
    <Press at={0.35} origin={[800, 860]} seed={2}>
      <Sun x={800} y={860} r={104} />
    </Press>
    <Press at={0.7} origin={[300, 1300]} seed={3}>
      <Figure x={300} y={1562} s={0.98} />
    </Press>
    <Plaque lines={["WHY IS THE", "SKY BLUE?"]} x={130} y={290} w={820} at={1.2} />
  </StageWrap>
);

// ------------------------------------------------------------------ headline: the sun throws carved rays of every dye

const HeadlineSample: React.FC = () => {
  const sun: Pt = [540, 1080];
  const dyes = [C.vermilion, C.flame, C.ochre, C.jade, C.malachite, C.indigo];
  return (
    <StageWrap over={<Placard lines={wrap(SAMPLE.body, 36)} at={2.4} />} lamp={[540, 980]}>
      <Plaque lines={["SUNLIGHT CARRIES", "EVERY COLOUR", "AT ONCE."]} x={110} y={270} w={860} size={64} at={0.1} />
      {dyes.map((d, i) => {
        const a = ((-170 + i * 32) * Math.PI) / 180;
        const from: Pt = [sun[0] + Math.cos(a) * 150, sun[1] + Math.sin(a) * 150];
        const to: Pt = [sun[0] + Math.cos(a) * 420, sun[1] + Math.sin(a) * 420];
        return (
          <Press key={i} at={1.1 + i * 0.12} origin={to} seed={10 + i}>
            <Strip from={from} to={to} w0={18} w1={46} dye={d} slits={3} />
          </Press>
        );
      })}
      {dyes.map((d, i) => {
        const a = ((10 + i * 32) * Math.PI) / 180;
        const from: Pt = [sun[0] + Math.cos(a) * 150, sun[1] + Math.sin(a) * 150];
        const to: Pt = [sun[0] + Math.cos(a) * 300, sun[1] + Math.sin(a) * 300];
        return (
          <Press key={`b${i}`} at={1.2 + i * 0.12} origin={to} seed={20 + i}>
            <Strip from={from} to={to} w0={14} w1={30} dye={dyes[dyes.length - 1 - i]} slits={2} />
          </Press>
        );
      })}
      <Press at={0.7} origin={sun} seed={30}>
        <Sun x={sun[0]} y={sun[1]} r={112} />
      </Press>
    </StageWrap>
  );
};

// ------------------------------------------------------------------ diagram

const Diagram: React.FC = () => {
  const c: Pt = [560, 860];
  const src: Pt = [110, 330];
  const inA = Math.atan2(c[1] - src[1], c[0] - src[0]);
  const blue = [-85, -35, 5, 95, 140, 185].map((d) => (d * Math.PI) / 180);
  return (
    <StageWrap over={<Placard lines={[SAMPLE.diagram.label]} at={2.6} />} lamp={[560, 820]}>
      <Press at={0.1} origin={[(src[0] + c[0]) / 2, (src[1] + c[1]) / 2]} seed={1}>
        <Strip from={src} to={[c[0] - Math.cos(inA) * 150, c[1] - Math.sin(inA) * 150]} w0={40} w1={30} dye={C.ochre} slits={6} />
      </Press>
      <Press at={0.6} origin={c} seed={2}>
        <Disc x={c[0] - 62} y={c[1] + 6} r={88} />
        <Disc x={c[0] + 62} y={c[1] - 6} r={88} dye={C.jade} />
      </Press>
      {blue.map((a, i) => (
        <Press key={i} at={1.3 + i * 0.1} origin={[c[0] + Math.cos(a) * 260, c[1] + Math.sin(a) * 260]} seed={10 + i}>
          <Strip from={[c[0] + Math.cos(a) * 170, c[1] + Math.sin(a) * 170]} to={[c[0] + Math.cos(a) * 330, c[1] + Math.sin(a) * 330]} w0={26} w1={6} dye={C.indigo} slits={2} />
        </Press>
      ))}
      <Press at={2.0} origin={[c[0] + Math.cos(inA) * 360, c[1] + Math.sin(inA) * 360]} seed={20}>
        <Strip from={[c[0] + Math.cos(inA) * 180, c[1] + Math.sin(inA) * 180]} to={[c[0] + Math.cos(inA) * 560, c[1] + Math.sin(inA) * 560]} w0={18} w1={18} dye={C.vermilion} slits={4} />
      </Press>
      <Tag text={SAMPLE.diagram.in} x={SCREEN.x + 50} y={300} at={0.4} anchor="start" />
      <Tag text={SAMPLE.diagram.object} x={SCREEN.x + 50} y={1150} at={1.0} anchor="start" />
      <Tag text="red goes on" x={RIGHT} y={1360} at={2.3} anchor="end" />
    </StageWrap>
  );
};

// ------------------------------------------------------------------ number: the number cut out of a plaque, two carved bars on rods

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const full = 800;
  const x0 = 140;
  return (
    <StageWrap over={<Placard lines={wrap(n.caption, 36)} at={2.2} />} lamp={[540, 800]}>
      <Plaque lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} x={140} y={300} w={800} size={T_NUMBER} at={0.1} />
      <Tag text="blue · 450 nm" x={x0} y={880} at={1.0} anchor="start" />
      <Press at={1.1} origin={[x0 + full / 2, 960]} seed={5}>
        <Strip from={[x0, 960]} to={[x0 + full, 960]} w0={40} w1={40} dye={C.indigo} slits={9} />
      </Press>
      <Tag text="red · 700 nm" x={x0} y={1110} at={1.5} anchor="start" />
      <Press at={1.6} origin={[x0 + full / n.value / 2, 1190]} seed={6}>
        <Strip from={[x0, 1190]} to={[x0 + full / n.value, 1190]} w0={40} w1={40} dye={C.vermilion} slits={1} />
      </Press>
    </StageWrap>
  );
};

// ------------------------------------------------------------------ list: three carved medallions on rods, the storyteller reads each

const List: React.FC = () => {
  const rows = [500, 890, 1280];
  const mx = 230;
  return (
    <StageWrap lamp={[400, 900]}>
      <Press at={0.1} origin={[mx, rows[0]]} seed={1}>
        <Sun x={mx} y={rows[0]} r={78} />
      </Press>
      <Press at={0.8} origin={[mx, rows[1]]} seed={2}>
        <Disc x={mx - 38} y={rows[1]} r={58} />
        <Disc x={mx + 38} y={rows[1]} r={58} dye={C.jade} />
        {[-60, 20, 200].map((d, i) => {
          const a = (d * Math.PI) / 180;
          return <Strip key={i} from={[mx + Math.cos(a) * 110, rows[1] + Math.sin(a) * 92]} to={[mx + Math.cos(a) * 170, rows[1] + Math.sin(a) * 140]} w0={14} w1={4} dye={C.indigo} slits={1} />;
        })}
      </Press>
      <Press at={1.5} origin={[mx, rows[2]]} seed={3}>
        <Hide d={`M ${mx - 120} ${rows[2] + 40} A 120 120 0 0 1 ${mx + 120} ${rows[2] + 40} Z`} dye={C.indigo} holes={`M ${mx - 60} ${rows[2] + 10} h 12 v 12 h -12 Z M ${mx + 40} ${rows[2] - 30} h 12 v 12 h -12 Z M ${mx - 10} ${rows[2] - 60} h 12 v 12 h -12 Z`} />
        <Hide d={`M ${mx - 140} ${rows[2] + 40} h 280 v 30 h -280 Z`} dye={C.gold} />
      </Press>
      {SAMPLE.list.map((s, i) => (
        <Tag key={i} text={s} x={RIGHT} y={rows[i] + 14} at={0.4 + i * 0.7} anchor="end" />
      ))}
    </StageWrap>
  );
};

// ------------------------------------------------------------------ end

const End: React.FC = () => (
  <StageWrap over={<Placard lines={[SAMPLE.end.cta]} at={2.0} />} lamp={[620, 820]} lamps={2}>
    <Press at={0.1} origin={[540, 1600]} seed={1} tremor={0}>
      <Ground y={1560} />
    </Press>
    <Press at={0.3} origin={[800, 880]} seed={2}>
      <Sun x={800} y={880} r={96} />
    </Press>
    <Press at={0.6} origin={[320, 1300]} seed={3}>
      <Figure x={320} y={1562} s={0.98} />
    </Press>
    <Plaque lines={["LOOK UP", "AGAIN."]} x={200} y={300} w={680} size={104} at={1.1} />
  </StageWrap>
);

const T_NUMBER = S.type.number;

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 3.6, hero: 3.1, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.1, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.7, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.7, component: List },
  { id: "end", duration: 3.2, hero: 2.7, component: End },
];

