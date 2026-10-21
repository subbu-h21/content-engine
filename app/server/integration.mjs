/**
 * Connects a project's Claude Code to the engine (written when the website opens the project; safe to repeat):
 *   .mcp.json                    the engine's MCP tools for this project
 *   .claude/settings.local.json  approves that server, and adds the hook that tells Claude where the user is
 * Both depend on this machine (absolute paths, port), so they are git-ignored. Existing settings are merged, not replaced.
 * (.claude/engine-chat.json, the chat's Auto / Ask first choice, is git-ignored for the same reason.)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SERVER_NAME = "content-engine";
const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), "hook.mjs").replace(/\\/g, "/");

const readJson = (f) => {
  if (!fs.existsSync(f)) return {};
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    throw new Error(`${f} is not valid JSON; fix or delete it`);
  }
};
const writeJson = (f, o) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(o, null, 2) + "\n");
};

export function ensureIntegration(dir, name, engineUrl) {
  const mcpFile = path.join(dir, ".mcp.json");
  const mcp = readJson(mcpFile);
  mcp.mcpServers = { ...(mcp.mcpServers ?? {}), [SERVER_NAME]: { type: "http", url: `${engineUrl}/mcp/${encodeURIComponent(name)}` } };
  writeJson(mcpFile, mcp);

  const setFile = path.join(dir, ".claude", "settings.local.json");
  const set = readJson(setFile);
  set.enabledMcpjsonServers = [...new Set([...(set.enabledMcpjsonServers ?? []), SERVER_NAME])];
  set.hooks = set.hooks ?? {};
  const groups = (set.hooks.UserPromptSubmit ?? []).filter((g) => !(g.hooks ?? []).some((h) => (h.args ?? []).some((a) => String(a).endsWith("/hook.mjs") && String(a).includes("content-engine"))));
  groups.push({ hooks: [{ type: "command", command: "node", args: [HOOK], timeout: 5 }] });
  set.hooks.UserPromptSubmit = groups;
  writeJson(setFile, set);

  const gi = path.join(dir, ".gitignore");
  const lines = fs.existsSync(gi) ? fs.readFileSync(gi, "utf8").split(/\r?\n/) : [];
  const want = [".mcp.json", ".claude/settings.local.json", ".claude/engine-chat.json"].filter((l) => !lines.includes(l));
  if (want.length) fs.appendFileSync(gi, `${lines.length && lines[lines.length - 1] !== "" ? "\n" : ""}# content engine connection (machine-specific)\n${want.join("\n")}\n`);
}
