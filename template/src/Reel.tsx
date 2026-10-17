/**
 * The composition. Layer order: plates → scene overlays → finish (vignette, grain) → developer guides.
 * Each scene lives in a named <Sequence>, so the Studio timeline reads like the script.
 * Scene components are registered in src/scenes/index.ts. EngineBridge renders nothing (see the file).
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { AudioMix } from "./components/AudioMix";
import { EngineBridge } from "./components/EngineBridge";
import { Finish } from "./components/Finish";
import { Guides } from "./components/Guides";
import { Plates } from "./components/Plate";
import { ReelProvider } from "./lib/context";
import { useFonts } from "./lib/fonts";
import type { ReelProps } from "./lib/schema";
import { SCENE_IDS, sceneDuration, sceneNumber, sceneStart, sceneTitle, toFrames, toSeconds, type SceneId } from "./lib/timing";
import { SCENES } from "./scenes";

const SceneLayer: React.FC<{ id: SceneId }> = ({ id }) => {
  const frame = useCurrentFrame(); // relative to the scene's Sequence
  const tl = toSeconds(frame);
  const Comp = SCENES[id];
  if (!Comp) return null;
  return (
    <AbsoluteFill>
      <Comp tl={tl} t={sceneStart(id) + tl} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = (props) => {
  useFonts();
  return (
    <ReelProvider value={props}>
      <AbsoluteFill style={{ backgroundColor: props.theme.ink }}>
        <Plates />
        {SCENE_IDS.map((id) => (
          <Sequence key={id} name={`${String(sceneNumber(id)).padStart(2, "0")} · ${sceneTitle[id]}`} from={toFrames(sceneStart(id))} durationInFrames={toFrames(sceneDuration(id))} layout="none">
            <SceneLayer id={id} />
          </Sequence>
        ))}
        <Finish />
        <Guides />
        <AudioMix />
        <EngineBridge />
      </AbsoluteFill>
    </ReelProvider>
  );
};

/** One scene in isolation (for stills and quick iteration): the full reel shifted so the scene starts at frame 0. */
export const SceneOnly: React.FC<ReelProps & { sceneId: SceneId }> = ({ sceneId, ...props }) => (
  <Sequence from={-toFrames(sceneStart(sceneId))} layout="none">
    <Reel {...props} />
  </Sequence>
);
