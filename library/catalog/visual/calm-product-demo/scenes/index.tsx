/** Calm Product Demo on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, lerp, SAMPLE, useSeconds, type Sample } from "../../kit";
import { C, Card, Cursor, ease, Ground, Highlight, Kicker, M, PushLine, S, Tick, W } from "./parts";

const COL = S.layout.cardWidth;
const X0 = (W - COL) / 2;

const Title: React.FC = () => (
  <Ground silk>
    <Kicker text={SAMPLE.kicker} y={820} at={0.1} />
    <PushLine lines={[SAMPLE.title]} y={960} at={0.5} />
  </Ground>
);

const HeadlineSample: React.FC = () => (
  <Ground>
    <PushLine lines={SAMPLE.headline} y={960} at={0.2} />
  </Ground>
);

/** The diagram as a rebuilt UI card: the cursor clicks the molecule, it scatters blue, a popover explains. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const top = 560;
  const h = 860;
  const [cx, cy] = [540, top + 470];
  const beam = ease("push", (t - 0.5) * 1.4);
  const sx = X0 + 70;
  const sy = cy - 190;
  // rays in every direction except straight back up the incoming beam
  const back = Math.atan2(sy - cy, sx - cx);
  const rays = Array.from({ length: 10 }, (_, i) => back + (Math.PI * 2 * (i + 0.5)) / 10);
  const click = 1.5;
  const pop = ease("dissolve", t - 1.95);
  return (
    <Ground>
      <Card x={X0} y={top} w={COL} h={h} at={0.05}>
        <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.accent }} />
          <div style={{ fontSize: S.type.body, fontWeight: 500, color: C.text }}>{SAMPLE.diagram.object}</div>
        </div>
        <div style={{ position: "absolute", right: 40, top: 40, fontSize: S.type.label, color: C.muted }}>Diagram</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, height: 1, backgroundColor: C.faint }} />
      </Card>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={sx} y1={sy} x2={lerp(sx, cx, beam)} y2={lerp(sy, cy, beam)} stroke={C.text} strokeOpacity={0.75} strokeWidth={3} strokeLinecap="round" />
        {rays.map((a, i) => {
          const p = ease("push", (t - click - 0.05 - i * 0.03) * 1.6);
          if (p <= 0) return null;
          const r0 = 52;
          const r1 = r0 + 120 * p;
          return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={C.accent} strokeWidth={4} strokeLinecap="round" opacity={p} />;
        })}
        <circle cx={cx} cy={cy} r={40} fill={C.surface} stroke={C.faint} strokeWidth={2} opacity={ease("dissolve", t - 0.3)} />
        <circle cx={cx} cy={cy} r={22} fill={C.text} opacity={ease("dissolve", t - 0.35)} />
      </svg>
      <div style={{ position: "absolute", left: sx - 6, top: sy - 62, fontSize: S.type.label, color: C.muted, opacity: ease("word", t - 0.55) }}>{SAMPLE.diagram.in}</div>
      {pop > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 560,
            top: cy + 215,
            padding: "22px 28px",
            borderRadius: 20,
            backgroundColor: C.surface,
            border: `1px solid ${C.faint}`,
            boxShadow: S.finish.shadow,
            opacity: pop,
            transform: `translateY(${(1 - pop) * 10}px)`,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontSize: S.type.body, fontWeight: 500, color: C.text }}>{SAMPLE.diagram.label}</div>
          <div style={{ fontSize: S.type.label, color: C.muted, marginTop: 8 }}>{SAMPLE.diagram.out}</div>
        </div>
      ) : null}
      <Cursor keys={[[0.6, 900, 1500], [1.35, cx + 22, cy + 24], [2.4, cx + 30, cy + 34]]} click={click} />
    </Ground>
  );
};

/** The proof: the number counts up with its highlight, then relative bars in a card. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.3);
  const size = S.type.number;
  const hl = ease("highlight", t - 1.5);
  const bar = (label: string, frac: number, col: string, y: number, at: number) => {
    const a = ease("dissolve", t - at);
    const f = ease("count", t - at);
    return (
      <>
        <div style={{ position: "absolute", left: 40, top: y - 52, fontSize: S.type.label, color: C.text, opacity: a }}>{label}</div>
        <div style={{ position: "absolute", left: 40, top: y, width: COL - 80, height: 14, borderRadius: 7, backgroundColor: C.faint, opacity: a }} />
        <div style={{ position: "absolute", left: 40, top: y, width: (COL - 80) * frac * f, height: 14, borderRadius: 7, backgroundColor: col, opacity: a }} />
      </>
    );
  };
  return (
    <Ground>
      <div style={{ position: "absolute", left: 0, width: W, top: 560, textAlign: "center", fontSize: size, lineHeight: 1, letterSpacing: "-0.04em", color: C.text, opacity: ease("word", t - 0.2) }}>
        <Highlight p={hl}>
          {(n.value * p).toFixed(n.decimals)}
          {n.unit}
        </Highlight>
      </div>
      <div style={{ position: "absolute", left: M + 60, width: W - 2 * M - 120, top: 830, textAlign: "center", fontSize: S.type.body, lineHeight: 1.35, color: C.muted, opacity: ease("word", t - 0.8) }}>{n.caption}</div>
      <Card x={X0} y={1040} w={COL} h={330} at={1.0}>
        {bar("Blue · 450 nm", 1, C.accent, 120, 1.2)}
        {bar("Red · 700 nm", 1 / n.value, C.muted, 250, 1.35)}
      </Card>
    </Ground>
  );
};

/** The agent-style checklist: each step spins, then ticks; a pause after each result. */
const List: React.FC = () => {
  const t = useSeconds();
  const top = 640;
  const rowH = 150;
  const done = (i: number) => 0.9 + i * (0.25 + S.motion.resultPause);
  const count = SAMPLE.list.filter((_, i) => t >= done(i)).length;
  return (
    <Ground>
      <Card x={X0} y={top} w={COL} h={140 + rowH * SAMPLE.list.length + 20} at={0.05}>
        <div style={{ position: "absolute", left: 44, top: 44, fontSize: S.type.label, color: C.muted }}>{SAMPLE.chapter}</div>
        <div style={{ position: "absolute", right: 44, top: 44, fontSize: S.type.label, color: C.muted }}>
          {count} of {SAMPLE.list.length}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, height: 1, backgroundColor: C.faint }} />
      </Card>
      {SAMPLE.list.map((item, i) => {
        const at = 0.3 + i * 0.35;
        const y = top + 140 + rowH * i + rowH / 2;
        const a = ease("word", t - at);
        return (
          <React.Fragment key={i}>
            <Tick x={X0 + 44} y={y} at={at} done={done(i)} />
            <div style={{ position: "absolute", left: X0 + 112, top: y - S.type.body * 0.68, fontSize: S.type.body + 2, color: C.text, opacity: a, whiteSpace: "nowrap" }}>{item}</div>
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const b = ease("dissolve", t - 1.3);
  const hover = clamp((t - 2.0) / 0.2);
  return (
    <Ground silk>
      <PushLine lines={[SAMPLE.end.line]} y={880} at={0.1} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: 1040,
          display: "flex",
          justifyContent: "center",
          opacity: b,
          transform: `translateY(${(1 - b) * 10}px)`,
        }}
      >
        <div style={{ padding: "24px 44px", borderRadius: 999, backgroundColor: C.accent, color: "#ffffff", fontSize: S.type.body, fontWeight: 500, filter: `brightness(${lerp(1, 0.93, hover)})` }}>
          {SAMPLE.end.cta}
        </div>
      </div>
      <Cursor keys={[[1.2, 860, 1440], [1.95, 668, 1104]]} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 3.2, hero: 2.8, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.1, component: Diagram },
  { id: "number", duration: 3.4, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.4, hero: 3.0, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
