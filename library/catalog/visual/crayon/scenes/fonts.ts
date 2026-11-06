/** Gaegu Bold for hand-lettered titles and Patrick Hand for the printed words (both Google Fonts, as in the source). */
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";

loadGaegu("normal", { weights: ["700"], subsets: ["latin"] });
loadPatrickHand("normal", { weights: ["400"], subsets: ["latin"] });

export const TITLE = `"Gaegu", "Comic Sans MS", cursive`;
export const HAND = `"Patrick Hand", "Comic Sans MS", cursive`;

/** Faces the render waits for. */
export const FACES = [`700 100px "Gaegu"`, `400 50px "Patrick Hand"`];
