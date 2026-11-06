/** Josefin Sans (titles and sub-lines) + Quicksand (subtitles), both from Google Fonts. */
import { loadFont as loadJosefin } from "@remotion/google-fonts/JosefinSans";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";

const josefin = loadJosefin("normal", { weights: ["300", "600"], subsets: ["latin"] });
const quick = loadQuicksand("normal", { weights: ["600"], subsets: ["latin"] });

export const DISPLAY = `"${josefin.fontFamily}", "Century Gothic", sans-serif`;
export const BODY = `"${quick.fontFamily}", "Century Gothic", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`600 100px "${josefin.fontFamily}"`, `300 46px "${josefin.fontFamily}"`, `600 54px "${quick.fontFamily}"`];
