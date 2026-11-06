/**
 * Architects Daughter (Google Fonts) for every word: the source writes the board with EMS Tech, a single-stroke version
 * of Architects Daughter that isn't on Google Fonts, so the filled original is used and written on behind the marker.
 */
import { loadFont as loadArchitects } from "@remotion/google-fonts/ArchitectsDaughter";

loadArchitects("normal", { weights: ["400"], subsets: ["latin"] });

export const HANDWRITING = `"Architects Daughter", "Segoe Print", cursive`;

/** Faces the render waits for. */
export const FACES = [`400 60px "Architects Daughter"`];
