/** Fredoka (headlines, Google Fonts) + Inter (labels): Inter 18pt from the Windows install when present. */
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadFredoka("normal", { weights: ["500", "700"], subsets: ["latin"] });
loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const DISPLAY = `"Fredoka", "Segoe UI", system-ui, sans-serif`;
export const BODY = `"Inter 18pt", "Inter", "Segoe UI", system-ui, sans-serif`;

/** Faces the render waits for (the local ones resolve at once when they aren't installed). */
export const FACES = [`500 100px "Fredoka"`, `700 100px "Fredoka"`, `400 30px "Inter 18pt"`, `500 30px "Inter 18pt"`, `400 30px "Inter"`, `500 30px "Inter"`];
