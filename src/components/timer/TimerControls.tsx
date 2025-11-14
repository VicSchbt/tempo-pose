import { useStore } from '@/store';
import type { TimerPreset } from '@/store/timer.slice';
import type { TimerPresetId } from '@/types/core';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { TimerHelpTooltip } from './TimerHelpTooltip';

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

  // Which preset is currently selected?
  const selectedId: TimerPresetId =
    preset === null ? 'custom' : (PRESETS.find((p) => p.seconds === preset)?.id ?? 'custom');

  const totalSeconds = preset ?? customSeconds ?? 0;

  const handlePresetClick = (id: TimerPresetId) => {
    const selected = PRESETS.find((p) => p.id === id);
    if (!selected) return;

    if (selected.seconds === null) {
      // Switch to custom mode
      setPreset(null);
      // keep existing customSeconds value
    } else {
      // Use fixed preset from the union type TimerPreset
      setPreset(selected.seconds);
      // Optional: clear custom if you don’t want it to linger
      // setCustomSeconds(null);
    }
  };

  const handleCustomChange = (value: string) => {
    if (value === '') {
      setCustomSeconds(null);
      return;
    }
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    setCustomSeconds(n);
  };

  return (
    <section aria-label="Timer controls" className="flex w-full flex-col gap-3">
      <header className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 id="timer-section-title" className="text-xl font-semibold">
            Timer
          </h2>
        </div>

        {/* Tooltip with “image advances every X seconds” */}
        <TimerHelpTooltip />
      </header>
      <div
        role="radiogroup"
        aria-label="Timer presets"
        className="flex flex-wrap items-center gap-2"
      >
        {PRESETS.map((p) => {
          const isSelected = selectedId === p.id;
          return (
            <Button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={p.label}
              onClick={() => handlePresetClick(p.id)}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className="min-w-[3rem]"
            >
              {p.label}
            </Button>
          );
        })}
      </div>

      {selectedId === 'custom' && (
        <div className="flex items-center gap-2">
          <Label htmlFor="custom-seconds" className="text-muted-foreground text-sm">
            Custom (seconds)
          </Label>
          <Input
            id="custom-seconds"
            type="number"
            min={5}
            step={5}
            className="w-24"
            value={customSeconds ?? ''}
            onChange={(e) => handleCustomChange(e.target.value)}
            aria-label="Custom seconds"
          />
        </div>
      )}

      <span className="text-muted-foreground text-sm">
        Total: <span className="font-medium">{totalSeconds}</span>s
      </span>
    </section>
  );
}
