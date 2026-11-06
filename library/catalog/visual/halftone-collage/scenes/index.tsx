/** Halftone Collage on the shared sample content: title, headline, diagram, number, list, end card (the endless zoom). */
import React from "react";
import { SAMPLE, words, type Sample } from "../../kit";
import { C, Card, Cloud, Eye, Ground, Label, M, Molecule, Piece, S, shard, Sphere, Strip, Sun, T, W, ZoomLayer, type Prim } from "./parts";

const G = S.motion.groupGap;
const GAP = S.motion.pieceGap;
const deg = (r: number) => (r * 180) / Math.PI;
const rect = (w: number, h: number): Prim[] => [{ type: "path", d: `M 0 0 H ${w} V ${h} H 0 Z` }];
/** A cardstock beam: a long strip, slightly wider at its far end. */
const beam = (len: number, w0: number, w1: number): Prim[] => [{ type: "path", d: `M 0 ${(w1 - w0) / 2} L ${len} 0 L ${len} ${w1} L 0 ${(w1 + w0) / 2} Z` }];
const plain = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");

/** Red field: a cloud, the sun, two shards of blue; then the question as two printed strips. */
const Title: React.FC = () => (
  <Ground field={C.red}>
    <Piece x={330} y={1380} at={0} from="left" rot={-2}>
      <Cloud w={640} seed={2} />
    </Piece>
    <Piece x={780} y={560} at={G} from="top" rot={0}>
      <Sun r={170} />
    </Piece>
    <Piece x={830} y={1320} at={2 * G} from="right" rot={-28}>
      <Card w={190} h={54} shape={shard(190, 54)} fill={C.cyan} />
    </Piece>
    <Piece x={700} y={1470} at={2 * G + GAP} from="right" rot={14}>
      <Card w={150} h={46} shape={shard(150, 46)} fill={C.cyan} />
    </Piece>
    <Piece x={W / 2} y={900} at={3 * G} from="right" rot={-2}>
      <Strip text={plain(SAMPLE.title)} seed={3} />
    </Piece>
    <Piece x={520} y={1065} at={3 * G + 2 * GAP} from="left" rot={3}>
      <Strip text={em(SAMPLE.title)} size={T.hero} paper={C.cyan} seed={5} />
    </Piece>
  </Ground>
);

/** Mustard field: three strips; a halftone sun throws a cream beam that fans into cardstock colours. */
const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const [l1, l2] = [all.slice(0, 2).map((w) => w.text).join(" "), all.slice(2, 4).map((w) => w.text).join(" ")];
  const l3 = all.filter((w) => w.em).map((w) => w.text).join(" ");
  const fan = [C.cardRed, C.cardOrange, C.cream, C.cyan, C.cardPurple];
  const [fx, fy] = [470, 1220];
  return (
    <Ground field={C.mustard}>
      <Piece x={70} y={fy} at={0} from="left">
        <Sphere r={170} />
      </Piece>
      <Piece x={(240 + fx) / 2 + 10} y={fy} at={G} from="left">
        <Card w={fx - 230} h={64} shape={beam(fx - 230, 64, 64)} fill={C.cream} />
      </Piece>
      {fan.map((c, i) => {
        const a = ((i - 2) * 12 * Math.PI) / 180;
        const len = 470;
        return (
          <Piece key={i} x={fx + Math.cos(a) * (len / 2 + 10)} y={fy + Math.sin(a) * (len / 2 + 10)} at={2 * G + i * GAP} from="right" rot={deg(a)}>
            <Card w={len} h={56} shape={beam(len, 26, 56)} fill={c} />
          </Piece>
        );
      })}
      <Piece x={W / 2} y={520} at={3 * G} from="left" rot={-2}>
        <Strip text={l1} seed={11} />
      </Piece>
      <Piece x={W / 2 + 20} y={650} at={3 * G + GAP} from="right" rot={1.5}>
        <Strip text={l2} seed={12} />
      </Piece>
      <Piece x={W / 2 - 30} y={800} at={3 * G + 2 * GAP} from="left" rot={-3}>
        <Strip text={l3} size={120} paper={C.cyan} seed={13} />
      </Piece>
    </Ground>
  );
};

/** Purple field: a nitrogen molecule, a cream beam of sunlight, shards of blue in every direction, red carrying on. */
const Diagram: React.FC = () => {
  const [cx, cy] = [560, 930];
  const src: [number, number] = [90, 470];
  const inA = Math.atan2(cy - src[1], cx - src[0]);
  const blen = Math.hypot(cx - src[0], cy - src[1]) - 190;
  const shards = [-90, -40, 0, 95, 140].map((d) => (d * Math.PI) / 180);
  const r0 = 190;
  const len = 190;
  return (
    <Ground field={C.purple}>
      <Piece x={src[0] + Math.cos(inA) * (blen / 2)} y={src[1] + Math.sin(inA) * (blen / 2)} at={0} from="left" rot={deg(inA)}>
        <Card w={blen} h={70} shape={beam(blen, 70, 50)} fill={C.cream} />
      </Piece>
      <Piece x={cx} y={cy} at={G} from="bottom" rot={-12}>
        <Molecule r={100} />
      </Piece>
      {shards.map((a, i) => (
        <Piece key={i} x={cx + Math.cos(a) * (r0 + len / 2)} y={cy + Math.sin(a) * (r0 + len / 2)} at={2 * G + i * GAP} from={i < 2 ? "top" : i < 3 ? "right" : "bottom"} rot={deg(a)}>
          <Card w={len} h={64} shape={shard(len, 64)} fill={C.cyan} />
        </Piece>
      ))}
      <Piece x={cx + Math.cos(inA) * (175 + 180)} y={cy + Math.sin(inA) * (175 + 180)} at={2 * G + 5 * GAP} from="right" rot={deg(inA)}>
        <Card w={360} h={44} shape={beam(360, 44, 36)} fill={C.cardRed} />
      </Piece>
      <Piece x={250} y={420} at={3 * G} from="left" rot={-3}>
        <Label text={SAMPLE.diagram.in} seed={21} />
      </Piece>
      <Piece x={210} y={940} at={3 * G + GAP} from="left" rot={2}>
        <Label text={SAMPLE.diagram.object} seed={22} />
      </Piece>
      <Piece x={W / 2} y={1450} at={3 * G + 2 * GAP} from="bottom" rot={-2}>
        <Strip text={SAMPLE.diagram.label} size={64} seed={23} />
      </Piece>
    </Ground>
  );
};

/** Teal field: the number on a newsprint card; two cardstock strips as bars, cut to the true ratio. */
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const full = 780;
  const x0 = M + 20;
  return (
    <Ground field={C.teal}>
      <Piece x={W / 2} y={600} at={0} from="top" rot={-3}>
        <Strip text={`${n.value.toFixed(n.decimals)}${n.unit}`} size={T.number} weight={900} seed={31} />
      </Piece>
      <Piece x={W / 2} y={870} at={G} from="right" rot={1}>
        <Label text="More scattering for blue (450 nm)" seed={32} />
      </Piece>
      <Piece x={W / 2 + 40} y={940} at={G + GAP} from="left" rot={-1.5}>
        <Label text="than red (700 nm)" seed={33} />
      </Piece>
      <Piece x={x0 + 150} y={1120} at={2 * G} from="left" rot={-2}>
        <Label text="Blue · 450 nm" seed={34} />
      </Piece>
      <Piece x={x0 + full / 2} y={1210} at={2 * G + GAP} from="left" rot={0.5}>
        <Card w={full} h={78} shape={rect(full, 78)} fill={C.cyan} />
      </Piece>
      <Piece x={x0 + 150} y={1340} at={3 * G} from="left" rot={1.5}>
        <Label text="Red · 700 nm" seed={35} />
      </Piece>
      <Piece x={x0 + full / n.value / 2} y={1430} at={3 * G + GAP} from="left" rot={-1}>
        <Card w={full / n.value} h={78} shape={rect(full / n.value, 78)} fill={C.cardRed} />
      </Piece>
    </Ground>
  );
};

/** Green field: three small collages, each with its printed line. */
const List: React.FC = () => {
  const rows = [560, 950, 1340];
  const lines = SAMPLE.list.map((s) => {
    const ws = s.split(" ");
    const k = ws.length > 3 ? (ws.length > 4 ? 3 : 2) : 2;
    return [ws.slice(0, k).join(" "), ws.slice(k).join(" ")];
  });
  const objs = [
    <Sun key="s" r={115} />,
    <Molecule key="m" r={66} />,
    <Eye key="e" w={300} />,
  ];
  return (
    <Ground field={C.green}>
      {rows.map((y, i) => (
        <React.Fragment key={i}>
          <Piece x={250} y={y} at={i * G * 1.6} from="left" rot={i === 1 ? -10 : -3}>
            {objs[i]}
          </Piece>
          {i === 1
            ? [-60, 0, 60].map((d, j) => {
                const a = (d * Math.PI) / 180 + Math.PI;
                return (
                  <Piece key={j} x={250 + Math.cos(a) * 190} y={y + Math.sin(a) * 190} at={i * G * 1.6 + G * 0.5 + j * GAP} from="left" rot={deg(a)}>
                    <Card w={110} h={40} shape={shard(110, 40)} fill={C.cyan} />
                  </Piece>
                );
              })
            : null}
          <Piece x={700} y={y - 40} at={i * G * 1.6 + G} from="right" rot={-2}>
            <Strip text={lines[i][0]} size={46} seed={40 + i} />
          </Piece>
          <Piece x={710} y={y + 34} at={i * G * 1.6 + G + GAP} from="right" rot={1.5}>
            <Strip text={lines[i][1]} size={46} seed={50 + i} />
          </Piece>
        </React.Fragment>
      ))}
    </Ground>
  );
};

/** Orange field, the endless zoom: cloud layers at three depths grow at camera^Z; the last line holds still on top. */
const End: React.FC = () => {
  const [ox, oy] = [W / 2, 860];
  const ring = (n: number, rx: number, ry: number, phase: number) => Array.from({ length: n }, (_, i) => [ox + Math.cos(phase + (i / n) * Math.PI * 2) * rx, oy + Math.sin(phase + (i / n) * Math.PI * 2) * ry]);
  const [zFar, zMid, zNear] = S.motion.parallax;
  return (
    <Ground field={C.orange}>
      <ZoomLayer z={zFar} origin={[ox, oy]}>
        <div style={{ position: "absolute", left: ox, top: oy - 40, transform: "translate(-50%, -50%)" }}>
          <Sun r={70} />
        </div>
        {ring(4, 230, 320, 0.4).map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <Cloud w={200} seed={60 + i} />
          </div>
        ))}
      </ZoomLayer>
      <ZoomLayer z={zMid} origin={[ox, oy]}>
        {ring(4, 300, 430, 1.2).map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <Cloud w={240} seed={70 + i} />
          </div>
        ))}
      </ZoomLayer>
      <ZoomLayer z={zNear} origin={[ox, oy]}>
        {ring(4, 300, 420, 0.4).map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <Cloud w={260} seed={80 + i} />
          </div>
        ))}
      </ZoomLayer>
      <Piece x={W / 2} y={1040} at={0.6} from="left" rot={-2}>
        <Strip text={plain(SAMPLE.end.line)} size={96} seed={91} />
      </Piece>
      <Piece x={W / 2 + 30} y={1180} at={0.6 + 2 * GAP} from="right" rot={3}>
        <Strip text={em(SAMPLE.end.line)} size={130} paper={C.cyan} seed={92} />
      </Piece>
      <Piece x={W / 2} y={1345} at={0.6 + G + 2 * GAP} from="bottom" rot={-1}>
        <Label text={SAMPLE.end.cta} seed={93} />
      </Piece>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.5, hero: 2.6, component: Title },
  { id: "headline", duration: 3.5, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.5, hero: 2.7, component: Diagram },
  { id: "number", duration: 3.5, hero: 2.6, component: NumberSample },
  { id: "list", duration: 4, hero: 3.2, component: List },
  { id: "end", duration: 4, hero: 2.0, component: End },
];
