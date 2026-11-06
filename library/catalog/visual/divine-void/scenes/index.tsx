/** Divine Void on the shared sample content: title, headline, diagram (a bright frame), number, list, end card. */
import React from "react";
import { fit, SAMPLE, words, wrap, type Sample } from "../../kit";
import { Bloom, Bokeh, C, Caption, Clouds, COLUMN, Core, Dust, Flash, Ground, H, Halo, S, Shaft, Small, T, W } from "./parts";

const HERO_Y = S.layout.heroY;
const CAP_Y = S.layout.captionY;

/** One gold light falls into the void onto a molten core; the question appears under it. */
const Title: React.FC = () => {
  const ws = words(SAMPLE.title);
  const plain = ws.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const s1 = fit([plain], COLUMN, 78, T.charEm);
  return (
    <Ground>
      <Shaft id="t-shaft" from={[W * 0.64, -260]} to={[W / 2, HERO_Y + 40]} at={0} />
      <Bloom x={W / 2} y={HERO_Y} r={330} at={0.3} />
      <Core x={W / 2} y={HERO_Y} r={15} at={0.4} />
      <Halo x={W / 2} y={HERO_Y - 150} rx={150} ry={40} at={1.1} />
      <Dust x={260} y={260} w={560} h={1100} seed={11} />
      <Caption lines={[plain]} size={s1} y={CAP_Y - 40} at={1.0} />
      <Caption lines={[`*${em}*`]} size={150} y={CAP_Y + s1 * T.leading - 10} at={1.4} weight={600} />
      <Flash atFrame={0} />
    </Ground>
  );
};

/** God-rays from one source above the frame; the line in the middle of the void. */
const HeadlineSample: React.FC = () => {
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const lines = [all.slice(0, 2), all.slice(2, 4), all.slice(4)].map((g) => g.map((w) => (w.em ? `*${w.text}*` : w.text)).join(" ").replace(/\* \*/g, " "));
  const size = fit(lines, COLUMN, T.display, T.charEm);
  const src: [number, number] = [W / 2, -360];
  return (
    <Ground>
      {[
        [260, 1650],
        [540, 1700],
        [830, 1650],
      ].map(([x, y], i) => (
        <Shaft key={i} id={`h-shaft-${i}`} from={src} to={[x, y]} at={0.1 * i} width={[40, 260]} opacity={0.32} />
      ))}
      <Bloom x={W / 2} y={-80} r={420} at={0} k={0.8} />
      <Dust x={140} y={300} w={800} h={1300} seed={21} />
      <Caption lines={lines} size={size} y={760} at={0.6} />
    </Ground>
  );
};

/** A bright frame: a pearl (the air molecule) with crystalline cyan bokeh scattering from it. No gold here. */
const Diagram: React.FC = () => {
  const [cx, cy, r] = [W / 2, 800, 120];
  return (
    <Ground bright>
      <Bokeh cx={cx} cy={cy} spread={300} c={C.cyan} seed={8} at={0.6} avoid={[[cx - 240, cy + r, cx + 240, cy + r + 110], [0, CAP_Y - 20, W, H]]} />
      <div
        style={{
          position: "absolute",
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle at 36% 30%, #ffffff 0%, ${C.bone} 40%, #d9d5cc 75%, #bdb8ad 100%)`,
          boxShadow: `0 30px 60px rgba(5,6,10,.18), inset -10px -14px 30px rgba(5,6,10,.12)`,
        }}
      />
      <Small text={SAMPLE.diagram.object} y={cy + r + 40} at={0.4} />
      <Caption lines={wrap(SAMPLE.diagram.label, 10)} size={fit(wrap(SAMPLE.diagram.label, 10), COLUMN, T.display, T.charEm)} y={CAP_Y + 30} at={1.2} />
    </Ground>
  );
};

/** The number over an ember sunrise rising from below. */
const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  return (
    <Ground>
      <Bloom x={W / 2} y={1760} r={620} at={0} />
      <Clouds y={1500} h={520} seed={4} at={0.2} />
      <Dust x={160} y={400} w={760} h={1100} seed={31} />
      <Halo x={W / 2} y={720} rx={320} ry={320} at={0.9} />
      <Caption lines={[`${n.value.toFixed(n.decimals)}${n.unit}`]} size={T.number} y={720 - T.number * 0.62} at={0.3} weight={600} />
      <Small text={n.caption} y={1110} at={1.2} width={COLUMN * 0.9} />
    </Ground>
  );
};

/** Three lines ascending a single thread of light; the one being sung in full, the others dimmed. */
const List: React.FC = () => {
  const n = SAMPLE.list.length;
  return (
    <Ground>
      <Shaft id="l-shaft" from={[W / 2, -300]} to={[W / 2, 1750]} at={0} width={[30, 150]} opacity={0.35} />
      <Dust x={300} y={400} w={480} h={1200} seed={41} />
      {SAMPLE.list.map((item, i) => {
        const current = i === n - 1;
        const ws = item.split(" ");
        const lines = current ? [ws.slice(0, 3).join(" "), `*${ws.slice(3).join(" ")}*`] : wrap(item, 15);
        const size = 62;
        return (
          <div key={i} style={{ opacity: current ? 1 : 0.42 }}>
            <Caption lines={lines} size={size} y={520 + i * 330} at={0.3 + i * 0.5} />
          </div>
        );
      })}
    </Ground>
  );
};

/** The outro: clouds lit from beneath, one last line, then a slow fade to black. */
const End: React.FC = () => {
  const ws = words(SAMPLE.end.line);
  const lines = [ws.filter((w) => !w.em).map((w) => w.text).join(" "), `*${ws.filter((w) => w.em).map((w) => w.text).join(" ")}*`];
  return (
    <Ground fadeAt={3.0}>
      <Bloom x={W / 2} y={1500} r={560} at={0} />
      <Clouds y={1180} h={760} seed={12} at={0} />
      <Dust x={140} y={700} w={800} h={900} seed={51} />
      <Caption lines={lines} size={fit(lines, COLUMN, 124, T.charEm)} y={600} at={0.4} />
      <Small text={SAMPLE.end.cta} y={960} at={1.3} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 4, hero: 3.2, component: Title },
  { id: "headline", duration: 4, hero: 3.2, component: HeadlineSample },
  { id: "diagram", duration: 3.5, hero: 2.9, component: Diagram },
  { id: "number", duration: 4, hero: 3.0, component: NumberSample },
  { id: "list", duration: 4, hero: 3.3, component: List },
  { id: "end", duration: 5, hero: 2.7, component: End },
];
