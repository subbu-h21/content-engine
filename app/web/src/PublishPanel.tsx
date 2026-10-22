/**
 * The Publish page's middle: the picked video file (a compact strip), then one tab per platform: YouTube (upload through
 * its API), Facebook Page and Instagram (Claude in Chrome). Each tab has a status dot; inactive tabs stay mounted
 * (hidden) so what's being typed isn't lost when switching.
 */
import React, { useEffect, useRef, useState } from "react";
import { api, unreachable, type PlatformState, type PublishInfo, type SocialDraft, type YouTubeDraft } from "./api";
import { fileLabel } from "./History";
import { navigate } from "./nav";

type Platform = "youtube" | "facebook" | "instagram";
const PLATFORMS: Platform[] = ["youtube", "facebook", "instagram"];
const TAB_LABEL: Record<Platform, string> = { youtube: "YouTube", facebook: "Facebook Page", instagram: "Instagram" };
const TAB_KEY = "ce.publishTab";
const CATEGORIES: [string, string][] = [
  ["27", "Education"],
  ["28", "Science & Technology"],
  ["1", "Film & Animation"],
  ["22", "People & Blogs"],
  ["24", "Entertainment"],
  ["26", "Howto & Style"],
];
const mb = (b?: number) => (b == null ? "?" : b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.round(b / 1e6)} MB`);
const secs = (s?: number) => (s == null ? "?" : s >= 60 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : `${s.toFixed(1)} s`);
/** <input type="datetime-local"> wants local time without a zone */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const FINAL = "out/delivery.mp4";
const KIND_LABEL = { final: "Final video", master: "Final video (sound not levelled yet)", draft: "Draft", render: "Render" } as const;

/** A platform's state as a dot on its tab: busy (uploading, with Claude), done, bad (stopped, failed), or nothing. */
function dotOf(p: Platform, st: PlatformState): { tone: "busy" | "done" | "bad" | "wait"; word: string } | null {
  switch (st.status) {
    case "queued":
      return { tone: "busy", word: "queued" };
    case "uploading":
      return { tone: "busy", word: p === "youtube" ? "uploading" : "posting" };
    case "processing":
      return { tone: "busy", word: "processing" };
    case "publishing":
      return { tone: "busy", word: "publishing" };
    case "done":
      return { tone: "done", word: "uploaded" };
    case "handed":
      return { tone: "busy", word: "with Claude" };
    case "ready-to-post":
      return { tone: "wait", word: "click Post" };
    case "posted":
      return { tone: "done", word: "posted" };
    case "failed":
      return { tone: "bad", word: p === "youtube" ? "stopped" : "not posted" };
    case "stopped":
    case "interrupted":
      return { tone: "bad", word: st.status };
    default:
      return null;
  }
}

/** onClaude: open the page's Claude panel (something was handed to Claude, or it's waiting for an answer). */
export const PublishPanel: React.FC<{ name: string; onClaude?: () => void }> = ({ name, onClaude }) => {
  const [info, setInfo] = useState<PublishInfo | null>(null);
  const [yt, setYt] = useState<YouTubeDraft | null>(null);
  const [fb, setFb] = useState<SocialDraft | null>(null);
  const [ig, setIg] = useState<SocialDraft | null>(null);
  const dirty = useRef<Record<Platform, boolean>>({ youtube: false, facebook: false, instagram: false });
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [error, setError] = useState<string | null>(null);
  // the page couldn't refresh (engine restarting): cleared by the next good refresh, unlike a button's error
  const [loadError, setLoadError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Platform>(() => {
    try {
      const t = localStorage.getItem(TAB_KEY) as Platform | null;
      return t && PLATFORMS.includes(t) ? t : "youtube";
    } catch {
      return "youtube";
    }
  });
  const pickTab = (t: Platform) => {
    setTab(t);
    setNote(null);
    setError(null);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {
      // storage unavailable
    }
  };

  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          const i = await api.publish(name);
          setInfo(i);
          // Claude needs an answer (e.g. during a Chrome hand-off): show the panel
          if (i.claude === "question") onClaude?.();
          // drafts from the server (e.g. Claude wrote them) replace the form unless the user is editing that one
          if (!dirty.current.youtube) setYt(i.drafts.youtube);
          if (!dirty.current.facebook) setFb(i.drafts.facebook);
          if (!dirty.current.instagram) setIg(i.drafts.instagram);
          setLoadError(null);
        } catch (e) {
          setLoadError(unreachable(e));
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    })();
    return () => {
      stop = true;
    };
  }, [name]);

  /** edit a draft: update the form at once, save after a short pause */
  const edit = <T extends object>(platform: Platform, set: React.Dispatch<React.SetStateAction<T | null>>, patch: Partial<T>) => {
    dirty.current[platform] = true;
    set((cur) => (cur ? { ...cur, ...patch } : cur));
    clearTimeout(timers.current[platform]);
    timers.current[platform] = setTimeout(async () => {
      try {
        const cur = platform === "youtube" ? ytRef.current : platform === "facebook" ? fbRef.current : igRef.current;
        await api.saveDraft(name, platform, cur ?? {});
      } catch (e) {
        setError((e as Error).message);
      }
      dirty.current[platform] = false;
    }, 700);
  };
  const ytRef = useRef(yt);
  const fbRef = useRef(fb);
  const igRef = useRef(ig);
  ytRef.current = yt;
  fbRef.current = fb;
  igRef.current = ig;

  const act = async (fn: () => Promise<unknown>, after?: string) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      await fn();
      if (after) setNote(after);
      setInfo(await api.publish(name));
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };
  const viaClaude = (fn: () => Promise<{ ok: boolean; pending?: boolean; reason?: string }>, sent: string) =>
    act(async () => {
      onClaude?.();
      const r = await fn();
      if (!r.ok && !r.pending) throw new Error(r.reason ?? "Claude couldn't be reached.");
      // the "sent" note only when it really went in; otherwise say what it's waiting for
      setNote(r.pending ? `Waiting to hand it to Claude: ${r.reason} It goes in by itself once you have.` : sent);
    });

  if (!info || !yt || !fb || !ig) return <div className="board publish-panel">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const v = info.video;
  const yts = info.state.youtube ?? {};
  const live = info.youtube.live;
  const uploading = ["queued", "uploading"].includes(yts.status ?? "");
  // the YouTube state belongs to the file it was started with (older states: the final video)
  const ytFile = yts.status ? (yts.file ?? FINAL) : null;
  const ytSameFile = ytFile === v.rel;
  const videoSrc = v.rel ? `/api/projects/${encodeURIComponent(name)}/file?path=${encodeURIComponent(v.rel)}` : "";
  const sent = live?.sent ?? yts.progress?.sent ?? 0;
  const total = live?.total ?? yts.progress?.total ?? v.size ?? 0;

  /** What's still missing before the main button works, in one calm line. */
  const todo = (problems: string[]) => (problems.length ? <p className="todo">Still needed: {problems.join(" ")}</p> : null);
  const notes = (platform: Platform) =>
    (v.notes?.[platform] ?? []).map((n) => (
      <p key={n} className="warn">
        {n}
      </p>
    ));

  const caption = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb) => (
    <label className="wide">
      <span>
        Caption{" "}
        <span className="dim">
          {d.caption.length} characters{platform === "instagram" ? ` · ${(d.caption.match(/#\w+/g) ?? []).length} hashtags` : ""}
        </span>
      </span>
      <textarea rows={5} value={d.caption} onChange={(e) => edit<SocialDraft>(platform, set, { caption: e.target.value })} />
    </label>
  );
  const postAs = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb) => (
    <label>
      Post as
      <span className="seg">
        {(["reel", "post"] as const).map((f) => (
          <button key={f} type="button" className={d.format === f ? "on" : ""} onClick={() => edit<SocialDraft>(platform, set, { format: f })}>
            {f === "reel" ? "Reel" : platform === "facebook" ? "Video post" : "Feed post"}
          </button>
        ))}
      </span>
    </label>
  );

  /** Facebook / Instagram through Meta's API (when connected); the Chrome hand-off folded under "Other way". */
  const apiTab = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb) => {
    const meta = info.meta!;
    const st = info.state[platform] ?? {};
    const isApi = st.route === "api";
    const active = isApi && ["queued", "uploading", "processing", "publishing"].includes(st.status ?? "");
    const stopped = isApi && ["failed", "interrupted"].includes(st.status ?? "");
    const sameFile = st.file === v.rel;
    const acc = meta.account[platform];
    const live = meta.live[platform];
    const choices =
      platform === "facebook"
        ? meta.pages.map((p) => ({ id: p.id, name: p.name }))
        : meta.pages.filter((p) => p.instagram).map((p) => ({ id: p.instagram!.id, name: `@${p.instagram!.username ?? p.instagram!.id}`, page: p.name }));
    const problems = info.apiProblems?.[platform] ?? [];
    const psent = live?.sent ?? st.progress?.sent ?? 0;
    const ptotal = live?.total ?? st.progress?.total ?? v.size ?? 0;
    const where = platform === "facebook" ? "Facebook" : "Instagram";
    const post = () =>
      act(async () => {
        try {
          await api.metaPost(name, platform);
        } catch (e) {
          const dup = (e as { data?: { duplicate?: string } }).data?.duplicate;
          if (!dup) throw e;
          if (!window.confirm(`This file is already posted there:\n${dup}\n\nPost it again as a second post?`)) return;
          await api.metaPost(name, platform, true);
        }
      }, "Posting in the background: you can leave this page.");
    return (
      <section className="publish-card" hidden={tab !== platform}>
        <h2>{TAB_LABEL[platform]}</h2>
        <div className="form">
          <label>
            {platform === "facebook" ? "Facebook Page" : "Instagram account"}
            <select value={acc?.id ?? ""} disabled={active} onChange={(e) => edit<SocialDraft>(platform, set, platform === "facebook" ? { pageId: e.target.value } : { igId: e.target.value })}>
              {!acc ? <option value="">(none connected)</option> : null}
              {choices.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {"page" in c && c.page ? ` (Page ${c.page})` : ""}
                </option>
              ))}
            </select>
          </label>
          {platform === "facebook" ? (
            postAs(platform, d, set)
          ) : (
            <label className="check">
              <input type="checkbox" checked={d.shareToFeed !== false} onChange={(e) => edit<SocialDraft>(platform, set, { shareToFeed: e.target.checked })} />
              <span>
                Also show it in the main feed <span className="dim">(not only the Reels tab)</span>
              </span>
            </label>
          )}
          {platform === "facebook" && d.format === "post" ? (
            <label className="wide">
              <span>
                Title <span className="dim">(optional, shown above video posts)</span>
              </span>
              <input value={d.title ?? ""} onChange={(e) => edit<SocialDraft>(platform, set, { title: e.target.value })} />
            </label>
          ) : null}
          {caption(platform, d, set)}
        </div>
        {notes(platform)}
        {active || stopped ? (
          <div className="step running">
            <div className="body">
              <div className="label">
                {st.status === "queued"
                  ? `Waiting to post${live?.queuePosition ? ` (#${live.queuePosition})` : ""}`
                  : st.status === "uploading" && live?.preparing
                    ? `Preparing the video for ${where}`
                    : st.status === "uploading"
                      ? `Uploading to ${st.account?.name ?? where}`
                    : st.status === "processing"
                      ? `${where} is processing the video`
                      : st.status === "publishing"
                        ? "Publishing"
                        : st.status === "interrupted"
                          ? "Interrupted"
                          : "Not posted"}
                {!sameFile && st.file ? <span className="dim"> · {fileLabel(st.file)}</span> : null}
              </div>
              {st.status === "uploading" && live?.preparing ? (
                <>
                  <div className="bar">
                    <span style={{ width: `${live.preparing.total ? Math.round((live.preparing.done / live.preparing.total) * 100) : 0}%` }} />
                  </div>
                  <div className="meta">
                    {Math.round(live.preparing.done)} of {Math.round(live.preparing.total)} s
                  </div>
                </>
              ) : st.status === "uploading" ? (
                <>
                  <div className="bar">
                    <span style={{ width: `${ptotal ? Math.round((psent / ptotal) * 100) : 0}%` }} />
                  </div>
                  <div className="meta">
                    {mb(psent)} of {mb(ptotal)}
                  </div>
                </>
              ) : null}
              {st.error ? <div className="error">{st.error}</div> : null}
            </div>
          </div>
        ) : null}
        {isApi && st.status === "posted" ? (
          <p className="result">
            {sameFile ? "Posted" : `${fileLabel(st.file ?? "")} posted`} on {st.account?.name ?? where}
            {st.format === "reel" && platform === "facebook" ? " as a Reel" : ""}:{" "}
            {st.url ? (
              <a href={st.url} target="_blank" rel="noreferrer">
                {st.url}
              </a>
            ) : (
              "(no link yet)"
            )}
          </p>
        ) : null}
        <div className="actions">
          <button className="primary" disabled={busy || active || problems.length > 0} onClick={post}>
            {active ? "Posting…" : stopped && sameFile ? "Resume" : isApi && st.status === "posted" && sameFile && st.format === (platform === "instagram" ? "reel" : d.format) ? "Post again" : `Post to ${where}`}
          </button>
          {meta.log[platform].length ? (
            <details className="log">
              <summary>Details</summary>
              <pre>{meta.log[platform].join("\n")}</pre>
            </details>
          ) : null}
          {st.status && !active ? (
            <button className="quiet" disabled={busy} onClick={() => window.confirm(`Clear the ${TAB_LABEL[platform]} status on this page? (Nothing is deleted on ${where}.)`) && act(() => api.publishReport(name, platform, "none"))}>
              Reset
            </button>
          ) : null}
        </div>
        {todo(problems)}
        <details className="other-way" open={!isApi && !!st.status}>
          <summary>Other way: hand it to Claude in Chrome</summary>
          {chrome(platform, d, set, true)}
        </details>
      </section>
    );
  };

  /** Facebook / Instagram through Claude in Chrome: the whole tab when Meta isn't connected, else folded in the API tab. */
  const chrome = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb, embedded: boolean) => {
    const st = info.state[platform] ?? {};
    const label = TAB_LABEL[platform];
    // an API post's status belongs to the API part of the tab
    const mine = st.route !== "api";
    const inner = (
      <>
        <p className="meta">
          {embedded ? "" : "Not connected to Meta's API: "}Claude posts it in your Chrome (the profile where you're logged in), fills everything in and stops before the final Post: you click it.{" "}
          {embedded ? null : (
            <>
              To post straight from here instead, connect Facebook &amp; Instagram in{" "}
              <a href="/settings" onClick={(e) => (e.preventDefault(), navigate("/settings"))}>
                Settings
              </a>
              .
            </>
          )}
        </p>
        <div className="form">
          <label>
            {platform === "facebook" ? "Page link" : "Account"}
            <input
              value={(platform === "facebook" ? d.page : d.account) ?? ""}
              placeholder={platform === "facebook" ? "https://www.facebook.com/yourpage" : "@yourhandle"}
              onChange={(e) => edit<SocialDraft>(platform, set, platform === "facebook" ? { page: e.target.value } : { account: e.target.value })}
            />
          </label>
          {!embedded || platform === "instagram" ? postAs(platform, d, set) : null}
          {embedded ? null : caption(platform, d, set)}
        </div>
        {embedded ? null : notes(platform)}
        {st.status && mine ? (
          <p className={`result ${st.status === "failed" ? "bad" : ""}`}>
            {st.status === "handed" && "With Claude now: watch its panel and your Chrome."}
            {st.status === "ready-to-post" && "Ready in Chrome: check it and click Post."}
            {st.status === "posted" && (st.url ? <a href={st.url} target="_blank" rel="noreferrer">Posted ↗</a> : "Posted.")}
            {st.status === "failed" && <>Not posted: {st.note ?? "see Claude's panel"}</>}
            {st.file && st.file !== v.rel ? <span className="dim"> ({fileLabel(st.file)})</span> : null}
          </p>
        ) : null}
        <div className="actions">
          <button className={embedded ? "" : "primary"} disabled={busy || !v.exists || info.problems[platform].length > 0} onClick={() => viaClaude(() => api.handoff(name, platform), "Handed to Claude: watch its panel on the right and your Chrome.")}>
            {mine && (st.status === "handed" || st.status === "ready-to-post") ? "Hand to Claude again" : "Hand to Claude in Chrome"}
          </button>
          {st.status && mine && st.status !== "posted" ? (
            <button
              disabled={busy}
              onClick={() => {
                const url = window.prompt(`Mark it as posted on ${label}? Paste the post's link if you have it (optional), then OK.`, "");
                if (url === null) return; // Cancel: nothing changes
                act(() => api.publishReport(name, platform, "posted", url.trim() || undefined));
              }}
            >
              Mark as posted
            </button>
          ) : null}
          <button
            className="quiet"
            onClick={() =>
              act(async () => {
                await navigator.clipboard.writeText(v.path ?? "");
              }, "File path copied: in the file picker, paste it into the File name box and press Enter.")
            }
            title="For attaching the video in Chrome's file picker"
          >
            Copy file path
          </button>
          {st.status && mine ? (
            <button className="quiet" disabled={busy} onClick={() => window.confirm(`Clear the ${label} status on this page? (Nothing is deleted on ${label}.)`) && act(() => api.publishReport(name, platform, "none"))}>
              Reset
            </button>
          ) : null}
        </div>
        {todo(info.problems[platform])}
      </>
    );
    return embedded ? (
      inner
    ) : (
      <section className="publish-card" hidden={tab !== platform}>
        <h2>{label}</h2>
        {inner}
      </section>
    );
  };
  const social = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb) => (info.meta?.connected ? apiTab(platform, d, set) : chrome(platform, d, set, false));

  return (
    <div className="board publish-panel">
      {loadError ? <p className="error">{loadError}</p> : null}

      {v.exists ? (
        <div className="vstrip">
          {/* preload none + a still: the video only takes a browser connection once it's played */}
          <video
            key={v.rel}
            className="publish-video"
            controls
            preload="none"
            poster={`/api/projects/${encodeURIComponent(name)}/thumb?path=${encodeURIComponent(v.rel ?? "")}&v=${encodeURIComponent(v.madeAt ?? "")}`}
            src={`${videoSrc}&v=${encodeURIComponent(v.madeAt ?? "")}`}
          />
          <div className="vfacts">
            <div className="vkind">
              <span className={`kind kind-${v.kind ?? "render"}`}>{KIND_LABEL[v.kind ?? "render"]}</span>
              <span className="dim">{(v.rel ?? "").split("/").pop()}</span>
            </div>
            <div className="dim">
              {v.width}×{v.height} · {secs(v.duration)} · {mb(v.size)}
              {v.madeAt ? ` · made ${new Date(v.madeAt).toLocaleString()}` : ""}
            </div>
            {v.kind === "draft" ? <p className="warn">This is a draft (quick preview quality). The Final tab makes the full-quality video.</p> : null}
            {v.kind === "master" ? <p className="warn">The final render didn't finish its last step (sound levelling): Resume it on the Final tab for the upload file.</p> : null}
            {v.changedAfter ? <p className="warn">The video changed after this file was made: render it again on the Final tab if those changes should be in it.</p> : null}
            {v.error ? <p className="error">{v.error}</p> : null}
            <div className="actions">
              <button onClick={() => viaClaude(() => api.publishDraftWithClaude(name), "Asked Claude to write the titles and captions: they appear in the tabs below when written.")} disabled={busy}>
                ✦ Ask Claude to write titles &amp; captions
              </button>
              <a className="button" href={`${videoSrc}&download=1`}>
                Download
              </a>
              <button className="quiet" onClick={() => act(() => api.revealVideo(name))}>
                Show in folder
              </button>
              <button className="quiet" onClick={() => navigate(`/p/${encodeURIComponent(name)}`)} title="Back to this video's Brief, Editor and Final tabs">
                Open the video
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="status">
          <p className="note">This video has no exported file yet.</p>
          <div className="actions">
            <button className="primary" onClick={() => navigate(`/p/${encodeURIComponent(name)}/final`)}>
              Go to the Final tab
            </button>
          </div>
        </div>
      )}

      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}

      {/* the platforms only once there's a file to publish */}
      {v.exists ? (
        <>
          <nav className="ptabs" role="tablist">
            {PLATFORMS.map((p) => {
              const dot = dotOf(p, info.state[p] ?? {});
              return (
                <button key={p} role="tab" aria-selected={tab === p} className={tab === p ? "on" : ""} onClick={() => pickTab(p)}>
                  {TAB_LABEL[p]}
                  {dot ? (
                    <span className={`pdot ${dot.tone}`} title={dot.word}>
                      <span className="dotmark" />
                      {dot.word}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <section className="publish-card" hidden={tab !== "youtube"}>
            <h2>YouTube</h2>
            {info.youtube.connected ? (
              <p className="meta">
                Uploads to <a href={info.youtube.channel?.url} target="_blank" rel="noreferrer">{info.youtube.channel?.title ?? "your channel"}</a> through the YouTube API.
              </p>
            ) : (
              <p className="warn">
                YouTube isn't connected yet: <a href="/settings" onClick={(e) => (e.preventDefault(), navigate("/settings"))}>connect it in Settings</a>.
              </p>
            )}
            <div className="form">
              <label className="wide">
                <span>
                  Title <span className="dim">{yt.title.length}/100</span>
                </span>
                <input value={yt.title} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { title: e.target.value })} />
              </label>
              <label className="wide">
                Description
                <textarea rows={5} value={yt.description} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { description: e.target.value })} />
              </label>
              <label className="wide">
                <span>
                  Tags <span className="dim">comma separated</span>
                </span>
                <input value={yt.tags.join(", ")} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </label>
              <label>
                Visibility
                <select value={yt.privacy} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { privacy: e.target.value as YouTubeDraft["privacy"] })}>
                  <option value="private">Private (check it, then publish in YouTube Studio)</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </label>
              {yt.privacy === "scheduled" ? (
                <label>
                  Publish at
                  <input type="datetime-local" value={toLocalInput(yt.publishAt)} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { publishAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                </label>
              ) : (
                <label>
                  Category
                  <select value={yt.categoryId} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { categoryId: e.target.value })}>
                    {CATEGORIES.map(([id, l]) => (
                      <option key={id} value={id}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Made for kids?
                <span className="seg">
                  <button type="button" className={yt.madeForKids === false ? "on" : ""} onClick={() => edit<YouTubeDraft>("youtube", setYt, { madeForKids: false })}>
                    No
                  </button>
                  <button type="button" className={yt.madeForKids === true ? "on" : ""} onClick={() => edit<YouTubeDraft>("youtube", setYt, { madeForKids: true })}>
                    Yes
                  </button>
                </span>
              </label>
              {yt.privacy === "scheduled" ? (
                <label>
                  Category
                  <select value={yt.categoryId} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { categoryId: e.target.value })}>
                    {CATEGORIES.map(([id, l]) => (
                      <option key={id} value={id}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="check wide">
                <input type="checkbox" checked={yt.synthetic} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { synthetic: e.target.checked })} />
                <span>
                  Altered or synthetic content that looks realistic <span className="dim">(YouTube's disclosure; an animated explainer with an AI voice usually doesn't need it)</span>
                </span>
              </label>
            </div>
            {notes("youtube")}
            {uploading || yts.status === "failed" || yts.status === "stopped" || yts.status === "interrupted" ? (
              <div className="step running">
                <div className="body">
                  <div className="label">
                    {yts.status === "queued" ? `Queued${live?.queuePosition ? ` (#${live.queuePosition})` : ""}` : yts.status === "uploading" ? "Uploading" : yts.status === "failed" ? "Upload stopped by an error" : yts.status === "interrupted" ? "Upload interrupted" : "Upload stopped"}
                    {ytFile && !ytSameFile ? <span className="dim"> · {fileLabel(ytFile)}</span> : null}
                  </div>
                  <div className="bar">
                    <span style={{ width: `${total ? Math.round((sent / total) * 100) : 0}%` }} />
                  </div>
                  <div className="meta">
                    {mb(sent)} of {mb(total)}
                  </div>
                  {yts.error ? <div className="error">{yts.error}</div> : null}
                </div>
              </div>
            ) : null}
            {yts.status === "done" && yts.result ? (
              <p className="result">
                {ytSameFile ? "On YouTube" : `${fileLabel(ytFile ?? "")} is on YouTube`} ({yts.result.privacy}): <a href={yts.result.url} target="_blank" rel="noreferrer">{yts.result.url}</a> ·{" "}
                <a href={yts.result.studio} target="_blank" rel="noreferrer">
                  open in YouTube Studio
                </a>
              </p>
            ) : null}
            <div className="actions">
              {uploading ? (
                <button disabled={busy} onClick={() => act(() => api.youtubeStop(name), "Stopped. Resume continues the same upload.")}>
                  Stop
                </button>
              ) : (
                <button
                  className="primary"
                  disabled={busy || !v.exists || !info.youtube.connected || info.problems.youtube.length > 0}
                  onClick={() =>
                    act(async () => {
                      try {
                        await api.youtubeStart(name);
                      } catch (e) {
                        const dup = (e as { data?: { duplicate?: string } }).data?.duplicate;
                        if (!dup) throw e;
                        if (!window.confirm(`This file is already on YouTube:\n${dup}\n\nUpload it again as a second video?`)) return;
                        await api.youtubeStart(name, true);
                      }
                    }, "Uploading in the background: you can leave this page.")
                  }
                >
                  {!ytSameFile ? "Upload to YouTube" : ["failed", "stopped", "interrupted"].includes(yts.status ?? "") ? "Resume upload" : yts.status === "done" ? "Upload again" : "Upload to YouTube"}
                </button>
              )}
              {info.youtubeLog.length ? (
                <details className="log">
                  <summary>Details</summary>
                  <pre>{info.youtubeLog.join("\n")}</pre>
                </details>
              ) : null}
            </div>
            {todo(info.problems.youtube)}
          </section>

          {social("facebook", fb, setFb)}
          {social("instagram", ig, setIg)}
        </>
      ) : null}
    </div>
  );
};
