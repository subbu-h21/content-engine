/** Neural Console on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, fit, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Body, C, Card, Cells, CoreLabel, ease, Ground, Header, Headline, Hub, Label, labelStyle, Logs, M, Meter, Node, Path, S, T, W, DISPLAY, MONO, COLUMN, L } from "./parts";

/** Every log line is true. [key, value, magenta?] */
const LOG: [string, string, boolean?][] = [
  ["light", "400-700 nm"],
  ["blue", "450 nm"],
  ["red", "700 nm", true],
  ["scatter", "λ^-4"],
  ["ratio", "5.9×"],
  ["blue.dir", "all"],
  ["red.dir", "onward", true],
  ["sky", "blue"],
];

const HUB_X = L.hub.x;

/** Plain words broken into lines, the emphasised words on a line of their own. */
const linesWithEm = (lines: string[], max: number): string[] => {
  const all = lines.flatMap((l) => words(l));
  const plain = all.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = all.filter((w) => w.em).map((w) => w.text).join(" ");
  return [...wrap(plain, max), ...(em ? [`*${em}*`] : [])];
};

const Title: React.FC = () => {
  const lines = linesWithEm([SAMPLE.title], 16);
  const size = fit(lines, COLUMN, T.title, T.charEm);
  return (
    <Ground>
      <Header title={SAMPLE.kicker} right={SAMPLE.chapter} />
      <Headline lines={lines} size={size} y={372} at={0.45} />
      <Hub cx={HUB_X} cy={1110} r={300} at={0.7}>
        <CoreLabel>450 nm</CoreLabel>
        <div style={{ ...labelStyle(C.core, 0.9), marginTop: 14 }}>Blue light</div>
      </Hub>
      <Logs lines={LOG} y={790} h={640} at={0.9} />
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const lines = linesWithEm(SAMPLE.headline, 16);
  const size = fit(lines, COLUMN, T.display, T.charEm);
  const ticks = [400, 450, 500, 550, 600, 650, 700];
  const mw = L.card.width - 80;
  return (
    <Ground>
      <Header title={SAMPLE.kicker} right={SAMPLE.chapter} />
      <Headline lines={lines} size={size} y={372} at={0.35} />
      <Hub cx={HUB_X} cy={960} r={230} at={0.8}>
        <CoreLabel>400–700</CoreLabel>
        <div style={{ ...labelStyle(C.core, 0.9), marginTop: 12 }}>nm</div>
      </Hub>
      <Logs lines={LOG} y={730} h={460} at={1.0} />
      <Card y={1270} h={300} at={1.5}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: T.status, color: C.text, letterSpacing: `${T.tracking / 2}em`, marginBottom: 28 }}>Visible sunlight, all at once</div>
        <div style={{ position: "relative", width: mw, height: 8, borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, ${C.core} 0%, ${C.coreHot} 50%, ${C.second} 100%)`,
              transform: `scaleX(${Math.max(0, ease("meter", t - 1.9))})`,
              transformOrigin: "0 50%",
              boxShadow: `0 0 14px ${C.core}`,
            }}
          />
        </div>
        <div style={{ position: "relative", height: 60, marginTop: 14 }}>
          {ticks.map((n, i) => {
            const x = (mw * i) / (ticks.length - 1);
            const p = ease("cell", t - 2.0 - i * S.motion.cellStagger);
            return (
              <div key={n} style={{ position: "absolute", left: x - 40, width: 80, textAlign: "center", opacity: clamp(p) }}>
                <div style={{ width: 2, height: 12, margin: "0 auto 8px", background: C.core, opacity: 0.6 }} />
                <div style={{ fontFamily: MONO, fontSize: T.label, color: C.muted, opacity: 0.85 }}>{n}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const [cx, cy] = [540, 1010];
  const sun: [number, number] = [190, 660];
  const inA = Math.atan2(sun[1] - cy, sun[0] - cx);
  const r0 = 186;
  const r1 = 352;
  const blue = [-90, -45, 0, 90, 135, 180].map((d) => (d * Math.PI) / 180);
  const redA = inA + Math.PI;
  const at = (a: number, r: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const head = wrap(`*Blue,* ${SAMPLE.diagram.out.replace(/^Blue,\s*/, "")}`, 16);
  const size = fit(head, COLUMN, T.display, T.charEm);
  return (
    <Ground>
      <Header title={SAMPLE.kicker} right="How it works" />
      <Headline lines={head} size={Math.min(size, 84)} y={372} at={0.3} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Path a={sun} b={at(inA, r0 + 6)} at={0.7} hex={C.text} solid />
        {blue.map((a, i) => (
          <Path key={i} a={at(a, r0)} b={at(a, r1)} at={1.5 + i * S.motion.pathStagger} />
        ))}
        <Path a={at(redA, r0)} b={at(redA, r1 + 40)} at={1.5 + 6 * S.motion.pathStagger} hex={C.second} />
        <Node x={sun[0]} y={sun[1]} at={0.55} octa r={9} />
        {blue.map((a, i) => {
          const [x, y] = at(a, r1);
          return <Node key={i} x={x} y={y} at={2.3 + i * S.motion.nodeStagger} />;
        })}
        <Node x={at(redA, r1 + 40)[0]} y={at(redA, r1 + 40)[1]} at={2.3 + 6 * S.motion.nodeStagger} hex={C.second} hot={C.secondHot} />
      </svg>
      <Label text={SAMPLE.diagram.in} x={sun[0] + 48} y={sun[1] - 4} at={0.8} />
      <Label text="Red · 700 nm" x={at(redA, r1 + 40)[0] - 24} y={at(redA, r1 + 40)[1] + 54} at={3.0} hex={C.second} align="right" />
      <Hub cx={cx} cy={cy} r={170} at={1.0}>
        <CoreLabel size={38}>Air</CoreLabel>
        <CoreLabel size={38}>molecule</CoreLabel>
      </Hub>
      <Card y={1440} h={140} at={2.6}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: T.status, color: C.text }}>{SAMPLE.diagram.label}</div>
          <Cells n={6} at={2.9} />
        </div>
      </Card>
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const rowW = L.card.width - 80;
  const row = (label: string, value: string, frac: number, hex: string, at: number) => (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={labelStyle(hex, 0.95)}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: T.label + 4, color: hex === C.core ? C.coreHot : C.secondHot }}>{value}</span>
      </div>
      <Meter frac={frac} at={at} width={rowW} hex={hex} />
    </div>
  );
  return (
    <Ground>
      <Header title={SAMPLE.kicker} right="By the numbers" />
      <Hub cx={W / 2} cy={760} r={300} at={0.3} pulseAt={2.2}>
        <CoreLabel size={T.metric}>
          {n.value.toFixed(n.decimals)}
          {n.unit}
        </CoreLabel>
        <div style={{ ...labelStyle(C.core, 0.9), marginTop: 10 }}>Blue vs red</div>
      </Hub>
      <Body text={n.caption} y={1120} at={1.0} align="center" width={COLUMN * 0.86} />
      <Card y={1270} h={290} at={1.3}>
        {row("Blue · 450 nm", n.value.toFixed(n.decimals), 1, C.core, 1.7)}
        {row("Red · 700 nm", "1.0", 1 / n.value, C.second, 1.85)}
      </Card>
    </Ground>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const top = 420;
  const step = 270;
  return (
    <Ground>
      <Header title={SAMPLE.kicker} right="In three steps" />
      <Card y={top} h={860} at={0.3} x={M} w={COLUMN}>
        <div style={{ ...labelStyle(C.muted, T.mutedOpacity) }}>Sequence</div>
      </Card>
      {SAMPLE.list.map((item, i) => {
        const at = 0.8 + i * 0.55;
        const active = i === SAMPLE.list.length - 1;
        const p = ease("copy", t - at);
        if (p <= 0) return null;
        const y = top + 110 + i * step;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: M + 40, top: y, width: 4, height: 190, borderRadius: 2, background: active ? C.core : "transparent", boxShadow: active ? `0 0 14px ${C.core}` : "none", opacity: p }} />
            <div style={{ position: "absolute", left: M + 72, top: y + 4, ...labelStyle(C.core, 0.9 * p) }}>{`Step ${i + 1}`}</div>
            <Headline lines={wrap(item, 18)} size={52} y={y + 46} x={M + 72} at={at + 0.08} />
            <div style={{ position: "absolute", right: M + 40, top: y + 4 }}>
              <Cells n={6} at={at + 0.3} lit={6} hex={active ? C.core : C.faint} />
            </div>
          </React.Fragment>
        );
      })}
      <Body text={SAMPLE.body} y={1340} at={2.4} width={COLUMN * 0.9} />
    </Ground>
  );
};

const End: React.FC = () => {
  const [a, b] = [SAMPLE.end.line.replace(/\s*\*.*$/, ""), words(SAMPLE.end.line).filter((w) => w.em).map((w) => w.text).join(" ")];
  return (
    <Ground>
      <Header title={SAMPLE.kicker} />
      <Hub cx={W / 2} cy={880} r={330} at={0.2} pulseAt={2.3}>
        <CoreLabel size={92}>{a}</CoreLabel>
        <CoreLabel size={92}>
          <span style={{ color: C.core }}>{b}</span>
        </CoreLabel>
      </Hub>
      <Card y={1330} h={170} at={1.1}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 14 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: T.status + 6, color: C.text }}>{SAMPLE.end.cta}</div>
          <div style={labelStyle(C.muted, T.mutedOpacity)}>{SAMPLE.topic}</div>
        </div>
      </Card>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4, hero: 3.0, component: Title },
  { id: "headline", duration: 4.5, hero: 3.6, component: HeadlineSample },
  { id: "diagram", duration: 4.5, hero: 3.8, component: Diagram },
  { id: "number", duration: 4, hero: 3.2, component: NumberSample },
  { id: "list", duration: 4.5, hero: 3.6, component: List },
  { id: "end", duration: 4, hero: 3.2, component: End },
];
