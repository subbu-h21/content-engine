/** The Final tab: what a final render involves, the background job's progress, recovery, and the finished video. */
import React, { useEffect, useState } from "react";
import { api, unreachable, type RenderInfo, type RenderStep } from "./api";
import { navigate } from "./nav";

const dur = (s: number | null | undefined) => {
  if (s == null || !isFinite(s)) return "—";
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h} h ${m} min` : m ? `${m} min` : `${s} s`;
};
const gb = (b: number | null | undefined) => (b == null ? "?" : b >= 1e9 ? `${(b / 1e9).toFixed(b >= 1e10 ? 0 : 1)} GB` : `${Math.max(1, Math.round(b / 1e6))} MB`);
/** A long technical error ("The sound step failed: <traceback>") → its plain first part; the rest goes under Details. */
const shortError = (m: string) => (m.length > 140 && m.indexOf(": ") > 0 ? `${m.slice(0, m.indexOf(": "))}.` : m);
const since = (iso: string | null) => (iso ? (Date.now() - new Date(iso).getTime()) / 1000 : null);

const STATUS: Record<string, string> = {
  queued: "Queued",
  running: "Rendering",
  done: "Finished",
  failed: "Stopped by an error",
  cancelled: "Stopped",
  interrupted: "Interrupted",
};

const StepRow: React.FC<{ s: RenderStep; live: RenderInfo["live"] }> = ({ s, live }) => {
  const p = s.status === "running" && live?.progress ? live.progress : s.progress;
  const frac = p?.total ? p.done / p.total : s.status === "done" ? 1 : 0;
  return (
    <li className={`step ${s.status}`}>
      <span className="mark">{s.status === "done" ? "✓" : s.status === "failed" ? "✕" : s.status === "running" ? "●" : "○"}</span>
      <div className="body">
        <div className="label">
          {s.label}
          {s.attempts > 1 && s.status !== "done" ? <span className="dim"> · attempt {s.attempts}</span> : null}
        </div>
        {s.status === "running" || (s.status !== "pending" && p?.total) ? (
          <>
            <div className="bar">
              <span style={{ width: `${Math.round(frac * 100)}%` }} />
            </div>
            <div className="meta">
              {p?.total ? `${p.done.toLocaleString()} / ${p.total.toLocaleString()} ${p.unit}` : s.status === "running" ? "starting…" : ""}
              {p?.secPerFrame ? ` · ${p.secPerFrame} s per frame` : ""}
              {p?.etaSeconds != null && s.status === "running" ? ` · about ${dur(p.etaSeconds)} left` : ""}
              {p?.remaining && s.status === "running" ? ` · ${p.remaining} left` : ""}
              {p?.phase === "encoding" && s.status === "running" ? " · encoding" : ""}
              {s.status === "done" && s.startedAt && s.endedAt ? ` · took ${dur((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000)}` : ""}
            </div>
          </>
        ) : null}
        {s.error && shortError(s.error) !== s.error ? (
          <details className="error">
            <summary>{shortError(s.error)} Details</summary>
            <pre className="logtail">{s.error}</pre>
          </details>
        ) : s.error ? (
          <div className="error">{s.error}</div>
        ) : null}
      </div>
    </li>
  );
};

export const RenderPanel: React.FC<{ name: string }> = ({ name }) => {
  const [info, setInfo] = useState<RenderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  // the page couldn't refresh (engine restarting): cleared by the next good refresh, unlike a button's error
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rerender, setRerender] = useState<string[]>([]);
  const [autoFix, setAutoFix] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setInfo(await api.render(name));
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

  const act = async (fn: () => Promise<unknown>, after?: string) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      await fn();
      if (after) setNote(after);
      setInfo(await api.render(name));
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  if (!info) return <div className="board">{loadError ? <p className="error">{loadError}</p> : <p className="hint">Loading…</p>}</div>;
  const { plan, job, live } = info;
  const blocks = plan.problems.filter((p) => p.level === "block");
  const warns = plan.problems.filter((p) => p.level === "warn");
  const activeJob = job && (job.status === "running" || job.status === "queued");
  const stopped = job && ["failed", "cancelled", "interrupted"].includes(job.status);
  const fileUrl = (rel: string) => `/api/projects/${encodeURIComponent(name)}/file?path=${encodeURIComponent(rel)}&v=${encodeURIComponent(job?.endedAt ?? "")}`;

  const startForm = (
    <div className="card">
      <h2>{job?.status === "done" ? "Render again" : "Final render"}</h2>
      <p className="meta">
        {plan.durationSeconds ? `${dur(plan.durationSeconds)} video, ${plan.totalFrames.toLocaleString()} frames` : ""} · estimated {dur(plan.estSeconds)} · needs about {gb(plan.needBytes)} of disk
        {plan.freeBytes != null ? ` (${gb(plan.freeBytes)} free)` : ""}
      </p>
      {plan.plates.length ? (
        <table className="plates">
          <thead>
            <tr>
              <th>3D plate</th>
              <th>Final frames</th>
              <th>To render</th>
              <th>Re-render all</th>
            </tr>
          </thead>
          <tbody>
            {plan.plates.map((p) => (
              <tr key={p.id} className={p.stale ? "stale" : ""}>
                <td>
                  {p.id} <span className="dim">{p.shot}</span>
                </td>
                <td>
                  {p.present.toLocaleString()} / {p.need?.toLocaleString() ?? "?"} {p.stale ? <span className="error">out of date</span> : null}
                </td>
                <td>{p.missing || p.stale ? `${(p.stale ? p.need ?? 0 : p.missing).toLocaleString()} · ~${dur(p.stale && p.need ? p.need * p.secPerFrame : p.estSeconds)}` : "nothing"}</td>
                <td>
                  <input
                    type="checkbox"
                    disabled={!p.present}
                    checked={rerender.includes(p.id)}
                    onChange={(e) => setRerender((cur) => (e.target.checked ? [...cur, p.id] : cur.filter((x) => x !== p.id)))}
                    title="Delete this plate's final frames and render them again"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="hint">No 3D plates: this is the video render and the upload file only (minutes).</p>
      )}
      {blocks.map((b) => (
        <p key={b.text} className="warn block">
          {b.text}
        </p>
      ))}
      {warns.map((w) => (
        <p key={w.text} className="warn">
          {w.text}
        </p>
      ))}
      {blocks.length ? (
        <div className="actions">
          <button onClick={() => act(() => api.say(name, `The Final tab won't start the final render: ${blocks.map((b) => b.text).join(" ")} Please fix what you can, and tell me what needs my decision.`).then((r) => { if (!r.sent) throw new Error(`Not sent: ${r.reason}`); }), "Sent to Claude: see its panel on the right.")}>
            Ask Claude to fix these
          </button>
        </div>
      ) : null}
      <label className="check">
        <input type="checkbox" checked={autoFix} onChange={(e) => setAutoFix(e.target.checked)} />
        If a step fails, hand it to Claude to fix and resume (at most twice; anything that costs money or re-renders 3D is asked first)
      </label>
      <div className="actions">
        <button className="primary" disabled={busy || !!blocks.length || !!activeJob} onClick={() => act(() => api.renderStart(name, rerender, autoFix))}>
          {job?.status === "done" ? "Render again" : "Start final render"}
        </button>
        <span className="hint">It runs in the background: you can keep editing or close the browser. If the engine is closed or the PC restarts, it pauses; Resume continues.</span>
      </div>
    </div>
  );

  return (
    <div className="board render-panel">
      {loadError ? <p className="error">{loadError}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {note ? <p className="hint">{note}</p> : null}

      {job ? (
        <div className={`status job-${job.status}`}>
          <div className="steps">
            <span className="on">{STATUS[job.status]}</span>
            {job.status === "queued" && live?.queuePosition ? <span>position {live.queuePosition} in the queue</span> : null}
            {job.startedAt ? <span>started {new Date(job.startedAt).toLocaleString()}</span> : null}
            {activeJob && job.startedAt ? <span>running for {dur(since(job.startedAt))}</span> : null}
          </div>
          {live?.waiting ? <p className="note">{live.waiting}</p> : null}
          {job.error ? <p className="note">{shortError(job.error.message)}</p> : null}
          {job.claudeNotice ? (
            <p className="hint">
              {job.claudeNotice.ok
                ? `Claude was told${job.claudeNotice.automatic ? " automatically" : ""} at ${new Date(job.claudeNotice.at).toLocaleTimeString()}: see its panel on the right.`
                : job.claudeNotice.pending
                  ? `Waiting to tell Claude: ${job.claudeNotice.reason} The message goes in by itself once you have.`
                  : `Couldn't hand this to Claude: ${job.claudeNotice.reason}`}
            </p>
          ) : null}
          <ul className="job-steps">
            {job.steps.map((s) => (
              <StepRow key={s.id} s={s} live={s.status === "running" ? live : null} />
            ))}
          </ul>
          {live?.logTail?.length && activeJob ? <pre className="logtail">{live.logTail.join("\n")}</pre> : null}
          <div className="actions">
            {activeJob ? (
              <button disabled={busy} onClick={() => act(() => api.renderStop(name), "Stopped. Finished frames are kept; Resume continues from there.")}>
                Stop
              </button>
            ) : null}
            {stopped ? (
              <>
                <button className="primary" disabled={busy || !!blocks.length} onClick={() => act(() => api.renderResume(name, autoFix))}>
                  Resume
                </button>
                {job.error && job.status === "failed" ? (
                  <button
                    disabled={busy}
                    onClick={() =>
                      act(() =>
                        api.renderAskClaude(name).then((r) => {
                          if (!r.ok && !r.pending) throw new Error(r.reason ?? "Claude couldn't be reached");
                          setNote(r.pending ? `Waiting to tell Claude: ${r.reason} It goes in by itself once you have.` : "Handed to Claude: see its panel on the right.");
                        }),
                      )
                    }
                  >
                    Ask Claude to fix it
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {job?.status === "done" && info.files?.delivery === false ? (
        <div className="card">
          <h2>Finished video</h2>
          <p className="warn">The finished file out/delivery.mp4 isn't there any more (moved or deleted). Render again below to make it.</p>
        </div>
      ) : null}

      {job?.status === "done" && info.files?.delivery !== false ? (
        <div className="card">
          <h2>Finished video</h2>
          <video className="final-video" controls src={fileUrl("out/delivery.mp4")} />
          <div className="actions">
            <button
              className="primary"
              onClick={async () => {
                await api.publishSelect(name, "out/delivery.mp4").catch(() => undefined);
                navigate(`/publish/${encodeURIComponent(name)}`);
              }}
            >
              Publish this video
            </button>
            <button onClick={() => act(() => api.reveal(name, "delivery"))}>Show in folder</button>
            <span className="hint">out/delivery.mp4 (to publish) · out/video.mp4 (master)</span>
          </div>
        </div>
      ) : null}

      {!activeJob ? startForm : null}
    </div>
  );
};
