/** Permanent Marker (hand-lettered words, used sparingly) from Google Fonts. */
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";

const marker = loadMarker("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${marker.fontFamily}", "Comic Sans MS", cursive`;
export const BODY = DISPLAY;

/** Faces the render waits for. */
export const FACES = [`400 100px "${marker.fontFamily}"`];
