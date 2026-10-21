// Pages open while the engine restarts: do they recover without a stale error?
import fs from "node:fs";
import { WS, page, sleep, startEngine, stopEngine, ok, failures } from "./lib.mjs";
const { leaves } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const { browser, p } = await page(9352);
const b2 = await page(9353);
await p.go(`/p/${leaves}/final`, 4000);
await b2.p.go(`/publish/${leaves}`, 4000);
console.log("  ", await stopEngine());
await sleep(6000);
console.log("   during: final=", (await p.text(".render-panel .error, .board > .error")).slice(0, 80), "| publish=", (await b2.p.text(".publish-panel > .error")).slice(0, 80));
ok("engine back", await startEngine());
await sleep(8000);
const f = await p.text(".board > p.error");
const pb = await b2.p.text(".publish-panel > p.error");
ok("Final tab: no stale error after the engine is back", !f, f);
ok("Publish: no stale error after the engine is back", !pb, pb);
browser.proc.kill(); b2.browser.proc.kill();
console.log(failures() ? `${failures()} FAILED` : "all passed"); process.exit(0);
