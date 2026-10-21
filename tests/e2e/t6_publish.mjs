// Publish page end to end on the scratch engine (fake Google, fake Claude): pick files, YouTube upload / duplicate /
// stop-resume race / engine restart, Facebook & Instagram hand-off, Mark as posted, Reset, History.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import { WS, SHOTS, B, G, call, ok, failures, fakeAnswers, fakeMessages, fakeTrust, page, sleep, startEngine, stopEngine } from "./lib.mjs";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const { leaves, bees } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const dir = `${WS}/${leaves}`;
const gdebug = async () => (await fetch(`${G}/debug`)).json();
const faults = (f) => fetch(`${G}/debug/faults`, { method: "POST", body: JSON.stringify(f) });
const info = async () => (await call("GET", `/api/projects/${leaves}/publish`)).body;
const waitYt = async (pred, s = 120) => {
  for (let i = 0; i < s; i++) {
    const x = await info();
    if (pred(x)) return x;
    await sleep(500);
  }
  return info();
};
fakeTrust(dir);
fs.rmSync(`${dir}/publish`, { recursive: true, force: true });
fs.rmSync(`${dir}/.fake-claude/ask`, { force: true });
for (const d of fs.readdirSync(WS).filter((d) => /^project-d+-why-is-the-sea/.test(d))) await call("DELETE", `/api/projects/${d}`, { confirm: d.split("-")[1] });
// a long horizontal draft (≈30 MB) for stop/resume
if (!fs.existsSync(`${dir}/out/long draft.mp4`))
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "testsrc2=size=1920x1080:rate=24", "-t", "100", "-c:v", "libx264", "-b:v", "2400k", "-pix_fmt", "yuv420p", `${dir}/out/long draft.mp4`]);
// a third video with no exported file
const third = (await call("POST", "/api/projects", { request: "Why is the sea salty?", title: "Why is the sea salty?" })).body.name;
await faults({});

const { browser, p } = await page(9348);
await p.go("/publish", 3500);
let t = await p.text();
ok("Publish page: History in the middle when nothing is picked", /History/.test(await p.text(".board")), (await p.text(".board")).slice(0, 120));
ok("left: ready videos and 'Not exported yet'", /Ready to publish/.test(t) && /Not exported yet/.test(t) && /Why is the sea salty/.test(await p.text(".video-list")), (await p.text(".video-list")).slice(0, 400));
await p.shot(`${SHOTS}/40_publish_history_empty.png`);

console.log("== pick the final of 'leaves'");
await p.eval(`[...document.querySelectorAll(".vcard")].find((c) => /leaves/.test(c.innerText))?.querySelector(".vfile")?.click()`);
await sleep(5000);
ok("URL is /publish/<video>", (await p.path()) === `/publish/${leaves}`, await p.path());
t = await p.text(".publish-panel");
ok("final picked, Short note", /Final video/.test(t) && /YouTube shows it as a Short/.test(t), t.slice(0, 300) + " notes=" + JSON.stringify((await info()).video.notes));
ok("draft defaults from Settings (unlisted, not for kids)", (await info()).drafts.youtube.privacy === "unlisted" && (await info()).drafts.youtube.madeForKids === false);
await p.shot(`${SHOTS}/41_publish_final_picked.png`);

console.log("== YouTube upload of the final");
const s0 = (await gdebug()).sessions.length;
await p.click("^Upload to YouTube$");
let x = await waitYt((i) => i.state.youtube?.status === "done", 60);
ok("uploaded", x.state.youtube?.status === "done", JSON.stringify(x.state.youtube?.error));
const sess = (await gdebug()).sessions.at(-1);
ok("metadata arrived (unlisted, not for kids)", sess.metadata.status.privacyStatus === "unlisted" && sess.metadata.status.selfDeclaredMadeForKids === false, JSON.stringify(sess.metadata.status));
await sleep(2500);
t = await p.text(".publish-panel");
ok("page shows the link and 'Upload again'", /On YouTube \(unlisted\)/.test(t) && /Upload again/.test(t), t.slice(t.indexOf("YouTube"), t.indexOf("YouTube") + 500));
await p.shot(`${SHOTS}/42_publish_youtube_done.png`);

console.log("== same file again: asks, Cancel keeps it single");
await p.eval("window.__confirm = false");
await p.click("^Upload again$");
await sleep(2000);
ok("asked about a second copy", /already on YouTube/.test(JSON.stringify(await p.eval("window.__dialogs"))));
ok("cancel: no new upload", (await gdebug()).sessions.length === s0 + 1);
await p.eval("window.__confirm = true");
await p.click("^Upload again$");
for (let i = 0; i < 60 && !((await gdebug()).sessions.length === s0 + 2 && (await info()).state.youtube?.status === "done"); i++) await sleep(500);
ok("confirmed: second copy uploaded", (await gdebug()).sessions.length === s0 + 2);

console.log("== pick the long draft; stop, then resume at once (race)");
await p.eval(`[...document.querySelectorAll(".vcard.on .vfile")].find((b) => /long draft/.test(b.innerText))?.click()`);
await sleep(3000);
t = await p.text(".publish-panel");
ok("draft picked with the draft warning", /This is a draft/.test(t) && /long draft\.mp4/.test(t), t.slice(0, 300));
await faults({ delayMs: 1200 });
await p.click("^Upload to YouTube$");
x = await waitYt((i) => (i.youtube.live?.sent ?? 0) >= 8 * 1048576, 60);
ok("uploading (8 MB in)", (x.youtube.live?.sent ?? 0) >= 8 * 1048576, JSON.stringify(x.youtube.live));
await p.click("^Stop$");
await sleep(150);
await call("POST", `/api/projects/${leaves}/publish/youtube/start`, {});
await sleep(6000);
x = await info();
ok("resumed right after Stop: uploading again, not stuck in queue", x.state.youtube?.status === "uploading" && !!x.youtube.live, `${x.state.youtube?.status} live=${JSON.stringify(x.youtube.live)}`);

console.log("== engine restarts during the upload");
x = await waitYt((i) => (i.youtube.live?.sent ?? 0) >= 16 * 1048576, 60);
const sessionsBefore = (await gdebug()).sessions.length;
console.log("  ", await stopEngine());
await sleep(1000);
ok("engine back", await startEngine());
x = await info();
ok("upload interrupted after restart", x.state.youtube?.status === "interrupted", x.state.youtube?.status);
await p.go(`/publish/${leaves}`, 3500);
t = await p.text(".publish-panel");
ok("page: Upload interrupted + Resume upload", /Upload interrupted/.test(t) && /Resume upload/.test(t), t.slice(t.indexOf("YouTube"), t.indexOf("YouTube") + 700));
await p.shot(`${SHOTS}/43_publish_interrupted.png`);
await faults({});
await p.click("^Resume upload$");
x = await waitYt((i) => ["done", "failed"].includes(i.state.youtube?.status), 120);
ok("resumed in the same session and finished", x.state.youtube?.status === "done" && (await gdebug()).sessions.length === sessionsBefore, `${x.state.youtube?.status} ${JSON.stringify(x.state.youtube?.error)}`);

console.log("== Facebook through Claude (fake)");
await p.go(`/publish/${leaves}`, 3500);
ok("hand-off disabled until Reel or post is chosen", await p.eval(`window.__btn("Hand to Claude in Chrome", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent))).disabled`));
await p.eval(`[...[...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)).querySelectorAll(".seg button")].find(b => b.textContent === "Reel").click()`);
await p.eval(`window.__set([...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)).querySelector("textarea"), "Why do leaves turn red? 🍁\\n\\n#science #kids")`);
await sleep(2500);
const before = fakeMessages(dir).length;
// the button enables once the saved draft has no problems (save after 0.7 s, page refresh every 2 s)
for (let i = 0; i < 60 && (await p.eval(`window.__btn("Hand to Claude in Chrome", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent))).disabled`)); i++) await sleep(250);
console.log("   click:", await p.eval(`window.__click("Hand to Claude in Chrome", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)))`));
for (let i = 0; i < 30 && fakeMessages(dir).length === before; i++) await sleep(1000);
const m = fakeMessages(dir).at(-1)?.text ?? "";
ok("Claude got the post request with the picked file and Reel", /post this video to the Facebook Page https:\/\/www\.facebook\.com\/leavesexplained as a Reel/.test(m) && m.includes("long draft.mp4") && /Never click it yourself/.test(m), m.slice(0, 200));
x = await info();
ok("state handed, with the file", x.state.facebook?.status === "handed" && x.state.facebook?.file === "out/long draft.mp4", JSON.stringify(x.state.facebook));
const mcp = new Client({ name: "fake-claude", version: "0.0.1" });
await mcp.connect(new StreamableHTTPClientTransport(new URL(`${B}/mcp/${leaves}`)));
await mcp.callTool({ name: "publish_report", arguments: { platform: "facebook", status: "ready-to-post" } });
await sleep(2500);
ok("page: ready in Chrome", /Ready in Chrome: check it and click Post/.test(await p.text(".publish-panel")));
await p.shot(`${SHOTS}/44_publish_fb_ready.png`);

console.log("== Mark as posted: Cancel must not mark it");
await p.eval("window.__prompt = null");
await p.eval(`window.__click("Mark as posted", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)))`);
await sleep(2000);
x = await info();
ok("Cancel in the link prompt leaves it unposted", x.state.facebook?.status === "ready-to-post", x.state.facebook?.status);
await p.eval(`window.__prompt = "https://www.facebook.com/reel/123"`);
await p.eval(`window.__click("Mark as posted", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)))`);
await sleep(2500);
x = await info();
ok("posted with the link", x.state.facebook?.status === "posted" && x.state.facebook?.url === "https://www.facebook.com/reel/123", JSON.stringify(x.state.facebook));

console.log("== Instagram hand-off while Claude waits for the user's answer");
const answersBefore = fakeAnswers(dir).length;
await call("POST", `/api/projects/${leaves}/chat/send`, { text: "FAKE-ASK-PERMISSION" });
for (let i = 0; i < 20 && (await info()).claude !== "question"; i++) await sleep(500);
await p.eval(`[...[...document.querySelectorAll(".publish-card")].find(c => /Instagram/.test(c.querySelector("h2").textContent)).querySelectorAll(".seg button")].find(b => b.textContent === "Feed post").click()`);
await p.eval(`window.__set([...document.querySelectorAll(".publish-card")].find(c => /Instagram/.test(c.querySelector("h2").textContent)).querySelector("textarea"), "Leaves! #autumn")`);
await sleep(2500);
await p.eval(`window.__click("Hand to Claude in Chrome", [...document.querySelectorAll(".publish-card")].find(c => /Instagram/.test(c.querySelector("h2").textContent)))`);
await sleep(3000);
const ig = fakeMessages(dir).at(-1) ?? {};
ok("handed at once, waiting its turn behind the question", /Instagram account @leaves\.explained as a feed post/.test(ig.text ?? "") && ig.queued === true, JSON.stringify(ig).slice(0, 160));
ok("the question was not answered for the user", fakeAnswers(dir).length === answersBefore);
ok("page says handed", /Handed to Claude/.test(await p.text(".publish-panel")), (await p.text(".publish-panel")).slice(0, 200));
await p.shot(`${SHOTS}/45_publish_ig_handed.png`);
await p.click("^Allow$", ".chat-card:not(.answered)");
for (let i = 0; i < 15 && fakeAnswers(dir).length === answersBefore; i++) await sleep(500);
ok("the user's answer reached Claude", fakeAnswers(dir).length === answersBefore + 1);
ok("Instagram state handed", (await info()).state.instagram?.status === "handed");

console.log("== History and Reset");
await p.click("^History$");
await sleep(3500);
t = await p.text(".board");
ok("history: 3 YouTube uploads + Facebook posted + Instagram with Claude", (t.match(/YouTube/g) ?? []).length >= 3 && /Facebook Page · Reel/.test(t) && /posted/.test(t) && /with Claude/.test(t), t);
await p.shot(`${SHOTS}/46_publish_history.png`);
await p.go(`/publish/${leaves}`, 3500);
await p.eval(`window.__click("^Reset$", [...document.querySelectorAll(".publish-card")].find(c => /Facebook Page/.test(c.querySelector("h2").textContent)))`);
await sleep(2500);
ok("Reset clears Facebook (asked first)", !(await info()).state.facebook && /Clear the Facebook Page status/.test(JSON.stringify(await p.eval("window.__dialogs"))));
const hist = (await call("GET", "/api/published")).body;
ok("Reset removed its history row", !hist.some((r) => r.platform === "facebook"), JSON.stringify(hist.map((r) => r.platform + ":" + r.status)));

console.log("== missing / changed files");
fs.renameSync(`${dir}/out/long draft.mp4`, `${dir}/out/long draft.bak`);
await sleep(4500);
t = await p.text(".publish-panel");
ok("picked file gone → falls back to the final", /Final video/.test(t), t.slice(0, 160));
fs.renameSync(`${dir}/out/long draft.bak`, `${dir}/out/long draft.mp4`);
const sel = await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/../project.json" });
ok("picking a path outside the list refused", sel.status === 400, sel.body.error);
const del = await call("DELETE", `/api/projects/${third}`, { confirm: "3" });
ok("delete the third video works (to Recycle Bin)", del.status === 200 && !fs.existsSync(`${WS}/${third}`), JSON.stringify(del.body));

console.log("   page errors:", JSON.stringify(p.errors()));
await mcp.close();
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
