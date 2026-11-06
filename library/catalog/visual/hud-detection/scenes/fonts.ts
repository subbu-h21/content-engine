/** Unbounded (titles, the drop), Space Grotesk (captions, UI), JetBrains Mono (HUD, data), Instrument Serif (the
 * emotional line), all from Google Fonts. */
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

loadUnbounded("normal", { weights: ["900"], subsets: ["latin"] });
loadSpaceGrotesk("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
loadJetBrainsMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"Unbounded", "Arial Black", sans-serif`;
export const BODY = `"Space Grotesk", "Segoe UI", sans-serif`;
export const MONO = `"JetBrains Mono", "Consolas", monospace`;
export const SERIF = `"Instrument Serif", Georgia, serif`;

/** Faces the render waits for. */
export const FACES = [`900 100px "Unbounded"`, `400 40px "Space Grotesk"`, `500 40px "Space Grotesk"`, `700 40px "Space Grotesk"`, `400 26px "JetBrains Mono"`, `500 26px "JetBrains Mono"`, `700 26px "JetBrains Mono"`, `italic 400 100px "Instrument Serif"`];
