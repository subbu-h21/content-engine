/**
 * Lit Pixel Diorama on the shared sample content: a chapter card over the harbour at night, a prism splitting the dawn
 * light into every colour, an air molecule lit by the lighthouse speaking in a dialogue box, the 5.9× as two pillars
 * of light, lamps lighting one by one for the steps, and a title card over the blue day.
 */
import React from "react";
import { SAMPLE, useSeconds, type Sample } from "../../kit";
import {
  C,
  ChapterLabel,
  col,
  Diorama,
  Dialogue,
  ease,
  flicker,
  Frame,
  GoldTitle,
  Ground,
  house,
  lamp,
  lanternAt,
  lighthouse,
  mix,
  Narration,
  Ornament,
  Plate,
  pt,
  PX,
  S,
  Sky,
  Sprite,
  Textures,
  W,
  type Building,
  type Light,
  type TimeKey,
  type View,
} from "./parts";

const T = S.type;
const BUILDINGS: Building[] = [
  { x: 330, y: 470, w: 220, h: 440, d: 160, wall: "brick", roof: "slate", windows: [[0.25, 0.72], [0.75, 0.72], [0.25, 0.38], [0.75, 0.38]], door: 0.5 },
  { x: 40, y: 380, w: 250, h: 345, d: 150, wall: "plaster", roof: "tile", windows: [[0.3, 0.62], [0.72, 0.62]], door: 0.5 },
  { x: 640, y: 360, w: 230, h: 300, d: 140, wall: "wood", roof: "tile", windows: [[0.28, 0.6], [0.74, 0.6]], door: 0.5 },
];

type SetOpts = { time: TimeKey; v: View; t: number; lamps?: { x: number; y: number; k: number }[]; sprites?: { x: number; y: number; who: "hero" | "keeper"; flip?: boolean }[]; beacon?: number; extra?: React.ReactNode; front?: React.ReactNode };

/** The harbour set: sky, ground and water, the lighthouse, three houses, lamps and sprites; returns its lights too. */
const harbour = (o: SetOpts): { set: React.ReactNode; lights: Light[]; beacon: [number, number] } => {
  const { time, v, t } = o;
  const lights: Light[] = [];
  const lh = lighthouse(v, 900, 540, time, o.beacon ?? (time === "night" ? 1 : 0));
  if (lh.light) lights.push(lh.light);
  const houses = BUILDINGS.map((b) => house(v, b, time, t));
  houses.forEach((h) => lights.push(...h.lights));
  const lamps = (o.lamps ?? []).map((l) => lamp(v, l.x, l.y, l.k, time));
  lamps.forEach((l) => l.light && lights.push(l.light));
  (o.sprites ?? []).forEach((s) => {
    if (s.who === "hero") {
      const [lx, ly] = lanternAt(v, s.x, s.y, s.flip);
      lights.push({ x: lx, y: ly, r: 90, c: C.lantern, k: time === "night" ? 1 : 0.6, seed: 4 });
    }
  });
  const [, horizon] = pt(v, 0, 600);
  const set = (
    <AbsoluteSet>
      <Sky time={time} horizon={horizon + 4} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Textures time={time} />
        <Ground v={v} time={time} />
        {lh.node}
        {houses.map((h) => h.node)}
        {o.extra}
        {lamps.map((l) => l.node)}
        {(o.sprites ?? []).map((s, i) => (
          <Sprite key={i} v={v} x={s.x} y={s.y} who={s.who} time={time} flip={s.flip} lantern={s.who === "hero"} />
        ))}
        {o.front}
      </svg>
    </AbsoluteSet>
  );
  return { set, lights, beacon: lh.beacon };
};
const AbsoluteSet: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", inset: 0 }}>{children}</div>;

/** One pixel ember drifting up across the chapter card. */
const Ember: React.FC<{ t: number }> = ({ t }) => {
  const x = 300 + t * 90 + Math.sin(t * 2) * 30;
  const y = 980 - t * 60;
  return (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <rect x={Math.round(x / PX) * PX} y={Math.round(y / PX) * PX} width={PX} height={PX} fill="#ffb050" opacity={0.6 + 0.4 * flicker(t, 2)} />
      <circle cx={x + PX / 2} cy={y + PX / 2} r={14} fill="#ff9d4a" opacity={0.25} />
    </svg>
  );
};

const v0: View = { gy: S.layout.ground };
const SPRITES = [
  { x: 430, y: 190, who: "hero" as const },
  { x: 620, y: 235, who: "keeper" as const, flip: true },
];

const Title: React.FC = () => {
  const t = useSeconds();
  const h = harbour({ time: "night", v: v0, t, lamps: [{ x: 200, y: 170, k: 1 }, { x: 790, y: 210, k: 1 }], sprites: SPRITES });
  return (
    <Frame>
      <Diorama set={h.set} lights={h.lights} time="night" t={t} fogTop={1270} fogBottom={1560} />
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(2,3,8,0.5)" }} />
      <ChapterLabel text="CHAPTER  I" y={300} at={0.1} />
      <Ornament y={378} at={0.3} />
      <GoldTitle lines={["WHY IS THE", "SKY BLUE?"]} size={T.title - 12} y={420} at={0.4} />
      <Narration lines={[SAMPLE.kicker]} y={680} at={1.2} />
      <Ember t={t} />
    </Frame>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const v = v0;
  const [px, py] = pt(v, 560, 170, 0);
  const prism = (
    <g shapeRendering="crispEdges">
      <rect x={px - 7 * PX} y={py - 14 * PX} width={14 * PX} height={14 * PX} fill={mix(col("stone-3"), "#ffffff", 0.25)} />
      <rect x={px - 7 * PX} y={py - 14 * PX} width={14 * PX} height={PX} fill={mix(col("stone-3"), "#ffffff", 0.5)} />
      <polygon points={`${px - 6 * PX},${py - 14 * PX} ${px + 6 * PX},${py - 14 * PX} ${px},${py - 27 * PX}`} fill="#e8f2ff" opacity={0.9} />
      <polygon points={`${px},${py - 14 * PX} ${px + 6 * PX},${py - 14 * PX} ${px},${py - 27 * PX}`} fill="#b8d0f0" opacity={0.9} />
    </g>
  );
  const h = harbour({ time: "dawn", v, t, sprites: [{ x: 330, y: 150, who: "hero" }], extra: prism });
  const beam = ease("light", t - 0.4);
  const fan = ease("light", t - 1.0);
  const spectrum = [col("tile-2"), col("accent"), col("title-1"), "#7fd08a", col("accent2"), "#a78ad8"];
  const apex: [number, number] = [px, py - 19 * PX];
  const overlay = (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <filter id="hd-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {beam > 0 ? (
        <polygon
          points={`${-60},${560} ${-60 + (apex[0] + 60) * beam},${560 + (apex[1] - 560) * beam} ${-60 + (apex[0] + 60) * beam},${560 + (apex[1] - 560) * beam + 26} ${-60},${680}`}
          fill="#fff0c8"
          opacity={0.55}
          filter="url(#hd-soft)"
        />
      ) : null}
      {fan > 0
        ? spectrum.map((c, i) => {
            const a = (-6 + i * 4) * (Math.PI / 180);
            const len = 400 * fan;
            const x2 = apex[0] + len * Math.cos(a);
            const y2 = apex[1] + 30 + len * Math.sin(a) + i * 20;
            return <polygon key={i} points={`${apex[0]},${apex[1]} ${x2},${y2 - 14} ${x2},${y2 + 14}`} fill={c} opacity={0.75} filter="url(#hd-soft)" />;
          })
        : null}
    </svg>
  );
  return (
    <Frame>
      <Diorama set={h.set} lights={[...h.lights, { x: apex[0], y: apex[1], r: 110, c: "#fff0c8", k: fan, seed: 1 }]} time="dawn" t={t} fogTop={1270} fogBottom={1560} overlay={overlay} />
      <Narration lines={["Sunlight carries every", "colour at once."]} y={700} at={1.4} />
    </Frame>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const v: View = { gy: 1180 };
  const h = harbour({ time: "night", v, t, sprites: [{ x: 300, y: 150, who: "hero" }], lamps: [{ x: 160, y: 120, k: 1 }] });
  const [ox, oy] = pt(v, 520, 300, 300);
  const beamK = ease("light", t - 0.3);
  const hit = 0.3 + S.motion.recipes.light.duration;
  const b = h.beacon;
  const step = Math.floor(t * 12) / 12;
  const motes: React.ReactNode[] = [];
  const moteLights: Light[] = [];
  for (let k = 0; k < 3; k++) {
    const age = step - hit - k * 0.45;
    if (age < 0) continue;
    const a0 = (age % 1.35) / 1.35;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + k * 0.4;
      const d = 40 + 330 * a0;
      const x = Math.round((ox + d * Math.cos(a)) / PX) * PX;
      const y = Math.round((oy + d * Math.sin(a) * 0.8) / PX) * PX;
      motes.push(<rect key={`${k}-${i}`} x={x} y={y} width={2 * PX} height={2 * PX} fill="#d6e2ff" />);
      if (i % 3 === 0) moteLights.push({ x: x + PX, y: y + PX, r: 34, c: C.moon, k: 1 - a0, seed: i });
    }
  }
  const orb = (
    <g shapeRendering="crispEdges">
      {Array.from({ length: 13 }, (_, yy) =>
        Array.from({ length: 13 }, (_, xx) => {
          const dx = xx - 6;
          const dy = yy - 6;
          const r = Math.hypot(dx + 0.5, dy + 0.5);
          if (r > 6.4) return null;
          const lit = dx + dy < -3 ? "#ffffff" : r > 5 ? "#8fa8e0" : "#c8d8ff";
          return <rect key={`${xx}-${yy}`} x={ox + dx * PX} y={oy + dy * PX} width={PX} height={PX} fill={lit} />;
        }),
      )}
    </g>
  );
  const overlay = (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <filter id="hd-beam" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={12} />
        </filter>
      </defs>
      {beamK > 0 ? (
        <polygon
          points={`${b[0]},${b[1] - 6} ${b[0] + (ox - b[0]) * beamK},${b[1] + (oy - b[1]) * beamK - 40} ${b[0] + (ox - b[0]) * beamK},${b[1] + (oy - b[1]) * beamK + 40} ${b[0]},${b[1] + 6}`}
          fill="#fff0c8"
          opacity={0.6}
          filter="url(#hd-beam)"
        />
      ) : null}
      {motes}
    </svg>
  );
  return (
    <Frame>
      <Diorama
        set={h.set}
        lights={[...h.lights, ...moteLights, ...(t >= hit ? [{ x: ox, y: oy, r: 200, c: "#c8d8ff", k: 1, seed: 3 }] : [])]}
        time="night"
        t={t}
        band={[0.28, 0.58]}
        fogTop={810}
        fogBottom={1100}
        overlay={
          <>
            {overlay}
            <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              {orb}
            </svg>
          </>
        }
      />
      <Dialogue name={SAMPLE.diagram.object} text={`${SAMPLE.diagram.label}.\n${SAMPLE.diagram.out}.`} at={hit + 0.1} dur={1.4} />
    </Frame>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const unit = 70;
  const h = harbour({ time: "night", v: v0, t });
  const brazier = (x: number) => {
    const [bx, by] = pt(v0, x, 200);
    return (
      <g key={x} shapeRendering="crispEdges">
        <rect x={bx - 8 * PX} y={by - 10 * PX} width={16 * PX} height={10 * PX} fill={col("stone-2")} />
        <rect x={bx - 9 * PX} y={by - 11 * PX} width={18 * PX} height={2 * PX} fill={col("stone-3")} />
      </g>
    );
  };
  const pillar = (x: number, height: number, c: string, at: number) => {
    const k = ease("light", t - at);
    const [bx, by] = pt(v0, x, 200);
    const top = by - 11 * PX - height * k;
    return (
      <g key={`p${x}`}>
        <rect x={bx - 60} y={top} width={120} height={by - 11 * PX - top} fill={`url(#pil-${x})`} filter="url(#pil-soft)" />
        <rect x={bx - 18} y={top} width={36} height={by - 11 * PX - top} fill={c} opacity={0.9} />
        <defs>
          <linearGradient id={`pil-${x}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity={0.1} />
            <stop offset="100%" stopColor={c} stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </g>
    );
  };
  const blueX = 330;
  const redX = 740;
  const [bpx, bpy] = pt(v0, blueX, 200);
  const [rpx, rpy] = pt(v0, redX, 200);
  const overlay = (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <filter id="pil-soft" x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>
      {pillar(blueX, n.value * unit, "#a8bff0", 0.8)}
      {pillar(redX, unit, "#ff7a50", 1.0)}
    </svg>
  );
  return (
    <Frame>
      <Diorama
        set={
          <>
            {h.set}
            <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              {[brazier(blueX), brazier(redX)]}
            </svg>
          </>
        }
        lights={[...h.lights, { x: bpx, y: bpy - 80, r: 160, c: "#a8bff0", k: 1, seed: 2 }, { x: rpx, y: rpy - 80, r: 120, c: "#ff7a50", k: 1, seed: 5 }]}
        time="night"
        t={t}
        fogTop={1270}
        fogBottom={1560}
        overlay={overlay}
      />
      <GoldTitle lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size={T.number} y={300} at={0.2} />
      <Plate text="450 nm" x={bpx} y={bpy - 11 * PX - n.value * unit - 90} at={1.5} align="center" />
      <Plate text="700 nm" x={rpx} y={rpy - 11 * PX - unit - 170} at={1.6} align="center" />
      <Narration lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} y={590} at={1.8} size={T.body - 4} />
    </Frame>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const every = S.motion.lampEvery;
  const ats = [0.5, 0.5 + every, 0.5 + 2 * every];
  const lampsAt = [
    { x: 170, y: 150 },
    { x: 540, y: 260 },
    { x: 860, y: 170 },
  ];
  const h = harbour({
    time: "night",
    v: v0,
    t,
    beacon: 0,
    lamps: lampsAt.map((l, i) => ({ ...l, k: ease("light", t - ats[i]) })),
    sprites: [{ x: 360, y: 120, who: "hero" }],
  });
  const roman = ["I", "II", "III"];
  return (
    <Frame>
      <Diorama set={h.set} lights={h.lights} time="night" t={t} fogTop={1270} fogBottom={1560} />
      <ChapterLabel text="IN THREE STEPS" y={290} at={0.1} />
      <Ornament y={364} at={0.2} />
      {SAMPLE.list.map((item, i) => (
        <Plate key={i} text={`${roman[i]}   ${item}`} x={W / 2} y={420 + i * 110} at={ats[i] + 0.1} align="center" size={T.label + 2} />
      ))}
    </Frame>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const h = harbour({ time: "day", v: v0, t, sprites: SPRITES, lamps: [{ x: 200, y: 170, k: 0 }] });
  return (
    <Frame>
      <Diorama set={h.set} lights={h.lights} time="day" t={t} fogTop={1270} fogBottom={1560} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,3,8,0.55) 0%, rgba(2,3,8,0.4) 45%, rgba(2,3,8,0) 70%)" }} />
      <Ornament y={360} at={0.1} />
      <GoldTitle lines={["LOOK UP", "AGAIN."]} size={T.title + 8} y={410} at={0.2} />
      <Narration lines={[SAMPLE.end.cta]} y={720} at={1.0} />
    </Frame>
  );
};


export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.6, component: Title },
  { id: "headline", duration: 3.4, hero: 2.9, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.2, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.6, component: List },
  { id: "end", duration: 3, hero: 2.5, component: End },
];
