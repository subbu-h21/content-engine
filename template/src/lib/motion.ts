/** Easing and envelope helpers, mirrored from the Python toolkit so the port is frame-accurate. */

export const clamp = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smooth = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const expoOut = (t: number): number => {
  const x = clamp(t);
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export const easeOut = (t: number, p = 3): number => 1 - Math.pow(1 - clamp(t), p);

/** 0..1 progress of a window starting at `start` lasting `dur` seconds. */
export const prog = (t: number, start: number, dur = 0.6): number => (dur > 0 ? clamp((t - start) / dur) : t >= start ? 1 : 0);

/** Envelope that fades in at `start` and out at `end` (seconds). */
export const window = (t: number, start: number, end: number, fadeIn = 0.4, fadeOut = 0.4): number => {
  const a = fadeIn > 0 ? smooth((t - start) / fadeIn) : t >= start ? 1 : 0;
  const b = fadeOut > 0 ? 1 - smooth((t - (end - fadeOut)) / fadeOut) : t < end ? 1 : 0;
  return clamp(Math.min(a, b));
};

/** Fade-out multiplier: 1 before `at`, falling to 0 over `dur`. */
export const fadeOutAt = (t: number, at: number | undefined, dur = 0.35): number => (at === undefined ? 1 : 1 - expoOut((t - at) / dur));
