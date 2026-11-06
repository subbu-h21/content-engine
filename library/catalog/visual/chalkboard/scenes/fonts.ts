/**
 * The board is written by the style's own single-stroke chalk hand (glyphs.ts), so no font draws it. Alegreya italic
 * (Google Fonts) sets the subtitle plate: a plain, calligraphic humanist face standing in for the source's kai face.
 */
import { loadFont as loadAlegreya } from "@remotion/google-fonts/Alegreya";

loadAlegreya("italic", { weights: ["400"], subsets: ["latin"] });

export const PLATE = `"Alegreya", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`italic 400 40px "Alegreya"`];
