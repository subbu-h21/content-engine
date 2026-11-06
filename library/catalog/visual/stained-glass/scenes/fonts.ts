/** Cinzel carved capitals and IM Fell English for parchment and scrolls: both from Google Fonts. */
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";

const cinzel = loadCinzel("normal", { weights: ["600"], subsets: ["latin"] }).fontFamily;
const fell = loadFell("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const DISPLAY = `"${cinzel}", Georgia, serif`;
export const BODY = `"${fell}", Georgia, serif`;

export const FACES = [`600 90px "${cinzel}"`, `400 44px "${fell}"`];
