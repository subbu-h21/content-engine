/** Impasto on the shared sample content: title (colour returns), headline, diagram, number, list, end. */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { C, Canvas, Crisp, ellipse, H, knives, M, mix, PaintedText, Plane, rect, S, SolidPlane, T, W, type Pt, type Reveal } from "./parts";

const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");

/** The after-rain sky as stroke-to-stroke steps (never a blended gradient): each stroke picks its band by height. */
const skyPaint = (stops: [number, string][], seed: number) => {
  let k = seed;
  return (x: number, y: number): [string, string] => {
    k = (k * 9301 + 49297) % 233280;
    const j = (k / 233280 - 0.5) * 80;
    let i = 0;
    while (i < stops.length - 1 && y + j > stops[i + 1][0]) i++;
    return [stops[i][1], stops[Math.min(stops.length - 1, i + 1)][1]];
  };
};

/** A sphere in paint: lit cream at the upper left, shadow colour lower right, chosen stroke by stroke. */
const spherePaint = (cx: number, cy: number, r: number, lit: string, mid: string, dark: string) => (x: number, y: number): [string, string] => {
  const d = (-(x - cx) * 0.6 - (y - cy) * 0.8) / r;
  return d > 0.35 ? [lit, mid] : d > -0.3 ? [mid, lit] : [dark, mid];
};

/** A wedge from a point outwards (a beam, a ray). */
const wedge = (from: Pt, ang: number, len: number, w0: number, w1: number, start = 0): Pt[] => {
  const [ux, uy] = [Math.cos(ang), Math.sin(ang)];
  const [nx, ny] = [-uy, ux];
  const a: Pt = [from[0] + ux * start, from[1] + uy * start];
  const b: Pt = [from[0] + ux * (start + len), from[1] + uy * (start + len)];
  return [
    [a[0] + nx * w0, a[1] + ny * w0],
    [b[0] + nx * w1, b[1] + ny * w1],
    [b[0] - nx * w1, b[1] - ny * w1],
    [a[0] - nx * w0, a[1] - ny * w0],
  ];
};

// ------------------------------------------------------------------ title: the grey town; the colour comes back from "blue?"

const Title: React.FC = () => {
  const reveal: Reveal = { x: 300, y: 780, at: 1.55, speed: 950 };
  const sky = rect(-20, -20, W + 40, 1300);
  const stops: [number, string][] = [[0, C.cobaltSky], [560, C.peach], [930, C.gold]];
  const skyKnives = knives(sky, { r: E_PLANE, angle: -4, seed: 11, sweep: 0, paint: skyPaint(stops, 5) });
  const buildings: { poly: Pt[]; c: string; c2: string }[] = [
    { poly: [[-20, 1210], [150, 1150], [330, 1200], [330, 1940], [-20, 1940]], c: C.ochre, c2: C.rose },
    { poly: [[330, 1260], [640, 1260], [640, 1940], [330, 1940]], c: C.rose, c2: C.ochre },
    { poly: [[640, 1170], [860, 1110], [1100, 1170], [1100, 1940], [640, 1940]], c: C.ochre, c2: C.peach },
  ];
  const windows: Pt[] = [
    [60, 1330],
    [190, 1330],
    [60, 1520],
    [190, 1520],
    [700, 1290],
    [840, 1290],
    [980, 1290],
    [700, 1480],
    [840, 1480],
    [980, 1480],
  ];
  return (
    <Canvas ground={C.cobaltSky}>
      <Plane poly={sky} strokes={skyKnives} base={C.cobaltSky} at={0} reveal={reveal} bands={stops} />
      {buildings.map((b, i) => (
        <SolidPlane key={i} poly={b.poly} c={b.c} c2={b.c2} r={42} angle={86} at={0.25 + i * 0.12} seed={20 + i} sweep={Math.PI / 2} reveal={reveal} />
      ))}
      {windows.map(([x, y], i) => (
        <React.Fragment key={i}>
          <SolidPlane poly={rect(x - 10, y - 8, 104, 140)} c={C.shutter} c2={mix(C.shutter, "#000000", 0.2)} r={16} angle={90} at={0.8 + i * 0.03} seed={40 + i} reveal={reveal} />
          <SolidPlane poly={rect(x + 14, y + 12, 56, 100)} c={i % 3 === 0 ? C.gold : C.dark} c2={C.umber} r={12} angle={90} at={0.9 + i * 0.03} seed={60 + i} reveal={reveal} />
        </React.Fragment>
      ))}
      <SolidPlane poly={[[330, 1350], [640, 1350], [670, 1440], [300, 1440]]} c={C.awning} c2={C.red} r={22} angle={0} at={1.0} seed={80} reveal={reveal} />
      <SolidPlane poly={rect(-20, 1780, W + 40, 160)} c={C.umber} c2={C.dark} r={34} angle={0} at={1.0} seed={81} reveal={reveal} />
      {[60, 190, 840, 980].map((x, i) =>
        [0, 1, 2, 3].map((j) => (
          <g key={`${i}-${j}`} opacity={1 - j * 0.22}>
            <SolidPlane poly={rect(x + 20 + ((j * 37 + i * 11) % 19) - 9, 1798 + j * 30, 58 - j * 11, 10 + (j % 2) * 3)} c={i % 2 ? C.gold : C.peach} c2={C.yellow} r={9} angle={0} at={1.4 + i * 0.05} seed={90 + i * 4 + j} reveal={reveal} />
          </g>
        )),
      )}
      <PaintedText text={plainOf(SAMPLE.title)} x={M} y={440} size={T.title - 12} c={C.cream} at={0.5} seed={101} />
      <PaintedText text={emOf(SAMPLE.title)} x={M - 8} y={890} size={T.hero} c={C.cobalt} at={1.25} seed={102} />
      <Crisp lines={[SAMPLE.kicker]} x={M} y={290} at={0.2} />
    </Canvas>
  );
};

// ------------------------------------------------------------------ headline: the sun throws every colour

const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const lines = [all.slice(0, 2), all.slice(2, 4), all.slice(4)].map((ws) => ws.map((w) => w.text).join(" "));
  const sun: Pt = [540, 1260];
  const fan = [C.red, C.orange, C.yellow, C.viridian, C.turquoise, C.cobalt, C.violet];
  const sky = rect(-20, -20, W + 40, 1280);
  return (
    <Canvas ground={C.ultramarine}>
      <Plane poly={sky} base={C.ultramarine} at={0} bands={[[0, C.ultramarine], [520, C.cobaltSky], [980, C.peach]]} strokes={knives(sky, { r: E_PLANE, angle: -3, seed: 201, paint: skyPaint([[0, C.ultramarine], [520, C.cobaltSky], [980, C.peach]], 7) })} />
      <SolidPlane poly={rect(-20, 1260, W + 40, 700)} c={C.umber} c2={C.shutter} r={48} angle={2} at={0.2} seed={202} />
      {fan.map((c, i) => {
        const a = ((-162 + (i * 144) / (fan.length - 1)) * Math.PI) / 180;
        return <SolidPlane key={i} poly={wedge(sun, a, 470, 22, 62, 170)} c={c} c2={mix(c, "#ffffff", 0.25)} r={30} angle={(a * 180) / Math.PI} at={1.2 + i * 0.1} seed={210 + i} sweepDur={0.4} />;
      })}
      <Plane poly={ellipse(sun[0], sun[1], 150, 150)} base={C.gold} at={0.8} strokes={knives(ellipse(sun[0], sun[1], 150, 150), { r: 30, angle: 20, seed: 230, paint: spherePaint(sun[0], sun[1], 150, C.cream, C.gold, C.yellow) })} />
      {lines.map((l, i) => (
        <PaintedText key={i} text={l} x={M} y={400 + i * T.headline * T.leading} size={T.headline} c={C.cream} at={0.3 + i * 0.35} seed={240 + i} dur={0.6} />
      ))}
      <Crisp lines={wrap(SAMPLE.body, 34)} x={M} y={1520} at={2.4} size={T.body} />
    </Canvas>
  );
};

// ------------------------------------------------------------------ diagram

const Diagram: React.FC = () => {
  const c: Pt = [560, 900];
  const src: Pt = [60, 330];
  const inA = Math.atan2(c[1] - src[1], c[0] - src[0]);
  const blue = [-85, -40, 0, 85, 125, 165, 205].map((d) => (d * Math.PI) / 180);
  const ground = rect(-20, -20, W + 40, H + 40);
  const r = 96;
  const a: Pt = [c[0] - r * 0.7, c[1] + 10];
  const b: Pt = [c[0] + r * 0.7, c[1] - 10];
  return (
    <Canvas ground={C.umber}>
      <Plane poly={ground} base={C.umber} at={0} strokes={knives(ground, { r: 64, angle: -10, seed: 301, paint: (x, y) => [(x + y) % 3 < 1.5 ? C.umber : mix(C.umber, C.ultramarine, 0.25), C.dark] })} />
      <SolidPlane poly={wedge(src, inA, Math.hypot(c[0] - src[0], c[1] - src[1]) - r * 1.5, 46, 30)} c={C.gold} c2={C.cream} r={26} angle={(inA * 180) / Math.PI} at={0.3} seed={310} sweep={inA} sweepDur={0.5} />
      <Plane poly={ellipse(a[0], a[1], r)} base={C.ochre} at={0.8} strokes={knives(ellipse(a[0], a[1], r), { r: 22, angle: -35, seed: 320, paint: spherePaint(a[0], a[1], r, C.cream, C.ochre, C.rose) })} />
      <Plane poly={ellipse(b[0], b[1], r)} base={C.ochre} at={0.95} strokes={knives(ellipse(b[0], b[1], r), { r: 22, angle: -35, seed: 321, paint: spherePaint(b[0], b[1], r, C.cream, C.ochre, C.rose) })} />
      {blue.map((d, i) => (
        <SolidPlane key={i} poly={wedge(c, d, 150, 16, 34, r * 1.75)} c={i % 2 ? C.turquoise : C.cobalt} c2={i % 2 ? C.cobalt : C.turquoise} r={22} angle={(d * 180) / Math.PI} at={1.5 + i * 0.08} seed={330 + i} sweep={d} sweepDur={0.3} />
      ))}
      <SolidPlane poly={wedge(c, inA, 380, 22, 18, r * 1.8)} c={C.red} c2={C.awning} r={22} angle={(inA * 180) / Math.PI} at={2.2} seed={350} sweep={inA} sweepDur={0.4} />
      <Crisp lines={[SAMPLE.diagram.in]} x={M} y={290} at={0.4} />
      <Crisp lines={[SAMPLE.diagram.object]} x={M} y={1180} at={1.1} />
      <Crisp lines={["red goes on"]} x={S.layout.textRight} y={1400} at={2.5} anchor="end" />
      <PaintedText text={SAMPLE.diagram.label} x={M} y={1520} size={86} c={C.cream} at={2.6} seed={360} dur={0.7} />
    </Canvas>
  );
};

// ------------------------------------------------------------------ number

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const full = 820;
  const ground = rect(-20, -20, W + 40, H + 40);
  return (
    <Canvas ground={C.gold}>
      <Plane poly={ground} base={C.gold} at={0} strokes={knives(ground, { r: 60, angle: -6, seed: 401, paint: skyPaint([[0, C.peach], [700, C.gold], [1400, C.peach]], 3) })} />
      <PaintedText text={`${n.value.toFixed(n.decimals)}${n.unit}`} x={M - 10} y={640} size={T.number} c={C.ultramarine} c2={C.cobalt} at={0.3} seed={410} />
      <Crisp lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} x={M} y={780} at={1.2} col={C.dark} />
      <Crisp lines={["blue · 450 nm"]} x={M} y={980} at={1.5} col={C.dark} />
      <SolidPlane poly={rect(M, 1010, full, 110)} c={C.cobalt} c2={C.turquoise} r={30} angle={0} at={1.6} seed={420} sweepDur={0.6} />
      <Crisp lines={["red · 700 nm"]} x={M} y={1210} at={2.1} col={C.dark} />
      <SolidPlane poly={rect(M, 1240, full / n.value, 110)} c={C.red} c2={C.orange} r={30} angle={0} at={2.2} seed={430} sweepDur={0.3} />
    </Canvas>
  );
};

// ------------------------------------------------------------------ list

const List: React.FC = () => {
  const rows = [560, 960, 1360];
  const ix = 210;
  const ground = rect(-20, -20, W + 40, H + 40);
  const mol: Pt[] = [
    [ix - 34, rows[1] + 6],
    [ix + 34, rows[1] - 6],
  ];
  return (
    <Canvas ground={C.umber}>
      <Plane poly={ground} base={C.umber} at={0} strokes={knives(ground, { r: 64, angle: 8, seed: 501, paint: () => [C.umber, C.dark] })} />
      <Plane poly={ellipse(ix, rows[0], 92)} base={C.gold} at={0.2} strokes={knives(ellipse(ix, rows[0], 92), { r: 22, angle: 25, seed: 510, paint: spherePaint(ix, rows[0], 92, C.cream, C.gold, C.orange) })} />
      {mol.map(([x, y], i) => (
        <Plane key={i} poly={ellipse(x, y, 54)} base={C.ochre} at={0.9 + i * 0.1} strokes={knives(ellipse(x, y, 54), { r: 16, angle: -30, seed: 520 + i, paint: spherePaint(x, y, 54, C.cream, C.ochre, C.rose) })} />
      ))}
      {[-70, 10, 90, 170, 240].map((d, i) => {
        const a = (d * Math.PI) / 180;
        return <SolidPlane key={i} poly={wedge([ix, rows[1]], a, 64, 9, 16, 104)} c={i % 2 ? C.turquoise : C.cobalt} c2={C.cobalt} r={14} angle={d} at={1.3 + i * 0.05} seed={530 + i} sweepDur={0.2} />;
      })}
      <SolidPlane poly={[...ellipse(ix, rows[2] + 40, 120, 120, 40).filter((p) => p[1] <= rows[2] + 40)]} c={C.cobalt} c2={C.cobaltSky} r={22} angle={0} at={1.8} seed={540} />
      <SolidPlane poly={rect(ix - 140, rows[2] + 40, 280, 34)} c={C.gold} c2={C.peach} r={14} angle={0} at={2.0} seed={541} />
      {SAMPLE.list.map((s, i) => (
        <Crisp key={i} lines={wrap(s, 16)} x={380} y={rows[i] - 18} at={0.4 + i * 0.7} size={56} />
      ))}
    </Canvas>
  );
};

// ------------------------------------------------------------------ end: the deep ultramarine end card over dark rooftops

const End: React.FC = () => {
  const ground = rect(-20, -20, W + 40, H + 40);
  const roofs: Pt[] = [
    [-20, 1560],
    [180, 1500],
    [330, 1540],
    [330, 1590],
    [560, 1590],
    [560, 1520],
    [760, 1470],
    [960, 1530],
    [1100, 1510],
    [1100, 1940],
    [-20, 1940],
  ];
  const size = 168;
  return (
    <Canvas ground={C.ultramarine}>
      <Plane poly={ground} base={C.ultramarine} at={0} strokes={knives(ground, { r: 62, angle: -4, seed: 601, paint: skyPaint([[0, C.ultramarine], [900, mix(C.ultramarine, C.cobaltSky, 0.5)], [1350, C.cobaltSky]], 9) })} />
      <SolidPlane poly={roofs} c={C.dark} c2={C.umber} r={40} angle={0} at={0.2} seed={602} />
      {[
        [90, 1640],
        [420, 1660],
        [640, 1610],
        [860, 1650],
      ].map(([x, y], i) => (
        <SolidPlane key={i} poly={rect(x, y, 70, 96)} c={C.gold} c2={C.yellow} r={14} angle={90} at={0.6 + i * 0.1} seed={610 + i} />
      ))}
      <PaintedText text={plainOf(SAMPLE.end.line)} x={W / 2} y={860} size={size} c={C.cream} at={0.4} anchor="middle" seed={620} />
      <PaintedText text={emOf(SAMPLE.end.line)} x={W / 2} y={860 + size} size={size} c={C.gold} c2={C.yellow} at={0.9} anchor="middle" seed={621} />
      <Crisp lines={[SAMPLE.end.cta]} x={W / 2} y={1170} at={1.6} anchor="middle" />
    </Canvas>
  );
};

const E_PLANE = S.elements.knife.plane;

export const samples: Sample[] = [
  { id: "title", duration: 4.4, hero: 3.9, component: Title },
  { id: "headline", duration: 3.6, hero: 3.0, component: HeadlineSample },
  { id: "diagram", duration: 4.0, hero: 3.5, component: Diagram },
  { id: "number", duration: 3.4, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.9, component: List },
  { id: "end", duration: 3.2, hero: 2.6, component: End },
];

