// The Claude chat (fake Claude): a new video starts /make-video by itself; messages, streaming replies, tool steps;
// a permission question (a message sent meanwhile waits and doesn't answer it), Allow / Always allow / Deny; Claude's
// own question; Stop; Auto / Ask first; reload; a crash and restart; idle close and resume; New conversation;
// "Terminal" (a window of its own, the chat waits); earlier messages from a saved conversation; foreign origins refused.
// Run with the scratch engine started by this script (CE_CLAUDE_IDLE_MS=6000, CLAUDE_CONFIG_DIR in the scratch folder).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { B, WS, SHOTS, WebSocket, call, chatText, fakeAnswers, fakeMessages, ok, failures, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const CLAUDE_HOME = `${WS}/claude-home`;
fs.mkdirSync(CLAUDE_HOME, { recursive: true });
console.log(await stopEngine());
ok("scratch engine started", await startEngine({ CE_CLAUDE_IDLE_MS: "6000", CLAUDE_CONFIG_DIR: CLAUDE_HOME.replace(/\//g, "\\") }));

const runs = (dir) => {
  const f = `${dir}/.fake-claude/runs.jsonl`;
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
};
const state = async (name) => (await call("GET", `/api/projects/${name}/publish`)).body.claude;
const send = async (p, text) => {
  await p.eval(`window.__set(document.querySelector(".chat-input textarea"), ${JSON.stringify(text)})`);
  await sleep(100);
  await p.eval(`document.querySelector(".chat-input textarea").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))`);
};

console.log("== a new video: Claude starts /make-video by itself");
const created = (await call("POST", "/api/projects", { request: "A short test video about tides." })).body;
const name = created.name;
const dir = `${WS}/${name}`;
const { browser, p } = await page(9352, { width: 1500, height: 950 });
const t0 = Date.now();
await p.go(`/p/${name}/brief`, 500);
const kicked = await waitFor(async () => /received 11 characters/.test(await chatText(p)), 20000);
ok("first reply to /make-video shown", kicked, await chatText(p));
console.log(`   page open → first reply: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
ok("/make-video sent once", fakeMessages(dir).filter((m) => m.text === "/make-video").length === 1, JSON.stringify(fakeMessages(dir)));
ok("Claude started with chat-mode flags", runs(dir).some((r) => r.args.includes("-p") && r.args.includes("--permission-prompt-tool") && r.args.includes("--chrome") && r.args.includes("auto")), JSON.stringify(runs(dir).at(-1)));
ok("first run has no --resume (new conversation)", !runs(dir)[0].args.includes("--resume"));

console.log("== a message from the box");
await send(p, "Hello Claude, make the title bigger.");
ok("reply shown", await waitFor(async () => /received 36 characters/.test(await chatText(p))));
ok("box emptied", (await p.eval(`document.querySelector(".chat-input textarea").value`)) === "");
ok("my message shown as mine", /Hello Claude, make the title bigger\./.test(await p.eval(`[...document.querySelectorAll(".chat-user:not(.engine)")].map((e) => e.innerText).join(" | ")`)), await chatText(p));

console.log("== tool steps");
await send(p, "FAKE-TOOLS please");
ok("tools line summarised", await waitFor(async () => /Ran a command, read a file, used the engine/i.test(await chatText(p)) || /Ran a command, read a file, used the editor/i.test(await chatText(p))), await chatText(p));
await p.eval(`[...document.querySelectorAll(".chat-tools .tools-line")].at(-1).click()`);
await sleep(300);
const steps = await p.eval(`[...document.querySelectorAll(".chat-tools ul")].at(-1)?.innerText ?? ""`);
ok("steps listed when opened", /Print one/.test(steps) && /Read script\.json/.test(steps) && /Checked where you are in the editor/.test(steps), steps);
await p.eval(`[...document.querySelectorAll(".chat-tools .step")].find((b) => /Print one/.test(b.textContent)).click()`);
await sleep(200);
ok("a step's output shows on click", /\bone\b/.test(await p.text(".chat-tools pre")));
await p.shot(`${SHOTS}/c01_chat_tools.png`);

console.log("== a permission question; a message sent meanwhile waits");
await send(p, "FAKE-ASK-PERMISSION now");
ok("permission card", await waitFor(async () => /Claude wants to: Run a command/.test(await chatText(p))), await chatText(p));
ok("command shown", /fake --thing/.test(await chatText(p)));
ok("status: needs your answer", (await state(name)) === "question" && /needs your answer/.test(await p.text(".chat .pane-head")));
const said = (await call("POST", `/api/projects/${name}/say`, { text: "Approved. Build the preview." })).body;
ok("board message accepted while the question waits", said.sent === true, JSON.stringify(said));
await sleep(1500);
ok("…delivered to Claude (queued)", fakeMessages(dir).some((m) => m.text === "Approved. Build the preview." && m.queued), JSON.stringify(fakeMessages(dir).at(-1)));
ok("…and the question was NOT answered for the user", fakeAnswers(dir).length === 0, JSON.stringify(fakeAnswers(dir)));
ok("question still open", /Allow/.test(await p.text(".chat-card:not(.answered)")));
await p.shot(`${SHOTS}/c02_chat_permission.png`);
await p.click("^Allow$", ".chat-card:not(.answered)");
ok("answer reached Claude: allow", await waitFor(() => fakeAnswers(dir).at(-1)?.response?.behavior === "allow"), JSON.stringify(fakeAnswers(dir)));
ok("card says Allowed", await waitFor(async () => /Allowed\./.test(await chatText(p))));
ok("queued message answered afterwards", await waitFor(async () => /received 28 characters/.test(await chatText(p))), (await chatText(p)).slice(-300));

console.log("== Always allow, Deny");
await send(p, "FAKE-ASK-PERMISSION again");
await waitFor(async () => !!(await p.eval(`!!document.querySelector(".chat-card:not(.answered)")`)));
await p.click("^Always allow$", ".chat-card:not(.answered)");
ok("always allow sends the rule", await waitFor(() => fakeAnswers(dir).at(-1)?.response?.updatedPermissions?.[0]?.rules?.[0]?.ruleContent === "fake --thing"), JSON.stringify(fakeAnswers(dir).at(-1)));
await sleep(800);
await send(p, "FAKE-ASK-PERMISSION third");
await waitFor(async () => !!(await p.eval(`!!document.querySelector(".chat-card:not(.answered)")`)));
await p.click("^Deny$", ".chat-card:not(.answered)");
ok("deny reaches Claude", await waitFor(() => fakeAnswers(dir).at(-1)?.response?.behavior === "deny"), JSON.stringify(fakeAnswers(dir).at(-1)));
ok("card says Denied", await waitFor(async () => /Denied\./.test(await chatText(p))));

console.log("== Claude's own question");
await send(p, "FAKE-ASK-QUESTION please");
ok("question card with options", await waitFor(async () => /Which colour\?/.test(await chatText(p)) && /Warm/.test(await chatText(p))), await chatText(p));
await p.shot(`${SHOTS}/c03_chat_question.png`);
await p.eval(`[...document.querySelectorAll(".chat-card .options button")].find((b) => /Blue/.test(b.textContent)).click()`);
ok("answer reached Claude", await waitFor(() => fakeAnswers(dir).at(-1)?.response?.updatedInput?.answers?.["Which colour?"] === "Blue"), JSON.stringify(fakeAnswers(dir).at(-1)));
ok("card shows the answer", await waitFor(async () => /Answered: Blue/.test(await chatText(p))));

console.log("== Stop while Claude is replying");
await send(p, "FAKE-SLOW tell me a long story");
ok("working shown with Stop", await waitFor(async () => /Working…/.test(await chatText(p)) && !!(await p.eval(`!!window.__btn("^Stop$")`))));
await sleep(1500);
await p.click("^Stop$");
ok("Stopped notice", await waitFor(async () => /Stopped\./.test(await chatText(p))), (await chatText(p)).slice(-200));
ok("back to idle", await waitFor(async () => (await state(name)) === "idle"));
ok("no error line after Stop", !/error_during_execution/.test(await chatText(p)));

console.log("== Auto / Ask first");
await p.eval(`(() => { const s = document.querySelector(".chat-mode"); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(s, "manual"); s.dispatchEvent(new Event("change", { bubbles: true })); })()`);
ok("mode change reached Claude", await waitFor(() => fs.existsSync(`${dir}/.fake-claude/modes.jsonl`) && /manual/.test(fs.readFileSync(`${dir}/.fake-claude/modes.jsonl`, "utf8"))));
ok("mode saved in the project", JSON.parse(fs.readFileSync(`${dir}/.claude/engine-chat.json`, "utf8")).mode === "manual");
ok("engine-chat.json git-ignored", /\.claude\/engine-chat\.json/.test(fs.readFileSync(`${dir}/.gitignore`, "utf8")));

console.log("== reload the page");
const mine = () => p.eval(`document.querySelectorAll(".chat-user").length`);
const before = await mine();
await p.go(`/p/${name}`, 2500);
const after = await mine();
ok("conversation still there after reload", before > 3 && before === after, `${before} → ${after}`);
ok("mode shown as Ask first", (await p.eval(`document.querySelector(".chat-mode").value`)) === "manual");

console.log("== Claude crashes; the next message starts it again");
const runsBefore = runs(dir).length;
await send(p, "FAKE-CRASH");
ok("crash reported", await waitFor(async () => /Claude stopped unexpectedly/.test(await chatText(p))), (await chatText(p)).slice(-300));
await send(p, "Are you back?");
ok("reply after restart", await waitFor(async () => /received 13 characters/.test(await chatText(p))));
const last = runs(dir).at(-1);
ok("restarted with --resume of the same conversation and the saved mode", runs(dir).length === runsBefore + 1 && last.args.includes("--resume") && last.args.includes("manual"), JSON.stringify(last));

console.log("== idle close (6 s in this test) and resume");
ok("closes when idle", await waitFor(async () => (await state(name)) === "stopped", 15000));
await send(p, "Still there?");
ok("starts again on the next message", await waitFor(async () => /received 12 characters/.test(await chatText(p))));
ok("…resuming the conversation", runs(dir).at(-1).args.includes("--resume"));

console.log("== New conversation");
await p.eval(`window.__confirm = true`);
await p.eval(`document.querySelector(".chat-menu .icon-btn").click()`);
await sleep(200);
await p.click("^New conversation$");
ok("chat emptied", await waitFor(async () => (await p.eval(`document.querySelectorAll(".chat-user").length`)) === 0), await chatText(p));
ok("fresh remembered", JSON.parse(fs.readFileSync(`${dir}/.claude/engine-chat.json`, "utf8")).fresh === true);
await send(p, "Hi again");
ok("reply in the new conversation", await waitFor(async () => /received 8 characters/.test(await chatText(p))));
ok("new conversation started without --resume", !runs(dir).at(-1).args.includes("--resume"), JSON.stringify(runs(dir).at(-1)));
ok("fresh cleared once it began", await waitFor(() => !JSON.parse(fs.readFileSync(`${dir}/.claude/engine-chat.json`, "utf8")).fresh));
await p.shot(`${SHOTS}/c04_chat_new.png`);

console.log("== Terminal: the conversation in a window of its own");
ok("idle before opening it", await waitFor(async () => ["idle", "stopped"].includes(await state(name))));
const tr = (await call("POST", `/api/projects/${name}/chat/terminal`)).body;
ok("terminal opened", tr.ok === true, JSON.stringify(tr));
ok("window run without -p", await waitFor(() => runs(dir).some((r) => !r.args.includes("-p"))), JSON.stringify(runs(dir).at(-1)));
const win = await waitFor(() => {
  const out = execFileSync("powershell.exe", ["-NoProfile", "-Command", "Get-Process | Where-Object { $_.MainWindowTitle -like 'Claude - *' } | ForEach-Object { $_.ProcessName + ': ' + $_.MainWindowTitle }"], { encoding: "utf8" }).trim();
  return out || null;
}, 8000, 500);
ok("a visible window titled 'Claude - …'", !!win, win ?? "none found");
console.log("   window:", win);
ok("chat says it's in a terminal window", await waitFor(async () => /open in a terminal window/.test(await p.text(".chat"))));
ok("state external", (await state(name)) === "external");
const blocked = (await call("POST", `/api/projects/${name}/chat/send`, { text: "x" })).body;
ok("sending refused while the window is open", blocked.ok === false && /terminal window/.test(blocked.reason), JSON.stringify(blocked));
ok("box disabled", await p.eval(`document.querySelector(".chat-input textarea").disabled`));
await p.shot(`${SHOTS}/c05_chat_external.png`);
// close the window: end the fake Claude running in it
execFileSync("powershell.exe", ["-NoProfile", "-Command", "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*fakeclaude.mjs*' -and $_.CommandLine -notlike '*-p*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"]);
ok("chat back after the window closed", await waitFor(async () => (await state(name)) !== "external", 10000), await state(name));
ok("box enabled again", await waitFor(async () => !(await p.eval(`document.querySelector(".chat-input textarea").disabled`))));

console.log("== earlier messages from Claude Code's saved conversation");
// a copy of a real conversation, put where Claude Code keeps this folder's conversations (scratch CLAUDE_CONFIG_DIR)
const real = (process.env.CE_TEST_TRANSCRIPT || "").trim();
if (real && fs.existsSync(real)) {
  const created2 = (await call("POST", "/api/projects", { request: "History test." })).body;
  const dir2 = `${WS}/${created2.name}`;
  fs.writeFileSync(`${dir2}/brief/status.json`, JSON.stringify({ stage: "talking" })); // not "new": no /make-video
  const enc = path.resolve(dir2).replace(/[^a-zA-Z0-9]/g, "-");
  fs.mkdirSync(`${CLAUDE_HOME}/projects/${enc}`, { recursive: true });
  const id = "11111111-2222-4333-8444-555555555555";
  fs.copyFileSync(real, `${CLAUDE_HOME}/projects/${enc}/${id}.jsonl`);
  const t1 = Date.now();
  await p.go(`/p/${created2.name}`, 300);
  const shown = await waitFor(async () => (await chatText(p)).length > 200, 20000);
  console.log(`   ${(fs.statSync(real).size / 1e6).toFixed(1)} MB conversation shown after ${((Date.now() - t1) / 1000).toFixed(1)} s`);
  ok("earlier messages shown", shown, (await chatText(p)).slice(0, 300));
  const items = await p.eval(`document.querySelectorAll(".chat-list > *").length`);
  console.log("   items on the page:", items);
  ok("no Claude started just by looking", runs(dir2).length === 0);
  await p.shot(`${SHOTS}/c06_chat_history.png`);
  await send(p, "Continue please");
  ok("first message resumes that conversation", await waitFor(() => runs(dir2).at(-1)?.args.includes(id)), JSON.stringify(runs(dir2).at(-1)));
} else console.log("   (skipped: set CE_TEST_TRANSCRIPT to a copy of a saved conversation)");

console.log("== only the engine's own page");
const foreign = await new Promise((resolve) => {
  const ws = new WebSocket(`ws://127.0.0.1:4170/ws/chat/${name}`, { headers: { origin: "http://evil.example" } });
  ws.on("unexpected-response", (_req, res) => resolve(res.statusCode));
  ws.on("open", () => resolve("opened"));
  ws.on("error", () => resolve("error"));
});
ok("chat socket from a foreign origin refused", foreign === 403, foreign);
const r = await fetch(`${B}/api/projects/${name}/chat/send`, { method: "POST", headers: { "content-type": "application/json", origin: "http://evil.example" }, body: JSON.stringify({ text: "hi" }) });
ok("chat send from a foreign origin refused", r.status === 403, r.status);

console.log("   page errors:", JSON.stringify(p.errors()));
ok("no page errors", p.errors().length === 0);
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
