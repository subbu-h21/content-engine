/** Swiss Poster on the shared sample content: a programme on the page and a poster built on its own grid. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Bar, C, col, ease, Knife, M, Note, Numeral, Page, S, Sheet, Signal, span, Tech, W, Words } from "./parts";

const T = S.type;
const COLW_UNIT = span(1);
const NY = S.layout.noteY;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");

const Title: React.FC = () => {
  const [sx, sy, sw, sh] = [col(2), 640, span(5), 860];
  const mw = sw / 7;
  const mh = sh / 12;
  const bars: [number, number, number, string][] = [
    [0, 7, 7, C.ink],
    [2, 8, 5, C.ink],
    [0, 9, 3, C.second],
    [3, 9, 4, C.ink],
    [1, 10, 6, C.ink],
    [5, 11, 2, C.ink],
  ];
  return (
    <Page>
      <Tech text={lower(SAMPLE.kicker)} y={240} at={0.1} col={C.grey} />
      <Tech text="bar 01.1" x={W - M} y={240} at={0.15} align="right" />
      <Words lines={[lower(lead(SAMPLE.title)), em(SAMPLE.title)]} y={400} size={T.title - 8} at={0.25} />
      <Sheet x={sx} y={sy} w={sw} h={sh} at={0.7} grid={[7, 12]}>
        <Signal cx={mw * 2} cy={mh * 3.5} r={mw * 1.75} at={1.0} from={[-mw, mh * 6]} />
        {bars.map(([c0, r0, n, colr], i) => (
          <Bar key={i} x={c0 * mw + 4} y={r0 * mh + 4} w={n * mw - 8} h={mh - 8} at={1.5 + i * 0.125} col={colr} from={i % 2 ? "right" : "left"} />
        ))}
      </Sheet>
      <Tech text="Columns 7 · Rows 12 · Module 111 × 72" y={NY - 30} at={2.3} />
    </Page>
  );
};

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const [sx, sy, sw, sh] = [col(1), 790, span(6), 700];
  const bands = [700, 650, 600, 550, 500, 450, 400];
  const bh = 52;
  const gap = 30;
  const top = 76;
  return (
    <Page>
      <Words lines={[`01  ${lower(SAMPLE.chapter)}`]} y={290} size={T.leadIn} at={0.1} weight={500} col={C.grey} />
      <Words lines={[`*${lower(l1)}*`, `*${lead(l2)}*`, em(l2)]} y={430} size={T.statement} at={0.2} weight={700} emWeight={400} />
      <Sheet x={sx} y={sy} w={sw} h={sh} at={0.8}>
        <Signal cx={250} cy={top + 3.5 * (bh + gap) - gap / 2} r={250} at={1.0} from={[-120, 600]} />
        {bands.map((nm, i) => (
          <React.Fragment key={nm}>
            <Bar x={48} y={top + i * (bh + gap)} w={sw - 48 - 190} h={bh} at={1.4 + i * 0.0625} />
            <Note text={`${nm} nm`} x={sw - 160} y={top + i * (bh + gap) + 6} w={120} at={1.5 + i * 0.0625} size={24} ruleCol={C.paper} />
          </React.Fragment>
        ))}
      </Sheet>
      <Tech text="Bands 7 · 400–700 nm · all at once" y={NY - 30} at={2.2} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [sx, sy, sw, sh] = [col(1), 380, span(6), 980];
  const mw = sw / 6;
  const mh = sh / 10;
  const sun: [number, number] = [mw * 1, mh * 1.5];
  const mol: [number, number] = [mw * 3.5, mh * 6];
  const dirs = [0, 45, 90, 135, 180, 270, 315];
  const d = SAMPLE.diagram;
  const grow = ease("snap", t - 1.7);
  return (
    <Page>
      <Words lines={["02  how it works"]} y={290} size={T.leadIn} at={0.1} weight={500} col={C.grey} />
      <Sheet x={sx} y={sy} w={sw} h={sh} at={0.3} grid={[6, 10]}>
        <Signal cx={sun[0]} cy={sun[1]} r={mw * 0.62} at={0.6} from={[-mw, mh * 4]} />
        <svg width={sw} height={sh} style={{ position: "absolute", left: 0, top: 0 }}>
          {grow > 0
            ? dirs.map((deg) => {
                const a = (deg * Math.PI) / 180;
                const r0 = 78;
                const r1 = r0 + 170 * grow;
                return <line key={deg} x1={mol[0] + Math.cos(a) * r0} y1={mol[1] + Math.sin(a) * r0} x2={mol[0] + Math.cos(a) * r1} y2={mol[1] + Math.sin(a) * r1} stroke={C.ink} strokeWidth={22} />;
              })
            : null}
          {t > 1.35 ? (
            <>
              <circle cx={mol[0] - 30} cy={mol[1]} r={34} fill={C.ink} />
              <circle cx={mol[0] + 30} cy={mol[1]} r={34} fill={C.ink} />
            </>
          ) : null}
        </svg>
        <div style={{ position: "absolute", left: mol[0] + 30, top: mol[1] + 262, fontFamily: `"Archivo", sans-serif`, fontWeight: 500, fontSize: 24, color: C.grey, whiteSpace: "nowrap", opacity: t > 2.1 ? 1 : 0 }}>col 3.50 · row 6.00 · on grid</div>
      </Sheet>
      <Knife from={[sx + sun[0] + mw * 0.45, sy + sun[1] + mw * 0.45]} to={[sx + mol[0] - 64, sy + mol[1] - 50]} at={1.1} dur={0.25} />
      <Note text={d.in} x={col(1)} y={1410} w={span(2)} at={2.0} />
      <Note text={`${d.object}: ${lower(d.label)}`} x={col(3)} y={1410} w={span(2)} at={2.125} />
      <Note text={d.out} x={col(5)} y={1410} w={span(2)} at={2.25} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const unit = COLW_UNIT;
  return (
    <Page>
      <Words lines={["03  by the numbers"]} y={290} size={T.leadIn} at={0.1} weight={500} col={C.grey} />
      <Signal cx={W - 40} cy={600} r={300} at={0.2} from={[W + 260, 900]} />
      <Numeral text={n.value.toFixed(n.decimals)} y={1120} size={640} at={0.5} />
      <Words lines={["times more scattering"]} y={1215} size={64} at={1.1} />
      <Note text="blue, 450 nm" y={1270} w={span(6)} at={1.4} />
      <Bar x={M} y={1318} w={unit * n.value} h={40} at={1.55} />
      <Note text="red, 700 nm" y={1384} w={span(6)} at={1.7} />
      <Bar x={M} y={1432} w={unit} h={40} at={1.85} col={C.second} />
      <Tech text="(700 ÷ 450)⁴ ≈ 5.9 · Unit 1 column" y={NY - 30} at={2.1} />
    </Page>
  );
};
const List: React.FC = () => {
  const ys = [430, 790, 1150];
  return (
    <Page>
      <Words lines={["04  in three steps"]} y={290} size={T.leadIn} at={0.1} weight={500} col={C.grey} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.3 + i * 0.375;
        const ws = lower(item).split(" ");
        const lines = ws.length > 3 ? [ws.slice(0, 3).join(" "), ws.slice(3).join(" ")] : [ws.join(" ")];
        return (
          <React.Fragment key={i}>
            <Note text="" y={ys[i]} w={span(6)} at={at} />
            <Words lines={[`0${i + 1}`]} y={ys[i] + 160} size={T.ruleNumber} at={at + 0.06} weight={700} />
            <Words lines={lines} x={col(3)} y={ys[i] + 70} size={T.rule} at={at + 0.125} weight={500} leading={1.05} />
          </React.Fragment>
        );
      })}
      <Signal cx={col(6) + 90} cy={ys[0] + 110} r={44} at={0.55} from={[W + 60, ys[0] + 110]} />
      <Tech text="Steps 3 · Columns 1–2 and 3–6" y={NY - 30} at={1.6} />
    </Page>
  );
};

const End: React.FC = () => {
  const [sx, sy, sw, sh] = [col(1), 300, span(6), 1180];
  const mw = sw / 6;
  const mh = sh / 12;
  // one strong diagonal of long and short bars, stepping down to the left
  const stairs: [number, number, number][] = [
    [3.5, 7, 2.5],
    [2.8, 8, 1],
    [1.7, 9, 2.6],
    [1.1, 10, 0.9],
    [0, 11, 2.2],
  ];
  const line = plain(SAMPLE.end.line).toLowerCase().split(" ");
  return (
    <Page>
      <Sheet x={sx} y={sy} w={sw} h={sh} at={0.1} grid={[6, 12]}>
        <Signal cx={mw * 4.6} cy={mh * 2.6} r={mw * 2.9} at={0.4} from={[mw * 7, mh * 6]} />
        {stairs.map(([c0, r0, n], i) => (
          <Bar key={i} x={c0 * mw + 4} y={r0 * mh + 4} w={n * mw - 8} h={mh - 8} at={1.2 + i * 0.125} from={i % 2 ? "right" : "left"} col={i === 2 ? C.second : C.ink} />
        ))}
        <Words lines={[line.slice(0, 2).join(" "), line.slice(2).join(" ")]} x={48} y={330} size={T.title + 16} at={0.9} />
        <Words lines={[lower(SAMPLE.end.cta)]} x={mw * 3 + 4} y={sh - 46} size={T.signoff} at={1.8} weight={500} />
      </Sheet>
      <Tech text="Columns 6 · Rows 12 · Signal 1" y={NY - 30} at={2.0} />
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.65, component: Title },
  { id: "headline", duration: 3.0, hero: 2.65, component: Headline },
  { id: "diagram", duration: 3.2, hero: 2.85, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.65, component: NumberSample },
  { id: "list", duration: 2.8, hero: 2.45, component: List },
  { id: "end", duration: 3.0, hero: 2.65, component: End },
];
