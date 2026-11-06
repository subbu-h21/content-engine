/**
 * Calm Product Demo's pieces: canvas, silk light bands, the pushed-in line with its highlight sweep, UI cards, the
 * cursor and the step tick. Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, fit, lerp, rgba, run, smooth, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const C = {
  bg: color(style.palette, "background"),
  surface: color(style.palette, "surface"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  accent2: color(style.palette, "accent2"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);
export const dur = (name: keyof typeof style.motion.recipes): number => {
  const r = R[name];
  return r.kind === "ease" ? r.duration : 0.6;
};

/** Slow diagonal bands of white → pale accent → accent light (the open, the closer and the end card). */
export const Silk: React.FC = () => {
  const t = useSeconds();
  const drift = S.motion.silkDrift * t;
  const band = (top: number, h: number, a: number, col: string, k: number) => (
    <div
      style={{
        position: "absolute",
        left: -600,
        width: W + 1200,
        top,
        height: h,
        transform: `rotate(-24deg) translateX(${drift * k}px)`,
        background: `linear-gradient(90deg, ${rgba(col, 0)} 0%, ${rgba(col, a)} 45%, ${rgba(col, a * 0.6)} 60%, ${rgba(col, 0)} 100%)`,
        filter: "blur(40px)",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ opacity: clamp(t / 0.8) }}>
      {band(-120, 520, 0.9, C.accent2, 1)}
      {band(1460, 620, 0.85, C.accent2, -0.7)}
      {band(1620, 220, 0.16, C.accent, -1.1)}
    </AbsoluteFill>
  );
};

/** The canvas; waits for the fonts. No grain, no vignette, no glow. */
export const Ground: React.FC<{ children: React.ReactNode; silk?: boolean }> = ({ children, silk = false }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SANS }}>
      {silk ? <Silk /> : null}
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** A small muted word that fades up in the centre (the open's "Introducing"). */
export const Kicker: React.FC<{ text: string; y: number; at?: number }> = ({ text, y, at = 0 }) => {
  const p = ease("word", useSeconds() - at);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: y - S.type.kicker * 0.6, textAlign: "center", fontSize: S.type.kicker, color: C.muted, opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
      {text}
    </div>
  );
};

/** The soft accent box that sweeps left → right behind a key word. */
export const Highlight: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        left: "-0.1em",
        right: "-0.1em",
        top: "0.1em",
        bottom: "0.04em",
        borderRadius: "0.12em",
        backgroundColor: rgba(C.accent, S.finish.highlightOpacity),
        transform: `scaleX(${clamp(p)})`,
        transformOrigin: "left center",
      }}
    />
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);

/** Split a line into runs of plain and *emphasised* words. */
const runs = (line: string): { em: boolean; words: string[] }[] => {
  const out: { em: boolean; words: string[] }[] = [];
  for (const w of words(line)) {
    const last = out[out.length - 1];
    if (last && last.em === w.em) last.words.push(w.text);
    else out.push({ em: w.em, words: [w.text] });
  }
  return out;
};

/**
 * One short centred line (or two): words fade in one after another while the camera pushes in until the longest
 * line spans `pushWidth` of the frame; then the highlight sweeps behind the *emphasised* words.
 */
export const PushLine: React.FC<{ lines: string[]; y: number; at?: number; size?: number; hlAt?: number }> = ({ lines, y, at = 0, size, hlAt }) => {
  const t = useSeconds() - at;
  const fs = size ?? fit(lines, W * S.layout.pushWidth, S.type.display, S.type.charEm);
  const scale = lerp(S.layout.pushFrom, 1, ease("push", t));
  const lh = fs * S.type.leading;
  const blockH = lines.length * lh;
  const hl = ease("highlight", t - (hlAt ?? dur("push") + 0.1));
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y - blockH / 2,
        width: W,
        height: blockH,
        transform: `scale(${scale})`,
        transformOrigin: `${W / 2}px ${blockH / 2}px`,
        textAlign: "center",
        fontSize: fs,
        lineHeight: `${lh}px`,
        letterSpacing: `${S.type.tracking}em`,
        color: C.text,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {runs(line).map((run_, ri) => {
            const content = run_.words.map((w, wi) => {
              const p = ease("word", t - i * S.motion.stagger);
              i += 1;
              return (
                <span key={wi} style={{ opacity: p }}>
                  {wi > 0 ? " " : ""}
                  {w}
                </span>
              );
            });
            return (
              <React.Fragment key={ri}>
                {ri > 0 ? " " : null}
                {run_.em ? <Highlight p={hl}>{content}</Highlight> : content}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A rebuilt UI surface: white, 1 px border, soft shadow; it blur-dissolves in. */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; at?: number; radius?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  at = 0,
  radius = S.layout.cardRadius,
  children,
}) => {
  const p = ease("dissolve", useSeconds() - at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        backgroundColor: C.surface,
        border: `1px solid ${C.faint}`,
        boxShadow: S.finish.shadow,
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * S.motion.dissolveBlur}px)` : undefined,
        transform: `scale(${lerp(0.97, 1, p)})`,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

/** Generic arrow pointer, 48 px tall. */
const Arrow: React.FC<{ press: number }> = ({ press }) => (
  <svg width={34} height={50} viewBox="0 0 24 36" style={{ overflow: "visible", transform: `scale(${1 - 0.12 * press})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.22))" }}>
    <path d="M2 2 L2 28 L8.5 22 L13 32.5 L17 30.8 L12.6 20.8 L21 20.8 Z" fill={C.text} stroke="#ffffff" strokeWidth={1.8} strokeLinejoin="round" />
  </svg>
);

/**
 * The cursor: glides between keys on gentle curves, arrives a beat before it clicks, dips on the press and leaves a
 * soft ripple on the clicked control. Keys are [seconds, x, y]; `click` is a time in seconds.
 */
export const Cursor: React.FC<{ keys: [number, number, number][]; click?: number; at?: number }> = ({ keys, click, at = 0 }) => {
  const t = useSeconds() - at;
  if (t < keys[0][0]) return null;
  let x = keys[keys.length - 1][1];
  let y = keys[keys.length - 1][2];
  for (let k = 1; k < keys.length; k++) {
    const [t0, x0, y0] = keys[k - 1];
    const [t1, x1, y1] = keys[k];
    if (t <= t1) {
      const u = ease("cursor", (t - t0) / (t1 - t0) * dur("cursor"));
      const arc = Math.sin(Math.PI * u) * 0.06;
      x = lerp(x0, x1, u) - (y1 - y0) * arc;
      y = lerp(y0, y1, u) + (x1 - x0) * arc;
      break;
    }
  }
  const press = click === undefined ? 0 : clamp(1 - Math.abs(t - click) / 0.1);
  const rp = click === undefined ? 0 : clamp((t - click) / 0.55);
  const appear = clamp((t - keys[0][0]) / 0.25);
  return (
    <>
      {rp > 0 && rp < 1 ? (
        <div
          style={{
            position: "absolute",
            left: x - 44 * smooth(rp),
            top: y - 44 * smooth(rp),
            width: 88 * smooth(rp),
            height: 88 * smooth(rp),
            borderRadius: "50%",
            backgroundColor: rgba(C.accent, 0.22 * (1 - rp)),
          }}
        />
      ) : null}
      <div style={{ position: "absolute", left: x - 2, top: y - 2, opacity: appear }}>
        <Arrow press={press} />
      </div>
    </>
  );
};

/** A step's status: a spinner while it works, then an accent check that settles in. */
export const Tick: React.FC<{ x: number; y: number; done: number; at?: number; size?: number }> = ({ x, y, done, at = 0, size = 40 }) => {
  const t = useSeconds();
  if (t < at) return null;
  const d = ease("tick", t - done);
  const spin = (t - at) * 360 * 1.4;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", left: x, top: y - size / 2, overflow: "visible" }}>
      {d <= 0 ? (
        <g transform={`rotate(${spin} 20 20)`}>
          <circle cx={20} cy={20} r={15} fill="none" stroke={C.faint} strokeWidth={3.5} />
          <path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke={C.accent} strokeWidth={3.5} strokeLinecap="round" />
        </g>
      ) : (
        <g transform={`translate(20 20) scale(${clamp(d, 0, 1.2)}) translate(-20 -20)`}>
          <circle cx={20} cy={20} r={18} fill={C.accent} />
          <path d="M12 20.5 L17.5 26 L28 15" fill="none" stroke="#ffffff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};
