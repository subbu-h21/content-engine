#!/usr/bin/env node
/**
 * ce — content engine command line.
 *
 *   ce settings [key value]          show or change settings (workspace, python, blender)
 *   ce new <slug> [--title "..."]    create project-<N>-<slug> in the workspace from the template
 *   ce list                          projects in the workspace and their package link
 *   ce link [project]                create/repair node_modules junctions (all projects if none given)
 *   ce pipeline <project> <step> ... run a pipeline step (vo, music, stems, sfx, plates, captions)
 *   ce blender <project> <script> [args...]   run a Blender script from the project's blender/ folder headless
 *   ce doctor                        check the machine: node, python packages, ffmpeg, Blender, disk
 *
 * <project> is a path, a folder name in the workspace, or a project number.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createProject, ENGINE_DIR, linkProject, listProjects, loadSettings, resolveProject, RUNTIME_MODULES, saveSettings } from "./projects.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const settings = loadSettings();

const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = rest[i + 1];
  rest.splice(i, 2);
  return v;
};

function run(cmdline, args, opts = {}) {
  const r = spawnSync(cmdline, args, { stdio: "inherit", ...opts });
  if (r.error) throw r.error;
  process.exitCode = r.status ?? 1;
}

const commands = {
  settings() {
    if (rest.length >= 2) {
      const [key, ...v] = rest;
      const value = v.join(" ");
      if (key === "workspace") {
        const abs = path.resolve(value);
        if (!fs.existsSync(abs)) throw new Error(`No such folder: ${abs}`);
        if (/^c:/i.test(abs)) console.warn("warning: the workspace is on C:, which is nearly full; renders need many GB. D: is recommended.");
        console.log(saveSettings({ workspace: abs }));
      } else console.log(saveSettings({ [key]: value }));
    } else console.log(settings);
  },

  new() {
    const title = flag("title");
    const workspace = flag("workspace") ?? settings.workspace;
    const slug = rest[0];
    if (!slug && !title) throw new Error('usage: ce new <slug> [--title "..."]');
    const dir = createProject({ workspace, slug, title });
    console.log(`created ${dir}`);
    console.log(`next: cd "${dir}" ; npm run studio`);
  },

  list() {
    const workspace = flag("workspace") ?? settings.workspace;
    const ps = listProjects(workspace);
    if (!ps.length) return console.log(`no project-N folders in ${workspace || "(no workspace set)"}`);
    for (const p of ps) console.log(`${p.name.padEnd(36)} ${p.engine ? `engine  link:${p.link.padEnd(12)} ${p.title ?? ""}` : "(not an engine project)"}`);
  },

  link() {
    const workspace = flag("workspace") ?? settings.workspace;
    const dirs = rest.length ? rest.map((a) => resolveProject(a, workspace)) : listProjects(workspace).filter((p) => p.engine).map((p) => p.dir);
    for (const d of dirs) {
      const r = linkProject(d);
      console.log(`${path.basename(d).padEnd(36)} ${r === "real-folder" ? "has its own node_modules folder; left alone" : r}`);
    }
  },

  pipeline() {
    const [proj, ...args] = rest;
    if (!proj || !args.length) throw new Error("usage: ce pipeline <project> <step> [args]");
    const dir = resolveProject(proj, settings.workspace);
    run(settings.python, [path.join(ENGINE_DIR, "pipeline", "run.py"), dir, ...args], { env: { ...process.env, PYTHONUTF8: "1" } });
  },

  blender() {
    const [proj, script, ...args] = rest;
    if (!proj || !script) throw new Error("usage: ce blender <project> <script.py> [args]");
    const dir = resolveProject(proj, settings.workspace);
    const file = path.isAbsolute(script) ? script : path.join(dir, "blender", script);
    if (!fs.existsSync(file)) throw new Error(`No such script: ${file}`);
    run(settings.blender, ["-b", "-P", file, "--", ...args], { cwd: dir, env: { ...process.env, CE_PROJECT: dir } });
  },

  doctor() {
    const ok = (b, label, extra = "") => console.log(`${b ? " ok " : "FAIL"}  ${label}${extra ? `  (${extra})` : ""}`);
    ok(true, "node", process.version);
    ok(fs.existsSync(path.join(RUNTIME_MODULES, "remotion")), "engine packages installed", RUNTIME_MODULES);
    try {
      const v = execFileSync(settings.python, ["-c", "import numpy, scipy, PIL, sys; print(sys.version.split()[0], numpy.__version__, scipy.__version__, PIL.__version__)"], { encoding: "utf8" }).trim();
      ok(true, "python + numpy/scipy/pillow", v);
    } catch {
      ok(false, "python + numpy/scipy/pillow", settings.python);
    }
    try {
      ok(true, "ffmpeg", execFileSync("ffmpeg", ["-version"], { encoding: "utf8" }).split("\n")[0]);
    } catch {
      ok(false, "ffmpeg on PATH");
    }
    ok(fs.existsSync(settings.blender), "blender", settings.blender);
    const ws = flag("workspace") ?? settings.workspace;
    ok(!!ws && fs.existsSync(ws), "workspace", ws || "not set: ce settings workspace <folder>");
    if (ws && fs.existsSync(ws)) {
      const free = fs.statfsSync(ws);
      const gb = (free.bavail * free.bsize) / 1e9;
      ok(gb > 20, "free space on workspace drive", `${gb.toFixed(0)} GB`);
      if (/^c:/i.test(ws)) console.log("warn  workspace is on C:");
      const broken = listProjects(ws).filter((p) => p.engine && p.link !== "ok");
      ok(!broken.length, "project package links", broken.length ? `${broken.map((p) => `${p.name}:${p.link}`).join(", ")} → ce link` : `${listProjects(ws).filter((p) => p.engine).length} engine projects`);
    }
  },
};

try {
  const fn = commands[cmd];
  if (!fn) {
    console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^#!.*\n\/\*\*?/, "").replace(/^ \* ?/gm, ""));
    process.exitCode = cmd ? 1 : 0;
  } else fn();
} catch (e) {
  console.error(`ce: ${e.message}`);
  process.exitCode = 1;
}
