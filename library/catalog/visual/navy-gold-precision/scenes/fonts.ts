/** Plus Jakarta Sans for all text and JetBrains Mono for numbers, both from Google Fonts. */
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadJakarta("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const SANS = `"Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, sans-serif`;
export const MONO = `"JetBrains Mono", Consolas, monospace`;

/** Faces the render waits for. */
export const FACES = [`400 30px "Plus Jakarta Sans"`, `500 30px "Plus Jakarta Sans"`, `600 90px "Plus Jakarta Sans"`, `700 90px "Plus Jakarta Sans"`, `400 26px "JetBrains Mono"`, `500 26px "JetBrains Mono"`, `600 200px "JetBrains Mono"`];
