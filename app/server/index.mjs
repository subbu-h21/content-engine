/**
 * The content engine website: http://127.0.0.1:<appPort> (only reachable from this computer).
 *   /                 projects, new video, settings
 *   /p/<project>      editor: the project's Remotion Studio + Claude Code terminal
 *   /api/...          JSON API for the page; /api/bridge/... for the EngineBridge inside Studio
 *   /mcp/<project>    MCP endpoint for Claude Code (tools: editor_state, timeline, view_frame, seek, playback, show_setting)
 *   /ws/terminal/<p>  the Claude Code terminal
 */
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";
import { createProject, findProject, linkStatus, listProjects, loadSettings, RUNTIME_MODULES, saveSettings } from "../../cli/projects.mjs";
import { briefData, downloadLink, resolveServable, saveUpload, studyReferences } from "./brief.mjs";
import { getState, openChannel, resolveResult, updateState } from "./bridge.mjs";
import { contextText, describe, loadProject } from "./context.mjs";
import { ensureIntegration } from "./integration.mjs";
import { handleMcp } from "./mcp.mjs";
import { ensureStudio, stopAllStudios, stopStudio, studioInfo } from "./studios.mjs";
import { deleteInfo, recycle } from "./remove.mjs";
import { getDraft, draftProblems, getState as publishState, handoffMessage, publishSummary, recoverUploads, report as publishReport, saveDraft, startYouTube, stopYouTube, videoInfo, youtubeLive } from "./publish.mjs";
import { authUrl, disconnect as youtubeDisconnect, finishAuth, isOAuthCallback, saveClient as saveYouTubeClient, status as youtubeStatus } from "./youtube.mjs";
import { computePlan, failureMessage, getJob, liveInfo, noteClaude, recoverJobs, renderSummary, resumeJob, setRenderHooks, shutdownRenders, startJob, stopJob } from "./render.mjs";
import { attachTerminal, ensureTerminal, killAllTerminals, killTerminal, panelState, sayToTerminal } from "./terminals.mjs";

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(APP_DIR, "dist");
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

app.get("/api/settings", (req, res) => res.json(loadSettings()));
app.put("/api/settings", wrap((req, res) => {
  const ws = String(req.body.workspace ?? "").trim();
  if (!ws || !fs.existsSync(ws) || !fs.statSync(ws).isDirectory()) return res.status(400).json({ error: `not a folder: ${ws}` });
  res.json(saveSettings({ workspace: path.resolve(ws) }));
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
  const dir = createProject({ workspace: workspace(), slug, title });
  // the user's answer to "what do you want to create?": Claude starts from it (make-video skill)
  if (request) fs.writeFileSync(path.join(dir, "brief", "request.md"), `# What the user wants to create\n\n${request}\n`);
  res.json({ name: path.basename(dir), dir });
}));

app.get("/api/projects/:name", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
  const p = loadProject(dir);
  res.json({ name: req.params.name, dir, title: manifest.title, format: manifest.format, duration: p.total, scenes: p.scenes.length, link: linkStatus(dir), studio: studioInfo(req.params.name) });
});
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
  views.set(req.params.name, ["brief", "final", "publish"].includes(req.body.tab) ? req.body.tab : "editor");
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
  if (["queued", "uploading"].includes(publishState(dir).youtube?.status)) return res.status(409).json({ error: "This video is uploading to YouTube: stop it on its Publish tab first." });
  stopStudio(req.params.name);
  killTerminal(req.params.name);
  await new Promise((r) => setTimeout(r, 800)); // let Windows release the files
  await recycle(dir);
  res.json({ deleted: req.params.name, recycleBin: true });
}));

// ---- final render (Phase 4)
const termEnv = (name) => ({ CE_ENGINE_URL: ENGINE_URL, CE_PROJECT: name });
/** "<project>:<topic>" -> timer of a message waiting for the Claude panel to be at its prompt */
const pendingDelivery = new Map();
const DELIVERY_WINDOW_MS = 15 * 60 * 1000;

/**
 * Hand a message to the project's Claude panel (started in the background if needed). It is only typed when the panel
 * is at its prompt; if it's showing a question (trust, a startup choice, a permission prompt) the user answers it first
 * and the message follows on its own, for up to 15 minutes, unless stillWanted() turns false meanwhile.
 * Returns {ok:true} | {ok:false, pending:true, reason}; onLater({ok, reason}) reports the delayed outcome.
 */
async function deliverToClaude(name, dir, topic, message, { stillWanted = () => true, onLater = () => undefined } = {}) {
  ensureIntegration(dir, name, ENGINE_URL);
  const ready = await ensureTerminal(name, dir, termEnv(name));
  let reason = ready.reason;
  if (ready.ok) {
    const r = sayToTerminal(name, message);
    if (r.sent) return { ok: true };
    reason = r.reason;
  }
  const key = `${name}:${topic}`;
  clearInterval(pendingDelivery.get(key));
  const t0 = Date.now();
  const timer = setInterval(() => {
    const wanted = stillWanted();
    if (!wanted || Date.now() - t0 > DELIVERY_WINDOW_MS) {
      clearInterval(timer);
      pendingDelivery.delete(key);
      if (wanted) onLater({ ok: false, reason: `${reason} The message wasn't delivered; use the button again once that's done.` });
      return;
    }
    if (panelState(name) !== "ready") return;
    if (sayToTerminal(name, message).sent) {
      clearInterval(timer);
      pendingDelivery.delete(key);
      onLater({ ok: true });
    }
  }, 5000);
  pendingDelivery.set(key, timer);
  return { ok: false, pending: true, reason };
}

/** A render failure -> the project's Claude panel. */
async function tellClaude(name, dir, job, { automatic }) {
  return deliverToClaude(name, dir, "render", failureMessage(job, { automatic }), {
    stillWanted: () => {
      const cur = getJob(name, dir);
      return !!cur && cur.id === job.id && cur.status === "failed";
    },
    onLater: (r) => noteClaude(name, dir, { ...r, automatic }),
  });
}
setRenderHooks({ onFailure: tellClaude });

app.get("/api/projects/:name/render", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  res.json({ plan: computePlan(dir), job: getJob(req.params.name, dir), live: liveInfo(req.params.name) });
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
app.post("/api/youtube/connect", wrap((req, res) => res.json({ url: authUrl(REDIRECT_URI) })));
app.post("/api/youtube/disconnect", wrap((req, res) => res.json(youtubeDisconnect())));
// Google sends the browser back to http://127.0.0.1:<port>/?code=…&state=… after sign-in
app.get("/", async (req, res, next) => {
  if (!isOAuthCallback(req.query)) return next();
  const page = (title, body) =>
    `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="background:#08070a;color:#ede3d1;font:16px Segoe UI,sans-serif;padding:48px"><h2 style="font-family:Georgia,serif;font-weight:400">${title}</h2><p>${body}</p><p><a style="color:#94d1ff" href="/">Back to the content engine</a></p>`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
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
  res.json({ video: await videoInfo(dir), drafts, problems: Object.fromEntries(PLATFORMS.map((p) => [p, draftProblems(p, drafts[p])])), state: publishState(dir), youtube: { ...youtubeStatus(), live: youtubeLive(req.params.name) } });
}));
app.put("/api/projects/:name/publish/:platform", wrap((req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  if (!PLATFORMS.includes(req.params.platform)) return res.status(404).json({ error: "unknown platform" });
  res.json(saveDraft(dir, req.params.platform, req.body ?? {}));
}));
app.post("/api/projects/:name/publish/youtube/start", wrap(async (req, res) => {
  const dir = project(req, res);
  if (dir) res.json(await startYouTube(req.params.name, dir));
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
  if (!fs.existsSync(path.join(dir, "out", "delivery.mp4"))) return res.status(400).json({ error: "There's no final video yet: render it on the Final tab first." });
  const problems = draftProblems(platform, getDraft(dir, platform));
  if (problems.length) return res.status(400).json({ error: problems.join(" ") });
  const r = await deliverToClaude(req.params.name, dir, `publish-${platform}`, handoffMessage(dir, platform), {
    stillWanted: () => !["posted", "handed"].includes(publishState(dir)[platform]?.status),
    onLater: (x) => x.ok && publishReport(dir, platform, { status: "handed" }),
  });
  if (r.ok) publishReport(dir, platform, { status: "handed" });
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
  res.json(await deliverToClaude(req.params.name, dir, "publish-draft", message));
}));
app.post("/api/projects/:name/publish/reveal", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const target = path.join(dir, "out", "delivery.mp4");
  if (!fs.existsSync(target)) return res.status(404).json({ error: "out/delivery.mp4 doesn't exist yet" });
  execFile("explorer.exe", [`/select,${target}`], () => undefined);
  res.json({ ok: true });
});

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
  res.sendFile(full);
});
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
app.post("/api/projects/:name/say", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const text = String(req.body.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "nothing to say" });
  res.json(sayToTerminal(req.params.name, text));
});

// ---- the page
app.use(express.static(DIST, { index: false }));
app.get(/^\/(?!api\/|mcp\/|ws\/).*/, (req, res) => {
  const index = path.join(DIST, "index.html");
  if (!fs.existsSync(index)) return res.status(500).send("The website is not built yet: run  npm run build  in content-engine/app");
  res.sendFile(index);
});

// ---- server + terminal websocket
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  const m = /^\/ws\/terminal\/([^/?]+)/.exec(req.url ?? "");
  const name = m ? decodeURIComponent(m[1]) : null;
  const dir = name ? findProject(workspace(), name) : null;
  if (!dir || !OWN_HOSTS.has(req.headers.host ?? "") || !OWN_ORIGINS.has(req.headers.origin ?? "")) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    return socket.destroy();
  }
  wss.handleUpgrade(req, socket, head, (ws) => attachTerminal(ws, name, dir, { CE_ENGINE_URL: ENGINE_URL, CE_PROJECT: name }));
});

const shutdown = () => {
  shutdownRenders();
  stopAllStudios();
  killAllTerminals();
  process.exit(0);
};
// Ctrl+C, Ctrl+Break, closing the console window: stop the Studios and terminals this server started
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) process.on(sig, shutdown);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`content engine: ${ENGINE_URL}`);
  recoverUploads(listProjects(workspace()).filter((p) => p.engine));
  const n = recoverJobs(workspace());
  if (n) console.log(`${n} final render(s) were interrupted when the engine last stopped: Resume them on their Final tab.`);
});
