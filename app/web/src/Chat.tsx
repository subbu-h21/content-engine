/**
 * The project's Claude panel: a chat with the project's Claude Code, which the engine runs on this PC
 * (server: app/server/claude.mjs). Updates arrive over a WebSocket; sending and answering are API calls.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { api, type ChatEvent, type ChatItem, type ChatQuestion, type ChatState, type ChatStep } from "./api";
import { Markdown } from "./Markdown";

const STATUS_WORD: Record<ChatState["status"], string> = {
  stopped: "",
  starting: "starting…",
  idle: "",
  working: "working…",
  question: "needs your answer",
  external: "in a terminal window",
};

/** "Ran 3 commands, read 2 files" for a group of steps; a single step (or a single "other" one) reads as itself. */
const PHRASES: Record<ChatStep["kind"], [string, string]> = {
  command: ["ran a command", "ran # commands"],
  read: ["read a file", "read # files"],
  edit: ["edited a file", "edited # files"],
  search: ["searched once", "searched # times"],
  web: ["looked something up online", "made # web lookups"],
  engine: ["used the editor", "used the engine # times"],
  chrome: ["did a step in Chrome", "did # steps in Chrome"],
  agent: ["asked a helper", "asked # helpers"],
  other: ["did one more step", "did # other steps"],
};
function summary(steps: ChatStep[]) {
  if (steps.length === 1) return steps[0].label;
  const counts = new Map<ChatStep["kind"], number>();
  for (const s of steps) counts.set(s.kind, (counts.get(s.kind) ?? 0) + 1);
  const one = (k: ChatStep["kind"]) => {
    const label = steps.find((s) => s.kind === k)!.label;
    return k === "other" ? label[0].toLowerCase() + label.slice(1) : PHRASES[k][0];
  };
  const text = [...counts].map(([k, n]) => (n === 1 ? one(k) : PHRASES[k][1].replace("#", String(n)))).join(", ");
  return text[0].toUpperCase() + text.slice(1);
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const Chat: React.FC<{ project: string }> = ({ project }) => {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [trimmed, setTrimmed] = useState(0);
  const [state, setState] = useState<ChatState | null>(null);
  const [online, setOnline] = useState(true);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let closed = false;
    let retry: ReturnType<typeof setTimeout> | null = null;
    setItems([]);
    setState(null);
    setError(null);
    const connect = () => {
      ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/chat/${encodeURIComponent(project)}`);
      ws.onopen = () => setOnline(true);
      ws.onmessage = (ev) => {
        let e: ChatEvent;
        try {
          e = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (e.type === "snapshot") {
          atBottom.current = true;
          setItems(e.items);
          setTrimmed(e.trimmed);
          setState(e.state);
        } else if (e.type === "item") {
          const item = e.item;
          setItems((prev) => {
            const i = prev.findIndex((x) => x.id === item.id);
            if (i < 0) return [...prev, item];
            const next = prev.slice();
            next[i] = item;
            return next;
          });
        } else if (e.type === "delta") {
          const { id, text } = e;
          setItems((prev) => prev.map((x) => (x.id === id && x.kind === "text" ? { ...x, text: x.text + text } : x)));
        } else if (e.type === "state") setState(e.state);
      };
      ws.onclose = () => {
        if (closed) return;
        setOnline(false);
        retry = setTimeout(connect, 2000);
      };
    };
    connect();
    return () => {
      closed = true;
      if (retry) clearTimeout(retry);
      ws?.close();
    };
  }, [project]);

  // keep the newest message in view, unless the user scrolled up to read
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && atBottom.current) el.scrollTop = el.scrollHeight;
  }, [items, state?.status]);
  const onScroll = () => {
    const el = scroller.current;
    if (el) atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const status = state?.status ?? "stopped";
  const working = status === "working" || status === "starting";
  useEffect(() => {
    if (!working) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [working]);

  const act = (fn: () => Promise<unknown>) => {
    setError(null);
    return fn().catch((e) => setError((e as Error).message));
  };

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setError(null);
    atBottom.current = true;
    try {
      const r = await api.chatSend(project, text);
      if (!r.ok) {
        setError(r.reason ?? "Claude couldn't be reached.");
        setDraft((d) => d || text);
      }
    } catch (e) {
      setError((e as Error).message);
      setDraft((d) => d || text);
    }
  };

  const external = status === "external";
  const canStop = working || status === "question";

  // a "Claude" marker where Claude's side of the conversation starts (after a message from the user or the engine)
  let side: "user" | "claude" | null = null;
  const rows: React.ReactNode[] = [];
  for (const it of items) {
    if (it.kind === "user") side = "user";
    else if (it.kind !== "notice" && side !== "claude") {
      side = "claude";
      rows.push(<ClaudeMark key={`mark:${it.id}`} />);
    }
    rows.push(<ItemView key={it.id} project={project} item={it} onError={setError} />);
  }

  return (
    <div className="chat">
      <div className="pane-head">
        <span>Claude</span>
        <span className={`chat-status ${status}`} title={STATUS_WORD[status] || "ready"}>
          <span className="dot" />
          {STATUS_WORD[status]}
        </span>
        <span className="spacer" />
        <ChatMenu
          external={external}
          busy={working}
          onTerminal={() => act(() => api.chatTerminal(project))}
          onNew={() => window.confirm("Start a new conversation with Claude? This one stays saved, but Claude won't remember it.") && act(() => api.chatNew(project))}
        />
      </div>

      <div className="chat-list" ref={scroller} onScroll={onScroll}>
        {trimmed ? <div className="chat-notice dim">Earlier messages aren't shown here (Claude still has them).</div> : null}
        {state && !items.length && !working ? <div className="chat-empty">Ask Claude anything about this video. It sees where you are in the editor and can change the video for you.</div> : null}
        {rows}
        {working ? (
          <div className="chat-working">
            <span className="pulse" />
            {status === "starting" ? "Starting Claude…" : `Working… ${state?.turnStartedAt ? clock(now - state.turnStartedAt) : ""}`}
          </div>
        ) : null}
      </div>

      {!online ? <div className="chat-banner">Not connected to the engine (stopped or restarting). This panel reconnects by itself.</div> : null}
      {external ? <div className="chat-banner">Claude is open in a terminal window on this PC. Close that window to continue here.</div> : null}
      {error ? <div className="chat-banner error">{error}</div> : null}

      <div className="chat-input">
        <div className={`composer ${external ? "off" : ""}`}>
          <textarea
            value={draft}
            rows={Math.min(8, Math.max(1, draft.split("\n").length))}
            placeholder={external ? "Claude is in a terminal window…" : working ? "Claude is working: a message waits its turn" : status === "question" ? "Claude is waiting for your answer above" : "Message Claude"}
            disabled={external}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
          />
          <div className="composer-row">
            <select
              className="chat-mode"
              value={state?.mode ?? "auto"}
              disabled={!state}
              onChange={(e) => act(() => api.chatMode(project, e.target.value as ChatState["mode"]))}
              title="Auto: Claude goes ahead with safe steps and asks only for risky ones. Ask first: Claude asks before every command or file change."
            >
              <option value="auto">Auto</option>
              <option value="manual">Ask first</option>
            </select>
            <span className="spacer" />
            {canStop ? (
              <button className="round stop" onClick={() => act(() => api.chatStop(project))} title="Stop what Claude is doing">
                <Icon name="stop" />
                <span className="sr">Stop</span>
              </button>
            ) : null}
            <button className="round send" disabled={external || !draft.trim()} onClick={send} title="Send (Enter). Shift+Enter for a new line">
              <Icon name="up" />
              <span className="sr">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Small line icons (stroke follows the text colour). */
const Icon: React.FC<{ name: "up" | "stop" | "dots" | "chevron" | "steps" | "spark" }> = ({ name }) => {
  const paths = {
    up: <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />,
    stop: <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none" />,
    dots: (
      <>
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    steps: <path d="M4 7h10M4 12h16M4 17h7" />,
    spark: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />,
  };
  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const ClaudeMark: React.FC = () => (
  <div className="chat-mark">
    <Icon name="spark" />
    Claude
  </div>
);

/** The "⋯" menu: the same conversation in a terminal window, or a new conversation. */
const ChatMenu: React.FC<{ external: boolean; busy: boolean; onTerminal: () => void; onNew: () => void }> = ({ external, busy, onTerminal, onNew }) => {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const pick = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  return (
    <div className="chat-menu" ref={box}>
      <button className="quiet icon-btn" onClick={() => setOpen(!open)} title="More" aria-label="More">
        <Icon name="dots" />
      </button>
      {open ? (
        <div className="menu">
          <button disabled={external || busy} onClick={pick(onTerminal)} title="The chat here waits until you close that window">
            Open in a terminal window
          </button>
          <button disabled={external} onClick={pick(onNew)}>
            New conversation
          </button>
        </div>
      ) : null}
    </div>
  );
};

/** A message from the user, or one the engine sent for them (long engine messages start folded). */
const UserView: React.FC<{ item: Extract<ChatItem, { kind: "user" }> }> = ({ item }) => {
  const engine = item.from === "engine";
  const text = item.text.replace(/^\[content engine\]\s*/, "");
  const long = engine && text.length > 280;
  const [open, setOpen] = useState(false);
  return (
    <div className={`chat-user ${engine ? "engine" : ""}`}>
      {engine ? <div className="who">Sent by the engine</div> : null}
      <div className={`body ${long && !open ? "folded" : ""}`}>{text}</div>
      {long ? (
        <button className="more" onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Show all"}
        </button>
      ) : null}
      {item.failed ? <div className="error">Not delivered.</div> : null}
    </div>
  );
};

const ItemView: React.FC<{ project: string; item: ChatItem; onError: (e: string | null) => void }> = ({ project, item, onError }) => {
  switch (item.kind) {
    case "user":
      return <UserView item={item} />;
    case "text":
      return (
        <div className={`chat-text ${item.streaming ? "streaming" : ""}`}>
          <Markdown text={item.text} />
        </div>
      );
    case "tools":
      return <ToolsView item={item} />;
    case "question":
      return <QuestionView project={project} item={item} onError={onError} />;
    case "permission":
      return <PermissionView project={project} item={item} onError={onError} />;
    case "notice":
      return <div className={`chat-notice ${item.tone ?? ""}`}>{item.text}</div>;
  }
};

const ToolsView: React.FC<{ item: Extract<ChatItem, { kind: "tools" }> }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  const running = item.steps.some((s) => s.status === "running");
  const failed = item.steps.filter((s) => s.status === "error").length;
  return (
    <div className={`chat-tools ${open ? "open" : ""}`}>
      <button className="tools-line" onClick={() => setOpen(!open)} title={open ? "Hide the steps" : "Show the steps"}>
        {running ? <span className="pulse" /> : <Icon name="steps" />}
        <span className="what">{summary(item.steps)}</span>
        {failed ? <span className="dim">· {failed === 1 ? "one didn't work" : `${failed} didn't work`}</span> : null}
        <span className="caret">
          <Icon name="chevron" />
        </span>
      </button>
      {open ? (
        <ul>
          {item.steps.map((st) => (
            <li key={st.id}>
              <button className={`step ${st.status}`} onClick={() => setShown(shown === st.id ? null : st.id)} disabled={!st.output}>
                <span className="mark">{st.status === "running" ? "…" : st.status === "error" ? "✕" : "✓"}</span> {st.label}
              </button>
              {shown === st.id && st.output ? <pre>{st.output}</pre> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const PermissionView: React.FC<{ project: string; item: Extract<ChatItem, { kind: "permission" }>; onError: (e: string | null) => void }> = ({ project, item, onError }) => {
  const [busy, setBusy] = useState(false);
  const decide = async (decision: "allow" | "always" | "deny") => {
    setBusy(true);
    onError(null);
    try {
      await api.chatAnswer(project, item.id, { decision });
    } catch (e) {
      onError((e as Error).message);
    }
    setBusy(false);
  };
  const done = { allow: "Allowed.", always: "Allowed (and won't ask again for this).", deny: "Denied.", cancelled: "No longer waiting." };
  return (
    <div className={`chat-card ${item.answer ? "answered" : ""}`}>
      <div className="card-title">Claude wants to: {item.title}</div>
      {item.note ? <div className="note">{item.note}</div> : null}
      {item.detail ? <pre>{item.detail}</pre> : null}
      {item.answer ? (
        <div className="dim">{done[item.answer]}</div>
      ) : (
        <div className="actions">
          <button className="primary" disabled={busy} onClick={() => decide("allow")}>
            Allow
          </button>
          {item.canAlways ? (
            <button disabled={busy} onClick={() => decide("always")} title="Allow this, and don't ask again for the same thing in this video">
              Always allow
            </button>
          ) : null}
          <button disabled={busy} onClick={() => decide("deny")}>
            Deny
          </button>
        </div>
      )}
    </div>
  );
};

const QuestionView: React.FC<{ project: string; item: Extract<ChatItem, { kind: "question" }>; onError: (e: string | null) => void }> = ({ project, item, onError }) => {
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [other, setOther] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const value = (q: ChatQuestion) => {
    const own = other[q.question]?.trim();
    const chosen = picked[q.question] ?? [];
    if (q.multiSelect) return [...chosen, ...(own ? [own] : [])].join(", ");
    return own || chosen[0] || "";
  };
  const submit = async (answers: Record<string, string>) => {
    setBusy(true);
    onError(null);
    try {
      await api.chatAnswer(project, item.id, { answers });
    } catch (e) {
      onError((e as Error).message);
    }
    setBusy(false);
  };
  // one question with one answer: picking an option answers it
  const quick = item.questions.length === 1 && !item.questions[0].multiSelect;
  const pick = (q: ChatQuestion, label: string) => {
    if (quick) return submit({ [q.question]: label });
    setOther((o) => ({ ...o, [q.question]: q.multiSelect ? o[q.question] ?? "" : "" }));
    setPicked((p) => {
      const cur = p[q.question] ?? [];
      return { ...p, [q.question]: q.multiSelect ? (cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]) : [label] };
    });
  };
  const open = item.answer === undefined;
  const ready = item.questions.every((q) => value(q));
  return (
    <div className={`chat-card question ${open ? "" : "answered"}`}>
      {item.questions.map((q) => {
        const given = typeof item.answer === "object" ? item.answer[q.question] : null;
        return (
          <div key={q.question} className="q">
            {q.header ? <div className="chip">{q.header}</div> : null}
            <div className="card-title">{q.question}</div>
            {open ? (
              <>
                <div className="options">
                  {q.options.map((o) => (
                    <button key={o.label} className={(picked[q.question] ?? []).includes(o.label) ? "on" : ""} disabled={busy} onClick={() => pick(q, o.label)}>
                      <span className="label">{o.label}</span>
                      {o.description ? <span className="desc">{o.description}</span> : null}
                    </button>
                  ))}
                </div>
                <input
                  placeholder={q.multiSelect ? "Something else (optional)" : "Or type your own answer"}
                  value={other[q.question] ?? ""}
                  disabled={busy}
                  onChange={(e) => {
                    const v = e.target.value;
                    setOther((o) => ({ ...o, [q.question]: v }));
                    if (!q.multiSelect && v) setPicked((p) => ({ ...p, [q.question]: [] }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && quick && value(q)) submit({ [q.question]: value(q) });
                  }}
                />
              </>
            ) : (
              <div className="dim">{given ? `Answered: ${given}` : item.answer === "cancelled" ? "No longer waiting." : "Answered."}</div>
            )}
          </div>
        );
      })}
      {open && (!quick || Object.values(other).some((v) => v.trim())) ? (
        <div className="actions">
          <button className="primary" disabled={busy || !ready} onClick={() => submit(Object.fromEntries(item.questions.map((q) => [q.question, value(q)])))}>
            Send {item.questions.length > 1 ? "answers" : "answer"}
          </button>
        </div>
      ) : null}
    </div>
  );
};
