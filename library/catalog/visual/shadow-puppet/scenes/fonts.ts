/**
 * Cinzel 700 (Google Fonts) for letters cut out of the hide plaques: heavy, carved capitals that stay readable when the
 * light shows through them. Cormorant Garamond 600 for the storyteller's placard, as in the source.
 */
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadCormorantGaramond } from "@remotion/google-fonts/CormorantGaramond";

loadCinzel("normal", { weights: ["700"], subsets: ["latin"] });
loadCormorantGaramond("normal", { weights: ["600"], subsets: ["latin"] });

export const PLAQUE = `"Cinzel", "Trajan Pro", serif`;
export const PLACARD = `"Cormorant Garamond", Garamond, serif`;

/** Faces the render waits for. */
export const FACES = [`700 90px "Cinzel"`, `600 48px "Cormorant Garamond"`];
