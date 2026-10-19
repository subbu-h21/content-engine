/**
 * Publishing a finished video (Phase 5). Per project, in publish/:
 *   youtube.json, facebook.json, instagram.json   the drafts (title/caption…), edited on the Publish tab or by Claude
 *   state.json                                    what happened: YouTube upload (resumable), Facebook/Instagram reports
 * YouTube goes through its API (youtube.mjs), one upload at a time; Facebook Pages and Instagram are posted by Claude in
 * the user's Chrome (Claude in Chrome), which stops before the final Post click so the user confirms it.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadSettings, saveSettings } from "../../cli/projects.mjs";
import { upload, YouTubeError, status as youtubeStatus } from "./youtube.mjs";

const PLATFORMS = ["youtube", "facebook", "instagram"];
const readJson = (f, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const writeJson = (f, o) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f + ".tmp", JSON.stringify(o, null, 1));
  fs.renameSync(f + ".tmp", f);
};
const now = () => new Date().toISOString();
const pub = (dir, f) => path.join(dir, "publish", f);
const VIDEO = "out/delivery.mp4";

// ------------------------------------------------------------------ drafts

const DEFAULTS = {
  youtube: (m) => ({ title: (m.title ?? "").slice(0, 100), description: "", tags: [], categoryId: "27", privacy: "private", publishAt: null, madeForKids: null, synthetic: false }),
  facebook: () => ({ page: loadSettings().publish?.facebookPage ?? "", format: "reel", caption: "" }),
  instagram: () => ({ account: loadSettings().publish?.instagramAccount ?? "", format: "reel", caption: "" }),
};

export function getDraft(dir, platform) {
  const m = readJson(path.join(dir, "project.json"), {});
  return { ...DEFAULTS[platform](m), ...(readJson(pub(dir, `${platform}.json`), {}) ?? {}) };
}

/** Problems with a draft, in plain words (empty = fine). */
export function draftProblems(platform, d) {
  const p = [];
  if (platform === "youtube") {
    if (!d.title?.trim()) p.push("The title is empty.");
    if ((d.title ?? "").length > 100) p.push(`The title is ${d.title.length} characters; YouTube allows 100.`);
    if (/[<>]/.test(d.title ?? "") || /[<>]/.test(d.description ?? "")) p.push("YouTube doesn't allow < or > in the title or description.");
    if (Buffer.byteLength(d.description ?? "") > 5000) p.push("The description is longer than YouTube's 5000 bytes.");
    if ((d.tags ?? []).join(",").length > 500) p.push("The tags add up to more than YouTube's 500 characters.");
    if (d.madeForKids == null) p.push('Choose whether the video is "made for kids" (YouTube requires the answer).');
    if (d.privacy === "scheduled") {
      const t = Date.parse(d.publishAt ?? "");
      if (!t) p.push("Pick the date and time to publish.");
      else if (t < Date.now() + 15 * 60 * 1000) p.push("The scheduled time must be at least 15 minutes from now.");
    }
  } else {
    if (!d.caption?.trim()) p.push("The caption is empty.");
    if (platform === "facebook" && !d.page?.trim()) p.push("Which Facebook Page? Paste its link.");
    if (platform === "instagram" && !d.account?.trim()) p.push("Which Instagram account? Enter its @handle.");
    if (platform === "instagram" && (d.caption ?? "").length > 2200) p.push("Instagram captions are limited to 2,200 characters.");
    if (platform === "instagram" && ((d.caption ?? "").match(/#\w+/g) ?? []).length > 30) p.push("Instagram allows at most 30 hashtags.");
  }
  return p;
}

export function saveDraft(dir, platform, patch) {
  if (!PLATFORMS.includes(platform)) throw new Error(`Unknown platform ${platform}`);
  const cur = getDraft(dir, platform);
  const allowed = Object.keys(DEFAULTS[platform]({}));
  const next = { ...cur };
  for (const k of allowed) if (k in patch) next[k] = patch[k];
  if (platform === "youtube" && typeof next.tags === "string") next.tags = next.tags.split(",").map((t) => t.trim()).filter(Boolean);
  writeJson(pub(dir, `${platform}.json`), next);
  // remember the Page / account for the next video
  if (platform === "facebook" && next.page) saveSettings({ publish: { ...(loadSettings().publish ?? {}), facebookPage: next.page } });
  if (platform === "instagram" && next.account) saveSettings({ publish: { ...(loadSettings().publish ?? {}), instagramAccount: next.account } });
  return next;
}

// ------------------------------------------------------------------ the video and format checks

function probe(file) {
  return new Promise((resolve) => {
    execFile("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration,size", "-of", "json", file], (err, out) => {
      try {
        const j = JSON.parse(out);
        resolve({ duration: Number(j.format?.duration ?? 0), size: Number(j.format?.size ?? 0), width: j.streams?.[0]?.width ?? 0, height: j.streams?.[0]?.height ?? 0 });
      } catch {
        resolve(null);
      }
    });
  });
}

/** Newest change to anything that ends up in the video (scenes, props, data, audio, plates). */
function newestSourceChange(dir) {
  let newest = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else newest = Math.max(newest, fs.statSync(full).mtimeMs);
    }
  };
  walk(path.join(dir, "src"));
  walk(path.join(dir, "public"));
  return newest;
}

/** Facts about out/delivery.mp4 and what each platform will make of it. Limits that change often are worded as such. */
export async function videoInfo(dir) {
  const file = path.join(dir, VIDEO);
  if (!fs.existsSync(file)) return { exists: false };
  const st = fs.statSync(file);
  const p = await probe(file);
  if (!p) return { exists: true, error: "ffprobe couldn't read the video" };
  const vertical = p.height > p.width;
  const job = readJson(path.join(dir, "out", "render", "job.json"), null);
  const changedAfter = newestSourceChange(dir) > st.mtimeMs + 2000;
  const notes = { youtube: [], facebook: [], instagram: [] };
  if (vertical && p.duration <= 180) notes.youtube.push("Vertical and up to 3 minutes: YouTube shows it as a Short.");
  if (p.duration > 15 * 60) notes.youtube.push("Over 15 minutes: the channel must be verified (phone) to upload it.");
  if (!vertical) {
    notes.facebook.push("Horizontal: fine as a video post; Reels are vertical.");
    notes.instagram.push("Horizontal: Instagram Reels are vertical; it would be cropped or letterboxed.");
  }
  if (p.duration > 90) notes.facebook.push(`${Math.round(p.duration)} s long: Facebook Reels have been limited to about 90 s (Meta changes this); longer goes up as a video post.`);
  if (p.duration > 180) notes.instagram.push(`${Math.round(p.duration)} s long: Instagram Reels are limited to about 3 minutes (Meta changes this); longer goes up as a video post.`);
  return {
    exists: true,
    path: file,
    rel: VIDEO,
    size: st.size,
    madeAt: new Date(st.mtimeMs).toISOString(),
    duration: p.duration,
    width: p.width,
    height: p.height,
    vertical,
    renderedByQueue: job?.status === "done",
    changedAfter,
    notes,
  };
}

// ------------------------------------------------------------------ state

export function getState(dir) {
  return readJson(pub(dir, "state.json"), {}) ?? {};
}
function setState(dir, platform, patch) {
  const s = getState(dir);
  s[platform] = { ...(s[platform] ?? {}), ...patch, updatedAt: now() };
  writeJson(pub(dir, "state.json"), s);
  return s[platform];
}

/** Facebook/Instagram results, reported by Claude (MCP publish_report) or the user ("Mark as posted"). */
export function report(dir, platform, { status, url = null, note = null }) {
  if (!["facebook", "instagram", "youtube"].includes(platform)) throw new Error(`Unknown platform ${platform}`);
  if (!["posted", "ready-to-post", "failed", "handed"].includes(status)) throw new Error(`Unknown status ${status}`);
  return setState(dir, platform, { status, url, note, reportedAt: now() });
}

// ------------------------------------------------------------------ YouTube upload queue

const uploads = new Map(); // name -> { dir, stopping, live }
const queue = [];
let active = null;

export function youtubeLive(name) {
  const u = uploads.get(name);
  return u ? { ...u.live, queuePosition: queue.indexOf(name) + 1 || null } : null;
}

export async function startYouTube(name, dir) {
  const yt = youtubeStatus();
  if (!yt.connected) throw new Error("YouTube isn't connected: connect it under Connected accounts on the home page.");
  const info = await videoInfo(dir);
  if (!info.exists) throw new Error("There's no final video yet (out/delivery.mp4): render it on the Final tab first.");
  const d = getDraft(dir, "youtube");
  const problems = draftProblems("youtube", d);
  if (problems.length) throw new Error(problems.join(" "));
  const s = getState(dir).youtube ?? {};
  if (["queued", "uploading"].includes(s.status)) throw new Error("This video is already uploading.");
  if (s.status === "done" && s.result?.id && s.uploadedFile?.mtime === Math.round(fs.statSync(info.path).mtimeMs))
    throw new Error(`This video is already on YouTube (${s.result.url}). Render a new version first, or change it in YouTube Studio.`);
  setState(dir, "youtube", { status: "queued", error: null, queuedAt: now(), progress: null, ...(s.status === "done" ? { upload: null, result: null } : {}) });
  uploads.set(name, { dir, stopping: false, live: {} });
  if (!queue.includes(name)) queue.push(name);
  kick();
  return getState(dir).youtube;
}

export function stopYouTube(name, dir) {
  const qi = queue.indexOf(name);
  if (qi >= 0) queue.splice(qi, 1);
  const u = uploads.get(name);
  if (u) u.stopping = true;
  const s = getState(dir).youtube ?? {};
  if (["queued", "uploading"].includes(s.status)) setState(dir, "youtube", { status: "stopped", error: null });
  return getState(dir).youtube;
}

/** On engine start: an upload that was running is "interrupted" (Resume continues it in the same YouTube session). */
export function recoverUploads(projects) {
  for (const p of projects) {
    const s = readJson(pub(p.dir, "state.json"), null);
    if (s?.youtube && ["queued", "uploading"].includes(s.youtube.status)) {
      s.youtube.status = "interrupted";
      s.youtube.error = "The engine stopped during the upload. Resume continues where YouTube says it stopped.";
      writeJson(pub(p.dir, "state.json"), s);
    }
  }
}

let hooks = { onFailure: null };
export function setPublishHooks(h) {
  hooks = { ...hooks, ...h };
}

function kick() {
  if (active || !queue.length) return;
  const name = queue.shift();
  const u = uploads.get(name);
  if (!u) return kick();
  active = name;
  runUpload(name, u)
    .catch(() => undefined)
    .finally(() => {
      active = null;
      kick();
    });
}

async function runUpload(name, u) {
  const dir = u.dir;
  const file = path.join(dir, VIDEO);
  const d = getDraft(dir, "youtube");
  const logFile = pub(dir, "youtube.log");
  const log = (m) => fs.appendFileSync(logFile, `[${now()}] ${m}\n`);
  const state = getState(dir).youtube ?? {};
  const up = state.upload ?? {};
  const st = fs.statSync(file);
  setState(dir, "youtube", { status: "uploading", startedAt: state.startedAt ?? now(), error: null });
  const metadata = {
    snippet: { title: d.title.trim(), description: d.description ?? "", tags: d.tags ?? [], categoryId: String(d.categoryId || "27") },
    status: {
      privacyStatus: d.privacy === "scheduled" ? "private" : d.privacy,
      selfDeclaredMadeForKids: !!d.madeForKids,
      containsSyntheticMedia: !!d.synthetic,
      ...(d.privacy === "scheduled" ? { publishAt: new Date(d.publishAt).toISOString() } : {}),
    },
  };
  log(`upload of ${VIDEO} (${st.size} bytes) as ${metadata.status.privacyStatus}${metadata.status.publishAt ? `, publishing at ${metadata.status.publishAt}` : ""}`);
  let lastSave = 0;
  try {
    const result = await upload({
      file,
      metadata,
      state: up,
      save: () => setState(dir, "youtube", { upload: up }),
      log,
      shouldStop: () => u.stopping,
      onProgress: (sent, total) => {
        u.live = { sent, total };
        if (Date.now() - lastSave > 5000) {
          lastSave = Date.now();
          setState(dir, "youtube", { progress: { sent, total } });
        }
      },
    });
    if (!result) {
      log("stopped by the user");
      return;
    }
    log(`done: ${result.url}`);
    setState(dir, "youtube", { status: "done", result, progress: { sent: st.size, total: st.size }, endedAt: now(), uploadedFile: { size: st.size, mtime: Math.round(st.mtimeMs) }, upload: null });
  } catch (e) {
    log(`failed: ${e.message}`);
    setState(dir, "youtube", { status: "failed", error: e.message, retryable: e instanceof YouTubeError ? e.retry : true, endedAt: now() });
    hooks.onFailure?.(name, dir, e.message).catch?.(() => undefined);
  } finally {
    uploads.delete(name);
  }
}

// ------------------------------------------------------------------ Facebook / Instagram through Claude in Chrome

export function handoffMessage(dir, platform) {
  const d = getDraft(dir, platform);
  const video = path.join(dir, VIDEO);
  const where = platform === "facebook" ? `the Facebook Page ${d.page}` : `the Instagram account ${d.account}`;
  const kind = d.format === "reel" ? "a Reel" : platform === "facebook" ? "a video post" : "a feed post";
  return [
    `[content engine] Please post this video to ${where} as ${kind}, using Claude in Chrome (my logged-in Chrome profile).`,
    `Video: ${video}. Caption: the "caption" field of publish/${platform}.json (use it exactly).`,
    "Steps: open a new tab, go to the Page/account, start a new " + (d.format === "reel" ? "Reel" : "post") + ", attach the video, paste the caption, keep the defaults otherwise.",
    `If your browser tools can't attach a file from my disk, stop at that step and ask me to drag ${video} into the upload box (the Publish tab's "Show the video in its folder" button opens it), then continue.`,
    `Stop before the final Post/Share/Publish button: call publish_report with platform "${platform}" and status "ready-to-post", then tell me it's ready and let me click it. Never click it yourself.`,
    "If a login, checkpoint or security prompt appears, stop and ask me: never enter passwords or codes.",
    `After I've posted, find the post's link if you can and call publish_report with platform "${platform}", status "posted" and the url (or status "failed" with a short note if it couldn't be done).`,
    "If your browser tools aren't available in this session, tell me to turn them on with /chrome.",
  ].join(" ");
}

export function publishSummary(dir) {
  const s = getState(dir);
  const out = {};
  for (const p of PLATFORMS) if (s[p]?.status) out[p] = s[p].status;
  return Object.keys(out).length ? out : null;
}
