/** Instrument Serif (display, numerals, quotes), Archivo (body, labels), JetBrains Mono (figures and the page number). */
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const archivo = loadArchivo("normal", { weights: ["400", "600"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${serif.fontFamily}", Georgia, serif`;
export const BODY = `"${archivo.fontFamily}", Arial, sans-serif`;
export const MONO = `"${mono.fontFamily}", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [
  `400 100px "${serif.fontFamily}"`,
  `italic 400 100px "${serif.fontFamily}"`,
  `400 40px "${archivo.fontFamily}"`,
  `600 40px "${archivo.fontFamily}"`,
  `400 30px "${mono.fontFamily}"`,
];
