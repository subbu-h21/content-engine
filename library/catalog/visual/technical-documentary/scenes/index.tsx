/**
 * Technical Documentary on the shared sample content: a dimensioned wave (title), a wavelength axis (headline), a polar
 * scattering plot (diagram), a plot with a moving state dot and the worked ratio (number), a process schematic (list)
 * and the boxed result (end). Every number shown is true: (700 / 450)^4 = 5.86, and I(θ) ∝ 1 + cos²θ.
 */
import React from "react";
import { fit, lerp, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import {
  Arrow,
  Axes,
  C,
  closedPath,
  COLUMN,
  DimLine,
  Dot,
  E,
  ease,
  Eq,
  Eyebrow,
  Frac,
  Guide,
  Headline,
  I,
  Leader,
  M,
  mapper,
  mix,
  Note,
  partialEnd,
  partialPath,
  ResultBox,
  S,
  Sup,
  Svg,
  Tag,
  Term,
  TOP,
  W,
  Ground,
  type Box,
  type Pt,
} from "./parts";
import { BODY, DISPLAY } from "./fonts";

const HEAD_Y = S.layout.headlineY;
const chapter = (n: number, title: string) => `${String(n).padStart(2, "0")}  —  ${title}`;
const starLast = (s: string) => s.replace(/(\S+)$/, "*$1*");
const unit = (s: string) => <span style={{ fontFamily: BODY, fontStyle: "normal", fontSize: S.type.tick, color: C.muted, marginLeft: 10 }}>{s}</span>;

/** Title: the question, over one wavelength of blue light drawn and dimensioned like a technical drawing. */
const Title: React.FC = () => {
  const t = useSeconds();
  const size = S.type.title;
  const lines = wrap(SAMPLE.title, Math.floor(COLUMN / (size * S.type.charEm)));
  const x0 = M;
  const x1 = W - M;
  const cy = 1200;
  const lambda = 300;
  const amp = 100;
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 4) pts.push([x, cy - amp * Math.sin(((x - x0) / lambda) * Math.PI * 2)]);
  const d = ease("draw", t - 0.7);
  const pen = partialEnd(pts, d);
  const c1 = x0 + lambda * 1.25;
  const c2 = x0 + lambda * 2.25;
  const top = cy - amp;
  const dimY = top - 90;
  return (
    <Ground>
      <Eyebrow text={SAMPLE.kicker} y={TOP} at={0.1} rule />
      <Headline lines={lines} size={size} y={HEAD_Y + 60} at={0.3} />
      <Svg>
        <line x1={x0} y1={cy} x2={lerp(x0, x1 + 30, ease("axes", t - 0.5))} y2={cy} stroke={C.faint} strokeWidth={E.grid.width} strokeDasharray={E.reference.dash.join(" ")} />
        <path d={partialPath(pts, d)} fill="none" stroke={C.accent2} strokeWidth={E.curve.accent} strokeLinecap="round" />
        <DimLine p0={[c1, dimY]} p1={[c2, dimY]} e0={[c1, top - 14]} e1={[c2, top - 14]} frac={ease("dimension", t - 1.7)} opacity={ease("fade", t - 1.7)} />
        <Dot x={pen[0]} y={pen[1]} opacity={ease("fade", t - 0.7)} />
      </Svg>
      <Eq x={(c1 + c2) / 2} y={dimY - 56} size={S.type.equation} align="center">
        <Term at={2.0} next={2.25}>
          <I>λ</I>
        </Term>
        <Term at={2.25} next={2.4}>
          {" "}={" "}
        </Term>
        <Term at={2.4}>450 nm</Term>
      </Eq>
      <Tag x={x1} y={cy + amp + 60} anchor="right" pill={false} size={S.type.tick} tone={C.muted} opacity={ease("fade", t - 2.0)}>
        one wavelength of blue light
      </Tag>
    </Ground>
  );
};

/** Headline: sunlight's colours laid out on a wavelength axis, blue and red marked, the visible band dimensioned. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const size = fit(SAMPLE.headline, COLUMN, S.type.display, S.type.charEm);
  const AX: Box = { x: 150, y: 1060, w: 700, h: 0 };
  const X = (nm: number) => AX.x + ((nm - 400) / 300) * AX.w;
  const y0 = AX.y;
  const axis = ease("axes", t - 1.0);
  const ticks = Math.max(0, Math.min(1, (axis - 0.6) / 0.4));
  const k = E.axis;
  const mark = (nm: number, tone: string, label: string, at: number) => {
    const a = ease("fade", t - at);
    return (
      <>
        <Svg opacity={a}>
          <Guide p0={[X(nm), y0]} p1={[X(nm), y0 - 150]} stroke={tone} />
          <Dot x={X(nm)} y={y0} fill={tone} />
        </Svg>
        <Tag x={X(nm)} y={y0 - 182} anchor="center" opacity={a}>
          {label}
        </Tag>
      </>
    );
  };
  return (
    <Ground>
      <Eyebrow text={chapter(1, SAMPLE.chapter)} y={TOP} at={0.1} rule />
      <Headline lines={SAMPLE.headline} size={size} y={HEAD_Y} at={0.3} />
      <Svg>
        <line x1={AX.x - 50} y1={y0} x2={lerp(AX.x - 50, AX.x + AX.w + 50, axis)} y2={y0} stroke={C.text} strokeOpacity={k.opacity} strokeWidth={k.width} />
        {axis > 0.98 ? <ArrowEnd x={AX.x + AX.w + 50} y={y0} /> : null}
        {[400, 450, 500, 550, 600, 650, 700].map((nm) => (
          <line key={nm} x1={X(nm)} y1={y0} x2={X(nm)} y2={y0 + k.tick} stroke={C.text} strokeOpacity={k.tickOpacity * ticks} strokeWidth={k.tickWidth} />
        ))}
        <DimLine p0={[X(400), y0 + 190]} p1={[X(700), y0 + 190]} e0={[X(400), y0 + 66]} e1={[X(700), y0 + 66]} frac={ease("dimension", t - 2.1)} opacity={ease("fade", t - 2.1)} />
      </Svg>
      {[400, 450, 500, 550, 600, 650, 700].map((nm) => (
        <Tag key={nm} x={X(nm)} y={y0 + 40} anchor="center" pill={false} size={S.type.tick} tone={C.muted} opacity={ticks}>
          {nm}
        </Tag>
      ))}
      <Tag x={W - M} y={y0 + 40} anchor="right" pill={false} display size={S.type.symbol} opacity={ticks}>
        <I>λ</I>
        {unit("nm")}
      </Tag>
      {mark(450, C.accent2, "blue", 1.7)}
      {mark(700, C.accent, "red", 1.85)}
      <Note x={W / 2} y={y0 + 226} align="center" width={COLUMN} at={2.4}>
        visible sunlight: about 400 – 700 nm, all at once
      </Note>
    </Ground>
  );
};

/** An axis arrowhead pointing right. */
const ArrowEnd: React.FC<{ x: number; y: number }> = ({ x, y }) => <Arrow p0={[x - 20, y]} p1={[x, y]} stroke={C.text} width={E.axis.width} head={E.axis.arrow} opacity={E.axis.opacity} />;

/** Diagram: one air molecule's scattering pattern as a polar plot, the direction θ read off by a moving state dot. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const CX = 560;
  const CY = 930;
  const RMAX = 300;
  const rOf = (th: number) => (RMAX * (1 + Math.cos(th) ** 2)) / 2;
  const at = (th: number): Pt => [CX + rOf(th) * Math.cos(th), CY + rOf(th) * Math.sin(th)];
  const curve: Pt[] = Array.from({ length: 181 }, (_, i) => at((i / 180) * Math.PI * 2));
  const grid = ease("axes", t - 0.2);
  const draw = ease("draw", t - 1.0);
  const fill = ease("fade", t - 2.1);
  const thEnd = (50 * Math.PI) / 180;
  const s = ease("state", t - 2.0);
  const th = thEnd * s;
  const dot = at(th);
  const lines = wrap(starLast(SAMPLE.diagram.out), Math.floor(COLUMN / (S.type.display * S.type.charEm)));
  const arc = (r: number, a0: number, a1: number) => `M ${CX + r * Math.cos(a0)} ${CY + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${CX + r * Math.cos(a1)} ${CY + r * Math.sin(a1)}`;
  const label = at(-0.7);
  return (
    <Ground>
      <Eyebrow text={chapter(2, "How it works")} y={TOP} at={0.1} rule />
      <Headline lines={lines} size={fit(lines, COLUMN, S.type.display, S.type.charEm)} y={HEAD_Y} at={0.3} />
      <Svg>
        {[RMAX / 3, (2 * RMAX) / 3, RMAX].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r * grid} fill="none" stroke={C.faint} strokeWidth={E.grid.width} />
        ))}
        <line x1={CX} y1={CY - (RMAX + 30) * grid} x2={CX} y2={CY + (RMAX + 30) * grid} stroke={C.faint} strokeWidth={E.grid.width} />
        {fill > 0 ? <path d={closedPath(curve)} fill={C.accent2} opacity={E.band * fill} /> : null}
        <path d={partialPath(curve, draw)} fill="none" stroke={C.accent2} strokeWidth={E.curve.accent} />
        <Arrow p0={[M, CY]} p1={[CX - 24, CY]} stroke={C.text} frac={ease("draw", t - 0.4)} />
        {s > 0 ? (
          <>
            <line x1={CX} y1={CY} x2={dot[0]} y2={dot[1]} stroke={C.text} strokeOpacity={E.axis.opacity} strokeWidth={E.axis.width} />
            <path d={arc(84, 0, Math.max(0.001, th))} fill="none" stroke={C.text} strokeOpacity={E.axis.opacity} strokeWidth={E.axis.width} />
            <Dot x={dot[0]} y={dot[1]} />
          </>
        ) : null}
        <Dot x={CX} y={CY} r={11} halo={0} opacity={ease("fade", t - 0.3)} />
      </Svg>
      <Tag x={CX + 122 * Math.cos(th / 2)} y={CY + 122 * Math.sin(th / 2)} anchor="center" pill={false} display size={S.type.symbol} opacity={ease("fade", t - 2.6)}>
        <I>θ</I>
      </Tag>
      <Tag x={M} y={CY - 46} anchor="left" opacity={ease("fade", t - 0.6)}>
        {SAMPLE.diagram.in}
      </Tag>
      <Leader text={SAMPLE.diagram.label} from={label} to={[label[0] - 170, label[1] - 120]} side="left" accent={C.accent2} at={2.3} />
      <Leader text={SAMPLE.diagram.object} from={[CX, CY]} to={[380, CY + RMAX + 80]} side="left" at={1.6} />
      <Eq x={W / 2} y={1470} align="center">
        <Term at={2.6} next={2.95}>
          <I>I</I>(<I>θ</I>)
        </Term>
        <Term at={2.95} next={3.15}>
          {" "}∝{" "}
        </Term>
        <Term at={3.15}>
          1 + cos<Sup>2</Sup>
          <I>θ</I>
        </Term>
      </Eq>
    </Ground>
  );
};

/** Number: the ratio, then I ∝ λ⁻⁴ plotted, a state dot sliding from red to blue, and the worked line with its result. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const size = S.type.number;
  const box: Box = { x: 200, y: 830, w: 700, h: 460 };
  const P = mapper(box, 400, 700, 0, 10);
  const f = (nm: number) => (700 / nm) ** 4;
  const curve: Pt[] = [];
  for (let nm = 400; nm <= 700; nm += 5) curve.push([P.X(nm), P.Y(f(nm))]);
  const s = ease("state", t - 1.5);
  const nm = lerp(700, 450, s);
  const read = ease("fade", t - 2.8);
  const red: Pt = [P.X(700), P.Y(1)];
  const blue: Pt = [P.X(450), P.Y(f(450))];
  const y0 = box.y + box.h;
  return (
    <Ground>
      <Eyebrow text={chapter(3, "By the numbers")} y={TOP} at={0.1} rule />
      <div style={{ position: "absolute", left: M, top: 560 - size * 0.8, fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color: C.text, opacity: ease("fade", t - 0.2) }}>
        {n.value.toFixed(n.decimals)}
        <span style={{ fontStyle: "italic" }}>{n.unit}</span>
      </div>
      <Note x={M} y={610} width={760} at={0.6}>
        {n.caption}
      </Note>
      <Axes
        box={box}
        frac={ease("axes", t - 0.5)}
        xLabel={
          <>
            <I>λ</I>
            {unit("nm")}
          </>
        }
        yLabel={
          <>
            <I>I</I>
            {unit("relative, red = 1")}
          </>
        }
        xTicks={[400, 500, 600, 700].map((v) => ({ at: P.X(v), label: String(v) }))}
        yTicks={[{ at: P.Y(10), label: "10" }]}
      />
      <Svg>
        <path d={partialPath(curve, ease("draw", t - 0.9))} fill="none" stroke={C.text} strokeWidth={E.curve.width} />
        <Guide p0={red} p1={[box.x, red[1]]} stroke={C.accent} opacity={read} />
        <Guide p0={blue} p1={[box.x, blue[1]]} stroke={C.accent2} opacity={read} />
        <Guide p0={blue} p1={[blue[0], y0]} stroke={C.accent2} opacity={read} />
        <Dot x={red[0]} y={red[1]} fill={C.accent} r={7} halo={0} opacity={ease("fade", t - 1.3)} />
        {s > 0 ? <Dot x={P.X(nm)} y={P.Y(f(nm))} /> : null}
      </Svg>
      <Tag x={box.x - 18} y={red[1]} anchor="right" pill={false} size={S.type.tick} tone={C.accent} opacity={read}>
        1
      </Tag>
      <Tag x={box.x - 18} y={blue[1]} anchor="right" pill={false} size={S.type.tick} tone={C.accent2} opacity={read}>
        5.9
      </Tag>
      <Tag x={blue[0]} y={y0 + 34} anchor="center" pill={false} size={S.type.tick} tone={C.accent2} opacity={read}>
        450
      </Tag>
      <Eq x={W / 2} y={1490} align="center">
        <Term at={2.9} next={3.2}>
          (700 / 450)<Sup>4</Sup>
        </Term>
        <Term at={3.2} next={3.35}>
          {" "}≈{" "}
        </Term>
        <Term at={3.35} c={C.accent}>
          5.9
        </Term>
      </Eq>
    </Ground>
  );
};

/** List: a process schematic. Nodes joined by arrows; the step being spoken is bone, the steps already read are ash. */
const List: React.FC = () => {
  const t = useSeconds();
  const X0 = 150;
  const TX = 220;
  const size = S.type.list;
  const maxChars = Math.floor(600 / (size * S.type.charEm * 0.94));
  const block = 2 * size * S.type.leading;
  const rows = SAMPLE.list.map((item, i) => ({ item, y: 660 + i * 330, at: 0.4 + i * 0.7 }));
  return (
    <Ground>
      <Eyebrow text={chapter(4, "In three steps")} y={TOP} at={0.1} rule />
      <Svg>
        {rows.slice(1).map((r, i) => (
          <Arrow key={i} p0={[X0, rows[i].y + 30]} p1={[X0, r.y - 30]} stroke={C.text} width={E.axis.width} head={E.axis.arrow} frac={ease("draw", t - r.at + 0.5)} opacity={E.axis.opacity} />
        ))}
        {rows.map((r, i) => {
          const a = ease("fade", t - r.at);
          const next = rows[i + 1]?.at;
          const live = next === undefined ? 1 : 1 - ease("spoken", t - next);
          return a > 0 ? (
            <g key={i} opacity={a}>
              <circle cx={X0} cy={r.y} r={12} fill={C.bg} stroke={mix(C.muted, C.text, live)} strokeWidth={2} />
              {live > 0.01 ? <Dot x={X0} y={r.y} r={7} opacity={live} /> : null}
            </g>
          ) : null;
        })}
      </Svg>
      {rows.map((r, i) => {
        const next = rows[i + 1]?.at;
        const live = next === undefined ? 1 : 1 - ease("spoken", t - next);
        return (
          <React.Fragment key={i}>
            <Tag x={TX} y={r.y - block / 2 - 26} pill={false} size={S.type.eyebrow} tone={C.muted} opacity={ease("fade", t - r.at)}>
              {String(i + 1).padStart(2, "0")}
            </Tag>
            <Headline lines={wrap(r.item, maxChars)} size={size} x={TX} y={r.y - block / 2 + size * 0.78} at={r.at} tone={mix(C.muted, C.text, live)} />
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

/** End: the line, then the law that explains it, boxed like a derived result. */
const End: React.FC = () => {
  const t = useSeconds();
  const size = fit([SAMPLE.end.line], COLUMN, S.type.title, S.type.charEm);
  const cy = 1030;
  return (
    <Ground>
      <Headline lines={[SAMPLE.end.line]} size={size} y={760} at={0.2} align="center" />
      <ResultBox x={W / 2 - 250} y={cy - 110} w={500} h={220} at={1.5} />
      <Eq x={W / 2} y={cy} size={S.type.result} align="center">
        <Term at={0.8} next={1.05}>
          <I>I</I>
        </Term>
        <Term at={1.05} next={1.2}>
          {" "}∝{" "}
        </Term>
        <Term at={1.2}>
          <Frac
            n="1"
            d={
              <>
                <I>λ</I>
                <Sup>4</Sup>
              </>
            }
          />
        </Term>
      </Eq>
      <Eyebrow text={SAMPLE.end.cta} y={cy + 230} at={1.4} align="center" rule />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.4, hero: 2.9, component: Title },
  { id: "headline", duration: 3.6, hero: 3.1, component: HeadlineSample },
  { id: "diagram", duration: 4.3, hero: 3.8, component: Diagram },
  { id: "number", duration: 4.2, hero: 3.8, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.1, component: List },
  { id: "end", duration: 3.0, hero: 2.5, component: End },
];
