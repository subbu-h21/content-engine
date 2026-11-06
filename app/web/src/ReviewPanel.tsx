/** The Review tab: the quality gate's result for this video (cli/review.mjs): notes, measured findings, what to listen to, the sheets. */
import React, { useEffect, useState } from "react";
import { api, unreachable, type ReviewFinding, type ReviewInfo, type ReviewNote } from "./api";

const LEVEL: Record<ReviewFinding["level"], string> = { fail: "Failed", warn: "Look at this", info: "Note" };

const Note: React.FC<{ n: ReviewNote }> = ({ n }) => (
  <li className={`review-note p${n.p}`}>
    <span className="pill">P{n.p}</span>
    <div>
      <div className="meta">
        {n.t} s · {n.where}
      </div>
      <p>{n.problem}</p>
      <p className="review-change">→ {n.change}</p>
    </div>
  </li>
);

const Finding: React.FC<{ f: ReviewFinding }> = ({ f }) => (
  <li className={`review-note level-${f.level}`}>
    <span className="pill">{LEVEL[f.level]}</span>
    <div>
      <div className="meta">
        {f.t} s · {f.area} · {f.where}
      </div>
      <p>{f.problem}</p>
      <p className="review-change">→ {f.change}</p>
    </div>
  </li>
);

export const ReviewPanel: React.FC<{ name: string }> = ({ name }) => {
  const [info, setInfo] = useState<ReviewInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = () =>
    api
      .review(name)
      .then((r) => {
        setInfo(r);
        setLoadError(null);
      })
      .catch((e) => setLoadError(unreachable(e)));
  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [name]);

  const act = (fn: () => Promise<unknown>, done?: string) => {
    setError(null);
    setNote(null);
    fn()
      .then(() => {
        if (done) setNote(done);
        return load();
      })
      .catch((e) => setError((e as Error).message));
  };

  if (!info) return <div className="board">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const r = info.report;
  const stamp = r ? new Date(r.at).getTime() : 0;
  const sheet = (f: string) => `/api/projects/${encodeURIComponent(name)}/file?path=${encodeURIComponent(`review/${f}`)}&v=${stamp}`;
  const sheets = r ? [...r.pack.beats, ...r.pack.seams, ...r.pack.phone, ...(r.pack.safe ? [r.pack.safe] : [])] : [];
  const notes = r?.critic?.notes ?? [];
  const toFix = notes.filter((n) => n.p < 2).length + (r?.counts.fails ?? 0);
  const final = info.final;

  return (
    <div className="board review-panel">
      {loadError ? <p className="error">{loadError}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}
      {info.error ? <p className="error">{info.error}</p> : null}

      <div className="card">
        <h2>{info.running ? "Reviewing this video…" : r ? (r.passed ? "Nothing left to fix" : r.summary) : "Not reviewed yet"}</h2>
        <p className="hint">
          {info.running
            ? "Rendering the sheets takes under a minute; the critic then takes a few more."
            : r
              ? `Last review ${new Date(r.at).toLocaleString()}: ${r.scenes} scenes, ${r.cuts} cut${r.cuts === 1 ? "" : "s"}, ${r.frames} frames measured. Warnings are questions: a video may keep one on purpose.`
              : "Renders sheets of every scene and cut, measures the text, the pacing and the sound, then a fresh Claude that has never seen the video writes notes. No paid API; the critic uses your Claude Code."}
        </p>
        <div className="actions">
          <button className="primary" disabled={info.running} onClick={() => act(() => api.reviewRun(name, true))}>
            {r ? "Review again" : "Review this video"}
          </button>
          <button className="quiet" disabled={info.running} onClick={() => act(() => api.reviewRun(name, false))}>
            Measure only (no critic)
          </button>
          {toFix ? (
            <button className="quiet" disabled={info.running} onClick={() => act(() => api.say(name, "Please read review/REPORT.md, fix what failed and the P0 and P1 notes, then run `ce review .` again. Stop after 3 rounds and tell me what's left."), "Asked Claude to fix the notes (see the chat).")}>
              Ask Claude to fix these
            </button>
          ) : null}
        </div>
      </div>

      {r?.critic?.error ? <p className="error">{r.critic.error}</p> : null}
      {notes.length ? (
        <div className="card">
          <h2>The critic's notes</h2>
          <ul className="review-list">
            {notes.map((n, i) => (
              <Note key={i} n={n} />
            ))}
          </ul>
        </div>
      ) : null}

      {r?.findings.length ? (
        <div className="card">
          <h2>What was measured</h2>
          <ul className="review-list">
            {r.findings.map((f, i) => (
              <Finding key={i} f={f} />
            ))}
          </ul>
        </div>
      ) : null}

      {r?.listen.length ? (
        <div className="card">
          <h2>For your ears</h2>
          <p className="hint">Nothing here can hear the video. Listen to these moments on headphones.</p>
          <ul className="review-listen">
            {r.listen.map((l) => (
              <li key={l.t}>
                <b>{l.t} s</b> {l.why}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {final ? (
        <div className="card">
          <h2>The final file</h2>
          <p className="meta">
            {final.width}×{final.height} · {final.lufs ?? "?"} LUFS · peak {final.truePeak ?? "?"} dBTP · colour {final.colour}
          </p>
          {final.findings.length ? (
            <ul className="review-list">
              {final.findings.map((f, i) => (
                <Finding key={i} f={f} />
              ))}
            </ul>
          ) : (
            <p className="hint">Loudness, peak and colour are all as they should be.</p>
          )}
        </div>
      ) : null}

      {sheets.length ? (
        <div className="card">
          <h2>Sheets</h2>
          <div className="review-sheets">
            {sheets.map((f) => (
              <a key={f} href={sheet(f)} target="_blank" rel="noreferrer" title={f}>
                <img src={sheet(f)} alt={f} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
