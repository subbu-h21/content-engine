/** Limelight titles, Josefin Sans text, Italiana numerals, Poiret One plaques: all from Google Fonts. */
import { loadFont as loadLimelight } from "@remotion/google-fonts/Limelight";
import { loadFont as loadJosefin } from "@remotion/google-fonts/JosefinSans";
import { loadFont as loadItaliana } from "@remotion/google-fonts/Italiana";
import { loadFont as loadPoiret } from "@remotion/google-fonts/PoiretOne";

const limelight = loadLimelight("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const josefin = loadJosefin("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;
const italiana = loadItaliana("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const poiret = loadPoiret("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const DISPLAY = `"${limelight}", Georgia, serif`;
export const BODY = `"${josefin}", "Segoe UI", sans-serif`;
export const NUMERAL = `"${italiana}", Georgia, serif`;
export const PLAQUE = `"${poiret}", "Segoe UI", sans-serif`;

export const FACES = [`400 100px "${limelight}"`, `400 30px "${josefin}"`, `600 30px "${josefin}"`, `400 100px "${italiana}"`, `400 40px "${poiret}"`];
