// Brief: Claude's files show on the board; Approve sent while Claude waits for an answer waits its turn and never
// answers the question; preview-ready → Editor. "Claude" is the fake stand-in; this script writes the files the real
// Claude would write.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { WS, SHOTS, call, ok, failures, fakeAnswers, fakeMessages, page, sleep, waitFor } from "./lib.mjs";

const { leaves } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const dir = `${WS}/${leaves}`;
const { browser, p } = await page(9342);
await p.go(`/p/${leaves}/brief`, 4000);

console.log("== Claude writes the brief");
fs.writeFileSync(`${dir}/brief.md`, "# Why leaves change colour\n\nA 20 s vertical explainer for kids.\n");
fs.writeFileSync(`${dir}/script.json`, JSON.stringify({ scenes: [{ id: "s01_intro", title: "Intro", cues: [{ id: "line", text: "In autumn, leaves stop making green chlorophyll, so the yellow and red underneath show through." }] }] }, null, 1));
fs.writeFileSync(`${dir}/style.md`, "# Look\n\nInk #101418, paper #f2e8d5, accent #e0662e.\n");
fs.mkdirSync(`${dir}/brief/frames`, { recursive: true });
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=#e0662e:size=540x960", "-frames:v", "1", `${dir}/brief/frames/frame1.png`]);
fs.writeFileSync(`${dir}/brief/status.json`, JSON.stringify({ stage: "awaiting-approval", note: "Script and two style frames are ready: approve, or tell me what to change." }));
await sleep(3000);
const t = await p.text(".board");
ok("board shows idea, script, look", /Why leaves change colour/.test(t) && /chlorophyll/.test(t) && /Style guide/.test(t), t.slice(0, 300));
ok("Approve button shown", /Approve and build/.test(t));
await p.shot(`${SHOTS}/05_brief_awaiting.png`);

console.log("== Approve while Claude waits for the user's answer to a permission question");
const answersBefore = fakeAnswers(dir).length;
await call("POST", `/api/projects/${leaves}/chat/send`, { text: "FAKE-ASK-PERMISSION" });
ok("permission card in the chat", await waitFor(async () => !!(await p.eval(`!!document.querySelector(".chat-card:not(.answered)")`))));
await p.click("Approve and build");
await sleep(2000);
const m = fakeMessages(dir);
ok("Approve delivered to Claude, waiting its turn", m.at(-1)?.text === "Approved. Build the preview." && m.at(-1)?.queued === true, JSON.stringify(m.at(-1)));
ok("the question was not answered for the user", fakeAnswers(dir).length === answersBefore, JSON.stringify(fakeAnswers(dir)));
ok("no error on the board", !(await p.text(".board .error")), await p.text(".board .error"));
await p.shot(`${SHOTS}/06_brief_approve_question.png`);

console.log("== the user answers in the chat; Claude then takes the Approve");
await p.click("^Allow$", ".chat-card:not(.answered)");
ok("answer reached Claude", await waitFor(() => fakeAnswers(dir).length === answersBefore + 1));
ok("Approve answered after the question", await waitFor(async () => /received 28 characters/.test(await p.text(".chat-list"))));

console.log("== Claude builds; preview ready");
fs.writeFileSync(`${dir}/brief/status.json`, JSON.stringify({ stage: "building", note: "Recording the voice…" }));
await sleep(2500);
ok("board: building", /Recording the voice/.test(await p.text(".board .status")));
fs.mkdirSync(`${dir}/audio/vo`, { recursive: true });
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=220:duration=3", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", `${dir}/audio/vo/s01_intro__line.wav`]);
execFileSync("python", ["D:/code_files/content-engine/pipeline/run.py", dir, "audio"], { stdio: "ignore" });
fs.writeFileSync(`${dir}/brief/status.json`, JSON.stringify({ stage: "preview-ready", note: "The preview is ready in the Editor." }));
await sleep(2500);
ok("Open the Editor button", /Open the Editor/.test(await p.text(".board .status")));
await p.shot(`${SHOTS}/07_brief_preview_ready.png`);
await p.click("Open the Editor");
await sleep(1000);
ok("Editor tab", (await p.path()) === `/p/${leaves}`);
for (let i = 0; i < 60; i++) {
  if (await p.eval(`!!document.querySelector(".studio-pane iframe")`)) break;
  await sleep(1000);
}
await sleep(20000);
ok("Studio iframe loaded", await p.eval(`!!document.querySelector(".studio-pane iframe")`));
const sees = await p.text(".sees");
ok("'Claude sees' strip reports the position", /0:0/.test(sees) || /Intro/.test(sees), sees);
await p.shot(`${SHOTS}/08_editor.png`);
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
