/**
 * The Brief page's data: what the board shows (read live from the project's files), reference uploads and links,
 * and the background jobs that turn references into study material (pipeline step "refs").
 *
 * Board files (written by Claude during /make-video):
 *   brief/status.json  {stage: new|talking|awaiting-approval|building|preview-ready, note}
 *   brief.md  style.md  plan.md  script.json  project.json (voice, music)  brief/frames/*.png|jpg
 *   brief/hooks.json (the opening line options)
 *   references/<files>  references/_study/<file>/...   .claude/skills/<name>/SKILL.md
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readHooks } from "../../cli/packaging.mjs";
import { ENGINE_DIR, loadSettings } from "../../cli/projects.mjs";

const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null);
const readJson = (f, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const mtime = (f) => (fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0);
const WPS = 2.8; // narration pace, as in pipeline/vo.py (the phone reel measured 2.88)

/** Folders of a project the page may read files from. */
const SERVABLE = ["brief", "references", "audio", "out", "public", "review", "package"];

export function resolveServable(dir, rel) {
  const full = path.resolve(dir, rel);
  const ok = SERVABLE.some((p) => full.startsWith(path.join(dir, p) + path.sep));
  return ok && fs.existsSync(full) && fs.statSync(full).isFile() ? full : null;
}

const fileUrl = (name, rel) => `/api/projects/${encodeURIComponent(name)}/file?path=${encodeURIComponent(rel.replace(/\\/g, "/"))}`;

/** name -> [{id, kind, label, status, error, started}] */
const jobs = new Map();
const jobList = (name) => {
  if (!jobs.has(name)) jobs.set(name, []);
  return jobs.get(name);
};
let jobSeq = 0;

function runJob(name, kind, label, cmd, args, opts = {}) {
  const job = { id: ++jobSeq, kind, label, status: "running", error: null, started: Date.now() };
  const list = jobList(name);
  list.push(job);
  if (list.length > 30) list.shift();
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { windowsHide: true, ...opts });
    let log = "";
    p.stdout?.on("data", (d) => (log += d));
    p.stderr?.on("data", (d) => (log += d));
    p.on("error", (e) => {
      job.status = "error";
      job.error = e.message;
      resolve(job);
    });
    p.on("exit", (code) => {
      job.status = code === 0 ? "done" : "error";
      if (code !== 0) job.error = log.slice(-600) || `exit ${code}`;
      resolve(job);
    });
  });
}

/** Study material for new references; one run at a time per project, later requests queue behind it. */
const studyQueue = new Map();
export function studyReferences(name, dir) {
  const prev = studyQueue.get(name) ?? Promise.resolve();
  const next = prev.then(() =>
    runJob(name, "study", "Studying references (stills, cuts, colours, transcript)", loadSettings().python || "python", [path.join(ENGINE_DIR, "pipeline", "run.py"), dir, "refs"], { env: { ...process.env, PYTHONUTF8: "1" } }),
  );
  studyQueue.set(name, next);
  return next;
}

export async function downloadLink(name, dir, url) {
  if (!/^https?:\/\//i.test(url)) throw new Error("paste a full link starting with http(s)://");
  const refs = path.join(dir, "references");
  fs.mkdirSync(refs, { recursive: true });
  const job = await runJob(name, "download", `Downloading ${url}`, "yt-dlp", ["--no-playlist", "--restrict-filenames", "-f", "mp4/bestvideo*+bestaudio/best", "--merge-output-format", "mp4", "-o", path.join(refs, "%(title).70s.%(ext)s"), url]);
  if (job.status === "done") studyReferences(name, dir);
  return job;
}

const safeName = (n) => path.basename(String(n)).replace(/[^\w.\- ()]+/g, "_").slice(0, 120) || "file";

/** Save an upload (a stream). A .md file with a `name:` in its front matter becomes a project skill. */
export async function saveUpload(name, dir, fileName, stream) {
  const base = safeName(fileName);
  const tmp = path.join(dir, "_tmp", "upload_" + Date.now() + "_" + base);
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(tmp);
    stream.pipe(out);
    stream.on("error", reject);
    out.on("error", reject);
    out.on("finish", resolve);
  });
  if (/\.md$/i.test(base)) {
    const text = fs.readFileSync(tmp, "utf8");
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
    const skill = fm && /^name:\s*["']?([\w-]+)["']?\s*$/m.exec(fm[1]);
    if (skill) {
      const target = path.join(dir, ".claude", "skills", skill[1], "SKILL.md");
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.renameSync(tmp, target);
      return { kind: "skill", name: skill[1], path: path.relative(dir, target) };
    }
  }
  const refs = path.join(dir, "references");
  fs.mkdirSync(refs, { recursive: true });
  let target = path.join(refs, base);
  for (let i = 2; fs.existsSync(target); i++) target = path.join(refs, base.replace(/(\.[^.]*)?$/, ` (${i})$1`));
  fs.renameSync(tmp, target);
  studyReferences(name, dir);
  return { kind: "reference", name: path.basename(target), path: path.relative(dir, target) };
}

const TEMPLATE_VOICE = readJson(path.join(ENGINE_DIR, "template", "project.json"), {}).voice ?? {};
const isTemplateVoice = (v) => !!v && v.voice === TEMPLATE_VOICE.voice && v.style === TEMPLATE_VOICE.style;

/** The video's catalog style and channel (project.json → style, channel), with the cover the board shows. */
function lookOf(name, dir, manifest) {
  const channel = (loadSettings().channels ?? []).find((c) => c.id === manifest.channel) ?? null;
  const s = manifest.style;
  const cover = path.join(dir, "brief", "style-cover.jpg");
  return {
    style: s?.id ? { id: s.id, name: s.name ?? s.id, locked: !!s.locked, builtIn: !!s.builtIn, cover: fs.existsSync(cover) ? fileUrl(name, "brief/style-cover.jpg") + `&v=${Math.round(mtime(cover))}` : null } : null,
    channel: channel ? { id: channel.id, name: channel.name, locked: !!channel.locked } : manifest.channel ? { id: manifest.channel, name: manifest.channel, locked: false } : null,
  };
}

/** Everything the board shows. */
export function briefData(name, dir) {
  const status = readJson(path.join(dir, "brief", "status.json"), { stage: "none" });
  const manifest = readJson(path.join(dir, "project.json"), {});
  const script = readJson(path.join(dir, "script.json"), { scenes: [] });
  const timing = readJson(path.join(dir, "src", "data", "timing.json"), null);

  // a new project's script.json is the template's placeholder until Claude writes the real one
  const scenes = (script.placeholder ? [] : (script.scenes ?? [])).map((s) => {
    const t = timing?.scenes?.[s.id];
    return {
      id: s.id,
      title: s.title ?? s.id,
      lines: (s.cues ?? []).map((c) => {
        const words = String(c.text ?? "").split(/\s+/).filter(Boolean).length;
        const real = t?.cues?.[c.id];
        return { id: c.id, text: c.text, estimate: Number((words / WPS).toFixed(1)), seconds: real ? Number((real.end - real.start).toFixed(1)) : null, pause: c.pause ?? 0 };
      }),
    };
  });
  const words = scenes.flatMap((s) => s.lines).reduce((n, l) => n + l.text.split(/\s+/).filter(Boolean).length, 0);

  const framesDir = path.join(dir, "brief", "frames");
  const frames = fs.existsSync(framesDir)
    ? fs.readdirSync(framesDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort().map((f) => ({ name: f, url: fileUrl(name, `brief/frames/${f}`) + `&v=${Math.round(mtime(path.join(framesDir, f)))}` }))
    : [];

  const refsDir = path.join(dir, "references");
  const references = fs.existsSync(refsDir)
    ? fs.readdirSync(refsDir, { withFileTypes: true })
        .filter((d) => d.isFile() && !d.name.startsWith("."))
        .map((d) => {
          const study = path.join(refsDir, "_study", d.name);
          const info = readJson(path.join(study, "info.json"), null);
          const contact = fs.existsSync(path.join(study, "contact.jpg")) ? fileUrl(name, `references/_study/${d.name}/contact.jpg`) : null;
          const image = /\.(png|jpe?g|webp|gif)$/i.test(d.name) ? fileUrl(name, `references/${d.name}`) : null;
          const transcript = read(path.join(study, "transcript.txt"));
          const palette = readJson(path.join(study, "palette.json"), []);
          return { file: d.name, kind: info?.kind ?? null, status: info?.status ?? "waiting", error: info?.error ?? null, duration: info?.duration ?? null, contact, image, palette, transcript: transcript ? transcript.split("\n").slice(0, 8).join("\n") : null };
        })
    : [];

  const skillsDir = path.join(dir, ".claude", "skills");
  const skills = fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];

  const audio = (rel) => (fs.existsSync(path.join(dir, rel)) ? fileUrl(name, rel) + `&v=${Math.round(mtime(path.join(dir, rel)))}` : null);

  return {
    status,
    title: manifest.title,
    format: manifest.format,
    brief: read(path.join(dir, "brief.md")),
    style: read(path.join(dir, "style.md")),
    plan: read(path.join(dir, "plan.md")),
    script: { scenes, words, estimate: Number((words / WPS).toFixed(0)), timingEstimated: !!timing?.estimated, total: timing && !timing.estimated ? timing.total : null },
    // isDefault: still the template's voice (not chosen yet, or chosen to stay the same)
    voice: { voice: manifest.voice?.voice, style: manifest.voice?.style, sample: audio("audio/voice_sample.wav"), isDefault: isTemplateVoice(manifest.voice) },
    music: { prompt: manifest.music?.prompt ?? "", track: audio("audio/music.mp3") },
    plates: (manifest.plates ?? []).map((p) => ({ id: p.id, from: p.from, to: p.to })),
    frames,
    references,
    // the engine's own skills aren't the user's files: make-video, packaging, the catalog's skills and the video's style
    skills: skills.filter((s) => !["make-video", "visual-taste", "make-style", "packaging"].includes(s) && !s.startsWith("style-")),
    hooks: readHooks(dir),
    look: lookOf(name, dir, manifest),
    jobs: jobList(name).slice(-8),
  };
}
