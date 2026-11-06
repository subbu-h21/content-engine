/** Geist for the UI (as the source names it) and Fraunces for the name on the end card (the source asks for "a serif"). */
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
loadFraunces("normal", { weights: ["500", "600"], subsets: ["latin"] });
loadFraunces("italic", { weights: ["500"], subsets: ["latin"] });

export const SANS = `"Geist", "Inter", "Segoe UI", system-ui, sans-serif`;
export const SERIF = `"Fraunces", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`400 40px "Geist"`, `500 40px "Geist"`, `600 300px "Geist"`, `500 128px "Fraunces"`, `600 128px "Fraunces"`, `italic 500 128px "Fraunces"`];
