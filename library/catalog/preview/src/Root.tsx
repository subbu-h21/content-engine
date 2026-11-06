/**
 * The catalog's preview project: draws one style (copied into src/style/ by `ce catalog preview`) on the shared
 * sample content. "Reel" plays every sample in a row; "Still-<id>" is one sample at its full length, with its hero
 * frame in the props (render.mjs renders that frame). A one-frame composition can't be used with <Freeze>: the
 * frame is clamped to the composition's length.
 */
import React from "react";
import { AbsoluteFill, Composition, Folder, Sequence } from "remotion";
import { samples } from "./style/scenes";
import style from "./style/style.json";

const FPS = 30;
const W = style.frame.width;
const H = style.frame.height;
const frames = (s: number) => Math.max(1, Math.round(s * FPS));
const TOTAL = samples.reduce((n, s) => n + frames(s.duration), 0);

const Reel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      {samples.map((s) => {
        const from = at;
        at += frames(s.duration);
        return (
          <Sequence key={s.id} from={from} durationInFrames={frames(s.duration)}>
            <s.component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const STILLS: Record<string, React.FC<{ hero: number }>> = Object.fromEntries(samples.map((s) => [s.id, () => <s.component />]));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
    <Folder name="Stills">
      {samples.map((s) => (
        <Composition
          key={s.id}
          id={`Still-${s.id}`}
          component={STILLS[s.id]}
          width={W}
          height={H}
          fps={FPS}
          durationInFrames={frames(s.duration)}
          defaultProps={{ hero: Math.min(frames(s.hero), frames(s.duration) - 1) }}
        />
      ))}
    </Folder>
  </>
);
