/** Fredoka (every word) from Google Fonts. */
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";

const fredoka = loadFredoka("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const DISPLAY = `"${fredoka.fontFamily}", "Arial Rounded MT Bold", sans-serif`;
export const BODY = DISPLAY;

/** Faces the render waits for. */
export const FACES = [`700 100px "${fredoka.fontFamily}"`, `600 40px "${fredoka.fontFamily}"`];
