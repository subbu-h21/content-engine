/** Inter Tight (title and sentence lines, callouts) + IBM Plex Mono (the data line), both from Google Fonts. */
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const tight = loadInterTight("normal", { weights: ["400", "600"], subsets: ["latin"] });
const mono = loadPlexMono("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${tight.fontFamily}", "Segoe UI", sans-serif`;
export const BODY = DISPLAY;
export const MONO = `"${mono.fontFamily}", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`600 64px "${tight.fontFamily}"`, `400 38px "${tight.fontFamily}"`, `400 28px "${mono.fontFamily}"`];
