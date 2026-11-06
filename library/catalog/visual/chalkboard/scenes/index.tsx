/** Chalkboard on the shared sample content: title, headline (a myth wiped and rewritten), diagram, number, list, end. */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { arc, arrow, C, Chalk, chalkWidth, chalkWidthPx, dashes, layoutChalk, lesson, line, M, perStroke, Plate, S, Slate, T, W, wavePts, WetStreak, Wiped, type Item, type Pt } from "./parts";

const RIGHT = S.layout.textRight;
const COLUMN = RIGHT - M;
const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");
/** The largest size (up to `max`) at which a line of chalk fits the column. */
const fitChalk = (text: string, max: number, width = COLUMN) => Math.min(max, Math.floor((width / chalkWidth(text, 100)) * 100));

/** A sun in chalk: a circle that overlaps its start, short rays. */
const sun = (x: number, y: number, r: number, rays = 8): Pt[][] => [
  arc(x, y, r, r * 0.97, 200, 575, 60),
  ...Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2 + 0.3;
    return line([x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18)], [x + Math.cos(a) * (r + 46), y + Math.sin(a) * (r + 46)]);
  }),
];

/** Words of one line in two chalks: `accent` words in the accent chalk. */
const twoChalk = (text: string, x: number, y: number, size: number, accent: (w: string) => boolean): Item[] => {
  let pen = x;
  return text.split(" ").map((w, i) => {
    const it: Item = { kind: "write", text: w, x: pen, y, size, col: accent(w) ? C.accent : C.white, gap: i ? 0.04 : undefined };
    pen += chalkWidth(`${w} `, size) + (size * 12) / 100;
    return it;
  });
};

// ------------------------------------------------------------------ title

const titleLesson = () => {
  const q = plainOf(SAMPLE.title);
  const size = fitChalk(q, T.title);
  return lesson(
    [
      { kind: "write", text: SAMPLE.kicker, x: RIGHT - chalkWidth(SAMPLE.kicker, T.small), y: 330, size: T.small },
      { kind: "write", text: q, x: M, y: 660, size, gap: 0.2 },
      { kind: "write", text: emOf(SAMPLE.title), x: M, y: 1000, size: T.hero, col: C.accent, gap: 0.15 },
      { kind: "draw", list: [line([M + 6, 1066], [M + 560, 1052]), line([M + 30, 1096], [M + 520, 1086])], col: C.accent, width: 7, per: 0.16 },
      { kind: "draw", list: sun(830, 1330, 66, 8), width: 6, per: 0.07, gap: 0.2 },
    ],
    0.15,
  );
};

const Title: React.FC = () => {
  const L = titleLesson();
  return <Slate>{L.nodes}</Slate>;
};

// ------------------------------------------------------------------ headline: what people think, wiped; the truth in its place

const MYTH = "Reflected sea?";
const MYTH_SIZE = 84;
const MYTH_Y = 520;
const WIPE = `M 30 ${MYTH_Y - 34} C 360 ${MYTH_Y - 64}, 700 ${MYTH_Y - 4}, 1070 ${MYTH_Y - 40}`;

const headlineTimes = () => {
  const strokes = layoutChalk(MYTH, M, MYTH_Y, MYTH_SIZE, "start", 91);
  const mythEnd = 0.15 + strokes.length * perStroke(MYTH_SIZE);
  const wipeAt = mythEnd + 0.6;
  return { strokes, wipeAt };
};

const headlineLesson = () => {
  const { wipeAt } = headlineTimes();
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const l1 = all.slice(0, 2).map((w) => w.text).join(" ");
  const l2 = all.slice(2).map((w) => w.text).join(" ");
  const size = Math.min(fitChalk(l1, T.headline), fitChalk(l2, T.headline));
  const from: Pt = [430, 1010];
  const fan = [700, 650, 600, 550, 500, 450].map((nm, i) => ({ nm, to: [900, 860 + i * 62] as Pt }));
  return lesson(
    [
      { kind: "write", text: l1, x: M, y: MYTH_Y, size, gap: 0 },
      { kind: "write", text: l2, x: M, y: MYTH_Y + size * T.leading, size },
      { kind: "draw", list: [...sun(190, 1010, 62, 7), line([270, 1010], from)], width: 6, per: 0.07, gap: 0.2 },
      { kind: "draw", list: fan.slice(0, 5).map((f) => wavePts(from, f.to, 11, f.nm / 10)), width: 5, per: 0.12 },
      { kind: "draw", list: [wavePts(from, fan[5].to, 11, fan[5].nm / 10)], col: C.accent, width: 6, per: 0.14 },
      { kind: "write", text: "700 nm", x: 760, y: 836, size: T.small - 6 },
      { kind: "write", text: "450 nm", x: 760, y: 1250, size: T.small - 6, col: C.accent },
    ],
    wipeAt + S.motion.recipes.wipe.duration + 0.25,
  );
};

const HeadlineSample: React.FC = () => {
  const { strokes, wipeAt } = headlineTimes();
  const L = headlineLesson();
  return (
    <Slate under={<WetStreak path={WIPE} at={wipeAt} />} over={<Plate lines={wrap(SAMPLE.body, 38)} at={L.end - 0.3} />}>
      <Wiped path={WIPE} at={wipeAt}>
        <Chalk strokes={strokes} at={0.15} per={perStroke(MYTH_SIZE)} col={C.second} width={chalkWidthPx(MYTH_SIZE)} seed={91} />
      </Wiped>
      {L.nodes}
    </Slate>
  );
};

// ------------------------------------------------------------------ diagram

const diagramLesson = () => {
  const c: Pt = [540, 810];
  const src: Pt = [130, 400];
  const l0 = Math.hypot(c[0] - src[0], c[1] - src[1]);
  const u: Pt = [(c[0] - src[0]) / l0, (c[1] - src[1]) / l0];
  const r = 62;
  const blue = [-80, -25, 18, 100, 160, 205].map((d) => (d * Math.PI) / 180);
  return lesson(
    [
      { kind: "write", text: SAMPLE.diagram.in, x: M, y: 340, size: T.label - 6 },
      { kind: "draw", list: arrow(src, [c[0] - u[0] * 128, c[1] - u[1] * 128]), width: 6, per: 0.2 },
      { kind: "draw", list: [arc(c[0] - r * 0.75, c[1] + 4, r, r, 120, 495, 50), arc(c[0] + r * 0.75, c[1] - 4, r, r, 300, 675, 50)], width: 6, per: 0.25 },
      { kind: "draw", list: blue.flatMap((a) => arrow([c[0] + Math.cos(a) * 120, c[1] + Math.sin(a) * 120], [c[0] + Math.cos(a) * 290, c[1] + Math.sin(a) * 290], { amp: 8, wl: 28, head: 22 })), col: C.accent, width: 6, per: 0.09 },
      { kind: "draw", list: dashes([c[0] + u[0] * 130, c[1] + u[1] * 130], [c[0] + u[0] * 440, c[1] + u[1] * 440]), width: 6, per: 0.06 },
      { kind: "write", text: "red", x: 850, y: 1046, size: T.small - 6 },
      { kind: "draw", list: [line([300, 1166], [440, 900], 0.05)], width: 5, per: 0.16 },
      { kind: "write", text: SAMPLE.diagram.object, x: M, y: 1230, size: T.small },
      ...twoChalk(SAMPLE.diagram.label, M, 1370, 74, (w) => w === "blue"),
    ],
    0.15,
  );
};

const Diagram: React.FC = () => {
  const L = diagramLesson();
  return <Slate over={<Plate lines={wrap(SAMPLE.body, 38)} at={L.end - 0.2} />}>{L.nodes}</Slate>;
};

// ------------------------------------------------------------------ number: chalk as a measuring tool

const numberLesson = () => {
  const n = SAMPLE.number;
  const unit = 128;
  const x0 = M + 10;
  const blueEnd = x0 + unit * n.value;
  return lesson(
    [
      { kind: "write", text: `${n.value.toFixed(n.decimals)}${n.unit}`, x: M, y: 620, size: T.number },
      { kind: "write", text: "red", x: M, y: 860, size: T.small },
      { kind: "draw", list: [line([x0, 920], [x0 + unit, 920]), line([x0, 900], [x0, 940]), line([x0 + unit, 900], [x0 + unit, 940])], width: 7, per: 0.16 },
      { kind: "write", text: "blue", x: M, y: 1080, size: T.small, col: C.accent, gap: 0.2 },
      { kind: "draw", list: arrow([x0, 1140], [blueEnd, 1140], { head: 28 }), col: C.accent, width: 7, per: 0.35 },
      { kind: "draw", list: Array.from({ length: 6 }, (_, i) => line([x0 + unit * i, 1116], [x0 + unit * i, 1164])), width: 5, per: 0.07 },
      ...Array.from({ length: 5 }, (_, i): Item => ({ kind: "write", text: String(i + 1), x: x0 + unit * (i + 0.5) - 10, y: 1232, size: 44, gap: 0.03 })),
    ],
    0.15,
  );
};

const NumberSample: React.FC = () => {
  const L = numberLesson();
  return <Slate over={<Plate lines={wrap(SAMPLE.number.caption, 34)} at={L.end - 0.2} />}>{L.nodes}</Slate>;
};

// ------------------------------------------------------------------ list

const listLesson = () => {
  const rows = [500, 880, 1260];
  const size = 66;
  const tx = M + 96;
  const items: Item[] = [];
  SAMPLE.list.forEach((s, i) => {
    items.push({ kind: "write", text: `${i + 1}.`, x: M, y: rows[i], size, gap: i ? 0.25 : 0 });
    wrap(s, 16).forEach((l, j) => items.push(...twoChalk(l, tx, rows[i] + j * size * T.leading, size, (w) => w === "Blue")));
    if (i < 2) items.push({ kind: "draw", list: arrow([M + 20, rows[i] + 60], [M + 20, rows[i + 1] - 96], { head: 20 }), width: 5, per: 0.14 });
  });
  return lesson(items, 0.15);
};

const List: React.FC = () => <Slate>{listLesson().nodes}</Slate>;

// ------------------------------------------------------------------ end: the wide shot of the classroom

const BOARD = { x: 64, y: 340, w: W - 128, h: 1060 };

const endLesson = () => {
  const size = 150;
  const a = plainOf(SAMPLE.end.line);
  const b = emOf(SAMPLE.end.line);
  return lesson(
    [
      { kind: "write", text: a, x: W / 2, y: 720, size, anchor: "middle" },
      { kind: "write", text: b, x: W / 2, y: 720 + size * 1.25, size, anchor: "middle", col: C.accent },
      { kind: "write", text: SAMPLE.end.cta, x: W / 2, y: 1180, size: T.small, anchor: "middle", gap: 0.25 },
    ],
    0.15,
  );
};

const Classroom: React.FC = () => {
  const b = BOARD;
  const fr = 26;
  const trayY = b.y + b.h + fr;
  // the clock reads 8:55
  const [cx, cy, cr] = [850, 170, 82];
  const hand = (deg: number, len: number, w: number) => <line x1={cx} y1={cy} x2={cx + Math.sin((deg * Math.PI) / 180) * len} y2={cy - Math.cos((deg * Math.PI) / 180) * len} stroke="#222222" strokeWidth={w} strokeLinecap="round" />;
  return (
    <g>
      <defs>
        <radialGradient id="ck-face" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor={C.clock} />
          <stop offset="1" stopColor="#d9d4c6" />
        </radialGradient>
        <linearGradient id="ck-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d5a3a" />
          <stop offset="1" stopColor={C.frame} />
        </linearGradient>
      </defs>
      <rect x={0} y={1560} width={W} height={360} fill={C.dado} />
      <rect x={0} y={1552} width={W} height={14} fill="#46604f" />
      <rect x={b.x - fr} y={b.y - fr} width={b.w + 2 * fr} height={b.h + 2 * fr} rx={6} fill="url(#ck-wood)" />
      <rect x={b.x - fr} y={b.y - fr} width={b.w + 2 * fr} height={5} rx={3} fill="#ffffff" opacity={0.12} />
      <rect x={b.x - fr - 18} y={trayY} width={b.w + 2 * fr + 36} height={22} fill={C.tray} />
      <rect x={b.x - fr - 18} y={trayY + 22} width={b.w + 2 * fr + 36} height={20} fill={C.trayShadow} />
      <rect x={b.x - fr - 18} y={trayY + 42} width={b.w + 2 * fr + 36} height={30} fill="#000" opacity={0.12} />
      <rect x={220} y={trayY - 12} width={86} height={16} rx={8} fill={C.white} />
      <rect x={330} y={trayY - 12} width={64} height={16} rx={8} fill={C.white} opacity={0.92} />
      <rect x={760} y={trayY - 12} width={38} height={16} rx={8} fill={C.accent} />
      <circle cx={cx + 6} cy={cy + 10} r={cr + 6} fill="#000" opacity={0.1} />
      <circle cx={cx} cy={cy} r={cr + 8} fill="#2a2a2a" />
      <circle cx={cx} cy={cy} r={cr} fill="url(#ck-face)" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={cx + Math.sin(a) * cr * 0.8} y1={cy - Math.cos(a) * cr * 0.8} x2={cx + Math.sin(a) * cr * 0.92} y2={cy - Math.cos(a) * cr * 0.92} stroke="#222222" strokeWidth={i % 3 ? 2 : 4} />;
      })}
      {hand(8 * 30 + 27.5, cr * 0.5, 6)}
      {hand(330, cr * 0.75, 4)}
      <circle cx={cx} cy={cy} r={5} fill="#222222" />
    </g>
  );
};

const End: React.FC = () => (
  <Slate board={BOARD} around={<Classroom />}>
    {endLesson().nodes}
  </Slate>
);

/** Hero just after the last stroke lands, then a hold. */
const timed = (f: () => { end: number }, hold = 0.45) => {
  const e = f().end;
  return { duration: Math.round((e + 1.3) * 10) / 10, hero: Math.round((e + hold) * 10) / 10 };
};

export const samples: Sample[] = [
  { id: "title", ...timed(titleLesson), component: Title },
  { id: "headline", ...timed(headlineLesson, 0.5), component: HeadlineSample },
  { id: "diagram", ...timed(diagramLesson, 0.5), component: Diagram },
  { id: "number", ...timed(numberLesson, 0.5), component: NumberSample },
  { id: "list", ...timed(listLesson), component: List },
  { id: "end", ...timed(endLesson), component: End },
];
