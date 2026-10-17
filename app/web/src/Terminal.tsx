/** The Claude Code terminal (xterm.js) for a project, connected to the engine over a WebSocket. */
import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export type TerminalHandle = { restart: () => void; focus: () => void };

export const Terminal: React.FC<{ project: string; handle?: React.MutableRefObject<TerminalHandle | null> }> = ({ project, handle }) => {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new XTerm({
      fontFamily: '"Cascadia Mono", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.15,
      cursorBlink: true,
      scrollback: 5000,
      allowProposedApi: false,
      theme: { background: "#0e0d10", foreground: "#e6ddcc", cursor: "#ede3d1", selectionBackground: "#3a3640" },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(box.current!);
    fit.fit();

    let ws: WebSocket | null = null;
    let closed = false;
    let retry: ReturnType<typeof setTimeout> | null = null;
    const send = (msg: object) => ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));

    const connect = () => {
      ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/terminal/${encodeURIComponent(project)}`);
      ws.onopen = () => {
        term.reset();
        send({ type: "resize", cols: term.cols, rows: term.rows });
      };
      ws.onmessage = (ev) => term.write(typeof ev.data === "string" ? ev.data : "");
      ws.onclose = () => {
        if (closed) return;
        term.write("\r\n\x1b[2m[disconnected from the engine — reconnecting…]\x1b[0m\r\n");
        retry = setTimeout(connect, 2000);
      };
    };
    connect();

    const input = term.onData((d) => send({ type: "input", data: d }));
    const ro = new ResizeObserver(() => {
      try {
        fit.fit();
        send({ type: "resize", cols: term.cols, rows: term.rows });
      } catch {
        // hidden or zero-sized
      }
    });
    ro.observe(box.current!);
    if (handle) handle.current = { restart: () => send({ type: "restart", cols: term.cols, rows: term.rows }), focus: () => term.focus() };

    return () => {
      closed = true;
      if (retry) clearTimeout(retry);
      ro.disconnect();
      input.dispose();
      ws?.close();
      term.dispose();
    };
  }, [project, handle]);

  return <div className="terminal" ref={box} />;
};
