/**
 * Cel Anime on the shared sample content: a mock OVA title card over a night city, the heroine at dawn with a band of
 * every colour sweeping across her held cel, an air molecule bursting blue speed lines, the 5.9× on backlit cockpit
 * meters, three cuts for the list, and a day-sky ending.
 */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { C, Cel, ChromeTitle, col, ease, Eye, Glint, Heroine, Meter, mix, model, onTwos, Plate, rnd, Rooftop, S, Screen, Skyline, SpeedLines, Subtitle, SunFlare, Tagline, W } from "./parts";

const T = S.type;

const Stars: React.FC<{ n: number; maxY: number; seed?: number }> = ({ n, maxY, seed = 2 }) => (
  <svg width={W} height={maxY} style={{ position: "absolute", left: 0, top: 0 }}>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={rnd(i, seed) * W} cy={rnd(i, seed + 1) * maxY} r={i % 6 === 0 ? 2.6 : 1.5} fill="#ffffff" opacity={0.5 + 0.5 * rnd(i, seed + 2)} />
    ))}
  </svg>
);

const Title: React.FC = () => {
  const t = useSeconds();
  return (
    <Screen>
      <Plate name="night" horizon={1380} />
      <Stars n={90} maxY={900} />
      <Skyline base={1440} seed={4} t={t} />
      <Rooftop y={1660} light="night" />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Heroine id="t-h" x={790} y={1770} s={0.55} light="backlit" dir={[0.35, -0.9]} rim={col("magenta")} t={t} />
      </svg>
      <ChromeTitle lines={["WHY IS", "THE SKY", "BLUE?"]} size={T.title + 20} y={318} at={0.2} glint={[790, 700]} />
      <Tagline text={SAMPLE.kicker} y={858} at={1.0} />
    </Screen>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const held = onTwos(t);
  const sweep = ease("sweep", t - 1.0);
  const hx = 640;
  const hy = 1955;
  const hs = 0.74;
  const bands = [col("accent"), col("gold"), col("text"), col("accent2"), col("jacket-light"), col("hair-light")];
  const bx = -680 + sweep * 1700;
  const band = (
    <g style={{ mixBlendMode: "screen" }} opacity={0.75}>
      {bands.map((c, i) => (
        <polygon key={i} points={`${bx + i * 46},1000 ${bx + i * 46 + 46},1000 ${bx + i * 46 - 254},1920 ${bx + i * 46 - 300},1920`} fill={c} />
      ))}
    </g>
  );
  return (
    <Screen>
      <Plate name="dawn" horizon={1260} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="hl-cloud" x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation={16} />
          </filter>
        </defs>
        {[
          [260, 520, 300, 34],
          [760, 610, 380, 40],
          [420, 700, 260, 26],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i === 1 ? "#ffd2c0" : "#f6b8d2"} opacity={0.7} filter="url(#hl-cloud)" />
        ))}
      </svg>
      <SunFlare x={300} y={880} r={62} />
      <Skyline base={1340} seed={9} tint="#4b3b7a" lit={0.06} signs={false} t={t} maxH={380} />
      <Rooftop y={1720} light="dawn" />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Heroine id="hl-h" x={hx} y={hy} s={hs} light="dawn" dir={[-0.9, -0.35]} t={held} overlay={band} />
      </svg>
      <Subtitle lines={["Sunlight carries every", "colour *at once.*"]} at={0.3} />
    </Screen>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [mx, my, r] = [560, 820, 150];
  const beamAt = 0.3;
  const beam = ease("streak", t - beamAt);
  const hit = beamAt + S.motion.recipes.streak.duration;
  const burst = ease("burst", onTwos(t - hit));
  const a: [number, number] = [-60, 380];
  const ex = a[0] + (mx - a[0]) * beam;
  const ey = a[1] + (my - a[1]) * beam;
  const dir = [mx - a[0], my - a[1]];
  const red = ease("streak", t - hit);
  const circle = `M ${mx - r} ${my} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return (
    <Screen>
      <Plate name="night" horizon={1560} />
      <Stars n={70} maxY={1300} seed={5} />
      <Skyline base={1620} seed={12} lit={0.25} signs={false} t={t} />
      {t >= hit ? <SpeedLines x={mx} y={my} r0={r + 20} r1={760} n={72} cols={[col("muted"), "#5aa8ff", "#ffffff", col("jacket")]} k={burst} /> : null}
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
        <defs>
          <filter id="d-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={14} />
          </filter>
        </defs>
        {beam > 0 ? (
          <>
            <line x1={a[0]} y1={a[1]} x2={ex} y2={ey} stroke={C.gold} strokeWidth={60} strokeLinecap="round" filter="url(#d-glow)" />
            <line x1={a[0]} y1={a[1]} x2={ex} y2={ey} stroke="#fff6d0" strokeWidth={16} strokeLinecap="round" />
          </>
        ) : null}
        {red > 0 ? (
          <>
            <line x1={mx} y1={my} x2={mx + dir[0] * 0.9 * red} y2={my + dir[1] * 0.9 * red} stroke={C.scarf} strokeWidth={40} strokeLinecap="round" filter="url(#d-glow)" />
            <line x1={mx} y1={my} x2={mx + dir[0] * 0.9 * red} y2={my + dir[1] * 0.9 * red} stroke="#ffd0d0" strokeWidth={8} strokeLinecap="round" />
          </>
        ) : null}
      </svg>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Cel id="d-mol" d={circle} m={model("chrome", "night")} light={[-0.7, -0.6]} rim={col("muted")} line={3} />
      </svg>
      {t >= hit ? <Glint x={mx - r * 0.62} y={my - r * 0.6} k={1} size={90} /> : null}
      <Subtitle lines={[SAMPLE.diagram.label]} speaker={SAMPLE.diagram.object} second at={hit + 0.2} />
    </Screen>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const segs = 12;
  const litBlue = Math.min(segs, Math.max(0, Math.floor(onTwos(t - 1.0) * 12)));
  const litRed = Math.min(Math.round(segs / n.value), litBlue);
  const dash = model("dark", "night");
  return (
    <Screen>
      <Plate name="night" horizon={980} />
      <Stars n={40} maxY={600} seed={8} />
      <Skyline base={940} seed={21} lit={0.3} signs={false} t={t} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 0 900 Q 540 840 1080 900 L 1080 1920 L 0 1920 Z" fill={dash.s} />
        <path d="M 0 900 Q 540 840 1080 900 L 1080 918 Q 540 858 0 918 Z" fill={dash.h} />
        <path d="M 0 900 Q 540 840 1080 900" fill="none" stroke={dash.l} strokeWidth={4} />
      </svg>
      <ChromeTitle lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size={T.number} y={300} at={0.2} glint={[880, 380]} />
      <Meter x={140} y={1010} w={800} h={64} n={segs} lit={litBlue} c="#5aa8ff" label="Blue · 450 nm" />
      <Meter x={140} y={1166} w={800} h={64} n={segs} lit={litRed} c={C.scarf} label="Red · 700 nm" />
      <Subtitle lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} at={1.6} size={T.body - 4} y={1324} />
    </Screen>
  );
};

/** One cut of the list: a framed panel showing part of a full-frame painting. */
const Cut: React.FC<{ x: number; y: number; w: number; h: number; at: number; ox: number; oy: number; children: React.ReactNode }> = ({ x, y, w, h, at, ox, oy, children }) => {
  if (useSeconds() < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", border: `6px solid ${col("dark-line")}`, boxShadow: `inset 0 0 0 2px ${col("faint")}` }}>
      <div style={{ position: "absolute", left: -ox, top: -oy, width: W, height: 1920 }}>{children}</div>
    </div>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const px = 72;
  const pw = 936;
  const ph = 380;
  const ys = [250, 662, 1074];
  const ats = [0.2, 0.8, 1.4];
  const circle = (cx: number, cy: number, r: number) => `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return (
    <Screen>
      <Plate name="interior" />
      <Cut x={px} y={ys[0]} w={pw} h={ph} at={ats[0]} ox={72} oy={980}>
        <Plate name="dawn" horizon={1300} />
        <SunFlare x={380} y={1150} r={44} />
        <Skyline base={1360} seed={30} tint="#4b3b7a" lit={0.05} signs={false} t={t} maxH={190} />
      </Cut>
      <Cut x={px} y={ys[1]} w={pw} h={ph} at={ats[1]} ox={72} oy={600}>
        <Plate name="night" horizon={1300} />
        <SpeedLines x={540} y={790} r0={90} r1={600} n={56} cols={[col("muted"), "#5aa8ff", "#ffffff"]} k={1} />
        <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <Cel id="l-mol" d={circle(540, 790, 80)} m={model("chrome", "night")} light={[-0.7, -0.6]} rim={col("muted")} line={3} />
        </svg>
      </Cut>
      <Cut x={px} y={ys[2]} w={pw} h={ph} at={ats[2]} ox={72} oy={1000}>
        <div style={{ position: "absolute", inset: 0, background: mix(col("skin"), "#ffffff", 0.1) }} />
        <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={0} y={1000} width={W} height={400} fill={col("skin")} />
          <path d="M 0 1300 Q 540 1240 1080 1330 L 1080 1400 L 0 1400 Z" fill={col("skin-shade")} />
        </svg>
        <Eye cx={540} cy={1200} w={560} reflect={col("muted")} />
      </Cut>
      {SAMPLE.list.map((item, i) => (
        <Subtitle key={i} lines={[item]} y={ys[i] + ph - 86} at={ats[i] + 0.25} size={T.body - 8} />
      ))}
    </Screen>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  return (
    <Screen>
      <Plate name="day" horizon={1500} />
      <Skyline base={1560} seed={41} tint="#3d4f8f" lit={0} signs={false} t={t} />
      <Rooftop y={1760} light="day" />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <Heroine id="e-h" x={560} y={1990} s={1.22} light="day" dir={[-0.7, -0.7]} pose="point" t={t} wind={30} />
      </svg>
      <ChromeTitle lines={wrap(SAMPLE.end.line.replace(/\*/g, "").toUpperCase(), 8)} size={T.title + 20} y={318} at={0.2} glint={[860, 470]} />
      <Tagline text={SAMPLE.end.cta} y={700} at={0.9} />
    </Screen>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.5, component: Title },
  { id: "headline", duration: 3.2, hero: 1.75, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.7, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3, hero: 2.6, component: List },
  { id: "end", duration: 3, hero: 2.5, component: End },
];
