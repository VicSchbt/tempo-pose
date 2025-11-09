import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shuffleArray } from '@/lib/shuffle';
import type { ImageRef, SessionStatus, TimerPresetId } from '@/types/core';

// ---------- Images slice ----------
type ImagesState = {
  images: ImageRef[];
};
type ImagesActions = {
  addImages: (imgs: ImageRef[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
};
type ImagesSlice = ImagesState & ImagesActions;

// ---------- Timer slice ----------
type TimerState = {
  preset: TimerPresetId;
  customSeconds: number; // used when preset === 'custom'
  // derived helper: current seconds
  getDurationSeconds: () => number;
};
type TimerActions = {
  setPreset: (p: TimerPresetId) => void;
  setCustomSeconds: (s: number) => void;
};
type TimerSlice = TimerState & TimerActions;

// ---------- Session slice ----------
type SessionState = {
  status: SessionStatus;
  // A shuffled deck of indexes so we never repeat until exhausting the set
  deck: number[]; // indexes into images[]
  pointer: number; // current position in deck
  currentIndex: number | null; // convenience
  cycle: number; // how many full passes we’ve completed
};
type SessionActions = {
  buildDeck: () => void; // shuffle fresh deck from images
  start: () => void; // build deck if needed, move to first image
  pause: () => void;
  resume: () => void;
  stop: () => void; // reset status & pointer, keep images
  next: () => void; // move to next image; reshuffle when deck ends
};
type SessionSlice = SessionState & SessionActions;

// ---------- Root store ----------
type RootStore = ImagesSlice & TimerSlice & SessionSlice;

export const useStore = create<RootStore>()(
  persist(
    (set, get) => ({
      // --- Images ---
      images: [],
      addImages: (imgs) => set((s) => ({ images: [...s.images, ...imgs.filter((i) => !!i.url)] })),
      removeImage: (id) =>
        set((s) => {
          const next = s.images.filter((img) => img.id !== id);
          // if we removed the currently shown image, session should rebuild deck soon
          return { images: next };
        }),
      clearImages: () => set({ images: [] }),

      // --- Timer ---
      preset: '60s',
      customSeconds: 90,
      setPreset: (p) => set({ preset: p }),
      setCustomSeconds: (s) => set({ customSeconds: Math.max(5, Math.floor(s)) }),
      getDurationSeconds: () => {
        const { preset, customSeconds } = get();
        switch (preset) {
          case '30s':
            return 30;
          case '60s':
            return 60;
          case '2m':
            return 120;
          case '5m':
            return 300;
          case 'custom':
          default:
            return customSeconds;
        }
      },

      // --- Session ---
      status: 'idle',
      deck: [],
      pointer: -1,
      currentIndex: null,
      cycle: 0,

      buildDeck: () => {
        const images = get().images;
        const n = images.length;
        const prevCurrent = get().currentIndex;
        if (n === 0) {
          set({ deck: [], pointer: -1, currentIndex: null });
          return;
        }
        // create shuffled deck of [0..n-1]
        let deck = shuffleArray(Array.from({ length: n }, (_, i) => i));
        // small UX touch: avoid repeating the last image at cycle boundary
        if (prevCurrent != null && n > 1 && deck[0] === prevCurrent) {
          deck = shuffleArray(deck);
        }
        set({ deck, pointer: -1 });
      },

      start: () => {
        const { images, buildDeck } = get();
        if (images.length === 0) {
          set({ status: 'idle', currentIndex: null, pointer: -1, deck: [] });
          return;
        }
        buildDeck();
        const { deck } = get();
        const pointer = 0;
        set({
          status: 'running',
          pointer,
          currentIndex: deck[pointer] ?? null,
        });
      },

      pause: () => {
        if (get().status === 'running') set({ status: 'paused' });
      },

      resume: () => {
        if (get().status === 'paused') set({ status: 'running' });
      },

      stop: () => {
        set({ status: 'idle', pointer: -1, currentIndex: null, cycle: 0 });
      },

      next: () => {
        const { deck, pointer, images } = get();
        if (images.length === 0) {
          set({ status: 'idle', pointer: -1, currentIndex: null });
          return;
        }
        // If we have no deck yet (e.g., first run), start builds it
        if (deck.length === 0 || pointer === -1) {
          get().start();
          return;
        }
        // Advance pointer
        let p = pointer + 1;
        if (p >= deck.length) {
          // reshuffle for a new cycle
          const cycle = get().cycle + 1;
          get().buildDeck();
          const fresh = get().deck;
          set({ pointer: 0, currentIndex: fresh[0] ?? null, cycle });
        } else {
          set({ pointer: p, currentIndex: deck[p] ?? null });
        }
      },
    }),
    {
      name: 'tempo-pose-store',
      // Persist only small, stable preferences (NOT image blobs/urls)
      partialize: (state) => ({
        preset: state.preset,
        customSeconds: state.customSeconds,
      }),
    },
  ),
);
