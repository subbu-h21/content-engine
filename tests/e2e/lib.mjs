// Shared helpers for the scratch-engine tests (port 4170, workspace D:\tmp\ce-x, fake Google 4180, fake Claude).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
export { launch, sleep } from "./cdp.mjs";

export const B = "http://127.0.0.1:4170";
export const G = "http://127.0.0.1:4180";
export const WS = "D:/tmp/ce-x";
export const SHOTS = "D:/tmp/ce-x/shots";
fs.mkdirSync(SHOTS, { recursive: true });
const require = createRequire("D:/code_files/content-engine/app/package.json");
export const WebSocket = require("ws");
const H = { "content-type": "application/json", origin: B };

export async function call(method, u, body) {
  const go = () => fetch(B + u, { method, headers: H, body: body == null ? undefined : JSON.stringify(body) });
  const r = await go().catch(() => go());
  const t = await r.text();
  try {
    return { status: r.status, body: JSON.parse(t) };
  } catch {
    return { status: r.status, body: t };
  }
}
let fails = 0;
export const ok = (label, cond, extra = "") => {
  if (!cond) fails++;
  console.log(`${cond ? "PASS" : "FAIL"} ${label}${extra ? ": " + String(extra).slice(0, 400) : ""}`);
  return cond;
};
export const failures = () => fails;

/** Messages the fake Claude received in a project. */
export const fakeMessages = (dir) => {
  const f = path.join(dir, ".fake-claude", "messages.jsonl");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
};
/** Answers the fake Claude received (permission and question responses). */
export const fakeAnswers = (dir) => {
  const f = path.join(dir, ".fake-claude", "answers.jsonl");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
};
/** Kept for older tests: the chat runs Claude without a trust question, so there's nothing to skip. */
export const fakeTrust = () => undefined;
/** The chat panel's text, and a wait until it matches. */
export const chatText = (p) => p.text(".chat-list");
export async function waitFor(fn, ms = 15000, every = 300) {
  const t0 = Date.now();
  for (;;) {
    const v = await fn();
    if (v || Date.now() - t0 > ms) return v;
    await new Promise((r) => setTimeout(r, every));
  }
}

// this folder (holds stop_engine.ps1 and fakebin/, the fake `claude`)
const SCRATCH = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
/** Stop ONLY the scratch engine (port 4170). */
export async function stopEngine() {
  const { execFileSync } = await import("node:child_process");
  return execFileSync("pwsh.exe", ["-NoProfile", "-File", `${SCRATCH}/stop_engine.ps1`], { encoding: "utf8" }).trim();
}
/** Start the scratch engine detached (same environment as start_engine.ps1); resolves when it answers. */
export async function startEngine(extraEnv = {}) {
  const { spawn } = await import("node:child_process");
  const log = fs.openSync(`${WS}/engine.log`, "a");
  const env = {
    ...process.env,
    CE_WORKSPACE: "D:\\tmp\\ce-x",
    CE_SETTINGS_FILE: "D:\\tmp\\ce-x\\settings.json",
    CE_SECRETS_DIR: "D:\\tmp\\ce-x\\secrets",
    CE_APP_PORT: "4170",
    CE_RENDER_NO_GPU_WAIT: "1",
    // the page built for tests (node build.mjs D:\tmp\ce-chat-dist): app/dist stays what the user's engine serves
    CE_APP_DIST: "D:\\tmp\\ce-chat-dist",
    CE_GOOGLE_AUTH_URL: `${G}/auth`,
    CE_GOOGLE_TOKEN_URL: `${G}/token`,
    CE_YOUTUBE_API: G,
    PATH: `${SCRATCH.replace(/\//g, "\\")}\\fakebin;${process.env.PATH}`,
    ...extraEnv,
  };
  const p = spawn(process.execPath, ["D:/code_files/content-engine/app/server/index.mjs"], { detached: true, stdio: ["ignore", log, log], env, windowsHide: true });
  p.unref();
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${B}/api/doctor`)).ok) return true;
    } catch {
      // not yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/** In-page helpers (string to eval) */
export const PAGE_HELPERS = `
window.__set = (el, v) => {
  const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
  el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
};
window.__btn = (re, root = document) => [...root.querySelectorAll("button, a")].find((b) => new RegExp(re).test(b.textContent.trim()));
window.__click = (re, root) => { const b = window.__btn(re, root); if (!b) return "no button " + re; if (b.disabled) return "disabled " + re; b.click(); return "clicked"; };
window.__text = (sel = "body") => (document.querySelector(sel)?.innerText ?? "").replace(/\\s+/g, " ");
window.__tab = (re) => { const b = [...document.querySelectorAll(".ptabs button")].find((x) => new RegExp(re).test(x.textContent)); if (!b) return "no tab " + re; b.click(); return "tab"; };
`;
export async function page(port = 9340, size) {
  const { launch } = await import("./cdp.mjs");
  const b = await launch(port, size);
  const p = b.page;
  await p.send("Page.addScriptToEvaluateOnNewDocument", { source: PAGE_HELPERS });
  // window.confirm / prompt answers come from window.__answers (default: confirm true, prompt "")
  await p.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__dialogs = []; window.confirm = (m) => (window.__dialogs.push(["confirm", m]), window.__confirm ?? true); window.prompt = (m, d) => (window.__dialogs.push(["prompt", m]), window.__prompt === undefined ? "" : window.__prompt); window.open = (u) => (window.__opened = u, null);`,
  });
  await p.send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await p.send("Browser.grantPermissions", { origin: B, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => undefined);
  p.go = async (u, wait = 2500) => {
    await p.goto(u.startsWith("http") ? u : B + u);
    await new Promise((r) => setTimeout(r, wait));
  };
  p.text = (sel) => p.eval(`window.__text(${JSON.stringify(sel ?? "body")})`);
  p.click = (re, root) => p.eval(`window.__click(${JSON.stringify(re)}${root ? `, document.querySelector(${JSON.stringify(root)})` : ""})`);
  p.path = () => p.eval("location.pathname");
  p.errors = () => p.logs.filter((l) => /EXCEPTION|error/i.test(l));
  return { browser: b, p };
}
