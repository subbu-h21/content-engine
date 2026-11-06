/** Blueprint on the shared sample content: one sheet, read like an eye, drawn in drafting order. */
import React from "react";
import { clamp, fit, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { arc, Arrow, Art, Balloon, C, Dim, E, ease, Field, Fig, Ground, Hatch, Header, Letter, Line, M, Note, O, rect, S, ScaleBar, TitleBlock, Stamp, W, type Pt } from "./parts";
import { SIGN } from "./fonts";

const COLUMN = W - 2 * M;
const FOOT = 1640; // the scale bar sits below the safe zone, where there is no text
const TOTAL = 6;

const block = (sheet: number, status: string) => ({ title: SAMPLE.topic, drawn: `Drawn by ${SAMPLE.kicker}`, sheet: `Sheet ${sheet} of ${TOTAL}`, status });

const Title: React.FC = () => {
  const t = useSeconds();
  const lines = wrap(SAMPLE.title, 7);
  const size = fit(lines, COLUMN - 80, S.type.title, S.type.charEm);
  // a section through the sky: ground, the top of the air, the sun, one molecule
  const [gx, gy, gr, ar] = [540, 2300, 1000, 1310];
  const span = 0.47;
  const ground = arc(gx, gy, gr, -Math.PI / 2 - span, -Math.PI / 2 + span, 60).filter(([x]) => x >= M + 34 && x <= W - M - 34);
  const air = arc(gx, gy, ar, -Math.PI / 2 - 0.36, -Math.PI / 2 + 0.36, 60);
  const sun: Pt = [800, 860];
  const mol: Pt = [410, 1160];
  const shape: Pt[] = [...ground, [ground[ground.length - 1][0], 1420], [ground[0][0], 1420]];
  const beam = [sun[0] - mol[0], sun[1] - mol[1]];
  const bl = Math.hypot(beam[0], beam[1]);
  const [ux, uy] = [beam[0] / bl, beam[1] / bl];
  const head = clamp((t - O.detail - 0.6) / 0.15);
  return (
    <Ground table>
      <Header lines={lines} size={size} y={268} at={0.15} />
      <Art>
        <Line pts={[[gx, 860], [gx, 1420]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[sun[0] - 110, sun[1]], [sun[0] + 110, sun[1]]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[sun[0], sun[1] - 110], [sun[0], sun[1] + 110]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={ground} w="outline" at={O.outline} />
        <Line pts={arc(sun[0], sun[1], 76)} w="outline" at={O.outline} />
        <Line pts={air} w="thin" dash="phantom" at={O.outline + 0.2} />
        <Hatch shape={shape} at={O.hatch} />
        <Line pts={[[sun[0] - ux * 76, sun[1] - uy * 76], [mol[0] + ux * 26, mol[1] + uy * 26]]} w="detail" at={O.detail} />
        <Arrow tip={[mol[0] + ux * 26, mol[1] + uy * 26]} dir={[-ux, -uy]} opacity={head} />
        <Line pts={arc(mol[0], mol[1], 24)} w="outline" at={O.detail + 0.3} paper />
      </Art>
      <Balloon x={630} y={860} n={1} to={[sun[0] - 78, sun[1]]} label={SAMPLE.diagram.in} left at={O.dims} />
      <Balloon x={M + 70} y={950} n={2} to={[mol[0] - 22, mol[1] - 22]} label={SAMPLE.diagram.object} at={O.dims + 0.2} />
      <TitleBlock {...block(1, "For checking")} at={0.4} />
      <ScaleBar y={FOOT - 20} />
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const lines = SAMPLE.headline.flatMap((l) => wrap(l, 12));
  const size = fit(lines, COLUMN - 40, S.type.display, S.type.charEm);
  // two waves drawn to one scale: 0.4 px per nanometre
  const k = 0.4;
  const wave = (nm: number, y: number, amp: number): Pt[] => {
    const lam = nm * k;
    return Array.from({ length: 121 }, (_, i): Pt => {
      const x = M + (COLUMN * i) / 120;
      return [x, y + amp * Math.sin(((x - M) / lam) * Math.PI * 2)];
    });
  };
  const [yb, yr, amp] = [1042, 1200, 34];
  return (
    <Ground>
      <Fig n={1} title={SAMPLE.chapter} />
      <Header lines={lines} size={size} y={320} at={0.15} rule={false} />
      <Art>
        <Line pts={[[M, yb], [M + COLUMN, yb]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[M, yr], [M + COLUMN, yr]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={wave(450, yb, amp)} w="outline" at={O.outline + 0.3} />
        <Line pts={wave(700, yr, amp)} w="outline" at={O.outline + 0.4} />
      </Art>
      <Dim a={[M + 45, yb - amp]} b={[M + 45 + 450 * k, yb - amp]} off={-20} label="450 nm" at={O.detail + 0.2} labelOff={6} />
      <Dim a={[M + 70, yr - amp]} b={[M + 70 + 700 * k, yr - amp]} off={-20} label="700 nm" at={O.hatch} labelOff={6} />
      <Note x={M + 26} y={1290} w={COLUMN - 26} n={1} lines={wrap(SAMPLE.body, 34)} at={1.5} />
      <ScaleBar y={FOOT} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const [cx, cy] = [540, 880];
  const r = 104;
  const off = 84;
  // the molecule as an outline drawing: two atoms sharing one contour
  const a = Math.acos(off / r);
  const contour: Pt[] = [...arc(cx - off, cy, r, a, Math.PI * 2 - a, 60), ...arc(cx + off, cy, r, Math.PI + a, Math.PI * 3 - a, 60)];
  contour.push(contour[0]);
  const rays = Array.from({ length: 8 }, (_, i) => (Math.PI * 2 * i) / 8 + Math.PI / 8);
  const start: Pt = [150, 390];
  const hit: Pt = [cx - off - r * 0.72, cy - r * 0.72];
  const dir: Pt = [hit[0] - start[0], hit[1] - start[1]];
  const onBeam: Pt = [start[0] + dir[0] * 0.2, start[1] + dir[1] * 0.2];
  const lowRay = (Math.PI * 5) / 8;
  const onRay: Pt = [cx + 300 * Math.cos(lowRay), cy + 300 * Math.sin(lowRay)];
  return (
    <Ground>
      <Fig n={2} was={1} title="How it works" />
      <Art>
        <Line pts={[[cx - 310, cy], [cx + 310, cy]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[cx - off, cy - 170], [cx - off, cy + 170]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[cx + off, cy - 170], [cx + off, cy + 170]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={contour} w="outline" at={O.outline} paper />
        <Hatch shape={contour.slice(0, -1).filter(([x]) => x >= cx)} at={O.hatch} />
        <Line pts={[[cx, cy - 70], [cx, cy + 70]]} w="thin" at={O.detail} />
        <Line pts={[start, hit]} w="outline" at={O.detail} />
        <Arrow tip={hit} dir={dir} size={30} opacity={clamp((t - O.detail - 0.6) / 0.15)} />
        <Line pts={arc(cx, cy, 400, 0, Math.PI * 2, 120)} w="thin" dash="phantom" at={O.dims} />
        {rays.map((ang, i) => {
          const [u, v] = [Math.cos(ang), Math.sin(ang)];
          const [r0, r1] = [230, 372];
          const at = O.dims + 0.05 * i;
          return (
            <React.Fragment key={i}>
              <Line pts={[[cx + r0 * u, cy + r0 * v], [cx + r1 * u, cy + r1 * v]]} w="detail" at={at} />
              <Arrow tip={[cx + r1 * u, cy + r1 * v]} dir={[u, v]} opacity={clamp((t - at - 0.6) / 0.15)} />
            </React.Fragment>
          );
        })}
      </Art>
      <Balloon x={M + 130} y={330} n={1} to={onBeam} label={d.in} at={O.balloons - 0.4} />
      <Balloon x={760} y={460} n={2} to={[cx + off + 60, cy - 84]} label={undefined} at={O.balloons - 0.2} />
      <Letter text={d.object.toUpperCase()} x={704} y={374} size={S.type.label} at={O.balloons + 0.25} />
      <Balloon x={M + 70} y={1350} n={3} to={onRay} label={d.label} at={O.balloons} />
      <Note x={M + 26} y={1430} w={COLUMN - 26} n={2} lines={[d.out]} at={O.balloons + 0.3} size={S.type.body} />
      <ScaleBar y={FOOT} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.3);
  const unit = 124;
  const base = 1500;
  const blueH = n.value * unit * ease("snap", t - O.outline);
  const redH = unit * ease("snap", t - O.outline - 0.1);
  const [bx, rx, bw] = [250, 520, 180];
  return (
    <Ground>
      <Fig n={3} was={2} title="By the numbers" />
      <Letter text={`${(n.value * p).toFixed(n.decimals)}${n.unit}`} x={M - 6} y={304} size={S.type.number} spacing={2} at={0.1} />
      <Art>
        <Line pts={[[M, 590], [M + 500, 590]]} w="outline" at={1.3} />
        <Line pts={[[M, 602], [M + 500, 602]]} w="thin" at={1.4} />
        <Line pts={[[M, base], [M + COLUMN, base]]} w="outline" at={O.centre} />
        <Line pts={[[bx + bw / 2, base + 20], [bx + bw / 2, 740]]} w="hair" dash="centre" at={O.centre} />
        <Line pts={[[rx + bw / 2, base + 20], [rx + bw / 2, base - unit - 40]]} w="hair" dash="centre" at={O.centre} />
        {blueH > 1 ? <path d={`M${bx} ${base}V${base - blueH}H${bx + bw}V${base}`} fill="none" stroke={C.line} strokeWidth={4} /> : null}
        {redH > 1 ? <path d={`M${rx} ${base}V${base - redH}H${rx + bw}V${base}`} fill="none" stroke={C.line} strokeWidth={4} /> : null}
        <Hatch shape={rect(bx, base - n.value * unit, bw, n.value * unit).slice(0, 4)} at={O.hatch} />
        <Hatch shape={rect(rx, base - unit, bw, unit).slice(0, 4)} at={O.hatch + 0.1} spacing={30} />
      </Art>
      <Dim a={[bx, base - n.value * unit]} b={[bx, base]} off={46} label="" at={O.dims} />
      <Letter text={`${n.value}${n.unit}`} x={M} y={base - (n.value * unit) / 2 - 22} size={S.type.label + 6} at={O.dims + 0.5} />
      <Dim a={[rx + bw, base]} b={[rx + bw, base - unit]} off={46} label={`1${n.unit}`} at={O.dims + 0.1} labelOff={16} />
      <Field text="Blue · 450 nm" x={bx + bw / 2} y={base + 24} size={26} at={O.labels - 0.4} center />
      <Field text="Red · 700 nm" x={rx + bw / 2} y={base + 24} size={26} at={O.labels - 0.3} center />
      <Note x={470} y={760} w={W - M - 470} n={3} lines={wrap(n.caption.replace(/ nm/g, "_nm"), 21).map((l) => l.replace(/_/g, " "))} at={1.4} size={36} />
      <ScaleBar y={FOOT} />
    </Ground>
  );
};

const List: React.FC = () => {
  const size = 56;
  const [y0, rowH] = [470, 320];
  const [x1, x2] = [M + 130, W - M];
  return (
    <Ground>
      <Fig n={4} was={3} title="In three steps" />
      <Letter text="GENERAL NOTES" x={M} y={330} size={72} spacing={S.type.tracking} at={0.3} />
      <Art>
        <Line pts={rect(M, y0, x2 - M, rowH * 3)} w="outline" at={0.35} />
        <Line pts={[[x1, y0], [x1, y0 + rowH * 3]]} w="thin" at={0.6} />
        <Line pts={[[M, y0 + rowH], [x2, y0 + rowH]]} w="thin" at={0.7} />
        <Line pts={[[M, y0 + rowH * 2], [x2, y0 + rowH * 2]]} w="thin" at={0.8} />
      </Art>
      {SAMPLE.list.map((item, i) => {
        const y = y0 + i * rowH;
        const once = wrap(item, 26);
        const rows = once.length > 1 ? wrap(item, Math.ceil(item.length / once.length) + 4) : once;
        const at = 0.9 + i * 0.5;
        return (
          <React.Fragment key={i}>
            <Art>
              <Line pts={arc(M + 65, y + rowH / 2, 36)} w="detail" at={at} paper />
              {i < 2 ? <Line pts={[[M + 65, y + rowH / 2 + 36], [M + 65, y + rowH + rowH / 2 - 36]]} w="thin" dash="hidden" at={at + 0.3} /> : null}
            </Art>
            <Field text={String(i + 1)} x={M + 65} y={y + rowH / 2 - 18} size={32} bold at={at + 0.2} center />
            {rows.map((l, j) => (
              <Letter key={j} text={l} x={x1 + 30} y={y + rowH / 2 + (j - rows.length / 2) * size * 1.22 + 2} size={size} at={at + 0.15 + j * 0.3} />
            ))}
          </React.Fragment>
        );
      })}
      <ScaleBar y={FOOT} />
    </Ground>
  );
};

const End: React.FC = () => {
  const lines = wrap(SAMPLE.end.line, 7);
  const size = fit(lines, COLUMN - 80, 170, S.type.charEm);
  const stampAt = 1.7;
  return (
    <Ground table bump={stampAt + 0.16}>
      <Header lines={lines} size={size} y={340} at={0.1} rule={false} />
      <Letter text={SAMPLE.kicker} x={M + 30} y={880} size={110} font={SIGN} at={1.0} />
      <Art>
        <Line pts={[[M, 1020], [M + 560, 1020]]} w="thin" at={0.95} />
      </Art>
      <Field text="Signed" x={M} y={1034} size={25} at={1.05} col={C.muted} />
      <Stamp x={330} y={1110} w={640} h={160} text={SAMPLE.end.cta} at={stampAt} />
      <TitleBlock {...block(6, "Approved")} at={0.3} />
      <ScaleBar y={FOOT - 20} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.6, hero: 3.2, component: Title },
  { id: "headline", duration: 3.6, hero: 3.2, component: HeadlineSample },
  { id: "diagram", duration: 3.8, hero: 3.4, component: Diagram },
  { id: "number", duration: 3.6, hero: 3.2, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.2, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
