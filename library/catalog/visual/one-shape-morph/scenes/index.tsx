/**
 * One-Shape Morph on the shared sample content. In a video this is one clip: the same shape morphs pill → card →
 * diagram → chart → lanes → session bar. Each sample is one state, entered from the state before it.
 */
import React from "react";
import { clamp, lerp, plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Badge, C, Cursor, ease, Ground, Icon, MONO, pulse, S, Shape, Skeleton, ST, Stage, toScreen, Vis } from "./parts";

const mixHex = (a: string, b: string, k: number): string => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(k)))).join(", ")})`;
};
const T = S.type;
const plainWords = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");
const emWords = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");

/** The pill: the shape pops in, the question blur-swaps in, the cursor presses it and the accent chip fills in. */
const Title: React.FC = () => {
  const cam = S.layout.cam.pill;
  const s = ST.pill;
  const press = 1.25;
  const [px, py] = toScreen(cam, s.w / 2 - 70, s.h / 2 - 20);
  return (
    <Ground>
      <Stage cam={cam}>
        <Vis at={0.45} dy={S.motion.rowShift} style={{ left: -s.w / 2, width: s.w, top: -s.h / 2 - 78, textAlign: "center", fontSize: T.body, color: C.muted }}>
          {SAMPLE.kicker} · {SAMPLE.chapter}
        </Vis>
        <Shape to={s} fill={C.ink} intro={0.02} press={press}>
          <Vis at={0.2} style={{ left: -s.w / 2, top: -s.h / 2, width: s.w, height: s.h, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <span style={{ fontSize: T.pill, fontWeight: 600, letterSpacing: `${T.tracking}em`, color: "#ffffff", whiteSpace: "nowrap" }}>{plainWords(SAMPLE.title)}</span>
            <Badge text={emWords(SAMPLE.title)} at={press + 0.05} size={40} pad={[4, 18]} />
          </Vis>
        </Shape>
      </Stage>
      <Cursor keys={[[0.5, 860, 1320], [press - 0.12, px, py], [2.6, px + 30, py + 60]]} press={press} />
    </Ground>
  );
};

/** The card: pill → card, rows land on words, the accent chip fills in, body copy grows as skeleton lines. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const cam = S.layout.cam.card;
  const s = ST.card;
  const L = -s.w / 2 + 48;
  const top = -s.h / 2 + 44;
  const fill = mixHex(C.ink, C.surface, ease("colour", t - 0.05));
  const [l1, l2] = SAMPLE.headline;
  return (
    <Ground>
      <Stage cam={cam}>
        <Shape from={ST.pill} to={s} fill={fill}>
          <Vis at={0.3} style={{ left: L, top, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="pencil" size={30} />
            <span style={{ fontSize: T.section, fontWeight: 600 }}>{SAMPLE.chapter}</span>
          </Vis>
          <Vis at={0.6} dy={S.motion.rowShift} style={{ left: L, top: top + 70, fontSize: T.display, fontWeight: 600, letterSpacing: "-0.025em", whiteSpace: "nowrap" }}>
            {plain(l1)}
          </Vis>
          <Vis at={0.6 + S.motion.rowGap} dy={S.motion.rowShift} style={{ left: L, top: top + 70 + T.display * T.leading, fontSize: T.display, fontWeight: 600, letterSpacing: "-0.025em", whiteSpace: "nowrap" }}>
            {plainWords(l2)} <Badge text={emWords(l2)} at={1.35} size={40} pad={[2, 16]} />
          </Vis>
          <Vis at={1.6} dy={S.motion.rowShift} style={{ left: L, top: top + 70 + 2 * T.display * T.leading + 26, width: s.w - 96, fontSize: T.body, lineHeight: 1.36, color: C.muted }}>
            {SAMPLE.body}
          </Vis>
          <Skeleton x={L} y={top + 70 + 2 * T.display * T.leading + 26 + 2 * T.body * 1.36 + 40} widths={[600, 520, 360]} at={1.9} />
        </Shape>
      </Stage>
    </Ground>
  );
};

/** The diagram: the cursor clicks the molecule disc, it flips to the accent and scatters in every direction. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const cam = S.layout.cam.card;
  const s = ST.diagram;
  const L = -s.w / 2 + 48;
  const top = -s.h / 2 + 44;
  const [dx, dy] = [70, 20];
  const click = 1.45;
  const flip = ease("colour", t - click);
  const pop = t > click && t < click + 0.35 ? 1 + 0.25 * Math.sin((Math.PI * (t - click)) / 0.35) : 1;
  const chip: [number, number] = [-250, -170];
  const arrow = clamp(ease("skeleton", t - 0.9));
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10 + 0.2);
  const [cx, cy] = toScreen(cam, dx + 18, dy + 22);
  return (
    <Ground>
      <Stage cam={cam}>
        <Shape from={ST.card} to={s}>
          <Vis at={0.3} style={{ left: L, top, width: s.w - 96, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="sun" size={32} />
            <span style={{ fontSize: T.cardTitle, fontWeight: 600, letterSpacing: `${T.tracking}em` }}>{SAMPLE.diagram.object}</span>
            <span style={{ flex: 1 }} />
            <Badge text={SAMPLE.diagram.label} at={click + 0.25} />
          </Vis>
          <div style={{ position: "absolute", left: -s.w / 2, top: top + 66, width: s.w * clamp(ease("skeleton", t - 0.4)), height: 1.5, backgroundColor: C.faint }} />
          <Vis at={0.6} dx={-18} style={{ left: chip[0] - 110, top: chip[1] - 30, display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", borderRadius: 999, backgroundColor: C.ink, color: "#ffffff", fontSize: T.body, whiteSpace: "nowrap" }}>
            <Icon name="sun" size={24} col="#ffffff" />
            {SAMPLE.diagram.in}
          </Vis>
          <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={chip[0] + 20} y1={chip[1] + 40} x2={lerp(chip[0] + 20, dx - 70, arrow)} y2={lerp(chip[1] + 40, dy - 50, arrow)} stroke={C.ink} strokeWidth={S.layout.iconStroke} strokeLinecap="round" />
            {rays.map((a, i) => {
              const p = ease("vis", t - click - 0.08 - i * 0.02);
              if (p <= 0) return null;
              return <line key={i} x1={dx + 70 * Math.cos(a)} y1={dy + 70 * Math.sin(a)} x2={dx + (70 + 110 * p) * Math.cos(a)} y2={dy + (70 + 110 * p) * Math.sin(a)} stroke={C.accent} strokeWidth={4.2} strokeLinecap="round" />;
            })}
            <circle cx={dx} cy={dy} r={48 * pop} fill={mixHex(C.ink, C.accent, flip)} opacity={clamp(ease("badge", t - 0.5))} />
          </svg>
          <Vis at={click + 0.45} dy={S.motion.rowShift} style={{ left: L, top: s.h / 2 - 150, width: s.w - 96 }}>
            <div style={{ height: 1.5, backgroundColor: C.faint, marginBottom: 30 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: T.section, fontWeight: 600, whiteSpace: "nowrap" }}>
              <Icon name="arrow" size={28} />
              <span style={{ color: C.muted, fontWeight: 400 }}>Out ·</span> {SAMPLE.diagram.out}
            </div>
          </Vis>
        </Shape>
      </Stage>
      <Cursor keys={[[0.7, 900, 1500], [click - 0.12, cx, cy], [3.0, cx + 20, cy + 30]]} press={click} />
    </Ground>
  );
};

/** The chart: a big number, its caption, relative bars rising on the bars spring; the first bar is the accent. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const cam = S.layout.cam.card;
  const s = ST.chart;
  const L = -s.w / 2 + 48;
  const top = -s.h / 2 + 44;
  const base = s.h / 2 - 120;
  const maxH = 330;
  const c = clamp((t - 0.55) / 0.9);
  const count = c * c * c * (c * (6 * c - 15) + 10);
  const bar = (i: number, frac: number, col: string, label: string) => {
    const g = ease("bars", t - 1.2 - i * S.motion.barStagger);
    const h = maxH * frac * clamp(g, 0, 1.02);
    const x = -230 + i * 280;
    return (
      <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: base - h, width: 180, height: h, backgroundColor: col, borderRadius: "12px 12px 6px 6px" }} />
        <Vis at={1.3 + i * 0.1} style={{ left: x - 30, width: 240, top: base + 22, textAlign: "center", fontSize: T.label, color: C.muted, whiteSpace: "nowrap" }}>
          {label}
        </Vis>
      </React.Fragment>
    );
  };
  return (
    <Ground>
      <Stage cam={cam}>
        <Shape from={ST.diagram} to={s}>
          <Vis at={0.3} style={{ left: L, top, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="list" size={30} />
            <span style={{ fontSize: T.section, fontWeight: 600 }}>Scattering</span>
          </Vis>
          <Vis at={0.45} dy={S.motion.rowShift} style={{ left: L - 6, top: top + 56, fontSize: T.chapterNumber, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>
            {(n.value * count).toFixed(n.decimals)}
            <span style={{ color: C.accent }}>{n.unit}</span>
          </Vis>
          <Vis at={0.8} dy={S.motion.rowShift} style={{ left: L, top: top + 236, width: s.w - 96, fontSize: T.body, lineHeight: 1.36, color: C.muted }}>
            {n.caption}
          </Vis>
          <div style={{ position: "absolute", left: L, top: base, width: s.w - 96, height: 1.5, backgroundColor: C.faint }} />
          {bar(0, 1, C.accent, "Blue · 450 nm")}
          {bar(1, 1 / n.value, C.ink, "Red · 700 nm")}
        </Shape>
      </Stage>
    </Ground>
  );
};

/** Progress lanes: each lane fills on its word, its mono status goes queued → NN% → done ✓, and its name pulses. */
const List: React.FC = () => {
  const t = useSeconds();
  const cam = S.layout.cam.card;
  const s = ST.lanes;
  const L = -s.w / 2 + 48;
  const top = -s.h / 2 + 44;
  const fillDur = 0.9;
  return (
    <Ground>
      <Stage cam={cam}>
        <Shape from={ST.chart} to={s}>
          <Vis at={0.3} style={{ left: L, top, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="list" size={30} />
            <span style={{ fontSize: T.section, fontWeight: 600 }}>Three steps</span>
          </Vis>
          {SAMPLE.list.map((item, i) => {
            const at = 0.5 + i * S.motion.rowGap;
            const run = clamp((t - at - 0.3) / fillDur);
            const p = run * run * run * (run * (6 * run - 15) + 10);
            const doneAt = at + 0.3 + fillDur;
            const status = t < at + 0.3 ? "queued" : p < 1 ? `${Math.round(p * 100)}%` : "done ✓";
            const y = top + 104 + i * 128;
            const flash = pulse(t, doneAt);
            return (
              <Vis key={i} at={at - 0.07} dy={S.motion.rowShift} style={{ left: L, top: y, width: s.w - 96 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: T.section, fontWeight: 600, color: mixHex(C.ink, C.accent, flash) }}>{item}</span>
                  <span style={{ fontFamily: MONO, fontSize: T.label, color: C.muted }}>{status}</span>
                </div>
                <div style={{ position: "relative", marginTop: 16, height: 14, borderRadius: 7, backgroundColor: C.faint }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 14, width: `${p * 100}%`, borderRadius: 7, backgroundColor: C.ink }} />
                </div>
              </Vis>
            );
          })}
        </Shape>
      </Stage>
    </Ground>
  );
};

/** The session bar: the shape becomes a black pill carrying the end line, an accent badge and the mono call to action. */
const End: React.FC = () => {
  const cam = 1.35;
  const s = ST.session;
  const line = SAMPLE.end.line;
  const [px, py] = toScreen(cam, s.w / 2 - 60, s.h / 2 + 40);
  return (
    <Ground>
      <Stage cam={cam}>
        <Shape from={ST.lanes} to={s} fill={C.ink}>
          <Vis at={0.35} style={{ left: -s.w / 2, top: -s.h / 2, width: s.w, height: s.h, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, whiteSpace: "nowrap" }}>
            <Icon name="sparkle" size={34} col={C.accent} />
            <span style={{ fontSize: T.pill, fontWeight: 600, letterSpacing: `${T.tracking}em`, color: "#ffffff" }}>{plainWords(line)}</span>
            <Badge text={emWords(line)} at={0.75} size={26} />
            <span style={{ fontFamily: MONO, fontSize: T.mono, color: C.muted2, marginLeft: 6 }}>+ {SAMPLE.end.cta.toLowerCase()}</span>
          </Vis>
        </Shape>
      </Stage>
      <Cursor keys={[[0.3, 600, 1400], [1.2, px, py]]} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.5, component: Title },
  { id: "headline", duration: 3.0, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.8, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.4, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.6, component: List },
  { id: "end", duration: 2.4, hero: 2.0, component: End },
];

