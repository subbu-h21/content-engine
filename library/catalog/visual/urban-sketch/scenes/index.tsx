/** Urban Sketch on the shared sample content: pages of a location sketchbook, ink first and colour arriving after. */
import React from "react";
import { fit, SAMPLE, wrap, type Sample } from "../../kit";
import { blob, C, circle, city, curl, E, Ink, M, P, Page, person, S, tree, W, Wash, Written, type Pt, type Sketch, type Stroke, type WashItem } from "./parts";

const COLUMN = W - 2 * M;
const EM = S.type.charEm;
const TOP = S.layout.safe.top;
const join = (...parts: Sketch[]): Sketch => ({ strokes: parts.flatMap((p) => p.strokes), washes: parts.flatMap((p) => p.washes) });
const ground = (y: number, x0: number, x1: number, at: number): Stroke[] => [{ pts: [[x0, y], [x1, y + 4]], at, w: E.line[0] + 0.6 }, { pts: [[x0 + 90, y + 34], [x1 - 150, y + 38]], at: at + 0.1 }];

/** Title: rooftops under a sky that blooms in, with a cloud left as bare paper. */
const skyWash = (cx: number, cy: number, rx: number, ry: number, at: number, seed: number, cloud?: [number, number, number, number], belly = true): WashItem[] => {
  const hole = cloud ? blob(cloud[0], cloud[1], cloud[2], cloud[3], seed + 1, 0.2) : "";
  return [
    { d: blob(cx, cy, rx, ry, seed, 0.1) + hole, hue: P.sky[0], at, from: [cx, cy - ry * 0.3], r: Math.max(rx, ry) * 1.3, alpha: 0.62 },
    { d: blob(cx, cy - ry * 0.3, rx * 0.84, ry * 0.5, seed + 2, 0.14) + hole, hue: P.sky[1], at: at + 0.25, from: [cx, cy - ry * 0.3], r: rx * 1.2, alpha: 0.3 },
    ...(cloud && belly ? [{ d: blob(cloud[0] + 8, cloud[1] + cloud[3] * 0.62, cloud[2] * 0.8, cloud[3] * 0.34, seed + 3, 0.2), hue: P.cloudBelly, at: at + 0.4, from: [cloud[0], cloud[1]] as Pt, r: cloud[2] * 2, alpha: 0.5 }] : []),
  ];
};
const TITLE_SCENE = join(
  city({ x0: 120, x1: 960, base: 1370, hMin: 200, hMax: 330, seed: 15, at: 0.2, washAt: 1.2, far: true }),
  city({ x0: 170, x1: 800, base: 1370, hMin: 120, hMax: 230, seed: 6, at: 0.5, washAt: 1.35 }),
  tree(880, 1372, 74, 8, 0.7, 1.5),
  person(300, 1420, 0.92, 0.9, 1.65),
  { strokes: ground(1372, 104, 980, 0.15), washes: [] },
);
const Title: React.FC = () => {
  const size = S.type.title;
  const lines = wrap(SAMPLE.title, Math.floor(COLUMN / (size * EM)));
  return (
    <Page seed={3}>
      <Wash items={[...skyWash(540, 985, 440, 310, 0.95, 21, [700, 890, 130, 54]), ...TITLE_SCENE.washes]} />
      <Ink strokes={TITLE_SCENE.strokes} />
      <Written lines={[SAMPLE.kicker]} size={S.type.note} y={TOP + 56} note at={0.1} />
      <Written lines={lines} size={size} y={TOP + 210} weight={600} at={0.5} />
    </Page>
  );
};

/** Headline: a sun and every colour in the pan set, fanned out in loose strokes. */
const SUN: Pt = [540, 760];
const PIGMENTS = [P.red, P.buildings[1], C.hat, P.foliage[2], P.sky[1], C.shadow];
const FAN = PIGMENTS.map((hue, i) => {
  const a = Math.PI * (0.16 + (i / 5) * 0.68);
  const [x, y] = [SUN[0] + 300 * Math.cos(a), SUN[1] + 300 * Math.sin(a)];
  return { a, x, y, hue, i };
});
const SUN_STROKES: Stroke[] = [
  { pts: circle(SUN[0], SUN[1], 82), at: 0.25, w: E.line[1] - 0.6 },
  ...Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    return { pts: [[SUN[0] + 104 * Math.cos(a), SUN[1] + 104 * Math.sin(a)], [SUN[0] + 148 * Math.cos(a), SUN[1] + 148 * Math.sin(a)]] as Pt[], at: 0.4 + i * 0.03, w: E.line[0] + 0.6 };
  }),
];
const FAN_WASHES: WashItem[] = FAN.map(({ a, x, y, hue, i }) => {
  const pts: string[] = [];
  for (let k = 0; k < 28; k++) {
    const th = (k / 28) * Math.PI * 2;
    const [u, v] = [140 * Math.cos(th), (34 + 8 * Math.sin(th * 3 + i)) * Math.sin(th)];
    pts.push(`${(x + u * Math.cos(a) - v * Math.sin(a)).toFixed(1)} ${(y + u * Math.sin(a) + v * Math.cos(a)).toFixed(1)}`);
  }
  return { d: `M${pts.join("L")}Z`, hue, at: 1.0 + i * 0.16, from: [SUN[0] + 170 * Math.cos(a), SUN[1] + 170 * Math.sin(a)] as Pt, r: 320, alpha: 0.68 };
});
const HeadlineSample: React.FC = () => {
  const size = fit(SAMPLE.headline, COLUMN, S.type.display, EM);
  return (
    <Page seed={4}>
      <Wash items={[{ d: blob(SUN[0], SUN[1], 80, 80, 31, 0.05), hue: C.hat, at: 0.7, from: SUN, r: 110, alpha: 0.72 }, ...FAN_WASHES]} />
      <Ink strokes={SUN_STROKES} />
      <Written lines={[SAMPLE.chapter]} size={S.type.note} y={TOP + 56} note at={0.05} />
      <Written lines={SAMPLE.headline} size={size} y={TOP + 190} weight={600} at={0.2} swipe={C.hat} />
      <Written lines={wrap(SAMPLE.body, 37)} size={S.type.body} y={1270} leading={1.04} at={1.5} />
    </Page>
  );
};

/** Diagram: not a chart. A sketch of the air over the roofs: light comes in as wavy ink, blue blooms out of the molecule. */
const MOL: Pt = [590, 800];
const wavy = (x0: number, y0: number, x1: number, y1: number, ph: number): Pt[] => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const [nx, ny] = [-(y1 - y0) / len, (x1 - x0) / len];
  return Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    const o = 11 * Math.sin(u * 16 + ph);
    return [x0 + (x1 - x0) * u + nx * o, y0 + (y1 - y0) * u + ny * o] as Pt;
  });
};
const ROOFS = city({ x0: 130, x1: 950, base: 1460, hMin: 90, hMax: 170, seed: 25, at: 0.1, colour: false });
const DIAGRAM_STROKES: Stroke[] = [
  ...ROOFS.strokes,
  { pts: circle(204, 430, 62), at: 0.3, w: E.line[1] - 0.6 },
  ...[-30, 0, 30].map((o, i) => ({ pts: wavy(262 + o, 494 - o, MOL[0] - 96 + o, MOL[1] - 96 - o, i * 2), at: 0.5 + i * 0.1, w: E.line[0] + 0.5 })),
  { pts: circle(MOL[0], MOL[1], 58), at: 0.75, w: E.line[1] },
  { pts: circle(MOL[0], MOL[1], 66, 2.2).slice(0, 15), at: 0.9 },
  ...[0.1, 0.9, 2.3, 3.0, 4.75, 5.55].map((a, i) => curl(MOL[0] + 92 * Math.cos(a), MOL[1] + 92 * Math.sin(a), a, 1.1, 1.2 + i * 0.1, 40 + i)),
  { pts: [[250, 1120], [MOL[0] - 64, MOL[1] + 48]], at: 1.5 },
  { pts: [[760, 1120], [MOL[0] + 44, MOL[1] + 50]], at: 1.65 },
];
const Diagram: React.FC = () => (
  <Page seed={5}>
    <Wash items={[{ d: blob(204, 430, 60, 60, 33, 0.05), hue: C.hat, at: 0.5, from: [204, 430], r: 90, alpha: 0.75 }, ...skyWash(MOL[0], MOL[1], 350, 300, 1.1, 41, [MOL[0], MOL[1], 76, 76], false)]} />
    <Ink strokes={DIAGRAM_STROKES} />
    <Written lines={[SAMPLE.diagram.in]} size={S.type.label} y={TOP + 120} x={300} at={0.6} />
    <Written lines={[SAMPLE.diagram.object]} size={S.type.label} y={1180} x={M + 24} at={1.6} />
    <Written lines={[SAMPLE.diagram.label]} size={S.type.label} y={1180} x={520} at={1.9} />
    <Written lines={[SAMPLE.diagram.out]} size={S.type.body} y={1550} at={2.4} />
  </Page>
);

/** Number: the figure written large; blue and red are two painted strokes, true to the ratio. */
const strip = (y: number, length: number, seed: number, hue: string, at: number): WashItem => {
  const pts: string[] = [];
  for (let i = 0; i <= 12; i++) pts.push(`${(M + (length * i) / 12).toFixed(1)} ${(y + 3 * Math.sin(i * 1.7 + seed)).toFixed(1)}`);
  for (let i = 12; i >= 0; i--) pts.push(`${(M + (length * i) / 12).toFixed(1)} ${(y + 78 + 4 * Math.sin(i * 1.3 + seed)).toFixed(1)}`);
  return { d: `M${pts.join("L")}Z`, hue, at, from: [M, y + 40], r: length * 1.1, alpha: 0.74 };
};
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const blue = COLUMN;
  return (
    <Page seed={6}>
      <Wash items={[strip(1130, blue, 2, P.sky[1], 1.0), strip(1350, blue / n.value, 3, P.red, 1.3)]} />
      <Written lines={[SAMPLE.chapter]} size={S.type.note} y={TOP + 56} note at={0.05} />
      <Written lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size={S.type.number} y={640} weight={600} at={0.2} />
      <Written lines={wrap(n.caption, 34)} size={S.type.body} y={780} leading={1.04} at={0.8} />
      <Written lines={["Blue, 450 nm"]} size={S.type.label} y={1100} at={1.1} />
      <Written lines={["Red, 700 nm"]} size={S.type.label} y={1320} at={1.4} />
    </Page>
  );
};

/** List: a journal page; each step has a thumbnail sketch beside it. */
const ROW0 = 560;
const ROW = 330;
const THUMB = 196;
const row = (i: number) => ROW0 + i * ROW;
const LIST_STROKES: Stroke[] = [
  { pts: circle(THUMB, row(0), 54), at: 0.3, w: E.line[1] - 0.8 },
  ...Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return { pts: [[THUMB + 72 * Math.cos(a), row(0) + 72 * Math.sin(a)], [THUMB + 100 * Math.cos(a), row(0) + 100 * Math.sin(a)]] as Pt[], at: 0.4 + i * 0.02 };
  }),
  ...[0, 2.1, 4.2].map((a, i) => curl(THUMB + 24 * Math.cos(a), row(1) + 24 * Math.sin(a), a, 0.55, 0.8 + i * 0.1, 60 + i)),
];
const LIST_PERSON = person(THUMB - 10, row(2) + 92, 0.68, 1.3, 1.8);
const List: React.FC = () => {
  const rows = SAMPLE.list.map((item) => wrap(item, 16));
  const size = fit(rows.flat(), 640, 88, EM);
  return (
    <Page seed={7}>
      <Wash
        items={[
          { d: blob(THUMB, row(0), 50, 50, 51, 0.05), hue: C.hat, at: 0.6, from: [THUMB, row(0)], r: 80, alpha: 0.72 },
          { d: blob(THUMB, row(1), 118, 92, 52, 0.14), hue: P.sky[1], at: 1.0, from: [THUMB, row(1)], r: 170, alpha: 0.6 },
          { d: blob(THUMB, row(2), 122, 120, 53, 0.14), hue: P.sky[0], at: 1.5, from: [THUMB, row(2) - 40], r: 180, alpha: 0.62 },
          ...LIST_PERSON.washes,
        ]}
      />
      <Ink strokes={[...LIST_STROKES, ...LIST_PERSON.strokes]} />
      <Written lines={[SAMPLE.chapter]} size={S.type.note} y={TOP + 56} note at={0.05} />
      {rows.map((lines, i) => (
        <Written key={i} lines={lines} size={size} x={350} y={row(i) - ((lines.length - 1) * size) / 2 + size * 0.3} weight={600} at={0.3 + i * 0.5} />
      ))}
    </Page>
  );
};

/** End: the town stays line only; the sky has arrived, and the hat. */
const END_SCENE = join(
  city({ x0: 120, x1: 430, base: 1330, hMin: 130, hMax: 250, seed: 35, at: 0.1, colour: false }),
  city({ x0: 660, x1: 960, base: 1330, hMin: 130, hMax: 250, seed: 36, at: 0.2, colour: false }),
  person(540, 1450, 1.45, 0.5, 1.4),
  { strokes: ground(1332, 104, 980, 0.1), washes: [] },
);
const End: React.FC = () => {
  const size = fit([SAMPLE.end.line], COLUMN, S.type.title, EM);
  return (
    <Page seed={8}>
      <Wash items={[...skyWash(540, 860, 440, 300, 0.9, 61, [300, 800, 120, 48]), ...END_SCENE.washes]} />
      <Ink strokes={END_SCENE.strokes} />
      <Written lines={[SAMPLE.end.line]} size={size} y={TOP + 170} weight={600} at={0.3} />
      <Written lines={[SAMPLE.end.cta]} size={S.type.note} y={1560} note at={1.7} />
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 4.3, hero: 3.9, component: HeadlineSample },
  { id: "diagram", duration: 3.8, hero: 3.4, component: Diagram },
  { id: "number", duration: 3.6, hero: 3.1, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.1, component: List },
  { id: "end", duration: 3.2, hero: 2.8, component: End },
];
