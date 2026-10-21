// The chat with the REAL Claude Code (costs tokens; nothing paid, nothing posted): a new scratch video starts
// /make-video, the engine's MCP tools and the prompt hook work, Ask first shows a real permission question, Claude's own
// question (AskUserQuestion), Stop. The scratch engine runs WITHOUT the fake Claude on PATH.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { B, G, WS, SHOTS, call, chatText, ok, failures, page, sleep, stopEngine, waitFor } from "./lib.mjs";

console.log(await stopEngine());
const PATH = process.env.PATH.split(";").filter((p) => !/fakebin/i.test(p)).join(";");
const log = fs.openSync(`${WS}/engine-real.log`, "a");
const env = { ...process.env, PATH, CE_WORKSPACE: "D:\\tmp\\ce-x", CE_SETTINGS_FILE: "D:\\tmp\\ce-x\\settings.json", CE_SECRETS_DIR: "D:\\tmp\\ce-x\\secrets", CE_APP_PORT: "4170", CE_APP_DIST: "D:\\tmp\\ce-chat-dist", CE_GOOGLE_AUTH_URL: `${G}/auth`, CE_GOOGLE_TOKEN_URL: `${G}/token`, CE_YOUTUBE_API: G };
for (const k of Object.keys(env)) if (/^CLAUDE_?CODE|^CLAUDECODE$|^CLAUDE_CONFIG_DIR$/i.test(k)) delete env[k];
spawn(process.execPath, ["D:/code_files/content-engine/app/server/index.mjs"], { detached: true, stdio: ["ignore", log, log], env, windowsHide: true }).unref();
ok("scratch engine (real Claude) started", await waitFor(async () => (await fetch(`${B}/api/doctor`).catch(() => null))?.ok, 30000));

const state = async (name) => (await call("GET", `/api/projects/${name}/publish`)).body.claude;
const send = async (p, text) => {
  await p.eval(`window.__set(document.querySelector(".chat-input textarea"), ${JSON.stringify(text)})`);
  await sleep(100);
  await p.eval(`document.querySelector(".chat-input textarea").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))`);
};
const idle = (name, ms = 240000) => waitFor(async () => ["idle", "stopped"].includes(await state(name)), ms, 1000);

const name = (await call("POST", "/api/projects", { request: "Engine chat test only: a 10 second vertical clip about why the sky is blue. This is a test of the website, don't build anything." })).body.name;
console.log("   video:", name);
const { browser, p } = await page(9353, { width: 1500, height: 950 });
const t0 = Date.now();
await p.go(`/p/${name}/brief`, 500);

console.log("== /make-video starts by itself; the reply streams in");
const firstText = await waitFor(async () => (await p.eval(`document.querySelectorAll(".chat-text").length`)) > 0, 180000, 500);
console.log(`   first words after ${((Date.now() - t0) / 1000).toFixed(1)} s`);
ok("Claude's reply appears", firstText);
await waitFor(async () => ["idle", "stopped", "question"].includes(await state(name)), 240000, 1000);
console.log(`   first turn done after ${((Date.now() - t0) / 1000).toFixed(1)} s (${await state(name)})`);
if ((await state(name)) === "question") {
  // /make-video asked something with a question card: this test doesn't answer it
  await p.shot(`${SHOTS}/r00_real_makevideo_question.png`);
  await p.click("^Stop$");
  await idle(name);
}
ok("no 'tools didn't connect' warning", !/didn't connect/.test(await chatText(p)), (await chatText(p)).slice(0, 400));
await p.shot(`${SHOTS}/r01_real_first.png`);

console.log("== the engine's MCP tool and the prompt hook");
await send(p, "Engine test (not part of the video): call your editor_state tool once, then tell me in one sentence what it returned, and in one more sentence what the engine added to this message about where I am. Don't change any files.");
await idle(name);
const t1 = await chatText(p);
ok("editor_state used (shown as a step)", /Checked where you are in the editor|used the editor|used the engine/i.test(t1), t1.slice(-600));
console.log("   reply:", t1.slice(-500).replace(/\s+/g, " "));
await p.shot(`${SHOTS}/r02_real_tool.png`);

console.log("== Ask first: a real permission question");
await p.eval(`(() => { const s = document.querySelector(".chat-mode"); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(s, "manual"); s.dispatchEvent(new Event("change", { bubbles: true })); })()`);
await sleep(1500);
await send(p, "Engine test: run exactly this shell command once: ping -n 1 127.0.0.1 — then reply with just the word DONE.");
const card = await waitFor(async () => !!(await p.eval(`!!document.querySelector(".chat-card:not(.answered):not(.question)")`)), 120000, 500);
ok("permission card shown", card, (await chatText(p)).slice(-400));
ok("state = question", (await state(name)) === "question");
await p.shot(`${SHOTS}/r03_real_permission.png`);
if (card) {
  await p.click("^Allow$", ".chat-card:not(.answered)");
  await idle(name);
  ok("command ran after Allow; reply DONE", /DONE/.test(await chatText(p)), (await chatText(p)).slice(-300));
}

console.log("== Claude's own question");
await send(p, "Engine test: use your AskUserQuestion tool to ask me whether I prefer red or blue (two options), then reply with just my answer in capitals.");
const q = await waitFor(async () => !!(await p.eval(`!!document.querySelector(".chat-card.question:not(.answered)")`)), 120000, 500);
ok("question card shown", q, (await chatText(p)).slice(-400));
await p.shot(`${SHOTS}/r04_real_question.png`);
if (q) {
  await p.eval(`[...document.querySelectorAll(".chat-card.question:not(.answered) .options button")].find((b) => /blue/i.test(b.textContent)).click()`);
  await idle(name);
  ok("Claude got the answer", /BLUE/.test(await chatText(p)), (await chatText(p)).slice(-300));
}

console.log("== Stop");
await p.eval(`(() => { const s = document.querySelector(".chat-mode"); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(s, "auto"); s.dispatchEvent(new Event("change", { bubbles: true })); })()`);
await sleep(1000);
await send(p, "Engine test: write the numbers from 1 to 300 as words, one per line. No tools.");
ok("working", await waitFor(async () => (await state(name)) === "working", 60000, 500));
await waitFor(async () => (await p.eval(`document.querySelectorAll(".chat-text").length`)) > 0 && /one|two|three/i.test((await chatText(p)).slice(-200)), 60000, 500);
await sleep(2000);
await p.click("^Stop$");
ok("stopped", await waitFor(async () => /Stopped\./.test(await chatText(p)) && ["idle", "stopped"].includes(await state(name)), 30000, 500), (await chatText(p)).slice(-200));
ok("no error line after Stop", !/error_during_execution/.test(await chatText(p)));
await p.shot(`${SHOTS}/r05_real_stopped.png`);
fs.writeFileSync(`${WS}/_real_chat.json`, JSON.stringify({ name }));
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
