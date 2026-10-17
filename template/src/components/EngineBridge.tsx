/**
 * Connects Remotion Studio to the content engine, so Claude knows what you are looking at.
 * Active only when the engine started this Studio (it sets REMOTION_ENGINE_URL / REMOTION_ENGINE_PROJECT);
 * renders nothing and does nothing in renders or in a Studio you started yourself.
 *
 *  - reports the composition, playhead and current props to the engine (a few times per second at most)
 *  - carries out the engine's commands: jump to a frame, play/pause, switch composition, open a setting
 */
import React, { useEffect, useRef } from "react";
import { getRemotionEnvironment, useCurrentFrame, useVideoConfig } from "remotion";
import { focusDefaultPropsPath, goToComposition, pause, play, seek } from "@remotion/studio";
import { useReel } from "../lib/context";

type Env = { REMOTION_ENGINE_URL?: string; REMOTION_ENGINE_PROJECT?: string };
type Command =
  | { id: string; type: "seek"; frame: number }
  | { id: string; type: "play" | "pause" }
  | { id: string; type: "goto"; composition: string }
  | { id: string; type: "focus"; path: (string | number)[] };

/** Remotion copies REMOTION_* variables onto window.process.env when Studio loads. */
const engineEnv = (): Env => (typeof window === "undefined" ? {} : ((window as unknown as { process?: { env?: Env } }).process?.env ?? {}));

const post = (url: string, body: unknown) =>
  // text/plain keeps this a "simple" cross-origin request (no preflight)
  fetch(url, { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify(body) }).catch(() => undefined);

export const EngineBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { id, fps, durationInFrames } = useVideoConfig();
  const props = useReel();
  const { REMOTION_ENGINE_URL: url, REMOTION_ENGINE_PROJECT: project } = engineEnv();
  const base = url && project && getRemotionEnvironment().isStudio ? `${url}/api/bridge/${encodeURIComponent(project)}` : null;
  const sent = useRef({ at: 0, props: "", timer: null as ReturnType<typeof setTimeout> | null });

  // Report state: immediately if the last report is older than 200 ms, otherwise once the 200 ms are up.
  useEffect(() => {
    if (!base) return;
    const s = sent.current;
    const send = () => {
      const json = JSON.stringify(props);
      const body: Record<string, unknown> = { composition: id, frame, fps, durationInFrames };
      if (json !== s.props) {
        body.props = props;
        s.props = json;
      }
      s.at = Date.now();
      post(`${base}/state`, body);
    };
    if (s.timer) clearTimeout(s.timer);
    const wait = 200 - (Date.now() - s.at);
    if (wait <= 0) send();
    else s.timer = setTimeout(send, wait);
  }, [base, id, frame, fps, durationInFrames, props]);

  // Receive commands.
  useEffect(() => {
    if (!base) return;
    sent.current.props = ""; // a new connection gets the full props again
    const es = new EventSource(`${base}/events?composition=${encodeURIComponent(id)}`);
    es.onmessage = (ev) => {
      let cmd: Command;
      try {
        cmd = JSON.parse(ev.data) as Command;
      } catch {
        return;
      }
      let ok = true;
      let detail = "";
      try {
        if (cmd.type === "seek") seek(cmd.frame);
        else if (cmd.type === "play") play();
        else if (cmd.type === "pause") pause();
        else if (cmd.type === "goto") goToComposition(cmd.composition);
        else if (cmd.type === "focus") {
          ok = focusDefaultPropsPath({ path: cmd.path, scrollBehavior: "smooth" }).success;
          if (!ok) detail = "the props editor is not showing (a timeline row may be selected)";
        }
      } catch (e) {
        ok = false;
        detail = e instanceof Error ? e.message : String(e);
      }
      post(`${base}/result`, { id: cmd.id, ok, detail });
    };
    return () => es.close();
  }, [base, id]);

  return null;
};
