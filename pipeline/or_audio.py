"""OpenRouter audio: verbatim TTS (gpt-audio family) and music (Lyria). Stdlib only (urllib).

The API key comes from OPENROUTER_API_KEY, or from the first .env found in the project folder or its parents,
then in the engine folder (format: OPENROUTER_API_KEY=... ; spaces around = are fine).
"""
import base64
import json
import os
import re
import sys
import urllib.request
import wave
from pathlib import Path

API = "https://openrouter.ai/api/v1/chat/completions"
ENGINE = Path(__file__).resolve().parent.parent


def api_key(project_root=None):
    key = os.environ.get("OPENROUTER_API_KEY")
    if key:
        return key.strip()
    starts = ([Path(project_root).resolve()] if project_root else []) + [ENGINE]
    for start in starts:
        for d in [start, *start.parents]:
            env = d / ".env"
            if env.exists():
                for line in env.read_text(encoding="utf-8").splitlines():
                    if "=" in line and line.split("=", 1)[0].strip() == "OPENROUTER_API_KEY":
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("OPENROUTER_API_KEY not found in the environment or any .env above the project")


def _stream(payload, key, timeout=600):
    req = urllib.request.Request(API, data=json.dumps(payload).encode("utf-8"),
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    audio_b64, transcript, text = [], [], []
    with urllib.request.urlopen(req, timeout=timeout) as r:
        for raw in r:
            line = raw.decode("utf-8", "replace").strip()
            if not line.startswith("data:"):
                continue
            data = line[5:].strip()
            if data == "[DONE]":
                break
            try:
                ev = json.loads(data)
            except json.JSONDecodeError:
                continue
            if "error" in ev:
                raise RuntimeError(ev["error"])
            for ch in ev.get("choices", []):
                d = ch.get("delta", {}) or {}
                a = d.get("audio") or {}
                if a.get("data"):
                    audio_b64.append(a["data"])
                if a.get("transcript"):
                    transcript.append(a["transcript"])
                if d.get("content"):
                    text.append(d["content"])
    return b"".join(base64.b64decode(c) for c in audio_b64), "".join(transcript), "".join(text)


TTS_SYSTEM = (
    "You are a text-to-speech engine, not an assistant. You never answer, explain, "
    "or continue anything. You only speak aloud the exact text found between "
    "<script> and </script>, word for word, then stop. "
    "Voice direction: {style}"
)


def _words(s):
    return re.findall(r"[a-z0-9]+", s.lower().replace("’", "'"))


def tts(text, out_wav, *, voice, style, model, fallback_model, key, tries=6):
    """Speak `text` verbatim into a 24 kHz mono WAV. The transcript is checked word for word; half the tries use
    `model`, the rest `fallback_model` (the full gpt-audio model follows the read-only instruction most reliably)."""
    payload = {
        "model": model,
        "modalities": ["text", "audio"],
        "audio": {"voice": voice, "format": "pcm16"},
        "stream": True,
        "temperature": 0.6,
        "messages": [
            {"role": "system", "content": TTS_SYSTEM.format(style=style)},
            # few-shot: the model otherwise keeps explaining after reading the line
            {"role": "user", "content": "<script>What makes the sky blue? Sunlight scatters.</script>"},
            {"role": "assistant", "content": "What makes the sky blue? Sunlight scatters."},
            {"role": "user", "content": "<script>Gravity pulls everything down. But why?</script>"},
            {"role": "assistant", "content": "Gravity pulls everything down. But why?"},
            {"role": "user", "content": f"<script>{text}</script>"},
        ],
    }
    want = _words(text)
    models = [model] * (tries // 2) + [fallback_model] * (tries - tries // 2)
    for attempt, m in enumerate(models):
        payload["model"] = m
        try:
            pcm, transcript, _ = _stream(payload, key)
        except Exception as e:  # transient network / provider errors
            print(f"  retry {attempt + 1} ({m}): {e}", file=sys.stderr)
            continue
        if pcm and _words(transcript) == want:
            break
        print(f"  retry {attempt + 1} ({m}): transcript mismatch -> {transcript[:100]!r}", file=sys.stderr)
    else:
        raise RuntimeError(f"TTS never matched script: {text[:80]!r}")
    with wave.open(str(out_wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(24000)
        w.writeframes(pcm)
    return transcript


def music(prompt, out_path, *, model, key):
    """Generate music with Lyria via OpenRouter; writes whatever container it returns (mp3)."""
    payload = {"model": model, "modalities": ["text", "audio"], "stream": True,
               "messages": [{"role": "user", "content": prompt}]}
    audio, _, text = _stream(payload, key, timeout=900)
    if not audio:
        raise RuntimeError(f"no audio returned; text={text[:200]!r}")
    Path(out_path).write_bytes(audio)
    return text
