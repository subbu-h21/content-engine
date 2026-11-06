/** Playfair Display 400 (all display; italic only for emphasis) and Inter 400/500 (body, labels). */
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const playfair = loadPlayfair("normal", { weights: ["400"], subsets: ["latin"] });
loadPlayfair("italic", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const DISPLAY = `"${playfair.fontFamily}", Georgia, serif`;
export const BODY = `"${inter.fontFamily}", Arial, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 100px "${playfair.fontFamily}"`, `italic 400 100px "${playfair.fontFamily}"`, `400 36px "${inter.fontFamily}"`, `500 26px "${inter.fontFamily}"`];
