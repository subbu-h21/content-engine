/** Math Explainer on the shared sample content: title, headline, diagram, number, list, end card. */
import React from "react";
import { lerp, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Arrow, B, bracePath, C, Create, dimmed, Dot, E, easeFor, FadeIn, Frac, Ground, Label, Line, M, Plane, S, SERIF, Sup, Svg, T, V, W, wavePath, Write } from "./parts";

/** Colour by concept, kept for every sample: λ yellow, I teal, blue light blue, red light red, sunlight white. */
const COL = { lambda: C.yellow, I: C.teal, blue: C.blue, red: C.red, green: C.green };

/** Words of a line, the *emphasised* ones in a colour. */
const Coloured: React.FC<{ line: string; em: string; plain?: string }> = ({ line, em, plain = C.white }) => (
  <>
    {words(line).map((w, i) => (
      <React.Fragment key={i}>
        {i > 0 ? " " : null}
        <span style={{ color: w.em ? em : plain }}>{w.text}</span>
      </React.Fragment>
    ))}
  </>
);

const Title: React.FC = () => {
  const t = useSeconds();
  const size = T.display;
  const lines = wrap(SAMPLE.title, 15);
  const y0 = S.layout.titleY + size * 0.5;
  const [x0, x1, wy, amp, lam] = [M, W - M, 1170, 120, 260];
  const draw = easeFor("create", t - 1.5, 2);
  const xEnd = lerp(x0, x1, draw);
  const yEnd = wy - amp * Math.sin(((xEnd - x0) / lam) * Math.PI * 2);
  const c1 = x0 + lam * 0.25;
  const c2 = c1 + lam;
  const braceY = wy - amp - 36;
  return (
    <Ground>
      {lines.map((l, i) => (
        <Line key={i} y={y0 + i * size * T.leading} size={size}>
          <Write at={0.2 + i * 0.35}>
            <Coloured line={l} em={COL.blue} />
          </Write>
        </Line>
      ))}
      <Svg>
        <Create d={`M ${x0} ${wy} H ${x1}`} at={1.2} runTime={1} stroke={C.grey} width={E.stroke.axis} opacity={E.ghost} />
        <Create d={wavePath(x0, x1, wy, amp, lam)} at={1.5} runTime={2} stroke={COL.blue} width={E.stroke.graph} />
        {draw > 0 ? <Dot x={xEnd} y={yEnd} at={1.5} /> : null}
        <Create d={bracePath(c1, c2, braceY, -1)} at={2.6} runTime={1} stroke={C.white} width={E.stroke.brace} />
      </Svg>
      <Line y={braceY - 92} size={T.text} x={c1} align="left">
        <FadeIn at={2.9}>
          <V c={COL.lambda}>λ</V> = 450 nm
        </FadeIn>
      </Line>
    </Ground>
  );
};

/** One white beam; three coloured waves come out of copies of it (transform-from-copy). */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const size = 96;
  const all = SAMPLE.headline.flatMap((l) => words(l));
  const plain = all.filter((w) => !w.em).map((w) => w.text);
  const em = all.filter((w) => w.em).map((w) => w.text).join(" ");
  const lines = [plain.slice(0, 2).join(" "), plain.slice(2).join(" ")];
  const rainbow = [C.red, C.gold, C.yellow, C.green, C.blue, C.purple];
  const beamY = 790;
  const [x0, x1] = [M, 780];
  const waves = [
    { nm: 700, c: COL.red, y: 990 },
    { nm: 550, c: COL.green, y: 1170 },
    { nm: 450, c: COL.blue, y: 1350 },
  ];
  const scale = 200 / 450;
  return (
    <Ground>
      <Line y={330} size={size}>
        <Write at={0.1}>{lines[0]}</Write>
      </Line>
      <Line y={330 + size * T.leading} size={size}>
        <Write at={0.35}>
          {lines[1].split("").map((ch, i, a) => (
            <span key={i} style={{ color: rainbow[Math.min(rainbow.length - 1, Math.floor((i / a.length) * rainbow.length))] }}>
              {ch}
            </span>
          ))}
        </Write>
      </Line>
      <Line y={330 + 2 * size * T.leading} size={size}>
        <Write at={0.6}>
          <span style={{ color: C.yellow }}>{em}</span>
        </Write>
      </Line>
      <Svg>
        <Create d={`M ${x0} ${beamY} H ${x1}`} at={1.3} runTime={1} stroke={C.white} width={E.stroke.line + 2} />
        {waves.map((w, i) => {
          const p = easeFor("transform", t - 2.0 - i * 0.15, 1.5);
          if (p <= 0) return null;
          const y = lerp(beamY, w.y, p);
          const col = p < 0.5 ? C.white : w.c;
          return <path key={w.nm} d={wavePath(x0, x1, y, 56 * p, w.nm * scale)} stroke={col} strokeWidth={E.stroke.graph} fill="none" strokeLinecap="round" opacity={lerp(0.6, 1, p)} />;
        })}
        <Label x={x0} y={beamY - 34} anchor="start" size={T.small} c={C.greyB} at={1.6}>
          sunlight
        </Label>
        {waves.map((w, i) => (
          <Label key={w.nm} x={x1 + 28} y={w.y + 14} anchor="start" size={T.small} c={w.c} at={3.0 + i * 0.1}>
            {`${w.nm} nm`}
          </Label>
        ))}
      </Svg>
    </Ground>
  );
};

/** I ∝ 1/λ⁴ pinned at the top; a number plane; blue scatters every way, red barely, and mostly carries on. */
const Diagram: React.FC = () => {
  const [ox, oy] = [W / 2, 1080];
  const src: [number, number] = [150, 690];
  const inA = Math.atan2(oy - src[1], ox - src[0]);
  // blue leaves in six directions 45° apart; the gaps are where the light comes in and where the label sits
  const dirs = [270, 315, 0, 45, 90, 135].map((d) => (d * Math.PI) / 180);
  const r0 = 44;
  const blueLen = 300;
  const redLen = blueLen / SAMPLE.number.value;
  const at = (a: number, r: number): [number, number] => [ox + r * Math.cos(a), oy + r * Math.sin(a)];
  return (
    <Ground>
      <Line y={S.layout.titleY + 40} size={T.equation}>
        <Write at={0.1} runTime={1.5}>
          <V c={COL.I}>I</V> ∝ <Frac n="1" d={<><V c={COL.lambda}>λ</V><Sup>4</Sup></>} />
        </Write>
      </Line>
      <Svg>
        <Plane ox={ox} oy={oy} at={0.4} top={600} bottom={1480} />
        <Arrow x1={src[0]} y1={src[1]} x2={ox - Math.cos(inA) * (r0 + 10)} y2={oy - Math.sin(inA) * (r0 + 10)} at={1.2} c={C.white} />
        {dirs.map((a, i) => {
          const [x1, y1] = at(a, r0);
          const [x2, y2] = at(a, r0 + blueLen);
          return <Arrow key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} at={2.0 + i * 0.1} c={COL.blue} />;
        })}
        {dirs.slice(0, -1).map((a, i) => {
          const b = a + Math.PI / 8;
          const [x1, y1] = at(b, r0);
          const [x2, y2] = at(b, r0 + redLen);
          return <Arrow key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} at={2.4 + i * 0.1} c={COL.red} width={6} />;
        })}
        <circle cx={ox} cy={oy} r={22} fill={C.white} />
        <Label x={src[0] + 6} y={src[1] - 30} anchor="start" at={1.4}>
          Sunlight
        </Label>
        <Label x={ox - 58} y={oy + 16} anchor="end" at={1.0}>
          Air molecule
        </Label>
        <Label x={W / 2} y={1550} c={COL.blue} at={3.2}>
          {SAMPLE.diagram.label}
        </Label>
      </Svg>
    </Ground>
  );
};

/** (700/450)⁴ ≈ 5.9 written, the 5.9 boxed, the rest dimmed; a decimal counter grows to 5.9. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const dim = dimmed(t, 2.6, E.dimText);
  const box = easeFor("box", t - 2.4, 1);
  const count = easeFor("count", t - 1.0, 2);
  return (
    <Ground>
      <Line y={430} size={T.equation}>
        <Write at={0.2} runTime={2}>
          <span style={{ opacity: dim }}>
            (<Frac n={<span style={{ color: COL.red }}>700</span>} d={<span style={{ color: COL.blue }}>450</span>} />)<Sup>4</Sup> ≈{" "}
          </span>
          <span style={{ position: "relative", display: "inline-block" }}>
            {n.value.toFixed(n.decimals)}
            {box > 0 ? (
              <svg style={{ position: "absolute", left: -E.box.buff, top: -E.box.buff + 0.12 * T.equation, width: `calc(100% + ${2 * E.box.buff}px)`, height: T.equation * 0.86 + 2 * E.box.buff, overflow: "visible" }}>
                <rect x={0} y={0} width="100%" height="100%" fill="none" stroke={C.yellow} strokeWidth={E.stroke.box} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - box} />
              </svg>
            ) : null}
          </span>
        </Write>
      </Line>
      <Line y={920} size={T.number} color={C.yellow}>
        <FadeIn at={1.0}>
          {(n.value * count).toFixed(n.decimals)}
          <span style={{ fontSize: "0.7em" }}>{n.unit}</span>
        </FadeIn>
      </Line>
      <div style={{ position: "absolute", left: M, right: M, top: 1180, textAlign: "center", fontFamily: SERIF, fontSize: T.body, lineHeight: 1.3, color: C.greyB }}>
        <FadeIn at={1.8}>
          more scattering for <span style={{ color: COL.blue }}>blue (450 nm)</span> than <span style={{ color: COL.red }}>red (700 nm)</span>
        </FadeIn>
      </div>
    </Ground>
  );
};

/** Three steps written one after another, each arriving down an arrow; the step being spoken stays lit, the rest dim. */
const List: React.FC = () => {
  const t = useSeconds();
  const size = T.text;
  const gap = 330;
  const top = 560;
  const n = SAMPLE.list.length;
  return (
    <Ground>
      {SAMPLE.list.map((item, i) => {
        const at = 0.2 + i * 1.0;
        const op = i < n - 1 ? dimmed(t, at + 1.0, E.dimText) : 1;
        const lines = wrap(item.replace(/^Blue/, "*Blue*"), 18);
        const y = top + i * gap;
        return (
          <React.Fragment key={i}>
            {lines.map((l, j) => (
              <Line key={j} y={y + (j - (lines.length - 1) / 2) * size * T.leading} size={size} opacity={op}>
                <Write at={at + 0.15} runTime={1}>
                  <Coloured line={l} em={COL.blue} />
                </Write>
              </Line>
            ))}
            {i > 0 ? (
              <Svg opacity={i < n - 1 ? dimmed(t, at + 1.0, E.dim) : 1}>
                <Arrow x1={W / 2} y1={y - gap + 120} x2={W / 2} y2={y - 110} at={at - 0.1} c={C.white} width={6} />
              </Svg>
            ) : null}
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => (
  <Ground>
    <Line y={880} size={T.equation}>
      <Write at={0.2} runTime={1.5}>
        <Coloured line={SAMPLE.end.line} em={C.yellow} />
      </Write>
    </Line>
    <Line y={880 + B.large * 0.75} size={T.label} color={C.greyB}>
      <FadeIn at={1.7}>{SAMPLE.end.cta}</FadeIn>
    </Line>
  </Ground>
);

export const samples: Sample[] = [
  { id: "title", duration: 4.5, hero: 3.9, component: Title },
  { id: "headline", duration: 4.5, hero: 4.0, component: HeadlineSample },
  { id: "diagram", duration: 4.5, hero: 4.0, component: Diagram },
  { id: "number", duration: 4.5, hero: 3.9, component: NumberSample },
  { id: "list", duration: 4.5, hero: 3.6, component: List },
  { id: "end", duration: 3.5, hero: 2.9, component: End },
];

