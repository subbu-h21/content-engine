/**
 * The Publish page: every video with an exported file on the left (the Final render's file, drafts and other renders),
 * the picked one in the middle (player, YouTube / Facebook / Instagram), its Claude panel on the right (Claude posts to
 * Facebook and Instagram in Chrome). With nothing picked, the middle shows the history.
 */
import React, { useEffect, useState } from "react";
import { api, type PublishList, type VideoFile } from "./api";
import { Chat } from "./Chat";
import { History } from "./History";
import { navigate } from "./nav";
import { PublishPanel } from "./PublishPanel";
import { TopNav } from "./TopNav";
import { PLATFORM_NAME, publishNeedsYou, publishWord } from "./words";

const PANEL_KEY = "ce.claudePanelWidth";
export const KIND: Record<VideoFile["kind"], string> = { final: "Final", master: "Final (sound not levelled)", draft: "Draft", render: "Render" };
const mb = (b: number) => (b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(b / 1e6))} MB`);
const fileUrl = (project: string, rel: string) => `/api/projects/${encodeURIComponent(project)}/file?path=${encodeURIComponent(rel)}`;
const fileName = (rel: string) => rel.split("/").pop() ?? rel;

export const PublishPage: React.FC<{ name: string | null }> = ({ name }) => {
  const [list, setList] = useState<PublishList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(() => {
    try {
      return Number(localStorage.getItem(PANEL_KEY)) || 520;
    } catch {
      return 520;
    }
  });
  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setList(await api.publishVideos());
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

  useEffect(() => {
    if (name) api.view(name, "publish").catch(() => undefined);
  }, [name]);

  const pick = async (project: string, rel: string) => {
    try {
      await api.publishSelect(project, rel);
      setList((cur) => cur && { ...cur, ready: cur.ready.map((r) => (r.project === project ? { ...r, selected: rel } : r)) });
    } catch (e) {
      setError((e as Error).message);
    }
    if (project !== name) navigate(`/publish/${encodeURIComponent(project)}`);
  };

  const drag = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const shield = document.createElement("div");
    shield.className = "drag-shield";
    document.body.appendChild(shield);
    const move = (ev: PointerEvent) => setWidth(Math.max(320, Math.min(window.innerWidth - 640, startW - (ev.clientX - startX))));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      shield.remove();
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

  const current = list?.ready.find((r) => r.project === name) ?? null;
  const known = !name || !list || current || list.notYet.some((r) => r.project === name);

  return (
    <div className="editor publish-page">
      <TopNav current="publish" compact />
      <div className="panes">
        <aside className="video-list">
          <button className={`history-link ${name ? "" : "on"}`} onClick={() => navigate("/publish")}>
            History
          </button>
          <h3>Ready to publish</h3>
          {error ? <p className="error">{error}</p> : null}
          {list === null ? <p className="hint">Loading…</p> : null}
          {list?.ready.length === 0 ? <p className="hint">No video has an exported file yet: make one on a video's Final tab.</p> : null}
          {list?.ready.map((r) => (
            <div key={r.project} className={`vcard ${r.project === name ? "on" : ""}`}>
              <div className="vtitle">
                <span className="num">{String(r.number).padStart(2, "0")}</span> {r.title ?? r.project}
              </div>
              {r.publish ? (
                <div className="badges">
                  {(["youtube", "facebook", "instagram"] as const)
                    .filter((p) => r.publish?.[p])
                    .map((p) => (
                      <span key={p} className={`badge ${publishNeedsYou(r.publish![p]!) ? "bad" : ""}`}>
                        {PLATFORM_NAME[p]}: {publishWord(p, r.publish![p]!)}
                      </span>
                    ))}
                </div>
              ) : null}
              {r.videos.map((v) => {
                const on = r.project === name && r.selected === v.rel;
                return (
                  <button key={v.rel} className={`vfile ${on ? "on" : ""}`} onClick={() => pick(r.project, v.rel)} title={v.rel}>
                    <video muted preload="metadata" src={`${fileUrl(r.project, v.rel)}#t=1`} />
                    <span className="vinfo">
                      <span className={`kind kind-${v.kind}`}>{KIND[v.kind]}</span>
                      <span className="dim">{fileName(v.rel)}</span>
                      <span className="dim">
                        {mb(v.size)} · {new Date(v.madeAt).toLocaleDateString()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
          {list?.notYet.length ? (
            <>
              <h3>Not exported yet</h3>
              {list.notYet.map((r) => (
                <div key={r.project} className="notyet">
                  <span>
                    <span className="num">{String(r.number).padStart(2, "0")}</span> {r.title ?? r.project}
                  </span>
                  <a href="#" onClick={(e) => (e.preventDefault(), navigate(`/p/${encodeURIComponent(r.project)}/final`))}>
                    Final tab →
                  </a>
                </div>
              ))}
            </>
          ) : null}
        </aside>

        {name && known ? <PublishPanel key={name} name={name} /> : name ? <div className="board"><p className="error">There's no video called {name} in the workspace.</p></div> : <History />}

        {/* the video's Claude (posts to Facebook and Instagram in Chrome); showing it doesn't start Claude */}
        {name && known ? (
          <>
            <div className="divider" onPointerDown={drag} />
            <aside className="claude-pane" style={{ width }}>
              <Chat key={name} project={name} />
            </aside>
          </>
        ) : null}
      </div>
    </div>
  );
};
