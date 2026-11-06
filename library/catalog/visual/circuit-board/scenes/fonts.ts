/** Noto Sans for the subtitle plate. Board type isn't a font: it's routed strokes (see `Silk` in parts.tsx). */
import { loadFont as loadNoto } from "@remotion/google-fonts/NotoSans";

const noto = loadNoto("normal", { weights: ["500"], subsets: ["latin"] });

export const SANS = `"${noto.fontFamily}", "Segoe UI", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`500 42px "${noto.fontFamily}"`];
