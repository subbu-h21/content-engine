/** Home page: Connected accounts. YouTube through its API (one-time Google setup + sign-in); Facebook/Instagram via Chrome. */
import React, { useEffect, useRef, useState } from "react";
import { api, type YouTubeStatus } from "./api";

export const Accounts: React.FC = () => {
  const [yt, setYt] = useState<YouTubeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const load = () => api.youtube().then(setYt, (e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  // after "Connect", poll until the sign-in tab has finished
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(async () => {
      const s = await api.youtube().catch(() => null);
      if (s?.connected) {
        setYt(s);
        setWaiting(false);
      }
    }, 2000);
    const stop = setTimeout(() => setWaiting(false), 10 * 60 * 1000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [waiting]);

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    }
    load();
  };

  return (
    <section>
      <h2>Connected accounts</h2>
      <div className="accounts">
        <div className="account">
          <div className="acc-head">
            <strong>YouTube</strong>
            <span className="dim">uploads through the YouTube API</span>
          </div>
          {yt?.connected ? (
            <p>
              Connected to <a href={yt.channel?.url} target="_blank" rel="noreferrer">{yt.channel?.title ?? "your channel"}</a>.{" "}
              <button className="quiet" onClick={() => window.confirm("Disconnect YouTube? Uploads stop working until you connect again.") && run(api.youtubeDisconnect)}>
                Disconnect
              </button>
            </p>
          ) : yt?.clientSaved ? (
            <p>
              Google app added.{" "}
              <button
                className="primary"
                onClick={() =>
                  run(async () => {
                    const { url } = await api.youtubeConnect();
                    window.open(url, "_blank");
                    setWaiting(true);
                  })
                }
              >
                Connect YouTube
              </button>{" "}
              {waiting ? <span className="hint">Waiting for you to finish signing in in the new tab…</span> : null}
              <button className="quiet" onClick={() => file.current?.click()}>
                Replace the Google app file
              </button>
            </p>
          ) : (
            <details open>
              <summary>Set up once (about 10 minutes)</summary>
              <ol className="setup">
                <li>
                  Open <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noreferrer">Google Cloud → New project</a>, name it e.g. "Content engine", create it.
                </li>
                <li>
                  Enable the <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">YouTube Data API v3</a> for that project.
                </li>
                <li>
                  Open <a href="https://console.cloud.google.com/auth/overview" target="_blank" rel="noreferrer">Google Auth Platform</a> → Get started: app name "Content engine", your email, audience <b>External</b>.
                </li>
                <li>
                  <b>Audience</b> page: click <b>Publish app</b> (to "In production"). Otherwise the sign-in expires every 7 days. You'll see an "unverified app" notice when signing in: that's expected for a personal app.
                </li>
                <li>
                  <b>Clients</b> → Create client → Application type <b>Desktop app</b> → Create → <b>Download JSON</b>.
                </li>
                <li>
                  Add that file here:{" "}
                  <button onClick={() => file.current?.click()}>Choose the downloaded JSON</button>
                </li>
                <li>Then Connect YouTube: sign in, pick the channel, continue past "Google hasn't verified this app" (Advanced → Go to …), allow.</li>
              </ol>
              <p className="hint">Google renames these pages now and then; if a step looks different, ask Claude in any video's panel.</p>
            </details>
          )}
          <input ref={file} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && run(() => api.youtubeClient(e.target.files![0]))} />
        </div>
        <div className="account">
          <div className="acc-head">
            <strong>Facebook Page &amp; Instagram</strong>
            <span className="dim">posted by Claude in your Chrome</span>
          </div>
          <p className="hint">
            Nothing to connect here: keep Facebook and Instagram logged in on the Chrome profile where the Claude in Chrome extension is installed. In a video's Claude panel, the browser tools must be on (answer "Yes" when it asks to use your browser, or type /chrome).
          </p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
};
