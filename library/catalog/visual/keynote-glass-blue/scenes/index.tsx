/** Keynote Glass Blue on the shared sample content: haze opening, answer page, glass over the sky, frosted titles, end card. */
import React from "react";
import { clamp, fit, lerp, plain, rgba, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { arrive, C, Cursor, ease, Glass, Ground, IconCross, LineArt, M, S, SkyCard, sparkle, W } from "./parts";

const COL = W - 2 * M;
const T = S.type;

/** Words with *emphasis* as spans: `em` gets its own style. */
const Rich: React.FC<{ line: string; em: React.CSSProperties }> = ({ line, em }) => (
  <>
    {words(line).map((w, i) => (
      <React.Fragment key={i}>
        {i > 0 ? " " : null}
        <span style={w.em ? em : undefined}>{w.text}</span>
      </React.Fragment>
    ))}
  </>
);

/** The haze opens; the icon's four squares orbit and lock into a cross; the title arrives already moving. */
const Title: React.FC = () => {
  const t = useSeconds();
  const lines = wrap(SAMPLE.title, 14);
  const size = fit(lines, COL, T.display, T.charEm);
  const rise = arrive(t - 0.5, 320, 0);
  const pill = arrive(t - 0.9, 200, 0, "enterFast");
  return (
    <Ground kind="haze">
      <IconCross cx={540} cy={700} at={0.1} />
      <div style={{ position: "absolute", left: 0, width: W, top: 1060 + rise, textAlign: "center", fontSize: size, fontWeight: 600, lineHeight: T.leading, opacity: clamp((t - 0.5) / 0.15) }}>
        {lines.map((l, i) => (
          <div key={i}>
            <Rich line={l} em={{ color: C.blue }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: 1060 + lines.length * size * T.leading + 40 + pill, display: "flex", justifyContent: "center", opacity: clamp((t - 0.9) / 0.15) }}>
        <div style={{ padding: "12px 26px", borderRadius: 999, backgroundColor: C.capsule, color: "#ffffff", fontSize: 30, fontWeight: 600 }}>{SAMPLE.kicker}</div>
      </div>
    </Ground>
  );
};

/** The answer page: grey body with one key phrase in black 600; it scrolls in on the source's settle table. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const table = S.motion.scrollSettle;
  const idx = Math.max(0, Math.floor((t - 0.1) * S.motion.fps));
  const scroll = t < 0.1 ? table[0] : table[Math.min(idx, table.length - 1)];
  const drift = -Math.max(0, t - 0.1 - table.length / S.motion.fps) * S.motion.drift * S.motion.fps;
  const y0 = 660 + scroll + drift;
  const head = wrap(SAMPLE.headline.join(" "), 22);
  const body = wrap(SAMPLE.body, 34);
  const hover = ease("hover", t - 1.6);
  const cur = [arrive(t - 1.0, 980, 700, "enterFast"), arrive(t - 1.0, 1500, y0 + 170 + 2 * T.headlinePitch - 20, "enterFast")];
  return (
    <Ground kind="page">
      <div style={{ position: "absolute", left: M, top: y0, fontSize: 34, color: C.grey, whiteSpace: "nowrap" }}>
        {SAMPLE.kicker} <span style={{ margin: "0 10px" }}>›</span> {SAMPLE.topic}
      </div>
      <div style={{ position: "absolute", left: M, top: y0 + 80, fontSize: 52, fontWeight: 600, color: C.text }}>{SAMPLE.chapter}</div>
      <div style={{ position: "absolute", left: M, top: y0 + 180, width: COL, fontSize: T.headline, lineHeight: `${T.headlinePitch}px`, color: C.grey, whiteSpace: "nowrap" }}>
        {head.map((l, i) => (
          <div key={i}>
            <Rich line={l} em={{ color: C.text, fontWeight: 600 }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: M, top: y0 + 200 + head.length * T.headlinePitch + 50, width: COL, fontSize: T.body, lineHeight: `${T.bodyPitch}px`, color: C.grey }}>
        {body.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {t > 1.0 ? <Cursor x={cur[0]} y={cur[1]} angle={-8 * (1 - hover)} hover={hover} /> : null}
    </Ground>
  );
};

/** The sky wallpaper's line art becomes the diagram; a frosted glass box types the label. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [600, 780];
  const r = 140;
  const beam = ease("enterFast", t - 0.3);
  const [sx, sy] = [70, 400];
  const ang = Math.atan2(cy - sy, cx - sx);
  const ex = cx - r * Math.cos(ang);
  const ey = cy - r * Math.sin(ang);
  const rays = Array.from({ length: 11 }, (_, i) => ang + Math.PI / 11 + (Math.PI * 2 * i) / 11);
  const label = SAMPLE.diagram.label;
  const fpc = S.motion.typing.charsPerFrame;
  const frames = Math.max(0, Math.floor((t - 1.2) * S.motion.fps));
  const typed = label.slice(0, Math.min(label.length, Math.floor((frames * fpc * 2.5) / 3.5)));
  const box = S.layout.glassBox;
  const bx = (W - box.w) / 2;
  const by = 1250 + arrive(t - 0.6, 260, 0);
  return (
    <Ground kind="sky">
      <LineArt w={W} h={1920} seed={4} opacity={0.35} />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={sx} y1={sy} x2={lerp(sx, ex, beam)} y2={lerp(sy, ey, beam)} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r * ease("enter", t - 0.1)} fill={rgba("#ffffff", 0.06)} stroke="#ffffff" strokeOpacity={0.9} strokeWidth={2.5} />
        {rays.map((a, i) => {
          const p = ease("enterFast", t - 0.8 - i * S.motion.stagger * 0.5);
          if (p <= 0) return null;
          const r0 = r + 14;
          const r1 = r0 + 170 * p;
          const col = i % 2 ? C.cyan : "#ffffff";
          return (
            <g key={i}>
              <line x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={col} strokeWidth={3} strokeLinecap="round" opacity={0.95} />
              {i % 3 === 0 ? <circle cx={cx + (r1 + 16) * Math.cos(a)} cy={cy + (r1 + 16) * Math.sin(a)} r={7} fill={i % 2 ? C.mint : C.cyan} opacity={p} /> : null}
            </g>
          );
        })}
        <path d={sparkle(cx, cy, 30 * ease("enterFast", t - 0.7))} fill="#ffffff" />
      </svg>
      <div style={{ position: "absolute", left: sx - 4, top: sy - 66, fontSize: 34, fontWeight: 500, color: "#ffffff", opacity: clamp((t - 0.4) / 0.15) }}>{SAMPLE.diagram.in}</div>
      <div style={{ position: "absolute", left: 0, width: W, top: 1100, textAlign: "center", fontSize: 34, fontWeight: 500, color: "#ffffff", opacity: clamp((t - 1.3) / 0.15) }}>{SAMPLE.diagram.out}</div>
      <Glass x={bx} y={by} w={box.w} h={box.h} r={box.radius}>
        <div style={{ position: "absolute", left: 40, top: 30, fontSize: 28, fontWeight: 500, color: rgba("#ffffff", 0.75) }}>{SAMPLE.diagram.object}</div>
        <div style={{ position: "absolute", left: 40, top: 70, fontSize: T.body, color: "#ffffff", whiteSpace: "nowrap" }}>
          {typed}
          <span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 3, verticalAlign: "-8px", backgroundColor: "#ffffff" }} />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40 + i * 56, top: 160, width: 30, height: 30, borderRadius: i === 1 ? 8 : "50%", border: `2.5px solid ${rgba("#ffffff", 0.7)}`, boxSizing: "border-box" }} />
        ))}
        <div style={{ position: "absolute", right: 34, bottom: 30, width: box.send, height: box.send, borderRadius: "50%", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path d="M12 19 V5 M6 11 L12 5 L18 11" fill="none" stroke="#ffffff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Glass>
    </Ground>
  );
};

/** A sky card with a white caption card and a huge frosted number cut off by the card's bottom edge. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const y = 560 + arrive(t - 0.1, 420, 0);
  const inner = arrive(t - 0.5, 160, 0, "enterFast");
  return (
    <Ground kind="page">
      <SkyCard x={M} y={y} w={COL} h={720} seed={2} title={`${n.value.toFixed(n.decimals)}${n.unit}`} titleSize={340}>
        <div style={{ position: "absolute", left: 40, top: 36, padding: "8px 18px", borderRadius: 999, backgroundColor: rgba("#ffffff", 0.22), color: "#ffffff", fontSize: 26, fontWeight: 500 }}>{SAMPLE.chapter}</div>
        <div style={{ position: "absolute", left: 40, top: 100 + inner, width: 600, padding: "30px 34px 34px", borderRadius: 34, backgroundColor: C.surface, boxShadow: "0 20px 40px -20px rgba(16,32,64,0.45)", opacity: clamp((t - 0.5) / 0.12) }}>
          <div style={{ fontSize: T.caption, fontWeight: 600, lineHeight: 1.22, color: C.text }}>{n.caption[0].toUpperCase() + n.caption.slice(1)}</div>
          <div style={{ marginTop: 14, fontSize: T.subCaption, color: C.grey }}>{SAMPLE.topic}</div>
          <div style={{ position: "absolute", right: 24, bottom: 24, width: 44, height: 44, borderRadius: 12, backgroundColor: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={20} height={20} viewBox="0 0 24 24">
              <path d="M12 19 V5 M6 11 L12 5 L18 11" fill="none" stroke="#ffffff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </SkyCard>
    </Ground>
  );
};

/** Three sky cards stack in, each with a caption card and a frosted step number cut by its bottom edge. */
const List: React.FC = () => {
  const t = useSeconds();
  const h = 360;
  const gap = S.layout.card.gap;
  return (
    <Ground kind="page">
      {SAMPLE.list.map((item, i) => {
        const at = 0.1 + i * 0.25;
        const y = 390 + i * (h + gap) + arrive(t - at, 520, 0);
        return (
          <div key={i} style={{ opacity: clamp((t - at) / 0.1) }}>
            <SkyCard x={M} y={y} w={COL} h={h} seed={i * 3 + 1} title={String(i + 1).padStart(2, "0")} titleSize={260}>
              <div style={{ position: "absolute", left: 36, top: 30, padding: "6px 16px", borderRadius: 999, backgroundColor: rgba("#ffffff", 0.22), color: "#ffffff", fontSize: 24, fontWeight: 500 }}>Step {i + 1}</div>
              <div style={{ position: "absolute", left: 36, top: 80, width: 720, padding: "26px 30px", borderRadius: 28, backgroundColor: C.surface, boxShadow: "0 16px 32px -16px rgba(16,32,64,0.4)", fontSize: T.caption, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>
                {item}
              </div>
            </SkyCard>
          </div>
        );
      })}
    </Ground>
  );
};

/** The black end card: the word zoom-smears in from about 3.2× through faded copies; the only glow. */
const End: React.FC = () => {
  const t = useSeconds();
  const line = plain(SAMPLE.end.line);
  const size = T.wordmark;
  const scaleAt = (k: number) => lerp(1650 / 516, 1, ease("enterFast", k - 0.2));
  const s = scaleAt(t);
  const copies = S.finish.smearCopies;
  const glow = `0 0 6px ${rgba(C.endWord, 0.6)}, 0 0 28px ${rgba(C.endWord, 0.28)}, 0 0 110px ${rgba(C.endWord, 0.18)}`;
  const word = (sc: number, op: number, key: string, shadow?: string) => (
    <div key={key} style={{ position: "absolute", left: 0, width: W, top: 960 - size * 0.6, textAlign: "center", fontSize: size, fontWeight: 600, letterSpacing: "-0.03em", color: C.endWord, opacity: op, transform: `scale(${sc})`, transformOrigin: "50% 50%", textShadow: shadow, whiteSpace: "nowrap" }}>
      {line}
    </div>
  );
  const spread = s - scaleAt(t - 0.06);
  return (
    <Ground kind="end">
      {Math.abs(spread) > 0.004 ? Array.from({ length: copies }, (_, i) => word(s - (spread * (i + 1)) / copies, 0.5 / copies, `c${i}`)) : null}
      {word(s, clamp((t - 0.2) / 0.1), "w", glow)}
      <div style={{ position: "absolute", left: 0, width: W, top: 1060, textAlign: "center", fontSize: 30, fontWeight: 500, color: rgba(C.endWord, 0.45), opacity: clamp((t - 1.0) / 0.2) }}>{SAMPLE.end.cta}</div>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.8, component: Title },
  { id: "headline", duration: 3.0, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.8, component: Diagram },
  { id: "number", duration: 2.8, hero: 2.4, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.6, component: List },
  { id: "end", duration: 2.8, hero: 2.4, component: End },
];
