// A stand-in for Claude Code on the scratch engine's PATH (tests only). Records every message it receives in
// .fake-claude/messages.jsonl and every answer in .fake-claude/answers.jsonl.
//
// With -p (how the engine's chat runs Claude): speaks stream-json like Claude Code. A message containing
//   FAKE-ASK-PERMISSION  asks permission for a Bash command (and waits for the engine's answer)
//   FAKE-ASK-QUESTION    asks a two-option question (AskUserQuestion)
//   FAKE-SLOW            streams its reply slowly (about 8 s), so Stop can be tested
//   FAKE-TOOLS           runs three fake tool steps before replying
//   FAKE-CRASH           exits with code 3
// A file .fake-claude/ask makes it ask permission while idle, as if it needed one in the middle of its work.
//
// Without -p (the "Terminal" button's window): draws a prompt, records submitted lines, exits on Ctrl+C or "/exit".
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), ".fake-claude");
fs.mkdirSync(dir, { recursive: true });
const args = process.argv.slice(2);
const log = (file, o) => fs.appendFileSync(path.join(dir, file), JSON.stringify({ at: new Date().toISOString(), ...o }) + "\n");
log("runs.jsonl", { args });

// ---- the quality gate's critic (cli/review.mjs): one prompt on stdin, one JSON reply. CE_FAKE_CRITIC sets the reply;
// its folder is deleted afterwards, so CE_FAKE_CRITIC_LOG says where to keep what it was asked.
if (args.join(" ").includes("--output-format json")) {
  let prompt = "";
  for await (const c of process.stdin) prompt += c;
  if (process.env.CE_FAKE_CRITIC_LOG) fs.appendFileSync(process.env.CE_FAKE_CRITIC_LOG, JSON.stringify({ args, cwd: process.cwd(), prompt }) + "\n");
  const result = process.env.CE_FAKE_CRITIC ?? JSON.stringify([{ p: 2, t: 2, where: "the end", problem: "soft", change: "sharpen it" }, { p: 1, t: 1.5, where: "the title", problem: "too low", change: "move it up 40 px" }]);
  process.stdout.write(JSON.stringify({ type: "result", is_error: false, result }));
  process.exit(0);
}

if (!args.includes("-p")) {
  // ---- terminal window mode
  const out = (s) => process.stdout.write(s);
  out(" ✻ Fake Claude Code (test stand-in, terminal window)\r\n   cwd: " + process.cwd() + "\r\n> ");
  let buf = "";
  process.stdin.setRawMode?.(true);
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => {
    for (const c of String(d)) {
      if (c === "\x03") process.exit(0);
      if (c === "\r") {
        log("messages.jsonl", { text: buf, window: true });
        if (buf.trim() === "/exit") process.exit(0);
        out(`\r\n(fake) got it\r\n> `);
        buf = "";
      } else buf += c;
    }
  });
} else {
  // ---- stream-json mode
  const resume = args.includes("--resume") ? args[args.indexOf("--resume") + 1] : null;
  const sessionId = resume ?? crypto.randomUUID();
  let mode = args.includes("--permission-mode") ? args[args.indexOf("--permission-mode") + 1] : "manual";
  let inited = false;
  let busy = false;
  let interrupted = false;
  const waiting = new Map(); // request_id -> resolve
  const queue = [];
  const emit = (o) => process.stdout.write(JSON.stringify({ session_id: sessionId, ...o }) + "\n");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify({ sessionId, mode }));

  const ask = (tool_name, input) =>
    new Promise((resolve) => {
      const request_id = crypto.randomUUID();
      waiting.set(request_id, resolve);
      emit({ type: "control_request", request_id, request: { subtype: "can_use_tool", tool_name, input, tool_use_id: `toolu_${request_id.slice(0, 8)}`, permission_suggestions: tool_name === "Bash" ? [{ type: "addRules", rules: [{ toolName: "Bash", ruleContent: input.command }], behavior: "allow", destination: "localSettings" }] : undefined } });
    });

  const say = async (text, { slow = false } = {}) => {
    const id = `msg_${crypto.randomUUID().slice(0, 12)}`;
    emit({ type: "stream_event", event: { type: "message_start", message: { id, role: "assistant", content: [] } }, parent_tool_use_id: null });
    emit({ type: "stream_event", event: { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }, parent_tool_use_id: null });
    const words = text.split(/(?<= )/);
    for (const w of words) {
      if (interrupted) return false;
      emit({ type: "stream_event", event: { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: w } }, parent_tool_use_id: null });
      if (slow) await sleep(8000 / words.length);
    }
    emit({ type: "assistant", message: { id, role: "assistant", content: [{ type: "text", text }] }, parent_tool_use_id: null });
    return true;
  };

  const tool = async (name, input, output, msgId = `msg_${crypto.randomUUID().slice(0, 12)}`) => {
    const id = `toolu_${crypto.randomUUID().slice(0, 12)}`;
    emit({ type: "assistant", message: { id: msgId, role: "assistant", content: [{ type: "tool_use", id, name, input }] }, parent_tool_use_id: null });
    await sleep(150);
    emit({ type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: id, content: output }] }, parent_tool_use_id: null });
  };

  const turn = async (text) => {
    busy = true;
    interrupted = false;
    const t0 = Date.now();
    emit({ type: "system", subtype: "status", status: "requesting" });
    let done = true;
    if (text.includes("FAKE-CRASH")) process.exit(3);
    if (text.includes("FAKE-TOOLS")) {
      await tool("Bash", { command: "echo one", description: "Print one" }, "one");
      await tool("Read", { file_path: path.join(process.cwd(), "script.json") }, "{ }");
      await tool("mcp__content-engine__editor_state", {}, "frame 12");
    }
    if (text.includes("FAKE-ASK-PERMISSION") || text === "(ask file)") {
      const input = { command: "fake --thing", description: "Do the fake thing" };
      const id = `toolu_${crypto.randomUUID().slice(0, 12)}`;
      emit({ type: "assistant", message: { id: `msg_${id}`, role: "assistant", content: [{ type: "tool_use", id, name: "Bash", input }] }, parent_tool_use_id: null });
      const r = await ask("Bash", input);
      log("answers.jsonl", { kind: "permission", response: r });
      if (!r) done = false;
      else emit({ type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: id, content: r.behavior === "allow" ? "did the fake thing" : r.message ?? "denied", is_error: r.behavior !== "allow" } ] }, parent_tool_use_id: null });
    }
    if (done && text.includes("FAKE-ASK-QUESTION")) {
      const input = { questions: [{ question: "Which colour?", header: "Colour", multiSelect: false, options: [{ label: "Red", description: "Warm" }, { label: "Blue", description: "Cool" }] }] };
      const r = await ask("AskUserQuestion", input);
      log("answers.jsonl", { kind: "question", response: r });
      if (!r) done = false;
      else text += ` (answer: ${JSON.stringify(r.updatedInput?.answers ?? {})})`;
    }
    if (done) done = await say(`(fake Claude) received ${text.length} characters.${text.includes("FAKE-ASK-QUESTION") ? ` ${text.slice(text.indexOf("(answer:"))}` : ""}`, { slow: text.includes("FAKE-SLOW") });
    emit(done ? { type: "result", subtype: "success", is_error: false, duration_ms: Date.now() - t0, result: "ok" } : { type: "result", subtype: "error_during_execution", is_error: true, duration_ms: Date.now() - t0 });
    busy = false;
    if (queue.length) turn(queue.shift());
  };

  setInterval(() => {
    const f = path.join(dir, "ask");
    if (!busy && fs.existsSync(f)) {
      fs.rmSync(f, { force: true });
      turn("(ask file)");
    }
  }, 300);

  let buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      if (!line.trim()) continue;
      const m = JSON.parse(line);
      if (m.type === "control_request") {
        const sub = m.request?.subtype;
        if (sub === "set_permission_mode") {
          mode = m.request.mode;
          log("modes.jsonl", { mode });
        }
        if (sub === "interrupt") {
          interrupted = true;
          for (const [rid, resolve] of waiting) {
            emit({ type: "control_cancel_request", request_id: rid });
            resolve(null);
          }
          waiting.clear();
        }
        emit({ type: "control_response", response: { subtype: "success", request_id: m.request_id, response: sub === "initialize" ? { commands: [] } : {} } });
      } else if (m.type === "control_response") {
        const resolve = waiting.get(m.response?.request_id);
        waiting.delete(m.response?.request_id);
        resolve?.(m.response?.response ?? null);
      } else if (m.type === "user") {
        const text = typeof m.message?.content === "string" ? m.message.content : JSON.stringify(m.message?.content);
        log("messages.jsonl", { text, queued: busy });
        if (!inited) {
          inited = true;
          emit({ type: "system", subtype: "init", cwd: process.cwd(), tools: ["Bash", "Read", "AskUserQuestion"], mcp_servers: [{ name: "content-engine", status: "connected" }], permissionMode: mode });
        }
        if (busy) queue.push(text);
        else turn(text);
      }
    }
  });
  process.stdin.on("end", () => process.exit(0));
}
