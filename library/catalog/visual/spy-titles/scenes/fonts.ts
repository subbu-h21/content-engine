/** League Gothic (credits and titles) and League Spartan (paper strips). */
import { loadFont as loadGothic } from "@remotion/google-fonts/LeagueGothic";
import { loadFont as loadSpartan } from "@remotion/google-fonts/LeagueSpartan";

export const GOTHIC = loadGothic("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const SPARTAN = loadSpartan("normal", { weights: ["600"], subsets: ["latin"] }).fontFamily;

/** Faces the render waits for. */
export const FACES = [`400 200px ${GOTHIC}`, `600 46px ${SPARTAN}`];
