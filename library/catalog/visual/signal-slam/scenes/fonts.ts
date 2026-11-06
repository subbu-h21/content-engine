/** Archivo as the variable font (every slam steps through widths 62–125) and IBM Plex Mono for the corner labels. */
import { loadVariableFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

loadArchivo("normal", { subsets: ["latin"] });
loadPlexMono("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const DISPLAY = `"Archivo", "Arial Black", sans-serif`;
export const MONO = `"IBM Plex Mono", "Consolas", monospace`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Archivo"`, `500 26px "IBM Plex Mono"`, `600 26px "IBM Plex Mono"`];
