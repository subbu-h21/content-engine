// Every catalog style applied to a scratch video: the theme, margins, fonts and style.md land, the video type-checks,
// and a real frame renders for a few tricky styles. No engine needed. Takes about 10 minutes.
//   node t18_style_theme.mjs [style ...]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { applyStyle, BUILTIN_VISUAL_DIR } from "../../cli/catalog.mjs";
import { createProject } from "../../cli/projects.mjs";

const WS = "D:\\tmp\\ce-theme";
fs.mkdirSync(WS, { recursive: true });
const dir = createProject({ workspace: WS, slug: "theme", title: "Theme test" });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(BUILTIN_VISUAL_DIR);
const RENDER = new Set(["pixel-rpg", "signal-slam", "calm-product-demo", "editorial-neuro"]);
const bad = [];
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");

for (const id of ids) {
  const s = JSON.parse(fs.readFileSync(path.join(BUILTIN_VISUAL_DIR, id, "style.json"), "utf8"));
  const problems = [];
  try {
    const applied = applyStyle(dir, WS, id);
    if (!applied.themed) problems.push("not themed");
    const root = read("src/Root.tsx");
    const bg = s.palette.find((p) => p.role === "background").hex;
    if (!root.includes(`ink: "${bg}"`)) problems.push("background not in Root.tsx");
    if (!read("src/lib/theme.ts").includes(`export const MARGIN = ${s.layout.margin}`)) problems.push("margin not set");
    if (!read("src/lib/fonts.ts").includes("STYLE_FACES")) problems.push("fonts not wired");
    if (!read("src/components/Plate.tsx").includes(`backgroundColor: "${bg}"`)) problems.push("plate ground not set");
    if (!read("style.md").includes(`Catalog style: ${s.name}`)) problems.push("style.md not written");
    try {
      execFileSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], { cwd: dir, stdio: "pipe", encoding: "utf8" });
    } catch (e) {
      problems.push(`tsc: ${String(e.stdout).split("\n").slice(0, 3).join(" | ")}`);
    }
    if (RENDER.has(id)) {
      const out = path.join(WS, `${id}.png`);
      execFileSync(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", "still", "src/index.ts", "Reel", out, "--frame=40", "--log=error"], { cwd: dir, stdio: "pipe", encoding: "utf8" });
      if (!fs.existsSync(out)) problems.push("no frame rendered");
    }
  } catch (e) {
    problems.push(String(e.message).split("\n").slice(0, 3).join(" | "));
  }
  console.log(`${problems.length ? "FAIL" : "PASS"} ${id}${problems.length ? `: ${problems.join("; ")}` : ""}`);
  if (problems.length) bad.push(id);
}
console.log(`\n${bad.length ? `${bad.length} FAILED: ${bad.join(", ")}` : `all ${ids.length} passed`}`);
process.exitCode = bad.length ? 1 : 0;
