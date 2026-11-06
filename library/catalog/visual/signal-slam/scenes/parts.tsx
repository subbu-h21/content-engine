/**
 * Signal Slam's pieces: the orange field (centre lift, diagonal hatch), the punch on every word, full-frame slams at
 * their own Archivo width, the stretching final word with its glow, ink blocks and bands, chevrons, the shutter and the
 * corner furniture (plate, word counter, line strip, readout). Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, expoOut, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const C = {
  field: color(style.palette, "background"),
  centre: color(style.palette, "fieldCentre"),
  ink: color(style.palette, "text"),
  block: color(style.palette, "surface"),
  muted: color(style.palette, "muted"),
  hatch: color(style.palette, "faint"),
  glow: color(style.palette, "accent"),
  bone: color(style.palette, "accent2"),
};
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const F = style.finish;
const L = style.layout;

export const pulse = (t: number, hl: number): number => (t < 0 ? 0 : Math.pow(0.5, t / hl));
const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Character width in em of Archivo 900 uppercase at a width-axis value. */
export const charEm = (wdth: number): number => (T.charEm as Record<string, number>)[String(wdth)] ?? 0.74;
/** The size at which a word fills `width` at its Archivo width, capped so its caps stay under the max height. */
export const fitWord = (text: string, wdth: number, width = COLUMN, maxH = L.maxWordHeight): number =>
  Math.floor(Math.min(width / (Math.max(1, text.length) * charEm(wdth)), maxH / T.capHeight));

/**
 * The field: signal orange lifted ~12% at the centre, a faint diagonal hatch in blood (9 px pitch, wobbled by noise),
 * the punch (zoom +2%, half-life 0.07 s) on every hit, then grain and vignette. Waits for the fonts.
 */
export const Field: React.FC<{ hits?: number[]; shake?: number; glowAt?: number; children: React.ReactNode }> = ({ hits = [], shake, glowAt, children }) => {
  useFontsReady(FACES);
  const t = useSeconds();
  const punch = hits.reduce((n, h) => n + pulse(t - h, R.punch.halfLife), 0);
  const zoom = 1 + R.punch.zoom * Math.min(1.5, punch);
  const sh = shake !== undefined ? R.punch.shake * pulse(t - shake, R.punch.halfLife) : 0;
  const sx = sh * Math.sin(t * 2 * Math.PI * 47);
  const sy = sh * Math.sin(t * 2 * Math.PI * 53 + 1.3);
  const glow = glowAt !== undefined && t >= glowAt ? 0.35 + 0.65 * pulse(t - glowAt, R.glow.halfLife) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.field, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 48%, ${C.centre} 0%, ${C.field} 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ss-wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={6} />
          </filter>
          <pattern id="ss-hatch" width={F.hatchPitch} height={F.hatchPitch} patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
            <line x1={0} y1={0} x2={0} y2={F.hatchPitch} stroke={C.hatch} strokeWidth={2} />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#ss-hatch)" opacity={F.hatch} filter="url(#ss-wobble)" />
      </svg>
      {glow > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 35% at 50% 50%, ${rgba(C.glow, 0.85 * glow * F.bloom * 2)} 0%, transparent 100%)` }} /> : null}
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${zoom})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/**
 * One Archivo 900 word, uppercase, centred on y. "slam": scale 1.25 → 1 in 0.16 s. "stretch": letters 0.05 s apart
 * step widths 62 → `wdth` over 0.3 s, scale 1.3 → 1 in 0.15 s, with a 6 px jitter that decays (half-life 0.12 s).
 * `invert` sets it as orange type on an ink block.
 */
export const Word: React.FC<{ text: string; wdth: number; y: number; at: number; size?: number; mode?: "slam" | "stretch"; invert?: boolean; x?: number; align?: "center" | "left" }> = ({
  text,
  wdth,
  y,
  at,
  size,
  mode = "slam",
  invert = false,
  x = W / 2,
  align = "center",
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const up = text.toUpperCase();
  const fs = size ?? fitWord(up, wdth, invert ? COLUMN - 60 : COLUMN);
  const font: React.CSSProperties = { fontFamily: DISPLAY, fontWeight: 900, fontSize: fs, lineHeight: 1, whiteSpace: "pre" };
  const steps = (T.widths as number[]).filter((w) => w <= wdth);
  let scale = R.slam.from + (1 - R.slam.from) * ease("slam", t);
  let body: React.ReactNode = <span style={{ fontStretch: `${wdth}%`, fontVariationSettings: `'wdth' ${wdth}` }}>{up}</span>;
  if (mode === "stretch") {
    const st = R.stretch;
    scale = st.scaleFrom + (1 - st.scaleFrom) * expoOut(t / st.scaleTime);
    body = Array.from(up).map((ch, i) => {
      const tl = t - i * st.stagger;
      const q = tl < 0 ? 0 : ease("stretch", tl);
      const w = steps[Math.min(steps.length - 1, Math.floor(q * (steps.length - 1) + 1e-6))];
      const j = st.jitter * pulse(tl, st.jitterHalfLife);
      return (
        <span key={i} style={{ display: "inline-block", fontStretch: `${w}%`, fontVariationSettings: `'wdth' ${w}`, transform: `translate(${(rand(i * 7 + Math.floor(t * 30)) - 0.5) * 2 * j}px, ${(rand(i * 13 + Math.floor(t * 30)) - 0.5) * 2 * j}px)`, opacity: tl < 0 ? 0 : 1 }}>
          {ch}
        </span>
      );
    });
  }
  const p = invert ? ease("invert", t) : 1;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, right: align === "center" ? 0 : undefined, top: y - fs * 0.5, height: fs, textAlign: align, transform: `scale(${scale})`, transformOrigin: align === "center" ? "50% 50%" : "0 50%" }}>
      {invert ? (
        <span style={{ ...font, display: "inline-block", backgroundColor: C.block, color: C.field, padding: `${fs * 0.04}px ${fs * 0.14}px ${fs * 0.0}px`, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{body}</span>
      ) : (
        <span style={{ ...font, color: C.ink }}>{body}</span>
      )}
    </div>
  );
};

/** A thick ink chevron pointing down, for sequences. */
export const Chevron: React.FC<{ y: number; at: number; size?: number }> = ({ y, at, size = 70 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = R.slam.from + (1 - R.slam.from) * ease("slam", t);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${W / 2} ${y}) scale(${s})`}>
        <path d={`M ${-size} ${-size * 0.35} L 0 ${size * 0.35} L ${size} ${-size * 0.35}`} fill="none" stroke={C.ink} strokeWidth={size * 0.28} strokeLinejoin="miter" />
      </g>
    </svg>
  );
};

/** An ink band across the frame (the band split), wiping in from the left in 0.14 s. */
export const Band: React.FC<{ y: number; h: number; at: number }> = ({ y, h, at }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  return <div style={{ position: "absolute", left: 0, top: y, width: W, height: h, backgroundColor: C.block, clipPath: `inset(0 ${(1 - ease("band", t)) * 100}% 0 0)` }} />;
};

/** The shutter: ink closes from the top and the bottom toward the middle (ease-in-quart), leaving `gap` px open. */
export const Shutter: React.FC<{ at: number; gap: number; centre?: number; children?: React.ReactNode }> = ({ at, gap, centre = H / 2, children }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("shutter", t);
  const top = (centre - gap / 2) * p;
  const bottom = (H - centre - gap / 2) * p;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: top, backgroundColor: C.block }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: bottom, backgroundColor: C.block }} />
      {p >= 1 ? children : null}
    </>
  );
};

/** Corner furniture: the plate top-left, the word counter top-right, the spoken line strip, the readout bottom-right. */
export const Furniture: React.FC<{ plate: string; line: { text: string; at: number }[]; readout?: { label: string; from: number; to: number; digits: number; at: number; frac?: number }; dark?: boolean }> = ({
  plate,
  line,
  readout,
  dark = false,
}) => {
  const t = useSeconds();
  const f = L.furniture;
  const ink = dark ? C.bone : C.ink;
  const said = line.filter((w) => w.at <= t).length;
  const current = said - 1;
  const label: React.CSSProperties = { fontFamily: MONO, fontWeight: 600, fontSize: T.label, letterSpacing: `${T.labelTracking}em`, color: ink, opacity: 0.8, whiteSpace: "nowrap" };
  const r = readout ? ease("readout", t - readout.at) : 0;
  return (
    <>
      <div style={{ ...label, position: "absolute", left: f.x, top: f.top }}>{plate}</div>
      <div style={{ ...label, position: "absolute", right: f.x, top: f.top }}>{`WORD ${String(Math.max(0, said)).padStart(2, "0")} / ${String(line.length).padStart(2, "0")}`}</div>
      <div style={{ position: "absolute", left: f.x, top: f.strip, width: COLUMN * 0.66, fontFamily: MONO, fontWeight: 500, fontSize: T.strip, lineHeight: 1.6, color: ink }}>
        {line.map((w, i) => (
          <React.Fragment key={i}>
            <span style={{ whiteSpace: "nowrap", opacity: i < current ? 0.7 : i === current ? 1 : 0.32, backgroundColor: i === current ? C.block : undefined, color: i === current ? (dark ? C.bone : C.field) : undefined, padding: i === current ? "2px 8px" : undefined }}>{w.text.toUpperCase()}</span>{" "}
          </React.Fragment>
        ))}
      </div>
      {readout ? (
        <div style={{ position: "absolute", right: f.x, top: f.readout, width: L.readoutBar, textAlign: "right" }}>
          <div style={label}>{readout.label}</div>
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: T.readout, color: ink, lineHeight: 1.2 }}>{(readout.from + (readout.to - readout.from) * r).toFixed(readout.digits)}</div>
          <svg width={L.readoutBar} height={16} style={{ display: "block" }}>
            {Array.from({ length: 23 }, (_, i) => (
              <line key={i} x1={(i * L.readoutBar) / 22} y1={i % 5 === 0 ? 0 : 5} x2={(i * L.readoutBar) / 22} y2={12} stroke={rgba(ink, 0.6)} strokeWidth={1.4} />
            ))}
            <rect x={0} y={13} width={L.readoutBar * clamp((readout.frac ?? 1) * r)} height={3} fill={ink} />
          </svg>
        </div>
      ) : null}
    </>
  );
};
