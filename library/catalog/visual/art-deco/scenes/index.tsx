/** Art Deco on the shared sample content: everything stands on one centre axis. */
import React from "react";
import { fit, SAMPLE, useSeconds, useUid, wrap, type Sample } from "../../kit";
import { Airbrush, along, Art, Body, Bulbs, C, CX, Caps, Diamond, Doors, E, ease, Eyebrow, Gline, GoldNumber, Ground, M, Medallion, Plaque, poly, S, Scales, Sparkle, steppedArch, steppedRect, Sunburst, W, type Pt } from "./parts";
import { BODY, NUMERAL, PLAQUE } from "./fonts";

const COLUMN = W - 2 * M;
const PY = S.layout.plaqueY;
const FLOOR = 1610; // ornament below the safe zone starts here

const Title: React.FC = () => {
  const t = useSeconds();
  const uid = useUid("arch");
  const lines = wrap(SAMPLE.title, 7);
  const size = fit(lines, 720, S.type.title, 0.66);
  const arch = steppedArch(430, 1590, 880, 58, 58, 4);
  const bulbs = steppedArch(466, 1570, 808, 58, 58, 4);
  return (
    <Ground sky sheenAt={1.3}>
      <Sunburst cy={1010} r={1300} />
      <Scales top={FLOOR} />
      <Art>
        <defs>
          <Airbrush id={uid} from={C.jewel} to={C.lacquer} />
        </defs>
        <path d={poly(arch)} fill={`url(#${uid})`} opacity={ease("unfold", t - 0.2)} />
        <Gline d={poly(arch)} w={5} p={ease("draw", t - 0.1)} />
      </Art>
      <Bulbs pts={along(bulbs, E.bulb.spacing)} at={0.5} />
      <Caps lines={lines} size={size} y={1010 - (lines.length * size * S.type.leading) / 2} at={0.7} />
      <Art>
        <Sparkle x={CX} y={1385} r={46} at={1.3} />
        <Sparkle x={CX - 120} y={1385} r={22} at={1.4} />
        <Sparkle x={CX + 120} y={1385} r={22} at={1.4} />
      </Art>
      <Plaque y={PY} w={560} h={92} at={0.1}>
        <Eyebrow text={SAMPLE.kicker} />
      </Plaque>
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const lines = SAMPLE.headline.flatMap((l) => wrap(l, 12));
  const size = fit(lines, COLUMN, S.type.display, 0.66);
  return (
    <Ground sheenAt={1.6}>
      <Sunburst cy={FLOOR} r={1500} />
      <Scales top={FLOOR} />
      <Plaque y={PY} w={600} h={92} at={0.1}>
        <Eyebrow text={`No. 1  ·  ${SAMPLE.chapter}`} />
      </Plaque>
      <Caps lines={lines} size={size} y={490} at={0.35} />
      <Plaque y={1300} w={COLUMN + 40} h={240} at={1.2}>
        <Body text={SAMPLE.body} width={COLUMN - 70} />
      </Plaque>
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const cy = 970;
  const [r0, r1] = [176, 410];
  const sunY = 480;
  const n = 36;
  const step = (Math.PI * 2) / n;
  const beam = ease("draw", t - 0.2);
  const wedges: React.ReactNode[] = [];
  for (let i = 1; i < n; i++) {
    // i = 0 points straight up: the beam comes down there
    const a = i * step - Math.PI / 2;
    const p = ease("scale", t - 1.2 - Math.abs(i - n / 2) * 0.02);
    if (p <= 0) continue;
    const r = r0 + (r1 - r0) * p * (i % 2 ? 1 : 0.8);
    const h = step * 0.28;
    const pt = (rad: number, ang: number): Pt => [CX + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
    wedges.push(<path key={i} d={poly([pt(r0, a - h * 0.5), pt(r, a - h), pt(r, a + h), pt(r0, a + h * 0.5)])} fill={i % 2 ? C.exception : C.gold} stroke={C.light} strokeOpacity={0.6} strokeWidth={1.5} />);
  }
  return (
    <Ground sky sheenAt={1.7}>
      <Sunburst cy={cy} r={1100} alpha={0.16} />
      <Art>
        {wedges}
        <Gline d={`M${CX - 9} ${sunY}L${CX - 9} ${cy - r0}`} w={6} p={beam} />
        <Gline d={`M${CX + 9} ${sunY}L${CX + 9} ${cy - r0}`} w={6} p={beam} />
        <Medallion y={cy} r={166} at={0.5} />
        <Sparkle x={CX} y={sunY} r={92} at={0.1} fill={C.light} />
      </Art>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 58, textAlign: "center", fontFamily: PLAQUE, fontSize: 50, lineHeight: "58px", color: C.text, opacity: ease("rise", t - 0.9), letterSpacing: 1 }}>
        {d.object.toUpperCase().split(" ").map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <Plaque y={PY} w={460} h={92} at={0.1}>
        <Eyebrow text={d.in} />
      </Plaque>
      <Plaque y={1496} w={COLUMN} h={160} at={1.7}>
        <Eyebrow text={d.label} size={S.type.label} color={C.text} />
        <div style={{ height: 14 }} />
        <Eyebrow text={d.out} size={26} />
      </Plaque>
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const [cy, R] = [1150, 380];
  const max = 6;
  const v = n.value * ease("needle", t - 0.5);
  const at = (x: number, r: number): Pt => {
    const a = Math.PI + (x / max) * Math.PI;
    return [CX + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arc = (r: number) => `M${CX - r} ${cy}A${r} ${r} 0 0 1 ${CX + r} ${cy}`;
  const dial = ease("draw", t - 0.1);
  const tip = at(v, R - 12);
  const a = Math.PI + (v / max) * Math.PI + Math.PI / 2;
  const [nx, ny] = [14 * Math.cos(a), 14 * Math.sin(a)];
  const rise = ease("rise", t - 0.8);
  const mark = at(1, R + 2);
  const legend = (x: number, value: string, label: string, col: string) => (
    <div style={{ position: "absolute", left: x - 200, width: 400, top: cy + 78, textAlign: "center", opacity: rise }}>
      <div style={{ fontFamily: NUMERAL, fontSize: 64, lineHeight: 1, color: col }}>
        {value}
        <span style={{ fontFamily: BODY, fontSize: 40, marginLeft: 3 }}>{n.unit}</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: BODY, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: C.text, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
  return (
    <Ground sheenAt={1.7}>
      <Sunburst cy={cy} r={1200} alpha={0.18} />
      <Scales top={FLOOR} />
      <GoldNumber text={Math.min(n.value, Math.max(0, v)).toFixed(n.decimals)} unit={n.unit} size={S.type.number} font={NUMERAL} y={290} opacity={ease("rise", t - 0.2)} />
      <Art>
        <Gline d={arc(R)} w={6} p={dial} />
        <Gline d={arc(R - 24)} w={1.4} p={dial} />
        {Array.from({ length: max * 2 + 1 }, (_, i) => {
          const [a0, a1] = [at(i / 2, R), at(i / 2, R + (i % 2 ? 16 : 28))];
          return <Gline key={i} d={`M${a0[0]} ${a0[1]}L${a1[0]} ${a1[1]}`} w={2.5} p={ease("scale", t - 0.3 - i * 0.03)} />;
        })}
        {Array.from({ length: max + 1 }, (_, i) => {
          const [x, y] = at(i, R + 62);
          return (
            <text key={i} x={x} y={y + 12} textAnchor="middle" fontFamily={NUMERAL} fontSize={S.type.dial} fill={C.gold} opacity={ease("rise", t - 0.4 - i * 0.05)}>
              {i}
            </text>
          );
        })}
        <path d={poly([[mark[0], mark[1] - 22], [mark[0] + 22, mark[1]], [mark[0], mark[1] + 22], [mark[0] - 22, mark[1]]])} fill={C.accent} stroke={C.light} strokeWidth={2} opacity={rise} />
        <path d={poly([tip, [CX + nx, cy + ny], [CX - nx, cy - ny]])} fill={C.light} stroke={C.lacquer} strokeWidth={1.6} />
        <Medallion y={cy} r={44} at={0.2} />
      </Art>
      {legend(CX - 214, "1", "Red · 700 nm", C.text)}
      {legend(CX + 214, String(n.value), "Blue · 450 nm", C.light)}
      <Plaque y={1466} w={COLUMN + 40} h={150} at={1.1}>
        <Body text={n.caption.replace(/ nm/g, "\u00a0nm")} size={36} width={COLUMN - 40} />
      </Plaque>
    </Ground>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const size = fit(SAMPLE.list, COLUMN - 60, 50, 0.5);
  const ys = [650, 980, 1310];
  return (
    <Ground sheenAt={1.8}>
      <Sunburst cy={960} r={1200} alpha={0.14} />
      <Scales top={FLOOR} rows={4} />
      <Art>
        <Gline d={`M${CX} ${PY + 46}L${CX} ${1500}`} w={4} p={ease("draw", t - 0.1)} />
        <Sparkle x={CX} y={1516} r={40} at={1.4} fill={C.light} />
      </Art>
      <Plaque y={PY} w={560} h={92} at={0.1}>
        <Eyebrow text="In three steps" />
      </Plaque>
      {SAMPLE.list.map((item, i) => {
        const at = 0.35 + i * 0.3;
        const y = ys[i];
        return (
          <React.Fragment key={i}>
            <Plaque y={y} w={COLUMN + 40} h={170} at={at}>
              <div style={{ paddingTop: 34, fontFamily: BODY, fontWeight: 600, fontSize: size, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
            </Plaque>
            <Art>
              <Diamond y={y - 85} r={56} at={at + 0.25} />
            </Art>
            <div style={{ position: "absolute", left: 0, right: 0, top: y - 85 - 30, textAlign: "center", fontFamily: NUMERAL, fontSize: 60, lineHeight: "60px", color: C.light, opacity: ease("rise", t - at - 0.5) }}>{i + 1}</div>
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const uid = useUid("end");
  const lines = wrap(SAMPLE.end.line, 7);
  const size = fit(lines, 680, S.type.title, 0.66);
  const cy = 860;
  const outer = steppedRect(CX, cy, 880, 640, 40, 3);
  const inner = steppedRect(CX, cy, 816, 576, 40, 3);
  return (
    <Ground sky sheenAt={1.0}>
      <Sunburst cy={cy} r={1300} at={0.2} />
      <Scales top={FLOOR} />
      <Art>
        <defs>
          <Airbrush id={uid} from={C.jewel} to={C.lacquer} />
        </defs>
        <path d={poly(outer)} fill={`url(#${uid})`} />
        <Gline d={poly(outer)} w={5} />
      </Art>
      <Bulbs pts={along(inner, E.bulb.spacing, true)} at={0.5} />
      <Caps lines={lines} size={size} y={cy - (lines.length * size * S.type.leading) / 2} at={0.45} />
      <Plaque y={1350} w={640} h={100} at={0.9}>
        <Eyebrow text={SAMPLE.end.cta} size={S.type.label} />
      </Plaque>
      <Doors at={0.05} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.6, component: Title },
  { id: "headline", duration: 3.2, hero: 2.8, component: HeadlineSample },
  { id: "diagram", duration: 3.5, hero: 3.0, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.8, component: List },
  { id: "end", duration: 2.8, hero: 2.3, component: End },
];
