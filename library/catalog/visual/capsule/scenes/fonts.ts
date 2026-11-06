/** Bodoni Moda (all display, stats, quotes) and Space Grotesk (body and uppercase pill text). */
import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const bodoni = loadBodoni("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
loadBodoni("italic", { weights: ["700", "800"], subsets: ["latin"] });
const grotesk = loadGrotesk("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const DISPLAY = `"${bodoni.fontFamily}", Georgia, serif`;
export const BODY = `"${grotesk.fontFamily}", Arial, sans-serif`;

/** Faces the render waits for. */
export const FACES = [
  `600 60px "${bodoni.fontFamily}"`,
  `700 100px "${bodoni.fontFamily}"`,
  `800 100px "${bodoni.fontFamily}"`,
  `italic 700 100px "${bodoni.fontFamily}"`,
  `italic 800 100px "${bodoni.fontFamily}"`,
  `400 38px "${grotesk.fontFamily}"`,
  `500 38px "${grotesk.fontFamily}"`,
  `600 28px "${grotesk.fontFamily}"`,
];
