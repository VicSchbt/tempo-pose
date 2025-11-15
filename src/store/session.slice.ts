import type { ImageItem } from '@/types/core';
import type { StateCreator } from 'zustand';
import { shuffleArray } from '@/lib/shuffle';

export type SessionState = {
  sessionQueue: string[]; // queue of image IDs for the current session (TEMPO-34)
  ptr: number; // pointer into 'sessionQueue' (TEMPO-36)
  isActive: boolean;

  // settings
  avoidRepeatUntilExhausted: boolean;

  // actions
  startSession: (images: ImageItem[]) => boolean; // returns true if session started, false if empty (TEMPO-35)
  next: () => void;
  prev: () => void;
  stopSession: () => void;
  setAvoidRepeat: (v: boolean) => void;
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
  avoidRepeatUntilExhausted: true,

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

        let idx = state.ptr + 1;

        if (idx >= state.sessionQueue.length) {
          // Exhausted once — either wrap or reshuffle to avoid immediate repeats
          if (state.avoidRepeatUntilExhausted) {
            const reshuffled = shuffleArray(state.sessionQueue);
            return { sessionQueue: reshuffled, ptr: 0 };
          }
          idx = 0; // simple wrap
        }
        return { ptr: idx };
      },
      false,
      'session/next',
    ),

  prev: () =>
    set(
      (state) => {
        if (!state.isActive || state.sessionQueue.length === 0) return state;
        const idx = (state.ptr - 1 + state.sessionQueue.length) % state.sessionQueue.length;
        return { ptr: idx };
      },
      false,
      'session/prev',
    ),

  stopSession: () => set({ isActive: false, sessionQueue: [], ptr: 0 }, false, 'session/stop'),

  setAvoidRepeat: (v) => set({ avoidRepeatUntilExhausted: v }, false, 'session/setAvoidRepeat'),
});
