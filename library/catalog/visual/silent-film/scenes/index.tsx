/**
 * Silent Film on the shared sample content: the main title card, a narration card, an engraved lantern-slide picture of
 * the sun and an air molecule with its scattered rays hand-tinted (the one colour), a shouting card for the number, the
 * steps on a narration card, and a figure on a hill under a tinted sky closing in an iris on a tender end card.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { plain, SAMPLE, seeded, wrap, type Sample } from "../../kit";
import { C, Card, crank, E, ease, Figure, G, Iris, Italic, Print, Small, T, tone, useT, Vines, Wash } from "./parts";

const cx = G.w / 2;

const Title: React.FC = () => (
  <Print section="card">
    <Card level={1}>
      <Italic text={SAMPLE.kicker} y={330} size={T.body + 8} />
      <path d={`M ${cx - 120} 380 L ${cx + 120} 380`} stroke={C.type} strokeWidth={2.2} />
      <Small text="Why is" y={590} />
      <Small text="the sky" y={760} />
      <Small text="blue?" y={930} size={T.title + 34} />
      <path d={`M ${cx - 120} 1020 L ${cx + 120} 1020`} stroke={C.type} strokeWidth={2.2} />
    </Card>
  </Print>
);

const HeadlineSample: React.FC = () => (
  <Print section="card">
    <Card level={1}>
      <Italic text={plain(SAMPLE.headline[0])} y={510} size={T.narration + 14} />
      <Italic text="every colour" y={660} size={T.narration + 14} />
      <Italic text="at once." y={810} size={T.narration + 14} />
    </Card>
  </Print>
);

const Rays: React.FC<{ x: number; y: number; r0: number; r1: number; n?: number; L?: number; w?: number; rot?: number }> = ({ x, y, r0, r1, n = 16, L = 0.1, w = 4, rot = 0 }) => (
  <g stroke={tone(L)} strokeWidth={w} strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const a = rot + (i / n) * Math.PI * 2;
      return <line key={i} x1={x + r0 * Math.cos(a)} y1={y + r0 * Math.sin(a)} x2={x + (i % 2 ? r1 : r1 * 0.8) * Math.cos(a)} y2={y + (i % 2 ? r1 : r1 * 0.8) * Math.sin(a)} />;
    })}
  </g>
);

const Hill: React.FC<{ y: number }> = ({ y }) => (
  <>
    <Wash d={`M -10 ${y} Q 280 ${y - 110} 520 ${y - 30} T 980 ${y - 60} L 980 ${G.h + 10} L -10 ${G.h + 10} Z`} L={0.42} />
    <Wash d={`M -10 ${y + 120} Q 320 ${y + 20} 640 ${y + 110} T 980 ${y + 90} L 980 ${G.h + 10} L -10 ${G.h + 10} Z`} L={0.26} />
  </>
);

const Diagram: React.FC = () => {
  const t = crank(useT());
  const open = ease("iris", t);
  const mol = { x: 500, y: 590 };
  const sun = { x: 210, y: 230 };
  const scat = ease("pose", t - 1.2);
  const dirs = [-2.7, -1.9, -1.2, -0.5, 0.25, 1.0, 2.2, 3.0];
  return (
    <Print section="tender">
      <rect width={G.w} height={G.h} fill={tone(0.86)} />
      <Hill y={1040} />
      <Rays x={sun.x} y={sun.y} r0={104} r1={176} n={20} L={0.12} />
      <circle cx={sun.x} cy={sun.y} r={92} fill={tone(0.93)} stroke={tone(0.07)} strokeWidth={E.contour} />
      <circle cx={sun.x} cy={sun.y} r={92} fill="url(#sf-h1)" opacity={0.3} />
      <path d={`M ${sun.x + 76} ${sun.y + 82} L ${mol.x - 70} ${mol.y - 66} M ${sun.x + 96} ${sun.y + 60} L ${mol.x - 50} ${mol.y - 86}`} stroke={tone(0.12)} strokeWidth={5} strokeDasharray="30 12" />
      {dirs.map((a, i) => (
        <g key={i} opacity={scat}>
          <line x1={mol.x + 118 * Math.cos(a)} y1={mol.y + 118 * Math.sin(a)} x2={mol.x + (118 + 210 * scat) * Math.cos(a)} y2={mol.y + (118 + 210 * scat) * Math.sin(a)} stroke={C.blue} strokeWidth={14} strokeLinecap="round" />
        </g>
      ))}
      <Wash d={`M ${mol.x - 150} ${mol.y} a 76 76 0 1 0 152 0 a 76 76 0 1 0 -152 0 Z`} L={0.5} />
      <Wash d={`M ${mol.x - 4} ${mol.y} a 76 76 0 1 0 152 0 a 76 76 0 1 0 -152 0 Z`} L={0.4} />
      <Figure x={770} y={1022} s={0.6} look={-1} />
      <Iris x={cx} y={560} r={150 + 620 * open} />
      <rect y={G.h - 240} width={G.w} height={240} fill={tone(0.055)} />
      <Italic text="The air molecule" y={G.h - 142} size={T.body + 4} />
      <Italic text="scatters blue light." y={G.h - 72} size={T.body + 4} />
    </Print>
  );
};

const NumberSample: React.FC = () => {
  const frame = useCurrentFrame();
  const n = SAMPLE.number;
  const r = seeded(frame * 37 + 5);
  const sh = 0.35 * 8;
  const dx = (r() - 0.5) * sh * 2;
  const dy = (r() - 0.5) * sh * 2;
  return (
    <Print section="shout">
      <Card level={0}>
        <Small text={`${n.value.toFixed(n.decimals)}${n.unit}`} y={560} size={T.number} dx={dx} dy={dy} />
        <Small text="More scattering" y={760} size={T.shout + 6} dx={-dy} dy={dx} />
        <Small text="for blue" y={860} size={T.shout + 6} dx={dy} dy={-dx} />
        <Italic text="(450 nm)" y={950} size={T.body + 4} />
        <Italic text="than red (700 nm)" y={1030} size={T.body + 4} />
      </Card>
    </Print>
  );
};

const List: React.FC = () => {
  const nums = ["I.", "II.", "III."];
  let y = 300;
  return (
    <Print section="card">
      <Card level={1}>
        {SAMPLE.list.map((s, i) => {
          const lines = wrap(s, 15);
          const top = y;
          y += lines.length * 84 + 96;
          return (
            <g key={i}>
              <Small text={nums[i]} y={top} size={T.credit + 8} weight={700} />
              {lines.map((l, j) => (
                <Italic key={j} text={l} y={top + 84 + j * 84} size={T.narration - 16} />
              ))}
            </g>
          );
        })}
      </Card>
    </Print>
  );
};

const End: React.FC = () => {
  const t = crank(useT());
  const close = ease("iris", t - 0.2);
  const r = 900 - 520 * close;
  const iy = 500;
  const ws = plain(SAMPLE.end.line).split(" ");
  return (
    <Print section="tender">
      <rect width={G.w} height={1000} fill={tone(0.8)} />
      <rect width={G.w} height={720} fill={C.blue} opacity={0.82} />
      <Hill y={700} />
      <Figure x={cx - 20} y={800} s={0.72} look={0} />
      <Iris x={cx} y={iy} r={r} />
      <Vines />
      <Small text={`${ws[0]} ${ws[1]} ${ws[2]}`} y={1040} size={T.end - 12} />
      <Italic text={SAMPLE.end.cta} y={1130} size={T.credit + 10} />
    </Print>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.8, hero: 2.2, component: Title },
  { id: "headline", duration: 2.8, hero: 2.2, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.8, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.2, component: NumberSample },
  { id: "list", duration: 2.8, hero: 2.2, component: List },
  { id: "end", duration: 3.0, hero: 2.7, component: End },
];
