/**
 * One Remotion Studio per open project, started by the website on a free port.
 * Studio gets REMOTION_ENGINE_URL / REMOTION_ENGINE_PROJECT so the project's EngineBridge can talk to the engine.
 */
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { linkProject } from "../../cli/projects.mjs";

/** name -> { port, url, status: "starting"|"ready"|"exited", proc, log: string[], error } */
const studios = new Map();

const portFree = (port) =>
  new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    s.once("listening", () => s.close(() => resolve(true)));
    s.listen(port, "0.0.0.0");
  });

async function freePort(base) {
  const used = new Set([...studios.values()].map((s) => s.port));
  for (let p = base; p < base + 100; p++) if (!used.has(p) && (await portFree(p))) return p;
  throw new Error(`no free port between ${base} and ${base + 99}`);
}

export function studioInfo(name) {
  const s = studios.get(name);
  return s ? { port: s.port, url: s.url, status: s.status, error: s.error ?? null, log: s.log.slice(-30) } : { status: "stopped" };
}

export async function ensureStudio(name, dir, { engineUrl, portBase }) {
  const cur = studios.get(name);
  if (cur && cur.status !== "exited") return studioInfo(name);
  linkProject(dir);
  const cli = path.join(dir, "node_modules", "@remotion", "cli", "remotion-cli.js");
  if (!fs.existsSync(cli)) throw new Error(`Remotion is not available in ${dir} (node_modules link broken?)`);
  const port = await freePort(portBase);
  const env = { ...process.env, REMOTION_ENGINE_URL: engineUrl, REMOTION_ENGINE_PROJECT: name };
  const proc = spawn(process.execPath, [cli, "studio", "src/index.ts", `--port=${port}`, "--no-open"], { cwd: dir, env, windowsHide: true });
  const s = { port, url: `http://localhost:${port}`, status: "starting", proc, log: [], error: null };
  studios.set(name, s);
  const onData = (d) => {
    for (const line of String(d).split(/\r?\n/)) if (line.trim()) s.log.push(line.replace(/\x1b\[[0-9;]*m/g, ""));
    if (s.log.length > 300) s.log.splice(0, s.log.length - 300);
  };
  proc.stdout.on("data", onData);
  proc.stderr.on("data", onData);
  proc.on("exit", (code) => {
    s.status = "exited";
    if (code) s.error = `Studio exited with code ${code}`;
  });
  // ready when it answers HTTP
  (async () => {
    for (let i = 0; i < 240 && s.status === "starting"; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(2000) });
        if (r.ok) {
          s.status = "ready";
          return;
        }
      } catch {
        // not up yet
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    if (s.status === "starting") {
      s.status = "exited";
      s.error = "Studio did not start within 2 minutes";
      stopStudio(name);
    }
  })();
  return studioInfo(name);
}

export function stopStudio(name) {
  const s = studios.get(name);
  if (!s) return;
  if (s.proc.exitCode === null) {
    try {
      // kill the whole process tree (Studio can start helpers)
      execFileSync("taskkill", ["/pid", String(s.proc.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      s.proc.kill();
    }
  }
  s.status = "exited";
  studios.delete(name);
}

export function stopAllStudios() {
  for (const name of [...studios.keys()]) stopStudio(name);
}
