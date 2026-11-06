// The quality gate end to end: a video with planted faults through `ce review` (each fault found, nothing false on the
// clean part), the critic's format (fake Claude), the final file's measurements, the Review tab, moving previews.
// Scratch engine only (4170, D:\tmp\ce-x, fake Claude). Run after `node build.mjs D:\tmp\ce-chat-dist` in app/.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createProject } from "../../cli/projects.mjs";
import { deadStretches, finalChecks, mixWindows, parseNotes, safeBands } from "../../cli/review.mjs";
import { removeOldBundles } from "../../cli/temp.mjs";
import { B, WS, SHOTS, call, ok, failures, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const ENGINE = "D:/code_files/content-engine";
const FAKE = `${ENGINE}/tests/e2e/fakebin`.replace(/\//g, "\\");
const CRITIC_LOG = path.join(WS, "critic.jsonl");
const review = (dir, env = {}, ...flags) =>
  execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "review", dir, ...flags], { encoding: "utf8", env: { ...process.env, PATH: `${FAKE};${process.env.PATH}`, CE_FAKE_CRITIC_LOG: CRITIC_LOG, ...env } });
const report = (dir) => JSON.parse(fs.readFileSync(path.join(dir, "review", "report.json"), "utf8"));
const tempBundles = () => fs.readdirSync(os.tmpdir()).filter((f) => f.startsWith("remotion-webpack-bundle")).length;
const pixel = (file, x, y) => [...execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", file, "-vf", `crop=2:2:${x}:${y},format=rgb24`, "-frames:v", "1", "-f", "rawvideo", "-"], { maxBuffer: 1 << 20 }).subarray(0, 3)];

const write = (d, rel, text) => {
  fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
  fs.writeFileSync(path.join(d, rel), text);
};

console.log(await stopEngine());
fs.mkdirSync(WS, { recursive: true });
for (const d of fs.readdirSync(WS)) if (/-gate-(faults|wide)$/.test(d)) fs.rmSync(path.join(WS, d), { recursive: true, force: true });
fs.rmSync(CRITIC_LOG, { force: true });

// ---- a video with one of everything wrong
const dir = createProject({ workspace: WS, slug: "gate-faults", title: "Gate faults" });
const name = path.basename(dir);
fs.writeFileSync(path.join(dir, "src", "data", "timing.json"), JSON.stringify({ total: 12, fps: 24, estimated: true, scenes: { s01_intro: { start: 0, duration: 9, cues: { line: { start: 0.5, end: 2.5 } } }, s02_end: { start: 9, duration: 3, cues: { end: { start: 0.2, end: 2 } } } } }));
fs.writeFileSync(
  path.join(dir, "src", "scenes", "S01Intro.tsx"),
  `import React from "react";
const At: React.FC<{ show: boolean; style: React.CSSProperties; children: React.ReactNode }> = ({ show, style, children }) => (show ? <div style={{ position: "absolute", color: "#fff", fontSize: 60, fontFamily: "sans-serif", ...style }}>{children}</div> : null);
export const S01Intro: React.FC<{ tl: number; t: number }> = ({ tl }) => {
  const on = tl >= 1 && tl < 3;
  return (
    <>
      <At show={on} style={{ left: 200, top: 400, fontSize: 18 }}>TINY LABEL</At>
      <At show={on} style={{ left: -300, top: 500 }}>OFF THE EDGE HEADLINE</At>
      <At show={on} style={{ left: 200, top: 1750 }}>UNDER THE BUTTONS</At>
      <At show={on} style={{ left: 200, top: 700, fontFamily: "No Such Font" }}>WRONG FONT TEXT</At>
      <At show={on} style={{ left: 200, top: 900 }}>FIRST OVERLAP</At>
      <At show={on} style={{ left: 220, top: 910 }}>SECOND OVERLAP</At>
      <At show={on} style={{ left: 200, top: 1250, fontFamily: "Arial" }}>INSTALLED FONT</At>
      <At show={on} style={{ left: 200, top: 1350, fontFamily: '"No Such Font", Arial' }}>SECOND FONT WORKS</At>
      <At show={tl >= 3 && tl < 3.25} style={{ left: 200, top: 1100, width: 700 }}>this line has far too many words to be read in time</At>
      {tl >= 3.3 ? <div style={{ position: "absolute", left: 300, top: 800, width: 400, height: 400, background: "#c84" }} /> : null}
    </>
  );
};
export const S02End: React.FC<{ tl: number; t: number }> = ({ tl }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "#eee" }} />
    <div style={{ position: "absolute", left: 200 + tl * 200, top: 800, width: 200, height: 200, background: "#357" }} />
    {tl >= 1 && tl < 1.125 ? <div style={{ position: "absolute", inset: 0, background: "#000" }} /> : null}
  </>
);
`,
);
const reg = path.join(dir, "src", "scenes", "index.ts");
fs.writeFileSync(reg, fs.readFileSync(reg, "utf8").replace(`import { S01Intro } from "./S01Intro";`, `import { S01Intro, S02End } from "./S01Intro";`).replace("s01_intro: S01Intro,", "s01_intro: S01Intro,\n  s02_end: S02End,"));

const bundlesBefore = tempBundles();
const out = review(dir, {}, "--no-critic");
ok("the review prints where the report is", /REPORT\.md/.test(out), out);
ok("it leaves no copy of the video's files in the system's temp folder", tempBundles() <= bundlesBefore, `${bundlesBefore} -> ${tempBundles()}`);
let r = report(dir);
const has = (level, re) => r.findings.some((f) => f.level === level && re.test(`${f.where} ${f.problem}`));
const show = () => r.findings.map((f) => `${f.level} ${f.t} ${f.where} ${f.problem}`).join(" | ");
ok("text cut off by the frame fails", has("fail", /OFF THE EDGE.*cut off/), show());
ok("an unloaded font fails", has("fail", /WRONG FONT.*No Such Font/), show());
ok("a black frame fails", has("fail", /black frame/), show());
ok("small text is flagged", has("warn", /TINY LABEL/), show());
ok("text under the platforms' buttons is flagged, by platform", has("warn", /UNDER THE BUTTONS.*TikTok.*Shorts.*Reels/), show());
ok("a line too short to read is flagged", has("warn", /too many words.*need/), show());
ok("overlapping lines are flagged", has("warn", /FIRST OVERLAP.*SECOND OVERLAP.*overlap|SECOND OVERLAP.*FIRST OVERLAP.*overlap/), show());
ok("a dead stretch is flagged", has("warn", /nothing changes/), show());
ok("an empty first frame is flagged", has("warn", /first frame.*empty/), show());
ok("an installed font isn't called missing", !r.findings.some((f) => /INSTALLED FONT|SECOND FONT WORKS/.test(f.where) && f.area === "fonts"), show());
ok("exactly the planted failures", r.findings.filter((f) => f.level === "fail").length === 3, show());
ok("no false dead stretch in the moving scene", !r.findings.some((f) => /nothing changes/.test(f.problem) && f.t >= 9), show());
const everySecond = (dif, n = 20) => Array.from({ length: n }, (_, i) => ({ f: i * 24, dif }));
ok("a slow 3D turn isn't a dead stretch (measured on project 7)", deadStretches(everySecond(0.105), 24, 480).length === 0);
ok("drifting particles aren't either (measured on project 5)", deadStretches(everySecond(0.34), 24, 480).length === 0);
ok("a real hold is (measured on project 7)", deadStretches(everySecond(0.03), 24, 480).length === 1);
ok("a hold under three seconds isn't", deadStretches(everySecond(0.03, 3).concat(everySecond(0.5, 10).map((s) => ({ ...s, f: s.f + 72 }))), 24, 480).length === 0);
ok("the last three seconds can hold", deadStretches(everySecond(0.5, 17).concat(everySecond(0.03, 3).map((s) => ({ ...s, f: s.f + 408 }))), 24, 480).length === 0);
ok("every sweep frame was measured", r.unmeasured === 0, r.unmeasured);
ok("no critic asked for, none run", r.critic === null && !fs.existsSync(CRITIC_LOG));
ok("it doesn't pass without a critic", r.passed === false);
for (const f of [...r.pack.beats, ...r.pack.seams, ...r.pack.phone, ...r.pack.safe]) ok(`sheet ${f}`, fs.statSync(path.join(dir, "review", f)).size > 5000);
const bands = safeBands(1080, 1920);
ok("the bands are the platforms' deepest", bands.top === 210 && bands.bottom === 350 && bands.left === 60 && bands.right === 150 && bands.railFrom === 768, JSON.stringify(bands));
const safeSheet = path.join(dir, "review", r.pack.safe[0]);
const [railR, railG] = pixel(safeSheet, 6 + 270 - 12, 6 + 270);
const [clearR, clearG] = pixel(safeSheet, 6 + 135, 6 + 90);
ok("the safe sheet shades the button rail from 40% down", railR > railG + 25, `rail ${railR},${railG}`);
ok("and leaves the clear middle unshaded", Math.abs(clearR - clearG) < 25, `clear ${clearR},${clearG}`);
ok("no working files left behind", !fs.existsSync(path.join(dir, "review", "_frames")) && !fs.existsSync(path.join(dir, "review", "_tiles")));
ok("REPORT.md says what can't be heard", /For your ears/.test(fs.readFileSync(path.join(dir, "review", "REPORT.md"), "utf8")));

// ---- the critic
ok("notes parse, worst first", parseNotes(`[{"p":2,"t":1,"where":"a","problem":"b","change":"c"},{"p":0,"t":3,"where":"d","problem":"e","change":"f"}]`)?.[0].p === 0);
ok("notes parse with text around them", parseNotes(`Here you go:\n[{"p":1,"t":1,"where":"a","problem":"b","change":"c"}]\nDone.`)?.length === 1);
ok("an empty list is a real answer", parseNotes("[]")?.length === 0);
ok("a score isn't a note", parseNotes(`[{"score":8}]`) === null);
ok("a wrong rank isn't a note", parseNotes(`[{"p":5,"t":1,"where":"a","problem":"b","change":"c"}]`) === null);
ok("prose isn't notes", parseNotes("It looks great!") === null);

write(dir, "style.md", "# The look\n\n## This video\n\nAn approved exception.\n");
write(dir, "src/style/STYLE.md", "# A catalog style\n");
review(dir);
r = report(dir);
ok("the critic's notes are in the report, worst first", r.critic?.notes?.length === 2 && r.critic.notes[0].p === 1, JSON.stringify(r.critic));
ok("a P1 note keeps the video from passing", r.passed === false && r.counts.p1 === 1);
const asked = JSON.parse(fs.readFileSync(CRITIC_LOG, "utf8").trim().split("\n").pop());
ok("the critic starts outside the video's folder", !path.resolve(asked.cwd).startsWith(path.resolve(dir)), asked.cwd);
ok("the critic can only read", asked.args.join(" ").includes("--tools Read") && !/--tools .*(Bash|Edit|Write)/.test(asked.args.join(" ")), asked.args.join(" "));
ok("the critic gets the sheets, the brief files and the measurements", asked.prompt.includes("beats-01.jpg") && asked.prompt.includes("seams-01.jpg") && asked.prompt.includes("safe-01.jpg") && asked.prompt.includes("OFF THE EDGE"), asked.prompt.slice(0, 200));
ok("no placeholder left in the prompt", !/\{\{/.test(asked.prompt));
ok("the first critic is told it's the first review", asked.prompt.includes("(this is the first review)"));
ok("the critic gets the video's own decisions as well as the style", /[\\/]style\.md/.test(asked.prompt) && /STYLE\.md/.test(asked.prompt), asked.prompt.slice(0, 400));

// Measure only keeps what the critic said
review(dir, {}, "--no-critic");
r = report(dir);
ok("a measure-only run keeps the last critic's notes", r.critic?.notes?.length === 2 && !!r.critic.earlier, JSON.stringify(r.critic).slice(0, 200));
ok("and can't pass on them", r.passed === false);
ok("the report says they're older", /last full review/.test(fs.readFileSync(path.join(dir, "review", "REPORT.md"), "utf8")));
review(dir, {}, "--no-critic");
ok("twice in a row they stay", report(dir).critic?.notes?.length === 2);

// one review at a time, across processes
const lock = path.join(dir, "review", ".lock");
fs.writeFileSync(lock, String(process.pid));
const busy = spawnSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "review", dir, "--no-critic"], { encoding: "utf8" });
ok("a second review is refused in plain words", busy.status !== 0 && /already running/.test(busy.stderr + busy.stdout), (busy.stderr + busy.stdout).slice(-200));
fs.writeFileSync(lock, "999999");
review(dir, {}, "--no-critic");
ok("a lock left by a crash doesn't block anything", !fs.existsSync(lock));

review(dir, { CE_FAKE_CRITIC: "Lovely video, 9 out of 10!" });
r = report(dir);
ok("a critic that won't use the format is an error, not a pass", /format/.test(r.critic?.error ?? "") && r.passed === false, JSON.stringify(r.critic));
const second = JSON.parse(fs.readFileSync(CRITIC_LOG, "utf8").trim().split("\n").pop());
ok("the next critic is told what earlier reviews asked for", second.prompt.includes("move it up 40 px") && !second.prompt.includes("(this is the first review)"), second.prompt.slice(0, 200));
ok("polish notes aren't held against it", !second.prompt.includes("sharpen it"));
const history = () => JSON.parse(fs.readFileSync(path.join(dir, "review", "history.json"), "utf8"));
ok("a review is remembered once", history().length === 1, JSON.stringify(history()).slice(0, 200));
review(dir, { CE_FAKE_CRITIC: "[]" });
r = report(dir);
ok("no notes and failed checks still doesn't pass", r.passed === false && r.counts.fails === 3);
ok("a run with no notes adds nothing to remember", history().length === 1);

// ---- the final file
fs.mkdirSync(path.join(dir, "out"), { recursive: true });
const delivery = path.join(dir, "out", "delivery.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=gray:s=270x480:d=3", "-f", "lavfi", "-i", "sine=frequency=500:sample_rate=48000:d=3", "-af", "volume=16dB", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", delivery]);
let f = await finalChecks(dir);
ok("the final file's loudness is measured", typeof f.lufs === "number" && typeof f.truePeak === "number", JSON.stringify(f));
ok("a too-loud final file is flagged", f.findings.some((x) => /LUFS/.test(x.problem)), JSON.stringify(f.findings));
ok("an untagged file is noted", f.colour === "untagged" && f.findings.some((x) => /BT\.709/.test(x.problem)), JSON.stringify(f));
const stamp = f.stamp;
ok("measured once per file", (await finalChecks(dir)).stamp === stamp);

// ---- the voice against the rest follows AudioMix.tsx
const wav = (rel, volume, seconds) => {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", `sine=frequency=300:sample_rate=48000:d=${seconds}`, "-af", `volume=${volume}`, path.join(dir, rel)]);
};
wav("public/audio/voice.wav", 2, 12);
wav("public/audio/music.wav", 2, 12);
wav("public/audio/sfx/thud.wav", 2, 0.5);
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
const setStems = (stems) => fs.writeFileSync(path.join(dir, "project.json"), JSON.stringify({ ...manifest, stems }));
write(dir, "src/data/duck.json", JSON.stringify({ fps: 24, duckDb: -7, gain: Array(288).fill(1) }));
write(dir, "src/data/sfx_events.json", JSON.stringify([{ t: 6, kind: "thud", gain: 1, lead: 0 }]));
const mixAudio = { voice: true, music: true, sfx: true, voiceDb: 0, musicDb: -14, duckDb: -7, sfxDb: -9 };
setStems({ voice: "audio/voice.wav", music: "audio/music.wav" });
let m = mixWindows(dir, mixAudio, 288, 24);
const at = (w, s) => w[Math.floor(s / m.seconds)];
ok("music fades in as in the video", at(m.others, 0.1) < at(m.others, 3) / 10, `${at(m.others, 0.1)} vs ${at(m.others, 3)}`);
ok("music fades out as in the video", at(m.others, 11.5) < at(m.others, 3) / 10, `${at(m.others, 11.5)} vs ${at(m.others, 3)}`);
ok("an effect lands at its time", at(m.others, 6.1) > at(m.others, 5) * 2, `${at(m.others, 6.1)} vs ${at(m.others, 5)}`);
m = mixWindows(dir, { ...mixAudio, sfx: false }, 288, 24);
ok("effects switched off aren't counted", at(m.others, 6.1) < at(m.others, 5) * 1.2);
m = mixWindows(dir, { ...mixAudio, music: false, sfx: false }, 288, 24);
ok("music switched off isn't counted", at(m.others, 5) === 0);
setStems({ voice: "audio/voice.wav", music: null });
m = mixWindows(dir, { ...mixAudio, sfx: false }, 288, 24);
ok("a leftover music file the video doesn't use isn't counted", at(m.others, 5) === 0);
ok("no voice stem means nothing to compare", (setStems({ voice: null, music: null }), mixWindows(dir, mixAudio, 288, 24)) === null);
setStems(manifest.stems);

// ---- a wide video with one scene and no voice
const wide = createProject({ workspace: WS, slug: "gate-wide", title: "Gate wide" });
const wideManifest = JSON.parse(fs.readFileSync(path.join(wide, "project.json"), "utf8"));
fs.writeFileSync(path.join(wide, "project.json"), JSON.stringify({ ...wideManifest, format: { ...wideManifest.format, width: 1280, height: 720 } }, null, 2));
review(wide, {}, "--no-critic");
const w = report(wide);
ok("a wide video with one scene is reviewed", w.scenes === 1 && w.cuts === 0 && w.pack.beats.length === 1 && w.unmeasured === 0, JSON.stringify({ scenes: w.scenes, cuts: w.cuts, pack: w.pack }));
ok("it has no safe sheet: platform bands are for vertical video", w.pack.safe.length === 0);
ok("and no complaints about platform buttons", !w.findings.some((x) => /interface of/.test(x.problem)), w.findings.map((x) => x.problem).join(" | "));
ok("the default look's fonts aren't called missing", !w.findings.some((x) => x.area === "fonts"), w.findings.filter((x) => x.area === "fonts").map((x) => x.problem).join(" | "));
ok("a video without a voice says so honestly", w.listen.length === 0 && /no sound to compare/.test(fs.readFileSync(path.join(wide, "review", "REPORT.md"), "utf8")));

// ---- the engine sweeps up the copies a stopped render leaves behind
const sweepDir = path.join(WS, "sweep-test");
fs.rmSync(sweepDir, { recursive: true, force: true });
const made = (name, days) => {
  const d = path.join(sweepDir, name);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "bundle.js"), "x");
  const when = new Date(Date.now() - days * 864e5);
  fs.utimesSync(d, when, when);
  return d;
};
const oldCopy = made("remotion-webpack-bundle-old", 8);
const justUnder = made("remotion-webpack-bundle-recent", 6.9);
const otherOld = made("some-other-app-cache", 30);
const likeName = made("remotion-webpack-bundle", 30);
fs.writeFileSync(path.join(sweepDir, "remotion-webpack-bundle-file"), "a file, not a folder");
const swept = await removeOldBundles({ dir: sweepDir });
ok("a copy over a week old is removed", swept === 1 && !fs.existsSync(oldCopy), swept);
ok("one under a week stays", fs.existsSync(justUnder));
ok("nothing else in the temp folder is touched", fs.existsSync(otherOld) && fs.existsSync(likeName) && fs.existsSync(path.join(sweepDir, "remotion-webpack-bundle-file")));
ok("a missing folder is no problem", await removeOldBundles({ dir: path.join(sweepDir, "nope") }).then(() => false, () => true));
fs.rmSync(sweepDir, { recursive: true, force: true });

// ---- the website
ok("engine started", await startEngine());
const P = `/api/projects/${encodeURIComponent(name)}`;
let v = await call("GET", `${P}/review`);
ok("the report comes through the API", v.status === 200 && v.body.report?.counts?.fails === 3 && v.body.running === false && v.body.final?.lufs != null, JSON.stringify(v.body).slice(0, 200));
const sheet = await fetch(`${B}${P}/file?path=${encodeURIComponent("review/beats-01.jpg")}`);
ok("a sheet is served", sheet.status === 200 && /jpeg/.test(sheet.headers.get("content-type")));
ok("nothing else near it is", (await fetch(`${B}${P}/file?path=${encodeURIComponent("review/../project.json")}`)).status === 404);
const foreign = await fetch(`${B}${P}/review/run`, { method: "POST", headers: { "content-type": "application/json", origin: "https://example.com" }, body: "{}" });
ok("a foreign page can't start a review", foreign.status === 403 || foreign.status === 400, foreign.status);
const started = await call("POST", `${P}/review/run`, { critic: false });
ok("a review starts", started.status === 200 && started.body.started, JSON.stringify(started.body));
ok("a second one has to wait", (await call("POST", `${P}/review/run`, { critic: false })).status === 409);
v = await call("GET", `${P}/review`);
ok("the page can see it running", v.body.running === true);
ok("it finishes", await waitFor(async () => (await call("GET", `${P}/review`)).body.running === false, 180000, 1000));
v = await call("GET", `${P}/review`);
ok("no error from a good run", v.body.error === null, v.body.error);

// Claude's own `ce review .` is another process: the page has to see it too
const liveLock = path.join(dir, "review", ".lock");
fs.writeFileSync(liveLock, String(process.pid));
ok("the page sees a review started elsewhere", (await call("GET", `${P}/review`)).body.running === true);
ok("and won't start another", (await call("POST", `${P}/review/run`, { critic: false })).status === 409);
fs.rmSync(liveLock);
const goodDelivery = fs.readFileSync(path.join(dir, "out", "delivery.mp4"));
fs.writeFileSync(path.join(dir, "out", "delivery.mp4"), "this is not a video");
const broken = await call("GET", `${P}/review`);
ok("a broken final file doesn't take the tab down", broken.status === 200 && broken.body.report?.counts?.fails >= 0 && broken.body.final === null, JSON.stringify(broken.body).slice(0, 200));
fs.writeFileSync(path.join(dir, "out", "delivery.mp4"), goodDelivery);

// moving previews
const list = await call("GET", "/api/catalog");
const hud = list.body.styles.find((s) => s.id === "hud-detection");
ok("the gallery knows which styles have a reel", hud?.reel === true);
const reel = await fetch(`${B}/api/catalog/styles/hud-detection/preview/reel.mp4`, { headers: { range: "bytes=0-1023" } });
ok("the reel is served in pieces, as video players ask", reel.status === 206 && /mp4/.test(reel.headers.get("content-type")), `${reel.status} ${reel.headers.get("content-type")}`);
ok("no other video file is served", (await fetch(`${B}/api/catalog/styles/hud-detection/preview/other.mp4`)).status === 404);

const { browser, p } = await page(9346);
try {
  await p.go(`/p/${encodeURIComponent(name)}/review`, 3000);
  const text = await p.text();
  ok("the Review tab shows the findings", /What was measured/.test(text) && /OFF THE EDGE/.test(text), text.slice(0, 300));
  ok("it shows the final file", /The final file/.test(text) && /LUFS/.test(text));
  ok("it marks what wasn't reviewed by the critic", /Review again/.test(text));
  ok("it loads the sheets", (await p.eval(`[...document.querySelectorAll(".review-sheets img")].filter((i) => i.complete && i.naturalWidth > 0).length`)) >= 1 || (await sleep(1500), (await p.eval(`document.querySelectorAll(".review-sheets img").length`)) >= 4));
  await p.shot(`${SHOTS}/review-tab.png`);
  await p.go("/catalog", 3000);
  const played = await p.eval(`(async () => {
    const card = [...document.querySelectorAll(".style-card")].find((c) => /HUD Detection/.test(c.textContent));
    card.scrollIntoView();
    card.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 2500));
    const v = card.querySelector("video");
    return v ? { time: v.currentTime, ready: v.readyState, w: v.videoWidth } : null;
  })()`);
  ok("hovering a style plays its reel", played && played.w > 0 && played.time > 0.3, JSON.stringify(played));
  await p.shot(`${SHOTS}/catalog-hover.png`);
  await p.go("/catalog/hud-detection", 3000);
  const onPage = await p.eval(`(() => { const v = document.querySelector("video.style-reel"); return v ? { w: v.videoWidth, paused: v.paused } : null; })()`);
  ok("a style's page plays its reel", onPage && onPage.w > 0 && !onPage.paused, JSON.stringify(onPage));
  ok("no page errors", p.errors().length === 0, p.errors().join(" | "));
} finally {
  browser.proc.kill();
}

console.log(await stopEngine());
console.log(`\n${failures() ? `${failures()} FAILED` : "all passed"}`);
process.exitCode = failures() ? 1 : 0;
