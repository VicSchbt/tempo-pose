import { useStore } from '@/store';
import type { TimerPresetId } from '@/types/core';

const PRESETS: { id: TimerPresetId; label: string }[] = [
  { id: '30s', label: '30s' },
  { id: '60s', label: '1m' },
  { id: '2m', label: '2m' },
  { id: '5m', label: '5m' },
  { id: 'custom', label: 'Custom' },
];

export default function TimerControls() {
  const preset = useStore((s) => s.preset);
  const setPreset = useStore((s) => s.setPreset);
  const customSeconds = useStore((s) => s.customSeconds);
  const setCustomSeconds = useStore((s) => s.setCustomSeconds);
  const getDurationSeconds = useStore((s) => s.getDurationSeconds);

  return (
    <div className="flex items-center gap-3">
      <select
        className="rounded border px-2 py-1"
        value={preset}
        onChange={(e) => setPreset(e.target.value as TimerPresetId)}
        aria-label="Timer preset"
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      {preset === 'custom' && (
        <input
          type="number"
          min={5}
          step={5}
          className="w-24 rounded border px-2 py-1"
          value={customSeconds}
          onChange={(e) => setCustomSeconds(Number(e.target.value || 0))}
          aria-label="Custom seconds"
        />
      )}

      <span className="text-muted-foreground text-sm">Total: {getDurationSeconds()}s</span>
    </div>
  );
}
