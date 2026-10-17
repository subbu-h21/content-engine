/**
 * The engine side of EngineBridge (template/src/components/EngineBridge.tsx):
 * what each project's Studio last reported, and a command channel (server-sent events) back to it.
 */
import { randomUUID } from "node:crypto";

/** name -> { composition, frame, fps, durationInFrames, props, updatedAt } */
const states = new Map();
/** name -> Set of SSE responses (normally one: the open Studio tab) */
const channels = new Map();
/** command id -> resolve */
const pending = new Map();

export function updateState(name, patch) {
  const prev = states.get(name) ?? {};
  const next = { ...prev, ...patch, updatedAt: Date.now() };
  if (!patch.props && prev.props) next.props = prev.props;
  states.set(name, next);
}

export function getState(name) {
  const st = states.get(name) ?? null;
  return st ? { ...st, connected: (channels.get(name)?.size ?? 0) > 0 } : null;
}

export function openChannel(name, res) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
    "access-control-allow-origin": "*",
  });
  res.write(": connected\n\n");
  if (!channels.has(name)) channels.set(name, new Set());
  channels.get(name).add(res);
  const ping = setInterval(() => res.write(": ping\n\n"), 15000);
  res.on("close", () => {
    clearInterval(ping);
    channels.get(name)?.delete(res);
  });
}

export function resolveResult(body) {
  const done = pending.get(body?.id);
  if (done) done({ ok: !!body.ok, detail: body.detail ?? "" });
}

/** Send a command to the project's open Studio and wait for its result. */
export function command(name, cmd, timeoutMs = 4000) {
  const subs = channels.get(name);
  if (!subs?.size) return Promise.resolve({ ok: false, detail: "Studio is not open in the engine for this project" });
  const id = randomUUID();
  const msg = `data: ${JSON.stringify({ ...cmd, id })}\n\n`;
  for (const res of subs) res.write(msg);
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      pending.delete(id);
      resolve({ ok: false, detail: "Studio did not answer" });
    }, timeoutMs);
    pending.set(id, (r) => {
      clearTimeout(t);
      pending.delete(id);
      resolve(r);
    });
  });
}

/** Wait until the reported state satisfies `test` (e.g. the playhead arrived), up to timeoutMs. */
export async function waitForState(name, test, timeoutMs = 3000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    const st = getState(name);
    if (st && test(st)) return st;
    await new Promise((r) => setTimeout(r, 100));
  }
  return getState(name);
}
