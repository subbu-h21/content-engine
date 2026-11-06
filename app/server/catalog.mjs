/**
 * The Catalog page's server side. The styles themselves are read by cli/catalog.mjs; this adds what the website needs:
 *  - the catalog's own Claude folder, <workspace>/catalog: CLAUDE.md and the catalog skills copied from the engine,
 *    the .ce-catalog marker and the prompt hook (it tells Claude what the page shows)
 *  - style details and preview images for the page; duplicate, approve, delete (to the Recycle Bin), font uploads
 *  - drafts for new styles: <workspace>/catalog/drafts/<draft-id>/ with the user's files, links and note; Claude makes
 *    the style from them and writes result.json
 */
import fs from "node:fs";
import path from "node:path";
import { BUILTIN_VISUAL_DIR, CATALOG_DIR, checkStyle, copyStyle, findStyle, listStyles, setStyleStatus, stillsOf, userVisualDir } from "../../cli/catalog.mjs";
import { ensureCatalogIntegration } from "./integration.mjs";
import { recycle } from "./remove.mjs";

/** The catalog chat's name in the chat routes (never a project name: those are project-<n>-<slug>). */
export const CATALOG_CHAT = "_catalog";
const DRAFT_RE = /^draft-\d{8}-\d{6}$/;
const FONT_RE = /\.(ttf|otf|woff2?)$/i;

const readJson = (f, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const safeName = (n) => path.basename(String(n)).replace(/[^\w.\- ()]+/g, "_").slice(0, 120) || "file";
const needWorkspace = (ws) => {
  if (!ws || !fs.existsSync(ws)) throw new Error("Set the workspace in Settings first: the catalog lives there.");
};

export const catalogDir = (ws) => path.join(ws, "catalog");

/** Make the catalog folder ready for its Claude (safe to repeat; the engine's files are refreshed every time). */
export function ensureCatalogFolder(ws) {
  needWorkspace(ws);
  const dir = catalogDir(ws);
  for (const d of ["visual", "drafts"]) fs.mkdirSync(path.join(dir, d), { recursive: true });
  for (const skill of ["make-style", "visual-taste"]) {
    const to = path.join(dir, ".claude", "skills", skill);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(path.join(CATALOG_DIR, "skills", skill), to, { recursive: true });
  }
  fs.copyFileSync(path.join(CATALOG_DIR, "CATALOG-CLAUDE.md"), path.join(dir, "CLAUDE.md"));
  fs.writeFileSync(path.join(dir, ".ce-catalog"), "This folder is the content engine's style catalog.\n");
  ensureCatalogIntegration(dir);
  return dir;
}

const isOwn = (ws, dir) => !!ws && path.dirname(dir) === userVisualDir(ws);

/** A style folder by id from the page. Ids are checked before the lookup, because findStyle also accepts paths. */
const styleDir = (ws, id) => (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(id)) ? findStyle(ws, id) : null);

/** When the style's previews were last rendered (ms), so the page's image links change after a re-render. */
const previewStamp = (dir) => {
  for (const f of ["sheet.jpg", "cover.jpg"]) {
    try {
      return Math.round(fs.statSync(path.join(dir, "preview", f)).mtimeMs);
    } catch {
      // try the next one
    }
  }
  return 0;
};

/** The gallery: every style, with its preview stills' ids. */
export function catalogList(ws) {
  return listStyles(ws).map(({ dir, cover, ...s }) => ({ ...s, stills: stillsOf(dir), cover: !!cover, stamp: previewStamp(dir) }));
}

/** Everything the style page shows. */
export function styleDetail(ws, id) {
  const dir = styleDir(ws, id);
  if (!dir) return null;
  const list = (sub, re) => (fs.existsSync(path.join(dir, sub)) ? fs.readdirSync(path.join(dir, sub)).filter((f) => !re || re.test(f)) : []);
  return {
    id,
    dir,
    builtIn: !isOwn(ws, dir),
    editedBuiltIn: isOwn(ws, dir) && fs.existsSync(path.join(BUILTIN_VISUAL_DIR, id)),
    style: readJson(path.join(dir, "style.json"), {}),
    md: fs.existsSync(path.join(dir, "STYLE.md")) ? fs.readFileSync(path.join(dir, "STYLE.md"), "utf8") : "",
    stills: stillsOf(dir),
    stamp: previewStamp(dir),
    sources: list("sources"),
    fonts: list("fonts", FONT_RE),
    check: checkStyle(dir),
  };
}

/** A preview image of a style (cover, sheet or a still), or null. */
export function previewFile(ws, id, file) {
  if (!/^[a-z0-9-]+\.jpg$/.test(file)) return null;
  const dir = styleDir(ws, id);
  const full = dir ? path.join(dir, "preview", file) : null;
  return full && fs.existsSync(full) ? full : null;
}

export function duplicateStyle(ws, id) {
  needWorkspace(ws);
  if (!styleDir(ws, id)) throw new Error(`There's no style "${id}".`);
  return path.basename(copyStyle(ws, id, "auto"));
}

export function approveStyle(ws, id) {
  if (!styleDir(ws, id)) throw new Error(`There's no style "${id}".`);
  return setStyleStatus(ws, id, "approved");
}

/** Move one of the user's styles to the Recycle Bin. An edited built-in goes back to the engine's version. */
export async function deleteStyle(ws, id) {
  const dir = styleDir(ws, id);
  if (!dir) throw new Error(`There's no style "${id}".`);
  if (!isOwn(ws, dir)) throw new Error("Built-in styles ship with the engine and can't be deleted.");
  await recycle(dir);
  return { deleted: id, builtInRemains: fs.existsSync(path.join(BUILTIN_VISUAL_DIR, id)) };
}

/** A font file the user uploads for one of their styles: into its fonts/ folder. */
export async function saveFont(ws, id, name, stream) {
  const dir = styleDir(ws, id);
  if (!dir) throw new Error(`There's no style "${id}".`);
  if (!isOwn(ws, dir)) throw new Error("Built-in styles are read-only: duplicate it, or ask Claude to make your own copy, then add the font there.");
  const base = safeName(name);
  if (!FONT_RE.test(base)) throw new Error("Font files are .ttf, .otf, .woff or .woff2.");
  const fonts = path.join(dir, "fonts");
  fs.mkdirSync(fonts, { recursive: true });
  await writeStream(path.join(fonts, base), stream);
  return { font: base };
}

const writeStream = (target, stream) =>
  new Promise((resolve, reject) => {
    const tmp = `${target}.part`;
    const out = fs.createWriteStream(tmp);
    stream.pipe(out);
    stream.on("error", reject);
    out.on("error", reject);
    out.on("finish", () => {
      fs.renameSync(tmp, target);
      resolve();
    });
  });

// ---- drafts: a new style from the user's files, links and note

const draftDir = (ws, draft) => {
  if (!DRAFT_RE.test(draft)) throw new Error("Unknown draft.");
  const dir = path.join(catalogDir(ws), "drafts", draft);
  if (!fs.existsSync(dir)) throw new Error("That draft doesn't exist any more.");
  return dir;
};

export function createDraft(ws) {
  ensureCatalogFolder(ws);
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  let id = `draft-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const root = path.join(catalogDir(ws), "drafts");
  // two drafts in one second: wait for the next free name
  for (let s = d.getSeconds() + 1; fs.existsSync(path.join(root, id)); s++) id = id.replace(/\d{2}$/, p(s % 60));
  fs.mkdirSync(path.join(root, id, "sources"), { recursive: true });
  fs.writeFileSync(path.join(root, id, "draft.json"), JSON.stringify({ created: d.toISOString(), links: [], note: "", started: null }, null, 2) + "\n");
  return id;
}

export function draftView(ws, draft) {
  const dir = draftDir(ws, draft);
  const meta = readJson(path.join(dir, "draft.json"), { links: [], note: "", started: null });
  const result = readJson(path.join(dir, "result.json"), null);
  const resultId = result && typeof result.id === "string" && styleDir(ws, result.id) ? result.id : null;
  return { id: draft, files: fs.readdirSync(path.join(dir, "sources")).filter((f) => !f.endsWith(".part")), links: meta.links ?? [], note: meta.note ?? "", started: meta.started ?? null, result: resultId };
}

export async function saveDraftUpload(ws, draft, name, stream) {
  const dir = path.join(draftDir(ws, draft), "sources");
  const base = safeName(name);
  let target = path.join(dir, base);
  for (let i = 2; fs.existsSync(target); i++) target = path.join(dir, base.replace(/(\.[^.]*)?$/, ` (${i})$1`));
  await writeStream(target, stream);
  return { file: path.basename(target) };
}

const updateDraft = (ws, draft, fn) => {
  const f = path.join(draftDir(ws, draft), "draft.json");
  const meta = readJson(f, { links: [], note: "", started: null });
  fn(meta);
  fs.writeFileSync(f, JSON.stringify(meta, null, 2) + "\n");
  return meta;
};

export function addDraftLink(ws, draft, url) {
  if (!/^https?:\/\/\S+$/i.test(url)) throw new Error("Paste a full link starting with http(s)://");
  updateDraft(ws, draft, (m) => (m.links = [...new Set([...(m.links ?? []), url])]));
  return draftView(ws, draft);
}

/** Record the note and build the message that asks the catalog's Claude to make the style. */
export function startDraft(ws, draft, note) {
  const v = draftView(ws, draft);
  if (!v.files.length && !v.links.length && !String(note ?? "").trim()) throw new Error("Add a file, a link or a description first.");
  updateDraft(ws, draft, (m) => {
    m.note = String(note ?? "").trim();
    m.started = new Date().toISOString();
  });
  const lines = [
    `[content engine] Please make a new catalog style from draft ${draft} (folder drafts/${draft}/), following the make-style skill.`,
    v.files.length ? `Files (in drafts/${draft}/sources/): ${v.files.join(", ")}.` : "No files.",
    v.links.length ? `Links: ${v.links.join(" ")}` : "No links.",
    String(note ?? "").trim() ? `The user's note: ${String(note).trim()}` : "No note.",
    `Save it in visual/<id>/ with status "experimental", copy the files into its sources/, render and look at the previews, then write drafts/${draft}/result.json as {"id": "<id>"} and tell me in two or three lines what you made.`,
  ];
  return lines.join("\n");
}

// ---- what the catalog's Claude is told with every message (the prompt hook asks /api/catalog/context)

let view = { page: "gallery" };

export function setView(v) {
  const page = ["gallery", "style", "draft"].includes(v?.page) ? v.page : "gallery";
  view = { page, id: typeof v?.id === "string" ? v.id.slice(0, 80) : undefined };
}

export function contextText(ws) {
  if (view.page === "style" && view.id) {
    const dir = ws ? styleDir(ws, view.id) : null;
    if (!dir) return `The user is on the Catalog page, looking at a style "${view.id}" that no longer exists.`;
    const s = readJson(path.join(dir, "style.json"), {});
    const own = isOwn(ws, dir);
    return `The user is on the Catalog page, looking at the style "${s.name ?? view.id}" (id ${view.id}, ${own ? "their own" : "built-in, read-only"}, status ${s.status ?? "?"}) at ${dir}. "This style" means this one.`;
  }
  if (view.page === "draft" && view.id) return `The user is on the Catalog page, preparing a new style in drafts/${view.id}/.`;
  return "The user is on the Catalog page, looking at the gallery of all styles.";
}
