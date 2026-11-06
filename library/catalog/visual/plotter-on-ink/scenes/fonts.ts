/**
 * Archivo as the variable font (width axis 62–125 and weight, so slams can step through widths), IBM Plex Mono (the UI
 * voice) and Cormorant Garamond (captions, formulas; always with lining figures), all from Google Fonts.
 */
import { loadVariableFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

loadArchivo("normal", { subsets: ["latin"] });
loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadCormorant("normal", { weights: ["400", "600"], subsets: ["latin"] });
loadCormorant("italic", { weights: ["400", "600"], subsets: ["latin"] });

export const DISPLAY = `"Archivo", "Arial Narrow", sans-serif`;
export const MONO = `"IBM Plex Mono", "Consolas", monospace`;
export const SERIF = `"Cormorant Garamond", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Archivo"`, `700 100px "Archivo"`, `400 26px "IBM Plex Mono"`, `500 26px "IBM Plex Mono"`, `600 26px "IBM Plex Mono"`, `400 40px "Cormorant Garamond"`, `italic 400 40px "Cormorant Garamond"`, `italic 600 40px "Cormorant Garamond"`];
