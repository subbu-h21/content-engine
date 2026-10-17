/** Small type: eyebrows, chapter markers, body copy. Inter, mixed case, light tracking. */
import React from "react";
import { useReel } from "../lib/context";
import { expoOut } from "../lib/motion";
import { MARGIN, SAFE_TOP, halo as haloShadow } from "../lib/theme";
import { WIDTH } from "../lib/timing";

type EyebrowProps = {
  text: string;
  x: number;
  y: number;
  tl: number;
  start?: number;
  size?: number;
  tracking?: number;
  color?: string;
  align?: "left" | "center";
  alpha?: number;
};

export const Eyebrow: React.FC<EyebrowProps> = ({ text, x, y, tl, start = 0, size = 24, tracking = 1.5, color, align = "left", alpha = 1 }) => {
  const { theme, type } = useReel();
  const p = expoOut((tl - start) / 0.5);
  if (p <= 0 || alpha <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y - size * 0.8,
        textAlign: align,
        fontFamily: theme.bodyFont,
        fontSize: size,
        letterSpacing: tracking,
        color: color ?? theme.ash,
        opacity: p * alpha,
        transform: `translateX(${(1 - p) * -10}px)`,
        whiteSpace: "nowrap",
        textShadow: haloShadow(theme.ink, 0.6 * type.halo),
      }}
    >
      {text}
    </div>
  );
};

export const Chapter: React.FC<{ n: number; title: string; tl: number; start?: number; alpha?: number }> = ({ n, title, tl, start = 0.3, alpha = 1 }) => {
  const { theme } = useReel();
  const p = expoOut((tl - start - 0.1) / 0.9);
  return (
    <>
      <Eyebrow text={`${String(n).padStart(2, "0")}  —  ${title}`} x={MARGIN} y={SAFE_TOP} tl={tl} start={start} alpha={alpha} />
      <div
        style={{
          position: "absolute",
          left: MARGIN,
          top: SAFE_TOP + 18,
          width: 140 * p,
          height: 1,
          backgroundColor: theme.bone,
          opacity: 0.22 * alpha,
        }}
      />
    </>
  );
};

export const Body: React.FC<{ text: string; x?: number; y: number; size?: number; tl: number; start?: number; alpha?: number; maxWidth?: number }> = ({
  text,
  x = MARGIN,
  y,
  size = 32,
  tl,
  start = 0,
  alpha = 1,
  maxWidth = WIDTH - 2 * MARGIN,
}) => {
  const { theme, type } = useReel();
  const p = expoOut((tl - start) / 0.5);
  if (p <= 0 || alpha <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - size * 0.8,
        maxWidth,
        fontFamily: theme.bodyFont,
        fontSize: size,
        lineHeight: 1.35,
        color: theme.ash,
        opacity: p * alpha,
        transform: `translateY(${(1 - p) * 10}px)`,
        textShadow: haloShadow(theme.ink, 0.5 * type.halo),
      }}
    >
      {text}
    </div>
  );
};
