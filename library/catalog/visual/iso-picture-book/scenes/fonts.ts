/** Newsreader: the floor type and the caption bar (the source's Latin face). */
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";

const news = loadNewsreader("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const SERIF = `"${news.fontFamily}", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 44px "${news.fontFamily}"`, `500 84px "${news.fontFamily}"`, `700 150px "${news.fontFamily}"`];
