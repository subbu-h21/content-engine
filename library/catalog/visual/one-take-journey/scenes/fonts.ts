/** Inter from Google Fonts: the SF-like system face the source asks for (Inter or Geist). */
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const SANS = `"Inter", "Segoe UI", system-ui, sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 40px "Inter"`, `500 40px "Inter"`, `600 40px "Inter"`];
