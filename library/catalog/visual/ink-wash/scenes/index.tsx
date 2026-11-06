/** Ink Wash on the shared sample content: a hanging-scroll title, five tones, the scattering, brush numerals, a list, the end. */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { arc, Brush, Column, Figure, Inscription, Mass, Mountain, Paper, Pine, range, Ring, S, Seal, Strokes, T, Texture, TONE, type BrushProps, type Pt } from "./parts";

const M = S.layout.margin;
const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");
const caps = (s: string) => s.replace(/\*/g, "").toUpperCase();

/** A rock on the near bank: a heavy mass, a loaded contour along its top, moss dots. */
const Rock: React.FC<{ top: Pt[]; at: number; seed: number; bottom?: number }> = ({ top, at, seed, bottom = 1960 }) => (
  <>
    <Mass poly={[...top, [top[top.length - 1][0], bottom], [top[0][0], bottom]]} tone={TONE.heavy} at={at} fadeFrom={Math.min(...top.map((p) => p[1]))} fadeTo={bottom - 60} seed={seed} />
    <Brush pts={top} width={18} tone={TONE.thick} at={at + 0.3} kind="even" dry={0.5} seed={seed + 1} side={-1} />
    <Strokes
      list={top.slice(1, -1).map(([x, y], i) => ({ pts: [[x - 10, y + 40 + i * 6], [x + 30, y + 110 + i * 4]] as Pt[], width: 22, tone: TONE.heavy, kind: "tip" as const, dry: 0.7, smooth: false }))}
      at={at + 0.5}
      gap={0.03}
      seed={seed + 3}
    />
    <Texture ridge={top} at={at + 0.6} seed={seed + 2} count={5} len={90} tone={TONE.thick} />
  </>
);

// ------------------------------------------------------------------ title: a hanging scroll

const Title: React.FC = () => {
  const far = range(-60, 760, 1200, 300, 3, 3, 1560);
  const mid = range(-80, 560, 1420, 210, 7, 2, 1700);
  const rockTop: Pt[] = [
    [-30, 1650],
    [120, 1590],
    [250, 1576],
    [400, 1612],
    [560, 1720],
    [640, 1940],
  ];
  return (
    <Paper>
      <Mountain {...far} tone={TONE.clear} at={0} fadeTo={1440} seed={11} />
      <Mountain {...mid} tone={TONE.light} at={0.35} fadeTo={1660} seed={13} />
      <Texture ridge={mid.ridge} at={0.8} seed={13} count={6} len={110} tone={TONE.light} />
      <Rock top={rockTop} at={0.7} seed={20} />
      <Pine x={330} y={1600} h={460} lean={0.4} at={1.2} seed={30} />
      <Figure x={180} y={1584} h={104} at={1.9} />
      <Inscription lines={[SAMPLE.kicker]} x={M} y={330} at={0.3} size={T.label} />
      <Column text={caps(plainOf(SAMPLE.title))} x={900} y={300} at={1.5} />
      <Column text={caps(emOf(SAMPLE.title))} x={806} y={560} at={2.1} />
      <Seal x={768} y={990} at={2.7} />
    </Paper>
  );
};

// ------------------------------------------------------------------ headline: one sun, five tones of one ink

const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const l1 = all.slice(0, 2).map((w) => w.text).join(" ");
  const l2 = all.slice(2).map((w) => w.text).join(" ");
  const tones = [TONE.burnt, TONE.thick, TONE.heavy, TONE.light, TONE.clear];
  const list: Omit<BrushProps, "at" | "seed">[] = tones.map((tone, i) => {
    const y = 1150 + i * 84;
    const x1 = 860 - i * 34;
    return { pts: [[200 + i * 6, y + 6], [420, y - 6], [640, y + 4], [x1, y - 2]] as Pt[], width: 40, tone, dry: 0.2 + i * 0.1, kind: "brush" as const, side: 1, dur: 0.3 };
  });
  return (
    <Paper>
      <Inscription lines={[l1, l2]} x={M} y={360} at={0.1} size={66} />
      <Brush pts={arc(540, 800, 196, 192, 118, 448, 64)} width={46} tone={TONE.burnt} at={0.7} dur={0.9} dry={0.5} kind="brush" seed={41} side={-1} />
      <Strokes list={list} at={1.5} gap={0.06} seed={50} />
    </Paper>
  );
};

// ------------------------------------------------------------------ diagram

const Diagram: React.FC = () => {
  const c: Pt = [568, 820];
  const scatter = [-75, -30, 5, 75, 120, 160, 200].map((d) => (d * Math.PI) / 180);
  return (
    <Paper>
      <Inscription lines={[SAMPLE.diagram.in]} x={M} y={330} at={0.1} size={T.label} />
      <Brush pts={[[96, 400], [260, 540], [430, 700]]} width={46} tone={TONE.thick} at={0.35} kind="tip" dry={0.6} seed={61} decisive />
      <Mass poly={arc(c[0] - 58, c[1] + 8, 80, 78, 0, 360, 40)} tone={TONE.light} at={0.8} dur={0.5} seed={62} fadeFrom={c[1] - 90} fadeTo={c[1] + 140} />
      <Mass poly={arc(c[0] + 58, c[1] - 8, 80, 78, 0, 360, 40)} tone={TONE.light} at={0.9} dur={0.5} seed={63} fadeFrom={c[1] - 100} fadeTo={c[1] + 130} />
      <Brush pts={arc(c[0] - 58, c[1] + 8, 82, 80, 110, 250, 20)} width={12} tone={TONE.thick} at={1.1} kind="lens" dry={0.3} seed={64} smooth={false} />
      <Brush pts={arc(c[0] + 58, c[1] - 8, 82, 80, -70, 70, 20)} width={12} tone={TONE.thick} at={1.2} kind="lens" dry={0.3} seed={65} smooth={false} />
      <Strokes
        list={scatter.map((a) => ({ pts: [[c[0] + Math.cos(a) * 158, c[1] + Math.sin(a) * 148], [c[0] + Math.cos(a) * 300, c[1] + Math.sin(a) * 280]] as Pt[], width: 22, tone: TONE.light * 1.4, kind: "brush" as const, dry: 0.55, smooth: false }))}
        at={1.5}
        gap={0.02}
        seed={70}
      />
      <Brush pts={[[c[0] + 108, c[1] + 110], [800, 1090], [930, 1260]]} width={9} tone={TONE.burnt} at={2.35} kind="even" dry={0.25} seed={80} />
      <Inscription lines={["red, onward"]} x={900} y={1330} at={2.7} size={T.label} anchor="middle" />
      <Inscription lines={[SAMPLE.diagram.object]} x={M} y={1110} at={1.3} size={T.label} />
      <Inscription lines={[SAMPLE.diagram.label]} x={M + 30} y={1460} at={2.9} size={60} mark />
    </Paper>
  );
};

// ------------------------------------------------------------------ number: brush numerals and two strokes to the true ratio

/** "5.9×" as brushstrokes (a hidden-tip entry, a tapered exit, flying white), baseline at y, 300 px tall. */
const numeralStrokes = (x: number, y: number): Omit<BrushProps, "at" | "seed">[] => {
  const P = (dx: number, dy: number): Pt => [x + dx, y + dy];
  const big = { width: 40, tone: TONE.burnt, kind: "brush" as const, side: -1 };
  return [
    { ...big, pts: [P(24, -296), P(90, -300), P(160, -306)], dry: 0.25, kind: "tip" },
    { ...big, pts: [P(30, -296), P(26, -230), P(20, -172)], dry: 0.2, kind: "even" },
    { ...big, pts: [P(22, -172), P(84, -204), P(152, -182), P(168, -96), P(122, -16), P(52, -6), P(6, -40)], dry: 0.45 },
    { ...big, pts: [P(206, -26), P(218, -12)], width: 34, dry: 0.05, kind: "lens", smooth: false },
    { ...big, pts: [P(410, -236), P(370, -300), P(300, -292), P(282, -222), P(326, -172), P(398, -186), P(412, -244)], dry: 0.35 },
    { ...big, pts: [P(412, -244), P(404, -120), P(362, -22), P(298, 0)], dry: 0.55 },
    { ...big, pts: [P(470, -196), P(580, -60)], width: 30, dry: 0.3, kind: "tip", smooth: false },
    { ...big, pts: [P(580, -196), P(470, -60)], width: 30, dry: 0.4, kind: "tip", smooth: false },
  ];
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const full = 760;
  const x0 = 110;
  return (
    <Paper>
      <Strokes list={numeralStrokes(160, 690)} at={0.1} gap={0.06} seed={90} />
      <Inscription lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} x={M} y={880} at={1.6} size={T.label} />
      <Inscription lines={["blue · 450 nm"]} x={M} y={1110} at={2.0} size={T.label - 4} />
      <Brush pts={[[x0, 1180], [x0 + full * 0.5, 1172], [x0 + full, 1182]]} width={30} tone={TONE.light} at={2.1} dry={0.35} seed={95} />
      <Inscription lines={["red · 700 nm"]} x={M} y={1290} at={2.6} size={T.label - 4} />
      <Brush pts={[[x0, 1352], [x0 + full / n.value, 1350]]} width={30} tone={TONE.thick} at={2.7} dry={0.2} seed={96} smooth={false} kind="even" />
    </Paper>
  );
};

// ------------------------------------------------------------------ list: three small scenes down a hanging scroll

const List: React.FC = () => {
  const rows = [520, 920, 1320];
  const tx = 400;
  const size = 54;
  return (
    <Paper>
      <Brush pts={arc(220, rows[0], 92, 90, 120, 448, 48)} width={24} tone={TONE.burnt} at={0.1} dur={0.6} dry={0.5} seed={101} side={-1} />
      <Mass poly={arc(186, rows[1], 52, 50, 0, 360, 30)} tone={TONE.light} at={1.1} dur={0.4} seed={102} />
      <Mass poly={arc(258, rows[1] - 6, 52, 50, 0, 360, 30)} tone={TONE.light} at={1.2} dur={0.4} seed={103} />
      <Strokes
        list={[-80, -10, 60, 140, 200].map((d) => {
          const a = (d * Math.PI) / 180;
          return { pts: [[222 + Math.cos(a) * 92, rows[1] + Math.sin(a) * 82], [222 + Math.cos(a) * 156, rows[1] + Math.sin(a) * 136]] as Pt[], width: 9, tone: TONE.light, kind: "tip" as const, dry: 0.3, smooth: false };
        })}
        at={1.5}
        gap={0.02}
        seed={110}
      />
      <Brush pts={[[60, rows[2] + 60], [220, rows[2] + 52], [380, rows[2] + 62]]} width={10} tone={TONE.light} at={2.0} dry={0.6} seed={120} kind="even" />
      <Figure x={220} y={rows[2] + 56} h={150} at={2.2} seed={130} />
      {SAMPLE.list.map((s, i) => (
        <Inscription key={i} lines={wrap(s, 16)} x={tx} y={rows[i] - 14} at={0.5 + i * 0.85} size={size} mark />
      ))}
    </Paper>
  );
};

// ------------------------------------------------------------------ end: a river of blank paper, a figure looking up

const End: React.FC = () => {
  const far = range(420, 1160, 1150, 330, 21, 3, 1460);
  const mid = range(620, 1180, 1330, 200, 22, 2, 1520);
  const bank: Pt[] = [
    [-30, 1760],
    [140, 1700],
    [300, 1712],
    [460, 1790],
    [560, 1940],
  ];
  const streaks: Omit<BrushProps, "at" | "seed">[] = [1480, 1530, 1585, 1640].map((y, i) => ({ pts: [[460 + i * 60, y], [700 + i * 40, y - 3], [980 - i * 30, y + 2]] as Pt[], width: 7, tone: TONE.clear * 1.6, dry: 0.75, kind: "even" as const, bristles: 5 }));
  return (
    <Paper>
      <Mountain {...far} tone={TONE.clear} at={0} fadeTo={1400} seed={201} />
      <Mountain {...mid} tone={TONE.light} at={0.3} fadeTo={1500} seed={203} />
      <Strokes list={streaks} at={0.7} gap={0.05} seed={210} />
      <Ring x={700} y={1600} r={46} at={1.4} seed={3} />
      <Ring x={700} y={1600} r={86} at={1.7} tone={TONE.clear * 1.5} seed={4} />
      <Rock top={bank} at={0.5} seed={220} />
      <Figure x={250} y={1708} h={130} at={1.4} seed={230} />
      <Column text={caps(plainOf(SAMPLE.end.line))} x={250} y={300} at={1.8} size={T.title + 4} />
      <Column text={caps(emOf(SAMPLE.end.line))} x={156} y={560} at={2.3} size={T.title + 4} />
      <Seal x={116} y={1100} at={2.8} />
      <Inscription lines={[SAMPLE.end.cta]} x={M} y={1300} at={3.0} size={T.label} />
    </Paper>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4.0, hero: 3.4, component: Title },
  { id: "headline", duration: 4.2, hero: 3.6, component: HeadlineSample },
  { id: "diagram", duration: 4.0, hero: 3.5, component: Diagram },
  { id: "number", duration: 3.8, hero: 3.3, component: NumberSample },
  { id: "list", duration: 3.8, hero: 3.3, component: List },
  { id: "end", duration: 4.0, hero: 3.5, component: End },
];

