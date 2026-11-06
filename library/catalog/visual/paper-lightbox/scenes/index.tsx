/** Paper Lightbox on the shared sample content: one lit shadow box per sample; the words are gold paper strips. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { allOn, Box, C, ease, H, karst, Lanterns, lit, mix, Moon, NightPanel, NightStack, S, Sheet, Strip, Subtitle, TR, W, type NightOn } from "./parts";
import { DISPLAY } from "./fonts";

const T = S.type;
const ST = S.motion.stagger;
const lead = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");

/** Lamp-on, back to front: moon, then each sheet 0.42 s after the one behind it, then the windows. */
const lampOn = (t: number, at: number): NightOn => ({
  moon: ease("moon", t - at),
  clouds: lit(t, at + 0.4),
  far: lit(t, at + 0.4 + ST),
  mid: lit(t, at + 0.4 + 2 * ST),
  river: lit(t, at + 0.4 + 3 * ST),
  village: lit(t, at + 0.4 + 3 * ST),
  tree: lit(t, at + 0.4 + 4 * ST),
  bank: lit(t, at + 0.4 + 4.5 * ST),
  windows: lit(t, at + 0.4 + 5 * ST),
});

const Title: React.FC = () => {
  const t = useSeconds();
  const title = SAMPLE.title;
  return (
    <Box
      over={
        <>
          <Strip text={SAMPLE.kicker} y={250} at={1.6} size={T.kicker} caps paper={C.strip2} />
          <Strip text={lead(title)} y={316} at={2.0} size={T.title} />
          <Strip text={em(title)} y={500} at={2.4} size={T.title} seal />
        </>
      }
    >
      <NightStack on={lampOn(t, 0.1)} moon={[790, 650, 92]} figureAt={700} tag="ti" />
      <Lanterns at={[[300, 1330], [420, 1290]]} on={lit(t, 0.1 + 0.4 + 5.5 * ST)} top={1222} />
    </Box>
  );
};

/** A sheet with a hole: the full frame minus a circle (or a notched sun) at (cx, cy). */
const holed = (cx: number, cy: number, r: number, notches = 0): string => {
  const frame = `M -40 -40 H ${W + 40} V ${H + 40} H -40 Z`;
  if (!notches) return `${frame} M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  const pts: string[] = [];
  for (let i = 0; i < notches * 2; i++) {
    const a = (Math.PI * i) / notches;
    const rr = i % 2 ? r * 0.8 : r;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `${frame} M ${pts.join(" L ")} Z`;
};

const Headline: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [540, 690];
  // the warm ladder: a tunnel of nested cut rings, back bright and translucent, front dark and opaque
  const sheets = [
    { r: 210, notch: 16, fill: mix(C.wallWarm, C.glowWarm, 0.45), trans: 0.7 },
    { r: 290, notch: 0, fill: C.wallWarm, trans: 0.45 },
    { r: 365, notch: 0, fill: C.props, trans: 0.25 },
    { r: 440, notch: 0, fill: C.figure, trans: 0.05 },
  ];
  const sun = ease("moon", t - 0.1);
  const [l1, l2] = SAMPLE.headline;
  return (
    <Box
      bg={C.figure}
      over={
        <>
          <Strip text={l1} y={1150} at={1.7} size={T.display} />
          <Strip text={lead(l2)} y={1298} at={2.0} size={T.display} />
          <Strip text={em(l2)} y={1446} at={2.3} size={T.display} seal />
        </>
      }
    >
      <rect width={W} height={H} fill={mix(C.wallWarm, C.glowWarm, 0.3 + 0.5 * sun)} />
      <Moon x={cx} y={cy} r={120} on={sun} id="hl-sun" />
      {sheets.map((s, i) => (
        <Sheet
          key={i}
          id={`hl-${i}`}
          parts={[{ d: holed(cx, cy, s.r, s.notch), fill: s.fill, rule: "evenodd" }]}
          trans={s.trans}
          on={lit(t, 0.35 + i * ST)}
          light={[cx, cy]}
          lightCol={C.glowWarm}
        />
      ))}
    </Box>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [540, 900];
  const src: [number, number] = [-60, 290];
  const beam = ease("slide", t - 0.2);
  const glow = lit(t, 1.0);
  const rays = [-90, -20, 22, 66, 112, 158, 202];
  const slit = (a0: number, r0: number, r1: number, w: number) => {
    const a = (a0 * Math.PI) / 180;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const p0 = [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0];
    const p1 = [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1];
    return ` M ${p0[0] + nx * w * 0.25} ${p0[1] + ny * w * 0.25} L ${p1[0] + nx * w} ${p1[1] + ny * w} L ${p1[0] - nx * w} ${p1[1] - ny * w} L ${p0[0] - nx * w * 0.25} ${p0[1] - ny * w * 0.25} Z`;
  };
  // the front sheet: the frame minus the molecule's window, the sunlight slit and the scattered slits
  const incoming = (() => {
    const dx = cx - src[0];
    const dy = cy - src[1];
    const l = Math.hypot(dx, dy);
    const nx = -dy / l;
    const ny = dx / l;
    const end = [cx - (dx / l) * 140, cy - (dy / l) * 140];
    return ` M ${src[0] + nx * 22} ${src[1] + ny * 22} L ${end[0] + nx * 12} ${end[1] + ny * 12} L ${end[0] - nx * 12} ${end[1] - ny * 12} L ${src[0] - nx * 22} ${src[1] - ny * 22} Z`;
  })();
  const front = `M -40 -40 H ${W + 40} V ${H + 40} H -40 Z M ${cx - 135} ${cy} a 135 135 0 1 0 270 0 a 135 135 0 1 0 -270 0 Z${incoming}${rays.map((a) => slit(a, 175, 430, 24)).join("")}`;
  const reach = 1 - 138 / Math.hypot(cx - src[0], cy - src[1]);
  const bx = src[0] + (cx - src[0]) * reach * beam;
  const by = src[1] + (cy - src[1]) * reach * beam;
  const d = SAMPLE.diagram;
  return (
    <Box
      over={
        <>
          <Strip text={d.in} x={300} y={300} at={0.9} size={T.label} />
          <Strip text={d.object} x={690} y={590} at={1.9} size={T.label} />
          <Strip text={d.out} y={1300} at={2.3} size={T.label} align="center" />
          <Subtitle text={SAMPLE.body} at={2.6} />
        </>
      }
    >
      <NightPanel on={0.5 + 0.5 * glow} id="dg-panel" />
      {/* light behind the front sheet: the warm sunlight arriving, then the cool scattered glow */}
      <radialGradient id="dg-glow" cx={cx} cy={cy} r={560} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor={C.moon} stopOpacity={1} />
        <stop offset={0.3} stopColor={C.clouds} stopOpacity={1} />
        <stop offset={0.78} stopColor={C.far} stopOpacity={0.9} />
        <stop offset={1} stopColor={C.far} stopOpacity={0.3} />
      </radialGradient>
      <circle cx={cx} cy={cy} r={560} fill="url(#dg-glow)" opacity={glow} />
      {beam > 0 ? (
        <g filter="url(#pl-bloom)">
          <line x1={src[0]} y1={src[1]} x2={bx} y2={by} stroke={C.window} strokeWidth={46} strokeLinecap="round" />
        </g>
      ) : null}
      {/* the molecule: two joined paper discs on a middle sheet, inside the window */}
      <Sheet
        id="dg-mol"
        parts={[{ d: `M ${cx - 112} ${cy} a 64 64 0 1 0 128 0 a 64 64 0 1 0 -128 0 Z M ${cx - 16} ${cy} a 64 64 0 1 0 128 0 a 64 64 0 1 0 -128 0 Z`, fill: C.mid }]}
        trans={TR.mid}
        on={0.4 + 0.6 * glow}
        light={[cx, cy - 200]}
      />
      <Sheet id="dg-front" parts={[{ d: front, fill: C.bank, rule: "evenodd" }]} trans={TR.bank} on={1} light={[cx, cy]} />
    </Box>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const lamp = ease("moon", t - 0.2);
  const text = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const size = Math.min(T.number, Math.floor((W - 2 * 60) / (text.length * 0.5)));
  const caption = n.caption;
  const cut = caption.indexOf(" than ");
  return (
    <Box
      over={
        <>
          <Strip text={caption.slice(0, cut)} y={1260} at={1.4} size={T.strip} align="center" />
          <Strip text={caption.slice(cut + 1)} y={1372} at={1.7} size={T.strip} align="center" />
        </>
      }
    >
      {/* what burns through the number: the lit panel, a big moon glow and the far peaks */}
      <NightPanel on={lamp} id="nb-panel" />
      <radialGradient id="nb-glow" cx={W / 2} cy={900} r={640} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor={C.halo} stopOpacity={0.95} />
        <stop offset={0.45} stopColor={C.clouds} stopOpacity={0.8} />
        <stop offset={1} stopColor={C.far} stopOpacity={0.2} />
      </radialGradient>
      <rect width={W} height={H} fill="url(#nb-glow)" opacity={lamp} />
      <Moon x={W / 2} y={880} r={150} on={lamp} id="nb-moon" />
      <Sheet id="nb-far" parts={[{ d: karst([[180, 1010, 240], [560, 960, 230], [930, 1000, 240]], 1240), fill: C.far }]} trans={TR.far} on={lamp} light={[W / 2, 880]} />
      <mask id="nb-cut" maskUnits="userSpaceOnUse" x={-40} y={-40} width={W + 80} height={H + 80}>
        <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="#fff" />
        <text x={W / 2} y={1090} textAnchor="middle" fill="#000" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, fontFeatureSettings: '"lnum" 1' }}>
          {text}
        </text>
      </mask>
      <g filter="url(#pl-shadow)">
        <g mask="url(#nb-cut)">
          <rect x={-40} y={-40} width={W + 80} height={H + 80} fill={C.bank} />
          <rect x={-40} y={-40} width={W + 80} height={H + 80} filter="url(#pl-fibre)" opacity={0.2} />
        </g>
      </g>
    </Box>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const on: NightOn = {
    moon: ease("moon", t - 0.1),
    clouds: lit(t, 1.0),
    far: lit(t, 1.0 + ST * 0.5),
    mid: lit(t, 1.0 + ST),
    river: lit(t, 2.0),
    village: lit(t, 2.0),
    tree: lit(t, 2.0 + ST * 0.5),
    bank: lit(t, 2.0 + ST),
    windows: lit(t, 2.0 + ST * 1.5),
  };
  const ys = [300, 760, 1200];
  const at = [0.8, 1.8, 2.8];
  return (
    <Box
      over={
        <>
          {SAMPLE.list.map((item, i) => (
            <Strip key={i} text={`${i + 1} · ${item}`} y={ys[i]} at={at[i]} size={T.label} />
          ))}
        </>
      }
    >
      <NightStack on={on} moon={[820, 520, 84]} figureAt={760} tag="ls" />
    </Box>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const lamp = lit(t, 0.2);
  // outside the box: a walnut frame, black lining, the lit stack inside; spill light on the table
  const [x0, y0, x1, y1] = [96, 250, 984, 1380];
  const fr = 36;
  const [cx0, cy0, cx1, cy1] = [x0 + fr + 8, y0 + fr + 8, x1 - fr - 8, y1 - fr - 8];
  const sc = (cx1 - cx0) / W;
  return (
    <Box
      bg={C.roomDark}
      over={
        <>
          <Strip text={plain(SAMPLE.end.line)} y={cy0 + 70} at={1.3} size={T.display} align="center" seal />
          <Strip text={SAMPLE.end.cta} y={1478} at={2.0} size={T.kicker} caps paper={C.strip2} align="center" />
        </>
      }
    >
      <radialGradient id="en-room" cx={W / 2} cy={(y0 + y1) / 2} r={1200} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor={C.room} />
        <stop offset={1} stopColor={C.roomDark} />
      </radialGradient>
      <rect width={W} height={H} fill="url(#en-room)" />
      <rect x={0} y={y1 - 40} width={W} height={H - y1 + 40} fill={mix(C.walnut, C.roomDark, 0.72)} />
      <radialGradient id="en-spill" cx={W / 2} cy={y1 + 20} r={620} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor={C.spill} stopOpacity={0.5} />
        <stop offset={0.5} stopColor={C.spill} stopOpacity={0.14} />
        <stop offset={1} stopColor={C.spill} stopOpacity={0} />
      </radialGradient>
      <rect x={0} y={y1 - 40} width={W} height={H - y1 + 40} fill="url(#en-spill)" opacity={lamp} />
      {/* frame with a bevel: light on the top and left walls, dark on the bottom and right */}
      <g filter="url(#pl-shadow)">
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={6} fill={C.walnut} />
      </g>
      <path d={`M ${x0} ${y0} H ${x1} L ${x1 - fr} ${y0 + fr} H ${x0 + fr} V ${y1 - fr} L ${x0} ${y1} Z`} fill="#ffffff" opacity={0.1} />
      <path d={`M ${x1} ${y1} H ${x0} L ${x0 + fr} ${y1 - fr} H ${x1 - fr} V ${y0 + fr} L ${x1} ${y0} Z`} fill="#000000" opacity={0.22} />
      <rect x={x0 + fr} y={y0 + fr} width={x1 - x0 - 2 * fr} height={y1 - y0 - 2 * fr} fill="#050505" />
      <clipPath id="en-cavity">
        <rect x={cx0} y={cy0} width={cx1 - cx0} height={cy1 - cy0} />
      </clipPath>
      <g clipPath="url(#en-cavity)">
        <g transform={`translate(${cx0} ${cy0 - 330 * sc}) scale(${sc})`} opacity={0.3 + 0.7 * lamp}>
          <NightStack on={allOn} moon={[540, 760, 96]} figureAt={640} tag="en" />
        </g>
      </g>
    </Box>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4.2, hero: 3.8, component: Title },
  { id: "headline", duration: 3.8, hero: 3.4, component: Headline },
  { id: "diagram", duration: 4.0, hero: 3.6, component: Diagram },
  { id: "number", duration: 3.4, hero: 3.0, component: NumberSample },
  { id: "list", duration: 4.0, hero: 3.65, component: List },
  { id: "end", duration: 3.4, hero: 3.0, component: End },
];
