/** Red Paper-cut on the shared sample content: title, headline, diagram, number, list, end card. */
import React, { useMemo } from "react";
import { fit, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Banner, C, circle, CutText, ease, H, KnockBanner, Layer, M, Piece, poly, Pop, Printed, Rosette, S, ScissorClip, sawStrip, Sheet, step, strip, village, W, type Pt } from "./parts";
import { SERIF } from "./fonts";

const T = S.type;
const E = S.elements;
const ONE = 1 / E.stepFps;
const per = S.motion.stagger;
const apart = S.motion.recipes.unfold.apart;
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");

/** The sawtooth border strips at the top and bottom of a rice-paper sheet. */
const Borders: React.FC<{ at?: number }> = ({ at = 0 }) => (
  <Layer>
    <Pop at={at} cx={W / 2} cy={0}>
      <Piece d={sawStrip(0, S.layout.border - 16, true)} fill={C.red} />
    </Pop>
    <Pop at={at} cx={W / 2} cy={H}>
      <Piece d={sawStrip(H - S.layout.border + 16, S.layout.border - 16, false)} fill={C.red} />
    </Pop>
  </Layer>
);

const Title: React.FC = () => {
  const lines = wrap(lead(SAMPLE.title).toUpperCase(), 7);
  const size = T.title;
  const t0 = 1.25;
  return (
    <Sheet>
      <Borders />
      <Printed text={SAMPLE.kicker} y={262} at={0.1} />
      <Layer>
        <Rosette cx={540} cy={650} r={325} at={0.2} id="ti-ro" />
      </Layer>
      {lines.map((l, i) => (
        <CutText key={i} text={l} y={1150 + i * size} size={size} at={t0 + lines.slice(0, i).join("").replace(/ /g, "").length * per} slit />
      ))}
      <KnockBanner text={em(SAMPLE.title).toUpperCase()} cx={540} cy={1150 + lines.length * size + 30} size={T.knockout} at={2.1} id="ti-kb" />
    </Sheet>
  );
};

/** An accordion strip of seven panels that unfolds one fold every `apart` s; each panel has a wave slit, longest first. */
const Chain: React.FC<{ x0: number; y0: number; y1: number; w: number; at: number }> = ({ x0, y0, y1, w, at }) => {
  const t = useSeconds() - at;
  const nm = [700, 620, 580, 530, 490, 450, 400];
  const panels = useMemo(
    () =>
      nm.map((lam) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= 12; i++) pts.push([(w * i) / 12, y0 - (i % 2 ? 14 : 0)]);
        for (let i = 12; i >= 0; i--) pts.push([(w * i) / 12, y1 + (i % 2 ? 14 : 0)]);
        const ya = y0 + 58;
        const yb = y1 - 58;
        const L = lam * 0.16;
        const left: Pt[] = [];
        const right: Pt[] = [];
        for (let y = ya; y <= yb; y += 4) {
          const u = (y - ya) / (yb - ya);
          const hw = 4.5 * Math.min(1, 6 * u, 6 * (1 - u)) + 0.5;
          const x = w / 2 + w * 0.22 * Math.sin((2 * Math.PI * (y - ya)) / L);
          left.push([x - hw, y]);
          right.push([x + hw, y]);
        }
        const dia = (y: number) => poly([[w / 2, y - 12], [w / 2 + 9, y], [w / 2, y + 12], [w / 2 - 9, y]]);
        return `${poly(pts)} ${poly([...left, ...right.reverse()])} ${dia(y0 + 30)} ${dia(y1 - 30)}`;
      }),
    [w, y0, y1],
  );
  if (t < 0) return null;
  const ps = nm.map((_, i) => (i === 0 ? 1 : ease("unfold", t - 2 * ONE - (i - 1) * apart)));
  const cy = (y0 + y1) / 2;
  let th = 0;
  let hinge = x0;
  const out: React.ReactNode[] = [];
  ps.forEach((p, i) => {
    if (i > 0) th += (i % 2 ? 1 : -1) * Math.PI * (1 - p);
    const c = Math.cos(th);
    const s = Math.abs(Math.sin(th));
    const fill = c < 0 ? C.back : i % 2 ? C.near : C.red;
    out.push(
      <g key={i} transform={`translate(${hinge.toFixed(2)} ${cy}) scale(${c.toFixed(4)} ${(1 + 0.1 * s).toFixed(4)}) translate(0 ${-cy})`}>
        <path d={panels[i]} fill={fill} fillRule="evenodd" />
        {i > 0 ? <line x1={0} y1={y0} x2={0} y2={y1} stroke={C.far} strokeOpacity={0.35} strokeWidth={1.2} /> : null}
      </g>,
    );
    hinge += w * c;
  });
  const sc = step(t) < ONE ? E.pop : 1;
  return (
    <g filter="url(#rp-cut)" transform={`translate(${x0} ${cy}) scale(${sc}) translate(${-x0} ${-cy})`}>
      {out}
    </g>
  );
};

const HeadlineSample: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const ld = lead(l2);
  const size = fit([l1, ld], W - 2 * M, T.display, 0.56);
  const y = 430;
  const kb = y + size * 2.15;
  return (
    <Sheet>
      <Printed text={SAMPLE.chapter} y={262} at={0.05} />
      <CutText text={l1} y={y} size={size} by="word" at={0.15} />
      <CutText text={ld} y={y + size * T.leading} size={size} by="word" at={0.15 + 2 * per} />
      <KnockBanner text={em(l2)} cx={540} cy={kb} size={size * 1.05} at={0.55} id="hl-kb" />
      <Layer>
        <Chain x0={92} y0={870} y1={1250} w={128} at={0.9} />
        <Rosette cx={150} cy={850} r={88} at={0.8} id="hl-sun" />
      </Layer>
      <Banner x0={70} y0={1415} x1={1010} y1={1570} at={2.6}>
        {SAMPLE.body}
      </Banner>
    </Sheet>
  );
};

const Diagram: React.FC = () => {
  const d = SAMPLE.diagram;
  const [mx, my] = [590, 990];
  const sun: Pt = [220, 420];
  const v = useMemo(() => village(1700, 7), []);
  const a = (deg: number, r: number): Pt => [mx + r * Math.cos((deg * Math.PI) / 180), my + r * Math.sin((deg * Math.PI) / 180)];
  const rays = [-100, -15, 15, 40, 85, 115, 145, 175, -155];
  return (
    <Sheet ground={C.night}>
      <Layer>
        <Piece d={v.far} fill={C.nightFar} />
        <Piece d={v.houses} fill={C.houses} />
        <Piece d={v.near} fill={C.nightNear} />
        <Pop at={0.5} cx={sun[0]} cy={sun[1]}>
          <Piece d={strip([sun[0] + 60, sun[1] + 95], a(-124, 135), 70, 44, 16, 7)} fill={C.red} />
        </Pop>
        <Pop at={1.15} cx={mx} cy={my}>
          <Piece d={strip(a(56, 135), a(56, 345), 44, 14, 16, 7)} fill={C.near} />
        </Pop>
        {rays.map((deg, i) => (
          <Pop key={i} at={1.3 + i * ONE} cx={mx} cy={my}>
            <Piece d={strip(a(deg, 140), a(deg, 330 - (i % 2) * 50), 34, 8, 12, 5)} fill={C.snow} />
          </Pop>
        ))}
        <Pop at={0.85} cx={mx} cy={my}>
          <Piece d={`${circle(mx - 60, my, 106, 48)} ${poly([[mx - 82, my - 22], [mx - 38, my - 22], [mx - 38, my + 22], [mx - 82, my + 22]])}`} fill={C.red} slit />
        </Pop>
        <Pop at={0.85 + ONE} cx={mx} cy={my}>
          <Piece d={`${circle(mx + 60, my, 106, 48)} ${poly([[mx + 38, my - 22], [mx + 82, my - 22], [mx + 82, my + 22], [mx + 38, my + 22]])}`} fill={C.near} slit />
        </Pop>
        <Rosette cx={sun[0]} cy={sun[1]} r={130} at={0.05} id="dg-sun" />
      </Layer>
      <Banner x0={380} y0={330} x1={650} y1={410} at={0.7} size={T.label}>
        {d.in}
      </Banner>
      <Banner x0={610} y0={690} x1={970} y1={770} at={1.1} size={T.label}>
        {d.object}
      </Banner>
      <Banner x0={150} y0={1370} x1={930} y1={1455} at={2.0} size={T.label}>
        {d.out}
      </Banner>
    </Sheet>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const len = W - 2 * M;
  return (
    <Sheet>
      <Printed text="By the numbers" y={262} at={0.05} />
      <CutText text={`${n.value.toFixed(n.decimals)}${n.unit}`} y={760} size={T.number} at={0.2} slit />
      <Banner x0={80} y0={870} x1={1000} y1={1015} at={0.8}>
        {n.caption}
      </Banner>
      <Printed text="Blue · 450 nm" y={1210} at={1.2} ink={C.nightNear} italic={false} x={M} align="left" size={T.label} />
      <Printed text="Red · 700 nm" y={1460} at={1.4} ink={C.heavy} italic={false} x={M} align="left" size={T.label} />
      <Layer>
        <ScissorClip id="nb-c1" x0={M} x1={M + len} at={1.25} />
        <ScissorClip id="nb-c2" x0={M} x1={M + len / n.value} at={1.45} dur={0.3} />
        <g clipPath="url(#nb-c1)">
          <Piece d={strip([M, 1285], [M + len, 1285], 86, 86, 10, 7)} fill={C.nightNear} />
        </g>
        <g clipPath="url(#nb-c2)">
          <Piece d={strip([M, 1535], [M + len / n.value, 1535], 86, 86, 38, 18)} fill={C.red} />
        </g>
      </Layer>
    </Sheet>
  );
};

/** A small round medallion with its number knocked out. */
const Medallion: React.FC<{ cx: number; cy: number; r: number; n: number; at: number }> = ({ cx, cy, r, n, at }) => {
  const d = useMemo(() => {
    const k = 48;
    const rim = poly(Array.from({ length: k }, (_, i): Pt => {
      const a = (i * 2 * Math.PI) / k;
      const rr = i % 2 ? r * 0.92 : r;
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    }));
    let slits = "";
    for (let i = 0; i < 16; i++) {
      const a = ((i + 0.5) * 2 * Math.PI) / 16;
      const p = (rr: number, da = 0): Pt => [cx + rr * Math.cos(a + da), cy + rr * Math.sin(a + da)];
      slits += poly([p(r * 0.74), p(r * 0.8, 0.05), p(r * 0.86), p(r * 0.8, -0.05)]) + " ";
    }
    return `${rim} ${slits}`;
  }, [cx, cy, r]);
  const id = `md-${n}`;
  return (
    <Pop at={at} cx={cx} cy={cy}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect width={W} height={H} fill="#fff" />
          <text x={cx} y={cy + r * 0.36} textAnchor="middle" fill="#000" style={{ fontFamily: SERIF, fontWeight: 800, fontSize: r }}>
            {n}
          </text>
        </mask>
      </defs>
      <g filter="url(#rp-cut)">
        <g mask={`url(#${id})`}>
          <path d={d} fill={C.red} fillRule="evenodd" />
        </g>
      </g>
    </Pop>
  );
};

const List: React.FC = () => (
  <Sheet>
    <Borders />
    <Printed text="In three steps" y={262} at={0.05} />
    {SAMPLE.list.map((item, i) => {
      const y = 600 + i * 370;
      const at = 0.3 + i * 0.4;
      return (
        <React.Fragment key={i}>
          <Banner x0={190} y0={y - 72} x1={1000} y1={y + 72} at={at + ONE}>
            {item}
          </Banner>
          <Layer>
            <Medallion cx={160} cy={y} r={96} n={i + 1} at={at} />
          </Layer>
        </React.Fragment>
      );
    })}
  </Sheet>
);

const End: React.FC = () => {
  const v = useMemo(() => village(1720, 3), []);
  const flecks = useMemo(() => {
    const out: { d: string; at: number; x: number; y: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * 2 * Math.PI + 0.2;
      const r = 345 + (i % 3) * 22;
      const [x, y] = [540 + r * Math.cos(a), 600 + r * Math.sin(a) * 0.9];
      const s = 13 + (i % 2) * 7;
      const pts: Pt[] = Array.from({ length: 8 }, (_, k) => {
        const rr = k % 2 ? s * 0.38 : s;
        const b = (k * Math.PI) / 4;
        return [x + rr * Math.cos(b), y + rr * Math.sin(b)];
      });
      out.push({ d: poly(pts), at: 2.0 + (i % 6) * ONE, x, y });
    }
    return out;
  }, []);
  return (
    <Sheet ground={C.night}>
      <Layer>
        <Piece d={v.far} fill={C.nightFar} />
        {v.windows.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={C.light2} />
        ))}
        <Piece d={v.houses} fill={C.houses} />
        <Piece d={v.near} fill={C.nightNear} />
        <Rosette cx={540} cy={600} r={280} at={0.05} id="en-ro" lit />
        {flecks.map((f, i) => (
          <Pop key={i} at={f.at} cx={f.x} cy={f.y}>
            <Piece d={f.d} fill={C.gold} />
          </Pop>
        ))}
      </Layer>
      <CutText text={lead(SAMPLE.end.line).toUpperCase()} y={1120} size={T.title} at={1.0} fill={C.cream} slit />
      <KnockBanner text={em(SAMPLE.end.line).toUpperCase()} cx={540} cy={1265} size={T.knockout * 0.9} at={1.6} id="en-kb" />
      <Printed text={SAMPLE.end.cta} y={1440} at={2.4} ink={C.cream} size={40} />
    </Sheet>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 3.0, component: Title },
  { id: "headline", duration: 3.7, hero: 3.3, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.8, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.4, component: NumberSample },
  { id: "list", duration: 2.6, hero: 2.1, component: List },
  { id: "end", duration: 3.3, hero: 2.9, component: End },
];

