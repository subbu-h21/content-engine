"""Procedural sound effects (numpy/scipy), 48 kHz stereo float32. All deterministic."""
import numpy as np
from scipy import signal

SR = 48000


def _t(d):
    return np.arange(int(d * SR)) / SR


def _env(n, a, r, curve=2.0):
    """attack fraction a, release fraction r (of n samples)."""
    e = np.ones(n, np.float32)
    na, nr = max(1, int(n * a)), max(1, int(n * r))
    e[:na] = np.linspace(0, 1, na) ** curve
    e[-nr:] *= np.linspace(1, 0, nr) ** curve
    return e


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def _sweep_bp(x, f0, f1, q=1.2, steps=64):
    """Band-pass with centre frequency gliding f0 -> f1 (piecewise, overlap-added)."""
    n = len(x)
    out = np.zeros(n, np.float32)
    seg = n // steps + 1
    win = np.hanning(2 * seg)
    for i in range(steps):
        fc = f0 * (f1 / f0) ** (i / max(steps - 1, 1))
        lo, hi = fc / (1 + 1 / q), fc * (1 + 1 / q)
        hi = min(hi, SR / 2 * 0.95)
        sos = signal.butter(2, [lo, hi], "bandpass", fs=SR, output="sos")
        s0 = max(0, i * seg - seg // 2)
        s1 = min(n, s0 + 2 * seg)
        y = signal.sosfilt(sos, x[s0:s1])
        out[s0:s1] += y * win[: s1 - s0]
    return out


def _pan(mono, p0=0.0, p1=0.0):
    """constant-power pan from p0 to p1 (-1 left .. 1 right)."""
    p = np.linspace(p0, p1, len(mono))
    ang = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(ang), mono * np.sin(ang)], 1).astype(np.float32)


def _norm(x, peak=0.9):
    m = np.abs(x).max() + 1e-9
    return x / m * peak


def whoosh(d=0.7, f0=500, f1=2600, seed=1, pan=(-0.6, 0.6)):
    n = int(d * SR)
    x = _sweep_bp(_noise(n, seed), f0, f1, 1.0)
    e = np.exp(-((np.linspace(0, 1, n) - 0.55) / 0.22) ** 2)
    return _pan(_norm(x * e), *pan)


def whoosh_long():
    return whoosh(1.4, 300, 2200, 2, (-0.8, 0.8))


def swish():
    return whoosh(0.32, 1500, 6000, 3, (0.4, -0.4)) * 0.7


def sweep():
    n = int(0.8 * SR)
    x = _sweep_bp(_noise(n, 4), 700, 5000, 2.0)
    return _pan(_norm(x * _env(n, 0.6, 0.3)) * 0.6)


def sweep_low():
    n = int(0.8 * SR)
    x = _sweep_bp(_noise(n, 5), 2500, 350, 2.0)
    return _pan(_norm(x * _env(n, 0.3, 0.5)) * 0.6)


def air():
    n = int(2.5 * SR)
    sos = signal.butter(2, [150, 1200], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, _noise(n, 6)) * (0.8 + 0.2 * np.sin(_t(2.5) * 2 * np.pi * 1.3))
    return _pan(_norm(x * _env(n, 0.4, 0.4)) * 0.5, 0.5, -0.5)


def impact():
    t = _t(1.6)
    f = 70 * np.exp(-t * 2.5) + 38
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    click = signal.sosfilt(signal.butter(2, 3000, "highpass", fs=SR, output="sos"), _noise(len(t), 7)) * np.exp(-t * 60) * 0.5
    tail = signal.sosfilt(signal.butter(2, 900, "lowpass", fs=SR, output="sos"), _noise(len(t), 8)) * np.exp(-t * 4) * 0.25
    return _pan(_norm(body + click + tail))


def thud():
    t = _t(0.4)
    f = 110 * np.exp(-t * 18) + 55
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
    click = signal.sosfilt(signal.butter(2, 2000, "highpass", fs=SR, output="sos"), _noise(len(t), 9)) * np.exp(-t * 120) * 0.6
    return _pan(_norm(body + click) * 0.9)


def tick():
    t = _t(0.09)
    x = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 70) + 0.4 * np.sin(2 * np.pi * 5200 * t) * np.exp(-t * 110)
    return _pan(_norm(x) * 0.5)


def lock():
    a = tick()
    out = np.zeros((int(0.25 * SR), 2), np.float32)
    out[: len(a)] += a
    t = _t(0.09)
    b = np.sin(2 * np.pi * 3400 * t) * np.exp(-t * 70)
    out[int(0.12 * SR):int(0.12 * SR) + len(b)] += _pan(_norm(b) * 0.5)
    return out


def net():
    n = int(0.7 * SR)
    sos = signal.butter(2, [400, 3500], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, _noise(n, 10)) * np.exp(-np.linspace(0, 6, n))
    out = _pan(_norm(x) * 0.6)
    th = thud()
    out[: len(th)] += th * 0.5
    return out


def spin_up():
    t = _t(1.3)
    f = 160 + 520 * (t / t[-1]) ** 1.5
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(4 + 22 * t / t[-1]) / SR)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR) * 0.15
    air_ = _sweep_bp(_noise(len(t), 11), 800, 4000, 2.0) * 0.5
    x = (tone + air_) * trem * _env(len(t), 0.7, 0.25)
    return _pan(_norm(x) * 0.55)


def shimmer():
    t = _t(1.8)
    rng = np.random.default_rng(12)
    x = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * rng.uniform(0.3, 1) for f in (1568, 2093, 2637, 3136, 3951))
    x = x * _env(len(t), 0.25, 0.6) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * t))
    return _pan(_norm(x) * 0.25, -0.3, 0.3)


def riser():
    n = int(0.9 * SR)
    x = _sweep_bp(_noise(n, 13), 400, 7000, 3.0)
    t = _t(0.9)
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * (t / t[-1]) ** 2) / SR) * 0.3
    return _pan(_norm((x + tone) * np.linspace(0, 1, n) ** 2.5) * 0.6)


KINDS = {k: v for k, v in globals().items() if k in (
    "whoosh", "whoosh_long", "swish", "sweep", "sweep_low", "air", "impact", "thud", "tick", "lock", "net",
    "spin_up", "shimmer", "riser")}

# a riser should *end* on its event time
LEAD = {"riser": 0.9}

_cache = {}


def get(kind):
    if kind not in _cache:
        fn = KINDS.get(kind)
        _cache[kind] = fn() if fn else None
    return _cache[kind]


def buzz(d=0.36):
    """Phone vibration on a table: 180 Hz motor with AM and a bit of rattle."""
    t = _t(d)
    n = len(t)
    motor = np.sign(np.sin(2 * np.pi * 180 * t)) * 0.5 + np.sin(2 * np.pi * 180 * t) * 0.5
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 14 * t))
    rattle = _noise(n, 11) * 0.25
    sos = signal.butter(2, [120, 3200], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, (motor * am + rattle * am)).astype(np.float32)
    return _pan(_norm(x * _env(n, 0.03, 0.25)) * 0.5, 0.2, 0.2)


def pulse(d=0.28, f=110):
    """Soft low thump for a signal landing."""
    t = _t(d)
    n = len(t)
    x = np.sin(2 * np.pi * (f * t - 30 * t ** 2)) * np.exp(-t * 14)
    return _pan(_norm(x.astype(np.float32)) * 0.6)


def hum_in(d=1.6):
    """Low airy swell for a reveal."""
    t = _t(d)
    n = len(t)
    x = _noise(n, 21)
    sos = signal.butter(2, [60, 420], "bandpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, x).astype(np.float32)
    return _pan(_norm(x * _env(n, 0.55, 0.4)) * 0.45, -0.3, 0.3)


KINDS.update({"buzz": buzz, "pulse": pulse, "hum_in": hum_in})
