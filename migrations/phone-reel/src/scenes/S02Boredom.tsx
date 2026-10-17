import React from "react";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Leader } from "../components/Leader";
import { Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { window } from "../lib/motion";
import { cue, sceneTitle } from "../lib/timing";

const S = "s02_boredom";

export const S02Boredom: React.FC<{ tl: number; t: number }> = ({ tl, t }) => {
  const { s02 } = useReel().scenes;
  const { theme } = useReel();
  const a = cue(S, "empty");
  const b = cue(S, "lock");
  const d = cue(S, "search");
  return (
    <>
      <Scrim strength={0.72} to={980} alpha={window(tl, 0.2, 10.6, 0.5, 0.6)} />
      <Chapter n={2} title={sceneTitle[S]} tl={tl} />
      <Headline block={s02.empty} cueAt={a} tl={tl} />
      <Headline block={s02.lock} cueAt={b} tl={tl} />
      <Headline block={s02.search} cueAt={d} tl={tl} />
      <Leader label={s02.searchLabel} marker="search" cueAt={b} tl={tl} t={t} until={d + 3.3} accent={theme.ice} />
    </>
  );
};
