/** Space Grotesk (display, numerals, chrome) and Inter 400 (body). */
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const grotesk = loadGrotesk("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${grotesk.fontFamily}", Arial, sans-serif`;
export const BODY = `"${inter.fontFamily}", Arial, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`500 40px "${grotesk.fontFamily}"`, `600 40px "${grotesk.fontFamily}"`, `700 100px "${grotesk.fontFamily}"`, `400 38px "${inter.fontFamily}"`];
