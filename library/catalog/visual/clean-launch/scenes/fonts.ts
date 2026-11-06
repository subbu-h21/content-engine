/** Schibsted Grotesk from Google Fonts: 600 for statements, 500 for descriptors and UI. */
import { loadFont as loadSchibsted } from "@remotion/google-fonts/SchibstedGrotesk";

loadSchibsted("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const SANS = `"Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif`;
export const DISPLAY = SANS;
export const BODY = SANS;

/** Faces the render waits for. */
export const FACES = [`600 120px "Schibsted Grotesk"`, `500 44px "Schibsted Grotesk"`];
