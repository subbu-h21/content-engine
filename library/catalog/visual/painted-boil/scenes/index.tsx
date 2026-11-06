/**
 * Painted Boil on the shared sample content: Pip wonders why the sky is blue, the sun throws out every colour, an air
 * molecule splashes blue everywhere, two paint swatches compare, three painted panels for the steps, Pip waves under a
 * blue sky, and the brush wipe.
 */
import React from "react";
import { SAMPLE, useSeconds, type Sample } from "../../kit";
import { backOut, blob, BrushWipe, C, Dry, ease, Glow, Ink, Layer, Letters, Mark, Page, Painted, Pip, S, SPECTRUM, W, Wash } from "./parts";

const T = S.type;
const HILL = S.layout.hill;

/** A sky wash from the top down to a wobbly edge at `bottom`. */
const skyD = (bottom: number, seed = 1) => {
  const pts: string[] = [];
  for (let x = -60; x <= W + 60; x += 60) pts.push(`${x} ${bottom + 26 * Math.sin(x * 0.011 + seed) + 14 * Math.sin(x * 0.031 + seed * 2)}`);
  return `M -60 -60 L ${W + 60} -60 L ${pts.reverse().join(" L ")} Z`;
};
/** A hill wash from a wobbly top at `top` to the bottom of the frame. */
const hillD = (top: number, seed = 1, amp = 60) => {
  const pts: string[] = [];
  for (let x = -60; x <= W + 60; x += 40) pts.push(`${x} ${top - amp * Math.sin((x / W) * Math.PI * 0.9 + seed) - 18 * Math.sin(x * 0.02 + seed)}`);
  return `M ${pts.join(" L ")} L ${W + 60} 2000 L -60 2000 Z`;
};

const Title: React.FC = () => {
  const t = useSeconds();
  return (
    <Page>
      <Layer>
        <Wash d={skyD(1460, 2)} fill={C.sky} k={1} />
        <Wash d={hillD(HILL - 30, 1, 40)} fill={mixed(C.sap, C.sky)} k={2} opacity={0.5} />
        <Wash d={hillD(HILL + 70, 3, 70)} fill={C.sap} k={3} />
        <Pip id="t" x={700} y={HILL + 120} s={30} pose="idle" mood="wonder" gaze={[-0.3, -1]} t={t} k={0} />
        <Mark kind="?" x={760} y={HILL - 330} s={1.3} at={1.4} />
      </Layer>
      <Letters lines={["Why is", "the sky", "*blue?*"]} size={T.title} y={260} at={0.3} em={C.indigo} />
      <Letters lines={[SAMPLE.kicker]} size={T.label} y={720} at={1.0} fill={C.cream} tilt={0.02} />
    </Page>
  );
};

/** A warm mix used for far hills. */
const mixed = (a: string, b: string) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round((((pa >> s) & 255) + ((pb >> s) & 255)) / 2);
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const [sx, sy] = [540, 900];
  const rays = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2 + 0.17;
    const p = ease("easeOut", t - 0.5 - i * 0.03);
    return <Dry key={i} a={[sx + 175 * Math.cos(a), sy + 175 * Math.sin(a)]} b={[sx + 400 * Math.cos(a), sy + 400 * Math.sin(a)]} w={46} c={SPECTRUM[i % 6]} p={p} />;
  });
  const sp = backOut(t - 0.2);
  return (
    <Page>
      <Layer>
        <Wash d={hillD(HILL + 80, 5, 50)} fill={C.sap} k={3} />
        <Glow x={sx} y={sy} r={520} id="hl-glow" />
        {rays}
        {sp > 0 ? (
          <g transform={`translate(${sx} ${sy}) scale(${sp}) translate(${-sx} ${-sy})`}>
            <Painted id="hl-sun" d={blob(sx, sy, 150, 146, 4)} fill={C.gold} shade={C.ochre} k={4} line={7} />
          </g>
        ) : null}
        <Pip id="hl" x={820} y={HILL + 140} s={26} pose="cheer" mood="happy" gaze={[-0.5, -1]} t={t} k={1} flip />
        <Mark kind="sparkle" x={250} y={1280} at={1.6} />
      </Layer>
      <Letters lines={["Sunlight carries", "every colour", "*at once.*"]} size={T.display - 28} y={260} at={0.9} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [mx, my] = [520, 900];
  const beam = ease("ease", t - 0.3);
  const hit = 0.3 + S.motion.recipes.ease.duration;
  const a: [number, number] = [-60, 560];
  const dir = [mx - a[0], my - a[1]];
  const splats = Array.from({ length: 14 }, (_, i) => {
    const ang = (i / 14) * Math.PI * 2 + 0.2;
    const p = backOut(t - hit - 0.05 - (i % 5) * 0.04, 0.5);
    if (p <= 0) return null;
    const r0 = 160 + 30 * Math.min(1, p);
    const r1 = r0 + 90 * Math.min(1, p);
    return <Dry key={i} a={[mx + r0 * Math.cos(ang), my + r0 * Math.sin(ang)]} b={[mx + r1 * Math.cos(ang), my + r1 * Math.sin(ang)]} w={30} c={i % 3 === 0 ? C.indigo : C.sky} />;
  });
  const mk = backOut(t - 0.1);
  return (
    <Page>
      <Layer>
        <Wash d={skyD(1300, 4)} fill={C.sky} k={1} opacity={0.45} />
        <Wash d={hillD(HILL + 80, 2, 50)} fill={C.sap} k={3} />
        <Glow x={a[0] + dir[0] * beam} y={a[1] + dir[1] * beam} r={180} id="d-glow" a={beam} />
        <Dry a={a} b={[mx - 120, my - 40]} w={76} c={C.ochre} p={beam} />
        {t >= hit ? <Dry a={[mx + 120, my + 40]} b={[mx + 120 + dir[0] * 0.5, my + 40 + dir[1] * 0.5]} w={40} c={C.rose} p={ease("ease", t - hit)} /> : null}
        {splats}
        {mk > 0 ? (
          <g transform={`translate(${mx} ${my}) scale(${mk}) translate(${-mx} ${-my})`}>
            <Painted id="d-mol" d={blob(mx, my, 125, 120, 9)} fill={C.cream} shade={mixed(C.violet, C.cream)} k={5} line={7} />
            <circle cx={mx - 34} cy={my - 18} r={11} fill={C.ink} />
            <circle cx={mx + 30} cy={my - 18} r={11} fill={C.ink} />
            <Ink d={`M ${mx - 26} ${my + 22} Q ${mx} ${my + 46} ${mx + 26} ${my + 22}`} k={6} w={7} />
          </g>
        ) : null}
        <Pip id="dg" x={830} y={HILL + 130} s={24} pose="up" mood="surprised" gaze={[-0.7, -0.6]} t={t} k={2} flip />
        <Mark kind="!" x={900} y={HILL - 250} s={1.2} at={hit + 0.3} />
        <Ink d={`M 250 1150 Q 300 1080 ${mx - 110} ${my + 90}`} k={8} w={6} />
        <Ink d={`M ${mx - 140} ${my + 70} L ${mx - 110} ${my + 90} L ${mx - 136} ${my + 112}`} k={8} w={6} />
      </Layer>
      <Letters lines={[SAMPLE.diagram.label.split(" ")[0], "*" + SAMPLE.diagram.label.split(" ").slice(1).join(" ") + "*"]} size={T.display} y={260} at={hit} em={C.indigo} />
      <Letters lines={[SAMPLE.diagram.object.toLowerCase()]} size={T.label} y={1160} x={90} align="left" at={1.4} tilt={0.04} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const x0 = 140;
  const full = 800;
  const swatch = (y: number, frac: number, c: string, at: number, k: number) => {
    const p = ease("easeOut", t - at);
    if (p <= 0) return null;
    const x1 = x0 + full * frac * p;
    const d = `M ${x0} ${y} Q ${(x0 + x1) / 2} ${y - 10} ${x1} ${y + 4} L ${x1 + 8} ${y + 112} Q ${(x0 + x1) / 2} ${y + 122} ${x0 - 6} ${y + 108} Z`;
    return <Wash d={d} fill={c} k={k} opacity={0.85} />;
  };
  return (
    <Page>
      <Layer>
        <Wash d={hillD(HILL + 120, 6, 40)} fill={C.sap} k={3} />
        {swatch(940, 1, C.sky, 1.0, 1)}
        {swatch(1130, 1 / n.value, C.rose, 1.2, 2)}
        <Pip id="nm" x={840} y={HILL + 160} s={22} pose="point" mood="happy" gaze={[-1, -0.4]} t={t} k={3} flip />
      </Layer>
      <Letters lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size={T.number} y={250} at={0.3} fill={C.ochre} />
      <Letters lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} size={T.label} y={600} at={0.8} tilt={0.01} />
      <Letters lines={["blue · 450 nm"]} size={T.label} y={860} x={x0} align="left" at={1.0} tilt={0} />
      <Letters lines={["red · 700 nm"]} size={T.label} y={1050} x={x0} align="left" at={1.2} tilt={0} />
    </Page>
  );
};

/** A painted panel: a watercolour-edged card holding a small scene. */
const Panel: React.FC<{ y: number; at: number; k: number; children: React.ReactNode }> = ({ y, at, k, children }) => {
  const p = backOut(useSeconds() - at);
  if (p <= 0) return null;
  const d = blob(540, y + 170, 470, 185, 30 + k);
  return (
    <g transform={`translate(540 ${y + 170}) scale(${p}) rotate(${(k % 2 ? 1 : -1) * 1.2}) translate(-540 ${-(y + 170)})`}>
      <Wash d={d} fill={C.cream} k={k} opacity={0.9} />
      <Ink d={d} k={k} w={5} />
      {children}
    </g>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const ys = [250, 680, 1110];
  const ats = [0.2, 0.7, 1.2];
  return (
    <Page>
      <Layer>
        <Panel y={ys[0]} at={ats[0]} k={1}>
          <Glow x={300} y={ys[0] + 150} r={200} id="l-g1" />
          <Painted id="l-sun" d={blob(300, ys[0] + 150, 80, 78, 6)} fill={C.gold} shade={C.ochre} k={4} line={6} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Dry key={i} a={[300 + 100 * Math.cos(a), ys[0] + 150 + 100 * Math.sin(a)]} b={[300 + 150 * Math.cos(a), ys[0] + 150 + 150 * Math.sin(a)]} w={20} c={SPECTRUM[i % 6]} />;
          })}
        </Panel>
        <Panel y={ys[1]} at={ats[1]} k={2}>
          <Painted id="l-mol" d={blob(300, ys[1] + 150, 70, 68, 8)} fill={C.cream} shade={mixed(C.violet, C.cream)} k={5} line={6} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <Dry key={i} a={[300 + 95 * Math.cos(a), ys[1] + 150 + 95 * Math.sin(a)]} b={[300 + 140 * Math.cos(a), ys[1] + 150 + 140 * Math.sin(a)]} w={16} c={i % 3 ? C.sky : C.indigo} />;
          })}
        </Panel>
        <Panel y={ys[2]} at={ats[2]} k={3}>
          <Wash d={blob(300, ys[2] + 110, 150, 90, 12)} fill={C.sky} k={6} opacity={0.7} />
          <Pip id="l-pip" x={300} y={ys[2] + 290} s={15} pose="up" mood="happy" gaze={[0, -1]} t={t} k={6} />
        </Panel>
      </Layer>
      {SAMPLE.list.map((item, i) => (
        <Letters key={i} lines={item.split(" ").length > 3 ? [item.split(" ").slice(0, 2).join(" "), item.split(" ").slice(2).join(" ")] : [item]} size={T.label + 4} y={ys[i] + 110} x={460} align="left" at={ats[i] + 0.3} tilt={0} />
      ))}
    </Page>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  return (
    <Page>
      <Layer>
        <Wash d={skyD(1500, 6)} fill={C.sky} k={1} opacity={0.8} />
        <Glow x={900} y={760} r={380} id="e-glow" />
        <Painted id="e-sun" d={blob(900, 760, 90, 88, 14)} fill={C.gold} shade={C.ochre} k={4} line={6} />
        <Wash d={hillD(HILL + 70, 3, 70)} fill={C.sap} k={3} />
        <Pip id="e" x={420} y={HILL + 120} s={30} pose="wave" mood="happy" gaze={[0.3, -1]} t={t} k={0} />
        <Mark kind="heart" x={640} y={HILL - 260} s={1.2} at={1.0} />
        <Mark kind="sparkle" x={200} y={HILL - 330} s={1.1} at={1.2} />
      </Layer>
      <Letters lines={["Look up", "*again.*"]} size={T.title + 20} y={300} at={0.2} />
      <Letters lines={[SAMPLE.end.cta]} size={T.label + 8} y={690} at={1.0} tilt={0.02} />
    </Page>
  );
};

/** The end card with the brush wipe passing over it (covering, at about 40% of the wipe). */
const WipeSample: React.FC = () => {
  const t = useSeconds();
  const p = Math.min(1, t / 1.6);
  return (
    <Page over={<BrushWipe p={p} cols={[C.teal, C.indigo]} />}>
      <Layer>
        <Wash d={skyD(1500, 6)} fill={C.sky} k={1} opacity={0.8} />
        <Wash d={hillD(HILL + 70, 3, 70)} fill={C.sap} k={3} />
        <Pip id="w" x={420} y={HILL + 120} s={30} pose="wave" mood="happy" t={t} k={0} />
      </Layer>
    </Page>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.4, component: Title },
  { id: "headline", duration: 3.2, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.4, hero: 2.9, component: Diagram },
  { id: "number", duration: 3, hero: 2.5, component: NumberSample },
  { id: "list", duration: 3, hero: 2.4, component: List },
  { id: "end", duration: 3, hero: 2.4, component: End },
  { id: "wipe", duration: 1.6, hero: 0.55, component: WipeSample },
];
