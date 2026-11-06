/** Navy & Gold Precision on the shared sample content: one idea per shot, gold only where it matters. */
import React from "react";
import { clamp, fit, lerp, plain, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { C, ease, goldFill, Ground, Headline, M, Mark, MONO, Mono, S, Surface, W } from "./parts";

const COL = W - 2 * M;
const CH = S.type.charEm;

/** A gold glint reveals the mark; the question resolves under it. */
const Title: React.FC = () => {
  const lines = wrap(SAMPLE.title, 14);
  const size = fit(lines, COL, 112, CH);
  return (
    <Ground glow={[540, 700]}>
      <Mark x={540} y={700} at={0.1} />
      <Headline lines={lines} size={size} y={1000} at={0.9} align="center" />
      <Mono text={SAMPLE.kicker} y={1000 + lines.length * size * S.type.leading + 40} at={1.6} align="center" />
    </Ground>
  );
};

/** The line, then the idea as a dimensional surface: the body as a quiet note with one gold active pill. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const size = fit(SAMPLE.headline, COL, S.type.display, CH);
  const rule = ease("draw", t - 1.5);
  return (
    <Ground>
      <Headline lines={SAMPLE.headline} size={size} y={620} at={0.15} />
      <Surface x={M} y={910} w={COL} h={430} at={0.7}>
        <div style={{ position: "absolute", left: 48, top: 46, fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.muted, textTransform: "uppercase" }}>{SAMPLE.chapter}</div>
        <div style={{ position: "absolute", right: 44, top: 36, padding: "10px 22px", borderRadius: 999, backgroundColor: C.gold, color: C.bg, fontSize: S.type.label, fontWeight: 600 }}>{SAMPLE.diagram.in}</div>
        <div style={{ position: "absolute", left: 48, right: 48, top: 130, fontSize: S.type.body + 10, lineHeight: 1.35, letterSpacing: "-0.01em", color: C.text }}>{SAMPLE.body}</div>
        <div style={{ position: "absolute", left: 48, top: 340, width: (COL - 96) * rule, height: 1.5, backgroundColor: C.faint }} />
      </Surface>
    </Ground>
  );
};

/** The diagram on a tilted surface: gold light in, steel blue out in every direction, one gold label. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const w = COL;
  const [nx, ny] = [w / 2 + 20, 400];
  const beam = ease("draw", t - 0.7);
  const [sx, sy] = [70, 150];
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10 + 0.15);
  return (
    <Ground>
      <Headline lines={[SAMPLE.diagram.object]} size={84} y={420} at={0.1} />
      <Surface x={M} y={560} w={w} h={820} at={0.3}>
        <svg width={w} height={820} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={sx} y1={sy} x2={lerp(sx, nx, beam)} y2={lerp(sy, ny, beam)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          {rays.map((a, i) => {
            const p = ease("premium", t - 1.5 - i * S.motion.stagger * 0.5);
            if (p <= 0) return null;
            return <line key={i} x1={nx + 84 * Math.cos(a)} y1={ny + 84 * Math.sin(a)} x2={nx + (84 + 130 * p) * Math.cos(a)} y2={ny + (84 + 130 * p) * Math.sin(a)} stroke={C.steel} strokeWidth={4.5} strokeLinecap="round" opacity={p} />;
          })}
          <circle cx={nx} cy={ny} r={58} fill={C.surface3} stroke={C.warm} strokeOpacity={0.9} strokeWidth={2.5} opacity={ease("premium", t - 0.5)} />
          <circle cx={nx} cy={ny} r={58} fill="none" stroke={C.gold} strokeWidth={2.5} strokeDasharray={`${364 * clamp(ease("draw", t - 1.3))} 400`} transform={`rotate(-90 ${nx} ${ny})`} />
        </svg>
        <div style={{ position: "absolute", left: sx - 4, top: sy - 64, fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.gold, opacity: ease("premium", t - 0.8) }}>
          {SAMPLE.diagram.in.toUpperCase()}
        </div>
        <div
          style={{
            position: "absolute",
            left: nx + 70,
            top: ny - 250,
            padding: "12px 24px",
            borderRadius: 999,
            backgroundColor: C.surface3,
            border: `1.5px solid ${C.faint}`,
            color: C.warm,
            fontSize: S.type.label,
            fontWeight: 500,
            whiteSpace: "nowrap",
            opacity: ease("premium", t - 2.0),
            transform: `translateY(${(1 - ease("premium", t - 2.0)) * 14}px)`,
          }}
        >
          {SAMPLE.diagram.label}
        </div>
        <div style={{ position: "absolute", left: 48, right: 48, top: 690, height: 1.5, backgroundColor: C.faint }} />
        <div style={{ position: "absolute", left: 48, top: 730, display: "flex", gap: 22, alignItems: "baseline", opacity: ease("premium", t - 2.2), whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.muted }}>OUT</span>
          <span style={{ fontSize: S.type.body + 2, color: C.text }}>{SAMPLE.diagram.out}</span>
        </div>
      </Surface>
    </Ground>
  );
};

/** The cockpit number: mono, counted up, the unit in gold; two quiet bars below. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.6);
  const bar = (label: string, frac: number, col: string, y: number, at: number) => {
    const d = ease("draw", t - at);
    return (
      <>
        <div style={{ position: "absolute", left: 48, top: y - 44, fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.muted }}>{label}</div>
        <div style={{ position: "absolute", left: 48, top: y, width: COL - 96, height: 8, borderRadius: 4, backgroundColor: C.surface3 }} />
        <div style={{ position: "absolute", left: 48, top: y, width: (COL - 96) * frac * d, height: 8, borderRadius: 4, backgroundColor: col }} />
      </>
    );
  };
  return (
    <Ground glow={[540, 820]}>
      <Surface x={M} y={520} w={COL} h={820} at={0.15}>
        <div style={{ position: "absolute", left: 48, top: 46, fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.muted }}>SCATTERING · 450 NM VS 700 NM</div>
        <div style={{ position: "absolute", left: 40, top: 110, fontFamily: MONO, fontWeight: 600, fontSize: S.type.number, lineHeight: 1, letterSpacing: "-0.07em", color: C.warm }}>
          {(n.value * p).toFixed(n.decimals)}
          <span style={goldFill(ease("glint", t - 1.6))}>{n.unit}</span>
        </div>
        <div style={{ position: "absolute", left: 48, width: COL - 160, top: 380, fontSize: S.type.body, lineHeight: 1.4, color: C.muted, opacity: ease("premium", t - 1.0) }}>{n.caption}</div>
        {bar("BLUE · 450 NM", 1, C.gold, 600, 1.3)}
        {bar("RED · 700 NM", 1 / n.value, C.steel, 740, 1.42)}
      </Surface>
    </Ground>
  );
};

/** Three rows that resolve one after another, each with a gold check. */
const List: React.FC = () => {
  const t = useSeconds();
  const rowH = 160;
  return (
    <Ground>
      <Surface x={M} y={640} w={COL} h={140 + rowH * 3 + 30} at={0.1}>
        <div style={{ position: "absolute", left: 48, top: 50, fontFamily: MONO, fontSize: S.type.mono, letterSpacing: `${S.type.monoTracking}em`, color: C.muted }}>{SAMPLE.chapter.toUpperCase()}</div>
        {SAMPLE.list.map((item, i) => {
          const at = 0.6 + i * 0.32;
          const p = ease("premium", t - at);
          const c = ease("settle", t - at - 0.45);
          const y = 130 + i * rowH;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 48, right: 48, top: y, height: 1.5, backgroundColor: C.faint }} />
              <div style={{ position: "absolute", left: 48, top: y + 56, fontFamily: MONO, fontSize: S.type.mono, color: C.muted, opacity: p }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ position: "absolute", left: 120, top: y + 48, fontSize: S.type.body + 4, color: C.text, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, whiteSpace: "nowrap" }}>{item}</div>
              <svg width={48} height={48} viewBox="0 0 48 48" style={{ position: "absolute", right: 48, top: y + 52, transform: `scale(${clamp(c, 0, 1.02)})` }}>
                <circle cx={24} cy={24} r={22} fill="none" stroke={C.gold} strokeWidth={2.5} />
                <path d="M15 24.5 L21.5 31 L33 18" fill="none" stroke={C.gold} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </React.Fragment>
          );
        })}
      </Surface>
    </Ground>
  );
};

/** Darkness returns; the gold wordmark resolves with one short line under it. */
const End: React.FC = () => {
  const t = useSeconds();
  const line = plain(SAMPLE.end.line);
  const size = fit([line], COL, S.type.wordmark, CH);
  const p = ease("premium", t - 0.5);
  return (
    <Ground glow={[540, 980]}>
      <Mark x={540} y={760} size={120} at={0.1} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: 1010 - size * 0.8,
          textAlign: "center",
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1.1,
          opacity: p,
          transform: `translateY(${(1 - p) * S.motion.rise}px)`,
          ...goldFill(ease("glint", t - 1.1)),
        }}
      >
        {line}
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: 1090, textAlign: "center", fontSize: S.type.body, color: C.muted, opacity: ease("premium", t - 1.2) }}>{SAMPLE.end.cta}</div>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.8, component: Title },
  { id: "headline", duration: 3.2, hero: 2.8, component: HeadlineSample },
  { id: "diagram", duration: 3.4, hero: 3.0, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.7, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];
