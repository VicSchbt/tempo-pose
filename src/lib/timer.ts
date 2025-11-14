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
