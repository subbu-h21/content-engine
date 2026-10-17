/**
 * Developer overlay (never in a delivery render unless you ask for it):
 * safe areas, baseline grid, tracked 3D markers, cue readout, timecode, captions.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useReel } from "../lib/context";
import { MARKER_NAMES, markerAt, markersActive } from "../lib/markers";
import { script } from "../lib/project";
import { FPS, HEIGHT, SCENE_IDS, sceneStart, sceneDuration, sceneNumber, sceneTitle, toSeconds, WIDTH, type SceneId } from "../lib/timing";
import timing from "../data/timing.json";
import { MARGIN, SAFE_BOTTOM, SAFE_TOP } from "../lib/theme";

const MONO = `"Cascadia Mono", "Consolas", monospace`;
const GUIDE = "rgba(120, 220, 255, 0.55)";
const GUIDE_DIM = "rgba(120, 220, 255, 0.18)";

const currentScene = (t: number): { id: SceneId; tl: number } => {
  for (const id of SCENE_IDS) if (t >= sceneStart(id) && t < sceneStart(id) + sceneDuration(id)) return { id, tl: t - sceneStart(id) };
  const id = SCENE_IDS[SCENE_IDS.length - 1];
  return { id, tl: t - sceneStart(id) };
};

const currentCue = (id: SceneId, tl: number): { name: string; text: string; active: boolean } | null => {
  const cues = timing.scenes[id].cues as Record<string, { start: number; end: number }>;
  const lines = script.scenes.find((s) => s.id === id)?.cues ?? [];
  let last: { name: string; text: string; active: boolean } | null = null;
  for (const c of lines) {
    const w = cues[c.id];
    if (!w) continue;
    if (tl >= w.start) last = { name: c.id, text: c.text, active: tl < w.end };
  }
  return last;
};

export const Guides: React.FC = () => {
  const { guides } = useReel();
  const frame = useCurrentFrame();
  const t = toSeconds(frame);
  const { id, tl } = currentScene(t);
  const cue = currentCue(id, tl);
  const tc = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}:${String(frame % FPS).padStart(2, "0")}`;
  const inPlate = markersActive(t);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: MONO }}>
      {guides.captions && cue && cue.active ? (
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            right: MARGIN,
            bottom: SAFE_BOTTOM - 60,
            textAlign: "center",
            fontFamily: `"Inter 18pt", "Inter", sans-serif`,
            fontSize: 34,
            lineHeight: 1.3,
            color: "#fff",
            textShadow: "0 0 4px #000, 0 0 12px #000",
          }}
        >
          {cue.text}
        </div>
      ) : null}
      {guides.safeAreas ? (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={MARGIN} y={SAFE_TOP} width={WIDTH - 2 * MARGIN} height={HEIGHT - SAFE_TOP - SAFE_BOTTOM} fill="none" stroke={GUIDE} strokeDasharray="6 6" />
          <line x1={0} y1={SAFE_TOP} x2={WIDTH} y2={SAFE_TOP} stroke={GUIDE_DIM} />
          <line x1={0} y1={HEIGHT - SAFE_BOTTOM} x2={WIDTH} y2={HEIGHT - SAFE_BOTTOM} stroke={GUIDE_DIM} />
          <line x1={WIDTH / 2} y1={0} x2={WIDTH / 2} y2={HEIGHT} stroke={GUIDE_DIM} strokeDasharray="2 10" />
          <text x={MARGIN + 8} y={SAFE_TOP - 8} fill={GUIDE} fontSize={18} fontFamily={MONO}>
            safe top {SAFE_TOP}
          </text>
          <text x={MARGIN + 8} y={HEIGHT - SAFE_BOTTOM + 22} fill={GUIDE} fontSize={18} fontFamily={MONO}>
            safe bottom {SAFE_BOTTOM} · margin {MARGIN}
          </text>
        </svg>
      ) : null}
      {guides.baselines ? (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: HEIGHT / 40 }, (_, i) => (
            <line key={i} x1={0} y1={i * 40} x2={WIDTH} y2={i * 40} stroke={i % 5 === 0 ? GUIDE_DIM : "rgba(120,220,255,0.07)"} />
          ))}
        </svg>
      ) : null}
      {guides.markers && inPlate ? (
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
          {MARKER_NAMES.map((name) => {
            const m = markerAt(t, name);
            return (
              <g key={name} opacity={m.visible ? 1 : 0.35}>
                <circle cx={m.x} cy={m.y} r={9} fill="none" stroke="#ffd166" strokeWidth={1.5} />
                <line x1={m.x - 14} y1={m.y} x2={m.x + 14} y2={m.y} stroke="#ffd166" strokeWidth={1} />
                <line x1={m.x} y1={m.y - 14} x2={m.x} y2={m.y + 14} stroke="#ffd166" strokeWidth={1} />
                <text x={m.x + 14} y={m.y - 10} fill="#ffd166" fontSize={18} fontFamily={MONO}>
                  {name} {Math.round(m.x)},{Math.round(m.y)}
                </text>
              </g>
            );
          })}
        </svg>
      ) : null}
      {guides.cueReadout ? (
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            padding: "12px 16px",
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.65)",
            color: "#dfe7ee",
            fontSize: 20,
            lineHeight: 1.45,
            maxWidth: WIDTH - 48,
          }}
        >
          <div style={{ color: "#8fd3ff" }}>
            {String(sceneNumber(id)).padStart(2, "0")} {id} · {sceneTitle[id]} · tl {tl.toFixed(2)}s
          </div>
          {cue ? (
            <div>
              <span style={{ color: cue.active ? "#ffd166" : "#7f8a93" }}>{cue.name}</span> {cue.text}
            </div>
          ) : (
            <div style={{ color: "#7f8a93" }}>(before first cue)</div>
          )}
        </div>
      ) : null}
      {guides.timecode ? (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 24,
            padding: "8px 12px",
            borderRadius: 6,
            backgroundColor: "rgba(0,0,0,0.65)",
            color: "#dfe7ee",
            fontSize: 22,
          }}
        >
          {tc} · f{frame}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
