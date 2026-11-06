/** Archivo, the one neo-grotesque for the whole film (Regular 400, Medium 500, Bold 700, ExtraBold 800). */
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";

loadArchivo("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

export const FACE = `"Archivo", "Arial", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 40px "Archivo"`, `500 40px "Archivo"`, `700 100px "Archivo"`, `800 100px "Archivo"`];
