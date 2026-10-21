// The five UX changes: Final tab (Resume first, Start over on request, finished video kept), Publish step and way back,
// folder names on hover, voice "not decided" on a new Brief.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { WS, SHOTS, call, ok, failures, fakeTrust, page, sleep } from "./lib.mjs";

const job = async (n) => (await call("GET", `/api/projects/${n}/render`)).body;
const waitJob = async (n, pred, s = 300) => {
  for (let i = 0; i < s; i++) {
    const j = await job(n);
    if (pred(j)) return j;
    await sleep(1000);
  }
  return job(n);
};
const A = (await call("POST", "/api/projects", { request: "Why do cats purr?", title: "Why do cats purr?" })).body;
const dir = A.dir.replace(/\\/g, "/");
fakeTrust(dir);
const { browser, p } = await page(9360);

console.log("== new Brief: voice not decided");
await p.go(`/p/${A.name}/brief`, 5000);
let t = await p.text(".board");
ok("Sound says the voice isn't decided", /Voice not decided/.test(t) && !/cedar/.test(t), t.slice(t.indexOf("Sound"), t.indexOf("Sound") + 120));
await p.shot(`${SHOTS}/70_brief_voice_not_decided.png`);

console.log("== make it renderable and finish a render");
fs.writeFileSync(`${dir}/script.json`, JSON.stringify({ scenes: [{ id: "s01_intro", title: "Intro", cues: [{ id: "line", text: "Cats purr by twitching the muscles of their voice box." }] }] }, null, 1));
fs.mkdirSync(`${dir}/audio/vo`, { recursive: true });
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=200:duration=3", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", `${dir}/audio/vo/s01_intro__line.wav`]);
execFileSync("python", ["D:/code_files/content-engine/pipeline/run.py", dir, "audio"], { stdio: "ignore" });
fs.writeFileSync(`${dir}/brief/status.json`, JSON.stringify({ stage: "preview-ready", note: "Preview ready." }));
await sleep(2500);
ok("after talking it through, the template voice shows as chosen", /cedar/.test(await p.text(".board")));
await call("POST", `/api/projects/${A.name}/render/start`, { rerender: [], autoFix: false });
let j = await waitJob(A.name, (x) => ["done", "failed"].includes(x.job?.status));
ok("first render done", j.job.status === "done", JSON.stringify(j.job.error));

console.log("== Render again, then Stop: the finished video stays, Resume is the one next step");
await p.go(`/p/${A.name}/final`, 4000);
await p.click("^Render again$");
await waitJob(A.name, (x) => (x.live?.progress?.done ?? 0) > 5 && x.job.steps.find((s) => s.id === "render")?.status === "running", 200);
await p.click("^Stop$");
await sleep(3000);
t = await p.text(".render-panel");
ok("stopped render: Resume + 'Start over instead', no start form", /Resume/.test(t) && /Start over instead/.test(t) && !/Render again\b(?! below)/.test(t.replace(/Start over instead/, "")), t.slice(0, 500));
ok("finished video still shown with the 'last finished' note", /Finished video/.test(t) && /last finished video/.test(t) && (await p.eval(`!!document.querySelector("video.final-video")`)), t.slice(t.indexOf("Finished video"), t.indexOf("Finished video") + 200));
ok("Publish this video still there", /Publish this video/.test(t));
await p.shot(`${SHOTS}/71_final_stopped_rerender.png`);
await p.click("^Start over instead$");
await sleep(800);
t = await p.text(".render-panel");
ok("Start over shows the form with its explanation", /Starting over runs every step again/.test(t) && /Render again/.test(t), t.slice(-600));
await p.shot(`${SHOTS}/72_final_start_over.png`);
await p.click("^Resume$");
j = await waitJob(A.name, (x) => ["done", "failed"].includes(x.job?.status));
ok("resume finished", j.job.status === "done");
await sleep(3000);
ok("start form back as 'Render again' after finishing", /Render again/.test(await p.text(".render-panel")) && !/Start over instead/.test(await p.text(".render-panel")));

console.log("== Publish step in the tab bar, and back");
await p.click("^Publish$", "nav.tabs");
await sleep(4000);
ok("Publish tab → /publish/<video>", (await p.path()) === `/publish/${A.name}`, await p.path());
await p.click("^Open the video$");
await sleep(3000);
ok("'Open the video' → the video's page", (await p.path()) === `/p/${A.name}`, await p.path());
await p.shot(`${SHOTS}/73_tabs_with_publish.png`);

console.log("== Videos: folder names on hover only");
await p.go("/", 3000);
t = await p.text(".projects");
ok("no folder name in the row", !t.includes(A.name), t);
ok("folder in the title's tooltip", (await p.eval(`document.querySelector(".projects .title").title`)).includes(A.name));
await p.shot(`${SHOTS}/74_home_no_folders.png`);
console.log("   page errors:", JSON.stringify(p.errors().filter((e) => !/localhost:32\d\d/.test(e))));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
