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
