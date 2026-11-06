/**
 * Paper Form's pieces: the bone paper (fibres, cloud, specks, a printed graphite grid) under a hand-held camera, the
 * ink header band, section labels, typewritten answers that run hot, boxes, pen arrows, checkboxes with drawn ticks and
 * crosses, the orange marker strike, the distressed rubber stamp and fine print. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { bezier, clamp, color, expoOut, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const C = {
  paper: color(style.palette, "background"),
  band: color(style.palette, "surface"),
  ink: color(style.palette, "text"),
  graphite: color(style.palette, "muted"),
  ash: color(style.palette, "faint"),
  signal: color(style.palette, "accent"),
  blood: color(style.palette, "accent2"),
  bone: color(style.palette, "bone"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const L = style.layout;
const E = style.elements;
const F = style.finish;
const inOutQuad = bezier(0.45, 0, 0.55, 1);

const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const hexRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: string, b: string, k: number) => {
  const x = hexRgb(a);
  const y = hexRgb(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * clamp(k))).join(", ")})`;
};

/** The paper: base, fibres and cloud (darkening up to ~6.5%), sparse specks and the printed 24 px graphite grid. */
const PaperTexture: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        backgroundColor: C.paper,
        backgroundImage: `linear-gradient(to right, ${rgba(C.graphite, L.gridAlpha)} 1.5px, transparent 1.5px), linear-gradient(to bottom, ${rgba(C.graphite, L.gridAlpha)} 1.5px, transparent 1.5px)`,
        backgroundSize: `${L.grid}px ${L.grid}px`,
      }}
    />
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <filter id="pf-fibre" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={`${E.fibre.x} ${E.fibre.y}`} numOctaves={3} seed={11} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.22  0 0 0 0 0.18  2.2 0 0 0 -1.0" />
      </filter>
      <filter id="pf-cloud" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={E.cloud.scale} numOctaves={2} seed={5} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.27  0 0 0 0 0.22  2 0 0 0 -0.7" />
      </filter>
      <rect width={W} height={H} filter="url(#pf-fibre)" opacity={E.fibre.dark * 2.5} />
      <rect width={W} height={H} filter="url(#pf-cloud)" opacity={E.cloud.dark * 2.5} />
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={rand(i + 1) * W} cy={rand(i + 101) * H} r={0.8 + rand(i + 201) * 1.6} fill={C.graphite} opacity={0.18 + rand(i + 301) * 0.2} />
      ))}
    </svg>
  </>
);

/**
 * A form page under a hand-held camera (slow drift ±6 / ±5 px, ±0.004 rad), with hits from the stamp (zoom and shake
 * decaying with a 0.07 s half-life). Waits for the fonts.
 */
export const Page: React.FC<{ hitAt?: number; children: React.ReactNode }> = ({ hitAt, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const cam = R.camera;
  const w = 2 * Math.PI * cam.hz;
  const dx = cam.driftX * Math.sin(w * t + 0.4) * 0.8 + cam.driftX * 0.2 * Math.sin(w * 2.3 * t);
  const dy = cam.driftY * Math.sin(w * 0.83 * t + 1.7);
  const roll = cam.roll * Math.sin(w * 0.61 * t + 0.9);
  const h = hitAt !== undefined && t >= hitAt ? Math.pow(0.5, (t - hitAt) / R.hit.halfLife) : 0;
  const zoom = 1 + R.hit.zoom * h;
  const sx = R.hit.shake * h * Math.sin(t * 2 * Math.PI * 50);
  const sy = R.hit.shake * h * Math.sin(t * 2 * Math.PI * 43 + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx + sx}px, ${dy + sy}px) rotate(${roll}rad) scale(${zoom * 1.02})`, transformOrigin: "50% 45%" }}>
        <PaperTexture />
        {children}
      </AbsoluteFill>
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The ink header band: "FORM 7-B" in Archivo 900 at width 112.5, spaced mono caps beside it. */
export const HeaderBand: React.FC<{ form: string; title: string; sub: string }> = ({ form, title, sub }) => {
  const { top, height } = L.band;
  return (
    <>
      <div style={{ position: "absolute", left: M, top, width: COLUMN, height, backgroundColor: C.band, opacity: 0.94 }} />
      <div
        style={{
          position: "absolute",
          left: M + 32,
          top: top + height / 2 - T.display * 0.5,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: T.display,
          lineHeight: 1,
          fontStretch: `${T.headerWidth}%`,
          fontVariationSettings: `'wdth' ${T.headerWidth}`,
          color: C.bone,
          whiteSpace: "nowrap",
        }}
      >
        {form}
      </div>
      <div style={{ position: "absolute", right: M + 30, top: top + height / 2 - 34, textAlign: "right", fontFamily: MONO, color: C.bone, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 600, fontSize: T.label, letterSpacing: `${T.sectionTracking}em`, lineHeight: 1.2 }}>{title.toUpperCase()}</div>
        <div style={{ fontWeight: 400, fontSize: T.note, letterSpacing: "0.12em", lineHeight: 1.4, opacity: 0.7 }}>{sub.toUpperCase()}</div>
      </div>
      <div style={{ position: "absolute", left: M, top: top + height + 34, width: COLUMN, height: L.rule, backgroundColor: C.ink }} />
    </>
  );
};

/** A numbered section label: "2. COLOUR OBSERVED" in Plex Mono 600, spaced. */
export const Section: React.FC<{ n: string; label: string; y: number; at?: number }> = ({ n, label, y, at = 0 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return (
    <div style={{ position: "absolute", left: M, top: y, fontFamily: MONO, fontWeight: 600, fontSize: T.section, letterSpacing: `${T.sectionTracking}em`, color: C.ink, opacity: ease("box", t), whiteSpace: "nowrap" }}>
      {`${n}. ${label.toUpperCase()}`}
    </div>
  );
};

/** A dotted answer line in ash. */
export const AnswerLine: React.FC<{ y: number; x?: number; w?: number }> = ({ y, x = M, w = COLUMN }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 0, borderTop: `2px dotted ${rgba(C.ash, 0.9)}` }} />
);

/**
 * Typewritten text: each word types over 85% of its time slice, characters jitter ±0.8 px, and a word runs hot in
 * signal, cooling to its colour over 0.35 s after it is typed.
 */
export const Typed: React.FC<{ text: string; x: number; y: number; at: number; per?: number; size?: number; col?: string; weight?: number; width?: number; lh?: number; seed?: number }> = ({
  text,
  x,
  y,
  at,
  per = 0.22,
  size = T.answer,
  col = C.ink,
  weight = 400,
  width,
  lh = T.leading,
  seed = 1,
}) => {
  const t = useSeconds();
  const ws = text.split(" ");
  let ci = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, fontFamily: MONO, fontWeight: weight, fontSize: size, lineHeight: `${size * lh}px`, whiteSpace: width ? "normal" : "nowrap" }}>
      {ws.map((w, wi) => {
        const w0 = at + wi * per;
        const typeDur = per * (R.type.duration as number);
        const heat = 1 - clamp((t - (w0 + typeDur)) / R.cool.duration);
        const c = mix(col.startsWith("#") ? col : C.ink, C.signal, heat);
        const chars = Array.from(w);
        return (
          <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.6em" }}>
            {chars.map((ch, k) => {
              ci += 1;
              const shown = t >= w0 + (typeDur * k) / chars.length;
              return (
                <span key={k} style={{ display: "inline-block", color: c, opacity: shown ? 1 : 0, transform: `translateY(${(rand(seed * 97 + ci) - 0.5) * 2 * T.jitter}px)` }}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

/** An ink-outlined process box with a "1.1" number, a typed name and a graphite note under it; fades in 0.2 s. */
export const Box: React.FC<{ x: number; y: number; w: number; h: number; at: number; num: string; name: string; note?: string; strong?: boolean }> = ({ x, y, w, h, at, num, name, note, strong = false }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `${strong ? E.boxStrong : E.box}px solid ${C.ink}`, opacity: ease("box", t) }} />
      <div style={{ position: "absolute", left: x + 18, top: y + 14, fontFamily: MONO, fontWeight: 500, fontSize: T.note, color: strong ? C.blood : C.graphite, opacity: ease("box", t) }}>{num}</div>
      <Typed text={name.toUpperCase()} x={x + 34} y={y + h / 2 - T.box * 0.45} at={at + 0.15} per={0.12} size={T.box} weight={500} />
      {note ? (
        <div style={{ position: "absolute", left: x, top: y + h + 12, fontFamily: MONO, fontSize: T.note, color: C.graphite, opacity: ease("box", t - 0.3), whiteSpace: "nowrap" }}>{note}</div>
      ) : null}
    </>
  );
};

/** A pen-drawn arrow: the line in 0.16 s, then the 14 × 8 px head in 0.07 s. */
export const Arrow: React.FC<{ from: [number, number]; to: [number, number]; at: number }> = ({ from, to, at }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("arrow", t);
  const q = inOutQuad(clamp((t - R.arrow.duration) / R.arrow.head));
  const [x0, y0] = from;
  const [x1, y1] = to;
  const a = Math.atan2(y1 - y0, x1 - x0);
  const [hl, hw] = E.arrowHead;
  const tip: [number, number] = [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={x0} y1={y0} x2={tip[0]} y2={tip[1]} stroke={C.ink} strokeWidth={E.arrow} strokeLinecap="round" />
      {q > 0 ? (
        <path
          d={`M ${x1 - Math.cos(a) * hl * q - Math.sin(a) * hw} ${y1 - Math.sin(a) * hl * q + Math.cos(a) * hw} L ${x1} ${y1} L ${x1 - Math.cos(a) * hl * q + Math.sin(a) * hw} ${y1 - Math.sin(a) * hl * q - Math.cos(a) * hw}`}
          fill="none"
          stroke={C.ink}
          strokeWidth={E.arrow}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
};

/** A checkbox (ink outline) with an optional drawn signal tick or cross, and its spaced label. */
export const Check: React.FC<{ x: number; y: number; at: number; mark?: "tick" | "cross"; markAt?: number; label?: string; chosen?: boolean }> = ({ x, y, at, mark, markAt = at + 0.3, label, chosen = false }) => {
  const t = useSeconds();
  if (t < at) return null;
  const s = L.checkbox;
  const p = mark ? inOutQuad(clamp((t - markAt) / R.tick.duration)) : 0;
  const tick: [number, number][] = [
    [x + s * 0.18, y + s * 0.52],
    [x + s * 0.42, y + s * 0.78],
    [x + s * 0.95, y - s * 0.12],
  ];
  const seg = (a: [number, number], b: [number, number], k: number) => `M ${a[0]} ${a[1]} L ${a[0] + (b[0] - a[0]) * k} ${a[1] + (b[1] - a[1]) * k}`;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: s, height: s, border: `${E.box}px solid ${mark ? C.ink : C.ash}`, boxSizing: "border-box", opacity: ease("box", t - at) }} />
      {p > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {mark === "tick" ? (
            <path d={`${seg(tick[0], tick[1], clamp(p * 2.2))} ${p > 0.45 ? seg(tick[1], tick[2], clamp((p - 0.45) / 0.55)).replace("M", "L") : ""}`} fill="none" stroke={C.signal} strokeWidth={E.tick} strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <path d={seg([x - 4, y - 4], [x + s + 4, y + s + 4], clamp(p * 2))} stroke={C.signal} strokeWidth={E.tick} strokeLinecap="round" />
              <path d={seg([x + s + 4, y - 4], [x - 4, y + s + 4], clamp(p * 2 - 1))} stroke={C.signal} strokeWidth={E.tick} strokeLinecap="round" />
            </>
          )}
        </svg>
      ) : null}
      {label ? (
        <div style={{ position: "absolute", left: x + s + 18, top: y + s / 2 - T.option * 0.62, fontFamily: MONO, fontWeight: 500, fontSize: T.option, letterSpacing: `${T.optionTracking}em`, color: chosen ? C.blood : C.ink, whiteSpace: "nowrap", opacity: ease("box", t - at) }}>
          {label.toUpperCase()}
        </div>
      ) : null}
    </>
  );
};

/** The orange marker strike through a row: 12 px, wobbling (sine + noise), drawn left to right in 0.3 s. */
export const Strike: React.FC<{ x0: number; x1: number; y: number; at: number }> = ({ x0, x1, y, at }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("strike", t);
  const n = 60;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    const wob = 3.2 * Math.sin(i * 0.33) + 2.2 * (rand(i + 7) - 0.5) + (i / n) * -6;
    return `${x.toFixed(1)} ${(y + wob).toFixed(1)}`;
  }).slice(0, Math.max(2, Math.round((n + 1) * p)));
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "multiply" }}>
      <path d={`M ${pts.join(" L ")}`} fill="none" stroke={C.signal} strokeOpacity={0.88} strokeWidth={E.marker} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/**
 * The rubber stamp: a 12 px outer and 4 px inner border, Archivo 900 lines and a mono line, knocked out by speckles and
 * dry streaks; slams from 1.6× to 1 in 0.12 s (opacity in 0.05 s), rotated −0.07 rad, at 92%.
 */
export const Stamp: React.FC<{ lines: string[]; sub: string; cx: number; cy: number; w: number; h: number; at: number; size?: number }> = ({ lines, sub, cx, cy, w, h, at, size = T.stamp }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const st = E.stamp;
  const s = R.stamp.from + (1 - R.stamp.from) * ease("stamp", t);
  const op = clamp(t / R.stamp.opacityIn) * st.opacity;
  const id = `pf-stamp-${Math.round(cx)}-${Math.round(cy)}`;
  // the stamp's words fit inside its inner border (Archivo 900 at width 100 is about 0.7 em a character)
  const fitted = Math.min(size, (w - 2 * (st.outer + 10) - 60) / (Math.max(...lines.map((l) => l.length)) * 0.7));
  const lh = fitted * 0.92;
  const top = h / 2 - (lines.length * lh + 46) / 2;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, overflow: "visible", transform: `rotate(${st.rotate}rad) scale(${s})`, opacity: op, mixBlendMode: "multiply" }}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-20} y={-20} width={w + 40} height={h + 40}>
          <rect x={-20} y={-20} width={w + 40} height={h + 40} fill="white" />
          {Array.from({ length: st.speckles }, (_, i) => (
            <circle key={i} cx={rand(i * 3 + 1) * w} cy={rand(i * 3 + 2) * h} r={0.5 + Math.pow(rand(i * 3 + 3), 3) * 2.6} fill="black" />
          ))}
          {Array.from({ length: st.streaks }, (_, i) => {
            const x = rand(i + 9001) * w;
            const y = rand(i + 9101) * h;
            const len = 30 + rand(i + 9201) * 170;
            const a = -0.12 + rand(i + 9301) * 0.24;
            return <line key={`s${i}`} x1={x} y1={y} x2={x + Math.cos(a) * len} y2={y + Math.sin(a) * len} stroke="black" strokeWidth={0.8 + rand(i + 9401) * 1.8} strokeLinecap="round" />;
          })}
        </mask>
      </defs>
      <g mask={`url(#${id})`} fill={C.signal} stroke={C.signal}>
        <rect x={st.outer / 2} y={st.outer / 2} width={w - st.outer} height={h - st.outer} fill="none" strokeWidth={st.outer} />
        <rect x={st.outer + 10} y={st.outer + 10} width={w - 2 * (st.outer + 10)} height={h - 2 * (st.outer + 10)} fill="none" strokeWidth={st.inner} />
        {lines.map((l, i) => (
          <text key={i} x={w / 2} y={top + (i + 0.8) * lh} textAnchor="middle" stroke="none" style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: fitted, fontStretch: "100%", fontVariationSettings: "'wdth' 100" }}>
            {l.toUpperCase()}
          </text>
        ))}
        <text x={w / 2} y={top + lines.length * lh + 34} textAnchor="middle" stroke="none" style={{ fontFamily: MONO, fontWeight: 600, fontSize: 28, letterSpacing: st.lineSpacing }}>
          {sub.toUpperCase()}
        </text>
      </g>
    </svg>
  );
};

/** Fine print at the foot of the form: a rule, then graphite mono at 75%. */
export const FinePrint: React.FC<{ text: string; y?: number }> = ({ text, y = 1500 }) => (
  <>
    <div style={{ position: "absolute", left: M, top: y, width: COLUMN, height: L.rule, backgroundColor: rgba(C.ink, 0.6) }} />
    <div style={{ position: "absolute", left: M, top: y + 18, width: COLUMN, fontFamily: MONO, fontSize: T.fine, lineHeight: 1.35, color: rgba(C.graphite, 0.75) }}>{text}</div>
  </>
);

/** A right-aligned total in the margin: "STEPS 3 · KEYFRAMES 0". */
export const Total: React.FC<{ text: string; y: number; at: number; col?: string }> = ({ text, y, at, col = C.blood }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return <div style={{ position: "absolute", right: M, top: y, fontFamily: MONO, fontWeight: 600, fontSize: T.label, letterSpacing: "0.12em", color: col, opacity: expoOut(t / 0.3), whiteSpace: "nowrap" }}>{text.toUpperCase()}</div>;
};
