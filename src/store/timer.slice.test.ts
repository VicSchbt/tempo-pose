import { describe, expect, it } from 'vitest';
import type { TimerPreset } from './timer.slice';
import { getDurationMsFromConfig } from './timer.slice';

describe('getDurationMsFromConfig', () => {
  it('uses the preset (seconds) when preset is set', () => {
    const preset: TimerPreset = 30;
    const customSeconds = 999; // should be ignored

    const result = getDurationMsFromConfig(preset, customSeconds);

    expect(result).toBe(30 * 1000);
  });

  it('supports all defined presets', () => {
    const presets: TimerPreset[] = [15, 30, 60, 90, 120, 300];

    presets.forEach((p) => {
      const result = getDurationMsFromConfig(p, null);
      expect(result).toBe(p * 1000);
    });
  });

  it('falls back to customSeconds when preset is null', () => {
    const preset = null;
    const customSeconds = 45;

    const result = getDurationMsFromConfig(preset, customSeconds);

    expect(result).toBe(45 * 1000);
  });

  it('falls back to default preset (60s) when both are null', () => {
    const preset = null;
    const customSeconds = null;

    const result = getDurationMsFromConfig(preset, customSeconds);

    // DEFAULT_PRESET is 60 in timer.slice.ts
    expect(result).toBe(60 * 1000);
  });

  it('treats 0 customSeconds as 0s when preset is null (current behavior)', () => {
    const preset = null;
    const customSeconds = 0;

    const result = getDurationMsFromConfig(preset, customSeconds);

    expect(result).toBe(0);
  });
});
