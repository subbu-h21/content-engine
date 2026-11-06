/** Sora (the title card the hero builds), Geist (the generic app's UI) and Geist Mono (timecodes), from Google Fonts. */
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

loadSora("normal", { weights: ["700", "800"], subsets: ["latin"] });
loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadGeistMono("normal", { weights: ["500"], subsets: ["latin"] });

export const DISPLAY = `"Sora", "Segoe UI", sans-serif`;
export const BODY = `"Geist", "Segoe UI", sans-serif`;
export const MONO = `"Geist Mono", "Consolas", monospace`;

/** Faces the render waits for. */
export const FACES = [`700 100px "Sora"`, `800 100px "Sora"`, `400 30px "Geist"`, `500 30px "Geist"`, `600 30px "Geist"`, `500 26px "Geist Mono"`];
