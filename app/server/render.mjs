/**
 * Final render queue (Phase 4). One heavy job at a time across all projects.
 *
 * A job is a list of steps run in order; each step is resumable or cheap to redo:
 *   audio    `pipeline audio`: timing, stems, sound effects, captions from the recorded lines (free)
 *   blender  one per 3D plate: only the missing final frames, in chunks, via the plate's shot script `final f0 f1`
 *   plates   `pipeline plates`: bloom + encode from the final frames
 *   render   Remotion render of "Reel" with props/final.json -> out/video.mp4 (written to a temp file, then swapped in)
 *   deliver  loudness-normalised upload file -> out/delivery.mp4, then a duration/audio check
 *
 * State lives in the project (out/render/job.json, logs in out/render/logs/), so a job survives the engine stopping
 * or the PC restarting: running/queued jobs come back as "interrupted" and continue with Resume.
 * When a step still fails after its retry, the failure is handed to the project's Claude panel (if the job allows it).
 */
import { execFile, execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ENGINE_DIR, listProjects, loadSettings } from "../../cli/projects.mjs";

const CHUNK = 200; // Blender frames per call: a crash loses at most one chunk, and Stop reacts per chunk
const BLENDER_SEC_PER_FRAME = 12; // first guess at 1080x1920, Eevee final (measured on the phone reel); refined live
const REMOTION_SEC_PER_FRAME = 0.2;
const MAX_AUTO_FIXES = 2;

const readJson = (f, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const writeJson = (f, o) => {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  const tmp = f + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(o, null, 1));
  fs.renameSync(tmp, f);
};
const now = () => new Date().toISOString();
const jobFile = (dir) => path.join(dir, "out", "render", "job.json");
const logDir = (dir) => path.join(dir, "out", "render", "logs");

// ------------------------------------------------------------------ project facts

function projectFacts(dir) {
  const manifest = readJson(path.join(dir, "project.json"), {});
  const timing = readJson(path.join(dir, "src", "data", "timing.json"), null);
  const fps = manifest.format?.fps ?? 24;
  return { manifest, timing, fps, width: manifest.format?.width ?? 1080, height: manifest.format?.height ?? 1920 };
}

const resolveIn = (dir, p) => (path.isAbsolute(p) ? p : path.join(dir, p));

/** Frames a plate needs: 1..N, as pipeline/plates.py expects (round(duration*fps)+1). */
function plateFrameCount(f, plate) {
  const sc = f.timing?.scenes ?? {};
  if (!sc[plate.from] || !sc[plate.to]) return null;
  const start = sc[plate.from].start;
  const end = sc[plate.to].start + sc[plate.to].duration;
  return Math.round((end - start) * f.fps) + 1;
}

/** Existing frame numbers in a folder of f_####.png / f_#####.png. */
function existingFrames(folder) {
  const out = new Map();
  if (!fs.existsSync(folder)) return out;
  for (const n of fs.readdirSync(folder)) {
    const m = /^f_(\d+)\.png$/.exec(n);
    if (m) out.set(Number(m[1]), path.join(folder, n));
  }
  return out;
}

/** A PNG that was fully written ends with the IEND chunk. */
function pngComplete(file) {
  try {
    const st = fs.statSync(file);
    if (st.size < 60) return false;
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, st.size - 12);
    fs.closeSync(fd);
    return buf.toString("latin1", 4, 8) === "IEND";
  } catch {
    return false;
  }
}

/** Fingerprint of everything a plate's frames depend on: shot script, Blender builders/assets, timing, plate, format. */
function plateFingerprint(dir, f, plate, shotFile) {
  const h = crypto.createHash("sha1");
  const add = (label, data) => h.update(label + "\0").update(data).update("\0");
  add("shot", fs.existsSync(shotFile) ? fs.readFileSync(shotFile) : "missing");
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name !== "__pycache__") walk(full);
      } else if (/\.py$/i.test(e.name)) add(full, fs.readFileSync(full));
      else {
        const st = fs.statSync(full);
        add(full, `${st.size}:${Math.round(st.mtimeMs)}`);
      }
    }
  };
  walk(path.join(dir, "blender", "lib"));
  walk(path.join(dir, "blender", "assets"));
  add("timing", fs.readFileSync(path.join(dir, "src", "data", "timing.json")));
  add("plate", JSON.stringify({ id: plate.id, from: plate.from, to: plate.to }));
  add("format", JSON.stringify(f.manifest.format ?? {}));
  return h.digest("hex").slice(0, 16);
}

const FP_FILE = ".ce-final.json";

function avgSize(files) {
  const sample = files.slice(-20);
  if (!sample.length) return null;
  return sample.reduce((s, p) => s + fs.statSync(p).size, 0) / sample.length;
}

function freeBytes(dir) {
  try {
    const s = fs.statfsSync(dir);
    return s.bavail * s.bsize;
  } catch {
    return null;
  }
}

/** What a final render of this project involves now. problems: block = can't start; warn = worth knowing. */
export function computePlan(dir) {
  const f = projectFacts(dir);
  const settings = loadSettings();
  const problems = [];
  const plates = [];
  if (!f.timing) problems.push({ level: "block", text: "There is no timing yet (src/data/timing.json): the video hasn't been built." });
  else if (f.timing.estimated) problems.push({ level: "block", text: "The narration isn't recorded yet (the timing is still estimated from word counts). Record the voice first." });
  const script = readJson(path.join(dir, "script.json"), null);
  if (script?.placeholder) problems.push({ level: "block", text: "The script is still the template's placeholder: the video hasn't been written yet." });
  else if (script?.scenes) {
    const unrecorded = script.scenes.flatMap((s) => (s.cues ?? []).filter((c) => !fs.existsSync(path.join(dir, "audio", "vo", `${s.id}__${c.id}.wav`))).map((c) => `${s.id}/${c.id}`));
    if (unrecorded.length)
      problems.push({ level: "block", text: `${unrecorded.length} script line(s) have no recorded voice (${unrecorded.slice(0, 3).join(", ")}${unrecorded.length > 3 ? ", …" : ""}). Record them first (costs a few cents).` });
  }
  const totalFrames = f.timing ? Math.round(f.timing.total * f.fps) : 0;
  let needBytes = 0;
  let estSeconds = 0;

  for (const plate of f.manifest.plates ?? []) {
    const folder = resolveIn(dir, plate.frames ?? `renders/${plate.id}/final`);
    const shot = path.join(dir, "blender", plate.shot ?? `shot_${plate.id}.py`);
    const need = f.timing ? plateFrameCount(f, plate) : null;
    const have = existingFrames(folder);
    const present = need ? [...have.keys()].filter((n) => n >= 1 && n <= need).length : have.size;
    const missing = need ? need - present : 0;
    const saved = readJson(path.join(folder, FP_FILE), null);
    let fingerprint = null;
    try {
      fingerprint = f.timing ? plateFingerprint(dir, f, plate, shot) : null;
    } catch {
      // unreadable inputs are reported below
    }
    let state = missing === 0 ? "complete" : present > 0 ? "partial" : "missing";
    const stale = !!(saved && fingerprint && saved.fingerprint !== fingerprint && present > 0);
    if (stale) state = "stale";
    const unknownOrigin = !saved && present > 0;
    const shotExists = fs.existsSync(shot);
    if (need == null && f.timing) problems.push({ level: "block", text: `3D plate "${plate.id}" refers to scenes that don't exist (${plate.from} → ${plate.to}).` });
    if (missing > 0 && !shotExists) problems.push({ level: "block", text: `3D plate "${plate.id}" needs ${missing} more final frames but its shot script ${path.relative(dir, shot)} is missing.` });
    if (stale) problems.push({ level: "warn", text: `3D plate "${plate.id}": the shot script, Blender files or narration timing changed after its ${present} final frames were rendered. Tick it to re-render (the old frames are deleted).`, plate: plate.id });
    if (unknownOrigin && missing > 0) problems.push({ level: "warn", text: `3D plate "${plate.id}" has ${present} final frames from before the engine tracked renders; the missing ${missing} will be added to them.` });
    const draftAvg = avgSize([...existingFrames(resolveIn(dir, plate.draftFrames ?? `renders/${plate.id}/draft`)).values()]);
    const perFrame = avgSize([...have.values()]) ?? (draftAvg ? draftAvg * 16 : f.width * f.height * 1.0);
    const secPer = saved?.secPerFrame ?? BLENDER_SEC_PER_FRAME * ((f.width * f.height) / (1080 * 1920));
    const toRender = stale ? need : missing;
    needBytes += toRender * perFrame + (need ?? 0) * f.width * f.height * 1.6; // frames + plates.py's temporary bloom PNGs
    estSeconds += toRender * secPer + (need ?? 0) * 0.15;
    plates.push({ id: plate.id, from: plate.from, to: plate.to, shot: path.relative(dir, shot), shotExists, folder, need, present, missing, state, stale, unknownOrigin, secPerFrame: secPer, estSeconds: Math.round(toRender * secPer) });
  }

  const needsBlender = plates.some((p) => p.missing > 0 || p.stale);
  if (needsBlender && !fs.existsSync(settings.blender)) problems.push({ level: "block", text: `Blender wasn't found at ${settings.blender} (engine settings.json → blender).` });
  needBytes += f.timing ? f.timing.total * 3e6 : 0; // video + delivery + temporary files
  estSeconds += totalFrames * REMOTION_SEC_PER_FRAME + 60;
  const free = freeBytes(dir);
  if (free != null && free < needBytes + 5e9)
    problems.push({ level: "block", text: `Not enough disk space: about ${Math.ceil((needBytes + 5e9) / 1e9)} GB needed, ${Math.floor(free / 1e9)} GB free on this drive.` });
  if (!fs.existsSync(path.join(dir, "node_modules", "@remotion", "cli"))) problems.push({ level: "block", text: "The project's link to the engine packages is broken (run: ce link)." });

  return { plates, problems, totalFrames, durationSeconds: f.timing?.total ?? 0, estSeconds: Math.round(estSeconds), needBytes: Math.round(needBytes), freeBytes: free };
}

// ------------------------------------------------------------------ jobs

/** name -> { dir, job, proc, live } for jobs known to this engine run */
const jobs = new Map();
const queue = []; // project names, in order
let active = null; // name of the running job
let hooks = { onFailure: null }; // set by the server: hand a failure to Claude

export function setRenderHooks(h) {
  hooks = { ...hooks, ...h };
}

function save(entry) {
  writeJson(jobFile(entry.dir), entry.job);
}

function buildSteps(plan, f) {
  const steps = [{ id: "audio", kind: "audio", label: "Sound check: timing, stems, effects, captions" }];
  for (const p of plan.plates) steps.push({ id: `blender:${p.id}`, kind: "blender", plate: p.id, label: `3D final frames: ${p.id}` });
  if (plan.plates.length) steps.push({ id: "plates", kind: "plates", label: "Encode the 3D plates (glow baked in)" });
  steps.push({ id: "render", kind: "render", label: "Render the video (final quality)" });
  steps.push({ id: "deliver", kind: "deliver", label: "Upload file: loudness-levelled, checked" });
  return steps.map((s) => ({ ...s, status: "pending", attempts: 0, progress: null, error: null, startedAt: null, endedAt: null, log: `out/render/logs/${s.id.replace(":", "_")}.log` }));
}

export function getJob(name, dir) {
  const e = jobs.get(name);
  if (e) return e.job;
  return readJson(jobFile(dir), null);
}

export function liveInfo(name) {
  const e = jobs.get(name);
  if (!e) return null;
  return { queuePosition: queue.indexOf(name) + 1 || null, active: active === name, ...e.live };
}

export function startJob(name, dir, { rerender = [], autoFix = true } = {}) {
  const cur = getJob(name, dir);
  if (cur && ["running", "queued"].includes(cur.status)) throw new Error("A final render of this video is already running or queued.");
  const plan = computePlan(dir);
  const blocks = plan.problems.filter((p) => p.level === "block");
  if (blocks.length) throw new Error(blocks.map((b) => b.text).join(" "));
  const f = projectFacts(dir);
  const job = {
    id: crypto.randomUUID().slice(0, 8),
    project: name,
    status: "queued",
    createdAt: now(),
    startedAt: null,
    endedAt: null,
    options: { rerender: rerender.filter((id) => plan.plates.some((p) => p.id === id)), autoFix: !!autoFix },
    autoFixUsed: 0,
    steps: buildSteps(plan, f),
    error: null,
    estimate: { seconds: plan.estSeconds, bytes: plan.needBytes },
    outputs: null,
  };
  const entry = { dir, job, proc: null, live: {} };
  jobs.set(name, entry);
  save(entry);
  queue.push(name);
  kick();
  return job;
}

export function resumeJob(name, dir, { autoFix } = {}) {
  let entry = jobs.get(name);
  if (!entry) {
    const job = readJson(jobFile(dir), null);
    if (!job) throw new Error("There is no render to resume; start one.");
    entry = { dir, job, proc: null, live: {} };
    jobs.set(name, entry);
  }
  const job = entry.job;
  if (!["failed", "cancelled", "interrupted"].includes(job.status)) throw new Error(`The render is ${job.status}; nothing to resume.`);
  for (const s of job.steps) if (s.status !== "done" && s.status !== "skipped") Object.assign(s, { status: "pending", error: null, attempts: 0 });
  if (autoFix !== undefined) job.options.autoFix = !!autoFix;
  job.status = "queued";
  job.error = null;
  job.claudeNotice = null;
  save(entry);
  if (!queue.includes(name)) queue.push(name);
  kick();
  return job;
}

export function stopJob(name, dir) {
  const entry = jobs.get(name);
  if (!entry) {
    const job = readJson(jobFile(dir), null);
    if (job && ["running", "queued"].includes(job.status)) {
      job.status = "cancelled";
      writeJson(jobFile(dir), job);
      return job;
    }
    throw new Error("No render is running for this video.");
  }
  const qi = queue.indexOf(name);
  if (qi >= 0) queue.splice(qi, 1);
  entry.stopping = true;
  if (entry.proc) killTree(entry.proc.pid);
  if (entry.job.status === "queued" || entry.job.status === "running") {
    entry.job.status = "cancelled";
    for (const s of entry.job.steps) if (s.status === "running") s.status = "pending";
    entry.job.endedAt = now();
    save(entry);
  }
  return entry.job;
}

function killTree(pid) {
  try {
    execFileSync("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    // already gone
  }
}

/** On engine start: jobs that were running or queued when the engine stopped become "interrupted". */
export function recoverJobs(workspace) {
  let n = 0;
  for (const p of listProjects(workspace)) {
    if (!p.engine) continue;
    const f = jobFile(p.dir);
    const job = readJson(f, null);
    if (job && ["running", "queued"].includes(job.status)) {
      job.status = "interrupted";
      job.error = { step: job.steps.find((s) => s.status === "running")?.id ?? null, message: "The engine stopped while this render was running (closed, or the PC restarted). Resume continues where it stopped." };
      for (const s of job.steps) if (s.status === "running") s.status = "pending";
      writeJson(f, job);
      n++;
    }
  }
  return n;
}

/** Stop everything on engine shutdown, leaving resumable state. */
export function shutdownRenders() {
  for (const [, e] of jobs) {
    if (e.proc) killTree(e.proc.pid);
    if (e.job.status === "running" || e.job.status === "queued") {
      e.job.status = "interrupted";
      e.job.error = { step: e.job.steps.find((s) => s.status === "running")?.id ?? null, message: "The engine was stopped during the render. Resume continues where it stopped." };
      for (const s of e.job.steps) if (s.status === "running") s.status = "pending";
      save(e);
    }
  }
}

function kick() {
  if (active || !queue.length) return;
  const name = queue.shift();
  const entry = jobs.get(name);
  if (!entry || entry.job.status !== "queued") return kick();
  active = name;
  entry.stopping = false;
  runJob(name, entry)
    .catch((e) => {
      entry.job.status = "failed";
      entry.job.error = { step: null, message: `Engine error: ${e.message}` };
      save(entry);
    })
    .finally(() => {
      active = null;
      entry.proc = null;
      entry.live = {};
      kick();
    });
}

// ------------------------------------------------------------------ running

/** Run a process, appending its output to the step's log; resolves {code, tail}. */
function runProc(entry, step, cmd, args, opts = {}) {
  const logFile = path.join(entry.dir, step.log);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  const log = fs.createWriteStream(logFile, { flags: "a" });
  log.write(`\n[${now()}] $ ${cmd} ${args.join(" ")}\n`);
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: entry.dir, windowsHide: true, env: { ...process.env, PYTHONUTF8: "1", ...(opts.env ?? {}) } });
    entry.proc = p;
    let tail = "";
    const onData = (d) => {
      const s = String(d);
      log.write(s);
      tail = (tail + s).slice(-6000);
      entry.live.logTail = tail.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "").split(/\r?\n|\r/).filter((l) => l.trim()).slice(-8);
      opts.onData?.(s);
    };
    p.stdout.on("data", onData);
    p.stderr.on("data", onData);
    p.on("error", (e) => {
      log.end(`\n[spawn error] ${e.message}\n`);
      entry.proc = null;
      resolve({ code: -1, tail: e.message });
    });
    p.on("exit", (code) => {
      log.end(`\n[${now()}] exit ${code}\n`);
      entry.proc = null;
      resolve({ code, tail });
    });
  });
}

const lastLines = (tail, n = 6) =>
  tail
    .replace(/\x1b\[[0-9;]*[A-Za-z]/g, "")
    .split(/\r?\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(-n)
    .join("\n");

class StepError extends Error {
  constructor(message, { retry = true } = {}) {
    super(message);
    this.retry = retry;
  }
}

async function runJob(name, entry) {
  const job = entry.job;
  job.status = "running";
  job.startedAt = job.startedAt ?? now();
  job.error = null;
  save(entry);
  for (const step of job.steps) {
    if (step.status === "done" || step.status === "skipped") continue;
    if (entry.stopping) return;
    step.status = "running";
    step.startedAt = now();
    step.error = null;
    entry.live = { step: step.id, logTail: [] };
    save(entry);
    let err = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      step.attempts = attempt;
      try {
        await STEPS[step.kind](entry, step);
        err = null;
        break;
      } catch (e) {
        err = e;
        if (entry.stopping) return;
        if (!(e instanceof StepError) || !e.retry) break;
        fs.appendFileSync(path.join(entry.dir, step.log), `\n[${now()}] attempt ${attempt} failed: ${e.message}${attempt < 2 ? " — retrying" : ""}\n`);
      }
    }
    if (entry.stopping) return;
    if (err) {
      step.status = "failed";
      step.endedAt = now();
      step.error = err.message;
      job.status = "failed";
      job.endedAt = now();
      job.error = { step: step.id, message: err.message };
      save(entry);
      if (job.options.autoFix && job.autoFixUsed < MAX_AUTO_FIXES && hooks.onFailure) {
        job.autoFixUsed++;
        save(entry);
        hooks
          .onFailure(name, entry.dir, job, { automatic: true })
          .then((res) => noteClaude(name, entry.dir, { ...res, automatic: true }))
          .catch((e) => noteClaude(name, entry.dir, { ok: false, reason: e.message, automatic: true }));
      }
      return;
    }
    step.status = "done";
    step.endedAt = now();
    save(entry);
  }
  job.status = "done";
  job.endedAt = now();
  job.outputs = { video: "out/video.mp4", delivery: "out/delivery.mp4" };
  save(entry);
  // tell the board
  const st = path.join(entry.dir, "brief", "status.json");
  if (fs.existsSync(st)) writeJson(st, { stage: "final-ready", note: "Final video ready: out/delivery.mp4 (see the Final tab)." });
}

const python = () => loadSettings().python || "python";
const PIPELINE = path.join(ENGINE_DIR, "pipeline", "run.py");

/** Other blender.exe processes (e.g. Claude rendering a draft): the GPU can't share well, so wait for them. */
function otherBlenders() {
  try {
    const out = execFileSync("tasklist", ["/FI", "IMAGENAME eq blender.exe", "/FO", "CSV", "/NH"], { encoding: "utf8" });
    return out
      .split(/\r?\n/)
      .map((l) => /^"blender\.exe","(\d+)"/i.exec(l)?.[1])
      .filter(Boolean).length;
  } catch {
    return 0;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const STEPS = {
  async audio(entry, step) {
    const r = await runProc(entry, step, python(), [PIPELINE, entry.dir, "audio"]);
    if (r.code !== 0) {
      const t = lastLines(r.tail);
      // missing voice lines are a decision (recording costs money), not something a retry fixes
      const missing = /missing voice lines/i.test(t);
      throw new StepError(missing ? `Some script lines have no recorded voice yet: ${t.split("\n").pop()}` : `The sound step failed: ${t}`, { retry: !missing });
    }
  },

  async blender(entry, step) {
    const dir = entry.dir;
    const f = projectFacts(dir);
    const plate = (f.manifest.plates ?? []).find((p) => p.id === step.plate);
    if (!plate) throw new StepError(`Plate "${step.plate}" is no longer in project.json.`, { retry: false });
    const folder = resolveIn(dir, plate.frames ?? `renders/${plate.id}/final`);
    const shotRel = plate.shot ?? `shot_${plate.id}.py`;
    const shot = path.join(dir, "blender", shotRel);
    const need = plateFrameCount(f, plate);
    if (!need) throw new StepError(`Plate "${plate.id}" refers to scenes that don't exist.`, { retry: false });
    fs.mkdirSync(folder, { recursive: true });
    const fpFile = path.join(folder, FP_FILE);
    const fingerprint = plateFingerprint(dir, f, plate, shot);
    const saved = readJson(fpFile, null);
    const rerender = entry.job.options.rerender.includes(plate.id);
    const hadFrames = existingFrames(folder);
    if (rerender && !step.cleared) {
      // asked to re-render: start this plate from scratch (once; a resumed job keeps what it rendered since)
      for (const p of hadFrames.values()) fs.rmSync(p, { force: true });
    } else if (saved && saved.fingerprint !== fingerprint && hadFrames.size && !step.cleared) {
      throw new StepError(
        `The 3D frames of "${plate.id}" are out of date: its shot script, Blender files or the narration timing changed since they were rendered. Start the render again with "re-render ${plate.id}" ticked.`,
        { retry: false },
      );
    }
    step.cleared = true;
    const record = (extra = {}) => writeJson(fpFile, { ...(saved ?? {}), plate: plate.id, frames: need, updatedAt: now(), ...extra, fingerprint });
    record({ complete: false });

    // half-written frames (crash, power loss) are removed so they get rendered again
    let corrupt = 0;
    for (const [, p] of existingFrames(folder)) {
      if (!pngComplete(p)) {
        fs.rmSync(p, { force: true });
        corrupt++;
      }
    }
    if (corrupt) fs.appendFileSync(path.join(dir, step.log), `\n[${now()}] removed ${corrupt} incomplete frame(s); they will be rendered again\n`);

    /** missing frames as runs of at most CHUNK frames */
    const missingRuns = () => {
      const have = existingFrames(folder);
      const runs = [];
      for (let n = 1; n <= need; n++) {
        if (have.has(n)) continue;
        const last = runs[runs.length - 1];
        if (last && last[1] === n - 1 && last[1] - last[0] + 1 < CHUNK) last[1] = n;
        else runs.push([n, n]);
      }
      return runs;
    };
    const count = () => {
      let n = 0;
      for (const k of existingFrames(folder).keys()) if (k >= 1 && k <= need) n++;
      return n;
    };

    const t0 = Date.now();
    const start = count();
    step.progress = { done: start, total: need, unit: "frames" };
    entry.live.progress = step.progress;
    let ticks = 0;
    const tick = setInterval(() => {
      if (++ticks % 10 === 0) save(entry); // keep job.json's progress roughly current (seen after a crash)
      const done = count();
      const elapsed = (Date.now() - t0) / 1000;
      const rendered = done - start;
      const rate = rendered > 0 ? elapsed / rendered : null;
      step.progress = { done, total: need, unit: "frames", secPerFrame: rate ? Number(rate.toFixed(1)) : null, etaSeconds: rate ? Math.round((need - done) * rate) : null };
      entry.live.progress = step.progress;
    }, 3000);

    try {
      // recompute what's missing before every call: a shot script that renders more than asked (or ignores the
      // range) then simply leaves less to do; a call that doesn't fill its range twice in a row stops the step
      let failures = 0;
      let lastTail = "";
      for (;;) {
        if (entry.stopping) return;
        const runs = missingRuns();
        if (!runs.length) break;
        const [g0, g1] = runs[0];
        // CE_RENDER_NO_GPU_WAIT=1 (tests): don't wait for other Blender processes
        while (process.env.CE_RENDER_NO_GPU_WAIT !== "1" && otherBlenders() > 0 && !entry.stopping) {
          entry.live.waiting = "Waiting for another Blender render (a draft or another video) to finish before using the GPU…";
          await sleep(10000);
        }
        entry.live.waiting = null;
        if (entry.stopping) return;
        const r = await runProc(entry, step, loadSettings().blender, ["-b", "-P", shot, "--", "final", String(g0), String(g1)], { env: { CE_PROJECT: dir } });
        if (entry.stopping) return;
        lastTail = r.tail;
        const stillMissing = missingRuns().some(([a, b]) => b >= g0 && a <= g1);
        if (!stillMissing) {
          failures = 0;
          if (r.code !== 0) fs.appendFileSync(path.join(dir, step.log), `\n[${now()}] Blender exited with ${r.code} but frames ${g0}–${g1} are all there; continuing\n`);
          continue;
        }
        failures++;
        fs.appendFileSync(path.join(dir, step.log), `\n[${now()}] frames ${g0}–${g1} not complete after this call (exit ${r.code})${failures < 2 ? "; trying once more" : ""}\n`);
        if (failures >= 2)
          throw new StepError(
            r.code !== 0
              ? `Blender couldn't render frames ${g0}–${g1} of "${plate.id}" (exit ${r.code}): ${lastLines(lastTail, 4)}`
              : `Blender finished but frames ${g0}–${g1} of "${plate.id}" weren't written to ${path.relative(dir, folder)}. The shot script may write elsewhere or skip frames of the plate.`,
            { retry: false },
          );
      }
      const elapsed = (Date.now() - t0) / 1000;
      const rendered = need - start;
      record({ complete: true, secPerFrame: rendered > 20 ? Number((elapsed / rendered).toFixed(1)) : (saved?.secPerFrame ?? null) });
      step.progress = { done: need, total: need, unit: "frames" };
    } finally {
      clearInterval(tick);
    }
  },

  async plates(entry, step) {
    const r = await runProc(entry, step, python(), [PIPELINE, entry.dir, "plates"], {
      onData: (s) => {
        const m = [...s.matchAll(/plate (\S+)\.mp4/g)];
        if (m.length) entry.live.progress = step.progress = { done: (step.progress?.done ?? 0) + m.length, total: (projectFacts(entry.dir).manifest.plates?.length ?? 1) * 2, unit: "plates" };
      },
    });
    if (r.code !== 0) throw new StepError(`Encoding the 3D plates failed: ${lastLines(r.tail)}`);
  },

  async render(entry, step) {
    const dir = entry.dir;
    const tmp = path.join(dir, "out", "render", "video.partial.mp4");
    fs.rmSync(tmp, { force: true });
    const cli = path.join(dir, "node_modules", "@remotion", "cli", "remotion-cli.js");
    // bt709: without it the file is untagged BT.601 and players show the colours hotter (measured: 241,93,39 as 255,105,35)
    const r = await runProc(entry, step, process.execPath, [cli, "render", "src/index.ts", "Reel", tmp, "--codec=h264", "--crf=16", "--color-space=bt709", "--props=./props/final.json"], {
      onData: (s) => {
        const all = [...s.matchAll(/Rendered (\d+)\/(\d+)(?:, time remaining: ([^\r\n]+))?/g)];
        const m = all[all.length - 1];
        if (m) entry.live.progress = step.progress = { done: Number(m[1]), total: Number(m[2]), unit: "frames", remaining: m[3]?.trim() ?? null };
        if (/Encoding|Stitching|Muxing/i.test(s)) entry.live.progress = step.progress = { ...(step.progress ?? {}), phase: "encoding" };
      },
    });
    if (r.code !== 0 || !fs.existsSync(tmp)) throw new StepError(`The video render failed: ${lastLines(r.tail)}`);
    swapIn(tmp, path.join(dir, "out", "video.mp4"));
    if (step.progress?.total) step.progress = { done: step.progress.total, total: step.progress.total, unit: "frames" };
  },

  async deliver(entry, step) {
    const dir = entry.dir;
    const src = path.join(dir, "out", "video.mp4");
    const tmp = path.join(dir, "out", "render", "delivery.partial.mp4");
    fs.rmSync(tmp, { force: true });
    const r = await runProc(entry, step, "ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", tmp]);
    if (r.code !== 0 || !fs.existsSync(tmp)) throw new StepError(`Making the upload file failed: ${lastLines(r.tail)}`);
    // check: right length, has sound
    const f = projectFacts(dir);
    const info = await probe(tmp);
    const expected = Math.round(f.timing.total * f.fps) / f.fps;
    if (!info.audio) throw new StepError("The upload file has no sound track.", { retry: false });
    if (Math.abs(info.duration - expected) > 0.5) throw new StepError(`The upload file is ${info.duration.toFixed(2)} s long; the video should be ${expected.toFixed(2)} s.`, { retry: false });
    swapIn(tmp, path.join(dir, "out", "delivery.mp4"));
  },
};

function swapIn(tmp, final) {
  try {
    fs.rmSync(final, { force: true });
    fs.renameSync(tmp, final);
  } catch (e) {
    throw new StepError(`Couldn't replace ${path.basename(final)} (${e.code ?? e.message}). If it's open in a video player, close it and press Resume.`, { retry: false });
  }
}

function probe(file) {
  return new Promise((resolve) => {
    execFile("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", file], (err, out) => {
      try {
        const j = JSON.parse(out);
        resolve({ duration: Number(j.format?.duration ?? 0), audio: (j.streams ?? []).some((s) => s.codec_type === "audio") });
      } catch {
        resolve({ duration: 0, audio: false });
      }
    });
  });
}

/** Remember whether (and how) Claude was told about the failure; the Final tab shows it. */
export function noteClaude(name, dir, res) {
  const entry = jobs.get(name);
  const job = entry?.job ?? readJson(jobFile(dir), null);
  if (!job) return;
  job.claudeNotice = { at: now(), ok: !!res.ok, pending: !!res.pending, reason: res.reason ?? null, automatic: !!res.automatic };
  if (entry) save(entry);
  else writeJson(jobFile(dir), job);
}

/** The message Claude gets when a render step fails. */
export function failureMessage(job, { automatic }) {
  const step = job.steps.find((s) => s.id === job.error?.step);
  return [
    `[content engine] The final render of this video ${job.status === "interrupted" ? "was interrupted" : "failed"} at the step "${step?.label ?? job.error?.step ?? "?"}".`,
    `Error: ${job.error?.message ?? "unknown"}`,
    step ? `Full log: ${step.log}` : "",
    "Please find the cause and fix it. Rules: don't spend money (voice, music) or start long renders other than by resuming this one; if the fix needs my decision (re-recording lines, re-rendering 3D, changing the script or the look), ask me instead.",
    automatic
      ? `When it's fixed, resume with the render_resume tool (automatic fix ${job.autoFixUsed} of ${MAX_AUTO_FIXES}). If you can't fix it, explain the problem to me in two or three plain sentences.`
      : "When it's fixed, tell me, and resume with the render_resume tool if I agree.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Short status for lists: { status, percent, label }. */
export function renderSummary(name, dir) {
  const job = getJob(name, dir);
  if (!job) return null;
  const live = liveInfo(name);
  const steps = job.steps.length;
  const doneSteps = job.steps.filter((s) => s.status === "done" || s.status === "skipped").length;
  const cur = job.steps.find((s) => s.status === "running");
  const frac = cur?.progress?.total ? cur.progress.done / cur.progress.total : 0;
  return { status: job.status, percent: Math.round(((doneSteps + frac) / steps) * 100), step: cur?.label ?? null, queuePosition: live?.queuePosition ?? null };
}
