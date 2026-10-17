/** Diagram elements: the cue → response → relief ring, gauges, the countdown ring. All SVG + HTML labels. */
import React from "react";
import { useReel } from "../lib/context";
import { clamp } from "../lib/motion";
import { halo as haloShadow } from "../lib/theme";
import { HEIGHT, WIDTH } from "../lib/timing";

const TAU = Math.PI * 2;

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

type RingProps = {
  cx: number;
  cy: number;
  r: number;
  nodes: string[];
  drawFrac?: number;
  signal?: number | null;
  alpha?: number;
  accent?: string;
  highlight?: number | null;
  cut?: number | null;
  ringAlpha?: number;
  labelSize?: number;
};

export const LoopDiagram: React.FC<RingProps> = ({ cx, cy, r, nodes, drawFrac = 1, signal = null, alpha = 1, accent, highlight = null, cut = null, ringAlpha = 0.5, labelSize = 28 }) => {
  const { theme, type } = useReel();
  const acc = accent ?? theme.ember;
  const n = nodes.length;
  const angle = (i: number) => -TAU / 4 + (TAU * i) / n;
  if (alpha <= 0 || drawFrac <= 0) return null;
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {nodes.map((_, i) => {
          let seg = clamp((drawFrac - i / n) * n);
          if (seg <= 0) return null;
          if (cut === i) seg = Math.min(seg, 0.42);
          const a0 = angle(i) + 0.17;
          const a1 = angle(i + 1) - 0.17;
          const ae = a0 + (a1 - a0) * seg;
          return (
            <g key={i}>
              <path d={arcPath(cx, cy, r, a0, ae)} fill="none" stroke={theme.bone} strokeOpacity={ringAlpha * alpha} strokeWidth={1.8} strokeLinecap="round" />
              {cut === i && seg >= 0.42 ? <circle cx={cx + r * Math.cos(ae)} cy={cy + r * Math.sin(ae)} r={3} fill={acc} opacity={alpha} /> : null}
            </g>
          );
        })}
        {nodes.map((_, i) => {
          const vis = clamp((drawFrac - i / n) * n * 2);
          if (vis <= 0) return null;
          const a = angle(i);
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          const hl = highlight === i;
          return (
            <g key={i}>
              {hl ? <circle cx={x} cy={y} r={18} fill={acc} opacity={0.25 * vis * alpha} /> : null}
              <circle cx={x} cy={y} r={hl ? 7 : 5} fill={hl ? acc : theme.bone} opacity={vis * alpha} />
            </g>
          );
        })}
        {signal !== null ? (
          (() => {
            const a = -TAU / 4 + TAU * (((signal % 1) + 1) % 1);
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            return (
              <g>
                <circle cx={x} cy={y} r={26} fill={acc} opacity={0.3 * alpha} />
                <circle cx={x} cy={y} r={7} fill={acc} opacity={alpha} />
              </g>
            );
          })()
        ) : null}
      </svg>
      {nodes.map((label, i) => {
        const vis = clamp((drawFrac - i / n) * n * 2);
        if (vis <= 0) return null;
        const a = angle(i);
        const ox = Math.cos(a);
        const oy = Math.sin(a);
        const x = cx + r * ox + ox * 34;
        const y = cy + r * oy + oy * 34 + oy * labelSize * 0.5;
        const align: "left" | "right" | "center" = Math.abs(ox) < 0.3 ? "center" : ox > 0 ? "left" : "right";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: align === "right" ? undefined : align === "center" ? x - 200 : x,
              right: align === "right" ? WIDTH - x : undefined,
              width: align === "center" ? 400 : undefined,
              textAlign: align,
              top: y - labelSize * 0.5,
              fontFamily: theme.bodyFont,
              fontSize: labelSize,
              letterSpacing: 0.5,
              color: highlight === i ? acc : theme.bone,
              opacity: vis * alpha,
              textShadow: haloShadow(theme.ink, 0.7 * type.halo),
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
};

export const Gauge: React.FC<{ label: string; x: number; y: number; w: number; frac: number; color: string; alpha: number }> = ({ label, x, y, w, frac, color, alpha }) => {
  const { theme, type } = useReel();
  if (alpha <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - 18 - 26 * 0.8,
          fontFamily: theme.bodyFont,
          fontSize: 26,
          letterSpacing: 0.5,
          color: theme.bone,
          opacity: alpha,
          textShadow: haloShadow(theme.ink, 0.6 * type.halo),
        }}
      >
        {label}
      </div>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: 6, backgroundColor: theme.bone, opacity: 0.12 * alpha }} />
      <div style={{ position: "absolute", left: x, top: y, width: w * clamp(frac), height: 6, backgroundColor: color, opacity: alpha }} />
    </>
  );
};

export const Countdown: React.FC<{ cx: number; cy: number; r: number; frac: number; alpha: number; from?: number }> = ({ cx, cy, r, frac, alpha, from = 10 }) => {
  const { theme } = useReel();
  if (alpha <= 0 || frac <= 0) return null;
  const a0 = -TAU / 4;
  const n = Math.max(0, Math.ceil(from - from * frac));
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.bone} strokeOpacity={0.18 * alpha} strokeWidth={2} />
        {frac < 0.999 ? (
          <path d={arcPath(cx, cy, r, a0, a0 + TAU * clamp(frac))} fill="none" stroke={theme.ice} strokeOpacity={0.95 * alpha} strokeWidth={3} strokeLinecap="round" />
        ) : (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.ice} strokeOpacity={0.95 * alpha} strokeWidth={3} />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - 200,
          width: 400,
          top: cy - 92 * 0.5 - 92 * 0.12,
          textAlign: "center",
          fontFamily: theme.displayFont,
          fontSize: 92,
          lineHeight: 1,
          color: theme.bone,
          opacity: alpha,
        }}
      >
        {n}
      </div>
    </>
  );
};
