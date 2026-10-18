/**
 * One terminal per project, running Claude Code in the project folder, shown in the website through a WebSocket.
 * The terminal keeps running when the page reloads; a reconnecting page gets the recent output replayed.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import pty from "node-pty";
import { ENGINE_DIR } from "../../cli/projects.mjs";

const MAX_BUFFER = 400_000;
/** name -> { pty, buffer, clients: Set<ws>, exited } */
const sessions = new Map();

let shellCache = null;
function shell() {
  if (shellCache) return shellCache;
  for (const exe of ["pwsh.exe", "powershell.exe"]) {
    try {
      execFileSync("where.exe", [exe], { stdio: "ignore" });
      return (shellCache = exe);
    } catch {
      // try the next one
    }
  }
  return (shellCache = "cmd.exe");
}

/** Environment for Claude Code: without the variables of any Claude Code session that started the engine itself. */
function cleanEnv(extra) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CLAUDE_?CODE|^CLAUDECODE$/i.test(k)) env[k] = v;
  // `ce` available to Claude's own commands (ce.cmd for PowerShell/cmd, ce for Git Bash)
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") ?? "Path";
  env[pathKey] = `${ENGINE_DIR};${env[pathKey] ?? ""}`;
  return { ...env, ...extra, TERM: "xterm-256color", COLORTERM: "truecolor" };
}

/** How Claude Code starts: a new video begins the guided /make-video conversation; otherwise continue the
 *  project's last conversation (falls back to a new one when there is none); "fresh" is a new conversation. */
function claudeCommand(dir, mode) {
  if (mode === "fresh") return "claude";
  try {
    const st = JSON.parse(fs.readFileSync(path.join(dir, "brief", "status.json"), "utf8"));
    if (st.stage === "new") return 'claude "/make-video"';
  } catch {
    // no brief status: an existing project
  }
  return "claude --continue; if ($LASTEXITCODE -ne 0) { claude }";
}

function start(name, dir, extraEnv, cols = 100, rows = 30, mode = "auto") {
  const sh = shell();
  const cmd = claudeCommand(dir, mode);
  const args = sh === "cmd.exe" ? ["/k", mode === "fresh" ? "claude" : "claude --continue || claude"] : ["-NoLogo", "-NoExit", "-Command", cmd];
  const p = pty.spawn(sh, args, { name: "xterm-256color", cols, rows, cwd: dir, env: cleanEnv(extraEnv) });
  const s = { pty: p, buffer: "", clients: new Set(), exited: false };
  p.onData((d) => {
    s.buffer += d;
    if (s.buffer.length > MAX_BUFFER) s.buffer = s.buffer.slice(-MAX_BUFFER);
    for (const ws of s.clients) if (ws.readyState === 1) ws.send(d);
  });
  p.onExit(() => {
    s.exited = true;
    for (const ws of s.clients) if (ws.readyState === 1) ws.send("\r\n\x1b[2m[terminal closed — use Restart]\x1b[0m\r\n");
  });
  sessions.set(name, s);
  return s;
}

export function attachTerminal(ws, name, dir, extraEnv) {
  let s = sessions.get(name);
  if (!s || s.exited) s = start(name, dir, extraEnv);
  s.clients.add(ws);
  if (s.buffer) ws.send(s.buffer);
  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    const cur = sessions.get(name);
    if (!cur) return;
    if (msg.type === "input" && typeof msg.data === "string" && !cur.exited) cur.pty.write(msg.data);
    else if (msg.type === "resize" && msg.cols > 0 && msg.rows > 0 && !cur.exited) cur.pty.resize(Math.floor(msg.cols), Math.floor(msg.rows));
    else if (msg.type === "restart") {
      const clients = [...cur.clients];
      cur.clients.clear(); // so the old terminal's exit message doesn't reach the page
      killTerminal(name);
      const fresh = start(name, dir, extraEnv, msg.cols || 100, msg.rows || 30, "fresh");
      for (const c of clients) {
        fresh.clients.add(c);
        if (c.readyState === 1) c.send("\x1bc"); // clear the screen
      }
    }
  });
  ws.on("close", () => sessions.get(name)?.clients.delete(ws));
}

/** Type a message into the project's Claude panel and press Enter (used by the board's buttons). */
export function sayToTerminal(name, text) {
  const s = sessions.get(name);
  if (!s || s.exited) return false;
  // send the text as a bracketed paste, then Enter as its own keystroke: an Enter that arrives inside what Claude Code
  // sees as one paste is stripped ("Removed 1 invisible character") and the message would wait for a manual Enter
  s.pty.write(`\x1b[200~${text.replace(/[\r\n]+/g, " ")}\x1b[201~`);
  setTimeout(() => !s.exited && s.pty.write("\r"), 700);
  return true;
}

export function killTerminal(name) {
  const s = sessions.get(name);
  if (!s) return;
  try {
    if (!s.exited) execFileSync("taskkill", ["/pid", String(s.pty.pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    try {
      s.pty.kill();
    } catch {
      // already gone
    }
  }
  sessions.delete(name);
}

export function killAllTerminals() {
  for (const name of [...sessions.keys()]) killTerminal(name);
}
