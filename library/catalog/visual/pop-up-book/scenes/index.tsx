/**
 * Pop-up Book on the shared sample content: the closed book whose cover is the title, a paper rainbow springing up
 * under the sun on a stick, an air molecule throwing blue paper darts with a speech bubble, two paper columns under a
 * sign on strings, three pieces rising back to front for the steps, and the night spread to end.
 */
import React from "react";
import { SAMPLE, useSeconds, type Sample } from "../../kit";
import {
  Bubble,
  C,
  cloudArt,
  columnArt,
  Cover,
  dartArt,
  depthDelay,
  Desk,
  ease,
  Flat,
  gp,
  hillArt,
  houseArt,
  kid,
  moleculeArt,
  Piece,
  popK,
  popupK,
  rainbowArt,
  Ribbon,
  S,
  Sign,
  Spread,
  stringK,
  Subtitle,
  sunArt,
  Tag,
  treeArt,
  type Art,
} from "./parts";

const T = S.type;
const RISE = 0.3;
/** A piece's pop-up value: the spread rises at `start`, each piece after its depth delay. */
const kAt = (t: number, z: number, start = RISE) => popupK(t - start - depthDelay(z));

const Clouds: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Flat x={300} y={470} k={popK(t - 0.1)} art={cloudArt(3)} />
    <Flat x={780} y={420} k={popK(t - 0.2)} art={cloudArt(7)} scale={0.8} />
  </>
);

/** Back-to-front order on the page: draw far pieces first. */
type Placed = { u: number; z: number; art: Art; scale?: number; k: number };
const Pieces: React.FC<{ list: Placed[] }> = ({ list }) => (
  <>
    {[...list]
      .sort((a, b) => a.z - b.z)
      .map((p, i) => (
        <Piece key={i} u={p.u} z={p.z} k={p.k} art={p.art} scale={p.scale} />
      ))}
  </>
);

const Title: React.FC = () => (
  <Desk>
    <Cover lines={["Why is", "the sky", "blue?"]} kicker={SAMPLE.kicker} at={0} />
  </Desk>
);

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const list: Placed[] = [
    { u: 0.18, z: 0.04, art: hillArt("hl-h1", 330, 120, C.hill1, 1), k: kAt(t, 0.04) },
    { u: 0.52, z: 0.06, art: hillArt("hl-h2", 360, 150, C.hill2, 2), k: kAt(t, 0.06) },
    { u: 0.86, z: 0.03, art: hillArt("hl-h3", 300, 110, C.hill3, 3), k: kAt(t, 0.03) },
    { u: 0.2, z: 0.1, art: sunArt("hl-sun", 300), k: kAt(t, 0.1), scale: 0.9 },
    { u: 0.62, z: 0.3, art: rainbowArt("hl-rb"), k: kAt(t, 0.3, RISE + 0.5), scale: 0.95 },
    { u: 0.24, z: 0.56, art: kid("hl-kid", true), k: kAt(t, 0.56, RISE + 0.7) },
  ];
  return (
    <Desk>
      <Spread board={<Clouds t={t} />}>
        <Pieces list={list} />
      </Spread>
      <Subtitle lines={["Sunlight carries every", "colour at once."]} at={1.5} />
    </Desk>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const sunG = gp(0.16, 0.06);
  const molG = gp(0.62, 0.24);
  const ks = kAt(t, 0.06);
  const km = kAt(t, 0.24);
  const stickS = 260;
  const stickM = 190;
  const sunC: [number, number] = [sunG.x, sunG.y - (stickS + 80) * sunG.s * 0.9];
  const molC: [number, number] = [molG.x, molG.y - (stickM + 70) * molG.s];
  const beam = ease("slat", t - 1.0);
  const hit = 1.0 + S.motion.recipes.slat.duration;
  const strip = (a: [number, number], b: [number, number], p: number, w: number, fill: string) => {
    if (p <= 0) return null;
    const ex = a[0] + (b[0] - a[0]) * p;
    const ey = a[1] + (b[1] - a[1]) * p;
    const len = Math.hypot(ex - a[0], ey - a[1]) || 1;
    const nx = (-(ey - a[1]) / len) * (w / 2);
    const ny = ((ex - a[0]) / len) * (w / 2);
    const pts = `${a[0] + nx},${a[1] + ny} ${ex + nx},${ey + ny} ${ex - nx},${ey - ny} ${a[0] - nx},${a[1] - ny}`;
    return (
      <g>
        <polygon points={pts} fill={C.border} stroke={C.border} strokeWidth={22} strokeLinejoin="round" />
        <polygon points={pts} fill={fill} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  };
  const darts = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.5;
    const k = popK(t - hit - 0.15 - i * 0.06);
    const d = 120 + 70 * Math.min(1, k);
    return <Flat key={i} x={molC[0] + d * Math.cos(a)} y={molC[1] + d * Math.sin(a)} k={k} art={dartArt(a, 70, i + 1)} scale={molG.s} />;
  });
  const dir = [molC[0] - sunC[0], molC[1] - sunC[1]];
  return (
    <Desk>
      <Spread board={<Clouds t={t} />}>
        <Pieces
          list={[
            { u: 0.5, z: 0.04, art: hillArt("dg-h2", 420, 140, C.hill2, 2), k: kAt(t, 0.04) },
            { u: 0.16, z: 0.06, art: sunArt("dg-sun", stickS), k: ks, scale: 0.9 },
            { u: 0.88, z: 0.4, art: treeArt("dg-tree", 5), k: kAt(t, 0.4) },
            { u: 0.62, z: 0.24, art: moleculeArt("dg-mol", stickM), k: km },
          ]}
        />
        {strip([sunC[0] + 60, sunC[1] + 20], [molC[0] - 70, molC[1] - 10], beam, 30, C.sun)}
        {strip([molC[0] + 70, molC[1] + 12], [molC[0] + 70 + dir[0] * 0.5, molC[1] + 12 + dir[1] * 0.5], ease("slat", t - hit), 20, C.red)}
        {darts}
      </Spread>
      <Bubble text={SAMPLE.diagram.out + "!"} x={150} y={360} w={560} tail={[molC[0] - 30, molC[1] - 80]} at={hit + 0.4} />
      <Tag text={SAMPLE.diagram.object} x={molG.x + 40} y={molG.y - 120} at={hit + 0.2} size={T.label - 4} />
      <Subtitle lines={[SAMPLE.diagram.label]} at={hit + 0.1} />
    </Desk>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const unit = 55;
  const bz = 0.32;
  const bG = gp(0.34, bz);
  const rG = gp(0.7, bz);
  const kb = kAt(t, bz, RISE + 0.3);
  const kr = kAt(t, bz, RISE + 0.45);
  return (
    <Desk>
      <Spread board={<Clouds t={t} />}>
        <Pieces
          list={[
            { u: 0.2, z: 0.04, art: hillArt("nm-h1", 340, 120, C.hill1, 1), k: kAt(t, 0.04) },
            { u: 0.78, z: 0.05, art: hillArt("nm-h3", 360, 140, C.hill3, 3), k: kAt(t, 0.05) },
            { u: 0.34, z: bz, art: columnArt("nm-blue", n.value * unit, C.blue), k: kb },
            { u: 0.7, z: bz, art: columnArt("nm-red", unit, C.red), k: kr },
          ]}
        />
      </Spread>
      <Sign lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} y={392} at={0.7} size={T.number} w={480} />
      <Tag text="450 nm" x={bG.x} y={bG.y - n.value * unit * bG.s - 110} at={1.5} align="center" />
      <Tag text="700 nm" x={rG.x} y={rG.y - unit * rG.s - 110} at={1.6} align="center" />
      <Subtitle lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} at={1.8} size={T.body - 4} />
    </Desk>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const zs = [0.05, 0.26, 0.55];
  const molG = gp(0.6, zs[1]);
  const km = kAt(t, zs[1]);
  const molC: [number, number] = [molG.x, molG.y - (170 + 70) * molG.s];
  const at = (i: number) => RISE + depthDelay(zs[i]) + 0.4;
  return (
    <Desk>
      <Spread board={<Clouds t={t} />}>
        <Pieces
          list={[
            { u: 0.2, z: zs[0], art: sunArt("ls-sun", 190), k: kAt(t, zs[0]), scale: 0.85 },
            { u: 0.6, z: zs[1], art: moleculeArt("ls-mol", 170, false), k: km },
            { u: 0.86, z: 0.12, art: houseArt("ls-house"), k: kAt(t, 0.12), scale: 0.8 },
            { u: 0.3, z: zs[2], art: kid("ls-kid", true), k: kAt(t, zs[2]) },
          ]}
        />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          const k = popK(t - at(1) - 0.2 - i * 0.05);
          return <Flat key={i} x={molC[0] + 118 * Math.cos(a)} y={molC[1] + 118 * Math.sin(a)} k={k} art={dartArt(a, 54, i + 3)} scale={molG.s} />;
        })}
      </Spread>
      {SAMPLE.list.map((item, i) => (
        <Tag key={i} text={item} num={i + 1} x={150} y={378 + i * 86} at={at(i)} size={T.label - 2} />
      ))}
    </Desk>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const star = (x: number, y: number, s: number, at: number) => {
    const k = stringK(t - at);
    if (k <= 0) return null;
    const pts: [number, number][] = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 30 : 13;
      return [r * Math.cos(a), r * Math.sin(a)];
    });
    const d = `M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L ")} Z`;
    const yy = y - (1 - k) * 300;
    return (
      <g key={`${x}-${y}`}>
        <line x1={x} y1={300} x2={x} y2={yy - 30 * s} stroke={C.ink} strokeWidth={2} opacity={0.7} />
        <Flat x={x} y={yy} art={{ sil: [d], art: <path d={d} fill={C.sun} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" /> }} scale={s} />
      </g>
    );
  };
  const moonK = stringK(t - 0.3);
  const moon = "M 0 -60 A 60 60 0 1 0 50 34 A 46 46 0 1 1 0 -60 Z";
  return (
    <Desk>
      <Spread
        night={1}
        board={
          <>
            {moonK > 0 ? (
              <g>
                <line x1={820} y1={300} x2={820} y2={700 - (1 - moonK) * 300 - 60} stroke={C.ink} strokeWidth={2} opacity={0.7} />
                <Flat x={820} y={700 - (1 - moonK) * 300} art={{ sil: [moon], art: <path d={moon} fill={C.sun} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" /> }} />
              </g>
            ) : null}
            {star(240, 760, 1, 0.5)}
            {star(380, 860, 0.7, 0.62)}
            {star(640, 800, 0.85, 0.7)}
          </>
        }
      >
        <Pieces
          list={[
            { u: 0.2, z: 0.05, art: hillArt("en-h1", 340, 120, C.hill2, 1), k: 1 },
            { u: 0.78, z: 0.12, art: houseArt("en-house"), k: 1, scale: 0.85 },
            { u: 0.42, z: 0.5, art: kid("en-kid", true), k: 1 },
          ]}
        />
      </Spread>
      <Sign lines={["Look up", "again."]} y={370} at={0.4} size={T.display - 10} w={560} />
      <Ribbon text={SAMPLE.end.cta} y={1360} at={1.3} serif size={T.tagline} w={560} />
    </Desk>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.8, hero: 2.3, component: Title },
  { id: "headline", duration: 3.4, hero: 3.0, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.25, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.85, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.85, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
