/**
 * Packaging: what a video goes out with. Claude writes the options (the `packaging` skill in library/packaging); this
 * file scores them, renders the thumbnails and checks them. Made, not uploaded (vision §15, step 5).
 *
 *   brief/hooks.json       { options: [{ id, text, formula, judged, why }], chosen }: before the script is written
 *   package/titles.json    [{ id, title, thumb }]: ten titles, each paired with a thumbnail
 *   package/captions.json  [{ id, text, keyphrase, curiosity, aeo, voice, brevity }]: five post captions, marked 1-5
 *   src/thumbnails/        one Remotion Still per variant, ids Thumb-<id>
 *   package/thumbs/<id>.jpg, package/report.json: written by runPackage
 *   package/choice.json    { title, thumb, caption }: what the user picked on the Package tab
 *
 * The scores follow youtube-agent-skill's hookscore.py and title.py (MIT), with their own word lists here. Its author
 * found the hook score separates bad hooks from real ones but barely separates hits from misses: a low score is a reason
 * to revise, a high one promises nothing. Its brevity band was for long videos, so this one suits a short video's first line.
 * Nothing here calls a paid API.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withLock, writeWhole } from "./lock.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_SOURCE = path.join(HERE, "..", "library", "packaging");

const readJson = (f, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};
const clamp = (v) => Math.max(0, Math.min(100, v));
const count = (text, re) => (text.match(re) ?? []).length;
const packageDir = (dir) => path.join(dir, "package");

/** The skill Claude follows, as it is now. New videos get it from createProject; this refreshes it for any video. */
export function installPackagingSkill(dir) {
  const to = path.join(dir, ".claude", "skills", "packaging");
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(SKILL_SOURCE, to, { recursive: true });
}

// ------------------------------------------------------------------ hooks

const CONCRETE = /\d[\d,.]*\s*(%|×|x\b|percent|seconds?|minutes?|hours?|days?|weeks?|months?|years?|km|kg|grams?|metres?|meters?|miles?|dollars?)?|[$₹€£]\s*\d/gi;
const VAGUE = /\b(amazing|incredible|insane|crazy|huge|massive|ultimate|best|powerful|secret|revolutionary|epic|perfect|everything|awesome|unbelievable)\b/gi;
const FILLER = /\b(basically|just|really|actually|literally|today|guys|subscribe|welcome|hello|gonna|kind of|sort of)\b/gi;
const ADDRESS = /\b(you|your|you're|youre|yourself|you've|you'll)\b/gi;
const STAKES = /\b(lose|losing|lost|waste|wasting|quit|fail|failing|risk|never|stop|wrong|mistake|dangerous|dies?|costs?|ruin|miss|forget|trap|broke)\b/gi;
const GAP = /\b(why|how|what|until|but|nobody|no one|reason|instead|except|yet|nothing|unless|turns out|hidden)\b/gi;
const RESOLVED = /\b(because|so that|which means|that's why|thats why)\b/gi;
const WARM_UP = /^(so\b|okay\b|hey\b|hi\b|hello\b|welcome\b|today\b|in this video\b|have you ever\b|did you know\b)/i;

const WEAK_PART = {
  specificity: "nothing concrete in it (a number, a name, a thing)",
  address: "doesn't speak to the viewer",
  stakes: "nothing to gain or lose",
  curiosity: "leaves nothing to find out",
  brevity: "the wrong length for an opening line",
};

/** One opening line, scored 0-100 on five parts. It's a lint for weak lines, not a prediction. */
export function scoreHook(text) {
  const t = String(text ?? "").trim();
  const words = t.split(/\s+/).filter(Boolean);
  const n = words.length;
  const concrete = count(t, CONCRETE);
  const names = words.slice(1).filter((w) => /^[A-Z][a-z]/.test(w)).length;
  const brevity = !n ? 0 : n < 5 ? Math.max(30, 100 - 11 * (5 - n)) : n > 18 ? Math.max(10, 100 - 7 * (n - 18)) : 100;
  const parts = {
    specificity: clamp(34 + 22 * concrete - 16 * count(t, VAGUE) - 5 * count(t, FILLER) + Math.min(18, 6 * names)),
    address: clamp(26 + 20 * count(t, ADDRESS) + (count(words.slice(0, 6).join(" "), ADDRESS) ? 30 : 0)),
    stakes: clamp(22 + 26 * count(t, STAKES) + (concrete ? 14 : 0)),
    curiosity: clamp(24 + 17 * count(t, GAP) + (t.endsWith("?") ? 18 : 0) - 18 * count(t, RESOLVED)),
    brevity,
  };
  const values = Object.values(parts);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  // not every line speaks to "you" or has stakes, and an explainer's needn't: only these three can sink a hook
  const warmUp = WARM_UP.test(t);
  const measured = Math.max(0, Math.round(0.6 * mean + 0.4 * Math.min(parts.specificity, parts.curiosity, parts.brevity)) - (warmUp ? 20 : 0));
  const weakest = ["specificity", "curiosity", "brevity"].sort((a, b) => parts[a] - parts[b])[0];
  return { measured, verdict: verdictOf(measured), parts, note: warmUp ? "a warm-up, not a hook" : WEAK_PART[weakest] };
}

const verdictOf = (score) => (score >= 72 ? "strong" : score >= 55 ? "workable" : "weak");

/**
 * The hook options with their scores, best first, or null before there are any. Claude's own mark counts for more: the
 * measured score only sees numbers, "you" and word lists, so it marks down a short plain line that's a good hook.
 */
export function readHooks(dir) {
  const h = readJson(path.join(dir, "brief", "hooks.json"));
  if (!Array.isArray(h?.options) || !h.options.length) return null;
  const options = h.options
    .filter((o) => o?.id != null && o.text)
    .map((o) => {
      const s = scoreHook(o.text);
      const judged = Number.isFinite(o.judged) ? clamp(o.judged) : null;
      const score = judged === null ? s.measured : Math.round(0.7 * judged + 0.3 * s.measured);
      const verdict = verdictOf(score);
      return { id: String(o.id), text: String(o.text), formula: String(o.formula ?? ""), why: String(o.why ?? ""), judged, measured: s.measured, parts: s.parts, score, verdict, note: verdict === "weak" ? s.note : null };
    })
    .sort((a, b) => b.score - a.score);
  return { options, best: options.slice(0, 2).map((o) => o.id), chosen: options.find((o) => o.id === String(h.chosen))?.id ?? null };
}

/** One hook option by the id the page knows it by. Claude may have written its ids as numbers. */
export function hookOption(dir, id) {
  const option = readHooks(dir)?.options.find((o) => o.id === String(id));
  if (!option) throw new Error("That hook isn't one of the options any more.");
  return option;
}

export function chooseHook(dir, id) {
  const file = path.join(dir, "brief", "hooks.json");
  writeWhole(file, JSON.stringify({ ...readJson(file), chosen: hookOption(dir, id).id }, null, 1));
}

// ------------------------------------------------------------------ titles

const PHONE_TITLE = 40; // where a phone's home feed cuts a title
const SEARCH_TITLE = 60; // where desktop search does
const MAX_TITLE = 100; // YouTube's limit
const TITLE_VAGUE = /\b(amazing|incredible|insane|crazy|huge|massive|ultimate|best|powerful|secret|revolutionary|epic|perfect|complete|everything|mindblowing)\b/i;
const STOP = new Set("the a an of to in on at for and or but is are was were be it its this that these those how what why when who you your my we our i".split(" "));
const keywords = (s) => new Set(String(s).toLowerCase().match(/[\p{L}\p{N}']+/gu)?.filter((w) => !STOP.has(w)) ?? []);

/** How a phone shows a title. */
export const phoneTitle = (t) => (t.length <= PHONE_TITLE ? t : `${t.slice(0, PHONE_TITLE).replace(/\s+\S*$/, "")}…`);

/** A title on its own and against the words on its thumbnail: they're one pair, so they shouldn't say the same thing. */
export function lintTitle(title, thumbText = null) {
  const t = String(title ?? "").trim();
  const issues = [];
  const good = [];
  if (t.length > MAX_TITLE) issues.push(`over YouTube's limit of ${MAX_TITLE} characters`);
  else if (t.length > SEARCH_TITLE) issues.push(`desktop search cuts it near ${SEARCH_TITLE} characters`);
  else good.push("fits in search");
  if (t.length > PHONE_TITLE) issues.push(`a phone shows only "${phoneTitle(t)}"`);
  // a word only shouts if it has a lower case to shout from: Hindi and Tamil don't
  const shouting = t.split(/\s+/).filter((w) => w.length > 2 && w === w.toUpperCase() && w !== w.toLowerCase()).length;
  if (shouting > 2) issues.push("too many words in capitals");
  else if (shouting) good.push("capitals used sparingly");
  if (TITLE_VAGUE.test(t)) issues.push(`a vague word ("${TITLE_VAGUE.exec(t)[0]}")`);
  if (/\d/.test(t)) good.push("has a number");
  else issues.push("no number");
  if (t.endsWith("?")) good.push("asks a question");
  if (t.split(/\s+/).slice(0, 3).every((w) => STOP.has(w.toLowerCase().replace(/\W/g, "")))) issues.push("the first three words say nothing");
  if (thumbText !== null) {
    const shared = [...keywords(t)].filter((w) => keywords(thumbText).has(w));
    if (shared.length) issues.push(`repeats the thumbnail (${shared.join(", ")})`);
    else good.push("adds to the thumbnail");
  }
  return { score: clamp(100 - 14 * issues.length + 4 * good.length), issues, good, phone: phoneTitle(t) };
}

// ------------------------------------------------------------------ captions

const CAPTION_BANNED = /\b(delve|unlock|unleash|realm|elevate|game.?changer|dive into)\b/i;

/** A caption's marks out of 20 (Rob Cressy's caption skill: post at 16 or more) and what breaks its rules. */
export function lintCaption(c) {
  const total = ["curiosity", "aeo", "voice", "brevity"].reduce((n, k) => n + (Number(c[k]) || 0), 0);
  const issues = [];
  const text = String(c.text ?? "");
  if (/#\w/.test(text)) issues.push("has hashtags: Settings adds those");
  if (count(text, /[.!?]+(\s|$)/g) > 2) issues.push("more than two sentences");
  if (/[;—]/.test(text)) issues.push("a semicolon or a long dash");
  if (CAPTION_BANNED.test(text)) issues.push(`a tired word ("${CAPTION_BANNED.exec(text)[0]}")`);
  return { total, issues };
}

// ------------------------------------------------------------------ thumbnails

const PHONE_WIDTH = { tall: 180, wide: 360 }; // about how wide a thumbnail shows in a phone's feed
const PHONE_TEXT = 14; // the smallest text that reads at that size
const MIN_CONTRAST = 3;
const MAX_WORDS = 3;
const MAX_BYTES = 2 * 1024 * 1024; // YouTube's limit for a thumbnail

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** The colour of a line from the page, or null when it can't be read (a gradient, a transparent fill). */
function parseColour(s) {
  const m = /rgba?\(([^)]+)\)/.exec(String(s ?? ""));
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return a < 0.5 ? null : [r, g, b];
}

/** Contrast of a line against the worst tenth of what's behind it: busy backgrounds count, not just their average. */
function contrastBehind(bgFile, box, colour, width, height) {
  const x = Math.max(0, Math.floor(box.x0));
  const y = Math.max(0, Math.floor(box.y0));
  const w = Math.ceil(Math.min(width, box.x1)) - x;
  const h = Math.ceil(Math.min(height, box.y1)) - y;
  if (w < 4 || h < 4) return null;
  const raw = execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", bgFile, "-vf", `crop=${w}:${h}:${x}:${y},scale=64:-2,format=rgb24`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 24 });
  const text = luminance(...colour);
  const ratios = [];
  for (let i = 0; i + 2 < raw.length; i += 3) {
    const bg = luminance(raw[i], raw[i + 1], raw[i + 2]);
    ratios.push((Math.max(text, bg) + 0.05) / (Math.min(text, bg) + 0.05));
  }
  ratios.sort((a, b) => a - b);
  return ratios.length ? Math.round(ratios[Math.floor(ratios.length * 0.1)] * 10) / 10 : null;
}

function thumbFindings(t, bgFile) {
  const out = [];
  const tall = t.height > t.width;
  const minPx = Math.round((PHONE_TEXT * t.width) / PHONE_WIDTH[tall ? "tall" : "wide"]);
  const blocks = t.blocks.filter((b) => b.op >= 0.5);
  for (const b of blocks) {
    const where = `"${b.text}"`;
    if (b.x0 < -2 || b.y0 < -2 || b.x1 > t.width + 2 || b.y1 > t.height + 2) out.push({ level: "fail", where, problem: "cut off by the edge", change: "move it inside the frame or shrink it" });
    if (b.fontOk === false) out.push({ level: "fail", where, problem: `its font ${b.family} isn't loaded`, change: "load the style's fonts" });
    if (b.px < minPx) out.push({ level: "warn", where, problem: `${Math.round(b.px)} px won't read at phone size (needs ${minPx})`, change: "enlarge it or remove it" });
    const hitsCorner = tall ? b.y1 > t.height * 0.72 : b.x1 > t.width * 0.78 && b.y1 > t.height * 0.8;
    if (hitsCorner) out.push({ level: "warn", where, problem: tall ? "in the bottom of the frame, under the title and buttons" : "in the corner where the video's length shows", change: "move it clear" });
    const colour = parseColour(b.color);
    const ratio = colour ? contrastBehind(bgFile, b, colour, t.width, t.height) : null;
    if (ratio !== null && ratio < MIN_CONTRAST) out.push({ level: "warn", where, problem: `contrast ${ratio}:1 against what's behind it`, change: "change its colour or calm the background" });
  }
  const words = blocks.flatMap((b) => b.text.split(/\s+/)).filter(Boolean).length;
  if (words > MAX_WORDS) out.push({ level: "warn", where: "the whole thumbnail", problem: `${words} words; ${MAX_WORDS} is the ceiling`, change: "cut words" });
  return out;
}

/** A list Claude wrote: missing is fine (the report says so), the wrong shape isn't. */
function optionList(file) {
  const v = readJson(file, []);
  if (!Array.isArray(v)) throw new Error(`${path.basename(file)} has to be a list of options.`);
  return v.filter((o) => o && typeof o === "object");
}

/** A pick is of one option: when the option under that id has changed, it no longer stands. */
function dropStalePicks(out, before, report) {
  const file = path.join(out, "choice.json");
  const choice = readJson(file, {});
  const kinds = {
    title: ["titles", (a, b) => a.title === b.title],
    thumb: ["thumbs", (a, b) => a.text === b.text && a.bytes === b.bytes],
    caption: ["captions", (a, b) => a.text === b.text],
  };
  let changed = false;
  for (const [kind, [list, same]] of Object.entries(kinds)) {
    if (!(kind in choice)) continue;
    const was = before?.[list]?.find((x) => x.id === choice[kind]);
    const now = report[list].find((x) => x.id === choice[kind]);
    if (was && now && same(was, now)) continue;
    delete choice[kind];
    changed = true;
  }
  if (changed) writeWhole(file, JSON.stringify(choice, null, 1));
}

function packageVideo(dir) {
  const out = packageDir(dir);
  const work = path.join(out, "_render");
  const thumbsDir = path.join(out, "thumbs");
  const titleOptions = optionList(path.join(out, "titles.json"));
  const captionOptions = optionList(path.join(out, "captions.json"));
  fs.rmSync(work, { recursive: true, force: true });
  try {
    const run = spawnSync(process.execPath, [path.join(HERE, "packaging-render.mjs"), work], { cwd: dir, encoding: "utf8", windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
    if (run.status !== 0) throw new Error(`The thumbnails didn't render:\n${`${run.stderr ?? ""}\n${run.stdout ?? ""}`.trim().split(/\r?\n/).slice(-14).join("\n")}`);
    const probe = readJson(path.join(work, "probe.json"));
    // made aside and swapped in whole: a failure part way leaves the last good package as it was
    const fresh = path.join(work, "thumbs");
    fs.mkdirSync(fresh);
    const thumbs = probe.thumbs.map((t) => {
      if (!t.blocks) throw new Error(`Thumbnail ${t.id} couldn't be measured.`);
      const file = path.join(fresh, `${t.id}.jpg`);
      execFileSync("ffmpeg", ["-hide_banner", "-y", "-loglevel", "error", "-i", path.join(work, `${t.id}.png`), "-q:v", "2", file], { stdio: "pipe" });
      const bytes = fs.statSync(file).size;
      const findings = thumbFindings(t, path.join(work, `${t.id}.bg.png`));
      if (bytes > MAX_BYTES) findings.push({ level: "warn", where: "the file", problem: `${(bytes / 2 ** 20).toFixed(1)} MB; YouTube allows 2`, change: "calm the background" });
      return { id: t.id, file: `package/thumbs/${t.id}.jpg`, width: t.width, height: t.height, bytes, text: t.blocks.filter((b) => b.op >= 0.5).map((b) => b.text).join(" "), findings };
    });

    const textOf = new Map(thumbs.map((t) => [t.id, t.text]));
    const titles = titleOptions
      .map((t) => ({ id: String(t.id), title: String(t.title ?? ""), thumb: textOf.has(String(t.thumb)) ? String(t.thumb) : null, ...lintTitle(t.title, textOf.get(String(t.thumb)) ?? null) }))
      .sort((a, b) => b.score - a.score);
    const captions = captionOptions
      .map((c) => ({ id: String(c.id), text: String(c.text ?? ""), keyphrase: String(c.keyphrase ?? ""), ...lintCaption(c) }))
      .sort((a, b) => b.total - a.total);
    const missing = [];
    if (thumbs.length < 3) missing.push(`${thumbs.length} thumbnail${thumbs.length === 1 ? "" : "s"}, not 3`);
    if (titles.length < 10) missing.push(`${titles.length} title${titles.length === 1 ? "" : "s"}, not 10`);
    if (captions.length < 5) missing.push(`${captions.length} caption${captions.length === 1 ? "" : "s"}, not 5`);
    const titlesWithoutThumb = titles.filter((t) => !t.thumb).length;
    if (titlesWithoutThumb) missing.push(`${titlesWithoutThumb} title${titlesWithoutThumb === 1 ? " has" : "s have"} no thumbnail`);
    const report = { at: new Date().toISOString(), thumbs, titles, captions, errors: probe.errors, missing };

    const before = readJson(path.join(out, "report.json"));
    fs.rmSync(thumbsDir, { recursive: true, force: true, maxRetries: 5 });
    fs.renameSync(fresh, thumbsDir);
    dropStalePicks(out, before, report);
    writeWhole(path.join(out, "report.json"), JSON.stringify(report, null, 1));
    return report;
  } finally {
    fs.rmSync(work, { recursive: true, force: true, maxRetries: 5 });
  }
}

/** Render the thumbnails, check them, score the titles and captions, and write package/report.json. One at a time per video. */
export function runPackage(dir) {
  fs.mkdirSync(packageDir(dir), { recursive: true });
  return withLock(path.join(packageDir(dir), ".lock"), "This video's packaging is already being made.", () => packageVideo(dir));
}

/** What the Package tab shows: the last report and the user's choices. */
export function readPackage(dir) {
  return { report: readJson(path.join(packageDir(dir), "report.json")), choice: readJson(path.join(packageDir(dir), "choice.json"), {}) };
}

/** Remember the user's pick. Returns the title, thumbnail or caption picked. */
export function choosePackage(dir, kind, id) {
  const list = { title: "titles", thumb: "thumbs", caption: "captions" }[kind];
  if (!list) throw new Error("Choose a title, a thumbnail or a caption.");
  const picked = readPackage(dir).report?.[list]?.find((x) => x.id === id);
  if (!picked) throw new Error("That option isn't there any more.");
  const file = path.join(packageDir(dir), "choice.json");
  writeWhole(file, JSON.stringify({ ...readJson(file, {}), [kind]: id }, null, 1));
  return picked;
}
