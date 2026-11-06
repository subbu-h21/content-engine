/** Playfair Display SC (titles, shouts) and Old Standard TT italic (narration). */
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplaySC";
import { loadFont as loadOld } from "@remotion/google-fonts/OldStandardTT";

const play = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });
const old = loadOld("italic", { weights: ["400"], subsets: ["latin"] });

export const SC = `"${play.fontFamily}", Georgia, serif`;
export const ITALIC = `"${old.fontFamily}", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`900 128px "${play.fontFamily}"`, `700 46px "${play.fontFamily}"`, `italic 400 88px "${old.fontFamily}"`];
