// Two videos at once (queue) and an engine restart mid-render: both come back "interrupted"; Resume finishes them.
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import { WS, SHOTS, call, ok, failures, page, sleep, startEngine, stopEngine } from "./lib.mjs";

const { leaves, bees } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const dirB = `${WS}/${bees}`;
// make the bees video renderable: a recorded line (a tone), sound built
if (!fs.existsSync(`${dirB}/src/data/timing.json`) || JSON.parse(fs.readFileSync(`${dirB}/script.json`, "utf8")).placeholder) {
  fs.writeFileSync(`${dirB}/script.json`, JSON.stringify({ scenes: [{ id: "s01_intro", title: "Intro", cues: [{ id: "line", text: "Bees turn nectar into honey by evaporating its water." }] }] }, null, 1));
  fs.mkdirSync(`${dirB}/audio/vo`, { recursive: true });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=330:duration=3", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", `${dirB}/audio/vo/s01_intro__line.wav`]);
  execFileSync("python", ["D:/code_files/content-engine/pipeline/run.py", dirB, "audio"], { stdio: "ignore" });
  fs.writeFileSync(`${dirB}/brief/status.json`, JSON.stringify({ stage: "preview-ready", note: "Preview ready." }));
}
const job = async (n) => (await call("GET", `/api/projects/${n}/render`)).body;

console.log("== two videos: second waits in the queue");
const a = await call("POST", `/api/projects/${leaves}/render/start`, { rerender: [], autoFix: false });
const b = await call("POST", `/api/projects/${bees}/render/start`, { rerender: [], autoFix: false });
ok("both accepted", a.status === 200 && b.status === 200, JSON.stringify([a.body.error, b.body.error]));
const dbl = await call("POST", `/api/projects/${leaves}/render/start`, {});
ok("double start refused", dbl.status === 400, dbl.body.error);
let jb = await job(bees);
ok("second is queued at #1", jb.job.status === "queued" && jb.live?.queuePosition === 1, JSON.stringify(jb.live));
const { browser, p } = await page(9344);
await p.go("/", 3000);
const home = await p.text(".projects");
ok("home shows rendering % and queued #1", /rendering \d+%/.test(home) && /render queued \(#1\)/.test(home), home);
await p.shot(`${SHOTS}/20_home_two_renders.png`);
for (let i = 0; i < 120; i++) {
  const ja = await job(leaves);
  if ((ja.live?.progress?.done ?? 0) > 20 && ja.live?.step === "render") break;
  await sleep(1000);
}

console.log("== engine stops mid-render");
console.log("  ", await stopEngine());
await sleep(1500);
ok("engine restarted", await startEngine());
await sleep(1500);
const ja = await job(leaves);
jb = await job(bees);
ok("running job → interrupted", ja.job.status === "interrupted", ja.job.status);
ok("queued job → interrupted", jb.job.status === "interrupted", jb.job.status);
await p.go("/", 3000);
ok("home says interrupted", /render interrupted/.test(await p.text(".projects")), await p.text(".projects"));
await p.go(`/p/${leaves}/final`, 4000);
const t = await p.text(".render-panel");
ok("Final tab explains and offers Resume", /Interrupted/.test(t) && /Resume/.test(t), t.slice(0, 300));
await p.shot(`${SHOTS}/21_final_interrupted.png`);
await p.click("^Resume$");
await call("POST", `/api/projects/${bees}/render/resume`, {});
for (let i = 0; i < 400; i++) {
  const x = await job(leaves);
  const y = await job(bees);
  if (["done", "failed"].includes(x.job.status) && ["done", "failed"].includes(y.job.status)) break;
  await sleep(1000);
}
ok("first finished after resume", (await job(leaves)).job.status === "done");
ok("second finished after resume", (await job(bees)).job.status === "done", JSON.stringify((await job(bees)).job.error));
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
