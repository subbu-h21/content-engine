/** The Brief board: the video's plan as Claude writes it (read live from the project files), plus references. */
import React, { useEffect, useRef, useState } from "react";
import { api, type Brief, type Stage } from "./api";
import { Markdown } from "./Markdown";
import { navigate } from "./nav";
import { STAGE_WORD as STAGES } from "./words";

const ORDER: Stage[] = ["talking", "awaiting-approval", "building", "preview-ready", "final-ready"];

const fmt = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : `${s.toFixed(s < 10 ? 1 : 0)} s`);
const hexes = (text: string | null) => [...new Set((text ?? "").match(/#[0-9a-fA-F]{6}\b/g) ?? [])].slice(0, 12);

const Section: React.FC<{ title: string; empty?: boolean; hint?: string; children?: React.ReactNode }> = ({ title, empty, hint, children }) => (
  <section className={`card ${empty ? "empty" : ""}`}>
    <h2>{title}</h2>
    {empty ? <p className="hint">{hint ?? "Not decided yet."}</p> : children}
  </section>
);

export const BriefBoard: React.FC<{ name: string; onOpenEditor: () => void }> = ({ name, onOpenEditor }) => {
  const [b, setB] = useState<Brief | null>(null);
  // loadError: the board couldn't be read (cleared by the next good refresh); error: a button or upload didn't work
  // (stays until the next action, so the reason can be read)
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setB(await api.brief(name));
          setLoadError(null);
        } catch (e) {
          setLoadError((e as Error).message);
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    })();
    return () => {
      stop = true;
    };
  }, [name]);

  const upload = async (files: FileList | File[]) => {
    setError(null);
    for (const f of Array.from(files)) {
      setBusy(`Uploading ${f.name}…`);
      try {
        const r = await api.upload(name, f);
        if (r.kind === "skill") {
          const said = await api.say(name, `I added a skill file "${r.name}" (${r.path}). Read it; it applies to this video.`);
          if (!said.sent) setError(`Added the skill file; tell Claude about it yourself (${said.reason ?? "its panel isn't at its prompt"}).`);
        }
      } catch (e) {
        setError(`${f.name}: ${(e as Error).message}`);
      }
    }
    setBusy(null);
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    setError(null);
    try {
      await api.link(name, link.trim());
      setLink("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const say = (text: string) => {
    setError(null);
    return api.say(name, text).then(
      (r) => !r.sent && setError(`Not sent: ${r.reason ?? "the Claude panel isn't at its prompt."}`),
      (e) => setError((e as Error).message),
    );
  };

  if (!b) return <div className="board">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const stage = b.status.stage;
  const swatches = hexes(b.style);
  const running = b.jobs.filter((j) => j.status === "running");
  const failed = b.jobs.filter((j) => j.status === "error").slice(-2);

  return (
    <div
      className={`board ${drag ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={(e) => e.currentTarget === e.target && setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
      }}
    >
      <div className={`status stage-${stage}`}>
        <div className="steps">
          {ORDER.map((s) => (
            <span key={s} className={s === stage ? "on" : ORDER.indexOf(s) < ORDER.indexOf(stage) ? "done" : ""}>
              {STAGES[s]}
            </span>
          ))}
        </div>
        <p className="note">{b.status.note || (stage === "new" ? "Claude will start by asking what you want to make." : "")}</p>
        {stage === "awaiting-approval" ? (
          <div className="actions">
            <button className="primary" onClick={() => say("Approved. Build the preview.")}>
              Approve and build
            </button>
            <span className="hint">or tell Claude what to change →</span>
          </div>
        ) : null}
        {stage === "preview-ready" ? (
          <div className="actions">
            <button className="primary" onClick={onOpenEditor}>
              Open the Editor
            </button>
          </div>
        ) : null}
        {stage === "final-ready" ? (
          <div className="actions">
            <button className="primary" onClick={() => navigate(`/p/${encodeURIComponent(name)}/final`)}>
              See the final video
            </button>
          </div>
        ) : null}
        {stage === "new" || stage === "talking" || stage === "none" ? <p className="hint">Talk to Claude on the right. Drop reference videos, images or a style/skill file anywhere here.</p> : null}
      </div>

      {loadError ? <p className="error">{loadError}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <Section title="Idea" empty={!b.brief}>
        {b.brief ? <Markdown text={b.brief} /> : null}
      </Section>

      <Section title="Script" empty={!b.script.scenes.length}>
        <p className="meta">
          {b.script.words} words · {b.script.total ? `${fmt(b.script.total)} recorded` : `about ${fmt(b.script.estimate)} (estimated)`}
        </p>
        {b.script.scenes.map((s, si) => (
          <div key={s.id} className="scene">
            <h3>
              <span className="num">{String(si + 1).padStart(2, "0")}</span> {s.title}
            </h3>
            {s.lines.map((l) => (
              <div key={l.id} className="line">
                <span className="text">{l.text}</span>
                <span className="secs">{l.seconds != null ? `${l.seconds} s` : `~${l.estimate} s`}{l.pause ? ` +${l.pause}` : ""}</span>
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Look" empty={!b.style && !b.frames.length}>
        {b.frames.length ? (
          <div className="frames">
            {b.frames.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noreferrer" title={f.name}>
                <img src={f.url} alt={f.name} />
              </a>
            ))}
          </div>
        ) : null}
        {swatches.length ? (
          <div className="swatches">
            {swatches.map((h) => (
              <span key={h} style={{ background: h }} title={h} />
            ))}
          </div>
        ) : null}
        {b.style ? (
          <details>
            <summary>Style guide</summary>
            <Markdown text={b.style} />
          </details>
        ) : null}
      </Section>

      <Section title="Sound" empty={!b.voice.voice && !b.music.prompt}>
        <div className="kv">
          <span className="label">Voice</span>
          <span>
            <strong>{b.voice.voice}</strong> <span className="dim">{b.voice.style}</span>
          </span>
          {b.voice.sample ? (
            <>
              <span className="label">Sample</span>
              <audio controls src={b.voice.sample} />
            </>
          ) : null}
          <span className="label">Music</span>
          <span>{b.music.prompt || <span className="dim">not decided</span>}</span>
          {b.music.track ? (
            <>
              <span className="label">Track</span>
              <audio controls src={b.music.track} />
            </>
          ) : null}
        </div>
      </Section>

      <Section title="Visual plan" empty={!b.plan}>
        {b.plan ? <Markdown text={b.plan} /> : null}
        {b.plates.length ? <p className="meta">3D plates: {b.plates.map((p) => `${p.id} (${p.from} → ${p.to})`).join(", ")}</p> : null}
      </Section>

      <section className="card">
        <h2>References</h2>
        <div className="drop" onClick={() => fileInput.current?.click()}>
          <strong>Drop files here</strong> or click to choose: reference videos, images, audio, or a <code>.md</code> style/skill file.
          <input ref={fileInput} type="file" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
        </div>
        <form className="link" onSubmit={addLink}>
          <input placeholder="…or paste a YouTube / Instagram link" value={link} onChange={(e) => setLink(e.target.value)} />
          <button type="submit" disabled={!link.trim()}>
            Add
          </button>
        </form>
        {busy ? <p className="hint">{busy}</p> : null}
        {running.map((j) => (
          <p key={j.id} className="hint">
            ⧗ {j.label}…
          </p>
        ))}
        {failed.map((j) => (
          <p key={j.id} className="error">
            {j.label} failed: {j.error?.split("\n").filter(Boolean).slice(-1)[0]}
          </p>
        ))}
        <ul className="refs">
          {b.references.map((r) => (
            <li key={r.file}>
              {r.contact || r.image ? <img src={(r.contact || r.image)!} alt="" /> : <span className="noimg">{r.kind ?? "file"}</span>}
              <div>
                <div className="refname">{r.file}</div>
                <div className="meta">
                  {r.kind ?? "…"}
                  {r.duration ? ` · ${fmt(r.duration)}` : ""} · {r.status === "done" ? "studied" : r.status === "error" ? <span className="error">study failed</span> : "studying…"}
                </div>
                {r.palette?.length ? (
                  <div className="swatches small">
                    {r.palette.map((p) => (
                      <span key={p.hex} style={{ background: p.hex }} title={`${p.hex} ${Math.round(p.share * 100)}%`} />
                    ))}
                  </div>
                ) : null}
                {r.transcript ? (
                  <details>
                    <summary>Transcript</summary>
                    <pre>{r.transcript}</pre>
                  </details>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {b.skills.length ? <p className="meta">Skills for this video: {b.skills.join(", ")}</p> : null}
      </section>
    </div>
  );
};
