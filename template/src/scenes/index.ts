/** Scene registry: one component per scene id in src/data/timing.json. A scene without a component shows only its plate. */
import type { SceneComponent } from "../lib/scene";
import type { SceneId } from "../lib/timing";
import { S01Intro } from "./S01Intro";

export const SCENES: Partial<Record<SceneId, SceneComponent>> = {
  s01_intro: S01Intro,
};
