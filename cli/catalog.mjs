/**
 * The catalog of styles (format: library/catalog/README.md): list, check and preview them. Shared by the `ce` CLI
 * and the website, so no console output and no process exits here.
 * Built-in styles live in library/catalog/visual/<id>/, the user's own in <workspace>/catalog/visual/<id>/; a user
 * style with a built-in's id is the user's edited copy and takes its place.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ENGINE_DIR, linkProject, RUNTIME_MODULES } from "./projects.mjs";

export const CATALOG_DIR = path.join(ENGINE_DIR, "library", "catalog");
export const BUILTIN_VISUAL_DIR = path.join(CATALOG_DIR, "visual");
const PREVIEW_SOURCE = path.join(CATALOG_DIR, "preview");
const GOOGLE_FONTS = path.join(RUNTIME_MODULES, "@remotion", "google-fonts", "dist", "esm");

export const userVisualDir = (workspace) => path.join(workspace, "catalog", "visual");

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_RE = /^#[0-9a-f]{6}$/i;
const STATUSES = ["built-in", "approved", "experimental"];
const FONT_SOURCES = ["google", "file", "local"];
/** The easing names the kit's run() knows (library/catalog/kit/index.tsx → CURVES). */
const CURVE_NAMES = ["linear", "expo-out", "expo-in", "expo-in-out", "cubic-out", "cubic-in", "cubic-in-out", "quart-out", "quart-in", "sine-in-out", "smootherstep"];
const SECTIONS = ["In one line", "Palette", "Typography", "Layout", "Elements", "Motion", "Transitions and rhythm", "Finish", "3D look", "Banned", "Where it came from"];

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const styleDirs = (root) =>
  fs.existsSync(root)
    ? fs
        .readdirSync(root, { withFileTypes: true })
        .filter((d) => d.isDirectory() && ID_RE.test(d.name) && fs.existsSync(path.join(root, d.name, "style.json")))
        .map((d) => path.join(root, d.name))
    : [];

/** Every visual style: built-ins (unless the user has their own copy) and the user's, sorted by name. */
export function listStyles(workspace) {
  const own = workspace ? styleDirs(userVisualDir(workspace)) : [];
  const ownIds = new Set(own.map((d) => path.basename(d)));
  const builtIns = styleDirs(BUILTIN_VISUAL_DIR);
  const builtInIds = new Set(builtIns.map((d) => path.basename(d)));
  const entry = (dir, builtIn) => {
    let s = {};
    try {
      s = readJson(path.join(dir, "style.json"));
    } catch {
      // listed anyway; `checkStyle` says what's wrong
    }
    const cover = path.join(dir, "preview", "cover.jpg");
    return {
      id: path.basename(dir),
      name: s.name ?? path.basename(dir),
      status: s.status ?? null,
      summary: s.summary ?? "",
      tags: Array.isArray(s.tags) ? s.tags : [],
      builtIn,
      editedBuiltIn: !builtIn && builtInIds.has(path.basename(dir)),
      dir,
      cover: fs.existsSync(cover) ? cover : null,
    };
  };
  return [...builtIns.filter((d) => !ownIds.has(path.basename(d))).map((d) => entry(d, true)), ...own.map((d) => entry(d, false))].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** A style folder by path or id (the user's copy first, then the built-in), or null. */
export function findStyle(workspace, idOrPath) {
  if (!idOrPath) return null;
  if (fs.existsSync(path.join(path.resolve(idOrPath), "style.json"))) return path.resolve(idOrPath);
  if (!ID_RE.test(idOrPath)) return null;
  for (const root of [workspace ? userVisualDir(workspace) : null, BUILTIN_VISUAL_DIR].filter(Boolean)) {
    const dir = path.join(root, idOrPath);
    if (fs.existsSync(path.join(dir, "style.json"))) return dir;
  }
  return null;
}

/** Check a style folder against the format. Returns { ok, problems: [plain sentences] }. */
export function checkStyle(dir) {
  const problems = [];
  const id = path.basename(dir);
  if (!ID_RE.test(id)) problems.push(`the folder name "${id}" must be lowercase letters, digits and dashes`);
  if (id === "new") problems.push('"new" is reserved (the Catalog page uses /catalog/new): pick another id');
  for (const f of ["STYLE.md", "style.json", path.join("scenes", "index.tsx")]) if (!fs.existsSync(path.join(dir, f))) problems.push(`${f} is missing`);

  const md = path.join(dir, "STYLE.md");
  if (fs.existsSync(md)) {
    const text = fs.readFileSync(md, "utf8");
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
    if (!fm) problems.push("STYLE.md has no front matter (--- name / description ---)");
    else {
      if (!new RegExp(`^name:\\s*style-${id}\\s*$`, "m").test(fm[1])) problems.push(`STYLE.md front matter needs "name: style-${id}"`);
      if (!/^description:\s*\S/m.test(fm[1])) problems.push("STYLE.md front matter needs a description");
    }
    for (const s of SECTIONS) {
      const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`^#{2,3}\\s*(?:\\d+\\.?\\s*)?${esc}`, "im").test(text)) problems.push(`STYLE.md has no "${s}" section`);
    }
  }

  const sj = path.join(dir, "style.json");
  if (fs.existsSync(sj)) {
    let s;
    try {
      s = readJson(sj);
    } catch (e) {
      problems.push(`style.json isn't valid JSON (${e.message})`);
    }
    if (s) {
      const num = (v) => typeof v === "number" && Number.isFinite(v);
      if (s.id !== id) problems.push(`style.json "id" is "${s.id}", the folder is "${id}"`);
      if (!s.name) problems.push('style.json needs a "name"');
      if (s.kind !== "visual") problems.push('style.json "kind" must be "visual"');
      if (!Number.isInteger(s.version) || s.version < 1) problems.push('style.json "version" must be a whole number from 1');
      if (!STATUSES.includes(s.status)) problems.push(`style.json "status" must be one of ${STATUSES.join(", ")}`);
      if (!s.summary) problems.push('style.json needs a one-line "summary"');
      if (!num(s.frame?.width) || !num(s.frame?.height)) problems.push('style.json "frame" needs a width and height');
      if (!Array.isArray(s.palette) || !s.palette.length) problems.push('style.json needs a "palette"');
      else {
        for (const p of s.palette) if (!p.role || !HEX_RE.test(p.hex ?? "")) problems.push(`palette entry ${JSON.stringify(p)} needs a role and a #rrggbb hex`);
        for (const role of ["background", "text"]) if (!s.palette.some((p) => p.role === role)) problems.push(`the palette has no "${role}" role`);
      }
      // display and body are required; any other slot (mono, condensed, serif…) is checked the same way
      for (const slot of new Set(["display", "body", ...Object.keys(s.fonts ?? {})])) {
        const f = s.fonts?.[slot];
        if (!f) {
          problems.push(`style.json "fonts.${slot}" is missing`);
          continue;
        }
        if (!f.family) problems.push(`fonts.${slot} needs a "family"`);
        if (!FONT_SOURCES.includes(f.source)) problems.push(`fonts.${slot}.source must be one of ${FONT_SOURCES.join(", ")}`);
        if (f.source === "google" && f.family && !fs.existsSync(path.join(GOOGLE_FONTS, `${f.family.replace(/\s+/g, "")}.mjs`)))
          problems.push(`fonts.${slot}: "${f.family}" isn't in the installed Google Fonts package`);
        if (f.source === "file" && !(f.file && fs.existsSync(path.join(dir, "fonts", f.file)))) problems.push(`fonts.${slot}: the font file "${f.file ?? ""}" isn't in fonts/`);
      }
      for (const k of ["display", "body", "min"]) if (!num(s.type?.[k])) problems.push(`style.json "type.${k}" must be a number (px)`);
      if (!num(s.layout?.margin) || !num(s.layout?.safe?.top) || !num(s.layout?.safe?.bottom)) problems.push('style.json "layout" needs margin and safe.top / safe.bottom');
      const recipes = s.motion?.recipes;
      if (!recipes || typeof recipes !== "object" || !Object.keys(recipes).length) problems.push('style.json "motion.recipes" needs at least one named move');
      else
        for (const [name, r] of Object.entries(recipes)) {
          if (r.kind === "spring") {
            if (!num(r.damping) || !num(r.stiffness) || !num(r.mass)) problems.push(`motion recipe "${name}": a spring needs damping, stiffness and mass`);
          } else if (r.kind === "ease") {
            if (!num(r.duration)) problems.push(`motion recipe "${name}": an ease needs a duration (s)`);
            if (!(CURVE_NAMES.includes(r.curve) || (Array.isArray(r.curve) && r.curve.length === 4 && r.curve.every(num))))
              problems.push(`motion recipe "${name}": curve must be one of ${CURVE_NAMES.join(", ")} or [x1, y1, x2, y2]`);
          } else problems.push(`motion recipe "${name}": kind must be "spring" or "ease"`);
        }
      if (!num(s.finish?.grain) || !num(s.finish?.vignette)) problems.push('style.json "finish" needs grain and vignette (0 = none)');
      if (!Array.isArray(s.banned) || !s.banned.length) problems.push('style.json needs a "banned" list');
      if (!Array.isArray(s.sources) || !s.sources.length) problems.push('style.json needs its "sources"');
    }
  }
  return { ok: problems.length === 0, problems };
}

/** The usual order of preview stills; any others follow alphabetically. */
const STILL_ORDER = ["title", "headline", "diagram", "number", "list", "end"];

/** A style's preview still ids in showing order (from preview/<id>.jpg; cover and sheet aren't stills). */
export function stillsOf(dir) {
  const p = path.join(dir, "preview");
  if (!fs.existsSync(p)) return [];
  const ids = fs
    .readdirSync(p)
    .filter((f) => /^[a-z0-9-]+\.jpg$/.test(f) && f !== "cover.jpg" && f !== "sheet.jpg")
    .map((f) => f.slice(0, -4));
  const rank = (id) => (STILL_ORDER.includes(id) ? STILL_ORDER.indexOf(id) : STILL_ORDER.length);
  return ids.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/**
 * The user's own copy of a style, in <workspace>/catalog/visual/.
 *  - same id (no `newId`): an editable copy of a built-in, which then takes the built-in's place;
 *  - `newId` ("auto" picks <id>-copy, <id>-copy-2…): a new style.
 * The copy's style.json and STYLE.md get the new id; a copy of a built-in becomes "approved" (it's the user's now).
 * Returns the new folder.
 */
export function copyStyle(workspace, id, newId) {
  const src = findStyle(workspace, id);
  if (!src) throw new Error(`There's no style "${id}".`);
  const root = userVisualDir(workspace);
  let target = newId;
  if (newId === "auto") {
    target = `${id}-copy`;
    for (let i = 2; fs.existsSync(path.join(root, target)) || fs.existsSync(path.join(BUILTIN_VISUAL_DIR, target)); i++) target = `${id}-copy-${i}`;
  }
  target = target || id;
  if (!ID_RE.test(target)) throw new Error(`"${target}" isn't a valid style id: lowercase letters, digits and dashes.`);
  const dest = path.join(root, target);
  if (fs.existsSync(dest)) throw new Error(target === id ? `You already have your own copy of "${id}".` : `A style called "${target}" already exists.`);
  if (target !== id && fs.existsSync(path.join(BUILTIN_VISUAL_DIR, target))) throw new Error(`"${target}" is the id of a built-in style; pick another.`);
  fs.mkdirSync(root, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  const sj = path.join(dest, "style.json");
  const s = readJson(sj);
  const wasBuiltIn = s.status === "built-in";
  s.id = target;
  if (target !== id) s.name = `${s.name} (copy)`;
  if (wasBuiltIn) s.status = "approved";
  fs.writeFileSync(sj, JSON.stringify(s, null, 2) + "\n");
  const md = path.join(dest, "STYLE.md");
  if (fs.existsSync(md)) {
    const day = new Date().toISOString().slice(0, 10);
    let text = fs.readFileSync(md, "utf8").replace(/^name:\s*style-[a-z0-9-]+\s*$/m, `name: style-${target}`);
    text = `${text.replace(/\s*$/, "")}\n- ${target === id ? "The user's own copy of the built-in style" : `Copied from "${id}"`} on ${day}.\n`;
    fs.writeFileSync(md, text);
  }
  return dest;
}

/** Set a user style's status (approved | experimental). Built-in styles are read-only. */
export function setStyleStatus(workspace, id, status) {
  if (!["approved", "experimental"].includes(status)) throw new Error(`Unknown status "${status}".`);
  const dir = findStyle(workspace, id);
  if (!dir) throw new Error(`There's no style "${id}".`);
  if (!workspace || path.dirname(dir) !== userVisualDir(workspace)) throw new Error("Built-in styles can't be changed: make your own copy first.");
  const sj = path.join(dir, "style.json");
  const s = readJson(sj);
  s.status = status;
  fs.writeFileSync(sj, JSON.stringify(s, null, 2) + "\n");
  return s;
}

/**
 * Give a video project its own copy of a style, replacing an earlier one (the catalog can change later without
 * changing the video):
 *   src/style/                          STYLE.md, style.json, scenes/ (they import ../../kit and ../style.json)
 *   src/kit/, src/sample.json           the catalog kit the scenes need
 *   public/style/fonts/                 the style's font files (staticFile("style/fonts/…"))
 *   brief/style-cover.jpg               the cover the Brief board shows
 *   .claude/skills/style-<id>/SKILL.md  STYLE.md as a skill, so the video's Claude reads it
 *   project.json → style                {id, name, version, builtIn, locked, applied}
 * The video's style.md (its own notes, the board's Look text) is Claude's to write from STYLE.md (make-video skill).
 */
export function applyStyle(projectDir, workspace, id, { locked = false } = {}) {
  if (!ID_RE.test(String(id))) throw new Error(`"${id}" isn't a style id.`);
  const styleDir = findStyle(workspace, id);
  if (!styleDir) throw new Error(`There's no style "${id}" in the catalog.`);
  const manifestFile = path.join(projectDir, "project.json");
  if (!fs.existsSync(manifestFile)) throw new Error(`${projectDir} isn't a video project (no project.json).`);
  const check = checkStyle(styleDir);
  if (!check.ok) throw new Error(`The style "${id}" has problems, so it wasn't used:\n- ${check.problems.join("\n- ")}`);
  const s = readJson(path.join(styleDir, "style.json"));

  const src = path.join(projectDir, "src");
  for (const d of [path.join(src, "style"), path.join(src, "kit"), path.join(projectDir, "public", "style")]) fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(path.join(src, "style"), { recursive: true });
  for (const f of ["STYLE.md", "style.json"]) fs.copyFileSync(path.join(styleDir, f), path.join(src, "style", f));
  fs.cpSync(path.join(styleDir, "scenes"), path.join(src, "style", "scenes"), { recursive: true });
  fs.cpSync(path.join(CATALOG_DIR, "kit"), path.join(src, "kit"), { recursive: true });
  fs.copyFileSync(path.join(CATALOG_DIR, "sample.json"), path.join(src, "sample.json"));
  if (fs.existsSync(path.join(styleDir, "fonts"))) fs.cpSync(path.join(styleDir, "fonts"), path.join(projectDir, "public", "style", "fonts"), { recursive: true });

  const cover = path.join(styleDir, "preview", "cover.jpg");
  const boardCover = path.join(projectDir, "brief", "style-cover.jpg");
  fs.mkdirSync(path.dirname(boardCover), { recursive: true });
  if (fs.existsSync(cover)) fs.copyFileSync(cover, boardCover);
  else fs.rmSync(boardCover, { force: true });

  const skills = path.join(projectDir, ".claude", "skills");
  if (fs.existsSync(skills)) for (const d of fs.readdirSync(skills)) if (d.startsWith("style-")) fs.rmSync(path.join(skills, d), { recursive: true, force: true });
  fs.mkdirSync(path.join(skills, `style-${id}`), { recursive: true });
  fs.copyFileSync(path.join(styleDir, "STYLE.md"), path.join(skills, `style-${id}`, "SKILL.md"));

  const manifest = readJson(manifestFile);
  manifest.style = { id, name: s.name, version: s.version, builtIn: path.dirname(styleDir) === BUILTIN_VISUAL_DIR, locked: !!locked, applied: new Date().toISOString() };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  return manifest.style;
}

/**
 * The style a channel's next video starts with: the channel's own when its look is locked; otherwise the style of the
 * channel's most recent video that has one (if that style still exists); otherwise the channel's own; otherwise none.
 * `projects` is listProjects(workspace) (newest first).
 */
export function styleForChannel(workspace, channel, projects) {
  if (!channel) return null;
  const exists = (id) => !!id && !!findStyle(workspace, id);
  if (channel.locked) return exists(channel.style) ? channel.style : null;
  for (const p of projects) {
    if (!p.engine) continue;
    const m = (() => {
      try {
        return readJson(path.join(p.dir, "project.json"));
      } catch {
        return null;
      }
    })();
    if (m?.channel === channel.id && exists(m.style?.id)) return m.style.id;
  }
  return exists(channel.style) ? channel.style : null;
}

/** The hidden preview project in the workspace, made or refreshed from library/catalog/preview. */
export function ensurePreviewProject(workspace) {
  if (!workspace || !fs.existsSync(workspace)) throw new Error(`The workspace doesn't exist: ${workspace || "(none set)"}`);
  const dir = path.join(workspace, "catalog", "_preview");
  // the engine's files are copied every time, so an engine update reaches the preview project
  for (const f of ["package.json", "tsconfig.json", "render.mjs", path.join("src", "Root.tsx"), path.join("src", "index.ts")]) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.copyFileSync(path.join(PREVIEW_SOURCE, f), path.join(dir, f));
  }
  fs.mkdirSync(path.join(dir, "public"), { recursive: true });
  linkProject(dir);
  return dir;
}

/**
 * Render a style's preview stills into its preview/ folder: <sample>.jpg, cover.jpg (the first sample) and sheet.jpg
 * (all of them side by side). Nothing paid is called. Returns { stills, cover, sheet }.
 */
export function previewStyle(styleDir, workspace, { scale = 0.5 } = {}) {
  const check = checkStyle(styleDir);
  if (!check.ok) throw new Error(`The style has problems:\n- ${check.problems.join("\n- ")}`);
  const proj = ensurePreviewProject(workspace);
  const src = path.join(proj, "src");
  // the style, the kit and the sample content go where the scenes import them from: src/style, src/kit, src/sample.json
  for (const d of [path.join(src, "style"), path.join(src, "kit"), path.join(proj, "public", "style")]) fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(path.join(src, "style"), { recursive: true });
  fs.copyFileSync(path.join(styleDir, "style.json"), path.join(src, "style", "style.json"));
  fs.cpSync(path.join(styleDir, "scenes"), path.join(src, "style", "scenes"), { recursive: true });
  fs.cpSync(path.join(CATALOG_DIR, "kit"), path.join(src, "kit"), { recursive: true });
  fs.copyFileSync(path.join(CATALOG_DIR, "sample.json"), path.join(src, "sample.json"));
  if (fs.existsSync(path.join(styleDir, "fonts"))) fs.cpSync(path.join(styleDir, "fonts"), path.join(proj, "public", "style", "fonts"), { recursive: true });
  // copies keep their old file times, and webpack's cache would then reuse the previous style's bundle: mark them new
  const now = new Date();
  for (const f of fs.readdirSync(src, { recursive: true, withFileTypes: true })) if (f.isFile()) fs.utimesSync(path.join(f.parentPath, f.name), now, now);

  const r = spawnSync(process.execPath, ["render.mjs", "--scale", String(scale)], { cwd: proj, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const lastLine = (r.stdout ?? "").trim().split(/\r?\n/).pop() ?? "";
  if (r.status !== 0 || !lastLine.startsWith("{")) {
    const log = `${r.stderr ?? ""}\n${r.stdout ?? ""}`.trim().split(/\r?\n/).slice(-30).join("\n");
    throw new Error(`The preview render failed:\n${log}`);
  }
  const { stills } = JSON.parse(lastLine);
  const out = path.join(styleDir, "preview");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const files = stills.map((s) => {
    const f = path.join(out, `${s.id}.jpg`);
    fs.copyFileSync(s.file, f);
    return f;
  });
  const cover = path.join(out, "cover.jpg");
  fs.copyFileSync(files[0], cover);

  // sheet.jpg: every still in sample order, numbered input for ffmpeg's tile filter
  let sheet = null;
  const tmp = path.join(proj, "out", "sheet");
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  files.forEach((f, i) => fs.copyFileSync(f, path.join(tmp, `f_${String(i).padStart(3, "0")}.jpg`)));
  const cols = files.length <= 6 ? files.length : 4;
  const rows = Math.ceil(files.length / cols);
  try {
    execFileSync(
      "ffmpeg",
      ["-y", "-loglevel", "error", "-framerate", "1", "-i", path.join(tmp, "f_%03d.jpg"), "-vf", `scale=360:-1,tile=${cols}x${rows}:padding=12:margin=12:color=0x1a1a1a`, "-frames:v", "1", "-q:v", "3", path.join(out, "sheet.jpg")],
      { stdio: "pipe" },
    );
    sheet = path.join(out, "sheet.jpg");
  } catch {
    // no ffmpeg: the stills are enough
  }
  return { stills: files, cover, sheet };
}
