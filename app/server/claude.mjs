/**
 * One Claude Code per project, shown in the website as a chat. Claude runs on this PC without a screen
 * (`claude -p` with stream-json in and out); the engine turns its output into chat items (messages, tool steps,
 * questions) and sends them to the page over a WebSocket. The page's actions (send, answer, stop…) are API calls.
 *
 * - Claude starts when a message is sent (about a second), continuing the project's latest conversation, and closes
 *   after 15 idle minutes. Earlier messages come from Claude Code's own saved conversation file.
 * - Permission questions and Claude's own questions (AskUserQuestion) wait for the user's answer in the page; the
 *   engine never answers them. A message sent meanwhile waits in Claude's queue (it doesn't answer or cancel them).
 * - "Open in a terminal" runs the same conversation in a normal Claude Code window on this PC; the chat pauses until
 *   that window closes.
 */
import { execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ENGINE_DIR } from "../../cli/projects.mjs";

const IDLE_MS = Number(process.env.CE_CLAUDE_IDLE_MS) || 15 * 60 * 1000; // CE_CLAUDE_IDLE_MS: tests
const MAX_ITEMS = 600; // items kept for the page (older ones stay in Claude's conversation, just not shown)
const OUTPUT_CHARS = 3000; // of each tool result shown under a step
export const MODES = ["auto", "manual"]; // the page shows them as Auto / Ask first
const SAVED = path.join(".claude", "engine-chat.json"); // per project: { mode, fresh }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** name -> session (see session()) */
const sessions = new Map();

// ---------------------------------------------------------------- starting Claude Code

let launcherCache = null;
/** How to start `claude`: the .exe itself when it can be found (npm's claude.cmd shim names it), otherwise the
 *  first claude.cmd/.bat on PATH through cmd.exe (the tests' fake Claude). */
function launcher() {
  if (launcherCache) return launcherCache;
  let found = [];
  try {
    found = execFileSync("where.exe", ["claude"], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
  } catch {
    return null;
  }
  for (const f of found) {
    const ext = path.extname(f).toLowerCase();
    if (ext === ".exe") return (launcherCache = { exe: f });
    if (ext === ".cmd" || ext === ".bat") {
      const m = /"%dp0%\\([^"]+?\.exe)"/i.exec(fs.readFileSync(f, "utf8"));
      const exe = m && path.join(path.dirname(f), m[1]);
      return (launcherCache = exe && fs.existsSync(exe) ? { exe } : { cmd: f });
    }
  }
  return null;
}

/** Environment for Claude Code: without the variables of any Claude Code session that started the engine itself. */
function cleanEnv(extra) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CLAUDE_?CODE|^CLAUDECODE$/i.test(k)) env[k] = v;
  // `ce` available to Claude's own commands (ce.cmd for PowerShell/cmd, ce for Git Bash)
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") ?? "Path";
  env[pathKey] = `${ENGINE_DIR};${env[pathKey] ?? ""}`;
  return { ...env, ...extra };
}

/**
 * Claude Code with its input and output connected to the engine; or (window) in a console window of its own, through
 * `start /wait` so the returned process lives as long as that window. Arguments are only flags, modes and UUIDs
 * (checked by the callers) and the title is made safe, so quoting each one is enough for cmd.exe.
 */
function spawnClaude(args, cwd, env, { window = null } = {}) {
  const l = launcher();
  if (!l) throw new Error("The claude command wasn't found on this PC (it isn't on PATH).");
  const quoted = [l.exe ?? l.cmd, ...args].map((a) => `"${a}"`).join(" ");
  if (window) {
    // `start` would run a .cmd through `cmd /K`, which mangles the quotes and keeps the window open: call it instead
    const line = `start "${window.replace(/[^\w .-]/g, "-")}" /wait ${l.exe ? quoted : `cmd.exe /d /c call ${quoted}`}`;
    return spawn("cmd.exe", ["/d", "/s", "/c", `"${line}"`], { cwd, env, stdio: "ignore", windowsHide: true, windowsVerbatimArguments: true });
  }
  const opts = { cwd, env, stdio: ["pipe", "pipe", "pipe"], windowsHide: true };
  if (l.exe) return spawn(l.exe, args, opts);
  return spawn("cmd.exe", ["/d", "/s", "/c", `"${quoted}"`], { ...opts, windowsVerbatimArguments: true });
}

function killTree(proc) {
  if (!proc || proc.exitCode !== null) return;
  try {
    execFileSync("taskkill", ["/pid", String(proc.pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    try {
      proc.kill();
    } catch {
      // already gone
    }
  }
}

// ---------------------------------------------------------------- Claude Code's saved conversations

const claudeHome = () => process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
/** Claude Code keeps a folder's conversations in ~/.claude/projects/<the path with every other character as "-">. */
const transcriptDir = (dir) => path.join(claudeHome(), "projects", path.resolve(dir).replace(/[^a-zA-Z0-9]/g, "-"));
const transcriptFile = (dir, id) => path.join(transcriptDir(dir), `${id}.jsonl`);

/** The project's most recent conversation (what `claude --continue` would pick), or null. */
function latestSession(dir) {
  try {
    const td = transcriptDir(dir);
    const files = fs.readdirSync(td).filter((f) => f.endsWith(".jsonl") && UUID.test(f.slice(0, -6)));
    files.sort((a, b) => fs.statSync(path.join(td, b)).mtimeMs - fs.statSync(path.join(td, a)).mtimeMs);
    return files[0]?.slice(0, -6) ?? null;
  } catch {
    return null;
  }
}

function readSaved(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, SAVED), "utf8"));
  } catch {
    return {};
  }
}
function writeSaved(s) {
  try {
    fs.mkdirSync(path.join(s.dir, ".claude"), { recursive: true });
    fs.writeFileSync(path.join(s.dir, SAVED), JSON.stringify({ mode: s.mode, fresh: s.fresh || undefined }, null, 2) + "\n");
  } catch {
    // the setting just isn't remembered
  }
}

// ---------------------------------------------------------------- chat items

const rid = () => crypto.randomUUID();
const base = (p) => String(p ?? "").split(/[\\/]/).pop();
const short = (t, n = 140) => {
  const s = String(t ?? "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
};

/** What the engine's own MCP tools did, in words. */
const ENGINE_TOOLS = {
  editor_state: "Checked where you are in the editor",
  timeline: "Read the timeline",
  view_frame: "Looked at the frame",
  seek: "Moved the playhead",
  playback: "Played or paused the preview",
  show_setting: "Opened a setting in Studio",
  render_status: "Checked the final render",
  render_start: "Started the final render",
  render_resume: "Resumed the final render",
  render_stop: "Stopped the final render",
  publish_status: "Checked the publishing state",
  publish_report: "Reported a post's status",
  youtube_upload: "Started a YouTube upload",
  chrome_check_report: "Reported the Chrome check",
};

/** One line for a tool call, and its kind (the page groups steps by kind: "Ran 3 commands, read 2 files"). */
export function describeTool(name, input = {}) {
  const i = input && typeof input === "object" ? input : {};
  switch (name) {
    case "Bash":
    case "PowerShell":
      return { kind: "command", label: short(i.description || i.command) };
    case "Read":
      return { kind: "read", label: `Read ${base(i.file_path)}` };
    case "Write":
      return { kind: "edit", label: `Wrote ${base(i.file_path)}` };
    case "Edit":
    case "MultiEdit":
      return { kind: "edit", label: `Edited ${base(i.file_path)}` };
    case "NotebookEdit":
      return { kind: "edit", label: `Edited ${base(i.notebook_path)}` };
    case "Glob":
    case "Grep":
      return { kind: "search", label: `Searched for ${short(i.pattern, 80)}` };
    case "WebFetch":
      return { kind: "web", label: `Opened ${short(i.url, 100)}` };
    case "WebSearch":
      return { kind: "web", label: `Searched the web: ${short(i.query, 100)}` };
    case "Skill":
      return { kind: "other", label: `Used the ${i.skill ?? i.command ?? ""} skill` };
    case "Task":
    case "Agent":
      return { kind: "agent", label: `Asked a helper: ${short(i.description, 100)}` };
    case "TodoWrite":
    case "TaskCreate":
    case "TaskUpdate":
      return { kind: "other", label: "Updated its to-do list" };
    case "ToolSearch":
      return { kind: "other", label: "Looked up its tools" };
  }
  const m = /^mcp__(.+?)__(.+)$/.exec(name);
  if (m && m[1] === "content-engine") return { kind: "engine", label: ENGINE_TOOLS[m[2]] ?? m[2].replace(/_/g, " ") };
  if (m && m[1] === "claude-in-chrome") return { kind: "chrome", label: `Chrome: ${m[2].replace(/_mcp$/, "").replace(/_/g, " ")}${i.url ? ` ${short(i.url, 80)}` : ""}` };
  if (m) return { kind: "other", label: `${m[1]}: ${m[2].replace(/_/g, " ")}` };
  return { kind: "other", label: name };
}

/** A permission question in words: what Claude wants to do. */
function describePermission(req) {
  const i = req.input ?? {};
  const t = req.tool_name;
  if (t === "Bash" || t === "PowerShell") return { title: "Run a command", detail: String(i.command ?? ""), note: i.description ?? null };
  if (["Edit", "MultiEdit", "Write", "NotebookEdit"].includes(t)) return { title: t === "Write" ? "Write a file" : "Edit a file", detail: String(i.file_path ?? i.notebook_path ?? ""), note: null };
  if (t === "WebFetch") return { title: "Open a web page", detail: String(i.url ?? ""), note: null };
  if (t === "WebSearch") return { title: "Search the web", detail: String(i.query ?? ""), note: null };
  if (t === "ExitPlanMode") return { title: "Go ahead with this plan", detail: String(i.plan ?? ""), note: null };
  const m = /^mcp__(.+?)__(.+)$/.exec(t);
  const json = JSON.stringify(i, null, 1);
  const detail = json === "{}" ? "" : json.length > 1500 ? json.slice(0, 1500) + "…" : json;
  if (m && m[1] === "claude-in-chrome") return { title: `use Chrome (${m[2].replace(/_mcp$/, "").replace(/_/g, " ")})`, detail, note: null };
  if (m) return { title: `use the ${m[2].replace(/_/g, " ")} tool (${m[1]})`, detail, note: null };
  return { title: `use ${t}`, detail, note: null };
}

const resultText = (content) => {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((c) => (c.type === "text" ? c.text : c.type === "image" ? "[image]" : "")).filter(Boolean).join("\n");
};

/** A user message as typed, or null when it isn't one (skill text, command output, …); notices for some. */
function userText(raw) {
  let t = String(raw ?? "");
  const cmd = /<command-name>([^<]*)<\/command-name>/.exec(t);
  if (cmd) {
    const args = /<command-args>([\s\S]*?)<\/command-args>/.exec(t)?.[1]?.trim();
    return { text: `${cmd[1].trim()}${args ? ` ${args}` : ""}` };
  }
  if (/^\s*<(local-command-|bash-|command-message|task-notification)/.test(t)) return null;
  if (/^\s*\[Request interrupted by user/.test(t)) return { notice: "Stopped." };
  t = t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").trim();
  return t ? { text: t } : null;
}

const duration = (ms) => {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};

/** Adds items to a session from Claude's messages (live output and saved conversations have the same shape). */
function addItem(s, item) {
  s.items.push(item);
  s.byId.set(item.id, item);
  if (item.kind !== "tools") s.group = null;
  if (s.items.length > MAX_ITEMS) {
    const drop = s.items.splice(0, s.items.length - MAX_ITEMS);
    for (const d of drop) s.byId.delete(d.id);
    s.trimmed += drop.length;
  }
  if (s.live) send(s, { type: "item", item });
  return item;
}
const changed = (s, item) => s.live && send(s, { type: "item", item });

function notice(s, text, tone) {
  const last = s.items.at(-1);
  if (last?.kind === "notice" && last.text === text) return;
  addItem(s, { kind: "notice", id: rid(), text, tone });
}

function onAssistant(s, m) {
  if (m.parent_tool_use_id || m.isSidechain) return;
  const msg = m.message ?? {};
  const key = msg.id ?? m.uuid ?? rid();
  let idx = s.blocks.get(key) ?? 0;
  for (const c of Array.isArray(msg.content) ? msg.content : []) {
    const id = `${key}:${idx++}`;
    if (c.type === "text") {
      // the item streamed for this block (same message, same block number; else the message's streaming one)
      const it = s.byId.get(id) ?? s.items.findLast((x) => x.kind === "text" && x.streaming && x.id.startsWith(`${key}:`));
      if (it) {
        it.text = c.text;
        delete it.streaming;
        changed(s, it);
      } else if (c.text.trim()) addItem(s, { kind: "text", id, text: c.text });
    } else if (c.type === "tool_use") {
      if (c.name === "AskUserQuestion") {
        // live: the question card comes from Claude's request for an answer; saved conversations only have the call
        if (s.history) s.asked.set(c.id, addItem(s, { kind: "question", id: c.id, questions: questionsOf(c.input), answer: "answered" }));
        continue;
      }
      const d = describeTool(c.name, c.input);
      const step = { id: c.id, tool: c.name, kind: d.kind, label: d.label, status: "running" };
      if (s.group && s.items.at(-1) === s.group) {
        s.group.steps.push(step);
        changed(s, s.group);
      } else {
        s.group = addItem(s, { kind: "tools", id: `tools:${c.id}`, steps: [step] });
      }
      s.steps.set(c.id, { item: s.group, step });
    }
  }
  s.blocks.set(key, idx);
}

function onUser(s, m) {
  if (m.parent_tool_use_id || m.isSidechain || m.isMeta || m.isCompactSummary) return;
  const content = m.message?.content;
  const parts = typeof content === "string" ? [{ type: "text", text: content }] : Array.isArray(content) ? content : [];
  for (const c of parts) {
    if (c.type === "tool_result" && s.asked.has(c.tool_use_id)) {
      // 'Your questions have been answered: "question"="answer". …'
      const item = s.asked.get(c.tool_use_id);
      const answers = {};
      for (const a of resultText(c.content).matchAll(/"([^"]*)"="([^"]*)"/g)) answers[a[1]] = a[2];
      item.answer = Object.keys(answers).length ? answers : c.is_error ? "cancelled" : "answered";
    } else if (c.type === "tool_result") {
      const found = s.steps.get(c.tool_use_id);
      if (!found) continue;
      found.step.status = c.is_error ? "error" : "done";
      const out = resultText(c.content);
      if (out) found.step.output = out.length > OUTPUT_CHARS ? out.slice(0, OUTPUT_CHARS) + "\n…" : out;
      changed(s, found.item);
    } else if (c.type === "text" && s.history) {
      // live user messages are added when sent; the saved conversation has them as text
      const u = userText(c.text);
      if (u?.notice) notice(s, u.notice);
      else if (u) addItem(s, { kind: "user", id: m.uuid ?? rid(), text: u.text, from: /^\[content engine\]/.test(u.text) ? "engine" : undefined });
    }
  }
}

/** The page's items for a saved conversation (the caller sends the page a snapshot afterwards). */
function loadHistory(s) {
  s.items = [];
  s.byId = new Map();
  s.steps = new Map();
  s.blocks = new Map();
  s.asked = new Map();
  s.group = null;
  s.trimmed = 0;
  if (!s.sessionId || s.fresh) return;
  let text;
  try {
    text = fs.readFileSync(transcriptFile(s.dir, s.sessionId), "utf8");
  } catch {
    return;
  }
  const live = s.live;
  s.live = false;
  s.history = true;
  let bad = 0;
  try {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let m;
      try {
        m = JSON.parse(line);
      } catch {
        bad++;
        continue;
      }
      if (m.isSidechain) continue;
      if (m.type === "assistant") onAssistant(s, m);
      else if (m.type === "user") onUser(s, m);
      else if (m.type === "system" && m.subtype === "turn_duration" && m.durationMs) notice(s, `Worked for ${duration(m.durationMs)}`, "dim");
      else if (m.type === "system" && m.subtype === "compact_boundary") notice(s, "Conversation compacted.", "dim");
    }
  } catch {
    // an unreadable conversation file: start the chat empty rather than fail
    bad++;
  }
  s.history = false;
  for (const { step } of s.steps.values()) if (step.status === "running") step.status = "done";
  if (bad && !s.items.length) notice(s, "Earlier messages of this conversation couldn't be read; Claude still has them.", "dim");
  s.blocks = new Map();
  s.group = null;
  s.live = live;
}

const questionsOf = (input) =>
  (input?.questions ?? []).map((q) => ({
    question: String(q.question ?? ""),
    header: q.header ? String(q.header) : null,
    multiSelect: !!q.multiSelect,
    options: (q.options ?? []).map((o) => ({ label: String(o.label ?? ""), description: o.description ? String(o.description) : null })),
  }));

// ---------------------------------------------------------------- sessions

function session(name, dir, env) {
  let s = sessions.get(name);
  if (!s) {
    const saved = readSaved(dir);
    s = {
      name,
      dir,
      env: env ?? {},
      proc: null,
      external: null,
      status: "stopped", // stopped | starting | idle | working
      mode: MODES.includes(saved.mode) ? saved.mode : "auto",
      fresh: saved.fresh === true,
      sessionId: null,
      loaded: false,
      live: false,
      history: false,
      items: [],
      byId: new Map(),
      steps: new Map(),
      blocks: new Map(),
      asked: new Map(),
      group: null,
      trimmed: 0,
      pending: new Map(), // request_id -> { req, item }
      waiting: new Map(), // our control request_id -> resolve
      clients: new Set(),
      turnStartedAt: null,
      idleTimer: null,
      buf: "",
      stderr: "",
      ready: null,
      kickedOff: false,
    };
    sessions.set(name, s);
  }
  s.dir = dir;
  if (env) s.env = env;
  return s;
}

/** Load the conversation (once per engine run, and again after a terminal window closes). */
function ensureLoaded(s) {
  if (s.loaded) return;
  s.sessionId = s.fresh ? null : latestSession(s.dir);
  loadHistory(s);
  s.loaded = true;
  s.live = true;
}

function send(s, msg) {
  const data = JSON.stringify(msg);
  for (const ws of s.clients) if (ws.readyState === 1) ws.send(data);
}

function stateOf(s) {
  return {
    status: s.external ? "external" : s.pending.size ? "question" : s.status,
    mode: s.mode,
    turnStartedAt: s.turnStartedAt,
    sessionId: s.sessionId,
  };
}
const pushState = (s) => send(s, { type: "state", state: stateOf(s) });
const snapshot = (s) => ({ type: "snapshot", items: s.items, trimmed: s.trimmed, state: stateOf(s) });

function setStatus(s, status) {
  if (status === "working" && s.status !== "working") s.turnStartedAt = Date.now();
  if (status !== "working") s.turnStartedAt = null;
  s.status = status;
  clearTimeout(s.idleTimer);
  if (status === "idle")
    s.idleTimer = setTimeout(() => {
      if (s.status === "idle" && !s.pending.size) stopProcess(s);
    }, IDLE_MS);
  pushState(s);
}

function write(s, msg) {
  try {
    s.proc?.stdin.write(JSON.stringify(msg) + "\n");
  } catch {
    // the process is gone; its exit handler reports it
  }
}

function control(s, request) {
  const id = `ce-${rid()}`;
  write(s, { type: "control_request", request_id: id, request });
  return new Promise((resolve) => {
    s.waiting.set(id, resolve);
    setTimeout(() => {
      if (s.waiting.delete(id)) resolve(null);
    }, 30000);
  });
}

function start(s) {
  if (s.proc) return s.ready;
  const args = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--include-partial-messages", "--permission-prompt-tool", "stdio", "--permission-mode", s.mode, "--chrome"];
  if (s.sessionId && !s.fresh && UUID.test(s.sessionId)) args.push("--resume", s.sessionId);
  const proc = spawnClaude(args, s.dir, cleanEnv(s.env));
  s.proc = proc;
  s.buf = "";
  s.stderr = "";
  s.blocks = new Map();
  proc.stdin.on("error", () => undefined);
  proc.stdout.on("data", (d) => {
    if (s.proc !== proc) return;
    s.buf += d;
    let i;
    while ((i = s.buf.indexOf("\n")) >= 0) {
      const line = s.buf.slice(0, i);
      s.buf = s.buf.slice(i + 1);
      if (!line.trim()) continue;
      let m;
      try {
        m = JSON.parse(line);
      } catch {
        continue;
      }
      try {
        onMessage(s, m);
      } catch (e) {
        console.error(`${s.name}: Claude message not understood: ${e.message}`);
      }
    }
  });
  proc.stderr.on("data", (d) => {
    s.stderr = (s.stderr + d).slice(-4000);
  });
  let settle;
  s.ready = new Promise((r) => (settle = r));
  proc.on("error", (e) => {
    if (s.proc === proc) ended(s, proc, null, e.message);
  });
  proc.on("exit", (code) => {
    if (s.proc === proc) ended(s, proc, code);
  });
  setStatus(s, "starting");
  control(s, { subtype: "initialize" }).then((r) => {
    if (s.proc !== proc) return;
    if (s.status === "starting") setStatus(s, "idle");
    settle(r ? { ok: true } : { ok: false, reason: "Claude didn't answer in time." });
  });
  s.settle = settle;
  return s.ready;
}

function ended(s, proc, code, error) {
  s.proc = null;
  const wasWorking = s.status === "working" || s.status === "starting";
  cancelPending(s);
  for (const r of s.waiting.values()) r(null);
  s.waiting.clear();
  if (!s.stopping) {
    const why = error ?? (s.stderr.trim().split(/\r?\n/).slice(-3).join(" ") || `exit code ${code}`);
    if (wasWorking || code) notice(s, `Claude stopped unexpectedly (${short(why, 300)}). Your next message starts it again.`, "error");
  }
  s.settle?.({ ok: false, reason: `Claude didn't start: ${short(error ?? (s.stderr.trim() || `exit code ${code}`), 300)}` });
  s.stopping = false;
  setStatus(s, "stopped");
}

/** Close Claude (its conversation is kept); resolves once the process has exited. */
function stopProcess(s) {
  const proc = s.proc;
  if (!proc || proc.exitCode !== null) return Promise.resolve();
  s.stopping = true;
  const gone = new Promise((r) => proc.once("exit", r));
  try {
    proc.stdin.end();
  } catch {
    // already closed
  }
  const t = setTimeout(() => killTree(proc), 3000);
  return gone.then(() => clearTimeout(t));
}

/** Questions still waiting when a turn ends or Claude stops can't be answered any more. */
function cancelPending(s) {
  for (const { item } of s.pending.values()) {
    item.answer = "cancelled";
    changed(s, item);
  }
  s.pending.clear();
}

function onMessage(s, m) {
  switch (m.type) {
    case "control_response": {
      const id = m.response?.request_id;
      const r = s.waiting.get(id);
      if (r) {
        s.waiting.delete(id);
        r(m.response.subtype === "success" ? m.response.response ?? {} : null);
      }
      return;
    }
    case "control_request":
      return onControlRequest(s, m);
    case "control_cancel_request": {
      const p = s.pending.get(m.request_id);
      if (p) {
        s.pending.delete(m.request_id);
        p.item.answer = "cancelled";
        changed(s, p.item);
        pushState(s);
      }
      return;
    }
    case "system":
      if (m.subtype === "init") {
        if (m.session_id && m.session_id !== s.sessionId) {
          s.sessionId = m.session_id;
          if (s.fresh) {
            s.fresh = false;
            writeSaved(s);
          }
        }
        const engine = (m.mcp_servers ?? []).find((x) => x.name === "content-engine");
        if (engine && engine.status !== "connected" && !s.warnedTools) {
          s.warnedTools = true;
          notice(s, `The engine's tools didn't connect to Claude (${engine.status}): Claude can't see the editor or the render queue until the engine restarts.`, "error");
        }
      } else if (m.subtype === "status" && m.status === "compacting") notice(s, "Compacting the conversation…", "dim");
      else if (m.subtype === "compact_boundary") notice(s, "Conversation compacted.", "dim");
      if (m.subtype === "status" && m.status === "requesting" && s.status !== "working") setStatus(s, "working");
      return;
    case "stream_event": {
      if (m.parent_tool_use_id) return;
      const e = m.event ?? {};
      if (e.type === "message_start") s.streamMsg = e.message?.id;
      else if (e.type === "content_block_start" && e.content_block?.type === "text" && s.streamMsg) {
        const id = `${s.streamMsg}:${e.index}`;
        if (!s.byId.has(id)) addItem(s, { kind: "text", id, text: "", streaming: true });
      } else if (e.type === "content_block_delta" && e.delta?.type === "text_delta" && s.streamMsg) {
        const id = `${s.streamMsg}:${e.index}`;
        const it = s.byId.get(id);
        if (it) {
          it.text += e.delta.text;
          send(s, { type: "delta", id, text: e.delta.text });
        }
      }
      if (s.status !== "working") setStatus(s, "working");
      return;
    }
    case "assistant":
      if (s.status !== "working") setStatus(s, "working");
      return onAssistant(s, m);
    case "user":
      return onUser(s, m);
    case "result": {
      if (m.duration_ms) notice(s, `Worked for ${duration(m.duration_ms)}`, "dim");
      // after Stop the turn ends as an error; "Stopped." already says it
      if (m.is_error && !s.interrupted) notice(s, short(m.result || (m.errors ?? []).join(" ") || m.subtype || "Claude reported an error.", 600), "error");
      s.interrupted = false;
      cancelPending(s);
      for (const it of s.items) if (it.kind === "text" && it.streaming) delete it.streaming;
      for (const { step, item } of s.steps.values())
        if (step.status === "running") {
          step.status = "done";
          changed(s, item);
        }
      s.blocks = new Map();
      setStatus(s, "idle");
      return;
    }
  }
}

function onControlRequest(s, m) {
  const req = m.request ?? {};
  if (req.subtype !== "can_use_tool") {
    write(s, { type: "control_response", response: { subtype: "error", request_id: m.request_id, error: `not supported by the content engine: ${req.subtype}` } });
    return;
  }
  let item;
  if (req.tool_name === "AskUserQuestion") {
    item = addItem(s, { kind: "question", id: m.request_id, questions: questionsOf(req.input) });
  } else {
    const d = describePermission(req);
    item = addItem(s, { kind: "permission", id: m.request_id, tool: req.tool_name, ...d, canAlways: Array.isArray(req.permission_suggestions) && req.permission_suggestions.length > 0 });
  }
  s.pending.set(m.request_id, { req, item });
  pushState(s);
}

// ---------------------------------------------------------------- what the engine and the page call

/** The page's WebSocket for a project's chat: a snapshot, then items and state as they change. */
export function attachChat(ws, name, dir, env, { onFirstOpen } = {}) {
  const s = session(name, dir, env);
  ensureLoaded(s);
  s.clients.add(ws);
  ws.send(JSON.stringify(snapshot(s)));
  ws.on("close", () => s.clients.delete(ws));
  // a new video: Claude starts the guided conversation by itself, once
  if (!s.kickedOff && !s.sessionId && !s.external && !s.proc && onFirstOpen?.()) {
    s.kickedOff = true;
    sendMessage(name, dir, env, "/make-video");
  }
}

/**
 * Send a message to the project's Claude (started if needed). It is queued if Claude is busy or waiting for an answer.
 * Resolves {ok:true} once Claude is running, or {ok:false, reason}.
 */
export async function sendMessage(name, dir, env, text, { from } = {}) {
  const s = session(name, dir, env);
  ensureLoaded(s);
  if (s.external) return { ok: false, reason: "Claude is open in a terminal window on this PC: close that window first, or type it there." };
  let ready;
  try {
    ready = start(s);
  } catch (e) {
    return { ok: false, reason: e.message };
  }
  const item = addItem(s, { kind: "user", id: rid(), text, from });
  write(s, { type: "user", message: { role: "user", content: text }, parent_tool_use_id: null, session_id: "" });
  if (s.status !== "starting") setStatus(s, "working");
  const r = await ready;
  if (!r.ok) {
    item.failed = true;
    changed(s, item);
  } else if (s.status === "idle") setStatus(s, "working");
  return r;
}

/** The user's answer to a pending question: {decision: "allow"|"always"|"deny"} or {answers: {question: answer}}. */
export function answer(name, id, body) {
  const s = sessions.get(name);
  const p = s?.pending.get(id);
  if (!p) throw new Error("That question isn't waiting for an answer any more.");
  const { req, item } = p;
  let response;
  if (item.kind === "question") {
    const answers = {};
    for (const q of item.questions) {
      const a = body?.answers?.[q.question];
      if (typeof a !== "string" || !a.trim()) throw new Error(`Answer "${q.question}" first.`);
      answers[q.question] = a.trim().slice(0, 2000);
    }
    response = { behavior: "allow", updatedInput: { ...req.input, answers } };
    item.answer = answers;
  } else {
    const decision = body?.decision;
    if (!["allow", "always", "deny"].includes(decision)) throw new Error("unknown decision");
    if (decision === "deny") response = { behavior: "deny", message: "The user said no (in the content engine)." };
    else response = { behavior: "allow", updatedInput: req.input, ...(decision === "always" && item.canAlways ? { updatedPermissions: req.permission_suggestions } : {}) };
    item.answer = decision;
  }
  write(s, { type: "control_response", response: { subtype: "success", request_id: id, response } });
  s.pending.delete(id);
  changed(s, item);
  pushState(s);
  return { ok: true };
}

/** Stop what Claude is doing (like Esc in the terminal). */
export async function interrupt(name) {
  const s = sessions.get(name);
  if (!s?.proc || (s.status !== "working" && !s.pending.size)) return { ok: true };
  s.interrupted = true;
  const r = await control(s, { subtype: "interrupt" });
  notice(s, "Stopped.");
  return { ok: !!r };
}

export async function setMode(name, dir, env, mode) {
  if (!MODES.includes(mode)) throw new Error("unknown mode");
  const s = session(name, dir, env);
  s.mode = mode;
  writeSaved(s);
  if (s.proc) await control(s, { subtype: "set_permission_mode", mode });
  pushState(s);
  return stateOf(s);
}

/** Start a new conversation; the old one stays in Claude Code's saved conversations. */
export async function newConversation(name, dir, env) {
  const s = session(name, dir, env);
  if (s.external) throw new Error("Claude is open in a terminal window on this PC: close that window first.");
  await stopProcess(s);
  s.fresh = true;
  s.sessionId = null;
  s.kickedOff = true;
  writeSaved(s);
  loadHistory(s);
  send(s, snapshot(s));
  return { ok: true };
}

/** The same conversation in a normal Claude Code window on this PC; the chat waits until that window closes. */
export async function openInTerminal(name, dir, env, title) {
  const s = session(name, dir, env);
  ensureLoaded(s);
  if (s.external) return { ok: true, already: true };
  if (s.status === "working" || s.status === "starting" || s.pending.size) throw new Error("Claude is busy here: wait until it's done (or Stop it), then open it in a terminal.");
  await stopProcess(s);
  const args = s.sessionId && !s.fresh && UUID.test(s.sessionId) ? ["--resume", s.sessionId] : [];
  const proc = spawnClaude(args, dir, cleanEnv(s.env), { window: `Claude - ${title || name}` });
  s.external = proc;
  proc.on("error", () => closed());
  proc.on("exit", () => closed());
  function closed() {
    if (s.external !== proc) return;
    s.external = null;
    // the window may have added to the conversation (or started another one): read it again
    s.fresh = false;
    writeSaved(s);
    s.loaded = false;
    ensureLoaded(s);
    send(s, snapshot(s));
  }
  pushState(s);
  return { ok: true };
}

/** For the API and the engine: stopped | starting | idle | working | question | external. */
export function chatState(name) {
  const s = sessions.get(name);
  return s ? stateOf(s).status : "stopped";
}

export function killClaude(name) {
  const s = sessions.get(name);
  if (!s) return;
  s.stopping = true;
  killTree(s.proc);
  killTree(s.external);
  for (const ws of s.clients) ws.close();
  sessions.delete(name);
}

export function killAllClaude() {
  for (const s of sessions.values()) {
    s.stopping = true;
    killTree(s.proc);
  }
}
