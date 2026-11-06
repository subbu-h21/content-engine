/** Geist from Google Fonts for everything (the source allows Inter or Geist; the brand's own face replaces it). */
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";

loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const SANS = `"Geist", "Inter", "Segoe UI", system-ui, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 100px "Geist"`, `500 100px "Geist"`, `600 30px "Geist"`];
