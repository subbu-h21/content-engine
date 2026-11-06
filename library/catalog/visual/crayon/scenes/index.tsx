/** Crayon on the shared sample content: title (the one wash), headline, diagram, number, list, end. */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { arc, Arrow, C, Child, cloudPts, ellipse, Fill, Line, M, Molecule, Page, S, smoothPts, Sun, T, W, Wash, Wax, Words, type Pt } from "./parts";

const TOP = S.layout.safe.top;
const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");
const RAINBOW = [C.red, C.orange, C.green, C.sky, C.violet, C.pink];

/** A hill: its top line (left to right) and the polygon under it. */
const hill = (pts: Pt[]): { top: Pt[]; poly: Pt[] } => {
  const top = smoothPts(pts, 8);
  return { top, poly: [...top, [top[top.length - 1][0], 2000], [top[0][0], 2000]] };
};

/** Paper kept white under a character so the wash never paints it. */
const ChildKnockout: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g fill={C.paper} stroke={C.paper} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={x} cy={y - 272} r={84} />
    <path d={`M ${x - 36} ${y - 214} L ${x + 36} ${y - 214} L ${x + 84} ${y - 76} L ${x - 84} ${y - 76} Z`} strokeWidth={16} />
    <path d={`M ${x + 26} ${y - 196} L ${x + 70} ${y - 250} L ${x + 100} ${y - 322}`} fill="none" strokeWidth={46} />
    <path d={`M ${x - 26} ${y - 192} L ${x - 62} ${y - 142} L ${x - 78} ${y - 104}`} fill="none" strokeWidth={46} />
    <path d={`M ${x - 26} ${y - 84} L ${x - 30} ${y - 6} M ${x + 26} ${y - 84} L ${x + 30} ${y - 6}`} fill="none" strokeWidth={44} />
  </g>
);

/** The page fills in; the question is lettered; "blue?" is written in white wax; the one wash reveals it and two clouds. */
const Title: React.FC = () => {
  const h = hill([
    [-40, 1262],
    [220, 1214],
    [500, 1196],
    [780, 1218],
    [1120, 1268],
  ]);
  const kid: Pt = [770, 1226];
  return (
    <Page>
      <Wash top={-40} bottom={1300} at={1.85} ground={h.top} />
      <ChildKnockout x={kid[0]} y={kid[1]} />
      <Wax>
        <Fill poly={h.poly} col={C.green} at={0.3} dur={1.0} seed={11} cross pressure={1} />
        <Line pts={h.top} at={0} seed={12} width={S.elements.outline.building} boil="bg" />
        <Sun x={890} y={640} r={84} at={0.2} rays={9} />
        <Words text={SAMPLE.kicker} x={M} y={TOP + 70} size={T.kicker} font="hand" col={C.ink} at={0.1} seed={2} />
        <Words text={plainOf(SAMPLE.title)} x={M} y={TOP + 220} size={T.title} at={0.3} seed={3} />
        <Child x={kid[0]} y={kid[1]} at={0.55} />
        <Words text={emOf(SAMPLE.title)} x={M - 6} y={TOP + 470} size={T.hero} col={C.wax} at={1.15} seed={4} pressure={1} />
        <Line pts={cloudPts(300, 980, 330)} col={C.wax} at={1.35} seed={13} width={12} pressure={1} />
        <Fill poly={cloudPts(300, 980, 330)} col={C.wax} at={1.45} dur={0.5} seed={14} pressure={1} gap={20} width={12} angle={-20} />
        <Line pts={cloudPts(560, 1110, 200)} col={C.wax} at={1.5} seed={15} width={11} pressure={1} />
      </Wax>
    </Page>
  );
};

/** A sun with a face throws a fan of crayon colours; "every colour" is lettered in every crayon. */
const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const l1 = all.slice(0, 2).map((w) => w.text).join(" ");
  const l2 = all.slice(2, 4).map((w) => w.text).join(" ");
  const l3 = all.filter((w) => w.em).map((w) => w.text).join(" ");
  const size = 116;
  const [sx, sy, sr] = [250, 1000, 118];
  const fan = [C.red, C.orange, C.yellow, C.green, C.sky, C.violet];
  const bodyLines = wrap(SAMPLE.body, 34);
  let ci = 0;
  return (
    <Page>
      <Wax>
        {fan.map((c, i) => {
          const a = ((-24 + i * 12) * Math.PI) / 180;
          const [ux, uy] = [Math.cos(a), Math.sin(a)];
          const [nx, ny] = [-uy, ux];
          const r0 = sr + 26;
          const len = 600;
          const w0 = 20;
          const w1 = 64;
          const poly: Pt[] = [
            [sx + ux * r0 + nx * w0, sy + uy * r0 + ny * w0],
            [sx + ux * (r0 + len) + nx * w1, sy + uy * (r0 + len) + ny * w1],
            [sx + ux * (r0 + len) - nx * w1, sy + uy * (r0 + len) - ny * w1],
            [sx + ux * r0 - nx * w0, sy + uy * r0 - ny * w0],
          ];
          return <Fill key={i} poly={poly} col={c} at={1.3 + i * 0.12} dur={0.7} seed={40 + i} angle={(Math.atan2(uy, ux) * 180) / Math.PI + 78} gap={14} pressure={1} />;
        })}
        <Sun x={sx} y={sy} r={sr} at={0.9} face rays={0} />
        <Words text={l1} x={M} y={TOP + 150} size={size} at={0.1} seed={21} />
        <Words
          text={l2}
          x={M}
          y={TOP + 150 + size * T.leading}
          size={size}
          at={0.1 + l1.length * S.motion.letter}
          seed={22}
          col={(i) => (l2[i] === " " ? C.ink : RAINBOW[ci++ % RAINBOW.length])}
        />
        <Words text={l3} x={M} y={TOP + 150 + 2 * size * T.leading} size={size} at={0.1 + (l1.length + l2.length) * S.motion.letter} seed={23} />
        <Line
          pts={[
            [M + 4, TOP + 182 + 2 * size * T.leading],
            [M + 200, TOP + 172 + 2 * size * T.leading],
            [M + 410, TOP + 180 + 2 * size * T.leading],
          ]}
          col={C.orange}
          at={1.4}
          seed={24}
          width={10}
          smooth
        />
      </Wax>
      <Wax>
        {bodyLines.map((l, i) => (
          <Words key={i} text={l} x={M} y={1484 + i * T.body * 1.15} size={T.body} font="hand" at={2.2 + i * 0.35} per={0.35 / l.length} seed={26 + i} />
        ))}
      </Wax>
    </Page>
  );
};

/** Sunlight hits a molecule with a face: short wiggly blue waves fly everywhere, a long lazy red wave carries on. */
const Diagram: React.FC = () => {
  const [cx, cy, r] = [560, 980, 92];
  const src: Pt = [130, 410];
  const inA = Math.atan2(cy - src[1], cx - src[0]);
  const hitAt = 1.25;
  const blue = [-84, -36, 12, 100, 146, 192];
  const redEnd: Pt = [cx + Math.cos(inA) * 560, cy + Math.sin(inA) * 560];
  return (
    <Page>
      <Wax>
        <Words text={SAMPLE.diagram.in} x={M} y={TOP + 90} size={T.label + 8} font="hand" at={0.1} seed={2} />
        <Line pts={[src, [cx - Math.cos(inA) * (r + 64), cy - Math.sin(inA) * (r + 64)]]} col={C.yellow} at={0.25} seed={3} width={22} boil="bg" dur={0.6} />
        <Arrow from={[src[0] + 10, src[1] + 18]} to={[cx - Math.cos(inA) * (r + 60), cy - Math.sin(inA) * (r + 60)]} col={C.orange} at={0.35} seed={4} width={8} dur={0.55} />
        <Molecule x={cx} y={cy} r={r} at={0.6} />
        {blue.map((d, i) => {
          const a = (d * Math.PI) / 180;
          const from: Pt = [cx + Math.cos(a) * (r + 74), cy + Math.sin(a) * (r + 74)];
          const to: Pt = [cx + Math.cos(a) * (r + 250), cy + Math.sin(a) * (r + 250)];
          return <Arrow key={i} from={from} to={to} col={C.sky} at={hitAt + i * 0.08} seed={60 + i * 3} amp={10} wl={30} width={10} />;
        })}
        <Arrow from={[cx + Math.cos(inA) * (r + 80), cy + Math.sin(inA) * (r + 80)]} to={redEnd} col={C.red} at={hitAt + 0.5} seed={80} amp={13} wl={120} width={10} dur={0.6} />
        <Words text={SAMPLE.diagram.object} x={M} y={1290} size={T.label} font="hand" at={1.0} seed={5} />
        <Words text="red" x={redEnd[0] - 30} y={redEnd[1] + 70} size={T.label} font="hand" col={C.red} at={2.2} seed={6} />
      </Wax>
      <Wax>
        <Words
          text={SAMPLE.diagram.label}
          x={M}
          y={1550}
          size={80}
          at={2.3}
          seed={8}
          col={(i) => (i >= 9 && i < 13 ? C.sky : C.ink)}
        />
      </Wax>
    </Page>
  );
};

/** 5.9× lettered big; two crayon bars coloured to the true ratio. */
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const x0 = M;
  const full = 820;
  const bar = (y: number, len: number, col: string, at: number, seed: number) => {
    const poly: Pt[] = [
      [x0, y],
      [x0 + len, y],
      [x0 + len, y + 104],
      [x0, y + 104],
    ];
    return (
      <>
        <Fill poly={poly} col={col} at={at + 0.35} dur={Math.max(0.35, (0.8 * len) / full)} seed={seed} angle={-62} gap={15} pressure={1} />
        <Line pts={[...poly, [x0 + 6, y - 2]]} at={at} seed={seed + 1} width={S.elements.outline.building} boil="bg" dur={0.5} />
      </>
    );
  };
  return (
    <Page>
      <Wax>
        <Words text={`${n.value.toFixed(n.decimals)}`} x={x0 - 8} y={TOP + 400} size={T.number} at={0.1} per={0.1} seed={2} />
        <Words text={n.unit} x={x0 + 360} y={TOP + 400} size={T.number * 0.8} col={C.orange} at={0.45} seed={3} />
        <Words text="more scattering for blue (450 nm)" x={x0} y={TOP + 520} size={T.body - 4} font="hand" at={0.7} per={0.012} seed={4} />
        <Words text="than red (700 nm)" x={x0} y={TOP + 520 + T.body * 1.1} size={T.body - 4} font="hand" at={1.0} per={0.012} seed={5} />
        <Words text="blue · 450 nm" x={x0} y={1000} size={T.label} font="hand" col={C.ink} at={1.2} per={0.02} seed={6} />
        {bar(1030, full, C.sky, 1.3, 30)}
        <Words text="red · 700 nm" x={x0} y={1270} size={T.label} font="hand" col={C.ink} at={1.9} per={0.02} seed={7} />
        {bar(1300, full / n.value, C.red, 2.0, 40)}
      </Wax>
    </Page>
  );
};

/** Three little drawings, each with its line lettered beside it. */
const List: React.FC = () => {
  const rows = [560, 960, 1360];
  const tx = 380;
  const size = 74;
  const lines = SAMPLE.list.map((s) => wrap(s, 15));
  return (
    <Page>
      <Wax>
        <Sun x={210} y={rows[0]} r={66} at={0.1} rays={8} seed={500} />
        <Molecule x={200} y={rows[1]} r={52} at={0.9} seed={520} />
        {[-60, 20, 100, 200].map((d, i) => {
          const a = (d * Math.PI) / 180;
          return <Arrow key={i} from={[200 + Math.cos(a) * 112, rows[1] + Math.sin(a) * 92]} to={[200 + Math.cos(a) * 168, rows[1] + Math.sin(a) * 140]} col={C.sky} at={1.5 + i * 0.06} seed={540 + i * 3} amp={6} wl={22} width={8} dur={0.3} />;
        })}
        <Line pts={[...arc(210, rows[2] + 20, 120, 120, 180, 360, 30)]} at={1.6} seed={560} width={S.elements.outline.building} boil="bg" />
        <Fill poly={[...arc(210, rows[2] + 20, 116, 116, 180, 360, 30)]} col={C.sky} at={1.8} seed={561} angle={-30} pressure={1} />
        <Line pts={[[70, rows[2] + 22], [350, rows[2] + 22]]} at={1.7} seed={562} boil="bg" />
        <Fill poly={ellipse(210, rows[2] + 6, 22)} col={C.peach} at={2.2} seed={563} gap={10} width={9} pressure={1} />
        <Line pts={arc(210, rows[2] + 6, 24, 24, 200, 560, 20)} at={2.1} seed={564} width={6} />
        {lines.map((ls, i) =>
          ls.map((l, j) => (
            <Words key={`${i}-${j}`} text={l} x={tx} y={rows[i] - 10 + (j - (ls.length - 1) / 2) * size * 1.02 + 22} size={size} at={0.3 + i * 0.75 + j * 0.25} per={0.04} seed={600 + i * 10 + j} />
          )),
        )}
      </Wax>
    </Page>
  );
};

/** A crayon sky over a hill; the child points up; "again." in sky blue. */
const End: React.FC = () => {
  const skyEdge = smoothPts(
    [
      [-40, 820],
      [260, 860],
      [560, 830],
      [820, 870],
      [1120, 840],
    ],
    8,
  );
  const sky: Pt[] = [[-40, -40], [1120, -40], ...skyEdge.slice().reverse()];
  const h = hill([
    [-40, 1660],
    [300, 1610],
    [700, 1630],
    [1120, 1690],
  ]);
  const size = 150;
  return (
    <Page>
      <Wax>
        <Fill poly={sky} col={C.sky} at={0} dur={1.1} seed={700} cross pressure={1} gap={18} />
        <Fill poly={h.poly} col={C.green} at={0.2} dur={0.8} seed={701} pressure={1} />
        <Line pts={h.top} at={0.1} seed={702} width={S.elements.outline.building} boil="bg" />
        <Child x={210} y={1640} at={0.4} seed={720} />
        <Words text={plainOf(SAMPLE.end.line)} x={W / 2} y={1100} size={size} anchor="middle" at={0.5} seed={703} />
        <Words text={emOf(SAMPLE.end.line)} x={W / 2 + 60} y={1100 + size * 0.95} size={size} anchor="middle" col={C.sky} at={0.9} seed={704} pressure={1} />
        <Words text={SAMPLE.end.cta} x={W / 2 + 60} y={1100 + size * 0.95 + 110} size={T.label + 4} font="hand" anchor="middle" col={C.muted} at={1.5} per={0.025} seed={705} />
        <Line
          pts={[
            [W / 2 - 110, 1100 + size * 0.95 + 132],
            [W / 2 + 60, 1100 + size * 0.95 + 124],
            [W / 2 + 230, 1100 + size * 0.95 + 130],
          ]}
          col={C.orange}
          at={1.9}
          seed={706}
          width={9}
          smooth
        />
      </Wax>
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4.2, hero: 3.6, component: Title },
  { id: "headline", duration: 3.8, hero: 3.3, component: HeadlineSample },
  { id: "diagram", duration: 4.0, hero: 3.5, component: Diagram },
  { id: "number", duration: 3.6, hero: 3.1, component: NumberSample },
  { id: "list", duration: 4.0, hero: 3.5, component: List },
  { id: "end", duration: 3.4, hero: 2.9, component: End },
];
