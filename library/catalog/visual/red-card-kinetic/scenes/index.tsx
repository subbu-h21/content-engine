/** Red Card Kinetic on the shared sample content: title, headline, diagram, number, list, the ink wipe, end card. */
import React from "react";
import { fit, plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { ArcWord, C, Card, CardFace, Chip, COLUMN, ease, InkWipe, Mono, Panel, S, stack, W, Word } from "./parts";

const T = S.type;
const lower = (s: string) => plain(s).toLowerCase();
/** Poppins Black lowercase at -0.05 em is about 0.58 em a character; Six Caps about 0.23 em. */
const POP = 0.58;
const SIX = 0.23;
/** A chip's half height. */
const CHIP = T.chip * 0.92;
const split = (line: string) => {
  const ws = words(line);
  return { plain: ws.filter((w) => !w.em).map((w) => w.text), em: ws.filter((w) => w.em).map((w) => w.text).join(" ") };
};

const Title: React.FC = () => {
  // "Why is the sky *blue?*": connecting words small, the emphasised word as a tall Six Caps key word
  const { plain: lead, em: key } = split(SAMPLE.title);
  const keySize = fit([key], COLUMN * 0.66, T.condensed * 1.4, SIX);
  const { ys, bottom } = stack([{ size: T.connect }, { size: T.display }, { size: keySize, face: "condensed" }], { centre: 860 });
  return (
    <Card>
      <Word text={lead.slice(0, 2).join(" ")} size={T.connect} y={ys[0]} at={0.15} move="fade" />
      <Word text={lead.slice(2).join(" ")} size={T.display} y={ys[1]} at={0.35} move="swing" />
      <Word text={key} size={keySize} y={ys[2]} at={0.75} move="stretch" face="condensed" effect="none" />
      <Chip text={SAMPLE.kicker} y={bottom + 50 + CHIP} at={1.25} />
    </Card>
  );
};

const HeadlineSample: React.FC = () => {
  // "Sunlight carries / every colour *at once.*"
  const [l1, l2] = SAMPLE.headline;
  const w1 = words(l1).map((w) => w.text);
  const { plain: mid, em: hot } = split(l2);
  const hotSize = fit([hot], COLUMN, T.hero, POP);
  const arcSize = fit([mid.join(" ")], COLUMN * 0.95, 132, POP);
  const { ys, bottom } = stack([{ size: T.display }, { size: T.connect, gap: 0.2 }], { top: 560 });
  const yArc = bottom + 70 + arcSize * 0.6;
  // the arc's ends sit lower than its apex: r (1 - cos(span / 2)) for a span of (text length / r)
  const span = (plain(mid.join(" ")).length * POP * arcSize) / 900;
  const { ys: hy } = stack([{ size: hotSize }], { top: yArc + 900 * (1 - Math.cos(span / 2)) + arcSize * 0.45 + 24 });
  return (
    <Card>
      <Word text={w1[0]} size={T.display} y={ys[0]} at={0.1} move="swing" />
      <Word text={w1.slice(1).join(" ")} size={T.connect} y={ys[1]} at={0.5} move="fade" />
      <ArcWord id="hl-arc" text={mid.join(" ")} size={arcSize} y={yArc} r={900} at={0.75} />
      <Word text={lower(hot)} size={hotSize} y={hy[0]} at={1.15} move="slam" effect="slam" />
    </Card>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [mx, my] = [580, 800];
  const [sx, sy] = [150, 470];
  const beam = ease("draw", t - 0.35);
  const hit = Math.max(0, ease("slam", t - 0.75));
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10 + 0.2);
  const scat = words(SAMPLE.diagram.label).map((w) => w.text);
  const key = scat.slice(1).join(" ");
  const keySize = fit([key], COLUMN * 0.9, 300, SIX);
  const chipY = my + 290;
  const { ys } = stack([{ size: 120 }, { size: keySize, face: "condensed" }], { top: chipY + CHIP + 60 });
  return (
    <Card>
      <Word text={SAMPLE.diagram.in} size={T.connect} x={330} y={360} at={0.1} move="slide" dir={-1} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={sx} y1={sy} x2={sx + (mx - sx) * beam} y2={sy + (my - sy) * beam} stroke={C.text} strokeWidth={18} strokeLinecap="round" />
        {rays.map((a, i) => {
          const p = Math.max(0, ease("pop", t - 0.85 - i * S.motion.stagger));
          if (p <= 0) return null;
          const r0 = 128;
          const r1 = r0 + 92 * Math.min(1.15, p);
          return <line key={i} x1={mx + r0 * Math.cos(a)} y1={my + r0 * Math.sin(a)} x2={mx + r1 * Math.cos(a)} y2={my + r1 * Math.sin(a)} stroke={C.text} strokeWidth={14} strokeLinecap="round" />;
        })}
        <g transform={`translate(${mx} ${my}) scale(${hit})`}>
          <circle r={92} fill={C.muted} />
          <circle r={84} fill={C.text} />
        </g>
      </svg>
      <Chip text={SAMPLE.diagram.object} y={chipY} x={mx} at={1.2} />
      <Word text={scat[0]} size={120} y={ys[0]} at={1.45} move="fade" />
      <Word text={key} size={keySize} y={ys[1]} at={1.6} move="stretch" face="condensed" effect="none" />
    </Card>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const size = fit([value], COLUMN, T.number, 0.66);
  const fill = ease("draw", t - 1.2);
  const { ys, bottom } = stack([{ size: T.connect }, { size }, { size: T.connect * 0.8, gap: 0.16 }], { top: 500 });
  const pw = COLUMN - 40;
  const bar = (label: string, frac: number, col: string, y: number) => (
    <>
      <Mono text={label} x={44} y={y - 50} />
      <div style={{ position: "absolute", left: 44, top: y, width: pw - 88, height: 22, borderRadius: 11, backgroundColor: C.text, opacity: 0.1 }} />
      <div style={{ position: "absolute", left: 44, top: y, width: (pw - 88) * frac * fill, height: 22, borderRadius: 11, backgroundColor: col }} />
    </>
  );
  return (
    <Card>
      <Word text="more scattering" size={T.connect} y={ys[0]} at={0.1} move="fade" />
      <Word text={value} size={size} y={ys[1]} at={0.4} move="slam" effect="slam" />
      <Word text="for blue than red" size={T.connect * 0.8} y={ys[2]} at={0.8} move="pop" effect="sticker" seed={3} />
      <Panel title="scatter.readout" x={(W - pw) / 2} y={bottom + 110} w={pw} h={330} at={1.0}>
        {bar("blue  450 nm", 1, C.text, 150)}
        {bar("red   700 nm", 1 / n.value, C.accent, 260)}
      </Panel>
    </Card>
  );
};

const List: React.FC = () => {
  const keySize = fit(["STEPS"], COLUMN * 0.5, T.condensed, SIX);
  const { ys, bottom } = stack([{ size: T.connect }, { size: keySize, face: "condensed" }], { top: 330 });
  return (
    <Card>
      <Word text="in three" size={T.connect} y={ys[0]} at={0.1} move="fade" />
      <Word text="steps" size={keySize} y={ys[1]} at={0.3} move="stretch" face="condensed" effect="none" />
      {SAMPLE.list.map((item, i) => (
        <Chip key={i} text={item} n={i + 1} y={bottom + 110 + CHIP + i * 170} at={0.8 + i * 0.3} />
      ))}
    </Card>
  );
};

const Wipe: React.FC = () => {
  // the breather: the white grid card, then the red card arrives by the liquid-ink wipe from the top-right
  const { ys } = stack([{ size: T.connect }, { size: T.hero }, { size: T.display }], { top: 1010 });
  return (
    <Card variant="white">
      <Word text="and the" size={T.connect} y={ys[0]} x={420} at={0.1} move="fade" fill={C.muted} effect="none" />
      <Word text="sky" size={T.hero} y={ys[1]} x={420} at={0.3} move="slam" fill={C.accent} />
      <Word text="is blue" size={T.display} y={ys[2]} x={420} at={0.7} move="swing" dir={1} fill={C.accent} />
      <InkWipe at={1.3}>
        <CardFace />
      </InkWipe>
    </Card>
  );
};

const End: React.FC = () => {
  const { plain: l, em } = split(SAMPLE.end.line);
  const keySize = fit([em], COLUMN * 0.72, T.condensed * 1.3, SIX);
  const { ys, bottom } = stack([{ size: T.display }, { size: keySize, face: "condensed" }], { centre: 840 });
  return (
    <Card>
      <Word text={l.join(" ")} size={T.display} y={ys[0]} at={0.1} move="swing" />
      <Word text={em} size={keySize} y={ys[1]} at={0.45} move="stretch" face="condensed" effect="none" />
      <Chip text={SAMPLE.end.cta} y={bottom + 60 + CHIP} at={1.0} />
    </Card>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.6, hero: 2.0, component: Title },
  { id: "headline", duration: 2.6, hero: 2.1, component: HeadlineSample },
  { id: "diagram", duration: 3, hero: 2.5, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.3, component: NumberSample },
  { id: "list", duration: 2.6, hero: 2.1, component: List },
  { id: "wipe", duration: 1.8, hero: 1.3 + 4 / 30, component: Wipe },
  { id: "end", duration: 2.4, hero: 1.9, component: End },
];
