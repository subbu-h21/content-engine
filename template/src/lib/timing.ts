/**
 * Timing is the spine of the piece: every animation is keyed to the moment a narration cue starts.
 * src/data/timing.json is written by the voice-over step of the engine pipeline (`ce pipeline vo`).
 */
import timing from "../data/timing.json";
import { project, script } from "./project";

export const FPS = project.format.fps;
export const WIDTH = project.format.width;
export const HEIGHT = project.format.height;

export type SceneId = keyof typeof timing.scenes;
export const SCENE_IDS = Object.keys(timing.scenes) as SceneId[];

export const TOTAL_SECONDS: number = timing.total;
export const TOTAL_FRAMES = Math.round(timing.total * FPS);

type SceneTiming = { start: number; duration: number; cues: Record<string, { start: number; end: number }> };
const scenes = timing.scenes as Record<string, SceneTiming>;

export const sceneStart = (id: SceneId): number => scenes[id].start;
export const sceneDuration = (id: SceneId): number => scenes[id].duration;
export const sceneEnd = (id: SceneId): number => sceneStart(id) + sceneDuration(id);

/** Scene-local start time (seconds) of a narration cue. */
export const cue = (id: SceneId, name: string): number => {
  const c = scenes[id].cues[name];
  if (!c) throw new Error(`Unknown cue ${id}/${name}`);
  return c.start;
};

/** Scene-local end time (seconds) of a narration cue. */
export const cueEnd = (id: SceneId, name: string): number => scenes[id].cues[name].end;

export const toFrames = (seconds: number): number => Math.round(seconds * FPS);
export const toSeconds = (frame: number): number => frame / FPS;

/** Scene titles come from script.json; a scene without one shows its id. */
export const sceneTitle = Object.fromEntries(
  SCENE_IDS.map((id) => [id, script.scenes.find((s) => s.id === id)?.title ?? id]),
) as Record<SceneId, string>;

export const sceneNumber = (id: SceneId): number => SCENE_IDS.indexOf(id) + 1;

/** A plate covers scenes `from`..`to`; these are its global frame range [startFrame, endFrame). */
export const plateRange = (p: { from: string; to: string }): { start: number; startFrame: number; endFrame: number } => {
  const start = sceneStart(p.from as SceneId);
  return { start, startFrame: toFrames(start), endFrame: toFrames(sceneEnd(p.to as SceneId)) };
};

/** Frame (1-based, as Blender numbers them) inside a plate for a global time. */
export const plateFrame = (p: { from: string; to: string }, t: number): number => Math.round((t - plateRange(p).start) * FPS) + 1;
