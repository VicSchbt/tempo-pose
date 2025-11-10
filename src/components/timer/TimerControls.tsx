import { useStore } from '@/store';
import type { TimerPreset } from '@/store/timer.slice';
import type { TimerPresetId } from '@/types/core';

const PRESETS: { id: TimerPresetId; label: string; seconds: TimerPreset | null }[] = [
  { id: '30s', label: '30s', seconds: 30 },
  { id: '60s', label: '1m', seconds: 60 },
  { id: '2m', label: '2m', seconds: 120 },
  { id: '5m', label: '5m', seconds: 300 },
  { id: 'custom', label: 'Custom', seconds: null },
];

export default function TimerControls() {
  const preset = useStore((s) => s.preset);
  const setPreset = useStore((s) => s.setPreset);
  const customSeconds = useStore((s) => s.customSeconds);
  const setCustomSeconds = useStore((s) => s.setCustomSeconds);

  // Derived
  const totalSeconds = preset !== null ? preset : (customSeconds ?? 0);

  const handlePresetChange = (value: string) => {
    const selected = PRESETS.find((p) => p.id === value);
    if (!selected) return;

    if (selected.seconds === null) {
      setPreset(null);
    } else {
      // ✅ Type-safe: selected.seconds is of type TimerPreset
      setPreset(selected.seconds);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        className="rounded border px-2 py-1"
        value={preset === null ? 'custom' : `${preset}s`}
        onChange={(e) => handlePresetChange(e.target.value)}
        aria-label="Timer preset"
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      {preset === null && (
        <input
          type="number"
          min={5}
          step={5}
          className="w-24 rounded border px-2 py-1"
          value={customSeconds ?? ''}
          onChange={(e) => setCustomSeconds(Number(e.target.value || 0))}
          aria-label="Custom seconds"
        />
      )}

      <span className="text-muted-foreground text-sm">Total: {totalSeconds}s</span>
    </div>
  );
}
