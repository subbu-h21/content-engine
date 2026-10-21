// Back/forward, old and unknown links, Delete (dialog, refusals), files missing/changed/broken on disk.
import fs from "node:fs";
import { WS, SHOTS, G, call, ok, failures, page, sleep } from "./lib.mjs";

const { leaves, bees } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const { browser, p } = await page(9351);

console.log("== back / forward");
await p.go("/", 2500);
await p.click("^Publish$");
await sleep(2500);
await p.eval(`[...document.querySelectorAll(".vcard")].find((c) => /bees/.test(c.innerText))?.querySelector(".vfile")?.click()`);
await sleep(3000);
await p.click("^Settings$");
await sleep(2500);
ok("on settings", (await p.path()) === "/settings");
await p.send("Runtime.evaluate", { expression: "history.back()" });
await sleep(3000);
ok("back → the picked video on Publish", (await p.path()) === `/publish/${bees}` && /How do bees make honey/.test(await p.text(".publish-panel, .video-list")), await p.path());
await p.send("Runtime.evaluate", { expression: "history.back()" });
await sleep(2500);
ok("back → Publish history", (await p.path()) === "/publish" && /History/.test(await p.text(".board")));
await p.send("Runtime.evaluate", { expression: "history.back()" });
await sleep(2500);
ok("back → Videos", (await p.path()) === "/" && /What do you want to create/.test(await p.text()));
await p.send("Runtime.evaluate", { expression: "history.forward()" });
await sleep(2500);
ok("forward → Publish", (await p.path()) === "/publish");
// project tabs
await p.go(`/p/${leaves}/brief`, 3000);
await p.click("^Final$");
await sleep(2000);
await p.send("Runtime.evaluate", { expression: "history.back()" });
await sleep(2500);
ok("back from Final tab → Brief tab", (await p.path()) === `/p/${leaves}/brief` && /Talking it through/.test(await p.text(".board")), await p.path());

console.log("== old and unknown links");
await p.go(`/p/${leaves}/publish`, 3000);
ok("old /p/<v>/publish → /publish/<v>", (await p.path()) === `/publish/${leaves}`);
await p.go("/published", 3000);
ok("old /published → /publish", (await p.path()) === "/publish");
await p.go("/publish/project-99-nope", 3500);
ok("unknown video on Publish → says so", /There's no video called project-99-nope/.test(await p.text()), (await p.text()).slice(0, 200));
await p.go("/p/project-99-nope", 4000);
const t404 = await p.text();
ok("unknown video in the editor → clear message", /no engine project/i.test(t404), t404.slice(0, 300));
await p.shot(`${SHOTS}/50_unknown_project.png`);
await p.go("/p/project-99-nope/final", 4000);
ok("unknown video Final tab → clear message", /no engine project/i.test(await p.text()), (await p.text()).slice(0, 300));
await p.go("/nonsense/page", 2500);
ok("unknown page → Videos", /What do you want to create/.test(await p.text()));

console.log("== Delete");
await p.go("/", 3000);
await call("POST", `/api/projects/${leaves}/render/start`, { rerender: [], autoFix: false });
await p.eval(`[...document.querySelectorAll(".projects li")].find((l) => /leaves/.test(l.innerText))?.querySelector("button.quiet")?.click()`);
await sleep(2000);
const dlg = await p.text(".modal");
ok("delete dialog: folder, size, finished-video warning", /Delete this video\?/.test(dlg) && /files,/.test(dlg) && /finished video/.test(dlg), dlg);
await p.shot(`${SHOTS}/51_delete_dialog.png`);
await p.eval(`window.__set(document.querySelector(".modal input"), "2")`);
await sleep(300);
ok("wrong number keeps Delete disabled", await p.eval(`document.querySelector(".modal button.danger").disabled`));
await p.eval(`window.__set(document.querySelector(".modal input"), "01")`);
await sleep(300);
await p.eval(`document.querySelector(".modal button.danger").click()`);
await sleep(2500);
ok("refused while rendering, with the reason", /running or queued: stop it on its Final tab/.test(await p.text(".modal")), await p.text(".modal .error"));
ok("folder still there", fs.existsSync(`${WS}/${leaves}`));
await call("POST", `/api/projects/${leaves}/render/stop`);
await p.key("Escape", "Escape", 27);
await sleep(500);
ok("Esc closes the dialog", !(await p.eval(`!!document.querySelector(".modal")`)));
// uploading
await fetch(`${G}/debug/faults`, { method: "POST", body: JSON.stringify({ delayMs: 4000 }) });
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/long draft.mp4" });
await call("POST", `/api/projects/${leaves}/publish/youtube/start`, { again: true });
const d2 = await call("DELETE", `/api/projects/${leaves}`, { confirm: "1" });
ok("refused while uploading", d2.status === 409 && /uploading to YouTube/.test(d2.body.error), d2.body.error);
await call("POST", `/api/projects/${leaves}/publish/youtube/stop`);
await fetch(`${G}/debug/faults`, { method: "POST", body: "{}" });

console.log("== files missing / changed / broken on disk");
const dirB = `${WS}/${bees}`;
// the finished video deleted outside the engine
fs.renameSync(`${dirB}/out/delivery.mp4`, `${dirB}/out/delivery.bak`);
await p.go(`/p/${bees}/final`, 4000);
const fin = await p.text(".render-panel");
ok("Final tab when the finished file is gone", !/Finished video/.test(fin) || /isn't there|missing|gone/i.test(fin), fin.slice(0, 400));
await p.shot(`${SHOTS}/52_final_file_gone.png`);
await p.go("/publish", 3500);
ok("Publish list: video without file moves to 'Not exported yet'", /Not exported yet[\s\S]*bees/.test(await p.text(".video-list")), await p.text(".video-list"));
fs.renameSync(`${dirB}/out/delivery.bak`, `${dirB}/out/delivery.mp4`);
// a source changed after the final → warning
await call("POST", `/api/projects/${bees}/publish/select`, { file: "out/delivery.mp4" });
const later = new Date(Date.now() + 60_000);
fs.utimesSync(`${dirB}/src/Root.tsx`, later, later);
await p.go(`/publish/${bees}`, 4000);
ok("'changed after this file was made' warning", /changed after this file was made/.test(await p.text(".publish-panel")));
fs.utimesSync(`${dirB}/src/Root.tsx`, new Date(), new Date());
// broken project.json / script.json
const pj = fs.readFileSync(`${dirB}/project.json`, "utf8");
fs.writeFileSync(`${dirB}/project.json`, "{ broken");
const lst = await call("GET", "/api/projects");
ok("list still loads with a broken project.json", lst.status === 200, lst.status);
const one = await call("GET", `/api/projects/${bees}`);
ok("project with broken project.json → readable JSON error", one.status >= 400 && typeof one.body === "object", `${one.status} ${String(typeof one.body === "string" ? one.body.slice(0, 80) : JSON.stringify(one.body))}`);
await p.go(`/p/${bees}/brief`, 4000);
const bt = await p.text();
ok("Brief page with broken project.json says what's wrong", /project\.json/i.test(bt), bt.slice(0, 300));
await p.shot(`${SHOTS}/53_broken_project_json.png`);
fs.writeFileSync(`${dirB}/project.json`, pj);
const sj = fs.readFileSync(`${dirB}/script.json`, "utf8");
fs.writeFileSync(`${dirB}/script.json`, "{ broken");
const br = await call("GET", `/api/projects/${bees}/brief`);
ok("brief with broken script.json still answers", br.status === 200, br.status);
fs.writeFileSync(`${dirB}/script.json`, sj);

console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
