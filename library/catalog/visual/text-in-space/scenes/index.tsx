/** Text in Space on the shared sample content, over a plain stand-in for the speaker's footage. */
import React from "react";
import { fit, plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { ArcWords, C, COLUMN, focusOut, HEAD, Molecule, Ring, S, Shot, stack, W, Word } from "./parts";

const T = S.type;
const POP = 0.58;
const SIX = 0.23;
const split = (line: string) => {
  const ws = words(line);
  return { plain: ws.filter((w) => !w.em).map((w) => w.text), em: ws.filter((w) => w.em).map((w) => w.text).join(" ") };
};
/** Where the head's top is: the big word behind it sits so the head hides only its lower edge. */
const HEAD_TOP = HEAD.y - HEAD.ry;

const Title: React.FC = () => {
  // "why is / the sky" above, the emphasised word huge and red behind the head, the kicker as a grey sticker by the body
  const { plain: lead, em } = split(SAMPLE.title);
  const key = plain(em).toLowerCase();
  const keySize = fit([key], COLUMN, T.hero, POP);
  // the key word's baseline sits a little below the top of the head, so the head hides its lower edge
  const lines = [{ size: T.connect }, { size: T.display }, { size: keySize }];
  const { ys } = stack(lines, HEAD_TOP + 0.12 * keySize - stack(lines, 0).bottom);
  return (
    <Shot
      length={2.8}
      back={<Word text={key} size={keySize} y={ys[2]} at={0.55} move="swing" fill={C.accent} />}
      front={
        <>
          <Word text={lead.slice(0, 2).join(" ")} size={T.connect} y={ys[0]} at={0.1} move="fade" />
          <Word text={lead.slice(2).join(" ")} size={T.display} y={ys[1]} at={0.3} move="slide" dir={1} />
          <Word text={SAMPLE.kicker} size={T.label} y={1500} at={1.1} move="pop" effect="sticker" seed={4} />
        </>
      }
    />
  );
};

const HeadlineSample: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const w1 = words(l1).map((w) => w.text);
  const { plain: ring, em } = split(l2);
  const hot = plain(em).toLowerCase();
  const hotSize = fit([hot], COLUMN, T.hero * 0.85, POP);
  const { ys } = stack([{ size: T.display }, { size: T.connect, gap: 0.2 }], 360);
  const ringText = `${ring.join(" ")}  ·  `;
  return (
    <Shot
      length={3}
      back={<Ring text={ringText} stage="back" at={0.7} start={-60} />}
      front={
        <>
          <Word text={w1[0]} size={T.display} y={ys[0]} at={0.1} move="swing" />
          <Word text={w1.slice(1).join(" ")} size={T.connect} y={ys[1]} at={0.45} move="fade" />
          <Ring text={ringText} stage="front" at={0.7} start={-60} />
          <Word text={hot} size={hotSize} y={1380} at={1.4} move="slam" fill={C.accent} effect="slam" sticker />
        </>
      }
    />
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const [mx, my] = [740, 560];
  const scat = words(SAMPLE.diagram.label).map((w) => w.text.toLowerCase());
  return (
    <Shot
      length={3.2}
      back={
        <>
          <ArcWords id="dg-in" parts={[{ text: SAMPLE.diagram.in }]} size={T.arc} y={390} x={420} r={700} at={0.1} dir={-1} />
          <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={120} y1={470} x2={120 + (mx - 120) * Math.min(1, Math.max(0, (t - 0.35) / 0.35))} y2={470 + (my - 470) * Math.min(1, Math.max(0, (t - 0.35) / 0.35))} stroke={C.text} strokeWidth={12} strokeLinecap="round" opacity={0.9} />
          </svg>
          <Molecule x={mx} y={my} at={0.7} />
        </>
      }
      front={
        <>
          <Word text={SAMPLE.diagram.object} size={T.label} x={mx} y={my + 140} at={1.1} move="pop" effect="sticker" seed={2} />
          <ArcWords id="dg-out" parts={[{ text: scat[0] }, { text: scat.slice(1).join(" "), fill: C.accent }]} size={T.arc * 0.9} y={1360} r={-900} at={1.5} sticker />
        </>
      }
    />
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const size = fit([value], COLUMN, T.number, 0.66);
  return (
    <Shot
      length={3}
      back={<Word text="more scattering" size={T.display * 0.7} y={500} at={0.1} move="swing" />}
      front={
        <>
          {/* rack focus: the near connecting word blurs out as focus moves to the number */}
          <Word text="for" size={T.connect} x={300} y={650} at={0.5} move="fade" blur={focusOut(t, 1.0)} />
          <Word text={value} size={size} y={1340} at={1.0} move="slam" effect="slam" />
          <Word text="blue" size={T.body * 1.3} x={250} y={HEAD.y - 70} at={1.4} move="fade" />
          <Word text="450 nm" size={T.body} x={250} y={HEAD.y + 10} at={1.45} move="fade" />
          <Word text="red" size={T.body * 1.3} x={830} y={HEAD.y - 70} at={1.55} move="fade" fill={C.accent} />
          <Word text="700 nm" size={T.body} x={830} y={HEAD.y + 10} at={1.6} move="fade" fill={C.accent} />
        </>
      }
    />
  );
};

const List: React.FC = () => {
  const [a, b, c] = SAMPLE.list;
  const cw = words(c).map((w) => w.text);
  return (
    <Shot
      length={3.4}
      back={
        <>
          <ArcWords id="ls-1" parts={[{ text: a }]} size={78} y={420} r={820} at={0.1} dir={-1} />
          <Ring text={`${b} · `} stage="back" at={0.8} start={-40} />
        </>
      }
      front={
        <>
          <Ring text={`${b} · `} stage="front" at={0.8} start={-40} />
          <Word text={cw.slice(0, 3).join(" ")} size={T.connect * 1.15} y={1320} at={1.6} move="swing" dir={1} />
          <Word text={cw.slice(3).join(" ")} size={T.connect * 1.15} y={1440} at={1.9} move="slam" fill={C.accent} effect="slam" sticker />
        </>
      }
    />
  );
};

const End: React.FC = () => {
  const { plain: l, em } = split(SAMPLE.end.line);
  const keySize = fit([em], COLUMN * 0.8, T.condensed, SIX);
  return (
    <Shot
      length={2.6}
      back={<Word text={l.join(" ")} size={T.display} y={500} at={0.1} move="swing" />}
      front={
        <>
          <Word text={em} size={keySize} y={1300} at={0.5} move="stretch" face="condensed" fill={C.accent} effect="soft" sticker />
          <Word text={SAMPLE.end.cta} size={T.label} y={1560} at={1.0} move="pop" effect="sticker" seed={5} />
        </>
      }
    />
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.8, hero: 2.1, component: Title },
  { id: "headline", duration: 3, hero: 2.5, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.6, component: Diagram },
  { id: "number", duration: 3, hero: 2.4, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.8, component: List },
  { id: "end", duration: 2.6, hero: 2.0, component: End },
];
