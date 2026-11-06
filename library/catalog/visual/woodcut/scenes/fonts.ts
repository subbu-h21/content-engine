/** IM Fell English SC (carved titles and numerals) and IM Fell English (letterpress captions, italic emphasis). */
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";
import { loadFont as loadFellSC } from "@remotion/google-fonts/IMFellEnglishSC";

loadFell("normal", { weights: ["400"], subsets: ["latin"] });
loadFell("italic", { weights: ["400"], subsets: ["latin"] });
loadFellSC("normal", { weights: ["400"], subsets: ["latin"] });

export const CARVED = `"IM Fell English SC", "IM Fell English", Georgia, serif`;
export const PRESS = `"IM Fell English", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 90px "IM Fell English SC"`, `400 52px "IM Fell English"`, `italic 400 52px "IM Fell English"`];
