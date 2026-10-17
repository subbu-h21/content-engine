/** Leader line from a tracked 3D point to a mixed-case label on a quiet ink pill. */
import React from "react";
import { useReel } from "../lib/context";
import { markerAt, type MarkerName } from "../lib/markers";
import { expoOut } from "../lib/motion";
import type { LabelProps } from "../lib/schema";
import { MARGIN, SAFE_BOTTOM, SAFE_TOP, rgba } from "../lib/theme";
import { HEIGHT, WIDTH } from "../lib/timing";

type Props = {
  label: LabelProps;
  marker: MarkerName;
  /** scene-local seconds of the cue; label.offset is added */
  cueAt: number;
  tl: number;
  t: number;
  /** scene-local seconds when it fades (0 = never) */
  until?: number;
  accent?: string;
};

const LABEL_PX_PER_CHAR = 15.5; // Inter 28px average, for keeping the pill inside the margins without measuring

export const Leader: React.FC<Props> = ({ label, marker, cueAt, tl, t, until = 0, accent }) => {
  const { theme } = useReel();
  const start = cueAt + label.offset;
  const p = expoOut((tl - start) / 0.6);
  const out = until > 0 ? 1 - expoOut((tl - until) / 0.35) : 1;
  const a = p * out;
  if (a <= 0) return null;
  const m = markerAt(t, marker);
  const need = label.text.length * LABEL_PX_PER_CHAR + 110;
  let x1 = m.x + label.dx;
  x1 = label.side === "right" ? Math.min(x1, WIDTH - MARGIN - need) : Math.max(x1, MARGIN + need);
  x1 = Math.max(MARGIN, Math.min(WIDTH - MARGIN, x1));
  const y1 = Math.max(SAFE_TOP + 80, Math.min(HEIGHT - SAFE_BOTTOM, m.y + label.dy));
  const reach = Math.min(1, p * 1.6);
  const mx = m.x + (x1 - m.x) * reach;
  const my = m.y + (y1 - m.y) * reach;
  const q = p > 0.55 ? expoOut((p - 0.55) / 0.45) : 0;
  const tick = 40 * q;
  const dir = label.side === "right" ? 1 : -1;
  const size = 28;
  return (
    <>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {accent ? <circle cx={m.x} cy={m.y} r={14} fill={accent} opacity={0.22 * a} /> : null}
        <circle cx={m.x} cy={m.y} r={4} fill={accent ?? theme.bone} opacity={a} />
        <line x1={m.x} y1={m.y} x2={mx} y2={my} stroke={theme.bone} strokeOpacity={0.55 * a} strokeWidth={1.4} strokeLinecap="round" />
        {q > 0 ? <line x1={x1} y1={y1} x2={x1 + dir * tick} y2={y1} stroke={theme.bone} strokeOpacity={0.55 * a} strokeWidth={1.4} strokeLinecap="round" /> : null}
      </svg>
      {q > 0 ? (
        <div
          style={{
            position: "absolute",
            left: label.side === "right" ? x1 + tick + 14 - 16 : undefined,
            right: label.side === "right" ? undefined : WIDTH - (x1 - tick - 14) - 16,
            top: y1 - size * 0.42 - size * 0.5,
            padding: `${size * 0.5}px 16px`,
            borderRadius: 10,
            backgroundColor: rgba(theme.ink, 0.72 * q * out),
            fontFamily: theme.bodyFont,
            fontSize: size,
            letterSpacing: 0.5,
            lineHeight: `${size * 0.84}px`,
            color: theme.bone,
            opacity: q * out,
            whiteSpace: "nowrap",
          }}
        >
          {label.text}
        </div>
      ) : null}
    </>
  );
};
