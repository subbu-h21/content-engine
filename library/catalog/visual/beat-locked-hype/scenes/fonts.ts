/** Inter Tight (slams), Instrument Serif italic (the human line) and Geist Mono (HUD labels), all Google Fonts. */
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

loadInterTight("normal", { weights: ["600", "900"], subsets: ["latin"] });
loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] });
loadGeistMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const SLAM = `"Inter Tight", "Archivo Black", "Arial Black", sans-serif`;
export const SERIF = `"Instrument Serif", Georgia, serif`;
export const MONO = `"Geist Mono", "JetBrains Mono", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Inter Tight"`, `600 40px "Inter Tight"`, `italic 400 100px "Instrument Serif"`, `400 26px "Geist Mono"`, `500 26px "Geist Mono"`];
