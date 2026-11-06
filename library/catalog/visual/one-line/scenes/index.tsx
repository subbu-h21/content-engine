/** One Line on the shared sample content: each sample is one unbroken line (with one coloured stretch) and its words. */
import React from "react";
import { SAMPLE, words, wrap, type Sample } from "../../kit";
import { arc, chain, M, OneLine, Page, rotate, S, Script, T, through, W, wave, Words, type Pt } from "./parts";

const plainOf = (s: string) => words(s).filter((w) => !w.em).map((w) => w.text).join(" ");
const emOf = (s: string) => words(s).filter((w) => w.em).map((w) => w.text).join(" ");
const RIGHT = S.layout.textRight;
const rev = (pts: Pt[]) => pts.slice().reverse();

// ------------------------------------------------------------------ title: a face looking up; the line climbs its gaze to the sun

const TITLE_LINE = (() => {
  const pivot: Pt = [470, 1500];
  const tilt = -20;
  // the profile is drawn at 1×, then grown 1.3× about the pivot and tilted up
  const grow = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [pivot[0] + (x - pivot[0]) * 1.3, pivot[1] + (y - pivot[1]) * 1.3] as Pt);
  const back = rotate(grow(through([[330, 1790], [318, 1610], [300, 1500], [300, 1400], [330, 1300], [390, 1232], [470, 1200], [545, 1214], [600, 1255], [628, 1305], [640, 1345]])), pivot, tilt);
  const eye = rotate(grow(through([[640, 1345], [600, 1354], [622, 1376], [652, 1362]], 8)), pivot, tilt);
  const face = rotate(
    grow(through([[652, 1362], [658, 1392], [672, 1420], [712, 1456], [696, 1474], [668, 1476], [678, 1494], [690, 1508], [668, 1516], [688, 1530], [674, 1548], [680, 1576], [652, 1604], [614, 1614], [590, 1642], [586, 1700]])),
    pivot,
    tilt,
  );
  const eyePt = eye[eye.length - 1];
  const sun: Pt = [800, 690];
  const r = 86;
  const toSun = Math.atan2(eyePt[1] - sun[1], eyePt[0] - sun[0]);
  const rimDeg = (toSun * 180) / Math.PI;
  const rim: Pt = [sun[0] + Math.cos(toSun) * r, sun[1] + Math.sin(toSun) * r];
  const ray = [eyePt, rim] as Pt[];
  const circle = arc(sun[0], sun[1], r, r, rimDeg, rimDeg - 360, 72);
  const leftRim: Pt = [sun[0] - r, sun[1]];
  const toLeft = arc(sun[0], sun[1], r, r, rimDeg, 180, 20);
  const sky = wave(leftRim, [120, 760], 16, 52);
  return chain([back, eye, ray, circle, toLeft, { pts: sky, accent: true }, { pts: rev(sky), accent: true }, rev(toLeft), rev(ray), face]);
})();

const Title: React.FC = () => (
  <Page>
    <OneLine path={TITLE_LINE} at={0.2} dur={3.4} zoom={2.0} follow={0.75} pullFrom={0.45} seed={3} />
    <Words lines={[SAMPLE.kicker]} x={M} y={300} at={0.1} size={T.label} />
    <Script lines={[plainOf(SAMPLE.title), emOf(SAMPLE.title)]} x={M} y={440} at={0.4} />
  </Page>
);

// ------------------------------------------------------------------ headline: the sun's line becomes six waves, each shorter

const HEAD_LINE = (() => {
  const sun: Pt = [200, 760];
  const r = 78;
  const x0 = 160;
  const x1 = 920;
  const wls = [170, 140, 115, 95, 78, 62];
  const pieces: Parameters<typeof chain>[0] = [arc(sun[0], sun[1], r, r, 90, 90 - 360, 64)];
  wls.forEach((wl, i) => {
    const y = 930 + i * 110;
    const ltr = i % 2 === 0;
    const pts = wave([ltr ? x0 : x1, y], [ltr ? x1 : x0, y], 24, wl);
    pieces.push(i === wls.length - 1 ? { pts, accent: true } : pts);
    if (i < wls.length - 1) pieces.push(ltr ? arc(x1, y + 55, 55, 55, -90, 90, 24) : arc(x0, y + 55, 55, 55, 270, 90, 24));
  });
  return chain(pieces);
})();

const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const l1 = all.slice(0, 2).map((w) => w.text).join(" ");
  const l2 = all.slice(2).map((w) => w.text).join(" ");
  return (
    <Page>
      <OneLine path={HEAD_LINE} at={0.3} dur={3.2} zoom={1.7} follow={0.7} pullFrom={0.5} seed={5} />
      <Script lines={[l1, l2]} x={M} y={330} at={0.1} size={T.headline - 8} />
      <Words lines={["long waves · red"]} x={RIGHT} y={872} at={1.2} size={T.label} anchor="end" />
      <Words lines={["short waves · blue"]} x={RIGHT} y={1560} at={3.2} size={T.label} anchor="end" />
    </Page>
  );
};

// ------------------------------------------------------------------ diagram: a beam, a molecule, a star of blue, red going on

const DIA_LINE = (() => {
  const c: Pt = [560, 860];
  const A: Pt = [510, 870];
  const B: Pt = [612, 850];
  const r = 70;
  const src: Pt = [110, 410];
  const inDeg = (Math.atan2(c[1] - src[1], c[0] - src[0]) * 180) / Math.PI;
  const aStart: Pt = [A[0] + r * Math.cos((225 * Math.PI) / 180), A[1] + r * Math.sin((225 * Math.PI) / 180)];
  const pieces: Parameters<typeof chain>[0] = [[src, aStart], arc(A[0], A[1], r, r, 225, 225 + 360, 60), arc(B[0], B[1], r, r, 200, 200 + 360, 60)];
  const rays = [-95, -50, -5, 95, 140, 185];
  const star: Pt[] = [];
  let prev: number | null = null;
  for (const d of rays) {
    if (prev !== null) star.push(...arc(c[0], c[1], 112, 104, prev, d, 12));
    const a0 = ((d - 4) * Math.PI) / 180;
    const a1 = ((d + 4) * Math.PI) / 180;
    star.push([c[0] + Math.cos((d * Math.PI) / 180) * 112, c[1] + Math.sin((d * Math.PI) / 180) * 104], [c[0] + Math.cos(a0) * 300, c[1] + Math.sin(a0) * 286], [c[0] + Math.cos(a1) * 304, c[1] + Math.sin(a1) * 290], [c[0] + Math.cos((d * Math.PI) / 180) * 112, c[1] + Math.sin((d * Math.PI) / 180) * 104]);
    prev = d;
  }
  pieces.push({ pts: star, accent: true });
  pieces.push(arc(c[0], c[1], 112, 104, 185, inDeg + 360, 40));
  const u = [Math.cos((inDeg * Math.PI) / 180), Math.sin((inDeg * Math.PI) / 180)];
  pieces.push([[c[0] + u[0] * 112, c[1] + u[1] * 104], [c[0] + u[0] * 560, c[1] + u[1] * 560]]);
  return chain(pieces);
})();

const Diagram: React.FC = () => (
  <Page>
    <OneLine path={DIA_LINE} at={0.2} dur={3.3} zoom={1.8} follow={0.7} pullFrom={0.5} seed={7} />
    <Words lines={[SAMPLE.diagram.in]} x={M} y={360} at={0.1} size={T.body} />
    <Words lines={[SAMPLE.diagram.object]} x={M} y={1130} at={1.2} size={T.body} />
    <Words lines={["red goes on"]} x={RIGHT} y={1320} at={3.3} size={T.label} anchor="end" />
    <Words lines={[SAMPLE.diagram.label]} x={W / 2} y={1490} at={3.5} size={T.body + 8} anchor="middle" weight={600} />
  </Page>
);

// ------------------------------------------------------------------ number: the line writes 5.9× and draws two bars to the true ratio

const NUM_LINE = (() => {
  const five = through([[300, 380], [150, 380], [140, 515], [205, 488], [280, 508], [312, 578], [292, 645], [222, 680], [150, 666], [118, 634]], 12);
  const swash = through([[118, 634], [170, 700], [290, 704], [341, 650]], 10);
  // the decimal point: a tight spiral that reads as a dot
  const dot: Pt[] = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 5 + Math.PI;
    const rr = 15 - (i / 40) * 11;
    return [356 + Math.cos(a) * rr, 648 + Math.sin(a) * rr] as Pt;
  });
  const nineTail = through([[356, 652], [372, 686], [450, 692], [520, 640], [548, 560], [552, 470]], 10);
  const nineBowl = arc(476, 466, 76, 86, 0, -360, 64);
  const times: Pt[] = [[552, 470], [610, 540], [760, 680], [685, 610], [760, 540], [610, 680]];
  const red = 820 / SAMPLE.number.value;
  const redBar: Pt[] = [[90 + red, 1000], [90, 1000], [90, 1090], [90 + red, 1090], [90 + red, 1000]];
  const drop = through([[610, 680], [520, 820], [300, 930], [90 + red, 1000]], 12);
  const tick: Pt[] = [[90 + red, 1000], [90 + red, 1090], [90 + red, 1180]];
  const blueBar: Pt[] = [[90 + red, 1180], [910, 1180], [910, 1270], [90, 1270], [90, 1180], [90 + red, 1180]];
  return chain([five, swash, dot, nineTail, nineBowl, times, drop, redBar, tick, { pts: blueBar, accent: true }]);
})();

const NumberSample: React.FC = () => (
  <Page>
    <OneLine path={NUM_LINE} at={0.2} dur={3.4} zoom={1.6} follow={0.65} pullFrom={0.55} seed={9} />
    <Words lines={["red · 700 nm"]} x={260} y={1062} at={2.4} size={T.label} />
    <Words lines={["blue · 450 nm"]} x={M} y={1336} at={2.9} size={T.label} />
    <Words lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} x={M} y={1460} at={2.0} size={T.body - 4} />
  </Page>
);

// ------------------------------------------------------------------ list: one line through a sun, a molecule, an eye

const LIST_LINE = (() => {
  const x = 200;
  const sun = arc(x, 560, 60, 60, -90, 270, 56);
  const down1: Pt[] = [[x, 500], [x, 560 + 60]];
  const molA = arc(x - 26, 964, 36, 36, 270, 270 + 360, 40);
  const molB = arc(x + 26, 956, 36, 36, 200, 200 + 360, 40);
  const star: Pt[] = [];
  for (const d of [-40, 10, 60]) {
    const a = (d * Math.PI) / 180;
    star.push([x + Math.cos(a) * 66, 960 + Math.sin(a) * 58], [x + Math.cos(a - 0.06) * 128, 960 + Math.sin(a - 0.06) * 116], [x + Math.cos(a + 0.06) * 130, 960 + Math.sin(a + 0.06) * 118], [x + Math.cos(a) * 66, 960 + Math.sin(a) * 58]);
  }
  const lidUp = through([[110, 1370], [200, 1312], [290, 1370]], 16);
  const lidLow = through([[290, 1370], [200, 1418], [110, 1370]], 16);
  const iris = arc(x, 1352, 28, 28, 180, 180 + 360, 36);
  return chain([sun, down1, [[x, 620], [x - 26, 928]], molA, molB, { pts: star, accent: true }, [[x + 30, 1000], [110, 1370]], lidUp, lidLow, iris]);
})();

const List: React.FC = () => {
  const rows = [560, 960, 1360];
  return (
    <Page>
      <OneLine path={LIST_LINE} at={0.2} dur={3.0} zoom={1.6} follow={0.6} pullFrom={0.55} seed={11} />
      {SAMPLE.list.map((s, i) => (
        <Words key={i} lines={wrap(s, 16)} x={360} y={rows[i] - 10} at={0.6 + i * 0.95} size={T.body + 6} />
      ))}
    </Page>
  );
};

// ------------------------------------------------------------------ end: a blue sky line, then an eye looking up

const END_LINE = (() => {
  const sky = wave([150, 900], [930, 900], 18, 70);
  const down = through([[930, 900], [900, 1060], [840, 1250]], 12);
  const lidUp = through([[840, 1250], [540, 1076], [240, 1250]], 24);
  const lidLow = through([[240, 1250], [540, 1384], [840, 1250]], 24);
  const inward: Pt[] = [[840, 1250], [628, 1184]];
  const iris = arc(540, 1184, 88, 88, 0, -360, 64);
  return chain([{ pts: sky, accent: true }, down, lidUp, lidLow, inward, iris]);
})();

const End: React.FC = () => (
  <Page>
    <OneLine path={END_LINE} at={0.3} dur={2.8} zoom={1.5} follow={0.55} pullFrom={0.55} seed={13} />
    <Script lines={[plainOf(SAMPLE.end.line), emOf(SAMPLE.end.line)]} x={W / 2} y={460} at={0.1} anchor="middle" />
    <Words lines={[SAMPLE.end.cta]} x={W / 2} y={1540} at={3.2} size={T.label} anchor="middle" weight={600} />
  </Page>
);

export const samples: Sample[] = [
  { id: "title", duration: 4.6, hero: 4.2, component: Title },
  { id: "headline", duration: 4.4, hero: 4.0, component: HeadlineSample },
  { id: "diagram", duration: 4.6, hero: 4.2, component: Diagram },
  { id: "number", duration: 4.6, hero: 4.3, component: NumberSample },
  { id: "list", duration: 4.0, hero: 3.6, component: List },
  { id: "end", duration: 4.0, hero: 3.6, component: End },
];
