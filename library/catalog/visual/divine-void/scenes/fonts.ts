/** Cinzel (Roman inscriptional capitals) for captions, Jost light for small tracked captions, from Google Fonts. */
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

loadCinzel("normal", { weights: ["500", "600"], subsets: ["latin"] });
loadJost("normal", { weights: ["300", "400"], subsets: ["latin"] });

export const DISPLAY = `"Cinzel", "Trajan Pro", Georgia, serif`;
export const BODY = `"Jost", "Futura", "Segoe UI", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`500 84px "Cinzel"`, `600 84px "Cinzel"`, `300 30px "Jost"`, `400 30px "Jost"`];
