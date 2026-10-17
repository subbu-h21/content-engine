/**
 * Build an engine project for the phone reel ("Why do we reach for our phones…") from
 * project-3-development (Remotion layer, encoded plates, stems) and project-2-expt/reel (voice lines, music, Blender).
 *
 *   node migrations/phone-reel/migrate.mjs [--workspace <dir>] [--copy-renders]
 *
 * Creates project-<N>-phone-reel. Without --copy-renders the plate frame folders (≈3 GB) are referenced in place
 * (absolute paths in project.json) instead of copied. Sources are only read, never changed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProject, loadSettings } from "../../cli/projects.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const P3 = "D:\\code_files\\animations\\project-3-development";
const P2 = "D:\\code_files\\animations\\project-2-expt\\reel";

const args = process.argv.slice(2);
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const workspace = opt("workspace") ?? loadSettings().workspace;
const copyRenders = args.includes("--copy-renders");

const dir = createProject({ workspace, slug: "phone-reel", title: "Why do we reach for our phones the moment we're bored?" });
const cp = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};

// 1. reel-specific definitions (this folder)
for (const f of ["project.json", "script.json", "sfx.json"]) cp(path.join(HERE, f), path.join(dir, f));
fs.rmSync(path.join(dir, "src", "scenes"), { recursive: true });
cp(path.join(HERE, "src"), path.join(dir, "src"));

// 2. generated data, as project-3 has it (the pipeline can regenerate all of it)
for (const f of ["timing.json", "markers.json", "duck.json", "sfx_events.json"]) cp(path.join(P3, "src", "data", f), path.join(dir, "src", "data", f));

// 3. encoded plates and audio stems
for (const f of fs.readdirSync(path.join(P3, "public", "plates"))) cp(path.join(P3, "public", "plates", f), path.join(dir, "public", "plates", f));
cp(path.join(P3, "public", "audio"), path.join(dir, "public", "audio"));

// 4. sources: per-cue voice lines, music
cp(path.join(P2, "audio", "vo"), path.join(dir, "audio", "vo"));
for (const f of ["music.mp3", "music.wav"]) cp(path.join(P2, "audio", f), path.join(dir, "audio", f));

// 5. Blender: this video's shot scripts + lock-screen texture, and a frozen copy of the engine's builders (brain, phone)
cp(path.join(HERE, "blender"), path.join(dir, "blender"));
cp(path.join(HERE, "..", "..", "library", "blender"), path.join(dir, "blender", "lib"));

// 6. plate frames: copy, or point at the originals
const manifestPath = path.join(dir, "project.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const p of manifest.plates) {
  const src = path.join(P2, "renders", p.id, "final");
  if (copyRenders) cp(src, path.join(dir, p.frames));
  else p.frames = src;
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
fs.copyFileSync(path.join(P3, "notes", "NOTES.md"), path.join(dir, "notes", "NOTES.md"));
console.log(dir);
