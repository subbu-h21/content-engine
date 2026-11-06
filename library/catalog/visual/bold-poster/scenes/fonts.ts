/** Shrikhand (all display, numerals, card titles), Libre Baskerville (all body), Space Grotesk (chrome only). */
import { loadFont as loadShrikhand } from "@remotion/google-fonts/Shrikhand";
import { loadFont as loadBaskerville } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const shrikhand = loadShrikhand("normal", { weights: ["400"], subsets: ["latin"] });
const baskerville = loadBaskerville("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadBaskerville("italic", { weights: ["400"], subsets: ["latin"] });
const grotesk = loadGrotesk("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DISPLAY = `"${shrikhand.fontFamily}", Georgia, serif`;
export const BODY = `"${baskerville.fontFamily}", Georgia, serif`;
export const LABEL = `"${grotesk.fontFamily}", Arial, sans-serif`;

/** Faces the render waits for. */
export const FACES = [
  `400 100px "${shrikhand.fontFamily}"`,
  `400 36px "${baskerville.fontFamily}"`,
  `700 36px "${baskerville.fontFamily}"`,
  `italic 400 36px "${baskerville.fontFamily}"`,
  `400 28px "${grotesk.fontFamily}"`,
  `600 28px "${grotesk.fontFamily}"`,
];
