/** Bodoni Moda (roman capitals and italic names) and Pinyon Script (notes and subtitles). */
import { loadFont as loadBodoniModa } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadPinyon } from "@remotion/google-fonts/PinyonScript";

loadBodoniModa("normal", { weights: ["400", "500"], subsets: ["latin"] });
loadBodoniModa("italic", { weights: ["400"], subsets: ["latin"] });
loadPinyon("normal", { weights: ["400"], subsets: ["latin"] });

export const ROMAN = `"Bodoni Moda", "Bodoni MT", Didot, Georgia, serif`;
export const SCRIPT = `"Pinyon Script", "Edwardian Script ITC", cursive`;

/** Faces the render waits for. */
export const FACES = [`400 64px "Bodoni Moda"`, `500 64px "Bodoni Moda"`, `italic 400 64px "Bodoni Moda"`, `400 48px "Pinyon Script"`];
