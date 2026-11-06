/** Cormorant SC (titles in vertical columns) and Cormorant Garamond italic (inscriptions), both Google Fonts as in the source. */
import { loadFont as loadCormorantSC } from "@remotion/google-fonts/CormorantSC";
import { loadFont as loadCormorantGaramond } from "@remotion/google-fonts/CormorantGaramond";

loadCormorantSC("normal", { weights: ["600"], subsets: ["latin"] });
loadCormorantGaramond("italic", { weights: ["500"], subsets: ["latin"] });

export const CAPS = `"Cormorant SC", Garamond, serif`;
export const INSCRIPTION = `"Cormorant Garamond", Garamond, serif`;

/** Faces the render waits for. */
export const FACES = [`600 70px "Cormorant SC"`, `italic 500 50px "Cormorant Garamond"`];
