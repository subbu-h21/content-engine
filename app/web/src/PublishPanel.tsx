/** The Publish tab: the finished video, a draft per platform, YouTube upload (API), Facebook/Instagram (Claude in Chrome). */
import React, { useEffect, useRef, useState } from "react";
import { api, type PublishInfo, type SocialDraft, type YouTubeDraft } from "./api";
import { navigate } from "./nav";

type Platform = "youtube" | "facebook" | "instagram";
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

export const PublishPanel: React.FC<{ name: string }> = ({ name }) => {
  const [info, setInfo] = useState<PublishInfo | null>(null);
  const [yt, setYt] = useState<YouTubeDraft | null>(null);
  const [fb, setFb] = useState<SocialDraft | null>(null);
  const [ig, setIg] = useState<SocialDraft | null>(null);
  const dirty = useRef<Record<Platform, boolean>>({ youtube: false, facebook: false, instagram: false });
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          const i = await api.publish(name);
          setInfo(i);
          // drafts from the server (e.g. Claude wrote them) replace the form unless the user is editing that one
          if (!dirty.current.youtube) setYt(i.drafts.youtube);
          if (!dirty.current.facebook) setFb(i.drafts.facebook);
          if (!dirty.current.instagram) setIg(i.drafts.instagram);
        } catch (e) {
          setError((e as Error).message);
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
      const r = await fn();
      if (!r.ok && !r.pending) throw new Error(r.reason ?? "Claude couldn't be reached.");
      if (r.pending) setNote(`Waiting to hand it to Claude: ${r.reason} It goes in by itself once you have.`);
    }, sent);

  if (!info || !yt || !fb || !ig) return <div className="board">{error ? <p className="error">{error}</p> : <p className="hint">Loading…</p>}</div>;
  const v = info.video;
  const yts = info.state.youtube ?? {};
  const live = info.youtube.live;
  const uploading = ["queued", "uploading"].includes(yts.status ?? "");
  const sent = live?.sent ?? yts.progress?.sent ?? 0;
  const total = live?.total ?? yts.progress?.total ?? v.size ?? 0;

  const social = (platform: "facebook" | "instagram", d: SocialDraft, set: typeof setFb) => {
    const st = info.state[platform] ?? {};
    const label = platform === "facebook" ? "Facebook Page" : "Instagram";
    return (
      <section className="card publish-card">
        <h2>{label}</h2>
        <p className="meta">Posted by Claude in your Chrome (the profile where you're logged in). Claude fills everything in and stops before the final Post: you click it.</p>
        <div className="form">
          <label>
            {platform === "facebook" ? "Page link" : "Account"}
            <input
              value={(platform === "facebook" ? d.page : d.account) ?? ""}
              placeholder={platform === "facebook" ? "https://www.facebook.com/yourpage" : "@yourhandle"}
              onChange={(e) => edit<SocialDraft>(platform, set, platform === "facebook" ? { page: e.target.value } : { account: e.target.value })}
            />
          </label>
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
          <label className="wide">
            Caption
            <textarea rows={5} value={d.caption} onChange={(e) => edit<SocialDraft>(platform, set, { caption: e.target.value })} />
            <span className="dim">{d.caption.length} characters{platform === "instagram" ? ` · ${(d.caption.match(/#\w+/g) ?? []).length} hashtags` : ""}</span>
          </label>
        </div>
        {(v.notes?.[platform] ?? []).map((n) => (
          <p key={n} className="warn">
            {n}
          </p>
        ))}
        {info.problems[platform].map((p) => (
          <p key={p} className="hint">
            · {p}
          </p>
        ))}
        <div className="actions">
          <button className="primary" disabled={busy || !v.exists || info.problems[platform].length > 0} onClick={() => viaClaude(() => api.handoff(name, platform), "Handed to Claude: watch its panel on the right and your Chrome.")}>
            {st.status === "handed" || st.status === "ready-to-post" ? "Hand to Claude again" : "Hand to Claude in Chrome"}
          </button>
          {st.status && st.status !== "posted" ? (
            <button
              disabled={busy}
              onClick={() => {
                const url = window.prompt("Link to the post (optional):", "") ?? undefined;
                act(() => api.publishReport(name, platform, "posted", url || undefined));
              }}
            >
              Mark as posted
            </button>
          ) : null}
          <span className="hint">
            {st.status === "handed" && "With Claude now."}
            {st.status === "ready-to-post" && "Ready in Chrome: check it and click Post."}
            {st.status === "posted" && (st.url ? <a href={st.url} target="_blank" rel="noreferrer">Posted ↗</a> : "Posted.")}
            {st.status === "failed" && <span className="error">Not posted: {st.note ?? "see Claude's panel"}</span>}
          </span>
        </div>
      </section>
    );
  };

  return (
    <div className="board publish-panel">
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}

      <div className="status">
        {v.exists ? (
          <>
            <div className="steps">
              <span className="on">Finished video</span>
              <span>
                {v.width}×{v.height} · {secs(v.duration)} · {mb(v.size)}
              </span>
              {v.madeAt ? <span>made {new Date(v.madeAt).toLocaleString()}</span> : null}
            </div>
            {v.changedAfter ? <p className="warn">The video's scenes or settings changed after this file was made: render it again on the Final tab if those changes should be in it.</p> : null}
            <div className="actions">
              <button onClick={() => act(() => api.revealVideo(name))}>Show the video in its folder</button>
              <button onClick={() => viaClaude(() => api.publishDraftWithClaude(name), "Asked Claude to draft the titles and captions: they appear here when written.")} disabled={busy}>
                Ask Claude to draft titles &amp; captions
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="note">There's no finished video yet.</p>
            <div className="actions">
              <button className="primary" onClick={() => navigate(`/p/${encodeURIComponent(name)}/final`)}>
                Go to the Final tab
              </button>
            </div>
          </>
        )}
      </div>

      <section className="card publish-card">
        <h2>YouTube</h2>
        {info.youtube.connected ? (
          <p className="meta">
            Uploads to <a href={info.youtube.channel?.url} target="_blank" rel="noreferrer">{info.youtube.channel?.title ?? "your channel"}</a> through the YouTube API.
          </p>
        ) : (
          <p className="warn">
            YouTube isn't connected yet: <a href="/" onClick={(e) => (e.preventDefault(), navigate("/"))}>connect it on the home page</a> (Connected accounts).
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
            <textarea rows={6} value={yt.description} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { description: e.target.value })} />
          </label>
          <label className="wide">
            <span>
              Tags <span className="dim">comma separated</span>
            </span>
            <input value={yt.tags.join(", ")} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
          </label>
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
          ) : null}
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
          <label className="check wide">
            <input type="checkbox" checked={yt.synthetic} onChange={(e) => edit<YouTubeDraft>("youtube", setYt, { synthetic: e.target.checked })} />
            Altered or synthetic content that looks realistic (YouTube asks for this disclosure; an animated explainer with an AI voice usually doesn't need it)
          </label>
        </div>
        {(v.notes?.youtube ?? []).map((n) => (
          <p key={n} className="warn">
            {n}
          </p>
        ))}
        {info.problems.youtube.map((p) => (
          <p key={p} className="hint">
            · {p}
          </p>
        ))}
        {uploading || yts.status === "failed" || yts.status === "stopped" || yts.status === "interrupted" ? (
          <div className="step running">
            <div className="body">
              <div className="label">
                {yts.status === "queued" ? `Queued${live?.queuePosition ? ` (#${live.queuePosition})` : ""}` : yts.status === "uploading" ? "Uploading" : yts.status === "failed" ? "Upload stopped by an error" : yts.status === "interrupted" ? "Upload interrupted" : "Upload stopped"}
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
        <div className="actions">
          {uploading ? (
            <button disabled={busy} onClick={() => act(() => api.youtubeStop(name), "Stopped. Resume continues the same upload.")}>
              Stop
            </button>
          ) : (
            <button className="primary" disabled={busy || !v.exists || !info.youtube.connected || info.problems.youtube.length > 0} onClick={() => act(() => api.youtubeStart(name), "Uploading in the background: you can leave this page.")}>
              {["failed", "stopped", "interrupted"].includes(yts.status ?? "") ? "Resume upload" : yts.status === "done" ? "Upload again" : "Upload to YouTube"}
            </button>
          )}
          {yts.status === "done" && yts.result ? (
            <span className="hint">
              On YouTube ({yts.result.privacy}): <a href={yts.result.url} target="_blank" rel="noreferrer">{yts.result.url}</a> · <a href={yts.result.studio} target="_blank" rel="noreferrer">open in YouTube Studio</a>
            </span>
          ) : null}
        </div>
      </section>

      {social("facebook", fb, setFb)}
      {social("instagram", ig, setIg)}
    </div>
  );
};
