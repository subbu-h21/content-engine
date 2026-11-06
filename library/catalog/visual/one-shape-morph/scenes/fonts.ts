/** Geist and Geist Mono from Google Fonts (the source embeds its own OFL copies of the same faces). */
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

loadGeist("normal", { weights: ["400", "600"], subsets: ["latin"] });
loadGeistMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const SANS = `"Geist", "Inter", "Segoe UI", system-ui, sans-serif`;
export const MONO = `"Geist Mono", "JetBrains Mono", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`400 30px "Geist"`, `600 50px "Geist"`, `400 25px "Geist Mono"`, `500 25px "Geist Mono"`];
