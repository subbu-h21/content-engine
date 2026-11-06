/** Inter 400–700 from Google Fonts (the source's face). */
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const SANS = `"Inter", "Segoe UI", system-ui, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 47px "Inter"`, `500 47px "Inter"`, `600 47px "Inter"`, `700 200px "Inter"`];
