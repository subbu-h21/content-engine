/** Typed calls to the engine server (same origin). */

export type ProjectRow = { name: string; dir: string; number: number; engine: boolean; title: string | null; link: string | null; studio: string };
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
  create: (title: string) => call<{ name: string; dir: string }>("/api/projects", { method: "POST", body: JSON.stringify({ title }) }),
  project: (name: string) => call<ProjectInfo>(`/api/projects/${encodeURIComponent(name)}`),
  open: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/open`, { method: "POST" }),
  studio: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/studio`),
  restartStudio: (name: string) => call<StudioInfo>(`/api/projects/${encodeURIComponent(name)}/studio/restart`, { method: "POST" }),
  context: (name: string) => call<Context>(`/api/projects/${encodeURIComponent(name)}/context`),
};
