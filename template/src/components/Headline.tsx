/**
 * Display headline: Bodoni, one colour, *italic* for emphasis, word-by-word rise + fade with expo easing,
 * the font's own word spacing, and an ink halo so it reads over tissue.
 */
import React from "react";
import { useReel } from "../lib/context";
import { expoOut, fadeOutAt } from "../lib/motion";
import type { HeadlineProps } from "../lib/schema";
import { halo as haloShadow } from "../lib/theme";

type Props = {
  block: HeadlineProps;
  /** scene-local seconds of the narration cue this headline belongs to */
  cueAt: number;
  /** scene-local time now */
  tl: number;
};

/** Split "It's a *shortcut.*" into [{text, italic}] word tokens. */
const tokenize = (line: string): { text: string; italic: boolean }[] => {
  const out: { text: string; italic: boolean }[] = [];
  let italic = false;
  for (const part of line.split("*")) {
    for (const w of part.split(/\s+/).filter(Boolean)) out.push({ text: w, italic });
    italic = !italic;
  }
  return out;
};

export const Headline: React.FC<Props> = ({ block, cueAt, tl }) => {
  const { theme, type } = useReel();
  const start = cueAt + block.offset;
  const out = fadeOutAt(tl, block.holdUntil > 0 ? block.holdUntil : undefined);
  if (out <= 0 || tl < start) return null;
  const size = block.size * type.scale;
  let i = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: block.align === "center" ? 0 : block.x,
        right: block.align === "center" ? 0 : undefined,
        top: block.y - size * 0.78,
        textAlign: block.align,
        fontFamily: theme.displayFont,
        fontSize: size,
        lineHeight: `${size * type.leading}px`,
        color: theme.bone,
        whiteSpace: "nowrap",
        textShadow: haloShadow(theme.ink, type.halo),
        fontKerning: "normal",
      }}
    >
      {block.lines.map((line, li) => (
        <div key={li}>
          {tokenize(line).map((w, wi) => {
            const p = expoOut((tl - start - i * type.stagger) / type.wordDuration);
            i += 1;
            const a = p * out;
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    opacity: a,
                    transform: `translateY(${(1 - p) * type.rise}px)`,
                    fontStyle: w.italic ? "italic" : "normal",
                  }}
                >
                  {w.text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
