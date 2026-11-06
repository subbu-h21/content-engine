/** Hanken Grotesk (500/700), one Newsreader italic word, IBM Plex Mono kickers (iA Writer Mono S first when installed). */
import { loadFont as loadHanken } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

loadHanken("normal", { weights: ["500", "700"], subsets: ["latin"] });
loadNewsreader("italic", { weights: ["500"], subsets: ["latin"] });
loadPlexMono("normal", { weights: ["500"], subsets: ["latin"] });

export const SANS = `"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif`;
export const SERIF = `"Newsreader", Georgia, serif`;
export const MONO = `"iA Writer Mono S", "IBM Plex Mono", Consolas, monospace`;
export const DISPLAY = SANS;
export const BODY = SANS;

/** Faces the render waits for (iA Writer Mono S resolves at once when it isn't installed). */
export const FACES = [`700 100px "Hanken Grotesk"`, `500 38px "Hanken Grotesk"`, `italic 500 100px "Newsreader"`, `500 26px "IBM Plex Mono"`, `500 26px "iA Writer Mono S"`];
