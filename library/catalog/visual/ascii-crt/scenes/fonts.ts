/** VT323: one monospace bitmap-style face for every glyph on the screen. */
import { loadFont as loadVT323 } from "@remotion/google-fonts/VT323";

const vt = loadVT323("normal", { weights: ["400"], subsets: ["latin"] });

export const MONO = `"${vt.fontFamily}", "Consolas", monospace`;

/** Faces the render waits for. */
export const FACES = [`400 60px "${vt.fontFamily}"`];
