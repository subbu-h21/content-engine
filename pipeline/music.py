"""Music: Lyria via OpenRouter from project.json → music.prompt (one paid call), then 48 kHz stereo WAV for the mix."""
import subprocess

from or_audio import api_key, music as lyria


def run(p, generate=True):
    m = p.manifest["music"]
    mp3, wav = p.audio / "music.mp3", p.audio / "music.wav"
    p.audio.mkdir(parents=True, exist_ok=True)
    if generate and not mp3.exists():
        if not m.get("prompt"):
            raise SystemExit("project.json → music.prompt is empty")
        print(lyria(m["prompt"], mp3, model=m["model"], key=api_key(p.root)))
    if not mp3.exists():
        raise SystemExit("no audio/music.mp3 (run `music` without --no-generate, or put a track there)")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "48000", "-ac", "2", str(wav)], check=True)
    print("music -> audio/music.wav")
