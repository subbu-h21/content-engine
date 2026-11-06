/** Fraunces: 800 for cut letters and numbers, 600 (roman and italic) for banners and printed credits. */
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

loadFraunces("normal", { weights: ["600", "800"], subsets: ["latin"] });
loadFraunces("italic", { weights: ["600"], subsets: ["latin"] });

export const SERIF = `"Fraunces", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`800 120px "Fraunces"`, `600 44px "Fraunces"`, `italic 600 34px "Fraunces"`];
