// Final tab: start, stop mid-render, resume, finish; a failure handed to Claude while it waits for the user's answer
// (it waits its turn, the question isn't answered); "Claude" (here: this script through MCP) fixes it and resumes.
import fs from "node:fs";
import { createRequire } from "node:module";
import { WS, SHOTS, B, call, ok, failures, fakeAnswers, fakeMessages, page, sleep } from "./lib.mjs";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const { leaves } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const dir = `${WS}/${leaves}`;
const job = async () => (await call("GET", `/api/projects/${leaves}/render`)).body;
const waitFor = async (pred, s = 300) => {
  for (let i = 0; i < s; i++) {
    const j = await job();
    if (pred(j)) return j;
    await sleep(1000);
  }
  return job();
};

const { browser, p } = await page(9343);
await p.go(`/p/${leaves}/final`, 4000);
let t = await p.text(".render-panel");
ok("plan: no blocks, start enabled", !(await p.eval(`window.__btn("Start final render").disabled`)), t.slice(0, 300));
await p.shot(`${SHOTS}/10_final_plan.png`);

console.log("== start, stop during the video render, resume");
await p.click("Start final render");
let j = await waitFor((x) => x.job?.steps.find((s) => s.id === "render")?.status === "running" && (x.live?.progress?.done ?? 0) > 10, 240);
ok("render step running with progress", j.job?.steps.find((s) => s.id === "render")?.status === "running", JSON.stringify(j.live?.progress));
await sleep(1500);
await p.shot(`${SHOTS}/11_final_running.png`);
await p.click("^Stop$");
await sleep(2500);
j = await job();
ok("stopped: cancelled, audio step kept as done", j.job.status === "cancelled" && j.job.steps[0].status === "done", j.job.status);
t = await p.text(".render-panel");
ok("page says Stopped and offers Resume", /Stopped/.test(t) && /Resume/.test(t), t.slice(0, 200));
await p.shot(`${SHOTS}/12_final_stopped.png`);
await p.click("^Resume$");
j = await waitFor((x) => ["done", "failed"].includes(x.job?.status), 400);
ok("finished", j.job.status === "done", j.job.status + " " + JSON.stringify(j.job.error));
ok("audio step not redone", j.job.steps[0].attempts === 1);
ok("delivery.mp4 written", fs.existsSync(`${dir}/out/delivery.mp4`));
ok("board stage final-ready", JSON.parse(fs.readFileSync(`${dir}/brief/status.json`, "utf8")).stage === "final-ready");
await sleep(3000);
t = await p.text(".render-panel");
ok("finished card with Publish button", /Finished video/.test(t) && /Publish this video/.test(t), t.slice(0, 300));
await p.shot(`${SHOTS}/13_final_done.png`);

console.log("== failure while Claude waits for the user's answer");
const sfx = fs.readFileSync(`${dir}/sfx.json`, "utf8");
fs.writeFileSync(`${dir}/sfx.json`, "{ this is broken");
const answersBefore = fakeAnswers(dir).length;
await call("POST", `/api/projects/${leaves}/chat/send`, { text: "FAKE-ASK-PERMISSION" });
for (let i = 0; i < 20 && (await call("GET", `/api/projects/${leaves}/publish`)).body.claude !== "question"; i++) await sleep(500);
await p.click("Render again");
j = await waitFor((x) => x.job?.status === "failed" && x.job.claudeNotice, 200);
ok("failed at the sound step", j.job.status === "failed" && j.job.error?.step === "audio", JSON.stringify(j.job.error));
const msg = fakeMessages(dir).at(-1) ?? {};
ok("Claude told at once; the message waits its turn", j.job.claudeNotice?.ok === true && /final render of this video failed/.test(msg.text ?? "") && msg.queued === true, JSON.stringify(j.job.claudeNotice) + " " + JSON.stringify(msg).slice(0, 160));
ok("the question was not answered for the user", fakeAnswers(dir).length === answersBefore);
await sleep(2500);
t = await p.text(".render-panel");
ok("page says Claude was told", /Claude was told automatically/.test(t), t.slice(0, 500));
await p.shot(`${SHOTS}/14_final_failed_told.png`);
// the user answers the question in the chat
await p.click("^Allow$", ".chat-card:not(.answered)");
for (let i = 0; i < 20 && fakeAnswers(dir).length === answersBefore; i++) await sleep(500);
ok("the user's answer reached Claude", fakeAnswers(dir).length === answersBefore + 1);

console.log("== 'Claude' fixes it and resumes through MCP");
fs.writeFileSync(`${dir}/sfx.json`, sfx);
const mcp = new Client({ name: "fake-claude", version: "0.0.1" });
await mcp.connect(new StreamableHTTPClientTransport(new URL(`${B}/mcp/${leaves}`)));
const st = JSON.parse((await mcp.callTool({ name: "render_status", arguments: {} })).content[0].text);
ok("render_status shows the failure and log path", st.job.status === "failed" && /logs\/audio\.log/.test(st.job.steps[0].log), st.job.steps[0].log);
const r = await mcp.callTool({ name: "render_resume", arguments: {} });
ok("render_resume accepted", /resumed/.test(r.content[0].text));
await mcp.close();
j = await waitFor((x) => ["done", "failed"].includes(x.job?.status), 400);
ok("finished after the fix", j.job.status === "done", j.job.status);
await sleep(3000);
await p.shot(`${SHOTS}/15_final_done_again.png`);

console.log("== Publish this video → Publish page with the final picked");
await p.click("Publish this video");
await sleep(3000);
ok("on /publish/<video>", (await p.path()) === `/publish/${leaves}`, await p.path());
ok("final file picked", /Final video/.test(await p.text(".publish-panel .vstrip")));
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
