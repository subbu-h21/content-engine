/**
 * This video's scene props: what the Props panel shows under `scenes`. Defaults live in src/Root.tsx → DEFAULTS.
 * Build scene schemas from the element schemas in ../lib/elements.
 */
import { z } from "zod";
import { headlineSchema } from "../lib/elements";

export const scenesSchema = z.object({
  s01: z.object({ line: headlineSchema }),
});
