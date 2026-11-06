// Packaging end to end: the scores, a video with planted faults through `ce package`, the Hook card on the Brief, the
// Package tab, picks reaching the Publish drafts, nothing uploaded. Scratch engine only (4170, D:\tmp\ce-x, fake Claude).
// Run after `node build.mjs D:\tmp\ce-chat-dist` in app/.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { lintCaption, lintTitle, phoneTitle, readHooks, scoreHook } from "../../cli/packaging.mjs";
import { createProject } from "../../cli/projects.mjs";
import { B, WS, SHOTS, call, ok, failures, fakeMessages, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const ENGINE = "D:/code_files/content-engine";
const ce = (...args) => execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, ...args], { encoding: "utf8", stdio: "pipe" });
const json = (dir, rel) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, rel), "utf8"));
  } catch {
    return {};
  }
};
const write = (dir, rel, text) => {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  fs.writeFileSync(path.join(dir, rel), typeof text === "string" ? text : JSON.stringify(text, null, 1));
};

console.log(await stopEngine());
fs.mkdirSync(WS, { recursive: true });
for (const d of fs.readdirSync(WS)) if (/-pack-faults$/.test(d)) fs.rmSync(path.join(WS, d), { recursive: true, force: true });

// ---- the scores
const warmUp = scoreHook("So today I want to talk about the amazing ocean");
const strong = scoreHook("You lose 2 litres of water a day, but why does nobody tell you?");
ok("a warm-up scores weak", warmUp.verdict === "weak" && !!warmUp.note, JSON.stringify(warmUp));
ok("a specific hook beats a warm-up by a clear margin", strong.measured >= warmUp.measured + 20, `${strong.measured} vs ${warmUp.measured}`);
ok("a warm-up is named as one", /warm-up/.test(warmUp.note), warmUp.note);
ok("an empty line scores nothing", scoreHook("").parts.brevity === 0);
ok("a weak note never asks for a 'you' or for stakes: an explainer needn't have them", ["Why is the sea salty?", "The ocean is very large and wet."].every((h) => !/speak to|gain or lose/.test(scoreHook(h).note)), scoreHook("Why is the sea salty?").note);
ok("a script with no capitals can't shout", !lintTitle("समुद्र का पानी क्यों नमकीन है 35").issues.some((i) => /capitals/.test(i)), lintTitle("समुद्र का पानी क्यों नमकीन है 35").issues.join("; "));
ok("a phone cuts a long title at a word", phoneTitle("This title is far too long to fit on a phone in any feed") === "This title is far too long to fit on a…", phoneTitle("This title is far too long to fit on a phone in any feed"));
ok("a short title isn't cut", phoneTitle("35 grams of salt") === "35 grams of salt");
const long = lintTitle("This title is far too long to fit on a phone in any feed at all today");
ok("a long title is flagged for search and for phones", long.issues.some((i) => /search/.test(i)) && long.issues.some((i) => /phone shows/.test(i)), long.issues.join("; "));
ok("a vague word is flagged", lintTitle("The ultimate guide to 35 grams").issues.some((i) => /ultimate/.test(i)));
ok("shouting is flagged", lintTitle("THE SEA IS VERY SALTY 35").issues.some((i) => /capitals/.test(i)));
ok("a title repeating its thumbnail is flagged, with the words", lintTitle("35 grams of salt per kilo", "SALT STAYS").issues.some((i) => /repeats the thumbnail \(salt\)/.test(i)));
ok("a title that adds to its thumbnail is good", lintTitle("35 grams per kilo of sea", "SALT STAYS").good.includes("adds to the thumbnail"));
ok("a clean title beats a bad one", lintTitle("35 grams per kilo of sea").score > long.score);
ok("caption marks add up", lintCaption({ text: "A line.", curiosity: 4, aeo: 5, voice: 4, brevity: 5 }).total === 18);
ok("hashtags and tired words are flagged in a caption", lintCaption({ text: "Unlock the sea. #salt" }).issues.length === 2);

// ---- a video with planted faults
const dir = createProject({ workspace: WS, slug: "pack-faults", title: "Pack faults" });
const name = path.basename(dir);
ok("a new video gets the packaging skill", fs.existsSync(path.join(dir, ".claude/skills/packaging/SKILL.md")) && fs.existsSync(path.join(dir, ".claude/skills/packaging/hook-formulas.md")));
const noThumbs = spawnSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "package", dir], { encoding: "utf8" });
ok("no thumbnails yet is a plain message", noThumbs.status !== 0 && /src\/thumbnails/.test(noThumbs.stderr + noThumbs.stdout), (noThumbs.stderr + noThumbs.stdout).slice(-200));

write(dir, "src/thumbnails/index.ts", `import { registerRoot } from "remotion";\nimport { Thumbs } from "./Thumbs";\n\nregisterRoot(Thumbs);\n`);
write(
  dir,
  "src/thumbnails/Thumbs.tsx",
  `import React from "react";
import { AbsoluteFill, Still } from "remotion";

const T: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => <div style={{ position: "absolute", color: "#fff", fontFamily: "sans-serif", fontWeight: 900, ...style }}>{children}</div>;

const Clean: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#101018" }}>
    <T style={{ left: 120, top: 300, fontSize: 220 }}>SALT</T>
  </AbsoluteFill>
);
const Bad: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#808080" }}>
    <T style={{ left: 120, top: 200, fontSize: 200, color: "#8c8c8c" }}>GREY</T>
    <T style={{ left: 120, top: 500, fontSize: 40 }}>tiny</T>
    <T style={{ left: -400, top: 700, fontSize: 200 }}>OFF</T>
    <T style={{ left: 120, top: 1000, fontSize: 120, fontFamily: "No Such Font" }}>FONT</T>
    <T style={{ left: 120, top: 1500, fontSize: 140 }}>LOW</T>
  </AbsoluteFill>
);
const Wide: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#101018" }}>
    <T style={{ right: 20, bottom: 20, fontSize: 90 }}>SEA</T>
  </AbsoluteFill>
);

export const Thumbs: React.FC = () => (
  <>
    <Still id="Thumb-a" component={Clean} width={1080} height={1920} />
    <Still id="Thumb-b" component={Bad} width={1080} height={1920} />
    <Still id="Thumb-c" component={Wide} width={1280} height={720} />
  </>
);
`,
);
write(dir, "package/titles.json", [
  { id: "t1", title: "35 grams per kilo of sea", thumb: "a" },
  { id: "t2", title: "Why SALT never leaves the sea and what that means for all of us", thumb: "a" },
  { id: "t3", title: "No thumbnail for this one 4", thumb: "z" },
]);
write(dir, "package/captions.json", [
  { id: "c1", text: "Rain did this.\nWhy is the sea salty?", keyphrase: "why is the sea salty", curiosity: 4, aeo: 5, voice: 4, brevity: 5 },
  { id: "c2", text: "Unlock the sea. It is salty. Really. #salt", keyphrase: "", curiosity: 2, aeo: 2, voice: 2, brevity: 2 },
]);
const tempBundles = () => fs.readdirSync(os.tmpdir()).filter((x) => x.startsWith("remotion-webpack-bundle")).length;
const bundlesBefore = tempBundles();
const out = ce("package", dir);
ok("it leaves no copy of the video's files in the system's temp folder", tempBundles() <= bundlesBefore, `${bundlesBefore} -> ${tempBundles()}`);
ok("ce package reports", /thumbnail a/.test(out) && /MISSING/.test(out), out.slice(0, 300));
const report = JSON.parse(fs.readFileSync(path.join(dir, "package/report.json"), "utf8"));
const thumb = (id) => report.thumbs.find((t) => t.id === id);
const has = (id, level, re) => thumb(id).findings.some((f) => f.level === level && re.test(`${f.where} ${f.problem}`));
const show = (id) => thumb(id).findings.map((f) => `${f.level} ${f.where} ${f.problem}`).join(" | ");
ok("three thumbnails are rendered as JPEGs", report.thumbs.length === 3 && report.thumbs.every((t) => fs.readFileSync(path.join(dir, t.file)).subarray(0, 2).toString("hex") === "ffd8"));
ok("a clean thumbnail has no findings", thumb("a").findings.length === 0, show("a"));
ok("text cut off by the edge fails", has("b", "fail", /OFF.*cut off/), show("b"));
ok("an unloaded font fails", has("b", "fail", /FONT.*No Such Font/), show("b"));
ok("text too small for a phone is flagged", has("b", "warn", /tiny.*phone size/), show("b"));
ok("low contrast is flagged, with its ratio", has("b", "warn", /GREY.*contrast 1\.\d:1/), show("b"));
ok("white on a grey that's readable isn't called low contrast", !has("b", "warn", /LOW.*contrast/) && !has("a", "warn", /contrast/), show("b"));
ok("text in the bottom of a vertical thumbnail is flagged", has("b", "warn", /LOW.*bottom of the frame/), show("b"));
ok("too many words are flagged", has("b", "warn", /5 words; 3 is the ceiling/), show("b"));
ok("text in a wide thumbnail's corner is flagged", has("c", "warn", /SEA.*video's length/), show("c"));
ok("a wide thumbnail keeps its shape", thumb("c").width === 1280 && thumb("c").height === 720);
ok("titles come back best first", report.titles[0].id === "t1", report.titles.map((t) => t.id).join());
ok("a title is checked against its own thumbnail", report.titles.find((t) => t.id === "t2").issues.some((i) => /repeats the thumbnail \(salt\)/.test(i)));
ok("a title paired with no real thumbnail is reported", report.titles.find((t) => t.id === "t3").thumb === null && report.missing.some((m) => /no thumbnail/.test(m)), report.missing.join());
ok("too few options are reported", report.missing.some((m) => /3 titles, not 10/.test(m)) && report.missing.some((m) => /2 captions, not 5/.test(m)), report.missing.join());
ok("captions come back best first, with their faults", report.captions[0].id === "c1" && report.captions[1].issues.length >= 2, JSON.stringify(report.captions[1]));
ok("no working files left behind", !fs.existsSync(path.join(dir, "package/_render")));

// a failed run keeps the last good package
const packageRun = () => spawnSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "package", dir], { encoding: "utf8" });
const reportAt = () => json(dir, "package/report.json").at;
const goodAt = reportAt();
const goodThumbs = fs.readFileSync(path.join(dir, "src/thumbnails/Thumbs.tsx"), "utf8");
write(dir, "src/thumbnails/Thumbs.tsx", "this is not code {");
const failed = packageRun();
ok("a broken thumbnail file fails in plain words", failed.status !== 0 && /didn't render/.test(failed.stderr + failed.stdout), (failed.stderr + failed.stdout).slice(-200));
ok("and the last good package stays whole", reportAt() === goodAt && report.thumbs.every((t) => fs.existsSync(path.join(dir, t.file))));
ok("with no working files left", !fs.existsSync(path.join(dir, "package/_render")));
write(dir, "src/thumbnails/Thumbs.tsx", goodThumbs);
const goodTitles = fs.readFileSync(path.join(dir, "package/titles.json"), "utf8");
write(dir, "package/titles.json", { titles: [] });
const wrongShape = packageRun();
ok("titles in the wrong shape are named", wrongShape.status !== 0 && /titles\.json has to be a list/.test(wrongShape.stderr + wrongShape.stdout), (wrongShape.stderr + wrongShape.stdout).slice(-200));
ok("and change nothing", reportAt() === goodAt && report.thumbs.every((t) => fs.existsSync(path.join(dir, t.file))));
write(dir, "package/titles.json", goodTitles);

// one at a time, across processes
fs.writeFileSync(path.join(dir, "package/.lock"), String(process.pid));
const busy = packageRun();
ok("a second run is refused in plain words", busy.status !== 0 && /already being made/.test(busy.stderr + busy.stdout), (busy.stderr + busy.stdout).slice(-200));
fs.writeFileSync(path.join(dir, "package/.lock"), "999999");
ok("a lock left by a crash doesn't block anything", packageRun().status === 0 && !fs.existsSync(path.join(dir, "package/.lock")));

// ---- hooks
write(dir, "brief/status.json", { stage: "talking", note: "Choosing the hook." });
write(dir, "brief/hooks.json", {
  options: [
    { id: "a", text: "Why is the sea salty?", formula: "The Question", judged: 66, why: "a question everyone half knows" },
    { id: "b", text: "Every kilo of seawater hides 35 grams of salt.", formula: "The Statistic", judged: 78, why: "a number you can picture" },
    { id: "c", text: "So today I want to talk about the ocean.", formula: "The Direct Address", judged: 20, why: "a warm-up" },
    { id: "d", text: "Rain made the sea salty.", formula: "Contrarian Flip", judged: 72, why: "sounds backwards" },
    { id: "e", text: "Nobody salted the sea, but it keeps getting saltier.", formula: "The Impossible Claim", judged: 74, why: "opens a loop" },
  ],
  chosen: null,
});
const hooks = readHooks(dir);
ok("hooks come back best first", hooks.options[0].id === "b" && hooks.best.join() === "b,e", hooks.options.map((o) => `${o.id}:${o.score}`).join());
ok("the warm-up comes last, and it's called weak", hooks.options.at(-1).id === "c" && hooks.options.at(-1).verdict === "weak" && /warm-up/.test(hooks.options.at(-1).note), JSON.stringify(hooks.options.at(-1)));
const plain = hooks.options.filter((o) => ["a", "d"].includes(o.id));
ok("a short plain hook Claude rates isn't called weak", plain.every((o) => o.verdict !== "weak" && o.note === null), JSON.stringify(plain.map((o) => [o.text, o.score, o.verdict])));
const printed = ce("hooks", dir);
ok("ce hooks prints scores and what's weak", /The Statistic/.test(printed) && /weak:/.test(printed) && /best two: b, e/.test(printed), printed.slice(0, 300));

// ---- the website
ok("engine started", await startEngine());
const P = `/api/projects/${encodeURIComponent(name)}`;
let brief = await call("GET", `${P}/brief`);
ok("the board gets the hooks", brief.body.hooks?.best?.join() === "b,e" && brief.body.hooks.chosen === null, JSON.stringify(brief.body.hooks).slice(0, 200));
ok("the packaging skill isn't listed as one of the user's files", !brief.body.skills.includes("packaging"));
ok("an unknown hook is refused", (await call("POST", `${P}/hook`, { id: "zz" })).status === 400);
let pack = await call("GET", `${P}/package`);
ok("the report comes through the API", pack.status === 200 && pack.body.report?.thumbs?.length === 3, JSON.stringify(pack.body).slice(0, 200));
const pic = await fetch(`${B}${P}/file?path=${encodeURIComponent("package/thumbs/a.jpg")}`);
ok("a thumbnail is served", pic.status === 200 && /jpeg/.test(pic.headers.get("content-type")));
ok("nothing else near it is", (await fetch(`${B}${P}/file?path=${encodeURIComponent("package/../project.json")}`)).status === 404);
const foreign = await fetch(`${B}${P}/package/use`, { method: "POST", headers: { "content-type": "application/json", origin: "https://example.com" }, body: JSON.stringify({ kind: "title", id: "t1" }) });
ok("a foreign page can't pick anything", foreign.status === 403 || foreign.status === 400, foreign.status);
ok("an unknown option is refused", (await call("POST", `${P}/package/use`, { kind: "title", id: "nope" })).status === 400);
ok("an unknown kind is refused", (await call("POST", `${P}/package/use`, { kind: "video", id: "t1" })).status === 400);

fs.rmSync(path.join(dir, ".claude/skills/packaging"), { recursive: true, force: true });
const make = await call("POST", `${P}/package/make`);
ok("the button reaches Claude", make.status === 200 && make.body.sent === true, JSON.stringify(make.body));
ok("it restores the skill on an older video", fs.existsSync(path.join(dir, ".claude/skills/packaging/SKILL.md")));
ok("Claude is told to package the video", await waitFor(() => fakeMessages(dir).some((m) => /package this video/.test(m.text)), 15000));

const { browser, p } = await page(9347);
try {
  await p.go(`/p/${encodeURIComponent(name)}/brief`, 3000);
  let text = await p.text();
  ok("the Hook card shows the best two", /Every kilo of seawater/.test(text) && /Nobody salted the sea/.test(text) && !/So today I want/.test(text), text.slice(0, 400));
  ok("the rest are one click away", /Show all 5/.test(text));
  await p.shot(`${SHOTS}/hook-card.png`);
  ok("all five can be seen", (await p.click("Show all 5")) !== undefined && (await sleep(300), /So today I want/.test(await p.text())));
  // Claude can't be reached: the pick mustn't look done, and it must stay possible
  const state = async () => (await call("GET", `${P}/publish`)).body.claude;
  await waitFor(async () => ["idle", "stopped"].includes(await state()), 15000);
  await call("POST", `${P}/chat/terminal`);
  await waitFor(async () => (await state()) === "external", 10000);
  await p.click("Use this hook");
  ok("a pick Claude can't receive says so", await waitFor(async () => /Not sent/.test(await p.text()), 6000), (await p.text()).slice(0, 300));
  ok("and isn't saved", !json(dir, "brief/hooks.json").chosen);
  ok("so it can be tried again", (await p.text()).includes("Use this hook"));
  execFileSync("powershell.exe", ["-NoProfile", "-Command", "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*fakeclaude.mjs*' -and $_.CommandLine -notlike '*-p*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"]);
  await waitFor(async () => (await state()) !== "external", 10000);

  // a double click sends one message
  await p.eval(`(() => { const b = [...document.querySelectorAll(".hook button")].find((x) => /Use this hook/.test(x.textContent)); b.click(); b.click(); })()`);
  ok("picking a hook is saved", await waitFor(() => json(dir, "brief/hooks.json").chosen === "b", 6000));
  ok("Claude is told to build the script on it", await waitFor(() => fakeMessages(dir).some((m) => /I picked this hook: "Every kilo/.test(m.text) && /Build the script on it/.test(m.text)), 15000));
  await sleep(1500);
  ok("a double click sends one message", fakeMessages(dir).filter((m) => /I picked this hook/.test(m.text)).length === 1, fakeMessages(dir).map((m) => m.text.slice(0, 40)).join(" | "));
  await sleep(2000);
  text = await p.text();
  ok("the board then shows the pick and a way to change it", /Change the hook/.test(text) && !/Nobody salted the sea/.test(text), text.slice(0, 300));

  write(dir, "brief/status.json", { stage: "building", note: "Building." });
  await sleep(2000);
  ok("once the build starts the hook can't be changed from the board", !/Change the hook/.test(await p.text()));

  await p.go(`/p/${encodeURIComponent(name)}/package`, 3000);
  text = await p.text();
  ok("the tabs are in order", /Brief.*Editor.*Review.*Final.*Package.*Publish/s.test(await p.text(".tabs")), await p.text(".tabs"));
  ok("the Package tab shows the titles", /35 grams per kilo of sea/.test(text) && /Score/.test(text), text.slice(0, 400));
  ok("it says what's missing", /Incomplete/.test(text));
  ok("it shows the phone feed", (await p.eval(`document.querySelectorAll(".phone .feed-tile").length`)) === 4);
  ok("the feed shows the title as a phone would", /On a phone/.test(text));
  ok("the thumbnails load", await waitFor(() => p.eval(`[...document.querySelectorAll(".package-thumbs img")].every((i) => i.complete && i.naturalWidth > 0)`), 6000));
  ok("a thumbnail's findings are shown", /isn't loaded/.test(text) && /won't read at phone size/.test(text));
  await p.shot(`${SHOTS}/package-tab.png`);

  await p.eval(`[...document.querySelectorAll(".package-title button")][0].click()`);
  ok("a picked title goes into the YouTube draft", await waitFor(() => json(dir, "publish/youtube.json").title === "35 grams per kilo of sea", 6000));
  ok("the pick is remembered", await waitFor(() => json(dir, "package/choice.json").title === "t1", 3000));
  await p.eval(`[...document.querySelectorAll(".package-caption button")][0].click()`);
  ok("a picked caption goes into both drafts", await waitFor(() => ["facebook", "instagram"].every((x) => json(dir, `publish/${x}.json`).caption?.startsWith("Rain did this.")), 6000));
  await p.eval(`[...document.querySelectorAll(".package-thumbs button")][0].click()`);
  ok("a picked thumbnail is remembered", await waitFor(() => json(dir, "package/choice.json").thumb === "a", 3000));
  await sleep(500);
  ok("the page says thumbnails aren't uploaded yet", /Uploading it comes later/.test(await p.text()));
  const dl = await fetch(`${B}${P}/file?path=${encodeURIComponent("package/thumbs/a.jpg")}&download=1`);
  ok("a thumbnail can be downloaded", dl.status === 200 && /attachment/.test(dl.headers.get("content-disposition") ?? ""));

  // new options under the same ids, and a draft edited by hand
  await sleep(3500);
  ok("the page says what's in the draft", /In the draft/.test(await p.text()) && /In the drafts/.test(await p.text()));
  const titlesNow = json(dir, "package/titles.json");
  titlesNow[0].title = "A new first title 7";
  write(dir, "package/titles.json", titlesNow);
  ce("package", dir);
  ok("a pick of a title that changed is dropped", json(dir, "package/choice.json").title === undefined, JSON.stringify(json(dir, "package/choice.json")));
  ok("a pick of a caption that didn't change stays", json(dir, "package/choice.json").caption === "c1", JSON.stringify(json(dir, "package/choice.json")));
  await sleep(3500);
  const row = (re) => p.eval(`(() => { const l = [...document.querySelectorAll(".package-title")].find((x) => ${re}.test(x.textContent)); return l ? { text: l.textContent, off: l.querySelector("button").disabled } : null; })()`);
  ok("a new title under an old id can be used", (await row("/A new first title/"))?.off === false, JSON.stringify(await row("/A new first title/")));
  await call("PUT", `${P}/publish/youtube`, { title: "Typed by hand" });
  ok("the tab reads the real draft", (await call("GET", `${P}/package`)).body.draft.title === "Typed by hand");

  // packaging after the final render isn't a change to the video
  fs.mkdirSync(path.join(dir, "out"), { recursive: true });
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=gray:s=270x480:d=2", "-f", "lavfi", "-i", "sine=frequency=500:sample_rate=48000:d=2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", path.join(dir, "out", "delivery.mp4")]);
  const later = new Date(Date.now() + 60000);
  fs.utimesSync(path.join(dir, "src/thumbnails/Thumbs.tsx"), later, later);
  ok("new thumbnails don't say the video changed", (await call("GET", `${P}/publish`)).body.video?.changedAfter === false, JSON.stringify((await call("GET", `${P}/publish`)).body.video).slice(0, 200));
  fs.utimesSync(path.join(dir, "src/scenes/S01Intro.tsx"), later, later);
  ok("a changed scene still does", (await call("GET", `${P}/publish`)).body.video?.changedAfter === true);

  // Claude may write ids as numbers, and stray entries
  write(dir, "brief/status.json", { stage: "talking" });
  write(dir, "brief/hooks.json", { options: [null, { id: 1, text: "Number one hook", formula: "The List", judged: 50 }, { id: 2, text: "Number two hook", formula: "The Question", judged: 60 }], chosen: null });
  ok("a stray entry is skipped", (await call("GET", `${P}/brief`)).body.hooks.options.length === 2);
  const picked = await call("POST", `${P}/hook`, { id: "2" });
  ok("a number id can be picked", picked.status === 200 && picked.body.sent === true, JSON.stringify(picked.body));
  ok("and shows as picked", (await call("GET", `${P}/brief`)).body.hooks.chosen === "2");
  ok("changing the hook tells Claude to rebuild", (await call("POST", `${P}/hook`, { id: "1" })).body.sent === true && (await waitFor(() => fakeMessages(dir).some((m) => /I changed the hook to: "Number one hook"/.test(m.text)), 8000)));
  ok("no page errors", p.errors().length === 0, p.errors().join(" | "));
} finally {
  browser.proc.kill();
}
ok("nothing asked Claude to post anything", !fakeMessages(dir).some((m) => /post this video/i.test(m.text)));

console.log(await stopEngine());
console.log(`\n${failures() ? `${failures()} FAILED` : "all passed"}`);
process.exitCode = failures() ? 1 : 0;
