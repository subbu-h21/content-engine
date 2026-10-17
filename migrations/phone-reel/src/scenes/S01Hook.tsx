import React from "react";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { useReel } from "../lib/context";
import { window } from "../lib/motion";
import { cue } from "../lib/timing";

const S = "s01_hook";

export const S01Hook: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const { s01 } = useReel().scenes;
  const a = cue(S, "bored");
  const b = cue(S, "hand");
  const w = cue(S, "who");
  return (
    <>
      <Scrim strength={0.55} to={980} alpha={window(tl, a - 0.2, w + 3.6, 0.4, 0.6)} />
      <Headline block={s01.bored} cueAt={a} tl={tl} />
      <Headline block={s01.hand} cueAt={b} tl={tl} />
      <Headline block={s01.who} cueAt={w} tl={tl} />
    </>
  );
};
