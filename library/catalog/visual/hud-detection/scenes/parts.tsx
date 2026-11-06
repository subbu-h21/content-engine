/**
 * HUD Detection's pieces: the grounds (black with a brown glow, orange rings, salmon, indigo smoke), the persistent
 * HUD frame, the word-by-word caption with keywords in detection brackets, tags, slams and glows.
 * Every value comes from style.json; every HUD number is computed from the sample's own clock and words.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, rgba, run, SAMPLE, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { BODY, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const C = {
  bg: color(style.palette, "background"),
  text: color(style.palette, "text"),
  accent: color(style.palette, "accent"),
  red: color(style.palette, "accent2"),
  indigo: color(style.palette, "indigo"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  surface: color(style.palette, "surface"),
  glow: color(style.palette, "glow"),
  choc: color(style.palette, "chocolate"),
  ring: color(style.palette, "ringLine"),
  salmon: color(style.palette, "salmon"),
  verb: color(style.palette, "verbInk"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const L = style.layout;
const F = style.finish;

export type Tone = "dark" | "orange" | "salmon" | "indigo";
const light = (tone: Tone) => tone === "orange" || tone === "salmon";
/** HUD colours per ground: warm white on dark grounds, chocolate on orange and salmon. */
export const hudInk = (tone: Tone) =>
  light(tone) ? { text: tone === "orange" ? C.choc : C.verb, sub: rgba(tone === "orange" ? C.choc : C.verb, 0.88), line: rgba(tone === "orange" ? C.choc : C.verb, 0.55) } : { text: C.text, sub: C.muted, line: C.faint };

/** An orange glow (bloom) around a shape, as a CSS filter. */
export const bloom = (col = C.accent, k = 1) => `drop-shadow(0 0 ${F.bloom * 0.4 * k}px ${rgba(col, 0.8)}) drop-shadow(0 0 ${F.bloom * k}px ${rgba(col, 0.5)})`;

const Ground: React.FC<{ tone: Tone }> = ({ tone }) => {
  if (tone === "orange")
    return (
      <AbsoluteFill
        style={{
          backgroundColor: C.accent,
          backgroundImage: `radial-gradient(ellipse 90% 70% at 50% 44%, transparent 40%, ${rgba(C.choc, 0.35)} 100%), repeating-radial-gradient(circle at 50% 44%, ${C.accent} 0px, ${C.accent} 24px, ${C.ring} 30px, ${C.accent} 36px)`,
        }}
      />
    );
  if (tone === "salmon")
    return (
      <AbsoluteFill
        style={{
          backgroundColor: C.salmon,
          backgroundImage: `linear-gradient(to right, ${rgba(C.verb, 0.07)} 1px, transparent 1px), linear-gradient(to bottom, ${rgba(C.verb, 0.07)} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    );
  if (tone === "indigo")
    return (
      <AbsoluteFill
        style={{
          backgroundColor: C.indigo,
          backgroundImage: `radial-gradient(ellipse 60% 30% at 30% 30%, ${rgba(C.text, 0.07)} 0%, transparent 70%), radial-gradient(ellipse 70% 35% at 75% 62%, ${rgba(C.text, 0.05)} 0%, transparent 70%), radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, ${rgba(C.bg, 0.75)} 100%)`,
        }}
      />
    );
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(ellipse ${F.glowRadius * 130}% ${F.glowRadius * 70}% at 82% 12%, ${C.glow} 0%, transparent 70%), radial-gradient(ellipse ${F.glowRadius * 110}% ${F.glowRadius * 50}% at 10% 95%, ${rgba(C.glow, 0.8)} 0%, transparent 70%)`,
      }}
    />
  );
};

const pad = (n: number, w = 2) => String(Math.floor(n)).padStart(w, "0");
const timecode = (s: number) => `00:00:${pad(s)}:${pad(Math.round((s % 1) * 30) % 30)}`;

export type CapWord = { text: string; at: number; key?: boolean };
export type HudInfo = {
  /** where this sample sits in the imagined video (s), for the timecode and the timeline */
  clock: number;
  total: number;
  ticks: number[];
  chapter: string;
  chapterSub: string;
  /** the whole script with global times, for the transcript edge */
  transcript: CapWord[];
};

/** Thin L-shaped corner brackets at the frame's corners. */
const Corners: React.FC<{ col: string }> = ({ col }) => {
  const { left, right, top, bottom, arm } = L.frame;
  const s = 2;
  const c = (x: number, y: number, dx: number, dy: number, k: number) => (
    <React.Fragment key={k}>
      <div style={{ position: "absolute", left: dx > 0 ? x : x - arm, top: y - s / 2, width: arm, height: s, backgroundColor: col }} />
      <div style={{ position: "absolute", left: x - s / 2, top: dy > 0 ? y : y - arm, width: s, height: arm, backgroundColor: col }} />
    </React.Fragment>
  );
  return <>{[c(left, top, 1, 1, 0), c(right, top, -1, 1, 1), c(left, bottom, 1, -1, 2), c(right, bottom, -1, -1, 3)]}</>;
};

/** A deterministic speech-like waveform with the played part brighter, keyword ticks and the red playhead. */
const Timeline: React.FC<{ info: HudInfo; t: number; ink: ReturnType<typeof hudInk>; tone: Tone }> = ({ info, t, ink, tone }) => {
  const x0 = 100;
  const x1 = 980;
  const y = L.timeline;
  const n = 150;
  const now = (info.clock + t) / info.total;
  const bars = Array.from({ length: n }, (_, i) => {
    const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.21) * Math.sin(i * 0.053 + 0.7));
    const h = 4 + 30 * env * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + 0.3)));
    return h;
  });
  const bw = (x1 - x0) / n;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={x0} y1={y + 26} x2={x1} y2={y + 26} stroke={ink.line} strokeWidth={1} />
      {bars.map((h, i) => {
        const played = i / n <= now;
        return <rect key={i} x={x0 + i * bw} y={y - h / 2} width={bw * 0.55} height={h} fill={played ? (light(tone) ? ink.text : C.text) : ink.line} opacity={played ? 0.75 : 1} />;
      })}
      {info.ticks.map((k, i) => {
        const x = x0 + (x1 - x0) * (k / info.total);
        return <rect key={`k${i}`} x={x - 2} y={y - 28} width={4} height={12} fill={light(tone) ? ink.text : C.accent} />;
      })}
      <line x1={x0 + (x1 - x0) * now} y1={y - 34} x2={x0 + (x1 - x0) * now} y2={y + 30} stroke={light(tone) ? ink.text : C.red} strokeWidth={2.5} />
      <path d={`M ${x0 + (x1 - x0) * now - 7} ${y - 40} L ${x0 + (x1 - x0) * now + 7} ${y - 40} L ${x0 + (x1 - x0) * now} ${y - 31} Z`} fill={light(tone) ? ink.text : C.red} />
    </svg>
  );
};

/** The live transcript down the left edge: said words in the HUD's sub colour, keywords orange. */
const Transcript: React.FC<{ info: HudInfo; t: number; ink: ReturnType<typeof hudInk>; tone: Tone }> = ({ info, t, ink, tone }) => {
  const now = info.clock + t;
  const said = info.transcript.filter((w) => w.at <= now);
  const maxChars = Math.floor((1000 / (T.readout * 0.6)) * 0.95);
  const shown: CapWord[] = [];
  let len = 0;
  for (let i = said.length - 1; i >= 0; i--) {
    len += said[i].text.length + 1;
    if (len > maxChars) break;
    shown.unshift(said[i]);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 92,
        top: 380,
        transform: "rotate(90deg)",
        transformOrigin: "0 0",
        fontFamily: MONO,
        fontSize: T.readout,
        lineHeight: 1,
        color: ink.sub,
        whiteSpace: "nowrap",
      }}
    >
      {shown.map((w, i) => (
        <span key={i} style={{ color: w.key ? (light(tone) ? ink.text : C.accent) : undefined, fontWeight: w.key ? 700 : 400 }}>
          {(i ? " " : "") + w.text.toLowerCase()}
        </span>
      ))}
    </div>
  );
};

/** The persistent HUD frame: corners, title, timecode and word counter, transcript edge, timeline, handle, chapter. */
export const Hud: React.FC<{ info: HudInfo; tone: Tone }> = ({ info, tone }) => {
  const t = useSeconds();
  const words = info.transcript.filter((w) => w.at <= info.clock + t).length;
  const ink = hudInk(tone);
  const { left, right } = L.frame;
  const label = (text: string, x: number, y: number, size: number, col: string, align: "left" | "right", weight = 500, spacing = T.hudTracking) => (
    <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? W - x : undefined, top: y, fontFamily: MONO, fontWeight: weight, fontSize: size, letterSpacing: `${spacing}em`, color: col, whiteSpace: "nowrap", lineHeight: 1 }}>
      {text}
    </div>
  );
  return (
    <>
      <Corners col={ink.text} />
      {label(SAMPLE.kicker.toUpperCase(), left + 32, 238, T.hud, ink.text, "left", 700)}
      {label(`WORD-LEVEL · ${pad(Math.round(info.clock) + 1)}`, left + 32, 278, T.readout, ink.sub, "left", 400, 0.18)}
      {label(timecode(info.clock + t), right - 32, 238, T.hud + 2, ink.text, "right", 500, 0.04)}
      {label(`W.${pad(words, 3)}`, right - 32, 278, T.readout, ink.sub, "right", 400, 0.1)}
      <Transcript info={info} t={t} ink={ink} tone={tone} />
      <Timeline info={info} t={t} ink={ink} tone={tone} />
      {label(SAMPLE.end.cta.toUpperCase(), left + 32, 1508, T.label, ink.text, "left", 700, 0.12)}
      {label("WORD-LEVEL / AUTO-EDIT", left + 32, 1546, T.readout, ink.sub, "left", 400, 0.12)}
      {label(info.chapter, right - 32, 1508, T.label, ink.text, "right", 700, 0.12)}
      {label(info.chapterSub, right - 32, 1546, T.readout, ink.sub, "right", 400, 0.18)}
    </>
  );
};

/** A scene: its ground, the content (slow push-in), the HUD on top, the finish. Waits for the fonts. */
export const Scene: React.FC<{ tone?: Tone; info: HudInfo; length: number; children: React.ReactNode }> = ({ tone = "dark", info, length, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const k = 1 + (R.push.to - 1) * clamp(t / length);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <Ground tone={tone} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "50% 42%" }}>{children}</AbsoluteFill>
      <Hud info={info} tone={tone} />
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Orange corner brackets that close in on what they wrap (the lock-on). */
export const Bracketed: React.FC<{ at: number; col?: string; pad?: number; arm?: number; weight?: number; children: React.ReactNode }> = ({ at, col = C.accent, pad: p = 10, arm = 16, weight = 3, children }) => {
  const t = useSeconds() - at;
  const q = t < 0 ? 0 : ease("lock", t);
  const off = (1 - q) * R.lock.distance * arm * 3;
  const c = (k: number, l: boolean, top: boolean) => (
    <div
      key={k}
      style={{
        position: "absolute",
        left: l ? -p - off : undefined,
        right: l ? undefined : -p - off,
        top: top ? -p * 0.6 - off : undefined,
        bottom: top ? undefined : -p * 0.6 - off,
        width: arm,
        height: arm,
        borderLeft: l ? `${weight}px solid ${col}` : undefined,
        borderRight: l ? undefined : `${weight}px solid ${col}`,
        borderTop: top ? `${weight}px solid ${col}` : undefined,
        borderBottom: top ? undefined : `${weight}px solid ${col}`,
        opacity: q,
      }}
    />
  );
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      {t >= 0 ? [c(0, true, true), c(1, false, true), c(2, true, false), c(3, false, false)] : null}
    </span>
  );
};

/** The word-by-word caption with keywords in brackets, and the mono readout of the latest keyword under it. */
export const Caption: React.FC<{ words: CapWord[]; clock: number; tone?: Tone; y?: number }> = ({ words, clock, tone = "dark", y = L.caption }) => {
  const t = useSeconds();
  const ink = hudInk(tone);
  // consecutive keyword words share one pair of brackets; the readout names the whole keyword
  const groups: CapWord[][] = [];
  for (const w of words) {
    const last = groups[groups.length - 1];
    if (last && last[0].key && w.key) last.push(w);
    else groups.push([w]);
  }
  const keyGroup = [...groups].reverse().find((g) => g[0].key && g[0].at <= t);
  const lastKey = keyGroup ? { text: keyGroup.map((w) => w.text).join(" "), at: keyGroup[0].at } : undefined;
  const keyCol = tone === "orange" ? C.text : light(tone) ? C.accent : C.accent;
  return (
    <>
      <div style={{ position: "absolute", left: M, right: M, top: y - T.caption * 0.6, textAlign: "center", fontFamily: BODY, fontWeight: 500, fontSize: T.caption, lineHeight: 1.2, color: light(tone) ? ink.text : C.text, whiteSpace: "nowrap" }}>
        {groups.map((g, gi) => {
          const parts = g.map((w, j) => {
            const p = ease("word", t - w.at);
            return (
              <React.Fragment key={j}>
                {j ? " " : ""}
                <span style={{ display: "inline-block", opacity: t < w.at ? 0 : p, transform: `translateY(${(1 - p) * R.word.distance}px)`, color: w.key ? keyCol : undefined }}>{w.text}</span>
              </React.Fragment>
            );
          });
          return (
            <React.Fragment key={gi}>
              {gi ? " " : ""}
              {g[0].key ? (
                <Bracketed at={g[0].at} col={tone === "orange" ? C.choc : C.accent} pad={8} arm={14} weight={2.5}>
                  {parts}
                </Bracketed>
              ) : (
                parts
              )}
            </React.Fragment>
          );
        })}
      </div>
      {lastKey ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y + T.caption * 0.85, textAlign: "center", fontFamily: MONO, fontSize: T.readout, letterSpacing: "0.14em", color: ink.sub, opacity: ease("word", t - lastKey.at) }}>
          {`${(clock + lastKey.at).toFixed(2).padStart(5, "0")}s  ·  ${lastKey.text.replace(/[.,?!]/g, "").toUpperCase()}`}
        </div>
      ) : null}
    </>
  );
};

/** An orange tag with chocolate mono text, as on the lock-on brackets: "AIR MOLECULE · 06.40s". */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; align?: "left" | "right" }> = ({ text, x, y, at, align = "left" }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("stamp", t);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? W - x : undefined,
        top: y,
        padding: "6px 12px",
        backgroundColor: C.accent,
        color: C.choc,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: T.readout,
        letterSpacing: "0.1em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        transform: `scale(${R.stamp.scale + (1 - R.stamp.scale) * p})`,
        transformOrigin: align === "left" ? "0 50%" : "100% 50%",
        opacity: clamp(t / 0.05),
        filter: bloom(C.accent, 0.5),
      }}
    >
      {text}
    </div>
  );
};

/** Unbounded 900 uppercase, slammed in: scale 1.35 → 1 over 0.18 s. */
export const Slam: React.FC<{ text: string; size: number; y: number; at: number; col?: string; x?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ text, size, y, at, col = C.text, x = W / 2, style: extra, children }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("slam", t);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${R.slam.scale + (1 - R.slam.scale) * p})`,
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${T.tracking}em`,
        color: col,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        opacity: clamp(t / 0.04),
        ...extra,
      }}
    >
      {children ?? text}
    </div>
  );
};

/** A mono label (HUD data inside a scene). */
export const Mono: React.FC<{ text: string; x: number; y: number; at?: number; col?: string; size?: number; align?: "left" | "center" | "right"; spacing?: number; weight?: number }> = ({
  text,
  x,
  y,
  at = 0,
  col = C.muted,
  size = T.readout,
  align = "center",
  spacing = 0.2,
  weight = 500,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - 400 : align === "left" ? x : x - 800,
        width: align === "left" ? undefined : align === "center" ? 800 : 800,
        top: y,
        textAlign: align,
        fontFamily: MONO,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: `${spacing}em`,
        color: col,
        whiteSpace: "nowrap",
        opacity: ease("word", t),
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};
