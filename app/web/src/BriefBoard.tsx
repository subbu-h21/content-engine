/** The Brief board: the video's plan as Claude writes it (read live from the project files), plus references. */
import React, { useEffect, useRef, useState } from "react";
import { api, previewUrl, type Brief, type CatalogStyle, type HookOption, type Stage } from "./api";
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
          if (!said.sent) setError(`Added the skill file; tell Claude about it yourself (${said.reason ?? "Claude couldn't be reached"}).`);
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
      (r) => !r.sent && setError(`Not sent: ${r.reason ?? "Claude couldn't be reached."}`),
      (e) => setError((e as Error).message),
    );
  };

  if (!b) return <div className="board">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const stage = b.status.stage;
  const swatches = hexes(b.style);
  // the template's voice counts as chosen once there's a sample or the brief is past talking it through
  const voiceDecided = !!b.voice.voice && (!b.voice.isDefault || !!b.voice.sample || !["new", "talking", "none"].includes(stage));
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

      {b.hooks ? <HookCard name={name} hooks={b.hooks} canChange={["new", "talking", "none", "awaiting-approval"].includes(stage)} onError={setError} /> : null}

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

      <Section title="Look" empty={!b.style && !b.frames.length && !b.look}>
        {b.look ? <StyleRow name={name} look={b.look} onError={setError} /> : null}
        {b.look && !b.look.style && !b.style && !b.frames.length ? <p className="hint">Not decided yet.</p> : null}
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

      <Section title="Sound" empty={!voiceDecided && !b.music.prompt}>
        <div className="kv">
          <span className="label">Voice</span>
          {voiceDecided ? (
            <span>
              <strong>{b.voice.voice}</strong> <span className="dim">{b.voice.style}</span>
            </span>
          ) : (
            <span className="dim">not decided</span>
          )}
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

/** The video's opening line: the best two options, the rest on request. Claude builds the script on the one picked. */
const HookCard: React.FC<{ name: string; hooks: NonNullable<Brief["hooks"]>; canChange: boolean; onError: (e: string | null) => void }> = ({ name, hooks, canChange, onError }) => {
  const [all, setAll] = useState(false);
  const [changing, setChanging] = useState(false);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false); // a ref: a second click can land before the page has redrawn
  const chosen = hooks.options.find((o) => o.id === hooks.chosen) ?? null;
  // the engine saves the pick only if Claude got it, so a failed send can be tried again
  const pick = async (o: HookOption) => {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    onError(null);
    try {
      const r = await api.chooseHook(name, o.id);
      if (r.sent) setChanging(false);
      else onError(`Not sent: ${r.reason ?? "Claude couldn't be reached."}`);
    } catch (e) {
      onError((e as Error).message);
    }
    sending.current = false;
    setBusy(false);
  };
  const row = (o: HookOption) => (
    <li key={o.id} className={`hook ${o.id === hooks.chosen ? "on" : ""}`}>
      <span className={`hook-score ${o.verdict}`}>{o.score}</span>
      <div>
        <p className="hook-text">{o.text}</p>
        <p className="meta">
          {[o.formula, o.why].filter(Boolean).join(" · ")}
          {o.note ? ` · weak: ${o.note}` : ""}
        </p>
      </div>
      {canChange ? (
        <button className={o.id === hooks.chosen ? "quiet" : "primary"} disabled={busy || o.id === hooks.chosen} onClick={() => pick(o)}>
          {o.id === hooks.chosen ? "Picked" : "Use this hook"}
        </button>
      ) : null}
    </li>
  );
  const shown = chosen && !changing ? [chosen] : all ? hooks.options : hooks.options.filter((o) => hooks.best.includes(o.id));
  return (
    <section className="card">
      <h2>Hook</h2>
      {!chosen ? <p className="hint">The video's first line. Pick one and Claude builds the script on it. The score is a guide: it spots weak lines, it can't promise a good one.</p> : null}
      <ul className="hooks">{shown.map(row)}</ul>
      {chosen && !changing && canChange ? (
        <button className="quiet" onClick={() => setChanging(true)}>
          Change the hook
        </button>
      ) : null}
      {(!chosen || changing) && hooks.options.length > 2 ? (
        <button className="quiet" onClick={() => setAll(!all)}>
          {all ? "Show the best two" : `Show all ${hooks.options.length}`}
        </button>
      ) : null}
    </section>
  );
};

/**
 * The video's catalog style on the Look card: its cover and name, its channel, and (unless the channel's look is
 * locked) Change (a picker of catalog styles) and New look from a file (Claude makes a catalog style from it).
 */
const StyleRow: React.FC<{ name: string; look: NonNullable<Brief["look"]>; onError: (e: string | null) => void }> = ({ name, look, onError }) => {
  const [picking, setPicking] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const files = useRef<HTMLInputElement>(null);
  const locked = !!look.style?.locked;

  const newLook = async (list: FileList) => {
    onError(null);
    setNote(null);
    try {
      const { id: draft } = await api.catalogNewDraft();
      for (const [i, f] of Array.from(list).entries()) {
        setBusy(`Adding ${f.name} (${i + 1}/${list.length})…`);
        await api.catalogDraftUpload(draft, f);
      }
      setBusy("Handing it to Claude…");
      const r = await api.projectStyleFromDraft(name, draft);
      setNote(r.told ? "Claude is making a new catalog style from it and will use it here: follow along in the chat." : `Saved, but Claude wasn't reached: ${r.reason ?? "try again"}.`);
    } catch (e) {
      onError((e as Error).message);
    }
    setBusy(null);
  };

  return (
    <div className="style-row">
      {look.style?.cover ? <img className="style-thumb" src={look.style.cover} alt="" /> : null}
      <div className="style-row-main">
        {look.style ? (
          <p>
            <strong>{look.style.name}</strong> <span className="dim">from the catalog</span>
            {locked ? <span className="pill">look locked</span> : null}
          </p>
        ) : (
          <p className="dim">No catalog style yet: Claude proposes one while you talk, or choose one.</p>
        )}
        {look.channel ? <p className="dim">Channel: {look.channel.name}</p> : null}
        {locked ? (
          <p className="hint">The {look.channel?.name ?? "channel"} channel's look is locked (Settings → Channels).</p>
        ) : (
          <div className="actions">
            <button onClick={() => setPicking(true)} disabled={!!busy}>
              {look.style ? "Change" : "Choose a style"}
            </button>
            <button className="quiet" onClick={() => files.current?.click()} disabled={!!busy} title="An image, PDF, style guide or video: Claude makes it a catalog style and uses it here">
              New look from a file
            </button>
            <input
              ref={files}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                const l = e.target.files;
                if (l?.length) newLook(l).finally(() => (e.target.value = ""));
              }}
            />
            {look.style ? (
              <a className="quiet" href={`/catalog/${look.style.id}`} onClick={(e) => (e.preventDefault(), navigate(`/catalog/${look.style!.id}`))}>
                See it in the Catalog
              </a>
            ) : null}
          </div>
        )}
        {busy ? <p className="hint">{busy}</p> : null}
        {note ? <p className="hint">{note}</p> : null}
      </div>
      {picking ? (
        <StylePicker
          current={look.style?.id ?? null}
          onClose={() => setPicking(false)}
          onPick={async (id) => {
            onError(null);
            try {
              const r = await api.projectStyle(name, id);
              setNote(r.told ? `Now using “${r.style.name}”: Claude is updating the look (see the chat).` : `Now using “${r.style.name}”. Claude wasn't reached (${r.reason ?? "try again"}); tell it in the chat.`);
              setPicking(false);
            } catch (e) {
              onError((e as Error).message);
            }
          }}
        />
      ) : null}
    </div>
  );
};

/** A pop-up grid of catalog styles to pick from. */
const StylePicker: React.FC<{ current: string | null; onClose: () => void; onPick: (id: string) => void }> = ({ current, onClose, onPick }) => {
  const [styles, setStyles] = useState<CatalogStyle[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    api.catalog().then((r) => setStyles(r.styles), () => setStyles([]));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const shown = (styles ?? []).filter((s) => !q.trim() || `${s.name} ${s.summary} ${s.tags.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal picker" role="dialog" aria-modal="true">
        <div className="picker-head">
          <h2>Choose a style</h2>
          <input placeholder="Search styles" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <button className="quiet" onClick={onClose}>
            Close
          </button>
        </div>
        {styles === null ? <p className="hint">Loading…</p> : null}
        <ul className="style-grid small">
          {shown.map((s) => (
            <li key={s.id}>
              <button className={`style-card ${s.id === current ? "current" : ""}`} onClick={() => onPick(s.id)} title={s.summary}>
                <span className="style-cover">{s.cover ? <img src={previewUrl(s.id, "cover.jpg", s.stamp)} alt="" loading="lazy" /> : null}</span>
                <span className="style-name">{s.name}</span>
                {s.id === current ? <span className="pill">in use</span> : s.status === "experimental" ? <span className="pill warn-pill">experimental</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
