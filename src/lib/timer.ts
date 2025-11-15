import type { TimerPresetId } from '@/types/core';

/**
 * Fixed mapping for non-custom presets.
 * Keeping this in one place makes it easy to reuse + test.
 */
export const PRESET_SECONDS: Record<Exclude<TimerPresetId, 'custom'>, number> = {
  '30s': 30,
  '60s': 60,
  '2m': 120,
  '5m': 300,
};

/**
 * Resolve the number of seconds for the current preset.
 * - For fixed presets, we ignore customSeconds and return the fixed value.
 * - For "custom", we fall back to 60s if no value is provided.
 * - We clamp to at least 1s to avoid a 0 / negative timer.
 */
export function resolveTimerSeconds(
  preset: TimerPresetId,
  customSeconds: number | null | undefined,
): number {
  if (preset === 'custom') {
    const value = customSeconds ?? 60; // sensible default
    return Math.max(1, value);
  }

  return PRESET_SECONDS[preset];
}

/**
 * Same as above, but expressed directly in milliseconds for the timer engine.
 */
export function resolveTimerDurationMs(
  preset: TimerPresetId,
  customSeconds: number | null | undefined,
): number {
  return resolveTimerSeconds(preset, customSeconds) * 1000;
}

/**
 * Converts seconds to mm:ss format
 * @param totalSeconds - Total seconds to format
 * @returns Formatted time string (e.g., "4:30" for 270 seconds)
 */
export function formatTimeFromSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Parses mm:ss format to total seconds
 * @param timeString - Time string in mm:ss format (e.g., "4:30", "0:30")
 * @returns Total seconds, or null if invalid format
 */
export function parseTimeToSeconds(timeString: string): number | null {
  const trimmed = timeString.trim();

  // Allow empty string
  if (trimmed === '') {
    return null;
  }

  // Match format: optional minutes, colon, seconds (e.g., "4:30", "04:30", "0:30")
  const match = trimmed.match(/^(\d+):(\d{1,2})$/);
  if (!match) {
    return null;
  }

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  // Validate seconds are 0-59
  if (seconds < 0 || seconds > 59) {
    return null;
  }

  // Validate minutes are non-negative
  if (minutes < 0) {
    return null;
  }

  const totalSeconds = minutes * 60 + seconds;
  return totalSeconds;
}
