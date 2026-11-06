/** Watercolor Wash on the shared sample content: one field-journal page per sample, painted as it is said. */
import React from "react";
import { fit, SAMPLE, wrap, type Sample } from "../../kit";
import { band, blob, Body, C, COLUMN, hill, Label, M, Note, Page, S, SealSun, Stroke, Title, W, Wash, type Pt } from "./parts";

const T = S.type;
const LY = S.layout.labelY;
const chapter = (n: number, title: string) => `${String(n).padStart(2, "0")} — ${title}`;

/** A small molecule specimen: two touching round washes with a darker brush edge along their shaded side. */
const Molecule: React.FC<{ cx: number; cy: number; r: number; at: number; seed: number }> = ({ cx, cy, r, at, seed }) => (
  <>
    <Wash d={blob(cx - r * 0.55, cy, r, r, seed, 0.05)} col={C.deep} alpha={0.55} at={at} seed={seed} box={[cx - 2.2 * r, cy - 1.4 * r, cx + 2.2 * r, cy + 1.4 * r]} dir="right" dur={0.6} />
    <Wash d={blob(cx + r * 0.6, cy + r * 0.04, r * 0.96, r * 0.96, seed + 1, 0.05)} col={C.deep} alpha={0.5} at={at + 0.15} seed={seed + 1} box={[cx - 2.2 * r, cy - 1.4 * r, cx + 2.2 * r, cy + 1.4 * r]} dir="right" dur={0.6} />
    <Stroke
      pts={Array.from({ length: 7 }, (_, i) => {
        const a = 0.2 + (i / 6) * 1.9;
        return [cx + r * 0.6 + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9] as Pt;
      })}
      w={Math.max(6, r * 0.16)}
      col={C.ink2}
      at={at + 0.5}
      dur={0.4}
      seed={seed + 2}
      opacity={0.55}
      kind="tip"
    />
  </>
);

const Title_: React.FC = () => {
  const size = T.title;
  return (
    <Page>
      <Label text={`${SAMPLE.kicker} · field journal`} y={LY} at={0.05} />
      <Wash d={band(70, 330, 1010, 1080, 3, 16, 26, 10)} col={C.sky} alpha={0.42} at={0.1} seed={3} box={[70, 300, 1010, 1110]} />
      <Wash d={band(70, 330, 1010, 820, 4, 16, 40, 10)} col={C.sky} alpha={0.4} at={0.45} seed={4} box={[70, 300, 1010, 860]} soft={0.45} />
      <Wash d={band(70, 330, 1010, 620, 5, 16, 40, 10)} col={C.deep} alpha={0.3} at={0.75} seed={5} box={[70, 300, 1010, 660]} soft={0.6} />
      <Wash d={band(70, 860, 1010, 1080, 6, 30, 26, 10)} col={C.warm} alpha={0.75} at={0.6} seed={6} box={[70, 820, 1010, 1110]} dir="up" />
      <Wash d={hill(70, 1010, 1060, 110, 1110, 7)} col={C.green} alpha={0.45} at={1.0} seed={7} box={[70, 900, 1010, 1130]} dir="right" dur={0.9} />
      <Wash d={hill(420, 1010, 1080, 64, 1112, 8)} col={C.ochre} alpha={0.42} at={1.25} seed={8} box={[420, 960, 1010, 1140]} dir="right" dur={0.8} />
      <SealSun cx={760} cy={590} r={96} at={0.9} />
      <Note text="the sun" x={430} y={600} at={2.0} from={[585, 588]} to={[652, 600]} bend={0.1} />
      <Title lines={wrap(SAMPLE.title, Math.floor(COLUMN / (size * T.charEm)))} size={size} y={1290} at={1.3} />
      <Body text="a field note on scattered light" y={1530} at={2.1} />
    </Page>
  );
};

const Headline: React.FC = () => {
  const size = fit(SAMPLE.headline, COLUMN, T.display, T.charEm);
  const y = 430;
  // the spectrum, laid stroke by stroke from red (long waves) to violet (short waves); overlaps darken like pigment
  const cols = [C.rust, C.ochre, C.green, C.rain, C.violet];
  const y0 = 880;
  const gap = 86;
  return (
    <Page>
      <Label text={chapter(1, SAMPLE.chapter)} y={LY} at={0.05} />
      <Title lines={SAMPLE.headline} size={size} y={y} at={0.15} />
      {cols.map((c, i) => (
        <Stroke
          key={i}
          pts={[
            [M - 10, y0 + i * gap + 30],
            [W * 0.35, y0 + i * gap - 6],
            [W * 0.65, y0 + i * gap + 18],
            [W - M + 10, y0 + i * gap - 10],
          ]}
          w={112}
          col={c}
          at={0.9 + i * 0.16}
          dur={0.9}
          seed={40 + i}
          opacity={0.78}
        />
      ))}
      <Note text="red: long waves" x={W - M} y={y0 - 90} align="right" at={1.8} from={[W - M - 330, y0 - 96]} to={[W - M - 400, y0 - 30]} bend={0.25} />
      <Note text="blue and violet: short waves" x={M} y={y0 + 4 * gap + 150} at={1.85} from={[M + 120, y0 + 4 * gap + 96]} to={[M + 170, y0 + 4 * gap + 44]} bend={-0.25} />
    </Page>
  );
};

const Diagram: React.FC = () => {
  const [cx, cy] = [560, 900];
  const r = 64;
  // rays everywhere except back along the sunlight, with a gap up and to the right for the note's leader
  const rays = [-22, -90, 202, 160, 118, 78].map((deg) => (deg * Math.PI) / 180);
  return (
    <Page>
      <Label text={chapter(2, "How it works · fig. 2")} y={LY} at={0.05} />
      <Stroke pts={[[90, 420], [260, 600], [430, 780], [cx - 80, cy - 40]]} w={40} col={C.ochre} at={0.2} dur={0.8} seed={60} opacity={0.85} kind="tip" />
      <Stroke pts={[[cx + 90, cy + 60], [800, 1060], [1010, 1230]]} w={30} col={C.rust} at={1.6} dur={0.6} seed={61} opacity={0.45} kind="brush" />
      <Molecule cx={cx} cy={cy} r={r} at={0.7} seed={62} />
      {rays.map((a, i) => (
        <Stroke
          key={i}
          pts={[
            [cx + Math.cos(a) * 118, cy + Math.sin(a) * 108],
            [cx + Math.cos(a + 0.05) * 205, cy + Math.sin(a + 0.05) * 192],
            [cx + Math.cos(a) * 300, cy + Math.sin(a) * 280],
          ]}
          w={30}
          col={C.rain}
          at={1.25 + i * 0.07}
          dur={0.45}
          seed={70 + i}
          opacity={0.8}
          kind="tip"
        />
      ))}
      <Note text={SAMPLE.diagram.in.toLowerCase()} x={250} y={470} at={0.9} />
      <Note text={SAMPLE.diagram.object.toLowerCase()} x={700} y={600} at={1.9} from={[760, 622]} to={[cx + 62, cy - 70]} bend={-0.2} />
      <Note text={SAMPLE.diagram.out.toLowerCase()} x={M} y={1310} at={2.3} from={[M + 200, 1268]} to={[cx + Math.cos(2.06) * 300 - 4, cy + Math.sin(2.06) * 280 + 14]} bend={-0.15} />
      <Body text={SAMPLE.body} y={1430} at={2.6} />
    </Page>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const size = T.number;
  const bar = (label: string, frac: number, col: string, y: number, at: number, seed: number) => (
    <>
      <Label text={label} y={y - 70} at={at - 0.1} />
      <Stroke pts={[[M, y + 4], [M + COLUMN * frac * 0.5, y - 4], [M + COLUMN * frac, y + 2]]} w={70} col={col} at={at} dur={0.4 + 0.5 * frac} seed={seed} opacity={0.85} kind="even" />
    </>
  );
  return (
    <Page>
      <Label text={chapter(3, "By the numbers")} y={LY} at={0.05} />
      <Title lines={[`${n.value.toFixed(n.decimals)}*${n.unit}*`]} size={size} y={640} at={0.2} weight={500} joined />
      <Body text={n.caption} y={790} at={0.8} />
      {bar("Blue · 450 nm", 1, C.rain, 1060, 1.1, 80)}
      {bar("Red · 700 nm", 1 / n.value, C.rust, 1260, 1.4, 81)}
      <Note text="red hardly scatters" x={M + 230} y={1268} at={2.0} />
    </Page>
  );
};

const List: React.FC = () => {
  const x0 = 360;
  const rows = [520, 900, 1280];
  const size = T.step;
  return (
    <Page>
      <Label text={chapter(4, "In three steps")} y={LY} at={0.05} />
      {/* 1: the sun and its light entering */}
      <SealSun cx={180} cy={rows[0] - 10} r={62} at={0.2} seed={9} />
      <Stroke pts={[[230, rows[0] + 40], [290, rows[0] + 110], [320, rows[0] + 160]]} w={22} col={C.ochre} at={0.9} dur={0.4} seed={90} opacity={0.85} kind="tip" />
      {/* 2: a molecule scattering blue */}
      <Molecule cx={190} cy={rows[1]} r={34} at={1.0} seed={91} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 6 + 0.3;
        return (
          <Stroke
            key={i}
            pts={[
              [190 + Math.cos(a) * 70, rows[1] + Math.sin(a) * 62],
              [190 + Math.cos(a) * 125, rows[1] + Math.sin(a) * 112],
            ]}
            w={14}
            col={C.rain}
            at={1.35 + i * 0.05}
            dur={0.3}
            seed={93 + i}
            opacity={0.85}
            kind="tip"
          />
        );
      })}
      {/* 3: the sky dome over a horizon */}
      <Wash d={`M 60 ${rows[2] + 50} A 130 130 0 0 1 320 ${rows[2] + 50} Z`} col={C.rain} alpha={0.55} at={1.7} seed={99} box={[50, rows[2] - 100, 330, rows[2] + 60]} dir="down" dur={0.7} />
      <Stroke pts={[[44, rows[2] + 52], [190, rows[2] + 48], [336, rows[2] + 54]]} w={10} col={C.ink2} at={2.0} dur={0.35} seed={100} opacity={0.7} kind="even" />
      {SAMPLE.list.map((item, i) => {
        const at = 0.5 + i * 0.75;
        const lines = wrap(item, Math.floor((W - M - x0) / (size * T.charEm)));
        return (
          <React.Fragment key={i}>
            <Label text={`Step ${i + 1}`} x={x0} y={rows[i] - 80} at={at} />
            <Title lines={lines} size={size} y={rows[i] - 4} at={at + 0.1} x={x0} />
          </React.Fragment>
        );
      })}
    </Page>
  );
};

const End: React.FC = () => {
  const size = fit([SAMPLE.end.line], COLUMN, T.title, T.charEm);
  return (
    <Page>
      <Wash d={band(60, 250, 1020, 960, 12, 20, 36, 10)} col={C.sky} alpha={0.45} at={0.05} seed={12} box={[60, 220, 1020, 1000]} soft={0.3} />
      <Wash d={band(60, 250, 1020, 700, 13, 20, 40, 10)} col={C.deep} alpha={0.3} at={0.4} seed={13} box={[60, 220, 1020, 740]} soft={0.6} />
      <SealSun cx={W / 2} cy={560} r={74} at={0.6} seed={14} />
      <TitleCentered size={size} />
      <Note text={SAMPLE.end.cta} x={W / 2 - 128} y={1300} at={1.4} />
      <Stroke pts={[[W / 2 - 150, 1328], [W / 2, 1322], [W / 2 + 150, 1330]]} w={8} col={C.ink2} at={1.9} dur={0.35} seed={15} opacity={0.6} kind="even" />
    </Page>
  );
};

const TitleCentered: React.FC<{ size: number }> = ({ size }) => <Title lines={[SAMPLE.end.line]} size={size} y={1170} at={0.9} align="center" />;

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 3.0, component: Title_ },
  { id: "headline", duration: 3.8, hero: 3.4, component: Headline },
  { id: "diagram", duration: 3.6, hero: 3.25, component: Diagram },
  { id: "number", duration: 3.2, hero: 2.85, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.2, component: List },
  { id: "end", duration: 3.0, hero: 2.6, component: End },
];

