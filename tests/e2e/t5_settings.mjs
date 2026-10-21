// Settings page: bad paths, YouTube setup → connect → test → disconnect → connect, FB/IG defaults, Check Chrome.
import fs from "node:fs";
import { createRequire } from "node:module";
import { WS, SHOTS, B, G, call, ok, failures, fakeMessages, page, sleep } from "./lib.mjs";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const REAL = "D:/code_files/content-engine/settings.json";
const realBefore = fs.readFileSync(REAL, "utf8");
fs.rmSync(`${WS}/secrets`, { recursive: true, force: true });

const { browser, p } = await page(9345);
await p.go("/settings", 3500);
await p.shot(`${SHOTS}/30_settings_start.png`);

// a Field saves on blur: type, then blur
const field = async (labelRe, value) => {
  const r = await p.eval(`(() => {
    const l = [...document.querySelectorAll("label.field")].find((x) => new RegExp(${JSON.stringify(labelRe)}).test(x.querySelector("span")?.textContent ?? ""));
    if (!l) return "no field";
    const el = l.querySelector("input, textarea");
    el.focus(); window.__set(el, ${JSON.stringify(value)}); el.blur();
    return "ok";
  })()`);
  for (let i = 0; i < 40 && (await p.eval(`[...document.querySelectorAll("label.field")].some((x) => /saving/.test(x.innerText))`)); i++) await sleep(250);
  await sleep(300);
  return r;
};
const fieldText = (labelRe) => p.eval(`[...document.querySelectorAll("label.field")].find((x) => new RegExp(${JSON.stringify(labelRe)}).test(x.querySelector("span")?.textContent ?? ""))?.innerText ?? ""`);

console.log("== general paths");
await field("^Workspace", "D:\\tmp\\does-not-exist");
ok("bad workspace refused with reason", /doesn't exist/.test(await fieldText("^Workspace")), await fieldText("^Workspace"));
await field("^Blender", "C:\\nope\\blender.exe");
ok("bad Blender refused", /wasn't found/.test(await fieldText("^Blender")), await fieldText("^Blender"));
await field("^Python", "   ");
ok("empty Python refused", /can't be empty/.test(await fieldText("^Python")), await fieldText("^Python"));
await field("^Python", "pythonnope");
ok("unknown python saved but flagged ✕ didn't run", /didn't run/.test(await fieldText("^Python")), await fieldText("^Python"));
await field("^Python", "python");
ok("python back to ✓", /✓ Python 3/.test(await fieldText("^Python")), await fieldText("^Python"));
const saved = JSON.parse(fs.readFileSync(`${WS}/settings.json`, "utf8"));
ok("scratch settings unchanged by refusals", saved.workspace === "D:\\tmp\\ce-x" && /Blender 5\.1/.test(saved.blender));
await p.shot(`${SHOTS}/31_settings_bad_paths.png`);

console.log("== YouTube setup");
await p.eval(`window.__set(document.querySelector(".form2 input"), "bad-id")`);
await p.eval(`window.__set(document.querySelectorAll(".form2 input")[1], "GOCSPX-abc")`);
await sleep(200);
await p.click("^Save$", ".form2");
await sleep(1200);
ok("bad Client ID refused", /should end in \.apps\.googleusercontent\.com/.test(await p.text("p.error")), await p.text("p.error"));
await p.eval(`window.__set(document.querySelector(".form2 input"), "1234-abc.apps.googleusercontent.com")`);
await sleep(200);
await p.click("^Save$", ".form2");
await sleep(1500);
ok("saved; Connect YouTube offered", /Connect YouTube/.test(await p.text()), await p.text(".account"));
await p.click("Connect YouTube");
await sleep(800);
const url = await p.eval("window.__opened");
ok("sign-in link opened with PKCE", /code_challenge=/.test(url ?? ""), url);
// the user signs in on "Google" in the new tab: the fake redirects back to the engine
const back = (await fetch(url, { redirect: "manual" })).headers.get("location");
const done = await (await fetch(back)).text();
ok("callback page says connected", /YouTube connected/.test(done) && /Fake Test Channel/.test(done));
await sleep(3000);
ok("Settings notices the connection", /Connected to Fake Test Channel/.test(await p.text(".account")), await p.text(".account"));
await p.click("Test connection");
await sleep(1500);
ok("Test connection works", /The connection works/.test(await p.text()), await p.text("p.hint"));
await p.shot(`${SHOTS}/32_settings_connected.png`);
await p.click("^Disconnect$");
await sleep(1500);
ok("Disconnect asks first and goes back to Connect", /Disconnect YouTube\?/.test(JSON.stringify(await p.eval("window.__dialogs"))) && /Connect YouTube/.test(await p.text(".account")));
// connect again for the publish tests
await p.click("Connect YouTube");
await sleep(500);
const back2 = (await fetch(await p.eval("window.__opened"), { redirect: "manual" })).headers.get("location");
await fetch(back2);
await sleep(3000);
ok("connected again", /Connected to Fake Test Channel/.test(await p.text(".account")));
// an old sign-in link used twice
const again = await fetch(back2);
ok("reused callback link → plain page, not a crash", again.status === 200 || again.status === 400, again.status);

console.log("== Facebook / Instagram defaults");
await field("^Facebook Page", "not a page!");
ok("bad Page refused", /should be a link/.test(await fieldText("^Facebook Page")), await fieldText("^Facebook Page"));
await field("^Facebook Page", "leavesexplained");
ok("page name → link", /facebook\.com\/leavesexplained/.test(await p.eval(`[...document.querySelectorAll("label.field")].find(x=>/^Facebook Page/.test(x.querySelector("span").textContent)).querySelector("input").value`)));
await field("^Instagram account", "https://www.instagram.com/leaves.explained/");
ok("profile URL → @handle", (await p.eval(`[...document.querySelectorAll("label.field")].find(x=>/^Instagram/.test(x.querySelector("span").textContent)).querySelector("input").value`)) === "@leaves.explained");
await field("^Caption ending", "#science #kids");
await field("^Tags always added", "science, kids");
await p.click("^Unlisted$");
await sleep(1000);
await p.click("^No$");
await sleep(1000);
const pub = JSON.parse(fs.readFileSync(`${WS}/settings.json`, "utf8")).publish;
ok("defaults saved", pub.youtube.privacy === "unlisted" && pub.youtube.madeForKids === false && pub.youtube.tags.join() === "science,kids" && pub.captionFooter === "#science #kids", JSON.stringify(pub));

console.log("== Check Chrome (fake Claude)");
const latest = fs.readdirSync(WS).filter((d) => /^project-/.test(d)).sort((a, b) => fs.statSync(`${WS}/${b}`).mtimeMs - fs.statSync(`${WS}/${a}`).mtimeMs)[0];
const before = fakeMessages(`${WS}/${latest}`).length;
await p.click("Check Chrome");
for (let i = 0; i < 30 && !/Claude is checking|needs an answer/.test(await p.text()); i++) await sleep(1000);
const note = await p.text("p.hint");
ok("Check Chrome hands the check to a video's Claude", /Claude is checking in the/.test(await p.text()), note);
const m = fakeMessages(`${WS}/${latest}`).slice(before);
ok("message asks for a read-only check incl. the Page", m.length === 1 && /without posting/.test(m[0].text) && /leavesexplained/.test(m[0].text), m[0]?.text?.slice(0, 200));
const mcp = new Client({ name: "fake-claude", version: "0.0.1" });
await mcp.connect(new StreamableHTTPClientTransport(new URL(`${B}/mcp/${latest}`)));
await mcp.callTool({ name: "chrome_check_report", arguments: { extension: true, facebook: "logged-in", facebookPage: "reachable", instagram: "logged-out", note: "Instagram asks to log in." } });
await mcp.close();
await sleep(3500);
const cc = await p.text(".checklist");
ok("result shows on the page", /Facebook: logged-in, Page reachable/.test(cc) && /Instagram: logged-out/.test(cc), cc);
await p.shot(`${SHOTS}/33_settings_chrome_checked.png`);

ok("real settings.json untouched", fs.readFileSync(REAL, "utf8") === realBefore);
console.log("   page errors:", JSON.stringify(p.errors()));
browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
