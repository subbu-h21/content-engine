/**
 * MCP tools for Claude Code, one endpoint per project: /mcp/<project-folder>.
 * Stateless: every request gets a fresh server + transport (the documented pattern for the SDK's stateless mode).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { command, getState, waitForState } from "./bridge.mjs";
import { describe, loadProject, parseTime, timelineText } from "./context.mjs";
import { renderFrame } from "./frames.mjs";
import { computePlan, getJob, liveInfo, resumeJob, startJob, stopJob } from "./render.mjs";
import { draftProblems, getDraft, getState as publishState, report as publishReport, startYouTube, videoInfo, youtubeLive } from "./publish.mjs";
import { status as youtubeStatus } from "./youtube.mjs";

const text = (t) => ({ content: [{ type: "text", text: t }] });
const json = (o) => text(JSON.stringify(o, null, 2));

function buildServer(name, dir) {
  const server = new McpServer({ name: "content-engine", version: "0.2.0" });

  server.registerTool(
    "editor_state",
    {
      title: "Where the user is in the editor",
      description:
        "What the user is looking at in Remotion Studio right now: playhead time and frame, scene, the narration line, " +
        "and the scene's on-screen elements with their prop paths (edit those in src/Root.tsx). Call this whenever the user " +
        "says this/here/now or refers to what they see.",
      inputSchema: {},
    },
    async () => json(describe(dir, getState(name))),
  );

  server.registerTool(
    "timeline",
    {
      title: "Scenes and narration with times",
      description: "Every scene and narration cue with its start time in the video (m:ss.cc), plus each scene's preview composition id.",
      inputSchema: {},
    },
    async () => text(timelineText(dir)),
  );

  server.registerTool(
    "view_frame",
    {
      title: "Look at a frame",
      description:
        "Renders one frame of the full video (saved files, half resolution) and returns it as an image, so you can see " +
        "exactly what is on screen. Defaults to the user's current playhead. Takes 10-20 s.",
      inputSchema: {
        time: z.union([z.number(), z.string()]).optional().describe('time in the video: seconds (41.2) or "0:41.2"; omit for the current playhead'),
        frame: z.number().int().nonnegative().optional().describe("frame number instead of time"),
      },
    },
    async ({ time, frame }) => {
      const proj = loadProject(dir);
      let f = frame;
      if (f === undefined && time !== undefined) f = Math.round(parseTime(time) * proj.fps);
      if (f === undefined) {
        const d = describe(dir, getState(name));
        if (!d.live && d.frame === undefined) return text("No playhead reported; pass a time.");
        f = d.frame;
      }
      const max = Math.round(proj.total * proj.fps) - 1;
      f = Math.max(0, Math.min(max, f));
      const img = await renderFrame(dir, f);
      return {
        content: [
          { type: "image", data: img.toString("base64"), mimeType: "image/jpeg" },
          { type: "text", text: `Frame ${f} (${(f / proj.fps).toFixed(2)} s), composition Reel, half resolution.` },
        ],
      };
    },
  );

  server.registerTool(
    "seek",
    {
      title: "Move the playhead",
      description: "Moves the user's Studio playhead to a time in the full video (switches Studio to the Reel composition if needed).",
      inputSchema: {
        time: z.union([z.number(), z.string()]).describe('seconds (41.2) or "0:41.2"'),
      },
    },
    async ({ time }) => {
      const proj = loadProject(dir);
      const f = Math.max(0, Math.min(Math.round(proj.total * proj.fps) - 1, Math.round(parseTime(time) * proj.fps)));
      const st = getState(name);
      if (st && st.composition !== "Reel") {
        const g = await command(name, { type: "goto", composition: "Reel" });
        if (!g.ok) return text(`Could not switch to Reel: ${g.detail}`);
        await waitForState(name, (s) => s.composition === "Reel" && s.connected);
      }
      const r = await command(name, { type: "seek", frame: f });
      if (!r.ok) return text(`Seek failed: ${r.detail}`);
      const after = await waitForState(name, (s) => s.composition === "Reel" && s.frame === f);
      return json({ requestedFrame: f, ...describe(dir, after) });
    },
  );

  server.registerTool(
    "playback",
    {
      title: "Play or pause",
      description: "Starts or pauses playback in the user's Studio.",
      inputSchema: { action: z.enum(["play", "pause"]) },
    },
    async ({ action }) => {
      const r = await command(name, { type: action });
      return text(r.ok ? `${action} sent` : `Failed: ${r.detail}`);
    },
  );

  server.registerTool(
    "show_setting",
    {
      title: "Show the user a setting",
      description:
        'Opens Studio\'s props editor (Inspector → Default Props of "Reel") at a prop path and scrolls it into view, e.g. ' +
        '"scenes.s01.who.lines", so the user can see or change it themselves.',
      inputSchema: { path: z.string().describe('dot path, e.g. "scenes.s06.circuits.size"') },
    },
    async ({ path }) => {
      const parts = path.split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : p));
      const st = getState(name);
      if (st && st.composition !== "Reel") {
        await command(name, { type: "goto", composition: "Reel" });
        await waitForState(name, (s) => s.composition === "Reel" && s.connected);
      }
      const r = await command(name, { type: "focus", path: parts });
      return text(r.ok ? `Showing ${path} in the props editor.` : `Could not show ${path}: ${r.detail}. Ask the user to press Esc in Studio and try again.`);
    },
  );

  // ---- final render queue (the engine runs it in the background; the user sees it on the Final tab)
  const renderState = () => {
    const job = getJob(name, dir);
    const plan = computePlan(dir);
    return {
      job: job
        ? {
            status: job.status,
            error: job.error,
            options: job.options,
            autoFixUsed: job.autoFixUsed,
            steps: job.steps.map((s) => ({ id: s.id, label: s.label, status: s.status, progress: s.progress, error: s.error, log: s.log })),
            outputs: job.outputs,
          }
        : null,
      live: liveInfo(name),
      plan: { problems: plan.problems, plates: plan.plates.map(({ folder, ...p }) => p), estimatedMinutes: Math.round(plan.estSeconds / 60), diskNeededGB: Math.ceil(plan.needBytes / 1e9) },
    };
  };

  server.registerTool(
    "render_status",
    {
      title: "Final render status",
      description:
        "The final render of this video: the job's steps, progress, errors (with log paths in the project) and what a new render would involve " +
        "(problems that block it, 3D plates and their frames, time and disk estimates).",
      inputSchema: {},
    },
    async () => json(renderState()),
  );

  server.registerTool(
    "render_start",
    {
      title: "Start the final render",
      description:
        "Queues the final render (3D final frames, plate encoding, video, upload file) in the engine's background queue. Can take hours with 3D. " +
        "Only call this when the user has asked for the final render. rerender: plate ids whose existing final frames should be deleted and rendered again.",
      inputSchema: { rerender: z.array(z.string()).optional() },
    },
    async ({ rerender }) => {
      try {
        startJob(name, dir, { rerender: rerender ?? [], autoFix: true });
        return json({ started: true, ...renderState() });
      } catch (e) {
        return text(`Not started: ${e.message}`);
      }
    },
  );

  server.registerTool(
    "render_resume",
    {
      title: "Resume the final render",
      description: "Resumes a failed, stopped or interrupted final render where it stopped (finished frames and steps are kept). Use after fixing the cause of a failure.",
      inputSchema: {},
    },
    async () => {
      try {
        resumeJob(name, dir);
        return json({ resumed: true, ...renderState() });
      } catch (e) {
        return text(`Not resumed: ${e.message}`);
      }
    },
  );

  server.registerTool(
    "render_stop",
    {
      title: "Stop the final render",
      description: "Stops the running or queued final render; finished frames are kept and Resume continues later. Only when the user asks.",
      inputSchema: {},
    },
    async () => {
      try {
        stopJob(name, dir);
        return text("Stopped. Finished frames are kept; resume continues where it stopped.");
      } catch (e) {
        return text(e.message);
      }
    },
  );

  // ---- publishing (the user sees it on the Publish tab)
  server.registerTool(
    "publish_status",
    {
      title: "Publishing status",
      description:
        "The finished video (out/delivery.mp4: length, shape, notes per platform), the drafts in publish/<platform>.json with their problems, " +
        "and what happened per platform: YouTube upload progress/result, Facebook/Instagram reports. YouTube connection and channel.",
      inputSchema: {},
    },
    async () => {
      const drafts = Object.fromEntries(["youtube", "facebook", "instagram"].map((p) => [p, getDraft(dir, p)]));
      return json({
        video: await videoInfo(dir),
        drafts,
        problems: Object.fromEntries(Object.entries(drafts).map(([p, d]) => [p, draftProblems(p, d)])),
        state: publishState(dir),
        youtube: { ...youtubeStatus(), live: youtubeLive(name) },
      });
    },
  );

  server.registerTool(
    "publish_report",
    {
      title: "Report a Facebook/Instagram post",
      description:
        'Record what happened when posting through Chrome: status "ready-to-post" (everything filled in, waiting for the user to click Post), ' +
        '"posted" (with the post url if you can find it), or "failed" (with a short note). The Publish tab shows it.',
      inputSchema: {
        platform: z.enum(["facebook", "instagram"]),
        status: z.enum(["ready-to-post", "posted", "failed"]),
        url: z.string().optional(),
        note: z.string().optional(),
      },
    },
    async ({ platform, status, url, note }) => json(publishReport(dir, platform, { status, url: url ?? null, note: note ?? null })),
  );

  server.registerTool(
    "youtube_upload",
    {
      title: "Upload the finished video to YouTube",
      description:
        "Starts (or resumes) the YouTube upload of out/delivery.mp4 with the draft in publish/youtube.json, in the engine's background queue. " +
        "Only call this when the user has asked for the upload.",
      inputSchema: {},
    },
    async () => {
      try {
        return json(await startYouTube(name, dir));
      } catch (e) {
        return text(`Not started: ${e.message}`);
      }
    },
  );

  return server;
}

/** Express handlers for /mcp/:project (POST only in stateless mode). */
export async function handleMcp(req, res, name, dir) {
  const server = buildServer(name, dir);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
