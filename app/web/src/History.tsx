/** The Publish page's history: everything uploaded or posted (and anything under way), across all videos, newest first. */
import React, { useEffect, useState } from "react";
import { api, type PublishedRow } from "./api";
import { navigate } from "./nav";
import { publishNeedsYou, publishWord } from "./words";

const PLATFORM = { youtube: "YouTube", facebook: "Facebook Page", instagram: "Instagram" } as const;
export const fileLabel = (rel: string) => (rel === "out/delivery.mp4" ? "final video" : rel.replace(/^out\//, ""));

export const History: React.FC = () => {
  const [rows, setRows] = useState<PublishedRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setRows(await api.published());
          setError(null);
        } catch (e) {
          setError((e as Error).message);
        }
        await new Promise((r) => setTimeout(r, 4000));
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  const open = async (r: PublishedRow) => {
    try {
      await api.publishSelect(r.project, r.file);
    } catch {
      // that file is gone: open the video with whatever file it has
    }
    navigate(`/publish/${encodeURIComponent(r.project)}`);
  };

  return (
    <div className="board history">
      <h2>History</h2>
      {error ? <p className="error">{error}</p> : null}
      {rows === null ? <p className="hint">Loading…</p> : null}
      {rows?.length === 0 ? <p className="hint">Nothing published yet. Pick a video on the left to publish it.</p> : null}
      {rows?.length ? (
        <table className="published">
          <thead>
            <tr>
              <th>Video</th>
              <th>Where</th>
              <th>Status</th>
              <th>Link</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.project + r.id}>
                <td>
                  <a href="#" onClick={(e) => (e.preventDefault(), open(r))}>
                    {r.title ?? r.project}
                  </a>
                  <div className="dim">{fileLabel(r.file)}</div>
                </td>
                <td>
                  {PLATFORM[r.platform]}
                  {r.format ? <span className="dim"> · {r.format === "reel" ? "Reel" : "post"}</span> : null}
                  {r.privacy ? <span className="dim"> · {r.privacy}</span> : null}
                </td>
                <td className={publishNeedsYou(r.status) ? "error" : ""}>
                  {publishWord(r.platform, r.status)}
                  {r.error && ["failed", "interrupted"].includes(r.status) ? <div className="dim">{r.error}</div> : null}
                </td>
                <td>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer">
                      open ↗
                    </a>
                  ) : null}
                  {r.studio ? (
                    <>
                      {" · "}
                      <a href={r.studio} target="_blank" rel="noreferrer">
                        Studio ↗
                      </a>
                    </>
                  ) : null}
                </td>
                <td className="dim">{r.at ? new Date(r.at).toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};
