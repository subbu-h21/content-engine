/** Inter (display 800/900, body 500/700) and Space Grotesk (labels and counters). */
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const inter = loadInter("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin"] });
const grotesk = loadGrotesk("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const DISPLAY = `"${inter.fontFamily}", "Arial Black", sans-serif`;
export const LABEL = `"${grotesk.fontFamily}", Arial, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`500 40px "${inter.fontFamily}"`, `700 40px "${inter.fontFamily}"`, `800 100px "${inter.fontFamily}"`, `900 100px "${inter.fontFamily}"`, `600 30px "${grotesk.fontFamily}"`, `700 30px "${grotesk.fontFamily}"`];
