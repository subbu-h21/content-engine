/** Home: the workspace, a "new video" form, and the list of videos. */
import React, { useEffect, useState } from "react";
import { api, type Doctor, type ProjectRow } from "./api";
import { navigate } from "./nav";

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [workspace, setWorkspace] = useState("");
  const [editingWs, setEditingWs] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api.projects().then(setProjects, (e) => setError(e.message));
    api.doctor().then((d) => {
      setDoctor(d);
      setWorkspace(d.workspace);
    }, (e) => setError(e.message));
  };
  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const p = await api.create(title.trim());
      navigate(`/p/${encodeURIComponent(p.name)}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
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
        <h2>New video</h2>
        <form className="new" onSubmit={create}>
          <input placeholder="What is the video called?" value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} />
          <button type="submit" disabled={busy || !title.trim()}>
            {busy ? "Creating…" : "Create"}
          </button>
        </form>
        <p className="hint">Creates the next numbered folder in the workspace and opens it in the editor.</p>
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
              <span className="folder">{p.name}</span>
              {p.engine ? (
                <button onClick={() => navigate(`/p/${encodeURIComponent(p.name)}`)}>{p.studio === "ready" ? "Return" : "Open"}</button>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
