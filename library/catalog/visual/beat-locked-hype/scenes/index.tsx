/** Beat-Locked Hype on the shared sample content: brand slam, kinetic triplet, cube field, proof, steps, end card. */
import React from "react";
import { clamp, fit, plain, rgba, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { beats, Brackets, C, CubeField, eighths, ease, Ground, Hud, M, MaskLine, Mono, OutlineRepeat, S, Slam, SparkLine, W } from "./parts";
import { SLAM } from "./fonts";

const COL = W - 2 * M;
const CH = S.type.charEm;
/** "Why is the sky *blue?*" → the plain words and the emphasised words, upper-cased for slams. */
const split = (line: string) => {
  const ws = words(line);
  return { plain: ws.filter((w) => !w.em).map((w) => w.text), em: ws.filter((w) => w.em).map((w) => w.text) };
};

/** Brand slam on ink: letters revealed on consecutive 1/16 notes, the spark stretching into a labelled line. */
const Title: React.FC = () => {
  const { plain: p, em } = split(SAMPLE.title);
  const l1 = p.slice(0, 2).join(" ");
  const l2 = p.slice(2).join(" ");
  const l3 = em.join(" ");
  const s12 = Math.min(fit([l1, l2], COL, S.type.slamMax, CH));
  const s3 = fit([l3], COL, S.type.slamMax, CH);
  const at1 = 0.3;
  const at2 = at1 + l1.replace(/ /g, "").length * S.motion.sixteenth;
  const at3 = at2 + l2.replace(/ /g, "").length * S.motion.sixteenth;
  const y1 = 800;
  const y2 = y1 + s12 * S.type.leading;
  const y3 = y2 + s3 * S.type.leading;
  return (
    <Ground grid>
      <Hud scene={1} label="Kinetic type" />
      <Mono text={`${SAMPLE.kicker} — ${SAMPLE.chapter}`} x={W / 2} y={540} align="center" at={0.05} />
      <MaskLine text={l1} size={s12} y={y1} at={at1} />
      <MaskLine text={l2} size={s12} y={y2} at={at2} />
      <MaskLine text={l3} size={s3} y={y3} at={at3} col={C.blue} />
      <SparkLine y={y3 + 120} at={0.05} half={220} label="sky / science — daily" />
    </Ground>
  );
};

/** The kinetic triplet, stacked for vertical: three hard-edged cards, each word with its own treatment, two beats apart. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const w1 = all[0].text;
  const w2 = all[1].text;
  const rest = all.slice(2).filter((w) => !w.em).map((w) => w.text);
  const em = all.filter((w) => w.em).map((w) => w.text).join(" ");
  const a1 = 0.1;
  const a2 = a1 + beats(2);
  const a3 = a2 + beats(2);
  const b1 = [0, 620];
  const b2 = [620, 1010];
  const b3 = [1010, 1920];
  const s1 = fit([w1], COL, S.type.slamMax, CH);
  const s2 = fit([w2], COL, S.type.slamMax, CH);
  const s3 = Math.min(200, fit(rest, COL, S.type.slamMax, CH));
  const band = (y: number[], col: string, at: number) =>
    t >= at ? <div style={{ position: "absolute", left: 0, top: y[0], width: W, height: y[1] - y[0], backgroundColor: col }} /> : null;
  return (
    <Ground bg={C.bg}>
      {band(b1, C.cream, a1)}
      {band(b2, C.bg, a2)}
      {band(b3, C.blue, a3)}
      <Slam lines={[w1]} size={s1} y={470} at={a1} col={C.bg} from="left" />
      <OutlineRepeat text={w2} top={b2[0]} height={b2[1] - b2[0]} size={150} col={C.accent} at={a2} />
      <Slam lines={[w2]} size={s2} y={880} at={a2 + 0.02} col={C.accent} from="right" />
      <Slam lines={rest} size={s3} y={1215} at={a3} col={C.text} from="bottom" />
      <Slam lines={[plain(em)]} size={S.type.serif} y={1520} at={a3 + eighths(2)} col={C.text} serif from="bottom" />
      <Brackets x={48} y={1050} w={W - 96} h={560} col={C.text} at={a3 + eighths(1)} label="1080 × 1920" />
      <Hud scene={2} label="Kinetic type" top={rgba(C.bg, 0.55)} bottom={rgba(C.text, 0.6)} />
    </Ground>
  );
};

/** The signature visual: the spark hits one cube of the field and blue ripples out in every direction. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const [cx, cy] = [540, 1090];
  const hit = 0.65;
  const beam = clamp(ease("slam", t - 0.35) * 1.02, 0, 1);
  const [sx, sy] = [120, 650];
  const [ex, ey] = [cx, cy - 162];
  const title = SAMPLE.diagram.object;
  return (
    <Ground grid>
      <Hud scene={3} label="Signal" />
      <Slam lines={[title]} size={fit([title], COL, 150, CH)} y={470} at={0.1} from="top" />
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={sx} y1={sy} x2={sx + (ex - sx) * beam} y2={sy + (ey - sy) * beam} stroke={C.accent} strokeWidth={6} strokeLinecap="square" />
        <rect x={sx - 9} y={sy - 9} width={18} height={18} fill={C.accent} opacity={clamp(t / 0.1)} />
      </svg>
      <Mono text={`In — ${SAMPLE.diagram.in}`} x={sx - 9} y={sy - 40} at={0.3} />
      <CubeField cx={cx} cy={cy} a={36} at={hit} />
      <Slam lines={[SAMPLE.diagram.label.toLowerCase()]} size={92} y={1460} at={1.6} serif />
      <Mono text={`Out — ${SAMPLE.diagram.out}`} x={W / 2} y={1540} align="center" at={2.0} />
    </Ground>
  );
};

/** Proof: a big count-up whose digits blur while they spin, then staggered bars with one accent bar. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const p = ease("count", t - 0.3);
  const size = Math.min(S.type.number, fit([`${n.value.toFixed(n.decimals)}${n.unit}`], COL, S.type.number, CH));
  const bar = (label: string, frac: number, col: string, y: number, at: number) => {
    const g = ease("impact", t - at);
    return (
      <>
        <Mono text={label} x={M} y={y - 26} at={at} />
        <div style={{ position: "absolute", left: M, top: y, width: COL * frac * clamp(g, 0, 1.03), height: 64, backgroundColor: col }} />
      </>
    );
  };
  return (
    <Ground grid>
      <Hud scene={4} label="Data" />
      <Mono text={`Proof — ${SAMPLE.chapter}`} x={W / 2} y={430} align="center" at={0.05} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: 860 - size * 0.82,
          textAlign: "center",
          fontFamily: SLAM,
          fontWeight: 900,
          fontSize: size,
          lineHeight: S.type.leading,
          letterSpacing: `${S.type.tracking}em`,
          color: C.text,
          filter: p < 0.98 ? `blur(${(1 - p) * 14}px)` : undefined,
          opacity: clamp((t - 0.2) / 0.08),
        }}
      >
        {(n.value * p).toFixed(n.decimals)}
        <span style={{ color: C.accent }}>{n.unit}</span>
      </div>
      {wrap(n.caption, 34).map((line, i) => (
        <Mono key={i} text={line} x={W / 2} y={980 + i * 46} align="center" col={rgba(C.text, 0.78)} at={0.9 + i * eighths(1)} size={28} />
      ))}
      {bar("Blue · 450 nm", 1, C.blue, 1200, 1.4)}
      {bar("Red · 700 nm", 1 / n.value, C.cream, 1360, 1.4 + eighths(1))}
    </Ground>
  );
};

/** Steps: each lands two beats after the last, with a wipe bar; earlier ones step back. */
const List: React.FC = () => {
  const t = useSeconds();
  const size = 88;
  const perLine = Math.floor(COL / (size * CH));
  return (
    <Ground grid>
      <Hud scene={5} label="Steps" />
      {SAMPLE.list.map((item, i) => {
        const at = 0.1 + i * beats(2);
        const last = i === SAMPLE.list.length - 1;
        const y0 = 420 + i * 370;
        const lines = wrap(item.toUpperCase(), perLine);
        const a = clamp((t - at) / 0.05);
        const g = ease("impact", t - at);
        const bar = ease("rule", t - at - eighths(1));
        const dim = !last && t > at + beats(2) ? 0.42 : 1;
        if (t < at) return null;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: M, top: y0, fontFamily: SLAM, fontWeight: 900, fontSize: 30, letterSpacing: "0.04em", color: C.accent, opacity: a }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                position: "absolute",
                left: M,
                top: y0 + 52,
                fontFamily: SLAM,
                fontWeight: 900,
                fontSize: size,
                lineHeight: S.type.leading,
                letterSpacing: `${S.type.tracking}em`,
                color: C.text,
                opacity: a * dim,
                transform: `translateX(${(1 - g) * -S.motion.recipes.slam.distance}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {lines.map((l, k) => (
                <div key={k}>{l}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: M, top: y0 + 52 + lines.length * size * S.type.leading + 22, width: COL * 0.4 * bar, height: 8, backgroundColor: C.accent, opacity: dim }} />
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

/** End card: the name with the accent dot, the italic serif line, a hairline and a tracked mono line typed in. */
const End: React.FC = () => {
  const t = useSeconds();
  const { plain: p, em } = split(SAMPLE.end.line);
  const name = p.join(" ");
  const size = fit([name + " ."], COL, 230, CH);
  const dot = ease("impact", t - 0.1 - name.replace(/ /g, "").length * S.motion.sixteenth);
  const rule = ease("rule", t - 1.3);
  return (
    <Ground>
      <Hud scene={6} label="End" />
      <MaskLine
        text={name}
        size={size}
        y={880}
        at={0.1}
        after={<span style={{ display: "inline-block", width: "0.2em", height: "0.2em", marginLeft: "0.08em", backgroundColor: C.accent, transform: `scale(${clamp(dot, 0, 1.3)})` }} />}
      />
      <Slam lines={[em.join(" ")]} size={150} y={1080} at={1.0} serif />
      <div style={{ position: "absolute", left: W / 2 - 220 * rule, top: 1170, width: 440 * rule, height: 2, backgroundColor: rgba(C.text, 0.4) }} />
      <Mono text={SAMPLE.end.cta} x={W / 2} y={1250} align="center" at={1.5} typed col={C.text} size={30} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.95, component: Title },
  { id: "headline", duration: 3.5, hero: 3.1, component: HeadlineSample },
  { id: "diagram", duration: 3.4, hero: 2.9, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3.4, hero: 3.0, component: List },
  { id: "end", duration: 3.0, hero: 2.7, component: End },
];

