/**
 * Black Glass Studio on the shared sample content, as a vertical composition of its own (bigger type, fewer panels):
 * the title card on top, the tool panel the hero presses below it; every press builds part of the card.
 */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { C, Diamond, ease, hop, Hero, onFace, onTop, S, ScreenHeader, Slab, Studio, TitleCard, ToolButton, UiText, type SlabPose } from "./parts";

const T = S.type;
const L = S.layout;
const TILT = L.floorTilt;
const INSET = L.slab.inset;
const split = (line: string) => {
  const ws = words(line);
  return { lead: ws.filter((w) => !w.em).map((w) => w.text).join(" "), em: ws.filter((w) => w.em).map((w) => w.text).join(" ") };
};
/** The screen's inner size for a slab. */
const inner = (s: SlabPose) => ({ w: s.w - 2 * INSET, h: s.h - 2 * INSET });

const Title: React.FC = () => {
  const t = useSeconds();
  const { lead, em } = split(SAMPLE.title);
  const comp: SlabPose = { x: 0, y: -330, w: 880, h: 600 };
  const tools: SlabPose = { x: 0, y: 360, z: 140, w: 820, h: 300, rx: TILT };
  const far: SlabPose = { x: 300, y: 700, z: -380, w: 640, h: 220, rx: TILT };
  const ti = inner(tools);
  const bw = (ti.w - 5 * 18) / 4;
  const h = hop(t - 0.4);
  const press = t > 0.9 ? 1 : 0;
  return (
    <Studio>
      <Slab {...far} blur={S.finish.focusBlur} power={0.6}>
        <ScreenHeader title="layers" />
      </Slab>
      <Slab {...comp} pop={Math.min(1.05, ease("pop", t))}>
        <ScreenHeader title="comp · 1080 × 1920" right={SAMPLE.kicker.toLowerCase()} />
        <TitleCard lines={[{ text: lead, size: 84 }, { text: em, size: T.title, key: true }]} top={170} width={inner(comp).w} build={ease("build", t - 0.95)} />
      </Slab>
      <Slab {...tools}>
        {(["type", "rect", "pen", "glow"] as const).map((ic, i) => (
          <ToolButton key={ic} icon={ic} label={["Type", "Rectangle", "Pen", "Glow"][i]} active={i === 0 && press > 0} w={bw} h={ti.h - 60} x={18 + i * (bw + 18)} y={30} />
        ))}
      </Slab>
      <Hero at={onFace(tools, -tools.w / 2 + INSET + 18 + bw / 2, -10)} lift={h.lift} squash={press ? 0.92 : h.squash} />
    </Studio>
  );
};

const HeadlineSample: React.FC = () => {
  // the timeline: layers named after the words, keyframes stamped, the hero riding the playhead
  const t = useSeconds();
  const [l1, l2] = SAMPLE.headline;
  const { lead, em } = split(l2);
  const comp: SlabPose = { x: 0, y: -400, w: 880, h: 560 };
  const tl: SlabPose = { x: 0, y: 380, z: 60, w: 860, h: 540, rx: TILT };
  const ti = inner(tl);
  const layers = [...words(l1).map((w) => w.text), lead, plain(em)];
  const lane0 = 260;
  const ride = Math.min(1, Math.max(0, (t - 0.6) / S.motion.recipes.ride.duration));
  const ph = lane0 + 40 + (ti.w - lane0 - 80) * (0.25 + 0.6 * ride);
  return (
    <Studio>
      <Slab {...comp}>
        <ScreenHeader title="comp · title card" />
        <TitleCard lines={[{ text: l1.replace(/\*/g, ""), size: 78 }, { text: lead, size: 78 }, { text: plain(em), size: 116, key: true }]} top={130} width={inner(comp).w} build={Math.min(1, 0.4 + ride)} rays={false} />
      </Slab>
      <Slab {...tl}>
        <ScreenHeader title="timeline" right={`00:00:0${Math.floor(1 + ride * 2)}:${String(Math.floor((ride * 60) % 30)).padStart(2, "0")}`} />
        {layers.map((name, i) => {
          const y = 96 + i * 98;
          return (
            <React.Fragment key={i}>
              <UiText text={name} x={24} y={y - 16} size={T.ui} col={i === layers.length - 1 ? C.hero : C.text} />
              <div style={{ position: "absolute", left: lane0, right: 24, top: y - 18, height: 36, borderRadius: 8, backgroundColor: i === layers.length - 1 ? `${C.hero}22` : `${C.light}14`, border: `1.5px solid ${C.faint}` }} />
              {[0.12, 0.38 + i * 0.06].map((k, j) => (
                <Diamond key={j} x={lane0 + (ti.w - lane0 - 24) * k} y={y} size={22} />
              ))}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: ph - 1.5, top: 60, width: 3, bottom: 20, backgroundColor: C.light, boxShadow: `0 0 14px ${C.light}` }} />
        <div style={{ position: "absolute", left: ph - 16, top: 56, width: 32, height: 26, borderRadius: 6, backgroundColor: C.light }} />
      </Slab>
      <Hero at={onFace(tl, ph - ti.w / 2, -tl.h / 2 + INSET + 70)} size={128} />
    </Studio>
  );
};

const Diagram: React.FC = () => {
  // a node canvas: the hero stands on the node that does the work; wires glow in screen light
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const { lead, em } = split(d.label.replace(/blue light/i, "*blue light*"));
  const comp: SlabPose = { x: 0, y: -560, w: 860, h: 300 };
  const canvas: SlabPose = { x: 0, y: 250, z: 0, w: 860, h: 900, rx: TILT - 6 };
  const ci = inner(canvas);
  const nodes = [
    { x: 30, y: 80, w: 440, h: 120, label: d.in, sub: "input" },
    { x: 150, y: 350, w: 520, h: 170, label: d.object, sub: "scatters", active: true },
    { x: 270, y: 660, w: 520, h: 120, label: d.out, sub: "output" },
  ];
  const wire = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => {
    const x0 = a.x + a.w / 2;
    const y0 = a.y + a.h;
    const x1 = b.x + b.w / 2;
    const y1 = b.y;
    return `M ${x0} ${y0} C ${x0} ${y0 + 90}, ${x1} ${y1 - 90}, ${x1} ${y1}`;
  };
  const glow = ease("build", t - 0.8);
  return (
    <Studio>
      <Slab {...comp}>
        <TitleCard lines={[{ text: lead, size: 64 }, { text: em, size: 96, key: true }]} top={40} width={inner(comp).w} build={glow} rays={false} />
      </Slab>
      <Slab {...canvas}>
        <ScreenHeader title="nodes" right="3 nodes · 2 wires" />
        <div style={{ position: "absolute", left: 0, top: 52, right: 0, bottom: 0, backgroundImage: `radial-gradient(${C.faint} 2px, transparent 2px)`, backgroundSize: "36px 36px" }} />
        <svg width={ci.w} height={ci.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={wire(nodes[0], nodes[1])} fill="none" stroke={C.light} strokeWidth={5} style={{ filter: `drop-shadow(0 0 8px ${C.light})` }} />
          <path d={wire(nodes[1], nodes[2])} fill="none" stroke={C.light} strokeWidth={5} strokeDasharray={`${1000 * glow} 2000`} style={{ filter: `drop-shadow(0 0 8px ${C.light})` }} />
        </svg>
        {nodes.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h, borderRadius: 18, backgroundColor: "#0f1c2b", border: `2.5px solid ${n.active ? C.light : C.faint}`, boxShadow: n.active ? `0 0 30px ${C.light}66` : undefined }}>
            <UiText text={n.sub} x={22} y={18} size={T.min} col={C.muted} mono />
            <UiText text={n.label} x={22} y={n.h - 58} size={T.ui + 4} weight={600} />
            {n.active ? (
              <svg width={120} height={120} style={{ position: "absolute", right: 20, top: n.h / 2 - 60 }}>
                {Array.from({ length: 8 }, (_, k) => {
                  const a = (k / 8) * Math.PI * 2;
                  return <line key={k} x1={60 + Math.cos(a) * 30} y1={60 + Math.sin(a) * 30} x2={60 + Math.cos(a) * (30 + 22 * glow)} y2={60 + Math.sin(a) * (30 + 22 * glow)} stroke={C.hero} strokeWidth={5} strokeLinecap="round" />;
                })}
                <circle cx={60} cy={60} r={20} fill={C.hero} style={{ filter: `drop-shadow(0 0 10px ${C.hero})` }} />
              </svg>
            ) : null}
          </div>
        ))}
      </Slab>
      <Hero at={onFace(canvas, nodes[1].x + 330 - ci.w / 2, nodes[1].y + 40 - ci.h / 2)} size={128} />
    </Studio>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const comp: SlabPose = { x: 0, y: -380, w: 880, h: 620 };
  const meters: SlabPose = { x: 0, y: 380, z: 110, w: 880, h: 400, rx: TILT };
  const mi = inner(meters);
  const p = ease("build", t - 0.5);
  const bar = (label: string, frac: number, value: string, y: number, col: string) => (
    <>
      <UiText text={label} x={30} y={y - 52} />
      <UiText text={value} x={mi.w - 30 - 200} y={y - 52} width={200} align="right" mono col={col} />
      <div style={{ position: "absolute", left: 30, right: 30, top: y, height: 34, borderRadius: 10, backgroundColor: C.faint }} />
      <div style={{ position: "absolute", left: 30, top: y, width: (mi.w - 60) * frac * p, height: 34, borderRadius: 10, backgroundColor: col, boxShadow: col === C.light ? `0 0 22px ${C.light}` : undefined }} />
    </>
  );
  return (
    <Studio>
      <Slab {...comp}>
        <ScreenHeader title="comp · readout" />
        <TitleCard lines={[{ text: `${(n.value * p).toFixed(n.decimals)}${n.unit}`, size: T.number, key: true }]} top={150} width={inner(comp).w} build={1} />
        <UiText text={n.caption} x={0} y={500} width={inner(comp).w} align="center" col={C.muted} size={T.ui} />
      </Slab>
      <Slab {...meters}>
        <ScreenHeader title="levels" />
        {bar("Blue · 450 nm", 1, n.value.toFixed(1), 160, C.light)}
        {bar("Red · 700 nm", 1 / n.value, "1.0", 290, C.muted)}
      </Slab>
      <Hero at={onFace(meters, -60, -meters.h / 2 + INSET + 140)} size={120} squash={0.94} />
    </Studio>
  );
};

const List: React.FC = () => {
  // three glass steps; each item ticks when the hero lands on it
  const t = useSeconds();
  const comp: SlabPose = { x: 0, y: -610, w: 760, h: 220 };
  const steps: SlabPose[] = [
    { x: -60, y: 560, z: 120, w: 800, h: 200, rx: TILT },
    { x: 0, y: 280, z: 0, w: 800, h: 200, rx: TILT },
    { x: 60, y: 0, z: -120, w: 800, h: 200, rx: TILT },
  ];
  const landed = steps.map((_, i) => t >= 0.4 + i * 0.5);
  const h = hop(t - 1.4);
  return (
    <Studio>
      <Slab {...comp}>
        <TitleCard lines={[{ text: "In three steps", size: 72, key: true }]} top={50} width={inner(comp).w} rays={false} />
      </Slab>
      {[...steps].reverse().map((s, ri) => {
        const i = steps.length - 1 - ri;
        const si = inner(s);
        return (
          <Slab key={i} {...s} blur={i === 0 ? 2 : 0}>
            <div style={{ position: "absolute", left: 26, top: si.h / 2 - 26, width: 52, height: 52, borderRadius: 12, border: `3px solid ${landed[i] ? C.light : C.faint}`, boxShadow: landed[i] ? `0 0 18px ${C.light}` : undefined }}>
              {landed[i] ? (
                <svg width={46} height={46} style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d="M 10 24 L 20 34 L 37 13" fill="none" stroke={C.light} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>
            <UiText text={`${i + 1}`} x={100} y={si.h / 2 - 20} mono col={C.muted} />
            <UiText text={SAMPLE.list[i]} x={140} y={si.h / 2 - 21} size={T.ui + 4} weight={600} col={landed[i] ? C.text : C.muted} />
          </Slab>
        );
      })}
      <Hero at={onFace(steps[2], steps[2].w / 2 - 80, -10)} size={118} lift={h.lift} squash={h.squash} />
    </Studio>
  );
};

const End: React.FC = () => {
  // power down: every panel falls away; only the finished card is left, the hero on top of it
  const t = useSeconds();
  const { lead, em } = split(SAMPLE.end.line);
  const comp: SlabPose = { x: 0, y: -100, w: 880, h: 660 };
  const fallT = Math.max(0, t - 1.0);
  const fall = (k: number) => 0.5 * S.motion.recipes.fall.gravity * Math.pow(fallT * k, 2);
  const off = 1 - ease("powerDown", t - 0.7);
  return (
    <Studio>
      <Slab x={-190} y={520 + fall(1)} z={-60} w={600} h={250} rx={TILT + 10 + fallT * 30} rz={-14 - fallT * S.motion.recipes.fall.spin} power={off} blur={3}>
        <ScreenHeader title="timeline" />
      </Slab>
      <Slab x={230} y={760 + fall(1.2)} z={80} w={520} h={210} rx={TILT + fallT * 40} rz={20 + fallT * S.motion.recipes.fall.spin} power={off} blur={4}>
        <ScreenHeader title="tools" />
      </Slab>
      <Slab {...comp}>
        <ScreenHeader title="comp · final" right="done" />
        <TitleCard lines={[{ text: lead, size: 104 }, { text: em, size: T.title, key: true }]} top={150} width={inner(comp).w} />
        <div style={{ position: "absolute", left: inner(comp).w / 2 - 190, top: 500, width: 380, height: 64, borderRadius: 999, border: `2px solid ${C.light}`, boxShadow: `0 0 20px ${C.light}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <UiText text={SAMPLE.end.cta} x={0} y={14} width={380} align="center" weight={600} col={C.light} />
        </div>
      </Slab>
      <Hero at={onTop(comp, 250)} size={124} />
    </Studio>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.6, hero: 2.1, component: Title },
  { id: "headline", duration: 3, hero: 2.4, component: HeadlineSample },
  { id: "diagram", duration: 2.6, hero: 2.1, component: Diagram },
  { id: "number", duration: 2.6, hero: 2.1, component: NumberSample },
  { id: "list", duration: 2.8, hero: 2.2, component: List },
  { id: "end", duration: 2.4, hero: 1.4, component: End },
];
