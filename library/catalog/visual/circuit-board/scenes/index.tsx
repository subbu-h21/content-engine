/**
 * Circuit Board on the shared sample content: the question plotted in a title block, six traces carrying light at
 * once, the air molecule as a chip turning amber into silver-cyan streams, the number with 59 pulses against 10 on two
 * equal traces (the true ratio), three test points along a route, and the last line in the board's title block.
 */
import React from "react";
import { clamp, plain, pulse, SAMPLE, wrap, type Sample } from "../../kit";
import { Board, C, E, ease, M, Pad, Plate, S, Silk, SilkBox, T, Trace, useT, W, type Flow, type Pt } from "./parts";

const plot = (t: number, at: number) => ease("plot", t - at);

const Title: React.FC = () => {
  const t = useT();
  const main: Pt[] = [[150, -40], [150, 330], [240, 420], [800, 420], [890, 510], [890, 590]];
  const out: Pt[] = [[760, 1330], [760, 1400], [600, 1560], [600, 1980]];
  const p = clamp((t - 0.3) / 1.2);
  const hit = 1.5;
  const lines = ["WHY IS", "THE SKY", "BLUE?"];
  const h = T.title;
  return (
    <Board
      seed={3}
      clear={[[M, 550, W - 2 * M, 740]]}
      copper={
        <>
          <Trace pts={main} w={E.traceMain} />
          <Trace pts={out} w={E.traceMain} />
          <Pad x={890} y={606} lit={pulse(t, hit, 0.3)} />
          <Pad x={760} y={1324} />
        </>
      }
      flows={[
        { pts: main, kind: "amber", t, p, w: E.traceMain * 0.7 },
        { pts: out, kind: "amber", t, p: clamp((t - hit) / 0.8), w: E.traceMain * 0.7 },
      ]}
      flashes={[{ x: 890, y: 606, r: 60, a: pulse(t, hit, 0.25) }]}
      silk={
        <>
          <SilkBox x={M} y={560} w={W - 2 * M} h={720} p={plot(t, 0.1)} />
          {lines.map((l, i) => (
            <Silk key={i} text={l} x={M + 44} y={640 + i * h * T.leading * 0.98} h={h} p={plot(t, 0.5 + i * 0.3)} />
          ))}
          <path d={`M ${M} 1190 L ${W - M} 1190`} stroke={C.silk} strokeWidth={4} pathLength={1} strokeDasharray={`${plot(t, 1.0)} 1`} />
          <Silk text={plain(SAMPLE.kicker)} x={M + 44} y={1214} h={T.note} p={plot(t, 1.3)} />
          <Silk text="REV A" x={W - M - 44} y={1214} h={T.note} p={plot(t, 1.5)} anchor="end" />
        </>
      }
    />
  );
};

const NMS = [700, 620, 580, 530, 450, 400];

const HeadlineSample: React.FC = () => {
  const t = useT();
  // a bus of six parallel traces, 0/45/90°, spreading to six pads
  const bus: Pt[][] = NMS.map((_, i) => {
    const x = 120 + i * 44;
    const end = 170 + i * 146;
    return [[x, -40], [x, 700 - i * 44], [end, 700 - i * 44 + (end - x)], [end, 1190]] as Pt[];
  });
  const p = clamp((t - 0.3) / 1.0);
  const hit = 1.25;
  return (
    <Board
      seed={8}
      clear={[[M, 1270, W - 2 * M, 200], [430, 250, 560, 310]]}
      copper={
        <>
          {bus.map((b, i) => (
            <Trace key={i} pts={b} w={E.trace} />
          ))}
          {bus.map((b, i) => (
            <Pad key={i} x={b[3][0]} y={b[3][1] + 22} r={E.pad + 2} lit={pulse(t, hit, 0.35) * 0.8} />
          ))}
        </>
      }
      flows={bus.map((b) => ({ pts: b, kind: "amber" as const, t, p, w: E.trace * 0.8 }))}
      silk={
        <>
          <Silk text="SUNLIGHT" x={W - M} y={276} h={T.display - 20} p={plot(t, 0.2)} anchor="end" />
          <Silk text="EVERY COLOUR" x={W - M} y={380} h={46} p={plot(t, 0.6)} anchor="end" />
          <Silk text="AT ONCE" x={W - M} y={450} h={46} p={plot(t, 0.9)} anchor="end" />
          {NMS.map((nm, i) => (
            <Silk key={nm} text={String(nm)} x={170 + i * 146} y={1274} h={T.note + 2} p={plot(t, 1.3 + i * 0.05)} anchor="middle" />
          ))}
          <Silk text="NM" x={W - M} y={1340} h={T.note} p={plot(t, 1.6)} anchor="end" />
        </>
      }
    >
      <Plate text={plain(SAMPLE.headline.join(" "))} t={t} at={1.6} />
    </Board>
  );
};

const Diagram: React.FC = () => {
  const t = useT();
  const cx = 540;
  const cy = 900;
  const half = 150;
  const inn: Pt[] = [[190, 330], [190, 470], [390, 670], [390, 780]];
  const redOut: Pt[] = [[690, 1020], [790, 1120], [790, 1290]];
  const outs: Pt[][] = [
    [[540, 750], [540, 430]],
    [[690, 780], [770, 700], [960, 700]],
    [[690, 900], [960, 900]],
    [[390, 900], [120, 900]],
    [[390, 1020], [260, 1150], [120, 1150]],
    [[540, 1050], [540, 1290]],
  ];
  const p = clamp((t - 0.3) / 0.8);
  const hit = 1.05;
  const flows: Flow[] = [
    { pts: inn, kind: "amber", t, p, w: E.traceMain * 0.72 },
    { pts: redOut, kind: "amber", t, p: clamp((t - hit) / 0.8), w: E.trace * 0.6, dash: 18, gap: 46 },
    ...outs.map((o) => ({ pts: o, kind: "cyan" as const, t, p: clamp((t - hit - 0.1) / 0.7), w: E.trace * 0.72, dash: 20, gap: 16, speed: 620 })),
  ];
  const pins = [-110, -55, 0, 55, 110];
  return (
    <Board
      seed={5}
      clear={[[cx - half - 60, cy - half - 60, 2 * half + 120, 2 * half + 120], [M + 120, 230, 800, 70], [M, 1340, W - 2 * M, 80]]}
      copper={
        <>
          <Trace pts={inn} w={E.traceMain} />
          <Trace pts={redOut} w={E.trace} />
          {outs.map((o, i) => (
            <Trace key={i} pts={o} w={E.trace} />
          ))}
          <Pad x={190} y={320} r={72} lit={0.35} />
          {outs.map((o, i) => {
            const e = o[o.length - 1];
            return <Pad key={i} x={e[0]} y={e[1]} lit={pulse(t, hit + 0.8, 0.5) * 0.6} />;
          })}
          <Pad x={790} y={1290} />
          {pins.map((d) => (
            <React.Fragment key={d}>
              <Pad x={cx + d} y={cy - half - 4} r={17} square drill={false} />
              <Pad x={cx + d} y={cy + half + 4} r={17} square drill={false} />
              <Pad x={cx - half - 4} y={cy + d} r={17} square drill={false} />
              <Pad x={cx + half + 4} y={cy + d} r={17} square drill={false} />
            </React.Fragment>
          ))}
          <rect x={cx - half + 20} y={cy - half + 20} width={2 * half - 40} height={2 * half - 40} fill={C.laminate} />
        </>
      }
      flows={flows}
      flashes={[{ x: cx, y: cy, r: 110, a: pulse(t, hit, 0.4) * 0.5, kind: "cyan" }]}
      silk={
        <>
          <SilkBox x={cx - half + 20} y={cy - half + 20} w={2 * half - 40} h={2 * half - 40} p={plot(t, 0.1)} c={24} />
          <Silk text="U1" x={cx} y={cy - 96} h={T.note} p={plot(t, 0.3)} anchor="middle" />
          <Silk text="AIR" x={cx} y={cy - 40} h={46} p={plot(t, 0.5)} anchor="middle" />
          <Silk text="MOLECULE" x={cx} y={cy + 26} h={32} p={plot(t, 0.7)} anchor="middle" />
          <Silk text={plain(SAMPLE.diagram.in)} x={300} y={286} h={T.label} p={plot(t, 0.2)} />
          <Silk text="SCATTERS BLUE" x={cx} y={1356} h={54} p={plot(t, 1.7)} anchor="middle" />
        </>
      }
    >
      <Plate text={SAMPLE.diagram.out} t={t} at={2.1} />
    </Board>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const x0 = 130;
  const x1 = 950;
  const y1 = 860;
  const y2 = 1160;
  const L = x1 - x0;
  const tA: Pt[] = [[x0, y1], [x1, y1]];
  const tB: Pt[] = [[x0, y2], [x1, y2]];
  const blueCount = Math.round(n.value * 10); // 59 pulses against 10 on traces of the same length: the true ratio
  const redCount = 10;
  const p = clamp((t - 0.7) / 0.9);
  const per = (c: number) => L / c;
  return (
    <Board
      seed={6}
      clear={[[M, 270, W - 2 * M, 330], [M, 690, W - 2 * M, 110], [M, 990, W - 2 * M, 110], [M, 1240, W - 2 * M, 140]]}
      copper={
        <>
          <Trace pts={tA} w={E.traceMain} />
          <Trace pts={tB} w={E.traceMain} />
          <Pad x={x0} y={y1} />
          <Pad x={x1} y={y1} />
          <Pad x={x0} y={y2} />
          <Pad x={x1} y={y2} />
        </>
      }
      flows={[
        { pts: tA, kind: "cyan", t, p, w: E.traceMain * 0.7, dash: per(blueCount) * 0.45, gap: per(blueCount) * 0.55, speed: 0 },
        { pts: tB, kind: "amber", t, p, w: E.traceMain * 0.7, dash: per(redCount) * 0.45, gap: per(redCount) * 0.55, speed: 0 },
      ]}
      silk={
        <>
          <Silk text={`${n.value.toFixed(n.decimals)}${n.unit}`} x={M} y={300} h={T.number} p={plot(t, 0.1)} w={26} />
          <Silk text="450 NM" x={x0} y={730} h={T.label} p={plot(t, 0.7)} />
          <Silk text={`${blueCount} PULSES`} x={x1} y={730} h={T.label} p={plot(t, 1.0)} anchor="end" />
          <Silk text="700 NM" x={x0} y={1030} h={T.label} p={plot(t, 0.8)} />
          <Silk text={`${redCount} PULSES`} x={x1} y={1030} h={T.label} p={plot(t, 1.1)} anchor="end" />
          <Silk text="SAME TRACE LENGTH" x={M} y={1280} h={T.note} p={plot(t, 1.5)} />
        </>
      }
    >
      <Plate text="more scattering for blue than red" t={t} at={1.8} />
    </Board>
  );
};

const List: React.FC = () => {
  const t = useT();
  const stops: Pt[] = [[210, 470], [870, 810], [210, 1150]];
  const a: Pt[] = [[210, -40], [210, 470]];
  const b: Pt[] = [[210, 470], [210, 640], [380, 810], [870, 810]];
  const c: Pt[] = [[870, 810], [870, 900], [620, 1150], [210, 1150]];
  const at = [0.2, 0.8, 1.4];
  const hits = [0.75, 1.4, 2.0];
  const flows: Flow[] = [
    { pts: a, kind: "amber", t, p: clamp((t - at[0]) / 0.55), w: E.traceMain * 0.7 },
    { pts: b, kind: "cyan", t, p: clamp((t - at[1]) / 0.6), w: E.traceMain * 0.7, dash: 20, gap: 16, speed: 620 },
    { pts: c, kind: "cyan", t, p: clamp((t - at[2]) / 0.6), w: E.traceMain * 0.7, dash: 20, gap: 16, speed: 620 },
  ];
  const tag = (i: number, x: number, y: number, anchor: "start" | "end") => {
    const lines = wrap(SAMPLE.list[i].toUpperCase(), 16);
    return (
      <React.Fragment key={i}>
        <Silk text={`TP${i + 1}`} x={x} y={y - 50} h={T.note} p={plot(t, hits[i] - 0.1)} anchor={anchor} />
        {lines.map((l, j) => (
          <Silk key={j} text={l} x={x} y={y + j * 62} h={T.label - 2} p={plot(t, hits[i] + j * 0.12)} anchor={anchor} />
        ))}
      </React.Fragment>
    );
  };
  return (
    <Board
      seed={7}
      clear={[[320, 330, 680, 300], [M, 660, 680, 260], [320, 1190, 680, 260]]}
      copper={
        <>
          <Trace pts={a} w={E.traceMain} />
          <Trace pts={b} w={E.traceMain} />
          <Trace pts={c} w={E.traceMain} />
          {stops.map(([x, y], i) => (
            <Pad key={i} x={x} y={y} r={46} lit={pulse(t, hits[i], 0.4)} />
          ))}
        </>
      }
      flows={flows}
      flashes={stops.map(([x, y], i) => ({ x, y, r: 70, a: pulse(t, hits[i], 0.3), kind: i === 0 ? ("amber" as const) : ("cyan" as const) }))}
      silk={
        <>
          {tag(0, 320, 430, "start")}
          {tag(1, 880, 640, "end")}
          {tag(2, 320, 1270, "start")}
        </>
      }
    />
  );
};

const End: React.FC = () => {
  const t = useT();
  const main: Pt[] = [[220, 1140], [220, 1250], [320, 1350], [760, 1350], [860, 1250], [860, 1190]];
  const words = plain(SAMPLE.end.line).toUpperCase().split(" ");
  const hit = 1.6;
  const p = clamp((t - 0.7) / 0.9);
  return (
    <Board
      seed={2}
      clear={[[M, 470, W - 2 * M, 680]]}
      copper={
        <>
          <Trace pts={main} w={E.traceMain} />
          <Pad x={220} y={1130} r={40} />
          <Pad x={860} y={1176} r={40} lit={pulse(t, hit, 0.5)} />
          <Pad x={110} y={300} r={30} />
          <Pad x={970} y={300} r={30} />
        </>
      }
      flows={[{ pts: main, kind: "amber", t, p, w: E.traceMain * 0.7 }]}
      flashes={[{ x: 860, y: 1176, r: 60, a: pulse(t, hit, 0.35) }]}
      silk={
        <>
          <Silk text={`${words[0]} ${words[1]}`} x={M + 30} y={540} h={T.title + 12} p={plot(t, 0.1)} />
          <Silk text={words[2]} x={M + 30} y={740} h={T.title + 12} p={plot(t, 0.45)} />
          <path d={`M ${M + 30} 950 L ${W - M - 30} 950`} stroke={C.silk} strokeWidth={4} pathLength={1} strokeDasharray={`${plot(t, 0.9)} 1`} />
          <Silk text={SAMPLE.end.cta} x={M + 30} y={990} h={T.label} p={plot(t, 1.1)} />
        </>
      }
    />
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.8, component: Title },
  { id: "headline", duration: 3.2, hero: 2.9, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.25, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.4, hero: 3.1, component: List },
  { id: "end", duration: 3.2, hero: 2.8, component: End },
];

