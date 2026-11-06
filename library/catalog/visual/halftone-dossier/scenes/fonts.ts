/** Alfa Slab One (the black slab headlines), Noto Sans Black (captions and stamps), JetBrains Mono 800 (case data),
 * Bagel Fat One (giant numerals and the title word). */
import { loadFont as loadAlfaSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadNotoSans } from "@remotion/google-fonts/NotoSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBagel } from "@remotion/google-fonts/BagelFatOne";

loadAlfaSlab("normal", { weights: ["400"], subsets: ["latin"] });
loadNotoSans("normal", { weights: ["800", "900"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["800"], subsets: ["latin"] });
loadBagel("normal", { weights: ["400"], subsets: ["latin"] });

export const SLAB = `"Alfa Slab One", "Rockwell Extra Bold", serif`;
export const SANS = `"Noto Sans", "Arial Black", sans-serif`;
export const MONO = `"JetBrains Mono", Consolas, monospace`;
export const FAT = `"Bagel Fat One", "Arial Black", sans-serif`;

/** Faces the render waits for. */
export const FACES = [`400 100px "Alfa Slab One"`, `900 40px "Noto Sans"`, `800 40px "Noto Sans"`, `800 26px "JetBrains Mono"`, `400 100px "Bagel Fat One"`];
