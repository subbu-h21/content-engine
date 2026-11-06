/** Yuji Syuku (a brushed mincho) for cartouche titles and Shippori Mincho 500 for slips, both Google Fonts as in the source. */
import { loadFont as loadYujiSyuku } from "@remotion/google-fonts/YujiSyuku";
import { loadFont as loadShippori } from "@remotion/google-fonts/ShipporiMincho";

loadYujiSyuku("normal", { weights: ["400"], subsets: ["latin"] });
loadShippori("normal", { weights: ["500"], subsets: ["latin"] });

export const BRUSH = `"Yuji Syuku", "Yu Mincho", serif`;
export const MINCHO = `"Shippori Mincho", "Yu Mincho", serif`;

/** Faces the render waits for. */
export const FACES = [`400 64px "Yuji Syuku"`, `500 46px "Shippori Mincho"`];
