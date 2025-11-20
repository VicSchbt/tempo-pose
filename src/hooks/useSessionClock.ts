import { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { resolveTimerDurationMs } from '@/lib/timer';
import type { TimerPresetId } from '@/types/core';
import { playDingSound, createTickingSoundManager } from '@/utils/audio';

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
  const isMuted = useStore((s) => s.isMuted);
  const intervalStartTime = useStore((s) => s.intervalStartTime);
  const preset = useStore((s) => s.preset);
  const customSeconds = useStore((s) => s.customSeconds);
  const updateElapsed = useStore((s) => s.updateElapsed);
  const next = useStore((s) => s.next);

  const intervalRef = useRef<number | null>(null);
  const tickingManagerRef = useRef<ReturnType<typeof createTickingSoundManager> | null>(null);
  const tickingStartedRef = useRef<boolean>(false);
  const tickingPausedRef = useRef<boolean>(false);

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

  // Initialize ticking sound manager
  useEffect(() => {
    if (!tickingManagerRef.current) {
      tickingManagerRef.current = createTickingSoundManager();
    }
    return () => {
      // Cleanup ticking sound on unmount
      if (tickingManagerRef.current) {
        tickingManagerRef.current.stopTicking();
      }
    };
  }, []);

  // Update mute state in ticking manager
  useEffect(() => {
    if (tickingManagerRef.current) {
      tickingManagerRef.current.setMuted(isMuted);
    }
  }, [isMuted]);

  // Reset ticking state when interval changes
  useEffect(() => {
    if (!isActive || intervalStartTime === null) {
      // Stop ticking when session is inactive or no interval
      if (tickingManagerRef.current) {
        tickingManagerRef.current.stopTicking();
      }
      tickingStartedRef.current = false;
      tickingPausedRef.current = false;
      return;
    }

    // Reset ticking state when a new interval starts
    tickingStartedRef.current = false;
    tickingPausedRef.current = false;
    if (tickingManagerRef.current) {
      tickingManagerRef.current.stopTicking();
    }
  }, [isActive, intervalStartTime]);

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
        // Pause ticking if session is paused and ticking is playing
        if (tickingManagerRef.current && tickingStartedRef.current && !tickingPausedRef.current) {
          tickingManagerRef.current.pauseTicking();
          tickingPausedRef.current = true;
        }
        return;
      }

      const now = Date.now();
      const elapsed = now - intervalStartTime;
      const remaining = intervalDurationMs - elapsed;
      const remainingSeconds = remaining / 1000;

      // Update elapsed time in store (clamped to 0..intervalDurationMs)
      updateElapsed(Math.max(0, Math.min(elapsed, intervalDurationMs)));

      // Start ticking sound when 5 seconds or less remain
      const TICKING_DURATION_SECONDS = 5;
      if (remainingSeconds <= TICKING_DURATION_SECONDS) {
        if (!tickingStartedRef.current) {
          // Start ticking for the first time
          if (tickingManagerRef.current) {
            tickingManagerRef.current.startTicking(isMuted);
            tickingStartedRef.current = true;
            tickingPausedRef.current = false;
          }
        } else if (tickingPausedRef.current) {
          // Resume ticking if it was paused
          if (tickingManagerRef.current) {
            tickingManagerRef.current.resumeTicking(isMuted);
            tickingPausedRef.current = false;
          }
        }
      } else if (remainingSeconds > TICKING_DURATION_SECONDS && tickingStartedRef.current) {
        // Stop ticking if we're back above 5 seconds (shouldn't happen, but safety check)
        if (tickingManagerRef.current) {
          tickingManagerRef.current.stopTicking();
          tickingStartedRef.current = false;
          tickingPausedRef.current = false;
        }
      }

      // Check if interval has completed
      if (remaining <= 0) {
        // Stop ticking sound before playing ding
        if (tickingManagerRef.current) {
          tickingManagerRef.current.stopTicking();
        }
        tickingStartedRef.current = false;
        tickingPausedRef.current = false;
        // Play ding sound when timer expires
        playDingSound(isMuted);
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
  }, [isActive, isPaused, isMuted, intervalStartTime, preset, customSeconds, updateElapsed, next]);

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
