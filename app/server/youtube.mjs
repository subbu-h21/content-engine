/**
 * YouTube: connect once (OAuth 2.0 for installed apps, PKCE, loopback redirect to the engine), then resumable uploads.
 *
 * Secrets live in content-engine/secrets/ (git-ignored):
 *   youtube-client.json   the Desktop OAuth client the user downloaded from Google Cloud ({"installed": {...}})
 *   youtube-token.json    refresh token + current access token + the connected channel
 *
 * Scopes: youtube.upload (upload videos) + youtube.readonly (see which channel is connected).
 * Docs (checked 2026-10-19): developers.google.com/youtube/v3/docs/videos/insert,
 *   .../youtube/v3/guides/using_resumable_upload_protocol, developers.google.com/identity/protocols/oauth2/native-app
 *
 * Test-only overrides: CE_GOOGLE_AUTH_URL, CE_GOOGLE_TOKEN_URL, CE_YOUTUBE_API (a fake Google for tests).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ENGINE_DIR } from "../../cli/projects.mjs";

const SECRETS = process.env.CE_SECRETS_DIR || path.join(ENGINE_DIR, "secrets"); // override: tests
const CLIENT_FILE = path.join(SECRETS, "youtube-client.json");
const TOKEN_FILE = path.join(SECRETS, "youtube-token.json");
const AUTH_URL = process.env.CE_GOOGLE_AUTH_URL || "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = process.env.CE_GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token";
const API = process.env.CE_YOUTUBE_API || "https://www.googleapis.com";
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"];

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

function client() {
  const j = readJson(CLIENT_FILE);
  const c = j?.installed ?? j?.web ?? null;
  return c?.client_id ? { id: c.client_id, secret: c.client_secret ?? null } : null;
}

/** Save the client JSON the user downloaded ("Desktop app" OAuth client). */
export function saveClient(text) {
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    throw new Error("That file isn't JSON. Download the OAuth client from Google Cloud (Clients → your Desktop client → Download JSON).");
  }
  if (j.web && !j.installed) throw new Error('This is a "Web application" client. Create a "Desktop app" client instead (Google Cloud → Clients → Create client → Desktop app).');
  if (!j.installed?.client_id) throw new Error("This JSON has no installed.client_id: it doesn't look like a Desktop OAuth client file.");
  writeSecret(CLIENT_FILE, { installed: j.installed });
  return status();
}

export function status() {
  const tok = readJson(TOKEN_FILE);
  return {
    clientSaved: !!client(),
    connected: !!tok?.refresh_token,
    channel: tok?.channel ?? null,
    connectedAt: tok?.connectedAt ?? null,
  };
}

export function disconnect() {
  fs.rmSync(TOKEN_FILE, { force: true });
  return status();
}

// ------------------------------------------------------------------ connect (OAuth with PKCE, loopback redirect)

/** state -> { verifier, redirectUri, at } */
const pending = new Map();

export function authUrl(redirectUri) {
  const c = client();
  if (!c) throw new Error("Add your Google app file first (home page → Connected accounts → YouTube).");
  const verifier = crypto.randomBytes(48).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("hex");
  pending.set(state, { verifier, redirectUri, at: Date.now() });
  for (const [k, v] of pending) if (Date.now() - v.at > 15 * 60 * 1000) pending.delete(k);
  const q = new URLSearchParams({
    client_id: c.id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent select_account",
  });
  return `${AUTH_URL}?${q}`;
}

export const isOAuthCallback = (query) => typeof query.state === "string" && pending.has(query.state);

/** Finish the sign-in: exchange the code, remember the channel. */
export async function finishAuth(query) {
  const p = pending.get(query.state);
  pending.delete(query.state);
  if (!p) throw new Error("This sign-in link expired; start again from the home page (Connected accounts).");
  if (query.error) throw new Error(query.error === "access_denied" ? "You declined access on Google's page." : `Google returned: ${query.error}`);
  const c = client();
  const body = new URLSearchParams({ client_id: c.id, code: String(query.code), code_verifier: p.verifier, grant_type: "authorization_code", redirect_uri: p.redirectUri });
  if (c.secret) body.set("client_secret", c.secret);
  const r = await fetch(TOKEN_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error(`Google didn't give a token (${r.status} ${j.error ?? ""} ${j.error_description ?? ""}).`.trim());
  if (!j.refresh_token) throw new Error("Google didn't return a refresh token. Remove the engine's access at myaccount.google.com/permissions and connect again.");
  const tok = { refresh_token: j.refresh_token, access_token: j.access_token, expires_at: Date.now() + (j.expires_in ?? 3600) * 1000, scope: j.scope ?? SCOPES.join(" "), connectedAt: new Date().toISOString() };
  writeSecret(TOKEN_FILE, tok);
  try {
    const ch = await api("GET", "/youtube/v3/channels?part=snippet&mine=true");
    const item = ch.items?.[0];
    tok.channel = item ? { id: item.id, title: item.snippet?.title ?? item.id, url: `https://www.youtube.com/channel/${item.id}` } : null;
  } catch {
    tok.channel = null;
  }
  writeSecret(TOKEN_FILE, tok);
  return status();
}

// ------------------------------------------------------------------ tokens + API

class YouTubeError extends Error {
  constructor(message, { retry = false, code = null } = {}) {
    super(message);
    this.retry = retry;
    this.code = code;
  }
}

async function accessToken(force = false) {
  const tok = readJson(TOKEN_FILE);
  if (!tok?.refresh_token) throw new YouTubeError("YouTube isn't connected: connect it on the home page (Connected accounts).");
  if (!force && tok.access_token && tok.expires_at > Date.now() + 60_000) return tok.access_token;
  const c = client();
  const body = new URLSearchParams({ client_id: c.id, grant_type: "refresh_token", refresh_token: tok.refresh_token });
  if (c.secret) body.set("client_secret", c.secret);
  let r;
  try {
    r = await fetch(TOKEN_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  } catch (e) {
    throw new YouTubeError(`Couldn't reach Google to refresh the sign-in (${e.cause?.code ?? e.message}).`, { retry: true });
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    if (j.error === "invalid_grant")
      throw new YouTubeError(
        'YouTube sign-in expired or was revoked. Connect again on the home page (Connected accounts). (If this happens every 7 days, your Google app is still in "Testing": publish it to "In production" on the Google Auth Platform → Audience page.)',
        { code: "invalid_grant" },
      );
    throw new YouTubeError(`Refreshing the YouTube sign-in failed (${r.status} ${j.error ?? ""}).`, { retry: r.status >= 500 });
  }
  tok.access_token = j.access_token;
  tok.expires_at = Date.now() + (j.expires_in ?? 3600) * 1000;
  writeSecret(TOKEN_FILE, tok);
  return tok.access_token;
}

async function api(method, p, body) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const t = await accessToken(attempt > 0);
    const r = await fetch(API + p, { method, headers: { authorization: `Bearer ${t}`, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401 && attempt === 0) continue;
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw googleError(r.status, j);
    return j;
  }
}

function googleError(status, j) {
  const reason = j?.error?.errors?.[0]?.reason ?? j?.error?.status ?? "";
  const msg = j?.error?.message ?? "";
  const known = {
    quotaExceeded: "YouTube's daily API quota is used up; try again tomorrow (it resets at midnight Pacific time).",
    uploadLimitExceeded: "Your YouTube channel has reached its upload limit for now; try again later.",
    forbidden: "YouTube refused the upload for this channel (is the channel set up and allowed to upload?).",
    youtubeSignupRequired: "This Google account has no YouTube channel yet: create one on youtube.com, then connect again.",
    invalidTitle: "YouTube rejected the title (empty, too long, or contains < or >).",
    invalidDescription: "YouTube rejected the description (too long, or contains < or >).",
    invalidTags: "YouTube rejected the tags (too long in total, or invalid characters).",
    invalidCategoryId: "YouTube rejected the category.",
    invalidPublishAt: "YouTube rejected the scheduled time (it must be in the future, and the video private).",
    defaultLanguageNotSet: "YouTube needs a default language for these settings.",
  };
  return new YouTubeError(known[reason] ?? `YouTube error ${status}${reason ? ` (${reason})` : ""}: ${msg}`, { retry: [500, 502, 503, 504].includes(status), code: reason || String(status) });
}

// ------------------------------------------------------------------ resumable upload

const CHUNK = 8 * 1024 * 1024; // a multiple of 256 KiB, as the protocol requires

/**
 * Upload a file with the resumable protocol. state (persisted by the caller through save()) carries the session URI and
 * the file's identity, so an interrupted upload continues where Google says it stopped.
 * onProgress(sentBytes, totalBytes). shouldStop() -> true aborts between chunks.
 */
export async function upload({ file, metadata, state, save, onProgress, shouldStop, log }) {
  const st = fs.statSync(file);
  const identity = { size: st.size, mtime: Math.round(st.mtimeMs) };
  const sameFile = state.session && state.identity?.size === identity.size && state.identity?.mtime === identity.mtime;
  const fresh = !sameFile || Date.now() - (state.sessionAt ?? 0) > 6 * 24 * 3600 * 1000; // sessions last about a week
  if (fresh) {
    state.session = await startSession(file, st.size, metadata);
    state.sessionAt = Date.now();
    state.identity = identity;
    save();
    log?.(`upload session started (${st.size} bytes)`);
  }
  let offset = fresh ? 0 : await queryOffset(state, st.size, save, log);
  if (offset === "done") return state.result;
  const fd = fs.openSync(file, "r");
  let failures = 0;
  try {
    while (offset < st.size) {
      if (shouldStop?.()) return null;
      const len = Math.min(CHUNK, st.size - offset);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, offset);
      let r;
      try {
        const t = await accessToken();
        r = await fetch(state.session, {
          method: "PUT",
          headers: { authorization: `Bearer ${t}`, "content-length": String(len), "content-range": `bytes ${offset}-${offset + len - 1}/${st.size}`, "content-type": "video/*" },
          body: buf,
        });
      } catch (e) {
        r = null;
        log?.(`connection lost at ${offset} bytes (${e.cause?.code ?? e.message})`);
      }
      if (r && (r.status === 200 || r.status === 201)) {
        const j = await r.json();
        state.result = { id: j.id, url: `https://youtu.be/${j.id}`, studio: `https://studio.youtube.com/video/${j.id}/edit`, privacy: j.status?.privacyStatus ?? metadata.status?.privacyStatus };
        save();
        onProgress?.(st.size, st.size);
        return state.result;
      }
      if (r && r.status === 308) {
        offset = rangeEnd(r.headers.get("range"));
        failures = 0;
        state.offset = offset;
        save();
        onProgress?.(offset, st.size);
        continue;
      }
      if (r && r.status === 404) {
        // the session expired: start over with a new one
        state.session = await startSession(file, st.size, metadata);
        state.sessionAt = Date.now();
        save();
        offset = 0;
        log?.("upload session expired; started a new one");
        continue;
      }
      if (r && r.status === 401) {
        await accessToken(true);
        continue;
      }
      const retryable = !r || [500, 502, 503, 504].includes(r.status);
      if (!retryable) {
        const j = await r.json().catch(() => ({}));
        throw googleError(r.status, j);
      }
      failures++;
      if (failures > 8) throw new YouTubeError(`The upload kept failing at ${offset} of ${st.size} bytes (network or YouTube trouble). Resume later; it continues from there.`, { retry: true });
      const wait = Math.min(64, 2 ** failures) * 1000 + Math.random() * 1000;
      log?.(`${r ? `YouTube answered ${r.status}` : "no answer"}; waiting ${Math.round(wait / 1000)} s, then asking how much arrived`);
      await new Promise((res) => setTimeout(res, wait));
      const q = await queryOffset(state, st.size, save, log);
      if (q === "done") return state.result;
      offset = q;
    }
  } finally {
    fs.closeSync(fd);
  }
  throw new YouTubeError("The upload ended without a confirmation from YouTube.", { retry: true });
}

const rangeEnd = (range) => {
  const m = /bytes=0-(\d+)/.exec(range ?? "");
  return m ? Number(m[1]) + 1 : 0;
};

async function startSession(file, size, metadata) {
  const parts = Object.keys(metadata).join(",");
  for (let attempt = 0; attempt < 2; attempt++) {
    const t = await accessToken(attempt > 0);
    let r;
    try {
      r = await fetch(`${API}/upload/youtube/v3/videos?uploadType=resumable&part=${encodeURIComponent(parts)}`, {
        method: "POST",
        headers: { authorization: `Bearer ${t}`, "content-type": "application/json; charset=UTF-8", "x-upload-content-length": String(size), "x-upload-content-type": "video/*" },
        body: JSON.stringify(metadata),
      });
    } catch (e) {
      throw new YouTubeError(`Couldn't reach YouTube (${e.cause?.code ?? e.message}).`, { retry: true });
    }
    if (r.status === 401 && attempt === 0) continue;
    if (!r.ok) throw googleError(r.status, await r.json().catch(() => ({})));
    const loc = r.headers.get("location");
    if (!loc) throw new YouTubeError("YouTube didn't return an upload address.", { retry: true });
    return loc;
  }
}

/** Ask Google how many bytes it has: a number, or "done" (then state.result is set). */
async function queryOffset(state, size, save, log) {
  for (let i = 0; i < 6; i++) {
    let r;
    try {
      const t = await accessToken();
      r = await fetch(state.session, { method: "PUT", headers: { authorization: `Bearer ${t}`, "content-length": "0", "content-range": `bytes */${size}` } });
    } catch {
      r = null;
    }
    if (r && (r.status === 200 || r.status === 201)) {
      const j = await r.json();
      state.result = { id: j.id, url: `https://youtu.be/${j.id}`, studio: `https://studio.youtube.com/video/${j.id}/edit`, privacy: j.status?.privacyStatus };
      save();
      return "done";
    }
    if (r && r.status === 308) {
      const o = rangeEnd(r.headers.get("range"));
      log?.(`YouTube has ${o} of ${size} bytes; continuing from there`);
      return o;
    }
    if (r && r.status === 404) {
      state.session = null;
      save();
      throw new YouTubeError("The upload session expired; Resume starts a new one.", { retry: true });
    }
    await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
  }
  throw new YouTubeError("Couldn't ask YouTube how much of the upload arrived.", { retry: true });
}

export { YouTubeError };
