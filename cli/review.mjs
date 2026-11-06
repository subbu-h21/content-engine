/**
 * The quality gate: what a video goes through before anyone is asked to look at it.
 *
 *   review/beats-NN.jpg    each scene just after it starts and at its middle, numbered
 *   review/seams-NN.jpg    −0.2, −0.1, 0, +0.1, +0.2 s around every cut
 *   review/phone-NN.jpg    the beat frames at 360 px wide, to judge what can be read on a phone
 *   review/safe.jpg        one frame per scene under the platforms' interface bands
 *   review/report.json     the measured findings and the critic's notes
 *   review/REPORT.md       the same for Claude and for reading
 *   review/history.json    the P0 and P1 notes of earlier reviews, so a new critic doesn't undo them
 *
 * Everything is drawn from the video's current code (cli/review-probe.mjs), so it works on a preview. The numbers come
 * from HyperFrames' review checks (docs/research/styles/hyperframes.md, R1-R5, R22-R28). A warning is a question, not a
 * rule: a video may break one on purpose. Nothing here calls a paid API; the critic runs on the user's Claude Code.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CRITIC_PROMPT = path.join(HERE, "..", "library", "review", "critic.md");
const LABEL_FONT = "C\\:/Windows/Fonts/arial.ttf";

/** Interface bands on a 1080×1920 frame: medians of community measurements (docs/research/06-skill-links-11-21.md). */
export const PLATFORMS = {
  tiktok: { name: "TikTok", top: 150, bottom: 320, left: 60, right: 120 },
  shorts: { name: "YouTube Shorts", top: 150, bottom: 350, left: 60, right: 150 },
  reels: { name: "Instagram Reels", top: 210, bottom: 340, left: 40, right: 100 },
};
/** The buttons on the right only start partway down the screen. */
const RIGHT_RAIL_FROM = 0.4;

const SWEEP_FPS = 8;
const TEXT_FLOOR = 0.026; // of the frame's short side: 28 px at 1080
const HELD = 0.5; // seconds: anything shorter is an entrance or an exit
const DEAD_STRETCH = 3;
const TARGET_LUFS = -16; // what the render's deliver step levels to
const MAX_TRUE_PEAK = -1;

const readJson = (f, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-y", "-loglevel", "error", ...args], { stdio: "pipe", maxBuffer: 256 * 1024 * 1024 });
/** ffmpeg's report goes to stderr even when it succeeds. */
const ffmpegLog = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).stderr ?? "";

export const reviewDir = (dir) => path.join(dir, "review");

// ------------------------------------------------------------------ which frames

/** The scenes with their frame numbers, from src/data/timing.json. */
function scenesOf(dir, fps) {
  const t = readJson(path.join(dir, "src", "data", "timing.json"));
  return Object.entries(t?.scenes ?? {})
    .map(([id, s]) => ({ id, start: Math.round(s.start * fps), end: Math.round((s.start + s.duration) * fps) }))
    .sort((a, b) => a.start - b.start);
}

function plan(dir) {
  const p = readJson(path.join(dir, "project.json"), {});
  const fps = p.format?.fps ?? 30;
  const scenes = scenesOf(dir, fps);
  const timing = readJson(path.join(dir, "src", "data", "timing.json"));
  const total = Math.round((timing?.total ?? 0) * fps);
  if (!total || !scenes.length) throw new Error("This video has no timing yet (src/data/timing.json): build its scenes first.");
  const step = Math.max(1, Math.round(fps / SWEEP_FPS));
  const last = total - 1;
  const clamp = (f) => Math.max(0, Math.min(last, Math.round(f)));
  const sweep = [];
  for (let f = 0; f <= last; f += step) sweep.push(f);
  const beats = scenes.flatMap((s, i) => [
    { f: clamp(s.start + 0.3 * fps), scene: s.id, n: i + 1, at: "start" },
    { f: clamp((s.start + s.end) / 2), scene: s.id, n: i + 1, at: "middle" },
  ]);
  const seams = scenes.slice(1).map((s, i) => ({ cut: s.start, from: scenes[i].id, to: s.id, frames: [-0.2, -0.1, 0, 0.1, 0.2].map((d) => clamp(s.start + d * fps)) }));
  const frames = [...new Set([...sweep, last, ...beats.map((b) => b.f), ...seams.flatMap((s) => s.frames)])].sort((a, b) => a - b);
  return { fps, total, step, scenes, sweep, beats, seams, frames };
}

// ------------------------------------------------------------------ the checks on the text

const shape = (key) => key.replace(/\d/g, "#"); // a timecode is one line, whatever it says
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const readFloor = (n) => (n <= 2 ? 0.4 : 0.75 * (0.5 + 0.3 * n));

/** Every line of text across the sweep, with the stretches it was on screen. */
function collectLines(probe, sweep) {
  const inSweep = new Set(sweep);
  const lines = new Map();
  for (const fr of probe.frames) {
    if (!inSweep.has(fr.f)) continue;
    for (const b of fr.blocks) {
      if (b.op < 0.5) continue;
      const k = shape(b.key);
      const l = lines.get(k) ?? { key: b.key, seen: [] };
      l.seen.push({ f: fr.f, ...b });
      lines.set(k, l);
    }
  }
  return [...lines.values()];
}

/** Runs of consecutive sweep frames. */
function runsOf(seen, step) {
  const runs = [];
  for (const s of seen) {
    const r = runs.at(-1);
    if (r && s.f - r.at(-1).f <= step * 2) r.push(s);
    else runs.push([s]);
  }
  return runs;
}

function textFindings(probe, pl) {
  const out = [];
  const { fps, step } = pl;
  const secs = (r) => (r.at(-1).f - r[0].f + step) / fps;
  const t = (f) => round(f / fps);
  const short = Math.min(probe.width, probe.height);
  const floorPx = short * TEXT_FLOOR - 0.5;
  const small = new Map();
  const vertical = probe.height > probe.width;
  const k = probe.width / 1080;

  for (const line of collectLines(probe, pl.sweep)) {
    for (const r of runsOf(line.seen, step)) {
      const held = secs(r) >= HELD;
      const px = Math.max(...r.map((s) => s.px));
      if (px < floorPx) {
        if (held) small.set(shape(line.key).slice(0, 12), { text: line.key.slice(0, 40), px: round(px, 1), t: t(r[0].f) });
        continue;
      }
      const n = words(line.key);
      const isLast = r.at(-1).f >= pl.total - 1 - step * 2;
      const need = isLast ? 2 : readFloor(n);
      const opened = r[0].f <= step; // on screen from the first frame: it isn't a line that flashed by
      if (secs(r) < need - 1 / fps && !opened) {
        out.push({ level: "warn", area: "text", t: t(r[0].f), where: `"${line.key}"`, problem: `on screen ${round(secs(r), 1)} s; ${n} word${n === 1 ? "" : "s"} need ${round(need, 1)} s${isLast ? " as the last line" : ""}`, change: "hold it longer or cut words" });
      }
      if (!held) continue;
      const mid = (side) => r.map((s) => s[side]).sort((a, b) => a - b)[r.length >> 1];
      const box = { x0: mid("x0"), y0: mid("y0"), x1: mid("x1"), y1: mid("y1") }; // where it sits, whatever a glitch or an entrance does
      if (box.x0 < -2 || box.y0 < -2 || box.x1 > probe.width + 2 || box.y1 > probe.height + 2) {
        out.push({ level: "fail", area: "text", t: t(r[0].f), where: `"${line.key}"`, problem: "cut off by the edge of the frame", change: "move it inside the frame or shrink it" });
      } else if (vertical) {
        const under = Object.values(PLATFORMS).filter((p) => {
          const rail = box.y1 > probe.height * RIGHT_RAIL_FROM && box.x1 > probe.width - p.right * k;
          return box.y0 < p.top * k || box.y1 > probe.height - p.bottom * k || box.x0 < p.left * k || rail;
        });
        if (under.length) out.push({ level: "warn", area: "text", t: t(r[0].f), where: `"${line.key}" (x ${Math.round(box.x0)}–${Math.round(box.x1)}, y ${Math.round(box.y0)}–${Math.round(box.y1)})`, problem: `under the interface of ${under.map((p) => p.name).join(", ")}`, change: "move it inside the safe area" });
      }
    }
  }
  if (small.size) {
    const list = [...small.values()];
    out.push({ level: "warn", area: "text", t: list[0].t, where: `${list.length} line${list.length === 1 ? "" : "s"}`, problem: `smaller than ${Math.round(short * TEXT_FLOOR)} px, hard to read on a phone: ${list.slice(0, 8).map((s) => `"${s.text}" ${s.px} px`).join(", ")}${list.length > 8 ? ", …" : ""}`, change: "enlarge what must be read; decoration may stay small" });
  }

  // two lines sitting on each other
  const hits = new Map();
  const inSweep = new Set(pl.sweep);
  for (const fr of probe.frames) {
    if (!inSweep.has(fr.f)) continue;
    const big = fr.blocks.filter((b) => b.op >= 0.5 && b.px >= floorPx);
    for (let i = 0; i < big.length; i++) {
      for (let j = i + 1; j < big.length; j++) {
        const [a, b] = [big[i], big[j]];
        if (shape(a.key) === shape(b.key)) continue; // one line drawn twice is a glitch or a shadow
        const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (w <= 0 || h <= 0) continue;
        const smaller = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
        if ((w * h) / smaller < 0.15) continue;
        const id = [shape(a.key), shape(b.key)].sort().join(" | ");
        const e = hits.get(id) ?? { a: a.key, b: b.key, first: fr.f, n: 0 };
        e.n++;
        hits.set(id, e);
      }
    }
  }
  for (const e of hits.values()) {
    if ((e.n * step) / fps >= HELD) out.push({ level: "warn", area: "text", t: t(e.first), where: `"${e.a}" and "${e.b}"`, problem: "overlap on screen", change: "separate them" });
  }

  // lines that arrive in the same instant fight for the eye
  const firsts = new Map();
  for (const line of collectLines(probe, pl.sweep)) {
    const r = runsOf(line.seen, step)[0];
    if (Math.max(...r.map((s) => s.px)) < floorPx || r[0].f <= step || secs(r) < HELD) continue;
    const list = firsts.get(r[0].f) ?? [];
    list.push(line.key);
    firsts.set(r[0].f, list);
  }
  for (const [f, list] of firsts) {
    if (list.length >= 2) out.push({ level: "info", area: "pacing", t: t(f), where: list.map((s) => `"${s}"`).join(", "), problem: "appear at the same moment", change: "stagger them unless they're one thought" });
  }

  // fonts: every family the text uses has to be one the page really loaded
  const loaded = new Set(probe.frames.flatMap((f) => f.fonts));
  const used = new Map();
  for (const fr of probe.frames) for (const b of fr.blocks) if (!used.has(b.family)) used.set(b.family, { text: b.key, f: fr.f });
  for (const [family, u] of used) {
    if (!loaded.has(family) && !/^(serif|sans-serif|monospace|cursive|fantasy|system-ui)$/.test(family)) out.push({ level: "fail", area: "fonts", t: t(u.f), where: `"${u.text}"`, problem: `its font ${family} isn't loaded, so the browser drew a fallback`, change: "load it in src/lib/fonts.ts" });
  }
  for (const e of probe.errors) out.push({ level: "fail", area: "page", t: 0, where: "the page", problem: e, change: "fix the error" });
  return out;
}

// ------------------------------------------------------------------ the checks on the pixels

/** Brightness, spread and change per sweep frame, on a small blurred copy so film grain doesn't count as motion. */
function pixelStats(framesDir, sweep) {
  const seq = path.join(framesDir, "seq");
  fs.rmSync(seq, { recursive: true, force: true });
  fs.mkdirSync(seq);
  sweep.forEach((f, i) => fs.copyFileSync(path.join(framesDir, `f_${String(f).padStart(5, "0")}.jpg`), path.join(seq, `s_${String(i).padStart(5, "0")}.jpg`)));
  const log = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-framerate", String(SWEEP_FPS), "-i", path.join(seq, "s_%05d.jpg"), "-vf", "scale=135:-2,gblur=sigma=1.5,signalstats,metadata=print:file=-", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  fs.rmSync(seq, { recursive: true, force: true });
  const col = (name) => [...log.matchAll(new RegExp(`lavfi\\.signalstats\\.${name}=([\\d.]+)`, "g"))].map((m) => Number(m[1]));
  const [avg, low, high, dif] = [col("YAVG"), col("YLOW"), col("YHIGH"), col("YDIF")];
  return sweep.map((f, i) => ({ f, avg: avg[i] ?? 0, spread: (high[i] ?? 0) - (low[i] ?? 0), dif: i ? (dif[i] ?? 0) : null }));
}

function pixelFindings(stats, probe, pl) {
  const out = [];
  const t = (f) => round(f / pl.fps);
  const textAt = new Map(probe.frames.map((f) => [f.f, f.blocks.filter((b) => b.op >= 0.5).length]));
  if (stats[0].spread < 6 && !textAt.get(0)) {
    out.push({ level: "warn", area: "pacing", t: 0, where: "the first frame", problem: "empty: this is the thumbnail social players show", change: "start on something visible" });
  }
  const blank = stats.filter((s, i) => i > 0 && i < stats.length - 1 && s.avg < 3 && stats[i - 1].avg > 8 && stats[i + 1].avg > 8);
  for (const s of blank) out.push({ level: "fail", area: "frames", t: t(s.f), where: "a single moment", problem: "a black frame between two lit ones", change: "find the missing or corrupt frame" });

  // nothing changing, apart from the end of the video where a hold is the point
  const limit = pl.total - DEAD_STRETCH * pl.fps;
  const still = 0.12;
  let from = null;
  const close = (end) => {
    if (from !== null && (end - from) / pl.fps > DEAD_STRETCH) out.push({ level: "warn", area: "pacing", t: t(from), where: `${t(from)}–${t(end)} s`, problem: `nothing changes on screen for ${round((end - from) / pl.fps, 1)} s`, change: "give the stretch a move or cut it" });
    from = null;
  };
  for (const s of stats.slice(1)) {
    if (s.f >= limit) break;
    if (s.dif < still) from ??= s.f;
    else close(s.f);
  }
  close(Math.min(limit, stats.at(-1).f));
  return out;
}

// ------------------------------------------------------------------ the sound

/** Mono samples of a sound file at 8 kHz. */
function samples(file) {
  const buf = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", file, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], { maxBuffer: 512 * 1024 * 1024 });
  return new Int16Array(buf.buffer, buf.byteOffset, buf.length >> 1);
}

/**
 * Power of the voice and of everything else, per 50 ms, from the same files, gains and envelope the video mixes
 * (src/components/AudioMix.tsx): the voice can't be measured apart from the effects once they're in one file.
 */
function mixWindows(dir, audio, total, fps) {
  const RATE = 8000, WIN = 400;
  const n = Math.ceil(((total / fps) * RATE) / WIN);
  const db = (v) => 10 ** (v / 20);
  const power = (arr, offset, gainAt) => {
    const w = new Float64Array(n);
    for (let i = 0; i < arr.length; i++) {
      const at = i + offset;
      const bin = Math.floor(at / WIN);
      if (bin < 0 || bin >= n) continue;
      const v = (arr[i] / 32768) * gainAt(at / RATE);
      w[bin] += (v * v) / WIN;
    }
    return w;
  };
  const voiceFile = path.join(dir, "public", "audio", "voice.wav");
  if (!fs.existsSync(voiceFile)) return null;
  const voice = power(samples(voiceFile), 0, () => db(audio?.voiceDb ?? 0));
  const others = new Float64Array(n);
  const add = (w) => w.forEach((v, i) => (others[i] += v));
  const musicFile = path.join(dir, "public", "audio", "music.wav");
  if (fs.existsSync(musicFile) && audio?.music !== false) {
    const duck = readJson(path.join(dir, "src", "data", "duck.json"));
    add(power(samples(musicFile), 0, (s) => db(audio?.musicDb ?? -14) * (duck?.gain?.[Math.floor(s * fps)] ?? 1)));
  }
  const cache = new Map();
  for (const e of readJson(path.join(dir, "src", "data", "sfx_events.json"), [])) {
    const f = path.join(dir, "public", "audio", "sfx", `${e.kind}.wav`);
    if (!fs.existsSync(f)) continue;
    if (!cache.has(f)) cache.set(f, samples(f));
    add(power(cache.get(f), Math.round((e.t - (e.lead ?? 0)) * RATE), () => db(audio?.sfxDb ?? -9) * e.gain));
  }
  return { voice, others, seconds: WIN / RATE };
}

function soundFindings(dir, probe, pl) {
  const out = [];
  const listen = [];
  const mix = mixWindows(dir, probe.audio, pl.total, pl.fps);
  const seconds = pl.total / pl.fps;
  if (!mix) {
    if (seconds > 15) out.push({ level: "warn", area: "sound", t: 0, where: "the whole video", problem: "no voice yet", change: "record the voice, or say why it's silent" });
    return { findings: out, listen, voiceOver: null };
  }
  const dB = (p) => 10 * Math.log10(p + 1e-12);
  // loudness is heard over a moment: 200 ms, so the first instant of a word doesn't count as the voice being quiet
  const smooth = (w) => w.map((_, i) => w.slice(Math.max(0, i - 2), i + 2).reduce((a, b) => a + b, 0) / 4);
  const [voice, others] = [smooth(mix.voice), smooth(mix.others)];
  const voiced = [];
  voice.forEach((v, i) => {
    if (dB(v) > -32) voiced.push({ t: round(i * mix.seconds), margin: others[i] > 1e-9 ? dB(v) - dB(others[i]) : Infinity });
  });
  const close = voiced.filter((w) => Number.isFinite(w.margin)).sort((a, b) => a.margin - b.margin);
  if (close.length) {
    const worst = close[0];
    if (worst.margin < 0) out.push({ level: "warn", area: "sound", t: worst.t, where: "under the voice", problem: `something is ${round(-worst.margin, 1)} dB louder than the voice`, change: "lower that effect or the music" });
    else if (worst.margin < 4) out.push({ level: "info", area: "sound", t: worst.t, where: "under the voice", problem: `the voice is only ${round(worst.margin, 1)} dB above the rest at its closest`, change: "lower that effect if the word gets lost" });
    for (const w of close) {
      if (listen.length >= 5) break;
      if (listen.every((l) => Math.abs(l.t - w.t) >= 1)) listen.push({ t: w.t, why: w.margin < 0 ? `the rest is ${round(-w.margin, 1)} dB above the voice here` : `the voice is only ${round(w.margin, 1)} dB above the rest here` });
    }
  }
  // the loudest effects with no voice over them: drops that may feel too hard or too soft
  const quiet = [...others].map((p, i) => ({ t: round(i * mix.seconds), db: dB(p), voiced: dB(voice[i]) > -32 })).filter((w) => !w.voiced && w.db > -40).sort((a, b) => b.db - a.db);
  for (const w of quiet) {
    if (listen.length >= 5) break;
    if (listen.every((l) => Math.abs(l.t - w.t) >= 1)) listen.push({ t: w.t, why: "an effect on its own: is it the right size?" });
  }
  return { findings: out, listen: listen.sort((a, b) => a.t - b.t), voiceOver: close.length ? round(close[0].margin, 1) : null };
}

/** Loudness, peak and format of the finished file, measured on the file. Cached until the file changes. */
export function finalChecks(dir) {
  const file = path.join(dir, "out", "delivery.mp4");
  if (!fs.existsSync(file)) return null;
  const cached = path.join(reviewDir(dir), "final.json");
  const stamp = Math.round(fs.statSync(file).mtimeMs);
  const old = readJson(cached);
  if (old?.stamp === stamp) return old;

  const log = ffmpegLog(["-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const summary = log.slice(log.lastIndexOf("Summary:"));
  const num = (re) => {
    const m = re.exec(summary);
    return m ? Number(m[1]) : null;
  };
  const lufs = num(/I:\s+(-?[\d.]+) LUFS/);
  const truePeak = num(/Peak:\s+(-?[\d.]+) dBFS/);
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,color_space,color_primaries,color_transfer", "-of", "json", file], { encoding: "utf8" }));
  const video = probe.streams.find((s) => s.codec_type === "video");
  const hasAudio = probe.streams.some((s) => s.codec_type === "audio");
  const findings = [];
  if (!hasAudio) findings.push({ level: "warn", area: "sound", t: 0, where: "the final file", problem: "it has no sound", change: "check the render's sound step" });
  if (lufs !== null && Math.abs(lufs - TARGET_LUFS) > 1) findings.push({ level: "warn", area: "sound", t: 0, where: "the final file", problem: `${lufs} LUFS; the engine levels to ${TARGET_LUFS}`, change: "check the deliver step" });
  if (truePeak !== null && truePeak > MAX_TRUE_PEAK) findings.push({ level: "fail", area: "sound", t: 0, where: "the final file", problem: `peaks at ${truePeak} dBTP, above ${MAX_TRUE_PEAK}`, change: "lower the mix" });
  if (video?.color_primaries !== "bt709") findings.push({ level: "info", area: "colour", t: 0, where: "the final file", problem: "not tagged BT.709, so players guess its colours", change: "render it again with this engine" });
  const result = { stamp, file: "out/delivery.mp4", lufs, truePeak, width: video?.width, height: video?.height, colour: video?.color_primaries ?? "untagged", findings };
  fs.mkdirSync(reviewDir(dir), { recursive: true });
  fs.writeFileSync(cached, JSON.stringify(result, null, 1));
  return result;
}

// ------------------------------------------------------------------ the pack

/** A frame with its label burned in, ready for a sheet. */
function tile(from, to, width, label) {
  const text = label.replace(/[\\':%]/g, " ");
  const size = Math.max(12, Math.round(width / 16));
  ffmpeg(["-i", from, "-vf", `scale=${width}:-2,drawbox=x=0:y=ih-${size + 10}:w=iw:h=${size + 10}:color=black@0.75:t=fill,drawtext=fontfile='${LABEL_FONT}':text='${text}':fontsize=${size}:fontcolor=white:x=6:y=h-${size + 6}`, "-q:v", "3", to]);
}

/** Sheets of at most cols×rows tiles, in order. Returns their file names. */
function sheets(tiles, tmp, out, name, cols, rows) {
  const made = [];
  for (let i = 0, n = 1; i < tiles.length; i += cols * rows, n++) {
    const page = tiles.slice(i, i + cols * rows);
    const dir = path.join(tmp, `${name}-${n}`);
    fs.mkdirSync(dir, { recursive: true });
    page.forEach((f, j) => fs.copyFileSync(f, path.join(dir, `t_${String(j).padStart(3, "0")}.jpg`)));
    const file = `${name}-${String(n).padStart(2, "0")}.jpg`;
    const used = Math.ceil(page.length / cols);
    ffmpeg(["-framerate", "1", "-i", path.join(dir, "t_%03d.jpg"), "-vf", `tile=${cols}x${used}:padding=6:margin=6:color=0x1a1a1a`, "-frames:v", "1", "-q:v", "3", path.join(out, file)]);
    made.push(file);
  }
  return made;
}

function buildPack(dir, framesDir, pl, probe) {
  const out = reviewDir(dir);
  const tmp = path.join(out, "_tiles");
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const src = (f) => path.join(framesDir, `f_${String(f).padStart(5, "0")}.jpg`);
  const secs = (f) => `${round(f / pl.fps)}s`;
  let id = 0;
  const made = (f, width, label) => {
    const to = path.join(tmp, `${String(++id).padStart(4, "0")}.jpg`);
    tile(src(f), to, width, label);
    return to;
  };
  const landscape = probe.width > probe.height;
  const beats = sheets(pl.beats.map((b) => made(b.f, 270, `${b.n}${b.at === "start" ? "a" : "b"} t=${secs(b.f)} ${b.scene}`)), tmp, out, "beats", landscape ? 3 : 8, 2);
  const seams = sheets(pl.seams.flatMap((s, i) => s.frames.map((f, j) => made(f, 200, `cut ${i + 1} ${["-0.2", "-0.1", "0", "+0.1", "+0.2"][j]} t=${secs(f)}`))), tmp, out, "seams", 5, 4);
  const phone = sheets(pl.beats.map((b) => made(b.f, 360, `${b.n}${b.at === "start" ? "a" : "b"} t=${secs(b.f)}`)), tmp, out, "phone", landscape ? 2 : 5, 2);

  let safe = null;
  if (!landscape) {
    // the bands of all three platforms, the deepest of each side: what stays clear is safe everywhere
    const k = 540 / 1080;
    const band = (side) => Math.round(Math.max(...Object.values(PLATFORMS).map((p) => p[side])) * k);
    const railY = Math.round(960 * RIGHT_RAIL_FROM * 2);
    const draw = [
      `drawbox=x=0:y=0:w=iw:h=${band("top")}:color=red@0.3:t=fill`,
      `drawbox=x=0:y=ih-${band("bottom")}:w=iw:h=${band("bottom")}:color=red@0.3:t=fill`,
      `drawbox=x=0:y=${band("top")}:w=${band("left")}:h=ih-${band("top") + band("bottom")}:color=red@0.3:t=fill`,
      `drawbox=x=iw-${band("right")}:y=${railY}:w=${band("right")}:h=ih-${railY + band("bottom")}:color=red@0.3:t=fill`,
    ].join(",");
    const tiles = pl.beats.filter((b) => b.at === "middle").map((b) => {
      const to = path.join(tmp, `${String(++id).padStart(4, "0")}.jpg`);
      const over = `${to}.over.jpg`;
      ffmpeg(["-i", src(b.f), "-vf", `scale=540:-2,${draw}`, "-q:v", "3", over]);
      tile(over, to, 270, `${b.n} t=${secs(b.f)} ${b.scene}`);
      return to;
    });
    safe = sheets(tiles, tmp, out, "safe", 8, 2)[0];
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  return { beats, seams, phone, safe };
}

// ------------------------------------------------------------------ the critic

/** Notes from the critic's reply: a JSON array, with or without text around it. Null when it isn't one. */
export function parseNotes(text) {
  const from = text.indexOf("[");
  const to = text.lastIndexOf("]");
  if (from < 0 || to < from) return null;
  let raw;
  try {
    raw = JSON.parse(text.slice(from, to + 1));
  } catch {
    return null;
  }
  if (!Array.isArray(raw)) return null;
  const notes = [];
  for (const n of raw) {
    if (![0, 1, 2].includes(n?.p) || typeof n.problem !== "string" || typeof n.change !== "string") return null;
    notes.push({ p: n.p, t: Number(n.t) || 0, where: String(n.where ?? ""), problem: n.problem, change: n.change });
  }
  return notes.sort((a, b) => a.p - b.p || a.t - b.t);
}

/**
 * A fresh Claude with no stake in the video reads the pack against the brief and the style. It starts in an empty
 * folder so none of the video's own history, skills or hooks reach it, and it can only read.
 */
function runCritic(dir, report) {
  const out = reviewDir(dir);
  const has = (f) => fs.existsSync(path.join(dir, f));
  const files = [
    ...report.pack.beats, ...report.pack.seams, ...report.pack.phone, ...(report.pack.safe ? [report.pack.safe] : []),
  ].map((f) => path.join(out, f));
  const context = ["brief.md", "script.json", "plan.md", has("src/style/STYLE.md") ? "src/style/STYLE.md" : "style.md"].filter(has).map((f) => path.join(dir, f));
  const measured = report.findings.length ? report.findings.map(line).join("\n") : "(nothing)";
  // a critic that knows nothing of earlier rounds undoes them: on a real video, two of the last three notes reversed older ones
  const earlier = rememberNotes(dir).flatMap((h) => h.notes.map(noteLine));
  const prompt = fs
    .readFileSync(CRITIC_PROMPT, "utf8")
    .replace("{{sheets}}", () => files.map((f) => `- ${f}`).join("\n"))
    .replace("{{context}}", () => context.map((f) => `- ${f}`).join("\n"))
    .replace("{{measured}}", () => measured)
    .replace("{{earlier}}", () => (earlier.length ? earlier.map((n) => `- ${n}`).join("\n") : "(this is the first review)"));
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "ce-critic-"));
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CLAUDE_?CODE|^CLAUDECODE$/i.test(k)) env[k] = v;
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = spawnSync("claude -p --output-format json --tools Read --allowedTools Read --no-session-persistence --strict-mcp-config --disable-slash-commands", {
        cwd, env, input: prompt, encoding: "utf8", shell: true, windowsHide: true, timeout: 10 * 60 * 1000, maxBuffer: 64 * 1024 * 1024,
      });
      if (r.status !== 0) return { error: `The critic couldn't run: ${(r.stderr || r.stdout || "no output").trim().split(/\r?\n/).slice(-3).join(" ").slice(0, 300)}` };
      const reply = readReply(r.stdout);
      const notes = reply === null ? null : parseNotes(reply);
      if (notes) return { notes };
    }
    return { error: "The critic's reply wasn't in the notes format, twice." };
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
}

/**
 * What earlier reviews asked for (review/history.json), oldest first. Called before the new report is written, so the
 * report on disk is the previous review. Only P0 and P1: those are the notes the video's maker had to act on.
 */
function rememberNotes(dir) {
  const file = path.join(reviewDir(dir), "history.json");
  const history = readJson(file, []);
  const last = readJson(path.join(reviewDir(dir), "report.json"));
  const notes = last?.critic?.notes?.filter((n) => n.p < 2) ?? [];
  if (notes.length && !history.some((h) => h.at === last.at)) {
    history.push({ at: last.at, notes });
    fs.writeFileSync(file, JSON.stringify(history, null, 1));
  }
  return history;
}

function readReply(stdout) {
  try {
    const o = JSON.parse(stdout);
    return o.is_error ? null : String(o.result ?? "");
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ the report

const line = (f) => `${f.level.toUpperCase()} · t=${f.t}s · ${f.where} · ${f.problem} → ${f.change}`;
const noteLine = (n) => `P${n.p} · t=${n.t}s · ${n.where} · ${n.problem} → ${n.change}`;

function writeReport(dir, r) {
  const parts = [`# Review of this video`, ``, r.summary, ``];
  parts.push(`## The critic's notes`, ``);
  if (r.critic?.error) parts.push(`No notes: ${r.critic.error}`, ``);
  else if (!r.critic) parts.push(`The critic wasn't run.`, ``);
  else if (!r.critic.notes.length) parts.push(`No notes.`, ``);
  else parts.push(...r.critic.notes.map((n) => `- ${noteLine(n)}`), ``);
  parts.push(`## What was measured`, ``);
  parts.push(...(r.findings.length ? r.findings.map((f) => `- ${line(f)}`) : ["Nothing to report."]), ``);
  parts.push(`## For your ears`, ``, `Nothing here can hear the video. Listen to these moments on headphones:`, ``);
  parts.push(...(r.listen.length ? r.listen.map((l) => `- ${l.t} s: ${l.why}`) : ["- the whole video: there's no sound to compare yet"]), ``);
  parts.push(`## Sheets`, ``, ...[...r.pack.beats, ...r.pack.seams, ...r.pack.phone, ...(r.pack.safe ? [r.pack.safe] : [])].map((f) => `- review/${f}`), ``);
  parts.push(`## Not checked`, ``, `Contrast of text against its background, and anything that needs ears, are left to the critic and to you. Warnings are questions: keep one on purpose if the video is better for it.`, ``);
  fs.writeFileSync(path.join(reviewDir(dir), "REPORT.md"), parts.join("\n"));
}

function summarize(r) {
  const n = (level) => r.findings.filter((f) => f.level === level).length;
  const p = (k) => r.critic?.notes?.filter((x) => x.p === k).length ?? 0;
  const counts = { fails: n("fail"), warnings: n("warn"), p0: p(0), p1: p(1), p2: p(2) };
  const open = counts.fails + counts.p0 + counts.p1;
  const critic = r.critic?.notes ? `, ${counts.p0} P0, ${counts.p1} P1, ${counts.p2} P2` : "";
  return { counts, passed: open === 0 && !!r.critic?.notes, text: `${counts.fails} failed, ${counts.warnings} to look at${critic}.` };
}

/** The saved report with the final file's measurements, or null when the video hasn't been reviewed. */
export function readReview(dir) {
  const report = readJson(path.join(reviewDir(dir), "report.json"));
  const final = finalChecks(dir);
  return report || final ? { report, final } : null;
}

/** Run the whole gate on the video's current code. */
export function runReview(dir, { critic = true } = {}) {
  const pl = plan(dir);
  const out = reviewDir(dir);
  const framesDir = path.join(out, "_frames");
  fs.mkdirSync(out, { recursive: true });
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const listFile = path.join(framesDir, "frames.json");
  fs.writeFileSync(listFile, JSON.stringify(pl.frames));
  const run = spawnSync(process.execPath, [path.join(HERE, "review-probe.mjs"), framesDir, listFile], { cwd: dir, encoding: "utf8", windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  if (run.status !== 0) throw new Error(`The review's render failed:\n${`${run.stderr ?? ""}\n${run.stdout ?? ""}`.trim().split(/\r?\n/).slice(-20).join("\n")}`);
  const probe = readJson(path.join(framesDir, "probe.json"));
  const missing = pl.sweep.filter((f) => !probe.frames.some((m) => m.f === f)).length;

  const sound = soundFindings(dir, probe, pl);
  const findings = [...textFindings(probe, pl), ...pixelFindings(pixelStats(framesDir, pl.sweep), probe, pl), ...sound.findings].sort((a, b) => a.t - b.t);
  const pack = buildPack(dir, framesDir, pl, probe);
  fs.rmSync(framesDir, { recursive: true, force: true });

  const r = { at: new Date().toISOString(), seconds: round(pl.total / pl.fps), scenes: pl.scenes.length, cuts: pl.seams.length, frames: pl.frames.length, unmeasured: missing, findings, listen: sound.listen, voiceOver: sound.voiceOver, pack, critic: null };
  if (critic) r.critic = runCritic(dir, r);
  const s = summarize(r);
  r.counts = s.counts;
  r.passed = s.passed;
  r.summary = s.text;
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(r, null, 1));
  writeReport(dir, r);
  return r;
}
