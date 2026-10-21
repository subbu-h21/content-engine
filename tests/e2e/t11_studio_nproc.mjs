// Studio must come up when the engine is started from a plain Windows terminal (no `nproc` on PATH, unlike Git Bash):
// Remotion re-runs `nproc` on every request and each failed run costs ~1 s (see app/server/bin/nproc.cmd).
import fs from "node:fs";
import { call, ok, failures, sleep, startEngine, stopEngine, WS } from "./lib.mjs";

const clean = process.env.PATH.split(";").filter((p) => p && !/Git\\usr\\bin|Git\\mingw|msys/i.test(p));
const fakebin = new URL("./fakebin", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1").replace(/\//g, "\\");
console.log("  ", await stopEngine());
ok("scratch engine started with a PATH without nproc", await startEngine({ PATH: [fakebin, ...clean].join(";"), Path: undefined }));
const p = (await call("POST", "/api/projects", { request: "Studio start check", title: "Studio start check" })).body;
const t0 = Date.now();
await call("POST", `/api/projects/${p.name}/open`, {});
let st;
for (let i = 0; i < 150; i++) {
  st = (await call("GET", `/api/projects/${p.name}/studio`)).body;
  if (st.status !== "starting") break;
  await sleep(1000);
}
const secs = Math.round((Date.now() - t0) / 1000);
ok("Studio ready", st.status === "ready", `${st.status} after ${secs} s ${st.error ?? ""}`);
const r = await fetch(`http://127.0.0.1:${st.port}/`, { signal: AbortSignal.timeout(10000) }).catch((e) => ({ ok: false, status: e.name }));
ok("Studio answers its page", r.ok, r.status);
console.log(`   ready after ${secs} s`);
fs.writeFileSync(`${WS}/_studio_check.json`, JSON.stringify({ name: p.name, secs }));
console.log(failures() ? `${failures()} FAILED` : "all passed");
process.exit(0);
