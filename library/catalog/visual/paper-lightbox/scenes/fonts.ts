/** Cormorant (the cut-paper titles, Latin as the source suggests) and Noto Serif (the burned-in subtitle line). */
import { loadFont as loadCormorant } from "@remotion/google-fonts/Cormorant";
import { loadFont as loadNotoSerif } from "@remotion/google-fonts/NotoSerif";

loadCormorant("normal", { weights: ["600", "700"], subsets: ["latin"] });
loadNotoSerif("normal", { weights: ["500"], subsets: ["latin"] });

export const DISPLAY = `"Cormorant", "Cormorant Garamond", Garamond, Georgia, serif`;
export const BODY = `"Noto Serif", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`600 100px "Cormorant"`, `700 100px "Cormorant"`, `500 40px "Noto Serif"`];
