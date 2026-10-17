import type React from "react";

/** Every scene component gets scene-local time `tl` and global time `t`, both in seconds. */
export type SceneComponent = React.FC<{ tl: number; t: number }>;
