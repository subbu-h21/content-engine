/**
 * Isometric Infographic on the shared sample content: the question extruded in blocks on a cream plate, sunlight
 * split into six lanes across a board, an air molecule on a plinth throwing blue arrows with a circular inset, the
 * number counted in identical cubes (one cube = 0.1 of red's scattering, so the towers hold the true 59 and 10), a Z
 * route down three small boards, and the last line on the plate again with a legend.
 */
import React from "react";
import { clamp, plain, SAMPLE, type Sample } from "../../kit";
import { SANS } from "./fonts";
import { board, BoardShadow, C, Caption, COS, E, ease, fall, Ground, Iso, pop, S, Stage, T, TONE, Txt, Pin, useT, type Tone, type V3 } from "./parts";

const drop = (t: number, at: number) => fall(t - at);
const SHOWN = 900; // anything still above this is not drawn yet

/** The title plate: a cream slab with lines of extruded type; `lines` fall in one word at a time. */
const Plate: React.FC<{ iso: Iso; lines: { text: string; tone?: Tone }[]; t: number; size: number; at?: number; a: number; b: number; lead?: number }> = ({ iso, lines, t, size, at = 0.3, a, b, lead = 1 }) => {
  iso.box(0, 0, -30, a, b, 30, TONE.cream, -1e5);
  lines.forEach((l, i) => {
    const z = drop(t, at + i * S.motion.stagger * 2);
    if (z > SHOWN) return;
    const c = l.tone ?? { top: C.ink, left: TONE.red.left, right: TONE.red.top };
    iso.floorText(l.text, 34 + size * 0.74 + i * size * lead, b - 30, z, size, c.top, c.right, 22);
  });
  return null;
};

/** A world point that lands on screen at (sx, sy) in a view at the origin. */
const at = (sx: number, sy: number): V3 => [sx / (2 * COS), -sx / (2 * COS), -sy];

/** The sky above a title plate: the sun, its beam down to the plate, two clouds, falling into place. */
const Sky: React.FC<{ t: number; to: [number, number] }> = ({ t, to }) => {
  const sky = new Iso(0, 0, 1, "sky");
  const zs = drop(t, 0.15);
  const zc = drop(t, 0.3);
  const sun = at(830, 420 - (zs > SHOWN ? 2000 : zs));
  sky.sphere(sun[0], sun[1], sun[2], 92, TONE.mustard, 10);
  const [x1, y1, z1] = at(770, 500);
  const [x2, y2, z2] = at(to[0], to[1]);
  sky.line([[x1, y1, z1], [x2, y2, z2]], 16, TONE.mustard.left, ease("route", t - 0.9), true, 5);
  if (zc < SHOWN) {
    const c1 = at(290, 400 - zc);
    const c2 = at(520, 590 - zc * 0.7);
    sky.cloud(c1[0], c1[1], c1[2], 2.1);
    sky.cloud(c2[0], c2[1], c2[2], 1.4);
  }
  return <>{sky.draw()}</>;
};

const Title: React.FC = () => {
  const t = useT();
  const a = 430;
  const b = 680;
  const iso = new Iso(655, 720, 1, "ti");
  Plate({ iso, t, a, b, size: T.title, lines: [{ text: "WHY IS" }, { text: "THE SKY" }, { text: "BLUE?", tone: TONE.blue }] });
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={iso} a={a} b={b} />
        <Sky t={t} to={[700, 800]} />
        {iso.draw()}
      </Stage>
      <Caption text={SAMPLE.kicker} t={t} at={1.5} />
    </Ground>
  );
};

/** Caps block in screen space, with the ground-colour halo. */
const Caps: React.FC<{ lines: { text: string; fill?: string }[]; x?: number; y: number; size?: number; t: number; at?: number }> = ({ lines, x = S.layout.margin, y, size = T.display, t, at = 0.2 }) => (
  <>
    {lines.map((l, i) => (
      <Txt key={i} x={x} y={y + i * size * T.leading} size={size} fill={l.fill ?? C.ink} opacity={clamp((t - at - i * S.motion.stagger) / 0.2)}>
        {l.text}
      </Txt>
    ))}
  </>
);

const LANES: { nm: number; tone: Tone }[] = [
  { nm: 700, tone: TONE.red },
  { nm: 620, tone: TONE.orange },
  { nm: 580, tone: TONE.mustard },
  { nm: 530, tone: TONE.green },
  { nm: 450, tone: TONE.blue },
  { nm: 400, tone: TONE.violet },
];

const HeadlineSample: React.FC = () => {
  const t = useT();
  const a = 520;
  const iso = new Iso(540, 800, 1, "hl");
  board(iso, a, a, TONE.cream);
  const z0 = drop(t, 0.35);
  // the block that splits the light, a low wedge on the far part of the board
  if (z0 < SHOWN) iso.box(120, 120, z0, 90, 90, 70, TONE.cream, 5);
  if (z0 < SHOWN) iso.box(132, 132, 70 + z0, 66, 66, 16, { top: TONE.mustard.top, left: TONE.mustard.left, right: TONE.mustard.right }, 6);
  const beam = ease("route", t - 0.8);
  const sunP: V3 = [420, 40, 470];
  iso.sphere(sunP[0], sunP[1], sunP[2], 66, TONE.mustard, 900);
  iso.line([[sunP[0] - 30, sunP[1] + 8, sunP[2] - 40], [165, 165, 96]], 15, TONE.mustard.left, beam, false, 800);
  const fan = ease("route", t - 1.4);
  LANES.forEach((l, i) => {
    const y = 40 + i * 88;
    iso.line([[215, 160 + i * 6, 2], [340, 160 + (y - 160) * 0.55, 2], [a - 12, y, 2]], 22, l.tone.top, fan, true, -1e4);
  });
  iso.tree(46, 450, 2.1);
  iso.tree(112, 486, 1.6);
  iso.house(26, 280, 72, 84, 54, 36, TONE.cream, TONE.red);
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={iso} a={a} b={a} />
        {iso.draw()}
        <Caps t={t} y={310} lines={[{ text: "SUNLIGHT" }, { text: "CARRIES EVERY" }, { text: "COLOUR AT ONCE" }]} />
      </Stage>
      <Caption text="From 700 nm down to 400 nm" t={t} at={2.2} />
    </Ground>
  );
};

/** Two joined atoms. */
const molecule = (iso: Iso, x: number, y: number, z: number, r: number, bias = 0) => {
  iso.sphere(x + r * 0.62, y - r * 0.62, z, r, TONE.soil, bias);
  iso.sphere(x - r * 0.62, y + r * 0.62, z, r, TONE.soil, bias + 1);
};

const Diagram: React.FC = () => {
  const t = useT();
  const a = 520;
  const iso = new Iso(540, 870, 1, "dg");
  board(iso, a, a, TONE.green);
  const m: V3 = [270, 270, 210];
  const zp = drop(t, 0.2);
  if (zp < SHOWN) {
    iso.cylinder(m[0], m[1], zp, 50, 120, TONE.cream, 0);
    molecule(iso, m[0], m[1], m[2] + zp, 52, 600);
  }
  iso.house(380, 400, 80, 90, 56, 38, TONE.cream, TONE.red);
  iso.tree(440, 70, 2.1);
  iso.tree(480, 150, 1.5);
  iso.tree(50, 460, 1.9);
  const sun: V3 = [-160, 180, 560];
  iso.sphere(sun[0], sun[1], sun[2], 70, TONE.mustard, 900);
  const beam = ease("route", t - 0.5);
  iso.line([[sun[0] + 30, sun[1] + 10, sun[2] - 30], [m[0] - 62, m[1] - 8, m[2] + 22]], 16, TONE.mustard.left, beam, true, 500);
  const hit = 0.5 + S.motion.recipes.route.duration;
  const sc = ease("route", t - hit);
  iso.line([[m[0] + 70, m[1] + 8, m[2] - 14], [m[0] + 360, m[1] + 24, m[2] - 130]], 12, TONE.red.top, sc, true, 700);
  const rays: V3[] = [[0, -260, 30], [-250, 0, 20], [0, 240, 10], [0, 0, 240], [230, -160, 120], [-170, 230, 60]];
  rays.forEach((d, i) => {
    const q = ease("route", t - hit - 0.1 - i * 0.05);
    const u = Math.hypot(d[0], d[1], d[2]) || 1;
    iso.line([[m[0] + (d[0] / u) * 90, m[1] + (d[1] / u) * 90, m[2] + (d[2] / u) * 90], [m[0] + d[0], m[1] + d[1], m[2] + d[2]]], 14, TONE.blue.left, q, true, 800);
  });
  const [ax, ay] = iso.p(m[0] - 32, m[1] + 32, m[2]);
  const [sx, sy] = iso.p(sun[0], sun[1], sun[2]);
  const inset = ease("inset", t - 2.1);
  const R0 = E.insetRadius;
  const ic: [number, number] = [790, 450];
  const ix = new Iso(ic[0], ic[1] + 20, 1, "dgi");
  ix.sphere(44, -44, 0, 60, TONE.soil);
  ix.sphere(-44, 44, 0, 60, TONE.soil, 1);
  const aRays: [number, number][] = [[1, 0], [-1, 0], [0, -1], [0.72, -0.72], [-0.72, -0.72]];
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={iso} a={a} b={a} />
        {iso.draw()}
        <Txt x={sx - 50} y={sy + 120} size={T.label}>
          {SAMPLE.diagram.in.toUpperCase()}
        </Txt>
        <Pin from={[ax, ay]} rise={ay - 1168} run={-250} lines={[SAMPLE.diagram.object.toUpperCase()]} t={t} at={1.7} />
        {inset > 0 ? (
          <g transform={`translate(${ic[0]} ${ic[1]}) scale(${inset}) translate(${-ic[0]} ${-ic[1]})`}>
            <circle cx={ic[0]} cy={ic[1]} r={R0} fill={C.card} stroke={C.ink} strokeWidth={E.line} />
            {ix.draw()}
            {aRays.map(([ux, uy], i) => (
              <line key={i} x1={ic[0] + ux * 110} y1={ic[1] + uy * 110} x2={ic[0] + ux * 165} y2={ic[1] + uy * 165} stroke={TONE.blue.left} strokeWidth={12} strokeLinecap="round" />
            ))}
            <Txt x={ic[0]} y={ic[1] + 116} size={T.note} anchor="middle" track={0.08}>
              SCATTERS
            </Txt>
            <Txt x={ic[0]} y={ic[1] + 150} size={T.note} anchor="middle" track={0.08}>
              BLUE LIGHT
            </Txt>
          </g>
        ) : null}
      </Stage>
      <Caption text={SAMPLE.diagram.out} t={t} at={2.3} />
    </Ground>
  );
};

/** A tower of cubes: `count` cubes laid `cols × rows` per layer, each one popping in turn. */
const tower = (iso: Iso, x: number, y: number, count: number, tone: Tone, t: number, at: number, per: number) => {
  const unit = E.cube + E.cubeGap;
  const c = E.cube;
  const cols = 5;
  const rows = 2;
  for (let i = 0; i < count; i++) {
    const k = pop(t - at - i * per);
    if (k <= 0) continue;
    const layer = Math.floor(i / (cols * rows));
    const inLayer = i % (cols * rows);
    const cx = x + (inLayer % rows) * unit;
    const cy = y + Math.floor(inLayer / rows) * unit;
    const s = c * k;
    const off = (c - s) / 2;
    iso.box(cx + off, cy + off, layer * unit + 1, s, s, s, tone, 0);
  }
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const a = 500;
  const iso = new Iso(540, 830, 1, "nm");
  board(iso, a, a, TONE.cream);
  const blueCount = Math.round(n.value * 10); // one cube = 0.1 of red's scattering: 59 and 10
  const redCount = 10;
  tower(iso, 70, 90, blueCount, TONE.blue, t, 0.4, 0.024);
  tower(iso, 300, 90, redCount, TONE.red, t, 1.2, 0.04);
  const shown = clamp((t - 0.4) / (blueCount * 0.024));
  const [bx, by] = iso.p(190, 100, 384);
  const [rx, ry] = iso.p(390, 110, 64);
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={iso} a={a} b={a} />
        {iso.draw()}
        <NumberText value={(n.value * shown).toFixed(n.decimals)} unit={n.unit} />
        <Pin from={[bx, by]} rise={70} run={250} lines={["BLUE 450 NM"]} t={t} at={1.9} />
        <Pin from={[rx, ry]} rise={170} run={150} lines={["RED", "700 NM"]} t={t} at={2.0} />
      </Stage>
      <Caption text="1 cube = 0.1 of red's scattering" t={t} at={2.1} size={T.body - 4} />
    </Ground>
  );
};

const NumberText: React.FC<{ value: string; unit: string }> = ({ value, unit }) => (
  <>
    <Txt x={S.layout.margin} y={440} size={T.number} weight={400} track={0}>
      {value}
    </Txt>
    <Txt x={S.layout.margin + T.number * 1.3} y={440} size={T.unit} weight={500} track={0} fill={C.blue}>
      {unit}
    </Txt>
  </>
);

const Station: React.FC<{ n: number; x: number; y: number; lines: string[]; t: number; at: number }> = ({ n, x, y, lines, t, at: start }) => {
  const a = clamp((t - start) / 0.2);
  const size = T.label + 6;
  return (
    <g opacity={a}>
      <circle cx={x + 36} cy={y} r={36} fill={C.ink} />
      <text x={x + 36} y={y + 17} textAnchor="middle" fontFamily={SANS} fill={C.card} fontSize={48} fontWeight={600}>
        {n}
      </text>
      {lines.map((l, i) => (
        <Txt key={i} x={x + 92} y={y - 8 + i * size * 1.2} size={size} track={0.06}>
          {l}
        </Txt>
      ))}
    </g>
  );
};

const List: React.FC = () => {
  const t = useT();
  const a = 200;
  const k = 1.25;
  const views = [new Iso(292, 430, k, "l1"), new Iso(790, 770, k, "l2"), new Iso(292, 1150, k, "l3")];
  const [v1, v2, v3] = views;
  const land = (i: number) => drop(t, 0.2 + i * 0.5);
  views.forEach((v, i) => {
    const z = land(i);
    if (z > SHOWN) return;
    board(v, a, a, TONE.green, -z);
  });
  if (land(0) < SHOWN) {
    v1.sphere(30, 30, 170 - land(0), 44, TONE.mustard, 500);
    v1.line([[56, 56, 130 - land(0)], [120, 120, 8 - land(0)]], 13, TONE.mustard.left, ease("route", t - 0.6), true, 400);
  }
  if (land(1) < SHOWN) {
    molecule(v2, 100, 100, 74 - land(1), 26, 200);
    const q = ease("route", t - 1.05);
    ([[0, -120, 10], [-120, 0, 10], [120, 0, 10], [0, 120, 10], [0, 0, 120]] as V3[]).forEach((d) => {
      const u = Math.hypot(d[0], d[1], d[2]) || 1;
      v2.line([[100 + (d[0] / u) * 44, 100 + (d[1] / u) * 44, 74 + (d[2] / u) * 44], [100 + d[0], 100 + d[1], 74 + d[2]]], 10, TONE.blue.left, q, true, 300);
    });
  }
  if (land(2) < SHOWN) {
    v3.person(100, 100, 2, TONE.red);
    v3.tree(36, 150, 1.3);
    const q = ease("route", t - 1.5);
    ([[100, -30, 118], [-30, 100, 118], [190, 40, 110], [40, 190, 110]] as V3[]).forEach((f) => {
      v3.line([f, [100 + (f[0] - 100) * 0.26, 100 + (f[1] - 100) * 0.26, 78]], 10, TONE.blue.left, q, true, 300);
    });
  }
  const route = ease("route", t - 1.0);
  const route2 = ease("route", t - 1.5);
  const p1 = v1.p(a, a / 2, -34);
  const p2 = v2.p(a / 2, a, 0);
  const p3 = v2.p(a / 2, a, -56);
  const p4 = v3.p(a, 20, 0);
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={v1} a={a} b={a} depth={46} />
        <BoardShadow iso={v2} a={a} b={a} depth={46} />
        <BoardShadow iso={v3} a={a} b={a} depth={46} />
        <path d={`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`} pathLength={1} fill="none" stroke={C.ink} strokeWidth={E.line} strokeDasharray="0.03 0.03" opacity={route} />
        <path d={`M ${p3[0]} ${p3[1]} L ${p4[0]} ${p4[1]}`} pathLength={1} fill="none" stroke={C.ink} strokeWidth={E.line} strokeDasharray="0.03 0.03" opacity={route2} />
        {v1.draw()}
        {v2.draw()}
        {v3.draw()}
        <Station n={1} x={530} y={420} lines={["SUNLIGHT", "ENTERS THE AIR"]} t={t} at={0.5} />
        <Station n={2} x={72} y={800} lines={["BLUE SCATTERS", "EVERYWHERE"]} t={t} at={1.0} />
        <Station n={3} x={530} y={1150} lines={["BLUE REACHES", "YOU FROM", "ALL SIDES"]} t={t} at={1.5} />
      </Stage>
    </Ground>
  );
};

const End: React.FC = () => {
  const t = useT();
  const a = 430;
  const b = 680;
  const iso = new Iso(655, 720, 1, "en");
  const ws = plain(SAMPLE.end.line).toUpperCase().split(" ");
  Plate({ iso, t, a, b, size: T.title + 14, at: 0.25, lead: 1.1, lines: [{ text: `${ws[0]} ${ws[1]}` }, { text: ws[2], tone: TONE.blue }] });
  iso.person(a - 70, 150, 2.1, TONE.red, { armUp: true, bias: 2e5 });
  iso.person(a - 70, 80, 2.1, TONE.green, { armUp: false, bias: 2e5 });
  return (
    <Ground>
      <Stage>
        <BoardShadow iso={iso} a={a} b={b} />
        <Sky t={t} to={[700, 800]} />
        {iso.draw()}
        <Txt x={S.layout.margin} y={1395} size={T.note} weight={500} fill={C.soil}>
          NOT TO SCALE
        </Txt>
      </Stage>
      <Caption text={SAMPLE.end.cta} t={t} at={1.2} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.6, component: Title },
  { id: "headline", duration: 3.4, hero: 3.1, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.4, hero: 3.1, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.9, component: List },
  { id: "end", duration: 2.8, hero: 2.5, component: End },
];
