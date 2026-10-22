// Publish page, second half: engine restart mid-upload, Facebook / Instagram hand-off (fake Claude), Mark as posted,
// History, Reset, a picked file that disappears.
import fs from "node:fs";
import { createRequire } from "node:module";
import { WS, SHOTS, B, G, call, ok, failures, fakeAnswers, fakeMessages, page, sleep, startEngine, stopEngine } from "./lib.mjs";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const { leaves } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const dir = `${WS}/${leaves}`;
const gdebug = async () => (await fetch(`${G}/debug`)).json();
const faults = (f) => fetch(`${G}/debug/faults`, { method: "POST", body: JSON.stringify(f) });
const info = async () => (await call("GET", `/api/projects/${leaves}/publish`)).body;
const card = (re) => `[...document.querySelectorAll(".publish-card")].find(c => ${re}.test(c.querySelector("h2").textContent))`;
fs.rmSync(`${dir}/.fake-claude/ask`, { force: true });
for (const p of ["facebook", "instagram"]) await call("POST", `/api/projects/${leaves}/publish/${p}/report`, { status: "none" });
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/long draft.mp4" });

console.log("== engine restarts during an upload");
await faults({ delayMs: 7000 });
const st = await call("POST", `/api/projects/${leaves}/publish/youtube/start`, { again: true });
console.log("   start:", st.status, st.body.status ?? st.body.error);
for (let i = 0; i < 60; i++) {
  if (((await info()).youtube.live?.sent ?? 0) >= 8 * 1048576) break;
  await sleep(500);
}
const sessions = (await gdebug()).sessions.length;
console.log("  ", await stopEngine());
await sleep(1000);
ok("engine back", await startEngine());
ok("upload interrupted after restart", (await info()).state.youtube?.status === "interrupted", (await info()).state.youtube?.status);
const { browser, p } = await page(9350);
await p.go(`/publish/${leaves}`, 4000);
let t = await p.text(".publish-panel");
ok("page: Upload interrupted + Resume upload", /Upload interrupted/.test(t) && /Resume upload/.test(t), t.slice(t.indexOf("Made for kids"), t.indexOf("Made for kids") + 400));
await p.shot(`${SHOTS}/43_publish_interrupted.png`);
await faults({});
console.log("   click:", await p.click("^Resume upload$"));
let x;
for (let i = 0; i < 120; i++) {
  x = await info();
  if (["done", "failed"].includes(x.state.youtube?.status)) break;
  await sleep(500);
}
ok("resumed in the same YouTube session and finished", x.state.youtube?.status === "done" && (await gdebug()).sessions.length === sessions, `${x.state.youtube?.status} sessions ${sessions}→${(await gdebug()).sessions.length}`);
const log = await p.eval(`document.querySelector("details.log pre")?.textContent ?? ""`);
ok("upload log says where it continued", /YouTube has \d+ of \d+ bytes; continuing/.test(log), log.split("\n").slice(-4).join(" | "));

if (process.env.ONLY_RESTART) { browser.proc.kill(); console.log(failures() ? `${failures()} FAILED` : "all passed"); process.exit(0); }
console.log("== Facebook through Claude (fake)");
await p.go(`/publish/${leaves}`, 4000);
await p.eval(`window.__tab("Facebook")`);
await p.eval(`[...${card("/Facebook Page/")}.querySelectorAll(".seg button")].find(b => b.textContent === "Reel").click()`);
await p.eval(`window.__set(${card("/Facebook Page/")}.querySelector("textarea"), "Why do leaves turn red? 🍁\\n\\n#science #kids")`);
await sleep(2500);
console.log("   problems:", JSON.stringify((await info()).problems.facebook), "panel:", (await info()).claude);
const before = fakeMessages(dir).length;
console.log("   click:", await p.eval(`window.__click("Hand to Claude in Chrome", ${card("/Facebook Page/")})`));
for (let i = 0; i < 40 && fakeMessages(dir).length === before; i++) await sleep(1000);
console.log("   note:", await p.text(".publish-panel > p.hint"));
const m = fakeMessages(dir).at(-1)?.text ?? "";
ok("Claude got the post request with the picked file and Reel", /to the Facebook Page https:\/\/www\.facebook\.com\/leavesexplained as a Reel/.test(m) && m.includes("long draft.mp4") && /Never click it yourself/.test(m), m.slice(0, 160));
x = await info();
ok("state handed, with the file", x.state.facebook?.status === "handed" && x.state.facebook?.file === "out/long draft.mp4", JSON.stringify(x.state.facebook));
ok("Claude's chat on the page shows the hand-off", /Sent by the engine\s*Please post this video/.test(await p.text(".claude-pane .chat-list")), (await p.text(".claude-pane .chat-list")).slice(-200));
const mcp = new Client({ name: "fake-claude", version: "0.0.1" });
await mcp.connect(new StreamableHTTPClientTransport(new URL(`${B}/mcp/${leaves}`)));
await mcp.callTool({ name: "publish_report", arguments: { platform: "facebook", status: "ready-to-post" } });
await sleep(2500);
ok("page: ready in Chrome", /Ready in Chrome: check it and click Post/.test(await p.text(".publish-panel")));
await p.shot(`${SHOTS}/44_publish_fb_ready.png`);
await mcp.callTool({ name: "publish_report", arguments: { platform: "facebook", status: "posted", url: "https://www.facebook.com/reel/42" } });
await sleep(2500);
ok("Claude reports posted with link", (await info()).state.facebook?.url === "https://www.facebook.com/reel/42");

console.log("== Instagram hand-off while Claude waits for the user's answer");
const answersBefore = fakeAnswers(dir).length;
await call("POST", `/api/projects/${leaves}/chat/send`, { text: "FAKE-ASK-PERMISSION" });
for (let i = 0; i < 20 && (await info()).claude !== "question"; i++) await sleep(500);
await p.eval(`window.__tab("Instagram")`);
await p.eval(`[...${card("/Instagram/")}.querySelectorAll(".seg button")].find(b => b.textContent === "Feed post").click()`);
await p.eval(`window.__set(${card("/Instagram/")}.querySelector("textarea"), "Leaves! #autumn")`);
await sleep(2500);
console.log("   click:", await p.eval(`window.__click("Hand to Claude in Chrome", ${card("/Instagram/")})`));
await sleep(3000);
const ig = fakeMessages(dir).at(-1) ?? {};
ok("handed at once, waiting its turn behind the question", /Instagram account @leaves\.explained as a feed post/.test(ig.text ?? "") && ig.queued === true, JSON.stringify(ig).slice(0, 160));
ok("the question was not answered for the user", fakeAnswers(dir).length === answersBefore);
await p.shot(`${SHOTS}/45_publish_ig_handed.png`);
await p.click("^Allow$", ".chat-card:not(.answered)");
for (let i = 0; i < 15 && fakeAnswers(dir).length === answersBefore; i++) await sleep(500);
ok("the user's answer reached Claude", fakeAnswers(dir).length === answersBefore + 1);
ok("Instagram state handed", (await info()).state.instagram?.status === "handed");

console.log("== History");
await p.click("^History$");
await sleep(4000);
t = await p.text(".board");
ok("history lists YouTube uploads, Facebook posted (Reel) and Instagram with Claude", /YouTube/.test(t) && /Facebook Page · Reel posted/.test(t) && /Instagram · post with Claude/.test(t), t.slice(0, 600));
await p.shot(`${SHOTS}/46_publish_history.png`);
await p.eval(`[...document.querySelectorAll("table.published a")].find(a => /leaves/.test(a.textContent))?.click()`);
await sleep(3000);
ok("history row opens the video", (await p.path()) === `/publish/${leaves}`);

console.log("== the picked file disappears");
fs.renameSync(`${dir}/out/long draft.mp4`, `${dir}/out/long draft.bak`);
await sleep(5000);
t = await p.text(".publish-panel .vstrip");
ok("falls back to the final", /Final video/.test(t), t.slice(0, 160));
fs.renameSync(`${dir}/out/long draft.bak`, `${dir}/out/long draft.mp4`);

console.log("   page errors:", JSON.stringify(p.errors()));
await mcp.close();
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
