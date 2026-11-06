/** Stained Glass on the shared sample content: one lancet in a stone hall, a different hour of the sun in each shot. */
import React from "react";
import { fit, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { Banderole, C, Carved, circle, cut, ease, halfAt, poly, quarries, ray, RING, Room, S, scroll, Trace, WIN, wedge, W, H, type Glass, type Piece } from "./parts";

const CX = WIN.cx;
const CARVE = 930; // widest a carved line may run
const sky = (seed: number): Piece[] => quarries(seed, (_u, _v, r) => (r < 0.62 ? C.cobalt : C.deep));
const glass = (field: Piece[], subject: Piece[]): Glass => ({ field, subject, ring: RING });

/** Stacked carved lines at the largest size that fits the string course. */
const carved = (text: string, chars: number, max: number) => {
  const lines = wrap(text, chars);
  return { lines, size: fit(lines, CARVE, max, S.type.charEm) };
};

const Title: React.FC = () => {
  const t = useSeconds();
  const [sx, sy] = [CX, 560];
  const rays: Piece[] = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16;
    const h = Math.PI / 16;
    return { d: wedge(sx, sy, 128, i % 2 ? 214 : 262, a - h * 0.72, a + h * 0.72), hex: i % 2 ? C.ruby : C.gold };
  });
  const hill = (top: number, pts: number[], hex: string): Piece => ({
    d: cut([[120, H], ...pts.map((y, i): [number, number] => [120 + (i + 0.5) * (840 / pts.length), top + y]), [960, H]].slice(0, pts.length + 2) as [number, number][]),
    hex,
  });
  const g = glass(sky(7), [...rays, { d: circle(sx, sy, 118), hex: C.gold }, hill(860, [90, 30, 60, 130], C.olive), hill(950, [20, 90, 60, -10], C.emerald)]);
  const title = carved(SAMPLE.title, 14, S.type.title);
  return (
    <Room
      glass={g}
      sun="dawn"
      light={ray(t - 0.15)}
      strength={ease("ray", t - 0.15)}
      paint={
        <g fill="none" stroke={C.trace} strokeOpacity={0.7}>
          <circle cx={sx} cy={sy} r={84} strokeWidth={3} />
          <circle cx={sx} cy={sy} r={46} strokeWidth={2.4} />
        </g>
      }
    >
      <Carved lines={title.lines} size={title.size} at={1.1} />
      <Banderole lines={[SAMPLE.kicker]} at={1.7} w={520} />
    </Room>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const [ox, oy] = [CX, 270];
  const hues = [C.ruby, C.amber, C.gold, C.emerald, C.sky, C.cobalt, C.murrey];
  const spread = 0.15;
  const fan: Piece[] = hues.map((hex, i) => {
    const a = Math.PI / 2 + (i - (hues.length - 1) / 2) * spread;
    return { d: wedge(ox, oy, 90, 1000, a - spread / 2, a + spread / 2), hex };
  });
  const g = glass(quarries(19, (_u, _v, r) => (r < 0.5 ? C.deep : C.cobalt)), [...fan, { d: circle(ox, oy, 84), hex: C.white }]);
  // a line that holds emphasis breaks before it, so the gilded words stand on their own line
  const lines = SAMPLE.headline.flatMap((l) => l.replace(/\s\*/, "\n*").split("\n"));
  const size = fit(lines, CARVE, 72, S.type.charEm);
  return (
    <Room glass={g} sun="afternoon" light={ray(t - 0.1)} strength={ease("ray", t - 0.1)}>
      <Carved lines={lines} size={size} at={0.9} />
      <Banderole lines={wrap(SAMPLE.body, 36)} at={1.6} size={40} />
    </Room>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const cy = 680;
  const n = 14;
  const rays: Piece[] = Array.from({ length: n }, (_, i) => i).filter((i) => i !== 0).map((i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / n;
    const h = Math.PI / n;
    return { d: wedge(CX, cy, 172, i % 2 ? 292 : 262, a - h * 0.62, a + h * 0.62), hex: C.sky };
  });
  const beam: Piece = { d: poly([[CX - 14, 372], [CX + 14, 372], [CX + 30, cy - 160], [CX - 30, cy - 160]]), hex: C.gold };
  const g = glass(quarries(31, (_u, _v, r) => (r < 0.75 ? C.deep : C.cobalt)), [...rays, beam, { d: circle(CX, cy, 168), hex: C.ruby }, { d: circle(CX, cy, 142), hex: C.white }, { d: scroll(CX, 326, 270, 84), hex: C.white }]);
  const label = carved(d.label, 10, 98);
  return (
    <Room
      glass={g}
      sun="noon"
      light={ray(t - 0.1)}
      strength={ease("ray", t - 0.1)}
      bars={[440, 900]}
      paint={
        <>
          <Trace text={d.in} x={CX} y={324} size={46} />
          {d.object.split(" ").map((w, i) => (
            <Trace key={w} text={w} x={CX} y={cy - 28 + i * 58} size={52} />
          ))}
        </>
      }
    >
      <Carved lines={label.lines} size={label.size} at={1.1} />
      <Banderole lines={[d.out]} at={1.7} w={700} />
    </Room>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const unit = 92;
  const x0 = CX - (n.value * unit) / 2;
  const [yb, yr, bh] = [560, 880, 130];
  const pane = (x: number, w: number, y: number, hex: string): Piece => ({ d: poly([[x, y], [x + w, y], [x + w, y + bh], [x, y + bh]]), hex });
  const blue = Array.from({ length: Math.ceil(n.value) }, (_, i) => pane(x0 + i * unit, Math.min(unit, (n.value - i) * unit), yb, C.sky));
  const g = glass(quarries(43, (_u, _v, r) => (r < 0.7 ? C.deep : C.murrey)), [...blue, pane(x0, unit, yr, C.ruby), { d: scroll(CX, yb - 74, 400, 84), hex: C.white }, { d: scroll(CX, yr - 74, 400, 84), hex: C.white }]);
  const caption = n.caption.replace(/ nm/g, "_nm");
  return (
    <Room
      glass={g}
      sun="dawn"
      light={ray(t - 0.1)}
      strength={ease("ray", t - 0.1)}
      bars={[410, 730, 1040]}
      paint={
        <>
          <Trace text="Blue · 450 nm" x={CX} y={yb - 76} />
          <Trace text="Red · 700 nm" x={CX} y={yr - 76} />
        </>
      }
    >
      <Carved lines={[`*${n.value}${n.unit}*`]} size={S.type.number} at={1.0} />
      <Banderole lines={wrap(caption, 34).map((l) => l.replace(/_/g, " "))} at={1.6} size={40} />
    </Room>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const ys = [470, 720, 970];
  const size = fit(SAMPLE.list, 560, S.type.scroll, 0.44);
  const stops = [0.25, 0.95, 1.65];
  const edge = stops.reduce((e, at, i) => e + [590, 250, 400][i] * ease("step", t - at), 0);
  const panels: Piece[] = ys.map((y, i) => ({ d: poly([[CX - 320, y - 112], [CX + 320, y - 112], [CX + 320, y + 112], [CX - 320, y + 112]]), hex: [C.ruby, C.emerald, C.cobalt][i] }));
  const scrolls: Piece[] = ys.map((y) => ({ d: scroll(CX, y, Math.min(halfAt(y - 50) * 2 - 50, 580), 116), hex: C.white }));
  const g = glass(sky(55), [...panels, { d: circle(CX, 268, 62), hex: C.gold }, ...scrolls]);
  const title = carved("In three steps", 16, 84);
  return (
    <Room
      glass={g}
      sun="dusk"
      light={edge > 0 ? poly([[0, 0], [W, 0], [W, edge], [0, edge]]) : ""}
      strength={ease("step", t - 0.25)}
      bars={[345, 595, 845, 1090]}
      paint={
        <>
          {SAMPLE.list.map((item, i) => (
            <Trace key={i} text={item} x={CX} y={ys[i]} size={size} />
          ))}
        </>
      }
    >
      <Carved lines={title.lines} size={title.size} at={0.6} />
      <Banderole lines={[SAMPLE.chapter]} at={1.2} w={520} />
    </Room>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [CX, 640];
  const petals: Piece[] = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 12;
    const h = Math.PI / 12;
    return { d: wedge(cx, cy, 104, 286, a - h * 0.86, a + h * 0.86), hex: i % 2 ? C.ruby : C.cobalt };
  });
  const pearls: Piece[] = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI * 2 * (i + 0.5)) / 12;
    return { d: circle(cx + 200 * Math.cos(a), cy + 200 * Math.sin(a), 19), hex: C.gold };
  });
  const g = glass(sky(67), [{ d: circle(cx, cy, 300), hex: C.deep }, ...petals, ...pearls, { d: circle(cx, cy, 96), hex: C.amber, story: true }]);
  const line = carved(SAMPLE.end.line, 8, 110);
  return (
    <Room glass={g} sun="moon" light={ray(t - 0.05)} strength={0.5 * ease("ray", t - 0.05)}>
      <Carved lines={line.lines} size={line.size} at={0.8} />
      <Banderole lines={[SAMPLE.end.cta]} at={1.4} w={560} />
    </Room>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.8, component: Title },
  { id: "headline", duration: 3.2, hero: 2.8, component: HeadlineSample },
  { id: "diagram", duration: 3.3, hero: 2.9, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.8, component: List },
  { id: "end", duration: 2.9, hero: 2.5, component: End },
];
