/** The Blender plates listed in project.json, each over its scene range. Bloom is baked in by `ce pipeline plates`. */
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { useReel } from "../lib/context";
import { project } from "../lib/project";
import { plateRange } from "../lib/timing";

const PLATES = project.plates.map((p) => ({ id: p.id, ...plateRange(p) }));

export const Plates: React.FC = () => {
  const { plates } = useReel();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {PLATES.map((p) => (
        <Sequence key={p.id} name={`Plate · ${p.id}`} from={p.startFrame} durationInFrames={p.endFrame - p.startFrame} layout="none">
          <Video src={staticFile(`plates/${p.id}_${plates}.mp4`)} muted style={{ width: "100%", height: "100%" }} name={`${p.id} plate`} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
