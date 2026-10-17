/**
 * Everything a human can tweak in Remotion Studio's Props panel is declared here (global parts)
 * and in src/scenes/schema.ts (this video's scenes).
 * Keep it flat and boring: numbers, strings, enums, small objects. Studio turns this into controls.
 */
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { scenesSchema } from "../scenes/schema";

export { headlineSchema, labelSchema, bodySchema, type HeadlineProps, type LabelProps, type BodyProps } from "./elements";

export const reelSchema = z.object({
  plates: z.enum(["final", "draft"]).describe("draft = half-res plates for fast scrubbing"),

  guides: z.object({
    safeAreas: z.boolean(),
    baselines: z.boolean(),
    markers: z.boolean().describe("tracked 3D points with names"),
    cueReadout: z.boolean().describe("current scene, cue and narration line"),
    timecode: z.boolean(),
    captions: z.boolean().describe("burn the narration as captions (review aid)"),
  }),

  theme: z.object({
    ink: zColor(),
    bone: zColor(),
    ash: zColor(),
    dim: zColor(),
    ember: zColor(),
    ice: zColor(),
    displayFont: z.string(),
    bodyFont: z.string(),
  }),

  type: z.object({
    scale: z.number().min(0.6).max(1.4).step(0.02).describe("global headline size multiplier"),
    leading: z.number().min(0.9).max(1.3).step(0.01),
    stagger: z.number().min(0).max(0.3).step(0.01).describe("seconds between words"),
    wordDuration: z.number().min(0.1).max(1.5).step(0.05),
    rise: z.number().min(0).max(60).step(1).describe("px a word rises while fading in"),
    halo: z.number().min(0).max(2).step(0.1).describe("ink halo strength behind type"),
  }),

  look: z.object({
    grain: z.number().min(0).max(0.12).step(0.005),
    vignette: z.number().min(0).max(0.8).step(0.02),
    scrimTop: z.number().min(0).max(1).step(0.02).describe("darkening behind headlines"),
    scrimBottom: z.number().min(0).max(1).step(0.02).describe("darkening behind diagrams"),
  }),

  audio: z.object({
    voice: z.boolean(),
    music: z.boolean(),
    sfx: z.boolean(),
    voiceDb: z.number().min(-24).max(6).step(0.5),
    musicDb: z.number().min(-40).max(0).step(0.5),
    duckDb: z.number().min(-24).max(0).step(0.5).describe("extra music attenuation while the voice speaks"),
    sfxDb: z.number().min(-40).max(0).step(0.5),
  }),

  scenes: scenesSchema,
});

export type ReelProps = z.infer<typeof reelSchema>;
