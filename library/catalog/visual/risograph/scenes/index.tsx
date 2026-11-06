/** Risograph on the shared sample content: one print per sample, each plate arriving by roller. */
import React from "react";
import { fit, SAMPLE, words, wrap, type Sample } from "../../kit";
import { Big, disc, figure, type Fill, M, Plate, poly, Print, type Pt, S, Small, stripRect, W, wedge } from "./parts";

const T = S.type;
const E = S.elements;
const DH = E.doubleHit;
const em = (l: string) => words(l).filter((w) => w.em).map((w) => w.text).join(" ");
const lead = (l: string) => words(l).filter((w) => !w.em).map((w) => w.text).join(" ");

/** The figure with its paper-white knockout halo (in the plates it isn't printed on). */
const Halo: React.FC<{ d: string }> = ({ d }) => <path d={d} fill="#fff" stroke="#fff" strokeWidth={E.halo * 2} strokeLinejoin="round" />;

const Title: React.FC = () => {
  const [cx, cy, r] = [540, 905, 410];
  const sun: Pt = [600, 965];
  const hillY = (x: number) => 1140 + 0.00035 * (x - 600) * (x - 600);
  const hill = poly([...Array.from({ length: 23 }, (_, i): Pt => [100 + i * 40, hillY(100 + i * 40)]), [980, 1400], [100, 1400]]);
  const fig = figure(600, hillY(600) + 4, 185);
  const top = lead(SAMPLE.title).toUpperCase();
  const size = fit([top], W - 2 * M, T.display, T.charEm);
  const domeClip = (f: Fill) => (
    <clipPath id={`ti-dome-${f.ink}`}>
      <circle cx={cx} cy={cy} r={r} />
    </clipPath>
  );
  return (
    <Print seed={1}>
      <Plate ink="yellow" seed={1} at={0.45}>
        {(f) => (
          <>
            <path d={disc(sun[0], sun[1], 128)} fill={f.solid} />
            <Halo d={fig} />
          </>
        )}
      </Plate>
      <Plate ink="pink" seed={1} at={0.85} kick={1.65} dir="up">
        {(f) => (
          <>
            {domeClip(f)}
            <g clipPath={`url(#ti-dome-${f.ink})`}>
              <path d={hill} fill={f.solid} />
            </g>
            <Halo d={fig} />
            <Big x={540 + DH} y={1565 + DH * 0.6} size={T.title} fill={f.solid}>
              {em(SAMPLE.title).toUpperCase()}
            </Big>
          </>
        )}
      </Plate>
      <Plate ink="blue" seed={1} at={0.05}>
        {(f) => (
          <>
            {domeClip(f)}
            <Small x={540} y={262} size={T.kicker} fill={f.solid} weight={600}>
              {SAMPLE.kicker.toUpperCase()}
            </Small>
            <Big x={540} y={410} size={size} fill={f.solid}>
              {top}
            </Big>
            <g clipPath={`url(#ti-dome-${f.ink})`}>
              <rect x={0} y={480} width={W} height={160} fill={f.solid} />
              <rect x={0} y={640} width={W} height={130} fill={f.tint(62)} />
              <rect x={0} y={770} width={W} height={130} fill={f.tint(38)} />
              <rect x={0} y={900} width={W} height={420} fill={f.tint(20)} />
            </g>
            <path d={disc(sun[0], sun[1], 128 + E.halo)} fill={f.ko} />
            <Halo d={fig} />
            <path d={fig} fill={f.solid} />
            <Big x={540} y={1565} size={T.title} fill={f.solid}>
              {em(SAMPLE.title).toUpperCase()}
            </Big>
          </>
        )}
      </Plate>
    </Print>
  );
};

const HeadlineSample: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const lines = [l1, lead(l2)];
  const size = fit(lines, W - 2 * M, 112, 0.56);
  const y0 = 1270;
  const rr = 235;
  return (
    <Print seed={2}>
      <Plate ink="blue" seed={2} at={0.05}>
        {(f) => (
          <>
            <Small x={540} y={262} size={T.kicker} fill={f.solid} weight={600}>
              {SAMPLE.chapter.toUpperCase()}
            </Small>
            <path d={disc(540, 905, rr)} fill={f.solid} />
            {lines.map((l, i) => (
              <Big key={i} x={540} y={y0 + i * size * 1.02} size={size} fill={f.solid}>
                {l}
              </Big>
            ))}
          </>
        )}
      </Plate>
      <Plate ink="yellow" seed={2} at={0.55} kick={1.0}>
        {(f) => <path d={disc(420, 700, rr)} fill={f.solid} />}
      </Plate>
      <Plate ink="pink" seed={2} at={1.0} kick={1.45} dir="right">
        {(f) => (
          <>
            <path d={disc(660, 700, rr)} fill={f.solid} />
            <Big x={540} y={y0 + 2 * size * 1.02} size={size} fill={f.solid}>
              {em(l2)}
            </Big>
          </>
        )}
      </Plate>
    </Print>
  );
};

const Diagram: React.FC = () => {
  const d = SAMPLE.diagram;
  const [mx, my] = [535, 950];
  const sun: Pt = [200, 400];
  const a = (deg: number, r: number): Pt => [mx + r * Math.cos((deg * Math.PI) / 180), my + r * Math.sin((deg * Math.PI) / 180)];
  const rays = [-90, -55, -30, 30, 95, 125, 155, 180, -155];
  const lab = (text: string, cx: number, y: number) => ({ text, cx, y, r: stripRect(cx, y, text, T.label) });
  const labels = [lab(d.in, 430, 330), lab(d.object, 840, 965), lab(d.out, 540, 1445)];
  const ko = (f: Fill) => labels.map((l, i) => <rect key={i} {...l.r} fill={f.ko} />);
  return (
    <Print seed={3}>
      <Plate ink="yellow" seed={3} at={0.05}>
        {(f) => (
          <>
            <path d={disc(sun[0], sun[1], 110)} fill={f.solid} />
            <path d={wedge([sun[0] + 50, sun[1] + 70], a(-125, 110), 52, 40)} fill={f.tint(62)} />
            {ko(f)}
          </>
        )}
      </Plate>
      <Plate ink="pink" seed={3} at={0.5} kick={0.95}>
        {(f) => (
          <>
            <path d={`${disc(mx - 55, my, 92)}`} fill={f.solid} />
            <path d={`${disc(mx + 55, my, 92)}`} fill={f.solid} />
            <path d={wedge(a(53, 120), a(53, 380), 40, 32)} fill={f.tint(62)} />
            {ko(f)}
          </>
        )}
      </Plate>
      <Plate ink="blue" seed={3} at={1.0} kick={1.45}>
        {(f) => (
          <>
            <path d={disc(mx - 55, my, 92)} fill={f.tint(38)} />
            {rays.map((deg, i) => (
              <path key={i} d={wedge(a(deg, 128), a(deg, 300 - (i % 2) * 45), 16, 4)} fill={f.solid} />
            ))}
            {ko(f)}
            {labels.map((l, i) => (
              <Small key={i} x={l.cx} y={l.y} size={T.label} fill={f.solid}>
                {l.text}
              </Small>
            ))}
          </>
        )}
      </Plate>
    </Print>
  );
};

const NumberSample: React.FC = () => {
  const n = SAMPLE.number;
  const value = `${n.value.toFixed(n.decimals)}${n.unit}`;
  const len = W - 2 * M;
  const cap = wrap(n.caption, 34);
  return (
    <Print seed={4}>
      <Plate ink="yellow" seed={4} at={0.05}>
        {(f) => <path d={disc(830, 470, 130)} fill={f.solid} />}
      </Plate>
      <Plate ink="blue" seed={4} at={0.3} kick={0.8}>
        {(f) => (
          <>
            <Small x={540} y={262} size={T.kicker} fill={f.solid} weight={600}>
              BY THE NUMBERS
            </Small>
            <Big x={540} y={790} size={T.number} fill={f.solid} tracking={-0.03}>
              {value}
            </Big>
            {cap.map((l, i) => (
              <Small key={i} x={540} y={930 + i * T.body * 1.25} fill={f.solid}>
                {l}
              </Small>
            ))}
            <Small x={M} y={1160} size={T.label} fill={f.solid} anchor="start" weight={600}>
              Blue · 450 nm
            </Small>
            <rect x={M} y={1185} width={len} height={64} fill={f.solid} />
            <Small x={M} y={1370} size={T.label} fill={f.solid} anchor="start" weight={600}>
              Red · 700 nm
            </Small>
            <rect x={M} y={1395} width={len} height={64} fill={f.tint(20)} />
          </>
        )}
      </Plate>
      <Plate ink="pink" seed={4} at={0.75} kick={1.25} dir="right">
        {(f) => (
          <>
            <Big x={540 + DH} y={790 + DH * 0.6} size={T.number} fill={f.solid} tracking={-0.03}>
              {value}
            </Big>
            <rect x={M} y={1395} width={len / n.value} height={64} fill={f.solid} />
          </>
        )}
      </Plate>
    </Print>
  );
};

const List: React.FC = () => {
  const inks = ["yellow", "pink", "blue"] as const;
  return (
    <Print seed={5}>
      <Plate ink="blue" seed={5} at={0.05}>
        {(f) => (
          <>
            <Small x={540} y={262} size={T.kicker} fill={f.solid} weight={600}>
              IN THREE STEPS
            </Small>
            {[0, 1].map((i) => (
              <rect key={i} x={M} y={760 + i * 360} width={W - 2 * M} height={16} fill={f.tint(38)} />
            ))}
          </>
        )}
      </Plate>
      {SAMPLE.list.map((item, i) => {
        const y = 580 + i * 360;
        const at = 0.25 + i * S.motion.stagger;
        const ls = wrap(item, 16);
        return (
          <React.Fragment key={i}>
            <Plate ink={inks[i]} seed={50 + i} at={at} kick={at + 0.45}>
              {(f) => (
                <>
                  <path d={disc(185, y, 100)} fill={f.solid} />
                  <Big x={185} y={y + 46} size={130} fill={f.ko}>
                    {i + 1}
                  </Big>
                </>
              )}
            </Plate>
            <Plate ink="blue" seed={60 + i} at={at + 0.15} dir="right">
              {(f) => (
                <>
                  {ls.map((l, k) => (
                    <Big key={k} x={330} y={y - (ls.length - 1) * 33 + 20 + k * 66} size={T.list} fill={f.solid} anchor="start">
                      {l}
                    </Big>
                  ))}
                </>
              )}
            </Plate>
          </React.Fragment>
        );
      })}
    </Print>
  );
};

const End: React.FC = () => {
  const lines = [lead(SAMPLE.end.line).toUpperCase(), em(SAMPLE.end.line).toUpperCase()];
  const size = 200;
  const hillY = (x: number) => 1268 + 0.0004 * (x - 540) * (x - 540);
  const hill = poly([...Array.from({ length: 29 }, (_, i): Pt => [-20 + i * 40, hillY(-20 + i * 40)]), [W + 20, 1420], [-20, 1420]]);
  const fig = figure(540, hillY(540) + 4, 170);
  const marks = (f: Fill) =>
    ([[80, 130], [W - 80, 130], [80, 1790], [W - 80, 1790]] as Pt[]).map(([x, y], i) => (
      <g key={i} stroke={f.solid} strokeWidth={2.5} fill="none">
        <circle cx={x} cy={y} r={18} />
        <line x1={x - 32} y1={y} x2={x + 32} y2={y} />
        <line x1={x} y1={y - 32} x2={x} y2={y + 32} />
      </g>
    ));
  const cta = SAMPLE.end.cta;
  return (
    <Print seed={6}>
      <Plate ink="yellow" seed={6} at={0.3}>
        {(f) => (
          <>
            <path d={disc(540, 1125, 205)} fill={f.solid} />
            <Halo d={fig} />
            <rect {...stripRect(540, 1500, cta)} fill={f.ko} />
          </>
        )}
      </Plate>
      <Plate ink="pink" seed={6} at={0.55} kick={1.0} dir="up">
        {(f) => (
          <>
            {lines.map((l, i) => (
              <Big key={i} x={540 + DH} y={640 + i * size + DH * 0.6} size={size} fill={f.solid}>
                {l}
              </Big>
            ))}
            <path d={hill} fill={f.solid} />
            <Halo d={fig} />
            <rect {...stripRect(540, 1500, cta)} fill={f.ko} />
            {marks(f)}
          </>
        )}
      </Plate>
      <Plate ink="blue" seed={6} at={0.05}>
        {(f) => (
          <>
            {lines.map((l, i) => (
              <Big key={i} x={540} y={640 + i * size} size={size} fill={f.solid}>
                {l}
              </Big>
            ))}
            <Halo d={fig} />
            <path d={fig} fill={f.solid} />
            <rect x={-20} y={1420} width={W + 40} height={60} fill={f.tint(20)} />
            <rect {...stripRect(540, 1500, cta)} fill={f.ko} />
            <Small x={540} y={1500} fill={f.solid}>
              {cta}
            </Small>
            {marks(f)}
          </>
        )}
      </Plate>
    </Print>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.8, hero: 2.4, component: Title },
  { id: "headline", duration: 2.6, hero: 2.2, component: HeadlineSample },
  { id: "diagram", duration: 2.6, hero: 2.2, component: Diagram },
  { id: "number", duration: 2.4, hero: 2.0, component: NumberSample },
  { id: "list", duration: 2.6, hero: 2.2, component: List },
  { id: "end", duration: 2.4, hero: 2.0, component: End },
];
