/** Ukiyo-e Print on the shared sample content: each sample is one tall pillar print (hashira-e). */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { B, Block, Bokashi, C, Cartouche, ellipse, Flat, H, Key, Mist, mountain, padPts, pathOf, rectPts, S, Seal, Sheet, Slip, T, through, Traveller, W, type Pt } from "./parts";

const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");
const X0 = B.x;
const X1 = W - B.x;
const IW = X1 - X0;
const M = S.layout.margin;

/** Field layers: high flat parallel bands with slanted parallel cross lines (never a perspective grid). */
const Fields: React.FC<{ y0: number; at: number }> = ({ y0, at }) => {
  const bands: [number, number, string][] = [
    [y0, 70, C.green],
    [y0 + 70, 60, C.straw],
    [y0 + 130, 80, C.greenDark],
    [y0 + 210, 90, C.green],
  ];
  return (
    <>
      <Block group="g2" at={at}>
        {bands.map(([y, h, c], i) => (
          <Flat key={i} pts={rectPts(X0, y, IW, h)} fill={c} />
        ))}
      </Block>
      {bands.map(([y], i) => (
        <Key key={i} pts={[[X0, y], [X1, y]]} width={1.6} seed={40 + i} opacity={0.7} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <Key key={`s${i}`} pts={[[X0 + 20 + i * 64, y0 + 70], [X0 + 50 + i * 64, y0 + 130]]} width={1.3} seed={60 + i} opacity={0.55} />
      ))}
    </>
  );
};

// ------------------------------------------------------------------ title

const Title: React.FC = () => {
  const mt = mountain(330, 760, 1250, 330, 700, 3);
  const trunk = through([[X1 + 10, 1560], [940, 1420], [870, 1250], [880, 1140], [800, 1040]], 10);
  const trunkPoly = (() => {
    const L: Pt[] = trunk.map(([x, y], i) => [x - 22 + i * 0.3, y] as Pt);
    const Rr: Pt[] = trunk.map(([x, y], i) => [x + 18 - i * 0.3, y] as Pt);
    return [...L, ...Rr.reverse()];
  })();
  const pads: [number, number, number][] = [
    [790, 1020, 200],
    [910, 1150, 240],
    [700, 1180, 170],
    [960, 1340, 160],
  ];
  return (
    <Sheet>
      <Block group="g1" at={0}>
        <Bokashi x={X0} y={B.y} w={IW} h={1100} stops={[[0, C.prussianDark], [0.3, C.prussian], [0.68, C.paleBlue], [1, C.washi]]} />
      </Block>
      <Block group="g1" at={0.35}>
        <Bokashi x={X0} y={700} w={IW} h={560} stops={[[0, C.prussian], [0.55, C.prussianLight], [1, C.paleBlue2]]} clip={mt.body} />
        <Flat pts={mt.snow} fill={C.washi} />
      </Block>
      <Key pts={mt.body} width={2.2} seed={7} opacity={0.55} />
      <Mist x={X0 - 40} y={1110} w={760} h={64} />
      <Mist x={X0 + 260} y={1205} w={780} h={56} />
      <Fields y0={1300} at={0.6} />
      <Block group="g3" at={0.8}>
        <Flat pts={[[X0, 1640], [X1, 1560], [X1, 1630], [X0, 1720]]} fill={C.ochre} />
      </Block>
      <Key pts={[[X0, 1640], [X1, 1560]]} width={2} seed={9} />
      <Key pts={[[X0, 1720], [X1, 1630]]} width={2} seed={10} />
      <Traveller x={330} y={1650} h={150} at={1.1} />
      <Block group="g2" at={1.0}>
        <Flat pts={trunkPoly} fill={C.gaiters} />
        {pads.map(([x, y, w], i) => (
          <Flat key={i} pts={padPts(x, y, w, 46)} fill={C.pine} />
        ))}
      </Block>
      <Key pts={trunkPoly} width={2.4} seed={11} close />
      {pads.map(([x, y, w], i) => (
        <Key key={i} pts={padPts(x, y, w, 46)} width={2} seed={20 + i} close />
      ))}
      <Cartouche x={694} y={210} w={290} lines={["Why is", "the sky", `${emOf(SAMPLE.title)}`]} tab={SAMPLE.kicker} at={1.6} size={68} />
    </Sheet>
  );
};

// ------------------------------------------------------------------ headline: dawn over the sea

const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const l1 = all.slice(0, 2).map((w) => w.text).join(" ");
  const l2 = all.slice(2).map((w) => w.text).join(" ");
  const sun: Pt = [680, 1150];
  const sea = 1160;
  return (
    <Sheet>
      <Block group="g1" at={0}>
        <Bokashi x={X0} y={B.y} w={IW} h={sea - B.y} stops={[[0, C.prussianDark], [0.38, C.prussianLight], [0.72, C.peach], [1, C.beniPale]]} />
      </Block>
      <Block group="g3" at={0.3}>
        <Flat pts={ellipse(sun[0], sun[1], 128)} fill={C.beni} />
      </Block>
      <Mist x={X0 + 300} y={880} w={700} h={52} fill={C.peach} />
      <Block group="g1" at={0.6}>
        <Flat pts={rectPts(X0, sea, IW, H - sea)} fill={C.prussianLight} />
        <Bokashi x={X0} y={sea + 120} w={IW} h={H - sea - 120} stops={[[0, C.prussianLight], [0.4, C.prussian], [1, C.trough]]} />
      </Block>
      <Block group="g3" at={0.9}>
        {Array.from({ length: 6 }, (_, i) => (
          <Flat key={i} pts={rectPts(sun[0] - 90 + i * 9 + (i % 2) * 14, sea + 26 + i * 34, 180 - i * 22, 9)} fill={C.beni} />
        ))}
      </Block>
      {Array.from({ length: 9 }, (_, i) => {
        const y = sea + 70 + i * 74;
        const pts = through(Array.from({ length: 8 }, (_, k) => [X0 + k * (IW / 7), y + (k % 2 ? -10 : 8)] as Pt), 6);
        return <Key key={i} pts={pts} width={1.8} seed={30 + i} opacity={0.6} />;
      })}
      <Key pts={[[X0, sea], [X1, sea]]} width={2.4} seed={5} />
      <Cartouche x={M} y={230} w={IW - 2 * (M - X0)} lines={[l1, l2]} tab={SAMPLE.chapter} at={1.3} size={58} seal={false} />
      <Seal x={X1 - 100} y={500} at={1.8} />
      <Slip lines={wrap(SAMPLE.body, 34)} x={M} y={1430} at={2.0} size={T.label} />
    </Sheet>
  );
};

// ------------------------------------------------------------------ diagram: light as fine lines, scattering as short blue lines

const Diagram: React.FC = () => {
  const c: Pt = [575, 860];
  const inA = Math.atan2(c[1] - 300, c[0] - 120);
  const [ux, uy] = [Math.cos(inA), Math.sin(inA)];
  const [nx, ny] = [-uy, ux];
  const r = 84;
  const scatter = [-90, -45, 0, 90, 135, 180, 220].flatMap((d) => [d - 6, d + 6]);
  return (
    <Sheet>
      <Block group="g1" at={0}>
        <Bokashi x={X0} y={B.y} w={IW} h={720} stops={[[0, C.prussian], [0.5, C.paleBlue], [1, C.washi]]} />
      </Block>
      <Block group="g3" at={0.3}>
        {Array.from({ length: 6 }, (_, i) => {
          const o = (i - 2.5) * 18;
          return <path key={i} d={pathOf([[120 + nx * o, 300 + ny * o], [c[0] - ux * (r * 1.7) + nx * o, c[1] - uy * (r * 1.7) + ny * o]], false)} stroke={C.ochre} strokeWidth={6} fill="none" />;
        })}
      </Block>
      <Block group="g3" at={0.6}>
        <Flat pts={ellipse(c[0] - r * 0.7, c[1] + 8, r)} fill={C.peach} />
        <Flat pts={ellipse(c[0] + r * 0.7, c[1] - 8, r)} fill={C.beniPale} />
      </Block>
      <Key pts={ellipse(c[0] - r * 0.7, c[1] + 8, r)} close width={2.6} seed={80} />
      <Key pts={ellipse(c[0] + r * 0.7, c[1] - 8, r)} close width={2.6} seed={81} />
      <Block group="g1" at={1.0}>
        {scatter.map((d, i) => {
          const a = (d * Math.PI) / 180;
          const r0 = r * 1.9 + (i % 2) * 20;
          const r1 = r0 + 110;
          const [ax, ay] = [c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0];
          const [bx, by] = [c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1];
          const [px, py] = [-Math.sin(a) * 4, Math.cos(a) * 4];
          return <Flat key={i} pts={[[ax + px, ay + py], [bx + px * 0.4, by + py * 0.4], [bx - px * 0.4, by - py * 0.4], [ax - px, ay - py]]} fill={C.prussian} />;
        })}
      </Block>
      <Block group="g3" at={1.4}>
        {[-10, 0, 10].map((o, i) => (
          <Flat key={i} pts={[[c[0] + ux * r * 1.9 + nx * o, c[1] + uy * r * 1.9 + ny * o], [c[0] + ux * 560 + nx * o, c[1] + uy * 560 + ny * o], [c[0] + ux * 560 + nx * (o + 5), c[1] + uy * 560 + ny * (o + 5)], [c[0] + ux * r * 1.9 + nx * (o + 5), c[1] + uy * r * 1.9 + ny * (o + 5)]]} fill={C.beni} />
        ))}
      </Block>
      <Slip lines={[SAMPLE.diagram.in]} x={M} y={236} at={0.2} size={T.label} />
      <Slip lines={[SAMPLE.diagram.object]} x={M} y={1090} at={0.9} size={T.label} />
      <Slip lines={["red goes on"]} x={640} y={1370} at={1.7} size={T.label} />
      <Slip lines={[SAMPLE.diagram.label]} x={M} y={1490} at={2.0} size={T.body + 6} />
    </Sheet>
  );
};

// ------------------------------------------------------------------ number

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const full = 820;
  return (
    <Sheet>
      <Block group="g1" at={0}>
        <Bokashi x={X0} y={B.y} w={IW} h={760} stops={[[0, C.prussianDark], [0.45, C.prussianLight], [1, C.washi]]} />
      </Block>
      <Cartouche x={150} y={260} w={780} lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} tab={SAMPLE.kicker} at={0.4} size={T.number} />
      <Slip lines={["blue · 450 nm"]} x={M} y={960} at={1.0} size={T.label} />
      <Block group="g1" at={1.1}>
        <Flat pts={rectPts(M, 1050, full, 96)} fill={C.prussian} />
      </Block>
      <Key pts={rectPts(M, 1050, full, 96)} close width={2.6} seed={3} />
      <Slip lines={["red · 700 nm"]} x={M} y={1180} at={1.5} size={T.label} />
      <Block group="g3" at={1.6}>
        <Flat pts={rectPts(M, 1270, full / n.value, 96)} fill={C.beni} />
      </Block>
      <Key pts={rectPts(M, 1270, full / n.value, 96)} close width={2.6} seed={4} />
      <Slip lines={wrap(n.caption, 34)} x={M} y={1430} at={2.0} size={T.label} />
    </Sheet>
  );
};

// ------------------------------------------------------------------ list: three stations, three small prints

const Station: React.FC<{ y: number; at: number; kind: 0 | 1 | 2 }> = ({ y, at, kind }) => {
  const [x, w, h] = [M, 460, 330];
  const cx = x + w / 2;
  return (
    <>
      <Block group="g1" at={at}>
        <Bokashi x={x} y={y} w={w} h={kind === 0 ? h * 0.62 : h} stops={kind === 0 ? [[0, C.prussian], [1, C.peach]] : [[0, C.prussianDark], [0.6, C.prussian], [1, C.paleBlue2]]} clip={rectPts(x, y, w, h)} />
        {kind === 0 ? <Flat pts={rectPts(x, y + h * 0.62, w, h * 0.38)} fill={C.prussianLight} /> : null}
      </Block>
      {kind === 0 ? (
        <Block group="g3" at={at + 0.15}>
          <Flat pts={ellipse(cx + 60, y + h * 0.5, 54)} fill={C.beni} />
        </Block>
      ) : null}
      {kind === 0 ? (
        <Block group="g1" at={at + 0.25}>
          <Flat pts={rectPts(x, y + h * 0.62, w, h * 0.38)} fill={C.prussianLight} />
        </Block>
      ) : null}
      {kind === 1 ? (
        <Block group="g3" at={at + 0.15}>
          <Flat pts={ellipse(cx - 30, y + h / 2, 44)} fill={C.peach} />
          <Flat pts={ellipse(cx + 30, y + h / 2 - 6, 44)} fill={C.beniPale} />
        </Block>
      ) : null}
      {kind === 1
        ? Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <Key key={i} pts={[[cx + Math.cos(a) * 90, y + h / 2 + Math.sin(a) * 80], [cx + Math.cos(a) * 140, y + h / 2 + Math.sin(a) * 125]]} width={4} seed={i} />;
          })
        : null}
      {kind === 2 ? (
        <>
          <Block group="g2" at={at + 0.1}>
            <Flat pts={rectPts(x, y + h - 70, w, 70)} fill={C.green} />
          </Block>
          <Traveller x={cx} y={y + h - 40} h={130} at={at + 0.2} />
        </>
      ) : null}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.sumi} strokeWidth={3} />
      <rect x={x - 7} y={y - 7} width={w + 14} height={h + 14} fill="none" stroke={C.sumi} strokeWidth={1} />
    </>
  );
};

const List: React.FC = () => {
  const rows = [300, 760, 1220];
  return (
    <Sheet>
      {rows.map((y, i) => (
        <React.Fragment key={i}>
          <Station y={y} at={0.1 + i * 0.6} kind={i as 0 | 1 | 2} />
          <Cartouche x={600} y={y + 40} w={380} lines={wrap(SAMPLE.list[i], 14)} tab={`Station ${i + 1}`} at={0.4 + i * 0.6} size={42} seal={false} />
        </React.Fragment>
      ))}
    </Sheet>
  );
};

// ------------------------------------------------------------------ end

const End: React.FC = () => (
  <Sheet>
    <Block group="g1" at={0}>
      <Bokashi x={X0} y={B.y} w={IW} h={1380} stops={[[0, C.prussianDark], [0.35, C.prussian], [0.75, C.paleBlue], [1, C.washi]]} />
    </Block>
    <Mist x={X0 - 40} y={1200} w={700} h={60} />
    <Mist x={X0 + 380} y={1290} w={700} h={52} />
    <Fields y0={1400} at={0.4} />
    <Block group="g3" at={0.6}>
      <Flat pts={[[X0, 1720], [X1, 1690], [X1, 1760], [X0, 1790]]} fill={C.ochre} />
    </Block>
    <Traveller x={540} y={1725} h={170} at={0.8} />
    <Cartouche x={300} y={330} w={480} lines={["Look up", emOf(SAMPLE.end.line)]} tab={SAMPLE.end.cta} at={1.2} size={88} />
  </Sheet>
);

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 3.2, hero: 2.7, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.7, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.8, component: List },
  { id: "end", duration: 2.8, hero: 2.3, component: End },
];

