/**
 * Design language "editorial neuro": ink ground, one text colour (bone), italics for emphasis,
 * two accents reserved for diagram elements. Values here are the defaults; the Props panel can override them.
 */
export const INK = "#08070a";
export const BONE = "#ede3d1";
export const ASH = "#857d78";
export const DIM = "#4d4847";
export const EMBER = "#ff6b29";
export const ICE = "#94d1ff";

export const MARGIN = 96;
export const SAFE_TOP = 230;
export const SAFE_BOTTOM = 330;

/** Display serif: Bodoni MT (installed on Windows) with Bodoni Moda (Google) as the portable fallback. */
export const DISPLAY_STACK = `"Bodoni MT", "Bodoni Moda", "Didot", Georgia, serif`;
/** Labels and body: Inter. The Windows install exposes "Inter 18pt"; the Google Fonts build is the fallback. */
export const BODY_STACK = `"Inter 18pt", "Inter", "Segoe UI", system-ui, sans-serif`;

export type Theme = {
  ink: string;
  bone: string;
  ash: string;
  dim: string;
  ember: string;
  ice: string;
  displayFont: string;
  bodyFont: string;
};

export const DEFAULT_THEME: Theme = {
  ink: INK,
  bone: BONE,
  ash: ASH,
  dim: DIM,
  ember: EMBER,
  ice: ICE,
  displayFont: DISPLAY_STACK,
  bodyFont: BODY_STACK,
};

/** Soft ink halo that keeps type legible over bright tissue. Multiplied text-shadow layers approximate the Python stroke halo. */
export const halo = (ink: string, strength = 1): string =>
  strength <= 0
    ? "none"
    : [
        `0 0 2px ${rgba(ink, 0.55 * strength)}`,
        `0 0 6px ${rgba(ink, 0.45 * strength)}`,
        `0 0 14px ${rgba(ink, 0.35 * strength)}`,
        `0 0 28px ${rgba(ink, 0.25 * strength)}`,
      ].join(", ");

export const rgba = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a.toFixed(3)})`;
};
