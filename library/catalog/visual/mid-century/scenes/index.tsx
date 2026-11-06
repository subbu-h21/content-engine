/**
 * Mid-century on the shared sample content, as a how-to card with one ground per scene: the hook on mustard with the
 * presenter pointing up, sunlight parted into six colours in a round call-out, the scattering shown as a crisp diagram
 * with detail tags, the number landing on the picture with two bars at true length, the three steps as a lockup of
 * medallions, and the last line in an iris of mustard on plum.
 */
import React from "react";
import { plain, SAMPLE, wrap, type Sample } from "../../kit";
import { boomerang, burst, C, CallOut, Caps, Card, Cel, circle, ease, Kicker, kidney, Line, M, Medallion, pop, Presenter, Rays, Room, S, Slab, Sparkle, T, useT, W } from "./parts";

const COLOURS = [C.coral, "#ee9a4d", C.mustard, C.avocado, C.turquoise, C.plum];

const Title: React.FC = () => {
  const t = useT();
  const hand: [number, number] = [560, 960];
  return (
    <Room
      color={C.mustard}
      under={
        <>
          <rect width={W} height={S.layout.floor} fill={C.mustard} />
          <Rays x={1080} y={230} r={1500} p={ease("write", t - 0.1)} fill={C.mustardLight} />
        </>
      }
    >
      <Cel d={boomerang(860, 1190, 1.4, -0.5)} fill={C.coral} seed={3} />
      <Cel d={kidney(880, 340, 0.8, 0.3)} fill={C.turquoise} seed={6} />
      <Sparkle x={930} y={890} r={56} k={pop(t - 1.3)} />
      <Sparkle x={760} y={960} r={34} k={pop(t - 1.4)} />
      <Sparkle x={660} y={1160} r={24} fill={C.ink} k={pop(t - 1.5)} />
      <Kicker text={plain(SAMPLE.kicker)} x={M} y={340} t={t} at={0.1} />
      <Slab text="Why is" x={M} y={540} k={pop(t - 0.4)} />
      <Slab text="the sky" x={M} y={710} k={pop(t - 0.6)} />
      <Slab text="blue?" x={M} y={880} k={pop(t - 0.8)} plate={C.turquoise} seed={7} />
      <Presenter x={240} y={1278} s={0.72} hand={hand} look={1} />
    </Room>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useT();
  const k = pop(t - 0.8);
  const cx = 610;
  const cy = 1020;
  const r = 310;
  const size = T.display;
  const band = ease("write", t - 1.1);
  return (
    <Room color={C.blue}>
      <Slab text="Sunlight carries" x={M} y={370} size={size} k={pop(t - 0.1)} />
      <Slab text="every colour" x={M} y={370 + size * T.leading} size={size} k={pop(t - 0.25)} />
      <Slab text="at once." x={M} y={370 + 2 * size * T.leading} size={size} k={pop(t - 0.4)} plate={C.mustard} seed={5} />
      <Presenter x={170} y={1250} s={0.78} hand={[350, 1000]} look={0} />
      <CallOut id="hl-c" x={cx} y={cy} r={r} k={k} from={[350, 1000]}>
        <path d={`M ${cx - r} ${cy + 18} L ${cx - 60} ${cy - 18} L ${cx - 60} ${cy + 18} L ${cx - r} ${cy + 60} Z`} fill={C.mustard} />
        {COLOURS.map((c, i) => {
          const y0 = cy - 18 + i * 7;
          const y1 = cy - 240 + i * 96;
          const ex = cx - 60 + (r + 120) * band;
          const ey = y0 + (y1 - y0) * band;
          return <path key={i} d={`M ${cx - 60} ${y0} L ${cx - 60} ${y0 + 7} L ${ex} ${ey + 62} L ${ex} ${ey} Z`} fill={c} />;
        })}
        <Cel d={`M ${cx - 70} ${cy - 96} L ${cx + 40} ${cy + 86} L ${cx - 180} ${cy + 86} Z`} fill={C.paper2} seed={13} crisp w={5} />
      </CallOut>
    </Room>
  );
};

const Tag: React.FC<{ text: string; x: number; y: number; k: number; w: number }> = ({ text, x, y, k, w }) => {
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <rect x={x + 5} y={y + 4} width={w} height={72} rx={8} fill={C.mustard} />
      <rect x={x} y={y} width={w} height={72} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={3} />
      <path d={burst(x + 36, y + 36, 7, 18, 8)} fill={C.coral} />
      <Line text={text} x={x + 66} y={y + 50} size={T.label} />
    </g>
  );
};

const Diagram: React.FC = () => {
  const t = useT();
  const cx = 560;
  const cy = 790;
  const r = 400;
  const beam = ease("write", t - 0.5);
  const hit = 1.1;
  const rays = [-2.6, -1.85, -1.05, -0.3, 0.45, 1.25, 2.0, 2.8];
  const sun: [number, number] = [cx - 180, cy - 190];
  return (
    <Room color={C.avocado}>
      <Caps text="HOW IT WORKS" x={M} y={280} size={T.small + 2} />
      <CallOut id="dg-c" x={cx} y={cy} r={r} k={pop(t - 0.1)}>
        <path d={burst(sun[0], sun[1], 74, 118, 14)} fill={C.mustard} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${sun[0] + 60} ${sun[1] + 40} L ${sun[0] + 60 + 190 * beam} ${sun[1] + 40 + 170 * beam} L ${sun[0] + 30 + 190 * beam} ${sun[1] + 80 + 170 * beam} L ${sun[0] + 30} ${sun[1] + 80} Z`} fill={C.mustardLight} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        {rays.map((a, i) => {
          const q = ease("action", t - hit - i * 0.03);
          if (q <= 0) return null;
          const r0 = 118;
          const r1 = r0 + 150 * q;
          return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={C.turquoise} strokeWidth={24} strokeLinecap="round" />;
        })}
        <Cel d={circle(cx - 46, cy, 62)} fill={C.coral} seed={21} crisp />
        <Cel d={circle(cx + 46, cy, 62)} fill={C.coral} seed={22} crisp />
      </CallOut>
      <Tag text={SAMPLE.diagram.object} x={M} y={1232} k={pop(t - 1.6)} w={345} />
      <Tag text={SAMPLE.diagram.label} x={M + 365} y={1232} k={pop(t - 1.8)} w={455} />
      <Card text={SAMPLE.diagram.out} t={t} at={2.1} />
    </Room>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const blue = 860;
  const red = blue / n.value; // true length: 5.9 to 1
  const p = ease("write", t - 0.7);
  return (
    <Room color={C.pink}>
      <Slab text={`${n.value.toFixed(n.decimals)}${n.unit}`} x={M - 8} y={620} size={T.number} plate={C.turquoise} k={pop(t - 0.2)} seed={8} />
      <Caps text="BLUE · 450 NM" x={M} y={820} size={T.small + 2} />
      <Cel d={`M ${M} 850 L ${M + blue * p} 850 L ${M + blue * p} 960 L ${M} 960 Z`} fill={C.turquoise} seed={11} />
      <Caps text="RED · 700 NM" x={M} y={1050} size={T.small + 2} />
      <Cel d={`M ${M} 1080 L ${M + red * p} 1080 L ${M + red * p} 1190 L ${M} 1190 Z`} fill={C.coral} seed={12} />
      <Sparkle x={M + red + 90} y={1135} r={46} fill={C.paper} k={pop(t - 1.5)} />
      <Sparkle x={M + red + 190} y={1110} r={26} fill={C.paper} k={pop(t - 1.6)} />
      <Presenter x={800} y={1278} s={0.72} hand={[620, 1000]} look={-1} />
      <Card text="more scattering for blue than red" t={t} at={1.7} size={T.body - 4} />
    </Room>
  );
};

const List: React.FC = () => {
  const t = useT();
  const ys = [430, 830, 1230];
  const fills = [C.mustard, C.turquoise, C.coral];
  const x = 200;
  const icon = (i: number, y: number) => {
    if (i === 0) return <path d={burst(x, y, 38, 66, 12)} fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />;
    if (i === 1)
      return (
        <g stroke={C.paper} strokeWidth={14} strokeLinecap="round">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
            const a = (k / 8) * Math.PI * 2;
            return <line key={k} x1={x + 30 * Math.cos(a)} y1={y + 30 * Math.sin(a)} x2={x + 68 * Math.cos(a)} y2={y + 68 * Math.sin(a)} />;
          })}
        </g>
      );
    return (
      <g>
        <path d={`M ${x - 68} ${y} Q ${x} ${y - 66} ${x + 68} ${y} Q ${x} ${y + 66} ${x - 68} ${y} Z`} fill={C.paper} stroke={C.ink} strokeWidth={4} />
        <circle cx={x} cy={y} r={24} fill={C.ink} />
      </g>
    );
  };
  return (
    <Room color={C.paper} floor={2100}>
      {SAMPLE.list.map((s, i) => {
        const y = ys[i];
        const at = 0.2 + i * 0.5;
        const lines = wrap(s, 16);
        return (
          <g key={i}>
            <Medallion x={x} y={y} n={i + 1} fill={fills[i]} k={pop(t - at)}>
              {icon(i, y)}
            </Medallion>
            <Caps text={`STEP ${i + 1} OF 3`} x={350} y={y - 72} opacity={Math.min(1, Math.max(0, (t - at - 0.1) / 0.1))} />
            {lines.map((l, j) => (
              <Slab key={j} text={l} x={350} y={y + j * T.step * 1.14} size={T.step} plate={fills[i]} k={pop(t - at - 0.12)} seed={i + 2} />
            ))}
          </g>
        );
      })}
    </Room>
  );
};

const End: React.FC = () => {
  const t = useT();
  const words = plain(SAMPLE.end.line).split(" ");
  const cx = W / 2;
  const cy = 1090;
  const r = 370 * ease("iris", t - 0.2);
  return (
    <Room color={C.plum}>
      <rect width={W} height={1920} fill={C.plum} />
      <Rays x={cx} y={cy} r={1500} fill={C.pink} p={ease("write", t - 0.1)} rot={0.05} />
      <Slab text={`${words[0]} ${words[1]}`} x={cx} y={420} anchor="middle" fill={C.paper} plate={C.coral} k={pop(t - 0.5)} />
      <Slab text={words[2]} x={cx} y={590} anchor="middle" fill={C.paper} plate={C.turquoise} k={pop(t - 0.7)} seed={6} />
      {r > 1 ? <Cel d={circle(cx, cy, r)} fill={C.mustard} seed={51} /> : null}
      <clipPath id="en-iris">
        <circle cx={cx} cy={cy} r={Math.max(1, r)} />
      </clipPath>
      <g clipPath="url(#en-iris)">
        <Presenter x={cx - 40} y={1530} s={1.1} hand={[cx + 170, 830]} look={1} bust />
      </g>
      {r > 1 ? <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.ink} strokeWidth={5} /> : null}
      <Sparkle x={210} y={780} r={46} k={pop(t - 1.2)} />
      <Sparkle x={880} y={760} r={34} k={pop(t - 1.3)} />
      <Kicker text={SAMPLE.end.cta} x={cx} y={1540} t={t} at={1.1} fill={C.paper} anchor="middle" />
    </Room>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.8, hero: 2.5, component: Title },
  { id: "headline", duration: 3.0, hero: 2.7, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.9, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.7, component: NumberSample },
  { id: "list", duration: 2.8, hero: 2.5, component: List },
  { id: "end", duration: 2.8, hero: 2.5, component: End },
];
