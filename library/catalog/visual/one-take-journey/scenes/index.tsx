/**
 * One-Take Journey on the shared sample content. Every sample is one framing of the same continuous take: the words
 * live inside the stations, and the hero ball is what changes them.
 */
import React from "react";
import { clamp, lerp, plain, SAMPLE, useSeconds, wrap, type Sample } from "../../kit";
import { AppIcon, arc, beat, C, Card, ease, Ground, Hero, Label, S, Slider, Slot, Stub, SW, Tooltip, W, type Motion } from "./parts";

const rest = (x: number, y: number): Motion => ({ x, y, vx: 0, vy: 0 });
const R = S.layout.hero / 2;

/** Messages: the question types in, the ball drops onto return, the message is sent. */
const Title: React.FC = () => {
  const t = useSeconds();
  const text = plain(SAMPLE.title);
  const cx = 20;
  const cy = 470;
  const land = 1.55;
  const sent = land + 0.05;
  const typed = text.slice(0, Math.floor(clamp((t - 0.2) * 25, 0, text.length)));
  const bubble = ease("react", t - sent);
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const kw = (SW - 48 - 9 * 10) / 10;
  const kh = 84;
  const ky = 600;
  const ret = { x: SW - 24 - 200, y: ky + 3 * (kh + 14), w: 200, h: kh };
  const target: [number, number] = [cx + ret.x + ret.w - 44, cy + ret.y + ret.h / 2];
  const m = t < 1.0 ? rest(380, -60) : arc(t, [380, -60], target, 1.0, land);
  return (
    <Ground cam={[0, 0]}>
      <Stub x={560} y={-140} w={480} h={230} kind="toggle" />
      <Label name="Messages" state={t >= sent ? "Sent" : SAMPLE.kicker} x={cx + 12} y={cy - 24} />
      <Card x={cx} y={cy} h={ret.y + kh + 30}>
        {bubble > 0 ? (
          <div style={{ position: "absolute", right: 30, top: lerp(470, 140, clamp(bubble, 0, 1.02)), opacity: clamp(bubble * 3) }}>
            <div style={{ padding: "22px 32px", borderRadius: 40, backgroundColor: C.accent, color: "#ffffff", fontSize: S.type.message, whiteSpace: "nowrap" }}>{text}</div>
            <div style={{ textAlign: "right", marginTop: 12, fontSize: S.type.small, color: C.muted }}>Delivered</div>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 24, right: 24, top: 450, height: 100, borderRadius: 50, backgroundColor: C.surface2, display: "flex", alignItems: "center", paddingLeft: 36 }}>
          <span style={{ fontSize: S.type.body, color: t >= sent ? C.muted : C.text, whiteSpace: "nowrap" }}>{t >= sent ? "Message" : typed}</span>
          {t < sent ? <span style={{ width: 3, height: 46, marginLeft: 4, backgroundColor: C.accent }} /> : null}
        </div>
        {rows.map((row, r) => {
          const n = row.length;
          const x0 = (SW - (n * kw + (n - 1) * 10)) / 2;
          return row.split("").map((k, i) => (
            <div key={`${r}${i}`} style={{ position: "absolute", left: x0 + i * (kw + 10), top: ky + r * (kh + 14), width: kw, height: kh, borderRadius: 12, backgroundColor: C.surface2, color: C.text, fontSize: S.type.label, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {k}
            </div>
          ));
        })}
        <div style={{ position: "absolute", left: 24, top: ret.y, width: SW - 48 - ret.w - 14, height: kh, borderRadius: 12, backgroundColor: C.surface2, color: C.muted, fontSize: S.type.small, display: "flex", alignItems: "center", justifyContent: "center" }}>space</div>
        <div style={{ position: "absolute", left: ret.x, top: ret.y + (t >= land && t < land + 0.15 ? 5 : 0), width: ret.w, height: kh, borderRadius: 12, backgroundColor: C.accent, color: "#ffffff", fontSize: S.type.label, fontWeight: 500, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box" }}>
          return
        </div>
      </Card>
      <Hero m={m} impact={t >= land ? land : undefined} />
    </Ground>
  );
};

/** Notifications form a staircase; the hero hops from one to the next, smearing in flight. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const A = { x: 40, y: 420, w: 660, h: 300 };
  const B = { x: 260, y: 960, w: 780, h: 330 };
  const leave = 1.55;
  const land = leave + beat(1.4);
  const a: [number, number] = [600, A.y - R];
  const b: [number, number] = [790, B.y - R];
  const m = t < leave ? rest(...a) : arc(t, a, b, leave, land);
  const appear = (at: number) => ease("react", t - at);
  const note = (box: typeof A, title: string, body: string[], at: number, hit?: number) => {
    const p = appear(at);
    return (
      <div style={{ opacity: clamp(p * 2), transform: `translateY(${(1 - clamp(p, 0, 1.05)) * 40}px)` }}>
        <Card x={box.x} y={box.y} w={box.w} h={box.h} hit={hit}>
          <div style={{ position: "absolute", left: 32, top: 34 }}>
            <AppIcon size={68} />
          </div>
          <div style={{ position: "absolute", left: 124, top: 36, fontSize: S.type.title, fontWeight: 600, color: C.text }}>{title}</div>
          <div style={{ position: "absolute", right: 32, top: 42, fontSize: S.type.small, color: C.muted }}>now</div>
          <div style={{ position: "absolute", left: 124, top: 90, right: 32, fontSize: S.type.body, lineHeight: S.type.leading, color: C.text }}>
            {body.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  };
  return (
    <Ground cam={[0, 300]}>
      <Label name="Notifications" state="2 new" x={A.x + 12} y={A.y - 24} />
      {note(A, SAMPLE.kicker, SAMPLE.headline.map(plain), 0.1)}
      {note(B, SAMPLE.chapter, wrap(SAMPLE.body, 30), 0.7, land)}
      <Stub x={-160} y={1500} w={620} h={200} kind="track" />
      <Hero m={m} impact={t >= land ? land : undefined} />
    </Ground>
  );
};

/** The hero lands on the molecule; the station answers with blue in every direction. */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const card = { x: 100, y: 500, h: 900 };
  const [mx, my] = [540, 1000];
  const land = 1.4;
  const start: [number, number] = [230, 640];
  const target: [number, number] = [mx, my - 50 - R];
  const m = t < 0.7 ? rest(...start) : arc(t, start, target, 0.7, land);
  const k = t - land;
  const rays = Array.from({ length: 12 }, (_, i) => (Math.PI * 2 * i) / 12 + Math.PI / 12);
  return (
    <Ground cam={[200, 900]}>
      <Stub x={700} y={-120} w={420} h={260} kind="rows" />
      <Label name={SAMPLE.diagram.object} state={k > 0 ? SAMPLE.diagram.label : "Waiting"} x={card.x + 12} y={card.y - 24} />
      <Card x={card.x} y={card.y} h={card.h} />
      <div style={{ position: "absolute", left: start[0] - 70, top: start[1] + 44, padding: "10px 20px", borderRadius: 999, backgroundColor: C.surface2, color: C.text, fontSize: S.type.small }}>
        {SAMPLE.diagram.in}
      </div>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {k > 0
          ? rays.map((a, i) => {
              const p = clamp(ease("react", k - i * 0.015), 0, 1.05);
              return <line key={i} x1={mx + 78 * Math.cos(a)} y1={my + 78 * Math.sin(a)} x2={mx + (78 + 150 * p) * Math.cos(a)} y2={my + (78 + 150 * p) * Math.sin(a)} stroke={C.accent} strokeWidth={8} strokeLinecap="round" />;
            })
          : null}
        {k > 0 ? <circle cx={mx} cy={my} r={50 + 230 * clamp(k / 0.7)} fill="none" stroke={C.accent} strokeWidth={4} opacity={0.6 * (1 - clamp(k / 0.7))} /> : null}
        <circle cx={mx} cy={my + (k > 0 && k < 0.2 ? 6 : 0)} r={50} fill={C.surface2} />
      </svg>
      <div style={{ position: "absolute", left: card.x + 48, top: card.y + card.h - 110, fontSize: S.type.label, color: C.muted, opacity: clamp((k - 0.3) / 0.2) }}>
        Out · <span style={{ color: C.text }}>{SAMPLE.diagram.out}</span>
      </div>
      <Hero m={m} impact={t >= land ? land : undefined} />
    </Ground>
  );
};

/** Sliders: the hero rolls the blue one to its value; the station's numbers follow the hero. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const card = { x: 100, y: 470, h: 900 };
  const tx = card.x + 60;
  const tw = SW - 120;
  const scale = 10;
  const roll = ease("roll", (t - 0.8) * (S.motion.recipes.roll.duration / 1.1));
  const v = lerp(0, n.value, roll);
  const y1 = card.y + 600;
  const y2 = card.y + 780;
  const hx = tx + tw * (v / scale);
  return (
    <Ground cam={[400, 1600]}>
      <Label name="Scattering" state="Blue vs red" x={card.x + 12} y={card.y - 24} />
      <Card x={card.x} y={card.y} h={card.h}>
        <div style={{ position: "absolute", left: 56, top: 40, fontSize: S.type.display, fontWeight: 600, letterSpacing: "-0.03em", color: C.text }}>
          {v.toFixed(n.decimals)}
          {n.unit}
        </div>
        <div style={{ position: "absolute", left: 60, top: 230, width: SW - 120, fontSize: S.type.label, lineHeight: 1.35, color: C.muted }}>{n.caption}</div>
        <div style={{ position: "absolute", left: 60, top: 600 - 150, fontSize: S.type.label, color: C.text, fontWeight: 500 }}>Blue · 450 nm</div>
        <div style={{ position: "absolute", left: 60, top: 780 - 150, fontSize: S.type.label, color: C.text, fontWeight: 500 }}>Red · 700 nm</div>
      </Card>
      <Slider x={tx} y={y1} w={tw} frac={v / scale} ticks={scale} />
      <Slider x={tx} y={y2} w={tw} frac={1 / scale} ticks={scale} />
      <div style={{ position: "absolute", left: tx + tw / scale - 22, top: y2 - 22, width: 44, height: 44, borderRadius: "50%", backgroundColor: C.muted }} />
      <Tooltip x={tx + tw / scale} y={y2 - 36} text="1×" />
      <Tooltip x={hx} y={y1 - 44} text={`${v.toFixed(n.decimals)}${n.unit}`} op={clamp((t - 0.8) / 0.2)} />
      <Hero m={rest(hx, y1)} />
    </Ground>
  );
};

/** Settings-style rows: the hero lands in each toggle and flicks it on, leaving its empty slot behind; it settles in the last. */
const List: React.FC = () => {
  const t = useSeconds();
  const card = { x: 140, y: 600, w: 880, h: 600 };
  const rowY = (i: number) => card.y + 120 + i * 180;
  const tx = card.x + 60;
  const tw = 116;
  const th = 68;
  const knob = (i: number, on: boolean): [number, number] => [tx + (on ? tw - th / 2 : th / 2), rowY(i)];
  const lands = [0.5, 0.5 + beat(2), 0.5 + beat(4)];
  const hopAt = (i: number) => (i < 2 ? lands[i + 1] - beat(0.7) : Infinity);
  const from: [number, number] = [tx - 200, card.y - 320];
  const last = lands.filter((l) => t >= l).length - 1;
  const slide = (i: number) => ease("roll", t - lands[i]);
  let m: Motion = rest(...from);
  if (last < 0) m = t >= 0.2 ? arc(t, from, knob(0, false), 0.2, lands[0]) : m;
  else {
    const flick = slide(last);
    const [x0, y0] = knob(last, false);
    const [x1] = knob(last, true);
    m = t < hopAt(last) ? rest(lerp(x0, x1, flick), y0) : arc(t, knob(last, true), knob(last + 1, false), hopAt(last), lands[last + 1]);
  }
  const done = SAMPLE.list.filter((_, i) => t >= lands[i] + 0.2).length;
  return (
    <Ground cam={[900, 2400]}>
      <Stub x={-300} y={300} w={420} h={220} kind="track" />
      <Stub x={560} y={1560} w={620} h={240} kind="rows" />
      <Label name="Steps" state={`${done} of ${SAMPLE.list.length}`} x={card.x + 12} y={card.y - 24} />
      <Card x={card.x} y={card.y} w={card.w} h={card.h} />
      {SAMPLE.list.map((item, i) => {
        const on = clamp(slide(i));
        const visited = t >= lands[i];
        const left = t >= hopAt(i);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: tx, top: rowY(i) - th / 2, width: tw, height: th, borderRadius: th / 2, backgroundColor: visited ? (on > 0.5 ? C.accent : C.surface2) : C.surface2 }} />
            {left ? <Slot x={knob(i, true)[0]} y={rowY(i)} size={th - 12} /> : null}
            {!visited ? <div style={{ position: "absolute", left: tx + 6, top: rowY(i) - th / 2 + 6, width: th - 12, height: th - 12, borderRadius: "50%", backgroundColor: C.muted, opacity: 0.6 }} /> : null}
            <div style={{ position: "absolute", left: tx + tw + 36, top: rowY(i) - 26, fontSize: S.type.body - 2, color: visited ? C.text : C.muted, whiteSpace: "nowrap" }}>{item}</div>
            {i < 2 ? <div style={{ position: "absolute", left: tx + tw + 36, right: W - card.x - card.w + 40, top: rowY(i) + 90, height: 1, backgroundColor: C.surface2 }} /> : null}
          </React.Fragment>
        );
      })}
      <Hero m={m} size={th - 12} impact={last >= 0 && t < lands[last] + 0.3 ? lands[last] : undefined} />
    </Ground>
  );
};

/** The payoff: the hero presses the button; a toast confirms. */
const End: React.FC = () => {
  const t = useSeconds();
  const btn = { x: 190, y: 1040, w: 700, h: 150 };
  const land = 1.1;
  const target: [number, number] = [W / 2, btn.y - R];
  const m = t < 0.5 ? rest(220, 520) : arc(t, [220, 520], target, 0.5, land);
  const toast = ease("toast", t - land - 0.25);
  const pressed = t >= land && t < land + 0.12;
  return (
    <Ground cam={[1400, 3200]}>
      <Stub x={-260} y={1560} w={520} h={200} kind="rows" />
      <div style={{ opacity: clamp(toast * 2), transform: `translateY(${(1 - clamp(toast, 0, 1.05)) * -60}px)` }}>
        <Card x={100} y={420} h={170}>
          <div style={{ position: "absolute", left: 32, top: 34 }}>
            <AppIcon size={68} />
          </div>
          <div style={{ position: "absolute", left: 124, top: 36, fontSize: S.type.title, fontWeight: 600, color: C.text }}>{SAMPLE.end.cta}</div>
          <div style={{ position: "absolute", right: 32, top: 42, fontSize: S.type.small, color: C.muted }}>now</div>
          <div style={{ position: "absolute", left: 124, top: 92, fontSize: S.type.label, color: C.muted }}>{SAMPLE.topic}</div>
        </Card>
      </div>
      <Label name="Share" state={t >= land ? "Done" : "Ready"} x={btn.x + 12} y={btn.y - 70} />
      <div
        style={{
          position: "absolute",
          left: btn.x,
          top: btn.y + (pressed ? 6 : 0),
          width: btn.w,
          height: btn.h,
          borderRadius: btn.h / 2,
          backgroundColor: C.accent,
          color: "#ffffff",
          fontSize: S.type.message,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pressed ? 0.98 : 1})`,
        }}
      >
        {plain(SAMPLE.end.line)}
      </div>
      <Hero m={m} impact={t >= land ? land : undefined} />
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.6, component: Title },
  { id: "headline", duration: 2.8, hero: 2.09, component: HeadlineSample },
  { id: "diagram", duration: 2.6, hero: 2.0, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.5, component: NumberSample },
  { id: "list", duration: 3.6, hero: 3.3, component: List },
  { id: "end", duration: 2.8, hero: 2.3, component: End },
];
