/** Paper Form on the shared sample content: one deadpan form per sample, typed as it is said. */
import React from "react";
import { plain, SAMPLE, words, type Sample } from "../../kit";
import { AnswerLine, Arrow, Box, C, Check, COLUMN, FinePrint, HeaderBand, M, Page, S, Section, Stamp, Strike, Total, Typed, W } from "./parts";

const T = S.type;
const FINE = `Complete in block capitals. ${SAMPLE.end.cta}. Do not fold.`;
const lead = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");

const Title: React.FC = () => (
  <Page>
    <HeaderBand form="FORM 7-B" title="Sky colour inquiry" sub={SAMPLE.kicker} />
    <Section n="1" label="Question" y={470} />
    <Typed text={plain(SAMPLE.title)} x={M} y={530} at={0.2} />
    <AnswerLine y={600} />
    <Section n="2" label="Colour observed" y={700} at={1.0} />
    <Check x={M} y={770} at={1.1} label="Grey" />
    <Check x={M + 300} y={770} at={1.15} label="White" />
    <Check x={M + 620} y={770} at={1.2} label="Blue" mark="tick" markAt={1.5} chosen />
    <Section n="3" label="Reason" y={910} at={1.3} />
    <AnswerLine y={1010} />
    <AnswerLine y={1090} />
    <div style={{ position: "absolute", left: M, top: 1190, width: COLUMN, height: 230, border: `1.6px solid ${C.ink}` }} />
    <div style={{ position: "absolute", left: M + 24, top: 1210, fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 600, fontSize: T.note, letterSpacing: "0.18em", color: C.graphite }}>FOR OFFICE USE ONLY</div>
    <div style={{ position: "absolute", left: M + 24, top: 1290, fontFamily: `"IBM Plex Mono", monospace`, fontSize: T.note, color: C.graphite }}>RECEIVED ________ CHECKED ________</div>
    <div style={{ position: "absolute", left: M + 24, top: 1350, fontFamily: `"IBM Plex Mono", monospace`, fontSize: T.note, color: C.graphite }}>FILED UNDER: {SAMPLE.topic.toUpperCase()}</div>
    <FinePrint text={FINE} />
  </Page>
);

const HeadlineSample: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  return (
    <Page>
      <HeaderBand form="FORM 7-B" title="Statement of fact" sub={SAMPLE.chapter} />
      <Section n="1" label="Statement" y={470} />
      <Typed text={l1} x={M} y={530} at={0.15} />
      <AnswerLine y={600} />
      <Typed text={lead(l2)} x={M} y={620} at={0.6} />
      <Typed text={em(l2)} x={M + (lead(l2).length + 1) * T.answer * 0.6} y={620} at={1.05} col={C.blood} seed={3} />
      <AnswerLine y={690} />
      <Section n="2" label="Verified" y={790} at={1.3} />
      <Check x={M} y={860} at={1.35} label="True" mark="tick" markAt={1.6} chosen />
      <Check x={M + 300} y={860} at={1.4} label="False" />
      <Section n="3" label="Detail" y={1000} at={1.5} />
      <Typed text={SAMPLE.body} x={M} y={1060} at={1.6} per={0.07} size={T.body * 0.85} width={COLUMN} lh={1.55} seed={5} />
      <AnswerLine y={1112} />
      <AnswerLine y={1165} />
      <Total text="Words on file: 18" y={1260} at={2.3} col={C.graphite} />
      <FinePrint text={FINE} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const d = SAMPLE.diagram;
  const [bx, bw, bh] = [M + 60, COLUMN - 120, 130];
  const ys = [540, 770, 1000];
  return (
    <Page>
      <HeaderBand form="FORM 7-C" title="Process chart" sub="How it works" />
      <Section n="1" label="Process" y={460} />
      <Box x={bx} y={ys[0]} w={bw} h={bh} at={0.2} num="1.1" name={d.in} note="enters the air" />
      <Arrow from={[W / 2, ys[0] + bh + 46]} to={[W / 2, ys[1] - 10]} at={0.75} />
      <Box x={bx} y={ys[1]} w={bw} h={bh} at={0.9} num="1.2" name={d.object} note={d.label.toLowerCase()} strong />
      <Arrow from={[W / 2, ys[1] + bh + 46]} to={[W / 2, ys[2] - 10]} at={1.45} />
      <Box x={bx} y={ys[2]} w={bw} h={bh} at={1.6} num="1.3" name={d.out} note="reaches you" />
      <Total text="Steps 3 · colour scattered: blue" y={1220} at={2.1} />
      <FinePrint text={FINE} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const row = (label: string, value: string, y: number, at: number, col: string) => (
    <>
      <div style={{ position: "absolute", left: M, top: y, fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 500, fontSize: T.option, letterSpacing: "0.12em", color: C.ink }}>{label}</div>
      <div style={{ position: "absolute", left: M + 400, top: y + T.option * 0.75, width: COLUMN - 400 - 170, borderTop: `2px dotted ${C.ash}` }} />
      <div style={{ position: "absolute", left: W - M - 150, top: y - 22, width: 150, height: 76, border: `1.6px solid ${C.ink}` }} />
      <Typed text={value} x={W - M - 128} y={y - 6} at={at} size={T.answer} col={col} />
    </>
  );
  return (
    <Page hitAt={1.6}>
      <HeaderBand form="FORM 7-D" title="Measurement" sub="By the numbers" />
      <Section n="1" label="Scattering, relative" y={460} />
      {row("BLUE · 450 NM", n.value.toFixed(n.decimals), 560, 0.3, C.blood)}
      {row("RED  · 700 NM", "1.0", 670, 0.6, C.ink)}
      <Section n="2" label="Result" y={800} at={0.9} />
      <Typed text={`${n.value.toFixed(n.decimals)}${n.unit} more for blue than red`} x={M} y={860} at={1.0} per={0.1} size={T.body} />
      <AnswerLine y={925} />
      <Stamp lines={["Blue wins"]} sub={`scattering ${n.value.toFixed(n.decimals)}${n.unit}`} cx={W / 2} cy={1170} w={COLUMN - 40} h={300} at={1.6} />
      <FinePrint text={FINE} />
    </Page>
  );
};

const List: React.FC = () => {
  const myth = "The sky reflects the sea.";
  const ys = [760, 860, 960];
  return (
    <Page>
      <HeaderBand form="FORM 7-E" title="Checklist" sub="In three steps" />
      <Section n="1" label="Common answer" y={460} />
      <Check x={M} y={530} at={0.15} mark="cross" markAt={0.9} />
      <Typed text={myth} x={M + 64} y={524} at={0.2} per={0.1} />
      <Strike x0={M + 56} x1={M + 64 + myth.length * T.answer * 0.6 + 10} y={556} at={0.75} />
      <Section n="2" label="Correct answer" y={660} at={1.0} />
      {SAMPLE.list.map((item, i) => (
        <React.Fragment key={i}>
          <Check x={M} y={ys[i] + 6} at={1.05 + i * 0.3} mark="tick" markAt={1.3 + i * 0.3} />
          <div style={{ position: "absolute", left: M + 64, top: ys[i] + 10, fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 500, fontSize: T.note, color: C.blood }}>{`2.${i + 1}`}</div>
          <Typed text={item} x={M + 130} y={ys[i]} at={1.1 + i * 0.3} per={0.05} size={T.body * 0.9} seed={i + 7} />
        </React.Fragment>
      ))}
      <Total text="Steps 3 · checked 3 · struck 1" y={1100} at={2.2} />
      <FinePrint text={FINE} />
    </Page>
  );
};

const End: React.FC = () => {
  const line = plain(SAMPLE.end.line);
  return (
    <Page hitAt={1.2}>
      <HeaderBand form="FORM 7-Z" title="Sign-off" sub="End of file" />
      <Section n="1" label="Action required" y={460} />
      <Typed text={line} x={M} y={520} at={0.15} />
      <AnswerLine y={590} />
      <Stamp lines={line.split(" ").length > 2 ? [line.split(" ").slice(0, 2).join(" "), line.split(" ").slice(2).join(" ")] : [line]} sub={SAMPLE.end.cta} cx={W / 2} cy={930} w={COLUMN - 80} h={420} at={1.2} />
      <div style={{ position: "absolute", left: M, top: 1290, fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 600, fontSize: T.section, letterSpacing: "0.18em", color: C.ink }}>SIGNED</div>
      <div style={{ position: "absolute", left: M + 170, top: 1320, width: COLUMN - 170, borderTop: `1.6px solid ${C.ink}` }} />
      <FinePrint text={FINE} />
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.6, hero: 2.1, component: Title },
  { id: "headline", duration: 3.4, hero: 2.9, component: HeadlineSample },
  { id: "diagram", duration: 3, hero: 2.5, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.3, component: NumberSample },
  { id: "list", duration: 3, hero: 2.6, component: List },
  { id: "end", duration: 2.4, hero: 1.9, component: End },
];
