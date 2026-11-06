/**
 * ASCII CRT on the shared sample content: the question typed on a 9-column grid, sunlight split into six glyph bands,
 * an ASCII sun and air molecule with the scattered light in the one second colour, banner numerals over two bars, a
 * boot log for the steps, and the blue sky switched on for the end.
 */
import React from "react";
import { clamp, plain, SAMPLE, wrap, type Sample } from "../../kit";
import { Banner, cursorOn, doneAt, grid, Log, LV, M, Picture, Row, S, Screen, TY, typed, useT, type Glyph, type Sampled } from "./parts";

const G = S.layout.grids;
const TOP = S.layout.safe.top + 20;
const up = (s: string) => plain(s).toUpperCase();

/** Lines typed one after another (`gap` seconds between lines); returns each line's visible text. */
const sequence = (lines: string[], t: number, at: number, per: number, gap = 0.15) => {
  let start = at;
  return lines.map((l) => {
    const shown = typed(l, t, start, per);
    const res = { shown, done: t >= doneAt(l, start, per), started: t >= start };
    start = doneAt(l, start, per) + gap;
    return res;
  });
};

const Prompt: React.FC<{ text: string; t: number; at?: number }> = ({ text, t, at = 0 }) => <Row y={TOP} cols={G.terminal} text={typed(text, t, at, TY.machine)} L={LV.dim} />;

const Title: React.FC = () => {
  const t = useT();
  const lines = ["WHY IS", "THE SKY", "BLUE?"];
  const g = grid(G.title);
  const seq = sequence(lines, t, 0.4, TY.title);
  const last = seq.findIndex((s) => !s.done);
  const cur = last < 0 ? lines.length - 1 : last;
  return (
    <>
      <Prompt text="> OPEN SKY.TXT" t={t} />
      {seq.map((s, i) =>
        s.started ? (
          <Row key={i} y={520 + i * g.ch} cols={G.title} text={s.shown} inv={i === 2} L={i === 2 ? LV.normal : LV.bold} cursor={i === cur && (last >= 0 || cursorOn(t))} />
        ) : null,
      )}
      <Log text={SAMPLE.kicker} at={0.1} per={TY.command} t={t} status="READY" />
    </>
  );
};

/** Six bands fanning out of a prism: wavelength, glyph, and whether it's the blue one. */
const BANDS: { nm: number; ch: string; blue?: boolean }[] = [
  { nm: 700, ch: "-" },
  { nm: 620, ch: "=" },
  { nm: 580, ch: "+" },
  { nm: 530, ch: "*" },
  { nm: 450, ch: "#", blue: true },
  { nm: 400, ch: "%" },
];

const HeadlineSample: React.FC = () => {
  const t = useT();
  const g = grid(G.headline);
  const lines = [up(SAMPLE.headline[0]), "EVERY COLOUR", "AT ONCE."];
  const seq = sequence(lines, t, 0.2, TY.command * 1.4, 0.1);
  const pg = grid(G.prism);
  const rows = 14;
  const apex = { u: 11, v: 1 };
  const baseV = 9;
  const slope = 0.75; // cells across per row down each face
  const exit = { u: apex.u + 4.6 * slope + 0.6, v: 5.6 };
  const right = G.prism - 5;
  const target = (k: number) => 1.2 + k * 2.1;
  const fanAt = 1.9;
  const reach = exit.u + clamp((t - fanAt) / 0.5) * (right - exit.u);
  const field = (u: number, v: number): Sampled | null => {
    // the prism: two faces and a base
    const dv = v - apex.v;
    if (dv >= 0 && v <= baseV) {
      const half = dv * slope;
      if (Math.abs(u - (apex.u - half)) < 0.5) return { L: 0.95, ch: "/" };
      if (Math.abs(u - (apex.u + half)) < 0.5) return { L: 0.95, ch: "\\" };
    }
    if (Math.abs(v - baseV - 0.5) < 0.5 && Math.abs(u - apex.u) < (baseV - apex.v) * slope + 0.5) return { L: 0.95, ch: "_" };
    // white light in from the left, up to the left face
    const faceL = apex.u - (5.5 - apex.v) * slope;
    if (Math.abs(v - 5.5) < 0.5 && u < faceL - 0.6) return { L: 0.8, ch: u < faceL - 1.6 ? "=" : ">" };
    // six bands out of the right face, diverging to the labels
    if (u > exit.u && u < reach) {
      const f = (u - exit.u) / (right - exit.u);
      for (let k = 0; k < BANDS.length; k++) {
        const c = exit.v + (target(k) - exit.v) * f;
        if (Math.abs(v - c) < 0.5) return { L: BANDS[k].blue ? 0.8 : 0.62, ch: BANDS[k].ch, blue: BANDS[k].blue };
      }
    }
    return null;
  };
  const y0 = 660;
  return (
    <>
      <Prompt text="> RUN SPECTRUM" t={t} />
      {seq.map((s, i) => (s.started ? <Row key={i} y={340 + i * g.ch} cols={G.headline} text={s.shown} inv={i === 2} L={LV.bold} /> : null))}
      <Picture y={y0} cols={G.prism} rows={rows} field={field} />
      {t > fanAt + 0.5
        ? BANDS.map((b, k) => <Row key={b.nm} y={y0 + Math.floor(target(k)) * pg.ch} cols={G.prism} col={right + 1} text={String(b.nm)} L={b.blue ? LV.bold : LV.normal} blue={b.blue} />)
        : null}
      <Row y={y0 + 12.2 * pg.ch} cols={G.prism} col={right + 1} text="NM" L={LV.dim} />
      <Log text="400-700 NM, ALL AT ONCE" at={2.4} per={TY.machine * 2} t={t} status="6 OF 6 BANDS" />
    </>
  );
};

/** A line glyph for a direction (radians, y down). */
const dirGlyph = (a: number): string => {
  let d = ((a * 180) / Math.PI) % 180;
  if (d < 0) d += 180;
  return d < 22.5 || d >= 157.5 ? "-" : d < 67.5 ? "\\" : d < 112.5 ? "|" : "/";
};

const Diagram: React.FC = () => {
  const t = useT();
  const cols = G.diagram;
  const g = grid(cols);
  const y0 = 330;
  const rows = 22;
  const sun = { x: 150, y: 140, r: 105 };
  const mol = { x: 360, y: 640 };
  const beam = clamp((t - 0.3) / 0.6);
  const scat = clamp((t - 1.0) / 0.8);
  const dirs = [30, 90, 150, 210, 270, 330].map((d) => (d * Math.PI) / 180);
  const bx = mol.x - sun.x;
  const by = mol.y - sun.y;
  const len = Math.hypot(bx, by) || 1;
  const beamCh = dirGlyph(Math.atan2(by, bx));
  const field = (u: number, v: number): Sampled | null => {
    const x = u * g.cw;
    const y = v * g.ch;
    // the sun: a disc with limb darkening
    const ds = Math.hypot(x - sun.x, y - sun.y);
    if (ds < sun.r) return { L: 1 - 0.3 * Math.pow(ds / sun.r, 4) };
    // the molecule: two joined atoms
    const dm = Math.min(Math.hypot(x - (mol.x - 44), (y - mol.y) * 0.8), Math.hypot(x - (mol.x + 44), (y - mol.y) * 0.8));
    if (dm < 54) return { L: 1 - 0.45 * Math.pow(dm / 54, 2) };
    // the beam from the sun to the molecule, and the red light carrying straight on
    const along = ((x - sun.x) * bx + (y - sun.y) * by) / len;
    const across = Math.abs(((x - sun.x) * by - (y - sun.y) * bx) / len);
    if (across < 13 && along > sun.r + 20 && along < Math.min(len - 70, len * beam)) return { L: 0.8, ch: beamCh };
    if (across < 13 && along > len + 80 && along < len + 80 + 300 * scat) return { L: 0.42, ch: beamCh };
    // scattered blue light: dashed rays in six directions
    if (scat > 0) {
      const dx = x - mol.x;
      const dy = y - mol.y;
      for (const d of dirs) {
        const al = dx * Math.cos(d) + dy * Math.sin(d);
        const ac = Math.abs(-dx * Math.sin(d) + dy * Math.cos(d));
        if (ac < 13 && al > 100 && al < 100 + 300 * scat && Math.floor((al - 100) / 50) % 3 !== 2) return { L: 0.85 - (al - 100) / 1000, blue: true, ch: dirGlyph(d) };
      }
    }
    return null;
  };
  const tg = grid(G.terminal);
  const molRow = y0 + mol.y - tg.ch / 2;
  const tagCol = Math.ceil((mol.x + 130) / tg.cw);
  return (
    <>
      <Prompt text="> TRACE AIR_MOLECULE" t={t} />
      <Picture y={y0} cols={cols} rows={rows} field={field} />
      {t > 0.5 ? <Row y={y0 + sun.y + sun.r + 24} cols={G.terminal} col={0} text="SUN" L={LV.normal} /> : null}
      {t > 1.7 ? <Row y={molRow} cols={G.terminal} col={tagCol} text={` ${up(SAMPLE.diagram.object)} `} inv L={LV.normal} /> : null}
      {wrap(up(SAMPLE.diagram.label), 12).map((l, i) =>
        t > 1.9 + i * 0.3 ? <Row key={i} y={y0 + 70 + i * tg.ch} cols={G.terminal} col={G.terminal - 12} text={typed(l, t, 1.9 + i * 0.3, TY.command)} L={LV.bold} /> : null,
      )}
      <Log text={up(SAMPLE.diagram.out)} at={2.2} per={TY.machine * 2} t={t} status="RED PASSES STRAIGHT ON" />
    </>
  );
};

const NumberSample: React.FC = () => {
  const t = useT();
  const n = SAMPLE.number;
  const bg = grid(G.banner);
  // the roller: digits flip discretely, fast then slowing, and land on the sourced value
  const p = clamp((t - 0.3) / S.motion.recipes.roller.duration);
  const steps = Math.floor((1 - Math.pow(1 - p, 3)) * 23);
  const shown = p >= 1 ? n.value.toFixed(n.decimals) : `${(steps + 1) % 10}.${(steps * 7 + 3) % 10}`;
  const tg = grid(G.terminal);
  const cells = 27;
  const red = cells / n.value; // true ratio: blue fills 27 cells, red 27 ÷ 5.9
  const fill = clamp((t - 1.4) / 0.6);
  const bar = (count: number, blue: boolean): Glyph[] => {
    const shownCells = count * fill;
    const out: Glyph[] = [{ ch: "[", L: LV.dim }];
    for (let i = 0; i < cells; i++) {
      const f = shownCells - i;
      out.push(f >= 1 ? { ch: "#", L: LV.bold, blue } : f > 0.4 ? { ch: "=", L: LV.normal, blue } : { ch: " ", L: 0 });
    }
    out.push({ ch: "]", L: LV.dim });
    return out;
  };
  const by = 1000;
  return (
    <>
      <Prompt text="> COMPARE 450NM 700NM" t={t} />
      <Banner text={`${shown}${n.unit}`} x={M} y={400} cols={G.banner} />
      <Row y={400 + 7 * bg.ch + 40} cols={G.terminal} text="TIMES MORE SCATTERING" L={LV.normal} />
      {t > 1.2 ? <Row y={by} cols={G.terminal} text="BLUE 450 NM" L={LV.normal} /> : null}
      {t > 1.2 ? <Row y={by} cols={G.terminal} col={25} text={n.value.toFixed(1)} L={LV.bold} blue /> : null}
      {t > 1.2 ? <Row y={by + tg.ch} cols={G.terminal} glyphs={bar(cells, true)} /> : null}
      {t > 1.3 ? <Row y={by + tg.ch * 2.4} cols={G.terminal} text="RED  700 NM" L={LV.normal} /> : null}
      {t > 1.3 ? <Row y={by + tg.ch * 2.4} cols={G.terminal} col={25} text="1.0" L={LV.bold} /> : null}
      {t > 1.3 ? <Row y={by + tg.ch * 3.4} cols={G.terminal} glyphs={bar(red, false)} /> : null}
      <Log text="BLUE 450 NM VS RED 700 NM" at={2.0} per={TY.machine * 2} t={t} status="RATIO (700/450)^4" />
    </>
  );
};

const List: React.FC = () => {
  const t = useT();
  const cols = G.list;
  const g = grid(cols);
  const split = (s: string): string[] => {
    const ws = up(s).split(" ");
    const out: string[] = [""];
    for (const w of ws) {
      const cur = out[out.length - 1];
      if (cur && (cur + " " + w).length > cols - 7) out.push(w);
      else out[out.length - 1] = cur ? cur + " " + w : w;
    }
    return out;
  };
  let y = 360;
  const items = SAMPLE.list.map((item, i) => {
    const at = 0.3 + i * 0.55;
    const lines = split(item);
    const top = y;
    y += (lines.length + 0.7) * g.ch;
    return { at, lines, top, i };
  });
  const done = clamp((t - 0.3) / 1.9);
  const bar = Math.round(done * 16);
  return (
    <>
      <Prompt text="> BOOT SKY.SYS" t={t} />
      {items.map(({ at, lines, top, i }) =>
        t < at ? null : (
          <React.Fragment key={i}>
            <Row y={top} cols={cols} text="[" L={LV.dim} />
            <Row y={top} cols={cols} col={1} text={t > at + 0.35 ? " OK " : " .. "} L={LV.bold} inv={t > at + 0.35} />
            <Row y={top} cols={cols} col={5} text="]" L={LV.dim} />
            {lines.map((l, j) => (
              <Row key={j} y={top + j * g.ch} cols={cols} col={7} text={typed(l, t, at + j * l.length * TY.machine, TY.machine)} L={LV.normal} />
            ))}
          </React.Fragment>
        ),
      )}
      <Row y={1150} cols={G.terminal} text={`SKY [${"#".repeat(bar)}${" ".repeat(16 - bar)}] ${Math.round(done * 100)}%`} L={LV.normal} />
      <Log text="3 OF 3 OK" at={2.2} per={TY.command} t={t} />
    </>
  );
};

const End: React.FC = () => {
  const t = useT();
  const cols = G.picture;
  const g = grid(cols);
  const on = t > 0.25; // the second colour switched on once, on the downbeat
  const sky = (u: number, v: number): Sampled | null => {
    if (!on) return null;
    const rows = 17;
    const k = 1 - v / rows;
    // soft cloud holes drifting across the blue
    const cloud = Math.max(0, Math.sin(u * 0.16 + v * 0.5) * Math.sin(u * 0.07 - v * 0.9 + 1.3) - 0.35) * 1.6;
    return { L: Math.max(0, 0.9 * k * (1 - cloud)), blue: true };
  };
  const tg = grid(G.title);
  const words = up(SAMPLE.end.line).split(" ");
  const l1 = `${words[0]} ${words[1]}`;
  const l2 = words.slice(2).join(" ");
  const seq = sequence([l1, l2], t, 0.6, TY.title);
  return (
    <>
      <Picture y={240} cols={cols} rows={17} field={sky} />
      {seq.map((s, i) => (s.started ? <Row key={i} y={860 + i * tg.ch} cols={G.title} text={s.shown} inv={i === 1} L={LV.bold} cursor={i === 1 && (!s.done || cursorOn(t))} /> : null))}
      <Log text={SAMPLE.end.cta} at={2.0} per={TY.command} t={t} status="END OF TRANSMISSION" />
    </>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.6, hero: 3.2, component: Title },
  { id: "headline", duration: 3.6, hero: 3.25, component: HeadlineSample },
  { id: "diagram", duration: 3.6, hero: 3.25, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.9, component: NumberSample },
  { id: "list", duration: 3.2, hero: 2.95, component: List },
  { id: "end", duration: 3.0, hero: 2.75, component: End },
].map((s) => ({ ...s, component: onScreen(s.component) }));

/** Every sample is drawn on the tube. */
function onScreen(Inner: React.FC): React.FC {
  const Shown: React.FC = () => (
    <Screen>
      <Inner />
    </Screen>
  );
  return Shown;
}
