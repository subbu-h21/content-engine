/** Bodoni MT + Inter 18pt from the Windows install when present, Bodoni Moda + Inter from Google Fonts otherwise. */
import { loadFont as loadBodoniModa } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadBodoniModa("normal", { weights: ["400"], subsets: ["latin"] });
loadBodoniModa("italic", { weights: ["400"], subsets: ["latin"] });
loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

/** Greek letters (λ, θ, η, γ) aren't in Bodoni: they fall through to the next serif with an italic. */
export const DISPLAY = `"Bodoni MT", "Bodoni Moda", "Didot", Georgia, "Cambria Math", serif`;
export const BODY = `"Inter 18pt", "Inter", "Segoe UI", system-ui, sans-serif`;

/** Faces the render waits for (the local ones resolve at once when they aren't installed). */
export const FACES = [`400 100px "Bodoni MT"`, `italic 400 100px "Bodoni MT"`, `400 100px "Bodoni Moda"`, `italic 400 100px "Bodoni Moda"`, `400 30px "Inter 18pt"`, `500 30px "Inter 18pt"`, `400 30px "Inter"`, `500 30px "Inter"`];
