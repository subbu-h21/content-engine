/** Engraving on the shared sample content: one copperplate per sample, cut line by line, coloured last. */
import React, { useMemo } from "react";
import { clamp, plain, SAMPLE, words, type Sample } from "../../kit";
import { C, contour, Cut, field, Halo, Leader, Letters, line, Plate, rand, Roundel, S, Script, shade, sphereTone, wave, Wash, type Run } from "./parts";

const T = S.type;
const LY = S.layout.labelY;
const PI2 = Math.PI * 2;
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");
const circle = (x: number, y: number, r: number) => `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

/** A sun: an unhatched paper disc with a thin swelling contour and alternating long and short rays. */
const sunRuns = (x: number, y: number, r: number, n = 24): { rim: Run[]; rays: Run[] } => ({
  rim: contour(x, y, r).map((q) => ({ ...q, pts: q.pts.map(([a, b, w]) => [a, b, w * 0.7] as [number, number, number]) })),
  rays: Array.from({ length: n }, (_, i) => {
    const a = (PI2 * i) / n;
    const r1 = r + 14;
    const r2 = r + (i % 2 ? r * 0.38 : r * 0.7);
    return line([x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a) * r2, y + Math.sin(a) * r2], 1.7, i / n);
  }),
});

/** An engraved sky in a circular vignette over a sea: horizontal lines darker toward the zenith, lighter round the sun. */
const skyPlate = (ox: number, oy: number, rr: number, horizon: number, sun: [number, number, number]) => {
  const inside = (x: number, y: number) => (x - ox) ** 2 + (y - oy) ** 2 < (rr - 6) ** 2;
  const top = oy - rr;
  const skyTone = (x: number, y: number) => {
    if (!inside(x, y) || y > horizon - 5) return null;
    const d = Math.hypot(x - sun[0], y - sun[1]);
    if (d < sun[2] + 12) return null;
    return clamp(0.16 + 0.5 * (1 - (y - top) / (horizon - top)) - 0.32 * Math.exp(-((d - sun[2]) ** 2) / 120 ** 2));
  };
  const seaTone = (x: number, y: number) => {
    if (!inside(x, y) || y < horizon + 6) return null;
    const glitter = Math.exp(-((x - sun[0]) ** 2) / 34 ** 2) * (rand(Math.round(y / 7)) > 0.35 ? 1 : 0);
    return clamp(0.3 + 0.42 * ((y - horizon) / (oy + rr - horizon)) - 0.6 * glitter);
  };
  const half = Math.sqrt(rr * rr - (horizon - oy) ** 2);
  return {
    sky: field({ box: [ox - rr, top, ox + rr, horizon], angle: 0, spacing: 6.5, tone: skyTone, thr: 0.1, wMax: 2.3 }),
    sea: field({ box: [ox - rr, horizon, ox + rr, oy + rr], angle: 0, spacing: 7.5, tone: seaTone, thr: 0.12, wMax: 2.1 }),
    frame: contour(ox, oy, rr),
    horizon: [line([ox - half + 4, horizon], [ox + half - 4, horizon], 1.6)],
    skyPath: `M ${ox - half} ${horizon} A ${rr} ${rr} 0 1 1 ${ox + half} ${horizon} Z ${circle(sun[0], sun[1], sun[2] + 4)}`,
    ...sunRuns(sun[0], sun[1], sun[2]),
  };
};

const Title: React.FC = () => {
  const sun: [number, number, number] = [650, 640, 64];
  const g = useMemo(() => skyPlate(540, 760, 400, 960, sun), []);
  return (
    <Plate
      over={
        <>
          <Letters text={SAMPLE.kicker} y={LY} at={0.1} size={T.label} tracking={T.labelTracking} />
          <Letters text={lead(SAMPLE.title)} y={1300} at={1.0} size={T.title} />
          <Letters text={em(SAMPLE.title)} y={1440} at={1.7} size={T.italicTitle} italic caps={false} />
          <Script text="a plate on scattered light" y={1545} at={2.1} />
        </>
      }
    >
      <Wash id="ti-sky" d={g.skyPath} col={C.blue} from={[300, 520]} at={1.5} dur={1.4} />
      <Wash id="ti-sun" d={circle(sun[0], sun[1], sun[2])} col={C.amber} alpha={0.75} from={[sun[0] - 20, sun[1] - 20]} at={1.92} dur={1.25} reach={160} />
      <Cut runs={g.frame} at={0.1} sweep={0.3} />
      <Cut runs={g.sky} at={0.25} sweep={1.0} />
      <Cut runs={g.horizon} at={0.4} />
      <Cut runs={g.sea} at={0.7} sweep={0.8} />
      <Cut runs={g.rim} at={0.5} sweep={0.3} />
      <Cut runs={g.rays} at={0.7} sweep={0.6} />
    </Plate>
  );
};

const Headline: React.FC = () => {
  const sun: [number, number, number] = [250, 780, 108];
  const colours = [
    { name: "red", nm: 700 },
    { name: "yellow", nm: 580 },
    { name: "green", nm: 530 },
    { name: "blue", nm: 450 },
    { name: "violet", nm: 400 },
  ];
  const angles = [-0.3, -0.15, 0, 0.15, 0.3];
  const len = 430;
  const x0 = sun[0] + sun[2] + 34;
  const g = useMemo(() => ({ ...sunRuns(sun[0], sun[1], sun[2]), waves: colours.map((c, i) => wave(x0, x0 + len, sun[1], 20, c.nm * 0.2, 2.3, i / colours.length, angles[i])) }), []);
  const [l1, l2] = SAMPLE.headline;
  return (
    <Plate
      over={
        <>
          <Letters text={`Plate I · ${SAMPLE.chapter}`} y={LY} at={0.1} size={T.label} tracking={T.labelTracking} />
          {colours.map((c, i) => (
            <Letters key={c.name} text={c.name} x={x0 + Math.cos(angles[i]) * len + 22} y={sun[1] + Math.sin(angles[i]) * len + 12} at={1.2 + i * 0.1} size={34} italic caps={false} align="left" />
          ))}
          <Letters text={l1} y={1250} at={1.5} size={T.display} />
          <Letters text={lead(l2)} y={1340} at={1.9} size={T.display} />
          <Letters text={em(l2)} y={1480} at={2.3} size={T.italicTitle} italic caps={false} />
        </>
      }
    >
      <Wash id="hl-sun" d={circle(sun[0], sun[1], sun[2])} col={C.amber} alpha={0.7} from={[sun[0] - 30, sun[1] - 30]} at={2.0} dur={1.25} reach={240} />
      <Cut runs={g.rim} at={0.1} sweep={0.3} />
      <Cut runs={g.rays} at={0.3} sweep={0.5} />
      <Cut runs={g.waves} at={0.6} sweep={0.5} speed={1400} />
    </Plate>
  );
};

const Diagram: React.FC = () => {
  const front: [number, number, number] = [622, 870, 150];
  const back: [number, number, number] = [455, 892, 140];
  const [mx, my] = [540, 880];
  const src: [number, number] = [150, 410];
  const scatter = [-80, -30, 15, 60, 105, 150, 195];
  const g = useMemo(() => {
    const ft = sphereTone(...front);
    const bt = sphereTone(...back, [front]);
    const fs = shade([front[0] - front[2], front[1] - front[2], front[0] + front[2], front[1] + front[2]], ft, -35);
    const bs = shade([back[0] - back[2], back[1] - back[2], back[0] + back[2], back[1] + back[2]], bt, -35);
    const dirIn = Math.atan2(my - src[1], mx - src[0]);
    return {
      first: [...bs[0], ...fs[0]],
      cross: [...bs[1], ...fs[1]],
      third: [...bs[2], ...fs[2]],
      outline: [...contour(...back, 0, PI2, [front]), ...contour(...front)],
      incoming: [line(src, [mx - Math.cos(dirIn) * 250, my - Math.sin(dirIn) * 250], 2.4)],
      waves: scatter.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return wave(mx + Math.cos(a) * 215, mx + Math.cos(a) * 215 + 150, my + Math.sin(a) * 215, 11, 42, 2.6, i / scatter.length, a);
      }),
      zoom: [wave(670, 930, 1290, 34, 112, 3, 0)],
    };
  }, []);
  const tip = (deg: number, r: number): [number, number] => [mx + Math.cos((deg * Math.PI) / 180) * r, my + Math.sin((deg * Math.PI) / 180) * r];
  return (
    <Plate
      over={
        <>
          <Letters text="Fig. 2 · The air molecule" y={LY} at={0.1} size={T.label} tracking={T.labelTracking} />
          <Letters text={SAMPLE.diagram.in} x={150} y={385} at={0.4} size={34} italic caps={false} align="left" />
          <Letters text={`${SAMPLE.diagram.object}, N₂`} x={120} y={1250} at={2.2} size={T.italic} italic caps={false} align="left" />
          <Letters text="fig. 3" x={800} y={1480} at={2.6} size={30} italic caps={false} />
          <Script text={SAMPLE.diagram.label} x={120} y={1330} at={2.4} align="left" />
        </>
      }
    >
      <Wash id="dg-glow" d={circle(mx, my, 360)} col={C.blue} alpha={0.5} from={[mx, my]} at={2.3} dur={1.25} reach={520} />
      <Cut runs={g.incoming} at={0.1} speed={1200} />
      <Cut runs={g.outline} at={0.45} sweep={0.25} />
      <Cut runs={g.first} at={0.7} sweep={0.8} />
      <Cut runs={g.cross} at={1.2} sweep={0.6} />
      <Cut runs={g.third} at={1.55} sweep={0.4} />
      <Cut runs={g.waves} at={1.6} sweep={0.5} speed={900} />
      <Leader from={[back[0] - 30, back[1] + back[2] - 6]} to={[300, 1205]} at={2.1} />
      <Leader from={tip(60, 360)} to={[800 - 150 * 0.72, 1290 - 150 * 0.72]} at={2.2} />
      <Roundel id="dg-r" cx={800} cy={1290} at={2.0} from={tip(60, 360)}>
        <Halo d={`M 640 1290 h 320`} w={44} />
        <Cut runs={g.zoom} at={2.6} speed={900} />
      </Roundel>
    </Plate>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const bars = [
    { label: "Blue · 450 nm", y: 1080, w: 820 },
    { label: "Red · 700 nm", y: 1290, w: 820 / n.value },
  ];
  const bx = 130;
  const bh = 76;
  const g = useMemo(() => {
    const out = bars.map((b) => {
      const tone = (x: number, y: number) => {
        if (x < bx + 2 || x > bx + b.w - 2) return null;
        const v = (y - b.y) / (bh / 2);
        if (Math.abs(v) >= 0.94) return null;
        const nz = Math.sqrt(1 - v * v);
        return clamp(1 - (0.62 * nz - 0.62 * v + 0.15));
      };
      const box: [number, number, number, number] = [bx, b.y - bh / 2, bx + b.w, b.y + bh / 2];
      return {
        hatch: [...field({ box, angle: 0, spacing: 5, tone, thr: 0.14 }), ...field({ box, angle: 62, spacing: 6, tone, thr: 0.5, wMax: 1.8 })],
        edge: [line([bx, b.y - bh / 2], [bx + b.w, b.y - bh / 2], 1.4), line([bx, b.y + bh / 2], [bx + b.w, b.y + bh / 2], 2.6), line([bx, b.y - bh / 2], [bx, b.y + bh / 2], 1.8), line([bx + b.w, b.y - bh / 2], [bx + b.w, b.y + bh / 2], 2.4)],
      };
    });
    // the numerals, line-filled: horizontal burin lines clipped to the glyphs
    const fill = field({ box: [80, 470, 1000, 800], angle: 0, spacing: 5, tone: () => 0.8, thr: 0.1, wMax: 2.1 });
    return { out, fill };
  }, []);
  return (
    <Plate
      over={
        <>
          <Letters text="Plate III · By the numbers" y={LY} at={0.1} size={T.label} tracking={T.labelTracking} />
          <Letters text={n.caption} y={900} at={1.2} size={34} italic caps={false} />
          {bars.map((b, i) => (
            <Letters key={i} text={b.label} x={bx} y={b.y - 64} at={1.0 + i * 0.3} size={T.label} tracking={T.labelTracking} align="left" />
          ))}
        </>
      }
    >
      <defs>
        <clipPath id="nb-glyphs">
          <text x={540} y={770} textAnchor="middle" style={{ fontFamily: `"Bodoni Moda", serif`, fontWeight: 500, fontSize: T.number, fontVariantNumeric: "lining-nums" }}>
            {value}
          </text>
        </clipPath>
      </defs>
      <Wash id="nb-blue" d={`M ${bx} ${bars[0].y - bh / 2} h ${bars[0].w} v ${bh} h ${-bars[0].w} Z`} col={C.blue} alpha={0.65} from={[bx, bars[0].y]} at={1.9} dur={1.0} reach={900} />
      <g clipPath="url(#nb-glyphs)">
        <Cut runs={g.fill} at={0.2} sweep={0.6} speed={3200} />
      </g>
      <text x={540} y={770} textAnchor="middle" fill="none" stroke={C.ink} strokeWidth={1.6} style={{ fontFamily: `"Bodoni Moda", serif`, fontWeight: 500, fontSize: T.number, fontVariantNumeric: "lining-nums" }}>
        {value}
      </text>
      {g.out.map((o, i) => (
        <React.Fragment key={i}>
          <Cut runs={o.edge} at={0.9 + i * 0.3} sweep={0.2} />
          <Cut runs={o.hatch} at={1.0 + i * 0.3} sweep={0.4} />
        </React.Fragment>
      ))}
    </Plate>
  );
};

const List: React.FC = () => {
  const cx = 250;
  const ys = [540, 920, 1300];
  const r = 140;
  const g = useMemo(() => {
    const s1 = sunRuns(cx, ys[0], 46, 16);
    const sph: [number, number, number] = [cx, ys[1], 50];
    const st = shade([cx - 50, ys[1] - 50, cx + 50, ys[1] + 50], sphereTone(...sph), -35, 0.8);
    const sc = Array.from({ length: 8 }, (_, i) => {
      const a = (PI2 * i) / 8 + 0.2;
      return wave(cx + Math.cos(a) * 66, cx + Math.cos(a) * 66 + 50, ys[1] + Math.sin(a) * 66, 4, 16, 1.6, i / 8, a);
    });
    const domeTone = (x: number, y: number) => {
      const d = Math.hypot(x - cx, y - (ys[2] + 40));
      if (d > 96 || y > ys[2] + 36) return null;
      return clamp(0.2 + 0.6 * (1 - (ys[2] + 40 - y) / 96) * 0 + 0.55 * (1 - (y - (ys[2] - 56)) / 96));
    };
    const dome = field({ box: [cx - 100, ys[2] - 60, cx + 100, ys[2] + 40], angle: 0, spacing: 6, tone: domeTone, thr: 0.12, wMax: 2 });
    return {
      one: [...s1.rim, ...s1.rays],
      two: [...st[0], ...st[1], ...st[2], ...contour(...sph), ...sc],
      three: [...dome, line([cx - 120, ys[2] + 40], [cx + 120, ys[2] + 40], 2.2)],
    };
  }, []);
  const tx = 450;
  return (
    <Plate
      over={
        <>
          <Letters text="Plate IV · In three steps" y={LY} at={0.1} size={T.label} tracking={T.labelTracking} />
          {SAMPLE.list.map((item, i) => {
            const ws = item.split(" ");
            const lines = ws.length > 3 ? [ws.slice(0, 3).join(" "), ws.slice(3).join(" ")] : [item];
            return (
              <React.Fragment key={i}>
                <Letters text={`Fig. ${["I", "II", "III"][i]}`} x={tx} y={ys[i] - 52} at={0.4 + i * 0.6} size={T.label} tracking={T.labelTracking} align="left" />
                {lines.map((l, k) => (
                  <Letters key={k} text={l} x={tx} y={ys[i] + 6 + k * 50} at={0.5 + i * 0.6 + k * 0.2} size={T.italic + 2} italic caps={false} align="left" />
                ))}
              </React.Fragment>
            );
          })}
        </>
      }
    >
      <Roundel id="ls-1" cx={cx} cy={ys[0]} r={r} at={0.1}>
        <Halo d={circle(cx, ys[0], 80)} w={8} />
        <Cut runs={g.one} at={0.4} sweep={0.4} />
      </Roundel>
      <Roundel id="ls-2" cx={cx} cy={ys[1]} r={r} at={0.7}>
        <Halo d={circle(cx, ys[1], 118)} w={4} />
        <Cut runs={g.two} at={1.0} sweep={0.5} />
      </Roundel>
      <Roundel id="ls-3" cx={cx} cy={ys[2]} r={r} at={1.3}>
        <Halo d={`M ${cx - 120} ${ys[2] + 44} A 100 100 0 0 1 ${cx + 120} ${ys[2] + 44} Z`} w={6} />
        <Wash id="ls-dome" d={`M ${cx - 96} ${ys[2] + 38} A 96 96 0 0 1 ${cx + 96} ${ys[2] + 38} Z`} col={C.blue} alpha={0.6} from={[cx, ys[2] - 40]} at={2.2} dur={0.9} reach={220} />
        <Cut runs={g.three} at={1.6} sweep={0.5} />
      </Roundel>
    </Plate>
  );
};

const End: React.FC = () => {
  const sun: [number, number, number] = [540, 640, 56];
  const g = useMemo(() => skyPlate(540, 700, 380, 900, sun), []);
  return (
    <Plate
      over={
        <>
          <Letters text={plain(SAMPLE.end.line)} y={1250} at={0.9} size={T.title - 4} />
          <Script text={SAMPLE.end.cta} y={1370} at={1.6} size={T.script + 10} />
          <Letters text={`${SAMPLE.kicker}, del. et sculp.`} y={1550} at={2.1} size={T.label} italic caps={false} />
        </>
      }
    >
      <Wash id="en-sky" d={g.skyPath} col={C.blue} from={[540, 380]} at={1.3} dur={1.3} />
      <Cut runs={g.frame} at={0.05} sweep={0.25} />
      <Cut runs={g.sky} at={0.15} sweep={0.8} />
      <Cut runs={g.horizon} at={0.3} />
      <Cut runs={g.sea} at={0.5} sweep={0.6} />
      <Cut runs={g.rim} at={0.4} sweep={0.3} />
      <Cut runs={g.rays} at={0.55} sweep={0.5} />
    </Plate>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.8, hero: 3.45, component: Title },
  { id: "headline", duration: 3.8, hero: 3.4, component: Headline },
  { id: "diagram", duration: 4.0, hero: 3.65, component: Diagram },
  { id: "number", duration: 3.4, hero: 3.0, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.2, component: List },
  { id: "end", duration: 3.4, hero: 3.0, component: End },
];
