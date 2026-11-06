// The hook step with the REAL Claude Code (costs tokens; nothing paid, nothing posted, nothing recorded): a new scratch
// video gets five hooks before any script, the board shows the best two, and the script is built on the one picked.
// The scratch engine runs WITHOUT the fake Claude on PATH.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { B, WS, SHOTS, call, chatText, ok, failures, page, sleep, stopEngine, waitFor } from "./lib.mjs";

console.log(await stopEngine());
const PATH = process.env.PATH.split(";").filter((p) => !/fakebin/i.test(p)).join(";");
const log = fs.openSync(`${WS}/engine-real.log`, "a");
const env = { ...process.env, PATH, CE_WORKSPACE: "D:\\tmp\\ce-x", CE_SETTINGS_FILE: "D:\\tmp\\ce-x\\settings.json", CE_SECRETS_DIR: "D:\\tmp\\ce-x\\secrets", CE_APP_PORT: "4170", CE_APP_DIST: "D:\\tmp\\ce-chat-dist" };
for (const k of Object.keys(env)) if (/^CLAUDE_?CODE|^CLAUDECODE$|^CLAUDE_CONFIG_DIR$/i.test(k)) delete env[k];
spawn(process.execPath, ["D:/code_files/content-engine/app/server/index.mjs"], { detached: true, stdio: ["ignore", log, log], env, windowsHide: true }).unref();
ok("scratch engine (real Claude) started", await waitFor(async () => (await fetch(`${B}/api/doctor`).catch(() => null))?.ok, 30000));

const state = async (name) => (await call("GET", `/api/projects/${name}/publish`)).body.claude;
const json = (f, fallback = {}) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const created = await call("POST", "/api/projects", { request: "Engine test: a 20 second vertical explainer on why onions make you cry, for curious adults, calm tone, in any simple look. Nothing is to be recorded or built." });
const name = created.body.name;
const dir = path.join(WS, name);
console.log("   video:", name);
const { browser, p } = await page(9354, { width: 1500, height: 1000 });
const send = async (text) => {
  await p.eval(`window.__set(document.querySelector(".chat-input textarea"), ${JSON.stringify(text)})`);
  await sleep(100);
  await p.eval(`document.querySelector(".chat-input textarea").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))`);
};
const settled = (ms = 300000) => waitFor(async () => ["idle", "stopped", "question"].includes(await state(name)), ms, 1000);
// a question card would hold the test up: take its first answer
const clearQuestion = async () => {
  if ((await state(name)) !== "question") return;
  await p.eval(`document.querySelector(".chat-card.question:not(.answered) .options button")?.click()`);
  await sleep(1500);
};

try {
  await p.go(`/p/${name}/brief`, 500);
  ok("Claude starts by itself", await waitFor(async () => (await p.eval(`document.querySelectorAll(".chat-text").length`)) > 0, 180000, 500));
  await settled();
  await clearQuestion();
  await settled();
  await send("Everything about the idea is decided as I wrote it: 20 seconds, vertical, curious adults, calm. The key message: cutting an onion breaks its cells, which releases a gas that stings your eyes. Please go to the hook step now and don't ask anything else first.");
  const five = await waitFor(() => json(path.join(dir, "brief/hooks.json")).options?.length === 5, 420000, 2000);
  ok("Claude writes five hooks", five, JSON.stringify(json(path.join(dir, "brief/hooks.json"))).slice(0, 300));
  await settled();
  await clearQuestion();

  const h = json(path.join(dir, "brief/hooks.json"));
  ok("each comes from a different formula", new Set(h.options.map((o) => o.formula)).size === 5, h.options.map((o) => o.formula).join());
  ok("Claude marked them itself", h.options.every((o) => Number.isFinite(o.judged)), h.options.map((o) => o.judged).join());
  ok("no hook is picked for the user", !h.chosen, h.chosen);
  ok("the script waits for the pick", json(path.join(dir, "script.json")).placeholder === true, JSON.stringify(json(path.join(dir, "script.json"))).slice(0, 200));
  for (const o of h.options) console.log(`   ${o.judged}  ${o.formula}: ${o.text}`);

  const brief = await call("GET", `/api/projects/${name}/brief`);
  ok("the board has the best two", brief.body.hooks?.best?.length === 2, JSON.stringify(brief.body.hooks?.best));
  await p.go(`/p/${name}/brief`, 2500);
  await p.shot(`${SHOTS}/real-hook-card.png`);
  const best = brief.body.hooks.options.find((o) => o.id === brief.body.hooks.best[0]);
  ok("the card shows it", (await p.text()).includes(best.text), best.text);
  await p.click("Use this hook");
  ok("the pick is saved", await waitFor(() => json(path.join(dir, "brief/hooks.json")).chosen === best.id, 8000));

  const first = () => json(path.join(dir, "script.json")).scenes?.[0]?.cues?.[0]?.text;
  const script = await waitFor(() => !json(path.join(dir, "script.json")).placeholder && !!first(), 420000, 2000);
  ok("Claude writes the script after the pick", script);
  ok("the script opens with the hook, word for word", first() === best.text, `${first()} | ${best.text}`);
  console.log("   script:", (json(path.join(dir, "script.json")).scenes ?? []).flatMap((s) => s.cues.map((c) => c.text)).join(" "));
  await settled();
  await clearQuestion();
  ok("nothing was recorded", !fs.existsSync(path.join(dir, "audio", "vo_full.wav")));
  ok("the chat shows no error", !/stopped unexpectedly/.test(await chatText(p)));
} finally {
  browser.proc.kill();
}

console.log(await stopEngine());
console.log(`\n${failures() ? `${failures()} FAILED` : "all passed"}`);
process.exitCode = failures() ? 1 : 0;
