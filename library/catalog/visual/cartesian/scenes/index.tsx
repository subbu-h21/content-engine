/** Cartesian on the shared sample content: a cover with a ring, a wavelength rail, a compass construction, a scale drawing of the ratio, agenda rows, a ringed sign-off. */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { DISPLAY } from "./fonts";
import { Body, C, COL, ease, Ground, H, Label, Line, M, Ring, S, Traced, W } from "./parts";

const T = S.type;
const E = S.elements;
const TOP = S.layout.safe.top + 14;
const n = SAMPLE.number;

const Title: React.FC = () => {
  const [cx, cy, r] = [640, 1170, 340];
  return (
    <Ground leave={3.75}>
      <Ring cx={cx} cy={cy} r={r} at={0.2} />
      <Line x1={cx - 34} y1={cy} x2={cx + 34} y2={cy} at={1.5} />
      <Line x1={cx} y1={cy - 34} x2={cx} y2={cy + 34} at={1.55} />
      <Label text={SAMPLE.kicker} y={TOP} at={0.3} />
      <Traced lines={wrap(SAMPLE.title, 11)} y={320} size={T.display} at={0.5} />
      <Line x1={M} y1={724} x2={M + E.inkRule.w} y2={724} at={1.4} ink />
    </Ground>
  );
};

const Headline: React.FC = () => {
  const lines = [SAMPLE.headline[0], ...wrap(SAMPLE.headline[1], 12)];
  const y = 870;
  const stops = [400, 450, 500, 550, 600, 650, 700];
  return (
    <Ground leave={3.75}>
      <Ring cx={880} cy={1500} r={300} at={0.8} />
      <Label text={SAMPLE.chapter} y={TOP} at={0.1} />
      <Traced lines={lines} y={330} size={T.h2 + 12} at={0.25} leading={1.12} />
      <Line x1={M} y1={y} x2={W - M} y2={y} at={1.05} />
      {stops.map((nm, i) => {
        const x = M + (COL * i) / (stops.length - 1);
        const at = 1.15 + i * 0.07;
        const major = nm === 400 || nm === 700;
        return (
          <React.Fragment key={nm}>
            <Line x1={x} y1={y} x2={x} y2={y + (major ? 40 : 22)} at={at} />
            {major ? <Label text={`${nm} nm`} x={x} y={y + 54} at={at + 0.1} align={nm === 400 ? "left" : "right"} /> : null}
          </React.Fragment>
        );
      })}
      <Body text={SAMPLE.body} y={1000} w={700} at={1.7} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [cx, cy, r] = [W / 2 + 40, 800, 370];
  const rays = Array.from({ length: 16 }, (_, i) => (Math.PI * 2 * i) / 16 + Math.PI / 16);
  const icon = 74;
  return (
    <Ground leave={4.25}>
      <Label text="How it works" y={TOP} at={0.1} />
      <Ring cx={cx} cy={cy} r={r} at={0.15} />
      <Line x1={0} y1={cy - 300} x2={cx - icon * 0.84} y2={cy - icon * 0.54} at={0.9} ink />
      {rays.map((a, i) => {
        const r0 = icon + 22;
        return <Line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} at={1.5 + i * 0.03} col={C.taupe} />;
      })}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={icon} fill={C.stone} stroke={C.ink} strokeWidth={E.hairline} opacity={ease("fade", t - 1.2)} />
      </svg>
      <div style={{ position: "absolute", left: cx - icon, top: cy - icon, width: 2 * icon, height: 2 * icon, fontFamily: DISPLAY, fontSize: 62, lineHeight: `${2 * icon - 8}px`, textAlign: "center", color: C.ink, opacity: ease("fade", t - 1.3) }}>
        N₂
      </div>
      <Label text={d.in} x={M} y={cy - 342} at={1.1} col={C.ink} />
      <Traced lines={[d.object]} y={1234} size={T.h3 + 8} at={1.9} />
      <Body text={d.label} y={1330} at={2.3} />
      <Line x1={M} y1={1412} x2={W - M} y2={1412} at={2.35} />
      <Traced lines={[`*${d.out}*`]} y={1436} size={T.h3 + 4} at={2.5} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const unit = 62;
  const big = unit * n.value;
  const [cx, cy] = [W / 2, 850];
  const sy = cy + big - unit;
  const v = ease("rule", t - 0.9);
  return (
    <Ground leave={3.75}>
      <Label text="By the numbers" y={TOP} at={0.1} />
      <Ring cx={cx} cy={cy} r={big} at={0.2} dashed={false} />
      <Ring cx={cx} cy={sy} r={unit} at={1.1} dashed={false} alpha={0.85} />
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 200, textAlign: "center", fontFamily: DISPLAY, fontSize: T.stat, lineHeight: 1.2, color: C.ink, opacity: v }}>
        {n.value.toFixed(n.decimals)}
        <span style={{ fontStyle: "italic" }}>{n.unit}</span>
      </div>
      <Label text="Blue · 450 nm" y={cy + 34} at={1.3} align="center" />
      <Label text="Red · 700 nm" y={sy + unit + 22} at={1.9} align="center" col={C.ink} />
      <Line x1={cx} y1={sy + unit} x2={cx} y2={sy + unit + 20} at={1.8} ink />
      <Body text={n.caption} x={M + 90} y={1300} w={COL - 180} at={2.1} align="center" />
    </Ground>
  );
};

const List: React.FC = () => {
  const y0 = 640;
  const row = 276;
  return (
    <Ground leave={3.75}>
      <Ring cx={W - 40} cy={400} r={220} at={0.1} dashed={false} alpha={0.5} />
      <Label text={SAMPLE.chapter} y={TOP} at={0.1} />
      <Traced lines={["In three", "steps"]} y={320} size={T.h2 + 12} at={0.2} leading={1.1} />
      {SAMPLE.list.map((item, i) => {
        const y = y0 + i * row;
        const at = 0.75 + i * 0.3;
        return (
          <React.Fragment key={i}>
            <Line x1={M} y1={y} x2={W - M} y2={y} at={at} />
            <Traced lines={[String(i + 1)]} y={y + 44} size={T.numeral + 24} at={at + 0.1} col={C.taupe} />
            <Traced lines={wrap(item, 18)} x={M + 140} y={y + 52} size={T.h3 + 4} at={at + 0.2} leading={1.22} />
          </React.Fragment>
        );
      })}
      <Line x1={M} y1={y0 + 3 * row} x2={W - M} y2={y0 + 3 * row} at={1.75} />
    </Ground>
  );
};

const End: React.FC = () => {
  const [cx, cy, r] = [W / 2, 860, 450];
  return (
    <Ground guide={false}>
      <Ring cx={cx} cy={cy} r={r} at={0.1} />
      <Traced lines={wrap(SAMPLE.end.line, 8)} y={656} size={T.h1 + 16} at={0.6} align="center" />
      <Line x1={cx - 70} y1={1014} x2={cx + 70} y2={1014} at={1.5} ink />
      <Label text={SAMPLE.end.cta} y={1046} at={1.7} align="center" />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4.2, hero: 3.4, component: Title },
  { id: "headline", duration: 4.2, hero: 3.5, component: Headline },
  { id: "diagram", duration: 4.7, hero: 4.0, component: Diagram },
  { id: "number", duration: 4.2, hero: 3.5, component: NumberSample },
  { id: "list", duration: 4.2, hero: 3.5, component: List },
  { id: "end", duration: 3.8, hero: 3.2, component: End },
];
