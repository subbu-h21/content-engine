/** Arial and Consolas when installed; Arimo (Arial's metric twin) and Inconsolata from Google Fonts otherwise. */
import { loadFont as loadArimo } from "@remotion/google-fonts/Arimo";
import { loadFont as loadInconsolata } from "@remotion/google-fonts/Inconsolata";

loadArimo("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadInconsolata("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DISPLAY = `"Arial", "Arimo", "Helvetica Neue", sans-serif`;
export const BODY = DISPLAY;
export const MONO = `"Consolas", "Inconsolata", monospace`;

/** Faces the render waits for (the local ones resolve at once when they aren't installed). */
export const FACES = [`400 30px "Arimo"`, `700 90px "Arimo"`, `400 24px "Inconsolata"`, `600 24px "Inconsolata"`, `400 30px "Arial"`, `700 90px "Arial"`, `400 24px "Consolas"`];
