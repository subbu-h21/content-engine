/** Bold Poster on the shared sample content: a hero stack, a dark statement, a ruled figure, a red stat, ruled steps, a red sign-off. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Body, C, ease, Grid, Ground, H, Label, LeftBar, M, S, Stamp, stacked, W } from "./parts";

const T = S.type;
const TILT = S.layout.tilts;
const TOP = S.layout.safe.top + 14;
const COL = W - 2 * M;
const n = SAMPLE.number;
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");

const Title: React.FC = () => {
  const [a, b, c] = wrap(plain(SAMPLE.title), 7);
  return (
    <Ground index={1} next={C.dark} leave={3.05}>
      <Label text={SAMPLE.kicker} y={TOP} at={0.1} />
      <Stamp text={a} y={306} size={T.display} at={0.2} />
      <Stamp text={b} y={528} size={T.display} at={0.2 + S.motion.stagger} tilt={TILT.title} />
      <Stamp text={c} y={812} size={T.displayRed} at={0.2 + 2 * S.motion.stagger} tilt={TILT.red} col={C.red} swing />
      <LeftBar y={1252} h={124} at={1.1} />
      <Body text={SAMPLE.body} x={M + 34} y={1246} w={COL - 60} at={1.2} />
    </Ground>
  );
};

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const [a, b] = wrap(l1, 8);
  const st = S.motion.stagger;
  return (
    <Ground plate={C.dark} index={2} next={C.white} leave={3.05}>
      <Label text={SAMPLE.chapter} y={TOP} at={0.3} />
      <Stamp text={a} y={320} size={190} at={0.35} col={C.white} />
      <Stamp text={b} y={516} size={190} at={0.35 + st} col={C.white} tilt={TILT.title} />
      <Stamp text={lead(l2)} y={726} size={132} at={0.35 + 2 * st} col={C.white} />
      <Stamp text={em(l2)} y={880} size={204} at={0.35 + 3 * st} col={C.red} tilt={TILT.red} swing />
      <LeftBar y={1234} h={124} at={1.35} col={C.red} />
      <Body text={SAMPLE.body} x={M + 34} y={1228} w={COL - 60} at={1.45} col={C.light} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [gx, gy, gw, gh] = [M, 320, COL, 1210];
  const r1 = 590;
  const r2 = 880;
  const half = gw / 2;
  const [mx, my] = [gw * 0.6, 320];
  const inn = ease("rule", t - 0.55);
  const angles = [-100, -55, -10, 35, 80, 125, 170];
  return (
    <Ground index={3} next={C.red} leave={3.55}>
      <Label text="How it works" y={TOP} at={0.1} />
      <Grid x={gx} y={gy} w={gw} h={gh} at={0.15} rows={[r1, r2]} cols={[[half, r1, r2]]} />
      <svg width={gw} height={r1} style={{ position: "absolute", left: gx, top: gy }}>
        <circle cx={0} cy={0} r={300 * ease("plate", t - 0.3)} fill={C.dark} />
        {[-34, 0, 34].map((o, i) => {
          const [x0, y0] = [190, 190];
          const dx = mx - 90 - x0;
          const dy = my - 90 - y0;
          const len = Math.hypot(dx, dy) || 1;
          const [nx, ny] = [(-dy / len) * o, (dx / len) * o];
          const p = ease("rule", t - 0.6 - i * 0.06);
          return <line key={o} x1={x0 + nx} y1={y0 + ny} x2={x0 + nx + dx * inn * p} y2={y0 + ny + dy * inn * p} stroke={C.dark} strokeWidth={10} />;
        })}
        {angles.map((deg, i) => {
          const p = ease("rule", t - 1.05 - i * 0.05);
          if (p <= 0) return null;
          const a = (deg * Math.PI) / 180;
          const r0 = 104;
          const r = r0 + 150 * p;
          return <line key={deg} x1={mx + r0 * Math.cos(a)} y1={my + r0 * Math.sin(a)} x2={mx + r * Math.cos(a)} y2={my + r * Math.sin(a)} stroke={C.red} strokeWidth={14} />;
        })}
        {t > 0.95 ? (
          <>
            <circle cx={mx - 34} cy={my} r={50} fill={C.dark} />
            <circle cx={mx + 34} cy={my} r={50} fill={C.dark} />
          </>
        ) : null}
      </svg>
      <Stamp text="1" x={gx + 32} y={gy + r1 + 22} size={T.cell} at={1.4} col={C.red} />
      <Stamp text={d.in} x={gx + 32} y={gy + r1 + 120} size={T.card} at={1.5} />
      <Stamp text="2" x={gx + half + 32} y={gy + r1 + 22} size={T.cell} at={1.6} col={C.red} />
      <Stamp text={d.object} x={gx + half + 32} y={gy + r1 + 120} size={T.card - 6} at={1.7} />
      <Body text={d.label} x={gx + half + 34} y={gy + r1 + 202} w={half - 40} at={1.8} size={T.body - 6} />
      {wrap(d.out, 14).map((line, i) => (
        <Stamp key={line} text={line} x={gx + 36} y={gy + r2 + 44 + i * 112} size={T.card + 36} at={1.95 + i * 0.14} col={C.red} tilt={-2} swing />
      ))}
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds() - 0.45;
  const { rollStep, rollSteps } = S.motion;
  const k = Math.min(rollSteps, Math.max(1, Math.floor(t / rollStep) + 1));
  const v = (n.value * k) / rollSteps;
  const size = T.statBig;
  const y0 = 1110;
  const half = COL / 2;
  return (
    <Ground plate={C.red} index={4} next={C.white} leave={3.05}>
      <Label text="By the numbers" y={TOP} at={0.3} col={C.white} />
      <Stamp text={`${v.toFixed(n.decimals)}${n.unit}`} y={380} size={size} at={0.45} col={C.white} tilt={TILT.stat} shadow={stacked(4)} center />
      <Body text={n.caption} x={M + 90} y={900} w={COL - 180} at={1.2} col={C.white} center size={T.body + 2} />
      <Grid x={M} y={y0} w={COL} h={300} at={1.4} cols={[[half, 0, 300]]} col={C.white} />
      <Label text="Blue · 450 nm" x={M + 32} y={y0 + 34} at={1.5} col={C.white} />
      <Stamp text={`${n.value.toFixed(n.decimals)}${n.unit}`} x={M + 32} y={y0 + 96} size={T.section + 8} at={1.6} col={C.white} shadow={stacked(1)} />
      <Label text="Red · 700 nm" x={M + half + 32} y={y0 + 34} at={1.65} col={C.white} />
      <Stamp text={`1.0${n.unit}`} x={M + half + 32} y={y0 + 96} size={T.section + 8} at={1.75} col={C.white} shadow={stacked(1)} />
    </Ground>
  );
};

const List: React.FC = () => {
  const ys = [510, 840, 1170];
  return (
    <Ground index={5} next={C.white} leave={3.05}>
      <Label text={SAMPLE.chapter} y={TOP} at={0.1} />
      <Stamp text="In three steps" y={300} size={T.section + 16} at={0.2} tilt={-2} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.55 + i * 0.28;
        return (
          <React.Fragment key={i}>
            <LeftBar y={ys[i]} h={270} at={at} />
            <Stamp text={String(i + 1)} x={M + 40} y={ys[i] + 38} size={T.statBig * 0.46} at={at + 0.05} col={C.red} tilt={-6} />
            {wrap(item, 17).map((line, li) => (
              <Stamp key={li} text={line} x={M + 230} y={ys[i] + 56 + li * 82} size={T.card + 6} at={at + 0.12 + li * 0.06} />
            ))}
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const [a, b] = wrap(plain(SAMPLE.end.line), 7);
  return (
    <Ground index={6}>
      <Stamp text={a} x={M + 6} y={560} size={T.closeBig} at={0.25} tilt={TILT.close} col={C.red} swing />
      <Stamp text={b} x={M + 60} y={750} size={T.closeBig + 44} at={0.5} tilt={TILT.close} col={C.red} swing />
      <LeftBar x={M + 66} y={1140} h={72} at={1.2} />
      <Body text={SAMPLE.end.cta} x={M + 100} y={1138} w={700} at={1.3} italic size={46} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.3, hero: 2.7, component: Title },
  { id: "headline", duration: 3.3, hero: 2.8, component: Headline },
  { id: "diagram", duration: 3.8, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.3, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.3, hero: 2.7, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];
