/**
 * Low-poly on the shared sample content: an island rising for the title, six colour columns around a faceted sun at
 * dawn, an air molecule scattering blue shards, the 5.9× as two hex columns at dusk, three tiny islands for the steps,
 * and the island at night for the end.
 */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import {
  C,
  Caption,
  ease,
  hexColumn,
  hexXY,
  house,
  ico,
  islandTiles,
  lighthouse,
  mix,
  cone,
  popK,
  Ribbon,
  riseK,
  rnd,
  S,
  Scene3D,
  shard,
  SPECTRUM,
  SubLine,
  Subtitle,
  Surf,
  tileObj,
  Title,
  tree,
  WALLS,
  ROOFS,
  lightFor,
  project,
  World,
  type Obj,
  type Tile,
  type TimeKey,
  type V3,
  type View,
} from "./parts";

const T = S.type;
const SLOT = S.motion.slot;

/** When a tile of an island rises: ring by ring from the centre, each tile on its own slot fraction. */
const tileAt = (tl: Tile, start: number) => start + tl.ring * SLOT * 1.4 + rnd(tl.q * 9 + tl.r, 2) * SLOT;
const find = (tiles: Tile[], q: number, r: number) => tiles.find((tl) => tl.q === q && tl.r === r);

/** Props on an island: houses, pines, trees, a lighthouse, each popping in after its tile settles. */
const props = (tiles: Tile[], t: number, start: number, night = false): Obj[] => {
  const out: Obj[] = [];
  const on = (q: number, r: number, make: (x: number, y: number, z: number, s: number) => Obj, delay = 0.12) => {
    const tl = find(tiles, q, r);
    if (!tl) return;
    const settle = tileAt(tl, start) + S.motion.recipes.rise.duration;
    const s = popK(t - settle - delay);
    if (s <= 0.02) return;
    out.push(make(tl.x, tl.y, tl.h * riseK(t - tileAt(tl, start)), s));
  };
  const win = night ? C.window : undefined;
  on(1, 1, (x, y, z, s) => house(x, y, z, s * 1.1, WALLS[0], ROOFS[0], win));
  on(-2, 1, (x, y, z, s) => house(x, y, z, s, WALLS[2], ROOFS[1], win), 0.2);
  on(2, -1, (x, y, z, s) => house(x, y, z, s, WALLS[4], ROOFS[3], win), 0.28);
  on(-1, 2, (x, y, z, s) => house(x, y, z, s * 0.9, WALLS[1], ROOFS[4], win), 0.34);
  on(-1, -1, (x, y, z, s) => cone(x, y, z, 0.36 * s, 1.0 * s, C.pine));
  on(0, -2, (x, y, z, s) => cone(x, y, z, 0.32 * s, 0.9 * s, C.pine2), 0.18);
  on(-2, 0, (x, y, z, s) => cone(x, y, z, 0.34 * s, 1.05 * s, C.pine), 0.26);
  on(1, -2, (x, y, z, s) => tree(x, y, z, s), 0.22);
  on(2, 0, (x, y, z, s) => tree(x, y, z, s * 0.9, [C.leaf2, C.leaf]), 0.3);
  const coast = tiles.find((tl) => tl.ring === 3 && tl.q === 3 && tl.r === -2) ?? tiles.find((tl) => tl.ring === 3 && tl.q > 0);
  if (coast) on(coast.q, coast.r, (x, y, z, s) => lighthouse(x, y, z, s, night ? C.window : undefined), 0.4);
  return out;
};

const Island: React.FC<{ tiles: Tile[]; view: View; time: TimeKey; start: number; extra?: Obj[]; night?: boolean; withProps?: boolean }> = ({
  tiles,
  view,
  time,
  start,
  extra = [],
  night = false,
  withProps = true,
}) => {
  const t = useSeconds();
  const objs: Obj[] = tiles.map((tl) => tileObj(tl, riseK(t - tileAt(tl, start))));
  if (withProps) objs.push(...props(tiles, t, start, night));
  objs.push(...extra);
  return (
    <>
      <Surf tiles={tiles.map((tl) => ({ x: tl.x, y: tl.y, k: riseK(t - tileAt(tl, start)) }))} view={view} />
      <Scene3D objs={objs} view={view} light={lightFor(time)} bloom={night ? S.finish.bloomNight : S.finish.bloom} />
    </>
  );
};

const TitleSample: React.FC = () => {
  const time: TimeKey = "day";
  const view: View = { cx: 540, cy: 1170, s: 76 };
  const tiles = islandTiles(3, 4, { peak: true, ragged: 0.3 });
  return (
    <World time={time} band={760}>
      <Island tiles={tiles} view={view} time={time} start={0.1} />
      <Title lines={["Why is", "the sky", "*blue?*"]} size={T.title} y={250} at={0.3} time={time} />
      <SubLine text={SAMPLE.kicker} y={680} at={1.3} time={time} />
    </World>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const time: TimeKey = "dawn";
  const view: View = { cx: 540, cy: 1060, s: 82 };
  const all = islandTiles(2, 7, { ragged: 0.2 });
  const outer = all.filter((tl) => tl.ring === 2);
  const ring1 = all.filter((tl) => tl.ring === 1).sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
  const colAt = 1.0;
  const extra: Obj[] = [];
  const [cx, cy] = hexXY(0, 0);
  extra.push(hexColumn(cx, cy, 0.9 * riseK(t - 0.6), C.white, mix(C.white, C.sandSide, 0.5)));
  ring1.forEach((tl, i) => {
    const k = riseK(t - colAt - i * SLOT);
    extra.push(hexColumn(tl.x, tl.y, Math.max(0.02, 1.35 * k), mix(SPECTRUM[i], "#ffffff", 0.2), SPECTRUM[i]));
  });
  const sp = popK(t - 0.8);
  if (sp > 0.02) extra.push(ico([cx, cy, 3.9], 0.95 * sp, [C.yellow, mix(C.yellow, C.orange, 0.35)], 1, t * 0.4, 0.5));
  const body = wrap(SAMPLE.body, 34);
  return (
    <World time={time} band={620}>
      <Island tiles={outer} view={view} time={time} start={0.1} extra={extra} withProps={false} />
      <Title lines={["Sunlight carries", "every colour", "*at once.*"]} size={64} y={250} at={0.3} time={time} />
      <Subtitle lines={body} y={1300} at={2.2} time={time} />
    </World>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const time: TimeKey = "day";
  const view: View = { cx: 540, cy: 1140, s: 62 };
  const tiles = islandTiles(2, 11, { ragged: 0.25 });
  const zm = (1140 - 690) / (0.866 * 62);
  const mc: V3 = [0, 0, zm];
  const [mx, my] = project(mc, view);
  const beamAt = 0.3;
  const hitAt = beamAt + S.motion.recipes.beam.duration;
  const extra: Obj[] = [];
  const mp = popK(t - 0.15);
  if (mp > 0.02) extra.push(ico(mc, 2.2 * mp, [C.white, mix(C.white, C.blueLight, 0.4), mix(C.white, C.blueLight, 0.2)], 1, 0.3 + t * 0.25, 0.45));
  // blue shards fly out in every direction, a burst every half second after the hit
  const life = S.motion.recipes.fly.duration;
  const dirs = Array.from({ length: 16 }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / 16;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    return [r * Math.cos(a), r * Math.sin(a), y] as V3;
  });
  for (let b = 0; b < 8; b++) {
    const age = t - hitAt - b * 0.5;
    if (age < 0 || age > life) continue;
    const d = 2.6 + 5.0 * ease("fly", age);
    dirs.forEach((dv, i) => {
      const s = popK(age) * 0.3;
      extra.push(shard([mc[0] + dv[0] * d, mc[1] + dv[1] * d, mc[2] + dv[2] * d * 0.9], s, [C.blue, C.blueLight], i + age * 3));
    });
  }
  const beam = ease("beam", t - beamAt);
  const red = ease("beam", t - hitAt);
  const a: [number, number] = [-60, 300];
  const dx = mx - a[0];
  const dy = my - a[1];
  return (
    <World time={time} band={520}>
      <Ribbon id="d-sun" a={a} b={[mx, my]} p={beam} />
      {red > 0 ? <Ribbon id="d-red" a={[mx, my]} b={[mx + dx * 0.95, my + dy * 0.95]} p={red} colr={C.red} width={S.elements.ribbon.width * 0.45} /> : null}
      <Island tiles={tiles} view={view} time={time} start={0} extra={extra} />
      <Subtitle kicker={SAMPLE.diagram.object} lines={[SAMPLE.diagram.label]} y={1330} at={1.3} time={time} />
    </World>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const time: TimeKey = "dusk";
  const view: View = { cx: 540, cy: 1090, s: 84 };
  const tiles = islandTiles(1, 5, { ragged: 0 });
  const n = SAMPLE.number;
  const unitH = 0.92;
  const blueTile = hexXY(-1, 1);
  const redTile = hexXY(1, -1);
  const tb = tiles.find((tl) => tl.q === -1 && tl.r === 1)!;
  const tr = tiles.find((tl) => tl.q === 1 && tl.r === -1)!;
  const colAt = 0.9;
  const kb = riseK(t - colAt);
  const kr = riseK(t - colAt - 2 * SLOT);
  const extra: Obj[] = [
    hexColumn(blueTile[0], blueTile[1], Math.max(0.02, n.value * unitH * kb), mix(C.blue, "#ffffff", 0.45), mix(C.blue, "#ffffff", 0.2), tb.h, 0.82),
    hexColumn(redTile[0], redTile[1], Math.max(0.02, 1 * unitH * kr), mix(C.red, "#ffffff", 0.4), mix(C.red, "#ffffff", 0.15), tr.h, 0.82),
  ];
  const [bx, by] = project([blueTile[0], blueTile[1], 0], view);
  const [rx, ry] = project([redTile[0], redTile[1], 0], view);
  return (
    <World time={time} band={700}>
      <Island tiles={tiles} view={view} time={time} start={0} extra={extra} withProps={false} />
      <Title lines={[`${n.value.toFixed(n.decimals)}*${n.unit}*`]} size={T.number} y={230} at={0.3} time={time} tracking={T.numberTracking} />
      <Caption lines={["450 nm"]} x={bx - 60 - 150} y={by + 52} w={300} align="center" at={1.6} time={time} size={T.label} />
      <Caption lines={["700 nm"]} x={rx + 60 - 150} y={ry + 52} w={300} align="center" at={1.7} time={time} size={T.label} />
      <Subtitle lines={["more scattering for blue (450 nm)", "than red (700 nm)"]} y={1316} at={1.9} time={time} size={T.body - 6} />
    </World>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const time: TimeKey = "day";
  const rows = SAMPLE.list;
  return (
    <World time={time} band={430}>
      <Title lines={["In three steps"]} size={60} y={262} at={0.1} time={time} />
      {rows.map((item, i) => {
        const at = 0.4 + i * 0.6;
        const view: View = { cx: 268, cy: 650 + i * 330, s: 62 };
        const tiles = islandTiles(1, 20 + i, { ragged: 0.45 });
        const z = 2.3;
        const extra: Obj[] = [];
        const sp = popK(t - at - 0.55);
        if (i === 0 && sp > 0.02) extra.push(ico([0, 0, z], 0.75 * sp, [C.yellow, mix(C.yellow, C.orange, 0.35)], 1, t * 0.4, 0.5));
        if (i === 1 && sp > 0.02) {
          extra.push(ico([0, 0, z], 0.7 * sp, [C.white, mix(C.white, C.blueLight, 0.4)], 1, t * 0.3, 0.4));
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2;
            const d = 1.25 + 0.25 * Math.sin(t * 2 + k);
            extra.push(shard([Math.cos(a) * d, Math.sin(a) * d, z + Math.sin(a * 2) * 0.5], 0.2 * sp, [C.blue, C.blueLight], k + t));
          }
        }
        if (i === 2 && sp > 0.02) {
          extra.push(house(0, 0, 0.82, sp * 1.3, WALLS[0], ROOFS[1], C.window));
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2 + 0.4;
            extra.push(shard([Math.cos(a) * 1.25, Math.sin(a) * 1.25, 2.2 + 0.3 * Math.sin(t * 2 + k)], 0.18 * sp, [C.blue, C.blueLight], k + t));
          }
        }
        const centre = tiles.map((tl) => (tl.ring === 0 ? { ...tl, kind: "grass" as const, h: 0.82 } : tl));
        return (
          <React.Fragment key={i}>
            <Island tiles={centre} view={view} time={time} start={at} extra={extra} withProps={false} />
            <Caption lines={wrap(item, 16)} x={470} y={650 + i * 330 - 70} w={520} at={at + 0.3} time={time} icon />
          </React.Fragment>
        );
      })}
    </World>
  );
};

const End: React.FC = () => {
  const time: TimeKey = "night";
  const view: View = { cx: 540, cy: 1190, s: 76 };
  const tiles = islandTiles(3, 4, { peak: true, ragged: 0.3 });
  return (
    <World time={time} band={760} stars>
      <Island tiles={tiles} view={view} time={time} start={-2} night />
      <Title lines={["Look up", "*again.*"]} size={T.title + 16} y={270} at={0.2} time={time} />
      <SubLine text={SAMPLE.end.cta} y={600} at={1.2} time={time} />
    </World>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 3.0, component: TitleSample },
  { id: "headline", duration: 3.6, hero: 3.2, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.15, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.2, component: List },
  { id: "end", duration: 2.8, hero: 2.4, component: End },
];
