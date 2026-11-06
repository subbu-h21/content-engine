/** Pictogram on the shared sample content: six flash cards, one hue each, beat-locked at 150 BPM. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { C, Card, Disc, ease, fgOn, Figure, HUES, Hud, M, Meta, mix, Pattern, POSES, S, Svg, Tag, Title, W } from "./parts";
import { TITLE } from "./fonts";

const T = S.type;
const TOTAL = 6;
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");
const fit = (text: string, width: number, max: number) => Math.min(max, Math.floor(width / (text.length * T.charEm)));

const TitleCard: React.FC = () => {
  const hue = "sky";
  const t = HUES[hue];
  const fg = fgOn(hue);
  const name = plain(SAMPLE.title).toUpperCase();
  return (
    <Card bg={t[1]}>
      <Pattern hue={hue} seed={3} />
      {/* layout B: the title fills the frame in a ghost tone; the disc and figure stand over it */}
      <Title lines={["SKY", em(SAMPLE.title)]} y={640} size={T.ghost} at={0.05} col={t[3]} align="center" />
      <Svg>
        <Disc cx={540} cy={900} r={300} col={t[0]} at={0.3} id="ti-d" />
        <Figure x={530} y={1010} h={400} pose={POSES.lookUp} fg={fg} ground={t[0]} at={0.5} id="ti-f" />
      </Svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 200, backgroundColor: t[0] }} />
      <Title lines={[name]} y={1400} size={fit(name, W - 2 * M, 88)} at={0.7} col={fg} />
      <Meta text={`${SAMPLE.kicker.toUpperCase()}   ${SAMPLE.topic.toUpperCase()}`} y={1462} at={0.9} col={mix(fg, t[0], 0.3)} />
      <Hud index={1} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="HOOK" col={fg} />
    </Card>
  );
};

const Headline: React.FC = () => {
  const hue = "coral";
  const t = HUES[hue];
  const fg = fgOn(hue);
  const [l1, l2] = SAMPLE.headline;
  const lines = [...l1.toUpperCase().split(" "), lead(l2).toUpperCase(), em(l2).toUpperCase()];
  const size = fit(lead(l2), W - 2 * M, T.display);
  const rings = (["sand", "teal", "sky", "navy"] as const).map((h) => HUES[h][2]);
  return (
    <Card bg={t[1]}>
      <Pattern hue={hue} seed={5} />
      <Meta text={`${SAMPLE.chapter.toUpperCase()}   EVERY COLOUR`} y={330} at={0.05} col={fg} />
      {/* layout A: the text block on top, the stage under it */}
      <Title lines={lines} y={440} size={size} at={0.1} col={fg} />
      <Svg>
        <Disc cx={540} cy={1250} r={300} col={t[0]} at={0.4} id="hl-d" rings={rings} />
        <Figure x={540} y={1330} h={360} pose={POSES.open} fg={fg} ground={HUES.navy[2]} at={0.65} id="hl-f" />
      </Svg>
      <Hud index={2} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="SUNLIGHT" col={fg} />
    </Card>
  );
};

const Diagram: React.FC = () => {
  const hue = "teal";
  const tn = HUES[hue];
  const fg = fgOn(hue);
  const t = useSeconds();
  const panel = ease("panel", t);
  const d = SAMPLE.diagram;
  const [mx, my] = [560, 1230];
  const sun: [number, number] = [190, 900];
  const arc = ease("whip", t - 0.8);
  const lines = ease("disc", t - 1.1);
  return (
    <Card bg={tn[1]}>
      <Pattern hue={hue} seed={7} spread={0.6} />
      {/* layout C: a solid panel wipes in with a 90 px hairline grid at 10%, the text on it */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 780, backgroundColor: tn[0], clipPath: `inset(0 ${(1 - panel) * 100}% 0 0)`, backgroundImage: `linear-gradient(to right, ${mix(tn[0], fg, 0.1)} 1px, transparent 1px), linear-gradient(to bottom, ${mix(tn[0], fg, 0.1)} 1px, transparent 1px)`, backgroundSize: "90px 90px" }} />
      <Meta text="HOW IT WORKS" y={330} at={0.1} col={fg} />
      <Title lines={["AIR", "MOLECULE"]} y={480} size={fit("MOLECULE", W - 2 * M, T.title)} at={0.2} col={fg} />
      <Title lines={[d.label]} y={700} size={T.second} at={0.36} col={fg} weight={500} />
      <Tag text={`IN · ${d.in.toUpperCase()}`} x={M} y={730} at={0.4} col={fg} />
      <Tag text="OUT · EVERY DIRECTION" x={M + 290} y={730} at={0.45} col={fg} fill={C.coral} />
      <Svg>
        <Disc cx={mx} cy={my} r={300} col={tn[0]} at={0.5} id="dg-d" />
        <Disc cx={sun[0]} cy={sun[1]} r={60} col={HUES.sand[2]} at={0.6} id="dg-s" />
        {arc > 0 ? (
          <>
            <mask id="dg-arc" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={1920}>
              <path d={`M ${sun[0] + 50} ${sun[1] + 40} Q ${sun[0] + 200} ${sun[1] + 40} ${mx - 110} ${my - 70}`} fill="none" stroke="#fff" strokeWidth={30} pathLength={1} strokeDasharray={`${arc} 1`} />
            </mask>
            <path d={`M ${sun[0] + 50} ${sun[1] + 40} Q ${sun[0] + 200} ${sun[1] + 40} ${mx - 110} ${my - 70}`} fill="none" stroke={HUES.sand[2]} strokeWidth={14} strokeLinecap="round" strokeDasharray="22 22" mask="url(#dg-arc)" />
          </>
        ) : null}
        {lines > 0
          ? [0, 45, 90, 135, 180, 270, 315].map((deg) => {
              const a = (deg * Math.PI) / 180;
              const r0 = 130;
              const r1 = r0 + 90 * lines;
              return <line key={deg} x1={mx + Math.cos(a) * r0} y1={my + Math.sin(a) * r0} x2={mx + Math.cos(a) * r1} y2={my + Math.sin(a) * r1} stroke={fg} strokeWidth={20} strokeLinecap="round" />;
            })
          : null}
        {t > 0.9 ? (
          <>
            <circle cx={mx - 44} cy={my} r={60} fill={fg} />
            <circle cx={mx + 44} cy={my} r={60} fill={fg} />
            <circle cx={mx - 44} cy={my} r={20} fill={tn[0]} />
            <circle cx={mx + 44} cy={my} r={20} fill={tn[0]} />
          </>
        ) : null}
      </Svg>
      <Hud index={3} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="SCATTERING" col={fg} />
    </Card>
  );
};

const NumberSample: React.FC = () => {
  const hue = "ink";
  const tn = HUES[hue];
  const fg = C.cream;
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.2);
  return (
    <Card bg={tn[1]}>
      <Pattern hue={hue} seed={9} />
      <div style={{ position: "absolute", right: M - 10, top: 1080, fontFamily: TITLE, fontWeight: 900, fontSize: T.index, lineHeight: 1, color: "transparent", WebkitTextStroke: `3px ${mix(fg, tn[1], 0.8)}` }}>04</div>
      <Meta text="BY THE NUMBERS" y={330} at={0.05} col={fg} />
      <div style={{ position: "absolute", left: M - 12, top: 420, fontFamily: TITLE, fontWeight: 900, fontSize: T.number, lineHeight: 1, letterSpacing: "-0.04em", color: fg }}>
        {(n.value * p).toFixed(n.decimals)}
        <span style={{ color: C.sand }}>{n.unit}</span>
      </div>
      <Title lines={["more scattering", "for blue than red"]} y={950} size={T.second + 8} at={0.6} col={fg} weight={500} />
      <Tag text="BLUE · 450 NM" x={M} y={1080} at={0.8} col={fg} fill={mix(C.sand, tn[1], 0.25)} />
      <Tag text="RED · 700 NM" x={M + 270} y={1080} at={0.85} col={fg} />
      <Svg>
        <Disc cx={760} cy={1370} r={190} col={tn[3]} at={0.5} id="nb-d" />
        <Figure x={760} y={1420} h={260} pose={POSES.reach} fg={fg} ground={tn[3]} at={0.7} id="nb-f" />
      </Svg>
      <Hud index={4} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="BLUE VS RED" col={fg} />
    </Card>
  );
};

const List: React.FC = () => {
  const hue = "navy";
  const tn = HUES[hue];
  const fg = fgOn(hue);
  const ys = [560, 900, 1240];
  const t = useSeconds();
  return (
    <Card bg={tn[1]}>
      <Pattern hue={hue} seed={11} />
      <Meta text="IN THREE STEPS" y={330} at={0.05} col={fg} />
      <Svg>
        {/* 1: the sun with short rays */}
        <Disc cx={180} cy={ys[0]} r={110} col={tn[0]} at={0.1} id="ls-d1" />
        <Disc cx={180} cy={ys[0]} r={52} col={HUES.sand[2]} at={0.2} id="ls-s" />
        {t > 0.35
          ? Array.from({ length: 8 }, (_, i) => {
              const a = (Math.PI * 2 * i) / 8;
              return <line key={i} x1={180 + Math.cos(a) * 66} y1={ys[0] + Math.sin(a) * 66} x2={180 + Math.cos(a) * 88} y2={ys[0] + Math.sin(a) * 88} stroke={HUES.sand[2]} strokeWidth={12} strokeLinecap="round" />;
            })
          : null}
        {/* 2: the molecule scattering */}
        <Disc cx={180} cy={ys[1]} r={110} col={tn[0]} at={0.45} id="ls-d2" />
        {t > 0.6 ? (
          <>
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const a = (deg * Math.PI) / 180;
              return <line key={deg} x1={180 + Math.cos(a) * 62} y1={ys[1] + Math.sin(a) * 62} x2={180 + Math.cos(a) * 90} y2={ys[1] + Math.sin(a) * 90} stroke={HUES.sky[3]} strokeWidth={12} strokeLinecap="round" />;
            })}
            <circle cx={160} cy={ys[1]} r={28} fill={fg} />
            <circle cx={200} cy={ys[1]} r={28} fill={fg} />
          </>
        ) : null}
        {/* 3: a figure looking up */}
        <Disc cx={180} cy={ys[2]} r={110} col={tn[0]} at={0.8} id="ls-d3" />
        <Figure x={175} y={ys[2] + 40} h={150} pose={POSES.lookUp} fg={fg} ground={tn[0]} at={0.9} id="ls-f" />
      </Svg>
      {SAMPLE.list.map((item, i) => {
        const ws = item.toUpperCase().split(" ");
        const two = ws.length > 2 ? [ws.slice(0, Math.ceil(ws.length / 2)).join(" "), ws.slice(Math.ceil(ws.length / 2)).join(" ")] : [ws.join(" ")];
        return (
          <React.Fragment key={i}>
            <Meta text={`0${i + 1}`} x={340} y={ys[i] - 70} at={0.15 + i * 0.35} col={mix(fg, tn[1], 0.25)} />
            <Title lines={two} x={340} y={ys[i] + 4} size={64} at={0.2 + i * 0.35} col={fg} />
          </React.Fragment>
        );
      })}
      <Hud index={5} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="STEPS" col={fg} />
    </Card>
  );
};

const End: React.FC = () => {
  const hue = "sand";
  const tn = HUES[hue];
  const fg = fgOn(hue);
  const t = useSeconds();
  const band = ease("panel", t - 0.5);
  const [b0, b1] = [1110, 1470];
  return (
    <Card bg={tn[1]}>
      <Pattern hue={hue} seed={13} spread={S.elements.pattern.chapter} />
      <Svg>
        <Disc cx={540} cy={760} r={300} col={tn[4]} at={0.1} id="en-d" />
        <Figure x={530} y={870} h={400} pose={POSES.lookUp} fg={fg} ground={tn[4]} at={0.3} id="en-f" />
      </Svg>
      {/* the chapter band: two rows, grown from the centre, hairlines above and below */}
      <div style={{ position: "absolute", left: 0, top: b0, width: W, height: b1 - b0, backgroundColor: C.cream, clipPath: `inset(0 ${(1 - band) * 50}% 0 ${(1 - band) * 50}%)` }} />
      <div style={{ position: "absolute", left: 0, top: b0 - 10, width: W * band, height: 2, backgroundColor: fg }} />
      <div style={{ position: "absolute", right: 0, top: b1 + 8, width: W * band, height: 2, backgroundColor: fg }} />
      <div style={{ position: "absolute", right: M - 10, top: b0 + 10, fontFamily: TITLE, fontWeight: 900, fontSize: 330, lineHeight: 1, color: "transparent", WebkitTextStroke: `3px ${mix(fg, C.cream, 0.8)}`, transform: `translateY(${(1 - ease("title", t - 0.7)) * 60}px)`, clipPath: "inset(0 0 0 0)" }}>06</div>
      <Title lines={[plain(SAMPLE.end.line)]} y={b0 + 175} size={fit(plain(SAMPLE.end.line), W - 2 * M, 120)} at={0.8} col={C.ink} />
      <Meta text={SAMPLE.end.cta.toUpperCase()} y={b0 + 280} at={1.0} col={C.ink} />
      <Hud index={6} total={TOTAL} topLeft={SAMPLE.kicker.toUpperCase()} bottomLeft="END" col={fg} />
    </Card>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.6, hero: 2.2, component: TitleCard },
  { id: "headline", duration: 2.6, hero: 2.2, component: Headline },
  { id: "diagram", duration: 2.8, hero: 2.4, component: Diagram },
  { id: "number", duration: 2.6, hero: 2.25, component: NumberSample },
  { id: "list", duration: 2.6, hero: 2.2, component: List },
  { id: "end", duration: 2.6, hero: 2.2, component: End },
];

