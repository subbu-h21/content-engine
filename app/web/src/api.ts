/** Typed calls to the engine server (same origin). */

export type ProjectRow = { name: string; dir: string; number: number; engine: boolean; title: string | null; link: string | null; studio: string; stage: string | null };
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

export type Stage = "new" | "talking" | "awaiting-approval" | "building" | "preview-ready" | "none";
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
  brief: (name: string) => call<Brief>(`/api/projects/${encodeURIComponent(name)}/brief`),
  view: (name: string, tab: "brief" | "editor") => call<{ ok: boolean }>(`/api/projects/${encodeURIComponent(name)}/view`, { method: "POST", body: JSON.stringify({ tab }) }),
  link: (name: string, url: string) => call<{ started: boolean }>(`/api/projects/${encodeURIComponent(name)}/link`, { method: "POST", body: JSON.stringify({ url }) }),
  study: (name: string) => call<{ started: boolean }>(`/api/projects/${encodeURIComponent(name)}/study`, { method: "POST" }),
  say: (name: string, text: string) => call<{ sent: boolean }>(`/api/projects/${encodeURIComponent(name)}/say`, { method: "POST", body: JSON.stringify({ text }) }),
  upload: async (name: string, file: File) => {
    const r = await fetch(`/api/projects/${encodeURIComponent(name)}/upload?name=${encodeURIComponent(file.name)}`, { method: "PUT", headers: { "content-type": "application/octet-stream" }, body: file });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((body as { error?: string }).error ?? `${r.status}`);
    return body as { kind: "skill" | "reference"; name: string; path: string };
  },
};
