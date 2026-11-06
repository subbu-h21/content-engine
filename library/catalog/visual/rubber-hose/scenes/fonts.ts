/** Shrikhand (fat script titles), Limelight (caps sub-lines), IM Fell English SC (subtitle plates). */
import { loadFont as loadShrikhand } from "@remotion/google-fonts/Shrikhand";
import { loadFont as loadLimelight } from "@remotion/google-fonts/Limelight";
import { loadFont as loadFell } from "@remotion/google-fonts/IMFellEnglishSC";

const shrik = loadShrikhand("normal", { weights: ["400"], subsets: ["latin"] });
const lime = loadLimelight("normal", { weights: ["400"], subsets: ["latin"] });
const fell = loadFell("normal", { weights: ["400"], subsets: ["latin"] });

export const SCRIPT = `"${shrik.fontFamily}", "Cooper Black", serif`;
export const CAPS = `"${lime.fontFamily}", Georgia, serif`;
export const SC = `"${fell.fontFamily}", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 216px "${shrik.fontFamily}"`, `400 62px "${lime.fontFamily}"`, `400 50px "${fell.fontFamily}"`];
