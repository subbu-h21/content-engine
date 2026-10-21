// Runs the scratch-engine tests in order (t1 first: it writes _names.json for the others) and sums up the results.
// Needs: D:\tmp\ce-x\settings.json (write_settings.mjs), the fake Google (fake_google.mjs) and the test page
// (cd app; node build.mjs D:\tmp\ce-chat-dist). Starts the scratch engine itself.
import { spawnSync } from "node:child_process";
import { startEngine, stopEngine } from "./lib.mjs";

const TESTS = (process.argv[2] ?? "t1_create,t2_brief,t3_final,t4_restart,t5_settings,t6_publish,t6b_social,t7_race,t8_misc,t9_stale,t10_ux,t11_studio_nproc,t12_chat").split(",");
console.log(await stopEngine());
if (!(await startEngine())) throw new Error("scratch engine didn't start");
const summary = [];
for (const t of TESTS) {
  console.log(`\n######## ${t}`);
  const r = spawnSync(process.execPath, [`${t}.mjs`], { cwd: new URL(".", import.meta.url).pathname.slice(1), encoding: "utf8", timeout: 20 * 60 * 1000 });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  console.log(out.split("\n").filter((l) => !/^PASS/.test(l)).join("\n"));
  const pass = (out.match(/^PASS/gm) ?? []).length;
  const fail = (out.match(/^FAIL/gm) ?? []).length;
  summary.push(`${t}: ${pass} passed, ${fail} failed${r.status ? ` (exit ${r.status})` : ""}`);
}
console.log("\n######## summary\n" + summary.join("\n"));
