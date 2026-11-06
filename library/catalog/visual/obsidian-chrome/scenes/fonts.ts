/** Inter (display 800, body 400/600) and Geist Mono 500 for micro labels, from Google Fonts. */
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
loadGeistMono("normal", { weights: ["500"], subsets: ["latin"] });

export const DISPLAY = `"Inter", "Segoe UI", system-ui, sans-serif`;
export const BODY = `"Inter", "Segoe UI", system-ui, sans-serif`;
export const MONO = `"Geist Mono", "SFMono-Regular", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`800 100px "Inter"`, `600 40px "Inter"`, `400 30px "Inter"`, `500 24px "Geist Mono"`];
