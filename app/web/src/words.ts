/** The status words every page uses, so a video's state reads the same on Videos, Brief, Final, Publish and History. */

export type PlatformId = "youtube" | "facebook" | "instagram";
export const PLATFORM_NAME: Record<PlatformId, string> = { youtube: "YouTube", facebook: "Facebook", instagram: "Instagram" };

/** Where a video is in its brief (brief/status.json stage). */
export const STAGE_WORD: Record<string, string> = {
  new: "Starting",
  talking: "Talking it through",
  "awaiting-approval": "Waiting for your OK",
  building: "Building the preview",
  "preview-ready": "Preview ready",
  "final-ready": "Final video ready",
  none: "No brief",
};

/** A platform's publishing status (publish/state.json), short enough for a badge. */
export function publishWord(platform: PlatformId, status: string): string {
  if (platform === "youtube")
    return (
      { done: "uploaded", uploading: "uploading", queued: "waiting to upload", stopped: "upload stopped", interrupted: "upload interrupted", failed: "upload stopped by an error" }[status] ?? status
    );
  return { handed: "with Claude", "ready-to-post": "ready: click Post in Chrome", posted: "posted", failed: "not posted" }[status] ?? status;
}
/** Statuses where something stopped (shown as a warning). */
export const publishNeedsYou = (status: string) => ["failed", "interrupted", "stopped"].includes(status);
