// Facebook & Instagram through Meta's API, against the fake Meta (fake_meta.mjs, started here on 4181):
// Settings (app, Connect through the login redirect, Pages and Instagram listed, Test, Disconnect, pasted token),
// Publish: Facebook Reel, duplicate confirm, video post with a title, Reel limits, a dropped upload resumed, an engine
// restart while Meta processes (no second publish), Instagram Reel from a non-faststart draft, a failed publish resumed,
// a heavy file sent to Instagram as a lighter copy, and its "processing failed" upload resumed with a fresh container.
// Uses the 'leaves' video from t1 (its out/delivery.mp4 and out/long draft.mp4).
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import { WS, SHOTS, call, ok, failures, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const M = "http://127.0.0.1:4181";
const fake = spawn(process.execPath, [new URL("./fake_meta.mjs", import.meta.url).pathname.slice(1)], { stdio: "ignore" });
const mdebug = async () => (await fetch(`${M}/debug`)).json();
const faults = (f) => fetch(`${M}/debug/faults`, { method: "POST", body: JSON.stringify(f) });
await waitFor(async () => (await fetch(`${M}/debug`).catch(() => null))?.ok, 10000);

const leaves = fs.readdirSync(WS).find((d) => /^project-1-/.test(d));
const dir = `${WS}/${leaves}`;
for (const f of ["meta-app.json", "meta-token.json"]) fs.rmSync(`${WS}/secrets/${f}`, { force: true });
for (const f of ["history.json", "state.json", "facebook.json", "instagram.json", "facebook.log", "instagram.log"]) fs.rmSync(`${dir}/publish/${f}`, { force: true });
const ENV = { CE_META_GRAPH: M, CE_META_GRAPH_VIDEO: M, CE_META_RUPLOAD: M, CE_META_DIALOG: M, CE_META_POLL_MS: "300", CE_META_DOUBTFUL_MIN: "0.05" };
console.log(await stopEngine());
ok("scratch engine started", await startEngine(ENV));
const info = async () => (await call("GET", `/api/projects/${leaves}/publish`)).body;
/** Wait until pred(publish info) holds; returns the latest info either way. */
const until = async (pred, ms = 30000) => {
  let last = null;
  await waitFor(async () => pred((last = await info())), ms, 400);
  return last;
};

const { browser, p } = await page(9390, { width: 1500, height: 1000 });

console.log("== Settings: the Meta app");
await p.go("/settings", 3000);
let t = await p.text();
ok("setup steps with the redirect address", /Post through Meta's API/.test(t) && /http:\/\/localhost:4170\//.test(t), t.slice(t.indexOf("Facebook Page"), t.indexOf("Facebook Page") + 300));
const fill = async (ph, v) => p.eval(`window.__set([...document.querySelectorAll(".meta-account input")].find((i) => i.placeholder.startsWith(${JSON.stringify(ph)})), ${JSON.stringify(v)})`);
await fill("App ID", "123");
await fill("App secret", "0123456789abcdef0123456789abcdef");
await p.click("^Save$", ".meta-account");
await sleep(800);
ok("a bad App ID is refused with the reason", /The App ID is a number/.test(await p.text(".meta-account")), await p.text(".meta-account"));
await fill("App ID", "1234567890");
await p.click("^Save$", ".meta-account");
await sleep(1000);
ok("saved: Connect offered", /Connect Facebook & Instagram/.test(await p.text(".meta-account")), await p.text(".meta-account"));

console.log("== Connect through Facebook's login (fake) and the redirect back to the engine");
await p.click("^Connect Facebook & Instagram$");
await sleep(500);
const opened = await p.eval("window.__opened");
ok("login dialog asks for the publishing permissions", /dialog\/oauth/.test(opened) && /instagram_content_publish/.test(decodeURIComponent(opened)) && /redirect_uri=http%3A%2F%2Flocalhost%3A4170%2F/.test(opened), opened);
const back = await fetch(opened);
const html = await back.text();
ok("the engine's 'connected' page lists the Page and its Instagram", /Facebook &amp; Instagram connected|Facebook & Instagram connected/.test(html) && /Daily Insights/.test(html) && /@daily_insights21/.test(html), html.slice(0, 400));
ok("Settings shows the Pages", await waitFor(async () => /Daily Insights/.test(await p.text(".meta-account")) && /@daily_insights21/.test(await p.text(".meta-account")), 10000), await p.text(".meta-account"));
ok("…and a Page without Instagram says so", /Second Page[\s\S]*no Instagram linked/.test(await p.text(".meta-account")));
ok("token kept in the scratch secrets, not shown", fs.existsSync(`${WS}/secrets/meta-token.json`) && !/EAApage/.test(await p.text()));
await p.shot(`${SHOTS}/m01_settings_connected.png`);
await p.click("^Test connection$", ".meta-account");
ok("Test connection works", await waitFor(async () => /The connection works/.test(await p.text(".meta-account")), 8000));

console.log("== Disconnect, then the paste-a-token fallback");
await p.eval("window.__confirm = true");
await p.click("^Disconnect$", ".meta-account");
await sleep(1000);
ok("disconnected", !fs.existsSync(`${WS}/secrets/meta-token.json`) && /Connect Facebook & Instagram/.test(await p.text(".meta-account")));
await p.eval(`document.querySelector(".meta-account details.fallback").open = true`);
await fill("EAA", "EAApasted" + "x".repeat(60));
await p.click("^Use this token$", ".meta-account");
ok("connected with a pasted token", await waitFor(async () => /Daily Insights/.test(await p.text(".meta-account")), 8000), await p.text(".meta-account"));

console.log("== Publish: a Facebook Reel");
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/delivery.mp4" });
await p.go(`/publish/${leaves}`, 3500);
await p.eval(`window.__tab("Facebook")`);
await sleep(300);
t = await p.text(".publish-card:not([hidden])");
ok("Facebook tab posts through the API to the connected Page", /Daily Insights/.test(await p.eval(`document.querySelector(".publish-card:not([hidden]) select").selectedOptions[0].textContent`)) && /Post to Facebook/.test(t), t.slice(0, 300));
ok("the Chrome hand-off is folded under 'Other way'", /Other way: hand it to Claude in Chrome/.test(t));
await p.eval(`[...document.querySelectorAll(".publish-card:not([hidden]) .seg button")].find((b) => b.textContent === "Reel").click()`);
await p.eval(`window.__set(document.querySelector(".publish-card:not([hidden]) textarea"), "Inductors vs capacitors in 37 seconds #physics")`);
await waitFor(async () => !(await p.eval(`window.__btn("^Post to Facebook$").disabled`)), 8000);
await p.click("^Post to Facebook$");
let x = await until((i) => ["posted", "failed"].includes(i.state.facebook?.status));
ok("posted", x.state.facebook?.status === "posted", JSON.stringify(x.state.facebook?.error));
let d = await mdebug();
const size = fs.statSync(`${dir}/out/delivery.mp4`).size;
ok("Meta got the whole file, the caption, and one publish", d.videos[0]?.received === size && d.videos[0]?.finishCalls === 1 && d.videos[0]?.description === "Inductors vs capacitors in 37 seconds #physics" && d.videos[0]?.state === "PUBLISHED", JSON.stringify(d.videos[0]));
await sleep(2500);
t = await p.text(".publish-card:not([hidden])");
ok("page shows the link", /Posted on Daily Insights as a Reel: https:\/\/www\.facebook\.com\/reel\/5000/.test(t), t.slice(t.indexOf("Posted"), t.indexOf("Posted") + 200));
const h = JSON.parse(fs.readFileSync(`${dir}/publish/history.json`, "utf8"));
ok("history keeps the post id and account (for view counts later)", h.at(-1)?.route === "api" && h.at(-1)?.postId === "5000" && h.at(-1)?.account?.id === "1001", JSON.stringify(h.at(-1)));
await p.shot(`${SHOTS}/m02_fb_reel_posted.png`);

console.log("== the same file again: asks first");
await p.eval("window.__confirm = false");
await p.click("^Post again$");
await sleep(1500);
ok("Cancel posts nothing", (await mdebug()).videos.length === 1 && /Post it again as a second post/.test(JSON.stringify(await p.eval("window.__dialogs"))));
await p.eval("window.__confirm = true");
await p.click("^Post again$");
x = await until((i) => i.state.facebook?.status === "posted" && i.state.facebook?.result?.id === "5001");
ok("OK posts a second copy", (await mdebug()).videos.length === 2, JSON.stringify((await mdebug()).videos.map((v) => v.id)));

console.log("== a Facebook video post with a title");
await p.eval(`[...document.querySelectorAll(".publish-card:not([hidden]) .seg button")].find((b) => b.textContent === "Video post").click()`);
await sleep(300);
await p.eval(`window.__set([...document.querySelectorAll(".publish-card:not([hidden]) input")].find((i) => !i.type || i.type === "text"), "Inductor vs Capacitor")`);
await sleep(1500);
await p.click("^Post to Facebook$");
x = await until((i) => ["posted", "failed"].includes(i.state.facebook?.status) && i.state.facebook?.format === "post");
d = await mdebug();
ok("video post published with title and caption", x.state.facebook?.status === "posted" && d.pagePosts[0]?.title === "Inductor vs Capacitor" && d.sessions[0]?.received === size, JSON.stringify(d.pagePosts[0]) + JSON.stringify(x.state.facebook?.error));
ok("its link", /facebook\.com\/1001\/videos\/7000/.test(x.state.facebook?.url ?? ""), x.state.facebook?.url);

console.log("== Reel limits: a 100 s horizontal draft can't be a Facebook Reel");
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/long draft.mp4" });
await p.eval(`[...document.querySelectorAll(".publish-card:not([hidden]) .seg button")].find((b) => b.textContent === "Reel").click()`);
await sleep(3000);
t = await p.text(".publish-card:not([hidden])");
ok("blocked with the reasons", /3–90 seconds/.test(t) && /must be vertical/.test(t) && (await p.eval(`window.__btn("^Post to Facebook$").disabled`)), t.slice(t.indexOf("Still needed"), t.indexOf("Still needed") + 300));

console.log("== a dropped upload resumes where Meta says it stopped");
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/delivery.mp4" });
await faults({ dropAt: Math.floor(size / 2) });
await call("POST", `/api/projects/${leaves}/publish/facebook/post`, { again: true });
x = await until((i) => ["posted", "failed"].includes(i.state.facebook?.status));
ok("the broken upload shows as not posted (can resume)", x.state.facebook?.status === "failed" && x.state.facebook?.retryable === true, JSON.stringify(x.state.facebook));
await sleep(2500);
ok("button offers Resume", /^Resume$/.test(await p.eval(`window.__btn("^Resume$")?.textContent ?? ""`)));
await p.click("^Resume$");
await until((i) => i.state.facebook?.status !== "failed", 10000);
x = await until((i) => ["posted", "failed"].includes(i.state.facebook?.status));
d = await mdebug();
const resumed = d.videos.at(-1);
ok("finished after Resume, whole file, one publish", x.state.facebook?.status === "posted" && resumed.received === size && resumed.finishCalls === 1, JSON.stringify(resumed));
ok("continued from where Meta stopped (log)", /continuing from there/.test(fs.readFileSync(`${dir}/publish/facebook.log`, "utf8")));

console.log("== the engine stops while Meta processes: no second publish");
await faults({ slowPolls: 100000 });
await call("POST", `/api/projects/${leaves}/publish/facebook/post`, { again: true });
await until((i) => i.state.facebook?.status === "processing", 30000);
console.log("  ", await stopEngine());
ok("engine back", await startEngine(ENV));
x = await info();
ok("post interrupted after the restart", x.state.facebook?.status === "interrupted", x.state.facebook?.status);
await faults({ slowPolls: 1 });
await call("POST", `/api/projects/${leaves}/publish/facebook/post`, {});
x = await until((i) => ["posted", "failed"].includes(i.state.facebook?.status));
d = await mdebug();
ok("resumed to posted with exactly one publish", x.state.facebook?.status === "posted" && d.videos.at(-1).finishCalls === 1, JSON.stringify(d.videos.at(-1)));

console.log("== Instagram Reel from the draft (not faststart: the engine fixes a copy)");
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/long draft.mp4" });
await p.go(`/publish/${leaves}`, 3500);
await p.eval(`window.__tab("Instagram")`);
await sleep(300);
ok("Instagram tab: the linked account", /@daily_insights21/.test(await p.eval(`document.querySelector(".publish-card:not([hidden]) select").selectedOptions[0].textContent`)));
await p.eval(`window.__set(document.querySelector(".publish-card:not([hidden]) textarea"), "Leaves in autumn #science")`);
await p.eval(`document.querySelector(".publish-card:not([hidden]) .check input").click()`);
await sleep(1500);
await faults({ failPublish: true });
await p.click("^Post to Instagram$");
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 60000);
ok("a failed publish shows as not posted", x.state.instagram?.status === "failed", JSON.stringify(x.state.instagram));
await sleep(2500);
console.log("   click:", await p.click("^Resume$"));
// the click starts a new attempt: wait for the old "failed" to go, then for the outcome
await until((i) => i.state.instagram?.status !== "failed", 10000);
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 60000);
d = await mdebug();
const c = d.containers.at(-1);
ok("posted once after Resume", x.state.instagram?.status === "posted" && d.media.length === 1, JSON.stringify(x.state.instagram?.error) + JSON.stringify(d.media));
ok("uploaded faststart, Reels tab only, with the caption", c.faststart === true && c.share_to_feed === "false" && c.caption === "Leaves in autumn #science", JSON.stringify(c));
ok("the temporary copy is gone", !fs.readdirSync(`${dir}/publish/.upload`).length);
await sleep(2500);
t = await p.text(".publish-card:not([hidden])");
ok("page shows the Instagram link", /instagram\.com\/reel\/FAKE18000000/.test(t), t.slice(t.indexOf("Posted"), t.indexOf("Posted") + 200));
await p.shot(`${SHOTS}/m03_ig_posted.png`);

console.log("== Instagram: a heavy file goes as a lighter copy; 'processing failed' resumes with a fresh upload");
const heavy = `${dir}/out/heavy.mp4`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc2=s=1080x1920:r=24:d=20", "-f", "lavfi", "-i", "sine=frequency=440:duration=20", "-vf", "noise=alls=30:allf=t", "-c:v", "libx264", "-b:v", "12M", "-minrate", "12M", "-maxrate", "12M", "-bufsize", "12M", "-x264-params", "nal-hrd=cbr", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", "-movflags", "+faststart", heavy]);
const heavySize = fs.statSync(heavy).size;
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/heavy.mp4" });
await sleep(3000);
t = await p.text(".publish-card:not([hidden])");
ok("the tab says Instagram gets a lighter copy", heavySize > 24e6 && /\d+ MB: posting through Meta's API sends Instagram a lighter copy \(about 8 MB, 3\.0 Mbit\/s\)/.test(t), `${heavySize} ` + t.slice(0, 600));
await faults({ igProcessingFail: 1 });
const before = (await mdebug()).containers.length;
await call("POST", `/api/projects/${leaves}/publish/instagram/post`, {});
ok("the page shows the copy being made", await waitFor(async () => /Preparing the video for Instagram/.test(await p.text(".publish-card:not([hidden])")), 15000, 200));
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 90000);
d = await mdebug();
ok("'processing failed' shows as not posted, can resume", x.state.instagram?.status === "failed" && x.state.instagram?.retryable === true && /couldn't process it/.test(x.state.instagram?.error ?? ""), JSON.stringify(x.state.instagram));
ok("the lighter copy went up (about 8 MB)", d.containers.at(-1).size > 5e6 && d.containers.at(-1).size < 11e6, `${d.containers.at(-1).size} of ${heavySize}`);
ok("…and the engine looked at the container before giving up", /checking whether it has the video anyway/.test(fs.readFileSync(`${dir}/publish/instagram.log`, "utf8")));
await sleep(2500);
await p.click("^Resume$");
await until((i) => i.state.instagram?.status !== "failed", 10000);
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 90000);
d = await mdebug();
const igLog = fs.readFileSync(`${dir}/publish/instagram.log`, "utf8");
ok("posted after Resume through a fresh container", x.state.instagram?.status === "posted" && d.containers.length === before + 2 && d.media.at(-1)?.container === d.containers.at(-1).id, JSON.stringify(x.state.instagram?.error) + JSON.stringify(d.containers.slice(before)));
ok("the copy was made once and reused, faststart, then removed", igLog.split(`making a lighter copy for Instagram: ${heavySize} bytes`).length === 2 && d.containers.at(-1).faststart === true && d.containers.at(-1).size === d.containers.at(-2).size && !fs.readdirSync(`${dir}/publish/.upload`).length, igLog.slice(-600));

console.log("== Instagram says 'processing failed' but finishes anyway: posted without a second upload");
await faults({ igProcessingSays: 1 });
const before2 = (await mdebug()).containers.length;
await call("POST", `/api/projects/${leaves}/publish/instagram/post`, { again: true });
await until((i) => i.state.instagram?.status !== "posted", 10000);
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 90000);
d = await mdebug();
ok("posted from the same container", x.state.instagram?.status === "posted" && d.containers.length === before2 + 1 && d.media.at(-1)?.container === d.containers.at(-1).id, JSON.stringify(x.state.instagram?.error) + JSON.stringify(d.containers.slice(before2)));
fs.rmSync(heavy, { force: true });

console.log("== a small file without faststart: only its index is moved (no re-encode)");
const plain = `${dir}/out/plain draft.mp4`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "testsrc2=s=1080x1920:r=24:d=4", "-f", "lavfi", "-i", "sine=duration=4", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", plain]);
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/plain draft.mp4" });
await call("POST", `/api/projects/${leaves}/publish/instagram/post`, {});
await until((i) => i.state.instagram?.status !== "posted", 10000);
x = await until((i) => ["posted", "failed"].includes(i.state.instagram?.status), 60000);
d = await mdebug();
ok("posted faststart, same size give or take the index", x.state.instagram?.status === "posted" && d.containers.at(-1).faststart === true && Math.abs(d.containers.at(-1).size - fs.statSync(plain).size) < 5000 && /moving the video's index to the front/.test(fs.readFileSync(`${dir}/publish/instagram.log`, "utf8")), JSON.stringify(d.containers.at(-1)) + JSON.stringify(x.state.instagram?.error));
fs.rmSync(plain, { force: true });

console.log("== History");
await p.go("/publish", 3000);
t = await p.text(".board");
ok("history lists the Facebook and Instagram posts", /Facebook/.test(t) && /Instagram/.test(t), t.slice(0, 500));

console.log("   page errors:", JSON.stringify(p.errors()));
ok("no page errors", p.errors().length === 0);
browser.proc.kill();
fake.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
