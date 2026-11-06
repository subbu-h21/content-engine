/**
 * Jersey 10 (dialog, titles, numbers) + Silkscreen (menu items and window labels), both from Google Fonts. Remotion
 * registers families with digits spelled out ("Jersey OneZero"), so the CSS names come from loadFont().
 */
import { loadFont as loadJersey } from "@remotion/google-fonts/Jersey10";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";

const jersey = loadJersey("normal", { weights: ["400"], subsets: ["latin"] });
const silk = loadSilkscreen("normal", { weights: ["400"], subsets: ["latin"] });

export const DISPLAY = `"${jersey.fontFamily}", "Courier New", monospace`;
export const BODY = DISPLAY;
export const UI = `"${silk.fontFamily}", "Courier New", monospace`;

/** Faces the render waits for. */
export const FACES = [`400 84px "${jersey.fontFamily}"`, `400 48px "${silk.fontFamily}"`];
