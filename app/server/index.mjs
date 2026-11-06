/**
 * The content engine website: http://127.0.0.1:<appPort> (only reachable from this computer).
 *   /                 projects, new video, settings
 *   /p/<project>      editor: the project's Remotion Studio + Claude (a chat with the project's Claude Code)
 *   /api/...          JSON API for the page; /api/bridge/... for the EngineBridge inside Studio
 *   /mcp/<project>    MCP endpoint for Claude Code (tools: editor_state, timeline, view_frame, seek, playback, show_setting)
 *   /ws/chat/<p>      the Claude chat's live updates
 */
import { execFile, execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";
import { createProject, ENGINE_DIR, findProject, linkStatus, listProjects, loadSettings, RUNTIME_MODULES, saveSettings } from "../../cli/projects.mjs";
import { chooseHook, choosePackage, hookOption, installPackagingSkill, readHooks, readPackage } from "../../cli/packaging.mjs";
import { readReview, reviewBusy } from "../../cli/review.mjs";
import { removeOldBundles } from "../../cli/temp.mjs";
import { briefData, downloadLink, resolveServable, saveUpload, studyReferences } from "./brief.mjs";
import { getState, openChannel, resolveResult, updateState } from "./bridge.mjs";
import { contextText, describe, loadProject } from "./context.mjs";
import { ensureIntegration } from "./integration.mjs";
import { handleMcp } from "./mcp.mjs";
import { ensureStudio, stopAllStudios, stopStudio, studioInfo } from "./studios.mjs";
import { deleteInfo, recycle } from "./remove.mjs";
import { accountFor, activity, apiProblems, API_ACTIVE, getDraft, draftProblems, getState as publishState, handoffMessage, listVideos, metaBusy, metaLive, publishSummary, recoverUploads, report as publishReport, saveDraft, selectedVideo, selectVideo, startMeta, startYouTube, stopYouTube, videoInfo, youtubeLive } from "./publish.mjs";
import { authUrl as metaAuthUrl, connectWithToken as metaConnectWithToken, disconnect as metaDisconnect, finishAuth as metaFinishAuth, isOAuthCallback as isMetaCallback, saveApp as saveMetaApp, status as metaStatus, testConnection as metaTest } from "./meta.mjs";
import { authUrl, disconnect as youtubeDisconnect, finishAuth, isOAuthCallback, saveClient as saveYouTubeClient, saveClientFields, status as youtubeStatus, testConnection } from "./youtube.mjs";
import { publishDefaults, settingsView, updateChannels, updateSettings } from "./settings.mjs";
import { applyStyle, findStyle, styleForChannel } from "../../cli/catalog.mjs";
import { computePlan, failureMessage, getJob, liveInfo, noteClaude, recoverJobs, renderSummary, resumeJob, setRenderHooks, shutdownRenders, startJob, stopJob } from "./render.mjs";
import { answer as answerClaude, attachChat, chatState, interrupt as interruptClaude, killAllClaude, killClaude, newConversation, openInTerminal, sendMessage, setMode as setClaudeMode } from "./claude.mjs";
import { addDraftLink, approveStyle, CATALOG_CHAT, catalogList, contextText as catalogContext, createDraft, deleteStyle, draftView, duplicateStyle, markDraftStarted, ensureCatalogFolder, previewFile, saveDraftUpload, saveFont, setView as setCatalogView, startDraft, styleDetail } from "./catalog.mjs";

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// an `nproc` for Remotion (see server/bin/nproc.cmd): Studios, renders, frame previews and Claude panels inherit it
process.env.PATH = `${path.join(APP_DIR, "server", "bin")};${process.env.PATH ?? ""}`;
// CE_APP_DIST: test override (a page built elsewhere), so tests don't replace the page a running engine serves
const DIST = process.env.CE_APP_DIST || path.join(APP_DIR, "dist");
const PORT = Number(process.env.CE_APP_PORT || loadSettings().appPort || 4100);
const ENGINE_URL = `http://127.0.0.1:${PORT}`;
const OWN_ORIGINS = new Set([`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`]);
const OWN_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const app = express();
app.disable("x-powered-by");

// ---- safety: only this machine, only our own page (or local tools without an Origin) may change things
app.use((req, res, next) => {
  if (!OWN_HOSTS.has(req.headers.host ?? "")) return res.status(403).send("forbidden host");
  const origin = req.headers.origin;
  if (req.path.startsWith("/api/bridge/")) {
    if (origin && !LOCAL_ORIGIN.test(origin)) return res.status(403).send("forbidden origin");
    res.set("access-control-allow-origin", "*");
    res.set("access-control-allow-headers", "content-type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  }
  if (origin && !OWN_ORIGINS.has(origin)) return res.status(403).send("forbidden origin");
  next();
});

// CE_WORKSPACE: test override (a scratch workspace) without touching the saved setting
const workspace = () => process.env.CE_WORKSPACE || loadSettings().workspace;
const project = (req, res) => {
  const dir = findProject(workspace(), req.params.name);
  if (!dir) res.status(404).json({ error: `no engine project "${req.params.name}" in the workspace` });
  return dir;
};
/** Route wrapper: errors become JSON. Errors thrown on purpose (a message for the user) are 400; system errors
 *  (with a code like ENOENT/EBUSY) are 500. Synchronous throws are caught too. */
const wrap = (fn) => (req, res) =>
  Promise.resolve()
    .then(() => fn(req, res))
    .catch((e) => {
      if (!res.headersSent) res.status(e.code ? 500 : 400).json({ error: e.message });
    });

// ---- bridge (Studio -> engine); bodies are text/plain JSON to avoid CORS preflights
app.post("/api/bridge/:name/state", express.text({ type: "*/*", limit: "2mb" }), (req, res) => {
  if (!findProject(workspace(), req.params.name)) return res.sendStatus(404);
  try {
    const b = JSON.parse(req.body);
    const patch = { composition: String(b.composition), frame: Number(b.frame), fps: Number(b.fps), durationInFrames: Number(b.durationInFrames) };
    if (b.props && typeof b.props === "object") patch.props = b.props;
    updateState(req.params.name, patch);
    res.sendStatus(204);
  } catch {
    res.sendStatus(400);
  }
});
app.post("/api/bridge/:name/result", express.text({ type: "*/*", limit: "64kb" }), (req, res) => {
  try {
    resolveResult(JSON.parse(req.body));
  } catch {
    // ignore malformed results
  }
  res.sendStatus(204);
});
app.get("/api/bridge/:name/events", (req, res) => {
  if (!findProject(workspace(), req.params.name)) return res.sendStatus(404);
  openChannel(req.params.name, res);
});

// ---- MCP for Claude Code
app.post("/mcp/:name", express.json({ limit: "4mb" }), wrap(async (req, res) => {
  const dir = project(req, res);
  if (dir) await handleMcp(req, res, req.params.name, dir);
}));
app.all("/mcp/:name", (req, res) => res.status(405).set("allow", "POST").json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null }));

// ---- website API
app.use("/api", express.json({ limit: "1mb" }));

app.get("/api/settings", wrap(async (req, res) => res.json(await settingsView())));
/** Just the channels (the new-video form): /api/settings also checks the tools, which takes seconds. */
app.get("/api/channels", (req, res) => res.json(loadSettings().channels ?? []));
app.put("/api/settings", wrap(async (req, res) => {
  const { channels, ...rest } = req.body ?? {};
  // channels are checked against the catalog first, so a bad list saves nothing
  if (channels !== undefined) updateChannels(channels, (id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !!findStyle(workspace(), id));
  updateSettings(rest);
  res.json(await settingsView());
}));

app.get("/api/doctor", (req, res) => {
  const ws = workspace();
  let claude = null;
  try {
    claude = execFileSync("where.exe", ["claude"], { encoding: "utf8" }).split(/\r?\n/)[0];
  } catch {
    // not on PATH
  }
  let freeGb = null;
  if (ws && fs.existsSync(ws)) {
    const s = fs.statfsSync(ws);
    freeGb = Math.round((s.bavail * s.bsize) / 1e9);
  }
  res.json({ runtime: fs.existsSync(path.join(RUNTIME_MODULES, "remotion")), claude, workspace: ws, workspaceExists: !!ws && fs.existsSync(ws), freeGb, onC: /^c:/i.test(ws ?? "") });
});

const stageOf = (dir) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "brief", "status.json"), "utf8")).stage ?? null;
  } catch {
    return null;
  }
};
app.get("/api/projects", (req, res) => res.json(listProjects(workspace()).map(({ dir, ...p }) => ({ ...p, dir, studio: studioInfo(p.name).status, stage: p.engine ? stageOf(dir) : null, render: p.engine ? renderSummary(p.name, dir) : null, publish: p.engine ? publishSummary(dir) : null }))));
/** A short working title from what the user wrote: first sentence, cut on a word boundary. Claude renames it later. */
const workingTitle = (text) => {
  const first = text.split(/(?<=[.!?])\s|\n/)[0].trim();
  if (first.length <= 60) return first;
  const cut = first.slice(0, 60);
  return cut.slice(0, cut.lastIndexOf(" ") > 20 ? cut.lastIndexOf(" ") : 60).trim() + "…";
};
app.post("/api/projects", wrap((req, res) => {
  const request = String(req.body.request ?? "").trim();
  const title = String(req.body.title ?? "").trim() || (request ? workingTitle(request) : "");
  if (!title) return res.status(400).json({ error: "say what you want to create" });
  const slug = req.body.slug || title.replace(/…$/, "").split(/\s+/).slice(0, 6).join(" ");
  const channel = req.body.channel ? (loadSettings().channels ?? []).find((c) => c.id === req.body.channel) : null;
  if (req.body.channel && !channel) return res.status(400).json({ error: "That channel doesn't exist any more (Settings → Channels)." });
  // the style is worked out before the new folder exists, so it isn't counted as the channel's "last video"
  const styleId = channel ? styleForChannel(workspace(), channel, listProjects(workspace())) : null;
  const dir = createProject({ workspace: workspace(), slug, title });
  // the user's answer to "what do you want to create?": Claude starts from it (make-video skill)
  if (request) fs.writeFileSync(path.join(dir, "brief", "request.md"), `# What the user wants to create\n\n${request}\n`);
  if (channel) {
    const mf = path.join(dir, "project.json");
    fs.writeFileSync(mf, JSON.stringify({ ...JSON.parse(fs.readFileSync(mf, "utf8")), channel: channel.id }, null, 2) + "\n");
    if (styleId) applyStyle(dir, workspace(), styleId, { locked: channel.locked });
  }
  res.json({ name: path.basename(dir), dir });
}));

// ---- a video's catalog style (the Brief's Look card): pick another one, or make a new one from the user's files
app.post("/api/projects/:name/style", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const cur = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8")).style;
  if (cur?.locked) return res.status(409).json({ error: "This video's channel has its look locked: change that in Settings → Channels." });
  const s = applyStyle(dir, workspace(), String(req.body.id ?? ""), { locked: false });
  const r = await deliverToClaude(
    req.params.name,
    dir,
    `[content engine] I picked the catalog style "${s.name}" (${s.id}) for this video; it's copied into src/style/ (STYLE.md, style.json, scenes). Follow the make-video skill's Look step with it: update style.md, the theme and anything already built, then tell me in two or three lines what changes.`,
  );
  res.json({ style: s, told: r.ok, reason: r.reason });
}));
app.post("/api/projects/:name/style/from-draft", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const cur = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8")).style;
  if (cur?.locked) return res.status(409).json({ error: "This video's channel has its look locked: change that in Settings → Channels." });
  const v = draftView(workspace(), String(req.body.draft ?? ""));
  if (!v.files.length) return res.status(400).json({ error: "Add a file first." });
  const draftDir = path.join(workspace(), "catalog", "drafts", v.id);
  const r = await deliverToClaude(
    req.params.name,
    dir,
    `[content engine] I want a new look for this video from my files: ${v.files.join(", ")} (in ${path.join(draftDir, "sources")}).${req.body.note ? ` ${String(req.body.note).trim()}` : ""} Make it a catalog style with the make-style skill (save it in ${path.join(workspace(), "catalog", "visual")}\\<id> with status "experimental", copying my files into its sources/), write ${path.join(draftDir, "result.json")} as {"id": "<id>"}, then use it here with \`ce catalog use <id>\` and follow the make-video skill's Look step.`,
  );
  res.json({ told: r.ok, reason: r.reason });
}));

app.get("/api/projects/:name", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
  } catch (e) {
    throw new Error(`This video's project.json can't be read (${e.message}). Ask Claude in its panel to repair it.`);
  }
  const p = loadProject(dir);
  res.json({ name: req.params.name, dir, title: manifest.title, format: manifest.format, duration: p.total, scenes: p.scenes.length, link: linkStatus(dir), studio: studioInfo(req.params.name) });
}));
app.post("/api/projects/:name/open", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  ensureIntegration(dir, req.params.name, ENGINE_URL);
  res.json(await ensureStudio(req.params.name, dir, { engineUrl: ENGINE_URL, portBase: loadSettings().studioPortBase || 3200 }));
}));
app.get("/api/projects/:name/studio", (req, res) => res.json(studioInfo(req.params.name)));
app.post("/api/projects/:name/studio/restart", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  stopStudio(req.params.name);
  res.json(await ensureStudio(req.params.name, dir, { engineUrl: ENGINE_URL, portBase: loadSettings().studioPortBase || 3200 }));
}));
/** which tab of the project page is open (brief | editor): changes what the prompt hook tells Claude */
const views = new Map();
app.post("/api/projects/:name/view", (req, res) => {
  if (!project(req, res)) return;
  views.set(req.params.name, ["brief", "final", "publish", "review", "package"].includes(req.body.tab) ? req.body.tab : "editor");
  res.json({ ok: true });
});
app.get("/api/projects/:name/context", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const d = describe(dir, getState(req.params.name));
  const view = views.get(req.params.name) ?? "editor";
  let text = contextText(d, view);
  // a failed final render Claude hasn't been told about yet rides along with the user's next message
  const job = getJob(req.params.name, dir);
  if (job?.status === "failed" && !job.claudeNotice?.ok) {
    const step = job.steps.find((s) => s.id === job.error?.step);
    text = `${text ? text + " " : ""}Note: the final render of this video failed at "${step?.label ?? job.error?.step}": ${job.error?.message} (log: ${step?.log ?? "out/render/logs"}; render_status / render_resume tools).`;
  }
  res.json({ ...d, view, text });
});

// ---- delete a project (to the Recycle Bin); the page must send the project's number as confirmation
app.get("/api/projects/:name/delete-info", (req, res) => {
  const dir = project(req, res);
  if (dir) res.json({ ...deleteInfo(dir), studio: studioInfo(req.params.name).status });
});
app.delete("/api/projects/:name", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const number = /^project-(\d+)/.exec(req.params.name)[1];
  if (String(req.body?.confirm ?? "").replace(/^0+/, "") !== number) return res.status(400).json({ error: `type ${number.padStart(2, "0")} to confirm` });
  const job = getJob(req.params.name, dir);
  if (job && ["running", "queued"].includes(job.status)) return res.status(409).json({ error: "A final render of this video is running or queued: stop it on its Final tab first." });
  if (["queued", "uploading"].includes(publishState(dir).youtube?.status)) return res.status(409).json({ error: "This video is uploading to YouTube: stop it on the Publish page first." });
  if (metaBusy(dir)) return res.status(409).json({ error: "This video is being posted to Facebook or Instagram: wait until it's done." });
  stopStudio(req.params.name);
  killClaude(req.params.name);
  await new Promise((r) => setTimeout(r, 800)); // let Windows release the files
  await recycle(dir);
  res.json({ deleted: req.params.name, recycleBin: true });
}));

// ---- final render (Phase 4)
const claudeEnv = (name) => ({ CE_ENGINE_URL: ENGINE_URL, CE_PROJECT: name });

/**
 * Hand a message to the project's Claude (started in the background if needed). If Claude is busy or waiting for the
 * user's answer to a question, the message waits in Claude's queue: it never answers or cancels that question.
 * Returns {ok:true} | {ok:false, reason}.
 */
async function deliverToClaude(name, dir, message) {
  ensureIntegration(dir, name, ENGINE_URL);
  return sendMessage(name, dir, claudeEnv(name), message, { from: "engine" });
}

/** A render failure -> the project's Claude. */
async function tellClaude(name, dir, job, { automatic }) {
  return deliverToClaude(name, dir, failureMessage(job, { automatic }));
}
setRenderHooks({ onFailure: tellClaude });

app.get("/api/projects/:name/render", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  // files: whether the finished files are (still) there, e.g. after being moved or deleted outside the engine
  const delivery = path.join(dir, "out", "delivery.mp4");
  const files = {
    delivery: fs.existsSync(delivery),
    deliveryAt: fs.existsSync(delivery) ? new Date(fs.statSync(delivery).mtimeMs).toISOString() : null,
    video: fs.existsSync(path.join(dir, "out", "video.mp4")),
  };
  res.json({ plan: computePlan(dir), job: getJob(req.params.name, dir), live: liveInfo(req.params.name), files });
});
app.post("/api/projects/:name/render/start", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const rerender = Array.isArray(req.body.rerender) ? req.body.rerender.map(String) : [];
  res.json(startJob(req.params.name, dir, { rerender, autoFix: req.body.autoFix !== false }));
}));
app.post("/api/projects/:name/render/resume", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  res.json(resumeJob(req.params.name, dir, { autoFix: req.body.autoFix }));
}));
app.post("/api/projects/:name/render/stop", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  res.json(stopJob(req.params.name, dir));
}));
app.post("/api/projects/:name/render/ask-claude", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const job = getJob(req.params.name, dir);
  if (!job?.error) return res.status(400).json({ error: "There is no failed render to ask about." });
  const r = await tellClaude(req.params.name, dir, job, { automatic: false });
  noteClaude(req.params.name, dir, { ...r, automatic: false });
  res.json(r);
}));
app.post("/api/projects/:name/render/reveal", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const which = { delivery: "out/delivery.mp4", video: "out/video.mp4" }[req.body.which] ?? "out";
  const target = path.join(dir, which);
  if (!fs.existsSync(target)) return res.status(404).json({ error: `${which} doesn't exist yet` });
  execFile("explorer.exe", fs.statSync(target).isDirectory() ? [target] : [`/select,${target}`], () => undefined);
  res.json({ ok: true });
});

// ---- publishing (Phase 5): YouTube through its API, Facebook/Instagram through Claude in Chrome
const REDIRECT_URI = `http://127.0.0.1:${PORT}/`;
app.get("/api/youtube", (req, res) => res.json(youtubeStatus()));
app.put("/api/youtube/client", express.text({ type: "*/*", limit: "64kb" }), wrap((req, res) => res.json(saveYouTubeClient(String(req.body ?? "")))));
app.post("/api/youtube/client-fields", wrap((req, res) => res.json(saveClientFields(req.body.clientId, req.body.clientSecret))));
app.post("/api/youtube/test", wrap(async (req, res) => res.json(await testConnection())));
app.post("/api/youtube/connect", wrap((req, res) => res.json({ url: authUrl(REDIRECT_URI) })));
app.post("/api/youtube/disconnect", wrap((req, res) => res.json(youtubeDisconnect())));
// ---- Facebook & Instagram through Meta's API: the user's Meta app, sign-in, the connected Pages
// Facebook allows a plain-http redirect only to localhost (apps in development mode), so this one uses localhost
const META_REDIRECT_URI = `http://localhost:${PORT}/`;
app.get("/api/meta", (req, res) => res.json({ ...metaStatus(), redirectUri: META_REDIRECT_URI }));
app.put("/api/meta/app", wrap((req, res) => res.json({ ...saveMetaApp(req.body ?? {}), redirectUri: META_REDIRECT_URI })));
app.post("/api/meta/connect", wrap((req, res) => res.json({ url: metaAuthUrl(META_REDIRECT_URI) })));
app.post("/api/meta/token", wrap(async (req, res) => res.json({ ...(await metaConnectWithToken(req.body?.token)), redirectUri: META_REDIRECT_URI })));
app.post("/api/meta/test", wrap(async (req, res) => res.json(await metaTest())));
app.post("/api/meta/disconnect", wrap((req, res) => res.json({ ...metaDisconnect(), redirectUri: META_REDIRECT_URI })));

// Google (127.0.0.1) and Facebook (localhost) send the browser back to /?code=…&state=… after sign-in
app.get("/", async (req, res, next) => {
  const page = (title, body) =>
    `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="background:#f6f3ee;color:#1f1c19;font:16px Segoe UI,sans-serif;padding:48px"><h2 style="font-family:Georgia,serif;font-weight:400">${title}</h2><p>${body}</p><p><a style="color:#1d64a6" href="/settings">Back to the content engine's Settings</a></p>`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  if (isMetaCallback(req.query)) {
    try {
      const st = await metaFinishAuth(req.query);
      const list = st.pages.map((p) => `<b>${esc(p.name)}</b>${p.instagram ? ` (Instagram: <b>@${esc(p.instagram.username ?? p.instagram.id)}</b>)` : " (no Instagram linked)"}`).join("<br>");
      const missing = st.missing.length ? `<br><br>Facebook didn't grant: ${esc(st.missing.join(", "))}. Connect again and allow everything it asks for.` : "";
      return res.send(page("Facebook & Instagram connected", (st.pages.length ? `The engine can post to:<br>${list}` : "Connected, but no Pages were shared: connect again and pick your Page on Facebook's screen.") + missing));
    } catch (e) {
      return res.status(400).send(page("Facebook & Instagram not connected", esc(e.message)));
    }
  }
  if (!isOAuthCallback(req.query)) return next();
  try {
    const st = await finishAuth(req.query);
    res.send(page("YouTube connected", st.channel ? `Uploads go to the channel <b>${esc(st.channel.title)}</b>.` : "Connected. (The channel name couldn't be read.)"));
  } catch (e) {
    res.status(400).send(page("YouTube not connected", esc(e.message)));
  }
});

const PLATFORMS = ["youtube", "facebook", "instagram"];
app.get("/api/projects/:name/publish", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const drafts = Object.fromEntries(PLATFORMS.map((p) => [p, getDraft(dir, p)]));
  const logFile = path.join(dir, "publish", "youtube.log");
  const youtubeLog = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8").trim().split(/\r?\n/).slice(-30) : [];
  const { video: _picked, ...state } = publishState(dir);
  const video = await videoInfo(dir);
  const tail = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split(/\r?\n/).slice(-30) : []);
  const ms = metaStatus();
  res.json({
    videos: listVideos(dir),
    video,
    drafts,
    // problems: the Chrome hand-off's; apiProblems: posting through Meta's API
    problems: Object.fromEntries(PLATFORMS.map((p) => [p, draftProblems(p, drafts[p])])),
    apiProblems: { facebook: apiProblems("facebook", drafts.facebook, video), instagram: apiProblems("instagram", drafts.instagram, video) },
    state,
    youtube: { ...youtubeStatus(), live: youtubeLive(req.params.name) },
    youtubeLog,
    meta: {
      connected: ms.connected,
      userExpiresAt: ms.userExpiresAt,
      pages: ms.pages,
      account: { facebook: accountFor("facebook", drafts.facebook), instagram: accountFor("instagram", drafts.instagram) },
      live: { facebook: metaLive(req.params.name, "facebook"), instagram: metaLive(req.params.name, "instagram") },
      log: { facebook: tail(path.join(dir, "publish", "facebook.log")), instagram: tail(path.join(dir, "publish", "instagram.log")) },
    },
    claude: chatState(req.params.name),
  });
}));
/** Post the picked file to Facebook or Instagram through Meta's API (queued). */
app.post("/api/projects/:name/publish/:platform/post", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  if (!["facebook", "instagram"].includes(req.params.platform)) return res.status(404).json({ error: "only Facebook and Instagram post through Meta's API" });
  try {
    res.json(await startMeta(req.params.name, dir, req.params.platform, { again: req.body?.again === true }));
  } catch (e) {
    // already posted there: the page asks whether to post a second copy
    if (e.duplicate) return res.status(409).json({ error: e.message, duplicate: e.duplicate });
    throw e;
  }
}));
/** The Publish page picked one of the project's video files. */
app.post("/api/projects/:name/publish/select", wrap((req, res) => {
  const dir = project(req, res);
  if (dir) res.json({ video: selectVideo(dir, String(req.body.file ?? "")) });
}));
app.put("/api/projects/:name/publish/:platform", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  if (!PLATFORMS.includes(req.params.platform)) return res.status(404).json({ error: "unknown platform" });
  res.json(saveDraft(dir, req.params.platform, req.body ?? {}));
}));
app.post("/api/projects/:name/publish/youtube/start", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  try {
    res.json(await startYouTube(req.params.name, dir, { again: req.body?.again === true }));
  } catch (e) {
    // already on YouTube: the page asks whether to upload a second copy
    if (e.duplicate) return res.status(409).json({ error: e.message, duplicate: e.duplicate });
    throw e;
  }
}));
app.post("/api/projects/:name/publish/youtube/stop", wrap((req, res) => {
  const dir = project(req, res);
  if (dir) res.json(stopYouTube(req.params.name, dir));
}));
app.post("/api/projects/:name/publish/:platform/handoff", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const platform = req.params.platform;
  if (!["facebook", "instagram"].includes(platform)) return res.status(404).json({ error: "only Facebook and Instagram go through Claude" });
  const file = selectedVideo(dir);
  if (!file) return res.status(400).json({ error: "This video has no exported file yet: render it on its Final tab first." });
  const problems = draftProblems(platform, getDraft(dir, platform));
  if (problems.length) return res.status(400).json({ error: problems.join(" ") });
  const cur = publishState(dir)[platform] ?? {};
  if (cur.route === "api" && API_ACTIVE.includes(cur.status)) return res.status(409).json({ error: "This video is being posted there through Meta's API right now: wait until it's done." });
  const r = await deliverToClaude(req.params.name, dir, handoffMessage(dir, platform, file));
  if (r.ok) publishReport(dir, platform, { status: "handed", file });
  res.json(r);
}));
app.post("/api/projects/:name/publish/:platform/report", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  res.json(publishReport(dir, req.params.platform, { status: String(req.body.status ?? ""), url: req.body.url ? String(req.body.url) : null, note: req.body.note ? String(req.body.note) : null }));
}));
app.post("/api/projects/:name/publish/draft", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const which = (Array.isArray(req.body.platforms) ? req.body.platforms : PLATFORMS).filter((p) => PLATFORMS.includes(p));
  const message = `[content engine] Please draft the publishing text for ${which.join(", ")} in publish/<platform>.json (follow "Publish" in the make-video skill: read script.json and brief.md, keep each platform's limits, keep the fields that are already filled unless they're placeholders). Tell me briefly what you wrote.`;
  res.json(await deliverToClaude(req.params.name, dir, message));
}));
/** Everything published or being published, across all videos (the Publish page's history), newest first. */
app.get("/api/published", (req, res) => {
  const rows = [];
  for (const p of listProjects(workspace())) {
    if (!p.engine) continue;
    for (const r of activity(p.dir)) rows.push({ project: p.name, number: p.number, title: p.title, ...r });
  }
  rows.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  res.json(rows);
});
/** The Publish page's list: every video with at least one exported file, and those without one yet. */
app.get("/api/publish/videos", (req, res) => {
  const ready = [];
  const notYet = [];
  for (const p of listProjects(workspace())) {
    if (!p.engine) continue;
    const videos = listVideos(p.dir);
    const row = { project: p.name, number: p.number, title: p.title, stage: stageOf(p.dir) };
    if (!videos.length) {
      notYet.push(row);
      continue;
    }
    ready.push({ ...row, videos, selected: selectedVideo(p.dir), publish: publishSummary(p.dir), uploading: youtubeLive(p.name) ? true : false });
  }
  const newest = (r) => r.videos.reduce((m, v) => (v.madeAt > m ? v.madeAt : m), "");
  ready.sort((a, b) => newest(b).localeCompare(newest(a)));
  res.json({ ready, notYet });
});

/** Settings → "Check Chrome": a read-only check by Claude, in a video's panel, that posting through Chrome will work. */
app.post("/api/social/chrome-check", wrap(async (req, res) => {
  const projects = listProjects(workspace()).filter((p) => p.engine);
  const chosen = req.body.project ? projects.find((p) => p.name === req.body.project) : projects.sort((a, b) => fs.statSync(b.dir).mtimeMs - fs.statSync(a.dir).mtimeMs)[0];
  if (!chosen) return res.status(400).json({ error: "Create a video first: the check runs in a video's Claude panel." });
  const d = publishDefaults();
  const message = [
    "[content engine] Please check, without posting, liking, following or changing anything, that posting through Chrome will work:",
    "1) whether your Claude in Chrome browser tools are available in this session;",
    `2) in a new tab, whether my Chrome is logged in to Facebook${d.facebookPage ? ` and can open the Page ${d.facebookPage}` : ""};`,
    `3) in a new tab, whether it is logged in to Instagram${d.instagramAccount ? ` as ${d.instagramAccount}` : ""}.`,
    "Close the tabs you opened, then call the chrome_check_report tool with what you found and tell me in one or two sentences.",
    "If your browser tools aren't available, call chrome_check_report with extension false and tell me to check that the Claude in Chrome extension is installed, signed in and turned on in Chrome.",
    "Never enter passwords or codes; if a login or security prompt appears, report it as not logged in.",
  ].join(" ");
  const r = await deliverToClaude(chosen.name, chosen.dir, message);
  res.json({ ...r, project: chosen.name, title: chosen.title });
}));

app.post("/api/projects/:name/publish/reveal", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const rel = selectedVideo(dir);
  if (!rel) return res.status(404).json({ error: "This video has no exported file yet." });
  execFile("explorer.exe", [`/select,${path.join(dir, rel)}`], () => undefined);
  res.json({ ok: true });
});

// ---- Review tab: the quality gate (cli/review.mjs), in a process of its own because it renders and waits for the critic
const reviews = new Map(); // name -> { running, error }
app.get("/api/projects/:name/review", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  // running: from this page's button, or Claude's own `ce review .`
  res.json({ running: false, error: null, report: null, final: null, ...reviews.get(req.params.name), ...(await readReview(dir)), ...(reviewBusy(dir) ? { running: true } : {}) });
}));
app.post("/api/projects/:name/review/run", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const name = req.params.name;
  if (reviewBusy(dir) || [...reviews.values()].some((r) => r.running)) return res.status(409).json({ error: "Another review is running; try again when it's done." });
  if (liveInfo(name)?.active) return res.status(409).json({ error: "This video is rendering; review it when that's finished." });
  const proc = spawn(process.execPath, [path.join(ENGINE_DIR, "cli", "ce.mjs"), "review", dir, ...(req.body?.critic === false ? ["--no-critic"] : [])], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  let stderr = "";
  proc.stderr.on("data", (d) => (stderr = (stderr + d).slice(-2000)));
  reviews.set(name, { running: true, error: null });
  proc.on("error", (e) => reviews.set(name, { running: false, error: e.message }));
  proc.on("close", (code) => reviews.set(name, { running: false, error: code ? stderr.trim().split(/\r?\n/).slice(-6).join(" ") || "The review stopped." : null }));
  res.json({ started: true });
}));

// ---- Package tab and the Brief's Hook card (cli/packaging.mjs): Claude writes the options, the user picks here
const packageView = (dir) => ({ ...readPackage(dir), draft: { title: getDraft(dir, "youtube").title, facebook: getDraft(dir, "facebook").caption, instagram: getDraft(dir, "instagram").caption } });
app.get("/api/projects/:name/package", wrap((req, res) => {
  const dir = project(req, res);
  if (dir) res.json(packageView(dir));
}));
app.post("/api/projects/:name/package/make", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  installPackagingSkill(dir);
  const r = await deliverToClaude(req.params.name, dir, "Please package this video: follow the packaging skill's titles, thumbnails and captions part, then tell me to open the Package tab.");
  res.json({ sent: r.ok, reason: r.reason });
}));
// a picked title or caption goes straight into the Publish drafts; nothing is uploaded
app.post("/api/projects/:name/package/use", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const { kind, id } = req.body ?? {};
  const picked = choosePackage(dir, kind, String(id));
  if (kind === "title") saveDraft(dir, "youtube", { title: picked.title });
  if (kind === "caption") {
    const footer = publishDefaults().captionFooter;
    const caption = `${picked.text}${footer ? `\n\n${footer}` : ""}`;
    for (const platform of ["facebook", "instagram"]) saveDraft(dir, platform, { caption });
  }
  res.json(packageView(dir));
}));
// the pick is saved only once Claude has it: otherwise the board would say Picked while the script waits forever
app.post("/api/projects/:name/hook", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const option = hookOption(dir, req.body?.id);
  const text = readHooks(dir).chosen ? `I changed the hook to: "${option.text}" Rebuild the script on it.` : `I picked this hook: "${option.text}" Build the script on it.`;
  const r = await deliverToClaude(req.params.name, dir, text);
  if (r.ok) chooseHook(dir, option.id);
  res.json({ sent: r.ok, reason: r.reason });
}));

// ---- Brief page
app.get("/api/projects/:name/brief", (req, res) => {
  const dir = project(req, res);
  if (dir) res.json(briefData(req.params.name, dir));
});
app.get("/api/projects/:name/file", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const full = resolveServable(dir, String(req.query.path ?? ""));
  if (!full) return res.sendStatus(404);
  if (req.query.download) {
    // out/delivery.mp4 -> <slug>.mp4; other files keep their name after the slug (<slug>-draft.mp4)
    const slug = req.params.name.replace(/^project-\d+-/, "");
    const base = path.basename(full, path.extname(full));
    return res.download(full, `${base === "delivery" ? slug : `${slug}-${base}`}${path.extname(full)}`);
  }
  res.sendFile(full);
});
/**
 * A still of a project video (JPEG, 320 px wide), made once per file version and kept in out/render/thumbs/. Lists of
 * videos use these instead of <video> elements: the browser keeps a connection open for every paused video, and with
 * six of them (its limit per site) the page's own status requests wait.
 */
app.get("/api/projects/:name/thumb", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const full = resolveServable(dir, String(req.query.path ?? ""));
  if (!full) return res.sendStatus(404);
  const st = fs.statSync(full);
  const key = crypto.createHash("sha1").update(`${full}|${st.size}|${st.mtimeMs}`).digest("hex").slice(0, 16);
  const out = path.join(dir, "out", "render", "thumbs", `${key}.jpg`);
  if (!fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const grab = (at) =>
      new Promise((resolve) =>
        execFile("ffmpeg", ["-y", "-loglevel", "error", "-ss", at, "-i", full, "-frames:v", "1", "-vf", "scale=320:-2", "-q:v", "4", out + ".part.jpg"], { windowsHide: true, timeout: 30000 }, (err) => resolve(!err && fs.existsSync(out + ".part.jpg"))),
      );
    // a second in shows the video better than its first (often black) frame; very short files only have frame 0
    if (!(await grab("1")) && !(await grab("0"))) return res.sendStatus(404);
    fs.renameSync(out + ".part.jpg", out);
  }
  res.set("cache-control", "max-age=3600");
  res.sendFile(out);
}));
app.put("/api/projects/:name/upload", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  if (!req.query.name) return res.status(400).json({ error: "missing ?name=" });
  res.json(await saveUpload(req.params.name, dir, String(req.query.name), req));
}));
app.post("/api/projects/:name/link", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const url = String(req.body.url ?? "").trim();
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "paste a full link starting with http(s)://" });
  downloadLink(req.params.name, dir, url);
  res.json({ started: true });
}));
app.post("/api/projects/:name/study", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  studyReferences(req.params.name, dir);
  res.json({ started: true });
});
/** A board button's message to Claude (Approve, Ask Claude to fix these…). */
app.post("/api/projects/:name/say", wrap(async (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const text = String(req.body.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "nothing to say" });
  const r = await deliverToClaude(req.params.name, dir, text);
  res.json({ sent: r.ok, reason: r.reason });
}));

// ---- the Catalog page (styles: library/catalog/visual and <workspace>/catalog/visual; its own Claude chat)
app.get("/api/catalog", wrap((req, res) => res.json({ styles: catalogList(workspace()) })));
app.get("/api/catalog/styles/:id", wrap((req, res) => {
  const d = styleDetail(workspace(), req.params.id);
  if (!d) return res.status(404).json({ error: `There's no style "${req.params.id}".` });
  res.json(d);
}));
app.get("/api/catalog/styles/:id/preview/:file", (req, res) => {
  const full = previewFile(workspace(), req.params.id, req.params.file);
  if (!full) return res.sendStatus(404);
  res.set("cache-control", "no-cache"); // previews are re-rendered in place: always revalidate
  res.sendFile(full);
});
app.post("/api/catalog/styles/:id/duplicate", wrap((req, res) => res.json({ id: duplicateStyle(workspace(), req.params.id) })));
app.post("/api/catalog/styles/:id/approve", wrap((req, res) => res.json(approveStyle(workspace(), req.params.id))));
app.delete("/api/catalog/styles/:id", wrap(async (req, res) => {
  // the page sends the style's id back as confirmation, like the video number on Delete
  if (req.body?.confirm !== req.params.id) return res.status(400).json({ error: "Type the style's id to confirm." });
  const ws = workspace();
  if (chatState(CATALOG_CHAT) === "working") return res.status(409).json({ error: "Claude is working in the catalog right now; try again when it's done." });
  res.json(await deleteStyle(ws, req.params.id));
}));
app.put("/api/catalog/styles/:id/font", wrap(async (req, res) => {
  if (!req.query.name) return res.status(400).json({ error: "missing ?name=" });
  res.json(await saveFont(workspace(), req.params.id, String(req.query.name), req));
}));
app.post("/api/catalog/drafts", wrap((req, res) => res.json({ id: createDraft(workspace()) })));
app.get("/api/catalog/drafts/:draft", wrap((req, res) => res.json(draftView(workspace(), req.params.draft))));
app.put("/api/catalog/drafts/:draft/upload", wrap(async (req, res) => {
  if (!req.query.name) return res.status(400).json({ error: "missing ?name=" });
  res.json(await saveDraftUpload(workspace(), req.params.draft, String(req.query.name), req));
}));
app.post("/api/catalog/drafts/:draft/link", wrap((req, res) => res.json(addDraftLink(workspace(), req.params.draft, String(req.body.url ?? "").trim()))));
app.post("/api/catalog/drafts/:draft/start", wrap(async (req, res) => {
  const ws = workspace();
  const text = startDraft(ws, req.params.draft, req.body.note);
  const r = await sendMessage(CATALOG_CHAT, ensureCatalogFolder(ws), claudeEnv(CATALOG_CHAT), text, { from: "engine" });
  if (r.ok) markDraftStarted(ws, req.params.draft); // a failed send leaves the page able to try again
  res.json({ sent: r.ok, reason: r.reason });
}));
/** A page button's message to the catalog's Claude ("Render the previews again", "Make my own copy"…). */
app.post("/api/catalog/say", wrap(async (req, res) => {
  const text = String(req.body.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "nothing to say" });
  const ws = workspace();
  const r = await sendMessage(CATALOG_CHAT, ensureCatalogFolder(ws), claudeEnv(CATALOG_CHAT), text, { from: "engine" });
  res.json({ sent: r.ok, reason: r.reason });
}));
/** What the Catalog page shows (gallery, a style, a draft): the prompt hook passes it on to Claude. */
app.post("/api/catalog/view", (req, res) => {
  setCatalogView(req.body ?? {});
  res.json({ ok: true });
});
app.get("/api/catalog/context", (req, res) => res.json({ text: catalogContext(workspace()) }));

// ---- the Claude chat (live updates over /ws/chat/<project>); "_catalog" is the Catalog page's chat
/** The chat's folder: a video project, or the catalog folder (made ready for its Claude). Answers 404/400 itself. */
const chatDir = (req, res) => {
  if (req.params.name !== CATALOG_CHAT) return project(req, res);
  try {
    return ensureCatalogFolder(workspace());
  } catch (e) {
    res.status(400).json({ error: e.message });
    return null;
  }
};
/** Connection files before Claude starts: a video gets the engine's tools and hook; the catalog got its own above. */
const connectChat = (name, dir) => {
  if (name !== CATALOG_CHAT) ensureIntegration(dir, name, ENGINE_URL);
};
app.post("/api/projects/:name/chat/send", wrap(async (req, res) => {
  const dir = chatDir(req, res);
  if (!dir) return;
  const text = String(req.body.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "nothing to send" });
  if (text.length > 100_000) return res.status(400).json({ error: "That message is too long." });
  if (chatState(req.params.name) === "stopped") connectChat(req.params.name, dir);
  res.json(await sendMessage(req.params.name, dir, claudeEnv(req.params.name), text));
}));
app.post("/api/projects/:name/chat/answer", wrap((req, res) => {
  if (chatDir(req, res)) res.json(answerClaude(req.params.name, String(req.body.id ?? ""), req.body));
}));
app.post("/api/projects/:name/chat/stop", wrap(async (req, res) => {
  if (chatDir(req, res)) res.json(await interruptClaude(req.params.name));
}));
app.post("/api/projects/:name/chat/mode", wrap(async (req, res) => {
  const dir = chatDir(req, res);
  if (dir) res.json(await setClaudeMode(req.params.name, dir, claudeEnv(req.params.name), String(req.body.mode ?? "")));
}));
app.post("/api/projects/:name/chat/new", wrap(async (req, res) => {
  const dir = chatDir(req, res);
  if (dir) res.json(await newConversation(req.params.name, dir, claudeEnv(req.params.name)));
}));
app.post("/api/projects/:name/chat/terminal", wrap(async (req, res) => {
  const dir = chatDir(req, res);
  if (!dir) return;
  connectChat(req.params.name, dir);
  let title = req.params.name === CATALOG_CHAT ? "Catalog" : null;
  try {
    title = title ?? JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8")).title;
  } catch {
    // the folder name will do
  }
  res.json(await openInTerminal(req.params.name, dir, claudeEnv(req.params.name), title));
}));

// ---- the page
app.use(express.static(DIST, { index: false }));
app.get(/^\/(?!api\/|mcp\/|ws\/).*/, (req, res) => {
  const index = path.join(DIST, "index.html");
  if (!fs.existsSync(index)) return res.status(500).send("The website is not built yet: run  npm run build  in content-engine/app");
  res.sendFile(index);
});

// ---- server + the chat's websocket (only from the engine's own page)
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  const m = /^\/ws\/chat\/([^/?]+)/.exec(req.url ?? "");
  const name = m ? decodeURIComponent(m[1]) : null;
  const own = OWN_HOSTS.has(req.headers.host ?? "") && OWN_ORIGINS.has(req.headers.origin ?? "");
  let dir = null;
  if (own && name === CATALOG_CHAT) {
    try {
      dir = ensureCatalogFolder(workspace());
    } catch {
      // no workspace yet: refused below
    }
  } else if (own && name) dir = findProject(workspace(), name);
  if (!dir) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    return socket.destroy();
  }
  // the chat can be opened without the editor (Publish page): make sure Claude gets this engine's tools and hook
  try {
    connectChat(name, dir);
  } catch (e) {
    console.error(`${name}: ${e.message}`);
  }
  // a new video: Claude starts the guided /make-video conversation when its page first opens (never the catalog)
  wss.handleUpgrade(req, socket, head, (ws) => attachChat(ws, name, dir, claudeEnv(name), { onFirstOpen: () => name !== CATALOG_CHAT && stageOf(dir) === "new" }));
});

const shutdown = () => {
  shutdownRenders();
  stopAllStudios();
  killAllClaude();
  process.exit(0);
};
// Ctrl+C, Ctrl+Break, closing the console window: stop the Studios and Claude sessions this server started
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) process.on(sig, shutdown);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`content engine: ${ENGINE_URL}`);
  recoverUploads(listProjects(workspace()).filter((p) => p.engine));
  const n = recoverJobs(workspace());
  if (n) console.log(`${n} final render(s) were interrupted when the engine last stopped: Resume them on their Final tab.`);
  // on start and once a day, since the engine can stay up for days
  const sweep = () => removeOldBundles().then((gone) => gone && console.log(`removed ${gone} old render copies from the temp folder`), () => undefined);
  sweep();
  setInterval(sweep, 24 * 60 * 60 * 1000).unref();
});
