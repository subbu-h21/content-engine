/**
 * The phone viewer: a small read-only page that lists and plays the finished videos, for watching them away from the
 * PC through a tunnel (cloudflared). It is separate from the engine website on purpose: the website can run Claude,
 * delete videos and post to the user's accounts, so it only answers this PC (127.0.0.1:4100, foreign Host refused).
 * The viewer can do nothing but show the video files each project offers in out/ (the Publish page's rules), and only
 * with its secret key.
 *
 *   ce viewer [--tunnel] [--new-key]        (viewer.bat runs `ce viewer --tunnel`)
 *
 * - Listens on 127.0.0.1 only, port settings.viewerPort | CE_VIEWER_PORT | 4200; cloudflared reaches it locally.
 * - Any Host is accepted (the tunnel's changes), but every request needs the key: ?k=<key>. The key is made on the
 *   first start and kept in secrets/viewer-key.txt (git-ignored); --new-key replaces it (old links stop working).
 * - GET and HEAD only. Files are served only if they're on the list (no paths from the request reach the disk).
 *   Videos stream with Range requests (phones seek with them). Referrer-Policy no-referrer keeps the key out of
 *   other sites' logs.
 * No console output and no process exits here: `ce viewer` prints and decides.
 */
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { listProjects } from "./projects.mjs";

const TYPES = new Map([
  [".mp4", "video/mp4"],
  [".m4v", "video/mp4"],
  [".mov", "video/quicktime"],
  [".webm", "video/webm"],
  [".mkv", "video/x-matroska"],
]);
const SKIP_DIRS = new Set(["render", "check"]); // out/render = the render queue's temp files; out/check = stills
const FINAL = "out/delivery.mp4";

/** Video files a project offers, newest first: the same rules as the Publish page (app/server/publish.mjs listVideos). */
export function projectVideos(dir) {
  const found = [];
  const walk = (d, depth) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (depth === 0 && !SKIP_DIRS.has(e.name)) walk(full, 1);
      } else if (e.isFile() && TYPES.has(path.extname(e.name).toLowerCase())) {
        const st = fs.statSync(full);
        if (st.size > 0) found.push({ rel: path.relative(dir, full).replace(/\\/g, "/"), size: st.size, mtime: st.mtimeMs });
      }
    }
  };
  walk(path.join(dir, "out"), 0);
  const hasFinal = found.some((f) => f.rel === FINAL);
  return found
    .filter((f) => !(hasFinal && f.rel === "out/video.mp4"))
    .map((f) => ({ ...f, kind: f.rel === FINAL ? "Final" : f.rel === "out/video.mp4" ? "Render" : /draft/i.test(path.basename(f.rel)) ? "Draft" : "Render" }))
    .sort((a, b) => (a.kind === "Final" ? -1 : b.kind === "Final" ? 1 : b.mtime - a.mtime));
}

/** Every engine project in the workspace that has at least one video, newest project first. */
export function allVideos(workspace) {
  if (!workspace || !fs.existsSync(workspace)) return [];
  return listProjects(workspace)
    .filter((p) => p.engine)
    .map((p) => ({ name: p.name, number: p.number, title: p.title || p.name, dir: p.dir, videos: projectVideos(p.dir) }))
    .filter((p) => p.videos.length);
}

/** The viewer's key: read from secrets/viewer-key.txt, made (or replaced with `renew`) when needed. */
export function viewerKey(secretsDir, renew = false) {
  const file = path.join(secretsDir, "viewer-key.txt");
  if (!renew && fs.existsSync(file)) {
    const k = fs.readFileSync(file, "utf8").trim();
    if (k.length >= 24) return k;
  }
  fs.mkdirSync(secretsDir, { recursive: true });
  const k = crypto.randomBytes(24).toString("base64url");
  fs.writeFileSync(file, k + "\n");
  return k;
}

const keyMatches = (given, key) => {
  const a = Buffer.from(String(given ?? ""));
  const b = Buffer.from(key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const mb = (n) => `${(n / 1048576).toFixed(n < 10485760 ? 1 : 0)} MB`;
const when = (ms) => {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0b0b0d;color:#f2f2f4;font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:640px;margin:0 auto;padding:20px 16px 48px}
h1{font-size:26px;margin:4px 0 18px}
h2{font-size:18px;margin:26px 0 8px}
.sub{color:#9a9aa2;font-size:13px;margin:-4px 0 10px}
a{color:inherit;text-decoration:none}
.row{display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;background:#17171a;margin:8px 0;border:1px solid #26262b}
.row:active{background:#202024}
.kind{font-size:12px;font-weight:700;padding:4px 9px;border-radius:999px;background:#2a2a30;color:#c9c9d0;flex:none}
.kind.Final{background:#103f22;color:#5be38a}
.kind.Draft{background:#3a2c0c;color:#ffc95c}
.name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.meta{color:#9a9aa2;font-size:13px;flex:none}
video{width:100%;max-height:78vh;background:#000;border-radius:14px;display:block;margin:12px 0}
.bar{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-block;padding:10px 16px;border-radius:12px;background:#222227;border:1px solid #303036;font-weight:600}
.empty{color:#9a9aa2}
`;

const page = (title, body) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><style>${STYLE}</style></head><body><main>${body}</main></body></html>`;

/** Start the viewer. Resolves nothing itself: listen for "listening" and "error" on the returned server. */
export function startViewer({ workspace, port, key }) {
  const q = (params) => "?" + new URLSearchParams({ ...params, k: key }).toString();

  const send = (res, status, type, body, extra = {}) => {
    res.writeHead(status, { "Content-Type": type, "Content-Length": Buffer.byteLength(body), ...extra });
    res.end(body);
  };
  const html = (res, status, title, body) =>
    send(res, status, "text/html; charset=utf-8", page(title, body), {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; media-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    });

  const list = (res) => {
    const projects = allVideos(workspace);
    const body = projects.length
      ? projects
          .map(
            (p) =>
              `<h2>${esc(p.title)}</h2><p class="sub">Video ${p.number}</p>` +
              p.videos
                .map((v) => `<a class="row" href="/watch${esc(q({ p: p.name, f: v.rel }))}"><span class="kind ${v.kind}">${v.kind}</span><span class="name">${esc(path.basename(v.rel))}</span><span class="meta">${mb(v.size)} · ${when(v.mtime)}</span></a>`)
                .join(""),
          )
          .join("")
      : `<p class="empty">No rendered videos yet.</p>`;
    html(res, 200, "Your videos", `<h1>Your videos</h1>${body}`);
  };

  const find = (url) => {
    const p = allVideos(workspace).find((x) => x.name === url.searchParams.get("p"));
    const v = p?.videos.find((x) => x.rel === url.searchParams.get("f"));
    return p && v ? { p, v, file: path.join(p.dir, v.rel) } : null;
  };

  const watch = (res, url) => {
    const hit = find(url);
    if (!hit) return html(res, 404, "Not found", `<h1>Not found</h1><p><a class="btn" href="/${esc(q({}))}">All videos</a></p>`);
    const src = `/file${q({ p: hit.p.name, f: hit.v.rel })}`;
    const dl = `/file${q({ p: hit.p.name, f: hit.v.rel, dl: "1" })}`;
    html(
      res,
      200,
      hit.p.title,
      `<p><a class="btn" href="/${esc(q({}))}">‹ All videos</a></p><h1>${esc(hit.p.title)}</h1><p class="sub"><span class="kind ${hit.v.kind}">${hit.v.kind}</span> ${esc(path.basename(hit.v.rel))} · ${mb(hit.v.size)} · ${when(hit.v.mtime)}</p><video controls playsinline preload="metadata" src="${esc(src)}"></video><div class="bar"><a class="btn" href="${esc(dl)}">Download</a></div>`,
    );
  };

  const file = (req, res, url) => {
    const hit = find(url);
    if (!hit) return send(res, 404, "text/plain; charset=utf-8", "not found");
    const size = fs.statSync(hit.file).size;
    const type = TYPES.get(path.extname(hit.file).toLowerCase()) ?? "application/octet-stream";
    const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, no-cache" };
    if (url.searchParams.get("dl") === "1") headers["Content-Disposition"] = `attachment; filename="${`${hit.p.name}-${path.basename(hit.v.rel)}`.replace(/[^\w.-]/g, "_")}"`;
    let start = 0;
    let end = size - 1;
    let status = 200;
    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      if (!m || (m[1] === "" && m[2] === "")) {
        res.writeHead(416, { "Content-Range": `bytes */${size}` });
        return res.end();
      }
      if (m[1] === "") start = Math.max(0, size - Number(m[2]));
      else {
        start = Number(m[1]);
        if (m[2] !== "") end = Math.min(Number(m[2]), size - 1);
      }
      if (start > end || start >= size) {
        res.writeHead(416, { "Content-Range": `bytes */${size}` });
        return res.end();
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    }
    headers["Content-Length"] = end - start + 1;
    res.writeHead(status, headers);
    if (req.method === "HEAD") return res.end();
    const stream = fs.createReadStream(hit.file, { start, end });
    stream.on("error", () => res.destroy());
    res.on("close", () => stream.destroy());
    stream.pipe(res);
  };

  const server = http.createServer((req, res) => {
    try {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Referrer-Policy", "no-referrer");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "text/plain; charset=utf-8", "read-only", { Allow: "GET, HEAD" });
      const url = new URL(req.url ?? "/", "http://viewer.local");
      if (!keyMatches(url.searchParams.get("k"), key)) {
        return html(res, 403, "Locked", `<h1>Locked</h1><p class="empty">This page needs the full link the viewer printed on your PC (it carries a secret key).</p>`);
      }
      if (url.pathname === "/") return list(res);
      if (url.pathname === "/watch") return watch(res, url);
      if (url.pathname === "/file") return file(req, res, url);
      return send(res, 404, "text/plain; charset=utf-8", "not found");
    } catch {
      if (!res.headersSent) send(res, 500, "text/plain; charset=utf-8", "error");
      else res.destroy();
    }
  });
  server.listen(port, "127.0.0.1");
  return server;
}

/** cloudflared on PATH or where its installer puts it, else null. */
export function findCloudflared() {
  const r = spawnSync("where", ["cloudflared"], { encoding: "utf8" });
  const onPath = r.status === 0 ? r.stdout.split(/\r?\n/).find((l) => l.trim()) : null;
  if (onPath) return onPath.trim();
  for (const p of ["C:\\Program Files (x86)\\cloudflared\\cloudflared.exe", "C:\\Program Files\\cloudflared\\cloudflared.exe"]) if (fs.existsSync(p)) return p;
  return null;
}

/** A cloudflared quick tunnel to the viewer; calls onUrl with its https://….trycloudflare.com address once known. */
export function startTunnel(exe, port, onUrl) {
  const child = spawn(exe, ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${port}`], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  let told = false;
  const scan = (buf) => {
    const m = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i.exec(buf.toString());
    if (m && !told) {
      told = true;
      onUrl(m[0]);
    }
  };
  child.stdout.on("data", scan);
  child.stderr.on("data", scan);
  return child;
}
