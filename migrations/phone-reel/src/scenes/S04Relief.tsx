import React from "react";
import { LoopDiagram } from "../components/Diagrams";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Body, Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { expoOut, window } from "../lib/motion";
import { cue, sceneTitle } from "../lib/timing";

const S = "s04_relief";
export const LOOP_NODES = ["Cue", "Response", "Relief"];

export const S04Relief: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const { s04 } = useReel().scenes;
  const { theme } = useReel();
  const a = cue(S, "not_joy");
  const b = cue(S, "relief");
  const p = expoOut((tl - (b + 1.2)) / 2.4);
  return (
    <>
      <Scrim strength={0.72} to={960} alpha={window(tl, 0.2, 7.7, 0.5, 0.6)} />
      <Scrim strength={0.6} to={1150} alpha={window(tl, b + 1.0, 8.2, 0.6, 0.3)} bottom />
      <Chapter n={4} title={sceneTitle[S]} tl={tl} />
      <Headline block={s04.notJoy} cueAt={a} tl={tl} />
      <Headline block={s04.relief} cueAt={b} tl={tl} />
      <Body text={s04.body.text} y={s04.body.y} size={s04.body.size} tl={tl} start={b + s04.body.offset} alpha={window(tl, b + s04.body.offset, 7.4, 0.4, 0.35)} />
      {p > 0 ? (
        <LoopDiagram cx={540} cy={s04.ringY} r={s04.ringR} nodes={LOOP_NODES} drawFrac={p} highlight={p > 0.95 ? 2 : null} accent={theme.ice} alpha={window(tl, b + 1.2, 8.3, 0.3, 0.01)} />
      ) : null}
    </>
  );
};
