/**
 * Project management shared by the `ce` CLI and (later) the web app.
 * A workspace is a folder of video projects named project-<N>-<slug>. Engine projects have a project.json.
 * Every engine project's node_modules is a junction to runtime/node_modules, so packages are installed once.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ENGINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const TEMPLATE_DIR = path.join(ENGINE_DIR, "template");
export const RUNTIME_MODULES = path.join(ENGINE_DIR, "runtime", "node_modules");
const SETTINGS_FILE = process.env.CE_SETTINGS_FILE || path.join(ENGINE_DIR, "settings.json"); // override: tests

const DEFAULT_SETTINGS = {
  workspace: "",
  python: "python",
  blender: "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe",
  /** the engine website (ce app) */
  appPort: 4100,
  /** Remotion Studio instances started by the website use ports from here upward */
  studioPortBase: 3200,
};

export function loadSettings() {
  const s = fs.existsSync(SETTINGS_FILE) ? JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8")) : {};
  return { ...DEFAULT_SETTINGS, ...s };
}

export function saveSettings(patch) {
  const next = { ...loadSettings(), ...patch };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2) + "\n");
  return next;
}

const PROJECT_RE = /^project-(\d+)(?:-(.*))?$/i;

export function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

/** All project-N folders in a workspace, newest number first. */
export function listProjects(workspace) {
  if (!workspace || !fs.existsSync(workspace)) return [];
  return fs
    .readdirSync(workspace, { withFileTypes: true })
    .filter((d) => d.isDirectory() && PROJECT_RE.test(d.name))
    .map((d) => {
      const dir = path.join(workspace, d.name);
      const manifest = path.join(dir, "project.json");
      const engine = fs.existsSync(manifest);
      let title = null;
      if (engine) {
        try {
          title = JSON.parse(fs.readFileSync(manifest, "utf8")).title ?? null;
        } catch {
          title = "(unreadable project.json)";
        }
      }
      return { name: d.name, dir, number: Number(PROJECT_RE.exec(d.name)[1]), engine, title, link: engine ? linkStatus(dir) : null };
    })
    .sort((a, b) => b.number - a.number);
}

export function nextProjectNumber(workspace) {
  return listProjects(workspace).reduce((m, p) => Math.max(m, p.number), 0) + 1;
}

/** "ok" | "missing" | "wrong-target" | "real-folder" for a project's node_modules. */
export function linkStatus(dir) {
  const nm = path.join(dir, "node_modules");
  let st;
  try {
    st = fs.lstatSync(nm);
  } catch {
    return "missing";
  }
  if (!st.isSymbolicLink()) return "real-folder";
  const target = fs.readlinkSync(nm).replace(/^\\\\\?\\/, "");
  return path.resolve(target).toLowerCase() === path.resolve(RUNTIME_MODULES).toLowerCase() ? "ok" : "wrong-target";
}

/** Create or repair the node_modules junction. Never deletes a real node_modules folder. */
export function linkProject(dir) {
  if (!fs.existsSync(RUNTIME_MODULES)) throw new Error(`Engine packages are not installed: run npm install in ${path.dirname(RUNTIME_MODULES)}`);
  const status = linkStatus(dir);
  const nm = path.join(dir, "node_modules");
  if (status === "ok") return "ok";
  if (status === "real-folder") return "real-folder";
  if (status === "wrong-target") fs.unlinkSync(nm); // removes only the link, not what it points to
  fs.symlinkSync(RUNTIME_MODULES, nm, "junction");
  return status === "missing" ? "created" : "repaired";
}

/** New project folder project-<N>-<slug> from the template: junction, git repo, manifest filled in. */
export function createProject({ workspace, slug, title }) {
  if (!workspace) throw new Error("No workspace set. Run: ce settings workspace <folder>");
  if (!fs.existsSync(workspace)) throw new Error(`Workspace does not exist: ${workspace}`);
  const s = slugify(slug || title || "untitled") || "untitled";
  const n = nextProjectNumber(workspace);
  const dir = path.join(workspace, `project-${n}-${s}`);
  fs.cpSync(TEMPLATE_DIR, dir, { recursive: true, errorOnExist: true, force: false });
  // the catalog's skills (the taste rules every video follows; making a new style from a reference), as they are now
  for (const skill of ["visual-taste", "make-style"]) {
    const from = path.join(ENGINE_DIR, "library", "catalog", "skills", skill);
    if (fs.existsSync(from)) fs.cpSync(from, path.join(dir, ".claude", "skills", skill), { recursive: true });
  }
  // hooks, titles, thumbnails and captions: make-video's hook step needs this before the script
  fs.cpSync(path.join(ENGINE_DIR, "library", "packaging"), path.join(dir, ".claude", "skills", "packaging"), { recursive: true });
  const manifestPath = path.join(dir, "project.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.title = title || s;
  manifest.slug = s;
  manifest.created = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  linkProject(dir);
  try {
    execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
  } catch {
    // git missing: the project still works, it just has no history
  }
  return dir;
}

/** An engine project in the workspace by folder name (the website's project id), or null. Rejects anything path-like. */
export function findProject(workspace, name) {
  if (!workspace || !name || !PROJECT_RE.test(name) || name !== path.basename(name)) return null;
  const dir = path.join(workspace, name);
  return fs.existsSync(path.join(dir, "project.json")) ? dir : null;
}

/** Resolve a project argument: a path, a folder name, a project number, or (default) the current folder. */
export function resolveProject(arg, workspace) {
  const cands = [];
  if (!arg) cands.push(process.cwd());
  else {
    cands.push(path.resolve(arg));
    if (workspace) {
      cands.push(path.join(workspace, arg));
      if (/^\d+$/.test(arg)) {
        const hit = listProjects(workspace).find((p) => p.number === Number(arg));
        if (hit) cands.push(hit.dir);
      }
    }
  }
  const dir = cands.find((c) => fs.existsSync(path.join(c, "project.json")));
  if (!dir) throw new Error(`Not an engine project: ${arg ?? process.cwd()}`);
  return dir;
}
