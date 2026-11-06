/**
 * Rubber Hose on the shared sample content: the question hopping over a sunburst with the sun waving under it, the sun
 * flinging six patterned ribbons, the sun's beam hitting the startled air molecule, a carnival high striker that rings
 * at the true 5.9 against red's 1, a sing-along card with a bouncing ball, and an iris closing on a wink.
 */
import React from "react";
import { plain, SAMPLE, wrap, type Sample } from "../../kit";
import { Burst, C, Caps, clamp, Cloud, E, ease, Field, Film, Molly, Plate, pop, Script, Sunny, T, twos, useT, W, Wash, H } from "./parts";
import { SC } from "./fonts";

const Title: React.FC = () => {
  const t = useT();
  return (
    <Film>
      <Burst x={W / 2} y={720} t={t} />
      <Script text="Why is" x={W / 2} y={520} t={t} at={0.15} />
      <Script text="the sky" x={W / 2} y={740} t={t} at={0.55} />
      <Script text="blue?" x={W / 2} y={960} t={t} at={0.95} size={T.title + 34} />
      <Sunny id="ti" x={W / 2} y={1215} s={0.74} t={t} pose={{ hands: [[-205, -60], [215, -100]], mouth: "grin", look: [0, -1] }} />
      <Plate lines={[SAMPLE.kicker]} t={t} at={1.3} y={1520} />
    </Film>
  );
};

/** Six ribbons of light, told apart by pattern because the world has no hue. */
const Ribbons: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const p = ease("stretch", t - 0.8);
  const ends: [number, string, string][] = [
    [-420, C.white, "none"],
    [-260, C.mid, "none"],
    [-90, C.paper, "stripes"],
    [90, C.dark, "none"],
    [260, C.white, "dots"],
    [420, C.ink, "none"],
  ];
  const twist = Math.sin(twos(t) * 7) * 12;
  return (
    <g>
      <defs>
        <pattern id="rh-stripe" width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width={26} height={26} fill={C.white} />
          <rect width={13} height={26} fill={C.ink} />
        </pattern>
        <pattern id="rh-dot" width={34} height={34} patternUnits="userSpaceOnUse">
          <rect width={34} height={34} fill={C.white} />
          <circle cx={17} cy={17} r={9} fill={C.ink} />
        </pattern>
      </defs>
      {ends.map(([dx, fill, pat], i) => {
        const ex = x + dx * p;
        const ey = y + 620 * p;
        const w = 34 + 26 * p;
        const f = pat === "stripes" ? "url(#rh-stripe)" : pat === "dots" ? "url(#rh-dot)" : fill;
        const cx = x + dx * 0.5 + (i % 2 ? twist : -twist);
        const cy = y + 340 * p;
        return (
          <path
            key={i}
            d={`M ${x - 18} ${y} Q ${cx - w / 2} ${cy} ${ex - w} ${ey} L ${ex + w} ${ey} Q ${cx + w / 2} ${cy} ${x + 18} ${y} Z`}
            fill={f}
            stroke={C.ink}
            strokeWidth={E.ink}
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useT();
  return (
    <Film>
      <Wash>
        <Field y={1300} />
      </Wash>
      <Cloud x={190} y={330} s={0.8} t={t} />
      <Cloud x={890} y={420} s={0.68} t={t} />
      <Ribbons t={t} x={W / 2} y={620} />
      <Sunny id="hl" x={W / 2} y={560} s={0.9} t={t} pose={{ hands: [[-230, -120], [230, -120]], mouth: "grin", look: [0, 1], feet: [[-120, 130], [120, 130]] }} />
      <Plate lines={["Sunlight carries every", "colour at once."]} t={t} at={1.3} />
    </Film>
  );
};

const Diagram: React.FC = () => {
  const t = useT();
  const hit = 1.0;
  const beam = clamp((t - 0.5) / 0.45);
  const sx = 250;
  const sy = 420;
  const mx = 610;
  const my = 910;
  const after = t - hit;
  const stretch = after < 0 ? 1 : 1 + 0.22 * Math.exp(-after * 5) * Math.cos(after * 18);
  const rays = [-2.4, -1.6, -0.75, 0.05, 0.85, 2.55, 3.15];
  const flags: Record<number, string> = { 2: "BLUE!", 6: "BLUE!" };
  return (
    <Film>
      <Wash fill={C.mid}>
        <Field y={1370} />
      </Wash>
      <Cloud x={880} y={340} s={0.62} t={t} face={false} />
      <path d={`M ${sx + 40} ${sy + 60} L ${sx + 40 + (mx - sx - 90) * beam} ${sy + 60 + (my - sy - 150) * beam} L ${sx + 110 + (mx - sx - 110) * beam} ${sy + 20 + (my - sy - 100) * beam} L ${sx + 110} ${sy + 20} Z`} fill={C.white} stroke={C.ink} strokeWidth={E.ink} strokeLinejoin="round" />
      {rays.map((a, i) => {
        const q = ease("stretch", after - 0.04 * i);
        if (q <= 0) return null;
        const r0 = 200;
        const r1 = r0 + 240 * q;
        const x0 = mx + r0 * Math.cos(a);
        const y0 = my + r0 * 0.9 * Math.sin(a);
        const x1 = mx + r1 * Math.cos(a);
        const y1 = my + r1 * 0.9 * Math.sin(a);
        const nx = -Math.sin(a) * 16;
        const ny = Math.cos(a) * 16;
        const tag = flags[i];
        return (
          <g key={i}>
            <path d={`M ${x0} ${y0} L ${x1 + nx} ${y1 + ny} L ${x1 + Math.cos(a) * 46} ${y1 + Math.sin(a) * 46} L ${x1 - nx} ${y1 - ny} Z`} fill={C.white} stroke={C.ink} strokeWidth={E.ink} strokeLinejoin="round" />
            {tag ? <Caps text={tag} x={Math.min(900, Math.max(180, x1 + Math.cos(a) * 22))} y={y1 + 74} size={T.label + 6} /> : null}
          </g>
        );
      })}
      <Sunny id="dg" x={sx} y={sy} s={0.8} t={t} pose={{ hands: [[-230, -130], [230, 130]], gloves: ["open", "point"], mouth: "smile", look: [1, 1], feet: [[-70, 200], [50, 210]] }} />
      <Molly id="dgm" x={mx} y={my + 30} s={0.92} t={t} stretch={stretch} pose={{ hands: [[-280, -60], [280, -70]], mouth: after > 0 ? "o" : "smile", look: [-0.6, -0.8] }} />
      <Plate lines={[`${SAMPLE.diagram.object}:`, SAMPLE.diagram.label]} t={t} at={1.6} />
    </Film>
  );
};

const Striker: React.FC<{ x: number; base: number; unit: number; value: number; max: number; t: number; at: number; label: string; bell?: boolean }> = ({ x, base, unit, value, max, t, at, label, bell }) => {
  const p = ease("stretch", t - at);
  const py = base - value * unit * Math.min(1, p);
  const top = base - max * unit;
  return (
    <g>
      <rect x={x - 42} y={top} width={84} height={base - top} fill={C.white} stroke={C.ink} strokeWidth={E.ink} />
      {Array.from({ length: max }, (_, i) => (
        <g key={i}>
          <line x1={x - 42} y1={base - (i + 1) * unit} x2={x + 42} y2={base - (i + 1) * unit} stroke={C.ink} strokeWidth={4} />
          <text x={x} y={base - (i + 0.5) * unit + 14} fontFamily={SC} fontSize={40} textAnchor="middle" fill={C.ink}>
            {i + 1}
          </text>
        </g>
      ))}
      <rect x={x - 62} y={py - 12} width={124} height={24} rx={8} fill={C.ink} />
      <rect x={x - 106} y={base} width={212} height={40} fill={C.dark} stroke={C.ink} strokeWidth={E.ink} />
      <Caps text={label} x={x} y={base + 112} size={T.sub - 4} />
      {bell ? <path d={`M ${x - 54} ${top - 8} Q ${x - 40} ${top - 94} ${x} ${top - 94} Q ${x + 40} ${top - 94} ${x + 54} ${top - 8} Z`} fill={C.white} stroke={C.ink} strokeWidth={E.ink} strokeLinejoin="round" /> : null}
    </g>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const unit = 120;
  const base = 1170;
  const x1 = 400;
  const x2 = 790;
  const ring = t > 1.2 ? Math.max(0, 1 - (t - 1.2) * 0.5) : 0;
  const top = base - 6 * unit - 60;
  return (
    <Film>
      <Burst x={x1} y={top} t={t} />
      <Striker x={x1} base={base} unit={unit} value={n.value} max={6} t={t} at={0.7} label="BLUE" bell />
      <Striker x={x2} base={base} unit={unit} value={1} max={3} t={t} at={0.9} label="RED" />
      {[-1.1, -0.75, -0.4].map((a, i) => (
        <line key={i} x1={x1 + 90 * Math.cos(a)} y1={top + 90 * Math.sin(a)} x2={x1 + (150 + ring * 40) * Math.cos(a)} y2={top + (150 + ring * 40) * Math.sin(a)} stroke={C.ink} strokeWidth={9} strokeLinecap="round" opacity={t > 1.2 ? 1 : 0} />
      ))}
      <Script text={`${n.value.toFixed(n.decimals)}${n.unit}`} x={745} y={560} size={T.number - 40} t={t} at={1.25} hop={14} />
      <Molly id="nm" x={200} y={1020} s={0.5} t={t} pose={{ hands: [[100, -200], [270, -120]], mouth: "grin", look: [1, -1], gloves: ["open", "fist"] }} />
      <Plate lines={["More scattering for blue", "(450 nm) than red (700 nm)"]} t={t} at={1.6} />
    </Film>
  );
};

const List: React.FC = () => {
  const t = useT();
  const size = T.display - 74;
  const lines = SAMPLE.list.flatMap((s, i) => wrap(s, 17).map((l, j) => ({ text: l, step: i, first: j === 0 })));
  const gap = 118;
  const y0 = 520;
  const beat = 0.5;
  const at = clamp(t / (lines.length * beat)) * lines.length;
  const cur = Math.min(lines.length - 1, Math.floor(at));
  const f = at - cur;
  const start = 180;
  const span = 720;
  const bx = start + f * span;
  const hop = Math.abs(Math.sin(f * Math.PI * 2));
  const by = y0 + cur * gap - 66 - hop * 56;
  return (
    <Film>
      <Wash fill={C.dark} />
      <rect x={72} y={300} width={W - 144} height={1020} fill={C.plate} stroke={C.white} strokeWidth={5} />
      <rect x={90} y={318} width={W - 180} height={984} fill="none" stroke={C.white} strokeWidth={2} />
      <Caps text="ALL TOGETHER NOW" x={W / 2} y={420} size={T.sub - 6} stroke={false} />
      {lines.map((l, i) => (
        <text key={i} x={140} y={y0 + i * gap + 24} fontFamily={SC} fontSize={size + 8} fill={i <= cur ? C.white : C.mid}>
          {l.first ? `${l.step + 1}. ` : "    "}
          {l.text}
        </text>
      ))}
      <g transform={`translate(${bx} ${by})`}>
        <circle r={34} fill={C.white} stroke={C.ink} strokeWidth={4} />
        <circle cx={-10} cy={-4} r={5} fill={C.ink} />
        <circle cx={10} cy={-4} r={5} fill={C.ink} />
      </g>
      <Sunny id="ls" x={840} y={1400} s={0.56} t={t} pose={{ hands: [[-230, -90], [200, -180]], mouth: "grin", look: [-1, -1], gloves: ["point", "open"] }} />
    </Film>
  );
};

/** A wavy-edged sign. */
const Sign: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => {
  const n = 10;
  const edge = (a: [number, number], b: [number, number]) => {
    let d = "";
    for (let i = 1; i <= n; i++) {
      const px = a[0] + ((b[0] - a[0]) * i) / n;
      const py = a[1] + ((b[1] - a[1]) * i) / n;
      const nx = (-(b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1])) * 12;
      const ny = ((b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1])) * 12;
      const mx = a[0] + ((b[0] - a[0]) * (i - 0.5)) / n + nx * (i % 2 ? 1 : -1);
      const my = a[1] + ((b[1] - a[1]) * (i - 0.5)) / n + ny * (i % 2 ? 1 : -1);
      d += ` Q ${mx} ${my} ${px} ${py}`;
    }
    return d;
  };
  const tl: [number, number] = [x - w / 2, y - h / 2];
  const tr: [number, number] = [x + w / 2, y - h / 2];
  const br: [number, number] = [x + w / 2, y + h / 2];
  const bl: [number, number] = [x - w / 2, y + h / 2];
  return (
    <g>
      <path d={`M ${tl[0]} ${tl[1]}${edge(tl, tr)}${edge(tr, br)}${edge(br, bl)}${edge(bl, tl)} Z`} fill={C.white} stroke={C.ink} strokeWidth={E.ink + 2} strokeLinejoin="round" />
      {children}
    </g>
  );
};

const End: React.FC = () => {
  const t = useT();
  const ws = plain(SAMPLE.end.line).split(" ");
  const cx = W / 2;
  const cy = 800;
  const r = 1400 - 880 * ease("iris", t - 1.0);
  const grow = pop(t - 0.2);
  return (
    <Film>
      <Burst x={cx} y={cy} t={t} />
      <Cloud x={200} y={440} s={0.5} t={t} />
      <g transform={`translate(${cx} ${620}) scale(${grow}) translate(${-cx} ${-620})`}>
        <Sign x={cx} y={620} w={760} h={340}>
          {null}
        </Sign>
        <Script text={`${ws[0]} ${ws[1]}`} x={cx} y={608} size={T.display - 18} t={t} at={0.3} hop={10} />
        <Script text={ws[2]} x={cx} y={734} size={T.display - 18} t={t} at={0.6} hop={10} />
      </g>
      <Sunny id="en" x={cx} y={1010} s={0.68} t={t} pose={{ hands: [[-160, -240], [160, -240]], mouth: "grin", look: [0, -1], wink: t > 1.5, gloves: ["fist", "fist"] }} />
      <path fillRule="evenodd" d={`M 0 0 H ${W} V ${H} H 0 Z M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`} fill={C.ink} />
      {t > 1.9 ? <Caps text={SAMPLE.end.cta.toUpperCase()} x={cx} y={1440} size={T.sub} stroke={false} /> : null}
    </Film>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.65, component: Title },
  { id: "headline", duration: 3.0, hero: 2.65, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.85, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.75, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.3, component: List },
  { id: "end", duration: 3.0, hero: 2.7, component: End },
];
