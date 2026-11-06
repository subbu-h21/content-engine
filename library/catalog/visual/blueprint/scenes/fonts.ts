/** Architects Daughter lettering, B612 title-block fields, Allura for the signature. Google Fonts; B612's family name comes from loadFont. */
import { loadFont as loadArchitects } from "@remotion/google-fonts/ArchitectsDaughter";
import { loadFont as loadB612 } from "@remotion/google-fonts/B612";
import { loadFont as loadAllura } from "@remotion/google-fonts/Allura";

const architects = loadArchitects("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const b612 = loadB612("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const allura = loadAllura("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const LETTER = `"${architects}", "Segoe Print", cursive`;
export const FIELD = `"${b612}", "Segoe UI", sans-serif`;
export const SIGN = `"${allura}", cursive`;

export const FACES = [`400 100px "${architects}"`, `400 30px "${b612}"`, `700 30px "${b612}"`, `400 90px "${allura}"`];
