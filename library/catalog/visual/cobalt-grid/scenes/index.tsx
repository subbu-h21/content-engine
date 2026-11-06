/** Cobalt Grid on the shared sample content: a report cover, a chapter opener, a figure in cells, a data frame, an index ledger, a colophon. */
import React from "react";
import { plain, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { DISPLAY } from "./fonts";
import { Body, C, Glitch, Ground, M, Mono, News, Patch, Pix, Rule, S, Stack, stepped, U, W } from "./parts";

const T = S.type;
const L = S.layout;
const n = SAMPLE.number;
const HINT = SAMPLE.topic;

const Title: React.FC = () => (
  <Ground n={1} hint={HINT} leave={3.05}>
    <Mono text={SAMPLE.kicker} y={L.topRule + 18} at={0.2} />
    <Patch x={W - M - 160} y={L.topRule + 26} at={0.5} />
    <News lines={wrap(SAMPLE.title, 7)} y={440} size={T.display} at={0.3} leading={0.9} />
    <News lines={[`*${SAMPLE.body.split(" ").slice(0, 5).join(" ")}*`, `*${SAMPLE.body.split(" ").slice(5).join(" ")}*`]} y={1078} size={T.callout - 6} at={1.0} col={C.soft} leading={1.14} />
    <Glitch y={U * 41} rows={9} at={1.3} />
  </Ground>
);

const Headline: React.FC = () => {
  const lines = [SAMPLE.headline[0], ...wrap(SAMPLE.headline[1], 12)];
  return (
    <Ground n={2} hint={HINT} leave={3.05}>
      <Mono text={`Chapter 01 · ${SAMPLE.chapter}`} y={L.topRule + 18} at={0.15} />
      <News lines={lines} y={360} size={T.chapter} at={0.3} leading={1.0} />
      <Body text={SAMPLE.body} y={796} w={760} at={1.0} />
      <Glitch y={U * 33} rows={17} at={1.2} seed={9} alpha={0.34} from="left" />
    </Ground>
  );
};

/** The cells of a disc of radius r around (cx, cy), in grid units, sorted from the middle out. */
const disc = (cx: number, cy: number, r: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let y = -Math.ceil(r); y <= r; y++) for (let x = -Math.ceil(r); x <= r; x++) if (x * x + y * y <= r * r) out.push([cx + x, cy + y]);
  return out.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy));
};

/** Cells along a straight line in grid units (a stepped pixel line), `every` cells apart. */
const pixelLine = (x0: number, y0: number, x1: number, y1: number, every = 1): [number, number][] => {
  const len = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  const out: [number, number][] = [];
  for (let i = 0; i <= len; i += every) {
    const k = len > 0 ? i / len : 0;
    out.push([Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k)]);
  }
  return out;
};

const Diagram: React.FC = () => {
  const d = SAMPLE.diagram;
  const [mx, my] = [20, 28];
  const sun = disc(7, 15, 4.3);
  const ray = [...pixelLine(11, 18, mx - 4, my - 3), ...pixelLine(12, 18, mx - 3, my - 3)];
  const mol: [number, number][] = [...disc(mx - 2, my, 1.5), [mx, my], ...disc(mx + 2, my, 1.5)];
  const dirs: [number, number][] = [[1, 0], [1, -1], [0, -1], [-1, 1], [0, 1], [1, 1], [-1, 0]];
  const scatter: [number, number][] = [];
  for (let k = 0; k < 5; k++)
    for (const [dx, dy] of dirs) {
      const r = 4 + k * 2;
      const x = mx + dx * r;
      const y = my + dy * r;
      if (x >= 2 && x <= 33 && y >= 11 && y <= 39) scatter.push([x, y]);
    }
  return (
    <Ground n={3} hint={HINT} leave={3.55}>
      <Mono text="How it works" y={L.topRule + 18} at={0.15} />
      <Pix cells={sun} at={0.3} step={0.006} />
      <Pix cells={ray} at={0.75} step={0.018} />
      <Pix cells={mol} at={1.05} step={0.01} />
      <Pix cells={scatter} at={1.25} step={0.02} gap={6} />
      <Mono text={d.in} x={U * 12} y={U * 12} at={0.6} plate />
      <Mono text={d.object} x={U * 2 - 10} y={U * 29 + 8} at={1.1} plate />
      <News lines={[d.label]} y={1230} size={T.row + 8} at={1.9} />
      <News lines={[`*${d.out}*`]} y={1330} size={T.callout + 4} at={2.1} col={C.soft} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const cols = 30;
  const x0 = 3;
  const lit = Math.round(n.value * 10);
  const v = Math.min(lit, Math.floor(Math.max(0, t - 0.7) / (S.motion.cellStep * 1.6)));
  const p = stepped("scan", t - 0.2);
  return (
    <Ground n={4} hint={HINT} leave={3.05}>
      <Mono text="By the numbers" y={L.topRule + 18} at={0.15} />
      <div style={{ position: "absolute", left: M - 8, top: 286, fontFamily: DISPLAY, fontSize: T.numeral, lineHeight: 1.1, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap", visibility: p > 0 ? "visible" : "hidden", clipPath: p >= 1 ? undefined : `inset(0 0 ${(1 - p) * 100}% 0)` }}>
        {(v / 10).toFixed(n.decimals)}
        <span style={{ fontStyle: "italic" }}>{n.unit}</span>
      </div>
      <Body text={n.caption} y={760} w={640} at={0.9} />
      <Mono text="Blue · 450 nm" x={x0 * U - 30} y={U * 32} at={0.7} />
      <Stack x={x0 - 1} y={33} cols={cols} rows={2} on={lit} at={0.7} />
      <Mono text="Red · 700 nm" x={x0 * U - 30} y={U * 38} at={1.3} />
      <Stack x={x0 - 1} y={39} cols={cols} rows={2} on={10} at={1.3} />
      <Mono text="1 cell = 0.1×" x={x0 * U - 30} y={U * 44 + 8} at={1.5} col={C.soft} />
    </Ground>
  );
};

const List: React.FC = () => {
  const y0 = 600;
  const row = 270;
  return (
    <Ground n={5} hint={HINT} leave={3.05}>
      <Mono text={`Index · ${SAMPLE.chapter}`} y={L.topRule + 18} at={0.15} />
      <News lines={["In three steps"]} y={350} size={T.chapter} at={0.3} />
      <Rule y={y0 - 2} at={0.65} />
      {SAMPLE.list.map((item, i) => {
        const y = y0 + i * row;
        const at = 0.8 + i * 0.2;
        return (
          <React.Fragment key={i}>
            <Mono text={String(i + 1).padStart(2, "0")} y={y + 44} at={at} />
            <News lines={wrap(item, 18)} x={M + 120} y={y + 32} size={T.row + 10} at={at + 0.06} leading={1.08} />
            <Mono text={["↓", "↗", "↓"][i]} x={W - M} y={y + 34} at={at + 0.15} right size={48} />
            <Rule y={y + row - 2} at={at + 0.2} faint={i < 2} />
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const lines = wrap(SAMPLE.end.line, 8);
  return (
    <Ground n={6} hint={HINT}>
      <Mono text="Colophon" y={L.topRule + 18} at={0.15} x={W - M} right />
      <Glitch y={U * 38} rows={12} at={0.5} seed={3} alpha={0.34} w={W * 0.7} from="left" />
      <News lines={lines} x={W - M} y={420} size={T.closing + 20} at={0.35} right leading={0.98} />
      <Rule x={W - M - U * 8} y={850} w={U * 8} at={1.1} />
      <Mono text={SAMPLE.end.cta} x={W - M} y={876} at={1.25} right />
      <Mono text={plain(SAMPLE.title)} x={W - M} y={918} at={1.3} right col={C.soft} />
      <Patch x={W - M - 160} y={1290} at={1.45} seed={23} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.3, hero: 2.7, component: Title },
  { id: "headline", duration: 3.3, hero: 2.7, component: Headline },
  { id: "diagram", duration: 3.8, hero: 3.2, component: Diagram },
  { id: "number", duration: 3.3, hero: 2.7, component: NumberSample },
  { id: "list", duration: 3.3, hero: 2.7, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];

