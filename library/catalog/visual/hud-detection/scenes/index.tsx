/** HUD Detection on the shared sample content: flash card, title words, glowing core, counter, stacked verbs, indigo serif. */
import React from "react";
import { clamp, fit, plain, SAMPLE, useSeconds, words, type Sample } from "../../kit";
import { bloom, Bracketed, C, Caption, COLUMN, ease, Mono, S, Scene, Slam, Tag, W, type CapWord, type HudInfo } from "./parts";
import { DISPLAY, MONO, SERIF } from "./fonts";

const T = S.type;
const CH = T.displayCharEm;

/** A caption line as timed words; *stars* mark the keyword. Times in seconds from the sample's start. */
const cap = (line: string, start: number, step: number): CapWord[] => words(line).map((w, i) => ({ text: w.text, at: start + i * step, key: w.em }));

// where each sample sits in an imagined 19-second video, and what is said there (the HUD reads both)
const PARTS = {
  title: { clock: 0, cap: cap(SAMPLE.title, 0.15, 0.16) },
  headline: { clock: 3.0, cap: cap(SAMPLE.headline[1], 0.9, 0.18) },
  diagram: { clock: 6.2, cap: cap("air molecules scatter *blue light*", 0.4, 0.2) },
  number: { clock: 9.6, cap: cap("more scattering for *blue* than red", 0.5, 0.16) },
  list: { clock: 12.8, cap: cap("blue *reaches* you from all sides", 1.2, 0.16) },
  end: { clock: 16.4, cap: cap(SAMPLE.end.line, 0.2, 0.2) },
};
const TOTAL = 19;
const TRANSCRIPT: CapWord[] = Object.values(PARTS).flatMap((p) => p.cap.map((w) => ({ ...w, at: w.at + p.clock })));
const TICKS = TRANSCRIPT.filter((w) => w.key).map((w) => w.at);
const info = (part: keyof typeof PARTS, chapter: string, chapterSub: string): HudInfo => ({ clock: PARTS[part].clock, total: TOTAL, ticks: TICKS, chapter, chapterSub, transcript: TRANSCRIPT });
const keyAt = (part: keyof typeof PARTS) => PARTS[part].cap.find((w) => w.key)!.at;
const stamp = (part: keyof typeof PARTS) => `${(PARTS[part].clock + keyAt(part)).toFixed(2).padStart(5, "0")}s`;

const Title: React.FC = () => {
  // 01 flash card: one giant word on orange rings
  const key = plain(words(SAMPLE.title).filter((w) => w.em).map((w) => w.text).join(" ")).toUpperCase();
  const size = fit([key], COLUMN * 0.94, T.flash, CH);
  return (
    <Scene tone="orange" info={info("title", "01 / HOOK", "FLASH CARD")} length={2.6}>
      <Slam text={key} size={size} y={800} at={keyAt("title")} col={C.choc} />
      <Caption words={PARTS.title.cap} clock={PARTS.title.clock} tone="orange" />
    </Scene>
  );
};

const HeadlineSample: React.FC = () => {
  // the title words slam in one per spoken word; the keyword locks on in orange
  const ws = SAMPLE.headline.flatMap((l) => words(l));
  const plainWords = ws.filter((w) => !w.em).map((w) => w.text.toUpperCase());
  const key = ws.filter((w) => w.em).map((w) => w.text.toUpperCase()).join(" ");
  const size = fit([...plainWords, key], COLUMN * 0.98, T.display, CH);
  const lh = size * 1.02;
  const y0 = 470;
  return (
    <Scene info={info("headline", "02 / SCIENCE", "ONE IDEA")} length={2.8}>
      {plainWords.map((w, i) => (
        <Slam key={i} text={w} size={size} y={y0 + i * lh} at={0.1 + i * 0.2} />
      ))}
      <Slam text={key} size={size} y={y0 + plainWords.length * lh + 30} at={keyAt("headline")} col={C.accent} style={{ filter: bloom(C.accent, 0.6) }}>
        <Bracketed at={keyAt("headline")} pad={22} arm={30} weight={4}>
          {key}
        </Bracketed>
      </Slam>
      <Tag text={`KEYWORD · ${stamp("headline")}`} x={W - 120} y={y0 + plainWords.length * lh + 30 + size * 0.75} at={keyAt("headline") + 0.1} align="right" />
      <Caption words={PARTS.headline.cap} clock={PARTS.headline.clock} />
    </Scene>
  );
};

const Core: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const t = useSeconds();
  const p = ease("count", t - 0.2);
  const spin = (S.motion.recipes.spin.degPerSecond * t * Math.PI) / 180;
  const lats = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
  const lons = Array.from({ length: 6 }, (_, i) => (i * Math.PI) / 6 + spin);
  const ab = S.finish.aberration;
  const orbit = (rot: number, dx: number, col: string, op: number, k: number) => (
    <ellipse key={k} cx={cx + dx} cy={cy} rx={r * 1.65} ry={r * 0.5} transform={`rotate(${rot} ${cx} ${cy})`} fill="none" stroke={col} strokeWidth={2} opacity={op * p} />
  );
  return (
    <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="hud-core">
          <stop offset="0" stopColor="#fff4e6" />
          <stop offset="0.35" stopColor={C.accent} />
          <stop offset="0.8" stopColor={C.accent} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.accent} stopOpacity={0.15} />
        </radialGradient>
      </defs>
      <g style={{ filter: bloom(C.accent, 1.4) }} opacity={p}>
        <circle cx={cx} cy={cy} r={r * p} fill="url(#hud-core)" />
        {lats.map((l, i) => (
          <ellipse key={`a${i}`} cx={cx} cy={cy + l * r} rx={r * Math.sqrt(1 - l * l) * p} ry={r * 0.16 * Math.sqrt(1 - l * l)} fill="none" stroke="#ffd2b8" strokeWidth={2} opacity={0.7} />
        ))}
        {lons.map((a, i) => (
          <ellipse key={`o${i}`} cx={cx} cy={cy} rx={Math.abs(Math.sin(a)) * r * p} ry={r * p} fill="none" stroke="#ffd2b8" strokeWidth={2} opacity={0.6} />
        ))}
      </g>
      {[orbit(-18, -ab, C.red, 0.55, 0), orbit(-18, ab, "#6aa8ff", 0.45, 1), orbit(-18, 0, C.text, 0.8, 2), orbit(24, -ab, C.red, 0.5, 3), orbit(24, ab, "#6aa8ff", 0.4, 4), orbit(24, 0, C.text, 0.6, 5)]}
    </svg>
  );
};

const Diagram: React.FC = () => {
  // 04 glowing core: the air molecule, a circular text ring in a thin red circle, lock-on brackets and a tag
  const t = useSeconds();
  const [cx, cy, r] = [540, 790, 170];
  const ringR = 345;
  const ringText = `${SAMPLE.diagram.in} in  ·  ${SAMPLE.diagram.label}  ·  ${SAMPLE.diagram.out}  ·  `.toUpperCase();
  const q = ease("draw", t - 0.1);
  const lock = 1.0;
  return (
    <Scene info={info("diagram", "03 / DETECT", "KEYWORD")} length={3.2}>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <path id="hud-ring" d={`M ${cx} ${cy - ringR} A ${ringR} ${ringR} 0 1 1 ${cx - 0.01} ${cy - ringR}`} />
        </defs>
        <circle cx={cx} cy={cy} r={ringR + 34} fill="none" stroke={C.red} strokeWidth={2} strokeDasharray={`${2 * Math.PI * (ringR + 34) * q} 9999`} transform={`rotate(-90 ${cx} ${cy})`} />
        <g transform={`rotate(${S.motion.recipes.spin.degPerSecond * t * 0.5} ${cx} ${cy})`} opacity={q}>
          <text fontFamily={MONO} fontWeight={500} fontSize={T.readout} fill={C.text} opacity={0.75}>
            <textPath href="#hud-ring" textLength={2 * Math.PI * ringR - 20} lengthAdjust="spacing">
              {ringText + ringText}
            </textPath>
          </text>
        </g>
      </svg>
      <Core cx={cx} cy={cy} r={r} />
      <div style={{ position: "absolute", left: cx - 250, top: cy - 250, width: 500, height: 500, display: "flex", alignItems: "stretch" }}>
        <Bracketed at={lock} pad={0} arm={44} weight={4}>
          <div style={{ width: 500, height: 500 }} />
        </Bracketed>
      </div>
      <Tag text={`${SAMPLE.diagram.object.toUpperCase()} · ${(PARTS.diagram.clock + lock).toFixed(2).padStart(5, "0")}s`} x={cx - 250 + 14} y={cy - 250 + 14} at={lock + 0.1} />
      <Caption words={PARTS.diagram.cap} clock={PARTS.diagram.clock} />
    </Scene>
  );
};

const NumberSample: React.FC = () => {
  // 08 counter: a thin orange ring draws while the number counts up
  const t = useSeconds();
  const n = SAMPLE.number;
  const [cx, cy, r] = [540, 790, 300];
  const p = ease("count", t - 0.2);
  const ticks = Array.from({ length: 60 }, (_, i) => (i / 60) * Math.PI * 2 - Math.PI / 2);
  return (
    <Scene info={info("number", "04 / COUNT", "BUILD-UP")} length={3}>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {ticks.map((a, i) => {
          const long = i % 5 === 0;
          const r0 = r + 28;
          const r1 = r + (long ? 52 : 40);
          return <line key={i} x1={cx + r0 * Math.cos(a)} y1={cy + r0 * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={i / 60 <= p ? C.accent : C.faint} strokeWidth={long ? 3 : 2} />;
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.faint} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray={`${2 * Math.PI * r * p} 9999`} transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: bloom(C.accent, 0.7) }} />
      </svg>
      <Mono text="SCATTERING" x={cx} y={cy - 150} at={0.1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - T.number * 0.55, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: T.number, lineHeight: 1, color: C.text }}>
        {(n.value * p).toFixed(n.decimals)}
        <span style={{ color: C.accent }}>{n.unit}</span>
      </div>
      <Mono text="BLUE 450 NM  ·  RED 700 NM" x={cx} y={cy + 125} at={0.6} col={C.text} />
      <Caption words={PARTS.number.cap} clock={PARTS.number.clock} />
    </Scene>
  );
};

const Check: React.FC<{ col: string }> = ({ col }) => (
  <svg width={22} height={18} viewBox="0 0 22 18" style={{ display: "block" }}>
    <path d="M 2 9 L 8 15 L 20 3" fill="none" stroke={col} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const List: React.FC = () => {
  // 07 stacked verbs on salmon: one dimensional verb per step, each with its code pill; the middle one locks on
  const t = useSeconds();
  const verbs = SAMPLE.list.map((l) => words(l)[1].text.toUpperCase());
  const ids = SAMPLE.list.map((l) => words(l).map((w) => w.text.toLowerCase().replace(/[^a-z]/g, "")).filter((w) => w.length > 2).slice(0, 2).join("_"));
  const size = fit(verbs, COLUMN, T.display, CH);
  const ys = [520, 790, 1060];
  const stripes = `linear-gradient(112deg, ${C.verb} 0 34%, ${C.text} 34% 34.6%, ${C.verb} 34.6% 58%, ${C.accent} 58% 59%, ${C.verb} 59% 77%, ${C.text} 77% 77.5%, ${C.verb} 77.5%)`;
  return (
    <Scene tone="salmon" info={info("list", "05 / STEPS", "PLACE")} length={3.4}>
      {verbs.map((v, i) => {
        const at = 0.1 + i * 0.35;
        const pill = ease("stamp", t - at - 0.2);
        const word = (
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "absolute", left: 0, top: 0, color: "#2b2424", textShadow: [1, 2, 3, 4, 5, 6, 7, 8].map((d) => `${d}px ${d}px 0 #2b2424`).join(", ") }}>{v}</span>
            <span style={{ position: "relative", backgroundImage: stripes, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{v}</span>
          </span>
        );
        return (
          <React.Fragment key={i}>
            <Slam text={v} size={size} y={ys[i]} at={at}>
              {i === 1 ? (
                <Bracketed at={at + 0.25} pad={18} arm={30} weight={4}>
                  {word}
                </Bracketed>
              ) : (
                word
              )}
            </Slam>
            {pill > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: W / 2,
                  top: ys[i] + size * 0.62,
                  transform: `translateX(-50%) scale(${S.motion.recipes.stamp.scale + (1 - S.motion.recipes.stamp.scale) * pill})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 20px",
                  borderRadius: 999,
                  backgroundColor: C.surface,
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: T.readout + 2,
                  color: C.text,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.accent }} />
                {ids[i]}
                <span style={{ color: C.accent }}>{`${i + 1} / ${verbs.length}`}</span>
                <Check col={C.accent} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Tag text={`KEYWORD · ${(PARTS.list.clock + 0.1 + 0.35 + 0.25).toFixed(2)}s`} x={110} y={ys[1] - size * 0.5 - 56} at={0.8} />
      <Caption words={PARTS.list.cap} clock={PARTS.list.clock} tone="salmon" />
    </Scene>
  );
};

const End: React.FC = () => {
  // 13 indigo serif: the quiet line in italic Instrument Serif, a small radar sweep
  const t = useSeconds();
  const ws = words(SAMPLE.end.line);
  const lead = ws.filter((w) => !w.em).map((w) => w.text).join(" ");
  const em = ws.filter((w) => w.em).map((w) => w.text).join(" ");
  const p1 = ease("word", t - 0.2);
  const p2 = ease("word", t - keyAt("end"));
  const [rx, ry, rr] = [540, 1060, 110];
  const sweep = (t * 160) % 360;
  const dots = [
    [rx + 50, ry - 38],
    [rx - 64, ry + 30],
  ];
  return (
    <Scene tone="indigo" info={info("end", "06 / END", "SIGN-OFF")} length={2.8}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: T.serif * 0.8, lineHeight: 1, color: C.text, opacity: p1, transform: `translateY(${(1 - p1) * 8}px)` }}>
        {lead}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: T.serif * 1.25, lineHeight: 1, color: C.accent, opacity: p2, filter: bloom(C.accent, 0.4) }}>
        {em}
      </div>
      <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: clamp((t - 0.6) / 0.3) }}>
        <defs>
          <linearGradient id="hud-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={C.accent} stopOpacity={0} />
            <stop offset="1" stopColor={C.accent} stopOpacity={0.55} />
          </linearGradient>
        </defs>
        {[1, 0.66, 0.33].map((k, i) => (
          <circle key={i} cx={rx} cy={ry} r={rr * k} fill="none" stroke={C.red} strokeOpacity={0.6} strokeWidth={1.5} />
        ))}
        <line x1={rx - rr} y1={ry} x2={rx + rr} y2={ry} stroke={C.red} strokeOpacity={0.4} />
        <line x1={rx} y1={ry - rr} x2={rx} y2={ry + rr} stroke={C.red} strokeOpacity={0.4} />
        <path d={`M ${rx} ${ry} L ${rx + rr} ${ry} A ${rr} ${rr} 0 0 0 ${rx + rr * Math.cos(-0.7)} ${ry + rr * Math.sin(-0.7)} Z`} fill="url(#hud-sweep)" transform={`rotate(${sweep} ${rx} ${ry})`} />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill={C.accent} style={{ filter: bloom(C.accent, 0.4) }} />
        ))}
      </svg>
      <Mono text={`SIGNALS FOUND · ${String(dots.length).padStart(2, "0")}`} x={rx} y={ry + rr + 34} at={0.8} col={C.text} />
      <Caption words={PARTS.end.cap} clock={PARTS.end.clock} tone="indigo" />
    </Scene>
  );
};

export const samples: Sample[] = [
  { id: "title", duration: 2.6, hero: 2.0, component: Title },
  { id: "headline", duration: 2.8, hero: 2.3, component: HeadlineSample },
  { id: "diagram", duration: 3.2, hero: 2.6, component: Diagram },
  { id: "number", duration: 3, hero: 2.4, component: NumberSample },
  { id: "list", duration: 3.4, hero: 2.8, component: List },
  { id: "end", duration: 2.8, hero: 2.2, component: End },
];
