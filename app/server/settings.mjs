/**
 * The Settings page's data: engine paths (checked), and publishing defaults used for every new video's drafts.
 * Everything is stored in content-engine/settings.json; nothing here needs the user to open a file.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadSettings, saveSettings } from "../../cli/projects.mjs";

const str = (v, max = 2000) => String(v ?? "").trim().slice(0, max);
const oneOf = (v, list, fallback) => (list.includes(v) ? v : fallback);

export const PUBLISH_DEFAULTS = {
  facebookPage: "",
  instagramAccount: "",
  captionFooter: "",
  youtube: { privacy: "private", categoryId: "27", madeForKids: null, tags: [], descriptionFooter: "" },
  chromeCheck: null,
};

export function publishDefaults() {
  // facebookFormat/instagramFormat: older settings; Reel or post is now chosen on the Publish page each time
  const { facebookFormat: _f, instagramFormat: _i, ...p } = loadSettings().publish ?? {};
  return { ...PUBLISH_DEFAULTS, ...p, youtube: { ...PUBLISH_DEFAULTS.youtube, ...(p.youtube ?? {}) } };
}

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { timeout: 15000, windowsHide: true }, (err, out, errOut) => resolve(err ? null : String(out || errOut).trim()));
  });

/** A tool check, remembered for a minute: starting python/ffmpeg takes seconds on Windows, and every save shows the checks. */
const checked = new Map(); // "cmd args" -> { at, result: Promise }
const check = (cmd, args) => {
  const key = `${cmd} ${args.join(" ")}`;
  const c = checked.get(key);
  if (c && Date.now() - c.at < 60_000) return c.result;
  const result = run(cmd, args);
  checked.set(key, { at: Date.now(), result });
  return result;
};

/** Settings plus live checks of the tool paths. */
export async function settingsView() {
  const s = loadSettings();
  const [py, ffmpeg] = await Promise.all([check(s.python || "python", ["--version"]), check("ffmpeg", ["-version"])]);
  return {
    workspace: s.workspace,
    blender: s.blender,
    python: s.python,
    checks: {
      workspace: !!s.workspace && fs.existsSync(s.workspace) && fs.statSync(s.workspace).isDirectory(),
      blender: !!s.blender && fs.existsSync(s.blender),
      python: py,
      ffmpeg: ffmpeg ? ffmpeg.split("\n")[0].slice(0, 60) : null,
    },
    publish: publishDefaults(),
  };
}

/** Apply a partial update from the Settings page. Throws a readable error for anything invalid. */
export function updateSettings(body) {
  const patch = {};
  if ("workspace" in body) {
    const ws = str(body.workspace);
    if (!ws || !fs.existsSync(ws) || !fs.statSync(ws).isDirectory()) throw new Error(`That folder doesn't exist: ${ws || "(empty)"}`);
    patch.workspace = path.resolve(ws);
  }
  if ("blender" in body) {
    const b = str(body.blender);
    if (!/\.exe$/i.test(b) || !fs.existsSync(b)) throw new Error(`blender.exe wasn't found at ${b || "(empty)"}`);
    patch.blender = b;
  }
  if ("python" in body) {
    const p = str(body.python);
    if (!p) throw new Error("Python can't be empty (use python, or the full path to python.exe).");
    patch.python = p;
  }
  if (body.publish && typeof body.publish === "object") {
    const cur = publishDefaults();
    const b = body.publish;
    const yt = b.youtube && typeof b.youtube === "object" ? b.youtube : {};
    let page = "facebookPage" in b ? str(b.facebookPage, 300) : cur.facebookPage;
    if (page && !/^https?:\/\/(www\.|m\.|web\.)?facebook\.com\//i.test(page)) {
      if (/^[\w.]+$/.test(page)) page = `https://www.facebook.com/${page}`;
      else throw new Error("The Facebook Page should be a link like https://www.facebook.com/yourpage");
    }
    let ig = "instagramAccount" in b ? str(b.instagramAccount, 60) : cur.instagramAccount;
    if (ig && !ig.startsWith("@")) ig = "@" + ig.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
    if (ig && !/^@[\w.]{1,30}$/.test(ig)) throw new Error("The Instagram account should be a handle like @yourhandle");
    patch.publish = {
      ...cur,
      facebookPage: page,
      instagramAccount: ig,
      captionFooter: "captionFooter" in b ? str(b.captionFooter, 500) : cur.captionFooter,
      youtube: {
        privacy: oneOf(yt.privacy ?? cur.youtube.privacy, ["private", "unlisted", "public"], "private"),
        categoryId: /^\d{1,3}$/.test(String(yt.categoryId ?? "")) ? String(yt.categoryId) : cur.youtube.categoryId,
        madeForKids: "madeForKids" in yt ? (yt.madeForKids === null ? null : !!yt.madeForKids) : cur.youtube.madeForKids,
        tags: Array.isArray(yt.tags) ? yt.tags.map((t) => str(t, 60)).filter(Boolean).slice(0, 30) : cur.youtube.tags,
        descriptionFooter: "descriptionFooter" in yt ? str(yt.descriptionFooter, 1500) : cur.youtube.descriptionFooter,
      },
    };
  }
  saveSettings(patch);
  return patch;
}

/** Claude's report from "Check Chrome" (MCP chrome_check_report). */
export function saveChromeCheck(r) {
  const cur = publishDefaults();
  saveSettings({ publish: { ...cur, chromeCheck: { at: new Date().toISOString(), ...r } } });
}
