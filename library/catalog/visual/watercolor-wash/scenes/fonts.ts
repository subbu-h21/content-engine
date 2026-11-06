/** Cormorant Garamond (titles, body in italic), Caveat (hand-written notes), IBM Plex Mono (measured labels). */
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

loadCormorant("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadCormorant("italic", { weights: ["400", "500"], subsets: ["latin"] });
loadCaveat("normal", { weights: ["500", "600"], subsets: ["latin"] });
loadPlexMono("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"Cormorant Garamond", Garamond, Georgia, serif`;
export const HAND = `"Caveat", "Segoe Print", cursive`;
export const MONO = `"IBM Plex Mono", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [
  `500 100px "Cormorant Garamond"`,
  `600 100px "Cormorant Garamond"`,
  `italic 500 100px "Cormorant Garamond"`,
  `500 48px "Caveat"`,
  `600 48px "Caveat"`,
  `400 24px "IBM Plex Mono"`,
];
