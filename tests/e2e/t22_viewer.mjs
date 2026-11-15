// t22: the phone viewer (cli/viewer.mjs, `ce viewer`): read-only, keyed, Range streaming, nothing but listed videos.
// Scratch workspace D:\tmp\ce-viewer (made here), port 4172, secrets in the scratch folder. No tunnel is started.
//   node tests/e2e/t22_viewer.mjs
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const ENGINE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "..");
const WS = "D:\\tmp\\ce-viewer";
const SECRETS = path.join(WS, "_secrets");
const PORT = 4172;
let fails = 0;
const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) fails++;
};

// --- a scratch workspace: one video project with files the viewer must and mustn't offer
fs.rmSync(WS, { recursive: true, force: true });
const P = path.join(WS, "project-1-test");
for (const d of ["out/render", "out/sub/deeper", "out/check"]) fs.mkdirSync(path.join(P, d), { recursive: true });
fs.writeFileSync(path.join(P, "project.json"), JSON.stringify({ engine: "0.1.0", title: "Viewer test <b>&</b>" }));
const clip = (file) => execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "testsrc=size=180x320:rate=30:duration=1", "-pix_fmt", "yuv420p", path.join(P, file)]);
for (const f of ["out/delivery.mp4", "out/draft-preview.mp4", "out/video.mp4", "out/sub/extra.mp4", "out/sub/deeper/too-deep.mp4", "out/render/temp.mp4", "out/check/c.mp4"]) clip(f);
fs.writeFileSync(path.join(P, "out", "notes.txt"), "not a video");
fs.writeFileSync(path.join(WS, "secret.txt"), "outside");

const req = (pathAndQuery, { method = "GET", headers = {} } = {}, host = "127.0.0.1") =>
  new Promise((resolve, reject) => {
    const r = http.request({ host, port: PORT, path: pathAndQuery, method, headers }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    r.on("error", reject);
    r.setTimeout(5000, () => r.destroy(new Error("timeout")));
    r.end();
  });

// --- start it the way viewer.bat does (minus the tunnel)
const proc = spawn(process.execPath, [path.join(ENGINE, "cli", "ce.mjs"), "viewer"], {
  env: { ...process.env, CE_WORKSPACE: WS, CE_SECRETS_DIR: SECRETS, CE_VIEWER_PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});
let out = "";
proc.stdout.on("data", (b) => (out += b));
proc.stderr.on("data", (b) => (out += b));
const t0 = Date.now();
while (!/k=([\w-]+)/.test(out) && Date.now() - t0 < 10000) await new Promise((r) => setTimeout(r, 100));
const key = /k=([\w-]+)/.exec(out)?.[1];
check(!!key && key.length >= 24, `starts and prints a link with a key (${key ? key.length : 0} chars)`);
check(fs.readFileSync(path.join(SECRETS, "viewer-key.txt"), "utf8").trim() === key, "the key is kept in the secrets folder");

try {
  const k = encodeURIComponent(key);
  const file = (f, extra = "") => `/file?p=project-1-test&f=${encodeURIComponent(f)}&k=${k}${extra}`;

  check((await req("/")).status === 403, "no key: 403");
  check((await req("/?k=wrong-key-wrong-key-wrong-key")).status === 403, "wrong key: 403");
  check((await req(`/file?p=project-1-test&f=out/delivery.mp4`)).status === 403, "a video without the key: 403");

  const list = await req(`/?k=${k}`, { headers: { host: "random-words.trycloudflare.com" } });
  const html = list.body.toString();
  check(list.status === 200, "a tunnel's Host is accepted with the key");
  check(html.includes("delivery.mp4") && html.includes("draft-preview.mp4") && html.includes("extra.mp4"), "lists the final, the draft and a video one folder below out/");
  check(!html.includes("too-deep") && !html.includes("temp.mp4") && !html.includes("c.mp4") && !html.includes(">video.mp4"), "skips deeper folders, out/render, out/check, and out/video.mp4 when a final exists");
  check(!html.includes("<b>") && html.includes("&lt;b&gt;"), "titles are escaped");
  check(list.headers["referrer-policy"] === "no-referrer" && /default-src 'none'/.test(list.headers["content-security-policy"] ?? ""), "no-referrer and a strict CSP on pages");

  const real = fs.readFileSync(path.join(P, "out", "delivery.mp4"));
  const whole = await req(file("out/delivery.mp4"));
  check(whole.status === 200 && whole.body.equals(real) && whole.headers["content-type"] === "video/mp4", `streams a whole video (${real.length} bytes)`);
  const part = await req(file("out/delivery.mp4"), { headers: { range: "bytes=10-99" } });
  check(part.status === 206 && part.body.equals(real.subarray(10, 100)) && part.headers["content-range"] === `bytes 10-99/${real.length}`, "Range bytes=10-99: 206 with the right bytes");
  const tail = await req(file("out/delivery.mp4"), { headers: { range: "bytes=-50" } });
  check(tail.status === 206 && tail.body.equals(real.subarray(real.length - 50)), "Range bytes=-50: the last 50 bytes");
  check((await req(file("out/delivery.mp4"), { headers: { range: `bytes=${real.length + 10}-` } })).status === 416, "a range past the end: 416");
  const head = await req(file("out/delivery.mp4"), { method: "HEAD" });
  check(head.status === 200 && head.body.length === 0 && Number(head.headers["content-length"]) === real.length, "HEAD: size, no body");
  check(/attachment/.test((await req(file("out/delivery.mp4", "&dl=1"), { method: "HEAD" })).headers["content-disposition"] ?? ""), "Download sends it as an attachment");

  for (const f of ["project.json", "out/notes.txt", "out/render/temp.mp4", "out/sub/deeper/too-deep.mp4", "../secret.txt", "out/../project.json", "..\\secret.txt", "D:\\tmp\\ce-viewer\\secret.txt"]) {
    check((await req(file(f))).status === 404, `refuses f=${f}`);
  }
  check((await req(`/file?p=..&f=secret.txt&k=${k}`)).status === 404, "refuses p=..");
  check((await req(`/file?p=${encodeURIComponent("..\\ce-viewer")}&f=secret.txt&k=${k}`)).status === 404, "refuses a path as the project");
  check((await req(`/watch?p=project-1-test&f=out/draft-preview.mp4&k=${k}`)).body.toString().includes("<video"), "the watch page has a player");

  for (const method of ["POST", "PUT", "DELETE"]) check((await req(`/?k=${k}`, { method })).status === 405, `${method}: 405 (read-only)`);

  const lan = Object.values(os.networkInterfaces()).flat().find((i) => i && i.family === "IPv4" && !i.internal)?.address;
  if (lan) {
    let reached = true;
    try {
      await req(`/?k=${k}`, {}, lan);
    } catch {
      reached = false;
    }
    check(!reached, `not reachable on this PC's network address (${lan}): listens on 127.0.0.1 only`);
  } else console.log("skip  no network address to test against");
} finally {
  proc.kill();
}

// --- a new key replaces the old one
const before = fs.readFileSync(path.join(SECRETS, "viewer-key.txt"), "utf8").trim();
const again = spawn(process.execPath, [path.join(ENGINE, "cli", "ce.mjs"), "viewer", "--new-key"], {
  env: { ...process.env, CE_WORKSPACE: WS, CE_SECRETS_DIR: SECRETS, CE_VIEWER_PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});
let out2 = "";
again.stdout.on("data", (b) => (out2 += b));
const t1 = Date.now();
while (!/k=/.test(out2) && Date.now() - t1 < 10000) await new Promise((r) => setTimeout(r, 100));
again.kill();
const after = fs.readFileSync(path.join(SECRETS, "viewer-key.txt"), "utf8").trim();
check(after !== before && after.length >= 24, "--new-key makes a new key");

fs.rmSync(WS, { recursive: true, force: true });
console.log(fails ? `\n${fails} FAILED` : "\nall passed");
process.exit(fails ? 1 : 0);
