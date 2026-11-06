/** The Package tab: the video's titles, thumbnails and post captions (cli/packaging.mjs). Claude makes the options, the user picks. Nothing here uploads. */
import React, { useEffect, useState } from "react";
import { api, unreachable, type PackageFinding, type PackageInfo, type PackageThumb, type PackageTitle } from "./api";
import { navigate } from "./nav";

const TOP_TITLES = 3;

const Finding: React.FC<{ f: PackageFinding }> = ({ f }) => (
  <li className={f.level === "fail" ? "error" : "hint"}>
    {f.where}: {f.problem}
  </li>
);

/** The thumbnail and title at the size a phone shows them, among other videos. */
const PhoneFeed: React.FC<{ thumb: PackageThumb | null; src: string | null; title: PackageTitle | null }> = ({ thumb, src, title }) => {
  const tall = thumb ? thumb.height > thumb.width : true;
  const tile = (
    <div className="feed-tile">
      <div className={`feed-pic ${tall ? "tall" : "wide"}`}>{src ? <img src={src} alt="" /> : null}</div>
      <p className="feed-title">{title?.phone ?? ""}</p>
    </div>
  );
  const other = (key: number) => (
    <div className="feed-tile other" key={key}>
      <div className={`feed-pic ${tall ? "tall" : "wide"}`} />
      <p className="feed-title">Another video in the feed</p>
    </div>
  );
  return (
    <div className="phone">
      <div className={`feed ${tall ? "two" : "one"}`}>
        {tile}
        {other(1)}
        {tall ? other(2) : null}
        {tall ? other(3) : null}
      </div>
    </div>
  );
};

export const PackagePanel: React.FC<{ name: string }> = ({ name }) => {
  const [info, setInfo] = useState<PackageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [allTitles, setAllTitles] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setInfo(await api.package(name));
          setLoadError(null);
        } catch (e) {
          setLoadError(unreachable(e));
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    })();
    return () => {
      stop = true;
    };
  }, [name]);

  const make = () => {
    setError(null);
    setNote(null);
    api.packageMake(name).then(
      (r) => (r.sent ? setNote("Asked Claude to make the packaging (see the chat). It takes a few minutes.") : setError(`Not sent: ${r.reason ?? "Claude couldn't be reached."}`)),
      (e) => setError((e as Error).message),
    );
  };
  const use = (kind: "title" | "thumb" | "caption", id: string, done: string) => {
    setError(null);
    setNote(null);
    api.packageUse(name, kind, id).then(
      (r) => {
        setInfo(r);
        setNote(done);
      },
      (e) => setError((e as Error).message),
    );
  };

  if (!info) return <div className="board">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const r = info.report;
  const stamp = r ? new Date(r.at).getTime() : 0;
  const file = (rel: string, download = false) => `/api/projects/${encodeURIComponent(name)}/file?path=${encodeURIComponent(rel)}&v=${stamp}${download ? "&download=1" : ""}`;
  const thumbOf = (id: string | null | undefined) => r?.thumbs.find((t) => t.id === id) ?? null;
  const titles = r ? (allTitles ? r.titles : r.titles.slice(0, TOP_TITLES)) : [];
  // what the drafts really hold: the user may have edited them on the Publish page, or made new options since picking
  const titleInDraft = (t: PackageTitle) => info.draft?.title === t.title;
  const captionInDraft = (text: string) => !!info.draft && [info.draft.facebook, info.draft.instagram].every((c) => c?.startsWith(text));
  const shownTitle = r?.titles.find((t) => t.id === (preview ?? info.choice.title)) ?? r?.titles[0] ?? null;
  const shownThumb = thumbOf(info.choice.thumb) && !preview ? thumbOf(info.choice.thumb) : (thumbOf(shownTitle?.thumb) ?? r?.thumbs[0] ?? null);

  return (
    <div className="board package-panel">
      {loadError ? <p className="error">{loadError}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}

      <div className="card">
        <h2>{r ? "Packaging" : "Not packaged yet"}</h2>
        <p className="hint">
          {r
            ? `Made ${new Date(r.at).toLocaleString()}. A title or caption you pick goes into the Publish drafts. Nothing is uploaded from here.`
            : "Claude writes ten titles, draws three thumbnails in this video's style and writes five post captions, then you pick. No paid API; it uses your Claude Code."}
        </p>
        <div className="actions">
          <button className={r ? "quiet" : "primary"} onClick={make}>
            {r ? "Make them again" : "Make the packaging"}
          </button>
          {r ? (
            <button className="quiet" onClick={() => navigate(`/publish/${encodeURIComponent(name)}`)}>
              Go to Publish
            </button>
          ) : null}
        </div>
        {r?.missing.length ? <p className="error">Incomplete: {r.missing.join(", ")}.</p> : null}
        {r?.errors.map((e) => (
          <p className="error" key={e}>
            {e}
          </p>
        ))}
      </div>

      {r ? (
        <div className="package-top">
          <div className="card">
            <h2>Titles</h2>
            <p className="hint">Each title is paired with a thumbnail. The score checks length, vague words and repeats; it can't promise views.</p>
            <ul className="package-list">
              {titles.map((t) => {
                const pair = thumbOf(t.thumb);
                return (
                  <li key={t.id} className={`package-title ${titleInDraft(t) ? "on" : ""}`} onMouseEnter={() => setPreview(t.id)} onMouseLeave={() => setPreview(null)}>
                    {pair ? <img src={file(pair.file)} alt="" className={pair.height > pair.width ? "tall" : "wide"} /> : <span className="no-thumb" />}
                    <div>
                      <p className="package-name">{t.title}</p>
                      <p className="meta">
                        Score {t.score}
                        {t.issues.length ? ` · ${t.issues.join("; ")}` : ""}
                      </p>
                    </div>
                    <button className={titleInDraft(t) ? "quiet" : "primary"} disabled={titleInDraft(t)} onClick={() => use("title", t.id, "Title set in the YouTube draft on the Publish page.")}>
                      {titleInDraft(t) ? "In the draft" : "Use this"}
                    </button>
                  </li>
                );
              })}
            </ul>
            {r.titles.length > TOP_TITLES ? (
              <button className="quiet" onClick={() => setAllTitles(!allTitles)}>
                {allTitles ? `Show the best ${TOP_TITLES}` : `Show all ${r.titles.length}`}
              </button>
            ) : null}
          </div>
          <div className="card">
            <h2>On a phone</h2>
            <PhoneFeed thumb={shownThumb} src={shownThumb ? file(shownThumb.file) : null} title={shownTitle} />
          </div>
        </div>
      ) : null}

      {r?.thumbs.length ? (
        <div className="card">
          <h2>Thumbnails</h2>
          <div className="package-thumbs">
            {r.thumbs.map((t) => (
              <figure key={t.id} className={info.choice.thumb === t.id ? "on" : ""}>
                <a href={file(t.file)} target="_blank" rel="noreferrer">
                  <img src={file(t.file)} alt={t.text} />
                </a>
                <figcaption>
                  {t.findings.length ? (
                    <ul className="package-findings">
                      {t.findings.map((f, i) => (
                        <Finding key={i} f={f} />
                      ))}
                    </ul>
                  ) : (
                    <p className="hint">Size, contrast and clear areas all fine.</p>
                  )}
                  <div className="actions">
                    <button className={info.choice.thumb === t.id ? "quiet" : "primary"} disabled={info.choice.thumb === t.id} onClick={() => use("thumb", t.id, "Thumbnail picked. Uploading it comes later, so download it from here for now.")}>
                      {info.choice.thumb === t.id ? "Picked" : "Use this"}
                    </button>
                    <a className="quiet" href={file(t.file, true)}>
                      Download
                    </a>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {r?.captions.length ? (
        <div className="card">
          <h2>Post captions</h2>
          <p className="hint">For Facebook and Instagram. Marked out of 20 by Claude: 16 or more is ready to post.</p>
          <ul className="package-list">
            {r.captions.map((c) => (
              <li key={c.id} className={`package-caption ${captionInDraft(c.text) ? "on" : ""}`}>
                <span className={`hook-score ${c.total >= 16 ? "strong" : "workable"}`}>{c.total}</span>
                <div>
                  <p className="package-name">{c.text}</p>
                  <p className="meta">
                    {c.keyphrase ? `Search phrase: ${c.keyphrase}` : ""}
                    {c.issues.length ? `${c.keyphrase ? " · " : ""}${c.issues.join("; ")}` : ""}
                  </p>
                </div>
                <button className={captionInDraft(c.text) ? "quiet" : "primary"} disabled={captionInDraft(c.text)} onClick={() => use("caption", c.id, "Caption set in the Facebook and Instagram drafts on the Publish page.")}>
                  {captionInDraft(c.text) ? "In the drafts" : "Use this"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
