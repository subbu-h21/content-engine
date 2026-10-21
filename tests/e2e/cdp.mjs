// Minimal headless-Chrome driver over the DevTools protocol (test helper; uses Remotion's chrome-headless-shell).
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const require = createRequire("D:/code_files/content-engine/app/package.json");
const WebSocket = require("ws");
const CHROME = "D:/code_files/content-engine/runtime/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe";

export async function launch(port = 9333, { width = 1600, height = 1000 } = {}) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ce-cdp-"));
  const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},${height}`, "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return { proc, port, page: await connect(page.webSocketDebuggerUrl) };
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("chrome did not start");
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, { perMessageDeflate: false });
    let id = 0;
    const waiting = new Map();
    const logs = [];
    ws.on("message", (raw) => {
      const m = JSON.parse(String(raw));
      if (m.id && waiting.has(m.id)) {
        const { res, rej } = waiting.get(m.id);
        waiting.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method === "Runtime.consoleAPICalled") logs.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
      else if (m.method === "Runtime.exceptionThrown") logs.push("EXCEPTION " + m.params.exceptionDetails.text + " " + (m.params.exceptionDetails.exception?.description ?? ""));
    });
    ws.on("error", reject);
    ws.on("open", async () => {
      const send = (method, params = {}) =>
        new Promise((res, rej) => {
          const i = ++id;
          waiting.set(i, { res, rej });
          ws.send(JSON.stringify({ id: i, method, params }));
        });
      await send("Page.enable");
      await send("Runtime.enable");
      resolve({
        send,
        logs,
        goto: (u) => send("Page.navigate", { url: u }),
        eval: async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.value,
        shot: async (file) => fs.writeFileSync(file, Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64")),
        key: async (key, code, keyCode) => {
          await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode });
          await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode });
        },
        close: () => ws.close(),
      });
    });
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
