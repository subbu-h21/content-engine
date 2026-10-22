// A fake Meta (Graph API v26.0) for testing the engine's Facebook / Instagram posting: Facebook Login (code flow),
// token exchange, /me, /me/accounts (two Pages, the first with a linked Instagram account), Page Reels (start, rupload,
// finish, status), Page video posts (upload session, upload, /videos), Instagram Reels (container, rupload, status,
// media_publish, permalink). Everything on one port (graph, graph-video, rupload and the login dialog).
// Faults through POST /debug/faults: { dropAt: bytes (drop one upload connection after that many bytes),
// slowPolls: n (processing needs n status checks), failPublish: true (Instagram media_publish errors once),
// igProcessingFail: n (the next n Instagram uploads are taken but "couldn't be processed", and never finish),
// igProcessingSays: n (the next n say so but finish anyway) }.
import crypto from "node:crypto";
import http from "node:http";

const PORT = 4181;
const BASE = `http://127.0.0.1:${PORT}`;
const APP = { id: "1234567890", secret: "0123456789abcdef0123456789abcdef" };
const codes = new Map(); // code -> redirect
const users = new Set(); // valid user tokens
const PAGES = [
  { id: "1001", name: "Daily Insights", link: "https://www.facebook.com/dailyinsights", token: "EAApage1001", tasks: ["CREATE_CONTENT", "MANAGE"], ig: { id: "17841400000000001", username: "daily_insights21" } },
  { id: "1002", name: "Second Page", link: "https://www.facebook.com/secondpage", token: "EAApage1002", tasks: ["CREATE_CONTENT"], ig: null },
];
const videos = new Map(); // reel video id -> { page, size, received, finishCalls, polls, published, description }
const sessions = new Map(); // upload session id -> { size, received, file_name }
const pagePosts = []; // { id, page, title, description, created_time, handle }
const containers = new Map(); // container id -> { ig, size, received, caption, share_to_feed, polls, status, faststart }
const media = []; // { id, ig, container, timestamp, permalink }
let faults = {};
const log = [];

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};
const err = (res, status, code, message) => json(res, status, { error: { message, type: "OAuthException", code } });
const readBody = (req) =>
  new Promise((r) => {
    const parts = [];
    req.on("data", (d) => parts.push(d));
    req.on("end", () => r(Buffer.concat(parts)));
  });
const pageByToken = (t) => PAGES.find((p) => p.token === t);
const tokenOf = (req, q) => q.get("access_token") ?? /^OAuth (.+)$/.exec(req.headers.authorization ?? "")?.[1] ?? null;
/** top-level MP4 boxes until moov or mdat: is the index at the front? */
const isFaststart = (buf) => {
  let pos = 0;
  while (pos + 8 <= buf.length) {
    const size = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    if (type === "moov") return true;
    if (type === "mdat" || size < 8) return false;
    pos += size;
  }
  return false;
};

/** An rupload POST: append the body at the `offset` header; a dropAt fault cuts the connection half way. */
async function receive(req, res, target, keepHead) {
  const offset = Number(req.headers.offset ?? req.headers.file_offset ?? 0);
  const total = Number(req.headers.file_size ?? target.size);
  if (offset !== Math.min(offset, target.received)) return err(res, 400, 100, `offset ${offset} is past what arrived (${target.received})`);
  target.size = total;
  const chunks = [];
  let got = 0;
  let dropped = false;
  await new Promise((resolve) => {
    req.on("data", (d) => {
      if (dropped) return;
      chunks.push(d);
      got += d.length;
      if (faults.dropAt != null && offset + got >= faults.dropAt) {
        faults.dropAt = null;
        dropped = true;
        target.received = offset + got;
        req.socket.destroy();
        resolve();
      }
    });
    req.on("end", resolve);
    req.on("close", resolve);
  });
  if (dropped) return;
  const data = Buffer.concat(chunks);
  if (keepHead && offset === 0) target.head = data.subarray(0, 4096);
  target.received = offset + data.length;
  if (target.received !== total) return err(res, 400, 100, `got ${target.received} of ${total} bytes`);
  return true;
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, BASE);
    const q = req.method === "GET" ? url.searchParams : new URLSearchParams(/x-www-form-urlencoded/.test(req.headers["content-type"] ?? "") ? (await readBody(req)).toString() : "");
    for (const [k, v] of url.searchParams) if (!q.has(k)) q.set(k, v);
    log.push(`${req.method} ${url.pathname}`);
    const seg = url.pathname.replace(/^\/v26\.0/, "").split("/").filter(Boolean);

    // --- Facebook Login
    if (url.pathname === "/v26.0/dialog/oauth") {
      if (q.get("client_id") !== APP.id) return err(res, 400, 191, "Invalid App ID");
      const code = "code" + crypto.randomBytes(6).toString("hex");
      codes.set(code, q.get("redirect_uri"));
      const back = new URL(q.get("redirect_uri"));
      back.searchParams.set("code", code);
      back.searchParams.set("state", q.get("state"));
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }
    if (url.pathname === "/v26.0/oauth/access_token") {
      if (q.get("client_id") !== APP.id || q.get("client_secret") !== APP.secret) return err(res, 400, 1, "Error validating client secret");
      if (q.get("grant_type") === "fb_exchange_token") {
        if (!users.has(q.get("fb_exchange_token")) && !q.get("fb_exchange_token").startsWith("EAApasted")) return err(res, 400, 190, "Invalid OAuth access token");
        const t = "EAAlong" + crypto.randomBytes(20).toString("hex");
        users.add(t);
        return json(res, 200, { access_token: t, token_type: "bearer", expires_in: 5183944 });
      }
      const redirect = codes.get(q.get("code"));
      codes.delete(q.get("code"));
      if (!redirect || redirect !== q.get("redirect_uri")) return err(res, 400, 100, "redirect_uri mismatch or bad code");
      const t = "EAAshort" + crypto.randomBytes(20).toString("hex");
      users.add(t);
      return json(res, 200, { access_token: t, token_type: "bearer", expires_in: 3600 });
    }

    // --- uploads (rupload): Page Reels and Instagram containers
    if (seg[0] === "video-upload" && req.method === "POST") {
      const v = videos.get(seg[2]);
      if (!v) return err(res, 404, 100, "no such video");
      if (tokenOf(req, q) !== PAGES.find((p) => p.id === v.page).token) return err(res, 401, 190, "bad token");
      if ((await receive(req, res, v, false)) === true) json(res, 200, { success: true });
      return;
    }
    if (seg[0] === "ig-api-upload" && req.method === "POST") {
      const c = containers.get(seg[2]);
      if (!c) return err(res, 404, 100, "no such container");
      if ((await receive(req, res, c, true)) === true) {
        c.faststart = isFaststart(c.head ?? Buffer.alloc(0));
        // what the real rupload says for a file it took but couldn't process: the container never finishes, or
        // (igProcessingSays) it finishes anyway
        const dead = faults.igProcessingFail > 0;
        if (dead || faults.igProcessingSays > 0) {
          if (dead) faults.igProcessingFail--;
          else faults.igProcessingSays--;
          c.dead = dead;
          return json(res, 400, { debug_info: { retriable: false, type: "ProcessingFailedError", message: "Request processing failed" } });
        }
        c.status = "IN_PROGRESS";
        json(res, 200, { success: true, message: "Upload successful." });
      }
      return;
    }

    // --- test controls
    if (url.pathname === "/debug/faults" && req.method === "POST") {
      faults = JSON.parse((await readBody(req)).toString() || "{}");
      return json(res, 200, faults);
    }
    if (url.pathname === "/debug")
      return json(res, 200, {
        videos: [...videos.entries()].map(([id, v]) => ({ id, ...v })),
        sessions: [...sessions.entries()].map(([id, s]) => ({ id, ...s })),
        pagePosts,
        containers: [...containers.entries()].map(([id, c]) => ({ id, ...c, head: undefined })),
        media,
        log: log.slice(-80),
      });

    // --- Graph API
    const token = tokenOf(req, q);
    const user = users.has(token);
    const page = pageByToken(token);
    if (seg[0] === "me") {
      if (!user) return err(res, 400, 190, "Invalid OAuth access token");
      if (seg[1] === "permissions") return json(res, 200, { data: ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "instagram_basic", "instagram_content_publish"].map((permission) => ({ permission, status: "granted" })) });
      if (seg[1] === "accounts")
        return json(res, 200, { data: PAGES.map((p) => ({ id: p.id, name: p.name, link: p.link, access_token: p.token, tasks: p.tasks, ...(p.ig ? { instagram_business_account: { id: p.ig.id, username: p.ig.username } } : {}) })) });
      return json(res, 200, { id: "9001", name: "Test User" });
    }
    // Page Reels
    if (seg[1] === "video_reels" && req.method === "POST") {
      const p = PAGES.find((x) => x.id === seg[0]);
      if (!p || token !== p.token) return err(res, 400, 190, "a Page token is needed");
      if (q.get("upload_phase") === "start") {
        const id = String(5000 + videos.size);
        videos.set(id, { page: p.id, size: 0, received: 0, finishCalls: 0, polls: 0, published: false });
        return json(res, 200, { video_id: id, upload_url: `${BASE}/video-upload/v26.0/${id}` });
      }
      if (q.get("upload_phase") === "finish") {
        const v = videos.get(q.get("video_id"));
        if (!v || v.received !== v.size || !v.size) return err(res, 400, 6000, "There was a problem uploading your video file.");
        v.finishCalls++;
        v.description = q.get("description");
        v.state = q.get("video_state");
        return json(res, 200, { success: true });
      }
    }
    // Resumable Upload API (Page video posts)
    if (seg.length === 2 && seg[1] === "uploads" && req.method === "POST") {
      if (seg[0] !== APP.id || !user) return err(res, 400, 190, "a user token is needed");
      const id = "upload:" + crypto.randomBytes(5).toString("hex");
      sessions.set(id, { size: Number(q.get("file_length")), received: 0, file_name: q.get("file_name") });
      return json(res, 200, { id });
    }
    if (seg[0]?.startsWith("upload:")) {
      const s = sessions.get(seg[0]);
      if (!s) return err(res, 404, 100, "no such session");
      if (!users.has(token)) return err(res, 400, 190, "a user token is needed in the header");
      if (req.method === "GET") return json(res, 200, { id: seg[0], file_offset: s.received });
      req.headers.offset = req.headers.file_offset;
      if ((await receive(req, res, s, false)) === true) json(res, 200, { h: "handle-" + seg[0].slice(7) });
      return;
    }
    if (seg[1] === "videos") {
      const p = PAGES.find((x) => x.id === seg[0]);
      if (!p || token !== p.token) return err(res, 400, 190, "a Page token is needed");
      if (req.method === "GET") return json(res, 200, { data: pagePosts.filter((v) => v.page === p.id).map((v) => ({ id: v.id, description: v.description, created_time: v.created_time, permalink_url: `/${p.id}/videos/${v.id}/` })) });
      const h = q.get("fbuploader_video_file_chunk");
      const s = [...sessions.entries()].find(([id]) => h === "handle-" + id.slice(7))?.[1];
      if (!s || s.received !== s.size) return err(res, 400, 100, "unknown or incomplete file handle");
      const id = String(7000 + pagePosts.length);
      pagePosts.push({ id, page: p.id, title: q.get("title"), description: q.get("description"), created_time: new Date().toISOString(), handle: h });
      return json(res, 200, { id });
    }
    // Instagram
    const ig = PAGES.find((x) => x.ig?.id === seg[0]);
    if (ig) {
      if (!user && token !== ig.token) return err(res, 400, 190, "Invalid OAuth access token");
      if (seg[1] === "content_publishing_limit") return json(res, 200, { data: [{ quota_usage: media.filter((m) => m.ig === seg[0]).length, config: { quota_total: 100, quota_duration: 86400 } }] });
      if (seg[1] === "media" && req.method === "POST") {
        if (q.get("media_type") !== "REELS" || q.get("upload_type") !== "resumable") return err(res, 400, 100, "expected a resumable REELS container");
        const id = String(17900000 + containers.size);
        containers.set(id, { ig: seg[0], size: 0, received: 0, caption: q.get("caption"), share_to_feed: q.get("share_to_feed"), polls: 0, status: "IN_PROGRESS" });
        return json(res, 200, { id, uri: `${BASE}/ig-api-upload/v26.0/${id}` });
      }
      if (seg[1] === "media" && req.method === "GET") return json(res, 200, { data: media.filter((m) => m.ig === seg[0]).reverse().map((m) => ({ id: m.id, timestamp: m.timestamp })) });
      if (seg[1] === "media_publish") {
        const c = containers.get(q.get("creation_id"));
        if (!c || c.status !== "FINISHED") return err(res, 400, 9007, "Media ID is not available");
        if (faults.failPublish) {
          faults.failPublish = false;
          return err(res, 500, 2, "Service temporarily unavailable");
        }
        c.status = "PUBLISHED";
        const id = String(18000000 + media.length);
        media.push({ id, ig: seg[0], container: q.get("creation_id"), timestamp: new Date().toISOString(), permalink: `https://www.instagram.com/reel/FAKE${id}/` });
        return json(res, 200, { id });
      }
    }
    // single objects: a Reel's status, a container's status, a media's permalink, a post's permalink
    if (seg.length === 1 && req.method === "GET") {
      const v = videos.get(seg[0]);
      if (v) {
        const done = v.finishCalls > 0 && ++v.polls > (faults.slowPolls ?? 1);
        if (done) v.published = true;
        return json(res, 200, {
          id: seg[0],
          permalink_url: `/reel/${seg[0]}`,
          status: {
            video_status: done ? "ready" : v.received === v.size && v.size ? "processing" : "uploading",
            uploading_phase: { status: v.received === v.size && v.size ? "complete" : "in_progress", bytes_transfered: v.received },
            processing_phase: { status: v.finishCalls ? (done ? "complete" : "in_progress") : "not_started" },
            publishing_phase: { status: done ? "complete" : "not_started", publish_status: done ? "published" : "draft" },
          },
        });
      }
      const c = containers.get(seg[0]);
      if (c) {
        if (c.status === "IN_PROGRESS" && !c.dead && c.received === c.size && c.size && ++c.polls > (faults.slowPolls ?? 1)) c.status = "FINISHED";
        return json(res, 200, { id: seg[0], status_code: c.status, status: c.status === "ERROR" ? "Error: unsupported video" : c.status });
      }
      const m = media.find((x) => x.id === seg[0]);
      if (m) return json(res, 200, { id: m.id, permalink: m.permalink });
      const pp = pagePosts.find((x) => x.id === seg[0]);
      if (pp) return json(res, 200, { id: pp.id, permalink_url: `/${pp.page}/videos/${pp.id}/` });
    }
    err(res, 404, 100, `fake meta: no route for ${req.method} ${url.pathname}`);
  })
  .listen(PORT, "127.0.0.1", () => console.log("fake meta on", PORT));
