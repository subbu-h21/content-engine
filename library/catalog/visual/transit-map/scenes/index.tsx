/**
 * Transit Map on the shared sample content: one printed sheet, "Sunlight lines" (a metaphor: each line is a
 * wavelength), seen by a different camera in each sample, with that sample's printed extras.
 */
import React from "react";
import { plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { Bullet, C, Callout, Camera, Counter, G, Label, LINES, MapSheet, S, SHEET } from "./parts";

const T = S.type;
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");

/** The cartouche: an ink bar, the map's name, a one-line grey note (the network is labelled as a metaphor). */
const Cartouche: React.FC<{ t: number; at: number }> = ({ t, at }) =>
  t < at ? null : (
    <g>
      <rect x={0.3 * G} y={0.35 * G} width={(SHEET.w - 0.6) * G} height={0.12 * G} fill={C.ink} />
      <Label x={0.3} y={1.15} size={T.cartouche} text={plain(SAMPLE.title)} weight={800} />
      <Label x={0.3} y={1.65} size={T.water} text="Sunlight lines · a metaphor, not a real network" col={C.grey} weight={600} />
    </g>
  );

/** The six line bullets, wavelengths in nm, in a row under the cartouche. */
const Bullets: React.FC<{ t: number; at: number }> = ({ t, at }) => (
  <g>
    {LINES.map((l, i) => (
      <Bullet key={l.nm} nm={l.nm} x={0.6 + i * 0.7} y={2.5} t={t} at={at + i * 0.08} />
    ))}
  </g>
);

const Title: React.FC = () => {
  const t = useSeconds();
  return (
    <Camera aim={[4.5, 5.4]} zoom={112} tilt={16} aperture={3}>
      {() => <MapSheet t={t} zoom={112} extras={<><Cartouche t={t} at={0.2} /><Bullets t={t} at={1.7} /></>} />}
    </Camera>
  );
};

const Headline: React.FC = () => {
  const t = useSeconds();
  const [l1, l2] = SAMPLE.headline;
  const panel = t > 1.8 ? (
    <g>
      <rect x={0.3 * G} y={10.55 * G} width={4.2 * G} height={0.1 * G} fill={C.ink} />
      <Label x={0.3} y={11.2} size={0.5} text={l1} weight={800} />
      <Label x={0.3} y={11.72} size={0.5} text={lead(l2)} weight={800} />
      <Label x={0.3} y={12.24} size={0.5} text={em(l2)} weight={800} col={C.accent} />
    </g>
  ) : null;
  return (
    <Camera aim={[4.2, 7.9]} zoom={104} tilt={22} heading={-8} aperture={5}>
      {() => <MapSheet t={t} zoom={104} drawAt={-0.3} extras={<><Bullets t={t} at={1.6} />{panel}</>} />}
    </Camera>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  return (
    <Camera aim={[5.6, 7.3]} zoom={172} tilt={42} heading={12} aperture={9}>
      {() => <MapSheet t={t} zoom={172} drawAt={-0.6} extras={<Callout x={5.9} y={7.1} t={t} at={1.9} big="450 nm" line="Air scatters blue" note="in every direction" w={3.0} bar={C.accent} />} />}
    </Camera>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  return (
    <Camera
      aim={[4.5, 6.2]}
      zoom={74}
      over={<Counter label="SCATTERING, BLUE VS RED" label2="Rayleigh: (700 ÷ 450)⁴" value={n.value.toFixed(n.decimals)} unit={n.unit} at={1.0} />}
    >
      {() => <MapSheet t={t} zoom={74} focus={[450, 700]} drawAt={-1.2} />}
    </Camera>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const [s1, s2, s3] = SAMPLE.list;
  const two = (s: string): [string, string] => {
    const ws = s.split(" ");
    const k = Math.ceil(ws.length / 2);
    return [ws.slice(0, k).join(" "), ws.slice(k).join(" ")];
  };
  const [a1, b1] = two(s1);
  const [a2, b2] = two(s2);
  const [a3, b3] = two(s3);
  return (
    <Camera aim={[4.2, 6.9]} zoom={114}>
      {() => (
        <MapSheet
          t={t}
          zoom={114}
          focus={[450]}
          drawAt={-1.2}
          here
          extras={
            <>
              <Callout x={0.25} y={1.25} t={t} at={0.6} big="1" line={a1} note={b1} w={3.5} />
              <Callout x={5.9} y={7.1} t={t} at={1.1} big="2" line={a2} note={b2} w={3.0} />
              <Callout x={0.3} y={10.45} t={t} at={1.6} big="3" line={a3} note={b3} w={4.3} />
            </>
          }
        />
      )}
    </Camera>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  const ws = plain(SAMPLE.end.line).split(" ");
  return (
    <Camera aim={[4.5, 8.6]} zoom={84} tilt={22} heading={-5} aperture={4}>
      {() => (
        <MapSheet
          t={t}
          zoom={84}
          drawAt={-1.6}
          here
          extras={
            t > 0.4 ? (
              <g>
                <rect x={0.4 * G} y={13.45 * G} width={3.6 * G} height={0.1 * G} fill={C.ink} />
                <Label x={0.4} y={14.2} size={0.7} text={ws.slice(0, 2).join(" ")} weight={800} />
                <Label x={0.4} y={14.85} size={0.7} text={ws.slice(2).join(" ")} weight={800} col={C.accent} />
                <Cartouche t={t} at={0} />
                <Label x={5.1} y={14.75} size={0.3} text={SAMPLE.end.cta} weight={700} col={C.grey} />
              </g>
            ) : null
          }
        />
      )}
    </Camera>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.2, hero: 2.85, component: Title },
  { id: "headline", duration: 3.0, hero: 2.65, component: Headline },
  { id: "diagram", duration: 3.0, hero: 2.65, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.7, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.65, component: List },
  { id: "end", duration: 2.8, hero: 2.45, component: End },
];
