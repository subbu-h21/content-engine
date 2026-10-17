/**
 * Schemas for the reusable on-screen elements. Scene schemas (src/scenes/schema.ts) are built from these.
 *
 * Conventions
 *  - times are seconds, relative to the narration cue the element belongs to (offset 0 = on the cue)
 *  - positions are pixels in the frame (see project.json → format)
 *  - headline lines use *asterisks* for italic emphasis
 */
import { z } from "zod";

export const headlineSchema = z.object({
  lines: z.array(z.string()).describe("One entry per line; *word* = italic"),
  size: z.number().min(40).max(220).step(2),
  x: z.number().min(0).max(1080).step(2),
  y: z.number().min(0).max(1920).step(2),
  align: z.enum(["left", "center"]),
  offset: z.number().min(-3).max(6).step(0.05).describe("seconds after the cue"),
  holdUntil: z.number().min(0).max(20).step(0.05).describe("scene-local seconds when it starts fading out (0 = never)"),
});
export type HeadlineProps = z.infer<typeof headlineSchema>;

export const labelSchema = z.object({
  text: z.string(),
  dx: z.number().min(-600).max(600).step(2).describe("label offset from the tracked 3D point"),
  dy: z.number().min(-600).max(600).step(2),
  side: z.enum(["left", "right"]),
  offset: z.number().min(-3).max(6).step(0.05),
});
export type LabelProps = z.infer<typeof labelSchema>;

export const bodySchema = z.object({
  text: z.string(),
  y: z.number().min(0).max(1920).step(2),
  size: z.number().min(20).max(60).step(1),
  offset: z.number().min(-3).max(8).step(0.05),
});
export type BodyProps = z.infer<typeof bodySchema>;

/** A vertical position slider (ring centres, gauge rows…). */
export const yPos = () => z.number().min(600).max(1800).step(2);
/** A radius slider. */
export const radius = () => z.number().min(60).max(300).step(2);
