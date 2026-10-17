/** Voice, ducked music, and sound effects as separate timeline rows. Gains come from the Props panel. */
import React from "react";
import { Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import duck from "../data/duck.json";
import sfxEvents from "../data/sfx_events.json";
import { db, useReel } from "../lib/context";
import { clamp } from "../lib/motion";
import { project } from "../lib/project";
import { FPS, TOTAL_FRAMES, TOTAL_SECONDS } from "../lib/timing";

const PY_DUCK_DB = duck.duckDb; // the envelope was baked at this depth; rescale to the requested one
const gain = duck.gain as number[];
const events = sfxEvents as { t: number; kind: string; gain: number; lead: number }[];

const musicEnvelope = (frame: number, duckDb: number): number => {
  const g = gain[Math.min(gain.length - 1, Math.max(0, frame))] ?? 1;
  // g is in [10^(PY_DUCK_DB/20), 1]; map the attenuated part to the requested depth
  const attenuated = (1 - g) / (1 - db(PY_DUCK_DB));
  const env = 1 - attenuated * (1 - db(duckDb));
  const t = frame / FPS;
  const fadeIn = clamp(t / 1.5);
  const fadeOut = clamp((TOTAL_SECONDS - t) / 4.0);
  return env * fadeIn * Math.pow(fadeOut, 1.5);
};

export const AudioMix: React.FC = () => {
  const { audio } = useReel();
  const frame = useCurrentFrame();
  const { voice, music } = project.stems;
  return (
    <>
      {audio.voice && voice ? <Audio src={staticFile(voice)} volume={db(audio.voiceDb)} name="Voice" /> : null}
      {audio.music && music ? <Audio src={staticFile(music)} volume={db(audio.musicDb) * musicEnvelope(frame, audio.duckDb)} name="Music (ducked)" durationInFrames={TOTAL_FRAMES} /> : null}
      {audio.sfx
        ? events.map((e, i) => {
            const from = Math.round((e.t - e.lead) * FPS);
            if (from + 2 >= TOTAL_FRAMES) return null;
            return (
              <Sequence key={i} from={Math.max(0, from)} name={`SFX · ${e.kind}`} layout="none">
                <Audio src={staticFile(`audio/sfx/${e.kind}.wav`)} volume={db(audio.sfxDb) * e.gain} name={e.kind} showInTimeline={false} />
              </Sequence>
            );
          })
        : null}
    </>
  );
};
