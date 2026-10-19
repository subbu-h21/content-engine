/**
 * Turns what Studio reports (composition + frame + props) into a description Claude can use:
 * global time, scene, narration line, and the scene's on-screen elements with their prop paths.
 */
import fs from "node:fs";
import path from "node:path";

const readJson = (f, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fallback;
  }
};

export function loadProject(dir) {
  const timing = readJson(path.join(dir, "src", "data", "timing.json"), { total: 0, fps: 24, scenes: {} });
  const script = readJson(path.join(dir, "script.json"), { scenes: [] });
  const manifest = readJson(path.join(dir, "project.json"), {});
  const fps = manifest.format?.fps ?? timing.fps ?? 24;
  const ids = Object.keys(timing.scenes);
  const scenes = ids.map((id, i) => {
    const sc = timing.scenes[id];
    const s = script.scenes.find((x) => x.id === id);
    const title = s?.title ?? id;
    const cues = Object.entries(sc.cues).map(([cid, c]) => ({ id: cid, start: c.start, end: c.end, text: s?.cues.find((x) => x.id === cid)?.text ?? "" }));
    return { number: i + 1, id, title, start: sc.start, duration: sc.duration, cues, preview: `S${String(i + 1).padStart(2, "0")}-${title.replace(/[^a-z]/gi, "")}` };
  });
  return { fps, total: timing.total, scenes, title: manifest.title ?? path.basename(dir) };
}

export const fmtTime = (t) => {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
};

/** "0:41.2", "41.2", "1:02" -> seconds */
export const parseTime = (v) => {
  if (typeof v === "number") return v;
  const m = /^\s*(?:(\d+):)?(\d+(?:\.\d+)?)\s*$/.exec(String(v));
  if (!m) throw new Error(`can't read time "${v}" (use 41.2 or 0:41.2)`);
  return (m[1] ? Number(m[1]) * 60 : 0) + Number(m[2]);
};

export const sceneAt = (proj, t) => proj.scenes.find((s) => t >= s.start && t < s.start + s.duration) ?? proj.scenes[proj.scenes.length - 1] ?? null;

/** props.scenes key for a scene id: "s06_wanting" -> "s06" */
const propsKey = (sceneId) => sceneId.split("_")[0];
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** The scene's elements from the props, with a visibility guess for headlines named after their cue. */
function elements(scene, props, tl) {
  const block = props?.scenes?.[propsKey(scene.id)];
  if (!block || typeof block !== "object") return [];
  const out = [];
  for (const [key, v] of Object.entries(block)) {
    const p = `scenes.${propsKey(scene.id)}.${key}`;
    if (v && typeof v === "object" && Array.isArray(v.lines)) {
      const cue = scene.cues.find((c) => norm(c.id) === norm(key));
      let visible = null;
      if (cue && typeof v.offset === "number") {
        const start = cue.start + v.offset;
        visible = tl >= start && (!v.holdUntil || tl < v.holdUntil + 0.35);
      }
      out.push({ path: `${p}.lines`, kind: "headline", text: v.lines.join(" / "), visible });
    } else if (v && typeof v === "object" && typeof v.text === "string") {
      out.push({ path: `${p}.text`, kind: "text", text: v.text, visible: null });
    } else if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
      out.push({ path: p, kind: "text", text: v.join(" / "), visible: null });
    } else if (typeof v === "string") {
      out.push({ path: p, kind: "text", text: v, visible: null });
    }
  }
  return out;
}

/** Full description of where the user is. state = what the bridge reported (or null). */
export function describe(dir, state) {
  const proj = loadProject(dir);
  if (!state) return { live: false, reason: "Studio has not reported yet (is the project open in the engine?)" };
  const fps = state.fps ?? proj.fps;
  const preview = proj.scenes.find((s) => s.preview === state.composition);
  const globalFrame = preview ? state.frame + Math.round(preview.start * fps) : state.frame;
  const t = globalFrame / fps;
  const scene = sceneAt(proj, t);
  const tl = scene ? t - scene.start : t;
  const cues = scene?.cues ?? [];
  const cur = [...cues].reverse().find((c) => tl >= c.start) ?? null;
  const next = cues.find((c) => c.start > tl) ?? null;
  return {
    live: !!state.connected,
    ageSeconds: Math.round((Date.now() - state.updatedAt) / 1000),
    composition: state.composition,
    frame: globalFrame,
    time: t,
    timeLabel: fmtTime(t),
    fps,
    scene: scene ? { number: scene.number, id: scene.id, title: scene.title, start: scene.start, localTime: Number(tl.toFixed(2)) } : null,
    cue: cur ? { id: cur.id, text: cur.text, speaking: tl < cur.end, start: cur.start, end: cur.end } : null,
    nextCue: next ? { id: next.id, text: next.text, in: Number((next.start - tl).toFixed(2)) } : null,
    elements: scene ? elements(scene, state.props, tl) : [],
  };
}

/** One compact paragraph, for the hook that prefixes each prompt. view = the engine page's open tab. */
export function contextText(d, view = "editor") {
  if (view === "brief") return "The user is on the content engine's Brief page (the plan board on the left), not watching the video in the editor. Words like this/here refer to the plan, the board or this conversation.";
  if (view === "publish") return "The user is on the content engine's Publish tab (YouTube upload, Facebook Page and Instagram drafts in publish/<platform>.json). The publish_status tool shows what they see.";
  if (view === "final") return "The user is on the content engine's Final tab (the final render queue: steps, progress, errors). The render_status tool shows what they see.";
  if (!d.live) return null;
  const parts = [`The user is in the video editor at ${d.timeLabel} (frame ${d.frame}, composition ${d.composition}).`];
  if (d.scene) parts.push(`Scene ${String(d.scene.number).padStart(2, "0")} "${d.scene.title}" (${d.scene.id}), ${d.scene.localTime}s into the scene.`);
  if (d.cue) parts.push(`Narration ${d.cue.speaking ? "being spoken" : "last spoken"}: [${d.cue.id}] "${d.cue.text}".`);
  const vis = d.elements.filter((e) => e.visible === true);
  if (vis.length) parts.push(`On screen: ${vis.map((e) => `${e.path} "${e.text}"`).join("; ")}.`);
  parts.push("Words like this/here/now refer to that moment. Engine tools: editor_state, view_frame, seek, show_setting.");
  return parts.join(" ");
}

/** Scene/cue table with global start times. */
export function timelineText(dir) {
  const proj = loadProject(dir);
  const rows = [`${proj.title} — ${fmtTime(proj.total)} at ${proj.fps} fps`];
  for (const s of proj.scenes) {
    rows.push(`\n${String(s.number).padStart(2, "0")} ${s.title} (${s.id})  ${fmtTime(s.start)}–${fmtTime(s.start + s.duration)}  preview: ${s.preview}`);
    for (const c of s.cues) rows.push(`   ${fmtTime(s.start + c.start)}  [${c.id}] ${c.text}`);
  }
  return rows.join("\n");
}
