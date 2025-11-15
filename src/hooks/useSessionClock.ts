import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { resolveTimerDurationMs } from '@/lib/timer';
import type { TimerPresetId } from '@/types/core';

/**
 * Hook for managing session clock with drift-safe timing.
 * Uses Date.now() baseline to prevent drift from setInterval delays.
 * 
 * TEMPO-39: Build session clock with setInterval and drift-safe tick (Date.now baseline)
 * TEMPO-42: Ensure cleanup of interval on unmount/end
 */
export function useSessionClock() {
  const isActive = useStore((s) => s.isActive);
  const isPaused = useStore((s) => s.isPaused);
  const intervalStartTime = useStore((s) => s.intervalStartTime);
  const preset = useStore((s) => s.preset);
  const customSeconds = useStore((s) => s.customSeconds);
  const updateElapsed = useStore((s) => s.updateElapsed);
  const next = useStore((s) => s.next);

  const intervalRef = useRef<number | null>(null);

  // Get interval duration in milliseconds
  const getIntervalDurationMs = (): number => {
    // Map TimerPreset to TimerPresetId for resolveTimerDurationMs
    const presetId: TimerPresetId =
      preset === 30
        ? '30s'
        : preset === 60
          ? '60s'
          : preset === 120
            ? '2m'
            : preset === 300
              ? '5m'
              : 'custom';
    return resolveTimerDurationMs(presetId, customSeconds);
  };

  useEffect(() => {
    // Only run if session is active and has a start time
    if (!isActive || intervalStartTime === null) {
      // Cleanup if session is not active
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const intervalDurationMs = getIntervalDurationMs();

    // Drift-safe tick function using Date.now() as baseline
    const tick = () => {
      if (isPaused || intervalStartTime === null) {
        return;
      }

      const now = Date.now();
      const elapsed = now - intervalStartTime;
      const remaining = intervalDurationMs - elapsed;

      // Update elapsed time in store (clamped to 0..intervalDurationMs)
      updateElapsed(Math.max(0, Math.min(elapsed, intervalDurationMs)));

      // Check if interval has completed
      if (remaining <= 0) {
        // Auto-advance to next image
        // The next() action will reset intervalStartTime and elapsedMs
        next();
      }
    };

    // Use setInterval with frequent checks (every 100ms for smooth progress updates)
    // The actual advancement is based on Date.now() comparison, not interval count
    // This makes it drift-safe because we always compare against the absolute time
    intervalRef.current = window.setInterval(tick, 100);

    // Cleanup function
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, intervalStartTime, preset, customSeconds, updateElapsed, next]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
}

