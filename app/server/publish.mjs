/**
 * Publishing a video (Phase 5). Any video file in a project's out/ folder can be published (the Final render's
 * out/delivery.mp4 first, drafts and other renders too); the Publish page picks one. Per project, in publish/:
 *   youtube.json, facebook.json, instagram.json   the drafts (title/caption…), edited on the Publish page or by Claude
 *   state.json                                    the picked file ("video") and what's happening per platform: YouTube
 *                                                 upload (resumable), Facebook/Instagram reports
 *   history.json                                  every finished upload/post (the Publish page's history)
 * YouTube goes through its API (youtube.mjs), one upload at a time; Facebook Pages and Instagram are posted by Claude in
 * the user's Chrome (Claude in Chrome), which stops before the final Post click so the user confirms it.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { publishDefaults } from "./settings.mjs";
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
const FINAL = "out/delivery.mp4";

// ------------------------------------------------------------------ which video files can be published

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv"]);
const SKIP_DIRS = new Set(["render", "check"]); // out/render = the queue's temp files and logs; out/check = stills

/**
 * Video files in out/ (and one folder below), newest first. kind: "final" (out/delivery.mp4, from the Final render),
 * "master" (out/video.mp4 when there's no delivery file yet: sound not levelled), "draft" (name has "draft"), "render".
 */
export function listVideos(dir) {
  const out = path.join(dir, "out");
  const found = [];
  const walk = (d, depth) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (depth === 0 && !SKIP_DIRS.has(e.name)) walk(full, 1);
      } else if (VIDEO_EXT.has(path.extname(e.name).toLowerCase())) {
        const st = fs.statSync(full);
        if (st.size > 0) found.push({ rel: path.relative(dir, full).replace(/\\/g, "/"), size: st.size, madeAt: new Date(st.mtimeMs).toISOString() });
      }
    }
  };
  walk(out, 0);
  const hasFinal = found.some((f) => f.rel === FINAL);
  return found
    .filter((f) => !(hasFinal && f.rel === "out/video.mp4"))
    .map((f) => ({ ...f, kind: f.rel === FINAL ? "final" : f.rel === "out/video.mp4" ? "master" : /draft/i.test(path.basename(f.rel)) ? "draft" : "render" }))
    .sort((a, b) => (a.kind === "final" ? -1 : b.kind === "final" ? 1 : b.madeAt.localeCompare(a.madeAt)));
}

/** The file picked on the Publish page; if none (or it's gone): the final video, else the newest one. null if none. */
export function selectedVideo(dir) {
  const list = listVideos(dir);
  const picked = getState(dir).video;
  return list.find((f) => f.rel === picked)?.rel ?? list[0]?.rel ?? null;
}

export function selectVideo(dir, rel) {
  if (!listVideos(dir).some((f) => f.rel === rel)) throw new Error(`There's no video ${rel} in this project's out folder.`);
  const s = getState(dir);
  s.video = rel;
  writeJson(pub(dir, "state.json"), s);
  return rel;
}

/** Absolute path of a project video, only for files listVideos offers. */
function videoPath(dir, rel) {
  if (!rel || !listVideos(dir).some((f) => f.rel === rel)) return null;
  return path.join(dir, rel);
}

// ------------------------------------------------------------------ drafts

/** A new video's drafts start from the Settings page's publishing defaults. */
const DEFAULTS = {
  youtube: (m) => {
    const d = publishDefaults().youtube;
    const description = d.descriptionFooter ? `\n\n${d.descriptionFooter}` : "";
    return { title: (m.title ?? "").slice(0, 100), description, tags: [...d.tags], categoryId: d.categoryId, privacy: d.privacy, publishAt: null, madeForKids: d.madeForKids, synthetic: false };
  },
  // Reel or post is chosen on the Publish page each time (no default)
  facebook: () => {
    const d = publishDefaults();
    return { page: d.facebookPage, format: null, caption: d.captionFooter ? `\n\n${d.captionFooter}` : "" };
  },
  instagram: () => {
    const d = publishDefaults();
    return { account: d.instagramAccount, format: null, caption: d.captionFooter ? `\n\n${d.captionFooter}` : "" };
  },
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
    if (!["reel", "post"].includes(d.format)) p.push("Choose Reel or post.");
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
  if (platform !== "youtube" && !["reel", "post"].includes(next.format)) next.format = null;
  if (platform === "youtube" && typeof next.tags === "string") next.tags = next.tags.split(",").map((t) => t.trim()).filter(Boolean);
  writeJson(pub(dir, `${platform}.json`), next);
  return next;
}

// ------------------------------------------------------------------ the video and format checks

/** ffprobe facts, cached per file version (path + size + mtime): the Publish page asks every few seconds. */
const probes = new Map();
function probe(file) {
  const st = fs.statSync(file);
  const key = `${file}|${st.size}|${st.mtimeMs}`;
  if (probes.has(key)) return probes.get(key);
  const p = new Promise((resolve) => {
    execFile("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration,size", "-of", "json", file], (err, out) => {
      try {
        const j = JSON.parse(out);
        resolve({ duration: Number(j.format?.duration ?? 0), size: Number(j.format?.size ?? 0), width: j.streams?.[0]?.width ?? 0, height: j.streams?.[0]?.height ?? 0 });
      } catch {
        probes.delete(key); // a file still being written: try again next time
        resolve(null);
      }
    });
  });
  if (probes.size > 200) probes.clear();
  probes.set(key, p);
  return p;
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

/** Facts about a video file (default: the picked one) and what each platform will make of it. Limits that change often are worded as such. */
export async function videoInfo(dir, rel = selectedVideo(dir)) {
  const file = videoPath(dir, rel);
  if (!file) return { exists: false };
  const st = fs.statSync(file);
  const kind = listVideos(dir).find((f) => f.rel === rel)?.kind ?? "render";
  const p = await probe(file);
  if (!p) return { exists: true, path: file, rel, kind, size: st.size, madeAt: new Date(st.mtimeMs).toISOString(), error: "ffprobe couldn't read the video" };
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
    rel,
    kind,
    size: st.size,
    madeAt: new Date(st.mtimeMs).toISOString(),
    duration: p.duration,
    width: p.width,
    height: p.height,
    vertical,
    renderedByQueue: kind === "final" && job?.status === "done",
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

// ------------------------------------------------------------------ history (finished uploads and posts)

export function getHistory(dir) {
  const h = readJson(pub(dir, "history.json"), []);
  return Array.isArray(h) ? h : [];
}
/** Add or update (same id) a history entry. */
function recordHistory(dir, entry) {
  const h = getHistory(dir);
  const i = h.findIndex((e) => e.id === entry.id);
  if (i >= 0) h[i] = { ...h[i], ...entry };
  else h.push(entry);
  writeJson(pub(dir, "history.json"), h);
}
function forgetHistory(dir, id) {
  if (!id) return;
  writeJson(pub(dir, "history.json"), getHistory(dir).filter((e) => e.id !== id));
}

/**
 * Facebook/Instagram results, reported by Claude (MCP publish_report) or the user ("Mark as posted"); "handed" is set
 * by the engine with the file it handed over. "none" = Reset: forget the platform's current result (and its history
 * entry; nothing changes on the platform itself).
 */
export function report(dir, platform, { status, url = null, note = null, file = null }) {
  if (!["facebook", "instagram", "youtube"].includes(platform)) throw new Error(`Unknown platform ${platform}`);
  if (!["posted", "ready-to-post", "failed", "handed", "none"].includes(status)) throw new Error(`Unknown status ${status}`);
  const cur = getState(dir)[platform] ?? {};
  if (status === "none") {
    if (platform === "youtube" && ["queued", "uploading"].includes(cur.status)) throw new Error("Stop the upload first.");
    forgetHistory(dir, cur.historyId);
    const s = getState(dir);
    delete s[platform];
    writeJson(pub(dir, "state.json"), s);
    return {};
  }
  if (platform === "youtube") throw new Error("YouTube's status comes from the upload itself.");
  if (status === "handed") {
    // a new hand-off starts a new post: the previous one stays in the history
    return setState(dir, platform, { status, url: null, note: null, historyId: null, file: file ?? selectedVideo(dir), format: getDraft(dir, platform).format, reportedAt: now() });
  }
  const patch = { status, url, note, reportedAt: now() };
  if (status === "posted") {
    const id = cur.status === "posted" && cur.historyId ? cur.historyId : `${platform}-${Date.now()}`;
    const file2 = cur.file ?? selectedVideo(dir);
    const format = cur.format ?? getDraft(dir, platform).format;
    recordHistory(dir, { id, platform, file: file2, format, url: url ?? (cur.status === "posted" ? cur.url : null), at: cur.status === "posted" ? cur.reportedAt : patch.reportedAt });
    Object.assign(patch, { historyId: id, file: file2, format });
    if (!url && cur.status === "posted") patch.url = cur.url;
  } else {
    patch.historyId = null;
  }
  return setState(dir, platform, patch);
}

// ------------------------------------------------------------------ YouTube upload queue

const uploads = new Map(); // name -> { dir, stopping, live }
const queue = [];
let active = null;

export function youtubeLive(name) {
  const u = uploads.get(name);
  return u ? { ...u.live, queuePosition: queue.indexOf(name) + 1 || null } : null;
}

/** again: upload a file that's already on YouTube once more (the user confirmed a second copy). */
export async function startYouTube(name, dir, { again = false } = {}) {
  const yt = youtubeStatus();
  if (!yt.connected) throw new Error("YouTube isn't connected: connect it in Settings → YouTube.");
  const rel = selectedVideo(dir);
  const info = await videoInfo(dir, rel);
  if (!info.exists) throw new Error("This video has no exported file yet: render it on its Final tab first.");
  const d = getDraft(dir, "youtube");
  const problems = draftProblems("youtube", d);
  if (problems.length) throw new Error(problems.join(" "));
  const s = getState(dir).youtube ?? {};
  if (["queued", "uploading"].includes(s.status)) throw new Error(`This video is already uploading (${s.file ?? FINAL}).`);
  const mtime = Math.round(fs.statSync(info.path).mtimeMs);
  const sameFile = (s.file ?? FINAL) === rel;
  // this exact file (same path, unchanged since) uploaded before, by the latest upload or an earlier one in the history
  const earlier =
    getHistory(dir).find((e) => e.platform === "youtube" && e.file === rel && e.mtime === mtime) ??
    (s.status === "done" && s.result?.id && sameFile && s.uploadedFile?.mtime === mtime ? { url: s.result.url } : null);
  if (earlier && !again) {
    const e = new Error(`This file is already on YouTube (${earlier.url}). Uploading it again makes a second video.`);
    e.duplicate = earlier.url;
    throw e;
  }
  // a stopped/interrupted upload resumes only for the same file (upload() also checks it hasn't changed since);
  // a different file starts a new upload
  const resumable = sameFile && s.status !== "done";
  setState(dir, "youtube", {
    status: "queued",
    error: null,
    queuedAt: now(),
    file: rel,
    ...(resumable ? {} : { upload: null, progress: null, startedAt: null }),
    ...(s.status === "done" ? { result: null, historyId: null } : {}),
  });
  uploads.set(name, { dir, rel, stopping: false, live: {} });
  if (!queue.includes(name)) queue.push(name);
  kick();
  return getState(dir).youtube;
}

export function stopYouTube(name, dir) {
  const qi = queue.indexOf(name);
  if (qi >= 0) {
    // still waiting in the queue: nothing is running for it
    queue.splice(qi, 1);
    uploads.delete(name);
  }
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
  const logFile = pub(dir, "youtube.log");
  const log = (m) => fs.appendFileSync(logFile, `[${now()}] ${m}\n`);
  const file = videoPath(dir, u.rel);
  // a Resume right after Stop replaces this upload's entry: only remove our own
  const forget = () => uploads.get(name) === u && uploads.delete(name);
  if (!file) {
    log(`failed: ${u.rel} is gone`);
    setState(dir, "youtube", { status: "failed", error: `The file ${u.rel} isn't there any more.`, retryable: false, endedAt: now() });
    forget();
    return;
  }
  const d = getDraft(dir, "youtube");
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
  log(`upload of ${u.rel} (${st.size} bytes) as ${metadata.status.privacyStatus}${metadata.status.publishAt ? `, publishing at ${metadata.status.publishAt}` : ""}`);
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
    const id = `youtube-${Date.now()}`;
    const endedAt = now();
    recordHistory(dir, { id, platform: "youtube", file: u.rel, size: st.size, mtime: Math.round(st.mtimeMs), url: result.url, studio: result.studio, privacy: result.privacy, at: endedAt });
    setState(dir, "youtube", { status: "done", result, progress: { sent: st.size, total: st.size }, endedAt, uploadedFile: { size: st.size, mtime: Math.round(st.mtimeMs) }, upload: null, historyId: id });
  } catch (e) {
    log(`failed: ${e.message}`);
    setState(dir, "youtube", { status: "failed", error: e.message, retryable: e instanceof YouTubeError ? e.retry : true, endedAt: now() });
    hooks.onFailure?.(name, dir, e.message).catch?.(() => undefined);
  } finally {
    forget();
  }
}

// ------------------------------------------------------------------ Facebook / Instagram through Claude in Chrome

export function handoffMessage(dir, platform, rel) {
  const d = getDraft(dir, platform);
  const video = path.join(dir, rel);
  const where = platform === "facebook" ? `the Facebook Page ${d.page}` : `the Instagram account ${d.account}`;
  const kind = d.format === "reel" ? "a Reel" : platform === "facebook" ? "a video post" : "a feed post";
  return [
    `[content engine] Please post this video to ${where} as ${kind}, using Claude in Chrome (my logged-in Chrome profile).`,
    `Video: ${video}. Caption: the "caption" field of publish/${platform}.json (use it exactly).`,
    "Steps: open a new tab, go to the Page/account, start a new " + (d.format === "reel" ? "Reel" : "post") + ", attach the video, paste the caption, keep the defaults otherwise.",
    `If your browser tools can't attach a file from my disk, stop at that step and ask me to add it: in the upload box's file picker I paste the path (the Publish page's "Copy file path" button copies ${video}) and press Enter. Then continue.`,
    `Stop before the final Post/Share/Publish button: call publish_report with platform "${platform}" and status "ready-to-post", then tell me it's ready and let me click it. Never click it yourself.`,
    "If a login, checkpoint or security prompt appears, stop and ask me: never enter passwords or codes.",
    `After I've posted, find the post's link if you can and call publish_report with platform "${platform}", status "posted" and the url (or status "failed" with a short note if it couldn't be done).`,
    "If your browser tools aren't available in this session, tell me to check that the Claude in Chrome extension is installed, signed in and on in Chrome.",
  ].join(" ");
}

/** What was published from this project (history) and what's under way now, for the Publish page's history. */
export function activity(dir) {
  const rows = getHistory(dir).map((e) => ({ studio: null, privacy: null, format: null, error: null, ...e, status: e.platform === "youtube" ? "done" : "posted" }));
  const s = getState(dir);
  for (const p of PLATFORMS) {
    const st = s[p];
    if (!st?.status) continue;
    const finished = ["done", "posted"].includes(st.status);
    if (finished && st.historyId) continue; // already in the history
    rows.push({
      id: `${p}-${finished ? "earlier" : "now"}`,
      platform: p,
      file: st.file ?? FINAL, // results from before files could be picked were always the final video
      status: st.status,
      url: st.result?.url ?? st.url ?? null,
      studio: st.result?.studio ?? null,
      privacy: st.result?.privacy ?? null,
      format: st.format ?? (p === "youtube" ? null : getDraft(dir, p).format),
      at: st.endedAt ?? st.reportedAt ?? st.updatedAt ?? null,
      error: st.error ?? st.note ?? null,
    });
  }
  return rows;
}

export function publishSummary(dir) {
  const s = getState(dir);
  const out = {};
  for (const p of PLATFORMS) if (s[p]?.status) out[p] = s[p].status;
  return Object.keys(out).length ? out : null;
}
