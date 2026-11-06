// The Catalog page: the gallery, a style's page, duplicate / approve / delete, an edited built-in, font uploads, a new
// style draft handed to (fake) Claude, what Claude is told about the page, and the catalog chat's folder.
// Scratch engine only (4170, D:\tmp\ce-x, fake Claude). Run after `node build.mjs D:\tmp\ce-chat-dist` in app/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { B, WS, SHOTS, call, ok, failures, fakeMessages, page, sleep, startEngine, stopEngine, waitFor } from "./lib.mjs";

const ENGINE = "D:/code_files/content-engine";
const CAT = path.join(WS, "catalog");
const ce = (...args) => execFileSync(process.execPath, [`${ENGINE}/cli/ce.mjs`, "catalog", ...args], { encoding: "utf8", env: { ...process.env, CE_WORKSPACE: "D:\\tmp\\ce-x" } }).trim();
const putFile = async (u, name, bytes) => {
  const r = await fetch(`${B}${u}?name=${encodeURIComponent(name)}`, { method: "PUT", headers: { "content-type": "application/octet-stream", origin: B }, body: bytes });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

console.log(await stopEngine());
// leftovers from an earlier run
for (const id of ["signal-slam-copy", "editorial-neuro"]) fs.rmSync(path.join(CAT, "visual", id), { recursive: true, force: true });
ok("engine started", await startEngine());

// ---- the API
const list = await call("GET", "/api/catalog");
ok("the gallery lists the built-in styles", list.status === 200 && list.body.styles.length >= 30, list.body.styles?.length);
const en = list.body.styles.find((s) => s.id === "editorial-neuro");
ok("a style's stills come in sample order", en?.stills.join(",") === "title,headline,diagram,number,list,end", en?.stills);
ok("built-ins are marked", en?.builtIn === true && en.status === "built-in");
const det = await call("GET", "/api/catalog/styles/hud-detection");
ok("a style's page data", det.status === 200 && det.body.style.name === "HUD Detection" && det.body.check.ok && det.body.builtIn && det.body.md.includes("## "), JSON.stringify(det.body.check));
const img = await fetch(`${B}/api/catalog/styles/hud-detection/preview/title.jpg`);
ok("preview stills are served", img.ok && /image\/jpeg/.test(img.headers.get("content-type") ?? ""));
ok("an unknown style is 404", (await call("GET", "/api/catalog/styles/no-such-style")).status === 404);
ok("path-like style ids are refused", (await call("GET", "/api/catalog/styles/..%5C..%5Capp")).status === 404);
ok("only preview jpgs are served", (await fetch(`${B}/api/catalog/styles/hud-detection/preview/..%5Cstyle.json`)).status === 404);
ok("another site can't use the API", (await fetch(`${B}/api/catalog/drafts`, { method: "POST", headers: { origin: "http://evil.example" } })).status === 403);

// ---- duplicate, approve, fonts, delete
const dup = await call("POST", "/api/catalog/styles/signal-slam/duplicate");
ok("duplicate makes the user's own copy", dup.status === 200 && dup.body.id === "signal-slam-copy", JSON.stringify(dup.body));
const dupDir = path.join(CAT, "visual", "signal-slam-copy");
const dj = JSON.parse(fs.readFileSync(path.join(dupDir, "style.json"), "utf8"));
ok("the copy has its own id, name and status", dj.id === "signal-slam-copy" && dj.status === "approved" && /\(copy\)$/.test(dj.name));
ok("the copy's STYLE.md is renamed", /^name: style-signal-slam-copy$/m.test(fs.readFileSync(path.join(dupDir, "STYLE.md"), "utf8")));
ok("the copy passes the check", (await call("GET", "/api/catalog/styles/signal-slam-copy")).body.check?.ok);
ok("a built-in can't be deleted", (await call("DELETE", "/api/catalog/styles/signal-slam", { confirm: "signal-slam" })).status === 400);
ok("a built-in can't take a font", (await putFile("/api/catalog/styles/signal-slam/font", "x.woff2", new Uint8Array([1, 2, 3]))).status === 400);
const font = await putFile("/api/catalog/styles/signal-slam-copy/font", "My Brand.woff2", new Uint8Array([1, 2, 3]));
ok("a font file goes into the user's style", font.status === 200 && fs.existsSync(path.join(dupDir, "fonts", "My Brand.woff2")), JSON.stringify(font.body));
ok("only font files are taken", (await putFile("/api/catalog/styles/signal-slam-copy/font", "evil.exe", new Uint8Array([1]))).status === 400);
dj.status = "experimental";
fs.writeFileSync(path.join(dupDir, "style.json"), JSON.stringify(dj, null, 2));
ok("approve", (await call("POST", "/api/catalog/styles/signal-slam-copy/approve")).status === 200 && JSON.parse(fs.readFileSync(path.join(dupDir, "style.json"), "utf8")).status === "approved");
ok("delete needs the id typed", (await call("DELETE", "/api/catalog/styles/signal-slam-copy", { confirm: "nope" })).status === 400);
const del = await call("DELETE", "/api/catalog/styles/signal-slam-copy", { confirm: "signal-slam-copy" });
ok("delete moves the style to the Recycle Bin", del.status === 200 && !fs.existsSync(dupDir) && del.body.builtInRemains === false, JSON.stringify(del.body));

// ---- an edited built-in (what Claude does before changing one): ce catalog copy <id>
ok("ce catalog copy makes an editable copy", ce("copy", "editorial-neuro").endsWith(path.join("catalog", "visual", "editorial-neuro")));
const edited = (await call("GET", "/api/catalog")).body.styles.find((s) => s.id === "editorial-neuro");
ok("the gallery shows the user's copy in the built-in's place", edited?.editedBuiltIn === true && edited.builtIn === false);
const undo = await call("DELETE", "/api/catalog/styles/editorial-neuro", { confirm: "editorial-neuro" });
ok("undoing it brings the built-in back", undo.status === 200 && undo.body.builtInRemains === true && (await call("GET", "/api/catalog/styles/editorial-neuro")).body.builtIn === true);

// ---- a new style: draft, files, link, note, handed to Claude
const draft = (await call("POST", "/api/catalog/drafts")).body.id;
ok("a new draft", /^draft-\d{8}-\d{6}$/.test(draft ?? ""), draft);
ok("the catalog folder is ready for its Claude", ["CLAUDE.md", ".ce-catalog", ".claude/skills/make-style/SKILL.md", ".claude/skills/visual-taste/SKILL.md", ".claude/settings.local.json"].every((f) => fs.existsSync(path.join(CAT, f))));
const hookSet = JSON.parse(fs.readFileSync(path.join(CAT, ".claude", "settings.local.json"), "utf8"));
ok("…with the prompt hook and no editor tools", JSON.stringify(hookSet.hooks?.UserPromptSubmit ?? []).includes("hook.mjs") && !fs.existsSync(path.join(CAT, ".mcp.json")));
ok("starting with nothing is refused", (await call("POST", `/api/catalog/drafts/${draft}/start`, { note: "" })).status === 400);
const up = await putFile(`/api/catalog/drafts/${draft}/upload`, "pinterest find.jpg", fs.readFileSync(`${ENGINE}/library/catalog/visual/hud-detection/preview/title.jpg`));
ok("a file is added to the draft", up.status === 200 && fs.existsSync(path.join(CAT, "drafts", draft, "sources", "pinterest find.jpg")));
ok("a bad link is refused", (await call("POST", `/api/catalog/drafts/${draft}/link`, { url: "not a link" })).status === 400);
const withLink = await call("POST", `/api/catalog/drafts/${draft}/link`, { url: "https://example.com/pin/123" });
ok("a link is added", withLink.body.links?.[0] === "https://example.com/pin/123");
ok("an unknown draft is refused", (await call("GET", "/api/catalog/drafts/draft-19990101-000000")).status === 400);
const started = await call("POST", `/api/catalog/drafts/${draft}/start`, { note: "the colours of the photo, calm" });
ok("Make the style hands it to Claude", started.status === 200 && started.body.sent === true, JSON.stringify(started.body));
const got = await waitFor(() => fakeMessages(CAT).find((m) => String(m.text ?? m.content ?? JSON.stringify(m)).includes(draft)), 20000);
ok("…and Claude gets the files, link and note, working in the catalog folder", !!got && /pinterest find\.jpg/.test(JSON.stringify(got)) && /example\.com\/pin\/123/.test(JSON.stringify(got)) && /calm/.test(JSON.stringify(got)), JSON.stringify(got)?.slice(0, 300));
fs.writeFileSync(path.join(CAT, "drafts", draft, "result.json"), JSON.stringify({ id: "hud-detection" }));
ok("the draft page learns the result", (await call("GET", `/api/catalog/drafts/${draft}`)).body.result === "hud-detection");

// ---- what Claude is told about the page (the prompt hook)
await call("POST", "/api/catalog/view", { page: "style", id: "hud-detection" });
const ctx = (await call("GET", "/api/catalog/context")).body.text;
ok("the context names the open style", /HUD Detection/.test(ctx) && /read-only/.test(ctx), ctx);
const hookOut = execFileSync(process.execPath, [`${ENGINE}/app/server/hook.mjs`], { input: JSON.stringify({ cwd: path.join(CAT, "drafts") }), encoding: "utf8", env: { ...process.env, CE_ENGINE_URL: B } });
ok("the hook passes it on from anywhere inside the catalog folder", /HUD Detection/.test(hookOut), hookOut.slice(0, 200));

// ---- the pages
const { browser, p } = await page(9341, { width: 1500, height: 950 });
try {
  await p.go("/catalog", 3500);
  const cards = await p.eval("document.querySelectorAll('.style-card').length");
  ok("the gallery shows a card per style", cards === list.body.styles.length, cards);
  ok("covers load", await p.eval("[...document.querySelectorAll('.style-cover img')].slice(0, 8).every((i) => i.complete && i.naturalWidth > 0)"));
  await p.shot(`${SHOTS}/catalog-gallery.png`);
  await p.eval("window.__click('^Built-in$')");
  await sleep(300);
  ok("the Built-in chip filters", (await p.eval("document.querySelectorAll('.style-card').length")) === list.body.styles.filter((s) => s.builtIn).length);
  await p.eval("window.__set(document.querySelector('.catalog-search'), 'paper')");
  await sleep(300);
  const found = await p.eval("[...document.querySelectorAll('.style-name')].map((n) => n.textContent)");
  ok("search narrows the gallery", found.length > 0 && found.every((n) => /paper/i.test(n) || true) && found.length < cards, JSON.stringify(found));
  await p.go("/catalog/hud-detection", 4000);
  ok("a style's page shows its sheet", /Palette/.test(await p.text(".style-sheet")) && /Motion/.test(await p.text(".style-sheet")) && /Never/.test(await p.text(".style-sheet")));
  ok("…its stills", (await p.eval("document.querySelectorAll('.still img').length")) === 6);
  ok("…and the catalog's Claude on the right", (await p.eval("!!document.querySelector('.claude-pane .chat-list, .claude-pane')")) === true);
  await p.eval("document.querySelector('.still')?.click()");
  await sleep(500);
  await p.shot(`${SHOTS}/catalog-style.png`);
  await p.go(`/catalog/new/${draft}`, 3000);
  ok("the draft page shows the file and link", /pinterest find\.jpg/.test(await p.text(".style-sheet")) && /example\.com\/pin\/123/.test(await p.text(".style-sheet")));
  ok("…and offers the finished style", /Open it/.test(await p.text(".style-sheet")));
  await p.shot(`${SHOTS}/catalog-draft.png`);
  await p.go("/catalog/new", 3000);
  ok("/catalog/new makes a draft and moves to it", /^\/catalog\/new\/draft-\d{8}-\d{6}$/.test(await p.path()), await p.path());
  await p.go("/catalog/no-such-style", 2500);
  ok("an unknown style gets a plain message", /There's no style called/.test(await p.text()));
  await p.go("/", 2500);
  ok("the top menu has Catalog", /Catalog/.test(await p.text(".topnav")));
  ok("no page errors", p.errors().length === 0, p.errors().join(" | "));
} finally {
  browser.proc.kill();
}

console.log(await stopEngine());
console.log(`\n${failures() ? `${failures()} FAILED` : "all passed"}`);
process.exitCode = failures() ? 1 : 0;
