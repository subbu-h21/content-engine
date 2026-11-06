/** Overpass: a neutral signage grotesk for every printed label, figure and drum (the source's demo used Inter). */
import { loadFont as loadOverpass } from "@remotion/google-fonts/Overpass";

loadOverpass("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const FACE = `"Overpass", "Segoe UI", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`600 30px "Overpass"`, `700 40px "Overpass"`, `800 60px "Overpass"`];
