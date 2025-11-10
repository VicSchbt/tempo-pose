import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { type ImagesSlice, createImagesSlice } from './images.slice';
import { type TimerState, createTimerSlice } from './timer.slice';
import { type SessionState, createSessionSlice } from './session.slice';

export type AppStore = ImagesSlice & TimerState & SessionState;

// Persist only what makes sense across reloads (images list often shouldn’t be,
// because Object URLs die after refresh). We’ll persist timer settings and session prefs.
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (set, get, api) => ({
        // build all slices in a single object
        ...createImagesSlice(set as any, get as any, api as any),
        ...createTimerSlice(set as any, get as any, api as any),
        ...createSessionSlice(set as any, get as any, api as any),
      }),
      {
        name: 'gesture-app',
        storage: createJSONStorage(() => localStorage),
        // Persist only a subset
        partialize: (state: AppStore) => ({
          // Do NOT persist images: object URLs won’t survive reloads
          preset: state.preset,
          customSeconds: state.customSeconds,
          avoidRepeatUntilExhausted: state.avoidRepeatUntilExhausted,
        }),
        version: 1,
        // In case you need future migrations:
        // migrate: (persisted, version) => persisted,
      },
    ),
  ),
);
