/** Red Card Kinetic's pieces: the red and white grid cards, words with the seven entrances, arcs, chips, UI panels
 * and the liquid-ink wipe. Every value comes from style.json. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, rgba, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { CONDENSED, DISPLAY, FACES, MONO } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const COLUMN = W - 2 * M;
export const C = {
  bg: color(style.palette, "background"),
  surface: color(style.palette, "surface"),
  text: color(style.palette, "text"),
  muted: color(style.palette, "muted"),
  faint: color(style.palette, "faint"),
  accent: color(style.palette, "accent"),
  shadow: color(style.palette, "accent2"),
  centre: color(style.palette, "cardCentre"),
  white: color(style.palette, "whiteCard"),
  whiteEdge: color(style.palette, "whiteCardEdge"),
};
const R = style.motion.recipes;
const recipe = (name: keyof typeof R) => R[name] as unknown as Recipe;
export const ease = (name: keyof typeof R, t: number): number => run(recipe(name), t);
const T = style.type;
const F = style.finish;

/** Deterministic 0..1 noise from an integer seed. */
const rand = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const gridLayer = (size: number, col: string): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(to right, ${rgba(col, F.gridAlpha)} ${F.gridWidth}px, transparent ${F.gridWidth}px), linear-gradient(to bottom, ${rgba(col, F.gridAlpha)} ${F.gridWidth}px, transparent ${F.gridWidth}px)`,
  backgroundSize: `${size}px ${size}px`,
  backgroundPosition: `${(W / 2) % size}px ${(H / 2) % size}px`,
});

/** The card itself: a radial gradient with a faint grid (red, or the white breather card). */
export const CardFace: React.FC<{ variant?: "red" | "white" }> = ({ variant = "red" }) =>
  variant === "red" ? (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 62% at 50% 46%, ${C.centre} 0%, ${C.bg} 52%, ${C.faint} 100%)` }}>
      <div style={gridLayer(F.grid, C.faint)} />
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 62% at 50% 46%, ${C.white} 0%, ${C.white} 30%, ${C.whiteEdge} 100%)` }}>
      <div style={gridLayer(F.gridWhite, C.whiteEdge)} />
    </AbsoluteFill>
  );

/** A card with the style's finish; waits for the fonts. */
export const Card: React.FC<{ variant?: "red" | "white"; children: React.ReactNode }> = ({ variant = "red", children }) => {
  useFontsReady(FACES);
  return (
    <AbsoluteFill style={{ backgroundColor: variant === "red" ? C.bg : C.white, overflow: "hidden" }}>
      <CardFace variant={variant} />
      {children}
      <Finish grain={F.grain} vignette={F.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

export type Move = "swing" | "pop" | "stretch" | "slam" | "slide" | "fade" | "drop" | "none";
export type Effect = "soft" | "sticker" | "slam" | "none";

const softShadow = (size: number) => `0 ${0.03 * size}px ${0.09 * size}px rgba(0,0,0,${F.softShadow})`;
const slamShadow = (size: number) => `${T.slamShadow * size}px ${T.slamShadow * size}px 0 ${C.shadow}`;

/** Where the glyphs sit around a Word's centre y, in em: ascender top and baseline (measured on the renders). */
const METRICS = { display: { top: -0.41, base: 0.35 }, condensed: { top: -0.35, base: 0.53 } };
export type Line = { size: number; face?: "display" | "condensed"; gap?: number };

/**
 * A stack of lines that nearly touch: same-size lines sit at leading 0.85 (0.09 em from one baseline to the next
 * ascender top), mixed sizes keep that gap at the bigger size. Returns each line's centre y and the last baseline.
 * `centre` places the whole stack so its glyphs are centred on that y instead of starting at `top`.
 */
export const stack = (lines: Line[], at: { top?: number; centre?: number }): { ys: number[]; bottom: number } => {
  const gapEm = T.leading - (METRICS.display.base - METRICS.display.top);
  const place = (top: number) => {
    let y = top;
    let prev = 0;
    let prevFace = "display";
    const ys = lines.map((l) => {
      const face = l.face ?? "display";
      const m = METRICS[face];
      // a Six Caps word under a Poppins word clears the Poppins descenders (0.3 em of the word above, 0.14 em of its own)
      if (prev) y += l.gap !== undefined ? l.gap * Math.max(prev, l.size) : face === "condensed" && prevFace === "display" ? Math.max(0.3 * prev, 0.14 * l.size) : gapEm * Math.max(prev, l.size);
      const c = y - m.top * l.size;
      y = c + m.base * l.size;
      prev = l.size;
      prevFace = face;
      return c;
    });
    return { ys, bottom: y };
  };
  if (at.centre === undefined) return place(at.top ?? S.layout.stackY);
  const probe = place(0);
  return place(at.centre - probe.bottom / 2);
};

/**
 * One word or phrase, centred on (x, y), entering with one of the named moves at `at` seconds.
 * face "display" is Poppins Black lowercase; "condensed" is Six Caps uppercase thickened by a same-colour outline.
 */
export const Word: React.FC<{
  text: string;
  size: number;
  y: number;
  x?: number;
  at?: number;
  move?: Move;
  dir?: 1 | -1;
  face?: "display" | "condensed";
  weight?: number;
  fill?: string;
  effect?: Effect;
  blur?: number;
  seed?: number;
}> = ({ text, size, y, x = W / 2, at = 0, move = "slam", dir = -1, face = "display", weight = 900, fill = C.text, effect = "soft", blur = 0, seed = 1 }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const condensed = face === "condensed";
  let transform = "";
  let opacity = 1;
  let spacing = condensed ? T.condensedTracking : T.tracking;
  if (move === "swing") {
    const p = ease("swing", t);
    const q = 1 - p;
    transform = `perspective(1600px) translateX(${q * R.swing.x * dir}px) translateZ(${q * R.swing.z}px) rotateY(${q * R.swing.rotateY * -dir}deg) rotateZ(${q * R.swing.rotateZ * dir}deg)`;
    spacing += R.swing.spacing * 4 * clamp(p) * (1 - clamp(p));
    opacity = clamp(t / 0.1);
  } else if (move === "stretch") {
    const p = ease("stretch", t);
    transform = `scaleX(${R.stretch.from + (1 - R.stretch.from) * p})`;
  } else if (move === "slam") {
    transform = `scale(${Math.max(0, ease("slam", t))})`;
  } else if (move === "slide") {
    const p = ease("slide", t);
    transform = `translateX(${(1 - p) * R.slide.distance * dir}px) rotate(${(1 - p) * R.slide.tilt * dir}deg)`;
    opacity = clamp(t / R.slide.opacity);
  } else if (move === "fade") {
    const p = ease("fade", t);
    opacity = p;
    transform = `scale(${R.fade.scale + (1 - R.fade.scale) * p})`;
  } else if (move === "drop") {
    transform = `translateY(${-(1 - ease("drop", t)) * R.drop.distance}px)`;
  }
  const shadow = effect === "soft" ? softShadow(size) : effect === "slam" ? slamShadow(size) : "none";
  const base: React.CSSProperties = {
    fontFamily: condensed ? CONDENSED : DISPLAY,
    fontWeight: condensed ? 400 : weight,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: `${spacing}em`,
    textTransform: condensed ? "uppercase" : "lowercase",
    whiteSpace: "nowrap",
  };
  const letters = Array.from(text);
  // pop: letters land one frame apart in a random order, with a vertical jitter that settles
  const order = letters.map((_, i) => i).sort((a, b) => rand(seed * 31 + a) - rand(seed * 31 + b));
  const body = (stroke: boolean) =>
    move === "pop"
      ? letters.map((ch, i) => {
          const k = order.indexOf(i);
          const tl = t - k * R.pop.stagger;
          const s = tl > 0 ? Math.max(0, ease("pop", tl)) : 0;
          const jit = R.pop.jitter * size * (rand(seed * 7 + i) - 0.5) * 2 * (1 - clamp(tl / R.pop.settle));
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${jit}px) scale(${s})`, opacity: tl > 0 ? 1 : 0 }}>
              {ch}
            </span>
          );
        })
      : text;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div style={{ position: "relative", transform, transformOrigin: "50% 60%" }}>
        {effect === "sticker" ? (
          <div aria-hidden style={{ ...base, position: "absolute", left: 0, top: 0, color: C.muted, WebkitTextStroke: `${T.stickerOutline * 2}px ${C.muted}` }}>
            {body(true)}
          </div>
        ) : null}
        <div
          style={{
            ...base,
            position: "relative",
            color: fill,
            textShadow: shadow,
            WebkitTextStroke: condensed ? `${T.condensedStroke}px ${fill}` : undefined,
          }}
        >
          {body(false)}
        </div>
      </div>
    </div>
  );
};

/** A word bent on an arc of radius `r` (r > 0 bends like a rainbow), sliding in with the arc slide-in. */
export const ArcWord: React.FC<{ id: string; text: string; size: number; y: number; r: number; at?: number; dir?: 1 | -1; fill?: string; weight?: number }> = ({
  id,
  text,
  size,
  y,
  r,
  at = 0,
  dir = 1,
  fill = C.text,
  weight = 900,
}) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const p = ease("slide", t);
  // y is the arc's apex (rainbow) or lowest point (smile); a letter at distance x gets angle x / r
  const a = Math.abs(r);
  const half = Math.min(1.2, (COLUMN * 0.62) / a);
  const cx = W / 2;
  const x0 = cx - a * Math.sin(half);
  const x1 = cx + a * Math.sin(half);
  const yEnd = r > 0 ? y + a * (1 - Math.cos(half)) : y - a * (1 - Math.cos(half));
  const d = `M ${x0} ${yEnd} A ${a} ${a} 0 0 ${r > 0 ? 1 : 0} ${x1} ${yEnd}`;
  return (
    <svg
      width={W}
      height={H}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        opacity: clamp(t / R.slide.opacity),
        transform: `translateX(${(1 - p) * R.slide.distance * dir}px) rotate(${(1 - p) * R.slide.tilt * dir}deg)`,
        transformOrigin: `${cx}px ${y}px`,
        filter: `drop-shadow(0 ${0.03 * size}px ${0.09 * size}px rgba(0,0,0,${F.softShadow}))`,
      }}
    >
      <defs>
        <path id={id} d={d} />
      </defs>
      <text fontFamily={DISPLAY} fontWeight={weight} fontSize={size} letterSpacing={`${T.tracking * size}px`} fill={fill} dominantBaseline="central">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text.toLowerCase()}
        </textPath>
      </text>
    </svg>
  );
};

/** A white "style chip": a pill with red Poppins Bold text that pops in. */
export const Chip: React.FC<{ text: string; y: number; x?: number; at?: number; n?: number; size?: number }> = ({ text, y, x = W / 2, at = 0, n, size = T.chip }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = Math.max(0, ease("pop", t));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: size * 0.5,
          padding: `${size * 0.42}px ${size * 0.9}px ${size * 0.42}px ${n ? size * 0.42 : size * 0.9}px`,
          borderRadius: 999,
          backgroundColor: C.text,
          boxShadow: `0 ${size * 0.15}px ${size * 0.45}px rgba(0,0,0,${F.softShadow})`,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: C.accent,
          whiteSpace: "nowrap",
        }}
      >
        {n ? (
          <span style={{ width: size * 1.5, height: size * 1.5, borderRadius: 999, backgroundColor: C.accent, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.85 }}>
            {n}
          </span>
        ) : null}
        <span style={{ paddingTop: size * 0.08 }}>{text.toLowerCase()}</span>
      </div>
    </div>
  );
};

/** A generic dark UI panel (no real app): window dots, a mono title, then its content. Pops in. */
export const Panel: React.FC<{ title: string; x: number; y: number; w: number; h: number; at?: number; children?: React.ReactNode }> = ({ title, x, y, w, h, at = 0, children }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = Math.max(0, ease("pop", t));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `scale(${s})`,
        transformOrigin: "50% 50%",
        borderRadius: 22,
        backgroundColor: C.surface,
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), inset 0 0 0 1.5px ${rgba(C.text, 0.08)}`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 26, top: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.muted, opacity: 0.6 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 110, top: 16, fontFamily: MONO, fontSize: T.label, color: C.muted }}>{title}</div>
      {children}
    </div>
  );
};

/** Mono text inside a panel. */
export const Mono: React.FC<{ text: string; x: number; y: number; size?: number; fill?: string }> = ({ text, x, y, size = T.label, fill = C.text }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: MONO, fontWeight: 500, fontSize: size, color: fill, whiteSpace: "nowrap" }}>{text}</div>
);

/**
 * The liquid-ink wipe: a red blob grows from the top-right corner (radius eased up to `radius` px), its edge wobbling,
 * four droplets running ahead of it. `children` is the card it reveals.
 */
export const InkWipe: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const t = useSeconds() - at;
  if (t <= 0) return null;
  const p = ease("wipe", t);
  const rad = p * R.wipe.radius;
  const ox = W;
  const oy = 0;
  const N = 90;
  const pts: string[] = [`${ox + 40}px ${oy - 40}px`];
  for (let i = 0; i <= N; i++) {
    const a = (Math.PI / 180) * (60 + (150 * i) / N);
    const n = 0.5 * Math.sin(5 * a + 7 * t) + 0.3 * Math.sin(11 * a - 5 * t + 1.3) + 0.2 * Math.sin(17 * a + 3 * t + 0.4);
    const r = rad * (1 + R.wipe.wobble * n);
    pts.push(`${(ox + r * Math.cos(a)).toFixed(1)}px ${(oy + r * Math.sin(a)).toFixed(1)}px`);
  }
  const drops = Array.from({ length: R.wipe.droplets }, (_, i) => {
    const a = (Math.PI / 180) * (98 + i * 23 + rand(i + 3) * 8);
    const d = rad * (1.08 + 0.07 * rand(i + 11)) + 30;
    return { x: ox + d * Math.cos(a), y: oy + d * Math.sin(a), r: 14 + 22 * rand(i + 5) };
  });
  return (
    <>
      <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : `polygon(${pts.join(", ")})` }}>{children}</AbsoluteFill>
      {p < 1 ? (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {drops.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={C.bg} />
          ))}
        </svg>
      ) : null}
    </>
  );
};
