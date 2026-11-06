/** Archivo as the variable font (the header band sets it at width 112.5) and IBM Plex Mono (everything typed). */
import { loadVariableFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

loadArchivo("normal", { subsets: ["latin"] });
loadPlexMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const DISPLAY = `"Archivo", "Arial Black", sans-serif`;
export const MONO = `"IBM Plex Mono", "Courier New", monospace`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Archivo"`, `400 40px "IBM Plex Mono"`, `500 30px "IBM Plex Mono"`, `600 26px "IBM Plex Mono"`];
