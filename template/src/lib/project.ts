/**
 * The project manifest (project.json at the project root) and the narration script (script.json).
 * Everything that differs between videos — format, plates, audio stems, scene titles — is read from here,
 * so the components in src/ stay the same for every video.
 */
import projectJson from "../../project.json";
import scriptJson from "../../script.json";

export type PlateSpec = {
  /** file stem: public/plates/<id>_<final|draft>.mp4 */
  id: string;
  /** first scene the plate covers (it starts at that scene's start) */
  from: string;
  /** last scene the plate covers (it ends at that scene's end) */
  to: string;
};

export type ProjectManifest = {
  engine: string;
  title: string;
  slug: string;
  format: { width: number; height: number; fps: number };
  stems: { voice: string | null; music: string | null };
  plates: PlateSpec[];
  /** id of the plate whose per-frame 3D marker positions are in src/data/markers.json, or null */
  markers: { plate: string } | null;
};

export type ScriptScene = { id: string; title: string; cues: { id: string; text: string; pause?: number }[] };

export const project = projectJson as unknown as ProjectManifest;
export const script = scriptJson as unknown as { scenes: ScriptScene[] };
