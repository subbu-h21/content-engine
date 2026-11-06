/** Inter Tight 900 (titles) and 500 (second lines), DM Mono 500 (meta, HUD, tags). */
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";

loadInterTight("normal", { weights: ["500", "900"], subsets: ["latin"] });
loadDMMono("normal", { weights: ["500"], subsets: ["latin"] });

export const TITLE = `"Inter Tight", "Arial Black", sans-serif`;
export const MONO = `"DM Mono", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Inter Tight"`, `500 50px "Inter Tight"`, `500 26px "DM Mono"`];
