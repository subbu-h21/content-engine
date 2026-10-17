/**
 * Claude Code UserPromptSubmit hook (installed into a project's .claude/settings.local.json by the engine).
 * Adds one paragraph to every prompt: where the user is in the editor (time, scene, narration line, what's on screen).
 * Prints nothing when the engine or the project's Studio isn't running, so Claude Code is unaffected then.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENGINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

async function main() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  let cwd = process.cwd();
  try {
    cwd = JSON.parse(input).cwd || cwd;
  } catch {
    // no JSON on stdin: fall back to the working directory
  }
  let dir = path.resolve(cwd);
  while (!fs.existsSync(path.join(dir, "project.json"))) {
    const up = path.dirname(dir);
    if (up === dir) return;
    dir = up;
  }
  let url = process.env.CE_ENGINE_URL;
  if (!url) {
    let port = 4100;
    try {
      port = JSON.parse(fs.readFileSync(path.join(ENGINE_DIR, "settings.json"), "utf8")).appPort || port;
    } catch {
      // default port
    }
    url = `http://127.0.0.1:${port}`;
  }
  const r = await fetch(`${url}/api/projects/${encodeURIComponent(path.basename(dir))}/context`, { signal: AbortSignal.timeout(1500) });
  if (!r.ok) return;
  const { text } = await r.json();
  if (!text) return;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: text } }));
}

main().catch(() => undefined);
