"""WAV in/out at the project sample rate and the music duck envelope (from project-2-expt/reel/mix.py)."""
import wave

import numpy as np
from scipy import signal

SR = 48000


def read(p):
    """Any 16-bit WAV -> float32 stereo at SR."""
    with wave.open(str(p)) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch).astype(np.float32) / 32768
    if sr != SR:
        a = signal.resample_poly(a, SR, sr, axis=0).astype(np.float32)
    if a.shape[1] == 1:
        a = np.repeat(a, 2, 1)
    return a


def write(p, a):
    """float stereo -> 16-bit stereo WAV at SR."""
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())


def read_mono(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768, w.getframerate()


def write_mono(p, a, sr):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())


def duck_env(vo, total, duck_db):
    """Per-sample music gain: 1 when the voice is silent, 10^(duck_db/20) while it speaks (fast attack, slow release)."""
    duck = 10 ** (duck_db / 20)
    hop = 480
    mono = np.abs(vo[:, 0])
    n = len(mono) // hop
    rms = np.sqrt((mono[: n * hop].reshape(n, hop) ** 2).mean(1))
    active = (rms > 0.01).astype(np.float32)
    active = np.convolve(active, np.ones(25), "same") > 0
    g = np.where(active, duck, 1.0).astype(np.float32)
    out = np.empty_like(g)
    cur = 1.0
    for i, x in enumerate(g):
        k = 0.35 if x < cur else 0.04
        cur += (x - cur) * k
        out[i] = cur
    env = np.interp(np.arange(total), np.arange(len(out)) * hop, out).astype(np.float32)
    return env[:, None]
