/** Big Shoulders (condensed names and values; the source's Big Shoulders Display, now one family) and Outfit
 * (letter-spaced labels). */
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

loadBigShoulders("normal", { weights: ["800", "900"], subsets: ["latin"] });
loadOutfit("normal", { weights: ["600"], subsets: ["latin"] });

export const DISPLAY = `"Big Shoulders", "Big Shoulders Display", "League Gothic", Impact, sans-serif`;
export const LABEL = `"Outfit", "Segoe UI", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Big Shoulders"`, `800 100px "Big Shoulders"`, `600 34px "Outfit"`];
