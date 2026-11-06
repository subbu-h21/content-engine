/** Editorial Neuro on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, expoOut, fit, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { Body, C, ease, Eyebrow, Ground, H, Headline, M, PillLabel, S, W } from "./parts";
import { BODY, DISPLAY } from "./fonts";

const TOP = S.layout.safe.top;
const COLUMN = W - 2 * M;
const chapter = (n: number, title: string) => `${String(n).padStart(2, "0")}  —  ${title}`;

const Title: React.FC = () => {
  const size = S.type.title;
  return (
    <Ground>
      <Eyebrow text={SAMPLE.kicker} y={TOP} at={0.2} rule />
      <Headline lines={wrap(SAMPLE.title, Math.floor(COLUMN / (size * 0.5)))} size={size} y={860} at={0.5} />
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const size = fit(SAMPLE.headline, COLUMN, S.type.display);
  const y = 560;
  return (
    <Ground>
      <Eyebrow text={chapter(1, SAMPLE.chapter)} y={TOP} at={0.1} rule />
      <Headline lines={SAMPLE.headline} size={size} y={y} at={0.3} />
      <Body text={SAMPLE.body} y={y + SAMPLE.headline.length * size * S.type.leading + 90} at={1.4} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [540, 980];
  const beam = expoOut((t - 0.3) / 0.7);
  const hit = clamp((t - 1.0) / 0.6);
  const sx = 150;
  const sy = 640;
  const rays = Array.from({ length: 9 }, (_, i) => (Math.PI * 2 * i) / 9 + 0.35);
  return (
    <Ground>
      <Eyebrow text={chapter(2, "How it works")} y={TOP} at={0.1} rule />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={sx} y1={sy} x2={sx + (cx - sx) * beam} y2={sy + (cy - sy) * beam} stroke={C.text} strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" />
        {hit > 0 ? (
          <line x1={cx} y1={cy} x2={cx + (cx - sx) * 0.75 * expoOut(hit)} y2={cy + (cy - sy) * 0.75 * expoOut(hit)} stroke={C.accent} strokeOpacity={0.9} strokeWidth={3} strokeLinecap="round" />
        ) : null}
        {rays.map((a, i) => {
          const p = expoOut((t - 1.0 - i * 0.04) / 0.6);
          if (p <= 0) return null;
          const r0 = 44;
          const r1 = r0 + 70 * p;
          return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={C.accent2} strokeWidth={3} strokeLinecap="round" opacity={p} />;
        })}
        <circle cx={cx} cy={cy} r={60} fill="none" stroke={C.text} strokeOpacity={0.18 * expoOut(t / 0.6)} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={22} fill={C.text} opacity={expoOut((t - 0.1) / 0.5)} />
      </svg>
      <div style={{ position: "absolute", left: sx - 4, top: sy - 64, fontFamily: BODY, fontSize: S.type.label, color: C.muted, opacity: expoOut((t - 0.4) / 0.5) }}>
        {SAMPLE.diagram.in}
      </div>
      <PillLabel text={SAMPLE.diagram.label} from={[cx, cy]} to={[700, 790]} at={1.5} accent={C.accent2} />
      <Body text={SAMPLE.body} y={1420} at={1.9} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.4);
  const size = S.type.number;
  const bar = (label: string, frac: number, col: string, y: number, at: number) => {
    const a = expoOut((t - at) / 0.5);
    return (
      <>
        <div style={{ position: "absolute", left: M, top: y - 44, fontFamily: BODY, fontSize: 26, letterSpacing: 0.5, color: C.text, opacity: a }}>{label}</div>
        <div style={{ position: "absolute", left: M, top: y, width: COLUMN, height: 6, backgroundColor: C.text, opacity: 0.12 * a }} />
        <div style={{ position: "absolute", left: M, top: y, width: COLUMN * frac * p, height: 6, backgroundColor: col, opacity: a }} />
      </>
    );
  };
  return (
    <Ground>
      <Eyebrow text={chapter(3, "By the numbers")} y={TOP} at={0.1} rule />
      <div style={{ position: "absolute", left: M, top: 820 - size * 0.8, fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color: C.text, opacity: expoOut((t - 0.2) / 0.4) }}>
        {(n.value * p).toFixed(n.decimals)}
        <span style={{ fontStyle: "italic" }}>{n.unit}</span>
      </div>
      <Body text={n.caption} y={960} at={0.9} width={COLUMN * 0.8} />
      {bar("Blue · 450 nm", 1, C.accent2, 1200, 1.1)}
      {bar("Red · 700 nm", 1 / n.value, C.accent, 1300, 1.2)}
    </Ground>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const size = fit(SAMPLE.list, COLUMN, 64);
  return (
    <Ground>
      <Eyebrow text={chapter(4, "In three steps")} y={TOP} at={0.1} rule />
      {SAMPLE.list.map((item, i) => {
        const at = 0.3 + i * 0.35;
        const y = 640 + i * 230;
        const r = ease("rule", t - at - 0.2);
        return (
          <React.Fragment key={i}>
            <Eyebrow text={String(i + 1).padStart(2, "0")} y={y - size - 6} at={at} />
            <Headline lines={[item]} size={size} y={y} at={at} />
            <div style={{ position: "absolute", left: M, top: y + 48, width: COLUMN * r, height: 1, backgroundColor: C.text, opacity: 0.16 }} />
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const size = fit([SAMPLE.end.line], COLUMN, S.type.title);
  return (
    <Ground>
      <Headline lines={[SAMPLE.end.line]} size={size} y={900} at={0.2} align="center" />
      <Eyebrow text={SAMPLE.end.cta} y={1080} at={0.9} align="center" rule />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.4, component: Title },
  { id: "headline", duration: 3, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.5, hero: 3.0, component: Diagram },
  { id: "number", duration: 3, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3, hero: 2.4, component: List },
  { id: "end", duration: 2.6, hero: 2.0, component: End },
];
