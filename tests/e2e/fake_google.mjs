// A fake Google for testing the engine's YouTube code: OAuth (PKCE checked), token refresh, channels.list, and the
// resumable upload protocol. Faults are armed through POST /debug/faults {dropAt, busyAt, expireAt} (byte offsets).
import crypto from "node:crypto";
import http from "node:http";

const PORT = 4180;
const codes = new Map(); // code -> challenge
const tokens = new Map(); // access token -> expiry
let refresh = null;
const sessions = new Map(); // id -> { total, received, chunks, metadata, done, video }
let faults = {};
const log = [];
const SHORT = Number(process.env.FAKE_TOKEN_SECONDS ?? 3600);

const json = (res, status, body, headers = {}) => {
  res.writeHead(status, { "content-type": "application/json", ...headers });
  res.end(JSON.stringify(body));
};
const body = (req) =>
  new Promise((r) => {
    const parts = [];
    req.on("data", (d) => parts.push(d));
    req.on("end", () => r(Buffer.concat(parts)));
  });
const authed = (req) => {
  const t = /^Bearer (.+)$/.exec(req.headers.authorization ?? "")?.[1];
  return t && tokens.has(t) && tokens.get(t) > Date.now();
};
const newAccess = () => {
  const t = "at_" + crypto.randomBytes(8).toString("hex");
  tokens.set(t, Date.now() + SHORT * 1000);
  return t;
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    log.push(`${req.method} ${url.pathname}`);
    // --- OAuth
    if (url.pathname === "/auth") {
      const code = "code_" + crypto.randomBytes(6).toString("hex");
      codes.set(code, { challenge: url.searchParams.get("code_challenge"), redirect: url.searchParams.get("redirect_uri"), scope: url.searchParams.get("scope") });
      const back = new URL(url.searchParams.get("redirect_uri"));
      back.searchParams.set("code", code);
      back.searchParams.set("state", url.searchParams.get("state"));
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }
    if (url.pathname === "/token") {
      const q = new URLSearchParams((await body(req)).toString());
      if (q.get("grant_type") === "authorization_code") {
        const c = codes.get(q.get("code"));
        codes.delete(q.get("code"));
        const ok = c && crypto.createHash("sha256").update(q.get("code_verifier") ?? "").digest("base64url") === c.challenge && q.get("redirect_uri") === c.redirect;
        if (!ok) return json(res, 400, { error: "invalid_grant", error_description: "PKCE or redirect mismatch" });
        refresh = "rt_" + crypto.randomBytes(8).toString("hex");
        return json(res, 200, { access_token: newAccess(), refresh_token: refresh, expires_in: SHORT, scope: c.scope });
      }
      if (q.get("grant_type") === "refresh_token") {
        if (q.get("refresh_token") !== refresh) return json(res, 400, { error: "invalid_grant" });
        return json(res, 200, { access_token: newAccess(), expires_in: SHORT });
      }
      return json(res, 400, { error: "unsupported_grant_type" });
    }
    // --- API
    if (url.pathname === "/youtube/v3/channels") {
      if (!authed(req)) return json(res, 401, { error: { code: 401, message: "auth" } });
      return json(res, 200, { items: [{ id: "UCfake123", snippet: { title: "Fake Test Channel" } }] });
    }
    if (url.pathname === "/upload/youtube/v3/videos" && req.method === "POST") {
      if (!authed(req)) return json(res, 401, { error: { code: 401, message: "auth" } });
      const metadata = JSON.parse((await body(req)).toString());
      const id = crypto.randomBytes(6).toString("hex");
      sessions.set(id, { total: Number(req.headers["x-upload-content-length"]), received: 0, chunks: 0, metadata, part: url.searchParams.get("part"), uploadType: url.searchParams.get("uploadType") });
      res.writeHead(200, { location: `http://127.0.0.1:${PORT}/session/${id}` });
      return res.end();
    }
    if (url.pathname.startsWith("/session/") && req.method === "PUT") {
      const s = sessions.get(url.pathname.split("/")[2]);
      if (!s) return json(res, 404, { error: { code: 404, message: "session expired" } });
      if (faults.expireAt != null && s.received >= faults.expireAt) {
        faults.expireAt = null;
        tokens.clear(); // every access token dies: the engine must refresh
      }
      if (!authed(req)) return json(res, 401, { error: { code: 401, message: "auth" } });
      const range = req.headers["content-range"] ?? "";
      const data = await body(req);
      const done = () => {
        s.done = true;
        json(res, 201, { id: "vid_" + url.pathname.split("/")[2], status: { privacyStatus: s.metadata.status?.privacyStatus } });
      };
      const partial = () => {
        res.writeHead(308, s.received ? { range: `bytes=0-${s.received - 1}` } : {});
        res.end();
      };
      if (range.startsWith("bytes */")) return s.received === s.total ? done() : partial();
      const m = /bytes (\d+)-(\d+)\/(\d+)/.exec(range);
      if (!m || Number(m[1]) !== s.received) return json(res, 400, { error: { code: 400, message: `bad range ${range}, have ${s.received}` } });
      if (faults.dropAt != null && s.received >= faults.dropAt) {
        // keep half of this chunk, then drop the connection without answering
        faults.dropAt = null;
        s.received += Math.floor(data.length / 2 / 262144) * 262144;
        return req.socket.destroy();
      }
      if (faults.busyAt != null && s.received >= faults.busyAt) {
        faults.busyAt = null;
        return json(res, 503, { error: { code: 503, message: "backend busy" } });
      }
      if (data.length !== Number(m[2]) - Number(m[1]) + 1) return json(res, 400, { error: { code: 400, message: "length mismatch" } });
      if (faults.delayMs) await new Promise((r) => setTimeout(r, faults.delayMs));
      s.received += data.length;
      s.chunks++;
      return s.received === s.total ? done() : partial();
    }
    // --- test controls
    if (url.pathname === "/debug/faults" && req.method === "POST") {
      faults = JSON.parse((await body(req)).toString() || "{}");
      return json(res, 200, faults);
    }
    if (url.pathname === "/debug/revoke" && req.method === "POST") {
      refresh = null;
      tokens.clear();
      return json(res, 200, { revoked: true });
    }
    if (url.pathname === "/debug") return json(res, 200, { sessions: [...sessions.entries()].map(([id, s]) => ({ id, ...s })), log: log.slice(-60), faults });
    json(res, 404, { error: { code: 404, message: "not found" } });
  })
  .listen(PORT, "127.0.0.1", () => console.log("fake google on", PORT));
