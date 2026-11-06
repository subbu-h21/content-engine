/**
 * Settings → Channels: each new video belongs to a channel, and the channel decides which catalog style it starts
 * with. Look locked = always the channel's style; otherwise the channel's last video's style (the channel's own at
 * first), changeable per video on the Brief. Saved in settings.json → channels.
 */
import React, { useEffect, useState } from "react";
import { api, previewUrl, type CatalogStyle, type Channel } from "./api";
import { navigate } from "./nav";

export const ChannelsSettings: React.FC<{ channels: Channel[] }> = ({ channels: initial }) => {
  const [channels, setChannels] = useState<Channel[]>(initial);
  const [styles, setStyles] = useState<CatalogStyle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => setChannels(initial), [initial]);
  useEffect(() => {
    api.catalog().then((r) => setStyles(r.styles), () => undefined);
  }, []);

  const save = async (next: Channel[], what: string) => {
    setError(null);
    try {
      const v = await api.saveChannels(next);
      setChannels(v.channels ?? next);
      setSaved(what);
      setTimeout(() => setSaved(null), 1500);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const update = (i: number, patch: Partial<Channel>, what: string) => save(channels.map((c, j) => (j === i ? { ...c, ...patch } : c)), what);
  const styleOf = (id: string | null) => styles.find((s) => s.id === id) ?? null;

  return (
    <>
      <p className="hint">
        Every new video belongs to a channel. The channel decides the style the video starts with: with <strong>Look locked</strong> it's always the
        channel's style; otherwise it's the style of the channel's last video (the channel's own at first), and you can change it on the video's Brief.
        Styles come from the{" "}
        <a href="/catalog" onClick={(e) => (e.preventDefault(), navigate("/catalog"))}>
          Catalog
        </a>
        .
      </p>
      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="hint okmark">Saved: {saved}</p> : null}
      <ul className="channels">
        {channels.map((c, i) => {
          const st = styleOf(c.style);
          return (
            <li key={c.id}>
              <span className="channel-cover">{st?.cover ? <img src={previewUrl(st.id, "cover.jpg", st.stamp)} alt="" /> : null}</span>
              <span className="channel-main">
                <input
                  className="channel-name"
                  defaultValue={c.name}
                  aria-label="Channel name"
                  onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== c.name && update(i, { name: e.target.value.trim() }, `${c.name} renamed`)}
                  onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                />
                <span className="channel-row">
                  <select value={c.style ?? ""} onChange={(e) => update(i, { style: e.target.value || null, locked: e.target.value ? c.locked : false }, `${c.name}'s style`)} aria-label="Style">
                    <option value="">No style yet (Claude proposes one per video)</option>
                    <optgroup label="Yours">
                      {styles.filter((s) => !s.builtIn).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                          {s.status === "experimental" ? " (experimental)" : ""}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Built-in">
                      {styles.filter((s) => s.builtIn).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <label className="check" title={c.style ? "Every new video in this channel uses this style, and it can't be changed per video" : "Pick a style first"}>
                    <input type="checkbox" checked={c.locked} disabled={!c.style} onChange={(e) => update(i, { locked: e.target.checked }, e.target.checked ? `${c.name}'s look locked` : `${c.name}'s look unlocked`)} />
                    Look locked
                  </label>
                  {st ? (
                    <a className="quiet" href={`/catalog/${st.id}`} onClick={(e) => (e.preventDefault(), navigate(`/catalog/${st.id}`))}>
                      See the style
                    </a>
                  ) : null}
                </span>
              </span>
              <button
                className="quiet"
                onClick={() => window.confirm(`Delete the channel "${c.name}"? Its videos keep their style; they just won't belong to a channel.`) && save(channels.filter((_, j) => j !== i), `${c.name} deleted`)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
      <form
        className="link"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          save([...channels, { id: "", name: newName.trim(), style: null, locked: false }], `${newName.trim()} added`).then(() => setNewName(""));
        }}
      >
        <input placeholder="A new channel's name, e.g. Daily Insights" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit" disabled={!newName.trim()}>
          Add channel
        </button>
      </form>
    </>
  );
};
