/** Clean Launch on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, fit, lerp, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Bar, C, COLUMN, Descriptor, ease, Ground, L, M, NowDot, S, Slam, Statement, T, ui, W, Window, SANS } from "./parts";

const BEAT = S.motion.beat;
/** The sample's words without the emphasis marks and without a final full stop (the now-dot takes its place). */
const bare = (s: string) => s.replace(/\*/g, "").replace(/\.$/, "");

/** Frame 0 is red: the now-dot irises down from covering the frame, the question slams in, "blue?" lands as the hero word. */
const Title: React.FC = () => {
  const ws = words(SAMPLE.title);
  const line1 = ws.filter((w) => !w.em).map((w) => w.text).join(" ");
  const hero = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const s1 = fit([line1], COLUMN, T.title, T.charEm);
  const y = 760;
  return (
    <Ground>
      <div style={{ position: "absolute", left: M + 4, top: y - 150 }}>
        <NowDot at={0} iris size={L.dot} inline={false} />
      </div>
      <Statement lines={[line1]} size={s1} y={y} at={BEAT} />
      <Statement lines={[hero]} size={T.hero} y={y + s1 * T.leading + 10} at={2 * BEAT} />
    </Ground>
  );
};

/** A descriptor, then the statement; "at once" ends on the now-dot; a window shows the whole range selected at once. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const desc = all.slice(0, 2).map((w) => w.text).join(" ");
  const lines = [all.slice(2, 4).map((w) => w.text).join(" "), bare(all.slice(4).map((w) => w.text).join(" "))];
  const size = fit(lines, COLUMN, T.display, T.charEm);
  const ww = Math.round(W * L.window.width);
  const inner = ww - 2 * L.window.pad;
  const open = ease("ui", t - 2.1);
  const lo = lerp(0.42, 0, open);
  const hi = lerp(0.58, 1, open);
  const ticks = [400, 500, 600, 700];
  return (
    <Ground>
      <Descriptor text={desc} y={470} at={BEAT * 0.5} />
      <Statement lines={lines} size={size} y={560} at={BEAT * 1.5} lineGap={BEAT} dot={{ at: BEAT * 2.5 + 0.43 }} />
      <Window y={1000} h={360} at={1.6}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 46 }}>
          <span style={ui()}>Sunlight</span>
          <span style={ui(C.mute)}>400–700 nm</span>
        </div>
        <div style={{ position: "relative", height: 40 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 16, height: 8, borderRadius: 4, background: C.line }} />
          <div style={{ position: "absolute", left: inner * lo, width: inner * (hi - lo), top: 16, height: 8, borderRadius: 4, background: C.ink }} />
          {[lo, hi].map((f, i) => (
            <div key={i} style={{ position: "absolute", left: inner * f - 20, top: 0, width: 40, height: 40, borderRadius: 20, background: C.paper, border: `3px solid ${C.ink}`, boxSizing: "border-box", boxShadow: "0 4px 12px rgba(0,0,0,.12)" }} />
          ))}
        </div>
        <div style={{ position: "relative", height: 40, marginTop: 30 }}>
          {ticks.map((n, i) => (
            <span key={n} style={{ ...ui(C.mute), position: "absolute", left: (inner * i) / (ticks.length - 1) - (i === 0 ? 0 : i === ticks.length - 1 ? 64 : 32) }}>
              {n}
            </span>
          ))}
        </div>
      </Window>
    </Ground>
  );
};

/** A window with the event: sunlight comes in, the now-dot is the molecule, short ink strokes leave in every direction. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const ww = Math.round(W * L.window.width);
  const wy = 330;
  const wh = 960;
  const [cx, cy] = [ww / 2, wh / 2 + 30];
  const src = [80, 150];
  const inA = Math.atan2(cy - src[1], cx - src[0]);
  const beam = ease("glide", t - 0.9);
  const rays = Array.from({ length: 12 }, (_, i) => (Math.PI * 2 * i) / 12 + 0.26).filter((a) => Math.abs(Math.cos(a - (inA + Math.PI))) < 0.94);
  const ds = 64;
  return (
    <Ground>
      <Window y={wy} h={wh} at={0.2}>
        <svg width={ww} height={wh} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={src[0]} y1={src[1]} x2={lerp(src[0], cx - Math.cos(inA) * (ds / 2 + 18), beam)} y2={lerp(src[1], cy - Math.sin(inA) * (ds / 2 + 18), beam)} stroke={C.ink} strokeWidth={S.elements.stroke} strokeLinecap="round" opacity={beam > 0 ? 1 : 0} />
          {rays.map((a, i) => {
            const p = ease("out", t - 1.75 - i * S.motion.batch);
            if (p <= 0) return null;
            const r0 = ds / 2 + 34;
            const r1 = r0 + 190 * p;
            return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={C.ink} strokeWidth={S.elements.stroke} strokeLinecap="round" />;
          })}
        </svg>
        <div style={{ position: "absolute", left: cx - ds / 2, top: cy - ds / 2 }}>
          <NowDot size={ds} at={1.6} inline={false} />
        </div>
        <div style={{ ...ui(C.ink), position: "absolute", left: src[0] - 4, top: src[1] - 70, opacity: clamp((t - 0.9) / 0.15) }}>{SAMPLE.diagram.in}</div>
        <div style={{ ...ui(C.mute), position: "absolute", left: 0, right: 0, textAlign: "center", top: wh - 110, opacity: clamp((t - 2.1) / 0.15) }}>{SAMPLE.diagram.object}</div>
      </Window>
      <Statement lines={[SAMPLE.diagram.label]} size={fit([SAMPLE.diagram.label], COLUMN, 104, T.charEm)} y={wy + wh + 70} at={2.5} />
    </Ground>
  );
};

/** The hero number with the now-dot as its decimal point; a descriptor; a window with the two bars. */
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const [int, dec] = n.value.toFixed(n.decimals).split(".");
  const ww = Math.round(W * L.window.width);
  const inner = ww - 2 * L.window.pad;
  const size = T.number;
  const row = (label: string, value: string, frac: number, at: number, dim: boolean) => (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={ui(dim ? C.mute : C.ink)}>{label}</span>
        <span style={ui(dim ? C.mute : C.ink, 600)}>{value}</span>
      </div>
      <Bar frac={frac} at={at} width={inner} c={dim ? C.mute : C.ink} />
    </div>
  );
  return (
    <Ground>
      <div style={{ position: "absolute", left: M, top: 470, display: "flex", alignItems: "baseline", fontFamily: SANS, fontWeight: 600, fontSize: size, lineHeight: 1, letterSpacing: `${T.heroTracking}em`, whiteSpace: "nowrap", color: C.ink }}>
        <Slam at={BEAT} red={false}>{int}</Slam>
        <NowDot size={Math.round(size * 0.15)} at={BEAT + 0.43} style={{ margin: `0 ${Math.round(size * 0.04)}px 0 ${Math.round(size * 0.05)}px` }} />
        <Slam at={BEAT + S.motion.batch * 2} red={false}>
          {dec}
          {n.unit}
        </Slam>
      </div>
      <Descriptor text={n.caption} y={900} at={1.2} width={COLUMN * 0.8} />
      <Window y={1090} h={330} at={1.6}>
        {row("Blue · 450 nm", `${n.value.toFixed(n.decimals)}${n.unit}`, 1, 2.0, false)}
        {row("Red · 700 nm", `1${n.unit}`, 1 / n.value, 2.1, true)}
      </Window>
    </Ground>
  );
};

/** One step at a time: a three-stop track (the now-dot on the current step), the last step as a descriptor, the current
 * one as the statement, and a window that shows it: strokes arriving at "you" from every side. */
const List: React.FC = () => {
  const t = useSeconds();
  const items = SAMPLE.list;
  const cur = items.length - 1;
  const gap = 132;
  const ty = 420;
  const move = ease("glide", t - 0.3);
  const dotX = M + lerp(cur - 1, cur, move) * gap;
  const ws = words(items[cur]).map((w) => w.text);
  const lines = [ws.slice(0, 3).join(" "), ws.slice(3).join(" ")];
  const size = fit(lines, COLUMN, T.display, T.charEm);
  const ww = Math.round(W * L.window.width);
  const wy = 960;
  const wh = 560;
  const [cx, cy] = [ww / 2, wh / 2 - 10];
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10);
  return (
    <Ground>
      <svg width={W} height={80} style={{ position: "absolute", left: 0, top: ty - 40 }}>
        <line x1={M} y1={40} x2={M + gap * cur} y2={40} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <line x1={M} y1={40} x2={dotX} y2={40} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        {items.map((_, i) => (i < cur ? <circle key={i} cx={M + i * gap} cy={40} r={11} fill={C.ink} /> : <circle key={i} cx={M + i * gap} cy={40} r={11} fill={C.paper} stroke={C.line} strokeWidth={4} />))}
      </svg>
      <div style={{ position: "absolute", left: dotX - L.dot / 2, top: ty - L.dot / 2 }}>
        <NowDot inline={false} at={0.05} />
      </div>
      <Descriptor text={items[cur - 1]} y={ty + 80} at={0.2} />
      <Statement lines={lines} size={size} y={ty + 170} at={0.75} lineGap={BEAT} />
      <Window y={wy} h={wh} at={1.3}>
        <svg width={ww} height={wh} style={{ position: "absolute", left: 0, top: 0 }}>
          {rays.map((a, i) => {
            const p = ease("out", t - 1.75 - i * S.motion.batch);
            if (p <= 0) return null;
            const r1 = 250;
            const r0 = lerp(r1, 86, p);
            return <line key={i} x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + r0 * Math.cos(a)} y2={cy + r0 * Math.sin(a)} stroke={C.ink} strokeWidth={S.elements.stroke} strokeLinecap="round" />;
          })}
          <circle cx={cx} cy={cy} r={18} fill={C.ink} />
        </svg>
        <div style={{ ...ui(C.mute), position: "absolute", left: cx - 60, width: 120, textAlign: "center", top: cy + 26 }}>You</div>
      </Window>
    </Ground>
  );
};

/** The end card: centred, the now-dot as the last full stop, a descriptor under it. */
const End: React.FC = () => {
  const ws = words(SAMPLE.end.line).map((w) => w.text);
  const lines = [ws.slice(0, 2).join(" "), bare(ws.slice(2).join(" "))];
  const size = fit(lines, COLUMN, T.display, T.charEm);
  return (
    <Ground>
      <Statement lines={lines} size={size} y={740} at={0.2} align="center" lineGap={BEAT} dot={{ at: 0.2 + BEAT + 0.43 }} />
      <Descriptor text={SAMPLE.end.cta} y={740 + 2 * size * T.leading + 50} at={1.4} align="center" />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.5, hero: 2.6, component: Title },
  { id: "headline", duration: 4, hero: 3.2, component: HeadlineSample },
  { id: "diagram", duration: 4, hero: 3.4, component: Diagram },
  { id: "number", duration: 3.5, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.5, hero: 2.9, component: List },
  { id: "end", duration: 3, hero: 2.4, component: End },
];
