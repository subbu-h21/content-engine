/** BlockFrame on the shared sample content: one pastel ground per frame, cycled, ending on the black close frame. */
import React from "react";
import { SAMPLE, useSeconds, wrap, words, type Sample } from "../../kit";
import { DISPLAY, LABEL } from "./fonts";
import { arrow, Block, Body, C, Card, Dot, ease, Ground, M, Pill, S, Slab, Star, Sticker, Stripes } from "./parts";

const T = S.type;
const E = S.elements;
const TOP = S.layout.safe.top + 14;
const up = (s: string) => s.toUpperCase();

const Title: React.FC = () => {
  const [a, b] = [wrap(SAMPLE.title, 7).slice(0, 2), wrap(SAMPLE.title, 7).slice(2)];
  const key = words(b[0]).map((w) => w.text).join(" ");
  const y0 = 340;
  const size = T.display;
  return (
    <Ground fill={C.cream} from={C.off} next={C.blue} leave={3.0}>
      <Star cx={884} cy={420} r={96} fill={C.pink} tilt={12} at={1.0} />
      <Pill text={SAMPLE.kicker} x={M} y={TOP} at={0.15} fill={C.white} />
      <Slab lines={a} x={M} y={y0} size={size} at={0.25} />
      <Card x={M - 6} y={y0 + 2 * size * T.leading + 26} w={size * 3.5} h={size * 1.2} at={0.55} tilt={-2.5} fill={C.blue}>
        <div style={{ position: "absolute", left: size * 0.16, top: size * 0.08, fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: `${T.tracking}em`, whiteSpace: "nowrap" }}>{up(key)}</div>
      </Card>
      <Block x={70} y={1120} w={420} h={300} tilt={6} fill={C.pink} at={0.95} />
      <Star cx={760} cy={1250} r={260} tilt={-8} at={0.8} />
      <Stripes x={330} y={1500} w={500} h={190} tilt={-5} fill={C.green} at={1.15} />
      <Block x={-60} y={1540} w={330} h={240} tilt={-9} fill={C.green} at={1.25} />
      <Block x={860} y={1560} w={300} h={220} tilt={8} fill={C.blue} at={1.3} />
    </Ground>
  );
};

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const lines = [...wrap(l1, 8), ...wrap(l2, 8)];
  const [x, y, w, h] = [M, 340, 912, 760];
  return (
    <Ground fill={C.blue} from={C.cream} next={C.pink} leave={3.0}>
      <Pill text={SAMPLE.chapter} x={M} y={TOP} at={0.15} fill={C.pink} tilt={2} />
      <Card x={x} y={y} w={w} h={h} at={0.25} tilt={-1.2}>
        <Slab lines={lines} x={40} y={46} size={T.headingLg} at={0.25} leading={1.06} />
      </Card>
      <Star cx={938} cy={420} r={110} tilt={10} fill={C.green} at={0.95} />
      <Card x={110} y={1140} w={850} h={214} at={1.15} tilt={1.4} fill={C.cream} small>
        <Body text={SAMPLE.body} x={36} y={26} w={770} />
      </Card>
      <Stripes x={-50} y={1450} w={620} h={190} tilt={-5} fill={C.yellow} at={1.35} />
      <Block x={640} y={1470} w={320} h={260} tilt={7} fill={C.pink} at={1.45} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [cw, ch] = [936, 870];
  const [mx, my] = [486, 460];
  const degs = [-20, 25, 70, 115, 160, 205, 290];
  const sh = E.small.shadow;
  return (
    <Ground fill={C.pink} from={C.blue} next={C.green} leave={3.5}>
      <Pill text="How it works" x={M} y={TOP} at={0.15} fill={C.yellow} tilt={-2} />
      <Card x={M} y={340} w={cw} h={ch} at={0.2} tilt={-0.8}>
        <svg width={cw} height={ch} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {t > 1.75 ? <line x1={mx + 60} y1={my - 60} x2={mx + 60 + 212 * ease("press", t - 1.75)} y2={my - 60 - 212 * ease("press", t - 1.75)} stroke={C.black} strokeWidth={10} /> : null}
          {t > 0.75 ? (
            <polygon points={arrow(190, 190, 190 + (mx - 96 - 190) * ease("press", t - 0.75), 190 + (my - 96 - 190) * ease("press", t - 0.75), 15, 44)} fill={C.black} />
          ) : null}
          {degs.map((deg, i) => {
            const local = t - 1.2 - i * 0.06;
            if (local <= 0) return null;
            const p = ease("slap", local);
            const a = (deg * Math.PI) / 180;
            const r0 = 112;
            const r1 = r0 + 176 * p;
            const pts = arrow(mx + r0 * Math.cos(a), my + r0 * Math.sin(a), mx + r1 * Math.cos(a), my + r1 * Math.sin(a), 13, 36);
            return (
              <React.Fragment key={deg}>
                <polygon points={pts} transform={`translate(${sh} ${sh})`} fill={C.black} stroke={C.black} strokeWidth={E.small.border} />
                <polygon points={pts} fill={C.blue} stroke={C.black} strokeWidth={E.small.border} strokeLinejoin="miter" />
              </React.Fragment>
            );
          })}
        </svg>
        <Sticker x={mx - 96} y={my - 76} w={192} h={150} at={1.0}>
          <div style={{ position: "absolute", left: 18, top: 22, width: 96, height: 96, boxSizing: "border-box", border: `${E.card.border}px solid ${C.black}`, backgroundColor: C.green, transform: "rotate(45deg)" }} />
          <div style={{ position: "absolute", left: 80, top: 22, width: 96, height: 96, boxSizing: "border-box", border: `${E.card.border}px solid ${C.black}`, backgroundColor: C.green, transform: "rotate(45deg)" }} />
        </Sticker>
      </Card>
      <Star cx={250} cy={530} r={150} at={0.5} tilt={-6} />
      <Pill text={d.in} x={138} y={500} at={0.7} fill={C.white} tilt={-4} />
      <Pill text={d.object} x={620} y={456} at={1.85} fill={C.green} tilt={2} size={28} />
      <Card x={100} y={1250} w={860} h={280} at={1.95} tilt={1.3} fill={C.yellow}>
        <Slab lines={wrap(d.out, 14)} x={34} y={30} size={T.headingMd + 18} at={1.95} leading={1.08} />
      </Card>
      <Stripes x={-60} y={1640} w={560} h={160} tilt={-4} fill={C.green} at={2.1} />
      <Block x={760} y={1630} w={380} h={240} tilt={6} fill={C.blue} at={2.2} />
      <Pill text={d.label} x={270} y={1106} at={1.6} fill={C.blue} tilt={-2} size={30} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.35);
  const track = 780;
  const bars: [string, number, string, number, number][] = [
    ["Blue · 450 nm", 1, C.blue, 1176, -1.2],
    ["Red · 700 nm", 1 / n.value, C.pink, 1340, 1.3],
  ];
  return (
    <Ground fill={C.green} from={C.pink} next={C.yellow} leave={3.0}>
      <Pill text="By the numbers" x={M} y={TOP} at={0.15} fill={C.cream} tilt={2} />
      <Card x={M} y={340} w={940} h={470} at={0.25} tilt={-2}>
        <div style={{ position: "absolute", left: 40, top: 40, fontFamily: DISPLAY, fontWeight: 900, fontSize: T.stat, lineHeight: 1.1, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
          {(n.value * p).toFixed(n.decimals)}
          {n.unit}
        </div>
        <Dot x={876} y={22} />
      </Card>
      <Card x={120} y={856} w={840} h={170} at={0.9} tilt={1.4} fill={C.cream} small>
        <Body text={n.caption} x={32} y={24} w={770} />
      </Card>
      {bars.map(([label, frac, fill, y, tilt], i) => {
        const g = ease("grow", t - 1.2 - i * 0.14);
        return (
          <Card key={label} x={M + i * 40} y={y} w={track + 90} h={128} at={1.15 + i * 0.14} tilt={tilt} small>
            <div style={{ position: "absolute", left: 16, top: 16, width: Math.max(0, (track + 40) * frac * g), height: 86, boxSizing: "border-box", border: `${E.small.border}px solid ${C.black}`, backgroundColor: fill }} />
            <div style={{ position: "absolute", left: frac < 0.5 ? (track + 40) * frac + 36 : 34, top: 40, fontFamily: LABEL, fontWeight: 700, fontSize: T.label + 4, letterSpacing: `${T.labelTracking}em`, textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap" }}>{label}</div>
          </Card>
        );
      })}
      <Star cx={930} cy={300} r={100} fill={C.pink} tilt={10} at={1.5} />
      <Stripes x={420} y={1540} w={700} h={170} tilt={-4} fill={C.yellow} at={1.6} />
      <Block x={-70} y={1560} w={420} h={260} tilt={7} fill={C.blue} at={1.7} />
    </Ground>
  );
};

const List: React.FC = () => {
  const rows: [number, number, number, string][] = [
    [M, 346, -1.3, C.pink],
    [210, 712, 1.2, C.blue],
    [90, 1078, -1, C.green],
  ];
  const [cw, ch] = [770, 290];
  const sq = 130;
  return (
    <Ground fill={C.yellow} from={C.green} next={C.black} leave={3.0}>
      <Pill text="In three steps" x={M} y={TOP} at={0.15} fill={C.white} tilt={-2} />
      {rows.slice(0, 2).map(([x], i) => (
        <div key={i} style={{ position: "absolute", left: (x + rows[i + 1][0]) / 2 + 240, top: rows[i][1] + ch - 16, width: 30, height: 110, backgroundColor: C.black }} />
      ))}
      {SAMPLE.list.map((item, i) => {
        const [x, y, tilt, fill] = rows[i];
        const at = 0.3 + i * 0.28;
        return (
          <Card key={i} x={x} y={y} w={cw} h={ch} at={at} tilt={tilt}>
            <div style={{ position: "absolute", left: 26, top: (ch - 2 * E.card.border - sq) / 2, width: sq, height: sq, boxSizing: "border-box", border: `${E.card.border}px solid ${C.black}`, backgroundColor: fill, fontFamily: LABEL, fontWeight: 700, fontSize: 72, lineHeight: `${sq - 12}px`, textAlign: "center" }}>{i + 1}</div>
            <Slab lines={wrap(item, 14)} x={182} y={(ch - 2 * E.card.border - wrap(item, 14).length * T.step * 1.14) / 2} size={T.step} at={at + 0.06} leading={1.14} />
          </Card>
        );
      })}
      <Star cx={906} cy={340} r={120} fill={C.pink} tilt={14} at={1.3} />
      <Stripes x={640} y={1440} w={480} h={170} tilt={-6} fill={C.blue} at={1.4} />
      <Block x={-70} y={1470} w={420} h={230} tilt={7} fill={C.cream} at={1.5} />
    </Ground>
  );
};

const End: React.FC = () => {
  const lines = wrap(SAMPLE.end.line, 7);
  const [x, y, w, h] = [84, 470, 880, 520];
  return (
    <Ground fill={C.black} from={C.yellow} dots={false}>
      <Card x={x} y={y} w={w} h={h} at={0.3} tilt={-1.2} fill={C.black} border={C.white} shadow={C.yellow} shadowSize={E.close.shadow}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Slab lines={lines.map((l) => l.replace(/\*/g, ""))} x={46} y={80} size={T.close} at={0.45} col={C.white} leading={1.08} />
        </div>
      </Card>
      <Star cx={920} cy={486} r={130} fill={C.pink} tilt={12} at={1.0} line={C.white} />
      <Star cx={110} cy={250} r={120} fill={C.blue} tilt={-10} at={1.5} line={C.white} />
      <Stripes x={460} y={1520} w={680} h={170} tilt={-4} fill={C.yellow} at={1.6} line={C.white} />
      <Stripes x={-70} y={1580} w={420} h={170} tilt={6} fill={C.green} at={1.7} line={C.white} />
      <Sticker x={150} y={1106} w={780} h={150} at={1.25} tilt={1.5}>
        <div style={{ width: 780, height: 150, boxSizing: "border-box", border: `${E.card.border}px solid ${C.white}`, boxShadow: `${E.card.shadow}px ${E.card.shadow}px 0 ${C.pink}`, backgroundColor: C.yellow, color: C.black, fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, letterSpacing: `${T.tracking}em`, lineHeight: "136px", textAlign: "center", textTransform: "uppercase" }}>
          {SAMPLE.end.cta}
        </div>
      </Sticker>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.3, hero: 2.6, component: Title },
  { id: "headline", duration: 3.3, hero: 2.6, component: Headline },
  { id: "diagram", duration: 3.8, hero: 3.1, component: Diagram },
  { id: "number", duration: 3.3, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3.3, hero: 2.6, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];

