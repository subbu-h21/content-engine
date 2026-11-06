/** Libre Franklin (a Franklin Gothic revival, the newspaper-headline grotesque) for every printed strip. */
import { loadFont as loadFranklin } from "@remotion/google-fonts/LibreFranklin";

loadFranklin("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });

export const DISPLAY = `"Libre Franklin", "Franklin Gothic Medium", Arial, sans-serif`;
export const BODY = DISPLAY;

/** Faces the render waits for. */
export const FACES = [`800 80px "Libre Franklin"`, `900 80px "Libre Franklin"`, `600 30px "Libre Franklin"`];
