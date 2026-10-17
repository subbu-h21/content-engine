/**
 * This video's scene props: what the Props panel shows under `scenes`. Defaults live in src/Root.tsx → DEFAULTS.
 * Build scene schemas from the element schemas in ../lib/elements.
 */
import { z } from "zod";
import { bodySchema, headlineSchema, labelSchema, radius, yPos } from "../lib/elements";

export const scenesSchema = z.object({
  s01: z.object({ bored: headlineSchema, hand: headlineSchema, who: headlineSchema }),
  s02: z.object({ empty: headlineSchema, lock: headlineSchema, search: headlineSchema, searchLabel: labelSchema }),
  s03: z.object({ shortcut: headlineSchema, cueLabel: labelSchema, responseLabel: labelSchema, body: bodySchema }),
  s04: z.object({ notJoy: headlineSchema, relief: headlineSchema, body: bodySchema, ringY: yPos(), ringR: radius() }),
  s05: z.object({ loop: headlineSchema, ringY: yPos(), ringR: radius() }),
  s06: z.object({ scroll: headlineSchema, circuits: headlineSchema, wantLabel: labelSchema, likeLabel: labelSchema, gaugesY: yPos(), body: bodySchema }),
  s07: z.object({ sign: headlineSchema, notice: headlineSchema, end: headlineSchema, countdownY: yPos(), ringY: yPos(), ringR: radius(), title: z.array(z.string()), tagline: z.string(), series: z.string() }),
});
