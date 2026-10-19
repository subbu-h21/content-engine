/** A project: Brief or Editor on the left (Studio stays loaded while Brief is shown), Claude Code on the right. */
import React, { useEffect, useRef, useState } from "react";
import { api, type Context, type ProjectInfo, type StudioInfo } from "./api";
import { BriefBoard } from "./BriefBoard";
import { RenderPanel } from "./RenderPanel";
import { navigate } from "./nav";
import { Terminal, type TerminalHandle } from "./Terminal";

const PANEL_KEY = "ce.claudePanelWidth";
export type Tab = "brief" | "editor" | "final";

export const Project: React.FC<{ name: string; tab: Tab }> = ({ name, tab }) => {
  const [info, setInfo] = useState<ProjectInfo | null>(null);
  const [studio, setStudio] = useState<StudioInfo>({ status: "starting" });
  const [src, setSrc] = useState<string | null>(null);
  const [ctx, setCtx] = useState<Context | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(() => {
    try {
      return Number(localStorage.getItem(PANEL_KEY)) || 560;
    } catch {
      return 560;
    }
  });
  const term = useRef<TerminalHandle | null>(null);
  const go = (t: Tab) => navigate(`/p/${encodeURIComponent(name)}${t === "editor" ? "" : `/${t}`}`);

  // open the project: connection files + Studio, then wait until Studio answers
  useEffect(() => {
    let stop = false;
    setSrc(null);
    api.project(name).then(setInfo, (e) => setError(e.message));
    api.open(name).then(
      async (s) => {
        setStudio(s);
        while (!stop) {
          const cur = await api.studio(name);
          setStudio(cur);
          if (cur.status === "ready" && cur.url) {
            setSrc((prev) => prev ?? `${cur.url}/Reel`);
            break;
          }
          if (cur.status === "exited") break;
          await new Promise((r) => setTimeout(r, 800));
        }
      },
      (e) => setError(e.message),
    );
    return () => {
      stop = true;
    };
  }, [name]);

  // tell the engine which tab is open (it changes what Claude is told with each message)
  useEffect(() => {
    api.view(name, tab).catch(() => undefined);
  }, [name, tab]);

  // what Claude sees, refreshed a few times per second
  useEffect(() => {
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          setCtx(await api.context(name));
        } catch {
          // engine restarting
        }
        await new Promise((r) => setTimeout(r, 600));
      }
    })();
    return () => {
      stop = true;
    };
  }, [name]);

  const restartStudio = async () => {
    setSrc(null);
    setStudio({ status: "starting" });
    try {
      await api.restartStudio(name);
      for (;;) {
        const cur = await api.studio(name);
        setStudio(cur);
        if (cur.status === "ready" && cur.url) return setSrc(`${cur.url}/Reel?t=${Date.now()}`);
        if (cur.status === "exited") return;
        await new Promise((r) => setTimeout(r, 800));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // drag the divider between the left side and Claude
  const drag = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const shield = document.createElement("div");
    shield.className = "drag-shield"; // keeps the iframe from swallowing pointer events
    document.body.appendChild(shield);
    const move = (ev: PointerEvent) => setWidth(Math.max(320, Math.min(window.innerWidth - 400, startW - (ev.clientX - startX))));
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

  const visible = ctx?.elements?.filter((e) => e.visible) ?? [];

  return (
    <div className="editor">
      <header className="bar">
        <button className="quiet" onClick={() => navigate("/")}>
          ← Videos
        </button>
        <span className="project-title">{info?.title ?? name}</span>
        <nav className="tabs">
          <button className={tab === "brief" ? "on" : ""} onClick={() => go("brief")}>
            Brief
          </button>
          <button className={tab === "editor" ? "on" : ""} onClick={() => go("editor")}>
            Editor
          </button>
          <button className={tab === "final" ? "on" : ""} onClick={() => go("final")}>
            Final
          </button>
        </nav>
        <span className={`pill ${studio.status}`}>{studio.status === "ready" ? "Studio ready" : studio.status === "exited" ? "Studio stopped" : "Studio starting…"}</span>
        <span className="spacer" />
        {tab === "editor" && studio.url ? (
          <a className="quiet" href={`${studio.url}/Reel`} target="_blank" rel="noreferrer">
            Studio in new tab
          </a>
        ) : null}
        {tab === "editor" ? (
          <button className="quiet" onClick={restartStudio}>
            Restart Studio
          </button>
        ) : null}
      </header>

      {error ? <p className="error inline">{error}</p> : null}

      <div className="panes">
        {tab === "brief" ? <BriefBoard name={name} onOpenEditor={() => go("editor")} /> : null}
        {tab === "final" ? <RenderPanel name={name} /> : null}
        <div className="studio-pane" style={tab !== "editor" ? { display: "none" } : undefined}>
          {src ? (
            <iframe title="Remotion Studio" src={src} allow="autoplay; fullscreen; clipboard-read; clipboard-write" />
          ) : (
            <div className="placeholder">
              {studio.status === "exited" ? (
                <>
                  <p>Studio stopped{studio.error ? `: ${studio.error}` : "."}</p>
                  <pre>{(studio.log ?? []).slice(-12).join("\n")}</pre>
                  <button onClick={restartStudio}>Start again</button>
                </>
              ) : (
                <p>Starting Remotion Studio…</p>
              )}
            </div>
          )}
          <div className="sees" title="What Claude is told with every message you send">
            <span className="label">Claude sees</span>
            {ctx?.live ? (
              <>
                <span className="time">{ctx.timeLabel}</span>
                {ctx.scene ? (
                  <span>
                    {String(ctx.scene.number).padStart(2, "0")} {ctx.scene.title}
                  </span>
                ) : null}
                {ctx.cue ? <em className={ctx.cue.speaking ? "" : "dim"}>“{ctx.cue.text}”</em> : null}
                {visible.length ? <span className="dim">{visible.map((v) => v.path).join(", ")}</span> : null}
              </>
            ) : (
              <span className="dim">nothing yet: Studio hasn't reported a position</span>
            )}
          </div>
        </div>
        <div className="divider" onPointerDown={drag} />
        <aside className="claude-pane" style={{ width }}>
          <div className="pane-head">
            <span>Claude</span>
            <span className="spacer" />
            <button className="quiet" onClick={() => term.current?.restart()} title="Start a fresh Claude Code conversation">
              Restart
            </button>
          </div>
          <Terminal project={name} handle={term} />
        </aside>
      </div>
    </div>
  );
};
