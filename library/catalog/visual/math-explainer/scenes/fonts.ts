/**
 * CMU Serif (Computer Modern) when installed; Old Standard TT from Google Fonts otherwise. Computer Modern was drawn
 * after the late-19th-century "Modern" faces, and Old Standard TT revives that same family of type. Greek letters and
 * maths symbols (λ, ∝, ≈) fall back to Cambria Math, because Old Standard TT's Google build has no Greek.
 */
import { loadFont as loadOldStandard } from "@remotion/google-fonts/OldStandardTT";

loadOldStandard("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadOldStandard("italic", { weights: ["400"], subsets: ["latin"] });

export const SERIF = `"CMU Serif", "Old Standard TT", "Cambria Math", Cambria, "Times New Roman", serif`;
export const DISPLAY = SERIF;
export const BODY = SERIF;

/** Faces the render waits for (CMU Serif resolves at once when it isn't installed). */
export const FACES = [`400 100px "Old Standard TT"`, `italic 400 100px "Old Standard TT"`, `700 100px "Old Standard TT"`, `400 100px "CMU Serif"`, `italic 400 100px "CMU Serif"`];
