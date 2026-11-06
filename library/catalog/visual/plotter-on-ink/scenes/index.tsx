/** Plotter on Ink on the shared sample content, re-laid out for vertical: one sheet per sample, the pen always live. */
import React from "react";
import { clamp, fit, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { archivoEm, Board, Box, C, COLUMN, Dim, ease, Furniture, Karaoke, M, Note, Odometer, PenWrite, Plot, S, Serif, Slam, Spark, W, wave, type KWord, type Pt } from "./parts";

const T = S.type;
const E = S.elements;

/** A line as timed words (start, seconds per word); *stars* keep a keyword hot (signal). */
const timed = (line: string, start: number, per: number): KWord[] => words(line).map((w, i) => ({ text: w.text, at: start + i * per, end: start + (i + 0.85) * per, hot: w.em }));
const said = (rows: KWord[][], t: number) => rows.flat().filter((w) => w.at <= t).length;
const circle = (cx: number, cy: number, r: number, from = -Math.PI / 2): Pt[] => Array.from({ length: 73 }, (_, i) => [cx + r * Math.cos(from + (i / 72) * Math.PI * 2), cy + r * Math.sin(from + (i / 72) * Math.PI * 2)] as Pt);
const pad2 = (n: number) => String(n).padStart(2, "0");

const Title: React.FC = () => {
  const t = useSeconds();
  const all = words(SAMPLE.title);
  const row = timed(all.filter((w) => !w.em).map((w) => w.text).join(" "), 0.2, 0.16);
  const key = all.filter((w) => w.em).map((w) => w.text).join(" ");
  const size = Math.min(T.display, fit([key], COLUMN, T.display, archivoEm(100)));
  const y = 1000;
  const base = y + size * 0.36;
  return (
    <Board bookend pen={[W - M, base]}>
      <Furniture plate="01" title="the question" readout={{ label: "WORDS SAID", value: pad2(said([row], t) + (t >= 0.9 ? 1 : 0)), frac: (said([row], t) + (t >= 0.9 ? 1 : 0)) / 5, at: 0.2 }} />
      <Karaoke rows={[row]} x={M} y={700} size={T.row * 1.1} />
      <Slam text={key} size={size} y={y} at={0.9} end={1.4} morph hot />
      <Plot points={[[M, base + 16], [W - M, base + 16]]} at={1.6} dur={0.5} kind="construction" keepPen />
      <Note text="baseline" x={M} y={base + 36} at={1.9} />
      <Note text="wdth 62 → 100 · wght 900" x={W - M} y={base + 36} at={2.0} align="right" />
      <Serif x={M} y={1430} at={0.4}>
        {`fig. 0 — ${SAMPLE.topic.toLowerCase()}`}
      </Serif>
    </Board>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const [l1, l2] = SAMPLE.headline;
  const r1 = timed(l1, 0.2, 0.36);
  const w2 = timed(l2, 1.05, 0.3);
  const plainRow = w2.filter((w) => !w.hot);
  const hotRow = w2.filter((w) => w.hot).map((w, i) => ({ ...w, at: 1.85 + i * 0.22, end: 1.85 + i * 0.22 + (i ? 0.4 : 0.15) }));
  const next = timed(SAMPLE.body.split(" ").slice(0, 3).join(" "), 2.75, 0.05);
  const size = T.row * 1.2;
  const hotSize = T.emphasis * 1.2;
  const y0 = 600;
  const yHot = y0 + 2 * size * T.leading + 30;
  const uY = yHot + hotSize * 0.98;
  const uEnd = M + 7 * hotSize * 0.6;
  const p = clamp((t - 2.2) / 0.5);
  return (
    <Board pen={[M + (uEnd - M) * p, uY]}>
      <Furniture plate="02" title={SAMPLE.chapter} readout={{ label: "WORDS SAID", value: pad2(said([r1, plainRow, hotRow], t)), frac: said([r1, plainRow, hotRow], t) / 7, at: 0.2 }} />
      <Karaoke rows={[r1, plainRow]} x={M} y={y0} size={size} />
      <Karaoke rows={[hotRow]} x={M} y={yHot} size={hotSize} weight={900} />
      <Plot points={[[M, uY], [uEnd, uY]]} at={2.2} dur={0.5} kind="signal" width={3} />
      <Karaoke rows={[next]} x={M} y={uY + 90} size={T.row * 0.85} />
      <Note text="visible light: 380–700 nm" x={M} y={uY + 220} at={1.4} />
    </Board>
  );
};

const Diagram: React.FC = () => {
  const [cx, cy] = [540, 800];
  const blue = 60;
  const red = blue * (700 / 450);
  const white = 76;
  const angles = [0, 40, 140, 180, 220, 320].map((d) => (d * Math.PI) / 180);
  const rayAt = (i: number) => 1.0 + i * 0.15;
  const label = timed(SAMPLE.diagram.label.replace(/blue light/i, "*blue light*"), 1.95, 0.16);
  return (
    <Board pen={[M + 300, 1490]}>
      <Furniture plate="03" title="how it works" />
      <Note text={`${SAMPLE.diagram.in} in`} x={cx + 40} y={330} at={0.1} spaced />
      <Plot points={wave([cx, 340], [cx, cy - 135], white, 14)} at={0.2} dur={0.5} />
      <Plot points={circle(cx, cy, 118)} at={0.7} dur={0.25} kind="construction" />
      <Plot points={circle(cx, cy, 42)} at={0.75} dur={0.2} kind="ink" width={2} />
      <Plot points={wave([cx, cy + 135], [cx, 1190], red, 14)} at={0.95} dur={0.35} col={C.ash} />
      <Dim a={[cx + 46, cy + 135 + red]} b={[cx + 46, cy + 135 + 2 * red]} label="λ" at={1.3} side={1} />
      <Note text="λ 700 nm" x={cx + 40} y={1200} at={1.3} />
      {angles.map((a, i) => (
        <Plot key={i} points={wave([cx + 140 * Math.cos(a), cy + 140 * Math.sin(a)], [cx + 390 * Math.cos(a), cy + 390 * Math.sin(a)], blue, 10)} at={rayAt(i)} dur={0.3} kind="signal" width={1.6} />
      ))}
      <Note text="λ 450 nm" x={cx + 220} y={cy + 30} at={1.6} col={C.signal} />
      <Serif x={M} y={1225} at={1.1}>
        {`fig. 2 — ${SAMPLE.diagram.object.toLowerCase()}`}
      </Serif>
      <Karaoke rows={[label]} x={M} y={1300} size={T.row} />
      <PenWrite text={SAMPLE.diagram.out} x={M} y={1410} at={2.45} dur={0.75} size={T.caption * 1.4} />
      {/* the line is written; the pen moves on and underlines it */}
      <Plot points={[[M, 1492], [M + 560, 1488]]} at={3.25} dur={0.45} kind="ink" width={1.6} />
    </Board>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const unit = 128;
  const rows = [timed("more scattering for", 0.9, 0.22), timed("*blue* than red", 1.6, 0.22)];
  const bar = (id: string, y: number, units: number, col: string, alpha: number, at: number) => {
    const w = units * unit;
    const reveal = clamp((t - at - 0.2) / 0.4);
    return (
      <>
        <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <clipPath id={id}>
              <rect x={M} y={y} width={w * reveal} height={34} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`} stroke={col} strokeOpacity={alpha} strokeWidth={E.strokeWidth * E.strokeScale}>
            {Array.from({ length: Math.ceil((w + 34) / 14) }, (_, k) => (
              <line key={k} x1={M + k * 14} y1={y + 34} x2={M + k * 14 + 34} y2={y} />
            ))}
          </g>
        </svg>
        <Plot points={[[M, y], [M + w, y], [M + w, y + 34], [M, y + 34], [M, y]]} at={at} dur={0.35} kind="ink" pen={false} col={col} />
      </>
    );
  };
  return (
    <Board pen={[M + 5.9 * unit, 1300]}>
      <Furniture plate="04" title="by the numbers" readout={{ label: "RATIO", value: `${n.value.toFixed(n.decimals)}${n.unit}`, frac: 1, at: 1.2 }} />
      <Odometer value={n.value.toFixed(n.decimals)} unit={n.unit} size={T.number} y={600} at={0.15} per={0.22} />
      <Serif x={0} y={790} at={0.8} size={T.formula} col={C.bone} align="center">
        <span>(700 / 450)</span>
        <sup style={{ fontSize: "0.6em" }}>4</sup>
        <span> ≈ 5.9</span>
      </Serif>
      <Karaoke rows={rows} x={M} y={940} size={T.row * 0.95} />
      <Note text="blue · 450 nm" x={M} y={1150} at={1.4} spaced />
      {bar("po-b1", 1190, n.value, C.signal, E.strokes.signal, 1.5)}
      <Dim a={[M, 1252]} b={[M + n.value * unit, 1252]} label={n.value.toFixed(1)} at={1.9} side={1} />
      <Note text="red · 700 nm" x={M} y={1330} at={1.6} spaced />
      {bar("po-b2", 1370, 1, C.ash, E.strokes.hatch, 1.7)}
      <Dim a={[M, 1432]} b={[M + unit, 1432]} label="1.0" at={2.0} side={1} />
      <Spark x={M + n.value * unit + 14} y={1207} dir={0} />
    </Board>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const [bx, bw, bh] = [130, 820, 170];
  const ys = [470, 760, 1050];
  const done = ys.filter((_, i) => t >= 0.15 + i * 0.45).length;
  const tickPts: Pt[] = [[bx + bw - 92, ys[2] + 88], [bx + bw - 68, ys[2] + 112], [bx + bw - 28, ys[2] + 56]];
  return (
    <Board pen={[tickPts[2][0], tickPts[2][1]]}>
      <Furniture plate="05" title="in three steps" readout={{ label: "STEPS", value: `${done} / ${ys.length}`, frac: done / ys.length, at: 0.2 }} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.15 + i * 0.45;
        return (
          <Box key={i} x={bx} y={ys[i]} w={bw} h={bh} at={at}>
            <div style={{ position: "absolute", left: 34, top: bh / 2 - 40, fontFamily: `"Archivo", sans-serif`, fontWeight: 900, fontSize: 72, lineHeight: 1, color: C.signal, fontStretch: "87.5%", fontVariationSettings: "'wdth' 87.5", textShadow: `0 0 10px rgba(255,77,18,0.5)` }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <Note text={item.toUpperCase()} x={150} y={bh / 2 - 13} at={at + 0.25} col={C.bone} size={25} />
          </Box>
        );
      })}
      {[0, 1].map((i) => {
        const y0 = ys[i] + bh + 10;
        const y1 = ys[i + 1] - 10;
        const at = 0.55 + i * 0.45;
        const packets = Array.from({ length: 6 }, (_, k) => {
          const age = t - at - 0.3 - k * E.packetEvery;
          const y = y0 + ((age * E.packetSpeed) % (y1 - y0 + 40));
          return age > 0 && y < y1 - 6 ? <div key={k} style={{ position: "absolute", left: W / 2 - 2, top: y, width: 4, height: 16, backgroundColor: k % 2 ? C.ember : C.signal, boxShadow: `0 0 10px ${C.signal}` }} /> : null;
        });
        return (
          <React.Fragment key={i}>
            <Plot points={[[W / 2, y0], [W / 2, y1]]} at={at} dur={0.2} kind="ink" pen={false} />
            {packets}
          </React.Fragment>
        );
      })}
      <Plot points={tickPts} at={2.45} dur={0.4} kind="signal" width={3.5} />
      <Serif x={bx} y={ys[2] + bh + 60} at={1.6}>
        {"fig. 5 — the path of blue light"}
      </Serif>
    </Board>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const ws = words(SAMPLE.end.line);
  const lead = ws.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const s1 = fit([lead], COLUMN, T.display, archivoEm(75));
  const s2 = fit([em], COLUMN, T.display, archivoEm(125));
  const [sx, sy] = [540, 1330];
  const age = t - 1.95;
  const ringP = age > 0 ? ease("ring", age) : 0;
  const ringR = S.motion.recipes.ring.from + (S.motion.recipes.ring.to - S.motion.recipes.ring.from) * ringP;
  const ringI = age > 0 ? Math.pow(Math.max(0, 1 - age / S.motion.recipes.ring.duration), 1.5) : 0;
  return (
    <Board bookend pen={[sx, sy]}>
      <Furniture plate="06" title="end" readout={{ label: "FACTS TODAY", value: "01", frac: 1, at: 0.3 }} />
      <Slam text={lead} size={s1} y={640} at={0.1} end={0.6} wdth={75} />
      <Slam text={em} size={s2} y={640 + s1 * 0.5 + s2 * 0.55} at={0.75} end={1.3} wdth={125} morph hot />
      <PenWrite text={SAMPLE.end.cta} x={0} y={1100} at={1.35} dur={0.55} size={T.caption * 1.5} align="center" />
      {ringI > 0 ? (
        <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={sx} cy={sy} r={ringR} fill="none" stroke={C.signal} strokeWidth={3} opacity={ringI} style={{ filter: `drop-shadow(0 0 12px ${C.signal})` }} />
        </svg>
      ) : null}
      {t > 1.9 ? <Spark x={sx} y={sy} dir={-Math.PI / 2} trail={20} /> : null}
    </Board>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.4, component: Title },
  { id: "headline", duration: 3.2, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.9, hero: 3.45, component: Diagram },
  { id: "number", duration: 3, hero: 2.5, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.7, component: List },
  { id: "end", duration: 2.8, hero: 2.3, component: End },
];
