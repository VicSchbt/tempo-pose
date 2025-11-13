import type { StateCreator } from 'zustand';

export type TimerPreset = 15 | 30 | 60 | 90 | 120 | 300; // seconds (example)

// Choose a nice default preset (in seconds)
const DEFAULT_PRESET: TimerPreset = 60;

export type TimerState = {
  // configuration
  preset: TimerPreset | null;
  customSeconds: number | null;

  // runtime (simple, UI-driven)
  isRunning: boolean;
  remaining: number; // seconds

  // actions
  setPreset: (p: TimerPreset | null) => void;
  setCustomSeconds: (sec: number | null) => void;
  start: (seconds?: number) => void;
  stop: () => void;
  tick: (deltaSec: number) => void; // let a component drive this with requestAnimationFrame or setInterval
  reset: () => void;
};

export const createTimerSlice: StateCreator<
  TimerState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  TimerState
> = (set, get) => ({
  preset: DEFAULT_PRESET,
  customSeconds: null,

  isRunning: false,
  remaining: 60,

  setPreset: (p) =>
    set(
      () => ({
        preset: p,
        customSeconds: null,
        remaining: p ?? 0,
      }),
      false,
      'timer/setPreset',
    ),

  setCustomSeconds: (sec) =>
    set(
      () => ({
        preset: null,
        customSeconds: sec,
        remaining: sec ?? 0,
      }),
      false,
      'timer/setCustomSeconds',
    ),

  start: (seconds) =>
    set(
      (state) => ({
        isRunning: true,
        remaining:
          typeof seconds === 'number' ? seconds : (state.preset ?? state.customSeconds ?? 0),
      }),
      false,
      'timer/start',
    ),

  stop: () => set({ isRunning: false }, false, 'timer/stop'),

  tick: (delta) =>
    set(
      (state) => ({
        remaining: Math.max(0, state.remaining - delta),
        isRunning: state.remaining - delta > 0 ? state.isRunning : false,
      }),
      false,
      'timer/tick',
    ),

  reset: () =>
    set(
      (state) => ({
        isRunning: false,
        remaining: state.preset ?? state.customSeconds ?? 0,
      }),
      false,
      'timer/reset',
    ),

  getDurationMs: () => {
    const { preset, customSeconds } = get();
    const seconds = preset ?? customSeconds ?? DEFAULT_PRESET;
    return seconds * 1000;
  },
});
