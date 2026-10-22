/** Typed calls to the engine server (same origin). */

export type ProjectRow = {
  name: string;
  dir: string;
  number: number;
  engine: boolean;
  title: string | null;
  link: string | null;
  studio: string;
  stage: string | null;
  render: { status: string; percent: number; step: string | null; queuePosition: number | null } | null;
  publish: Partial<Record<"youtube" | "facebook" | "instagram", string>> | null;
};
export type StudioInfo = { status: "stopped" | "starting" | "ready" | "exited"; port?: number; url?: string; error?: string | null; log?: string[] };
export type ProjectInfo = { name: string; dir: string; title: string; format: { width: number; height: number; fps: number }; duration: number; scenes: number; link: string; studio: StudioInfo };
export type Doctor = { runtime: boolean; claude: string | null; workspace: string; workspaceExists: boolean; freeGb: number | null; onC: boolean };
export type Context = {
  live: boolean;
  reason?: string;
  timeLabel?: string;
  frame?: number;
  composition?: string;
  scene?: { number: number; id: string; title: string; localTime: number } | null;
  cue?: { id: string; text: string; speaking: boolean } | null;
  elements?: { path: string; kind: string; text: string; visible: boolean | null }[];
};

export type Stage = "new" | "talking" | "awaiting-approval" | "building" | "preview-ready" | "final-ready" | "none";
export type BriefLine = { id: string; text: string; estimate: number; seconds: number | null; pause: number };
export type Reference = {
  file: string;
  kind: string | null;
  status: string;
  error: string | null;
  duration: number | null;
  contact: string | null;
  image: string | null;
  palette: { hex: string; share: number }[];
  transcript: string | null;
};
export type Job = { id: number; kind: string; label: string; status: "running" | "done" | "error"; error: string | null; started: number };
export type Brief = {
  status: { stage: Stage; note?: string };
  title: string;
  format: { width: number; height: number; fps: number };
  brief: string | null;
  style: string | null;
  plan: string | null;
  script: { scenes: { id: string; title: string; lines: BriefLine[] }[]; words: number; estimate: number; timingEstimated: boolean; total: number | null };
  voice: { voice: string; style: string; sample: string | null; isDefault?: boolean };
  music: { prompt: string; track: string | null };
  plates: { id: string; from: string; to: string }[];
  frames: { name: string; url: string }[];
  references: Reference[];
  skills: string[];
  jobs: Job[];
};


export type RenderStep = {
  id: string;
  kind: string;
  plate?: string;
  label: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  attempts: number;
  progress: { done: number; total: number; unit: string; secPerFrame?: number | null; etaSeconds?: number | null; remaining?: string | null; phase?: string } | null;
  error: string | null;
  startedAt: string | null;
  endedAt: string | null;
  log: string;
};
export type RenderJob = {
  id: string;
  status: "queued" | "running" | "done" | "failed" | "cancelled" | "interrupted";
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  options: { rerender: string[]; autoFix: boolean };
  autoFixUsed: number;
  steps: RenderStep[];
  error: { step: string | null; message: string } | null;
  estimate: { seconds: number; bytes: number };
  outputs: { video: string; delivery: string } | null;
  claudeNotice?: { at: string; ok: boolean; pending?: boolean; reason: string | null; automatic: boolean } | null;
};
export type RenderPlate = { id: string; from: string; to: string; shot: string; shotExists: boolean; need: number | null; present: number; missing: number; state: string; stale: boolean; unknownOrigin: boolean; secPerFrame: number; estSeconds: number };
export type RenderInfo = {
  plan: { plates: RenderPlate[]; problems: { level: "block" | "warn"; text: string; plate?: string }[]; totalFrames: number; durationSeconds: number; estSeconds: number; needBytes: number; freeBytes: number | null };
  job: RenderJob | null;
  live: { queuePosition: number | null; active: boolean; step?: string; progress?: RenderStep["progress"]; logTail?: string[]; waiting?: string | null } | null;
  /** whether the finished files are there (missing in older engines: assume they are) */
  files?: { delivery: boolean; deliveryAt?: string | null; video: boolean };
};


export type YouTubeStatus = { clientSaved: boolean; clientId?: string | null; connected: boolean; channel: { id: string; title: string; url: string } | null; connectedAt: string | null };
export type YouTubeDraft = { title: string; description: string; tags: string[]; categoryId: string; privacy: "private" | "unlisted" | "public" | "scheduled"; publishAt: string | null; madeForKids: boolean | null; synthetic: boolean };
export type SocialDraft = { page?: string; account?: string; format: "reel" | "post" | null; caption: string; pageId?: string | null; igId?: string | null; title?: string; shareToFeed?: boolean };
/** Facebook & Instagram through Meta's API (server: meta.mjs). */
export type MetaPage = { id: string; name: string; link: string; canPost: boolean; instagram: { id: string; username: string | null } | null };
export type MetaStatus = { appSaved: boolean; appId: string | null; configId: string | null; connected: boolean; user: { id: string; name: string } | null; connectedAt: string | null; userExpiresAt: string | null; missing: string[]; pages: MetaPage[]; redirectUri: string };
export type MetaAccount = { id: string; name: string; link?: string; pageId?: string; pageName?: string };
export type PlatformState = {
  status?: string;
  /** "api": posted through Meta's API (else the Chrome hand-off's reports) */
  route?: "api";
  account?: { id: string; name: string } | null;
  retryable?: boolean;
  file?: string;
  format?: "reel" | "post" | null;
  error?: string | null;
  url?: string | null;
  note?: string | null;
  progress?: { sent: number; total: number } | null;
  result?: { id: string; url: string; studio: string; privacy: string } | null;
  updatedAt?: string;
  reportedAt?: string;
};
/** A video file in a project's out/ folder that can be published. */
export type VideoFile = { rel: string; kind: "final" | "master" | "draft" | "render"; size: number; madeAt: string };
/** The Claude chat (server: app/server/claude.mjs). */
export type ChatStatus = "stopped" | "starting" | "idle" | "working" | "question" | "external";
export type ChatState = { status: ChatStatus; mode: "auto" | "manual"; turnStartedAt: number | null; sessionId: string | null };
export type ChatStep = { id: string; tool: string; kind: "command" | "read" | "edit" | "search" | "web" | "engine" | "chrome" | "agent" | "other"; label: string; status: "running" | "done" | "error"; output?: string };
export type ChatQuestion = { question: string; header: string | null; multiSelect: boolean; options: { label: string; description: string | null }[] };
export type ChatItem =
  | { kind: "user"; id: string; text: string; from?: "engine"; failed?: boolean }
  | { kind: "text"; id: string; text: string; streaming?: boolean }
  | { kind: "tools"; id: string; steps: ChatStep[] }
  | { kind: "question"; id: string; questions: ChatQuestion[]; answer?: Record<string, string> | "answered" | "cancelled" }
  | { kind: "permission"; id: string; tool: string; title: string; detail: string; note: string | null; canAlways: boolean; answer?: "allow" | "always" | "deny" | "cancelled" }
  | { kind: "notice"; id: string; text: string; tone?: "error" | "dim" };
export type ChatEvent =
  | { type: "snapshot"; items: ChatItem[]; trimmed: number; state: ChatState }
  | { type: "item"; item: ChatItem }
  | { type: "delta"; id: string; text: string }
  | { type: "state"; state: ChatState };

export type PublishInfo = {
  videos: VideoFile[];
  claude: ChatStatus | string;
  video: { exists: boolean; error?: string; path?: string; rel?: string; kind?: VideoFile["kind"]; size?: number; madeAt?: string; duration?: number; width?: number; height?: number; vertical?: boolean; changedAfter?: boolean; notes?: Record<"youtube" | "facebook" | "instagram", string[]> };
  drafts: { youtube: YouTubeDraft; facebook: SocialDraft; instagram: SocialDraft };
  problems: Record<"youtube" | "facebook" | "instagram", string[]>;
  state: Partial<Record<"youtube" | "facebook" | "instagram", PlatformState>>;
  youtube: YouTubeStatus & { live: { sent?: number; total?: number; queuePosition: number | null } | null };
  youtubeLog: string[];
  /** missing from older engines (before Meta's API): treat as not connected */
  apiProblems?: Record<"facebook" | "instagram", string[]>;
  meta?: {
    connected: boolean;
    userExpiresAt: string | null;
    pages: MetaPage[];
    account: Record<"facebook" | "instagram", MetaAccount | null>;
    live: Record<"facebook" | "instagram", { sent?: number; total?: number; preparing?: { done: number; total: number }; queuePosition: number | null } | null>;
    log: Record<"facebook" | "instagram", string[]>;
  };
};


export type PublishDefaults = {
  facebookPage: string;
  instagramAccount: string;
  captionFooter: string;
  youtube: { privacy: "private" | "unlisted" | "public"; categoryId: string; madeForKids: boolean | null; tags: string[]; descriptionFooter: string };
  chromeCheck: { at: string; project?: string; extension: boolean; facebook: string; facebookPage?: string; instagram: string; note?: string } | null;
};
export type SettingsView = {
  workspace: string;
  blender: string;
  python: string;
  checks: { workspace: boolean; blender: boolean; python: string | null; ffmpeg: string | null };
  publish: PublishDefaults;
};
export type PublishedRow = { id: string; project: string; number: number; title: string | null; platform: "youtube" | "facebook" | "instagram"; file: string; status: string; url: string | null; studio: string | null; privacy: string | null; format: string | null; at: string | null; error: string | null };
export type PublishListRow = { project: string; number: number; title: string | null; stage: string | null; videos: VideoFile[]; selected: string | null; publish: Partial<Record<"youtube" | "facebook" | "instagram", string>> | null; uploading: boolean };
export type PublishList = { ready: PublishListRow[]; notYet: { project: string; number: number; title: string | null; stage: string | null }[] };

/** A refresh that failed: "Failed to fetch" means the engine isn't answering (stopped or restarting). */
export const unreachable = (e: unknown) => (e instanceof TypeError ? "The engine isn't answering (stopped or restarting). This page catches up by itself when it's back." : (e as Error).message);

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body = await r.json().catch(() => ({}));
  // the error keeps the status and body (e.g. 409 {duplicate} when a file is already on YouTube)
  if (!r.ok) throw Object.assign(new Error((body as { error?: string }).error ?? `${r.status} ${r.statusText}`), { status: r.status, data: body });
  return body as T;
}

export const api = {
  settings: () => call<SettingsView>("/api/settings"),
  saveSettings: (patch: Partial<Omit<SettingsView, "checks" | "publish">> & { publish?: Partial<Omit<PublishDefaults, "youtube" | "chromeCheck">> & { youtube?: Partial<PublishDefaults["youtube"]> } }) =>
    call<SettingsView>("/api/settings", { method: "PUT", body: JSON.stringify(patch) }),
  published: () => call<PublishedRow[]>("/api/published"),
  publishVideos: () => call<PublishList>("/api/publish/videos"),
  publishSelect: (name: string, file: string) => call<{ video: string }>(`/api/projects/${encodeURIComponent(name)}/publish/select`, { method: "POST", body: JSON.stringify({ file }) }),
  youtubeClientFields: (clientId: string, clientSecret: string) => call<YouTubeStatus>("/api/youtube/client-fields", { method: "POST", body: JSON.stringify({ clientId, clientSecret }) }),
  youtubeTest: () => call<{ ok: boolean; error?: string; channel?: YouTubeStatus["channel"] }>("/api/youtube/test", { method: "POST" }),
  chromeCheck: () => call<{ ok: boolean; pending?: boolean; reason?: string; project: string; title: string | null }>("/api/social/chrome-check", { method: "POST", body: "{}" }),
  doctor: () => call<Doctor>("/api/doctor"),
  projects: () => call<ProjectRow[]>("/api/projects"),
  /** request = the user's answer to "what do you want to create?"; title = a short working title (Claude renames it) */
  create: (request: string, title: string) => call<{ name: string; dir: string }>("/api/projects", { method: "POST", body: JSON.stringify({ request, title }) }),
  project: (name: string) => call<ProjectInfo>(`/api/projects/${encodeURIComponent(name)}`),
  open: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/open`, { method: "POST" }),
  studio: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/studio`),
  restartStudio: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/studio/restart`, { method: "POST" }),
  context: (name: string) => call<Context>(`/api/projects/${encodeURIComponent(name)}/context`),
  deleteInfo: (name: string) =>
    call<{ title: string; folder: string; path: string; bytes: number; files: number; hasFinalVideo: boolean; hasRenders: boolean; studio: string }>(`/api/projects/${encodeURIComponent(name)}/delete-info`),
  remove: (name: string, confirm: string) => call<{ deleted: string }>(`/api/projects/${encodeURIComponent(name)}`, { method: "DELETE", body: JSON.stringify({ confirm }) }),
  render: (name: string) => call<RenderInfo>(`/api/projects/${encodeURIComponent(name)}/render`),
  renderStart: (name: string, rerender: string[], autoFix: boolean) => call<RenderJob>(`/api/projects/${encodeURIComponent(name)}/render/start`, { method: "POST", body: JSON.stringify({ rerender, autoFix }) }),
  renderResume: (name: string, autoFix?: boolean) => call<RenderJob>(`/api/projects/${encodeURIComponent(name)}/render/resume`, { method: "POST", body: JSON.stringify({ autoFix }) }),
  renderStop: (name: string) => call<RenderJob>(`/api/projects/${encodeURIComponent(name)}/render/stop`, { method: "POST" }),
  renderAskClaude: (name: string) => call<{ ok: boolean; pending?: boolean; reason?: string }>(`/api/projects/${encodeURIComponent(name)}/render/ask-claude`, { method: "POST" }),
  reveal: (name: string, which: "delivery" | "video" | "folder") => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/render/reveal`, { method: "POST", body: JSON.stringify({ which }) }),
  youtube: () => call<YouTubeStatus>("/api/youtube"),
  youtubeClient: async (file: File) => {
    const r = await fetch("/api/youtube/client", { method: "PUT", headers: { "content-type": "text/plain" }, body: await file.text() });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((body as { error?: string }).error ?? `${r.status}`);
    return body as YouTubeStatus;
  },
  youtubeConnect: () => call<{ url: string }>("/api/youtube/connect", { method: "POST" }),
  meta: () => call<MetaStatus>("/api/meta"),
  metaApp: (appId: string, appSecret: string, configId: string) => call<MetaStatus>("/api/meta/app", { method: "PUT", body: JSON.stringify({ appId, appSecret, configId }) }),
  metaConnect: () => call<{ url: string }>("/api/meta/connect", { method: "POST" }),
  metaToken: (token: string) => call<MetaStatus>("/api/meta/token", { method: "POST", body: JSON.stringify({ token }) }),
  metaTest: () => call<{ ok: boolean; error?: string; pages?: MetaPage[] }>("/api/meta/test", { method: "POST" }),
  metaDisconnect: () => call<MetaStatus>("/api/meta/disconnect", { method: "POST" }),
  metaPost: (name: string, platform: "facebook" | "instagram", again = false) => call<PlatformState>(`/api/projects/${encodeURIComponent(name)}/publish/${platform}/post`, { method: "POST", body: JSON.stringify({ again }) }),
  youtubeDisconnect: () => call<YouTubeStatus>("/api/youtube/disconnect", { method: "POST" }),
  publish: (name: string) => call<PublishInfo>(`/api/projects/${encodeURIComponent(name)}/publish`),
  saveDraft: (name: string, platform: string, patch: object) => call<object>(`/api/projects/${encodeURIComponent(name)}/publish/${platform}`, { method: "PUT", body: JSON.stringify(patch) }),
  youtubeStart: (name: string, again = false) => call<PlatformState>(`/api/projects/${encodeURIComponent(name)}/publish/youtube/start`, { method: "POST", body: JSON.stringify({ again }) }),
  youtubeStop: (name: string) => call<PlatformState>(`/api/projects/${encodeURIComponent(name)}/publish/youtube/stop`, { method: "POST" }),
  handoff: (name: string, platform: "facebook" | "instagram") => call<{ ok: boolean; pending?: boolean; reason?: string }>(`/api/projects/${encodeURIComponent(name)}/publish/${platform}/handoff`, { method: "POST" }),
  publishReport: (name: string, platform: string, status: string, url?: string) => call<PlatformState>(`/api/projects/${encodeURIComponent(name)}/publish/${platform}/report`, { method: "POST", body: JSON.stringify({ status, url }) }),
  publishDraftWithClaude: (name: string) => call<{ ok: boolean; pending?: boolean; reason?: string }>(`/api/projects/${encodeURIComponent(name)}/publish/draft`, { method: "POST", body: "{}" }),
  revealVideo: (name: string) => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/publish/reveal`, { method: "POST" }),
  brief: (name: string) => call<Brief>(`/api/projects/${encodeURIComponent(name)}/brief`),
  view: (name: string, tab: "brief" | "editor" | "final" | "publish") => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/view`, { method: "POST", body: JSON.stringify({ tab }) }),
  link: (name: string, url: string) => call<{ started: boolean }>(`/api/projects/${encodeURIComponent(name)}/link`, { method: "POST", body: JSON.stringify({ url }) }),
  study: (name: string) => call<{ started: boolean }>(`/api/projects/${encodeURIComponent(name)}/study`, { method: "POST" }),
  say: (name: string, text: string) => call<{ sent: boolean; reason?: string }>(`/api/projects/${encodeURIComponent(name)}/say`, { method: "POST", body: JSON.stringify({ text }) }),
  chatSend: (name: string, text: string) => call<{ ok: boolean; reason?: string }>(`/api/projects/${encodeURIComponent(name)}/chat/send`, { method: "POST", body: JSON.stringify({ text }) }),
  chatAnswer: (name: string, id: string, body: { decision: "allow" | "always" | "deny" } | { answers: Record<string, string> }) =>
    call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/chat/answer`, { method: "POST", body: JSON.stringify({ id, ...body }) }),
  chatStop: (name: string) => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/chat/stop`, { method: "POST" }),
  chatMode: (name: string, mode: ChatState["mode"]) => call<ChatState>(`/api/projects/${encodeURIComponent(name)}/chat/mode`, { method: "POST", body: JSON.stringify({ mode }) }),
  chatNew: (name: string) => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/chat/new`, { method: "POST" }),
  chatTerminal: (name: string) => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/chat/terminal`, { method: "POST" }),
  upload: async (name: string, file: File) => {
    const r = await fetch(`/api/projects/${encodeURIComponent(name)}/upload?name=${encodeURIComponent(file.name)}`, { method: "PUT", headers: { "content-type": "application/octet-stream" }, body: file });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((body as { error?: string }).error ?? `${r.status}`);
    return body as { kind: "skill" | "reference"; name: string; path: string };
  },
};
