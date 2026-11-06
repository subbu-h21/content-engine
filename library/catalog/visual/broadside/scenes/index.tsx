/** Broadside on the shared sample content: orange cover, dark statement, a compare panel, a dark stat, a fadelist, an orange end. */
import React from "react";
import { plain, SAMPLE, useSeconds, useUid, wrap, type Sample } from "../../kit";
import { MONO } from "./fonts";
import { C, Chrome, COL, ease, Ground, H, Label, Lead, M, Masked, onOrange, S, Stub, W, Words } from "./parts";

const T = S.type;
const E = S.elements;
const TOP = S.layout.safe.top + 14;
const n = SAMPLE.number;
/** Rayleigh scattering relative to 700 nm: (700 / wavelength)^4. */
const rel = (nm: number): number => Math.pow(700 / nm, 4);

const Title: React.FC = () => (
  <Ground fill={C.orange} from={C.ink} next={C.ink} leave={3.0}>
    <Label text="No. 01" y={TOP} at={0.2} col={C.ink} opacity={0.55} />
    <Words lines={wrap(plain(SAMPLE.title), 7)} y={316} size={T.display} at={0.3} col={C.ink} />
    <Stub y={1096} at={1.0} col={C.ink} />
    <Label text={SAMPLE.kicker} y={1124} at={1.05} col={C.ink} />
    <Lead text={SAMPLE.body} y={1190} at={1.2} col={onOrange("muted")} />
  </Ground>
);

const Headline: React.FC = () => {
  const [l1, l2] = SAMPLE.headline;
  const lines = [...wrap(l1, 8), ...wrap(l2, 12)];
  const size = T.h1;
  const lh = size * 0.92;
  const y = S.layout.safe.top + 1360 - lines.length * lh - 12;
  return (
    <Ground fill={C.ink} from={C.orange} next={C.orange} leave={3.0}>
      <Stub y={y - 70} at={0.35} />
      <Label text={SAMPLE.chapter} x={M + 96} y={y - 84} at={0.35} col={C.muted} />
      <Words lines={lines} y={y} size={size} at={0.4} em={C.orange} leading={0.92} />
    </Ground>
  );
};

const Diagram: React.FC = () => {
  const t = useSeconds();
  const uid = useUid("bs");
  const d = SAMPLE.diagram;
  const seam = S.layout.seam;
  const [mx, my] = [W / 2, seam];
  const beam = ease("mask", t - 0.75);
  const [sx, sy] = [-20, 590];
  const flood = ease("flood", t - 0.1);
  const rays = Array.from({ length: 12 }, (_, i) => (Math.PI * 2 * i) / 12 + Math.PI / 12);
  const ray = (a: number, i: number, col: string) => {
    const p = ease("ray", t - 1.15 - i * 0.02);
    if (p <= 0) return null;
    const r0 = 104;
    const r1 = r0 + 196 * p;
    return <line key={i} x1={mx + r0 * Math.cos(a)} y1={my + r0 * Math.sin(a)} x2={mx + r1 * Math.cos(a)} y2={my + r1 * Math.sin(a)} stroke={col} strokeWidth={E.ray} />;
  };
  return (
    <Ground fill={C.ink} from={C.orange} next={C.ink} leave={3.5}>
      <div style={{ position: "absolute", left: 0, top: seam + (H - seam) * (1 - flood), width: W, height: (H - seam) * flood, backgroundColor: C.orange }} />
      <Label text="How it works" y={TOP} at={0.3} />
      <Words lines={[d.in]} y={300} size={T.h2 + 24} at={0.35} />
      <Label text={`${d.object} / ${d.label}`} y={456} at={0.75} col={C.orange} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <clipPath id={`${uid}-top`}>
            <rect x={0} y={0} width={W} height={seam} />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <rect x={0} y={seam} width={W} height={H - seam} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-top)`}>{rays.map((a, i) => ray(a, i, C.orange))}</g>
        <g clipPath={`url(#${uid}-bottom)`}>{rays.map((a, i) => ray(a, i, C.ink))}</g>
        <line x1={sx} y1={sy} x2={sx + (mx - sx) * beam} y2={sy + (my - sy) * beam} stroke={C.cream} strokeWidth={E.ray + 6} />
        {t > 1.0 ? (
          <>
            <circle cx={mx - 34} cy={my} r={52} fill={C.cream} />
            <circle cx={mx + 34} cy={my} r={52} fill={C.cream} />
          </>
        ) : null}
      </svg>
      <Words lines={wrap(d.out, 14)} y={1296} size={T.h2} at={1.6} col={C.ink} leading={0.98} />
    </Ground>
  );
};

const NumberSample: React.FC = () => {
  const t = useSeconds();
  const nms = [450, 500, 550, 600, 650, 700];
  const [x0, base, maxH] = [M + 8, 1500, 410];
  const bw = 124;
  const gap = (COL - 8 - nms.length * bw) / (nms.length - 1);
  return (
    <Ground fill={C.ink} from={C.ink}>
      <Chrome label="By the numbers" n={4} at={0.1} />
      <Masked text={`${n.value.toFixed(n.decimals)}${n.unit}`} y={280} size={T.stat} at={0.2} col={C.orange} />
      <Lead text={n.caption} y={760} at={0.9} col={C.muted} size={T.body + 2} w={700} />
      <div style={{ position: "absolute", left: M, top: base - maxH - 40, width: E.hairline, height: maxH + 40, backgroundColor: C.hint }} />
      {nms.map((nm, i) => {
        const accent = i === 0;
        const p = ease("bar", t - (accent ? 1.75 : 1.15 + (nms.length - i) * 0.06));
        const h = (maxH * rel(nm) * p) / rel(nms[0]);
        const x = x0 + i * (bw + gap);
        return (
          <React.Fragment key={nm}>
            <div style={{ position: "absolute", left: x, top: base - h, width: bw, height: h, backgroundColor: accent ? C.orange : C.hint }} />
            <div style={{ position: "absolute", left: x, width: bw, top: base + 14, textAlign: "center", fontFamily: MONO, fontWeight: 500, fontSize: 26, color: accent ? C.orange : C.muted }}>{nm}</div>
            {p > 0 ? <div style={{ position: "absolute", left: x, width: bw, top: base - h - 42, textAlign: "center", fontFamily: MONO, fontWeight: 500, fontSize: 28, color: accent ? C.orange : C.muted }}>{rel(nm).toFixed(1)}</div> : null}
          </React.Fragment>
        );
      })}
    </Ground>
  );
};

const List: React.FC = () => {
  const t = useSeconds();
  const ys = [650, 950, 1250];
  const fade = E.fade;
  return (
    <Ground fill={C.ink} from={C.ink}>
      <Chrome label={SAMPLE.chapter} n={5} at={0.1} />
      <Words lines={["three", "steps"]} y={290} size={T.fadeTitle} at={0.15} col={C.orange} leading={0.88} />
      {SAMPLE.list.map((item, i) => {
        const at = 0.7 + i * 0.5;
        // each new step lands at full strength and pushes the ones before it down the fade
        const age = SAMPLE.list.length - 1 - i;
        const step1 = ease("dim", t - (at + 0.5));
        const step2 = ease("dim", t - (at + 1.0));
        const o = age === 0 ? 1 : age === 1 ? 1 + (fade[1] - 1) * step1 : 1 + (fade[1] - 1) * step1 + (fade[0] - fade[1]) * step2;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: o }}>
            <Label text="/" x={M - 4} y={ys[i] - 2} at={at} col={C.orange} size={T.fade} />
            <Words lines={wrap(item, 16)} x={M + 76} y={ys[i]} size={T.fade} at={at} leading={1.0} tracking={-0.025} />
          </div>
        );
      })}
    </Ground>
  );
};

const End: React.FC = () => {
  const lines = wrap(plain(SAMPLE.end.line), 7);
  return (
    <Ground fill={C.orange} from={C.ink}>
      <Label text="No. 06" y={TOP} at={0.3} col={C.ink} opacity={0.55} />
      <Words lines={lines} y={620} size={T.display + 16} at={0.35} col={C.ink} />
      <Stub y={1180} at={1.1} col={C.ink} />
      <Label text={SAMPLE.end.cta} y={1208} at={1.15} col={C.ink} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.3, hero: 2.6, component: Title },
  { id: "headline", duration: 3.3, hero: 2.7, component: Headline },
  { id: "diagram", duration: 3.8, hero: 3.2, component: Diagram },
  { id: "number", duration: 3.3, hero: 2.8, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.2, component: List },
  { id: "end", duration: 3.0, hero: 2.4, component: End },
];
