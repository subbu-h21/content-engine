/**
 * Publishing a video (Phase 5). Any video file in a project's out/ folder can be published (the Final render's
 * out/delivery.mp4 first, drafts and other renders too); the Publish page picks one. Per project, in publish/:
 *   youtube.json, facebook.json, instagram.json   the drafts (title/caption…), edited on the Publish page or by Claude
 *   state.json                                    the picked file ("video") and what's happening per platform: YouTube
 *                                                 upload (resumable), Facebook/Instagram reports
 *   history.json                                  every finished upload/post (the Publish page's history)
 * YouTube goes through its API (youtube.mjs), one upload at a time. Facebook Pages and Instagram go through Meta's API
 * (meta.mjs) when connected, one post at a time; otherwise (or as a backup) Claude posts them in the user's Chrome
 * (Claude in Chrome) and stops before the final Post click so the user confirms it. A platform's state.json entry with
 * route "api" is an API post; without it, the Chrome hand-off's reports.
 */
import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { MetaError, status as metaStatus, pageById, pageOfInstagram, postFacebookReel, postFacebookVideo, postInstagramReel } from "./meta.mjs";
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
/** An API post (Facebook/Instagram) that is still under way. */
export const API_ACTIVE = ["queued", "uploading", "processing", "publishing"];

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
  // Reel or post is chosen on the Publish page each time (no default). page/account: the Chrome hand-off's target;
  // pageId/igId: the connected Page / Instagram account the API posts to (null = the default one, see accountFor)
  facebook: () => {
    const d = publishDefaults();
    return { page: d.facebookPage, pageId: null, format: null, title: "", caption: d.captionFooter ? `\n\n${d.captionFooter}` : "" };
  },
  instagram: () => {
    const d = publishDefaults();
    return { account: d.instagramAccount, igId: null, format: null, shareToFeed: true, caption: d.captionFooter ? `\n\n${d.captionFooter}` : "" };
  },
};

export function getDraft(dir, platform) {
  const m = readJson(path.join(dir, "project.json"), {});
  return { ...DEFAULTS[platform](m), ...(readJson(pub(dir, `${platform}.json`), {}) ?? {}) };
}

/**
 * The connected account a draft posts to through the API: the one picked on the Publish page, else the one matching
 * Settings' Page link / Instagram handle, else the first. { id, name, page } or null.
 */
export function accountFor(platform, d) {
  const pages = metaStatus().pages;
  if (platform === "facebook") {
    const norm = (s) => String(s ?? "").toLowerCase().replace(/\/+$/, "");
    const p = pages.find((x) => x.id === d.pageId) ?? pages.find((x) => d.page && norm(x.link) === norm(d.page)) ?? pages[0];
    return p ? { id: p.id, name: p.name, link: p.link } : null;
  }
  const igs = pages.filter((x) => x.instagram).map((x) => ({ id: x.instagram.id, name: x.instagram.username ? `@${x.instagram.username}` : x.instagram.id, pageId: x.id, pageName: x.name }));
  return igs.find((x) => x.id === d.igId) ?? igs.find((x) => d.account && x.name.toLowerCase() === String(d.account).toLowerCase()) ?? igs[0] ?? null;
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

/**
 * Problems before posting through Meta's API (empty = fine): the account, the text, and the limits Meta enforces for
 * the format (Reels: Facebook 3–90 s vertical; Instagram 3 s–15 min, ≤ 300 MB, 23–60 fps). info = videoInfo().
 */
export function apiProblems(platform, d, info) {
  const p = [];
  if (platform !== "facebook" && platform !== "instagram") return p;
  const meta = metaStatus();
  if (!meta.connected) return ["Connect Facebook & Instagram in Settings first."];
  const acc = accountFor(platform, d);
  if (!acc) p.push(platform === "facebook" ? "No Facebook Page is connected: in Settings, connect again and pick your Page." : "No Instagram account is linked to your connected Pages: link it in the Page's settings (Linked accounts), then Test connection in Settings.");
  if (!d.caption?.trim()) p.push("The caption is empty.");
  if (platform === "facebook" && !["reel", "post"].includes(d.format)) p.push("Choose Reel or video post.");
  if (platform === "instagram") {
    if ((d.caption ?? "").length > 2200) p.push("Instagram captions are limited to 2,200 characters.");
    if (((d.caption ?? "").match(/#\w+/g) ?? []).length > 30) p.push("Instagram allows at most 30 hashtags.");
  }
  if (info?.exists && info.duration) {
    const s = Math.round(info.duration);
    if (platform === "facebook" && d.format === "reel") {
      if (info.duration < 3 || info.duration > 90) p.push(`Facebook Reels must be 3–90 seconds; this video is ${s} s (post it as a video post).`);
      if (!info.vertical) p.push("Facebook Reels must be vertical (9:16); this video is horizontal (post it as a video post).");
      if (info.fps && (info.fps < 23.9 || info.fps > 60.1)) p.push(`Facebook Reels need 24–60 frames per second; this video has ${Math.round(info.fps)}.`);
    }
    if (platform === "instagram") {
      if (info.duration < 3 || info.duration > 15 * 60) p.push(`Instagram Reels must be 3 seconds to 15 minutes; this video is ${s} s.`);
      if (info.size > 300 * 1024 * 1024) p.push(`Instagram accepts videos up to 300 MB; this one is ${Math.round(info.size / 1048576)} MB.`);
      if (info.fps && (info.fps < 22.9 || info.fps > 60.1)) p.push(`Instagram needs 23–60 frames per second; this video has ${Math.round(info.fps)}.`);
      if (info.width > 1920) p.push(`Instagram accepts videos up to 1920 pixels wide; this one is ${info.width}.`);
    }
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
  if (platform === "instagram") next.shareToFeed = next.shareToFeed !== false;
  if (platform === "facebook") next.title = String(next.title ?? "").slice(0, 255);
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
    execFile("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,avg_frame_rate:format=duration,size", "-of", "json", file], (err, out) => {
      try {
        const j = JSON.parse(out);
        const [num, den] = String(j.streams?.[0]?.avg_frame_rate ?? "0/1").split("/").map(Number);
        resolve({ duration: Number(j.format?.duration ?? 0), size: Number(j.format?.size ?? 0), width: j.streams?.[0]?.width ?? 0, height: j.streams?.[0]?.height ?? 0, fps: den ? num / den : 0 });
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
  const thumbnails = path.join(dir, "src", "thumbnails"); // made after the render, and not part of the video
  const walk = (d) => {
    if (!fs.existsSync(d) || d === thumbnails) return;
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
  if (p.duration > 90) notes.facebook.push(`${Math.round(p.duration)} s long: Facebook Reels are limited to 90 s; post it as a video post.`);
  const ig = igPlan(st.size, p.duration, p.width);
  if (ig)
    notes.instagram.push(
      `${Math.round(st.size / 1e6)} MB: posting through Meta's API sends Instagram a lighter copy (about ${Math.round(ig.bytes / 1e6)} MB, ${(ig.kbps / 1000).toFixed(1)} Mbit/s${ig.scale ? ", 720 px wide" : ""}), because its upload fails on bigger files.` +
        (ig.kbps < 1500 ? " For a video this long that's a visible drop in quality: if it matters, post it the other way below." : " Instagram re-compresses Reels to about that anyway."),
    );
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
    fps: p.fps,
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
    if (cur.route === "api" && API_ACTIVE.includes(cur.status)) throw new Error("This is being posted through Meta's API right now: wait until it's done.");
    forgetHistory(dir, cur.historyId);
    const s = getState(dir);
    delete s[platform];
    writeJson(pub(dir, "state.json"), s);
    return {};
  }
  if (platform === "youtube") throw new Error("YouTube's status comes from the upload itself.");
  if (cur.route === "api" && API_ACTIVE.includes(cur.status)) throw new Error("This is being posted through Meta's API right now: wait until it's done.");
  if (status === "handed") {
    // a new hand-off starts a new post: the previous one (an API post too) stays in the history
    return setState(dir, platform, { status, route: undefined, post: undefined, result: undefined, account: undefined, error: undefined, progress: undefined, url: null, note: null, historyId: null, file: file ?? selectedVideo(dir), format: getDraft(dir, platform).format, reportedAt: now() });
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

/** On engine start: an upload or post that was running is "interrupted" (Resume continues it where it stopped). */
export function recoverUploads(projects) {
  for (const p of projects) {
    const s = readJson(pub(p.dir, "state.json"), null);
    if (!s) continue;
    let changed = false;
    if (s.youtube && ["queued", "uploading"].includes(s.youtube.status)) {
      s.youtube.status = "interrupted";
      s.youtube.error = "The engine stopped during the upload. Resume continues where YouTube says it stopped.";
      changed = true;
    }
    for (const pf of ["facebook", "instagram"])
      if (s[pf]?.route === "api" && API_ACTIVE.includes(s[pf].status)) {
        s[pf].status = "interrupted";
        s[pf].error = "The engine stopped while posting. Resume continues where it stopped; nothing is posted twice.";
        changed = true;
      }
    if (changed) writeJson(pub(p.dir, "state.json"), s);
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

// ------------------------------------------------------------------ Facebook / Instagram through Meta's API

const posts = new Map(); // "<name>:<platform>" -> { dir, platform, rel, live }
const postQueue = [];
let postActive = null;

export function metaLive(name, platform) {
  const key = `${name}:${platform}`;
  const p = posts.get(key);
  return p ? { ...p.live, queuePosition: postQueue.indexOf(key) + 1 || null } : null;
}

/** Whether a project has an API post queued or running (delete waits for it). */
export const metaBusy = (dir) => ["facebook", "instagram"].some((pf) => getState(dir)[pf]?.route === "api" && API_ACTIVE.includes(getState(dir)[pf].status));

/**
 * Post the picked file to Facebook or Instagram through Meta's API (queued; one post at a time). A failed or
 * interrupted post of the same file to the same account resumes where it stopped. again: post a file that's already
 * there once more (the user confirmed).
 */
export async function startMeta(name, dir, platform, { again = false } = {}) {
  if (!["facebook", "instagram"].includes(platform)) throw new Error("only Facebook and Instagram post through Meta");
  const rel = selectedVideo(dir);
  const info = await videoInfo(dir, rel);
  if (!info.exists) throw new Error("This video has no exported file yet: render it on its Final tab first.");
  const d = getDraft(dir, platform);
  const problems = apiProblems(platform, d, info);
  if (problems.length) throw new Error(problems.join(" "));
  const acc = accountFor(platform, d);
  const s = getState(dir)[platform] ?? {};
  if (s.route === "api" && API_ACTIVE.includes(s.status)) throw new Error("This video is already being posted there.");
  if (s.status === "handed" || s.status === "ready-to-post") throw new Error("This post is with Claude in Chrome right now: finish or Reset it there first.");
  const mtime = Math.round(fs.statSync(info.path).mtimeMs);
  const format = platform === "instagram" ? "reel" : d.format;
  // same file, same account and format, not finished: continue that post (its upload/IDs are kept)
  const resumable = s.route === "api" && s.status !== "posted" && s.file === rel && s.account?.id === acc.id && s.format === format && s.post?.identity?.mtime === mtime;
  const earlier = getHistory(dir).find((e) => e.platform === platform && e.route === "api" && e.account?.id === acc.id && e.file === rel && e.mtime === mtime && e.format === format);
  if (earlier && !again && !resumable) {
    const e = new Error(`This file is already on ${acc.name} (${earlier.url ?? "posted"}). Posting it again makes a second post.`);
    e.duplicate = earlier.url ?? "posted";
    throw e;
  }
  setState(dir, platform, {
    route: "api",
    status: "queued",
    error: null,
    url: null,
    note: null,
    file: rel,
    format,
    account: { id: acc.id, name: acc.name },
    queuedAt: now(),
    historyId: null,
    result: null,
    ...(resumable ? {} : { post: null, progress: null }),
  });
  const key = `${name}:${platform}`;
  posts.set(key, { dir, platform, rel, live: {} });
  if (!postQueue.includes(key)) postQueue.push(key);
  kickPosts();
  return getState(dir)[platform];
}

function kickPosts() {
  if (postActive || !postQueue.length) return;
  const key = postQueue.shift();
  const p = posts.get(key);
  if (!p) return kickPosts();
  postActive = key;
  runPost(key, p)
    .catch(() => undefined)
    .finally(() => {
      postActive = null;
      kickPosts();
    });
}

// Instagram's upload server gives up ("ProcessingFailedError: Request processing failed") on bigger files, far below
// its documented 300 MB. Tried on 2026-10-22 (real account, 1080x1920 H.264): 3, 9, 12, 28 and 31 MB went through;
// 38, 40 and 60 MB failed every time, whatever the length or bitrate (a 27 MB file failed once while another upload
// ran). Above IG_MAX_BYTES Instagram gets a copy re-encoded to about IG_TARGET_BYTES (it re-compresses every Reel
// anyway); YouTube and Facebook keep the original.
const IG_MAX_BYTES = 24_000_000;
const IG_TARGET_BYTES = 21_000_000;
const IG_AUDIO_KBPS = 128;
/**
 * How Instagram's copy is encoded: null = the file goes as it is; else video kbps (at most 3 Mbit/s), 720 px wide when
 * that's low, and about how big the copy comes out.
 */
function igPlan(size, duration, width) {
  if (!(duration > 0) || size <= IG_MAX_BYTES) return null;
  const kbps = Math.max(300, Math.min(3000, Math.floor((IG_TARGET_BYTES * 8) / duration / 1000) - IG_AUDIO_KBPS));
  return { kbps, scale: kbps < 1500 && width > 720, bytes: Math.round(((kbps + IG_AUDIO_KBPS) * 1000 * duration) / 8) };
}

/** Whether the MP4's index (moov) comes before its media data ("faststart"), as Instagram wants. */
function isFaststart(file) {
  const fd = fs.openSync(file, "r");
  try {
    const head = Buffer.alloc(16);
    let pos = 0;
    for (let i = 0; i < 20; i++) {
      if (fs.readSync(fd, head, 0, 16, pos) < 8) break;
      let size = head.readUInt32BE(0);
      const type = head.toString("latin1", 4, 8);
      if (type === "moov") return true;
      if (type === "mdat") break;
      if (size === 1) size = Number(head.readBigUInt64BE(8));
      if (size < 8) break;
      pos += size;
    }
  } finally {
    fs.closeSync(fd);
  }
  return false;
}

/** ffmpeg in the background (the server keeps answering), reporting how many seconds of the video are done. */
function ffmpeg(args, onTime) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", ["-y", "-loglevel", "error", "-nostats", "-progress", "pipe:1", ...args], { windowsHide: true });
    let err = "";
    proc.stderr.on("data", (d) => (err = (err + d).slice(-2000)));
    proc.stdout.on("data", (d) => {
      const us = /out_time_us=(\d+)/.exec(String(d));
      if (us) onTime?.(Number(us[1]) / 1e6);
    });
    proc.on("error", reject);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg couldn't prepare the video for Instagram: ${err.trim().split("\n").pop() || `exit ${code}`}`))));
  });
}

/**
 * The file Instagram gets: the video itself when it's light enough and faststart, else a copy in publish/.upload/
 * (re-encoded lighter, or only its index moved to the front). The copy is named after the video's version and kept
 * until the post is done, so Resume reuses it.
 */
async function instagramFile(dir, file, identity, log, onPrepare) {
  const facts = await probe(file);
  const duration = facts?.duration ?? 0;
  const heavy = igPlan(identity.size, duration, facts?.width ?? 0);
  if (!heavy && isFaststart(file)) return file;
  const tmp = pub(dir, path.join(".upload", `${path.basename(file, path.extname(file))}-${identity.mtime}-instagram.mp4`));
  if (fs.existsSync(tmp)) return tmp;
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true }); // copies of other versions
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  if (heavy) log(`making a lighter copy for Instagram: ${identity.size} bytes → about ${heavy.bytes} (video ${heavy.kbps} kbit/s${heavy.scale ? ", 720 px wide" : ""})`);
  else log("moving the video's index to the front (faststart) for upload");
  // two-pass would hit the size more exactly but takes twice as long; capped VBR lands within a few percent
  const encode = heavy
    ? [
        ...["-map", "0:v:0", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "medium", "-b:v", `${heavy.kbps}k`, "-maxrate", `${Math.round(heavy.kbps * 1.3)}k`, "-bufsize", `${heavy.kbps * 2}k`],
        ...(heavy.scale ? ["-vf", "scale=720:-2"] : []),
        ...["-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", `${IG_AUDIO_KBPS}k`],
      ]
    : ["-c", "copy"];
  onPrepare(0, duration);
  await ffmpeg(["-i", file, ...encode, "-movflags", "+faststart", tmp + ".part.mp4"], (t) => onPrepare(Math.min(t, duration), duration));
  fs.renameSync(tmp + ".part.mp4", tmp);
  log(`copy ready: ${fs.statSync(tmp).size} bytes`);
  return tmp;
}

async function runPost(key, p) {
  const { dir, platform } = p;
  const name = key.slice(0, key.lastIndexOf(":"));
  const logFile = pub(dir, `${platform}.log`);
  const log = (m) => fs.appendFileSync(logFile, `[${now()}] ${m}\n`);
  const forget = () => posts.get(key) === p && posts.delete(key);
  const file = videoPath(dir, p.rel);
  if (!file) {
    log(`failed: ${p.rel} is gone`);
    setState(dir, platform, { status: "failed", error: `The file ${p.rel} isn't there any more.`, retryable: false, endedAt: now() });
    forget();
    return;
  }
  const s = getState(dir)[platform] ?? {};
  const d = getDraft(dir, platform);
  const st = fs.statSync(file);
  const identity = { size: st.size, mtime: Math.round(st.mtimeMs) };
  const post = s.post?.identity?.mtime === identity.mtime ? s.post : { identity };
  const save = () => setState(dir, platform, { post, status: post.phase === "processing" ? "processing" : ["finishing", "publishing", "done"].includes(post.phase) ? "publishing" : "uploading" });
  setState(dir, platform, { status: "uploading", startedAt: s.startedAt ?? now(), error: null, post });
  let lastSave = 0;
  const onProgress = (sent, total) => {
    p.live = { sent, total };
    if (Date.now() - lastSave > 3000) {
      lastSave = Date.now();
      setState(dir, platform, { progress: { sent, total } });
    }
  };
  try {
    let result;
    const caption = d.caption.trim();
    if (platform === "facebook") {
      const page = pageById(s.account.id);
      if (!page) throw new MetaError("That Facebook Page isn't connected any more: Test connection in Settings.");
      log(`${s.format === "reel" ? "Reel" : "video post"} of ${p.rel} (${st.size} bytes) to ${page.name}`);
      result = s.format === "reel" ? await postFacebookReel({ page, file, size: st.size, caption, st: post, save, log, onProgress }) : await postFacebookVideo({ page, file, size: st.size, caption, title: d.title?.trim(), st: post, save, log, onProgress });
    } else {
      const page = pageOfInstagram(s.account.id);
      if (!page) throw new MetaError("That Instagram account isn't linked to a connected Page any more: Test connection in Settings.");
      const up = await instagramFile(dir, file, identity, log, (done, total) => (p.live = { preparing: { done, total } }));
      const size = fs.statSync(up).size;
      log(`Reel of ${p.rel} (${size} bytes) to ${s.account.name}${d.shareToFeed ? ", also in the feed" : ", Reels tab only"}`);
      result = await postInstagramReel({ page, igId: s.account.id, file: up, size, caption, shareToFeed: d.shareToFeed !== false, st: post, save, log, onProgress });
      if (up !== file) fs.rmSync(up, { force: true });
    }
    const id = `${platform}-${Date.now()}`;
    const endedAt = now();
    recordHistory(dir, { id, platform, route: "api", account: s.account, format: s.format, postId: result.id, file: p.rel, size: st.size, mtime: identity.mtime, url: result.url, at: endedAt });
    setState(dir, platform, { status: "posted", result, url: result.url, post: null, endedAt, historyId: id, progress: { sent: st.size, total: st.size } });
    log(`done: ${result.url ?? result.id}`);
  } catch (e) {
    log(`failed: ${e.message}`);
    setState(dir, platform, { status: "failed", error: e.message, retryable: e instanceof MetaError ? e.retry : true, endedAt: now() });
    hooks.onFailure?.(name, dir, e.message)?.catch?.(() => undefined);
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
