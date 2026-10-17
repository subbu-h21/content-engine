import React from "react";
import { LoopDiagram } from "../components/Diagrams";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { window } from "../lib/motion";
import { cue, sceneTitle } from "../lib/timing";
import { LOOP_NODES } from "./S04Relief";
import { halo as haloShadow } from "../lib/theme";

const S = "s05_loop";
/** Three runs around the ring, in step with the 3D signal (offsets from the "loop" cue). */
const RUNS: [number, number][] = [
  [0.1, 1.0],
  [1.4, 2.2],
  [2.6, 3.3],
];

export const S05Loop: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const { s05 } = useReel().scenes;
  const { theme, type } = useReel();
  const a = cue(S, "loop");
  const END = 6.6;
  let signal: number | null = null;
  let n = 0;
  RUNS.forEach(([r0, r1], i) => {
    if (tl >= a + r0 && tl <= a + r1) signal = (tl - (a + r0)) / (r1 - r0);
    if (tl > a + r1) n = i + 1;
  });
  const alpha = window(tl, 0, END, 0.01, 0.4);
  return (
    <>
      <Scrim strength={0.84} to={1040} alpha={window(tl, 0, END, 0.3, 0.6)} />
      <Scrim strength={0.7} to={1150} alpha={alpha} bottom />
      <Chapter n={5} title={sceneTitle[S]} tl={tl} start={0.1} />
      <Headline block={s05.loop} cueAt={a} tl={tl} />
      <LoopDiagram cx={540} cy={s05.ringY} r={s05.ringR} nodes={LOOP_NODES} signal={signal} accent={theme.ember} alpha={alpha} ringAlpha={0.5 + 0.17 * n} />
      {n > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 100,
            width: 200,
            top: s05.ringY + 25 - 28 * 0.8,
            textAlign: "center",
            fontFamily: theme.bodyFont,
            fontSize: 28,
            letterSpacing: 1,
            color: theme.bone,
            opacity: window(tl, a + RUNS[n - 1][1], END, 0.2, 0.4),
            textShadow: haloShadow(theme.ink, 0.6 * type.halo),
          }}
        >
          × {n}
        </div>
      ) : null}
    </>
  );
};
