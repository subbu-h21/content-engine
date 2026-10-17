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
          bored: { lines: ["You're *bored.*"], size: 132, x: 540, y: 560, align: "center", offset: 0, holdUntil: 2.31 },
          hand: { lines: ["And your hand", "is already", "on your *phone.*"], size: 102, x: 96, y: 440, align: "left", offset: 0.05, holdUntil: 5.2 },
          who: { lines: ["You didn't", "decide that.", "*So who did?*"], size: 102, x: 96, y: 440, align: "left", offset: 0.05, holdUntil: 8.9 },
        },
        s02: {
          empty: { lines: ["Boredom isn't", "an *empty* mind."], size: 104, x: 96, y: 420, align: "left", offset: 0, holdUntil: 2.91 },
          lock: { lines: ["It's a mind that", "can't *lock on*", "to anything."], size: 102, x: 96, y: 420, align: "left", offset: 0.05, holdUntil: 5.87 },
          search: { lines: ["Attention keeps", "searching for", "something to hold.", "And that feels *bad.*"], size: 86, x: 96, y: 350, align: "left", offset: 0.05, holdUntil: 10.6 },
          searchLabel: { text: "Attention, searching", dx: -260, dy: 220, side: "left", offset: -0.1 },
        },
        s03: {
          shortcut: { lines: ["Your brain", "has learned", "a *shortcut.*"], size: 104, x: 96, y: 420, align: "left", offset: 0, holdUntil: 2.75 },
          cueLabel: { text: "Cue · boredom", dx: -40, dy: -170, side: "left", offset: 0 },
          responseLabel: { text: "Response · the phone", dx: -60, dy: 190, side: "left", offset: 1.0 },
          body: { text: "A cue is anything the brain has linked to what comes next.", y: 1470, size: 32, offset: 1.6 },
        },
        s04: {
          notJoy: { lines: ["The reward", "isn't *joy.*"], size: 106, x: 96, y: 420, align: "left", offset: 0, holdUntil: 2.33 },
          relief: { lines: ["It's *relief.*"], size: 106, x: 96, y: 420, align: "left", offset: 0.05, holdUntil: 7.4 },
          body: { text: "The discomfort fades. For a moment.", y: 600, size: 36, offset: 1.1 },
          ringY: 1500,
          ringR: 150,
        },
        s05: {
          loop: { lines: ["Every time relief", "follows the reach,", "the shortcut gets", "*easier* to take."], size: 88, x: 96, y: 400, align: "left", offset: 0, holdUntil: 6.3 },
          ringY: 1500,
          ringR: 150,
        },
        s06: {
          scroll: { lines: ["That's why you", "keep scrolling after", "it stopped being *fun.*"], size: 90, x: 96, y: 400, align: "left", offset: 0, holdUntil: 3.27 },
          circuits: { lines: ["*Wanting* and *liking*", "run on different circuits."], size: 90, x: 96, y: 400, align: "left", offset: 0.05, holdUntil: 9.3 },
          wantLabel: { text: "Wanting", dx: -140, dy: -150, side: "left", offset: 0.6 },
          likeLabel: { text: "Liking", dx: 40, dy: -130, side: "right", offset: 0.9 },
          gaugesY: 1440,
          body: { text: "One can grow while the other fades.", y: 170, size: 32, offset: 3.2 },
        },
        s07: {
          sign: { lines: ["The urge to reach", "isn't a sign you *enjoy* it.", "It's a sign you've *learned* it."], size: 82, x: 96, y: 400, align: "left", offset: 0, holdUntil: 4.91 },
          notice: { lines: ["Notice the cue.", "Wait *ten seconds.*"], size: 100, x: 96, y: 420, align: "left", offset: 0.05, holdUntil: 9.61 },
          end: { lines: ["The loop can't run", "without the *response.*"], size: 94, x: 96, y: 420, align: "left", offset: 0.05, holdUntil: 13.11 },
          countdownY: 1500,
          ringY: 1180,
          ringR: 190,
          title: ["Why we reach", "for our phones"],
          tagline: "The mind, one mechanism at a time",
          series: "01 · Boredom and cues",
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
