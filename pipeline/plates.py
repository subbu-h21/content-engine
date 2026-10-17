"""Plates: Blender frame folders -> bloom baked in -> public/plates/<id>_final.mp4 (full res, crf 12)
and <id>_draft.mp4 (half res, crf 20, for fast scrubbing). Plates and their frame folders are listed in project.json.

  plates                     every plate, both qualities
  plates --only brain        one plate
  plates --quality draft     one quality
"""
import shutil
import subprocess
from concurrent.futures import ProcessPoolExecutor

import numpy as np
from PIL import Image, ImageFilter

BLOOM = {"threshold": 0.62, "radius": 28, "strength": 0.55}
QUALITIES = {"final": (1.0, "12"), "draft": (0.5, "20")}


def bloom(img, threshold=0.62, radius=28, strength=0.55):
    """Soft bloom on the 3D plate: bright areas bleed. img: PIL RGB -> PIL RGB."""
    a = np.asarray(img).astype(np.float32) / 255
    lum = a.max(-1, keepdims=True)
    hi = np.clip((lum - threshold) / (1 - threshold), 0, 1) * a
    h = Image.fromarray((hi * 255).astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(radius))
    b = np.asarray(h).astype(np.float32) / 255
    out = 1 - (1 - a) * (1 - b * strength)   # screen blend
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


def bloom_frame(args):
    src, dst, scale, cfg = args
    img = Image.open(src).convert("RGB")
    if scale != 1.0:
        img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
    img = bloom(img, threshold=cfg["threshold"], radius=max(1, int(cfg["radius"] * scale)), strength=cfg["strength"])
    img.save(dst, compress_level=1)


def expected_frames(p, plate):
    """Blender renders frames 1..round(duration*fps)+1 for the plate's scene range."""
    sc = p.timing()["scenes"]
    start = sc[plate["from"]]["start"]
    end = sc[plate["to"]]["start"] + sc[plate["to"]]["duration"]
    return int(round((end - start) * p.fps)) + 1


def run(p, only=None, quality=None, workers=10):
    plates = [pl for pl in p.manifest["plates"] if only in (None, pl["id"])]
    if only and not plates:
        raise SystemExit(f"no plate {only!r} in project.json")
    for pl in plates:
        src = p.path(pl.get("frames", f"renders/{pl['id']}/final"))
        frames = sorted(src.glob("f_*.png"))
        need = expected_frames(p, pl)
        if len(frames) < need:
            raise SystemExit(f"plate {pl['id']}: {len(frames)} frames in {src}, need {need}")
        cfg = {**BLOOM, **pl.get("bloom", {})}
        for q, (scale, crf) in QUALITIES.items():
            if quality not in (None, q):
                continue
            out = p.public / "plates" / f"{pl['id']}_{q}.mp4"
            out.parent.mkdir(parents=True, exist_ok=True)
            tmp = p.root / "_tmp" / "plates" / f"{pl['id']}_{q}"
            tmp.mkdir(parents=True, exist_ok=True)
            jobs = [(str(f), str(tmp / f"f_{i:05d}.png"), scale, cfg) for i, f in enumerate(frames)]
            with ProcessPoolExecutor(workers) as ex:
                list(ex.map(bloom_frame, jobs, chunksize=8))
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(p.fps), "-i", str(tmp / "f_%05d.png"),
                            "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)], check=True)
            shutil.rmtree(tmp)
            print(f"plate {out.name} ({len(frames)} frames)", flush=True)
