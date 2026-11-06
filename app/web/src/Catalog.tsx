/**
 * The Catalog: a gallery of styles (/catalog), a page per style with its sheet and the catalog's Claude (/catalog/<id>),
 * and a page for a new style made from the user's files, links and note (/catalog/new/<draft>).
 * Styles: library/catalog/visual (built-in) and <workspace>/catalog/visual (the user's); server: app/server/catalog.mjs.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { api, CATALOG_CHAT, previewUrl, type CatalogDraft, type CatalogStyle, type StyleDetail } from "./api";
import { Chat } from "./Chat";
import { Markdown } from "./Markdown";
import { navigate } from "./nav";
import { TopNav } from "./TopNav";

const PANEL_KEY = "ce.claudePanelWidth";
const STATUS_WORD: Record<string, string> = { "built-in": "built-in", approved: "approved", experimental: "experimental" };

// ---- the gallery

type Filter = "all" | "builtin" | "mine" | "experimental" | `tag:${string}`;

export const CatalogGallery: React.FC = () => {
  const [styles, setStyles] = useState<CatalogStyle[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.catalog().then((r) => setStyles(r.styles), (e) => setError(e.message));
    api.catalogView("gallery").catch(() => undefined);
  }, []);

  // the tags that sort the most styles, as filter chips
  const tags = useMemo(() => {
    const n = new Map<string, number>();
    for (const s of styles ?? []) for (const t of s.tags) n.set(t, (n.get(t) ?? 0) + 1);
    return [...n.entries()].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 14).map(([t]) => t);
  }, [styles]);

  const shown = (styles ?? []).filter((s) => {
    if (filter === "builtin" && !s.builtIn) return false;
    if (filter === "mine" && s.builtIn) return false;
    if (filter === "experimental" && s.status !== "experimental") return false;
    if (filter.startsWith("tag:") && !s.tags.includes(filter.slice(4))) return false;
    const q = query.trim().toLowerCase();
    return !q || `${s.name} ${s.summary} ${s.tags.join(" ")}`.toLowerCase().includes(q);
  });

  const chip = (f: Filter, label: string) => (
    <button key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(filter === f ? "all" : f)}>
      {label}
    </button>
  );

  return (
    <div className="home catalog">
      <TopNav current="catalog" />
      {error ? <p className="error">{error}</p> : null}
      <section className="catalog-head">
        <div>
          <h2>Styles</h2>
          <p className="hint">
            {styles ? `${styles.length} styles · ` : ""}a video uses one, copied into it, so changing a style here never changes a finished video
          </p>
        </div>
        <input className="catalog-search" placeholder="Search styles" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="primary" onClick={() => navigate("/catalog/new")}>
          Add a style
        </button>
      </section>
      <div className="chips">
        {chip("all", "All")}
        {chip("builtin", "Built-in")}
        {chip("mine", "Mine")}
        {chip("experimental", "Experimental")}
        {tags.map((t) => chip(`tag:${t}`, t))}
      </div>
      {styles === null && !error ? <p className="hint">Loading…</p> : null}
      {styles && !shown.length ? <p className="hint">No style matches.</p> : null}
      <ul className="style-grid">
        {shown.map((s) => (
          <StyleCard key={s.id} s={s} />
        ))}
      </ul>
    </div>
  );
};

/** A style's cover; on hover it plays the style's reel, or steps through its stills if it has no reel yet. */
const StyleCard: React.FC<{ s: CatalogStyle }> = ({ s }) => {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = () => {
    if (s.reel) return setPlaying(true);
    if (timer.current || s.stills.length < 2) return;
    timer.current = setInterval(() => setI((x) => (x + 1) % s.stills.length), 750);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setI(0);
    setPlaying(false);
  };
  useEffect(() => stop, []);
  const img = s.stills.length ? `${s.stills[i]}.jpg` : s.cover ? "cover.jpg" : null;
  return (
    <li>
      <a
        className="style-card"
        href={`/catalog/${s.id}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/catalog/${s.id}`);
        }}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <span className="style-cover">
          {img ? <img src={previewUrl(s.id, img, s.stamp)} alt="" loading="lazy" /> : <span className="dim">no preview yet</span>}
          {playing ? <video src={previewUrl(s.id, "reel.mp4", s.stamp)} autoPlay muted loop playsInline /> : null}
        </span>
        <span className="style-name">{s.name}</span>
        <span className="style-summary">{s.summary}</span>
        <span className="style-badges">
          {s.builtIn ? <span className="pill">built-in</span> : s.editedBuiltIn ? <span className="pill">your copy</span> : <span className="pill mine">yours</span>}
          {s.status === "experimental" ? <span className="pill warn-pill">experimental</span> : null}
        </span>
      </a>
    </li>
  );
};

// ---- a style's page and the new-style page share this frame: the left side, a divider, the catalog's Claude

const WithClaude: React.FC<{ back: React.ReactNode; title: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode }> = ({ back, title, actions, children }) => {
  const [width, setWidth] = useState(() => {
    try {
      return Number(localStorage.getItem(PANEL_KEY)) || 560;
    } catch {
      return 560;
    }
  });
  const drag = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const move = (ev: PointerEvent) => setWidth(Math.max(320, Math.min(window.innerWidth - 400, startW - (ev.clientX - startX))));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setWidth((w) => {
        try {
          localStorage.setItem(PANEL_KEY, String(w));
        } catch {
          // storage unavailable
        }
        return w;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div className="editor">
      <header className="bar">
        {back}
        <span className="project-title">{title}</span>
        <span className="spacer" />
        {actions}
      </header>
      <div className="panes">
        <div className="style-sheet">{children}</div>
        <div className="divider" onPointerDown={drag} />
        <aside className="claude-pane" style={{ width }}>
          <Chat project={CATALOG_CHAT} />
        </aside>
      </div>
    </div>
  );
};

const BackToCatalog: React.FC = () => (
  <button className="quiet" onClick={() => navigate("/catalog")}>
    ← Catalog
  </button>
);

const recipeText = (r: Record<string, unknown>) => {
  if (r.kind === "spring") return `spring · damping ${r.damping}, stiffness ${r.stiffness}, mass ${r.mass}`;
  const curve = Array.isArray(r.curve) ? `cubic-bezier(${(r.curve as number[]).join(", ")})` : String(r.curve ?? "");
  return `${curve} · ${r.duration} s${r.distance !== undefined ? ` · ${r.distance} px` : ""}`;
};

export const StylePage: React.FC<{ id: string }> = ({ id }) => {
  const [d, setD] = useState<StyleDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [big, setBig] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fontInput = useRef<HTMLInputElement>(null);
  const lastJson = useRef<string | null>(null);

  // the style can change while the page is open (Claude edits it, re-renders its previews): refresh every few seconds.
  // The preview links carry the render time (`stamp`), so new previews show.
  useEffect(() => {
    let stop = false;
    setD(null);
    setMissing(false);
    lastJson.current = null;
    api.catalogView("style", id).catch(() => undefined);
    const load = async () => {
      try {
        const next = await api.catalogStyle(id);
        if (stop) return;
        const json = JSON.stringify(next);
        if (json !== lastJson.current) {
          lastJson.current = json;
          setD(next);
        }
        setMissing(false);
      } catch (e) {
        if (!stop && (e as { status?: number }).status === 404) setMissing(true);
      }
    };
    load();
    const t = setInterval(load, 4000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [id]);

  const act = async (fn: () => Promise<unknown>, done?: string) => {
    setError(null);
    setNote(null);
    try {
      const r = (await fn()) as { sent?: boolean; reason?: string } | undefined;
      if (r?.sent === false) throw new Error(`Not sent: ${r.reason ?? "Claude couldn't be reached."}`);
      if (done) setNote(done);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (missing)
    return (
      <div className="home">
        <TopNav current="catalog" />
        <p className="error">There's no style called “{id}”: it was deleted or renamed.</p>
        <div className="actions">
          <button onClick={() => navigate("/catalog")}>Back to the Catalog</button>
        </div>
      </div>
    );

  const s = d?.style ?? {};
  const own = d ? !d.builtIn : false;
  const actions = d ? (
    <>
      {own && s.status === "experimental" ? (
        <button className="primary" onClick={() => act(() => api.catalogApprove(id), "Approved: it's a regular style of yours now.")}>
          Approve
        </button>
      ) : null}
      <button onClick={() => act(async () => navigate(`/catalog/${(await api.catalogDuplicate(id)).id}`))} title="Your own copy under a new name, to change freely">
        Duplicate
      </button>
      {own ? (
        <button className="quiet" onClick={() => setDeleting(true)} title={d.editedBuiltIn ? "Remove your copy; the built-in style comes back" : "Move this style to the Recycle Bin"}>
          {d.editedBuiltIn ? "Undo my changes" : "Delete"}
        </button>
      ) : null}
    </>
  ) : null;

  return (
    <WithClaude
      back={<BackToCatalog />}
      title={
        <>
          {s.name ?? id}{" "}
          <span className="pill">{d ? (d.builtIn ? "built-in" : d.editedBuiltIn ? "your copy of a built-in" : STATUS_WORD[s.status ?? ""] ?? "yours") : "…"}</span>
          {own && s.status === "experimental" ? <span className="pill warn-pill">experimental</span> : null}
        </>
      }
      actions={actions}
    >
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint ok-note">{note}</p> : null}
      {!d ? <p className="hint">Loading…</p> : null}
      {d ? (
        <>
          <p className="style-lede">{s.summary}</p>
          <p className="hint">
            {s.tags?.length ? s.tags.join(" · ") : null}
            {s.suits?.length ? ` · suits ${s.suits.join(", ")}` : null}
            {s.needs?.footage ? " · needs your footage (previews use a stand-in)" : null}
            {s.needs?.["3d"] ? " · needs 3D (previews approximate it)" : null}
          </p>
          {d.builtIn ? (
            <p className="hint">
              Built-in styles are read-only. To change this one, ask Claude on the right (it makes your own copy first), or Duplicate it under a new name.
            </p>
          ) : null}
          {!d.check.ok ? (
            <div className="warn block">
              This style doesn't match the format yet:
              <ul>
                {d.check.problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <h3>Preview</h3>
          {d.reel ? <video className="style-reel" src={previewUrl(id, "reel.mp4", d.stamp)} poster={d.stills.length ? previewUrl(id, `${d.stills[0]}.jpg`, d.stamp) : undefined} autoPlay muted loop playsInline controls /> : null}
          {d.stills.length ? (
            <>
              <div className="still-strip">
                {d.stills.map((st) => (
                  <button key={st} className={`still ${big === st ? "on" : ""}`} onClick={() => setBig(big === st ? null : st)} title={st}>
                    <img src={previewUrl(id, `${st}.jpg`, d.stamp)} alt={st} />
                    <span>{st}</span>
                  </button>
                ))}
              </div>
              {big ? (
                <div className="still-big" onClick={() => setBig(null)}>
                  <img src={previewUrl(id, `${big}.jpg`, d.stamp)} alt={big} />
                </div>
              ) : null}
            </>
          ) : (
            <p className="hint">No previews yet.</p>
          )}
          <div className="sheet-actions">
            <button className="quiet" onClick={() => act(() => api.catalogSay(`Please render the previews of the style "${id}" again and look at them.`), "Asked Claude to render the previews again (see the chat).")}>
              Render the previews again
            </button>
          </div>

          {s.palette?.length ? (
            <>
              <h3>Palette</h3>
              <ul className="palette-list">
                {s.palette.map((p) => (
                  <li key={p.role + p.hex}>
                    <span className="swatch" style={{ background: p.hex }} />
                    <span>
                      <strong>{p.role}</strong> <code>{p.hex}</code>
                      {p.use ? <span className="dim"> · {p.use}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {s.fonts ? (
            <>
              <h3>Type</h3>
              <ul className="facts">
                {Object.entries(s.fonts)
                  .filter(([, f]) => f)
                  .map(([slot, f]) => (
                    <li key={slot}>
                      <strong>{slot}</strong> {f!.family} <span className="dim">· {f!.source === "google" ? "Google Fonts" : f!.source === "file" ? `font file ${f!.file ?? ""}` : "installed on this PC"}{f!.weights?.length ? ` · ${f!.weights.join(", ")}` : ""}{f!.italic ? " · italic" : ""}</span>
                    </li>
                  ))}
              </ul>
            </>
          ) : null}
          {own ? (
            <div className="sheet-actions">
              <button className="quiet" onClick={() => fontInput.current?.click()} title="For a font that isn't on Google Fonts: .ttf, .otf, .woff, .woff2">
                Add a font file
              </button>
              <input
                ref={fontInput}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) await act(() => api.catalogFont(id, f), `Added ${f.name} to this style's fonts. Tell Claude where to use it.`);
                }}
              />
              {d.fonts.length ? <span className="hint">Font files: {d.fonts.join(", ")}</span> : null}
            </div>
          ) : null}

          {s.motion?.recipes ? (
            <>
              <h3>Motion</h3>
              <ul className="facts">
                {Object.entries(s.motion.recipes).map(([name, r]) => (
                  <li key={name}>
                    <strong>{name}</strong> <span className="dim">{recipeText(r)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {s.banned?.length ? (
            <>
              <h3>Never</h3>
              <ul className="facts">
                {s.banned.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          ) : null}

          {s.sources?.length ? (
            <>
              <h3>Where it came from</h3>
              <ul className="facts">
                {s.sources.map((src, i) => (
                  <li key={i}>
                    {src.what}
                    <span className="dim">
                      {src.where ? ` · ${src.where}` : ""}
                      {src.licence ? ` · ${src.licence}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              {d.sources.length ? <p className="hint">Files kept with it: {d.sources.join(", ")}</p> : null}
            </>
          ) : null}

          <details className="style-doc">
            <summary>The full style document (what Claude reads)</summary>
            <Markdown text={d.md.replace(/^---[\s\S]*?---\s*/, "")} />
          </details>
          <p className="hint">Folder: {d.dir}</p>
        </>
      ) : null}
      {deleting && d ? <DeleteStyleDialog d={d} onClose={() => setDeleting(false)} /> : null}
    </WithClaude>
  );
};

const DeleteStyleDialog: React.FC<{ d: StyleDetail; onClose: () => void }> = ({ d, onClose }) => {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const remove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typed.trim() !== d.id || busy) return;
    setBusy(true);
    try {
      const r = await api.catalogDelete(d.id, typed.trim());
      navigate(r.builtInRemains ? `/catalog/${d.id}` : "/catalog");
      onClose();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="modal" onSubmit={remove} role="dialog" aria-modal="true">
        <h2>{d.editedBuiltIn ? "Undo your changes to this style?" : "Delete this style?"}</h2>
        <p className="modal-title">{d.style.name ?? d.id}</p>
        <p className="hint">
          {d.editedBuiltIn
            ? "Your copy goes to the Windows Recycle Bin and the engine's built-in version comes back."
            : "The style's folder goes to the Windows Recycle Bin; you can restore it from there."}{" "}
          Videos that used it keep their own copy.
        </p>
        <label className="confirm">
          Type <strong>{d.id}</strong> to confirm
          <input value={typed} onChange={(e) => setTyped(e.target.value)} disabled={busy} autoFocus />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <div className="modal-actions">
          <button type="button" className="quiet" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="danger" disabled={typed.trim() !== d.id || busy}>
            {busy ? "Moving to Recycle Bin…" : d.editedBuiltIn ? "Undo my changes" : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ---- a new style from the user's files, links and note

/** /catalog/new makes a draft and moves to its page, so a reload keeps what was added. */
export const NewStyle: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api.catalogNewDraft().then(
      (r) => {
        history.replaceState(null, "", `/catalog/new/${r.id}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      },
      (e) => setError(e.message),
    );
  }, []);
  return (
    <div className="home">
      <TopNav current="catalog" />
      {error ? <p className="error">{error}</p> : <p className="hint">Starting a new style…</p>}
    </div>
  );
};

export const DraftPage: React.FC<{ draft: string }> = ({ draft }) => {
  const [v, setV] = useState<CatalogDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stop = false;
    api.catalogView("draft", draft).catch(() => undefined);
    const load = () =>
      api.catalogDraft(draft).then(
        (r) => {
          if (stop) return;
          setV(r);
          setNote((n) => n || r.note);
        },
        (e) => !stop && setError(e.message),
      );
    load();
    const t = setInterval(load, 3000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [draft]);

  const addFiles = async (list: FileList | File[]) => {
    setError(null);
    const files = Array.from(list);
    for (const [i, f] of files.entries()) {
      setBusy(`Adding ${f.name} (${i + 1}/${files.length})…`);
      try {
        await api.catalogDraftUpload(draft, f);
      } catch (e) {
        setError(`${f.name} could not be added: ${(e as Error).message}`);
      }
    }
    setBusy(null);
    setV(await api.catalogDraft(draft));
  };
  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    try {
      setV(await api.catalogDraftLink(draft, link.trim()));
      setLink("");
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const start = async () => {
    setError(null);
    setBusy("Handing it to Claude…");
    try {
      const r = await api.catalogDraftStart(draft, note);
      if (!r.sent) setError(r.reason ?? "Claude didn't take the message; see the chat.");
      setV(await api.catalogDraft(draft));
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(null);
  };

  const started = !!v?.started;
  return (
    <WithClaude back={<BackToCatalog />} title="A new style">
      {error ? <p className="error">{error}</p> : null}
      {v?.result ? (
        <div className="done-note">
          <p>Claude made the style.</p>
          <button className="primary" onClick={() => navigate(`/catalog/${v.result}`)}>
            Open it
          </button>
        </div>
      ) : null}
      <h3>What should the style look like?</h3>
      <p className="hint">
        Drop anything that shows the look: images (a Pinterest find, a poster, a screenshot), a PDF or style guide, a design-system document, a taste or skill file, a video, or font files. Claude turns it into one catalog
        style, renders previews, and shows you; it stays <em>experimental</em> until you approve it.
      </p>
      <div
        className={`drop ${drag ? "over" : ""}`}
        onClick={() => !busy && !started && fileInput.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!busy && !started && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
      >
        <strong>{started ? "Claude is working with these files" : "Drop files here or click to choose"}</strong>
        <input ref={fileInput} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </div>
      {v?.files.length ? (
        <ul className="queued">
          {v.files.map((f) => (
            <li key={f}>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <form className="link" onSubmit={addLink}>
        <input placeholder="Or paste a link (a video, a Pinterest pin, a page)" value={link} onChange={(e) => setLink(e.target.value)} disabled={started} />
        <button type="submit" disabled={!link.trim() || started}>
          Add link
        </button>
      </form>
      {v?.links.length ? (
        <ul className="queued">
          {v.links.map((l) => (
            <li key={l}>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <h3>Anything to say about it?</h3>
      <textarea
        className="note"
        rows={3}
        placeholder="e.g. the colours from the first image, the type from the PDF; calm, for science explainers"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={started}
      />
      <div className="create-row">
        <span className="hint">{busy ?? (started ? "Claude is making the style: follow along in the chat. This page shows a link when it's done." : "")}</span>
        <button className="primary" onClick={start} disabled={!!busy || started || !v || (!v.files.length && !v.links.length && !note.trim())}>
          Make the style
        </button>
      </div>
    </WithClaude>
  );
};
