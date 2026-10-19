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
  voice: { voice: string; style: string; sample: string | null };
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
};


export type YouTubeStatus = { clientSaved: boolean; connected: boolean; channel: { id: string; title: string; url: string } | null; connectedAt: string | null };
export type YouTubeDraft = { title: string; description: string; tags: string[]; categoryId: string; privacy: "private" | "unlisted" | "public" | "scheduled"; publishAt: string | null; madeForKids: boolean | null; synthetic: boolean };
export type SocialDraft = { page?: string; account?: string; format: "reel" | "post"; caption: string };
export type PlatformState = {
  status?: string;
  error?: string | null;
  url?: string | null;
  note?: string | null;
  progress?: { sent: number; total: number } | null;
  result?: { id: string; url: string; studio: string; privacy: string } | null;
  updatedAt?: string;
  reportedAt?: string;
};
export type PublishInfo = {
  video: { exists: boolean; error?: string; path?: string; size?: number; madeAt?: string; duration?: number; width?: number; height?: number; vertical?: boolean; changedAfter?: boolean; notes?: Record<"youtube" | "facebook" | "instagram", string[]> };
  drafts: { youtube: YouTubeDraft; facebook: SocialDraft; instagram: SocialDraft };
  problems: Record<"youtube" | "facebook" | "instagram", string[]>;
  state: Partial<Record<"youtube" | "facebook" | "instagram", PlatformState>>;
  youtube: YouTubeStatus & { live: { sent?: number; total?: number; queuePosition: number | null } | null };
};

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((body as { error?: string }).error ?? `${r.status} ${r.statusText}`);
  return body as T;
}

export const api = {
  settings: () => call<{ workspace: string }>("/api/settings"),
  setWorkspace: (workspace: string) => call<{ workspace: string }>("/api/settings", { method: "PUT", body: JSON.stringify({ workspace }) }),
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
  youtubeDisconnect: () => call<YouTubeStatus>("/api/youtube/disconnect", { method: "POST" }),
  publish: (name: string) => call<PublishInfo>(`/api/projects/${encodeURIComponent(name)}/publish`),
  saveDraft: (name: string, platform: string, patch: object) => call<object>(`/api/projects/${encodeURIComponent(name)}/publish/${platform}`, { method: "PUT", body: JSON.stringify(patch) }),
  youtubeStart: (name: string) => call<PlatformState>(`/api/projects/${encodeURIComponent(name)}/publish/youtube/start`, { method: "POST" }),
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
  upload: async (name: string, file: File) => {
    const r = await fetch(`/api/projects/${encodeURIComponent(name)}/upload?name=${encodeURIComponent(file.name)}`, { method: "PUT", headers: { "content-type": "application/octet-stream" }, body: file });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((body as { error?: string }).error ?? `${r.status}`);
    return body as { kind: "skill" | "reference"; name: string; path: string };
  },
};
