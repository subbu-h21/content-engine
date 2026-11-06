/**
 * Remotion's bundle() copies a video's public/ folder into the system's temp folder. The engine's scripts delete theirs
 * when they finish, but a final render that's stopped is killed before it can clean up, and with 3D plates that one copy
 * can be gigabytes. C: is on the small side, so the engine sweeps up after itself.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PREFIX = "remotion-webpack-bundle-";
const WEEK = 7 * 24 * 60 * 60 * 1000;

/** Remove Remotion's build copies older than a week, and nothing else. Returns how many went. */
export async function removeOldBundles({ dir = os.tmpdir(), olderThan = WEEK, now = Date.now() } = {}) {
  let removed = 0;
  for (const e of await fs.promises.readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith(PREFIX)) continue;
    const full = path.join(dir, e.name);
    try {
      if (now - (await fs.promises.stat(full)).mtimeMs < olderThan) continue;
      await fs.promises.rm(full, { recursive: true, force: true });
      removed++;
    } catch {
      // in use, or already gone: the next sweep gets it
    }
  }
  return removed;
}
