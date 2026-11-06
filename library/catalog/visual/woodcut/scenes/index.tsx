/** Woodcut on the shared sample content: each sample is one plate carved out of the block, captions in the margin. */
import React from "react";
import { fit, SAMPLE, seeded, wrap, type Sample } from "../../kit";
import { aboveHill, arcPts, BX0, BX1, BY0, BY1, burst, C, Carved, cut, Cuts, disc, E, hillHatch, hillY, Press, Print, S, sky, W, type Cut } from "./parts";

const COLUMN = BX1 - BX0 - 92;
const EM = S.type.charEm;

/** Title: a sun rising out of the uncut block, the title carved in the black below it. */
const SUN: [number, number] = [W / 2, 668];
const TITLE_CUTS: Cut[] = [
  ...disc(SUN[0], SUN[1], 112, 0.05, 2, true),
  ...burst({ cx: SUN[0], cy: SUN[1], n: E.rays.count, r0: 150, r1: [340, 500], a0: Math.PI, a1: Math.PI * 2, w: E.rays.width * 1.5, at: 0.2, seed: 3 }),
  ...burst({ cx: SUN[0], cy: SUN[1], n: E.rays.count * 2, r0: 240, r1: [300, 470], a0: Math.PI, a1: Math.PI * 2, w: E.vgouge[1] * 0.6, at: 0.6, seed: 4 }),
  cut([[BX0 - 6, SUN[1] + 2], [BX1 + 6, SUN[1] - 2]], E.vgouge[1], 0.05),
];
const Title: React.FC = () => {
  const size = S.type.title;
  return (
    <Print seed={11} margin={<Press text={SAMPLE.kicker} at={1.9} />}>
      <Cuts cuts={TITLE_CUTS} />
      <Carved lines={wrap(SAMPLE.title, Math.floor(COLUMN / (size * EM)))} size={size} y={838} at={0.8} />
    </Print>
  );
};

/** Headline: arcs of sky around the light, a hill left black, the words carved in the black. */
const HILL = 800;
const LIGHT: [number, number] = [760, 400];
const HEADLINE_CUTS: Cut[] = [...disc(LIGHT[0], LIGHT[1], 92, 0.05, 6), ...sky({ cx: LIGHT[0], cy: LIGHT[1], r0: 132, r1: 980, at: 0.15, seed: 7 })];
const HILL_CUTS = hillHatch(HILL, 1.4, LIGHT[0], 1.0);
const HeadlineSample: React.FC = () => {
  const lines = wrap(SAMPLE.headline.join(" "), 16);
  const size = fit(lines, COLUMN, S.type.display, EM);
  return (
    <Print seed={12} margin={<Press text={SAMPLE.body} size={S.type.body} at={2.1} />}>
      <Cuts cuts={HEADLINE_CUTS} clip={aboveHill(HILL, 1.4)} />
      <Cuts cuts={HILL_CUTS} />
      <Carved lines={lines} size={size} y={1010} at={0.4} />
    </Print>
  );
};

/** Diagram: a beam of gouges hits one sphere; blue leaves it in every direction, printed in the cuts. */
const [MX, MY, MR] = [W / 2, 740, 104];
const BEAM = Math.atan2(MY - BY0, MX - BX0);
const beamCuts = (): Cut[] => {
  const rnd = seeded(21);
  const out: Cut[] = [];
  const [dx, dy] = [Math.cos(BEAM), Math.sin(BEAM)];
  const end = Math.hypot(MX - BX0, MY - BY0) - MR - 30;
  [-2, -1, 0, 1, 2].forEach((k) => {
    let s = -40 + rnd() * 30;
    while (s < end - 20) {
      const len = Math.min(end - s, 90 + rnd() * E.cutLength[1]);
      const [ox, oy] = [BX0 - dy * k * 26, BY0 + dx * k * 26];
      out.push(cut([[ox + dx * s, oy + dy * s], [ox + dx * (s + len), oy + dy * (s + len)]], E.ugouge[0] * 1.4, 0.1 + (s / end) * 0.6));
      s += len + 12 + rnd() * 18;
    }
  });
  return out;
};
const sphereCuts = (): Cut[] => {
  const rnd = seeded(22);
  const out: Cut[] = [cut(arcPts(MX, MY, MR + 8, 0, Math.PI * 1.05), E.knife[1] * 2.4, 0.5), cut(arcPts(MX, MY, MR + 8, Math.PI, Math.PI * 2.05), E.knife[1] * 2.4, 0.5)];
  for (let r = MR * 0.42; r < MR * 0.96; r += 15) {
    const a = -2.3 + (rnd() - 0.5) * 0.3;
    const span = 0.45 + 0.6 * (r / MR);
    out.push(cut(arcPts(MX, MY, r, a - span / 2, a + span / 2), E.vgouge[0] + (r / MR) * 5, 0.8 + rnd() * 0.3));
  }
  return out;
};
const DIAGRAM_CUTS: Cut[] = [
  ...beamCuts(),
  ...sphereCuts(),
  ...burst({ cx: MX, cy: MY, n: E.rays.count, r0: MR + 44, r1: [290, 400], w: E.rays.width * 1.5, at: 1.0, seed: 23, plate: true, skip: (a) => Math.abs(Math.atan2(Math.sin(a - BEAM - Math.PI), Math.cos(a - BEAM - Math.PI))) < 0.42 }),
];
const Diagram: React.FC = () => (
  <Print seed={13} margin={<Press text={SAMPLE.diagram.out} at={2.2} />}>
    <Cuts cuts={DIAGRAM_CUTS} />
    <Carved lines={[SAMPLE.diagram.in]} size={S.type.label * 1.3} y={272} x={330} anchor="start" at={0.5} />
    <Carved lines={[SAMPLE.diagram.object]} size={S.type.label * 1.3} y={1208} at={1.3} />
    <Carved lines={[SAMPLE.diagram.label]} size={S.type.label} y={1266} at={1.6} />
  </Print>
);

/** Number: the figure carved huge; blue and red are lengths of gouged line, true to the ratio. */
const lerpLen = (u: number): number => E.cutLength[1] * (0.5 + 0.5 * u);
const barCuts = (y: number, length: number, at: number, seed: number, plate: boolean): Cut[] => {
  const rnd = seeded(seed);
  const x0 = BX0 + 46;
  const out: Cut[] = [];
  [-1, 0, 1].forEach((row) => {
    let s = rnd() * 6;
    while (s < length - 6) {
      const len = Math.min(length - s, lerpLen(rnd()));
      out.push(cut([[x0 + s, y + row * 15], [x0 + s + len, y + row * 15 + (rnd() - 0.5) * 3]], E.ugouge[0] * 1.5, at + (s / length) * 0.5, plate));
      s += len + 2;
    }
  });
  return out;
};
const skyBand = (y0: number, y1: number, at: number): Cut[] => {
  const rnd = seeded(31);
  const out: Cut[] = [];
  for (let y = y0; y < y1; y += E.skySpacing * 1.6) {
    const w = E.ugouge[0] * 1.5 * (1 - (y - y0) / (y1 - y0)) + E.vgouge[0];
    let x = BX0 - 30 + rnd() * 40;
    while (x < BX1) {
      const len = lerpLen(rnd());
      out.push(cut([[x, y], [x + len, y + (rnd() - 0.5) * 6]], w, at + rnd() * 0.3));
      x += len + 14 + rnd() * 26;
    }
  }
  return out;
};
const NUMBER_BLUE = BX1 - BX0 - 92;
const NUMBER_CUTS: Cut[] = [...skyBand(BY0 + 14, 300, 0.05), ...barCuts(942, NUMBER_BLUE, 1.0, 32, true), ...barCuts(1166, NUMBER_BLUE / SAMPLE.number.value, 1.2, 33, false)];
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  return (
    <Print seed={14} margin={<Press text={n.caption} at={2.0} />}>
      <Cuts cuts={NUMBER_CUTS} />
      <Carved lines={[`${n.value.toFixed(n.decimals)}*${n.unit}*`]} size={S.type.number} y={680} at={0.3} />
      <Carved lines={["Blue · 450 nm"]} size={S.type.label} y={878} x={BX0 + 46} anchor="start" at={1.1} />
      <Carved lines={["Red · 700 nm"]} size={S.type.label} y={1102} x={BX0 + 46} anchor="start" at={1.3} />
    </Print>
  );
};

/** List: three panels parted by gouged gutters, each with a numbered seal. */
const PANEL = (BY1 - BY0) / 3;
const LIST_CUTS: Cut[] = [
  ...[1, 2].flatMap((k) => [-5, 5].map((o, i) => cut([[BX0 - 8, BY0 + PANEL * k + o], [BX1 + 8, BY0 + PANEL * k + o + 2]], E.ugouge[0] * 1.2, 0.05 + k * 0.12 + i * 0.06))),
  ...SAMPLE.list.flatMap((_, i) =>
    burst({ cx: 880, cy: BY0 + PANEL * (i + 0.5), n: E.rays.count - 6, r0: 86, r1: [116, 150], w: E.vgouge[1] * 1.1, at: 0.4 + i * 0.4, seed: 41 + i, plate: i > 0 }),
  ),
];
const List: React.FC = () => {
  const rows = SAMPLE.list.map((item) => wrap(item, 16));
  const size = fit(rows.flat(), 610, 76, EM);
  return (
    <Print seed={15} margin={<Press text={SAMPLE.chapter} at={1.8} />}>
      <Cuts cuts={LIST_CUTS} />
      {rows.map((lines, i) => {
        const mid = BY0 + PANEL * (i + 0.5);
        return (
          <React.Fragment key={i}>
            <Carved lines={lines} size={size} x={BX0 + 50} anchor="start" y={mid - ((lines.length - 1) * size * S.type.leading) / 2 + size * 0.3} at={0.3 + i * 0.25} />
            <Carved lines={[String(i + 1)]} size={110} x={880} y={mid + 34} at={0.4 + i * 0.25} />
          </React.Fragment>
        );
      })}
    </Print>
  );
};

/** End: the sky at its peak, the whole of it printed in the plate; one figure looks up. */
const END_HILL = 1010;
const END_SUN: [number, number] = [650, 400];
const END_CUTS: Cut[] = [...disc(END_SUN[0], END_SUN[1], 84, 0.05, 51), ...sky({ cx: END_SUN[0], cy: END_SUN[1], r0: 122, r1: 1040, at: 0.1, seed: 52, plate: true })];
const END_HILL_CUTS = hillHatch(END_HILL, 2.6, END_SUN[0], 0.9);
const FX = 330;
const FY = hillY(FX, END_HILL, 2.6) + 10;
/** A standing figure pointing up, feet on the hill: one black shape with a white knife halo. */
const FIGURE = [
  [[-30, 0], [-18, -80], [-26, -132], [-22, -148], [0, -152], [22, -148], [26, -132], [20, -80], [34, 0], [10, 0], [2, -66], [-6, 0]],
  [[16, -148], [74, -204], [84, -194], [26, -126]],
]
  .map((part) => `M${part.map(([x, y]) => `${FX + x} ${FY + y}`).join("L")}Z`)
  .join("");
const Figure: React.FC = () => {
  const halo = { stroke: C.paper, strokeWidth: E.knife[1] * 5, strokeLinejoin: "round" as const };
  return (
    <>
      <path d={FIGURE} {...halo} />
      <circle cx={FX + 6} cy={FY - 176} r={21} {...halo} />
      <path d={FIGURE} fill={C.ink} />
      <circle cx={FX + 6} cy={FY - 176} r={21} fill={C.ink} />
    </>
  );
};
const End: React.FC = () => {
  const size = fit([SAMPLE.end.line], COLUMN, S.type.title * 0.7, EM);
  return (
    <Print seed={16} margin={<Press text={SAMPLE.end.cta} at={1.7} />}>
      <Cuts cuts={END_CUTS} clip={aboveHill(END_HILL, 2.6)} />
      <Cuts cuts={END_HILL_CUTS} />
      <Figure />
      <Carved lines={[SAMPLE.end.line]} size={size} y={1216} at={0.8} />
    </Print>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.6, component: Title },
  { id: "headline", duration: 3.4, hero: 2.9, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.0, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.7, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.9, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];
