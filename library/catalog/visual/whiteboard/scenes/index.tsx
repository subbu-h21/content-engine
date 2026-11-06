/** Whiteboard on the shared sample content: title, headline, diagram, number, list, end (the wide shot of the wall). */
import React from "react";
import { clamp, SAMPLE, words, wrap, type Sample } from "../../kit";
import {
  arrowStrokes,
  Board,
  boxStrokes,
  C,
  dashStrokes,
  handCircle,
  M,
  Magnet,
  Marker,
  Pen,
  quad,
  Stroke,
  Subtitle,
  T,
  W,
  wavePts,
  Write,
  type PenMove,
  type Pt,
} from "./parts";

const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");

// ------------------------------------------------------------------ a lesson timeline: one marker writes at a time

type Item =
  | { kind: "write"; text: string; x: number; y: number; size: number; col?: string; anchor?: "start" | "middle"; gap?: number }
  | { kind: "strokes"; list: Pt[][]; col?: string; width?: number; gap?: number; dur?: number };

const len = (pts: Pt[]) => pts.reduce((n, p, i) => (i ? n + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

/**
 * Lays items one after another from `start` (each item's own gap before it, 0.05 s by default) and returns the
 * marks and each marker colour's moves, so the floating marker is always where the ink is appearing.
 */
const lesson = (items: Item[], start: number) => {
  let t = start;
  const nodes: React.ReactNode[] = [];
  const moves: PenMove[] = [];
  let lastCol = "";
  const starts: number[] = [];
  items.forEach((it, i) => {
    const col = it.col ?? C.black;
    // a different colour means a different marker: give the swap time
    t += Math.max(it.gap ?? 0.05, lastCol && col !== lastCol ? 0.36 : 0);
    lastCol = col;
    starts.push(t);
    if (it.kind === "write") {
      const dur = clamp(it.text.length * 0.04, 0.25, 1.1);
      const est = it.text.length * it.size * T.charEm;
      const x0 = it.anchor === "middle" ? it.x - est / 2 : it.x;
      nodes.push(<Write key={i} text={it.text} x={it.x} y={it.y} size={it.size} at={t} dur={dur} col={col} anchor={it.anchor} seed={i + 1} />);
      moves.push({ at: t, dur, from: [x0, it.y - it.size * 0.3], to: [x0 + est, it.y - it.size * 0.25], col });
      t += dur;
    } else {
      const lens = it.list.map(len);
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      const d = it.dur ?? clamp(total / 1100, 0.2, 1.2);
      it.list.forEach((pts, k) => {
        const di = Math.max(0.06, (d * lens[k]) / total);
        nodes.push(<Stroke key={`${i}-${k}`} pts={pts} at={t} dur={di} col={col} width={it.width} seed={i * 31 + k * 7 + 1} />);
        moves.push({ at: t, dur: di, from: pts[0], to: pts[pts.length - 1], col });
        t += di + 0.025;
      });
    }
  });
  return { nodes, pen: <Pen key="pen" moves={moves} />, end: t, starts };
};

/** A sun: a hand circle and short rays. */
const sun = (x: number, y: number, r: number, rays = 8): Pt[][] => [
  handCircle(x, y, r, r, 210, 20),
  ...Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2 + 0.3;
    return [
      [x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18)],
      [x + Math.cos(a) * (r + 48), y + Math.sin(a) * (r + 48)],
    ] as Pt[];
  }),
];

/** A stick person (you), looking up, one arm pointing. */
const person = (x: number, y: number, s = 1): Pt[][] => [
  handCircle(x, y - 172 * s, 26 * s, 26 * s, 250, 16),
  [[x, y - 145 * s], [x + 2, y - 70 * s]],
  [[x - 34 * s, y - 2], [x + 1, y - 70 * s], [x + 34 * s, y]],
  [[x - 40 * s, y - 100 * s], [x, y - 122 * s], [x + 44 * s, y - 168 * s]],
];

/** An air molecule: two touching hand circles. */
const molecule = (x: number, y: number, r: number): Pt[][] => [handCircle(x - r * 0.75, y + r * 0.08, r, r, 120, 18), handCircle(x + r * 0.75, y - r * 0.08, r, r, 300, 18)];

// ------------------------------------------------------------------ samples
// Each sample's lesson is a function, so its hero moment (just after the last mark lands, while the marker still
// hovers) and its length follow the writing.

const titleLesson = () =>
  lesson(
    [
      { kind: "write", text: SAMPLE.kicker, x: M, y: 300, size: T.small },
      { kind: "write", text: plainOf(SAMPLE.title), x: M, y: 500, size: T.title, gap: 0.12 },
      { kind: "write", text: emOf(SAMPLE.title), x: M + 10, y: 740, size: T.hero, col: C.blue },
      { kind: "strokes", list: [handCircle(372, 668, 330, 132, 196, 30), handCircle(376, 674, 314, 118, 214, 18)], col: C.orange, width: 8, dur: 0.6 },
      { kind: "strokes", list: [[[110, 1400], [970, 1396]], ...sun(800, 1110, 64, 8)], width: 9, dur: 0.8 },
      { kind: "strokes", list: person(300, 1394, 1.15), col: C.orange, width: 9, dur: 0.45 },
    ],
    0.1,
  );

const Title: React.FC = () => {
  const L = titleLesson();
  return (
    <Board over={L.pen} ghostSeed={4}>
      {L.nodes}
    </Board>
  );
};

const HEAD = (() => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  return {
    l1: all.slice(0, 2).map((w) => w.text).join(" "),
    l2: all.slice(2, 4).map((w) => w.text).join(" "),
    l3: all.filter((w) => w.em).map((w) => w.text).join(" "),
  };
})();

const headlineLesson = () => {
  const size = 100;
  const [sx, sy] = [190, 1030];
  const fanFrom: Pt = [472, sy];
  const fan = [700, 650, 600, 550, 500, 450].map((nm, i) => ({ nm, to: [930, 840 + i * 90] as Pt }));
  return lesson(
    [
      { kind: "write", text: HEAD.l1, x: M, y: 420, size },
      { kind: "write", text: HEAD.l2, x: M, y: 420 + size * T.leading, size },
      { kind: "write", text: HEAD.l3, x: M, y: 420 + 2 * size * T.leading, size },
      { kind: "strokes", list: [handCircle(M + 188, 420 + 2 * size * T.leading - 34, 218, 70, 188, 26)], col: C.orange, width: 8, dur: 0.4 },
      { kind: "strokes", list: [...sun(sx, sy, 70, 7), [[sx + 86, sy], fanFrom]], width: 9, dur: 0.6 },
      { kind: "strokes", list: fan.slice(0, 5).map((f) => wavePts(fanFrom, f.to, 13, f.nm / 9)), width: 7, dur: 0.6 },
      { kind: "write", text: "700 nm", x: 800, y: fan[0].to[1] - 30, size: T.small },
      { kind: "strokes", list: [wavePts(fanFrom, fan[5].to, 13, fan[5].nm / 9)], col: C.blue, width: 8, dur: 0.22 },
      { kind: "write", text: "450 nm", x: 800, y: fan[5].to[1] + 62, size: T.small, col: C.blue },
    ],
    0.1,
  );
};

const HeadlineSample: React.FC = () => {
  const L = headlineLesson();
  return (
    <Board over={[L.pen, <Subtitle key="s" lines={wrap(SAMPLE.body, 34)} y={1438} at={L.end - 0.5} />]} ghostSeed={6}>
      {L.nodes}
    </Board>
  );
};

const DIA = (() => {
  const c: Pt = [522, 822];
  const src: Pt = [140, 380];
  const l = Math.hypot(c[0] - src[0], c[1] - src[1]);
  return { c, src, u: [(c[0] - src[0]) / l, (c[1] - src[1]) / l] as Pt };
})();

const diagramLesson = () => {
  const { c, src, u } = DIA;
  const blue = [-80, -25, 15, 100, 160, 205].map((d) => (d * Math.PI) / 180);
  return lesson(
    [
      { kind: "write", text: SAMPLE.diagram.in, x: M + 20, y: 330, size: T.label },
      { kind: "strokes", list: arrowStrokes(src, [c[0] - u[0] * 132, c[1] - u[1] * 132]), width: 9 },
      { kind: "strokes", list: molecule(c[0], c[1], 70), width: 9, dur: 0.5 },
      { kind: "strokes", list: blue.flatMap((a) => arrowStrokes([c[0] + Math.cos(a) * 128, c[1] + Math.sin(a) * 128], [c[0] + Math.cos(a) * 300, c[1] + Math.sin(a) * 300], { amp: 9, wl: 30, head: 26 })), col: C.blue, width: 8, dur: 1.0 },
      { kind: "strokes", list: [...dashStrokes([c[0] + u[0] * 130, c[1] + u[1] * 130], [c[0] + u[0] * 470, c[1] + u[1] * 470])], width: 8, dur: 0.4 },
      { kind: "write", text: "red", x: 752, y: 1080, size: T.small },
      { kind: "strokes", list: [quad([300, 1196], [330, 1060], [446, 896])], width: 7, dur: 0.25 },
      { kind: "write", text: SAMPLE.diagram.object, x: M + 20, y: 1250, size: T.label - 6 },
      { kind: "write", text: SAMPLE.diagram.label, x: M + 20, y: 1420, size: 68, col: C.blue },
    ],
    0.1,
  );
};

const Diagram: React.FC = () => {
  const L = diagramLesson();
  const { c } = DIA;
  return (
    <Board over={[L.pen, <Magnet key="m" x={c[0] + 54} y={c[1] - 64} at={L.starts[4] - 0.2} />]} ghostSeed={8}>
      {L.nodes}
    </Board>
  );
};

/** Diagonal hatch lines inside a box. */
const hatch = (x: number, y: number, w: number, h: number, step = 34): Pt[][] => {
  const out: Pt[][] = [];
  for (let s = step * 0.6; s < w + h; s += step) out.push([[x + Math.min(s, w), y + Math.max(0, s - w)], [x + Math.max(0, s - h), y + Math.min(s, h)]]);
  return out;
};

const numberLesson = () => {
  const n = SAMPLE.number;
  const full = 820;
  const red = full / n.value;
  const eq = 72;
  const eqA = "(700 ÷ 450)";
  const xSup = M + eqA.length * eq * 0.52 + 6; // digits and ÷ run wider than the average letter
  return lesson(
    [
      { kind: "write", text: `${n.value.toFixed(n.decimals)}${n.unit}`, x: M - 6, y: 560, size: T.number },
      { kind: "strokes", list: [[[M, 612], [M + 520, 600]], [[M + 20, 640], [M + 500, 632]]], col: C.orange, width: 8, dur: 0.35 },
      { kind: "write", text: eqA, x: M, y: 800, size: eq },
      { kind: "write", text: "4", x: xSup, y: 752, size: 44 },
      { kind: "write", text: "= 5.86", x: xSup + 40, y: 800, size: eq },
      { kind: "write", text: "blue · 450 nm", x: M, y: 990, size: T.small, col: C.blue },
      { kind: "strokes", list: [...boxStrokes(M, 1020, full, 92), ...hatch(M, 1020, full, 92)], col: C.blue, width: 7, dur: 0.9 },
      { kind: "write", text: "red · 700 nm", x: M, y: 1196, size: T.small },
      { kind: "strokes", list: [...boxStrokes(M, 1226, red, 92, 6), ...hatch(M, 1226, red, 92)], width: 7, dur: 0.4 },
      { kind: "strokes", list: Array.from({ length: 5 }, (_, i) => [[M + red * (i + 1), 1004], [M + red * (i + 1), 1036]] as Pt[]), width: 6, dur: 0.3, gap: 0.1 },
    ],
    0.1,
  );
};

const NumberSample: React.FC = () => {
  const L = numberLesson();
  return (
    <Board over={L.pen} ghostSeed={10}>
      {L.nodes}
    </Board>
  );
};

const listLesson = () => {
  const rows = [520, 900, 1280];
  const ix = 190;
  const tx = 340;
  const size = 62;
  const lines = SAMPLE.list.map((s) => wrap(s, 16));
  const text = (i: number): Item[] =>
    lines[i].map((l, j) => ({ kind: "write" as const, text: l, x: tx, y: rows[i] - 6 + (j - (lines[i].length - 1) / 2) * size * 1.15 + 20, size }));
  const down = (y0: number, y1: number): Item => ({ kind: "strokes", list: arrowStrokes([ix - 10, y0], [ix + 6, y1], { bend: 30, head: 26 }), width: 8, dur: 0.25 });
  const rad = (d: number) => (d * Math.PI) / 180;
  return lesson(
    [
      { kind: "strokes", list: sun(ix, rows[0], 50, 8), width: 8, dur: 0.45 },
      ...text(0),
      down(rows[0] + 92, rows[1] - 70),
      { kind: "strokes", list: molecule(ix, rows[1], 36), width: 8, dur: 0.3 },
      { kind: "strokes", list: [-60, 20, 200].flatMap((d) => arrowStrokes([ix + Math.cos(rad(d)) * 72, rows[1] + Math.sin(rad(d)) * 62], [ix + Math.cos(rad(d)) * 132, rows[1] + Math.sin(rad(d)) * 104], { amp: 6, wl: 20, head: 18 })), col: C.blue, width: 7, dur: 0.4 },
      ...text(1),
      down(rows[1] + 92, rows[2] - 110),
      { kind: "strokes", list: person(ix, rows[2] + 88, 0.9), col: C.orange, width: 8, dur: 0.35 },
      { kind: "strokes", list: [140, 270, 40].flatMap((d) => arrowStrokes([ix + Math.cos(rad(d)) * 150, rows[2] - 60 + Math.sin(rad(d)) * 120], [ix + Math.cos(rad(d)) * 80, rows[2] - 60 + Math.sin(rad(d)) * 62], { amp: 5, wl: 18, head: 16 })), col: C.blue, width: 7, dur: 0.4 },
      ...text(2),
    ],
    0.1,
  );
};

const List: React.FC = () => {
  const L = listLesson();
  return (
    <Board over={L.pen} ghostSeed={12}>
      {L.nodes}
    </Board>
  );
};

const BOARD = { x: 70, y: 210, w: W - 140, h: 1290 };

const endLesson = () => {
  const size = 150;
  return lesson(
    [
      { kind: "write", text: plainOf(SAMPLE.end.line), x: W / 2, y: 720, size, anchor: "middle" },
      { kind: "write", text: emOf(SAMPLE.end.line), x: W / 2, y: 720 + size * 1.1, size, anchor: "middle", col: C.blue },
      { kind: "strokes", list: [quad([W / 2 - 230, 920], [W / 2, 900], [W / 2 + 240, 912])], col: C.orange, width: 9, dur: 0.3 },
      { kind: "write", text: SAMPLE.end.cta, x: W / 2, y: 1060, size: T.label, anchor: "middle" },
      { kind: "strokes", list: person(W / 2, 1400, 0.9), col: C.orange, width: 8, dur: 0.35 },
    ],
    0.1,
  );
};

/** The camera has pulled back past the board's edge: the aluminium frame, the tray, the wall. */
const End: React.FC = () => {
  const b = BOARD;
  const L = endLesson();
  const tray = { x: 40, y: b.y + b.h + 18, w: W - 80, h: 46 };
  const frame = (
    <g key="frame">
      <defs>
        <linearGradient id="wb-traysh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.16} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="wb-wall" cx="50%" cy="40%" r="75%">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.14} />
        </radialGradient>
      </defs>
      <rect x={b.x - 22} y={b.y - 22} width={b.w + 44} height={b.h + 44} rx={8} fill="none" stroke={C.frame} strokeWidth={22} />
      <rect x={b.x - 33} y={b.y - 33} width={b.w + 66} height={b.h + 66} rx={12} fill="none" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={2} />
      <rect x={b.x - 11} y={b.y - 11} width={b.w + 22} height={b.h + 22} rx={4} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={2} />
      <rect x={tray.x} y={tray.y} width={tray.w} height={tray.h} rx={6} fill={C.frame} />
      <rect x={tray.x} y={tray.y + tray.h - 12} width={tray.w} height={12} rx={4} fill="#000" opacity={0.12} />
      <rect x={tray.x} y={tray.y + tray.h} width={tray.w} height={40} fill="url(#wb-traysh)" />
      <rect x={820} y={tray.y - 44} width={180} height={50} rx={8} fill={C.eraser} />
      <rect x={820} y={tray.y - 44} width={180} height={14} rx={6} fill="#ffffff" opacity={0.08} />
      <rect x={886} y={tray.y - 34} width={48} height={18} rx={3} fill={C.orange} />
      <Marker at={[110, tray.y - 18]} col={C.black} angle={-2} />
      <Marker at={[740, tray.y - 20]} col={C.blue} angle={182} />
      <rect width={W} height={1920} fill="url(#wb-wall)" />
    </g>
  );
  return (
    <Board over={[frame, L.pen]} ghostSeed={14} inset={b}>
      {L.nodes}
    </Board>
  );
};

/** Hero just after the last mark lands (the marker still hovering), then hold. */
const timed = (f: () => { end: number }) => {
  const e = f().end;
  return { duration: Math.round((e + 1.2) * 10) / 10, hero: Math.round((e + 0.35) * 10) / 10 };
};

export const samples: Sample[] = [
  { id: "title", ...timed(titleLesson), component: Title },
  { id: "headline", ...timed(headlineLesson), component: HeadlineSample },
  { id: "diagram", ...timed(diagramLesson), component: Diagram },
  { id: "number", ...timed(numberLesson), component: NumberSample },
  { id: "list", ...timed(listLesson), component: List },
  { id: "end", ...timed(endLesson), component: End },
];
