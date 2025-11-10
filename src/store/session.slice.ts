import type { ImageItem } from '@/types/core';
import type { StateCreator } from 'zustand';

export type SessionState = {
  order: string[]; // queue of image IDs for the current session
  currentIndex: number; // pointer into 'order'
  isActive: boolean;

  // settings
  avoidRepeatUntilExhausted: boolean;

  // actions
  initFromImages: (images: ImageItem[], shuffle: boolean) => void;
  next: () => void;
  prev: () => void;
  stopSession: () => void;
  setAvoidRepeat: (v: boolean) => void;
};

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set, get) => ({
  order: [],
  currentIndex: 0,
  isActive: false,
  avoidRepeatUntilExhausted: true,

  initFromImages: (images, doShuffle) =>
    set(
      () => {
        const ids = images.map((i) => i.id);
        const base = doShuffle ? shuffle(ids) : ids;
        return {
          order: base,
          currentIndex: 0,
          isActive: base.length > 0,
        };
      },
      false,
      'session/initFromImages',
    ),

  next: () =>
    set(
      (state) => {
        if (!state.isActive || state.order.length === 0) return state;

        let idx = state.currentIndex + 1;

        if (idx >= state.order.length) {
          // Exhausted once — either wrap or reshuffle to avoid immediate repeats
          if (state.avoidRepeatUntilExhausted) {
            const reshuffled = shuffle(state.order);
            return { order: reshuffled, currentIndex: 0 };
          }
          idx = 0; // simple wrap
        }
        return { currentIndex: idx };
      },
      false,
      'session/next',
    ),

  prev: () =>
    set(
      (state) => {
        if (!state.isActive || state.order.length === 0) return state;
        const idx = (state.currentIndex - 1 + state.order.length) % state.order.length;
        return { currentIndex: idx };
      },
      false,
      'session/prev',
    ),

  stopSession: () => set({ isActive: false, order: [], currentIndex: 0 }, false, 'session/stop'),

  setAvoidRepeat: (v) => set({ avoidRepeatUntilExhausted: v }, false, 'session/setAvoidRepeat'),
});
