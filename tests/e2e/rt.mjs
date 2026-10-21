// Render-queue test helper against the scratch engine.
//   node rt.mjs plan|show|stop|resume|ask <project>
//   node rt.mjs start <project> [--rerender id,id] [--no-autofix]
//   node rt.mjs wait <project> <until: status name | "step:<id>" | "frames:<n>"> <timeoutS>
const B = process.env.CE_URL ?? "http://127.0.0.1:4170";
const H = { "content-type": "application/json", origin: B };
const [cmd, name, ...rest] = process.argv.slice(2);
const get = async () => (await fetch(`${B}/api/projects/${name}/render`)).json();
const post = async (u, body = {}) => {
  const r = await fetch(`${B}/api/projects/${name}/render/${u}`, { method: "POST", headers: H, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const compact = (info) => {
  const j = info.job;
  if (!j) return "no job";
  const steps = j.steps.map((s) => `${s.id}:${s.status}${s.progress?.total ? `(${s.progress.done}/${s.progress.total})` : ""}${s.attempts > 1 ? `[a${s.attempts}]` : ""}`).join(" ");
  return `job ${j.status} | ${steps}${j.error ? ` | error: ${j.error.message}` : ""}${j.claudeNotice ? ` | claude: ${JSON.stringify(j.claudeNotice)}` : ""}${info.live?.waiting ? ` | waiting: ${info.live.waiting}` : ""}`;
};
if (cmd === "plan") {
  const { plan } = await get();
  console.log(JSON.stringify({ problems: plan.problems, plates: plan.plates.map(({ folder, ...p }) => p), est: plan.estSeconds, needGB: (plan.needBytes / 1e9).toFixed(2) }, null, 1));
} else if (cmd === "show") console.log(compact(await get()));
else if (cmd === "start") {
  const i = rest.indexOf("--rerender");
  const rerender = i >= 0 ? rest[i + 1].split(",") : [];
  console.log(JSON.stringify(await post("start", { rerender, autoFix: !rest.includes("--no-autofix") })).slice(0, 300));
} else if (["stop", "resume"].includes(cmd)) console.log(JSON.stringify(await post(cmd, rest.includes("--no-autofix") ? { autoFix: false } : {})).slice(0, 300));
else if (cmd === "ask") console.log(JSON.stringify(await post("ask-claude")));
else if (cmd === "wait") {
  const [until, timeoutS] = rest;
  const t0 = Date.now();
  let last = "";
  for (;;) {
    const info = await get();
    const c = compact(info);
    if (c !== last) {
      console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${c}`);
      last = c;
    }
    const j = info.job;
    const run = j?.steps.find((s) => s.status === "running");
    const ok =
      (until.startsWith("step:") && run?.id === until.slice(5)) ||
      (until.startsWith("frames:") && (run?.progress?.done ?? info.live?.progress?.done ?? 0) >= Number(until.slice(7))) ||
      j?.status === until;
    if (ok) break;
    if (Date.now() - t0 > Number(timeoutS) * 1000) {
      console.log("TIMEOUT");
      break;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}
