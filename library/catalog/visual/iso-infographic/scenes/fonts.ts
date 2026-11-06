/** Jost: one geometric sans for titles, numbers, labels and captions. */
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

const jost = loadJost("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const SANS = `"${jost.fontFamily}", "Century Gothic", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 100px "${jost.fontFamily}"`, `500 46px "${jost.fontFamily}"`, `600 36px "${jost.fontFamily}"`, `700 130px "${jost.fontFamily}"`];
