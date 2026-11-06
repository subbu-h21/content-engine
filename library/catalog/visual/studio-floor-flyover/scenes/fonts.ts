/** Geist (title line and the page) and Instrument Serif italic (the grey tail), both Google Fonts as the source names them. */
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

loadGeist("normal", { weights: ["400", "500"], subsets: ["latin"] });
loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] });

export const SANS = `"Geist", "Inter", "Segoe UI", system-ui, sans-serif`;
export const SERIF = `"Instrument Serif", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 30px "Geist"`, `500 88px "Geist"`, `italic 400 98px "Instrument Serif"`];
