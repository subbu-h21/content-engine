/** Halftone Dossier on the shared sample content: the case of the blue sky, one exhibit per sample. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Bubble, C, Caption, Dots, edge, ease, H, Hud, M, MonoLine, Page, PopText, radial, ramp, Rays, S, Stamp, starburst, Suspect, W } from "./parts";
import { FAT, MONO, SLAB } from "./fonts";

const T = S.type;
const R_SHAKE = S.motion.recipes.shake;
const lead = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");

const Title: React.FC = () => (
  <Page ground="blue">
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <g style={{ mixBlendMode: "multiply" }}>
        <Rays cx={540} cy={1000} r={1400} col={C.navy} opacity={0.22} />
      </g>
      <Dots dens={radial(540, 1000, 620, 1.1)} col={C.cream} angle={15} blend="normal" opacity={0.55} />
      <path d={starburst(540, 990, 250, 330)} fill={C.pink} />
    </svg>
    <MonoLine text={`CASE FILE · ${SAMPLE.kicker.toUpperCase()}`} y={300} at={0.1} col={C.cream} align="center" />
    <PopText lines={[lead(SAMPLE.title)]} y={600} size={T.title} at={0.2} col={C.cream} align="center" />
    <PopText lines={[em(SAMPLE.title).toUpperCase()]} y={1105} size={T.titleWord} at={0.7} font={FAT} col={C.yellow} stroke={C.navy} strokeW={20} shadow={C.navy} align="center" fall />
  </Page>
);

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const sun = { x: 540, y: 1060, r: 150 };
  const inks = [C.yellow, C.pink, C.red, C.blue, C.navy];
  const t = useSeconds();
  const card = ease("pop", t - 1.0);
  return (
    <Page>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Dots dens={edge(160, 1.8)} col={C.blue} angle={15} />
      </svg>
      <Hud count="COUNT 01" title="the science" clock={3} />
      <PopText lines={[l1, lead(l2), `*${em(l2)}*`]} y={460} size={T.display} at={0.15} emCol={C.blue} />
      {/* exhibit A: a pinned evidence card with a halftone sun and rays in every ink */}
      <div style={{ position: "absolute", left: 130, top: 790, width: 820, height: 560, transform: `rotate(-3deg) scale(${card})`, transformOrigin: "50% 0%" }}>
        <svg width={820} height={560} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={0} y={0} width={820} height={560} rx={10} fill={C.cream} stroke={C.navy} strokeWidth={6} />
          <defs>
            <clipPath id="hd-sun">
              <circle cx={sun.x - 130} cy={sun.y - 790} r={sun.r} />
            </clipPath>
          </defs>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
            const cx = sun.x - 130;
            const cy = sun.y - 790;
            return (
              <line key={i} x1={cx + Math.cos(a) * (sun.r + 26)} y1={cy + Math.sin(a) * (sun.r + 26)} x2={cx + Math.cos(a) * (sun.r + 92)} y2={cy + Math.sin(a) * (sun.r + 92)} stroke={inks[i % 5]} strokeWidth={30} strokeLinecap="round" />
            );
          })}
          <circle cx={sun.x - 130} cy={sun.y - 790} r={sun.r} fill={C.yellow} stroke={C.navy} strokeWidth={7} />
          <Dots box={[sun.x - 130 - sun.r, sun.y - 790 - sun.r, sun.x - 130 + sun.r, sun.y - 790 + sun.r]} dens={radial(sun.x - 130 + 70, sun.y - 790 + 80, 230, 0.8)} col={C.pink} angle={20} step={18} clip="url(#hd-sun)" />
          <circle cx={410} cy={-6} r={18} fill={C.red} stroke={C.navy} strokeWidth={5} />
        </svg>
        <div style={{ position: "absolute", left: 28, top: 22, fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: C.navy }}>EXHIBIT A</div>
        <div style={{ position: "absolute", right: 28, top: 22, fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: C.navy }}>SUNLIGHT</div>
      </div>
      <Caption text="White sunlight holds *every colour.*" at={1.6} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const [cx, cy, r] = [540, 860, 140];
  const t = useSeconds();
  const plate = ease("pop", t - 1.0);
  const d = SAMPLE.diagram;
  return (
    <Page>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* the mugshot height chart */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={M} y1={560 + i * 50} x2={W - M} y2={560 + i * 50} stroke={C.navy} strokeWidth={i % 3 === 0 ? 6 : 3} opacity={0.85} />
        ))}
        <Dots box={[0, 520, W, 1260]} dens={radial(cx, cy, 440, 0.9)} col={C.blue} angle={45} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 8 + 0.4;
          const p = ease("pop", t - 0.9 - i * 0.03);
          if (p <= 0) return null;
          return (
            <line key={i} x1={cx + Math.cos(a) * (r * 1.9)} y1={cy + Math.sin(a) * (r * 1.55)} x2={cx + Math.cos(a) * (r * (1.9 + 0.55 * p))} y2={cy + Math.sin(a) * (r * (1.55 + 0.5 * p))} stroke={C.blue} strokeWidth={14} strokeLinecap="round" />
          );
        })}
        <Suspect cx={cx} cy={cy} r={r} at={0.2} />
      </svg>
      <Hud count="COUNT 02" title="the suspect" clock={6} />
      <div style={{ position: "absolute", left: 200, top: 1090, width: 680, height: 170, backgroundColor: C.navy, borderRadius: 8, transform: `scale(${plate})`, boxShadow: `8px 8px 0 ${C.pink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ fontFamily: SLAB, fontSize: 60, color: C.cream, lineHeight: 1 }}>{d.object.toUpperCase()}</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: C.yellow }}>CHARGE: {d.label.toUpperCase()}</div>
      </div>
      <Bubble text={`${d.out}!`} x={250} y={400} w={720} to={[cx + 70, cy - r - 10]} at={1.6} size={38} />
      <Caption text={SAMPLE.body.replace("blue", "*blue*")} at={2.0} y={1380} size={34} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const t = useSeconds();
  const p = ease("pop", t - 0.5);
  const size = T.number;
  const value = n.value.toFixed(n.decimals);
  return (
    <Page hits={[{ at: 1.5, px: R_SHAKE.first }]}>
      <Hud count="COUNT 03" title="the evidence" clock={9} />
      <PopText lines={["Blue scatters"]} y={450} size={T.display} at={0.1} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${p})`, transformOrigin: "60% 70%" }}>
        <defs>
          <clipPath id="hd-num">
            <text x={50} y={1150} style={{ fontFamily: FAT, fontSize: size }}>
              {value}
            </text>
          </clipPath>
        </defs>
        <text x={50} y={1150} fill={C.yellow} stroke={C.navy} strokeWidth={22} strokeLinejoin="round" style={{ fontFamily: FAT, fontSize: size, paintOrder: "stroke fill" }}>
          {value}
        </text>
        <Dots box={[0, 600, W, 1200]} dens={ramp(620, 1150)} col={C.pink} angle={20} step={20} clip="url(#hd-num)" />
      </svg>
      <PopText lines={[`*${n.unit}* more than red`]} y={1300} size={72} at={0.9} emCol={C.pink} />
      <Stamp lines={["Confirmed"]} cx={790} cy={600} at={1.5} rotate={-9} size={64} />
      <Caption text="*Blue* 450 nm vs red 700 nm" at={1.9} />
    </Page>
  );
};
const List: React.FC = () => {
  const ys = [560, 860, 1160];
  return (
    <Page hits={[{ at: 2.0, px: R_SHAKE.small }]}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Dots dens={edge(160, 1.8)} col={C.pink} angle={30} />
      </svg>
      <Hud count="SUMMARY" title="3 counts" clock={12} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.2 + i * 0.45;
        const ws = item.split(" ");
        const half = Math.ceil(ws.length / 2);
        return (
          <React.Fragment key={i}>
            <PopText lines={[String(i + 1)]} x={M} y={ys[i] + 60} size={190} at={at} font={FAT} col={C.yellow} stroke={C.navy} strokeW={14} shadow={C.pink} />
            <MonoLine text={`COUNT 0${i + 1}`} x={300} y={ys[i] - 56} at={at} />
            <PopText lines={[ws.slice(0, half).join(" "), ws.slice(half).join(" ")]} x={300} y={ys[i] + 24} size={T.step} at={at + 0.1} shadow={false} />
          </React.Fragment>
        );
      })}
      <Stamp lines={["Proven"]} cx={760} cy={1420} at={2.0} rotate={7} size={84} seed={5} />
    </Page>
  );
};

const End: React.FC = () => {
  const [mx, my, mr] = [540, 640, 150];
  return (
    <Page ground="night" hits={[{ at: 1.4, px: R_SHAKE.verdict }]}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Dots dens={radial(mx, my, 760, 1)} col={C.night2} angle={45} blend="normal" />
        <defs>
          <clipPath id="hd-moon">
            <path d={`M ${mx - mr} ${my} a ${mr} ${mr} 0 1 0 ${2 * mr} 0 a ${mr} ${mr} 0 1 0 ${-2 * mr} 0 Z`} />
          </clipPath>
        </defs>
        <path d={`M ${mx + 40} ${my - mr} A ${mr} ${mr} 0 1 0 ${mx + 40} ${my + mr} A ${mr * 0.78} ${mr * 0.95} 0 1 1 ${mx + 40} ${my - mr} Z`} fill={C.cream} stroke={C.cream} strokeWidth={2} />
        <Dots box={[mx - mr - 20, my - mr - 20, mx + mr + 20, my + mr + 20]} dens={radial(mx - 60, my + 40, 220, 1)} col={C.yellow} angle={20} step={18} clip="url(#hd-moon)" />
      </svg>
      <Hud count="VERDICT" title="case closed" clock={16} dark />
      <PopText lines={[plain(SAMPLE.end.line).replace("again.", "*again.*")]} y={1040} size={T.display + 16} at={0.2} col={C.cream} emCol={C.yellow} align="center" />
      <Stamp lines={["Case closed"]} cx={540} cy={1270} at={1.4} rotate={6} size={100} seed={9} />
      <MonoLine text={SAMPLE.end.cta.toUpperCase()} y={1500} at={1.9} col={C.cream} align="center" />
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.6, component: Title },
  { id: "headline", duration: 3.2, hero: 2.8, component: Headline },
  { id: "diagram", duration: 3.4, hero: 3.0, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.8, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
