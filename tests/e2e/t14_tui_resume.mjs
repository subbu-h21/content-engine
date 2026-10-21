// A conversation made in Claude Code's normal terminal (as every video's panel was before the chat) shows in the chat,
// and the chat's first message continues it. REAL Claude Code (a few cheap turns). Run after t13 (its engine on 4170).
import fs from "node:fs";
import { createRequire } from "node:module";
import { WS, SHOTS, call, chatText, ok, failures, page, sleep, waitFor } from "./lib.mjs";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const pty = require("node-pty");
const strip = (t) => t.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "").replace(/\x1b\][^\x07]*\x07/g, "");

const name = (await call("POST", "/api/projects", { request: "Terminal resume test." })).body.name;
const dir = `${WS}/${name}`;
fs.writeFileSync(`${dir}/brief/status.json`, JSON.stringify({ stage: "talking", note: "test" })); // no /make-video
console.log("   video:", name);

console.log("== a conversation in the real terminal");
const env = {};
for (const [k, v] of Object.entries(process.env)) if (!/^CLAUDE_?CODE|^CLAUDECODE$|^CLAUDE_CONFIG_DIR$/i.test(k)) env[k] = v;
const exe = "C:\\nvm4w\\nodejs\\node_modules\\@anthropic-ai\\claude-code\\bin\\claude.exe";
const term = pty.spawn(exe, ["--model", "haiku"], { name: "xterm-256color", cols: 120, rows: 40, cwd: dir, env });
let screen = "";
term.onData((d) => (screen += d));
const seen = (re, ms = 60000) => waitFor(() => re.test(strip(screen.slice(-6000))), ms, 300);
if (await seen(/safety\s*check|trust/i, 25000)) {
  await sleep(1000);
  console.log("   trust question shown:", strip(screen).replace(/\s+/g, " ").slice(-260));
  // the menu's default is "No, exit": move down to "Yes, I trust this folder", then Enter
  term.write("\x1b[B");
  await sleep(800);
  screen = "";
  term.write("\r");
}
// one-time notices (e.g. about Claude in Chrome) wait for Enter before the prompt shows
const ready = /for\s*shortcuts|shift\s*\+\s*tab\s*to\s*cycle/i;
for (let i = 0; i < 8 && !(await seen(ready, 6000)); i++) {
  console.log("   dismissing:", strip(screen).replace(/\s+/g, " ").slice(-120));
  term.write("\r");
}
ok("terminal prompt ready", await seen(ready, 20000), strip(screen.slice(-800)));
await sleep(1500);
screen = "";
term.write("\x1b[200~Remember the word HERON. Reply with just OK.\x1b[201~");
await sleep(700);
term.write("\r");
ok("terminal turn finished", await seen(/●\s*OK|\bOK\b(?!.*Remember)/, 90000), strip(screen.slice(-800)));
await sleep(2000);
term.write("\x03");
await sleep(500);
term.write("\x03");
await sleep(2000);
try {
  term.kill();
} catch {
  // already gone
}

console.log("== the chat shows it and continues it");
const { browser, p } = await page(9354, { width: 1400, height: 900 });
await p.go(`/p/${name}`, 2500);
ok("terminal conversation shown in the chat", /Remember the word HERON/.test(await chatText(p)), (await chatText(p)).slice(0, 300));
await p.eval(`window.__set(document.querySelector(".chat-input textarea"), "What word did I ask you to remember? Reply with just the word.")`);
await sleep(100);
await p.eval(`document.querySelector(".chat-input textarea").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))`);
ok("the chat's Claude remembers it", await waitFor(async () => /HERON\s*Worked/i.test(await chatText(p)), 120000, 1000), (await chatText(p)).slice(-300));
await p.shot(`${SHOTS}/r06_tui_resumed.png`);
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
