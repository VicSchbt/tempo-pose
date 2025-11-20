import type { ImageItem, SessionEndReason, SessionSummary } from '@/types/core';
import type { StateCreator } from 'zustand';
import { shuffleArray } from '@/lib/shuffle';
import { prefersReducedSound } from '@/utils/prefersReducedSound';

export type SessionState = {
  sessionQueue: string[]; // queue of image IDs for the current session (TEMPO-34)
  ptr: number; // pointer into 'sessionQueue' (TEMPO-36)
  isActive: boolean;
  sessionStartTime: number | null;
  sessionSummary: SessionSummary | null;

  // settings
  avoidRepeatUntilExhausted: boolean;
  isMuted: boolean;

  // clock state (TEMPO-39, TEMPO-40)
  isPaused: boolean;
  intervalStartTime: number | null; // Date.now() when current interval started
  elapsedMs: number; // elapsed time in current interval (0 to intervalDurationMs)

  // actions
  startSession: (images: ImageItem[]) => boolean; // returns true if session started, false if empty (TEMPO-35)
  next: () => void;
  prev: () => void;
  endSession: (reason?: SessionEndReason) => void;
  setAvoidRepeat: (v: boolean) => void;
  toggleMute: () => void;
  pauseSession: () => void; // TEMPO-40
  resumeSession: () => void; // TEMPO-40
  resetInterval: () => void; // TEMPO-39: reset interval clock
  updateElapsed: (elapsedMs: number) => void; // TEMPO-39: update elapsed time
};

const finalizeSessionState = (state: SessionState, reason: SessionEndReason) => {
  const endedAt = Date.now();
  const startedAt = state.sessionStartTime ?? endedAt;
  const plannedImages = state.sessionQueue.length;
  const imagesShown = Math.max(0, Math.min(state.ptr + 1, plannedImages));

  const summary: SessionSummary = {
    imagesShown,
    startedAt,
    endedAt,
    durationMs: Math.max(0, endedAt - startedAt),
    reason,
  };

  return {
    isActive: false,
    sessionQueue: [],
    ptr: 0,
    isPaused: false,
    intervalStartTime: null,
    elapsedMs: 0,
    sessionStartTime: null,
    sessionSummary: summary,
  };
};

export const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  sessionQueue: [],
  ptr: 0,
  isActive: false,
  sessionStartTime: null,
  sessionSummary: null,
  avoidRepeatUntilExhausted: true,
  isMuted: false,
  isPaused: false,
  intervalStartTime: null,
  elapsedMs: 0,

  // TEMPO-35: On Start: derive queue from current images; guard empty state
  startSession: (images) => {
    const validImages = images.filter((img) => img.status === 'ok');

    if (validImages.length === 0) {
      return false; // Guard empty state
    }

    // TEMPO-34: Implement Fisher-Yates shuffle → sessionQueue (array of ids)
    const ids = validImages.map((i) => i.id);
    const shuffledQueue = shuffleArray(ids);

    set(
      {
        sessionQueue: shuffledQueue,
        ptr: 0,
        isActive: true,
        sessionStartTime: Date.now(),
        sessionSummary: null,
        isPaused: false,
        isMuted: prefersReducedSound(), // Respect OS "reduce sound" preference
        intervalStartTime: Date.now(),
        elapsedMs: 0,
      },
      false,
      'session/startSession',
    );

    return true;
  },

  next: () =>
    set(
      (state) => {
        if (!state.isActive || state.sessionQueue.length === 0) return state;

        const isLastImage = state.ptr >= state.sessionQueue.length - 1;

        if (isLastImage) {
          return finalizeSessionState(state, 'completed');
        }

        const idx = state.ptr + 1;
        return {
          ptr: idx,
          intervalStartTime: Date.now(),
          elapsedMs: 0,
        };
      },
      false,
      'session/next',
    ),

  prev: () =>
    set(
      (state) => {
        if (!state.isActive || state.sessionQueue.length === 0) return state;
        const idx = (state.ptr - 1 + state.sessionQueue.length) % state.sessionQueue.length;
        return {
          ptr: idx,
          intervalStartTime: Date.now(),
          elapsedMs: 0,
        };
      },
      false,
      'session/prev',
    ),

  endSession: (reason = 'manual') =>
    set((state) => finalizeSessionState(state, reason), false, 'session/stop'),

  setAvoidRepeat: (v) => set({ avoidRepeatUntilExhausted: v }, false, 'session/setAvoidRepeat'),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted }), false, 'session/toggleMute'),

  pauseSession: () =>
    set(
      (state) => {
        // Update elapsedMs one final time before pausing for accuracy
        // (elapsedMs is already being updated by the tick, but this ensures
        // we capture the exact moment of pause)
        if (state.intervalStartTime !== null) {
          const now = Date.now();
          const elapsed = now - state.intervalStartTime;
          return {
            isPaused: true,
            elapsedMs: elapsed,
          };
        }
        return { isPaused: true };
      },
      false,
      'session/pause',
    ),

  resumeSession: () =>
    set(
      (state) => {
        // Adjust intervalStartTime to account for elapsed time
        const now = Date.now();
        const adjustedStartTime = now - state.elapsedMs;
        return {
          isPaused: false,
          intervalStartTime: adjustedStartTime,
        };
      },
      false,
      'session/resume',
    ),

  resetInterval: () =>
    set(
      {
        intervalStartTime: Date.now(),
        elapsedMs: 0,
      },
      false,
      'session/resetInterval',
    ),

  updateElapsed: (elapsedMs) => set({ elapsedMs }, false, 'session/updateElapsed'),
});
