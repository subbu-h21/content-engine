/**
 * Facebook Pages and Instagram through Meta's Graph API: connect once (Facebook Login with the user's own Meta app),
 * then post Reels and video posts straight from this PC (resumable uploads, no public video link needed).
 *
 * Secrets live in content-engine/secrets/ (git-ignored):
 *   meta-app.json     the user's Meta app: { appId, appSecret, configId? }
 *   meta-token.json   the long-lived user token (about 60 days), the user, and each Page with its own token (Page
 *                     tokens from a long-lived user token don't expire) and its linked Instagram account
 *
 * Instagram is reached through the Page it's linked to ("Instagram API with Facebook Login"): only that route can upload
 * a file from disk. Docs (checked 2026-10-22, Graph API v26.0): developers.facebook.com/docs/video-api/guides/reels-publishing,
 * .../video-api/guides/publishing, .../instagram-platform/content-publishing, .../instagram-graph-api/reference/ig-user/media,
 * .../facebook-login/guides/advanced/manual-flow, .../facebook-login/guides/access-tokens/get-long-lived
 *
 * Test-only overrides: CE_META_GRAPH, CE_META_GRAPH_VIDEO, CE_META_RUPLOAD, CE_META_DIALOG (a fake Meta for tests).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { ENGINE_DIR } from "../../cli/projects.mjs";

const V = "v26.0";
const GRAPH = process.env.CE_META_GRAPH || "https://graph.facebook.com";
const GRAPH_VIDEO = process.env.CE_META_GRAPH_VIDEO || "https://graph-video.facebook.com";
const RUPLOAD = process.env.CE_META_RUPLOAD || "https://rupload.facebook.com";
const DIALOG = process.env.CE_META_DIALOG || "https://www.facebook.com";
/** Pages: list them, read, post. Instagram: read the account, publish. business_management: Pages owned by a business portfolio. */
export const SCOPES = ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "instagram_basic", "instagram_content_publish", "business_management"];

const SECRETS = process.env.CE_SECRETS_DIR || path.join(ENGINE_DIR, "secrets"); // override: tests
const APP_FILE = path.join(SECRETS, "meta-app.json");
const TOKEN_FILE = path.join(SECRETS, "meta-token.json");

const readJson = (f) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return null;
  }
};
const writeSecret = (f, o) => {
  fs.mkdirSync(SECRETS, { recursive: true });
  fs.writeFileSync(f + ".tmp", JSON.stringify(o, null, 1));
  fs.renameSync(f + ".tmp", f);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class MetaError extends Error {
  constructor(message, { retry = false, code = null } = {}) {
    super(message);
    this.retry = retry;
    this.code = code;
  }
}

// ------------------------------------------------------------------ the user's Meta app

function app() {
  const a = readJson(APP_FILE);
  return a?.appId && a?.appSecret ? a : null;
}

/** The App ID and App secret from the Meta app's dashboard (App settings → Basic); a configuration ID only when the
 *  app uses "Facebook Login for Business" configurations. */
export function saveApp({ appId, appSecret, configId }) {
  const id = String(appId ?? "").trim();
  const secret = String(appSecret ?? "").trim();
  const config = String(configId ?? "").trim();
  if (!/^\d{6,20}$/.test(id)) throw new Error("The App ID is a number (Meta app dashboard → App settings → Basic).");
  if (!/^[0-9a-f]{32}$/i.test(secret)) throw new Error("The App secret is 32 letters and digits (App settings → Basic → App secret → Show).");
  if (config && !/^\d{6,20}$/.test(config)) throw new Error("The configuration ID is a number (Facebook Login for Business → Configurations); leave it empty if you don't have one.");
  writeSecret(APP_FILE, { appId: id, appSecret: secret, ...(config ? { configId: config } : {}) });
  return status();
}

export function status() {
  const a = app();
  const t = readJson(TOKEN_FILE);
  return {
    appSaved: !!a,
    appId: a?.appId ?? null,
    configId: a?.configId ?? null,
    connected: !!t?.userToken,
    user: t?.user ?? null,
    connectedAt: t?.connectedAt ?? null,
    userExpiresAt: t?.userExpiresAt ?? null,
    missing: t?.missing ?? [],
    pages: (t?.pages ?? []).map(({ token: _t, ...p }) => p),
  };
}

export function disconnect() {
  fs.rmSync(TOKEN_FILE, { force: true });
  return status();
}

// ------------------------------------------------------------------ connect (Facebook Login, code flow, redirect to the engine)

/** state -> { redirectUri, at } */
const pending = new Map();

export function authUrl(redirectUri) {
  const a = app();
  if (!a) throw new Error("Add your Meta app in Settings → Facebook & Instagram first.");
  const state = crypto.randomBytes(16).toString("hex");
  pending.set(state, { redirectUri, at: Date.now() });
  for (const [k, v] of pending) if (Date.now() - v.at > 15 * 60 * 1000) pending.delete(k);
  const q = new URLSearchParams({ client_id: a.appId, redirect_uri: redirectUri, state, response_type: "code" });
  if (a.configId) {
    q.set("config_id", a.configId);
    q.set("override_default_response_type", "true");
  } else q.set("scope", SCOPES.join(","));
  return `${DIALOG}/${V}/dialog/oauth?${q}`;
}

export const isOAuthCallback = (query) => typeof query.state === "string" && pending.has(query.state);

/** Finish the sign-in: exchange the code, then keep a long-lived token and the Pages. */
export async function finishAuth(query) {
  const p = pending.get(query.state);
  pending.delete(query.state);
  if (!p) throw new Error("This sign-in link expired; start again from Settings → Facebook & Instagram.");
  if (query.error) throw new Error(query.error_reason === "user_denied" || query.error === "access_denied" ? "You declined access on Facebook's page." : `Facebook returned: ${query.error_description ?? query.error}`);
  const a = app();
  const j = await graph("GET", "/oauth/access_token", { client_id: a.appId, redirect_uri: p.redirectUri, client_secret: a.appSecret, code: String(query.code ?? "") });
  if (!j.access_token) throw new Error("Facebook didn't give a token.");
  return keepUserToken(j.access_token);
}

/** The fallback when Facebook won't send the sign-in back to the engine: a user token pasted from the Graph API Explorer. */
export async function connectWithToken(token) {
  const t = String(token ?? "").trim();
  if (!/^[A-Za-z0-9]{40,}$/.test(t)) throw new Error("That doesn't look like an access token (a long string of letters and digits, starting with EAA).");
  if (!app()) throw new Error("Add your Meta app in Settings → Facebook & Instagram first.");
  return keepUserToken(t);
}

async function keepUserToken(shortToken) {
  const a = app();
  const long = await graph("GET", "/oauth/access_token", { grant_type: "fb_exchange_token", client_id: a.appId, client_secret: a.appSecret, fb_exchange_token: shortToken });
  const userToken = long.access_token ?? shortToken;
  const me = await graph("GET", "/me", { fields: "id,name", access_token: userToken });
  const perms = await graph("GET", "/me/permissions", { access_token: userToken }).catch(() => ({ data: [] }));
  const granted = new Set((perms.data ?? []).filter((x) => x.status === "granted").map((x) => x.permission));
  const pages = await listPages(userToken);
  const tok = {
    userToken,
    userExpiresAt: long.expires_in ? new Date(Date.now() + long.expires_in * 1000).toISOString() : null,
    user: { id: me.id, name: me.name },
    missing: perms.data?.length ? SCOPES.filter((s) => s !== "business_management" && !granted.has(s)) : [],
    pages,
    connectedAt: new Date().toISOString(),
  };
  writeSecret(TOKEN_FILE, tok);
  return status();
}

async function listPages(userToken) {
  const j = await graph("GET", "/me/accounts", { fields: "id,name,link,access_token,tasks,instagram_business_account{id,username}", limit: "100", access_token: userToken });
  return (j.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    link: p.link ?? `https://www.facebook.com/${p.id}`,
    token: p.access_token,
    canPost: !Array.isArray(p.tasks) || p.tasks.includes("CREATE_CONTENT"),
    instagram: p.instagram_business_account ? { id: p.instagram_business_account.id, username: p.instagram_business_account.username ?? null } : null,
  }));
}

/** Ask Meta again which Pages and Instagram accounts the sign-in reaches (Settings → Test connection). */
export async function testConnection() {
  const t = readJson(TOKEN_FILE);
  if (!t?.userToken) return { ok: false, error: "Not connected yet." };
  try {
    t.pages = await listPages(t.userToken);
    writeSecret(TOKEN_FILE, t);
    if (!t.pages.length) return { ok: false, error: "Connected, but Meta lists no Pages for this account: when connecting, pick your Page on Facebook's screen (Edit access / Choose Pages)." };
    return { ok: true, pages: status().pages };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/** A connected Page (with its token), or null. */
export function pageById(id) {
  return (readJson(TOKEN_FILE)?.pages ?? []).find((p) => p.id === id) ?? null;
}
/** The Page an Instagram account is linked to, or null. */
export function pageOfInstagram(igId) {
  return (readJson(TOKEN_FILE)?.pages ?? []).find((p) => p.instagram?.id === igId) ?? null;
}
/** The token for Instagram calls: the user token while it's valid (Meta's docs ask for it), else the Page's. */
function igToken(page) {
  const t = readJson(TOKEN_FILE);
  return t?.userToken && (!t.userExpiresAt || Date.parse(t.userExpiresAt) > Date.now() + 60_000) ? t.userToken : page.token;
}
function userToken() {
  const t = readJson(TOKEN_FILE);
  if (!t?.userToken) throw new MetaError("Facebook & Instagram aren't connected: connect them in Settings.");
  if (t.userExpiresAt && Date.parse(t.userExpiresAt) < Date.now()) throw new MetaError("Your Facebook sign-in has expired (it lasts about 60 days): connect again in Settings → Facebook & Instagram.", { code: 190 });
  return t.userToken;
}

// ------------------------------------------------------------------ Graph API calls

/** A Graph call: GET with a query, POST as a form. p is a path ("/me") or a full URL. */
async function graph(method, p, params = {}, { base = GRAPH, headers = {} } = {}) {
  const url = new URL(p.startsWith("http") ? p : `${base}/${V}${p}`);
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null) (method === "GET" ? url.searchParams : form).set(k, String(v));
  let r;
  try {
    r = await fetch(url, { method, headers: { ...headers, ...(method === "GET" ? {} : { "content-type": "application/x-www-form-urlencoded" }) }, body: method === "GET" ? undefined : form });
  } catch (e) {
    throw new MetaError(`Couldn't reach Meta (${e.cause?.code ?? e.message}).`, { retry: true });
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw metaError(r.status, j);
  return j;
}

/** Meta's error in plain words; retry = worth trying again later. */
function metaError(status, j) {
  const e = j?.error ?? {};
  const code = Number(e.code ?? 0);
  const said = e.error_user_msg || e.error_user_title || e.message || `HTTP ${status}`;
  if (code === 190) return new MetaError(`Meta says the sign-in is no longer valid (${said}). Connect again in Settings → Facebook & Instagram.`, { code });
  if ([4, 17, 32, 613, 80001, 80002].includes(code) || e.error_subcode === 2207042)
    return new MetaError(`Meta's limit for API calls or posts is reached for now (${said}). Try again later.`, { retry: true, code });
  if ([1, 2].includes(code) || status >= 500) return new MetaError(`Meta had a temporary problem (${said}).`, { retry: true, code });
  if (code === 10 || (code >= 200 && code < 300))
    return new MetaError(`Meta didn't allow it: ${said} (when connecting, allow every permission Facebook asks for, and pick this Page and Instagram account).`, { code });
  return new MetaError(`Meta error${code ? ` ${code}` : ""}: ${said}`, { code });
}

/**
 * POST a file (from byte `start`) to an upload address with the given headers, streamed from disk with its exact
 * length (no copy in memory). Resolves the parsed JSON answer.
 */
function streamUpload(url, headers, file, start, total, onProgress) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === "https:" ? https : http;
    const req = mod.request(u, { method: "POST", headers: { ...headers, "content-type": "application/octet-stream", "content-length": String(total - start) } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        let j = {};
        try {
          j = JSON.parse(body);
        } catch {
          // not JSON
        }
        if (res.statusCode >= 400 || j.error || j.debug_info?.type) {
          const e = metaError(res.statusCode, j.error ? j : { error: { message: j.debug_info?.message ?? body.slice(0, 300) } });
          e.type = j.debug_info?.type ?? null; // rupload's own error kind, e.g. ProcessingFailedError
          reject(e);
        } else resolve(j);
      });
    });
    req.setTimeout(180_000, () => req.destroy(new Error("no answer for 3 minutes")));
    req.on("error", (e) => reject(e instanceof MetaError ? e : new MetaError(`The upload connection broke (${e.code ?? e.message}).`, { retry: true })));
    const rs = fs.createReadStream(file, { start });
    let sent = start;
    rs.on("data", (c) => {
      sent += c.length;
      onProgress?.(sent, total);
    });
    rs.on("error", (e) => req.destroy(e));
    rs.pipe(req);
  });
}

const POLL_MS = Number(process.env.CE_META_POLL_MS) || 5000; // CE_META_POLL_MS: tests
/** How long to watch an Instagram container after "Request processing failed" (CE_META_DOUBTFUL_MIN: tests). */
const DOUBTFUL_MINUTES = Number(process.env.CE_META_DOUBTFUL_MIN) || 3;

/** Wait for Meta's processing: check() resolves {done, result} or throws; gives up (resumable) after `minutes`. */
async function waitFor(check, { minutes = 15, every = POLL_MS, log, what }) {
  const end = Date.now() + minutes * 60_000;
  let last = "";
  for (;;) {
    const r = await check();
    if (r.done) return r.result;
    if (r.note && r.note !== last) log?.(`${what}: ${(last = r.note)}`);
    if (Date.now() > end) throw new MetaError(`Meta is still processing the video after ${minutes} minutes. Resume checks again; nothing is posted twice.`, { retry: true });
    await sleep(every);
  }
}

const absolute = (link) => (!link ? null : link.startsWith("http") ? link : `https://www.facebook.com${link.startsWith("/") ? "" : "/"}${link}`);

// ------------------------------------------------------------------ posting
//
// Each post keeps its progress in `st` (saved by the caller after every step through save()), so an interrupted post
// continues where it stopped and never posts twice: the step that makes the post public is marked before it's asked
// for, and on resume the engine first checks whether it already happened.

/** A Facebook Page Reel: start → upload (rupload, resumable) → finish (publish) → wait until Meta has published it. */
export async function postFacebookReel({ page, file, size, caption, st, save, log, onProgress }) {
  const token = page.token;
  if (!st.videoId) {
    const j = await graph("POST", `/${page.id}/video_reels`, { upload_phase: "start", access_token: token });
    Object.assign(st, { videoId: j.video_id, uploadUrl: j.upload_url ?? `${RUPLOAD}/video-upload/${V}/${j.video_id}`, phase: "uploading" });
    save();
    log(`Reel started: video ${st.videoId}`);
  }
  if (st.phase === "uploading") {
    let offset = 0;
    if (st.tried) {
      const s = await graph("GET", `/${st.videoId}`, { fields: "status", access_token: token }).catch(() => null);
      offset = Number(s?.status?.uploading_phase?.bytes_transfered ?? 0);
      if (offset) log(`Meta has ${offset} of ${size} bytes; continuing from there`);
    }
    st.tried = true;
    save();
    if (offset < size) await streamUpload(st.uploadUrl, { Authorization: `OAuth ${token}`, offset: String(offset), file_size: String(size) }, file, offset, size, onProgress);
    onProgress(size, size);
    st.phase = "finishing";
    save();
    log("uploaded");
  }
  if (st.phase === "finishing") {
    const s = await graph("GET", `/${st.videoId}`, { fields: "status", access_token: token }).catch(() => null);
    const already = ["published", "scheduled"].includes(s?.status?.publishing_phase?.publish_status) || (s?.status?.processing_phase?.status && s.status.processing_phase.status !== "not_started");
    if (!already) await graph("POST", `/${page.id}/video_reels`, { upload_phase: "finish", video_id: st.videoId, video_state: "PUBLISHED", description: caption, access_token: token });
    st.phase = "processing";
    save();
    log("asked Meta to publish the Reel");
  }
  if (st.phase === "processing") {
    await waitFor(
      async () => {
        const s = await graph("GET", `/${st.videoId}`, { fields: "status,permalink_url", access_token: token });
        const vs = s.status?.video_status;
        if (["error", "upload_failed", "expired"].includes(vs)) throw new MetaError(`Meta couldn't publish the Reel (${s.status?.processing_phase?.error?.message ?? vs}).`);
        if (s.status?.publishing_phase?.publish_status === "error") throw new MetaError(`Meta couldn't publish the Reel (${s.status?.publishing_phase?.errors?.[0]?.message ?? "publishing error"}).`);
        const published = s.status?.publishing_phase?.status === "complete" || s.status?.publishing_phase?.publish_status === "published";
        if (published && vs === "ready") return { done: true, result: { id: st.videoId, url: absolute(s.permalink_url) ?? `https://www.facebook.com/reel/${st.videoId}` } };
        return { done: false, note: `${vs ?? "processing"}${s.status?.processing_phase?.status ? ` (processing: ${s.status.processing_phase.status})` : ""}` };
      },
      { log, what: "Meta" },
    ).then((r) => (st.result = r));
    st.phase = "done";
    save();
  }
  return st.result;
}

/** A normal Facebook Page video post: upload session (user token) → upload → publish on the Page (Page token). */
export async function postFacebookVideo({ page, file, size, caption, title, st, save, log, onProgress }) {
  const a = app();
  if (!st.session) {
    const j = await graph("POST", `/${a.appId}/uploads`, { file_name: path.basename(file), file_length: size, file_type: "video/mp4", access_token: userToken() });
    Object.assign(st, { session: j.id, phase: "uploading", startedAt: new Date().toISOString() });
    save();
    log(`upload session ${st.session}`);
  }
  if (st.phase === "uploading") {
    const auth = { Authorization: `OAuth ${userToken()}` };
    let offset = 0;
    if (st.tried) {
      const s = await graph("GET", `/${st.session}`, {}, { headers: auth }).catch(() => null);
      offset = Number(s?.file_offset ?? 0);
      if (offset) log(`Meta has ${offset} of ${size} bytes; continuing from there`);
    }
    st.tried = true;
    save();
    const j = await streamUpload(`${GRAPH}/${V}/${st.session}`, { ...auth, file_offset: String(offset) }, file, offset, size, onProgress);
    if (!j.h) throw new MetaError("Meta didn't confirm the upload (no file handle).", { retry: true });
    Object.assign(st, { handle: j.h, phase: "publishing" });
    save();
    log("uploaded");
  }
  if (st.phase === "publishing") {
    // a publish that may already have happened (the engine stopped right after asking): look for it first
    if (st.publishAsked) {
      const recent = await graph("GET", `/${page.id}/videos`, { fields: "id,description,created_time,permalink_url", limit: "10", access_token: page.token }).catch(() => ({ data: [] }));
      const found = (recent.data ?? []).find((v) => (v.description ?? "") === caption && Date.parse(v.created_time) >= Date.parse(st.startedAt) - 60_000);
      if (found) st.result = { id: found.id, url: absolute(found.permalink_url) ?? `https://www.facebook.com/${found.id}` };
    }
    if (!st.result) {
      st.publishAsked = true;
      save();
      const j = await graph("POST", `/${page.id}/videos`, { access_token: page.token, title: title || undefined, description: caption, fbuploader_video_file_chunk: st.handle }, { base: GRAPH_VIDEO });
      const v = await graph("GET", `/${j.id}`, { fields: "permalink_url", access_token: page.token }).catch(() => ({}));
      st.result = { id: j.id, url: absolute(v.permalink_url) ?? `https://www.facebook.com/${j.id}` };
    }
    st.phase = "done";
    save();
    log(`posted: ${st.result.url} (Meta keeps processing it for a few minutes)`);
  }
  return st.result;
}

/** An Instagram Reel: container (resumable) → upload → wait until FINISHED → publish → its link. */
export async function postInstagramReel({ page, igId, file, size, caption, shareToFeed, st, save, log, onProgress }) {
  const token = () => igToken(page);
  // an upload goes to a new container: Instagram doesn't continue a broken upload, and a container whose upload it
  // couldn't process stays dead (the old one was never published; Instagram drops it after a day).
  // Meta allows only so many API posts a day per account: say so before uploading
  if (!st.containerId || st.phase === "uploading") {
    const lim = await graph("GET", `/${igId}/content_publishing_limit`, { fields: "quota_usage,config", access_token: token() }).catch(() => null);
    const used = lim?.data?.[0]?.quota_usage;
    const max = lim?.data?.[0]?.config?.quota_total;
    if (used != null && max != null && used >= max) throw new MetaError(`This Instagram account has used its ${max} API posts for the last 24 hours. Try again later.`, { retry: true });
    const j = await graph("POST", `/${igId}/media`, { media_type: "REELS", upload_type: "resumable", caption, share_to_feed: shareToFeed ? "true" : "false", access_token: token() });
    Object.assign(st, { containerId: j.id, uploadUrl: j.uri ?? `${RUPLOAD}/ig-api-upload/${V}/${j.id}`, phase: "uploading", startedAt: new Date().toISOString() });
    save();
    log(`Instagram container ${st.containerId}`);
  }
  if (st.phase === "uploading") {
    // "Request processing failed" doesn't always mean it: seen 2026-10-22, a 21 MB upload answered so and its container
    // was FINISHED a moment later (bigger ones stayed IN_PROGRESS for good). Watch the container a while before giving up.
    st.doubtful = false;
    try {
      await streamUpload(st.uploadUrl, { Authorization: `OAuth ${token()}`, offset: "0", file_size: String(size) }, file, 0, size, onProgress);
    } catch (e) {
      if (e.type !== "ProcessingFailedError") throw e;
      st.doubtful = true;
      log("Instagram answered 'Request processing failed'; checking whether it has the video anyway");
    }
    onProgress(size, size);
    st.phase = "processing";
    save();
    if (!st.doubtful) log("uploaded; Instagram is processing it");
  }
  if (st.phase === "processing") {
    const state = await waitFor(
      async () => {
        const s = await graph("GET", `/${st.containerId}`, { fields: "status_code,status", access_token: token() });
        if (s.status_code === "FINISHED" || s.status_code === "PUBLISHED") return { done: true, result: s.status_code };
        if (s.status_code === "ERROR") throw new MetaError(`Instagram couldn't use the video (${s.status ?? "processing error"}).`);
        if (s.status_code === "EXPIRED") return { done: true, result: "EXPIRED" };
        return { done: false, note: s.status_code ?? "IN_PROGRESS" };
      },
      { log, what: "Instagram", minutes: st.doubtful ? DOUBTFUL_MINUTES : 15 },
    ).catch((e) => {
      if (!st.doubtful || !e.retry) throw e;
      // it really couldn't: that container stays dead, so Resume uploads afresh (a new container)
      st.phase = "uploading";
      save();
      throw new MetaError("Instagram took the upload but couldn't process it (Meta: Request processing failed). Resume tries again with a fresh upload; if it keeps failing, post it the other way below.", { retry: true });
    });
    if (state === "EXPIRED") {
      // containers last 24 hours: start this post over with a new one
      for (const k of ["containerId", "uploadUrl", "phase"]) delete st[k];
      save();
      throw new MetaError("The upload on Instagram expired (it waited more than a day). Try again to upload it afresh.", { retry: true });
    }
    st.phase = "publishing";
    save();
  }
  if (st.phase === "publishing") {
    const s = await graph("GET", `/${st.containerId}`, { fields: "status_code", access_token: token() }).catch(() => null);
    let mediaId = null;
    if (s?.status_code === "PUBLISHED") {
      // published before the engine heard back: find it among the newest posts
      const recent = await graph("GET", `/${igId}/media`, { fields: "id,timestamp", limit: "5", access_token: token() }).catch(() => ({ data: [] }));
      mediaId = (recent.data ?? []).find((m) => Date.parse(m.timestamp) >= Date.parse(st.startedAt) - 60_000)?.id ?? null;
    }
    if (!mediaId) {
      st.publishAsked = true;
      save();
      mediaId = (await graph("POST", `/${igId}/media_publish`, { creation_id: st.containerId, access_token: token() })).id;
    }
    const m = await graph("GET", `/${mediaId}`, { fields: "permalink", access_token: token() }).catch(() => ({}));
    st.result = { id: mediaId, url: m.permalink ?? null };
    st.phase = "done";
    save();
    log(`posted: ${st.result.url ?? mediaId}`);
  }
  return st.result;
}
