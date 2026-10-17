/**
 * Per-frame screen positions of points in a 3D plate, exported by the Blender shot script into src/data/markers.json.
 * Lets 2D labels track the 3D scene without re-rendering anything. project.json → markers.plate names the plate.
 */
import markers from "../data/markers.json";
import { project } from "./project";
import { HEIGHT, plateFrame, plateRange, toFrames, WIDTH } from "./timing";

export type MarkerName = string;
export type Marker = { x: number; y: number; visible: boolean };

const frames = markers.frames as Record<string, Record<string, number[]>>;
const LAST = Object.keys(frames).length;
const plate = project.markers ? (project.plates.find((p) => p.id === project.markers?.plate) ?? null) : null;

/** Marker at a global time (seconds). Clamped to the plate's frame range. */
export const markerAt = (t: number, name: MarkerName): Marker => {
  const f = plate ? Math.max(1, Math.min(LAST, plateFrame(plate, t))) : 1;
  const row = frames[String(f)]?.[name] ?? [WIDTH / 2, HEIGHT / 2, 1];
  return { x: row[0], y: row[1], visible: row[2] === 1 };
};

/** Names in the order the shot script wrote them. */
export const MARKER_NAMES: MarkerName[] = Object.keys(frames["1"] ?? {});

/** True while the marker plate is on screen (the guides only draw markers then). */
export const markersActive = (t: number): boolean => {
  if (!plate) return false;
  const r = plateRange(plate);
  return t >= r.start && toFrames(t) < r.endFrame;
};
