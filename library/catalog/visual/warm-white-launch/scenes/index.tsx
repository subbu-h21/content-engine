/** Warm White Launch on the shared sample content: composer, chat, lime flood + result card, outro page, route, end card. */
import React from "react";
import { clamp, plain, SAMPLE, useSeconds, words, wrap, type Sample } from "../../kit";
import { Bubble, C, ease, Flood, Glow, Ground, logZoom, Mark, Phone, Pill, Ripple, S, Send, SERIF, W } from "./parts";

const em = (line: string) => words(line).filter((w) => w.em).map((w) => w.text).join(" ");
const nonEm = (line: string) => words(line).filter((w) => !w.em).map((w) => w.text).join(" ");

/** The glowing composer: the camera has pushed about 3× in; the question types on fixed lines (the caret never wraps). */
const Title: React.FC = () => {
  const t = useSeconds();
  const c = S.layout.composer;
  const x = (W - c.w) / 2;
  const y = 760;
  const zoom = logZoom(ease("camera", t - 0.1), 1 / S.motion.firstPush, 1);
  const text = plain(SAMPLE.title);
  const lines = wrap(text, 14);
  const shown = Math.floor(clamp((t - 0.7) * S.motion.typeRate, 0, text.length));
  // per fixed line: how many of its characters are typed; the caret sits on the line being typed (or the last one)
  const counts: number[] = [];
  let cum = 0;
  for (const l of lines) {
    counts.push(Math.max(0, Math.min(l.length, shown - cum)));
    cum += l.length + 1;
  }
  const caretLine = Math.max(0, counts.findIndex((n, i) => n < lines[i].length));
  const caretAt = counts.every((n, i) => n === lines[i].length) ? lines.length - 1 : caretLine;
  const caretOn = Math.floor(t * 2.2) % 2 === 0 || shown < text.length;
  return (
    <Ground>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${W / 2}px ${y + c.h / 2}px` }}>
        <div style={{ position: "absolute", left: 0, width: W, top: y - 90, textAlign: "center", fontSize: S.type.label, color: C.muted }}>{SAMPLE.kicker}</div>
        <Glow x={x} y={y} w={c.w} h={c.h} r={c.radius} />
        <div style={{ position: "absolute", left: x, top: y, width: c.w, height: c.h, borderRadius: c.radius, backgroundColor: C.white }}>
          <div style={{ position: "absolute", left: 48, top: 44, fontSize: S.type.typed, lineHeight: `${S.type.typed * 1.2}px`, whiteSpace: "nowrap" }}>
            {[...lines, "", ""].slice(0, 3).map((l, i) => (
              <div key={i} style={{ height: S.type.typed * 1.2 }}>
                {l.slice(0, counts[i] ?? 0)}
                {caretOn && i === caretAt ? <span style={{ display: "inline-block", width: 4, height: S.type.typed * 0.95, marginLeft: 4, verticalAlign: "-0.12em", backgroundColor: C.send }} /> : null}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 40, bottom: 40, width: 64, height: 64, borderRadius: "50%", border: `2px solid ${C.faint}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: C.muted }}>+</div>
          <div style={{ position: "absolute", right: 36, bottom: 34 }}>
            <Send />
          </div>
        </div>
      </div>
    </Ground>
  );
};

/** The chat inside the phone: the question as a lime bubble, the answer in white bubbles, the key words on lime. */
const HeadlineSample: React.FC = () => {
  const t = useSeconds();
  const sc = S.type.phoneScale;
  const { w, h, bezel } = S.layout.phone;
  const pw = (w + 2 * bezel) * sc;
  const x = (W - pw) / 2;
  const y = 280;
  const [l1, l2] = SAMPLE.headline;
  const ask = plain(SAMPLE.title);
  return (
    <Ground>
      <Glow x={x} y={y} w={pw} h={(h + 2 * bezel) * sc} r={(S.layout.phone.radius + bezel) * sc} on={0.85} />
      <Phone x={x} y={y}>
        <div style={{ position: "absolute", left: 0, width: w, top: 52, textAlign: "center", fontSize: 18, fontWeight: 600 }}>{SAMPLE.kicker}</div>
        <div style={{ position: "absolute", left: 22, right: 22, top: 84, height: 1, backgroundColor: C.faint }} />
        <Bubble text={ask} sent y={110} at={0.15} />
        <Bubble
          text={
            <>
              {plain(l1)} {nonEm(l2)} <span style={{ backgroundColor: C.lime, borderRadius: 8, padding: "0 6px" }}>{em(l2)}</span>
            </>
          }
          y={190}
          at={0.7}
          w={330}
        />
        <Bubble text={SAMPLE.body} y={300} at={1.2} w={330} />
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 26, height: 64, borderRadius: 32, backgroundColor: C.white, border: `1px solid ${C.faint}`, display: "flex", alignItems: "center", paddingLeft: 22, fontSize: 18, color: C.muted, boxSizing: "border-box" }}>
          Ask about the sky
          <div style={{ position: "absolute", right: 8 }}>
            <Send size={48} />
          </div>
        </div>
      </Phone>
      <Ripple x={x + (w - 40) * sc} y={y + 140 * sc} at={0.1} />
    </Ground>
  );
};

/** The drop: a lime flood fills the frame and carries the result card (the diagram drawn as its picture). */
const Diagram: React.FC = () => {
  const t = useSeconds();
  const k = S.layout.card;
  const cw = k.w * k.scale;
  const ch = k.h * k.scale;
  const x = (W - cw) / 2;
  const y = 500;
  const p = ease("pop", t - 0.45);
  const iw = cw - 40;
  const ih = 440;
  const rays = Array.from({ length: 12 }, (_, i) => (Math.PI * 2 * i) / 12 + 0.26);
  const [mx, my] = [iw * 0.56, ih * 0.56];
  return (
    <Ground>
      <Flood x={W / 2} y={1500} at={0.05} />
      <div style={{ position: "absolute", left: x, top: y + (1 - clamp(p, 0, 1.03)) * 140, width: cw, height: ch, borderRadius: k.radius * k.scale, backgroundColor: C.ink, opacity: clamp(p * 3), boxShadow: "0 40px 70px -40px rgba(14,14,16,0.6)" }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: iw, height: ih, borderRadius: k.radius * 1.4, overflow: "hidden", background: `linear-gradient(180deg, #1b1b20 0%, #26262c 100%)` }}>
          <svg width={iw} height={ih} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={40} y1={170} x2={mx - 62} y2={my - 22} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
            {rays.map((a, i) => {
              const q = ease("ripple", t - 0.9 - i * 0.03);
              return <line key={i} x1={mx + 70 * Math.cos(a)} y1={my + 70 * Math.sin(a)} x2={mx + (70 + 120 * q) * Math.cos(a)} y2={my + (70 + 120 * q) * Math.sin(a)} stroke={i % 3 === 0 ? C.glow[3] : C.lime} strokeWidth={7} strokeLinecap="round" opacity={q} />;
            })}
            <circle cx={mx} cy={my} r={52} fill="#ffffff" />
          </svg>
          <div style={{ position: "absolute", left: 22, top: 22 }}>
            <Pill text="Key idea" kind="lime" size={26} dot />
          </div>
          <div style={{ position: "absolute", left: 34, top: 112, fontSize: 26, color: "#ffffff", opacity: 0.85 }}>{SAMPLE.diagram.in}</div>
        </div>
        <div style={{ position: "absolute", left: 40, top: ih + 56, fontSize: 52, fontWeight: 600, color: "#ffffff" }}>{SAMPLE.diagram.object}</div>
        <div style={{ position: "absolute", left: 40, top: ih + 130, fontSize: 32, color: "#b4b4b8" }}>{SAMPLE.diagram.label}</div>
        <div style={{ position: "absolute", left: 40, right: 40, top: ih + 200, height: 1, backgroundColor: "#2a2a30" }} />
        <div style={{ position: "absolute", left: 40, top: ih + 230, fontSize: 28, color: "#b4b4b8", whiteSpace: "nowrap" }}>
          Out · <span style={{ color: "#ffffff" }}>{SAMPLE.diagram.out}</span>
        </div>
      </div>
    </Ground>
  );
};

/** The outro page: black, the number big, the caption arriving word by word in white. */
const NumberSample: React.FC = () => {
  const t = useSeconds();
  const n = SAMPLE.number;
  const lines = wrap(n.caption, 20);
  let i = 0;
  return (
    <Ground bg={C.ink}>
      <div style={{ position: "absolute", left: 0, width: W, top: 470, textAlign: "center", fontSize: S.type.number, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, color: "#ffffff", opacity: ease("word", t - 0.1), transform: `translateY(${(1 - ease("word", t - 0.1)) * 30}px)` }}>
        {n.value.toFixed(n.decimals)}
        <span style={{ color: C.lime }}>{n.unit}</span>
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: 880, textAlign: "center", fontSize: 72, fontWeight: 500, lineHeight: 1.14, color: "#ffffff", whiteSpace: "nowrap" }}>
        {lines.map((l, li) => (
          <div key={li}>
            {l.split(" ").map((w, wi) => {
              const p = ease("word", t - 0.6 - i++ * (S.motion.beat / 4));
              return (
                <span key={wi} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 24}px)`, marginRight: "0.26em" }}>
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </Ground>
  );
};

/** A route: the orange dot runs along it, each stop's card pops as it passes, and it arrives at the pin. */
const List: React.FC = () => {
  const t = useSeconds();
  const stops: [number, number][] = [
    [220, 520],
    [860, 910],
    [300, 1300],
  ];
  const ctrl: [number, number][] = [
    [860, 560],
    [820, 1280],
  ];
  const quad = (a: [number, number], c: [number, number], b: [number, number], u: number): [number, number] => [
    (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
    (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
  ];
  const pts: [number, number][] = [];
  for (let s = 0; s < 2; s++) for (let i = 0; i <= 60; i++) pts.push(quad(stops[s], ctrl[s], stops[s + 1], i / 60));
  const len: number[] = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1];
  const prog = ease("route", t - 0.4);
  const at = prog * total;
  let j = len.findIndex((l) => l >= at);
  if (j < 0) j = len.length - 1;
  const dot = pts[j];
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const passed = (k: number) => (k === 0 ? 0 : len[k * 61 - 1] / total);
  const labelAt = [
    { left: 180, top: 400 },
    { right: W - 790, top: 860 },
    { left: 370, top: 1250 },
  ];
  return (
    <Ground>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={d} fill="none" stroke={C.faint} strokeWidth={16} strokeLinecap="round" />
        <path d={d} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${at} ${total + 10}`} />
        {stops.slice(0, 2).map((s, i) => (
          <g key={i}>
            <circle cx={s[0]} cy={s[1]} r={18} fill={C.ink} />
            <circle cx={s[0]} cy={s[1]} r={7} fill="#ffffff" />
          </g>
        ))}
        <path d={`M ${stops[2][0]} ${stops[2][1] + 4} C ${stops[2][0] - 34} ${stops[2][1] - 40} ${stops[2][0] - 34} ${stops[2][1] - 84} ${stops[2][0]} ${stops[2][1] - 84} C ${stops[2][0] + 34} ${stops[2][1] - 84} ${stops[2][0] + 34} ${stops[2][1] - 40} ${stops[2][0]} ${stops[2][1] + 4} Z`} fill={C.ink} />
        <circle cx={stops[2][0]} cy={stops[2][1] - 52} r={12} fill={C.lime} />
      </svg>
      <div style={{ position: "absolute", left: dot[0] - 22, top: dot[1] - 22 - (prog >= 1 ? 52 : 0), width: 44, height: 44, borderRadius: "50%", backgroundColor: C.orange, border: "5px solid #ffffff", boxSizing: "border-box", boxShadow: "0 6px 14px rgba(14,14,16,0.25)" }} />
      {SAMPLE.list.map((item, i) => {
        const p = ease("pop", t - 0.4 - passed(i) * S.motion.recipes.route.duration);
        return (
          <div key={i} style={{ position: "absolute", ...labelAt[i], display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", borderRadius: 26, backgroundColor: C.white, border: `1px solid ${C.faint}`, boxShadow: "0 16px 30px -18px rgba(14,14,16,0.35)", fontSize: 34, whiteSpace: "nowrap", transform: `scale(${clamp(p, 0, 1.05)})`, transformOrigin: i === 1 ? "100% 50%" : "0% 50%" }}>
            <span style={{ fontSize: 26, color: C.muted }}>{String(i + 1).padStart(2, "0")}</span>
            {item}
          </div>
        );
      })}
    </Ground>
  );
};

/** The end card: the dot becomes the mark, the name in a soft serif, two pills. */
const End: React.FC = () => {
  const t = useSeconds();
  const line = SAMPLE.end.line;
  const p = ease("word", t - 0.4);
  const q = ease("pop", t - 1.0);
  return (
    <Ground>
      <Mark x={W / 2} y={700} size={56} at={0.1} />
      <div style={{ position: "absolute", left: 0, width: W, top: 790, textAlign: "center", fontFamily: SERIF, fontSize: S.type.display, fontWeight: 600, lineHeight: 1.02, letterSpacing: "-0.03em", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
        <div>{nonEm(line)}</div>
        <div style={{ fontStyle: "italic", fontWeight: 500 }}>{em(line)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: 1130, display: "flex", justifyContent: "center", gap: 20, transform: `scale(${clamp(q, 0, 1.04)})`, opacity: clamp(q * 3) }}>
        <Pill text={SAMPLE.end.cta} kind="black" size={32} />
        <Pill text={SAMPLE.topic} kind="outline" size={32} />
      </div>
    </Ground>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 3.0, hero: 2.5, component: Title },
  { id: "headline", duration: 3.0, hero: 2.6, component: HeadlineSample },
  { id: "diagram", duration: 2.8, hero: 2.4, component: Diagram },
  { id: "number", duration: 3.0, hero: 2.6, component: NumberSample },
  { id: "list", duration: 3.0, hero: 2.6, component: List },
  { id: "end", duration: 2.6, hero: 2.2, component: End },
];
