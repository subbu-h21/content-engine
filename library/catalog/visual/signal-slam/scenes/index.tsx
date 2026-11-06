/** Signal Slam on the shared sample content: one word per spoken word, stacks, bands, and the shutter. */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Band, C, Chevron, COLUMN, ease, fitWord, Field, Furniture, M, S, Shutter, W, Word } from "./parts";

const T = S.type;
const SLAM = S.motion.recipes.slam;
type Beat = { text: string; at: number; wdth: number; invert?: boolean };
const line = (beats: Beat[]) => beats.map((b) => ({ text: plain(b.text), at: b.at }));
/** The beat whose slot holds t: hard cuts, one word on screen. */
const current = (beats: Beat[], t: number) => [...beats].reverse().find((b) => b.at <= t);

/** A stack beat: words pile up as they are said, each at its own width, scaled together to fit the band. */
const Stack: React.FC<{ beats: Beat[]; top: number; bottom: number; gap?: number; chevrons?: boolean }> = ({ beats, top, bottom, gap = 0.16, chevrons = false }) => {
  const sizes = beats.map((b) => fitWord(b.text.toUpperCase(), b.wdth, b.invert ? COLUMN - 60 : COLUMN));
  // an inverted word's ink block reaches above and below its caps: give it room
  const row = (b: Beat, s: number) => s * (T.capHeight + gap + (b.invert ? 0.3 : 0));
  const chev = chevrons ? 120 : 0;
  const total = beats.reduce((n, b, i) => n + row(b, sizes[i]), 0) + chev * (beats.length - 1);
  const k = Math.min(1, (bottom - top) / total);
  let y = top + ((bottom - top) - total * k) / 2;
  return (
    <>
      {beats.map((b, i) => {
        const s = sizes[i] * k;
        const cy = y + row(b, s) / 2;
        y += row(b, s);
        const cv = chevrons && i < beats.length - 1 ? y + (chev * k) / 2 : 0;
        if (chevrons && i < beats.length - 1) y += chev * k;
        return (
          <React.Fragment key={i}>
            <Word text={b.text} wdth={b.wdth} y={cy + s * 0.07} at={b.at} size={s} invert={b.invert} />
            {cv ? <Chevron y={cv} at={beats[i + 1].at - 0.06} size={46 * Math.max(0.7, k)} /> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

const Title: React.FC = () => {
  // one word per spoken word, a hard cut each time; the emphasised last word stretches at width 125 with the glow
  const t = useSeconds();
  const ws = words(SAMPLE.title);
  const widths = [100, 125, 87.5, 112.5, 125];
  const beats: Beat[] = ws.map((w, i) => ({ text: w.text, at: 0.1 + i * 0.22, wdth: w.em ? 125 : widths[i % widths.length] }));
  const b = current(beats, t);
  const last = beats[beats.length - 1];
  return (
    <Field hits={beats.map((x) => x.at)} shake={last.at} glowAt={last.at}>
      {b ? <Word key={b.text} text={b.text} wdth={b.wdth} y={880} at={b.at} mode={b === last ? "stretch" : "slam"} /> : null}
      <Furniture plate="01 / HOOK" line={line(beats)} readout={b ? { label: "WDTH", from: 62, to: b.wdth, digits: 1, at: b.at, frac: b.wdth / 125 } : undefined} />
    </Field>
  );
};

const HeadlineSample: React.FC = () => {
  // a stack beat: the line builds as a poster, the emphasised words inverted on an ink block
  const t = useSeconds();
  const ws = SAMPLE.headline.flatMap((l) => words(l));
  const plainWords = ws.filter((w) => !w.em).map((w) => w.text);
  const key = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const widths = [75, 112.5, 125, 87.5];
  const beats: Beat[] = [...plainWords.map((w, i) => ({ text: w, at: 0.1 + i * 0.25, wdth: widths[i % widths.length] })), { text: key, at: 0.1 + plainWords.length * 0.25, wdth: 100, invert: true }];
  const b = current(beats, t);
  return (
    <Field hits={beats.map((x) => x.at)}>
      <Stack beats={beats} top={330} bottom={1340} />
      <Furniture plate="02 / THE SCIENCE" line={line(beats)} readout={b ? { label: "WDTH", from: 62, to: b.wdth, digits: 1, at: b.at, frac: b.wdth / 125 } : undefined} />
    </Field>
  );
};

const Diagram: React.FC = () => {
  // a sequence beat: what goes in, what it hits, what comes out, joined by ink chevrons
  const t = useSeconds();
  const d = SAMPLE.diagram;
  const out = words(d.out).map((w) => w.text);
  const beats: Beat[] = [
    { text: d.in, at: 0.1, wdth: 75 },
    { text: "air", at: 0.45, wdth: 125 },
    { text: out[0], at: 0.8, wdth: 100, invert: true },
    { text: "everywhere", at: 1.05, wdth: 62 },
  ];
  const b = current(beats, t);
  const spoken = [{ text: d.in, at: 0.1 }, { text: "hits", at: 0.3 }, { text: "air.", at: 0.45 }, ...out.map((w, i) => ({ text: w, at: 0.8 + i * 0.12 }))];
  return (
    <Field hits={beats.map((x) => x.at)}>
      <Stack beats={beats} top={330} bottom={1340} chevrons />
      <Furniture plate="03 / HOW IT WORKS" line={spoken} readout={b ? { label: "WDTH", from: 62, to: b.wdth, digits: 1, at: b.at, frac: b.wdth / 125 } : undefined} />
    </Field>
  );
};

const NumberSample: React.FC = () => {
  // the number slams full width; the readout rolls up to the true value
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const beats: Beat[] = [
    { text: value, at: 0.15, wdth: 87.5 },
    { text: "more blue", at: 0.75, wdth: 100, invert: true },
  ];
  const spoken = ["5.9×", "more", "scattering", "for", "blue", "(450 nm)", "than", "red", "(700 nm)"].map((w, i) => ({ text: w, at: 0.15 + i * 0.12 }));
  return (
    <Field hits={beats.map((x) => x.at)} shake={0.15}>
      <Stack beats={beats} top={360} bottom={1320} gap={0.22} />
      <Furniture plate="04 / BY THE NUMBERS" line={spoken} readout={{ label: "RATIO", from: 0.12, to: n.value, digits: 1, at: 0.15 }} />
    </Field>
  );
};

const List: React.FC = () => {
  // the band split: three bands, one key word each, the middle band in ink
  const keys = ["air", "everywhere", "you"];
  const widths = [125, 62, 125];
  const [top, bottom] = [320, 1350];
  const h = (bottom - top) / 3;
  const spoken = SAMPLE.list.flatMap((l, i) => words(l).map((w, k) => ({ text: w.text, at: 0.1 + i * 0.45 + k * 0.06 })));
  return (
    <Field hits={[0.1, 0.55, 1.0]}>
      <Band y={top + h} h={h} at={0.5} />
      {keys.map((k, i) => {
        const at = 0.1 + i * 0.45;
        const size = fitWord(k.toUpperCase(), widths[i], COLUMN, h * 0.62);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: M, top: top + i * h + 22, fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 600, fontSize: T.label, letterSpacing: "0.2em", color: i === 1 ? C.field : C.ink, opacity: 0.85, whiteSpace: "nowrap" }}>
              {`0${i + 1}  ${SAMPLE.list[i].toUpperCase()}`}
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1920, color: i === 1 ? C.field : C.ink }}>
              <BandWord text={k} wdth={widths[i]} y={top + i * h + h * 0.57} at={at} size={size} onInk={i === 1} />
            </div>
          </React.Fragment>
        );
      })}
      <Furniture plate="05 / IN THREE STEPS" line={spoken.slice(-7)} />
    </Field>
  );
};

/** A word inside a band: orange on the ink band, ink on the field. */
const BandWord: React.FC<{ text: string; wdth: number; y: number; at: number; size: number; onInk: boolean }> = ({ text, wdth, y, at, size, onInk }) => {
  const t = useSeconds() - at;
  if (t < 0) return null;
  const s = SLAM.from + (1 - SLAM.from) * ease("slam", t);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - size * 0.5, textAlign: "center", fontFamily: `"Archivo", sans-serif`, fontWeight: 900, fontSize: size, lineHeight: 1, fontStretch: `${wdth}%`, fontVariationSettings: `'wdth' ${wdth}`, color: onInk ? C.field : C.ink, transform: `scale(${s})` }}>
      {text.toUpperCase()}
    </div>
  );
};

const End: React.FC = () => {
  // the last words, then the shutter closes on the field (here held as a letterbox band, the CTA on the ink)
  const ws = words(SAMPLE.end.line);
  const lead = ws.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const gap = 680;
  const centre = 880;
  const s1 = fitWord(lead.toUpperCase(), 62, COLUMN * 0.6, 200);
  const s2 = fitWord(em.toUpperCase(), 125, COLUMN, 400);
  const beats: Beat[] = [
    { text: lead, at: 0.1, wdth: 62 },
    { text: em, at: 0.45, wdth: 125 },
  ];
  return (
    <Field hits={beats.map((b) => b.at)} glowAt={0.45} shake={0.45}>
      <Word text={lead} wdth={62} y={centre - s2 * 0.5} at={0.1} size={s1} />
      <Word text={em} wdth={125} y={centre + s1 * 0.32} at={0.45} size={s2} mode="stretch" />
      <Shutter at={1.0} gap={gap} centre={centre}>
        <div style={{ position: "absolute", left: 0, right: 0, top: centre + gap / 2 + 70, textAlign: "center", fontFamily: `"IBM Plex Mono", monospace`, fontWeight: 600, fontSize: T.strip + 4, letterSpacing: "0.3em", color: C.bone }}>
          {SAMPLE.end.cta.toUpperCase()}
        </div>
      </Shutter>
      <Furniture plate="06 / END" line={line(beats)} dark />
    </Field>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.2, hero: 1.6, component: Title },
  { id: "headline", duration: 2.4, hero: 1.85, component: HeadlineSample },
  { id: "diagram", duration: 2.2, hero: 1.7, component: Diagram },
  { id: "number", duration: 2.2, hero: 1.6, component: NumberSample },
  { id: "list", duration: 2.2, hero: 1.7, component: List },
  { id: "end", duration: 2.2, hero: 1.7, component: End },
];

