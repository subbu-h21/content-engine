/** Spy Titles on the shared sample content: each sample is one location with its own ground, words standing as sets. */
import React from "react";
import { fit, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { band, C, Credit, DIAG, E, ease, Figure, Ground, M, Piece, ring, S, Set, Strip, twos, W, type Pt } from "./parts";

const COLUMN = W - 2 * M;
const EM = S.type.charEm;
const TOP = S.layout.safe.top;
const LEAD = S.type.leading;
const caps = (s: string) => s.toUpperCase();

/** Title: red ground, a giant circle, the figure small on top of the type. */
const Title: React.FC = () => {
  const lines = wrap(caps(SAMPLE.title), 7);
  const size = fit(lines, COLUMN, S.type.title, EM);
  const y0 = 730;
  let n = 0;
  return (
    <Ground hue={C.red} seed={3}>
      <Set>
        <Piece pts={band(120, 1560, 92)} fill={C.darkRed} seed={1} shadow={false} from={[-300, -170]} at={0} />
        <Piece pts={band(120, 1270, 44)} fill={C.darkRed} seed={2} shadow={false} from={[-300, -170]} at={0.08} />
        <Piece pts={ring(720, 500, 250)} fill={C.paper} seed={3} grow={[720, 500]} at={0.1} />
        <Figure x={690} y={y0 + 34} height={330} gap={C.red} at={0.45} tie={C.mustard} />
      </Set>
      <Credit line={caps(SAMPLE.kicker)} size={S.type.label} y={TOP + 6} at={0.3} />
      {lines.map((line, i) => {
        const start = 0.6 + n * E.sixteenth;
        n += line.replace(/\*/g, "").length;
        return <Credit key={i} line={line} size={size} y={y0 + i * size * LEAD} at={start} each jaunty em={C.paper} seed={i + 1} />;
      })}
    </Ground>
  );
};

/** Headline: mustard ground; every row of the credit is cut to the width of the column, a wall of type. */
const HeadlineSample: React.FC = () => {
  const rows = ["SUNLIGHT", "CARRIES", "EVERY COLOUR", "*AT ONCE.*"];
  let y = TOP - 6;
  return (
    <Ground hue={C.mustard} seed={4}>
      <Set>
        <Piece pts={band(1020, 620, 130)} fill={C.darkMustard} seed={5} shadow={false} from={[300, 170]} />
      </Set>
      {rows.map((line, i) => {
        const size = fit([line], COLUMN, S.type.display, EM);
        const top = y;
        y += size * LEAD;
        return <Credit key={i} line={line} size={size} y={top} at={0.15 + i * E.sixteenth * 2} seed={i + 5} />;
      })}
      <Strip text={SAMPLE.body} y={1414} width={COLUMN} at={0.9} onDark={false} />
    </Ground>
  );
};

/** Diagram: black ground; the light is a diagonal band with its name on it, the molecule the bright thing, red wedges flying out. */
const [MX, MY, MR] = [610, 860, 168];
const rayAngles = [0.1, 0.72, 1.34, 1.96, 2.58, 3.2, 4.74, 5.38];
const wedge = (a: number, r0: number, r1: number, w: number): Pt[] => [
  [MX + r0 * Math.cos(a - w), MY + r0 * Math.sin(a - w)],
  [MX + r1 * Math.cos(a), MY + r1 * Math.sin(a)],
  [MX + r0 * Math.cos(a + w), MY + r0 * Math.sin(a + w)],
];
const Diagram: React.FC = () => {
  const [dx, dy] = DIAG;
  const bx = MX - dx * (MR + 20);
  const by = MY - dy * (MR + 20);
  const beam: Pt[] = [[bx - dx * 900 - dy * 66, by - dy * 900 + dx * 66], [bx - dy * 66, by + dx * 66], [bx + dy * 66, by - dx * 66], [bx - dx * 900 + dy * 66, by - dy * 900 - dx * 66]];
  const t = useSeconds();
  const nameIn = ease("land", t - 0.3);
  return (
    <Ground hue={C.ink} seed={5} dark>
      <Set>
        <Piece pts={ring(170, 1290, 230)} fill={C.distant} seed={6} shadow={false} />
        <Piece pts={beam} fill={C.paper} seed={7} from={[-420, -240]} at={0.1} />
        {rayAngles.map((a, i) => (
          <Piece key={i} pts={wedge(a, MR + 28, 470 + (i % 2) * 70, 0.15)} fill={C.red} seed={10 + i} from={[-Math.cos(a) * 220, -Math.sin(a) * 220]} at={0.7 + i * E.sixteenth * 0.5} />
        ))}
        <Piece pts={ring(MX, MY, MR + 12)} fill={C.ink} seed={8} shadow={false} grow={[MX, MY]} at={0.4} />
        <Piece pts={ring(MX, MY, MR)} fill={C.mustard} seed={9} grow={[MX, MY]} at={0.45} />
      </Set>
      {nameIn > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1920, transform: `rotate(${S.layout.diagonal}deg)`, transformOrigin: `${bx}px ${by}px` }}>
          <Credit line={caps(SAMPLE.diagram.in)} size={S.type.credit} x={bx - 460} y={by - S.type.credit * 0.5} at={0.3} />
        </div>
      ) : null}
      <Credit line="AIR" size={S.type.label + 14} x={MX - 150} box={300} y={MY - 94} align="center" at={0.8} />
      <Credit line="MOLECULE" size={S.type.label + 14} x={MX - 150} box={300} y={MY - 12} align="center" at={0.9} />
      <Credit line={caps(SAMPLE.diagram.out)} size={S.type.credit} y={1466} ink={C.paper} at={1.5} />
    </Ground>
  );
};

/** Number: paper ground, one enormous figure; blue and red are strips of paper cut to the true ratio. */
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const t = twos(useSeconds());
  const size = S.type.number;
  const long = COLUMN;
  const p = ease("land", t - 1.3);
  return (
    <Ground hue={C.paper} seed={6}>
      <Set>
        <Piece pts={band(1000, 340, 90)} fill={C.mustard} seed={21} shadow={false} from={[300, 170]} />
        <Piece pts={[[M, 1170], [M + long, 1170], [M + long, 1284], [M, 1284]]} fill={C.ink} seed={22} from={[-1100, 0]} at={1.1} />
        <Piece pts={[[M, 1330], [M + long / n.value, 1330], [M + long / n.value, 1444], [M, 1444]]} fill={C.red} seed={23} from={[-400, 0]} at={1.25} />
      </Set>
      <Credit line={`${n.value.toFixed(n.decimals)}*${n.unit}*`} size={size} y={TOP - 10} at={0.2} each seed={9} />
      {p > 0 ? <Credit line="BLUE · 450 NM" size={S.type.label} x={M + 28} y={1196} ink={C.paper} at={1.3} /> : null}
      {p > 0 ? <Credit line="RED · 700 NM" size={S.type.label} x={M + long / n.value + 32} y={1356} at={1.4} /> : null}
      <Strip text={n.caption} y={930} width={COLUMN} at={0.8} onDark={false} />
    </Ground>
  );
};

/** List: red ground, a column of type; the same circle repeats down the frame like a match cut. */
const List: React.FC = () => {
  const rows = SAMPLE.list.map((item) => wrap(caps(item), 16));
  const size = fit(rows.flat(), 660, 124, EM);
  return (
    <Ground hue={C.red} seed={7}>
      <Set>
        <Piece pts={band(40, 1100, 120)} fill={C.darkRed} seed={31} shadow={false} from={[-300, -170]} />
        {rows.map((_, i) => (
          <React.Fragment key={i}>
            <Piece pts={ring(190, 420 + i * 390, 98)} fill={C.ink} seed={32 + i} shadow={false} grow={[190, 420 + i * 390]} at={0.2 + i * 0.3} />
            <Piece pts={ring(190, 420 + i * 390, 86)} fill={i === 2 ? C.mustard : C.paper} seed={36 + i} grow={[190, 420 + i * 390]} at={0.25 + i * 0.3} />
          </React.Fragment>
        ))}
      </Set>
      {rows.map((lines, i) => (
        <React.Fragment key={i}>
          <Credit line={String(i + 1)} size={132} x={90} box={200} y={420 + i * 390 - 62} align="center" at={0.3 + i * 0.3} seed={i + 13} />
          {lines.map((line, k) => (
            <Credit key={k} line={line} size={size} x={330} y={420 + i * 390 - (lines.length * size * LEAD) / 2 + k * size * LEAD + 6} at={0.35 + i * 0.3 + k * E.sixteenth} seed={i * 3 + k + 16} ink={i === 2 ? C.paper : C.ink} />
          ))}
        </React.Fragment>
      ))}
    </Ground>
  );
};

/** End: black ground, a giant mustard circle, the figure in profile looking up at it. */
const End: React.FC = () => {
  const words2 = wrap(caps(SAMPLE.end.line), 8);
  const size = fit(words2, COLUMN, 270, EM);
  return (
    <Ground hue={C.ink} seed={8} dark>
      <Set>
        <Piece pts={band(1000, 1120, 60)} fill={C.distant} seed={41} shadow={false} from={[300, 170]} />
        <Piece pts={ring(620, 620, 340)} fill={C.mustard} seed={42} grow={[620, 620]} at={0.1} />
        <Figure x={490} y={935} height={400} gap={C.mustard} at={0.45} />
      </Set>
      {words2.map((line, i) => (
        <Credit key={i} line={line} size={size} y={960 + i * size * LEAD} ink={C.paper} em={C.red} at={0.7 + i * 0.3} seed={i + 21} />
      ))}
      <Strip text={SAMPLE.end.cta} y={1500} width={480} at={1.5} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 2.6, hero: 2.2, component: HeadlineSample },
  { id: "diagram", duration: 2.8, hero: 2.4, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.3, component: NumberSample },
  { id: "list", duration: 2.6, hero: 2.2, component: List },
  { id: "end", duration: 2.6, hero: 2.2, component: End },
];
