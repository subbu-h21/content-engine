/** Kanit (heavy italic chrome titles) + Barlow Semi Condensed (subtitles), both from Google Fonts. */
import { loadFont as loadKanit } from "@remotion/google-fonts/Kanit";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowSemiCondensed";

const kanit = loadKanit("italic", { weights: ["800", "900"], subsets: ["latin"] });
loadKanit("normal", { weights: ["800"], subsets: ["latin"] });
const barlow = loadBarlow("normal", { weights: ["600"], subsets: ["latin"] });
loadBarlow("italic", { weights: ["600"], subsets: ["latin"] });

export const DISPLAY = `"${kanit.fontFamily}", "Arial Black", sans-serif`;
export const BODY = `"${barlow.fontFamily}", "Arial Narrow", sans-serif`;

/** Faces the render waits for. */
export const FACES = [
  `italic 900 150px "${kanit.fontFamily}"`,
  `italic 800 100px "${kanit.fontFamily}"`,
  `800 60px "${kanit.fontFamily}"`,
  `600 60px "${barlow.fontFamily}"`,
  `italic 600 60px "${barlow.fontFamily}"`,
];
