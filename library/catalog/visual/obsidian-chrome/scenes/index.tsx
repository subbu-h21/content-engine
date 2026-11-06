/** Obsidian Chrome on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { clamp, fit, lerp, rgba, SAMPLE, useSeconds, type Sample } from "../../kit";
import {
  ArcLine,
  Atmosphere,
  breakLines,
  C,
  Card,
  COLUMN,
  DISPLAY,
  E,
  ease,
  Ground,
  Guide,
  M,
  METAL,
  Micro,
  MONO,
  Orbit,
  Pill,
  pillHeight,
  S,
  silverText,
  Spark,
  splitEm,
  Sub,
  Svg,
  T,
  Tile,
  W,
  BODY,
} from "./parts";

const GUIDE = S.layout.guideY;
const PILL_RATIO = T.pill / T.display;
const GAP = 30;

/** Kinetic Headline, re-stacked for vertical: plain lines arc in from alternate sides, the emphasis pill sits on the guide. */
const Kinetic: React.FC<{ lines: string[]; guide: number; at: number; glintAt?: number; maxChars?: number }> = ({ lines, guide, at, glintAt, maxChars = 8 }) => {
  const { plain, em } = splitEm(lines);
  const rows = breakLines(plain, maxChars);
  const size = fit(rows, COLUMN, T.display, T.charEm);
  const pSize = Math.round(size * PILL_RATIO);
  const ph = pillHeight(pSize);
  const lineH = size * T.leading;
  const top0 = guide - ph / 2 - GAP - rows.length * lineH;
  const pillAt = at + 0.12 * rows.length + 0.2;
  const mid = (top0 + guide + ph / 2) / 2;
  return (
    <>
      <Atmosphere y={mid} at={at - 0.25} />
      <Orbit y={mid} at={at - 0.15} />
      <Guide y={guide} at={at - 0.1} />
      {rows.map((r, i) => (
        <ArcLine key={i} text={r} size={size} top={top0 + i * lineH} at={at + i * 0.12} dir={i % 2 === 0 ? -1 : 1} />
      ))}
      {em ? <Pill text={em} size={pSize} y={guide} at={pillAt} enter="squash" rim glintAt={glintAt} /> : null}
      {glintAt !== undefined ? <Spark cx={W / 2} y={guide} at={glintAt} /> : null}
    </>
  );
};

const Title: React.FC = () => (
  <Ground>
    <Micro text={SAMPLE.kicker} y={600} at={1.1} />
    <Kinetic lines={[SAMPLE.title]} guide={GUIDE} at={0.3} glintAt={1.95} />
  </Ground>
);

/** Slide-In Showcase: a metallic divider draws, then masked lines rise, then the emphasis pill. Left-aligned. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const { plain, em } = splitEm(SAMPLE.headline);
  const rows = breakLines(plain, 12);
  const size = fit(rows, COLUMN, T.display, T.charEm);
  const lineH = size * T.leading;
  const top0 = 600;
  const d = ease("divider", t - 0.1);
  const pSize = Math.round(size * PILL_RATIO);
  const pillY = top0 + rows.length * lineH + GAP + pillHeight(pSize) / 2;
  return (
    <Ground>
      <Atmosphere y={top0 + 200} at={0} w={1100} />
      <Micro text={SAMPLE.chapter} y={480} at={0.2} align="left" />
      <div style={{ position: "absolute", left: M, top: 530, width: COLUMN * d, height: 1, background: METAL, opacity: 0.8 }} />
      {rows.map((r, i) => {
        const p = ease("maskRise", t - 0.45 - i * 0.15);
        return (
          <div key={i} style={{ position: "absolute", left: M, top: top0 + i * lineH, height: lineH * 1.08, overflow: "hidden" }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: size,
                lineHeight: `${lineH}px`,
                letterSpacing: `${T.tracking}em`,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transform: `translateY(${(1 - p) * S.motion.recipes.maskRise.distance * 100}%)`,
              }}
            >
              <span style={{ ...silverText, paddingRight: "0.06em" }}>{r}</span>
            </div>
          </div>
        );
      })}
      <Pill text={em} size={pSize} y={pillY} at={1.05} enter="squash" rim align="left" />
      <Sub text={SAMPLE.body} y={pillY + pillHeight(pSize) / 2 + 70} at={1.6} align="left" width={COLUMN * 0.86} />
    </Ground>
  );
};

/** Glass card: a chrome sphere (the air molecule) with its contact shadow, a silver beam, pale scattered rays. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const card = { x: M, y: 470, w: COLUMN, h: 820 };
  const [cx, cy] = [W / 2, card.y + 430];
  const r = 112;
  const sx = card.x + 70;
  const sy = card.y + 110;
  const ang = Math.atan2(cy - sy, cx - sx);
  const ex = cx - Math.cos(ang) * (r + 8);
  const ey = cy - Math.sin(ang) * (r + 8);
  const beam = ease("draw", t - 0.7);
  const sphere = ease("rise", t - 0.4);
  // ten directions 36° apart, minus the one the beam arrives along
  const rays = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10).filter((a) => Math.abs(Math.cos(a - (ang + Math.PI))) < 0.95);
  return (
    <Ground>
      <Micro text="How it works" y={392} at={0.1} />
      <Card x={card.x} y={card.y} w={card.w} h={card.h} at={0.1} />
      <Svg>
        <defs>
          <radialGradient id="oc-sphere" cx="0.36" cy="0.3" r="0.75">
            <stop offset="0" stopColor={C.silverTop} />
            <stop offset="0.2" stopColor={C.silverMid} />
            <stop offset="0.5" stopColor={C.silverBase} />
            <stop offset="0.82" stopColor={C.obTop} />
            <stop offset="1" stopColor={C.bg} />
          </radialGradient>
          <linearGradient id="oc-beam" x1={sx} y1={sy} x2={ex} y2={ey} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.silverBase} stopOpacity={0.3} />
            <stop offset="1" stopColor={C.silverTop} />
          </linearGradient>
          <filter id="oc-blur18" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={E.contactShadow.blur / 2} />
          </filter>
          <filter id="oc-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={8} />
          </filter>
        </defs>
        <ellipse cx={cx} cy={cy + r + 46} rx={r * 1.05} ry={20} fill="#000" opacity={E.contactShadow.opacity * sphere} filter="url(#oc-blur18)" />
        {beam > 0 ? <line x1={sx} y1={sy} x2={lerp(sx, ex, beam)} y2={lerp(sy, ey, beam)} stroke="url(#oc-beam)" strokeWidth={4} strokeLinecap="round" /> : null}
        {rays.map((a, i) => {
          const p = ease("bar", t - 1.55 - i * 0.03);
          if (p <= 0) return null;
          const r0 = r + 34;
          const r1 = r0 + 150 * p;
          const l = { x1: cx + r0 * Math.cos(a), y1: cy + r0 * Math.sin(a), x2: cx + r1 * Math.cos(a), y2: cy + r1 * Math.sin(a) };
          return (
            <g key={i}>
              <line {...l} stroke={C.accent2} strokeWidth={10} strokeLinecap="round" opacity={E.bloom * p} filter="url(#oc-bloom)" />
              <line {...l} stroke={C.accent2} strokeWidth={3.5} strokeLinecap="round" opacity={p} />
            </g>
          );
        })}
        <g opacity={clamp(sphere * 1.3)} transform={`translate(0 ${(1 - sphere) * 30})`}>
          <circle cx={cx} cy={cy} r={r} fill="url(#oc-sphere)" />
          <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke={C.silverTop} strokeOpacity={0.18} strokeWidth={2} />
        </g>
      </Svg>
      <Spark cx={(sx + ex) / 2 + 2} y={(sy + ey) / 2} at={1.1} />
      <Micro text={SAMPLE.diagram.in} y={sy - 52} at={0.8} align="left" x={sx - 10} />
      <Micro text={SAMPLE.diagram.object} y={card.y + card.h - 56} at={0.9} />
      <Pill text={SAMPLE.diagram.label} size={T.cta} y={1420} at={2.0} weight={600} tracking={T.ctaTracking} padX={E.pill.ctaPadX * 0.7} padY={E.pill.ctaPadY} />
    </Ground>
  );
};

/** Compare Bars: a big silver number, then a glass card with a dim red bar and a tall blooming blue bar. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const size = T.number;
  const p = ease("pillIn", t - 0.2);
  const card = { x: M, y: 860, w: COLUMN, h: 620 };
  const base = card.y + card.h - 150;
  const maxH = 330;
  const bw = 168;
  const bars = [
    { label: "Red · 700 nm", value: 1, frac: 1 / n.value, x: W / 2 - 160, at: 0.9, recipe: "bar" as const, hero: false },
    { label: "Blue · 450 nm", value: n.value, frac: 1, x: W / 2 + 160, at: 0.9 + S.motion.barDelay, recipe: "heroBar" as const, hero: true },
  ];
  return (
    <Ground>
      <Atmosphere y={560} at={0} w={900} h={520} />
      <Micro text="By the numbers" y={392} at={0.1} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          opacity: clamp(p * 1.3),
          transform: `translateY(${(1 - p) * S.motion.recipes.pillIn.distance}px) scale(${lerp(0.96, 1, p)})`,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ ...silverText, paddingRight: "0.05em" }}>
          {n.value.toFixed(n.decimals)}
          {n.unit}
        </span>
      </div>
      <Sub text={n.caption} y={735} at={0.6} width={COLUMN * 0.8} />
      <Card x={card.x} y={card.y} w={card.w} h={card.h} at={0.5} />
      {bars.map((b) => {
        const g = ease(b.recipe, t - b.at);
        const v = ease("labelIn", t - b.at - 0.35);
        const h = maxH * b.frac * Math.max(0, g);
        return (
          <React.Fragment key={b.label}>
            {b.hero && g > 0 ? (
              <div style={{ position: "absolute", left: b.x - bw / 2 - 20, top: base - h - 20, width: bw + 40, height: h + 20, borderRadius: 30, background: rgba(C.accent2, 0.22 * g), filter: "blur(28px)" }} />
            ) : null}
            <div
              style={{
                position: "absolute",
                left: b.x - bw / 2,
                top: base - h,
                width: bw,
                height: h,
                borderRadius: "14px 14px 4px 4px",
                background: b.hero ? METAL : `linear-gradient(90deg, ${C.obTop} 0%, ${C.silverBase} 45%, ${C.obTop} 100%)`,
                opacity: b.hero ? 1 : 0.7,
                boxShadow: E.pill.highlight,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: b.x - bw / 2,
                top: base + 2,
                width: bw,
                height: h * 0.35,
                borderRadius: "4px 4px 14px 14px",
                background: b.hero ? METAL : C.silverBase,
                opacity: 0.12,
                maskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: b.x - 150,
                width: 300,
                top: base - h - 66,
                textAlign: "center",
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: T.row,
                letterSpacing: "-0.01em",
                opacity: v,
                transform: `translateY(${(1 - v) * S.motion.recipes.labelIn.distance}px)`,
              }}
            >
              <span style={silverText}>
                {b.value === 1 ? "1" : b.value.toFixed(n.decimals)}
                {n.unit}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: b.x - 160,
                width: 320,
                top: base + 64,
                textAlign: "center",
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: T.micro,
                letterSpacing: `${T.microTracking * 0.5}em`,
                textTransform: "uppercase",
                color: C.text,
                opacity: v * T.microOpacity,
              }}
            >
              {b.label}
            </div>
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

/** Connector List: obsidian rows slide in from the left, then a glass highlight snaps onto the step being spoken. */
const List: React.FC = () => {
  const t = useSeconds();
  const glyphs = ["sun", "scatter", "eye"] as const;
  const rowH = 176;
  const gap = 36;
  const top = 560;
  const hl = ease("snap", t - 1.45);
  const hlRow = 2;
  return (
    <Ground>
      <Micro text="In three steps" y={480} at={0.1} />
      {SAMPLE.list.map((item, i) => {
        const p = ease("slide", t - 0.25 - i * S.motion.rowStagger);
        if (p <= 0) return null;
        const y = top + i * (rowH + gap);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: M,
              top: y,
              width: COLUMN,
              height: rowH,
              borderRadius: 48,
              background: `linear-gradient(180deg, ${C.surface2} 0%, ${C.surface} 50%, ${C.bg} 100%)`,
              border: `1px solid rgba(255,255,255,${E.pill.border})`,
              boxShadow: `${E.pill.highlight}, ${E.pill.shade}, ${E.pill.drop}`,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 40px",
              boxSizing: "border-box",
              opacity: clamp(p * 1.4),
              transform: `translateX(${-(1 - p) * S.motion.recipes.slide.distance}px)`,
            }}
          >
            <Tile glyph={glyphs[i]} />
            <div style={{ flex: 1, fontFamily: BODY, fontWeight: 600, fontSize: T.row, lineHeight: 1.12, letterSpacing: "0.04em", textTransform: "uppercase", textWrap: "balance" } as React.CSSProperties}>
              <span style={silverText}>{item}</span>
            </div>
            <svg width={22} height={36} style={{ flex: "none" }}>
              <path d="M 4 4 L 18 18 L 4 32" fill="none" stroke={C.silverBase} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      })}
      {hl > 0 ? (
        <div
          style={{
            position: "absolute",
            left: M - 8,
            top: top + hlRow * (rowH + gap) - 8,
            width: COLUMN + 16,
            height: rowH + 16,
            borderRadius: 56,
            border: `1.5px solid rgba(255,255,255,0.32)`,
            background: "rgba(255,255,255,0.04)",
            boxShadow: `0 0 48px ${rgba(C.accent2, 0.2)}, inset 0 0 24px ${rgba(C.accent2, 0.08)}`,
            opacity: clamp(hl * 1.5),
            transform: `scale(${lerp(1.05, 1, hl)})`,
          }}
        />
      ) : null}
      <Sub text={SAMPLE.body} y={top + 3 * (rowH + gap) + 60} at={1.9} width={COLUMN * 0.84} />
    </Ground>
  );
};

/** End card: Kinetic "LOOK UP [AGAIN.]", then the Chrome CTA pill rises and its one glint sweeps late. */
const End: React.FC = () => {
  const cta = 1210;
  return (
    <Ground>
      <Kinetic lines={[SAMPLE.end.line]} guide={860} at={0.25} />
      <Pill text={SAMPLE.end.cta} size={T.cta} y={cta} at={1.2} weight={600} tracking={T.ctaTracking} padX={E.pill.ctaPadX} padY={E.pill.ctaPadY} glintAt={2.3} />
      <Sub text={SAMPLE.topic} y={cta + pillHeight(T.cta, E.pill.ctaPadY) / 2 + 40} at={1.75} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4, hero: 2.4, component: Title },
  { id: "headline", duration: 4, hero: 2.8, component: HeadlineSample },
  { id: "diagram", duration: 4, hero: 3.2, component: Diagram },
  { id: "number", duration: 4, hero: 2.9, component: NumberSample },
  { id: "list", duration: 4, hero: 3.0, component: List },
  { id: "end", duration: 4, hero: 2.75, component: End },
];

