/** Biennale Yellow on the shared sample content: a catalogue cover, a poster panel, a sun diagram, a chapter numeral, a strand list, a manifesto. */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { DISPLAY } from "./fonts";
import { Bloom, Body, C, ease, Ground, H, Label, M, Mono, PageNum, Panel, Rail, Rule, S, Serif, Tiles, W } from "./parts";

const T = S.type;
const TOP = S.layout.safe.top + 16;
const COL = W - 2 * M;

const Title: React.FC = () => {
  const cells: [string, string][] = [
    ["Subject", "Light"],
    ["Medium", "Air"],
    ["Blue", "450 nm"],
    ["Red", "700 nm"],
  ];
  const fy = 1236;
  return (
    <Ground leave={3.1}>
      <Bloom cx={330} cy={800} r={760} />
      <Bloom cx={1030} cy={1700} r={560} ember at={0.4} />
      <Label text={SAMPLE.kicker} y={TOP} at={0.2} />
      <Serif lines={wrap(SAMPLE.title, 7)} y={560} size={T.display} leading={T.displayLeading} tracking={T.displayTracking} at={0.35} />
      <Rule y={fy} at={1.0} />
      {cells.map(([k, v], i) => {
        const x = M + (i % 2) * (COL / 2);
        const y = fy + 26 + Math.floor(i / 2) * 150;
        return (
          <React.Fragment key={k}>
            <Label text={k} x={x} y={y} at={1.2 + i * 0.08} />
            <Serif lines={[v]} x={x} y={y + 102} size={T.headlineSm * 0.82} at={1.25 + i * 0.08} />
          </React.Fragment>
        );
      })}
      <PageNum n={1} at={1.6} />
    </Ground>
  );
};

const Headline: React.FC = () => {
  const panel = 1020;
  const u = W / S.elements.tile.columns;
  const lines = [SAMPLE.headline[0], ...wrap(SAMPLE.headline[1], 12)];
  return (
    <Ground leave={3.1}>
      <Panel y={0} h={panel} />
      <Tiles y={panel} at={0.7} cells={[[0, 0], [1, 0], [3, 0], [4, 0], [6, 0], [0, 1], [2, 1], [5, 1], [7, 1]]} />
      <Label text={SAMPLE.chapter} y={TOP} at={0.2} />
      <Serif lines={lines} y={560} size={T.headline} at={0.45} />
      <Body text={SAMPLE.body} y={panel + 2 * u + 56} at={1.5} width={800} />
      <PageNum n={2} at={1.7} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [mx, my] = [560, 800];
  const [sx, sy] = [-40, 240];
  const beam = ease("panel", t - 0.3);
  const dx = mx - sx;
  const dy = my - sy;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const half = 74;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const tip = [sx + dx * beam, sy + dy * beam];
  const pass = ease("ray", t - 1.0);
  const px = mx + dx * 0.95 * pass;
  const py = my + dy * 0.95 * pass;
  const angles = Array.from({ length: 12 }, (_, i) => (Math.PI * 2 * i) / 12 + 0.26);
  return (
    <Ground leave={3.6}>
      <Bloom cx={120} cy={360} r={640} />
      <Bloom cx={1040} cy={1660} r={520} ember at={0.5} />
      <Label text="How it works" x={W - M} y={TOP} at={0.1} align="right" />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon points={`${sx + nx * half},${sy + ny * half} ${tip[0] + nx * half},${tip[1] + ny * half} ${tip[0] - nx * half},${tip[1] - ny * half} ${sx - nx * half},${sy - ny * half}`} fill={C.sun} />
        {pass > 0 ? <line x1={mx} y1={my} x2={px} y2={py} stroke={C.sunSoft} strokeWidth={half * 0.9} /> : null}
        {angles.map((a, i) => {
          const p = ease("ray", t - 1.15 - i * 0.025);
          if (p <= 0) return null;
          const r0 = 104;
          const r1 = r0 + (i % 2 ? 190 : 270) * p;
          return <line key={i} x1={mx + r0 * Math.cos(a)} y1={my + r0 * Math.sin(a)} x2={mx + r1 * Math.cos(a)} y2={my + r1 * Math.sin(a)} stroke={C.ink} strokeWidth={S.elements.hairline * 1.5} />;
        })}
        {t > 0.8 ? (
          <>
            <circle cx={mx} cy={my} r={80} fill="none" stroke={C.ink} strokeWidth={S.elements.hairline} opacity={ease("ink", t - 0.8)} />
            <circle cx={mx - 22} cy={my} r={30} fill={C.ink} opacity={ease("ink", t - 0.8)} />
            <circle cx={mx + 22} cy={my} r={30} fill={C.ink} opacity={ease("ink", t - 0.8)} />
          </>
        ) : null}
      </svg>
      <div style={{ position: "absolute", left: sx + dx * 0.3, top: sy + dy * 0.3, transformOrigin: "0 50%", transform: `translateY(-50%) rotate(${angle}deg)`, opacity: ease("ink", t - 0.9) }}>
        <div style={{ fontFamily: DISPLAY, fontSize: T.strand, lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>{d.in}</div>
      </div>
      <Label text={d.object} y={1206} at={1.4} />
      <Serif lines={[d.label]} x={M} y={1312} size={T.strand} at={1.5} />
      <Rule y={1356} at={1.7} />
      <Serif lines={wrap(`*${d.out}*`, 26)} y={1450} size={T.headlineSm} at={1.9} />
      <PageNum n={3} at={2.0} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const lift = ease("lift", t - 0.3);
  const size = T.numeralJumbo;
  const rows: [string, string, string][] = [
    ["Blue", "450 nm", `${n.value.toFixed(n.decimals)}${n.unit}`],
    ["Red", "700 nm", `1.0${n.unit}`],
  ];
  const ry = 1262;
  return (
    <Ground leave={3.1}>
      <Bloom cx={540} cy={640} r={780} />
      <Bloom cx={60} cy={1720} r={520} ember at={0.5} />
      <Label text="By the numbers" y={TOP} at={0.1} align="center" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, height: size * 0.92, overflow: "hidden", textAlign: "center", fontFamily: DISPLAY, fontSize: size, lineHeight: `${size * 0.92}px`, letterSpacing: `${T.numeralTracking}em`, color: C.ink, whiteSpace: "nowrap" }}>
        <div style={{ transform: `translateY(${(1 - lift) * 100}%)` }}>
          {n.value.toFixed(n.decimals)}
          <span style={{ fontStyle: "italic" }}>{n.unit}</span>
        </div>
      </div>
      <Serif lines={wrap(n.caption, 26)} y={960} size={T.strand} at={1.0} align="center" />
      <Rule y={ry} at={1.3} />
      {rows.map(([a, b, c], i) => (
        <React.Fragment key={a}>
          <Serif lines={[a]} y={ry + 84 + i * 100} size={T.strand * 0.86} at={1.5 + i * 0.1} />
          <Mono text={b} x={M + 330} y={ry + 44 + i * 100} at={1.55 + i * 0.1} />
          <Mono text={c} x={W - M} y={ry + 44 + i * 100} at={1.6 + i * 0.1} right />
          <Rule y={ry + 100 + i * 100} at={1.6 + i * 0.1} soft />
        </React.Fragment>
      ))}
      <PageNum n={4} at={1.9} />
    </Ground>
  );
};

const List: React.FC = () => {
  const ys = [420, 760, 1100];
  return (
    <Ground leave={3.1}>
      <Bloom cx={980} cy={1250} r={700} />
      <Bloom cx={60} cy={260} r={480} ember at={0.5} />
      <Rail text="In three steps" y={1100} at={0.1} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.25 + i * 0.32;
        return (
          <React.Fragment key={i}>
            <Rule x={M + 44} y={ys[i]} w={COL - 44} at={at} soft={i > 0} />
            <Serif lines={[String(i + 1)]} x={M + 44} y={ys[i] + 170} size={T.numeralMd} at={at + 0.05} />
            <Serif lines={wrap(item, 16)} x={M + 214} y={ys[i] + 104} size={T.strand} at={at + 0.1} />
          </React.Fragment>
        );
      })}
      <PageNum n={5} at={1.6} />
    </Ground>
  );
};

const End: React.FC = () => (
  <Ground leave={3.2}>
    <Bloom cx={540} cy={880} r={800} />
    <Bloom cx={40} cy={300} r={480} ember at={0.5} />
    <Serif lines={["“"]} y={740} size={T.display * 1.5} align="center" at={0.2} />
    <Serif lines={wrap(SAMPLE.end.line, 8)} y={880} size={T.displayIt} leading={0.98} align="center" at={0.5} block italic />
    <Rule x={W / 2 - 70} y={1270} w={140} at={1.4} />
    <Label text={SAMPLE.end.cta} y={1306} at={1.5} align="center" />
    <PageNum n={6} at={1.7} />
  </Ground>
);

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.8, component: Title },
  { id: "headline", duration: 3.4, hero: 2.9, component: Headline },
  { id: "diagram", duration: 3.9, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.4, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.9, component: List },
  { id: "end", duration: 3.5, hero: 3.0, component: End },
];
