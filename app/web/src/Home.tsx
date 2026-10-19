/** Home: the workspace, a "new video" form, and the list of videos. */
import React, { useEffect, useRef, useState } from "react";
import { api, type Doctor, type ProjectRow } from "./api";
import { DeleteDialog } from "./DeleteDialog";
import { navigate } from "./nav";

const STAGE_LABEL: Record<string, string> = {
  new: "new",
  talking: "brief",
  "awaiting-approval": "waiting for your OK",
  building: "building",
  "preview-ready": "preview ready",
  "final-ready": "final ready",
};

const RENDER_LABEL = (r: NonNullable<ProjectRow["render"]>) =>
  ({ queued: `render queued${r.queuePosition ? ` (#${r.queuePosition})` : ""}`, running: `rendering ${r.percent}%`, failed: "render stopped by an error", interrupted: "render interrupted", cancelled: "render stopped", done: "" })[r.status] ?? "";

/** A short working title from what the user wrote: first sentence, cut on a word boundary. Claude renames it later. */
const workingTitle = (text: string) => {
  const first = text.trim().split(/(?<=[.!?])\s|\n/)[0].trim();
  if (first.length <= 60) return first;
  const cut = first.slice(0, 60);
  const sp = cut.lastIndexOf(" ");
  return (sp > 20 ? cut.slice(0, sp) : cut).trim() + "…";
};

const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [workspace, setWorkspace] = useState("");
  const [editingWs, setEditingWs] = useState(false);
  const [request, setRequest] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState<ProjectRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api.projects().then(setProjects, (e) => setError(e.message));
    api.doctor().then((d) => {
      setDoctor(d);
      setWorkspace(d.workspace);
    }, (e) => setError(e.message));
  };
  useEffect(load, []);

  const addFiles = (list: FileList | File[]) => {
    const add = Array.from(list);
    setFiles((cur) => [...cur, ...add.filter((f) => !cur.some((c) => c.name === f.name && c.size === f.size))]);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;
    setBusy("Creating…");
    setError(null);
    try {
      const p = await api.create(request.trim(), workingTitle(request));
      // files go in before the Brief opens, so Claude sees them with its first reply
      for (const [i, f] of files.entries()) {
        setBusy(`Adding ${f.name} (${i + 1}/${files.length})…`);
        try {
          await api.upload(p.name, f);
        } catch (err) {
          setError(`${f.name} could not be added: ${(err as Error).message}`);
        }
      }
      navigate(`/p/${encodeURIComponent(p.name)}/brief`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  };

  const saveWs = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.setWorkspace(workspace);
      setEditingWs(false);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const warnings: string[] = [];
  if (doctor && !doctor.runtime) warnings.push("Engine packages are missing: run npm install in content-engine/runtime.");
  if (doctor && !doctor.claude) warnings.push("The claude command was not found on PATH; the Claude panel will not start.");
  if (doctor?.onC) warnings.push("The workspace is on C:, which is nearly full. Renders need many GB; D: is better.");
  if (doctor?.freeGb != null && doctor.freeGb < 20) warnings.push(`Only ${doctor.freeGb} GB free on the workspace drive.`);

  return (
    <div className="home">
      <header className="home-head">
        <h1>
          Content <em>engine</em>
        </h1>
        {editingWs ? (
          <form className="ws-form" onSubmit={saveWs}>
            <input value={workspace} onChange={(e) => setWorkspace(e.target.value)} spellCheck={false} autoFocus />
            <button type="submit">Save</button>
            <button type="button" className="quiet" onClick={() => setEditingWs(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button className="ws" onClick={() => setEditingWs(true)} title="Folder where video projects are created">
            <span className="label">Workspace</span> {doctor?.workspace || "not set"}
          </button>
        )}
      </header>

      {warnings.map((w) => (
        <p key={w} className="warn">
          {w}
        </p>
      ))}
      {error ? <p className="error">{error}</p> : null}

      <section>
        <h2>What do you want to create today?</h2>
        <form className="new" onSubmit={create}>
          <textarea
            placeholder="e.g. A 30 second vertical explainer on why the sky is blue, for curious teenagers"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) create(e);
            }}
            rows={3}
            disabled={!!busy}
          />
          <div
            className={`drop ${drag ? "over" : ""}`}
            onClick={() => !busy && fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              if (!busy && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
          >
            <strong>Do you have an inspiration, a reference or a skill file?</strong>
            <span>Drop it here or click to choose (optional): videos or images whose style you like, a style guide, or a skill file.</span>
            <input ref={fileInput} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          </div>
          {files.length ? (
            <ul className="queued">
              {files.map((f) => (
                <li key={f.name + f.size}>
                  <span>{f.name}</span>
                  <span className="dim">{fmtSize(f.size)}</span>
                  <button type="button" className="quiet" disabled={!!busy} onClick={() => setFiles((cur) => cur.filter((c) => c !== f))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="create-row">
            <span className="hint">{busy ?? "Creates the next numbered folder in the workspace; Claude takes it from there on the Brief."}</span>
            <button type="submit" className="primary" disabled={!!busy || !request.trim()}>
              Create
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2>Videos</h2>
        {projects === null ? <p className="hint">Loading…</p> : null}
        {projects?.length === 0 ? <p className="hint">No project folders yet.</p> : null}
        <ul className="projects">
          {projects?.map((p) => (
            <li key={p.name} className={p.engine ? "" : "legacy"}>
              <span className="num">{String(p.number).padStart(2, "0")}</span>
              <span className="title">{p.engine ? p.title : <em>not an engine project</em>}</span>
              <span className="folder">
                {p.render && RENDER_LABEL(p.render) ? <span className={`stage render-${p.render.status}`}>{RENDER_LABEL(p.render)}</span> : p.stage && STAGE_LABEL[p.stage] ? <span className="stage">{STAGE_LABEL[p.stage]}</span> : null}
                {p.name}
              </span>
              {p.engine ? (
                <span className="row-actions">
                  <button onClick={() => navigate(`/p/${encodeURIComponent(p.name)}${p.render && p.render.status !== "done" ? "/final" : p.stage === "final-ready" ? "/final" : p.stage && p.stage !== "preview-ready" ? "/brief" : ""}`)}>{p.studio === "ready" ? "Return" : "Open"}</button>
                  <button className="quiet" title="Move this video's folder to the Recycle Bin" onClick={() => setDeleting(p)}>
                    Delete
                  </button>
                </span>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      </section>
      {deleting ? (
        <DeleteDialog
          name={deleting.name}
          number={deleting.number}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            load();
          }}
        />
      ) : null}
    </div>
  );
};
