/** Poppins (every word) and Six Caps (tall key words), from Google Fonts. */
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadSixCaps } from "@remotion/google-fonts/SixCaps";

loadPoppins("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
loadSixCaps("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"Poppins", "Arial Black", sans-serif`;
export const CONDENSED = `"Six Caps", "Impact", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Poppins"`, `800 100px "Poppins"`, `700 40px "Poppins"`, `400 100px "Six Caps"`];
