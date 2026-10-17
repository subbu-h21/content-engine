import React from "react";
import { Gauge } from "../components/Diagrams";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Leader } from "../components/Leader";
import { Body, Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { clamp, smooth, window } from "../lib/motion";
import { MARGIN } from "../lib/theme";
import { cue, sceneTitle } from "../lib/timing";

const S = "s06_wanting";

export const S06Wanting: React.FC<{ tl: number; t: number }> = ({ tl, t }) => {
  const { s06 } = useReel().scenes;
  const { theme } = useReel();
  const a = cue(S, "scroll");
  const b = cue(S, "circuits");
  const END = 9.3;
  const e = smooth(clamp((tl - (b + 1.6)) / 4.2));
  const al = window(tl, b + 1.4, 9.4, 0.4, 0.4);
  const y = s06.gaugesY;
  return (
    <>
      <Scrim strength={0.84} to={1020} alpha={window(tl, 0.2, 9.4, 0.5, 0.6)} />
      <Scrim strength={0.78} to={1250} alpha={window(tl, b + 1.0, 9.5, 0.6, 0.3)} bottom />
      <Chapter n={6} title={sceneTitle[S]} tl={tl} />
      <Headline block={s06.scroll} cueAt={a} tl={tl} />
      <Headline block={s06.circuits} cueAt={b} tl={tl} />
      <Leader label={s06.wantLabel} marker="want" cueAt={b} tl={tl} t={t} until={END} accent={theme.ember} />
      <Leader label={s06.likeLabel} marker="like" cueAt={b} tl={tl} t={t} until={END} accent={theme.ice} />
      <Gauge label="Wanting" x={MARGIN} y={y} w={1080 - 2 * MARGIN} frac={0.35 + 0.6 * e} color={theme.ember} alpha={al} />
      <Gauge label="Liking" x={MARGIN} y={y + 96} w={1080 - 2 * MARGIN} frac={0.6 - 0.5 * e} color={theme.ice} alpha={al} />
      <Body text={s06.body.text} y={y + s06.body.y} size={s06.body.size} tl={tl} start={b + s06.body.offset} alpha={al} />
    </>
  );
};
