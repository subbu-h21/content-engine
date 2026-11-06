/** Blueprint's pieces: cyanotype paper, weighted lines drawn on with a nib, hatching, dimensions, balloons, notes, title block, stamp. Values come from style.json. */
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, color, Finish, lerp, mix, plain, rgba, run, seeded, useFontsReady, useSeconds, useUid, type Recipe } from "../../kit";
import style from "../style.json";
import { FACES, FIELD, LETTER } from "./fonts";

export const S = style;
export const W = style.frame.width;
export const H = style.frame.height;
export const M = style.layout.margin;
export const E = style.elements;
export const O = E.order;
const P = style.palette;
export const C = {
  low: color(P, "background"),
  high: color(P, "surface"),
  line: color(P, "text"),
  muted: color(P, "muted"),
  faint: color(P, "faint"),
  stamp: color(P, "accent"),
  bleach: color(P, "accent2"),
  note: color(P, "note"),
  table: color(P, "table"),
};
const R = style.motion.recipes as Record<string, Recipe>;
export const ease = (name: keyof typeof style.motion.recipes, t: number): number => run(R[name], t);

export type Pt = [number, number];
type Weight = keyof typeof E.lines;
type Dash = keyof typeof E.dash;

/** Screen width = sheet width × zoom^0.65, so close-ups don't turn into sausages. */
const ZK = Math.pow(E.zoom, 0.65);
export const lw = (k: Weight): number => E.lines[k] * ZK;
const dashOf = (k?: Dash): string | undefined => (k ? E.dash[k].map((v) => (v * ZK).toFixed(1)).join(" ") : undefined);

export const Art: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

export const path = (pts: Pt[], close = false): string => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}${close ? "Z" : ""}`;
export const arc = (cx: number, cy: number, r: number, a0 = 0, a1 = Math.PI * 2, n = 72): Pt[] => Array.from({ length: n + 1 }, (_, i): Pt => {
  const a = a0 + ((a1 - a0) * i) / n;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
export const rect = (x: number, y: number, w: number, h: number): Pt[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

/** The first `p` of a polyline, by arc length. */
const truncate = (pts: Pt[], p: number): Pt[] => {
  if (p >= 1) return pts;
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * clamp(p);
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (seg[i] <= 0) continue;
    if (left >= seg[i]) {
      out.push(pts[i + 1]);
      left -= seg[i];
    } else {
      const k = left / seg[i];
      out.push([lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]);
      break;
    }
  }
  return out;
};

/** The small white nib at the head of a line that is being drawn. */
const Nib: React.FC<{ at: Pt; r: number }> = ({ at: [x, y], r }) => (
  <>
    <circle cx={x} cy={y} r={r * 2.6} fill={C.line} opacity={0.22} />
    <circle cx={x} cy={y} r={r} fill={C.line} />
  </>
);

/** One drawn line. `paper` fills the shape first, so it hides what's behind it (painter's order). */
export const Line: React.FC<{ pts: Pt[]; w?: Weight; dash?: Dash; at?: number; paper?: boolean; close?: boolean }> = ({ pts, w = "detail", dash, at = 0, paper = false, close = false }) => {
  const p = ease("draw", useSeconds() - at);
  if (p <= 0) return null;
  const part = truncate(pts, p);
  return (
    <>
      {paper ? <path d={path(pts, true)} fill={C.low} opacity={p} /> : null}
      <path d={path(part, close && p >= 1)} fill="none" stroke={C.line} strokeWidth={lw(w)} strokeDasharray={dashOf(dash)} strokeLinecap={dash ? "butt" : "round"} strokeLinejoin="round" />
      {p < 1 ? <Nib at={part[part.length - 1]} r={lw(w) * 0.9} /> : null}
    </>
  );
};

/** Solid arrowhead pointing along `dir`. */
export const Arrow: React.FC<{ tip: Pt; dir: Pt; size?: number; opacity?: number }> = ({ tip: [x, y], dir: [dx, dy], size = E.arrow, opacity = 1 }) => {
  const l = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / l, dy / l];
  const [bx, by] = [x - ux * size, y - uy * size];
  const k = size * 0.26;
  return <path d={path([[x, y], [bx - uy * k, by + ux * k], [bx + uy * k, by - ux * k]], true)} fill={C.line} opacity={opacity} />;
};

/** 45° hatching inside a shape, laid stroke by stroke. */
export const Hatch: React.FC<{ shape: Pt[]; at?: number; spacing?: number }> = ({ shape, at = O.hatch, spacing = E.hatch }) => {
  const uid = useUid("hatch");
  const p = ease("hatch", useSeconds() - at);
  if (p <= 0) return null;
  const xs = shape.map((q) => q[0]);
  const ys = shape.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const h = y1 - y0;
  const step = spacing * Math.SQRT2;
  const n = Math.ceil((x1 - x0 + h) / step);
  const shown = Math.ceil(n * p);
  return (
    <>
      <defs>
        <clipPath id={uid}>
          <path d={path(shape, true)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid})`} stroke={C.line} strokeWidth={lw("hair")}>
        {Array.from({ length: shown }, (_, i) => {
          const x = x0 - h + i * step;
          return <line key={i} x1={x} y1={y1} x2={x + h} y2={y0} />;
        })}
      </g>
    </>
  );
};

/** Lettering written on left to right. */
export const Letter: React.FC<{ text: string; x: number; y: number; size?: number; at?: number; col?: string; font?: string; bold?: boolean; spacing?: number; center?: boolean }> = ({ text, x, y, size = style.type.body, at = 0, col = C.line, font = LETTER, bold = false, spacing = 0, center = false }) => {
  const p = ease("letter", useSeconds() - at);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: font,
        fontWeight: bold ? 700 : 400,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: spacing,
        color: col,
        whiteSpace: "nowrap",
        transform: center ? "translateX(-50%)" : undefined,
        clipPath: `inset(-30% ${((1 - p) * 102).toFixed(1)}% -30% -3%)`,
      }}
    >
      {text}
    </div>
  );
};

export const Field: React.FC<{ text: string; x: number; y: number; at?: number; col?: string; bold?: boolean; size?: number; center?: boolean }> = ({ text, x, y, at, col = C.line, bold, size = style.type.field, center }) => (
  <Letter text={text.toUpperCase()} x={x} y={y} size={size} at={at} col={col} font={FIELD} bold={bold} spacing={1} center={center} />
);

/** Fig. line at the top of a shot. `was` is the old number, struck through and rewritten. */
export const Fig: React.FC<{ n: number; title: string; was?: number }> = ({ n, title, was }) => {
  const y = S.layout.figY;
  const size = style.type.eyebrow;
  const x = was ? M + 150 : M;
  return (
    <>
      {was ? <Letter text={`FIG. ${was}`} x={M} y={y} size={size} font={FIELD} bold col={C.muted} at={0.05} /> : null}
      {was ? (
        <Art>
          <Line pts={[[M - 8, y + size * 0.62], [M + 122, y + size * 0.5]]} w="outline" at={0.3} />
        </Art>
      ) : null}
      <Letter text={`FIG. ${n}  ·  ${title.toUpperCase()}`} x={x} y={y} size={size} font={FIELD} bold spacing={style.type.eyebrowTracking} at={was ? 0.5 : 0.05} />
    </>
  );
};

/** Revision cloud: outward scallops round a rectangle, clockwise. */
export const Cloud: React.FC<{ x: number; y: number; w: number; h: number; at?: number }> = ({ x, y, w, h, at = 0 }) => {
  const s = E.cloud;
  const corners = rect(x, y, w, h);
  const pts: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const [a, b] = [corners[i], corners[i + 1]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(1, Math.round(len / s));
    const [nx, ny] = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len];
    for (let k = 0; k < n; k++) {
      for (let j = 0; j < 8; j++) {
        const u = (k + j / 8) / n;
        const bulge = Math.sin((j / 8) * Math.PI) * s * 0.36;
        pts.push([lerp(a[0], b[0], u) + nx * bulge, lerp(a[1], b[1], u) + ny * bulge]);
      }
    }
  }
  pts.push(pts[0]);
  return <Line pts={pts} w="detail" at={at} />;
};

/** Estimated width of capitals: most letters are wide, I and punctuation narrow. */
const capsWidth = (text: string, size: number): number => [...text].reduce((w, c) => w + (/[I.,:;!' ]/.test(c) ? style.type.narrowEm : style.type.capEm), 0) * size;

/** Sheet header lettering, tracked capitals with a double underline; an emphasised line gets a revision cloud. */
export const Header: React.FC<{ lines: string[]; size: number; y: number; at?: number; x?: number; rule?: boolean }> = ({ lines, size, y, at = 0, x = M, rule = true }) => {
  const lh = size * style.type.leading;
  const per = 0.3;
  const widest = Math.max(...lines.map((l) => capsWidth(plain(l).toUpperCase(), size)));
  return (
    <>
      {lines.map((line, i) => {
        const em = line.includes("*");
        const text = plain(line).toUpperCase();
        const ly = y + i * lh;
        const w = capsWidth(text, size);
        return (
          <React.Fragment key={i}>
            <Letter text={text} x={x + (em ? 22 : 0)} y={ly} size={size} spacing={style.type.tracking} at={at + i * per} />
            {em ? (
              <Art>
                <Cloud x={x} y={ly - size * 0.02} w={w + 44} h={size * 1.14} at={at + lines.length * per + 0.15} />
              </Art>
            ) : null}
          </React.Fragment>
        );
      })}
      {rule ? (
        <Art>
          <Line pts={[[x, y + lines.length * lh + 34], [x + widest + 44, y + lines.length * lh + 34]]} w="outline" at={at + lines.length * per + 0.1} />
          <Line pts={[[x, y + lines.length * lh + 46], [x + widest + 44, y + lines.length * lh + 46]]} w="thin" at={at + lines.length * per + 0.2} />
        </Art>
      ) : null}
    </>
  );
};

/** A dimension line between two points: extension lines, the line, arrowheads, then its label above or beside it. */
export const Dim: React.FC<{ a: Pt; b: Pt; off: number; label: string; at?: number; size?: number; labelOff?: number }> = ({ a, b, off, label, at = O.dims, size = style.type.label, labelOff }) => {
  const t = useSeconds();
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const [nx, ny] = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
  const [ux, uy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const a2: Pt = [a[0] + nx * off, a[1] + ny * off];
  const b2: Pt = [b[0] + nx * off, b[1] + ny * off];
  const sgn = Math.sign(off) || 1;
  const ext = (p: Pt, q: Pt): Pt[] => [[p[0] + nx * sgn * 8, p[1] + ny * sgn * 8], [q[0] + nx * sgn * 12, q[1] + ny * sgn * 12]];
  const head = clamp((t - at - 0.45) / 0.15);
  const vertical = Math.abs(uy) > Math.abs(ux);
  const lo = labelOff ?? 18;
  const mid: Pt = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
  return (
    <>
      <Art>
        <Line pts={ext(a, a2)} w="hair" at={at} />
        <Line pts={ext(b, b2)} w="hair" at={at} />
        <Line pts={[a2, b2]} w="thin" at={at + 0.1} />
        <Arrow tip={a2} dir={[-ux, -uy]} opacity={head} />
        <Arrow tip={b2} dir={[ux, uy]} opacity={head} />
      </Art>
      <Letter text={label} x={vertical ? mid[0] + lo : mid[0]} y={vertical ? mid[1] - size * 0.6 : mid[1] - size * 1.2 - lo + 14} size={size} at={at + 0.5} center={!vertical} />
    </>
  );
};

/** A numbered balloon with a leader to what it names, and an optional label beside it. */
export const Balloon: React.FC<{ x: number; y: number; n: number; to: Pt; label?: string; left?: boolean; at?: number }> = ({ x, y, n, to, label, left = false, at = O.balloons }) => {
  const r = E.balloon;
  const a = Math.atan2(to[1] - y, to[0] - x);
  const start: Pt = [x + r * Math.cos(a), y + r * Math.sin(a)];
  const t = useSeconds();
  const size = style.type.label;
  return (
    <>
      <Art>
        <Line pts={arc(x, y, r)} w="detail" at={at} paper />
        <Line pts={[start, to]} w="thin" at={at + 0.15} />
        <Arrow tip={to} dir={[Math.cos(a), Math.sin(a)]} size={18} opacity={clamp((t - at - 0.6) / 0.15)} />
      </Art>
      <Field text={String(n)} x={x} y={y - 15} size={27} bold at={at + 0.3} center />
      {label ? (
        left ? (
          <div style={{ position: "absolute", right: W - x + r + 14, top: y - size * 0.6 }}>
            <Letter text={label.toUpperCase()} x={0} y={0} size={size} at={at + 0.45} />
            <div style={{ visibility: "hidden", fontFamily: LETTER, fontSize: size, lineHeight: 1.1, whiteSpace: "nowrap" }}>{label.toUpperCase()}</div>
          </div>
        ) : (
          <Letter text={label.toUpperCase()} x={x + r + 14} y={y - size * 0.6} size={size} at={at + 0.45} />
        )
      ) : null}
    </>
  );
};

/** A drawing note: translucent box, outer and inner rule, a NOTE / n cell, a leader tick at lower left. `lines` are lettered in one after another. */
export const Note: React.FC<{ x: number; y: number; w: number; n: number; lines: string[]; at?: number; size?: number }> = ({ x, y, w, n, lines, at = 1.4, size = style.type.body }) => {
  const p = ease("draw", useSeconds() - at);
  if (p <= 0) return null;
  const cell = 96;
  const lh = size * 1.28;
  const h = Math.max(116, lines.length * lh + 44);
  return (
    <>
      <Art>
        <rect x={x} y={y} width={w} height={h} fill={rgba(C.note, E.noteAlpha * p)} />
        <Line pts={rect(x, y, w, h)} w="thin" at={at} />
        <Line pts={rect(x + 6, y + 6, w - 12, h - 12)} w="hair" at={at + 0.1} />
        <Line pts={[[x + cell, y + 6], [x + cell, y + h - 6]]} w="hair" at={at + 0.2} />
        <Line pts={[[x, y + h], [x - 26, y + h + 26]]} w="thin" at={at + 0.3} />
      </Art>
      <Field text="Note" x={x + cell / 2 + 2} y={y + h / 2 - 34} size={24} at={at + 0.3} center />
      <Field text={String(n)} x={x + cell / 2 + 2} y={y + h / 2 + 2} size={30} bold at={at + 0.35} center />
      {lines.map((l, i) => (
        <Letter key={i} text={l} x={x + cell + 22} y={y + (h - lines.length * lh) / 2 + i * lh + 4} size={size} at={at + 0.4 + i * 0.2} />
      ))}
    </>
  );
};

/** The title block: two rows of fields inside the safe zone, at the bottom of the sheet. */
export const TitleBlock: React.FC<{ title: string; drawn: string; sheet: string; status: string; at?: number }> = ({ title, drawn, sheet, status, at = 0.2 }) => {
  const [y, h] = [S.layout.blockY, S.layout.blockH];
  const w = W - 2 * M;
  const split = M + w * 0.66;
  const mid = y + h / 2;
  return (
    <>
      <Art>
        <Line pts={rect(M, y, w, h)} w="outline" at={at} paper />
        <Line pts={[[M, mid], [M + w, mid]]} w="thin" at={at + 0.3} />
        <Line pts={[[split, y], [split, y + h]]} w="thin" at={at + 0.4} />
      </Art>
      <Field text={title} x={M + 18} y={y + 22} at={at + 0.7} />
      <Field text={sheet} x={split + 18} y={y + 22} at={at + 0.8} />
      <Field text={drawn} x={M + 18} y={mid + 22} at={at + 0.9} />
      <Field text={status} x={split + 18} y={mid + 22} bold at={at + 1.0} />
    </>
  );
};

/** The rubber stamp: comes down hard, once, on a pale unexposed patch so the red reads against the blue. The only non-blue colour. */
export const Stamp: React.FC<{ x: number; y: number; w: number; h: number; text: string; at: number; rotate?: number }> = ({ x, y, w, h, text, at, rotate = -8 }) => {
  const uid = useUid("stamp");
  const p = ease("stamp", useSeconds() - at);
  if (p <= 0) return null;
  const size = style.type.label * 1.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rotate}deg) scale(${lerp(1.5, 1, p)})`, opacity: p }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={uid} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={4} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.75" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, backgroundColor: rgba(C.line, 0.92) }} />
      <div style={{ position: "absolute", inset: 0, filter: `url(#${uid})` }}>
        <div style={{ position: "absolute", inset: 0, border: `7px solid ${C.stamp}`, borderRadius: 8 }} />
        <div style={{ position: "absolute", inset: 12, border: `2.5px solid ${C.stamp}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FIELD, fontWeight: 700, fontSize: size, letterSpacing: 3, color: C.stamp, whiteSpace: "nowrap" }}>{text.toUpperCase()}</div>
      </div>
    </div>
  );
};

/** Procedural cyanotype paper: fbm between the two blues, coating streaks, fibres, specks, fold creases, bleached edges. It never changes between frames. */
const Paper: React.FC<{ uid: string }> = ({ uid }) => {
  const rgb = (hex: string) => [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3));
  const [hr, hg, hb] = rgb(C.high);
  const rnd = seeded(2891);
  const specks = Array.from({ length: 90 }, () => [rnd() * W, rnd() * H, 0.6 + rnd() * 1.5, 0.15 + rnd() * 0.3]);
  const fold = (pts: Pt[], dx: number, dy: number) => (
    <>
      <path d={path(pts)} stroke={C.line} strokeOpacity={0.16} strokeWidth={1.6} />
      <path d={path(pts.map(([x, y]): Pt => [x + dx, y + dy]))} stroke={C.note} strokeOpacity={0.3} strokeWidth={2.4} />
    </>
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id={`${uid}-fade`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor={C.low} />
          <stop offset={1} stopColor={mix(C.low, C.high, 0.3)} />
        </linearGradient>
        <filter id={`${uid}-fbm`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0046" numOctaves={5} seed={11} />
          <feColorMatrix type="matrix" values={`0 0 0 0 ${hr}  0 0 0 0 ${hg}  0 0 0 0 ${hb}  2.4 0 0 0 -0.8`} />
        </filter>
        <filter id={`${uid}-streak`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0012 0.035" numOctaves={2} seed={5} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 1  0.38 0 0 0 -0.165" />
        </filter>
        <filter id={`${uid}-fibre`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={2} seed={8} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.09  0 0 0 0 0.22  0.9 0 0 0 -0.38" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-fade)`} />
      <rect width={W} height={H} filter={`url(#${uid}-fbm)`} />
      <rect width={W} height={H} filter={`url(#${uid}-streak)`} />
      <rect width={W} height={H} filter={`url(#${uid}-fibre)`} />
      {specks.map(([x, y, r, a], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.line} opacity={a} />
      ))}
      {fold([[0, H / 2 + 6], [W, H / 2 - 4]], 0, 3)}
      {fold([[W / 2 - 3, 0], [W / 2 + 4, H]], 3, 0)}
    </svg>
  );
};

/** One sheet: paper, border, then everything drawn in ink (slightly soft, broken a little by the paper's grain). `table` shows the whole sheet on the drafting table. */
export const Ground: React.FC<{ children: React.ReactNode; table?: boolean; bump?: number }> = ({ children, table = false, bump = 0 }) => {
  useFontsReady(FACES);
  const uid = useUid("sheet");
  const t = useSeconds();
  const inset = table ? E.sheetInset : 0;
  const b = table ? E.sheetInset + E.tableBorder : E.borderInset;
  const shake = bump > 0 && t >= bump && t < bump + 0.12 ? 7 * (1 - (t - bump) / 0.12) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.table, transform: `translateY(${shake}px)` }}>
      <div style={{ position: "absolute", inset, overflow: "hidden", boxShadow: table ? `0 14px 44px rgba(0,0,0,0.7)` : undefined }}>
        <div style={{ position: "absolute", left: -inset, top: -inset, width: W, height: H }}>
          <Paper uid={uid} />
        </div>
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 130px ${rgba(C.bleach, 0.42)}` }} />
      </div>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={`${uid}-ink`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={style.finish.inkSoft} result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={3} result="n" />
          <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 ${(2.5 + style.finish.inkBreak).toFixed(2)}`} result="m" />
          <feComposite in="soft" in2="m" operator="in" />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `url(#${uid}-ink)` }}>
        <Art>
          <Line pts={rect(b, b, W - 2 * b, H - 2 * b)} w="outline" at={0} />
          <Line pts={rect(b + 10, b + 10, W - 2 * b - 20, H - 2 * b - 20)} w="hair" at={0.05} />
          {[0.25, 0.5, 0.75].flatMap((k) => [
            <Line key={`t${k}`} pts={[[W * k, b - 14], [W * k, b]]} w="thin" at={0.2} />,
            <Line key={`b${k}`} pts={[[W * k, H - b], [W * k, H - b + 14]]} w="thin" at={0.2} />,
            <Line key={`l${k}`} pts={[[b - 14, H * k], [b, H * k]]} w="thin" at={0.2} />,
            <Line key={`r${k}`} pts={[[W - b, H * k], [W - b + 14, H * k]]} w="thin" at={0.2} />,
          ])}
        </Art>
        {children}
      </div>
      <Finish grain={style.finish.grain} vignette={style.finish.vignette} width={W} height={H} />
    </AbsoluteFill>
  );
};

/** The drawn scale bar: alternating open and hatched blocks in the empty foot of the sheet. No text. */
export const ScaleBar: React.FC<{ y: number; at?: number }> = ({ y, at = 0.5 }) => {
  const [n, w, h] = [6, 76, 24];
  return (
    <Art>
      {Array.from({ length: n }, (_, i) => (
        <React.Fragment key={i}>
          <Line pts={rect(M + i * w, y, w, h)} w="thin" at={at + i * 0.04} />
          {i % 2 ? <Hatch shape={rect(M + i * w, y, w, h).slice(0, 4)} at={at + 0.4} spacing={8} /> : null}
        </React.Fragment>
      ))}
    </Art>
  );
};
