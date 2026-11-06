/** Alfa Slab One (titles, numerals), Oleo Script (the kicker), Jost (labels, captions). */
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadOleo } from "@remotion/google-fonts/OleoScript";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

const slab = loadSlab("normal", { weights: ["400"], subsets: ["latin"] });
const oleo = loadOleo("normal", { weights: ["700"], subsets: ["latin"] });
const jost = loadJost("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const SLAB = `"${slab.fontFamily}", Rockwell, serif`;
export const SCRIPT = `"${oleo.fontFamily}", cursive`;
export const SANS = `"${jost.fontFamily}", "Century Gothic", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 156px "${slab.fontFamily}"`, `700 76px "${oleo.fontFamily}"`, `500 44px "${jost.fontFamily}"`, `600 32px "${jost.fontFamily}"`];
