/**
 * Transit Map's pieces: a printed octilinear schematic on a sheet lying on a dark table, seen by a perspective camera
 * (tilt, heading, zoom in px per grid unit G) with shallow focus. The network is a metaphor (lines are wavelengths of
 * sunlight), drawn in G: lines 0.15 G with 0.34 G fillets and 0.2 G parallel spacing, white stops with coloured rings,
 * interchange capsules, terminus rings, a river with a tunnel, line bullets, callouts, a cartouche, glowing pen tips,
 * the you-are-here dot, and the cream-drum counter on an enamel plate. Every value comes from style.json.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, run, useFontsReady, useSeconds, type Recipe } from "../../kit";
import style from "../style.json";
import { FACE, FACES } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
const P = style.palette;
const c = (r: string) => color(P, r);
export const C = {
  table: c("background"),
  paper: c("surface"),
  ink: c("text"),
  grey: c("muted"),
  water: c("faint"),
  waterEdge: c("waterEdge"),
  waterLabel: c("waterLabel"),
  accent: c("accent"),
  navy: c("accent2"),
  plate: c("plate"),
  plate2: c("plate2"),
  drum: c("drum"),
  drumHi: c("drumHi"),
  plateLabel: c("plateLabel"),
  plateLabel2: c("plateLabel2"),
  plateUnit: c("plateUnit"),
};
export const LINE_COL: Record<number, string> = { 700: c("line700"), 620: c("line620"), 580: c("line580"), 530: c("line530"), 450: c("line450"), 400: c("line400") };
const LIGHT_LINES = [580, 530];
const R = style.motion.recipes;
export const ease = (name: keyof typeof R, t: number): number => run(R[name] as unknown as Recipe, t);
const T = style.type;
const E = style.elements;
const L = style.layout;
/** One grid unit in the sheet's own coordinates (px at the standard zoom). */
export const G = L.G;
export const SHEET = { w: L.sheet[0], h: L.sheet[1] };
const f = (n: number) => n.toFixed(2);
type Pt = [number, number];

/* ---------- the network (a metaphor: each line is a wavelength of sunlight) ---------- */

export const ST = {
  sun: [2, 3.6] as Pt,
  strato: [3.5, 5.1] as Pt,
  air: [5, 6.6] as Pt,
  zenith: [5, 2.8] as Pt,
  east: [8.3, 6.6] as Pt,
  west: [0.7, 6.6] as Pt,
  north: [7.6, 4.0] as Pt,
  eye: [2, 9.6] as Pt,
  sunset: [7, 14.0] as Pt,
};
export const RIVER = { y: 12.5 };
/** Lines: [nm, offset in G, points]. Offsets keep a bundle 0.2 G apart wherever lines run together. */
export const LINES: { nm: number; off: number; pts: Pt[]; at: number }[] = [
  { nm: 700, off: -0.5, pts: [ST.sun, ST.air, [5, 9.8], [7, 11.8], ST.sunset], at: 0 },
  { nm: 620, off: -0.3, pts: [ST.sun, ST.air, [5, 9.8], [7, 11.8], ST.sunset], at: 0.05 },
  { nm: 580, off: -0.1, pts: [ST.sun, ST.air, [5, 9.8], [7, 11.8], ST.sunset], at: 0.1 },
  { nm: 530, off: 0.1, pts: [ST.sun, ST.air, [5, 9.8], [7, 11.8], ST.sunset], at: 0.15 },
  { nm: 450, off: 0.3, pts: [ST.sun, ST.air, ST.eye], at: 0.2 },
  { nm: 400, off: 0.5, pts: [ST.sun, ST.air, ST.north], at: 0.25 },
];
/** Branches: blue (and violet) leave the air in every direction. */
export const BRANCHES: { nm: number; off: number; pts: Pt[]; at: number }[] = [
  { nm: 450, off: 0, pts: [ST.air, ST.zenith], at: 0.9 },
  { nm: 450, off: 0, pts: [ST.air, ST.east], at: 0.95 },
  { nm: 450, off: 0, pts: [ST.air, ST.west], at: 1.0 },
  { nm: 450, off: -0.1, pts: [ST.air, ST.north], at: 1.05 },
  { nm: 400, off: 0.2, pts: [ST.air, ST.west], at: 1.1 },
];

/** Offset a polyline by d (G) with mitred corners. */
const offset = (pts: Pt[], d: number): Pt[] => {
  if (!d) return pts;
  const nrm = (a: Pt, b: Pt): Pt => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  return pts.map((p, i) => {
    const n1 = i > 0 ? nrm(pts[i - 1], p) : nrm(p, pts[i + 1]);
    const n2 = i < pts.length - 1 ? nrm(p, pts[i + 1]) : n1;
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
    return [p[0] + ((n1[0] + n2[0]) / k) * d, p[1] + ((n1[1] + n2[1]) / k) * d];
  });
};

/** A path through the points with every corner rounded by one fillet radius, in sheet px. */
const filleted = (pts: Pt[], r = E.fillet): string => {
  let d = `M ${f(pts[0][0] * G)} ${f(pts[0][1] * G)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += ` L ${f((x - ((x - px) / l1) * k) * G)} ${f((y - ((y - py) / l1) * k) * G)} Q ${f(x * G)} ${f(y * G)} ${f((x + ((nx - x) / l2) * k) * G)} ${f((y + ((ny - y) / l2) * k) * G)}`;
  }
  const e = pts[pts.length - 1];
  return `${d} L ${f(e[0] * G)} ${f(e[1] * G)}`;
};

/** The point at fraction p along a polyline (G). */
const along = (pts: Pt[], p: number): Pt => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = segs.reduce((a, b) => a + b, 0) * clamp(p);
  for (let i = 0; i < segs.length; i++) {
    if (left <= segs[i]) {
      const k = segs[i] ? left / segs[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    left -= segs[i];
  }
  return pts[pts.length - 1];
};

/* ---------- the sheet ---------- */

/** Printed text on the sheet with a paper-coloured halo (0.05 G at 92%). Sizes in G. */
export const Label: React.FC<{ x: number; y: number; size: number; text: string; col?: string; weight?: number; anchor?: "start" | "middle" | "end"; grow?: number; caps?: boolean }> = ({
  x,
  y,
  size,
  text,
  col = C.ink,
  weight = 700,
  anchor = "start",
  grow = 1,
  caps = false,
}) => (
  <text
    x={x * G}
    y={y * G}
    textAnchor={anchor}
    fill={col}
    stroke={C.paper}
    strokeOpacity={0.92}
    strokeWidth={E.halo * 2 * G}
    strokeLinejoin="round"
    style={{ fontFamily: FACE, fontWeight: weight, fontSize: size * G * grow, paintOrder: "stroke", textTransform: caps ? "uppercase" : "none" }}
  >
    {text}
  </text>
);

export type MapProps = {
  /** seconds since the sample started (lines draw with pen tips, stops pop) */
  t: number;
  /** lines kept at full strength; the rest sit under a 60% paper veil */
  focus?: number[];
  /** label scale on pull-back: × (85 / zoom)^0.6, at most 1.75 */
  zoom?: number;
  extras?: React.ReactNode;
  here?: boolean;
  drawAt?: number;
};

/** The printed network. */
export const MapSheet: React.FC<MapProps> = ({ t, focus, zoom = G, extras, here = false, drawAt = 0 }) => {
  const grow = Math.min(1.75, Math.max(1, Math.pow(85 / zoom, 0.6)));
  const veiled = (nm: number) => (focus && !focus.includes(nm) ? 0.4 : 1);
  const lw = E.line * G;
  const draw = (pts: Pt[], at: number) => ease("pen", t - drawAt - at);
  const tipOf = (pts: Pt[], p: number, col: string, key: string) => {
    if (p <= 0 || p >= 1) return null;
    const [x, y] = along(pts, p);
    return (
      <g key={key}>
        <circle cx={x * G} cy={y * G} r={E.tip.halo * G} fill="url(#tm-halo)" />
        <circle cx={x * G} cy={y * G} r={E.tip.core * G} fill="#fff" stroke={col} strokeWidth={E.tip.ring * G} />
      </g>
    );
  };
  const all = [...LINES, ...BRANCHES];
  const pop = (at: number) => {
    const p = ease("pop", t - drawAt - at);
    return p <= 0 ? 0 : R.pop.from + (1 - R.pop.from) * p;
  };
  const stop = (p: Pt, col: string, at: number, key: string) => {
    const s = pop(at);
    return s > 0 ? <circle key={key} cx={p[0] * G} cy={p[1] * G} r={E.stop.r * G * s} fill="#fff" stroke={col} strokeWidth={E.stop.ring * G} /> : null;
  };
  const term = (p: Pt, at: number, key: string) => {
    const s = pop(at);
    return s > 0 ? <circle key={key} cx={p[0] * G} cy={p[1] * G} r={E.terminus.r * G * s} fill="#fff" stroke={C.ink} strokeWidth={E.terminus.outline * G} /> : null;
  };
  const capsule = (cx: number, cy: number, w: number, h: number, at: number, major: boolean, key: string) => {
    const s = pop(at);
    if (s <= 0) return null;
    const ww = (w + 2 * E.interchange.pad) * G * s;
    const hh = (h + 2 * E.interchange.pad) * G * s;
    return <rect key={key} x={cx * G - ww / 2} y={cy * G - hh / 2} width={ww} height={hh} rx={Math.min(ww, hh) * (w === h ? 0.3 : 0.5)} fill="#fff" stroke={C.ink} strokeWidth={(major ? E.interchange.major : E.interchange.outline) * G} />;
  };
  const tw = E.river.w;
  return (
    <g>
      <defs>
        <radialGradient id="tm-halo">
          <stop offset={0} stopColor="#fff" stopOpacity={E.tip.haloAlpha} />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* water: the river band with a darker edge, its name set along it */}
      <rect x={0} y={RIVER.y * G} width={SHEET.w * G} height={tw * G} fill={C.water} />
      <rect x={0} y={RIVER.y * G} width={SHEET.w * G} height={E.river.edge * G} fill={C.waterEdge} />
      <rect x={0} y={(RIVER.y + tw - E.river.edge) * G} width={SHEET.w * G} height={E.river.edge * G} fill={C.waterEdge} />
      <Label x={0.5} y={RIVER.y + 0.55} size={T.water} text="The sea" col={C.waterLabel} weight={600} />
      {/* lines, under a paper veil where they aren't in focus */}
      {all.map((l, i) => {
        const pts = offset(l.pts, l.off);
        const p = draw(pts, l.at);
        if (p <= 0) return null;
        const col = LINE_COL[l.nm];
        return (
          <g key={i} opacity={veiled(l.nm)}>
            <path d={filleted(pts)} fill="none" stroke={col} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
          </g>
        );
      })}
      {/* the long waves cross the sea in a tunnel: dashed, with two thin ink casings */}
      {draw(LINES[0].pts, 0) >= 1 ? (
        <g>
          <rect x={6.72 * G} y={(RIVER.y - 0.02) * G} width={0.96 * G} height={(tw + 0.04) * G} fill={C.water} />
          {LINES.slice(0, 4).map((l) => {
            const x = (7 - l.off) * G;
            return <line key={l.nm} x1={x} y1={(RIVER.y - 0.06) * G} x2={x} y2={(RIVER.y + tw + 0.06) * G} stroke={LINE_COL[l.nm]} strokeWidth={lw} strokeDasharray={`${E.tunnel.on * G} ${E.tunnel.off * G}`} opacity={veiled(l.nm)} />;
          })}
          {[6.9 - E.line / 2 - E.tunnel.gap, 7.5 + E.line / 2 + E.tunnel.gap].map((x, i) => (
            <line key={i} x1={x * G} y1={(RIVER.y - 0.06) * G} x2={x * G} y2={(RIVER.y + tw + 0.06) * G} stroke={C.ink} strokeOpacity={E.tunnel.alpha} strokeWidth={E.tunnel.casing * G} />
          ))}
        </g>
      ) : null}
      {/* stations */}
      {capsule(ST.sun[0], ST.sun[1], 0.7, 0.7, 0.05, true, "c-sun")}
      {capsule(ST.strato[0], ST.strato[1], 0.7, 0.7, 0.5, false, "c-strato")}
      {capsule(ST.air[0], ST.air[1], 0.8, 0.8, 0.85, true, "c-air")}
      {capsule(ST.sunset[0] + 0.2, ST.sunset[1], 0.6, 0.15, 1.5, true, "c-sunset")}
      {stop([5.3, 9.2], LINE_COL[620], 1.2, "s-low")}
      {stop(along(offset([ST.air, ST.eye], 0.3), 0.5), LINE_COL[450], 1.3, "s-mid")}
      {term(ST.zenith, 1.4, "t-zen")}
      {term(ST.east, 1.45, "t-east")}
      {term(ST.west, 1.5, "t-west")}
      {term(ST.north, 1.5, "t-north")}
      {term(offset([ST.air, ST.eye], 0.3)[1], 1.55, "t-eye")}
      {/* pen tips while the lines are being drawn */}
      {all.map((l, i) => tipOf(offset(l.pts, l.off), draw(offset(l.pts, l.off), l.at), LINE_COL[l.nm], `tip${i}`))}
      {/* labels, placed once against the finished network */}
      {pop(1.6) > 0 ? (
        <g>
          <Label x={ST.sun[0] - 0.6} y={ST.sun[1] + 0.12} size={T.hub} text="SUN" anchor="end" grow={grow} />
          <Label x={ST.strato[0] - 0.58} y={ST.strato[1] + 0.1} size={T.interchange} text="Stratosphere" anchor="end" grow={grow} />
          <Label x={ST.zenith[0] + 0.32} y={ST.zenith[1] + 0.1} size={T.stop} text="Zenith" grow={grow} />
          <Label x={ST.east[0] + 0.2} y={ST.east[1] - 0.32} size={T.stop} text="East sky" anchor="end" grow={grow} />
          <Label x={ST.west[0] - 0.3} y={ST.west[1] + 0.6} size={T.stop} text="West sky" grow={grow} />
          <Label x={ST.north[0]} y={ST.north[1] - 0.34} size={T.stop} text="North sky" anchor="middle" grow={grow} />
          <Label x={ST.eye[0] - 0.05} y={ST.eye[1] + 0.62} size={T.interchange} text="Your eye" anchor="middle" grow={grow} />
          <Label x={ST.sunset[0] - 0.55} y={ST.sunset[1] + 0.1} size={T.interchange} text="Sunset" anchor="end" grow={grow} />
          <Label x={5.75} y={9.3} size={T.note} text="Haze" weight={600} col={C.grey} grow={grow} />
          <Label x={4.78} y={7.72} size={T.hub} text="AIR" anchor="end" grow={grow} />
        </g>
      ) : null}
      {here ? <Here p={[ST.eye[0] - 0.21, ST.eye[1] - 0.21]} t={t - drawAt - 1.7} /> : null}
      {extras}
    </g>
  );
};

/** The you-are-here dot: r 0.17 G in the accent with a 0.04 G white outline and a pulsing ring. */
const Here: React.FC<{ p: Pt; t: number }> = ({ p, t }) => {
  if (t <= 0) return null;
  const ring = (t % 1.2) / 1.2;
  return (
    <g>
      <circle cx={p[0] * G} cy={p[1] * G} r={(E.here.r + 0.5 * ring) * G} fill="none" stroke={C.accent} strokeWidth={0.03 * G} opacity={1 - ring} />
      <circle cx={p[0] * G} cy={p[1] * G} r={E.here.r * G} fill={C.accent} stroke="#fff" strokeWidth={E.here.outline * G} />
    </g>
  );
};

/** A line bullet: a disc r 0.3 G in the line colour with its wavelength (ink inside light lines, white in deep ones). */
export const Bullet: React.FC<{ nm: number; x: number; y: number; t: number; at: number }> = ({ nm, x, y, t, at }) => {
  const p = ease("pop", t - at);
  if (p <= 0) return null;
  const r = E.bullet * G * (R.pop.from + (1 - R.pop.from) * p);
  return (
    <g>
      <circle cx={x * G} cy={y * G} r={r} fill={LINE_COL[nm]} />
      <text x={x * G} y={(y + 0.075) * G} textAnchor="middle" fill={LIGHT_LINES.includes(nm) ? C.ink : "#fff"} style={{ fontFamily: FACE, fontWeight: 800, fontSize: T.bullet * G }}>
        {nm}
      </text>
    </g>
  );
};

/** A callout: an accent bar 0.10 G wide, a heavy figure, a line and a note; it wipes on from its bar. */
export const Callout: React.FC<{ x: number; y: number; t: number; at: number; big: string; line: string; note?: string; bar?: string; w?: number }> = ({ x, y, t, at, big, line, note, bar = C.accent, w = 3.2 }) => {
  const p = ease("callout", t - at);
  if (p <= 0) return null;
  const h = note ? 1.55 : 1.2;
  return (
    <g>
      <clipPath id={`tm-co-${Math.round(x * 10)}-${Math.round(y * 10)}`}>
        <rect x={x * G} y={(y - 0.1) * G} width={w * G * p} height={(h + 0.2) * G} />
      </clipPath>
      <g clipPath={`url(#tm-co-${Math.round(x * 10)}-${Math.round(y * 10)})`}>
        <rect x={(x - 0.08) * G} y={(y - 0.08) * G} width={(w + 0.16) * G} height={(h + 0.16) * G} fill={C.paper} opacity={0.94} />
        <rect x={x * G} y={y * G} width={E.callout.bar * G} height={h * G} fill={bar} />
        <Label x={x + 0.25} y={y + 0.6} size={T.callout} text={big} weight={800} />
        <Label x={x + 0.25} y={y + 1.0} size={T.calloutLine} text={line} />
        {note ? <Label x={x + 0.25} y={y + 1.38} size={T.calloutNote} text={note} col={C.grey} weight={600} /> : null}
      </g>
    </g>
  );
};

/** The sheet's paper: a value cloud (~9 G) and a tooth (~2.4 G) at a few percent, raking light from the north-west. */
const PaperTex: React.FC = React.memo(() => (
  <>
    <defs>
      <filter id="tm-cloud" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={1 / (9 * G)} numOctaves={4} seed={3} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.36  1.6 0 0 0 -0.62" />
      </filter>
      <filter id="tm-tooth" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={1 / (0.05 * G)} numOctaves={2} seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.47  0 0 0 0 0.42  1.4 0 0 0 -0.55" />
      </filter>
      <linearGradient id="tm-rake" x1="0" y1="0" x2="1" y2="1">
        <stop offset={0} stopColor="#fff" stopOpacity={E.paper.light} />
        <stop offset={0.5} stopColor="#fff" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={SHEET.w * G} height={SHEET.h * G} fill={C.paper} />
    <rect width={SHEET.w * G} height={SHEET.h * G} filter="url(#tm-cloud)" opacity={E.paper.cloud * 6} />
  </>
));
const PaperTop: React.FC = React.memo(() => (
  <>
    <rect width={SHEET.w * G} height={SHEET.h * G} filter="url(#tm-tooth)" opacity={E.paper.tooth} style={{ mixBlendMode: "multiply" }} />
    <rect width={SHEET.w * G} height={SHEET.h * G} fill="url(#tm-rake)" />
  </>
));

/**
 * The camera: a pinhole with 32° vertical field of view looking at the sheet on the table. `aim` (G) goes to the
 * frame's aim point, `zoom` is px per G there, `tilt` leans the sheet away from straight down, `heading` turns it, and
 * `aperture` blurs what is away from the focus band (capped at 26 px). Waits for the fonts.
 */
export const Camera: React.FC<{ aim: Pt; zoom: number; tilt?: number; heading?: number; aperture?: number; children: (sharp: boolean) => React.ReactNode; over?: React.ReactNode }> = ({
  aim,
  zoom,
  tilt = 0,
  heading = 0,
  aperture = 0,
  children,
  over,
}) => {
  useFontsReady(FACES);
  const persp = H / 2 / Math.tan(((E.fov / 2) * Math.PI) / 180);
  const sw = SHEET.w * zoom;
  const sh = SHEET.h * zoom;
  const left = W / 2 - aim[0] * zoom;
  const top = L.aimY - aim[1] * zoom;
  const blur = Math.min(E.maxBlur, aperture);
  const focusY = (aim[1] / SHEET.h) * 100;
  const band = (2.2 / SHEET.h) * 100;
  const mask = `linear-gradient(to bottom, transparent ${focusY - band * 2.2}%, #000 ${focusY - band}%, #000 ${focusY + band}%, transparent ${focusY + band * 2.2}%)`;
  const sheet = (sharp: boolean) => (
    <svg width={sw} height={sh} viewBox={`0 0 ${SHEET.w * G} ${SHEET.h * G}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <PaperTex />
      {children(sharp)}
      <PaperTop />
    </svg>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.table, overflow: "hidden", perspective: `${persp}px`, perspectiveOrigin: `50% ${(L.aimY / H) * 100}%` }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: sw,
          height: sh,
          transformOrigin: `${aim[0] * zoom}px ${aim[1] * zoom}px`,
          transform: `rotateX(${tilt}deg) rotateZ(${heading}deg)`,
          boxShadow: `0 0 ${0.2 * zoom}px rgba(0,0,0,0.6)`,
        }}
      >
        {blur > 0 ? (
          <>
            <div style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)` }}>{sheet(false)}</div>
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>{sheet(true)}</div>
          </>
        ) : (
          sheet(true)
        )}
      </div>
      {over}
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The counter: a dark enamel plate with four screws; cream drums roll and land only on sourced values. */
export const Counter: React.FC<{ label: string; label2: string; value: string; unit: string; at: number; x?: number; y?: number }> = ({ label, label2, value, unit, at, x = L.counter.x, y = L.counter.y }) => {
  const t = useSeconds() - at;
  const cw = L.counter.w;
  const row = L.counter.row;
  const dh = 118;
  const dw = 90;
  const chars = Array.from(value);
  const digitsW = chars.length * (dw + 6);
  const screws = useMemo(() => [[14, 14], [cw - 14, 14], [14, row + dh + 26], [cw - 14, row + dh + 26]], [cw, row]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: cw, height: row + dh + 40, backgroundColor: C.plate, borderRadius: L.counter.radius, boxShadow: `inset 0 0 0 3px ${C.plate2}, 0 10px 30px rgba(0,0,0,0.5)` }}>
      {screws.map(([sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: sx - 6, top: sy - 6, width: 12, height: 12, borderRadius: 6, backgroundColor: C.plate2, boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)" }} />
      ))}
      <div style={{ position: "absolute", left: 32, top: 22, fontFamily: FACE, fontWeight: 700, fontSize: T.counterLabel, letterSpacing: 1.5, color: C.plateLabel }}>{label}</div>
      <div style={{ position: "absolute", left: 32, top: 58, fontFamily: FACE, fontWeight: 600, fontSize: T.counterLabel2, letterSpacing: 1, color: C.plateLabel2 }}>{label2}</div>
      <div style={{ position: "absolute", left: 32, top: row + 6, display: "flex", gap: 6, alignItems: "center" }}>
        {chars.map((ch, i) => {
          const isDigit = /\d/.test(ch);
          if (!isDigit) return <div key={i} style={{ width: dw * 0.4, fontFamily: FACE, fontWeight: 800, fontSize: dh * 0.7, color: C.drum, textAlign: "center" }}>{ch}</div>;
          const target = Number(ch);
          const p = ease("drum", t - i * 0.15);
          const spins = 2;
          const pos = (spins * 10 + target) * clamp(p);
          const spinning = p > 0 && p < 1;
          return (
            <div key={i} style={{ width: dw, height: dh, overflow: "hidden", borderRadius: 6, backgroundColor: C.drum, boxShadow: `inset 0 ${dh * 0.35}px ${dh * 0.25}px -${dh * 0.25}px ${C.drumHi}, inset 0 -8px 10px rgba(0,0,0,0.25)` }}>
              <div style={{ transform: `translateY(${-(pos % 10) * dh}px)`, filter: spinning ? "blur(2px)" : undefined }}>
                {Array.from({ length: 11 }, (_, k) => (
                  <div key={k} style={{ height: dh, lineHeight: `${dh}px`, textAlign: "center", fontFamily: FACE, fontWeight: 800, fontSize: dh * 0.7, color: C.ink }}>
                    {k % 10}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ marginLeft: 10, fontFamily: FACE, fontWeight: 800, fontSize: dh * 0.62, color: C.plateUnit }}>{unit}</div>
      </div>
      <div style={{ position: "absolute", left: 32 + digitsW + 90, top: row + dh * 0.5 + 12, fontFamily: FACE, fontWeight: 600, fontSize: T.counterLabel2, color: C.plateLabel2, whiteSpace: "nowrap" }}>blue 450 nm ÷ red 700 nm</div>
    </div>
  );
};
