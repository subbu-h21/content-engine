import React from "react";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Leader } from "../components/Leader";
import { Body, Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { window } from "../lib/motion";
import { cue, sceneTitle } from "../lib/timing";

const S = "s03_cue";

export const S03Cue: React.FC<{ tl: number; t: number }> = ({ tl, t }) => {
  const { s03 } = useReel().scenes;
  const { theme } = useReel();
  const a = cue(S, "shortcut");
  const b = cue(S, "cue");
  const d = cue(S, "response");
  const END = 7.9;
  return (
    <>
      <Scrim strength={0.72} to={960} alpha={window(tl, 0.2, END, 0.5, 0.6)} />
      <Chapter n={3} title={sceneTitle[S]} tl={tl} />
      <Headline block={s03.shortcut} cueAt={a} tl={tl} />
      <Leader label={s03.cueLabel} marker="cue" cueAt={b} tl={tl} t={t} until={END} accent={theme.ember} />
      <Leader label={s03.responseLabel} marker="resp" cueAt={d} tl={tl} t={t} until={END} accent={theme.ember} />
      <Body text={s03.body.text} y={s03.body.y} size={s03.body.size} tl={tl} start={d + s03.body.offset} alpha={window(tl, d + s03.body.offset, END, 0.4, 0.4)} />
    </>
  );
};
