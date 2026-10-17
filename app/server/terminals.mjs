/**
 * One terminal per project, running Claude Code in the project folder, shown in the website through a WebSocket.
 * The terminal keeps running when the page reloads; a reconnecting page gets the recent output replayed.
 */
import { execFileSync } from "node:child_process";
import pty from "node-pty";

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
  return { ...env, ...extra, TERM: "xterm-256color", COLORTERM: "truecolor" };
}

function start(name, dir, extraEnv, cols = 100, rows = 30) {
  const sh = shell();
  const args = sh === "cmd.exe" ? ["/k", "claude"] : ["-NoLogo", "-NoExit", "-Command", "claude"];
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
      const fresh = start(name, dir, extraEnv, msg.cols || 100, msg.rows || 30);
      for (const c of clients) {
        fresh.clients.add(c);
        if (c.readyState === 1) c.send("\x1bc"); // clear the screen
      }
    }
  });
  ws.on("close", () => sessions.get(name)?.clients.delete(ws));
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
