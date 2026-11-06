/** Newsreader 400 (all display), Hanken Grotesk 400/600 (body, labels), DM Mono 400 (chrome). */
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadHanken } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/DMMono";

const news = loadNewsreader("normal", { weights: ["400"], subsets: ["latin"] });
loadNewsreader("italic", { weights: ["400"], subsets: ["latin"] });
const hanken = loadHanken("normal", { weights: ["400", "600"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${news.fontFamily}", Georgia, serif`;
export const BODY = `"${hanken.fontFamily}", Arial, sans-serif`;
export const MONO = `"${mono.fontFamily}", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`400 100px "${news.fontFamily}"`, `italic 400 100px "${news.fontFamily}"`, `400 36px "${hanken.fontFamily}"`, `600 26px "${hanken.fontFamily}"`, `400 26px "${mono.fontFamily}"`];
