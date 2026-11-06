/**
 * Fraunces (Google Fonts): a soft, chunky display serif whose 900 weight holds up when its letters are filled with
 * knife strokes; 600 for the small crisp text. The source names Cormorant only as an example.
 */
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

loadFraunces("normal", { weights: ["600", "900"], subsets: ["latin"] });

export const DISPLAY = `"Fraunces", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`900 120px "Fraunces"`, `600 44px "Fraunces"`];
