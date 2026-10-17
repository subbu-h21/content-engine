/** Example scene: replace with the real scenes of the video. Shows the pattern every scene follows. */
import React from "react";
import { Headline } from "../components/Headline";
import { Scrim } from "../components/Finish";
import { Chapter } from "../components/Text";
import { useReel } from "../lib/context";
import { window } from "../lib/motion";
import { cue, sceneDuration, sceneTitle } from "../lib/timing";

const S = "s01_intro";

export const S01Intro: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const { s01 } = useReel().scenes;
  const a = cue(S, "line"); // every timing is relative to a narration cue
  return (
    <>
      <Scrim strength={0.72} to={980} alpha={window(tl, 0.2, sceneDuration(S), 0.5, 0.6)} />
      <Chapter n={1} title={sceneTitle[S]} tl={tl} />
      <Headline block={s01.line} cueAt={a} tl={tl} />
    </>
  );
};
