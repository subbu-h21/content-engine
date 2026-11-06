/** Barlow for every text role; IBM Plex Mono for chrome only. */
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexMono";

const barlow = loadBarlow("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
const plex = loadPlex("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const DISPLAY = `"${barlow.fontFamily}", "Arial Black", sans-serif`;
export const MONO = `"${plex.fontFamily}", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`400 38px "${barlow.fontFamily}"`, `500 38px "${barlow.fontFamily}"`, `700 100px "${barlow.fontFamily}"`, `800 100px "${barlow.fontFamily}"`, `900 100px "${barlow.fontFamily}"`, `500 26px "${plex.fontFamily}"`, `400 26px "${plex.fontFamily}"`];
