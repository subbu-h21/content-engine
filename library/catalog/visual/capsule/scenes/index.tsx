/** Capsule on the shared sample content: a pill cover, a spectrum of capsules, an orbit, a stat pill, stacked capsule rows, a closer. */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { DISPLAY } from "./fonts";
import { AccentLine, type Bit, Bodoni, Body, C, type Candy, Capsule, Confetti, COL, ease, Ground, LabelPill, M, Node, PillText, S, Track, W } from "./parts";

const T = S.type;
const E = S.elements;
const TOP = S.layout.safe.top + 10;
const n = SAMPLE.number;

const coverBits: Bit[] = [
  [800, 236, 330, 84, 14, "lavender"],
  [-70, 262, 270, 76, -16, "mint"],
  [70, 1136, 340, 100, -12, "coral"],
  [540, 1110, 300, 92, 10, "mint"],
  [810, 1262, 330, 96, 24, "lime"],
  [220, 1300, 290, 88, 16, "sky"],
  [-70, 1440, 330, 100, -22, "yellow"],
  [440, 1450, 340, 104, -8, "lavender"],
  [790, 1560, 320, 92, 14, "peach"],
  [130, 1640, 300, 92, 9, "violet"],
  [520, 1690, 360, 104, -14, "coral"],
];

const Title: React.FC = () => (
  <Ground glows={[[160, 520, 620, "coral", 0.13], [930, 980, 640, "sky", 0.15], [420, 1500, 560, "lime", 0.12]]} leave={3.05}>
    <Confetti bits={coverBits} at={0.7} origin={[W / 2, 760]} />
    <LabelPill text={SAMPLE.kicker} y={TOP} at={0.15} />
    <AccentLine y={TOP + 100} at={0.35} />
    <Bodoni lines={wrap(SAMPLE.title, 7)} y={372} size={T.display} at={0.4} pill={C.sky} leading={1.02} />
  </Ground>
);

const headBits: Bit[] = [
  [-60, 1600, 320, 96, -12, "coral"],
  [340, 1640, 300, 92, 9, "mint"],
  [700, 1590, 340, 100, -14, "lavender"],
];

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const lines = [...wrap(l1, 10), ...wrap(l2, 12)];
  const bands: [number, Candy][] = [
    [810, "violet"],
    [960, "sky"],
    [860, "mint"],
    [720, "lime"],
    [900, "yellow"],
    [780, "peach"],
    [980, "coral"],
  ];
  const y0 = 900;
  const bh = 50;
  const gap = 8;
  return (
    <Ground glows={[[920, 460, 600, "lavender", 0.15], [120, 1040, 560, "peach", 0.14]]} leave={3.05}>
      <LabelPill text={SAMPLE.chapter} x={M} y={TOP} at={0.1} fill={C.lavender} />
      <Bodoni lines={lines} align="left" y={356} size={T.headline} at={0.25} weight={700} leading={1.02} pill={C.lime} tracking={-0.02} />
      {bands.map(([w, candy], i) => (
        <Capsule key={candy} x={W - w + 60} y={y0 + i * (bh + gap)} w={w} h={bh} at={1.0 + i * S.motion.pillStagger} fill={C[candy]} from="right" />
      ))}
      <Confetti bits={headBits} at={1.7} origin={[W / 2, 1440]} />
      <Capsule x={M - 10} y={1324} w={COL + 20} h={186} at={1.55} radius={E.cardRadius} shadow="card">
        <Body text={SAMPLE.body} x={44} y={38} w={COL - 70} />
      </Capsule>
    </Ground>
  );
};

const diagBits: Bit[] = [
  [-60, 1620, 320, 96, 12, "coral"],
  [360, 1650, 300, 92, -8, "mint"],
  [730, 1600, 340, 100, 14, "peach"],
];

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [cx, cy] = [W / 2, 806];
  const r = 165;
  const orbit = 330;
  const spin = t * S.motion.orbitSpeed;
  const sats = Array.from({ length: 7 }, (_, i) => (360 * i) / 7 + 12);
  const grow = ease("stretch", t - 0.5);
  const [bx0, by0, bx1, by1] = [226, 470, cx - 120, cy - 120];
  const beamL = Math.hypot(bx1 - bx0, by1 - by0);
  const beamA = (Math.atan2(by1 - by0, bx1 - bx0) * 180) / Math.PI;
  const beamX = (bx0 + bx1) / 2 - beamL / 2;
  const beamY = (by0 + by1) / 2 - 22;
  return (
    <Ground glows={[[540, 806, 640, "sky", 0.15], [100, 300, 460, "yellow", 0.13], [980, 1460, 520, "lime", 0.1]]} leave={3.55}>
      <LabelPill text="How it works" y={TOP} at={0.1} fill={C.lavender} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={orbit} fill="none" stroke={C.outline} strokeOpacity={0.3} strokeWidth={E.stroke} strokeDasharray="4 14" strokeLinecap="round" />
      </svg>
      <Capsule x={beamX} y={beamY} w={beamL} h={44} at={0.55} fill={C.yellow} tilt={beamA} from="left" />
      {sats.map((a, i) => {
        const local = t - 1.15 - i * S.motion.pillStagger;
        if (local <= 0) return null;
        const p = ease("scatter", local);
        const rad = ((a + spin) * Math.PI) / 180;
        const rr = lerp2(r * 0.6, orbit, p);
        const [w, h] = [150, 52];
        const x = cx + rr * Math.cos(rad);
        const y = cy + rr * Math.sin(rad);
        return <div key={a} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, boxSizing: "border-box", borderRadius: 9999, border: `${E.stroke}px solid ${C.outline}`, backgroundColor: C.sky, transform: `rotate(${a + spin}deg)` }} />;
      })}
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, boxSizing: "border-box", borderRadius: "50%", border: `${E.stroke}px solid ${C.outline}`, boxShadow: `${E.shadow.frame}px ${E.shadow.frame}px 0 rgba(26,26,26,${E.shadowAlpha})`, backgroundColor: C.lime, transform: `scale(${grow})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: r - 84, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink }}>
          Air
          <br />
          molecule
        </div>
      </div>
      <LabelPill text={d.in} x={96} y={392} at={0.35} fill={C.yellow} tilt={-6} size={30} />
      <Capsule x={M - 10} y={1272} w={COL + 20} h={250} at={1.75} radius={E.cardRadius} shadow="card">
        <Bodoni lines={[d.label]} y={36} size={T.card + 16} at={1.85} align="center" weight={700} tracking={-0.01} leading={1.1} />
        <Body text={d.out} x={0} y={132} w={COL + 20} align="center" size={T.body + 2} weight={500} />
      </Capsule>
      <Confetti bits={diagBits} at={1.95} origin={[W / 2, 1500]} />
    </Ground>
  );
};
const lerp2 = (a: number, b: number, t: number): number => a + (b - a) * t;

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const c = ease("line", (t - 0.4) * 0.6);
  const bits: Bit[] = [
    [-60, 1620, 340, 100, -14, "coral"],
    [330, 1660, 300, 92, 10, "mint"],
    [700, 1610, 340, 100, -16, "lavender"],
    [150, 1770, 320, 96, 8, "yellow"],
    [620, 1780, 340, 100, 14, "sky"],
  ];
  return (
    <Ground glows={[[880, 460, 620, "lavender", 0.15], [160, 1180, 520, "mint", 0.15]]} leave={3.05}>
      <Confetti bits={bits} at={1.5} origin={[W / 2, 1400]} />
      <LabelPill text="By the numbers" x={M} y={TOP} at={0.1} fill={C.mint} />
      <Capsule x={M - 10} y={344} w={COL + 20} h={590} at={0.2} radius={E.cardRadius} shadow="frame">
        <div style={{ position: "absolute", left: 48, top: 18, fontFamily: DISPLAY, fontWeight: 800, fontSize: T.stat, lineHeight: 1.2, letterSpacing: `${T.tracking}em`, color: C.violet, whiteSpace: "nowrap" }}>
          {(n.value * c).toFixed(n.decimals)}
          <span style={{ WebkitTextStroke: `7px ${C.violet}`, paddingLeft: 12 }}>{n.unit}</span>
        </div>
        <div style={{ position: "absolute", left: 56, top: 386, width: 80 * ease("line", t - 0.9), height: E.accentLine.h, borderRadius: 9999, backgroundColor: C.coral }} />
        <Body text={n.caption} x={56} y={416} w={COL - 90} />
      </Capsule>
      <LabelPill text="Blue · 450 nm" x={M} y={984} at={1.05} fill={C.sky} size={26} />
      <Track x={M} y={1064} w={COL} frac={1} fill={C.sky} at={1.15} />
      <LabelPill text="Red · 700 nm" x={M} y={1160} at={1.3} fill={C.peach} size={26} />
      <Track x={M} y={1240} w={COL} frac={1 / n.value} fill={C.coral} at={1.4} />
    </Ground>
  );
};

const List: React.FC = () => {
  const rows: [number, Candy][] = [
    [M - 30, "coral"],
    [M + 30, "lime"],
    [M - 30, "sky"],
  ];
  const [w, h] = [COL + 10, 240];
  const bits: Bit[] = [
    [760, 240, 340, 92, 12, "peach"],
    [-60, 1540, 330, 100, -12, "mint"],
    [360, 1590, 300, 92, 10, "yellow"],
    [720, 1540, 330, 100, -18, "lavender"],
  ];
  return (
    <Ground glows={[[920, 560, 620, "peach", 0.14], [120, 1240, 600, "sky", 0.14]]} leave={3.05}>
      <Confetti bits={bits} at={1.3} origin={[W / 2, 1200]} />
      <LabelPill text="In three steps" x={M} y={TOP} at={0.1} fill={C.yellow} />
      {SAMPLE.list.map((item, i) => {
        const [x, fill] = rows[i];
        const y = 370 + i * 376;
        const at = 0.3 + i * 0.26;
        const lines = wrap(item, 17);
        return (
          <Capsule key={i} x={x} y={y} w={w} h={h + 90} at={at} shadow="card" from="left">
            <Node n={i + 1} x={44} y={(h + 90 - 130) / 2} size={130} fill={C[fill]} />
            <Bodoni lines={lines} x={204} y={(h + 90 - lines.length * 72) / 2 - 4} size={T.card + 6} at={at + 0.15} align="left" weight={700} tracking={-0.01} leading={1.12} />
          </Capsule>
        );
      })}
    </Ground>
  );
};

const endBits: Bit[] = [
  [-60, 300, 300, 84, -18, "mint"],
  [790, 280, 340, 96, 16, "coral"],
  [320, 262, 260, 76, 8, "yellow"],
  [-80, 1250, 340, 100, 20, "lavender"],
  [800, 1220, 340, 100, -16, "lime"],
  [120, 1460, 320, 96, -8, "sky"],
  [600, 1430, 320, 96, 12, "peach"],
  [330, 1640, 360, 104, -6, "coral"],
];

const End: React.FC = () => (
  <Ground glows={[[540, 760, 720, "lavender", 0.15], [900, 1500, 500, "coral", 0.12], [150, 1500, 500, "sky", 0.13]]}>
    <Confetti bits={endBits} at={0.8} origin={[W / 2, 760]} />
    <Bodoni lines={wrap(SAMPLE.end.line, 8)} y={520} size={T.closing + 34} at={0.25} emCol={C.violet} />
    <AccentLine y={984} at={1.0} closer />
    <Capsule x={(W - 520) / 2} y={1036} w={520} h={100} at={1.1} fill={C.yellow}>
      <PillText text={SAMPLE.end.cta} h={100} size={30} />
    </Capsule>
  </Ground>
);

export const samples: Sample[] = [
  { id: "title", duration: 3.35, hero: 2.8, component: Title },
  { id: "headline", duration: 3.35, hero: 2.8, component: Headline },
  { id: "diagram", duration: 3.85, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.35, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.35, hero: 2.8, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
