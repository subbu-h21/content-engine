/** Newsreader (headline, caption), Caveat (pencil notes), IBM Plex Mono (ticks, kickers). */
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexMono";

const news = loadNewsreader("normal", { weights: ["400", "500"], subsets: ["latin"] });
const hand = loadCaveat("normal", { weights: ["500", "600"], subsets: ["latin"] });
const plex = loadPlex("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const SERIF = `"${news.fontFamily}", Georgia, serif`;
export const HAND = `"${hand.fontFamily}", "Segoe Print", cursive`;
export const MONO = `"${plex.fontFamily}", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`400 44px "${news.fontFamily}"`, `500 84px "${news.fontFamily}"`, `500 50px "${hand.fontFamily}"`, `600 50px "${hand.fontFamily}"`, `400 27px "${plex.fontFamily}"`, `500 26px "${plex.fontFamily}"`];
