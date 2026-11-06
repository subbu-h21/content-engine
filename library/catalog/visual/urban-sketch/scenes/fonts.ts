/** Caveat (titles, labels, captions) and Reenie Beanie (corner notes). */
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadReenie } from "@remotion/google-fonts/ReenieBeanie";

export const HAND = loadCaveat("normal", { weights: ["500", "600"], subsets: ["latin"] }).fontFamily;
export const NOTE = loadReenie("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

/** Faces the render waits for. */
export const FACES = [`500 60px ${HAND}`, `600 120px ${HAND}`, `400 70px ${NOTE}`];
