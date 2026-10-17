/**
 * The content engine website: http://127.0.0.1:<appPort> (only reachable from this computer).
 *   /                 projects, new video, settings
 *   /p/<project>      editor: the project's Remotion Studio + Claude Code terminal
 *   /api/...          JSON API for the page; /api/bridge/... for the EngineBridge inside Studio
 *   /mcp/<project>    MCP endpoint for Claude Code (tools: editor_state, timeline, view_frame, seek, playback, show_setting)
 *   /ws/terminal/<p>  the Claude Code terminal
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";
import { createProject, findProject, linkStatus, listProjects, loadSettings, RUNTIME_MODULES, saveSettings } from "../../cli/projects.mjs";
import { getState, openChannel, resolveResult, updateState } from "./bridge.mjs";
import { contextText, describe, loadProject } from "./context.mjs";
import { ensureIntegration } from "./integration.mjs";
import { handleMcp } from "./mcp.mjs";
import { ensureStudio, stopAllStudios, stopStudio, studioInfo } from "./studios.mjs";
import { attachTerminal, killAllTerminals } from "./terminals.mjs";

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

const workspace = () => loadSettings().workspace;
const project = (req, res) => {
  const dir = findProject(workspace(), req.params.name);
  if (!dir) res.status(404).json({ error: `no engine project "${req.params.name}" in the workspace` });
  return dir;
};
const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => res.status(500).json({ error: e.message }));

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

app.get("/api/projects", (req, res) => res.json(listProjects(workspace()).map(({ dir, ...p }) => ({ ...p, dir, studio: studioInfo(p.name).status }))));
app.post("/api/projects", wrap((req, res) => {
  const title = String(req.body.title ?? "").trim();
  if (!title) return res.status(400).json({ error: "give the video a title" });
  const dir = createProject({ workspace: workspace(), slug: req.body.slug || title, title });
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
app.get("/api/projects/:name/context", (req, res) => {
  const dir = project(req, res);
  if (!dir) return;
  const d = describe(dir, getState(req.params.name));
  res.json({ ...d, text: contextText(d) });
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
  stopAllStudios();
  killAllTerminals();
  process.exit(0);
};
// Ctrl+C, Ctrl+Break, closing the console window: stop the Studios and terminals this server started
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"]) process.on(sig, shutdown);

server.listen(PORT, "127.0.0.1", () => console.log(`content engine: ${ENGINE_URL}`));
