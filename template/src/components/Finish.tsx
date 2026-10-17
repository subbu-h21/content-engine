/** Scrims (local darkening behind type), vignette and animated grain. */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useReel } from "../lib/context";
import { rgba } from "../lib/theme";
import { HEIGHT, WIDTH } from "../lib/timing";

export const Scrim: React.FC<{ strength: number; to: number; alpha?: number; bottom?: boolean }> = ({ strength, to, alpha = 1, bottom = false }) => {
  const { theme, look } = useReel();
  const s = strength * alpha * (bottom ? look.scrimBottom : look.scrimTop) * (1 / 0.72);
  if (s <= 0) return null;
  const from = rgba(theme.ink, Math.min(1, s));
  const zero = rgba(theme.ink, 0);
  return (
    <AbsoluteFill
      style={{
        background: bottom ? `linear-gradient(to top, ${from} 0px, ${zero} ${HEIGHT - to}px)` : `linear-gradient(to bottom, ${from} 0px, ${zero} ${to}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

export const Finish: React.FC = () => {
  const { look } = useReel();
  const frame = useCurrentFrame();
  return (
    <>
      {look.vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${look.vignette}) 100%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {look.grain > 0 ? (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: look.grain * 9 }}>
          <svg width={WIDTH} height={HEIGHT}>
            <filter id="grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 251} stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width={WIDTH} height={HEIGHT} filter="url(#grain)" />
          </svg>
        </AbsoluteFill>
      ) : null}
    </>
  );
};
