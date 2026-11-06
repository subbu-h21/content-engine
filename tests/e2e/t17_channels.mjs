// Channels and a video's catalog style: Settings → Channels, a new video taking its channel's style (locked, last
// video's, the channel's own), changing it from the Brief, a locked look refusing changes, a new look from a file
// handed to (fake) Claude, and the project still type-checking with the style in it.
// Scratch engine only (4170, D:\tmp\ce-x, fake Claude). Run after `node build.mjs D:\tmp\ce-chat-dist` in app/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { B, WS, SHOTS, call, ok, failures, fakeMessages, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const ENGINE = "D:/code_files/content-engine";
const manifest = (dir) => JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
const putFile = async (u, name, bytes) => {
  const r = await fetch(`${B}${u}?name=${encodeURIComponent(name)}`, { method: "PUT", headers: { "content-type": "application/octet-stream", origin: B }, body: bytes });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

console.log(await stopEngine());
ok("engine started", await startEngine());
// channel names of their own each run: a channel's next video starts with its last video's style, and earlier runs
// leave videos in the scratch workspace
const RUN = Date.now().toString(36);
const DI = `Daily Insights ${RUN}`;
const KS = `Kids Science ${RUN}`;
const di = `daily-insights-${RUN}`;
const ks = `kids-science-${RUN}`;

// ---- Settings → Channels
ok("a channel needs a name", (await call("PUT", "/api/settings", { channels: [{ name: "", style: null }] })).status === 400);
ok("a channel's style must be in the catalog", (await call("PUT", "/api/settings", { channels: [{ name: "A", style: "no-such-style" }] })).status === 400);
ok("a look can't be locked without a style", (await call("PUT", "/api/settings", { channels: [{ name: "A", style: null, locked: true }] })).status === 400);
const saved = await call("PUT", "/api/settings", {
  channels: [
    { name: DI, style: "editorial-neuro", locked: false },
    { name: KS, style: "night-sky-classroom", locked: true },
    { name: DI, style: null, locked: false },
  ],
});
ok("channels are saved with ids", saved.status === 200 && saved.body.channels?.map((c) => c.id).join(",") === `${di},${ks},${di}-2`, JSON.stringify(saved.body.channels));
ok("the light channel list", (await call("GET", "/api/channels")).body.length === 3);
await call("PUT", "/api/settings", { channels: saved.body.channels.slice(0, 2) });

// ---- a new video takes its channel's style
const create = async (request, channel) => (await call("POST", "/api/projects", { request, channel })).body;
const p1 = await create("A test video about rainbows", di);
const d1 = p1.dir;
const m1 = manifest(d1);
ok("the video belongs to the channel", m1.channel === di);
ok("…and starts with the channel's style", m1.style?.id === "editorial-neuro" && m1.style.locked === false && m1.style.builtIn === true, JSON.stringify(m1.style));
ok("the style is copied into the video", ["src/style/STYLE.md", "src/style/style.json", "src/style/scenes/index.tsx", "src/kit/index.tsx", "src/sample.json", "brief/style-cover.jpg", ".claude/skills/style-editorial-neuro/SKILL.md"].every((f) => fs.existsSync(path.join(d1, f))));
ok("new videos get the catalog's skills", fs.existsSync(path.join(d1, ".claude/skills/visual-taste/SKILL.md")) && fs.existsSync(path.join(d1, ".claude/skills/make-style/SKILL.md")));
const brief = (await call("GET", `/api/projects/${p1.name}/brief`)).body;
ok("the Brief shows the style and channel", brief.look?.style?.name === "Editorial Neuro" && brief.look.channel?.name === DI && !!brief.look.style.cover, JSON.stringify(brief.look));
ok("…and its cover is served", (await fetch(B + brief.look.style.cover)).ok);
ok("engine skills aren't listed as the user's", !brief.skills.some((s) => /visual-taste|make-style|style-/.test(s)), JSON.stringify(brief.skills));

// ---- changing it from the Brief
const changed = await call("POST", `/api/projects/${p1.name}/style`, { id: "signal-slam" });
ok("Change applies another style", changed.status === 200 && manifest(d1).style.id === "signal-slam", JSON.stringify(changed.body));
ok("…replacing the old one", fs.existsSync(path.join(d1, ".claude/skills/style-signal-slam/SKILL.md")) && !fs.existsSync(path.join(d1, ".claude/skills/style-editorial-neuro")) && /Signal Slam/.test(fs.readFileSync(path.join(d1, "src/style/STYLE.md"), "utf8")));
const told = await waitFor(() => fakeMessages(d1).find((m) => /signal-slam/.test(m.text ?? "")), 20000);
ok("…and Claude is told to follow the Look step", !!told && /Look step/.test(told.text), told?.text?.slice(0, 200));
ok("an unknown style is refused", (await call("POST", `/api/projects/${p1.name}/style`, { id: "nope" })).status === 400);

// ---- the next video in the channel starts with the last video's style
const p2 = await create("Another test video about clouds", di);
ok("the next video starts with the channel's last style", manifest(p2.dir).style?.id === "signal-slam", JSON.stringify(manifest(p2.dir).style));

// ---- a locked look
const p3 = await create("A kids video about the moon", ks);
const m3 = manifest(p3.dir);
ok("a locked channel's video gets its style, locked", m3.style?.id === "night-sky-classroom" && m3.style.locked === true);
ok("Change is refused when the look is locked", (await call("POST", `/api/projects/${p3.name}/style`, { id: "signal-slam" })).status === 409);
let cliRefused = false;
try {
  execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "catalog", "use", "signal-slam"], { cwd: p3.dir, encoding: "utf8", stdio: "pipe", env: { ...process.env, CE_WORKSPACE: "D:\\tmp\\ce-x" } });
} catch (e) {
  cliRefused = /locked/.test(String(e.stderr));
}
ok("ce catalog use refuses a locked look too", cliRefused);
const used = execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "catalog", "use", "paper-form", "--project", p2.name], { encoding: "utf8", env: { ...process.env, CE_WORKSPACE: "D:\\tmp\\ce-x" } });
ok("ce catalog use --project works on an open look", /Paper Form/.test(used) && manifest(p2.dir).style.id === "paper-form", used);

// ---- no channel
const p4 = await create("A video without a channel", null);
ok("a video without a channel has no style yet", !manifest(p4.dir).channel && !manifest(p4.dir).style && !fs.existsSync(path.join(p4.dir, "src/style")));
ok("an unknown channel is refused", (await call("POST", "/api/projects", { request: "x", channel: "gone" })).status === 400);

// ---- a new look from a file (the Look card's button)
const draft = (await call("POST", "/api/catalog/drafts")).body.id;
await putFile(`/api/catalog/drafts/${draft}/upload`, "moodboard.jpg", fs.readFileSync(`${ENGINE}/library/catalog/visual/watercolor-wash/preview/title.jpg`));
const nl = await call("POST", `/api/projects/${p1.name}/style/from-draft`, { draft });
ok("New look from a file is handed to the video's Claude", nl.status === 200 && nl.body.told === true, JSON.stringify(nl.body));
const asked = await waitFor(() => fakeMessages(d1).find((m) => (m.text ?? "").includes(draft)), 20000);
ok("…with the file, make-style and ce catalog use", !!asked && /moodboard\.jpg/.test(asked.text) && /make-style/.test(asked.text) && /ce catalog use/.test(asked.text), asked?.text?.slice(0, 300));
ok("…but not for a locked look", (await call("POST", `/api/projects/${p3.name}/style/from-draft`, { draft })).status === 409);

// ---- the video still type-checks with the style inside it
let tsc = "";
try {
  tsc = execFileSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], { cwd: p2.dir, encoding: "utf8", stdio: "pipe" });
  ok("a video with a catalog style type-checks", true);
} catch (e) {
  ok("a video with a catalog style type-checks", false, String(e.stdout).slice(0, 600));
}

// ---- the pages
const { browser, p } = await page(9342, { width: 1500, height: 950 });
try {
  await p.go("/settings", 6000);
  ok("Settings shows the channels", /Daily Insights/.test(await p.eval("[...document.querySelectorAll('.channel-name')].map((i) => i.value).join(',')")) && /Look locked/.test(await p.text()));
  await p.eval("document.querySelector('ul.channels')?.scrollIntoView()");
  await sleep(500);
  await p.shot(`${SHOTS}/channels-settings.png`);
  await p.go("/", 3000);
  ok("the new-video form offers the channels", /Daily Insights/.test(await p.text(".create-row")) && /No channel/.test(await p.text(".create-row")));
  await p.shot(`${SHOTS}/home-channel.png`);
  await p.go(`/p/${p1.name}/brief`, 5000);
  ok("the Look card shows the style", /Signal Slam/.test(await p.text(".board")) && /Change/.test(await p.text(".board")));
  await p.shot(`${SHOTS}/brief-look.png`);
  await p.eval("window.__click('^Change$')");
  await sleep(1500);
  ok("Change opens the style picker", (await p.eval("document.querySelectorAll('.modal.picker .style-card').length")) > 30);
  await p.shot(`${SHOTS}/brief-picker.png`);
  await p.eval("[...document.querySelectorAll('.modal.picker .style-card')].find((b) => /Paper Form/.test(b.textContent))?.click()");
  await waitFor(async () => manifest(d1).style.id === "paper-form", 8000);
  ok("picking a style there applies it", manifest(d1).style.id === "paper-form");
  await p.go(`/p/${p3.name}/brief`, 5000);
  ok("a locked look shows as locked, without Change", /look locked/i.test(await p.text(".board")) && !(await p.eval("!!window.__btn('^Change$')")));
  ok("no page errors", p.errors().length === 0, p.errors().join(" | "));
} finally {
  browser.proc.kill();
}

console.log(await stopEngine());
console.log(`made ${[p1, p2, p3, p4].map((x) => x.name).join(", ")} in ${WS}`);
console.log(`\n${failures() ? `${failures()} FAILED` : "all passed"}`);
process.exitCode = failures() ? 1 : 0;
