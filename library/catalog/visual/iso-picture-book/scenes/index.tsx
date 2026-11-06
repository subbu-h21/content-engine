/**
 * Isometric Picture Book on the shared sample content, all in one calm square: the question lands on the floor beside
 * a tidy line of people, six people walk six lanes at once, a molecule on a plinth sends blue arrows to people in their
 * stand-here outlines, two floor bars stand in true proportion, three stops along one route, and a bench of people
 * looking up at the end.
 */
import React from "react";
import { plain, SAMPLE, type Sample } from "../../kit";
import { Bar, C, ease, Ground, LEGS, Place, S, T, TOPS, tri, useT } from "./parts";

const LANES = [C.accent, C.ginger, TOPS[3], C.sage, C.blue, TOPS[2]];
const PLINTH = tri(C.concrete);
const SEAT = tri(C.blue);

/** A low planter with a clipped hedge: a few calm props around the edge of the frame. */
const planter = (s: Place, x: number, y: number, w: number, d: number) => {
  s.box(x, y, 0, w, d, 0.45, tri("#cec7ba"));
  s.box(x + 0.08, y + 0.08, 0.45, w - 0.16, d - 0.16, 0.34, tri(C.sage));
};

const Title: React.FC = () => {
  const t = useT();
  const s = new Place(540, 860);
  const end = s.wordAt("Why is the sky", 170, 880, T.small, t, 0.2, { weight: 500 });
  s.wordAt("blue?", 225, 1045, T.title, t, end - 1.1, { accent: 4 });
  // a tidy line of people heading up-right, nothing raised in front of the type
  const [px, py] = s.at(330, 1345);
  for (let i = 0; i < 7; i++) s.person(px, py - i * 0.9, TOPS[i % 4], LEGS[(i + 1) % 4], 1);
  s.outline(px - 0.45, py - 7 * 0.9 - 0.45, 0.9, 0.9, C.accent);
  s.person(px, py - 7 * 0.9, C.blue2, LEGS[0], 1);
  const [qx, qy] = s.at(780, 330);
  planter(s, qx, qy, 1, 3.6);
  return (
    <Ground place={s}>
      <Bar text={SAMPLE.kicker} t={t} at={0.4} />
    </Ground>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useT();
  const s = new Place(540, 740);
  const lane = ease("grow", t - 0.2);
  const split = ease("grow", t - 0.8);
  // the ginger lead-in, then six lanes side by side running up-right
  s.lane([[-7.5, 2.3], [-1.6, 2.3]], 0.34, C.ginger, lane);
  LANES.forEach((c, i) => {
    const x = -1.6 + i * 0.78;
    s.lane([[-1.6, 2.3], [x, 2.3], [x, -7.5]], 0.22, c, split);
    const walked = Math.min(3.5, Math.max(0, t - 0.9) * S.motion.walk);
    s.person(x, 1.6 - walked, c, LEGS[i % 4], 1, t < 3.2 ? t * 9 + i : 0);
  });
  const end = s.wordAt("every colour", 262, 1205, T.small + 22, t, 0.5, { weight: 500 });
  s.wordAt("at once.", 400, 1300, T.display, t, end - 0.85, { accent: 7 });
  return (
    <Ground place={s}>
      <Bar text={plain(SAMPLE.headline.join(" "))} t={t} at={1.1} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useT();
  const s = new Place(540, 620);
  const lead = ease("grow", t - 0.2);
  const hit = 1.1;
  // sunlight comes along the ginger line to the plinth
  s.lane([[-9, -0.1], [-1, -0.1]], 0.34, C.ginger, lead);
  s.box(-0.9, -0.9, 0, 1.8, 1.8, 0.55, PLINTH);
  s.box(-0.6, -0.6, 0.55, 1.2, 1.2, 0.5, PLINTH);
  s.ball(-0.32, 0.34, 1.75, 0.56, tri(C.soft), 1);
  s.ball(0.34, -0.32, 1.75, 0.56, tri(C.soft), 2);
  // blue arrows grow ahead of what follows and branch along the world axes
  const ends: [number, number][] = [[0, -3.7], [0, 3.7], [3.7, 0]];
  const stops: [number, number][] = [[-0.45, -5], [-0.45, 4.1], [4.1, -0.45]];
  ends.forEach((e, i) => {
    const a: [number, number] = [Math.sign(e[0]) * 1.1, Math.sign(e[1]) * 1.1];
    s.arrow(a, e, C.blue, ease("grow", t - hit - i * 0.12));
    const [ox, oy] = stops[i];
    s.outline(ox, oy, 0.9, 0.9, C.accent);
    s.person(ox + 0.45, oy + 0.45, TOPS[(i + 1) % 4], LEGS[i], 1);
  });
  const end = s.wordAt(plain(SAMPLE.diagram.object), 200, 1170, T.small, t, 1.4, { weight: 500 });
  s.wordAt("scatters", 240, 1300, T.display, t, end - 1.2, { accent: 0 });
  return (
    <Ground place={s}>
      <Bar text={SAMPLE.diagram.out} t={t} at={2.0} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const s = new Place(540, 840);
  const unit = 1.12; // 1.12 m of floor per unit of scattering: the bars stay in true proportion
  const blue = n.value * unit;
  const red = 1 * unit;
  const [bx, by] = s.at(150, 960);
  const w = 1.5;
  const rx = bx + 2.8;
  const pb = ease("grow", t - 0.2);
  const pr = ease("grow", t - 0.5);
  s.mark([[bx, by], [bx + w, by], [bx + w, by - blue * pb], [bx, by - blue * pb]], C.blue);
  s.mark([[rx, by], [rx + w, by], [rx + w, by - red * pr], [rx, by - red * pr]], C.tint);
  // a dashed bracket marks the difference once the bars have been still
  const dash = ease("grow", t - 1.2);
  const qx = rx + w + 0.45;
  const span = blue - red;
  for (let i = 0; i < 12 * dash; i++) {
    const a = by - red - (i + 0.2) * (span / 12);
    s.mark([[qx, a], [qx + 0.07, a], [qx + 0.07, a - span / 20], [qx, a - span / 20]], C.ink);
  }
  s.mark([[rx + w, by - red], [qx + 0.07, by - red], [qx + 0.07, by - red - 0.07], [rx + w, by - red - 0.07]], C.ink);
  s.mark([[bx + w, by - blue], [qx + 0.07, by - blue], [qx + 0.07, by - blue - 0.07], [bx + w, by - blue - 0.07]], C.ink);
  s.person(bx + w / 2, by + 0.8, TOPS[1], LEGS[0], 1);
  s.person(rx + w / 2, by + 0.8, TOPS[0], LEGS[1], 1);
  const a = s.word("450 nm", bx + w - 0.42, by - 0.55, 84, t, 0.9, { weight: 500, fill: C.light });
  s.word("700 nm", rx + w - 0.3, by - red - 0.3, 72, t, a - 0.5, { weight: 500 });
  const done = s.wordAt(n.value.toFixed(n.decimals), 560, 1360, T.title - 30, t, 1.2, { fill: C.accent });
  // the unit is painted along the world axes: a typed × lying on the floor would read as a +
  const [ux, uy] = s.at(888, 1172);
  const up = ease("grow", t - done);
  s.lane([[ux - 0.62, uy], [ux + 0.62, uy]], 0.24, C.accent, up);
  s.lane([[ux, uy - 0.62], [ux, uy + 0.62]], 0.24, C.accent, up);
  return (
    <Ground place={s}>
      <Bar text="more scattering for blue than red" t={t} at={1.6} />
    </Ground>
  );
};

const List: React.FC = () => {
  const t = useT();
  const s = new Place(540, 860);
  const at = [0.2, 0.75, 1.3];
  const a = s.at(250, 1210);
  const b = s.at(705, 947);
  const c = s.at(450, 800);
  // one route with right-angle turns, heading away from us: sunlight in, then blue
  s.lane([[a[0], a[1] + 3.5], a, b], 0.3, C.ginger, ease("grow", t - at[0]));
  s.lane([b, c], 0.3, C.blue, ease("grow", t - at[1]));
  s.arrow([b[0], b[1] + 0.15], [b[0], b[1] - 2.6], C.blue, ease("grow", t - at[1] - 0.3));
  s.outline(c[0] - 0.45, c[1] - 0.45, 0.9, 0.9, C.accent);
  s.person(c[0], c[1], TOPS[0], LEGS[2], 1);
  s.wordAt("1 enters", 330, 1335, T.small + 12, t, at[0], { weight: 500 });
  s.wordAt("2 scatters", 195, 1085, T.small + 6, t, at[1], { weight: 500 });
  s.wordAt("3 reaches you", 150, 745, T.small + 12, t, at[2], { weight: 500, accent: 0 });
  return (
    <Ground place={s}>
      <Bar text="In three steps" t={t} at={0.4} />
    </Ground>
  );
};

const End: React.FC = () => {
  const t = useT();
  const s = new Place(540, 800);
  const ws = plain(SAMPLE.end.line).split(" ");
  const end = s.wordAt(`${ws[0]} ${ws[1]}`, 215, 800, T.small + 22, t, 0.2, { weight: 500 });
  s.wordAt(ws[2], 250, 985, T.title - 34, t, end - 0.7, { accent: ws[2].length - 1 });
  // a bench of people seen from behind, all looking up
  const [bx, by] = s.at(380, 1390);
  s.bench(bx, by - 5.6, 5.6, SEAT);
  [0, 1, 2, 3, 4, 5].forEach((i) => s.seated(bx, by - 5.2 + i * 0.92, TOPS[i % 4], 1));
  const [qx, qy] = s.at(800, 340);
  planter(s, qx, qy, 1, 3.4);
  return (
    <Ground place={s}>
      <Bar text={SAMPLE.end.cta} t={t} at={1.0} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 3.0, component: Title },
  { id: "headline", duration: 3.4, hero: 3.2, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.3, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.95, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.3, component: List },
  { id: "end", duration: 3.0, hero: 2.75, component: End },
];
