/**
 * Navy & Gold Precision's pieces: the navy ground with its falloff, faint gold bloom, headlines that rise word by word,
 * gold text with a specular glint, tilted matte surfaces with a gold rim light, the mark, mono labels.
 * Every value comes from style.json.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, rgba, run, useFontsReady, useSeconds, words, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, MONO, SANS } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const C = {
  bg: color(style.palette, "background"),
  surface: color(style.palette, "surface"),
  surface2: color(style.palette, "surface2"),
  surface3: color(style.palette, "surface3"),
  text: color(style.palette, "text"),
  warm: color(style.palette, "warm"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  gold: color(style.palette, "accent"),
  goldHi: color(style.palette, "goldHighlight"),
  goldLo: color(style.palette, "goldDepth"),
  steel: color(style.palette, "accent2"),
};
const R = style.motion.recipes as unknown as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

/** Navy ground: a soft lighter centre falling off to navy-black, the finish on top; waits for the fonts. */
export const Ground: React.FC<{ children: React.ReactNode; glow?: [number, number] }> = ({ children, glow }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SANS, color: C.text }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 46%, ${rgba(C.surface3, 0.55)} 0%, ${rgba(C.bg, 0)} 100%)` }} />
      {glow ? <Bloom x={glow[0]} y={glow[1]} /> : null}
      {children}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** Faint ambient gold bloom behind a precious thing. */
export const Bloom: React.FC<{ x: number; y: number; r?: number; at?: number }> = ({ x, y, r = 360, at = 0 }) => {
  const p = ease("premium", useSeconds() - at);
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(C.gold, S.finish.bloom * p)} 0%, ${rgba(C.gold, 0)} 70%)` }} />;
};

/** A headline: words rise and settle with subtle stagger; *emphasis* is gold. */
export const Headline: React.FC<{ lines: string[]; size: number; y: number; at?: number; align?: "left" | "center"; col?: string }> = ({ lines, size, y, at = 0, align = "left", col = C.warm }) => {
  const t = useSeconds() - at;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : M,
        width: align === "center" ? W : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontSize: size,
        fontWeight: 600,
        lineHeight: S.type.leading,
        letterSpacing: `${S.type.tracking}em`,
        color: col,
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {words(line).map((w, wi) => {
            const p = ease("premium", t - i * S.motion.stagger);
            i += 1;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span style={{ display: "inline-block", opacity: clamp(p * 1.4), transform: `translateY(${(1 - p) * S.motion.rise}px)`, color: w.em ? C.gold : undefined }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Gold fill with a specular band that sweeps across once (`p` 0 → 1). */
export const goldFill = (p: number): React.CSSProperties => {
  const x = lerp(-40, 140, clamp(p));
  return {
    backgroundImage: `linear-gradient(105deg, ${C.goldLo} ${x - 60}%, ${C.gold} ${x - 25}%, ${C.goldHi} ${x}%, ${C.gold} ${x + 25}%, ${C.gold} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
};

/** Mono label: tracked caps, muted. */
export const Mono: React.FC<{ text: string; x?: number; y: number; at?: number; col?: string; size?: number; align?: "left" | "center" }> = ({ text, x = M, y, at = 0, col = C.muted, size = S.type.mono, align = "left" }) => {
  const p = ease("premium", useSeconds() - at);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        width: align === "center" ? W : undefined,
        textAlign: align,
        top: y - size * 0.8,
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: `${S.type.monoTracking}em`,
        textTransform: "uppercase",
        color: col,
        opacity: p,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/**
 * A matte dimensional surface, tilted like a macro product shot; it settles in (rises, un-tilts a little) and the
 * camera creeps closer over the scene. A gold rim light runs along its top edge.
 */
export const Surface: React.FC<{ x: number; y: number; w: number; h: number; at?: number; tilt?: number; children?: React.ReactNode }> = ({ x, y, w, h, at = 0, tilt = 1, children }) => {
  const t = useSeconds() - at;
  const p = ease("premium", t);
  const push = lerp(1, S.motion.pushScale, ease("push", t));
  const { x: rx, y: ry, perspective } = S.layout.tilt;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: clamp(p * 1.3),
        transform: `perspective(${perspective}px) translateY(${(1 - p) * 60}px) rotateX(${rx * tilt * (1.4 - 0.4 * p)}deg) rotateY(${ry * tilt}deg) scale(${push})`,
        transformOrigin: "50% 60%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: S.layout.radius,
          background: `linear-gradient(180deg, ${C.surface2} 0%, ${C.surface} 100%)`,
          boxShadow: S.finish.shadow,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1.5, background: `linear-gradient(90deg, ${rgba(C.gold, 0)} 5%, ${rgba(C.gold, S.finish.rim)} 50%, ${rgba(C.gold, 0)} 95%)` }} />
        {children}
      </div>
    </div>
  );
};

/** The video's own mark: a navy tile with a gold ring and dot (generic, no brand), revealed by a gold glint. */
export const Mark: React.FC<{ x: number; y: number; size?: number; at?: number }> = ({ x, y, size = 200, at = 0 }) => {
  const t = useSeconds() - at;
  const p = ease("premium", t);
  const g = ease("glint", t - 0.2);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: p, transform: `scale(${lerp(0.94, 1, p)})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.26, background: `linear-gradient(160deg, ${C.surface3}, ${C.surface})`, boxShadow: S.finish.shadow, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1.5, background: `linear-gradient(90deg, ${rgba(C.gold, 0)}, ${rgba(C.gold, 0.5)}, ${rgba(C.gold, 0)})` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, ${rgba(C.goldHi, 0)} ${lerp(-30, 130, g) - 12}%, ${rgba(C.goldHi, 0.22)} ${lerp(-30, 130, g)}%, ${rgba(C.goldHi, 0)} ${lerp(-30, 130, g) + 12}%)` }} />
      </div>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="ngp-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.goldHi} />
            <stop offset="0.55" stopColor={C.gold} />
            <stop offset="1" stopColor={C.goldLo} />
          </linearGradient>
        </defs>
        <circle cx={50} cy={50} r={24} fill="none" stroke="url(#ngp-gold)" strokeWidth={6} strokeDasharray={`${151 * clamp(g * 1.4)} 200`} transform="rotate(-90 50 50)" />
        <circle cx={50} cy={50} r={8} fill="url(#ngp-gold)" opacity={clamp((g - 0.4) * 3)} />
      </svg>
    </div>
  );
};

export { MONO, SANS };
