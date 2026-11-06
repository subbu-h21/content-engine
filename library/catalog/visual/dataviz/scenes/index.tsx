/**
 * Data Story on the shared sample content, one idea per sample and every mark computed from (700 ÷ λ)⁴: the question
 * over empty axes with the first dot, the visible range as stripes, the full curve with a doodled molecule in the
 * empty corner, the one number as two hatched bars at true scale, the steps on a pencil line, and the dashed next
 * cell.
 */
import React from "react";
import { clamp, lerp, plain, SAMPLE, wrap, type Sample } from "../../kit";
import { Axes, C, Dot, E, ease, Figure, Graphite, Hand, makePlot, Mono, Paper, pencilPath, Pencil, PLOT, rampAt, REF, Ring, S, scatter, Serif, Stroke, T, useT, WAVES, M, type Plot } from "./parts";

const YT = [0, 2, 4, 6, 8, 10];
const XT = [400, 450, 500, 550, 600, 650, 700];
const X_LABEL = "wavelength, nm";
const Y_LABEL = "scattering, red = 1";
const every = S.motion.dataEvery;

/** Value colour: the ramp's cold half, pale for small values, deep for large ones. Encodes the value and nothing else. */
const valueColor = (v: number): string => rampAt(clamp(0.46 - (v / 10) * 0.46));

const curvePoints = (plot: Plot, list: number[]): [number, number][] => list.map((nm) => [plot.x(nm), plot.y(scatter(nm))]);

/** The series: the line follows the dots as they land (from 700 nm, the reference, to 400 nm). */
const Series: React.FC<{ plot: Plot; t: number; at: number }> = ({ plot, t, at }) => {
  const order = [...WAVES].reverse();
  const landed = order.filter((_, i) => t >= at + i * every);
  const pts = curvePoints(plot, landed);
  return (
    <g>
      {pts.length > 1 ? <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.ink} strokeWidth={E.series} strokeLinejoin="round" /> : null}
      {order.map((nm, i) => (
        <Dot key={nm} x={plot.x(nm)} y={plot.y(scatter(nm))} fill={valueColor(scatter(nm))} t={t} at={at + i * every} />
      ))}
    </g>
  );
};

const Title: React.FC = () => {
  const t = useT();
  const plot = makePlot({ ...PLOT, top: 860, bottom: 1250 });
  const px = plot.x(REF);
  const py = plot.y(1);
  return (
    <Paper>
      <Mono x={M} y={S.layout.safe.top + 40} size={T.kicker} weight={500}>
        {SAMPLE.kicker}
      </Mono>
      <Serif x={M} y={420} size={T.title}>
        Why is the
      </Serif>
      <Serif x={M} y={420 + T.title * T.leading} size={T.title}>
        sky blue?
      </Serif>
      <Graphite>
        <Ring x={M + T.title * 2.78} y={420 + T.title * T.leading - T.title * 0.27} rx={T.title * 1.32} ry={T.title * 0.6} lead={C.red} p={ease("ring", t - 1.2)} seed={4} width={5} />
      </Graphite>
      <Axes plot={plot} p={ease("draw", t - 0.3)} yTicks={[0, 5, 10]} xTicks={XT} xLabel={X_LABEL} yLabel={Y_LABEL} />
      <Dot x={px} y={py} fill={valueColor(1)} t={t} at={1.6} />
      <Graphite>
        <Stroke d={pencilPath([[px - 8, py - 26], [px - 34, py - 96], [px - 96, py - 128]], 5)} lead={C.blue} p={ease("draw", t - 1.8)} />
        <Hand text="red: our yardstick" x={px - 106} y={py - 142} anchor="end" p={ease("write", t - 2.0)} seed={8} />
      </Graphite>
      <Pencil x={px + 2} y={py + 2} lead={C.blue} />
    </Paper>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useT();
  const left = PLOT.left - 74;
  const right = PLOT.right;
  const n = 13;
  const w = (right - left) / n;
  const top = 840;
  const h = 300;
  const nmAt = (i: number) => 700 - i * 25;
  const bracket = ease("draw", t - 1.7);
  return (
    <Paper>
      <Serif x={M} y={330} size={T.display + 16}>
        Sunlight carries
      </Serif>
      <Serif x={M} y={330 + (T.display + 16) * T.leading} size={T.display + 16}>
        every colour
      </Serif>
      <Serif x={M} y={330 + 2 * (T.display + 16) * T.leading} size={T.display + 16}>
        at once.
      </Serif>
      {Array.from({ length: n }, (_, i) => {
        const p = ease("morph", t - 0.5 - i * 0.05);
        // the stripes run red to blue through the ramp's centre at 550 nm: here the value is the wavelength itself
        const u = 1 - i / (n - 1);
        const hh = h * p;
        return <rect key={i} x={left + i * w} y={top + (h - hh) / 2} width={w + 0.6} height={hh} fill={rampAt(u)} />;
      })}
      <rect x={left} y={top} width={right - left} height={h} fill="none" stroke={C.ink} strokeWidth={E.axis * 0.7} opacity={ease("morph", t - 1.1)} />
      {[700, 625, 550, 475, 400].map((nm) => {
        const i = (700 - nm) / 25;
        return (
          <Mono key={nm} x={left + (i + 0.5) * w} y={top + h + 44} anchor="middle" opacity={clamp((t - 1.2) / 0.2)}>
            {nm}
          </Mono>
        );
      })}
      <Mono x={right} y={top + h + 84} anchor="end" size={T.kicker} opacity={clamp((t - 1.3) / 0.2)}>
        {X_LABEL}
      </Mono>
      <Graphite>
        <Stroke d={pencilPath([[left + 4, top - 26], [left, top - 56], [right, top - 56], [right - 4, top - 26]], 6)} lead={C.blue} p={bracket} />
        <Hand text="all of these, together" x={(left + right) / 2} y={top - 84} anchor="middle" p={ease("write", t - 2.2)} seed={2} />
      </Graphite>
      <Figure kicker={`${nmAt(0)}–${nmAt(n - 1)} nm`} lines={["The stripes are the visible range,", "red to blue, in steps of 25 nm."]} t={t} at={2.4} />
    </Paper>
  );
};

/** The doodle in the chart's empty corner: an ink shape with hatching, sunlight in, blue out. */
const Doodle: React.FC<{ x: number; y: number; t: number; at: number }> = ({ x, y, t, at }) => {
  const r = 58;
  const pIn = ease("draw", t - at);
  const hatch = Array.from({ length: 9 }, (_, i) => {
    const o = -r + ((i + 0.5) / 9) * 2 * r;
    const half = Math.sqrt(Math.max(0, r * r - o * o)) * 0.92;
    return pencilPath([[x + o - half * 0.7, y + half * 0.7], [x + o + half * 0.7, y - half * 0.7]], 30 + i, 1.2);
  });
  const rays = [-0.25, 0.65, 1.55, 2.45, 3.35];
  return (
    <g>
      <Ring x={x} y={y} rx={r} lead={C.ink} p={ease("ring", t - at)} seed={9} />
      {hatch.map((d, i) => (
        <Stroke key={i} d={d} lead={C.ink} width={2.2} p={ease("ring", t - at - 0.1 - i * 0.02)} />
      ))}
      <Stroke d={pencilPath([[x - 270, y - 118], [x - 150, y - 76], [x - r - 14, y - 26]], 11)} lead={C.ink} p={pIn} />
      <Stroke d={pencilPath([[x - r - 40, y - 24], [x - r - 14, y - 26], [x - r - 30, y - 50]], 12, 0.8)} lead={C.ink} p={ease("ring", t - at - 0.6)} />
      <Hand text={SAMPLE.diagram.in} x={x - 300} y={y - 134} lead={C.ink} p={ease("write", t - at - 0.4)} seed={12} />
      {rays.map((a, i) => (
        <Stroke key={i} d={pencilPath([[x + (r + 16) * Math.cos(a), y + (r + 16) * Math.sin(a)], [x + (r + 92) * Math.cos(a), y + (r + 92) * Math.sin(a)]], 40 + i, 1.2)} lead={C.blue} p={ease("ring", t - at - 0.5 - i * 0.05)} />
      ))}
    </g>
  );
};

const Diagram: React.FC = () => {
  const t = useT();
  const plot = makePlot({ ...PLOT, top: 560, bottom: 1250 });
  const at = 0.35;
  const n = scatter(450);
  const dx = plot.x(450);
  const dy = plot.y(n);
  const last = at + WAVES.length * every;
  return (
    <Paper>
      <Serif x={M} y={330} size={T.display}>
        What an air molecule
      </Serif>
      <Serif x={M} y={330 + T.display * T.leading} size={T.display}>
        does to each colour
      </Serif>
      <Axes plot={plot} p={ease("draw", t - 0.05)} yTicks={YT} xTicks={XT} xLabel={X_LABEL} yLabel={Y_LABEL} />
      <Series plot={plot} t={t} at={at} />
      <Graphite>
        <Doodle x={plot.x(620)} y={plot.y(7.5)} t={t} at={last - 0.3} />
        <Ring x={dx} y={dy} rx={32} lead={C.blue} p={ease("ring", t - last)} seed={3} />
        <Stroke d={pencilPath([[dx + 26, dy + 26], [dx + 80, dy + 66], [dx + 120, dy + 72]], 7)} lead={C.blue} p={ease("draw", t - last - 0.1)} />
        <Hand text="scatters blue light" x={dx + 130} y={dy + 86} p={ease("write", t - last - 0.4)} seed={5} />
      </Graphite>
      <Figure kicker="400–700 nm" lines={["Scattering by air molecules grows as", "1 ÷ wavelength⁴. Red at 700 nm = 1."]} t={t} at={last + 0.3} />
    </Paper>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const plot = makePlot({ ...PLOT, left: 200, right: 940, top: 680, bottom: 1250 }, 6);
  const bars = [
    { nm: 450, v: scatter(450), x: 320, at: 0.5 },
    { nm: REF, v: scatter(REF), x: 660, at: 1.0 },
  ];
  const bw = 200;
  return (
    <Paper>
      <Serif x={M - 8} y={500} size={T.number} fill={C.red}>
        {`${n.value.toFixed(n.decimals)}${n.unit}`}
      </Serif>
      <Axes plot={plot} p={ease("draw", t - 0.1)} yTicks={[0, 1, 2, 3, 4, 5, 6]} />
      {bars.map((b) => {
        const p = ease("draw", t - b.at);
        const top = lerp(plot.bottom, plot.y(b.v), p);
        const hatch = Math.floor((plot.bottom - top) / E.hatch);
        return (
          <g key={b.nm}>
            <rect x={b.x} y={top} width={bw} height={plot.bottom - top} fill={valueColor(b.v)} />
            <Graphite>
              {Array.from({ length: hatch }, (_, i) => {
                const y = plot.bottom - (i + 0.5) * E.hatch;
                return <path key={i} d={pencilPath([[b.x + 8, y + 6], [b.x + bw - 8, y - 6]], i + b.nm, 1)} fill="none" stroke={C.ink} strokeWidth={1.3} opacity={0.32} />;
              })}
              <Stroke d={pencilPath([[b.x, plot.bottom], [b.x, top], [b.x + bw, top], [b.x + bw, plot.bottom]], b.nm, 1.4)} lead={C.ink} p={1} width={3.4} />
            </Graphite>
            <Mono x={b.x + bw / 2} y={plot.bottom + 46} anchor="middle" opacity={p}>
              {b.nm} nm
            </Mono>
          </g>
        );
      })}
      <Graphite>
        <Stroke d={pencilPath([[plot.left, plot.y(1)], [bars[1].x, plot.y(1)]], 8, 1)} lead={C.blue} dash="12 10" width={3} />
        <Stroke d={pencilPath([[bars[0].x + bw + 14, plot.y(bars[0].v) + 14], [bars[0].x + bw + 56, plot.y(bars[0].v) + 44], [bars[0].x + bw + 74, plot.y(bars[0].v) + 92]], 9)} lead={C.red} p={ease("draw", t - 1.6)} />
        <Hand text="blue: 5.9 reds tall" x={bars[0].x + bw + 40} y={plot.y(bars[0].v) + 146} lead={C.red} p={ease("write", t - 1.9)} seed={4} />
        <Hand text="red = 1" x={bars[1].x + bw / 2} y={plot.y(1) - 34} lead={C.blue} anchor="middle" p={ease("write", t - 2.0)} seed={6} />
      </Graphite>
      <Figure kicker="(700 ÷ 450)⁴ = 5.9" lines={wrap(n.caption.replace(/^more/, "More"), 36)} t={t} at={2.2} />
    </Paper>
  );
};

const List: React.FC = () => {
  const t = useT();
  const x = 170;
  const ys = [500, 850, 1200];
  const lineP = ease("draw", t - 0.2);
  const steps = SAMPLE.list.map((s, i) => ({ lines: wrap(s, 16), y: ys[i], at: 0.3 + i * 0.5 }));
  return (
    <Paper>
      <Mono x={M} y={S.layout.safe.top + 40} size={T.kicker} weight={500}>
        How the blue reaches you
      </Mono>
      <line x1={x} y1={ys[0] - 110} x2={x} y2={lerp(ys[0] - 110, ys[2] + 150, lineP)} stroke={C.ink} strokeWidth={E.axis} strokeLinecap="round" />
      {steps.map((s, i) => (
        <g key={i}>
          <Dot x={x} y={s.y} fill={valueColor(i === 1 ? scatter(450) : i === 2 ? scatter(400) : 1)} t={t} at={s.at} r={E.dot * 1.4} />
          <Mono x={x - 34} y={s.y + 9} anchor="end" opacity={clamp((t - s.at) / 0.2)}>
            {i + 1}
          </Mono>
          {s.lines.map((l, j) => (
            <Serif key={j} x={x + 60} y={s.y + 16 + j * T.display * T.leading} size={T.display - 6} opacity={clamp((t - s.at - 0.1) / 0.1)}>
              {l}
            </Serif>
          ))}
        </g>
      ))}
      <Graphite>
        <Ring x={x} y={ys[2]} rx={36} lead={C.red} p={ease("ring", t - 1.9)} seed={7} />
      </Graphite>
      <Pencil x={x + 2} y={ys[2] + 152} lead={C.red} />
    </Paper>
  );
};

const End: React.FC = () => {
  const t = useT();
  const line = plain(SAMPLE.end.line);
  const y0 = 1010;
  const cells = 6;
  const cw = 118;
  const x0 = M;
  const dash = ease("draw", t - 1.1);
  const nx = x0 + cells * cw;
  return (
    <Paper>
      <Serif x={M} y={560} size={T.title + 6}>
        {line.split(" ").slice(0, 2).join(" ")}
      </Serif>
      <Serif x={M} y={560 + (T.title + 6) * T.leading} size={T.title + 6}>
        {line.split(" ").slice(2).join(" ")}
      </Serif>
      <Graphite>
        <Stroke d={pencilPath([[M + 4, 560 + (T.title + 6) * T.leading + 26], [M + 340, 560 + (T.title + 6) * T.leading + 18]], 3)} lead={C.red} p={ease("draw", t - 0.6)} width={5} />
      </Graphite>
      {Array.from({ length: cells }, (_, i) => (
        <rect key={i} x={x0 + i * cw} y={y0} width={cw} height={180} fill={rampAt(i / (cells + 1) / 2)} opacity={ease("morph", t - 0.2 - i * 0.06)} />
      ))}
      <Graphite>
        <Stroke d={`M ${nx} ${y0} L ${nx + cw * 1.3} ${y0} L ${nx + cw * 1.3} ${y0 + 180} L ${nx} ${y0 + 180} Z`} lead={C.ink} width={3.4} dash="14 11" p={dash} />
        <Hand text="next?" x={nx + cw * 0.65} y={y0 + 108} anchor="middle" lead={C.blue} p={ease("write", t - 1.4)} seed={2} />
      </Graphite>
      <Mono x={M} y={y0 + 244} size={T.tick + 8} weight={500}>
        {SAMPLE.end.cta}
      </Mono>
      <Pencil x={nx + cw * 1.3 - 18} y={y0 + 196} lead={C.blue} />
    </Paper>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.95, component: Title },
  { id: "headline", duration: 3.6, hero: 3.3, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.4, component: Diagram },
  { id: "number", duration: 3.4, hero: 3.1, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.75, component: List },
  { id: "end", duration: 3.0, hero: 2.7, component: End },
];
