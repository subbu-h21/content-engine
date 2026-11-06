/** Poppins (every word), Six Caps (tall key words) and DM Mono (UI mock-ups), all from Google Fonts. */
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadSixCaps } from "@remotion/google-fonts/SixCaps";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";

loadPoppins("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] });
loadSixCaps("normal", { weights: ["400"], subsets: ["latin"] });
loadDMMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const DISPLAY = `"Poppins", "Arial Black", sans-serif`;
export const CONDENSED = `"Six Caps", "Impact", sans-serif`;
export const MONO = `"DM Mono", "Consolas", monospace`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Poppins"`, `800 100px "Poppins"`, `700 40px "Poppins"`, `600 40px "Poppins"`, `400 100px "Six Caps"`, `400 30px "DM Mono"`, `500 30px "DM Mono"`];
