/** Settings: general paths, YouTube (setup, connection, defaults), Facebook & Instagram (defaults, Chrome check). */
import React, { useEffect, useRef, useState } from "react";
import { api, type PublishDefaults, type SettingsView, type YouTubeStatus } from "./api";
import { navigate } from "./nav";
import { TopNav } from "./TopNav";

const CATEGORIES: [string, string][] = [
  ["27", "Education"],
  ["28", "Science & Technology"],
  ["1", "Film & Animation"],
  ["22", "People & Blogs"],
  ["24", "Entertainment"],
  ["26", "Howto & Style"],
];
const ok = (v: unknown) => <span className={v ? "okmark" : "badmark"}>{v ? "✓ found" : "✕ not found"}</span>;

/** A text field that saves when it loses focus (or Enter), showing errors next to it. */
const Field: React.FC<{ label: string; value: string; placeholder?: string; hint?: React.ReactNode; onSave: (v: string) => Promise<unknown>; textarea?: boolean }> = ({ label, value, placeholder, hint, onSave, textarea }) => {
  const [v, setV] = useState(value);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setV(value), [value]);
  const save = async () => {
    if (v === value) return;
    setErr(null);
    setSaving(true);
    try {
      await onSave(v);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      setErr((e as Error).message);
    }
    setSaving(false);
  };
  return (
    <label className="field">
      <span>
        {label} {saving ? <span className="dim">saving…</span> : saved ? <span className="okmark">saved</span> : null}
      </span>
      {textarea ? (
        <textarea rows={3} value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} onBlur={save} />
      ) : (
        <input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} spellCheck={false} />
      )}
      {hint ? <span className="dim">{hint}</span> : null}
      {err ? <span className="error">{err}</span> : null}
    </label>
  );
};

const Seg: React.FC<{ value: string | null; options: [string, string][]; onPick: (v: string) => void }> = ({ value, options, onPick }) => (
  <span className="seg">
    {options.map(([v, l]) => (
      <button key={v} type="button" className={value === v ? "on" : ""} onClick={() => onPick(v)}>
        {l}
      </button>
    ))}
  </span>
);

export const Settings: React.FC = () => {
  const [s, setS] = useState<SettingsView | null>(null);
  const [yt, setYt] = useState<YouTubeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);
  const [checkProject, setCheckProject] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const [a, b] = await Promise.all([api.settings(), api.youtube()]);
      setS(a);
      setYt(b);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  // waiting for the Google sign-in tab, or for Claude's Chrome check
  useEffect(() => {
    if (!waiting && !checking) return;
    const since = Date.now();
    const t = setInterval(async () => {
      const [a, b] = await Promise.all([api.settings().catch(() => null), api.youtube().catch(() => null)]);
      if (b?.connected && waiting) {
        setYt(b);
        setWaiting(false);
      }
      if (a && checking && a.publish.chromeCheck && a.publish.chromeCheck.at > checking) {
        setS(a);
        setChecking(null);
      }
      if (Date.now() - since > 10 * 60 * 1000) {
        setWaiting(false);
        setChecking(null);
      }
    }, 2000);
    return () => clearInterval(t);
  }, [waiting, checking]);

  const run = async (fn: () => Promise<unknown>, after?: string) => {
    setError(null);
    setNote(null);
    try {
      await fn();
      if (after) setNote(after);
    } catch (e) {
      setError((e as Error).message);
    }
    load();
  };
  const savePublish = (patch: Parameters<typeof api.saveSettings>[0]["publish"]) => api.saveSettings({ publish: patch }).then(setS);
  const saveYtDefaults = (patch: Partial<PublishDefaults["youtube"]>) => savePublish({ youtube: patch });

  if (!s || !yt)
    return (
      <div className="home">
        <TopNav current="settings" />
        {error ? <p className="error">{error}</p> : <p className="hint">Loading…</p>}
      </div>
    );
  const p = s.publish;
  const cc = p.chromeCheck;

  return (
    <div className="home settings">
      <TopNav current="settings" />
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}

      <section>
        <h2>General</h2>
        <Field label="Workspace: where video folders are created" value={s.workspace} hint={ok(s.checks.workspace)} onSave={(v) => api.saveSettings({ workspace: v }).then(setS)} />
        <Field label="Blender (blender.exe)" value={s.blender} hint={ok(s.checks.blender)} onSave={(v) => api.saveSettings({ blender: v }).then(setS)} />
        <Field label="Python" value={s.python} hint={s.checks.python ? <span className="okmark">✓ {s.checks.python}</span> : <span className="badmark">✕ didn't run</span>} onSave={(v) => api.saveSettings({ python: v }).then(setS)} />
        <p className="hint">ffmpeg: {s.checks.ffmpeg ? <span className="okmark">✓ {s.checks.ffmpeg}</span> : <span className="badmark">✕ not found on PATH</span>}</p>
      </section>

      <section>
        <h2>YouTube</h2>
        <div className="account">
          {yt.connected ? (
            <>
              <p>
                Connected to <a href={yt.channel?.url} target="_blank" rel="noreferrer">{yt.channel?.title ?? "your channel"}</a>
                {yt.connectedAt ? <span className="dim"> · since {new Date(yt.connectedAt).toLocaleDateString()}</span> : null}
              </p>
              <div className="actions">
                <button onClick={() => run(async () => { const r = await api.youtubeTest(); if (!r.ok) throw new Error(r.error); }, "The connection works.")}>Test connection</button>
                <button onClick={() => run(async () => { const { url } = await api.youtubeConnect(); window.open(url, "_blank"); setWaiting(true); })}>Switch channel</button>
                <button className="quiet" onClick={() => window.confirm("Disconnect YouTube? Uploads stop working until you connect again.") && run(() => api.youtubeDisconnect().then(setYt))}>
                  Disconnect
                </button>
              </div>
              {waiting ? <p className="hint">Waiting for you to finish signing in in the new tab…</p> : null}
            </>
          ) : yt.clientSaved ? (
            <>
              <p>
                Google app added <span className="dim">({yt.clientId})</span>. One step left:
              </p>
              <div className="actions">
                <button className="primary" onClick={() => run(async () => { const { url } = await api.youtubeConnect(); window.open(url, "_blank"); setWaiting(true); })}>
                  Connect YouTube
                </button>
                <span className="hint">Sign in, pick the channel, continue past "Google hasn't verified this app" (Advanced → Go to …), allow.</span>
              </div>
              {waiting ? <p className="hint">Waiting for you to finish signing in in the new tab…</p> : null}
            </>
          ) : (
            <>
              <p className="hint">Set up once (about 10 minutes). Google renames these pages now and then; if a step looks different, ask Claude in any video's panel.</p>
              <ol className="setup">
                <li>
                  <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noreferrer">Create a Google Cloud project</a> (e.g. "Content engine").
                </li>
                <li>
                  <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">Enable the YouTube Data API v3</a> for it.
                </li>
                <li>
                  <a href="https://console.cloud.google.com/auth/overview" target="_blank" rel="noreferrer">Google Auth Platform</a> → Get started: app name, your email, audience <b>External</b>.
                </li>
                <li>
                  <b>Audience</b> → <b>Publish app</b> ("In production"); otherwise the sign-in expires every 7 days.
                </li>
                <li>
                  <b>Clients</b> → Create client → <b>Desktop app</b> → Create. Copy the two values it shows into the boxes below.
                </li>
              </ol>
              <div className="form2">
                <input placeholder="Client ID (…apps.googleusercontent.com)" value={clientId} onChange={(e) => setClientId(e.target.value)} spellCheck={false} />
                <input placeholder="Client secret (GOCSPX-…)" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} spellCheck={false} />
                <button className="primary" disabled={!clientId.trim() || !clientSecret.trim()} onClick={() => run(() => api.youtubeClientFields(clientId, clientSecret).then(setYt), "Saved. Now press Connect YouTube.")}>
                  Save
                </button>
              </div>
              <p className="hint">
                …or <button className="linkish" onClick={() => file.current?.click()}>add the downloaded JSON file</button> instead.
              </p>
              <input ref={file} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && run(() => api.youtubeClient(e.target.files![0]).then(setYt), "Saved. Now press Connect YouTube.")} />
            </>
          )}
        </div>

        <h3>Defaults for new videos</h3>
        <div className="defaults">
          <label className="field">
            <span>Visibility</span>
            <Seg value={p.youtube.privacy} options={[["private", "Private"], ["unlisted", "Unlisted"], ["public", "Public"]]} onPick={(v) => saveYtDefaults({ privacy: v as PublishDefaults["youtube"]["privacy"] })} />
          </label>
          <label className="field">
            <span>Made for kids?</span>
            <Seg value={p.youtube.madeForKids == null ? "ask" : p.youtube.madeForKids ? "yes" : "no"} options={[["no", "No"], ["yes", "Yes"], ["ask", "Ask each time"]]} onPick={(v) => saveYtDefaults({ madeForKids: v === "ask" ? null : v === "yes" })} />
          </label>
          <label className="field">
            <span>Category</span>
            <select value={p.youtube.categoryId} onChange={(e) => saveYtDefaults({ categoryId: e.target.value })}>
              {CATEGORIES.map(([id, l]) => (
                <option key={id} value={id}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <Field label="Tags always added" value={p.youtube.tags.join(", ")} placeholder="science, explained" onSave={(v) => saveYtDefaults({ tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} />
          <Field label="Description ending (links, credits)" value={p.youtube.descriptionFooter} textarea onSave={(v) => saveYtDefaults({ descriptionFooter: v })} />
        </div>
      </section>

      <section>
        <h2>Facebook Page &amp; Instagram</h2>
        <p className="hint">
          Posted by Claude in your Chrome: keep Facebook and Instagram logged in on the Chrome profile with the Claude in Chrome extension. Claude prepares each post and stops before Post; you click it. Reel or post is chosen on the Publish page each time.
        </p>
        <div className="defaults">
          <Field label="Facebook Page" value={p.facebookPage} placeholder="https://www.facebook.com/yourpage" onSave={(v) => savePublish({ facebookPage: v })} />
          <Field label="Instagram account" value={p.instagramAccount} placeholder="@yourhandle" onSave={(v) => savePublish({ instagramAccount: v })} />
          <Field label="Caption ending (hashtags you always use)" value={p.captionFooter} placeholder="#science #explained" textarea onSave={(v) => savePublish({ captionFooter: v })} />
        </div>
        <div className="account">
          <strong>Is Chrome ready?</strong>
          {cc ? (
            <ul className="checklist">
              <li>{cc.extension ? <span className="okmark">✓</span> : <span className="badmark">✕</span>} Claude's browser tools {cc.extension ? "work" : "aren't on (type /chrome in a video's Claude panel)"}</li>
              <li>{cc.facebook === "logged-in" ? <span className="okmark">✓</span> : <span className="badmark">✕</span>} Facebook: {cc.facebook}{cc.facebookPage ? `, Page ${cc.facebookPage}` : ""}</li>
              <li>{cc.instagram === "logged-in" ? <span className="okmark">✓</span> : <span className="badmark">✕</span>} Instagram: {cc.instagram}</li>
              {cc.note ? <li className="dim">{cc.note}</li> : null}
              <li className="dim">checked {new Date(cc.at).toLocaleString()}</li>
            </ul>
          ) : (
            <p className="hint">Not checked yet.</p>
          )}
          <div className="actions">
            <button
              disabled={!!checking}
              onClick={() =>
                run(async () => {
                  const r = await api.chromeCheck();
                  if (!r.ok && !r.pending) throw new Error(r.reason ?? "Claude couldn't be reached.");
                  setChecking(new Date().toISOString());
                  setCheckProject(r.project);
                  setNote(
                    r.pending
                      ? `Claude's panel in "${r.title}" needs an answer first (${r.reason}): open it, answer, and the check starts.`
                      : `Claude is checking in the "${r.title}" video's panel (opens Facebook and Instagram in new tabs, posts nothing).`,
                  );
                })
              }
            >
              {checking ? "Checking…" : "Check Chrome"}
            </button>
            {checking && checkProject ? (
              <a href="#" onClick={(e) => (e.preventDefault(), navigate(`/publish/${encodeURIComponent(checkProject)}`))}>
                watch Claude's panel
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
