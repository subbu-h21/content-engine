/** Scene registry: one component per scene id in src/data/timing.json. A scene without a component shows only its plate. */
import type { SceneComponent } from "../lib/scene";
import type { SceneId } from "../lib/timing";
import { S01Hook } from "./S01Hook";
import { S02Boredom } from "./S02Boredom";
import { S03Cue } from "./S03Cue";
import { S04Relief } from "./S04Relief";
import { S05Loop } from "./S05Loop";
import { S06Wanting } from "./S06Wanting";
import { S07Insight } from "./S07Insight";

export const SCENES: Partial<Record<SceneId, SceneComponent>> = {
  s01_hook: S01Hook,
  s02_boredom: S02Boredom,
  s03_cue: S03Cue,
  s04_relief: S04Relief,
  s05_loop: S05Loop,
  s06_wanting: S06Wanting,
  s07_insight: S07Insight,
};
