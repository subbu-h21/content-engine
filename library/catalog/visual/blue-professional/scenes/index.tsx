/** Blue Professional on the shared sample content: a short briefing with a cover, a finding, a figure, a metric, steps and a close. */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { DISPLAY } from "./fonts";
import { AccentLine, Bar, Body, C, Card, COL, Cta, Dots, ease, Ground, H, Head, Header, Highlight, M, Rings, S, slideIn, Step, W } from "./parts";

const T = S.type;
const L = S.layout;
const E = S.elements;
const n = SAMPLE.number;
/** Rayleigh scattering relative to 700 nm: (700 / wavelength)^4. */
const rel = (nm: number): number => Math.pow(700 / nm, 4);

const Title: React.FC = () => {
  const t = useSeconds();
  const p = ease("panel", t - 0.1);
  return (
    <Ground index={1} leave={3.0}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - p) * ease("panel", 9) * S.motion.recipes.panel.distance}px)`, opacity: Math.min(1, p * 2) }}>
        <polygon points={`0,1230 ${W},1030 ${W},${H} 0,${H}`} fill={C.cobalt} fillOpacity={E.tint} />
      </svg>
      <Rings cx={800} cy={1420} radii={[120, 210, 300, 390]} at={0.6} />
      <Dots x={M} y={1330} at={1.0} />
      <AccentLine y={L.headerY - 4} at={0.2} />
      <Header eyebrow={SAMPLE.kicker} tag={SAMPLE.chapter} at={0.25} />
      <Head lines={wrap(SAMPLE.title, 7)} y={330} size={T.display} at={0.4} />
    </Ground>
  );
};

const Headline: React.FC = () => {
  const t = useSeconds();
  const lines = [SAMPLE.headline[0], ...wrap(SAMPLE.headline[1], 12)];
  const bands = [400, 450, 500, 550, 600, 650, 700];
  const [cy, ch] = [760, 340];
  const inner = COL - 80;
  const gap = 10;
  const bw = (inner - gap * (bands.length - 1)) / bands.length;
  return (
    <Ground index={2} leave={3.0}>
      <Header eyebrow={SAMPLE.chapter} tag="Finding" at={0.1} />
      <Head lines={lines} y={L.contentY} size={T.h2} at={0.25} />
      <Card y={cy} h={ch} at={0.8}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: C.text, whiteSpace: "nowrap" }}>Visible light</div>
        {bands.map((nm, i) => {
          const p = ease("fill", t - 1.0 - i * S.motion.listStagger);
          return <div key={nm} style={{ position: "absolute", left: 40 + i * (bw + gap), top: 100 + 130 * (1 - p), width: bw, height: 130 * p, borderRadius: E.track.radius, backgroundColor: C.cobalt, opacity: 1 - i * 0.12 }} />;
        })}
        <div style={{ position: "absolute", left: 40, top: 250, fontFamily: DISPLAY, fontWeight: 500, fontSize: 28, color: C.muted, ...slideIn(t - 1.3) }}>400 nm</div>
        <div style={{ position: "absolute", right: 40, top: 250, fontFamily: DISPLAY, fontWeight: 500, fontSize: 28, color: C.muted, ...slideIn(t - 1.35) }}>700 nm</div>
      </Card>
      <Highlight y={1150} h={200} at={1.45}>
        <Body text={SAMPLE.body} x={44} y={34} w={COL - 90} at={1.5} col={C.text} />
      </Highlight>
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [cy0, ch] = [510, 680];
  const [mx, my] = [COL / 2 + 40, 372];
  const [sx, sy] = [0, 130];
  const beam = ease("fill", t - 0.75);
  const hit = ease("ring", t - 1.15);
  const angles = [-112, -67, -22, 68, 113, 158];
  return (
    <Ground index={3} leave={3.5}>
      <Header eyebrow="How it works" tag={d.object} at={0.1} />
      <Head lines={[d.label]} y={L.contentY} size={T.h2 - 8} at={0.25} />
      <Card y={cy0} h={ch} at={0.5}>
        <svg width={COL} height={ch} style={{ position: "absolute", left: 0, top: 0 }}>
          {[120, 200, 280].map((r, i) => (
            <circle key={r} cx={mx} cy={my} r={r} fill="none" stroke={C.cobalt} strokeOpacity={E.ring.alpha * ease("ring", t - 0.9 - i * 0.08)} strokeWidth={E.ring.stroke} />
          ))}
          <line x1={sx} y1={sy} x2={sx + (mx - sx) * beam} y2={sy + (my - sy) * beam} stroke={C.text} strokeWidth={6} />
          {hit > 0 ? <line x1={mx} y1={my} x2={mx + (mx - sx) * 0.92 * hit} y2={my + (my - sy) * 0.92 * hit} stroke={C.light} strokeWidth={6} /> : null}
          {angles.map((deg, i) => {
            const p = ease("ring", t - 1.25 - i * 0.04);
            if (p <= 0) return null;
            const a = (deg * Math.PI) / 180;
            const r0 = 76;
            const r1 = r0 + 180 * p;
            return <line key={deg} x1={mx + r0 * Math.cos(a)} y1={my + r0 * Math.sin(a)} x2={mx + r1 * Math.cos(a)} y2={my + r1 * Math.sin(a)} stroke={C.cobalt} strokeWidth={8} strokeLinecap="round" />;
          })}
          <circle cx={mx} cy={my} r={56 * ease("line", t - 1.0)} fill={C.cobalt} />
        </svg>
        <div style={{ position: "absolute", left: 36, top: 36, fontFamily: DISPLAY, fontWeight: 600, fontSize: 36, color: C.text, ...slideIn(t - 0.85) }}>{d.in}</div>
      </Card>
      <Highlight y={1250} h={170} at={1.8}>
        <Head lines={[d.out]} x={40} y={44} size={T.h3 + 2} weight={600} at={1.85} />
      </Highlight>
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const c = ease("count", t - 0.4);
  const rows = [450, 550, 650, 700];
  const max = rel(rows[0]);
  return (
    <Ground index={4} leave={3.0}>
      <Header eyebrow="By the numbers" tag="Rayleigh scattering" at={0.1} />
      <Card y={L.contentY} h={510} at={0.2}>
        <div style={{ position: "absolute", left: 44, top: 10, fontFamily: DISPLAY, fontWeight: 700, fontSize: T.metric, lineHeight: 1.16, letterSpacing: `${T.tracking}em`, color: C.cobalt, whiteSpace: "nowrap" }}>
          {(n.value * c).toFixed(n.decimals)}
          {n.unit}
        </div>
        <Body text={n.caption} x={46} y={366} w={COL - 100} at={0.9} />
      </Card>
      <div style={{ position: "absolute", left: M, top: 912, fontFamily: DISPLAY, fontWeight: 600, fontSize: T.eyebrow, letterSpacing: `${T.eyebrowTracking}em`, textTransform: "uppercase", color: C.cobalt, ...slideIn(t - 1.1) }}>Scattering, relative to red</div>
      {rows.map((nm, i) => (
        <Bar key={nm} y={996 + i * 104} label={`${nm} nm`} value={`${rel(nm).toFixed(1)}${n.unit}`} frac={rel(nm) / max} at={1.2 + i * S.motion.listStagger} />
      ))}
    </Ground>
  );
};

const List: React.FC = () => (
  <Ground index={5} leave={3.0}>
    <Header eyebrow="In three steps" tag={SAMPLE.chapter} at={0.1} />
    {SAMPLE.list.map((item, i) => {
      const y = L.contentY + i * 372;
      const at = 0.25 + i * 0.22;
      return (
        <Card key={i} y={y} h={340} at={at}>
          <Step n={i + 1} x={44} y={122} at={at} />
          <Head lines={wrap(item, 17)} x={186} y={(338 - wrap(item, 17).length * T.h3 * 1.2) / 2} size={T.h3 + 8} weight={600} at={at + 0.1} leading={1.14} />
        </Card>
      );
    })}
  </Ground>
);

const End: React.FC = () => (
  <Ground index={6}>
    <Rings cx={W / 2} cy={830} radii={[230, 340, 450, 560]} at={0.15} />
    <AccentLine y={560} at={0.3} center />
    <Head lines={wrap(SAMPLE.end.line.replace(/\*/g, ""), 8)} y={620} size={T.h1} at={0.4} align="center" />
    <Cta text={SAMPLE.end.cta} y={1060} at={1.1} />
  </Ground>
);

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.7, component: Title },
  { id: "headline", duration: 3.4, hero: 2.8, component: Headline },
  { id: "diagram", duration: 3.9, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.4, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.6, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];
