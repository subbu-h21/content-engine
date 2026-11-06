/** Paper Launch on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, fit, lerp, rgba, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Button, C, COLUMN, ease, Ground, Headline, Kicker, L, M, mono, S, SANS, SERIF, Secondary, T, Toggle, ui, W, Window } from "./parts";

const BEAT = S.motion.beat;
const WX = M;
const WW = COLUMN;

/** Plain words wrapped; the emphasised word(s) on their own line. */
const split = (lines: string[], max: number): string[] => {
  const all = lines.flatMap((l) => words(l));
  const plain = all.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = all.filter((w) => w.em).map((w) => w.text).join(" ");
  return [...wrap(plain, max), ...(em ? [`*${em}*`] : [])];
};

const Title: React.FC = () => {
  const lines = split([SAMPLE.title], 16);
  const size = fit(lines, COLUMN, T.display, T.charEm);
  return (
    <Ground>
      <Kicker text={SAMPLE.kicker} at={0} />
      <Headline lines={lines} size={size} y={390} at={BEAT * 0.5} underline />
      <Window x={WX} y={770} w={WW} h={700} at={BEAT * 2} padding={0}>
        <div style={{ position: "absolute", inset: "24px 24px 120px 24px", borderRadius: 12, overflow: "hidden", background: `linear-gradient(180deg, ${C.skyBlue} 0%, ${C.skyPale} 100%)` }}>
          <div style={{ position: "absolute", right: 110, top: 70, width: 120, height: 120, borderRadius: "50%", background: S.elements.sun, boxShadow: `0 0 80px 30px ${rgba(S.elements.sun, 0.55)}` }} />
        </div>
        <div style={{ position: "absolute", left: 32, right: 28, bottom: 18, height: 84, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={ui(C.ink, 700)}>Midday sky</span>
          <Button text="Why?" at={BEAT * 2 + 1.0} />
        </div>
      </Window>
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const lines = split(SAMPLE.headline, 16);
  const size = fit(lines, COLUMN, 104, T.charEm);
  const nm = S.elements.spectrum.nm;
  const swatch = S.elements.spectrum.hex;
  const sw = 96;
  const gap = (WW - 72 - nm.length * sw) / (nm.length - 1);
  const on = clamp((t - 2.3) / 0.25);
  const ring = ease("ui", t - 2.45);
  return (
    <Ground>
      <Kicker text={SAMPLE.chapter} at={0} />
      <Headline lines={lines} size={size} y={390} at={BEAT * 0.5} />
      <Window x={WX} y={850} w={WW} h={500} at={BEAT * 3}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <span style={ui(C.ink, 700)}>
            Sunlight <span style={ui(C.muted, 500)}>· nm</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
            <span style={ui(C.muted)}>All colours</span>
            <Toggle on={on} />
          </span>
        </div>
        <div style={{ position: "relative", display: "flex", gap }}>
          {nm.map((n, i) => {
            const p = ease("arrive", t - 1.9 - i * S.motion.stagger * 2);
            return (
              <div key={n} style={{ width: sw, textAlign: "center", opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 20}px)` }}>
                <div style={{ width: sw, height: 200, borderRadius: 12, background: swatch[i] }} />
                <div style={{ ...ui(C.muted, 500, T.uiSmall), marginTop: 18 }}>{n}</div>
              </div>
            );
          })}
          {ring > 0 ? <div style={{ position: "absolute", left: -12, top: -12, width: (WW - 72 + 24) * ring, height: 224, borderRadius: 18, border: `4px solid ${C.accent}`, boxSizing: "border-box", background: rgba(C.accent, 0.04) }} /> : null}
        </div>
      </Window>
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const head = ["Blue, in every", "*direction*"];
  const size = fit(head, COLUMN, 104, T.charEm);
  const wy = 720;
  const wh = 720;
  const [cx, cy] = [WW / 2, 330];
  const src = [70, 70];
  const inA = Math.atan2(cy - src[1], cx - src[0]);
  const beam = ease("ui", t - 1.6);
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10 + 0.3).filter((a) => Math.abs(Math.cos(a - (inA + Math.PI))) < 0.94);
  return (
    <Ground>
      <Kicker text="How it works" at={0} />
      <Headline lines={head} size={size} y={390} at={BEAT * 0.5} />
      <Window x={WX} y={wy} w={WW} h={wh} at={BEAT * 2.5} padding={0}>
        <svg width={WW} height={wh - L.window.bar} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={src[0]} y1={src[1]} x2={lerp(src[0], cx - Math.cos(inA) * 46, beam)} y2={lerp(src[1], cy - Math.sin(inA) * 46, beam)} stroke={C.ink} strokeWidth={5} strokeLinecap="round" opacity={beam > 0 ? 1 : 0} />
          {rays.map((a, i) => {
            const p = ease("arrive", t - 2.2 - i * S.motion.stagger * 2);
            if (p <= 0) return null;
            const r0 = 62;
            const r1 = r0 + 170 * p;
            return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={C.skyBlue} strokeWidth={8} strokeLinecap="round" />;
          })}
          <circle cx={cx} cy={cy} r={30} fill={C.ink} opacity={clamp((t - 1.5) / 0.2)} />
        </svg>
        <div style={{ ...ui(C.muted), position: "absolute", left: src[0] + 30, top: src[1] - 40 }}>{SAMPLE.diagram.in}</div>
        <div style={{ ...ui(C.muted), position: "absolute", left: 32, bottom: 30 }}>{SAMPLE.diagram.object}</div>
      </Window>
      <Window x={W - M - 470} y={wy + wh - 120} w={470} h={190} at={2.9} padding={30} z={5}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: "100%" }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: C.accent, flex: "none" }} />
          <span style={ui(C.ink, 700)}>{SAMPLE.diagram.label}</span>
        </div>
      </Window>
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("arrive", t - BEAT * 0.5);
  const inner = WW - 72;
  const row = (label: string, value: string, frac: number, c: string, at: number, selected: boolean) => {
    const g = ease("ui", t - at);
    return (
      <div style={{ position: "relative", padding: "22px 24px", marginBottom: 14, borderRadius: 14, background: selected && t > at + 0.4 ? C.accentSoft : "transparent", border: `3px solid ${selected && t > at + 0.4 ? C.accent : "transparent"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={ui(C.ink, 700)}>{label}</span>
          <span style={ui(C.ink, 500)}>{value}</span>
        </div>
        <div style={{ height: 18, borderRadius: 9, background: C.line }}>
          <div style={{ height: 18, borderRadius: 9, width: Math.max(18, (inner - 54) * frac * g), background: c, opacity: g > 0 ? 1 : 0 }} />
        </div>
      </div>
    );
  };
  return (
    <Ground>
      <Kicker text="By the numbers" at={0} />
      <div style={{ position: "absolute", left: M - 10, top: 380, fontFamily: SANS, fontWeight: 700, fontSize: T.number, lineHeight: 1, letterSpacing: `${T.tracking}em`, color: C.ink, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, whiteSpace: "nowrap" }}>
        {n.value.toFixed(n.decimals)}
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, letterSpacing: 0 }}>{n.unit}</span>
      </div>
      <Secondary text={n.caption} y={720} at={0.9} width={COLUMN * 0.8} />
      <Window x={WX} y={930} w={WW} h={480} at={1.4} padding={24}>
        {row("Blue · 450 nm", `${n.value.toFixed(n.decimals)}${n.unit}`, 1, C.skyBlue, 2.0, true)}
        {row("Red · 700 nm", `1${n.unit}`, 1 / n.value, C.lightRed, 2.1, false)}
      </Window>
    </Ground>
  );
};

/** The dark register (a use-case roll): three dark windows cascade in, the last one active. */
const List: React.FC = () => {
  const n = SAMPLE.list.length;
  return (
    <Ground dark>
      <Kicker text="In three steps" at={0} />
      {SAMPLE.list.map((item, i) => {
        const active = i === n - 1;
        const x = M + i * 36;
        const y = 470 + i * 300;
        return (
          <Window key={i} x={x} y={y} w={COLUMN - (n - 1) * 36} h={330} at={0.3 + i * BEAT * 0.75} padding={40} z={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: active ? C.accent : rgba(C.paper, 0.3) }} />
              <span style={mono(active ? C.paper : C.line)}>{`Step ${i + 1}`}</span>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 60, lineHeight: 1.05, letterSpacing: `${T.tracking}em`, color: C.paper, whiteSpace: "normal", width: COLUMN - 200, textWrap: "balance" } as React.CSSProperties}>{item}</div>
          </Window>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const lines = split([SAMPLE.end.line], 12);
  const size = fit(lines, COLUMN, 150, T.charEm);
  return (
    <Ground>
      <Headline lines={lines} size={size} y={560} at={0.1} underline />
      <Window x={WX} y={1000} w={WW} h={330} at={1.0} padding={40}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, height: "100%" }}>
          <span style={ui(C.muted)}>{SAMPLE.topic}</span>
          <span>
            <Button text={SAMPLE.end.cta} at={1.6} pop />
          </span>
        </div>
      </Window>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4, hero: 3.3, component: Title },
  { id: "headline", duration: 4, hero: 3.4, component: HeadlineSample },
  { id: "diagram", duration: 4.5, hero: 4.0, component: Diagram },
  { id: "number", duration: 4, hero: 3.2, component: NumberSample },
  { id: "list", duration: 3.5, hero: 3.0, component: List },
  { id: "end", duration: 3.5, hero: 2.9, component: End },
];
