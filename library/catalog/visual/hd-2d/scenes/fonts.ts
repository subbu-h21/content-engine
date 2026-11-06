/** Cinzel (titles, chapter labels) + Cormorant Garamond (narration italic, dialogue, name plates), from Google Fonts. */
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

const cinzel = loadCinzel("normal", { weights: ["500", "700"], subsets: ["latin"] });
const corm = loadCormorant("normal", { weights: ["500", "600"], subsets: ["latin"] });
loadCormorant("italic", { weights: ["500"], subsets: ["latin"] });

export const DISPLAY = `"${cinzel.fontFamily}", "Trajan Pro", Georgia, serif`;
export const BODY = `"${corm.fontFamily}", Garamond, Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`700 112px "${cinzel.fontFamily}"`, `500 40px "${cinzel.fontFamily}"`, `500 52px "${corm.fontFamily}"`, `600 40px "${corm.fontFamily}"`, `italic 500 56px "${corm.fontFamily}"`];
