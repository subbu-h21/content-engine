/**
 * Pixel RPG on the shared sample content, told as a quest: a title screen at dawn, the Sun's dialog, a battle where an
 * air molecule scatters blue light, a status screen, the quest log and the save crystal.
 * All positions are native pixels on the 180×320 grid.
 */
import React from "react";
import { SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import {
  barPix,
  C,
  caretPix,
  checkPix,
  Crystal,
  disc,
  ditherRing,
  DitherBands,
  ease,
  E,
  Grid,
  handPix,
  heroPix,
  Hill,
  hillY,
  Tufts,
  M,
  pixLine,
  Pixels,
  S,
  Screen,
  SPECTRUM,
  starPix,
  stepped,
  Stars,
  TitleText,
  Typed,
  typeTime,
  UIText,
  Window,
  type Pix,
} from "./parts";

const T = S.type;
/** A no-break space keeps a number with its unit. */
const NBSP = String.fromCharCode(160);
const cursorBob = (t: number) => Math.floor(t * M.cursorFps) % 2;
/** The ▼ caret blinks at caretHz once a line has finished typing. */
const caretOn = (t: number, done: number) => t >= done && Math.floor((t - done) * M.caretHz * 2) % 2 === 0;
const sunPix = (x: number, y: number, r = E.sun.r): Pix[] => [
  ...ditherRing(x, y, r, r + E.sun.glow[0], 8, C.key),
  ...ditherRing(x, y, r + E.sun.glow[0], r + E.sun.glow[1], 4, C.sun),
  ...disc(x, y, r, [C.white, C.key, C.sun], C.sunDark),
];

const Title: React.FC = () => {
  const t = useSeconds();
  const hx = 118;
  const feet = hillY(hx + 7, 258, 5, 4);
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="t-sky"
          stops={[
            [0, C.night],
            [96, C.navy],
            [150, C.night3],
            [196, C.plum],
            [222, C.violet],
            [242, C.orange],
          ]}
        />
        <Stars n={46} maxY={150} t={t} />
        <Pixels pix={sunPix(56, 246)} />
        <Hill base={240} amp={6} seed={1} fill={C.g4} top={C.g3} />
        <Hill base={258} amp={5} seed={4} fill={C.g3} top={C.g2} />
        <Tufts base={258} amp={5} seed={4} n={40} col={C.g2} />
        <Pixels pix={heroPix(hx, feet - E.hero.h, true)} />
      </Grid>
      <UIText text={SAMPLE.kicker.toUpperCase()} y={50} align="center" at={0.1} />
      <TitleText lines={wrap(SAMPLE.title, 14)} size={T.title} y={66} at={0.35} />
      {t >= 1.2 ? (
        <Grid>
          <Pixels pix={handPix(52 + cursorBob(t), 147)} />
        </Grid>
      ) : null}
      <UIText text="NEW QUEST" x={66} y={148} col={C.white} at={1.2} />
      <UIText text="CONTINUE" x={66} y={160} col={C.steel} at={1.2} />
    </Screen>
  );
};

/** The speaker's portrait: the Sun with a face, in a small framed box (window coordinates). */
const SunPortrait: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const s = E.portrait;
  const cx = x + s / 2;
  const cy = y + s / 2;
  return (
    <g>
      <rect x={x - 1} y={y - 1} width={s + 2} height={s + 2} fill={C.night} />
      <rect x={x} y={y} width={s} height={s} fill={C.cyanMid} />
      <Pixels
        pix={[
          ...disc(cx, cy + 1, 10, [C.white, C.key, C.sun], C.sunDark),
          { x: cx - 4, y: cy - 1, c: C.night },
          { x: cx - 4, y: cy, c: C.night },
          { x: cx + 3, y: cy - 1, c: C.night },
          { x: cx + 3, y: cy, c: C.night },
          { x: cx - 3, y: cy + 4, c: C.sunDark },
          { x: cx - 2, y: cy + 5, c: C.sunDark },
          { x: cx - 1, y: cy + 5, c: C.sunDark },
          { x: cx, y: cy + 5, c: C.sunDark },
          { x: cx + 1, y: cy + 5, c: C.sunDark },
          { x: cx + 2, y: cy + 4, c: C.sunDark },
        ]}
      />
    </g>
  );
};

const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const text = SAMPLE.headline.join(" ");
  const typeAt = 0.9;
  const done = typeAt + typeTime(text);
  const hx = 104;
  const feet = hillY(hx + 7, 182, 3, 2);
  const orbs: Pix[] = [];
  SPECTRUM.forEach((col, i) => {
    if (stepped(t, M.effectFps) < 0.35 + i * 0.12) return;
    const a = Math.PI * (1.08 + (i * 0.84) / (SPECTRUM.length - 1));
    const ox = Math.round(108 + 54 * Math.cos(a));
    const oy = Math.round(150 + 54 * Math.sin(a));
    orbs.push(...disc(ox, oy, 5, [C.white, col, col], C.night));
  });
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="h-sky"
          stops={[
            [0, C.cyanDark],
            [70, C.cyanMid],
            [160, C.cyan],
          ]}
        />
        <Pixels pix={sunPix(34, 66)} />
        <Pixels pix={orbs} />
        <Hill base={182} amp={3} seed={2} fill={C.g2} top={C.g1} />
        <Tufts base={182} amp={3} seed={2} />
        <Pixels pix={heroPix(hx, feet - E.hero.h, true)} />
      </Grid>
      <Window
        id="h-dlg"
        x={8}
        y={188}
        w={164}
        h={74}
        at={0.5}
        art={
          <>
            <SunPortrait x={8} y={8} />
            {caretOn(t, done) ? <Pixels pix={caretPix(152, 65)} /> : null}
          </>
        }
      >
        <UIText text="SUN" x={12} y={42} col={C.key} at={0.5} />
        <Typed text={text} x={42} y={8} w={114} at={typeAt} />
      </Window>
    </Screen>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const ts = stepped(t, M.effectFps);
  const [sx, sy] = [30, 98];
  const [mx, my] = [98, 152];
  const beamAt = 0.5;
  const beam = ease("beam", ts - beamAt);
  const hitAt = beamAt + S.motion.recipes.beam.duration;
  const pix: Pix[] = [...sunPix(sx, sy)];
  // the white beam with a sun-gold edge, from the sun to the molecule
  const bx0 = sx + 11;
  const by0 = sy + 9;
  const bx1 = mx - E.molecule.r + 2;
  const by1 = my - E.molecule.r + 4;
  if (beam > 0) pix.push(...pixLine(bx0, by0, bx1, by1, beam, 5, C.sun), ...pixLine(bx0, by0, bx1, by1, beam, 3, C.key), ...pixLine(bx0, by0, bx1, by1, beam, 1, C.white));
  // red carries on almost straight
  const red = ease("beam", ts - hitAt);
  if (red > 0) pix.push(...pixLine(mx + 13, my + 10, 176, my + 10 + Math.round((176 - mx - 13) * 0.79), red, 3, C.red));
  const r = E.molecule.r;
  pix.push(...ditherRing(mx, my, r, r + 4, ts >= hitAt ? 8 : 0, C.cyanMid), ...ditherRing(mx, my, r + 4, r + 9, ts >= hitAt ? 4 : 0, C.cyanDark), ...disc(mx, my, r, [C.white, C.silver, C.steel2]));
  // blue sparks fly out in every direction: short streaks with a white head, a new burst every `spark.every` s
  const sp = E.spark;
  const life = S.motion.recipes.spark.duration;
  for (let b = 0; b < 12; b++) {
    const age = ts - hitAt - b * sp.every;
    if (age < 0 || age > life) continue;
    const d = E.molecule.r + 3 + sp.reach * ease("spark", age);
    for (let k = 0; k < sp.count; k++) {
      const a = (k / sp.count) * Math.PI * 2 + Math.PI / sp.count + (b % 2) * (Math.PI / sp.count);
      const head = pixLine(Math.round(mx + (d - sp.length) * Math.cos(a)), Math.round(my + (d - sp.length) * Math.sin(a)), Math.round(mx + d * Math.cos(a)), Math.round(my + d * Math.sin(a)), 1, sp.size, C.cyan);
      pix.push(...head);
      pix.push({ x: Math.round(mx + d * Math.cos(a)), y: Math.round(my + d * Math.sin(a)), c: C.white });
    }
  }
  const msg = `${SAMPLE.diagram.label}!`;
  const msgAt = hitAt + 0.1;
  const out = SAMPLE.diagram.out;
  const outAt = 1.7;
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="d-sky"
          stops={[
            [0, C.night],
            [150, C.navy],
            [230, C.night3],
          ]}
        />
        <Stars n={24} maxY={200} seed={9} t={t} />
        <Hill base={226} amp={4} seed={5} fill={C.g4} top={C.g3} />
        <Tufts base={226} amp={4} seed={5} n={30} col={C.g3} />
        <Pixels pix={pix} />
      </Grid>
      <Window id="d-msg" x={8} y={40} w={164} h={38} at={0.1} from="top">
        <UIText text={SAMPLE.diagram.object.toUpperCase()} x={9} y={7} col={C.key} at={0.1} />
        <Typed text={msg} x={9} y={16} w={146} at={msgAt} />
      </Window>
      <Window id="d-out" x={8} y={210} w={164} h={50} at={outAt - 0.3} art={<Pixels pix={[...disc(15, 20, 3, [C.white, C.cyan, C.cyanMid])]} />}>
        <Typed text={out} x={24} y={10} w={136} at={outAt} />
      </Window>
    </Screen>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const ts = stepped(t, M.effectFps);
  const n = SAMPLE.number;
  const p = ease("count", ts - 0.5);
  const value = `${(n.value * Math.min(1, p)).toFixed(n.decimals)}${n.unit}`;
  const fill = ease("fill", ts - 1.5);
  const sparkle = Math.floor(t * M.effectFps) % 4 < 2;
  const bw = 140;
  const art = (
    <>
      <Pixels pix={barPix(12, 150, bw, E.bar.h + 2, fill, C.cyan, C.white)} />
      <Pixels pix={barPix(12, 182, bw, E.bar.h + 2, fill / n.value, C.red, C.white)} />
      {p >= 1 ? <Pixels pix={[...starPix(sparkle ? 10 : 12, 28), ...starPix(sparkle ? 148 : 146, 52)]} /> : null}
    </>
  );
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="n-bg"
          stops={[
            [0, C.night],
            [170, C.navy],
            [320, C.night3],
          ]}
        />
      </Grid>
      <Window id="n-win" x={8} y={40} w={164} h={200} at={0.1} from="top" art={art}>
        <UIText text="SCATTER" x={9} y={7} col={C.key} at={0.1} />
        <TitleText lines={[value]} size={T.number} y={12} at={0.4} />
        <Typed text={n.caption.replace(/ nm/g, NBSP + "nm")} x={9} y={74} w={148} at={1.0} />
        <Typed text={`Blue · 450${NBSP}nm`} x={12} y={132} w={140} at={1.4} />
        <Typed text={`Red · 700${NBSP}nm`} x={12} y={164} w={140} at={1.5} />
      </Window>
    </Screen>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const hx = 120;
  const feet = hillY(hx + 7, 262, 3, 6);
  const row = (i: number) => 22 + i * 44;
  const at = (i: number) => 0.45 + i * 0.5;
  const last = SAMPLE.list.length - 1;
  const art = (
    <>
      {SAMPLE.list.map((_, i) => (i < last && t >= at(i) + typeTime(SAMPLE.list[i]) + 0.1 ? <Pixels key={i} pix={checkPix(8, row(i) + 3)} /> : null))}
      {t >= at(last) ? <Pixels pix={handPix(2 + cursorBob(t), row(last) + 2)} /> : null}
    </>
  );
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="l-sky"
          stops={[
            [0, C.cyanDark],
            [120, C.cyanMid],
            [230, C.cyan],
          ]}
        />
        <Hill base={262} amp={3} seed={6} fill={C.g2} top={C.g1} />
        <Tufts base={262} amp={3} seed={6} n={30} />
        <Pixels pix={heroPix(hx, feet - E.hero.h)} />
      </Grid>
      <Window id="l-win" x={8} y={42} w={164} h={158} at={0.1} from="left" art={art}>
        <UIText text="QUEST LOG" x={9} y={7} col={C.key} at={0.1} />
        {SAMPLE.list.map((item, i) => (
          <Typed key={i} text={item} x={20} y={row(i)} w={138} at={at(i)} />
        ))}
      </Window>
    </Screen>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const hx = 120;
  const feet = hillY(hx + 7, 192, 3, 3);
  return (
    <Screen>
      <Grid>
        <DitherBands
          id="e-sky"
          stops={[
            [0, C.night],
            [130, C.navy],
            [200, C.night3],
          ]}
        />
        <Stars n={40} maxY={180} seed={21} t={t} />
        <Hill base={192} amp={3} seed={3} fill={C.g3} top={C.g2} />
        <Tufts base={192} amp={3} seed={3} n={50} col={C.g2} />
        <rect x={78} y={172} width={25} height={9} fill={C.night} />
        <rect x={79} y={173} width={23} height={7} fill={C.steel} />
        <rect x={79} y={173} width={23} height={1} fill={C.silver} />
        <Crystal cx={90} cy={140} t={t} />
        <Pixels pix={heroPix(hx, feet - E.hero.h, true)} />
      </Grid>
      <TitleText lines={[SAMPLE.end.line]} size={T.display} y={60} at={0.2} />
      <Window id="e-win" x={8} y={204} w={164} h={54} at={0.8} art={t >= 1.1 ? <Pixels pix={handPix(8 + cursorBob(t), 30)} /> : null}>
        <UIText text="SAVE FILE 1" x={9} y={7} col={C.silver} at={0.8} />
        <Typed text={SAMPLE.end.cta} x={22} y={22} w={136} at={1.1} />
      </Window>
    </Screen>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3, hero: 2.5, component: Title },
  { id: "headline", duration: 3.4, hero: 3.0, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.25, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.4, hero: 3.0, component: List },
  { id: "end", duration: 2.8, hero: 2.4, component: End },
];
