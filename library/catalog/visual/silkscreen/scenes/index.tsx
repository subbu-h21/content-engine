/** Silkscreen on the shared sample content: one screen-printed poster per sample, each re-inked in a new palette. */
import React, { useMemo } from "react";
import { plain, SAMPLE, words, type Sample } from "../../kit";
import { ART, Band, C, disc, facets, figure, fitSize, forest, Ink, PAL, pickInk, Poster, rand, ridge, ring, S, stepped, sun, Txt, U, type Pal } from "./parts";

const T = S.type;
const G = S.motion.recipes.gap.duration;
const at = (i: number) => 0.12 + i * G;
const [B0, B1] = U.band;
const BX = U.border + 34;
const BW = U.w - 2 * U.border - 68;
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");

/** The standard info band: number in the sun ink, the name (auto-fit), a sun rule, then a row of stats. */
const infoBand = (pal: Pal, n: string, name: string, stats: { label: string; value: string; accent?: boolean }[], start: number, id: string) => {
  const paper = C.paper;
  const nameSize = fitSize(name, BW - 150, T.display, T.displayMin);
  const items: { col: string; node: React.ReactNode }[] = [
    { col: pal.sun, node: <Txt x={BX} y={B0 + 130} size={122} col={pal.sun}>{n}</Txt> },
    { col: paper, node: <Txt x={BX + 150} y={B0 + 120} size={nameSize} col={paper}>{name}</Txt> },
    { col: pal.sun, node: <rect x={BX} y={B0 + 156} width={BW} height={S.layout.bandRule} fill={pal.sun} /> },
  ];
  let x = BX;
  for (const s of stats) {
    const w = Math.max(s.label.length * T.label * 0.62, s.value.length * T.value * 0.44) + 56;
    const xx = x;
    items.push({
      col: paper,
      node: (
        <>
          <Txt x={xx} y={B0 + 216} size={T.label} col={paper} font="label" tracking={T.labelTracking}>
            {s.label}
          </Txt>
          <Txt x={xx} y={B0 + 290} size={T.value} col={s.accent ? pal.sun : paper} weight={800}>
            {s.value}
          </Txt>
        </>
      ),
    });
    x += w;
  }
  return <Band id={id} at={start} col={pal.near} items={items} />;
};

/** A noon-style landscape: far ridge with lit facets, a forest row, the near slope with a big pine. */
const Land: React.FC<{ pal: Pal; i0: number; id: string; farBase?: number; midBase?: number; seed?: number; figureAt?: [number, number] }> = ({ pal, i0, id, farBase = 790, midBase = 960, seed = 3, figureAt }) => {
  const g = useMemo(() => {
    const far = ridge(ART.x0, ART.x1, farBase, 150, seed, ART.y1, [
      [300, farBase - 170],
      [640, farBase - 120],
    ]);
    return {
      far: far.d,
      facet: facets(far.pts, [300, 640], -1, seed),
      mid: forest(ART.x0, ART.x1, midBase, seed + 5, 120),
      near: `M ${ART.x0} ${ART.y1} V ${midBase + 70} C 300 ${midBase + 40} 640 ${midBase + 120} ${ART.x1} ${midBase + 150} V ${ART.y1} Z ${figureAt ? figure(figureAt[0], figureAt[1], 150) : ""}`,
    };
  }, []);
  return (
    <>
      <Ink id={`${id}-far`} at={at(i0)} col={pal.far} d={g.far} reg={[1, 2]} />
      <Ink id={`${id}-fac`} at={at(i0) + G / 2} col={pal.sky1} d={g.facet} reg={[2, 1]} />
      <Ink id={`${id}-mid`} at={at(i0 + 1)} col={pal.mid} d={g.mid} reg={[-1, 1]} />
      <Ink id={`${id}-near`} at={at(i0 + 2)} col={pal.near} d={g.near} reg={[2, -1]} />
    </>
  );
};

const Title: React.FC = () => {
  const pal = PAL.noon;
  const head = SAMPLE.kicker.toUpperCase();
  return (
    <Poster>
      <Ink id="ti-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} />
      <Ink id="ti-sky2" at={at(1)} col={pal.sky2} d={stepped(ART.x0, ART.x1, ART.y0, 330, 640)} reg={[2, -1]} />
      <Ink id="ti-sun" at={at(1) + G / 2} col={pal.sun} d={sun(700, 420, 84)} rule="evenodd" reg={[-2, 1]} />
      <Land pal={pal} i0={2} id="ti" />
      <Ink id="ti-head" at={at(4) + G / 2} col={pickInk(pal.sky2, [pal.near, C.paper])} dir="right">
        <Txt x={U.w / 2} y={150} size={T.header} col={pickInk(pal.sky2, [pal.near, C.paper])} tracking={T.headerTracking} anchor="middle" weight={800}>
          {head}
        </Txt>
      </Ink>
      {infoBand(pal, "01", plain(SAMPLE.title).toUpperCase(), [
        { label: "BLUE", value: "450 NM" },
        { label: "RED", value: "700 NM" },
        { label: "SCATTERING", value: `${SAMPLE.number.value.toFixed(1)}${SAMPLE.number.unit}`, accent: true },
      ], at(5), "ti-b")}
    </Poster>
  );
};

const Headline: React.FC = () => {
  const pal = PAL.dawn;
  const [l1, l2] = SAMPLE.headline;
  const lead2 = words(l2).filter((w) => !w.em).map((w) => w.text).join(" ");
  const ink = pickInk(pal.sky2, [pal.near, C.paper]);
  // the longest line fits the art width (Big Shoulders 900 is about 0.5 em a character in capitals)
  const hs = Math.min(T.headline, Math.floor((ART.x1 - ART.x0 - 80) / (Math.max(l1.length, lead2.length) * 0.5)));
  const g = useMemo(() => {
    const far = ridge(ART.x0, ART.x1, 930, 120, 11, ART.y1, [[200, 800], [820, 820]]);
    const mid = ridge(ART.x0, ART.x1, 1010, 90, 12, ART.y1, [[520, 950]]);
    return { far: far.d, facet: facets(far.pts, [200, 820], 1, 11), mid: mid.d, near: `M ${ART.x0} ${ART.y1} V 1070 C 360 1040 700 1100 ${ART.x1} 1060 V ${ART.y1} Z` };
  }, []);
  return (
    <Poster>
      <Ink id="hl-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} />
      <Ink id="hl-sky2" at={at(1)} col={pal.sky2} d={stepped(ART.x0, ART.x1, ART.y0, 470, 760)} reg={[2, -1]} />
      <Ink id="hl-sun" at={at(1) + G / 2} col={pal.sun} d={sun(500, 930, 150)} rule="evenodd" reg={[-2, 1]} />
      <Ink id="hl-far" at={at(2)} col={pal.far} d={g.far} reg={[1, 2]} />
      <Ink id="hl-fac" at={at(2) + G / 2} col={pal.sky2} d={g.facet} reg={[2, 1]} />
      <Ink id="hl-mid" at={at(3)} col={pal.mid} d={g.mid} reg={[-1, 1]} />
      <Ink id="hl-near" at={at(4)} col={pal.near} d={g.near} reg={[2, -1]} />
      <Ink id="hl-head" at={at(4) + G / 2} col={ink} dir="right">
        <Txt x={U.w / 2} y={220} size={hs} col={ink} anchor="middle" tracking={0.01}>
          {l1.toUpperCase()}
        </Txt>
        <Txt x={U.w / 2} y={220 + hs} size={hs} col={ink} anchor="middle" tracking={0.01}>
          {lead2.toUpperCase()}
        </Txt>
        <Txt x={U.w / 2} y={260 + 2 * hs + hs * 0.3} size={hs * 1.3} col={ink} anchor="middle" tracking={0.01}>
          {em(l2).toUpperCase()}
        </Txt>
      </Ink>
      {infoBand(pal, "02", SAMPLE.chapter.toUpperCase(), [
        { label: "SUNLIGHT", value: "WHITE" },
        { label: "COLOURS IN IT", value: "ALL OF THEM", accent: true },
      ], at(5), "hl-b")}
    </Poster>
  );
};

const Diagram: React.FC = () => {
  const pal = PAL.noon;
  const [mx, my] = [560, 640];
  const sunXY: [number, number] = [210, 230];
  const d = SAMPLE.diagram;
  const ink = pal.near;
  const rays = [-60, -10, 40, 90, 140, 190].map((deg) => (deg * Math.PI) / 180);
  // dashes of the incoming route, stamped one after another
  const dashes = useMemo(() => {
    const out: string[] = [];
    const [sx, sy] = [sunXY[0] + 110, sunXY[1] + 100];
    const [ex, ey] = [mx - 110, my - 80];
    const L = Math.hypot(ex - sx, ey - sy);
    const ux = (ex - sx) / L;
    const uy = (ey - sy) / L;
    for (let s = 0; s + 26 <= L; s += 44) {
      const a = [sx + ux * s, sy + uy * s];
      const b = [sx + ux * (s + 26), sy + uy * (s + 26)];
      out.push(`M ${a[0] - uy * 8} ${a[1] + ux * 8} L ${b[0] - uy * 8} ${b[1] + ux * 8} L ${b[0] + uy * 8} ${b[1] - ux * 8} L ${a[0] + uy * 8} ${a[1] - ux * 8} Z`);
    }
    return out;
  }, []);
  const rayPath = rays
    .map((a) => {
      const r0 = 120;
      const r1 = 270;
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      const p0 = [mx + Math.cos(a) * r0, my + Math.sin(a) * r0];
      const p1 = [mx + Math.cos(a) * r1, my + Math.sin(a) * r1];
      return `M ${p0[0] + nx * 6} ${p0[1] + ny * 6} L ${p1[0] + nx * 16} ${p1[1] + ny * 16} L ${p1[0] - nx * 16} ${p1[1] - ny * 16} L ${p0[0] - nx * 6} ${p0[1] - ny * 6} Z`;
    })
    .join(" ");
  const water = useMemo(() => {
    let w = `M ${ART.x0} 1000 H ${ART.x1} V 1070 H ${ART.x0} Z`;
    for (let i = 0; i < 9; i++) {
      const x = 80 + rand(i + 4) * 800;
      const y = 1012 + (i % 4) * 14;
      w += ` M ${x} ${y} h ${50 + rand(i) * 80} v 5 h ${-(50 + rand(i) * 80)} Z`;
    }
    return w;
  }, []);
  return (
    <Poster>
      <mask id="dg-ko" maskUnits="userSpaceOnUse" x={0} y={0} width={U.w} height={U.h}>
        <rect width={U.w} height={U.h} fill="#fff" />
        <path d={`${disc(mx - 42, my, 64)} ${disc(mx + 42, my, 64)}`} fill="#000" />
      </mask>
      <Ink id="dg-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} mask="url(#dg-ko)" />
      <Ink id="dg-sky2" at={at(1)} col={pal.sky2} d={`${stepped(ART.x0, ART.x1, ART.y0, 220, 430)} ${water}`} rule="evenodd" reg={[2, -1]} mask="url(#dg-ko)" />
      <Ink id="dg-sun" at={at(1) + G / 2} col={pal.sun} d={sun(sunXY[0], sunXY[1], 70)} rule="evenodd" reg={[-2, 1]} />
      <Ink id="dg-far" at={at(2)} col={pal.far} d={ridge(ART.x0, ART.x1, 1000, 90, 21, 1000 + 2, [[260, 900], [700, 920]]).d} reg={[1, 2]} />
      <Ink id="dg-mid" at={at(2.5)} col={pal.mid} d={`${ring(mx - 42, my, 64, 78)} ${ring(mx + 42, my, 64, 78)}`} rule="evenodd" reg={[-1, 1]} />
      <Ink id="dg-rays" at={at(3)} col={pal.sky2} d={rayPath} reg={[1, -1]} />
      <Ink id="dg-near" at={at(3.5)} col={pal.near} d={`M ${ART.x0} ${ART.y1} V 1080 C 380 1060 700 1110 ${ART.x1} 1090 V ${ART.y1} Z`} reg={[2, -1]} />
      {dashes.map((dd, i) => (
        <Ink key={i} id={`dg-d${i}`} at={at(4) + i * 0.06} col={ink} d={dd} dur={0.08} dir="right" reg={[1, 1]} />
      ))}
      <Ink id="dg-lab" at={at(4.5)} col={ink} dir="right">
        <Txt x={sunXY[0] + 150} y={sunXY[1] - 40} size={T.label} col={ink} font="label" tracking={T.labelTracking}>
          {d.in.toUpperCase()}
        </Txt>
        <Txt x={mx + 120} y={my - 120} size={T.label} col={ink} font="label" tracking={T.labelTracking}>
          {d.object.toUpperCase()}
        </Txt>
        <Txt x={ART.x0 + 70} y={my + 250} size={T.label} col={ink} font="label" tracking={T.labelTracking}>
          BLUE, EVERY WAY
        </Txt>
      </Ink>
      {infoBand(pal, "03", d.object.toUpperCase(), [
        { label: "IN", value: "SUNLIGHT" },
        { label: "OUT", value: "BLUE, EVERY WAY", accent: true },
      ], at(5.5), "dg-b")}
    </Poster>
  );
};

const NumberSample: React.FC = () => {
  const pal = PAL.noon;
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const size = T.number;
  // the number is knocked out of both sky inks: each misregistered, so a crescent of bare paper shows at its edges
  const ko = (id: string, dx: number, dy: number) => (
    <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={U.w} height={U.h}>
      <rect width={U.w} height={U.h} fill="#fff" />
      <text x={U.w / 2 - dx} y={760 - dy} textAnchor="middle" fill="#000" style={{ fontFamily: `"Big Shoulders", sans-serif`, fontWeight: 900, fontSize: size }}>
        {value}
      </text>
    </mask>
  );
  return (
    <Poster>
      {ko("nb-ko1", 0, 0)}
      {ko("nb-ko2", 2, -1)}
      <Ink id="nb-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} mask="url(#nb-ko1)" />
      <Ink id="nb-sky2" at={at(1)} col={pal.sky2} d={stepped(ART.x0, ART.x1, ART.y0, 820, 980)} reg={[2, -1]} mask="url(#nb-ko2)" />
      <Land pal={pal} i0={2} id="nb" farBase={1090} midBase={1100} seed={8} />
      <Ink id="nb-head" at={at(4) + G / 2} col={pal.near} dir="right">
        <Txt x={U.w / 2} y={190} size={T.header} col={pal.near} tracking={T.headerTracking} anchor="middle" weight={800}>
          BLUE SCATTERS
        </Txt>
        <Txt x={U.w / 2} y={850} size={T.header} col={pal.near} tracking={T.headerTracking} anchor="middle" weight={800}>
          TIMES MORE THAN RED
        </Txt>
      </Ink>
      {infoBand(pal, "04", "SCATTERING", [
        { label: "BLUE", value: "450 NM" },
        { label: "RED", value: "700 NM" },
        { label: "BLUE VS RED", value: value, accent: true },
      ], at(5), "nb-b")}
    </Poster>
  );
};

const List: React.FC = () => {
  const pal = PAL.golden;
  const person: [number, number] = [300, 972];
  const marks: [number, number][] = [
    [760, 380],
    [560, 640],
    [440, 850],
  ];
  const route = useMemo(() => {
    const pts: [number, number][] = [];
    const ctrl: [number, number][] = [[760, 330], [700, 520], [520, 620], [600, 760], [440, 850], [330, 830]];
    for (let i = 0; i < ctrl.length - 1; i++) for (let k = 0; k < 10; k++) pts.push([ctrl[i][0] + ((ctrl[i + 1][0] - ctrl[i][0]) * k) / 10, ctrl[i][1] + ((ctrl[i + 1][1] - ctrl[i][1]) * k) / 10]);
    const out: string[] = [];
    for (let i = 0; i + 2 < pts.length; i += 3) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[i + 2];
      const l = Math.hypot(bx - ax, by - ay) || 1;
      const nx = (-(by - ay) / l) * 7;
      const ny = ((bx - ax) / l) * 7;
      out.push(`M ${ax + nx} ${ay + ny} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} L ${ax - nx} ${ay - ny} Z`);
    }
    return out;
  }, []);
  const rows = SAMPLE.list.map((item, i) => ({ n: `0${i + 1}`, text: item.toUpperCase() }));
  const rowItems = rows.map((r, i) => ({
    col: C.paper,
    node: (
      <>
        <Txt x={BX} y={B0 + 92 + i * 96} size={74} col={pal.sun}>
          {r.n}
        </Txt>
        <Txt x={BX + 110} y={B0 + 92 + i * 96} size={fitSize(r.text, BW - 110, 74, 50)} col={C.paper} weight={800}>
          {r.text}
        </Txt>
      </>
    ),
  }));
  return (
    <Poster>
      <Ink id="ls-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} />
      <Ink id="ls-sky2" at={at(1)} col={pal.sky2} d={stepped(ART.x0, ART.x1, ART.y0, 200, 470)} reg={[2, -1]} />
      <Ink id="ls-sun" at={at(1) + G / 2} col={pal.sun} d={sun(760, 300, 76)} rule="evenodd" reg={[-2, 1]} />
      <Land pal={pal} i0={2} id="ls" farBase={720} midBase={900} seed={14} figureAt={person} />
      {route.map((d, i) => (
        <Ink key={i} id={`ls-r${i}`} at={at(4.5) + i * 0.04} col={pal.sun} d={d} dur={0.06} dir="right" reg={[1, 1]} />
      ))}
      {marks.map(([x, y], i) => (
        <React.Fragment key={i}>
          <Ink id={`ls-m${i}`} at={at(5) + i * 0.15} col={pal.sun} d={disc(x, y, 38)} reg={[1, -1]} />
          <Ink id={`ls-mn${i}`} at={at(5) + i * 0.15 + 0.08} col={pal.near} dir="right" dur={0.1}>
            <Txt x={x} y={y + 22} size={62} col={pal.near} anchor="middle">
              {i + 1}
            </Txt>
          </Ink>
        </React.Fragment>
      ))}
      <Band id="ls-b" at={at(6)} col={pal.near} items={rowItems} />
    </Poster>
  );
};

const End: React.FC = () => {
  const pal = PAL.dusk;
  const ink = pickInk(pal.sky2, [pal.near, C.paper]);
  const g = useMemo(() => {
    const far = ridge(ART.x0, ART.x1, 940, 110, 31, ART.y1, [[240, 860], [760, 830]]);
    const mid = ridge(ART.x0, ART.x1, 1030, 80, 32, ART.y1, [[560, 990]]);
    return { far: far.d, facet: facets(far.pts, [240, 760], 1, 31), mid: mid.d, near: `M ${ART.x0} ${ART.y1} V 1080 C 360 1050 700 1110 ${ART.x1} 1070 V ${ART.y1} Z ${figure(700, 1100, 160)}` };
  }, []);
  const words2 = plain(SAMPLE.end.line).toUpperCase().split(" ");
  return (
    <Poster>
      <Ink id="en-sky1" at={at(0)} col={pal.sky1} d={`M ${ART.x0} ${ART.y0} H ${ART.x1} V ${ART.y1} H ${ART.x0} Z`} reg={[0, 0]} />
      <Ink id="en-sky2" at={at(1)} col={pal.sky2} d={stepped(ART.x0, ART.x1, ART.y0, 520, 800)} reg={[2, -1]} />
      <Ink id="en-sun" at={at(1) + G / 2} col={pal.sun} d={sun(480, 930, 140)} rule="evenodd" reg={[-2, 1]} />
      <Ink id="en-far" at={at(2)} col={pal.far} d={g.far} reg={[1, 2]} />
      <Ink id="en-fac" at={at(2) + G / 2} col={pal.sky2} d={g.facet} reg={[2, 1]} />
      <Ink id="en-mid" at={at(3)} col={pal.mid} d={g.mid} reg={[-1, 1]} />
      <Ink id="en-near" at={at(4)} col={pal.near} d={g.near} reg={[2, -1]} />
      <Ink id="en-head" at={at(4) + G / 2} col={ink} dir="right">
        <Txt x={U.w / 2} y={290} size={T.headline * 1.2} col={ink} anchor="middle" tracking={0.01}>
          {words2.slice(0, 2).join(" ")}
        </Txt>
        <Txt x={U.w / 2} y={480} size={T.headline * 1.2} col={ink} anchor="middle" tracking={0.01}>
          {words2.slice(2).join(" ")}
        </Txt>
      </Ink>
      {infoBand(pal, "06", SAMPLE.end.cta.toUpperCase(), [
        { label: "TONIGHT", value: "LOOK UP" },
        { label: "TOMORROW", value: "A NEW FACT", accent: true },
      ], at(5), "en-b")}
    </Poster>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.8, hero: 3.45, component: Title },
  { id: "headline", duration: 3.6, hero: 3.25, component: Headline },
  { id: "diagram", duration: 4.0, hero: 3.65, component: Diagram },
  { id: "number", duration: 3.8, hero: 3.45, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.25, component: List },
  { id: "end", duration: 3.6, hero: 3.25, component: End },
];
