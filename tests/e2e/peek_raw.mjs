import { WebSocket } from "./lib.mjs";
const ws = new WebSocket(`ws://127.0.0.1:4170/ws/terminal/${process.argv[2]}`, { origin: "http://127.0.0.1:4170" });
let s = "";
ws.on("message", (d) => (s += String(d)));
setTimeout(() => {
  const p = s.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "").replace(/\x1b\][^\x07]*\x07/g, "");
  console.log(JSON.stringify(p.slice(-1500)));
  ws.close(); process.exit(0);
}, 2500);
