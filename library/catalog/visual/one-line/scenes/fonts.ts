/** Sacramento (a monoline connected script) for titles and Caveat for the words, both Google Fonts as in the source. */
import { loadFont as loadSacramento } from "@remotion/google-fonts/Sacramento";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

loadSacramento("normal", { weights: ["400"], subsets: ["latin"] });
loadCaveat("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const SCRIPT = `"Sacramento", "Segoe Script", cursive`;
export const HAND = `"Caveat", "Segoe Print", cursive`;

/** Faces the render waits for. */
export const FACES = [`400 120px "Sacramento"`, `500 50px "Caveat"`, `600 46px "Caveat"`];
