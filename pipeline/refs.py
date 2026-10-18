"""References: turn uploaded videos, images and audio into material Claude can study (it can't watch a video).

For every file at the top of <project>/references/ writes references/_study/<file name>/:
  info.json        kind, size, duration, fps, has_audio, status ("processing" | "done" | "error"), source mtime
  frames/f_NNN.jpg video: about one still per second (at most 90), 480 px wide
  contact.jpg      video: up to 24 stills on one sheet (6 x 4)
  cuts.json        video: times of hard cuts (ffmpeg scene detection)
  palette.json     video/image: 8 dominant colours with their share
  transcript.txt   video/audio with speech: "[0:01.2-0:03.4] text" lines (Whisper, local and free)
Text files (.md .txt .pdf) are left as they are. Files already studied (same mtime) are skipped.

  refs [--no-transcript] [--only <file name>]
"""
import json
import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ENGINE = Path(__file__).resolve().parent.parent
VIDEO = {".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"}
IMAGE = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
AUDIO = {".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"}


def kind_of(p):
    s = p.suffix.lower()
    return "video" if s in VIDEO else "image" if s in IMAGE else "audio" if s in AUDIO else "text"


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(p)], capture_output=True, text=True, check=True)
    j = json.loads(r.stdout)
    v = next((s for s in j["streams"] if s["codec_type"] == "video" and s.get("disposition", {}).get("attached_pic") != 1), None)
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    info = {"duration": round(float(j["format"].get("duration", 0) or 0), 2), "has_audio": a is not None}
    if v:
        num, den = (v.get("avg_frame_rate") or "0/1").split("/")
        info.update({"width": v.get("width"), "height": v.get("height"), "fps": round(float(num) / float(den), 3) if float(den) else None})
    return info


def palette(images, n=8):
    """Dominant colours across images: quantise a strip of small thumbnails."""
    thumbs = [Image.open(i).convert("RGB").resize((96, 96)) for i in images[:40]]
    if not thumbs:
        return []
    strip = Image.new("RGB", (96 * len(thumbs), 96))
    for k, t in enumerate(thumbs):
        strip.paste(t, (96 * k, 0))
    q = strip.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    total = sum(c for c, _ in counts)
    return [{"hex": "#%02x%02x%02x" % tuple(pal[i * 3:i * 3 + 3]), "share": round(c / total, 3)} for c, i in counts]


def cuts(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(p), "-vf", "select='gt(scene,0.32)',showinfo", "-an", "-f", "null", "-"], capture_output=True, text=True)
    return [round(float(m), 2) for m in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


def transcribe(p, out, model):
    model_dir = ENGINE / "models" / "whisper"
    model_dir.mkdir(parents=True, exist_ok=True)
    tmp = out / "_whisper"
    tmp.mkdir(exist_ok=True)
    subprocess.run(["whisper", str(p), "--model", model, "--model_dir", str(model_dir), "--output_format", "json", "--output_dir", str(tmp), "--fp16", "False", "--verbose", "False"],
                   capture_output=True, text=True, check=True)
    j = json.loads(next(tmp.glob("*.json")).read_text(encoding="utf-8"))
    shutil.rmtree(tmp)

    def ts(t):
        return f"{int(t // 60)}:{t % 60:04.1f}"
    lines = [f"[{ts(s['start'])}-{ts(s['end'])}] {s['text'].strip()}" for s in j.get("segments", []) if s["text"].strip()]
    (out / "transcript.txt").write_text(f"language: {j.get('language', '?')}\n" + "\n".join(lines) + "\n", encoding="utf-8")
    return len(lines)


def study(p, out, transcript=True, model="small"):
    k = kind_of(p)
    info = {"file": p.name, "kind": k, "status": "processing", "mtime": p.stat().st_mtime}
    out.mkdir(parents=True, exist_ok=True)
    (out / "info.json").write_text(json.dumps(info, indent=1))
    try:
        if k == "video":
            info.update(probe(p))
            d = max(info["duration"], 0.1)
            frames = out / "frames"
            if frames.exists():
                shutil.rmtree(frames)
            frames.mkdir()
            rate = min(1.0, 90 / d)
            subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-vf", f"fps={rate:.4f},scale=480:-2", "-q:v", "3", str(frames / "f_%03d.jpg")], check=True)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(p), "-vf", f"fps={min(24 / d, 30):.4f},scale=240:-2,tile=6x4", "-frames:v", "1", "-q:v", "3", str(out / "contact.jpg")], check=True)
            info["stills"] = len(list(frames.glob("*.jpg")))
            info["still_every_s"] = round(1 / rate, 2)
            (out / "cuts.json").write_text(json.dumps(cuts(p)))
            (out / "palette.json").write_text(json.dumps(palette(sorted(frames.glob("*.jpg")))))
        elif k == "image":
            with Image.open(p) as im:
                info.update({"width": im.width, "height": im.height})
            (out / "palette.json").write_text(json.dumps(palette([p])))
        elif k == "audio":
            info.update(probe(p))
        if transcript and k in ("video", "audio") and info.get("has_audio"):
            info["transcript_lines"] = transcribe(p, out, model)
        info["status"] = "done"
    except Exception as e:  # keep going with the other references
        info["status"] = "error"
        info["error"] = str(e)[-800:]
    (out / "info.json").write_text(json.dumps(info, indent=1))
    return info


def run(p, transcript=True, only=None):
    refs = p.root / "references"
    if not refs.exists():
        print("no references/ folder")
        return
    model = p.manifest.get("references", {}).get("whisperModel", "small")
    for f in sorted(refs.iterdir()):
        if not f.is_file() or f.name.startswith(".") or (only and f.name != only):
            continue
        out = refs / "_study" / f.name
        try:
            prev = json.loads((out / "info.json").read_text())
            if prev.get("status") == "done" and prev.get("mtime") == f.stat().st_mtime:
                continue
        except Exception:
            pass
        info = study(f, out, transcript=transcript, model=model)
        print(f"{f.name}: {info['kind']} {info['status']}" + (f" ({info.get('error', '')[:200]})" if info["status"] == "error" else ""), flush=True)
