/** Warning pop-up before a video goes to the Recycle Bin: shows what will be removed, asks for its number. */
import React, { useEffect, useRef, useState } from "react";
import { api } from "./api";

type Info = Awaited<ReturnType<typeof api.deleteInfo>>;

const size = (b: number) => (b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : b > 1e6 ? `${Math.round(b / 1e6)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

export const DeleteDialog: React.FC<{ name: string; number: number; onClose: () => void; onDeleted: () => void }> = ({ name, number, onClose, onDeleted }) => {
  const [info, setInfo] = useState<Info | null>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const want = String(number).padStart(2, "0");
  const ok = typed.trim().replace(/^0+/, "") === String(number);

  useEffect(() => {
    api.deleteInfo(name).then(setInfo, (e) => setError(e.message));
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [name, onClose, busy]);

  const remove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.remove(name, typed.trim());
      onDeleted();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <form className="modal" onSubmit={remove} role="dialog" aria-modal="true">
        <h2>Delete this video?</h2>
        <p className="modal-title">{info?.title ?? "…"}</p>
        <dl>
          <dt>Folder</dt>
          <dd>{info?.path ?? name}</dd>
          <dt>Contents</dt>
          <dd>{info ? `${info.files} files, ${size(info.bytes)}` : "…"}</dd>
        </dl>
        {info?.hasFinalVideo ? <p className="warn">It has a finished video in its out folder.</p> : null}
        {info?.hasRenders ? <p className="warn">It has Blender renders (hours of work to redo).</p> : null}
        <p className="hint">
          The whole folder goes to the Windows Recycle Bin; you can restore it from there. If the video is open anywhere, its Studio and Claude panel close.
        </p>
        <label className="confirm">
          Type <strong>{want}</strong> to confirm
          <input ref={input} value={typed} onChange={(e) => setTyped(e.target.value)} disabled={busy} inputMode="numeric" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <div className="modal-actions">
          <button type="button" className="quiet" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="danger" disabled={!ok || busy}>
            {busy ? "Moving to Recycle Bin…" : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
};
