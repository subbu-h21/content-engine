// Real Claude Code in a scratch video: read the trust screen and the prompt; never send a message.
import { WebSocket, call, sleep, startEngine, stopEngine } from "./lib.mjs";
const name = process.argv[2], answer = process.argv[3] === "answer";
const plain = (s) => s.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "").replace(/\x1b\][^\x07]*\x07/g, "").replace(/[ \t]+/g, " ");
const ws = new WebSocket(`ws://127.0.0.1:4170/ws/terminal/${name}`, { origin: "http://127.0.0.1:4170" });
let s = ""; ws.on("message", (d) => (s += String(d)));
await new Promise((r) => ws.on("open", r));
const state = async () => (await call("GET", `/api/projects/${name}/publish`)).body.claude;
for (let i = 0; i < 40; i++) { await sleep(1000); if (/trust|for shortcuts|shift\+tab/i.test(plain(s))) break; }
await sleep(3000);
console.log("STATE 1:", await state());
console.log(plain(s).slice(-1500));
if (answer) {
  ws.send(JSON.stringify({ type: "input", data: "\x1b[B" }));
  await sleep(600);
  ws.send(JSON.stringify({ type: "input", data: "\r" }));
  for (let i = 0; i < 30; i++) { await sleep(1000); if ((await state()) === "ready") break; }
  await sleep(4000);
  console.log("STATE 2:", await state());
  console.log(plain(s).slice(-1200));
}
ws.close(); process.exit(0);
