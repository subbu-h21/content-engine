/**
 * Compositions.
 *
 * The props of the full video are written inline in <Composition id="Reel" defaultProps={{ … }}>: that is the only place
 * Remotion Studio's props editor (Inspector → Default Props) can save edits back to. Keep them there, never in a
 * variable, and don't edit them in an editor while Studio is open with unsaved changes.
 *
 * The scene previews in the "Scenes" folder show the saved props of "Reel" (read from the element below) and have no
 * props of their own: edit in "Reel".
 */
import React from "react";
import { Composition, Folder } from "remotion";
import { Reel, SceneOnly } from "./Reel";
import { reelSchema, type ReelProps } from "./lib/schema";
import { FPS, HEIGHT, SCENE_IDS, sceneDuration, sceneNumber, sceneTitle, toFrames, TOTAL_FRAMES, WIDTH } from "./lib/timing";

const reel = (
  <Composition
    id="Reel"
    component={Reel}
    schema={reelSchema}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={{
      plates: "final",
      guides: { safeAreas: false, baselines: false, markers: false, cueReadout: false, timecode: false, captions: false },
      theme: {
        ink: "#08070a",
        bone: "#ede3d1",
        ash: "#857d78",
        dim: "#4d4847",
        ember: "#ff6b29",
        ice: "#94d1ff",
        displayFont: '"Bodoni MT", "Bodoni Moda", "Didot", Georgia, serif',
        bodyFont: '"Inter 18pt", "Inter", "Segoe UI", system-ui, sans-serif',
      },
      type: { scale: 1, leading: 1.04, stagger: 0.09, wordDuration: 0.55, rise: 18, halo: 1 },
      look: { grain: 0.035, vignette: 0.42, scrimTop: 0.72, scrimBottom: 0.6 },
      audio: { voice: true, music: true, sfx: true, voiceDb: 0, musicDb: -14, duckDb: -7, sfxDb: -15 },
      scenes: {
        s01: {
          line: { lines: ["Your first line", "goes *here.*"], size: 104, x: 96, y: 420, align: "left", offset: 0, holdUntil: 0 },
        },
      },
    }}
  />
);

/** The saved props of the full video, shared with the scene previews. */
const DEFAULTS = (reel.props as { defaultProps: ReelProps }).defaultProps;

/** Scene previews have no props of their own (no schema, no defaultProps), so Studio shows no props editor for them. */
const PREVIEWS: Record<string, React.FC> = Object.fromEntries(SCENE_IDS.map((id) => [id, () => <SceneOnly {...DEFAULTS} sceneId={id} />]));

export const RemotionRoot: React.FC = () => (
  <>
    {reel}
    <Folder name="Scenes">
      {SCENE_IDS.map((id) => (
        <Composition
          key={id}
          id={`S${String(sceneNumber(id)).padStart(2, "0")}-${sceneTitle[id].replace(/[^a-z]/gi, "")}`}
          component={PREVIEWS[id]}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={toFrames(sceneDuration(id))}
        />
      ))}
    </Folder>
  </>
);
