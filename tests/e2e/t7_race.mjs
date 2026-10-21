// YouTube: Stop and Resume right after it, while a chunk is still on its way.
import fs from "node:fs";
import { WS, G, call, ok, failures, sleep } from "./lib.mjs";
const { leaves } = JSON.parse(fs.readFileSync(`${WS}/_names.json`, "utf8"));
const info = async () => (await call("GET", `/api/projects/${leaves}/publish`)).body;
await fetch(`${G}/debug/faults`, { method: "POST", body: JSON.stringify({ delayMs: 1500 }) });
await call("POST", `/api/projects/${leaves}/publish/youtube/report`, { status: "none" });
await call("POST", `/api/projects/${leaves}/publish/select`, { file: "out/long draft.mp4" });
const st = await call("POST", `/api/projects/${leaves}/publish/youtube/start`, { again: true });
console.log("start:", st.status, st.body.status ?? st.body.error);
for (let i = 0; i < 60; i++) { const x = await info(); if ((x.youtube.live?.sent ?? 0) >= 8 * 1048576) break; await sleep(300); }
console.log("stop:", (await call("POST", `/api/projects/${leaves}/publish/youtube/stop`)).body.status);
await sleep(100);
const r = await call("POST", `/api/projects/${leaves}/publish/youtube/start`, {});
console.log("resume:", r.status, r.body.status ?? r.body.error);
await sleep(4000);
let x = await info();
ok("after Stop+Resume the upload is running", (x.state.youtube.status === "uploading" && !!x.youtube.live) || x.state.youtube.status === "done", `${x.state.youtube.status} live=${JSON.stringify(x.youtube.live)}`);
await fetch(`${G}/debug/faults`, { method: "POST", body: "{}" });
for (let i = 0; i < 60 && !["done", "failed"].includes(x.state.youtube.status); i++) { await sleep(1000); x = await info(); }
console.log("final status:", x.state.youtube.status);
console.log(failures() ? `${failures()} FAILED` : "all passed");
