/** Bricolage Grotesque 800 (titles, numbers) and Jost (captions, labels). */
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

loadBricolage("normal", { weights: ["800"], subsets: ["latin"] });
loadJost("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const DISPLAY = `"Bricolage Grotesque", "Arial Black", sans-serif`;
export const BODY = `"Jost", "Futura", "Segoe UI", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`800 100px "Bricolage Grotesque"`, `500 40px "Jost"`, `600 40px "Jost"`];
