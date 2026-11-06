// The quality gate end to end: a video with planted faults through `ce review` (each fault found, nothing false on the
// clean part), the critic's format (fake Claude), the final file's measurements, the Review tab, moving previews.
// Scratch engine only (4170, D:\tmp\ce-x, fake Claude). Run after `node build.mjs D:\tmp\ce-chat-dist` in app/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createProject } from "../../cli/projects.mjs";
import { finalChecks, parseNotes } from "../../cli/review.mjs";
import { B, WS, SHOTS, call, ok, failures, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const ENGINE = "D:/code_files/content-engine";
const FAKE = `${ENGINE}/tests/e2e/fakebin`.replace(/\//g, "\\");
const CRITIC_LOG = path.join(WS, "critic.jsonl");
const review = (dir, env = {}, ...flags) =>
  execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "review", dir, ...flags], { encoding: "utf8", env: { ...process.env, PATH: `${FAKE};${process.env.PATH}`, CE_FAKE_CRITIC_LOG: CRITIC_LOG, ...env } });
const report = (dir) => JSON.parse(fs.readFileSync(path.join(dir, "review", "report.json"), "utf8"));

console.log(await stopEngine());
fs.mkdirSync(WS, { recursive: true });
for (const d of fs.readdirSync(WS)) if (/-gate-faults$/.test(d)) fs.rmSync(path.join(WS, d), { recursive: true, force: true });
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

const out = review(dir, {}, "--no-critic");
ok("the review prints where the report is", /REPORT\.md/.test(out), out);
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
ok("exactly the planted failures", r.findings.filter((f) => f.level === "fail").length === 3, show());
ok("no false dead stretch in the moving scene", !r.findings.some((f) => /nothing changes/.test(f.problem) && f.t >= 9), show());
ok("every sweep frame was measured", r.unmeasured === 0, r.unmeasured);
ok("no critic asked for, none run", r.critic === null && !fs.existsSync(CRITIC_LOG));
ok("it doesn't pass without a critic", r.passed === false);
for (const f of [...r.pack.beats, ...r.pack.seams, ...r.pack.phone, r.pack.safe]) ok(`sheet ${f}`, fs.statSync(path.join(dir, "review", f)).size > 5000);
ok("no working files left behind", !fs.existsSync(path.join(dir, "review", "_frames")) && !fs.existsSync(path.join(dir, "review", "_tiles")));
ok("REPORT.md says what can't be heard", /For your ears/.test(fs.readFileSync(path.join(dir, "review", "REPORT.md"), "utf8")));

// ---- the critic
ok("notes parse, worst first", parseNotes(`[{"p":2,"t":1,"where":"a","problem":"b","change":"c"},{"p":0,"t":3,"where":"d","problem":"e","change":"f"}]`)?.[0].p === 0);
ok("notes parse with text around them", parseNotes(`Here you go:\n[{"p":1,"t":1,"where":"a","problem":"b","change":"c"}]\nDone.`)?.length === 1);
ok("an empty list is a real answer", parseNotes("[]")?.length === 0);
ok("a score isn't a note", parseNotes(`[{"score":8}]`) === null);
ok("a wrong rank isn't a note", parseNotes(`[{"p":5,"t":1,"where":"a","problem":"b","change":"c"}]`) === null);
ok("prose isn't notes", parseNotes("It looks great!") === null);

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
let f = finalChecks(dir);
ok("the final file's loudness is measured", typeof f.lufs === "number" && typeof f.truePeak === "number", JSON.stringify(f));
ok("a too-loud final file is flagged", f.findings.some((x) => /LUFS/.test(x.problem)), JSON.stringify(f.findings));
ok("an untagged file is noted", f.colour === "untagged" && f.findings.some((x) => /BT\.709/.test(x.problem)), JSON.stringify(f));
const stamp = f.stamp;
ok("measured once per file", finalChecks(dir).stamp === stamp);

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
