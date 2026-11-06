/** Lilita One (signs, banners, the cover), Fredoka (subtitles, bubbles, tags), IM Fell English (taglines). */
import { loadFont as loadLilita } from "@remotion/google-fonts/LilitaOne";
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglish";

const lilita = loadLilita("normal", { weights: ["400"], subsets: ["latin"] });
const fredoka = loadFredoka("normal", { weights: ["500", "600"], subsets: ["latin"] });
const fell = loadFell("italic", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${lilita.fontFamily}", "Arial Black", sans-serif`;
export const BODY = `"${fredoka.fontFamily}", "Arial Rounded MT Bold", sans-serif`;
export const SERIF = `"${fell.fontFamily}", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 100px "${lilita.fontFamily}"`, `500 52px "${fredoka.fontFamily}"`, `600 50px "${fredoka.fontFamily}"`, `italic 400 56px "${fell.fontFamily}"`];
