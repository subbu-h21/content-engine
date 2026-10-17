import React from "react";
import { AbsoluteFill } from "remotion";
import { Countdown, LoopDiagram } from "../components/Diagrams";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Chapter, Eyebrow } from "../components/Text";
import { useReel } from "../lib/context";
import { expoOut, window } from "../lib/motion";
import { rgba } from "../lib/theme";
import { cue, sceneTitle } from "../lib/timing";
import { LOOP_NODES } from "./S04Relief";

const S = "s07_insight";

export const S07Insight: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const { s07 } = useReel().scenes;
  const { theme } = useReel();
  const a = cue(S, "sign");
  const b = cue(S, "notice");
  const d = cue(S, "end");
  const endCard = d + 3.4;
  const pr = expoOut((tl - (b + 1.3)) / 3.0);
  const alr = window(tl, b + 1.3, d - 0.2, 0.3, 0.3);
  const p = expoOut((tl - (d - 0.1)) / 1.2);
  const ec = expoOut((tl - endCard) / 0.8);
  const hair = expoOut((tl - (endCard + 0.2)) / 0.7);
  return (
    <>
      <Scrim strength={0.72} to={960} alpha={window(tl, 0.2, endCard, 0.5, 0.8)} />
      <Chapter n={7} title={sceneTitle[S]} tl={tl} alpha={window(tl, 0.3, endCard, 0.4, 0.6)} />
      <Headline block={s07.sign} cueAt={a} tl={tl} />
      <Headline block={s07.notice} cueAt={b} tl={tl} />
      {pr > 0 ? <Countdown cx={540} cy={s07.countdownY} r={110} frac={pr} alpha={alr} /> : null}
      {p > 0 ? (
        <>
          <LoopDiagram cx={540} cy={s07.ringY} r={s07.ringR} nodes={LOOP_NODES} drawFrac={p} cut={0} accent={theme.ember} alpha={window(tl, d - 0.1, endCard, 0.3, 0.6)} ringAlpha={0.7} labelSize={30} />
          <Headline block={s07.end} cueAt={d} tl={tl} />
        </>
      ) : null}
      {ec > 0 ? (
        <>
          <AbsoluteFill style={{ backgroundColor: rgba(theme.ink, 0.85 * ec) }} />
          <div style={{ position: "absolute", left: 540 - 140 * hair, top: 930, width: 280 * hair, height: 1, backgroundColor: theme.bone, opacity: 0.3 }} />
          <Headline
            block={{ lines: s07.title, size: 92, x: 540, y: 860, align: "center", offset: 0, holdUntil: 0 }}
            cueAt={endCard + 0.1}
            tl={tl}
          />
          <Eyebrow text={s07.tagline} x={540} y={1010} tl={tl} start={endCard + 0.6} size={26} align="center" />
          <Eyebrow text={s07.series} x={540} y={1062} tl={tl} start={endCard + 0.8} size={24} align="center" color={theme.dim} />
        </>
      ) : null}
    </>
  );
};
