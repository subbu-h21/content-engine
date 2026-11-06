/**
 * Studio Floor Fly-over on the shared sample content. The page is the video's own: a generic page about the sample,
 * laid on the floor and flown over in one take; its pieces stand up as the camera passes. The end card is the only
 * moment with text over the floor.
 */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Badge, C, distanceAt, ease, Floor, Fly, glide, PW, S, SERIF, Tile, TwoLine, W, type Lift } from "./parts";

const PAGE_H = 3400;
const em = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");
const nonEm = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");

/** The page's sky illustration (a drawn gradient with a sun: clearly an illustration, not a photo). */
const SkyArt: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.accent} 0%, ${C.sky} 55%, ${C.white} 100%)` }}>
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={w * 0.72} cy={h * 0.38} r={h * 0.13} fill={C.sun} />
      <path d={`M0 ${h * 0.82} Q ${w * 0.3} ${h * 0.68} ${w * 0.55} ${h * 0.8} T ${w} ${h * 0.74} L ${w} ${h} L 0 ${h} Z`} fill={C.white} opacity={0.75} />
    </svg>
  </div>
);

const Kicker: React.FC<{ y: number; text: string }> = ({ y, text }) => (
  <div style={{ position: "absolute", left: 40, top: y, fontSize: 26, color: C.muted }}>{text}</div>
);

/** The flat page: nav, hero, sections (their lifted pieces are drawn by `lifts`), footer. */
const Page: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, fontFamily: "inherit" }}>
    <div style={{ position: "absolute", left: 40, top: 32, display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 500 }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent }} />
      {SAMPLE.kicker}
    </div>
    {[0, 1].map((i) => (
      <div key={i} style={{ position: "absolute", right: 200 - i * 96, top: 40, width: 76, height: 22, borderRadius: 11, backgroundColor: C.faint }} />
    ))}
    <div style={{ position: "absolute", right: 40, top: 28, width: 120, height: 46, borderRadius: 23, backgroundColor: C.text }} />
    <div style={{ position: "absolute", left: 0, width: PW, top: 118, textAlign: "center" }}>
      <div style={{ fontSize: S.type.pageTitle, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08 }}>{nonEm(SAMPLE.title)}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: S.type.pageTitle * 1.1, color: C.muted, lineHeight: 1 }}>{em(SAMPLE.title)}</div>
    </div>
    <div style={{ position: "absolute", left: 40, top: 380, width: PW - 80, height: 360, borderRadius: 22, overflow: "hidden" }}>
      <SkyArt w={PW - 80} h={360} />
    </div>
    <Kicker y={800} text={SAMPLE.chapter} />
    <div style={{ position: "absolute", left: 40, top: 1190, width: PW - 80, fontSize: S.type.pageBody, lineHeight: 1.4, color: C.muted }}>{SAMPLE.body}</div>
    <Kicker y={1340} text={SAMPLE.diagram.object} />
    <Kicker y={2000} text="By the numbers" />
    <Kicker y={2560} text="Step by step" />
    <div style={{ position: "absolute", left: 0, width: PW, top: 3140, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "16px 34px", borderRadius: 999, backgroundColor: C.text, color: C.white, fontSize: 28, fontWeight: 500 }}>{SAMPLE.end.cta}</div>
    </div>
  </div>
);

const chip = (text: string, accent = false): React.ReactNode => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: accent ? C.accent : C.white, color: accent ? C.white : C.text, fontSize: S.type.pageChip, fontWeight: 500, border: accent ? undefined : `1.5px solid ${C.faint}`, boxSizing: "border-box", borderRadius: 999, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: accent ? C.white : C.accent }} />
    {text}
  </div>
);

const card = (children: React.ReactNode): React.ReactNode => (
  <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: C.white, border: `1.5px solid ${C.faint}`, boxSizing: "border-box", borderRadius: 22, overflow: "hidden" }}>{children}</div>
);

/** Every piece that stands up off the page as the camera passes. */
const LIFTS: Lift[] = [
  { key: "c1", x: 430, y: 410, w: 230, h: 64, lift: 70, stand: 30, radius: 32, node: chip(SAMPLE.diagram.in, true) },
  { key: "c2", x: 60, y: 676, w: 250, h: 64, lift: 80, stand: 30, radius: 32, node: chip(SAMPLE.chapter) },
  {
    key: "head",
    x: 40,
    y: 850,
    w: PW - 80,
    h: 240,
    lift: 110,
    stand: 46,
    radius: 22,
    node: card(
      <div style={{ position: "absolute", left: 36, top: 28, right: 36 }}>
        <div style={{ fontSize: 26, color: C.muted, marginBottom: 10 }}>{SAMPLE.kicker}</div>
        <div style={{ fontSize: S.type.pageHeading + 6, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.12, color: C.text }}>
          {SAMPLE.headline.map((l, i) => (
            <div key={i}>
              {nonEm(l)} {em(l) ? <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.muted, fontWeight: 400 }}>{em(l)}</span> : null}
            </div>
          ))}
        </div>
      </div>,
    ),
  },
  {
    key: "diag",
    x: 40,
    y: 1390,
    w: PW - 80,
    h: 320,
    lift: 120,
    stand: 46,
    radius: 22,
    node: card(
      <svg width={PW - 80} height={380} viewBox="0 0 640 380" style={{ position: "absolute", left: 40, top: 0, width: 540, height: 320 }}>
        <line x1={40} y1={70} x2={300} y2={190} stroke={C.text} strokeWidth={4} strokeLinecap="round" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 12 + 0.26;
          return <line key={i} x1={340 + 58 * Math.cos(a)} y1={210 + 58 * Math.sin(a)} x2={340 + 140 * Math.cos(a)} y2={210 + 140 * Math.sin(a)} stroke={i % 2 ? C.sky : C.accent} strokeWidth={6} strokeLinecap="round" />;
        })}
        <circle cx={340} cy={210} r={40} fill={C.accent} />
        <circle cx={340} cy={210} r={14} fill={C.white} />
      </svg>,
    ),
  },
  { key: "d1", x: 40, y: 1800, w: 210, h: 64, lift: 200, stand: 54, radius: 32, node: chip(SAMPLE.diagram.in) },
  { key: "d2", x: 280, y: 1800, w: 360, h: 64, lift: 200, stand: 54, radius: 32, node: chip(SAMPLE.diagram.label, true) },
  { key: "d3", x: 40, y: 1890, w: 420, h: 64, lift: 160, stand: 54, radius: 32, node: chip(SAMPLE.diagram.out) },
  {
    key: "num",
    x: 40,
    y: 2050,
    w: PW - 80,
    h: 330,
    lift: 112,
    stand: 30,
    radius: 22,
    node: card(
      <div style={{ position: "absolute", left: 40, top: 26, right: 40 }}>
        <div style={{ fontSize: 170, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: C.text }}>
          {SAMPLE.number.value.toFixed(SAMPLE.number.decimals)}
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: C.muted }}>{SAMPLE.number.unit}</span>
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.35, color: C.muted, marginTop: 14 }}>{SAMPLE.number.caption}</div>
      </div>,
    ),
  },
  ...SAMPLE.list.map(
    (item, i): Lift => ({
      key: `l${i}`,
      x: 40,
      y: 2610 + i * 150,
      w: PW - 80,
      h: 120,
      lift: 60,
      stand: 30,
      radius: 22,
      node: card(
        <div style={{ position: "absolute", left: 32, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: C.muted }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em" }}>{item}</span>
        </div>,
      ),
    }),
  ),
];

/** Page y of the camera at t when the flight starts at the beginning of the speed curve. */
const flightPos = (t: number): number => {
  const pts = S.camera.speed as [number, number][];
  let pos = 0;
  for (let i = 1; i < pts.length; i++) {
    const [t0, s0] = pts[i - 1];
    const [t1, s1] = pts[i];
    if (t <= t0) break;
    const u = Math.min(t, t1);
    const su = s0 + ((s1 - s0) * (u - t0)) / (t1 - t0);
    pos += ((s0 + su) / 2) * (u - t0);
  }
  return pos * S.camera.cruise;
};

const Flight: React.FC<{ target: number; hero: number; k: number; start?: boolean }> = ({ target, hero, k, start = false }) => {
  const t = useSeconds();
  const focusY = start ? target - flightPos(hero) + flightPos(t) : glide(t, target, hero);
  return (
    <Floor>
      <Fly focusY={focusY} distance={distanceAt(k)} pageH={PAGE_H} page={<Page />} lifts={LIFTS} />
    </Floor>
  );
};

const HEROES = { title: 2.6, headline: 2.4, diagram: 2.4, number: 2.4, list: 2.4, end: 3.2 };

const Title: React.FC = () => <Flight target={300} hero={HEROES.title} k={0} start />;
const HeadlineSample: React.FC = () => <Flight target={1010} hero={HEROES.headline} k={0.2} />;
const Diagram: React.FC = () => <Flight target={1660} hero={HEROES.diagram} k={0.45} />;
const NumberSample: React.FC = () => <Flight target={2240} hero={HEROES.number} k={0.7} />;
const List: React.FC = () => <Flight target={2790} hero={HEROES.list} k={0.9} />;

/** The title card: the badge, two lines word by word, the page landed flat with its tiles hanging off the corners. */
const End: React.FC = () => {
  const t = useSeconds();
  const L = S.layout;
  const pw = L.page.landedWidth;
  const scale = pw / PW;
  const creep = 1 + S.camera.holdCreep * ease("creep", t - 0.6);
  const land = ease("dive", t / 0.5);
  const top = L.page.landedTop;
  const h = 1600 - top;
  return (
    <Floor>
      <div style={{ position: "absolute", left: (W - pw) / 2, top, width: pw, height: h, transform: `scale(${creep * (0.92 + 0.08 * land)})`, transformOrigin: "50% 0%", borderRadius: L.page.landedRadius, overflow: "hidden", backgroundColor: C.white, boxShadow: `0 30px 70px -30px rgba(26,33,51,0.35)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: h / scale, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          <Page />
        </div>
      </div>
      <Tile x={100} y={top - 30} size={170} bg={C.sun} glyph="sun" fg={C.white} at={0.3} rot={-8} />
      <Tile x={250} y={top - 110} size={140} bg={C.white} glyph="ring" fg={C.accent} at={0.4} rot={6} />
      <Tile x={840} y={top - 110} size={140} bg={C.text} glyph="spark" fg={C.white} at={0.45} rot={-6} />
      <Tile x={985} y={top - 20} size={190} bg={C.accent} glyph="drop" fg={C.white} at={0.35} rot={8} />
      <Badge text={SAMPLE.end.cta} y={L.badgeY} at={0.2} />
      <TwoLine line={nonEm(SAMPLE.end.line)} tail={plain(em(SAMPLE.end.line))} y={L.titleY} at={0.5} />
    </Floor>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: HEROES.title, component: Title },
  { id: "headline", duration: 2.8, hero: HEROES.headline, component: HeadlineSample },
  { id: "diagram", duration: 2.8, hero: HEROES.diagram, component: Diagram },
  { id: "number", duration: 2.8, hero: HEROES.number, component: NumberSample },
  { id: "list", duration: 2.8, hero: HEROES.list, component: List },
  { id: "end", duration: 3.6, hero: HEROES.end, component: End },
];

