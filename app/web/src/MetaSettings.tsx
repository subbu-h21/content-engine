/** Settings → Facebook Page & Instagram: the user's Meta app, Connect, the Pages and Instagram accounts the API reaches. */
import React, { useEffect, useState } from "react";
import { api, type MetaStatus } from "./api";

const SCOPES = "pages_show_list, pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish, business_management";
const day = (iso: string) => new Date(iso).toLocaleDateString();

export const MetaSettings: React.FC = () => {
  const [m, setM] = useState<MetaStatus | null>(null);
  const [appId, setAppId] = useState("");
  const [secret, setSecret] = useState("");
  const [configId, setConfigId] = useState("");
  const [token, setToken] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; bad?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.meta().then(setM, (e) => setMsg({ bad: (e as Error).message }));
  useEffect(() => {
    load();
  }, []);
  // waiting for the Facebook sign-in tab to come back
  useEffect(() => {
    if (!waiting) return;
    const since = Date.now();
    const t = setInterval(async () => {
      const s = await api.meta().catch(() => null);
      if (s?.connected && s.connectedAt && Date.parse(s.connectedAt) > since - 5000) {
        setM(s);
        setWaiting(false);
        setMsg({ ok: s.pages.length ? "Connected." : "Connected, but no Pages were shared: connect again and pick your Page." });
      }
      if (Date.now() - since > 10 * 60 * 1000) setWaiting(false);
    }, 2000);
    return () => clearInterval(t);
  }, [waiting]);

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      if (ok) setMsg({ ok });
    } catch (e) {
      setMsg({ bad: (e as Error).message });
    }
    setBusy(false);
    load();
  };
  const connect = () =>
    run(async () => {
      const { url } = await api.metaConnect();
      window.open(url, "_blank");
      setWaiting(true);
    });

  if (!m) return <div className="account">{msg?.bad ? <p className="error">{msg.bad}</p> : <p className="hint">Loading…</p>}</div>;
  const expiresSoon = m.userExpiresAt && Date.parse(m.userExpiresAt) - Date.now() < 10 * 24 * 3600 * 1000;
  const result = msg ? <p className={msg.ok ? "okmark" : "error"}>{msg.ok ? `✓ ${msg.ok}` : `✕ ${msg.bad}`}</p> : null;

  return (
    <div className="account meta-account">
      <strong>Post through Meta's API</strong> <span className="dim">(recommended: straight from this PC, no browser)</span>
      {m.connected ? (
        <>
          <p>
            Connected as <b>{m.user?.name ?? "you"}</b>
            {m.connectedAt ? <span className="dim"> · since {day(m.connectedAt)}</span> : null}
          </p>
          {m.pages.length ? (
            <ul className="checklist">
              {m.pages.map((p) => (
                <li key={p.id}>
                  <span className="okmark">✓</span> Facebook Page{" "}
                  <a href={p.link} target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                  {p.canPost ? null : <span className="error"> (you can't post on it)</span>}
                  {p.instagram ? (
                    <>
                      {" "}
                      · <span className="okmark">✓</span> Instagram <b>@{p.instagram.username ?? p.instagram.id}</b>
                    </>
                  ) : (
                    <span className="dim"> · no Instagram linked (link it in the Page's settings → Linked accounts, then Test connection)</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="warn">No Pages were shared with the engine: press Connect again and, on Facebook's screen, choose your Page (and its Instagram).</p>
          )}
          {m.missing.length ? <p className="warn">Facebook didn't grant: {m.missing.join(", ")}. Connect again and allow everything it asks for.</p> : null}
          {m.userExpiresAt ? (
            <p className={expiresSoon ? "warn" : "hint"}>
              Instagram posting uses your Facebook sign-in, which lasts until {day(m.userExpiresAt)}: connect again before then (Facebook Pages keep working).
            </p>
          ) : null}
          <div className="actions">
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const r = await api.metaTest();
                  if (!r.ok) throw new Error(r.error ?? "The test failed.");
                }, "The connection works: Meta lists the Pages above.")
              }
            >
              {busy ? "Checking…" : "Test connection"}
            </button>
            <button disabled={busy} onClick={connect}>
              Connect again
            </button>
            <button className="quiet" disabled={busy} onClick={() => window.confirm("Disconnect Facebook & Instagram? Posting through the API stops until you connect again.") && run(() => api.metaDisconnect())}>
              Disconnect
            </button>
          </div>
          {waiting ? <p className="hint">Waiting for you to finish on Facebook in the new tab…</p> : null}
          {result}
        </>
      ) : m.appSaved ? (
        <>
          <p>
            Meta app added <span className="dim">(App ID {m.appId})</span>. One step left:
          </p>
          <div className="actions">
            <button className="primary" disabled={busy} onClick={connect}>
              Connect Facebook &amp; Instagram
            </button>
            <button className="quiet" onClick={() => setM({ ...m, appSaved: false })}>
              Change the app
            </button>
          </div>
          <p className="hint">Facebook asks you to log in, choose your Page and its Instagram account, and allow access. Then you come back here.</p>
          {waiting ? <p className="hint">Waiting for you to finish on Facebook in the new tab…</p> : null}
          {result}
          <details className="fallback">
            <summary>Facebook says the redirect isn't allowed? Paste a token instead</summary>
            <ol>
              <li>
                Open the{" "}
                <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer">
                  Graph API Explorer
                </a>{" "}
                and pick your app at the top right.
              </li>
              <li>
                Under <b>User or Page</b> choose <b>User Token</b>, add the permissions <span className="dim">{SCOPES}</span>, then <b>Generate Access Token</b> (choose your Page and Instagram).
              </li>
              <li>Copy the token (starts with EAA) and paste it here:</li>
            </ol>
            <div className="form2">
              <input placeholder="EAA…" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} />
              <button className="primary" disabled={busy || !token.trim()} onClick={() => run(() => api.metaToken(token).then(() => setToken("")), "Connected.")}>
                Use this token
              </button>
            </div>
          </details>
        </>
      ) : (
        <>
          <p className="hint">One-time setup (about 10 minutes). Meta renames these screens now and then; if a step looks different, ask Claude in any video's panel.</p>
          <ol className="steps-list">
            <li>
              Open{" "}
              <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">
                developers.facebook.com → My Apps
              </a>{" "}
              (log in with the Facebook account that manages your Page) → <b>Create app</b>.
            </li>
            <li>Name it (e.g. "Content engine"). For the use cases, pick the ones for <b>managing your Page</b> and for <b>Instagram content publishing</b>. If it asks for a business portfolio, choose yours or skip.</li>
            <li>
              In the app's <b>Facebook Login</b> settings, under <b>Valid OAuth Redirect URIs</b>, add exactly <code>{m.redirectUri}</code> and save.
            </li>
            <li>
              Keep the app in <b>Development</b> mode: that's enough to post to your own Page and Instagram.
            </li>
            <li>
              <b>App settings → Basic</b>: copy the <b>App ID</b> and the <b>App secret</b> (Show) into the boxes below.
            </li>
          </ol>
          <div className="form2">
            <input placeholder="App ID (a number)" value={appId} onChange={(e) => setAppId(e.target.value)} spellCheck={false} />
            <input placeholder="App secret (32 characters)" value={secret} onChange={(e) => setSecret(e.target.value)} spellCheck={false} />
            <input placeholder="Configuration ID (only if your app shows one under Facebook Login for Business; else leave empty)" value={configId} onChange={(e) => setConfigId(e.target.value)} spellCheck={false} />
            <button className="primary" disabled={busy || !appId.trim() || !secret.trim()} onClick={() => run(() => api.metaApp(appId, secret, configId).then(() => setSecret("")), "Saved. Now press Connect.")}>
              Save
            </button>
          </div>
          {result}
        </>
      )}
    </div>
  );
};
